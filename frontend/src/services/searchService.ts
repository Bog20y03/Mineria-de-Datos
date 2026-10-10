import type { SearchEquation, UnitId } from '../types/domain';
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

const STORAGE_KEY_SAVED = 'md_saved_searches';
const STORAGE_KEY_HISTORY = 'md_search_history';

/**
 * Obtiene todas las ecuaciones de búsqueda registradas en la API recorriendo los temas.
 * Se cachean en memoria para alimentar el motor de búsqueda booleano global.
 */
let allSearchesCache: SearchEquation[] | null = null;

export async function getAllCanonicalSearches(forceRefresh = false): Promise<SearchEquation[]> {
  if (allSearchesCache && !forceRefresh) {
    return allSearchesCache;
  }

  const progress = await getCourseProgress();
  const allSearches: SearchEquation[] = [];

  for (const unit of progress.unidades) {
    for (const topic of unit.temas) {
      try {
        const detail = await getTopicDetail(unit.id, topic.id, { refresh: forceRefresh });
        allSearches.push(...detail.searches);
      } catch (err) {
        console.warn(`Error al cargar búsquedas de ${unit.id}/${topic.id}:`, err);
      }
    }
  }

  allSearchesCache = allSearches;
  return allSearches;
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
    // 100 originales canónicas de U1
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
  // Soporte básico para OR / AND
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

// Historial y guardado local (marcado transparente como almacenamiento local)
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
