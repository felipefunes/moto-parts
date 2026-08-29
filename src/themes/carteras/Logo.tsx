import { clsx } from 'clsx';

/**
 * Marca original: dos cintas cruzadas (evocan el entrelazado de un telar/tejido
 * artesanal) con gradiente terracota→ocre→cuero, más un punto central que
 * evoca un remache de cuero.
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
      aria-label="RW"
    >
      <defs>
        <linearGradient id="telar-logo-gradient" x1="6" y1="42" x2="42" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C1653D" />
          <stop offset="0.5" stopColor="#D98E4A" />
          <stop offset="1" stopColor="#8C5A3C" />
        </linearGradient>
      </defs>
      <rect
        x="20"
        y="6"
        width="8"
        height="36"
        rx="4"
        fill="url(#telar-logo-gradient)"
        transform="rotate(35 24 24)"
      />
      <rect
        x="20"
        y="6"
        width="8"
        height="36"
        rx="4"
        fill="url(#telar-logo-gradient)"
        opacity="0.85"
        transform="rotate(-35 24 24)"
      />
      <circle cx="24" cy="24" r="3" fill="#7C8B4A" />
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
  const textSize = size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-base';

  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      <LogoMark size={markSize} />
      <div className="leading-none">
        <span className={clsx('font-display font-bold tracking-wide text-gradient-brand', textSize)}>
          RW
        </span>
        {showTagline && (
          <div className="mt-0.5 font-heading text-xs uppercase tracking-[0.2em] text-text-muted">
            Carteras artesanales
          </div>
        )}
      </div>
    </div>
  );
}
