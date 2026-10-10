export interface AlgorithmProfile {
  id: string;
  nombre: string;
  alias: string;
  paradigma: 'No Supervisado' | 'Supervisado (Clasificación)' | 'Supervisado (Regresión)' | 'Asociación' | 'Series Temporales';
  naturaleza: 'Caja Blanca (Interpretable)' | 'Caja Gris' | 'Caja Negra (Opaco)';
  complejidadEntrenamiento: string;
  complejidadInferencia: string;
  complejidadEspacial: string;
  requiereNormalizacion: 'Estrictamente Sí' | 'No Necesario' | 'Recomendado';
  sensibilidadOutliers: 'Muy Alta' | 'Media' | 'Baja (Robusto)';
  manejoCategoricas: string;
  paqueteR: string;
  funcionR: string;
  metricasClave: string[];
  dimensionesScore: {
    interpretabilidad: number; // 1-10
    velocidadEntrenamiento: number; // 1-10
    escalabilidadDatos: number; // 1-10
    resistenciaRuido: number; // 1-10
    precisionFrontera: number; // 1-10
  };
  fortalezas: string[];
  debilidades: string[];
  criterioSustentacion: string;
}

export interface ClassicMatchup {
  id: string;
  titulo: string;
  subtitulo: string;
  modeloAId: string;
  modeloBId: string;
  preguntaJurado: string;
  veredictoRecomendado: string;
}

