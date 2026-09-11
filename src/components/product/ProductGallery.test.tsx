import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProductGallery } from './ProductGallery';

describe('ProductGallery', () => {
  it('renders a placeholder instead of crashing when there are no images', () => {
    render(<ProductGallery images={[]} />);

    expect(screen.getByLabelText('Sin imagen')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
