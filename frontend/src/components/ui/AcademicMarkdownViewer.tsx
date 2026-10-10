import React, { useState, useMemo } from 'react';
import katex from 'katex';
import {
  FileText,
  Code2,
  Copy,
  Check,
  Download,
  BookOpen,
  Clock,
} from 'lucide-react';

export interface AcademicMarkdownViewerProps {
  content: string | null | undefined;
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  maxHeight?: string | number;
  className?: string;
}

/**
 * Renderiza de forma segura una expresión KaTeX a HTML
 */
function renderKatexHtml(math: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(math, {
      displayMode,
      throwOnError: false,
    });
  } catch {
    return math;
  }
}

/**
 * Procesa texto inline reconociendo:
 * - Matemáticas inline: $...$
 * - Código inline: `...`
 * - Negrita: **...**
 * - Cursiva: *...*
 * - Enlaces: [texto](url)
 */
function renderInlineContent(text: string): React.ReactNode[] {
  // Tokenizador simple para elementos inline
  const tokens: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // 1. Math inline: $...$
    const mathMatch = remaining.match(/^\$([^$]+)\$/);
    if (mathMatch) {
      const mathHtml = renderKatexHtml(mathMatch[1], false);
      tokens.push(
        <span
          key={`math-${keyIndex++}`}
          dangerouslySetInnerHTML={{ __html: mathHtml }}
          style={{ padding: '0 0.2rem' }}
        />
      );
      remaining = remaining.slice(mathMatch[0].length);
      continue;
    }

    // 2. Code inline: `...`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      tokens.push(
        <code
          key={`code-${keyIndex++}`}
          style={{
            backgroundColor: 'var(--color-card-muted)',
            border: '1px solid var(--color-border)',
            borderRadius: '4px',
            padding: '0.15rem 0.4rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85em',
            color: 'var(--color-terracotta-dark, #9A3412)',
            wordBreak: 'break-word',
          }}
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // 3. Negrita: **...**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      tokens.push(
        <strong key={`bold-${keyIndex++}`} style={{ fontWeight: 700, color: 'var(--color-ink)' }}>
          {renderInlineContent(boldMatch[1])}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // 4. Cursiva: *...*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      tokens.push(
        <em key={`italic-${keyIndex++}`} style={{ fontStyle: 'italic', color: 'var(--color-ink-secondary)' }}>
          {renderInlineContent(italicMatch[1])}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // 5. Enlaces: [texto](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      tokens.push(
        <a
          key={`link-${keyIndex++}`}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--color-blue-ink)',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
            fontWeight: 500,
          }}
        >
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Carácter o texto plano hasta el siguiente token especial
    const nextSpecialIndex = remaining.search(/[$`*\[]/);
    if (nextSpecialIndex === -1) {
      tokens.push(remaining);
      break;
    } else if (nextSpecialIndex === 0) {
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      tokens.push(remaining.slice(0, nextSpecialIndex));
      remaining = remaining.slice(nextSpecialIndex);
    }
  }

  return tokens;
}

/**
 * Componente para renderizar bloques de código con botón de copiar
 */
const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        margin: '1rem 0',
        borderRadius: 'var(--radius-sm, 6px)',
        border: '1px solid var(--color-border)',
        backgroundColor: '#1E293B',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.4rem 0.85rem',
          backgroundColor: '#0F172A',
          borderBottom: '1px solid #334155',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: '#94A3B8',
        }}
      >
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {language || 'texto'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'none',
            border: 'none',
            color: copied ? '#4ADE80' : '#CBD5E1',
            fontSize: '11px',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
          title="Copiar código"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? 'Copiado' : 'Copiar'}</span>
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '1rem',
          overflowX: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          lineHeight: 1.55,
          color: '#E2E8F0',
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};

/**
 * Parser de bloques Markdown de alta fidelidad para estilo Atlas Académico
 */
function parseMarkdownBlocks(markdown: string): React.ReactNode[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let blockKey = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 1. Líneas vacías
    if (!line.trim()) {
      i++;
      continue;
    }

    // 2. Fórmulas matemáticas en bloque: $$ ... $$
    if (line.trim().startsWith('$$')) {
      let mathContent = line.trim().slice(2);
      if (mathContent.endsWith('$$') && mathContent.length > 2) {
        mathContent = mathContent.slice(0, -2);
        i++;
      } else {
        i++;
        while (i < lines.length && !lines[i].trim().endsWith('$$')) {
          mathContent += '\n' + lines[i];
          i++;
        }
        if (i < lines.length) {
          mathContent += '\n' + lines[i].trim().replace(/\$\$$/, '');
          i++;
        }
      }
      const mathHtml = renderKatexHtml(mathContent.trim(), true);
      blocks.push(
        <div
          key={`katex-block-${blockKey++}`}
          style={{
            margin: '1.25rem 0',
            padding: '1.25rem',
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm, 6px)',
            overflowX: 'auto',
            textAlign: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
          dangerouslySetInnerHTML={{ __html: mathHtml }}
        />
      );
      continue;
    }

    // 3. Bloques de código ```lang ... ```
    if (line.trim().startsWith('```')) {
      const language = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++;
      }
      blocks.push(
        <CodeBlock
          key={`code-block-${blockKey++}`}
          code={codeLines.join('\n')}
          language={language}
        />
      );
      continue;
    }

    // 4. Divisor horizontal: --- o ***
    if (/^(\s*[-*_]\s*){3,}$/.test(line)) {
      blocks.push(
        <hr
          key={`hr-${blockKey++}`}
          style={{
            margin: '1.75rem 0',
            border: 'none',
            borderTop: '1px solid var(--color-border)',
            opacity: 0.8,
          }}
        />
      );
      i++;
      continue;
    }

    // 5. Encabezados H1, H2, H3
    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match) {
      blocks.push(
        <div
          key={`h1-${blockKey++}`}
          style={{
            margin: '1.75rem 0 0.85rem',
            paddingBottom: '0.65rem',
            borderBottom: '2px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-terracotta)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.35rem',
            }}
          >
            <BookOpen size={13} />
            <span>Documento Temático</span>
          </div>
          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-ink)',
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {renderInlineContent(h1Match[1])}
          </h1>
        </div>
      );
      i++;
      continue;
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      blocks.push(
        <div
          key={`h2-${blockKey++}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '1.5rem 0 0.65rem',
            paddingTop: '0.5rem',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '18px',
              backgroundColor: 'var(--color-terracotta)',
              borderRadius: '2px',
              flexShrink: 0,
            }}
          />
          <h2
            style={{
              fontSize: '1.15rem',
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              color: 'var(--color-ink)',
              margin: 0,
            }}
          >
            {renderInlineContent(h2Match[1])}
          </h2>
        </div>
      );
      i++;
      continue;
    }

    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      blocks.push(
        <h3
          key={`h3-${blockKey++}`}
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--color-blue-ink)',
            margin: '1.25rem 0 0.5rem',
          }}
        >
          {renderInlineContent(h3Match[1])}
        </h3>
      );
      i++;
      continue;
    }

    // 6. Citas / Blockquotes (> texto)
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push(
        <blockquote
          key={`quote-${blockKey++}`}
          style={{
            margin: '1rem 0',
            padding: '0.85rem 1.15rem',
            backgroundColor: 'var(--color-card-muted)',
            borderLeft: '4px solid var(--color-blue-ink)',
            borderRadius: '0 var(--radius-sm, 6px) var(--radius-sm, 6px) 0',
            color: 'var(--color-ink-secondary)',
            fontSize: 'var(--text-sm)',
            fontStyle: 'italic',
            lineHeight: 1.6,
          }}
        >
          {quoteLines.map((q, qIdx) => (
            <p key={`quote-line-${qIdx}`} style={{ margin: qIdx > 0 ? '0.4rem 0 0' : 0 }}>
              {renderInlineContent(q)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // 7. Listas no ordenadas (- o *)
    if (/^\s*[-*]\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      blocks.push(
        <ul
          key={`ul-${blockKey++}`}
          style={{
            margin: '0.75rem 0',
            paddingLeft: '0',
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
          }}
        >
          {listItems.map((item, itemIdx) => (
            <li
              key={`li-${itemIdx}`}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.6rem',
                fontSize: 'var(--text-sm)',
                lineHeight: 1.55,
                color: 'var(--color-ink)',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-terracotta)',
                  flexShrink: 0,
                  transform: 'translateY(-2px)',
                }}
              />
              <div style={{ flex: 1 }}>{renderInlineContent(item)}</div>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 8. Listas ordenadas (1. 2. 3.)
    if (/^\s*\d+\.\s+/.test(line)) {
      const listItems: { num: string; text: string }[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        const match = lines[i].match(/^\s*(\d+)\.\s+(.+)$/);
        if (match) {
          listItems.push({ num: match[1], text: match[2] });
        }
        i++;
      }
      blocks.push(
        <ol
          key={`ol-${blockKey++}`}
          style={{
            margin: '0.75rem 0',
            paddingLeft: '0',
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {listItems.map((item, itemIdx) => (
            <li
              key={`oli-${itemIdx}`}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.65rem',
                fontSize: 'var(--text-sm)',
                lineHeight: 1.55,
                color: 'var(--color-ink)',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-blue-soft)',
                  border: '1px solid var(--color-blue-border)',
                  color: 'var(--color-blue-ink)',
                  fontSize: '10px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {item.num}
              </span>
              <div style={{ flex: 1 }}>{renderInlineContent(item.text)}</div>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 9. Párrafo común
    const pLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('$$') &&
      !lines[i].trim().startsWith('>') &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^(\s*[-*_]\s*){3,}$/.test(lines[i])
    ) {
      pLines.push(lines[i]);
      i++;
    }

    blocks.push(
      <p
        key={`p-${blockKey++}`}
        style={{
          margin: '0.6rem 0',
          fontSize: 'var(--text-sm)',
          lineHeight: 1.65,
          color: 'var(--color-ink-secondary)',
        }}
      >
        {renderInlineContent(pLines.join(' '))}
      </p>
    );
  }

  return blocks;
}

/**
 * Componente principal de visualización de Markdown con estética de Atlas Académico
 */
export const AcademicMarkdownViewer: React.FC<AcademicMarkdownViewerProps> = ({
  content,
  title = 'Documentación Técnica (README)',
  subtitle,
  emptyMessage = 'Sin documentación README.md registrada para este tema.',
  maxHeight,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'editorial' | 'raw'>('editorial');
  const [copied, setCopied] = useState(false);

  // Estadísticas del documento
  const stats = useMemo(() => {
    if (!content) return { words: 0, readTimeMinutes: 1, sections: 0 };
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 180));
    const sections = (content.match(/^#{1,3}\s/gm) || []).length;
    return { words, readTimeMinutes, sections };
  }, [content]);

  const handleCopyAll = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!content || !content.trim()) {
    return (
      <div
        className={className}
        style={{
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          backgroundColor: 'var(--color-card)',
          border: '1px dashed var(--color-border)',
          borderRadius: 'var(--radius-md, 8px)',
          color: 'var(--color-ink-muted)',
        }}
      >
        <FileText size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 500 }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-md, 8px)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-card)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        overflow: 'hidden',
      }}
    >
      {/* Barra de cabecera académica */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          backgroundColor: 'var(--color-card-muted)',
          borderBottom: '1px solid var(--color-border)',
          gap: '0.75rem',
        }}
      >
        {/* Título y metadatos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-paper)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-terracotta)',
              flexShrink: 0,
            }}
          >
            <FileText size={16} />
          </div>
          <div>
            <div
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                color: 'var(--color-ink)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>{title}</span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  backgroundColor: 'var(--color-blue-soft)',
                  color: 'var(--color-blue-ink)',
                  border: '1px solid var(--color-blue-border)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}
              >
                Markdown v1.0
              </span>
            </div>
            {subtitle && (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-muted)' }}>
                {subtitle}
              </div>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                fontSize: '11px',
                color: 'var(--color-ink-muted)',
                marginTop: '2px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={11} />
                <span>{stats.readTimeMinutes} min de lectura</span>
              </span>
              <span>•</span>
              <span>{stats.words} palabras</span>
              {stats.sections > 0 && (
                <>
                  <span>•</span>
                  <span>{stats.sections} secciones</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Acciones y selector de modo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Selector Editorial vs Fuente */}
          <div
            style={{
              display: 'inline-flex',
              padding: '2px',
              backgroundColor: 'var(--color-paper)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('editorial')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: viewMode === 'editorial' ? 'var(--color-card)' : 'transparent',
                color: viewMode === 'editorial' ? 'var(--color-ink)' : 'var(--color-ink-secondary)',
                boxShadow: viewMode === 'editorial' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <BookOpen size={12} />
              <span>Editorial</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: viewMode === 'raw' ? 'var(--color-card)' : 'transparent',
                color: viewMode === 'raw' ? 'var(--color-ink)' : 'var(--color-ink-secondary)',
                boxShadow: viewMode === 'raw' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <Code2 size={12} />
              <span>Código (.md)</span>
            </button>
          </div>

          {/* Botón Copiar */}
          <button
            type="button"
            onClick={handleCopyAll}
            title="Copiar contenido Markdown"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              color: copied ? 'var(--color-success-ink)' : 'var(--color-ink-secondary)',
              cursor: 'pointer',
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>

          {/* Botón Descargar */}
          <button
            type="button"
            onClick={handleDownload}
            title="Descargar archivo README.md"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px',
              fontSize: '11px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              color: 'var(--color-ink-secondary)',
              cursor: 'pointer',
            }}
          >
            <Download size={13} />
          </button>
        </div>
      </div>

      {/* Contenedor de Contenido */}
      <div
        style={{
          padding: '1.75rem',
          maxHeight: maxHeight || 'none',
          overflowY: maxHeight ? 'auto' : 'visible',
          backgroundColor: 'var(--color-card)',
        }}
      >
        {viewMode === 'editorial' ? (
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            {parseMarkdownBlocks(content)}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#0F172A',
              borderRadius: '6px',
              padding: '1.25rem',
              overflowX: 'auto',
            }}
          >
            <pre
              style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '12.5px',
                lineHeight: 1.6,
                color: '#E2E8F0',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
