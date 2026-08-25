import type { Category, Product, ProductFilters } from '@/types';
import { CATEGORIES, TOP_LEVEL_CATEGORIES, getCategoryBySlug, getSubcategories, getSubcategoryBySlug } from '@/data/categories';
import { PRODUCTS, PRODUCT_BRANDS } from '@/data/products';
import { MOTORCYCLE_BRANDS } from '@/data/motorcycleModels';
import { mockRequest } from './api/httpClient';

function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products];

  if (filters.categorySlug) {
    result = result.filter((p) => p.categoryId === filters.categorySlug);
  }
  if (filters.subcategorySlug) {
    result = result.filter((p) => p.subcategoryId === `${filters.categorySlug}-${filters.subcategorySlug}`);
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.compatibility.some((c) => `${c.brand} ${c.model}`.toLowerCase().includes(q)),
    );
  }
  if (filters.brands?.length) {
    result = result.filter((p) => filters.brands!.includes(p.brand));
  }
  if (filters.motorcycleBrands?.length) {
    result = result.filter((p) => p.compatibility.some((c) => filters.motorcycleBrands!.includes(c.brand)));
  }
  if (filters.priceMin != null) {
    result = result.filter((p) => p.priceClp >= filters.priceMin!);
  }
  if (filters.priceMax != null) {
    result = result.filter((p) => p.priceClp <= filters.priceMax!);
  }
  if (filters.condition) {
    result = result.filter((p) => p.condition === filters.condition);
  }

  switch (filters.sort) {
    case 'price_asc':
      result.sort((a, b) => a.priceClp - b.priceClp);
      break;
    case 'price_desc':
      result.sort((a, b) => b.priceClp - a.priceClp);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default:
      result.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.reviewsCount - a.reviewsCount);
  }

  return result;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const catalogService = {
  getCategories: (): Promise<Category[]> => mockRequest(CATEGORIES),

  getTopLevelCategories: (): Promise<Category[]> => mockRequest(TOP_LEVEL_CATEGORIES),

  getCategoryBySlug: (slug: string): Promise<Category | undefined> =>
    mockRequest(getCategoryBySlug(slug)),

  getSubcategories: (parentSlug: string): Promise<Category[]> => mockRequest(getSubcategories(parentSlug)),

  getSubcategoryBySlug: (parentSlug: string, subSlug: string): Promise<Category | undefined> =>
    mockRequest(getSubcategoryBySlug(parentSlug, subSlug)),

  getProducts: (filters: ProductFilters = {}): Promise<PaginatedProducts> => {
    const filtered = applyFilters(PRODUCTS, filters);
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 12;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return mockRequest({
      items,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    });
  },

  getProductBySlug: (slug: string): Promise<Product | undefined> =>
    mockRequest(PRODUCTS.find((p) => p.slug === slug)),

  getFeaturedProducts: (limit = 8): Promise<Product[]> =>
    mockRequest(PRODUCTS.filter((p) => p.isFeatured).slice(0, limit)),

  getRelatedProducts: (product: Product, limit = 4): Promise<Product[]> =>
    mockRequest(
      PRODUCTS.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, limit),
    ),

  getAvailableBrands: (): Promise<string[]> => mockRequest(PRODUCT_BRANDS),

  getAvailableMotorcycleBrands: (): Promise<string[]> => mockRequest(MOTORCYCLE_BRANDS),
};
