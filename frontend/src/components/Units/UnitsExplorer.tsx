import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ENCARGOS_UNIDADES } from '../../data/narrativa';
import { getCurriculum } from '../../services/unitService';
import {
  // Card,
  Banner,
  RoutePath,
  MissionCard,
  Tabs,
  StatusBadge,
  // Button,
  type RouteNode,
} from '../ui';
import { BookOpen } from 'lucide-react';
import type { UnitId } from '../../types/domain';

export const UnitsExplorer: React.FC = () => {
  const { course, openTopic } = useApp();
  const [selectedUnitId, setSelectedUnitId] = useState<UnitId>('UNIDAD_1');
  const [curriculumMap, setCurriculumMap] = useState<Record<number, string>>({});

  useEffect(() => {
    let mounted = true;
    getCurriculum().then((unidades) => {
      if (mounted) {
        const map: Record<number, string> = {};
        unidades.forEach((u) => {
          map[u.numero] = u.pregunta_problema;
        });
        setCurriculumMap(map);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!course) return null;

  const currentUnit = course.unidades.find((u) => u.id === selectedUnitId) || course.unidades[0];
  const unitNumber = (currentUnit.numero || 1) as 1 | 2 | 3 | 4;
  const encargoData = ENCARGOS_UNIDADES[unitNumber] || ENCARGOS_UNIDADES[1];
  const preguntaProblema = curriculumMap[unitNumber] || encargoData.preguntaProblema;

  const ZONE_NAMES = ['Biblioteca', 'Taller de Teoría', 'Laboratorio', 'Sala de Sustentación'];
  const currentZoneName = ZONE_NAMES[unitNumber - 1] || 'Biblioteca';

  // Pestañas de Unidades con nombre de zona
  const unitTabs = course.unidades.map((u, idx) => ({
    id: u.id,
    label: `${ZONE_NAMES[idx] || `Unidad ${u.numero}`}`,
    badge: `${u.porcentajeApi}%`,
  }));

  // Nodos para RoutePath de los temas de la unidad seleccionada
  const topicNodes: RouteNode[] = currentUnit.temas.map((t, idx) => {
    const isDone = t.porcentajeApi >= 85;
    return {
      id: t.id,
      label: `T${idx + 1}`,
      sublabel: t.nombre.length > 20 ? `${t.nombre.slice(0, 18)}...` : t.nombre,
      status: isDone ? 'completado' : t.porcentajeApi > 0 ? 'actual' : 'pendiente',
    };
  });

  return (
    <div
      style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '2rem 1.5rem 5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      {/* 1. Selector Superior de Unidades */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Exploración Curricular
          </span>
          <h2 className="atlas-title" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: '0.2rem 0 0' }}>
            Zonas de Minería de Datos
          </h2>
        </div>

        <Tabs
          variant="pill"
          tabs={unitTabs}
          activeTab={selectedUnitId}
          onChange={(id) => setSelectedUnitId(id as UnitId)}
        />
      </div>

      {/* 2. Banner de Encargo de la Unidad (Pregunta Problema de narrativa.ts) */}
      <Banner
        variant="atlas"
        titulo={`Zona ${unitNumber}: ${currentZoneName} — ${encargoData.titulo}`}
        subtitulo={encargoData.subtitulo}
        icono={<BookOpen size={24} />}
        metricaPrincipal={{
          valor: `${currentUnit.temas.length}`,
          etiqueta: 'Temas',
        }}
        metricaSecundaria={{
          valor: `${currentUnit.porcentajeApi}%`,
          etiqueta: 'Avance Real',
        }}
      >
        <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--color-card-muted)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-terracotta-dark)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Pregunta Problema (Encargo Institucional):
            </div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-ink)', fontStyle: 'italic', lineHeight: 1.45 }}>
              "{preguntaProblema}"
            </div>
          </div>

          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', lineHeight: 1.5 }}>
            <strong>Misión:</strong> {encargoData.encargoNarrativo}
          </div>
        </div>
      </Banner>

      {/* 3. Ruta de Nodos de Temas (RoutePath) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <h3 className="atlas-title" style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>
              Itinerario de Temas de la Unidad {unitNumber}
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', margin: '0.15rem 0 0' }}>
              Haz clic en cualquier nodo para abrir la página del tema con todas sus evidencias.
            </p>
          </div>
          <StatusBadge
            status={currentUnit.porcentajeApi >= 100 ? 'completado' : 'actual'}
            label={`${currentUnit.temas.filter((t) => t.porcentajeApi >= 85).length}/${currentUnit.temas.length} completados`}
            size="sm"
          />
        </div>

        <RoutePath
          nodes={topicNodes}
          onSelectNode={(topicId) => openTopic(selectedUnitId, topicId)}
        />
      </section>

      {/* 4. Lista de Misiones Académicas (MissionCard) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 className="atlas-title" style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>
          Misiones Temáticas de la Unidad
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {currentUnit.temas.map((topic, idx) => {
            const isCompleted = topic.porcentajeApi >= 85;
            const estado = isCompleted ? 'completada' : topic.porcentajeApi > 0 ? 'en_curso' : 'pendiente';

            return (
              <MissionCard
                key={topic.id}
                id={topic.id}
                unidadNumero={unitNumber}
                temaNumero={idx + 1}
                titulo={topic.nombre}
                encargo={encargoData.preguntaProblema}
                estado={estado}
                progresoPorcentaje={topic.porcentajeApi}
                pistas={{
                  documentosCount: topic.actividades.documentos ? 1 : 0,
                  tieneVideoClip: false,
                }}
                evidencias={{
                  tieneResultados: topic.actividades.resultados,
                  tieneScriptR: topic.actividades.ejemplo_r,
                  tieneLatex: topic.actividades.latex,
                }}
                onAbrir={() => openTopic(selectedUnitId, topic.id)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};
