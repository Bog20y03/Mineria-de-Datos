import type { UnitId } from '../types/domain';

export type DefenseVerdict = 'laureada' | 'meritoria' | 'aprobada' | 'observada';

export interface DefenseCertificate {
  id: string;
  topicId: string;
  topicName: string;
  unitId: UnitId;
  studentName: string;
  studentCode: string;
  studentRole: string;
  fecha: string;
  timestamp: number;
  totalPreguntas: number;
  aciertos: number;
  nota: number; // 0.0 a 5.0
  veredicto: DefenseVerdict;
  veredictoTitulo: string;
  observacionesJurado: string;
  actaNumero: string;
}

const STORAGE_KEY_DEFENSE = 'md_defense_certificates';

export function getDefenseCertificates(): DefenseCertificate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DEFENSE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDefenseCertificate(cert: DefenseCertificate): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDefenseCertificates();
    // Reemplazar si ya existía para el mismo tema o agregar nuevo
    const filtered = current.filter((c) => c.topicId !== cert.topicId);
    filtered.unshift(cert);
    localStorage.setItem(STORAGE_KEY_DEFENSE, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error al guardar acta de sustentación:', e);
  }
}

export function evaluateDefense(
  unitId: UnitId,
  topicId: string,
  topicName: string,
  studentName: string,
  studentCode: string,
  studentRole: string,
  totalPreguntas: number,
  aciertos: number
): DefenseCertificate {
  const porcentaje = (aciertos / totalPreguntas) * 100;
  let veredicto: DefenseVerdict = 'observada';
  let veredictoTitulo = 'Defensa con Observaciones';
  let observacionesJurado = 'El tribunal identificó vacíos conceptuales en las decisiones algorítmicas. Se recomienda revisar el marco teórico y la parametrización en R antes de la sustentación presencial.';
  let nota = Number(((porcentaje / 100) * 5.0).toFixed(1));

  if (porcentaje === 100) {
    veredicto = 'laureada';
    veredictoTitulo = 'Aprobada con Mención de Honor (Summa Cum Laude)';
    observacionesJurado = 'Defensa impecable y ejemplar. El estudiante demostró dominio absoluto de la complejidad asintótica, el pipeline de tres scripts en R y la interpretación empírica sin datos inventados.';
    nota = 5.0;
  } else if (porcentaje >= 75) {
    veredicto = 'meritoria';
    veredictoTitulo = 'Aprobada con Distinción (Meritoria)';
    observacionesJurado = 'Sustentación de alto nivel académico. El sustentante justificó adecuadamente las decisiones estadísticas, las pruebas de bondad de ajuste y el flujo KDD.';
  } else if (porcentaje >= 50) {
    veredicto = 'aprobada';
    veredictoTitulo = 'Aprobada Satisfactoriamente';
    observacionesJurado = 'El sustentante aprobó los requisitos esenciales de la investigación formativa, alcanzando la convergencia metodológica esperada para la cátedra.';
  }

  const randomHash = Math.random().toString(36).substring(2, 7).toUpperCase();
  const actaNumero = `ACTA-${unitId.replace('UNIDAD_', 'U')}-${randomHash}`;

  const cert: DefenseCertificate = {
    id: `cert-${Date.now()}`,
    topicId,
    topicName,
    unitId,
    studentName,
    studentCode,
    studentRole,
    fecha: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
    timestamp: Date.now(),
    totalPreguntas,
    aciertos,
    nota,
    veredicto,
    veredictoTitulo,
    observacionesJurado,
    actaNumero,
  };

  saveDefenseCertificate(cert);
  return cert;
}
