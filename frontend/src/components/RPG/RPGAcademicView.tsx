import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ENCARGOS_UNIDADES, RANGOS_INVESTIGACION } from '../../data/narrativa';
import { getRecorrido, type StationId } from '../../services/recorridoService';
import type { UnitId } from '../../types/domain';
import {
  Award,
  BookOpen,
  FlaskConical,
  FileCode2,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Play,
  Library,
  Cpu,
  Database,
  Search,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';

// ============================================================================
// DEFINICIÓN DE ROLES ACADÉMICOS ESPECIALIZADOS
// ============================================================================
export interface AcademicRoleDefinition {
  id: string;
  titulo: string;
  lema: string;
  icono: React.ReactNode;
  color: string;
  colorLight: string;
  bgSoft: string;
  borderCol: string;
  estacionesClave: string[];
  misionPrioritaria: string;
  habilidadPasiva: string;
  descripcion: string;
  categoria: string;
}

export const ROLES_ACADEMICOS: AcademicRoleDefinition[] = [
  {
    id: 'documentalista',
    titulo: 'Documentalista Epistemológico',
    categoria: 'Curaduría Bibliográfica',
    lema: '«Trazabilidad rigurosa y literatura indexada sin sesgos»',
    icono: <BookOpen size={24} />,
    color: '#0284C7',
    colorLight: '#38BDF8',
    bgSoft: 'rgba(2, 132, 199, 0.1)',
    borderCol: 'rgba(2, 132, 199, 0.35)',
    estacionesClave: ['Terminal de Consultas', 'Biblioteca y Matriz DOI'],
    misionPrioritaria: 'Formular ecuaciones booleanas PRISMA e indexar artículos revisados por pares.',
    habilidadPasiva: 'Agudeza Bibliométrica: Detección prioritaria de pertinencia Alta y trazabilidad DOI.',
    descripcion: 'Especialista en la fundamentación documental. Concilia las preguntas de investigación con operadores booleanos estructurados en Google Scholar y bases bibliográficas.',
  },
  {
    id: 'cientifico_r',
    titulo: 'Científico de Algoritmos y R',
    categoria: 'Computación Cuantitativa',
    lema: '«Cómputo reproducible, semillas fijas y cero datos simulados»',
    icono: <FlaskConical size={24} />,
    color: '#EA580C',
    colorLight: '#FB923C',
    bgSoft: 'rgba(234, 88, 12, 0.1)',
    borderCol: 'rgba(234, 88, 12, 0.35)',
    estacionesClave: ['Laboratorio de R', 'Resultados Cuantitativos'],
    misionPrioritaria: 'Ejecutar los 24 scripts nativos en R, evaluando silueta, WCSS, matrices de confusión y AUC.',
    habilidadPasiva: 'Rigor Cuantitativo: Salida estándar verificada con Exit Code 0 y exportación diagnóstica.',
    descripcion: 'Pilar computacional del proyecto. Somete a prueba los algoritmos estadísticos (K-Means, Árboles CART, Redes Neuronales) sobre datasets tabulares.',
  },
  {
    id: 'ingeniero_datos',
    titulo: 'Ingeniero de Datos y Preprocesamiento',
    categoria: 'Arquitectura Tabular',
    lema: '«Estructura tabular limpia y arquitectura multidimensional»',
    icono: <Database size={24} />,
    color: '#10B981',
    colorLight: '#34D399',
    bgSoft: 'rgba(16, 185, 129, 0.1)',
    borderCol: 'rgba(16, 185, 129, 0.35)',
    estacionesClave: ['Terminal', 'Curaduría de Datasets CSV'],
    misionPrioritaria: 'Garantizar la integridad de los 26 datasets y las transformaciones KDD / CRISP-DM.',
    habilidadPasiva: 'Integridad Estructural: Detección de tipos de datos, headers y matrices sin imputación forzada.',
    descripcion: 'Guardián de la calidad de los datos. Prepara las particiones analíticas, gestiona operaciones OLAP y certifica la procedencia de cada archivo CSV.',
  },
  {
    id: 'editor_latex',
    titulo: 'Editor Científico LaTeX',
    categoria: 'Síntesis Editorial',
    lema: '«Formalismo matemático, síntesis KaTeX y estructura canónica»',
    icono: <FileCode2 size={24} />,
    color: '#8B5CF6',
    colorLight: '#A78BFA',
    bgSoft: 'rgba(139, 92, 246, 0.1)',
    borderCol: 'rgba(139, 92, 246, 0.35)',
    estacionesClave: ['Escritorio Editorial', 'Laboratorio LaTeX'],
    misionPrioritaria: 'Estructurar los 26 manuscritos formales (.tex) con fórmulas matemáticas y figuras diagnósticas.',
    habilidadPasiva: 'Síntesis KaTeX: Renderizado tipográfico impecable de ecuaciones algebraicas y bibliografía.',
    descripcion: 'Responsable de la comunicación científica. Traduce los hallazgos experimentales a manuscritos académicos estandarizados listos para publicación.',
  },
  {
    id: 'defensor_tesis',
    titulo: 'Ponente y Defensor de Tesis',
    categoria: 'Sustentación Académica',
    lema: '«Evidencia empírica ante el comité académico evaluador»',
    icono: <GraduationCap size={24} />,
    color: '#F59E0B',
    colorLight: '#FCD34D',
    bgSoft: 'rgba(245, 158, 11, 0.1)',
    borderCol: 'rgba(245, 158, 11, 0.35)',
    estacionesClave: ['Pizarra de Sustentación', 'Modo Presentación'],
    misionPrioritaria: 'Defender la sustentación final de la Unidad 4 ante el tribunal con datos y métricas contrastadas.',
    habilidadPasiva: 'Elocuencia Empírica: Síntesis comparativa y defensa sólida de decisiones metodológicas.',
    descripcion: 'Articulador final del conocimiento. Consolida el recorrido completo de La Máquina para responder con solidez a las preguntas problema de cada unidad.',
  },
];

// Metadatos de Zonas del Campus
const ZONAS_CAMPUS: {
  unitId: UnitId;
  numero: 1 | 2 | 3 | 4;
  nombre: string;
  lugar: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}[] = [
  {
    unitId: 'UNIDAD_1',
    numero: 1,
    nombre: 'Unidad 1: Conceptos Fundamentales',
    lugar: 'Archivo Histórico y Biblioteca Epistemológica',
    icon: <Library size={22} />,
    color: '#0284C7',
    bg: 'rgba(2, 132, 199, 0.08)',
  },
  {
    unitId: 'UNIDAD_2',
    numero: 2,
    nombre: 'Unidad 2: Modelos y Técnicas',
    lugar: 'Taller Teórico y Algorítmico',
    icon: <Cpu size={22} />,
    color: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.08)',
  },
  {
    unitId: 'UNIDAD_3',
    numero: 3,
    nombre: 'Unidad 3: Aplicaciones Empíricas',
    lugar: 'Laboratorio Experimental en R',
    icon: <FlaskConical size={22} />,
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.08)',
  },
  {
    unitId: 'UNIDAD_4',
    numero: 4,
    nombre: 'Unidad 4: Proyecto Integrador',
    lugar: 'Gran Sala de Sustentación y Jurado',
    icon: <GraduationCap size={22} />,
    color: '#8B5CF6',
    bg: 'rgba(139, 92, 246, 0.08)',
  },
];

