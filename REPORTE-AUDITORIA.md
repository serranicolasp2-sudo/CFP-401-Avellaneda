# Reporte de auditoría — Sitio CFP N° 401 Avellaneda v2.0

Revisión del código de `CFP 401 Avellaneda WEB v2.0` (27/09/2026). En producción: `https://campuscfp401avellaneda.com.ar/cfp401/`.
Cada punto indica **qué pasa**, **dónde** y **cómo resolverlo**. Están ordenados por prioridad.

Prioridades: 🔴 crítica (resolver ya) · 🟠 alta · 🟡 media · ⚪ mejora.

---

## A. Seguridad

### A1 🔴 Contraseña del panel en texto plano y publicada
- **Qué:** `api/config.php` define `ADMIN_PASSWORD` sin cifrar. La clave por defecto `cfp401admin` aparece escrita en `site/LEEME-FTP.txt`, que **se sube al servidor** y cualquiera puede leerlo en `/cfp401/LEEME-FTP.txt`.
- **Solución:**
  1. Cambiar la clave ya mismo y **no subir `LEEME-FTP.txt`** (o borrarlo del servidor).
  2. Guardar un hash: `define('ADMIN_HASH', '$2y$…')` generado con `password_hash($clave, PASSWORD_DEFAULT)`.
  3. En `auth.php`, validar con `password_verify($clave, ADMIN_HASH)`.
  4. `cambiar-clave.php` escribe el hash, nunca la clave.

### A2 🔴 La "sesión" es la contraseña misma
- **Qué:** `admin.html` guarda la clave en `sessionStorage['cfp401_admin_token']` (línea ~838) y la manda como `Bearer` en cada request. Si alguien la roba (por una extensión maliciosa o por XSS), tiene la clave real.
- **Solución:** crear `api/login.php`:
  - con `session_start()` + `session_regenerate_id(true)`, cookie `HttpOnly; Secure; SameSite=Strict`, vencimiento de 2 h;
  - `auth.php` pasa a verificar `$_SESSION['admin'] === true`;
  - para cerrar sesión, `api/logout.php` con `session_destroy()`;
  - el panel deja de guardar la clave.

### A3 🔴 Sin protección contra fuerza bruta
- **Qué:** se puede probar contraseñas sin límite contra cualquier endpoint.
- **Solución:** contar los intentos fallidos por IP en un archivo `api/.intentos.json`. A partir de 5 fallos en 15 min, responder 429 y bloquear 15 min. Sumar un `sleep(1)` en cada fallo.

### A4 🟠 CORS abierto a cualquier sitio
- **Qué:** los 4 endpoints responden `Access-Control-Allow-Origin: *`.
- **Solución:** eliminar esa cabecera (el panel es del mismo dominio y no la necesita) o fijarla a `https://campuscfp401avellaneda.com.ar`. Con sesión por cookie (A2), agregar además un **token CSRF**: generarlo en el login, mandarlo en la cabecera `X-CSRF-Token` y validarlo en cada POST.

### A5 🟠 Subida de fotos validada solo por extensión
- **Qué:** `subir-foto.php` acepta cualquier archivo renombrado a `.jpg`, sin límite de tamaño.
- **Solución:**
  - validar el tipo real con `finfo_file()` ∈ {image/jpeg, image/png, image/webp} y además `getimagesize()`;
  - tope de 8 MB;
  - **re-encodear** con GD (`imagecreatefromX` → `imagewebp`/`imagejpeg`), lo que elimina contenido embebido y metadatos EXIF (incluida la ubicación GPS de las fotos de celular);
  - redimensionar a un máximo de 2400 px;
  - agregar `site/assets/.htaccess` con `php_flag engine off` y `Options -Indexes` para que nunca se ejecute código en `assets/`.

### A6 🟠 `config.php` con permisos de escritura
- **Qué:** el LEEME pide CHMOD 664/666 en `config.php` para poder cambiar la clave desde el panel. Un archivo PHP con permiso de escritura es un riesgo si alguna otra falla permite escribir en él.
- **Solución:** mover la clave (hasheada) a `api/.clave.json`, fuera de un archivo ejecutable, protegido con `.htaccess` (`Require all denied`). `config.php` pasa a ser solo lectura (444).

