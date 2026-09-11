import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { CartLineItem } from './CartLineItem';
import type { CartLine } from '@/hooks/useCart';

// A real backend product with no image rows maps to images: [] (catalogMappers.mapProduct uses
// api.images ?? []) -- this must render a placeholder, not crash on images[0].url.
const lineWithNoImages: CartLine = {
  productId: 'prod-1',
  product: { slug: 'sin-fotos', name: 'Producto sin fotos', brand: 'DID', stock: 5, images: [] },
  quantity: 1,
  unitPriceClp: 10000,
  subtotalClp: 10000,
};

describe('CartLineItem', () => {
  it('renders a placeholder instead of crashing when the product has no images', () => {
    render(
      <MemoryRouter>
        <CartLineItem line={lineWithNoImages} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Producto sin fotos')).toBeInTheDocument();
    expect(screen.getByLabelText('Sin imagen')).toBeInTheDocument();
  });
});
