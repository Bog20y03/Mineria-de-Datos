import React, { useState } from 'react';
import {
  Play,
  Copy,
  Check,
  Download,
  Terminal,
  Package,
  Sparkles,
  FileCode,
} from 'lucide-react';
import type { CodeFile, UnitId } from '../../types/domain';
import { executeRScript } from '../../services/runService';

export interface TopicRLaboratoryProps {
  unitId: UnitId;
  topicId: string;
  topicName: string;
  scripts: CodeFile[];
  onExecutionSuccess?: (results: { imagenes: { nombre: string; src: string }[]; metricas: string | null }) => void;
}

// Paquetes recomendados de R clasificados por temática
const TOPIC_PACKAGES_MAP: Record<string, { pkg: string; desc: string; uso: string }[]> = {
  clustering: [
    { pkg: 'cluster', desc: 'Algoritmos de partición y métodos jerárquicos (agnes, diana, pam)', uso: 'silhouette(), pam(), clara()' },
    { pkg: 'factoextra', desc: 'Extracción y visualización elegante de clústeres y PCA', uso: 'fviz_nbclust(), fviz_cluster()' },
    { pkg: 'stats', desc: 'Paquete base con implementación canónica de K-Means y hclust', uso: 'kmeans(x, centers, nstart)' },
  ],
  arboles: [
    { pkg: 'rpart', desc: 'Partición recursiva y árboles de decisión CART', uso: 'rpart(formula, data, method="class")' },
    { pkg: 'rpart.plot', desc: 'Visualización de alta calidad para ramas y reglas de corte', uso: 'rpart.plot(modelo, type=4)' },
    { pkg: 'caret', desc: 'Entrenamiento, validación cruzada y afinamiento de hiperparámetros', uso: 'trainControl(), confusionMatrix()' },
  ],
  redes: [
    { pkg: 'nnet', desc: 'Redes neuronales feed-forward de una capa oculta y regresión multinomial', uso: 'nnet(x, y, size=5, decay=0.01)' },
    { pkg: 'neuralnet', desc: 'Entrenamiento de redes profundas con cálculo explícito de pesos sinápticos', uso: 'neuralnet(formula, data, hidden=c(4,2))' },
  ],
  asociacion: [
    { pkg: 'arules', desc: 'Minería de conjuntos frecuentes de ítems y reglas de asociación Apriori', uso: 'apriori(transacciones, parameter=list(supp=0.05, conf=0.8))' },
    { pkg: 'arulesViz', desc: 'Grafos interactivos y diagramas de dispersión de soporte vs confianza', uso: 'plot(reglas, method="graph")' },
  ],
  series: [
    { pkg: 'forecast', desc: 'Modelado autorregresivo ARIMA, alisado exponencial y predicción', uso: 'auto.arima(ts_data), forecast()' },
    { pkg: 'tseries', desc: 'Pruebas de estacionariedad Augmented Dickey-Fuller (ADF)', uso: 'adf.test(serie)' },
  ],
  default: [
    { pkg: 'stats', desc: 'Librería analítica central de R para modelado estadístico', uso: 'lm(), glm(), prcomp(), cor()' },
    { pkg: 'caret', desc: 'Protocolo de validación cruzada, partición y métricas diagnósticas', uso: 'createDataPartition(), confusionMatrix()' },
    { pkg: 'ggplot2', desc: 'Gramática de gráficos para figuras científicas reproducibles', uso: 'ggplot(data, aes(x, y)) + geom_point()' },
  ],
};

function getTopicPackages(topicId: string) {
  const t = topicId.toLowerCase();
  if (t.includes('cluster')) return TOPIC_PACKAGES_MAP.clustering;
  if (t.includes('arbol')) return TOPIC_PACKAGES_MAP.arboles;
  if (t.includes('redes') || t.includes('neural')) return TOPIC_PACKAGES_MAP.redes;
  if (t.includes('asociacion')) return TOPIC_PACKAGES_MAP.asociacion;
  if (t.includes('serie') || t.includes('tiempo')) return TOPIC_PACKAGES_MAP.series;
  return TOPIC_PACKAGES_MAP.default;
}

