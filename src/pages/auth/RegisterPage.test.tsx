import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { API_BASE_URL } from '@/test/msw/handlers/catalog';
import { authHandlers } from '@/test/msw/handlers/auth';
import { useSessionStore } from '@/store/sessionStore';
import { RegisterPage } from './RegisterPage';

function renderRegisterPage() {
  return render(
    <MemoryRouter initialEntries={['/crear-cuenta']}>
      <Routes>
        <Route path="/crear-cuenta" element={<RegisterPage />} />
        <Route path="/mi-cuenta" element={<div>Página de cuenta</div>} />
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
});
