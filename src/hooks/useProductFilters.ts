import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ProductFilters } from '@/types';

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ProductFilters = useMemo(() => {
    const brands = searchParams.get('marca')?.split(',').filter(Boolean);
    const motorcycleBrands = searchParams.get('moto')?.split(',').filter(Boolean);
    const priceMin = searchParams.get('precioMin');
    const priceMax = searchParams.get('precioMax');
    const page = searchParams.get('pagina');
    const sort = searchParams.get('orden') as ProductFilters['sort'] | null;

    return {
      brands: brands?.length ? brands : undefined,
      motorcycleBrands: motorcycleBrands?.length ? motorcycleBrands : undefined,
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      sort: sort ?? 'relevance',
      page: page ? Number(page) : 1,
    };
  }, [searchParams]);

  function updateParam(key: string, value: string | string[] | undefined) {
    const next = new URLSearchParams(searchParams);
    if (!value || (Array.isArray(value) && value.length === 0)) {
      next.delete(key);
    } else {
      next.set(key, Array.isArray(value) ? value.join(',') : value);
    }
    if (key !== 'pagina') next.delete('pagina');
    setSearchParams(next, { replace: true });
  }

  return {
    filters,
    setBrands: (brands: string[]) => updateParam('marca', brands),
    setMotorcycleBrands: (brands: string[]) => updateParam('moto', brands),
    setPriceRange: (min?: number, max?: number) => {
      const next = new URLSearchParams(searchParams);
      if (min) next.set('precioMin', String(min));
      else next.delete('precioMin');
      if (max) next.set('precioMax', String(max));
      else next.delete('precioMax');
      next.delete('pagina');
      setSearchParams(next, { replace: true });
    },
    setSort: (sort: string) => updateParam('orden', sort),
    setPage: (page: number) => updateParam('pagina', String(page)),
    resetFilters: () => setSearchParams({}, { replace: true }),
  };
}
