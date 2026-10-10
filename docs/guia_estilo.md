# Guía de Estilo: Sistema de Diseño Atlas Claro
**Proyecto:** Ruta del Conocimiento: La Máquina de Minería  
**Referencia:** `AGENTS.md` (§8, §9 y §11)  
**Versión:** 1.0 (Fase 3)

---

## 1. Filosofía Visual

La plataforma adopta una estética **sobria, rigurosa y académica** denominada **Atlas Claro**. 

- **Concepto clave:** La interfaz emula las láminas de un atlas científico o mapa cartográfico de investigación, donde el conocimiento fluye a lo largo de estaciones y caminos de nodos.
- **Sin estridencias:** Quedan estrictamente prohibidos los fondos oscuros estilo "gaming", efectos de neón, degradados sintéticos intensos y componentes recargados.
- **Propósito:** Cada color, contorno y animación tiene una función semántica inequívoca.

---

## 2. Paleta Canónica de Colores

Todas las variables están centralizadas en `frontend/src/index.css`.

| Variable CSS | Valor Hex | Función Semántica |
|---|---|---|
| `--color-paper` | `#F6F1E7` | **Fondo base** (pliego de papel / atlas). |
| `--color-card` | `#FFFDF8` | **Superficie de tarjetas**, paneles y módulos. |
| `--color-card-muted` | `#F8F4EB` | Fondo alternado sutil para tablas y contenedores secundarios. |
| `--color-border` | `#D9CFBB` | **Contornos principales** tipo mapa grabado. |
| `--color-border-light` | `#EFE8D8` | Rejillas secundarias y líneas divisorias. |
| `--color-ink` | `#1F2A3C` | **Tinta profunda:** texto principal, títulos y datos clave (contraste > 11:1). |
| `--color-ink-secondary` | `#5C5648` | Texto explicativo, notas al pie y metadatos (contraste > 7:1). |
| `--color-ink-muted` | `#8C8474` | Metadatos terciarios legibles (contraste >= 4.5:1, nivel AA). |
| `--color-ink-disabled` | `#B8AE98` | Elementos inactivos o bloqueados (con línea punteada). |
| `--color-blue-ink` | `#1F3A5F` | **Tinta azul:** estado completado, verificado, biblioteca académica y énfasis. |
| `--color-blue-soft` | `#E4EAF2` | Fondo suave para insignias completadas y selección documental. |
| `--color-terracotta` | `#B5532F` | **Acento terracota único:** tema actual, estación en operación y botones primarios. |
| `--color-terracotta-soft` | `#FBF0EB` | Fondo suave para elementos en curso o destacados. |
| `--color-danger-ink` | `#992323` | Mensajes de error sobrios. |
| `--color-danger-bg` | `#FDF2F2` | Fondo de tarjetas de error. |

### Regla Semántica de Estados:
1. **Azul tinta (`#1F3A5F` sobre `#E4EAF2`):** Completado, verificado, entregable listo.
2. **Terracota (`#B5532F` sobre `#FBF0EB`):** Estado actual, acción primaria, foco activo.
3. **Gris cálido punteado (`#5C5648` sobre `#F4EFE6`):** Pendiente de ejecución.
4. **Gris apagado (`#8C8474` / `#B8AE98` sobre `#EFECE4`):** Bloqueado (requiere paso previo).

---

## 3. Tipografía

El texto de contenido respeta estrictamente el tamaño mínimo de **14 px (0.875 rem)** para garantizar legibilidad continua.

| Familia | Variable | Uso Recomendado |
|---|---|---|
| **Sans-Serif** | `--font-sans` (`Inter`, system fallbacks) | Interfaz general, navegación, formularios y botones. |
| **Serif** | `--font-serif` (`Cinzel`, `EB Garamond`, `Georgia`) | Títulos de unidad, encabezados de atlas y sellos institucionales. |
| **Monospace** | `--font-mono` (`JetBrains Mono`, `Consolas`) | Fórmulas, consultas booleanas, scripts R, DOI y métricas numéricas. |

