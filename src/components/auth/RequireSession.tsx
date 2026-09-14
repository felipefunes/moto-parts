import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSessionStore } from '@/store/sessionStore';

/** Gates a route behind an authenticated session -- redirects to `/ingresar?returnTo=<here>` so
 * a successful login lands back on the exact page that required it (see the UX spec's "Abrir
 * enlace a pedido de cuenta" row). Renders nothing while `status` is still `checking` rather than
 * redirecting early: bootstrap hasn't had a chance to resolve the refresh cookie yet, and
 * redirecting before it does would bounce an already-logged-in visitor to the login page on
 * every reload. */
export function RequireSession({ children }: { children: ReactNode }) {
  const status = useSessionStore((s) => s.status);
  const location = useLocation();

  if (status === 'checking') return null;
  if (status === 'anonymous') {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/ingresar?returnTo=${returnTo}`} replace />;
  }
  return <>{children}</>;
}
