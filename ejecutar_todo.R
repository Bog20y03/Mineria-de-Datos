# ==============================================================================
# SCRIPT DE EJECUCIÓN GENERAL DE TODOS LOS SCRIPTS R EN MINERIA_DATOS
# ==============================================================================

base_root <- "c:/xampp/htdocs/api vehiculos tutoria/MINERIA_DATOS"

scripts_r <- list.files(base_root, pattern = "\\.R$", recursive = TRUE, full.names = TRUE)
scripts_r <- scripts_r[!grepl("ejecutar_todo\\.R", scripts_r)]

cat("Encontrados", length(scripts_r), "scripts ejecutables en R.\n")

for (sc in sort(scripts_r)) {
  cat("\n------------------------------------------------------------------------\n")
  cat("Ejecutando script:", sub(paste0(base_root, "/"), "", sc), "\n")
  cat("------------------------------------------------------------------------\n")
  tryCatch({
    source(sc)
    cat(">>> Exitoso.\n")
  }, error = function(e) {
    cat(">>> ERROR en:", sc, ":", conditionMessage(e), "\n")
  })
}

cat("\n========================================================================\n")
cat("Todos los scripts ejecutados.\n")
cat("========================================================================\n")
