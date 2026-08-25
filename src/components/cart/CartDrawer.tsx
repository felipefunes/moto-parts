import { Link } from 'react-router-dom';
import { X, ShoppingCart } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';
import { useCart } from '@/hooks/useCart';
import { CartLineItem } from './CartLineItem';
import { CartSummary } from './CartSummary';
import { Button } from '@/components/ui/Button';
import { cartService } from '@/services';

export function CartDrawer() {
  const isOpen = useUiStore((s) => s.isCartOpen);
  const closeCart = useUiStore((s) => s.closeCart);
  const { lines, subtotalClp } = useCart();
  const shippingClp = cartService.calculateShipping(subtotalClp);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-bg-overlay/70 backdrop-blur-sm transition-opacity ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
      />
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-bg-secondary shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-heading text-lg font-bold text-text-primary">Tu carrito</h2>
          <button onClick={closeCart} className="text-text-secondary hover:text-text-primary" aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingCart size={40} className="text-text-muted" />
              <p className="text-sm text-text-secondary">Tu carrito está vacío.</p>
              <Button variant="secondary" onClick={closeCart}>
                Seguir comprando
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {lines.map((line) => (
                <CartLineItem key={line.productId} line={line} compact />
              ))}
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-border p-4">
            <CartSummary subtotalClp={subtotalClp} shippingClp={shippingClp} />
            <Link to="/checkout/direccion" onClick={closeCart}>
              <Button fullWidth size="lg" className="mt-4">
                Ir a pagar
              </Button>
            </Link>
            <Link to="/carrito" onClick={closeCart}>
              <Button fullWidth variant="ghost" size="sm" className="mt-2">
                Ver carrito completo
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
