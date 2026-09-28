# Operación de Fase 0

Ejecutar desde `fuente-jsx/` o desde esta carpeta; los comandos de npm se ejecutan en `fuente-jsx/`.

## Sincronizar el catálogo de producción

`npm run data:pull` usa por defecto `https://campuscfp401avellaneda.com.ar/cfp/data.js`; si producción publica en otra ruta, definir `CFP_DATA_URL` con la URL HTTPS correcta. Descarga y valida sintaxis/esquema, deja copia en `../.local/data.servidor.js` y resumen estructurado en `../.local/data.servidor.diff.json`; no pisa la fuente local. Revisá la diferencia. Para aceptar exactamente la versión revisada, ejecutá el comando que imprime con `--confirm-sha256 <huella>`; vuelve a descargar y se niega a sincronizar si la huella cambió. Conserva la copia local anterior en `.local/`.

No se usa `data.js` del directorio de trabajo como fuente de publicación. El guardado habitual de datos ocurre desde el panel autenticado.

## Compilar, versionar y verificar

- `npm ci`: instala según `package-lock.json`.
- `npm run build`: compila los tres JSX (Babel 8, runtime clásico, sin `require(`), recalcula `?v=` desde SHA-256 para los JS de `admin.html`/`index.html`, archiva la bitácora vieja (`bitacora:archivar`) y corre `verify`.
- `npm run verify`: solo verifica, no modifica archivos. Corre `verificar-todo.js` (sintaxis JS/PHP, datos, reglas, versiones de caché, límites de carga) y `verificar-visual.js`.
- `npm run verify:visual`: matriz de 342 piezas en navegador (147 base, 126 de estrés con textos largos y la grilla de 0 a 22 cursos en los 3 formatos). Falla si un texto se sale del artboard, si dos textos se pisan, si un texto se mete sobre la foto o si una imagen no carga. Carga Poppins y Source Sans 3 antes de medir; si no hay internet avisa que mide con la letra de reemplazo. Las capturas de las fallas quedan en `.local/visual-results/` (se renuevan en cada corrida).
- `npm run verify:e2e`: prueba de punta a punta (unos 40 s) sobre una copia del sitio en `.local/e2e-copia` con una clave de prueba aleatoria que no se imprime; la copia se borra al terminar. Levanta PHP local y prueba: reglas de “Últimos cupos” y vigencia en `guardar.php`, el guardado de PNG (sesión, validación, límites, nombres saneados), y en el panel que editar/guardar una promoción conserva su id y lo editado a mano, y que una promoción desactualizada trae los datos nuevos del curso. No está dentro de `build` porque necesita PHP.
- Navegador: se usa el Chromium fijado de Playwright en `.local/browsers` si existe (`PLAYWRIGHT_BROWSERS_PATH`); si no, Edge o Chrome de la PC (`CFP_BROWSER_CHANNEL=msedge|chrome` para forzar uno).
- PHP: el lint y la prueba e2e lo buscan en `PATH`, en `PHP_BINARY` o en la instalación de WinGet.

## Publicación segura

Configurar `CFP_DEPLOY_HOST`, `CFP_DEPLOY_USER`, `CFP_DEPLOY_ROOT` y opcionalmente `CFP_DEPLOY_PORT`, `CFP_DEPLOY_EXPECT_OWNER`, `CFP_DEPLOY_EXPECT_GROUP`. Usar una llave SSH instalada por fuera del proyecto. Nunca poner credenciales o llaves privadas en variables guardadas dentro de archivos del repo.

- `npm run deploy:dry-run`: toma todos los archivos publicables de `site/` (versionados o nuevos no ignorados, no solo los modificados desde el último commit), calcula su SHA-256 en el servidor con **una sola conexión SSH** y lista solo los que difieren o faltan.
- `npm run publish`: compila y verifica, repite la comparación y sube únicamente las diferencias; en el servidor verifica el hash, deja permisos 0644 y revisa propietario/grupo si se configuraron. Antes de reemplazar un archivo guarda `archivo.rollback-AAAAMMDDhhmmss` (0600) junto al original para revertir a mano.

El publicador excluye por política `data.js`, `data.backup.js`, claves, `.env`, intentos, sesiones, respaldos, piezas guardadas, temporales, dependencias y herramientas. Los archivos fuera de la lista permitida se informan como “NO SE PUBLICA” y no se suben: hoy son `LEEME-FTP.txt`, `assets/.htaccess` y las imágenes con tildes o espacios en el nombre (`assets/área de ….png`); si alguna de esas imágenes cambia, subirla a mano o renombrarla sin tildes. No reutilizar `npm run publish` para sincronizar el catálogo.

## PNG y promociones

El botón **Guardar PNG en servidor** requiere sesión del panel y guarda piezas validadas en `site/assets/promociones/guardadas/` (PNG de hasta 2480 × 3508 px y 25 MB; archivos 0644). La carpeta es solo de salida del servidor; no se versiona ni se publica desde una copia local. Si no existe, PHP la crea: el usuario de PHP-FPM tiene que poder escribir en `assets/promociones/`.

Un feed exportado pesa 1,5–2 MB y un A4 varios MB, más que los límites por defecto (PHP 2 MB, Nginx 1 MB). Para que el guardado funcione en producción:

- `site/api/.user.ini` sube `upload_max_filesize` a 25M y `post_max_size` a 30M (PHP-FPM lo aplica en hasta 5 minutos).
- En Nginx, el bloque del sitio necesita `client_max_body_size 30m;` y recargar con `nginx -t && systemctl reload nginx`.

Si falta alguno, el panel avisa que la pieza pesa más de lo que acepta el servidor (en vez del error genérico) y la pieza se puede seguir descargando.

Una promoción enlazada a un curso guarda la huella de los datos del curso que se imprimen en la pieza (nombre, familia, duración, horarios, requisitos, sede). Si el curso cambia, el panel muestra “Datos desactualizados”, no deja activar su pop-up y el sitio público no la muestra hasta que se edite y guarde; al editarla trae los datos nuevos y conserva lo que se había escrito a mano. Reconfirmar el estado de cupos no la desactualiza. Los pop-ups respetan inicio/vencimiento inclusivos en `America/Argentina/Buenos_Aires`. “Últimos cupos” requiere estado confirmado en los últimos 30 días y nunca se activa para cursos completos (lo valida también `guardar.php`).

## Bitácora

`npm run bitacora:archivar` (incluido en `build`) mueve a `BITACORA-DE-INICIO.md` las filas de la bitácora del reporte maestro con más de cuatro días y respeta el fin de línea CRLF del reporte. Cuando archiva, recuerda dejar en el reporte activo el resumen de decisiones vigentes, riesgos abiertos y enlaces a los hitos archivados (§9.7).

## Referencias visuales

La matriz geométrica de 342 piezas ya corre en cada `verify`. La comparación por píxeles queda lista y se activa al guardar PNG aprobados por modelo/formato en `herramientas/referencias-visuales/` (se pueden generar con `CFP_CAPTURE_VISUALS=1 npm run verify:visual`, que deja las capturas en `.local/visual-results/`). Una referencia nueva se revisa a ojo antes de copiarla; `build` nunca las sobrescribe.
