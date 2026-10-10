# PLAN DE FASES v4 — La Máquina de Minería

Orden: pega **una fase a la vez** en el agente y revisa el resultado antes de seguir. `AGENTS.md` debe estar en la raíz.

Recorrido de datos que se respeta en todo el plan:

CONSULTAS (ya hechas) → DOCUMENTOS → DATASET → EJEMPLO R → RESULTADOS Y MÉTRICAS → LATEX → SUSTENTACIÓN

---

## Fase 1. Inventario y contrato (solo análisis) — COMPLETADA

Mensaje para pegar:

```text
FASE 1: INVENTARIO Y CONTRATO (solo análisis, sin escribir código de interfaz)

Lee primero AGENTS.md y respeta todas sus reglas.

Objetivo: entender cómo funciona mi proyecto actual para construir después
una interfaz React ("La Máquina de Minería") sobre la API PHP existente,
sin romper nada.

TAREAS (solo lectura y análisis):
1. Describe la estructura de carpetas y qué contiene cada una.
2. Explica cómo está hecha la API PHP: archivos, enrutamiento, formato de
   respuestas, errores y CORS.
3. Lista TODOS los endpoints: método, ruta, parámetros, respuesta y si
   requieren autenticación.
4. Explica cómo funcionan la autenticación y los roles.
5. Describe la base de datos (tablas, campos, relaciones) y dónde se
   guardan unidades, temas, las 100 consultas, documentos, datasets,
   ejemplos R, resultados, LaTeX y progreso.
6. Las 100 consultas ya están hechas: indica dónde están guardadas, qué
   estado tienen, qué resultados y documentos tiene cada una, y si el
   código actual permite volver a ejecutarlas. Verifica la distribución:
   Minería de datos 15, KDD 15, CRISP-DM 15, Modelo 15, Modelo híbrido 15,
   Predicción 15, Data Warehouse 10. Informa el resultado real.
7. Describe cómo se ejecuta el código R (ejecutar_todo.R y ejemplos):
   qué salidas produce (gráficas, tablas, métricas) y en qué formato y
   carpeta las guarda. Indica si se puede lanzar desde la API.
8. Describe cómo se genera el LaTeX y el PDF, y dónde quedan los archivos.
9. Indica si las preguntas problema de las 4 unidades están guardadas en
   la base de datos o en algún archivo.

ENTREGABLE: un único archivo docs/fase1_inventario.md con:
- Resumen de la arquitectura actual.
- Tabla de endpoints.
- Esquema de la base de datos.
- Usuarios y roles.
- Estado real de las 100 consultas.
- Salidas de R y de LaTeX (formato y ubicación).
- DOCUMENTO DE BRECHAS: qué le falta a la API para soportar La Máquina
  (ejecutar R desde la API, guardar métricas por técnica en JSON, estado
  por tema, asociación de documentos y LaTeX a temas, preguntas problema,
  etc.). Para cada brecha propón cómo cubrirla SIN romper lo existente.
- Dudas o cosas que no pudiste confirmar.

RESTRICCIONES:
- No modifiques archivos existentes.
- No instales dependencias ni ejecutes nada que cambie datos.
- No inventes endpoints, tablas ni datos: si no lo pudiste confirmar, dilo.
- Pide aprobación antes de ejecutar comandos.

Cuando termines, detente y reporta. No pases a la Fase 2.
```

Revisa tú: que la tabla de endpoints coincida con tu API real, el estado de las 100 consultas y la lista de brechas.

---

## Fase 2. Auditoría y base del frontend existente — COMPLETADA

- Contexto (Fase 1): ya existe `frontend/` (React + TypeScript + Vite). La API no tiene login ni roles. La versión 1 es de un solo usuario.
- Qué hace: audita `frontend/src` (qué datos son reales y cuáles son de ejemplo, como XP, nivel o el usuario de muestra), crea u ordena la capa `services/` (`api.ts`, `progressService`, `topicService`, `runService`) con tipos TypeScript de las respuestas, manejo de carga y errores, y la URL base configurable por variable de entorno.
- No hace: login, roles, cambios visuales ni cambios en `api/index.php`.
- Entrega: `docs/fase2_reporte.md` y una prueba mínima que muestra el progreso real traído de `action=progress`.
- Revisa tú: que ningún componente llame a la API directamente y que se haya hecho un commit antes de empezar.

## Fase 3. Sistema de diseño y capa narrativa — COMPLETADA

- Qué hace: define y construye la base visual y el lenguaje del "RPG" **antes** de hacer las vistas, para no rehacerlas después.
  - Variables de diseño (colores, tipografía, espacios, bordes, sombras, movimiento) en un solo lugar.
  - Componentes base: tarjeta de misión, estación, objeto arrastrable, barra de avance, insignia de estado, banner, tabla, estado vacío, mensajes.
  - Estructura general: cabecera simple (una sola fila), navegación y selector Máquina | Directo.
  - Guía narrativa: nombres de las zonas y estaciones, y el texto de "encargo" de cada unidad (usando su pregunta problema).
