suppressPackageStartupMessages({ library(rpart) })
set.seed(42)
df <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/01_ARBOL_DECISION/datos/bank_marketing_uci.csv')
idx <- sample(1:nrow(df), 0.7 * nrow(df))
train <- df[idx, ]; test <- df[-idx, ]
fit <- rpart(Deposito_Contratado ~ ., data = train, method = 'class', control = rpart.control(cp = 0.02, maxdepth = 4))
pred <- predict(fit, test, type = 'class')
mc <- table(Real = test$Deposito_Contratado, Predicho = pred)
acc <- sum(diag(mc)) / sum(mc) * 100
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/01_ARBOL_DECISION/resultados'
png(file.path(dir_res, 'grafico_01_arbol_decision.png'), width = 800, height = 600, res = 120)
plot(fit, uniform = TRUE, margin = 0.1, main = 'Árbol de Decisión: Contratación de Depósito Bancario')
text(fit, use.n = TRUE, all = TRUE, cex = 0.8)
dev.off()
sink(file.path(dir_res, 'metricas_01.txt'))
cat('Modelo: Árbol de Decisión CART (UCI Bank Marketing)
')
cat('Exactitud en Muestra de Prueba:', round(acc, 2), '%
')
cat('Matriz de Confusión:
'); print(mc)
cat('Importancia de Variables:
'); print(fit$variable.importance)
sink()
cat('Árbol de decisión UCI completado. Exactitud:', round(acc, 2), '%
')
