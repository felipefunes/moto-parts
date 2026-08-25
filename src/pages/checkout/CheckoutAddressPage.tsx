import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Address } from '@/types';
import { CHECKOUT_ADDRESS_STORAGE_KEY } from '@/lib/constants';
import { useCart } from '@/hooks/useCart';
import { cartService } from '@/services';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { AddressForm } from '@/components/checkout/AddressForm';
import { ShippingMethodSelector } from '@/components/checkout/ShippingMethodSelector';
import { OrderSummary } from '@/components/checkout/OrderSummary';

function readStoredAddress(): Partial<Address> | undefined {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_ADDRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

export function CheckoutAddressPage() {
  const navigate = useNavigate();
  const { lines, subtotalClp } = useCart();
  const shippingClp = cartService.calculateShipping(subtotalClp);

  useEffect(() => {
    if (lines.length === 0) navigate('/carrito', { replace: true });
  }, [lines.length, navigate]);

  function handleSubmit(address: Address) {
    sessionStorage.setItem(CHECKOUT_ADDRESS_STORAGE_KEY, JSON.stringify(address));
    navigate('/checkout/pago');
  }

  if (lines.length === 0) return null;

  return (
    <div className="container-page py-8">
      <div className="mb-8">
        <CheckoutStepper current="direccion" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-5">
          <h1 className="font-heading text-xl font-bold text-text-primary">Dirección de despacho</h1>
          <ShippingMethodSelector shippingClp={shippingClp} />
          <AddressForm initialValue={readStoredAddress()} onSubmit={handleSubmit} />
        </div>
        <OrderSummary lines={lines} subtotalClp={subtotalClp} shippingClp={shippingClp} />
      </div>
    </div>
  );
}
