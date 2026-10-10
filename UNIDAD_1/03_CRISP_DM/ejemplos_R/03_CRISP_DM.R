# ==============================================================================
# TEMA 03: METODOLOGÍA CRISP / CRISP-DM
# SCRIPT: 03_CRISP_DM_run.R
# OBJETIVO: Implementación práctica estructurada siguiendo rigurosamente las
#           6 fases canónicas del consorcio CRISP-DM (Chapman et al., 2000):
#           1. Business Understanding (Comprensión del Negocio)
#           2. Data Understanding (Comprensión de los Datos)
#           3. Data Preparation (Preparación de los Datos)
#           4. Modeling (Modelado)
#           5. Evaluation (Evaluación)
#           6. Deployment (Despliegue Operativo)
# ==============================================================================

set.seed(789)

cat(">>> [TEMA 03: METODOLOGÍA CRISP-DM] Iniciando ciclo de vida analítico...\n\n")

# ------------------------------------------------------------------------------
# FASE 1: COMPRENSIÓN DEL NEGOCIO (BUSINESS UNDERSTANDING)
# ------------------------------------------------------------------------------
cat("====================================================================\n")
cat("FASE 1: COMPRENSIÓN DEL NEGOCIO (BUSINESS UNDERSTANDING)\n")
cat("====================================================================\n")
cat("Objetivo de Negocio: Reducir la tasa de fuga de clientes (Churn) en un servicio financiero.\n")
cat("Impacto Financiero: El coste de retener a un cliente en riesgo es de 50 USD;\n")
cat("                    el coste de perder a un cliente no detectado es de 300 USD.\n")
cat("Objetivo de Minería: Construir un modelo probabilístico calibrado P(Fuga=1) que permita\n")
cat("                     asignar recursos de retención al top de clientes con mayor riesgo.\n")

# ------------------------------------------------------------------------------
# FASE 2: COMPRENSIÓN DE LOS DATOS (DATA UNDERSTANDING)
# ------------------------------------------------------------------------------
cat("\n====================================================================\n")
cat("FASE 2: COMPRENSIÓN DE LOS DATOS (DATA UNDERSTANDING)\n")
cat("====================================================================\n")
# Simulación representativa basada en distribuciones empíricas de banca minorista (N = 1000)
n_clientes <- 1000
antiguedad_meses <- round(runif(n_clientes, 6, 72))
saldo_medio      <- round(rnorm(n_clientes, mean = 3500, sd = 1200))
num_reclamos     <- rpois(n_clientes, lambda = 1.2)
canal_digital    <- rbinom(n_clientes, size = 1, prob = 0.65)

# Probabilidad latente de deserción en función de las variables
logit_fuga <- -1.8 - 0.03 * (antiguedad_meses - 36) - 0.0004 * (saldo_medio - 3500) +
  0.65 * num_reclamos - 0.5 * canal_digital
prob_real <- 1 / (1 + exp(-logit_fuga))
fuga_cliente <- rbinom(n_clientes, size = 1, prob = prob_real)

datos_banca <- data.frame(
  ID_Cliente = paste0("CLI_", 1001:(1000 + n_clientes)),
  Antiguedad = antiguedad_meses,
  Saldo = saldo_medio,
  Reclamos = num_reclamos,
  Digital = canal_digital,
  Fuga = fuga_cliente
)

cat("Estructura de la base de datos de clientes generada:\n")
str(datos_banca)
cat("\nDistribución de clientes fugados en el histórico:\n")
print(table(Fuga = datos_banca$Fuga))
cat("Tasa basal de fuga (Churn Rate):", round(mean(datos_banca$Fuga) * 100, 2), "%\n")

# ------------------------------------------------------------------------------
# FASE 3: PREPARACIÓN DE LOS DATOS (DATA PREPARATION)
# ------------------------------------------------------------------------------
cat("\n====================================================================\n")
cat("FASE 3: PREPARACIÓN DE LOS DATOS (DATA PREPARATION)\n")
cat("====================================================================\n")
# Partición formal estratificada 75% Entrenamiento / 25% Prueba
indices_fuga_0 <- which(datos_banca$Fuga == 0)
indices_fuga_1 <- which(datos_banca$Fuga == 1)

train_idx <- c(
  sample(indices_fuga_0, size = round(0.75 * length(indices_fuga_0))),
  sample(indices_fuga_1, size = round(0.75 * length(indices_fuga_1)))
)

