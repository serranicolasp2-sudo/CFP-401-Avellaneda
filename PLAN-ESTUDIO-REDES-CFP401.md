# Estudio Redes CFP 401 — Plan maestro de desarrollo

> **Destinatario:** agente de desarrollo (Antigravity) y responsable del proyecto.
> **Autor del plan:** Claude Code, 16/10/2026, a pedido del responsable del sitio y las redes del CFP N° 401 Avellaneda (Dock Sud).
> **Estado:** plan aprobado para ejecutar por fases. Ninguna línea de código escrita todavía.

---

## 0. Cómo usar este documento (leer primero, agente)

1. Ejecutá **una fase por vez** (sección 10). No pases a la siguiente sin cumplir su **Definición de Terminado (DdT)**.
2. Antes de escribir código, leé las **fuentes de verdad** de la sección 14. La marca no se inventa: se lee.
3. Las decisiones marcadas con ❓ (sección 12) son del responsable. Si una bloquea, usá el **valor por defecto** indicado y dejalo anotado.
4. Llevá una bitácora en `BITACORA.md` (en la raíz del proyecto nuevo): fecha, fase, qué se hizo, qué se verificó y cómo, qué queda pendiente. Mismo estilo de commits que el repo actual (`feat:`, `fix:`, `docs:`, en español).
5. **Nunca** escribas contraseñas, claves ni tokens en archivos versionados, en la bitácora o en el chat.
6. Usá las **versiones estables vigentes** de cada librería al momento de implementar y fijalas en `package.json` (sin `^`). Los modelos de IA, tamaños de redes y cuotas gratuitas **cambian**: verificalos en la documentación oficial y dejalos configurables (Remote Config o JSON de presets), nunca grabados en el código.
7. **Costo cero:** no agregues ningún servicio, API ni librería que pida tarjeta de crédito o plan pago (ver 1.1). Si algo solo existe pago, proponé una alternativa gratuita o dejalo afuera y anotalo en la bitácora.

---

## 1. Qué se construye

**Estudio Redes CFP 401**: una aplicación de escritorio para Windows (instalador `.exe` + versión portable) que cualquier compañero de la escuela puede usar en cualquier PC para:

- **Crear piezas** (posts, stories, flyers, afiches A4, miniaturas, portadas) a partir de una **biblioteca de plantillas** fiel al Sistema de Diseño del CFP 401.
- **Generar plantillas nuevas, ideas, copys y calendarios** con IA de Google (**Gemini**), sin que nadie necesite cuentas premium de IA.
- **Hacer motion y video**: placas animadas, intros/outros, zócalos, subtítulos, reels y shorts, con identidad institucional.
- **Planificar y organizar** las publicaciones en un calendario con flujo de aprobación.
- **Exportar** en múltiples formatos y resoluciones por plataforma (Instagram, TikTok, YouTube, LinkedIn, Facebook, X, WhatsApp e imprenta).
- **Trabajar sin conexión**, con autoguardado, sincronización en tiempo real (Firebase) y notificaciones.

Objetivo de calidad: que **cualquier persona**, aunque nunca haya diseñado, obtenga una pieza **reconocible como CFP 401, con datos correctos y lista para publicar**, y que el equipo mantenga **consistencia visual impecable** en todas las plataformas.

### 1.1 Costo cero (regla del proyecto)

**Todo tiene que ser gratis y seguir siéndolo.** Ningún servicio se da de alta con tarjeta de crédito: sin tarjeta cargada nadie puede cobrar nada, y si se llega a un límite gratuito el servicio se frena hasta que se renueva (al día o al mes siguiente), pero no factura.

**¿Qué es Firebase?** Un servicio de Google que funciona como la "nube" de la app: guarda los diseños, el calendario y las ideas, los sincroniza en tiempo real entre todas las PCs de la escuela y resuelve el inicio de sesión con cuentas de Google. Tiene un **plan gratuito (Spark)** que no pide tarjeta y alcanza para una escuela.

| Servicio | Para qué | Costo |
|---|---|---|
| Firebase **Spark**: Auth, Firestore, Realtime Database, Remote Config | Inicio de sesión, datos, sincronización, presencia, configuración | Gratis, sin tarjeta. Límites de Firestore: 1 GiB guardado, 50.000 lecturas y 20.000 escrituras por día (verificar los vigentes) |
| Gemini vía Firebase AI Logic (Gemini Developer API) | IA | Nivel gratuito, con límite de uso por minuto y por día |
| GitHub | Código y versiones | Gratis |
| Hosting Ferozo de la escuela | Actualizaciones automáticas | Ya se paga hoy; no suma costo |
| Electron, React, Redux Toolkit, FFmpeg, Poppins y Source Sans 3 | Software y fuentes | Libres y gratuitos |
| **No se usan:** plan Blaze, Firebase Storage, Cloud Functions, firma de código, API de X, generación de imágenes paga | — | Son pagos |

---

## 2. Decisión de stack: React Native vs. la propuesta

El pedido original menciona React Native. **Es posible** (existe React Native for Windows, mantenido por Microsoft), pero **no es lo recomendable para esta app**. Propuesta superadora: **Electron + React + TypeScript para el escritorio**, con un **núcleo compartido** que más adelante reutiliza una **app móvil en React Native (Expo)**. Se conserva todo lo pedido: React, Redux Toolkit, Firebase, Jest.

| Criterio | React Native for Windows | **Electron + React (recomendado)** |
|---|---|---|
| Reutilizar las plantillas actuales (HTML/CSS verificadas por píxeles) | ❌ No hay DOM ni CSS: habría que redibujar todo o meter un WebView2 igual | ✅ Se reutilizan los mismos CSS de `Sistema de Diseño/Promociones y Redes/templates/` y los componentes JSX del panel |
| Firebase con caché offline | ❌ `@react-native-firebase` **no soporta Windows**; el SDK web no tiene IndexedDB en RN Windows | ✅ SDK web completo: Firestore con caché persistente, Auth, Remote Config, AI Logic |
| Video (FFmpeg), archivos, render de PNG/PDF | ⚠️ Requiere módulos nativos en C++/C# | ✅ `ffmpeg-static`, `capturePage`, `printToPDF`, `sharp` |
| Instalar en PCs de la escuela sin admin | ⚠️ MSIX: exige certificado y permitir sideloading | ✅ Instalador NSIS por usuario (sin admin) + `.exe` portable |
| Ecosistema y mantenimiento por otros | Chico | Enorme, mucha documentación |
| Peso | Liviano | ~150 MB instalado, ~300 MB RAM (aceptable) |

**Alternativa evaluada y descartada:** Tauri 2 (más liviano, usa WebView2). Se descarta porque exige Rust para el backend, la captura de páginas a imagen es más compleja y baja la mantenibilidad para el equipo.

