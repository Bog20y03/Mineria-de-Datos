import React from 'react';

export interface ProgressBarProps {
  percentage: number;
  label?: string;
  sublabel?: string;
  variant?: 'blue' | 'terracotta';
  size?: 'sm' | 'md' | 'lg';
  showPercentageText?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  sublabel,
  variant = 'blue',
  size = 'md',
  showPercentageText = true,
  className = '',
  style,
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));

  const heightMap = {
    sm: '6px',
    md: '10px',
    lg: '16px',
  };

  const fillColor = variant === 'blue' ? 'var(--color-blue-ink)' : 'var(--color-terracotta)';

  return (
    <div className={`atlas-progress ${className}`} style={{ width: '100%', ...style }}>
      {(label || showPercentageText) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '0.35rem',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {label && (
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-ink)' }}>
              {label}
            </span>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            {sublabel && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                {sublabel}
              </span>
            )}
            {showPercentageText && (
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  color: fillColor,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {clamped}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Riel */}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progreso'}
        style={{
          width: '100%',
          height: heightMap[size],
          backgroundColor: 'var(--color-border-light)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Barra rellena */}
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            backgroundColor: fillColor,
            borderRadius: 'var(--radius-full)',
            transition: 'width var(--transition-normal)',
          }}
        />
      </div>
    </div>
  );
};
