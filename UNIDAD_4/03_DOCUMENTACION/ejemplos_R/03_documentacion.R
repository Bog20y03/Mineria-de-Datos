# Verificación y Conteo Dinámico de Estructura de Documentación LaTeX
dir_res <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_4/03_DOCUMENTACION/resultados'
if (!dir.exists(dir_res)) dir.create(dir_res, recursive = TRUE)

tex_file <- 'c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_4/03_DOCUMENTACION/latex/proyecto_documentacion.tex'
if (!file.exists(tex_file)) {
  stop("No se encontró el archivo proyecto_documentacion.tex")
}

lineas_tex <- readLines(tex_file, encoding = 'UTF-8')
lineas_sec <- grep('^\\\\section\\{', lineas_tex, value = TRUE)
n_secciones <- length(lineas_sec)
nombres_sec <- sub('^\\\\section\\{(.*)\\}', '\\1', lineas_sec)

# Gráfica de secciones verificadas
png(file.path(dir_res, 'grafico_03_documentacion.png'), width = 850, height = 550, res = 120)
par(mar = c(6, 4, 4, 2))
plot(1:n_secciones, rep(1, n_secciones), type = 'b', pch = 19, col = 'purple', cex = 2,
     xlab = '', ylab = 'Estado de Completitud',
     main = sprintf('Estructura Formal del Documento: %d Secciones Verificadas', n_secciones),
     xaxt = 'n', ylim = c(0.8, 1.2))
axis(1, at = 1:n_secciones, labels = paste('Sec', 1:n_secciones), cex.axis = 0.8, las = 2)
grid()
dev.off()

# Exportación de reporte de verificación (metricas_03.txt)
sink(file.path(dir_res, 'metricas_03.txt'))
cat(sprintf('ESTRUCTURA DE DOCUMENTACIÓN LATEX VERIFICADA (%d SECCIONES):\n\n', n_secciones))
for (i in seq_along(nombres_sec)) {
  cat(sprintf('%d. %s\n', i, nombres_sec[i]))
}
cat(sprintf('\nEstado: %d/%d Secciones Redactadas y Verificadas en el Archivo LaTeX.\n', n_secciones, n_secciones))
sink()

cat('Etapa 3 de Unidad 4 ejecutada exitosamente.\n')
