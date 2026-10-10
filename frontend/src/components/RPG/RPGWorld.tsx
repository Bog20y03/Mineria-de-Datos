import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import type { UnitId } from '../../types/domain';
import {
  Compass,
  Terminal,
  FileCode2,
  Zap,
  MapPin,
  ChevronRight,
  Info,
} from 'lucide-react';

interface ZoneNode {
  id: UnitId;
  name: string;
  zoneTitle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const ZONES: ZoneNode[] = [
  {
    id: 'UNIDAD_1',
    name: 'Unidad 1: Conceptos',
    zoneTitle: 'Biblioteca Central',
    x: 60,
    y: 80,
    width: 280,
    height: 220,
    color: '#0284c7',
  },
  {
    id: 'UNIDAD_2',
    name: 'Unidad 2: Modelos y Técnicas',
    zoneTitle: 'Taller de Teoría',
    x: 480,
    y: 80,
    width: 280,
    height: 220,
    color: '#38bdf8',
  },
  {
    id: 'UNIDAD_3',
    name: 'Unidad 3: Aplicaciones',
    zoneTitle: 'Laboratorio Experimental',
    x: 60,
    y: 380,
    width: 280,
    height: 220,
    color: '#10b981',
  },
  {
    id: 'UNIDAD_4',
    name: 'Unidad 4: Proyecto Final',
    zoneTitle: 'Sala de Sustentación',
    x: 480,
    y: 380,
    width: 280,
    height: 220,
    color: '#8b5cf6',
  },
];

export const RPGWorld: React.FC = () => {
  const { course, openTopic, setActiveView } = useApp();

  // Posición del investigador (coordenadas 0-820 x 0-680)
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 200, y: 190 });
  const [activeNearby, setActiveNearby] = useState<{
    type: 'topic' | 'terminal' | 'latex';
    unitId?: UnitId;
    topicId?: string;
    label: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Detección de proximidad
  useEffect(() => {
    // Verificar cercanía a zonas y temas
    for (const zone of ZONES) {
      const centerX = zone.x + zone.width / 2;
      const centerY = zone.y + zone.height / 2;
      const dist = Math.hypot(playerPos.x - centerX, playerPos.y - centerY);

      if (dist < 130) {
        const u = course?.unidades.find((unit) => unit.id === zone.id);
        const firstTopic = u?.temas[0]?.id || '';
        setActiveNearby({
          type: 'topic',
          unitId: zone.id,
          topicId: firstTopic,
          label: `${zone.zoneTitle} (Presiona E o Clic)`,
        });
        return;
      }
    }
    setActiveNearby(null);
  }, [playerPos, course]);

  // Controles de teclado WASD y Flechas
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const step = 20;
      let { x, y } = playerPos;

      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(e.code) || e.key === 'ArrowUp') {
        y = Math.max(40, y - step);
      } else if (['ArrowDown', 'KeyS', 's', 'S'].includes(e.code) || e.key === 'ArrowDown') {
        y = Math.min(640, y + step);
      } else if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.code) || e.key === 'ArrowLeft') {
        x = Math.max(40, x - step);
      } else if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.code) || e.key === 'ArrowRight') {
        x = Math.min(780, x + step);
      } else if (e.key === 'e' || e.key === 'E') {
        if (activeNearby) {
          if (activeNearby.type === 'topic' && activeNearby.unitId && activeNearby.topicId) {
            openTopic(activeNearby.unitId, activeNearby.topicId);
          }
        }
      }

      setPlayerPos({ x, y });
    },
    [playerPos, activeNearby, openTopic]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const fastTravelToZone = (zone: ZoneNode) => {
    setPlayerPos({
      x: zone.x + zone.width / 2,
      y: zone.y + zone.height / 2,
    });
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Encabezado y Reglas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Compass size={20} style={{ color: 'var(--c-interactive-hover)' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Campus de Investigación 2D (Modo Mapa)</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Muévete con WASD / Flechas o utiliza el Viaje Rápido para explorar las cuatro zonas académicas.
          </p>
        </div>

        {/* Acceso Rápido a Estaciones */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveView('search')}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem' }}
          >
            <Terminal size={12} />
            Terminal Booleana
          </button>
          <button
            type="button"
            onClick={() => setActiveView('latex')}
            className="btn btn-secondary"
            style={{ fontSize: '0.75rem' }}
          >
            <FileCode2 size={12} />
            Escritorio LaTeX
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(280px, 340px)', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Tablero del Mapa 2D */}
        <div
          ref={containerRef}
          className="card"
          tabIndex={0}
          style={{
            position: 'relative',
            width: '100%',
            height: '660px',
            backgroundColor: '#050a14',
            border: '2px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            outline: 'none',
          }}
        >
          {/* Rejilla de fondo del campus */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              opacity: 0.15,
            }}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Caminos que conectan las 4 zonas */}
            <path
              d="M 200 190 L 620 190 L 620 490 L 200 490 Z"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="8 6"
              opacity="0.3"
            />
          </svg>

          {/* Renderizado de las 4 Zonas del Campus */}
          {ZONES.map((zone) => {
            const u = course?.unidades.find((unit) => unit.id === zone.id);
            return (
              <div
                key={zone.id}
                onClick={() => fastTravelToZone(zone)}
                style={{
                  position: 'absolute',
                  left: `${zone.x}px`,
                  top: `${zone.y}px`,
                  width: `${zone.width}px`,
                  height: `${zone.height}px`,
                  backgroundColor: 'rgba(16, 30, 51, 0.85)',
                  border: `2px solid ${zone.color}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: `0 4px 20px ${zone.color}22`,
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span className="badge" style={{ backgroundColor: `${zone.color}22`, color: zone.color, border: `1px solid ${zone.color}44` }}>
                      {zone.zoneTitle}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {u?.porcentajeApi ?? 0}%
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>
                    {zone.name}
                  </h4>
                </div>

                {/* Lista compacta de temas interactivos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {u?.temas.slice(0, 3).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openTopic(zone.id, t.id);
                      }}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.7rem',
                        textAlign: 'left',
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--text-dim)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {t.nombre}
                    </button>
                  ))}
                  {u && u.temas.length > 3 && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      + {u.temas.length - 3} temas adicionales
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Personaje Investigador (Marcador vectorial limpio) */}
          <div
            style={{
              position: 'absolute',
              left: `${playerPos.x}px`,
              top: `${playerPos.y}px`,
              transform: 'translate(-50%, -50%)',
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#f59e0b',
              border: '3px solid #ffffff',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 30,
              transition: 'left 0.1s ease-out, top 0.1s ease-out',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#070d17' }} />
          </div>

          {/* Indicador de Acción Flotante "E · Acción" */}
          {activeNearby && (
            <div
              style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--bg-surface)',
                border: '2px solid var(--c-interactive)',
                borderRadius: 'var(--radius-full)',
                padding: '0.5rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 40,
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <kbd
                style={{
                  backgroundColor: 'var(--c-interactive)',
                  color: '#fff',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                E
              </kbd>
              <span>{activeNearby.label}</span>
            </div>
          )}
        </div>

        {/* Panel Lateral: Viaje Rápido & Guía */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Viaje Rápido */}
          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Zap size={16} style={{ color: 'var(--c-gold)' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Viaje Rápido (Campus)</h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Haz clic para teletransportar al investigador instantáneamente a cualquier zona:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {ZONES.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => fastTravelToZone(zone)}
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.75rem',
                    fontSize: '0.8rem',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} style={{ color: zone.color }} />
                    <span style={{ fontWeight: 600 }}>{zone.zoneTitle}</span>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Guía de Teclas */}
          <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Info size={16} style={{ color: 'var(--c-interactive-hover)' }} />
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Controles del Mapa</h4>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              <li><strong>WASD / Flechas:</strong> Movimiento por el campus</li>
              <li><strong>Tecla E:</strong> Interactuar con la zona cercana</li>
              <li><strong>Clic en estación:</strong> Abrir contenido temático real</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
