import { useMemo } from 'react';
import { useCartStore } from '@/store/cartStore';
import type { CartLineProduct } from '@/types';

export interface CartLine {
  productId: string;
  product: CartLineProduct;
  quantity: number;
  unitPriceClp: number;
  subtotalClp: number;
}

export function useCart() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clear = useCartStore((s) => s.clear);

  const lines: CartLine[] = useMemo(
    () =>
      items.map((item) => ({
        productId: item.productId,
        product: item.product,
        quantity: item.quantity,
        unitPriceClp: item.unitPriceClp,
        subtotalClp: item.unitPriceClp * item.quantity,
      })),
    [items],
  );

  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalClp = lines.reduce((sum, l) => sum + l.subtotalClp, 0);

  return { items, lines, itemsCount, subtotalClp, addItem, removeItem, updateQuantity, clear };
}
