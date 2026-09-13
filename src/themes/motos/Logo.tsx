import { clsx } from 'clsx';
import logoW from './logo-w.png';

export function Logo({
  size = 'md',
  showTagline = false,
  className,
}: {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}) {
  // Unlike the full crest (logo-badge.png, kept around for reuse elsewhere), this "W" mark has
  // no text baked in, so it goes back to an icon + coded wordmark lockup -- and being a single
  // bold glyph rather than fine gear/piston detail, it stays legible at small header sizes.
  const markSize = size === 'lg' ? 48 : size === 'md' ? 36 : 30;
  const textSize = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm';

  return (
    <div className={clsx('flex items-center gap-2.5', className)}>
      <img src={logoW} alt="" aria-hidden="true" style={{ height: markSize, width: 'auto' }} />
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
