df <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_2/01_MODELOS_MINERIA_DATOS/datos/benchmark_modelos_taxonomia.csv')
df_pred <- df[!is.na(df$Exactitud_Media), ]
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_2/01_MODELOS_MINERIA_DATOS/resultados'
png(file.path(dir_res, 'grafico_01_modelos.png'), width = 800, height = 600, res = 120)
par(mar = c(7, 4, 4, 2))
barplot(df_pred$Exactitud_Media, names.arg = df_pred$Modelo, col = 'steelblue', las = 2, main = 'Comparativa de Exactitud Media por Familia de Modelos', ylab = 'Exactitud (%)', ylim = c(0, 100))
abline(h = 80, col = 'red', lty = 2)
dev.off()
sink(file.path(dir_res, 'metricas_01.txt'))
cat('EVALUACIÓN COMPARATIVA DE MODELOS:

')
print(df[, c('Modelo', 'Familia', 'Interpretabilidad', 'Exactitud_Media')])
sink()
cat('Tema 01 de Unidad 2 ejecutado con éxito.
')
