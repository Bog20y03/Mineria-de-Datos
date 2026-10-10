# FASE 1: INVENTARIO, CONTRATO Y ANÁLISIS DEL SISTEMA
## Plataforma Académica "Ruta del Conocimiento: La Máquina de Minería"

---

## 1. Resumen de la Arquitectura Actual y Estructura de Carpetas

El proyecto está diseñado bajo un modelo **basado exclusivamente en el sistema de archivos (file-based architecture)**. No depende de ningún motor de base de datos relacional (MySQL, SQLite, PostgreSQL). Toda la información (búsquedas, bitácoras, documentos, datasets, código en R, métricas, gráficas y LaTeX) se almacena y versiona en archivos estáticos organizados jerárquicamente.

### Estructura general de directorios

```text
MINERIA_DATOS/
│
├── UNIDAD_1/                         # Conceptos sobre minería de datos (7 temas)
│   ├── 01_MINERIA_DE_DATOS/
│   ├── 02_KDD/
│   ├── 03_CRISP_DM/
│   ├── 04_MODELO/
│   ├── 05_MODELO_HIBRIDO/
│   ├── 06_PREDICCION/
│   └── 07_DATA_WAREHOUSE/
│
├── UNIDAD_2/                         # Modelos y técnicas de minería de datos (6 temas)
│   ├── 01_MODELOS_MINERIA_DATOS/
│   ├── 02_METODOS_MINERIA_DATOS/
│   ├── 03_ARBOL_CLASIFICACION/
│   ├── 04_REDES_NEURONALES/
│   ├── 05_APLICACION_MINERIA_DATOS/
│   └── 06_MINERIA_DATOS_EDUCACION/
│
├── UNIDAD_3/                         # Aplicaciones con diferentes técnicas (7 temas)
│   ├── 01_ARBOL_DECISION/
│   ├── 02_REDES_NEURONALES/
│   ├── 03_CLUSTERES/
│   ├── 04_SERIES_TIEMPO/
│   ├── 05_ASOCIACION_DEPENDENCIA/
│   ├── 06_VALIDACION_DATOS/
│   └── 07_INTEGRACION_PARTICION_DATOS/
│
├── UNIDAD_4/                         # Proyecto integrador (4 temas)
│   ├── 01_SELECCION_BASE_DATOS/
│   ├── 02_APLICACION_TECNICAS/
│   ├── 03_DOCUMENTACION/
│   └── 04_SUSTENTACION_RESULTADOS/
│
├── api/
│   └── index.php                     # Backend API en PHP (controlador central único)
│
├── busquedas/
│   └── maestro_ecuaciones_busqueda.csv # Consolidado de 360 ecuaciones de búsqueda del proyecto
│
├── documentos/
│   ├── documentos_encontrados_completo.csv   # Consolidado de documentos encontrados
│   ├── documentos_seleccionados_completo.csv # Consolidado de documentos seleccionados
│   ├── matriz_analisis_bibliografico.csv     # Matriz general PRISMA
│   └── referencias_bibliograficas.bib        # Entradas BibTeX unificadas
│
├── datos/
│   └── usuario_actual.json           # Ficha estática del perfil/rol del usuario
│
├── latex/                            # Memoria técnica global consolidada
│   ├── UNIDAD_1/ a UNIDAD_4/         # Capítulos LaTeX por unidad y tema
│   ├── figuras/                      # Diagramas vectoriales e imágenes
│   ├── main.tex                      # Documento maestro LaTeX (\documentclass{report})
│   └── referencias_bibliograficas.bib
│
├── frontend/                         # Aplicación React + TypeScript (Vite 8)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts                # Con proxy hacia Apache /api%20vehiculos%20tutoria/MINERIA_DATOS
│
├── ejecutar_todo.R                   # Orquestador R para ejecutar recursivamente todos los .R
├── index.php                         # Interfaz web original en PHP/Bootstrap clásico
└── README.md                         # Documentación técnica general del sistema
```

### Anatomía interna estandarizada de cada uno de los 24 temas

Cada subcarpeta temática (`UNIDAD_X/NOMBRE_TEMA/`) contiene 7 módulos:
1. `busquedas/`:
   - `ecuaciones_busqueda.csv`: Ecuaciones booleanas con identificador, idioma, objetivos y URL a Google Scholar.
   - `bitacora_busquedas.csv`: Registro de ejecución con fecha, cantidad aproximada de resultados y documentos asociados.
   - `ecuaciones_busqueda.md`: Documento descriptivo de las ecuaciones.