**Multiplataforma real:** la lógica (tipos, esquemas, Redux, reglas de marca, calendario, servicios Firebase, IA) vive en `packages/core` y paquetes hermanos, sin dependencias de Electron. En la **Fase 9** una app **Expo (React Native)** para celular reutiliza ese núcleo para lo que sí tiene sentido en el teléfono: aprobar piezas, ver el calendario, recibir push y cargar fotos desde el taller.

---

## 3. Mejoras propuestas sobre el pedido original

1. **IA sin claves expuestas:** Gemini vía **Firebase AI Logic** (proveedor *Gemini Developer API*, con nivel gratuito). Cada compañero entra con su cuenta de Google y usa el proyecto Firebase de la escuela; nadie maneja claves ni paga suscripciones.
2. **Plantillas generadas por IA de forma segura:** la IA **no escribe HTML libre**; produce un `TemplateSpec` (JSON validado con Zod) que solo puede usar tokens, tipografías y logos del sistema. Un **Guardián de Marca** lo valida antes de mostrarlo.
3. **Guardián de Marca (Brand Guard):** linter automático de piezas y copys (paleta, tipografías, logo, zonas seguras, contraste, voseo, datos duros, frases prohibidas como "100% gratuito" → hoy es **"Oficial y Gratuito"**, año calendario en la oferta, etc.). Bloquea la exportación si hay campos `[A COMPLETAR]`.
4. **Datos de cursos desde la fuente real:** el catálogo se importa del `data.js` del sitio (no se tipea a mano), para no inventar horarios ni requisitos.
5. **Asistente "Crear" para principiantes:** 5 pasos (¿qué querés comunicar? → ¿dónde? → datos → ver todas las versiones → exportar/programar).
6. **Kit de publicación:** un ZIP por publicación con todas las medidas + copy por plataforma + texto alternativo + hashtags.
7. **Vista previa de grilla de Instagram** (recorte 3:4 del perfil) para controlar la consistencia del feed antes de publicar.
8. **Overlays con transparencia** (WebM VP9 alfa y MOV ProRes 4444) para que quien edita en Filmora/Premiere/After Effects use zócalos y placas animadas oficiales.
9. **Subtítulos automáticos con Gemini** (transcripción de audio → SRT con estilo de marca), porque la mayoría mira reels sin sonido.
10. **Notificaciones inteligentes, no constantes:** avisos por eventos que importan (asignación, revisión, aprobación, mención, recordatorio de publicación, efeméride próxima) y resumen semanal, con horario de silencio. El exceso de notificaciones hace que se desactiven.
11. **Modo "PC compartida":** cierre de sesión al salir y sin caché de datos sensibles, porque las PCs de la escuela las usan varias personas.
12. **Actualizaciones automáticas** desde el hosting Ferozo que ya tiene la escuela (`cfp401avellaneda.com.ar`), sin servicios pagos.
13. **Consentimiento de imagen:** cada foto con personas lleva un indicador de autorización; las piezas con fotos sin autorización no se exportan para publicación.
14. **Pruebas de regresión visual:** cada plantilla migrada se compara píxel a píxel contra la pieza aprobada actual.
15. **Publicación directa a redes:** fuera de la v1 (cada red exige revisión de app, cuentas business y, en X, plan pago). En la v1 la publicación es **asistida** (exportar, copiar copy, abrir la red, marcar como publicada). Ver Fase 9.

---

## 4. Arquitectura

### 4.1 Vista general

```
┌──────────────────────── App de escritorio (Electron) ────────────────────────┐
│                                                                               │
│  RENDERER (React + Redux Toolkit)          MAIN (Node)                        │
│  ├─ UI: Inicio, Crear, Biblioteca,         ├─ Ventanas + bandeja del sistema  │
│  │      Calendario, Ideas, Video, Ajustes  ├─ Motor de render (ventana         │
│  ├─ Editor de piezas (DOM + CSS de marca)  │   offscreen → PNG/JPG/WebP/PDF)   │
│  ├─ Firestore (caché persistente)          ├─ FFmpeg (video, GIF, overlays)    │
│  ├─ Firebase AI Logic (Gemini)             ├─ Caché de archivos (LRU)          │
│  └─ Remote Config (modelos, flags)         ├─ Notificaciones Windows (toast)   │
│              ▲  IPC tipado (preload)  ▲    ├─ Programador de recordatorios     │
│              └────────────────────────┘    └─ Auto-actualización               │
└───────────────────────────────┬───────────────────────────────────────────────┘
                                │
          ┌─────────────────────┼─────────────────────────────┐
          ▼                     ▼                             ▼
   Firebase plan Spark       Gemini (Google)          Sitio cfp401avellaneda.com.ar
   (gratis, sin tarjeta)     vía Firebase AI Logic    data.js (catálogo de cursos)
   Auth · Firestore ·        nivel gratuito           + carpeta de actualizaciones
   RTDB (presencia) · Remote Config
```

### 4.2 Monorepo (npm workspaces)

> **Ubicación:** crear el proyecto en una ruta **ASCII y sin espacios**, por ejemplo `C:\dev\estudio-cfp401`. La ruta actual (`C:\Users\Nicolás\Desktop\Campus Virtual`) tiene tilde y espacios: rompe `node-gyp`, `sharp` y `electron-builder` en Windows. El Sistema de Diseño se **copia** con un script (no se edita desde este repo).

```
estudio-cfp401/
├─ apps/
│  ├─ desktop/                 Electron
│  │  ├─ src/main/             proceso principal (render, ffmpeg, caché, notificaciones, updater)
│  │  ├─ src/preload/          contextBridge: API tipada window.estudio.*
│  │  └─ src/renderer/         React: app/, features/, components/, theme/
│  └─ mobile/                  (Fase 9) Expo React Native
├─ packages/
│  ├─ core/                    dominio puro TS: tipos, esquemas Zod, slices RTK, selectores,
│  │                           calendario, presets de exportación, Brand Guard. Sin React/Electron/Firebase.
│  ├─ templates/               plantillas de código (A–H) + motor de TemplateSpec + CSS de marca
│  ├─ firebase/                repositorios (puertos y adaptadores), conversores, reglas
│  ├─ ai/                      cliente Gemini, skills, prompts, herramientas (function calling)
│  ├─ media/                   constructores de comandos FFmpeg y EDL→filtergraph (funciones puras)
│  └─ design-system/           copia sincronizada: tokens, fuentes, logos, fototeca, skill
├─ firebase/                   firestore.rules, storage.rules, database.rules.json, indexes, emuladores
├─ scripts/                    sync-design-system.ts, import-catalogo.ts, release.ts
├─ docs/                       manual de usuario, guía de contribución, ADRs
└─ BITACORA.md
```

