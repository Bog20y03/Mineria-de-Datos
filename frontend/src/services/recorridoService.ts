/**
 * Servicio de Recorrido del Usuario en La Máquina (Fase 6A)
 * Registra en localStorage qué estaciones operó el usuario por tema con éxito real.
 * No simula y mantiene desacoplados los componentes de la persistencia local.
 */

export type StationId = 'terminal' | 'biblioteca' | 'laboratorio' | 'escritorio' | 'pizarra';

export interface StationDefinition {
  id: StationId;
  numero: number;
  nombre: string;
  subtitulo: string;
  objetoEntrada: string;
  objetoSalida: string;
  queOcurre: string;
}

export const ESTACIONES_LISTA: StationDefinition[] = [
  {
    id: 'terminal',
    numero: 1,
    nombre: 'Terminal',
    subtitulo: 'Consultas Booleanas',
    objetoEntrada: 'Tema de investigación',
    objetoSalida: 'Ecuaciones de búsqueda verificadas',
    queOcurre: 'Inspecciona las ecuaciones booleanas del tema y formula la búsqueda documental.',
  },
  {
    id: 'biblioteca',
    numero: 2,
    nombre: 'Biblioteca',
    subtitulo: 'Acervo Documental',
    objetoEntrada: 'Ecuaciones de búsqueda',
    objetoSalida: 'Documentos seleccionados y DOI',
    queOcurre: 'Explora los artículos indexados, pertinencia metodológica y referencias académicas.',
  },
  {
    id: 'laboratorio',
    numero: 3,
    nombre: 'Laboratorio',
    subtitulo: 'Experimentación en R',
    objetoEntrada: 'Dataset CSV + Script R',
    objetoSalida: 'Gráficas PNG, consola y métricas reales',
    queOcurre: 'Ejecuta el script R real con Rscript, capturando salida estándar, código de retorno y gráficas.',
  },
  {
    id: 'escritorio',
    numero: 4,
    nombre: 'Escritorio',
    subtitulo: 'Redacción Académica',
    objetoEntrada: 'Gráficas y resultados validados',
    objetoSalida: 'Artículo científico en LaTeX (.tex)',
    queOcurre: 'Revisa y exporta el código LaTeX formateado con trazabilidad y estructura formal.',
  },
  {
    id: 'pizarra',
    numero: 5,
    nombre: 'Pizarra',
    subtitulo: 'Sustentación del Proyecto',
    objetoEntrada: 'Artículo LaTeX + evidencias',
    objetoSalida: 'Material integral de sustentación',
    queOcurre: 'Consolida la presentación ejecutiva, diapositivas y guion defensivo del proyecto.',
  },
];

const STORAGE_KEY = 'mineria_recorrido_maquina_v1';

export interface RecorridoState {
  operadasPorTema: Record<string, StationId[]>;
}

export function getRecorrido(): RecorridoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { operadasPorTema: {} };
    return JSON.parse(raw);
  } catch {
    return { operadasPorTema: {} };
  }
}

export function getEstacionesOperadas(unitId: string, topicId: string): StationId[] {
  const state = getRecorrido();
  const key = `${unitId}/${topicId}`;
  return state.operadasPorTema[key] || [];
}

export function isEstacionOperada(unitId: string, topicId: string, stationId: StationId): boolean {
  const operadas = getEstacionesOperadas(unitId, topicId);
  return operadas.includes(stationId);
}

export function registrarEstacionOperada(unitId: string, topicId: string, stationId: StationId): void {
  const state = getRecorrido();
  const key = `${unitId}/${topicId}`;
  const list = state.operadasPorTema[key] || [];
  if (!list.includes(stationId)) {
    state.operadasPorTema[key] = [...list, stationId];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('[recorridoService] No se pudo guardar en localStorage:', e);
    }
  }
}

export function reiniciarRecorridoTema(unitId: string, topicId: string): void {
  const state = getRecorrido();
  delete state.operadasPorTema[`${unitId}/${topicId}`];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[recorridoService] No se pudo reiniciar tema:', e);
  }
}

export function reiniciarTodoElRecorrido(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('[recorridoService] No se pudo reiniciar todo:', e);
  }
}
