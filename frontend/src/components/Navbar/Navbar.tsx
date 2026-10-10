import React, { useState, useEffect } from 'react';
import { useApp, type ActiveView } from '../../context/AppContext';
import {
  Compass,
  LayoutDashboard,
  Layers,
  Search,
  FileCode2,
  BookOpen,
  Cog,
  Palette,
  Sun,
  Moon,
  Film,
  Award,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { AcademicTicker } from '../ui/AcademicTicker';
import { ModesGuideModal } from '../common/ModesGuideModal';

export const Navbar: React.FC = () => {
  const { mode, setMode, activeView, setActiveView, closeTopic, selectedTopic } = useApp();
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

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

  const navItems: { view: ActiveView; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    { view: 'rpg', label: 'Juego de Roles', icon: <Award size={15} /> },
    { view: 'units', label: 'Unidades', icon: <Layers size={15} /> },
    { view: 'atlas', label: 'Atlas Matemático', icon: <Film size={15} /> },
    { view: 'search', label: 'Buscador', icon: <Search size={15} /> },
    { view: 'latex', label: 'Lab LaTeX', icon: <FileCode2 size={15} /> },
    { view: 'manual', label: 'Manual', icon: <BookOpen size={15} /> },
    { view: 'uikit', label: 'UI Kit', icon: <Palette size={15} /> },
  ];

  return (
    <header className="app-header-nav">
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0.65rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'nowrap',
          overflowX: 'auto',
        }}
      >
        {/* Logotipo / Marca sobria tipo Atlas */}
        <div
          onClick={() => {
            closeTopic();
            setActiveView('dashboard');
          }}
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
              width: '32px',
              height: '32px',
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
              Ruta del Conocimiento
            </div>
          </div>
        </div>

        {/* =========================================================================
            BLOQUE CENTRAL: SELECTOR DE MODO CLARO & CONTEXTO
            ========================================================================= */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* Selector de Modo Principal (La Máquina vs Modo Directo) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              padding: '3px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                closeTopic();
                setMode('map');
              }}
              title="Entrar a La Máquina (Línea interactiva de 5 estaciones)"
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: mode === 'map' ? 'var(--color-terracotta)' : 'transparent',
                color: mode === 'map' ? '#FFFFFF' : '#94A3B8',
                boxShadow: mode === 'map' ? '0 2px 10px rgba(234, 88, 12, 0.45)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Cog size={14} />
              <span>🏭 La Máquina</span>
            </button>

            <button
              type="button"
              onClick={() => {
                closeTopic();
                setMode('direct');
              }}
              title="Entrar a Modo Directo (Suite con Dashboard, Unidades, Atlas, Manual...)"
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontSize: '0.8125rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: mode === 'direct' ? 'var(--color-blue-ink)' : 'transparent',
                color: mode === 'direct' ? '#FFFFFF' : '#94A3B8',
                boxShadow: mode === 'direct' ? '0 2px 10px rgba(37, 99, 235, 0.45)' : 'none',
                transition: 'all var(--transition-fast)',
              }}
            >
              <LayoutDashboard size={14} />
              <span>🧭 Modo Directo</span>
            </button>
          </div>

          {/* Divisor vertical */}
          <div style={{ height: '22px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />

          {/* =======================================================================
              SI ESTÁ EN MODO LA MÁQUINA: Barra contextual de herramientas de planta
              ======================================================================= */}
          {mode === 'map' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.3rem 0.75rem',
                  backgroundColor: 'rgba(181, 83, 47, 0.08)',
                  border: '1px solid var(--color-terracotta-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--color-terracotta)',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-terracotta)',
                    display: 'inline-block',
                    boxShadow: '0 0 6px var(--color-terracotta)',
                  }}
                />
                <span>Línea de 5 Estaciones (Banda Activa)</span>
              </div>

              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                title="Explicación detallada de qué funciones pertenecen a La Máquina y cuáles a Modo Directo"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.32rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#F1F5F9',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <HelpCircle size={14} style={{ color: '#FDBA74' }} />
                <span>¿Cómo se dividen?</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  closeTopic();
                  setMode('direct');
                  setActiveView('dashboard');
                }}
                title="Ir a Modo Directo para ver Dashboard, Atlas, Manual, etc."
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.32rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-blue-border)',
                  backgroundColor: 'var(--color-blue-soft)',
                  color: 'var(--color-blue-ink)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span>Ver Modo Directo</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ) : (
            /* =======================================================================
               SI ESTÁ EN MODO DIRECTO: Muestra las 7 herramientas directas
               ======================================================================= */
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              {navItems.map((item) => {
                const active = !selectedTopic && activeView === item.view;
                return (
                  <button
                    key={item.view}
                    type="button"
                    onClick={() => {
                      closeTopic();
                      setMode('direct');
                      setActiveView(item.view);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.32rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid',
                      borderColor: active ? 'rgba(96, 165, 250, 0.5)' : 'transparent',
                      fontSize: '0.8rem',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      backgroundColor: active ? 'rgba(37, 99, 235, 0.25)' : 'transparent',
                      color: active ? '#60A5FA' : '#CBD5E1',
                      transition: 'all var(--transition-fast)',
                      boxShadow: active ? '0 0 12px rgba(37, 99, 235, 0.3)' : 'none',
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                title="¿Cómo se dividen las funciones entre La Máquina y Modo Directo?"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.32rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#94A3B8',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                <HelpCircle size={14} />
              </button>
            </nav>
          )}
        </div>

        {/* =========================================================================
            LADO DERECHO: SELECTOR DE TEMA CLARO / OSCURO
            ========================================================================= */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Cambiar a Modo Claro Moderno' : 'Cambiar a Modo Oscuro Telemetría'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
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

      {/* Modal Interactivo Explicativo de Separación de Funciones */}
      <ModesGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        currentMode={mode}
        onSelectMode={(selectedM, selectedV) => {
          setMode(selectedM);
          if (selectedV) {
            setActiveView(selectedV);
          }
          closeTopic();
        }}
      />
    </header>
  );
};
