import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { ProductGrid } from '@/components/product/ProductGrid';
import { themeConfig } from '@/theme';

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="container-page py-12">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-heading text-2xl font-bold text-text-primary">Destacados de la semana</h2>
        <Link
          to={themeConfig.primaryCategoryHref}
          className="flex items-center gap-1 text-sm font-semibold text-brand-cyan hover:underline"
        >
          Ver todo <ArrowRight size={14} />
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
