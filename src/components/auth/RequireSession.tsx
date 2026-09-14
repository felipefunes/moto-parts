import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useSessionStore } from '@/store/sessionStore';

/** Gates a route behind an authenticated session -- redirects to `/ingresar?returnTo=<here>` so
 * a successful login lands back on the exact page that required it (see the UX spec's "Abrir
 * enlace a pedido de cuenta" row). Renders nothing while `status` is still `checking` rather than
 * redirecting early: bootstrap hasn't had a chance to resolve the refresh cookie yet, and
 * redirecting before it does would bounce an already-logged-in visitor to the login page on
 * every reload.
 *
 * `unavailable` (bootstrap couldn't reach the backend at all) is deliberately NOT treated as
 * `anonymous` here: redirecting to login on a network hiccup would tell a visitor with a
 * perfectly valid session that they're logged out, based on nothing more than a request that
 * happened to fail once. Offers a retry instead of guessing either way. */
export function RequireSession({ children }: { children: ReactNode }) {
  const status = useSessionStore((s) => s.status);
  const bootstrap = useSessionStore((s) => s.bootstrap);
  const location = useLocation();

  if (status === 'checking') return null;

  if (status === 'unavailable') {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-16 text-center">
        <p className="max-w-prose text-sm text-text-secondary">
          No pudimos comprobar tu sesión. Puede ser un problema de conexión -- intenta de nuevo.
        </p>
        <Button variant="secondary" onClick={() => bootstrap()}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (status === 'anonymous') {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/ingresar?returnTo=${returnTo}`} replace />;
  }
  return <>{children}</>;
}
