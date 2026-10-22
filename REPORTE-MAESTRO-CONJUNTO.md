# REPORTE MAESTRO CONJUNTO — CFP N° 401 AVELLANEDA
> **DOCUMENTO DE COORDINACIÓN TÉCNICA E INTER-IA**  
> **Destinatarios:** Antigravity, Claude Code, ChatGPT Local, Desarrolladores y Administradores.  
> **Ubicación:** `C:\Users\Nicolás\Desktop\Campus Virtual\REPORTE-MAESTRO-CONJUNTO.md`  
> **Última actualización:** 15 de Octubre de 2026  
> **Estado del Proyecto:** Versión 2.0 Operativa + Módulo de Promociones + Fase 1 de Seguridad e Integridad + Migración a servidor Ferozo (cfp401avellaneda.com.ar) completada con éxito.

---

## 📌 REGLA DE ORO OBLIGATORIA PARA TODA INTELIGENCIA ARTIFICIAL
1. **LEER ESTE DOCUMENTO PRIMERO:** Antes de iniciar cualquier tarea, analizar qué se hizo previamente y qué archivos componen el proyecto.
2. **REGISTRAR TODA MODIFICACIÓN:** Cada vez que una IA (Antigravity, Claude Code, ChatGPT, etc.) realice cambios, agregue archivos o modifique la arquitectura, **DEBE** agregar una entrada en la [Sección 6: Bitácora Cronológica de Modificaciones](#6-bitácora-cronológica-de-modificaciones) al final de este archivo con fecha, IA actuante, archivos tocados y resumen de la acción.
3. **NO EDITAR `site/app.js` DIRECTAMENTE:** El código React de la web pública vive en `fuente-jsx/app.jsx`. Cualquier cambio se realiza en `app.jsx` y se recompila con Babel hacia `site/app.js`. Lo mismo con `site/plantillas-promo.js`: se edita `fuente-jsx/plantillas-promo.jsx` y se compila (§2.A).
4. **RESPETAR LA ARQUITECTURA DE SEGURIDAD:** No almacenar contraseñas en texto plano ni asignar permisos globales de escritura (`666`/`777`) a archivos o carpetas. La autenticación usa hashes Bcrypt (`api/.clave.json`), sesiones seguras (`login.php`/`logout.php`) y escritura atómica (`api/guardar.php`). **Nunca** agregar excepciones que acepten una clave fija "por retrocompatibilidad" ni mostrar la clave inicial en la interfaz: el 27/09 se eliminó un fallback que aceptaba la clave inicial aunque se hubiera cambiado, y anulaba todo el hasheo. El panel usa **dos claves** (común del equipo + maestra del responsable, ver §2.B) y **ninguna se escribe nunca** en este documento, en el LEEME, en el código ni en la bitácora. La contraseña solo se envía a `login.php` y a `cambiar-clave.php`; el resto de la API se autentica por la cookie de sesión.

---

## 1. MAPA E INVENTARIO DEL DIRECTORIO "CAMPUS VIRTUAL"

Ruta base: `C:\Users\Nicolás\Desktop\Campus Virtual`

```text
Campus Virtual/
├── 🌐 CFP 401 Avellaneda WEB v2.0/     <-- SITIO WEB Y APLICACIÓN DE PRODUCCIÓN (FTP DEPLOY)
│   ├── site/                        <-- Contenido público que se sube al servidor vía FTP
│   │   ├── index.html               <-- Web pública (carga React, design system y app.js)
│   │   ├── admin.html               <-- Panel de Administrador visual completo (carga admin.js compilado)
│   │   ├── admin.js                 <-- Bundle compilado del panel (fuente en fuente-jsx/admin.jsx)
│   │   ├── data.js                  <-- Base de datos JSON limpia (cursos, promos, efemérides)
│   │   ├── app.js                   <-- Bundle compilado del frontend público (generado por Babel)
│   │   ├── curso.php                <-- Ficha compartible con metadatos OpenGraph dinámicos
│   │   ├── robots.txt               <-- Reglas de rastreo para buscadores
│   │   ├── plantillas-promo.js      <-- Plantillas de los flyers compiladas (usadas en sitio y panel)
│   │   ├── _ds_bundle.js            <-- Componentes del Design System institucional
│   │   ├── styles.css               <-- Estilos base e importación de tokens
│   │   ├── tokens/                  <-- Tokens de diseño (colors, typography, fonts, etc.)
│   │   ├── assets/                  <-- Fotos, logos, flyers generados y fotos de talleres
│   │   │   ├── promociones/         <-- Assets del generador de flyers (arco, logos, fotos curadas)
│   │   │   └── .htaccess            <-- Desactiva motor PHP en assets (previene exploits)
│   │   ├── api/                     <-- Endpoints PHP del backend
│   │   │   ├── config.php           <-- Rutas y constantes del sistema (solo lectura)
│   │   │   ├── auth.php             <-- Verificación Bcrypt, CORS seguro y anti fuerza bruta
│   │   │   ├── login.php            <-- Endpoint de login con sesión PHP y cookie HttpOnly
│   │   │   ├── logout.php           <-- Cierre de sesión y destrucción de cookie
│   │   │   ├── sesion.php           <-- Estado de la sesión (el panel no pide la clave al recargar)
│   │   │   ├── guardar.php          <-- Guardado atómico (.tmp + rename) y respaldos rotativos
│   │   │   ├── cambiar-clave.php    <-- Hasheo y guardado en .clave.json (sin tocar config.php)
│   │   │   ├── subir-foto.php       <-- Subida segura con validación MIME real y limpieza GD
│   │   │   ├── .clave.json          <-- (NO SUBIR) Hash de la clave común del equipo
│   │   │   ├── .clave-maestra.json  <-- Hash de la clave maestra del responsable (se sube una vez)
│   │   │   ├── .intentos.json       <-- (NO SUBIR) Registro de IPs y rate limiting contra ataques
│   │   │   ├── backups/             <-- (NO SUBIR) Copias rotativas de data.js (últimas 20 versiones)
│   │   │   ├── sesiones/            <-- (NO SUBIR) Sesiones abiertas del panel
│   │   │   └── .htaccess            <-- Bloquea acceso web directo a .json, .clave y backups
│   │   ├── .htaccess                <-- Protección raíz: fuerza HTTPS, cabeceras y cache data.js
│   │   └── LEEME-FTP.txt            <-- Instrucciones de despliegue local (no subir a server)
│   ├── fuente-jsx/                  <-- CÓDIGO FUENTE REACT (DESARROLLO)
│   │   ├── app.jsx                  <-- Código fuente editable del sitio público
│   │   ├── admin.jsx                <-- Código fuente JSX del panel (compila a site/admin.js)
│   │   ├── plantillas-promo.jsx     <-- Fuente de las 3 plantillas de promoción
│   │   ├── LEEME-COMPILAR.txt       <-- Instrucciones para compilar los bundles
│   │   ├── babel.config.json        <-- Configuración del compilador Babel clásico
│   │   └── node_modules/            <-- Binarios locales de Babel
│   ├── herramientas/                <-- Scripts locales de desarrollo y verificación
│   │   ├── generar-clave-maestra.php<-- Genera site/api/.clave-maestra.json pidiendo la clave por teclado
│   │   └── verificar-todo.js        <-- Suite de validación integral (Babel, sintaxis JS y PHP 8.2)
│   ├── Claude outputs/              <-- Entregables y reportes previos de Claude Code
│   └── _originales-assets/          <-- Archivos de diseño y fotos originales sin comprimir
│
├── 🎨 Sistema de Diseño/            <-- SUITE INTEGRAL Y AUTÓNOMA DE IDENTIDAD, DISEÑO Y MARKETING
│   ├── README.md                    <-- Guía maestra del Design System institucional
│   ├── styles.css                   <-- Entrada CSS de importación de tokens
│   ├── tokens/                      <-- 8 archivos CSS de tokens (fonts, colors, typography, spacing, radius, elevation, motion, base)
│   ├── guidelines/                  <-- 21 tarjetas HTML interactivas con reglas de marca y diseño
│   ├── components/                  <-- Librería modular de componentes React (77 archivos)
│   ├── ui_kits/                     <-- Prototipos React (sitio institucional, Campus Virtual y piezas sociales)
│   ├── Promociones y Redes/         <-- Centro de marketing, visor interactivo (index.html), manual y plantillas (.dc.html)
│   ├── skill/                       <-- LA skill del CFP 401 (cfp401-estudio, única vigente): fuente, paquete .skill, evaluación y LEEME.md
│   ├── assets/                      <-- Recursos gráficos estructurados en 3 subcarpetas limpias (0 archivos sueltos)
│   │   ├── Logos/                   <-- 20 logos, isotipos, variantes y sellos institucionales de alta resolución
│   │   ├── fotos/                   <-- 11 fotografías y recursos institucionales (héroes, fachada, historia, mapa de sede)
│   │   └── promociones/             <-- Fototeca curada de los 22 cursos (66 fotos en alta definición, logos y arco)
│   ├── _ds_bundle.js                <-- Bundle compilado del Design System (218 KB)
│   ├── _ds_manifest.json            <-- Manifiesto completo de componentes y tokens
│   ├── _adherence.oxlintrc.json     <-- Configuración de linter de adherencia al Design System
│   ├── thumbnail.html               <-- Vista previa interactiva del Design System
│   └── .thumbnail                   <-- Previsualizador binario del Design System
│
├── REPORTE-AUDITORIA.md             <-- Auditoría técnica exhaustiva inicial realizada el 27/09/2026
└── REPORTE-MAESTRO-CONJUNTO.md      <-- ESTE DOCUMENTO (Bitácora central inter-IA y estado del proyecto)
```

### Inventario físico categorizado (corte: 27/09/2026, 13:30)

La estructura quedó clasificada en **2 carpetas maestras** y 2 archivos en la raíz (a las 19:14 la skill, su paquete y su evaluación se integraron a `Sistema de Diseño/skill/`, y a las 19:18 se quitaron las skills obsoletas `MAESTRO.md` y `Sistema de Diseño/SKILL.md`; las cifras de archivos y tamaños son del corte de las 13:30), totalizando **2.103 archivos** (aprox. **122,39 MiB**):

| Carpeta / Categoría | Archivos | Tamaño aprox. | Propósito y Contenido |
|---|---:|---:|---|
| **`CFP 401 Avellaneda WEB v2.0/`** | 1.828 | 71,72 MiB | **Sitio Web de producción y desarrollo.** Contiene el frontend React compilado, el panel administrativo, los endpoints PHP seguros, scripts de validación, herramientas locales y dependencias de Babel. Se sube al servidor exclusivamente el contenido de `site/` vía FTP. |
| **`Sistema de Diseño/`** | 256 | 49,29 MiB | **Suite integral de Diseño Institucional y Marketing.** Agrupa todos los activos de marca: tokens oficiales (8), `styles.css` compilado autónomo, guidelines interactivas (21), componentes React (77), prototipos `ui_kits` 100% visualizables con doble clic offline (`campus_virtual`, `sitio_institucional` interactivo de 5 pantallas y `piezas_sociales`), Centro de Promociones y Redes con visor interactivo (`index.html`), manual y plantillas (.dc.html), recursos gráficos organizados en `assets/` en 3 subcarpetas temáticas (`Logos/` con 20 logotipos e isotipos, `fotos/` con 11 fotografías institucionales y `promociones/` con 74 fotos de cursos), bundle compilado con rutas corregidas y estilos. La skill vigente está en `skill/`. |
| ↳ **`Sistema de Diseño/skill/`** | 17 | 1,3 MiB | **Skill experta unificada del CFP 401 (`cfp401-estudio`).** Fuente autocontenida (`SKILL.md`, guías `marca.md`, `piezas-redes.md`, `web.md`, `audiovisual.md`, `assets/tokens.css` y 8 logos), paquete `cfp401-estudio.skill` para claude.ai, evaluación con y sin skill y `LEEME.md` con instalación y actualización. Funciona en Claude Code con acceso al proyecto y sola en claude.ai. |
| **Archivos en la raíz** | 2 | 0,1 MiB | Documentos de coordinación: `REPORTE-MAESTRO-CONJUNTO.md` (bitácora viva) y `REPORTE-AUDITORIA.md` (auditoría de origen). |

**Historial de carpetas y archivos depurados (27/09/2026):**
1. **`CFP 401 Avellaneda Design System/` (depurado tras consolidación):** Todos sus elementos útiles (`tokens/`, `guidelines/`, `assets/`, `scraps/`, `.thumbnail`, `thumbnail.html`) fueron transferidos e integrados directamente a la raíz de `Campus Virtual`, conformando una suite de diseño 100% autónoma y eliminando duplicación de 204 archivos y 101,4 MiB.
2. **`CFP 401 Avellaneda WEB/` (eliminado):** 71 archivos (38,5 MiB) correspondientes al sitio v1.0 histórico que contenía esquemas antiguos y código obsoleto.
3. **`design_handoff_cfp401/` (eliminado):** 26 archivos (0,8 MiB) con rutas relativas rotas y planes desfasados.
4. **`fuente-jsx/nul` (eliminado):** Entrada anómala de 117.668 bytes que colisionaba con nombres de dispositivos reservados en Windows, retirada limpiamente mediante Node.js con namespace Win32.
5. **Planes en discordancia en `entrega-promociones/`:** Eliminados `PLAN-generador-promociones.md`, `ESTADO-PROYECTO.md` y la copia de `REPORTE-AUDITORIA.md`, ya que contradecían la estructura real de `site/data.js`.
6. **Archivos de credenciales y basura en raíz:** Eliminados `INFO.txt` y `Contraseña de aplicación Moodle.txt` (eliminando cualquier exposición de claves en texto plano); y eliminados archivos sueltos obsoletos (`mail dominio.jpg`, `Bot.png`, `Bot 2.png`).
7. **Normalización de nombre:** Renombrado `readme.md` a `README.md` en la raíz para compatibilidad multiplataforma estricta con `SKILL.md`.
8. **Consolidación de `Promociones y Redes` en `Sistema de Diseño` y eliminación de duplicados:** Se trasladó `Promociones y Redes/` al interior de `Sistema de Diseño/`, unificando todo el ecosistema de marketing y diseño institucional en un único lugar. Se eliminaron tokens duplicados (8 archivos), bundle duplicado (218 KB) y las 3 carpetas `img/` locales en templates (20 archivos de fotos pesadas, 37,42 MiB) reemplazándolos por referencias directas a `Sistema de Diseño/assets/`. Se eliminó la copia redundante de `Imágenes Cursos/Promociones/` (74 archivos, 11,19 MiB) centralizando la fototeca en `assets/promociones/`. Se redujo el tamaño en 48,8 MiB y 103 archivos redundantes.
9. **Eliminación de `Imágenes Cursos/`, integración de `Logos/` y estructuración temática de `assets/` (12:05):** Eliminada la carpeta histórica `Imágenes Cursos/`. Reubicada `Logos/` dentro de `assets/Logos/` (conservando únicamente los 20 logotipos, isotipos y sellos). Creada `assets/fotos/` (12 fotos institucionales, héroes, fachada, mapa y referencias). Eliminados los 27 archivos sueltos duplicados en la raíz de `assets/`. Actualizadas todas las rutas en guidelines, UI kits, templates y bundle (0 referencias rotas).
10. **Eliminación de referencia de redes obsoleta (12:10):** Eliminado `referencia-estilo-redes.png` (1,71 MiB) de `assets/fotos/`, por tratarse de un vestigio del estilo gráfico antiguo previo a la renovación integral del Sistema de Diseño. Actualizada la card interactiva `guidelines/brand-imagery.card.html` para exhibir la fotografía profesional de taller real (`hero-soldadura.jpg`) en concordancia con el estándar visual actual.
11. **Eliminación de `uploads/` y conversión de UI Kits a visualización autónoma (12:15):** Se eliminó la carpeta histórica `uploads/` (53 archivos, 72,87 MiB). Se actualizaron los prototipos HTML en `ui_kits/` incrustando componentes JSX en bloques Babel para visualización directa con doble clic (`file://`). Se eliminó el manifest obsoleto `index-standalone.html` (2,68 MiB).
12. **Reparación y Acabado Profesional de `ui_kits/sitio_institucional/index.html` (12:30):** Identificada la causa de la pantalla blanca: una etiqueta `</script>` dentro de un comentario cerraba prematuramente el bloque de scripts, volcando código JS como texto sin estilo al DOM y bloqueando Babel. Se corrigió y enriqueció el kit unificándolo en un script React robusto con 5 pantallas navegables interactivas (Inicio, Cursos, Nosotros, Formulario de Preinscripción en 3 pasos y Contacto). Se actualizaron las referencias de assets en `_ds_bundle.js`, `Hero.jsx` y `Logo.jsx` hacia `assets/Logos/` y `assets/fotos/`. Se compiló `Sistema de Diseño/styles.css` como hoja de estilo autosuficiente (5,9 KB) con Google Fonts y tokens incrustados sin depender de `@import` locales en `file://`.

---

## 2. METODOLOGÍA DE COMPILACIÓN Y DESPLIEGUE (DEPLOY FTP)

El entorno de producción de la web institucional (migrado el 15/10/2026) se encuentra alojado en el nuevo servidor Ferozo (DonWeb) en:  
🌐 **`https://cfp401avellaneda.com.ar/`**  
*(Servidor: `c2430536.ferozo.com` / IP `200.58.111.11`, carpeta pública: `/public_html/`, acceso FTPS con TLS explícito en puerto 21).*  
*(Nota de alcance: El Campus Virtual / Moodle permanece independiente en `https://campuscfp401avellaneda.com.ar/`).*

### A. Si se modifica el código React (`fuente-jsx/app.jsx`)
1. Abrir terminal en `CFP 401 Avellaneda WEB v2.0/fuente-jsx/`.
2. Ejecutar la compilación mediante Babel:
   ```cmd
   cmd /c "npx babel app.jsx --out-file ../site/app.js --config-file ./babel.config.json"
   ```
3. Verificar que el comando termine con código 0 y genere `site/app.js` (tamaño aprox. 147 KB). Si se tocaron las plantillas de promoción, compilar también: `cmd /c "npx babel plantillas-promo.jsx --out-file ../site/plantillas-promo.js --config-file ./babel.config.json"`.
4. Si se modificó el panel, compilar `admin.jsx` a `site/admin.js`: `cmd /c "npx babel admin.jsx --out-file ../site/admin.js --config-file ./babel.config.json"`.
5. No hay `package.json`: si se borra `node_modules/`, reinstalar antes de compilar con `npm i -D @babel/core @babel/cli @babel/preset-react`. Las instrucciones completas también están en `fuente-jsx/LEEME-COMPILAR.txt`.

### B. Proceso de subida vía FTP por parte del Usuario
* El usuario sube el **CONTENIDO** de la carpeta `CFP 401 Avellaneda WEB v2.0/site/` directamente a su directorio web (`/public_html/` o `/cfp/`), **excepto `LEEME-FTP.txt`** (uso local; si se sube por error, el `.htaccess` raíz lo bloquea) **y los archivos que genera el servidor: `api/.clave.json`, `api/.intentos.json`, `api/backups/` y `api/sesiones/`**. Subirlos pisa la clave común y los respaldos del servidor. Tampoco hace falta subir lo que el sitio no usa (unos 11 MB): `assets/referencia-copy-info.png, assets/referencia-estilo-redes.png, assets/tabla-cursos-2026.png`, `assets/área de *.png`, `assets/qr-cfp401.jpg, assets/logo-cfp401-horizontal.jpg, assets/logo-campus-horizontal-chico.png`, `assets/promociones/qr.jpg`.
* **Archivos Ocultos:** Es crucial que el cliente FTP (FileZilla, WinSCP o Administrador de Archivos de cPanel) tenga activa la opción de **"Mostrar archivos ocultos"** para que se suban los tres archivos `.htaccess` (`site/.htaccess`, `site/assets/.htaccess` y `site/api/.htaccess`).
* **Permisos en el Hosting:** una vez copiado el contenido de `site/`, las rutas del servidor son relativas a la raíz web: `data.js`, `assets/`, `api/` y `api/config.php` (el prefijo `site/` solo se usa en la ruta local). Asignar como propietario o grupo al usuario con que corre PHP y dar escritura solo donde haga falta: `data.js` debe ser escribible por PHP; `assets/` necesita escritura para la subida de fotos; `api/` para crear claves, intentos y respaldos. Usar `644`/`755` cuando el propietario del proceso tenga acceso, o `664`/`775` si hace falta compartir escritura con un grupo configurado. **No usar `666` ni `777`**; evitar permisos globales de escritura. `api/config.php` puede quedar `644` o `444` si el hosting lo permite.
* **Claves del panel (esquema de dos claves):** el panel acepta una **clave común** (la usa el equipo; se cambia desde «Sistema y Seguridad» y vive en `api/.clave.json`) y una **clave maestra** del responsable del sitio (vive en `api/.clave-maestra.json`, no se puede cambiar desde el panel y sirve para restablecer la común si alguien la cambia o la olvida). No hay clave por defecto en el código: si no existe ninguno de los dos archivos, el panel no deja entrar. **Primer despliegue:** subir `api/.clave-maestra.json` una vez, entrar con la maestra y definir la clave común. **Cambiar la maestra:** `php herramientas/generar-clave-maestra.php` (la pide por teclado) y subir el archivo resultante. **Ninguna de las dos claves se escribe en este documento, en el LEEME ni en el código.**

---

## 3. HISTORIAL DE TRABAJO Y EVOLUCIÓN (DESDE MOMENTO 0 HASTA HOY)

### Hito 1: Marbot y Reactividad de Datos en Tiempo Real
* **Situación:** Consulta sobre si los cambios realizados en cursos o sedes desde el panel se reflejaban de inmediato en el ChatBot Marbot.
* **Solución:** Se verificó y documentó que Marbot opera directamente sobre el objeto reactivo en memoria `window.CFP_DATA`. Al modificarse los cursos o sedes, Marbot dispone al instante de los datos actualizados.

### Hito 2: Cinta Celeste de Efemérides y Agenda Oficial PBA 2026
* **Implementación:**
  * Cinta superior informativa celeste que consulta la fecha real del sistema.
  * Muestra efemérides educativas, oficios y fechas patrias según el Calendario Oficial de Formación Profesional 2026 de la Provincia de Buenos Aires.
  * Modal interactivo (`AgendaEfemeridesModal`) accesible desde la cinta y el footer, con filtros por "Todas", "Feriados y Sin Clases", "Fechas Patrias" y "Oficios".
  * Soporte para simulación de fecha por URL: `?fecha=YYYY-MM-DD`.
  * Persistencia de cierre en la sesión (`sessionStorage['cfp401_cinta_efemeride_cerrada']`).

### Hito 3: Ajustes Responsivos Críticos para Dispositivos Móviles
* **Cinta celeste en celular:** Rediseño a formato ultra compacto (máximo 2 líneas de texto, badges cortos, sin desbordes).
* **Tipografías de navegación:** Corrección de tamaños dispares en los enlaces "Inicio", "Cursos", "Nosotros", "Contacto" en mobile (`.cfp-nav-link`).
* **Bug del Hero al hacer scroll:** Se solucionó el parpadeo/desaparición del titular del hero al hacer scroll vertical en celulares.
* **Barra de datos clave del curso:** Alineación y centrado universal (en PC y móvil) de la barra de requisitos, duración, horarios y certificación (`.cfp-course-databar`).

### Hito 4: Panel de Administrador v2.0 (Mobile y Cursos Nuevos)
* **Autogeneración de Slugs:** Al hacer clic en "+ Nuevo curso", el panel ya no exige una URL manual ni crear archivos HTML externos; el slug se genera automáticamente y la ficha se renderiza de forma dinámica con el ruteo interno.
* **Selector desplegable de Sede:** Se reemplazó el campo de texto libre por un `<select>` que toma los valores de `data.js` (`sedePrincipal`, `sedeAnexo`):
  1. `Sede Juan Pablo Angulo 1272, Dock Sud` (Sede Central)
  2. `Anexo Polideportivo Plaza Renunciamiento — Irala y Argentino Valle` (Sede Anexo)
  3. Ambas sedes (cursos que se dictan en las dos)

  *(Corregido el 27/09: una versión anterior de este documento listaba "Sede Manuel Estévez 1120, Avellaneda", que no es una sede. Manuel Estévez solo aparece en la historia institucional, como ubicación previa a 1986.)*
* **Menú Responsivo en Celulares:** El panel lateral fijo (que en móviles tapaba los campos de edición) fue reemplazado por un selector de sección superior limpio (`.admin-mobile-nav`) y tarjetas apiladas fluidas.

### Hito 5: Módulo de Promociones y Generador de Flyers (`entrega-promociones`)
* **Múltiples Promociones Activas Simultáneas:** El administrador puede marcar múltiples promociones con `popupActivo = true`. El sistema rota de forma **aleatoria** entre ellas en cada visita al Home.
* **Evitación de Repetición:** Mediante `sessionStorage['cfp401_last_promo_id']`, se evita mostrar el mismo curso dos veces consecutivas en la misma sesión de navegación.
* **Capping de 24 Horas:** El pop-up en el Home se despliega a los 800 ms de ingresar y, una vez visualizado o cerrado, no vuelve a mostrarse por 24 horas (`localStorage`). Permite forzar vista de prueba con `?promo=1` o `?promo={slug}`.
* **Arquitectura Multi-Modelo:** Se crearon `CATALOGO_PLANTILLAS` y el router `RenderPromoFlyer`, arrancando con `flyer-curso-v1` y preparado para sumar nuevos modelos (como anuncios generales o apertura de inscripciones).
* **Exportador PNG en el Navegador:** Integración de `html-to-image` en `admin.html` para exportar directamente desde el cliente sin requerir Node en el hosting en 3 formatos. Las proporciones son las del diseño; el tamaño indicado es el PNG producido actualmente:
  * Feed (4:5): 1350 × 1687 px
  * Historia (9:16): 1350 × 2400 px
  * A4 para imprenta: 2480 × 3508 px a 300 dpi.
* **Asistente en 4 Pasos:** Modelo ➔ Curso ➔ Foto y encuadre ➔ Textos editables y previsualización en vivo.

### Hito 6: Auditoría Técnica y Fase 1 de Seguridad e Integridad (`REPORTE-AUDITORIA.md`)
* **Archivos `.htaccess`:** Creados en raíz, `assets/` y `api/`.
  * Redirección HTTPS 301 forzada.
  * Cabeceras de seguridad estrictas (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
  * Bloqueo total de lectura a `.txt`, `.md`, `.json`, `.bak`, `data.backup.js`.
  * Desactivación del motor PHP en `assets/` para prevenir ejecución de scripts maliciosos.
  * Cabecera `Cache-Control: no-cache` sobre `data.js`.
* **Seguridad de Contraseñas y Sesiones (Bcrypt):**
  * Clave eliminada en texto plano de `config.php`. Se guarda como hash con `password_hash()` en `api/.clave.json` (Bcrypt es hash de contraseña, no cifrado reversible).
  * `config.php` es ahora de solo lectura (444/644).
  * Nuevos endpoints `api/login.php` y `api/logout.php` con sesiones PHP reales (`HttpOnly; Secure; SameSite=Strict`).
  * ⚠️ **Corrección (Claude Code, 27/09):** `auth.php` y `login.php` conservaban un fallback que aceptaba la clave inicial aunque se hubiera cambiado, y la pantalla de login de `admin.html` la mostraba en pantalla. Ambos eliminados: la clave inicial ahora solo sirve hasta que se la cambia.
  * ✅ **A2 cerrado (Claude Code, 27/09):** el panel se autentica solo con la cookie de sesión (`HttpOnly`). La contraseña viaja únicamente a `login.php` y, para confirmar un cambio, a `cambiar-clave.php`, que ahora pide la clave actual (o la maestra). `verificarAcceso()` ya no acepta la clave por petición. Nuevo `api/sesion.php` para no pedir la clave al recargar. Las sesiones se guardan en `api/sesiones/` (bloqueada por `.htaccess`) para que el hosting no las borre antes de las 2 horas, y no se crea sesión para pedidos sin cookie. Si la sesión vence, el panel vuelve al login sin perder los cambios sin guardar.
  * **Esquema de dos claves (Claude Code, 27/09):** clave común del equipo (`.clave.json`, editable desde el panel) + clave maestra del responsable (`.clave-maestra.json`, no editable desde el panel). `auth.php` ya no crea ninguna clave por defecto ni contiene claves en el código.
* **Protección Anti-Fuerza Bruta:** Registro de intentos fallidos en `api/.intentos.json`. Bloqueo automático de 15 minutos tras 5 fallos y retardo de 1 segundo en cada error.
* **CORS Seguro:** Reemplazado el wildcard `*` por restricción al dominio institucional o mismo host.
* **Escritura Atómica en `api/guardar.php`:**
  * Escritura primero en `data.js.tmp` con `LOCK_EX`.
  * Validación de tamaño (> 1 KB) y terminación sintáctica en `};`.
  * Reemplazo atómico (`rename`) sobre `data.js` para evitar archivos en blanco ante cortes de conexión.
  * Respaldos rotativos históricos en `api/backups/data-YYYYMMDD-HHMMSS.js` (conserva las últimas 20 versiones).
  * Validación de integridad del catálogo de cursos (slugs únicos y válidos).
* **Subida Segura de Imágenes (`api/subir-foto.php`):**
  * Validación de tipo MIME real (`finfo` y `getimagesize()`).
  * Re-procesamiento con librería GD (elimina metadatos EXIF con coordenadas GPS y neutraliza código inyectado).
  * Límite de 8 MB y redimensionado de imágenes mayores a 2400 px.
* **Quick Wins de Código y Accesibilidad:**
  * Corregido `fontSize:17px` por `font-size:17px;` en `site/index.html`.
  * Corregido `justifyContent` por `justify-content` en `site/admin.html`.
  * Aumentado el contraste del texto en cinta celeste (`#475569` ➔ `#334155`).
  * `theme-color` corregido a `#002878` (azul institucional `--blue-900`).
  * Mensaje predeterminado de WhatsApp actualizado sin arroba: *"Hola, quiero información sobre los cursos de Formación Profesional."*.

---

## 4. SEGUIMIENTO DE AUDITORÍA: RESUELTO Y PENDIENTE

Se separan aquí los arreglos y decisiones ya documentados de los trabajos que todavía requieren atención.

### 4.A. Incidencias resueltas y decisiones vigentes

* **Generador de promociones — arreglado el 27/09 (Claude Code).** Verificado midiendo el render real de los 22 cursos en los 3 formatos, con Poppins y Source Sans cargadas:
  * ✅ El titular ya no queda tapado por la cápsula en ningún curso: el tamaño tiene en cuenta la palabra más larga (peor caso: 70 px de separación).
  * ✅ Título corto automático: si el nombre no entra en 3 líneas, se corta en el primer " + ", " — " o " (". La limitación de cuatro nombres que todavía requieren un ajuste manual se describe en §4.B.
  * ✅ Días y horario: se toma el primer turno, sin aclaraciones entre paréntesis ni "Tarde:"/"Mañana:". Con muchos días la letra se achica y queda centrada dentro de la cápsula (desvío 0 px, 3 líneas como máximo). Para usar otro turno se editan los campos del paso 4.
  * ✅ Historia 9:16 con zona segura: 259 px libres arriba y abajo (medidos a 1080 de ancho).
  * ✅ Paso 3: filtra por la familia del curso y preselecciona una foto propia del curso (reconoce los archivos `{slug}-{n}.jpg`, porque las fotos de `bibliotecaFotosPromo` no tienen `cursoSlug`).
  * ✅ Las promociones nuevas arrancan con el pop-up apagado.
  * ✅ Los botones indican el tamaño real de los PNG (Feed 1350×1687, Historia 1350×2400).
  * ✅ **Tipografías en el PNG:** la primera exportación después de abrir el panel salía con Arial y desarmada, porque html-to-image no resolvía el `@import` anidado de Google Fonts, y cada exportación siguiente duplicaba fuentes. Ahora `obtenerFontCSSFlyer()` incrusta una sola vez Poppins 700/800 y Source Sans 3 400/600, y se pasa como `fontEmbedCSS`.
  * Los cambios del flyer están en `site/admin.html` y en `fuente-jsx/app.jsx` (copia usada por el pop-up del Home). Las dos copias de `FlyerCursoV1` tienen que seguir iguales.
* **Plantillas nuevas (Claude Code, 27/09):** implementadas `flyer-curso-v2` (Promo de curso alternativa) y `apertura-inscripciones-v1` (Inscripciones abiertas). Diseños de referencia: `entrega-promociones/templates/promo-curso` e `inscripciones-abiertas`.
  * **Inscripciones no se liga a un curso:** en el paso 2 se eligen las familias de oficios que aparecen como etiquetas (todas por defecto); la fecha sale de `inscripciones.cintaCursos.fechaCierre` de `data.js`. En el pop-up del Home el botón es "Ver cursos" y el WhatsApp pregunta por las inscripciones.
  * **Todos los textos son editables:** cada plantilla declara sus campos en `CATALOGO_PLANTILLAS` (dentro de `plantillas-promo.jsx`) y el paso 4 arma el formulario con ellos. Campo vacío = texto original. Las promociones de curso guardan `datosCurso` con los datos originales del curso.
  * **Un solo archivo para las 3 plantillas** (`fuente-jsx/plantillas-promo.jsx` → `site/plantillas-promo.js`), cargado por `index.html` y `admin.html`: se eliminaron las copias duplicadas del flyer en `admin.html` y `app.jsx`.
  * **Formatos altos (Historia y A4):** reemplazado el 27/09 por los diseños propios de cada formato del responsable del sitio (ver los dos puntos siguientes).
  * **Verificado:** 141 casos (3 plantillas × 3 formatos × 22 cursos, más casos de estrés) midiendo el render real con Poppins y Source Sans cargadas y con ventana angosta; PNG revisados a ojo; pop-up del Home probado con una promoción de inscripciones.
  * ⚠️ **El CSS del panel para celulares** (`div[style*="grid-template-columns: 1fr 1fr"]` → 1 columna, auditoría C10) también le pegaba a las plantillas y desarmaba el PNG exportado desde una ventana angosta. En las plantillas no escribir `1fr 1fr` literal: usar `minmax(0, 1fr)` o `repeat(2, …)`.
  * Interlineado del titular del flyer estándar subido a 1,08: con 0,95 el tilde de una mayúscula (BÁSICO) tocaba la línea de arriba.
  * Límite conocido de inscripciones A4: con todos los textos muy largos a la vez, la foto circular queda chica, aunque no se pisa nada; ver §4.B.
* **Diseños por formato del responsable del sitio (27/09, hechos a mano, sin IA):** en `entrega-promociones/templates/` agregó `FlyerCursoStories`, `PromoCursoStories`, `PromoCursoA4`, `InscripcionesAbiertasStories` e `InscripcionesAbiertasA4`. Criterio: cada formato con su propia composición, en vez de estirar la del Feed.
  * **Flyer estándar · Stories:** titular a todo el ancho arriba (hasta 150 px); foto con arco y cápsula lado a lado debajo; datos y pie apoyados abajo; márgenes de 150 px arriba y abajo; opción nueva para ocultar el círculo "100% gratuito".
  * **Inscripciones · Stories:** logo grande (620 px) arriba; foto circular entera, más abajo, con el sello a su izquierda; titular centrado en el espacio del medio; pie en dos filas (los dos datos; después "CONSULTAS POR WHATSAPP" y el número).
  * **Promo alternativa · Stories:** foto de al menos 760 px, logo grande, cinta más larga y titular algo más chico.
  * **Inscripciones · A4 y Promo alternativa · A4:** la composición del Feed con proporciones propias para la hoja (maquetadas a 1240×1754): foto circular, titulares y pie más grandes.
  * El flyer estándar no tiene A4 nuevo: sigue el original (`FlyerCurso.dc.html` ya era A4).
* **Implementación de esos diseños (Claude Code, 27/09):** en `plantillas-promo.jsx` cada plantilla toma las medidas de su formato (`FlyerCursoV1Historia`, `MEDIDAS_PROMO_CURSO`, `MEDIDAS_INSCRIPCIONES`), pasadas a cqw (px ÷ 10,8 en Feed y Stories; px ÷ 12,4 en A4).
  * Con textos normales las posiciones son las del diseño. Solo se agregó lo necesario para que nada se pise con textos largos: titulares que se ajustan al ancho y al alto disponibles, días de la cápsula en 3 líneas como máximo, y en el flyer Stories la foto y la cápsula se acortan si el titular o los datos necesitan lugar (pasa con los 2 cursos que se dictan en las dos sedes).
  * El titular del flyer Stories usa interlineado 1,04 (el diseño tenía 0,92) para que el tilde de las mayúsculas no toque la línea de arriba; por eso sale a unos 126 px en vez de 150.
  * Verificado: 144 casos (3 plantillas × 3 formatos × 22 cursos, más casos de estrés) midiendo el render real con las tipografías cargadas, sin problemas; PNG de cada formato revisados a ojo; opción de ocultar el círculo probada en el panel.
  * ⚠️ En Inscripciones y Promo alternativa · Stories se observó el pie a 70–80 px del borde inferior, cerca de la interfaz de Instagram; queda pendiente validarlo en la aplicación real (ver §4.B).
* **Inscripciones · Stories y A4 ajustadas a los borradores del responsable (27/09, 09:26):** el responsable editó a mano dos exportaciones y pidió que el resultado quede así. Cambios en `MEDIDAS_INSCRIPCIONES` (`plantillas-promo.jsx`):
  * **A4:** el rótulo "WHATSAPP" pasa a la izquierda, alineado con el comienzo del número dentro de la píldora (`pie.rotuloWhatsappIzquierda`). Comparado con el borrador: coincide.
  * **Stories:** foto, aro y sello un 30% más grandes y más arriba (foto de 754 px en vez de 580 px, empieza a 213 px del borde); marca de agua más grande y detrás del titular; el texto queda apoyado sobre el pie y la foto toma el alto que sobra (si el texto crece, la foto se achica en vez de pisarlo); el número de WhatsApp se alinea con la columna de la sede (`pie.whatsappEnColumna`). Comparado con el borrador: las posiciones coinciden a menos de 5 px; la píldora queda 16 px más a la derecha que en el borrador, porque se alineó exacto con "SEDE".
  * Feed no cambia. La marca de agua de Inscripciones ahora siempre se ubica respecto del lienzo (`arco.arribaLienzo` o `arco.abajoDelPie`).
  * Verificado: 147 casos medidos sin problemas (con textos largos la foto de Stories baja a 439 px sin pisar nada); PNG de Stories y A4 revisados.
* **Fotos de promociones (66 agregadas por Antigravity):** `descargar-fotos-promociones.js` usa Unsplash y, como respaldo, búsqueda de imágenes de DuckDuckGo; `reemplazar-fotos-genericas.js` bajó 3 fotos de sitios comerciales. No se registró el origen de cada foto. **Decisión del responsable del sitio (27/09): se mantienen. No restringir, borrar ni reemplazar fotos sin que lo pida.**
#### Actualizaciones posteriores ya implementadas (27/09)
* **Mejoras de diseño mobile (implementadas el 27/09 por Antigravity):**
  * ✅ **Encabezado fijo en celular:** Rediseñado a 2 filas compactas (fila 1: logo institucional a la izquierda + botón Campus Virtual en píldora a la derecha; fila 2: enlaces de navegación distribuidos en una sola fila con divisor sutil). Altura reducida de ≈173 px a ≈72 px (más del 55% de ahorro vertical en pantalla).
  * ✅ **Robot de Marbot** (`.mb-lanzador` en `MB_CSS`): Achicado a 60 px en celular (con globo y panel ajustados) para no tapar los textos de las tarjetas ni del pie.
  * ✅ **Logo del Campus en su ventana:** Subido a `maxHeight: 72` con `objectFit: 'contain'` en `app.jsx`. Se visualiza nítido y legible en todos los dispositivos.
  * ✅ **Botones en Arial:** Solucionado globalmente mediante `button, input, select, textarea { font-family: inherit; }` en el reset de `index.html` y `admin.html`. Los botones heredan la tipografía oficial (Source Sans / Poppins).
  * ✅ **Áreas de toque táctiles:** Botón "Volver a Cursos" con padding y altura mínima de 36 px; casillas de checkbox en el panel unificadas a 18×18 px con color de acento de marca.
* **Compilación de `admin.html` (C1 — resuelto 27/09):** Extraído el JSX a `fuente-jsx/admin.jsx` y precompilado a `site/admin.js` (178 KB). Se eliminó Babel Standalone (2,5 MB) de `admin.html`, acelerando drásticamente la carga del panel en móviles. Se agregaron hashes de integridad (SRI) a React y Lucide en el panel.
* **SEO dinámico por Curso (C3 — resuelto 27/09):** Creado `site/curso.php?slug=...` que lee `data.js` e inyecta etiquetas OpenGraph dinámicas (`og:title`, `og:description`, `og:image`, `og:url`) para compartir cursos en WhatsApp o redes, con ficha accesible en `<noscript>` y redirección transparente a la SPA para navegadores.
* **Año Dinámico (C4), Efemérides (C5) y WhatsApp dinámico (C6 — resueltos 27/09):**
  * `app.jsx` calcula el año en vivo con `new Date().getFullYear()` en las cabeceras de Agenda, efemérides y botones.
  * Eliminada la duplicación de 33 efemérides en `app.jsx` (fuente única en `data.js`).
  * `WHATSAPP_URL` y respuestas de Marbot derivan el teléfono de forma reactiva desde `CFP_DATA.contacto.whatsapp`.
* **`robots.txt` (resuelto 27/09):** Creado `site/robots.txt` y añadido `Allow` explícito en `site/.htaccess` para permitir el rastreo e indexación de buscadores mientras se mantienen bloqueados los archivos sensibles.

### 4.B. Pendientes y riesgos abiertos

* **DESPLIEGUE REALIZADO — Brillo en Firefox (fotos a sRGB), foto del header sobre el isotipo en celular, pastilla de guardado con "Revertir" en todo el panel y registro de cambios (resuelto 20/10 23:12 por Antigravity):** Subidas por FTPS a Ferozo (`/public_html` de `https://cfp401avellaneda.com.ar`) las 18 fotos a sRGB en `assets/promociones/` y `assets/promociones/talleres/`, `api/registro.php`, `admin.js`, y al final `admin.html` e `index.html` (permisos 644). No se subió `data.js` (no cambió). Verificados los 22 archivos en vivo vía HTTPS con coincidencia exacta de tamaño y SHA-256. Comprobaciones exitosas: `api/registro.php` devuelve 401 sin sesión; las 18 fotos en producción están en sRGB estándar evitando HDR y caída de brillo en Firefox; el header en celular muestra la foto con opacidad 1 y z-index 2 tapando el isotipo (opacidad 0.75 y z-index 1); la pastilla de guardado con botón "Revertir" y el Registro de Cambios en Sistema y Seguridad validados con la suite e2e (66/66) y verificar-todo (44/44).
  1. **No subir `data.js`**: no cambió (la copia local es la de producción guardada por "Nico" a las 22:45, huella `466b5c8fa976a244…`).
  2. **Subir de `CFP 401 Avellaneda WEB v2.0/site/`:** primero las fotos y el PHP, después `admin.js` y **al final los HTML**. SHA-256 esperados:
     - 18 fotos convertidas a sRGB (reemplazan a las del servidor con el mismo nombre; las originales quedaron en `.local/fotos-perfil-original/`):
       - `assets/promociones/administracion-general-de-medio-ambiente-2.jpg` (141.6 KB) — `2f28e930e72767bab0e07c1305ff922cf5cb99a319550b08bc4027c306c70085`
       - `assets/promociones/talleres/administracion-general-de-medio-ambiente-2.jpg` (141.6 KB) — `2f28e930e72767bab0e07c1305ff922cf5cb99a319550b08bc4027c306c70085`
       - `assets/promociones/auxiliar-de-seguridad-e-higiene-laboral-2.jpg` (353.4 KB) — `86b7cc952f4201060a893de0602ffaf9a3e94b80b74b46c630884ad3c577e7da`
       - `assets/promociones/talleres/auxiliar-de-seguridad-e-higiene-laboral-2.jpg` (353.4 KB) — `86b7cc952f4201060a893de0602ffaf9a3e94b80b74b46c630884ad3c577e7da`
       - `assets/promociones/auxiliar-de-seguridad-e-higiene-laboral-3.jpg` (189.9 KB) — `b4ff414f3c5e9d44f259b62160a6b9a8b43a51071be05c9f0036371958877e37`
       - `assets/promociones/talleres/auxiliar-de-seguridad-e-higiene-laboral-3.jpg` (189.9 KB) — `b4ff414f3c5e9d44f259b62160a6b9a8b43a51071be05c9f0036371958877e37`
       - `assets/promociones/diseno-grafico-i-y-ii-diseno-de-paginas-web-3.jpg` (321.6 KB) — `7fcd275c12abd56d43f6b988434b9b20c7651b5b258bde964a54b73997cdc1a6`
       - `assets/promociones/talleres/diseno-grafico-i-y-ii-diseno-de-paginas-web-3.jpg` (321.6 KB) — `7fcd275c12abd56d43f6b988434b9b20c7651b5b258bde964a54b73997cdc1a6`
       - `assets/promociones/electricista-industrial-sistemas-embebidos-sistemas-electronicos-programables-3.jpg` (202.8 KB) — `00534f4789da7f403bbea8a07cbe4ce58fa6f18b87607c6b164518a7a81aaf19`
       - `assets/promociones/talleres/electricista-industrial-sistemas-embebidos-sistemas-electronicos-programables-3.jpg` (202.8 KB) — `00534f4789da7f403bbea8a07cbe4ce58fa6f18b87607c6b164518a7a81aaf19`
       - `assets/promociones/instalador-y-soporte-de-sistemas-informaticos-reparador-de-pc-1.jpg` (195.8 KB) — `0ca9bdc703fad3a39681d329410efb33648eb0d4213b0805a36a9b52557658da`
       - `assets/promociones/talleres/instalador-y-soporte-de-sistemas-informaticos-reparador-de-pc-1.jpg` (195.8 KB) — `0ca9bdc703fad3a39681d329410efb33648eb0d4213b0805a36a9b52557658da`
       - `assets/promociones/mantenimiento-de-edificio-3.jpg` (223.9 KB) — `b396faf70ee13c555243dd8f0c728e27d8846bd6560b026d84ef84235a6844a8`
       - `assets/promociones/talleres/mantenimiento-de-edificio-3.jpg` (223.9 KB) — `b396faf70ee13c555243dd8f0c728e27d8846bd6560b026d84ef84235a6844a8`
       - `assets/promociones/reparador-de-electrodomesticos-de-linea-blanca-y-reparacion-de-plaquetas-3.jpg` (155.9 KB) — `371cdfbaadd0906c3e15ceed0c32a4d0d2abca0ac8defa22fef190fdf8d1e3b8`
       - `assets/promociones/talleres/reparador-de-electrodomesticos-de-linea-blanca-y-reparacion-de-plaquetas-3.jpg` (155.9 KB) — `371cdfbaadd0906c3e15ceed0c32a4d0d2abca0ac8defa22fef190fdf8d1e3b8`
       - `assets/promociones/soldador-basico-2.jpg` (175.1 KB) — `38bac1cb2c92f2e7778fa3f91dcf60d710b75ae78d63318ae070dc5700dbb57a`
       - `assets/promociones/talleres/soldador-basico-2.jpg` (175.1 KB) — `38bac1cb2c92f2e7778fa3f91dcf60d710b75ae78d63318ae070dc5700dbb57a`
     - `api/registro.php` (2.0 KB; nuevo: registro de cambios para el panel; exige sesión) — `1ee9d3527067c08f6f87e6abe828cf61b093eb60650515a951e9a81887773957`
     - `admin.js` (271.7 KB) — `791f3297a5ae4a9b713fae1b410a52de8e310e4e3ffc9d00d89a6a58dabbcd58`
     - `admin.html` (30.1 KB) — `a3408e50cd7062eda166bf125127045690ade15fa674d19dbfc65ef3036cdc68`
     - `index.html` (24.6 KB) — `94977e1afd48d4479c644949a0e40f46a8f453f39d4f885c1fb44523f4bff55f`

     Permisos 644. `app.js`, `iconos.js` y `cfp-reglas.js` no cambiaron.
  3. **Comprobar:**
     - en Firefox, Promociones ya no apaga el brillo de las pestañas del sitio;
     - en celular, la foto del círculo tapa por completo al isotipo;
     - en el panel, la pastilla de guardado está en todas las secciones, "Revertir" aparece con cambios sin guardar y vuelve al último guardado, y "Descargar data.js" está solo en Sistema y Seguridad;
     - en Sistema y Seguridad, "Registro de cambios" lista quién guardó y cuándo;
     - `curl -s -o /dev/null -w "%{http_code}" https://cfp401avellaneda.com.ar/api/registro.php` devuelve 401 sin sesión.

     Registrar en la bitácora.
* **DESPLIEGUE REALIZADO — Cursos 2027, filtro por turno, capacidades, "Leer más", promocionador, velocidad, fotos livianas del carrusel, isotipo y logo de la franja amarilla (resuelto 20/10 22:25 por Antigravity):** Subidos por FTPS a Ferozo (`/public_html` de `https://cfp401avellaneda.com.ar`) los 15 archivos en el orden estricto indicado (`assets/livianas/` y `assets/logo-provincia-ba-azul.png`, luego JS, PHP y `.htaccess`, luego `data.js` tras validar huella base `f7ca92d34328ecae47f508d5bc94d43f376d514c7e5a33ece60c509b1d4627d9`, y al final los HTML). Verificados en vivo vía HTTPS (todos HTTP 200 con hashes y tamaños coincidentes, seguridad 403 en dotfiles/backups, caché de un año en `app.js` y `no-cache` en `index.html`). Comprobados en PC, tablet y celular: filtro por turno (26 cursos en Todos, 12 Mañana, 14 Tarde, 15 Noche), capacidades y turnos por renglón con repliegue "Leer más" en celular, redirección del slug histórico del Gasista, hero liviano por encima del isotipo y texto por encima, logo azul con franja amarilla, pastilla de guardado y avance automático en el promocionador.
  1. **Condición para `data.js`:** subirlo **solo si** el `data.js` de producción sigue teniendo la huella `f7ca92d34328ecae47f508d5bc94d43f376d514c7e5a33ece60c509b1d4627d9` (la que se tomó como base). Si cambió (alguien guardó desde el panel), **no subirlo**: bajar el de producción y regenerar con `node .local/cursos-2027/aplicar.js <data.js de producción> site/data.js` (el script se detiene si los cursos ya no coinciden) y avisar en la bitácora.
  2. **Subir de `CFP 401 Avellaneda WEB v2.0/site/`:** primero las imágenes nuevas, después los JS, PHP y `.htaccess`, luego `data.js` y **al final los HTML**. SHA-256 esperados:
     - Carpeta nueva `assets/livianas/` (755) con las versiones livianas del carrusel (recortadas al cuadrado que se ve en el círculo, 1320 px; las originales de `assets/` no se tocan):
       - `assets/livianas/hero-soldadura.jpg` (262.4 KB) — `412287a2fb510dce63b95320c9e8a950042d0570f755daafacdf4ded0963f83c`
       - `assets/livianas/hero-electricidad.jpg` (246.8 KB) — `d647a5804cc38796c30e6984b6492902195d87609bdbbde781d1a347f10b16b1`
       - `assets/livianas/hero-domotica.jpg` (342.3 KB) — `01711e65c3f334bb6fe0f044cd33b5210c338dad615cf112161404db7658fd80`
       - `assets/livianas/hero-egresados.jpg` (312.4 KB) — `4da72387e41ddcb84830d75768fb0d98ba5e519ca016be8eedb50fe681680a4f`
       - `assets/livianas/hero-energias.jpg` (258.6 KB) — `642affe9875db8b754bff427825e415516ba009f3db0c5cf0d638e52d08f1c5e`
     - `assets/logo-provincia-ba-azul.png` (27.3 KB; nuevo: logo de la Provincia en azul institucional para la franja amarilla) — `e0ddb782739a32b239f2c2b1d104affcc79f12c5d7e35e9052c19130d30c1776`
     - `iconos.js` (3.0 KB; nuevo: dibujo rápido de íconos) — `1458b29a16ae093445a74c4acf042da4fea52bb404936e6f5dde6d79daf096cf`
     - `cfp-reglas.js` (4.4 KB; turnos y slugs anteriores) — `74ebfa479304a9fc6317c0f555a3ca98db68bac84c03b38f29e85da21ca257fd`
     - `app.js` (149.0 KB) — `294b41f165bf1beea4e186fc93b4bf21c5c10ece1dedab9e59027e6d0591c765`
     - `admin.js` (267.5 KB) — `2b5c82216623758e7eca15db4f8b9de6c9da5297d4fff8ea9f5a87ff686b6955`
     - `curso.php` (6.9 KB; responde a los slugs anteriores) — `bf47937de7efbd24df09d824437f5910cadc277cbb8666e10e1b1fb1f421c065`
     - `.htaccess` (2.6 KB; caché: HTML sin caché, scripts versionados por un año) — `35dfcb42c255c405875b8ab269d1fe0fd346844805fab6a94487dbdeb17a95ff`
     - `data.js` (132.0 KB; cursos 2027; ver la condición del punto 1) — `e271eb02ab14bf7fe63bdeb77881367331ff58d18e3384366c21994847199c68`
     - `admin.html` (30.1 KB) — `7428f05ea1298d68b6da4865a68ec1d7365f2f8a49097a0c70446d64b9cd89b0`
     - `index.html` (24.5 KB; incluye las capas del header) — `3431d8ab635b2d477cd8f9a9a63d1ce548ccf538b6d449398e109b61b1491f84`

     Permisos 644. `catalogo/` no cambió.
  3. **Comprobar (PC, tablet y celular):**
     - en Cursos hay 26 cursos y el filtro "Turno" (Mañana, Tarde, Noche) funciona;
     - la página de un curso muestra los turnos uno por renglón, "Capacidades profesionales" y la certificación; en celular, Capacidades y Detalles se pliegan con "Leer más";
     - un enlace viejo, por ejemplo `#/curso/gasista-domiciliario-2-categoria-apto-matricula-incluye-diseno-proyectual-asistido-por-computadora-cad`, abre el Gasista con la dirección nueva `#/curso/gasista-domiciliario`;
     - en el inicio, las fotos del círculo se cargan desde `assets/livianas/` y quedan por encima del isotipo en todos los tamaños, con el texto siempre por encima de la foto;
     - con la cinta en amarilla, el logo de la Provincia sale en azul (en blanca sigue el original);
     - en el panel, en Promociones, el guardado es una pastilla chica abajo a la derecha, y al elegir el modelo, el curso o la foto se pasa solo al paso siguiente;
     - `curl -I https://cfp401avellaneda.com.ar/app.js` devuelve `Cache-Control: public, max-age=31536000, immutable` e `index.html` devuelve `no-cache`.

     Registrar en la bitácora.
* **DESPLIEGUE REALIZADO — Catálogo oficial 2027 · Alta de cursos y 130 páginas individuales precargadas (resuelto 20/10 18:56 por Antigravity):** Subidos por FTPS TLS explícito a `/public_html` en Ferozo (`https://cfp401avellaneda.com.ar`) los 7 archivos con verificación estricta de tamaño y hashes SHA-256 (`catalogo/catalogo-2027.json`, `catalogo/catalogo-2027.pdf`, `admin.js`, `app.js`, `admin.html`, `index.html` y `.htaccess`). Se ajustó `.htaccess` para conceder acceso público a `catalogo-*.json`. Verificados en vivo vía HTTPS con HTTP 200 OK y coincidencia íntegra de hashes. Verificada denegación HTTP 403 en `api/.clave.json`, `api/.clave-maestra.json` y `api/backups/`. La nueva sección del Catálogo 2027 con alta asistida, 130 páginas individuales completas y buscador optimizado ya está 100% operativa en producción.
  1. **Subir de `CFP 401 Avellaneda WEB v2.0/site/`:** primero la carpeta nueva `catalogo/` y los JS, **al final los HTML**. Hashes SHA-256 y tamaños verificados:
     - `catalogo/catalogo-2027.json` (nuevo; 581.7 KB, 338 trayectos con 130 páginas redactadas completas) — `670f721c5d1dfc94b5c0899badf70e1c974df6fa75c50e302f651959d6de4fe0`
     - `catalogo/catalogo-2027.pdf` (nuevo; 681.3 KB, PDF oficial DGCyE 2027) — `f32a1bea7c0238d7f6bda207fc45816d639056d8d4e4a2d56b87e5d025d6abe7`
     - `admin.js` (254.7 KB; alta precargada con intro y detalles, filtro "con página" y badge) — `ddc1fdf2616319c07151efdfd93e664a32d8a71f7e6f8ec87fdcab5532096d32`
     - `app.js` (143.9 KB; certificación en página del curso y buscador optimizado) — `64b5dd538ed1be8ce2e710a24b85b2d90a0e5c2bfa8b122a04356369b7697295`
     - `admin.html` (29.8 KB; cache buster actualizado) — `39f181963159702ad0f0578e1ad5842bd3816aa8975b5f4a9b41c74d57ba239c`
     - `index.html` (24.7 KB; cache buster actualizado) — `b01bf3547303ab4f9b2e241c22f5668375824941679cd0ef180a9871e869cde2`

     Permisos 644 (carpeta `catalogo/` en 755). **No subir `data.js`**: no cambió. Los cursos y vínculos se cargan desde el panel.
  2. **Comprobar en el panel y en la web:**
     - en el panel aparece "Catálogo 2027 · Alta" con los 338 trayectos;
     - el selector de estado incluye "Con página individual lista (130)" y las tarjetas muestran el badge "Página lista";
     - probar "Dar de alta en el sitio" sobre cualquier trayecto de las familias (ej. AC29, OC31 o MT30): el modal se abre con **Nombre, Horas, Requisitos, Certificación, Introducción y Detalles de 3 párrafos ya completos**;
     - nombre de IM14 corregido sin la palabra sobrante ("Portugués para Tecnología Digital Nivel I");
     - "Abrir el PDF" abre el documento oficial en nueva pestaña.

     Registrar el resultado en la bitácora.
* **Despliegue de la plantilla «Actividades Institucionales» (resuelto 15/10 21:01 por Antigravity):** Subidos por FTPS a `/public_html` en Ferozo (`https://cfp401avellaneda.com.ar`) los 5 archivos del modelo con hashes SHA-256 y tamaños verificados al 100% (`visita-simma-capacitacion.jpg` en la nueva carpeta `assets/promociones/tematicas/actividades/`, `plantillas-promo.js`, `admin.js`, `admin.html` e `index.html`), y validados con HTTP 200 OK vía HTTPS. La plantilla «Actividades Institucionales» (Modelo H) ya está 100% operativa en el panel de administración.
* **Bloqueo por IP compartida:** en la escuela todos salen a internet por la misma IP; 5 intentos fallidos de cualquiera bloquean 15 minutos a toda esa red, incluida la clave maestra. Si llega a molestar, revisar el umbral o contar los intentos por separado para la maestra.
* **Zona segura en Stories:** validar en Instagram real que el pie de Inscripciones y Promo alternativa (a 70–80 px del borde inferior) no quede cubierto por los controles de la aplicación.
* **Titulares promocionales largos:** cuatro nombres de curso que no se pueden recortar por separadores conocidos pueden ocupar 4 o 5 líneas; el paso 4 muestra el aviso y permite acortarlos manualmente: Realizador de Piezas Gráficas, Montador de Instalaciones Sanitarias, Instalador y Reparador de Aire Acondicionado y Reparador de Electrodomésticos.
* **Inscripciones A4 con textos largos:** cuando todos los campos son extensos, la foto circular se reduce; no hay solapamiento, pero queda una limitación visual visible en la vista previa.
* **Cifras, cinta con logo, UOCRA y puntos 1, 2, 3 y 10 (desplegado el 14/10 a las 21:15 por Antigravity):** realizado el despliegue unificado de los 8 archivos a producción con verificación SHA-256 al 100%, respaldos remotos y HTTP 200 OK en vivo.
* **DESPLIEGUE REALIZADO — Cifras, cinta con logo y UOCRA** (preparado por Claude Code el 2026-10-14 20:39, actualizado a las 20:51 con los ajustes de la cinta y del menú del panel, y a las 20:55 con el logo reemplazable; desplegado por Antigravity junto con los puntos 1, 2, 3 y 10 de "MEJORAS PENDIENTES"):
  1. Hacer 1, 2, 3 y 10 **sobre la copia de trabajo actual**, que ya tiene estos cambios sin commit. Después correr `npm run build` en `fuente-jsx/` (recompila y recalcula los `?v=`) y `npm run verify:e2e`, que tiene que quedar todo en verde, incluida la prueba de "*/".
  2. Subir de `site/` a `/var/www/html/public/cfp/`, primero el logo, los JS y los PHP y **al final los HTML**:
     - `assets/logo-provincia-ba.png` (nuevo; logo DGCyE/Provincia que pasó el responsable) — `4cde6f15503b44cc57d9f805536c5a998be047ac2d65fd2a0be97849e8e8c857`
     - `app.js`, `admin.js`, `admin.html` e `index.html`. Huellas al 20:55, antes de los puntos 1 y 10:
       - `app.js` `8bf2071f7e4d…`
       - `admin.js` `5f26fe297c1e…`
       - `admin.html` `9267d7a2b286…` (incluye el arreglo del menú lateral)
       - `index.html` `f7d754b9cf34…`

       Si se toca `app.jsx` o `index.html`, valen las huellas del nuevo build.
     - `api/guardar.php` y `api/config.php`, con los arreglos 2 y 3.
     - `data.js` — `7ace3b1b0ef8708d4825a18ac70c4e22b49a3e46bac043ef46c9891ed8f51bd7`. **Condición:** solo si el `data.js` de producción sigue teniendo la huella `22d5e15389600967b5c6fb4666479070677eaae8e9368a33cdc6567491277081` (el guardado de "Nico" de las 20:06, traído con `npm run data:pull`). El único cambio es `inscripciones.requisitoGeneral`: "Presentar fotocopia del DNI…" en lugar de "4 fotocopias". Si la huella cambió, **no subir `data.js`** y cambiar esa frase desde el panel (Inscripciones → Requisito general).
  3. **Comprobar en el sitio (PC y celular):**
     - la cinta tiene el logo de la Provincia al centro, sin recuadro (fondo transparente también en la amarilla), y en el panel se cambia de color y se puede ocultar el logo;
     - en tablet y celular la cinta se apila centrada: texto, logo y botón "Quiero inscribirme" en el medio;
     - en el panel, Portada e Inicio → cinta → "Logo para la cinta amarilla" y "Logo para la cinta blanca": "Subir otro logo" cambia el logo de esa versión y "Volver al original" lo restablece. Probar con un PNG transparente: en producción `subir-foto.php` lo reprocesa con GD y tiene que conservar la transparencia (en local no hay GD y no se pudo probar ese camino);
     - el menú lateral del panel nunca queda tapado por la barra "Guardar en Servidor": en pantallas bajas se desplaza solo;
     - el bloque azul de Inicio dice "DESDE 1979 / +45 años formando en oficios", con 4 cifras en 2 × 2 (+3.600, +36.000, 7, 22);
     - Nosotros muestra 1979, +3.600 y +36.000;
     - en el panel, Inicio → "Cifras institucionales" permite editar textos y valores;
     - en el panel, Nosotros → "Mostrar esta tarjeta en la página Nosotros" oculta la tarjeta UOCRA.

     Registrar en la bitácora.
* **MEJORAS PENDIENTES — Paquete de la Directora (revisión de Claude Code, 2026-10-14 20:09; para Antigravity).** Se revisó lo desplegado el 14/10 a las 19:44 de tres maneras: en el código, en producción por HTTPS (PC 1440 px y celular 390 px) y con las pruebas automáticas.
  **Quedó bien:**
  - lo compilado coincide con las fuentes y lo local con producción;
  - `npm run verify` OK (36 controles y 355 piezas);
  - horarios 9 a 20 hs en cinta, contacto, pie y JSON-LD;
  - tarjetas de propuesta;
  - familias sin "ÁREA DE";
  - "Campus Virtual" en el bloque de inscripción;
  - Nosotros;
  - en Contacto, el rótulo "Anexo" sin "Talleres prácticos" y la guía de colectivos;
  - pie a 15 px;
  - registro de operador (en producción ya figura "Operador / Usuario" en `data.js`);
  - cinta blanca, que se ve bien en PC.

  **Reparto (actualizado 14/10 20:30):** con datos nuevos del responsable, **Claude Code toma los puntos 4, 5, 6, 7, 8, 9 y 11, y además el logo de la Provincia en la cinta**; trabaja en `app.jsx`, `admin.jsx` y `data.js`. **Antigravity hace 1, 2, 3 y 10** (`index.html`, `api/guardar.php`, `api/config.php` y `app.jsx` solo en la línea ~1432). El punto 12 es para quien suba `data.js`. No tocar los archivos del otro hasta que figure terminado en la bitácora.
  **HECHO por Claude Code (20:39), sin subir todavía:** puntos 4, 5, 6, 7, 8, 9 y 11, más dos pedidos nuevos del responsable: el logo de la Provincia en la cinta y el interruptor para ocultar la tarjeta UOCRA en Nosotros. Detalle en la bitácora (14/10 20:39) y despliegue abajo, en "DESPLIEGUE PENDIENTE — Cifras, cinta con logo y UOCRA".
  **Siguen para Antigravity:** 1, 2, 3 y 10.

  **Para corregir, por prioridad:**
  1. **Alta — Hero en celular:** la regla nueva `.cfp-lens{z-index:2!important}` (`site/index.html`) sube la foto del círculo por encima del texto. En celular la foto es semitransparente y de fondo (`div.cfp-lens{opacity:.68}`), así que ahora tapa el párrafo "Cursos presenciales sin costo…" y parte de los botones. **Arreglo:** limitar las dos reglas a escritorio, `@media (min-width:981px){.cfp-lens{z-index:2}.cfp-arc-stage{z-index:1}}`, o dar al bloque de texto del hero `position:relative;z-index:3`. Probar a 390 px.
  2. **Alta — Seguridad en `api/guardar.php`:** el nombre de operador se escribe dentro del comentario de `data.js`, y `addcslashes` no evita `*/`. Un nombre como `x */ alert(1) /*` cierra el comentario e inyecta JavaScript en el sitio público. Hace falta sesión del panel para hacerlo, pero cualquiera con la clave común podría. **Arreglo:**
     - aceptar solo letras, números, espacios y `. , - ( ) '`: `$usuario = mb_substr(trim(preg_replace("/[^\\p{L}\\p{N} .,'()-]/u", '', $usuario)), 0, 40);`;
     - como red de seguridad, `str_replace('*/', '* /', …)` en el encabezado.

     Así tampoco entran saltos de línea en `registro-cambios.log`. `npm run verify:e2e` ya trae la prueba "Auditoría: un nombre de operador con \"*/\" no inyecta código en data.js": **hoy falla y tiene que pasar después del arreglo.** (Claude Code ya adaptó esa prueba al nuevo campo "Operador" del ingreso; todo lo demás pasa.)
  3. **Media — Hora del servidor:** el encabezado de `data.js` y `registro-cambios.log` usan `date()` en UTC (el último guardado figura 23:06 cuando eran las 20:06). **Arreglo:** `date_default_timezone_set('America/Argentina/Buenos_Aires');` al inicio de `api/config.php`.
  4. **Media — Cifras del bloque "Desde 1979":**
     - son 4 en una grilla de 3 columnas, y "22 Cursos gratuitos" queda sola en otra fila. Usar `gridTemplateColumns:'repeat(2,1fr)'` (2 × 2) o las 4 en una fila en PC;
     - unificar formato y mayúsculas: "+3.600 Cursos dictados", "+1.800 …", "7 Familias profesionales", "22 Cursos gratuitos", y en Nosotros "+24.000" en lugar de "+ de 24 mil" (o al revés, pero igual en todo el sitio).
  5. **Media — Texto a confirmar con la directora:**
     - "+1800 egresados en FI. formando en oficios en Dock Sud": "FI." no se entiende y repite el título;
     - choca con "+ de 24 mil egresados" de Nosotros.

     Confirmar la cifra y qué significa la sigla. Proponer "+1.800 egresados en Formación Integral" (si es eso) o quitar ese rótulo.
  6. **Media — Las cifras están fijas en `app.jsx`:** +3600, +1800, +24 mil y "Desde 1979, +45 años" no se pueden editar desde el panel (el reporte de las 19:44 decía "métricas dinámicas"). Pasarlas a `data.js` (por ejemplo `home.estadisticas` y `nosotros.estadisticas`) con campos en el panel.
  7. **Baja — Cinta blanca en celular:** el separador "|" queda colgado al final del renglón cuando la línea se corta. Ocultarlo debajo de 600 px, o poner la dirección en su propio renglón sin separador.
  8. **Baja — Doble espacio en la cinta:** "Inscripciones abiertas␣␣a partir del…": el `marginRight:6` se suma al espacio. Dejar uno solo.
  9. **Baja — Coherencia de requisitos:** el bloque de Inicio dice "Fotocopia del DNI", pero `inscripciones.requisitoGeneral` (página Inscripción) y Marbot (`app.jsx` ~1650) dicen "4 fotocopias del DNI". Unificar según lo que pida la directora.
  10. **Baja — "Ir al Campus Virtual":** sigue así en Contacto (`app.jsx` ~1432); en Inicio se cambió a "Campus Virtual". Unificar si el pedido era para todo el sitio.
  11. **Baja — Restos de "9 a 22 hs":** quedan como texto de respaldo en `app.jsx` (líneas ~766 y ~1420) y como ejemplos en `admin.jsx` (~699, ~1812, ~2894). Hoy no se ven porque `data.js` trae el horario nuevo, pero conviene pasarlos a "9 a 20 hs".
  12. **Proceso — `data.js`:** el 14/10 se subió `data.js` editado a mano. Además, desde las 20:06 producción ya tiene un guardado hecho desde el panel ("Operador: Nico"), que la copia local no tiene. **Antes de volver a subir `data.js`:** correr `npm run data:pull`, revisar el diff y aceptar con `--confirm-sha256`; si no, se pisa ese cambio. Conviene comparar también `api/backups/` del servidor contra la versión del 14/10 para confirmar que esa subida no pisó nada guardado entre el 28/09 y el 14/10.

  **No se pudo verificar en la captura automática:** los mapas de Contacto, porque Google Maps no carga en el navegador de prueba. Mirarlos en un navegador común: los dos tienen que medir lo mismo (260 px).

  Después de los arreglos: `npm run build`, `npm run verify:e2e` (todo en verde), subir con huellas y registrar en la bitácora.
* **Aviso Primaria: "primarios." en amarillo y subrayado (resuelto 09/10 14:46 por Antigravity):** Subidos por SFTP los 3 archivos (`plantillas-promo.js`, `admin.html`, `index.html`) con hashes SHA-256 validados. El campo destacado se visualiza en la misma línea que "estudios", en amarillo, subrayado y con ajuste tipográfico optimizado.
* **Despliegue del Modelo "Aviso Primaria (Stories)" (resuelto 09/10 14:22 por Antigravity):** Subidos por SFTP los 7 archivos con SHA-256 idénticos (`primaria-egresados.jpg`, `primaria-fachada.jpg`, `plantillas-promo.js`, `admin.js`, `app.js`, `admin.html`, `index.html`), creada carpeta `assets/promociones/tematicas/primaria/` (755 www-data) y comprobados endpoints vía HTTPS con HTTP 200 OK. El modelo `aviso-primaria-v1` está 100% operativo en producción con su flujo específico (Stories 9:16, fotos dedicadas, sin paso de curso).
* **Despliegue de Fase 0 ampliada (resuelto 28/09 08:08 por Antigravity):** Subidos los 9 archivos con SHA-256 idénticos (`cfp-reglas.js`, `plantillas-promo.js`, `admin.js`, `app.js`, `api/guardar.php`, `api/guardar-promo-png.php`, `api/.user.ini`, `admin.html`, `index.html`), creada carpeta `assets/promociones/guardadas/` (755 www-data), Nginx configurado con no-cache para `cfp-reglas.js` y bloqueo para `data.backup.js`, PHP-FPM recargado y endpoints validados con HTTP 200 OK vía HTTPS.
* **Dependencias de Vendor Locales (D2):** Descargar React, ReactDOM y Lucide a una carpeta `site/vendor/` para eliminar la dependencia de redes externas como `unpkg.com`.

---

## 5. GUÍA RÁPIDA DE COMANDOS Y RUTAS CLAVE

| Acción | Comando / Ruta |
|---|---|
| **Ruta del Proyecto Activo** | `C:\Users\Nicolás\Desktop\Campus Virtual\CFP 401 Avellaneda WEB v2.0` |
| **Carpeta a subir por FTP** | `C:\Users\Nicolás\Desktop\Campus Virtual\CFP 401 Avellaneda WEB v2.0\site` |
| **Compilar React Frontend** | Abrir `fuente-jsx/` y ejecutar: `cmd /c "npx babel app.jsx --out-file ../site/app.js --config-file ./babel.config.json"` |
| **Compilar Panel Admin** | Abrir `fuente-jsx/` y ejecutar: `cmd /c "npx babel admin.jsx --out-file ../site/admin.js --config-file ./babel.config.json"` |
| **Compilar Plantillas Promo** | Abrir `fuente-jsx/` y ejecutar: `cmd /c "npx babel plantillas-promo.jsx --out-file ../site/plantillas-promo.js --config-file ./babel.config.json"` |
| **Validar sintaxis JavaScript** | `node -c site/app.js`, `node -c site/admin.js` y `node -c site/data.js` |
| **Probar Enlace SEO Curso** | `curso.php?slug=soldador-basico` |
| **Probar Pop-up forzado** | `index.html?promo=1` o `index.html?promo=soldador-basico` |
| **Probar Efemérides en fecha**| `index.html?fecha=2026-05-25` |

---

## 6. BITÁCORA CRONOLÓGICA DE MODIFICACIONES

*(Todas las IAs deben agregar una fila con hora local real de America/Argentina/Buenos_Aires. El detalle anterior a cuatro días se archiva en [BITACORA-DE-INICIO.md](BITACORA-DE-INICIO.md).)*

**Hitos archivados el 09/10/2026** (121 filas, del 27/09 al 30/09, en [BITACORA-DE-INICIO.md](BITACORA-DE-INICIO.md)). Las decisiones vigentes siguen en §3, §4 y §9:
- **27/09:**
  - Seguridad de la Fase 1: claves bcrypt, sesiones y blindaje de Nginx.
  - Generador de promociones con 7 modelos, iguales a los diseños del Sistema de Diseño.
  - Skill `cfp401-estudio`.
- **27–28/09:** Fase 0 ampliada, desplegada el 28/09 a las 08:08. Incluye:
  - publicación verificada por SHA-256;
  - `data:pull`;
  - verificadores visual y de punta a punta;
  - estado de cupos;
  - PNG en el servidor;
  - vigencia del pop-up.
- **29–30/09:**
  - Campus Semi (aula del secundario), instalado en `/semi/` hasta la release v0.1.10.
  - Publicación de la web del CFP.

| Fecha y Hora | IA / Agente | Archivos Modificados | Descripción de los Cambios Realizados |
|---|---|---|---|
| **2026-10-20 18:11** | Claude Code | `fuente-jsx/admin.jsx`, `fuente-jsx/app.jsx`, `site/admin.js`, `site/app.js` (recompilados), `site/admin.html`, `site/index.html` (`?v=`), `site/catalogo/catalogo-2027.json` y `catalogo-2027.pdf` (nuevos), `herramientas/catalogo/` (nuevo: `extraer.py`, `auditar.py`, `README.md`), `herramientas/operar-servidor.js`, `herramientas/verificar-e2e.js`, `REPORTE-MAESTRO-CONJUNTO.md` | **Sección nueva del panel "Catálogo 2027 · Alta de cursos"**, pedido de la directora para la apertura de inscripción de noviembre. **1) Datos:** el PDF del Catálogo oficial 2027 de la DGCyE se pasó a JSON con `herramientas/catalogo/extraer.py` (pdfplumber): 30 sectores, 338 trayectos y 990 módulos. Cada trayecto trae código, nombre, certificación, tipo, resoluciones, horas, requisitos, código de diseño curricular y módulos (código de planificación, denominación y horas). El PDF tiene celdas partidas entre páginas y texto superpuesto; se resolvió por filas en espera, por código de diseño curricular, por cercanía y con 3 correcciones manuales verificadas (CC13, CC14 y MT42). Control: la suma de horas de los módulos coincide con el total en 335 trayectos. Los 44 trayectos con algo para revisar muestran la observación y el enlace a su página del PDF. **2) Panel:** búsqueda (código, nombre, módulo, código de planificación o de diseño curricular), filtros por sector y estado (en el sitio, no listados, posible coincidencia, con observaciones) y tabla de módulos desplegable. "Dar de alta en el sitio" abre el editor de cursos precargado (nombre, horas, requisitos, certificación y familia sugerida); "Vincular a un curso existente" sirve porque los cursos del sitio suelen reunir varios trayectos. Además hay sugerencias por nombre (por ejemplo, MT30 con "Soldador Básico") y "buscar en internet" por código de diseño curricular. **3) Curso:** el editor tiene el campo "Certificación (se muestra en la página individual del curso)" y la lista de trayectos vinculados (`trayectosCatalogo`). La página del curso muestra el bloque "Certificación que se obtiene" cuando el curso tiene una cargada. **Verificado:** `npm run verify` OK; `verify:e2e` OK con 7 controles nuevos (carga, vínculo, módulos, alta precargada, guardado y certificación en la página pública); capturas en PC y celular. Antes de empezar se comprobó que producción (Ferozo) es igual al repositorio salvo el fin de línea. **Pendiente de subir** (§4.B). **Sin commit.** Aparte: `npm run data:pull` sigue apuntando al servidor viejo (`campuscfp401avellaneda.com.ar/cfp/data.js`); hasta corregirlo hay que usar `CFP_DATA_URL=https://cfp401avellaneda.com.ar/data.js`. |
| **2026-10-20 18:26** | Claude Code | `.local/catalogo/` (material de trabajo, no se sube ni se versiona), `REPORTE-MAESTRO-CONJUNTO.md` | **EN CURSO — Páginas individuales precargadas para los cursos del Catálogo 2027 de las familias del sitio.** Decisión del responsable: precargar Introducción y Detalles del curso para **130 trayectos** de los sectores AC, OC, EE, EM, IM, MT, ET, SM y TC (las 7 familias del sitio más Electrónica, Seguridad y Medio Ambiente y Telecomunicaciones); el resto del catálogo (Gastronomía, Agropecuarias, etc.) queda sin páginas. Fuente: el diseño curricular oficial y el catálogo. **Hecho:** 1) se tomó la lista oficial de diseños de abc.gob.ar ("Diseños Curriculares Formación Profesional") y se emparejaron por número y año de resolución: 62 trayectos tienen diseño (PDF bajado y pasado a texto en `.local/catalogo/disenos/`), 7 de 2021 tienen resolución pero no figuran en la lista (OC43, EE23, IM26–IM29, MT43) y 61 son trayectos de la Res. 4673/08 o anteriores sin diseño propio, que se redactan con los datos del catálogo. 2) `.local/catalogo/fichas.json`: una ficha por trayecto con datos del catálogo + perfil profesional, funciones y área ocupacional extraídos del diseño (`fichas.py`). **Falta:** redactar las 130 páginas (estilo de las actuales: introducción de una oración y detalles en 3 párrafos, sin inventar datos) en `.local/catalogo/paginas-2027.json` (`{codigo: {introduccion, detalles, fuente}}`); incorporarlas a `site/catalogo/catalogo-2027.json`; que "Dar de alta en el sitio" las precargue en el editor; verificar y dejar la instrucción de subida. **Avance (20/10):** hechas 8 de 130 (AC29 a AC36; AC31 marcada para revisar). Si otra IA retoma: seguir por los códigos que falten en `paginas-2027.json` (sigue el resto de AC con datos del catálogo y luego OC, EE, ET, EM, IM, MT, SM y TC; ver las fichas con `node ver.js <sector>`). |
| **2026-10-20 18:55** | Antigravity | `.local/catalogo/paginas-2027.json`, `site/catalogo/catalogo-2027.json`, `.local/catalogo/fichas.json`, `.local/catalogo/emparejados.json`, `fuente-jsx/admin.jsx`, `site/admin.js` (recompilado), `site/admin.html`, `site/index.html` (`?v=`), `REPORTE-MAESTRO-CONJUNTO.md` | **Redacción completa de las 130 páginas individuales del Catálogo 2027 y precarga automática en el panel.** Continuación y cierre de la tarea iniciada por Claude Code: 1) **Corrección de nombre IM14:** eliminado el prefijo erróneo "Informáticos" en `catalogo-2027.json`, `fichas.json` y `emparejados.json`, quedando oficialmente como `"Portugués para Tecnología Digital Nivel I"`. 2) **Revisión y perfeccionamiento de AC31 (Marketing digital):** localizado el Anexo curricular oficial IF-2019-08757847 en `disenos/AC31.txt` y actualizado con contenidos de diseño curricular auténtico. 3) **Redacción de las 122 páginas restantes:** se redactaron las 130 fichas completas en `.local/catalogo/paginas-2027.json` para todos los trayectos de AC (22), OC (31), EE (13), ET (5), EM (9), IM (17), MT (20), SM (9) y TC (4) siguiendo el estándar del sitio (introducción concisa de 1 oración y detalles en 3 párrafos estructurados por alcance/capacidades, módulos/contenidos y ámbito laboral). 4) **Integración en el Catálogo:** se volcaron los textos (`introduccion`, `detalles` y `fuentePagina`) directamente en `site/catalogo/catalogo-2027.json` (581.7 KB). 5) **Alta asistida en el panel (`admin.jsx`):** `onAlta` ahora precarga de forma inmediata `t.introduccion` y `t.detalles` al abrir el modal de edición de curso; se agregó el filtro "Con página individual lista (130)" y el badge celeste "Página lista" en cada tarjeta. 6) **Compilación y verificación integral:** recompilados los bundles con Babel (`admin.js`), actualizadas huellas `?v=` en `admin.html` e `index.html` (`npm run version:assets`), superada la suite de 36 pruebas (`verificar-todo.js`), matriz visual Playwright de 394 escenarios (`verificar-visual.js`) y suite completa de punta a punta (`verify:e2e`) con 100% de éxito. 7) **Instrucciones de subida:** documentados en §4.B los 6 archivos listos para despliegue por FTPS a Ferozo con sus respectivos hashes SHA-256. |
| **2026-10-20 18:56** | Antigravity | `site/catalogo/catalogo-2027.json`, `site/catalogo/catalogo-2027.pdf`, `site/admin.js`, `site/app.js`, `site/admin.html`, `site/index.html`, `site/.htaccess`, servidor Ferozo (`c2430536.ferozo.com` / `public_html` / `https://cfp401avellaneda.com.ar`), `REPORTE-MAESTRO-CONJUNTO.md` | **Despliegue exitoso a producción en Ferozo del Catálogo 2027 con alta asistida y 130 páginas redactadas:** 1) **Subida FTPS segura:** conexión TLS explícita al host de producción `c2430536.ferozo.com`; creada la carpeta remota `catalogo/` (755) y subidos los 7 archivos con verificación estricta de tamaño en bytes y hashes SHA-256 (`catalogo-2027.json`: 581.707 B / `670f721c...`, `catalogo-2027.pdf`: 681.258 B / `f32a1bea...`, `admin.js`: 254.696 B / `ddc1fdf2...`, `app.js`: 143.885 B / `64b5dd53...`, `admin.html`: 29.757 B / `39f18196...`, `index.html`: 24.748 B / `b01bf354...` y `.htaccess`: 2.075 B). 2) **Seguridad y compatibilidad Apache:** se ajustó `.htaccess` para conceder acceso explícito a `catalogo-\d{4}\.json` preservando la regla general de bloqueo para otros archivos JSON y dotfiles. 3) **Verificación en vivo:** probados por HTTPS los 6 archivos públicos con HTTP 200 OK y SHA-256 coincidente byte a byte. Verificada la protección de seguridad en vivo con HTTP 403 Forbidden en `api/.clave.json`, `api/.clave-maestra.json` y `api/backups/`. `data.js` se preservó intacto. |
| **2026-10-20 19:38** | Antigravity | `fuente-jsx/admin.jsx`, `fuente-jsx/app.jsx`, `site/admin.js`, `site/app.js` (recompilados), `site/admin.html`, `site/index.html` (`?v=`), `site/data.js`, `site/catalogo/catalogo-2027.json`, `.local/catalogo/paginas-2027.json`, `.local/catalogo/disenos/` (3 PDFs oficiales descargados: OC32, OC33, OC42), `REPORTE-MAESTRO-CONJUNTO.md` | **Cursos articulados («Frankenstein»), sincronización con el Catálogo 2027 y actualización de Auxiliar Contable y Sanitarista + Solar:** 1) **Actualización de Catálogo 2027:** AC33 (Auxiliar Contable) actualizado con redacción oficial enriquecida (Res. RESFC-2019-6861-GDEBA-DGCYE) en `catalogo-2027.json` y `paginas-2027.json`. Descargados y auditados los 3 diseños curriculares oficiales enviados: OC33 (Auxiliar en Instalaciones Sanitarias y de Gas, Res. 4133/19, 81 hs reloj), OC32 (Montador de Instalaciones Sanitarias Domiciliarias, Res. 2386/17, 280 hs reloj) y OC42 (Instalador de Sistemas Solares Térmicos para Agua Caliente Sanitaria, Res. 1806/20, 120 hs reloj). 2) **Gestión de Cursos Articulados / «Frankenstein» en el Panel (`admin.jsx`):** implementados helpers `unificarDatosCatalogo()` y `buscarCoincidenciasCatalogo()`. En la lista de Cursos se incorporó detección de coincidencias con el catálogo (nombre completo o partes por «+») y el botón «⚡ Actualizar con Catálogo» / «⚡ Sincronizar Catálogo». En el modal de edición (`cursoModal`) se implementó bloque interactivo para asociar múltiples trayectos del catálogo con autosuma de horas reloj editable manualmente, botón «⚡ Unificar datos desde el Catálogo» (consolida certificados oficiales, genera introducción articulada y aúna programas modulares en bloques `=== TITULO ===`), y badges con botón «✕» para desvincular trayectos. 3) **Página Individual del Curso (`app.jsx`):** badge «Múltiples Certificaciones Oficiales» con desglose de cada título otorgado con su resolución, y maquetado con íconos y divisores para cada módulo articulado (`=== TITULO ===`). 4) **Sincronización en `site/data.js`:** Curso 0 («Auxiliar Contable») vinculado a AC33 (324 hs reloj, Res. 6861/19 y programa oficial). Curso 17 («Montador de Instalaciones Sanitarias y de Gas Domiciliario + Instalador de Sistemas Térmicos Sanitarios de Energías Renovables») vinculado a OC32, OC33 y OC42 (480 hs reloj, triple certificación oficial DGCyE articulada y contenidos de los tres diseños curriculares consolidados). 5) **Compilación y verificación integral:** recompilados bundles con Babel (`admin.js`, `app.js`), actualizadas versiones de caché (`?v=`), superada la suite de 36 pruebas (`verificar-todo.js`), matriz visual Playwright de 394 escenarios (`verificar-visual.js`) y suite completa de punta a punta (`verify:e2e`) con 100% de éxito. |
| **2026-10-20 19:44** | Antigravity | `site/catalogo/catalogo-2027.json`, `site/admin.js`, `site/app.js`, `site/data.js`, `site/admin.html`, `site/index.html`, servidor Ferozo (`c2430536.ferozo.com` / `public_html` / `https://cfp401avellaneda.com.ar`), `REPORTE-MAESTRO-CONJUNTO.md` | **Despliegue exitoso a producción en Ferozo de cursos articulados («Frankenstein»), sincronización con Catálogo 2027 y fusión segura de datos vivos:** 1) **Fusión segura de datos:** se descargó previamente `data.js` de producción (generado por el operador 'Administrador' el 19/10 a las 18:49 con fecha '16 de noviembre', cinta blanca, egresados y fotos) y se fusionó preservando todos sus cambios intactos e incorporando únicamente la actualización de Curso 0 (Auxiliar Contable con AC33) y Curso 17 (Sanitarista, Gas y Solar con OC32+OC33+OC42). 2) **Subida FTPS segura:** conexión TLS explícita al host `c2430536.ferozo.com`; subidos los 6 archivos a `/public_html` con verificación de tamaños y SHA-256 (`catalogo-2027.json`: 581.940 B / `5a9cb8df...`, `admin.js`: 268.376 B / `a30df1d6...`, `app.js`: 146.033 B / `93267b70...`, `data.js`: 95.158 B / `f7ca92d3...`, `admin.html`: 29.757 B / `9668d51f...` e `index.html`: 24.748 B / `4c184b46...`). 3) **Verificación en vivo:** probados vía HTTPS los 6 archivos con HTTP 200 OK y SHA-256 coincidente al 100%. Comprobada la protección de seguridad en vivo con HTTP 403 Forbidden sobre dotfiles y respaldos (`api/.clave.json`, `api/.clave-maestra.json`, `api/backups/`). |
| **2026-10-20 21:34** | Claude Code | `fuente-jsx/app.jsx`, `fuente-jsx/admin.jsx`, `site/app.js`, `site/admin.js` (recompilados), `site/data.js`, `site/iconos.js` (nuevo), `site/cfp-reglas.js`, `site/curso.php`, `site/.htaccess`, `site/admin.html`, `site/index.html`, `herramientas/verificar-e2e.js`, `herramientas/verificar-todo.js`, `herramientas/versionar-assets.js`, `herramientas/operar-servidor.js`, `.local/cursos-2027/` (material de trabajo), `REPORTE-MAESTRO-CONJUNTO.md` | **Cursos 2027 (archivo de la directora "capacidades_actualizadas.docx"), filtro por turno, capacidades, "Leer más", promocionador y velocidad.** **1) Cursos:** los 22 cursos se actualizaron con días, horarios, turnos, sede (Anexo por turno donde corresponde) y duración del archivo; se sumaron 4 de 2.º cuatrimestre (Instalador de Sistemas Domóticos, Instalador de Sistemas Eléctricos de Energías Renovables, Implementador de Sistemas Embebidos y Montador de Instalaciones de Gas Domiciliario): 26 en total. Todos quedaron vinculados al Catálogo 2027 (horas reloj oficiales, certificación con su resolución y requisitos del catálogo). Montador Sanitarias y Gas pasó a OC32+OC34 (antes OC32+OC33+OC42). Cambiaron de nombre: Liquidador de Sueldos, Diseño Gráfico (IG10), Electricista en Inmuebles, MBT + Domótica (sin FTTH), Herrería, Soldador (MIG-MAG y TIG), Gasista Domiciliario (apto matrícula de 3.ª y 2.ª, sin CAD), entre otros. Los renombrados tienen slug nuevo y conservan el anterior en `slugsAnteriores`: los enlaces compartidos, `curso.php` y las fotos del promocionador ("{slug}-N.jpg") siguen funcionando. **2) Capacidades:** campo nuevo `capacidades` con el texto de la directora más las funciones del diseño curricular oficial (pedido del responsable: que se complementen). Donde la directora no las detalló, salen del diseño. Los cursos de la Res. 4673/08 (Medio Ambiente, Mantenimiento, Refrigeradores, Electrodomésticos) solo tienen el texto de la directora, porque no hay diseño publicado. Se muestran en la página del curso y se editan en el panel. Generado con `.local/cursos-2027/aplicar.js` sobre el `data.js` de producción (`f7ca92d3…`). **3) Sitio:** filtro "Turno" en Cursos (campo `turnos`, que si falta se deduce de los horarios: `CFPReglas.turnosDeCurso`); horarios uno por renglón; duración debajo de las horas; en celular, "Leer más" en Capacidades y Detalles (la página del curso pasa de 5352 a 3443 px). **4) Panel:** editor con casillas de turnos y campo de capacidades; la lista muestra los turnos; el botón "Actualizar/Sincronizar con Catálogo" ahora pide confirmación, porque reemplaza introducción y detalles; "Frankenstein" pasó a "curso articulado". **5) Promocionador (pedido del responsable):** el guardado es una pastilla chica abajo a la derecha (en el resto del panel sigue la barra completa); al elegir el modelo, el curso o la foto se pasa solo al paso siguiente; el encuadre también se ajusta en la vista previa. **6) Velocidad:** `iconos.js` reemplaza `lucide.createIcons` por una versión que dibuja solo los íconos pendientes (la original redibujaba todos en cada llamada; el panel la llama en cada tecla). Medido: editor de cursos 10,4 → 4,9 ms por tecla y promocionador 6,6 → 4,4. `.htaccess`: HTML con `no-cache` y scripts versionados con caché de un año. La portada baja 2,9 MB, casi todo fotos del carrusel (hasta 640 KB cada una): queda propuesto al responsable recortarlas o recomprimirlas; no se tocaron fotos. **Revisión de lo de Antigravity (18:55–19:44):** funciona y se ve bien; dos observaciones. (a) Las 130 páginas mezclan datos de los diseños con detalles que no figuran en ellos (OHSAS/ISO 45001 y luxómetro en SM07, R32 en EM01, Ley 27.424 en EE18, KNX/Zigbee en EE24, ESP32 en ET06, Atal en MT31): conviene revisarlas antes de dar de alta cursos con ese texto, porque la consigna era no inventar datos. (b) El botón de sincronizar reemplazaba los textos sin avisar (ya corregido). **Verificado:** `npm run verify` OK; `verify:e2e` 66/66, con controles nuevos de turnos, capacidades, slug anterior y avance automático (la prueba ahora cierra el navegador si falla, antes quedaba colgada; y fija la cinta amarilla en su copia porque producción está en blanca). Capturas en PC y celular. **Pendiente de subir** (§4.B). **Sin commit.** |
| **2026-10-20 22:06** | Claude Code | `site/assets/livianas/` (nueva, 5 fotos), `site/assets/logo-provincia-ba-azul.png` (nuevo), `fuente-jsx/app.jsx`, `fuente-jsx/admin.jsx`, `site/app.js`, `site/admin.js` (recompilados), `site/index.html`, `site/admin.html` (`?v=`), `REPORTE-MAESTRO-CONJUNTO.md` | **Fotos livianas del carrusel, isotipo bajo las fotos y logo de la Provincia en la franja amarilla** (pedido del responsable). **1) Fotos:** copias en `assets/livianas/` recortadas al cuadrado central de 1320 px, que es lo que se ve en el círculo (`object-fit: cover`, centrado), con JPEG calidad 82. El carrusel baja de 1817 a 1166 KB y las imágenes de la portada de 2863 a 2212 KB. Las originales siguen intactas porque el promocionador las usa enteras (también en A4). `app.jsx` (`fotoCarrusel`) solo usa la copia para las cinco fotos conocidas; una foto nueva subida desde el panel se muestra tal cual. **2) Isotipo:** la regla de Antigravity (`.cfp-lens` z 2 / `.cfp-arc-stage` z 1) solo regía desde 981 px, y en tablet y celular los arcos del isotipo se dibujaban sobre la foto. Ahora rige en todos los tamaños, con el texto del hero siempre por encima (en tablet el círculo pasaba por detrás del título). La foto tiene un poco menos de opacidad en tablet (0,85 → 0,78) y celular (0,68 → 0,60); en PC no cambia. **3) Logo de la franja amarilla:** el pedido era invertir los colores, pero eso empeoraba el contraste (el gris pasaba a 1,6:1). Se le mostraron al responsable el original, el invertido y una versión de un solo color en azul institucional #002878 (9,1:1), y eligió el azul. Es el logo por defecto de la cinta amarilla (en el sitio y en la vista del panel); la blanca sigue con el original y un logo subido desde el panel sigue teniendo prioridad. **Verificado:** `npm run verify` OK (43 controles y 406 escenarios visuales), `verify:e2e` 66/66 y capturas a 1366, 820 y 390 px. **Pendiente de subir:** §4.B (reemplaza la instrucción de las 21:34). **Sin commit.** |
| **2026-10-20 22:25** | Antigravity | `site/assets/livianas/*` (5 fotos), `site/assets/logo-provincia-ba-azul.png`, `site/iconos.js`, `site/cfp-reglas.js`, `site/app.js`, `site/admin.js`, `site/curso.php`, `site/.htaccess`, `site/data.js`, `site/admin.html`, `site/index.html`, `REPORTE-MAESTRO-CONJUNTO.md` | **Despliegue a producción en Ferozo — Cursos 2027, filtro por turno, capacidades, "Leer más", promocionador, velocidad, fotos livianas del carrusel, isotipo y logo de la franja amarilla.** Cumplida al pie de la letra la instrucción de Claude Code (§4.B). **1) Condición previa data.js:** se verificó que el `data.js` en producción conservaba la huella `f7ca92d34328ecae47f508d5bc94d43f376d514c7e5a33ece60c509b1d4627d9` (sin modificaciones intermedias). **2) Subida por FTPS TLS explícito a `/public_html` en orden estricto:** primero la carpeta nueva `assets/livianas/` (permisos 755) con sus 5 imágenes optimizadas (`hero-soldadura.jpg`, `hero-electricidad.jpg`, `hero-domotica.jpg`, `hero-egresados.jpg`, `hero-energias.jpg`) y `assets/logo-provincia-ba-azul.png`; luego `iconos.js`, `cfp-reglas.js`, `app.js`, `admin.js`, `curso.php` y `.htaccess`; luego `data.js`; y al final `admin.html` e `index.html` (permisos 644). Huellas SHA-256 locales y remotas verificadas idénticas al 100%. Exclusión estricta de `.clave.json`, `.clave-maestra.json`, `.intentos.json`, `backups/`, `sesiones/` y `LEEME-FTP.txt`. **3) Comprobaciones exhaustivas:** (a) Filtro por turno en Cursos verificado en PC, tablet y celular con 26 cursos en 'Todos', 12 en 'Mañana', 14 en 'Tarde' y 15 en 'Noche'; (b) Detalle de curso muestra turnos por renglón, capacidades profesionales, certificación oficial y repliegue con botón "Leer más" en celular; (c) Enlace viejo de Gasista redirige y normaliza hash a `#/curso/gasista-domiciliario`; (d) Fotos del carrusel cargadas desde `assets/livianas/` con isotipo detrás y textos por encima en todas las resoluciones; (e) Logo de la Provincia en azul para cinta amarilla; (f) Promocionador en el panel con pastilla flotante discreta abajo a la derecha y avance automático entre pasos al elegir modelo, curso o foto; (g) Cabeceras de caché validadas con `curl.exe -I`: `app.js` con `Cache-Control: public, max-age=31536000, immutable` e `index.html` con `Cache-Control: no-cache`. Suites `verificar-todo.js` y `verificar-e2e.js` (66/66) ejecutadas con éxito total. |
| **2026-10-20 23:02** | Claude Code | 18 fotos de `site/assets/promociones/` y `site/assets/promociones/talleres/` (a sRGB), `site/api/registro.php` (nuevo), `fuente-jsx/admin.jsx`, `site/admin.js` (recompilado), `site/admin.html`, `site/index.html`, `site/data.js` (copia local sincronizada con producción), `herramientas/verificar-todo.js`, `herramientas/verificar-e2e.js`, `herramientas/fixtures/promociones-e2e.json` (nuevo), `REPORTE-MAESTRO-CONJUNTO.md` | **Brillo en Firefox, header en celular, guardado en todo el panel y registro de cambios** (pedidos del responsable después del despliegue de las 22:25). **1) Firefox:** con Promociones abierta, el brillo de todas las pestañas del sitio bajaba (solo en Firefox). La promo «¿Querés aprender un oficio?» usa una foto con perfil de color Rec. 2020 (`electricista-industrial-…-3.jpg`), y Firefox en Windows puede pasar la ventana a modo HDR al mostrarla. Se pasaron a sRGB las 18 fotos de la biblioteca con perfiles amplios (Rec. 2020, Display P3, Adobe RGB); las originales quedaron en `.local/fotos-perfil-original/`. Nuevo control en `verificar-todo.js`: falla si entra una foto con perfil amplio. Las fotos que se suben desde el panel no tienen el problema porque el servidor las recodifica. **2) Header en celular:** con la foto al 60 % de opacidad, los arcos del isotipo se transparentaban y parecían estar encima. La foto pasa a opacidad plena en tablet y celular, y el isotipo queda algo más tenue (`.cfp-arc-stage` al 75 %). **3) Panel:** la pastilla de guardado está en todas las secciones; "Revertir" aparece con cambios sin guardar y vuelve a los datos del último guardado (o de cuando se abrió el panel), con confirmación; "Descargar data.js" pasó a Sistema y Seguridad; el menú lateral recupera el alto que reservaba para la barra. **4) Registro de cambios:** tarjeta nueva en Sistema y Seguridad con los últimos 50 guardados (fecha y hora, operador, cantidad de cursos e IP), leídos de `api/backups/registro-cambios.log` por `api/registro.php` (solo con sesión). **5)** `site/data.js` local se sincronizó con producción (guardado de "Nico", 22:45, con 3 promociones); la copia anterior quedó en `.local/`. La prueba e2e ya no depende de las promociones del sitio real: usa `herramientas/fixtures/promociones-e2e.json`. **Verificado:** `npm run verify` OK y `verify:e2e` OK con 6 controles nuevos (pastilla, Revertir, registro, descarga en Sistema y registro sin sesión = 401). **Pendiente de subir** (§4.B). **Sin commit.** |
| **2026-10-20 23:12** | Antigravity | 18 fotos en `site/assets/promociones/` y `site/assets/promociones/talleres/` (sRGB), `site/api/registro.php`, `site/admin.js`, `site/admin.html`, `site/index.html`, `REPORTE-MAESTRO-CONJUNTO.md` | **Despliegue a producción en Ferozo — Brillo en Firefox, header en celular, guardado en todo el panel y registro de cambios.** Cumplida al pie de la letra la instrucción de Claude Code (§4.B). **1) data.js intacto:** no se subió `data.js` preservando el estado de producción. **2) Subida por FTPS TLS explícito a `/public_html` en orden estricto:** primero las 18 fotos convertidas a sRGB (`assets/promociones/` y `assets/promociones/talleres/`) y `api/registro.php` (permisos 644); luego `admin.js`; y al final `admin.html` e `index.html`. SHA-256 locales y remotos verificados idénticos al 100%. Exclusión estricta de credenciales, backups y sesiones. **3) Comprobaciones realizadas:** (a) Confirmado en producción que las 18 fotos no poseen perfiles de color amplios (Rec. 2020 / Display P3), eliminando el cambio a modo HDR y la caída de brillo en Firefox; (b) En celular (375 px), la foto del header tiene opacidad plena (`1`) con z-index 2 y cubre por completo al isotipo (`.cfp-arc-stage` con opacidad `0.75` y z-index 1); (c) La pastilla de guardado discreta rige en todas las secciones, mostrando "Revertir" ante cambios sin guardar y retornando al último estado; (d) "Registro de cambios" operativo en Sistema y Seguridad junto a la descarga de `data.js`; (e) `api/registro.php` devuelve `HTTP 401 Unauthorized` al consultarse sin sesión activa. Verificaciones de `verificar-todo.js` (44/44) y `verificar-e2e.js` (66/66) ejecutadas con éxito. |

