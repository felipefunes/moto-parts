export type Currency = 'CLP';
export type ProductCondition = 'new' | 'refurbished';

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface MotorcycleCompatibility {
  brand: string;
  model: string;
  yearFrom: number;
  yearTo: number;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  categoryId: string;
  subcategoryId: string;
  description: string;
  shortDescription: string;
  priceClp: number;
  compareAtPriceClp?: number;
  currency: Currency;
  stock: number;
  condition: ProductCondition;
  images: ProductImage[];
  specs: ProductSpec[];
  compatibility: MotorcycleCompatibility[];
  rating: number;
  reviewsCount: number;
  warrantyMonths: number;
  weightKg?: number;
  tags?: string[];
  isFeatured?: boolean;
  createdAt: string;
}

export interface ProductFilters {
  categorySlug?: string;
  subcategorySlug?: string;
  query?: string;
  brands?: string[];
  motorcycleBrands?: string[];
  priceMin?: number;
  priceMax?: number;
  condition?: ProductCondition;
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  pageSize?: number;
}
