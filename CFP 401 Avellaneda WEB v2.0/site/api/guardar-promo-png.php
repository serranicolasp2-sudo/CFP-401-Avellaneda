<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/auth.php';
configurarCors();

function responderPng($codigo, $payload) {
    http_response_code($codigo);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') responderPng(405, ['success' => false, 'error' => 'Método no permitido.']);
if (!verificarAcceso()) responderPng(401, ['success' => false, 'error' => 'Sesión no autorizada.']);
// Si la pieza supera los límites de PHP, se avisa cuál ajustar (ver api/.user.ini)
if (empty($_FILES) && !empty($_SERVER['CONTENT_LENGTH'])) responderPng(413, ['success' => false, 'error' => 'La pieza supera el límite de carga del servidor (post_max_size ' . ini_get('post_max_size') . ').']);
if (isset($_FILES['png']) && in_array($_FILES['png']['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) responderPng(413, ['success' => false, 'error' => 'La pieza supera el límite de carga del servidor (upload_max_filesize ' . ini_get('upload_max_filesize') . ').']);
if (!isset($_FILES['png']) || $_FILES['png']['error'] !== UPLOAD_ERR_OK) responderPng(400, ['success' => false, 'error' => 'No se recibió el PNG o la carga falló.']);

$file = $_FILES['png'];
if ($file['size'] < 1000 || $file['size'] > 25 * 1024 * 1024) responderPng(400, ['success' => false, 'error' => 'El PNG debe pesar entre 1 KB y 25 MB.']);
$info = @getimagesize($file['tmp_name']);
if (!$info || $info['mime'] !== 'image/png' || $info[0] < 1 || $info[1] < 1 || $info[0] > 2480 || $info[1] > 3508) {
    responderPng(400, ['success' => false, 'error' => 'La imagen no es PNG válida o supera 2480 × 3508 px.']);
}

$formato = isset($_POST['formato']) ? $_POST['formato'] : '';
if (!in_array($formato, ['feed', 'historia', 'a4'], true)) responderPng(400, ['success' => false, 'error' => 'Formato de pieza no válido.']);
$promoId = isset($_POST['promoId']) ? $_POST['promoId'] : 'promocion';
$promoId = strtolower(preg_replace('/[^a-zA-Z0-9_-]/', '-', $promoId));
$promoId = trim(preg_replace('/-+/', '-', $promoId), '-');
if ($promoId === '') $promoId = 'promocion';
$promoId = substr($promoId, 0, 70);

$dir = dirname(__DIR__) . '/assets/promociones/guardadas';
if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) responderPng(500, ['success' => false, 'error' => 'No se pudo crear la carpeta de piezas guardadas.']);
$filename = $promoId . '-' . $formato . '-' . gmdate('Ymd-His') . '-' . bin2hex(random_bytes(4)) . '.png';
$destination = $dir . '/' . $filename;
if (!@move_uploaded_file($file['tmp_name'], $destination)) responderPng(500, ['success' => false, 'error' => 'No se pudo escribir el PNG. Verificá permisos 755 en la carpeta de promociones.']);
@chmod($destination, 0644);

responderPng(200, ['success' => true, 'url' => 'assets/promociones/guardadas/' . $filename, 'width' => $info[0], 'height' => $info[1], 'bytes' => (int)$file['size']]);
