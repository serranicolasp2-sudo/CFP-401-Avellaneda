# Sitio web, panel y generador de promociones

Para cambios en `CFP 401 Avellaneda WEB v2.0/` (sitio público, panel de administración, API PHP, plantillas de promoción) y para ampliar el proyecto. Leé antes `marca.md`.

## Índice
1. Antes de tocar nada
2. Arquitectura
3. Qué se edita dónde
4. Compilar
5. Reglas aprendidas (CSS, celular, exportación)
6. Datos (`data.js`)
7. Agregar una plantilla al generador
8. Ampliar el proyecto
9. Claves y seguridad
10. Probar
11. Subir por FTP
12. Registrar en la bitácora

## 1. Antes de tocar nada

- Leé `REPORTE-MAESTRO-CONJUNTO.md` (carpeta `Campus Virtual`): la "Regla de oro", el mapa, §4 (pendientes) y las últimas filas de la bitácora (§6).
- **Otras IAs trabajan en paralelo** (Antigravity, ChatGPT local, Claude). Antes de editar un archivo, mirá su fecha de modificación y la bitácora: si alguien lo cambió después de tu última lectura, releelo y trabajá sobre esa versión. Si un cambio ajeno parece un error, avisá; no lo reviertas por tu cuenta.
- No hagas limpiezas, reorganizaciones ni borrados que no te pidieron.

## 2. Arquitectura

Sitio estático con React 18 (UMD, sin bundler) y una API PHP 8 mínima. Todo lo que se sube al servidor está en `site/`; el código fuente JSX está en `fuente-jsx/` y se compila con Babel.

| Archivo en `site/` | Qué es | Se genera desde |
|---|---|---|
| `index.html` | Sitio público; carga React, `_ds_bundle.js`, `plantillas-promo.js` y `app.js`. Tiene CSS propio en `<style>` | se edita directo |
| `app.js` | Pantallas del sitio (inicio, cursos, ficha de curso, nosotros, contacto, pop-up, Marbot, agenda) | `fuente-jsx/app.jsx` |
| `admin.html` + `admin.js` | Panel de administración (CSS en el `<head>` de `admin.html`) | `admin.js` ← `fuente-jsx/admin.jsx` |
| `plantillas-promo.js` | Las 3 plantillas de flyers, compartidas por sitio y panel | `fuente-jsx/plantillas-promo.jsx` |
| `data.js` | Toda la información del sitio: `window.CFP_DATA = {…}` | se edita desde el panel |
| `_ds_bundle.js`, `tokens/`, `styles.css` | Componentes y tokens del Sistema de Diseño | vienen de `Sistema de Diseño/`; no editar a mano |
| `api/` | `login`, `logout`, `sesion`, `guardar`, `cambiar-clave`, `subir-foto` + `auth.php`, `config.php` | se edita directo |
| `curso.php` | Ficha compartible de un curso con metadatos OpenGraph | se edita directo |
| `assets/` | Fotos, logos y fotos de promociones | |

Los `<script>` clásicos comparten variables globales: una función declarada arriba en `plantillas-promo.js` está disponible en `app.js` y `admin.js`. El orden de carga importa (`plantillas-promo.js` va antes que `app.js`/`admin.js`).

## 3. Qué se edita dónde

- **Contenido** (cursos, horarios, textos, fotos del inicio, avisos, Campus, Marbot, promociones): en `data.js`, idealmente desde el panel. Así no hace falta recompilar ni subir código.
- **Pantallas del sitio:** `fuente-jsx/app.jsx` → compilar → `site/app.js`. Nunca edites `app.js`, `admin.js` ni `plantillas-promo.js` a mano: la próxima compilación borra el cambio.
- **Panel:** `fuente-jsx/admin.jsx` → `site/admin.js`; su CSS está en `site/admin.html`.
- **Plantillas de promoción:** `fuente-jsx/plantillas-promo.jsx` → `site/plantillas-promo.js`.
- **Componentes del Sistema de Diseño** (`NavBar`, `Hero`, `Modal`…): se ajustan con CSS en `index.html` o envolviéndolos en `app.jsx`, no editando `_ds_bundle.js`.

