import { clsx } from 'clsx';

/**
 * Marca provisoria mientras se integra el isotipo real (escudo con pistón y
 * engranaje, ver docs de marca): mismas tres barras ascendentes tipo
 * tacómetro, recoloreadas al degradé rojo-naranja del logo definitivo.
 * Reemplazar `LogoMark` por el asset real (`<img src={...} />`) cuando esté
 * disponible como archivo -- el resto de este componente no debería cambiar.
 */
function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="Worth Moto Parts"
    >
      <defs>
        <linearGradient id="wmp-logo-gradient" x1="4" y1="40" x2="44" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B91C1C" />
          <stop offset="0.5" stopColor="#EA580C" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <rect x="8" y="26" width="7" height="14" rx="1.5" fill="url(#wmp-logo-gradient)" />
      <rect x="20.5" y="18" width="7" height="22" rx="1.5" fill="url(#wmp-logo-gradient)" />
      <rect x="33" y="8" width="7" height="32" rx="1.5" fill="url(#wmp-logo-gradient)" />
      <circle cx="38.5" cy="6.5" r="2.6" fill="#FBBF24" />
    </svg>
  );
}

export function Logo({
  size = 'md',
  showTagline = false,
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}) {
  const markSize = size === 'lg' ? 44 : size === 'md' ? 32 : 26;
  const textSize = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm';

  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      <LogoMark size={markSize} />
      <div className="leading-none">
        <span className={clsx('font-display font-black tracking-wide text-gradient-brand', textSize)}>
          WORTH
        </span>
        <span className={clsx('font-heading font-bold tracking-wide text-text-primary', textSize)}> MOTO PARTS</span>
        {showTagline && (
          <div className="mt-0.5 font-heading text-xs uppercase tracking-[0.2em] text-text-muted">
            Repuestos de moto
          </div>
        )}
      </div>
    </div>
  );
}
