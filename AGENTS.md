# AGENTS.md — Ruta del Conocimiento: La Máquina de Minería

Instrucciones permanentes para todo agente que trabaje en este proyecto. Léelas antes de cada tarea.

## 1. Misión y concepto

Plataforma académica de Minería de Datos organizada en 4 unidades → temas → búsquedas, documentos, datasets, ejemplos en R, resultados y LaTeX.

Las actividades de cada tema (búsquedas, documentos, ejemplos en R, resultados, LaTeX) **ya están automatizadas** en el proyecto. La interfaz no reemplaza esa automatización: **la hace visible y demostrable**.

Concepto: **"La Máquina de Minería"**, una línea de producción del conocimiento donde los objetos del proyecto son piezas que viajan e interactúan entre estaciones:

consulta booleana → documentos → dataset + script R → gráficas y tablas → LaTeX → sustentación

Cuatro capas que comparten los mismos datos reales:

1. **La Máquina:** estaciones con objetos que se arrastran y se acoplan. Cada interacción dispara una acción real de la API o de R.
2. **Atlas de técnicas:** un clip animado (Manim) por técnica que explica cómo funciona.
3. **Duelo de modelos:** dos técnicas comparadas sobre el mismo dataset con métricas reales de R.
4. **Modo sustentación:** la máquina recorre el proceso sola, con narración, para presentar el proyecto.

Requisitos del docente: interacción entre objetos, banners que se muevan, uso de Manim y Remotion, y un enfoque creativo.

**Regla de oro:** todo lo que se pueda hacer en La Máquina debe poder hacerse también en el modo Directo (tablas y vistas clásicas, sin animación).

## 2. Preguntas problema (mostrar al entrar a cada unidad)

- **Unidad 1. Conceptos sobre minería de datos:** ¿Qué aplicaciones empresariales encuentra para la minería de datos y cómo las puede aprovechar en su vida profesional?
- **Unidad 2. Modelos y técnicas de la minería de datos:** ¿Cómo las matemáticas son aprovechadas para desarrollar técnicas y modelos de minería que posteriormente son sintetizados en algoritmos para desarrollar estrategias de negocio como ecommerce, marketing, entre otros?
- **Unidad 3. Aplicaciones con diferentes técnicas de minería:** ¿Cómo aplicar diferentes técnicas de minería de datos a bases de datos existentes en empresas o bases de datos gubernamentales?
- **Unidad 4. Proyecto:** ¿Cómo aplicar las técnicas de minería de datos en proyectos propios?

## 3. Reglas no negociables

- NO reemplazar, reescribir ni eliminar la API PHP existente. React es solo frontend consumidor.
- La API **no tiene autenticación ni roles**. La versión 1 es de un solo usuario (demostración). Si más adelante se agrega login, será de forma aditiva (por ejemplo `api/auth.php`), sin tocar `api/index.php`.
- Las **100 consultas ya están hechas**. NO eliminarlas, regenerarlas ni modificarlas, y conservar sus ID. Distribución: Minería de datos 15, KDD 15, CRISP-DM 15, Modelo 15, Modelo híbrido 15, Predicción 15, Data Warehouse 10. En disco, Data Warehouse tiene 15 ecuaciones (DW-001 a DW-015): las 10 primeras son las originales y DW-011 a DW-015 son adicionales sin documento asociado. Mostrar ambas, diferenciadas, sin borrar ninguna. En la interfaz se muestran como historial con fecha, idioma, estado y resultados. Volver a ejecutarlas solo si el código actual ya lo permite.
- El proyecto **no usa base de datos**: todo vive en archivos (CSV, JSON, `.R`, `.tex`, `.png`). No introducir una base de datos ni cambiar el formato de esos archivos sin avisar antes.
- NO inventar datos, referencias, DOI, autores, métricas ni resultados. Si falta un dato, mostrar "Sin datos registrados".
- Los mocks solo van en `src/data/mocks/`, separados de los datos reales.
- NO romper endpoints ni funcionalidades existentes.
- NO simular acciones: un botón o una interacción ejecuta algo real o indica que está pendiente.
- NO exponer datos personales, claves ni rutas privadas.
- Prioridad: funcionalidad existente → integración PHP → datos reales → La Máquina → diseño → animaciones.

## 4. Forma de trabajar

