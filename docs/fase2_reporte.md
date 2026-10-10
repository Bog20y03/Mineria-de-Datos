# FASE 2: REPORTE DE AUDITORÍA Y BASE DEL FRONTEND EXISTENTE
## Plataforma Académica "Ruta del Conocimiento: La Máquina de Minería"

---

## 1. Auditoría de `frontend/src`: Estructura, Componentes y Origen de Datos

Se realizó una auditoría completa del código en `frontend/src`. A continuación se detalla la estructura, los componentes existentes y la trazabilidad del origen de cada dato presentado en la interfaz.

### 1.1 Estructura de carpetas actual

```text
frontend/src/
├── assets/                  # Imágenes base e iconos SVG
├── components/
│   ├── common/
│   │   └── Modal.tsx        # Modal accesible reutilizable (tecla ESC, backdrop, scroll lock)
│   ├── Dashboard/
│   │   └── AcademicDashboard.tsx # Panel de control académico con métricas y logros
│   ├── Latex/
│   │   └── LatexLab.tsx     # Laboratorio de fórmulas y documentos LaTeX con KaTeX
│   ├── Manual/
│   │   └── InteractiveManual.tsx # Manual metodológico interactivo con buscador
│   ├── Navbar/
│   │   └── Navbar.tsx       # Barra de navegación superior con selector de modo (Mapa | Directo)
│   ├── RPG/
│   │   └── RPGWorld.tsx     # Campus de investigación 2D con 4 zonas y viaje rápido
│   ├── Search/
│   │   └── SearchEngine.tsx # Motor de búsqueda booleana sobre el catálogo canónico
│   ├── TopicModal/
│   │   └── TopicDetailModal.tsx # Visor temático con las 7 pestañas de contenido real
│   └── Units/
│       └── UnitsExplorer.tsx # Explorador curricular con preguntas problema y misiones
├── config.ts                # Configuración de URLs base y endpoints mediante variables de entorno
├── context/
│   └── AppContext.tsx       # Estado global de la aplicación (modo, vista, datos del curso, carga y error)
├── data/
│   └── curriculum.ts        # Metadatos curriculares fijos (zonas narrativas y preguntas problema)
├── lib/
│   └── progress/
│       ├── progressLogic.ts # Lógica pura de cálculo de XP, niveles, estados y logros
│       └── progressLogic.test.ts # Pruebas unitarias de la lógica de progreso
├── services/
│   ├── api.ts               # Cliente HTTP centralizado con manejo de caché y errores
│   ├── mappers.ts           # Mapeo tolerante de esquemas CSV a tipos de dominio
│   ├── progressService.ts   # Consumo de action=progress
│   ├── progressService.test.ts # Prueba mínima del contrato y mapeo de action=progress
│   ├── runService.ts        # Consumo de action=run_r (ejecución real de R)
│   ├── rService.ts          # Re-exportación para compatibilidad hacia atrás
│   ├── searchService.ts     # Filtrado booleano, catálogo y persistencia local de búsquedas
│   └── topicService.ts      # Consumo de action=topic_data
├── types/
│   ├── api.ts               # Contrato TypeScript exacto de la API PHP existente
│   └── domain.ts            # Modelos de dominio tipados consumidos por los componentes
├── App.css                  # Estilos auxiliares
├── App.tsx                  # Enrutador principal y controlador de vistas
├── index.css                # Sistema de diseño con variables semánticas (paleta y tipografía)
└── main.tsx                 # Punto de entrada de la aplicación React 19
```

---

## 2. Clasificación de Datos: ¿Qué es Real y qué es de Ejemplo?

En estricto apego a las reglas 3, 8 y 11 de `AGENTS.md`, se identificó claramente qué datos provienen de la API real y qué datos corresponden a la capa de demostración/gamificación calculada:

