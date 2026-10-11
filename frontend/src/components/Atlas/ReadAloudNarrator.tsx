import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, MessageSquare } from 'lucide-react';

export interface NarrationScript {
  id: string;
  title: string;
  algorithm: string;
  sentences: { text: string; timestampSec: number }[];
  fullText: string;
}

export const NARRATION_SCRIPTS: Record<string, NarrationScript> = {
  kmeans: {
    id: 'kmeans',
    title: 'Clustering K-Means',
    algorithm: 'Algoritmo de Lloyd (1982)',
    sentences: [
      { text: 'Iniciando demostración del algoritmo de agrupamiento K-Means.', timestampSec: 0 },
      { text: 'En la primera fase, proyectamos la nube de observaciones morfológicas del conjunto de datos en el plano bidimensional.', timestampSec: 2 },
      { text: 'A continuación, se inicializan estocásticamente tres centroides identificados como mu 1, mu 2 y mu 3.', timestampSec: 4 },
      { text: 'En la fase de asignación de Voronoi, el algoritmo calcula la distancia euclidiana entre cada punto y los centroides, asignando cada muestra a su centroide más próximo.', timestampSec: 6 },
      { text: 'Posteriormente, se recalculan las medias aritméticas y los centroides se desplazan hacia el centro de masa de cada grupo.', timestampSec: 8 },
      { text: 'La inercia intra-clúster desciende hasta alcanzar la convergencia de estado estable con 88 por ciento de varianza explicada.', timestampSec: 10 },
    ],
    fullText:
      'Iniciando demostración del algoritmo de agrupamiento K-Means. En la primera fase, proyectamos la nube de observaciones morfológicas del conjunto de datos en el plano bidimensional. A continuación, se inicializan estocásticamente tres centroides identificados como mu 1, mu 2 y mu 3. En la fase de asignación de Voronoi, el algoritmo calcula la distancia euclidiana entre cada punto y los centroides, asignando cada muestra a su centroide más próximo. Posteriormente, se recalculan las medias aritméticas y los centroides se desplazan hacia el centro de masa de cada grupo. La inercia intra-clúster desciende hasta alcanzar la convergencia de estado estable con 88 por ciento de varianza explicada.',
  },
  tree: {
    id: 'tree',
    title: 'Árboles de Decisión CART',
    algorithm: 'Breiman, Friedman, Olshen (1984)',
    sentences: [
      { text: 'Visualización del algoritmo CART de clasificación supervisada por partición binaria recursiva.', timestampSec: 0 },
      { text: 'Partimos del espacio completo de características con una impureza de Gini inicial de cero punto seiscientos sesenta y siete.', timestampSec: 2 },
      { text: 'El algoritmo evalúa exhaustivamente todos los umbrales continuos y selecciona la regla óptima: longitud de pétalo menor o igual a dos punto cuarenta y cinco.', timestampSec: 5 },
      { text: 'Esta primera división aísla de manera completamente pura la clase Setosa con un Gini de cero absoluto.', timestampSec: 7 },
      { text: 'Seguidamente, el subconjunto restante se particiona mediante ancho de pétalo menor a uno punto setenta y cinco, separando Versicolor y Virginica con noventa y seis por ciento de exactitud.', timestampSec: 9 },
    ],
    fullText:
      'Visualización del algoritmo CART de clasificación supervisada por partición binaria recursiva. Partimos del espacio completo de características con una impureza de Gini inicial de cero punto seiscientos sesenta y siete. El algoritmo evalúa exhaustivamente todos los umbrales continuos y selecciona la regla óptima: longitud de pétalo menor o igual a dos punto cuarenta y cinco. Esta primera división aísla de manera completamente pura la clase Setosa con un Gini de cero absoluto. Seguidamente, el subconjunto restante se particiona mediante ancho de pétalo menor a uno punto setenta y cinco, separando Versicolor y Virginica con noventa y seis por ciento de exactitud.',
  },
  neural: {
    id: 'neural',
    title: 'Redes Neuronales MLP',
    algorithm: 'Rumelhart, Hinton, Williams (1986)',
    sentences: [
      { text: 'Demostración de Red Neuronal Perceptrón Multicapa con propagación hacia adelante y retropropagación.', timestampSec: 0 },
      { text: 'Cuatro variables de entrada alimentan la red y transmiten pulsos de activación a través de la matriz sináptica ponderada W.', timestampSec: 3 },
      { text: 'Cada neurona oculta integra las señales ponderadas con su sesgo y evalúa la función de activación no lineal ReLU.', timestampSec: 6 },
      { text: 'En la capa de salida, la función Softmax calcula la probabilidad de pertenencia a cada clase.', timestampSec: 8 },
      { text: 'Finalmente, la onda de retropropagación evalúa el gradiente de la función de pérdida y actualiza los pesos sinápticos mediante descenso de gradiente estocástico.', timestampSec: 10 },
    ],
    fullText:
      'Demostración de Red Neuronal Perceptrón Multicapa con propagación hacia adelante y retropropagación. Cuatro variables de entrada alimentan la red y transmiten pulsos de activación a través de la matriz sináptica ponderada W. Cada neurona oculta integra las señales ponderadas con su sesgo y evalúa la función de activación no lineal ReLU. En la capa de salida, la función Softmax calcula la probabilidad de pertenencia a cada clase. Finalmente, la onda de retropropagación evalúa el gradiente de la función de pérdida y actualiza los pesos sinápticos mediante descenso de gradiente estocástico.',
  },
};