- Trabaja **por fases y por tareas pequeñas**. No avances a la siguiente sin reportar y esperar confirmación.
- Antes de modificar código: analiza la estructura, la API PHP, las carpetas y la base de datos, y reutiliza lo que existe.
- Presenta un plan corto antes de cambios grandes.
- Al terminar cada fase informa: archivos creados, archivos modificados, qué se verificó y qué quedó pendiente.
- No modifiques archivos existentes que no necesites tocar.
- Si algo contradice estas instrucciones, pregunta en lugar de improvisar.
- Pide confirmación antes de comandos destructivos (borrar, migrar, resetear).

## 5. Tecnologías

- Frontend: React + TypeScript (Vite), React Router, CSS moderno con variables. No agregar frameworks de estilos sin justificarlo.
- Backend: PHP existente. R existente (`ejecutar_todo.R` y ejemplos).
- Fórmulas: KaTeX.
- **Remotion:** banners animados e intros que reciben datos reales como parámetros (usando su reproductor para React). No es el motor de La Máquina.
- **Manim Community Edition:** clips del Atlas de técnicas y video del manual, renderizados de antemano y guardados como video. Carpeta aparte (`video_manim/`).
- Voz del video: sintética en español con `manim-voiceover` y motor gratuito. No usar servicios de pago ni claves sin autorización.
- Interacción de La Máquina: HTML/CSS/SVG con arrastrar y soltar. No usar motores de juego.

## 6. Arquitectura React

```text
src/
├── components/ (Machine, Stations, Atlas, Duel, Presentation, Banners,
│                Units, Search, Latex, Manual, Dashboard, Progress, Auth, ui)
├── pages/ (Dashboard, Machine, Unit, Topic, Search, LatexLab, Atlas,
│           Duel, Presentation, Manual)
├── services/ (api.ts, authService, unitService, topicService, searchService,
│              documentService, progressService, runService, metricsService,
│              latexService)
├── lib/progress/   (estados y porcentajes: lógica pura, con pruebas)
├── hooks/  context/  types/
└── data/mocks/
```

- Ningún componente hace peticiones HTTP directas: todo pasa por `services/`.
- Evita código duplicado; usa componentes reutilizables.
- Adapta esta estructura a la real sin romper lo existente.

## 7. La Máquina

Estaciones y qué hacen (todas con acciones reales):

| Estación | Objeto que entra | Qué ocurre | Objeto que sale |
|---|---|---|---|
| Terminal | Consulta booleana (de las 100 existentes) | Muestra historial y estado; ejecuta solo si el código actual lo permite | Resultados de búsqueda |
| Biblioteca | Resultados | Documentos encontrados, selección y matriz bibliográfica | Documentos seleccionados |
| Laboratorio | Dataset + script R | Ejecuta el ejemplo R del tema | Gráficas, tablas y métricas |
| Escritorio | Gráficas y resultados | Genera o actualiza el LaTeX del tema | Documento .tex / PDF |
| Pizarra | Documento | Reúne el material de sustentación | Presentación |

- Los objetos se arrastran de una estación a otra; el acople solo es válido si el paso previo existe en los datos reales.
- Si una estación no puede ejecutar algo todavía, mostrar el estado "pendiente" y no simular.
- Viaje rápido por clic a cualquier estación.

## 8. Avance y capa RPG

- El avance de cada tema se calcula a partir de datos y archivos reales (resultados guardados, documentos seleccionados, script R ejecutado, `.tex` generado, etc.). Nunca valores ficticios.
- Dos niveles distintos: **estado del proyecto** (calculado desde archivos reales; hoy casi todo está completo) y **recorrido del usuario** (qué estaciones y temas operó en La Máquina; se guarda en el navegador y se puede reiniciar). Hitos y rango dependen del recorrido, no de que los archivos existan.
- Estados de misión: Pendiente, En curso, Completada.
- **Misión = tema:** tiene encargo (objetivo), pistas (documentos y clips), evidencias (resultados, gráficas, `.tex`) y estado.
- **Hitos (logros) verificables:** cada uno con una regla de desbloqueo explícita basada en datos o archivos reales (por ejemplo: primer ejemplo R ejecutado con éxito, primer documento LaTeX revisado, unidad completa: laboratorio de todos sus temas operado con éxito, primer duelo de modelos, sustentación completada).
- **Rango por unidades recorridas:** Explorador (0), Investigador (Unidad 1), Analista (Unidad 2), Científico de datos (Unidad 3), Maestro de minería de datos (Unidad 4). Una unidad se considera recorrida cuando el usuario operó en La Máquina la estación Laboratorio (script R con éxito) de todos sus temas. No se obtiene con clics ni con ejecuciones repetidas.
- **Guía narrativa:** al entrar a una unidad, un breve briefing con su pregunta problema como "encargo".
- **Avatar "operador":** marcador que se desliza a la estación elegida (viaje rápido). Sin movimiento libre en la primera versión.
- No hay XP por ejecuciones automáticas. Si se quiere XP, se pide expresamente.
- Tono del RPG: sobrio y académico, nunca infantil.

