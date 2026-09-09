import { createElement } from 'react';
import {
  Cog,
  Disc,
  MoveVertical,
  Link2,
  Zap,
  Filter,
  CircleDot,
  Wind,
  Shield,
  Lightbulb,
  Power,
  Thermometer,
  Fuel,
  Gauge,
  Wrench,
  ShoppingBag,
  Package,
  Gem,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  cog: Cog,
  disc: Disc,
  'move-vertical': MoveVertical,
  'link-2': Link2,
  zap: Zap,
  filter: Filter,
  'circle-dot': CircleDot,
  wind: Wind,
  shield: Shield,
  lightbulb: Lightbulb,
  power: Power,
  thermometer: Thermometer,
  fuel: Fuel,
  gauge: Gauge,
  wrench: Wrench,
  'shopping-bag': ShoppingBag,
  package: Package,
  gem: Gem,
};

export function getCategoryIcon(iconKey?: string): LucideIcon {
  return (iconKey && CATEGORY_ICONS[iconKey]) || Cog;
}

/** Renders the icon as an element instead of exposing it as a component, so callers
 * don't assign a runtime-selected component to a JSX tag. */
export function renderCategoryIcon(iconKey: string | undefined, props: LucideProps) {
  return createElement(getCategoryIcon(iconKey), props);
}
