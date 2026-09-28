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

$input = json_decode(file_get_contents('php://input'), true);
$actual = isset($input['claveActual']) ? trim($input['claveActual']) : '';
$nueva = isset($input['nuevaPassword']) ? trim($input['nuevaPassword']) : '';

if (strlen($nueva) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'La nueva contraseña debe tener como mínimo 6 caracteres.']);
    exit;
}

// Confirmar con la contraseña actual (sirve la común o la maestra)
verificarFuerzaBruta();
if ($actual === '' || !claveValida($actual)) {
    registrarIntentoFallido();
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'La contraseña actual no es correcta.']);
    exit;
}
limpiarIntentosFallidos();

$nuevoHash = password_hash($nueva, PASSWORD_DEFAULT);

if (guardarNuevoHash($nuevoHash)) {
    echo json_encode([
        'success' => true,
        'message' => 'Contraseña de administrador actualizada con éxito (almacenada de forma cifrada).'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'No se pudo guardar la nueva contraseña en el servidor. Verificá los permisos de escritura de la carpeta api/.'
    ]);
}
