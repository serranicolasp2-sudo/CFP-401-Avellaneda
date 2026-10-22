<?php
// =============================================================================
// CFP N° 401 AVELLANEDA — REGISTRO DE CAMBIOS DEL PANEL (solo lectura)
// =============================================================================
// Devuelve las últimas entradas de api/backups/registro-cambios.log (quién guardó y cuándo) para
// mostrarlas en "Sistema y Seguridad". Requiere sesión iniciada en el panel, igual que guardar.php.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
require_once __DIR__ . '/auth.php';

configurarCors();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido.']);
    exit;
}

if (!verificarAcceso()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Sesión no autorizada.']);
    exit;
}

$backupDir = defined('BACKUP_DIR') ? BACKUP_DIR : __DIR__ . '/backups';
$archivo = $backupDir . '/registro-cambios.log';
$entradas = [];

if (is_readable($archivo)) {
    // Solo el final del archivo: alcanza para las últimas entradas aunque el registro crezca
    $tamano = filesize($archivo);
    $fp = fopen($archivo, 'rb');
    if ($fp) {
        $leer = min($tamano, 64 * 1024);
        fseek($fp, $tamano - $leer);
        $texto = fread($fp, $leer);
        fclose($fp);
        $lineas = array_reverse(array_filter(array_map('trim', explode("\n", $texto))));
        foreach ($lineas as $linea) {
            // [2026-10-20 22:45:45] Operador: Nico | IP: 1.2.3.4 | Cursos: 26
            if (preg_match('/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] Operador: (.*?) \| IP: ([^|]*?) \| Cursos: (\d+)/u', $linea, $m)) {
                $entradas[] = ['fecha' => $m[1], 'operador' => $m[2], 'ip' => trim($m[3]), 'cursos' => (int) $m[4]];
            }
            if (count($entradas) >= 50) {
                break;
            }
        }
    }
}

echo json_encode(['success' => true, 'entradas' => $entradas], JSON_UNESCAPED_UNICODE);
