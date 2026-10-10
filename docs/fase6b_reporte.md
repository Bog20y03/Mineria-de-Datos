# Reporte de Fase 6 — Entrega 6B: Estaciones Restantes y Pulido de La Máquina

**Proyecto:** Ruta del Conocimiento: La Máquina de Minería  
**Referencia:** `AGENTS.md` (§1, §7, §8, §9, §11), `docs/fase6_reporte.md`  
**Fecha:** Octubre 2026  
**Estado:** Entrega 6B Finalizada (Código completo, TypeScript verificado con 0 errores, esperando confirmación del usuario para `npm run build`).

---

## 1. Paso 0: Auditoría de Confiabilidad de `run_r` en los 24 Temas

Se ejecutó secuencialmente `run_r` mediante llamadas HTTP POST a la API real de Apache (`api/index.php?action=run_r`) para los 24 temas del currículo oficial. Posteriormente se descartaron con `git restore` los archivos `metricas.json` que solo cambiaron por marca de tiempo, dejando el árbol de trabajo limpio.

| Unidad | Código Tema | Nombre del Tema | exit_code | Tiempo (s) | Gráficas Generadas | Confiable para Demostración |
|---|---|---|:---:|:---:|---|:---:|
| **U1** | 01_MINERIA_DE_DATOS | Minería de Datos | 0 | 0.98s | `grafico_01_mineria_datos.png` | **Sí (100%)** |
| **U1** | 02_KDD | Procesos KDD | 0 | 0.88s | `grafico_02_KDD.png` | **Sí (100%)** |
| **U1** | 03_CRISP_DM | Metodología CRISP-DM | 0 | 0.79s | `grafico_03_CRISP_DM.png` | **Sí (100%)** |
| **U1** | 04_MODELO | Modelo | 0 | 1.18s | `grafico_04_modelos.png` | **Sí (100%)** |
| **U1** | 05_MODELO_HIBRIDO | Modelo Híbrido | 0 | 1.10s | `grafico_05_modelos_hibridos.png` | **Sí (100%)** |
| **U1** | 06_PREDICCION | Predicción | 0 | 0.91s | `grafico_06_prediccion.png` | **Sí (100%)** |
| **U1** | 07_DATA_WAREHOUSE | Almacén de Datos | 0 | 0.88s | `grafico_07_data_warehouse.png` | **Sí (100%)** |
| **U2** | 01_MODELOS_MINERIA_DATOS | Modelos de Minería | 0 | 0.67s | `grafico_01_modelos.png` | **Sí (100%)** |
| **U2** | 02_METODOS_MINERIA_DATOS | Métodos de Minería | 0 | 0.65s | `grafico_02_metodos.png` | **Sí (100%)** |
| **U2** | 03_ARBOL_CLASIFICACION | Árboles de Clasificación | 0 | 0.71s | `grafico_03_arbol.png` | **Sí (100%)** |
| **U2** | 04_REDES_NEURONALES | Redes Neuronales | 0 | 0.91s | `grafico_04_red_neuronal.png` | **Sí (100%)** |
| **U2** | 05_APLICACION_MINERIA_DATOS | Aplicación de la Minería | 0 | 0.63s | `grafico_05_aplicacion.png` | **Sí (100%)** |
| **U2** | 06_MINERIA_DATOS_EDUCACION | Minería en Educación | 0 | 0.67s | `grafico_06_educacion.png` | **Sí (100%)** |
| **U3** | 01_ARBOL_DECISION | Árboles de Decisión | 0 | 0.67s | `grafico_01_arbol_decision.png` | **Sí (100%)** |
| **U3** | 02_REDES_NEURONALES | Redes Neuronales U3 | 0 | 0.74s | `grafico_02_redes_neuronales.png` | **Sí (100%)** |
| **U3** | 03_CLUSTERES | Clústeres | 0 | 0.77s | `grafico_03_clusteres.png` | **Sí (100%)** |
| **U3** | 04_SERIES_TIEMPO | Series de Tiempo | 0 | 0.74s | `grafico_04_series_tiempo.png` | **Sí (100%)** |
| **U3** | 05_ASOCIACION_DEPENDENCIA | Asociación Apriori | 0 | 0.77s | `grafico_05_asociacion.png` | **Sí (100%)** |
| **U3** | 06_VALIDACION_DATOS | Validación Erróneos | 0 | 0.80s | `grafico_06_validacion.png` | **Sí (100%)** |
| **U3** | 07_INTEGRACION_PARTICION_DATOS | Integración y Partición | 0 | 1.77s | `grafico_07_integracion.png` | **Sí (100%)** |
| **U4** | 01_SELECCION_BASE_DATOS | Selección Base Datos | 0 | 0.77s | `grafico_01_seleccion.png` | **Sí (100%)** |
| **U4** | 02_APLICACION_TECNICAS | Aplicación Técnicas | 0 | 0.83s | `grafico_02_benchmark_proyecto.png` | **Sí (100%)** |
| **U4** | 03_DOCUMENTACION | Documentación Proyecto | 0 | 0.63s | `grafico_03_documentacion.png` | **Sí (100%)** |
| **U4** | 04_SUSTENTACION_RESULTADOS | Sustentación Resultados | 0 | 0.60s | `grafico_04_sustentacion.png` | **Sí (100%)** |

