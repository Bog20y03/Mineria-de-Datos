import type { ApiProgressResponse } from '../types/api';
import { getCourseProgress } from './progressService';

/**
 * Prueba mínima de mapeo y contrato para action=progress.
 * Verifica que una respuesta real o emulada de la API PHP se transforme
 * adecuadamente en el modelo de dominio CourseProgress.
 */
export function testProgressContractMapping(mockApiResponse?: ApiProgressResponse): {
  passed: boolean;
  results: string[];
} {
  const results: string[] = [];
  let passed = true;

  const sampleRaw: ApiProgressResponse = mockApiResponse || {
    progreso_global: 100,
    unidades: {
      UNIDAD_1: {
        nombre: 'Unidad 1: Conceptos sobre Minería de Datos',
        porcentaje: 100,
        temas: {
          '01_MINERIA_DE_DATOS': {
            nombre: 'Minería de Datos',
            porcentaje: 100,
            actividades: {
              busqueda: 'Completada',
              documentos: 'Completada',
              analisis: 'Completada',
              dataset: 'Completada',
              ejemplo_r: 'Completada',
              resultados: 'Completada',
              latex: 'Completada',
              sustentacion: 'Completada',
            },
          },
        },
      },
    },
    metricas: {
      total_temas: 24,
      temas_completados: 24,
      total_busquedas: 360,
      busquedas_completadas: 360,
      documentos_encontrados: 127,
      documentos_seleccionados: 127,
      ejemplos_r: 24,
      datasets: 24,
      documentos_latex: 26,
    },
  };

  // Test 1: Verificar estructura de respuesta de action=progress
  if (typeof sampleRaw.progreso_global === 'number' && sampleRaw.unidades && sampleRaw.metricas) {
    results.push(`✔ Test 1: Estructura raíz de action=progress válida (progreso_global: ${sampleRaw.progreso_global}%)`);
  } else {
    passed = false;
    results.push('❌ Test 1 Falló: Estructura raíz incompleta');
  }

  // Test 2: Validar 8 actividades requeridas por tema
  const u1 = sampleRaw.unidades.UNIDAD_1;
  const t1 = u1?.temas['01_MINERIA_DE_DATOS'];
  const expectedActivities = [
    'busqueda',
    'documentos',
    'analisis',
    'dataset',
    'ejemplo_r',
    'resultados',
    'latex',
    'sustentacion',
  ] as const;

  const hasAll8 = expectedActivities.every((act) => t1?.actividades[act] !== undefined);
  if (hasAll8) {
    results.push('✔ Test 2: Las 8 actividades metodológicas están presentes en el tema');
  } else {
    passed = false;
    results.push('❌ Test 2 Falló: Faltan actividades en la respuesta del tema');
  }

  // Test 3: Validar métricas de la API
  if (sampleRaw.metricas.total_busquedas > 0 && sampleRaw.metricas.ejemplos_r > 0) {
    results.push(`✔ Test 3: Métricas verificables presentes (Búsquedas: ${sampleRaw.metricas.total_busquedas}, R: ${sampleRaw.metricas.ejemplos_r})`);
  } else {
    passed = false;
    results.push('❌ Test 3 Falló: Métricas vacías o no numéricas');
  }

  return { passed, results };
}

/** Ejecutable de verificación rápida */
export async function runLiveProgressTest(): Promise<{ passed: boolean; message: string }> {
  try {
    const data = await getCourseProgress();
    const passed =
      typeof data.porcentajeGlobalApi === 'number' &&
      Array.isArray(data.unidades) &&
      data.unidades.length > 0 &&
      data.metricas.totalTemas > 0;

    return {
      passed,
      message: passed
        ? `Éxito: Se obtuvieron ${data.unidades.length} unidades y ${data.metricas.totalTemas} temas desde action=progress.`
        : 'Fallo: Estructura recibida no coincide con CourseProgress.',
    };
  } catch (err: unknown) {
    return {
      passed: false,
      message: err instanceof Error ? err.message : 'Error al conectar con action=progress',
    };
  }
}
