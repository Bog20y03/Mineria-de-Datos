import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTopicDetail } from '../services/topicService';
import type { TopicDetail, AcademicDocument, SearchEquation } from '../types/domain';
import {
  Card,
  Tabs,
  DataTable,
  Button,
  StatusBadge,
  Loading,
  ErrorMessage,
  EmptyState,
  AcademicMarkdownViewer,
} from '../components/ui';
import {
  ChevronRight,
  BookOpen,
  Search,
  FileText,
  Database,
  Code2,
  BarChart2,
  FileCode,
  Copy,
  Download,
  ExternalLink,
  Library,
  ArrowRight,
  ScrollText,
} from 'lucide-react';
import { TopicBibliography } from '../components/Topics/TopicBibliography';
import { TopicRLaboratory } from '../components/Topics/TopicRLaboratory';

export const TopicPage: React.FC = () => {
  const { selectedTopic, closeTopic, setActiveView, openDossier } = useApp();
  const [data, setData] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  type TabKey = 'general' | 'fuentes' | 'busquedas' | 'documentos' | 'dataset' | 'r' | 'resultados' | 'latex';
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [copiedLatex, setCopiedLatex] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedTopic) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setActiveTab('general');

    getTopicDetail(selectedTopic.unitId, selectedTopic.topicId)
      .then((detail) => {
        if (isMounted) {
          setData(detail);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar el tema desde la API PHP');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedTopic]);

  if (!selectedTopic) return null;

  const handleCopyLatex = () => {
    if (!data?.latex?.codigo) return;
    navigator.clipboard.writeText(data.latex.codigo);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  const handleDownloadLatex = () => {
    if (!data?.latex?.codigo) return;
    const blob = new Blob([data.latex.codigo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = data.latex.archivo || `${selectedTopic.topicId}.tex`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Pestañas
  const tabsList = [
    { id: 'general', label: 'General (README)', icon: <BookOpen size={15} /> },
    { id: 'fuentes', label: 'Fuentes y Libros', icon: <Library size={15} /> },
    { id: 'busquedas', label: 'Búsquedas', icon: <Search size={15} />, badge: data?.searches.length },
    { id: 'documentos', label: 'Documentos', icon: <FileText size={15} />, badge: data?.documents.length },
    { id: 'dataset', label: 'Dataset', icon: <Database size={15} /> },
    {
      id: 'r',
      label: 'Laboratorio R',
      icon: <Code2 size={15} />,
      badge: data?.rScripts && data.rScripts.length > 0 ? data.rScripts.length : data?.rExample ? 1 : undefined,
    },
    { id: 'resultados', label: 'Resultados', icon: <BarChart2 size={15} />, badge: data?.results.imagenes.length },
    { id: 'latex', label: 'LaTeX', icon: <FileCode size={15} /> },
  ];

  return (
    <div
      style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '1.5rem 1.5rem 5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* 1. Migas de Pan (Breadcrumbs): Inicio > Unidad > Tema */}
      <nav
        aria-label="Migas de pan"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-sans)',
          color: 'var(--color-ink-secondary)',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => {
            closeTopic();
            setActiveView('dashboard');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-blue-ink)',
            cursor: 'pointer',
            padding: 0,
            fontWeight: 600,
          }}
        >
          Inicio (Dashboard)
        </button>
        <ChevronRight size={13} style={{ color: 'var(--color-border)' }} />
        <button
          type="button"
          onClick={() => {
            closeTopic();
            setActiveView('units');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-blue-ink)',
            cursor: 'pointer',
            padding: 0,
            fontWeight: 600,
          }}
        >
          {data ? data.unitName : selectedTopic.unitId}
        </button>
        <ChevronRight size={13} style={{ color: 'var(--color-border)' }} />
        <span style={{ color: 'var(--color-ink)', fontWeight: 700 }}>
          {data ? data.topicName : selectedTopic.topicId}
        </span>
      </nav>

      {/* 2. Cabecera del Tema */}
      <Card
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {data?.unitName || selectedTopic.unitId} · [{selectedTopic.topicId}]
                </span>
                <StatusBadge status="completado" size="sm" label="Tema Verificado" />
              </div>
              <h1 className="atlas-title" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-ink)', margin: '0.25rem 0 0' }}>
                {data ? data.topicName : 'Cargando tema...'}
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => openDossier(selectedTopic.unitId, selectedTopic.topicId)}
                title="Generar Artículo y Dossier de Sustentación Formal"
              >
                <ScrollText size={14} style={{ marginRight: '0.4rem' }} />
                Dossier de Sustentación
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  closeTopic();
                  setActiveView('units');
                }}
              >
                Volver a la Unidad
              </Button>
            </div>
          </div>
        }
      >
        {/* Selector de Pestañas */}
        <div style={{ marginBottom: '1.25rem' }}>
          <Tabs
            variant="underline"
            tabs={tabsList}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as TabKey)}
          />
        </div>

        {/* Estado de Carga */}
        {loading && <Loading mensaje="Cargando evidencias del tema académico..." />}

        {/* Estado de Error */}
        {error && (
          <ErrorMessage
            titulo="Error al cargar datos del tema"
            mensaje={error}
            onReintentar={() => {
              if (selectedTopic) {
                setLoading(true);
                setError(null);
                getTopicDetail(selectedTopic.unitId, selectedTopic.topicId)
                  .then((d) => {
                    setData(d);
                    setLoading(false);
                  })
                  .catch((e) => {
                    setError(e.message);
                    setLoading(false);
                  });
              }
            }}
          />
        )}

        {/* Contenido de las Pestañas */}
        {!loading && !error && data && (
          <div>
            {/* PESTAÑA 1: GENERAL (README) */}
            {activeTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <AcademicMarkdownViewer
                  content={data.descripcionMd}
                  title={`Documentación Técnica — ${data.topicName}`}
                  subtitle={`${data.unitName} · ${selectedTopic.topicId}`}
                  emptyMessage="Sin documentación README.md registrada para este tema."
                />

                {/* Acceso Directo a Fuentes y Libros Canónicos */}
                <div
                  style={{
                    backgroundColor: 'var(--color-card-muted)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Library size={18} style={{ color: 'var(--color-blue-ink)' }} />
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-ink)' }}>
                        Tratados Canónicos y Fuentes Científicas de Consulta
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)' }}>
                        Libros de referencia (Han & Kamber, Tan, Hastie) y repositorios arbitrados (IEEE, ACM, ScienceDirect).
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('fuentes')}>
                    Ver Fuentes y Libros <ArrowRight size={13} />
                  </Button>
                </div>
              </div>
            )}

            {/* PESTAÑA 2: FUENTES Y LIBROS */}
            {activeTab === 'fuentes' && (
              <TopicBibliography
                topicName={data.topicName}
                topicId={selectedTopic.topicId}
                unitName={data.unitName}
                unitId={selectedTopic.unitId}
              />
            )}

            {/* PESTAÑA 2: BÚSQUEDAS */}
            {activeTab === 'busquedas' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)' }}>
                  Ecuaciones booleanas registradas en <code>ecuaciones_busqueda.csv</code> para este tema:
                </div>
                <DataTable<SearchEquation & Record<string, unknown>>
                  data={data.searches as unknown as (SearchEquation & Record<string, unknown>)[]}
                  searchPlaceholder="Filtrar búsquedas por ID o texto..."
                  emptyMessage="No se encontraron ecuaciones de búsqueda registradas."
                  columns={[
                    {
                      key: 'id',
                      header: 'ID Ecuación',
                      width: '120px',
                      render: (row) => (
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-ink)' }}>
                          {row.id}
                        </span>
                      ),
                    },
                    {
                      key: 'consulta',
                      header: 'Ecuación Booleana',
                      render: (row) => (
                        <div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-blue-ink)' }}>
                            {row.consulta}
                          </div>
                          {row.objetivo && (
                            <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', marginTop: '0.2rem' }}>
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
                          {row.idioma || 'Sin datos registrados'}
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
                            Abrir <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--color-ink-disabled)' }}>—</span>
                        ),
                    },
                  ]}
                />
              </div>
            )}

            {/* PESTAÑA 3: DOCUMENTOS (Y MATRIZ BIBLIOGRÁFICA) */}
            {activeTab === 'documentos' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)' }}>
                    Documentos seleccionados y matriz bibliográfica extraída de <code>documentos_seleccionados.csv</code>:
                  </div>
                  <StatusBadge
                    status="completado"
                    size="sm"
                    label={`${data.documents.length} fuentes verificadas`}
                  />
                </div>

                <DataTable<AcademicDocument & Record<string, unknown>>
                  data={data.documents as unknown as (AcademicDocument & Record<string, unknown>)[]}
                  searchPlaceholder="Buscar por título, autor o DOI..."
                  emptyMessage="No hay documentos académicos registrados para este tema."
                  columns={[
                    {
                      key: 'titulo',
                      header: 'Título y Fuente',
                      render: (row) => (
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--color-ink)', lineHeight: 1.35 }}>
                            {row.titulo || 'Sin datos registrados'}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', marginTop: '0.2rem' }}>
                            {row.fuente || 'Sin datos registrados'}
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: 'autores',
                      header: 'Autores',
                      width: '180px',
                      render: (row) => (
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink)' }}>
                          {row.autores || 'Sin datos registrados'}
                        </span>
                      ),
                    },
                    {
                      key: 'anio',
                      header: 'Año',
                      width: '70px',
                      align: 'center',
                      render: (row) => (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                          {row.anio || '—'}
                        </span>
                      ),
                    },
                    {
                      key: 'doi',
                      header: 'DOI',
                      width: '140px',
                      render: (row) =>
                        row.doi ? (
                          <a
                            href={`https://doi.org/${row.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              color: 'var(--color-blue-ink)',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                            }}
                          >
                            {row.doi} <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--color-ink-disabled)' }}>Sin DOI registrado</span>
                        ),
                    },
                    {
                      key: 'pertinencia',
                      header: 'Pertinencia',
                      width: '110px',
                      align: 'center',
                      render: (row) => (
                        <StatusBadge
                          status={row.pertinencia === 'Alta' ? 'completado' : 'actual'}
                          size="sm"
                          label={row.pertinencia || 'Sin datos'}
                        />
                      ),
                    },
                    {
                      key: 'objetivo',
                      header: 'Objetivo / Metodología',
                      render: (row) => (
                        <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', lineHeight: 1.35, maxHeight: '60px', overflowY: 'auto' }}>
                          {row.objetivo || row.metodologia || row.resultados || 'Sin datos registrados'}
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            )}

            {/* PESTAÑA 4: DATASET */}
            {activeTab === 'dataset' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>
                      Archivo de Datos: {data.dataset.archivo || 'dataset.csv'}
                    </h4>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)' }}>
                      Vista previa de los primeros registros del dataset utilizado por el script R.
                    </span>
                  </div>
                  <StatusBadge status="completado" size="sm" label="Dataset Disponible" />
                </div>

                {data.dataset.preview.length > 0 ? (
                  <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--color-card-muted)', borderBottom: '1px solid var(--color-border)' }}>
                          {data.dataset.headers.map((h, i) => (
                            <th key={i} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--color-blue-ink)', fontWeight: 700 }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.dataset.preview.map((row, rIdx) => (
                          <tr key={rIdx} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} style={{ padding: '0.45rem 0.75rem', color: 'var(--color-ink)' }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState
                    titulo="Vista Previa de Dataset no disponible"
                    descripcion="No se encontraron filas estructuradas en la carpeta de datos de este tema."
                  />
                )}
              </div>
            )}

            {/* PESTAÑA 5: LABORATORIO ESPECIALIZADO DE R */}
            {activeTab === 'r' && (
              <TopicRLaboratory
                unitId={selectedTopic.unitId}
                topicId={selectedTopic.topicId}
                topicName={data.topicName}
                scripts={data.rScripts && data.rScripts.length > 0 ? data.rScripts : data.rExample ? [data.rExample] : []}
                onExecutionSuccess={(newResults) => {
                  if (data) {
                    setData({
                      ...data,
                      results: newResults,
                    });
                  }
                }}
              />
            )}

            {/* PESTAÑA 6: RESULTADOS (GRÁFICAS Y MÉTRICAS) */}
            {activeTab === 'resultados' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Métricas cuantitativas */}
                {data.results.metricas && (
                  <div>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-ink)' }}>
                      Métricas Numéricas Registradas (metricas.txt):
                    </h4>
                    <pre
                      style={{
                        margin: 0,
                        padding: '1rem',
                        backgroundColor: 'var(--color-card-muted)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-ink)',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {data.results.metricas}
                    </pre>
                  </div>
                )}

                {/* Galería de imágenes PNG generadas */}
                <div>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-ink)' }}>
                    Gráficas Generadas por R ({data.results.imagenes.length}):
                  </h4>

                  {data.results.imagenes.length > 0 ? (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1rem',
                      }}
                    >
                      {data.results.imagenes.map((img, idx) => (
                        <div
                          key={idx}
                          style={{
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            backgroundColor: 'var(--color-card)',
                          }}
                        >
                          <img
                            src={img.src}
                            alt={img.nombre}
                            style={{ width: '100%', height: 'auto', display: 'block', backgroundColor: '#FFFFFF' }}
                          />
                          <div style={{ padding: '0.5rem 0.75rem', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-secondary)', borderTop: '1px solid var(--color-border-light)' }}>
                            {img.nombre}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      titulo="Sin Gráficas Registradas"
                      descripcion="Ejecuta el script de R en la pestaña 'Ejemplo R' para generar las gráficas analíticas."
                    />
                  )}
                </div>
              </div>
            )}

            {/* PESTAÑA 7: LATEX */}
            {activeTab === 'latex' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>
                      Artículo Científico: {data.latex?.archivo || 'documento.tex'}
                    </h4>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)' }}>
                      Capítulo temático en formato LaTeX para la síntesis formal del entregable.
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="outline" size="sm" icon={<Copy size={14} />} onClick={handleCopyLatex}>
                      {copiedLatex ? '¡Copiado!' : 'Copiar Código'}
                    </Button>
                    <Button variant="primary" size="sm" icon={<Download size={14} />} onClick={handleDownloadLatex}>
                      Descargar .tex
                    </Button>
                  </div>
                </div>

                <pre
                  style={{
                    margin: 0,
                    padding: '1.25rem',
                    backgroundColor: 'var(--color-card-muted)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-ink)',
                    overflowX: 'auto',
                    maxHeight: '450px',
                    lineHeight: 1.5,
                  }}
                >
                  {data.latex?.codigo || '% No hay código LaTeX generado para este tema.'}
                </pre>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