train_crisp <- datos_banca[train_idx, ]
test_crisp  <- datos_banca[-train_idx, ]

cat("Dimensión Entrenamiento (Train):", nrow(train_crisp), "registros.\n")
cat("Dimensión Prueba (Test):", nrow(test_crisp), "registros.\n")

# ------------------------------------------------------------------------------
# FASE 4: MODELADO (MODELING)
# ------------------------------------------------------------------------------
cat("\n====================================================================\n")
cat("FASE 4: MODELADO (MODELING)\n")
cat("====================================================================\n")
# Estimación mediante Regresión Logística Binomial
modelo_logit <- glm(Fuga ~ Antiguedad + Saldo + Reclamos + Digital,
                    data = train_crisp, family = binomial(link = "logit"))

cat("Resumen estadístico del modelo de regresión logística:\n")
print(summary(modelo_logit))

# Odds Ratios (Razón de Momios) e intervalos de confianza
cat("\nOdds Ratios (OR) estimados:\n")
print(exp(coef(modelo_logit)))

# ------------------------------------------------------------------------------
# FASE 5: EVALUACIÓN (EVALUATION)
# ------------------------------------------------------------------------------
cat("\n====================================================================\n")
cat("FASE 5: EVALUACIÓN (EVALUATION)\n")
cat("====================================================================\n")
# Inferencia probabilística en el conjunto de prueba
prob_pred_test <- predict(modelo_logit, newdata = test_crisp, type = "response")

# Construcción de la Curva ROC empírica y cálculo de AUC
umbrales <- seq(0, 1, by = 0.01)
tpr <- numeric(length(umbrales))
fpr <- numeric(length(umbrales))

for (i in seq_along(umbrales)) {
  th <- umbrales[i]
  pred_bin <- ifelse(prob_pred_test >= th, 1, 0)
  tp <- sum(pred_bin == 1 & test_crisp$Fuga == 1)
  fp <- sum(pred_bin == 1 & test_crisp$Fuga == 0)
  fn <- sum(pred_bin == 0 & test_crisp$Fuga == 1)
  tn <- sum(pred_bin == 0 & test_crisp$Fuga == 0)

  tpr[i] <- tp / (tp + fn)
  fpr[i] <- fp / (fp + tn)
}

# Integración numérica trapezoidal del AUC
auc <- abs(sum(diff(fpr) * (tpr[-1] + tpr[-length(tpr)]) / 2))

# Selección de umbral óptimo por coste económico (Matriz de Pérdidas de Negocio)
# Coste Total = (Falsos Positivos * 50) + (Falsos Negativos * 300)
costes_negocio <- numeric(length(umbrales))
for (i in seq_along(umbrales)) {
  th <- umbrales[i]
  pred_bin <- ifelse(prob_pred_test >= th, 1, 0)
  fp <- sum(pred_bin == 1 & test_crisp$Fuga == 0)
  fn <- sum(pred_bin == 0 & test_crisp$Fuga == 1)
  costes_negocio[i] <- (fp * 50) + (fn * 300)
}
umbral_optimo <- umbrales[which.min(costes_negocio)]

cat("Área bajo la Curva ROC (AUC):", round(auc, 4), "\n")
cat("Umbral de Decisión Óptimo por Coste:", umbral_optimo, "(Coste mínimo:", min(costes_negocio), "USD)\n")

# Matriz de Confusión evaluada en el umbral óptimo
pred_final_test <- ifelse(prob_pred_test >= umbral_optimo, 1, 0)
matriz_crisp <- table(Real = test_crisp$Fuga, Predicho = pred_final_test)
cat("\nMatriz de Confusión en Prueba (Umbral =", umbral_optimo, "):\n")
print(matriz_crisp)

acc_crisp <- sum(diag(matriz_crisp)) / sum(matriz_crisp)
cat("Exactitud Global:", round(acc_crisp * 100, 2), "%\n")

# ------------------------------------------------------------------------------
# FASE 6: DESPLIEGUE (DEPLOYMENT)
# ------------------------------------------------------------------------------
cat("\n====================================================================\n")
cat("FASE 6: DESPLIEGUE (DEPLOYMENT)\n")
cat("====================================================================\n")
cat("Construcción de la función de inferencia para producción (API / Servicio de Scoring):\n")

