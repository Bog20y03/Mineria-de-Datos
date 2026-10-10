/**
 * Configuración central de la API y recursos estáticos.
 * 
 * Configurable mediante variables de entorno:
 * - VITE_API_URL: URL directa y completa al script api/index.php.
 * - VITE_API_BASE o VITE_MD_BASE: Prefijo base de la API.
 *   - En desarrollo: '/md' (utiliza el proxy configurado en vite.config.ts -> Apache).
 *   - En producción servida por Apache: '/api%20vehiculos%20tutoria/MINERIA_DATOS'.
 */
export const API_BASE: string = (
  import.meta.env.VITE_API_BASE ??
  import.meta.env.VITE_MD_BASE ??
  '/md'
).replace(/\/$/, '');

export const MD_BASE: string = API_BASE;

/** Endpoint principal de la API PHP existente (no se modifica). */
export const API_ENDPOINT: string =
  import.meta.env.VITE_API_URL ?? `${API_BASE}/api/index.php`;

/**
 * Endpoint de autenticación PROPUESTO (brecha B1 de Fase 1).
 * La versión 1 es de un solo usuario; si se agrega en el futuro, no tocará api/index.php.
 */
export const AUTH_ENDPOINT: string =
  import.meta.env.VITE_AUTH_URL ?? `${API_BASE}/api/auth.php`;

/**
 * Endpoint de la API aditiva (Fase 5+): curriculum, métricas estructuradas, bitácora y validaciones.
 */
export const EXTRA_ENDPOINT: string =
  import.meta.env.VITE_EXTRA_URL ?? `${API_BASE}/api/extra.php`;

/**
 * Convierte una ruta relativa devuelta por la API (ej: `UNIDAD_1/.../x.png?t=1`)
 * en una URL servible respetando la base configurada.
 */
export function assetUrl(relative: string): string {
  if (!relative) return '';
  const [path, query] = relative.split('?');
  const encoded = path
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join('/');
  return `${API_BASE}/${encoded}${query ? `?${query}` : ''}`;
}

/** Ancho mínimo de ventana a partir del cual se habilita el Modo Mapa. */
export const MAP_MIN_WIDTH = 1024;