2. `documentos/`:
   - `documentos_seleccionados.csv`: Artículos científicos canónicos con DOI, autores, año, pertinencia y criterios.
   - `matriz_analisis.csv`: Matriz bibliográfica con objetivos, metodología y resultados.
   - `documentos_encontrados.csv` / `resumen_documentos.md`.
3. `datos/`:
   - Archivo CSV con el dataset real público (UCI Machine Learning Repository, Kaggle, etc.).
   - `metadata.json`: Ficha técnica formal con variables, número de registros, tipo y licencia.
4. `ejemplos_R/`:
   - Script `.R` reproducible, parametrizado con `set.seed` y autodocumentado.
5. `resultados/`:
   - Gráficas diagnósticas en alta resolución `.png`.
   - Reportes numéricos de métricas en texto plano `.txt`.
6. `latex/`:
   - Avance temático en formato LaTeX (`.tex`).
7. `README.md`:
   - Fundamentación teórica y objetivos académicos de aprendizaje del tema.

---

## 2. API PHP: Archivos, Enrutamiento, Formato, Errores y CORS

- **Archivo único:** La API completa reside en un único archivo: [`api/index.php`](file:///c:/xampp/htdocs/api%20vehiculos%20tutoria/MINERIA_DATOS/api/index.php) (344 líneas).
- **Enrutamiento:** Basado en parámetro query string `action`:
  ```php
  $action = $_GET['action'] ?? 'progress';
  ```
  No existe un enrutador REST ni reescritura `.htaccess` dedicada para la API.
- **Cabeceras HTTP y CORS:**
  ```php
  header('Content-Type: application/json; charset=utf-8');
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST');
  ```
  Permite cualquier origen (`*`) y solo declara métodos `GET` y `POST`.
- **Formato de respuestas:**
  JSON estructurado generado con la función auxiliar:
  ```php
  function jsonResponse($data, $code = 200) {
      http_response_code($code);
      echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
      exit;
  }
  ```
- **Manejo de errores:**
  Devuelve código HTTP correspondiente (`400` o `404`) y cuerpo JSON con clave `error`:
  - Si la acción no existe: `{"error": "Acción no reconocida"}` (HTTP 400).
  - Si no existe la unidad o tema: `{"error": "Tema o Unidad no válido"}` (HTTP 404).
  - Si no existe script R en ejecución: `{"error": "No se encontró script de R para este tema"}` (HTTP 404).

---

## 3. Tabla Completa de Endpoints

| Método | Ruta | Parámetros | ¿Requiere Auth? | Respuesta (Estructura y Códigos) |
|---|---|---|:---:|---|
| **GET** | `api/index.php?action=progress` | Ninguno (o `action=progress` implícito) | **No** | **HTTP 200:** Objeto JSON con:<br>• `progreso_global`: porcentaje entero promedio.<br>• `unidades`: desglose de `UNIDAD_1` a `UNIDAD_4`, con porcentaje y estado de las 8 actividades (`busqueda`, `documentos`, `analisis`, `dataset`, `ejemplo_r`, `resultados`, `latex`, `sustentacion`) marcado como `"Completada"` o `"Pendiente"`.<br>• `metricas`: totales numéricos de temas, búsquedas, documentos, ejemplos R, datasets y LaTeX. |
| **GET** | `api/index.php?action=topic_data` | `u` (ID unidad, ej. `UNIDAD_1`)<br>`t` (ID tema, ej. `01_MINERIA_DE_DATOS`) | **No** | **HTTP 200:** Objeto JSON con recursos completos del tema:<br>• `unidad_id`, `unidad_nombre`, `tema_id`, `tema_nombre`<br>• `descripcion_md`: contenido de `README.md`<br>• `busquedas[]`: filas del CSV `ecuaciones_busqueda.csv`<br>• `documentos[]`: filas del CSV `documentos_seleccionados.csv`<br>• `dataset`: objeto con `metadata` (JSON), `archivo` (nombre CSV), `headers[]` y `preview[][]` (primeras 7 filas)<br>• `ejemplo_r`: `{archivo, codigo}` (código fuente del primer script `.R`)<br>• `resultados`: `{imagenes: [{nombre, url}], metricas: string}` (primer `.txt`)<br>• `latex`: `{archivo, codigo}` (código fuente del primer archivo `.tex`)<br>**HTTP 404:** `{"error": "Tema o Unidad no válido"}` |
| **POST / GET** | `api/index.php?action=run_r` | `u` (ID unidad vía POST o GET)<br>`t` (ID tema vía POST o GET) | **No** | **HTTP 200:** Ejecuta `Rscript.exe` mediante `exec()`. Devuelve:<br>• `status`: `"success"` o `"error"`<br>• `exit_code`: código de retorno del proceso R (0 es exitoso)<br>• `salida`: volcado de stdout y stderr combinados<br>• `imagenes[]`: lista actualizada de PNG con query string de refresco de caché `?t=timestamp`<br>• `metricas`: contenido actualizado del archivo `.txt`<br>**HTTP 404:** `{"error": "No se encontró script de R para este tema"}` |

> **Nota:** No existen más endpoints en la API PHP actual.

---

## 4. Usuarios, Autenticación y Roles

- **En la API PHP:** **No existe ningún sistema de autenticación ni gestión de roles.**
  - No hay funciones `session_start()`, manejo de tokens JWT, cookies de sesión ni cabeceras `Authorization`.
  - No hay endpoints de login, registro, logout ni verificación de credenciales.
  - No hay tablas de usuarios en bases de datos.
- **En los archivos del proyecto:**
  - Existe un archivo estático de referencia en [`datos/usuario_actual.json`](file:///c:/xampp/htdocs/api%20vehiculos%20tutoria/MINERIA_DATOS/datos/usuario_actual.json):
    ```json
    {
      "id": "estudiante_01",
      "nombre": "Alex Mendoza (Estudiante)",
      "rol": "ESTUDIANTE",
      "nivel": 4,
      "rango": "Científico de Datos",
      "xp": 3850,
      "xp_siguiente_nivel": 5000,
      "permisos": { ... }
    }
    ```
  - **Dicho archivo no es leído, servido ni procesado por `api/index.php`**. Es un archivo descriptivo estático.

---

## 5. Esquema de Base de Datos y Almacenamiento

**El proyecto no cuenta con base de datos SQL ni NoSQL.** Todos los elementos se guardan en el sistema de archivos:

| Entidad / Concepto | Dónde y cómo se almacena | Formato / Estructura |
|---|---|---|
| **Unidades y Temas** | Diccionario estático `$estructura` en `api/index.php` (Líneas 23-68) y carpetas físicas `UNIDAD_1/` a `UNIDAD_4/`. | Arreglo PHP asociativo y estructura de carpetas. |
| **Consultas booleanas** | • Consolidado maestro: `busquedas/maestro_ecuaciones_busqueda.csv`<br>• Por tema: `UNIDAD_X/{tema}/busquedas/ecuaciones_busqueda.csv` | CSV con columnas de ecuación, nivel, objetivos y enlaces Scholar. |
| **Bitácora de búsquedas** | `UNIDAD_X/{tema}/busquedas/bitacora_busquedas.csv` | CSV con fecha, resultados aproximados y IDs de documentos vinculados. |
| **Documentos científicos** | • Consolidado: `documentos/documentos_seleccionados_completo.csv`<br>• Por tema: `UNIDAD_X/{tema}/documentos/documentos_seleccionados.csv` | CSV con hasta 20 columnas (ID, Título, Autores, Año, DOI, Pertinencia, Resumen, etc.). |
| **Matriz bibliográfica** | `UNIDAD_X/{tema}/documentos/matriz_analisis.csv` y `documentos/matriz_analisis_bibliografico.csv` | CSV con objetivos, metodología y resultados comparados. |
| **Datasets** | `UNIDAD_X/{tema}/datos/*.csv` y `metadata.json` | CSV tabular y JSON descriptivo formal. |
| **Ejemplos en R** | `UNIDAD_X/{tema}/ejemplos_R/*.R` | Código fuente script en lenguaje R. |
| **Resultados de R** | `UNIDAD_X/{tema}/resultados/` | Imágenes `.png` y métricas en texto plano `.txt`. |
| **LaTeX** | `UNIDAD_X/{tema}/latex/*.tex` y `latex/UNIDAD_X/*.tex` | Código fuente `.tex` y `main.tex` maestro. |
| **Progreso del sistema** | Calculado **en tiempo real en memoria** por `api/index.php` al ejecutar `?action=progress` mediante escaneo de archivos con `glob()` y `file_exists()`. | No se guarda en disco; es un cálculo derivado de la presencia física de archivos. |

---

## 6. Estado Real de las 100 Consultas Originales

### Ubicación exacta
Las consultas de la Unidad 1 están guardadas en:
1. Maestro general: `busquedas/maestro_ecuaciones_busqueda.csv` (360 ecuaciones en total en el proyecto).
2. Carpeta de cada tema: `UNIDAD_1/{TEMA}/busquedas/ecuaciones_busqueda.csv`.
3. Bitácora de ejecución: `UNIDAD_1/{TEMA}/busquedas/bitacora_busquedas.csv`.

### Verificación de la distribución y discrepancia encontrada

La instrucción en `AGENTS.md` especifica:
*Minería de datos 15, KDD 15, CRISP-DM 15, Modelo 15, Modelo híbrido 15, Predicción 15, Data Warehouse 10* (Total: 100).

**Resultado real en los archivos del proyecto:**

| Tema de la Unidad 1 | Prefijo de ID | Cantidad de Ecuaciones en CSV | Documentos en CSV | Discrepancia con AGENTS.md |
|---|:---:|:---:|:---:|---|
| `01_MINERIA_DE_DATOS` | `MD-001` a `MD-015` | **15** | 15 | Coincide (15) |
| `02_KDD` | `KDD-001` a `KDD-015` | **15** | 15 | Coincide (15) |
| `03_CRISP_DM` | `CRISP-001` a `CRISP-015` | **15** | 15 | Coincide (15) |
| `04_MODELO` | `MOD-001` a `MOD-015` | **15** | 15 | Coincide (15) |
| `05_MODELO_HIBRIDO` | `MH-001` a `MH-015` | **15** | 15 | Coincide (15) |
| `06_PREDICCION` | `PRED-001` a `PRED-015` | **15** | 15 | Coincide (15) |
| `07_DATA_WAREHOUSE` | `DW-001` a `DW-015` | **15** | **10** (`DOC_DW_001` a `010`) | **Existen 15 ecuaciones físicas en disco**, pero **solo 10 documentos**. El spec menciona 10 consultas para DW. Total real en disco U1 = **105 consultas**. |

### Estado y resultados de las consultas
- **Estado:** Todas figuran como ejecutadas y consolidadas en las bitácoras (`bitacora_busquedas.csv`), con fecha `2026-09-25`, cantidad aproximada de resultados (ej. 13,941 para DW-001) y enlace `url_scholar`.
- **Resultados y documentos:** Cada ecuación tiene asignado 1 a 1 su documento canónico seleccionado con DOI y resumen metodológico (excepto `DW-011` a `DW-015` que no tienen documento asociado en `documentos_seleccionados.csv`).
- **¿El código actual permite volver a ejecutarlas automáticamente?**
  **NO.** El backend PHP no cuenta con librerías de web scraping, proxies ni conexión a APIs de Google Scholar. Las URLs están construidas para ser abiertas en el navegador por el usuario (`https://scholar.google.com/scholar?q=...`).

---

## 7. Ejecución de Código en R

### Orquestador general: `ejecutar_todo.R`
- Ubicado en la raíz del proyecto.
- Busca recursivamente todos los archivos `*.R` en `MINERIA_DATOS/` (excluyéndose a sí mismo) con `list.files(pattern = "\\.R$")`.
- Ejecuta cada script en orden alfabético mediante `source(sc)` dentro de bloques `tryCatch`.
- Solo se puede lanzar desde terminal o consola local mediante:
  `Rscript.exe ejecutar_todo.R`

### Scripts temáticos individuales
- Ubicados en `UNIDAD_X/{tema}/ejemplos_R/*.R`.
- Son reproducibles y fijan semilla (`set.seed(123)` o similar).
- **Salidas que producen:**
  - **Gráficas diagnósticas:** Formato `.png` (ej. `grafico_01_kmeans.png`), guardadas en `UNIDAD_X/{tema}/resultados/`.
  - **Tablas y métricas:** Formato `.txt` (ej. `metricas_01.txt`), guardadas en `UNIDAD_X/{tema}/resultados/`.

### ¿Se pueden lanzar desde la API?
- **SÍ.** El endpoint `api/index.php?action=run_r&u=UNIDAD_X&t=TEMA_Y` invoca `C:\Program Files\R\R-4.4.1\bin\Rscript.exe` sobre el primer archivo `.R` de la carpeta temática usando la función `exec()`, captura la salida combinada y refresca la lista de imágenes PNG y métricas TXT.

---

## 8. Generación de LaTeX y PDF

- **Archivos fuente:**
  - Documento maestro: [`latex/main.tex`](file:///c:/xampp/htdocs/api%20vehiculos%20tutoria/MINERIA_DATOS/latex/main.tex) (incluye todos los capítulos por `\input{UNIDAD_X/tema.tex}` y bibliografía `\bibliography{referencias_bibliograficas}`).
  - Archivos por tema: `UNIDAD_X/{tema}/latex/*.tex`.
  - Bibliografía: `latex/referencias_bibliograficas.bib` (42 KB).
- **Generación y compilación:**
  - **No existe ningún script ni endpoint en PHP o R que compile automáticamente el LaTeX a PDF** (no hay llamadas a `pdflatex`, `latexmk` o `xelatex`).
  - No hay archivos `.pdf` generados en el repositorio.
  - La API únicamente lee el archivo `.tex` como texto plano para entregarlo en `action=topic_data`.

---

## 9. Preguntas Problema de las 4 Unidades

- **¿Dónde están guardadas?**
  **NO están guardadas en la base de datos (no existe BD) ni en ningún archivo de la API PHP ni en los README de las unidades.**
  - Fueron introducidas formalmente en el archivo [`AGENTS.md`](file:///c:/xampp/htdocs/api%20vehiculos%20tutoria/MINERIA_DATOS/AGENTS.md) (Sección 2).
  - La API PHP no devuelve estas preguntas en ningún endpoint.

---

## 10. DOCUMENTO DE BRECHAS (Para soportar La Máquina)

A continuación se detallan las brechas identificadas entre lo que existe hoy en la API y lo que requiere "La Máquina de Minería", con propuestas aditivas que **no rompen nada de lo existente**:

| # | Requisito de La Máquina | Estado Actual de la API | Brecha Identificada | Propuesta de Solución (Sin romper nada) |
|---|---|---|---|---|
| **B1** | Preguntas problema por unidad | No existen en la API | La API no expone el "encargo" de la zona | Agregar un arreglo estático en PHP o un archivo `datos/unidades_curriculum.json` que la API pueda entregar vía `action=progress` o `action=curriculum`. |
| **B2** | Autenticación y roles | No existen en PHP | No hay login ni roles reales en backend | Implementar un archivo nuevo independiente (ej. `api/auth.php`) para manejo de sesión y roles, dejando `api/index.php` intacto. |
| **B3** | Duelo de Modelos (comparar 2 técnicas) | Los scripts R se ejecutan aisladamente por tema | La API no compara técnicas ni entrega métricas tabulares estructuradas | Crear un script R comparativo o un endpoint que lea las métricas `.txt` de dos temas y devuelva un JSON comparativo estructurado. |
| **B4** | Métricas en JSON por técnica | Solo entrega texto plano crudo en `.txt` | Difícil de graficar y comparar en tiempo real en React | En los scripts R o en un parser PHP, extraer las métricas clave y generar un `metricas.json` estructurado junto al `.txt`. |
| **B5** | Estado real por tema (estudiante vs curso) | El progreso es 100% (depende de presencia de archivos) | Para un estudiante nuevo, todo aparece "completado" desde el inicio | Agregar un archivo de persistencia local o endpoint de eventos por usuario (`datos/progreso_estudiante.json`), manteniendo el progreso global del curso como catálogo. |
| **B6** | Arrastrar y acoplar objetos en La Máquina | La API entrega datos estáticos por separado | No hay validación de si una pieza puede conectarse con la siguiente | Exponer en `action=topic_data` un grafo o matriz de dependencias que indique si el paso previo está disponible antes de acoplar. |
| **B7** | Compilación de LaTeX a PDF | Solo lectura de texto `.tex` | No se puede visualizar ni descargar el PDF de la memoria | Agregar un endpoint opcional que invoque `pdflatex` (si está instalado en el servidor) o permitir la previsualización en frontend con KaTeX / descarga del `.tex`. |
| **B8** | Bitácora y matriz PRISMA en `topic_data` | Solo lee `ecuaciones_busqueda.csv` y `documentos_seleccionados.csv` | La bitácora y la matriz de análisis existen en disco pero la API las ignora | Extender la respuesta de `topic_data` para incluir las filas de `bitacora_busquedas.csv` y `matriz_analisis.csv`. |

---

## 11. Dudas y Aspectos no Confirmados

1. **Discrepancia en las 100 consultas:** El tema `07_DATA_WAREHOUSE` tiene 15 ecuaciones en disco (`DW-001` a `DW-015`), pero `AGENTS.md` dice que son 10. Las primeras 10 tienen documento asociado (`DOC_DW_001` a `DOC_DW_010`) y las últimas 5 no. ¿Debemos mostrar las 15 en la interfaz o solo las primeras 10 como originales?
2. **Compilador LaTeX disponible en el servidor:** No se pudo confirmar si en el entorno Windows de XAMPP está instalado MiKTeX o TeX Live en el PATH para permitir compilación de PDF desde la API.
3. **Persistencia de interacciones en La Máquina:** Si el usuario arrastra un objeto o ejecuta un paso en La Máquina, ¿debe guardarse el estado del estudiante en un archivo JSON en el servidor (ej. `datos/sesion_estudiante.json`) o en `localStorage` del navegador?
