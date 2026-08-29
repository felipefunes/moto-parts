import type { MotorcycleCompatibility } from '@/types';

/** Modelos de moto reales, populares en el parque circulante chileno. */
export const MOTORCYCLE_MODELS: MotorcycleCompatibility[] = [
  { brand: 'Honda', model: 'CBR 250R', yearFrom: 2011, yearTo: 2017 },
  { brand: 'Honda', model: 'XR 150L', yearFrom: 2015, yearTo: 2024 },
  { brand: 'Honda', model: 'CB 190R', yearFrom: 2017, yearTo: 2024 },
  { brand: 'Honda', model: 'Wave 110', yearFrom: 2010, yearTo: 2024 },
  { brand: 'Yamaha', model: 'YBR 125', yearFrom: 2008, yearTo: 2022 },
  { brand: 'Yamaha', model: 'MT-03', yearFrom: 2016, yearTo: 2024 },
  { brand: 'Yamaha', model: 'XTZ 250', yearFrom: 2012, yearTo: 2023 },
  { brand: 'Suzuki', model: 'GN 125', yearFrom: 2005, yearTo: 2020 },
  { brand: 'Suzuki', model: 'DR 650', yearFrom: 2010, yearTo: 2024 },
  { brand: 'Kawasaki', model: 'Ninja 300', yearFrom: 2013, yearTo: 2022 },
  { brand: 'Kawasaki', model: 'KLX 150', yearFrom: 2014, yearTo: 2023 },
  { brand: 'KTM', model: 'Duke 200', yearFrom: 2013, yearTo: 2024 },
  { brand: 'Bajaj', model: 'Boxer 150', yearFrom: 2012, yearTo: 2024 },
  { brand: 'TVS', model: 'Apache RTR 160', yearFrom: 2016, yearTo: 2024 },
  { brand: 'Zanella', model: 'RX 150', yearFrom: 2014, yearTo: 2023 },
];

export const MOTORCYCLE_BRANDS = Array.from(new Set(MOTORCYCLE_MODELS.map((m) => m.brand)));
