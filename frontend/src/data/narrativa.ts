/**
 * Capa narrativa académica del proyecto "La Máquina de Minería".
 * Define las zonas, estaciones de producción del conocimiento,
 * encargos por unidad basados en sus preguntas problema (AGENTS.md §2 y §7)
 * y la progresión de rangos de investigación.
 */

export interface StationNarrative {
  id: 'terminal' | 'biblioteca' | 'laboratorio' | 'escritorio' | 'pizarra';
  nombre: string;
  subtitulo: string;
  objetoEntrada: string;
  queOcurre: string;
  objetoSalida: string;
  icono: string;
  descripcion: string;
}

export interface UnitEncargo {
  numero: 1 | 2 | 3 | 4;
  titulo: string;
  subtitulo: string;
  preguntaProblema: string;
  encargoNarrativo: string;
  zonaNombre: string;
  entregableClave: string;
  rangoAlCompletar: string;
}

export interface RangoInvestigador {
  unidadesRequeridas: number;
  rango: string;
  tituloHonorifico: string;
  descripcion: string;
}

export const ESTACIONES_MAQUINA: StationNarrative[] = [
  {
    id: 'terminal',
    nombre: 'Terminal de Consulta',
    subtitulo: 'Estación 1: Formulación Booleana',
    objetoEntrada: 'Consulta booleana (de las 100 registradas)',
    queOcurre: 'Muestra historial y estado de búsqueda en Google Scholar y bases bibliográficas.',
    objetoSalida: 'Resultados de búsqueda indexados',
    icono: 'Terminal',
    descripcion: 'Punto de partida de la investigación. Se cargan ecuaciones booleanas con operadores AND, OR y comodines estructurados.',
  },
  {
    id: 'biblioteca',
    nombre: 'Biblioteca y Matriz',
    subtitulo: 'Estación 2: Selección Documental',
    objetoEntrada: 'Resultados de búsqueda',
    queOcurre: 'Inspecciona los documentos encontrados, efectúa la selección y consolida la matriz bibliográfica.',
    objetoSalida: 'Documentos seleccionados con DOI y metadatos',
    icono: 'BookOpen',
    descripcion: 'Filtrado crítico y validación de fuentes primarias (artículos científicos, revisiones sistemáticas y actas de conferencia).',
  },
  {
    id: 'laboratorio',
    nombre: 'Laboratorio de R',
    subtitulo: 'Estación 3: Experimentación y Modelado',
    objetoEntrada: 'Dataset + Script reproducible en R',
    queOcurre: 'Ejecuta el script R real del tema mediante el entorno Rscript del servidor.',
    objetoSalida: 'Gráficas (.png), tablas y métricas reales',
    icono: 'FlaskConical',
    descripcion: 'Centro computacional donde los algoritmos matemáticos procesan datos empíricos para generar evidencia cuantitativa.',
  },
  {
    id: 'escritorio',
    nombre: 'Escritorio Editorial',
    subtitulo: 'Estación 4: Redacción Científica',
    objetoEntrada: 'Gráficas, métricas y bibliografía',
    queOcurre: 'Estructura o actualiza el documento LaTeX (.tex) con fórmulas matemáticas y figuras generadas.',
    objetoSalida: 'Documento .tex estructurado / PDF científico',
    icono: 'FileText',
    descripcion: 'Síntesis formal donde se articulan los hallazgos en formato académico riguroso con soporte KaTeX.',
  },
  {
    id: 'pizarra',
    nombre: 'Pizarra de Sustentación',
    subtitulo: 'Estación 5: Defensa del Conocimiento',
    objetoEntrada: 'Documento científico consolidado y evidencias',
    queOcurre: 'Reúne el material completo de sustentación, comparativas de modelos y guion de presentación.',
    objetoSalida: 'Presentación interactiva y material de defensa',
    icono: 'Presentation',
    descripcion: 'Estación final de divulgación académica donde el investigador defiende el valor analítico y empresarial del trabajo.',
  },
];