servicio_scoring_crisp <- function(antiguedad, saldo, reclamos, digital, umbral = umbral_optimo) {
  nuevo_df <- data.frame(
    Antiguedad = antiguedad,
    Saldo = saldo,
    Reclamos = reclamos,
    Digital = digital
  )
  prob <- predict(modelo_logit, newdata = nuevo_df, type = "response")
  decision <- ifelse(prob >= umbral, "RIESGO_ALTO - ACCIÓN DE RETENCIÓN", "RIESGO_BAJO - MANTENER FLUJO REGULAR")

  return(list(
    Probabilidad_Fuga = round(as.numeric(prob), 4),
    Umbral_Utilizado = umbral,
    Diagnostico = decision,
    Accion_Sugerida = ifelse(prob >= umbral, "Asignar ejecutivo prioritario y oferta de descuento en comisiones", "Envío ordinario de estados de cuenta")
  ))
}

# Simulación de despliegue con dos clientes nuevos en tiempo real
cat("\n[Simulación Producción] Evaluación de Cliente A (4 reclamos, bajo saldo):\n")
print(servicio_scoring_crisp(antiguedad = 12, saldo = 1200, reclamos = 4, digital = 0))

cat("\n[Simulación Producción] Evaluación de Cliente B (cliente fidelizado sin reclamos):\n")
print(servicio_scoring_crisp(antiguedad = 60, saldo = 8500, reclamos = 0, digital = 1))

# ------------------------------------------------------------------------------
# EXPORTACIÓN DE GRÁFICAS Y DOCUMENTACIÓN
# ------------------------------------------------------------------------------
dir_res <- "c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_1/03_CRISP_DM/resultados"
dir_latex <- "c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/latex/figuras"

if (!dir.exists(dir_res)) dir.create(dir_res, recursive = TRUE)
if (!dir.exists(dir_latex)) dir.create(dir_latex, recursive = TRUE)

png_path1 <- file.path(dir_res, "grafico_03_CRISP_DM.png")
png_path2 <- file.path(dir_latex, "grafico_03_CRISP_DM.png")

png(png_path1, width = 1000, height = 500, res = 120)
par(mfrow = c(1, 2), mar = c(4, 4, 3, 1))

# Panel A: Curva ROC
plot(fpr, tpr, type = "l", lwd = 2.5, col = "#2b6cb0",
     xlab = "Tasa de Falsos Positivos (1 - Especificidad)",
     ylab = "Tasa de Verdaderos Positivos (Sensibilidad)",
     main = paste0("Curva ROC (Fase 5 Evaluación) | AUC = ", round(auc, 3)))
abline(a = 0, b = 1, lty = 2, col = "gray50")
grid()

# Panel B: Curva de Optimización de Costes de Negocio
plot(umbrales, costes_negocio, type = "l", lwd = 2.5, col = "#c53030",
     xlab = "Umbral de Probabilidad de Corte",
     ylab = "Pérdida Económica Total Estimada ($ USD)",
     main = paste0("Optimización de Costes | Corte Óptimo = ", umbral_optimo))
abline(v = umbral_optimo, lty = 2, col = "#2f855a", lwd = 2)
grid()
dev.off()

file.copy(png_path1, png_path2, overwrite = TRUE)

metricas_txt <- file.path(dir_res, "metricas_03.txt")
writeLines(c(
  "=== MÉTRICAS DE RESULTADO - TEMA 03: CRISP-DM ===",
  paste("AUC (Área bajo la Curva ROC):", round(auc, 4)),
  paste("Exactitud Global (Accuracy):", paste0(round(acc_crisp * 100, 2), "%")),
  paste("Umbral de Decisión Óptimo por Coste:", umbral_optimo),
  paste("Coste Económico Mínimo:", paste0(min(costes_negocio), " USD")),
  "\nTRAZABILIDAD CON LAS 6 FASES DE CRISP-DM (Chapman et al., 2000):",
  "- 1. Business Understanding: Cuantificación del coste de retención ($50) vs pérdida ($300).",
  "- 2. Data Understanding: Inspección de variables predictoras de cartera de clientes.",
  "- 3. Data Preparation: Partición estratificada 75/25 para entrenamiento y prueba.",
  "- 4. Modeling: Ajuste de regresión logística e inferencia de Odds Ratios.",
  "- 5. Evaluation: Generación de Curva ROC (AUC) y calibración económica del umbral.",
  "- 6. Deployment: Función exportable servicio_scoring_crisp() para inferencia en producción."
), metricas_txt)


cat("\n>>> [TEMA 03: CRISP-DM] Ejecución exitosa. Gráfica guardada en:", png_path1, "\n")