- Limpieza de datos ficticios en la cabecera: quitar el selector de rol de muestra y el indicador de nivel y XP (se reponen en la Fase 7 con datos reales del recorrido).
- Entrega: `docs/guia_estilo.md` y una página `/ui-kit` donde se ven todos los componentes en todos sus estados.
- Revisa tú: **aquí apruebas la estética.** Si no te convence, se corrige antes de seguir. Dirección elegida: **atlas claro** (papel claro, tinta azul, acento terracota; paleta completa en `AGENTS.md`). La ruta se dibuja como camino con nodos, no como cuadrícula de tarjetas.

## Fase 4. Modo Directo (con el sistema de diseño aplicado) — COMPLETADA

- Qué hace: dashboard, las 4 unidades con su pregunta problema como "encargo", vista de tema (como página, no modal), historial de las 100 consultas (solo lectura; en Data Warehouse se distinguen las 5 adicionales), documentos y matriz bibliográfica con las columnas disponibles (la matriz completa llega con la brecha B8 en la Fase 5).
- También: neutralizar `authService.ts` (quitar la llamada a `api/auth.php`, que no existe, y el respaldo con `usuario_actual.json`); en modo Máquina mostrar un aviso de "disponible en la Fase 6" en lugar del campus viejo; ocultar XP y nivel; el Laboratorio LaTeX y el Manual solo reciben ajuste mínimo de colores (su rediseño es la Fase 10).
- Entrega: todas las unidades y temas abren con datos reales; las consultas aparecen con ID, fecha, idioma, estado y resultados.
- Estética: tamaños de letra legibles, buen contraste, estados vacíos y tablas con filtros.
- Revisa tú: que la plataforma ya sirva y se vea bien sin animaciones.

## Fase 4B. Vida visual (NUEVA)

- Qué hace: da movimiento y presencia al Modo Directo sin cambiar la paleta: entradas escalonadas, números que cuentan, ruta que se dibuja con punto viajero, un pulso, banner ticker con datos reales, transiciones entre vistas, textos sin jerga técnica y unidades diferenciadas.
- Entrega: dashboard con vida; sin librerías nuevas; respeta `prefers-reduced-motion`.
- Prompt listo en `prompts_fase4b_y_fase6.md`.

## Fase 5. Datos de avance, métricas e hitos

- Qué hace: cubre las brechas de la Fase 1 de forma aditiva, sin tocar lo que ya funciona:
  - **B1:** preguntas problema de las 4 unidades en `datos/unidades_curriculum.json`, expuestas por la API.
  - **B4:** que R guarde un `metricas.json` estructurado junto al `.txt` de cada tema (el `.txt` se conserva).
  - **B8:** que `topic_data` incluya también la bitácora de búsquedas y la matriz de análisis.
  - **B6:** que la API indique qué paso previo está disponible, para validar el acople en La Máquina.
  - **B5:** separar el estado del proyecto (desde archivos) del **recorrido del usuario** (estaciones operadas), guardado en el navegador (`localStorage`) y reiniciable.
  - Reglas de hitos y rango calculadas desde el recorrido y las ejecuciones reales.
- Entrega: cada tema muestra su estado real; el sistema sabe qué hitos se cumplieron.
- Revisa tú: que `metricas.json` coincida con el `.txt` y que nada sea ficticio.

> **Nota sobre la Fase 5 (ejecutada en versión reducida por la fecha de entrega).**
> Hecho: curriculum alineado, caché con bypass tras `run_r`, scripts de la Unidad 1 con rutas internas, `metricas.json` común en U1-01, U1-04, U1-05 y U4-02, métricas reales y honestas en la Unidad 4, clasificación de los 24 datasets y README actualizado.
> No hecho (pasa a la Fase 6 o se recorta): recorrido del usuario en `localStorage`, validación de acople (se hará en el frontend con `topic_data`), bitácora y matriz completas en la API (B8), hitos y rango (Fase 7).

## Fase 6. La Máquina (capa 1)

- Qué hace: estaciones (Terminal, Biblioteca, Laboratorio, Escritorio, Pizarra), objetos arrastrables, flujos animados entre estaciones y **avatar "operador"** que se desliza a la estación elegida (viaje rápido por clic; sin movimiento libre en la primera versión).
- Entrega: arrastrar un objeto a su estación dispara la acción real o muestra "pendiente".
- Estética: movimiento con propósito (los flujos muestran el recorrido de los datos), una animación por interacción, soporte de `prefers-reduced-motion`.
- Revisa tú: que ninguna interacción simule un éxito que no ocurrió.

## Fase 7. Capa RPG sobria

