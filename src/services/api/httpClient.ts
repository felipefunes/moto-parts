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

function apiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL;
  if (!base) {
    throw new Error('VITE_API_BASE_URL is not set -- the HTTP catalog service should not be reachable without it.');
  }
  return base.replace(/\/$/, '');
}

function buildUrl(path: string, params?: Record<string, string | number | string[] | undefined>): string {
  const url = new URL(apiBaseUrl() + path);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const v of value) url.searchParams.append(key, v);
    } else {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/** Fetches an endpoint that always returns 200 with a JSON body. */
export async function fetchJson<T>(
  path: string,
  params?: Record<string, string | number | string[] | undefined>,
): Promise<T> {
  const response = await fetch(buildUrl(path, params));
  if (!response.ok) {
    throw new Error(`API request to ${path} failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

/** Fetches an endpoint where a 404 is an expected "not found" outcome, not an error. */
export async function fetchJsonOrNull<T>(
  path: string,
  params?: Record<string, string | number | string[] | undefined>,
): Promise<T | null> {
  const response = await fetch(buildUrl(path, params));
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`API request to ${path} failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}
