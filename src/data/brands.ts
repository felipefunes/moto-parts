/** Marcas de repuestos aftermarket reales, mencionadas de forma descriptiva (catálogo de compatibilidad, no venta bajo licencia de marca). */
export const PART_BRANDS = [
  'NGK',
  'Brembo',
  'DID',
  'K&N',
  'Bosch',
  'Motul',
  'EBC Brakes',
  'Hiflofiltro',
  'Denso',
  'Renthal',
  'Vesrah',
  'Pirelli',
  'Michelin',
  'RK Chains',
  'Mahle',
] as const;

export type PartBrand = (typeof PART_BRANDS)[number];
