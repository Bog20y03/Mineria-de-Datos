import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { getTopicDetail } from '../../services/topicService';
import { runTopicRScript } from '../../services/runService';
import { fetchTopicMetrics, type MetricsFetchResult } from '../../services/metricsService';
import {
  type StationId,
  getEstacionesOperadas,
  registrarEstacionOperada,
  reiniciarRecorridoTema,
} from '../../services/recorridoService';
import type { TopicDetail, UnitId } from '../../types/domain';
import type { PiecePayload } from './types';
import { MachineScene } from './MachineScene';
import { StationDrawer } from './StationDrawer';
import { PresentationOverlay } from './PresentationOverlay';
import { Button } from '../ui';
import {
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Check,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Coordenadas porcentuales en la banda transportadora
const STATION_POSITIONS: Record<StationId, number> = {
  terminal: 10,
  biblioteca: 30,
  laboratorio: 50,
  escritorio: 70,
  pizarra: 90,
};

export const MachineView: React.FC = () => {
  const { course, setMode } = useApp();

  // 1. Selector de tema ("Pedido")
  const [selectedUnitId, setSelectedUnitId] = useState<UnitId>('UNIDAD_1');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('01_MINERIA_DE_DATOS');
  const [topicDetail, setTopicDetail] = useState<TopicDetail | null>(null);
  const [loadingTopic, setLoadingTopic] = useState<boolean>(true);

  // 2. Estación activa y Drawer
  const [activeStation, setActiveStation] = useState<StationId>('terminal');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);

  // 3. Estado de ejecución en el Laboratorio R
  const [runningR, setRunningR] = useState<boolean>(false);
  const [rExecutionLog, setRExecutionLog] = useState<{ exitCode: number; salida: string; tiempoSegundos?: number } | null>(null);
  const [rMetrics, setRMetrics] = useState<MetricsFetchResult | null>(null);
  const [revealedImages, setRevealedImages] = useState<string[]>([]);
  const [dockedPiece, setDockedPiece] = useState<string | null>(null);
  const [copiedTex, setCopiedTex] = useState<boolean>(false);

  // 4. Mecánica de la Pieza y Producción Secuencial ("Producir tema")
  const [isProducing, setIsProducing] = useState<boolean>(false);
  const [productionStepIndex, setProductionStepIndex] = useState<number>(0);
  const [currentPiece, setCurrentPiece] = useState<PiecePayload | null>(null);
  const [piecePositionPercent, setPiecePositionPercent] = useState<number>(STATION_POSITIONS.terminal);
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string | undefined>(undefined);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // 5. Estaciones operadas en localStorage
  const [operadas, setOperadas] = useState<StationId[]>([]);
  const abortControllerRef = useRef<boolean>(false);

  // Actualizar estaciones operadas desde el servicio
  const refreshOperadas = () => {
    const list = getEstacionesOperadas(selectedUnitId, selectedTopicId);
    setOperadas(list);
  };

  // Cargar datos del tema seleccionado
  useEffect(() => {
    let mounted = true;
    setLoadingTopic(true);
    setDockedPiece(null);
    setFeedback(null);
    setRExecutionLog(null);
    setRMetrics(null);
    setRevealedImages([]);
    setIsRejected(false);
    setRejectReason(undefined);
    setIsProducing(false);

    getTopicDetail(selectedUnitId, selectedTopicId, { refresh: true })
      .then((detail) => {
        if (!mounted) return;
        setTopicDetail(detail);
        refreshOperadas();

        // Preparar imágenes iniciales con su URL ya resuelta (src)
        if (detail.results.imagenes && detail.results.imagenes.length > 0) {
          setRevealedImages(detail.results.imagenes.map((img) => img.src));
        }
        if (detail.results.metricas) {
          fetchTopicMetrics(selectedUnitId, selectedTopicId, detail.results.metricas).then((m) => {
            if (mounted) setRMetrics(m);
          });
        }

        // Inicializar pieza representativa en la Terminal
        if (detail.searches.length > 0) {
          setCurrentPiece({
            tipo: 'consulta',
            label: detail.searches[0].id,
            sublabel: `${detail.searches.length} consultas`,
            badge: 'Terminal',
          });
        } else {
          setCurrentPiece({
            tipo: 'consulta',
            label: 'Sin consultas',
            sublabel: 'Sin datos registrados',
            badge: 'Terminal',
          });
        }
        setPiecePositionPercent(STATION_POSITIONS.terminal);
      })
      .catch((err) => {
        if (!mounted) return;
        setFeedback({
          text: `Error al cargar datos del tema: ${err instanceof Error ? err.message : String(err)}`,
          type: 'error',
        });
      })
      .finally(() => {
        if (mounted) setLoadingTopic(false);
      });

    return () => {
      mounted = false;
      abortControllerRef.current = true;
    };
  }, [selectedUnitId, selectedTopicId]);

  // Manejar cambio de tema en selector
  const handleTopicChange = (uId: UnitId, tId: string) => {
    abortControllerRef.current = true;
    setSelectedUnitId(uId);
    setSelectedTopicId(tId);
  };

  // Reiniciar recorrido de este tema
  const handleResetTopicJourney = () => {
    reiniciarRecorridoTema(selectedUnitId, selectedTopicId);
    setDockedPiece(null);
    setRExecutionLog(null);
    setIsRejected(false);
    setRejectReason(undefined);
    refreshOperadas();
    setPiecePositionPercent(STATION_POSITIONS.terminal);
    setActiveStation('terminal');
    setFeedback({
      text: 'Recorrido del tema reiniciado. Puedes volver a operar las 5 estaciones.',
      type: 'info',
    });
  };

  // Seleccionar estación manualmente (Viaje rápido con operador)
  const handleSelectStation = (stId: StationId) => {
    setActiveStation(stId);
    setPiecePositionPercent(STATION_POSITIONS[stId]);
    setIsDrawerOpen(true);

    // Ajustar pieza visual acorde a la estación elegida si no se está produciendo
    if (!isProducing && topicDetail) {
      setIsRejected(false);
      switch (stId) {
        case 'terminal':
          setCurrentPiece({
            tipo: 'consulta',
            label: topicDetail.searches[0]?.id || 'CONSULTA',
            sublabel: `${topicDetail.searches.length} consultas`,
            badge: 'Terminal',
          });
          break;
        case 'biblioteca':
          setCurrentPiece({
            tipo: 'documentos',
            label: `${topicDetail.documents.length} Documentos`,
            sublabel: 'Artículos DOI',
            badge: 'Biblioteca',
          });
          break;
        case 'laboratorio':
          setCurrentPiece({
            tipo: 'dataset_script',
            label: topicDetail.rExample?.archivo || 'script.R',
            sublabel: topicDetail.dataset?.archivo || 'dataset.csv',
            badge: 'Laboratorio',
          });
          break;
        case 'escritorio':
          setCurrentPiece({
            tipo: 'latex',
            label: topicDetail.latex?.archivo || 'documento.tex',
            sublabel: 'Código .tex',
            badge: 'Escritorio',
          });
          break;
        case 'pizarra':
          setCurrentPiece({
            tipo: 'sustentacion',
            label: 'Sustentación',
            sublabel: 'Evidencias',
            badge: 'Pizarra',
          });
          break;
      }
    }
  };

  // =========================================================================
  // BOTÓN "PRODUCIR TEMA" (10-15s con datos y R reales)
  // =========================================================================
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleProduceTopic = async () => {
    if (!topicDetail || isProducing) return;
    abortControllerRef.current = false;
    setIsProducing(true);
    setIsRejected(false);
    setRejectReason(undefined);
    setFeedback(null);

    try {
      // -------------------------------------------------------------
      // PASO 1: TERMINAL
      // -------------------------------------------------------------
      setProductionStepIndex(0);
      setActiveStation('terminal');
      setPiecePositionPercent(STATION_POSITIONS.terminal);

      if (topicDetail.searches.length === 0) {
        setIsRejected(true);
        setRejectReason('Sin consultas registradas');
        setFeedback({
          text: 'Acople rechazado: Sin consultas registradas para este tema.',
          type: 'error',
        });
        setIsProducing(false);
        return;
      }

      setCurrentPiece({
        tipo: 'consulta',
        label: topicDetail.searches[0].id,
        sublabel: `${topicDetail.searches.length} ecuaciones`,
        badge: 'Terminal ✓',
      });
      registrarEstacionOperada(selectedUnitId, selectedTopicId, 'terminal');
      refreshOperadas();
      await sleep(1500);
      if (abortControllerRef.current) return;

      // -------------------------------------------------------------
      // PASO 2: BIBLIOTECA
      // -------------------------------------------------------------
      setProductionStepIndex(1);
      setActiveStation('biblioteca');
      setPiecePositionPercent(STATION_POSITIONS.biblioteca);

      if (topicDetail.documents.length === 0) {
        setIsRejected(true);
        setRejectReason('Sin documentos registrados');
        setFeedback({
          text: 'Acople rechazado: Sin documentos registrados para este tema.',
          type: 'error',
        });
        setIsProducing(false);
        return;
      }

      setCurrentPiece({
        tipo: 'documentos',
        label: `${topicDetail.documents.length} Documentos`,
        sublabel: 'Artículos científicos DOI',
        badge: 'Biblioteca ✓',
      });
      registrarEstacionOperada(selectedUnitId, selectedTopicId, 'biblioteca');
      refreshOperadas();
      await sleep(1800);
      if (abortControllerRef.current) return;

      // -------------------------------------------------------------
      // PASO 3: LABORATORIO (EJECUCIÓN R REAL)
      // -------------------------------------------------------------
      setProductionStepIndex(2);
      setActiveStation('laboratorio');
      setPiecePositionPercent(STATION_POSITIONS.laboratorio);

      const hasCsv = Boolean(topicDetail.dataset?.archivo);
      const hasScript = Boolean(topicDetail.rExample?.archivo);
      if (!hasCsv || !hasScript) {
        setIsRejected(true);
        setRejectReason('Faltan artefactos físicos (CSV / .R)');
        setFeedback({
          text: 'Acople rechazado: Faltan artefactos físicos en el tema. Sin datos registrados.',
          type: 'error',
        });
        setIsProducing(false);
        return;
      }

      setDockedPiece('dataset_script');
      setCurrentPiece({
        tipo: 'dataset_script',
        label: topicDetail.rExample?.archivo || 'script.R',
        sublabel: topicDetail.dataset?.archivo || 'dataset.csv',
        badge: 'En cómputo R...',
      });

      // Ejecución R Nativa Real
      setRunningR(true);
      const tStart = performance.now();
      const res = await runTopicRScript(selectedUnitId, selectedTopicId);
      const durSec = (performance.now() - tStart) / 1000;
      setRunningR(false);

      setRExecutionLog({ exitCode: res.exitCode, salida: res.salida, tiempoSegundos: durSec });

      if (!res.ok) {
        setIsRejected(true);
        setRejectReason(`Error en R (exit ${res.exitCode})`);
        setFeedback({
          text: `Ejecución de R terminada con código de error ${res.exitCode}. Detención de seguridad.`,
          type: 'error',
        });
        setIsProducing(false);
        return;
      }

      // R exitoso
      registrarEstacionOperada(selectedUnitId, selectedTopicId, 'laboratorio');
      refreshOperadas();

      if (res.results.imagenes && res.results.imagenes.length > 0) {
        setRevealedImages(res.results.imagenes.map((img) => img.src));
      }

      const metricsData = await fetchTopicMetrics(selectedUnitId, selectedTopicId, res.results.metricas);
      setRMetrics(metricsData);

      setCurrentPiece({
        tipo: 'graficas_metricas',
        label: `${res.results.imagenes?.length || 1} Figuras PNG`,
        sublabel: metricsData.hasJson ? 'Métricas JSON' : 'Métricas TXT',
        badge: 'Laboratorio ✓',
      });
      await sleep(2000);
      if (abortControllerRef.current) return;

      // -------------------------------------------------------------
      // PASO 4: ESCRITORIO (LATEX)
      // -------------------------------------------------------------
      setProductionStepIndex(3);
      setActiveStation('escritorio');
      setPiecePositionPercent(STATION_POSITIONS.escritorio);

      if (!topicDetail.latex?.codigo) {
        setIsRejected(true);
        setRejectReason('Sin código LaTeX registrado');
        setFeedback({
          text: 'Acople rechazado: Sin código LaTeX registrado para este manuscrito.',
          type: 'error',
        });
        setIsProducing(false);
        return;
      }

      registrarEstacionOperada(selectedUnitId, selectedTopicId, 'escritorio');
      refreshOperadas();

      const lineasTex = topicDetail.latex.codigo.split('\n').length;
      setCurrentPiece({
        tipo: 'latex',
        label: topicDetail.latex.archivo || 'documento.tex',
        sublabel: `${lineasTex} líneas estructuradas`,
        badge: 'Escritorio ✓',
      });
      await sleep(1800);
      if (abortControllerRef.current) return;

      // -------------------------------------------------------------
      // PASO 5: PIZARRA (SUSTENTACIÓN)
      // -------------------------------------------------------------
      setProductionStepIndex(4);
      setActiveStation('pizarra');
      setPiecePositionPercent(STATION_POSITIONS.pizarra);

      registrarEstacionOperada(selectedUnitId, selectedTopicId, 'pizarra');
      refreshOperadas();

      setCurrentPiece({
        tipo: 'sustentacion',
        label: 'Sustentación Validada',
        sublabel: '5 de 5 estaciones operadas',
        badge: 'Completada ✓',
      });

      setFeedback({
        text: `¡Línea completada al 100%! "${topicDetail.topicName}" producido en secuencia con datos y cómputo R reales.`,
        type: 'success',
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#EA580C', '#2563EB', '#10B981', '#F59E0B', '#38BDF8'],
      });
    } catch (err) {
      setIsRejected(true);
      setRejectReason('Fallo durante la secuencia');
      setFeedback({
        text: `Error en producción: ${err instanceof Error ? err.message : String(err)}`,
        type: 'error',
      });
    } finally {
      setIsProducing(false);
    }
  };

  // Acciones Manuales de Estaciones
  const handleTransferTerminal = () => {
    if (!topicDetail || topicDetail.searches.length === 0) {
      setFeedback({ text: 'Acople rechazado: Sin consultas registradas.', type: 'error' });
      return;
    }
    registrarEstacionOperada(selectedUnitId, selectedTopicId, 'terminal');
    refreshOperadas();
    handleSelectStation('biblioteca');
  };

  const handleTransferBiblioteca = () => {
    if (!topicDetail || topicDetail.documents.length === 0) {
      setFeedback({ text: 'Acople rechazado: Sin documentos registrados.', type: 'error' });
      return;
    }
    registrarEstacionOperada(selectedUnitId, selectedTopicId, 'biblioteca');
    refreshOperadas();
    handleSelectStation('laboratorio');
  };

  const handleDockLaboratorio = () => {
    if (!topicDetail) return;
    if (!topicDetail.dataset?.archivo || !topicDetail.rExample?.archivo) {
      setFeedback({ text: 'Acople rechazado: Faltan artefactos físicos. Sin datos registrados.', type: 'error' });
      return;
    }
    setDockedPiece('dataset_script');
    setFeedback({
      text: `¡Pieza acoplada con éxito! Dataset (${topicDetail.dataset.archivo}) y Script R (${topicDetail.rExample.archivo}) listos.`,
      type: 'success',
    });
  };

  const handleExecuteRManual = async () => {
    if (!topicDetail) return;
    setRunningR(true);
    setFeedback(null);
    try {
      const t0 = performance.now();
      const res = await runTopicRScript(selectedUnitId, selectedTopicId);
      const dur = (performance.now() - t0) / 1000;
      setRExecutionLog({ exitCode: res.exitCode, salida: res.salida, tiempoSegundos: dur });

      if (res.ok) {
        registrarEstacionOperada(selectedUnitId, selectedTopicId, 'laboratorio');
        refreshOperadas();
        if (res.results.imagenes && res.results.imagenes.length > 0) {
          setRevealedImages(res.results.imagenes.map((img) => img.src));
        }
        const metricsData = await fetchTopicMetrics(selectedUnitId, selectedTopicId, res.results.metricas);
        setRMetrics(metricsData);
        setFeedback({
          text: `Laboratorio completado con éxito (código de salida ${res.exitCode}). Gráficas y métricas actualizadas.`,
          type: 'success',
        });
      } else {
        setFeedback({
          text: `Ejecución de R terminada con código ${res.exitCode}.`,
          type: 'error',
        });
      }
    } catch (err) {
      setFeedback({
        text: `Error al ejecutar R: ${err instanceof Error ? err.message : String(err)}`,
        type: 'error',
      });
    } finally {
      setRunningR(false);
    }
  };

  const handleTransferEscritorio = () => {
    handleSelectStation('escritorio');
  };

  const handleCopyTex = () => {
    if (!topicDetail?.latex?.codigo) return;
    navigator.clipboard.writeText(topicDetail.latex.codigo);
    setCopiedTex(true);
    setTimeout(() => setCopiedTex(false), 2500);
  };

  const handleDownloadTex = () => {
    if (!topicDetail?.latex?.codigo) return;
    const blob = new Blob([topicDetail.latex.codigo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = topicDetail.latex.archivo || `${selectedTopicId}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTransferPizarra = () => {
    registrarEstacionOperada(selectedUnitId, selectedTopicId, 'escritorio');
    refreshOperadas();
    handleSelectStation('pizarra');
  };

  const handleConcludePizarra = () => {
    registrarEstacionOperada(selectedUnitId, selectedTopicId, 'pizarra');
    refreshOperadas();
    setFeedback({
      text: '¡Sustentación completada! Evidencias, métricas y fundamentación validadas.',
      type: 'success',
    });
  };

  // Lista plana de temas para el selector
  const allTopics = useMemo(() => {
    if (!course) return [];
    return course.unidades.flatMap((u) =>
      u.temas.map((t) => ({
        unitId: u.id,
        unitNumero: u.numero,
        unitNombre: u.nombre,
        topicId: t.id,
        topicNombre: t.nombre,
      }))
    );
  }, [course]);

  const allCompleted = operadas.length === 5;

  return (
    <div
      style={{
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '1.5rem 1.25rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* 1. Barra de Control Superior */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--color-card)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          boxShadow: 'var(--shadow-atlas-xs)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--color-ink-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'block',
                marginBottom: '0.2rem',
              }}
            >
              Línea de Producción • Pedido Curricular
            </span>
            <select
              value={`${selectedUnitId}:${selectedTopicId}`}
              onChange={(e) => {
                const [u, t] = e.target.value.split(':') as [UnitId, string];
                handleTopicChange(u, t);
              }}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                color: 'var(--color-ink)',
                backgroundColor: 'var(--color-card-muted)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.45rem 0.75rem',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '290px',
              }}
            >
              {allTopics.map((item) => (
                <option key={`${item.unitId}:${item.topicId}`} value={`${item.unitId}:${item.topicId}`}>
                  {`U${item.unitNumero}-${item.topicId.split('_')[0]}: ${item.topicNombre}`}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: allCompleted ? 'var(--color-blue-soft)' : 'var(--color-card-muted)',
              border: `1px solid ${allCompleted ? 'var(--color-blue-border)' : 'var(--color-border)'}`,
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              color: allCompleted ? 'var(--color-blue-ink)' : 'var(--color-ink)',
            }}
          >
            <CheckCircle2 size={15} color={allCompleted ? 'var(--color-blue-ink)' : 'var(--color-terracotta)'} />
            <span>Estaciones operadas: {operadas.length} de 5</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetTopicJourney}
            title="Reiniciar estaciones operadas en este tema"
          >
            <RotateCcw size={14} /> Reiniciar
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setMode('direct')}
          >
            Modo Directo <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      {/* 2. Banner de Feedback */}
      {feedback && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            backgroundColor:
              feedback.type === 'success'
                ? 'var(--color-blue-soft)'
                : feedback.type === 'error'
                ? 'var(--color-danger-bg)'
                : 'var(--color-card-muted)',
            border: `1.5px solid ${
              feedback.type === 'success'
                ? 'var(--color-blue-border)'
                : feedback.type === 'error'
                ? 'var(--color-danger-border)'
                : 'var(--color-border)'
            }`,
            color:
              feedback.type === 'success'
                ? 'var(--color-blue-ink)'
                : feedback.type === 'error'
                ? 'var(--color-danger-ink)'
                : 'var(--color-ink)',
            animation: 'cardEntrance 200ms ease-out',
          }}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : feedback.type === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <Check size={18} />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* 3. Banner de Completado 5 de 5 */}
      {allCompleted && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-blue-soft)',
            border: '2px solid var(--color-blue-ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            animation: 'cardEntrance 280ms ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Award size={32} color="var(--color-blue-ink)" />
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--color-blue-ink)' }}>
                ¡Línea de Producción Validada al 100%!
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)' }}>
                Se validaron consultas, acervo bibliográfico, script de R nativo, manuscrito LaTeX y sustentación integral para "{topicDetail?.topicName}".
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setMode('direct')}>
            Ver en Modo Directo <ArrowRight size={13} />
          </Button>
        </div>
      )}

      {/* 4. ESCENA COMO PROTAGONISTA (TAREA 1 & TAREA 2) */}
      {loadingTopic && !topicDetail ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 0' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-secondary)' }}>
            Cargando pedido curricular de La Máquina...
          </p>
        </div>
      ) : (
        <MachineScene
          topicDetail={topicDetail}
          activeStation={activeStation}
          operadas={operadas}
          isProducing={isProducing}
          productionStepIndex={productionStepIndex}
          currentPiece={currentPiece}
          piecePositionPercent={piecePositionPercent}
          isRejected={isRejected}
          rejectReason={rejectReason}
          isProcessingR={runningR}
          onSelectStation={handleSelectStation}
          onProduceTopic={handleProduceTopic}
          onResetJourney={handleResetTopicJourney}
          onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
          onEnterPresentation={() => setIsPresentationOpen(true)}
        />
      )}

      {/* 5. DRAWER TÉCNICO LATERAL (TAREA 1) */}
      <StationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeStation={activeStation}
        topicDetail={topicDetail}
        operadas={operadas}
        dockedPiece={dockedPiece}
        runningR={runningR}
        rExecutionLog={rExecutionLog}
        rMetrics={rMetrics}
        revealedImages={revealedImages}
        copiedTex={copiedTex}
        onTransferTerminal={handleTransferTerminal}
        onTransferBiblioteca={handleTransferBiblioteca}
        onDockLaboratorio={handleDockLaboratorio}
        onExecuteR={handleExecuteRManual}
        onTransferEscritorio={handleTransferEscritorio}
        onCopyTex={handleCopyTex}
        onDownloadTex={handleDownloadTex}
        onTransferPizarra={handleTransferPizarra}
        onConcludePizarra={handleConcludePizarra}
      />

      {/* 6. MODO PRESENTACIÓN INMERSIVO (TAREA 5) */}
      <PresentationOverlay
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        topicDetail={topicDetail}
        activeStation={activeStation}
        operadas={operadas}
        isProducing={isProducing}
        productionStepIndex={productionStepIndex}
        currentPiece={currentPiece}
        piecePositionPercent={piecePositionPercent}
        isRejected={isRejected}
        rejectReason={rejectReason}
        isProcessingR={runningR}
        onSelectStation={handleSelectStation}
        onProduceTopic={handleProduceTopic}
        onResetJourney={handleResetTopicJourney}
        onToggleDrawer={() => setIsDrawerOpen(true)}
      />
    </div>
  );
};
