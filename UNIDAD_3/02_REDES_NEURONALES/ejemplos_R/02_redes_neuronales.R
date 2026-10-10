suppressPackageStartupMessages({ library(nnet) })
set.seed(42)
df <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/02_REDES_NEURONALES/datos/pima_diabetes_uci.csv')
norm_minmax <- function(x) (x - min(x)) / (max(x) - min(x))
df_norm <- as.data.frame(lapply(df[, 1:5], norm_minmax))
df_norm$Resultado <- df$Resultado
idx <- sample(1:nrow(df_norm), 0.7 * nrow(df_norm))
train <- df_norm[idx, ]; test <- df_norm[-idx, ]
net <- nnet(Resultado ~ ., data = train, size = 5, decay = 0.05, maxit = 350, trace = FALSE)
prob <- predict(net, test, type = 'raw')
pred <- ifelse(prob > 0.5, 1, 0)
mc <- table(Real = test$Resultado, Predicho = pred)
acc <- sum(diag(mc)) / sum(mc) * 100
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/02_REDES_NEURONALES/resultados'
png(file.path(dir_res, 'grafico_02_redes_neuronales.png'), width = 800, height = 600, res = 120)
par(mfrow = c(1, 2))
hist(prob, breaks = 12, col = 'seagreen', main = 'Probabilidades de Riesgo Diabético', xlab = 'Probabilidad Calculada')
barplot(prop.table(mc, 1) * 100, beside = TRUE, col = c('lightblue', 'darkred'), main = 'Distribución de Predicciones (%)', legend = c('No Diabetes', 'Diabetes'))
dev.off()
sink(file.path(dir_res, 'metricas_02.txt'))
cat('Red Neuronal MLP (5 neuronas ocultas, regularización L2 decay = 0.05)
')
cat('Exactitud en Validación Externa:', round(acc, 2), '%
')
cat('Matriz de Confusión:
'); print(mc)
sink()
cat('Red neuronal UCI Diabetes completada. Exactitud:', round(acc, 2), '%
')