## 4. Compilar

Desde `fuente-jsx/` (necesita Node.js; Babel ya está en `node_modules`):

```
npx babel app.jsx --out-file ../site/app.js --config-file ./babel.config.json
npx babel admin.jsx --out-file ../site/admin.js --config-file ./babel.config.json
npx babel plantillas-promo.jsx --out-file ../site/plantillas-promo.js --config-file ./babel.config.json
```

`babel.config.json` fija el modo "classic" (`React.createElement`). Después de compilar, el `.js` **no** debe contener `require(`: si lo tiene, salió en modo automático y el sitio no carga. Compilá solo lo que cambiaste.

## 5. Reglas aprendidas (CSS, celular, exportación)

Cada una salió de un error real del proyecto:

- **Campos de formulario de 16 px o más en celular.** Con menos, el iPhone agranda la página al tocar el campo.
- **Áreas de toque de unos 44 px.** Si el botón debe verse chico, agrandá el área con un `::after` posicionado en vez de cambiar el diseño.
- **Nada se sale de lo ancho de la pantalla:** `document.documentElement.scrollWidth` tiene que ser igual al ancho de la ventana en 375 y 360 px.
- **Capas:** el encabezado fijo del sitio usa `z-index: 100`. Todo lo que tenga que taparlo (modales, ventanas) va por encima (los modales usan 200 y el pop-up promocional 99999). El `Modal` del Sistema de Diseño trae 60; se corrige desde el CSS de `index.html`.
- **Altos de pantalla:** `100vh` con respaldo `100dvh` (la barra del navegador del celular cambia el alto visible). Un modal alto se desplaza por dentro y su botón de cerrar queda siempre a la vista.
- **Grillas:** `repeat(2, minmax(0, 1fr))`, nunca `1fr 1fr` literal. El CSS del panel para celulares tiene reglas del tipo `div[style*="grid-template-columns: 1fr 1fr"]` que pasan a una columna cualquier estilo que contenga ese texto, incluidas las plantillas de promoción.
- **`button` e `input` no heredan la tipografía:** poné `font-family: inherit` (o la fuente explícita); si no, salen en Arial.
- **Plantillas de promoción:** medidas en `cqw` sobre un lienzo con `container-type: size` (1080 de ancho en Feed/Stories, 1240 en A4: px de diseño ÷ 10,8 o ÷ 12,4). Titulares con `tamanoTexto()`/`lineasTexto()` para que se ajusten al espacio; interlineado ≥ 1,04 en mayúsculas.
- **Exportar PNG con `html-to-image`:** pasá `fontEmbedCSS` (lo arma `obtenerFontCSSFlyer()` en el panel); sin eso, la primera exportación sale en Arial. Formatos de exportación: Feed 1080×1350 y Historia 1080×1920 a `pixelRatio` 1,25; A4 2480×3508 a 1.

## 6. Datos (`data.js`)

Claves principales de `window.CFP_DATA`: `home`, `inscripciones`, `familias`, `sedePrincipal`, `sedeAnexo`, `contacto`, `heroFotos`, `nosotros`, `campusVirtual`, `marbot`, `courses`, `cintaEfemerides`, `efemerides`, `promociones`, `bibliotecaFotosPromo`.

Cada curso: `curso`, `familia`, `requisitos`, `horarios`, `duracion`, `sede`, `slug`, `horasTotales`, `introduccion`, `detalles`.

- Al agregar un campo nuevo, el código tiene que tolerar que falte (valor por defecto), porque el `data.js` del servidor puede ser más viejo que el código.
- El panel guarda a través de `api/guardar.php`, que escribe de forma atómica y deja respaldos en `api/backups/`. Si editás `data.js` a mano, comprobá que siga siendo válido (`node -e "global.window={};require('./data.js')"`) y avisá que el del servidor puede tener cambios más nuevos hechos desde el panel.

