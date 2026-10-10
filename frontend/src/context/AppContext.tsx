import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { CourseProgress, Role, SessionUser, UnitId } from '../types/domain';
import { getCourseProgress } from '../services/progressService';
import { checkSession, setActiveRole as persistActiveRole } from '../services/authService';
import {
  calculateAcademicXP,
  calculateLevel,
  evaluateAchievements,
  type Achievement,
  type LevelInfo,
} from '../lib/progress/progressLogic';
import { MAP_MIN_WIDTH } from '../config';

export type AppMode = 'map' | 'direct';

export type ActiveView = 'dashboard' | 'units' | 'atlas' | 'search' | 'latex' | 'manual' | 'profile' | 'uikit' | 'rpg' | 'dossier';

interface AppContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  user: SessionUser;
  changeRole: (role: Role) => void;
  course: CourseProgress | null;
  loading: boolean;
  error: string | null;
  refreshCourse: () => Promise<void>;

  // Gamificación sobria calculada
  xp: number;
  level: LevelInfo;
  achievements: Achievement[];

  // Modal / Selección de tema
  selectedTopic: { unitId: UnitId; topicId: string } | null;
  openTopic: (unitId: UnitId, topicId: string) => void;
  closeTopic: () => void;

  // Dossier de Sustentación
  dossierTarget: { unitId: UnitId; topicId: string } | null;
  openDossier: (unitId?: UnitId, topicId?: string) => void;

  // Simulador de Defensa de Jurado
  defenseTarget: { unitId: UnitId; topicId: string; topicName: string } | null;
  openDefense: (unitId: UnitId, topicId: string, topicName: string) => void;
  closeDefense: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_MODE = 'md_app_mode';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Preferencia de modo: por defecto Directo en móviles (<1024px), Mapa en escritorio si hay guardado
  const [mode, setModeState] = useState<AppMode>(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < MAP_MIN_WIDTH;
    if (isMobile) return 'direct';
    const saved = localStorage.getItem(STORAGE_KEY_MODE);
    return saved === 'map' || saved === 'direct' ? saved : 'direct';
  });

  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/ui-kit' || path.endsWith('/ui-kit') || hash === '#ui-kit') {
        return 'uikit';
      }
    }
    return 'dashboard';
  });
  const [user, setUser] = useState<SessionUser>({
    id: 'estudiante_01',
    nombre: 'Alex Mendoza',
    rol: 'estudiante',
  });

  const [course, setCourse] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTopic, setSelectedTopic] = useState<{ unitId: UnitId; topicId: string } | null>(null);

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY_MODE, newMode);
  };

  const loadData = async (refresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const [progressData, authData] = await Promise.all([
        getCourseProgress({ refresh }),
        checkSession(),
      ]);
      setCourse(progressData);
      if (authData.status === 'authenticated') {
        setUser(authData.user);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al cargar el sistema';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleProfileUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; role: Role }>;
      if (customEvent.detail) {
        setUser((prev) => ({
          ...prev,
          nombre: customEvent.detail.name || prev.nombre,
          rol: customEvent.detail.role || prev.rol,
        }));
      }
    };
    window.addEventListener('md_profile_updated', handleProfileUpdated);
    return () => window.removeEventListener('md_profile_updated', handleProfileUpdated);
  }, []);

  const changeRole = (role: Role) => {
    persistActiveRole(role);
    setUser((prev) => ({ ...prev, rol: role }));
  };

  const refreshCourse = async () => {
    await loadData(true);
  };

  const openTopic = (unitId: UnitId, topicId: string) => {
    setSelectedTopic({ unitId, topicId });
  };

  const closeTopic = () => {
    setSelectedTopic(null);
  };

  const [dossierTarget, setDossierTarget] = useState<{ unitId: UnitId; topicId: string } | null>(null);

  const openDossier = (unitId?: UnitId, topicId?: string) => {
    if (unitId && topicId) {
      setDossierTarget({ unitId, topicId });
    }
    setSelectedTopic(null);
    setModeState('direct');
    setActiveView('dossier');
  };

  // Simulador de Defensa de Jurado
  const [defenseTarget, setDefenseTarget] = useState<{ unitId: UnitId; topicId: string; topicName: string } | null>(null);

  const openDefense = (unitId: UnitId, topicId: string, topicName: string) => {
    setDefenseTarget({ unitId, topicId, topicName });
  };

  const closeDefense = () => {
    setDefenseTarget(null);
  };

  // Gamificación calculada puramente sobre datos verificados
  const { xp, level, achievements } = useMemo(() => {
    if (!course) {
      const initialLvl = calculateLevel(0);
      return { xp: 0, level: initialLvl, achievements: [] };
    }
    const computedXp = calculateAcademicXP(course);
    const computedLvl = calculateLevel(computedXp);
    const computedAch = evaluateAchievements(course);
    return { xp: computedXp, level: computedLvl, achievements: computedAch };
  }, [course]);

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        activeView,
        setActiveView,
        user,
        changeRole,
        course,
        loading,
        error,
        refreshCourse,
        xp,
        level,
        achievements,
        selectedTopic,
        openTopic,
        closeTopic,
        dossierTarget,
        openDossier,
        defenseTarget,
        openDefense,
        closeDefense,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return ctx;
}
