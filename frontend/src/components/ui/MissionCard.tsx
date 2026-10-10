import React from 'react';
import { Card } from './Card';
import { StatusBadge, type StatusType } from './StatusBadge';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';
import { FileText, Clapperboard, CheckCircle, Database } from 'lucide-react';

export interface MissionCardProps {
  id: string;
  unidadNumero: number;
  temaNumero: number;
  titulo: string;
  encargo: string;
  estado: 'completada' | 'en_curso' | 'pendiente';
  progresoPorcentaje?: number;
  pistas: {
    documentosCount: number;
    tieneVideoClip?: boolean;
  };
  evidencias: {
    tieneResultados: boolean;
    tieneScriptR: boolean;
    tieneLatex: boolean;
  };
  onAbrir?: (missionId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  id,
  unidadNumero,
  temaNumero,
  titulo,
  encargo,
  estado,
  progresoPorcentaje = 0,
  pistas,
  evidencias,
  onAbrir,
  className = '',
  style,
}) => {
  const statusBadgeMap: Record<'completada' | 'en_curso' | 'pendiente', StatusType> = {
    completada: 'completado',
    en_curso: 'actual',
    pendiente: 'pendiente',
  };

  const statusLabelMap = {
    completada: 'Misión Completada',
    en_curso: 'Misión en Curso',
    pendiente: 'Misión Pendiente',
  };

  return (
    <Card
      variant={estado === 'pendiente' ? 'dashed' : 'default'}
      className={`atlas-mission-card ${className}`}
      style={{
        borderLeft:
          estado === 'en_curso'
            ? '4px solid var(--color-terracotta)'
            : estado === 'completada'
            ? '4px solid var(--color-blue-ink)'
            : undefined,
        ...style,
      }}
      header={
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: 'var(--color-ink-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Unidad {unidadNumero} · Tema {temaNumero} · [{id}]
            </span>
            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                color: 'var(--color-ink)',
                margin: '0.2rem 0 0',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {titulo}
            </h3>
          </div>
          <StatusBadge
            status={statusBadgeMap[estado]}
            label={statusLabelMap[estado]}
            size="sm"
          />
        </div>
      }
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ flex: 1, maxWidth: '200px' }}>
            <ProgressBar
              percentage={progresoPorcentaje}
              size="sm"
              variant={estado === 'en_curso' ? 'terracotta' : 'blue'}
              showPercentageText={false}
            />
          </div>
          <Button
            variant={estado === 'en_curso' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onAbrir && onAbrir(id)}
          >
            {estado === 'completada' ? 'Revisar Evidencias' : 'Abrir Misión'}
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Encargo de la misión */}
        <div>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-terracotta-dark)', textTransform: 'uppercase' }}>
            Encargo Académico:
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)', marginTop: '0.2rem', margin: 0 }}>
            {encargo}
          </p>
        </div>

        {/* Pistas y Evidencias */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid var(--color-border-light)',
          }}
        >
          {/* Pistas */}
          <div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
              Pistas Documentales:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.3rem', fontSize: 'var(--text-xs)', color: 'var(--color-ink)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FileText size={14} color="var(--color-blue-ink)" /> {pistas.documentosCount} docs
              </span>
              {pistas.tieneVideoClip && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clapperboard size={14} color="var(--color-terracotta)" /> Clip Animado
                </span>
              )}
            </div>
          </div>

          {/* Evidencias */}
          <div>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
              Evidencias Generadas:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.3rem', fontSize: 'var(--text-xs)' }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  color: evidencias.tieneScriptR ? 'var(--color-blue-ink)' : 'var(--color-ink-disabled)',
                }}
              >
                <Database size={13} /> R
              </span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  color: evidencias.tieneResultados ? 'var(--color-blue-ink)' : 'var(--color-ink-disabled)',
                }}
              >
                <CheckCircle size={13} /> Gráficas
              </span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  color: evidencias.tieneLatex ? 'var(--color-blue-ink)' : 'var(--color-ink-disabled)',
                }}
              >
                <FileText size={13} /> LaTeX
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
