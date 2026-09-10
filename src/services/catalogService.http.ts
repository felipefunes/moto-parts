import type { Category, Product, ProductFilters } from '@/types';
import { fetchJson, fetchJsonOrNull } from './api/httpClient';
import {
  mapCategoryDetailAsTopLevel,
  mapProduct,
  mapSubcategory,
  mapTopLevelCategory,
  type ApiProduct,
} from './api/catalogMappers';
import type { components } from './api/generated/types';
import type { CatalogService, PaginatedProducts } from './catalogService.types';

type ApiCategorySummary = components['schemas']['CategorySummaryResponse'];
type ApiCategoryDetail = components['schemas']['CategoryDetailResponse'];
type ApiPaginatedProducts = Omit<components['schemas']['PaginatedProductsResponse'], 'items'> & {
  items: ApiProduct[];
};

async function fetchCategoryDetail(slug: string): Promise<ApiCategoryDetail | null> {
  return fetchJsonOrNull<ApiCategoryDetail>(`/categories/${encodeURIComponent(slug)}`);
}

export const catalogServiceHttp: CatalogService = {
  getTopLevelCategories: async () => {
    const categories = await fetchJson<ApiCategorySummary[]>('/categories');
    return categories.map(mapTopLevelCategory);
  },

  getCategoryBySlug: async (slug: string): Promise<Category | undefined> => {
    const detail = await fetchCategoryDetail(slug);
    return detail ? mapCategoryDetailAsTopLevel(detail) : undefined;
  },

  getSubcategories: async (parentSlug: string): Promise<Category[]> => {
    const detail = await fetchCategoryDetail(parentSlug);
    return (detail?.subcategories ?? []).map((sub) => mapSubcategory(parentSlug, sub));
  },

  getSubcategoryBySlug: async (parentSlug: string, subSlug: string): Promise<Category | undefined> => {
    const detail = await fetchCategoryDetail(parentSlug);
    const sub = detail?.subcategories?.find((s) => s.slug === subSlug);
    return sub ? mapSubcategory(parentSlug, sub) : undefined;
  },

  getProducts: async (filters: ProductFilters = {}): Promise<PaginatedProducts> => {
    const response = await fetchJson<ApiPaginatedProducts>('/products', {
      categorySlug: filters.categorySlug,
      subcategorySlug: filters.subcategorySlug,
      query: filters.query,
      brands: filters.brands,
      motorcycleBrands: filters.motorcycleBrands,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      condition: filters.condition,
      sort: filters.sort,
      page: filters.page,
      pageSize: filters.pageSize,
    });
    return {
      items: (response.items ?? []).map(mapProduct),
      total: response.total!,
      page: response.page!,
      pageSize: response.pageSize!,
      totalPages: response.totalPages!,
    };
  },

  getProductBySlug: async (slug: string): Promise<Product | undefined> => {
    const product = await fetchJsonOrNull<ApiProduct>(`/products/${encodeURIComponent(slug)}`);
    return product ? mapProduct(product) : undefined;
  },

  getFeaturedProducts: async (limit = 8): Promise<Product[]> => {
    const products = await fetchJson<ApiProduct[]>('/products/featured', { limit });
    return products.map(mapProduct);
  },

  getRelatedProducts: async (product: Product, limit = 4): Promise<Product[]> => {
    const related = await fetchJsonOrNull<ApiProduct[]>(`/products/${encodeURIComponent(product.slug)}/related`, {
      limit,
    });
    return related ? related.map(mapProduct) : [];
  },

  getAvailableBrands: (): Promise<string[]> => fetchJson<string[]>('/products/brands'),
};
