# Reporte de Fase 5: Integridad Metodológica, Auditoría de Datasets y Preparación para La Máquina

**Proyecto:** Ruta del Conocimiento: La Máquina de Minería  
**Referencia:** `AGENTS.md` (§1, §3, §8, §10 y §11), Hoja de ruta Fase 5  
**Fecha:** Octubre 2026  
**Estado:** Completado (Fase 5 Reducida / Un commit por bloque)

---

## 1. Resumen Ejecutivo

En la **Fase 5**, el proyecto atravesó un proceso riguroso de auditoría científica, saneamiento de rutas y transparencia metodológica, ajustado al cambio de cronograma orientado a dejar el sistema completamente listo para la construcción de **La Máquina** (Fase 6).

Siguiendo el principio de **cero invención de datos y máxima veracidad académica**:
- **Cero cambios destructivos en la API PHP (`api/index.php`):** La API existente se conservó 100% intacta.
- **Rutas autocontenidas:** Se eliminaron las dependencias de carpetas externas (`.../proyecto/`) en los scripts de la Unidad 1, asegurando que todos los resultados gráficos y métricas se generen dentro del árbol canónico del repositorio.
- **Honestidad científica en la Unidad 4:** Se desmantelaron discrepancias estadísticas en el benchmark de deserción estudiantil. Se reemplazaron afirmaciones infundadas ("dataset oficial de UCI", "88.6% de exactitud", "modelo campeón") por las cifras exactas y reproducibles de la muestra didáctica local de 500 registros (150 en prueba, 3 casos positivos reales, 98.00% de exactitud, 0.00% de sensibilidad y baseline de clase mayoritaria del 98.00%).
- **Esquema común de `metricas.json`:** Se homogeneizó la estructura JSON de resultados en los temas auditados (U1-01, U1-04, U1-05 y U4-02), con cálculo formal de baselines sobre partición de prueba y marcas temporales vivas de ejecución en R.
- **Clasificación exhaustiva de los 24 datasets:** Se catalogaron los datos de todos los temas bajo 5 categorías de integridad (`real_completo`, `parcial_no_verificado`, `tipo_UCI_no_verificado`, `sintetico` y `conceptual`), incorporando `categoria_origen` y `nota_integridad` en los archivos `metadata.json`.

---

## 2. Detalle de Bloques Ejecutados

### 2.1 Bloque A: Infraestructura, Servicios y Tipado
1. **Unificación Curricular:** Nombres de las unidades en `unidades_curriculum.json` unificados exactamente con `AGENTS.md` §2.
2. **Servicio Frontend de Métricas Frescas:** Implementación de bypass de caché (`bypassCache: true`) en `unitService.ts` / `metricsService.ts` para que las llamadas tras la ejecución de R reflejen métricas recién calculadas.
3. **Auditoría de Bitácoras y Matrices:** Verificación física de la existencia de `bitacora_busquedas.csv` y matrices bibliográficas en cada unidad.
4. **Verificación Estática:** `npx tsc --noEmit` verificado con cero errores de compilación en el frontend de TypeScript.

### 2.2 Bloque B Reducido: Saneamiento de Scripts R y Rutas

#### A. Corrección U3-05 (Reglas de Asociación Apriori)
- **Problema previo:** Fallo en la asignación de nombres de métricas y riesgo de descriptores de salida huérfanos si fallaba `arules`.
- **Solución aplicada:** Se aplicó `unname()` a los vectores de reglas y se envolvió la ejecución en un bloque `tryCatch` con cláusula `finally` que asegura el cierre del sink (`sink(type = "output")`). El script genera sus resultados limpios sin alterar el texto de salida.

