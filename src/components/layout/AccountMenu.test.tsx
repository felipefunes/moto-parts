import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
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
      logoutError: 'No pudimos confirmar el cierre de sesión con el servidor. Tu sesión en este dispositivo se cerró igual.',
    });

    renderAccountMenu();

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/no pudimos confirmar el cierre de sesión/i);

    await userEvent.click(screen.getByRole('button', { name: 'Cerrar aviso' }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(useSessionStore.getState().logoutError).toBeNull();
  });
});
