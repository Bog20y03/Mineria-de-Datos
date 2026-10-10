import type { SearchEquation, TopicDetail, UnitId } from '../types/domain';
import { getTopicDetail } from './topicService';
import { getCourseProgress } from './progressService';

export interface SavedSearch {
  id: string;
  query: string;
  unitId?: UnitId;
  topicId?: string;
  timestamp: number;
  notes?: string;
  isCustom?: boolean;
}

export interface ExternalAcademicPaper {
  id: string;
  doi: string;
  title: string;
  authors: string;
  year: number | null;
  journal: string | null;
  url: string;
  abstract?: string;
  publisher?: string;
}

export type InternalResultType = 'topic' | 'equation' | 'document' | 'r_script' | 'dataset';

export interface InternalSearchResult {
  id: string;
  type: InternalResultType;
  title: string;
  subtitle: string;
  snippet?: string;
  unitId: UnitId;
  topicId: string;
  topicName: string;
  url?: string;
  doi?: string;
}

const STORAGE_KEY_SAVED = 'md_saved_searches';
const STORAGE_KEY_HISTORY = 'md_search_history';

/**
 * Caché en memoria para alimentar el motor de búsqueda booleano global e híbrido.
 */
let allSearchesCache: SearchEquation[] | null = null;
let allTopicDetailsCache: TopicDetail[] | null = null;

export async function getAllTopicDetails(forceRefresh = false): Promise<TopicDetail[]> {
  if (allTopicDetailsCache && !forceRefresh) {
    return allTopicDetailsCache;
  }

  const progress = await getCourseProgress();
  const allDetails: TopicDetail[] = [];

  for (const unit of progress.unidades) {
    for (const topic of unit.temas) {
      try {
        const detail = await getTopicDetail(unit.id, topic.id, { refresh: forceRefresh });
        allDetails.push(detail);
      } catch (err) {
        console.warn(`Error al cargar detalle de ${unit.id}/${topic.id}:`, err);
      }
    }
  }

  allTopicDetailsCache = allDetails;
  return allDetails;
}

/**
 * Obtiene todas las ecuaciones de búsqueda registradas en la API recorriendo los temas.
 */
export async function getAllCanonicalSearches(forceRefresh = false): Promise<SearchEquation[]> {
  if (allSearchesCache && !forceRefresh) {
    return allSearchesCache;
  }

  const details = await getAllTopicDetails(forceRefresh);
  const allSearches: SearchEquation[] = [];

  for (const detail of details) {
    allSearches.push(...detail.searches);
  }

  allSearchesCache = allSearches;
  return allSearches;
}

/**
 * Búsqueda de literatura científica real en vivo mediante la API abierta de CrossRef (DOI).
 */
export async function searchExternalAcademicPapers(
  query: string,
  rows = 10,
  signal?: AbortSignal
): Promise<ExternalAcademicPaper[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const endpoint = `https://api.crossref.org/works?query=${encodeURIComponent(cleanQuery)}&rows=${rows}&sort=relevance`;

  try {
    const res = await fetch(endpoint, {
      signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`CrossRef API HTTP ${res.status}`);
    }

    const data = await res.json();
    const items = data?.message?.items || [];

    return items.map((item: Record<string, unknown>, idx: number) => {
      // Título
      const titleArr = item.title as string[] | undefined;
      const title = titleArr?.[0] || 'Artículo científico sin título';

      // Autores
      const authorList = (item.author as Array<{ given?: string; family?: string }>) || [];
      const authors = authorList.length > 0
        ? authorList.map((a) => [a.given, a.family].filter(Boolean).join(' ')).join(', ')
        : (item.publisher as string) || 'Autores no especificados';

      // Año
      const pubPrint = item['published-print'] as { 'date-parts'?: number[][] } | undefined;
      const issued = item.issued as { 'date-parts'?: number[][] } | undefined;
      const year = pubPrint?.['date-parts']?.[0]?.[0] || issued?.['date-parts']?.[0]?.[0] || null;

      // Revista o contenedor
      const containerArr = item['container-title'] as string[] | undefined;
      const journal = containerArr?.[0] || (item.publisher as string) || 'Revista científica indexada';

      // DOI y URL
      const doi = (item.DOI as string) || '';
      const url = (item.URL as string) || (doi ? `https://doi.org/${doi}` : `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`);

      // Abstract limpio
      let abstract = (item.abstract as string) || undefined;
      if (abstract) {
        abstract = abstract.replace(/<[^>]*>/g, '').trim();
      }

      return {
        id: `crossref_${doi || idx}`,
        doi,
        title,
        authors,
        year,
        journal,
        url,
        abstract,
        publisher: item.publisher as string | undefined,
      };
    });
  } catch (err: unknown) {
    if (signal?.aborted) {
      return [];
    }
    console.error('Error al consultar CrossRef API:', err);
    throw err;
  }
}

