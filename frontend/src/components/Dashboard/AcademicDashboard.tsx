import React from 'react';
import { useApp } from '../../context/AppContext';
import { useCountUp } from '../../hooks/useCountUp';
import {
  Banner,
  Card,
  RoutePath,
  ProgressBar,
  StatusBadge,
  Button,
  type RouteNode,
} from '../ui';
import {
  Compass,
  Layers,
  Binary,
  BookOpen,
  Code2,
  Database,
  FileCode,
  ArrowRight,
  Library,
  Cpu,
  FlaskConical,
  GraduationCap,
} from 'lucide-react';
import type { UnitId } from '../../types/domain';

// Zonas curriculares del Atlas de Conocimiento
const ZONE_METADATA = [
  {
    zona: 'Zona 1: Biblioteca',
    nombreCorto: 'Biblioteca',
    subtitulo: 'Fundamentos, metodología y conceptos base de minería de datos',
    icon: <Library size={20} />,
    iconGrande: <Library size={26} />,
  },
  {
    zona: 'Zona 2: Taller de Teoría',
    nombreCorto: 'Taller de Teoría',
    subtitulo: 'Modelos matemáticos, taxonomías y métodos algorítmicos',
    icon: <Cpu size={20} />,
    iconGrande: <Cpu size={26} />,
  },
  {
    zona: 'Zona 3: Laboratorio',
    nombreCorto: 'Laboratorio',
    subtitulo: 'Experimentación aplicada con scripts de analítica en R',
    icon: <FlaskConical size={20} />,
    iconGrande: <FlaskConical size={26} />,
  },
  {
    zona: 'Zona 4: Sala de Sustentación',
    nombreCorto: 'Sala de Sustentación',
    subtitulo: 'Integración, benchmark predictivo, informe LaTeX y sustentación',
    icon: <GraduationCap size={20} />,
    iconGrande: <GraduationCap size={26} />,
  },
];

