<?php
// =============================================================================
// CFP N° 401 AVELLANEDA — AUTENTICACIÓN Y SEGURIDAD DEL PANEL
// =============================================================================

require_once __DIR__ . '/config.php';

/**
 * Configuración estricta de CORS y cabeceras de respuesta
 */
function configurarCors() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    // Si viene origen, validar que sea del mismo dominio o localhost
    if (!empty($origin)) {
        $host = parse_url($origin, PHP_URL_HOST);
        $serverHost = isset($_SERVER['HTTP_HOST']) ? explode(':', $_SERVER['HTTP_HOST'])[0] : '';
        
        $permitido = (
            $host === $serverHost ||
            $host === 'campuscfp401avellaneda.com.ar' ||
            $host === 'www.campuscfp401avellaneda.com.ar' ||
            $host === 'cfp401avellaneda.com.ar' ||
            $host === 'www.cfp401avellaneda.com.ar' ||
            $host === 'localhost' ||
            $host === '127.0.0.1'
        );

        if ($permitido) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
        }
    }

    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

/**
 * Obtener la dirección IP real del cliente
 */
function getClientIp() {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    }
    return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
}

/**
 * Protección contra ataques de fuerza bruta (máximo 5 intentos en 15 minutos)
 */
function verificarFuerzaBruta() {
    $ip = getClientIp();
    $intentosData = [];

    if (file_exists(INTENTOS_FILE)) {
        $content = @file_get_contents(INTENTOS_FILE);
        $intentosData = @json_decode($content, true);
        if (!is_array($intentosData)) {
            $intentosData = [];
        }
    }

    $ahora = time();
    $limiteTiempo = 900; // 15 minutos en segundos
    $modificado = false;

    // Purgar registros antiguos
    foreach ($intentosData as $k => $v) {
        if ($ahora - $v['ultimo'] > $limiteTiempo) {
            unset($intentosData[$k]);
            $modificado = true;
        }
    }

    if ($modificado) {
        @file_put_contents(INTENTOS_FILE, json_encode($intentosData), LOCK_EX);
    }

    if (isset($intentosData[$ip])) {
        if ($intentosData[$ip]['intentos'] >= 5 && ($ahora - $intentosData[$ip]['ultimo']) < $limiteTiempo) {
            $restante = ceil(($limiteTiempo - ($ahora - $intentosData[$ip]['ultimo'])) / 60);
            http_response_code(429);
            echo json_encode([
                'success' => false,
                'error' => "Demasiados intentos fallidos. Por seguridad, el acceso está bloqueado por {$restante} minuto(s)."
            ]);
            exit;
        }
    }

    return true;
}

/**
 * Registrar intento de acceso fallido y aplicar retardo de 1 segundo
 */
function registrarIntentoFallido() {
    $ip = getClientIp();
    $intentosData = [];

    if (file_exists(INTENTOS_FILE)) {
        $content = @file_get_contents(INTENTOS_FILE);
        $intentosData = @json_decode($content, true);
        if (!is_array($intentosData)) {
            $intentosData = [];
        }
    }

    $ahora = time();
    $actual = isset($intentosData[$ip]) ? $intentosData[$ip]['intentos'] : 0;
    $intentosData[$ip] = [
        'intentos' => $actual + 1,
        'ultimo' => $ahora
    ];

    @file_put_contents(INTENTOS_FILE, json_encode($intentosData), LOCK_EX);
    
    // Retardo para amortiguar fuerza bruta automatizada
    sleep(1);
}

/**
 * Limpiar contador de intentos fallidos tras login exitoso
 */
function limpiarIntentosFallidos() {
    $ip = getClientIp();
    if (!file_exists(INTENTOS_FILE)) return;

    $content = @file_get_contents(INTENTOS_FILE);
    $intentosData = @json_decode($content, true);
    if (is_array($intentosData) && isset($intentosData[$ip])) {
        unset($intentosData[$ip]);
        @file_put_contents(INTENTOS_FILE, json_encode($intentosData), LOCK_EX);
    }
}

/**
 * Leer el hash de un archivo de credenciales (null si no existe o está dañado)
 */
function leerHash($archivo) {
    if (file_exists($archivo)) {
        $json = @json_decode(@file_get_contents($archivo), true);
        if (is_array($json) && !empty($json['hash'])) {
            return $json['hash'];
        }
    }
    return null;
}

/**
 * Hash de la clave común del equipo (la que se cambia desde el panel).
 * No se crea ninguna por defecto: si todavía no existe, se entra con la clave maestra y se la define.
 */
function obtenerHashClave() {
    return leerHash(CLAVE_FILE);
}

/**
 * Hash de la clave maestra del responsable del sitio (no se modifica desde el panel)
 */
function obtenerHashMaestra() {
    return defined('CLAVE_MAESTRA_FILE') ? leerHash(CLAVE_MAESTRA_FILE) : null;
}

/**
 * Validar una clave contra la clave común y la maestra
 */
function claveValida($clave) {
    foreach ([obtenerHashClave(), obtenerHashMaestra()] as $hash) {
        if ($hash && password_verify($clave, $hash)) {
            return true;
        }
    }
    return false;
}

/**
 * Guardar de forma atómica un nuevo hash de contraseña
 */
function guardarNuevoHash($nuevoHash) {
    $data = [
        'hash' => $nuevoHash,
        'actualizado' => date('c')
    ];
    $json = json_encode($data, JSON_PRETTY_PRINT);
    $tmp = CLAVE_FILE . '.tmp';
    if (@file_put_contents($tmp, $json, LOCK_EX) !== false) {
        @rename($tmp, CLAVE_FILE);
        return true;
    }
    return false;
}

/**
 * Iniciar sesión PHP segura para el administrador
 */
function iniciarSesionSegura() {
    if (session_status() === PHP_SESSION_NONE) {
        $esHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
                   (!empty($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);

        // Guardar las sesiones en una carpeta propia: muchos hostings limpian la carpeta compartida
        // a los 24 minutos de inactividad y cerrarían la sesión antes de las 2 horas.
        if (defined('SESIONES_DIR')) {
            $dir = SESIONES_DIR;
            if (!is_dir($dir) && @mkdir($dir, 0700, true)) {
                @file_put_contents($dir . '/.htaccess', "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n");
            }
            if (is_dir($dir) && is_writable($dir)) {
                session_save_path($dir);
                ini_set('session.gc_probability', '1');
                ini_set('session.gc_divisor', '100');
            }
        }
        ini_set('session.gc_maxlifetime', '7200');

        session_set_cookie_params([
            'lifetime' => 7200, // 2 horas de duración
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Strict',
            'secure' => $esHttps
        ]);
        @session_start();
    }
}

/**
 * ¿Hay una sesión de administración vigente? (la inicia login.php y dura 2 horas)
 */
function sesionActiva() {
    // Sin cookie no hay sesión que buscar: así no se crea un archivo de sesión vacío por cada visita
    if (empty($_COOKIE[session_name()])) {
        return false;
    }
    iniciarSesionSegura();
    return !empty($_SESSION['cfp401_admin']) && $_SESSION['cfp401_admin'] === true
        && !empty($_SESSION['cfp401_login_time']) && (time() - $_SESSION['cfp401_login_time'] < 7200);
}

/**
 * Validar si la petición actual cuenta con autorización válida.
 * Solo por sesión: la contraseña se envía únicamente a login.php (auditoría A2).
 */
function verificarAcceso() {
    configurarCors();
    return sesionActiva();
}
