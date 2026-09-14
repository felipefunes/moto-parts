import { getJsonWithInit, postJson } from './api/httpClient';
import type { components } from './api/generated/types';

export type RegisterRequest = components['schemas']['RegisterRequest'];
export type LoginRequest = components['schemas']['LoginRequest'];
export type AuthResponse = components['schemas']['AuthResponse'];
export type UserSummary = components['schemas']['UserSummaryResponse'];

/** Every call here needs `credentials: 'include'`: the refresh token lives in an httpOnly cookie
 * `rpm-parts-backend` sets/reads on `/auth/*`, and the API origin is cross-origin from this app's
 * dev server -- without it, the browser neither stores nor sends that cookie. There's no mock
 * implementation (unlike catalogService): a mocked login would just be inventing accounts, and a
 * real backend for this already exists -- see CONTRIBUTING.md #7 for the pattern this deviates
 * from on purpose. */
export const authService = {
  register: (body: RegisterRequest) => postJson<AuthResponse>('/auth/register', body, { credentials: 'include' }),

  login: (body: LoginRequest) => postJson<AuthResponse>('/auth/login', body, { credentials: 'include' }),

  /** Exchanges the httpOnly refresh cookie for a fresh access token -- used both to silently
   * restore a session on page load (see sessionStore's `bootstrap`) and, later, to renew an
   * about-to-expire access token without forcing a re-login. Throws (a 401 HttpError) when
   * there's no valid cookie, which callers treat as "not logged in," not a failure to report. */
  refresh: () => postJson<AuthResponse>('/auth/refresh', undefined, { credentials: 'include' }),

  logout: () => postJson<void>('/auth/logout', undefined, { credentials: 'include' }),

  me: (accessToken: string) => getJsonWithInit<UserSummary>('/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } }),
};
