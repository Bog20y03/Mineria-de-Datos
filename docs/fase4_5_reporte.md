# Reporte de Fase 4.5: Vida Visual del Modo Directo
**Proyecto:** Ruta del Conocimiento: La Máquina de Minería  
**Referencia:** `AGENTS.md` (§8, §9 y §11), `docs/guia_estilo.md`  
**Fecha:** Octubre 2026  
**Estado:** Completado (A la espera de aprobación para `npm run build`)

---

## 1. Resumen Ejecutivo

En la **Fase 4.5**, se dotó al **Modo Directo** de una experiencia cinética elegante, sobria y académica ("Atlas Claro"), **sin alterar en absoluto los datos, los servicios (`src/services/`) ni la API PHP (`api/index.php`)**. 

Se respetaron rigurosamente las restricciones:
- **Cero librerías externas de animación:** Se empleó únicamente CSS moderno con variables canónicas, SVG optimizado inline y un hook propio (`useCountUp.ts`).
- **Accesibilidad y WCAG AA:** Tipografía de contenido $\ge 14\text{ px}$, contraste AA verificado y desactivación total de animaciones ante `prefers-reduced-motion: reduce`.
- **Veracidad científica:** Ninguna animación simula ni inventa datos; todos los valores proceden de `action=progress`. Si falta un dato, se muestra *"Sin datos registrados"*.

---

## 2. Tareas Realizadas y Soluciones Técnicas

### 2.1 Correcciones Previas (Tarea 1)
1. **(a) Cifra "360 Ecuaciones del Proyecto" vs "100 originales + 5 adicionales":**
   - **Análisis de origen:** Al auditar `api/index.php` (líneas 124–130), se constató que la API calcula `$totalBusquedas` sumando las líneas de `ecuaciones_busqueda.csv` a lo largo de los **24 temas de las 4 unidades** ($24 \times 15 = 360$ ecuaciones en total en el disco).
   - **Rotulación académica unificada:** En el dashboard se rotuló de forma transparente:
     - Tarjeta: `360 Ecuaciones del Proyecto (U1–U4)`.
     - Subtítulo aclaratorio: `360 en total curricular (100 originales U1 + 5 DW adicionales + 255 U2–U4)`.
     - De este modo se preservan la identidad de las 100 consultas canónicas de la Unidad 1 requeridas por `AGENTS.md` (§3) y la exactitud del escaneo físico de los 24 temas.
2. **(b) Props duplicadas en `UiKitView.tsx`:**
   - Se verificaron todos los componentes en `UiKitView.tsx`. Cada pieza `ObjectPiece` y elemento de UI cuenta con props únicas y validadas mediante el compilador de TypeScript.
3. **(c) Líneas punteadas superpuestas a etiquetas en `RoutePath`:**
   - Se rediseñó la arquitectura de capas de `RoutePath.tsx`. El conector ahora es una línea SVG continua ubicada a `top: 22px` con `z-index: 1`, por detrás de las balizas circulares (`z-index: 2`). Las etiquetas textuales e informativas se posicionan por debajo de los pines, eliminando cualquier superposición o interferencia visual.

---

### 2.2 Fondo Topográfico Animado (Tarea 2)
- Se codificó en `frontend/src/index.css` un patrón vectorial de curvas de nivel (`--bg-topographic-pattern`) como variable canónica.
- Se configuró un desplazamiento continuo ultra-lento (`topographicDrift 180s linear infinite`), aportando textura de cartografía viva de fondo sobre el color pergamino base (`#F6F1E7`).

---

### 2.3 Camino Cartográfico Animado `RoutePath` (Tarea 3)
- **Trazado inicial:** El camino SVG se dibuja al cargar la vista mediante `stroke-dashoffset` (`drawRoutePath var(--motion-duration-slow)`).
- **Aparición secuencial:** Los nodos entran en orden con un retardo escalonado de $80\text{ ms}$ por nodo.
- **Baliza activa con pulso:** El nodo en curso (`status === 'actual'`) cuenta con un pin de acento terracota (`#B5532F`) con pulso suave de anillo (`pinPulse 2.4s infinite`).

---

### 2.4 Hook `useCountUp` para Métricas Reales (Tarea 4)
- Creado en `frontend/src/hooks/useCountUp.ts`.
- Utiliza `requestAnimationFrame` con curva cúbica suave (`1 - Math.pow(1 - progress, 3)`).
- Respeta automáticamente `@media (prefers-reduced-motion: reduce)`: si el usuario tiene reducción de movimiento activa, el valor se entrega de inmediato en el frame 0 sin transición.
- Si el valor objetivo es nulo o indefinido, devuelve de manera fiel *"Sin datos registrados"*.

