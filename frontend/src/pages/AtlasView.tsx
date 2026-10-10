import React, { useState } from 'react';
import { Card, Button, StatusBadge } from '../components/ui';
import {
  Film,
  Play,
  Sparkles,
  Download,
  Info,
} from 'lucide-react';

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
      'Demuestra la transmisión del pulso de activación desde la capa de entrada (4 variables) a través de la matriz de pesos sinápticos W hacia la capa oculta y la salida sigmoide.',
    formula: 'y_k = \\sigma\\left(\\sum_{j} w_{kj} \\cdot h_j + b_k\\right)',
  },
];

export const AtlasView: React.FC = () => {
  const [selectedClip, setSelectedClip] = useState<VideoClip>(CLIPS[0]);

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
              <Sparkles size={13} /> Animaciones Matemáticas en Video
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>•</span>
            <span style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', fontFamily: 'var(--font-mono)' }}>
              Animación Vectorial v0.22 (720p 30fps)
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
            Atlas de Técnicas Matemáticas (Clips Animados)
          </h1>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-ink-secondary)',
              margin: 0,
              maxWidth: '820px',
            }}
          >
            Laboratorio audiovisual de divulgación científica con animaciones programáticas de alta precisión
            renderizadas en Python con gráficos cinemáticos y alineadas con los scripts ejecutables en R.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <StatusBadge status="completado" label="3 Clips Renderizados" />
          <StatusBadge status="completado" label="Python 3.14 + Vectorial" />
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
        {/* Lado Izquierdo: Reproductor de Video Activo */}
        <Card
          padding="lg"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
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
              key={selectedClip.videoSrc}
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
              src={selectedClip.videoSrc}
            >
              Tu navegador no soporta la reproducción de video MP4.
            </video>
          </div>

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

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <a
                  href={selectedClip.videoSrc}
                  download
                  style={{ textDecoration: 'none' }}
                >
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

        {/* Lado Derecho: Lista de Clips Disponibles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Film size={16} style={{ color: 'var(--color-terracotta)' }} /> Galería de Clips Animados (3)
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
                      <Play size={11} fill="currentColor" /> Reproduciendo
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
                <strong style={{ color: 'var(--color-ink)' }}>Rigor Científico:</strong> Cada animación fue programada
                en Python mediante gráficos vectoriales computacionales y renderizada a 720p 30fps. Los scripts fuente se encuentran
                en el repositorio para total reproducibilidad.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
