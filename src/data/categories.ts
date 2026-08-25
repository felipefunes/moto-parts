import type { Category } from '@/types';
import { CATEGORY_FALLBACK_IMAGES, unsplashImage } from './images';

interface CategorySeed {
  slug: string;
  name: string;
  iconKey: string;
  description: string;
  subcategories: { slug: string; name: string }[];
}

const SEED: CategorySeed[] = [
  {
    slug: 'motor',
    name: 'Motor',
    iconKey: 'cog',
    description: 'Componentes internos y externos del motor.',
    subcategories: [
      { slug: 'pistones-anillos', name: 'Pistones y anillos' },
      { slug: 'cilindros-culatas', name: 'Cilindros y culatas' },
      { slug: 'juntas-empaquetaduras', name: 'Juntas y empaquetaduras' },
      { slug: 'valvulas-guias', name: 'Válvulas y guías' },
      { slug: 'bombas-aceite-agua', name: 'Bombas de aceite y agua' },
      { slug: 'carter-tapas', name: 'Cárteres y tapas' },
      { slug: 'bielas-ciguenales', name: 'Bielas y cigüeñales' },
    ],
  },
  {
    slug: 'frenos',
    name: 'Frenos',
    iconKey: 'disc',
    description: 'Sistema de frenado completo, delantero y trasero.',
    subcategories: [
      { slug: 'pastillas-freno', name: 'Pastillas de freno' },
      { slug: 'discos-freno', name: 'Discos de freno' },
      { slug: 'bombas-freno', name: 'Bombas maestras y esclavas' },
      { slug: 'latiguillos-mangueras', name: 'Latiguillos y mangueras' },
      { slug: 'liquido-frenos', name: 'Líquido de frenos' },
      { slug: 'cables-freno-tambor', name: 'Cables de freno a tambor' },
    ],
  },
  {
    slug: 'suspension',
    name: 'Suspensión',
    iconKey: 'move-vertical',
    description: 'Horquillas, amortiguadores y componentes de suspensión.',
    subcategories: [
      { slug: 'horquillas', name: 'Horquillas delanteras' },
      { slug: 'amortiguadores', name: 'Amortiguadores traseros' },
      { slug: 'resortes', name: 'Resortes' },
      { slug: 'retenes-sellos', name: 'Retenes y sellos' },
      { slug: 'bujes-rodamientos-suspension', name: 'Bujes y rodamientos' },
    ],
  },
  {
    slug: 'transmision',
    name: 'Transmisión',
    iconKey: 'link-2',
    description: 'Cadenas, piñones, embrague y variadores.',
    subcategories: [
      { slug: 'cadenas', name: 'Cadenas' },
      { slug: 'pinones-coronas', name: 'Piñones y coronas' },
      { slug: 'kits-arrastre', name: 'Kits de arrastre completos' },
      { slug: 'embrague', name: 'Discos y resortes de embrague' },
      { slug: 'correas-cvt', name: 'Correas de transmisión (scooters)' },
      { slug: 'variadores', name: 'Variadores CVT' },
    ],
  },
  {
    slug: 'electrico',
    name: 'Sistema eléctrico',
    iconKey: 'zap',
    description: 'Encendido, carga y componentes electrónicos.',
    subcategories: [
      { slug: 'baterias', name: 'Baterías' },
      { slug: 'bobinas-encendido', name: 'Bobinas de encendido' },
      { slug: 'bujias', name: 'Bujías' },
      { slug: 'reguladores-rectificadores', name: 'Reguladores/rectificadores' },
      { slug: 'cdi-ecu', name: 'CDI / ECU' },
      { slug: 'estatores-volantes', name: 'Estatores y volantes magnéticos' },
      { slug: 'arneses-cableado', name: 'Arneses de cableado' },
    ],
  },
  {
    slug: 'filtros',
    name: 'Filtros',
    iconKey: 'filter',
    description: 'Filtros de aceite, aire y combustible.',
    subcategories: [
      { slug: 'filtros-aceite', name: 'Filtros de aceite' },
      { slug: 'filtros-aire', name: 'Filtros de aire' },
      { slug: 'filtros-combustible', name: 'Filtros de combustible' },
    ],
  },
  {
    slug: 'neumaticos',
    name: 'Neumáticos y ruedas',
    iconKey: 'circle-dot',
    description: 'Neumáticos, llantas y componentes de rueda.',
    subcategories: [
      { slug: 'neumaticos-delanteros', name: 'Neumáticos delanteros' },
      { slug: 'neumaticos-traseros', name: 'Neumáticos traseros' },
      { slug: 'camaras-aire', name: 'Cámaras de aire' },
      { slug: 'llantas-aros', name: 'Llantas y aros' },
      { slug: 'rodamientos-rueda', name: 'Rodamientos de rueda' },
      { slug: 'radios-bujes', name: 'Radios y bujes' },
    ],
  },
  {
    slug: 'escapes',
    name: 'Escapes',
    iconKey: 'wind',
    description: 'Silenciadores, colectores y sistemas completos.',
    subcategories: [
      { slug: 'silenciadores', name: 'Silenciadores (mufflers)' },
      { slug: 'colectores', name: 'Colectores / headers' },
      { slug: 'sistemas-completos', name: 'Sistemas completos' },
      { slug: 'empaques-escape', name: 'Empaques de escape' },
    ],
  },
  {
    slug: 'carroceria',
    name: 'Carrocería y plásticos',
    iconKey: 'shield',
    description: 'Carenados, tanques, asientos y accesorios de carrocería.',
    subcategories: [
      { slug: 'carenados', name: 'Carenados' },
      { slug: 'guardabarros', name: 'Guardabarros' },
      { slug: 'tanques-combustible', name: 'Tanques de combustible' },
      { slug: 'asientos', name: 'Asientos' },
      { slug: 'parrillas', name: 'Parrillas y portaequipajes' },
      { slug: 'manillas-espejos', name: 'Manillas y espejos' },
    ],
  },
  {
    slug: 'luces',
    name: 'Luces y señalización',
    iconKey: 'lightbulb',
    description: 'Iluminación delantera, trasera y señalización.',
    subcategories: [
      { slug: 'focos-delanteros', name: 'Focos delanteros' },
      { slug: 'focos-traseros', name: 'Focos traseros / stop' },
      { slug: 'direccionales', name: 'Direccionales' },
      { slug: 'luces-led', name: 'Luces LED de reemplazo' },
      { slug: 'relays-intermitentes', name: 'Relays e intermitentes' },
    ],
  },
  {
    slug: 'arranque',
    name: 'Arranque y encendido',
    iconKey: 'power',
    description: 'Motores de arranque y kits de encendido.',
    subcategories: [
      { slug: 'motores-arranque', name: 'Motores de arranque' },
      { slug: 'solenoides', name: 'Solenoides' },
      { slug: 'kits-encendido', name: 'Kits de encendido' },
    ],
  },
  {
    slug: 'refrigeracion',
    name: 'Refrigeración',
    iconKey: 'thermometer',
    description: 'Radiadores y sistema de enfriamiento.',
    subcategories: [
      { slug: 'radiadores', name: 'Radiadores' },
      { slug: 'mangueras-refrigerante', name: 'Mangueras de refrigerante' },
      { slug: 'ventiladores', name: 'Ventiladores' },
      { slug: 'termostatos', name: 'Termostatos' },
    ],
  },
  {
    slug: 'combustible',
    name: 'Combustible y admisión',
    iconKey: 'fuel',
    description: 'Carburación, inyección y admisión de aire.',
    subcategories: [
      { slug: 'carburadores', name: 'Carburadores' },
      { slug: 'cuerpos-aceleracion', name: 'Cuerpos de aceleración' },
      { slug: 'bombas-combustible', name: 'Bombas de combustible' },
      { slug: 'inyectores', name: 'Inyectores' },
      { slug: 'mangueras-combustible', name: 'Mangueras de combustible' },
    ],
  },
  {
    slug: 'instrumentos',
    name: 'Instrumentos y tablero',
    iconKey: 'gauge',
    description: 'Velocímetros, sensores y cables de instrumentos.',
    subcategories: [
      { slug: 'velocimetros-tacometros', name: 'Velocímetros y tacómetros' },
      { slug: 'cables-velocimetro', name: 'Cables de velocímetro' },
      { slug: 'sensores', name: 'Sensores (temperatura, nivel)' },
    ],
  },
  {
    slug: 'herramientas',
    name: 'Herramientas y mantención',
    iconKey: 'wrench',
    description: 'Aceites, lubricantes y herramientas de taller.',
    subcategories: [
      { slug: 'aceites-lubricantes', name: 'Aceites y lubricantes' },
      { slug: 'kits-herramientas', name: 'Kits de herramientas' },
      { slug: 'limpieza-detailing', name: 'Limpieza y detailing' },
    ],
  },
];

