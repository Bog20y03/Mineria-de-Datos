import React from 'react';
import {
  Binary,
  BookOpen,
  Code2,
  FileText,
  LineChart,
  Presentation,
  Check,
  Clock,
  Lock,
} from 'lucide-react';

export type ObjectPieceType =
  | 'consulta'
  | 'documentos'
  | 'dataset_script'
  | 'metricas_graficas'
  | 'latex_doc'
  | 'presentacion';

export type ObjectPieceState = 'listo' | 'en_proceso' | 'pendiente' | 'bloqueado';

export interface ObjectPieceProps {
  tipo: ObjectPieceType;
  titulo: string;
  subtitulo?: string;
  estado?: ObjectPieceState;
  detalles?: string;
  compact?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ObjectPiece: React.FC<ObjectPieceProps> = ({
  tipo,
  titulo,
  subtitulo,
  estado = 'listo',
  detalles,
  compact = false,
  onClick,
  className = '',
  style,
}) => {
  const typeConfig: Record<
    ObjectPieceType,
    { label: string; icon: React.ReactNode; color: string; bg: string }
  > = {
    consulta: {
      label: 'Ecuación Booleana',
      icon: <Binary size={compact ? 16 : 20} />,
      color: 'var(--color-blue-ink)',
      bg: 'var(--color-blue-soft)',
    },
    documentos: {
      label: 'Documentos Académicos',
      icon: <BookOpen size={compact ? 16 : 20} />,
      color: 'var(--color-blue-ink)',
      bg: 'var(--color-blue-soft)',
    },
    dataset_script: {
      label: 'Dataset + Script R',
      icon: <Code2 size={compact ? 16 : 20} />,
      color: 'var(--color-terracotta)',
      bg: 'var(--color-terracotta-soft)',
    },
    metricas_graficas: {
      label: 'Gráficas y Métricas',
      icon: <LineChart size={compact ? 16 : 20} />,
      color: 'var(--color-blue-ink)',
      bg: 'var(--color-blue-soft)',
    },
    latex_doc: {
      label: 'Artículo LaTeX (.tex)',
      icon: <FileText size={compact ? 16 : 20} />,
      color: 'var(--color-terracotta)',
      bg: 'var(--color-terracotta-soft)',
    },
    presentacion: {
      label: 'Sustentación',
      icon: <Presentation size={compact ? 16 : 20} />,
      color: 'var(--color-blue-ink)',
      bg: 'var(--color-blue-soft)',
    },
  };

  const stateIcons: Record<ObjectPieceState, React.ReactNode> = {
    listo: <Check size={12} color="var(--color-blue-ink)" />,
    en_proceso: <Clock size={12} color="var(--color-terracotta)" />,
    pendiente: <Clock size={12} color="var(--color-ink-muted)" />,
    bloqueado: <Lock size={12} color="var(--color-ink-disabled)" />,
  };

  const stateBorder =
    estado === 'bloqueado'
      ? '1px dotted var(--color-ink-disabled)'
      : estado === 'pendiente'
      ? '1px dashed var(--color-border)'
      : estado === 'en_proceso'
      ? '1px solid var(--color-terracotta-border)'
      : '1px solid var(--color-blue-border)';

  const current = typeConfig[tipo];

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`atlas-object-piece atlas-piece-${tipo} atlas-piece-state-${estado} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? '0.5rem' : '0.85rem',
        padding: compact ? '0.4rem 0.75rem' : '0.65rem 1rem',
        backgroundColor: 'var(--color-card)',
        border: stateBorder,
        borderRadius: 'var(--radius-md)',
        boxShadow: estado === 'listo' ? 'var(--shadow-atlas-xs)' : 'none',
        opacity: estado === 'bloqueado' ? 0.6 : 1,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'all var(--transition-fast)',
        maxWidth: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Icono de la pieza */}
      <div
        style={{
          width: compact ? '28px' : '36px',
          height: compact ? '28px' : '36px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: current.bg,
          color: current.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {current.icon}
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontWeight: 700,
              color: current.color,
            }}
          >
            {current.label}
          </span>
          <span title={`Estado: ${estado}`}>{stateIcons[estado]}</span>
        </div>
        <div
          style={{
            fontSize: compact ? 'var(--text-sm)' : 'var(--text-base)',
            fontWeight: 600,
            color: 'var(--color-ink)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {titulo}
        </div>
        {subtitulo && !compact && (
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-ink-secondary)',
              marginTop: '0.1rem',
            }}
          >
            {subtitulo}
          </div>
        )}
        {detalles && !compact && (
          <div
            style={{
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-ink-muted)',
              marginTop: '0.2rem',
            }}
          >
            {detalles}
          </div>
        )}
      </div>
    </div>
  );
};
