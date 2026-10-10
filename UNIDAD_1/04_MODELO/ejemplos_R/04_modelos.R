# ==============================================================================
# TEMA 04: MODELOS DE MINERÍA Y APRENDIZAJE AUTOMÁTICO
# SCRIPT: 04_modelos_run.R
# OBJETIVO: Implementación, entrenamiento, validación comparativa e interpretación
#           de múltiples familias de modelos sobre el mismo conjunto experimental:
#           1. Regresión Logística (GLM - Paramétrico lineal)
#           2. Árbol de Decisión (CART - rpart, No paramétrico interpretable)
#           3. K-Vecinos Más Cercanos (k-NN - class, Basado en instancias)
#           4. Análisis Discriminante Lineal (LDA - MASS, Probabilístico gaussiano)
# ==============================================================================

set.seed(321)
library(rpart)
library(class)
library(MASS)

cat(">>> [TEMA 04: MODELOS] Iniciando benchmark comparativo multimodelo...\n\n")

# 1. GENERACIÓN / PREPARACIÓN DEL CONJUNTO EXPERIMENTAL (Riesgo Cardiovascular)
n <- 800
edad       <- round(rnorm(n, mean = 55, sd = 10))
presion    <- round(rnorm(n, mean = 135, sd = 18))
colesterol <- round(rnorm(n, mean = 220, sd = 35))
glucosa    <- round(rnorm(n, mean = 105, sd = 25))
tabaquismo <- rbinom(n, size = 1, prob = 0.3)

# Función balanceada generadora de riesgo (~40% prevalencia)
z <- -0.5 + 0.05 * (edad - 55) + 0.03 * (presion - 135) + 0.015 * (colesterol - 220) +
  0.03 * (glucosa - 105) + 0.9 * tabaquismo
prob_evento <- 1 / (1 + exp(-z))
diagnostico <- rbinom(n, size = 1, prob = prob_evento)

datos_modelos <- data.frame(
  Edad = edad,
  Presion = presion,
  Colesterol = colesterol,
  Glucosa = glucosa,
  Tabaquismo = tabaquismo,
  Diagnostico = factor(diagnostico, levels = c(0, 1), labels = c("Sano", "Patologia"))
)

cat("Dataset clínico para modelado (Variables predictoras continuas y binarias):\n")
print(head(datos_modelos, 4))
cat("Prevalencia de Patología:", round(mean(diagnostico) * 100, 2), "%\n")

# 2. PARTICIÓN DE ENTRENAMIENTO (75%) Y PRUEBA (25%)
indices_entrenamiento <- sample(1:n, size = 0.75 * n)
train_df <- datos_modelos[indices_entrenamiento, ]
test_df  <- datos_modelos[-indices_entrenamiento, ]

cat("\nObservaciones Entrenamiento:", nrow(train_df), "| Observaciones Prueba:", nrow(test_df), "\n\n")

# Función auxiliar para calcular métricas completas a partir de tabla de confusión
calcular_metricas <- function(real, predicho, nombre_modelo) {
  tabla <- table(Real = real, Pred = predicho)
  tp <- ifelse("Patologia" %in% rownames(tabla) && "Patologia" %in% colnames(tabla), tabla["Patologia", "Patologia"], 0)
  tn <- ifelse("Sano" %in% rownames(tabla) && "Sano" %in% colnames(tabla), tabla["Sano", "Sano"], 0)
  fp <- ifelse("Sano" %in% rownames(tabla) && "Patologia" %in% colnames(tabla), tabla["Sano", "Patologia"], 0)
  fn <- ifelse("Patologia" %in% rownames(tabla) && "Sano" %in% colnames(tabla), tabla["Patologia", "Sano"], 0)

  accuracy    <- (tp + tn) / (tp + tn + fp + fn)
  precision   <- ifelse((tp + fp) > 0, tp / (tp + fp), 0)
  sensibility <- ifelse((tp + fn) > 0, tp / (tp + fn), 0)
  specificity <- ifelse((tn + fp) > 0, tn / (tn + fp), 0)
  f1_score    <- ifelse((precision + sensibility) > 0, 2 * (precision * sensibility) / (precision + sensibility), 0)

  data.frame(
    Modelo = nombre_modelo,
    Accuracy = round(accuracy, 4),
    Precision = round(precision, 4),
    Recall_Sensibilidad = round(sensibility, 4),
    Especificidad = round(specificity, 4),
    F1_Score = round(f1_score, 4),
    stringsAsFactors = FALSE
  )
}

