/**
 * Fotografías reales de Unsplash (CDN images.unsplash.com), licencia Unsplash
 * (uso comercial libre, sin atribución obligatoria). Los IDs de cada tema se
 * verifican manualmente (curl -o /dev/null -w "%{http_code}") antes de usarse.
 */
export function unsplashImage(id: string, w = 1200, q = 80): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}
