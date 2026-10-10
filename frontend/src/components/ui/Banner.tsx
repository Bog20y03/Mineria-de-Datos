import React from 'react';
import { Compass } from 'lucide-react';

export interface BannerProps {
  titulo: string;
  subtitulo?: string;
  icono?: React.ReactNode;
  metricaPrincipal?: {
    valor: string | number;
    etiqueta: string;
  };
  metricaSecundaria?: {
    valor: string | number;
    etiqueta: string;
  };
  variant?: 'atlas' | 'editorial' | 'terracotta';
  mostrarBrujula?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Rosa de los vientos / Brújula náutica de atlas que gira sutil y continuamente.
 */
const CompassRose: React.FC<{ size?: number }> = ({ size = 110 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      animation: 'rotateCompass var(--motion-duration-compass) linear infinite',
      transformOrigin: '50% 50%',
      display: 'block',
    }}
    aria-hidden="true"
  >
    {/* Anillos exteriores concéntricos */}
    <circle cx="50" cy="50" r="46" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 3" />
    <circle cx="50" cy="50" r="42" stroke="var(--color-border)" strokeWidth="0.75" />
    <circle cx="50" cy="50" r="30" stroke="var(--color-border-light)" strokeWidth="0.5" />
    <circle cx="50" cy="50" r="10" stroke="var(--color-terracotta)" strokeWidth="0.75" strokeDasharray="1 2" />

    {/* Rayos cardinales mayores (N, S, E, O) */}
    {/* Norte (Terracota) */}
    <polygon points="50,4 53,42 50,40" fill="var(--color-terracotta)" />
    <polygon points="50,4 47,42 50,40" fill="var(--color-terracotta-soft)" stroke="var(--color-border)" strokeWidth="0.5" />
    {/* Sur (Azul tinta) */}
    <polygon points="50,96 53,58 50,60" fill="var(--color-blue-ink)" />
    <polygon points="50,96 47,58 50,60" fill="var(--color-blue-soft)" stroke="var(--color-border)" strokeWidth="0.5" />
    {/* Este */}
    <polygon points="96,50 58,53 60,50" fill="var(--color-ink-secondary)" />
    <polygon points="96,50 58,47 60,50" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="0.5" />
    {/* Oeste */}
    <polygon points="4,50 42,53 40,50" fill="var(--color-ink-secondary)" />
    <polygon points="4,50 42,47 40,50" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="0.5" />

    {/* Rayos ordinales (NE, NW, SE, SW) */}
    <polygon points="79,21 54,46 56,44" fill="var(--color-ink-muted)" opacity="0.6" />
    <polygon points="21,21 46,46 44,44" fill="var(--color-ink-muted)" opacity="0.6" />
    <polygon points="79,79 54,54 56,56" fill="var(--color-ink-muted)" opacity="0.6" />
    <polygon points="21,79 46,54 44,56" fill="var(--color-ink-muted)" opacity="0.6" />

    {/* Centro / Pivote */}
    <circle cx="50" cy="50" r="3.5" fill="var(--color-terracotta)" stroke="var(--color-card)" strokeWidth="1.5" />
  </svg>
);

export const Banner: React.FC<BannerProps> = ({
  titulo,
  subtitulo,
  icono,
  metricaPrincipal,
  metricaSecundaria,
  variant = 'atlas',
  mostrarBrujula = true,
  children,
  className = '',
  style,
}) => {
  const bgMap = {
    atlas: 'var(--color-card)',
    editorial: 'var(--color-card-muted)',
    terracotta: 'var(--color-terracotta-soft)',
  };

  const accentBorder = {
    atlas: 'var(--color-blue-ink)',
    editorial: 'var(--color-border)',
    terracotta: 'var(--color-terracotta)',
  };

  return (
    <div
      className={`atlas-banner atlas-banner-${variant} ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: bgMap[variant],
        border: '1px solid var(--color-border)',
        borderLeft: `5px solid ${accentBorder[variant]}`,
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem 1.75rem',
        boxShadow: 'var(--shadow-atlas-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        flexWrap: 'wrap',
        ...style,
      }}
    >
      {/* Trazo animado de expedición de fondo */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
          opacity: 0.7,
        }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1000 120"
        aria-hidden="true"
      >
        <path
          d="M -50,60 C 150,20 300,100 500,45 C 700,-10 850,90 1050,40"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          style={{
            animation: 'dashTravel var(--motion-duration-slow) linear infinite',
          }}
        />
        <path
          d="M -30,90 C 220,110 400,15 650,85 C 800,120 950,20 1050,80"
          fill="none"
          stroke="var(--color-border-light)"
          strokeWidth="1"
          strokeDasharray="3 6"
          style={{
            animation: 'dashTravel 2.4s linear infinite',
            animationDirection: 'reverse',
          }}
        />
      </svg>

      {/* Rosa de los vientos de fondo animada */}
      {mostrarBrujula && (
        <div
          style={{
            position: 'absolute',
            right: metricaPrincipal || metricaSecundaria ? '15%' : '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.16,
          }}
        >
          <CompassRose size={130} />
        </div>
      )}

      {/* Contenido principal */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flex: 1,
          minWidth: '280px',
        }}
      >
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-paper)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: variant === 'terracotta' ? 'var(--color-terracotta)' : 'var(--color-blue-ink)',
            flexShrink: 0,
          }}
        >
          {icono || <Compass size={24} />}
        </div>
        <div>
          <h2
            className="atlas-title"
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              margin: 0,
            }}
          >
            {titulo}
          </h2>
          {subtitulo && (
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-ink-secondary)',
                margin: '0.2rem 0 0',
              }}
            >
              {subtitulo}
            </p>
          )}
          {children && <div style={{ marginTop: '0.5rem' }}>{children}</div>}
        </div>
      </div>

      {/* Métricas destacadas */}
      {(metricaPrincipal || metricaSecundaria) && (
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexShrink: 0,
          }}
        >
          {metricaPrincipal && (
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-terracotta)',
                  lineHeight: 1.1,
                }}
              >
                {metricaPrincipal.valor}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
                {metricaPrincipal.etiqueta}
              </div>
            </div>
          )}

          {metricaSecundaria && (
            <div
              style={{
                textAlign: 'right',
                borderLeft: '1px solid var(--color-border-light)',
                paddingLeft: '1.5rem',
              }}
            >
              <div
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-blue-ink)',
                  lineHeight: 1.1,
                }}
              >
                {metricaSecundaria.valor}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
                {metricaSecundaria.etiqueta}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
