import React, { useState } from 'react';
import { ALGORITHMS_REGISTRY, CLASSIC_MATCHUPS, type AlgorithmProfile, type ClassicMatchup } from '../../data/benchmarkData';
import { Button, StatusBadge } from '../ui';
import {
  Scale,
  Printer,
  Copy,
  Check,
  BrainCircuit,
  ArrowRightLeft,
  Gauge,
} from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export const BenchmarkArena: React.FC = () => {
  const [modelAId, setModelAId] = useState<string>('kmeans');
  const [modelBId, setModelBId] = useState<string>('hierarchical');
  const [copiedMd, setCopiedMd] = useState<boolean>(false);

  const modelA: AlgorithmProfile =
    ALGORITHMS_REGISTRY.find((a) => a.id === modelAId) || ALGORITHMS_REGISTRY[0];
  const modelB: AlgorithmProfile =
    ALGORITHMS_REGISTRY.find((a) => a.id === modelBId) || ALGORITHMS_REGISTRY[1];

  // Identificar si el enfrentamiento coincide con un duelo clásico
  const activeMatchup = CLASSIC_MATCHUPS.find(
    (m) =>
      (m.modeloAId === modelAId && m.modeloBId === modelBId) ||
      (m.modeloAId === modelBId && m.modeloBId === modelAId)
  );

  const handleApplyMatchup = (m: ClassicMatchup) => {
    setModelAId(m.modeloAId);
    setModelBId(m.modeloBId);
  };

  const handleSwap = () => {
    const temp = modelAId;
    setModelAId(modelBId);
    setModelBId(temp);
  };

  const handleCopyMarkdown = () => {
    const md = `# ARENA DE BENCHMARK ALGORÍTMICO: ${modelA.alias.toUpperCase()} VS. ${modelB.alias.toUpperCase()}
**Comparativa de Complejidad Asintótica y Trade-offs Metodológicos**
*Fecha:* ${new Date().toLocaleDateString('es-ES')}

---

## 1. Veredicto y Argumentación para Sustentación ante el Jurado
> "${activeMatchup?.preguntaJurado || `¿Por qué elegir ${modelA.alias} frente a ${modelB.alias}?`}"

**Argumento Técnico:**
${activeMatchup?.veredictoRecomendado || `Se seleccionó ${modelA.alias} por su balance de complejidad asintótica y requisitos de memoria. ${modelA.criterioSustentacion}`}

---

## 2. Matriz de Complejidad y Rendimiento
| Criterio | ${modelA.alias} | ${modelB.alias} |
| :--- | :--- | :--- |
| **Complejidad Entrenamiento** | $${modelA.complejidadEntrenamiento}$ | $${modelB.complejidadEntrenamiento}$ |
| **Complejidad Inferencia** | $${modelA.complejidadInferencia}$ | $${modelB.complejidadInferencia}$ |
| **Complejidad Espacial** | $${modelA.complejidadEspacial}$ | $${modelB.complejidadEspacial}$ |
| **Naturaleza / Explicabilidad** | ${modelA.naturaleza} | ${modelB.naturaleza} |
| **Requiere scale() / Normalizar** | ${modelA.requiereNormalizacion} | ${modelB.requiereNormalizacion} |
| **Sensibilidad a Outliers** | ${modelA.sensibilidadOutliers} | ${modelB.sensibilidadOutliers} |
| **Paquete en R** | \`${modelA.paqueteR}::${modelA.funcionR}\` | \`${modelB.paqueteR}::${modelB.funcionR}\` |

---

## 3. Puntuación Multidimensional (Escala 1 a 10)
- **Interpretabilidad:** ${modelA.alias} (${modelA.dimensionesScore.interpretabilidad}/10) vs. ${modelB.alias} (${modelB.dimensionesScore.interpretabilidad}/10)
- **Velocidad:** ${modelA.alias} (${modelA.dimensionesScore.velocidadEntrenamiento}/10) vs. ${modelB.alias} (${modelB.dimensionesScore.velocidadEntrenamiento}/10)
- **Escalabilidad:** ${modelA.alias} (${modelA.dimensionesScore.escalabilidadDatos}/10) vs. ${modelB.alias} (${modelB.dimensionesScore.escalabilidadDatos}/10)
- **Resistencia al Ruido:** ${modelA.alias} (${modelA.dimensionesScore.resistenciaRuido}/10) vs. ${modelB.alias} (${modelB.dimensionesScore.resistenciaRuido}/10)
- **Precisión en Fronteras Complejas:** ${modelA.alias} (${modelA.dimensionesScore.precisionFrontera}/10) vs. ${modelB.alias} (${modelB.dimensionesScore.precisionFrontera}/10)
`;

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const renderMath = (latexString: string) => {
    try {
      const html = katex.renderToString(latexString, {
        throwOnError: false,
        displayMode: false,
      });
      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    } catch {
      return <code>{latexString}</code>;
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem 1.5rem 5rem' }}>
      {/* 1. CABECERA PRINCIPAL Y SELECTOR DE DUELOS CLÁSICOS */}
      <div
        className="no-print"
        style={{
          backgroundColor: 'var(--color-card)',
          padding: '1.5rem 1.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-atlas-sm)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <StatusBadge status="completado" size="sm" label="Arena de Algoritmos" />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)' }}>
                Evaluación Asintótica &middot; Complejidad $\mathcal O(n)$ &middot; Trade-off Explicabilidad
              </span>
            </div>
            <h1
              className="atlas-title"
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 800,
                marginTop: '0.35rem',
                color: 'var(--color-ink)',
                letterSpacing: '-0.02em',
              }}
            >
              Arena de Benchmark &amp; Comparador de Modelos
            </h1>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-ink-secondary)',
                maxWidth: '780px',
                marginTop: '0.25rem',
                lineHeight: 1.5,
              }}
            >
              Compara directamente dos modelos de minería de datos para justificar con rigor científico tu elección en la
              sustentación oral: costos de entrenamiento, memoria, resistencia al ruido y balance entre caja blanca y caja negra.
            </p>
          </div>

          {/* Botonera de Acción Refinada */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              variant="outline"
              size="sm"
              icon={copiedMd ? <Check size={15} style={{ color: '#059669' }} /> : <Copy size={15} />}
              onClick={handleCopyMarkdown}
              title="Copiar informe de la comparativa en formato Markdown"
            >
              {copiedMd ? '¡Markdown Copiado!' : 'Copiar Comparativa'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={<Printer size={15} />}
              onClick={() => window.print()}
              style={{
                backgroundColor: 'var(--color-blue-ink)',
                borderColor: 'var(--color-blue-ink)',
                fontWeight: 600,
              }}
              title="Imprimir informe comparativo o guardar en PDF"
            >
              Imprimir / PDF
            </Button>
          </div>
        </div>

        {/* BARRA DE DUELOS CLÁSICOS RECOMENDADOS CON ESTILO PÍLDORA ELEGANTE */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-light)' }}>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--color-ink-muted)',
              marginBottom: '0.65rem',
              letterSpacing: '0.04em',
            }}
          >
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
                    padding: '0.45rem 0.95rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    border: isSelected ? '1.5px solid var(--color-terracotta)' : '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'rgba(234, 88, 12, 0.12)' : 'var(--color-card-muted)',
                    color: isSelected ? 'var(--color-terracotta)' : 'var(--color-ink)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(234, 88, 12, 0.15)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--color-blue-ink)';
                      e.currentTarget.style.color = 'var(--color-blue-ink)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.color = 'var(--color-ink)';
                    }
                  }}
                >
                  <Scale size={13} style={{ color: isSelected ? 'var(--color-terracotta)' : 'var(--color-blue-ink)' }} />
                  <span>{m.titulo}</span>
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
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            borderTop: '4px solid #ea580c',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-atlas-xs)',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span
                style={{
                  backgroundColor: '#ea580c',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                }}
              >
                Modelo A
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>{modelA.paradigma}</span>
            </div>

            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: 'var(--color-ink-muted)',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Seleccionar Algoritmo A:
            </label>
            <select
              value={modelAId}
              onChange={(e) => setModelAId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card-muted)',
                color: 'var(--color-ink)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                marginBottom: '1rem',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {ALGORITHMS_REGISTRY.map((a) => (
                <option key={a.id} value={a.id} disabled={a.id === modelBId}>
                  {a.nombre}
                </option>
              ))}
            </select>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 0.5rem' }}>
              {modelA.nombre}
            </h3>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: 4,
                  backgroundColor: modelA.naturaleza.includes('Blanca') ? 'rgba(5, 150, 105, 0.15)' : 'var(--color-card-muted)',
                  color: modelA.naturaleza.includes('Blanca') ? '#059669' : 'var(--color-ink-secondary)',
                  fontWeight: 600,
                }}
              >
                {modelA.naturaleza}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: 4,
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--color-blue-ink)',
                  fontWeight: 600,
                }}
              >
                {modelA.paqueteR}
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-blue-ink)',
              backgroundColor: 'var(--color-card-muted)',
              border: '1px solid var(--color-border-light)',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
            }}
          >
            {modelA.funcionR}
          </div>
        </div>

        {/* BOTÓN INTERCAMBIAR / VS */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-card)',
              border: '2px solid var(--color-border)',
              boxShadow: 'var(--shadow-atlas-xs)',
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
            title="Intercambiar algoritmos A y B"
            className="no-print"
            style={{
              backgroundColor: 'var(--color-card-muted)',
              border: '1px solid var(--color-border)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-ink-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-terracotta)';
              e.currentTarget.style.color = 'var(--color-terracotta)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-ink-secondary)';
            }}
          >
            <ArrowRightLeft size={14} />
          </button>
        </div>

        {/* TARJETA MODELO B */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            borderTop: '4px solid #0284c7',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-atlas-xs)',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span
                style={{
                  backgroundColor: '#0284c7',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                }}
              >
                Modelo B
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>{modelB.paradigma}</span>
            </div>

            <label
              style={{
                display: 'block',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: 'var(--color-ink-muted)',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Seleccionar Algoritmo B:
            </label>
            <select
              value={modelBId}
              onChange={(e) => setModelBId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card-muted)',
                color: 'var(--color-ink)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                marginBottom: '1rem',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {ALGORITHMS_REGISTRY.map((b) => (
                <option key={b.id} value={b.id} disabled={b.id === modelAId}>
                  {b.nombre}
                </option>
              ))}
            </select>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0 0 0.5rem' }}>
              {modelB.nombre}
            </h3>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: 4,
                  backgroundColor: modelB.naturaleza.includes('Blanca') ? 'rgba(5, 150, 105, 0.15)' : 'var(--color-card-muted)',
                  color: modelB.naturaleza.includes('Blanca') ? '#059669' : 'var(--color-ink-secondary)',
                  fontWeight: 600,
                }}
              >
                {modelB.naturaleza}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: 4,
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--color-blue-ink)',
                  fontWeight: 600,
                }}
              >
                {modelB.paqueteR}
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-blue-ink)',
              backgroundColor: 'var(--color-card-muted)',
              border: '1px solid var(--color-border-light)',
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
            }}
          >
            {modelB.funcionR}
          </div>
        </div>
      </div>

      {/* 3. ARGUMENTACIÓN ANTE PREGUNTAS DEL JURADO */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          borderLeft: '4px solid var(--color-blue-ink)',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-atlas-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem' }}>
          <BrainCircuit size={20} style={{ color: 'var(--color-blue-ink)' }} />
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-ink)', margin: 0 }}>
            {activeMatchup ? 'Pregunta de Jurado para este Duelo Específico' : `Decisión Metodológica: ¿Por qué ${modelA.alias} y no ${modelB.alias}?`}
          </h4>
        </div>

        <p style={{ fontStyle: 'italic', color: 'var(--color-blue-ink)', fontSize: '0.9rem', marginBottom: '0.85rem', fontWeight: 500 }}>
          &ldquo;{activeMatchup?.preguntaJurado || `¿Cuáles son las razones computacionales y empíricas para sustentar el uso de ${modelA.alias} frente a ${modelB.alias} en este problema?`}&rdquo;
        </p>

        <div
          style={{
            backgroundColor: 'var(--color-card-muted)',
            border: '1px solid var(--color-border-light)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-ink)',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: 'var(--color-terracotta)' }}>Argumento Recomendado para la Sustentación:</strong>{' '}
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
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          marginBottom: '2rem',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-atlas-xs)',
        }}
      >
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-ink)' }}>
          <Scale size={18} style={{ color: '#ea580c' }} />
          Matriz de Especificaciones Técnicas y Complejidad Asintótica
        </h4>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)', backgroundColor: 'var(--color-card-muted)' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: '28%', color: 'var(--color-ink-muted)', fontWeight: 700 }}>
                Criterio de Evaluación
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: '36%', color: '#ea580c', fontWeight: 800 }}>
                {modelA.alias}
              </th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: '36%', color: '#0284c7', fontWeight: 800 }}>
                {modelB.alias}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: 'var(--color-ink)' }}>Complejidad Entrenamiento</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-ink)' }}>{renderMath(modelA.complejidadEntrenamiento)}</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-ink)' }}>{renderMath(modelB.complejidadEntrenamiento)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: 'var(--color-ink)' }}>Complejidad Inferencia</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-ink)' }}>{renderMath(modelA.complejidadInferencia)}</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-ink)' }}>{renderMath(modelB.complejidadInferencia)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: 'var(--color-ink)' }}>Complejidad Espacial (Memoria)</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-ink)' }}>{renderMath(modelA.complejidadEspacial)}</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-ink)' }}>{renderMath(modelB.complejidadEspacial)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: 'var(--color-ink)' }}>Explicabilidad / Naturaleza</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-ink)' }}>{modelA.naturaleza}</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-ink)' }}>{modelB.naturaleza}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: 'var(--color-ink)' }}>Requiere scale() / Normalización</td>
              <td style={{ padding: '0.7rem 1rem' }}>
                <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: 4, backgroundColor: 'var(--color-card-muted)', color: 'var(--color-ink)', fontWeight: 600 }}>
                  {modelA.requiereNormalizacion}
                </span>
              </td>
              <td style={{ padding: '0.7rem 1rem' }}>
                <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: 4, backgroundColor: 'var(--color-card-muted)', color: 'var(--color-ink)', fontWeight: 600 }}>
                  {modelB.requiereNormalizacion}
                </span>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: 'var(--color-ink)' }}>Sensibilidad a Outliers</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-ink)' }}>{modelA.sensibilidadOutliers}</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-ink)' }}>{modelB.sensibilidadOutliers}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-border-light)' }}>
              <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: 'var(--color-ink)' }}>Tratamiento de Categóricas</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-ink)' }}>{modelA.manejoCategoricas}</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-ink)' }}>{modelB.manejoCategoricas}</td>
            </tr>
            <tr>
              <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: 'var(--color-ink)' }}>Métricas de Evaluación Clave</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-blue-ink)', fontWeight: 600 }}>{modelA.metricasClave.join(' · ')}</td>
              <td style={{ padding: '0.7rem 1rem', color: 'var(--color-blue-ink)', fontWeight: 600 }}>{modelB.metricasClave.join(' · ')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 5. RADAR DE DIMENSIONES Y PUNTUACIÓN (1-10) */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-atlas-xs)',
        }}
      >
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-ink)' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--color-ink)' }}>{dim.label}</span>
                  <span>
                    <strong style={{ color: '#ea580c' }}>{modelA.alias}: {scoreA}/10</strong> vs{' '}
                    <strong style={{ color: '#0284c7' }}>{modelB.alias}: {scoreB}/10</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {/* Barra Modelo A */}
                  <div style={{ flex: 1, backgroundColor: 'var(--color-card-muted)', height: '10px', borderRadius: '4px', overflow: 'hidden' }}>
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
                  <div style={{ flex: 1, backgroundColor: 'var(--color-card-muted)', height: '10px', borderRadius: '4px', overflow: 'hidden' }}>
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
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            borderTop: '3px solid #ea580c',
            boxShadow: 'var(--shadow-atlas-xs)',
          }}
        >
          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: '#ea580c', marginBottom: '0.75rem' }}>
            Balance Analítico: {modelA.alias}
          </h4>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
              Fortalezas Principales:
            </div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: 'var(--text-xs)', color: 'var(--color-ink)', margin: 0, lineHeight: 1.55 }}>
              {modelA.fortalezas.map((f: string, i: number) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
              Debilidades / Limitaciones:
            </div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.55 }}>
              {modelA.debilidades.map((d: string, i: number) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* FORTALEZAS Y DEBILIDADES MODELO B */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: 'var(--color-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            borderTop: '3px solid #0284c7',
            boxShadow: 'var(--shadow-atlas-xs)',
          }}
        >
          <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: '#0284c7', marginBottom: '0.75rem' }}>
            Balance Analítico: {modelB.alias}
          </h4>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
              Fortalezas Principales:
            </div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: 'var(--text-xs)', color: 'var(--color-ink)', margin: 0, lineHeight: 1.55 }}>
              {modelB.fortalezas.map((f: string, i: number) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
              Debilidades / Limitaciones:
            </div>
            <ul style={{ paddingLeft: '1.25rem', fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.55 }}>
              {modelB.debilidades.map((d: string, i: number) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
