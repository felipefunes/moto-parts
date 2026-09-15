import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { API_BASE_URL } from '@/test/msw/handlers/catalog';
import { useSessionStore } from '@/store/sessionStore';
import { AccountMenu } from './AccountMenu';

function renderAccountMenu() {
  return render(
    <MemoryRouter>
      <AccountMenu />
    </MemoryRouter>,
  );
}

describe('AccountMenu', () => {
  it('renders an inert placeholder while bootstrap is still checking the session, not "Mi cuenta"', () => {
    useSessionStore.setState({ status: 'checking', user: null, accessToken: null });

    renderAccountMenu();

    expect(screen.queryByText('Mi cuenta')).not.toBeInTheDocument();
    expect(screen.queryByText(/^Hola,/)).not.toBeInTheDocument();
  });

  it('links to /ingresar when anonymous, with an accessible name even when the visible label is hidden on mobile', () => {
    useSessionStore.setState({ status: 'anonymous', user: null, accessToken: null });

    renderAccountMenu();

    const link = screen.getByRole('link', { name: 'Mi cuenta' });
    expect(link).toHaveAttribute('href', '/ingresar');
  });

  it('offers a retry, not a redirect-shaped link, when bootstrap could not reach the backend', () => {
    useSessionStore.setState({ status: 'unavailable', user: null, accessToken: null });

    renderAccountMenu();

    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Mi cuenta' })).not.toBeInTheDocument();
  });

  it('greets the user by their first name when authenticated, with an accessible name on the trigger', () => {
    useSessionStore.setState({
      status: 'authenticated',
      user: { id: 'u1', email: 'juan@example.com', fullName: 'Juan Pérez', role: 'customer' },
      accessToken: 'token',
    });

    renderAccountMenu();

    expect(screen.getByText('Hola, Juan')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Hola, Juan\. Mi cuenta/ })).toBeInTheDocument();
  });

  it('Escape closes the open dropdown and returns focus to the trigger', async () => {
    useSessionStore.setState({
      status: 'authenticated',
      user: { id: 'u1', email: 'juan@example.com', fullName: 'Juan Pérez', role: 'customer' },
      accessToken: 'token',
    });

    renderAccountMenu();
    const trigger = screen.getByRole('button', { name: /Hola, Juan/ });
    await userEvent.click(trigger);
    expect(screen.getByRole('link', { name: 'Mi cuenta' })).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('link', { name: 'Mi cuenta' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('shows the logout-failed banner (not silence) when logoutError is set, and can be dismissed', async () => {
    useSessionStore.setState({
      status: 'anonymous',
      user: null,
      accessToken: null,
      logoutError: 'No pudimos confirmar el cierre de sesión con el servidor. Saliste de tu cuenta en este navegador, pero la sesión podría seguir activa.',
    });

    renderAccountMenu();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/no pudimos confirmar el cierre de sesión/i);
    expect(alert).toHaveTextContent(/podría seguir activa/i);

    await userEvent.click(screen.getByRole('button', { name: 'Cerrar aviso' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(useSessionStore.getState().logoutError).toBeNull();
  });

  describe('retrying a failed logout', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_API_BASE_URL', API_BASE_URL);
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('offers "Reintentar cierre de sesión", and a successful retry clears the banner', async () => {
      useSessionStore.setState({
        status: 'anonymous',
        user: null,
        accessToken: null,
        logoutError: 'No pudimos confirmar el cierre de sesión con el servidor.',
      });
      server.use(http.post(`${API_BASE_URL}/auth/logout`, () => new HttpResponse(null, { status: 200 })));

      renderAccountMenu();
      await userEvent.click(screen.getByRole('button', { name: 'Reintentar cierre de sesión' }));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(useSessionStore.getState().logoutError).toBeNull();
    });

    it('a retry that fails again keeps the banner visible, not a silent no-op', async () => {
      useSessionStore.setState({
        status: 'anonymous',
        user: null,
        accessToken: null,
        logoutError: 'No pudimos confirmar el cierre de sesión con el servidor.',
      });
      server.use(http.post(`${API_BASE_URL}/auth/logout`, () => new HttpResponse(null, { status: 500 })));

      renderAccountMenu();
      await userEvent.click(screen.getByRole('button', { name: 'Reintentar cierre de sesión' }));

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
