import type { Product } from '@/types';
import { CompatibilityList } from '@/components/product/CompatibilityList';

/** Panel extra de la ficha de producto, específico de este tema: compatibilidad con modelos de moto. */
export function ProductExtraSection({ product }: { product: Product }) {
  if (!product.compatibility || product.compatibility.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="mb-4 font-heading text-lg font-bold text-text-primary">Compatible con estos modelos</h2>
      <CompatibilityList items={product.compatibility} />
    </div>
  );
}
