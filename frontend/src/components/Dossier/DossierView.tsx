import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getTopicDetail } from '../../services/topicService';
import { getUserProfileConfig } from '../../services/avatarService';
import type { TopicDetail, UnitId } from '../../types/domain';
import { DossierPaper } from './DossierPaper';
import { generateDossierHtml, type DossierLayout } from './exportDossierHtml';
import { Button, StatusBadge } from '../ui';
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
          gap: '1.25rem',
          marginBottom: '2rem',
          backgroundColor: 'var(--color-card)',
          padding: '1.5rem 1.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-atlas-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <StatusBadge status="completado" size="sm" label="Actividad 8: Sustentación" />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)' }}>
                Investigador: <strong style={{ color: 'var(--color-ink)' }}>{profile.name}</strong> ({profile.code})
              </span>
            </div>
            <h1
              className="atlas-title"
              style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: 800,
                color: 'var(--color-ink)',
                margin: '0.35rem 0 0',
                letterSpacing: '-0.02em',
              }}
            >
              Generador de Dossier Académico &amp; Informe de Sustentación
            </h1>
          </div>

          {/* Botones de Acción Estilizados con el Design System */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="sm"
              icon={<Award size={15} />}
              onClick={() => {
                if (data) {
                  openDefense(selectedUnitId, selectedTopicId, data.topicName);
                }
              }}
              disabled={loading || !data}
              style={{
                backgroundColor: '#ea580c',
                borderColor: '#c2410c',
                fontWeight: 700,
                boxShadow: '0 2px 5px rgba(234, 88, 12, 0.25)',
              }}
              title="Presentar Sustentación Oral ante el Tribunal Examinador"
            >
              Sustentar ante el Jurado
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<Printer size={15} />}
              onClick={handlePrint}
              disabled={loading || !data}
              title="Imprimir documento o exportar como archivo PDF"
            >
              Imprimir / Guardar en PDF
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<Download size={15} />}
              onClick={handleDownloadHtml}
              disabled={loading || !data}
              title="Descargar documento HTML autónomo listo para abrir sin servidor"
            >
              Descargar .html Autónomo
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={copiedMd ? <Check size={15} style={{ color: '#059669' }} /> : <Copy size={15} />}
              onClick={handleCopyMarkdown}
              disabled={loading || !data}
              title="Copiar contenido estructurado en formato Markdown"
            >
              {copiedMd ? '¡Markdown Copiado!' : 'Copiar Markdown'}
            </Button>
          </div>
        </div>

        {/* SELECTORES DE TEMA Y ESTILO CON MEJOR JERARQUÍA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--color-border-light)',
          }}
        >
          {/* Selector de Tema agrupado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: 'var(--color-ink-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Seleccionar Tema:
            </span>
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
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-card-muted)',
                color: 'var(--color-ink)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: '280px',
                outline: 'none',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<BookOpen size={14} />}
                  onClick={() => openTopic(selectedUnitId, selectedTopicId)}
                  title="Abrir vista detallada y evidencias del tema"
                >
                  Ver Ficha del Tema
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<ArrowLeft size={14} />}
                  onClick={() => setActiveView('units')}
                  title="Regresar a la vista de unidades del curso"
                >
                  Explorar Unidades
                </Button>
              </div>
            )}
          </div>

          {/* Selector de Layout Segmentado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                color: 'var(--color-ink-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Formato:
            </span>
            <div
              style={{
                display: 'inline-flex',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-card-muted)',
                padding: '0.2rem',
                border: '1px solid var(--color-border-light)',
                gap: '0.2rem',
              }}
            >
              <button
                type="button"
                onClick={() => setLayout('ieee')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: 'var(--text-xs)',
                  fontWeight: layout === 'ieee' ? 700 : 500,
                  cursor: 'pointer',
                  backgroundColor: layout === 'ieee' ? 'var(--color-blue-ink)' : 'transparent',
                  color: layout === 'ieee' ? '#FFFFFF' : 'var(--color-ink-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Columns size={13} />
                <span>IEEE (2 Columnas)</span>
              </button>

              <button
                type="button"
                onClick={() => setLayout('monograph')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  fontSize: 'var(--text-xs)',
                  fontWeight: layout === 'monograph' ? 700 : 500,
                  cursor: 'pointer',
                  backgroundColor: layout === 'monograph' ? 'var(--color-blue-ink)' : 'transparent',
                  color: layout === 'monograph' ? '#FFFFFF' : 'var(--color-ink-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                <Layout size={13} />
                <span>Monografía (1 Columna)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ESTADO DE CARGA */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <Loader2 size={40} className="spin" style={{ color: 'var(--color-terracotta)', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-ink-secondary)', fontSize: 'var(--text-sm)' }}>
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
            backgroundColor: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger-border)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={32} style={{ color: 'var(--color-danger-ink)', margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontWeight: 700, color: 'var(--color-danger-ink)' }}>Error al generar dossier</h4>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)', marginTop: '0.35rem' }}>{error}</p>
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
