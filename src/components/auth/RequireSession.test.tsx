import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { useSessionStore } from '@/store/sessionStore';
import { RequireSession } from './RequireSession';

function renderProtected(initialPath = '/mi-cuenta') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/mi-cuenta"
          element={
            <RequireSession>
              <div>Contenido protegido</div>
            </RequireSession>
          }
        />
        <Route path="/ingresar" element={<div>Página de login</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireSession', () => {
  it('renders nothing while bootstrap is still checking, instead of redirecting early', () => {
    useSessionStore.setState({ status: 'checking', user: null, accessToken: null });

    const { container } = renderProtected();

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText('Página de login')).not.toBeInTheDocument();
  });

  it('redirects to /ingresar with a returnTo when anonymous', () => {
    useSessionStore.setState({ status: 'anonymous', user: null, accessToken: null });

    renderProtected('/mi-cuenta?foo=bar');

    expect(screen.getByText('Página de login')).toBeInTheDocument();
  });

  it('renders the protected content when authenticated', () => {
    useSessionStore.setState({
      status: 'authenticated',
      user: { id: 'u1', email: 'juan@example.com', fullName: 'Juan', role: 'customer' },
      accessToken: 'token',
    });

    renderProtected();

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });

  it('offers a retry instead of redirecting when the backend could not be reached at all', async () => {
    const bootstrap = vi.fn().mockResolvedValue(undefined);
    useSessionStore.setState({ status: 'unavailable', user: null, accessToken: null, bootstrap });

    renderProtected();

    expect(screen.queryByText('Página de login')).not.toBeInTheDocument();
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
    const retryButton = screen.getByRole('button', { name: 'Reintentar' });

    await userEvent.click(retryButton);

    expect(bootstrap).toHaveBeenCalledTimes(1);
  });
});
