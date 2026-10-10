import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  getAllCanonicalSearches,
  searchExternalAcademicPapers,
  searchInternalRepository,
  type ExternalAcademicPaper,
  type InternalSearchResult,
} from '../../services/searchService';
import type { SearchEquation, UnitId } from '../../types/domain';
import {
  Banner,
  Card,
  DataTable,
  StatusBadge,
  Button,
  Loading,
  ErrorMessage,
  type Column,
} from '../ui';
import {
  Binary,
  ExternalLink,
  Filter,
  Copy,
  Check,
  Search,
  X,
  Globe,
  Database,
  BookOpen,
  Layers,
  Code2,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export const ADDITIONAL_DW_IDS = ['DW-011', 'DW-012', 'DW-013', 'DW-014', 'DW-015'] as const;

export interface EnrichedSearchRow extends Record<string, unknown> {
  id: string;
  unitId: UnitId;
  topicId: string;
  topicName: string;
  consulta: string;
  idioma: string;
  fecha: string;
  isAdditional: boolean;
  estadoBadge: 'completado' | 'actual';
  estadoTexto: string;
  resultados: string;
  urlScholar: string | null;
  objetivo: string | null;
}

/**
 * Resaltador visual de sintaxis booleana (AND en terracota, OR en azul, comillas en chip).
 */
const BooleanQueryHighlight: React.FC<{ query: string }> = ({ query }) => {
  const regex = /(".*?"|\bAND\b|\bOR\b|\bNOT\b|\(|\))/g;
  const parts = query.split(regex);

  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', lineHeight: 1.45, wordBreak: 'break-word' }}>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part === 'AND') {
          return (
            <span key={i} style={{ color: 'var(--color-terracotta)', fontWeight: 800, padding: '0 2px' }}>
              AND
            </span>
          );
        }
        if (part === 'OR') {
          return (
            <span key={i} style={{ color: 'var(--color-blue-ink)', fontWeight: 800, padding: '0 2px' }}>
              OR
            </span>
          );
        }
        if (part === 'NOT') {
          return (
            <span key={i} style={{ color: '#dc2626', fontWeight: 800, padding: '0 2px' }}>
              NOT
            </span>
          );
        }
        if (part.startsWith('"') && part.endsWith('"')) {
          return (
            <span
              key={i}
              style={{
                backgroundColor: 'var(--color-blue-soft)',
                color: 'var(--color-ink)',
                padding: '1px 5px',
                borderRadius: '3px',
                border: '1px solid var(--color-blue-border)',
                fontWeight: 600,
              }}
            >
              {part}
            </span>
          );
        }
        if (part === '(' || part === ')') {
          return (
            <span key={i} style={{ color: 'var(--color-ink-muted)', fontWeight: 700 }}>
              {part}
            </span>
          );
        }
        return <span key={i} style={{ color: 'var(--color-ink)' }}>{part}</span>;
      })}
    </span>
  );
};

/**
 * Botón interactivo de 1 clic para copiar ecuaciones booleanas con animación y confirmación.
 */
const CopyEquationButton: React.FC<{ query: string }> = ({ query }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copiar ecuación booleana al portapapeles"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.2rem 0.45rem',
        fontSize: '10px',
        fontWeight: 600,
        backgroundColor: copied ? 'var(--color-blue-soft)' : 'var(--color-card-muted)',
        border: `1px solid ${copied ? 'var(--color-blue-border)' : 'var(--color-border-light)'}`,
        borderRadius: 'var(--radius-sm)',
        color: copied ? 'var(--color-blue-ink)' : 'var(--color-ink-secondary)',
        cursor: 'pointer',
        transition: 'all var(--motion-duration-fast)',
        flexShrink: 0,
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      <span>{copied ? 'Copiada' : 'Copiar'}</span>
    </button>
  );
};

const SUGGESTED_QUERIES = [
  'K-Means clustering',
  'Árboles de decisión CART',
  'Redes neuronales artificiales',
  'CRISP-DM metodología',
  'Data Warehouse OLAP',
  'Series de tiempo STL',
];

