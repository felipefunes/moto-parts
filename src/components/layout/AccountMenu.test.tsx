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

  it('links to /ingresar when anonymous', () => {
    useSessionStore.setState({ status: 'anonymous', user: null, accessToken: null });

    renderAccountMenu();

    expect(screen.getByRole('link', { name: /Mi cuenta/ })).toHaveAttribute('href', '/ingresar');
  });

  it('greets the user by their first name when authenticated', () => {
    useSessionStore.setState({
      status: 'authenticated',
      user: { id: 'u1', email: 'juan@example.com', fullName: 'Juan Pérez', role: 'customer' },
      accessToken: 'token',
    });

    renderAccountMenu();

    expect(screen.getByText('Hola, Juan')).toBeInTheDocument();
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
});
