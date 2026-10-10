import type { ActivityKey } from './api';

export type { ActivityKey };

export type UnitId = 'UNIDAD_1' | 'UNIDAD_2' | 'UNIDAD_3' | 'UNIDAD_4';

/** Orden canónico de la matriz de 8 actividades (§6). */
export const ACTIVITY_ORDER: readonly ActivityKey[] = [
  'busqueda',
  'documentos',
  'analisis',
  'dataset',
  'ejemplo_r',
  'resultados',
  'latex',
  'sustentacion',
];

export const ACTIVITY_LABELS: Record<ActivityKey, string> = {
  busqueda: 'Búsqueda bibliográfica',
  documentos: 'Documentos seleccionados',
  analisis: 'Análisis bibliográfico',
  dataset: 'Dataset seleccionado',
  ejemplo_r: 'Ejemplo R',
  resultados: 'Resultados',
  latex: 'Documentación LaTeX',
  sustentacion: 'Sustentación',
};

export interface TopicSummary {
  id: string;
  unitId: UnitId;
  nombre: string;
  /** Porcentaje calculado por la API (presencia de archivos, no por estudiante). */
  porcentajeApi: number;
  actividades: Record<ActivityKey, boolean>;
  actividadesCompletadas: number;
}

export interface Unit {
  id: UnitId;
  numero: number;
  nombre: string;
  zona: string;
  pregunta: string;
  porcentajeApi: number;
  temas: TopicSummary[];
}

export interface CourseMetrics {
  totalTemas: number;
  temasCompletadosApi: number;
  totalBusquedas: number;
  documentosSeleccionados: number;
  ejemplosR: number;
  datasets: number;
  documentosLatex: number;
}

export interface CourseProgress {
  porcentajeGlobalApi: number;
  unidades: Unit[];
  metricas: CourseMetrics;
}

/** Ecuación de búsqueda booleana. Campos ausentes en el CSV = null. */
export interface SearchEquation {
  id: string;
  unitId: UnitId;
  topicId: string;
  nivel: string | null;
  consulta: string;
  idioma: string | null;
  objetivo: string | null;
  urlScholar: string | null;
  palabrasClave: string | null;
  operadores: string | null;
  documentosEsperados: string | null;
  justificacion: string | null;
}

export type Pertinencia = 'Alta' | 'Media' | 'Baja';

export interface AcademicDocument {
  id: string;
  unitId: UnitId;
  topicId: string;
  titulo: string;
  autores: string | null;
  anio: number | null;
  tipoPublicacion: string | null;
  fuente: string | null;
  doi: string | null;
  urlScholar: string | null;
  idEcuacionOrigen: string | null;
  pertinencia: Pertinencia | null;
  incluidoRevision: boolean | null;
  objetivo: string | null;
  metodologia: string | null;
  resultados: string | null;
  palabrasClave: string | null;
  observaciones: string | null;
}

export interface DatasetInfo {
  metadata: Record<string, unknown> | null;
  archivo: string | null;
  headers: string[];
  preview: string[][];
}

export interface CodeFile {
  archivo: string;
  codigo: string;
}

export interface ResultImage {
  nombre: string;
  src: string;
}

export interface TopicResults {
  imagenes: ResultImage[];
  metricas: string | null;
}

export interface TopicDetail {
  unitId: UnitId;
  unitName: string;
  topicId: string;
  topicName: string;
  descripcionMd: string | null;
  searches: SearchEquation[];
  documents: AcademicDocument[];
  dataset: DatasetInfo;
  rExample: CodeFile | null;
  results: TopicResults;
  latex: CodeFile | null;
}

export interface RRunResult {
  ok: boolean;
  exitCode: number;
  salida: string;
  results: TopicResults;
}

// ---------------- Autenticación ----------------

export type Role = 'estudiante' | 'docente' | 'administrador';

export interface SessionUser {
  id: string;
  nombre: string;
  rol: Role;
}

export type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: SessionUser }
  | { status: 'anonymous' }
  /** La API PHP no expone autenticación (brecha B1). */
  | { status: 'unavailable'; reason: string };
