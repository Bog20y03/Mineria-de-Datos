import React, { useState } from 'react';
import { Player } from '@remotion/player';
import { Card, Button, StatusBadge } from '../components/ui';
import {
  Film,
  Play,
  Sparkles,
  Download,
  Info,
  Code2,
  Tv,
  FileCode,
} from 'lucide-react';
import {
  KMeansComposition,
  DecisionTreeComposition,
  NeuralNetComposition,
} from '../components/Atlas/RemotionCompositions';
import { ReadAloudNarrator } from '../components/Atlas/ReadAloudNarrator';

interface VideoClip {
  id: string;
  title: string;
  technique: string;
  videoSrc: string;
  unit: string;
  topicId: string;
  author: string;
  dataset: string;
  metricLabel: string;
  metricValue: string;
  summary: string;
  formula: string;
  remotionComponent: React.ComponentType;
  manimCode: string;
}

const CLIPS: VideoClip[] = [
  {
    id: 'kmeans',
    title: 'Clustering K-Means: Partición Espacial y Convergencia',
    technique: 'Agrupamiento No Supervisado (Algoritmo de Lloyd / MacQueen)',
    videoSrc: '/videos/kmeans_animation.mp4',
    unit: 'Unidad 1',
    topicId: '01_MINERIA_DE_DATOS',
    author: 'J. MacQueen (1967) / S. Lloyd (1982)',
    dataset: 'Iris Dataset (150 muestras, 4 variables continuas)',
    metricLabel: 'Inercia Intra-Cluster (WCSS)',
    metricValue: '78.85 (88.4% Varianza Explicada)',
    summary:
      'La animación ilustra la inicialización estocástica de centroides k=3, la asignación de puntos mediante distancia euclidiana mínima y el recalculo iterativo de las medias hasta alcanzar la convergencia de inercia.',
    formula: 'J = \\sum_{k=1}^K \\sum_{x_i \\in C_k} ||x_i - \\mu_k||^2',
    remotionComponent: KMeansComposition,
    manimCode: `from manim import *
import numpy as np

class KMeansAnimation(Scene):
    def construct(self):
        # 1. Puntos y Centroides
        dots = VGroup(*[Dot(p) for p in cluster_points])
        m1 = Cross(color=RED).move_to([-1.5, 1.8, 0])
        m2 = Cross(color=BLUE).move_to([2.5, -0.5, 0])
        m3 = Cross(color=GREEN).move_to([-1.0, -2.0, 0])
        self.play(Create(dots), FadeIn(m1, m2, m3))
        # 2. Recálculo y Convergencia Lloyd
        self.play(m1.animate.move_to(target_c1), run_time=2)`,
  },
  {
    id: 'tree',
    title: 'Árboles de Decisión CART: Partición Binaria Recursiva',
    technique: 'Clasificación Supervisada (Classification and Regression Trees)',
    videoSrc: '/videos/tree_animation.mp4',
    unit: 'Unidad 2',
    topicId: '03_ARBOL_CLASIFICACION',
    author: 'L. Breiman, J. Friedman, R. Olshen (1984)',
    dataset: 'Iris Dataset / Paquete rpart en R nativo',
    metricLabel: 'Exactitud y Pureza',
    metricValue: 'Exactitud: 96.0% | Impureza Gini: 0.04',
    summary:
      'Muestra la división óptima del espacio de características minimizando el índice de impureza de Gini en cada nodo de decisión, generando hiperrectángulos puros y aplicando poda.',
    formula: 'I_G(t) = 1 - \\sum_{i=1}^C p(i|t)^2',
    remotionComponent: DecisionTreeComposition,
    manimCode: `from manim import *

class CARTTreeAnimation(Scene):
    def construct(self):
        # Espacio de Características X1 vs X2
        split1 = DashedLine(start=[0, -3, 0], end=[0, 3, 0], color=GREEN)
        split2 = DashedLine(start=[0, 0.5, 0], end=[3.5, 0.5, 0], color=BLUE)
        self.play(Create(split1), run_time=1.5)
        self.play(Create(split2), run_time=1.5)`,
  },
  {
    id: 'neural',
    title: 'Redes Neuronales: Perceptrón Multicapa y Feedforward',
    technique: 'Aproximador Universal No Lineal (Backpropagation MLP)',
    videoSrc: '/videos/neural_animation.mp4',
    unit: 'Unidad 2',
    topicId: '04_REDES_NEURONALES',
    author: 'D. Rumelhart, G. Hinton, R. Williams (1986)',
    dataset: 'Pima Indians Diabetes / Paquete nnet en R',
    metricLabel: 'Función de Pérdida',
    metricValue: 'Entropía Cruzada: 0.04 (Convergido)',
    summary:
      'Demuestra la transmisión del pulso de activación desde la capa de entrada a través de la matriz de pesos sinápticos W hacia la capa oculta y la retropropagación de gradientes de error.',
    formula: 'y_k = \\sigma\\left(\\sum_{j} w_{kj} \\cdot h_j + b_k\\right)',
    remotionComponent: NeuralNetComposition,
    manimCode: `from manim import *

class NeuralNetAnimation(Scene):
    def construct(self):
        # Capa entrada, oculta y salida
        inputs = VGroup(*[Circle(radius=0.2) for _ in range(4)]).arrange(DOWN)
        hiddens = VGroup(*[Circle(radius=0.2) for _ in range(5)]).arrange(DOWN)
        outputs = VGroup(*[Circle(radius=0.2) for _ in range(3)]).arrange(DOWN)
        self.play(Create(inputs), Create(hiddens), Create(outputs))`,
  },
];