export const ALGORITHMS_REGISTRY: AlgorithmProfile[] = [
  {
    id: 'kmeans',
    nombre: 'K-Means Clustering (Lloyd / MacQueen)',
    alias: 'K-Means',
    paradigma: 'No Supervisado',
    naturaleza: 'Caja Gris',
    complejidadEntrenamiento: 'O(k \\cdot n \\cdot d \\cdot i)',
    complejidadInferencia: 'O(k \\cdot d)',
    complejidadEspacial: 'O((n + k) \\cdot d)',
    requiereNormalizacion: 'Estrictamente Sí',
    sensibilidadOutliers: 'Muy Alta',
    manejoCategoricas: 'Solo continuas (requiere K-Prototypes para mixtas)',
    paqueteR: 'stats / cluster',
    funcionR: 'kmeans(x, centers = k, nstart = 20)',
    metricasClave: ['Ratio BSS/TSS', 'Suma de Cuadrados Intra (WCSS)', 'Coeficiente de Silueta'],
    dimensionesScore: {
      interpretabilidad: 7,
      velocidadEntrenamiento: 9,
      escalabilidadDatos: 9,
      resistenciaRuido: 4,
      precisionFrontera: 6,
    },
    fortalezas: [
      'Extremadamente rápido y escalable a millones de registros con O(n).',
      'Fácil convergencia matemática mediante el algoritmo de Lloyd.',
      'Centroides directamente interpretables como perfiles promedio.',
    ],
    debilidades: [
      'Asume clústeres esféricos e isotrópicos de tamaño similar.',
      'Sensible a inicialización de centroides (mitigado con nstart=20).',
      'Obliga a predefinir el número k de grupos.',
    ],
    criterioSustentacion:
      'Elige K-Means cuando el volumen de datos sea grande (N > 10,000) y se busque una segmentación particional rápida de perfiles de negocio.',
  },
  {
    id: 'hclust',
    nombre: 'Clustering Jerárquico Aglomerativo (Ward.D2)',
    alias: 'Jerárquico',
    paradigma: 'No Supervisado',
    naturaleza: 'Caja Blanca (Interpretable)',
    complejidadEntrenamiento: 'O(n^2 \\log n) \\text{ o } O(n^3)',
    complejidadInferencia: 'O(n)',
    complejidadEspacial: 'O(n^2) \\text{ (Matriz de distancias)}',
    requiereNormalizacion: 'Estrictamente Sí',
    sensibilidadOutliers: 'Media',
    manejoCategoricas: 'Permite distancias de Gower para variables mixtas',
    paqueteR: 'stats / cluster',
    funcionR: 'hclust(dist(x), method = "ward.D2")',
    metricasClave: ['Coeficiente Cofenético', 'Altura de Corte del Dendrograma', 'Silueta Media'],
    dimensionesScore: {
      interpretabilidad: 9,
      velocidadEntrenamiento: 3,
      escalabilidadDatos: 3,
      resistenciaRuido: 6,
      precisionFrontera: 7,
    },
    fortalezas: [
      'El dendrograma visualiza la taxonomía completa a múltiples niveles de corte.',
      'No exige predefinir k por adelantado.',
      'Soporta métricas no euclidianas mediante matrices de disimilitud arbitrarias (Gower, Manhattan).',
    ],
    debilidades: [
      'Complejidad computacional cuadrática/cúbica: colapsa en memoria con N > 15,000.',
      'Las fusiones aglomerativas son irreversibles.',
    ],
    criterioSustentacion:
      'Elige Jerárquico cuando el tamaño de muestra sea moderado (N < 5,000) y la jerarquía taxonómica o el dendrograma aporten valor explicativo al usuario final.',
  },
  {
    id: 'cart',
    nombre: 'Árboles de Decisión (CART / Breiman)',
    alias: 'Árbol CART',
    paradigma: 'Supervisado (Clasificación)',
    naturaleza: 'Caja Blanca (Interpretable)',
    complejidadEntrenamiento: 'O(d \\cdot n \\log n)',
    complejidadInferencia: 'O(\\text{profundidad}) \\le O(\\log n)',
    complejidadEspacial: 'O(n_{\\text{nodos}})',
    requiereNormalizacion: 'No Necesario',
    sensibilidadOutliers: 'Baja (Robusto)',
    manejoCategoricas: 'Nativo sin variables dummy obligatorias',
    paqueteR: 'rpart / rpart.plot',
    funcionR: 'rpart(y ~ ., data = train, method = "class", cp = 0.01)',
    metricasClave: ['Impureza de Gini', 'Matriz de Confusión', 'F1-Score', 'Poda cp'],
    dimensionesScore: {
      interpretabilidad: 10,
      velocidadEntrenamiento: 8,
      escalabilidadDatos: 8,
      resistenciaRuido: 6,
      precisionFrontera: 7,
    },
    fortalezas: [
      'Máxima explicabilidad: genera reglas lógicas explícitas IF-THEN.',
      'Completamente invariante a transformaciones monotónicas de escala.',
      'Maneja valores ausentes mediante divisiones subrogadas (surrogate splits).',
    ],
    debilidades: [
      'Alta varianza: pequeñas perturbaciones en los datos alteran drásticamente la estructura del árbol.',
      'Fronteras de decisión ortogonales a los ejes (escalonadas).',
      'Propenso a sobreajuste si no se aplica poda con parámetro cp.',
    ],
    criterioSustentacion:
      'Elige CART cuando la explicabilidad y la auditoría legal/médica sean obligatorias, permitiendo justificar cada predicción con reglas transparentes.',
  },
  {
    id: 'mlp',
    nombre: 'Redes Neuronales Artificiales (Multilayer Perceptron / Backprop)',
    alias: 'MLP / Red Neuronal',
    paradigma: 'Supervisado (Clasificación)',
    naturaleza: 'Caja Negra (Opaco)',
    complejidadEntrenamiento: 'O(e \\cdot n \\cdot \\sum (n_l n_{l+1}))',
    complejidadInferencia: 'O(\\sum (n_l n_{l+1}))',
    complejidadEspacial: 'O(\\sum (n_l n_{l+1}))',
    requiereNormalizacion: 'Estrictamente Sí',
    sensibilidadOutliers: 'Muy Alta',
    manejoCategoricas: 'Exige One-Hot Encoding riguroso',
    paqueteR: 'nnet / neuralnet',
    funcionR: 'nnet(y ~ ., data = train, size = 5, decay = 0.01, maxit = 200)',
    metricasClave: ['Entropía Cruzada (Cross-Entropy)', 'Convergencia SSE', 'Sensibilidad y AUC'],
    dimensionesScore: {
      interpretabilidad: 2,
      velocidadEntrenamiento: 5,
      escalabilidadDatos: 7,
      resistenciaRuido: 7,
      precisionFrontera: 10,
    },
    fortalezas: [
      'Aproximador universal: modela relaciones no lineales de alta complejidad y combinatorias complejas.',
      'Fronteras de decisión suaves y continuas en el espacio dimensional.',
      'Excelente capacidad de generalización en problemas con señales ricas y no separables linealmente.',
    ],
    debilidades: [
      'Caja negra: es imposible extraer explicaciones intuitivas de los pesos sinápticos individuales.',
      'Alta sensibilidad a la escala de las variables y a la tasa de aprendizaje eta.',
      'Requiere sintonización de hiperparámetros (épocas, regularización decay, capas).',
    ],
    criterioSustentacion:
      'Elige Redes Neuronales cuando la precisión predictiva sea la prioridad absoluta y los datos exhiban interacciones no lineales que un modelo basado en reglas no pueda capturar.',
  },
  {
    id: 'linear_reg',
    nombre: 'Regresión Lineal Múltiple (Mínimos Cuadrados OLS)',
    alias: 'Regresión OLS',
    paradigma: 'Supervisado (Regresión)',
    naturaleza: 'Caja Blanca (Interpretable)',
    complejidadEntrenamiento: 'O(d^2 n + d^3)',
    complejidadInferencia: 'O(d)',
    complejidadEspacial: 'O(d)',
    requiereNormalizacion: 'Recomendado',
    sensibilidadOutliers: 'Muy Alta',
    manejoCategoricas: 'Requiere codificación dummy/contrastes',
    paqueteR: 'stats',
    funcionR: 'lm(y ~ ., data = train)',
    metricasClave: ['R^2 Ajustado', 'RMSE', 'Valor p (Pr>|t|)', 'Estadístico F'],
    dimensionesScore: {
      interpretabilidad: 9,
      velocidadEntrenamiento: 10,
      escalabilidadDatos: 8,
      resistenciaRuido: 4,
      precisionFrontera: 5,
    },
    fortalezas: [
      'Solución analítica exacta en forma cerrada (ecuaciones normales).',
      'Coeficientes beta_j cuantifican formalmente el efecto marginal de cada variable predictora.',
      'Proporciona intervalos de confianza e inferencia estadística estricta.',
    ],
    debilidades: [
      'Asume estrictamente linealidad, homocedasticidad y normalidad de residuos.',
      'Extremadamente vulnerable a puntos de alto apalancamiento (leverage outliers) y multicolinealidad.',
    ],
    criterioSustentacion:
      'Elige Regresión Lineal cuando el objetivo no sea únicamente predecir sino inferir formalmente qué factores impulsan la variable respuesta con significancia estadística.',
  },
  {
    id: 'apriori',
    nombre: 'Algoritmo Apriori (Reglas de Asociación / Agrawal)',
    alias: 'Apriori',
    paradigma: 'Asociación',
    naturaleza: 'Caja Blanca (Interpretable)',
    complejidadEntrenamiento: 'O(2^d) \\text{ (Peor caso)}',
    complejidadInferencia: 'O(1) \\text{ (Búsqueda en tabla de reglas)}',
    complejidadEspacial: 'O(n_{\\text{candidatos}})',
    requiereNormalizacion: 'No Necesario',
    sensibilidadOutliers: 'Baja (Robusto)',
    manejoCategoricas: 'Diseñado exclusivamente para datos transaccionales binarios',
    paqueteR: 'arules / arulesViz',
    funcionR: 'apriori(data, parameter = list(supp = 0.05, conf = 0.7))',
    metricasClave: ['Soporte (Support)', 'Confianza (Confidence)', 'Lift / Sustento', 'Convicción'],
    dimensionesScore: {
      interpretabilidad: 10,
      velocidadEntrenamiento: 6,
      escalabilidadDatos: 7,
      resistenciaRuido: 8,
      precisionFrontera: 6,
    },
    fortalezas: [
      'Explota la propiedad antimonótona (apriori property) para podar el espacio de búsqueda exponencial.',
      'Reglas directas de canasta de mercado X => Y aplicables a promociones y recomendaciones inmediatas.',
      'No requiere variable dependiente objetivo predefinida.',
    ],
    debilidades: [
      'Múltiples escaneos al disco/dataset completo para contar frecuencias.',
      'Genera millones de reglas redundantes si el umbral de soporte es muy bajo.',
    ],
    criterioSustentacion:
      'Elige Apriori en minería transaccional para descubrir patrones de co-ocurrencia y correlaciones de afinidad en canastas de compra o registros médicos.',
  },
];

