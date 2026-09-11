import type { CartLine } from '@/hooks/useCart';
import { formatClp } from '@/lib/formatCurrency';
import { Card } from '@/components/ui/Card';
import { ImagePlaceholder } from '@/components/product/ImagePlaceholder';

export function OrderSummary({
  lines,
  subtotalClp,
  shippingClp,
}: {
  lines: CartLine[];
  subtotalClp: number;
  shippingClp: number;
}) {
  return (
    <Card className="sticky top-24 p-5">
      <h3 className="mb-4 font-heading text-base font-bold text-text-primary">Resumen del pedido</h3>
      <div className="flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
        {lines.map((line) => {
          // A real backend product with no image rows maps to images: [] -- see the same note
          // in CartLineItem.tsx.
          const image = line.product.images[0];
          return (
            <div key={line.productId} className="flex items-center gap-3">
              {image ? (
                <img src={image.url} alt={image.alt} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
              ) : (
                <ImagePlaceholder className="h-12 w-12 shrink-0 rounded-lg" iconSize={16} />
              )}
              <div className="flex-1">
                <p className="line-clamp-1 text-xs font-medium text-text-primary">{line.product.name}</p>
                <p className="text-xs text-text-muted">Cantidad: {line.quantity}</p>
              </div>
              <span className="font-mono text-xs font-semibold text-text-primary">
                {formatClp(line.subtotalClp)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span className="font-mono text-text-primary">{formatClp(subtotalClp)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Envío</span>
          <span className="font-mono text-text-primary">
            {shippingClp === 0 ? 'Gratis' : formatClp(shippingClp)}
          </span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-heading text-base font-bold text-text-primary">
          <span>Total</span>
          <span className="font-mono text-price">{formatClp(subtotalClp + shippingClp)}</span>
        </div>
      </div>
    </Card>
  );
}
