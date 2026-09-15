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

  it('never has two /auth/* requests in flight at once, even when a login is triggered while bootstrap is still pending', async () => {
    // This is the actual mechanism that closes the cookie race a pure-JS sequence-number guard
    // couldn't: the browser applies a response's Set-Cookie the instant that response arrives,
    // before any of this file's code runs, so nothing done *after the fact* in JS can undo a
    // stale response's cookie write. The only real fix is making sure a stale response is never
    // still in flight to arrive "after" a newer one -- i.e. never two of these requests
    // in flight together. Proven directly here by counting concurrent handler invocations,
    // since this test environment has no real browser cookie jar to observe the effect on.
    let inFlight = 0;
    let maxConcurrent = 0;
    let resolveRefresh: (() => void) | undefined;
    server.use(
      http.post(`${API_BASE_URL}/auth/refresh`, () => {
        inFlight += 1;
        maxConcurrent = Math.max(maxConcurrent, inFlight);
        return new Promise((resolve) => {
          resolveRefresh = () => {
            inFlight -= 1;
            resolve(new HttpResponse(null, { status: 401 }));
          };
        });
      }),
      http.post(`${API_BASE_URL}/auth/login`, () => {
        inFlight += 1;
        maxConcurrent = Math.max(maxConcurrent, inFlight);
        inFlight -= 1;
        return HttpResponse.json(authResponse);
      }),
    );

    const bootstrapPromise = useSessionStore.getState().bootstrap();
    const loginPromise = useSessionStore.getState().login(user.email, 'correct horse battery staple');
    // Waits (rather than assuming a fixed number of microtask ticks) for MSW's interception to
    // actually have invoked the handler and captured `resolveRefresh` -- how many ticks that takes
    // isn't something this test should need to know.
    await vi.waitFor(() => expect(resolveRefresh).toBeDefined());
    resolveRefresh?.();
    await bootstrapPromise;
    await loginPromise;

    expect(maxConcurrent).toBe(1);
    expect(useSessionStore.getState()).toMatchObject({
      status: 'authenticated',
      user,
      accessToken: authResponse.accessToken,
    });
  });

  it('a login that fails while bootstrap is still pending does not leave the store stuck in checking', async () => {
    // Regression in the previous (sequence-number) version of this fix: a failed login/register
    // never itself sets a final status (by design -- the page's own error handling owns that), but
    // it used to also poison the sequence number bootstrap's own, correct, deciding update was
    // guarded behind -- so bootstrap's result got discarded as "stale" too, leaving nothing to ever
    // move `status` off of 'checking'. Serializing instead of sequence-stamping means bootstrap
    // always fully finishes (setting a real status) before a subsequently-called login even starts.
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
    const loginPromise = useSessionStore.getState().login(user.email, 'wrong password');
    await vi.waitFor(() => expect(resolveRefresh).toBeDefined());
    resolveRefresh?.();
    await bootstrapPromise;
    await expect(loginPromise).rejects.toBeTruthy();

    expect(useSessionStore.getState().status).toBe('anonymous');
  });

  it('a register that fails (409) while bootstrap is still pending does not leave the store stuck in checking', async () => {
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
    const registerPromise = useSessionStore.getState().register('ya-existe@example.com', 'correct horse battery staple', 'X');
    await vi.waitFor(() => expect(resolveRefresh).toBeDefined());
    resolveRefresh?.();
    await bootstrapPromise;
    await expect(registerPromise).rejects.toBeTruthy();

    expect(useSessionStore.getState().status).toBe('anonymous');
  });

  it('a slow bootstrap that would resurrect a session runs to completion before a subsequent logout starts, so logout wins', async () => {
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
    const logoutPromise = useSessionStore.getState().logout();
    await vi.waitFor(() => expect(resolveRefresh).toBeDefined());
    resolveRefresh?.(authResponse);
    await bootstrapPromise;
    await logoutPromise;

    expect(useSessionStore.getState()).toMatchObject({ status: 'anonymous', user: null, accessToken: null });
  });

  it('retrying a failed logout succeeds once the server call goes through, clearing logoutError', async () => {
    useSessionStore.setState({ status: 'authenticated', user, accessToken: authResponse.accessToken });
    server.use(http.post(`${API_BASE_URL}/auth/logout`, () => new HttpResponse(null, { status: 500 })));
    await useSessionStore.getState().logout();
    expect(useSessionStore.getState().logoutError).not.toBeNull();

    server.use(http.post(`${API_BASE_URL}/auth/logout`, () => new HttpResponse(null, { status: 200 })));
    await useSessionStore.getState().logout();

    expect(useSessionStore.getState()).toMatchObject({ status: 'anonymous', user: null, accessToken: null, logoutError: null });
  });
});
