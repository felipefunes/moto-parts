import { create } from 'zustand';
import { authService, type UserSummary } from '@/services/authService';
import { HttpError } from '@/services/api/httpClient';

/** `unavailable` is distinct from `anonymous`: it means bootstrap couldn't reach the backend at
 * all (network/5xx), not that the backend confirmed there's no session. Treating the two the same
 * would log a visitor with a perfectly valid session cookie out of the UI (and, behind
 * RequireSession, bounce them to /ingresar) just because a request timed out once. */
export type SessionStatus = 'checking' | 'authenticated' | 'anonymous' | 'unavailable';

interface SessionState {
  status: SessionStatus;
  user: UserSummary | null;
  accessToken: string | null;
  /** Set only when `logout()`'s remote call fails -- the UI must not present that as a normal,
   * confirmed logout (see the UX spec's "Logout fallido por red" case). Cleared on the next
   * successful login/register/logout, or by `dismissLogoutError`. */
  logoutError: string | null;
  /** Exchanges the httpOnly refresh cookie for a session on load, so a page reload doesn't bounce
   * an already-logged-in visitor to `/ingresar`. Never persisted to localStorage on purpose (see
   * `accessToken`'s own doc) -- this is the one place that re-derives it from the cookie. */
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  /** Always clears local session state, even if the server call fails -- a network failure here
   * must not leave the UI claiming the user is still logged in on this device. Never rejects:
   * failure is reported through `logoutError` instead, so every caller gets it "for free" rather
   * than having to remember to catch. Safe to call again to retry a failed remote logout -- it
   * doesn't depend on any client-held token, only whatever refresh cookie the browser still has. */
  logout: () => Promise<void>;
  dismissLogoutError: () => void;
}

/** Every `/auth/*` call that can write the refresh cookie (bootstrap's refresh, login, register,
 * logout) runs through this queue, one at a time, in call order -- never two in flight together.
 *
 * A first version of this store instead stamped each call with a sequence number and discarded a
 * stale one's *store* update if a newer call had since started. That protects Zustand's state,
 * but not the browser's cookie jar: the browser applies a response's Set-Cookie the moment that
 * response arrives, before any of this file's JS runs, and jjwt/fetch give this code no way to
 * unwrite a cookie a stale response already wrote. Concretely: bootstrap's refresh() for a
 * lingering session A is slow; a visitor logs in as B while it's still in flight; bootstrap's
 * response for A finally lands and the browser overwrites B's just-set cookie with A's, even
 * though the sequence-number guard correctly kept the *store* showing B -- the UI and the cookie
 * jar now disagree, and a reload resurrects A. Backend confirms both routes write the exact same
 * cookie name/path (`AuthController`'s `refreshCookie`), so this is a real collision, not a
 * theoretical one -- refresh() failing outright makes it worse, since that path clears the cookie
 * outright rather than merely writing a different one.
 *
 * Serializing closes this at the root instead of reacting to it after the fact: by the time any
 * of these calls sends its own request, every earlier one has already fully landed -- response,
 * Set-Cookie, and all -- so there's never a second in-flight request whose later arrival could
 * undo it. This also happens to fix a second bug the sequence-number version introduced: a
 * bootstrap that's still pending when a login/register attempt fails no longer gets its own
 * (correct, deciding) result discarded as "stale" -- there's nothing to discard, because bootstrap
 * always finishes and sets a real status before the next queued call even starts. */
let sessionQueue: Promise<unknown> = Promise.resolve();

function enqueueSessionOperation<T>(operation: () => Promise<T>): Promise<T> {
  const result = sessionQueue.then(operation, operation);
  // The shared queue must always advance regardless of whether `operation` succeeded -- only
  // `result` (returned below, to this call's own caller) carries the real outcome. If a rejection
  // propagated into `sessionQueue` itself, every operation enqueued after it would be skipped.
  sessionQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

/** `accessToken` deliberately lives only in memory, in this store -- never in localStorage,
 * sessionStorage, or any zustand `persist` middleware. That's the closed design (Fase 2): the
 * refresh token in an httpOnly cookie is what survives a reload; the access token doesn't need
 * to, since `bootstrap` re-derives a fresh one from that cookie every time the app starts cold. */
export const useSessionStore = create<SessionState>((set) => {
  // Tracks a bootstrap already in flight so a second caller (e.g. a fast remount) joins the same
  // request/queue slot instead of enqueueing a redundant extra one.
  let inFlightBootstrap: Promise<void> | null = null;

  return {
    status: 'checking',
    user: null,
    accessToken: null,
    logoutError: null,

    bootstrap: () => {
      if (!inFlightBootstrap) {
        inFlightBootstrap = enqueueSessionOperation(async () => {
          try {
            const auth = await authService.refresh();
            set({ status: 'authenticated', user: auth.user ?? null, accessToken: auth.accessToken ?? null });
          } catch (err) {
            // A confirmed 401 means the backend looked and there's no valid session -- only that
            // outcome is really "anonymous". Anything else (network down, 5xx, CORS misconfig) is
            // "couldn't tell", which must not be presented the same way.
            if (err instanceof HttpError && err.status === 401) {
              set({ status: 'anonymous', user: null, accessToken: null });
            } else {
              set({ status: 'unavailable', user: null, accessToken: null });
            }
          }
        }).finally(() => {
          inFlightBootstrap = null;
        });
      }
      return inFlightBootstrap;
    },

    login: (email, password) =>
      enqueueSessionOperation(async () => {
        const auth = await authService.login({ email, password });
        set({ status: 'authenticated', user: auth.user ?? null, accessToken: auth.accessToken ?? null, logoutError: null });
      }),

    register: (email, password, fullName) =>
      enqueueSessionOperation(async () => {
        const auth = await authService.register({ email, password, fullName });
        set({ status: 'authenticated', user: auth.user ?? null, accessToken: auth.accessToken ?? null, logoutError: null });
      }),

    logout: () =>
      enqueueSessionOperation(async () => {
        try {
          await authService.logout();
          set({ status: 'anonymous', user: null, accessToken: null, logoutError: null });
        } catch {
          set({
            status: 'anonymous',
            user: null,
            accessToken: null,
            logoutError:
              'No pudimos confirmar el cierre de sesión con el servidor. Saliste de tu cuenta en este navegador, pero la sesión podría seguir activa -- reintenta para confirmar que quedó cerrada.',
          });
        }
      }),

    dismissLogoutError: () => set({ logoutError: null }),
  };
});

/** `login`/`register` throw `HttpError` for the specific statuses the UI must distinguish (401
 * generic-credentials-error, 409 email-already-registered) -- re-exported here so pages don't
 * need to import from `services/api/httpClient` directly just to `instanceof`-check it. */
export { HttpError };