### Datos Reales (Vienen directamente de la API PHP o del sistema de archivos real):
1. **Métricas globales del curso:** Total de temas (24), búsquedas (360), documentos seleccionados (127), scripts de R (24), datasets (24) y documentos LaTeX (26). Provienen de `action=progress`.
2. **Estructura curricular de Unidades y Temas:** Nombres oficiales de las 4 unidades y los 24 temas. Provienen de `action=progress`.
3. **Porcentajes de actividades por tema:** Estado de las 8 actividades (`busqueda`, `documentos`, `analisis`, `dataset`, `ejemplo_r`, `resultados`, `latex`, `sustentacion`) marcado por la existencia de archivos reales en disco. Provienen de `action=progress`.
4. **Ecuaciones de búsqueda:** Consultas booleanas canónicas, niveles, idiomas, objetivos y enlaces directos a Google Scholar. Provienen de `action=topic_data`.
5. **Documentos científicos:** Títulos reales, autores, año, DOI, citas y criterios PRISMA. Provienen de `action=topic_data`.
6. **Datasets:** Ficha técnica (`metadata.json`) y datos tabulares reales en CSV (primeras 7 filas para vista previa). Provienen de `action=topic_data`.
7. **Código R ejecutable:** Scripts reales de R almacenados en cada tema. Provienen de `action=topic_data`.
8. **Ejecución en tiempo real de R:** Salida estándar/error (`salida`), código de retorno (`exit_code`), gráficos generados en `.png` y reportes `.txt`. Provienen de `action=run_r`.
9. **Código LaTeX:** Capítulos temáticos reales en texto plano (`.tex`). Provienen de `action=topic_data`.

### Datos de Ejemplo / Derivados (Deben reemplazarse o aislarse en fases posteriores):
1. **XP acumulado y Nivel del estudiante:**
   - *Origen actual:* Calculado en el frontend mediante `progressLogic.ts` multiplicando las actividades físicas reales presentes en el repositorio.
   - *Por qué es de ejemplo:* El progreso del repositorio está 100% completo, por lo que un usuario nuevo vería de inmediato un nivel elevado si se toma el estado global del proyecto. En fases posteriores, el progreso del usuario debe desacoplarse del estado del catálogo para iniciar desde cero en su recorrido personal por La Máquina.
2. **Perfil del usuario (`Alex Mendoza / Estudiante`):**
   - *Origen actual:* Archivo estático `datos/usuario_actual.json` y estado local en `AppContext.tsx`.
   - *Por qué es de ejemplo:* La API PHP no tiene autenticación ni gestión de usuarios; la versión 1 opera como demostración de un solo usuario.
3. **Selector de rol (Estudiante, Docente, Administrador):**
   - *Origen actual:* Estado local en `Navbar.tsx` para simulación visual.
   - *Nota:* Conforme a la regla de la Fase 2 ("NO agregar login ni roles"), este selector se documenta como elemento cosmético de muestra y no interviene en la seguridad ni en las peticiones de la API.