export const CLASSIC_MATCHUPS: ClassicMatchup[] = [
  {
    id: 'clustering_duel',
    titulo: 'K-Means vs. Clustering Jerárquico',
    subtitulo: 'Particionamiento Rápido vs. Taxonomía de Dendrograma',
    modeloAId: 'kmeans',
    modeloBId: 'hclust',
    preguntaJurado:
      '¿Por qué se seleccionó K-Means en vez de Clustering Jerárquico si el dendrograma muestra toda la jerarquía?',
    veredictoRecomendado:
      'K-Means escala con complejidad O(n), lo que permite procesar datasets de cientos de miles de registros donde la matriz de distancias de hclust colapsaría en memoria RAM (O(n²)). Sin embargo, si N es pequeño, el dendrograma de hclust proporciona mayor riqueza analítica.',
  },
  {
    id: 'tree_vs_neural',
    titulo: 'Árbol CART vs. Red Neuronal MLP',
    subtitulo: 'Transparencia de Reglas (Caja Blanca) vs. Capacidad No Lineal (Caja Negra)',
    modeloAId: 'cart',
    modeloBId: 'mlp',
    preguntaJurado:
      'Si una Red Neuronal puede alcanzar mayor precisión teórica, ¿por qué defender un Árbol de Decisión?',
    veredictoRecomendado:
      'En contextos de toma de decisiones reguladas (financieras, académicas, médicas), la interpretabilidad legal de las reglas IF-THEN del árbol supera la ganancia marginal de precisión de la red neuronal. Además, CART no requiere escalamiento y es inmune a variables irrelevantes.',
  },
  {
    id: 'linear_vs_tree',
    titulo: 'Regresión Lineal vs. Árbol de Regresión',
    subtitulo: 'Ajuste Paramétrico OLS vs. Aproximación por Constantes a Trozos',
    modeloAId: 'linear_reg',
    modeloBId: 'cart',
    preguntaJurado:
      '¿En qué situaciones supera un Árbol a una Regresión Múltiple en variables continuas?',
    veredictoRecomendado:
      'El árbol supera a la regresión lineal cuando existen efectos de interacción complejos y umbrales no lineales (saltos discretos) entre variables predictoras donde la hipótesis de linealidad OLS fracasa sistemáticamente.',
  },
];
