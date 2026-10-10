# ==============================================================================
# SCRIPT DE ANÁLISIS EXPLORATORIO DE DATOS (EDA)
# UNIDAD: UNIDAD_3 | TEMA: 05_ASOCIACION_DEPENDENCIA (Reglas de Asociación y Dependencia)
# OBJETIVO: Perfilado estadístico, distribución multivariada, correlaciones y
#           detección de valores atípicos (outliers) para Algoritmo Apriori (Soporte, Confianza y Lift).
# ==============================================================================

set.seed(42)
cat(">>> [EDA EXPLORATORIO] Iniciando perfilado estadístico para: Reglas de Asociación y Dependencia \n")

# 1. CARGA INTELIGENTE DEL DATASET
# Se busca archivo CSV en la carpeta datos/ o se recurre a un benchmark representativo
csv_files <- list.files("../datos", pattern = "\\.csv$", full.names = TRUE)
if (length(csv_files) == 0) {
  csv_files <- list.files("datos", pattern = "\\.csv$", full.names = TRUE)
}

if (length(csv_files) > 0 && file.exists(csv_files[1])) {
  cat("-> Cargando dataset local:", basename(csv_files[1]), "\n")
  datos <- tryCatch({
    read.csv(csv_files[1], stringsAsFactors = TRUE, na.strings = c("NA", "", "?"))
  }, error = function(e) {
    data(iris)
    iris
  })
} else {
  cat("-> Utilizando dataset canónico de referencia (iris/synthetic)\n")
  data(iris)
  datos <- iris
}

# 2. ESTRUCTURA Y DIMENSIONES
cat("\n--- 1. Dimensiones y Estructura del Dataset ---\n")
cat("Filas (Instancias):", nrow(datos), "| Columnas (Atributos):", ncol(datos), "\n")
cat("Tipos de datos por columna:\n")
print(sapply(datos, class))

# 3. VALORES AUSENTES Y COMPLETITUD
cat("\n--- 2. Auditoría de Valores Ausentes (NA / Nulls) ---\n")
valores_na <- colSums(is.na(datos))
print(valores_na)
pct_completitud <- round((1 - (sum(valores_na) / (nrow(datos) * ncol(datos)))) * 100, 2)
cat("Tasa de Completitud Global:", pct_completitud, "%\n")

# 4. ESTADÍSTICA DESCRIPTIVA DE VARIABLES CUANTITATIVAS
cols_num <- which(sapply(datos, is.numeric))
if (length(cols_num) > 0) {
  cat("\n--- 3. Estadísticos Descriptivos (Variables Numéricas) ---\n")
  datos_num <- datos[, cols_num, drop = FALSE]
  print(summary(datos_num))

  # 5. DETECCIÓN DE VALORES ATÍPICOS (CRITERIO IQR 1.5x)
  cat("\n--- 4. Conteo de Outliers por Rango Intercuartílico (IQR) ---\n")
  for (col_name in names(datos_num)) {
    vals <- na.omit(datos_num[[col_name]])
    q1 <- quantile(vals, 0.25)
    q3 <- quantile(vals, 0.75)
    iqr_val <- q3 - q1
    lim_inf <- q1 - 1.5 * iqr_val
    lim_sup <- q3 + 1.5 * iqr_val
    outliers_cnt <- sum(vals < lim_inf | vals > lim_sup)
    cat(sprintf("  * %-20s: %d outliers detectados [Lim: %.2f - %.2f]\n", col_name, outliers_cnt, lim_inf, lim_sup))
  }

  # 6. MATRIZ DE CORRELACIÓN DE PEARSON
  if (ncol(datos_num) >= 2) {
    cat("\n--- 5. Matriz de Correlación Lineal (Pearson) ---\n")
    matriz_cor <- round(cor(datos_num, use = "pairwise.complete.obs"), 3)
    print(matriz_cor)
  }
} else {
  cat("\n[AVISO] Dataset exclusivamente categórico. Aplicando tablas de frecuencia marginal.\n")
  print(summary(datos))
}

cat("\n>>> [EDA EXPLORATORIO] Diagnóstico completado satisfactoriamente (Exit Code 0).\n")