**Regla de dependencias** (forzada con `eslint-plugin-boundaries`): `renderer → features → packages/*`; `core` no depende de nada de la app; `firebase`, `ai` y `media` implementan **interfaces definidas en `core`** (puertos y adaptadores), así todo se testea con dobles en memoria.

### 4.3 Seguridad de Electron (obligatorio)

`contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`, CSP estricta (solo dominios de Firebase/Google y el sitio), IPC con canales en lista blanca y argumentos validados con Zod en el main, sin `remote`, sin cargar contenido web arbitrario. Enlaces externos se abren en el navegador del sistema.

---

## 5. Stack definitivo

| Capa | Elección | Notas |
|---|---|---|
| Lenguaje | TypeScript `strict` | |
| Escritorio | Electron + `electron-vite` | |
| UI | React, Radix UI (primitivas accesibles), CSS Modules con tokens CSS, Lucide (iconos, igual que el Sistema de Diseño) | Interfaz en español rioplatense |
| Estado | **Redux Toolkit** + **RTK Query** + `createListenerMiddleware` + `createEntityAdapter` | Firestore en tiempo real con `queryFn` + `onCacheEntryAdded` |
| Deshacer/rehacer | parches de Immer (`produceWithPatches`) en el slice del editor | Historial de 100 pasos |
| Validación | Zod (+ `zod-to-json-schema` para la salida estructurada de Gemini) | |
| Backend | Firebase **plan Spark (gratis)**: Auth (Google), Firestore (caché persistente), Realtime Database (solo presencia), Remote Config, **AI Logic** | Sin Storage ni Cloud Functions (exigen plan pago) |
| IA | Gemini (modelo Flash para tareas rápidas, Pro para planificación y plantillas), IDs en Remote Config | |
| Render de piezas | `BrowserWindow` offscreen + `capturePage` / `printToPDF`; `sharp` para WebP/AVIF/redimensionado | |
| Video | `ffmpeg-static` + `ffprobe-static`; motor de motion propio basado en `frame` | Ver 7.6 |
| Persistencia local | Caché de Firestore (IndexedDB), `electron-store` para preferencias, carpeta de caché en `%APPDATA%` | |
| Pruebas | **Jest** (`@swc/jest`), React Testing Library, `@firebase/rules-unit-testing` + emuladores, Playwright (`_electron`) para E2E y regresión visual | |
| Calidad | ESLint (typescript-eslint, react-hooks, boundaries), Prettier, Husky + lint-staged, commitlint | |
| Empaquetado | `electron-builder` (NSIS por usuario + portable), `electron-updater` (proveedor `generic`) | |
| CI | GitHub Actions en `windows-latest` | |

---

## 6. Datos (Firebase)

### 6.1 Firestore

| Colección | Campos principales |
|---|---|
| `users/{uid}` | nombre, email, `role` (`admin` · `editor` · `revisor` · `colaborador`), `prefs` (tema, notificaciones, horario de silencio, escala de UI), `lastSeen` |
| `config/app` | dominios/emails permitidos, flags, versión mínima de la app |
| `catalog/courses/{courseId}` | importado de `data.js` del sitio: nombre, días y horarios, requisitos, duración, modalidad, sede, período; `syncedAt` (solo lectura para no-admin) |
| `templates/{id}` | `kind` (`code` · `spec`), nombre, categoría, formatos disponibles, `spec` (si es `spec`), miniaturas, `status` (`borrador` · `aprobada`), `version`, autor |
| `designs/{id}` | `templateId`, variantes por formato `{ feed, stories, a4, … }` con sus campos, assets usados, `status`, dueño, `updatedAt`, `postId` |
| `designs/{id}/versions/{vid}` | instantánea completa (cada 5 min de edición, al exportar y al aprobar; se conservan las últimas 50) |
| `posts/{id}` | entrada del calendario: título, pilar, campaña, plataformas, `scheduledAt` por plataforma, `status` (`idea` → `borrador` → `en_revision` → `aprobado` → `programado` → `publicado` → `medido`), diseños, copy/hashtags/alt por plataforma, responsable, aprobaciones, métricas |
| `ideas/{id}` | texto, origen (`persona` · `ia`), pilar, votos, convertida en `postId` |
| `campaigns/{id}` | p. ej. "Inscripciones marzo": fechas, objetivos, plataformas |
| `assets/{id}` | tipo, dimensiones, etiquetas (curso, sede, tema), `consentimiento` (`si` · `no` · `no_aplica`), fuente, autor |
| `assetBlobs/{id}` | la foto comprimida (WebP, máx. 1600 px de lado, < 600 KB) en base64; se descarga una vez por PC y queda en caché |
| `notifications/{uid}/items/{id}` | tipo, texto, enlace interno, `read`, `createdAt` |
| `usage/{uid_yyyymmdd}` | contador de llamadas a IA por usuario y día |
| `activity/{id}` | registro de acciones (quién aprobó, exportó, publicó) |

### 6.2 Reglas (resumen)

- Solo usuarios autenticados **y presentes en la lista permitida** (`users/{uid}` creado por un admin o dominio permitido).
- `colaborador`: crea ideas y sube assets; edita solo sus borradores.
- `editor`: crea y edita diseños, plantillas en borrador y posts.
- `revisor` (Dirección): aprueba/rechaza posts y plantillas.
- `admin`: usuarios, configuración, catálogo, plantillas aprobadas.
- `notifications/{uid}`: el dueño lee/marca; otros solo pueden **crear** ítems con campos limitados.
- Todas las reglas con **pruebas automáticas** contra el emulador (Fase 1).

### 6.3 Archivos sin costo (sin Firebase Storage)

Firebase Storage y Cloud Functions exigen el plan pago (Blaze), así que **no se usan**. En su lugar:
- **Fotos nuevas:** se comprimen en la PC (WebP, máx. 1600 px, < 600 KB) y se guardan en `assetBlobs/` de Firestore. Con 1 GiB gratis entran unas 1.500 fotos; la app muestra el espacio usado y avisa al 80 %.
- **Plantillas, logos, fuentes y fototeca curada:** vienen dentro del instalador; no ocupan la nube.
- **Exportes (PNG, PDF, MP4):** se generan y quedan en la PC; no se suben. En la nube se comparte el **diseño** (un JSON liviano), así cualquier PC lo vuelve a exportar idéntico.
- **Videos y másters pesados:** quedan en la PC. Para pasarlos entre personas, usar a mano la carpeta de Google Drive de la escuela. Una integración automática con Drive solo se agrega si se verifica que es gratis y simple (ADR).
- **Realtime Database** solo para **presencia** ("Ana está editando esta pieza"), por su `onDisconnect`.

