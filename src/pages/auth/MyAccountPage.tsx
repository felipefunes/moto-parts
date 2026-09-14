import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useSessionStore } from '@/store/sessionStore';

/** Minimal landing page for a logged-in session -- the real "Mis pedidos" (C07 in the UX spec)
 * needs order-ownership on the backend (`order_` has no `user_id` yet), which is out of scope for
 * this slice. This exists so login/register have a real, non-arbitrary place to land instead of
 * dumping the user back on the homepage, and gets replaced wholesale once that backend piece
 * exists -- not extended in place. */
export function MyAccountPage() {
  const navigate = useNavigate();
  const user = useSessionStore((s) => s.user);
  const logout = useSessionStore((s) => s.logout);

  // logout() never rejects -- a failed remote call is reported via the store's `logoutError`
  // (shown from AccountMenu, which stays mounted across this navigation), not a thrown error.
  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  if (!user) return null;

  return (
    <div className="container-page py-12">
      <h1 className="font-heading text-2xl font-bold text-text-primary">Hola, {user.fullName}</h1>
      <p className="mt-2 text-sm text-text-secondary">{user.email}</p>
      <p className="mt-6 max-w-prose text-sm text-text-secondary">
        Tu historial de pedidos todavía no está disponible desde tu cuenta -- por ahora, revisa el correo de confirmación de
        cada compra.
      </p>
      <Button variant="secondary" className="mt-8" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </div>
  );
}
