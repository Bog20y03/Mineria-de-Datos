import { apiGet } from './api';
import type { ApiTopicDataResponse } from '../types/api';
import type { TopicDetail, UnitId } from '../types/domain';
import { emptyToNull, mapDocument, mapImages, mapSearch } from './mappers';

/**
 * Obtiene todos los recursos académicos asociados a un tema desde api/index.php?action=topic_data
 */
export async function getTopicDetail(
  unitId: UnitId,
  topicId: string,
  options: { refresh?: boolean } = {}
): Promise<TopicDetail> {
  const raw = await apiGet<ApiTopicDataResponse>(
    { action: 'topic_data', u: unitId, t: topicId },
    { cache: !options.refresh }
  );

  const searches = (raw.busquedas || []).map((row) => mapSearch(row, unitId, topicId));
  const documents = (raw.documentos || []).map((row) => mapDocument(row, unitId, topicId));

  const dataset = {
    metadata: raw.dataset?.metadata || null,
    archivo: emptyToNull(raw.dataset?.archivo),
    headers: raw.dataset?.headers || [],
    preview: raw.dataset?.preview || [],
  };

  const rExample =
    raw.ejemplo_r && raw.ejemplo_r.archivo
      ? {
          archivo: raw.ejemplo_r.archivo,
          codigo: raw.ejemplo_r.codigo || '',
        }
      : null;

  const results = {
    imagenes: mapImages(raw.resultados?.imagenes || []),
    metricas: emptyToNull(raw.resultados?.metricas),
  };

  const latex =
    raw.latex && raw.latex.archivo
      ? {
          archivo: raw.latex.archivo,
          codigo: raw.latex.codigo || '',
        }
      : null;

  return {
    unitId,
    unitName: raw.unidad_nombre,
    topicId,
    topicName: raw.tema_nombre,
    descripcionMd: emptyToNull(raw.descripcion_md),
    searches,
    documents,
    dataset,
    rExample,
    results,
    latex,
  };
}