### A7 🟡 Archivos sensibles accesibles por URL
- **Qué:** `data.backup.js`, `LEEME-FTP.txt` y `assets/referencia-*.png` / `tabla-cursos-2026.png` (material interno) son públicos.
- **Solución:** `.htaccess` en la raíz del sitio:
  ```apache
  <FilesMatch "\.(txt|md|json|bak)$|^data\.backup\.js$">
    Require all denied
  </FilesMatch>
  Options -Indexes
  ```
  Además, no subir las imágenes de referencia internas.

### A8 🟡 Forzar HTTPS y cabeceras de seguridad
- **Solución:** en `.htaccess`, redirigir 301 a https y agregar las cabeceras `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN` y `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

### A9 🟡 Scripts del panel desde CDN sin integridad
- **Qué:** `admin.html` carga React, Babel y Lucide desde unpkg **sin `integrity`**. `index.html` sí lo tiene. Si el CDN se compromete, se compromete el panel.
- **Solución:** agregar `integrity` + `crossorigin` (los mismos hashes que usa `index.html` para React y Lucide), o mejor, alojar esos archivos en `site/vendor/`.

---

## B. Integridad de datos

### B1 🟠 Un solo respaldo, que se pisa en cada guardado
- **Qué:** `guardar.php` copia `data.js` → `data.backup.js` antes de cada escritura. Si se guardan dos veces seguidas con un error, el respaldo bueno se pierde.
- **Solución:** respaldos rotativos en `api/backups/data-YYYYMMDD-HHMMSS.js`, conservando los últimos 20 (borrar los más viejos). Sumar al panel una lista "Restaurar versión anterior".

### B2 🟠 Escritura no atómica
- **Qué:** `file_put_contents(DATA_FILE, …)` escribe directo sobre el archivo. Si se corta a la mitad (timeout o disco lleno), `data.js` queda truncado y **el sitio entero deja de funcionar**.
- **Solución:** escribir en `data.js.tmp` con `LOCK_EX`, verificar que el archivo pese más de 1 KB y termine en `};`, y recién ahí hacer `rename()` sobre `data.js` (en el mismo disco, `rename` es atómico).

### B3 🟠 Validación mínima de lo que se guarda
- **Qué:** solo se verifica que exista `courses`. Un error del panel puede guardar un curso sin `slug`, con slugs repetidos o con claves vacías.
- **Solución:** validar en PHP:
  - cada curso tiene `curso`, `slug` (`^[a-z0-9-]+$`, único), `familia`, `horarios`, `sede` y `requisitos` como strings no vacíos;
  - `familia` existe en `familias[]`;
  - tamaño total < 2 MB.
  Si algo falla, responder 400 con el detalle.

### B4 🟡 Dos administradores a la vez se pisan
- **Qué:** se guarda el objeto completo; gana el último que guarda.
- **Solución:** mandar en cada guardado la `version` (el timestamp de la carga). Si el archivo en el servidor es más nuevo, responder 409 "Otro administrador guardó cambios: recargá". Es barato de implementar y evita pérdidas.

### B5 🟡 Los visitantes pueden ver datos viejos (caché)
- **Qué:** `index.html` carga `<script src="data.js">` sin versión. Después de guardar, los navegadores o el CDN del hosting pueden seguir sirviendo la copia vieja por horas.
- **Solución:** en `.htaccess`, `<Files "data.js"> Header set Cache-Control "no-cache" </Files>` (revalida sin perder la caché), o que `guardar.php` escriba también un `data-version.txt` y el index cargue `data.js?v=…`.

---

## C. Funcionamiento y código

### C1 🟠 El panel compila JSX en el navegador
- **Qué:** `admin.html` (2970 líneas) carga Babel standalone (~3 MB) y compila en cada apertura. En celular tarda varios segundos.
- **Solución:** hacer lo mismo que ya se hizo con el sitio: extraer el JSX a `fuente-jsx/admin.jsx`, compilarlo a `site/admin.js` con el preset classic y sacar Babel de `admin.html`. Documentarlo en `LEEME-COMPILAR.txt`.

### C2 🟡 Solo la ficha de curso tiene URL propia
- **Qué:** existe `#/curso/{slug}`, pero Cursos, Nosotros y Contacto son estado interno. No se pueden compartir por link, el botón "atrás" del celular sale del sitio y los buscadores no las distinguen.
- **Solución:** extender el ruteo por hash a `#/cursos`, `#/cursos/{familia}`, `#/nosotros` y `#/contacto`, con `hashchange` → pantalla. Actualizar `document.title` por pantalla ("Soldador Básico — CFP N° 401 Avellaneda").

