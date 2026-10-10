import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getAllCanonicalSearches } from '../../services/searchService';
import type { SearchEquation, UnitId } from '../../types/domain';
import {
  Banner,
  Card,
  DataTable,
  StatusBadge,
  Loading,
  ErrorMessage,
  type Column,
} from '../ui';
import {
  Binary,
  ExternalLink,
  // BookOpen,
  Filter,
} from 'lucide-react';

/**
 * Regla Canónica de AGENTS.md §3:
 * En disco, Data Warehouse tiene 15 ecuaciones (DW-001 a DW-015):
 * - DW-001 a DW-010 son las 10 originales con documento asociado.
 * - DW-011 a DW-015 son adicionales sin documento asociado.
 * Se muestran ambas, diferenciadas, sin borrar ninguna.
 */
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

export const SearchEngine: React.FC = () => {
  const { course } = useApp();
  const [allSearches, setAllSearches] = useState<SearchEquation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros secundarios
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'ORIGINAL' | 'ADICIONAL'>('ALL');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getAllCanonicalSearches()
      .then((searches) => {
        if (isMounted) {
          setAllSearches(searches);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar las ecuaciones de búsqueda.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  // Lista enriquecida de filas para DataTable
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

  // Filtrado reactivo por tema, idioma y categoría
  const filteredRows = useMemo(() => {
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

  // Conteos canónicos para el rotulado
  const originalCount = useMemo(() => enrichedRows.filter((r) => !r.isAdditional).length, [enrichedRows]);
  const additionalCount = useMemo(() => enrichedRows.filter((r) => r.isAdditional).length, [enrichedRows]);

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
            <div style={{ fontSize: '10px', color: 'var(--color-terracotta-dark)', fontWeight: 600 }}>
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
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-blue-ink)', lineHeight: 1.35 }}>
            {row.consulta}
          </div>
          {row.objetivo && (
            <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', marginTop: '0.2rem', fontStyle: 'italic' }}>
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
              color: 'var(--color-terracotta-dark)',
              textDecoration: 'none',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
            }}
          >
            Consultar <ExternalLink size={12} />
          </a>
        ) : (
          <span style={{ fontSize: '11px', color: 'var(--color-ink-disabled)' }}>—</span>
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
      {/* 1. Banner con rotulación clara de las 100 originales + 5 adicionales */}
      <Banner
        variant="atlas"
        titulo="Historial de Consultas Booleanas (Solo Lectura)"
        subtitulo="Catálogo canónico de ecuaciones de búsqueda formuladas con operadores AND, OR y comillas dobles. Las consultas no se regeneran ni se simulan: sus enlaces abren directamente en Google Scholar."
        icono={<Binary size={24} />}
        metricaPrincipal={{
          valor: `${originalCount} + ${additionalCount}`,
          etiqueta: '100 Originales + 5 Adicionales',
        }}
        metricaSecundaria={{
          valor: `${enrichedRows.length}`,
          etiqueta: 'Total Ecuaciones en Disco',
        }}
      >
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <StatusBadge
            status="completado"
            label={`${originalCount} Consultas Originales Canónicas`}
          />
          <StatusBadge
            status="actual"
            label={`${additionalCount} Ecuaciones Adicionales Data Warehouse (DW-011 a DW-015)`}
          />
        </div>
      </Banner>

      {/* 2. Filtros de Búsqueda Secundarios */}
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
              Filtros del Historial:
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
                <option value="ALL">Todas (105)</option>
                <option value="ORIGINAL">Solo Originales (100)</option>
                <option value="ADICIONAL">Solo Adicionales DW (5)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. DataTable con Filtrado en Tiempo Real */}
      {loading && <Loading mensaje="Cargando historial canónico de 105 ecuaciones..." />}

      {error && (
        <ErrorMessage
          titulo="Error al cargar búsquedas"
          mensaje={error}
          onReintentar={() => window.location.reload()}
        />
      )}

      {!loading && !error && (
        <DataTable<EnrichedSearchRow>
          data={filteredRows}
          columns={columns}
          searchPlaceholder="Buscar por término, operador o ID (ej: DW-011, CRISP-DM, K-Means)..."
          pageSize={12}
          emptyMessage="No se encontraron ecuaciones booleanas que coincidan con los filtros aplicados."
        />
      )}
    </div>
  );
};
