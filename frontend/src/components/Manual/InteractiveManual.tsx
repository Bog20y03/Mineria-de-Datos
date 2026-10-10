import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Play,
  Pause,
  RotateCcw,
  Film,
  CheckCircle2,
  Terminal,
  Layers,
  ArrowRight,
  Activity,
  Download,
  Sparkles,
  Sliders,
  FileText,
  Check,
  RefreshCw,
} from 'lucide-react';
import { Card, Button, StatusBadge } from '../ui';

interface ManualSection {
  id: string;
  titulo: string;
  categoria: string;
  icono: React.ReactNode;
  render: () => React.ReactNode;
}

// --------------------------------------------------------------------------
// Constantes y Datos para Simulaciones
// --------------------------------------------------------------------------

const STEPS_CURRICULARES = [
  { title: '1. UNIDAD', sub: 'Contexto Curricular', desc: '4 Unidades académicas estructuradas según el syllabus oficial.', color: '#38BDF8' },
  { title: '2. TEMA', sub: 'Eje Temático', desc: '24 Temas de investigación científica y analítica de datos.', color: '#2563EB' },
  { title: '3. BÚSQUEDA', sub: 'Fórmulas Booleanas', desc: '360 Ecuaciones formales con operadores lógicos auditados.', color: '#F59E0B' },
  { title: '4. DOCUMENTO', sub: 'Artículos con DOI', desc: '127 Documentos de autores canónicos (Fayyad, Quinlan, etc.).', color: '#10B981' },
  { title: '5. DATASET', sub: 'Datos Tabulares', desc: '26 Conjuntos de datos clasificados por nivel de integridad.', color: '#38BDF8' },
  { title: '6. EJEMPLO R', sub: 'Scripts Reproducibles', desc: '24 Scripts nativos en R v4.4.1 con semillas estocásticas fijas.', color: '#EA580C' },
  { title: '7. RESULTADOS', sub: 'Gráficos y Métricas', desc: 'Gráficos PNG en alta resolución y diagnósticos WCSS / Silueta.', color: '#8B5CF6' },
  { title: '8. LATEX', sub: 'Documentación Formal', desc: '26 Manuscritos .tex y diapositivas de sustentación Beamer.', color: '#10B981' },
];

const CRISP_STAGES = [
  { name: '1. Negocio', desc: 'Comprensión de objetivos comerciales y formulación de preguntas problema.', angle: 270, color: '#38BDF8' },
  { name: '2. Datos', desc: 'Recolección inicial, exploración descriptiva y verificación de calidad.', angle: 330, color: '#2563EB' },
  { name: '3. Preparación', desc: 'Limpieza de outliers, imputación y normalización tabular.', angle: 30, color: '#F59E0B' },
  { name: '4. Modelado', desc: 'Selección de técnicas (CART, K-Means, MLP) y calibración de parámetros.', angle: 90, color: '#EA580C' },
  { name: '5. Evaluación', desc: 'Benchmark con métricas rigurosas (WCSS, Silueta, Matriz de confusión).', angle: 150, color: '#10B981' },
  { name: '6. Despliegue', desc: 'Integración en el pipeline productivo y generación del informe LaTeX.', angle: 210, color: '#8B5CF6' },
];

// Puntos iniciales para simulación K-Means (3 grupos sintéticos)
interface Point2D {
  x: number;
  y: number;
  cluster: number;
}

const INITIAL_POINTS: Point2D[] = [
  // Cluster A (Centro ~ 90, 80)
  { x: 80, y: 70, cluster: 0 },
  { x: 100, y: 85, cluster: 0 },
  { x: 75, y: 95, cluster: 0 },
  { x: 110, y: 65, cluster: 0 },
  { x: 95, y: 110, cluster: 0 },
  { x: 120, y: 90, cluster: 0 },
  { x: 85, y: 60, cluster: 0 },
  { x: 105, y: 100, cluster: 0 },
  // Cluster B (Centro ~ 250, 200)
  { x: 230, y: 190, cluster: 1 },
  { x: 260, y: 215, cluster: 1 },
  { x: 245, y: 180, cluster: 1 },
  { x: 270, y: 200, cluster: 1 },
  { x: 235, y: 220, cluster: 1 },
  { x: 280, y: 195, cluster: 1 },
  { x: 225, y: 205, cluster: 1 },
  { x: 265, y: 230, cluster: 1 },
  // Cluster C (Centro ~ 410, 100)
  { x: 390, y: 90, cluster: 2 },
  { x: 420, y: 110, cluster: 2 },
  { x: 405, y: 80, cluster: 2 },
  { x: 435, y: 120, cluster: 2 },
  { x: 395, y: 130, cluster: 2 },
  { x: 425, y: 95, cluster: 2 },
  { x: 380, y: 105, cluster: 2 },
  { x: 440, y: 85, cluster: 2 },
];

