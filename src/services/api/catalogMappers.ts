import type { Category, Currency, Product, ProductCondition } from '@/types';
import type { components } from './generated/types';

type ApiCategoryDetail = components['schemas']['CategoryDetailResponse'];
type ApiSubcategory = components['schemas']['SubcategoryResponse'];

// openapi-typescript reports these two fields as `primary`/`featured` because springdoc
// mis-introspects Kotlin's `is`-prefixed Boolean properties when building the OpenAPI schema.
// Verified against the actual backend (rpm-parts-backend v0.1.0+) with curl: the real JSON on
// the wire is `isPrimary` / `isFeatured`, matching the Kotlin field names exactly -- only the
// *generated schema* is wrong. Re-check this comment after any `npm run sync:api-types` bump in
// case a future springdoc/openapi-typescript version fixes the introspection.
type ApiProductImage = Omit<components['schemas']['ProductImageResponse'], 'primary'> & {
  isPrimary: boolean;
};
export type ApiProduct = Omit<components['schemas']['ProductResponse'], 'images' | 'featured'> & {
  images: ApiProductImage[];
  isFeatured: boolean;
};

// Category.description is left undefined here: CategoryDetailResponse doesn't expose a
// description field -- the backend doesn't return one at all, unlike the mock (whose theme SEED
// data always has one). No current component reads category.description, so this is a dormant
// gap, not a live bug; if that changes, the backend needs a description column/field before this
// mapper can fill it in.
export function mapTopLevelCategory(api: ApiCategoryDetail): Category {
  return {
    id: api.slug!,
    slug: api.slug!,
    name: api.name!,
    parentId: null,
    iconKey: api.iconKey ?? undefined,
    imageUrl: api.imageUrl ?? undefined,
  };
}

export function mapSubcategory(parentSlug: string, api: ApiSubcategory): Category {
  return {
    id: `${parentSlug}-${api.slug}`,
    slug: api.slug!,
    name: api.name!,
    parentId: parentSlug,
  };
}

export function mapProduct(api: ApiProduct): Product {
  return {
    id: api.id!,
    slug: api.slug!,
    sku: api.sku!,
    name: api.name!,
    brand: api.brand!,
    categoryId: api.categoryId!,
    subcategoryId: api.subcategoryId!,
    description: api.description!,
    shortDescription: api.shortDescription!,
    priceClp: api.priceClp!,
    compareAtPriceClp: api.compareAtPriceClp ?? undefined,
    currency: api.currency as Currency,
    stock: api.stock!,
    condition: api.condition as ProductCondition,
    images: (api.images ?? []).map((img) => ({
      url: img.url!,
      alt: img.alt!,
      isPrimary: img.isPrimary,
    })),
    specs: (api.specs ?? []).map((spec) => ({ label: spec.label!, value: spec.value! })),
    compatibility: (api.compatibility ?? []).map((c) => ({
      brand: c.brand!,
      model: c.model!,
      yearFrom: c.yearFrom!,
      yearTo: c.yearTo!,
    })),
    rating: api.rating!,
    reviewsCount: api.reviewsCount!,
    warrantyMonths: api.warrantyMonths!,
    weightKg: api.weightKg ?? undefined,
    tags: api.tags ?? [],
    isFeatured: api.isFeatured,
    createdAt: api.createdAt!,
  };
}
