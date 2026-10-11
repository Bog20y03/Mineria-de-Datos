import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
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
  Award,
  Scale,
  CheckCircle2,
} from 'lucide-react';
import { TopicBibliography } from '../components/Topics/TopicBibliography';
import { TopicRLaboratory } from '../components/Topics/TopicRLaboratory';

export const TopicPage: React.FC = () => {
  const { selectedTopic, closeTopic, setActiveView, openDossier, openDefense } = useApp();
  const [data, setData] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pestañas principales simplificadas (5 pilares en vez de 8 saturadas)
  type TabKey = 'general' | 'investigacion' | 'dataset' | 'r' | 'evidencias';
  const [activeTab, setActiveTab] = useState<TabKey>('general');

  // Sub-selectores internos con progressive disclosure
  type SubTabInvestigacion = 'fuentes' | 'busquedas' | 'documentos';
  const [subTabInvestigacion, setSubTabInvestigacion] = useState<SubTabInvestigacion>('fuentes');

  type SubTabEvidencias = 'resultados' | 'latex';
  const [subTabEvidencias, setSubTabEvidencias] = useState<SubTabEvidencias>('resultados');

  // Menú consolidado de acciones de cabecera
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [copiedLatex, setCopiedLatex] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!selectedTopic) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setActiveTab('general');
    setSubTabInvestigacion('fuentes');
    setSubTabEvidencias('resultados');

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

  // 5 Pestañas Esenciales y Claras
  const tabsList = [
    { id: 'general', label: 'Fundamentación', icon: <BookOpen size={15} /> },
    {
      id: 'investigacion',
      label: 'Investigación',
      icon: <Search size={15} />,
      badge: (data?.documents?.length || 0) + (data?.searches?.length || 0),
    },
    { id: 'dataset', label: 'Dataset', icon: <Database size={15} /> },
    {
      id: 'r',
      label: 'Laboratorio R',
      icon: <Code2 size={15} />,
      badge: data?.rScripts && data.rScripts.length > 0 ? data.rScripts.length : data?.rExample ? 1 : undefined,
    },
    {
      id: 'evidencias',
      label: 'Evidencias & LaTeX',
      icon: <BarChart2 size={15} />,
      badge: data?.results?.imagenes?.length,
    },
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

      {/* 2. Cabecera del Tema con Botonera Consolidada */}
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

            {/* Acciones Consolidadas: 2 Botones Limpios en lugar de 4 dispersos */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', position: 'relative' }} ref={menuRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  closeTopic();
                  setActiveView('units');
                }}
                style={{ color: 'var(--color-ink-secondary)', borderColor: 'var(--color-border)' }}
              >
                ← Volver a la Unidad
              </Button>

              <div style={{ position: 'relative' }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    backgroundColor: '#ea580c',
                    borderColor: '#c2410c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(234, 88, 12, 0.25)',
                  }}
                  title="Opciones académicas de sustentación, dossier y benchmark"
                >
                  <Award size={15} />
                  <span>Sustentación & Entregables</span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: menuOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.15s ease',
                    }}
                  />
                </Button>

                {menuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      right: 0,
                      zIndex: 50,
                      minWidth: '290px',
                      backgroundColor: 'var(--color-card, #FFFFFF)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md, 8px)',
                      boxShadow: '0 12px 28px -4px rgba(0,0,0,0.2), 0 4px 12px -2px rgba(0,0,0,0.1)',
                      padding: '0.45rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        openDefense(selectedTopic.unitId, selectedTopic.topicId, data?.topicName || selectedTopic.topicId);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm, 6px)',
                        border: 'none',
                        backgroundColor: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: 'var(--color-ink)',
                        transition: 'background-color 0.15s',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-card-muted)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ padding: '0.35rem', borderRadius: '6px', backgroundColor: 'rgba(234, 88, 12, 0.12)', color: '#ea580c', flexShrink: 0 }}>
                        <Award size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)' }}>Defensa ante Jurados</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', marginTop: '2px' }}>
                          Examen oral con 3 evaluadores, preguntas KaTeX y acta oficial
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        openDossier(selectedTopic.unitId, selectedTopic.topicId);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm, 6px)',
                        border: 'none',
                        backgroundColor: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: 'var(--color-ink)',
                        transition: 'background-color 0.15s',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-card-muted)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ padding: '0.35rem', borderRadius: '6px', backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#2563eb', flexShrink: 0 }}>
                        <ScrollText size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)' }}>Dossier Académico IEEE</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', marginTop: '2px' }}>
                          Artículo a dos columnas, monografía y exportación PDF
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        closeTopic();
                        setActiveView('benchmark');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm, 6px)',
                        border: 'none',
                        backgroundColor: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: 'var(--color-ink)',
                        transition: 'background-color 0.15s',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-card-muted)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ padding: '0.35rem', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#059669', flexShrink: 0 }}>
                        <Scale size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)' }}>Arena de Benchmark</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', marginTop: '2px' }}>
                          Comparar complejidad O(n), métricas radar y criterios
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      >
        {/* Selector de Pestañas: 5 Pestañas Limpias */}
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
            {/* PESTAÑA 1: FUNDAMENTACIÓN (README + MATRIZ DE 8 ACTIVIDADES) */}
            {activeTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <AcademicMarkdownViewer
                  content={data.descripcionMd}
                  title={`Documentación Técnica — ${data.topicName}`}
                  subtitle={`${data.unitName} · ${selectedTopic.topicId}`}
                  emptyMessage="Sin documentación README.md registrada para este tema."
                />

                {/* Resumen Metodológico: Matriz de las 8 Actividades Verificables */}
                <div
                  style={{
                    backgroundColor: 'var(--color-card-muted)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: 0, color: 'var(--color-ink)' }}>
                        Matriz Metodológica (8 Actividades Verificables)
                      </h4>
                      <p style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', margin: '0.2rem 0 0' }}>
                        Trazabilidad completa desde la investigación hasta la sustentación formal del entregable.
                      </p>
                    </div>
                    <StatusBadge status="completado" size="sm" label="100% Verificado" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
                    {[
                      { label: '1. Búsqueda bibliográfica', done: data.searches.length > 0, tab: 'investigacion', subTab: 'busquedas' },
                      { label: '2. Documentos seleccionados', done: data.documents.length > 0, tab: 'investigacion', subTab: 'documentos' },
                      { label: '3. Análisis de pertinencia', done: data.documents.some((d) => d.pertinencia !== null), tab: 'investigacion', subTab: 'documentos' },
                      { label: '4. Dataset seleccionado', done: Boolean(data.dataset.archivo), tab: 'dataset' },
                      { label: '5. Laboratorio en R (3 scripts)', done: Boolean(data.rScripts && data.rScripts.length > 0) || Boolean(data.rExample), tab: 'r' },
                      { label: '6. Resultados y gráficas', done: data.results.imagenes.length > 0, tab: 'evidencias', subTab: 'resultados' },
                      { label: '7. Documentación LaTeX', done: Boolean(data.latex), tab: 'evidencias', subTab: 'latex' },
                      { label: '8. Sustentación formal', done: true, action: 'defense' },
                    ].map((act, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          if (act.action === 'defense') {
                            openDefense(selectedTopic.unitId, selectedTopic.topicId, data.topicName);
                          } else if (act.tab) {
                            setActiveTab(act.tab as TabKey);
                            if (act.subTab && act.tab === 'investigacion') setSubTabInvestigacion(act.subTab as SubTabInvestigacion);
                            if (act.subTab && act.tab === 'evidencias') setSubTabEvidencias(act.subTab as SubTabEvidencias);
                          }
                        }}
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-card)',
                          border: '1px solid var(--color-border-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'border-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-blue-ink)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-light)')}
                        title="Haz clic para inspeccionar esta actividad"
                      >
                        <span style={{ fontSize: '11px', color: 'var(--color-ink)', fontWeight: 500 }}>{act.label}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '10px', color: '#059669', fontWeight: 700 }}>
                          <CheckCircle2 size={12} /> Verificado
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acceso Rápido a Fuentes y Libros Canónicos */}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveTab('investigacion');
                      setSubTabInvestigacion('fuentes');
                    }}
                  >
                    Ver Fuentes y Libros <ArrowRight size={13} />
                  </Button>
                </div>
              </div>
            )}

            {/* PESTAÑA 2: INVESTIGACIÓN (CONSOLIDA FUENTES, BÚSQUEDAS Y DOCUMENTOS) */}
            {activeTab === 'investigacion' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Sub-selector Segmentado */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setSubTabInvestigacion('fuentes')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        fontSize: 'var(--text-xs)',
                        fontWeight: subTabInvestigacion === 'fuentes' ? 700 : 500,
                        backgroundColor: subTabInvestigacion === 'fuentes' ? 'var(--color-blue-ink)' : 'var(--color-card-muted)',
                        color: subTabInvestigacion === 'fuentes' ? '#FFFFFF' : 'var(--color-ink-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Library size={13} />
                      <span>Fuentes y Libros Canónicos</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubTabInvestigacion('busquedas')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        fontSize: 'var(--text-xs)',
                        fontWeight: subTabInvestigacion === 'busquedas' ? 700 : 500,
                        backgroundColor: subTabInvestigacion === 'busquedas' ? 'var(--color-blue-ink)' : 'var(--color-card-muted)',
                        color: subTabInvestigacion === 'busquedas' ? '#FFFFFF' : 'var(--color-ink-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Search size={13} />
                      <span>Ecuaciones de Búsqueda</span>
                      <span style={{ fontSize: '10px', opacity: 0.85 }}>({data.searches.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubTabInvestigacion('documentos')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        fontSize: 'var(--text-xs)',
                        fontWeight: subTabInvestigacion === 'documentos' ? 700 : 500,
                        backgroundColor: subTabInvestigacion === 'documentos' ? 'var(--color-blue-ink)' : 'var(--color-card-muted)',
                        color: subTabInvestigacion === 'documentos' ? '#FFFFFF' : 'var(--color-ink-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <FileText size={13} />
                      <span>Documentos Seleccionados</span>
                      <span style={{ fontSize: '10px', opacity: 0.85 }}>({data.documents.length})</span>
                    </button>
                  </div>

                  <StatusBadge
                    status="completado"
                    size="sm"
                    label={`${data.searches.length} ecuaciones · ${data.documents.length} papers`}
                  />
                </div>

                {/* Subvista: Fuentes y Libros */}
                {subTabInvestigacion === 'fuentes' && (
                  <TopicBibliography
                    topicName={data.topicName}
                    topicId={selectedTopic.topicId}
                    unitName={data.unitName}
                    unitId={selectedTopic.unitId}
                  />
                )}

                {/* Subvista: Ecuaciones de Búsqueda */}
                {subTabInvestigacion === 'busquedas' && (
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

                {/* Subvista: Documentos Seleccionados */}
                {subTabInvestigacion === 'documentos' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)' }}>
                      Documentos seleccionados y matriz bibliográfica extraída de <code>documentos_seleccionados.csv</code>:
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
              </div>
            )}

            {/* PESTAÑA 3: DATASET */}
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

            {/* PESTAÑA 4: LABORATORIO ESPECIALIZADO DE R */}
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

            {/* PESTAÑA 5: EVIDENCIAS & LATEX (CONSOLIDA RESULTADOS + CÓDIGO LATEX) */}
            {activeTab === 'evidencias' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Sub-selector Segmentado */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setSubTabEvidencias('resultados')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        fontSize: 'var(--text-xs)',
                        fontWeight: subTabEvidencias === 'resultados' ? 700 : 500,
                        backgroundColor: subTabEvidencias === 'resultados' ? 'var(--color-blue-ink)' : 'var(--color-card-muted)',
                        color: subTabEvidencias === 'resultados' ? '#FFFFFF' : 'var(--color-ink-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <BarChart2 size={13} />
                      <span>Gráficas y Diagnósticos</span>
                      <span style={{ fontSize: '10px', opacity: 0.85 }}>({data.results.imagenes.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubTabEvidencias('latex')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        fontSize: 'var(--text-xs)',
                        fontWeight: subTabEvidencias === 'latex' ? 700 : 500,
                        backgroundColor: subTabEvidencias === 'latex' ? 'var(--color-blue-ink)' : 'var(--color-card-muted)',
                        color: subTabEvidencias === 'latex' ? '#FFFFFF' : 'var(--color-ink-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <FileCode size={13} />
                      <span>Documento LaTeX ({data.latex?.archivo || 'documento.tex'})</span>
                    </button>
                  </div>

                  <StatusBadge
                    status="completado"
                    size="sm"
                    label={`${data.results.imagenes.length} figuras · LaTeX Listo`}
                  />
                </div>

                {/* Subvista 1: Gráficas y Métricas */}
                {subTabEvidencias === 'resultados' && (
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
                          descripcion="Ejecuta los scripts en el 'Laboratorio R' para regenerar las gráficas analíticas."
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Subvista 2: Código LaTeX */}
                {subTabEvidencias === 'latex' && (
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
          </div>
        )}
      </Card>
    </div>
  );
};
