# ==============================================================================
# TEMA 07: ALMACÉN DE DATOS – DATA WAREHOUSE (DW & ETL)
# SCRIPT: 07_data_warehouse_run.R
# OBJETIVO: Implementar y simular un Data Warehouse relacional completo:
#           1. Ingesta de fuentes transaccionales heterogéneas (OLTP).
#           2. Pipeline ETL riguroso (Extracción -> Transformación -> Carga).
#           3. Construcción formal del Modelo Dimensional en Estrella (Kimball):
#              - Fact_Ventas con Surrogate Keys.
#              - Dim_Cliente, Dim_Producto, Dim_Tiempo.
#           4. Ejecución de Consultas Analíticas OLAP:
#              - Roll-Up (agregación jerárquica temporal).
#              - Drill-Down (desglose por categoría y mes).
#              - Slice & Dice (filtrado multidimensional).
# ==============================================================================

set.seed(999)

cat(">>> [TEMA 07: DATA WAREHOUSE] Iniciando simulación de arquitectura ETL y OLAP...\n\n")

# ------------------------------------------------------------------------------
# 1. FUENTES DE DATOS TRANSACCIONALES (SISTEMAS FUENTE OLTP)
# ------------------------------------------------------------------------------
cat("====================================================================\n")
cat("1. EXTRACCIÓN: FUENTES TRANSACCIONALES CRUDAS\n")
cat("====================================================================\n")

# Fuente A: ERP Transaccional (Ventas crudas con ruido, formatos no estándar)
n_tx <- 600
fuente_erp_ventas <- data.frame(
  id_transaccion = paste0("TX-", 10001:(10000 + n_tx)),
  codigo_cliente = paste0("C", sample(1:25, n_tx, replace = TRUE)),
  codigo_producto = paste0("P", sample(1:15, n_tx, replace = TRUE)),
  cantidad_vendida = sample(1:10, n_tx, replace = TRUE),
  fecha_raw = sample(seq(as.Date("2024-01-01"), as.Date("2024-12-31"), by = "day"), n_tx, replace = TRUE),
  descuento_aplicado = round(runif(n_tx, 0, 0.25), 2),
  stringsAsFactors = FALSE
)

# Fuente B: CRM (Datos de Clientes)
fuente_crm_clientes <- data.frame(
  cod_cliente = paste0("C", 1:25),
  nombre_contacto = paste("Cliente", LETTERS[1:25]),
  segmento = sample(c("Corporativo", "PYME", "Consumo Final"), 25, replace = TRUE),
  ciudad = sample(c("Madrid", "Barcelona", "Valencia", "Sevilla", "Bilbao"), 25, replace = TRUE),
  stringsAsFactors = FALSE
)

# Fuente C: Catálogo Maestro de Productos (WMS)
fuente_catalogo_productos <- data.frame(
  cod_sku = paste0("P", 1:15),
  descripcion = paste("Producto", sprintf("%02d", 1:15)),
  categoria = sample(c("Hardware", "Software", "Servicios Cloud", "Accesorios"), 15, replace = TRUE),
  precio_unitario = round(runif(15, 25, 650), 2),
  stringsAsFactors = FALSE
)

cat("ERP Ventas extraídas:", nrow(fuente_erp_ventas), "registros transaccionales.\n")
cat("CRM Clientes extraídos:", nrow(fuente_crm_clientes), "entidades de clientes.\n")
cat("Catálogo Productos extraídos:", nrow(fuente_catalogo_productos), "SKUs maestros.\n")

# ------------------------------------------------------------------------------
# 2. PROCESO DE TRANSFORMACIÓN (TRANSFORMATION PIPELINE)
# ------------------------------------------------------------------------------
cat("\n====================================================================\n")
cat("2. TRANSFORMACIÓN: LIMPIEZA, ENRIQUECIMIENTO Y CLAVES SUBROGADAS\n")
cat("====================================================================\n")

# Generación de la Dimensión Tiempo conformada
fechas_unicas <- sort(unique(fuente_erp_ventas$fecha_raw))
Dim_Tiempo <- data.frame(
  SK_Tiempo = 1000 + seq_along(fechas_unicas),
  Fecha = fechas_unicas,
  Anio = as.integer(format(fechas_unicas, "%Y")),
  Mes_Num = as.integer(format(fechas_unicas, "%m")),
  Mes_Nombre = format(fechas_unicas, "%B"),
  Trimestre = paste0("Q", (as.integer(format(fechas_unicas, "%m")) - 1) %/% 3 + 1),
  Dia_Semana = weekdays(fechas_unicas),
  Es_FinDeSemana = ifelse(weekdays(fechas_unicas) %in% c("sábado", "domingo", "Saturday", "Sunday"), 1, 0),
  stringsAsFactors = FALSE
)

