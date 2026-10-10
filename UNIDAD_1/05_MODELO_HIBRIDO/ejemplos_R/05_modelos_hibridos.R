# ==============================================================================
# TEMA 05: MODELOS HÍBRIDOS
# SCRIPT: 05_modelos_hibridos_run.R
# OBJETIVO: Implementación de una arquitectura predictiva híbrida bi-etapa:
#           Etapa 1: Aprendizaje No Supervisado (Clustering K-Means para
#                    segmentar el espacio en sub-regímenes homogéneos).
#           Etapa 2: Aprendizaje Supervisado Especializado (Modelos locales por clúster).
#           Inferencia: Enrutamiento por distancia a centroides + Clasificación local.
#           Demostración cuantitativa de la ventaja del modelo híbrido vs modelo global.
# ==============================================================================

set.seed(555)
library(rpart)

cat(">>> [TEMA 05: MODELOS HÍBRIDOS] Iniciando experimento de arquitectura híbrida...\n\n")

# 1. GENERACIÓN DE DATOS CON POBLACIONES HETEROGÉNEAS (2 REGÍMENES DE COMPORTAMIENTO)
n_grupo <- 450

# Régimen A: Clientes tipo "Retail Masivo" (Alta frecuencia, bajo ticket promedio)
frecuencia_A <- rnorm(n_grupo, mean = 25, sd = 4)
ticket_A     <- rnorm(n_grupo, mean = 40, sd = 8)
# En Régimen A, el riesgo depende fuertemente de caídas drásticas en frecuencia
riesgo_A     <- rbinom(n_grupo, size = 1, prob = 1 / (1 + exp(-(-3.5 + 0.15 * (30 - frecuencia_A)))))

# Régimen B: Clientes tipo "Corporativo / Premium" (Baja frecuencia, alto ticket promedio)
frecuencia_B <- rnorm(n_grupo, mean = 6, sd = 2)
ticket_B     <- rnorm(n_grupo, mean = 350, sd = 60)
# En Régimen B, el riesgo depende casi exclusivamente de fluctuaciones en el ticket
riesgo_B     <- rbinom(n_grupo, size = 1, prob = 1 / (1 + exp(-(-2.8 + 0.015 * (400 - ticket_B)))))

# Unión de la población heterogénea
datos_hibridos <- data.frame(
  Frecuencia = c(frecuencia_A, frecuencia_B),
  Ticket = c(ticket_A, ticket_B),
  Riesgo = factor(c(riesgo_A, riesgo_B), levels = c(0, 1), labels = c("Bajo", "Alto"))
)

cat("Población sintética generada: 900 casos con dos regímenes ocultos de comportamiento.\n")

# 2. PARTICIÓN DE ENTRENAMIENTO (75%) Y PRUEBA (25%)
idx_train <- sample(1:nrow(datos_hibridos), size = 0.75 * nrow(datos_hibridos))
train_data <- datos_hibridos[idx_train, ]
test_data  <- datos_hibridos[-idx_train, ]

# ------------------------------------------------------------------------------
# ENFOQUE 1: MODELO CONVENCIONAL GLOBAL ÚNICO (Línea Base)
# ------------------------------------------------------------------------------
cat("\n--- 1. Entrenando Modelo Convencional Global (Árbol rpart global) ---\n")
modelo_global <- rpart(Riesgo ~ Frecuencia + Ticket, data = train_data, method = "class")
pred_global <- predict(modelo_global, newdata = test_data, type = "class")
matriz_global <- table(Real = test_data$Riesgo, Pred = pred_global)
acc_global <- sum(diag(matriz_global)) / sum(matriz_global)
cat("Exactitud (Accuracy) Modelo Global Único:", round(acc_global * 100, 2), "%\n")

# ------------------------------------------------------------------------------
# ENFOQUE 2: ARQUITECTURA HÍBRIDA (CLUSTERING + CLASIFICADORES LOCALES)
# ------------------------------------------------------------------------------
cat("\n--- 2. Implementando Arquitectura Híbrida Bi-Etapa ---\n")
cat("Etapa 2.1: Clustering No Supervisado K-Means (k = 2) en entrenamiento...\n")

# Estandarización para el clustering
media_scale <- colMeans(train_data[, c("Frecuencia", "Ticket")])
sd_scale    <- apply(train_data[, c("Frecuencia", "Ticket")], 2, sd)

