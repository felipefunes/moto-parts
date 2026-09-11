import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { ProductFilters } from '@/types';
import { FilterSidebar } from './FilterSidebar';
import { Button } from '@/components/ui/Button';

function countActiveFilters(filters: ProductFilters): number {
  let count = 0;
  count += filters.brands?.length ?? 0;
  count += filters.motorcycleBrands?.length ?? 0;
  if (filters.priceMin != null || filters.priceMax != null) count += 1;
  return count;
}

/**
 * En mobile no hay :hover, y un sidebar apilado empuja los resultados fuera
 * de la pantalla — por eso los filtros viven en una hoja inferior que se
 * abre a demanda, en vez del layout de dos columnas que usamos en desktop.
 */
export function MobileFilterSheet(props: {
  filters: ProductFilters;
  brands: string[];
  onBrandsChange: (brands: string[]) => void;
  onMotorcycleBrandsChange: (brands: string[]) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onReset: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = countActiveFilters(props.filters);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm font-semibold text-text-primary"
      >
        <SlidersHorizontal size={16} />
        Filtros
        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gradient text-[11px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      <div
        className={`fixed inset-0 z-40 bg-bg-overlay/70 backdrop-blur-sm transition-opacity ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border bg-bg-secondary p-4 pb-6 shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-label="Filtros"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="font-heading text-base font-bold text-text-primary">Filtrar por</span>
          <button onClick={() => setIsOpen(false)} className="text-text-secondary" aria-label="Cerrar filtros">
            <X size={20} />
          </button>
        </div>

        <FilterSidebar
          filters={props.filters}
          brands={props.brands}
          onBrandsChange={props.onBrandsChange}
          onMotorcycleBrandsChange={props.onMotorcycleBrandsChange}
          onPriceChange={props.onPriceChange}
          onReset={props.onReset}
        />

        <Button fullWidth size="lg" className="mt-4" onClick={() => setIsOpen(false)}>
          Ver resultados
        </Button>
      </div>
    </div>
  );
}
