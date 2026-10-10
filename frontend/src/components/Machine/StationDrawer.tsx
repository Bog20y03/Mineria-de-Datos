import React, { useState } from 'react';
import type { TopicDetail } from '../../types/domain';
import type { StationId } from './types';
import type { MetricsFetchResult } from '../../services/metricsService';
import {
  Button,
  StatusBadge,
  EmptyState,
} from '../ui';
import {
  Terminal,
  BookOpen,
  FlaskConical,
  FileText,
  Presentation,
  Play,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Copy,
  Download,
  Check,
  X,
} from 'lucide-react';

interface StationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeStation: StationId;
  topicDetail: TopicDetail | null;
  operadas: StationId[];
  dockedPiece: string | null;
  runningR: boolean;
  rExecutionLog: { exitCode: number; salida: string; tiempoSegundos?: number } | null;
  rMetrics: MetricsFetchResult | null;
  revealedImages: string[];
  copiedTex: boolean;
  onTransferTerminal: () => void;
  onTransferBiblioteca: () => void;
  onDockLaboratorio: () => void;
  onExecuteR: () => void;
  onTransferEscritorio: () => void;
  onCopyTex: () => void;
  onDownloadTex: () => void;
  onTransferPizarra: () => void;
  onConcludePizarra: () => void;
}

