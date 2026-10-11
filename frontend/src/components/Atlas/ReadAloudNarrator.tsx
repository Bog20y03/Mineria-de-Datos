import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, MessageSquare, Download, Sparkles } from 'lucide-react';

export interface NarrationScript {
  id: string;
  title: string;
  algorithm: string;
  audioFile: string;
  sentences: { text: string; startSec: number; endSec: number }[];
  fullText: string;
}

export const NARRATION_SCRIPTS: Record<string, NarrationScript> = {
  kmeans: {
    id: 'kmeans',
    title: 'Clustering K-Means',
    algorithm: 'Algoritmo de Lloyd (1982)',
    audioFile: '/audio/kmeans_narration.wav',
    sentences: [
      { text: 'Iniciando demostración del algoritmo de agrupamiento K-Means.', startSec: 0, endSec: 4.5 },
      { text: 'En la primera fase, proyectamos la nube de observaciones morfológicas del conjunto de datos en el plano bidimensional.', startSec: 4.5, endSec: 10.5 },
      { text: 'A continuación, se inicializan estocásticamente tres centroides identificados como mu 1, mu 2 y mu 3.', startSec: 10.5, endSec: 16.5 },
      { text: 'En la fase de asignación de Voronoi, el algoritmo calcula la distancia euclidiana entre cada punto y los centroides, asignando cada muestra a su centroide más próximo.', startSec: 16.5, endSec: 25.5 },
      { text: 'Posteriormente, se recalculan las medias aritméticas y los centroides se desplazan hacia el centro de masa de cada grupo.', startSec: 25.5, endSec: 32.5 },
      { text: 'La inercia intra-clúster desciende hasta alcanzar la convergencia de estado estable con 88 por ciento de varianza explicada.', startSec: 32.5, endSec: 42.0 },
    ],
    fullText:
      'Iniciando demostración del algoritmo de agrupamiento K-Means. En la primera fase, proyectamos la nube de observaciones morfológicas del conjunto de datos en el plano bidimensional. A continuación, se inicializan estocásticamente tres centroides identificados como mu 1, mu 2 y mu 3. En la fase de asignación de Voronoi, el algoritmo calcula la distancia euclidiana entre cada punto y los centroides, asignando cada muestra a su centroide más próximo. Posteriormente, se recalculan las medias aritméticas y los centroides se desplazan hacia el centro de masa de cada grupo. La inercia intra-clúster desciende hasta alcanzar la convergencia de estado estable con 88 por ciento de varianza explicada.',
  },
  tree: {
    id: 'tree',
    title: 'Árboles de Decisión CART',
    algorithm: 'Breiman, Friedman, Olshen (1984)',
    audioFile: '/audio/cart_tree_narration.wav',
    sentences: [
      { text: 'Visualización del algoritmo CART de clasificación supervisada por partición binaria recursiva.', startSec: 0, endSec: 5.5 },
      { text: 'Partimos del espacio completo de características con una impureza de Gini inicial de cero punto seiscientos sesenta y siete.', startSec: 5.5, endSec: 12.0 },
      { text: 'El algoritmo evalúa exhaustivamente todos los umbrales continuos y selecciona la regla óptima: longitud de pétalo menor o igual a dos punto cuarenta y cinco.', startSec: 12.0, endSec: 20.0 },
      { text: 'Esta primera división aísla de manera completamente pura la clase Setosa con un Gini de cero absoluto.', startSec: 20.0, endSec: 26.5 },
      { text: 'Seguidamente, el subconjunto restante se particiona mediante ancho de pétalo menor a uno punto setenta y cinco, separando Versicolor y Virginica con noventa y seis por ciento de exactitud.', startSec: 26.5, endSec: 38.0 },
    ],
    fullText:
      'Visualización del algoritmo CART de clasificación supervisada por partición binaria recursiva. Partimos del espacio completo de características con una impureza de Gini inicial de cero punto seiscientos sesenta y siete. El algoritmo evalúa exhaustivamente todos los umbrales continuos y selecciona la regla óptima: longitud de pétalo menor o igual a dos punto cuarenta y cinco. Esta primera división aísla de manera completamente pura la clase Setosa con un Gini de cero absoluto. Seguidamente, el subconjunto restante se particiona mediante ancho de pétalo menor a uno punto setenta y cinco, separando Versicolor y Virginica con noventa y seis por ciento de exactitud.',
  },
  neural: {
    id: 'neural',
    title: 'Redes Neuronales MLP',
    algorithm: 'Rumelhart, Hinton, Williams (1986)',
    audioFile: '/audio/neural_net_narration.wav',
    sentences: [
      { text: 'Demostración de Red Neuronal Perceptrón Multicapa con propagación hacia adelante y retropropagación.', startSec: 0, endSec: 6.0 },
      { text: 'Cuatro variables de entrada alimentan la red y transmiten pulsos de activación a través de la matriz sináptica ponderada W.', startSec: 6.0, endSec: 13.5 },
      { text: 'Cada neurona oculta integra las señales ponderadas con su sesgo y evalúa la función de activación no lineal ReLU.', startSec: 13.5, endSec: 21.0 },
      { text: 'En la capa de salida, la función Softmax calcula la probabilidad de pertenencia a cada clase.', startSec: 21.0, endSec: 27.5 },
      { text: 'Finalmente, la onda de retropropagación evalúa el gradiente de la función de pérdida y actualiza los pesos sinápticos mediante descenso de gradiente estocástico.', startSec: 27.5, endSec: 38.0 },
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
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [rate, setRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const script = NARRATION_SCRIPTS[clipId] || NARRATION_SCRIPTS.kmeans;

  // Detener audio al cambiar de clip
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentSentenceIdx(0);
  }, [clipId]);

  // Manejar reproducción / pausa
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          onNarrationStart?.();
        })
        .catch((err) => {
          console.warn('Error al reproducir audio WAV, intentando con SpeechSynthesis:', err);
          // Fallback a SpeechSynthesis si el navegador bloqueara audio
          speakWithTTS();
        });
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentSentenceIdx(0);
    onNarrationEnd?.();
  };

  // Fallback con SpeechSynthesis en caso de error
  const speakWithTTS = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(script.fullText);
    utt.lang = 'es-ES';
    utt.rate = rate;
    utt.onstart = () => {
      setIsPlaying(true);
      onNarrationStart?.();
    };
    utt.onend = () => {
      setIsPlaying(false);
      onNarrationEnd?.();
    };
    window.speechSynthesis.speak(utt);
  };

  // Actualizar tiempo y sincronizar subtítulo activo
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    setCurrentTime(cur);

    // Encontrar frase activa según startSec y endSec
    const idx = script.sentences.findIndex((s) => cur >= s.startSec && cur < s.endSec);
    if (idx !== -1 && idx !== currentSentenceIdx) {
      setCurrentSentenceIdx(idx);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
        gap: '1.15rem',
        boxShadow: 'var(--shadow-atlas-xs)',
      }}
    >
      {/* Elemento de Audio Real HTML5 */}
      <audio
        ref={audioRef}
        src={script.audioFile}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
          setCurrentSentenceIdx(0);
          onNarrationEnd?.();
        }}
        preload="auto"
      />

      {/* Cabecera del Panel de Voz */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.55rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isPlaying ? 'rgba(234, 88, 12, 0.15)' : 'var(--color-card-muted)',
              color: isPlaying ? 'var(--color-terracotta)' : 'var(--color-ink-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-ink)' }}>
                Voz en Off Científica (Read Aloud en Español)
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#059669',
                  padding: '2px 7px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                }}
              >
                Audio Real WAV
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
              Voz en español con locución explicativa del pipeline matemático y sincronización
            </div>
          </div>
        </div>

        {/* Botonera de Control de Reproducción */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={togglePlay}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.85rem',
              padding: '0.5rem 1.15rem',
              backgroundColor: 'var(--color-terracotta)',
              borderColor: 'var(--color-terracotta)',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(234, 88, 12, 0.25)',
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
            <span>{isPlaying ? 'Pausar Narración' : '▶ Escuchar Voz en Off'}</span>
          </button>

          {isPlaying && (
            <button
              type="button"
              onClick={handleStop}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                color: '#ef4444',
              }}
              title="Detener audio y reiniciar"
            >
              <Square size={12} fill="currentColor" />
              <span>Detener</span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleMute}
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.45rem 0.7rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
            }}
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          {/* Selector de Velocidad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            {[0.8, 1.0, 1.2].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => handleRateChange(spd)}
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  padding: '4px 7px',
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

          {/* Descargar Archivo WAV */}
          <a
            href={script.audioFile}
            download
            style={{ textDecoration: 'none' }}
            title="Descargar pista de voz grabada en formato WAV"
          >
            <button
              type="button"
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.78rem',
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              <Download size={13} />
              <span>.WAV</span>
            </button>
          </a>
        </div>
      </div>

      {/* Línea de Tiempo de Audio y Ecualizador */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'var(--color-card-muted)',
          padding: '0.65rem 1rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border-light)',
        }}
      >
        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--color-ink-muted)', minWidth: 32 }}>
          {formatSeconds(currentTime)}
        </span>

        <input
          type="range"
          min="0"
          max={duration || 30}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          style={{
            flex: 1,
            cursor: 'pointer',
            accentColor: 'var(--color-terracotta)',
          }}
        />

        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--color-ink-muted)', minWidth: 32 }}>
          {formatSeconds(duration)}
        </span>

        {/* Ecualizador Gráfico Animado */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 16, width: 28, paddingLeft: 4 }}>
          <span
            style={{
              width: 3,
              height: isPlaying ? '14px' : '4px',
              backgroundColor: isPlaying ? 'var(--color-terracotta)' : 'var(--color-ink-disabled)',
              borderRadius: 1,
              transition: 'height 0.15s ease',
            }}
          />
          <span
            style={{
              width: 3,
              height: isPlaying ? '18px' : '6px',
              backgroundColor: isPlaying ? 'var(--color-terracotta)' : 'var(--color-ink-disabled)',
              borderRadius: 1,
              transition: 'height 0.25s ease',
            }}
          />
          <span
            style={{
              width: 3,
              height: isPlaying ? '10px' : '3px',
              backgroundColor: isPlaying ? 'var(--color-terracotta)' : 'var(--color-ink-disabled)',
              borderRadius: 1,
              transition: 'height 0.2s ease',
            }}
          />
          <span
            style={{
              width: 3,
              height: isPlaying ? '16px' : '5px',
              backgroundColor: isPlaying ? 'var(--color-terracotta)' : 'var(--color-ink-disabled)',
              borderRadius: 1,
              transition: 'height 0.18s ease',
            }}
          />
        </div>
      </div>

      {/* Subtítulos Sincronizados con Resaltado Dinámico */}
      <div
        style={{
          backgroundColor: 'var(--color-card-muted)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '11px', color: 'var(--color-terracotta)', fontWeight: 700 }}>
            <MessageSquare size={13} />
            <span>Subtítulos Científicos Sincronizados con la Voz</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '10px', color: 'var(--color-blue-ink)' }}>
            <Sparkles size={11} />
            <span>Locutora: Microsoft Helena (Español)</span>
          </div>
        </div>

        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)', lineHeight: 1.65 }}>
          {script.sentences.map((sent, idx) => {
            const isCurrent = isPlaying && idx === currentSentenceIdx;
            return (
              <span
                key={idx}
                style={{
                  backgroundColor: isCurrent ? 'rgba(234, 88, 12, 0.2)' : 'transparent',
                  color: isCurrent ? 'var(--color-terracotta)' : 'inherit',
                  fontWeight: isCurrent ? 700 : 400,
                  padding: isCurrent ? '2px 5px' : '0',
                  borderRadius: 4,
                  transition: 'all 0.2s ease',
                  marginRight: '0.4rem',
                  display: 'inline',
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
