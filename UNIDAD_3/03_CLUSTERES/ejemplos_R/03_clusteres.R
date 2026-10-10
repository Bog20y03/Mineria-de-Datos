suppressPackageStartupMessages({ library(cluster) })
set.seed(42)
df <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/03_CLUSTERES/datos/wholesale_customers_uci.csv')
datos_num <- scale(df[, c('Productos_Frescos', 'Lacteos', 'Abarrotes', 'Congelados')])
km <- kmeans(datos_num, centers = 3, nstart = 25)
sil <- silhouette(km$cluster, dist(datos_num))
sil_prom <- mean(sil[, 'sil_width'])
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/03_CLUSTERES/resultados'
png(file.path(dir_res, 'grafico_03_clusteres.png'), width = 800, height = 600, res = 120)
par(mfrow = c(1, 2))
plot(datos_num[, 1], datos_num[, 2], col = km$cluster, pch = 19, xlab = 'Frescos (Z-score)', ylab = 'Lácteos (Z-score)', main = 'Segmentación K-Means (k = 3)')
points(km$centers[, 1], km$centers[, 2], col = 1:3, pch = 8, cex = 2.5, lwd = 3)
plot(sil, col = 1:3, main = 'Perfil de Silueta por Clúster', border = NA)
dev.off()
sink(file.path(dir_res, 'metricas_03.txt'))
cat('Segmentación de Clientes Mayoristas (K-Means k = 3)
')
cat('Varianza Explicada (BSS/TSS):', round(km$betweenss / km$totss * 100, 2), '%
')
cat('Ancho de Silueta Promedio:', round(sil_prom, 4), '
')
cat('Tamaño de los Clústeres:
'); print(km$size)
cat('Centroides Estandarizados:
'); print(round(km$centers, 3))
sink()
cat('Clustering UCI Wholesale completado. Silueta promedio:', round(sil_prom, 4), '
')
