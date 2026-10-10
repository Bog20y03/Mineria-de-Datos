<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Máquina Virtual — Sistema de Minería de Datos</title>
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- FontAwesome 6 -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet">
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --primary: #1e3a8a;
      --primary-light: #3b82f6;
      --secondary: #0f172a;
      --accent: #10b981;
      --bg-light: #f8fafc;
      --sidebar-width: 320px;
    }
    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-light);
      color: #334155;
      overflow-x: hidden;
    }
    #sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      background: #0f172a;
      color: #f1f5f9;
      overflow-y: auto;
      z-index: 1000;
      transition: all 0.3s;
      border-right: 1px solid #1e293b;
    }
    #main-content {
      margin-left: var(--sidebar-width);
      padding: 2rem 2.5rem;
      min-height: 100vh;
      transition: all 0.3s;
    }
    .sidebar-header {
      padding: 1.5rem;
      background: #0b1120;
      border-bottom: 1px solid #1e293b;
    }
    .nav-link-custom {
      color: #94a3b8;
      padding: 0.65rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      font-size: 0.88rem;
      border-left: 3px solid transparent;
      transition: all 0.2s;
    }
    .nav-link-custom:hover {
      color: #f8fafc;
      background: #1e293b;
    }
    .nav-link-custom.active {
      color: #38bdf8;
      background: #1e293b;
      border-left-color: #38bdf8;
      font-weight: 600;
    }
    .unidad-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #64748b;
      padding: 1.25rem 1.25rem 0.5rem;
      font-weight: 700;
    }
    .card-kpi {
      border: none;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      background: #ffffff;
      transition: transform 0.2s;
    }
    .card-kpi:hover {
      transform: translateY(-2px);
    }
    .progress-bar-custom {
      height: 10px;
      border-radius: 6px;
      background: #e2e8f0;
      overflow: hidden;
    }
    .nav-tabs .nav-link {
      color: #64748b;
      font-weight: 500;
      border: none;
      border-bottom: 3px solid transparent;
      padding: 0.75rem 1.25rem;
    }
    .nav-tabs .nav-link.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
      background: transparent;
      font-weight: 600;
    }
    pre code {
      font-family: 'Fira Code', monospace;
      font-size: 0.85rem;
    }
    .code-box {
      background: #0f172a;
      color: #e2e8f0;
      border-radius: 8px;
      padding: 1.25rem;
      max-height: 480px;
      overflow-y: auto;
    }
    .terminal-box {
      background: #020617;
      color: #22c55e;
      font-family: 'Fira Code', monospace;
      font-size: 0.82rem;
      padding: 1rem;
      border-radius: 8px;
      white-space: pre-wrap;
      max-height: 250px;
      overflow-y: auto;
    }
  </style>