train_esc <- scale(train_data[, c("Frecuencia", "Ticket")], center = media_scale, scale = sd_scale)
km_hibrido <- kmeans(train_esc, centers = 2, nstart = 25)

train_data$Cluster_Asignado <- km_hibrido$cluster
cat("Distribución de observaciones por clúster:", table(train_data$Cluster_Asignado), "\n")

cat("Etapa 2.2: Entrenamiento de Modelos Especializados por cada Clúster...\n")
# Modelo Local 1 (Especializado en Cluster 1)
datos_c1 <- train_data[train_data$Cluster_Asignado == 1, ]
mod_local_1 <- glm(Riesgo ~ Frecuencia + Ticket, data = datos_c1, family = binomial)

# Modelo Local 2 (Especializado en Cluster 2)
datos_c2 <- train_data[train_data$Cluster_Asignado == 2, ]
mod_local_2 <- glm(Riesgo ~ Frecuencia + Ticket, data = datos_c2, family = binomial)

# ------------------------------------------------------------------------------
# INFERENCIA DEL MODELO HÍBRIDO EN EL CONJUNTO DE PRUEBA
# ------------------------------------------------------------------------------
cat("\nEtapa 2.3: Inferencia Híbrida en Conjunto de Prueba...\n")
# 1) Asignar cada caso de prueba al centroide de clúster más cercano
test_esc <- scale(test_data[, c("Frecuencia", "Ticket")], center = media_scale, scale = sd_scale)
dist_c1 <- rowSums((test_esc - matrix(km_hibrido$centers[1, ], nrow = nrow(test_esc), ncol = 2, byrow = TRUE))^2)
dist_c2 <- rowSums((test_esc - matrix(km_hibrido$centers[2, ], nrow = nrow(test_esc), ncol = 2, byrow = TRUE))^2)
test_cluster <- ifelse(dist_c1 <= dist_c2, 1, 2)

# 2) Aplicar el modelo especializado respectivo
pred_prob_hibrido <- numeric(nrow(test_data))
for (i in 1:nrow(test_data)) {
  sub_caso <- test_data[i, c("Frecuencia", "Ticket")]
  if (test_cluster[i] == 1) {
    pred_prob_hibrido[i] <- predict(mod_local_1, newdata = sub_caso, type = "response")
  } else {
    pred_prob_hibrido[i] <- predict(mod_local_2, newdata = sub_caso, type = "response")
  }
}

pred_hibrido <- factor(ifelse(pred_prob_hibrido >= 0.5, "Alto", "Bajo"), levels = c("Bajo", "Alto"))
matriz_hibrido <- table(Real = test_data$Riesgo, Pred = pred_hibrido)
acc_hibrido <- sum(diag(matriz_hibrido)) / sum(matriz_hibrido)

cat("Exactitud (Accuracy) Modelo Híbrido Bi-Etapa:", round(acc_hibrido * 100, 2), "%\n")
cat("Diferencia de Rendimiento:", round((acc_hibrido - acc_global) * 100, 2), "puntos porcentuales a favor del modelo híbrido.\n")

# ------------------------------------------------------------------------------
# GENERACIÓN DE GRÁFICAS COMPARATIVAS
# ------------------------------------------------------------------------------
dir_res <- "c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_1/05_MODELO_HIBRIDO/resultados"
dir_latex <- "c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/latex/figuras"

if (!dir.exists(dir_res)) dir.create(dir_res, recursive = TRUE)
if (!dir.exists(dir_latex)) dir.create(dir_latex, recursive = TRUE)

png_path1 <- file.path(dir_res, "grafico_05_modelos_hibridos.png")
png_path2 <- file.path(dir_latex, "grafico_05_modelos_hibridos.png")

png(png_path1, width = 1000, height = 500, res = 120)
par(mfrow = c(1, 2), mar = c(4, 4, 3, 1))

# Panel A: Segmentación en el espacio de características
col_clust <- ifelse(train_data$Cluster_Asignado == 1, "#3182ce", "#dd6b20")
plot(train_data$Frecuencia, train_data$Ticket,
     col = col_clust, pch = ifelse(train_data$Riesgo == "Alto", 17, 16),
     xlab = "Frecuencia de Compra", ylab = "Ticket Promedio ($)",
     main = "Etapa 1: Segmentación Espacial por Clúster")
