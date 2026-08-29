export const IMAGES = {
  hero: {
    main: '1718622795525-2295971921ba',
    market: '1758188408858-0f5389c35f50',
    workshop: '1635100299010-0410d7434a93',
  },
  bandoleras: ['1718622795525-2295971921ba', '1620786514669-06e2340fce71'],
  totes: ['1624687943971-e86af76d57de', '1654707636750-ab67a11b21b7', '1637759292654-a12cb2be085e'],
  clutches: ['1654773215728-4387196bc2a8', '1688296524548-1d79d1fae657'],
} as const;

/** Todas las categorías tienen foto propia — no hace falta un mapa de fallback como en el tema de motos. */
export const CATEGORY_IMAGES: Record<string, string> = {
  bandoleras: IMAGES.bandoleras[0],
  totes: IMAGES.totes[0],
  clutches: IMAGES.clutches[0],
};