---

## 7. Módulos funcionales

### 7.1 Inicio
Tablero: lo que hay que publicar hoy y esta semana, piezas esperando revisión, ideas nuevas, próxima efeméride, estado de sincronización, accesos rápidos ("Crear pieza", "Nueva idea", "Ver calendario").

### 7.2 Biblioteca de plantillas
Dos tipos, misma interfaz para quien la usa:

**a) Plantillas de código (`kind: code`)** — los modelos actuales, fieles al píxel:
| Modelo | Carpeta de origen |
|---|---|
| A · Inscripciones abiertas | `templates/inscripciones-abiertas*` |
| B · Promo de curso | `templates/promo-curso*` |
| C · Flyer de curso | `templates/flyer-curso*` |
| D · Captación de consultas | `templates/captacion-oficios/` |
| E · Conmemoraciones patrias | `templates/conmemoraciones-patrias/` |
| F · Últimos cupos | `templates/ultimos-cupos/` |
| G · Grilla de cursos por inicio | `templates/grilla-cursos-inicio/` |
| H · Actividades institucionales | `templates/actividades-institucionales/` |

- Se migran a componentes React **reutilizando el CSS original** y partiendo de los componentes JSX que ya existen en el generador del panel (`CFP 401 Avellaneda WEB v2.0/fuente-jsx/`, `plantillas-promo.jsx`).
- **Un componente por formato** (Feed, Stories, A4): la marca prohíbe estirar una composición de un formato a otro.
- Cada plantilla declara sus **campos editables** con un esquema Zod (texto, curso del catálogo, foto, toggles como "cuadrícula/fondo liso", "quitar arco").
- Se portan las reglas de autoajuste existentes (titular que se achica, placa en un renglón, foto que se achica si crece el texto) a hooks reutilizables (`useFitText`, `useAvoidOverlap`).
- **Formatos nuevos** (16:9 para YouTube/X/LinkedIn, 1:1, miniatura 1280×720): requieren **composición propia**. Prioridad: A, D y H. Se diseñan con ayuda de la IA y se aprueban por un humano antes de publicarse en la biblioteca.

**b) Plantillas declarativas (`kind: spec`)** — creadas por la IA o por un editor avanzado:

```json
{
  "id": "tpl-charla-empresas",
  "nombre": "Charla con empresas",
  "categoria": "actividades",
  "formatos": {
    "feed": {
      "lienzo": { "w": 1080, "h": 1350, "fondo": "token:--brand-primary", "trama": "cuadricula" },
      "capas": [
        { "tipo": "foto", "campo": "foto", "x": 0, "y": 0, "w": 1080, "h": 700, "recorte": "diagonal" },
        { "tipo": "logo", "variante": "horizontal-blanco", "x": 64, "y": 64, "w": 420 },
        { "tipo": "placa", "campo": "tipo", "estilo": "placa-amarilla-sombra-dura", "x": 64, "y": 660 },
        { "tipo": "texto", "campo": "titulo", "estilo": "titular-poppins-800", "x": 64, "y": 780, "w": 952, "maxLineas": 3, "ajuste": "achicar" },
        { "tipo": "texto", "campo": "bajada", "estilo": "bajada-source-sans", "x": 64, "y": 1120, "w": 952, "maxLineas": 3 }
      ]
    }
  },
  "campos": { "foto": "imagen", "tipo": "texto-corto", "titulo": "texto", "bajada": "texto" }
}
```
- Solo admite **referencias a tokens** (`token:--…`), **estilos tipográficos con nombre** y **logos de `assets/`**: nunca colores, fuentes o imágenes de marca arbitrarias.
- Las plantillas `spec` nacen en estado `borrador`; un `revisor` o `admin` las aprueba para la biblioteca.

**Fototeca:** la curada del Sistema de Diseño (22 cursos × 3 fotos, temáticas, institucionales) viene **incluida en el instalador**; las fotos nuevas se suben con etiquetas y consentimiento.

### 7.3 Editor
- **Modo simple (por defecto):** panel de campos a la izquierda (con autocompletado desde el catálogo de cursos), lienzo al centro, **todas las variantes de formato a la vista** a la derecha. Clic en un texto del lienzo para editarlo. Selector de foto con búsqueda por curso/tema.
- **Modo avanzado (plantillas `spec`):** mover/redimensionar capas (`react-moveable`), alinear a la grilla de 4 px, capas, bloqueo.
- **Autoguardado en cada edición:** cada cambio se guarda **al instante en la PC** (borrador local). La sincronización con Firestore se agrupa con `listenerMiddleware` (tras 3 s sin cambios o cada 30 s como máximo, solo los campos modificados) para no gastar el límite gratuito de escrituras diarias. Indicador "Guardado hace 2 s" / "Guardado en esta PC, se sincroniza al volver la conexión".
- **Historial:** deshacer/rehacer (Ctrl+Z / Ctrl+Y), versiones restaurables, recuperación tras cierre inesperado.
- **Colaboración:** presencia en vivo; edición simultánea con "último cambio gana" **por campo** y aviso visible si otra persona modificó el mismo campo.
- **Fondo del lienzo neutro e independiente del tema** de la app (los colores de la pieza se juzgan siempre igual).

### 7.4 Guardián de Marca
Funciones puras en `packages/core/brand-guard/`, con reglas leídas de la skill y el README de marca. Cada regla devuelve `error` (bloquea exportar), `aviso` o `sugerencia`.

- **Visual:** solo colores de la paleta; solo Poppins y Source Sans 3; logo original y variante correcta según el fondo; marca Campus Virtual solo en piezas del Campus; zonas seguras por plataforma; texto fuera del lienzo o superpuesto; contraste WCAG; tamaño mínimo legible; interlineado ≥ 1,04 en titulares en mayúsculas.
- **Copy:** voseo (detecta "tú", "usted", "puedes", "inscríbete"…); "hs" sin punto; WhatsApp canónico `11 6105-6018`; dirección canónica; sin año calendario en la oferta de cursos; hashtags en CamelCase solo al final; emoji solo en redes; frases de marca literales; **"Oficial y Gratuito"** (directiva de Dirección: reemplaza a "100% gratuito").
- **Datos:** horarios, días y requisitos coinciden con el catálogo; campos `[A COMPLETAR]` bloquean la exportación; en "Últimos cupos" exige confirmar disponibilidad y vigencia (nunca inventa vacantes ni fechas).
- **Imagen:** fotos con personas requieren consentimiento; imágenes generadas por IA llevan etiqueta y nunca representan estudiantes o egresados ficticios.
- **Engagement (sugerencias):** gancho en los primeros 3 s del video, subtítulos presentes, CTA claro, texto alternativo cargado, portada coherente con la grilla.

