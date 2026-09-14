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
   * successful login/register or by `dismissLogoutError`. */
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
   * than having to remember to catch. */
  logout: () => Promise<void>;
  dismissLogoutError: () => void;
}

/** Every exported action here stamps and checks a shared, monotonically increasing sequence
 * number before calling `set`, so a slower call that started earlier can never overwrite a
 * faster one that started later -- e.g. bootstrap()'s refresh(), fired on mount, resolving
 * *after* a user has since logged in (or out) must not clobber that newer, real outcome. This
 * isn't optional bookkeeping: bootstrap and login/register/logout genuinely do race in normal use
 * (bootstrap always fires once on load; a fast visitor can submit a login before it resolves). */
let opSeq = 0;

/** `accessToken` deliberately lives only in memory, in this store -- never in localStorage,
 * sessionStorage, or any zustand `persist` middleware. That's the closed design (Fase 2): the
 * refresh token in an httpOnly cookie is what survives a reload; the access token doesn't need
 * to, since `bootstrap` re-derives a fresh one from that cookie every time the app starts cold. */
export const useSessionStore = create<SessionState>((set) => ({
  status: 'checking',
  user: null,
  accessToken: null,
  logoutError: null,

  bootstrap: async () => {
    const seq = ++opSeq;
    try {
      const auth = await authService.refresh();
      if (seq !== opSeq) return;
      set({ status: 'authenticated', user: auth.user ?? null, accessToken: auth.accessToken ?? null });
    } catch (err) {
      if (seq !== opSeq) return;
      // A confirmed 401 means the backend looked and there's no valid session -- only that
      // outcome is really "anonymous". Anything else (network down, 5xx, CORS misconfig) is
      // "couldn't tell", which must not be presented the same way.
      if (err instanceof HttpError && err.status === 401) {
        set({ status: 'anonymous', user: null, accessToken: null });
      } else {
        set({ status: 'unavailable', user: null, accessToken: null });
      }
    }
  },

  login: async (email, password) => {
    const seq = ++opSeq;
    const auth = await authService.login({ email, password });
    if (seq !== opSeq) return;
    set({ status: 'authenticated', user: auth.user ?? null, accessToken: auth.accessToken ?? null, logoutError: null });
  },

  register: async (email, password, fullName) => {
    const seq = ++opSeq;
    const auth = await authService.register({ email, password, fullName });
    if (seq !== opSeq) return;
    set({ status: 'authenticated', user: auth.user ?? null, accessToken: auth.accessToken ?? null, logoutError: null });
  },

  logout: async () => {
    const seq = ++opSeq;
    try {
      await authService.logout();
      if (seq !== opSeq) return;
      set({ status: 'anonymous', user: null, accessToken: null, logoutError: null });
    } catch {
      if (seq !== opSeq) return;
      set({
        status: 'anonymous',
        user: null,
        accessToken: null,
        logoutError: 'No pudimos confirmar el cierre de sesión con el servidor. Tu sesión en este dispositivo se cerró igual.',
      });
    }
  },

  dismissLogoutError: () => set({ logoutError: null }),
}));

/** `login`/`register` throw `HttpError` for the specific statuses the UI must distinguish (401
 * generic-credentials-error, 409 email-already-registered) -- re-exported here so pages don't
 * need to import from `services/api/httpClient` directly just to `instanceof`-check it. */
export { HttpError };