export const TopicRLaboratory: React.FC<TopicRLaboratoryProps> = ({
  unitId,
  topicId,
  topicName,
  scripts,
  onExecutionSuccess,
}) => {
  const [selectedScriptIndex, setSelectedScriptIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionLog, setExecutionLog] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const activeScript = scripts[selectedScriptIndex] || scripts[0] || {
    archivo: 'script_principal.R',
    codigo: '# No hay scripts en R disponibles para este tema.',
    titulo: 'Script Principal',
    categoria: 'modelo',
  };

  const topicPackages = getTopicPackages(topicId);

  const handleRunR = async () => {
    setIsRunning(true);
    setExecutionLog(null);
    setIsSuccess(null);
    try {
      const res = await executeRScript(unitId, topicId, activeScript.archivo);
      setIsSuccess(res.ok);
      setExecutionLog(
        res.salida ||
          (res.ok
            ? `>>> [Rscript v4.4.1] Script '${activeScript.archivo}' ejecutado exitosamente con código de salida 0.`
            : 'Error reportado durante la ejecución.')
      );
      if (res.results.imagenes.length > 0 && onExecutionSuccess) {
        onExecutionSuccess(res.results);
      }
    } catch (err: unknown) {
      setIsSuccess(false);
      setExecutionLog(err instanceof Error ? err.message : 'Fallo en la comunicación con el servidor R.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    if (!activeScript.codigo) return;
    navigator.clipboard.writeText(activeScript.codigo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadR = () => {
    if (!activeScript.codigo) return;
    const blob = new Blob([activeScript.codigo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeScript.archivo || `${topicId}.R`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Selector Superior de Scripts Disponibles */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(234, 88, 12, 0.15)',
                  color: 'var(--color-terracotta)',
                  letterSpacing: '0.04em',
                }}
              >
                Suite de Computación Científica R
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)' }}>
                {scripts.length} {scripts.length === 1 ? 'script disponible' : 'scripts especializados'}
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-ink)', margin: '0.35rem 0 0' }}>
              Laboratorio en R: {topicName}
            </h3>
          </div>

          {/* Botones de Acción */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleCopyCode}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card-muted)',
                color: 'var(--color-ink)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copied ? '¡Copiado!' : 'Copiar R'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadR}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card-muted)',
                color: 'var(--color-ink)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Download size={14} />
              <span>Descargar .R</span>
            </button>

            <button
              type="button"
              onClick={handleRunR}
              disabled={isRunning}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 1.15rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: isRunning ? 'var(--color-ink-muted)' : 'var(--color-terracotta)',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: isRunning ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(234, 88, 12, 0.35)',
                transition: 'all 0.15s ease',
              }}
            >
              <Play size={15} />
              <span>{isRunning ? 'Ejecutando en R...' : `Ejecutar: ${activeScript.archivo}`}</span>
            </button>
          </div>
        </div>

        {/* Pestañas de Selección de Script */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.85rem' }}>
          {scripts.map((s, idx) => {
            const isSelected = idx === selectedScriptIndex;
            return (
              <button
                key={s.archivo}
                type="button"
                onClick={() => setSelectedScriptIndex(idx)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected
                    ? '1.5px solid var(--color-terracotta)'
                    : '1px solid var(--color-border)',
                  backgroundColor: isSelected
                    ? 'rgba(234, 88, 12, 0.12)'
                    : 'var(--color-card-muted)',
                  color: isSelected ? 'var(--color-terracotta)' : 'var(--color-ink-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <FileCode size={14} />
                <span>{s.titulo || s.archivo}</span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: isSelected ? 'var(--color-terracotta)' : 'var(--color-ink-muted)',
                    fontFamily: 'monospace',
                  }}
                >
                  ({s.archivo})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Consola de Salida de Ejecución de R */}
      {executionLog !== null && (
        <div
          style={{
            padding: '1.25rem',
            backgroundColor: isSuccess ? '#020617' : 'rgba(239, 68, 68, 0.08)',
            border: `1.5px solid ${isSuccess ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={16} color={isSuccess ? '#22C55E' : '#EF4444'} />
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: isSuccess ? '#22C55E' : '#EF4444',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {isSuccess ? 'Terminal R: Exit Code 0 (Convergencia Exitosa)' : 'Terminal R: Error de Ejecución'}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
              Script activo: <code>{activeScript.archivo}</code>
            </span>
          </div>

          <pre
            style={{
              margin: 0,
              padding: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              borderRadius: '6px',
              fontFamily: 'Consolas, monospace',
              fontSize: '0.8rem',
              color: isSuccess ? '#A7F3D0' : '#FCA5A5',
              whiteSpace: 'pre-wrap',
              maxHeight: '260px',
              overflowY: 'auto',
              lineHeight: 1.5,
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {executionLog}
          </pre>
        </div>
      )}

      {/* 3. Visor de Código Fuente en R */}
      <div
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          backgroundColor: '#090D16',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-atlas-xs)',
        }}
      >
        <div
          style={{
            padding: '0.65rem 1.25rem',
            backgroundColor: '#0F172A',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#F59E0B',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'monospace', marginLeft: '6px' }}>
              {activeScript.archivo} • Rscript
            </span>
          </div>

          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            Semilla fija • Cero datos simulados
          </span>
        </div>

        <pre
          style={{
            margin: 0,
            padding: '1.25rem',
            fontFamily: 'Consolas, "Fira Code", monospace',
            fontSize: '0.8125rem',
            color: '#93C5FD',
            lineHeight: 1.55,
            overflowX: 'auto',
            maxHeight: '420px',
          }}
        >
          {activeScript.codigo || '# Script no disponible.'}
        </pre>
      </div>

      {/* 4. Guía de Paquetes Canónicos de R para este Tema */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <Package size={18} color="var(--color-blue-ink)" />
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
            Ecosistema de Paquetes en R Recomendados para este Tema
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
          {topicPackages.map((pkg) => (
            <div
              key={pkg.pkg}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-card-muted)',
                border: '1px solid var(--color-border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-blue-ink)', fontFamily: 'monospace' }}>
                  library({pkg.pkg})
                </span>
                <span style={{ fontSize: '0.68rem', backgroundColor: 'rgba(2, 132, 199, 0.12)', color: 'var(--color-blue-ink)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                  CRAN
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-ink-secondary)', margin: 0, lineHeight: 1.4 }}>
                {pkg.desc}
              </p>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-ink-muted)', fontFamily: 'monospace', marginTop: '2px' }}>
                Uso: <code>{pkg.uso}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Snippets Rápidos de Rigor en R */}
      <div
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Sparkles size={16} color="var(--color-terracotta)" />
          <h4 style={{ fontSize: '0.88rem', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
            Snippets Metodológicos de Rigor en R
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: 'var(--color-card-muted)', border: '1px solid var(--color-border-light)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '3px' }}>
              1. Reproducibilidad Estricta
            </div>
            <code style={{ fontSize: '0.72rem', color: 'var(--color-terracotta)', display: 'block' }}>
              set.seed(42); options(digits = 4)
            </code>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: 'var(--color-card-muted)', border: '1px solid var(--color-border-light)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '3px' }}>
              2. Partición Train / Test (80-20)
            </div>
            <code style={{ fontSize: '0.72rem', color: 'var(--color-blue-ink)', display: 'block' }}>
              idx &lt;- sample(1:nrow(df), 0.8 * nrow(df))
            </code>
          </div>

          <div style={{ padding: '0.75rem', borderRadius: '6px', backgroundColor: 'var(--color-card-muted)', border: '1px solid var(--color-border-light)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '3px' }}>
              3. Estandarización de Matrices
            </div>
            <code style={{ fontSize: '0.72rem', color: '#10B981', display: 'block' }}>
              df_scaled &lt;- scale(df[, numeric_cols])
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
