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
  type LucideIcon,
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
};

export function getCategoryIcon(iconKey?: string): LucideIcon {
  return (iconKey && CATEGORY_ICONS[iconKey]) || Cog;
}
