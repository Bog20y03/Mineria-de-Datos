import type { CourseProgress, TopicSummary, Unit, UnitId } from '../../types/domain';

export type MissionStatus = 'bloqueado' | 'disponible' | 'en_progreso' | 'completado' | 'dominado';

export interface MissionState {
  topicId: string;
  unitId: UnitId;
  nombre: string;
  estado: MissionStatus;
  porcentaje: number;
  actividadesCompletadas: number;
  totalActividades: 8;
  esBloqueoSuave: boolean;
  advertenciaBloqueo?: string;
}

export type AcademicRank =
  | 'Explorador'
  | 'Investigador'
  | 'Analista'
  | 'Científico de Datos'
  | 'Investigador Experimental'
  | 'Maestro de Minería de Datos';

export interface LevelInfo {
  nivel: number;
  rango: AcademicRank;
  xpActual: number;
  xpMinimoNivel: number;
  xpSiguienteNivel: number;
  porcentajeNivel: number;
}

export interface Achievement {
  id: string;
  titulo: string;
  descripcion: string;
  desbloqueado: boolean;
  xp: number;
  icono: string;
}

// XP por hechos verificables (Regla 7)
export const XP_VALUES = {
  BUSQUEDA_EJECUTADA: 25,
  DOCUMENTO_SELECCIONADO: 40,
  DATASET_VINCULADO: 60,
  EJEMPLO_R_REGISTRADO: 80,
  RESULTADOS_OBTENIDOS: 80,
  LATEX_GENERADO: 100,
  TEMA_COMPLETADO: 250,
  UNIDAD_COMPLETADA: 600,
  PROYECTO_FINALIZADO: 1500,
} as const;

export const UMBRAL_DESBLOQUEO_UNIDAD = 70; // 70% de actividades completadas en la unidad previa

/**
 * Calcula el estado de una misión a partir de sus actividades y del estado de la unidad anterior.
 */
export function calculateMissionStatus(
  topic: TopicSummary,
  _unit: Unit,
  previousUnit?: Unit,
  hasHighPertinenceDoc = false
): MissionState {
  const completadas = topic.actividadesCompletadas;
  const porcentaje = Math.round((completadas / 8) * 100);

  let estado: MissionStatus = 'disponible';
  let esBloqueoSuave = false;
  let advertenciaBloqueo: string | undefined;

  // Comprobar bloqueo suave si la unidad previa no alcanza el umbral
  if (previousUnit && previousUnit.porcentajeApi < UMBRAL_DESBLOQUEO_UNIDAD) {
    esBloqueoSuave = true;
    advertenciaBloqueo = `La ${previousUnit.nombre} se encuentra en ${previousUnit.porcentajeApi}% (umbral recomendado: ${UMBRAL_DESBLOQUEO_UNIDAD}%). Puedes continuar bajo advertencia metodológica.`;
  }

  if (completadas === 0) {
    estado = esBloqueoSuave ? 'bloqueado' : 'disponible';
  } else if (completadas >= 1 && completadas < 8) {
    estado = 'en_progreso';
  } else if (completadas === 8) {
    estado = hasHighPertinenceDoc ? 'dominado' : 'completado';
  }

  return {
    topicId: topic.id,
    unitId: topic.unitId,
    nombre: topic.nombre,
    estado,
    porcentaje,
    actividadesCompletadas: completadas,
    totalActividades: 8,
    esBloqueoSuave,
    advertenciaBloqueo,
  };
}

/**
 * Escala de rangos y niveles académicos (Gamificación sobria)
 */
export const RANK_THRESHOLDS: { nivel: number; rango: AcademicRank; minXp: number; maxXp: number }[] = [
  { nivel: 1, rango: 'Explorador', minXp: 0, maxXp: 1000 },
  { nivel: 2, rango: 'Investigador', minXp: 1000, maxXp: 2500 },
  { nivel: 3, rango: 'Analista', minXp: 2500, maxXp: 4500 },
  { nivel: 4, rango: 'Científico de Datos', minXp: 4500, maxXp: 7500 },
  { nivel: 5, rango: 'Investigador Experimental', minXp: 7500, maxXp: 11000 },
  { nivel: 6, rango: 'Maestro de Minería de Datos', minXp: 11000, maxXp: 16000 },
];