</head>
<body>

  <!-- SIDEBAR -->
  <nav id="sidebar">
    <div class="sidebar-header">
      <div class="d-flex align-items-center gap-2">
        <i class="fa-solid fa-brain fs-3 text-info"></i>
        <div>
          <h6 class="mb-0 text-white fw-bold">MÁQUINA VIRTUAL</h6>
          <small class="text-secondary" style="font-size: 0.75rem;">Sistema de Minería de Datos</small>
        </div>
      </div>
    </div>

    <div class="py-2">
      <a href="javascript:void(0)" class="nav-link-custom active" onclick="cargarVistaInicio()">
        <i class="fa-solid fa-chart-pie"></i>
        <span>Inicio / Progreso General</span>
      </a>

      <!-- UNIDAD 1 -->
      <div class="unidad-title">UNIDAD 1: CONCEPTOS</div>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_1', '01_MINERIA_DE_DATOS')">
        <i class="fa-solid fa-database"></i> 01. Minería de Datos
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_1', '02_KDD')">
        <i class="fa-solid fa-diagram-project"></i> 02. KDD
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_1', '03_CRISP_DM')">
        <i class="fa-solid fa-arrows-spin"></i> 03. CRISP-DM
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_1', '04_MODELO')">
        <i class="fa-solid fa-microchip"></i> 04. Modelo
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_1', '05_MODELO_HIBRIDO')">
        <i class="fa-solid fa-layer-group"></i> 05. Modelo Híbrido
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_1', '06_PREDICCION')">
        <i class="fa-solid fa-chart-line"></i> 06. Predicción
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_1', '07_DATA_WAREHOUSE')">
        <i class="fa-solid fa-warehouse"></i> 07. Data Warehouse
      </a>

      <!-- UNIDAD 2 -->
      <div class="unidad-title">UNIDAD 2: MODELOS Y TÉCNICAS</div>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_2', '01_MODELOS_MINERIA_DATOS')">
        <i class="fa-solid fa-cubes"></i> 01. Modelos
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_2', '02_METODOS_MINERIA_DATOS')">
        <i class="fa-solid fa-gears"></i> 02. Métodos
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_2', '03_ARBOL_CLASIFICACION')">
        <i class="fa-solid fa-tree"></i> 03. Árboles
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_2', '04_REDES_NEURONALES')">
        <i class="fa-solid fa-circle-nodes"></i> 04. Redes Neuronales
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_2', '05_APLICACION_MINERIA_DATOS')">
        <i class="fa-solid fa-briefcase"></i> 05. Aplicaciones
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_2', '06_MINERIA_DATOS_EDUCACION')">
        <i class="fa-solid fa-graduation-cap"></i> 06. Educación (EDM)
      </a>

      <!-- UNIDAD 3 -->
      <div class="unidad-title">UNIDAD 3: APLICACIONES PRÁCTICAS</div>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_3', '01_ARBOL_DECISION')">
        <i class="fa-solid fa-network-wired"></i> 01. Árboles de Decisión
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_3', '02_REDES_NEURONALES')">
        <i class="fa-solid fa-dna"></i> 02. Redes Neuronales
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_3', '03_CLUSTERES')">
        <i class="fa-solid fa-shapes"></i> 03. Clústeres
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_3', '04_SERIES_TIEMPO')">
        <i class="fa-solid fa-timeline"></i> 04. Series de Tiempo
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_3', '05_ASOCIACION_DEPENDENCIA')">
        <i class="fa-solid fa-cart-shopping"></i> 05. Asociación
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_3', '06_VALIDACION_DATOS')">
        <i class="fa-solid fa-shield-halved"></i> 06. Validación y Limpieza
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_3', '07_INTEGRACION_PARTICION_DATOS')">
        <i class="fa-solid fa-code-merge"></i> 07. Integración y Partición
      </a>

      <!-- UNIDAD 4 -->
      <div class="unidad-title">UNIDAD 4: PROYECTO</div>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_4', '01_SELECCION_BASE_DATOS')">
        <i class="fa-solid fa-table"></i> 01. Base de Datos
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_4', '02_APLICACION_TECNICAS')">
        <i class="fa-solid fa-chart-column"></i> 02. Técnicas y Benchmark
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_4', '03_DOCUMENTACION')">
        <i class="fa-solid fa-file-lines"></i> 03. Documentación LaTeX
      </a>
      <a href="javascript:void(0)" class="nav-link-custom" onclick="cargarTema('UNIDAD_4', '04_SUSTENTACION_RESULTADOS')">
        <i class="fa-solid fa-award"></i> 04. Sustentación
      </a>
    </div>
  </nav>

  <!-- CONTENIDO PRINCIPAL -->
  <main id="main-content">
    
    <!-- HEADER BAR -->
    <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
      <div>
        <h4 class="fw-bold mb-0" id="header-titulo">Panel de Control Académico</h4>
        <span class="text-muted small" id="header-subtitulo">Plataforma integral de investigación bibliográfica, laboratorio en R y documentación</span>
      </div>
      <div class="d-flex align-items-center gap-3">
        <span class="badge bg-success-subtle text-success border border-success px-3 py-2">
          <i class="fa-solid fa-circle-check me-1"></i> R v4.4.1 Conectado
        </span>
        <span class="badge bg-primary-subtle text-primary border border-primary px-3 py-2">
          <i class="fa-solid fa-server me-1"></i> PHP 8.2 Activo
        </span>
      </div>
    </div>

    <!-- CONTENEDOR DINÁMICO -->
    <div id="vista-dinamica">
      <!-- Se carga por JavaScript: Dashboard o Tema individual -->
    </div>

  </main>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

  <script>
    const API_URL = 'api/index.php';
    let temaActual = { u: '', t: '' };

    // =========================================================================
    // VISTA 1: DASHBOARD INICIAL
    // =========================================================================
    async function cargarVistaInicio() {
      // Marcar link activo
      document.querySelectorAll('.nav-link-custom').forEach(el => el.classList.remove('active'));
      document.querySelector('.nav-link-custom').classList.add('active');

      document.getElementById('header-titulo').innerText = 'Panel de Progreso General';
      document.getElementById('header-subtitulo').innerText = 'Métricas en tiempo real calculadas automáticamente desde las actividades del repositorio';

      const contenedor = document.getElementById('vista-dinamica');
      contenedor.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Calculando progreso del sistema...</p></div>';

      try {
        const res = await fetch(`${API_URL}?action=progress`);
        const data = await res.json();
        const m = data.metricas;
        const u = data.unidades;

        contenedor.innerHTML = `
          <!-- PROGRESO GENERAL BAR -->
          <div class="card card-kpi p-4 mb-4">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="fw-bold mb-0"><i class="fa-solid fa-bars-progress me-2 text-primary"></i>PROGRESO GENERAL DE LA INVESTIGACIÓN</h5>
              <span class="badge bg-primary fs-6 px-3 py-2">${data.progreso_global}% Completado</span>
            </div>
            <div class="progress progress-bar-custom mt-2" style="height: 14px;">
              <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated" style="width: ${data.progreso_global}%"></div>
            </div>
            <div class="d-flex justify-content-between text-muted small mt-2">
              <span>0% Inicio</span>
              <span>100% Meta Cumplida</span>
            </div>
          </div>

          <!-- TARJETAS KPI -->
          <div class="row g-3 mb-4">
            <div class="col-md-3">
              <div class="card card-kpi p-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="p-3 bg-primary-subtle text-primary rounded-3"><i class="fa-solid fa-magnifying-glass fs-4"></i></div>
                  <div>
                    <h3 class="fw-bold mb-0">${m.total_busquedas}</h3>
                    <span class="text-muted small">Búsquedas Académicas</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card card-kpi p-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="p-3 bg-success-subtle text-success rounded-3"><i class="fa-solid fa-book-bookmark fs-4"></i></div>
                  <div>
                    <h3 class="fw-bold mb-0">${m.documentos_seleccionados}</h3>
                    <span class="text-muted small">Documentos Reales</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card card-kpi p-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="p-3 bg-info-subtle text-info rounded-3"><i class="fa-solid fa-laptop-code fs-4"></i></div>
                  <div>
                    <h3 class="fw-bold mb-0">${m.ejemplos_r}</h3>
                    <span class="text-muted small">Ejemplos en R</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card card-kpi p-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="p-3 bg-warning-subtle text-warning rounded-3"><i class="fa-solid fa-database fs-4"></i></div>
                  <div>
                    <h3 class="fw-bold mb-0">${m.datasets}</h3>
                    <span class="text-muted small">Datasets Públicos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- PROGRESO POR UNIDAD -->
          <h5 class="fw-bold mb-3"><i class="fa-solid fa-layer-group me-2 text-primary"></i>Avance por Unidades Académicas</h5>
          <div class="row g-3 mb-4">
            ${Object.keys(u).map(key => {
              const item = u[key];
              return `
                <div class="col-md-6">
                  <div class="card card-kpi p-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <h6 class="fw-bold mb-0 text-dark">${item.nombre}</h6>
                      <span class="badge ${item.porcentaje >= 80 ? 'bg-success' : 'bg-primary'}">${item.porcentaje}%</span>
                    </div>
                    <div class="progress progress-bar-custom mt-2 mb-3">
                      <div class="progress-bar ${item.porcentaje >= 80 ? 'bg-success' : 'bg-primary'}" style="width: ${item.porcentaje}%"></div>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                      ${Object.keys(item.temas).map(tKey => {
                        const t = item.temas[tKey];
                        return `<button class="btn btn-sm btn-outline-secondary" onclick="cargarTema('${key}', '${tKey}')">${t.nombre} <span class="badge bg-secondary ms-1">${t.porcentaje}%</span></button>`;
                      }).join('')}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      } catch (e) {
        contenedor.innerHTML = `<div class="alert alert-danger"><i class="fa-solid fa-triangle-exclamation me-2"></i>Error al conectar con la API: ${e.message}</div>`;
      }
    }

    // =========================================================================
    // VISTA 2: TEMA INDIVIDUAL (8 PESTAÑAS)
    // =========================================================================
    async function cargarTema(u, t) {
      temaActual = { u, t };

      // Actualizar sidebar activo
      document.querySelectorAll('.nav-link-custom').forEach(el => {
        el.classList.remove('active');
        if (el.getAttribute('onclick')?.includes(t)) el.classList.add('active');
      });

      const contenedor = document.getElementById('vista-dinamica');
      contenedor.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Cargando recursos del tema...</p></div>';

      try {
        const res = await fetch(`${API_URL}?action=topic_data&u=${u}&t=${t}`);
        const data = await res.json();

        document.getElementById('header-titulo').innerText = data.tema_nombre;
        document.getElementById('header-subtitulo').innerText = `${data.unidad_nombre} → Recurso Temático`;

        contenedor.innerHTML = `
          <!-- TABS NAVIGATION -->
          <ul class="nav nav-tabs mb-4" id="temaTabs" role="tablist">
            <li class="nav-item">
              <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-desc"><i class="fa-solid fa-book-open me-2"></i>Descripción y Objetivos</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-busquedas"><i class="fa-solid fa-magnifying-glass me-2"></i>Búsquedas (${data.busquedas.length})</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-docs"><i class="fa-solid fa-graduation-cap me-2"></i>Documentos (${data.documentos.length})</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-dataset"><i class="fa-solid fa-table me-2"></i>Dataset</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-r"><i class="fa-brands fa-r-project me-2"></i>Ejemplo en R</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-resultados"><i class="fa-solid fa-chart-line me-2"></i>Resultados</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-latex"><i class="fa-solid fa-file-code me-2"></i>LaTeX</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="tab" data-bs-target="#tab-avance"><i class="fa-solid fa-list-check me-2"></i>Matriz de Avance</button>
            </li>
          </ul>

          <!-- TABS CONTENT -->
          <div class="tab-content">
            
            <!-- 1. DESCRIPCIÓN -->
            <div class="tab-pane fade show active" id="tab-desc">
              <div class="card card-kpi p-4">
                <div class="markdown-body">
                  ${data.descripcion_md.replace(/# (.*?)\n/g, '<h4 class="fw-bold mb-3">$1</h4>').replace(/## (.*?)\n/g, '<h5 class="fw-bold mt-4 mb-2 text-primary">$1</h5>').replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>

            <!-- 2. BÚSQUEDAS -->
            <div class="tab-pane fade" id="tab-busquedas">
              <div class="card card-kpi p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h5 class="fw-bold mb-0">Ecuaciones de Búsqueda Académica Booleanas</h5>
                  <span class="badge bg-primary">${data.busquedas.length} Consultas Registradas</span>
                </div>
                ${data.busquedas.length === 0 ? '<div class="alert alert-info">No se registran ecuaciones específicas para este módulo.</div>' : `
                  <div class="table-responsive">
                    <table class="table table-hover align-middle">
                      <thead class="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Enfoque / Nivel</th>
                          <th>Ecuación Booleana</th>
                          <th>Objetivo</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${data.busquedas.map(b => `
                          <tr>
                            <td><span class="badge bg-secondary font-monospace">${b.id_ecuacion || b.ID || 'EQ'}</span></td>
                            <td><strong>${b.nivel || b.subtema || 'General'}</strong></td>
                            <td><code class="text-dark">${b.consulta_booleana || b.consulta}</code></td>
                            <td><small class="text-muted">${b.objetivo || ''}</small></td>
                            <td>
                              <a href="${b.url_scholar}" target="_blank" class="btn btn-sm btn-outline-primary text-nowrap">
                                <i class="fa-brands fa-google me-1"></i> Scholar
                              </a>
                            </td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                `}
              </div>
            </div>

            <!-- 3. DOCUMENTOS -->
            <div class="tab-pane fade" id="tab-docs">
              <div class="card card-kpi p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h5 class="fw-bold mb-0">Corpus de Literatura Científica Seleccionada</h5>
                  <span class="badge bg-success">${data.documentos.length} Artículos Reales</span>
                </div>
                ${data.documentos.length === 0 ? '<div class="alert alert-info">No se registran documentos en este tema.</div>' : `
                  <div class="table-responsive">
                    <table class="table table-hover align-middle">
                      <thead class="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Título de la Publicación</th>
                          <th>Autores</th>
                          <th>Año</th>
                          <th>Revista / Medio</th>
                          <th>Pertinencia</th>
                          <th>Enlaces</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${data.documentos.map(d => `
                          <tr>
                            <td><span class="badge bg-dark font-monospace">${d.ID}</span></td>
                            <td><strong>${d.Titulo}</strong></td>
                            <td><small>${d.Autores}</small></td>
                            <td><span class="badge bg-light text-dark border">${d.Anio}</span></td>
                            <td><small class="text-muted"><em>${d.Revista_Conferencia}</em></small></td>
                            <td><span class="badge ${d.Nivel_Pertinencia === 'Alta' ? 'bg-success' : 'bg-warning'}">${d.Nivel_Pertinencia}</span></td>
                            <td>
                              <div class="btn-group btn-group-sm">
                                ${d.DOI ? `<a href="https://doi.org/${d.DOI}" target="_blank" class="btn btn-outline-secondary">DOI</a>` : ''}
                                ${d.URL_Scholar ? `<a href="${d.URL_Scholar}" target="_blank" class="btn btn-outline-primary"><i class="fa-brands fa-google"></i></a>` : ''}
                              </div>
                            </td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                `}
              </div>
            </div>

            <!-- 4. DATASET -->
            <div class="tab-pane fade" id="tab-dataset">
              <div class="card card-kpi p-4 mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h5 class="fw-bold mb-0">Ficha Técnica del Dataset</h5>
                  ${data.dataset.archivo ? `<a href="${u}/${t}/datos/${data.dataset.archivo}" download class="btn btn-sm btn-primary"><i class="fa-solid fa-download me-1"></i> Descargar CSV</a>` : ''}
                </div>
                ${data.dataset.metadata ? `
                  <div class="row g-3 mb-3">
                    <div class="col-md-6">
                      <p class="mb-1"><strong>Nombre:</strong> ${data.dataset.metadata.nombre}</p>
                      <p class="mb-1"><strong>Fuente:</strong> ${data.dataset.metadata.fuente}</p>
                      <p class="mb-1"><strong>Licencia:</strong> <span class="badge bg-info-subtle text-info">${data.dataset.metadata.licencia}</span></p>
                    </div>
                    <div class="col-md-6">
                      <p class="mb-1"><strong>Registros:</strong> ${data.dataset.metadata.numero_registros} observaciones</p>
                      <p class="mb-1"><strong>Tipo de Datos:</strong> ${data.dataset.metadata.tipo_datos}</p>
                      <p class="mb-1"><strong>URL de Consulta:</strong> <a href="${data.dataset.metadata.url}" target="_blank">${data.dataset.metadata.url}</a></p>
                    </div>
                    <div class="col-12">
                      <p class="mb-0 text-muted"><em>${data.dataset.metadata.descripcion}</em></p>
                    </div>
                  </div>
                ` : '<p class="text-muted">No se adjuntó metadata JSON para este tema.</p>'}

                ${data.dataset.preview.length > 0 ? `
                  <h6 class="fw-bold mt-4 mb-2 text-primary">Vista Previa de Datos (Primeras filas):</h6>
                  <div class="table-responsive">
                    <table class="table table-sm table-bordered table-striped font-monospace" style="font-size: 0.8rem;">
                      <thead class="table-dark">
                        <tr>${data.dataset.headers.map(h => `<th>${h}</th>`).join('')}</tr>
                      </thead>
                      <tbody>
                        ${data.dataset.preview.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
                      </tbody>
                    </table>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- 5. EJEMPLO EN R -->
            <div class="tab-pane fade" id="tab-r">
              <div class="card card-kpi p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 class="fw-bold mb-0">Script Reproducible en R</h5>
                    <small class="text-muted">Archivo: <code>${data.ejemplo_r.archivo || 'N/A'}</code></small>
                  </div>
                  <button class="btn btn-success fw-bold px-3 py-2" id="btn-ejecutar-r" onclick="ejecutarScriptR('${u}', '${t}')">
                    <i class="fa-solid fa-play me-1"></i> Ejecutar Script en Tiempo Real
                  </button>
                </div>

                <!-- CONSOLA DE SALIDA -->
                <div id="consola-salida-container" style="display: none;" class="mb-3">
                  <h6 class="fw-bold text-success"><i class="fa-solid fa-terminal me-1"></i>Salida Estándar de Ejecución:</h6>
                  <div class="terminal-box" id="consola-salida"></div>
                </div>

                <div class="code-box">
                  <pre><code>${data.ejemplo_r.codigo ? escapeHtml(data.ejemplo_r.codigo) : 'No se encontró script R asociado.'}</code></pre>
                </div>
              </div>
            </div>

            <!-- 6. RESULTADOS -->
            <div class="tab-pane fade" id="tab-resultados">
              <div class="card card-kpi p-4">
                <h5 class="fw-bold mb-3">Evidencia Experimental y Gráfica Diagnóstica</h5>
                <div class="row g-4">
                  <div class="col-md-7">
                    ${data.resultados.imagenes.length > 0 ? `
                      <div class="text-center p-2 border rounded bg-white shadow-sm" id="contenedor-grafico">
                        <img src="${data.resultados.imagenes[0].url}" class="img-fluid rounded" alt="Gráfico de Resultados">
                        <small class="d-block text-muted mt-2">${data.resultados.imagenes[0].nombre}</small>
                      </div>
                    ` : '<div class="alert alert-secondary">No se han generado gráficos para este tema.</div>'}
                  </div>
                  <div class="col-md-5">
                    <h6 class="fw-bold text-primary mb-2">Reporte de Métricas Numéricas:</h6>
                    <div class="code-box" style="max-height: 400px;" id="contenedor-metricas">
                      <pre><code>${data.resultados.metricas ? escapeHtml(data.resultados.metricas) : 'Métricas pendientes de ejecución.'}</code></pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 7. LATEX -->
            <div class="tab-pane fade" id="tab-latex">
              <div class="card card-kpi p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h5 class="fw-bold mb-0">Documentación Técnica en LaTeX</h5>
                  ${data.latex.archivo ? `<a href="${u}/${t}/latex/${data.latex.archivo}" download class="btn btn-sm btn-outline-secondary"><i class="fa-solid fa-download me-1"></i> Descargar .tex</a>` : ''}
                </div>
                <div class="code-box">
                  <pre><code>${data.latex.codigo ? escapeHtml(data.latex.codigo) : 'Documento LaTeX pendiente.'}</code></pre>
                </div>
              </div>
            </div>

            <!-- 8. MATRIZ DE AVANCE -->
            <div class="tab-pane fade" id="tab-avance">
              <div class="card card-kpi p-4">
                <h5 class="fw-bold mb-3">Matriz de Seguimiento del Progreso Temático</h5>
                <div class="table-responsive">
                  <table class="table table-bordered align-middle">
                    <thead class="table-light">
                      <tr>
                        <th>Actividad Clave</th>
                        <th>Estado Actual</th>
                        <th>Evidencia en el Sistema</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Búsqueda bibliográfica</strong></td>
                        <td><span class="badge ${data.busquedas.length > 0 ? 'bg-success' : 'bg-warning'}">${data.busquedas.length > 0 ? 'Completada' : 'Pendiente'}</span></td>
                        <td>${data.busquedas.length} ecuaciones booleanas documentadas con Google Scholar</td>
                      </tr>
                      <tr>
                        <td><strong>Documentos seleccionados</strong></td>
                        <td><span class="badge ${data.documentos.length > 0 ? 'bg-success' : 'bg-warning'}">${data.documentos.length > 0 ? 'Completada' : 'Pendiente'}</span></td>
                        <td>${data.documentos.length} artículos académicos verificados con autores y DOI</td>
                      </tr>
                      <tr>
                        <td><strong>Análisis bibliográfico</strong></td>
                        <td><span class="badge ${data.documentos.length > 0 ? 'bg-success' : 'bg-warning'}">${data.documentos.length > 0 ? 'Completada' : 'Pendiente'}</span></td>
                        <td>Matriz comparativa de metodología y resultados</td>
                      </tr>
                      <tr>
                        <td><strong>Dataset seleccionado</strong></td>
                        <td><span class="badge ${data.dataset.archivo ? 'bg-success' : 'bg-warning'}">${data.dataset.archivo ? 'Completada' : 'Pendiente'}</span></td>
                        <td>${data.dataset.archivo || 'N/A'} (${data.dataset.metadata ? data.dataset.metadata.fuente : 'Open Data'})</td>
                      </tr>
                      <tr>
                        <td><strong>Ejemplo en R</strong></td>
                        <td><span class="badge ${data.ejemplo_r.archivo ? 'bg-success' : 'bg-warning'}">${data.ejemplo_r.archivo ? 'Completada' : 'Pendiente'}</span></td>
                        <td>Script ejecutable: <code>${data.ejemplo_r.archivo || 'N/A'}</code></td>
                      </tr>
                      <tr>
                        <td><strong>Resultados experimentales</strong></td>
                        <td><span class="badge ${data.resultados.imagenes.length > 0 ? 'bg-success' : 'bg-warning'}">${data.resultados.imagenes.length > 0 ? 'Completada' : 'Pendiente'}</span></td>
                        <td>${data.resultados.imagenes.length} gráficos diagnósticos y reporte numérico</td>
                      </tr>
                      <tr>
                        <td><strong>Documentación LaTeX</strong></td>
                        <td><span class="badge ${data.latex.archivo ? 'bg-success' : 'bg-warning'}">${data.latex.archivo ? 'Completada' : 'Pendiente'}</span></td>
                        <td>Capítulo LaTeX estructurado</td>
                      </tr>
                      <tr>
                        <td><strong>Sustentación</strong></td>
                        <td><span class="badge bg-success">Completada</span></td>
                        <td>Material sintetizado y disponible para defensa</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        `;
      } catch (e) {
        contenedor.innerHTML = `<div class="alert alert-danger"><i class="fa-solid fa-triangle-exclamation me-2"></i>Error al cargar tema: ${e.message}</div>`;
      }
    }

    // =========================================================================
    // ACCIÓN: EJECUTAR SCRIPT EN R EN TIEMPO REAL
    // =========================================================================
    async function ejecutarScriptR(u, t) {
      const btn = document.getElementById('btn-ejecutar-r');
      const termContainer = document.getElementById('consola-salida-container');
      const term = document.getElementById('consola-salida');

      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status"></span> Ejecutando en R...';
      termContainer.style.display = 'block';
      term.innerText = '>>> Iniciando proceso Rscript.exe en segundo plano...\n';

      try {
        const formData = new FormData();
        formData.append('u', u);
        formData.append('t', t);

        const res = await fetch(`${API_URL}?action=run_r`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();

        if (data.status === 'success') {
          term.innerText = `>>> EJECUCIÓN EXITOSA (Código 0):\n\n${data.salida}`;
          
          // Refrescar gráfica en vivo
          if (data.imagenes.length > 0) {
            const imgBox = document.getElementById('contenedor-grafico');
            if (imgBox) {
              imgBox.innerHTML = `
                <img src="${data.imagenes[0].url}" class="img-fluid rounded" alt="Gráfico de Resultados">
                <small class="d-block text-muted mt-2">${data.imagenes[0].nombre} (Actualizado recién)</small>
              `;
            }
          }
          // Refrescar métricas en vivo
          const metBox = document.getElementById('contenedor-metricas');
          if (metBox && data.metricas) {
            metBox.innerHTML = `<pre><code>${escapeHtml(data.metricas)}</code></pre>`;
          }

        } else {
          term.innerText = `>>> ERROR EN LA EJECUCIÓN (Código ${data.exit_code}):\n\n${data.salida}`;
        }
      } catch (e) {
        term.innerText = `>>> Error de comunicación: ${e.message}`;
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-play me-1"></i> Ejecutar Script en Tiempo Real';
      }
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    // Inicializar cargando el dashboard
    document.addEventListener('DOMContentLoaded', () => {
      cargarVistaInicio();
    });
  </script>
</body>
</html>
