# Sustentación de Resultados del Proyecto Integrador
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_4/04_SUSTENTACION_RESULTADOS/resultados'
if (!dir.exists(dir_res)) dir.create(dir_res, recursive = TRUE)

# 1. Cargar datos reales de benchmark generados por U4-02
csv_benchmark <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_4/02_APLICACION_TECNICAS/resultados/benchmark_resultados.csv'
if (!file.exists(csv_benchmark)) {
  stop("El archivo benchmark_resultados.csv no existe. Ejecute primero el script 02_benchmark_proyecto.R")
}
df_bm <- read.csv(csv_benchmark, stringsAsFactors = FALSE)

n_total <- df_bm$N_Total[1]
pos_total <- df_bm$Positivos_Total[1]
n_test <- df_bm$N_Test[1]
pos_test <- df_bm$Positivos_Test[1]
baseline_acc <- df_bm$Baseline_Mayoritaria[1]
max_acc <- max(df_bm$Exactitud_Test)
min_acc <- min(df_bm$Exactitud_Test)

# Evaluación condicional con if: iguala / supera / no supera
if (all(df_bm$Supera_Baseline)) {
  relacion_baseline <- sprintf("superan el baseline de la clase mayoritaria (%.2f%%)", baseline_acc)
} else if (any(df_bm$Supera_Baseline)) {
  relacion_baseline <- sprintf("algunos modelos superan y otros no el baseline (%.2f%%)", baseline_acc)
} else if (all(df_bm$Exactitud_Test == baseline_acc)) {
  relacion_baseline <- sprintf("igualan el baseline trivial de la clase mayoritaria (%.2f%%)", baseline_acc)
} else {
  relacion_baseline <- sprintf("no superan el baseline trivial de la clase mayoritaria (%.2f%%)", baseline_acc)
}

# 2. Generación de Gráfica de Sustentación con Métricas Reales
png_path <- file.path(dir_res, 'grafico_04_sustentacion.png')
png(png_path, width = 850, height = 550, res = 120)
par(mar = c(5, 5, 4, 2))

# Valores de cada modelo tomados del CSV
colores <- c('royalblue', 'darkcyan', 'salmon')
bp <- barplot(df_bm$Exactitud_Test, names.arg = df_bm$Modelo,
        col = colores[1:nrow(df_bm)],
        main = 'Sustentación: Desempeño Multimodelo vs Baseline Mayoritaria',
        ylab = 'Exactitud en Test (%)', ylim = c(0, 110))
text(bp, df_bm$Exactitud_Test - 6, paste0(round(df_bm$Exactitud_Test, 1), '%'), col = 'white', font = 2)
abline(h = baseline_acc, col = 'red', lty = 2, lwd = 1.5)
legend('bottomright',
       legend = c(paste0('Exactitud Modelos (', min_acc, '% - ', max_acc, '%)'),
                 paste0('Baseline Mayoritaria (', baseline_acc, '%)')),
       fill = c('royalblue', NA),
       border = c('black', NA),
       col = c(NA, 'red'), lty = c(NA, 2), lwd = c(NA, 1.5), bty = 'n')
dev.off()

# 3. Documentación y Guía de Sustentación (metricas_04.txt)
sink(file.path(dir_res, 'metricas_04.txt'))
cat('GUÍA DE SUSTENTACIÓN Y DEFENSA DEL PROYECTO INTEGRADOR:\n\n')
cat('1. Problema de Negocio / Académico:\n')
cat('   Predicción temprana del abandono estudiantil en educación superior.\n\n')
cat('2. Dataset del Proyecto:\n')
cat(sprintf('   Muestra didáctica analizada: %d observaciones con %d casos de abandono (no se utilizó el dataset completo de UCI; ver ficha oficial para el benchmark formal).\n',
            n_total, pos_total))
cat(sprintf('   Conjunto de prueba: %d observaciones con %d casos positivos (tasa test: %.1f%%).\n\n',
            n_test, pos_test, (pos_test / n_test) * 100))
cat('3. Metodología Aplicada:\n')
cat('   CRISP-DM estructurada en 6 fases con pipeline reproducible en R.\n\n')
cat('4. Técnicas Evaluadas en Benchmark:\n')
for (i in 1:nrow(df_bm)) {
  sens_str <- if (is.na(df_bm$Sensibilidad[i])) 'NA' else paste0(round(df_bm$Sensibilidad[i], 2), '%')
  cat(sprintf('   - %s: Exactitud %.2f%% | Sensibilidad: %s\n',
              df_bm$Modelo[i], df_bm$Exactitud_Test[i], sens_str))
}
cat('\n5. Relación con Baseline y Diagnóstico Crítico:\n')
cat(sprintf('   - Los modelos evaluados %s.\n', relacion_baseline))
cat('   - Diagnóstico metodológico: ante el fuerte desbalance de la muestra (1% casos positivos),\n')
cat('     los clasificadores convergen a la regla trivial de predecir no-abandono para todos los casos.\n')
cat('   - Recomendación técnica: aplicar técnicas de balanceo (SMOTE, submuestreo) y evaluar sobre el dataset completo.\n')
sink()

cat('Etapa 4 de Unidad 4 ejecutada exitosamente.\n')
