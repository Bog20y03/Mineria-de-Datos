# Minería de Asociación y Métricas de Dependencia
df <- read.csv('c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/05_ASOCIACION_DEPENDENCIA/datos/groceries_transactions_market.csv')
items <- df[, -1]
n <- nrow(items)
soporte_individual <- colMeans(items)
# Reglas bi-ítem (A -> B)
nombres <- colnames(items)
reglas <- list()
for (a in nombres) {
  for (b in setdiff(nombres, a)) {
    sop_conjunto <- sum(items[[a]] == 1 & items[[b]] == 1) / n
    confianza <- unname(sop_conjunto / soporte_individual[a])
    lift <- unname(confianza / soporte_individual[b])
    if (sop_conjunto >= 0.10 && confianza >= 0.40) {
      reglas[[paste0(a, ' => ', b)]] <- c(Soporte = sop_conjunto, Confianza = confianza, Lift = lift)
    }
  }
}
df_reglas <- as.data.frame(do.call(rbind, reglas))
df_reglas$Regla <- rownames(df_reglas)
df_reglas <- df_reglas[order(-df_reglas$Lift), ]
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_3/05_ASOCIACION_DEPENDENCIA/resultados'
png(file.path(dir_res, 'grafico_05_asociacion.png'), width = 800, height = 600, res = 120)
plot(df_reglas$Soporte, df_reglas$Confianza, col = 'purple', pch = 19, cex = df_reglas$Lift * 1.5, xlab = 'Soporte', ylab = 'Confianza', main = 'Reglas de Asociación (Tamaño proporcional al Lift)')
text(df_reglas$Soporte, df_reglas$Confianza, labels = df_reglas$Regla, pos = 3, cex = 0.75)
grid()
dev.off()
tryCatch({
  sink(file.path(dir_res, 'metricas_05.txt'))
  cat('Reglas de Asociación Minadas (Soporte Mínimo = 10%, Confianza Mínima = 40%):\n\n')
  print(df_reglas[, c('Regla', 'Soporte', 'Confianza', 'Lift')])
}, finally = {
  while (sink.number() > 0) sink()
})
cat('Asociación minada con éxito. Reglas encontradas:', nrow(df_reglas), '
')
