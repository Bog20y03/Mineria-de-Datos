import type { AuthState, Role } from '../types/domain';

const STORAGE_KEY_ROLE = 'md_active_role';

/**
 * Servicio de sesión para la versión 1 de la plataforma.
 * Conforme a AGENTS.md §3 y la Fase 4 del plan de trabajo:
 * - La API PHP no tiene autenticación ni roles.
 * - La versión 1 es de un solo usuario (demostración académica).
 * - Se eliminó la llamada a api/auth.php (404) y el respaldo con usuario_actual.json (ficha mock).
 */
export async function checkSession(): Promise<AuthState> {
  const storedRole = (localStorage.getItem(STORAGE_KEY_ROLE) as Role) || 'estudiante';
  return {
    status: 'authenticated',
    user: {
      id: 'investigador_principal',
      nombre: 'Investigador Académico',
      rol: storedRole,
    },
  };
}

export function setActiveRole(role: Role): void {
  localStorage.setItem(STORAGE_KEY_ROLE, role);
}

export function getActiveRole(): Role {
  return (localStorage.getItem(STORAGE_KEY_ROLE) as Role) || 'estudiante';
}
