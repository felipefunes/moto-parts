export const CHILEAN_REGIONS = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana de Santiago',
  "O'Higgins",
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes',
] as const;

export type ChileanRegion = (typeof CHILEAN_REGIONS)[number];

export interface Address {
  id?: string;
  fullName: string;
  rut?: string;
  phone: string;
  email: string;
  street: string;
  number: string;
  apartment?: string;
  commune: string;
  region: ChileanRegion;
  city: string;
  zipCode?: string;
  additionalInfo?: string;
}