## 7. Agregar una plantilla al generador

**Si el diseño ya existe como template HTML/CSS** en `Sistema de Diseño/Promociones y Redes/templates/` (como captación, últimos cupos, conmemoraciones y grilla de cursos), no lo reescribas a mano con otras medidas: el 27/09 eso produjo piezas distintas a los diseños. Usá el importador:
1. Sumar el template a la lista `PLANTILLAS` de `herramientas/importar-estilos-plantillas.js` y correrlo (`node herramientas/importar-estilos-plantillas.js`). Copia el CSS del diseño a `plantillas-promo.jsx` (entre las marcas `ESTILOS-DISENO`), limitado a `.pz-<id>` y con cada px pasado a `calc(N * var(--u))`, donde `--u` es 1 px del diseño sobre el ancho del lienzo (1080 o 1240).
2. El componente usa `LienzoDiseno` y repite **el mismo HTML** del template (mismas clases y el mismo orden de elementos por formato), con los textos de `textosPromo(promo)`. Si el diseño tiene ajustes en JavaScript (titulares que se achican, fichas), se reproducen con `useAjusteDiseno`, midiendo en px del diseño (no en px reales: el A4 se exporta al doble).
3. Si después se cambia el diseño en el Sistema de Diseño, se vuelve a correr el importador y se compila; el componente solo se toca si cambió el HTML.
4. Verificar exportando el PNG del panel y comparándolo por píxeles con una captura de la página del diseño a tamaño real: en Feed y Stories tienen que coincidir; en A4 solo difiere el suavizado del texto.

**Para una plantilla nueva sin template previo**, en `fuente-jsx/plantillas-promo.jsx`:
1. Un componente que reciba `promo` y `formato` (`feed`, `historia`, `a4`) con una composición por formato; las medidas de cada formato van en un objeto (como `MEDIDAS_PROMO_CURSO` o `MEDIDAS_INSCRIPCIONES`).
2. Agregarlo a `CATALOGO_PLANTILLAS` (objeto indexado por `id`) copiando la forma de las existentes: `id`, `nombre`, `tipo`, `pasoCurso`, `usaFoto`, `badge`, `disponible`, `descripcion`, `formatos`, `componente` y `campos`. `pasoCurso` define el paso 2 del asistente: `'uno'` (elegir un curso), `'varios'` (lista de cursos, como la grilla), `'familias'` (inscripciones) o `null` (sin paso 2: la pestaña queda bloqueada); `usaFoto: false` bloquea el paso 3. Cada campo es `{ clave, etiqueta, grupo, defecto }` (más `multilinea` si admite saltos de línea); `defecto` puede ser un texto o una función de la promoción. El paso 4 del asistente arma el formulario con esos campos; un campo vacío vuelve al texto por defecto. `campos: []` = pieza sin textos editables.
3. Si tiene opciones (mostrar u ocultar un sello, por ejemplo), sumarlas en `OpcionesPromo` de `admin.jsx`.
4. Si se va a mostrar en el pop-up del inicio, revisar `PromoPopUp` en `app.jsx` (texto del botón y mensaje de WhatsApp según el tipo).
5. Compilar y probar con los 22 cursos en los 3 formatos, con textos extremos: nada fuera del lienzo, nada superpuesto, grillas con sus columnas. Exportar un PNG de cada formato y mirarlo.

Aplicá también los controles de **Composición**, **Opciones de fondo**, **Contacto y footer** e **Inspección final** de `piezas-redes.md`: los tres formatos mantienen sus decisiones de fondo y contacto, y cada PNG se inspecciona completo, no solo con pruebas de sintaxis o medidas.

## 8. Ampliar el proyecto

