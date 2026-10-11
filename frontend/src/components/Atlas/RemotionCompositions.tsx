import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

// Paleta oficial Tectonic Telemetry
const COLOR_BG = '#0B0F17';
const COLOR_TERRACOTTA = '#EA580C';
const COLOR_BLUE = '#38BDF8';
const COLOR_EMERALD = '#10B981';
const COLOR_MUTED = '#64748B';
const COLOR_INK = '#F8FAFC';
const COLOR_CARD = '#161F30';

// --------------------------------------------------------------------------
// 1. COMPOSICIÓN REMOTION: CLUSTERING K-MEANS
// --------------------------------------------------------------------------
export const KMeansComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Puntos sintéticos fijos (Iris morfológico simplificado)
  const clusterA = [
    { x: 300, y: 460 }, { x: 330, y: 440 }, { x: 280, y: 490 }, { x: 320, y: 510 },
    { x: 350, y: 470 }, { x: 290, y: 430 }, { x: 340, y: 520 }, { x: 310, y: 480 },
  ];
  const clusterB = [
    { x: 620, y: 260 }, { x: 650, y: 290 }, { x: 590, y: 240 }, { x: 640, y: 230 },
    { x: 670, y: 270 }, { x: 610, y: 310 }, { x: 660, y: 320 }, { x: 630, y: 280 },
  ];
  const clusterC = [
    { x: 880, y: 450 }, { x: 910, y: 480 }, { x: 850, y: 430 }, { x: 920, y: 420 },
    { x: 870, y: 490 }, { x: 940, y: 460 }, { x: 890, y: 410 }, { x: 860, y: 470 },
  ];

  // Fase 1 (0 a 2s): Entrada de puntos
  const pointsOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  // Fase 2 (2s a 5s): Aparición de centroides iniciales
  const centroidScale = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12 },
  });

  // Centroides iniciales vs finales
  const c1Init = { x: 420, y: 350 };
  const c2Init = { x: 550, y: 420 };
  const c3Init = { x: 780, y: 340 };

  const c1Target = { x: 315, y: 472 };
  const c2Target = { x: 633, y: 275 };
  const c3Target = { x: 890, y: 451 };

  // Movimiento de centroides en Fase 4 (7s a 10s)
  const moveProgress = interpolate(frame, [180, 240], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const c1Current = {
    x: interpolate(moveProgress, [0, 1], [c1Init.x, c1Target.x]),
    y: interpolate(moveProgress, [0, 1], [c1Init.y, c1Target.y]),
  };
  const c2Current = {
    x: interpolate(moveProgress, [0, 1], [c2Init.x, c2Target.x]),
    y: interpolate(moveProgress, [0, 1], [c2Init.y, c2Target.y]),
  };
  const c3Current = {
    x: interpolate(moveProgress, [0, 1], [c3Init.x, c3Target.x]),
    y: interpolate(moveProgress, [0, 1], [c3Init.y, c3Target.y]),
  };

  // Color de puntos: de gris neutro a color de clúster a partir de frame 120 (4s)
  const colorProgress = interpolate(frame, [110, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Telemetría de Inercia WCSS
  const wcss = Math.round(interpolate(frame, [0, 60, 140, 240], [248.5, 248.5, 142.1, 78.85], {
    extrapolateRight: 'clamp',
  }) * 100) / 100;

  // Estado textual del algoritmo
  let stepLabel = 'Fase 1: Muestreo de Observaciones en el Espacio de Características';
  if (frame >= 60 && frame < 120) {
    stepLabel = 'Fase 2: Inicialización Estocástica de k=3 Centroides (μ₁, μ₂, μ₃)';
  } else if (frame >= 120 && frame < 180) {
    stepLabel = 'Fase 3: Asignación de Voronoi por Distancia Euclidiana Mínima argmin ||x - μ||²';
  } else if (frame >= 180) {
    stepLabel = 'Fase 4: Recalculo de Medias y Convergencia de Inercia Intra-Cluster WCSS';
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLOR_BG,
        position: 'relative',
        fontFamily: "'Inter', sans-serif",
        color: COLOR_INK,
        overflow: 'hidden',
      }}
    >
      {/* Cuadrícula Cartesiana de Fondo */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
        }}
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#38BDF8" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Cabecera Técnica de la Composición Remotion */}
      <div
        style={{
          position: 'absolute',
          top: 35,
          left: 45,
          right: 45,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 10,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                backgroundColor: COLOR_TERRACOTTA,
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Remotion Engine v4.0
            </span>
            <span style={{ fontSize: 13, color: COLOR_MUTED, fontFamily: 'monospace' }}>
              Algoritmo de Lloyd • k=3 Clústeres
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 4px', color: COLOR_INK }}>
            Partición Espacial y Convergencia de K-Means
          </h1>
          <p style={{ fontSize: 14, color: COLOR_MUTED, margin: 0 }}>
            Visualización reactiva en tiempo real generada programáticamente con React y Canvas
          </p>
        </div>

        {/* HUD de Telemetría Numérica */}
        <div
          style={{
            backgroundColor: COLOR_CARD,
            border: `1px solid ${COLOR_MUTED}44`,
            borderRadius: 8,
            padding: '10px 18px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 11, color: COLOR_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>
            Inercia Intra-Clúster (WCSS)
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              fontFamily: 'monospace',
              color: wcss <= 85 ? COLOR_EMERALD : COLOR_TERRACOTTA,
            }}
          >
            {wcss.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: COLOR_BLUE }}>
            {frame >= 240 ? '✓ Estado Estable Convergido' : '⚡ Minimizando Función de Costo'}
          </div>
        </div>
      </div>

      {/* Puntos y Centroides Animados en el Espacio */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {/* Líneas de Voronoi / Distancia hacia centroides (activas en fase de asignación) */}
        {frame >= 120 && (
          <g opacity={interpolate(frame, [120, 150, 220, 250], [0, 0.45, 0.45, 0.15], { extrapolateRight: 'clamp' })}>
            {clusterA.map((p, i) => (
              <line key={`la-${i}`} x1={p.x} y1={p.y} x2={c1Current.x} y2={c1Current.y} stroke={COLOR_TERRACOTTA} strokeWidth="1" strokeDasharray="3 3" />
            ))}
            {clusterB.map((p, i) => (
              <line key={`lb-${i}`} x1={p.x} y1={p.y} x2={c2Current.x} y2={c2Current.y} stroke={COLOR_BLUE} strokeWidth="1" strokeDasharray="3 3" />
            ))}
            {clusterC.map((p, i) => (
              <line key={`lc-${i}`} x1={p.x} y1={p.y} x2={c3Current.x} y2={c3Current.y} stroke={COLOR_EMERALD} strokeWidth="1" strokeDasharray="3 3" />
            ))}
          </g>
        )}

        {/* Nube de Puntos Clúster A */}
        {clusterA.map((p, i) => {
          const rColor = colorProgress > 0 ? COLOR_TERRACOTTA : COLOR_MUTED;
          return (
            <circle
              key={`a-${i}`}
              cx={p.x}
              cy={p.y}
              r={7}
              fill={rColor}
              opacity={pointsOpacity}
              style={{ transition: 'fill 0.3s' }}
            />
          );
        })}

        {/* Nube de Puntos Clúster B */}
        {clusterB.map((p, i) => {
          const rColor = colorProgress > 0 ? COLOR_BLUE : COLOR_MUTED;
          return (
            <circle
              key={`b-${i}`}
              cx={p.x}
              cy={p.y}
              r={7}
              fill={rColor}
              opacity={pointsOpacity}
              style={{ transition: 'fill 0.3s' }}
            />
          );
        })}

        {/* Nube de Puntos Clúster C */}
        {clusterC.map((p, i) => {
          const rColor = colorProgress > 0 ? COLOR_EMERALD : COLOR_MUTED;
          return (
            <circle
              key={`c-${i}`}
              cx={p.x}
              cy={p.y}
              r={7}
              fill={rColor}
              opacity={pointsOpacity}
              style={{ transition: 'fill 0.3s' }}
            />
          );
        })}

        {/* Centroides con Cruces y Halos Brillantes */}
        {frame >= 60 && (
          <g transform={`scale(${Math.max(0, centroidScale)})`} style={{ transformOrigin: 'center' }}>
            {/* Centroide 1 */}
            <g transform={`translate(${c1Current.x}, ${c1Current.y})`}>
              <circle r={24} fill={COLOR_TERRACOTTA} opacity={0.25} />
              <circle r={14} fill={COLOR_TERRACOTTA} />
              <text textAnchor="middle" dy="5" fill="#fff" fontSize="12" fontWeight="800">
                μ₁
              </text>
            </g>

            {/* Centroide 2 */}
            <g transform={`translate(${c2Current.x}, ${c2Current.y})`}>
              <circle r={24} fill={COLOR_BLUE} opacity={0.25} />
              <circle r={14} fill={COLOR_BLUE} />
              <text textAnchor="middle" dy="5" fill="#fff" fontSize="12" fontWeight="800">
                μ₂
              </text>
            </g>

            {/* Centroide 3 */}
            <g transform={`translate(${c3Current.x}, ${c3Current.y})`}>
              <circle r={24} fill={COLOR_EMERALD} opacity={0.25} />
              <circle r={14} fill={COLOR_EMERALD} />
              <text textAnchor="middle" dy="5" fill="#fff" fontSize="12" fontWeight="800">
                μ₃
              </text>
            </g>
          </g>
        )}
      </svg>

      {/* Barra de Estado y Subtítulo en el Pie de Video */}
      <div
        style={{
          position: 'absolute',
          bottom: 25,
          left: 45,
          right: 45,
          backgroundColor: `${COLOR_CARD}EE`,
          border: `1px solid ${COLOR_MUTED}66`,
          borderRadius: 8,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: frame >= 240 ? COLOR_EMERALD : COLOR_TERRACOTTA,
              boxShadow: `0 0 10px ${frame >= 240 ? COLOR_EMERALD : COLOR_TERRACOTTA}`,
            }}
          />
          <span style={{ fontSize: 14, fontWeight: 700, color: COLOR_INK }}>
            {stepLabel}
          </span>
        </div>

        <div style={{ fontSize: 13, fontFamily: 'monospace', color: COLOR_BLUE }}>
          Frame {frame} / 300 ({(frame / fps).toFixed(1)}s)
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------
// 2. COMPOSICIÓN REMOTION: ÁRBOLES DE DECISIÓN CART
// --------------------------------------------------------------------------
export const DecisionTreeComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Puntos de datos: Clase A (Setosa), Clase B (Versicolor), Clase C (Virginica)
  const setosa = [
    { x: 180, y: 380 }, { x: 210, y: 350 }, { x: 230, y: 400 }, { x: 190, y: 420 }, { x: 240, y: 370 },
  ];
  const versicolor = [
    { x: 380, y: 310 }, { x: 420, y: 340 }, { x: 390, y: 280 }, { x: 440, y: 300 }, { x: 410, y: 360 },
  ];
  const virginica = [
    { x: 480, y: 220 }, { x: 520, y: 250 }, { x: 500, y: 190 }, { x: 540, y: 210 }, { x: 490, y: 260 },
  ];

  // Línea de corte 1 (x1 <= 2.45): aparece en frame 60
  const split1Progress = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Línea de corte 2 (x2 <= 1.75): aparece en frame 140
  const split2Progress = interpolate(frame, [140, 170], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Impureza Gini dinámica
  const gini = Math.max(0.04, Math.round(interpolate(frame, [0, 90, 180], [0.667, 0.320, 0.040], {
    extrapolateRight: 'clamp',
  }) * 1000) / 1000);

  // Nodos del Árbol Jerárquico animándose en la derecha
  const treeScale = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14 },
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLOR_BG,
        position: 'relative',
        fontFamily: "'Inter', sans-serif",
        color: COLOR_INK,
        overflow: 'hidden',
      }}
    >
      {/* Cabecera Técnica */}
      <div
        style={{
          position: 'absolute',
          top: 35,
          left: 45,
          right: 45,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 10,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                backgroundColor: COLOR_BLUE,
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Remotion Tree Engine
            </span>
            <span style={{ fontSize: 13, color: COLOR_MUTED, fontFamily: 'monospace' }}>
              Breiman et al. (1984) • Partición Binaria CART
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 4px', color: COLOR_INK }}>
            Partición Recursiva del Espacio de Características e Impureza Gini
          </h1>
          <p style={{ fontSize: 14, color: COLOR_MUTED, margin: 0 }}>
            Generación de hiperplanos ortogonales y construcción de la jerarquía de decisión
          </p>
        </div>

        {/* HUD Gini */}
        <div
          style={{
            backgroundColor: COLOR_CARD,
            border: `1px solid ${COLOR_MUTED}44`,
            borderRadius: 8,
            padding: '10px 18px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 11, color: COLOR_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>
            Impureza de Gini I_G(t)
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              fontFamily: 'monospace',
              color: gini <= 0.05 ? COLOR_EMERALD : COLOR_TERRACOTTA,
            }}
          >
            {gini.toFixed(3)}
          </div>
          <div style={{ fontSize: 11, color: COLOR_EMERALD }}>
            {frame >= 180 ? '✓ Nodos Hoja Puros (96% Exactitud)' : '⚡ Evaluando Mejor División'}
          </div>
        </div>
      </div>

      {/* Área Dividida: Plano 2D Izquierda (Espacio de Features) vs Árbol Derecha */}
      <div
        style={{
          position: 'absolute',
          top: 130,
          bottom: 85,
          left: 45,
          right: 45,
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: 30,
        }}
      >
        {/* Lado 1: Espacio de Características con Cortes Hiperplanos */}
        <div
          style={{
            backgroundColor: COLOR_CARD,
            border: `1px solid ${COLOR_MUTED}44`,
            borderRadius: 10,
            position: 'relative',
            overflow: 'hidden',
            padding: 20,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR_MUTED, marginBottom: 10 }}>
            Plano Bidimensional: Longitud de Pétalo (X₁) vs Ancho de Pétalo (X₂)
          </div>

          <svg width="100%" height="85%">
            {/* Ejes */}
            <line x1="120" y1="460" x2="580" y2="460" stroke={COLOR_MUTED} strokeWidth="1.5" />
            <line x1="120" y1="160" x2="120" y2="460" stroke={COLOR_MUTED} strokeWidth="1.5" />
            <text x="560" y="480" fill={COLOR_MUTED} fontSize="11" fontFamily="monospace">X₁</text>
            <text x="100" y="170" fill={COLOR_MUTED} fontSize="11" fontFamily="monospace">X₂</text>

            {/* Región Pura Setosa (después de corte 1) */}
            {split1Progress > 0 && (
              <rect x="120" y="160" width={170 * split1Progress} height="300" fill={COLOR_EMERALD} opacity={0.12} />
            )}

            {/* Corte 1: Línea Vertical X1 <= 2.45 */}
            {split1Progress > 0 && (
              <g>
                <line x1="290" y1="160" x2="290" y2="460" stroke={COLOR_EMERALD} strokeWidth="2.5" strokeDasharray="4 4" />
                <text x="295" y="180" fill={COLOR_EMERALD} fontSize="11" fontWeight="700">
                  Corte 1: X₁ ≤ 2.45
                </text>
              </g>
            )}

            {/* Corte 2: Línea Horizontal X2 <= 1.75 en región derecha */}
            {split2Progress > 0 && (
              <g>
                <line x1="290" y1="275" x2="580" y2="275" stroke={COLOR_BLUE} strokeWidth="2.5" strokeDasharray="4 4" />
                <text x="305" y="265" fill={COLOR_BLUE} fontSize="11" fontWeight="700">
                  Corte 2: X₂ ≤ 1.75
                </text>
              </g>
            )}

            {/* Puntos de datos */}
            {setosa.map((p, i) => (
              <circle key={`s-${i}`} cx={p.x} cy={p.y} r={7} fill={COLOR_EMERALD} />
            ))}
            {versicolor.map((p, i) => (
              <circle key={`vc-${i}`} cx={p.x} cy={p.y} r={7} fill={COLOR_BLUE} />
            ))}
            {virginica.map((p, i) => (
              <circle key={`vg-${i}`} cx={p.x} cy={p.y} r={7} fill={COLOR_TERRACOTTA} />
            ))}
          </svg>
        </div>

        {/* Lado 2: Grafo Jerárquico del Árbol de Decisión */}
        <div
          style={{
            backgroundColor: COLOR_CARD,
            border: `1px solid ${COLOR_MUTED}44`,
            borderRadius: 10,
            position: 'relative',
            overflow: 'hidden',
            padding: 20,
            transform: `scale(${Math.max(0, treeScale)})`,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR_MUTED, marginBottom: 15 }}>
            Jerarquía Inducida del Árbol CART
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            {/* Nodo Raíz */}
            <div
              style={{
                backgroundColor: '#1E293B',
                border: `1.5px solid ${COLOR_INK}`,
                borderRadius: 8,
                padding: '8px 16px',
                textAlign: 'center',
                minWidth: 180,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: COLOR_INK }}>¿Longitud Pétalo ≤ 2.45?</div>
              <div style={{ fontSize: 10, color: COLOR_MUTED }}>Gini = {gini.toFixed(3)} | Muestras = 150</div>
            </div>

            {/* Ramas y Nodos Hijos */}
            {split1Progress > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 15 }}>
                {/* Hoja Izquierda: Setosa Pura */}
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: `1.5px solid ${COLOR_EMERALD}`,
                    borderRadius: 8,
                    padding: '8px 12px',
                    textAlign: 'center',
                    flex: 1,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, color: COLOR_EMERALD }}>✓ Clase Setosa</div>
                  <div style={{ fontSize: 10, color: COLOR_MUTED }}>Puro (Gini = 0.000)</div>
                </div>

                {/* Nodo Derecho: Requiere Corte 2 */}
                <div
                  style={{
                    backgroundColor: '#1E293B',
                    border: `1.5px solid ${split2Progress > 0 ? COLOR_BLUE : COLOR_MUTED}`,
                    borderRadius: 8,
                    padding: '8px 12px',
                    textAlign: 'center',
                    flex: 1.2,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: COLOR_INK }}>
                    {split2Progress > 0 ? '¿Ancho Pétalo ≤ 1.75?' : 'Subconjunto Versi/Virg'}
                  </div>
                  <div style={{ fontSize: 10, color: COLOR_MUTED }}>
                    {split2Progress > 0 ? 'Versicolor (96%) / Virginica (94%)' : 'Gini = 0.320'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pie de Composición */}
      <div
        style={{
          position: 'absolute',
          bottom: 25,
          left: 45,
          right: 45,
          backgroundColor: `${COLOR_CARD}EE`,
          border: `1px solid ${COLOR_MUTED}66`,
          borderRadius: 8,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: COLOR_INK }}>
          {frame < 60
            ? 'Paso 1: Medición de Impureza Inicial en Raíz'
            : frame < 140
            ? 'Paso 2: Generación del Primer Hiperplano Separador (Setosa)'
            : 'Paso 3: Partición Recursiva del Subconjunto No Puro (Convergencia CART)'}
        </span>
        <div style={{ fontSize: 13, fontFamily: 'monospace', color: COLOR_BLUE }}>
          Frame {frame} / 300 ({(frame / fps).toFixed(1)}s)
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------
// 3. COMPOSICIÓN REMOTION: REDES NEURONALES (FEEDFORWARD & BACKPROP)
// --------------------------------------------------------------------------
export const NeuralNetComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulso de activación Feedforward
  const pulseX = interpolate(frame, [0, 140], [280, 1000], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Onda de retropropagación
  const backpropPulse = interpolate(frame, [160, 280], [1000, 280], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pérdida Cross-Entropy decreciente
  const loss = Math.max(0.04, Math.round(interpolate(frame, [0, 120, 280], [0.892, 0.412, 0.040], {
    extrapolateRight: 'clamp',
  }) * 1000) / 1000);

  const inputs = [{ y: 220 }, { y: 310 }, { y: 400 }, { y: 490 }];
  const hiddens = [{ y: 200 }, { y: 275 }, { y: 350 }, { y: 425 }, { y: 500 }];
  const outputs = [{ y: 280 }, { y: 360 }, { y: 440 }];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLOR_BG,
        position: 'relative',
        fontFamily: "'Inter', sans-serif",
        color: COLOR_INK,
        overflow: 'hidden',
      }}
    >
      {/* Cabecera Técnica */}
      <div
        style={{
          position: 'absolute',
          top: 35,
          left: 45,
          right: 45,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 10,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                backgroundColor: '#9333EA',
                color: '#fff',
                fontSize: 12,
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Remotion Deep Neural Engine
            </span>
            <span style={{ fontSize: 13, color: COLOR_MUTED, fontFamily: 'monospace' }}>
              MLP Feedforward • Backpropagation Gradient Descent
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0 4px', color: COLOR_INK }}>
            Propagación Sináptica y Optimización de Pesos por Retropropagación
          </h1>
          <p style={{ fontSize: 14, color: COLOR_MUTED, margin: 0 }}>
            Transmisión de pulsos no lineales a través de la matriz de pesos sinápticos W y minimización de entropía cruzada
          </p>
        </div>

        {/* HUD Loss */}
        <div
          style={{
            backgroundColor: COLOR_CARD,
            border: `1px solid ${COLOR_MUTED}44`,
            borderRadius: 8,
            padding: '10px 18px',
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 11, color: COLOR_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>
            Función de Pérdida ℒ(W, b)
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              fontFamily: 'monospace',
              color: loss <= 0.08 ? COLOR_EMERALD : '#F43F5E',
            }}
          >
            {loss.toFixed(3)}
          </div>
          <div style={{ fontSize: 11, color: '#C084FC' }}>
            {frame >= 200 ? '✓ Gradiente Minimizador Óptimo' : '⚡ Propagando Tensor de Activación'}
          </div>
        </div>
      </div>

      {/* Red Neuronal Completa Dibujada en SVG */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        {/* Sinapsis: Entrada -> Oculta */}
        {inputs.map((inp, i) =>
          hiddens.map((hid, j) => (
            <line
              key={`w1-${i}-${j}`}
              x1="280"
              y1={inp.y}
              x2="640"
              y2={hid.y}
              stroke="#38BDF8"
              strokeWidth="1.2"
              opacity={0.25}
            />
          ))
        )}

        {/* Sinapsis: Oculta -> Salida */}
        {hiddens.map((hid, j) =>
          outputs.map((out, k) => (
            <line
              key={`w2-${j}-${k}`}
              x1="640"
              y1={hid.y}
              x2="1000"
              y2={out.y}
              stroke="#C084FC"
              strokeWidth="1.5"
              opacity={0.3}
            />
          ))
        )}

        {/* Haz de Luz Feedforward */}
        {frame < 150 && (
          <circle cx={pulseX} cy={350} r={40} fill="#38BDF8" opacity={0.15} filter="blur(10px)" />
        )}

        {/* Haz de Luz Backpropagation (Retropropagación de Error) */}
        {frame >= 160 && (
          <circle cx={backpropPulse} cy={350} r={45} fill="#F43F5E" opacity={0.25} filter="blur(12px)" />
        )}

        {/* Capa de Entrada (4 neuronas) */}
        {inputs.map((inp, i) => (
          <g key={`in-${i}`} transform={`translate(280, ${inp.y})`}>
            <circle r={20} fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" />
            <text textAnchor="middle" dy="5" fill="#fff" fontSize="12" fontWeight="700">
              x{i + 1}
            </text>
          </g>
        ))}

        {/* Capa Oculta (5 neuronas ReLU) */}
        {hiddens.map((hid, j) => (
          <g key={`hd-${j}`} transform={`translate(640, ${hid.y})`}>
            <circle r={24} fill="#1E293B" stroke="#9333EA" strokeWidth="2.5" />
            <text textAnchor="middle" dy="5" fill="#fff" fontSize="12" fontWeight="700">
              h{j + 1}
            </text>
          </g>
        ))}

        {/* Capa de Salida (3 neuronas Softmax) */}
        {outputs.map((out, k) => (
          <g key={`out-${k}`} transform={`translate(1000, ${out.y})`}>
            <circle r={22} fill="#1E293B" stroke="#10B981" strokeWidth="2.5" />
            <text textAnchor="middle" dy="5" fill="#fff" fontSize="12" fontWeight="700">
              y{k + 1}
            </text>
          </g>
        ))}
      </svg>

      {/* Pie de Composición */}
      <div
        style={{
          position: 'absolute',
          bottom: 25,
          left: 45,
          right: 45,
          backgroundColor: `${COLOR_CARD}EE`,
          border: `1px solid ${COLOR_MUTED}66`,
          borderRadius: 8,
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: COLOR_INK }}>
          {frame < 140
            ? 'Paso 1: Transmisión Feedforward a través de Capas Densas W[l]'
            : frame < 180
            ? 'Paso 2: Evaluación de Pérdida en la Capa de Salida Softmax'
            : 'Paso 3: Retropropagación de Gradientes ∇ℒ y Ajuste Estocástico de Pesos W'}
        </span>
        <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#C084FC' }}>
          Frame {frame} / 300 ({(frame / fps).toFixed(1)}s)
        </div>
      </div>
    </div>
  );
};
