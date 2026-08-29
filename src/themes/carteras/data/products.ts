import type { Product } from '@/types';
import { slugify } from '@/lib/slugify';
import { unsplashImage } from '@/lib/unsplash';
import { IMAGES } from './images';

interface ProductSeed {
  name: string;
  categorySlug: 'bandoleras' | 'totes' | 'clutches';
  priceClp: number;
  compareAtPriceClp?: number;
  stock: number;
  shortDescription: string;
  material: string;
  dimensions: string;
  color: string;
  craftDays: string;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
}

const SEEDS: ProductSeed[] = [
  // Bandoleras
  { name: 'Bandolera Mapocho', categorySlug: 'bandoleras', priceClp: 34990, compareAtPriceClp: 39990, stock: 14, shortDescription: 'Bandolera de cuero cognac, ideal para el día a día.', material: 'Cuero vacuno curtido vegetal', dimensions: '22 x 16 x 7 cm', color: 'Cognac', craftDays: '3 días', rating: 4.8, reviewsCount: 41, isFeatured: true },
  { name: 'Bandolera Trewa', categorySlug: 'bandoleras', priceClp: 32990, stock: 10, shortDescription: 'Diseño minimalista en cuero café oscuro con costuras a mano.', material: 'Cuero vacuno', dimensions: '20 x 15 x 6 cm', color: 'Café oscuro', craftDays: '3 días', rating: 4.6, reviewsCount: 22 },
  { name: 'Bandolera Ñielol', categorySlug: 'bandoleras', priceClp: 29990, stock: 18, shortDescription: 'Bandolera en gamuza terracota, liviana y versátil.', material: 'Gamuza', dimensions: '21 x 14 x 6 cm', color: 'Terracota', craftDays: '2 días', rating: 4.5, reviewsCount: 17 },
  { name: 'Bandolera Curicó', categorySlug: 'bandoleras', priceClp: 31990, stock: 12, shortDescription: 'Bandolera negra de cuero, con bolsillo interior con cierre.', material: 'Cuero vacuno', dimensions: '22 x 16 x 7 cm', color: 'Negro', craftDays: '3 días', rating: 4.7, reviewsCount: 29 },

  // Totes
  { name: 'Tote Elqui', categorySlug: 'totes', priceClp: 45990, compareAtPriceClp: 52990, stock: 9, shortDescription: 'Tote grande de cuero cognac, perfecto para la oficina.', material: 'Cuero vacuno curtido vegetal', dimensions: '38 x 30 x 14 cm', color: 'Cognac', craftDays: '4 días', rating: 4.9, reviewsCount: 36, isFeatured: true },
  { name: 'Tote Rapel', categorySlug: 'totes', priceClp: 42990, stock: 11, shortDescription: 'Tote de cuero natural con asas reforzadas.', material: 'Cuero vacuno', dimensions: '36 x 28 x 13 cm', color: 'Natural', craftDays: '4 días', rating: 4.6, reviewsCount: 19 },
  { name: 'Tote Bío Bío', categorySlug: 'totes', priceClp: 27990, stock: 20, shortDescription: 'Tote combinado de lona y cuero, liviano para el uso diario.', material: 'Lona y cuero', dimensions: '35 x 30 x 12 cm', color: 'Crudo / café', craftDays: '2 días', rating: 4.4, reviewsCount: 14 },
  { name: 'Tote Aconcagua', categorySlug: 'totes', priceClp: 47990, stock: 7, shortDescription: 'Tote estructurado de cuero grueso, con base reforzada.', material: 'Cuero vacuno grueso', dimensions: '37 x 29 x 15 cm', color: 'Café', craftDays: '5 días', rating: 4.8, reviewsCount: 24 },

  // Clutches
  { name: 'Clutch Valle', categorySlug: 'clutches', priceClp: 24990, compareAtPriceClp: 28990, stock: 16, shortDescription: 'Clutch tipo sobre en cuero cognac, para ocasiones especiales.', material: 'Cuero vacuno', dimensions: '28 x 20 x 3 cm', color: 'Cognac', craftDays: '2 días', rating: 4.7, reviewsCount: 20, isFeatured: true },
  { name: 'Clutch Andes', categorySlug: 'clutches', priceClp: 22990, stock: 13, shortDescription: 'Clutch minimalista en cuero negro con cierre metálico.', material: 'Cuero vacuno', dimensions: '26 x 18 x 3 cm', color: 'Negro', craftDays: '2 días', rating: 4.5, reviewsCount: 12 },
  { name: 'Clutch Titán', categorySlug: 'clutches', priceClp: 23990, stock: 15, shortDescription: 'Clutch en gamuza terracota con detalle de costura contrastante.', material: 'Gamuza', dimensions: '27 x 19 x 3 cm', color: 'Terracota', craftDays: '2 días', rating: 4.6, reviewsCount: 15 },
  { name: 'Clutch Sobre Maule', categorySlug: 'clutches', priceClp: 21990, stock: 19, shortDescription: 'Clutch tipo sobre en cuero natural, formato simple y elegante.', material: 'Cuero vacuno', dimensions: '26 x 17 x 2 cm', color: 'Natural', craftDays: '1 día', rating: 4.4, reviewsCount: 9 },
];

function imagesFor(categorySlug: string, index: number): string[] {
  const pool = IMAGES[categorySlug as keyof typeof IMAGES] as readonly string[];
  const first = pool[index % pool.length];
  const second = pool[(index + 1) % pool.length];
  return [first, second];
}

function buildProducts(): Product[] {
  return SEEDS.map((seed, index) => {
    const [imgA, imgB] = imagesFor(seed.categorySlug, index);
    const tags: string[] = [];
    if (seed.compareAtPriceClp) tags.push('oferta');
    if (seed.isFeatured) tags.push('destacado');

    return {
      id: `p-${String(index + 1).padStart(3, '0')}`,
      slug: `${slugify(seed.name)}`,
      sku: `RW-${seed.categorySlug.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(4, '0')}`,
      name: seed.name,
      brand: 'RW',
      categoryId: seed.categorySlug,
      subcategoryId: seed.categorySlug,
      description: `${seed.name}, hecha a mano en Chile. ${seed.shortDescription} Cada pieza es única y puede presentar leves variaciones propias del trabajo artesanal. Incluye garantía de manufactura y despacho a todo Chile.`,
      shortDescription: seed.shortDescription,
      priceClp: seed.priceClp,
      compareAtPriceClp: seed.compareAtPriceClp,
      currency: 'CLP',
      stock: seed.stock,
      condition: 'new',
      images: [
        { url: unsplashImage(imgA, 1200), alt: seed.name, isPrimary: true },
        { url: unsplashImage(imgB, 1200), alt: `${seed.name} — detalle` },
      ],
      specs: [
        { label: 'Material', value: seed.material },
        { label: 'Dimensiones', value: seed.dimensions },
        { label: 'Color', value: seed.color },
        { label: 'Tiempo de elaboración', value: seed.craftDays },
      ],
      rating: seed.rating,
      reviewsCount: seed.reviewsCount,
      warrantyMonths: 3,
      tags,
      isFeatured: seed.isFeatured,
      createdAt: new Date(2026, 1, 1 + index).toISOString(),
    };
  });
}

export const PRODUCTS: Product[] = buildProducts();

export const PRODUCT_BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand))).sort();