#### B. Saneamiento de Rutas en la Unidad 1 (U1-01 a U1-07)
- **Problema previo:** Los 7 scripts de U1 apuntaban mediante rutas absolutas rígidas hacia un directorio externo del servidor Apache (`c:/xampp/htdocs/api vehiculos tutoria/proyecto/...`), copiando allí los PNG y leyendo/escribiendo fuera del repositorio.
- **Solución aplicada:**
  - Se redefinieron `dir_res` y `dir_latex` usando rutas relativas internas (`resultados/` y `../latex/figuras/`).
  - Se eliminaron las llamadas `file.copy()` hacia la carpeta externa.
  - Se re-ejecutaron los 7 scripts individualmente: los archivos de texto `metricas_0*.txt` se mantuvieron idénticos (`git diff` vacío en `.txt`). La carpeta externa quedó intacta.

#### C. Sinceramiento Metodológico en la Unidad 4 (U4-01 a U4-04)
- **Script `02_benchmark_proyecto.R`:**
  - Lectura de la muestra local de 500 registros (`higher_education_dropout_dataset.csv`).
  - Cálculo de la partición de prueba (150 registros, 3 positivos).
  - Métricas de prueba reales: CART (98.00% exactitud, 0.00% sensibilidad, F1: NA), Regresión Logística (98.00% exactitud, 0.00% sensibilidad, F1: NA), Red Neuronal MLP (98.00% exactitud, 0.00% sensibilidad, F1: NA), Random Forest (98.00% exactitud, 0.00% sensibilidad, F1: NA).
  - Cálculo formal del baseline de clase mayoritaria: $147 / 150 = 98.00\%$. Ningún modelo supera el baseline (`supera_baseline: FALSE`).
  - Inclusión de columnas `N_Total: 500` y `Positivos_Total: 5` en `benchmark_resultados.csv`.
- **Script `04_sustentacion_resultados.R`:**
  - Sustitución de afirmaciones sobre el "dataset oficial completo de UCI" por la aclaración explícita de que **NO** se usó el dataset completo de UCI (4,424 filas y 37 variables), sino una muestra didáctica de 500 registros inspirada en dicha estructura.
- **Script `03_documentacion.R`:**
  - Sustitución del valor estático manual "11/11 secciones" por escaneo dinámico en R: `length(grep('^\\\\section\\{', lines))`.
- **Documentación TeX y READMEs de U4:**
  - Reescritura completa de `proyecto_documentacion.tex` (las 11 secciones) y `sustentacion_presentacion.tex`.
  - Reescritura de los README de U4-01 a U4-04.
  - Eliminación absoluta de cifras infundadas (88.6%, 84.2%, 0.89, "modelo campeón", etc.).

---

## 3. Estandarización de `metricas.json`

Se aplicó un esquema estandarizado común en los temas representativos de modelado y analítica:

```json
{
  "estado": "ok",
  "tema_id": "U1-04",
  "tipo_tarea": "clasificacion_supervisada",
  "dataset": "Población clínica simulada de 800 casos generada por el script R",
  "dataset_origen": "sintetico",
  "origen_metricas": "ejecucion_r",
  "fecha_ejecucion": "2026-10-09 03:33:04",
  "archivos_graficos": ["figura_curvas_roc.png", "figura_importancia_predictores.png"],
  "baseline_mayoritaria": 0.57,
  "supera_baseline": true,
  "metricas": { ... },
  "modelos": [ ... ],
  "interpretacion": "Texto literal extraído del .txt"
}
```

- **U1-01:** Tarea de clustering; `baseline_mayoritaria` y `supera_baseline` fijados formalmente en `null`.
- **U1-04:** Población simulada de 800 casos; baseline de clase mayoritaria en prueba del 57.00%; los 4 modelos superan el baseline (`supera_baseline: true`).
- **U1-05:** Modelo global verificado como CART (`rpart`, 89.33% exactitud) e híbrido como `K-Means + GLM locales` (86.67% exactitud); baseline de clase mayoritaria en prueba del 90.67%; `supera_baseline: false`.
- **U4-02:** Benchmark de deserción en prueba (150 registros); 4 modelos con 98.00% exactitud y 0.00% sensibilidad; baseline del 98.00%; `supera_baseline: false`.

