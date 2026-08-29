import type { Category } from '@/types';
import { unsplashImage } from '@/lib/unsplash';
import { CATEGORY_IMAGES } from './images';

interface CategorySeed {
  slug: string;
  name: string;
  iconKey: string;
  description: string;
}

const SEED: CategorySeed[] = [
  { slug: 'bandoleras', name: 'Bandoleras', iconKey: 'shopping-bag', description: 'Carteras cruzadas de uso diario, hechas a mano en cuero.' },
  { slug: 'totes', name: 'Totes', iconKey: 'package', description: 'Bolsos grandes tipo shopper, ideales para el día a día.' },
  { slug: 'clutches', name: 'Clutches y sobres', iconKey: 'gem', description: 'Carteras de mano para ocasiones especiales.' },
];

export const CATEGORIES: Category[] = SEED.map((cat) => ({
  id: cat.slug,
  slug: cat.slug,
  name: cat.name,
  parentId: null,
  description: cat.description,
  iconKey: cat.iconKey,
  imageUrl: unsplashImage(CATEGORY_IMAGES[cat.slug], 800, 75),
}));

export const TOP_LEVEL_CATEGORIES = CATEGORIES;

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Este tema no tiene subcategorías (a propósito, para mantenerlo simple). */
export function getSubcategories(_parentSlug: string): Category[] {
  return [];
}

export function getSubcategoryBySlug(_parentSlug: string, _subSlug: string): Category | undefined {
  return undefined;
}
