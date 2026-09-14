import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { API_BASE_URL } from '@/test/msw/handlers/catalog';
import { authHandlers, authResponse, user } from '@/test/msw/handlers/auth';
import { authService } from './authService';
import { HttpError } from './api/httpClient';

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', API_BASE_URL);
  server.use(...authHandlers);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('authService', () => {
  it('registers and returns the new session', async () => {
    const result = await authService.register({ email: 'nuevo@example.com', password: 'correct horse battery staple', fullName: 'Nuevo' });
    expect(result).toEqual(authResponse);
  });

  it('throws a 409 HttpError when the email is already registered', async () => {
    await expect(
      authService.register({ email: 'ya-existe@example.com', password: 'correct horse battery staple', fullName: 'X' }),
    ).rejects.toMatchObject({ status: 409 });
  });

  it('logs in with the right credentials', async () => {
    const result = await authService.login({ email: user.email, password: 'correct horse battery staple' });
    expect(result).toEqual(authResponse);
  });

  it('throws a 401 HttpError on the wrong password', async () => {
    await expect(authService.login({ email: user.email, password: 'wrong' })).rejects.toBeInstanceOf(HttpError);
    await expect(authService.login({ email: user.email, password: 'wrong' })).rejects.toMatchObject({ status: 401 });
  });

  it('logout tolerates an empty 200 response body', async () => {
    await expect(authService.logout()).resolves.toBeUndefined();
  });

  it('sends the access token as a Bearer header to /auth/me', async () => {
    const result = await authService.me(authResponse.accessToken);
    expect(result).toEqual(user);
  });

  it('rejects /auth/me without a valid Bearer token', async () => {
    await expect(authService.me('not-a-real-token')).rejects.toMatchObject({ status: 401 });
  });
});
