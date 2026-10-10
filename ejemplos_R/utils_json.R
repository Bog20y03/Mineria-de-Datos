# ==============================================================================
# UTILIDADES DE SERIALIZACIÓN JSON EN R BASE (SIN DEPENDENCIAS EXTERNAS)
# Compatible con UTF-8, escalares, vectores, listas anidadas, NULL y NA
# ==============================================================================

serializar_json_base <- function(obj, nivel = 0) {
  pad <- paste(rep("  ", nivel), collapse = "")
  pad_inner <- paste(rep("  ", nivel + 1), collapse = "")
  
  if (is.null(obj)) return("null")
  if (length(obj) == 0) return("[]")
  
  if (is.list(obj)) {
    if (is.null(names(obj))) {
      # Lista sin nombres -> array JSON
      items <- vapply(obj, function(x) serializar_json_base(x, nivel + 1), character(1))
      return(paste0("[\n", paste0(pad_inner, items, collapse = ",\n"), "\n", pad, "]"))
    } else {
      # Lista nombrada -> objeto JSON
      campos <- vapply(names(obj), function(k) {
        val <- serializar_json_base(obj[[k]], nivel + 1)
        paste0(pad_inner, '"', k, '": ', val)
      }, character(1))
      return(paste0("{\n", paste(campos, collapse = ",\n"), "\n", pad, "}"))
    }
  }
  
  # Vector de longitud mayor a 1
  if (length(obj) > 1) {
    items <- vapply(seq_along(obj), function(i) serializar_json_base(obj[i], 0), character(1))
    return(paste0("[", paste(items, collapse = ", "), "]"))
  }
  
  # Valores especiales
  if (is.na(obj) || is.nan(obj) || is.infinite(obj)) return("null")
  if (is.logical(obj)) return(ifelse(obj, "true", "false"))
  if (is.numeric(obj)) {
    if (is.integer(obj) || (obj == round(obj) && abs(obj) < 1e15)) {
      return(as.character(obj))
    } else {
      return(format(obj, scientific = FALSE, trim = TRUE))
    }
  }
  
  # Caracter / String
  txt <- as.character(obj)
  txt <- gsub('\\\\', '\\\\\\\\', txt)
  txt <- gsub('"', '\\\\"', txt)
  txt <- gsub('\n', '\\\\n', txt)
  txt <- gsub('\r', '', txt)
  txt <- gsub('\t', '\\\\t', txt)
  paste0('"', txt, '"')
}

guardar_metricas_json <- function(obj, ruta) {
  json_str <- serializar_json_base(obj)
  dir_padre <- dirname(ruta)
  if (!dir.exists(dir_padre)) dir.create(dir_padre, recursive = TRUE)
  con <- file(ruta, open = "w", encoding = "UTF-8")
  writeLines(enc2utf8(json_str), con, useBytes = TRUE)
  close(con)
}
