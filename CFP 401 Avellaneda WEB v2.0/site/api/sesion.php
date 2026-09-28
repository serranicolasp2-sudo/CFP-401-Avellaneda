<?php
// =============================================================================
// CFP N° 401 AVELLANEDA — ESTADO DE LA SESIÓN DEL PANEL
// =============================================================================
// admin.html lo consulta al abrirse: si la sesión sigue vigente, no vuelve a pedir la clave.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
require_once __DIR__ . '/auth.php';

configurarCors();

echo json_encode(['success' => true, 'autenticado' => sesionActiva()]);
