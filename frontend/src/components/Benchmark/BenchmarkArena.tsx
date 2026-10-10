import React, { useState } from 'react';
import katex from 'katex';
import {
  ALGORITHMS_REGISTRY,
  CLASSIC_MATCHUPS,
  type ClassicMatchup,
} from '../../data/benchmarkData';
import {
  Swords,
  Scale,
  ArrowRightLeft,
  Copy,
  Check,
  Printer,
  BrainCircuit,
  Gauge,
} from 'lucide-react';

export const BenchmarkArena: React.FC = () => {
  const [modelAId, setModelAId] = useState<string>('kmeans');
  const [modelBId, setModelBId] = useState<string>('hclust');
  const [copiedMd, setCopiedMd] = useState<boolean>(false);

  const modelA = ALGORITHMS_REGISTRY.find((m) => m.id === modelAId) || ALGORITHMS_REGISTRY[0];
  const modelB = ALGORITHMS_REGISTRY.find((m) => m.id === modelBId) || ALGORITHMS_REGISTRY[1];

  const activeMatchup = CLASSIC_MATCHUPS.find(
    (m) => (m.modeloAId === modelA.id && m.modeloBId === modelB.id) ||
           (m.modeloAId === modelB.id && m.modeloBId === modelA.id)
  );

  const handleSwap = () => {
    setModelAId(modelB.id);
    setModelBId(modelA.id);
  };

  const handleApplyMatchup = (m: ClassicMatchup) => {
    setModelAId(m.modeloAId);
    setModelBId(m.modeloBId);
  };

  const renderMath = (latex: string) => {
    try {
      const html = katex.renderToString(latex, { displayMode: false, throwOnError: false });
      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    } catch {
      return <code>{latex}</code>;
    }
  };

  const handleCopyMarkdown = () => {
    const md = `# BENCHMARK COMPARATIVO: ${modelA.nombre} VS. ${modelB.nombre}
**Cátedra de Minería de Datos · Análisis Asintótico y de Decisión**

| Criterio Técnico | ${modelA.alias} | ${modelB.alias} |
| :--- | :--- | :--- |
| **Paradigma** | ${modelA.paradigma} | ${modelB.paradigma} |
| **Naturaleza** | ${modelA.naturaleza} | ${modelB.naturaleza} |
| **Complejidad Entrenamiento** | \`${modelA.complejidadEntrenamiento}\` | \`${modelB.complejidadEntrenamiento}\` |
| **Complejidad Inferencia** | \`${modelA.complejidadInferencia}\` | \`${modelB.complejidadInferencia}\` |
| **Complejidad Espacial (RAM)** | \`${modelA.complejidadEspacial}\` | \`${modelB.complejidadEspacial}\` |
| **Requiere Normalización** | ${modelA.requiereNormalizacion} | ${modelB.requiereNormalizacion} |
| **Sensibilidad a Outliers** | ${modelA.sensibilidadOutliers} | ${modelB.sensibilidadOutliers} |
| **Manejo de Categóricas** | ${modelA.manejoCategoricas} | ${modelB.manejoCategoricas} |
| **Paquete / Función en R** | \`${modelA.funcionR}\` | \`${modelB.funcionR}\` |

### Criterio de Selección para Sustentación
- **${modelA.alias}:** ${modelA.criterioSustentacion}
- **${modelB.alias}:** ${modelB.criterioSustentacion}
`;
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem 1.5rem 5rem' }}>
      {/* 1. ENCABEZADO DE LA ARENA */}
      <div
        className="no-print"
        style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '1.5rem 1.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Swords size={13} /> Arena de Algoritmos
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Evaluación Asintótica &middot; Complejidad O(n) &middot; Trade-off Explicabilidad
              </span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginTop: '0.4rem', color: 'var(--text-main)' }}>
              Arena de Benchmark &amp; Comparador de Modelos
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '780px', marginTop: '0.25rem', lineHeight: 1.5 }}>
              Compara directamente dos modelos de minería de datos para justificar con rigor científico tu elección en la sustentación oral: costos de entrenamiento, memoria, resistencia al ruido y balance entre caja blanca y caja negra.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              {copiedMd ? <Check size={16} style={{ color: 'var(--c-completed)' }} /> : <Copy size={16} />}
              {copiedMd ? '¡Markdown Copiado!' : 'Copiar Comparativa'}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
            >
              <Printer size={16} /> Imprimir / PDF
            </button>
          </div>
        </div>

        {/* BARRA DE DUELOS CLÁSICOS RECOMENDADOS */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Duelos Clásicos de Sustentación (1-Clic):
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CLASSIC_MATCHUPS.map((m) => {
              const isSelected =
                (modelA.id === m.modeloAId && modelB.id === m.modeloBId) ||
                (modelA.id === m.modeloBId && modelB.id === m.modeloAId);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleApplyMatchup(m)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    border: isSelected ? '1px solid var(--c-interactive-hover)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--c-interactive-bg)' : 'var(--bg-elevated)',
                    color: isSelected ? 'var(--c-interactive-hover)' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Scale size={13} />
                  {m.titulo}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. SELECTORES Y CABECERA CARA A CARA */}
      <div
        className="dossier-print-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) auto minmax(280px, 1fr)',
          gap: '1.25rem',
          alignItems: 'stretch',
          marginBottom: '2rem',
        }}
      >
        {/* TARJETA MODELO A */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '4px solid #ea580c',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="badge badge-orange">Modelo A</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{modelA.paradigma}</span>
            </div>

            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Seleccionar Algoritmo A:
            </label>
            <select
              value={modelAId}
              onChange={(e) => setModelAId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                fontWeight: 700,
                marginBottom: '1rem',
                cursor: 'pointer',
              }}
            >
              {ALGORITHMS_REGISTRY.map((a) => (
                <option key={a.id} value={a.id} disabled={a.id === modelBId}>
                  {a.nombre}
                </option>
              ))}
            </select>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem' }}>
              {modelA.nombre}
            </h3>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: modelA.naturaleza.includes('Blanca') ? 'rgba(5, 150, 105, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                  color: modelA.naturaleza.includes('Blanca') ? '#10b981' : '#cbd5e1',
                  fontWeight: 600,
                }}
              >
                {modelA.naturaleza}
              </span>
              <span className="badge badge-purple">{modelA.paqueteR}</span>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#93c5fd', backgroundColor: '#0f172a', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
            {modelA.funcionR}
          </div>
        </div>

        {/* BOTÓN INTERCAMBIAR / VS */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#1e293b',
              border: '2px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '0.85rem',
              color: '#ea580c',
            }}
          >
            VS
          </div>
          <button
            type="button"
            onClick={handleSwap}
            title="Intercambiar algoritmos"
            className="no-print"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <ArrowRightLeft size={14} />
          </button>
        </div>

        {/* TARJETA MODELO B */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bg-surface)',
            borderTop: '4px solid #0284c7',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="badge badge-blue">Modelo B</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{modelB.paradigma}</span>
            </div>

            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Seleccionar Algoritmo B:
            </label>
            <select
              value={modelBId}
              onChange={(e) => setModelBId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                fontWeight: 700,
                marginBottom: '1rem',
                cursor: 'pointer',
              }}
            >
              {ALGORITHMS_REGISTRY.map((b) => (
                <option key={b.id} value={b.id} disabled={b.id === modelAId}>
                  {b.nombre}
                </option>
              ))}
            </select>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.5rem' }}>
              {modelB.nombre}
            </h3>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: modelB.naturaleza.includes('Blanca') ? 'rgba(5, 150, 105, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                  color: modelB.naturaleza.includes('Blanca') ? '#10b981' : '#cbd5e1',
                  fontWeight: 600,
                }}
              >
                {modelB.naturaleza}
              </span>
              <span className="badge badge-purple">{modelB.paqueteR}</span>
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#93c5fd', backgroundColor: '#0f172a', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
            {modelB.funcionR}
          </div>
        </div>
      </div>

      {/* 3. ARGUMENTACIÓN ANTE PREGUNTAS DEL JURADO */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          backgroundColor: '#0b1329',
          border: '1px solid #1e3a8a',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
          <BrainCircuit size={20} style={{ color: '#38bdf8' }} />
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            {activeMatchup ? 'Pregunta de Jurado para este Duelo Específico' : `Decisión Metodológica: ¿Por qué ${modelA.alias} y no ${modelB.alias}?`}
          </h4>
        </div>

        <p style={{ fontStyle: 'italic', color: '#93c5fd', fontSize: '0.9rem', marginBottom: '0.85rem' }}>
          &ldquo;{activeMatchup?.preguntaJurado || `¿Cuáles son las razones computacionales y empíricas para sustentar el uso de ${modelA.alias} frente a ${modelB.alias} en este problema?`}&rdquo;
        </p>

        <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '6px', fontSize: '0.865rem', color: '#e2e8f0', lineHeight: 1.6 }}>
          <strong>Argumento Recomendado para la Sustentación:</strong>{' '}
          {activeMatchup?.veredictoRecomendado || (
            <span>
              Para este conjunto de datos, <strong>{modelA.alias}</strong> fue seleccionado debido a su{' '}
              {modelA.dimensionesScore.velocidadEntrenamiento >= modelB.dimensionesScore.velocidadEntrenamiento ? 'mayor velocidad y menor complejidad temporal' : 'mayor capacidad explicativa y robustez frente a supuestos'}.{' '}
              {modelA.criterioSustentacion}
            </span>
          )}
        </div>
      </div>

      {/* 4. TABLA COMPARATIVA ASINTÓTICA Y TÉCNICA */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--bg-surface)',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}
      >
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Scale size={18} style={{ color: '#ea580c' }} />
          Matriz de Especificaciones Técnicas y Complejidad Asintótica
        </h4>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-subtle)', backgroundColor: 'var(--bg-elevated)' }}>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', width: '28%', color: 'var(--text-muted)' }}>Criterio de Evaluación</th>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', width: '36%', color: '#ea580c', fontWeight: 800 }}>{modelA.alias}</th>
              <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', width: '36%', color: '#0284c7', fontWeight: 800 }}>{modelB.alias}</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>Complejidad Entrenamiento</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{renderMath(modelA.complejidadEntrenamiento)}</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{renderMath(modelB.complejidadEntrenamiento)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>Complejidad Inferencia</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{renderMath(modelA.complejidadInferencia)}</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{renderMath(modelB.complejidadInferencia)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>Complejidad Espacial (Memoria)</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{renderMath(modelA.complejidadEspacial)}</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{renderMath(modelB.complejidadEspacial)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>Explicabilidad / Naturaleza</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{modelA.naturaleza}</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{modelB.naturaleza}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>Requiere scale() / Normalización</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>
                <span className={modelA.requiereNormalizacion.includes('Sí') ? 'badge badge-purple' : 'badge badge-gray'}>
                  {modelA.requiereNormalizacion}
                </span>
              </td>
              <td style={{ padding: '0.65rem 0.85rem' }}>
                <span className={modelB.requiereNormalizacion.includes('Sí') ? 'badge badge-purple' : 'badge badge-gray'}>
                  {modelB.requiereNormalizacion}
                </span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>Sensibilidad a Outliers</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{modelA.sensibilidadOutliers}</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{modelB.sensibilidadOutliers}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>Tratamiento de Categóricas</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{modelA.manejoCategoricas}</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{modelB.manejoCategoricas}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>Métricas de Evaluación Clave</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{modelA.metricasClave.join(' · ')}</td>
              <td style={{ padding: '0.65rem 0.85rem' }}>{modelB.metricasClave.join(' · ')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 5. RADAR DE DIMENSIONES Y PUNTUACIÓN (1-10) */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--bg-surface)',
          marginBottom: '2rem',
        }}
      >
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Gauge size={18} style={{ color: '#0284c7' }} />
          Perfil de Capacidades Multidimensionales (Puntuación 1 a 10)
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {[
            { label: 'Interpretabilidad y Explicabilidad (White-box)', key: 'interpretabilidad' as const },
            { label: 'Velocidad de Entrenamiento (Menor tiempo)', key: 'velocidadEntrenamiento' as const },
            { label: 'Escalabilidad con Grandes Volúmenes (Big Data)', key: 'escalabilidadDatos' as const },
            { label: 'Resistencia a Outliers y Ruido', key: 'resistenciaRuido' as const },
            { label: 'Capacidad de Ajuste en Fronteras Complejas', key: 'precisionFrontera' as const },
          ].map((dim) => {
            const scoreA = modelA.dimensionesScore[dim.key];
            const scoreB = modelB.dimensionesScore[dim.key];

            return (
              <div key={dim.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>{dim.label}</span>
                  <span>
                    <strong style={{ color: '#ea580c' }}>{modelA.alias}: {scoreA}/10</strong> vs{' '}
                    <strong style={{ color: '#0284c7' }}>{modelB.alias}: {scoreB}/10</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {/* Barra Modelo A */}
                  <div style={{ flex: 1, backgroundColor: 'var(--bg-elevated)', height: '10px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${scoreA * 10}%`,
                        backgroundColor: '#ea580c',
                        height: '100%',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>

                  {/* Barra Modelo B */}
                  <div style={{ flex: 1, backgroundColor: 'var(--bg-elevated)', height: '10px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${scoreB * 10}%`,
                        backgroundColor: '#0284c7',
                        height: '100%',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. FORTALEZAS Y DEBILIDADES LADO A LADO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* FORTALEZAS Y DEBILIDADES MODELO A */}
        <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)', borderTop: '3px solid #ea580c' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ea580c', marginBottom: '0.75rem' }}>
            Balance Analítico: {modelA.alias}
          </h4>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Fortalezas Principales:
            </div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
              {modelA.fortalezas.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Debilidades / Limitaciones:
            </div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              {modelA.debilidades.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* FORTALEZAS Y DEBILIDADES MODELO B */}
        <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)', borderTop: '3px solid #0284c7' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0284c7', marginBottom: '0.75rem' }}>
            Balance Analítico: {modelB.alias}
          </h4>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Fortalezas Principales:
            </div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
              {modelB.fortalezas.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Debilidades / Limitaciones:
            </div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              {modelB.debilidades.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
