import type { UnitId } from '../types/domain';

export interface JurorProfile {
  id: string;
  nombre: string;
  titulo: string;
  especialidad: string;
  avatarColor: string;
  avatarInitials: string;
}

export const TRIBUNAL_JURORS: JurorProfile[] = [
  {
    id: 'juror-1',
    nombre: 'Dr. Carlos Mendoza, Ph.D.',
    titulo: 'Presidente del Jurado',
    especialidad: 'Minería de Datos y Complejidad Algorítmica',
    avatarColor: '#ea580c',
    avatarInitials: 'CM',
  },
  {
    id: 'juror-2',
    nombre: 'Dra. Elena Ramos, Ph.D.',
    titulo: 'Jurado Metodológico',
    especialidad: 'Inferencia Estadística, Bioestadística y Validación Empírica',
    avatarColor: '#059669',
    avatarInitials: 'ER',
  },
  {
    id: 'juror-3',
    nombre: 'Mg. Mateo Villegas',
    titulo: 'Jurado de Industria y Aplicación',
    especialidad: 'Arquitectura de Datos, ETL & Despliegue CRISP-DM',
    avatarColor: '#0284c7',
    avatarInitials: 'MV',
  },
];

export interface DefenseQuestion {
  id: string;
  jurorId: string;
  pregunta: string;
  contexto: string;
  opciones: {
    id: string;
    texto: string;
    esCorrecta: boolean;
    retroalimentacion: string;
  }[];
  justificacionFormal: string;
  formulaKatex?: string;
  referencia: string;
}

export interface TopicDefenseData {
  unitId: UnitId;
  topicId: string;
  topicName: string;
  preguntas: DefenseQuestion[];
}

/**
 * Banco de preguntas rigurosas para la sustentación oral por temática.
 */
