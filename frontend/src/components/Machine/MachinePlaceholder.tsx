import React from 'react';
import { useApp } from '../../context/AppContext';
import { EmptyState, Card, StatusBadge } from '../ui';
import { Cog } from 'lucide-react';
import { ESTACIONES_MAQUINA } from '../../data/narrativa';

export const MachinePlaceholder: React.FC = () => {
  const { setMode } = useApp();

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 1.5rem 5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <EmptyState
        icono={<Cog size={36} color="var(--color-terracotta)" />}
        titulo="La Máquina de Minería (Línea de Producción del Conocimiento)"
        descripcion="La capa interactiva con estaciones de trabajo (Terminal, Biblioteca, Laboratorio, Escritorio y Pizarra), acople visual de piezas y simulación de producción se construirá en la Fase 6 del proyecto."
        accionTexto="Volver al Modo Directo"
        onAccion={() => setMode('direct')}
      />

      {/* Vista previa de las estaciones que entrarán en la Fase 6 */}
      <Card
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0, color: 'var(--color-ink)' }}>
                Arquitectura de Estaciones Planificada para la Fase 6
              </h4>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)' }}>
                Flujo real donde los objetos viajan e interactúan entre estaciones:
              </span>
            </div>
            <StatusBadge status="pendiente" label="En desarrollo para Fase 6" size="sm" />
          </div>
        }
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          {ESTACIONES_MAQUINA.map((est) => (
            <div
              key={est.id}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--color-card-muted)',
                border: '1px dashed var(--color-border)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-blue-ink)', textTransform: 'uppercase' }}>
                {est.subtitulo.split(':')[0]}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-ink)', margin: '0.2rem 0' }}>
                {est.nombre}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)' }}>
                <strong>Entra:</strong> {est.objetoEntrada}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-blue-ink)', marginTop: '0.2rem' }}>
                <strong>Sale:</strong> {est.objetoSalida}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
