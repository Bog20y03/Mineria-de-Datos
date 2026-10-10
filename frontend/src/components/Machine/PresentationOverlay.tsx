import React, { useEffect } from 'react';
import type { TopicDetail } from '../../types/domain';
import type { StationId, PiecePayload } from './types';
import type { UnitId } from '../../types/domain';
import { ESTACIONES_LISTA } from '../../services/recorridoService';
import { MachineScene } from './MachineScene';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Presentation,
} from 'lucide-react';
import { Button } from '../ui';

const UNIT_QUESTIONS: Record<UnitId, string> = {
  UNIDAD_1: '¿Qué aplicaciones empresariales encuentra para la minería de datos y cómo las puede aprovechar en su vida profesional?',
  UNIDAD_2: '¿Cómo las matemáticas son aprovechadas para desarrollar técnicas y modelos de minería que posteriormente son sintetizados en algoritmos para desarrollar estrategias de negocio como ecommerce, marketing, entre otros?',
  UNIDAD_3: '¿Cómo aplicar diferentes técnicas de minería de datos a bases de datos existentes en empresas o bases de datos gubernamentales?',
  UNIDAD_4: '¿Cómo aplicar las técnicas de minería de datos en proyectos propios?',
};

interface PresentationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  topicDetail: TopicDetail | null;
  activeStation: StationId;
  operadas: StationId[];
  isProducing: boolean;
  productionStepIndex: number;
  currentPiece: PiecePayload | null;
  piecePositionPercent: number;
  isRejected: boolean;
  rejectReason?: string;
  isProcessingR: boolean;
  onSelectStation: (stationId: StationId) => void;
  onProduceTopic: () => void;
  onResetJourney: () => void;
  onToggleDrawer: () => void;
}

export const PresentationOverlay: React.FC<PresentationOverlayProps> = ({
  isOpen,
  onClose,
  topicDetail,
  activeStation,
  operadas,
  isProducing,
  productionStepIndex,
  currentPiece,
  piecePositionPercent,
  isRejected,
  rejectReason,
  isProcessingR,
  onSelectStation,
  onProduceTopic,
  onResetJourney,
  onToggleDrawer,
}) => {
  // Manejador de teclado para navegación en presentación
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape: Salir
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Enter: Producir tema
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isProducing) {
          onProduceTopic();
        }
        return;
      }

      // Flechas o Espacio: Navegar estación
      const currentIndex = ESTACIONES_LISTA.findIndex((s) => s.id === activeStation);
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % ESTACIONES_LISTA.length;
        onSelectStation(ESTACIONES_LISTA[nextIndex].id);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + ESTACIONES_LISTA.length) % ESTACIONES_LISTA.length;
        onSelectStation(ESTACIONES_LISTA[prevIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeStation, isProducing, onProduceTopic, onSelectStation, onClose]);

  if (!isOpen) return null;

  const currentIndex = ESTACIONES_LISTA.findIndex((s) => s.id === activeStation);
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % ESTACIONES_LISTA.length;
    onSelectStation(ESTACIONES_LISTA[nextIndex].id);
  };
  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + ESTACIONES_LISTA.length) % ESTACIONES_LISTA.length;
    onSelectStation(ESTACIONES_LISTA[prevIndex].id);
  };

  return (
    <div
      className="presentation-container"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--color-paper)',
        backgroundImage: 'var(--bg-topographic-pattern)',
        backgroundRepeat: 'repeat',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: '1.5rem 2rem',
      }}
    >
      {/* 1. Barra Superior del Modo Presentación */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--color-card)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.5rem',
          boxShadow: 'var(--shadow-atlas-md)',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-terracotta)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(181, 83, 47, 0.3)',
            }}
          >
            <Presentation size={24} />
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Modo Sustentación Académica • La Máquina de Minería
            </div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--color-ink)',
                margin: '0.1rem 0 0',
                letterSpacing: '-0.01em',
              }}
            >
              {topicDetail?.topicName || 'Sustentación de Proyecto'}
            </h1>
          </div>
        </div>

        {/* Controles de Navegación y Salida */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Navegación de Estaciones */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: 'var(--color-card-muted)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-light)' }}>
            <Button variant="ghost" size="sm" onClick={handlePrev} title="Estación anterior (←)">
              <ChevronLeft size={18} />
            </Button>
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '0 0.5rem', fontFamily: 'var(--font-mono)' }}>
              {currentIndex + 1} / {ESTACIONES_LISTA.length}
            </span>
            <Button variant="ghost" size="sm" onClick={handleNext} title="Estación siguiente (→ o Espacio)">
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* Atajos en pantalla */}
          <div
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-ink-secondary)',
              padding: '0.4rem 0.75rem',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--color-card-muted)',
              border: '1px solid var(--color-border-light)',
            }}
          >
            [←/→] Cambiar • [Enter] Producir • [Esc] Salir
          </div>

          {/* Botón Salir */}
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            style={{
              borderColor: 'var(--color-border)',
              fontWeight: 700,
              gap: '0.4rem',
            }}
          >
            <X size={16} />
            <span>Salir (Esc)</span>
          </Button>
        </div>
      </div>

      {/* 2. Escena Ampliada como Protagonista */}
      <div style={{ maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
        <MachineScene
          topicDetail={topicDetail}
          activeStation={activeStation}
          operadas={operadas}
          isProducing={isProducing}
          productionStepIndex={productionStepIndex}
          currentPiece={currentPiece}
          piecePositionPercent={piecePositionPercent}
          isRejected={isRejected}
          rejectReason={rejectReason}
          isProcessingR={isProcessingR}
          onSelectStation={onSelectStation}
          onProduceTopic={onProduceTopic}
          onResetJourney={onResetJourney}
          onToggleDrawer={onToggleDrawer}
          onEnterPresentation={() => {}}
        />

        {/* 3. Panel de Síntesis de Evidencias en Presentación */}
        {topicDetail && (
          <div
            style={{
              marginTop: '1.5rem',
              backgroundColor: 'var(--color-card)',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-atlas-md)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Tarjeta A: Pregunta Problema */}
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-card-muted)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-light)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-terracotta)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Objetivo & Pregunta Problema:
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)', fontStyle: 'italic', lineHeight: 1.5 }}>
                {(topicDetail.unitId && UNIT_QUESTIONS[topicDetail.unitId]) || '¿Cómo aplicar las técnicas de minería de datos de forma sistemática?'}
              </div>
            </div>

            {/* Tarjeta B: Artefactos Reales Verificados */}
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-card-muted)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-light)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-blue-ink)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Balance de Artefactos de la Demostración:
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)', lineHeight: 1.5 }}>
                <strong>{topicDetail.searches.length}</strong> consultas booleanas •{' '}
                <strong>{topicDetail.documents.length}</strong> artículos científicos •{' '}
                <strong>{topicDetail.results.imagenes?.length || 0}</strong> figuras empíricas generadas con R
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
