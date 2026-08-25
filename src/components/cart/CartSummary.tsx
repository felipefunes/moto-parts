import { formatClp } from '@/lib/formatCurrency';
import { FREE_SHIPPING_THRESHOLD_CLP } from '@/lib/constants';

export function CartSummary({
  subtotalClp,
  shippingClp,
}: {
  subtotalClp: number;
  shippingClp: number;
}) {
  const missingForFreeShipping = FREE_SHIPPING_THRESHOLD_CLP - subtotalClp;

  return (
    <div className="flex flex-col gap-3">
      {missingForFreeShipping > 0 && subtotalClp > 0 && (
        <p className="rounded-lg bg-brand-violet/10 px-3 py-2 text-xs text-brand-cyan">
          Agrega {formatClp(missingForFreeShipping)} más y obtén envío gratis.
        </p>
      )}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>Subtotal</span>
        <span className="font-mono text-text-primary">{formatClp(subtotalClp)}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span>Envío</span>
        <span className="font-mono text-text-primary">
          {shippingClp === 0 ? 'Gratis' : formatClp(shippingClp)}
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3 font-heading text-base font-bold text-text-primary">
        <span>Total</span>
        <span className="font-mono text-price">{formatClp(subtotalClp + shippingClp)}</span>
      </div>
    </div>
  );
}