# ------------------------------------------------------------------------------
# MODELO 1: REGRESIÓN LOGÍSTICA (GLM)
# ------------------------------------------------------------------------------
cat("--- 1. Entrenando Modelo 1: Regresión Logística (GLM) ---\n")
mod_glm <- glm(Diagnostico ~ Edad + Presion + Colesterol + Glucosa + Tabaquismo,
               data = train_df, family = binomial)
pred_prob_glm <- predict(mod_glm, newdata = test_df, type = "response")
pred_class_glm <- factor(ifelse(pred_prob_glm >= 0.5, "Patologia", "Sano"), levels = c("Sano", "Patologia"))
res_glm <- calcular_metricas(test_df$Diagnostico, pred_class_glm, "Regresion Logistica")

# ------------------------------------------------------------------------------
# MODELO 2: ÁRBOL DE DECISIÓN (CART - rpart)
# ------------------------------------------------------------------------------
cat("--- 2. Entrenando Modelo 2: Árbol de Decisión CART (rpart) ---\n")
mod_tree <- rpart(Diagnostico ~ Edad + Presion + Colesterol + Glucosa + Tabaquismo,
                  data = train_df, method = "class", control = rpart.control(cp = 0.015))
pred_class_tree <- predict(mod_tree, newdata = test_df, type = "class")
res_tree <- calcular_metricas(test_df$Diagnostico, pred_class_tree, "Arbol Decision CART")

# ------------------------------------------------------------------------------
# MODELO 3: K-VECINOS MÁS CERCANOS (k-NN)
# ------------------------------------------------------------------------------
cat("--- 3. Entrenando Modelo 3: K-Nearest Neighbors (k-NN con k=7) ---\n")
# Para k-NN se estandarizan las variables cuantitativas
escalador <- function(x_train, x_test) {
  media <- colMeans(x_train)
  desv  <- apply(x_train, 2, sd)
  list(train = scale(x_train, center = media, scale = desv),
       test  = scale(x_test, center = media, scale = desv))
}
vars_knn <- c("Edad", "Presion", "Colesterol", "Glucosa", "Tabaquismo")
esc_knn <- escalador(train_df[, vars_knn], test_df[, vars_knn])
pred_class_knn <- knn(train = esc_knn$train, test = esc_knn$test, cl = train_df$Diagnostico, k = 7)
res_knn <- calcular_metricas(test_df$Diagnostico, pred_class_knn, "K-Nearest Neighbors (k=7)")

# ------------------------------------------------------------------------------
# MODELO 4: ANÁLISIS DISCRIMINANTE LINEAL (LDA)
# ------------------------------------------------------------------------------
cat("--- 4. Entrenando Modelo 4: Análisis Discriminante Lineal (LDA) ---\n")
mod_lda <- lda(Diagnostico ~ Edad + Presion + Colesterol + Glucosa + Tabaquismo, data = train_df)
pred_class_lda <- predict(mod_lda, newdata = test_df)$class
res_lda <- calcular_metricas(test_df$Diagnostico, pred_class_lda, "Analisis Discriminante (LDA)")

# ------------------------------------------------------------------------------
# COMPARACIÓN CONSOLIDADA DE RESULTADOS
# ------------------------------------------------------------------------------
tabla_comparativa <- rbind(res_glm, res_tree, res_knn, res_lda)
cat("\n====================================================================\n")
cat("MATRIZ DE BENCHMARKING COMPARATIVO EN CONJUNTO DE PRUEBA INDEPENDIENTE\n")
cat("====================================================================\n")
print(tabla_comparativa)

# ------------------------------------------------------------------------------
# GENERACIÓN DE GRÁFICAS COMPARATIVAS
# ------------------------------------------------------------------------------
dir_res <- "c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_1/04_MODELO/resultados"
dir_latex <- "c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/latex/figuras"

if (!dir.exists(dir_res)) dir.create(dir_res, recursive = TRUE)
if (!dir.exists(dir_latex)) dir.create(dir_latex, recursive = TRUE)

png_path1 <- file.path(dir_res, "grafico_04_modelos.png")
png_path2 <- file.path(dir_latex, "grafico_04_modelos.png")

png(png_path1, width = 1000, height = 500, res = 120)
par(mfrow = c(1, 2), mar = c(5, 6, 3, 1))

