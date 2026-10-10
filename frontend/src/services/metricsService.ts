/**
 * Servicio para consulta de métricas de modelado (Fase 6A)
 * Intenta recuperar metricas.json enriquecido desde los resultados del tema.
 * Si no está disponible, utiliza el archivo metricas_*.txt como respaldo fidedigno.
 */

export interface MetricasModelo {
  modelo?: string;
  accuracy?: number;
  sensibilidad?: number;
  especificidad?: number;
  auc?: number;
  f1?: number;
  rmse?: number;
  r2?: number;
  k?: number;
  [key: string]: any;
}

export interface MetricasEstandarJson {
  estado: string;
  tema_id?: string;
  tipo_tarea?: string;
  dataset?: string;
  dataset_origen?: string;
  origen_metricas?: string;
  fecha_ejecucion?: string;
  archivos_graficos?: string[];
  baseline_mayoritaria?: number | null;
  supera_baseline?: boolean | null;
  metricas?: Record<string, any>;
  modelos?: MetricasModelo[];
  interpretacion?: string;
}

export interface MetricsFetchResult {
  hasJson: boolean;
  json: MetricasEstandarJson | null;
  txt: string | null;
  displayOutput: string;
}

import { assetUrl } from '../config';

export async function fetchTopicMetrics(
  unitId: string,
  topicId: string,
  fallbackTxt?: string | null
): Promise<MetricsFetchResult> {
  const cleanTxt = fallbackTxt && fallbackTxt.trim() ? fallbackTxt.trim() : null;

  try {
    const url = assetUrl(`${unitId}/${topicId}/resultados/metricas.json?t=${Date.now()}`);
    const response = await fetch(url);
    if (response.ok) {
      const data: MetricasEstandarJson = await response.json();
      return {
        hasJson: true,
        json: data,
        txt: cleanTxt,
        displayOutput: JSON.stringify(data, null, 2),
      };
    }
  } catch (err) {
    // Si no se encuentra o falla la carga, continuamos con el fallback de texto plano
  }

  return {
    hasJson: false,
    json: null,
    txt: cleanTxt,
    displayOutput: cleanTxt || 'Sin datos registrados',
  };
}