legend("topright", legend = c("Clúster 1 (Retail)", "Clúster 2 (Corp)", "Riesgo Alto (Triángulo)"),
       col = c("#3182ce", "#dd6b20", "black"), pch = c(16, 16, 17), bty = "n")
grid()

# Panel B: Comparativa de Rendimiento
barplot(c(acc_global * 100, acc_hibrido * 100),
        names.arg = c("Modelo Global Único", "Modelo Híbrido Bi-Etapa"),
        col = c("#a0aec0", "#38a169"), ylim = c(0, 100),
        ylab = "Exactitud en Prueba (%)",
        main = "Ventaja Cuantitativa de la Hibridación")
grid(nx = NA, ny = NULL)
dev.off()

file.copy(png_path1, png_path2, overwrite = TRUE)

metricas_txt <- file.path(dir_res, "metricas_05.txt")
writeLines(c(
  "=== MÉTRICAS DE RESULTADO - TEMA 05: MODELOS HÍBRIDOS ===",
  paste("Exactitud Modelo Convencional Global:", paste0(round(acc_global * 100, 2), "%")),
  paste("Exactitud Modelo Híbrido Bi-Etapa:", paste0(round(acc_hibrido * 100, 2), "%")),
  paste("Mejora Absoluta de Rendimiento:", paste0(round((acc_hibrido - acc_global) * 100, 2), "%")),
  "\nJUSTIFICACIÓN Y VENTAJA DEL ENFOQUE HÍBRIDO:",
  "1. ¿Por qué es híbrido?: Combina dos paradigmas ontológicos distintos: aprendizaje no supervisado (K-Means) para descomponer la complejidad de la distribución, y aprendizaje supervisado paramétrico (Regresión Logística) para la toma de decisiones local.",
  "2. Ventaja teórica: Rompe la maldición de la heterogeneidad de datos. Un modelo global único se ve obligado a promediar dinámicas divergentes, mientras que el modelo híbrido entrena estimadores locales óptimos para cada sub-régimen."
), metricas_txt)

# EXPORTAR MÉTRICAS ESTRUCTURADAS (JSON)
source("c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/ejemplos_R/utils_json.R")
baseline_u105 <- round(max(table(test_data$Riesgo)) / nrow(test_data) * 100, 2)
acc_glob_pct <- round(acc_global * 100, 2)
acc_hib_pct  <- round(acc_hibrido * 100, 2)

modelos_json_u105 <- list(
  list(
    modelo = "Árbol CART Global Único",
    tecnica = "rpart global",
    exactitud = acc_glob_pct,
    supera_baseline = acc_glob_pct > baseline_u105
  ),
  list(
    modelo = "Modelo Híbrido Bi-Etapa",
    tecnica = "K-Means (k=2) + GLM locales",
    exactitud = acc_hib_pct,
    supera_baseline = acc_hib_pct > baseline_u105
  )
)

metricas_json_data <- list(
  estado = "ok",
  tema_id = "U1-05",
  tipo_tarea = "clasificacion",
  dataset = "Población sintética de 900 casos con dos regímenes ocultos generada en memoria (675 train / 225 test)",
  dataset_origen = "sintetico",
  origen_metricas = "calculadas_script",
  fecha_ejecucion = as.character(Sys.time()),
  archivos_graficos = c("grafico_05_modelos_hibridos.png"),
  baseline_mayoritaria = baseline_u105,
  supera_baseline = acc_hib_pct > baseline_u105,
  metricas = list(
    exactitud_global = acc_glob_pct,
    exactitud_hibrido = acc_hib_pct,
    mejora_absoluta = round((acc_hibrido - acc_global) * 100, 2)
  ),
  modelos = modelos_json_u105,
  interpretacion = "1. ¿Por qué es híbrido?: Combina dos paradigmas ontológicos distintos: aprendizaje no supervisado (K-Means) para descomponer la complejidad de la distribución, y aprendizaje supervisado paramétrico (Regresión Logística) para la toma de decisiones local.\n2. Ventaja teórica: Rompe la maldición de la heterogeneidad de datos. Un modelo global único se ve obligado a promediar dinámicas divergentes, mientras que el modelo híbrido entrena estimadores locales óptimos para cada sub-régimen."
)
guardar_metricas_json(metricas_json_data, file.path(dir_res, "metricas.json"))

cat("\n>>> [TEMA 05: MODELOS HÍBRIDOS] Ejecución exitosa. Gráfica guardada en:", png_path1, "\n")
