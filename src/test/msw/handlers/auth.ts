import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from './catalog';

export const user = {
  id: '969456d8-88e4-4bde-8a1f-9eb59f390130',
  email: 'juan@example.com',
  fullName: 'Juan Pérez',
  role: 'customer',
};

export const authResponse = {
  accessToken: 'fake-access-token',
  expiresInSeconds: 600,
  user,
};

export const authHandlers = [
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as { email: string };
    if (body.email === 'ya-existe@example.com') {
      return new HttpResponse(null, { status: 409 });
    }
    return HttpResponse.json(authResponse, { status: 201 });
  }),

  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.email !== user.email || body.password !== 'correct horse battery staple') {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json(authResponse);
  }),

  http.post(`${API_BASE_URL}/auth/refresh`, () => new HttpResponse(null, { status: 401 })),

  http.post(`${API_BASE_URL}/auth/logout`, () => new HttpResponse(null, { status: 200 })),

  http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
    if (request.headers.get('Authorization') !== `Bearer ${authResponse.accessToken}`) {
      return new HttpResponse(null, { status: 401 });
    }
    return HttpResponse.json(user);
  }),
];
