import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useSessionStore } from '@/store/sessionStore';

const triggerClass =
  'flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary transition-colors hover:border-brand-cyan';

/** The header's account entry point -- three states, not two: `checking` (bootstrap hasn't
 * resolved the httpOnly refresh cookie yet) renders the same-sized, inert placeholder so there's
 * no layout shift and no flash of the wrong state (see the UX spec's "Arranque con cookie
 * posible" transversal case), before settling into `anonymous` or `authenticated`. The full menu
 * (Mis pedidos, Mis datos, Direcciones, Seguridad) lands once those pages exist -- this only has
 * what's real today: the account stub and logout. */
export function AccountMenu() {
  const status = useSessionStore((s) => s.status);
  const user = useSessionStore((s) => s.user);
  const logout = useSessionStore((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  async function handleLogout() {
    setOpen(false);
    try {
      await logout();
    } finally {
      navigate('/', { replace: true });
    }
  }

  if (status === 'checking') {
    return (
      <span className={`${triggerClass} opacity-0`} aria-hidden="true">
        <User size={18} />
      </span>
    );
  }

  if (status === 'anonymous') {
    return (
      <Link to="/ingresar" className={triggerClass}>
        <User size={18} />
        <span className="hidden sm:inline">Mi cuenta</span>
      </Link>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className={triggerClass} aria-expanded={open}>
        <User size={18} />
        <span className="hidden sm:inline">Hola, {user?.fullName?.split(' ')[0]}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-bg-elevated py-1.5 shadow-lg">
          <Link
            to="/mi-cuenta"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-text-primary hover:bg-bg-primary"
          >
            Mi cuenta
          </Link>
          <div className="my-1 border-t border-border" />
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-primary"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
