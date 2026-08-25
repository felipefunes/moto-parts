import { clsx } from 'clsx';
import { formatClp } from '@/lib/formatCurrency';

export function PriceTag({
  priceClp,
  compareAtPriceClp,
  size = 'md',
}: {
  priceClp: number;
  compareAtPriceClp?: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const discountPct = compareAtPriceClp
    ? Math.round(((compareAtPriceClp - priceClp) / compareAtPriceClp) * 100)
    : 0;

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span
        className={clsx(
          'font-mono font-semibold text-price',
          size === 'lg' && 'text-3xl',
          size === 'md' && 'text-xl',
          size === 'sm' && 'text-base',
        )}
      >
        {formatClp(priceClp)}
      </span>
      {compareAtPriceClp && (
        <>
          <span className="font-mono text-sm text-text-muted line-through">
            {formatClp(compareAtPriceClp)}
          </span>
          <span className="rounded-md bg-racing-red/15 px-1.5 py-0.5 text-xs font-bold text-racing-red">
            -{discountPct}%
          </span>
        </>
      )}
    </div>
  );
}