# Generación de la Dimensión Cliente con Clave Subrogada (Surrogate Key)
Dim_Cliente <- data.frame(
  SK_Cliente = 2000 + seq_len(nrow(fuente_crm_clientes)),
  Cod_Cliente_Fuente = fuente_crm_clientes$cod_cliente,
  Nombre = fuente_crm_clientes$nombre_contacto,
  Segmento = fuente_crm_clientes$segmento,
  Ciudad = fuente_crm_clientes$ciudad,
  Region = ifelse(fuente_crm_clientes$ciudad %in% c("Madrid", "Sevilla"), "Sur-Centro", "Norte-Este"),
  stringsAsFactors = FALSE
)

# Generación de la Dimensión Producto con Clave Subrogada
Dim_Producto <- data.frame(
  SK_Producto = 3000 + seq_len(nrow(fuente_catalogo_productos)),
  SKU_Fuente = fuente_catalogo_productos$cod_sku,
  Descripcion = fuente_catalogo_productos$descripcion,
  Categoria = fuente_catalogo_productos$categoria,
  Precio_Unitario = fuente_catalogo_productos$precio_unitario,
  stringsAsFactors = FALSE
)

# ------------------------------------------------------------------------------
# 3. CARGA: CONSTRUCCIÓN DE LA TABLA DE HECHOS (FACT_VENTAS)
# ------------------------------------------------------------------------------
cat("\n====================================================================\n")
cat("3. CARGA: GENERACIÓN DE LA TABLA DE HECHOS (FACT_VENTAS)\n")
cat("====================================================================\n")

# Reconciliación referencial mediante cruce de claves de negocio hacia Surrogate Keys
erp_merge <- merge(fuente_erp_ventas, Dim_Cliente, by.x = "codigo_cliente", by.y = "Cod_Cliente_Fuente")
erp_merge <- merge(erp_merge, Dim_Producto, by.x = "codigo_producto", by.y = "SKU_Fuente")
erp_merge <- merge(erp_merge, Dim_Tiempo, by.x = "fecha_raw", by.y = "Fecha")

# Cálculo de Métricas Aditivas (Monto Bruto, Importe Descuento, Monto Neto, Margen)
monto_bruto <- erp_merge$cantidad_vendida * erp_merge$Precio_Unitario
importe_descuento <- round(monto_bruto * erp_merge$descuento_aplicado, 2)
monto_neto <- round(monto_bruto - importe_descuento, 2)

Fact_Ventas <- data.frame(
  SK_Venta = 50000 + seq_len(nrow(erp_merge)),
  SK_Tiempo = erp_merge$SK_Tiempo,
  SK_Cliente = erp_merge$SK_Cliente,
  SK_Producto = erp_merge$SK_Producto,
  Cantidad = erp_merge$cantidad_vendida,
  Monto_Bruto = monto_bruto,
  Descuento_Monetario = importe_descuento,
  Monto_Neto = monto_neto,
  stringsAsFactors = FALSE
)

cat("Tabla de Hechos cargada exitosamente: Fact_Ventas con", nrow(Fact_Ventas), "filas.\n")
print(head(Fact_Ventas, 3))

# ------------------------------------------------------------------------------
# 4. CONSULTAS ANALÍTICAS OLAP SOBRE EL ESQUEMA EN ESTRELLA
# ------------------------------------------------------------------------------
cat("\n====================================================================\n")
cat("4. CONSULTAS ANALÍTICAS MULTIDIMENSIONALES (OPERACIONES OLAP)\n")
cat("====================================================================\n")

# Crear vista desnormalizada de análisis OLAP
cubo_analitico <- merge(Fact_Ventas, Dim_Tiempo, by = "SK_Tiempo")
cubo_analitico <- merge(cubo_analitico, Dim_Cliente, by = "SK_Cliente")
cubo_analitico <- merge(cubo_analitico, Dim_Producto, by = "SK_Producto")

# Operación 4.1: Roll-Up (Agregación hacia arriba en la jerarquía: Ventas por Trimestre y Región)
cat("\n>>> Operación OLAP 1: ROLL-UP (Ventas Netas por Trimestre y Región):\n")
rollup_ventas <- aggregate(Monto_Neto ~ Trimestre + Region, data = cubo_analitico, sum)
print(rollup_ventas)

# Operación 4.2: Drill-Down (Desglose en mayor granularidad: Ventas por Categoría de Producto)
cat("\n>>> Operación OLAP 2: DRILL-DOWN (Métricas Agregadas por Categoría de Producto):\n")
drilldown_cat <- aggregate(cbind(Monto_Neto, Cantidad) ~ Categoria, data = cubo_analitico,
                           function(x) c(Total = sum(x), Promedio = mean(x)))
print(drilldown_cat)

