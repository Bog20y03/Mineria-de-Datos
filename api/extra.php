<?php
// ==============================================================================
// BACKEND API ADITIVA: MÁQUINA VIRTUAL DE MINERÍA DE DATOS (Fase 5+)
// Provee endpoints aditivos sin modificar api/index.php.
// ==============================================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

$baseDir = dirname(__DIR__);
$action = $_GET['action'] ?? 'curriculum';

// Helper para responder JSON estándar
function jsonExtraResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// Estructura oficial canónica para validación estricta de parámetros
$estructuraValida = [
    'UNIDAD_1' => [
        '01_MINERIA_DE_DATOS', '02_KDD', '03_CRISP_DM', '04_MODELO',
        '05_MODELO_HIBRIDO', '06_PREDICCION', '07_DATA_WAREHOUSE'
    ],
    'UNIDAD_2' => [
        '01_MODELOS_MINERIA_DATOS', '02_METODOS_MINERIA_DATOS', '03_ARBOL_CLASIFICACION',
        '04_REDES_NEURONALES', '05_APLICACION_MINERIA_DATOS', '06_MINERIA_DATOS_EDUCACION'
    ],
    'UNIDAD_3' => [
        '01_ARBOL_DECISION', '02_REDES_NEURONALES', '03_CLUSTERES', '04_SERIES_TIEMPO',
        '05_ASOCIACION_DEPENDENCIA', '06_VALIDACION_DATOS', '07_INTEGRACION_PARTICION_DATOS'
    ],
    'UNIDAD_4' => [
        '01_SELECCION_BASE_DATOS', '02_APLICACION_TECNICAS',
        '03_DOCUMENTACION', '04_SUSTENTACION_RESULTADOS'
    ]
];

function validarParametros($u, $t, $estructuraValida) {
    if (!$u || !isset($estructuraValida[$u])) {
        jsonExtraResponse(['error' => 'Unidad no válida o no especificada.', 'unidad' => $u], 400);
    }
    if (!$t || !in_array($t, $estructuraValida[$u], true)) {
        jsonExtraResponse(['error' => 'Tema no válido para la unidad especificada.', 'unidad' => $u, 'tema' => $t], 400);
    }
}

// ------------------------------------------------------------------------------
// ACCIÓN: CURRICULUM (Bloque A - Preguntas problema de las 4 unidades)
// ------------------------------------------------------------------------------
if ($action === 'curriculum') {
    $curriculumPath = "$baseDir/datos/unidades_curriculum.json";
    if (!file_exists($curriculumPath)) {
        jsonExtraResponse(['error' => 'Archivo de currículum no encontrado.'], 404);
    }
    $raw = file_get_contents($curriculumPath);
    $data = json_decode($raw, true);
    if ($data === null) {
        jsonExtraResponse(['error' => 'Formato JSON corrupto en unidades_curriculum.json.'], 500);
    }
    jsonExtraResponse([
        'status' => 'success',
        'total_unidades' => count($data),
        'unidades' => $data
    ]);
}

// ------------------------------------------------------------------------------
// ACCIÓN NO RECONOCIDA
// ------------------------------------------------------------------------------
jsonExtraResponse([
    'error' => 'Acción no válida en API extra.',
    'accion_solicitada' => $action,
    'acciones_disponibles' => ['curriculum', 'metrics', 'topic_extra', 'pipeline_step']
], 400);
