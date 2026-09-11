import { afterEach, describe, expect, it } from 'vitest';
import { useCartStore } from './cartStore';
import type { Product } from '@/types';

const backendProduct: Product = {
  // A real backend id looks nothing like the mock catalog's ids -- that mismatch is exactly
  // what made a cart line silently disappear before this store started snapshotting the
  // product instead of looking it up later by id.
  id: '3fae1c2e-9b7e-4c2b-9c2f-1a2b3c4d5e6f',
  slug: 'piston-forjado-125cc',
  sku: 'SKU-001',
  name: 'Pistón forjado 125cc',
  brand: 'DID',
  categoryId: 'motor',
  subcategoryId: 'motor-pistones-anillos',
  description: 'desc',
  shortDescription: 'desc corta',
  priceClp: 18990,
  currency: 'CLP',
  stock: 12,
  condition: 'new',
  images: [{ url: 'https://example.com/p1.jpg', alt: 'Pistón', isPrimary: true }],
  specs: [],
  rating: 4.5,
  reviewsCount: 10,
  warrantyMonths: 6,
  createdAt: '2026-01-01T00:00:00Z',
};

describe('useCartStore', () => {
  afterEach(() => {
    useCartStore.setState({ items: [] });
  });

  it('snapshots the product on add, independent of any external catalog lookup by id', () => {
    useCartStore.getState().addItem(backendProduct, 2);

    const [item] = useCartStore.getState().items;
    expect(item.productId).toBe(backendProduct.id);
    expect(item.quantity).toBe(2);
    expect(item.product).toEqual({
      slug: backendProduct.slug,
      name: backendProduct.name,
      brand: backendProduct.brand,
      stock: backendProduct.stock,
      images: backendProduct.images,
    });
  });

  it('increments quantity instead of duplicating when the same product is added again', () => {
    useCartStore.getState().addItem(backendProduct, 1);
    useCartStore.getState().addItem(backendProduct, 3);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(4);
  });
});
