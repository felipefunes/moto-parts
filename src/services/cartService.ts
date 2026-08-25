import { FREE_SHIPPING_THRESHOLD_CLP, STANDARD_SHIPPING_CLP } from '@/lib/constants';

/**
 * Hoy es una función pura local; el día que exista backend se transforma
 * en `POST /api/cart/quote` sin cambiar la firma que consumen los componentes.
 */
export function calculateShipping(subtotalClp: number): number {
  if (subtotalClp === 0) return 0;
  return subtotalClp >= FREE_SHIPPING_THRESHOLD_CLP ? 0 : STANDARD_SHIPPING_CLP;
}

export const cartService = {
  calculateShipping,
};