export const AcademicDashboard: React.FC = () => {
  const { course, setActiveView, openTopic } = useApp();

  const m = course?.metricas;

  // Animaciones de recuento numérico suave (useCountUp)
  const temasCount = useCountUp(m?.totalTemas ?? 24);
  const busquedasCount = useCountUp(m?.totalBusquedas ?? 360);
  const docsCount = useCountUp(m?.documentosSeleccionados ?? 127);
  const scriptsCount = useCountUp(m?.ejemplosR ?? 24);
  const datasetsCount = useCountUp(m?.datasets ?? 26);
  const latexCount = useCountUp(m?.documentosLatex ?? 26);
  const globalPctCount = useCountUp(course?.porcentajeGlobalApi ?? 100);

  // Nodos para RoutePath de las 4 unidades diferenciadas con íconos de zona
  const unitNodes: RouteNode[] = (course?.unidades || []).map((u, idx) => {
    const zone = ZONE_METADATA[idx] || ZONE_METADATA[0];
    return {
      id: u.id,
      label: zone.nombreCorto,
      sublabel: `Unidad ${idx + 1}: ${u.nombre}`,
      status: u.porcentajeApi >= 100 ? 'completado' : u.porcentajeApi > 0 ? 'actual' : 'pendiente',
      icon: zone.icon,
    };
  });

  const handleSelectUnit = (_unitId: string) => {
    setActiveView('units');
  };

  return (
    <div
      style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      {/* 1. Banner de Bienvenida Institucional con Rosa de los Vientos animada */}
      <Banner
        variant="atlas"
        mostrarBrujula
        titulo="Plataforma de Investigación en Minería de Datos"
        subtitulo="Exploración estructurada del conocimiento: 4 zonas curriculares, 24 temas de estudio, ecuaciones booleanas verificadas, modelos reproducibles en R y documentación académica en LaTeX."
        icono={<Compass size={24} />}
        metricaPrincipal={{
          valor: m ? `${temasCount}/${m.totalTemas}` : '24/24',
          etiqueta: 'Temas Académicos',
        }}
        metricaSecundaria={{
          valor: `${globalPctCount}%`,
          etiqueta: 'Progreso del Curso',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <StatusBadge status="completado" label="Evidencias Verificadas" />
          <StatusBadge status="completado" label="Modelos en R Reproducibles" />
          <StatusBadge status="actual" label="Navegación Académica" />
        </div>
      </Banner>

      {/* 2. RoutePath con las 4 Zonas Curriculares Diferenciadas */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 className="atlas-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
              Ruta Curricular del Conocimiento
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', margin: '0.2rem 0 0' }}>
              Camino secuencial a través de las 4 zonas académicas. Selecciona una zona para explorar sus temas.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setActiveView('units')}>
            Explorar todas las zonas <ArrowRight size={14} />
          </Button>
        </div>

        <RoutePath
          nodes={unitNodes}
          onSelectNode={handleSelectUnit}
        />
      </section>

      {/* 3. Panel de Métricas Cuantitativas (Rejilla Balanceada 6x1 / 3x2 sin huérfanas) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <h3 className="atlas-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
            Panel de Recursos y Evidencias
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', margin: '0.2rem 0 0' }}>
            Consolidado de materiales y evidencias académicas catalogadas a lo largo del curso.
          </p>
        </div>

        <div className="metrics-grid-balanced">
          {/* Temas */}
          <Card padding="md" style={{ animationDelay: '0ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-blue-soft)',
                  color: 'var(--color-blue-ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Layers size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-ink)', lineHeight: 1 }}>
                  {temasCount}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
                  Temas del Curso
                </div>
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginTop: '0.65rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.4rem' }}>
              Misiones temáticas del plan de estudio
            </div>
          </Card>

          {/* Ecuaciones de Búsqueda */}
          <Card padding="md" style={{ animationDelay: '60ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-blue-soft)',
                  color: 'var(--color-blue-ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Binary size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-terracotta)', lineHeight: 1 }}>
                  {busquedasCount}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
                  Ecuaciones de Búsqueda
                </div>
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginTop: '0.65rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.4rem' }}>
              Consultas booleanas en bases científicas
            </div>
          </Card>

          {/* Documentos Seleccionados */}
          <Card padding="md" style={{ animationDelay: '120ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-blue-soft)',
                  color: 'var(--color-blue-ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-ink)', lineHeight: 1 }}>
                  {docsCount}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
                  Documentos y Referencias
                </div>
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginTop: '0.65rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.4rem' }}>
              Artículos indexados con DOI y ficha
            </div>
          </Card>

          {/* Scripts R */}
          <Card padding="md" style={{ animationDelay: '180ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-blue-soft)',
                  color: 'var(--color-blue-ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Code2 size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-ink)', lineHeight: 1 }}>
                  {scriptsCount}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
                  Scripts en R
                </div>
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginTop: '0.65rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.4rem' }}>
              Algoritmos y modelos reproducibles
            </div>
          </Card>

          {/* Datasets */}
          <Card padding="md" style={{ animationDelay: '240ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-blue-soft)',
                  color: 'var(--color-blue-ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Database size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-ink)', lineHeight: 1 }}>
                  {datasetsCount}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
                  Datasets Tabulares
                </div>
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginTop: '0.65rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.4rem' }}>
              Bases de datos para experimentación
            </div>
          </Card>

          {/* Documentos LaTeX */}
          <Card padding="md" style={{ animationDelay: '300ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-blue-soft)',
                  color: 'var(--color-blue-ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileCode size={18} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-ink)', lineHeight: 1 }}>
                  {latexCount}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
                  Capítulos en LaTeX
                </div>
              </div>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginTop: '0.65rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.4rem' }}>
              Documentos formateados para sustentación
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Resumen de Unidades con Zonas Diferenciadas e Íconos Grandes */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="atlas-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
          Zonas Académicas de Estudio
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {(course?.unidades || []).map((unit, idx) => {
            const zone = ZONE_METADATA[idx] || ZONE_METADATA[0];

            return (
              <Card
                key={unit.id}
                header={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: idx % 2 === 0 ? 'var(--color-blue-soft)' : 'var(--color-terracotta-soft)',
                          color: idx % 2 === 0 ? 'var(--color-blue-ink)' : 'var(--color-terracotta)',
                          border: `1px solid ${idx % 2 === 0 ? 'var(--color-blue-border)' : 'var(--color-terracotta-border)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {zone.iconGrande}
                      </div>
                      <div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-terracotta)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {zone.zona}
                        </span>
                        <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-ink)', margin: '0.1rem 0 0' }}>
                          {unit.nombre}
                        </h4>
                      </div>
                    </div>
                    <StatusBadge
                      status={unit.porcentajeApi >= 100 ? 'completado' : 'actual'}
                      size="sm"
                    />
                  </div>
                }
                footer={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)' }}>
                      {unit.temas.length} temas temáticos
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveView('units')}
                    >
                      Explorar Zona <ArrowRight size={13} />
                    </Button>
                  </div>
                }
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', fontStyle: 'italic', margin: 0 }}>
                    {zone.subtitulo}
                  </p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.45 }}>
                    {unit.pregunta}
                  </p>
                  <ProgressBar
                    percentage={unit.porcentajeApi}
                    size="sm"
                    variant="blue"
                    label="Avance de evidencias"
                  />
                  {/* Temas rápidos */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                    {unit.temas.slice(0, 4).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => openTopic(unit.id as UnitId, t.id)}
                        style={{
                          padding: '0.2rem 0.5rem',
                          fontSize: '11px',
                          backgroundColor: 'var(--color-card-muted)',
                          border: '1px solid var(--color-border-light)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-blue-ink)',
                          cursor: 'pointer',
                        }}
                        title={t.nombre}
                      >
                        {t.id.replace(/^\d+_/, '')}
                      </button>
                    ))}
                    {unit.temas.length > 4 && (
                      <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)', alignSelf: 'center' }}>
                        +{unit.temas.length - 4} más
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

