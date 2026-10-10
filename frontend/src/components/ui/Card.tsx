import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'dashed';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  header,
  footer,
  children,
  style,
  className = '',
  ...props
}) => {
  const paddingMap = {
    none: '0',
    sm: '0.75rem',
    md: '1.25rem',
    lg: '1.75rem',
  };

  const bgMap = {
    default: 'var(--color-card)',
    muted: 'var(--color-card-muted)',
    dashed: 'var(--color-card)',
  };

  const borderStyle = variant === 'dashed' ? '1px dashed var(--color-border)' : '1px solid var(--color-border)';

  return (
    <div
      {...props}
      className={`atlas-card ${className}`}
      style={{
        backgroundColor: bgMap[variant],
        border: borderStyle,
        borderRadius: 'var(--radius-md)',
        boxShadow: variant === 'dashed' ? 'none' : 'var(--shadow-atlas-sm)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
        ...style,
      }}
    >
      {header && (
        <div
          style={{
            padding: paddingMap[padding],
            borderBottom: '1px solid var(--color-border-light)',
            backgroundColor: 'rgba(31, 42, 60, 0.02)',
          }}
        >
          {header}
        </div>
      )}

      <div style={{ padding: paddingMap[padding], flex: 1 }}>{children}</div>

      {footer && (
        <div
          style={{
            padding: paddingMap[padding],
            borderTop: '1px solid var(--color-border-light)',
            backgroundColor: 'rgba(31, 42, 60, 0.015)',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
