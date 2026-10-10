import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import katex from 'katex';
import {
  Card,
  Button,
  StatusBadge,
} from '../ui';
import {
  FileCode2,
  Copy,
  Download,
  Save,
  AlertCircle,
  FileText,
  Code,
  Sparkles,
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
    label: 'Redes Neuronales: Función Sigmoide y Cross-Entropy (U2/U3)',
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

const QUICK_SYMBOLS = [
  { label: '∑ Suma', code: '\\sum_{i=1}^{n}' },
  { label: '∫ Integral', code: '\\int_{a}^{b} f(x)\\,dx' },
  { label: 'a/b Frac', code: '\\frac{a}{b}' },
  { label: '√x Raíz', code: '\\sqrt{x}' },
  { label: 'X Matriz', code: '\\mathbf{X}' },
  { label: 'μ Media', code: '\\mu' },
  { label: 'σ Desv.', code: '\\sigma' },
  { label: '≤ Menor', code: '\\le' },
  { label: '≥ Mayor', code: '\\ge' },
  { label: '∈ En', code: '\\in' },
  { label: 'ℝ Reales', code: '\\mathbb{R}' },
  { label: '||x||² Norma', code: '\\|x\\|^2' },
];

export const LatexLab: React.FC = () => {
  const { course } = useApp();
  const [code, setCode] = useState<string>(LATEX_TEMPLATES[0].doc);
  const [formula, setFormula] = useState<string>(LATEX_TEMPLATES[0].formula);
  const [selectedUnit, setSelectedUnit] = useState<string>('UNIDAD_1');
  const [selectedTopic, setSelectedTopic] = useState<string>('01_MINERIA_DE_DATOS');
  const [activeTab, setActiveTab] = useState<'paper' | 'source'>('paper');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const paperPreviewRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    const renderTarget = (target: HTMLDivElement | null) => {
      if (target) {
        try {
          katex.render(formula, target, {
            throwOnError: true,
            displayMode: true,
          });
          setRenderError(null);
        } catch (err: unknown) {
          setRenderError(err instanceof Error ? err.message : 'Error en sintaxis LaTeX');
        }
      }
    };

    renderTarget(previewRef.current);
    renderTarget(paperPreviewRef.current);
  }, [formula, activeTab]);

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

  const handleInsertSymbol = (symbolCode: string) => {
    setFormula((prev) => (prev ? `${prev} ${symbolCode}` : symbolCode));
  };

  // Encontrar el nombre del tema seleccionado
  const currentUnitObj = course?.unidades.find((u) => u.id === selectedUnit);
  const currentTopicObj = currentUnitObj?.temas.find((t) => t.id === selectedTopic);
  const currentTopicName = currentTopicObj?.nombre || 'Minería de Datos';

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-blue-soft)',
                color: 'var(--color-blue-ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileCode2 size={20} />
            </div>
            <h2 className="atlas-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, margin: 0 }}>
              Laboratorio de Documentación LaTeX
            </h2>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', margin: 0 }}>
            Renderizador KaTeX en vivo, generación de capítulos temáticos y simulación de Paper Académico.
          </p>
        </div>

        {/* Acciones */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Button variant="ghost" size="sm" onClick={handleSaveLocal}>
            <Save size={14} />
            <span>Guardar Borrador</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy size={14} />
            <span>{copied ? '¡Copiado!' : 'Copiar .tex'}</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownload}>
            <Download size={14} />
            <span>Descargar .tex</span>
          </Button>
        </div>
      </div>

      {savedStatus && (
        <div style={{ alignSelf: 'flex-start' }}>
          <StatusBadge status="completado" label={savedStatus} />
        </div>
      )}

      {/* Barra de Asociación con Unidad y Tema + Plantillas */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Asociar a:
            </span>
            <select
              value={selectedUnit}
              onChange={(e) => {
                setSelectedUnit(e.target.value);
                const firstTopic = course?.unidades.find((u) => u.id === e.target.value)?.temas[0]?.id;
                if (firstTopic) setSelectedTopic(firstTopic);
              }}
              style={{
                backgroundColor: 'var(--color-card-muted)',
                color: 'var(--color-ink)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.75rem',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
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
                backgroundColor: 'var(--color-card-muted)',
                color: 'var(--color-ink)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.75rem',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                maxWidth: '280px',
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

          {/* Selector de Plantillas Canónicas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', fontWeight: 600 }}>
              Plantillas:
            </span>
            {LATEX_TEMPLATES.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(t)}
                className="btn-tab"
                style={{
                  padding: '0.25rem 0.55rem',
                  fontSize: '11px',
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-blue-ink)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {t.label.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Barra de Herramientas de Inserción Rápida de Símbolos Matemáticos */}
        <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '0.85rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={13} style={{ color: 'var(--color-terracotta)' }} /> Paleta de Inserción Rápida:
            </label>
            <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>Haz clic para insertar en la fórmula activa</span>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {QUICK_SYMBOLS.map((sym, sIdx) => (
              <button
                key={sIdx}
                type="button"
                onClick={() => handleInsertSymbol(sym.code)}
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: 'var(--color-card-muted)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-ink)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all var(--motion-duration-fast)',
                }}
                title={`Insertar ${sym.code}`}
              >
                {sym.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input de la Fórmula Activa */}
        <div>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
            Expresión Matemática LaTeX Activa:
          </label>
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="Escribe tu fórmula LaTeX aquí..."
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
            }}
          />
        </div>
      </Card>

      {/* Selector de Pestañas: Vista Hoja Académica (Paper View) vs Código Fuente */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('paper')}
          style={{
            padding: '0.5rem 1rem',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            border: activeTab === 'paper' ? '1px solid var(--color-blue-ink)' : '1px solid transparent',
            backgroundColor: activeTab === 'paper' ? 'var(--color-blue-soft)' : 'transparent',
            color: activeTab === 'paper' ? 'var(--color-blue-ink)' : 'var(--color-ink-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <FileText size={15} /> Simulación Paper Académico (Paper View)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('source')}
          style={{
            padding: '0.5rem 1rem',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            borderRadius: 'var(--radius-sm)',
            border: activeTab === 'source' ? '1px solid var(--color-terracotta)' : '1px solid transparent',
            backgroundColor: activeTab === 'source' ? 'var(--color-terracotta-soft)' : 'transparent',
            color: activeTab === 'source' ? 'var(--color-terracotta)' : 'var(--color-ink-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Code size={15} /> Editor de Código Fuente (.tex)
        </button>
      </div>

      {activeTab === 'paper' ? (
        /* ================= VISTA HOJA ACADÉMICA (PAPER VIEW) ================= */
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '850px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 12px 36px -8px rgba(0,0,0,0.12), 0 4px 12px -2px rgba(0,0,0,0.06)',
              padding: '3rem 3.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              position: 'relative',
            }}
          >
            {/* Encabezado Institucional Preprint */}
            <div style={{ borderBottom: '2px solid var(--color-ink)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
                  UNIVERSIDAD DE CUNDINAMARCA • FACULTAD DE INGENIERÍA
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-terracotta)' }}>
                  SISTEMA DE EVIDENCIAS ACADÉMICAS EN MINERÍA DE DATOS
                </div>
              </div>
              <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-muted)' }}>
                DOC-REF: {selectedTopic}
              </div>
            </div>

            {/* Título de la Sección del Paper */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-blue-ink)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                SECCIÓN TÉCNICA FORMAL
              </div>
              <h1
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: 'var(--color-ink)',
                  fontFamily: 'var(--font-serif)',
                  lineHeight: 1.25,
                  margin: 0,
                }}
              >
                {currentTopicName}
              </h1>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                Modelado formal, definición matemática e implementaciones algorítmicas en R
              </div>
            </div>

            {/* Texto Introductorio Académico */}
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)', lineHeight: 1.65, textAlign: 'justify' }}>
              En el marco de la investigación de minería de datos, los modelos predictivos y descriptivos se fundamentan en formulaciones matemáticas rigurosas. La ecuación a continuación describe la función objetivo o métrica de optimización verificada en la experimentación computacional.
            </div>

            {/* Callout de la Ecuación Matemática con Numeración Formal (1) */}
            <div
              style={{
                backgroundColor: 'var(--color-card-muted)',
                border: '1px solid var(--color-border-light)',
                borderLeft: '4px solid var(--color-blue-ink)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.75rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                overflowX: 'auto',
              }}
            >
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                {renderError ? (
                  <div style={{ color: 'var(--color-danger-ink)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertCircle size={15} /> {renderError}
                  </div>
                ) : (
                  <div ref={paperPreviewRef} style={{ fontSize: '1.35rem', color: 'var(--color-ink)' }} />
                )}
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--color-ink-muted)',
                  marginLeft: '1.5rem',
                  userSelect: 'none',
                }}
              >
                (1)
              </span>
            </div>

            {/* Resumen del Contenido Teórico */}
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem' }}>
              <strong>Nota metodológica:</strong> Esta formulación se vincula directamente a los scripts de ejecución en R y a las fuentes bibliográficas indexadas en el catálogo de consultas booleanas.
            </div>

            {/* Pie de Página de la Hoja Académica */}
            <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--color-ink-muted)' }}>
              <span>Página 1 de 1 • Hoja Académica Normalizada</span>
              <span>Compilado con KaTeX Engine • v2.4</span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= VISTA EDITOR FUENTE (.TEX) ================= */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem' }}>
          {/* Editor de Código .tex */}
          <Card padding="md">
            <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Código Fuente del Documento (.tex)
            </h4>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: 'var(--color-card-muted)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.825rem',
                lineHeight: 1.55,
                resize: 'vertical',
              }}
            />
          </Card>

          {/* Previsualizador KaTeX Standalone */}
          <Card padding="md">
            <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-ink-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Visor KaTeX de la Fórmula
            </h4>
            <div
              style={{
                minHeight: '220px',
                padding: '2rem',
                backgroundColor: 'var(--color-card-muted)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflowX: 'auto',
              }}
            >
              {renderError ? (
                <div style={{ color: 'var(--color-danger-ink)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertCircle size={15} /> {renderError}
                </div>
              ) : (
                <div ref={previewRef} style={{ fontSize: '1.35rem', color: 'var(--color-ink)' }} />
              )}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginTop: '0.75rem', lineHeight: 1.4 }}>
              Tip: Los cambios en la fórmula LaTeX se renderizan instantáneamente en la ecuación matemática y en el Paper View.
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