### Escala Modular:
- Micro-etiquetas (tags): `0.75rem` (12px)
- Texto secundario y tablas: `0.875rem` (14px)
- Texto estándar de lectura: `1rem` (16px)
- Subtítulos: `1.125rem` (18px)
- Encabezados de tarjeta: `1.25rem` (20px)
- Títulos de sección: `1.5rem` (24px)
- Títulos de unidad: `1.875rem` (30px)

---

## 4. Radios, Sombras y Tokens de Movimiento (Fase 4.5)

- **Radios:**
  - Botones y entradas: `4px` (`--radius-sm`, sobrio, sin redondeos infantiles).
  - Tarjetas y módulos: `8px` (`--radius-md`).
  - Insignias / Pills: `9999px` (`--radius-full`).
- **Sombras:**
  - Extremadamente sutiles, simulando relieve de papel: `--shadow-atlas-xs`, `--shadow-atlas-sm` y `--shadow-atlas-md`.

### 4.1 Tokens de Movimiento Centralizados (`src/index.css`)

Todas las animaciones están estrictamente gobernadas por variables canónicas:

| Token CSS | Valor | Propósito |
|---|---|---|
| `--motion-duration-fast` | `150ms` | Micro-interacciones de botones, foco e insignias. |
| `--motion-duration-normal` | `280ms` | Entrada de tarjetas, tabs y modales. |
| `--motion-duration-slow` | `600ms` | Trazado de ruta cartográfica SVG (`RoutePath`). |
| `--motion-duration-drift` | `180s` | Deriva sutilísima de curvas de nivel del fondo topográfico. |
| `--motion-duration-compass` | `60s` | Giro lento continuo de la rosa de los vientos en el `Banner`. |
| `--motion-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Desaceleración suave y natural para transiciones de UI. |
| `--motion-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transiciones simétricas de elevación y colores. |

### 4.2 Efectos Cinéticos del Atlas Claro

1. **Fondo Topográfico (`--bg-topographic-pattern`):**
   Patrón SVG en bucle con curvas de nivel vectoriales a trazo ultra-tenue (`#D9CFBB` al 28% de opacidad). Se desplaza mediante la animación continua `topographicDrift 180s linear infinite`, transmitiendo la sensación de un pliego cartográfico vivo.
2. **Camino Cartográfico Vivo (`RoutePath`):**
   - El sendero SVG que une los nodos se dibuja al cargar con `stroke-dashoffset` (`drawRoutePath var(--motion-duration-slow)`).
   - Los nodos aparecen en secuencia escalonada (`index * 80ms`).
   - El nodo actual (`status === 'actual'`) porta un pin terracota con pulso suave de anillo (`pinPulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite`).
   - El sendero connector vive en una capa SVG intermedia (`top: 22px`, `z-index: 1`) por detrás de los pines (`z-index: 2`), garantizando que las líneas **jamás** se superpongan a los textos de las etiquetas.
3. **Hook `useCountUp`:**
   - Ubicado en `src/hooks/useCountUp.ts`.
   - Anima con `requestAnimationFrame` y curva cubic ease-out hacia el valor exacto de `action=progress`.
   - Si no hay datos registrados, emite `"Sin datos registrados"`. No inventa valores ni genera números ficticios.
4. **Elevación Sutil y Entrada Escalonada (`.atlas-card`):**
   - Entrada con opacidad y desplazamiento vertical de 8 px (`cardEntrance`).
   - Al pasar el cursor (`:hover`), la tarjeta se eleva `-2px` y activa `--shadow-atlas-md`.
5. **Banner con Rosa de los Vientos Náutica y Trazo Animado:**
   - Brújula vectorial de 8 puntas (`CompassRose`) que rota lentamente a 60 segundos por vuelta (`rotateCompass`).
   - Trazo discontinuo de expedición de fondo (`dashTravel`) animado mediante `stroke-dasharray="6 8"`.

### 4.3 Regla de Oro de Accesibilidad (`prefers-reduced-motion`)

