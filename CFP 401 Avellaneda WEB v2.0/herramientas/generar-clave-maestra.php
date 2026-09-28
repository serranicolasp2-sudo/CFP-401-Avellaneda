<?php
// =============================================================================
// CFP N° 401 AVELLANEDA — GENERAR LA CLAVE MAESTRA DEL PANEL
// =============================================================================
// Uso, desde la carpeta "CFP 401 Avellaneda WEB v2.0":
//     php herramientas/generar-clave-maestra.php
// La clave se escribe por teclado: no queda en ningún archivo ni en el historial
// de comandos. Después hay que subir site/api/.clave-maestra.json a api/ por FTP.
// Esta carpeta NO se sube al servidor.

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

$destino = __DIR__ . '/../site/api/.clave-maestra.json';

echo "Nueva clave maestra (se ve en pantalla mientras la escribís): ";
$clave = trim((string) fgets(STDIN));
if (strlen($clave) < 8) {
    fwrite(STDERR, "La clave maestra debe tener al menos 8 caracteres. No se cambió nada.\n");
    exit(1);
}

echo "Repetila: ";
if (trim((string) fgets(STDIN)) !== $clave) {
    fwrite(STDERR, "Las claves no coinciden. No se cambió nada.\n");
    exit(1);
}

$json = json_encode([
    'hash' => password_hash($clave, PASSWORD_DEFAULT),
    'tipo' => 'maestra',
    'actualizado' => date('c')
], JSON_PRETTY_PRINT);

if (file_put_contents($destino, $json, LOCK_EX) === false) {
    fwrite(STDERR, "No se pudo escribir $destino\n");
    exit(1);
}

echo "Listo: site/api/.clave-maestra.json actualizado. Subilo por FTP a la carpeta api/ del servidor.\n";
