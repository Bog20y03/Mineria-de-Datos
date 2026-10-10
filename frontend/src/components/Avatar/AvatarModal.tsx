import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Camera,
  Layers,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { getDefenseCertificates, type DefenseCertificate } from '../../services/defenseService';
import {
  getUserProfileConfig,
  saveUserProfileConfig,
  compressImageFileToDataUrl,
  AVATAR_PRESETS,
  ACCENT_PALETTE,
  type UserProfileConfig,
  type AvatarType,
} from '../../services/avatarService';
import { UserAvatar } from './UserAvatar';

export interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose }) => {
  const [form, setForm] = useState<UserProfileConfig>(getUserProfileConfig);
  const [activeTab, setActiveTab] = useState<AvatarType>('preset');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [certificates, setCertificates] = useState<DefenseCertificate[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const current = getUserProfileConfig();
      setForm(current);
      setActiveTab(current.avatarType);
      setSaveSuccess(false);
      setCertificates(getDefenseCertificates());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsUploading(true);
      const dataUrl = await compressImageFileToDataUrl(file, 256, 0.88);
      setForm((prev) => ({
        ...prev,
        avatarType: 'custom',
        customUrl: dataUrl,
      }));
      setActiveTab('custom');
    } catch (err) {
      console.error('Error al procesar la imagen:', err);
      alert('No se pudo procesar la imagen seleccionada.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setForm((prev) => ({
      ...prev,
      customUrl: null,
      avatarType: 'preset',
    }));
    setActiveTab('preset');
  };

  const handleSave = () => {
    const updated = saveUserProfileConfig({
      ...form,
      avatarType: activeTab,
    });
    setForm(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    const defaultProfile: UserProfileConfig = {
      name: 'Alex Mendoza',
      code: 'UDEC-2026-DM',
      role: 'estudiante',
      avatarType: 'preset',
      presetId: 'cientifico',
      customUrl: null,
      accentColor: '#0284c7',
    };
    setForm(defaultProfile);
    setActiveTab('preset');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(9, 13, 22, 0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '880px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-lg, 16px)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          backgroundColor: 'var(--color-card, #131B2E)',
          boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.75)',
          overflow: 'hidden',
          color: 'var(--color-ink, #F8FAFC)',
        }}
      >
        {/* Encabezado del Modal */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--color-border, rgba(255,255,255,0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(2, 132, 199, 0.12), transparent)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: `${form.accentColor}25`,
                border: `1.5px solid ${form.accentColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: form.accentColor,
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  margin: 0,
                  letterSpacing: '-0.01em',
                  color: 'var(--color-ink, #FFFFFF)',
                }}
              >
                Carnet de Identidad Académica & Avatar
              </h2>
              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--color-ink-muted, #94A3B8)',
                  margin: 0,
                  marginTop: '2px',
                }}
              >
                Personaliza tu credencial de investigador, avatar vectorial o fotografía oficial
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Cerrar ventana"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-ink-muted, #94A3B8)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del Modal con Scroll */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'minmax(270px, 320px) 1fr',
            gap: '1.75rem',
          }}
        >
          {/* COLUMNA IZQUIERDA: Carnet Digital en Vivo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-ink-muted, #94A3B8)',
              }}
            >
              Credencial en Vivo (Carnet)
            </div>

            {/* Tarjeta Visual de Carnet */}
            <div
              style={{
                borderRadius: '14px',
                border: `2px solid ${form.accentColor}`,
                background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: `0 12px 30px -8px ${form.accentColor}44`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Tira superior institucional */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  backgroundColor: form.accentColor,
                }}
              />

              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: form.accentColor,
                  marginBottom: '1rem',
                }}
              >
                Universidad de Cundinamarca • Minería
              </div>

              {/* Avatar renderizado con tamaño XL */}
              <div style={{ marginBottom: '1rem' }}>
                <UserAvatar
                  size="xl"
                  config={{ ...form, avatarType: activeTab }}
                  showStatusDot
                  showBorder
                  borderWidth={3}
                />
              </div>

              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  marginBottom: '2px',
                  letterSpacing: '-0.01em',
                }}
              >
                {form.name || 'Nombre del Investigador'}
              </div>

              <div
                style={{
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  color: '#94A3B8',
                  marginBottom: '0.75rem',
                  letterSpacing: '0.04em',
                }}
              >
                {form.code || 'UDEC-2026-DM'}
              </div>

              {/* Badge de Rol */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  backgroundColor: `${form.accentColor}25`,
                  color: form.accentColor,
                  border: `1px solid ${form.accentColor}55`,
                  padding: '3px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <CheckCircle2 size={12} />
                <span>{form.role.toUpperCase()}</span>
              </div>

              <div
                style={{
                  marginTop: '1.25rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px dashed rgba(255, 255, 255, 0.12)',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.68rem',
                  color: '#94A3B8',
                }}
              >
                <span>Acreditación Oficial</span>
                <span style={{ color: '#10B981', fontWeight: 700 }}>● Verificado</span>
              </div>
            </div>

            {/* Selector de Color de Acento */}
            <div style={{ marginTop: '0.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-ink-muted, #94A3B8)',
                  marginBottom: '0.5rem',
                }}
              >
                Color de Acento del Carnet
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {ACCENT_PALETTE.map((pal) => {
                  const isSelected = form.accentColor === pal.hex;
                  return (
                    <button
                      key={pal.hex}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, accentColor: pal.hex }))}
                      title={pal.name}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: pal.hex,
                        border: isSelected ? '2.5px solid #FFFFFF' : '2px solid transparent',
                        boxShadow: isSelected ? `0 0 10px ${pal.hex}` : 'none',
                        cursor: 'pointer',
                        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.15s ease',
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Actas y Veredictos de Sustentación Oral */}
            <div
              style={{
                marginTop: '1rem',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '0.85rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#94a3b8',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Award size={13} style={{ color: '#ea580c' }} /> Veredictos del Jurado Calificador
              </div>

              {certificates.length === 0 ? (
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic', lineHeight: 1.4 }}>
                  Sin sustentaciones orales registradas aún. Ingresa a cualquier tema y presiona &ldquo;Defensa de Jurado&rdquo; para sustentar.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '140px', overflowY: 'auto' }}>
                  {certificates.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '6px',
                        padding: '0.4rem 0.6rem',
                        fontSize: '0.72rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 700, color: '#f1f5f9', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {c.topicName}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{c.actaNumero}</div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          backgroundColor: c.nota >= 4.5 ? 'rgba(5, 150, 105, 0.2)' : 'rgba(234, 88, 12, 0.2)',
                          color: c.nota >= 4.5 ? '#34d399' : '#fb923c',
                          flexShrink: 0,
                        }}
                      >
                        {c.nota.toFixed(1)} / 5.0
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: Configuración del Avatar y Datos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Tabs de Selección del Tipo de Avatar */}
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-ink-muted, #94A3B8)',
                  marginBottom: '0.6rem',
                }}
              >
                Modalidad del Avatar
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px',
                  backgroundColor: 'rgba(15, 23, 42, 0.65)',
                  padding: '4px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('preset')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: activeTab === 'preset' ? 'var(--color-blue-ink, #0284C7)' : 'transparent',
                    color: activeTab === 'preset' ? '#FFFFFF' : '#94A3B8',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Layers size={15} />
                  <span>Especialidad</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('initials')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: activeTab === 'initials' ? 'var(--color-blue-ink, #0284C7)' : 'transparent',
                    color: activeTab === 'initials' ? '#FFFFFF' : '#94A3B8',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Sparkles size={15} />
                  <span>Iniciales</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('custom')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: activeTab === 'custom' ? 'var(--color-blue-ink, #0284C7)' : 'transparent',
                    color: activeTab === 'custom' ? '#FFFFFF' : '#94A3B8',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Camera size={15} />
                  <span>Mi Foto</span>
                </button>
              </div>
            </div>

            {/* CONTENIDO DEL TAB SELECCIONADO */}
            {activeTab === 'preset' && (
              <div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--color-ink-muted, #94A3B8)',
                    marginBottom: '0.75rem',
                  }}
                >
                  Selecciona una de las 6 ilustraciones vectoriales académicas:
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {AVATAR_PRESETS.map((p) => {
                    const isSelected = form.presetId === p.id && activeTab === 'preset';
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            presetId: p.id,
                            accentColor: p.themeColor,
                          }));
                        }}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          border: isSelected
                            ? `2px solid ${p.themeColor}`
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: isSelected
                            ? `${p.themeColor}18`
                            : 'rgba(255, 255, 255, 0.03)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <UserAvatar
                          size="md"
                          config={{
                            ...form,
                            avatarType: 'preset',
                            presetId: p.id,
                            accentColor: p.themeColor,
                          }}
                          showBorder={false}
                        />
                        <div
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: isSelected ? '#FFFFFF' : 'var(--color-ink, #CBD5E1)',
                            lineHeight: 1.2,
                          }}
                        >
                          {p.title}
                        </div>
                        <div
                          style={{
                            fontSize: '0.65rem',
                            color: 'var(--color-ink-muted, #94A3B8)',
                            lineHeight: 1.2,
                          }}
                        >
                          {p.subtitle}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'initials' && (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <UserAvatar
                  size="lg"
                  config={{ ...form, avatarType: 'initials' }}
                  showBorder
                  borderWidth={2}
                />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Identicon Dinámico Basado en Iniciales
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                    Toma automáticamente las iniciales de tu nombre y proyecta un halo radial con tu color de acento institucional.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'custom' && (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <UserAvatar
                    size="lg"
                    config={{ ...form, avatarType: 'custom' }}
                    showBorder
                    borderWidth={2}
                  />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
                      Fotografía Oficial del Investigador
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                      Sube una fotografía de perfil (JPG, PNG o WebP). Se ajusta automáticamente con proporción circular.
                    </div>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    style={{
                      flex: 1,
                      padding: '0.6rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-blue-ink, #0284C7)',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Upload size={16} />
                    <span>{isUploading ? 'Procesando imagen...' : 'Seleccionar Archivo...'}</span>
                  </button>

                  {form.customUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      title="Quitar foto y usar preset"
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#F87171',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Trash2 size={16} />
                      <span>Quitar</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* CAMPOS DE FORMULARIO: Nombre, Código y Rol */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginTop: '0.25rem',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-ink-muted, #94A3B8)',
                    marginBottom: '4px',
                  }}
                >
                  Nombre del Investigador
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: Alex Mendoza"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-ink-muted, #94A3B8)',
                    marginBottom: '4px',
                  }}
                >
                  Código de Carnet
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="Ej: UDEC-2026-DM"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-ink-muted, #94A3B8)',
                    marginBottom: '4px',
                  }}
                >
                  Rol Académico Oficial
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {(['estudiante', 'docente', 'administrador'] as const).map((r) => {
                    const isSelected = form.role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, role: r }))}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: isSelected
                            ? `1.5px solid ${form.accentColor}`
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: isSelected
                            ? `${form.accentColor}25`
                            : 'rgba(255, 255, 255, 0.03)',
                          color: isSelected ? '#FFFFFF' : '#94A3B8',
                          fontSize: '0.78rem',
                          fontWeight: isSelected ? 800 : 500,
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Acciones Inferior */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid var(--color-border, rgba(255,255,255,0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
          }}
        >
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: 'transparent',
              color: '#94A3B8',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RotateCcw size={14} />
            <span>Restablecer por Defecto</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: 'transparent',
                color: '#CBD5E1',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              style={{
                padding: '0.55rem 1.4rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: saveSuccess ? '#10B981' : form.accentColor,
                color: '#FFFFFF',
                fontSize: '0.8125rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: `0 4px 14px ${form.accentColor}55`,
                transition: 'all 0.2s ease',
              }}
            >
              <Check size={16} />
              <span>{saveSuccess ? '¡Carnet Guardado!' : 'Guardar Carnet y Avatar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
