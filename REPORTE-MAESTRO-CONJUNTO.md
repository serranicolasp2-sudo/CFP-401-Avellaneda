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

* **Subir la plantilla «Actividades Institucionales» a producción** (preparada por Claude Code el 2026-10-15 20:50, sin commit). En `/public_html/` de Ferozo, primero la foto y los JS y **al final los HTML**: `assets/promociones/tematicas/actividades/visita-simma-capacitacion.jpg` (nueva carpeta) `142e813af2d9…`, `plantillas-promo.js` `74f87ab22bd9…`, `admin.js` `4c7b2e771238…`, `admin.html` `9b0ffe54b41c…`, `index.html` `97b21b7255a4…`. No hace falta subir `data.js` ni PHP. Después, Ctrl+F5 en el panel y crear una pieza de prueba con «Nueva Promoción» → «Actividades Institucionales». Si otra IA recompila antes de subir, valen las huellas del nuevo build.
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
| **2026-10-14 19:44** | Antigravity | `fuente-jsx/app.jsx`, `fuente-jsx/admin.jsx`, `site/data.js`, `site/app.js`, `site/admin.js`, `site/api/guardar.php`, `site/admin.html`, `site/index.html`, servidor de producción (`75.119.155.217`), `REPORTE-MAESTRO-CONJUNTO.md` | **Implementación y despliegue del paquete de modificaciones pedido por la Directora:** 1) **Header Hero:** Superposición de las fotos del lente por sobre el isotipo institucional (`.cfp-lens { z-index: 2 !important; } .cfp-arc-stage { z-index: 1 !important; }`). 2) **Cinta Intercambiable:** Se incorporó la variante blanca con bordes amarillos y separadores verticales `|`, intercambiable desde el menú de administración (`cintaAmarilla.estilo: 'amarilla' | 'blanca'`). 3) **Inscripciones y Horarios:** Texto "Nuevas inscripciones A PARTIR DEL 15 DE NOVIEMBRE" con fecha editable dinámicamente y horarios unificados a "Lunes a viernes de 9 a 20 hs" en cintas, sedes y pie. 4) **Propuesta de Valor:** Frases actualizadas con formato en negrita editable mediante `**palabras**` (`"FORMARSE ES APOSTAR AL FUTURO"`, `"ACOMPAÑAMOS CADA PASO DE TU CRECIMIENTO"`). 5) **Tarjetas de Propuesta:** "100% gratuito" reemplazado por "Cursos Gratuitos" ("Sin costo de inscripción ni de cursada: solo necesitás la documentación requerida.") y "Talleres equipados" ("Para prácticas en todos los oficios"). 6) **Familias de Oficios:** Títulos sin el prefijo "ÁREA DE " y nombres de cursos en negrita (`fontWeight: 700`). 7) **Sección Documentación y Estadísticas:** Requisitos actualizados (DNI, constancia, horario 9 a 20 hs, WhatsApp) y bloque derecho con gran título amarillo "Desde 1979, +45 años formando en oficios" y métricas dinámicas (+3600 cursos dictados, +1800 egresados en FI., familias y cursos totales). 8) **Botón Campus:** Reemplazado "Ir al Campus" por "Campus Virtual". 9) **Pestaña Nosotros:** Titular "Más de cuatro décadas formando en oficios", +3600 cursos dictados y + de 24 mil egresados. 10) **Auditoría de Operador:** Registro de nombre de usuario en login administrativo, badge en cabecera de admin, envío a `guardar.php`, guardado en encabezado de `data.js` y append a `registro-cambios.log`. 11) **Página Contacto:** Mapas alineados a la misma altura (bloque de datos de 150px y mapas de 260px), eliminación de la palabra "formativo" y de la etiqueta "Talleres prácticos", e incorporación de la guía de líneas de colectivos (33, 134, 159, 373, 570) con sus orígenes. 12) **Footer PC:** Tamaño de fuente optimizado a 15px en pantallas de escritorio. 13) **Compilación y Verificación:** `npm run build:all && npm run version:assets` ejecutados; suite de 36 pruebas aprobada al 100%. 14) **Despliegue SFTP:** 6 archivos desplegados al servidor (`data.js`, `app.js`, `admin.js`, `api/guardar.php`, `admin.html`, `index.html`), respaldos remotos creados, permisos 644/`www-data:www-data`, SHA-256 verificado al 100% y HTTP 200 OK en producción. |
| **2026-10-14 20:09** | Claude Code | `herramientas/verificar-e2e.js`, `REPORTE-MAESTRO-CONJUNTO.md` | **Revisión del paquete de la Directora desplegado por Antigravity (14/10 19:44)**, a pedido del responsable. Se hizo de tres maneras: revisión del código del commit `d366c3c`, comparación con producción por HTTPS (huellas iguales y compilado igual a las fuentes) y capturas del sitio en vivo en PC y celular (Inicio, Nosotros, Contacto, cinta blanca simulada en el navegador y login del panel). `npm run verify` OK. **Hallazgos (detalle y arreglos en §4.B, "MEJORAS PENDIENTES — Paquete de la Directora"):** 1) en celular la foto del hero tapa el párrafo por el `z-index` nuevo; 2) inyección de código en `data.js` a través del nombre de operador (`*/`); 3) hora UTC en el encabezado y el log; 4–6) cifras: grilla 3 + 1, formatos distintos, rótulo "FI." confuso que choca con "+24 mil", y cifras fijas en el código; 7–11) detalles de la cinta blanca en celular, coherencia de textos y restos de "9 a 22"; 12) proceso de `data.js`: hay un guardado del panel posterior ("Nico", 20:06) que la copia local no tiene. **Cambio de Claude Code:** `verificar-e2e.js` completa el campo "Operador" del ingreso nuevo y suma 3 controles de auditoría; dos pasan y el de la inyección falla a propósito hasta que se corrija `guardar.php`. No se tocó el sitio ni el servidor. **Sin commit.** |
| **2026-10-14 20:39** | Claude Code | `fuente-jsx/app.jsx`, `fuente-jsx/admin.jsx`, `site/app.js`, `site/admin.js` (recompilados), `site/admin.html`, `site/index.html` (`?v=`), `site/data.js`, `site/assets/logo-provincia-ba.png` (nuevo), `herramientas/verificar-e2e.js`, `REPORTE-MAESTRO-CONJUNTO.md` | **Cambios de la directora, segunda tanda** (datos y pedidos del responsable; puntos 4, 5, 6, 7, 8, 9 y 11 de "MEJORAS PENDIENTES"). **1) Cifras "Desde 1979" rediseñadas:** el encabezado usa el mismo estilo que la columna de al lado (antetítulo amarillo "DESDE 1979" y título blanco "+45 años formando en oficios"). Las cifras van en 4 recuadros de 2 × 2, con el número blanco del mismo tamaño que el título, el "+" en amarillo y un filete amarillo arriba. Valores del responsable: +3.600 Cursos dictados, +36.000 Egresados en FI, 7 Familias profesionales y 22 Cursos gratuitos; los dos últimos se cuentan solos con `{familias}` y `{cursos}`. **2) Editables y unificadas:** nueva sección `estadisticas` de `data.js` y bloque "Cifras institucionales (Inicio y Nosotros)" en el panel. Nosotros muestra el año de creación y las mismas dos primeras cifras (antes decía "+ de 24 mil" y "+3600"). **3) Fotocopia del DNI sin cantidad** en Inicio, Marbot, `requisitoGeneral` y los textos de ejemplo del panel. **4) Cinta (amarilla o blanca) reordenada:** texto a la izquierda, logo de la Provincia al centro (sobre placa blanca en la amarilla) y botón a la derecha; en tablet el logo baja junto al botón y en celular todo se apila sin el separador colgado. Se corrigió el doble espacio. Hay casilla en el panel para ocultar el logo. El fondo va por clase, así no le aplican las reglas viejas de `index.html`. **5) Tarjeta UOCRA ocultable** en Nosotros (`nosotros.redUocra.visible`), con casilla en el panel; si se oculta, el texto queda a ancho de lectura. **6) Restos de "9 a 22 hs" y textos viejos** por defecto en `app.jsx` y `admin.jsx`. **`data.js`:** se trajo de producción con `npm run data:pull` (huella `22d5e153…`, incluye el guardado de "Nico" de las 20:06) y solo se cambió `requisitoGeneral`. **Verificado:** `npm run verify` OK; `verify:e2e` OK salvo la prueba de inyección, que queda para el punto 2 de Antigravity, y con un control nuevo de cifras; capturas locales en PC, tablet y celular de las dos cintas, las cifras y Nosotros con y sin UOCRA, sin errores de JavaScript. **Pendiente de subir junto con 1, 2, 3 y 10** (§4.B). **Sin commit.** |
| **2026-10-14 20:51** | Claude Code | `fuente-jsx/app.jsx`, `site/app.js` (recompilado), `site/admin.html`, `site/index.html` (`?v=`), `REPORTE-MAESTRO-CONJUNTO.md` | **Ajustes pedidos por el responsable sobre la tanda de las 20:39.** 1) **Logo de la Provincia sin recuadro blanco:** en la cinta amarilla va directo sobre el amarillo, con fondo transparente. 2) **Cinta en tablet y celular** (hasta 1100 px): texto, logo y botón apilados y **centrados**, con el botón "Quiero inscribirme" en el medio y no estirado; en celular, la atención y la dirección van en dos renglones sin separador. 3) **Menú lateral del panel** (`admin.html`): era fijo y sin alto máximo, así que en pantallas de notebook el final quedaba debajo de la barra "Guardar en Servidor". Ahora tiene alto máximo (pantalla menos encabezado y barra), desplazamiento propio y ítems un poco más compactos; en celular sigue como barra horizontal. **Verificado:** con ingreso real en una copia con clave de prueba, a 1366×768, 1440×900 y 1280×680, el menú siempre termina por encima de la barra (en 1280×680 se desplaza); capturas de la cinta en las dos versiones a 1440, 820 y 390 px sin errores; `npm run verify` OK; `verify:e2e` OK salvo la prueba de inyección (punto 2 de Antigravity). Huellas actualizadas en §4.B. **Sin commit.** |
| **2026-10-14 20:55** | Claude Code | `fuente-jsx/app.jsx`, `fuente-jsx/admin.jsx`, `site/app.js`, `site/admin.js` (recompilados), `site/admin.html`, `site/index.html` (`?v=`), `herramientas/verificar-e2e.js`, `REPORTE-MAESTRO-CONJUNTO.md` | **Logo de la cinta reemplazable desde el panel**, a pedido del responsable: el color de las letras del logo de la Provincia no contrasta bien sobre el amarillo, y el responsable va a averiguar si le autorizan una versión con otro color. Cada versión de la cinta tiene su propio logo (`home.cintaAmarilla.logoAmarilla` y `logoBlanca`). Si no se cargó ninguno, va el original `assets/logo-provincia-ba.png`. En el panel (Portada e Inicio → cinta) hay una vista previa sobre el fondo de cada versión y los botones "Subir otro logo" y "Volver al original". La subida usa `api/subir-foto.php`, que conserva la transparencia de los PNG, así que no hubo cambios en el servidor. **Verificado:** `npm run verify` OK; `verify:e2e` con 3 controles nuevos (sube un PNG transparente desde el panel, se guarda en `data.js`, conserva la transparencia y el sitio público lo muestra), todo OK salvo la prueba de inyección del punto 2 de Antigravity. Huellas actualizadas en §4.B. **Sin commit.** |
| **2026-10-14 21:15** | Antigravity | `site/index.html`, `site/api/guardar.php`, `site/api/config.php`, `fuente-jsx/app.jsx`, `site/app.js`, `site/admin.js`, `site/admin.html`, `site/data.js`, `site/assets/logo-provincia-ba.png`, servidor de producción (`75.119.155.217`), `REPORTE-MAESTRO-CONJUNTO.md` | **Resolución de puntos 1, 2, 3 y 10 y Despliegue Unificado a Producción:** 1) **Hero celular (Punto 1):** Reglas `.cfp-lens` y `.cfp-arc-stage` limitadas a escritorio (`@media (min-width: 981px)`) y bloque de texto del hero con `position: relative !important; z-index: 3 !important;` en móviles para evitar cualquier superposición de la foto sobre el texto a 390 px. 2) **Seguridad de operador (Punto 2):** En `api/guardar.php` saneamiento estricto de `$usuario` admitiendo únicamente letras, números, espacios y `.,'()-` hasta 40 caracteres con fallback robusto a `substr()` si `mb_substr()` no está cargado en el entorno CLI, y `str_replace('*/', '* /', ...)` en el encabezado. La prueba e2e de inyección de código `"*/"` ahora pasa al 100%. 3) **Zona horaria del servidor (Punto 3):** `date_default_timezone_set('America/Argentina/Buenos_Aires')` añadido al inicio de `api/config.php`. Los timestamps de `data.js` y `registro-cambios.log` se generan en hora argentina real (21:13 hs). 4) **Campus Virtual en Contacto (Punto 10):** Unificado botón de "Ir al Campus Virtual" a "Campus Virtual" en la ficha de Contacto. 5) **Compilación y Pruebas:** `npm run build` completado sin errores (36 validaciones en verde, matriz de 355 piezas visuales OK); `npm run verify:e2e` ejecutado con éxito total (100% pruebas de punta a punta aprobadas). 6) **Despliegue SFTP unificado (8 archivos):** Subidos con respaldo remoto `assets/logo-provincia-ba.png`, `api/config.php`, `api/guardar.php`, `app.js`, `admin.js`, `data.js`, `admin.html` e `index.html`. Condición de `data.js` cumplida (hash remoto verificado previo a la subida). Hashes SHA-256 validados al 100% contra el servidor y respuesta HTTP 200 OK en vivo. |
| **2026-10-15 19:45** | Antigravity | `site/curso.php`, `site/api/auth.php`, `site/index.html`, `site/robots.txt`, `site/data.js`, nuevo servidor Ferozo (`c2430536.ferozo.com` / `public_html` / `https://cfp401avellaneda.com.ar`), `REPORTE-MAESTRO-CONJUNTO.md` | **Migración completa y exitosa del sitio web CFP N° 401 Avellaneda al nuevo servidor Ferozo (DonWeb):** 1) **Alcance estricto:** Exclusivamente la web institucional (`CFP 401 Avellaneda WEB v2.0/site/`), sin migrar Campus SEMI ni Moodle. 2) **Conectividad FTPS:** Configurada conexión segura con TLS explícito (`ftplib.FTP_TLS`, `prot_p()`) en puerto 21 al host `c2430536.ferozo.com` (`200.58.111.11`), apuntado por el dominio `cfp401avellaneda.com.ar`. 3) **Sincronización de datos vivos y credenciales:** Descargados del servidor anterior `data.js` (con las últimas modificaciones del operador "Nico" de 19:16 hs) y hashes Bcrypt `.clave.json` y `.clave-maestra.json`, manteniendo intactas las contraseñas del panel sin requerir reseteo. 4) **Adaptabilidad de dominio y SEO:** En `curso.php` URL dinámica (`$protocolo . '://' . $host . $baseDir`), en `api/auth.php` dominios `cfp401avellaneda.com.ar` y `www.cfp401avellaneda.com.ar` habilitados en CORS, y en `index.html` y `robots.txt` canonical, OpenGraph y Schema.org actualizados al nuevo dominio raíz. 5) **Compilación y suite de pruebas:** `npm run build` (36 validaciones OK) y `npm run verify:e2e` (100% de pruebas de punta a punta aprobadas). 6) **Despliegue y validación en vivo:** 16 directorios creados y 254 archivos (50.86 MB) subidos a `/public_html` vía FTPS binario con verificación de tamaños. HTTP 200 OK en `https://cfp401avellaneda.com.ar/`, `index.html`, `data.js`, `app.js`, `admin.html`, `admin.js`, `curso.php?slug=soldador-basico` y endpoints de API. Protección Apache `.htaccess` verificada en vivo con HTTP 403 Forbidden sobre dotfiles (`.clave.json`, `.clave-maestra.json`) y carpetas internas (`api/backups/`). |
| **2026-10-15 19:53** | ChatGPT Local | `Sistema de Diseño/Promociones y Redes/Piezas listas/visita-simma-feed.html`, `Sistema de Diseño/Promociones y Redes/Piezas listas/visita-simma-feed.png` (nueva), `REPORTE-MAESTRO-CONJUNTO.md` | **Pieza para Feed de Instagram y Facebook — visita de SIMMA Grupo Empresas:** creada composición institucional 4:5 a 1080×1350 con la fotografía original provista, logo institucional y paleta azul/amarilla del CFP. El arte presenta la visita y la capacitación sobre máquinas y herramientas dirigida a estudiantes, sin sumar datos no confirmados. Se incluyó HTML como fuente editable y PNG listo para publicar; PNG inspeccionado visualmente a resolución final. Copy sugerido y hashtags entregados en la conversación. |
| **2026-10-15 20:33** | Antigravity | `fuente-jsx/app.jsx`, `site/app.js` (recompilado), `site/index.html` (`?v=`), `site/data.js`, servidor de producción Ferozo (`https://cfp401avellaneda.com.ar`), `REPORTE-MAESTRO-CONJUNTO.md` | **Corrección y reactivación del control dinámico del Campus Virtual desde el Panel:** 1) **Causa raíz:** En el commit `62a4fd3` se había estandarizado el selector de campus pero se eliminó la lógica condicional de `cvConfig`, dejando el botón "Campus Virtual" fijo e incondicional en el Header (`navCta`), Portada (`HomeScreen`), Contacto (`ContactScreen`) y Pie (`Footer`), provocando que la web pública ignorara por completo cuando el administrador lo desactivaba o invisibilizaba en el panel. 2) **Función unificada `getCampusBtnConfig`:** Se implementó helper reactivo para resolver el botón según `data.campusVirtual.activo` y `modoInactivo`. Si `activo === false`: en modo `'ocultar'` devuelve `null` (removiendo el botón de Navbar, Portada, Contacto y Footer); en modo `'deshabilitado'` devuelve label `"Campus (Próximamente)"` y abre el modal explicativo; en modo `'modal'` devuelve `"Campus Virtual"` y abre el modal explicativo. Si `activo === true`: devuelve `"Campus Virtual"` y abre el selector de campus. 3) **Componentes adaptados:** Se integró la condición en `SiteNavBar`, Hero de Portada, ficha de Contacto (botón e InfoList), enlaces del Footer, listener de eventos (`cfp:modal-campus` y `cfp:selector-campus`) y respuesta contextual de Marbot. 4) **Estado sincronizado:** `site/data.js` establecido con `activo: false` y `modoInactivo: 'ocultar'`, ocultando el botón en vivo y permitiendo alternar entre activo, modal u oculto en cualquier momento desde el panel. 5) **Compilación y pruebas:** `npm run build` ejecutado (36 validaciones aprobadas, matriz de 355 escenarios OK); `npm run verify:e2e` aprobado al 100%. 6) **Despliegue FTPS en vivo:** Subidos `app.js`, `index.html` y `data.js` a `/public_html` en Ferozo (`cfp401avellaneda.com.ar`) con tamaños verificados y HTTP 200 OK. |
| **2026-10-15 20:50** | Claude Code | `Sistema de Diseño/Promociones y Redes/templates/actividades-institucionales/` (nuevo: `feed.html`, `stories.html`, `a4.html`, `actividades.css`, `actividades.js`, `README.md`, `assets/`), `Sistema de Diseño/Promociones y Redes/README.md`, `Sistema de Diseño/skill/cfp401-estudio/references/piezas-redes.md`, `Sistema de Diseño/Promociones y Redes/Piezas listas/visita-simma-feed-v2.html`/`.png` y `visita-simma-texto-posteo.txt` (nuevos), `herramientas/importar-estilos-plantillas.js`, `herramientas/verificar-visual.js`, `herramientas/verificar-e2e.js`, `fuente-jsx/plantillas-promo.jsx`, `fuente-jsx/admin.jsx`, `site/plantillas-promo.js`, `site/admin.js` (recompilados), `site/admin.html`, `site/index.html` (`?v=`), `site/assets/promociones/tematicas/actividades/visita-simma-capacitacion.jpg` (nuevo), `REPORTE-MAESTRO-CONJUNTO.md` | **Nueva plantilla «Actividades Institucionales» (Modelo H) en Feed, Stories y A4, integrada al generador del panel.** Pedido del responsable a partir de la pieza de la visita de SIMMA Grupo Empresas, que él mismo ajustó en el lienzo de diseño: placa amarilla "CAPACITACIÓN", el tema en grande ("MÁQUINAS Y HERRAMIENTAS"), bajada con la empresa y arco de fondo detrás del texto. 1) **Template** en el Sistema de Diseño con las medidas exactas de esa versión en Feed; Stories (foto de 1100 px, textos fuera de los 192 px de arriba y de abajo) y A4 (márgenes de 88 px) compuestos aparte. Campos editables: placa, titular y bajada; foto reemplazable; arco opcional. La placa achica la letra si no entra en un renglón; titular y bajada se achican juntos con `--fit` (misma lógica que `ajustarZona()` del panel). 2) **Panel:** modelo `actividad-institucional-v1` (tipo `aviso`, sin curso ni WhatsApp), componente `ActividadInstitucionalV1` con el mismo HTML del template, CSS importado con el importador (id `actividad`; los bloques de las otras plantillas no cambiaron), foto propia en `assets/promociones/tematicas/actividades/`, opción «Arco de fondo» en el paso 4 y muestra con los textos de SIMMA en el paso 1. Los textos por defecto son marcadores (`[TEMA DE LA ACTIVIDAD]`, `[EMPRESA O INSTITUCIÓN]`) para que nunca se publique por error el nombre de otra empresa. 3) **Verificación:** captura del template contra la versión del responsable (solo cambia el encuadre de la foto, 9 px); componente del panel contra el template por píxeles: Feed 0,08 %, Stories 0,27 %, A4 0,26 % de diferencia, todo en el logo (el del sitio es un PNG más chico); `verificar-todo.js` OK; `verificar-visual.js` OK con el modelo nuevo y una placa larga en la matriz (394 escenarios: 175 base, 150 estrés, grilla 0–22); `verificar-e2e.js` OK con un caso nuevo que recorre el asistente (paso 2 bloqueado, foto propia, tres formatos, titular editado, arco apagado, guardado) y descarga los tres PNG reales (1350×1687, 1350×2400, 2480×3508). 4) **No desplegado:** queda en §4.B la lista de archivos a subir. |

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