### 7.5 Exportación
Motor en el proceso main: ventana offscreen al tamaño exacto, espera `document.fonts.ready` + imágenes cargadas + señal `__LISTO__`, y captura. Escala 1×/2×/3× con `setZoomFactor`. Las fuentes van **empaquetadas** (licencia OFL) para que el resultado sea idéntico con o sin conexión.

**Presets iniciales** (archivo `packages/core/presets/plataformas.json`, editable; **verificar medidas vigentes en la ayuda oficial de cada red**):

| Plataforma | Piezas | Medidas |
|---|---|---|
| Instagram | Feed / Carrusel · Stories · Reels | 1080×1350 · 1080×1920 · 1080×1920 (portada de grilla 3:4) |
| Facebook | Post · Stories · Portada de evento | 1080×1350 · 1080×1920 · 1920×1005 |
| TikTok | Video · Foto | 1080×1920 (zona segura inferior y derecha amplia) |
| YouTube | Video · Shorts · Miniatura · Banner | 1920×1080 · 1080×1920 · 1280×720 · 2560×1440 |
| LinkedIn | Post · Enlace · Portada de página | 1080×1350 o 1200×1200 · 1200×627 · 1128×191 |
| X | Post · Encabezado | 1600×900 o 1080×1350 · 1500×500 |
| WhatsApp | Estado | 1080×1920 |
| Imprenta | Afiche A4 | 2480×3508 a 300 dpi (PDF) |

**Formatos de salida:** PNG, JPG (calidad ajustable), WebP, AVIF, PDF (vectorial, A4 a 300 dpi), MP4 H.264 + AAC (`+faststart`), WebM, GIF, WebM VP9 con alfa y MOV ProRes 4444 (overlays), SRT, ZIP "Kit de publicación".

**Kit de publicación (ZIP):** todas las medidas elegidas + `copy-instagram.txt`, `copy-linkedin.txt`, … + texto alternativo + hashtags + ficha con fecha y hora programada. Nombres de archivo: `AAAA-MM-DD_plataforma_pieza_formato.ext`.

### 7.6 Motion y video
**Motor de motion propio, determinista:** las plantillas reciben `frame` y `fps`; primitivas `interpolate`, `easing` (tokens de `tokens/motion.css` y las reglas de `references/audiovisual.md`), secuencias y presets de marca:
- Entrada de titular, barrido de cinta amarilla, aparición de placa con sombra dura, sello, zócalo (lower third), **ident de logo** (1,5 s), **cierre con CTA a WhatsApp** (3 s), transiciones de marca.
- Vista previa en tiempo real con `requestAnimationFrame`; render final cuadro por cuadro (offscreen → `image2pipe` → FFmpeg). Al ser determinista, lo que se ve es lo que se exporta.

**Editor de video básico (línea de tiempo):**
- Importar clips (celular, cámara), recortar, ordenar, velocidad, reencuadre a 9:16 / 1:1 / 16:9 con fondo desenfocado o seguimiento manual.
- Pistas de gráficos (plantillas animadas, zócalos, placas), música con *ducking* automático bajo la voz, normalización de sonoridad (−14 LUFS).
- **Subtítulos automáticos:** audio → Gemini → SRT editable → quemados con estilo de marca (Source Sans 3 Bold, caja azul, palabra activa en amarillo) o exportados como `.srt`.
- El proyecto se guarda como **EDL en JSON** (`packages/media`), que se traduce a un *filtergraph* de FFmpeg con funciones puras (100 % testeables).
- Detecta codificadores por hardware (`h264_qsv`, `h264_nvenc`, `h264_amf`) y usa `libx264` si no hay. Modo "borrador rápido" para PCs lentas.

**Plan B documentado:** si el equipo necesita edición más rica, evaluar **Remotion** (licencia gratuita para organizaciones sin fines de lucro; **verificar los términos vigentes**). No incorporarlo sin ADR.

### 7.7 Calendario, ideas y flujo de trabajo
- Vistas: **mes, semana, lista y tablero kanban** por estado; arrastrar y soltar para reprogramar.
- **Pilares de contenido** (configurables): Captación e inscripciones · Oficios en acción · Comunidad y actividades · Efemérides · Egresados y testimonios · Institucional (convenios, visitas de empresas).
- **Ciclo de la escuela precargado:** inscripciones de diciembre a febrero y en junio–julio; inicios en marzo y agosto (confirmar cada año con Dirección).
- **Efemérides argentinas:** `packages/core/data/efemerides-ar.json` con fechas fijas (24/3, 2/4, 1/5, 25/5, 20/6, 9/7, 17/8, 11/9, 21/9, 12/10, 20/11, 8/12, 25/12…). Los **feriados móviles se verifican cada año** en la fuente oficial; no inventar.
- **Cadencia sugerida inicial** (ajustable, se recalibra con métricas): Instagram 3–4 posts y stories casi diarias; Reels/TikTok 2 por semana; YouTube 1 video al mes + Shorts reutilizados; LinkedIn 1 por semana (convenios, visitas de empresas, egresados que trabajan); Facebook espeja el feed de Instagram; X 2–3 novedades breves por semana.
- **Flujo:** idea → borrador → en revisión (Dirección) → aprobado → programado → publicado → medido. Comentarios con menciones y registro de actividad.
- **Publicación asistida:** el día y la hora, la app avisa, abre el kit, copia el copy al portapapeles y abre la red correspondiente; la persona confirma "Publicado".
- **Métricas (manual en la v1):** alcance, interacciones, guardados, reproducciones por post; la IA las usa para recomendar horarios y formatos.
- Exportar el calendario a `.ics` para suscribirlo en Google Calendar.

### 7.8 IA con Gemini: las "skills" del estudio
**Conexión:** Firebase AI Logic (SDK web, proveedor Gemini Developer API). IDs de modelos, temperatura y versión de prompts en **Remote Config**. Plan B documentado: `@google/genai` desde el proceso main con clave guardada fuera del repo.

**Base de conocimiento** (copiada por `scripts/sync-design-system.ts` y versionada): `skill/cfp401-estudio/SKILL.md`, `references/marca.md`, `references/piezas-redes.md`, `references/audiovisual.md`, el README del Sistema de Diseño, tokens y el catálogo de cursos.

