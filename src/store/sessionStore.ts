import { create } from 'zustand';
import { authService, type UserSummary } from '@/services/authService';
import { HttpError } from '@/services/api/httpClient';

export type SessionStatus = 'checking' | 'authenticated' | 'anonymous';

interface SessionState {
  status: SessionStatus;
  user: UserSummary | null;
  accessToken: string | null;
  /** Exchanges the httpOnly refresh cookie for a session on load, so a page reload doesn't bounce
   * an already-logged-in visitor to `/ingresar`. Never persisted to localStorage on purpose (see
   * `accessToken`'s own doc) -- this is the one place that re-derives it from the cookie. */
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  /** Clears local session state unconditionally, even if the server call fails -- a network
   * failure here must not leave the UI claiming the user is still logged in on this device (see
   * the UX spec's "Logout fallido por red" case). Rethrows so a caller can still tell the two
   * outcomes apart if it wants to (e.g. warn that the server-side session may still be live). */
  logout: () => Promise<void>;
}

/** `accessToken` deliberately lives only in memory, in this store -- never in localStorage,
 * sessionStorage, or any zustand `persist` middleware. That's the closed design (Fase 2): the
 * refresh token in an httpOnly cookie is what survives a reload; the access token doesn't need
 * to, since `bootstrap` re-derives a fresh one from that cookie every time the app starts cold. */
export const useSessionStore = create<SessionState>((set) => ({
  status: 'checking',
  user: null,
  accessToken: null,

  bootstrap: async () => {
    try {
      const auth = await authService.refresh();
      set({ status: 'authenticated', user: auth.user ?? null, accessToken: auth.accessToken ?? null });
    } catch {
      set({ status: 'anonymous', user: null, accessToken: null });
    }
  },

  login: async (email, password) => {
    const auth = await authService.login({ email, password });
    set({ status: 'authenticated', user: auth.user ?? null, accessToken: auth.accessToken ?? null });
  },

  register: async (email, password, fullName) => {
    const auth = await authService.register({ email, password, fullName });
    set({ status: 'authenticated', user: auth.user ?? null, accessToken: auth.accessToken ?? null });
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ status: 'anonymous', user: null, accessToken: null });
    }
  },
}));

/** `login`/`register` throw `HttpError` for the specific statuses the UI must distinguish (401
 * generic-credentials-error, 409 email-already-registered) -- re-exported here so pages don't
 * need to import from `services/api/httpClient` directly just to `instanceof`-check it. */
export { HttpError };
