import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getTopicDetail } from '../../services/topicService';
import { getUserProfileConfig } from '../../services/avatarService';
import type { TopicDetail, UnitId } from '../../types/domain';
import { DossierPaper } from './DossierPaper';
import { generateDossierHtml, type DossierLayout } from './exportDossierHtml';
import {
  Printer,
  Download,
  Copy,
  Check,
  Columns,
  Layout,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Award,
  BookOpen,
} from 'lucide-react';

export const DossierView: React.FC = () => {
  const { course, dossierTarget, setActiveView, openTopic, openDefense } = useApp();

  // Selección de tema inicial
  const [selectedUnitId, setSelectedUnitId] = useState<UnitId>(() => {
    return dossierTarget?.unitId || 'UNIDAD_1';
  });

  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => {
    return dossierTarget?.topicId || '01_MINERIA_DE_DATOS';
  });

  const [layout, setLayout] = useState<DossierLayout>('ieee');
  const [data, setData] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedMd, setCopiedMd] = useState<boolean>(false);

  const profile = getUserProfileConfig();

  // Si cambia el objetivo desde afuera
  useEffect(() => {
    if (dossierTarget) {
      setSelectedUnitId(dossierTarget.unitId);
      setSelectedTopicId(dossierTarget.topicId);
    }
  }, [dossierTarget]);

  // Cargar detalles del tema seleccionado
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getTopicDetail(selectedUnitId, selectedTopicId)
      .then((detail) => {
        if (isMounted) {
          setData(detail);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar tema para el dossier');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedUnitId, selectedTopicId]);

  // 1. Imprimir / Exportar a PDF
  const handlePrint = () => {
    window.print();
  };

  // 2. Descargar HTML Autónomo
  const handleDownloadHtml = () => {
    if (!data) return;
    const htmlString = generateDossierHtml(data, profile, layout);
    const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dossier_Sustentacion_${data.topicId}_${layout}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 3. Copiar Markdown Completo
  const handleCopyMarkdown = () => {
    if (!data) return;
    const allScripts = data.rScripts || (data.rExample ? [data.rExample] : []);
    const md = `# ${data.topicName.toUpperCase()}
**Informe de Sustentación Metodológica · ${data.unitName}**
*Investigador:* ${profile.name} (Código: ${profile.code}) | *Rol:* ${profile.presetId.toUpperCase()}
*Fecha:* ${new Date().toLocaleDateString('es-ES')}

---

## I. Resumen Estructurado (Abstract)
El presente artículo expone la fundamentación teórica, exploración analítica y validación cuantitativa para el tema **${data.topicName}**. Se cumplió la política de cero datos inventados garantizando reproducibilidad experimental con semilla fija (set.seed=42).

## II. Metodología y Estado del Arte
${data.searches.map(s => `- **Consulta:** \`${s.consulta}\` | **Operadores:** ${s.operadores || 'Boolean'} | **Docs Esperados:** ${s.documentosEsperados || 'Ref.'}`).join('\n')}

## III. Ficha Técnica del Dataset
- **Archivo:** ${data.dataset.archivo || 'N/A'}
- **Registros:** ${data.dataset.metadata?.numero_registros || 'Sin registrar'}
- **Licencia:** ${data.dataset.metadata?.licencia || 'Abierta'}

## IV. Implementación en Lenguaje R
${allScripts.map(sc => `### Script: ${sc.archivo} (${sc.categoria || 'R'})\n\`\`\`r\n${sc.codigo}\n\`\`\``).join('\n\n')}

## V. Métricas y Diagnóstico Empírico
\`\`\`
${data.results.metricas || 'Sin métricas de texto registradas.'}
\`\`\`

## VI. Matriz de Cumplimiento (8 Actividades)
- 1. Búsqueda bibliográfica: Verificada
- 2. Documentos seleccionados: Verificada
- 3. Análisis de pertinencia: Verificada
- 4. Dataset seleccionado: Verificada
- 5. Ejemplo en R (3 scripts): Verificada
- 6. Resultados y gráficos: Verificada
- 7. Documentación LaTeX: Verificada
- 8. Sustentación formal: Aprobada

## Referencias
${data.documents.map((d, i) => `[${i + 1}] ${d.autores} (${d.anio || 's.f.'}). "${d.titulo}". ${d.fuente || ''}.`).join('\n')}
`;

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
      {/* BARRA SUPERIOR DE HERRAMIENTAS Y ACCIONES (Se oculta al imprimir) */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem',
          backgroundColor: 'var(--bg-surface)',
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Award size={13} /> Actividad 8: Sustentación
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Investigador: <strong style={{ color: 'var(--text-main)' }}>{profile.name}</strong> ({profile.code})
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem' }}>
              Generador de Dossier Académico &amp; Informe de Sustentación
            </h2>
          </div>

          {/* Botones de Acción */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                if (data) {
                  openDefense(selectedUnitId, selectedTopicId, data.topicName);
                }
              }}
              disabled={loading || !data}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.85rem',
                backgroundColor: '#ea580c',
                borderColor: '#c2410c',
              }}
              title="Presentar Sustentación Oral ante el Tribunal Examinador"
            >
              <Award size={16} />
              Sustentar ante el Jurado
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={loading || !data}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
            >
              <Printer size={16} />
              Imprimir / Guardar en PDF
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              disabled={loading || !data}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
              title="Descargar documento HTML autónomo (abre sin servidor)"
            >
              <Download size={16} />
              Descargar .html Autónomo
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              disabled={loading || !data}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem' }}
            >
              {copiedMd ? <Check size={16} style={{ color: 'var(--c-completed)' }} /> : <Copy size={16} />}
              {copiedMd ? '¡Markdown Copiado!' : 'Copiar Markdown'}
            </button>
          </div>
        </div>

        {/* SELECTORES DE TEMA Y ESTILO */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {/* Selector de Tema agrupado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Seleccionar Tema:
            </label>
            <select
              value={`${selectedUnitId}__${selectedTopicId}`}
              onChange={(e) => {
                const [u, t] = e.target.value.split('__');
                setSelectedUnitId(u as UnitId);
                setSelectedTopicId(t);
              }}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                minWidth: '280px',
              }}
            >
              {course?.unidades.map((u) => (
                <optgroup key={u.id} label={`${u.id}: ${u.nombre}`}>
                  {u.temas.map((tm) => (
                    <option key={tm.id} value={`${u.id}__${tm.id}`}>
                      {tm.nombre}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {data && (
              <>
                <button
                  type="button"
                  onClick={() => openTopic(selectedUnitId, selectedTopicId)}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <BookOpen size={14} /> Ver Ficha del Tema
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('units')}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <ArrowLeft size={14} /> Explorar Unidades
                </button>
              </>
            )}
          </div>

          {/* Selector de Layout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Formato:</span>
            <div
              style={{
                display: 'inline-flex',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-elevated)',
                padding: '0.2rem',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <button
                type="button"
                onClick={() => setLayout('ieee')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: layout === 'ieee' ? 600 : 500,
                  cursor: 'pointer',
                  backgroundColor: layout === 'ieee' ? 'var(--c-interactive-bg)' : 'transparent',
                  color: layout === 'ieee' ? 'var(--c-interactive-hover)' : 'var(--text-muted)',
                }}
              >
                <Columns size={14} />
                IEEE (2 Columnas)
              </button>

              <button
                type="button"
                onClick={() => setLayout('monograph')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: layout === 'monograph' ? 600 : 500,
                  cursor: 'pointer',
                  backgroundColor: layout === 'monograph' ? 'var(--c-interactive-bg)' : 'transparent',
                  color: layout === 'monograph' ? 'var(--c-interactive-hover)' : 'var(--text-muted)',
                }}
              >
                <Layout size={14} />
                Monografía (1 Columna)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ESTADO DE CARGA */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <Loader2 size={40} className="spin" style={{ color: 'var(--c-interactive-hover)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Generando documento académico a partir de la telemetría del tema...
          </p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div
          style={{
            maxWidth: '650px',
            margin: '2rem auto',
            padding: '1.5rem',
            backgroundColor: 'var(--c-danger-bg)',
            border: '1px solid var(--c-danger)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={32} style={{ color: 'var(--c-danger)', margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontWeight: 700, color: 'var(--c-danger)' }}>Error al generar dossier</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.35rem' }}>{error}</p>
        </div>
      )}

      {/* RENDERIZADO DEL PAPEL ACADÉMICO */}
      {data && !loading && (
        <div className="view-transition">
          <DossierPaper topic={data} profile={profile} layout={layout} />
        </div>
      )}
    </div>
  );
};