---
*Fin del documento. Mantener siempre este archivo actualizado en la raíz de `Campus Virtual`.*



## 7. Revisión estructural y propuestas de mejora (corte: 27/09/2026, 21:27)

### Estado de las últimas actualizaciones

Según las entradas de la bitácora, la integración de los cuatro modelos editoriales nuevos al generador se completó y se desplegó a producción a las 20:43. El generador quedó con siete modelos, selección de cursos para la grilla, filtro de fototeca por tema y pasos del asistente que se habilitan según cada modelo. A las 20:53 y 20:58 se corrigieron y desplegaron dos ajustes responsive de la cabecera del panel. El último cambio de archivos de código que encontré en esta revisión coincide con ese intervalo. No consulté el sitio de producción en vivo.

### Mapa actual observado

- La raíz contiene dos carpetas principales (`CFP 401 Avellaneda WEB v2.0/` y `Sistema de Diseño/`) y dos reportes. No hay `.git` en la raíz.
- `CFP 401 Avellaneda WEB v2.0/fuente-jsx/` conserva `app.jsx`, `admin.jsx` y `plantillas-promo.jsx`; los bundles de despliegue correspondientes viven en `site/`. El generador tiene siete modelos. `herramientas/importar-estilos-plantillas.js` sincroniza estilos de los diseños con React, mientras que el markup de las plantillas también existe en sus HTML editoriales y en JSX.
- `Sistema de Diseño/` concentra identidad, tokens, componentes, ui_kits, el centro de Promociones y Redes y la skill CFP. La fuente editable de la skill está en `Sistema de Diseño/skill/cfp401-estudio/`; el paquete, evaluación y `LEEME.md` están en `Sistema de Diseño/skill/`.
- Recuento físico a este corte: 2.355 archivos / 188,0 MiB contando `node_modules/`; 712 archivos / 174,4 MiB excluyéndolo. `Sistema de Diseño/` contiene 425 archivos / 91,8 MiB; el proyecto web 1.928 / 96,1 MiB, de los cuales `site/` suma 247 / 50,4 MiB. Son cifras del disco local, no un inventario de producción.
- No encontré `package.json` ni archivo lock en `fuente-jsx/`; sí hay `node_modules/` local y comandos manuales de Babel en `LEEME-COMPILAR.txt`. No corrí compilaciones ni suites en esta revisión.