export const StationDrawer: React.FC<StationDrawerProps> = ({
  isOpen,
  onClose,
  activeStation,
  topicDetail,
  operadas,
  dockedPiece,
  runningR,
  rExecutionLog,
  rMetrics,
  revealedImages,
  copiedTex,
  onTransferTerminal,
  onTransferBiblioteca,
  onDockLaboratorio,
  onExecuteR,
  onTransferEscritorio,
  onCopyTex,
  onDownloadTex,
  onTransferPizarra,
  onConcludePizarra,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '560px',
        backgroundColor: 'var(--color-card)',
        borderLeft: '1.5px solid var(--color-border)',
        boxShadow: '-8px 0 24px rgba(31, 42, 60, 0.15)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}
      className="drawer-slide-in"
    >
      {/* Cabecera del Drawer */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-card-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-terracotta-soft)',
              color: 'var(--color-terracotta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {activeStation === 'terminal' && <Terminal size={18} />}
            {activeStation === 'biblioteca' && <BookOpen size={18} />}
            {activeStation === 'laboratorio' && <FlaskConical size={18} />}
            {activeStation === 'escritorio' && <FileText size={18} />}
            {activeStation === 'pizarra' && <Presentation size={18} />}
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
              Mesa de Trabajo Técnica
            </div>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
              Estación: {activeStation.toUpperCase()}
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <StatusBadge
            status={operadas.includes(activeStation) ? 'completado' : 'pendiente'}
            label={operadas.includes(activeStation) ? 'Operada ✓' : 'Pendiente'}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel de estación"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-ink-secondary)',
              padding: '4px',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Contenido scrolleable de la Estación */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* =========================================================================
            ESTACIÓN 1: TERMINAL
            ========================================================================= */}
        {activeStation === 'terminal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-card-muted)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
                  Consultas Indexadas:
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-ink)' }}>
                  {topicDetail?.searches.length || 0} registradas en bitácora
                </div>
              </div>
              <Button variant="primary" size="sm" onClick={onTransferTerminal}>
                Transferir a Biblioteca <ArrowRight size={14} />
              </Button>
            </div>

            {topicDetail && topicDetail.searches.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topicDetail.searches.map((eq) => (
                  <div
                    key={eq.id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem',
                      backgroundColor: 'var(--color-card)',
                      boxShadow: 'var(--shadow-atlas-xs)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          backgroundColor: 'var(--color-blue-soft)',
                          color: 'var(--color-blue-ink)',
                          borderRadius: 'var(--radius-xs)',
                        }}
                      >
                        {eq.id}
                      </span>
                      {eq.urlScholar && (
                        <a
                          href={eq.urlScholar}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '11px',
                            color: 'var(--color-terracotta)',
                            textDecoration: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Google Scholar <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        padding: '0.5rem',
                        backgroundColor: 'var(--color-card-muted)',
                        borderRadius: 'var(--radius-xs)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11.5px',
                        color: 'var(--color-ink)',
                        whiteSpace: 'pre-wrap',
                        border: '1px solid var(--color-border-light)',
                      }}
                    >
                      {eq.consulta}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                titulo="Sin consultas registradas"
                descripcion="No se encontraron ecuaciones booleanas asociadas a este tema."
              />
            )}
          </div>
        )}

        {/* =========================================================================
            ESTACIÓN 2: BIBLIOTECA
            ========================================================================= */}
        {activeStation === 'biblioteca' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-card-muted)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
                  Acervo Académico:
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-ink)' }}>
                  {topicDetail?.documents.length || 0} artículos verificados
                </div>
              </div>
              <Button variant="primary" size="sm" onClick={onTransferBiblioteca}>
                Transferir al Laboratorio <ArrowRight size={14} />
              </Button>
            </div>

            {topicDetail && topicDetail.documents.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topicDetail.documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.75rem',
                      backgroundColor: 'var(--color-card)',
                      boxShadow: 'var(--shadow-atlas-xs)',
                    }}
                  >
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.25rem' }}>
                      {doc.titulo}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', marginBottom: '0.35rem' }}>
                      {doc.autores || 'Sin autor'} ({doc.anio || 's.f.'}) {doc.fuente && <span> • <em>{doc.fuente}</em></span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '11px' }}>
                      {doc.doi ? (
                        <a
                          href={`https://doi.org/${doc.doi}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: 'var(--color-terracotta)',
                            textDecoration: 'none',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                          }}
                        >
                          DOI: {doc.doi} <ExternalLink size={10} />
                        </a>
                      ) : (
                        <span style={{ color: 'var(--color-ink-muted)' }}>Sin DOI</span>
                      )}
                      {doc.pertinencia && (
                        <span
                          style={{
                            fontSize: '9.5px',
                            fontWeight: 700,
                            padding: '1px 5px',
                            borderRadius: 'var(--radius-xs)',
                            backgroundColor: doc.pertinencia === 'Alta' ? 'var(--color-blue-soft)' : 'var(--color-card-muted)',
                            color: doc.pertinencia === 'Alta' ? 'var(--color-blue-ink)' : 'var(--color-ink-muted)',
                          }}
                        >
                          Pertinencia: {doc.pertinencia}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                titulo="Sin documentos registrados"
                descripcion="No se encontraron artículos en la matriz bibliográfica."
              />
            )}
          </div>
        )}

        {/* =========================================================================
            ESTACIÓN 3: LABORATORIO (R NATIVO)
            ========================================================================= */}
        {activeStation === 'laboratorio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Bahía de Acople y Botones */}
            <div
              style={{
                padding: '0.85rem',
                backgroundColor: 'var(--color-card-muted)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
                    Artefacto de Entrada:
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-ink)' }}>
                    Dataset: {topicDetail?.dataset?.archivo || 'Sin CSV'} • Script: {topicDetail?.rExample?.archivo || 'Sin .R'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!dockedPiece ? (
                    <Button variant="secondary" size="sm" onClick={onDockLaboratorio}>
                      Acoplar al Laboratorio
                    </Button>
                  ) : (
                    <Button variant="primary" size="sm" loading={runningR} onClick={onExecuteR}>
                      <Play size={13} /> Ejecutar en R (run_r)
                    </Button>
                  )}
                  {operadas.includes('laboratorio') && (
                    <Button variant="secondary" size="sm" onClick={onTransferEscritorio}>
                      Enviar al Escritorio <ArrowRight size={13} />
                    </Button>
                  )}
                </div>
              </div>

              {/* Zona de Drop visual */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  onDockLaboratorio();
                }}
                className={isDragOver ? 'dock-zone-hover' : dockedPiece ? 'dock-snap' : undefined}
                style={{
                  border: `2px dashed ${dockedPiece ? 'var(--color-blue-ink)' : 'var(--color-border)'}`,
                  backgroundColor: dockedPiece ? 'var(--color-blue-soft)' : 'transparent',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  textAlign: 'center',
                }}
              >
                {dockedPiece ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} color="var(--color-blue-ink)" />
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-blue-ink)' }}>
                      Pieza acoplada en el reactor. Presiona "Ejecutar en R (run_r)".
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                    Arrastra la pieza "Dataset + Script R" o toca "Acoplar"
                  </span>
                )}
              </div>
            </div>

            {/* Consola Nativa R con fondo oscuro #1F2A3C como pide el requisito 6 */}
            {rExecutionLog && (
              <div
                style={{
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#161F2E',
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #2B3A4F',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#E6EDF3', fontSize: '11px', fontWeight: 700 }}>
                    <Terminal size={14} color="var(--color-terracotta)" />
                    <span>Consola R (Rscript)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {rExecutionLog.tiempoSegundos !== undefined && (
                      <span style={{ fontSize: '10px', color: '#8C8474', fontFamily: 'var(--font-mono)' }}>
                        {rExecutionLog.tiempoSegundos.toFixed(2)}s
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        color: rExecutionLog.exitCode === 0 ? '#4ADE80' : '#F87171',
                      }}
                    >
                      exit_code: {rExecutionLog.exitCode}
                    </span>
                  </div>
                </div>
                <pre
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    backgroundColor: '#1F2A3C',
                    color: '#E6EDF3',
                    padding: '0.75rem',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.45,
                  }}
                >
                  {rExecutionLog.salida || 'Sin salida registrada'}
                </pre>
              </div>
            )}

            {/* Gráficas Generadas con Revelado Animado */}
            {revealedImages.length > 0 && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ink-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Figuras Generadas ({revealedImages.length}):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
                  {revealedImages.filter(Boolean).map((imgSrc, idx) => (
                    <div
                      key={imgSrc}
                      style={{
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.5rem',
                        backgroundColor: '#FFFFFF',
                        boxShadow: 'var(--shadow-atlas-xs)',
                        animation: 'cardEntrance 240ms ease-out both',
                        animationDelay: `${idx * 100}ms`,
                      }}
                    >
                      <img
                        src={imgSrc}
                        alt={`Figura ${idx + 1}`}
                        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-xs)' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Métricas Reales */}
            {rMetrics && (
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ink-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Métricas Cuantitativas {rMetrics.hasJson ? '(metricas.json)' : '(.txt)'}:
                </div>
                {rMetrics.hasJson && rMetrics.json ? (
                  <div
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-card-muted)',
                      border: '1px solid var(--color-border-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      fontSize: '11.5px',
                    }}
                  >
                    <div>
                      <strong>Tarea:</strong> {rMetrics.json.tipo_tarea || 'Sin registrar'} •{' '}
                      <strong>Dataset:</strong> {rMetrics.json.dataset || 'N/A'}
                    </div>
                    {rMetrics.json.baseline_mayoritaria !== null && rMetrics.json.baseline_mayoritaria !== undefined && (
                      <div>
                        <strong>Baseline:</strong> {rMetrics.json.baseline_mayoritaria}% •{' '}
                        <strong>Supera baseline:</strong>{' '}
                        <span style={{ color: rMetrics.json.supera_baseline ? 'var(--color-blue-ink)' : 'var(--color-terracotta)', fontWeight: 700 }}>
                          {rMetrics.json.supera_baseline ? 'Sí' : 'No'}
                        </span>
                      </div>
                    )}
                    {rMetrics.json.interpretacion && (
                      <div style={{ color: 'var(--color-ink-secondary)', fontStyle: 'italic' }}>
                        "{rMetrics.json.interpretacion}"
                      </div>
                    )}
                  </div>
                ) : (
                  <pre
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      backgroundColor: 'var(--color-card-muted)',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {rMetrics.displayOutput}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            ESTACIÓN 4: ESCRITORIO (LATEX)
            ========================================================================= */}
        {activeStation === 'escritorio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-card-muted)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
                  Documento .tex:
                </div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-ink)' }}>
                  {topicDetail?.latex?.archivo || 'Sin archivo .tex'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="ghost" size="sm" onClick={onCopyTex} disabled={!topicDetail?.latex?.codigo}>
                  {copiedTex ? <Check size={13} color="var(--color-blue-ink)" /> : <Copy size={13} />}
                  {copiedTex ? 'Copiado' : 'Copiar'}
                </Button>
                <Button variant="ghost" size="sm" onClick={onDownloadTex} disabled={!topicDetail?.latex?.codigo}>
                  <Download size={13} />
                </Button>
                <Button variant="primary" size="sm" onClick={onTransferPizarra}>
                  Enviar a Pizarra <ArrowRight size={13} />
                </Button>
              </div>
            </div>

            {topicDetail?.latex?.codigo ? (
              <pre
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  backgroundColor: '#1F2A3C',
                  color: '#E6EDF3',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.45,
                }}
              >
                {topicDetail.latex.codigo}
              </pre>
            ) : (
              <EmptyState
                titulo="Sin código LaTeX registrado"
                descripcion="No se encontró archivo .tex en la carpeta de este tema."
              />
            )}
          </div>
        )}

        {/* =========================================================================
            ESTACIÓN 5: PIZARRA (SUSTENTACIÓN)
            ========================================================================= */}
        {activeStation === 'pizarra' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-card-muted)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-light)',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-ink-muted)', textTransform: 'uppercase' }}>
                  Sustentación del Proyecto:
                </div>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-ink)' }}>
                  Evidencias completas del tema
                </div>
              </div>

              <Button variant="primary" size="sm" onClick={onConcludePizarra}>
                <CheckCircle2 size={14} /> Concluir Sustentación
              </Button>
            </div>

            {/* Fundamentación */}
            <div
              style={{
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem',
                backgroundColor: 'var(--color-card)',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ink-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                1. Fundamentación (README.md):
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--color-ink)', maxHeight: '160px', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                {topicDetail?.descripcionMd || 'Sin documentación Markdown registrada.'}
              </div>
            </div>

            {/* Gráficas */}
            <div
              style={{
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem',
                backgroundColor: 'var(--color-card)',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ink-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                2. Evidencias Gráficas ({revealedImages.length}):
              </div>
              {revealedImages.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                  {revealedImages.filter(Boolean).map((imgSrc, idx) => (
                    <img
                      key={imgSrc}
                      src={imgSrc}
                      alt={`Gráfica ${idx + 1}`}
                      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-xs)', border: '1px solid var(--color-border-light)' }}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                  Sin gráficas registradas.
                </div>
              )}
            </div>

            {/* Métricas */}
            <div
              style={{
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem',
                backgroundColor: 'var(--color-card)',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-ink-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                3. Métricas y Conclusiones:
              </div>
              {rMetrics?.hasJson && rMetrics.json ? (
                <div style={{ fontSize: '11.5px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div><strong>Dataset:</strong> {rMetrics.json.dataset} ({rMetrics.json.dataset_origen || 'sin origen'})</div>
                  {rMetrics.json.baseline_mayoritaria !== null && rMetrics.json.baseline_mayoritaria !== undefined && (
                    <div>
                      <strong>Baseline:</strong> {rMetrics.json.baseline_mayoritaria}% •{' '}
                      <strong>Supera baseline:</strong> {rMetrics.json.supera_baseline ? 'Sí' : 'No'}
                    </div>
                  )}
                  {rMetrics.json.interpretacion && (
                    <div style={{ color: 'var(--color-ink-secondary)', fontStyle: 'italic' }}>
                      "{rMetrics.json.interpretacion}"
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                  {rMetrics?.txt || 'Sin datos de métricas registrados.'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