| Skill | Hace | Salida |
|---|---|---|
| **Director creativo** | Ideas y conceptos por pilar, series recurrentes ("Un oficio en 15 segundos", "Herramienta de la semana", "Egresados que trabajan"), ganchos | `Idea[]` |
| **Diseñador gráfico** | Elige plantilla y completa campos; propone **plantillas nuevas** como `TemplateSpec`; propone composiciones 16:9 y 1:1 | `DesignDraft`, `TemplateSpec` |
| **Motion designer** | Coreografía de placas e idents con los presets de marca | `MotionSpec` |
| **Editor de video** | Guion con tiempos, estructura del reel (gancho 0–3 s, desarrollo, CTA), cortes sugeridos, subtítulos | `EDL`, `SRT` |
| **Community manager** | Copy por plataforma (largo y tono distintos para IG, LinkedIn, X…), hashtags, texto alternativo, respuestas sugeridas | `CopySet` |
| **Estratega / planificador** | Calendario mensual según campañas, efemérides, fotos disponibles y métricas | `PostEntry[]` |
| **Revisor de marca** | Devolución ordenada por impacto (como la sección "Revisión de piezas ajenas" de la skill) | `Review` |

**Reglas de implementación:**
- **Salida estructurada** (JSON Schema generado desde Zod) → validación Zod → hasta 2 reintentos con el error como devolución → si falla, mensaje claro.
- **Function calling** con herramientas de solo lectura (`buscarCursos`, `buscarFotos`, `listarPlantillas`, `verCalendario`) y herramientas de **propuesta** (`proponerBorrador`, `proponerPlantilla`, `proponerEntradas`). **Nada se guarda sin que la persona acepte.**
- Todo resultado de IA pasa por el **Guardián de Marca**.
- **Cuotas:** contador por usuario y día en `usage/`; ante límite (429) mostrar "Se alcanzó el uso gratuito por ahora, probá en unos minutos" y ofrecer seguir sin IA.
- **Privacidad:** nunca enviar datos personales de estudiantes (DNI, teléfonos, legajos). En el nivel gratuito, Google puede usar el contenido para mejorar sus productos: avisarlo en Ajustes.
- **Generación de imágenes con IA:** desactivada por defecto (la marca prioriza fotos reales del taller). Si se activa, etiqueta obligatoria.
- Sin conexión: las funciones de IA se deshabilitan con explicación; todo lo demás funciona.

### 7.9 Notificaciones
- **Escritorio:** la app vive en la **bandeja del sistema** (cerrar = minimizar; inicio con Windows opcional). Un *listener* de Firestore sobre `notifications/{uid}/items` muestra **toasts nativos de Windows** (requiere `app.setAppUserModelId`) y un centro de notificaciones en la app con contador.
- **Recordatorios programados** calculados localmente a partir de los posts asignados (24 h y 1 h antes de publicar), así no hacen falta Cloud Functions.
- **Eventos:** asignación, pedido de revisión, aprobación/rechazo, mención, comentario, efeméride en 7 días, resumen semanal (lunes 9 hs), idea de la semana de la IA.
- **Preferencias por usuario:** qué recibir, horario de silencio, sonido.
- **Push al celular:** descartado, porque necesita Cloud Functions (pago). Si se hace la app móvil, muestra los avisos al abrirla.

### 7.10 Sin conexión y caché local
- Firestore con `persistentLocalCache` + `persistentMultipleTabManager`.
- **Incluido en el instalador:** plantillas, fuentes, logos, fototeca curada y la base de conocimiento de la IA → diseñar y exportar funciona 100 % sin internet.
- Caché de assets descargados en `%APPDATA%/EstudioCFP401/cache` con LRU y tope configurable (2 GB por defecto).
- **Bandeja de salida** para fotos nuevas: se suben solas al volver la conexión.
- Banner de estado: "Sin conexión — tus cambios se guardan en esta PC y se sincronizan al volver".
- **Modo PC compartida:** al cerrar sesión se limpia la caché de Firestore y los borradores locales del usuario.

### 7.11 Interfaz, tema oscuro y accesibilidad
- **Minimalista:** barra lateral (Inicio · Crear · Biblioteca · Calendario · Ideas · Video · Ajustes), barra superior (búsqueda, estado de sincronización, notificaciones, perfil).
- **Para principiantes:** asistente "Crear" en 5 pasos, recorrido guiado la primera vez, estados vacíos con ejemplos, tooltips en lenguaje simple, deshacer siempre disponible, nada destructivo sin confirmación.
- **Tema personalizable:** claro / oscuro / según Windows; dos oscuros ("Azul noche", derivado de `#002878`, y "Grafito" neutro); intensidad del acento; alto contraste; escala de interfaz 90–125 %; reducir movimiento. Los temas afectan la **interfaz**, nunca los colores de las piezas.
- La interfaz usa los tokens del Sistema de Diseño (azul, amarillo, radios, sombras azuladas, foco con halo amarillo) para que la herramienta también se sienta CFP 401.
- WCAG 2.2 AA, navegación completa por teclado, atajos (Ctrl+S fuerza guardado y sincronización, Ctrl+E exportar, Ctrl+K búsqueda).

### 7.12 Usuarios y acceso
- Inicio de sesión con Google. En Electron **no usar `signInWithPopup`**: flujo OAuth en el **navegador del sistema** con PKCE y redirección a `127.0.0.1` (loopback) → `signInWithCredential(GoogleAuthProvider.credential(idToken))`.
- Alta de usuarios por un admin (lista permitida) o por dominio institucional si la escuela tiene Google Workspace.

---

## 8. Calidad: código limpio, escalable y probado

- **Arquitectura por funcionalidades** (`features/editor`, `features/calendario`, …), cada una con su slice, selectores, componentes y pruebas. Lógica de negocio fuera de los componentes.
- **Puertos y adaptadores:** `core` define interfaces (`DesignRepository`, `AiPort`, `RenderPort`, `MediaPort`); Firebase, Gemini, Electron y FFmpeg son adaptadores intercambiables.
- **Redux Toolkit:** estado normalizado (`createEntityAdapter`), selectores memoizados, RTK Query para todo lo remoto, `listenerMiddleware` para efectos (autoguardado, notificaciones, telemetría local), sin lógica en reducers que no sea pura.
- **Pruebas con Jest:**
  - `packages/core` (Brand Guard, calendario, presets, esquemas): cobertura ≥ 90 %.
  - `packages/media` (EDL → argumentos de FFmpeg): ≥ 90 %, con *snapshots* de comandos.
  - `packages/ai`: constructores de prompts, validación y reintentos con el modelo simulado.
  - Slices y listeners de Redux; componentes con React Testing Library.
  - **Reglas de Firestore y Realtime Database** con emuladores + `@firebase/rules-unit-testing`.
