import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSessionStore, HttpError } from '@/store/sessionStore';
import { sanitizeReturnTo } from '@/lib/returnTo';

const inputClass =
  'w-full rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-cyan focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-secondary';

/** C01 in the UX spec (Cuentas y Accesos artifact). Deliberately has no "¿Olvidaste tu
 * contraseña?" link -- rpm-parts-backend has no recovery endpoint yet, and the spec is explicit
 * that this must not point at a page that can't work. Add it once that backend piece exists. */
export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useSessionStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // Moves focus to the error itself once it appears -- a sighted keyboard user (not just a screen
  // reader) needs to actually land somewhere to know the submit failed, not just see red text
  // near wherever focus already was. Required by the UX spec (section 12: "foco al primer
  // problema tras envío"). Runs only when `error` changes, not on every render.
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  // Carries the same destination forward if the visitor switches to registering instead --
  // otherwise a login started from checkout (say) that detours through "Crear cuenta" would
  // land the new account on the generic /mi-cuenta default instead of back at checkout.
  const returnTo = searchParams.get('returnTo');
  const registerHref = returnTo ? `/crear-cuenta?returnTo=${encodeURIComponent(returnTo)}` : '/crear-cuenta';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Explicit check, not just the inputs' `required` attribute -- native constraint validation
    // on submit-button activation turned out not to reliably fire in every real-browser
    // automation context tested (see RegisterPage's identical comment), so an empty field could
    // otherwise reach the backend, get a generic 400, and be misreported here as "no pudimos
    // conectarnos" (this page only has a message for 401).
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      navigate(sanitizeReturnTo(searchParams.get('returnTo')), { replace: true });
    } catch (err) {
      // Same message for "no existe esa cuenta" y "contraseña incorrecta" -- distinguirlos
      // habilita enumeración de cuentas, y el backend ya responde ambos casos como un 401
      // genérico por la misma razón.
      if (err instanceof HttpError && err.status === 401) {
        setError('No pudimos ingresar con esos datos. Revisa tu correo y contraseña.');
      } else {
        setError('No pudimos conectarnos. Intenta nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page flex justify-center py-12 sm:py-16">
      <div className="w-full max-w-[440px]">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Ingresa a tu cuenta</h1>
        <p className="mt-2 text-sm text-text-secondary">Consulta tus pedidos y guarda tus datos para tu próxima compra.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label htmlFor="login-email" className={labelClass}>
              Correo electrónico
            </label>
            <input
              id="login-email"
              required
              type="email"
              autoComplete="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.cl"
            />
          </div>

          <div>
            <label htmlFor="login-password" className={labelClass}>
              Contraseña
            </label>
            <div className="relative">
              <input
                id="login-password"
                required
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className={`${inputClass} pr-10`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-text-muted hover:text-text-primary"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              ref={errorRef}
              role="alert"
              tabIndex={-1}
              className="rounded text-sm text-danger focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 focus:ring-offset-bg-primary"
            >
              {error}
            </p>
          )}

          <Button type="submit" fullWidth loading={submitting}>
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          ¿No tienes cuenta?{' '}
          <Link to={registerHref} className="font-semibold text-brand-cyan hover:underline">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
