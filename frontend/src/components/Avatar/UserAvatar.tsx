import React, { useState, useEffect } from 'react';
import {
  getUserProfileConfig,
  type UserProfileConfig,
  type AvatarPresetId,
} from '../../services/avatarService';

export interface UserAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  config?: UserProfileConfig;
  interactive?: boolean;
  showStatusDot?: boolean;
  showBorder?: boolean;
  borderWidth?: number;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

const SIZE_MAP: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number> = {
  xs: 24,
  sm: 34,
  md: 46,
  lg: 68,
  xl: 96,
};

function getInitials(name: string): string {
  if (!name) return 'IN';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'IN';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Renderizador de SVGs vectoriales para cada uno de los 6 presets temáticos
 */
const PresetSvgIcon: React.FC<{ presetId: AvatarPresetId; size: number }> = ({ presetId, size }) => {
  switch (presetId) {
    case 'cientifico':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="c_grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#9A3412" />
            </linearGradient>
            <radialGradient id="c_bubble" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F97316" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" rx="50" fill="url(#c_grad)" />
          {/* Matraz y datos */}
          <path
            d="M44 26 L56 26 L56 42 L72 68 C75 73 71 80 65 80 L35 80 C29 80 25 73 28 68 L44 42 Z"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <line x1="42" y1="26" x2="58" y2="26" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          {/* Líquido burbujeante con letra R */}
          <path d="M33 74 C38 65 62 65 67 74 L35 74 Z" fill="url(#c_bubble)" opacity="0.85" />
          <circle cx="50" cy="58" r="3.5" fill="#FFFFFF" />
          <circle cx="43" cy="67" r="2.5" fill="#FEF08A" />
          <circle cx="57" cy="65" r="2.5" fill="#FEF08A" />
          {/* Insignia R */}
          <text
            x="50"
            y="40"
            textAnchor="middle"
            fill="#FEF08A"
            fontSize="14"
            fontFamily="monospace"
            fontWeight="bold"
          >
            R
          </text>
        </svg>
      );

    case 'documentalista':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="d_grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="50" fill="url(#d_grad)" />
          {/* Libro / pergamino abierto */}
          <path
            d="M50 35 C42 30 30 30 22 34 L22 70 C30 66 42 66 50 71 C58 66 70 66 78 70 L78 34 C70 30 58 30 50 35 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
          <line x1="50" y1="35" x2="50" y2="71" stroke="#064E3B" strokeWidth="2.5" />
          {/* Líneas de texto académico */}
          <line x1="28" y1="44" x2="44" y2="44" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="52" x2="44" y2="52" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="60" x2="38" y2="60" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          <line x1="56" y1="44" x2="72" y2="44" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          <line x1="56" y1="52" x2="72" y2="52" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          {/* Pluma de investigación */}
          <path
            d="M66 22 C60 25 58 31 54 38 L58 40 C62 34 68 30 72 20 Z"
            fill="#FDE047"
          />
        </svg>
      );

    case 'ingeniero':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="i_grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="50" fill="url(#i_grad)" />
          {/* Pila de Base de Datos / Cubos OLAP */}
          {/* Disco 1 Superior */}
          <ellipse cx="50" cy="34" rx="26" ry="9" fill="#E0F2FE" />
          {/* Disco 2 Medio */}
          <path d="M24 34 L24 49 C24 54 36 58 50 58 C64 58 76 54 76 49 L76 34" fill="none" stroke="#BAE6FD" strokeWidth="3" />
          {/* Disco 3 Inferior */}
          <path d="M24 49 L24 64 C24 69 36 73 50 73 C64 73 76 69 76 64 L76 49" fill="none" stroke="#38BDF8" strokeWidth="3" />
          {/* Líneas de flujo / ETL */}
          <circle cx="50" cy="34" r="3" fill="#0284C7" />
          <line x1="33" y1="67" x2="33" y2="78" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="73" x2="50" y2="82" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="67" y1="67" x2="67" y2="78" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="33" cy="79" r="2.5" fill="#FFFFFF" />
          <circle cx="50" cy="83" r="2.5" fill="#FFFFFF" />
          <circle cx="67" cy="79" r="2.5" fill="#FFFFFF" />
        </svg>
      );

    case 'ia':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="ia_grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#4C1D95" />
            </linearGradient>
            <radialGradient id="ia_core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#A855F7" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" rx="50" fill="url(#ia_grad)" />
          {/* Conexiones sinápticas */}
          <line x1="28" y1="36" x2="50" y2="50" stroke="#DDD6FE" strokeWidth="2" strokeOpacity="0.7" />
          <line x1="28" y1="64" x2="50" y2="50" stroke="#DDD6FE" strokeWidth="2" strokeOpacity="0.7" />
          <line x1="50" y1="50" x2="72" y2="34" stroke="#DDD6FE" strokeWidth="2" strokeOpacity="0.7" />
          <line x1="50" y1="50" x2="72" y2="66" stroke="#DDD6FE" strokeWidth="2" strokeOpacity="0.7" />
          <line x1="28" y1="36" x2="28" y2="64" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="72" y1="34" x2="72" y2="66" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Capa de Entrada */}
          <circle cx="28" cy="36" r="6" fill="#F3E8FF" stroke="#A855F7" strokeWidth="2" />
          <circle cx="28" cy="64" r="6" fill="#F3E8FF" stroke="#A855F7" strokeWidth="2" />
          {/* Capa Oculta / Núcleo */}
          <circle cx="50" cy="50" r="11" fill="url(#ia_core)" />
          <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
          {/* Capa de Salida */}
          <circle cx="72" cy="34" r="6.5" fill="#FDF2F8" stroke="#EC4899" strokeWidth="2" />
          <circle cx="72" cy="66" r="6.5" fill="#FDF2F8" stroke="#EC4899" strokeWidth="2" />
        </svg>
      );

    case 'explorador':
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="ex_grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DB2777" />
              <stop offset="100%" stopColor="#831843" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="50" fill="url(#ex_grad)" />
          {/* Poliedro Cartesiano / Brújula Atlas */}
          {/* Círculo graduado */}
          <circle cx="50" cy="50" r="30" fill="none" stroke="#FCE7F3" strokeWidth="2" strokeDasharray="4 3" opacity="0.8" />
          {/* Aguja Norte / Sur */}
          <polygon points="50,22 56,47 50,43 44,47" fill="#FFFFFF" />
          <polygon points="50,78 56,53 50,57 44,53" fill="#F472B6" />
          <circle cx="50" cy="50" r="4.5" fill="#FFFFFF" stroke="#831843" strokeWidth="1.5" />
          {/* Marcas de los cuatro cuadrantes */}
          <line x1="50" y1="16" x2="50" y2="21" stroke="#FCE7F3" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="79" x2="50" y2="84" stroke="#FCE7F3" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="50" x2="21" y2="50" stroke="#FCE7F3" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="79" y1="50" x2="84" y2="50" stroke="#FCE7F3" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'academico':
    default:
      return (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="ac_grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="50" fill="url(#ac_grad)" />
          {/* Birrete Académico */}
          <polygon points="50,28 78,41 50,53 22,41" fill="#FEF3C7" />
          <polygon points="34,47 34,63 50,70 66,63 66,47 50,54" fill="#FDE68A" />
          {/* Borla dorada */}
          <line x1="50" y1="41" x2="72" y2="44" stroke="#FEF08A" strokeWidth="2" />
          <line x1="72" y1="44" x2="72" y2="60" stroke="#FEF08A" strokeWidth="2" />
          <circle cx="72" cy="62" r="3" fill="#FEF08A" />
          {/* Corona de Laurel en la base */}
          <path
            d="M32 75 C36 81 64 81 68 75"
            fill="none"
            stroke="#FEF3C7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      );
  }
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  size = 'md',
  config: externalConfig,
  interactive = false,
  showStatusDot = false,
  showBorder = true,
  borderWidth = 2,
  onClick,
  className = '',
  style = {},
  title,
}) => {
  const [profile, setProfile] = useState<UserProfileConfig>(() => externalConfig || getUserProfileConfig());

  useEffect(() => {
    if (externalConfig) {
      setProfile(externalConfig);
      return;
    }
    const updateHandler = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfileConfig>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
      } else {
        setProfile(getUserProfileConfig());
      }
    };
    window.addEventListener('md_profile_updated', updateHandler);
    return () => {
      window.removeEventListener('md_profile_updated', updateHandler);
    };
  }, [externalConfig]);

  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 42;
  const statusDotSize = Math.max(6, Math.round(pixelSize * 0.22));

  const resolvedBorder = showBorder
    ? `${borderWidth}px solid ${profile.accentColor || '#0284c7'}`
    : 'none';

  return (
    <div
      className={`user-avatar-wrapper ${className}`}
      onClick={onClick}
      title={title || `${profile.name} (${profile.role})`}
      style={{
        position: 'relative',
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        cursor: interactive ? 'pointer' : 'default',
        boxShadow: interactive
          ? `0 2px 10px ${profile.accentColor ? `${profile.accentColor}44` : 'rgba(0,0,0,0.15)'}`
          : 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          border: resolvedBorder,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0F172A',
        }}
      >
        {profile.avatarType === 'custom' && profile.customUrl ? (
          <img
            src={profile.customUrl}
            alt={profile.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : profile.avatarType === 'initials' ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `radial-gradient(circle at 35% 35%, ${profile.accentColor || '#0284C7'}, #090D16)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: `${Math.round(pixelSize * 0.38)}px`,
              letterSpacing: '0.04em',
              userSelect: 'none',
              fontFamily: 'var(--font-sans, system-ui, sans-serif)',
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }}
          >
            {getInitials(profile.name)}
          </div>
        ) : (
          <PresetSvgIcon presetId={profile.presetId || 'cientifico'} size={pixelSize} />
        )}
      </div>

      {showStatusDot && (
        <span
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: `${statusDotSize}px`,
            height: `${statusDotSize}px`,
            borderRadius: '50%',
            backgroundColor: '#10B981',
            border: '2px solid #0F172A',
            boxShadow: '0 0 6px #10B981',
            display: 'block',
          }}
        />
      )}
    </div>
  );
};