## 9. Diseño visual

- Estética sobria y académica, estilo **atlas claro**: fondo de papel claro, tinta azul, contornos finos tipo mapa y **un solo color de acento** (terracota). Nada de neón ni fondos oscuros.
- Paleta base (definirla como variables en un solo lugar):
  - Fondo (papel): `#F6F1E7`; tarjetas: `#FFFDF8`; contornos y rejilla: `#D9CFBB` y `#EFE8D8`.
  - Texto principal y tinta: `#1F2A3C`; tinta azul (completado, énfasis): `#1F3A5F`; fondo azul suave: `#E4EAF2`.
  - Texto secundario: `#5C5648`; pendiente o bloqueado: `#B8AE98` (línea punteada).
  - Acento (tema actual, acciones principales): terracota `#B5532F`.
- Significado de colores: tinta azul = completado; terracota = actual o acción; gris cálido y punteado = pendiente o bloqueado.
- Elementos propios del atlas: rutas como caminos con nodos, etiquetas tipo mapa, pines y líneas de contorno.
- Tipografía sans para la interfaz y monoespaciada para código y consultas booleanas.
- Movimiento con propósito: flujos que muestran el recorrido de los objetos y banners animados con datos reales. Respetar `prefers-reduced-motion`.
- Estados vacíos, errores y confirmaciones claros.
- Responsive: en pantallas pequeñas, modo Directo.
- **Sistema de diseño primero:** variables (colores, tipografía, espacios, bordes, sombras, movimiento) en un solo lugar y componentes base reutilizables (documentados en `docs/guia_estilo.md` y visibles en `/ui-kit`). Ningún componente nuevo usa estilos sueltos.
- Texto de contenido de 14 px o más y buen contraste. Cabecera simple, de una sola fila.
- Una animación por interacción, siempre con propósito.
- Cada pantalla tiene estado vacío, de carga y de error.

## 10. Calidad académica

- Prioriza artículos científicos, revisiones sistemáticas, conferencias, libros académicos, tesis y fuentes institucionales.
- Registra autor, año, título, revista, DOI y URL solo cuando estén disponibles.
- Los ejemplos en R deben ser reproducibles, con datasets públicos y licencias registradas.
- No usar información privada o confidencial.
- Las métricas del Duelo de modelos y los banners deben salir de las salidas reales de R.

## 11. Estado real del sistema (resultado de la Fase 1)

Detalle completo en `docs/fase1_inventario.md`. Resumen:

- Arquitectura **basada en archivos**; no hay base de datos.
- API en un único archivo, `api/index.php`, con tres acciones: `progress` (GET), `topic_data` (GET, parámetros `u` y `t`) y `run_r` (GET o POST, parámetros `u` y `t`, ejecuta `Rscript` con `exec()`).
- CORS abierto (`*`) y sin autenticación. `run_r` ejecuta código en el servidor: usar solo en entorno local o de demostración y no ampliar su alcance sin validar `u` y `t` contra la lista de unidades y temas.
- Ya existe `frontend/` (React + TypeScript + Vite con proxy a Apache). **No crear un proyecto nuevo**: auditarlo y reutilizarlo.
- El progreso se calcula en tiempo real escaneando archivos. Como todo el contenido existe, el progreso del proyecto aparece completo.
- `datos/usuario_actual.json` es una ficha estática de ejemplo (usuario, XP, nivel) que la API no lee. **No mostrarla como datos reales.**
- El LaTeX se lee como texto; no hay compilación a PDF.
- Las consultas no se pueden volver a ejecutar desde el código: sus enlaces a Google Scholar se abren en el navegador.
- Brechas pendientes (B1 a B8) en el documento de la Fase 1; se cubren de forma aditiva en las fases siguientes.