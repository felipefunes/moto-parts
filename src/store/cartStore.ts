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
                // Snapshotted at add-time rather than looked up later by id: cart items must
                // render correctly regardless of which catalog source (mock or real backend)
                // the product came from, and the two don't share an id space (Postgres UUIDs
                // vs. mock ids) -- see CONTRIBUTING.md #7.
                //
                // `stock` is the one field here that isn't purely cosmetic: it gates the "+"
                // button in CartLineItem, and this snapshot never refreshes (persisted to
                // localStorage, re-add of an existing item only bumps quantity). A cart that
                // outlives a real stock change will let the user raise quantity past what's
                // actually available -- acceptable for now since cart is client-only by design,
                // but read the live product (not this snapshot) if that stops being true.
                product: {
                  slug: product.slug,
                  name: product.name,
                  brand: product.brand,
                  stock: product.stock,
                  images: product.images,
                },
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
    {
      name: CART_STORAGE_KEY,
      version: 2,
      // v1 items had no product snapshot (looked it up by id from mock data later, which is
      // exactly the bug this version fixes) -- discard rather than render broken cart lines.
      migrate: () => ({ items: [] }),
    },
  ),
);