# Panel A: Barras de Exactitud y F1-Score
colores_modelos <- c("#2b6cb0", "#319795", "#d69e2e", "#805ad5")
bp <- barplot(
  t(as.matrix(tabla_comparativa[, c("Accuracy", "F1_Score")])),
  beside = TRUE,
  names.arg = c("Logit", "Árbol", "k-NN", "LDA"),
  col = c("#2b6cb0", "#48bb78"),
  ylim = c(0, 1),
  ylab = "Puntuación de Métrica (0 a 1)",
  main = "Comparativa de Desempeño Multimodelo"
)
legend("topright", legend = c("Exactitud (Accuracy)", "F1-Score"),
       fill = c("#2b6cb0", "#48bb78"), bty = "n")
grid(nx = NA, ny = NULL)

# Panel B: Importancia de Variables o Estructura del Árbol CART
plot(mod_tree, uniform = TRUE, main = "Reglas de Inducción CART (Modelo 2)", margin = 0.1)
text(mod_tree, use.n = TRUE, all = TRUE, cex = 0.8, col = "#2c5282")
dev.off()

file.copy(png_path1, png_path2, overwrite = TRUE)

metricas_txt <- file.path(dir_res, "metricas_04.txt")
writeLines(c(
  "=== MÉTRICAS DE RESULTADO - TEMA 04: MODELOS ===",
  paste("Mejor Modelo por Accuracy:", tabla_comparativa$Modelo[which.max(tabla_comparativa$Accuracy)],
        paste0("(", max(tabla_comparativa$Accuracy) * 100, "%)")),
  paste("Mejor Modelo por F1-Score:", tabla_comparativa$Modelo[which.max(tabla_comparativa$F1_Score)],
        paste0("(", max(tabla_comparativa$F1_Score), ")")),
  "\nSÍNTESIS E INTERPRETACIÓN TÉCNICA:",
  "- Regresión Logística y LDA obtienen métricas similares debido a la linealidad subyacente en el espacio logit.",
  "- El Árbol CART provee alta explicabilidad clínica mediante reglas explícitas de corte en Glucosa y Edad.",
  "- k-NN ofrece flexibilidad local pero es sensible a la escala dimensional y la elección de k."
), metricas_txt)

# EXPORTAR MÉTRICAS ESTRUCTURADAS (JSON)
source("c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/ejemplos_R/utils_json.R")
baseline_u104 <- round(max(table(test_df$Diagnostico)) / nrow(test_df) * 100, 2)
modelos_json <- lapply(1:nrow(tabla_comparativa), function(i) {
  acc_pct <- round(tabla_comparativa$Accuracy[i] * 100, 2)
  list(
    modelo = as.character(tabla_comparativa$Modelo[i]),
    accuracy = as.numeric(tabla_comparativa$Accuracy[i]),
    precision = as.numeric(tabla_comparativa$Precision[i]),
    recall_sensibilidad = as.numeric(tabla_comparativa$Recall_Sensibilidad[i]),
    especificidad = as.numeric(tabla_comparativa$Especificidad[i]),
    f1_score = as.numeric(tabla_comparativa$F1_Score[i]),
    supera_baseline = acc_pct > baseline_u104
  )
})
metricas_json_data <- list(
  estado = "ok",
  tema_id = "U1-04",
  tipo_tarea = "clasificacion",
  dataset = "Población clínica simulada de 800 casos generada por el script (600 train / 200 test)",
  dataset_origen = "sintetico",
  origen_metricas = "calculadas_script",
  fecha_ejecucion = as.character(Sys.time()),
  archivos_graficos = c("grafico_04_modelos.png"),
  baseline_mayoritaria = baseline_u104,
  supera_baseline = any(sapply(modelos_json, `[[`, "supera_baseline")),
  metricas = list(
    mejor_modelo_accuracy = list(
      modelo = as.character(tabla_comparativa$Modelo[which.max(tabla_comparativa$Accuracy)]),
      accuracy = max(tabla_comparativa$Accuracy)
    ),
    mejor_modelo_f1 = list(
      modelo = as.character(tabla_comparativa$Modelo[which.max(tabla_comparativa$F1_Score)]),
      f1_score = max(tabla_comparativa$F1_Score)
    )
  ),
  modelos = modelos_json,
  interpretacion = "- Regresión Logística y LDA obtienen métricas similares debido a la linealidad subyacente en el espacio logit.\n- El Árbol CART provee alta explicabilidad clínica mediante reglas explícitas de corte en Glucosa y Edad.\n- k-NN ofrece flexibilidad local pero es sensible a la escala dimensional y la elección de k."
)
guardar_metricas_json(metricas_json_data, file.path(dir_res, "metricas.json"))

cat("\n>>> [TEMA 04: MODELOS] Ejecución exitosa. Gráfica guardada en:", png_path1, "\n")