### C3 🟡 SEO: el contenido no existe sin JavaScript
- **Qué:** todo se renderiza con React. Google indexa JS, pero con retraso, y WhatsApp o Facebook ven solo el `<noscript>` genérico. Todas las fichas de curso comparten la misma vista previa (og).
- **Solución (de menor a mayor esfuerzo):**
  1. Generar `sitemap.xml` desde `guardar.php` cada vez que se guarda, con una URL por curso.
  2. Crear `curso.php?slug=…`, que imprime `<title>`, `description` y `og:*` del curso leyendo `data.js`, y después carga el mismo `app.js`. Compartir por WhatsApp muestra entonces el curso correcto.
  3. Poner en el `<noscript>` la lista de cursos con horarios, impresa desde PHP.

### C4 🟡 Año calendario escrito en el código
- **Qué:** `app.jsx` dice "AGENDA 2026" y "Ciclo Lectivo 2026", y la efeméride "Finalización del Ciclo Lectivo… 2026". El 1/1/2027 el sitio queda desactualizado. Además, la regla de marca es **no nombrar el año** en la oferta.
- **Solución:** calcular el año con `new Date().getFullYear()` en los textos de la agenda y mover las fechas variables (receso, cierre de ciclo) a `data.js`, editables desde el panel por año.

### C5 🟡 Efemérides duplicadas
- **Qué:** la lista completa está en `data.js` **y** como `EFEMERIDES_LISTA_DEFAULT` en `app.jsx` (líneas ~1746–1778). Si se editan en el panel, las del código quedan distintas.
- **Solución:** dejar solo `data.js` como fuente. El valor por defecto en el código, que sea `[]`.

### C6 🟡 Datos de contacto escritos en el código
- **Qué:** `WHATSAPP_URL` (línea 20) y `MB_WSP` tienen el número `541161056018` fijo, aunque `CFP_DATA.contacto.whatsapp` es editable. Si cambia el número, el panel no lo actualiza en esos botones.
- **Solución:** derivar la URL desde `CT.whatsapp` (quitar lo que no sean dígitos y anteponer `549`).

### C7 ⚪ Texto del mensaje de WhatsApp
- **Qué:** el mensaje precargado dice "interesad@". La arroba no se lee bien en voz alta y muchos lectores de pantalla la pronuncian "arroba".
- **Solución:** "Hola, quiero información sobre los cursos de Formación Profesional."

### C8 ⚪ Reglas CSS con sintaxis de JavaScript (no tienen efecto)
- **Qué:**
  - `admin.html` línea 128: `justifyContent: space-between;` dentro de `.save-bar`;
  - `index.html` línea 229: `fontSize:17px` en `.cfp-cinta-btn-close`.
  El navegador las ignora, así que esos estilos nunca se aplicaron.
- **Solución:** reemplazarlas por `justify-content: space-between;` y `font-size:17px;`. Revisar después cómo quedan visualmente, porque va a cambiar el aspecto actual.

### C9 🟡 Parches con `!important` sobre el bundle del sistema de diseño
- **Qué:** `index.html` tiene unas 150 líneas que corrigen el `_ds_bundle.js` desde afuera (header en mobile, lente del hero, animación GPU de fotos, avión). Son frágiles: dependen de selectores como `header>div:last-of-type` y `section[style*="--surface-accent"]` que se rompen si cambia el orden de los elementos.
- **Solución:** llevar esas correcciones **al sistema de diseño** (este proyecto): NavBar responsive, lente con opacidad y tamaño correctos en mobile, animación de fotos por opacity/transform y avión en GPU. Después recompilar `_ds_bundle.js` y borrar los parches. *Lo puedo hacer yo en el proyecto del sistema de diseño y entregar el bundle nuevo.*

### C10 🟡 Formularios del panel con selectores por atributo `style`
- **Qué:** el CSS responsive del panel usa `div[style*="grid-template-columns: 1fr 1fr"]`. Si cambia un espacio en el estilo, deja de aplicarse.
- **Solución:** reemplazarlo por clases (`.form-grid-2`).

