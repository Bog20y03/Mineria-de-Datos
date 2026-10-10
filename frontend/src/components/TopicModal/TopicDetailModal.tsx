import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getTopicDetail } from '../../services/topicService';
import { executeRScript } from '../../services/rService';
import { Modal } from '../common/Modal';
import type { TopicDetail } from '../../types/domain';
import {
  BookOpen,
  Search,
  FileText,
  Database,
  Code2,
  BarChart2,
  FileCode,
  ExternalLink,
  Play,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Loader2,
} from 'lucide-react';

type TabKey = 'resumen' | 'busquedas' | 'documentos' | 'dataset' | 'r' | 'resultados' | 'latex';

export const TopicDetailModal: React.FC = () => {
  const { selectedTopic, closeTopic } = useApp();
  const [data, setData] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('resumen');

  // Ejecución R
  const [runningR, setRunningR] = useState<boolean>(false);
  const [rExecutionLog, setRExecutionLog] = useState<string | null>(null);
  const [rExecutionSuccess, setRExecutionSuccess] = useState<boolean | null>(null);
  const [copiedLatex, setCopiedLatex] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedTopic) {
      setData(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);
    setActiveTab('resumen');
    setRExecutionLog(null);
    setRExecutionSuccess(null);

    getTopicDetail(selectedTopic.unitId, selectedTopic.topicId)
      .then((detail) => {
        if (isMounted) {
          setData(detail);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar tema');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedTopic]);

  if (!selectedTopic) return null;

  const handleRunR = async () => {
    if (!selectedTopic) return;
    setRunningR(true);
    setRExecutionLog(null);
    setRExecutionSuccess(null);
    try {
      const res = await executeRScript(selectedTopic.unitId, selectedTopic.topicId);
      setRExecutionSuccess(res.ok);
      setRExecutionLog(res.salida || (res.ok ? 'Script ejecutado con éxito sin advertencias.' : 'Error durante la ejecución.'));
      if (res.results.imagenes.length > 0 && data) {
        setData({
          ...data,
          results: res.results,
        });
      }
    } catch (err: unknown) {
      setRExecutionSuccess(false);
      setRExecutionLog(err instanceof Error ? err.message : 'Fallo en la llamada a R');
    } finally {
      setRunningR(false);
    }
  };

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

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'resumen', label: 'Fundamentación', icon: <BookOpen size={16} /> },
    { key: 'busquedas', label: 'Búsquedas', icon: <Search size={16} />, count: data?.searches.length },
    { key: 'documentos', label: 'Documentos', icon: <FileText size={16} />, count: data?.documents.length },
    { key: 'dataset', label: 'Dataset', icon: <Database size={16} /> },
    { key: 'r', label: 'Laboratorio R', icon: <Code2 size={16} /> },
    { key: 'resultados', label: 'Resultados', icon: <BarChart2 size={16} />, count: data?.results.imagenes.length },
    { key: 'latex', label: 'LaTeX', icon: <FileCode size={16} /> },
  ];

  return (
    <Modal
      isOpen={Boolean(selectedTopic)}
      onClose={closeTopic}
      title={data ? data.topicName : 'Cargando tema académico...'}
      subtitle={data ? `${data.unitName} · Misión Temática` : undefined}
      maxWidth="1150px"
    >
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <Loader2 size={36} className="spin" style={{ color: 'var(--c-interactive-hover)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Cargando recursos reales de la API...</p>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--c-danger-bg)',
            border: '1px solid var(--c-danger)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <AlertCircle size={24} style={{ color: 'var(--c-danger)', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontWeight: 600 }}>Error al obtener datos</h4>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</p>
          </div>
        </div>
      )}

      {data && !loading && (
        <div>
          {/* Navegación por Pestañas */}
          <div
            style={{
              display: 'flex',
              gap: '0.35rem',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '1.5rem',
              overflowX: 'auto',
              paddingBottom: '0.25rem',
            }}
          >
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    backgroundColor: active ? 'var(--c-interactive-bg)' : 'transparent',
                    color: active ? 'var(--c-interactive-hover)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.1rem 0.4rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: active ? 'var(--c-interactive)' : 'var(--bg-elevated)',
                        color: '#fff',
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: RESUMEN / README */}
          {activeTab === 'resumen' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                className="card"
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderLeft: '4px solid var(--c-interactive)',
                }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--c-interactive-hover)', marginBottom: '0.5rem' }}>
                  Fundamentación y Objetivos de Aprendizaje
                </h4>
                <div
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-dim)',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {data.descripcionMd || 'Sin datos registrados en la documentación técnica.'}
                </div>
              </div>

              {/* Matriz de las 8 actividades */}
              <div className="card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                  Matriz Metodológica (8 Actividades Verificables)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {[
                    { label: '1. Búsqueda bibliográfica', done: data.searches.length > 0 },
                    { label: '2. Documentos seleccionados', done: data.documents.length > 0 },
                    { label: '3. Análisis bibliográfico', done: data.documents.some((d) => d.pertinencia !== null) },
                    { label: '4. Dataset seleccionado', done: Boolean(data.dataset.archivo) },
                    { label: '5. Ejemplo R', done: Boolean(data.rExample) },
                    { label: '6. Resultados', done: data.results.imagenes.length > 0 },
                    { label: '7. Documentación LaTeX', done: Boolean(data.latex) },
                    { label: '8. Sustentación', done: data.results.imagenes.length > 0 && Boolean(data.latex) },
                  ].map((act, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-elevated)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{act.label}</span>
                      {act.done ? (
                        <span className="badge badge-green">
                          <CheckCircle2 size={12} /> Completada
                        </span>
                      ) : (
                        <span className="badge badge-gray">Pendiente</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BÚSQUEDAS */}
          {activeTab === 'busquedas' && (
            <div>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Ecuaciones booleanas canónicas registradas para este tema ({data.searches.length}).
                </p>
              </div>
              {data.searches.length === 0 ? (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Sin datos registrados.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {data.searches.map((s) => (
                    <div key={s.id} className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge badge-blue">{s.id}</span>
                          {s.nivel && <span className="badge badge-gray">{s.nivel}</span>}
                          {s.idioma && <span className="badge badge-gray">{s.idioma}</span>}
                        </div>
                        {s.urlScholar && (
                          <a
                            href={s.urlScholar}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            <ExternalLink size={12} />
                            Google Scholar
                          </a>
                        )}
                      </div>
                      <div className="code-block" style={{ marginBottom: '0.5rem' }}>
                        {s.consulta}
                      </div>
                      {s.objetivo && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                          <strong>Objetivo:</strong> {s.objetivo}
                        </p>
                      )}
                      {s.palabrasClave && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          <strong>Keywords:</strong> {s.palabrasClave}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOCUMENTOS */}
          {activeTab === 'documentos' && (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Artículos científicos reales y canónicos vinculados a las ecuaciones ({data.documents.length}).
              </p>
              {data.documents.length === 0 ? (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Sin datos registrados.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {data.documents.map((doc) => (
                    <div key={doc.id} className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                            <span className="badge badge-purple">{doc.id}</span>
                            {doc.anio && <span className="badge badge-gray">{doc.anio}</span>}
                            {doc.pertinencia && (
                              <span className={`badge ${doc.pertinencia === 'Alta' ? 'badge-green' : 'badge-gold'}`}>
                                Pertinencia: {doc.pertinencia}
                              </span>
                            )}
                            {doc.idEcuacionOrigen && (
                              <span className="badge badge-blue">Origen: {doc.idEcuacionOrigen}</span>
                            )}
                          </div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {doc.titulo}
                          </h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {doc.autores || 'Autores no registrados'} {doc.fuente ? `· ${doc.fuente}` : ''}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                          {doc.doi && (
                            <a
                              href={`https://doi.org/${doc.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            >
                              DOI
                            </a>
                          )}
                          {doc.urlScholar && (
                            <a
                              href={doc.urlScholar}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                            >
                              <ExternalLink size={12} />
                              Scholar
                            </a>
                          )}
                        </div>
                      </div>

                      {doc.objetivo && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                          <strong>Objetivo del estudio:</strong> {doc.objetivo}
                        </p>
                      )}
                      {doc.resultados && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          <strong>Principales hallazgos:</strong> {doc.resultados}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DATASET */}
          {activeTab === 'dataset' && (
            <div>
              {data.dataset.archivo ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Ficha técnica */}
                  <div className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                        Ficha Técnica del Dataset: <span style={{ color: 'var(--c-interactive-hover)' }}>{data.dataset.archivo}</span>
                      </h4>
                      <span className="badge badge-green">Dataset Académico Real</span>
                    </div>

                    {data.dataset.metadata && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.8rem' }}>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Nombre:</strong>
                          <p>{String(data.dataset.metadata.nombre || 'No registrado')}</p>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Fuente / Repositorio:</strong>
                          <p>{String(data.dataset.metadata.fuente || 'UCI / Kaggle')}</p>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Registros:</strong>
                          <p>{String(data.dataset.metadata.numero_registros || 'Sin datos')}</p>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-muted)' }}>Licencia:</strong>
                          <p>{String(data.dataset.metadata.licencia || 'Abierta / Académica')}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vista previa tabular */}
                  {data.dataset.headers.length > 0 && (
                    <div className="card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                        Vista Previa de Estructura (Primeras 7 Filas)
                      </h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                            {data.dataset.headers.map((h, i) => (
                              <th key={i} style={{ padding: '0.5rem 0.75rem', color: 'var(--c-interactive-hover)', fontFamily: 'var(--font-mono)' }}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data.dataset.preview.map((row, rIdx) => (
                            <tr key={rIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} style={{ padding: '0.4rem 0.75rem', color: 'var(--text-dim)' }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Sin datos registrados para este tema.
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EJEMPLO EN R & EJECUCIÓN */}
          {activeTab === 'r' && (
            <div>
              {data.rExample ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-purple">{data.rExample.archivo}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>R v4.4.1 Reproducible</span>
                    </div>

                    {/* Botón de Ejecución Real */}
                    <button
                      type="button"
                      onClick={handleRunR}
                      disabled={runningR}
                      className="btn btn-primary"
                      style={{ fontSize: '0.85rem' }}
                    >
                      {runningR ? (
                        <>
                          <Loader2 size={16} className="spin" />
                          Ejecutando en R...
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          Ejecutar Script en Tiempo Real
                        </>
                      )}
                    </button>
                  </div>

                  {/* Consola de Ejecución */}
                  {rExecutionLog && (
                    <div
                      className="card"
                      style={{
                        padding: '1rem',
                        backgroundColor: '#030712',
                        border: `1px solid ${rExecutionSuccess ? 'var(--c-completed)' : 'var(--c-danger)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {rExecutionSuccess ? (
                          <CheckCircle2 size={16} style={{ color: 'var(--c-completed)' }} />
                        ) : (
                          <AlertCircle size={16} style={{ color: 'var(--c-danger)' }} />
                        )}
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: rExecutionSuccess ? 'var(--c-completed)' : 'var(--c-danger)' }}>
                          {rExecutionSuccess ? 'Ejecución exitosa (Rscript v4.4.1)' : 'Fallo de ejecución en R'}
                        </span>
                      </div>
                      <pre
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: '#e2e8f0',
                          whiteSpace: 'pre-wrap',
                          maxHeight: '200px',
                          overflowY: 'auto',
                        }}
                      >
                        {rExecutionLog}
                      </pre>
                    </div>
                  )}

                  {/* Editor / Código R */}
                  <div className="card" style={{ padding: '1rem', backgroundColor: '#020617' }}>
                    <pre
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: '#93c5fd',
                        lineHeight: 1.45,
                        overflowX: 'auto',
                        maxHeight: '400px',
                      }}
                    >
                      {data.rExample.codigo}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Sin datos registrados en R para este tema.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: RESULTADOS */}
          {activeTab === 'resultados' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.results.imagenes.length === 0 && !data.results.metricas ? (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Sin datos registrados.
                </div>
              ) : (
                <>
                  {/* Métricas numéricas TXT */}
                  {data.results.metricas && (
                    <div className="card" style={{ padding: '1.25rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Métricas de Diagnóstico Numérico (.txt)
                      </h4>
                      <pre className="code-block" style={{ maxHeight: '200px', color: '#a7f3d0' }}>
                        {data.results.metricas}
                      </pre>
                    </div>
                  )}

                  {/* Gráficas PNG */}
                  {data.results.imagenes.map((img, i) => (
                    <div key={i} className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        {img.nombre}
                      </div>
                      <img
                        src={img.src}
                        alt={img.nombre}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '500px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#fff',
                        }}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* TAB 7: LATEX */}
          {activeTab === 'latex' && (
            <div>
              {data.latex ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-purple">{data.latex.archivo}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={handleCopyLatex}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <Copy size={14} />
                        {copiedLatex ? '¡Copiado!' : 'Copiar .tex'}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadLatex}
                        className="btn btn-primary"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <Download size={14} />
                        Descargar .tex
                      </button>
                    </div>
                  </div>

                  <div className="card" style={{ padding: '1rem', backgroundColor: '#020617' }}>
                    <pre
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        color: '#fde047',
                        lineHeight: 1.45,
                        overflowX: 'auto',
                        maxHeight: '400px',
                      }}
                    >
                      {data.latex.codigo}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Sin datos registrados en LaTeX.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
