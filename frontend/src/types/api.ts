/**
 * Contrato EXACTO de la API PHP existente (api/index.php).
 * Estos tipos describen la respuesta cruda; la UI nunca los usa directamente,
 * sino los tipos de dominio de `types/domain.ts` producidos por `services/`.
 */

export type ActivityKey =
  | 'busqueda'
  | 'documentos'
  | 'analisis'
  | 'dataset'
  | 'ejemplo_r'
  | 'resultados'
  | 'latex'
  | 'sustentacion';

export type ApiActivityStatus = 'Completada' | 'Pendiente';

export interface ApiTopicProgress {
  nombre: string;
  porcentaje: number;
  actividades: Record<ActivityKey, ApiActivityStatus>;
}

export interface ApiUnitProgress {
  nombre: string;
  porcentaje: number;
  temas: Record<string, ApiTopicProgress>;
}

export interface ApiMetrics {
  total_temas: number;
  temas_completados: number;
  total_busquedas: number;
  busquedas_completadas: number;
  documentos_encontrados: number;
  documentos_seleccionados: number;
  ejemplos_r: number;
  datasets: number;
  documentos_latex: number;
}

/** GET ?action=progress */
export interface ApiProgressResponse {
  progreso_global: number;
  unidades: Record<string, ApiUnitProgress>;
  metricas: ApiMetrics;
}

/** Fila CSV combinada por PHP con array_combine (todas las columnas como string). */
export type ApiCsvRow = Record<string, string>;

export interface ApiImage {
  nombre: string;
  url: string;
}

/** GET ?action=topic_data&u=&t= */
export interface ApiTopicDataResponse {
  unidad_id: string;
  unidad_nombre: string;
  tema_id: string;
  tema_nombre: string;
  descripcion_md: string;
  busquedas: ApiCsvRow[];
  documentos: ApiCsvRow[];
  dataset: {
    metadata: Record<string, unknown> | null;
    archivo: string;
    headers: string[];
    preview: string[][];
  };
  ejemplo_r: { archivo: string; codigo: string };
  resultados: { imagenes: ApiImage[]; metricas: string };
  latex: { archivo: string; codigo: string };
}

/** GET|POST ?action=run_r&u=&t= */
export interface ApiRunRResponse {
  status: 'success' | 'error';
  exit_code: number;
  salida: string;
  imagenes: ApiImage[];
  metricas: string;
}

export interface ApiErrorBody {
  error: string;
}