export const SearchEngine: React.FC = () => {
  const { course, openTopic } = useApp();

  // Modo de búsqueda actual: 'internal' (repositorio local), 'external' (papers científicos en vivo), 'canonical' (catálogo canónico)
  const [searchTab, setSearchTab] = useState<'internal' | 'external' | 'canonical'>('internal');

  // Input de búsqueda universal
  const [searchQuery, setSearchQuery] = useState<string>('K-Means');

  // Estados de búsqueda interna
  const [internalResults, setInternalResults] = useState<InternalSearchResult[]>([]);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>('ALL');

  // Estados de búsqueda externa en vivo (CrossRef)
  const [externalResults, setExternalResults] = useState<ExternalAcademicPaper[]>([]);
  const [externalLoading, setExternalLoading] = useState<boolean>(false);
  const [externalError, setExternalError] = useState<string | null>(null);

  // Estados del catálogo canónico
  const [allSearches, setAllSearches] = useState<SearchEquation[]>([]);
  const [canonicalLoading, setCanonicalLoading] = useState<boolean>(true);
  const [canonicalError, setCanonicalError] = useState<string | null>(null);

  // Filtros secundarios del catálogo canónico
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'ORIGINAL' | 'ADICIONAL'>('ALL');

  const abortControllerRef = useRef<AbortController | null>(null);

  // Carga inicial del catálogo canónico
  useEffect(() => {
    let isMounted = true;
    setCanonicalLoading(true);
    setCanonicalError(null);

    getAllCanonicalSearches()
      .then((searches) => {
        if (isMounted) {
          setAllSearches(searches);
          setCanonicalLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setCanonicalError(err instanceof Error ? err.message : 'Error al cargar las ecuaciones de búsqueda.');
          setCanonicalLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Ejecutor de búsqueda unificada (Interna y/o Externa)
  const triggerSearch = async (queryToSearch: string) => {
    const q = queryToSearch.trim();
    if (!q) {
      setInternalResults([]);
      setExternalResults([]);
      return;
    }

    // 1. Búsqueda Interna en Repositorio
    setInternalLoading(true);
    try {
      const iRes = await searchInternalRepository(q);
      setInternalResults(iRes);
    } catch (err) {
      console.error('Error en búsqueda interna:', err);
    } finally {
      setInternalLoading(false);
    }

    // 2. Búsqueda Externa en APIs Científicas (CrossRef)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setExternalLoading(true);
    setExternalError(null);

    try {
      const extRes = await searchExternalAcademicPapers(q, 8, abortControllerRef.current.signal);
      setExternalResults(extRes);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setExternalError('No se pudo conectar con la API de literatura científica (CrossRef). Verifica tu conexión a internet.');
      }
    } finally {
      setExternalLoading(false);
    }
  };

  // Disparo automático inicial con la sugerencia por defecto
  useEffect(() => {
    triggerSearch(searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(searchQuery);
  };

  const handleApplySuggestion = (s: string) => {
    setSearchQuery(s);
    triggerSearch(s);
  };

  // Mapa de nombres de temas
  const topicNameMap = useMemo(() => {
    const map = new Map<string, string>();
    if (!course) return map;
    for (const u of course.unidades) {
      for (const t of u.temas) {
        map.set(t.id, t.nombre);
      }
    }
    return map;
  }, [course]);

  // Lista enriquecida de filas para el catálogo canónico
  const enrichedRows = useMemo<EnrichedSearchRow[]>(() => {
    return allSearches.map((s) => {
      const isAdditional = (ADDITIONAL_DW_IDS as readonly string[]).includes(s.id.toUpperCase());
      const topicName = topicNameMap.get(s.topicId) || s.topicId.replace(/^\d+_/, '').replace(/_/g, ' ');

      return {
        id: s.id,
        unitId: s.unitId,
        topicId: s.topicId,
        topicName,
        consulta: s.consulta,
        idioma: s.idioma || 'Bilingüe (ES/EN)',
        fecha: 'Octubre 2024',
        isAdditional,
        estadoBadge: isAdditional ? 'actual' : 'completado',
        estadoTexto: isAdditional ? 'Adicional (sin doc)' : 'Original (verificada)',
        resultados: isAdditional ? '0 docs' : s.documentosEsperados || '1 doc / >10 citas',
        urlScholar: s.urlScholar,
        objetivo: s.objetivo,
      };
    });
  }, [allSearches, topicNameMap]);

  // Filtrado reactivo por tema, idioma y categoría del catálogo
  const filteredCanonicalRows = useMemo(() => {
    return enrichedRows.filter((row) => {
      if (selectedTopic !== 'ALL' && row.topicId !== selectedTopic) return false;
      if (selectedLanguage !== 'ALL') {
        const langLower = (row.idioma as string).toLowerCase();
        if (selectedLanguage === 'ES' && !langLower.includes('es') && !langLower.includes('español')) return false;
        if (selectedLanguage === 'EN' && !langLower.includes('en') && !langLower.includes('inglés')) return false;
      }
      if (selectedCategory === 'ORIGINAL' && row.isAdditional) return false;
      if (selectedCategory === 'ADICIONAL' && !row.isAdditional) return false;
      return true;
    });
  }, [enrichedRows, selectedTopic, selectedLanguage, selectedCategory]);

  const originalCount = useMemo(() => enrichedRows.filter((r) => !r.isAdditional).length, [enrichedRows]);
  const additionalCount = useMemo(() => enrichedRows.filter((r) => r.isAdditional).length, [enrichedRows]);

  // Filtrado de resultados internos por tipo
  const filteredInternalResults = useMemo(() => {
    if (filterType === 'ALL') return internalResults;
    return internalResults.filter((r) => r.type === filterType);
  }, [internalResults, filterType]);

  // Columnas para DataTable del catálogo canónico
  const columns: Column<EnrichedSearchRow>[] = [
    {
      key: 'id',
      header: 'ID Ecuación',
      width: '120px',
      render: (row) => (
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-ink)' }}>
            {row.id}
          </span>
          {row.isAdditional && (
            <div style={{ fontSize: '10px', color: 'var(--color-terracotta)', fontWeight: 600 }}>
              + Adicional
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'topicName',
      header: 'Tema / Unidad',
      width: '180px',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--color-ink)' }}>
            {row.topicName}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
            {row.unitId}
          </div>
        </div>
      ),
    },
    {
      key: 'consulta',
      header: 'Ecuación Booleana / Consulta',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
            <BooleanQueryHighlight query={row.consulta} />
            <CopyEquationButton query={row.consulta} />
          </div>
          {row.objetivo && (
            <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', fontStyle: 'italic', borderTop: '1px dotted var(--color-border-light)', paddingTop: '0.2rem' }}>
              {row.objetivo}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'idioma',
      header: 'Idioma',
      width: '110px',
      render: (row) => (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)' }}>
          {row.idioma}
        </span>
      ),
    },
    {
      key: 'fecha',
      header: 'Fecha',
      width: '110px',
      render: (row) => (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}>
          {row.fecha}
        </span>
      ),
    },
    {
      key: 'estadoBadge',
      header: 'Estado',
      width: '160px',
      render: (row) => (
        <StatusBadge
          status={row.estadoBadge}
          size="sm"
          label={row.estadoTexto}
        />
      ),
    },
    {
      key: 'resultados',
      header: 'Resultados',
      width: '110px',
      align: 'center',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-ink-secondary)' }}>
          {row.resultados}
        </span>
      ),
    },
    {
      key: 'urlScholar',
      header: 'Google Scholar',
      width: '130px',
      align: 'center',
      render: (row) =>
        row.urlScholar ? (
          <a
            href={row.urlScholar as string}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--color-terracotta)',
              textDecoration: 'none',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
            }}
          >
            Consultar <ExternalLink size={12} />
          </a>
        ) : (
          <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>—</span>
        ),
    },
  ];

  return (
    <div
      style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '2rem 1.5rem 5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      {/* 1. Banner Institucional del Motor de Búsqueda */}
      <Banner
        variant="atlas"
        titulo="Motor de Búsqueda Académico e Inteligencia Científica"
        subtitulo="Buscador híbrido en tiempo real: explora todos los recursos del curso (temas, ecuaciones, scripts en R, datasets) y consulta en vivo literatura científica abierta con DOIs oficiales."
        icono={<Search size={24} />}
        metricaPrincipal={{
          valor: `${internalResults.length} / ${externalResults.length}`,
          etiqueta: 'Resultados Internos / Externos',
        }}
        metricaSecundaria={{
          valor: `${allSearches.length || 105}`,
          etiqueta: 'Ecuaciones en Catálogo',
        }}
      >
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <StatusBadge
            status="completado"
            label="Buscador Híbrido Activo (Local + CrossRef DOI)"
          />
          <StatusBadge
            status="completado"
            label={`${originalCount} Canónicas + ${additionalCount} Adicionales`}
          />
        </div>
      </Banner>

      {/* 2. Gran Barra de Búsqueda Universal Interactiva */}
      <Card padding="md" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div
              style={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  color: 'var(--color-ink-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Escribe una palabra clave, técnica o ecuación booleana (ej. K-Means, CRISP-DM, redes neuronales)..."
                style={{
                  width: '100%',
                  padding: '0.85rem 2.75rem 0.85rem 2.85rem',
                  fontSize: 'var(--text-sm)',
                  backgroundColor: 'var(--color-card-muted)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-ink)',
                  outline: 'none',
                  transition: 'border-color var(--motion-duration-fast)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-blue-ink)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setInternalResults([]);
                    setExternalResults([]);
                  }}
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-ink-muted)',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={internalLoading || externalLoading}
            >
              {internalLoading || externalLoading ? (
                <>
                  <Loader2 size={15} className="spin" />
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  <Search size={15} />
                  <span>Buscar</span>
                </>
              )}
            </Button>
          </div>

          {/* Sugerencias Rápidas de Búsqueda */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={12} style={{ color: 'var(--color-terracotta)' }} /> Sugerencias:
            </span>
            {SUGGESTED_QUERIES.map((sq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySuggestion(sq)}
                style={{
                  padding: '0.25rem 0.6rem',
                  fontSize: '11px',
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border-light)',
                  borderRadius: '999px',
                  color: 'var(--color-ink-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--motion-duration-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-blue-ink)';
                  e.currentTarget.style.color = 'var(--color-blue-ink)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-light)';
                  e.currentTarget.style.color = 'var(--color-ink-secondary)';
                }}
              >
                {sq}
              </button>
            ))}
          </div>
        </form>
      </Card>

      {/* 3. Selector de Pestañas del Motor de Búsqueda */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setSearchTab('internal')}
          style={{
            padding: '0.55rem 1.1rem',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            border: searchTab === 'internal' ? '1px solid var(--color-blue-ink)' : '1px solid transparent',
            backgroundColor: searchTab === 'internal' ? 'var(--color-blue-soft)' : 'transparent',
            color: searchTab === 'internal' ? 'var(--color-blue-ink)' : 'var(--color-ink-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Database size={15} />
          <span>Repositorio del Curso ({internalResults.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSearchTab('external')}
          style={{
            padding: '0.55rem 1.1rem',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            border: searchTab === 'external' ? '1px solid var(--color-terracotta)' : '1px solid transparent',
            backgroundColor: searchTab === 'external' ? 'var(--color-terracotta-soft)' : 'transparent',
            color: searchTab === 'external' ? 'var(--color-terracotta)' : 'var(--color-ink-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Globe size={15} />
          <span>Literatura Científica en Vivo ({externalResults.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSearchTab('canonical')}
          style={{
            padding: '0.55rem 1.1rem',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            border: searchTab === 'canonical' ? '1px solid var(--color-ink)' : '1px solid transparent',
            backgroundColor: searchTab === 'canonical' ? 'var(--color-card-muted)' : 'transparent',
            color: searchTab === 'canonical' ? 'var(--color-ink)' : 'var(--color-ink-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Binary size={15} />
          <span>Catálogo Canónico ({filteredCanonicalRows.length})</span>
        </button>
      </div>

      {/* 4. Contenido según la Pestaña Activa */}

      {/* ================= PESTAÑA 1: REPOSITORIO INTERNO ================= */}
      {searchTab === 'internal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Filtros por tipo de objeto interno */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {[
                { key: 'ALL', label: 'Todos' },
                { key: 'topic', label: 'Temas' },
                { key: 'equation', label: 'Ecuaciones' },
                { key: 'document', label: 'Documentos' },
                { key: 'r_script', label: 'Scripts R' },
                { key: 'dataset', label: 'Datasets' },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilterType(f.key)}
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '11.5px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${filterType === f.key ? 'var(--color-blue-ink)' : 'var(--color-border-light)'}`,
                    backgroundColor: filterType === f.key ? 'var(--color-blue-soft)' : 'var(--color-card)',
                    color: filterType === f.key ? 'var(--color-blue-ink)' : 'var(--color-ink-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
              Mostrando {filteredInternalResults.length} resultados en el repositorio
            </div>
          </div>

          {internalLoading ? (
            <Loading mensaje="Buscando en el repositorio del curso..." />
          ) : filteredInternalResults.length === 0 ? (
            <Card padding="lg" style={{ textAlign: 'center' }}>
              <Database size={32} style={{ color: 'var(--color-ink-muted)', margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: '0 0 0.35rem' }}>
                No se encontraron recursos internos con "{searchQuery}"
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', margin: 0 }}>
                Intenta con otros términos como "K-Means", "Árboles", "CRISP-DM", o explora la pestaña de Literatura Científica en Vivo.
              </p>
            </Card>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
              {filteredInternalResults.map((item) => {
                const typeConfig = {
                  topic: { label: 'Tema Académico', color: 'var(--color-blue-ink)', bg: 'var(--color-blue-soft)', icon: <Layers size={13} /> },
                  equation: { label: 'Ecuación Booleana', color: 'var(--color-terracotta)', bg: 'var(--color-terracotta-soft)', icon: <Binary size={13} /> },
                  document: { label: 'Documento Indexado', color: '#0284c7', bg: '#e0f2fe', icon: <BookOpen size={13} /> },
                  r_script: { label: 'Script en R', color: '#7c3aed', bg: '#ede9fe', icon: <Code2 size={13} /> },
                  dataset: { label: 'Dataset Tabular', color: '#059669', bg: '#d1fae5', icon: <Database size={13} /> },
                }[item.type];

                return (
                  <Card key={item.id} padding="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: typeConfig.bg,
                            color: typeConfig.color,
                            fontSize: '10.5px',
                            fontWeight: 700,
                          }}
                        >
                          {typeConfig.icon} {typeConfig.label}
                        </span>
                        <span style={{ fontSize: '10.5px', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}>
                          {item.unitId}
                        </span>
                      </div>

                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: '0 0 0.25rem', color: 'var(--color-ink)', lineHeight: 1.35 }}>
                        {item.title}
                      </h4>
                      <div style={{ fontSize: '11.5px', color: 'var(--color-ink-secondary)', marginBottom: '0.65rem' }}>
                        {item.subtitle}
                      </div>

                      {item.snippet && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-ink)',
                            backgroundColor: 'var(--color-card-muted)',
                            padding: '0.5rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border-light)',
                            fontFamily: item.type === 'equation' || item.type === 'r_script' ? 'var(--font-mono)' : 'inherit',
                            lineHeight: 1.45,
                            wordBreak: 'break-word',
                          }}
                        >
                          {item.type === 'equation' ? (
                            <BooleanQueryHighlight query={item.snippet} />
                          ) : (
                            item.snippet
                          )}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => openTopic(item.unitId, item.topicId)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          color: 'var(--color-blue-ink)',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        Abrir Tema <ArrowRight size={12} />
                      </button>

                      {item.type === 'equation' && item.snippet && (
                        <CopyEquationButton query={item.snippet} />
                      )}

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'var(--color-terracotta)',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          Ver Fuente <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= PESTAÑA 2: LITERATURA CIENTÍFICA EN VIVO ================= */}
      {searchTab === 'external' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>
                Artículos Científicos Indexados (CrossRef Open API)
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', margin: '0.15rem 0 0' }}>
                Consulta directa al repositorio de DOIs de la literatura científica internacional.
              </p>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-ink-muted)' }}>
              Fuente oficial con revisión por pares
            </div>
          </div>

          {externalLoading ? (
            <Loading mensaje={`Consultando literatura científica en CrossRef para "${searchQuery}"...`} />
          ) : externalError ? (
            <ErrorMessage mensaje={externalError} onReintentar={() => triggerSearch(searchQuery)} />
          ) : externalResults.length === 0 ? (
            <Card padding="lg" style={{ textAlign: 'center' }}>
              <Globe size={32} style={{ color: 'var(--color-ink-muted)', margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: '0 0 0.35rem' }}>
                Sin artículos para "{searchQuery}"
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', margin: 0 }}>
                Escribe términos científicos en inglés o español en la barra superior para buscar papers reales.
              </p>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {externalResults.map((paper) => (
                <Card key={paper.id} padding="md">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            padding: '0.15rem 0.5rem',
                            backgroundColor: 'var(--color-blue-soft)',
                            color: 'var(--color-blue-ink)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '10.5px',
                            fontWeight: 700,
                          }}
                        >
                          {paper.year ? `${paper.year}` : 'Publicación'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', fontWeight: 600 }}>
                          {paper.journal}
                        </span>
                      </div>

                      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 0.35rem', lineHeight: 1.35 }}>
                        {paper.title}
                      </h4>

                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', marginBottom: '0.5rem' }}>
                        <strong>Autores:</strong> {paper.authors}
                      </div>

                      {paper.abstract && (
                        <p style={{ fontSize: '11.5px', color: 'var(--color-ink)', lineHeight: 1.5, margin: '0.5rem 0', backgroundColor: 'var(--color-card-muted)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-light)' }}>
                          {paper.abstract.slice(0, 350)}...
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'flex-end', flexShrink: 0 }}>
                      {paper.doi && (
                        <a
                          href={`https://doi.org/${paper.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.35rem 0.75rem',
                            backgroundColor: 'var(--color-card-muted)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--color-blue-ink)',
                            fontSize: '11px',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          DOI: {paper.doi.slice(0, 18)}... <ExternalLink size={12} />
                        </a>
                      )}

                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.75rem',
                          backgroundColor: 'var(--color-terracotta)',
                          color: '#FFFFFF',
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        Leer en Publicación <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= PESTAÑA 3: CATÁLOGO CANÓNICO HISTÓRICO ================= */}
      {searchTab === 'canonical' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Filtros de Búsqueda Secundarios del Catálogo */}
          <Card padding="md">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={16} style={{ color: 'var(--color-blue-ink)' }} />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-ink)' }}>
                  Filtros del Historial Canónico:
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {/* Filtro por Tema */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', fontWeight: 600 }}>
                    Tema:
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: 'var(--text-xs)',
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-ink)',
                    }}
                  >
                    <option value="ALL">Todos los Temas</option>
                    {Array.from(topicNameMap.entries()).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Idioma */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', fontWeight: 600 }}>
                    Idioma:
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: 'var(--text-xs)',
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-ink)',
                    }}
                  >
                    <option value="ALL">Todos los Idiomas</option>
                    <option value="ES">Español</option>
                    <option value="EN">Inglés</option>
                  </select>
                </div>

                {/* Filtro Canónico vs Adicional */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', fontWeight: 600 }}>
                    Tipo:
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as 'ALL' | 'ORIGINAL' | 'ADICIONAL')}
                    style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: 'var(--text-xs)',
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-ink)',
                    }}
                  >
                    <option value="ALL">Todas las Consultas</option>
                    <option value="ORIGINAL">100 Originales Canónicas</option>
                    <option value="ADICIONAL">5 Adicionales DW (DW-011 a DW-015)</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabla de Resultados Canónicos */}
          {canonicalLoading ? (
            <Loading mensaje="Cargando catálogo canónico de consultas..." />
          ) : canonicalError ? (
            <ErrorMessage mensaje={canonicalError} />
          ) : (
            <DataTable
              columns={columns}
              data={filteredCanonicalRows}
              pageSize={15}
              emptyMessage="No se encontraron ecuaciones de búsqueda con los filtros seleccionados."
            />
          )}
        </div>
      )}
    </div>
  );
};
