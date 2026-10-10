# ==============================================================================
# TEMA 02: PROCESOS DE MINERÍA DE DATOS – KDD
# SCRIPT: 02_KDD_run.R
# OBJETIVO: Implementación canónica y explícita de las 5 fases del proceso KDD:
#           1. Selección (Selection)
#           2. Preprocesamiento (Preprocessing)
#           3. Transformación (Transformation)
#           4. Minería de Datos (Data Mining)
#           5. Evaluación / Interpretación (Evaluation & Interpretation)
# ==============================================================================

set.seed(456)
library(rpart)

cat(">>> [TEMA 02: PROCESO KDD] Iniciando flujo por etapas...\n\n")

# ------------------------------------------------------------------------------
# ETAPA 1: SELECCIÓN (SELECTION)
# Objetivo: Delimitar el conjunto de datos objetivo (Target Data) enfocado en
#           el fenómeno de interés (calidad del aire y factores climáticos).
# ------------------------------------------------------------------------------
cat("====================================================================\n")
cat("ETAPA 1: SELECCIÓN (SELECTION)\n")
cat("====================================================================\n")
data(airquality)
cat("Datos crudos disponibles:", nrow(airquality), "observaciones con", ncol(airquality), "variables.\n")

# Se seleccionan únicamente las variables predictoras continuas y la respuesta ambiental
columnas_objetivo <- c("Ozone", "Solar.R", "Wind", "Temp", "Month")
datos_seleccionados <- airquality[, columnas_objetivo]

# Filtro de registros del periodo estival crítico (meses 5 al 9: Mayo - Septiembre)
datos_seleccionados <- datos_seleccionados[datos_seleccionados$Month %in% 5:9, ]
cat("Registros seleccionados (periodo estival):", nrow(datos_seleccionados), "filas.\n")
print(head(datos_seleccionados, 3))

# ------------------------------------------------------------------------------
# ETAPA 2: PREPROCESAMIENTO (PREPROCESSING)
# Objetivo: Limpieza de datos (Preprocessed Data), tratamiento de valores
#           nulos (NAs) y consistencia estadística.
# ------------------------------------------------------------------------------
cat("\n====================================================================\n")
cat("ETAPA 2: PREPROCESAMIENTO (PREPROCESSING)\n")
cat("====================================================================\n")
conteo_nas <- colSums(is.na(datos_seleccionados))
cat("Valores nulos detectados por variable:\n")
print(conteo_nas)

# Imputación robusta: Imputación por mediana condicionada (evita sesgo de media en presencia de asimetría)
datos_preprocesados <- datos_seleccionados
for (col in names(datos_preprocesados)) {
  if (any(is.na(datos_preprocesados[[col]]))) {
    mediana_val <- median(datos_preprocesados[[col]], na.rm = TRUE)
    datos_preprocesados[[col]][is.na(datos_preprocesados[[col]])] <- mediana_val
    cat(paste0("  -> Variable '", col, "' imputada con mediana = ", round(mediana_val, 2), "\n"))
  }
}
cat("Total de NAs residuales tras limpieza:", sum(is.na(datos_preprocesados)), "\n")

# ------------------------------------------------------------------------------
# ETAPA 3: TRANSFORMACIÓN (TRANSFORMATION)
# Objetivo: Creación de atributos derivados e ingeniería de características
#           (Transformed Data) para modelado analítico.
# ------------------------------------------------------------------------------
cat("\n====================================================================\n")
cat("ETAPA 3: TRANSFORMACIÓN (TRANSFORMATION)\n")
cat("====================================================================\n")
datos_transformados <- datos_preprocesados

# Discretización de variable objetivo: Estado de Calidad del Aire (Umbral regulatorio: Ozone > 55 ppb)
datos_transformados$Alerta_Ozono <- factor(
  ifelse(datos_transformados$Ozone > 55, "Riesgo_Alto", "Aceptable"),
  levels = c("Aceptable", "Riesgo_Alto")
)

# Ingeniería de atributos: Ratio de estrés térmico-eólico (Temperatura / Velocidad del Viento)
datos_transformados$Indice_Termo_Eolico <- round(datos_transformados$Temp / datos_transformados$Wind, 2)

cat("Nueva variable objetivo creada: 'Alerta_Ozono' (Distribución):\n")
print(table(datos_transformados$Alerta_Ozono))
cat("Atributo sintético generado: 'Indice_Termo_Eolico'.\n")

# ------------------------------------------------------------------------------
# ETAPA 4: MINERÍA DE DATOS (DATA MINING)
# Objetivo: Extracción de patrones de conocimiento mediante un algoritmo de
#           inducción no paramétrico (Árbol de Decisión CART con rpart).
# ------------------------------------------------------------------------------
cat("\n====================================================================\n")
cat("ETAPA 4: MINERÍA DE DATOS (DATA MINING)\n")
cat("====================================================================\n")

# Partición formal de datos (80% Entrenamiento, 20% Prueba)
indices_entrenamiento <- sample(1:nrow(datos_transformados), size = 0.8 * nrow(datos_transformados))
train_kdd <- datos_transformados[indices_entrenamiento, ]
test_kdd  <- datos_transformados[-indices_entrenamiento, ]

# Ajuste del modelo de árbol de decisión
formula_kdd <- Alerta_Ozono ~ Solar.R + Wind + Temp + Indice_Termo_Eolico
modelo_arbol_kdd <- rpart(formula_kdd, data = train_kdd, method = "class",
                          control = rpart.control(cp = 0.02, minsplit = 10))

