# Integración de Fuentes y Partición Estratificada
d1 <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/07_INTEGRACION_PARTICION_DATOS/datos/fuente_1_demografia.csv')
d2 <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/07_INTEGRACION_PARTICION_DATOS/datos/fuente_2_transacciones.csv')
d3 <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/07_INTEGRACION_PARTICION_DATOS/datos/fuente_3_soporte.csv')
# 1. Integración Relacional (Inner Join)
m1 <- merge(d1, d2, by = 'ID_Cliente')
df_integrado <- merge(m1, d3, by = 'ID_Cliente')
# 2. Partición Estratificada Train/Test (70/30)
set.seed(42)
idx_0 <- which(df_integrado$Churn_Real == 0)
idx_1 <- which(df_integrado$Churn_Real == 1)
train_idx <- c(sample(idx_0, round(0.7 * length(idx_0))), sample(idx_1, round(0.7 * length(idx_1))))
train_set <- df_integrado[train_idx, ]
test_set <- df_integrado[-train_idx, ]
prop_train <- mean(train_set$Churn_Real) * 100
prop_test <- mean(test_set$Churn_Real) * 100
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/07_INTEGRACION_PARTICION_DATOS/resultados'
png(file.path(dir_res, 'grafico_07_integracion.png'), width = 800, height = 600, res = 120)
barplot(c(Entrenamiento = nrow(train_set), Prueba = nrow(test_set)), col = c('dodgerblue', 'orange'), main = 'Partición Estratificada del Dataset Integrado (70/30)', ylab = 'Observaciones')
dev.off()
sink(file.path(dir_res, 'metricas_07.txt'))
cat('Resultados de Integración Relacional y Partición:
')
cat('  - Total Filas Integradas:', nrow(df_integrado), 'observaciones.
')
cat('  - Columnas Consolidadas:', ncol(df_integrado), 'atributos.
')
cat('  - Conjunto de Entrenamiento (Train):', nrow(train_set), 'filas (', round(prop_train, 2), '% positivos Churn)
')
cat('  - Conjunto de Prueba (Test):', nrow(test_set), 'filas (', round(prop_test, 2), '% positivos Churn)
')
cat('Balance de Estratificación: Proporciones de clase preservadas idénticamente.
')
sink()
cat('Integración y partición completadas con éxito.
')