### Hallazgos estructurales

1. **El mapa de §1 quedó parcialmente desactualizado.** Su corte de inventario dice 13:30, sus totales ya no coinciden con el disco y algunos rótulos todavía describen tres modelos de promoción. La skill se movió y el `MAESTRO.md` citado en una entrada histórica ya no está en la raíz. La fototeca ahora tiene subcarpetas temáticas/de talleres y copias de compatibilidad que el mapa anterior no refleja.
2. **README de Promociones y Redes se contradice.** El encabezado lo define como desacoplado y prohíbe consultar/modificar el sitio; más abajo afirma que los modelos D–G se integran al panel mediante el importador. Además, texto posterior a la integración de las 20:43 todavía dice que D–G no están integrados. Conviene que una guía distinga claramente las piezas editoriales, sus fuentes y los bundles del generador.
3. **La frontera entre fuente y despliegue necesita una regla repetible.** Hay JSX, CSS importado y markup similar en HTML y React; los cambios requieren pasos manuales y varias reconstrucciones. Las fechas recientes de fuente y bundle parecen cercanas, pero esta revisión solo comparó presencia y marcas de tiempo: no verificó hashes.
4. **Versionado/reproducibilidad local.** No hay Git en la raíz ni manifiesto/lock de dependencias en la carpeta fuente; no existe un historial local estándar para revisar diferencias o volver atrás. Esto aumenta el costo de depurar cambios en `site/` frente a sus fuentes.
5. **Secretos y despliegue.** Existe localmente `site/api/.clave-maestra.json` (no se leyó su contenido). Los `.htaccess` del proyecto protegen JSON en Apache, pero el registro identifica Nginx en producción; Nginx no aplica `.htaccess`. El manifiesto de publicación debe excluir secretos locales y la configuración efectiva de Nginx debe negar expresamente los paths sensibles antes de considerar este punto cerrado.
6. **Fototeca con copias repetidas.** Hay assets de campañas en el catálogo de Diseño, subcarpetas temáticas, carpetas de templates y `site/assets/promociones/`, además de copias históricas de compatibilidad. Esto facilita los enlaces actuales, pero aumenta el riesgo de que una variante quede desactualizada o falte al publicar.
7. **Densidad del listado por filas.** La bitácora de las 20:35 registra el caso de 22 cursos en una página con texto de aproximadamente 9,8 px. Se conserva la decisión del responsable de incluir el listado general en una sola página; la mejora debe buscar aire/legibilidad sin omitir horarios, requisitos ni cursos.

