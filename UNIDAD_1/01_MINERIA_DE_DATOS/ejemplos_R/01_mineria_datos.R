# ==============================================================================
# TEMA 01: MINERÍA DE DATOS
# SCRIPT: 01_mineria_datos_run.R
# OBJETIVO: Ejemplo didáctico y reproducible de minería de datos no supervisada:
#           Carga -> Exploración -> Preprocesamiento -> Clustering K-Means ->
#           Validación por Silueta -> Interpretación de Resultados.
# ==============================================================================

set.seed(123)

# 1. CARGA DE DATOS
cat(">>> [TEMA 01: MINERÍA DE DATOS] Iniciando ejecución...\n")
data(iris)
datos_raw <- iris

# 2. EXPLORACIÓN
cat("\n--- 1. Exploración Inicial del Dataset ---\n")
print(summary(datos_raw))
cat("Dimensiones:", nrow(datos_raw), "filas y", ncol(datos_raw), "columnas.\n")

# 3. LIMPIEZA Y PREPROCESAMIENTO
# La minería no supervisada no debe conocer la etiqueta de clase.
# Se extraen las 4 variables cuantitativas y se escalan (Z-Score)
# para evitar que variables con mayor varianza dominen el cálculo de distancias euclidianas.
datos_cuant <- datos_raw[, 1:4]
datos_escalados <- scale(datos_cuant)

cat("\n--- 2. Preprocesamiento: Estandarización Z-Score completada ---\n")
print(head(datos_escalados, 3))

# 4. APLICACIÓN DE TÉCNICA: K-MEANS CON SELECCIÓN DE K ÓPTIMO
# Método del Codo (Within-Cluster Sum of Squares - WCSS)
wcss <- numeric(10)
for (k in 1:10) {
  km_temp <- kmeans(datos_escalados, centers = k, nstart = 25)
  wcss[k] <- km_temp$tot.withinss
}

# Modelo final con k = 3
k_elegido <- 3
modelo_kmeans <- kmeans(datos_escalados, centers = k_elegido, nstart = 25)

# Cálculo de Coeficiente de Silueta para validar cohesión y separación
library(cluster)
sil <- silhouette(modelo_kmeans$cluster, dist(datos_escalados))
sil_promedio <- mean(sil[, 3])

cat("\n--- 3. Resultados de K-Means (k = 3) ---\n")
cat("Inercia Intra-cluster Total (WCSS):", modelo_kmeans$tot.withinss, "\n")
cat("Inercia Entre-cluster (BSS):", modelo_kmeans$betweenss, "\n")
cat("Ratio BSS / TSS (Varianza explicada):", round((modelo_kmeans$betweenss / modelo_kmeans$totss) * 100, 2), "%\n")
cat("Coeficiente de Silueta Promedio:", round(sil_promedio, 4), "\n")
cat("Tamaño de los clústeres:", modelo_kmeans$size, "\n")

# Matriz de centros de clústeres des-escalados a unidades originales
centros_originales <- aggregate(datos_cuant, by = list(Cluster = modelo_kmeans$cluster), mean)
cat("\nCentros de los Clústeres (Medias en unidades originales):\n")
print(centros_originales)

# 5. GENERACIÓN DE GRÁFICAS DE RESULTADOS
dir_res <- "c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_1/01_MINERIA_DE_DATOS/resultados"
dir_latex <- "c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/latex/figuras"

if (!dir.exists(dir_res)) dir.create(dir_res, recursive = TRUE)
if (!dir.exists(dir_latex)) dir.create(dir_latex, recursive = TRUE)

png_path1 <- file.path(dir_res, "grafico_01_mineria_datos.png")
png_path2 <- file.path(dir_latex, "grafico_01_mineria_datos.png")

# Guardar figura compuesta (2 paneles)
png(png_path1, width = 1000, height = 500, res = 120)
par(mfrow = c(1, 2), mar = c(4, 4, 3, 1))

