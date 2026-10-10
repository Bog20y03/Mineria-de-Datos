# Guía Ejecutiva de Sustentación del Proyecto
## 1. Problema
Evaluación de la viabilidad de la minería de datos para la detección temprana de deserción en educación superior.
## 2. Objetivos
Contrastar tres familias metodológicas supervisadas y evaluar su capacidad de discriminación frente a la regla base de clase mayoritaria.
## 3. Base de Datos
Muestra didáctica de 500 registros con estructura inspirada en UCI #697; no verificada como submuestra (5 casos de abandono, 1.0% de prevalencia).
## 4. Metodología
Ciclo analítico CRISP-DM estructurado en 6 fases con pipeline reproducible en R.
## 5. Técnicas Evaluadas
- Regresión Logística Binaria (GLM).
- Árboles de Decisión CART (`rpart`).
- Redes Neuronales Artificiales Perceptrón Multicapa (`nnet`).
## 6. Resultados en Conjunto de Prueba (150 registros, 3 positivos)
- **Exactitud de cada modelo:** 98.00% (GLM, CART, MLP).
- **Sensibilidad de cada modelo:** 0% (ningún positivo detectado).
- **Baseline de clase mayoritaria:** 98.00%.
- **Relación con baseline:** Los modelos evaluados igualan el baseline trivial de la clase mayoritaria.
## 7. Gráficas Principales
- Comparativa de exactitud multimodelo vs baseline (`grafico_02_benchmark_proyecto.png`).
- Gráfico de sustentación ejecutiva (`grafico_04_sustentacion.png`).
## 8. Diagnóstico Crítico y Recomendaciones
El desbalance severo de la muestra didáctica (1% casos positivos) conduce a los clasificadores a converger en la regla trivial de predecir no abandono para todos los casos. Se recomienda implementar técnicas de balanceo (SMOTE o ponderación de clases) y evaluar sobre el dataset completo de la fuente oficial.
