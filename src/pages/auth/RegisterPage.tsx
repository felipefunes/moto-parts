import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSessionStore, HttpError } from '@/store/sessionStore';
import { sanitizeReturnTo } from '@/lib/returnTo';

const inputClass =
  'w-full rounded-lg border border-border bg-bg-elevated px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-cyan focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-secondary';

/** C02 in the UX spec. Only the fields the backend actually accepts (RegisterRequest) -- no RUT,
 * no confirm-password field, no marketing checkbox that doesn't have real consent handling yet. */
export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const register = useSessionStore((s) => s.register);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register(email, password, fullName);
      navigate(sanitizeReturnTo(searchParams.get('returnTo')), { replace: true });
    } catch (err) {
      if (err instanceof HttpError && err.status === 409) {
        // No revela si la cuenta existente tiene otro nombre/datos -- solo orienta a ingresar.
        setError('Ya existe una cuenta con ese correo. Intenta ingresar en su lugar.');
      } else if (err instanceof HttpError && err.status === 400) {
        setError('Revisa los datos ingresados.');
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
        <h1 className="font-heading text-2xl font-bold text-text-primary">Crea tu cuenta</h1>
        <p className="mt-2 text-sm text-text-secondary">Consulta tus pedidos en un solo lugar la próxima vez que compres.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="register-name" className={labelClass}>
              Nombre completo
            </label>
            <input
              id="register-name"
              required
              maxLength={150}
              autoComplete="name"
              className={inputClass}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label htmlFor="register-email" className={labelClass}>
              Correo electrónico
            </label>
            <input
              id="register-email"
              required
              type="email"
              maxLength={200}
              autoComplete="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.cl"
            />
          </div>

          <div>
            <label htmlFor="register-password" className={labelClass}>
              Contraseña
            </label>
            <div className="relative">
              <input
                id="register-password"
                required
                minLength={12}
                maxLength={200}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`${inputClass} pr-10`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-text-muted">Mínimo 12 caracteres.</p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}

          <Button type="submit" fullWidth loading={submitting}>
            {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          ¿Ya tienes cuenta?{' '}
          <Link to="/ingresar" className="font-semibold text-brand-cyan hover:underline">
            Ingresar
          </Link>
        </p>
      </div>
    </div>
  );
}