### C11 ⚪ `alert()` / `confirm()` nativos en el panel
- **Qué:** las líneas ~1275, 2402 y 2838 usan los diálogos del navegador.
- **Solución:** usar el `Modal` del sistema de diseño, con botón destructivo rojo y un texto claro ("Eliminar curso" / "Cancelar").

---

## D. Rendimiento

### D1 🟡 Imágenes sin optimizar
- **Qué:** las fotos del hero, de las áreas y de la fachada son JPG de tamaño completo. Hay además PNG duplicados con tildes y espacios en el nombre (`área de administración.png`, etc.) junto a los `area-*.jpg`.
- **Solución:**
  - convertir a WebP (calidad 78) y servir 2 tamaños con `srcset` (800 y 1600 px);
  - borrar los PNG duplicados si no se usan (confirmar con una búsqueda en `app.jsx`);
  - `subir-foto.php` genera automáticamente las versiones WebP (ver A5).

### D2 ⚪ Dependencia de unpkg
- **Qué:** si unpkg.com se cae o queda bloqueado en una red escolar, el sitio no carga.
- **Solución:** alojar `react.production.min.js`, `react-dom.production.min.js` y `lucide.min.js` en `site/vendor/` (~150 KB en total).

### D3 ⚪ Fuentes
- **Solución:** reducir el pedido a Google Fonts a los pesos realmente usados (Poppins 700/800 e itálica 800; Source Sans 3 400/600/700) y agregar `<link rel="preload">` para Poppins 800, que es la del H1 del hero.

---

## E. Accesibilidad (a verificar)

- **E1 🟡 Modales** (Campus, agenda de efemérides y el futuro pop-up): confirmar que tengan `role="dialog"`, `aria-modal`, foco atrapado, cierre con Esc y devolución del foco al botón que los abrió.
- **E2 🟡 Marbot:** el botón flotante necesita `aria-label` y el historial de mensajes `aria-live="polite"`. La animación de flotado (`mbFlota`) tiene que respetar `prefers-reduced-motion`.
- **E3 ⚪ Cinta celeste:** el texto `#475569` sobre `#e0f2fe` está en el límite de contraste a 12,5 px. Subirlo a `#334155`.
- **E4 ⚪ `theme-color`:** `index.html` usa `#002D62`, que no es un color de marca. Cambiarlo a `#002878` (`--blue-900`).
- **E5 ⚪ Iframes de mapas:** agregar `title="Mapa de la sede…"` a los dos `<iframe>` de Contacto.

---

## F. Mejoras de producto sugeridas

1. **Generador de promociones** (plan aparte: `PLAN-generador-promociones.md`).
2. **Preinscripción online simple:** un formulario que guarde en `api/preinscripciones.json` (o que mande un mail con `mail()`), con exportación a CSV desde el panel. Hoy la inscripción es 100% presencial.
3. **"Ver cambios antes de guardar"** en el panel: mostrar un diff de qué cursos o textos cambiaron.
4. **Registro de actividad:** `api/log.txt` con fecha, IP y qué sección se guardó.
5. **Página 404 / curso inexistente:** si `#/curso/{slug}` no existe, mostrar "Este curso ya no está disponible" con un link a Cursos, en lugar de volver al inicio sin avisar.

---

## Orden de ataque recomendado

1. **Hoy:** A1 (cambiar la clave y sacar el LEEME del servidor), A7 (.htaccess), B2 (escritura atómica).
2. **Semana 1:** A2 + A3 + A4 (login con sesión, límite de intentos y CORS), A5 + A6, B1, B3.
3. **Semana 2:** C1 (compilar el panel), B5, C4–C6, C8, D1.
4. **Después:** C9 (bundle del sistema de diseño corregido, que hago yo), C2–C3 (ruteo y SEO), generador de promociones, E y F.

> Nota para la IA que implemente: después de cualquier cambio en `fuente-jsx/app.jsx`, recompilar en modo **classic** y verificar que `app.js` **no** contenga `require(` (ver `LEEME-COMPILAR.txt`). Probar los cambios de PHP primero en una copia del sitio (`/cfp401-test/`) antes de subirlos a producción.
