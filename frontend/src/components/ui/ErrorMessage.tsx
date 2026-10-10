import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorMessageProps {
  titulo?: string;
  mensaje: string;
  detalle?: string;
  onReintentar?: () => void;
  reintentarTexto?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  titulo = 'Error de Comunicación',
  mensaje,
  detalle,
  onReintentar,
  reintentarTexto = 'Reintentar Operación',
  className = '',
  style,
}) => {
  return (
    <div
      role="alert"
      className={`atlas-error-message ${className}`}
      style={{
        backgroundColor: 'var(--color-danger-bg)',
        border: '1px solid var(--color-danger-border)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        maxWidth: '680px',
        margin: '1.5rem auto',
        ...style,
      }}
    >
      <div
        style={{
          color: 'var(--color-danger-ink)',
          flexShrink: 0,
          marginTop: '0.15rem',
        }}
      >
        <AlertCircle size={22} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 700,
            color: 'var(--color-danger-ink)',
            margin: '0 0 0.25rem 0',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {titulo}
        </h4>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-ink)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {mensaje}
        </p>

        {detalle && (
          <div
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-danger-border)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-ink-secondary)',
              wordBreak: 'break-all',
            }}
          >
            {detalle}
          </div>
        )}

        {onReintentar && (
          <div style={{ marginTop: '0.85rem' }}>
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw size={14} />}
              onClick={onReintentar}
            >
              {reintentarTexto}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
