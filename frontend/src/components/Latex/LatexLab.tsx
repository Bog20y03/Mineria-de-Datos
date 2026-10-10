import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import katex from 'katex';
import {
  FileCode2,
  Copy,
  Download,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const LATEX_TEMPLATES: { label: string; formula: string; doc: string }[] = [
  {
    label: 'K-Means: Minimización de Inercia Cuadrática (U1)',
    formula: 'J(C) = \\sum_{k=1}^{K} \\sum_{x_i \\in C_k} \\|x_i - \\mu_k\\|^2',
    doc: `\\section{Algoritmo K-Means}
La función objetivo optimizada por K-Means minimiza la varianza intra-clúster (WSS):
\\[
J(C) = \\sum_{k=1}^{K} \\sum_{x_i \\in C_k} \\|x_i - \\mu_k\\|^2
\\]
donde $\\mu_k$ es el centroide del clúster $C_k$.`,
  },
  {
    label: 'Árboles CART: Impureza de Gini (U2)',
    formula: 'I_G(t) = 1 - \\sum_{i=1}^{C} p(i|t)^2',
    doc: `\\section{Criterio de División CART (Gini)}
Para un nodo $t$, la impureza de Gini mide la probabilidad de clasificar erróneamente un elemento aleatorio:
\\[
I_G(t) = 1 - \\sum_{i=1}^{C} p(i|t)^2
\\]`,
  },
  {
    label: 'Redes Neuronales: Función Sigmoide y Pérdida Cross-Entropy (U2/U3)',
    formula: '\\sigma(z) = \\frac{1}{1 + e^{-z}}, \\quad \\mathcal{L} = -\\sum y \\log(\\hat{y})',
    doc: `\\section{Perceptrón Multicapa}
Función de activación logística:
\\[
\\sigma(z) = \\frac{1}{1 + e^{-z}}
\\]
Función de costo Binary Cross-Entropy:
\\[
\\mathcal{L}(y, \\hat{y}) = - \\left[ y \\log(\\hat{y}) + (1-y) \\log(1-\\hat{y}) \\right]
\\]`,
  },
  {
    label: 'Series de Tiempo: Descomposición STL (U3)',
    formula: 'Y_t = T_t + S_t + I_t',
    doc: `\\section{Descomposición de Series Temporales}
Modelo aditivo de series de tiempo:
\\[
Y_t = T_t + S_t + I_t
\\]
donde $T_t$ es la tendencia, $S_t$ la estacionalidad y $I_t$ el residuo o componente irregular.`,
  },
];

export const LatexLab: React.FC = () => {
  const { course } = useApp();
  const [code, setCode] = useState<string>(LATEX_TEMPLATES[0].doc);
  const [formula, setFormula] = useState<string>(LATEX_TEMPLATES[0].formula);
  const [selectedUnit, setSelectedUnit] = useState<string>('UNIDAD_1');
  const [selectedTopic, setSelectedTopic] = useState<string>('01_MINERIA_DE_DATOS');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    if (previewRef.current) {
      try {
        katex.render(formula, previewRef.current, {
          throwOnError: true,
          displayMode: true,
        });
        setRenderError(null);
      } catch (err: unknown) {
        setRenderError(err instanceof Error ? err.message : 'Error en sintaxis LaTeX');
      }
    }
  }, [formula]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documentacion_${selectedTopic}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveLocal = () => {
    localStorage.setItem(`latex_draft_${selectedUnit}_${selectedTopic}`, code);
    setSavedStatus('Guardado en borrador local');
    setTimeout(() => setSavedStatus(null), 2500);
  };

  const applyTemplate = (t: typeof LATEX_TEMPLATES[0]) => {
    setFormula(t.formula);
    setCode(t.doc);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <FileCode2 size={20} style={{ color: 'var(--c-gold)' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Laboratorio de Documentación LaTeX</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Renderizador KaTeX interactivo, generación de capítulos temáticos y fórmulas formales.
          </p>
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={handleSaveLocal} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
            <Save size={14} />
            <span>Guardar Borrador</span>
          </button>
          <button type="button" onClick={handleCopy} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
            <Copy size={14} />
            <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
          </button>
          <button type="button" onClick={handleDownload} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
            <Download size={14} />
            <span>Descargar .tex</span>
          </button>
        </div>
      </div>

      {savedStatus && (
        <div className="badge badge-green" style={{ padding: '0.5rem 1rem', alignSelf: 'flex-start' }}>
          <CheckCircle2 size={14} /> {savedStatus}
        </div>
      )}

      {/* Asociación con Unidad y Tema + Plantillas */}
      <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Asociar a:</span>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
              }}
            >
              {course?.unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>

            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
              }}
            >
              {course?.unidades
                .find((u) => u.id === selectedUnit)
                ?.temas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
            </select>
          </div>

          {/* Selector de Plantillas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Plantillas del curso:</span>
            {LATEX_TEMPLATES.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(t)}
                className="btn btn-secondary"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              >
                {t.label.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Previsualizador KaTeX en Tiempo Real */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
            Fórmula Matemática (KaTeX):
          </label>
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              marginBottom: '0.75rem',
            }}
          />

          <div
            className="card"
            style={{
              padding: '1.5rem',
              minHeight: '80px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflowX: 'auto',
              boxShadow: 'var(--shadow-atlas-xs)',
            }}
          >
            {renderError ? (
              <div style={{ color: 'var(--color-danger-ink)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircle size={14} /> {renderError}
              </div>
            ) : (
              <div ref={previewRef} style={{ fontSize: '1.25rem', color: 'var(--color-ink)' }} />
            )}
          </div>
        </div>
      </div>

      {/* Editor de Código .tex */}
      <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-ink-secondary)' }}>
          Documento Fuente (.tex)
        </h4>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={14}
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: 'var(--color-card-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.825rem',
            lineHeight: 1.5,
            resize: 'vertical',
          }}
        />
      </div>
    </div>
  );
};
