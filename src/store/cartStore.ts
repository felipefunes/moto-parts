import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';
import { CART_STORAGE_KEY } from '@/lib/constants';
import { calculateShipping } from '@/services/cartService';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  itemsCount: () => number;
  subtotalClp: () => number;
  shippingClp: () => number;
  totalClp: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                quantity,
                unitPriceClp: product.priceClp,
                addedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        }));
      },

      clear: () => set({ items: [] }),

      itemsCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotalClp: () => get().items.reduce((sum, i) => sum + i.unitPriceClp * i.quantity, 0),

      shippingClp: () => calculateShipping(get().subtotalClp()),

      totalClp: () => get().subtotalClp() + get().shippingClp(),
    }),
    { name: CART_STORAGE_KEY },
  ),
);
