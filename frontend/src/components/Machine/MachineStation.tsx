import React from 'react';
import type { StationId, StationStatus } from './types';
import {
  Terminal,
  BookOpen,
  FlaskConical,
  FileText,
  Presentation,
  Check,
} from 'lucide-react';

interface MachineStationProps {
  id: StationId;
  name: string;
  role: string;
  summary: string; // Máximo 2 líneas
  realMetric: string;
  status: StationStatus;
  isActive: boolean;
  isProcessing?: boolean;
  onClick: () => void;
}

export const MachineStation: React.FC<MachineStationProps> = ({
  id,
  name,
  role,
  summary,
  realMetric,
  status,
  isActive,
  isProcessing = false,
  onClick,
}) => {
  // Lámpara de estado
  const getLampColor = () => {
    if (status === 'completada') return 'var(--color-blue-ink)';
    if (status === 'activa' || isProcessing) return 'var(--color-terracotta)';
    return 'var(--color-ink-disabled)';
  };

  const getLampClass = () => {
    if (isProcessing) return 'station-lamp-processing';
    if (isActive) return 'station-lamp-active';
    if (status === 'completada') return 'station-light-up';
    return '';
  };

  // SVG Ilustrativo por Estación con detalles mecánicos de Atlas
  const renderMachineSVG = () => {
    switch (id) {
      case 'terminal':
        return (
          <svg width="68" height="60" viewBox="0 0 68 60" fill="none">
            {/* Monitor / Chasis */}
            <rect x="8" y="6" width="52" height="38" rx="4" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1.5" />
            <rect x="14" y="11" width="40" height="26" rx="2" fill="#1F2A3C" />
            {/* Líneas de código fósforo */}
            <line x1="18" y1="18" x2="36" y2="18" stroke="#D9CFBB" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="24" x2="48" y2="24" stroke="var(--color-terracotta)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="18" y1="30" x2="30" y2="30" stroke="#8C8474" strokeWidth="1.5" strokeLinecap="round" />
            {/* Base y teclado */}
            <path d="M26 44 L42 44 L46 54 L22 54 Z" fill="var(--color-card-muted)" stroke="var(--color-border)" strokeWidth="1.5" />
          </svg>
        );

      case 'biblioteca':
        return (
          <svg width="68" height="60" viewBox="0 0 68 60" fill="none">
            {/* Mueble / Archivero */}
            <rect x="10" y="8" width="48" height="46" rx="3" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1.5" />
            {/* Estantes con lomos de libros y ficheros */}
            <rect x="15" y="14" width="7" height="16" rx="1" fill="var(--color-blue-soft)" stroke="var(--color-blue-ink)" strokeWidth="1" />
            <rect x="23" y="16" width="6" height="14" rx="1" fill="var(--color-card-muted)" stroke="var(--color-border)" strokeWidth="1" />
            <rect x="30" y="13" width="8" height="17" rx="1" fill="var(--color-terracotta-soft)" stroke="var(--color-terracotta)" strokeWidth="1" />
            <rect x="39" y="15" width="7" height="15" rx="1" fill="var(--color-blue-soft)" stroke="var(--color-blue-ink)" strokeWidth="1" />
            <rect x="47" y="17" width="6" height="13" rx="1" fill="var(--color-card-muted)" stroke="var(--color-border)" strokeWidth="1" />
            {/* Divisoria horizontal */}
            <line x1="10" y1="34" x2="58" y2="34" stroke="var(--color-border)" strokeWidth="1.5" />
            {/* Cajones inferiores con tirador */}
            <rect x="16" y="38" width="16" height="10" rx="1" fill="var(--color-card-muted)" stroke="var(--color-border)" strokeWidth="1" />
            <circle cx="24" cy="43" r="1.5" fill="var(--color-ink)" />
            <rect x="36" y="38" width="16" height="10" rx="1" fill="var(--color-card-muted)" stroke="var(--color-border)" strokeWidth="1" />
            <circle cx="44" cy="43" r="1.5" fill="var(--color-ink)" />
          </svg>
        );

      case 'laboratorio':
        return (
          <svg width="68" height="60" viewBox="0 0 68 60" fill="none">
            {/* Cámara de computación R */}
            <rect x="8" y="10" width="52" height="42" rx="4" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1.5" />
            {/* Matraz o reactor central */}
            <path d="M26 18 L26 24 L19 38 C18 40 20 42 23 42 L39 42 C42 42 44 40 43 38 L36 24 L36 18 Z" fill="var(--color-terracotta-soft)" stroke="var(--color-terracotta)" strokeWidth="1.2" />
            {/* Nivel de fluido experimental */}
            <path d="M21 35 Q31 38 41 35 L42 40 L20 40 Z" fill="var(--color-terracotta)" opacity="0.6" />
            {/* Engranaje giratorio de cómputo */}
            <g className={isProcessing ? 'gear-active' : undefined}>
              <circle cx="50" cy="22" r="6" stroke="var(--color-ink-secondary)" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
              <circle cx="50" cy="22" r="2" fill="var(--color-ink)" />
            </g>
          </svg>
        );

      case 'escritorio':
        return (
          <svg width="68" height="60" viewBox="0 0 68 60" fill="none">
            {/* Prensa tipográfica LaTeX */}
            <rect x="10" y="10" width="48" height="42" rx="3" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1.5" />
            {/* Rodillo de impresión */}
            <rect x="18" y="16" width="32" height="8" rx="2" fill="var(--color-blue-soft)" stroke="var(--color-blue-ink)" strokeWidth="1.2" />
            {/* Hoja de manuscrito saliente */}
            <rect x="22" y="26" width="24" height="22" rx="1" fill="#FFFFFF" stroke="var(--color-border)" strokeWidth="1" />
            <line x1="26" y1="31" x2="38" y2="31" stroke="var(--color-ink)" strokeWidth="1" />
            <line x1="26" y1="35" x2="42" y2="35" stroke="var(--color-ink-secondary)" strokeWidth="1" />
            <line x1="26" y1="39" x2="34" y2="39" stroke="var(--color-terracotta)" strokeWidth="1" />
          </svg>
        );

      case 'pizarra':
        return (
          <svg width="68" height="60" viewBox="0 0 68 60" fill="none">
            {/* Marco de sustentación */}
            <rect x="6" y="8" width="56" height="40" rx="3" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1.5" />
            {/* Tablero interno */}
            <rect x="10" y="12" width="48" height="32" rx="2" fill="var(--color-card-muted)" />
            {/* Gráfico y sello de aprobación */}
            <polyline points="14,36 24,28 32,32 44,18 52,22" fill="none" stroke="var(--color-blue-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="44" cy="18" r="2.5" fill="var(--color-terracotta)" />
            {/* Sello de sustentación */}
            <circle cx="20" cy="20" r="4" stroke="var(--color-terracotta)" strokeWidth="1" strokeDasharray="2 1" />
            {/* Soporte trípode */}
            <line x1="22" y1="48" x2="16" y2="56" stroke="var(--color-border)" strokeWidth="1.5" />
            <line x1="46" y1="48" x2="52" y2="56" stroke="var(--color-border)" strokeWidth="1.5" />
          </svg>
        );
    }
  };

  const getStationIcon = () => {
    switch (id) {
      case 'terminal':
        return <Terminal size={14} />;
      case 'biblioteca':
        return <BookOpen size={14} />;
      case 'laboratorio':
        return <FlaskConical size={14} />;
      case 'escritorio':
        return <FileText size={14} />;
      case 'pizarra':
        return <Presentation size={14} />;
    }
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="machine-station-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        minWidth: '160px',
        maxWidth: '220px',
        padding: '0.85rem 0.65rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: isActive ? 'var(--color-card)' : 'var(--color-card-muted)',
        border: `1.5px solid ${
          isActive
            ? 'var(--color-terracotta)'
            : status === 'completada'
            ? 'var(--color-blue-ink)'
            : 'var(--color-border)'
        }`,
        boxShadow: isActive
          ? '0 6px 16px rgba(234, 88, 12, 0.22)'
          : status === 'completada'
          ? '0 4px 12px rgba(37, 99, 235, 0.16)'
          : 'var(--shadow-atlas-xs)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
        userSelect: 'none',
      }}
      title={`Clic para inspeccionar Estación: ${name}`}
    >
      {/* 1. Lámpara de Estado Superior (Baliza) */}
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
        }}
      >
        <div
          className={getLampClass()}
          style={{
            width: '18px',
            height: '18px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: getLampColor(),
            border: '2px solid var(--color-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 800,
          }}
        >
          {status === 'completada' && <Check size={11} strokeWidth={3} />}
        </div>
      </div>

      {/* 2. Avatar Operador Marcador si está activa */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            top: '-28px',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-terracotta)',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: 6,
          }}
        >
          Operador ▼
        </div>
      )}

      {/* 3. Módulo Máquina SVG */}
      <div style={{ marginTop: '0.4rem', marginBottom: '0.35rem' }}>
        {renderMachineSVG()}
      </div>

      {/* 4. Encabezado con Icono y Nombre */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
        <span
          style={{
            color: isActive
              ? 'var(--color-terracotta)'
              : status === 'completada'
              ? 'var(--color-blue-ink)'
              : 'var(--color-ink-secondary)',
          }}
        >
          {getStationIcon()}
        </span>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 800,
            color: isActive
              ? 'var(--color-terracotta-dark)'
              : status === 'completada'
              ? 'var(--color-blue-ink)'
              : 'var(--color-ink)',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}
        >
          {name}
        </span>
      </div>

      {/* 5. Rol o Función */}
      <div
        style={{
          fontSize: '10px',
          fontWeight: 700,
          color: 'var(--color-ink-muted)',
          marginBottom: '0.35rem',
          textTransform: 'uppercase',
        }}
      >
        {role}
      </div>

      {/* 6. Breve explicación (Máximo 2 líneas de texto según Requisito 7) */}
      <div
        style={{
          fontSize: '11px',
          color: 'var(--color-ink-secondary)',
          lineHeight: 1.35,
          textAlign: 'center',
          height: '2.7em',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          marginBottom: '0.45rem',
        }}
      >
        {summary}
      </div>

      {/* 7. Métrica o Artefacto Real */}
      <div
        style={{
          width: '100%',
          padding: '0.3rem 0.5rem',
          borderRadius: 'var(--radius-xs)',
          backgroundColor: isActive
            ? 'var(--color-terracotta-soft)'
            : status === 'completada'
            ? 'var(--color-blue-soft)'
            : 'var(--color-card)',
          border: `1px solid ${
            isActive
              ? 'rgba(181, 83, 47, 0.25)'
              : status === 'completada'
              ? 'rgba(31, 58, 95, 0.2)'
              : 'var(--color-border-light)'
          }`,
          textAlign: 'center',
          fontSize: '10.5px',
          fontWeight: 700,
          color: isActive
            ? 'var(--color-terracotta)'
            : status === 'completada'
            ? 'var(--color-blue-ink)'
            : 'var(--color-ink-secondary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontFamily: 'var(--font-mono)',
        }}
        title={realMetric}
      >
        {realMetric}
      </div>
    </div>
  );
};
