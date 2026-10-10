import React from 'react';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import { ArrowRight, Terminal, BookOpen, FlaskConical, FileText, Presentation } from 'lucide-react';
import type { StationNarrative } from '../../data/narrativa';

export type StationCardState = 'activa' | 'disponible' | 'bloqueada';

export interface StationCardProps {
  station: StationNarrative;
  state: StationCardState;
  onAction?: (stationId: string) => void;
  actionLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  state,
  onAction,
  actionLabel = 'Operar Estación',
  className = '',
  style,
}) => {
  const iconMap: Record<string, React.ReactNode> = {
    Terminal: <Terminal size={22} />,
    BookOpen: <BookOpen size={22} />,
    FlaskConical: <FlaskConical size={22} />,
    FileText: <FileText size={22} />,
    Presentation: <Presentation size={22} />,
  };

  const badgeState =
    state === 'activa' ? 'actual' : state === 'disponible' ? 'completado' : 'bloqueado';

  const badgeText =
    state === 'activa' ? 'En Operación' : state === 'disponible' ? 'Disponible' : 'Bloqueada';

  return (
    <Card
      variant={state === 'bloqueada' ? 'dashed' : 'default'}
      className={`atlas-station-card ${className}`}
      style={{
        opacity: state === 'bloqueada' ? 0.75 : 1,
        borderColor: state === 'activa' ? 'var(--color-terracotta)' : undefined,
        boxShadow: state === 'activa' ? '0 0 0 1px var(--color-terracotta), var(--shadow-atlas-md)' : undefined,
        ...style,
      }}
      header={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor:
                  state === 'activa' ? 'var(--color-terracotta-soft)' : 'var(--color-blue-soft)',
                color:
                  state === 'activa' ? 'var(--color-terracotta)' : 'var(--color-blue-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {iconMap[station.icono] || <Terminal size={20} />}
            </div>
            <div>
              <h4
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 700,
                  color: 'var(--color-ink)',
                  margin: 0,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {station.nombre}
              </h4>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)' }}>
                {station.subtitulo}
              </span>
            </div>
          </div>
          <StatusBadge status={badgeState} label={badgeText} size="sm" />
        </div>
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant={state === 'activa' ? 'primary' : state === 'disponible' ? 'secondary' : 'outline'}
            size="sm"
            disabled={state === 'bloqueada'}
            onClick={() => onAction && onAction(station.id)}
          >
            {actionLabel}
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Descripción funcional */}
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)', margin: 0 }}>
          {station.queOcurre}
        </p>

        {/* Flujo de transformación de piezas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 0.75rem',
            backgroundColor: 'var(--color-card-muted)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          {/* Objeto entrada */}
          <div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
              Entra:
            </div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-ink)', marginTop: '0.15rem' }}>
              {station.objetoEntrada}
            </div>
          </div>

          {/* Flecha indicadora */}
          <div style={{ color: 'var(--color-ink-muted)', display: 'flex', alignItems: 'center' }}>
            <ArrowRight size={16} />
          </div>

          {/* Objeto salida */}
          <div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
              Sale:
            </div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-blue-ink)', marginTop: '0.15rem' }}>
              {station.objetoSalida}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
