import React from 'react';
import type { StatusType } from './StatusBadge';

export interface RouteNode {
  id: string;
  label: string;
  sublabel?: string;
  status: StatusType;
  icon?: React.ReactNode;
}

export interface RoutePathProps {
  nodes: RouteNode[];
  activeNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const RoutePath: React.FC<RoutePathProps> = ({
  nodes,
  activeNodeId,
  onSelectNode,
  className = '',
  style,
}) => {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div
      className={`atlas-route-path ${className}`}
      style={{
        width: '100%',
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem 1.25rem 1.5rem',
        boxShadow: 'var(--shadow-atlas-sm)',
        overflowX: 'auto',
        position: 'relative',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          minWidth: `${Math.max(nodes.length * 140, 560)}px`,
          position: 'relative',
          padding: '0 1rem',
        }}
      >
        {/* Línea SVG conectora detrás de las balizas (nunca toca ni cruza las etiquetas) */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '22px', // Centrado exacto vertical con el pin de 44px (radio 22px)
            left: `calc(100% / (${nodes.length} * 2))`,
            right: `calc(100% / (${nodes.length} * 2))`,
            width: `calc(100% - (100% / ${nodes.length}))`,
            height: '6px',
            zIndex: 1,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          {/* Línea base sutil */}
          <line
            x1="0"
            y1="3"
            x2="100%"
            y2="3"
            stroke="var(--color-border-light)"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          {/* Línea punteada con flujo sutil continuo */}
          <line
            x1="0"
            y1="3"
            x2="100%"
            y2="3"
            stroke="var(--color-terracotta)"
            strokeWidth="1.5"
            strokeDasharray="4,8"
            strokeOpacity="0.4"
            style={{
              animation: 'dashTravel 2.2s linear infinite',
            }}
          />
          {/* Línea trazada al cargar con animación stroke-dashoffset */}
          <line
            x1="0"
            y1="3"
            x2="100%"
            y2="3"
            stroke="var(--color-blue-ink)"
            strokeWidth="2"
            strokeDasharray="600"
            strokeDashoffset="600"
            style={{
              animation: 'drawRoutePath var(--motion-duration-path) var(--motion-ease-path) forwards',
            }}
          />
        </svg>

        {/* Punto viajero que recorre la ruta continuamente */}
        <div
          className="route-traveler-track"
          aria-hidden="true"
          style={{
            left: `calc(100% / (${nodes.length} * 2))`,
            width: `calc(100% - (100% / ${nodes.length}))`,
          }}
        >
          <div className="route-traveler-dot" />
        </div>

        {(() => {
          // Garantizar un único pin con pulso en toda la ruta
          const pulsingNodeId = (() => {
            const actualNode = nodes.find((n) => n.status === 'actual');
            if (actualNode) return actualNode.id;
            if (activeNodeId) return activeNodeId;
            const completedNodes = nodes.filter((n) => n.status === 'completado');
            if (completedNodes.length > 0) return completedNodes[completedNodes.length - 1].id;
            return nodes[0]?.id;
          })();

          return nodes.map((node, index) => {
            const isSelected = activeNodeId === node.id;
            const isPulsing = node.id === pulsingNodeId;
            const isActual = node.status === 'actual';

            // Paleta semántica por estado según AGENTS.md §9
            const nodeColorMap: Record<StatusType, { fill: string; stroke: string; text: string; bg: string }> = {
              completado: {
                fill: 'var(--color-blue-ink)',
                stroke: 'var(--color-blue-ink)',
                text: 'var(--color-blue-ink)',
                bg: 'var(--color-blue-soft)',
              },
              actual: {
                fill: 'var(--color-terracotta)',
                stroke: 'var(--color-terracotta)',
                text: 'var(--color-terracotta-dark)',
                bg: 'var(--color-terracotta-soft)',
              },
              pendiente: {
                fill: 'var(--color-card)',
                stroke: 'var(--color-border)',
                text: 'var(--color-ink-secondary)',
                bg: 'var(--color-card-muted)',
              },
              bloqueado: {
                fill: 'var(--color-card-muted)',
                stroke: 'var(--color-border-disabled)',
                text: 'var(--color-ink-disabled)',
                bg: 'var(--color-paper)',
              },
            };

            const colors = nodeColorMap[node.status];

            return (
              <div
                key={node.id}
                onClick={() => onSelectNode && onSelectNode(node.id)}
                role={onSelectNode ? 'button' : undefined}
                tabIndex={onSelectNode ? 0 : undefined}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  zIndex: 2,
                  cursor: onSelectNode ? 'pointer' : 'default',
                  flex: 1,
                  maxWidth: '180px',
                  userSelect: 'none',
                  animation: 'cardEntrance var(--motion-duration-normal) var(--motion-ease-out) both',
                  animationDelay: `${index * 80}ms`,
                }}
              >
                {/* Baliza / Pin del nodo (fondo sólido para tapar la línea de fondo de forma limpia) */}
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: colors.bg,
                    border: `2px ${node.status === 'pendiente' ? 'dashed' : 'solid'} ${colors.stroke}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.text,
                    fontWeight: 700,
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-mono)',
                    boxShadow: isSelected
                      ? '0 0 0 3px var(--color-terracotta-soft), var(--shadow-atlas-sm)'
                      : 'var(--shadow-atlas-xs)',
                    animation: isPulsing ? 'pinPulse 2.4s ease-in-out infinite' : undefined,
                    transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
                    position: 'relative',
                  }}
                >
                  {node.icon || index + 1}

                  {/* Marcador de nodo seleccionado */}
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-5px',
                        width: '7px',
                        height: '7px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-terracotta)',
                      }}
                    />
                  )}
                </div>

                {/* Etiqueta del nodo (siempre debajo del pin, sin superposición de líneas) */}
                <div style={{ marginTop: '0.65rem', padding: '0 0.25rem' }}>
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: isActual || isSelected ? 800 : 700,
                      color: colors.text,
                      lineHeight: 1.25,
                    }}
                  >
                    {node.label}
                  </div>
                  {node.sublabel && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-ink-muted)',
                        marginTop: '0.15rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {node.sublabel}
                    </div>
                  )}
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
};
