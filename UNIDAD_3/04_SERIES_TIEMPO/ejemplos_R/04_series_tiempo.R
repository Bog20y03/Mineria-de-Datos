set.seed(42)
df <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/04_SERIES_TIEMPO/datos/demanda_electrica_serie.csv')
ts_data <- ts(df$Demanda_GWh, start = c(2014, 1), frequency = 12)
train_ts <- window(ts_data, end = c(2021, 12))
test_ts <- window(ts_data, start = c(2022, 1))
hw_model <- HoltWinters(train_ts, seasonal = 'additive')
pred_hw <- predict(hw_model, n.ahead = length(test_ts), prediction.interval = TRUE)
mae <- mean(abs(test_ts - pred_hw[, 'fit']))
mape <- mean(abs((test_ts - pred_hw[, 'fit']) / test_ts)) * 100
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/04_SERIES_TIEMPO/resultados'
png(file.path(dir_res, 'grafico_04_series_tiempo.png'), width = 800, height = 600, res = 120)
plot(hw_model, pred_hw, main = 'Pronóstico de Demanda Eléctrica (Holt-Winters Aditivo)', xlab = 'Año', ylab = 'GWh', col = 'navy')
lines(test_ts, col = 'red', lwd = 2)
legend('topleft', legend = c('Histórico', 'Ajuste / Pronóstico', 'Real Observado (Test)'), col = c('navy', 'red', 'red'), lty = c(1, 1, 1), lwd = c(1, 1, 2))
dev.off()
sink(file.path(dir_res, 'metricas_04.txt'))
cat('Modelo Predictivo: Suavizamiento Exponencial Holt-Winters (Estacionalidad Aditiva)
')
cat('Alpha (Nivel):', round(hw_model$alpha, 4), '
')
cat('Beta (Tendencia):', round(hw_model$beta, 4), '
')
cat('Gamma (Estacional):', round(hw_model$gamma, 4), '
')
cat('MAE en Conjunto de Prueba (2022-2023):', round(mae, 2), 'GWh
')
cat('MAPE (Error Porcentual Absoluto Medio):', round(mape, 2), '%
')
sink()
cat('Series de tiempo completada. MAPE:', round(mape, 2), '%
')