export const ENCARGOS_UNIDADES: Record<1 | 2 | 3 | 4, UnitEncargo> = {
  1: {
    numero: 1,
    titulo: 'Conceptos sobre Minería de Datos',
    subtitulo: 'Fundamentación teórica y ciclo KDD / CRISP-DM',
    preguntaProblema:
      '¿Qué aplicaciones empresariales encuentra para la minería de datos y cómo las puede aprovechar en su vida profesional?',
    encargoNarrativo:
      'Tu misión como investigador es explorar el ecosistema de la minería de datos, dominar las metodologías CRISP-DM y KDD, e identificar cómo transformar depósitos de datos brutos en ventajas competitivas y decisiones estratégicas comprobables.',
    zonaNombre: 'Biblioteca Histórica y Archivo',
    entregableClave: 'Ecuaciones booleanas DW, matrices bibliográficas y taxonomía de técnicas.',
    rangoAlCompletar: 'Investigador',
  },
  2: {
    numero: 2,
    titulo: 'Modelos y Técnicas de la Minería de Datos',
    subtitulo: 'Formalización matemática y diseño algorítmico',
    preguntaProblema:
      '¿Cómo las matemáticas son aprovechadas para desarrollar técnicas y modelos de minería que posteriormente son sintetizados en algoritmos para desarrollar estrategias de negocio como ecommerce, marketing, entre otros?',
    encargoNarrativo:
      'Deberás descender al núcleo algebraico, probabilístico y estadístico de los algoritmos (regresión, árboles, redes neuronales, clustering) para comprender cómo las formulaciones teóricas sustentan la optimización de procesos y predicciones comerciales.',
    zonaNombre: 'Taller Teórico y Algorítmico',
    entregableClave: 'Scripts en R de modelos clásicos, evaluación de métricas y deducción matemática.',
    rangoAlCompletar: 'Analista',
  },
  3: {
    numero: 3,
    titulo: 'Aplicaciones con Diferentes Técnicas de Minería',
    subtitulo: 'Experimentación empírica con datos gubernamentales y empresariales',
    preguntaProblema:
      '¿Cómo aplicar diferentes técnicas de minería de datos a bases de datos existentes en empresas o bases de datos gubernamentales?',
    encargoNarrativo:
      'Somete a prueba tus modelos contra conjuntos de datos reales y públicos. Aplica preprocesamiento riguroso, entrena clasificadores, extrae reglas de asociación y mide la precisión en escenarios no controlados.',
    zonaNombre: 'Laboratorio Experimental',
    entregableClave: 'Ejecución reproducible en Rscript, matrices de confusión y gráficos analíticos.',
    rangoAlCompletar: 'Científico de datos',
  },
  4: {
    numero: 4,
    titulo: 'Proyecto Integrador',
    subtitulo: 'Implementación integral, síntesis editorial y sustentación',
    preguntaProblema:
      '¿Cómo aplicar las técnicas de minería de datos en proyectos propios?',
    encargoNarrativo:
      'Consolida todo el recorrido en una solución metodológica y práctica completa: desde la búsqueda bibliográfica y la preparación de datos hasta el modelo híbrido, el reporte formal en LaTeX y la sustentación final ante el comité académico.',
    zonaNombre: 'Sala de Sustentación',
    entregableClave: 'Artículo en LaTeX compilable, panel comparativo y presentación ejecutiva.',
    rangoAlCompletar: 'Maestro de minería de datos',
  },
};

export const RANGOS_INVESTIGACION: RangoInvestigador[] = [
  {
    unidadesRequeridas: 0,
    rango: 'Explorador',
    tituloHonorifico: 'Observador Inicial',
    descripcion: 'Inicia el recorrido conociendo la arquitectura de La Máquina y sus estaciones.',
  },
  {
    unidadesRequeridas: 1,
    rango: 'Investigador',
    tituloHonorifico: 'Especialista en Literatura y Metodologías',
    descripcion: 'Ha recorrido la Unidad 1 en La Máquina, dominando CRISP-DM y búsqueda bibliográfica.',
  },
  {
    unidadesRequeridas: 2,
    rango: 'Analista',
    tituloHonorifico: 'Modelador Algorítmico',
    descripcion: 'Ha operado las estaciones de la Unidad 2, deduciendo la base matemática de las técnicas.',
  },
  {
    unidadesRequeridas: 3,
    rango: 'Científico de datos',
    tituloHonorifico: 'Experimentador Empírico',
    descripcion: 'Ha validado modelos y procesado datasets reales en el Laboratorio de la Unidad 3.',
  },
  {
    unidadesRequeridas: 4,
    rango: 'Maestro de minería de datos',
    tituloHonorifico: 'Autor de Proyecto Integrador',
    descripcion: 'Ha completado el ciclo integral de La Máquina: desde la consulta hasta la sustentación.',
  },
];