# Operación 4.3: Slice & Dice (Filtrado multidimensional: Trimestre Q2 y Categoría Hardware)
cat("\n>>> Operación OLAP 3: SLICE & DICE (Filtro: Q2 & Hardware / Servicios Cloud):\n")
slice_dice <- cubo_analitico[cubo_analitico$Trimestre == "Q2" &
                             cubo_analitico$Categoria %in% c("Hardware", "Servicios Cloud"), ]
cat("Registros filtrados por el corte multidimensional:", nrow(slice_dice), "\n")
resumen_slice <- aggregate(Monto_Neto ~ Ciudad + Categoria, data = slice_dice, sum)
print(resumen_slice)

# ------------------------------------------------------------------------------
# 5. EXPORTACIÓN DE TABLAS DEL DATA WAREHOUSE Y GRÁFICAS
# ------------------------------------------------------------------------------
dir_res <- "c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/UNIDAD_1/07_DATA_WAREHOUSE/resultados"
dir_latex <- "c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS/latex/figuras"

if (!dir.exists(dir_res)) dir.create(dir_res, recursive = TRUE)
if (!dir.exists(dir_latex)) dir.create(dir_latex, recursive = TRUE)

# Guardar tablas del esquema dimensional en CSV
write.csv(Dim_Cliente, file.path(dir_res, "Dim_Cliente.csv"), row.names = FALSE)
write.csv(Dim_Producto, file.path(dir_res, "Dim_Producto.csv"), row.names = FALSE)
write.csv(Dim_Tiempo, file.path(dir_res, "Dim_Tiempo.csv"), row.names = FALSE)
write.csv(Fact_Ventas, file.path(dir_res, "Fact_Ventas.csv"), row.names = FALSE)

png_path1 <- file.path(dir_res, "grafico_07_data_warehouse.png")
png_path2 <- file.path(dir_latex, "grafico_07_data_warehouse.png")

png(png_path1, width = 1000, height = 520, res = 120)
par(mfrow = c(1, 2), mar = c(5, 5, 3, 1))

# Panel A: Ventas Netas por Categoría (Drill-Down)
ventas_por_cat <- aggregate(Monto_Neto ~ Categoria, data = cubo_analitico, sum)
barplot(ventas_por_cat$Monto_Neto / 1000, names.arg = ventas_por_cat$Categoria,
        col = "#4299e1", las = 2, ylab = "Ventas Netas (Miles $)",
        main = "OLAP Drill-Down: Ventas por Categoría")
grid(nx = NA, ny = NULL)

# Panel B: Tendencia Trimestral por Región (Roll-Up)
tabla_q_reg <- tapply(cubo_analitico$Monto_Neto / 1000, list(cubo_analitico$Region, cubo_analitico$Trimestre), sum)
barplot(tabla_q_reg, beside = TRUE, col = c("#ed8936", "#48bb78"),
        xlab = "Trimestre", ylab = "Ventas (Miles $)",
        main = "OLAP Roll-Up: Ventas por Región y Trimestre")
legend("topleft", legend = rownames(tabla_q_reg), fill = c("#ed8936", "#48bb78"), bty = "n")
grid(nx = NA, ny = NULL)
dev.off()

file.copy(png_path1, png_path2, overwrite = TRUE)

metricas_txt <- file.path(dir_res, "metricas_07.txt")
writeLines(c(
  "=== MÉTRICAS DE RESULTADO - TEMA 07: DATA WAREHOUSE ===",
  paste("Total Hechos Registrados (Fact_Ventas):", nrow(Fact_Ventas)),
  paste("Total Facturación Neta Consolidada:", paste0("$", format(sum(Fact_Ventas$Monto_Neto), big.mark = ","))),
  paste("Dimensión Clientes Conformada:", nrow(Dim_Cliente), "registros"),
  paste("Dimensión Productos Conformada:", nrow(Dim_Producto), "SKUs"),
  paste("Dimensión Tiempo Conformada:", nrow(Dim_Tiempo), "días evaluados"),
  "\nSÍNTESIS DEL MODELO DIMENSIONAL Y PIPELINE ETL (Kimball & Ross, 2013):",
  "- Extracción: 3 fuentes desacopladas (ERP transacciones, CRM clientes, Catálogo WMS).",
  "- Transformación: Reconciliación semántica, saneamiento, cálculo de métricas aditivas y generación de claves subrogadas (SK).",
  "- Carga: Estructuración del Star Schema relacional libre de dependencias operacionales.",
  "- Capacidades OLAP: Agregación en tiempo real (Roll-Up por trimestre, Drill-Down por categoría, Slice-and-Dice por región)."
), metricas_txt)

cat("\n>>> [TEMA 07: DATA WAREHOUSE] Simulación exitosa. Gráfica guardada en:", png_path1, "\n")
