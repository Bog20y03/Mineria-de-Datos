import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  disabled,
  style,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading;

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid transparent',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    transition: 'all var(--transition-fast)',
    textDecoration: 'none',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: {
      padding: '0.35rem 0.65rem',
      fontSize: 'var(--text-sm)',
      lineHeight: '1.25rem',
    },
    md: {
      padding: '0.5rem 1rem',
      fontSize: 'var(--text-sm)',
      lineHeight: '1.35rem',
    },
    lg: {
      padding: '0.65rem 1.35rem',
      fontSize: 'var(--text-base)',
      lineHeight: '1.5rem',
    },
  };

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-terracotta)',
      color: '#FFFFFF',
      borderColor: 'var(--color-terracotta)',
      boxShadow: 'var(--shadow-atlas-xs)',
    },
    secondary: {
      backgroundColor: 'var(--color-blue-soft)',
      color: 'var(--color-blue-ink)',
      borderColor: 'var(--color-blue-border)',
    },
    outline: {
      backgroundColor: 'var(--color-card)',
      color: 'var(--color-ink)',
      borderColor: 'var(--color-border)',
      boxShadow: 'var(--shadow-atlas-xs)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-ink-secondary)',
      borderColor: 'transparent',
    },
    danger: {
      backgroundColor: 'var(--color-danger-bg)',
      color: 'var(--color-danger-ink)',
      borderColor: 'var(--color-danger-border)',
    },
  };

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`atlas-btn atlas-btn-${variant} atlas-btn-${size} ${className}`}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="spin" />
      ) : (
        iconPosition === 'left' && icon
      )}
      {children && <span>{children}</span>}
      {!loading && iconPosition === 'right' && icon}
    </button>
  );
};