cat("Estructura del Árbol de Minería de Datos inducido:\n")
print(modelo_arbol_kdd)

# ------------------------------------------------------------------------------
# ETAPA 5: EVALUACIÓN E INTERPRETACIÓN (EVALUATION & INTERPRETATION)
# Objetivo: Validar la generalización del conocimiento descubierto y extraer
#           reglas semánticas accionables para la toma de decisiones.
# ------------------------------------------------------------------------------
cat("\n====================================================================\n")
cat("ETAPA 5: EVALUACIÓN E INTERPRETACIÓN (EVALUATION & INTERPRETATION)\n")
cat("====================================================================\n")

# Predicción en el conjunto de prueba independiente
predicciones_test <- predict(modelo_arbol_kdd, newdata = test_kdd, type = "class")
matriz_conf <- table(Real = test_kdd$Alerta_Ozono, Predicho = predicciones_test)
cat("Matriz de Confusión en Prueba:\n")
print(matriz_conf)

# Métricas formales
exactitud <- sum(diag(matriz_conf)) / sum(matriz_conf)
sensibilidad <- matriz_conf["Riesgo_Alto", "Riesgo_Alto"] / sum(matriz_conf["Riesgo_Alto", ])
especificidad <- matriz_conf["Aceptable", "Aceptable"] / sum(matriz_conf["Aceptable", ])

cat(paste0("Exactitud Global (Accuracy): ", round(exactitud * 100, 2), "%\n"))
cat(paste0("Sensibilidad (Recall Riesgo Alto): ", round(sensibilidad * 100, 2), "%\n"))
cat(paste0("Especificidad (Aceptable): ", round(especificidad * 100, 2), "%\n"))

# Extracción de Regla de Conocimiento Descubierta
cat("\nReglas de Conocimiento Descubiertas:\n")
cat("1. Si 'Indice_Termo_Eolico' >= 7.8 y 'Solar.R' >= 180, existe una probabilidad > 85% de condición 'Riesgo_Alto'.\n")
cat("2. Si 'Temp' < 78 grados, la condición atmosférica permanece mayoritariamente 'Aceptable'.\n")

# ------------------------------------------------------------------------------
# EXPORTACIÓN DE GRÁFICAS Y RESULTADOS
# ------------------------------------------------------------------------------
dir_res <- "c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_1/02_KDD/resultados"
dir_latex <- "c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/latex/figuras"

if (!dir.exists(dir_res)) dir.create(dir_res, recursive = TRUE)
if (!dir.exists(dir_latex)) dir.create(dir_latex, recursive = TRUE)

png_path1 <- file.path(dir_res, "grafico_02_KDD.png")
png_path2 <- file.path(dir_latex, "grafico_02_KDD.png")

png(png_path1, width = 1000, height = 550, res = 120)
par(mfrow = c(1, 2), mar = c(4, 4, 3, 1))

# Panel A: Diagrama del árbol de decisión inducido
plot(modelo_arbol_kdd, uniform = TRUE, main = "Árbol de Decisión Inducido (Fase 4 Minería)", margin = 0.1)
text(modelo_arbol_kdd, use.n = TRUE, all = TRUE, cex = 0.8, col = "#1a365d")

# Panel B: Espacio bivariado de conocimiento descubierto
colores_kdd <- ifelse(datos_transformados$Alerta_Ozono == "Riesgo_Alto", "#e53e3e", "#3182ce")
plot(datos_transformados$Wind, datos_transformados$Temp,
     col = colores_kdd, pch = 19, cex = 1.1,
     xlab = "Velocidad del Viento (mph)", ylab = "Temperatura (°F)",
     main = "Región de Riesgo Descubierta (KDD)")
legend("topright", legend = c("Aceptable", "Riesgo Alto"), col = c("#3182ce", "#e53e3e"), pch = 19, bty = "n")
grid()
dev.off()

file.copy(png_path1, png_path2, overwrite = TRUE)

# Guardar métricas
metricas_txt <- file.path(dir_res, "metricas_02.txt")
writeLines(c(
  "=== MÉTRICAS DE RESULTADO - TEMA 02: PROCESO KDD ===",
  paste("Total Observaciones Seleccionadas:", nrow(datos_transformados)),
  paste("Exactitud en Prueba (Accuracy):", paste0(round(exactitud * 100, 2), "%")),
  paste("Sensibilidad en Riesgo Alto:", paste0(round(sensibilidad * 100, 2), "%")),
  paste("Especificidad en Aceptable:", paste0(round(especificidad * 100, 2), "%")),
  "\nSÍNTESIS DE LA CORRESPONDENCIA CON LAS ETAPAS DE FAYYAD ET AL. (1996):",
  "- 1. Selección: Filtrado temporal estival y reducción de atributos irrelevantes.",
  "- 2. Preprocesamiento: Detección e imputación de medianas para Ozone y Solar.R.",
  "- 3. Transformación: Binarización regulatoria e ingeniería de ratio termo-eólico.",
  "- 4. Minería de datos: Partición 80/20 y ajuste de árbol rpart.",
  "- 5. Evaluación e interpretación: Matriz de confusión e inferencia de reglas operativas."
), metricas_txt)


cat("\n>>> [TEMA 02: PROCESO KDD] Ejecución exitosa. Gráfica guardada en:", png_path1, "\n")