- **Además de Jest:** Playwright con Electron para flujos de punta a punta y **regresión visual** de cada plantilla contra las piezas aprobadas (umbral 0,1 %).
- **CI (GitHub Actions, `windows-latest`, gratis: los repos privados tienen 2.000 minutos por mes y Windows cuenta doble, así que el instalador se compila solo en tags):** lint → typecheck → Jest → pruebas de reglas (emuladores, requiere Java) → build. En cada tag `vX.Y.Z`: instalador + portable, publicación en GitHub Releases y subida por FTP a la carpeta de actualizaciones del sitio (credenciales en *secrets*).
- **ADRs** en `docs/adr/` para cada decisión técnica relevante (stack, IA, motion, almacenamiento).

---

## 9. Distribución en las PCs de la escuela

- **Instalador NSIS por usuario** (no pide permisos de administrador, se instala en `%LOCALAPPDATA%`) y **versión portable** (USB o carpeta de red).
- **Requisitos mínimos:** Windows 10 (1809+) u 11, 64 bits, 4 GB de RAM (8 GB recomendados para video), 2 GB libres. ❓ **Electron actual no funciona en Windows 7/8**: relevar las PCs (decisión D6).
- **Actualizaciones automáticas** con `electron-updater` (proveedor `generic`) desde `https://cfp401avellaneda.com.ar/estudio/actualizaciones/` (verificar ruta y que el servidor sirva `.exe` y `.yml`).
- **Firma de código:** sin firma en la v1 → Windows SmartScreen muestra "Windows protegió su PC" la primera vez ("Más información" → "Ejecutar de todas formas"); explicarlo en el manual con capturas. La firma de código es paga, así que queda descartada.
- **Red de la escuela:** verificar que el firewall no bloquee `*.googleapis.com`, `*.firebaseio.com`, `firebasestorage.googleapis.com` ni `cfp401avellaneda.com.ar`.
- **Manual de usuario** (`docs/manual/`, también como PDF con la marca) y un video tutorial de 3 minutos hecho con la propia app.
- Licencias: fuentes OFL incluidas con su licencia; FFmpeg con su aviso de licencia en "Acerca de".

---

## 10. Fases

> Cada fase termina con: pruebas en verde, bitácora actualizada, commit(s) convencionales y una demo corta descripta en la bitácora.

### Fase 0 — Preparación
- Resolver decisiones D1–D8 (o aplicar los valores por defecto).
- Crear el proyecto Firebase en **plan Spark (gratis), sin cargar tarjeta**, con la **cuenta institucional** (Auth Google, Firestore, RTDB, Remote Config, AI Logic con Gemini Developer API).
- Crear el repo y el monorepo en `C:\dev\estudio-cfp401`.
- `scripts/sync-design-system.ts`: copia tokens, logos, fototeca, CSS de plantillas y archivos de la skill desde `Sistema de Diseño/` a `packages/design-system/`, con manifiesto y hash de versión.
- Descargar Poppins y Source Sans 3 (OFL) en `packages/design-system/fonts/`.
- **DdT:** `npm run sync:ds` reproduce la copia; emuladores de Firebase levantan; README del repo explica cómo arrancar.

### Fase 1 — Esqueleto
- Electron + electron-vite + React + TS + RTK + RTK Query; preload con API tipada; seguridad de 4.3.
- Shell de interfaz (barra lateral, barra superior), temas claro/oscuro/personalizable, escala de UI, enrutado.
- Login Google por loopback + roles + lista permitida; modo PC compartida.
- Reglas de Firestore y RTDB con pruebas.
- Jest, ESLint (con boundaries), Prettier, Husky, CI básica.
- **DdT:** se instala en una PC limpia, se inicia sesión, se ve el shell en ambos temas, CI en verde, reglas probadas.

### Fase 2 — Plantillas y editor
- Migrar modelos **D, H y A** primero (los más usados), luego B, C, E, F y G; un componente por formato; esquemas de campos.
- Catálogo de cursos importado de `data.js` (script + sincronización al iniciar con conexión).
- Editor modo simple + autoguardado + historial + versiones + presencia.
- Motor de plantillas `spec` (render + validación).
- **DdT:** cada plantilla migrada pasa la regresión visual contra la pieza original; cerrar la app a mitad de una edición y reabrir no pierde nada; dos usuarios ven la presencia del otro.

### Fase 3 — Exportación y Guardián de Marca
- Motor de render offscreen (PNG/JPG/WebP/AVIF/PDF, 1×–3×), presets por plataforma, kit de publicación ZIP, vista de grilla de Instagram.
- Guardián de Marca completo (visual, copy, datos, imagen) con panel de resultados en el editor.
- **DdT:** exportar una pieza en todos los presets en < 20 s en una PC de la escuela; A4 a 2480×3508 en PDF; un copy con "tú" o "100% gratuito" queda marcado; un campo `[A COMPLETAR]` bloquea la exportación.

### Fase 4 — Biblioteca, fototeca y offline
- Biblioteca con búsqueda/filtros, favoritos, plantillas aprobadas vs. borrador.
- Fototeca con etiquetas y consentimiento; compresión y subida a `assetBlobs/`; medidor del espacio gratuito; caché LRU; bandeja de salida.
- **DdT:** con el cable de red desconectado se crea, edita y exporta una pieza; al reconectar se sincroniza sin duplicados.

### Fase 5 — Calendario, ideas, flujo y notificaciones
- Calendario (mes/semana/lista/kanban), pilares, campañas, efemérides, ciclo escolar, `.ics`.
- Flujo de aprobación, comentarios con menciones, registro de actividad.
- Bandeja del sistema, toasts de Windows, recordatorios locales, centro de notificaciones, preferencias y horario de silencio.
- Publicación asistida y carga manual de métricas.
- **DdT:** un editor manda a revisión y el revisor recibe el toast; el día programado llega el recordatorio con el kit listo.

### Fase 6 — IA (Gemini)
- Integración AI Logic + Remote Config + cuotas + manejo de errores.
- Skills en este orden: Community manager → Director creativo → Planificador → Diseñador gráfico (`TemplateSpec`) → Revisor de marca.
- Asistente "Crear" con IA opcional en cada paso.
- **DdT:** generar el calendario de un mes de inscripciones, aceptarlo parcialmente, y producir 3 piezas desde ideas de la IA que pasen el Guardián de Marca sin errores.

### Fase 7 — Motion y video
- Motor de `frame`, presets de motion de marca, versiones animadas de A, D y H.
- Render a MP4/WebM/GIF/overlays con alfa; detección de codificador por hardware.
- Editor de línea de tiempo básico, reencuadre, música con *ducking*, normalización, subtítulos con Gemini.
- Skills Motion designer y Editor de video.
- **DdT:** un reel de 20 s con ident, clips, subtítulos y cierre CTA se exporta a 1080×1920 y 1920×1080 en una PC de la escuela; los overlays se abren con transparencia en Premiere/Filmora.

