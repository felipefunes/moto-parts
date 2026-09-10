import type { Category, Product, ProductFilters } from '@/types';

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Shape shared by the mock (`catalogService.mock.ts`) and HTTP (`catalogService.http.ts`)
 * implementations. Assigning each implementation to this type is what guarantees they can't
 * silently drift apart -- see CONTRIBUTING.md #7.
 */
export interface CatalogService {
  getTopLevelCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getSubcategories(parentSlug: string): Promise<Category[]>;
  getSubcategoryBySlug(parentSlug: string, subSlug: string): Promise<Category | undefined>;
  getProducts(filters?: ProductFilters): Promise<PaginatedProducts>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getRelatedProducts(product: Product, limit?: number): Promise<Product[]>;
  getAvailableBrands(): Promise<string[]>;
}