/**
 * Búsqueda instantánea en todo el repositorio del curso:
 * Temas (24), Ecuaciones (105), Documentos indexados (127), Scripts R (24), Datasets (26).
 */
export async function searchInternalRepository(query: string): Promise<InternalSearchResult[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const details = await getAllTopicDetails();
  const results: InternalSearchResult[] = [];

  // Separar términos booleanos básicos
  const terms = cleanQuery
    .replace(/[()"]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && t !== 'and' && t !== 'or' && t !== 'not');

  const matchesAny = (text: string) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    if (lower.includes(cleanQuery)) return true;
    return terms.some((t) => lower.includes(t));
  };

  for (const d of details) {
    // 1. Coincidencia en el Tema
    if (matchesAny(d.topicName) || matchesAny(d.topicId) || matchesAny(d.descripcionMd || '')) {
      results.push({
        id: `topic_${d.topicId}`,
        type: 'topic',
        title: d.topicName,
        subtitle: `Tema del plan de estudios • ${d.unitName}`,
        snippet: d.descripcionMd?.slice(0, 160) || `Unidad ${d.unitId}`,
        unitId: d.unitId,
        topicId: d.topicId,
        topicName: d.topicName,
      });
    }

    // 2. Coincidencias en Ecuaciones de Búsqueda
    for (const s of d.searches) {
      if (matchesAny(s.consulta) || matchesAny(s.objetivo || '') || matchesAny(s.id) || matchesAny(s.palabrasClave || '')) {
        results.push({
          id: `eq_${s.id}`,
          type: 'equation',
          title: `Ecuación: ${s.id}`,
          subtitle: `Consulta booleana en ${d.topicName}`,
          snippet: s.consulta,
          unitId: d.unitId,
          topicId: d.topicId,
          topicName: d.topicName,
          url: s.urlScholar || undefined,
        });
      }
    }

    // 3. Coincidencias en Documentos Indexados
    for (const doc of d.documents) {
      if (matchesAny(doc.titulo) || matchesAny(doc.autores || '') || matchesAny(doc.doi || '') || matchesAny(doc.objetivo || '')) {
        results.push({
          id: `doc_${doc.id}`,
          type: 'document',
          title: doc.titulo,
          subtitle: `${doc.autores || 'Autores'} (${doc.anio || 's.f.'}) • ${d.topicName}`,
          snippet: doc.objetivo || doc.fuente || 'Artículo indexado',
          unitId: d.unitId,
          topicId: d.topicId,
          topicName: d.topicName,
          url: doc.urlScholar || (doc.doi ? `https://doi.org/${doc.doi}` : undefined),
          doi: doc.doi || undefined,
        });
      }
    }

    // 4. Coincidencias en Scripts en R
    if (d.rExample) {
      if (matchesAny(d.rExample.archivo) || matchesAny(d.topicName) || matchesAny(d.rExample.codigo.slice(0, 500))) {
        results.push({
          id: `r_${d.topicId}`,
          type: 'r_script',
          title: `Script R: ${d.rExample.archivo}`,
          subtitle: `Algoritmo reproducible en ${d.topicName}`,
          snippet: d.rExample.codigo.slice(0, 180),
          unitId: d.unitId,
          topicId: d.topicId,
          topicName: d.topicName,
        });
      }
    }

    // 5. Coincidencias en Datasets
    if (d.dataset && d.dataset.archivo) {
      if (matchesAny(d.dataset.archivo) || matchesAny(d.dataset.headers.join(' '))) {
        results.push({
          id: `dataset_${d.topicId}`,
          type: 'dataset',
          title: `Dataset: ${d.dataset.archivo}`,
          subtitle: `Columnas: ${d.dataset.headers.slice(0, 5).join(', ')}...`,
          snippet: `Estructura tabular para experimentación en ${d.topicName}`,
          unitId: d.unitId,
          topicId: d.topicId,
          topicName: d.topicName,
        });
      }
    }
  }

  return results;
}

/**
 * Filtra búsquedas utilizando lógica booleana simple (AND, OR, NOT) o texto plano.
 */
export function filterSearches(
  searches: SearchEquation[],
  query: string,
  filters?: {
    unitId?: UnitId | 'ALL';
    topicId?: string | 'ALL';
    onlyOriginalU1?: boolean;
  }
): SearchEquation[] {
  let filtered = searches;

  if (filters?.unitId && filters.unitId !== 'ALL') {
    filtered = filtered.filter((s) => s.unitId === filters.unitId);
  }

  if (filters?.topicId && filters.topicId !== 'ALL') {
    filtered = filtered.filter((s) => s.topicId === filters.topicId);
  }

  if (filters?.onlyOriginalU1) {
    filtered = filtered.filter((s) => {
      const id = s.id.toUpperCase();
      return (
        id.startsWith('MD-') ||
        id.startsWith('KDD-') ||
        id.startsWith('CRISP-') ||
        id.startsWith('MOD-') ||
        id.startsWith('MH-') ||
        id.startsWith('PRED-') ||
        id.startsWith('DW-')
      );
    });
  }

  const trimmed = query.trim();
  if (!trimmed) return filtered;

  const qUpper = trimmed.toUpperCase();
  if (qUpper.includes(' OR ')) {
    const parts = qUpper.split(' OR ').map((p) => p.trim());
    return filtered.filter((s) => {
      const target = `${s.id} ${s.consulta} ${s.objetivo || ''} ${s.palabrasClave || ''}`.toUpperCase();
      return parts.some((p) => p && target.includes(p));
    });
  }

  if (qUpper.includes(' AND ')) {
    const parts = qUpper.split(' AND ').map((p) => p.trim());
    return filtered.filter((s) => {
      const target = `${s.id} ${s.consulta} ${s.objetivo || ''} ${s.palabrasClave || ''}`.toUpperCase();
      return parts.every((p) => !p || target.includes(p));
    });
  }

  const clean = trimmed.toLowerCase();
  return filtered.filter((s) => {
    const target = `${s.id} ${s.consulta} ${s.objetivo || ''} ${s.palabrasClave || ''} ${s.nivel || ''}`.toLowerCase();
    return target.includes(clean);
  });
}

// Historial y guardado local
export function getSavedSearches(): SavedSearch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSearch(search: Omit<SavedSearch, 'id' | 'timestamp'>): SavedSearch {
  const list = getSavedSearches();
  const newItem: SavedSearch = {
    ...search,
    id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
  };
  list.unshift(newItem);
  localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(list.slice(0, 50)));
  return newItem;
}

export function deleteSavedSearch(id: string): void {
  const list = getSavedSearches().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(list));
}

export function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordSearchHistory(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;
  const list = getSearchHistory().filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
  list.unshift(trimmed);
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(list.slice(0, 30)));
}
