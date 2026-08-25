/**
 * Simula la latencia y errores ocasionales de una futura API REST.
 * Cuando exista backend, este helper se reemplaza por un `fetch()` real
 * sin tener que tocar las firmas de los servicios que lo consumen.
 */
export async function mockRequest<T>(
  data: T,
  { delayMs = 350, failRate = 0 }: { delayMs?: number; failRate?: number } = {},
): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  if (Math.random() < failRate) {
    throw new Error('Error de red simulado. Intenta nuevamente.');
  }
  return data;
}
