import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  filterKey?: (item: T) => string;
  searchPlaceholder?: string;
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  filterKey,
  searchPlaceholder = 'Buscar en los registros...',
  pageSize = 10,
  emptyMessage = 'No se encontraron registros que coincidan con la búsqueda.',
  className = '',
  style,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrado
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const term = search.toLowerCase();
    return data.filter((item) => {
      if (filterKey) {
        return filterKey(item).toLowerCase().includes(term);
      }
      return Object.values(item).some(
        (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(term)
      );
    });
  }, [data, search, filterKey]);

  // Paginación
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div
      className={`atlas-data-table-container ${className}`}
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-atlas-sm)',
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}
    >
      {/* Barra de Búsqueda y Conteo */}
      <div
        style={{
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: 'var(--color-card-muted)',
          borderBottom: '1px solid var(--color-border)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-ink-muted)',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            style={{
              width: '100%',
              padding: '0.45rem 0.75rem 0.45rem 2.25rem',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-sans)',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-ink)',
            }}
          />
        </div>

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', fontFamily: 'var(--font-mono)' }}>
          Mostrando {paginatedData.length} de {filteredData.length} {filteredData.length === 1 ? 'registro' : 'registros'}
        </div>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: 'var(--color-card-muted)', borderBottom: '1px solid var(--color-border)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: '0.75rem 1rem',
                    fontWeight: 700,
                    color: 'var(--color-blue-ink)',
                    textAlign: col.align || 'left',
                    width: col.width,
                    letterSpacing: '0.02em',
                    fontSize: 'var(--text-xs)',
                    textTransform: 'uppercase',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid var(--color-border-light)',
                    backgroundColor: idx % 2 === 0 ? 'var(--color-card)' : 'rgba(246, 241, 231, 0.4)',
                    transition: 'background-color var(--transition-fast)',
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: '0.75rem 1rem',
                        color: 'var(--color-ink)',
                        textAlign: col.align || 'left',
                        verticalAlign: 'middle',
                      }}
                    >
                      {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                  <Inbox size={32} style={{ margin: '0 auto 0.5rem', color: 'var(--color-ink-disabled)' }} />
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)' }}>
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div
          style={{
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-card-muted)',
            fontSize: 'var(--text-xs)',
          }}
        >
          <span style={{ color: 'var(--color-ink-secondary)' }}>
            Página {currentPage} de {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
                color: 'var(--color-ink)',
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage <= 1 ? 0.5 : 1,
              }}
            >
              <ChevronLeft size={14} /> Anterior
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.3rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card)',
                color: 'var(--color-ink)',
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage >= totalPages ? 0.5 : 1,
              }}
            >
              Siguiente <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
