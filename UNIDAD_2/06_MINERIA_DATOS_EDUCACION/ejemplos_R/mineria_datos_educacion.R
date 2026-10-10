df <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_2/06_MINERIA_DATOS_EDUCACION/datos/edm_learning_analytics.csv')
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_2/06_MINERIA_DATOS_EDUCACION/resultados'
png(file.path(dir_res, 'grafico_06_educacion.png'), width = 800, height = 600, res = 120)
plot(df$Horas_Plataforma_Semana, df$Tareas_Entregadas_Pct, col = ifelse(df$Riesgo_Desercion == 'Alto', 'red', 'darkgreen'), pch = 19, cex = 2, xlab = 'Horas en Plataforma por Semana', ylab = '% Tareas Entregadas', main = 'Analítica de Aprendizaje: Detección de Estudiantes en Riesgo')
legend('topleft', legend = c('Riesgo Alto', 'Riesgo Bajo / Medio'), col = c('red', 'darkgreen'), pch = 19)
grid()
dev.off()
sink(file.path(dir_res, 'metricas_06.txt'))
cat('INDICADORES DE ANALÍTICA DEL APRENDIZAJE (EDM):

')
print(df)
sink()
cat('Tema 06 de Unidad 2 ejecutado con éxito.
')
