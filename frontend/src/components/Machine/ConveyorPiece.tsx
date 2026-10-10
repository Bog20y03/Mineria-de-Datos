import React from 'react';
import type { PiecePayload } from './types';
import {
  Terminal,
  BookOpen,
  Code2,
  BarChart3,
  FileCode2,
  Award,
  AlertTriangle,
} from 'lucide-react';

interface ConveyorPieceProps {
  payload: PiecePayload;
  positionPercent: number; // 0 to 100%
  isRejected?: boolean;
  rejectReason?: string;
  isMoving?: boolean;
}

export const ConveyorPiece: React.FC<ConveyorPieceProps> = ({
  payload,
  positionPercent,
  isRejected = false,
  rejectReason,
  isMoving = false,
}) => {
  const getIcon = () => {
    switch (payload.tipo) {
      case 'consulta':
        return <Terminal size={16} color="var(--color-blue-ink)" />;
      case 'documentos':
        return <BookOpen size={16} color="var(--color-blue-ink)" />;
      case 'dataset_script':
        return <Code2 size={16} color="var(--color-terracotta)" />;
      case 'graficas_metricas':
        return <BarChart3 size={16} color="var(--color-terracotta)" />;
      case 'latex':
        return <FileCode2 size={16} color="var(--color-blue-ink)" />;
      case 'sustentacion':
        return <Award size={16} color="var(--color-terracotta)" />;
    }
  };

  return (
    <div
      className={isRejected ? 'piece-reject' : undefined}
      style={{
        position: 'absolute',
        left: `${positionPercent}%`,
        bottom: '8px',
        transform: 'translateX(-50%)',
        transition: isMoving
          ? 'left 1.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.3s ease'
          : 'none',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: isRejected ? 'var(--color-danger-bg)' : 'var(--color-card)',
          border: `1.5px solid ${
            isRejected
              ? 'var(--color-danger-ink)'
              : 'var(--color-border)'
          }`,
          borderRadius: 'var(--radius-sm)',
          padding: '0.45rem 0.75rem',
          boxShadow: isRejected
            ? '0 4px 12px rgba(153, 35, 35, 0.25)'
            : '0 4px 10px rgba(31, 42, 60, 0.12)',
          minWidth: '150px',
          maxWidth: '220px',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-xs)',
            backgroundColor: isRejected
              ? 'var(--color-danger-bg)'
              : payload.tipo === 'dataset_script' || payload.tipo === 'graficas_metricas'
              ? 'var(--color-terracotta-soft)'
              : 'var(--color-blue-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isRejected ? <AlertTriangle size={16} color="var(--color-danger-ink)" /> : getIcon()}
        </div>

        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: isRejected ? 'var(--color-danger-ink)' : 'var(--color-ink)',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {payload.label}
          </div>
          <div
            style={{
              fontSize: '10px',
              color: isRejected ? 'var(--color-danger-ink)' : 'var(--color-ink-muted)',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {isRejected ? (rejectReason || 'Sin datos registrados') : payload.sublabel}
          </div>
        </div>

        {payload.badge && !isRejected && (
          <span
            style={{
              fontSize: '9px',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-blue-soft)',
              color: 'var(--color-blue-ink)',
              border: '1px solid var(--color-blue-border)',
              flexShrink: 0,
            }}
          >
            {payload.badge}
          </span>
        )}
      </div>

      {/* Flechita o apoyo mecánico de la pieza sobre la cinta */}
      <div
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: isRejected ? 'var(--color-danger-ink)' : 'var(--color-border)',
          margin: '2px auto 0',
          borderRadius: '1px',
        }}
      />
    </div>
  );
};