- Qué hace: convierte lo real en estructura de juego, sin inflar nada.
  - **Misiones:** cada tema es una misión con encargo (objetivo), pistas (documentos y clips), evidencias (resultados, gráficas, `.tex`) y estado: Pendiente, En curso, Completada.
  - **Hitos (logros) verificables:** por ejemplo, Primer ejemplo R ejecutado, Primer documento LaTeX generado, Unidad 1 completa, Primer duelo de modelos, Sustentación completada. Cada uno con su regla de desbloqueo explícita basada en datos reales.
  - **Rango por unidades recorridas:** Explorador (0), Investigador (Unidad 1), Analista (Unidad 2), Científico de datos (Unidad 3), Maestro de minería de datos (Unidad 4). Una unidad se recorre al operar las estaciones de todos sus temas. No se obtiene con clics ni ejecuciones repetidas.
  - **Guía narrativa:** un breve briefing al entrar a cada unidad con su pregunta problema.
- Entrega: vistas de misión, panel de hitos y rango visibles en el dashboard y en La Máquina.
- Revisa tú: que cada hito y cada rango se pueda justificar con un dato real, y que el tono sea sobrio, no infantil.

## Fase 8. Atlas de técnicas (capa 2, Animación Vectorial)

- Qué hace: un clip corto (30 a 60 s) por técnica: árboles, redes neuronales, clústeres, series de tiempo y reglas de asociación; galería y clip dentro de cada tema.
- Entrega: videos renderizados guardados y reproducibles desde la interfaz.
- Estética: mismos colores y tipografía de la plataforma.
- Revisa tú: que el contenido matemático sea correcto y coherente con tus ejemplos en R.

## Fase 9. Banners e intro (Remotion)

- Qué hace: banners animados con datos reales (progreso, estado, unidad actual, hitos recientes) con el reproductor de Remotion en React, e intro de la plataforma.
- Entrega: banner en la cabecera y en cada unidad que se mueve y cambia con los datos.
- Revisa tú: que los banners muestren cifras reales, no valores fijos.

## Fase 10. Laboratorio LaTeX y Manual

- Qué hace: editor con vista previa (KaTeX), guardado, descarga de `.tex`, asociación a unidad y tema; manual interactivo.
- Entrega: documentos asociados y manual con navegación lateral y búsqueda.
- Revisa tú: que el manual refleje la plataforma real, porque el video se basa en él.

## Fase 11. Duelo de modelos (capa 3)

- Qué hace: compara dos técnicas sobre el mismo dataset con las métricas guardadas por R; animación de la comparación y hito asociado.
- Entrega: vista del duelo con resultado y métricas reales.
- Revisa tú: que cada métrica coincida con la salida real de R.
- Si falta tiempo: versión simple con dos barras de métricas.

## Fase 12. Modo sustentación (capa 4)

- Qué hace: recorre la máquina automáticamente por las fases (CRISP-DM), mostrando datos reales y con guion de narración.
- Entrega: botón que inicia la presentación con pausa, avance y retroceso.
- Revisa tú: que el recorrido use los resultados reales del proyecto.

## Fase 13. Video del manual y revisión final de diseño

- Qué hace: video explicativo del manual con animación matemática y voz sintética, y una revisión visual completa de consistencia, contraste, responsive y accesibilidad.
- Entrega: video final e interfaz consistente.

---

## Criterios de diseño que toda fase debe cumplir

- Un solo acento (terracota) para lo actual y las acciones; tinta azul para completado; gris cálido punteado para pendiente o bloqueado.
- Texto legible: tamaño mínimo de 14 px en contenido y buen contraste.
- Una animación por interacción, siempre con propósito. Respetar `prefers-reduced-motion`.
- Todo componente nuevo sale del sistema de diseño de la Fase 3; no se inventan estilos sueltos.
- Cada pantalla tiene estado vacío, de carga y de error.
- Tono del RPG: sobrio y académico, nunca infantil.

## Si el tiempo aprieta

Prioridad: **Fases 1 a 4** (base y diseño) → **6** (La Máquina) → **8 y 9** (Animaciones y Remotion, lo que pidió el profe) → **12** (sustentación) → **7, 11 y 10**.
La Fase 3 no se recorta: cuesta poco y evita rehacer todo el diseño más tarde.

---

## Plan hasta la entrega (domingo 11 de octubre)

- **Jueves:** Fase 4B (vida visual) y empezar la Fase 6.
- **Viernes:** terminar la Fase 6; Atlas con **3 clips animados** (árbol, clústeres, red neuronal); **1 pieza de Remotion** (banner o intro corta).
- **Sábado:** Duelo simple (con las métricas reales de U1-04), Modo sustentación sencillo, pruebas, `npm run build` y `git push` de respaldo.
- **Domingo:** ensayo y entrega. Sin funciones nuevas.

**Se recorta si falta tiempo:** video largo del manual (sustituir por demo en vivo o capturas), hitos y rango, rediseño del Laboratorio LaTeX y del Manual, Atlas completo, Remotion más allá de una pieza.