import React from 'react';
import { Card } from '../ui';
import {
  ExternalLink,
  Library,
  GraduationCap,
  Globe,
  Search,
  BookMarked,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export interface TopicBibliographyProps {
  topicName: string;
  topicId: string;
  unitName: string;
  unitId: string;
}

interface CanonicalBook {
  title: string;
  authors: string;
  edition: string;
  publisher: string;
  year: number;
  description: string;
  badge: string;
  scholarQuery: string;
  doiOrIsbn?: string;
}

const CANONICAL_BOOKS: CanonicalBook[] = [
  {
    title: 'Data Mining: Concepts and Techniques',
    authors: 'Jiawei Han, Micheline Kamber, Jian Pei',
    edition: '3rd Edition',
    publisher: 'Morgan Kaufmann / Elsevier',
    year: 2011,
    description: 'Tratado seminal indispensable que cubre desde preprocesamiento y almacenes OLAP hasta minería de patrones frecuentes, agrupamiento y modelos avanzados.',
    badge: 'Libro Guía Principal',
    scholarQuery: 'Data Mining Concepts and Techniques Han Kamber Pei',
    doiOrIsbn: 'ISBN: 978-0123814791',
  },
  {
    title: 'Introduction to Data Mining',
    authors: 'Pang-Ning Tan, Michael Steinbach, Anuj Karpatne, Vipin Kumar',
    edition: '2nd Edition',
    publisher: 'Pearson',
    year: 2018,
    description: 'Referencia fundamental para la comprensión de algoritmos de clasificación (árboles de decisión, reglas), análisis de conglomerados y detección de anomalías.',
    badge: 'Referencia Teórica',
    scholarQuery: 'Introduction to Data Mining Tan Steinbach Kumar',
    doiOrIsbn: 'ISBN: 978-0133128901',
  },
  {
    title: 'The Elements of Statistical Learning: Data Mining, Inference, and Prediction',
    authors: 'Trevor Hastie, Robert Tibshirani, Jerome Friedman',
    edition: '2nd Edition',
    publisher: 'Springer Series in Statistics',
    year: 2009,
    description: 'Obra maestra sobre los fundamentos matemáticos y probabilísticos del aprendizaje computacional, modelos aditivos, árboles CART y redes neuronales.',
    badge: 'Rigor Matemático',
    scholarQuery: 'The Elements of Statistical Learning Hastie Tibshirani Friedman',
    doiOrIsbn: 'DOI: 10.1007/978-0-387-84858-7',
  },
  {
    title: 'Data Mining: Practical Machine Learning Tools and Techniques',
    authors: 'Ian H. Witten, Eibe Frank, Mark A. Hall, Christopher J. Pal',
    edition: '4th Edition',
    publisher: 'Morgan Kaufmann',
    year: 2016,
    description: 'Manual clásico con enfoque en implementación empírica, evaluación cruzada, métricas de desempeño y metodologías de experimentación.',
    badge: 'Enfoque Práctico',
    scholarQuery: 'Data Mining Practical Machine Learning Tools Witten Frank Hall',
    doiOrIsbn: 'ISBN: 978-0128042915',
  },
  {
    title: 'Mining of Massive Datasets',
    authors: 'Jure Leskovec, Anand Rajaraman, Jeffrey D. Ullman',
    edition: '3rd Edition',
    publisher: 'Cambridge University Press / Stanford',
    year: 2020,
    description: 'Enfocado en minería sobre flujos de datos a gran escala, MapReduce, minería de grafos, análisis de redes sociales y sistemas de recomendación.',
    badge: 'Big Data & Streams',
    scholarQuery: 'Mining of Massive Datasets Leskovec Rajaraman Ullman',
    doiOrIsbn: 'ISBN: 978-1108476348',
  },
];

interface ScientificRepository {
  name: string;
  organization: string;
  description: string;
  tag: string;
  searchUrl: (topic: string) => string;
}

const SCIENTIFIC_REPOSITORIES: ScientificRepository[] = [
  {
    name: 'Google Scholar',
    organization: 'Google Inc.',
    description: 'Buscador académico global que indexa tesis, preprints, artículos arbitrados y patentes científicas con métricas de citación.',
    tag: 'Acceso Abierto & Métricas',
    searchUrl: (topic) => `https://scholar.google.com/scholar?q=${encodeURIComponent(topic + ' "data mining"')}`,
  },
  {
    name: 'IEEE Xplore Digital Library',
    organization: 'Institute of Electrical and Electronics Engineers',
    description: 'Repositorio líder en ingeniería y ciencias de la computación con revistas como IEEE Transactions on Knowledge and Data Engineering (TKDE).',
    tag: 'Revistas de Alto Impacto',
    searchUrl: (topic) => `https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=${encodeURIComponent(topic)}`,
  },
  {
    name: 'ACM Digital Library',
    organization: 'Association for Computing Machinery',
    description: 'Sede de las conferencias insignia SIGKDD, WSDM y la revista ACM Transactions on Knowledge Discovery from Data (TKDD).',
    tag: 'Conferencias Seminales',
    searchUrl: (topic) => `https://dl.acm.org/action/doSearch?AllField=${encodeURIComponent(topic)}`,
  },
  {
    name: 'ScienceDirect',
    organization: 'Elsevier',
    description: 'Colección de revistas indexadas como Data & Knowledge Engineering, Information Systems y Expert Systems with Applications.',
    tag: 'Indexación Q1 / Scopus',
    searchUrl: (topic) => `https://www.sciencedirect.com/search?qs=${encodeURIComponent(topic + ' data mining')}`,
  },
  {
    name: 'arXiv (Computer Science)',
    organization: 'Cornell University',
    description: 'Servidor de preprints de acceso abierto en aprendizaje automático (cs.LG), inteligencia artificial (cs.AI) y minería.',
    tag: 'Últimas Tendencias',
    searchUrl: (topic) => `https://arxiv.org/search/?query=${encodeURIComponent(topic)}&searchtype=all&source=header`,
  },
  {
    name: 'SpringerLink',
    organization: 'Springer Nature',
    description: 'Editorial de la revista canónica Knowledge and Information Systems (KAIS) y las actas de conferencias PAKDD y ECML-PKDD.',
    tag: 'Publicaciones Canónicas',
    searchUrl: (topic) => `https://link.springer.com/search?query=${encodeURIComponent(topic + ' data mining')}`,
  },
];

export const TopicBibliography: React.FC<TopicBibliographyProps> = ({
  topicName,
  topicId,
  unitName,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Banner Contextual de Literatura para el Tema */}
      <div
        style={{
          backgroundColor: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderLeft: '4px solid var(--color-blue-ink)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-atlas-xs)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
            <Library size={18} style={{ color: 'var(--color-blue-ink)' }} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Vigilancia Tecnológica y Literatura Científica
            </span>
          </div>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0, color: 'var(--color-ink)' }}>
            Fuentes de Consulta para: <span style={{ color: 'var(--color-blue-ink)' }}>{topicName}</span>
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', margin: '0.25rem 0 0' }}>
            {unitName} • ID de Trazabilidad: <code>{topicId}</code>
          </p>
        </div>

        {/* Acceso Rápido a Búsqueda Externa en 1 Clic */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a
            href={`https://scholar.google.com/scholar?q=${encodeURIComponent(topicName + ' "data mining"')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-blue-soft)',
              color: 'var(--color-blue-ink)',
              border: '1px solid var(--color-blue-border)',
              fontSize: '11.5px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <Search size={13} /> Buscar en Google Scholar <ExternalLink size={11} />
          </a>

          <a
            href={`https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=${encodeURIComponent(topicName)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-card-muted)',
              color: 'var(--color-ink)',
              border: '1px solid var(--color-border)',
              fontSize: '11.5px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Globe size={13} /> IEEE Xplore <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* 2. Tratados y Libros de Texto Canónicos */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <BookMarked size={16} style={{ color: 'var(--color-terracotta)' }} />
              Libros de Texto y Tratados Canónicos de Minería de Datos
            </h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', margin: '0.15rem 0 0' }}>
              Bibliografía básica recomendada por los comités académicos de ciencias computacionales y la ACM/IEEE.
            </p>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>
            {CANONICAL_BOOKS.length} libros de referencia
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
          {CANONICAL_BOOKS.map((book, idx) => (
            <Card key={idx} padding="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                  <span
                    style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: idx === 0 ? 'var(--color-blue-soft)' : 'var(--color-card-muted)',
                      color: idx === 0 ? 'var(--color-blue-ink)' : 'var(--color-ink-secondary)',
                      border: `1px solid ${idx === 0 ? 'var(--color-blue-border)' : 'var(--color-border-light)'}`,
                      fontSize: '10.5px',
                      fontWeight: 700,
                    }}
                  >
                    {book.badge}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}>
                    {book.year}
                  </span>
                </div>

                <h5 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: '0 0 0.25rem', color: 'var(--color-ink)', lineHeight: 1.35 }}>
                  {book.title}
                </h5>

                <div style={{ fontSize: '11.5px', color: 'var(--color-ink-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>
                  {book.authors}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginBottom: '0.65rem' }}>
                  {book.publisher} • {book.edition}
                </div>

                <p style={{ fontSize: '11.5px', color: 'var(--color-ink)', lineHeight: 1.45, margin: 0, backgroundColor: 'var(--color-card-muted)', padding: '0.5rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-light)' }}>
                  {book.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.85rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.5rem' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}>
                  {book.doiOrIsbn}
                </span>

                <a
                  href={`https://scholar.google.com/scholar?q=${encodeURIComponent(book.scholarQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: 'var(--color-terracotta)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Ver en Scholar <ExternalLink size={11} />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Repositorios y Bibliotecas Científicas Especializadas */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div>
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <GraduationCap size={16} style={{ color: 'var(--color-blue-ink)' }} />
            Bases de Datos Científicas y Repositorios Académicos Oficiales
          </h4>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-secondary)', margin: '0.15rem 0 0' }}>
            Plataformas para buscar artículos de investigación, revisiones sistemáticas y actas de congresos con revisión por pares.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
          {SCIENTIFIC_REPOSITORIES.map((repo, idx) => (
            <Card key={idx} padding="sm" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-blue-ink)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {repo.tag}
                  </span>
                </div>
                <h5 style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 0.15rem' }}>
                  {repo.name}
                </h5>
                <div style={{ fontSize: '10.5px', color: 'var(--color-ink-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  {repo.organization}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', lineHeight: 1.4, margin: 0 }}>
                  {repo.description}
                </p>
              </div>

              <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '0.4rem' }}>
                <a
                  href={repo.searchUrl(topicName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    color: 'var(--color-blue-ink)',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Buscar "{topicName.slice(0, 18)}..." <ExternalLink size={10} />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Criterios de Rigor Metodológico para Búsqueda Bibliográfica */}
      <div
        style={{
          backgroundColor: 'var(--color-card-muted)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} style={{ color: 'var(--color-blue-ink)' }} />
          <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, color: 'var(--color-ink)' }}>
            Protocolo de Rigor en la Búsqueda Científica (Metodología del Curso)
          </h4>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', fontSize: '11.5px', color: 'var(--color-ink-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
            <CheckCircle2 size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--color-ink)' }}>Formulación Booleana Estricta:</strong> Utilizar operadores <code>AND</code> para intersección de conceptos, <code>OR</code> para sinónimos y comillas dobles <code>""</code> para términos compuestos.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
            <CheckCircle2 size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--color-ink)' }}>Cero Datos Inventados:</strong> Todo artículo debe incluir DOI oficial verificable, autoría comprobada e indexación en bases de datos con revisión por pares.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
            <CheckCircle2 size={14} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: 'var(--color-ink)' }}>Trazabilidad Completa:</strong> Las fuentes consultadas deben alimentar directamente los experimentos del script en R y el capítulo formal en LaTeX del tema.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
