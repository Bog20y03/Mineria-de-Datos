import React from 'react';
import { CheckCircle2, Clock, Lock, Sparkles } from 'lucide-react';

export type StatusType = 'completado' | 'actual' | 'pendiente' | 'bloqueado';

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showIcon = true,
  size = 'md',
  className = '',
  style,
}) => {
  const configMap: Record<
    StatusType,
    {
      defaultLabel: string;
      color: string;
      bg: string;
      border: string;
      borderStyle: string;
      icon: React.ReactNode;
    }
  > = {
    completado: {
      defaultLabel: 'Completado',
      color: 'var(--color-blue-ink)',
      bg: 'var(--color-blue-soft)',
      border: 'var(--color-blue-border)',
      borderStyle: 'solid',
      icon: <CheckCircle2 size={size === 'sm' ? 12 : 14} />,
    },
    actual: {
      defaultLabel: 'En curso / Actual',
      color: 'var(--color-terracotta)',
      bg: 'var(--color-terracotta-soft)',
      border: 'var(--color-terracotta-border)',
      borderStyle: 'solid',
      icon: <Sparkles size={size === 'sm' ? 12 : 14} />,
    },
    pendiente: {
      defaultLabel: 'Pendiente',
      color: 'var(--color-ink-secondary)',
      bg: 'var(--color-pending-bg)',
      border: 'var(--color-border)',
      borderStyle: 'dashed',
      icon: <Clock size={size === 'sm' ? 12 : 14} />,
    },
    bloqueado: {
      defaultLabel: 'Bloqueado',
      color: 'var(--color-ink-muted)',
      bg: 'var(--color-blocked-bg)',
      border: 'var(--color-border)',
      borderStyle: 'dotted',
      icon: <Lock size={size === 'sm' ? 12 : 14} />,
    },
  };

  const current = configMap[status];
  const displayLabel = label || current.defaultLabel;

  return (
    <span
      className={`atlas-status-badge atlas-status-${status} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: size === 'sm' ? '0.2rem 0.5rem' : '0.25rem 0.65rem',
        fontSize: size === 'sm' ? '0.75rem' : '0.8125rem',
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        color: current.color,
        backgroundColor: current.bg,
        borderWidth: '1px',
        borderStyle: current.borderStyle,
        borderColor: current.border,
        borderRadius: 'var(--radius-full)',
        lineHeight: 1.2,
        userSelect: 'none',
        ...style,
      }}
    >
      {showIcon && current.icon}
      <span>{displayLabel}</span>
    </span>
  );
};
