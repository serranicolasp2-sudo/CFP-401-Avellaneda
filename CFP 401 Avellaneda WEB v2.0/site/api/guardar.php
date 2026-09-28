<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/auth.php';

configurarCors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido.']);
    exit;
}

if (!verificarAcceso()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Sesión no autorizada o credenciales incorrectas.']);
    exit;
}

$rawInput = file_get_contents('php://input');
if (strlen($rawInput) > 3 * 1024 * 1024) { // Límite de seguridad 3 MB
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'El tamaño de los datos excede el límite permitido (3 MB).']);
    exit;
}

$input = @json_decode($rawInput, true);
if (!$input || !isset($input['data'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No se recibieron datos válidos para guardar.']);
    exit;
}

$data = $input['data'];

// Validación de catálogo de cursos (§B3)
if (!isset($data['courses']) || !is_array($data['courses']) || empty($data['courses'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'El catálogo debe contener al menos un curso activo.']);
    exit;
}

$slugsVistos = [];
$cursosPorSlug = [];
foreach ($data['courses'] as $idx => $c) {
    if (empty($c['curso']) || !is_string($c['curso'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "El curso en posición #" . ($idx + 1) . " no tiene un nombre válido."]);
        exit;
    }
    
    $slug = isset($c['slug']) ? trim($c['slug']) : '';
    if (empty($slug)) {
        // Auto-generar slug si falta
        $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', trim($c['curso'])));
        $slug = trim($slug, '-');
        $data['courses'][$idx]['slug'] = $slug;
    }

    if (!preg_match('/^[a-z0-9-]+$/', $slug)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "El curso '{$c['curso']}' tiene un slug con caracteres no válidos: {$slug}"]);
        exit;
    }

    if (isset($slugsVistos[$slug])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Se detectó un slug duplicado: '{$slug}'. Cada curso debe tener un identificador único."]);
        exit;
    }
    $slugsVistos[$slug] = true;
    $cursosPorSlug[$slug] = $c;

    if (isset($c['estadoCupo']) && !in_array($c['estadoCupo'], ['sin-confirmar', 'abierto', 'ultimos-cupos', 'completo'], true)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "El estado de cupos del curso '{$c['curso']}' no es válido."]);
        exit;
    }
    if (isset($c['cupoConfirmadoEn']) && $c['cupoConfirmadoEn'] !== '') {
        $fechaCupo = DateTimeImmutable::createFromFormat('!Y-m-d', $c['cupoConfirmadoEn'], new DateTimeZone('America/Argentina/Buenos_Aires'));
        if (!$fechaCupo || $fechaCupo->format('Y-m-d') !== $c['cupoConfirmadoEn']) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => "La fecha de confirmación de cupos del curso '{$c['curso']}' no es válida."]);
            exit;
        }
    }
}

if (isset($data['promociones'])) {
    if (!is_array($data['promociones'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'La lista de promociones no tiene un formato válido.']);
        exit;
    }
    $hoy = new DateTimeImmutable('today', new DateTimeZone('America/Argentina/Buenos_Aires'));
    foreach ($data['promociones'] as $promo) {
        $desde = isset($promo['popupDesde']) ? trim($promo['popupDesde']) : '';
        $hasta = isset($promo['popupHasta']) ? trim($promo['popupHasta']) : '';
        foreach ([$desde, $hasta] as $fechaPromo) {
            if ($fechaPromo !== '') {
                $fecha = DateTimeImmutable::createFromFormat('!Y-m-d', $fechaPromo, new DateTimeZone('America/Argentina/Buenos_Aires'));
                if (!$fecha || $fecha->format('Y-m-d') !== $fechaPromo) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'error' => 'Una fecha de vigencia de promoción no es válida.']);
                    exit;
                }
            }
        }
        if ($desde !== '' && $hasta !== '' && $hasta < $desde) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'El vencimiento de una promoción no puede ser anterior a su inicio.']);
            exit;
        }
        if (($promo['popupActivo'] ?? false) === true && ($promo['modelo'] ?? '') === 'ultimos-cupos-v1') {
            $curso = $cursosPorSlug[$promo['cursoSlug'] ?? ''] ?? null;
            $confirmada = $curso['cupoConfirmadoEn'] ?? '';
            $fechaCupo = $confirmada ? DateTimeImmutable::createFromFormat('!Y-m-d', $confirmada, new DateTimeZone('America/Argentina/Buenos_Aires')) : false;
            $vigente = $fechaCupo && $fechaCupo <= $hoy && $fechaCupo >= $hoy->modify('-30 days');
            if (!$curso || ($curso['estadoCupo'] ?? '') !== 'ultimos-cupos' || !$vigente) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'No se puede activar un pop-up de últimos cupos sin estado confirmado y vigente en el curso.']);
                exit;
            }
        }
    }
}

// Convertir a estructura JavaScript limpia y legible
$jsonString = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$jsContent = "/* ===========================================================================\n"
           . "   CFP N° 401 AVELLANEDA — CONTENIDOS EDITABLES DEL SITIO (v2.0)\n"
           . "   Generado desde el Panel de Administración: " . date('Y-m-d H:i:s') . "\n"
           . "   =========================================================================== */\n\n"
           . "window.CFP_DATA = " . $jsonString . ";\n";

// 1. Escritura atómica en archivo temporal (§B2)
$tmpFile = DATA_FILE . '.tmp';
if (@file_put_contents($tmpFile, $jsContent, LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'No se pudo escribir el archivo temporal en el servidor. Verificá los permisos de escritura en la carpeta del sitio.'
    ]);
    exit;
}

// 2. Validación de integridad del archivo generado antes de reemplazar el real
if (filesize($tmpFile) < 1000 || substr(trim($jsContent), -2) !== '};') {
    @unlink($tmpFile);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de validación: el archivo de datos generado no cumple con los requisitos mínimos de integridad.'
    ]);
    exit;
}

// 3. Respaldos rotativos históricos en api/backups/ (§B1)
$backupDir = defined('BACKUP_DIR') ? BACKUP_DIR : __DIR__ . '/backups';
if (!is_dir($backupDir)) {
    @mkdir($backupDir, 0755, true);
}

if (file_exists(DATA_FILE)) {
    // Copia histórica con timestamp
    $timestampBackup = $backupDir . '/data-' . date('Ymd-His') . '.js';
    @copy(DATA_FILE, $timestampBackup);
    
    // Copia rápida legacy
    @copy(DATA_FILE, BACKUP_FILE);

    // Conservar únicamente los últimos 20 respaldos (eliminar los más antiguos)
    $backups = glob($backupDir . '/data-*.js');
    if (is_array($backups) && count($backups) > 20) {
        sort($backups);
        $aEliminar = count($backups) - 20;
        for ($i = 0; $i < $aEliminar; $i++) {
            @unlink($backups[$i]);
        }
    }
}

// 4. Reemplazo atómico seguro
$reemplazado = @rename($tmpFile, DATA_FILE);
if (!$reemplazado) {
    // Fallback si rename está bloqueado por el sistema de archivos
    if (@copy($tmpFile, DATA_FILE)) {
        @unlink($tmpFile);
        $reemplazado = true;
    }
}

if (!$reemplazado) {
    @unlink($tmpFile);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'No se pudo actualizar data.js en el servidor. Verificá los permisos del archivo.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => '¡Datos guardados con éxito en el servidor y respaldo rotativo creado!',
    'timestamp' => date('d/m/Y H:i:s'),
    'cursosGuardados' => count($data['courses'])
]);