interface ReadAloudNarratorProps {
  clipId: string;
  onNarrationStart?: () => void;
  onNarrationEnd?: () => void;
}

export const ReadAloudNarrator: React.FC<ReadAloudNarratorProps> = ({
  clipId,
  onNarrationStart,
  onNarrationEnd,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState<number>(1.0);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const script = NARRATION_SCRIPTS[clipId] || NARRATION_SCRIPTS.kmeans;

  // Cargar voces del navegador compatibles con español
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const spanishVoices = allVoices.filter((v) => v.lang.startsWith('es'));
      const list = spanishVoices.length > 0 ? spanishVoices : allVoices;
      setVoices(list);
      if (list.length > 0 && !selectedVoice) {
        setSelectedVoice(list[0]);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Detener voz al cambiar de clip
  useEffect(() => {
    stopNarration();
    setCurrentSentenceIdx(0);
  }, [clipId]);

  const startNarration = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Tu navegador no soporta la API de SpeechSynthesis.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(script.fullText);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    utterance.pitch = 1.0;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentSentenceIdx(0);
      onNarrationStart?.();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      onNarrationEnd?.();
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    // Resaltar oraciones de forma dinámica
    utterance.onboundary = (event) => {
      if (event.name === 'sentence' || event.name === 'word') {
        const charIdx = event.charIndex;
        let cumulative = 0;
        for (let i = 0; i < script.sentences.length; i++) {
          cumulative += script.sentences[i].text.length;
          if (charIdx <= cumulative) {
            setCurrentSentenceIdx(i);
            break;
          }
        }
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pauseNarration = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  const stopNarration = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIdx(0);
      onNarrationEnd?.();
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: 'var(--shadow-atlas-xs)',
      }}
    >
      {/* Barra de Controles de Voz */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isPlaying ? 'rgba(234, 88, 12, 0.15)' : 'var(--color-card-muted)',
              color: isPlaying ? 'var(--color-terracotta)' : 'var(--color-ink-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-ink)' }}>
                Read Aloud (Voz en Off de Explicación Científica)
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--color-blue-ink)',
                  padding: '2px 7px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                }}
              >
                TTS Nativo
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
              Narración auditiva del pipeline matemático sincronizada con el reproductor Remotion
            </div>
          </div>
        </div>

        {/* Botonera de Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {!isPlaying ? (
            <button
              type="button"
              onClick={startNarration}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                padding: '0.45rem 1rem',
                backgroundColor: 'var(--color-terracotta)',
                borderColor: 'var(--color-terracotta)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              <Play size={13} fill="currentColor" />
              <span>Escuchar Narración (Read Aloud)</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={pauseNarration}
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                }}
              >
                {isPaused ? <Play size={12} /> : <Pause size={12} />}
                <span>{isPaused ? 'Reanudar' : 'Pausar'}</span>
              </button>

              <button
                type="button"
                onClick={stopNarration}
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: '#ef4444',
                }}
              >
                <Square size={12} fill="currentColor" />
                <span>Detener</span>
              </button>
            </>
          )}

          {/* Selector de Voz */}
          {voices.length > 1 && (
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const v = voices.find((item) => item.name === e.target.value);
                if (v) setSelectedVoice(v);
              }}
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                borderRadius: 4,
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card-muted)',
                color: 'var(--color-ink)',
                cursor: 'pointer',
                maxWidth: '125px',
              }}
              title="Seleccionar voz del sistema"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name.slice(0, 16)}
                </option>
              ))}
            </select>
          )}

          {/* Selector de Velocidad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.25rem' }}>
            {[0.8, 1.0, 1.2].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setRate(spd)}
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  padding: '3px 7px',
                  borderRadius: 4,
                  border: '1px solid var(--color-border)',
                  backgroundColor: rate === spd ? 'var(--color-blue-ink)' : 'transparent',
                  color: rate === spd ? '#fff' : 'var(--color-ink-muted)',
                  cursor: 'pointer',
                  fontWeight: rate === spd ? 700 : 500,
                }}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subtítulo Dinámico Resaltado en Pantalla */}
      <div
        style={{
          backgroundColor: 'var(--color-card-muted)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '11px', color: 'var(--color-terracotta)', fontWeight: 700 }}>
            <MessageSquare size={12} /> Subtítulos Científicos y Guión de Voz
          </div>
          {isPlaying && !isPaused && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 3, height: 12, backgroundColor: 'var(--color-terracotta)', animation: 'pulse 0.6s infinite alternate' }} />
              <span style={{ width: 3, height: 18, backgroundColor: 'var(--color-terracotta)', animation: 'pulse 0.4s infinite alternate' }} />
              <span style={{ width: 3, height: 8, backgroundColor: 'var(--color-terracotta)', animation: 'pulse 0.7s infinite alternate' }} />
            </div>
          )}
        </div>

        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)', lineHeight: 1.6 }}>
          {script.sentences.map((sent, idx) => {
            const isCurrent = isPlaying && idx === currentSentenceIdx;
            return (
              <span
                key={idx}
                style={{
                  backgroundColor: isCurrent ? 'rgba(234, 88, 12, 0.2)' : 'transparent',
                  color: isCurrent ? 'var(--color-terracotta)' : 'inherit',
                  fontWeight: isCurrent ? 700 : 400,
                  padding: isCurrent ? '2px 4px' : '0',
                  borderRadius: 3,
                  transition: 'all 0.2s ease',
                  marginRight: '0.35rem',
                }}
              >
                {sent.text}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
