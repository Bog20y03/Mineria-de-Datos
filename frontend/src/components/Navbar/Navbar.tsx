import React, { useState, useEffect, useRef } from 'react';
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
  ScrollText,
  Scale,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';
import { AcademicTicker } from '../ui/AcademicTicker';
import { UserAvatar, AvatarModal } from '../Avatar';

export const Navbar: React.FC = () => {
  const { mode, setMode, activeView, setActiveView, closeTopic, selectedTopic } = useApp();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<'lab' | 'defense' | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Estados activos para las pestañas
  const isSearchActive = mode === 'direct' && activeView === 'search' && !selectedTopic;
  const isUnitsActive =
    mode === 'direct' && (activeView === 'units' || activeView === 'dashboard') && !selectedTopic;
  const isMachineActive = mode === 'map' && !selectedTopic;
  const isLabActive =
    mode === 'direct' &&
    (activeView === 'atlas' || activeView === 'latex' || activeView === 'benchmark') &&
    !selectedTopic;
  const isDefenseActive =
    mode === 'direct' &&
    (activeView === 'dossier' || activeView === 'manual' || activeView === 'rpg') &&
    !selectedTopic;

  const navigateTo = (view: 'search' | 'units' | 'atlas' | 'latex' | 'benchmark' | 'dossier' | 'manual' | 'rpg') => {
    closeTopic();
    setMode('direct');
    setActiveView(view);
    setOpenDropdown(null);
  };

  return (
    <header className="app-header-nav" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
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
        }}
      >
        {/* 1. Logotipo Institucional de Alto Impacto */}
        <div
          onClick={() => navigateTo('search')}
          title="Ir al motor de búsqueda principal"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            flexShrink: 0,
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(5, 150, 105, 0.2)',
              border: '1.5px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34D399',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.25)',
            }}
          >
            <Compass size={20} />
          </div>
          <div>
            <div
              className="atlas-title"
              style={{
                fontWeight: 900,
                fontSize: '1rem',
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>MINERÍA DE DATOS</span>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '4px',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  letterSpacing: '0.04em',
                }}
              >
                KDD
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'var(--font-sans)' }}>
              Motor de Búsqueda & Investigación
            </div>
          </div>
        </div>

        {/* 2. Barra Central Despejada: Solo 5 Secciones Esenciales */}
        <nav
          ref={dropdownRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            flexShrink: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* PESTAÑA 1: Inicio / Buscador */}
          <button
            type="button"
            onClick={() => navigateTo('search')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.42rem 0.85rem',
              borderRadius: '8px',
              border: isSearchActive ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid transparent',
              fontSize: '0.8125rem',
              fontWeight: isSearchActive ? 700 : 500,
              cursor: 'pointer',
              backgroundColor: isSearchActive ? 'rgba(5, 150, 105, 0.25)' : 'transparent',
              color: isSearchActive ? '#34D399' : '#CBD5E1',
              boxShadow: isSearchActive ? '0 0 12px rgba(16, 185, 129, 0.3)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Search size={15} />
            <span>Inicio</span>
          </button>

          {/* PESTAÑA 2: Unidades & Temas */}
          <button
            type="button"
            onClick={() => navigateTo('units')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.42rem 0.85rem',
              borderRadius: '8px',
              border: isUnitsActive ? '1px solid rgba(96, 165, 250, 0.5)' : '1px solid transparent',
              fontSize: '0.8125rem',
              fontWeight: isUnitsActive ? 700 : 500,
              cursor: 'pointer',
              backgroundColor: isUnitsActive ? 'rgba(37, 99, 235, 0.25)' : 'transparent',
              color: isUnitsActive ? '#60A5FA' : '#CBD5E1',
              boxShadow: isUnitsActive ? '0 0 12px rgba(37, 99, 235, 0.3)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Layers size={15} />
            <span>Unidades</span>
          </button>

          {/* PESTAÑA 3: La Máquina (Modo Guiado de 6 Estaciones) */}
          <button
            type="button"
            onClick={() => {
              closeTopic();
              setMode('map');
              setOpenDropdown(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.42rem 0.85rem',
              borderRadius: '8px',
              border: isMachineActive ? '1px solid rgba(234, 88, 12, 0.6)' : '1px solid transparent',
              fontSize: '0.8125rem',
              fontWeight: isMachineActive ? 700 : 500,
              cursor: 'pointer',
              backgroundColor: isMachineActive ? 'var(--color-terracotta, #EA580C)' : 'transparent',
              color: isMachineActive ? '#FFFFFF' : '#CBD5E1',
              boxShadow: isMachineActive ? '0 2px 12px rgba(234, 88, 12, 0.45)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <Cog size={15} />
            <span>La Máquina</span>
          </button>

          {/* PESTAÑA 4: Laboratorio (Dropdown con Atlas, LaTeX y Benchmark) */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'lab' ? null : 'lab')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.42rem 0.85rem',
                borderRadius: '8px',
                border: isLabActive ? '1px solid rgba(14, 165, 233, 0.5)' : '1px solid transparent',
                fontSize: '0.8125rem',
                fontWeight: isLabActive ? 700 : 500,
                cursor: 'pointer',
                backgroundColor: isLabActive ? 'rgba(14, 165, 233, 0.25)' : 'transparent',
                color: isLabActive ? '#38BDF8' : '#CBD5E1',
                boxShadow: isLabActive ? '0 0 12px rgba(14, 165, 233, 0.3)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <Film size={15} />
              <span>Laboratorio</span>
              <ChevronDown
                size={13}
                style={{
                  transition: 'transform 0.2s ease',
                  transform: openDropdown === 'lab' ? 'rotate(180deg)' : 'none',
                }}
              />
            </button>

            {/* Menú Desplegable Laboratorio */}
            {openDropdown === 'lab' && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.96)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
                  padding: '0.45rem',
                  minWidth: '270px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  zIndex: 100,
                  animation: 'fadeIn 0.15s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => navigateTo('atlas')}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeView === 'atlas' ? 'rgba(234, 88, 12, 0.18)' : 'transparent',
                    color: '#F1F5F9',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      activeView === 'atlas' ? 'rgba(234, 88, 12, 0.18)' : 'transparent')
                  }
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(234, 88, 12, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#EA580C',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Film size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
                      Atlas Matemático
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '1px' }}>
                      Animaciones Remotion & Manim con narración de voz
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('latex')}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeView === 'latex' ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
                    color: '#F1F5F9',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      activeView === 'latex' ? 'rgba(56, 189, 248, 0.18)' : 'transparent')
                  }
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(56, 189, 248, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38BDF8',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <FileCode2 size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
                      Laboratorio LaTeX
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '1px' }}>
                      Editor KaTeX, 26 scripts de R y descarga .tex
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('benchmark')}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeView === 'benchmark' ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                    color: '#F1F5F9',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      activeView === 'benchmark' ? 'rgba(16, 185, 129, 0.18)' : 'transparent')
                  }
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#34D399',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Scale size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
                      Arena de Benchmark
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '1px' }}>
                      Confrontación O(n), caja blanca vs negra y duelos
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* PESTAÑA 5: Sustentación (Dropdown con Dossier, Manual y RPG) */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'defense' ? null : 'defense')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.42rem 0.85rem',
                borderRadius: '8px',
                border: isDefenseActive ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid transparent',
                fontSize: '0.8125rem',
                fontWeight: isDefenseActive ? 700 : 500,
                cursor: 'pointer',
                backgroundColor: isDefenseActive ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
                color: isDefenseActive ? '#C084FC' : '#CBD5E1',
                boxShadow: isDefenseActive ? '0 0 12px rgba(168, 85, 247, 0.3)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <ScrollText size={15} />
              <span>Sustentación</span>
              <ChevronDown
                size={13}
                style={{
                  transition: 'transform 0.2s ease',
                  transform: openDropdown === 'defense' ? 'rotate(180deg)' : 'none',
                }}
              />
            </button>

            {/* Menú Desplegable Sustentación */}
            {openDropdown === 'defense' && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.96)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.45)',
                  padding: '0.45rem',
                  minWidth: '270px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  zIndex: 100,
                  animation: 'fadeIn 0.15s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => navigateTo('dossier')}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeView === 'dossier' ? 'rgba(168, 85, 247, 0.18)' : 'transparent',
                    color: '#F1F5F9',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      activeView === 'dossier' ? 'rgba(168, 85, 247, 0.18)' : 'transparent')
                  }
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(168, 85, 247, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C084FC',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <ScrollText size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
                      Dossier Académico
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '1px' }}>
                      Informe ejecutivo imprimible y exportación en PDF
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('manual')}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeView === 'manual' ? 'rgba(14, 165, 233, 0.18)' : 'transparent',
                    color: '#F1F5F9',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      activeView === 'manual' ? 'rgba(14, 165, 233, 0.18)' : 'transparent')
                  }
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(14, 165, 233, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38BDF8',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <BookOpen size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
                      Manual Metodológico
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '1px' }}>
                      Video 720p, 6 estaciones y narrador por voz
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo('rpg')}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeView === 'rpg' ? 'rgba(245, 158, 11, 0.18)' : 'transparent',
                    color: '#F1F5F9',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      activeView === 'rpg' ? 'rgba(245, 158, 11, 0.18)' : 'transparent')
                  }
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#F59E0B',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Award size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>
                      Misiones & Roles RPG
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '1px' }}>
                      Simulación gamificada de sustentación ante jurados
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* 3. Lado Derecho: Selector de Tema y Carnet / Avatar */}
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
              transition: 'all 0.15s ease',
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
              transition: 'all 0.15s ease',
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
