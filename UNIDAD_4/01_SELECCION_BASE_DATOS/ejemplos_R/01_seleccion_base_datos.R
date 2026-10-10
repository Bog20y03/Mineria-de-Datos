df <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_4/01_SELECCION_BASE_DATOS/datos/higher_education_dropout_dataset.csv')
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_4/01_SELECCION_BASE_DATOS/resultados'
png(file.path(dir_res, 'grafico_01_seleccion.png'), width = 800, height = 600, res = 120)
tabla_abandono <- table(Abandono = ifelse(df$Abandono_Estudiantil == 1, 'Deserción', 'Graduado/Activo'))
barplot(tabla_abandono, col = c('forestgreen', 'firebrick'), main = 'Distribución de la Variable Objetivo (Deserción Estudiantil)', ylab = 'Cantidad de Estudiantes')
dev.off()
sink(file.path(dir_res, 'metricas_01.txt'))
cat('FICHA DE CARACTERIZACIÓN ESTADÍSTICA DEL DATASET SELECCIONADO:

')
cat('Total Estudiantes Registrados:', nrow(df), '
')
cat('Tasa Histórica de Abandono:', round(mean(df$Abandono_Estudiantil) * 100, 2), '%
')
cat('Resumen de Variables Numéricas:
'); print(summary(df[, c('Edad_Matricula', 'Nota_Media_Sem1', 'Creditos_Aprobados_Sem1')]))
sink()
cat('Etapa 1 de Unidad 4 ejecutada exitosamente.
')
