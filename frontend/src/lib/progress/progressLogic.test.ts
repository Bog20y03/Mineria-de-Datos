import {
  calculateAcademicXP,
  calculateLevel,
  calculateMissionStatus,
  evaluateAchievements,
  XP_VALUES,
} from './progressLogic';
import type { CourseProgress, TopicSummary, Unit } from '../../types/domain';

export function runProgressLogicTests(): { passed: boolean; details: string[] } {
  const details: string[] = [];
  let passed = true;

  // Test 1: Level thresholds
  const lvl1 = calculateLevel(0);
  if (lvl1.nivel === 1 && lvl1.rango === 'Explorador') {
    details.push('✔ Test 1: Nivel 1 (0 XP) es Explorador');
  } else {
    passed = false;
    details.push(`❌ Test 1 Falló: nivel ${lvl1.nivel}, rango ${lvl1.rango}`);
  }

  const lvl4 = calculateLevel(5000);
  if (lvl4.nivel === 4 && lvl4.rango === 'Científico de Datos') {
    details.push('✔ Test 2: Nivel 4 (5000 XP) es Científico de Datos');
  } else {
    passed = false;
    details.push(`❌ Test 2 Falló: nivel ${lvl4.nivel}, rango ${lvl4.rango}`);
  }

  // Test 2: Mission Status calculation
  const dummyTopic: TopicSummary = {
    id: '01_MINERIA_DE_DATOS',
    unitId: 'UNIDAD_1',
    nombre: 'Minería de Datos',
    porcentajeApi: 100,
    actividades: {
      busqueda: true,
      documentos: true,
      analisis: true,
      dataset: true,
      ejemplo_r: true,
      resultados: true,
      latex: true,
      sustentacion: true,
    },
    actividadesCompletadas: 8,
  };

  const dummyUnit: Unit = {
    id: 'UNIDAD_1',
    numero: 1,
    nombre: 'Unidad 1',
    zona: 'Biblioteca',
    pregunta: 'Pregunta',
    porcentajeApi: 100,
    temas: [dummyTopic],
  };

  const statusDominado = calculateMissionStatus(dummyTopic, dummyUnit, undefined, true);
  if (statusDominado.estado === 'dominado' && statusDominado.porcentaje === 100) {
    details.push('✔ Test 3: Misión 8/8 con documento de pertinencia alta es Dominado');
  } else {
    passed = false;
    details.push(`❌ Test 3 Falló: estado ${statusDominado.estado}`);
  }

  const topicIncomplete: TopicSummary = {
    ...dummyTopic,
    actividadesCompletadas: 4,
  };
  const statusProgreso = calculateMissionStatus(topicIncomplete, dummyUnit);
  if (statusProgreso.estado === 'en_progreso' && statusProgreso.porcentaje === 50) {
    details.push('✔ Test 4: Misión 4/8 es en_progreso con 50%');
  } else {
    passed = false;
    details.push(`❌ Test 4 Falló: estado ${statusProgreso.estado}`);
  }

  // Test 3: XP Calculation based on real facts
  const dummyCourse: CourseProgress = {
    porcentajeGlobalApi: 100,
    unidades: [dummyUnit],
    metricas: {
      totalTemas: 1,
      temasCompletadosApi: 1,
      totalBusquedas: 15,
      documentosSeleccionados: 15,
      ejemplosR: 1,
      datasets: 1,
      documentosLatex: 1,
    },
  };

  const calculatedXp = calculateAcademicXP(dummyCourse);
  const expectedMinXp =
    15 * XP_VALUES.BUSQUEDA_EJECUTADA +
    15 * XP_VALUES.DOCUMENTO_SELECCIONADO +
    1 * XP_VALUES.DATASET_VINCULADO +
    1 * XP_VALUES.EJEMPLO_R_REGISTRADO +
    1 * XP_VALUES.LATEX_GENERADO +
    1 * XP_VALUES.TEMA_COMPLETADO +
    1 * XP_VALUES.UNIDAD_COMPLETADA;

  if (calculatedXp === expectedMinXp) {
    details.push(`✔ Test 5: Cálculo riguroso de XP con hechos verificables (${calculatedXp} XP)`);
  } else {
    passed = false;
    details.push(`❌ Test 5 Falló: calculado ${calculatedXp}, esperado ${expectedMinXp}`);
  }

  // Test 4: Achievements
  const achievements = evaluateAchievements(dummyCourse);
  if (Array.isArray(achievements) && achievements.length === 5) {
    details.push('✔ Test 6: 5 logros evaluados correctamente');
  } else {
    passed = false;
    details.push('❌ Test 6 Falló en evaluación de logros');
  }

  return { passed, details };
}
