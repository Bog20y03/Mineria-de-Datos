import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import katex from 'katex';
import type { UnitId } from '../../types/domain';
import { getUserProfileConfig } from '../../services/avatarService';
import {
  TRIBUNAL_JURORS,
  getQuestionsForTopic,
  type DefenseQuestion,
} from '../../data/defenseQuestions';
import {
  evaluateDefense,
  type DefenseCertificate,
} from '../../services/defenseService';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Printer,
  Sparkles,
  ShieldCheck,
  X,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';

export interface TribunalDefenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: UnitId;
  topicId: string;
  topicName: string;
  onDefenseCompleted?: (cert: DefenseCertificate) => void;
}

type DefensePhase = 'intro' | 'exam' | 'deliberating' | 'verdict';

export const TribunalDefenseModal: React.FC<TribunalDefenseModalProps> = ({
  isOpen,
  onClose,
  unitId,
  topicId,
  topicName,
  onDefenseCompleted,
}) => {
  const profile = getUserProfileConfig();
  const [questions, setQuestions] = useState<DefenseQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [phase, setPhase] = useState<DefensePhase>('intro');
  const [certificate, setCertificate] = useState<DefenseCertificate | null>(null);
  const [deliberationStep, setDeliberationStep] = useState<number>(0);

  // Inicializar preguntas al abrir
  useEffect(() => {
    if (isOpen) {
      const qList = getQuestionsForTopic(unitId, topicId, topicName);
      setQuestions(qList);
      setCurrentIdx(0);
      setSelectedOptionId(null);
      setAnswers({});
      setPhase('intro');
      setCertificate(null);
    }
  }, [isOpen, unitId, topicId, topicName]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Simular deliberación
  useEffect(() => {
    if (phase === 'deliberating') {
      const t1 = setTimeout(() => setDeliberationStep(1), 900);
      const t2 = setTimeout(() => setDeliberationStep(2), 1800);
      const t3 = setTimeout(() => {
        // Calcular resultado
        let aciertos = 0;
        questions.forEach((q) => {
          const sel = answers[q.id];
          const opt = q.opciones.find((o) => o.id === sel);
          if (opt?.esCorrecta) aciertos++;
        });

        const cert = evaluateDefense(
          unitId,
          topicId,
          topicName,
          profile.name || 'Estudiante de Minería',
          profile.code || 'EST-2024-MIN',
          profile.presetId ? profile.presetId.toUpperCase() : 'DATA SCIENTIST',
          questions.length,
          aciertos
        );

        setCertificate(cert);
        setPhase('verdict');
        if (onDefenseCompleted) onDefenseCompleted(cert);

        if (cert.veredicto === 'laureada' || cert.veredicto === 'meritoria') {
          confetti({
            particleCount: 110,
            spread: 75,
            origin: { y: 0.55 },
          });
        }
      }, 2700);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [phase, answers, questions, unitId, topicId, topicName, profile, onDefenseCompleted]);

  if (!isOpen) return null;

  const currentQ = questions[currentIdx];
  const currentJuror = currentQ
    ? TRIBUNAL_JURORS.find((j) => j.id === currentQ.jurorId) || TRIBUNAL_JURORS[0]
    : TRIBUNAL_JURORS[0];

  const handleSelectOption = (optId: string) => {
    if (selectedOptionId) return; // Ya respondió
    setSelectedOptionId(optId);
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionId(null);
    } else {
      setPhase('deliberating');
      setDeliberationStep(0);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  // Renderizador seguro KaTeX
  const renderFormula = (latex: string) => {
    try {
      const html = katex.renderToString(latex, { displayMode: true, throwOnError: false });
      return <div dangerouslySetInnerHTML={{ __html: html }} style={{ margin: '0.5rem 0' }} />;
    } catch {
      return <code>{latex}</code>;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.78)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '880px',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          border: '1px solid #334155',
          borderRadius: 'var(--radius-lg, 12px)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
      >
        {/* CABECERA DEL TRIBUNAL */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#0b1329',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'rgba(234, 88, 12, 0.15)',
                border: '1px solid #ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ea580c',
              }}
            >
              <Award size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontWeight: 700 }}>
                Cátedra de Minería de Datos &middot; Sustentación Oral
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Tribunal Examinador: {topicName}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* TRIBUNAL JURORS STRIP */}
        <div
          style={{
            padding: '0.75rem 1.75rem',
            backgroundColor: '#131f37',
            borderBottom: '1px solid #1e293b',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {TRIBUNAL_JURORS.map((juror) => {
            const isSpeaking = phase === 'exam' && currentQ?.jurorId === juror.id;
            return (
              <div
                key={juror.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  backgroundColor: isSpeaking ? 'rgba(234, 88, 12, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${isSpeaking ? '#ea580c' : '#1e293b'}`,
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: juror.avatarColor,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {juror.avatarInitials}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isSpeaking ? '#fdba74' : '#e2e8f0', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {juror.nombre}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {juror.titulo}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CONTENIDO PRINCIPAL POR FASES */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          {/* FASE 1: INTRODUCCIÓN */}
          {phase === 'intro' && (
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '1rem auto' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(2, 132, 199, 0.15)',
                  border: '2px solid #0284c7',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                }}
              >
                <ShieldCheck size={36} />
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Convocatoria a Sustentación Oral Formal
              </h2>

              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Sustentante: <strong style={{ color: '#f8fafc' }}>{profile.name}</strong> (Código: <code>{profile.code}</code>)
                <br />
                Tema a defender: <strong style={{ color: '#38bdf8' }}>{topicName}</strong> ({unitId})
              </p>

              <div
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  color: '#cbd5e1',
                  marginBottom: '1.75rem',
                  border: '1px solid #334155',
                }}
              >
                <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} style={{ color: '#ea580c' }} /> Instrucciones del Tribunal Examinador:
                </div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, lineHeight: 1.6 }}>
                  <li>El jurado formulará <strong>{questions.length} preguntas técnicas y metodológicas</strong> sobre sus scripts en R, dataset y fundamentos.</li>
                  <li>Cada respuesta pondrá a prueba su dominio de las métricas empíricas sin suposiciones infundadas.</li>
                  <li>Al culminar, el tribunal deliberará y emitirá el <strong>Acta Oficial de Calificación</strong> con sello y firmas digitales.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setPhase('exam')}
                className="btn btn-primary"
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                Comenzar Defensa Oral ante el Jurado
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* FASE 2: PREGUNTAS DEL JURADO */}
          {phase === 'exam' && currentQ && (
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
              {/* Barra de progreso */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>Interrogatorio Oficial &middot; Pregunta {currentIdx + 1} de {questions.length}</span>
                <span className="badge badge-purple">
                  {currentJuror.nombre}
                </span>
              </div>

              {/* Tarjeta de la Pregunta y el Jurado */}
              <div
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '10px',
                  border: '1px solid #334155',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#94a3b8', marginBottom: '0.5rem' }}>
                  Contexto: {currentQ.contexto}
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.45, margin: 0 }}>
                  &ldquo;{currentQ.pregunta}&rdquo;
                </h4>

                {currentQ.formulaKatex && (
                  <div style={{ marginTop: '0.75rem', backgroundColor: '#0f172a', padding: '0.75rem', borderRadius: '6px' }}>
                    {renderFormula(currentQ.formulaKatex)}
                  </div>
                )}
              </div>

              {/* Opciones de Respuesta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {currentQ.opciones.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isAnswered = selectedOptionId !== null;

                  let borderCol = '#334155';
                  let bgCol = '#0f172a';
                  if (isAnswered) {
                    if (opt.esCorrecta) {
                      borderCol = '#059669';
                      bgCol = 'rgba(5, 150, 105, 0.15)';
                    } else if (isSelected && !opt.esCorrecta) {
                      borderCol = '#dc2626';
                      bgCol = 'rgba(220, 38, 38, 0.15)';
                    }
                  } else if (isSelected) {
                    borderCol = '#ea580c';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(opt.id)}
                      style={{
                        textAlign: 'left',
                        padding: '1rem 1.25rem',
                        borderRadius: '8px',
                        border: `1.5px solid ${borderCol}`,
                        backgroundColor: bgCol,
                        color: '#f8fafc',
                        cursor: isAnswered ? 'default' : 'pointer',
                        fontSize: '0.88rem',
                        lineHeight: 1.5,
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                      }}
                    >
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: '#1e293b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: '2px',
                          color: opt.esCorrecta && isAnswered ? '#10b981' : isSelected && !opt.esCorrecta ? '#ef4444' : '#94a3b8',
                        }}
                      >
                        {opt.id.toUpperCase()}
                      </span>
                      <span style={{ flex: 1 }}>{opt.texto}</span>
                    </button>
                  );
                })}
              </div>

              {/* Retroalimentación inmediata si ya respondió */}
              {selectedOptionId && (
                <div
                  className="view-transition"
                  style={{
                    backgroundColor: '#111e38',
                    border: '1px solid #1e3a8a',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {currentQ.opciones.find((o) => o.id === selectedOptionId)?.esCorrecta ? (
                      <span style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.88rem' }}>
                        <CheckCircle2 size={18} /> Veredicto del Jurado: Argumentación Conforme
                      </span>
                    ) : (
                      <span style={{ color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.88rem' }}>
                        <AlertCircle size={18} /> Veredicto del Jurado: Observación Metodológica
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.55, margin: 0 }}>
                    {currentQ.opciones.find((o) => o.id === selectedOptionId)?.retroalimentacion}
                  </p>

                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #1e293b', fontSize: '0.78rem', color: '#94a3b8' }}>
                    <strong>Fundamento Teórico:</strong> {currentQ.justificacionFormal}
                    <br />
                    <span style={{ fontStyle: 'italic', color: '#64748b' }}>Ref: {currentQ.referencia}</span>
                  </div>
                </div>
              )}

              {/* Botón Siguiente */}
              {selectedOptionId && (
                <div style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="btn btn-primary"
                    style={{
                      padding: '0.65rem 1.75rem',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    {currentIdx + 1 < questions.length ? 'Siguiente Pregunta del Jurado' : 'Finalizar y Escuchar Deliberación'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FASE 3: DELIBERACIÓN */}
          {phase === 'deliberating' && (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', maxWidth: '500px', margin: '0 auto' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: '3px solid #ea580c',
                  borderTopColor: 'transparent',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1.5rem',
                }}
              />

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                El Tribunal se encuentra en Sesión Secreta
              </h3>

              <div style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
                {deliberationStep === 0 && 'Verificando reproducibilidad y código de salida Exit Code 0 en R...'}
                {deliberationStep === 1 && 'Auditando consistencia entre la partición 80/20 y las respuestas orales...'}
                {deliberationStep >= 2 && 'Consolidando actas de votación de los tres miembros del jurado...'}
              </div>
            </div>
          )}

          {/* FASE 4: VEREDICTO FINAL Y ACTA OFICIAL */}
          {phase === 'verdict' && certificate && (
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
              {/* ACTA OFICIAL DE SUSTENTACIÓN */}
              <div
                className="acta-sheet"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  padding: '2.5rem 2.5rem',
                  borderRadius: '8px',
                  border: '2px solid #cbd5e1',
                  boxShadow: '0 10px 35px rgba(0, 0, 0, 0.4)',
                  fontFamily: '"Times New Roman", Georgia, serif',
                  lineHeight: 1.5,
                  marginBottom: '1.5rem',
                }}
              >
                {/* Encabezado del Acta */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', color: '#475569', textTransform: 'uppercase' }}>
                    Facultad de Ingeniería &middot; Coordinación de Posgrado e Investigación
                  </div>
                  <h2 style={{ fontFamily: 'system-ui, sans-serif', fontSize: '1.35rem', fontWeight: 900, textTransform: 'uppercase', margin: '0.35rem 0' }}>
                    Acta Oficial de Sustentación Oral y Evaluación de Proyecto
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                    {certificate.actaNumero} &middot; Cátedra de Minería de Datos
                  </div>
                </div>

                {/* Datos del Sustentante */}
                <div style={{ fontSize: '0.925rem', marginBottom: '1.25rem' }}>
                  <p style={{ margin: '0 0 0.5rem' }}>
                    En sesión solemne de sustentación del día <strong>{certificate.fecha}</strong>, se reunió el Tribunal Examinador para evaluar la defensa oral del estudiante:
                  </p>
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0.75rem 1rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem' }}>
                    <div><strong>Sustentante:</strong> {certificate.studentName}</div>
                    <div><strong>Código Estudiantil:</strong> {certificate.studentCode} &middot; <strong>Rol:</strong> {certificate.studentRole}</div>
                    <div><strong>Tema de Investigación:</strong> {certificate.topicName} ({certificate.unitId})</div>
                  </div>
                </div>

                {/* Veredicto y Calificación */}
                <div style={{ textAlign: 'center', margin: '1.75rem 0', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Calificación Cuantitativa Asignada
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: certificate.nota >= 4.0 ? '#059669' : '#ea580c', fontFamily: 'system-ui, sans-serif' }}>
                    {certificate.nota.toFixed(1)} <span style={{ fontSize: '1.2rem', color: '#64748b' }}>/ 5.0</span>
                  </div>
                  <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                    Veredicto: {certificate.veredictoTitulo}
                  </div>
                </div>

                {/* Observaciones del Jurado */}
                <div style={{ fontSize: '0.88rem', marginBottom: '2rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.35rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    Concepto Oficial del Tribunal:
                  </div>
                  <p style={{ fontStyle: 'italic', color: '#334155', margin: 0, textIndent: '1em' }}>
                    &ldquo;{certificate.observacionesJurado}&rdquo;
                  </p>
                </div>

                {/* Firmas de los 3 Jurados */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px dashed #cbd5e1' }}>
                  {TRIBUNAL_JURORS.map((j) => (
                    <div key={j.id} style={{ textAlign: 'center', fontSize: '0.72rem', fontFamily: 'system-ui, sans-serif' }}>
                      <div style={{ height: '32px', borderBottom: '1px solid #0f172a', margin: '0 0.5rem 0.35rem' }} />
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{j.nombre}</div>
                      <div style={{ color: '#64748b', fontSize: '0.68rem' }}>{j.titulo}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de Acción */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setPhase('intro');
                    setSelectedOptionId(null);
                    setCurrentIdx(0);
                  }}
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <RefreshCw size={15} /> Presentar Nueva Defensa
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handlePrintCertificate}
                    className="btn btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                  >
                    <Printer size={15} /> Imprimir Acta en PDF
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-primary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                  >
                    <FileCheck2 size={15} /> Guardar en Mi Carnet y Finalizar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
