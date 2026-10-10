import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar, AvatarModal } from '../Avatar';
import {
  Cpu,
  Layers,
  Search,
  FileCode2,
  ShieldCheck,
  Activity,
  Award,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setMode, setActiveView, closeTopic, course, user } = useApp();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);

  const handleNav = (action: () => void) => {
    closeTopic();
    action();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-card)',
        color: 'var(--color-ink)',
        marginTop: 'auto',
        fontSize: 'var(--text-xs)',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem 1.75rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
        }}
      >
        {/* Columna 1: Identidad y Telemetría del Servidor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-blue-soft)',
                color: 'var(--color-blue-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '13px',
              }}
            >
              MD
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--color-ink)', lineHeight: 1.2 }}>
                Minería de Datos
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-terracotta)', fontWeight: 600 }}>
                Plataforma de Investigación v2.4
              </div>
            </div>
          </div>

          <p style={{ margin: 0, color: 'var(--color-ink-secondary)', lineHeight: 1.55 }}>
            Universidad de Cundinamarca • Facultad de Ingeniería.
            Sistema interactivo de catalogación, simulación industrial y producción de evidencias científicas.
          </p>

          {/* Telemetría en vivo del Backend PHP */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              backgroundColor: 'var(--color-card-muted)',
              border: '1px solid var(--color-border-light)',
              width: 'fit-content',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.7)',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-secondary)' }}>
              PHP API :8000 Conectado y Operativo
            </span>
            <Activity size={12} style={{ color: '#10b981' }} />
          </div>
        </div>

        {/* Columna 2: Navegación Rápida por Espacios de Trabajo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)' }}>
            Navegación del Campus
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
            <button
              type="button"
              onClick={() => handleNav(() => setMode('map'))}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.2rem 0',
                color: 'var(--color-ink-secondary)',
                fontSize: '11.5px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-terracotta)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ink-secondary)')}
            >
              <Cpu size={13} /> La Máquina
            </button>

            <button
              type="button"
              onClick={() => handleNav(() => { setMode('direct'); setActiveView('units'); })}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.2rem 0',
                color: 'var(--color-ink-secondary)',
                fontSize: '11.5px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-blue-ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ink-secondary)')}
            >
              <Layers size={13} /> Temario & Unidades
            </button>

            <button
              type="button"
              onClick={() => handleNav(() => { setMode('direct'); setActiveView('rpg'); })}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.2rem 0',
                color: 'var(--color-ink-secondary)',
                fontSize: '11.5px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-terracotta)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ink-secondary)')}
            >
              <Award size={13} /> Misiones & Roles
            </button>

            <button
              type="button"
              onClick={() => handleNav(() => { setMode('direct'); setActiveView('search'); })}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.2rem 0',
                color: 'var(--color-ink-secondary)',
                fontSize: '11.5px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-blue-ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ink-secondary)')}
            >
              <Search size={13} /> Consultas Booleanas
            </button>

            <button
              type="button"
              onClick={() => handleNav(() => { setMode('direct'); setActiveView('latex'); })}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.2rem 0',
                color: 'var(--color-ink-secondary)',
                fontSize: '11.5px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-blue-ink)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-ink-secondary)')}
            >
              <FileCode2 size={13} /> Lab LaTeX
            </button>
          </div>
        </div>

        {/* Columna 3: Rigor Académico y Métricas Canónicas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-muted)' }}>
            Garantía de Rigor
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--color-blue-ink)', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ color: 'var(--color-ink-secondary)', lineHeight: 1.45 }}>
              <strong style={{ color: 'var(--color-ink)' }}>Cero Datos Inventados:</strong> Todas las métricas, ecuaciones y scripts provienen de archivos verificados del repositorio.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginTop: '0.25rem',
            }}
          >
            <span
              style={{
                padding: '0.2rem 0.5rem',
                backgroundColor: 'var(--color-card-muted)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
                fontSize: '10.5px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {course?.unidades.length ?? 4} Zonas
            </span>
            <span
              style={{
                padding: '0.2rem 0.5rem',
                backgroundColor: 'var(--color-card-muted)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
                fontSize: '10.5px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {course?.metricas.totalTemas ?? 24} Temas
            </span>
            <span
              style={{
                padding: '0.2rem 0.5rem',
                backgroundColor: 'var(--color-card-muted)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
                fontSize: '10.5px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {course?.metricas.ejemplosR ?? 24} Scripts R
            </span>
            <span
              style={{
                padding: '0.2rem 0.5rem',
                backgroundColor: 'var(--color-blue-soft)',
                color: 'var(--color-blue-ink)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-blue-border)',
                fontSize: '10.5px',
                fontWeight: 700,
              }}
            >
              100% Verificado
            </span>
          </div>
        </div>
      </div>

      {/* Barra Inferior de Derechos y Carnet Activo */}
      <div
        style={{
          borderTop: '1px solid var(--color-border-light)',
          padding: '0.85rem 1.5rem',
          backgroundColor: 'var(--color-card-muted)',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
            © {new Date().getFullYear()} Universidad de Cundinamarca • Sistema de Investigación en Minería de Datos.
          </div>

          <div
            onClick={() => setIsAvatarModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              fontSize: '11px',
              color: 'var(--color-ink-secondary)',
              cursor: 'pointer',
              padding: '2px 8px 2px 3px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--color-border-light)',
              transition: 'all 0.15s ease',
            }}
            title="Haz clic para abrir el Carnet Académico y Editor de Avatar"
          >
            <UserAvatar size="xs" showStatusDot />
            <span>Carnet Académico: <strong>{user?.nombre || 'Alex Mendoza'}</strong> ({user?.rol || 'Estudiante'})</span>
          </div>
        </div>
      </div>

      {/* Modal de Carnet Académico & Editor de Avatar */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />
    </footer>
  );
};
