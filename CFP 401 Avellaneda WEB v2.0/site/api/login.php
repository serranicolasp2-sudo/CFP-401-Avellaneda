<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/auth.php';

configurarCors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido.']);
    exit;
}

verificarFuerzaBruta();

$raw = file_get_contents('php://input');
$input = @json_decode($raw, true);
$password = isset($input['password']) ? trim($input['password']) : '';

if (empty($password) && isset($_POST['password'])) {
    $password = trim($_POST['password']);
}

if (empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Por favor ingrese la contraseña de administración.']);
    exit;
}

if (!obtenerHashClave() && !obtenerHashMaestra()) {
    http_response_code(503);
    echo json_encode(['success' => false, 'error' => 'El panel todavía no tiene una clave configurada. Ver LEEME-FTP.txt.']);
    exit;
}

$valido = claveValida($password);

if ($valido) {
    limpiarIntentosFallidos();
    iniciarSesionSegura();
    @session_regenerate_id(true);
    $_SESSION['cfp401_admin'] = true;
    $_SESSION['cfp401_login_time'] = time();

    echo json_encode([
        'success' => true,
        'message' => 'Sesión de administración iniciada con éxito.'
    ]);
} else {
    registrarIntentoFallido();
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Contraseña incorrecta.'
    ]);
}
