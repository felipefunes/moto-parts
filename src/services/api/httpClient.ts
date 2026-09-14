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

/** Thrown by `postJson`/`getJsonWithCredentials` on a non-2xx response, carrying the real HTTP
 * status -- callers (authService's consumers) need to tell a 409 (email already registered)
 * apart from a 401 (wrong credentials) apart from a 5xx/network failure, which a single generic
 * `Error` can't express. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

/** Reads the body as text first, then parses only if non-empty -- some endpoints (`/auth/logout`)
 * return 200 with no body at all, and calling `.json()` directly on an empty body throws. */
async function parseJsonBody<T>(response: Response): Promise<T> {
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** POSTs a JSON body and parses a JSON (or empty) response. `init.credentials: 'include'` is
 * required for any `/auth/*` call that needs the browser to send/store the httpOnly refresh
 * cookie -- the API origin (`VITE_API_BASE_URL`) is cross-origin from the frontend dev server,
 * so the default `credentials: 'same-origin'` would silently drop it. */
export async function postJson<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: 'POST',
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new HttpError(response.status, `API request to ${path} failed with status ${response.status}`);
  }
  return parseJsonBody<T>(response);
}

/** GET with a caller-supplied `RequestInit` (e.g. an `Authorization` header) -- `fetchJson` above
 * doesn't take one, since no other GET caller needs it yet. */
export async function getJsonWithInit<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), init);
  if (!response.ok) {
    throw new HttpError(response.status, `API request to ${path} failed with status ${response.status}`);
  }
  return parseJsonBody<T>(response);
}
