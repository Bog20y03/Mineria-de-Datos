import { apiPost, clearApiCache } from './api';
import type { ApiRunRResponse } from '../types/api';
import type { RRunResult, UnitId } from '../types/domain';
import { emptyToNull, mapImages } from './mappers';

export type { ApiRunRResponse };

/**
 * Servicio de ejecución de R (runService / rService)
 * Invoca el endpoint api/index.php?action=run_r con los parámetros de unidad y tema.
 */
export async function runTopicRScript(
  unitId: UnitId,
  topicId: string,
  scriptName?: string
): Promise<RRunResult> {
  const body: Record<string, string> = { u: unitId, t: topicId };
  if (scriptName) {
    body.script = scriptName;
  }
  const raw = await apiPost<ApiRunRResponse>(
    { action: 'run_r' },
    body
  );

  const isOk = raw.status === 'success' && raw.exit_code === 0;
  if (isOk) {
    clearApiCache();
  }

  return {
    ok: isOk,
    exitCode: raw.exit_code,
    salida: raw.salida || '',
    results: {
      imagenes: mapImages(raw.imagenes || []),
      metricas: emptyToNull(raw.metricas),
    },
  };
}

/** Alias para compatibilidad con código existente */
export const executeRScript = runTopicRScript;