4. **Preguntas problema de las unidades:**
   - *Origen actual:* [`data/curriculum.ts`](file:///c:/xampp/htdocs/api%20vehiculos%20tutoria/MINERIA_DATOS/frontend/src/data/curriculum.ts), cargado desde el texto establecido en `AGENTS.md` §2.
   - *Por qué es de ejemplo:* La API PHP no expone estas preguntas en ningún endpoint; están definidas a nivel de frontend como metadatos curriculares.
5. **Historial y guardado de búsquedas:**
   - *Origen actual:* `localStorage` del navegador.
   - *Por qué es de ejemplo:* No existe persistencia en backend para búsquedas guardadas por el estudiante (Brecha B6).

---

## 3. Ordenamiento de la Capa `services/` y Tipado TypeScript

Se consolidó y ordenó la capa `src/services/` asegurando que **ningún componente React invoque `fetch` directamente**:

### 3.1 `src/services/api.ts`
- Cliente HTTP centralizado.
- Clase de error especializada `ApiError` con captura de status HTTP y mensajes amigables.
- Caché en memoria para peticiones `GET` de solo lectura (`action=progress` y `action=topic_data`).
- Método `apiPost` para llamadas form-urlencoded (`action=run_r`).

### 3.2 `src/services/progressService.ts`
- Tipado estricto con `ApiProgressResponse` de [`types/api.ts`](file:///c:/xampp/htdocs/api%20vehiculos%20tutoria/MINERIA_DATOS/frontend/src/types/api.ts).
- Función `getCourseProgress()` que transforma el árbol de unidades y temas al modelo de dominio `CourseProgress`.
- Integración con [`data/curriculum.ts`](file:///c:/xampp/htdocs/api%20vehiculos%20tutoria/MINERIA_DATOS/frontend/src/data/curriculum.ts) para asociar las preguntas problema y zonas del campus a cada unidad.

### 3.3 `src/services/topicService.ts`
- Tipado estricto con `ApiTopicDataResponse` de `types/api.ts`.
- Función `getTopicDetail(unitId, topicId)` que obtiene los 7 módulos del tema.
- Mapeo tolerante de esquemas CSV heterogéneos mediante `mappers.ts`. Si una columna no existe, se establece en `null` y la UI muestra "Sin datos registrados".

### 3.4 `src/services/runService.ts` (con alias en `rService.ts`)
- Tipado estricto con `ApiRunRResponse` de `types/api.ts`.
- Función `runTopicRScript(unitId, topicId)` (y alias `executeRScript`).
- Envía `u` y `t` a `api/index.php?action=run_r`, reporta `exit_code`, captura `salida` y retorna las URLs actualizadas de las imágenes PNG y métricas TXT.

---

## 4. Manejo Centralizado de Estados de Carga y Error

El ciclo de vida de los datos se gestiona centralizadamente:
1. **Nivel Aplicación (`AppContext.tsx` y `App.tsx`):**
   - Estados globales `loading: boolean` y `error: string | null`.
   - Si la API no responde (por ejemplo, si Apache XAMPP está apagado), `App.tsx` intercepta la condición y muestra una pantalla clara de error con botón de reintento (`refreshCourse()`), evitando pantallas en blanco o fallos no capturados.
2. **Nivel Modal Temático (`TopicDetailModal.tsx`):**
   - Indicador de carga con spinner (`Loader2`) mientras se cargan los recursos temáticos de `action=topic_data`.
   - Mensaje de error contextual si la unidad o tema no existen (HTTP 404).
3. **Nivel Ejecución R (`TopicDetailModal.tsx` vía `runService.ts`):**
   - Estado `runningR` que deshabilita el botón y muestra "Ejecutando en R...".
   - Panel de consola con color diferenciado (verde para éxito con `exit_code: 0`, rojo si hay error de sintaxis en R) mostrando la salida real del intérprete.

---

## 5. Configuración de la URL Base de la API

Se actualizó [`src/config.ts`](file:///c:/xampp/htdocs/api%20vehiculos%20tutoria/MINERIA_DATOS/frontend/src/config.ts) para soportar variables de entorno de Vite sin alterar el proxy existente en `vite.config.ts`:

- **Variable `VITE_API_URL`:** Permite especificar una URL absoluta o completa hacia `api/index.php`.
- **Variable `VITE_API_BASE` o `VITE_MD_BASE`:** Permite cambiar el prefijo base del aplicativo.
- **Valor por defecto:** `'/md'` (en desarrollo, Vite redirige las peticiones `/md/...` al origen de Apache `http://localhost/api%20vehiculos%20tutoria/MINERIA_DATOS` respetando la configuración existente).

---

## 6. Verificación de Llamadas Directas

Se ejecutó una búsqueda exhaustiva de llamadas `fetch(` en `frontend/src`:
- **Resultado:** Ningún componente (`components/*`) realiza llamadas `fetch` directas.
- Todas las peticiones HTTP se canalizan exclusivamente a través de:
  - `services/api.ts` -> Función `request<T>()`.
  - `services/authService.ts` -> Verificación no intrusiva de sesión.

---

## 7. Archivos Creados y Modificados en la Fase 2

| Archivo | Acción | Propósito |
|---|:---:|---|
| `frontend/src/services/runService.ts` | **Creado** | Servicio canónico de ejecución de scripts en R conforme a AGENTS.md §6. |
| `frontend/src/services/rService.ts` | **Modificado** | Re-exportación limpia desde `runService.ts` para no romper referencias previas. |
| `frontend/src/config.ts` | **Modificado** | Soporte de variables de entorno `VITE_API_BASE`, `VITE_API_URL` y `VITE_MD_BASE`. |
| `frontend/src/services/progressService.test.ts` | **Creado** | Prueba mínima de validación de contrato y mapeo de `action=progress`. |
| `docs/fase2_reporte.md` | **Creado** | Entregable formal de auditoría y base del frontend. |

---

## 8. Elementos que Sobran o Deben Ajustarse en Fases Posteriores

1. **`components/Remotion/` y `components/progress/` vacíos:** En el árbol de carpetas existen directorios vacíos que se utilizarán en las fases finales (Fase 7 para Remotion). No se han borrado para preservar la estructura esperada por AGENTS.md §6.
2. **Desacoplamiento del recorrido del usuario (Regla 8 de AGENTS.md):** Actualmente el XP y el nivel se calculan a partir de `CourseProgress` (archivos existentes). En la Fase 4 y 5 se separará el *estado del proyecto* del *recorrido del usuario en La Máquina*, almacenando este último en el navegador para permitir que el estudiante inicie en Rango Explorador (0 unidades recorridas).
