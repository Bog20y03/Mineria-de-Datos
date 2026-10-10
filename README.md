# MÁQUINA VIRTUAL — SISTEMA INTEGRAL DE MINERÍA DE DATOS
## Versión Curricular Jerárquica: 4 Unidades Académicas | 24 Temas de Investigación | Laboratorio en R | Documentación LaTeX

---

## 1. Visión General del Sistema

Esta versión de la **Máquina Virtual de Minería de Datos** constituye un entorno integrado de investigación científica y laboratorio computacional organizado jerárquicamente bajo la estructura:

$$\text{UNIDAD} \longrightarrow \text{TEMA} \longrightarrow \text{BÚSQUEDAS} \longrightarrow \text{DOCUMENTOS} \longrightarrow \text{DATOS} \longrightarrow \text{R} \longrightarrow \text{RESULTADOS} \longrightarrow \text{LATEX} \longrightarrow \text{AVANCE}$$

El sistema integra:
* **360 ecuaciones de búsqueda académica** distribuidas en los 24 temas (U1: 105, U2: 90, U3: 105, U4: 60). La correspondencia estricta 1 a 1 entre consulta y documento aplica exclusivamente en la Unidad 1 (100 consultas originales y 100 documentos; DW-011..DW-015 adicionales sin documento asociado). En las Unidades 2 a 4 se dispone de un acervo selecto y representativo de referencias seminales.
* **127 documentos académicos seleccionados** (U1: 100, U2: 16, U3: 7, U4: 4).
* **26 datasets tabulares** clasificados con rigor técnico en 5 categorías de integridad: reales completos (3 temas), parciales no verificados (1 tema), muestras tipo UCI no verificadas (5 temas), sintéticos/simulados (10 temas) y conceptuales (5 temas).
* **24 scripts ejecutables en R (v4.4.1)** con generación automática de gráficos diagnósticos `.png`, reportes numéricos `.txt` y métricas estructuradas en `.json`.
* **26 documentos en LaTeX** (`latex/main.tex` y capítulos por unidad y tema).
* **Aplicativo Web Interactivo** (`index.php`) con cálculo dinámico de avance, visor de recursos y botón para **ejecutar scripts de R en tiempo real**.

---

## 2. Estructura Jerárquica del Proyecto

```text
MINERIA_DATOS/
│
├── UNIDAD_1/                      # Conceptos Fundamentales de Minería de Datos
│   ├── 01_MINERIA_DE_DATOS/       # 15 búsquedas, 15 docs reales, R K-Means
│   ├── 02_KDD/                    # 15 búsquedas, 15 docs reales, R 5 fases KDD
│   ├── 03_CRISP_DM/               # 15 búsquedas, 15 docs reales, R 6 fases CRISP-DM
│   ├── 04_MODELO/                 # 15 búsquedas, 15 docs reales, R benchmark multimodelo
│   ├── 05_MODELO_HIBRIDO/         # 15 búsquedas, 15 docs reales, R híbrido bi-etapa
│   ├── 06_PREDICCION/             # 15 búsquedas, 15 docs reales, R Holt-Winters
│   └── 07_DATA_WAREHOUSE/         # 10 búsquedas, 10 docs reales, R ETL Star Schema
│
├── UNIDAD_2/                      # Modelos y Técnicas de Minería de Datos
│   ├── 01_MODELOS_MINERIA_DATOS/  # Taxonomía, modelos predictivos y descriptivos
│   ├── 02_METODOS_MINERIA_DATOS/  # Supervisados, no supervisados, clustering, asociación
│   ├── 03_ARBOL_CLASIFICACION/    # Algoritmo CART, impureza Gini, poda (rpart)
│   ├── 04_REDES_NEURONALES/       # Perceptrón multicapa, backpropagation (nnet)
│   ├── 05_APLICACION_MINERIA_DATOS/ # Casos en CRM, Finanzas, Salud y E-commerce
│   └── 06_MINERIA_DATOS_EDUCACION/# Educational Data Mining (EDM) y Analítica del Aprendizaje
│
├── UNIDAD_3/                      # Aplicaciones Prácticas con Datasets Reales
│   ├── 01_ARBOL_DECISION/         # Dataset UCI Bank Marketing / Telemarketing bancario
│   ├── 02_REDES_NEURONALES/       # Dataset UCI Pima Indians Diabetes / Diagnóstico clínico
│   ├── 03_CLUSTERES/              # Dataset UCI Wholesale Customers / Segmentación
│   ├── 04_SERIES_TIEMPO/          # Dataset Demanda Eléctrica Mensual / Pronóstico STL
│   ├── 05_ASOCIACION_DEPENDENCIA/ # Dataset Market Basket Groceries / Reglas de Asociación
│   ├── 06_VALIDACION_DATOS/       # Pipeline de detección de outliers, NAs y limpieza
│   └── 07_INTEGRACION_PARTICION_DATOS/ # Integración relacional y partición estratificada
│
├── UNIDAD_4/                      # Proyecto Integrador
│   ├── 01_SELECCION_BASE_DATOS/   # UCI Higher Education Students Dropout / Formulación
│   ├── 02_APLICACION_TECNICAS/    # Benchmark comparativo (GLM vs CART vs MLP)
│   ├── 03_DOCUMENTACION/          # Documento LaTeX en 11 secciones formales
│   └── 04_SUSTENTACION_RESULTADOS/# Resumen ejecutivo y diapositivas Beamer
│
├── busquedas/                     # Maestro consolidado de consultas
├── documentos/                    # Matriz bibliográfica consolidada y BibTeX
├── ejemplos_R/                    # Scripts maestros de todas las unidades
├── latex/                         # Documentación LaTeX unificada y main.tex
│   ├── UNIDAD_1/
│   ├── UNIDAD_2/
│   ├── UNIDAD_3/
│   ├── UNIDAD_4/
│   ├── figuras/
│   ├── main.tex
│   └── referencias_bibliograficas.bib
│
├── api/                           # Backend PHP para cálculo de progreso y ejecución de R
│   └── index.php
├── index.php                      # Interfaz web gráfica interactiva de la Máquina Virtual
└── ejecutar_todo.R                # Orquestador general de ejecución de R
```

