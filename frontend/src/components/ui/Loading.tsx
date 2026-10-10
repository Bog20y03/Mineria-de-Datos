import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingProps {
  mensaje?: string;
  submensaje?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Loading: React.FC<LoadingProps> = ({
  mensaje = 'Consultando La Máquina de Minería...',
  submensaje,
  size = 'md',
  fullHeight = false,
  className = '',
  style,
}) => {
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 36 : 28;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`atlas-loading ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2.5rem 1.5rem',
        minHeight: fullHeight ? '50vh' : 'auto',
        gap: '0.75rem',
        ...style,
      }}
    >
      <Loader2
        size={iconSize}
        className="spin"
        style={{ color: 'var(--color-terracotta)' }}
      />
      <div>
        <div
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {mensaje}
        </div>
        {submensaje && (
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-ink-muted)',
              marginTop: '0.2rem',
            }}
          >
            {submensaje}
          </div>
        )}
      </div>
    </div>
  );
};