function buildCategories(): Category[] {
  const categories: Category[] = [];
  for (const cat of SEED) {
    categories.push({
      id: cat.slug,
      slug: cat.slug,
      name: cat.name,
      parentId: null,
      description: cat.description,
      iconKey: cat.iconKey,
      imageUrl: unsplashImage(CATEGORY_FALLBACK_IMAGES[cat.slug], 800, 75),
    });
    for (const sub of cat.subcategories) {
      const id = `${cat.slug}-${sub.slug}`;
      categories.push({
        id,
        slug: sub.slug,
        name: sub.name,
        parentId: cat.slug,
      });
    }
  }
  return categories;
}

export const CATEGORIES: Category[] = buildCategories();

export const TOP_LEVEL_CATEGORIES = CATEGORIES.filter((c) => c.parentId === null);

export function getCategoryBySlug(slug: string): Category | undefined {
  return TOP_LEVEL_CATEGORIES.find((c) => c.slug === slug);
}

export function getSubcategories(parentSlug: string): Category[] {
  return CATEGORIES.filter((c) => c.parentId === parentSlug);
}

export function getSubcategoryBySlug(parentSlug: string, subSlug: string): Category | undefined {
  return CATEGORIES.find((c) => c.parentId === parentSlug && c.slug === subSlug);
}
