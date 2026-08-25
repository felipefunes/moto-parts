import { PRODUCT_BRANDS } from '@/data/products';
import { MOTORCYCLE_BRANDS } from '@/data/motorcycleModels';
import { FilterCheckboxGroup } from './FilterCheckboxGroup';
import { PriceRangeFilter } from './PriceRangeFilter';
import type { ProductFilters } from '@/types';

export function FilterSidebar({
  filters,
  onBrandsChange,
  onMotorcycleBrandsChange,
  onPriceChange,
  onReset,
}: {
  filters: ProductFilters;
  onBrandsChange: (brands: string[]) => void;
  onMotorcycleBrandsChange: (brands: string[]) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between pb-2">
        <h2 className="font-heading text-base font-bold text-text-primary">Filtros</h2>
        <button onClick={onReset} className="text-xs font-semibold text-brand-cyan hover:underline">
          Limpiar
        </button>
      </div>
      <PriceRangeFilter min={filters.priceMin} max={filters.priceMax} onChange={onPriceChange} />
      <FilterCheckboxGroup
        title="Marca del repuesto"
        options={PRODUCT_BRANDS}
        selected={filters.brands ?? []}
        onChange={onBrandsChange}
      />
      <FilterCheckboxGroup
        title="Moto compatible"
        options={MOTORCYCLE_BRANDS}
        selected={filters.motorcycleBrands ?? []}
        onChange={onMotorcycleBrandsChange}
      />
    </div>
  );
}
