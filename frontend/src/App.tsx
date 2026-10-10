import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar/Navbar';
import { UnitsExplorer } from './components/Units/UnitsExplorer';
import { SearchEngine } from './components/Search/SearchEngine';
import { LatexLab } from './components/Latex/LatexLab';
import { InteractiveManual } from './components/Manual/InteractiveManual';
// import { MachinePlaceholder } from './components/Machine/MachinePlaceholder';
import { MachineView } from './components/Machine/MachineView';
import { RPGAcademicView } from './components/RPG/RPGAcademicView';
import { TopicPage } from './pages/TopicPage';
import { UiKitView } from './pages/UiKitView';
import { AtlasView } from './pages/AtlasView';
import { DossierView } from './components/Dossier';
import { BenchmarkArena } from './components/Benchmark';
import { TribunalDefenseModal } from './components/Defense';
import { Footer } from './components/Footer/Footer';
import { AlertCircle, Loader2 } from 'lucide-react';

const DefenseModalContainer: React.FC = () => {
  const { defenseTarget, closeDefense } = useApp();
  if (!defenseTarget) return null;
  return (
    <TribunalDefenseModal
      isOpen={Boolean(defenseTarget)}
      onClose={closeDefense}
      unitId={defenseTarget.unitId}
      topicId={defenseTarget.topicId}
      topicName={defenseTarget.topicName}
    />
  );
};

const MainContent: React.FC = () => {
  const { mode, activeView, selectedTopic, loading, error, refreshCourse } = useApp();

  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          minHeight: '70vh',
        }}
      >
        <Loader2 size={36} className="spin" style={{ color: 'var(--color-terracotta)' }} />
        <p style={{ color: 'var(--color-ink-secondary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)' }}>
          Conectando con la Máquina de Minería...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: '720px',
          margin: '3rem auto',
          padding: '2rem',
          backgroundColor: 'var(--color-danger-bg)',
          border: '1px solid var(--color-danger-border)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
        }}
      >
        <AlertCircle size={36} style={{ color: 'var(--color-danger-ink)', margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-danger-ink)', marginBottom: '0.5rem' }}>
          No se pudo conectar con la API PHP
        </h3>
        <p style={{ color: 'var(--color-ink)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {error}
        </p>
        <button
          type="button"
          onClick={() => refreshCourse()}
          className="btn"
          style={{
            backgroundColor: 'var(--color-terracotta)',
            color: '#FFFFFF',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reintentar conexión
        </button>
      </div>
    );
  }

  // 1. Si hay un tema seleccionado, renderizar como PÁGINA completa con migas de pan (Tarea 3)
  if (selectedTopic) {
    return (
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        <div key={`topic-${selectedTopic.unitId}-${selectedTopic.topicId}`} className="view-transition">
          <TopicPage />
        </div>
      </main>
    );
  }

  // 2. Si la vista activa es el UI Kit, mostrarla prioritariamente
  if (activeView === 'uikit') {
    return (
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        <div key="uikit" className="view-transition">
          <UiKitView />
        </div>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, paddingBottom: '3rem' }}>
      {/* Selector de Modo: La Máquina vs Modo Directo con transición suave */}
      {mode === 'map' ? (
        <div key="mode-machine" className="view-transition">
          <MachineView />
        </div>
      ) : (
        <div key={`view-${activeView}`} className="view-transition">
          {(activeView === 'dashboard' || activeView === 'units') && <UnitsExplorer />}
          {activeView === 'rpg' && <RPGAcademicView />}
          {activeView === 'atlas' && <AtlasView />}
          {activeView === 'search' && <SearchEngine />}
          {activeView === 'latex' && <LatexLab />}
          {activeView === 'manual' && <InteractiveManual />}
          {activeView === 'profile' && <RPGAcademicView />}
          {activeView === 'dossier' && <DossierView />}
          {activeView === 'benchmark' && <BenchmarkArena />}
        </div>
      )}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'var(--color-paper)',
          color: 'var(--color-ink)',
        }}
      >
        <Navbar />
        <MainContent />
        <Footer />
        <DefenseModalContainer />
      </div>
    </AppProvider>
  );
}