---

## 4. Clasificación y Auditoría de los 24 Datasets

Cada uno de los 24 temas cuenta con su ficha técnica `metadata.json` enriquecida con `categoria_origen` y `nota_integridad`:

| Categoría | Total | Temas | Justificación Metodológica |
|---|:---:|---|---|
| `real_completo` | 3 | U1-01 (Iris: 150×5), U1-02 (AirQuality: 153×6), U1-06 (AirPassengers: 144) | Idénticos en estructura y dimensiones a las fuentes canónicas oficiales. |
| `parcial_no_verificado` | 1 | U3-03 (Wholesale Customers: 440×5) | Mismo volumen de filas que UCI (440), pero con 5 variables y distribución de canales divergente. |
| `tipo_UCI_no_verificado` | 5 | U2-04 (Banknote: 300×4), U3-01 (Bank Marketing: 450×5), U3-02 (Pima: 400×6), U4-01 (Higher Ed: 500×7), U4-02 (Higher Ed: 500×7) | Estructuras inspiradas en benchmarks de UCI pero con menor dimensionalidad o registros didácticos. |
| `sintetico` | 10 | U1-03, U1-04, U1-05, U1-07, U2-03, U2-06, U3-04, U3-05, U3-06, U3-07 | Datos simulados generados por scripts o provistos para fines pedagógicos controlados. |
| `conceptual` | 5 | U2-01, U2-02, U2-05, U4-03, U4-04 | Matrices cualitativas, taxonómicas y tablas de seguimiento de hitos/gestión. |

Se creó además la ficha técnica faltante en `UNIDAD_4/02_APLICACION_TECNICAS/datos/metadata.json`, garantizando cobertura en los 24 temas.

---

## 5. Actualizaciones Documentales

1. **`README.md` (Raíz):**
   - Tabla oficial actualizada con las cifras reales del repositorio: 360 ecuaciones, 127 documentos seleccionados, 26 datasets, 24 scripts R y 26 documentos LaTeX.
   - Aclaración expresa de que la correspondencia biunívoca (1 a 1) consulta-documento aplica exclusivamente a la Unidad 1.
   - Transparencia en la catalogación de datasets conforme a las 5 categorías oficiales.
2. **`AGENTS.md` (§8):**
   - Hito de avance actualizado de *"primer documento LaTeX generado"* a *"primer documento LaTeX revisado"*, reflejando fielmente la arquitectura basada en archivos preexistentes.

---

## 6. Estado Actual del Sistema (`action=progress`)

Verificado contra la API PHP en ejecución local:
- **Temas Totales:** 24 / 24
- **Búsquedas Registradas:** 360 (105 U1 + 90 U2 + 105 U3 + 60 U4)
- **Documentos Seleccionados:** 127 (100 U1 + 16 U2 + 7 U3 + 4 U4)
- **Datasets:** 26 (7 U1 + 6 U2 + 9 U3 + 4 U4)
- **Scripts de R:** 24 (7 U1 + 6 U2 + 7 U3 + 4 U4)
- **Documentos LaTeX:** 26 (7 U1 + 6 U2 + 7 U3 + 6 U4)
- **Progreso Global:** 100% en evidencias físicas registradas.

---

## 7. Próximos Pasos (Fase 6: La Máquina)

Con la integridad de datos, métricas y scripts saneada al 100%, queda expedito el camino para:
1. **Línea de Producción Visual en `MachineView.tsx`:** Estaciones operables (Terminal, Biblioteca, Laboratorio, Escritorio, Pizarra).
2. **Mecánica Drag & Drop:** Acople condicional basado en la existencia real de artefactos.
3. **Disparadores Reales:** Ejecución en vivo de `run_r` y visualización inmediata de gráficos y tablas resultantes.
4. **Capa RPG del Operador:** Rango e hitos calculados dinámicamente en función del recorrido real del usuario por las estaciones.
