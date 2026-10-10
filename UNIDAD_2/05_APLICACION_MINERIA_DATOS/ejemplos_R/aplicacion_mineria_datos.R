df <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_2/05_APLICACION_MINERIA_DATOS/datos/crm_retail_applications.csv')
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_2/05_APLICACION_MINERIA_DATOS/resultados'
png(file.path(dir_res, 'grafico_05_aplicacion.png'), width = 800, height = 600, res = 120)
par(mar = c(5, 10, 4, 2))
barplot(rep(1, nrow(df)), names.arg = df$Sector, horiz = TRUE, col = 'coral', las = 1, main = 'Sectores Estratégicos con Mayor Adopción de Minería', xlab = 'Cobertura') 
dev.off()
sink(file.path(dir_res, 'metricas_05.txt'))
cat('CASOS SECTORIALES DE MINERÍA DE DATOS:

')
print(df)
sink()
cat('Tema 05 de Unidad 2 ejecutado con éxito.
')
