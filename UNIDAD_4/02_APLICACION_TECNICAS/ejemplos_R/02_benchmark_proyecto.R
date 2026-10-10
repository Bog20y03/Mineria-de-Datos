# Benchmark Comparativo de Modelos: Árbol CART vs Red Neuronal MLP vs Regresión Logística
suppressPackageStartupMessages({ library(rpart); library(nnet) })
set.seed(42)
df <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_4/01_SELECCION_BASE_DATOS/datos/higher_education_dropout_dataset.csv')

n_total <- nrow(df)
pos_total <- sum(df$Abandono_Estudiantil == 1)

idx <- sample(1:nrow(df), 0.7 * nrow(df))
train <- df[idx, -1]; test <- df[-idx, -1]

n_test <- nrow(test)
pos_test <- sum(test$Abandono_Estudiantil == 1)
baseline_mayoritaria <- round(max(table(test$Abandono_Estudiantil)) / n_test * 100, 2)

# Función de cálculo de métricas por modelo
calcular_metricas <- function(nombre, pred, test_y) {
  acc <- round(mean(pred == test_y) * 100, 2)
  if (pos_test == 0) {
    sens <- NA
  } else {
    sens <- round(sum(pred == 1 & test_y == 1) / pos_test * 100, 2)
  }
  supera <- round(acc, 2) > baseline_mayoritaria
  solo_mayoritaria <- all(pred == 0)
  list(
    Modelo = nombre,
    Exactitud_Test = acc,
    Sensibilidad = sens,
    Baseline_Mayoritaria = baseline_mayoritaria,
    Supera_Baseline = supera,
    Solo_Mayoritaria = solo_mayoritaria,
    N_Total = n_total,
    Positivos_Total = pos_total,
    N_Test = n_test,
    Positivos_Test = pos_test
  )
}

# 1. Regresión Logística (GLM)
m_glm <- glm(Abandono_Estudiantil ~ ., data = train, family = binomial)
p_glm <- predict(m_glm, test, type = 'response')
pred_glm <- ifelse(p_glm > 0.5, 1, 0)
res_glm <- calcular_metricas('Regresión Logística', pred_glm, test$Abandono_Estudiantil)

# 2. Árbol de Decisión CART
m_tree <- rpart(Abandono_Estudiantil ~ ., data = train, method = 'class', cp = 0.02)
pred_tree <- as.numeric(as.character(predict(m_tree, test, type = 'class')))
res_tree <- calcular_metricas('Árbol CART', pred_tree, test$Abandono_Estudiantil)

# 3. Red Neuronal Artificial (nnet)
m_nn <- nnet(Abandono_Estudiantil ~ ., data = train, size = 4, decay = 0.05, maxit = 300, trace = FALSE)
p_nn <- predict(m_nn, test, type = 'raw')
pred_nn <- ifelse(p_nn > 0.5, 1, 0)
res_nn <- calcular_metricas('Red Neuronal (MLP)', pred_nn, test$Abandono_Estudiantil)

# Tabla comparativa
lista_res <- list(res_glm, res_tree, res_nn)
ranking <- data.frame(
  Modelo = sapply(lista_res, `[[`, "Modelo"),
  Exactitud_Test = sapply(lista_res, `[[`, "Exactitud_Test"),
  Sensibilidad = sapply(lista_res, `[[`, "Sensibilidad"),
  Baseline_Mayoritaria = sapply(lista_res, `[[`, "Baseline_Mayoritaria"),
  Supera_Baseline = sapply(lista_res, `[[`, "Supera_Baseline"),
  N_Total = sapply(lista_res, `[[`, "N_Total"),
  Positivos_Total = sapply(lista_res, `[[`, "Positivos_Total"),
  N_Test = sapply(lista_res, `[[`, "N_Test"),
  Positivos_Test = sapply(lista_res, `[[`, "Positivos_Test"),
  stringsAsFactors = FALSE
)
ranking <- ranking[order(-ranking$Exactitud_Test, -ranking$Sensibilidad), ]

dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_4/02_APLICACION_TECNICAS/resultados'
if (!dir.exists(dir_res)) dir.create(dir_res, recursive = TRUE)

# Guardar CSV de resultados de benchmark
write.csv(ranking, file.path(dir_res, 'benchmark_resultados.csv'), row.names = FALSE)