const STORAGE_KEY_ROLE = 'mineria_active_academic_role';

export const RPGAcademicView: React.FC = () => {
  const { course, xp, level, achievements, openTopic, setMode } = useApp();

  // Rol académico seleccionado por el usuario (persistente)
  const [selectedRoleId, setSelectedRoleId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY_ROLE) || 'cientifico_r';
    }
    return 'cientifico_r';
  });

  // Zona académica activa para explorar
  const [activeZoneUnitId, setActiveZoneUnitId] = useState<UnitId>('UNIDAD_1');

  // Filtro de misiones
  const [missionFilter, setMissionFilter] = useState<'todas' | 'zona' | 'completadas' | 'pendientes'>('zona');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Telemetría de estaciones operadas en La Máquina
  const recorrido = useMemo(() => getRecorrido(), []);

  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ROLE, roleId);
    }
  };

  const activeRole = useMemo(() => {
    return ROLES_ACADEMICOS.find((r) => r.id === selectedRoleId) || ROLES_ACADEMICOS[1];
  }, [selectedRoleId]);

  const activeZoneMeta = useMemo(() => {
    return ZONAS_CAMPUS.find((z) => z.unitId === activeZoneUnitId) || ZONAS_CAMPUS[0];
  }, [activeZoneUnitId]);

  const activeEncargo = ENCARGOS_UNIDADES[activeZoneMeta.numero];

  // Cálculo de unidades operadas completamente por el usuario
  const unidadesOperadasCount = useMemo(() => {
    if (!course) return 0;
    let completadas = 0;
    for (const unit of course.unidades) {
      const allOperated = unit.temas.every((t) => {
        const key = `${unit.id}/${t.id}`;
        const ops = recorrido.operadasPorTema[key] || [];
        return ops.includes('laboratorio');
      });
      if (allOperated && unit.temas.length > 0) {
        completadas++;
      }
    }
    return completadas;
  }, [course, recorrido]);

  // Lista de todas las misiones procesadas
  const todasLasMisiones = useMemo(() => {
    if (!course) return [];
    return course.unidades.flatMap((unit) => {
      return unit.temas.map((t, idx) => {
        const key = `${unit.id}/${t.id}`;
        const operadas: StationId[] = recorrido.operadasPorTema[key] || [];
        const todasOperadas = operadas.length >= 5;

        return {
          id: t.id,
          unitId: unit.id,
          unitNumero: unit.numero,
          temaNumero: idx + 1,
          nombre: t.nombre,
          porcentaje: t.porcentajeApi,
          actividadesCompletadas: t.actividadesCompletadas,
          estado: todasOperadas ? 'completada' : operadas.length > 0 ? 'en_curso' : 'pendiente',
          operadas,
        };
      });
    });
  }, [course, recorrido]);

  // Misiones filtradas para la lista
  const misionesFiltradas = useMemo(() => {
    return todasLasMisiones.filter((m) => {
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matches = m.nombre.toLowerCase().includes(term) || m.id.toLowerCase().includes(term);
        if (!matches) return false;
      }

      if (missionFilter === 'zona') {
        return m.unitId === activeZoneUnitId;
      }
      if (missionFilter === 'completadas') {
        return m.estado === 'completada';
      }
      if (missionFilter === 'pendientes') {
        return m.estado === 'pendiente' || m.estado === 'en_curso';
      }
      return true; // 'todas'
    });
  }, [todasLasMisiones, missionFilter, activeZoneUnitId, searchTerm]);

  // Acción para ir directamente a producir el tema en La Máquina
  const handleGoToMachineTopic = (unitId: UnitId, topicId: string) => {
    openTopic(unitId, topicId);
    setMode('map');
  };

  return (
    <div
      style={{
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '2rem 1.5rem 5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
      }}
    >
      {/* =========================================================================
          ENCABEZADO HERO: JUEGO DE ROLES ACADÉMICOS
          ========================================================================= */}
      <div
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-lg)',
          padding: '2.25rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-atlas-md)',
          border: '1px solid rgba(234, 88, 12, 0.25)',
        }}
      >
        {/* Glow de fondo decorativo */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-40px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '30%',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.18), rgba(249, 115, 22, 0.08))',
                border: '1px solid rgba(234, 88, 12, 0.35)',
                color: 'var(--color-terracotta)',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={14} className="spin" style={{ animationDuration: '8s' }} />
              Gamificación Epistemológica & Acreditación de Investigación
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ maxWidth: '820px' }}>
              <h1
                style={{
                  fontSize: '2.35rem',
                  fontWeight: 900,
                  color: 'var(--color-ink)',
                  margin: 0,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.15,
                }}
              >
                Juego de Roles Académicos
              </h1>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--color-ink-secondary)',
                  margin: '0.65rem 0 0',
                  lineHeight: 1.6,
                }}
              >
                Asume una especialización técnica, explora las 4 zonas del campus y supera las preguntas problema del currículo para ascender en la jerarquía académica desde <strong>Explorador</strong> hasta <strong>Maestro de Minería de Datos</strong> con telemetría de laboratorio real.
              </p>
            </div>

            {/* Credencial Rápida de Nivel */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.15rem',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(234, 88, 12, 0.06))',
                padding: '0.85rem 1.4rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                boxShadow: 'var(--shadow-atlas-sm)',
              }}
            >
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Rango Curricular
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-blue-ink)' }}>
                  {level.rango}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-terracotta)', fontWeight: 700 }}>
                  {xp} XP Acumulados
                </div>
              </div>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--color-blue-ink), #1D4ED8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                }}
              >
                {level.nivel}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECCIÓN 1: CARNET DEL INVESTIGADOR Y ESPECIALIZACIÓN DE ROL
          ========================================================================= */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Shield size={18} style={{ color: 'var(--color-terracotta)' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
              1. Carnet del Investigador y Selección de Especialidad
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-secondary)', margin: 0 }}>
            Elige tu especialidad académica activa. Cada rol adapta tu credencial, destaca tus estaciones clave en La Máquina y define tu misión prioritaria.
          </p>
        </div>

        {/* Grilla de Roles Académicos con Micro-Interacciones */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.15rem',
          }}
        >
          {ROLES_ACADEMICOS.map((rol) => {
            const isSelected = rol.id === selectedRoleId;
            return (
              <div
                key={rol.id}
                onClick={() => handleSelectRole(rol.id)}
                className={`interactive-role-card ${isSelected ? 'pulse-glow-terracotta' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  padding: '1.35rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--color-card)' : 'var(--color-card)',
                  border: isSelected
                    ? `2px solid ${rol.color}`
                    : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isSelected
                    ? `0 12px 30px -4px ${rol.borderCol}, 0 0 0 1px ${rol.color}`
                    : 'var(--shadow-atlas-xs)',
                  background: isSelected
                    ? `linear-gradient(145deg, var(--color-card) 60%, ${rol.bgSoft})`
                    : 'var(--color-card)',
                }}
              >
                {/* Insignia de Rol Activo */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: rol.color,
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      letterSpacing: '0.04em',
                      boxShadow: `0 2px 8px ${rol.color}80`,
                    }}
                  >
                    ACTIVO
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: isSelected
                        ? `linear-gradient(135deg, ${rol.color}, ${rol.colorLight})`
                        : rol.bgSoft,
                      color: isSelected ? '#FFFFFF' : rol.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected ? `0 4px 14px ${rol.color}60` : 'none',
                      transition: 'all 0.28s ease',
                    }}
                  >
                    {rol.icono}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: rol.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {rol.categoria}
                    </span>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--color-ink)' }}>
                      {rol.titulo}
                    </h3>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--color-ink-secondary)', fontStyle: 'italic', lineHeight: 1.45 }}>
                  {rol.lema}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
                    Estaciones de Trabajo:
                  </div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-ink)', marginTop: '2px' }}>
                    {rol.estacionesClave.join(' • ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Credencial Oficial del Investigador (Carnet de Alta Gama) */}
        <div
          className="glass-panel credential-gleam"
          style={{
            borderRadius: 'var(--radius-lg)',
            border: `1.5px solid ${activeRole.color}`,
            padding: '1.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
            boxShadow: `0 14px 35px -6px ${activeRole.borderCol}`,
            position: 'relative',
          }}
        >
          {/* Bloque Izquierdo: Datos de Acreditación */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  backgroundColor: activeRole.color,
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Acreditación Oficial
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  color: 'var(--color-ink-muted)',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 6px #10B981',
                  }}
                />
                Operador en Línea: <strong>Bogota</strong> · <strong>{unidadesOperadasCount} de 4</strong> Unidades Dominadas
              </span>
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-ink)', margin: 0, letterSpacing: '-0.01em' }}>
              {activeRole.titulo}
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.6 }}>
              {activeRole.descripcion}
            </p>

            <div
              style={{
                backgroundColor: activeRole.bgSoft,
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-sm)',
                borderLeft: `4px solid ${activeRole.color}`,
                fontSize: '0.82rem',
                color: 'var(--color-ink)',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: activeRole.color }}>Habilidad Pasiva de Investigación:</strong>{' '}
              {activeRole.habilidadPasiva}
            </div>
          </div>

          {/* Bloque Derecho: Medidor Holográfico de XP y Rango */}
          <div
            style={{
              backgroundColor: 'var(--color-paper)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: 'var(--shadow-atlas-xs)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Evolución Curricular
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-ink)' }}>
                  {level.rango} <span style={{ fontSize: '0.85rem', color: 'var(--color-blue-ink)', fontWeight: 700 }}>(Nivel {level.nivel})</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-terracotta)' }}>
                  {xp} XP
                </span>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>
                  Siguiente meta: {level.xpSiguienteNivel} XP
                </div>
              </div>
            </div>

            {/* Barra de Progreso XP Brillante */}
            <div
              style={{
                width: '100%',
                height: '12px',
                backgroundColor: 'var(--color-border)',
                borderRadius: '9999px',
                overflow: 'hidden',
                padding: '2px',
              }}
            >
              <div
                style={{
                  width: `${level.porcentajeNivel}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--color-blue-ink), var(--color-terracotta))',
                  borderRadius: '9999px',
                  boxShadow: '0 0 10px rgba(234, 88, 12, 0.45)',
                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>

            {/* Hitos de Rango */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>
              {RANGOS_INVESTIGACION.map((r, i) => {
                const isPassed = level.nivel >= i + 1;
                return (
                  <span
                    key={r.rango}
                    style={{
                      fontWeight: isPassed ? 800 : 500,
                      color: isPassed ? 'var(--color-blue-ink)' : 'var(--color-ink-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    {isPassed ? '✓' : '○'} {r.rango}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 2: MAPA ESQUEMÁTICO DEL CAMPUS DE CONOCIMIENTO (4 ZONAS)
          ========================================================================= */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Layers size={18} style={{ color: 'var(--color-blue-ink)' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
              2. El Campus de Conocimiento: 4 Zonas de Investigación
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-secondary)', margin: 0 }}>
            Diagrama esquemático del flujo de investigación. Haz clic en cualquier estación del campus para consultar su briefing y encargo curricular.
          </p>
        </div>

        {/* Diagrama Esquemático Interactivo SVG (Pipeline de Datos del Campus) */}
        <div
          className="glass-panel"
          style={{
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem 1rem',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <svg
              viewBox="0 0 900 110"
              style={{ minWidth: '750px', width: '100%', height: 'auto', display: 'block' }}
            >
              {/* Tubería Base */}
              <line
                x1="80"
                y1="55"
                x2="820"
                y2="55"
                stroke="var(--color-border)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Tubería Animada de Datos */}
              <line
                x1="80"
                y1="55"
                x2="820"
                y2="55"
                stroke="var(--color-terracotta)"
                strokeWidth="3"
                strokeLinecap="round"
                className="campus-pipeline-wire"
              />

              {/* 4 Nodos del Campus */}
              {[
                { x: 110, id: 'UNIDAD_1', num: 1, label: 'Biblioteca', sub: 'Ecuaciones & PRISMA' },
                { x: 340, id: 'UNIDAD_2', num: 2, label: 'Taller Teórico', sub: 'Matemática & CART' },
                { x: 570, id: 'UNIDAD_3', num: 3, label: 'Laboratorio R', sub: 'Scripts & Datos' },
                { x: 800, id: 'UNIDAD_4', num: 4, label: 'Sustentación', sub: 'LaTeX & Tribunal' },
              ].map((nodo) => {
                const isSelected = nodo.id === activeZoneUnitId;
                return (
                  <g
                    key={nodo.id}
                    onClick={() => setActiveZoneUnitId(nodo.id as UnitId)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Anillo de pulso si está seleccionado */}
                    {isSelected && (
                      <circle
                        cx={nodo.x}
                        cy="55"
                        r="32"
                        fill="rgba(234, 88, 12, 0.15)"
                        stroke="var(--color-terracotta)"
                        strokeWidth="1.5"
                      />
                    )}
                    {/* Círculo Principal */}
                    <circle
                      cx={nodo.x}
                      cy="55"
                      r="22"
                      fill={isSelected ? 'var(--color-terracotta)' : 'var(--color-card)'}
                      stroke={isSelected ? '#FFFFFF' : 'var(--color-blue-ink)'}
                      strokeWidth="3"
                      style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))', transition: 'all 0.25s ease' }}
                    />
                    <text
                      x={nodo.x}
                      y="61"
                      textAnchor="middle"
                      fill={isSelected ? '#FFFFFF' : 'var(--color-blue-ink)'}
                      fontWeight="900"
                      fontSize="14"
                    >
                      {nodo.num}
                    </text>
                    {/* Etiquetas */}
                    <text
                      x={nodo.x}
                      y="92"
                      textAnchor="middle"
                      fill="var(--color-ink)"
                      fontWeight={isSelected ? '800' : '600'}
                      fontSize="12"
                    >
                      {nodo.label}
                    </text>
                    <text
                      x={nodo.x}
                      y="105"
                      textAnchor="middle"
                      fill="var(--color-ink-muted)"
                      fontSize="10"
                    >
                      {nodo.sub}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Tarjetas de las 4 Zonas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {ZONAS_CAMPUS.map((zona) => {
              const isSelected = zona.unitId === activeZoneUnitId;
              const uData = course?.unidades.find((u) => u.id === zona.unitId);
              const pct = uData?.porcentajeApi ?? 0;

              return (
                <div
                  key={zona.unitId}
                  onClick={() => setActiveZoneUnitId(zona.unitId)}
                  className="interactive-role-card"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--color-card)' : 'var(--color-card)',
                    border: isSelected ? `2px solid ${zona.color}` : '1px solid var(--color-border)',
                    cursor: 'pointer',
                    boxShadow: isSelected ? `0 10px 24px -4px ${zona.color}40` : 'var(--shadow-atlas-xs)',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? zona.color : 'rgba(0,0,0,0.04)',
                      color: isSelected ? '#FFFFFF' : zona.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: isSelected ? `0 4px 12px ${zona.color}50` : 'none',
                    }}
                  >
                    {zona.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: zona.color, textTransform: 'uppercase' }}>
                      Zona {zona.numero} · {uData?.temas.length || 0} Temas
                    </div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, margin: '2px 0 4px', color: 'var(--color-ink)' }}>
                      {zona.lugar}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '8px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '6px',
                          backgroundColor: 'var(--color-border)',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            backgroundColor: zona.color,
                            borderRadius: '9999px',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-ink)' }}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Briefing de la Zona Seleccionada (Pregunta Problema y Encargo del Comité) */}
        {activeEncargo && (
          <div
            className="glass-panel"
            style={{
              borderLeft: `6px solid ${activeZoneMeta.color}`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: 'var(--shadow-atlas-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span
                  style={{
                    backgroundColor: activeZoneMeta.color,
                    color: '#FFFFFF',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  Briefing Oficial · Unidad {activeZoneMeta.numero}
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-ink)' }}>
                  {activeEncargo.titulo}
                </span>
              </div>

              <span style={{ fontSize: '0.82rem', color: 'var(--color-ink-muted)' }}>
                Rango acreditado: <strong style={{ color: 'var(--color-blue-ink)' }}>{activeEncargo.rangoAlCompletar}</strong>
              </span>
            </div>

            {/* La Pregunta Problema Canónica */}
            <div
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.06)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                padding: '1.15rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-blue-ink)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.04em' }}>
                Pregunta Problema Curricular (AGENTS.md §2 y §7)
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-ink)', fontStyle: 'italic', lineHeight: 1.55 }}>
                «{activeEncargo.preguntaProblema}»
              </div>
            </div>

            {/* Encargo Narrativo */}
            <div style={{ fontSize: '0.9rem', color: 'var(--color-ink-secondary)', lineHeight: 1.65 }}>
              <strong style={{ color: 'var(--color-ink)' }}>Encargo del Comité Académico:</strong> {activeEncargo.encargoNarrativo}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-ink-muted)' }}>
                <strong>Entregable Clave:</strong> {activeEncargo.entregableClave}
              </div>

              <button
                type="button"
                onClick={() => {
                  const firstTopic = course?.unidades.find((u) => u.id === activeZoneUnitId)?.temas[0]?.id;
                  if (firstTopic) {
                    handleGoToMachineTopic(activeZoneUnitId, firstTopic);
                  }
                }}
                className="btn pulse-glow-terracotta"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.25rem',
                  backgroundColor: 'var(--color-terracotta)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span>Operar esta zona en La Máquina</span>
                <Play size={15} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECCIÓN 3: TABLERO DE MISIONES CURRICULARES (24 TEMAS)
          ========================================================================= */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Award size={18} style={{ color: 'var(--color-terracotta)' }} />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
                3. Tablero de Misiones Curriculares ({todasLasMisiones.length} Temas)
              </h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-secondary)', margin: 0 }}>
              Cada tema representa una misión de investigación con sus ecuaciones, documentos, dataset en R y artículo LaTeX.
            </p>
          </div>

          {/* Filtros de Misión y Buscador */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.65rem',
              }}
            >
              <Search size={14} style={{ color: 'var(--color-ink-muted)' }} />
              <input
                type="text"
                placeholder="Buscar misión..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.78rem',
                  color: 'var(--color-ink)',
                  width: '130px',
                }}
              />
            </div>

            {(['zona', 'todas', 'completadas', 'pendientes'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setMissionFilter(filter)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: missionFilter === filter ? 'var(--color-blue-ink)' : 'var(--color-border)',
                  backgroundColor: missionFilter === filter ? 'var(--color-blue-soft)' : 'var(--color-card)',
                  color: missionFilter === filter ? 'var(--color-blue-ink)' : 'var(--color-ink-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: missionFilter === filter ? 800 : 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s ease',
                }}
              >
                {filter === 'zona' ? `Zona ${activeZoneMeta.numero}` : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grilla de Tarjetas de Misión con Efectos Glassmorphic */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.15rem',
          }}
        >
          {misionesFiltradas.map((m) => {
            const isCompleted = m.estado === 'completada';
            const inProgress = m.estado === 'en_curso';

            return (
              <div
                key={`${m.unitId}-${m.id}`}
                className="interactive-mission-card glass-panel"
                style={{
                  borderRadius: 'var(--radius-md)',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft: isCompleted
                    ? '5px solid #10B981'
                    : inProgress
                    ? '5px solid var(--color-terracotta)'
                    : '5px solid var(--color-border)',
                }}
              >
                {/* Header de la Misión */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: 'var(--color-ink-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      U{m.unitNumero} · TEMA {m.temaNumero < 10 ? `0${m.temaNumero}` : m.temaNumero}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--color-ink)' }}>
                      {m.nombre}
                    </h3>
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: '9999px',
                      backgroundColor: isCompleted
                        ? 'rgba(16, 185, 129, 0.14)'
                        : inProgress
                        ? 'rgba(234, 88, 12, 0.14)'
                        : 'rgba(0,0,0,0.05)',
                      color: isCompleted
                        ? '#059669'
                        : inProgress
                        ? 'var(--color-terracotta)'
                        : 'var(--color-ink-muted)',
                    }}
                  >
                    {isCompleted ? '✓ Completada' : inProgress ? '⚙ En Curso' : '○ Pendiente'}
                  </span>
                </div>

                {/* Telemetría de Estaciones Operadas */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>
                    <span>Estaciones de La Máquina:</span>
                    <strong style={{ color: 'var(--color-ink)' }}>{m.operadas.length} de 5 operadas</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {(['terminal', 'biblioteca', 'laboratorio', 'escritorio', 'pizarra'] as StationId[]).map((st) => {
                      const isOp = m.operadas.includes(st);
                      return (
                        <div
                          key={st}
                          title={`${st}: ${isOp ? 'Operada con éxito' : 'Pendiente'}`}
                          style={{
                            flex: 1,
                            height: '7px',
                            borderRadius: '9999px',
                            backgroundColor: isOp ? '#10B981' : 'var(--color-border)',
                            boxShadow: isOp ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Botones de Acción Interactivos */}
                <div style={{ display: 'flex', gap: '0.65rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                  <button
                    type="button"
                    onClick={() => handleGoToMachineTopic(m.unitId, m.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      padding: '0.45rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(234, 88, 12, 0.08)',
                      border: '1px solid var(--color-terracotta-border)',
                      color: 'var(--color-terracotta)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Play size={13} />
                    <span>La Máquina</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openTopic(m.unitId, m.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      padding: '0.45rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-blue-soft)',
                      border: '1px solid var(--color-blue-border)',
                      color: 'var(--color-blue-ink)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>Ver Detalle</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 4: SALA DE HITOS Y LOGROS ACADÉMICOS (VERIFICABLES)
          ========================================================================= */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Award size={18} style={{ color: '#F59E0B' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
              4. Sala de Hitos y Logros Académicos
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-ink-secondary)', margin: 0 }}>
            Desbloqueos verificables basados exclusivamente en evidencias reales (cero simulaciones ni datos inventados).
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.15rem',
          }}
        >
          {achievements.map((ach) => {
            return (
              <div
                key={ach.id}
                className="interactive-mission-card glass-panel"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1.35rem',
                  borderRadius: 'var(--radius-md)',
                  border: ach.desbloqueado
                    ? '1.5px solid rgba(16, 185, 129, 0.45)'
                    : '1px dashed var(--color-border)',
                  boxShadow: ach.desbloqueado
                    ? '0 6px 20px rgba(16, 185, 129, 0.15)'
                    : 'none',
                  opacity: ach.desbloqueado ? 1 : 0.72,
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: ach.desbloqueado
                      ? 'rgba(16, 185, 129, 0.16)'
                      : 'rgba(0,0,0,0.04)',
                    color: ach.desbloqueado ? '#059669' : 'var(--color-ink-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: ach.desbloqueado ? '0 0 12px rgba(16, 185, 129, 0.35)' : 'none',
                  }}
                >
                  {ach.desbloqueado ? <CheckCircle2 size={24} /> : <Award size={24} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
                      {ach.titulo}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: ach.desbloqueado ? 'var(--color-terracotta)' : 'var(--color-ink-muted)',
                      }}
                    >
                      +{ach.xp} XP
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--color-ink-secondary)', margin: '5px 0 0', lineHeight: 1.45 }}>
                    {ach.descripcion}
                  </p>

                  <div style={{ marginTop: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: ach.desbloqueado ? '#059669' : 'var(--color-ink-muted)',
                      }}
                    >
                      {ach.desbloqueado ? '✓ DESBLOQUEADO' : '🔒 BLOQUEADO'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
