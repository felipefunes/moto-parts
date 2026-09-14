import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { API_BASE_URL } from '@/test/msw/handlers/catalog';
import { authHandlers, authResponse, user } from '@/test/msw/handlers/auth';
import { useSessionStore } from './sessionStore';

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', API_BASE_URL);
  server.use(...authHandlers);
  useSessionStore.setState({ status: 'checking', user: null, accessToken: null });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('useSessionStore', () => {
  it('bootstrap resolves to anonymous when there is no refresh cookie', async () => {
    await useSessionStore.getState().bootstrap();

    expect(useSessionStore.getState()).toMatchObject({ status: 'anonymous', user: null, accessToken: null });
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

    expect(useSessionStore.getState()).toMatchObject({ status: 'anonymous', user: null, accessToken: null });
  });

  it('logout still clears local state when the server call fails', async () => {
    useSessionStore.setState({ status: 'authenticated', user, accessToken: authResponse.accessToken });
    server.use(http.post(`${API_BASE_URL}/auth/logout`, () => new HttpResponse(null, { status: 500 })));

    await expect(useSessionStore.getState().logout()).rejects.toBeTruthy();

    expect(useSessionStore.getState()).toMatchObject({ status: 'anonymous', user: null, accessToken: null });
  });
});
