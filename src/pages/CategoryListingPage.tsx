import { Link, useParams } from 'react-router-dom';
import type { Product } from '@/types';
import { catalogService } from '@/services';
import { useProductFilters } from '@/hooks/useProductFilters';
import { useAsyncData } from '@/hooks/useAsyncData';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { MobileFilterSheet } from '@/components/filters/MobileFilterSheet';
import { SortDropdown } from '@/components/filters/SortDropdown';
import { ProductGrid } from '@/components/product/ProductGrid';
import { renderCategoryIcon } from '@/lib/categoryIcons';
import { NotFoundPage } from './NotFoundPage';

export function CategoryListingPage() {
  const { categorySlug = '', subSlug } = useParams();
  const { filters, setBrands, setMotorcycleBrands, setPriceRange, setSort, setPage, resetFilters } =
    useProductFilters();

  const categoryKey = `${categorySlug}:${subSlug ?? ''}`;
  const { data: categoryData, loading: categoryLoading } = useAsyncData(categoryKey, () =>
    Promise.all([
      catalogService.getCategoryBySlug(categorySlug),
      catalogService.getSubcategories(categorySlug),
      subSlug ? catalogService.getSubcategoryBySlug(categorySlug, subSlug) : Promise.resolve(undefined),
    ]).then(([category, subcategories, subcategory]) => ({ category, subcategories, subcategory })),
  );

  const category = categoryData?.category;
  const subcategory = categoryData?.subcategory;
  const subcategories = categoryData?.subcategories ?? [];
  const notFound = !categoryLoading && categoryData !== undefined && !category;

  const { data: result, loading } = useAsyncData(`${categoryKey}:${JSON.stringify(filters)}`, () =>
    catalogService.getProducts({ ...filters, categorySlug, subcategorySlug: subSlug, pageSize: 12 }),
  );

  const { data: brands } = useAsyncData('available-brands', () => catalogService.getAvailableBrands());

  if (notFound) return <NotFoundPage />;

  const products: Product[] = result?.items ?? [];

  return (
    <div className="container-page py-6">
      <Breadcrumbs
        items={[
          { label: category?.name ?? '', to: `/categoria/${categorySlug}` },
          ...(subcategory ? [{ label: subcategory.name }] : []),
        ]}
      />

      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-violet/15 text-brand-cyan">
          {renderCategoryIcon(category?.iconKey, { size: 20 })}
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            {subcategory?.name ?? category?.name}
          </h1>
          {result && <p className="text-sm text-text-muted">{result.total} productos encontrados</p>}
        </div>
      </div>

      {subcategories.length > 0 && !subSlug && (
        <div className="mt-4 flex flex-wrap gap-2">
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              to={`/categoria/${categorySlug}/${sub.slug}`}
              className="rounded-full border border-border bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-brand-cyan hover:text-brand-cyan"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <div className="hidden lg:block lg:w-64 lg:shrink-0">
          <FilterSidebar
            filters={filters}
            brands={brands ?? []}
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
              brands={brands ?? []}
              onBrandsChange={setBrands}
              onMotorcycleBrandsChange={setMotorcycleBrands}
              onPriceChange={setPriceRange}
              onReset={resetFilters}
            />
            <SortDropdown value={filters.sort} onChange={setSort} />
          </div>

          <ProductGrid products={products} loading={loading} />

          {result && result.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: result.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-lg text-sm font-semibold ${
                    (filters.page ?? 1) === i + 1
                      ? 'bg-brand-gradient text-white'
                      : 'border border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