# Panel A: Método del Codo
plot(1:10, wcss, type = "b", pch = 19, col = "#2b5c8f", lwd = 2,
     xlab = "Número de Clústeres (k)", ylab = "Suma de Cuadrados Intra-Cluster (WCSS)",
     main = "Método del Codo para Selección de k")
abline(v = 3, lty = 2, col = "#d9534f", lwd = 2)
grid()

# Panel B: Dispersión de Clústeres (PC1 vs PC2 o Longitud Pétalo vs Ancho Pétalo)
colores_cluster <- c("#3366cc", "#dc3912", "#ff9900")
plot(datos_cuant$Petal.Length, datos_cuant$Petal.Width,
     col = colores_cluster[modelo_kmeans$cluster], pch = 19, cex = 1.2,
     xlab = "Longitud del Pétalo (cm)", ylab = "Ancho del Pétalo (cm)",
     main = paste0("Segmentación K-Means (k=3) | Silueta: ", round(sil_promedio, 2)))
points(centros_originales$Petal.Length, centros_originales$Petal.Width,
       col = "black", pch = 8, cex = 2, lwd = 3)
legend("topleft", legend = paste("Clúster", 1:3), col = colores_cluster, pch = 19, bty = "n")
grid()
dev.off()

# Copiar a latex/figuras
file.copy(png_path1, png_path2, overwrite = TRUE)

# 6. EXPORTAR MÉTRICAS Y TABLAS
metricas_txt <- file.path(dir_res, "metricas_01.txt")
writeLines(c(
  "=== MÉTRICAS DE RESULTADO - TEMA 01: MINERÍA DE DATOS ===",
  paste("Algoritmo:", "K-Means Particional"),
  paste("Número de Clústeres (k):", k_elegido),
  paste("Varianza Explicada (BSS/TSS):", paste0(round((modelo_kmeans$betweenss / modelo_kmeans$totss) * 100, 2), "%")),
  paste("Coeficiente de Silueta Promedio:", round(sil_promedio, 4)),
  paste("Distribución por Clúster:", paste(modelo_kmeans$size, collapse = ", ")),
  "\nINTERPRETACIÓN:",
  "- El clúster 1 agrupa individuos con pétalos y sépalos reducidos (típicamente Setosa), perfectamente separable.",
  "- Los clústeres 2 y 3 representan individuos con morfologías intermedias y grandes, reflejando patrones naturales de diferenciación biológica sin supervisión humana."
), metricas_txt)

# 7. EXPORTAR MÉTRICAS ESTRUCTURADAS (JSON)
source("c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/ejemplos_R/utils_json.R")
metricas_json_data <- list(
  estado = "ok",
  tema_id = "U1-01",
  tipo_tarea = "clustering",
  dataset = "iris (Fisher, 1936 / datasets::iris)",
  dataset_origen = "real_completo",
  origen_metricas = "calculadas_script",
  fecha_ejecucion = as.character(Sys.time()),
  archivos_graficos = c("grafico_01_mineria_datos.png"),
  metricas = list(
    tecnica = "K-Means Particional",
    k_elegido = k_elegido,
    varianza_explicada = round((modelo_kmeans$betweenss / modelo_kmeans$totss) * 100, 2),
    coeficiente_silueta = round(sil_promedio, 4),
    distribucion_cluster = modelo_kmeans$size
  ),
  modelos = list(),
  baseline_mayoritaria = NULL,
  supera_baseline = NULL,
  interpretacion = "- El clúster 1 agrupa individuos con pétalos y sépalos reducidos (típicamente Setosa), perfectamente separable.\n- Los clústeres 2 y 3 representan individuos con morfologías intermedias y grandes, reflejando patrones naturales de diferenciación biológica sin supervisión humana."
)
guardar_metricas_json(metricas_json_data, file.path(dir_res, "metricas.json"))


cat(">>> [TEMA 01: MINERÍA DE DATOS] Ejecución completada exitosamente. Gráfica guardada en:", png_path1, "\n")