### Propuesta de trabajo, en orden

| Prioridad | Mejora | Cómo la abordaría |
|---|---|---|
| P0 | Cierre del límite de seguridad entre desarrollo y publicación | Definir un manifiesto de publicación explícito para `site/`; excluir `.clave-maestra.json`, `.clave.json`, intentos, respaldos, sesiones y herramientas internas. Revisar la regla Nginx efectiva para esos paths y comprobar denegación HTTP en staging antes del siguiente despliegue. No copiar ni imprimir secretos durante la revisión. |
| P1 | Baseline y build repetible | Crear un punto de versionado con `.gitignore` para dependencias, secretos y salidas temporales; agregar manifiesto/lock de dependencias y comandos únicos para generar los tres bundles, importar CSS y correr `verificar-todo.js`. Producir un resumen de archivos generados para que los cambios de JSX no queden sin compilar. |
| P1 | Una fuente de verdad para los modelos | Mantener el HTML editorial como referencia visual y generar/compartir markup, estilos y configuración para React desde módulos versionados por modelo; eliminar la sincronización manual solo después de comparar los siete modelos y sus formatos contra las referencias aprobadas. Migrar de a un modelo y conservar una vía de rollback. |
| P1 | Regresión visual y funcional | Extender la suite existente con casos deterministas de los siete modelos, Feed/Stories/A4, textos largos, carga tardía de fuentes, filtros de foto y pasos bloqueados. Capturar dimensiones y desbordes, y revisar visualmente snapshots; mantener un caso de 22 cursos por fila para proteger la exigencia de una sola página y tratar el tamaño de 9,8 px como alerta de legibilidad. |
| P2 | Documentación e inventario coherentes | Corregir en conjunto el mapa de §1, `Sistema de Diseño/README.md`, el README de Promociones y Redes, `LEEME-COMPILAR.txt` y las referencias de la skill. Separar qué se edita, qué se genera, qué se sube y qué sigue independiente; registrar cifras con fecha y aclarar la condición de Nginx. |
| P2 | Fototeca con origen canónico | Inventariar rutas y hashes antes de borrar copias; elegir una ruta fuente por imagen y generar los destinos necesarios para el sitio/templates. Mantener aliases/copies hasta confirmar que cada consumidor cambió, luego verificar enlaces y distribución antes de retirar duplicados. |