---

## 3. Estructura Interna de Cada Carpeta Temática

Cada uno de los 24 temas cuenta con la estructura estandarizada:
```text
TEMA/
├── busquedas/      # Ecuaciones booleanas y bitácora con enlaces directos a Google Scholar
├── documentos/     # Artículos científicos reales seleccionados y matriz de análisis
├── datos/          # Datasets públicos en CSV con metadata.json completa
├── ejemplos_R/     # Script en R reproducible, parametrizado y autodocumentado
├── resultados/     # Gráficos diagnósticos en alta resolución (.png) y métricas (.txt)
├── latex/          # Capítulo o avance en formato LaTeX (.tex)
└── README.md       # Documento técnico con objetivos y fundamentación conceptual
```

---

## 4. Cómo Iniciar y Visualizar la Máquina Virtual

### Opción A: A través de XAMPP (Apache)
1. Inicia el módulo **Apache** en el Panel de Control de XAMPP.
2. Abre tu navegador web e ingresa a:
   `http://localhost/api%20vehiculos%20tutoria/MINERIA_DATOS/`
3. Navegarás por la interfaz gráfica interactiva con el panel de progreso y las pestañas de cada tema.

### Opción B: Mediante el Servidor Integrado de PHP (Sin configurar Apache)
Ejecuta en PowerShell:
```powershell
cd "c:\xampp\htdocs\api vehiculos tutoria\MINERIA_DATOS"
php -S localhost:8000
```
Luego abre en tu navegador: `http://localhost:8000`

### Opción C: Ejecución Completa del Laboratorio en R
Para reproducir de extremo a extremo todos los modelos, gráficos y reportes en R:
```powershell
& "C:\Program Files\R\R-4.4.1\bin\Rscript.exe" "c:\xampp\htdocs\api vehiculos tutoria\MINERIA_DATOS\ejecutar_todo.R"
```

---

## 5. Matriz de Seguimiento del Avance

| Unidad Académica | Temas | Ecuaciones | Documentos Seleccionados | Datasets | Scripts en R | Documentos LaTeX | Estado |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Unidad 1: Conceptos sobre Minería de Datos** | 7 | 105 | 100 | 7 | 7 | 7 | **100% Completada** |
| **Unidad 2: Modelos y Técnicas de Minería** | 6 | 90 | 16 | 6 | 6 | 6 | **100% Completada** |
| **Unidad 3: Aplicaciones con Diferentes Técnicas** | 7 | 105 | 7 | 9 | 7 | 7 | **100% Completada** |
| **Unidad 4: Proyecto** | 4 | 60 | 4 | 4 | 4 | 6 | **100% Completada** |
| **TOTAL SISTEMA** | **24** | **360** | **127** | **26** | **24** | **26** | **100% OPERATIVO** |

> **Notas de Integridad y Metodología:**
> 1. **Correspondencia de Búsquedas y Documentos:** La relación estricta 1 a 1 entre búsqueda booleana y documento seleccionado aplica únicamente en la Unidad 1 (100 consultas y 100 documentos; DW-011 a DW-015 son ecuaciones adicionales sin documento). En las Unidades 2 a 4 se seleccionó un acervo selecto y representativo de referencias seminales.
> 2. **Clasificación Técnica de Datasets en los 24 Temas:**
>    - **real_completo (3 temas):** U1-01 (iris), U1-02 (airquality), U1-06 (AirPassengers).
>    - **parcial_no_verificado (1 tema):** U3-03 (Wholesale Customers).
>    - **tipo_UCI_no_verificado (5 temas):** U2-04 (Banknote), U3-01 (Bank Marketing), U3-02 (Pima Diabetes), U4-01 (Higher Education), U4-02 (Higher Education).
>    - **sintetico (10 temas):** U1-03, U1-04, U1-05, U1-07, U2-03, U2-06, U3-04, U3-05, U3-06, U3-07.
>    - **conceptual (5 temas):** U2-01, U2-02, U2-05, U4-03, U4-04.

---

## 6. Rigor Metodológico y Calidad Académica
* **Cero datos inventados:** Todos los artículos corresponden a autores canónicos (Breiman, Quinlan, Fayyad, Hastie, Rumelhart, Romero, Agrawal, etc.) con sus identificadores DOI legítimos.
* **Transparencia en datasets:** Cada conjunto de datos declara explícitamente en su ficha `metadata.json` su naturaleza (real completo, tipo UCI no verificado, sintético en memoria o conceptual) y si es consumido directamente o no por el script de R.
* **Reproducibilidad:** Todos los scripts de R fijan semillas pseudoaleatorias (`set.seed`) para garantizar idénticos resultados numéricos en cualquier entorno.
