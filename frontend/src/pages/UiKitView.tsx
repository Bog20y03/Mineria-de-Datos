import React, { useState } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import {
  Button,
  Card,
  MissionCard,
  StationCard,
  ObjectPiece,
  ProgressBar,
  StatusBadge,
  Banner,
  DataTable,
  Tabs,
  EmptyState,
  Loading,
  ErrorMessage,
  RoutePath,
  type RouteNode,
} from '../components/ui';
import { ESTACIONES_MAQUINA, ENCARGOS_UNIDADES } from '../data/narrativa';
import {
  Compass,
  // Layers,
  // Sparkles,
  BookOpen,
  Terminal,
  Play,
  RotateCw,
  // Binary,
  // CheckCircle2,
  // Wind,
} from 'lucide-react';

export const UiKitView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('todos');
  const [interactiveCounter, setInteractiveCounter] = useState(360);
  const [btnLoading, setBtnLoading] = useState(false);
  const [selectedRouteNode, setSelectedRouteNode] = useState('lab');

  // Demostración de useCountUp
  const animatedNumber = useCountUp(interactiveCounter);

  // Nodos de demostración para RoutePath
  const sampleRouteNodes: RouteNode[] = [
    {
      id: 'term',
      label: '1. Terminal',
      sublabel: 'DW-001..100',
      status: 'completado',
      icon: <Terminal size={18} />,
    },
    {
      id: 'biblio',
      label: '2. Biblioteca',
      sublabel: 'Matriz y DOI',
      status: 'completado',
      icon: <BookOpen size={18} />,
    },
    {
      id: 'lab',
      label: '3. Laboratorio',
      sublabel: 'Script R real',
      status: 'actual',
      icon: <Play size={18} />,
    },
    {
      id: 'escritorio',
      label: '4. Escritorio',
      sublabel: 'LaTeX / PDF',
      status: 'pendiente',
    },
    {
      id: 'pizarra',
      label: '5. Pizarra',
      sublabel: 'Sustentación',
      status: 'bloqueado',
    },
  ];

  // Datos para DataTable con filtro
  const sampleTableData = [
    {
      id: 'DW-001',
      idioma: 'Español',
      termino: '"Minería de datos" AND "algoritmos"',
      resultados: 15,
      estado: 'completado' as const,
    },
    {
      id: 'DW-002',
      idioma: 'Inglés',
      termino: '"Data warehouse" AND "ETL" AND "architecture"',
      resultados: 28,
      estado: 'completado' as const,
    },
    {
      id: 'DW-011',
      idioma: 'Español',
      termino: '"KDD" AND "CRISP-DM" AND "metodología"',
      resultados: 10,
      estado: 'actual' as const,
    },
    {
      id: 'DW-012',
      idioma: 'Inglés',
      termino: '"Hybrid models" AND "classification"',
      resultados: 12,
      estado: 'pendiente' as const,
    },
    {
      id: 'DW-015',
      idioma: 'Inglés',
      termino: '"Deep learning" AND "prediction" AND "enterprise"',
      resultados: 0,
      estado: 'bloqueado' as const,
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
        gap: '2.5rem',
      }}
    >
      {/* Banner Principal del UI Kit */}
      <Banner
        variant="atlas"
        titulo="Sistema de Diseño Atlas Claro · Catálogo UI Kit"
        subtitulo="Fundación visual sobria y académica para La Máquina de Minería (AGENTS.md §9). Contraste AA, escala tipográfica >= 14px, variables canónicas y componentes con todos sus estados."
        icono={<Compass size={24} />}
        metricaPrincipal={{ valor: '14', etiqueta: 'Componentes' }}
        metricaSecundaria={{ valor: '100%', etiqueta: 'Atlas Claro' }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <StatusBadge status="completado" label="Paleta Papel / Tinta Azul / Terracota" />
          <StatusBadge status="actual" label="Fase 3 Activa" />
          <StatusBadge status="pendiente" label="Fase 4: Migración de Vistas" />
        </div>
      </Banner>

      {/* Selector de Sección del UI Kit */}
      <Tabs
        variant="pill"
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'todos', label: 'Ver Todo el Catálogo' },
          { id: 'botones', label: 'Botones e Insignias' },
          { id: 'maquina', label: 'La Máquina (Estaciones y Piezas)' },
          { id: 'misiones', label: 'Misiones y Ruta' },
          { id: 'datos', label: 'Tablas y Retroalimentación' },
          { id: 'vida_visual', label: 'Vida Visual (Fase 4.5)' },
        ]}
      />

      {/* SECCIÓN 1: BOTONES E INSIGNIAS */}
      {(activeTab === 'todos' || activeTab === 'botones') && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 className="atlas-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
              1. Botones (Button) e Insignias de Estado (StatusBadge)
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)' }}>
              Variantes de acción con colores semánticos sobrios. La terracota para acciones principales y tinta azul para secundarias.
            </p>
          </div>

          <Card
            header={
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                Variantes de Botón y Estados de Carga
              </span>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Variantes */}
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Variantes por jerarquía:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                  <Button variant="primary">Primario (Terracota)</Button>
                  <Button variant="secondary">Secundario (Tinta Azul)</Button>
                  <Button variant="outline">Contorno (Papel)</Button>
                  <Button variant="ghost">Fantasma (Texto)</Button>
                  <Button variant="danger">Peligro / Alerta</Button>
                </div>
              </div>

              {/* Tamaños */}
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Escala de tamaños:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                  <Button size="sm" variant="outline">Pequeño (sm)</Button>
                  <Button size="md" variant="primary">Mediano (md)</Button>
                  <Button size="lg" variant="secondary">Grande (lg)</Button>
                  <Button
                    loading={btnLoading}
                    variant="primary"
                    onClick={() => {
                      setBtnLoading(true);
                      setTimeout(() => setBtnLoading(false), 1500);
                    }}
                    icon={<RotateCw size={14} />}
                  >
                    {btnLoading ? 'Procesando...' : 'Probar Loading'}
                  </Button>
                  <Button disabled variant="primary">Desactivado</Button>
                </div>
              </div>

              {/* StatusBadges */}
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>
                  Insignias semánticas del Atlas (StatusBadge):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                  <StatusBadge status="completado" label="Completado (Tinta Azul)" />
                  <StatusBadge status="actual" label="En Curso / Actual (Terracota)" />
                  <StatusBadge status="pendiente" label="Pendiente (Gris punteado)" />
                  <StatusBadge status="bloqueado" label="Bloqueado (Gris apagado)" />
                  <StatusBadge status="completado" size="sm" label="Compacto sm" />
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* SECCIÓN 2: LA MÁQUINA (ESTACIONES Y PIEZAS) */}
      {(activeTab === 'todos' || activeTab === 'maquina') && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 className="atlas-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
              2. La Máquina de Minería: Estaciones (StationCard) y Piezas (ObjectPiece)
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)' }}>
              Cada estación representa una etapa de la línea de producción del conocimiento (AGENTS.md §7).
              Los objetos viajan e interactúan con entradas y salidas reales.
            </p>
          </div>

          {/* Piezas del conocimiento */}
          <Card
            header={
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                Piezas del Conocimiento (ObjectPiece) — Estados y Tipos
              </span>
            }
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <ObjectPiece
                tipo="consulta"
                titulo="Consulta Booleana DW-001"
                subtitulo='("Data Warehouse" AND "Minería")'
                estado="listo"
                detalles="15 resultados indexados"
              />
              <ObjectPiece
                tipo="documentos"
                titulo="Artículos Académicos (12)"
                subtitulo="IEEE, Springer y Elsevier"
                estado="listo"
                detalles="DOI verificados"
              />
              <ObjectPiece
                tipo="dataset_script"
                titulo="Script R: Clasificación C5.0"
                subtitulo="tema_1_ejemplo.R"
                estado="en_proceso"
                detalles="Ejecutando en Rscript..."
              />
              <ObjectPiece
                tipo="metricas_graficas"
                titulo="Matriz y Curva ROC (.png)"
                subtitulo="Accuracy: 0.94 · AUC: 0.96"
                estado="listo"
                detalles="Salida gráfica generada"
              />
              <ObjectPiece
                tipo="latex_doc"
                titulo="Documento tema_1.tex"
                subtitulo="Estructura formal y fórmulas"
                estado="pendiente"
                detalles="Pendiente de compilación"
              />
              <ObjectPiece
                tipo="presentacion"
                titulo="Material de Sustentación"
                subtitulo="Defensa ante comité"
                estado="bloqueado"
                detalles="Requiere completar LaTeX"
              />
            </div>
          </Card>

          {/* Tarjetas de Estaciones */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            <StationCard
              station={ESTACIONES_MAQUINA[0]}
              state="disponible"
              actionLabel="Ver Historial"
              onAction={() => alert('Estación Terminal')}
            />
            <StationCard
              station={ESTACIONES_MAQUINA[1]}
              state="disponible"
              actionLabel="Inspeccionar Matriz"
              onAction={() => alert('Estación Biblioteca')}
            />
            <StationCard
              station={ESTACIONES_MAQUINA[2]}
              state="activa"
              actionLabel="Ejecutar Script R"
              onAction={() => alert('Estación Laboratorio')}
            />
            <StationCard
              station={ESTACIONES_MAQUINA[3]}
              state="disponible"
              actionLabel="Generar LaTeX"
              onAction={() => alert('Estación Escritorio')}
            />
            <StationCard
              station={ESTACIONES_MAQUINA[4]}
              state="bloqueada"
              actionLabel="Bloqueada"
              onAction={() => {}}
            />
          </div>
        </section>
      )}

      {/* SECCIÓN 3: MISIONES Y RUTA DE ATLAS */}
      {(activeTab === 'todos' || activeTab === 'misiones') && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 className="atlas-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
              3. Misiones Académicas (MissionCard) y Ruta de Atlas (RoutePath)
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)' }}>
              El progreso se organiza como un camino con nodos tipo atlas, guiado por los encargos narrativos de las 4 unidades.
            </p>
          </div>

          {/* Camino con nodos RoutePath */}
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 700 }}>
              Camino interactivo de estaciones (RoutePath):
            </div>
            <RoutePath
              nodes={sampleRouteNodes}
              activeNodeId={selectedRouteNode}
              onSelectNode={(id) => setSelectedRouteNode(id)}
            />
          </div>

          {/* Tarjetas de Misión */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
            <MissionCard
              id="U1-T1"
              unidadNumero={1}
              temaNumero={1}
              titulo="Introducción y Metodología KDD"
              encargo={ENCARGOS_UNIDADES[1].encargoNarrativo}
              estado="completada"
              progresoPorcentaje={100}
              pistas={{ documentosCount: 15, tieneVideoClip: true }}
              evidencias={{ tieneResultados: true, tieneScriptR: true, tieneLatex: true }}
              onAbrir={(id) => alert(`Abrir misión ${id}`)}
            />

            <MissionCard
              id="U2-T1"
              unidadNumero={2}
              temaNumero={1}
              titulo="Árboles de Decisión y Reglas"
              encargo={ENCARGOS_UNIDADES[2].encargoNarrativo}
              estado="en_curso"
              progresoPorcentaje={60}
              pistas={{ documentosCount: 8, tieneVideoClip: true }}
              evidencias={{ tieneResultados: false, tieneScriptR: true, tieneLatex: false }}
              onAbrir={(id) => alert(`Abrir misión ${id}`)}
            />

            <MissionCard
              id="U3-T1"
              unidadNumero={3}
              temaNumero={1}
              titulo="Minería en Datasets Gubernamentales"
              encargo={ENCARGOS_UNIDADES[3].encargoNarrativo}
              estado="pendiente"
              progresoPorcentaje={0}
              pistas={{ documentosCount: 5, tieneVideoClip: false }}
              evidencias={{ tieneResultados: false, tieneScriptR: false, tieneLatex: false }}
              onAbrir={(id) => alert(`Abrir misión ${id}`)}
            />
          </div>
        </section>
      )}

      {/* SECCIÓN 4: TABLAS, BARRAS Y RETROALIMENTACIÓN */}
      {(activeTab === 'todos' || activeTab === 'datos') && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 className="atlas-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
              4. Tablas con Filtro (DataTable), Barras de Progreso y Estados
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)' }}>
              Componentes para visualización tabular sobria, retroalimentación ante errores y estados de espera.
            </p>
          </div>

          {/* Barras de avance */}
          <Card
            header={
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                Barras de Progreso Semánticas (ProgressBar)
              </span>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <ProgressBar
                percentage={interactiveCounter}
                label="Progreso General de la Unidad"
                sublabel="13 de 20 actividades completadas"
                variant="blue"
                size="md"
              />
              <ProgressBar
                percentage={45}
                label="Operación Actual de La Máquina"
                sublabel="Ejecutando modelo en servidor R..."
                variant="terracotta"
                size="sm"
              />
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setInteractiveCounter((c) => Math.max(0, c - 10))}
                >
                  -10%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setInteractiveCounter((c) => Math.min(100, c + 10))}
                >
                  +10%
                </Button>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                  (Prueba interactiva del ProgressBar)
                </span>
              </div>
            </div>
          </Card>

          {/* DataTable con Filtro */}
          <DataTable
            data={sampleTableData}
            searchPlaceholder="Filtrar por término o código..."
            columns={[
              {
                key: 'id',
                header: 'ID Consulta',
                width: '120px',
                render: (row) => (
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-ink)' }}>
                    {row.id}
                  </span>
                ),
              },
              {
                key: 'termino',
                header: 'Ecuación Booleana Registrada',
                render: (row) => (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--color-blue-ink)' }}>
                    {row.termino}
                  </span>
                ),
              },
              {
                key: 'idioma',
                header: 'Idioma',
                width: '110px',
              },
              {
                key: 'resultados',
                header: 'Resultados',
                width: '110px',
                align: 'center',
                render: (row) => (
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {row.resultados}
                  </span>
                ),
              },
              {
                key: 'estado',
                header: 'Estado',
                width: '150px',
                render: (row) => <StatusBadge status={row.estado} size="sm" />,
              },
            ]}
          />

          {/* Estados de Retroalimentación */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
            <Card header={<span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Estado Vacío (EmptyState)</span>}>
              <EmptyState
                titulo="Sin Documentos Seleccionados"
                descripcion="No se han transferido registros desde la Terminal a la Biblioteca para este tema."
                accionTexto="Ir a la Terminal"
                onAccion={() => alert('Navegar a Terminal')}
              />
            </Card>

            <Card header={<span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Estado de Carga (Loading)</span>}>
              <Loading
                mensaje="Cargando entorno de experimentación R..."
                submensaje="Sincronizando datasets y librerías estadísticas"
                size="md"
              />
            </Card>
          </div>

          <ErrorMessage
            titulo="Fallo de Conexión con el Script R"
            mensaje="El intérprete de R informó un error al procesar el archivo tema_3_ejemplo.R."
            detalle="Error in read.csv('dataset_privado.csv'): No such file or directory (status code 500)"
            onReintentar={() => alert('Reintentando ejecución en R...')}
          />
        </section>
      )}

      {/* SECCIÓN 5: VIDA VISUAL (FASE 4.5) */}
      {(activeTab === 'todos' || activeTab === 'vida_visual') && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 className="atlas-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
              5. Vida Visual del Modo Directo (Fase 4.5)
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)' }}>
              Efectos cinéticos sobrios y académicos: fondo topográfico continuo, trazado SVG de caminos, rotación de brújula náutica, conteo numérico con suavizado y elevación al hover.
            </p>
          </div>

          {/* 1. Demostración de useCountUp */}
          <Card
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                  1. Hook useCountUp (Conteo Suave con Ease-Out Cubic)
                </span>
                <StatusBadge status="completado" label="Tokens de Movimiento" size="sm" />
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)', margin: 0 }}>
                Anima progresivamente desde 0 hasta el valor real obtenido por la API. Si el valor es nulo o indefinido, muestra <code>"Sin datos registrados"</code> sin inventar cifras.
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2rem',
                  padding: '1.25rem',
                  backgroundColor: 'var(--color-paper)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Valor animado en pantalla:
                  </div>
                  <div
                    style={{
                      fontSize: '3.5rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-terracotta)',
                      lineHeight: 1,
                      marginTop: '0.25rem',
                    }}
                  >
                    {animatedNumber}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', fontWeight: 600 }}>
                    Probar transiciones con valores reales del proyecto:
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Button
                      variant={interactiveCounter === 360 ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setInteractiveCounter(360)}
                    >
                      360 Ecuaciones
                    </Button>
                    <Button
                      variant={interactiveCounter === 105 ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setInteractiveCounter(105)}
                    >
                      105 Ecuaciones U1
                    </Button>
                    <Button
                      variant={interactiveCounter === 100 ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setInteractiveCounter(100)}
                    >
                      100 Documentos
                    </Button>
                    <Button
                      variant={interactiveCounter === 24 ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setInteractiveCounter(24)}
                    >
                      24 Scripts R
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 2. Banner animado con Rosa de los Vientos y Trazo SVG */}
          <Card
            header={
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                2. Banner Cartográfico: Brújula Náutica SVG (Giro Lento) y Camino de Expedición
              </span>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Banner
                variant="atlas"
                mostrarBrujula
                titulo="Demostración de Brújula y Cartografía SVG"
                subtitulo="La rosa de los vientos rota a 60 segundos por ciclo. El trazo de fondo se anima de forma continua mediante stroke-dashoffset."
                metricaPrincipal={{ valor: '60s', etiqueta: 'Ciclo de Giro' }}
                metricaSecundaria={{ valor: 'Dash', etiqueta: 'Camino Activo' }}
              />
            </div>
          </Card>

          {/* 3. Elevación sutil de tarjetas y accesibilidad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            <Card
              header={
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                  3. Elevación al Hover (.atlas-card:hover)
                </span>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)', margin: 0 }}>
                  Pasa el cursor sobre esta tarjeta. Observa la elevación suave de <code>-2px</code> y la sombra <code>--shadow-atlas-md</code>.
                </p>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <StatusBadge status="actual" label="Hover Activo: translateY(-2px)" />
                </div>
              </div>
            </Card>

            <Card
              header={
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                  4. Respeto a prefers-reduced-motion
                </span>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)', margin: 0 }}>
                  Cumplimiento estricto con WCAG AA: cuando el sistema operativo tiene activada la reducción de movimiento, todas las animaciones se desactivan automáticamente a <code>0.01ms</code>, la deriva del fondo se detiene y las métricas aparecen estáticas y completas.
                </p>
                <div style={{ marginTop: '0.5rem' }}>
                  <StatusBadge status="completado" label="@media (prefers-reduced-motion: reduce)" />
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};