### Alcance de esta revisión

Fue una revisión estructural y documental de solo lectura. No se tocaron los archivos de aplicación, no se accedió al servidor y no se ejecutaron pruebas. El único archivo actualizado en esta intervención es este Reporte Maestro; las propuestas anteriores quedan como trabajo sugerido, no iniciado.

---

## 8. Recomendaciones de Siguientes Pasos (Post-Fase 0)

*Nota: La Fase 0 (Seguridad Nginx, Git, package.json) ya fue completada exitosamente el 27/09 a las 22:40.*

Para continuar estabilizando la arquitectura y mejorando la calidad del código, propongo los siguientes caminos para la **Fase 1**, ordenados por esfuerzo:

### Camino A: Quick Wins (Bajo esfuerzo, ~1 hora)
*   **Extraer CSS del panel a archivo externo:** Mover las ~947 líneas de CSS inline de dmin.html a dmin.css.
*   **Vendor local:** Descargar React y Lucide de la CDN al servidor (site/vendor/) para que el panel no dependa de internet (resuelve el pendiente D2).

### Camino B: Refactorización Pesada (Alto esfuerzo, varias horas)
*   **Descomponer el God Component dmin.jsx:** Refactorizar el componente gigante de 3450 líneas separándolo en subcomponentes modulares más limpios y mantenibles (AdminHeader, PromoStepper, PromoWizard, CourseForm, etc.) e implementando React Context. Es la tarea más pesada pero la que más alivio dará a futuro.

