import { render, screen } from '@testing-library/react';
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
});
