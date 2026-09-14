import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { API_BASE_URL } from '@/test/msw/handlers/catalog';
import { authHandlers } from '@/test/msw/handlers/auth';
import { useSessionStore } from '@/store/sessionStore';
import { RegisterPage } from './RegisterPage';

function renderRegisterPage(initialPath = '/crear-cuenta') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/crear-cuenta" element={<RegisterPage />} />
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

describe('RegisterPage', () => {
  it('registers and redirects to the default destination', async () => {
    renderRegisterPage();

    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Nuevo Cliente');
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'nuevo@example.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'correct horse battery staple');
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    await waitFor(() => expect(screen.getByText('Página de cuenta')).toBeInTheDocument());
  });

  it('orients to login instead of revealing account details when the email is already registered', async () => {
    renderRegisterPage();

    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Alguien');
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'ya-existe@example.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'correct horse battery staple');
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Ya existe una cuenta con ese correo. Intenta ingresar en su lugar.');
  });

  it('has no RUT, confirm-password, or marketing-consent field', () => {
    renderRegisterPage();

    expect(screen.queryByLabelText(/rut/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/confirmar contraseña/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/promocion/i)).not.toBeInTheDocument();
  });

  it('blocks submitting an empty form client-side instead of reaching the backend', async () => {
    // Blocked here by the inputs' own `required` attribute (no `noValidate` disabling it).
    let requestCount = 0;
    server.use(
      http.post(`${API_BASE_URL}/auth/register`, () => {
        requestCount += 1;
        return new HttpResponse(null, { status: 400 });
      }),
    );
    renderRegisterPage();

    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(requestCount).toBe(0);
  });

  it('blocks a too-short password client-side instead of reaching the backend', async () => {
    // This is the page's own explicit length check doing the work, not the `minLength={12}`
    // attribute: found (while testing this PR in a real browser) that native constraint
    // validation on submit-button activation didn't reliably fire in every automation context
    // tested, so the fix couldn't rely on the attribute alone -- confirmed here directly, since
    // jsdom's `checkValidity()` doesn't implement `tooShort` at all (a too-short value always
    // reports valid), which would otherwise make this test pass for the wrong reason.
    let requestCount = 0;
    server.use(
      http.post(`${API_BASE_URL}/auth/register`, () => {
        requestCount += 1;
        return new HttpResponse(null, { status: 400 });
      }),
    );
    renderRegisterPage();

    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Alguien');
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'alguien@example.com');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'corta1');
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    expect(requestCount).toBe(0);
    expect(await screen.findByRole('alert')).toHaveTextContent('La contraseña debe tener al menos 12 caracteres.');
  });

  it('carries a sanctioned returnTo forward onto the "Ingresar" link', () => {
    renderRegisterPage('/crear-cuenta?returnTo=%2Fcheckout%2Fdireccion');

    expect(screen.getByRole('link', { name: 'Ingresar' })).toHaveAttribute('href', '/ingresar?returnTo=%2Fcheckout%2Fdireccion');
  });

  it('links plainly to /ingresar when there is no returnTo', () => {
    renderRegisterPage();

    expect(screen.getByRole('link', { name: 'Ingresar' })).toHaveAttribute('href', '/ingresar');
  });
});
