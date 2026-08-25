import { clsx } from 'clsx';
import { LogoMark } from './LogoMark';

export function LogoWordmark({
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
        <span className={clsx('font-display font-black tracking-wide text-gradient-brand', textSize)}>
          RPM
        </span>
        <span className={clsx('font-heading font-bold tracking-wide text-text-primary', textSize)}> PARTS</span>
        {showTagline && (
          <div className="mt-0.5 font-heading text-xs uppercase tracking-[0.2em] text-text-muted">
            Repuestos de moto
          </div>
        )}
      </div>
    </div>
  );
}