El sistema cumple rigurosamente con WCAG 2.1 AA. Cuando el usuario tiene activa la preferencia de reducción de movimiento en el sistema operativo:
```css
@media (prefers-reduced-motion: reduce) {
  html, body {
    animation: none !important;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .atlas-card:hover {
    transform: none !important;
  }
}
```
En este estado, el fondo queda estático, los caminos aparecen trazados de inmediato, las métricas muestran su cifra final instantáneamente y ningún elemento vibra ni rota.

---

## 5. Componentes Base (`src/components/ui/`)

| Componente | Archivo | Descripción y Estados |
|---|---|---|
| **Button** | `Button.tsx` | Variantes: `primary`, `secondary`, `outline`, `ghost`, `danger`. Tamaños `sm`, `md`, `lg`. Estados: normal, hover, disabled, loading con spinner. |
| **Card** | `Card.tsx` | Contenedor sobrio. Variantes: `default`, `muted`, `dashed`. Slots para `header`, `body` y `footer`. |
| **MissionCard** | `MissionCard.tsx` | Modela cada tema como misión académica: encargo (objetivo), pistas (docs y clips), evidencias (R, gráficas, LaTeX) y barra de progreso. Estados: `completada`, `en_curso`, `pendiente`. |
| **StationCard** | `StationCard.tsx` | Modela las 5 estaciones de La Máquina: muestra objeto entrante, transformación real, objeto saliente y botón de acción. Estados: `activa`, `disponible`, `bloqueada`. |
| **ObjectPiece** | `ObjectPiece.tsx` | Pieza visual de la línea de producción (consulta booleana, documentos, dataset/script R, gráficas/métricas, LaTeX, presentación). Estados: `listo`, `en_proceso`, `pendiente`, `bloqueado`. |
| **ProgressBar** | `ProgressBar.tsx` | Barra de progreso con variantes `blue` y `terracotta`, soporte ARIA y porcentaje exacto. |
| **StatusBadge** | `StatusBadge.tsx` | Insignia con los 4 estados canónicos: `completado`, `actual`, `pendiente` y `bloqueado`. |
| **Banner** | `Banner.tsx` | Banner estático sobrio con fondo de pergamino, borde tipo mapa y métricas reales. |
| **DataTable** | `DataTable.tsx` | Tabla estilo atlas con campo de búsqueda y filtrado en vivo, contador de resultados, estados vacíos y paginación. |
| **Tabs** | `Tabs.tsx` | Selector de pestañas accesible con variantes `underline` (terracota) y `pill` (azul tinta). |
| **EmptyState** | `EmptyState.tsx` | Estado vacío sobrio con icono, título, descripción y acción opcional. |
| **Loading** | `Loading.tsx` | Indicador de carga con spinner SVG suave y mensaje de contexto. |
| **ErrorMessage** | `ErrorMessage.tsx` | Mensaje de error sobrio sobre fondo `#FDF2F2`, detalle técnico y botón de reintento. |
| **RoutePath** | `RoutePath.tsx` | Camino cartográfico continuo con nodos, balizas de estación y conexiones sólidas/punteadas. |

---

## 6. Cabecera Unificada (Navbar)

La cabecera se reestructuró a **una sola fila limpia**:
1. **Marca:** Logo con brújula y texto "La Máquina de Minería · Ruta del Conocimiento".
2. **Selector de Modo:** Botones toggle sobrios entre **La Máquina** (modo interactivo) y **Directo** (modo clásico sin animaciones).
3. **Navegación:** Enlaces directos a Dashboard, Unidades, Buscador, Lab LaTeX, Manual y **UI Kit**.
4. **Remoción de datos ficticios:** Se eliminaron el selector de rol simulado y los badges de XP/nivel ficticios (se repondrán en la Fase 7 basándose en el recorrido real del usuario).

---

## 7. Catálogo Interactivo en Vivo

Para inspeccionar y probar todos los componentes en todos sus estados, navegar a la ruta:
`/ui-kit` (disponible también desde la barra superior).
