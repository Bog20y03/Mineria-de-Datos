import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Search,
  Cog,
  Layers,
  Film,
  FileCode2,
  Award,
  BookOpen,
  Sun,
  Moon,
} from 'lucide-react';
import { AcademicTicker } from '../ui/AcademicTicker';
import { UserAvatar, AvatarModal } from '../Avatar';

interface NavButtonDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  isSpecial?: boolean;
}

export const Navbar: React.FC = () => {
  const { mode, setMode, activeView, setActiveView, closeTopic, selectedTopic } = useApp();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('md_theme');
      if (saved) return saved === 'dark';
      return false;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('md_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('md_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Lista unificada y sin repeticiones de las 7 funciones esenciales
  const navItems: NavButtonDef[] = [
    {
      id: 'search',
      label: 'Buscador',
      icon: <Search size={15} />,
      isActive: mode === 'direct' && activeView === 'search' && !selectedTopic,
      onClick: () => {
        closeTopic();
        setMode('direct');
        setActiveView('search');
      },
    },
    {
      id: 'machine',
      label: 'La Máquina',
      icon: <Cog size={15} />,
      isSpecial: true,
      isActive: mode === 'map' && !selectedTopic,
      onClick: () => {
        closeTopic();
        setMode('map');
      },
    },
    {
      id: 'units',
      label: 'Temario & Unidades',
      icon: <Layers size={15} />,
      isActive:
        mode === 'direct' &&
        (activeView === 'units' || activeView === 'dashboard') &&
        !selectedTopic,
      onClick: () => {
        closeTopic();
        setMode('direct');
        setActiveView('units');
      },
    },
    {
      id: 'atlas',
      label: 'Atlas Matemático',
      icon: <Film size={15} />,
      isActive: mode === 'direct' && activeView === 'atlas' && !selectedTopic,
      onClick: () => {
        closeTopic();
        setMode('direct');
        setActiveView('atlas');
      },
    },
    {
      id: 'latex',
      label: 'Lab LaTeX',
      icon: <FileCode2 size={15} />,
      isActive: mode === 'direct' && activeView === 'latex' && !selectedTopic,
      onClick: () => {
        closeTopic();
        setMode('direct');
        setActiveView('latex');
      },
    },
    {
      id: 'rpg',
      label: 'Misiones & Roles',
      icon: <Award size={15} />,
      isActive: mode === 'direct' && activeView === 'rpg' && !selectedTopic,
      onClick: () => {
        closeTopic();
        setMode('direct');
        setActiveView('rpg');
      },
    },
    {
      id: 'manual',
      label: 'Manual',
      icon: <BookOpen size={15} />,
      isActive: mode === 'direct' && activeView === 'manual' && !selectedTopic,
      onClick: () => {
        closeTopic();
        setMode('direct');
        setActiveView('manual');
      },
    },
  ];

  return (
    <header className="app-header-nav">
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0.65rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          flexWrap: 'nowrap',
          overflowX: 'auto',
        }}
      >
        {/* Logotipo Institucional */}
        <div
          onClick={() => {
            closeTopic();
            setMode('direct');
            setActiveView('search');
          }}
          title="Ir al motor de búsqueda principal"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            flexShrink: 0,
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-blue-soft)',
              border: '1px solid var(--color-blue-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-blue-ink)',
            }}
          >
            <Compass size={18} />
          </div>
          <div>
            <div
              className="atlas-title"
              style={{
                fontWeight: 800,
                fontSize: '0.98rem',
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
              }}
            >
              La Máquina de Minería
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'var(--font-sans)' }}>
              Motor de Búsqueda & Investigación
            </div>
          </div>
        </div>

        {/* Barra Central Unificada: 7 Funciones Únicas sin Repetición */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            flexShrink: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {navItems.map((item) => {
            const isSpecialActive = item.isSpecial && item.isActive;
            const isNormalActive = !item.isSpecial && item.isActive;

            let bgColor = 'transparent';
            let textColor = '#CBD5E1';
            let borderColor = 'transparent';
            let boxShadow = 'none';

            if (isSpecialActive) {
              bgColor = 'var(--color-terracotta, #EA580C)';
              textColor = '#FFFFFF';
              boxShadow = '0 2px 10px rgba(234, 88, 12, 0.45)';
            } else if (isNormalActive) {
              bgColor = 'rgba(37, 99, 235, 0.25)';
              textColor = '#60A5FA';
              borderColor = 'rgba(96, 165, 250, 0.5)';
              boxShadow = '0 0 12px rgba(37, 99, 235, 0.3)';
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.38rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${borderColor}`,
                  fontSize: '0.8125rem',
                  fontWeight: item.isActive ? 700 : 500,
                  cursor: 'pointer',
                  backgroundColor: bgColor,
                  color: textColor,
                  boxShadow: boxShadow,
                  transition: 'all var(--transition-fast)',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Lado Derecho: Selector de Tema y Carnet / Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          {/* Botón de Identidad Académica / Avatar */}
          <button
            type="button"
            onClick={() => setIsAvatarModalOpen(true)}
            title="Abrir Carnet Académico y Editor de Avatar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.22rem 0.75rem 0.22rem 0.3rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              color: '#F1F5F9',
            }}
          >
            <UserAvatar size="xs" showStatusDot />
            <div style={{ textAlign: 'left', lineHeight: 1.15, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#FFFFFF' }}>
                Carnet
              </span>
              <span style={{ fontSize: '0.62rem', color: '#94A3B8' }}>
                Avatar
              </span>
            </div>
          </button>

          {/* Selector de Tema */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Cambiar a Modo Claro Moderno' : 'Cambiar a Modo Oscuro'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.38rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: isDark ? '#FBBF24' : '#FDBA74',
              transition: 'all var(--transition-fast)',
              boxShadow: 'var(--shadow-atlas-xs)',
            }}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            <span style={{ fontSize: '0.75rem' }}>{isDark ? 'Claro' : 'Oscuro'}</span>
          </button>
        </div>
      </div>

      <AcademicTicker />

      {/* Modal de Carnet Académico & Editor de Avatar */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />
    </header>
  );
};
