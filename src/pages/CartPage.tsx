import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cartService } from '@/services';
import { CartLineItem } from '@/components/cart/CartLineItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export function CartPage() {
  const { lines, subtotalClp } = useCart();
  const shippingClp = cartService.calculateShipping(subtotalClp);

  if (lines.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center gap-4 py-24 text-center">
        <ShoppingCart size={48} className="text-text-muted" />
        <h1 className="font-heading text-xl font-bold text-text-primary">Tu carrito está vacío</h1>
        <p className="text-sm text-text-secondary">Explora el catálogo y encuentra el repuesto que necesitas.</p>
        <Link to="/">
          <Button size="lg">Ir al catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: 'Carrito de compras' }]} />
      <h1 className="mt-3 font-heading text-2xl font-bold text-text-primary">
        Tu carrito ({lines.length} {lines.length === 1 ? 'producto' : 'productos'})
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <Card className="divide-y divide-border p-4">
          {lines.map((line) => (
            <CartLineItem key={line.productId} line={line} />
          ))}
        </Card>

        <Card className="h-fit p-5">
          <CartSummary subtotalClp={subtotalClp} shippingClp={shippingClp} />
          <Link to="/checkout/direccion">
            <Button fullWidth size="lg" className="mt-5">
              Continuar con la compra
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