export const AtlasView: React.FC = () => {
  const [selectedClip, setSelectedClip] = useState<VideoClip>(CLIPS[0]);
  type ViewMode = 'remotion' | 'video' | 'code';
  const [viewMode, setViewMode] = useState<ViewMode>('remotion');

  const ActiveComposition = selectedClip.remotionComponent;

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
      {/* 1. Cabecera del Atlas */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem 2rem',
          boxShadow: 'var(--shadow-atlas-sm)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--color-terracotta)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Sparkles size={13} /> Remotion Player & Manim Engine
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>•</span>
            <span style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', fontFamily: 'var(--font-mono)' }}>
              Animaciones Programáticas en Código + Read Aloud (Voz en Off)
            </span>
          </div>
          <h1
            className="atlas-title"
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 800,
              color: 'var(--color-ink)',
              margin: '0.35rem 0 0.25rem',
              letterSpacing: '-0.02em',
            }}
          >
            Atlas Matemático: Animaciones en Remotion y Manim
          </h1>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-ink-secondary)',
              margin: 0,
              maxWidth: '850px',
            }}
          >
            Laboratorio audiovisual con renderizado programático por código: reproductor interactivo en <strong>Remotion Player</strong> (React/TypeScript),
            animaciones matemáticas en <strong>Manim</strong> (Python 3.14) y narrador científico integrado con <strong>Read Aloud (TTS)</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <StatusBadge status="completado" label="@remotion/player 4.0" />
          <StatusBadge status="completado" label="Manim Python" />
          <StatusBadge status="completado" label="Read Aloud TTS" />
        </div>
      </div>

      {/* 2. Área Principal: Reproductor y Selector de Clips */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 360px',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Lado Izquierdo: Reproductor de Remotion / Video / Código */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Card
            padding="lg"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            {/* Selector de Modo de Visualización (Remotion vs Video vs Código) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('remotion')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontSize: 'var(--text-xs)',
                    fontWeight: viewMode === 'remotion' ? 700 : 500,
                    backgroundColor: viewMode === 'remotion' ? 'var(--color-terracotta)' : 'var(--color-card-muted)',
                    color: viewMode === 'remotion' ? '#FFFFFF' : 'var(--color-ink-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Tv size={14} />
                  <span>Remotion Player (Interactivo en Vivo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('video')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontSize: 'var(--text-xs)',
                    fontWeight: viewMode === 'video' ? 700 : 500,
                    backgroundColor: viewMode === 'video' ? 'var(--color-blue-ink)' : 'var(--color-card-muted)',
                    color: viewMode === 'video' ? '#FFFFFF' : 'var(--color-ink-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Film size={14} />
                  <span>Video Manim MP4</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('code')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontSize: 'var(--text-xs)',
                    fontWeight: viewMode === 'code' ? 700 : 500,
                    backgroundColor: viewMode === 'code' ? 'var(--color-blue-ink)' : 'var(--color-card-muted)',
                    color: viewMode === 'code' ? '#FFFFFF' : 'var(--color-ink-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Code2 size={14} />
                  <span>Código Fuente Python / React</span>
                </button>
              </div>

              <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)', fontFamily: 'monospace' }}>
                1280x720 • 30 FPS • 10s
              </span>
            </div>

            {/* CONTENEDOR DEL REPRODUCTOR */}
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#0B0F17',
                border: '1.5px solid var(--color-border)',
                boxShadow: 'var(--shadow-atlas-md)',
                aspectRatio: '16/9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* VISTA 1: REMOTION PLAYER INTERACTIVO */}
              {viewMode === 'remotion' && (
                <Player
                  key={`remotion-${selectedClip.id}`}
                  component={ActiveComposition}
                  durationInFrames={300}
                  compositionWidth={1280}
                  compositionHeight={720}
                  fps={30}
                  controls
                  loop
                  autoPlay
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}

              {/* VISTA 2: VIDEO MP4 */}
              {viewMode === 'video' && (
                <video
                  key={selectedClip.videoSrc}
                  controls
                  autoPlay
                  loop
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                  src={selectedClip.videoSrc}
                >
                  Tu navegador no soporta la reproducción de video MP4.
                </video>
              )}

              {/* VISTA 3: CÓDIGO FUENTE DE MANIM */}
              {viewMode === 'code' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '1.5rem',
                    overflowY: 'auto',
                    backgroundColor: '#020617',
                    color: '#f8fafc',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    lineHeight: 1.6,
                  }}
                >
                  <div style={{ color: '#38bdf8', marginBottom: '0.75rem', fontWeight: 700 }}>
                    # Script de Animación Matemática en Python (Manim v0.22)
                  </div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {selectedClip.manimCode}
                  </pre>
                </div>
              )}
            </div>

            {/* Metadatos y Detalles de la Técnica */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      color: 'var(--color-terracotta)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {selectedClip.unit} • {selectedClip.technique}
                  </span>
                  <h2
                    style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: 800,
                      color: 'var(--color-ink)',
                      margin: '0.2rem 0',
                    }}
                  >
                    {selectedClip.title}
                  </h2>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                    Fundamentación: <strong style={{ color: 'var(--color-ink)' }}>{selectedClip.author}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <a href={selectedClip.videoSrc} download style={{ textDecoration: 'none' }}>
                    <Button variant="outline" size="sm" icon={<Download size={14} />}>
                      Descargar MP4
                    </Button>
                  </a>
                </div>
              </div>

              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-ink-secondary)',
                  lineHeight: 1.6,
                  marginTop: '1rem',
                }}
              >
                {selectedClip.summary}
              </p>

              {/* Ficha de Métricas */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  marginTop: '1.25rem',
                  padding: '1rem',
                  backgroundColor: 'var(--color-card-muted)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Dataset Consumido
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-ink)', marginTop: '0.25rem' }}>
                    {selectedClip.dataset}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {selectedClip.metricLabel}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-terracotta)', marginTop: '0.25rem' }}>
                    {selectedClip.metricValue}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* MÓDULO READ ALOUD (VOZ EN OFF DE EXPLICACIÓN CIENTÍFICA) */}
          <ReadAloudNarrator clipId={selectedClip.id} />
        </div>

        {/* Lado Derecho: Lista de Clips Disponibles y Documentación */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Film size={16} style={{ color: 'var(--color-terracotta)' }} /> Galería de Clips Algorítmicos ({CLIPS.length})
          </div>

          {CLIPS.map((clip) => {
            const isSelected = selectedClip.id === clip.id;
            return (
              <div
                key={clip.id}
                onClick={() => setSelectedClip(clip)}
                className="atlas-card"
                style={{
                  padding: '1rem 1.15rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--color-card)' : 'var(--color-card-muted)',
                  border: `1.5px solid ${isSelected ? 'var(--color-terracotta)' : 'var(--color-border)'}`,
                  boxShadow: isSelected ? 'var(--shadow-atlas-md)' : 'var(--shadow-atlas-xs)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: isSelected ? 'var(--color-terracotta)' : 'var(--color-ink-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {clip.unit}
                  </span>
                  {isSelected && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: 'var(--color-terracotta)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <Play size={11} fill="currentColor" /> Activo
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 700,
                    color: 'var(--color-ink)',
                    lineHeight: 1.35,
                  }}
                >
                  {clip.title}
                </div>

                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-ink-secondary)',
                    lineHeight: 1.4,
                  }}
                >
                  {clip.technique}
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-blue-ink)',
                    fontWeight: 600,
                    marginTop: '0.25rem',
                  }}
                >
                  {clip.metricValue}
                </div>
              </div>
            );
          })}

          <Card padding="md" style={{ backgroundColor: 'var(--color-card-muted)' }}>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <Info size={18} style={{ color: 'var(--color-blue-ink)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--color-ink)' }}>Remotion + Manim + Read Aloud:</strong> Este módulo une
                el renderizado dinámico de <strong>Remotion Player</strong> (React/TS), el rigor matemático de <strong>Manim</strong> (Python)
                y la síntesis de voz en español de <strong>Read Aloud (TTS)</strong> para sustentar la ejecución algorítmica con total claridad didáctica.
              </div>
            </div>
          </Card>

          <Card padding="md" style={{ backgroundColor: 'var(--color-card-muted)' }}>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <FileCode size={18} style={{ color: 'var(--color-terracotta)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--color-ink)' }}>Scripts de Python en Disco:</strong> Encuentra los archivos completos
                de Manim en la carpeta <code>video_manim/</code> del repositorio: <code>kmeans_scene.py</code>, <code>cart_tree_scene.py</code> y <code>neural_net_scene.py</code>.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