export const InteractiveManual: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>('sec_video_metodologia');

  // 1. Simulación Flujo Curricular
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlayingFlow, setIsPlayingFlow] = useState<boolean>(false);

  // 2. KDD vs CRISP-DM
  const [methodologyView, setMethodologyView] = useState<'crisp' | 'kdd'>('crisp');
  const [activeCrispStep, setActiveCrispStep] = useState<number>(0);
  const [isPlayingCrisp, setIsPlayingCrisp] = useState<boolean>(false);

  // 3. Simulador K-Means
  const [centroids, setCentroids] = useState<{ x: number; y: number }[]>([
    { x: 150, y: 50 },
    { x: 200, y: 250 },
    { x: 350, y: 180 },
  ]);
  const [points, setPoints] = useState<Point2D[]>(INITIAL_POINTS);
  const [kmeansIteration, setKmeansIteration] = useState<number>(0);
  const [kmeansConverged, setKmeansConverged] = useState<boolean>(false);
  const [isAutoKmeans, setIsAutoKmeans] = useState<boolean>(false);

  // 4. Simulador CART Tree
  const [cartThreshold, setCartThreshold] = useState<number>(2.45);

  // 5. Diagrama Booleano
  const [activeOperator, setActiveOperator] = useState<'AND' | 'OR' | 'NOT'>('AND');

  // 6. Consola R
  const [rRunning, setRRunning] = useState<boolean>(false);
  const [rLogs, setRLogs] = useState<string[]>([]);
  const [rComplete, setRComplete] = useState<boolean>(false);

  // 7. Pipeline LaTeX
  const [latexStep, setLatexStep] = useState<number>(0);
  const [isCompilingLatex, setIsCompilingLatex] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // Efectos de Animación Automática
  // --------------------------------------------------------------------------

  // Flujo curricular automático
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlayingFlow) {
      timer = setInterval(() => {
        setActiveStep((prev: number) => (prev >= STEPS_CURRICULARES.length - 1 ? 0 : prev + 1));
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlayingFlow]);

  // CRISP-DM ciclo automático
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlayingCrisp && methodologyView === 'crisp') {
      timer = setInterval(() => {
        setActiveCrispStep((prev: number) => (prev >= CRISP_STAGES.length - 1 ? 0 : prev + 1));
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlayingCrisp, methodologyView]);

  // K-Means iteración automática
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isAutoKmeans && !kmeansConverged) {
      timer = setInterval(() => {
        runKmeansStep();
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isAutoKmeans, kmeansConverged, centroids, points]);

  // --------------------------------------------------------------------------
  // Lógica de K-Means (Lloyd / Hartigan-Wong)
  // --------------------------------------------------------------------------
  const runKmeansStep = () => {
    if (kmeansConverged) return;

    // Paso 1: Asignar cada punto al centroide más cercano
    const updatedPoints = points.map((p) => {
      let minDist = Infinity;
      let closestCluster = 0;
      centroids.forEach((c, idx) => {
        const dist = Math.hypot(p.x - c.x, p.y - c.y);
        if (dist < minDist) {
          minDist = dist;
          closestCluster = idx;
        }
      });
      return { ...p, cluster: closestCluster };
    });

    // Paso 2: Recalcular la posición de cada centroide
    let totalMovement = 0;
    const newCentroids = centroids.map((c, idx) => {
      const assigned = updatedPoints.filter((p) => p.cluster === idx);
      if (assigned.length === 0) return c;
      const meanX = assigned.reduce((sum, p) => sum + p.x, 0) / assigned.length;
      const meanY = assigned.reduce((sum, p) => sum + p.y, 0) / assigned.length;
      totalMovement += Math.hypot(meanX - c.x, meanY - c.y);
      return { x: Math.round(meanX), y: Math.round(meanY) };
    });

    setPoints(updatedPoints);
    setCentroids(newCentroids);
    setKmeansIteration((prev) => prev + 1);

    // Si el movimiento total de centroides es menor a 2px, declarar convergencia
    if (totalMovement < 2 || kmeansIteration >= 7) {
      setKmeansConverged(true);
      setIsAutoKmeans(false);
    }
  };

  const resetKmeans = () => {
    setIsAutoKmeans(false);
    setKmeansConverged(false);
    setKmeansIteration(0);
    setPoints(INITIAL_POINTS);
    // Reiniciar centroides a posiciones aleatorias alejadas
    setCentroids([
      { x: Math.floor(Math.random() * 150 + 50), y: Math.floor(Math.random() * 150 + 40) },
      { x: Math.floor(Math.random() * 150 + 180), y: Math.floor(Math.random() * 120 + 140) },
      { x: Math.floor(Math.random() * 150 + 320), y: Math.floor(Math.random() * 140 + 60) },
    ]);
  };

  // Calcular WCSS actual
  const currentWCSS = Math.round(
    points.reduce((total, p) => {
      const c = centroids[p.cluster];
      return total + (Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
    }, 0) / 100
  );

  // --------------------------------------------------------------------------
  // Lógica de Consola R
  // --------------------------------------------------------------------------
  const runRSimulation = () => {
    if (rRunning) return;
    setRRunning(true);
    setRComplete(false);
    setRLogs([]);

    const logLines = [
      '[14:28:01] Invocando: Rscript.exe UNIDAD_1/01_MINERIA_DE_DATOS/ejemplos_R/01_script_kmeans.R',
      '[14:28:02] Cargando dataset iris (150 observaciones x 4 predictores continuos)...',
      '[14:28:02] Fijando semilla pseudoaleatoria: set.seed(123) para reproducibilidad estricta',
      '[14:28:03] Ejecutando algoritmo de Hartigan-Wong para k=3 centros (nstart = 25)...',
      '[14:28:03] Convergencia alcanzada en 3 iteraciones. Inercia WCSS = 78.851',
      '[14:28:04] Calculando matriz de siluetas de Kaufman & Rousseeuw (s = 0.5528)...',
      '[14:28:04] Exportando gráfico de dispersión diagnóstico a resultados/kmeans_iris.png (300 DPI)',
      '[14:28:05] Salida exitosa: Código de terminación 0 (OK)',
    ];

    logLines.forEach((line, index) => {
      setTimeout(() => {
        setRLogs((prev: string[]) => [...prev, line]);
        if (index === logLines.length - 1) {
          setRRunning(false);
          setRComplete(true);
        }
      }, (index + 1) * 450);
    });
  };

  // --------------------------------------------------------------------------
  // Lógica de Pipeline LaTeX
  // --------------------------------------------------------------------------
  const runLatexPipeline = () => {
    if (isCompilingLatex) return;
    setIsCompilingLatex(true);
    setLatexStep(0);

    const steps = [1, 2, 3, 4];
    steps.forEach((st, idx) => {
      setTimeout(() => {
        setLatexStep(st);
        if (idx === steps.length - 1) {
          setIsCompilingLatex(false);
        }
      }, (idx + 1) * 700);
    });
  };

  // --------------------------------------------------------------------------
  // Secciones del Manual
  // --------------------------------------------------------------------------
  const manualSections: ManualSection[] = [
    {
      id: 'sec_video_metodologia',
      titulo: 'Video Explicativo Metodológico',
      categoria: 'Audiovisual',
      icono: <Film size={16} />,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: '#0B0F17',
              border: '1.5px solid var(--color-border)',
              boxShadow: 'var(--shadow-atlas-md)',
              aspectRatio: '16/9',
            }}
          >
            <video
              controls
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
              src="/videos/manual_animation.mp4"
            >
              Tu navegador no soporta la reproducción de video MP4.
            </video>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-ink)', margin: 0 }}>
                Video Síntesis: Arquitectura del Flujo Metodológico
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', margin: '0.2rem 0 0' }}>
                Animación científica de 6 estaciones renderizada a 720p 30fps con gráficos vectoriales matemáticos.
              </p>
            </div>
            <a href="/videos/manual_animation.mp4" download style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="sm" icon={<Download size={14} />}>
                Descargar Video MP4
              </Button>
            </a>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              padding: '1rem',
              backgroundColor: 'var(--color-card-muted)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)' }}>
              <strong style={{ color: 'var(--color-ink)', display: 'block', marginBottom: '0.15rem' }}>0:00 - 0:02</strong>
              Carátula Institucional & Título Canónico
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)' }}>
              <strong style={{ color: 'var(--color-ink)', display: 'block', marginBottom: '0.15rem' }}>0:03 - 0:06</strong>
              Estructura de 4 Unidades & 24 Temas
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)' }}>
              <strong style={{ color: 'var(--color-ink)', display: 'block', marginBottom: '0.15rem' }}>0:07 - 0:10</strong>
              Fórmulas Booleanas & Filtro PRISMA
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)' }}>
              <strong style={{ color: 'var(--color-ink)', display: 'block', marginBottom: '0.15rem' }}>0:11 - 0:14</strong>
              R v4.4.1 Reproducible & LaTeX Beamer
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec_flujo',
      titulo: '1. Flujo Curricular Jerárquico',
      categoria: 'Metodología',
      icono: <Layers size={16} />,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ color: 'var(--color-ink-secondary)', lineHeight: 1.6, margin: 0 }}>
            El sistema se rige por el principio metodológico secuencial. Cada tema debe avanzar por las 8 actividades verificables
            antes de considerarse al 100% completado. Observa la animación del recorrido metodológico:
          </p>

          {/* Controles interactivos de reproducción */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsPlayingFlow(!isPlayingFlow)}
                icon={isPlayingFlow ? <Pause size={14} /> : <Play size={14} />}
              >
                {isPlayingFlow ? 'Pausar Simulación' : '▶ Reproducir Animación de Flujo'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsPlayingFlow(false);
                  setActiveStep(0);
                }}
                icon={<RotateCcw size={14} />}
              >
                Reiniciar
              </Button>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-terracotta)' }}>
              Paso Activo: {activeStep + 1} de 8
            </span>
          </div>

          {/* Barra SVG animada de Progreso / Ruta */}
          <div style={{ position: 'relative', width: '100%', height: '16px', overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute',
                top: '6px',
                left: '0',
                width: '100%',
                height: '4px',
                backgroundColor: 'var(--color-border)',
                borderRadius: '2px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '6px',
                left: '0',
                width: `${((activeStep + 1) / STEPS_CURRICULARES.length) * 100}%`,
                height: '4px',
                backgroundColor: STEPS_CURRICULARES[activeStep].color,
                borderRadius: '2px',
                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: `0 0 10px ${STEPS_CURRICULARES[activeStep].color}`,
              }}
            />
          </div>

          {/* Nodos interactivos del Flujo */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.65rem',
            }}
          >
            {STEPS_CURRICULARES.map((st, idx) => {
              const isCurrent = activeStep === idx;
              return (
                <div
                  key={st.title}
                  onClick={() => {
                    setIsPlayingFlow(false);
                    setActiveStep(idx);
                  }}
                  style={{
                    padding: '0.75rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isCurrent ? 'var(--color-card)' : 'var(--color-card-muted)',
                    border: `1.5px solid ${isCurrent ? st.color : 'var(--color-border)'}`,
                    boxShadow: isCurrent ? `0 0 14px ${st.color}40` : 'none',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transform: isCurrent ? 'scale(1.05) translateY(-3px)' : 'scale(1)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 800, color: st.color }}>
                    {st.title}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-ink-muted)', marginTop: '0.2rem' }}>
                    {st.sub}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tarjeta de Detalle del Paso Activo */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--color-card-muted)',
              border: `1.5px solid ${STEPS_CURRICULARES[activeStep].color}`,
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: `${STEPS_CURRICULARES[activeStep].color}25`,
                color: STEPS_CURRICULARES[activeStep].color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 800,
                fontSize: '18px',
                boxShadow: `0 0 12px ${STEPS_CURRICULARES[activeStep].color}30`,
              }}
            >
              {activeStep + 1}
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-ink)' }}>
                {STEPS_CURRICULARES[activeStep].title} — {STEPS_CURRICULARES[activeStep].sub}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)', marginTop: '0.2rem' }}>
                {STEPS_CURRICULARES[activeStep].desc}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sec_kdd_crisp',
      titulo: '2. KDD vs. CRISP-DM (Órbitas Interactivas)',
      categoria: 'Metodología',
      icono: <Activity size={16} />,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                variant={methodologyView === 'crisp' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setMethodologyView('crisp')}
              >
                Ciclo CRISP-DM (Wirth & Hipp)
              </Button>
              <Button
                variant={methodologyView === 'kdd' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setMethodologyView('kdd')}
              >
                Embudo KDD (Fayyad et al.)
              </Button>
            </div>
            {methodologyView === 'crisp' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlayingCrisp(!isPlayingCrisp)}
                icon={isPlayingCrisp ? <Pause size={14} /> : <Play size={14} />}
              >
                {isPlayingCrisp ? 'Detener Ciclo' : '▶ Animar Giro del Ciclo'}
              </Button>
            )}
          </div>

          {methodologyView === 'crisp' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)', margin: 0 }}>
                CRISP-DM es un ciclo continuo no lineal de 6 fases. La evaluación genera retroalimentación directa hacia
                el negocio o la preparación de datos. Haz clic en cada nodo para explorar su función:
              </p>

              {/* Diagrama Orbital SVG Interactivo */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '1.5rem 0',
                  backgroundColor: 'var(--color-card-muted)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <svg width="340" height="340" viewBox="-170 -170 340 340" style={{ overflow: 'visible' }}>
                  {/* Órbita Guía */}
                  <circle cx="0" cy="0" r="120" fill="none" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="6 6" />

                  {/* Flechas directas de conexión orbital */}
                  <circle
                    cx="0"
                    cy="0"
                    r="120"
                    fill="none"
                    stroke="var(--color-terracotta)"
                    strokeWidth="3"
                    strokeDasharray="60 40"
                    style={{
                      animation: 'dashTravel 6s linear infinite',
                      opacity: 0.6,
                    }}
                  />

                  {/* Centro del Ciclo */}
                  <circle cx="0" cy="0" r="50" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1.5" />
                  <text
                    x="0"
                    y="-6"
                    textAnchor="middle"
                    fill="var(--color-ink)"
                    fontSize="11"
                    fontWeight="800"
                    fontFamily="var(--font-sans)"
                  >
                    CRISP-DM
                  </text>
                  <text
                    x="0"
                    y="12"
                    textAnchor="middle"
                    fill="var(--color-terracotta)"
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="var(--font-mono)"
                  >
                    Fase {activeCrispStep + 1} / 6
                  </text>

                  {/* 6 Nodos Orbitando */}
                  {CRISP_STAGES.map((st, i) => {
                    const rad = (st.angle * Math.PI) / 180;
                    const nx = Math.cos(rad) * 120;
                    const ny = Math.sin(rad) * 120;
                    const isSel = activeCrispStep === i;

                    return (
                      <g
                        key={st.name}
                        onClick={() => {
                          setIsPlayingCrisp(false);
                          setActiveCrispStep(i);
                        }}
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                      >
                        {/* Glow del nodo activo */}
                        {isSel && (
                          <circle cx={nx} cy={ny} r="26" fill={st.color} fillOpacity="0.25">
                            <animate attributeName="r" values="24;30;24" dur="1.8s" repeatCount="indefinite" />
                          </circle>
                        )}
                        <circle
                          cx={nx}
                          cy={ny}
                          r={isSel ? 20 : 16}
                          fill={isSel ? st.color : 'var(--color-card)'}
                          stroke={st.color}
                          strokeWidth="2.5"
                          style={{ transition: 'all 0.25s ease' }}
                        />
                        <text
                          x={nx}
                          y={ny + 4}
                          textAnchor="middle"
                          fill={isSel ? '#FFFFFF' : 'var(--color-ink)'}
                          fontSize="11"
                          fontWeight="800"
                          fontFamily="var(--font-mono)"
                        >
                          {i + 1}
                        </text>
                        {/* Etiqueta textual exterior */}
                        <text
                          x={nx * 1.32}
                          y={ny * 1.32 + 4}
                          textAnchor="middle"
                          fill={isSel ? st.color : 'var(--color-ink-secondary)'}
                          fontSize="9.5"
                          fontWeight={isSel ? '800' : '600'}
                          fontFamily="var(--font-sans)"
                        >
                          {st.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Ficha explicativa de la fase seleccionada */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-card-muted)',
                  border: `1.5px solid ${CRISP_STAGES[activeCrispStep].color}`,
                }}
              >
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: CRISP_STAGES[activeCrispStep].color }}>
                  {CRISP_STAGES[activeCrispStep].name}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                  {CRISP_STAGES[activeCrispStep].desc}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)', margin: 0 }}>
                El proceso KDD (Knowledge Discovery in Databases) modela la destilación de datos crudos hasta conocimiento aplicable:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { stage: '1. Datos Crudos', action: 'Selección de muestra y extracción tabular de repositorios canónicos', badge: 'Entrada' },
                  { stage: '2. Datos Seleccionados', action: 'Preprocesamiento (Detección de outliers e imputación estocástica)', badge: 'Limpieza' },
                  { stage: '3. Datos Preprocesados', action: 'Transformación (Normalización Min-Max, estandarización Z-score)', badge: 'Estructura' },
                  { stage: '4. Patrones Descubiertos', action: 'Minería de Datos (Hartigan-Wong K-Means, CART, Perceptrón)', badge: 'Algoritmo' },
                  { stage: '5. Conocimiento Formal', action: 'Evaluación rigurosa de hipótesis y compilación en LaTeX Beamer', badge: 'Salida' },
                ].map((kdd) => (
                  <div
                    key={kdd.stage}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--color-card-muted)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-terracotta)', minWidth: '150px' }}>
                      {kdd.stage}
                    </span>
                    <ArrowRight size={14} style={{ color: 'var(--color-ink-muted)' }} />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink)', flex: 1 }}>
                      {kdd.action}
                    </span>
                    <StatusBadge status="completado" label={kdd.badge} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'sec_kmeans_sim',
      titulo: '3. Simulador Interactivo K-Means (Hartigan-Wong)',
      categoria: 'Algoritmos',
      icono: <Sparkles size={16} />,
      render: () => {
        const clusterColors = ['#0EA5E9', '#2563EB', '#EA580C'];
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ color: 'var(--color-ink-secondary)', lineHeight: 1.6, margin: 0 }}>
              Simulación interactiva paso a paso del algoritmo de clustering de <strong>Hartigan-Wong / Lloyd</strong> para $k=3$.
              Observa cómo los centroides recalculan sus coordenadas hacia la media de los datos y minimizan la inercia WCSS en cada iteración:
            </p>

            {/* Barra de Controles y Métricas */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAutoKmeans(!isAutoKmeans)}
                  disabled={kmeansConverged}
                  icon={isAutoKmeans ? <Pause size={14} /> : <Play size={14} />}
                >
                  {isAutoKmeans ? 'Pausar' : '▶ Auto-Iterar'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runKmeansStep}
                  disabled={kmeansConverged || isAutoKmeans}
                  icon={<ArrowRight size={14} />}
                >
                  Paso a Paso
                </Button>
                <Button variant="ghost" size="sm" onClick={resetKmeans} icon={<RotateCcw size={14} />}>
                  Reiniciar Centroides
                </Button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-secondary)' }}>
                  Iteración: <strong style={{ color: 'var(--color-ink)' }}>{kmeansIteration}</strong>
                </span>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-secondary)' }}>
                  WCSS Inercia: <strong style={{ color: 'var(--color-terracotta)' }}>{currentWCSS}</strong>
                </span>
                {kmeansConverged && (
                  <StatusBadge status="completado" label="Convergencia Exitosa" />
                )}
              </div>
            </div>

            {/* Lienzo SVG de Gráfico de Dispersión y Centroides */}
            <div
              style={{
                backgroundColor: '#0B0F17',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-border)',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-atlas-md)',
              }}
            >
              <svg width="500" height="280" viewBox="0 0 500 280" style={{ width: '100%', maxWidth: '640px', height: 'auto' }}>
                {/* Cuadrícula Cartesiana */}
                <line x1="40" y1="20" x2="40" y2="250" stroke="#1E293B" strokeWidth="1" />
                <line x1="40" y1="250" x2="480" y2="250" stroke="#1E293B" strokeWidth="1" />
                {[50, 100, 150, 200].map((y) => (
                  <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#1E293B" strokeWidth="0.8" strokeDasharray="3 3" />
                ))}

                {/* Líneas tenues de conexión Punto -> Centroide */}
                {points.map((p, idx) => {
                  const c = centroids[p.cluster];
                  return (
                    <line
                      key={`line-${idx}`}
                      x1={p.x}
                      y1={p.y}
                      x2={c.x}
                      y2={c.y}
                      stroke={clusterColors[p.cluster]}
                      strokeWidth="0.5"
                      strokeOpacity="0.25"
                    />
                  );
                })}

                {/* Puntos de Datos */}
                {points.map((p, idx) => (
                  <circle
                    key={`point-${idx}`}
                    cx={p.x}
                    cy={p.y}
                    r="4.5"
                    fill={clusterColors[p.cluster]}
                    fillOpacity="0.85"
                    stroke="#FFFFFF"
                    strokeWidth="0.75"
                    style={{ transition: 'all 0.4s ease' }}
                  />
                ))}

                {/* 3 Centroides Móviles con Animación de Pulso */}
                {centroids.map((c, idx) => (
                  <g key={`centroid-${idx}`} style={{ transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    <circle cx={c.x} cy={c.y} r="16" fill={clusterColors[idx]} fillOpacity="0.2">
                      <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <polygon
                      points={`${c.x},${c.y - 10} ${c.x + 9},${c.y + 6} ${c.x - 9},${c.y + 6}`}
                      fill={clusterColors[idx]}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <text
                      x={c.x}
                      y={c.y + 18}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="800"
                      fontFamily="var(--font-mono)"
                    >
                      μ{idx + 1}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', textAlign: 'center' }}>
              ▲ Los triángulos representan los centroides $\mu_k$. Los círculos corresponden a observaciones empíricas.
            </div>
          </div>
        );
      },
    },
    {
      id: 'sec_cart_sim',
      titulo: '4. Simulador de Partición CART (Árbol de Decisión)',
      categoria: 'Algoritmos',
      icono: <Sliders size={16} />,
      render: () => {
        // Datos sintéticos: 12 muestras de Clase A (Setosa: Petal.Length < 2.5) y 12 de Clase B (Versicolor: >= 2.5)
        const totalN = 24;
        const leftCount = Math.round(cartThreshold * 5);
        const rightCount = totalN - leftCount;
        const giniLeft = (1 - (Math.pow(Math.min(leftCount, 12) / Math.max(leftCount, 1), 2) + Math.pow(Math.max(0, leftCount - 12) / Math.max(leftCount, 1), 2))).toFixed(3);
        const giniRight = (1 - (Math.pow(Math.max(0, 12 - leftCount) / Math.max(rightCount, 1), 2) + Math.pow(Math.min(rightCount, 12) / Math.max(rightCount, 1), 2))).toFixed(3);
        const isOptimal = Math.abs(cartThreshold - 2.45) < 0.15;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <p style={{ color: 'var(--color-ink-secondary)', lineHeight: 1.6, margin: 0 }}>
              El algoritmo <strong>CART (Breiman et al., 1984)</strong> busca el punto de corte $\theta$ que maximice la reducción
              de impureza Gini ($I_G = 1 - \sum p_i^2$). Mueve el deslizador para ver cómo cambia la pureza en tiempo real:
            </p>

            {/* Slider de Umbral Interactivo */}
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'var(--color-card-muted)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-ink)' }}>
                  Umbral de Partición: <code>Petal.Length &lt; {cartThreshold.toFixed(2)} cm</code>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCartThreshold(2.45)}
                  icon={<Sparkles size={14} />}
                >
                  Fijar Corte Óptimo (2.45 cm)
                </Button>
              </div>

              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.05"
                value={cartThreshold}
                onChange={(e) => setCartThreshold(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-terracotta)', cursor: 'pointer' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                <span>1.0 cm (Sub-partición)</span>
                <span style={{ color: isOptimal ? 'var(--color-success-ink)' : 'inherit', fontWeight: isOptimal ? 800 : 500 }}>
                  {isOptimal ? '★ Corte Óptimo Canónico (Gini Puro)' : 'Corte Evaluado'}
                </span>
                <span>5.0 cm (Sobre-partición)</span>
              </div>
            </div>

            {/* Diagrama SVG del Árbol Binario Dinámico */}
            <div
              style={{
                backgroundColor: '#0B0F17',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <svg width="460" height="220" viewBox="0 0 460 220" style={{ width: '100%', maxWidth: '520px', height: 'auto' }}>
                {/* Ramas Conectoras */}
                <line x1="230" y1="50" x2="110" y2="140" stroke="var(--color-terracotta)" strokeWidth="2.5" />
                <line x1="230" y1="50" x2="350" y2="140" stroke="var(--color-blue-ink)" strokeWidth="2.5" />

                {/* Texto en ramas */}
                <text x="145" y="85" fill="var(--color-terracotta)" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
                  SÍ (&lt; {cartThreshold.toFixed(2)})
                </text>
                <text x="275" y="85" fill="var(--color-blue-ink)" fontSize="10" fontWeight="700" fontFamily="var(--font-mono)">
                  NO (&ge; {cartThreshold.toFixed(2)})
                </text>

                {/* Nodo Raíz */}
                <rect x="150" y="10" width="160" height="45" rx="6" fill="#1E293B" stroke="var(--color-border)" strokeWidth="1.5" />
                <text x="230" y="28" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">
                  Petal.Length &lt; {cartThreshold.toFixed(2)}
                </text>
                <text x="230" y="44" textAnchor="middle" fill="#94A3B8" fontSize="9.5" fontFamily="var(--font-mono)">
                  N = 24 | Gini = 0.500
                </text>

                {/* Hoja Izquierda */}
                <rect
                  x="30"
                  y="140"
                  width="160"
                  height="55"
                  rx="6"
                  fill="#0F172A"
                  stroke={giniLeft === '0.000' ? '#10B981' : 'var(--color-terracotta)'}
                  strokeWidth="2"
                />
                <text x="110" y="160" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">
                  Clase: Iris-setosa
                </text>
                <text x="110" y="176" textAnchor="middle" fill="#94A3B8" fontSize="9.5" fontFamily="var(--font-mono)">
                  N = {leftCount} | Gini = {giniLeft}
                </text>
                {giniLeft === '0.000' && (
                  <text x="110" y="190" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="800">
                    ✓ Hoja Pura
                  </text>
                )}

                {/* Hoja Derecha */}
                <rect
                  x="270"
                  y="140"
                  width="160"
                  height="55"
                  rx="6"
                  fill="#0F172A"
                  stroke={giniRight === '0.000' ? '#10B981' : 'var(--color-blue-ink)'}
                  strokeWidth="2"
                />
                <text x="350" y="160" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">
                  Clase: Versicolor / Virginica
                </text>
                <text x="350" y="176" textAnchor="middle" fill="#94A3B8" fontSize="9.5" fontFamily="var(--font-mono)">
                  N = {rightCount} | Gini = {giniRight}
                </text>
                {giniRight === '0.000' && (
                  <text x="350" y="190" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="800">
                    ✓ Hoja Pura
                  </text>
                )}
              </svg>
            </div>
          </div>
        );
      },
    },
    {
      id: 'sec_scholar_prisma',
      titulo: '5. Ecuaciones Booleanas & PRISMA',
      categoria: 'Investigación',
      icono: <Search size={16} />,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: 'var(--color-ink-secondary)', lineHeight: 1.6, margin: 0 }}>
            Las 360 ecuaciones siguen estándares bibliométricos con operadores booleanos estrictos. Selecciona un operador
            para ver cómo afecta la intersección de conjuntos bibliográficos:
          </p>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['AND', 'OR', 'NOT'] as const).map((op) => (
              <Button
                key={op}
                variant={activeOperator === op ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActiveOperator(op)}
              >
                Operador {op}
              </Button>
            ))}
          </div>

          {/* Diagrama Interactivo de Operador Booleano */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--color-card-muted)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--color-ink)' }}>
                {activeOperator === 'AND' && 'Operador AND (Intersección Estricta)'}
                {activeOperator === 'OR' && 'Operador OR (Unión de Términos)'}
                {activeOperator === 'NOT' && 'Operador NOT / Exclusión (-commercial)'}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', marginTop: '0.25rem', maxWidth: '480px' }}>
                {activeOperator === 'AND' && 'Solo incluye artículos que contengan simultáneamente ambos conceptos clave. Reduce el ruido y maximiza la precisión.'}
                {activeOperator === 'OR' && 'Incluye literatura con sinónimos o variantes lingüísticas (ej: "data mining" OR "minería de datos"). Maximiza la cobertura.'}
                {activeOperator === 'NOT' && 'Excluye sistemáticamente aplicaciones comerciales, patentes o literatura no científica no revisada por pares.'}
              </div>
              <div className="code-block" style={{ marginTop: '0.75rem', fontSize: '11px' }}>
                {activeOperator === 'AND' && '("data mining") AND ("cluster analysis") AND ("k-means")'}
                {activeOperator === 'OR' && '("data mining" OR "minería de datos" OR "KDD")'}
                {activeOperator === 'NOT' && '("decision trees" OR "CART") -commercial -patent'}
              </div>
            </div>

            {/* Gráfico SVG interactivo de conjuntos */}
            <svg width="180" height="110" viewBox="0 0 180 110">
              <circle
                cx="65"
                cy="55"
                r="40"
                fill={activeOperator === 'OR' || activeOperator === 'NOT' ? 'var(--color-terracotta)' : 'var(--color-border)'}
                fillOpacity={activeOperator === 'AND' ? 0.2 : 0.6}
                stroke="var(--color-terracotta)"
                strokeWidth="2"
              />
              <circle
                cx="115"
                cy="55"
                r="40"
                fill={activeOperator === 'OR' ? 'var(--color-blue-ink)' : activeOperator === 'NOT' ? 'transparent' : 'var(--color-border)'}
                fillOpacity={activeOperator === 'AND' ? 0.2 : 0.6}
                stroke="var(--color-blue-ink)"
                strokeWidth="2"
              />
              {activeOperator === 'AND' && (
                <path
                  d="M 90,20 A 40,40 0 0,1 90,90 A 40,40 0 0,1 90,20"
                  fill="var(--color-success-ink)"
                  fillOpacity="0.85"
                />
              )}
            </svg>
          </div>
        </div>
      ),
    },
    {
      id: 'sec_r_lab',
      titulo: '6. Laboratorio en R Nativo',
      categoria: 'Laboratorio',
      icono: <Terminal size={16} />,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: 'var(--color-ink-secondary)', lineHeight: 1.6, margin: 0 }}>
            Todos los scripts se ejecutan nativamente en R v4.4.1 fijando <code>set.seed</code> para garantizar total reproducibilidad.
            Puedes probar la simulación de ejecución en tiempo real:
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Button
              variant="primary"
              size="sm"
              onClick={runRSimulation}
              disabled={rRunning}
              icon={<Play size={14} />}
            >
              {rRunning ? 'Ejecutando Rscript...' : '⚡ Simular Ejecución Rscript en Vivo'}
            </Button>
            {rComplete && (
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-success-ink)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={15} /> Ejecución completada sin errores (Exit Code 0)
              </span>
            )}
          </div>

          {/* Consola Terminal Interactiva */}
          <div
            style={{
              backgroundColor: '#0B0F17',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #1E293B',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: '#38BDF8',
              minHeight: '160px',
              maxHeight: '260px',
              overflowY: 'auto',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
            }}
          >
            {rLogs.length === 0 ? (
              <span style={{ color: '#64748B' }}>
                $ Esperando comando. Presiona "Simular Ejecución Rscript en Vivo" para iniciar el runtime de R...
              </span>
            ) : (
              rLogs.map((log: string, i: number) => (
                <div key={i} style={{ marginBottom: '0.3rem', lineHeight: 1.4 }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'sec_latex_pipe',
      titulo: '7. Pipeline LaTeX & Reproducibilidad',
      categoria: 'Documentación',
      icono: <FileText size={16} />,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: 'var(--color-ink-secondary)', lineHeight: 1.6, margin: 0 }}>
            El informe académico y las diapositivas de sustentación Beamer se compilan mediante un flujo automatizado
            que inyecta directamente los resultados generados en R sin intervención manual:
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Button
              variant="primary"
              size="sm"
              onClick={runLatexPipeline}
              disabled={isCompilingLatex}
              icon={isCompilingLatex ? <RefreshCw className="spin" size={14} /> : <Play size={14} />}
            >
              {isCompilingLatex ? 'Compilando Pipeline...' : '▶ Iniciar Pipeline de Compilación'}
            </Button>
            {latexStep === 4 && (
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-success-ink)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={15} /> Documento y Diapositivas Beamer generados con éxito
              </span>
            )}
          </div>

          {/* Pasos Visuales del Pipeline */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {[
              { num: 1, title: '1. Extracción de Métricas', desc: 'WCSS, Silueta y matrices tabulares desde Rscript' },
              { num: 2, title: '2. Inyección .tex', desc: 'Carga en plantilla formal LaTeX con referencias BibTeX' },
              { num: 3, title: '3. pdflatex Engine', desc: 'Compilación en doble pasada para índices y figuras' },
              { num: 4, title: '4. Artefacto Final', desc: 'Generación de manuscrito PDF y presentación Beamer' },
            ].map((st) => {
              const isDone = latexStep >= st.num;
              const isCurrent = latexStep === st.num && isCompilingLatex;
              return (
                <div
                  key={st.num}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isDone ? 'var(--color-card)' : 'var(--color-card-muted)',
                    border: `1.5px solid ${isDone ? 'var(--color-success-ink)' : isCurrent ? 'var(--color-terracotta)' : 'var(--color-border)'}`,
                    boxShadow: isCurrent ? '0 0 10px rgba(181, 83, 47, 0.35)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: isDone ? 'var(--color-success-ink)' : 'var(--color-ink-muted)' }}>
                      Fase {st.num}
                    </span>
                    {isDone && <Check size={14} style={{ color: 'var(--color-success-ink)' }} />}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-ink)' }}>
                    {st.title}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
                    {st.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = manualSections.filter(
    (s) =>
      s.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeContent = manualSections.find((s) => s.id === selectedId) || manualSections[0];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Encabezado */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <BookOpen size={22} style={{ color: 'var(--color-terracotta)' }} />
          <h2 className="atlas-title" style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
            Manual Metodológico Interactivo
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-secondary)', margin: 0 }}>
          Guía interactiva con animaciones dinámicas, simuladores de K-Means y CART, video explicativo y laboratorio R.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Navegación Lateral */}
        <Card padding="md">
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-ink-muted)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en el manual..."
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                backgroundColor: 'var(--color-card-muted)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-ink)',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {filteredSections.map((sec) => {
              const isSelected = sec.id === selectedId;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setSelectedId(sec.id)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--color-terracotta-border)' : 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isSelected ? 'var(--color-terracotta-soft)' : 'transparent',
                    color: isSelected ? 'var(--color-terracotta)' : 'var(--color-ink-secondary)',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                  }}
                >
                  <span style={{ color: isSelected ? 'var(--color-terracotta)' : 'var(--color-ink-muted)' }}>
                    {sec.icono}
                  </span>
                  <span>{sec.titulo}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Contenido Seleccionado */}
        <Card padding="lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <StatusBadge status="actual" label={activeContent.categoria} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-ink)', margin: 0 }}>
              {activeContent.titulo}
            </h3>
          </div>
          <div>
            {activeContent.render()}
          </div>
        </Card>
      </div>
    </div>
  );
};
