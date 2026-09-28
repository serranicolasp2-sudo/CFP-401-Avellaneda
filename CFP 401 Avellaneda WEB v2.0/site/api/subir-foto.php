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

if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No se recibió ninguna imagen o ocurrió un error durante la carga.']);
    exit;
}

$file = $_FILES['foto'];

// 1. Limitar tamaño a 8 MB (§A5)
if ($file['size'] > 8 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'El archivo supera el tamaño máximo permitido de 8 MB.']);
    exit;
}

// 2. Validación de tipo MIME real con finfo y getimagesize (§A5)
$tmpPath = $file['tmp_name'];
$imgInfo = @getimagesize($tmpPath);
if ($imgInfo === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'El archivo subido no es una imagen válida o está dañado.']);
    exit;
}

$mimeReal = '';
if (function_exists('finfo_open')) {
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeReal = finfo_file($finfo, $tmpPath);
    finfo_close($finfo);
} else {
    $mimeReal = $imgInfo['mime'];
}

$mimesPermitidos = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp'
];

if (!array_key_exists($mimeReal, $mimesPermitidos)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Formato no admitido. Se admiten únicamente imágenes JPEG, PNG o WebP reales.']);
    exit;
}

$extFinal = $mimesPermitidos[$mimeReal];

// 3. Sanitización del nombre de archivo
$rawName = pathinfo($file['name'], PATHINFO_FILENAME);
$cleanName = strtolower(preg_replace('/[^a-zA-Z0-9_-]/', '-', $rawName));
$cleanName = trim(preg_replace('/-+/', '-', $cleanName), '-');
if (empty($cleanName)) {
    $cleanName = 'foto';
}

$filename = 'foto-' . time() . '-' . $cleanName . '.' . $extFinal;
$destino = ASSETS_DIR . $filename;

if (!is_dir(ASSETS_DIR)) {
    @mkdir(ASSETS_DIR, 0755, true);
}

// 4. Re-procesamiento con GD (elimina metadatos EXIF / GPS y payloads maliciosos)
$procesadoConGd = false;
if (extension_loaded('gd') && function_exists('imagecreatefromstring')) {
    $srcImg = null;
    if ($extFinal === 'jpg') {
        $srcImg = @imagecreatefromjpeg($tmpPath);
    } elseif ($extFinal === 'png') {
        $srcImg = @imagecreatefrompng($tmpPath);
    } elseif ($extFinal === 'webp' && function_exists('imagecreatefromwebp')) {
        $srcImg = @imagecreatefromwebp($tmpPath);
    }

    if ($srcImg) {
        // Corregir orientación EXIF para fotos JPEG de celulares antes de redimensionar
        if ($extFinal === 'jpg' && function_exists('exif_read_data')) {
            $exif = @exif_read_data($tmpPath);
            if (!empty($exif['Orientation'])) {
                switch ($exif['Orientation']) {
                    case 2:
                        if (function_exists('imageflip')) @imageflip($srcImg, IMG_FLIP_HORIZONTAL);
                        break;
                    case 3:
                        $rotated = @imagerotate($srcImg, 180, 0);
                        if ($rotated) { imagedestroy($srcImg); $srcImg = $rotated; }
                        break;
                    case 4:
                        if (function_exists('imageflip')) @imageflip($srcImg, IMG_FLIP_VERTICAL);
                        break;
                    case 5:
                        if (function_exists('imageflip')) @imageflip($srcImg, IMG_FLIP_VERTICAL);
                        $rotated = @imagerotate($srcImg, -90, 0);
                        if ($rotated) { imagedestroy($srcImg); $srcImg = $rotated; }
                        break;
                    case 6:
                        $rotated = @imagerotate($srcImg, -90, 0);
                        if ($rotated) { imagedestroy($srcImg); $srcImg = $rotated; }
                        break;
                    case 7:
                        if (function_exists('imageflip')) @imageflip($srcImg, IMG_FLIP_HORIZONTAL);
                        $rotated = @imagerotate($srcImg, -90, 0);
                        if ($rotated) { imagedestroy($srcImg); $srcImg = $rotated; }
                        break;
                    case 8:
                        $rotated = @imagerotate($srcImg, 90, 0);
                        if ($rotated) { imagedestroy($srcImg); $srcImg = $rotated; }
                        break;
                }
            }
        }

        $anchoOriginal = imagesx($srcImg);
        $altoOriginal = imagesy($srcImg);
        $maxDimension = 2400;

        // Redimensionar suavemente si excede 2400 px para ahorrar ancho de banda
        if ($anchoOriginal > $maxDimension || $altoOriginal > $maxDimension) {
            $ratio = min($maxDimension / $anchoOriginal, $maxDimension / $altoOriginal);
            $nuevoAncho = (int)($anchoOriginal * $ratio);
            $nuevoAlto = (int)($altoOriginal * $ratio);

            $dstImg = imagecreatetruecolor($nuevoAncho, $nuevoAlto);
            if ($extFinal === 'png' || $extFinal === 'webp') {
                imagealphablending($dstImg, false);
                imagesavealpha($dstImg, true);
            }
            imagecopyresampled($dstImg, $srcImg, 0, 0, 0, 0, $nuevoAncho, $nuevoAlto, $anchoOriginal, $altoOriginal);
            imagedestroy($srcImg);
            $srcImg = $dstImg;
        }

        // Guardar la imagen re-encodeada
        if ($extFinal === 'jpg') {
            $procesadoConGd = @imagejpeg($srcImg, $destino, 85);
        } elseif ($extFinal === 'png') {
            imagealphablending($srcImg, false);
            imagesavealpha($srcImg, true);
            $procesadoConGd = @imagepng($srcImg, $destino, 8);
        } elseif ($extFinal === 'webp' && function_exists('imagewebp')) {
            $procesadoConGd = @imagewebp($srcImg, $destino, 85);
        }

        imagedestroy($srcImg);
    }
}

// Fallback si GD no está presente o falló
if (!$procesadoConGd) {
    if (!@move_uploaded_file($tmpPath, $destino)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'No se pudo guardar la imagen en el servidor. Verificá los permisos de assets/.']);
        exit;
    }
}

echo json_encode([
    'success' => true,
    'filename' => $filename,
    'url' => 'assets/' . $filename,
    'message' => 'Imagen verificada y guardada exitosamente en assets/'
]);
