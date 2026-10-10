# ==============================================================================
# EJEMPLO EN R: RED NEURONAL ARTIFICIAL (PERCEPTRÓN MULTICAPA CON NNET)
# ==============================================================================
suppressPackageStartupMessages({ library(nnet) })
set.seed(42)
df <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_2/04_REDES_NEURONALES/datos/banknote_authentication_uci.csv')
# Escalamiento Min-Max a [0, 1]
escalar <- function(x) (x - min(x)) / (max(x) - min(x))
df$Varianza_Ondicula <- escalar(df$Varianza_Ondicula)
df$Asimetria_Ondicula <- escalar(df$Asimetria_Ondicula)
df$Curtosis_Ondicula <- escalar(df$Curtosis_Ondicula)
idx <- sample(1:nrow(df), 0.7 * nrow(df))
train <- df[idx, ]; test <- df[-idx, ]
red <- nnet(Autenticidad ~ ., data = train, size = 4, decay = 0.01, maxit = 300, trace = FALSE)
prob <- predict(red, test, type = 'raw')
pred <- ifelse(prob > 0.5, 1, 0)
mc <- table(Real = test$Autenticidad, Predicho = pred)
acc <- sum(diag(mc)) / sum(mc) * 100
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_2/04_REDES_NEURONALES/resultados'
png(file.path(dir_res, 'grafico_04_red_neuronal.png'), width = 800, height = 600, res = 120)
par(mfrow = c(1, 2))
hist(prob, breaks = 15, col = 'steelblue', main = 'Distribución de Probabilidades', xlab = 'P(Auténtico)', ylab = 'Frecuencia')
barplot(red$wts[1:8], col = 'coral', main = 'Pesos Sinápticos Iniciales (Muestra)', ylab = 'Magnitud del Peso', las = 2)
dev.off()
sink(file.path(dir_res, 'metricas_04.txt'))
cat('Arquitectura: Capa Entrada (3) -> Oculta (4) -> Salida (1)
')
cat('Convergencia: Entropía final', round(red$value, 4), '
')
cat('Exactitud en Prueba:', round(acc, 2), '%
')
cat('Matriz de Confusión:
'); print(mc)
sink()
cat('Red neuronal ejecutada con éxito. Exactitud:', round(acc, 2), '%
')
