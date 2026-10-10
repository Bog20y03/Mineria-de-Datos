# ==============================================================================
# EJEMPLO EN R: ÁRBOL DE CLASIFICACIÓN CON RPART
# ==============================================================================
suppressPackageStartupMessages({ library(rpart) })
set.seed(42)
df <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_2/03_ARBOL_CLASIFICACION/datos/credito_clasificacion_uci.csv')
idx <- sample(1:nrow(df), 0.7 * nrow(df))
train <- df[idx, ]; test <- df[-idx, ]
arbol <- rpart(Calificacion ~ Edad + Ingreso_Mensual + Antiguedad_Laboral, data = train, method = 'class', cp = 0.02)
pred <- predict(arbol, test, type = 'class')
mc <- table(Real = test$Calificacion, Predicho = pred)
acc <- sum(diag(mc)) / sum(mc) * 100
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_2/03_ARBOL_CLASIFICACION/resultados'
png(file.path(dir_res, 'grafico_03_arbol.png'), width = 800, height = 600, res = 120)
plot(arbol, uniform = TRUE, margin = 0.1, main = 'Árbol de Clasificación de Riesgo Crediticio')
text(arbol, use.n = TRUE, all = TRUE, cex = 0.9)
dev.off()
sink(file.path(dir_res, 'metricas_03.txt'))
cat('Exactitud (Accuracy):', round(acc, 2), '%
')
cat('Matriz de Confusión:
'); print(mc)
sink()
cat('Árbol de clasificación ejecutado con éxito. Exactitud:', round(acc, 2), '%
')
