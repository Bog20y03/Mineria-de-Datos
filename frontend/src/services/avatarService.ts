export type AvatarType = 'initials' | 'preset' | 'custom';

export type AvatarPresetId =
  | 'cientifico'
  | 'documentalista'
  | 'ingeniero'
  | 'ia'
  | 'explorador'
  | 'academico';

export interface UserProfileConfig {
  name: string;
  code: string;
  role: 'estudiante' | 'docente' | 'administrador';
  avatarType: AvatarType;
  presetId: AvatarPresetId;
  customUrl: string | null;
  accentColor: string;
}

export interface AvatarPresetMeta {
  id: AvatarPresetId;
  title: string;
  subtitle: string;
  themeColor: string;
  description: string;
}

export const AVATAR_PRESETS: AvatarPresetMeta[] = [
  {
    id: 'cientifico',
    title: 'Científico de Algoritmos',
    subtitle: 'R & Modelos Estadísticos',
    themeColor: '#EA580C',
    description: 'Especialista en experimentos reproducibles, semillas fijas y matrices de confusión.',
  },
  {
    id: 'documentalista',
    title: 'Curador Epistemológico',
    subtitle: 'Fuentes & Literatura Canónica',
    themeColor: '#059669',
    description: 'Especialista en rigor bibliográfico, bases científicas y verificación conceptual.',
  },
  {
    id: 'ingeniero',
    title: 'Ingeniero de Datos',
    subtitle: 'ETL, OLAP & Estructura Tabular',
    themeColor: '#0284C7',
    description: 'Especialista en curaduría tabular, cubos de datos y particiones analíticas.',
  },
  {
    id: 'ia',
    title: 'Especialista en Redes Neuronales',
    subtitle: 'Perceptrón & Aprendizaje Profundo',
    themeColor: '#7C3AED',
    description: 'Especialista en arquitecturas multicapa, optimización de gradiente y sinapsis.',
  },
  {
    id: 'explorador',
    title: 'Explorador del Atlas',
    subtitle: 'Geometría & Visualización',
    themeColor: '#DB2777',
    description: 'Especialista en proyecciones cartesianas, hiperplanos y clusters multidimensionales.',
  },
  {
    id: 'academico',
    title: 'Académico & Ponente de Tesis',
    subtitle: 'Sustentación & Rigor Metodológico',
    themeColor: '#D97706',
    description: 'Especialista en defensa oral de proyectos, argumentación empírica y comités.',
  },
];

export const ACCENT_PALETTE = [
  { name: 'Azul Oxford', hex: '#0284C7' },
  { name: 'Terracota Minero', hex: '#EA580C' },
  { name: 'Esmeralda Datos', hex: '#059669' },
  { name: 'Púrpura Teorema', hex: '#7C3AED' },
  { name: 'Ámbar Académico', hex: '#D97706' },
  { name: 'Rosa Geométrico', hex: '#DB2777' },
  { name: 'Pizarra Grafito', hex: '#475569' },
];

const STORAGE_KEY_PROFILE = 'md_user_profile_config';

const DEFAULT_PROFILE: UserProfileConfig = {
  name: 'Alex Mendoza',
  code: 'UDEC-2026-DM',
  role: 'estudiante',
  avatarType: 'preset',
  presetId: 'cientifico',
  customUrl: null,
  accentColor: '#0284c7',
};

export function getUserProfileConfig(): UserProfileConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfileConfig(updates: Partial<UserProfileConfig>): UserProfileConfig {
  const current = getUserProfileConfig();
  const next: UserProfileConfig = { ...current, ...updates };
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(next));
    if (updates.role) {
      localStorage.setItem('md_active_role', updates.role);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('md_profile_updated', { detail: next }));
    }
  } catch (err) {
    console.error('Error al guardar el perfil:', err);
  }
  return next;
}

/**
 * Comprime y reescala una imagen de usuario para guardarla en localStorage como base64 compacto.
 */
export function compressImageFileToDataUrl(
  file: File,
  maxDimension: number = 256,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