export const DEFENSE_QUESTIONS_BANK: Record<string, DefenseQuestion[]> = {
  // 1. Minería de Datos / General KDD / CRISP-DM
  kdd_general: [
    {
      id: 'q-kdd-1',
      jurorId: 'juror-1',
      pregunta: '¿Por qué la minería de datos se define formalmente como una etapa subordinada dentro del proceso KDD y no como un fin aislado?',
      contexto: 'Fayyad et al. (1996) establecen las fases de Selección, Preprocesamiento, Transformación, Minería y Evaluación.',
      opciones: [
        {
          id: 'a',
          texto: 'Porque sin las fases previas de limpieza y transformación de datos, los algoritmos inducirían patrones espurios sobre ruido o sesgos de escala.',
          esCorrecta: true,
          retroalimentacion: 'Exacto. El principio "Garbage In, Garbage Out" exige que la minería opere sobre datos previamente curados, validados y normalizados.',
        },
        {
          id: 'b',
          texto: 'Porque la minería de datos únicamente aplica a bases de datos relacionales SQL pero no a datos no estructurados.',
          esCorrecta: false,
          retroalimentacion: 'Incorrecto. La minería abarca tanto estructuras tabulares como grafos, textos y flujos continuos.',
        },
        {
          id: 'c',
          texto: 'Porque los algoritmos de machine learning no requieren evaluación posterior una vez ajustados.',
          esCorrecta: false,
          retroalimentacion: 'Incorrecto. La fase de interpretación y validación es indispensable en KDD.',
        },
      ],
      justificacionFormal: 'KDD es el proceso holístico de descubrimiento de conocimiento. La minería de datos es únicamente la fase técnica de extracción matemática de modelos.',
      referencia: 'Fayyad, U., Piatetsky-Shapiro, G., & Smyth, P. (1996). From data mining to knowledge discovery in databases. AI magazine.',
    },
    {
      id: 'q-kdd-2',
      jurorId: 'juror-2',
      pregunta: '¿Cuál es la razón científica por la cual en todos los scripts de R fijamos una semilla pseudoaleatoria (set.seed=42)?',
      contexto: 'Criterio metodológico de auditoría y reproducibilidad científica en experimentación formativa.',
      opciones: [
        {
          id: 'a',
          texto: 'Garantiza que cualquier par evaluador o jurado obtenga exactamente las mismas particiones, centroides y métricas al replicar la ejecución.',
          esCorrecta: true,
          retroalimentacion: '¡Excelente! En ciencia de datos la reproducibilidad es el pilar de la verificación empírica independiente.',
        },
        {
          id: 'b',
          texto: 'Aumenta artificialmente la precisión del modelo optimizando la convergencia del algoritmo.',
          esCorrecta: false,
          retroalimentacion: 'Falso. La semilla no mejora el rendimiento, solo fija el estado del generador pseudoaleatorio.',
        },
        {
          id: 'c',
          texto: 'Es un requisito obligatorio impuesto por el compilador de R para evitar errores de memoria.',
          esCorrecta: false,
          retroalimentacion: 'Falso. R no exige semillas; es un estándar de rigor metodológico adoptado por el investigador.',
        },
      ],
      justificacionFormal: 'El generador Mersenne Twister produce secuencias deterministas a partir de la semilla dada, impidiendo variabilidad no controlada.',
      referencia: 'Peng, R. D. (2011). Reproducible research in computational science. Science, 334(6060), 1226-1227.',
    },
    {
      id: 'q-kdd-3',
      jurorId: 'juror-3',
      pregunta: 'En la metodología CRISP-DM, si durante la fase de Evaluación los resultados no cumplen los objetivos de negocio, ¿qué acción metodológica procede?',
      contexto: 'Naturaleza cíclica e iterativa del estándar CRISP-DM (Chapman et al., 2000).',
      opciones: [
        {
          id: 'a',
          texto: 'Reiterar el ciclo regresando a la Comprensión del Negocio o a la Preparación de Datos para redefinir el problema o las variables.',
          esCorrecta: true,
          retroalimentacion: 'Correcto. CRISP-DM no es lineal; la retroalimentación entre Evaluación y Business Understanding es esencial.',
        },
        {
          id: 'b',
          texto: 'Proceder inmediatamente al despliegue forzando la aprobación del cliente.',
          esCorrecta: false,
          retroalimentacion: 'Inaceptable. Desplegar un modelo no conforme introduce fallos críticos en producción.',
        },
        {
          id: 'c',
          texto: 'Descartar todo el proyecto y reiniciar la búsqueda bibliográfica desde cero.',
          esCorrecta: false,
          retroalimentacion: 'Incorrecto. No se descarta el conocimiento adquirido; se reajustan premisas o ingeniería de características.',
        },
      ],
      justificacionFormal: 'La flecha bidireccional entre Business Understanding y Evaluation en el diagrama CRISP-DM formaliza este bucle adaptativo.',
      referencia: 'Chapman, P. et al. (2000). CRISP-DM 1.0: Step-by-step data mining guide.',
    },
    {
      id: 'q-kdd-4',
      jurorId: 'juror-1',
      pregunta: 'En el script de diagnóstico realizamos una partición estratificada Train (80%) y Test (20%). ¿Qué patología estadística previene esto?',
      contexto: 'Capacidad de generalización y balance de varianza-sesgo en aprendizaje computacional.',
      opciones: [
        {
          id: 'a',
          texto: 'El sobreajuste (overfitting) y la evaluación optimista, midiendo el error en datos no vistos durante el ajuste.',
          esCorrecta: true,
          retroalimentacion: 'Impecable. Evaluar con los mismos datos de entrenamiento produce estimaciones de error fraudulentamente bajas.',
        },
        {
          id: 'b',
          texto: 'La presencia de valores nulos o registros duplicados en la base de datos.',
          esCorrecta: false,
          retroalimentacion: 'Incorrecto. Eso corresponde a la fase de limpieza de datos, no al particionamiento.',
        },
        {
          id: 'c',
          texto: 'Reduce la complejidad temporal del algoritmo en un factor cuadrático O(n^2).',
          esCorrecta: false,
          retroalimentacion: 'Falso. La partición reduce el tamaño de muestra de entrenamiento pero no altera la clase asintótica del algoritmo.',
        },
      ],
      justificacionFormal: 'El error empírico sobre el conjunto de prueba es un estimador insesgado del error de generalización en la distribución poblacional.',
      formulaKatex: 'E_{test} = \\frac{1}{N_{test}} \\sum_{i=1}^{N_{test}} L(y_i, \\hat{f}(x_i))',
      referencia: 'Hastie, T., Tibshirani, R., & Friedman, J. (2009). The elements of statistical learning. Springer.',
    },
  ],

  // 2. Agrupamiento / Clustering / K-Means
  clustering: [
    {
      id: 'q-cl-1',
      jurorId: 'juror-1',
      pregunta: '¿Por qué es indispensable aplicar la función scale() a las variables numéricas antes de ajustar el algoritmo K-Means?',
      contexto: 'Sensibilidad métrica en espacios euclidianos multidimensionales.',
      opciones: [
        {
          id: 'a',
          texto: 'Porque K-Means utiliza distancias euclidianas; variables con magnitudes grandes (ej. salarios en millones) dominarían artificialmente sobre variables de rango pequeño (ej. edad en decenas).',
          esCorrecta: true,
          retroalimentacion: '¡Excelente sustentación! La estandarización (media 0, desviación 1) otorga igualdad de ponderación a todas las dimensiones.',
        },
        {
          id: 'b',
          texto: 'Porque K-Means solo puede procesar números enteros entre 0 y 100.',
          esCorrecta: false,
          retroalimentacion: 'Falso. K-Means opera naturalmente sobre números reales continuos.',
        },
        {
          id: 'c',
          texto: 'Porque scale() convierte automáticamente variables categóricas en dummies.',
          esCorrecta: false,
          retroalimentacion: 'Incorrecto. scale() solo aplica a vectores numéricos.',
        },
      ],
      justificacionFormal: 'La distancia euclidiana d(x, y) = sqrt(sum (x_i - y_i)^2) es invariante a traslación pero no a escala dimensional.',
      formulaKatex: 'z_i = \\frac{x_i - \\mu}{\\sigma}',
      referencia: 'MacQueen, J. (1967). Some methods for classification and analysis of multivariate observations.',
    },
    {
      id: 'q-cl-2',
      jurorId: 'juror-2',
      pregunta: 'En las métricas emitidas por el script de R se reporta un ratio BSS/TSS de 76.7%. ¿Cómo interpreta este valor ante el jurado?',
      contexto: 'Descomposición de la varianza total en Suma de Cuadrados Intra-clúster (WCSS) y Entre-clústeres (BSS).',
      opciones: [
        {
          id: 'a',
          texto: 'Indica que el 76.7% de la dispersión total del dataset es explicada por la separación entre los grupos, evidenciando clústeres compactos y bien diferenciados.',
          esCorrecta: true,
          retroalimentacion: 'Preciso y riguroso. Análogo al coeficiente R^2, entre mayor sea BSS/TSS más óptima es la partición.',
        },
        {
          id: 'b',
          texto: 'Indica que el modelo cometió un 76.7% de error en la asignación de individuos.',
          esCorrecta: false,
          retroalimentacion: 'Completamente erróneo. Confunde varianza explicada con tasa de error.',
        },
        {
          id: 'c',
          texto: 'Significa que solo el 23.3% de los datos fueron analizados por el algoritmo.',
          esCorrecta: false,
          retroalimentacion: 'Falso. El 100% de los datos fueron asignados a clústeres.',
        },
      ],
      justificacionFormal: 'TSS = WCSS + BSS. El ratio BSS/TSS cuantifica la proporción de varianza atribuible a la partición.',
      formulaKatex: '\\text{Ratio} = \\frac{BSS}{TSS} = 1 - \\frac{WCSS}{TSS}',
      referencia: 'Tan, P.-N., Steinbach, M., & Kumar, V. (2018). Introduction to Data Mining.',
    },
    {
      id: 'q-cl-3',
      jurorId: 'juror-3',
      pregunta: '¿Cómo justificaría la elección de k=3 clústeres en lugar de k=2 o k=10 en su sustentación?',
      contexto: 'Criterios objetivos de selección de hiperparámetros (Método del Codo y Silueta Media).',
      opciones: [
        {
          id: 'a',
          texto: 'Mediante la curva de codo (identificando la disminución marginal de WCSS) y la maximización del coeficiente de silueta promedio.',
          esCorrecta: true,
          retroalimentacion: 'Correcto. Ese es el estándar de oro en agrupamiento particional no supervisado.',
        },
        {
          id: 'b',
          texto: 'Eligiendo k=3 arbitrariamente porque es el valor por defecto que recomienda la consola de R.',
          esCorrecta: false,
          retroalimentacion: 'Inaceptable en una defensa formal; se requiere justificación heurística o empírica.',
        },
        {
          id: 'c',
          texto: 'Porque a mayor número de clústeres el modelo siempre tiene mayor capacidad predictiva en datos no supervisados.',
          esCorrecta: false,
          retroalimentacion: 'Falso. Un k excesivo fragmenta la información y conduce a sobreajuste trivial (k=N implica WCSS=0).',
        },
      ],
      justificacionFormal: 'El coeficiente de silueta s(i) oscila entre -1 y +1, donde valores superiores a 0.5 denotan estructura razonable.',
      formulaKatex: 's(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}',
      referencia: 'Rousseeuw, P. J. (1987). Silhouettes: a graphical aid to the interpretation and validation of cluster analysis.',
    },
    {
      id: 'q-cl-4',
      jurorId: 'juror-1',
      pregunta: '¿Por qué en K-Means se utiliza el parámetro nstart=20 en la llamada estándar en R?',
      contexto: 'Convergencia a mínimos locales dependientes de la inicialización de centroides de Forgy/Random.',
      opciones: [
        {
          id: 'a',
          texto: 'Porque K-Means converge a mínimos locales de WCSS; nstart=20 ejecuta 20 inicializaciones aleatorias independientes y conserva la mejor.',
          esCorrecta: true,
          retroalimentacion: '¡Excelente! Esto mitiga significativamente el riesgo de quedar atrapado en una configuración subóptima.',
        },
        {
          id: 'b',
          texto: 'Para limitar el número de iteraciones a un máximo de 20 ciclos.',
          esCorrecta: false,
          retroalimentacion: 'Incorrecto. El número máximo de iteraciones se controla con el argumento iter.max.',
        },
        {
          id: 'c',
          texto: 'Para forzar que el algoritmo use 20 hilos de CPU en paralelo.',
          esCorrecta: false,
          retroalimentacion: 'Falso. R base ejecuta kmeans de manera monohilo a menos que se use un backend paralelo explícito.',
        },
      ],
      justificacionFormal: 'El problema de optimización de K-Means es NP-duro; el algoritmo de Lloyd es una heurística golosa sensible a la semilla inicial.',
      referencia: 'Arthur, D., & Vassilvitskii, S. (2007). k-means++: The advantages of careful seeding.',
    },
  ],

  // 3. Clasificación / Árboles de Decisión / CART / C5.0
  classification: [
    {
      id: 'q-cl-1',
      jurorId: 'juror-1',
      pregunta: 'En un árbol de clasificación CART (rpart en R), ¿cuál es el criterio matemático utilizado para seleccionar la mejor partición en un nodo?',
      contexto: 'Medidas de impureza de partición en divisiones binarias.',
      opciones: [
        {
          id: 'a',
          texto: 'La maximización de la ganancia en la impureza de Gini (o entropía), buscando nodos hijos lo más homogéneos posible.',
          esCorrecta: true,
          retroalimentacion: '¡Exacto! El algoritmo evalúa todos los puntos de corte posibles y selecciona el que maximiza la reducción de impureza Delta I.',
        },
        {
          id: 'b',
          texto: 'El cálculo del coeficiente de correlación de Pearson entre las variables predictoras.',
          esCorrecta: false,
          retroalimentacion: 'Falso. Pearson mide asociación lineal, no impureza de clases categóricas.',
        },
        {
          id: 'c',
          texto: 'La distancia euclidiana entre los centroides de las clases.',
          esCorrecta: false,
          retroalimentacion: 'Incorrecto. Eso corresponde a clasificadores de distancia mínima o LDA.',
        },
      ],
      justificacionFormal: 'El índice de Gini se define como Gini(t) = 1 - sum (p_i^2). La reducción de impureza determina el punto de división óptimo.',
      formulaKatex: '\\text{Gini}(t) = 1 - \\sum_{i=1}^{C} p(i|t)^2',
      referencia: 'Breiman, L., Friedman, J., Stone, C. J., & Olshen, R. A. (1984). Classification and regression trees. CRC press.',
    },
    {
      id: 'q-cl-2',
      jurorId: 'juror-2',
      pregunta: '¿Qué mecanismo previene que un árbol de decisión crezca hasta tener una hoja por cada registro del dataset (sobreajuste absoluto)?',
      contexto: 'Técnicas de regularización y poda (pruning) mediante parámetro de complejidad cp.',
      opciones: [
        {
          id: 'a',
          texto: 'La poda basada en el parámetro de complejidad (cp / complexity parameter) y la restricción del tamaño mínimo de nodo (minsplit).',
          esCorrecta: true,
          retroalimentacion: 'Impecable. El parámetro cp penaliza el crecimiento del árbol según la cantidad de hojas creadas.',
        },
        {
          id: 'b',
          texto: 'La normalización de las variables continuas con media cero y desviación uno.',
          esCorrecta: false,
          retroalimentacion: 'Incorrecto. Los árboles de decisión son invariantes a transformaciones monótonas de escala en variables cuantitativas.',
        },
        {
          id: 'c',
          texto: 'La eliminación aleatoria del 50% de las variables predictoras antes del ajuste.',
          esCorrecta: false,
          retroalimentacion: 'Falso. Eso es submuestreo de características (Random Forest), no regularización en un árbol individual.',
        },
      ],
      justificacionFormal: 'La función de costo penalizada es R_alpha(T) = R(T) + alpha * |T|, donde alpha equilibra el error con el tamaño del árbol.',
      formulaKatex: 'R_\\alpha(T) = R(T) + \\alpha |T|',
      referencia: 'Quinlan, J. R. (1993). C4.5: programs for machine learning. Morgan Kaufmann.',
    },
    {
      id: 'q-cl-3',
      jurorId: 'juror-3',
      pregunta: 'Si la matriz de confusión muestra alta precisión (98%) pero una clase minoritaria tiene 0% de Recall (Sensibilidad), ¿qué problema metodológico enfrenta el modelo?',
      contexto: 'Desbalance severo de clases en problemas reales (fraude, diagnóstico médico, etc.).',
      opciones: [
        {
          id: 'a',
          texto: 'La paradoja de la precisión por desbalance de clases; el modelo predice siempre la clase mayoritaria sin aprender la minoritaria.',
          esCorrecta: true,
          retroalimentacion: '¡Excelente agudeza crítica! En datasets desbalanceados la exactitud global (Accuracy) es una métrica engañosa.',
        },
        {
          id: 'b',
          texto: 'Falta de memoria RAM en el servidor durante la ejecución del script.',
          esCorrecta: false,
          retroalimentacion: 'Completamente irrelevante para este comportamiento estadístico.',
        },
        {
          id: 'c',
          texto: 'Que el algoritmo de árbol no es capaz de procesar variables numéricas.',
          esCorrecta: false,
          retroalimentacion: 'Falso. Los árboles procesan variables continuas sin dificultad.',
        },
      ],
      justificacionFormal: 'Se deben utilizar métricas balanceadas como F1-Score, Balanced Accuracy o AUC-ROC, y aplicar técnicas como SMOTE o ponderación de clases.',
      formulaKatex: 'F_1 = 2 \\cdot \\frac{\\text{Precision} \\cdot \\text{Recall}}{\\text{Precision} + \\text{Recall}}',
      referencia: 'Chawla, N. V. et al. (2002). SMOTE: synthetic minority over-sampling technique. JAIR.',
    },
  ],

  // 4. Redes Neuronales / Perceptrón / Aprendizaje Supervisado
  neural_networks: [
    {
      id: 'q-nn-1',
      jurorId: 'juror-1',
      pregunta: '¿Por qué un perceptrón simple de una sola capa no puede resolver el problema de la función lógica XOR?',
      contexto: 'Limitación geométrica demostrada históricamente por Minsky & Papert (1969).',
      opciones: [
        {
          id: 'a',
          texto: 'Porque la función XOR no es linealmente separable en el plano dimensional; se requiere al menos una capa oculta no lineal.',
          esCorrecta: true,
          retroalimentacion: 'Respuesta perfecta. Este hito histórico motivó la invención del Perceptrón Multicapa y el algoritmo Backpropagation.',
        },
        {
          id: 'b',
          texto: 'Porque los pesos sinápticos no pueden ser negativos en una red neuronal.',
          esCorrecta: false,
          retroalimentacion: 'Falso. Los pesos pueden tomar cualquier valor real.',
        },
        {
          id: 'c',
          texto: 'Porque XOR requiere un número infinito de muestras de entrenamiento.',
          esCorrecta: false,
          retroalimentacion: 'Falso. XOR tiene exactamente 4 instancias binarias.',
        },
      ],
      justificacionFormal: 'Un hiperplano lineal w_1 x_1 + w_2 x_2 + b = 0 no puede separar los puntos {(0,0), (1,1)} de {(0,1), (1,0)}.',
      referencia: 'Minsky, M., & Papert, S. A. (1969). Perceptrons: An introduction to computational geometry. MIT press.',
    },
    {
      id: 'q-nn-2',
      jurorId: 'juror-2',
      pregunta: 'En el entrenamiento de una red neuronal mediante descenso de gradiente (backpropagation), ¿cuál es el rol de la tasa de aprendizaje (learning rate)?',
      contexto: 'Optimización de funciones de pérdida convexas y no convexas.',
      opciones: [
        {
          id: 'a',
          texto: 'Controla el tamaño del paso de actualización de los pesos sinápticos; un valor muy alto causa oscilación/divergencia y muy bajo produce convergencia excesivamente lenta.',
          esCorrecta: true,
          retroalimentacion: 'Impecable. Es uno de los hiperparámetros más críticos en el ajuste de redes neuronales.',
        },
        {
          id: 'b',
          texto: 'Determina el número de capas ocultas presentes en la arquitectura.',
          esCorrecta: false,
          retroalimentacion: 'Incorrecto. La arquitectura estructural se define en el diseño topológico.',
        },
        {
          id: 'c',
          texto: 'Garantiza que la función de costo siempre alcance el mínimo global absoluto.',
          esCorrecta: false,
          retroalimentacion: 'Falso. En superficies no convexas el gradiente puede converger a mínimos locales o puntos de silla.',
        },
      ],
      justificacionFormal: 'Regla de actualización: w_{t+1} = w_t - eta * gradiente(L). eta es el learning rate.',
      formulaKatex: 'w^{(t+1)} = w^{(t)} - \\eta \\nabla_w \\mathcal{L}(w^{(t)})',
      referencia: 'Rumelhart, D. E., Hinton, G. E., & Williams, R. J. (1986). Learning representations by back-propagating errors. Nature.',
    },
  ],
};

/**
 * Retorna las preguntas adecuadas para un tema o unidad específica.
 */
export function getQuestionsForTopic(_unitId: UnitId, topicId: string, _topicName: string): DefenseQuestion[] {
  const tid = topicId.toLowerCase();

  if (tid.includes('cluster') || tid.includes('kmeans') || tid.includes('mineria_datos') || tid.includes('metodos')) {
    return DEFENSE_QUESTIONS_BANK.clustering;
  }
  if (tid.includes('arbol') || tid.includes('clasificacion') || tid.includes('prediccion') || tid.includes('validacion')) {
    return DEFENSE_QUESTIONS_BANK.classification;
  }
  if (tid.includes('neuronal') || tid.includes('redes') || tid.includes('modelo_hibrido')) {
    return DEFENSE_QUESTIONS_BANK.neural_networks;
  }

  // Fallback a preguntas metodológicas KDD/CRISP-DM
  return DEFENSE_QUESTIONS_BANK.kdd_general;
}
