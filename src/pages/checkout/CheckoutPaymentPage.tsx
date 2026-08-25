import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Address, PaymentResult } from '@/types';
import { CHECKOUT_ADDRESS_STORAGE_KEY } from '@/lib/constants';
import { useCart } from '@/hooks/useCart';
import { cartService, orderService } from '@/services';
import { PRODUCTS } from '@/data/products';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { PaymentMockForm } from '@/components/checkout/PaymentMockForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';

function readStoredAddress(): Address | undefined {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_ADDRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

export function CheckoutPaymentPage() {
  const navigate = useNavigate();
  const { lines, items, subtotalClp, clear } = useCart();
  const shippingClp = cartService.calculateShipping(subtotalClp);
  const address = readStoredAddress();
  const [creatingOrder, setCreatingOrder] = useState(false);

  // Se valida solo al montar (ver mismo comentario en CheckoutAddressPage):
  // handlePaymentResult vacía el carrito con clear() tras un pago exitoso, y
  // ese cambio de estado en un store externo (Zustand) no queda garantizado
  // en el mismo render que el `navigate()` a la confirmación — reaccionar a
  // `lines.length` aquí mandaba al usuario de vuelta a /carrito en vez de a
  // la confirmación del pedido, justo después de pagar.
  useEffect(() => {
    if (lines.length === 0) {
      navigate('/carrito', { replace: true });
      return;
    }
    if (!address) {
      navigate('/checkout/direccion', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePaymentResult(result: PaymentResult) {
    if (result.status !== 'authorized' || !address) return;
    setCreatingOrder(true);
    const productsMap = new Map(PRODUCTS.map((p) => [p.id, p]));
    const order = await orderService.createOrder({
      items,
      products: productsMap,
      address,
      paymentResult: result,
      shippingClp,
    });
    navigate(`/checkout/confirmacion/${order.orderNumber}`, { replace: true });
    clear();
    sessionStorage.removeItem(CHECKOUT_ADDRESS_STORAGE_KEY);
  }

  if (!address) return null;

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <CheckoutStepper current="pago" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-5">
          <h1 className="font-heading text-xl font-bold text-text-primary">Método de pago</h1>
          <div className="rounded-xl border border-border bg-bg-secondary p-4 text-sm text-text-secondary">
            Despachando a <span className="font-semibold text-text-primary">{address.fullName}</span> —{' '}
            {address.street} {address.number}, {address.commune}, {address.region}
          </div>
          <PaymentMockForm amountClp={subtotalClp + shippingClp} onResult={handlePaymentResult} />
          {creatingOrder && <p className="text-sm text-text-muted">Generando tu pedido…</p>}
        </div>
        <OrderSummary lines={lines} subtotalClp={subtotalClp} shippingClp={shippingClp} />
      </div>
    </div>
  );
}
