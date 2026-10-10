import React from 'react';
import { Modal } from './Modal';
import { Button, StatusBadge } from '../ui';
import {
  Cog,
  LayoutDashboard,
  Layers,
  Film,
  Search,
  FileCode2,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Terminal,
  BookMarked,
  FlaskConical,
  FileText,
  Presentation,
  Play,
} from 'lucide-react';
import { type ActiveView } from '../../context/AppContext';

interface ModesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: 'map' | 'direct';
  onSelectMode: (mode: 'map' | 'direct', view?: ActiveView) => void;
}

export const ModesGuideModal: React.FC<ModesGuideModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Guía de Modos: ¿Qué es La Máquina vs. Modo Directo?"
      subtitle="La plataforma cuenta con dos entornos de trabajo diseñados para propósitos diferentes. Elige el que mejor se adapte a tu objetivo:"
      maxWidth="1000px"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem', padding: '0.5rem 0' }}>
        {/* COLUMNA 1: LA MÁQUINA */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-card-muted)',
            border: `2px solid ${currentMode === 'map' ? 'var(--color-terracotta)' : 'var(--color-border)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
            boxShadow: currentMode === 'map' ? '0 0 16px rgba(181, 83, 47, 0.25)' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(181, 83, 47, 0.15)',
                  color: 'var(--color-terracotta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cog size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
                  🏭 La Máquina
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-terracotta)', fontWeight: 700 }}>
                  Línea de Montaje & Fábrica Interactiva
                </span>
              </div>
            </div>
            {currentMode === 'map' && <StatusBadge status="actual" label="Modo Actual" />}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-secondary)', lineHeight: 1.5, margin: 0 }}>
            Es la experiencia <strong>secuencial e interactiva</strong> donde el proceso de minería de datos se vive
            como una línea de producción industrial. Tu pieza de investigación avanza físicamente por 5 puestos de trabajo:
          </p>

          {/* Lista de Funciones de La Máquina */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Funciones Exclusivas de La Máquina:
            </div>

            {[
              {
                icon: <Terminal size={14} />,
                name: '1. Terminal de Consultas',
                desc: 'Ecuaciones de búsqueda bibliográfica booleana.',
              },
              {
                icon: <BookMarked size={14} />,
                name: '2. Biblioteca de Documentos',
                desc: 'Acervo de artículos con DOI y autores canónicos.',
              },
              {
                icon: <FlaskConical size={14} />,
                name: '3. Laboratorio R Nativo',
                desc: 'Ejecución en vivo del script .R con semillas reproducibles.',
              },
              {
                icon: <FileText size={14} />,
                name: '4. Escritorio LaTeX',
                desc: 'Ensamble del manuscrito formal y diapositivas Beamer.',
              },
              {
                icon: <Presentation size={14} />,
                name: '5. Pizarra de Resultados',
                desc: 'Diagnósticos visuales, WCSS, Siluetas y métricas.',
              },
              {
                icon: <Play size={14} />,
                name: '⚡ Botón "Producir Tema"',
                desc: 'Simula el viaje automatizado de la pieza de datos por la banda.',
              },
              {
                icon: <Sparkles size={14} />,
                name: '🎤 Modo Sustentación',
                desc: 'Recorrido de presentación académica con diapositivas guiadas.',
              },
            ].map((f) => (
              <div
                key={f.name}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  padding: '0.45rem 0.65rem',
                  backgroundColor: 'var(--color-card)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span style={{ color: 'var(--color-terracotta)', marginTop: '2px', flexShrink: 0 }}>
                  {f.icon}
                </span>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                    {f.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary)' }}>
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <Button
              variant={currentMode === 'map' ? 'outline' : 'primary'}
              size="md"
              style={{ width: '100%' }}
              onClick={() => {
                onSelectMode('map');
                onClose();
              }}
              icon={<Cog size={16} />}
            >
              {currentMode === 'map' ? 'Ya estás en La Máquina' : 'Entrar a La Máquina'}
            </Button>
          </div>
        </div>

        {/* COLUMNA 2: MODO DIRECTO */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-card-muted)',
            border: `2px solid ${currentMode === 'direct' ? 'var(--color-blue-ink)' : 'var(--color-border)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
            boxShadow: currentMode === 'direct' ? '0 0 16px rgba(37, 99, 235, 0.25)' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-blue-soft)',
                  color: 'var(--color-blue-ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LayoutDashboard size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
                  🧭 Modo Directo
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-blue-ink)', fontWeight: 700 }}>
                  Suite Analítica & Navegación Libre
                </span>
              </div>
            </div>
            {currentMode === 'direct' && <StatusBadge status="completado" label="Modo Actual" />}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-secondary)', lineHeight: 1.5, margin: 0 }}>
            Es la suite de <strong>acceso libre e instantáneo</strong> para consultar directamente cualquier recurso,
            informe o herramienta del sistema sin tener que pasar por la línea de ensamblaje:
          </p>

          {/* Lista de Vistas del Modo Directo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Herramientas del Modo Directo:
            </div>

            {[
              {
                view: 'dashboard' as ActiveView,
                icon: <LayoutDashboard size={14} />,
                name: 'Dashboard',
                desc: 'Métricas globales del curso, radar de integridad y progreso.',
              },
              {
                view: 'units' as ActiveView,
                icon: <Layers size={14} />,
                name: 'Unidades',
                desc: 'Explorador jerárquico de las 4 Unidades y los 24 Temas con migas de pan.',
              },
              {
                view: 'atlas' as ActiveView,
                icon: <Film size={14} />,
                name: 'Atlas Matemático',
                desc: 'Clips audiovisuales en alta resolución (K-Means, Árboles, Redes).',
              },
              {
                view: 'search' as ActiveView,
                icon: <Search size={14} />,
                name: 'Buscador',
                desc: 'Explorador bibliométrico con 360 ecuaciones booleanas PRISMA.',
              },
              {
                view: 'latex' as ActiveView,
                icon: <FileCode2 size={14} />,
                name: 'Lab LaTeX',
                desc: 'Editor con renderizado KaTeX en vivo y descarga de .tex.',
              },
              {
                view: 'manual' as ActiveView,
                icon: <BookOpen size={14} />,
                name: 'Manual Interactivo',
                desc: 'Guía metodológica con simuladores de algoritmos y flujo.',
              },
            ].map((v) => (
              <div
                key={v.name}
                onClick={() => {
                  onSelectMode('direct', v.view);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.65rem',
                  backgroundColor: 'var(--color-card)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ color: 'var(--color-blue-ink)' }}>{v.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                      {v.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary)' }}>
                      {v.desc}
                    </div>
                  </div>
                </div>
                <ArrowRight size={13} style={{ color: 'var(--color-ink-muted)' }} />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <Button
              variant={currentMode === 'direct' ? 'outline' : 'secondary'}
              size="md"
              style={{ width: '100%' }}
              onClick={() => {
                onSelectMode('direct', 'dashboard');
                onClose();
              }}
              icon={<LayoutDashboard size={16} />}
            >
              {currentMode === 'direct' ? 'Ya estás en Modo Directo' : 'Entrar a Modo Directo (Dashboard)'}
            </Button>
          </div>
        </div>
      </div>

      {/* Resumen Final de Comparación */}
      <div
        style={{
          marginTop: '1.25rem',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--color-card-muted)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.8125rem',
          color: 'var(--color-ink-secondary)',
        }}
      >
        <CheckCircle2 size={18} style={{ color: 'var(--color-success-ink)', flexShrink: 0 }} />
        <span>
          <strong>Regla de oro:</strong> Usa <strong>La Máquina</strong> para vivir el flujo pedagógico y la sustentación
          paso a paso por estaciones. Usa el <strong>Modo Directo</strong> cuando necesites consultar una unidad, leer el manual,
          ver un clip o editar LaTeX rápidamente.
        </span>
      </div>
    </Modal>
  );
};
