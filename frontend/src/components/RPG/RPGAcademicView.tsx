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
  bgSoft: string;
  borderCol: string;
  estacionesClave: string[];
  misionPrioritaria: string;
  habilidadPasiva: string;
  descripcion: string;
}

export const ROLES_ACADEMICOS: AcademicRoleDefinition[] = [
  {
    id: 'documentalista',
    titulo: 'Documentalista Epistemológico',
    lema: '«Trazabilidad rigurosa y literatura indexada sin sesgos»',
    icono: <BookOpen size={22} />,
    color: '#0284C7',
    bgSoft: 'rgba(2, 132, 199, 0.1)',
    borderCol: 'rgba(2, 132, 199, 0.3)',
    estacionesClave: ['Terminal de Consultas', 'Biblioteca y Matriz DOI'],
    misionPrioritaria: 'Formular ecuaciones booleanas PRISMA e indexar artículos revisados por pares.',
    habilidadPasiva: 'Agudeza Bibliométrica: Detección prioritaria de pertinencia Alta y DOI válidos.',
    descripcion: 'Especialista en la fundamentación documental. Concilia las preguntas de investigación con operadores booleanos estructurados en Google Scholar y bases bibliográficas.',
  },
  {
    id: 'cientifico_r',
    titulo: 'Científico de Algoritmos y R',
    lema: '«Cómputo reproducible, semillas fijas y cero datos simulados»',
    icono: <FlaskConical size={22} />,
    color: '#B5532F',
    bgSoft: 'rgba(181, 83, 47, 0.1)',
    borderCol: 'rgba(181, 83, 47, 0.3)',
    estacionesClave: ['Laboratorio de R', 'Resultados Cuantitativos'],
    misionPrioritaria: 'Ejecutar los 24 scripts nativos en R, evaluando silueta, WCSS, matrices de confusión y AUC.',
    habilidadPasiva: 'Rigor Cuantitativo: Salida estándar verificada con Exit Code 0 y exportación diagnóstica.',
    descripcion: 'Pilar computacional del proyecto. Somete a prueba los algoritmos estadísticos (K-Means, Árboles CART, Redes Neuronales) sobre datasets tabulares.',
  },
  {
    id: 'ingeniero_datos',
    titulo: 'Ingeniero de Datos y Preprocesamiento',
    lema: '«Estructura tabular limpia y arquitectura multidimensional»',
    icono: <Database size={22} />,
    color: '#10B981',
    bgSoft: 'rgba(16, 185, 129, 0.1)',
    borderCol: 'rgba(16, 185, 129, 0.3)',
    estacionesClave: ['Terminal', 'Curaduría de Datasets CSV'],
    misionPrioritaria: 'Garantizar la integridad de los 26 datasets y las transformaciones KDD / CRISP-DM.',
    habilidadPasiva: 'Integridad Estructural: Detección de tipos de datos, headers y matrices sin imputación forzada.',
    descripcion: 'Guardián de la calidad de los datos. Prepara las particiones analíticas, gestiona operaciones OLAP y certifica la procedencia de cada archivo CSV.',
  },
  {
    id: 'editor_latex',
    titulo: 'Editor Científico LaTeX',
    lema: '«Formalismo matemático, síntesis KaTeX y estructura canónica»',
    icono: <FileCode2 size={22} />,
    color: '#8B5CF6',
    bgSoft: 'rgba(139, 92, 246, 0.1)',
    borderCol: 'rgba(139, 92, 246, 0.3)',
    estacionesClave: ['Escritorio Editorial', 'Laboratorio LaTeX'],
    misionPrioritaria: 'Estructurar los 26 manuscritos formales (.tex) con fórmulas matemáticas y figuras diagnósticas.',
    habilidadPasiva: 'Síntesis KaTeX: Renderizado tipográfico impecable de ecuaciones algebraicas y bibliografía.',
    descripcion: 'Responsable de la comunicación científica. Traduce los hallazgos experimentales a manuscritos académicos estandarizados listos para publicación.',
  },
  {
    id: 'defensor_tesis',
    titulo: 'Ponente y Defensor de Tesis',
    lema: '«Evidencia empírica ante el comité académico evaluador»',
    icono: <GraduationCap size={22} />,
    color: '#F59E0B',
    bgSoft: 'rgba(245, 158, 11, 0.1)',
    borderCol: 'rgba(245, 158, 11, 0.3)',
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
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '2rem 1.5rem 5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
      }}
    >
      {/* =========================================================================
          ENCABEZADO PRINCIPAL: JUEGO DE ROLES ACADÉMICOS
          ========================================================================= */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(181, 83, 47, 0.12)',
              color: 'var(--color-terracotta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Award size={24} />
          </div>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--color-terracotta)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Gamificación Epistemológica y Roles de Investigación
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: 'var(--color-ink)',
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              Juego de Roles Académicos
            </h1>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-ink-secondary)',
                margin: '0.35rem 0 0',
                maxWidth: '820px',
                lineHeight: 1.5,
              }}
            >
              Asume una especialización académica, recorre las 4 zonas del campus, resuelve las preguntas problema de cada unidad y desbloquea rangos desde <strong>Explorador</strong> hasta <strong>Maestro de Minería de Datos</strong> con telemetría real.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: 'var(--color-card)',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Rango Actual
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-blue-ink)' }}>
                {level.rango}
              </div>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-blue-soft)',
                border: '2px solid var(--color-blue-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-blue-ink)',
                fontWeight: 900,
                fontSize: '1.1rem',
              }}
            >
              {level.nivel}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECCIÓN 1: CARNÉ DEL INVESTIGADOR Y SELECTOR DE ROL ACADÉMICO
          ========================================================================= */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
              1. Carné del Investigador y Rol de Especialización
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-secondary)', margin: '0.2rem 0 0' }}>
              Selecciona el rol con el que deseas operar hoy. Cada rol prioriza ciertas estaciones y métodos en La Máquina.
            </p>
          </div>
        </div>

        {/* Carrusel / Grilla de Selección de Roles */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {ROLES_ACADEMICOS.map((rol) => {
            const isSelected = rol.id === selectedRoleId;
            return (
              <div
                key={rol.id}
                onClick={() => handleSelectRole(rol.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? rol.bgSoft : 'var(--color-card)',
                  border: isSelected ? `2px solid ${rol.color}` : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isSelected ? `0 4px 16px ${rol.borderCol}` : 'var(--shadow-xs)',
                  position: 'relative',
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: rol.color,
                      color: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    ROL ACTIVO
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? rol.color : 'rgba(0,0,0,0.04)',
                      color: isSelected ? '#FFFFFF' : rol.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {rol.icono}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
                      {rol.titulo}
                    </h3>
                  </div>
                </div>

                <div style={{ fontSize: '0.76rem', color: 'var(--color-ink-secondary)', fontStyle: 'italic', lineHeight: 1.4 }}>
                  {rol.lema}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '0.4rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
                    Estaciones Clave:
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-ink)', marginTop: '2px' }}>
                    {rol.estacionesClave.join(' • ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ficha Detallada del Rol Activo & Progreso de Rango */}
        <div
          style={{
            backgroundColor: 'var(--color-card)',
            border: `1px solid ${activeRole.borderCol}`,
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Bloque Izquierdo: Descripción del Rol */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  backgroundColor: activeRole.color,
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                Especialidad Operativa
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
                Investigador ID: <strong>Bogota (Operador)</strong> · <strong>{unidadesOperadasCount} de 4</strong> Unidades Dominadas
              </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-ink)', margin: 0 }}>
              {activeRole.titulo}
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.5 }}>
              {activeRole.descripcion}
            </p>

            <div
              style={{
                backgroundColor: activeRole.bgSoft,
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                borderLeft: `4px solid ${activeRole.color}`,
                fontSize: '0.8rem',
                color: 'var(--color-ink)',
                lineHeight: 1.4,
              }}
            >
              <strong>Habilidad Pasiva:</strong> {activeRole.habilidadPasiva}
            </div>
          </div>

          {/* Bloque Derecho: Medidor de Rango & Experiencia Académica */}
          <div
            style={{
              backgroundColor: 'var(--color-paper)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
                  Progreso al siguiente rango
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-ink)' }}>
                  {level.rango} (Nivel {level.nivel})
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-terracotta)' }}>
                  {xp} XP
                </span>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-secondary)' }}>
                  Objetivo: {level.xpSiguienteNivel} XP
                </div>
              </div>
            </div>

            {/* Barra de Progreso XP */}
            <div
              style={{
                width: '100%',
                height: '10px',
                backgroundColor: 'var(--color-border)',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${level.porcentajeNivel}%`,
                  height: '100%',
                  backgroundColor: 'var(--color-terracotta)',
                  borderRadius: '6px',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>

            {/* Escala de Rangos Curriculares */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', fontSize: '0.7rem', color: 'var(--color-ink-muted)' }}>
              {RANGOS_INVESTIGACION.map((r, i) => {
                const isPassed = level.nivel >= i + 1;
                return (
                  <span
                    key={r.rango}
                    style={{
                      fontWeight: isPassed ? 700 : 500,
                      color: isPassed ? 'var(--color-blue-ink)' : 'var(--color-ink-muted)',
                    }}
                  >
                    {r.rango} {isPassed ? '✓' : ''}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 2: MAPA INTERACTIVO DE ZONAS ACADÉMICAS (EL CAMPUS)
          ========================================================================= */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
            2. El Campus de Conocimiento: Zonas de Investigación
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-secondary)', margin: '0.2rem 0 0' }}>
            Cada zona física del campus corresponde a una Unidad Curricular con su propia pregunta problema y misión.
          </p>
        </div>

        {/* Selector de 4 Zonas del Campus */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.9rem',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--color-card)' : 'var(--color-paper)',
                  border: isSelected ? `2px solid ${zona.color}` : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? zona.color : 'rgba(0,0,0,0.05)',
                    color: isSelected ? '#FFFFFF' : zona.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {zona.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: zona.color, textTransform: 'uppercase' }}>
                    Zona {zona.numero} · {uData?.temas.length || 0} Temas
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '2px 0 4px', color: 'var(--color-ink)' }}>
                    {zona.lugar}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-secondary)', marginBottom: '8px' }}>
                    {zona.nombre}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        flex: 1,
                        height: '6px',
                        backgroundColor: 'var(--color-border)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: zona.color,
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                      {pct}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Briefing de la Zona Seleccionada (Pregunta Problema y Encargo del Comité) */}
        {activeEncargo && (
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              border: `1px solid var(--color-border)`,
              borderLeft: `5px solid ${activeZoneMeta.color}`,
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    backgroundColor: activeZoneMeta.color,
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  Briefing Oficial · Unidad {activeZoneMeta.numero}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-ink)' }}>
                  {activeEncargo.titulo}
                </span>
              </div>

              <span style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
                Rango al completar: <strong style={{ color: 'var(--color-blue-ink)' }}>{activeEncargo.rangoAlCompletar}</strong>
              </span>
            </div>

            {/* La Pregunta Problema */}
            <div
              style={{
                backgroundColor: 'rgba(31, 58, 95, 0.05)',
                border: '1px solid rgba(31, 58, 95, 0.15)',
                padding: '1rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-blue-ink)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Pregunta Problema Curricular (AGENTS.md §2 y §7)
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-ink)', fontStyle: 'italic', lineHeight: 1.5 }}>
                «{activeEncargo.preguntaProblema}»
              </div>
            </div>

            {/* Encargo Narrativo */}
            <div style={{ fontSize: '0.88rem', color: 'var(--color-ink-secondary)', lineHeight: 1.6 }}>
              <strong>Encargo del Comité Académico:</strong> {activeEncargo.encargoNarrativo}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
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
                className="btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 1rem',
                  backgroundColor: 'var(--color-terracotta)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span>Operar esta zona en La Máquina</span>
                <Play size={14} />
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
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
              3. Tablero de Misiones Curriculares ({todasLasMisiones.length} Temas)
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-secondary)', margin: '0.2rem 0 0' }}>
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
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: missionFilter === filter ? 'var(--color-blue-ink)' : 'var(--color-border)',
                  backgroundColor: missionFilter === filter ? 'var(--color-blue-soft)' : 'var(--color-card)',
                  color: missionFilter === filter ? 'var(--color-blue-ink)' : 'var(--color-ink-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: missionFilter === filter ? 700 : 500,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {filter === 'zona' ? `Zona ${activeZoneMeta.numero}` : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grilla de Tarjetas de Misión */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1rem',
          }}
        >
          {misionesFiltradas.map((m) => {
            const isCompleted = m.estado === 'completada';
            const inProgress = m.estado === 'en_curso';

            return (
              <div
                key={`${m.unitId}-${m.id}`}
                style={{
                  backgroundColor: 'var(--color-card)',
                  borderRadius: 'var(--radius-md)',
                  border: isCompleted
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : inProgress
                    ? '1px solid var(--color-terracotta-border)'
                    : '1px solid var(--color-border)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  boxShadow: 'var(--shadow-xs)',
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
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '2px 0 0', color: 'var(--color-ink)' }}>
                      {m.nombre}
                    </h3>
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: isCompleted
                        ? 'rgba(16, 185, 129, 0.12)'
                        : inProgress
                        ? 'rgba(181, 83, 47, 0.12)'
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-ink-muted)' }}>
                    <span>Estaciones Operadas:</span>
                    <strong>{m.operadas.length} de 5</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {(['terminal', 'biblioteca', 'laboratorio', 'escritorio', 'pizarra'] as StationId[]).map((st) => {
                      const isOp = m.operadas.includes(st);
                      return (
                        <div
                          key={st}
                          title={`${st}: ${isOp ? 'Operada con éxito' : 'Pendiente'}`}
                          style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '3px',
                            backgroundColor: isOp ? '#10B981' : 'var(--color-border)',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Botones de Acción */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <button
                    type="button"
                    onClick={() => handleGoToMachineTopic(m.unitId, m.id)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(181, 83, 47, 0.08)',
                      border: '1px solid var(--color-terracotta-border)',
                      color: 'var(--color-terracotta)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Play size={12} />
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
                      padding: '0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-blue-soft)',
                      border: '1px solid var(--color-blue-border)',
                      color: 'var(--color-blue-ink)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <span>Ver Detalle</span>
                    <ArrowRight size={12} />
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
            4. Sala de Hitos y Logros Académicos
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-secondary)', margin: '0.2rem 0 0' }}>
            Desbloqueos verificables basados exclusivamente en evidencias reales (cero simulaciones ni datos inventados).
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr)))',
            gap: '1rem',
          }}
        >
          {achievements.map((ach) => {
            return (
              <div
                key={ach.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: ach.desbloqueado ? 'var(--color-card)' : 'var(--color-paper)',
                  border: ach.desbloqueado
                    ? '1px solid rgba(16, 185, 129, 0.4)'
                    : '1px dashed var(--color-border)',
                  boxShadow: ach.desbloqueado ? 'var(--shadow-xs)' : 'none',
                  opacity: ach.desbloqueado ? 1 : 0.75,
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: ach.desbloqueado
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'rgba(0,0,0,0.05)',
                    color: ach.desbloqueado ? '#059669' : 'var(--color-ink-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {ach.desbloqueado ? <CheckCircle2 size={20} /> : <Award size={20} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
                      {ach.titulo}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: ach.desbloqueado ? 'var(--color-terracotta)' : 'var(--color-ink-muted)',
                      }}
                    >
                      +{ach.xp} XP
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-secondary)', margin: '4px 0 0', lineHeight: 1.4 }}>
                    {ach.descripcion}
                  </p>

                  <div style={{ marginTop: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: ach.desbloqueado ? '#059669' : 'var(--color-ink-muted)',
                      }}
                    >
                      {ach.desbloqueado ? 'DESBLOQUEADO' : 'BLOQUEADO'}
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
