import type { UnitId } from '../types/domain';

/**
 * Metadatos académicos definidos en la especificación del curso (§5).
 * NO son datos de la API ni mocks: son texto curricular fijo (zona narrativa y
 * pregunta problema) que la API no expone. La estructura de unidades/temas
 * SIEMPRE proviene de la API.
 */
export interface UnitCurriculum {
  numero: number;
  zona: string;
  pregunta: string;
}

export const UNIT_CURRICULUM: Record<UnitId, UnitCurriculum> = {
  UNIDAD_1: {
    numero: 1,
    zona: 'Biblioteca',
    pregunta:
      '¿Qué aplicaciones empresariales encuentra para la minería de datos y cómo las puede aprovechar en su vida profesional?',
  },
  UNIDAD_2: {
    numero: 2,
    zona: 'Taller de teoría',
    pregunta:
      '¿Cómo las matemáticas son aprovechadas para desarrollar técnicas y modelos de minería que posteriormente son sintetizados en algoritmos para desarrollar estrategias de negocio como e-commerce, marketing, entre otros?',
  },
  UNIDAD_3: {
    numero: 3,
    zona: 'Laboratorio',
    pregunta:
      '¿Cómo aplicar diferentes técnicas de minería de datos a bases de datos existentes en empresas o bases de datos gubernamentales?',
  },
  UNIDAD_4: {
    numero: 4,
    zona: 'Sala de sustentación',
    pregunta:
      'Proyecto final: selección de base de datos, análisis, selección de técnica, aplicación, resultados, documentación y sustentación.',
  },
};

export function isUnitId(value: string | undefined): value is UnitId {
  return value !== undefined && value in UNIT_CURRICULUM;
}
