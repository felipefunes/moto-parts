import type { Category, Product, ProductFilters } from '@/types';

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CategoryTreeNode extends Category {
  subcategories: Category[];
}

/**
 * Shape shared by the mock (`catalogService.mock.ts`) and HTTP (`catalogService.http.ts`)
 * implementations. Assigning each implementation to this type is what guarantees they can't
 * silently drift apart -- see CONTRIBUTING.md #7.
 */
export interface CatalogService {
  getTopLevelCategories(): Promise<Category[]>;
  /**
   * All top-level categories together with their subcategories, in one call -- for a nav-style
   * UI that needs to know upfront which categories have subcategories and what they are. Backed
   * by a single `GET /categories` request under HTTP (batch-loaded server-side); prefer this
   * over calling getSubcategories() once per category, which would be one request per category.
   */
  getCategoryTree(): Promise<CategoryTreeNode[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getSubcategories(parentSlug: string): Promise<Category[]>;
  getSubcategoryBySlug(parentSlug: string, subSlug: string): Promise<Category | undefined>;
  getProducts(filters?: ProductFilters): Promise<PaginatedProducts>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getRelatedProducts(product: Product, limit?: number): Promise<Product[]>;
  getAvailableBrands(): Promise<string[]>;
}
