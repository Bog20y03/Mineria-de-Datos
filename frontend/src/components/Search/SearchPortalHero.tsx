import React from 'react';
import {
  Search,
  X,
  Sparkles,
  Loader2,
  Layers,
  Film,
  Scale,
  ArrowRight,
  Database,
  CheckCircle2,
  ShieldCheck,
  FileCode2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SearchPortalHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  loading: boolean;
  suggestedQueries: string[];
  onSelectSuggestion: (query: string) => void;
  metrics?: {
    internalCount: number;
    externalCount: number;
    equationsCount: number;
    canonicalCount: number;
    additionalCount: number;
  };
  onExploreCatalog?: () => void;
}

export const SearchPortalHero: React.FC<SearchPortalHeroProps> = ({
  searchQuery,
  onSearchChange,
  onSubmit,
  onClear,
  loading,
  suggestedQueries,
  onSelectSuggestion,
}) => {
  const { setActiveView, setMode, closeTopic } = useApp();

  return (
    <section style={{ position: 'relative', marginBottom: '2.5rem' }}>
      {/* 1. CAJA PRINCIPAL HERO CON FONDO CINEMÁTICO */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundImage: "url('/images/data_mining_hero_bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid rgba(52, 211, 153, 0.28)',
          boxShadow: '0 25px 60px -12px rgba(4, 25, 20, 0.45)',
        }}
      >
        {/* Overlay con Gradiente Profundo Esmeralda / Azul Tinta */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(3, 26, 21, 0.94) 0%, rgba(5, 42, 38, 0.88) 45%, rgba(10, 24, 46, 0.93) 100%)',
            backdropFilter: 'blur(1px)',
          }}
        />

        {/* Contenido en Rejilla Responsiva */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '3rem 2.25rem 3.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          {/* COLUMNA IZQUIERDA: Titular, Buscador y Sugerencias */}
          <div>
            {/* Eyebrow Badge Estilo Notaría / Portal Corporativo */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.16)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                color: '#6EE7B7',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 10px #10B981',
                  display: 'inline-block',
                }}
              />
              Bienvenido al Motor de Búsqueda de Minería de Datos
            </div>

            {/* Titular Principal de Gran Impacto */}
            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4vw, 3.2rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                margin: '0 0 1.1rem',
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.4)',
              }}
            >
              Minería de Datos & Inteligencia Analítica
            </h1>

            {/* Subtítulo Académico Riguroso */}
            <p
              style={{
                fontSize: '1rem',
                color: '#CBD5E1',
                lineHeight: 1.6,
                margin: '0 0 1.75rem',
                maxWidth: '620px',
              }}
            >
              Plataforma de descubrimiento de conocimiento en bases de datos (KDD):
              explora algoritmos de agrupamiento, clasificación supervisada y series de tiempo
              con formulación matemática rigurosa, experimentos reproducibles y sustentación oral.
            </p>

            {/* Gran Barra de Búsqueda Universal Integrada */}
            <form
              onSubmit={onSubmit}
              style={{
                display: 'flex',
                gap: '0.65rem',
                maxWidth: '640px',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  flex: '1 1 320px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Search
                  size={19}
                  style={{
                    position: 'absolute',
                    left: '1.1rem',
                    color: '#059669',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Escribe un algoritmo o técnica (ej. K-Means, CART, redes neuronales)..."
                  style={{
                    width: '100%',
                    padding: '0.95rem 2.85rem 0.95rem 3rem',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    backgroundColor: '#FFFFFF',
                    border: '2px solid rgba(52, 211, 153, 0.45)',
                    borderRadius: '12px',
                    color: '#0F172A',
                    outline: 'none',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#10B981';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.45)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.25)';
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={onClear}
                    style={{
                      position: 'absolute',
                      right: '0.9rem',
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      cursor: 'pointer',
                      padding: '0.3rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Limpiar búsqueda"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.95rem 1.65rem',
                  borderRadius: '12px',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  boxShadow: '0 8px 20px rgba(5, 150, 105, 0.45)',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#047857';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    <span>Buscando...</span>
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    <span>Buscar Ahora</span>
                  </>
                )}
              </button>
            </form>

            {/* Píldoras de Sugerencias de Búsqueda Rápida */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                flexWrap: 'wrap',
                marginBottom: '1.25rem',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <Sparkles size={12} style={{ color: '#34D399' }} /> Frecuentes:
              </span>
              {suggestedQueries.map((sq, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectSuggestion(sq)}
                  style={{
                    padding: '0.25rem 0.65rem',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#E2E8F0',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.25)';
                    e.currentTarget.style.borderColor = '#10B981';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                    e.currentTarget.style.color = '#E2E8F0';
                  }}
                >
                  {sq}
                </button>
              ))}
            </div>

            {/* Capacidades Clave del Motor de Búsqueda */}
            <div
              style={{
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                flexWrap: 'wrap',
                paddingTop: '0.85rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#94A3B8' }}>
                <CheckCircle2 size={15} style={{ color: '#10B981' }} />
                <span>Búsqueda Híbrida (Local + CrossRef DOI)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#38BDF8' }}>
                <ShieldCheck size={15} style={{ color: '#38BDF8' }} />
                <span>Protocolo PRISMA Auditado</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#F59E0B' }}>
                <Database size={15} style={{ color: '#F59E0B' }} />
                <span>Modelos 100% Reproducibles en R</span>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Imagen Profesional del Científico de Datos */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '340px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '2px solid rgba(52, 211, 153, 0.35)',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)',
                backgroundColor: '#0F172A',
              }}
            >
              <img
                src="/images/data_scientist_hero.jpg"
                alt="Investigador y Científico de Datos"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />

              {/* Insignia Flotante de Rigor Metodológico */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.88)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34D399',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Rigor Científico PRISMA
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>
                    Cero datos inventados • 100% reproducible en R
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LAS 4 TARJETAS FLOTANTES DE ACCESO RÁPIDO (Inspiradas en la referencia notarial) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginTop: '-2rem',
          position: 'relative',
          zIndex: 4,
          padding: '0 1rem',
        }}
      >
        {/* TARJETA 1: 4 Unidades Curriculares */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1.5px solid var(--color-border)',
            borderTop: '4px solid #2563EB',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem',
            transition: 'all 0.2s ease',
          }}
        >
          <div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(37, 99, 235, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
                marginBottom: '0.85rem',
              }}
            >
              <Layers size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 0.4rem' }}>
              4 Unidades & 24 Temas
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.55 }}>
              Desarrollo temático integral: KDD, CRISP-DM, árboles de decisión, redes neuronales, modelos predictivos y educación.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              closeTopic();
              setMode('direct');
              setActiveView('units');
            }}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              fontSize: '0.8125rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Ver Temario Curricular</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* TARJETA 2: Atlas Matemático & Remotion */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1.5px solid var(--color-border)',
            borderTop: '4px solid #EA580C',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem',
            transition: 'all 0.2s ease',
          }}
        >
          <div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(234, 88, 12, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EA580C',
                marginBottom: '0.85rem',
              }}
            >
              <Film size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 0.4rem' }}>
              Atlas Visual & Remotion
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.55 }}>
              Animaciones dinámicas en Remotion y Manim a 720p 30fps con locución por voz española (Helena) sincronizada con subtítulos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              closeTopic();
              setMode('direct');
              setActiveView('atlas');
            }}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#EA580C',
              color: '#FFFFFF',
              fontSize: '0.8125rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Ver Animaciones y Voz</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* TARJETA 3: Laboratorio R & LaTeX */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1.5px solid var(--color-border)',
            borderTop: '4px solid #059669',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem',
            transition: 'all 0.2s ease',
          }}
        >
          <div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(5, 150, 105, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                marginBottom: '0.85rem',
              }}
            >
              <FileCode2 size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 0.4rem' }}>
              Laboratorio R & LaTeX
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.55 }}>
              26 scripts ejecutables en R v4.4.1 con semillas fijas, fórmulas matemáticas KaTeX interactivas y exportación de archivos .tex.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              closeTopic();
              setMode('direct');
              setActiveView('latex');
            }}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              fontSize: '0.8125rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Abrir Laboratorio</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* TARJETA 4: Arena de Benchmark & Dossier */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1.5px solid var(--color-border)',
            borderTop: '4px solid #0D9488',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem',
            transition: 'all 0.2s ease',
          }}
        >
          <div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(13, 148, 136, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0D9488',
                marginBottom: '0.85rem',
              }}
            >
              <Scale size={20} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 0.4rem' }}>
              Benchmark & Sustentación
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.55 }}>
              Duelos directos de sustentación (1-clic), análisis de complejidad asintótica O(n), caja blanca vs caja negra y Dossier en PDF.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              closeTopic();
              setMode('direct');
              setActiveView('benchmark');
            }}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#0D9488',
              color: '#FFFFFF',
              fontSize: '0.8125rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Comparar Modelos</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};
