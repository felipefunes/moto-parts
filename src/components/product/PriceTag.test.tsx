import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PriceTag } from './PriceTag';

// First test written for this repo -- proves the Vitest + React Testing Library harness works
// (jsdom environment, @/ alias resolution, React 19 rendering) before the catalog module builds
// on top of it. Assertions avoid hardcoding Intl.NumberFormat's exact output (currency symbol,
// separator, spacing) since that's locale-data-dependent across Node builds -- checking the
// digits and the discount math is what actually matters here.
describe('PriceTag', () => {
  it('renders the price without a discount badge when there is no compareAtPriceClp', () => {
    render(<PriceTag priceClp={18990} />);

    expect(screen.getByText(/18[.,]990/)).toBeInTheDocument();
    expect(screen.queryByText(/^-\d+%$/)).not.toBeInTheDocument();
  });

  it('renders the original price struck through and the computed discount percentage', () => {
    render(<PriceTag priceClp={45990} compareAtPriceClp={52990} />);

    expect(screen.getByText(/45[.,]990/)).toBeInTheDocument();
    expect(screen.getByText(/52[.,]990/)).toBeInTheDocument();
    // Math.round(((52990 - 45990) / 52990) * 100) = 13
    expect(screen.getByText('-13%')).toBeInTheDocument();
  });
});