**Conclusión del Paso 0:** Los 24 temas del proyecto se ejecutan con `exit_code: 0`, generan sus gráficas en menos de 1.8 segundos y son 100% reproducibles y confiables para la demostración académica.

---

## 2. Implementación de las 5 Estaciones de La Máquina

1. **Visibilidad Global desde el Inicio:**
   - La cabecera cartográfica incluye una cinta inferior de vista previa rápida con las 5 estaciones (número de consultas, documentos indexados, archivos de dataset/script, nombre del manuscrito .tex y balance de evidencias).
   - Cualquier estación se puede seleccionar con un solo clic para desplazar al operador hacia ella sin restricciones.

2. **Estación 1: Terminal:**
   - Visualización en solo lectura de las ecuaciones booleanas del tema (ID canónico, idioma, nivel y fórmula booleana formateada).
   - Enlace directo a Google Scholar para cada ecuación.
   - Botón de acción accesible *"Transferir Consulta a la Biblioteca"*: registra la estación en `localStorage` y desliza al operador a la siguiente estación.

3. **Estación 2: Biblioteca:**
   - Catálogo de artículos científicos seleccionados (título, autores, año, journal/fuente y pertinencia metodológica).
   - Enlace oficial DOI (`https://doi.org/...`) o indicación explícita *"Sin DOI registrado"*.
   - Botón *"Transferir Acervo al Laboratorio"*: vincula el contexto documental a la estación experimental.

4. **Estación 3: Laboratorio:**
   - Validación de acople de dataset CSV y script R.
   - Ejecución interactiva contra `api/index.php?action=run_r`.
   - Consola en vivo con `exit_code` y texto completo.
   - Galería de gráficas con animación de revelado escalonado.
   - Panel de métricas estructuradas (`metricas.json` o extracto textual `.txt`).
   - Botón *"Enviar al Escritorio"*: transfiere los resultados cuantitativos a la estación de redacción.

5. **Estación 4: Escritorio:**
   - Visor de código fuente `.tex` real del tema, preformateado en tipografía monoespaciada con scroll y contraste formal.
   - Contador de caracteres y líneas del manuscrito.
   - Botón *"Copiar .tex"*: copia el código directamente al portapapeles con confirmación visual.
   - Botón *"Descargar .tex"*: genera la descarga del archivo `.tex` local.
   - Cumplimiento de AGENTS.md §11: aclaración explícita de que el LaTeX se expone como texto reproducible sin compilación forzada a PDF.
   - Botón *"Enviar a Pizarra"*: transfiere el documento formal a la estación de sustentación.

6. **Estación 5: Pizarra:**
   - Síntesis integral de evidencias para la sustentación del proyecto:
     - **1. Fundamentación Temática:** Lectura del archivo `README.md` oficial del tema.
     - **2. Evidencias Gráficas:** Galería completa de las figuras generadas en R.
     - **3. Métricas y Validación Experimental:** Dataset de prueba, baseline de clase mayoritaria, indicador `supera_baseline`, tabla de modelos e interpretación literal.
   - Botón *"Concluir Sustentación del Tema"*: registra la quinta estación operada y activa el banner de atlas de línea de producción completada (5 de 5).

---

## 3. Pulido Visual y Mecánicas de Interacción

- **Estaciones que se Encienden:** Al completar una estación, el pin se ilumina con halo azul sutil (`station-light-up`), checkmark `✓` y fondo azul de atlas.
- **Bahía de Encaje Animada:** Efecto de encaje suave (`dock-snap` y `dock-zone-hover`) al acoplar piezas en la bahía de trabajo.
- **Avatar "Operador" Siempre Visible:** Marcador flotante terracota con flecha direccional que viaja hacia el nodo activo de la pista.
- **Contador en Tiempo Real:** Actualización inmediata de *"Estaciones operadas: X de 5"* y botón para reiniciar el recorrido del tema.
- **Manejo Riguroso de Estados:** Cada estación posee estado de carga (`Loader2`), estado vacío (`EmptyState` con *"Sin datos registrados"*) y control de error sin simulación de datos.

---

## 4. Archivos Modificados

- `frontend/src/components/Machine/MachineView.tsx`: Implementación completa de las 5 estaciones interactivas, transferencias, visor de LaTeX, síntesis de Pizarra y controles de recorrido.
- `frontend/src/index.css`: Keyframes y clases de animación (`stationLightUp`, `dockSnap`, `dock-zone-hover`).
- `docs/fase6b_reporte.md`: Este documento de registro.

---

## 5. Verificaciones y Estado de Entrega

1. **Compilación TypeScript:** `npx tsc --noEmit` verificado con **0 errores**.
2. **Servidor y API:** Vite en `http://localhost:5174/` y Apache XAMPP en puerto 80 sincronizados y operativos.
3. **Paso 0:** 24 temas verificados con `exit_code: 0`.
4. **Git:** Modificaciones acotadas exclusivamente a los archivos indicados (sin tocar `api/index.php` ni incluir resultados regenerados de R).