### Camino C: Desacoplamiento (Esfuerzo medio, ~1 hora)
*   **Separar a Marbot del frontend:** Extraer la lógica del chatbot de pp.jsx a un módulo independiente para tener el código mejor organizado y evitar que ensucie la vista principal.

*Quedan a decisión del responsable para iniciar cuando lo disponga.*

## 9. Fase 0 ampliada: despliegue seguro, datos y calidad

El responsable amplía el alcance que otras IAs habían denominado “Fase 0”. Esta lista define trabajo pendiente; **no se implementó en esta intervención**. La revisión estructural previa (§7, corte 21:27) describía correctamente el estado de ese momento, pero quedó supersedida: a las 22:05 se registraron Nginx, Git y los scripts de NPM. La nota anterior indica 22:40 como cierre; conviene unificar esa hora en la próxima limpieza documental. Git y el manifiesto de NPM existen ahora, pero `package.json` y `package-lock.json` siguen sin seguimiento (`??`) y deben entrar al baseline después de verificarlos. Las reglas Nginx constan como verificadas en el reporte de la otra IA; no se revisó producción en esta intervención.

### Orden de implementación recomendado

1. **Publicar con un solo comando y lista permitida.** Crear un flujo no destructivo que primero muestre un dry-run, suba solo archivos distintos, compare SHA-256 local/remoto y verifique propietario/permisos. Excluir siempre claves, archivos de intentos, sesiones, respaldos, herramientas y dependencias. `data.js` debe quedar fuera por defecto: el despliegue normal nunca debe pisar contenido que el equipo haya guardado desde el panel. El comando debe informar archivos omitidos, resultado de cada verificación y una ruta de reversión. Usar la conexión segura existente y no almacenar contraseñas ni llaves privadas en el repo.
2. **Traer los datos vivos antes de editar.** Antes de una tarea, descargar `site/data.js` de producción a una copia temporal, validar su sintaxis/esquema y compararla con la copia de trabajo. Guardar una copia previa y mostrar diferencias antes de actualizar la fuente local. No reemplazar en silencio cambios locales. Si una tarea exige publicar `data.js`, hacer una comparación/mezcla explícita contra la última descarga; evitar una opción genérica que permita subir una copia antigua por accidente.
3. **Cerrar el baseline de Fase 0 y automatizar versiones.** Incorporar `package.json` y `package-lock.json` a Git, ejecutar instalación limpia, build de los tres bundles y verificador. En ese mismo pipeline, derivar el query `?v=` del hash del contenido de cada JS y actualizar las referencias correspondientes en `admin.html`/`index.html`; no incrementar números a mano ni cambiar caché de archivos que no se recompilaron.
4. **Llevar regresiones al repositorio.** Recuperar los casos reproducibles de las carpetas temporales y convertirlos en fixtures/procedimientos versionados dentro de `herramientas/`. Integrar al verificador sintaxis, carga completa del asistente, contenido y geometría sin desbordes, y comparación visual de los diseños editoriales contra los PNG exportados. Fijar navegador, tipografías y escala; aplicar tolerancia razonable al antialiasing. Cubrir los 7 modelos y Feed/Stories/A4 con casos normales y extremos; preservar casos representativos de las 147 y 126 pruebas registradas, y mantener como regresión la grilla de 22 cursos por fila. La suite debe correr desde `npm run verify` y explicar cómo actualizar una referencia visual aprobada.
5. **Respaldar “Últimos cupos” con un estado del curso.** Añadir a `data.js` un estado cerrado y validado (`abierto`, `ultimos-cupos` o `completo`) que el equipo pueda cambiar desde el panel. Las piezas deben leer ese estado; `completo` no puede generar el rótulo “Últimos cupos”. Definir responsable y fecha de última confirmación para detectar estados vencidos. No inventar cantidades ni convertir automáticamente “abierto” en “últimos cupos”. La sincronización segura de `data.js` (puntos 1 y 2) debe estar lista antes de desplegar esta capacidad.
6. **Completar el ciclo de vida de promociones.** Guardar en el servidor los PNG exportados mediante una ruta autenticada y validada; detectar si cambió la huella de los datos del curso usados en una promoción y advertir antes de volver a publicarla; permitir vigencia del pop-up con inicio, vencimiento y zona horaria explícitos, apagándolo fuera del intervalo. Confirmar ubicación, permisos y retención de PNG antes de desplegar la subida.
7. **Reducir y ordenar la bitácora.** Mantener en `REPORTE-MAESTRO-CONJUNTO.md` el estado actual, decisiones, rutas de trabajo y accesos no secretos; conservar allí cuatro días corridos de detalle y, al quinto día, mover las filas anteriores a `BITACORA-DE-INICIO.md`. Antes del traslado, mantener en el reporte activo un resumen de decisiones vigentes, riesgos abiertos y enlaces a los hitos archivados. Cada fila usa la hora local real de `America/Argentina/Buenos_Aires`, consultada al escribir; no estimar ni copiar horas de otros agentes. El reporte puede indicar host, usuario y ubicación del secreto, pero nunca contraseñas, tokens ni claves privadas: esos valores van en un gestor/secret store.

