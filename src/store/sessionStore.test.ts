import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { API_BASE_URL } from '@/test/msw/handlers/catalog';
import { authHandlers, authResponse, user } from '@/test/msw/handlers/auth';
import { useSessionStore } from './sessionStore';

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', API_BASE_URL);
  server.use(...authHandlers);
  useSessionStore.setState({ status: 'checking', user: null, accessToken: null, logoutError: null });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('useSessionStore', () => {
  it('bootstrap resolves to anonymous when the backend confirms there is no refresh cookie (401)', async () => {
    await useSessionStore.getState().bootstrap();

    expect(useSessionStore.getState()).toMatchObject({ status: 'anonymous', user: null, accessToken: null });
  });

  it('bootstrap resolves to unavailable (not anonymous) when the backend can\'t be reached at all', async () => {
    server.use(http.post(`${API_BASE_URL}/auth/refresh`, () => new HttpResponse(null, { status: 500 })));

    await useSessionStore.getState().bootstrap();

    expect(useSessionStore.getState()).toMatchObject({ status: 'unavailable', user: null, accessToken: null });
  });

  it('login moves the store to authenticated with the returned user and token', async () => {
    await useSessionStore.getState().login(user.email, 'correct horse battery staple');

    expect(useSessionStore.getState()).toMatchObject({
      status: 'authenticated',
      user,
      accessToken: authResponse.accessToken,
    });
  });

  it('login rejects and leaves the store untouched on wrong credentials', async () => {
    await expect(useSessionStore.getState().login(user.email, 'wrong')).rejects.toBeTruthy();

    expect(useSessionStore.getState().status).toBe('checking');
  });

  it('register moves the store to authenticated', async () => {
    await useSessionStore.getState().register('nuevo@example.com', 'correct horse battery staple', 'Nuevo');

    expect(useSessionStore.getState()).toMatchObject({ status: 'authenticated', user, accessToken: authResponse.accessToken });
  });

  it('logout clears local state even though the store never had a chance to succeed remotely first', async () => {
    useSessionStore.setState({ status: 'authenticated', user, accessToken: authResponse.accessToken });

    await useSessionStore.getState().logout();

    expect(useSessionStore.getState()).toMatchObject({ status: 'anonymous', user: null, accessToken: null, logoutError: null });
  });

  it('logout never rejects, and reports a failed remote call through logoutError instead of pretending it succeeded', async () => {
    useSessionStore.setState({ status: 'authenticated', user, accessToken: authResponse.accessToken });
    server.use(http.post(`${API_BASE_URL}/auth/logout`, () => new HttpResponse(null, { status: 500 })));

    await expect(useSessionStore.getState().logout()).resolves.toBeUndefined();

    const state = useSessionStore.getState();
    expect(state).toMatchObject({ status: 'anonymous', user: null, accessToken: null });
    expect(state.logoutError).toMatch(/no pudimos confirmar el cierre de sesión/i);
  });

  it('dismissLogoutError clears the message', async () => {
    useSessionStore.setState({ logoutError: 'algo' });

    useSessionStore.getState().dismissLogoutError();

    expect(useSessionStore.getState().logoutError).toBeNull();
  });

  it('a slow bootstrap that resolves after a login must not overwrite the newer, authenticated state', async () => {
    // Simulates the real-world race: bootstrap() fires on every page load and calls /auth/refresh,
    // which for a visitor who isn't logged in yet returns 401 -- but if that response is merely
    // *slow*, and the visitor logs in before it arrives, the late 401 must not flip a freshly
    // authenticated store back to anonymous.
    let resolveRefresh: (() => void) | undefined;
    server.use(
      http.post(
        `${API_BASE_URL}/auth/refresh`,
        () =>
          new Promise((resolve) => {
            resolveRefresh = () => resolve(new HttpResponse(null, { status: 401 }));
          }),
      ),
    );

    const bootstrapPromise = useSessionStore.getState().bootstrap();
    await useSessionStore.getState().login(user.email, 'correct horse battery staple');
    expect(useSessionStore.getState().status).toBe('authenticated');

    resolveRefresh?.();
    await bootstrapPromise;

    expect(useSessionStore.getState()).toMatchObject({
      status: 'authenticated',
      user,
      accessToken: authResponse.accessToken,
    });
  });

  it('a slow bootstrap that resolves after a logout must not resurrect the session', async () => {
    let resolveRefresh: ((auth: typeof authResponse) => void) | undefined;
    server.use(
      http.post(
        `${API_BASE_URL}/auth/refresh`,
        () =>
          new Promise((resolve) => {
            resolveRefresh = (auth) => resolve(HttpResponse.json(auth));
          }),
      ),
    );
    useSessionStore.setState({ status: 'authenticated', user, accessToken: authResponse.accessToken });

    const bootstrapPromise = useSessionStore.getState().bootstrap();
    await useSessionStore.getState().logout();
    expect(useSessionStore.getState().status).toBe('anonymous');

    resolveRefresh?.(authResponse);
    await bootstrapPromise;

    expect(useSessionStore.getState()).toMatchObject({ status: 'anonymous', user: null, accessToken: null });
  });
});
