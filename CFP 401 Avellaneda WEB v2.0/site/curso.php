<?php
/**
 * CFP N° 401 AVELLANEDA — DETALLE DE CURSO CON OPENGRAPH DINÁMICO (C3 AUDITORÍA)
 * 
 * Este archivo permite que al compartir enlaces directos de cursos en WhatsApp, Facebook,
 * Twitter o LinkedIn, los rastreadores (crawlers) reciban las etiquetas OpenGraph correctas
 * (título, descripción, imagen propia del curso).
 * 
 * Para navegadores normales con JavaScript, redirige de inmediato a index.html#/curso/{slug}.
 * Para usuarios sin JavaScript o bots de búsqueda, muestra la ficha del curso accesible.
 */

$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';
$slug = preg_replace('/[^a-z0-9\-]/', '', strtolower($slug));

$dataPath = __DIR__ . '/data.js';
$cursoEncontrado = null;
$todosLosCursos = [];

if (file_exists($dataPath)) {
    $contenido = file_get_contents($dataPath);
    if (preg_match('/window\.CFP_DATA\s*=\s*(\{[\s\S]*\});?\s*$/', $contenido, $matches)) {
        $data = json_decode($matches[1], true);
        if (isset($data['courses']) && is_array($data['courses'])) {
            $todosLosCursos = $data['courses'];
            foreach ($todosLosCursos as $c) {
                if (isset($c['slug']) && $c['slug'] === $slug) {
                    $cursoEncontrado = $c;
                    break;
                }
            }
        }
    }
}

$siteUrl = 'https://campuscfp401avellaneda.com.ar/cfp';

if ($cursoEncontrado) {
    $titulo = htmlspecialchars($cursoEncontrado['curso'], ENT_QUOTES, 'UTF-8') . ' — CFP N° 401 Avellaneda';
    $descRaw = !empty($cursoEncontrado['descripcion']) 
        ? $cursoEncontrado['descripcion'] 
        : (!empty($cursoEncontrado['introduccion']) ? $cursoEncontrado['introduccion'] : 'Curso presencial gratuito con certificación oficial en el CFP N° 401 de Avellaneda, Dock Sud.');
    $descRecorte = function_exists('mb_substr') ? mb_substr($descRaw, 0, 160, 'UTF-8') : substr($descRaw, 0, 160);
    $descripcion = htmlspecialchars($descRecorte, ENT_QUOTES, 'UTF-8');
    $imgRel = !empty($cursoEncontrado['imagen']) ? $cursoEncontrado['imagen'] : 'assets/og-cfp401.jpg';
    $imagen = $siteUrl . '/' . ltrim($imgRel, '/');
    $canonicalUrl = $siteUrl . '/curso.php?slug=' . urlencode($slug);
    $appUrl = $siteUrl . '/index.html#/curso/' . urlencode($slug);
} else {
    http_response_code(404);
    $titulo = 'Curso no encontrado — CFP N° 401 Avellaneda';
    $descripcion = 'El curso solicitado no se encuentra disponible actualmente en la oferta académica.';
    $imagen = $siteUrl . '/assets/og-cfp401.jpg';
    $canonicalUrl = $siteUrl . '/';
    $appUrl = $siteUrl . '/index.html#/cursos';
    $descRaw = '';
}
?>
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo $titulo; ?></title>
  <meta name="description" content="<?php echo $descripcion; ?>">
  <link rel="canonical" href="<?php echo $canonicalUrl; ?>">

  <!-- OpenGraph (WhatsApp, Facebook, LinkedIn) -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="<?php echo $titulo; ?>">
  <meta property="og:description" content="<?php echo $descripcion; ?>">
  <meta property="og:image" content="<?php echo $imagen; ?>">
  <meta property="og:url" content="<?php echo $canonicalUrl; ?>">
  <meta property="og:site_name" content="CFP N° 401 de Avellaneda">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?php echo $titulo; ?>">
  <meta name="twitter:description" content="<?php echo $descripcion; ?>">
  <meta name="twitter:image" content="<?php echo $imagen; ?>">

  <link rel="icon" href="assets/favicon.png">
  <script>
    // Redirigir a la SPA en el navegador del usuario
    window.location.replace("<?php echo $appUrl; ?>");
  </script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 24px; background: #f0f4f9; color: #1e293b; line-height: 1.6; }
    .card { max-width: 680px; margin: 40px auto; background: #fff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    h1 { color: #002878; margin-top: 0; font-size: 24px; }
    .meta { display: flex; flex-wrap: wrap; gap: 12px; margin: 16px 0; font-size: 14px; color: #475569; }
    .btn { display: inline-block; background: #002878; color: #fff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; margin-top: 16px; }
  </style>
</head>
<body>
  <noscript>
    <div class="card">
      <?php if ($cursoEncontrado): ?>
        <h1><?php echo htmlspecialchars($cursoEncontrado['curso'], ENT_QUOTES, 'UTF-8'); ?></h1>
        <p><strong>Familia profesional:</strong> <?php echo htmlspecialchars($cursoEncontrado['familia'], ENT_QUOTES, 'UTF-8'); ?></p>
        <div class="meta">
          <?php if (!empty($cursoEncontrado['duracion'])): ?><span>⏱️ <strong>Duración:</strong> <?php echo htmlspecialchars($cursoEncontrado['duracion'], ENT_QUOTES, 'UTF-8'); ?></span><?php endif; ?>
          <?php if (!empty($cursoEncontrado['horarios'])): ?><span>📅 <strong>Horarios:</strong> <?php echo htmlspecialchars($cursoEncontrado['horarios'], ENT_QUOTES, 'UTF-8'); ?></span><?php endif; ?>
          <?php if (!empty($cursoEncontrado['sede'])): ?><span>📍 <strong>Sede:</strong> <?php echo htmlspecialchars($cursoEncontrado['sede'], ENT_QUOTES, 'UTF-8'); ?></span><?php endif; ?>
          <?php if (!empty($cursoEncontrado['requisitos'])): ?><span>📋 <strong>Requisitos:</strong> <?php echo htmlspecialchars($cursoEncontrado['requisitos'], ENT_QUOTES, 'UTF-8'); ?></span><?php endif; ?>
        </div>
        <p><?php echo nl2br(htmlspecialchars($descRaw, ENT_QUOTES, 'UTF-8')); ?></p>
        <p><strong>Certificación oficial:</strong> Todos los cursos otorgan certificado oficial de la DGCyE PBA y son 100% gratuitos.</p>
        <a class="btn" href="index.html#/curso/<?php echo urlencode($slug); ?>">Ver curso completo en el sitio</a>
      <?php else: ?>
        <h1>Curso no encontrado</h1>
        <p>El curso que buscás no existe o ha cambiado de enlace.</p>
        <a class="btn" href="index.html#/cursos">Ver oferta completa de cursos</a>
      <?php endif; ?>
    </div>
  </noscript>
  <p style="text-align:center;margin-top:40px;color:#64748b;">Redirigiendo al curso... <a href="<?php echo $appUrl; ?>">Hacé clic acá si no redirige automáticamente</a>.</p>
</body>
</html>