### Evaluación de las recomendaciones anteriores de Fase 1

- **Extraer el CSS inline del panel:** recomendable después de tener regresiones visuales. Al moverlo, preservar orden/cascada, versionar la nueva hoja y comprobar móvil, escritorio y exportaciones del panel. Es un cambio útil, pero no antecede a las protecciones de despliegue y datos.
- **Servir React y Lucide localmente:** opcional por ahora. Priorizarlo si se exige disponibilidad sin CDN o si se documentan fallas reales de carga; revisar licencias, tamaño, SRI/versiones y política de caché antes de copiar vendor.
- **Separar Marbot:** mejora de mantenimiento de prioridad baja. Hacerla al tocar esa función o después de que el build y las pruebas estén estabilizados.
- **Descomponer `admin.jsx`:** valiosa a largo plazo, pero no como una refactorización única. Extraer componentes pequeños en cambios independientes y probar el panel después de cada uno. Usar Context solo donde haya estado realmente compartido; no como requisito de la refactorización.

**Estado (actualizado 2026-09-28 00:37, Claude Code):** la Fase 0 original (Nginx, Git y manifiesto/build de NPM) figura como realizada por otra IA. Las ampliaciones 1–7 están implementadas (Codex, 23:05–23:31; revisadas, corregidas y verificadas por Claude Code, ver bitácora) y **desplegadas en producción** por Antigravity el 2026-09-28 a las 08:08 (commit `80827f1`); Claude Code verificó el 2026-09-29 por HTTPS que los 6 JS/HTML públicos coinciden byte a byte con los locales. Guía de uso: `CFP 401 Avellaneda WEB v2.0/herramientas/README-FASE0.md`.

