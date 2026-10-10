import { apiExtraGet } from './api';
import { ENCARGOS_UNIDADES } from '../data/narrativa';

export interface CurriculumUnit {
  id: string;
  numero: number;
  nombre: string;
  pregunta_problema: string;
}

interface CurriculumApiResponse {
  status: string;
  total_unidades: number;
  unidades: CurriculumUnit[];
}

/**
 * Obtiene el currículum oficial y las preguntas problema desde la API aditiva (api/extra.php?action=curriculum).
 * Si la API no está disponible o falla, utiliza ENCARGOS_UNIDADES de src/data/narrativa.ts como respaldo.
 */
export async function getCurriculum(): Promise<CurriculumUnit[]> {
  try {
    const res = await apiExtraGet<CurriculumApiResponse>({ action: 'curriculum' });
    if (res && Array.isArray(res.unidades) && res.unidades.length > 0) {
      return res.unidades;
    }
  } catch (err) {
    console.warn('[unitService] Fallback a datos locales de narrativa.ts:', err);
  }

  // Respaldo desde narrativa.ts garantizando cero roturas
  console.warn('[unitService] Aviso: Utilizando respaldo local de narrativa.ts para el currículum.');
  return Object.values(ENCARGOS_UNIDADES).map((u) => ({
    id: `UNIDAD_${u.numero}`,
    numero: u.numero,
    nombre: u.titulo,
    pregunta_problema: u.preguntaProblema,
  }));
}

/**
 * Obtiene la pregunta problema exacta para una unidad dada (1..4).
 */
export async function getPreguntaProblema(unitNumero: number): Promise<string> {
  const curriculum = await getCurriculum();
  const unit = curriculum.find((u) => u.numero === unitNumero);
  if (unit) return unit.pregunta_problema;

  // Fallback directo si no se encuentra
  const fallback = ENCARGOS_UNIDADES[unitNumero as 1 | 2 | 3 | 4];
  return fallback?.preguntaProblema ?? 'Pregunta problema no registrada.';
}
