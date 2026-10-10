import type { ApiCsvRow, ApiImage } from '../types/api';
import type { AcademicDocument, Pertinencia, ResultImage, SearchEquation, UnitId } from '../types/domain';
import { assetUrl } from '../config';

/**
 * Conversión de filas CSV (dos esquemas distintos en disco) a tipos de dominio.
 * Esquema A (U1): tema_id, id_ecuacion, consulta, palabras_clave, operadores...
 * Esquema B (U2–U4): id_ecuacion, tema, consulta_booleana, idioma...
 * Un campo ausente o vacío se devuelve como null → la UI muestra "Sin datos registrados".
 */

function pick(row: ApiCsvRow, ...keys: string[]): string | null {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value.trim() !== '') return value.trim();
  }
  return null;
}

export function mapSearch(row: ApiCsvRow, unitId: UnitId, topicId: string): SearchEquation {
  return {
    id: pick(row, 'id_ecuacion', 'ID_Ecuacion') ?? '',
    unitId,
    topicId,
    nivel: pick(row, 'nivel'),
    consulta: pick(row, 'consulta', 'consulta_booleana') ?? '',
    idioma: pick(row, 'idioma'),
    objetivo: pick(row, 'objetivo'),
    urlScholar: pick(row, 'url_scholar'),
    palabrasClave: pick(row, 'palabras_clave'),
    operadores: pick(row, 'operadores'),
    documentosEsperados: pick(row, 'documentos_esperados'),
    justificacion: pick(row, 'justificacion'),
  };
}

function toPertinencia(value: string | null): Pertinencia | null {
  if (!value) return null;
  const v = value.toLowerCase();
  if (v.startsWith('alt')) return 'Alta';
  if (v.startsWith('med')) return 'Media';
  if (v.startsWith('baj')) return 'Baja';
  return null;
}

function toBool(value: string | null): boolean | null {
  if (value === null) return null;
  const v = value.toLowerCase();
  if (['true', '1', 'si', 'sí', 'yes'].includes(v)) return true;
  if (['false', '0', 'no'].includes(v)) return false;
  return null;
}

export function mapDocument(row: ApiCsvRow, unitId: UnitId, topicId: string): AcademicDocument {
  const anio = Number.parseInt(pick(row, 'Anio') ?? '', 10);
  return {
    id: pick(row, 'ID') ?? '',
    unitId,
    topicId,
    titulo: pick(row, 'Titulo') ?? 'Sin título registrado',
    autores: pick(row, 'Autores'),
    anio: Number.isFinite(anio) ? anio : null,
    tipoPublicacion: pick(row, 'Tipo_Publicacion'),
    fuente: pick(row, 'Revista_Conferencia'),
    doi: pick(row, 'DOI'),
    urlScholar: pick(row, 'URL_Scholar'),
    idEcuacionOrigen: pick(row, 'ID_Ecuacion_Origen'),
    pertinencia: toPertinencia(pick(row, 'Nivel_Pertinencia', 'Nivel_Pertinencia_Auto')),
    incluidoRevision: toBool(pick(row, 'Incluido_Revision')),
    objetivo: pick(row, 'Objetivo_Estudio'),
    metodologia: pick(row, 'Metodologia_Utilizada'),
    resultados: pick(row, 'Principales_Resultados'),
    palabrasClave: pick(row, 'Palabras_Clave'),
    observaciones: pick(row, 'Observaciones'),
  };
}

export function mapImages(images: ApiImage[]): ResultImage[] {
  return images.map((img) => ({ nombre: img.nombre, src: assetUrl(img.url) }));
}

export function emptyToNull(value: string | null | undefined): string | null {
  return value && value.trim() !== '' ? value : null;
}