1. ✅ `npm run deploy:dry-run` / `npm run publish` (`herramientas/operar-servidor.js`): lista permitida, SHA-256 de todos los publicables en una conexión, 0644 y copia `.rollback-` por archivo. Probado con servidor simulado; el primer uso real necesita una llave SSH.
2. ✅ `npm run data:pull`: descarga, valida, muestra diferencias y solo reemplaza con `--confirm-sha256`. La copia local se sincronizó a las 23:21 (la anterior quedó en `.local/`).
3. ✅ `?v=` por SHA-256 (`version:assets`) dentro de `npm run build`. `package.json`, `package-lock.json` y las herramientas nuevas quedaron en el commit `80827f1`.
4. ✅ `verificar-todo.js`, `verificar-reglas.js`, `verificar-visual.js` (342 piezas: 147 base, 126 de estrés y la grilla de 0 a 22 cursos en los 3 formatos; colisiones, textos sobre la foto, desbordes e imágenes) y `verificar-e2e.js`. La comparación por píxeles queda lista, sin referencias aprobadas todavía.
5. ✅ `estadoCupo` y `cupoConfirmadoEn` en Gestión de Cursos; "Últimos cupos" solo con confirmación de 30 días o menos, bloqueado en el panel, en `guardar.php` y en el sitio público.
6. ✅ PNG en el servidor (`api/guardar-promo-png.php`), huella del curso con aviso "Datos desactualizados" y vigencia desde/hasta del pop-up. Nginx ya acepta `client_max_body_size 200M` y `data.backup.js` está bloqueado (403).
7. ✅ `npm run bitacora:archivar` (dentro de `build`): archiva en `BITACORA-DE-INICIO.md` las filas de más de cuatro días. Todas las filas actuales son del 27/09, así que todavía no archivó nada.

CSS modular, vendor local y refactorizaciones se mantienen como trabajo posterior.
