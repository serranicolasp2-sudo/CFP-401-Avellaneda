<?php
date_default_timezone_set('America/Argentina/Buenos_Aires');
// =============================================================================
// CFP N° 401 AVELLANEDA — CONFIGURACIÓN DEL PANEL DE ADMINISTRACIÓN
// =============================================================================

// Rutas de archivos y carpetas del sistema
define('DATA_FILE', __DIR__ . '/../data.js');
define('BACKUP_FILE', __DIR__ . '/../data.backup.js');
define('BACKUP_DIR', __DIR__ . '/backups');
define('ASSETS_DIR', __DIR__ . '/../assets/');

// Clave común del equipo (hash bcrypt). Se crea y se cambia desde el panel; no se sube por FTP.
define('CLAVE_FILE', __DIR__ . '/.clave.json');

// Clave maestra del responsable del sitio (hash bcrypt). No se puede cambiar desde el panel
// y sirve para restablecer la clave común. Se genera con herramientas/generar-clave-maestra.php
define('CLAVE_MAESTRA_FILE', __DIR__ . '/.clave-maestra.json');

// Sesiones del panel en una carpeta propia (bloqueada por .htaccess), para que el hosting
// no las borre antes de las 2 horas. Se crea sola; no se sube por FTP.
define('SESIONES_DIR', __DIR__ . '/sesiones');

// Archivo de registro de intentos para protección contra ataques de fuerza bruta
define('INTENTOS_FILE', __DIR__ . '/.intentos.json');
