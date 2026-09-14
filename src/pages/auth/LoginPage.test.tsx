import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
});
