import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProductCard } from './ProductCard';
import type { Product } from '@/types';

const productWithNoImages: Product = {
  id: 'prod-1',
  slug: 'sin-fotos',
  sku: 'SKU-1',
  name: 'Producto sin fotos',
  brand: 'DID',
  categoryId: 'motor',
  subcategoryId: 'motor-pistones-anillos',
  description: 'desc',
  shortDescription: 'desc corta',
  priceClp: 10000,
  currency: 'CLP',
  stock: 5,
  condition: 'new',
  images: [],
  specs: [],
  rating: 4.5,
  reviewsCount: 10,
  warrantyMonths: 6,
  createdAt: '2026-01-01T00:00:00Z',
};

describe('ProductCard', () => {
  it('renders a placeholder instead of crashing when the product has no images', () => {
    render(
      <MemoryRouter>
        <ProductCard product={productWithNoImages} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Producto sin fotos')).toBeInTheDocument();
    expect(screen.getByLabelText('Sin imagen')).toBeInTheDocument();
  });
});
