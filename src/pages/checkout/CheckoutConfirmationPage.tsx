import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, PackageCheck } from 'lucide-react';
import type { Order } from '@/types';
import { orderService } from '@/services';
import { formatClp } from '@/lib/formatCurrency';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function CheckoutConfirmationPage() {
  const { orderNumber = '' } = useParams();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    orderService.getOrderByNumber(orderNumber).then((o) => {
      if (active) setOrder(o ?? null);
    });
    return () => {
      active = false;
    };
  }, [orderNumber]);

  if (order === null) return <NotFoundPage />;
  if (order === undefined) {
    return <div className="container-page py-16 text-center text-text-muted">Cargando pedido…</div>;
  }

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <CheckoutStepper current="confirmacion" />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <CheckCircle2 size={36} className="text-success" />
        </span>
        <h1 className="mt-4 font-heading text-2xl font-bold text-text-primary">¡Pedido confirmado!</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Recibimos tu pago y ya estamos preparando tu pedido{' '}
          <span className="font-semibold text-text-primary">{order.orderNumber}</span>.
        </p>

        <Card className="mt-8 p-6 text-left">
          <div className="flex items-center gap-2 border-b border-border pb-4">
            <PackageCheck size={18} className="text-brand-cyan" />
            <span className="font-heading text-sm font-bold uppercase tracking-wide text-text-primary">
              Detalle del pedido
            </span>
          </div>

          <div className="flex flex-col gap-3 py-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.productName} className="h-12 w-12 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <Link
                    to={`/producto/${item.productSlug}`}
                    className="line-clamp-1 text-sm font-medium text-text-primary hover:text-brand-cyan"
                  >
                    {item.productName}
                  </Link>
                  <p className="text-xs text-text-muted">Cantidad: {item.quantity}</p>
                </div>
                <span className="font-mono text-sm text-text-primary">{formatClp(item.subtotalClp)}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span className="font-mono text-text-primary">{formatClp(order.subtotalClp)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Envío</span>
              <span className="font-mono text-text-primary">
                {order.shippingClp === 0 ? 'Gratis' : formatClp(order.shippingClp)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-heading text-base font-bold text-text-primary">
              <span>Total pagado</span>
              <span className="font-mono text-price">{formatClp(order.totalClp)}</span>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-bg-elevated p-3 text-xs text-text-muted">
            Transacción {order.paymentResult.transactionId}
            {order.paymentResult.authorizationCode && ` · Código de autorización ${order.paymentResult.authorizationCode}`}
            {order.paymentResult.cardLast4 && ` · Tarjeta terminada en ${order.paymentResult.cardLast4}`}
          </div>

          <div className="mt-4 text-sm text-text-secondary">
            Enviaremos tu pedido a <span className="font-medium text-text-primary">{order.address.street} {order.address.number}, {order.address.commune}</span>.
          </div>
        </Card>

        <Link to="/">
          <Button size="lg" className="mt-8">
            Seguir comprando
          </Button>
        </Link>
      </div>
    </div>
  );
}
