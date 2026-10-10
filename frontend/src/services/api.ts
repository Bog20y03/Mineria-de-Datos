import { API_ENDPOINT, EXTRA_ENDPOINT } from '../config';

/** Error HTTP/semántico de la API, con mensaje legible para la UI. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const getCache = new Map<string, Promise<unknown>>();

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    throw new ApiError(
      response.ok
        ? 'La API respondió con un formato no válido (no es JSON).'
        : `La API no está disponible (HTTP ${response.status}). Verifique que Apache (XAMPP) esté encendido.`,
      response.status,
    );
  }
  if (!response.ok || (body && typeof body === 'object' && 'error' in body)) {
    const message = (body as { error?: string }).error ?? `Error HTTP ${response.status}`;
    throw new ApiError(message, response.status);
  }
  return body as T;
}

/** Petición genérica. Único punto de la app que usa `fetch` (junto con authService). */
export async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { credentials: 'include', ...init });
  } catch {
    throw new ApiError('No se pudo conectar con la API PHP. Verifique que Apache (XAMPP) esté encendido.', 0);
  }
  return parseJson<T>(response);
}

function buildUrl(params: Record<string, string>): string {
  return `${API_ENDPOINT}?${new URLSearchParams(params).toString()}`;
}

/** GET a api/index.php con caché en memoria por URL (los datos son de solo lectura). */
export function apiGet<T>(params: Record<string, string>, options: { cache?: boolean } = {}): Promise<T> {
  const url = buildUrl(params);
  const useCache = options.cache ?? true;
  if (useCache && getCache.has(url)) return getCache.get(url) as Promise<T>;
  const promise = request<T>(url);
  if (useCache) {
    getCache.set(url, promise);
    promise.catch(() => getCache.delete(url));
  }
  return promise;
}

function buildExtraUrl(params: Record<string, string>): string {
  return `${EXTRA_ENDPOINT}?${new URLSearchParams(params).toString()}`;
}

/** GET a api/extra.php con caché en memoria por URL (desactivada por defecto para metrics y pipeline_step). */
export function apiExtraGet<T>(params: Record<string, string>, options: { cache?: boolean } = {}): Promise<T> {
  const url = buildExtraUrl(params);
  const action = params.action;
  const defaultCache = !(action === 'metrics' || action === 'pipeline_step');
  const useCache = options.cache ?? defaultCache;
  if (useCache && getCache.has(url)) return getCache.get(url) as Promise<T>;
  const promise = request<T>(url);
  if (useCache) {
    getCache.set(url, promise);
    promise.catch(() => getCache.delete(url));
  }
  return promise;
}

/** POST form-urlencoded (compatible con $_POST de PHP). */
export function apiPost<T>(params: Record<string, string>, body: Record<string, string>): Promise<T> {
  return request<T>(buildUrl(params), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body).toString(),
  });
}

export function clearApiCache(): void {
  getCache.clear();
}
