/**
 * Fotografías reales de Unsplash (CDN images.unsplash.com), licencia Unsplash
 * (uso comercial libre, sin atribución obligatoria). IDs verificados manualmente.
 */
export function unsplashImage(id: string, w = 1200, q = 80): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

export const IMAGES = {
  hero: {
    sunsetRider: '1636989098361-c5dfcf3acdde',
    silhouetteCouple: '1594966345302-2b954c02098f',
    workshop: '1766170507513-ef249e0ca426',
  },
  motor: [
    '1623000411403-f859051cce71',
    '1585824856707-e3c55cdda547',
    '1611601070828-5c0641c26a3e',
    '1534755563369-ad37931ac77b',
    '1620002093367-5e0bef06be96',
  ],
  frenos: ['1654454118061-8eba6014e7bc', '1648817709811-89f2d7e29657'],
  transmision: ['1657873961503-89a65459de2b', '1668425104412-0c176d33e986'],
  suspension: ['1563743157646-b34fce2a89bb'],
  neumaticos: ['1634071257121-8cd59787ff1c', '1693254945286-37318637c997'],
  escapes: ['1752774941461-b4b6e9d70c79', '1672626923169-dae917c72864'],
  electrico: [
    '1549767606-283c0b172844',
    '1629909060812-966060d8bd35',
    '1421894054319-b4dcc51d41e3',
    '1681852844102-8912e4baebe5',
    '1579117668079-bc683eb1c57c',
  ],
} as const;

/** Categorías sin foto propia verificada aún: reutilizan la imagen más cercana disponible (TODO post-demo). */
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  motor: IMAGES.motor[0],
  frenos: IMAGES.frenos[0],
  suspension: IMAGES.suspension[0],
  transmision: IMAGES.transmision[0],
  electrico: IMAGES.electrico[0],
  filtros: IMAGES.motor[1],
  neumaticos: IMAGES.neumaticos[0],
  escapes: IMAGES.escapes[0],
  carroceria: IMAGES.hero.workshop,
  luces: IMAGES.electrico[0],
  arranque: IMAGES.electrico[3],
  refrigeracion: IMAGES.motor[2],
  combustible: IMAGES.motor[3],
  instrumentos: IMAGES.electrico[2],
  herramientas: IMAGES.hero.workshop,
};