/**
 * Calcula XP ganado estrictamente a partir de hechos académicos reales y verificables en CourseProgress.
 */
export function calculateAcademicXP(course: CourseProgress): number {
  let xp = 0;

  // Conteo directo de hechos reales
  const m = course.metricas;
  xp += m.totalBusquedas * XP_VALUES.BUSQUEDA_EJECUTADA;
  xp += m.documentosSeleccionados * XP_VALUES.DOCUMENTO_SELECCIONADO;
  xp += m.datasets * XP_VALUES.DATASET_VINCULADO;
  xp += m.ejemplosR * XP_VALUES.EJEMPLO_R_REGISTRADO;
  xp += m.documentosLatex * XP_VALUES.LATEX_GENERADO;

  // Temas completados
  for (const unit of course.unidades) {
    for (const t of unit.temas) {
      if (t.actividadesCompletadas === 8) {
        xp += XP_VALUES.TEMA_COMPLETADO;
      }
    }
    // Unidad completada al 100%
    if (unit.porcentajeApi >= 100) {
      xp += XP_VALUES.UNIDAD_COMPLETADA;
    }
  }

  // Proyecto final (Unidad 4 al 100%)
  const u4 = course.unidades.find((u) => u.id === 'UNIDAD_4');
  if (u4 && u4.porcentajeApi >= 100) {
    xp += XP_VALUES.PROYECTO_FINALIZADO;
  }

  return xp;
}

export function calculateLevel(xp: number): LevelInfo {
  let currentTier = RANK_THRESHOLDS[0];
  for (const tier of RANK_THRESHOLDS) {
    if (xp >= tier.minXp) {
      currentTier = tier;
    }
  }

  const range = currentTier.maxXp - currentTier.minXp;
  const progressInTier = Math.max(0, Math.min(xp - currentTier.minXp, range));
  const porcentajeNivel = Math.round((progressInTier / range) * 100);

  return {
    nivel: currentTier.nivel,
    rango: currentTier.rango,
    xpActual: xp,
    xpMinimoNivel: currentTier.minXp,
    xpSiguienteNivel: currentTier.maxXp,
    porcentajeNivel,
  };
}

/**
 * Evalúa los logros académicos según datos verificables.
 */
export function evaluateAchievements(course: CourseProgress): Achievement[] {
  const m = course.metricas;
  const u4 = course.unidades.find((u) => u.id === 'UNIDAD_4');

  return [
    {
      id: 'ach_biblio',
      titulo: 'Explorador Bibliográfico',
      descripcion: 'Registró más de 50 ecuaciones de búsqueda académicas con enlaces a Google Scholar.',
      desbloqueado: m.totalBusquedas >= 50,
      xp: 300,
      icono: 'BookOpen',
    },
    {
      id: 'ach_investigador',
      titulo: 'Investigador Riguroso',
      descripcion: 'Seleccionó e integró más de 30 artículos canónicos de alto impacto.',
      desbloqueado: m.documentosSeleccionados >= 30,
      xp: 500,
      icono: 'FileText',
    },
    {
      id: 'ach_analista',
      titulo: 'Analista Experimental',
      descripcion: 'Verificó y ejecutó scripts de laboratorio en R con generación de gráficos.',
      desbloqueado: m.ejemplosR >= 10,
      xp: 600,
      icono: 'BarChart2',
    },
    {
      id: 'ach_cientifico',
      titulo: 'Científico de Datos',
      descripcion: 'Completó al menos 15 misiones temáticas con sus 8 actividades rigurosas.',
      desbloqueado: m.temasCompletadosApi >= 15,
      xp: 1000,
      icono: 'Award',
    },
    {
      id: 'ach_proyecto',
      titulo: 'Proyecto Finalizado',
      descripcion: 'Culminó con éxito la Unidad 4: Proyecto Integrador y sustentación de resultados.',
      desbloqueado: Boolean(u4 && u4.porcentajeApi >= 85),
      xp: 1500,
      icono: 'CheckCircle',
    },
  ];
}