Para una sección o página nueva:
1. Contenido en `data.js` con valores por defecto en el código (sección 6).
2. Pantalla o bloque en `app.jsx`, usando los componentes y tokens del Sistema de Diseño (encabezado de sección con filete amarillo, tarjetas de radio 16 px, botones en píldora). Las rutas son por hash (`#/curso/{slug}`).
3. Edición desde el panel en `admin.jsx`, con el mismo patrón de las demás secciones (etiqueta, campo, ayuda). El personal no técnico tiene que poder cambiar el contenido sin tocar código.
4. Si se comparte en redes, pensar los metadatos OpenGraph (ver `curso.php`).
5. Probar (sección 10), compilar, registrar y listar qué subir.

## 9. Claves y seguridad

- El panel acepta dos claves: la **común** del equipo (se cambia desde el panel) y la **maestra** del responsable (solo con `herramientas/generar-clave-maestra.php`). Se guardan como hash bcrypt en `api/.clave.json` y `api/.clave-maestra.json`.
- **Nunca** escribas una clave en código, documentos, la bitácora ni el chat. No agregues claves fijas "de respaldo", ni muestres una clave en la interfaz. La API se autentica por sesión (cookie); la clave solo viaja a `login.php` y `cambiar-clave.php`.
- No uses permisos 666/777. No subas ni pises `api/.clave.json`, `api/.intentos.json`, `api/backups/` ni `api/sesiones/` del servidor.
- Para probar el panel, creá una copia descartable del proyecto que conserve juntas `site/` y `herramientas/`. Si necesitás generar una clave, ejecutá **la copia** de `herramientas/generar-clave-maestra.php`: escribe en el `site/api/` vecino a su propia carpeta. Nunca ejecutes el helper del proyecto real ni uses o toques sus claves. Borrá la copia al terminar.

## 10. Probar

- `node herramientas/verificar-todo.js` (sintaxis JS, compilación, `php -l` de la API).
- Servidor local sobre la copia: `php -S 127.0.0.1:8780 -t <copia-de-site>` y abrir en el navegador.
- Celular: 375×812, 375×667 y 360×740 (y 412×915). Escritorio: 1280×800 y 1366×657. En cada página: sin desborde horizontal, sin textos cortados, sin errores de consola, capas en orden.
- Si tocaste plantillas: prueba de los 22 cursos × 3 formatos y PNG exportados revisados a ojo.
- Decí qué probaste y qué no. Si no pudiste probar en un teléfono real, aclaralo.
- En el sitio público, las reglas móviles de `index.html` seleccionan `section[style*="--surface-accent"]`. Al agregar una sección, no pongas `--surface-accent` como estilo inline salvo que también quieras que esos ajustes móviles le apliquen; usá una clase para los estilos de la nueva sección.

## 11. Subir por FTP

Se sube el **contenido** de `site/` (lista completa en `site/LEEME-FTP.txt`). Después de un cambio, decile a la persona **exactamente qué archivos** tiene que subir (por ejemplo, "`site/app.js` y `site/index.html`"). Los `.jsx` no se suben nunca.

No subir: `api/.clave.json`, `api/.intentos.json`, `api/backups/`, `api/sesiones/`, `LEEME-FTP.txt`. `data.js` se sube solo si el cambio lo requiere, porque pisa lo que el equipo cargó desde el panel en el servidor.

Después de subir cambios a `app.js` o `admin.js`, hacé una recarga forzada (Ctrl+F5) en el sitio o panel para evitar que el navegador siga usando el JavaScript guardado en caché; esos `<script>` no llevan un parámetro de versión.

## 12. Registrar en la bitácora

Al terminar, agregá una fila al final de §6 de `REPORTE-MAESTRO-CONJUNTO.md`, con la hora real (consultala, no la estimes):

`| **AAAA-MM-DD HH:MM** | Autor (Claude Code, nombre de la persona…) | archivos tocados | qué se hizo, por qué y cómo se verificó |`

Si algo queda pendiente o es una mejora que no se aplicó, sumalo también a §4. Antes de escribir, releé el final del archivo por si otra IA agregó filas mientras trabajabas.
