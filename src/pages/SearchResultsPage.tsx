import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catalogService, type PaginatedProducts } from '@/services';
import { useProductFilters } from '@/hooks/useProductFilters';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { MobileFilterSheet } from '@/components/filters/MobileFilterSheet';
import { SortDropdown } from '@/components/filters/SortDropdown';
import { ProductGrid } from '@/components/product/ProductGrid';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const { filters, setBrands, setMotorcycleBrands, setPriceRange, setSort, resetFilters } =
    useProductFilters();

  const [result, setResult] = useState<PaginatedProducts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    catalogService.getProducts({ ...filters, query, pageSize: 24 }).then((res) => {
      if (active) {
        setResult(res);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, JSON.stringify(filters)]);

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: `Resultados para "${query}"` }]} />
      <h1 className="mt-3 font-heading text-2xl font-bold text-text-primary">
        Resultados para <span className="text-brand-cyan">&ldquo;{query}&rdquo;</span>
      </h1>
      {result && <p className="text-sm text-text-muted">{result.total} repuestos encontrados</p>}

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <div className="hidden lg:block lg:w-64 lg:shrink-0">
          <FilterSidebar
            filters={filters}
            onBrandsChange={setBrands}
            onMotorcycleBrandsChange={setMotorcycleBrands}
            onPriceChange={setPriceRange}
            onReset={resetFilters}
          />
        </div>
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between lg:justify-end">
            <MobileFilterSheet
              filters={filters}
              onBrandsChange={setBrands}
              onMotorcycleBrandsChange={setMotorcycleBrands}
              onPriceChange={setPriceRange}
              onReset={resetFilters}
            />
            <SortDropdown value={filters.sort} onChange={setSort} />
          </div>
          <ProductGrid products={result?.items ?? []} loading={loading} />
        </div>
      </div>
    </div>
  );
}
