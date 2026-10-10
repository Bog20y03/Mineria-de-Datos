import { apiGet } from './api';
import { UNIT_CURRICULUM, isUnitId } from '../data/curriculum';
import type { ApiProgressResponse } from '../types/api';
import { ACTIVITY_ORDER } from '../types/domain';
import type { ActivityKey, CourseProgress, TopicSummary, Unit } from '../types/domain';

/**
 * Avance del MATERIAL del curso según la API (existencia de archivos por tema).
 * No es progreso por estudiante (ver brecha B2).
 */
export async function getCourseProgress(options: { refresh?: boolean } = {}): Promise<CourseProgress> {
  const raw = await apiGet<ApiProgressResponse>({ action: 'progress' }, { cache: !options.refresh });

  const unidades: Unit[] = Object.entries(raw.unidades)
    .filter(([id]) => isUnitId(id))
    .map(([id, u]) => {
      const unitId = id as Unit['id'];
      const temas: TopicSummary[] = Object.entries(u.temas).map(([topicId, t]) => {
        const actividades = Object.fromEntries(
          ACTIVITY_ORDER.map((key) => [key, t.actividades?.[key] === 'Completada']),
        ) as Record<ActivityKey, boolean>;
        return {
          id: topicId,
          unitId,
          nombre: t.nombre,
          porcentajeApi: t.porcentaje,
          actividades,
          actividadesCompletadas: Object.values(actividades).filter(Boolean).length,
        };
      });
      const curriculum = UNIT_CURRICULUM[unitId];
      return {
        id: unitId,
        numero: curriculum.numero,
        nombre: u.nombre,
        zona: curriculum.zona,
        pregunta: curriculum.pregunta,
        porcentajeApi: u.porcentaje,
        temas,
      };
    })
    .sort((a, b) => a.numero - b.numero);

  const m = raw.metricas;
  return {
    porcentajeGlobalApi: raw.progreso_global,
    unidades,
    metricas: {
      totalTemas: m.total_temas,
      temasCompletadosApi: m.temas_completados,
      totalBusquedas: m.total_busquedas,
      documentosSeleccionados: m.documentos_seleccionados,
      ejemplosR: m.ejemplos_r,
      datasets: m.datasets,
      documentosLatex: m.documentos_latex,
    },
  };
}
