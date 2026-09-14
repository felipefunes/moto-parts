import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { API_BASE_URL } from '@/test/msw/handlers/catalog';
import { authHandlers, user } from '@/test/msw/handlers/auth';
import { useSessionStore } from '@/store/sessionStore';
import { LoginPage } from './LoginPage';

function renderLoginPage(initialPath = '/ingresar') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/ingresar" element={<LoginPage />} />
        <Route path="/mi-cuenta" element={<div>Página de cuenta</div>} />
        <Route path="/checkout/direccion" element={<div>Checkout dirección</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', API_BASE_URL);
  server.use(...authHandlers);
  useSessionStore.setState({ status: 'checking', user: null, accessToken: null });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('LoginPage', () => {
  it('logs in with the right credentials and redirects to the default destination', async () => {
    renderLoginPage();

    await userEvent.type(screen.getByLabelText('Correo electrónico'), user.email);
    await userEvent.type(screen.getByLabelText('Contraseña'), 'correct horse battery staple');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => expect(screen.getByText('Página de cuenta')).toBeInTheDocument());
  });

  it('redirects to a sanctioned returnTo instead of the default destination', async () => {
    renderLoginPage('/ingresar?returnTo=%2Fcheckout%2Fdireccion');

    await userEvent.type(screen.getByLabelText('Correo electrónico'), user.email);
    await userEvent.type(screen.getByLabelText('Contraseña'), 'correct horse battery staple');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => expect(screen.getByText('Checkout dirección')).toBeInTheDocument());
  });

  it('ignores an external returnTo and falls back to the default destination', async () => {
    renderLoginPage('/ingresar?returnTo=https%3A%2F%2Fevil.example.com');

    await userEvent.type(screen.getByLabelText('Correo electrónico'), user.email);
    await userEvent.type(screen.getByLabelText('Contraseña'), 'correct horse battery staple');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await waitFor(() => expect(screen.getByText('Página de cuenta')).toBeInTheDocument());
  });

  it('shows a generic error on wrong credentials, without saying which field was wrong', async () => {
    renderLoginPage();

    await userEvent.type(screen.getByLabelText('Correo electrónico'), user.email);
    await userEvent.type(screen.getByLabelText('Contraseña'), 'wrong password');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos ingresar con esos datos. Revisa tu correo y contraseña.');
  });

  it('has no forgot-password link, since the backend has no recovery endpoint yet', () => {
    renderLoginPage();

    expect(screen.queryByText(/olvidaste tu contraseña/i)).not.toBeInTheDocument();
  });

  it('blocks submitting an empty form client-side instead of reaching the backend', async () => {
    // Blocked by the inputs' own `required` attribute here (no `noValidate` disabling it) --
    // without it, an empty submit would hit /auth/login, get a 400 for blank fields, and this
    // page's error handling only has a message for a 401, misreporting the 400 as a connectivity
    // failure. The page also has its own explicit `!email.trim() || !password` check as
    // defense-in-depth (see RegisterPage's equivalent, independently-testable one -- native
    // constraint validation on submit-button activation didn't reliably fire in every real-browser
    // automation context this PR was tested against), but there's no way to reach it through the
    // DOM here specifically: `type="email"` already sanitizes a whitespace-only value down to an
    // empty string, so `required` alone already catches everything this form's fields can produce.
    let requestCount = 0;
    server.use(
      http.post(`${API_BASE_URL}/auth/login`, () => {
        requestCount += 1;
        return new HttpResponse(null, { status: 400 });
      }),
    );
    renderLoginPage();

    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(requestCount).toBe(0);
  });

  it('carries a sanctioned returnTo forward onto the "Crear cuenta" link', () => {
    renderLoginPage('/ingresar?returnTo=%2Fcheckout%2Fdireccion');

    expect(screen.getByRole('link', { name: 'Crear cuenta' })).toHaveAttribute(
      'href',
      '/crear-cuenta?returnTo=%2Fcheckout%2Fdireccion',
    );
  });

  it('links plainly to /crear-cuenta when there is no returnTo', () => {
    renderLoginPage();

    expect(screen.getByRole('link', { name: 'Crear cuenta' })).toHaveAttribute('href', '/crear-cuenta');
  });
});
