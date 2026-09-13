import { clsx } from 'clsx';
import logoBadge from './logo-badge.png';

export function Logo({
  size = 'md',
  showTagline = false,
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}) {
  // The badge is a single square/portrait mark with the "WORTH MOTO PARTS" wordmark baked in --
  // it isn't a horizontal lockup, so it's sized as one unit rather than paired with coded text
  // beside it. It needs real height for the baked-in wordmark to stay legible.
  const markHeight = size === 'lg' ? 112 : size === 'md' ? 88 : 56;

  return (
    <div className={clsx('flex flex-col items-start', className)}>
      <img src={logoBadge} alt="Worth Moto Parts" style={{ height: markHeight, width: 'auto' }} />
      {showTagline && (
        <div className="mt-1 font-heading text-xs uppercase tracking-[0.2em] text-text-muted">
          Repuestos de moto
        </div>
      )}
    </div>
  );
}