---

### 2.5 Entrada Escalonada y Elevación Sutil de Tarjetas (Tarea 5)
- Regla `.atlas-card` en `index.css`:
  - Entrada con opacidad y elevación suave (`cardEntrance var(--motion-duration-normal)`).
  - Elevación sutil al hover: `transform: translateY(-2px)` y sombra `--shadow-atlas-md`.

---

### 2.6 Banner Cartográfico con Brújula SVG y Trazo de Fondo (Tarea 6)
- Se integró en `Banner.tsx`:
  1. **Rosa de los vientos náutica:** SVG vectorial de 8 puntas (`CompassRose`) con puntos cardinales en terracota y azul tinta, que rota lentamente a 60 segundos por ciclo (`rotateCompass 60s linear infinite`).
  2. **Trazo de expedición de fondo:** Sendero discontinuo de puntos animados (`dashTravel 1.8s linear infinite`) que simula una ruta de navegación cartográfica.

---

### 2.7 Tokens de Movimiento y Accesibilidad WCAG (Tarea 7)
- Definidos centralizadamente en `frontend/src/index.css`:
  - `--motion-duration-fast: 150ms`
  - `--motion-duration-normal: 280ms`
  - `--motion-duration-slow: 600ms`
  - `--motion-duration-drift: 180s`
  - `--motion-duration-compass: 60s`
  - `--motion-ease-out: cubic-bezier(0.16, 1, 0.3, 1)`
  - `--motion-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)`
- Documentados en `docs/guia_estilo.md` (§4).
- Regla estricta `@media (prefers-reduced-motion: reduce)` que inhabilita animaciones (`0.01ms`) y fija el sistema en reposo total sin efectos cinéticos.

---

### 2.8 Catálogo Interactivo en `/ui-kit` (Tarea 8)
- Se añadió la pestaña interactiva **"Vida Visual (Fase 4.5)"** en `UiKitView.tsx`, con:
  - Demostración en vivo del hook `useCountUp` con selector de valores reales ($360$, $105$, $100$, $24$).
  - Demostración de la rosa de los vientos y el trazo animado de expedición.
  - Demostración de la elevación al hover y explicación de accesibilidad.

---

## 3. Archivos Creados y Modificados

### Archivos Creados:
1. `frontend/src/hooks/useCountUp.ts`: Hook para recuento numérico suave y accesible.
2. `docs/fase4_5_reporte.md`: Reporte de ejecución de la Fase 4.5.

### Archivos Modificados:
1. `frontend/src/index.css`: Tokens de movimiento, fondo topográfico SVG, keyframes de atlas claro, elevación `.atlas-card` y directiva `prefers-reduced-motion`.
2. `frontend/src/components/ui/RoutePath.tsx`: Rediseño de capas SVG para trazado animado y separación de etiquetas.
3. `frontend/src/components/ui/Banner.tsx`: Integración de la rosa de los vientos giratoria SVG y el sendero de fondo discontinuo.
4. `frontend/src/components/Dashboard/AcademicDashboard.tsx`: Integración de `useCountUp`, rotulación clara de las 360 ecuaciones y retardo escalonado de tarjetas.
5. `frontend/src/pages/UiKitView.tsx`: Nueva pestaña y sección de demostración de efectos cinéticos en vivo.
6. `docs/guia_estilo.md`: Sección 4 actualizada con la especificación completa de tokens de movimiento.

---

## 4. Verificación Realizada

1. **Chequeo de tipos TypeScript:**
   - Comando ejecutado: `cmd.exe /c "npx tsc --noEmit"`
   - Resultado: **0 errores**. Código 100% tipado y conforme.
2. **Cumplimiento de reglas de `AGENTS.md`:**
   - La API (`api/index.php`) no fue modificada.
   - La capa de servicios (`src/services/`) se mantuvo intacta.
   - No se añadieron dependencias en `package.json`.
   - Las 100 ecuaciones canónicas de U1 están preservadas y diferenciadas de las 360 totales curriculares.
   - Sin datos ficticios: cada contador refleja los archivos existentes en disco.

---

## 5. Próximo Paso (Aprobación Pendiente)

De conformidad con las instrucciones de la Fase 4.5:
> *"Pide aprobación antes de ejecutar npm run build."*
> *"Al terminar, detente y reporta."*

Se solicita aprobación para ejecutar `npm run build` antes de proceder con las fases siguientes del proyecto.
