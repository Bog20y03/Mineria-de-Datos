df <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_2/02_METODOS_MINERIA_DATOS/datos/metodos_taxonomia_data.csv')
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_2/02_METODOS_MINERIA_DATOS/resultados'
png(file.path(dir_res, 'grafico_02_metodos.png'), width = 800, height = 600, res = 120)
tabla <- table(df$Paradigma)
pie(tabla, col = c('lightblue', 'lightgreen'), main = 'Distribución de Métodos por Paradigma de Aprendizaje', init.angle = 90)
dev.off()
sink(file.path(dir_res, 'metricas_02.txt'))
cat('TAXONOMÍA DE MÉTODOS DE MINERÍA DE DATOS:

')
print(df)
sink()
cat('Tema 02 de Unidad 2 ejecutado con éxito.
')
