import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OrderSummary } from './OrderSummary';
import type { CartLine } from '@/hooks/useCart';

const lineWithNoImages: CartLine = {
  productId: 'prod-1',
  product: { slug: 'sin-fotos', name: 'Producto sin fotos', brand: 'DID', stock: 5, images: [] },
  quantity: 2,
  unitPriceClp: 10000,
  subtotalClp: 20000,
};

describe('OrderSummary', () => {
  it('renders a placeholder instead of crashing when a line has no images', () => {
    render(<OrderSummary lines={[lineWithNoImages]} subtotalClp={20000} shippingClp={0} />);

    expect(screen.getByText('Producto sin fotos')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
