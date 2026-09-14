import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, X } from 'lucide-react';
import { useSessionStore } from '@/store/sessionStore';

const triggerClass =
  'flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary transition-colors hover:border-brand-cyan';
// Visible only from `sm` up, but always present for assistive tech -- `hidden` would remove the
// only accessible name a mobile visitor's screen reader has for this control (the icon alone
// isn't one). See the UX spec's WCAG 2.2 AA requirement in section 12.
const labelClass = 'sr-only sm:not-sr-only sm:inline';

/** The header's account entry point -- four states: `checking` (bootstrap hasn't resolved the
 * httpOnly refresh cookie yet) renders an inert, same-sized placeholder so there's no layout
 * shift or flash of the wrong state; `unavailable` (bootstrap couldn't reach the backend at all)
 * offers a retry rather than guessing anonymous or authenticated; then `anonymous` or
 * `authenticated`. The full menu (Mis pedidos, Mis datos, Direcciones, Seguridad) lands once
 * those pages exist -- this only has what's real today: the account stub and logout. */
export function AccountMenu() {
  const status = useSessionStore((s) => s.status);
  const user = useSessionStore((s) => s.user);
  const logout = useSessionStore((s) => s.logout);
  const bootstrap = useSessionStore((s) => s.bootstrap);
  const logoutError = useSessionStore((s) => s.logoutError);
  const dismissLogoutError = useSessionStore((s) => s.dismissLogoutError);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [retryingLogout, setRetryingLogout] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    // Escape closes the menu and returns focus to the trigger -- required by the UX spec (section
    // 12: "Escape cierra popovers y devuelve foco al disparador"), not just a click-away. Only
    // registered while `open`, so pressing Escape elsewhere on the page never steals focus here.
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  // `logout()` never rejects -- a failed remote call is reported via `logoutError`, not a thrown
  // error, so there's nothing to catch here. Navigating home is always correct: local state is
  // always cleared either way (see sessionStore's doc).
  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate('/', { replace: true });
  }

  // Retrying just calls logout() again -- it doesn't depend on any client-held token, only
  // whatever refresh cookie the browser still has, which a failed remote call never touched (the
  // request may never have reached the server at all). Local state is already `anonymous` either
  // way; a successful retry only clears `logoutError` and confirms the server side too.
  async function handleRetryLogout() {
    setRetryingLogout(true);
    try {
      await logout();
    } finally {
      setRetryingLogout(false);
    }
  }

  const banner = logoutError && (
    <div
      role="alert"
      className="absolute right-0 top-full mt-2 flex w-72 flex-col gap-2 rounded-xl border border-danger/40 bg-bg-elevated p-3 text-xs text-text-secondary shadow-lg"
    >
      <div className="flex items-start gap-2">
        <p className="flex-1">{logoutError}</p>
        <button
          type="button"
          onClick={dismissLogoutError}
          aria-label="Cerrar aviso"
          className="text-text-muted hover:text-text-primary"
        >
          <X size={14} />
        </button>
      </div>
      <button
        type="button"
        onClick={handleRetryLogout}
        disabled={retryingLogout}
        className="self-start font-semibold text-brand-cyan hover:underline disabled:opacity-60"
      >
        {retryingLogout ? 'Reintentando…' : 'Reintentar cierre de sesión'}
      </button>
    </div>
  );

  if (status === 'checking') {
    return (
      <span className={`${triggerClass} opacity-0`} aria-hidden="true">
        <User size={18} aria-hidden="true" />
      </span>
    );
  }

  if (status === 'unavailable') {
    return (
      <div className="relative">
        <button type="button" onClick={() => bootstrap()} className={triggerClass} aria-label="No pudimos verificar tu sesión. Reintentar.">
          <User size={18} aria-hidden="true" />
          <span className={labelClass}>Reintentar</span>
        </button>
        {banner}
      </div>
    );
  }

  if (status === 'anonymous') {
    return (
      <div className="relative">
        <Link to="/ingresar" className={triggerClass} aria-label="Mi cuenta">
          <User size={18} aria-hidden="true" />
          <span className={labelClass}>Mi cuenta</span>
        </Link>
        {banner}
      </div>
    );
  }

  const firstName = user?.fullName?.split(' ')[0] ?? '';

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={triggerClass}
        aria-expanded={open}
        aria-label={`Hola, ${firstName}. Mi cuenta`}
      >
        <User size={18} aria-hidden="true" />
        <span className={labelClass} aria-hidden="true">
          Hola, {firstName}
        </span>
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
      {banner}
    </div>
  );
}