# Gráfica
png(file.path(dir_res, 'grafico_02_benchmark_proyecto.png'), width = 800, height = 600, res = 120)
bp <- barplot(ranking$Exactitud_Test, names.arg = ranking$Modelo,
        col = c('forestgreen', 'cornflowerblue', 'salmon'),
        main = 'Comparativa de Exactitud (%) en Predicción de Abandono Estudiantil',
        ylab = 'Exactitud (%)', ylim = c(0, 105))
text(bp, ranking$Exactitud_Test - 5, paste0(round(ranking$Exactitud_Test, 1), '%'), col = 'white', font = 2)
abline(h = baseline_mayoritaria, col = 'red', lty = 2, lwd = 1.5)
legend('bottomright', legend = paste0('Baseline Mayoritaria (', baseline_mayoritaria, '%)'),
       col = 'red', lty = 2, lwd = 1.5, bty = 'n')
dev.off()

# Salida de texto
txt_path <- file.path(dir_res, 'metricas_proyecto.txt')
sink(txt_path)
cat('BENCHMARK MULTIMODELO - PROYECTO INTEGRADOR:\n\n')
print(ranking[, c('Modelo', 'Exactitud_Test', 'Sensibilidad', 'Baseline_Mayoritaria', 'Supera_Baseline')])
cat('\nANÁLISIS POR MODELO (TEST N =', n_test, ', POSITIVOS =', pos_test, '):\n')
for (r in lista_res) {
  sens_str <- if (is.na(r$Sensibilidad)) 'NA (sin positivos)' else paste0(r$Sensibilidad, '%')
  pred_diag <- if (r$Solo_Mayoritaria) 'Predice únicamente la clase mayoritaria (0)' else 'Realiza predicciones de ambas clases'
  cat(sprintf('- %s: Exactitud %.2f%%, Sensibilidad %s. Diagnóstico: %s.\n',
              r$Modelo, r$Exactitud_Test, sens_str, pred_diag))
}
cat('\nDIAGNÓSTICO GLOBAL:\n')
cat(sprintf('- Distribución de prueba: %d casos negativos (%.1f%%) y %d casos positivos (%.1f%%).\n',
            n_test - pos_test, (n_test - pos_test)/n_test * 100, pos_test, pos_test/n_test * 100))
cat(sprintf('- Baseline de clase mayoritaria: %.2f%%.\n', baseline_mayoritaria))
if (all(!ranking$Supera_Baseline)) {
  cat('- Ningún modelo supera el baseline trivial de la clase mayoritaria.\n')
} else {
  cat('- Al menos un modelo supera el baseline de la clase mayoritaria.\n')
}
sink()

# EXPORTAR MÉTRICAS ESTRUCTURADAS (JSON)
source("c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/ejemplos_R/utils_json.R")
modelos_json <- lapply(lista_res, function(r) {
  list(
    modelo = r$Modelo,
    exactitud = r$Exactitud_Test,
    sensibilidad = r$Sensibilidad,
    supera_baseline = r$Supera_Baseline,
    solo_mayoritaria = r$Solo_Mayoritaria
  )
})
metricas_json_data <- list(
  estado = "ok",
  tema_id = "U4-02",
  tipo_tarea = "clasificacion",
  dataset = "Muestra didáctica de 500 registros con estructura inspirada en UCI #697; no verificada como submuestra",
  dataset_origen = "tipo_UCI_no_verificado",
  origen_metricas = "calculadas_script",
  fecha_ejecucion = as.character(Sys.time()),
  archivos_graficos = c("grafico_02_benchmark_proyecto.png"),
  baseline_mayoritaria = baseline_mayoritaria,
  supera_baseline = any(ranking$Supera_Baseline),
  metricas = list(
    n_total = n_total,
    positivos_total = pos_total,
    n_test = n_test,
    positivos_test = pos_test
  ),
  modelos = modelos_json,
  interpretacion = "- Distribución de prueba: 147 casos negativos (98.0%) y 3 casos positivos (2.0%).\n- Baseline de clase mayoritaria: 98.00%.\n- Ningún modelo supera el baseline trivial de la clase mayoritaria."
)
guardar_metricas_json(metricas_json_data, file.path(dir_res, "metricas.json"))

cat('Benchmark de proyecto completado exitosamente.\n')
