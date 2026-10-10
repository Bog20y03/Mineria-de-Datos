# Reporte de Fase 6 — Entrega 6A: Núcleo Funcional de La Máquina de Minería

**Proyecto:** Ruta del Conocimiento: La Máquina de Minería  
**Referencia:** `AGENTS.md` (§1, §7, §8, §9, §11), Hoja de ruta Fase 6 (Entrega 6A)  
**Fecha:** Octubre 2026  
**Estado:** Entrega 6A Completada — En espera de aprobación para `npm run build` y Entrega 6B.

---

## 1. Resumen de la Entrega 6A

Se implementó el **núcleo funcional interactivo de La Máquina de Minería** (reemplazando el marcador previo `MachinePlaceholder` en el modo interactivo), permitiendo operar la línea de producción sobre los datos y scripts reales del repositorio sin alterar la API PHP ni recurrir a datos simulados:

1. **Selector de Pedido (Tema):**
   - Selector reactivo que permite cargar cualquiera de los 24 temas distribuidos en las 4 unidades curriculares.
   - Sincronización inmediata de metadatos, artefactos de entrada/salida y estado de validación.

2. **Línea de Producción (5 Estaciones Conectadas):**
   - Vía de atlas visual con las 5 estaciones canónicas: `Terminal -> Biblioteca -> Laboratorio -> Escritorio -> Pizarra`.
   - Indicador de estado por estación (completada, activa, pendiente).
   - Conexiones dinámicas con flujo animado cuando hay procesos en ejecución.

3. **Avatar Operador con Viaje Rápido:**
   - Marcador visual tipo atlas (`Operador`) posicionado dinámicamente sobre la pista con transición suave (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - Movimiento reactivo por clic en cualquier estación para viaje rápido sin movimiento libre.

4. **Laboratorio Completo con Ejecución R Real:**
   - Admite arrastrar y soltar la pieza de datos/script, así como el botón alternativo accesible (*"Acoplar y Ejecutar en Laboratorio"*).
   - Invoca `runService.runScript(unit, topic)` contra la API PHP real de Apache (`api/index.php?action=run_r`).
   - Consola de ejecución en vivo con `exit_code` y salida textual completa (`stdout`/`stderr`).
   - Revelado animado escalonado de las figuras generadas (`.png`).
   - Visualización de métricas estructuradas vía `metricsService.ts` (`metricas.json` o fallback a `metricas_*.txt`).

5. **Validación Estricta de Acople:**
   - Valida en frontend la existencia real de los archivos de dataset y script R reportados por `topic_data`.
   - Si falta algún artefacto o la verificación falla, el acople se rechaza mostrando *"Sin datos registrados"*. Nunca simula ejecuciones exitosas.

6. **Recorrido del Usuario Desacoplado:**
   - Registro de estaciones operadas persistido en `localStorage` bajo el servicio `recorridoService.ts`, sin llamadas directas desde componentes.
   - Marcador visual *"Estaciones operadas: X de 5"* en el tema seleccionado.
   - Botón para reiniciar el recorrido del tema.

---

## 2. Archivos Creados y Modificados

### Archivos Creados
- `frontend/src/services/recorridoService.ts`: Servicio que abstrae la persistencia del recorrido del usuario (`mineria_recorrido_maquina_v1` en `localStorage`), cálculo de estaciones operadas y reinicio por tema.
- `frontend/src/services/metricsService.ts`: Servicio para la carga desacoplada y con prevención de caché de `metricas.json` y extractores de texto `.txt`.
- `frontend/src/components/Machine/MachineView.tsx`: Vista principal de La Máquina de Minería (selector de temas, vía de atlas, avatar deslizante, piezas móviles, estación de laboratorio completa con consola, gráficos y métricas).
- `docs/fase6_reporte.md`: Este documento de registro.

### Archivos Modificados
- `frontend/src/App.tsx`: Sustitución de `MachinePlaceholder` por `MachineView` en el modo mapa (`mode === 'map'`), preservando intacto el archivo `MachinePlaceholder.tsx`.

---

## 3. Diagnóstico y Corrección de Incidencia HTTP 403 en Entrega 6A

Se investigó a fondo el reporte de error HTTP 403 obtenido al cargar el tema U1-01:

1. **Peticiones HTTP de la Estación:**
   - `topic_data`: `/md/api/index.php?action=topic_data&u=UNIDAD_1&t=01_MINERIA_DE_DATOS` (Proxy Vite) / `http://localhost/api%20vehiculos%20tutoria/MINERIA_DATOS/api/index.php?...` (Apache).
   - `metricas.json`: `/md/UNIDAD_1/01_MINERIA_DE_DATOS/resultados/metricas.json` / Apache directo.
   - `grafico.png`: `/md/UNIDAD_1/01_MINERIA_DE_DATOS/resultados/grafico_01_mineria_datos.png` / Apache directo.
   - `run_r`: `/md/api/index.php?action=run_r` (POST).
2. **Causa Raíz:**
   - En el `access.log` de Apache se evidenciaron peticiones con URI malformada (`/api%20vehiculos%20tutoria/MINERIA_DATOShttp://localhost/...`), provocadas por doble concatenación de esquema/host y rutas sin resolver en `MachineView` / `metricsService`.
   - Apache 2.4 rechaza con `403 Forbidden` cualquier resolución de archivo que contenga esquemas URI en la ruta local.
   - Adicionalmente, en `MachineView.tsx` las imágenes se intentaban leer desde `img.url` en lugar de `img.src`, causando `TypeError` de split sobre `undefined`.
3. **Correcciones Aplicadas en Frontend:**
   - En `config.ts`: se añadió guarda defensiva en `assetUrl`.
   - En `metricsService.ts`: se unificó la resolución de URL usando `assetUrl`.
   - En `MachineView.tsx`: se corrigió el acceso a `img.src` y se eliminó la anteposición redundante de `/md/` en la etiqueta de imagen.
4. **Evidencia de Validación de Punta a Punta (U1-01):**
   - Carga de tema (`topic_data`): HTTP 200 (`iris_dataset.csv` y `01_mineria_datos.R`).
   - Ejecución en Laboratorio (`run_r`): HTTP 200, `exit_code: 0`, `status: "success"`.
   - Archivos generados y comprobados en disco: `grafico_01_mineria_datos.png` (18,541 B), `metricas.json` (906 B, `estado: "ok"`), `metricas_01.txt` (550 B).
   - Verificación estática: `npx tsc --noEmit` completado con 0 errores.

---

## 4. Estado Actual

- **Entrega 6A:** Diagnóstico completado, incidencia resuelta, pruebas de punta a punta exitosas con evidencia real.
- **Detenido:** A la espera de aprobación para `npm run build` y Entrega 6B.
