import React from 'react';
import type { TopicDetail } from '../../types/domain';
import type { StationId, StationStatus, PiecePayload } from './types';
import { MachineStation } from './MachineStation';
import { ConveyorPiece } from './ConveyorPiece';
import { ESTACIONES_LISTA } from '../../services/recorridoService';
import {
  Play,
  RotateCcw,
  SlidersHorizontal,
  Maximize2,
  CheckCircle2,
  Loader2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Button } from '../ui';

interface MachineSceneProps {
  topicDetail: TopicDetail | null;
  activeStation: StationId;
  operadas: StationId[];
  isProducing: boolean;
  productionStepIndex: number; // 0..4
  currentPiece: PiecePayload | null;
  piecePositionPercent: number; // 0..100
  isRejected: boolean;
  rejectReason?: string;
  isProcessingR: boolean;
  onSelectStation: (stationId: StationId) => void;
  onProduceTopic: () => void;
  onResetJourney: () => void;
  onToggleDrawer: () => void;
  onEnterPresentation: () => void;
}

export const MachineScene: React.FC<MachineSceneProps> = ({
  topicDetail,
  activeStation,
  operadas,
  isProducing,
  currentPiece,
  piecePositionPercent,
  isRejected,
  rejectReason,
  isProcessingR,
  onSelectStation,
  onProduceTopic,
  onResetJourney,
  onToggleDrawer,
  onEnterPresentation,
}) => {
  // Resumen real para cada estación (Máximo 2 líneas de texto según Requisito 7)
  const getStationSummary = (id: StationId): string => {
    switch (id) {
      case 'terminal':
        return 'Ecuaciones booleanas indexadas en solo lectura para Scholar.';
      case 'biblioteca':
        return 'Matriz documental revisada por pares con trazabilidad DOI.';
      case 'laboratorio':
        return 'Ejecución cuantitativa en R nativo con consola y métricas.';
      case 'escritorio':
        return 'Generación del manuscrito formal estructurado en LaTeX (.tex).';
      case 'pizarra':
        return 'Síntesis de evidencias, baselines y sustentación final.';
    }
  };

  // Métrica real de cada estación
  const getStationRealMetric = (id: StationId): string => {
    if (!topicDetail) return 'Cargando datos...';
    switch (id) {
      case 'terminal':
        return `${topicDetail.searches.length} consultas registradas`;
      case 'biblioteca':
        return `${topicDetail.documents.length} artículos indexados`;
      case 'laboratorio':
        return topicDetail.dataset?.archivo && topicDetail.rExample?.archivo
          ? `${topicDetail.dataset.archivo}`
          : 'Sin datos registrados';
      case 'escritorio':
        return topicDetail.latex?.archivo || 'Sin archivo .tex';
      case 'pizarra':
        return `${topicDetail.results.imagenes?.length || 0} figuras + métricas`;
    }
  };

  const getStationStatus = (id: StationId): StationStatus => {
    if (operadas.includes(id)) return 'completada';
    if (id === activeStation) {
      return isProcessingR && id === 'laboratorio' ? 'procesando' : 'activa';
    }
    return 'pendiente';
  };

  const allCompleted = operadas.length === 5;

  return (
    <div
      style={{
        backgroundColor: 'var(--color-card)',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        boxShadow: 'var(--shadow-atlas-md)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        overflow: 'hidden',
      }}
    >
      {/* 1. Barra de Herramientas Superior de la Escena */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderBottom: '1px solid var(--color-border-light)',
          paddingBottom: '0.85rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--color-terracotta)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Sparkles size={13} /> Línea de Producción Automatizada
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>•</span>
            <span style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', fontFamily: 'var(--font-mono)' }}>
              {topicDetail?.topicId || 'Cargando...'}
            </span>
          </div>

          <h2
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 800,
              color: 'var(--color-ink)',
              margin: '0.15rem 0 0',
            }}
          >
            {topicDetail?.topicName || 'Cargando tema...'}
          </h2>
        </div>

        {/* Acciones principales de la escena */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* BOTÓN PRODUCIR TEMA (PROTAGONISTA) */}
          <Button
            variant="primary"
            size="md"
            onClick={onProduceTopic}
            disabled={isProducing || !topicDetail}
            title="Ejecuta la línea completa en secuencia (10-15s) con datos reales y R nativo"
            style={{
              backgroundColor: 'var(--color-terracotta)',
              color: '#FFFFFF',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(181, 83, 47, 0.3)',
              gap: '0.5rem',
            }}
          >
            {isProducing ? (
              <>
                <Loader2 size={16} className="spin" />
                <span>Produciendo tema...</span>
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" />
                <span>Producir tema (1 clic)</span>
              </>
            )}
          </Button>

          {/* Botón Inspeccionar Estación (Drawer) */}
          <Button
            variant="secondary"
            size="md"
            onClick={onToggleDrawer}
            title="Abre el panel de inspección técnica de la estación seleccionada"
          >
            <SlidersHorizontal size={15} />
            <span>Detalle estación</span>
          </Button>

          {/* Botón Modo Presentación */}
          <Button
            variant="outline"
            size="md"
            onClick={onEnterPresentation}
            title="Activar pantalla completa para sustentación académica"
          >
            <Maximize2 size={15} />
            <span>Presentación</span>
          </Button>

          {/* Botón Reiniciar Recorrido */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetJourney}
            title="Reiniciar estaciones operadas en este tema"
          >
            <RotateCcw size={14} />
          </Button>
        </div>
      </div>

      {/* 2. Escenario Físico: Estaciones sobre la Banda Transportadora */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          position: 'relative',
          padding: '1.5rem 0.5rem 2.5rem',
          backgroundColor: 'var(--color-paper)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border-light)',
          overflowX: 'auto',
        }}
      >
        {/* Fila de las 5 Máquinas SVG */}
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'space-between',
            gap: '1rem',
            minWidth: '860px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {ESTACIONES_LISTA.map((est) => (
            <MachineStation
              key={est.id}
              id={est.id}
              name={est.nombre}
              role={est.subtitulo}
              summary={getStationSummary(est.id)}
              realMetric={getStationRealMetric(est.id)}
              status={getStationStatus(est.id)}
              isActive={activeStation === est.id}
              isProcessing={isProcessingR && est.id === 'laboratorio'}
              onClick={() => onSelectStation(est.id)}
            />
          ))}
        </div>

        {/* 3. BANDA TRANSPORTADORA MECÁNICA (ANIMADA) */}
        <div
          style={{
            position: 'relative',
            marginTop: '0.5rem',
            minWidth: '860px',
            height: '52px',
          }}
        >
          {/* Rieles metálicos de soporte superior e inferior */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '2%',
              right: '2%',
              height: '3px',
              backgroundColor: 'var(--color-border)',
              borderRadius: '2px',
            }}
          />

          {/* Cinta transportadora con textura de rodillos y flujo animado */}
          <div
            className="conveyor-belt-track"
            style={{
              position: 'absolute',
              top: '12px',
              left: '2%',
              right: '2%',
              height: '24px',
              backgroundColor: 'var(--color-card-muted)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '3px',
              boxShadow: 'inset 0 2px 4px rgba(31, 42, 60, 0.08)',
            }}
          />

          {/* Riel metálico inferior */}
          <div
            style={{
              position: 'absolute',
              top: '38px',
              left: '2%',
              right: '2%',
              height: '3px',
              backgroundColor: 'var(--color-border)',
              borderRadius: '2px',
            }}
          />

          {/* Rodillos en extremos */}
          <div
            style={{
              position: 'absolute',
              top: '9px',
              left: '1%',
              width: '10px',
              height: '30px',
              backgroundColor: 'var(--color-ink-secondary)',
              borderRadius: '2px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '9px',
              right: '1%',
              width: '10px',
              height: '30px',
              backgroundColor: 'var(--color-ink-secondary)',
              borderRadius: '2px',
            }}
          />

          {/* PIEZA FÍSICA VIAJERA SOBRE LA BANDA */}
          {currentPiece && (
            <ConveyorPiece
              payload={currentPiece}
              positionPercent={piecePositionPercent}
              isRejected={isRejected}
              rejectReason={rejectReason}
              isMoving={isProducing}
            />
          )}
        </div>
      </div>

      {/* 4. Pie de la Escena: Estado general de la línea */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-ink-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2
            size={16}
            color={allCompleted ? 'var(--color-blue-ink)' : 'var(--color-terracotta)'}
          />
          <span style={{ fontWeight: 700, color: 'var(--color-ink)' }}>
            Estaciones operadas: {operadas.length} de 5
          </span>
          <span style={{ color: 'var(--color-ink-muted)' }}>
            ({allCompleted ? 'Línea validada al 100%' : 'Toca cualquier estación o presiona Producir tema'})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)' }}>
          <Layers size={13} />
          <span>Estación seleccionada: <strong>{activeStation.toUpperCase()}</strong></span>
        </div>
      </div>
    </div>
  );
};
