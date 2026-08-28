import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Product } from '@/types';

export interface ThemePillar {
  icon: LucideIcon;
  title: string;
  text: string;
}

export interface ThemeConfig {
  /** Identificador corto, usado en SKUs y para logging/debug. */
  id: string;
  siteName: string;
  tagline: string;
  searchPlaceholder: string;

  /** Categoría de entrada usada por el CTA del hero y por "ver todo" en destacados. */
  primaryCategoryHref: string;

  hero: {
    badgeIcon: LucideIcon;
    badge: string;
    titleTop: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimaryLabel: string;
    imageId: string; // id de foto de Unsplash
  };

  /** Franja bajo el hero: marcas de moto compatibles en un tema, materiales/artesanía en otro. */
  strip: {
    title: string;
    items: string[];
  };

  about: {
    intro: string;
    pillars: ThemePillar[];
  };

  howToBuy: {
    steps: ThemePillar[];
  };

  footerDescription: string;

  /** Si es true, los filtros muestran la sección de marca/modelo de vehículo compatible (usa `strip.items` como opciones). */
  hasCompatibilityFilter: boolean;
  compatibilityFilterLabel?: string;

  Logo: ComponentType<{ size?: 'sm' | 'md' | 'lg'; showTagline?: boolean; className?: string }>;

  /** Panel opcional en la ficha de producto (ej. compatibilidad de motos). Si no se define, no se renderiza esa sección. */
  ProductExtraSection?: ComponentType<{ product: Product }>;
}