### Fase 8 — Lanzamiento
- electron-builder (NSIS + portable), auto-actualización vía Ferozo, pruebas en 3 PCs reales de la escuela.
- Manual, video tutorial, sesión de capacitación, encuesta de usabilidad con 3 compañeros principiantes y correcciones.
- **DdT:** una persona que nunca usó la app instala, inicia sesión y publica una pieza correcta en menos de 10 minutos sin ayuda.

### Fase 9 — Opcional / futuro
- App móvil **Expo (React Native)** reutilizando `packages/core`, `firebase` y `ai`: aprobar, ver el calendario, cargar fotos del taller con consentimiento (sin push: es pago).
- Publicación directa (solo APIs gratuitas): Meta Graph API (Instagram/Facebook, cuentas profesionales y revisión de app), YouTube Data API; LinkedIn y TikTok requieren aprobación de la plataforma; X queda afuera porque su API es paga.
- Métricas automáticas (Instagram Insights, YouTube Analytics) y recomendaciones de horario por datos reales.
- Composiciones 16:9 y 1:1 para el resto de las plantillas.

**MVP = Fases 0 a 6.** El video (Fase 7) es la parte más pesada y conviene después de tener el flujo diario funcionando.

---

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Cambian los límites gratuitos o los modelos de Gemini | Modelos en Remote Config; cuotas por usuario; la app funciona sin IA; plan B con `@google/genai` |
| Se agota el plan gratuito de Firebase (espacio o escrituras diarias) | Fotos comprimidas, exportes y videos solo en la PC, sincronización agrupada, medidor de uso; si se llega al límite, la app sigue funcionando en la PC y sincroniza cuando se renueva |
| PCs viejas (Windows 7/8, poca RAM) | Relevamiento en Fase 0; modo borrador de video; versión portable |
| Ruta con tilde/espacios rompe la compilación | Proyecto en `C:\dev\estudio-cfp401` |
| Login de Google en Electron | Flujo loopback + PKCE (no popup) |
| Firewall escolar bloquea Google/Firebase | Verificación en Fase 0; modo offline completo |
| SmartScreen asusta a usuarios | Manual con capturas; firma de código a futuro |
| Plantillas migradas pierden fidelidad | Regresión visual píxel a píxel contra las piezas aprobadas |
| La IA inventa datos o se sale de marca | Salida estructurada, catálogo como única fuente, Guardián de Marca, aprobación humana |
| Fotos sin autorización de imagen | Campo de consentimiento obligatorio y bloqueo de exportación |
| Alcance que crece sin fin | Fases con DdT; lo no previsto va a Fase 9 con ADR |

---

## 12. Decisiones del responsable (❓) y valores por defecto

| # | Decisión | Por defecto si no hay respuesta |
|---|---|---|
| D1 | Cuenta dueña de Firebase/Google Cloud | Cuenta Google **institucional** creada para el estudio (nunca una personal) |
| D2 | Plan de Firebase | **Decidido: Spark (gratis), sin tarjeta.** No se usa Blaze. |
| D3 | ¿La escuela tiene Google Workspace for Education? | No: los másters de video quedan locales |
| D4 | Repositorio (GitHub, privado) y dueño | Privado, a nombre de la cuenta institucional |
| D5 | Firma de código | Sin firma en la v1 |
| D6 | Inventario de PCs (sistema operativo, RAM) | Asumir Windows 10/11 x64 con 4 GB |
| D7 | Quiénes son `admin` y `revisor` | Responsable del sitio = admin; Dirección = revisor |
| D8 | Publicación directa a redes | Fuera de la v1 |

---

## 13. Prompt de arranque para Antigravity

```
Sos el agente de desarrollo del proyecto "Estudio Redes CFP 401".
Leé completo C:\Users\Nicolás\Desktop\Campus Virtual\PLAN-ESTUDIO-REDES-CFP401.md
y seguilo como fuente de verdad. Después leé las fuentes de la sección 14.

Reglas:
- Trabajá por fases (sección 10). Empezá por la Fase 0. No avances sin cumplir la DdT.
- Creá el código en C:\dev\estudio-cfp401 (ruta ASCII sin espacios). No modifiques
  la carpeta "Sistema de Diseño" ni el sitio web: solo se leen y se copian con script.
- Antes de cada fase, mostrame un plan corto de tareas y esperá mi OK.
- Al terminar cada fase: pruebas en verde, BITACORA.md actualizada, commits
  convencionales en español, y un resumen de qué verificaste y cómo.
- Nunca escribas contraseñas, claves o tokens en archivos, bitácora o chat.
- Si una decisión ❓ (sección 12) te bloquea, usá el valor por defecto y avisame.
- Costo cero: nada que pida tarjeta de crédito o plan pago (sección 1.1).
- Verificá en documentación oficial todo lo que cambia (versiones, modelos de
  Gemini, cuotas gratuitas, medidas de redes, plan de Firebase) antes de usarlo.
- Respetá la marca del CFP 401 tal como está en la skill y el Sistema de Diseño.
```

---

## 14. Fuentes de verdad del proyecto actual (leer antes de programar)

| Qué | Ruta (desde `C:\Users\Nicolás\Desktop\Campus Virtual`) |
|---|---|
| Marca, voz, colores, tipografía, iconografía | `Sistema de Diseño/README.md` |
| Skill del estudio (reglas no negociables, lista de control) | `Sistema de Diseño/skill/cfp401-estudio/SKILL.md` |
| Reglas de marca, piezas, web y audiovisual | `Sistema de Diseño/skill/cfp401-estudio/references/` (`marca.md`, `piezas-redes.md`, `web.md`, `audiovisual.md`) |
| Tokens CSS | `Sistema de Diseño/tokens/` (8 archivos) y `Sistema de Diseño/styles.css` |
| Plantillas aprobadas y formatos | `Sistema de Diseño/Promociones y Redes/README.md` y `templates/` |
| Piezas ya publicadas (referencia visual) | `Sistema de Diseño/Promociones y Redes/Piezas listas/` |
| Logos, fotos y fototeca | `Sistema de Diseño/assets/` (`Logos/`, `fotos/`, `promociones/`) |
| Catálogo de cursos | `CFP 401 Avellaneda WEB v2.0/site/data.js` |
| Generador de promociones del panel (componentes JSX existentes) | `CFP 401 Avellaneda WEB v2.0/fuente-jsx/` (`plantillas-promo.jsx`) y `herramientas/importar-estilos-plantillas.js` |
| Bitácora y estado general del proyecto | `REPORTE-MAESTRO-CONJUNTO.md` |
| Última directiva de Dirección | "Oficial y Gratuito" reemplaza a "100% gratuito" (commit `ce89830`) |
