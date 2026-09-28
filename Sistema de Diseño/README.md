# CFP N° 401 Avellaneda — Design System

Sistema de diseño del **Centro de Formación Profesional N° 401 de Avellaneda** (Gran Buenos Aires), escuela pública de formación profesional gratuita con sede en **Juan Pablo Angulo 1272, Dock Sud**, y anexo en el **Polideportivo Plaza Renunciamiento** (Irala y Argentino Valle). Sitio: `www.cfp401avellaneda.com.ar`. Consultas: WhatsApp 11 6105-6018 (solo mensajes).

La institución opera tres superficies de marca:

1. **Sitio institucional** — oferta formativa, requisitos e inscripción presencial.
2. **Campus Virtual** — aula virtual con marca propia ("CAMPUS VIRTUAL · CFP N°401 Avellaneda").
3. **Piezas para redes** — flyers de curso y placas de aviso en Instagram/Facebook, el canal más activo de comunicación.

## Fuentes recibidas

Archivos institucionales provistos (organizados limpiamente en `assets/`):

| Archivo | Uso |
|---|---|
| `LOGO-ESCUELA-OK-PNG.png` | **Logo institucional horizontal** en alta calidad (arco + cuadrados amarillos + "Centro de Formación Profesional N° 401 Avellaneda - Gran Buenos Aires") → `assets/logo-cfp401-horizontal.png` |
| `LOGO-REDONDO-DESDE-png.png` | Lockup vertical con "Desde 1979" → `assets/logo-cfp401-vertical.png` (+ arco recortado en `assets/isotipo-arco.png` y versiones en blanco) |
| `LOGO-REDONDO-PNG.png` | Sello vertical "C.F.P. N°401 Avellaneda" → `assets/logo-cfp401-sello.png` |
| `LOGO-UOCRA.png` | Marca de Fundación UOCRA → `assets/logo-fundacion-uocra.png` |
| `Logo-campus-horizontal.png`, `Logo-campus-horizontal chico.png` | Marca del **Campus Virtual** — uso exclusivo en el campus |
| `Logo-isotipo.png` | Isotipo del Campus (arco + palabra CAMPUS) — **no usar en el sitio institucional** |
| `favicon.png` | Favicon |
| `IMG-20230427-WA0063.jpg` | QR institucional (conservado en `assets/qr-cfp401.jpg`, **no se usa en el sitio**: apunta a la misma web) |
| `Cursos.png` | Tabla oficial de cursos (fuente de datos de `ui_kits/sitio_institucional/data.js`) |
| `Estilo.png` | Grilla de publicaciones de redes — referencia de estilo gráfico |
| `Info.png` | Copy real de una publicación — referencia de tono |

**No se recibió** ningún repositorio, enlace de Figma, archivo de fuentes tipográficas ni el código del sitio/campus. Siguen faltando `Fundacion UOCRA.png`, `base escuela.jpg` y `Fondo escuela.jpg` (fondos institucionales): si los subís, se incorporan a `assets/`.

**Regla de marcas:** el sitio institucional, las piezas sociales y cualquier documento usan el lockup institucional (`logo-cfp401-*`). La marca **Campus Virtual** (`logo-campus-*`, `logo-isotipo.png`) se reserva para las superficies del aula virtual, que es otra web.

## Índice

| Ruta | Contenido |
|---|---|
| `styles.css` | Punto de entrada; solo `@import` de tokens |
| `tokens/` | 8 archivos de tokens CSS (`fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `base.css`) |
| `assets/` | Recursos gráficos institucionales organizados en 3 subcarpetas (`Logos/`, `fotos/`, `promociones/`) |
| `assets/Logos/` | 20 logotipos, isotipos, sellos, favicon y variantes vectoriales |
| `assets/fotos/` | 11 fotografías y recursos institucionales (héroes, fachada, historia, mapa de sede) |
| `assets/promociones/` | 74 archivos: fototeca curada de los 22 cursos (66 fotos de oficios en alta resolución), logos y arco |
| `guidelines/` | 21 tarjetas de especímenes (Colors, Type, Spacing, Brand) |
| `components/` | Librería modular de 77 componentes React (`core`, `forms`, `navigation`, `content`, `feedback`) |
| `ui_kits/` | Prototipos React (`sitio_institucional/`, `campus_virtual/`, `piezas_sociales/`) |
| `Promociones y Redes/` | Centro de piezas de marketing e imprenta con visor interactivo (`index.html`), manual y plantillas (.dc.html) |
| `skill/` | **La skill del CFP 401 (`cfp401-estudio`)**, la única vigente: marca, piezas para redes, sitio web y video. Incluye el paquete `.skill` para instalar en claude.ai y la evaluación. Instrucciones en `skill/LEEME.md` |

**Adiciones intencionales:** no había una librería de componentes de origen, así que se autoró un set estándar mínimo. `Icon` es un envoltorio sobre Lucide (la marca no provee iconografía propia) y `CourseTable` existe porque la tabla impresa de cursos es un objeto de marca real y recurrente.

---

## CONTENT FUNDAMENTALS

El tono viene directamente del copy real de redes (`assets/referencia-copy-info.png`).

- **Idioma:** español rioplatense, **voseo** obligatorio: "Estudiá con nosotros", "Inscribite", "¿Querés aprender un oficio?", "acercate", "No dejes pasar esta oportunidad". Nunca "tú" ni "usted".
- **Persona:** segunda persona singular al lector, primera del plural para la escuela ("nuestros cursos", "vení a conocer lo que hacemos"). No se usa "yo".
- **Estructura típica de una publicación:** pregunta-gancho → lista de beneficios → datos duros (dirección, horario) → llamado a la acción → hashtags.
  > "¿Querés aprender un oficio, sumar herramientas para trabajar o capacitarte de manera gratuita? ¡Esta es tu oportunidad!"
- **No se nombra el año calendario** en la oferta: los cursos se comunican como cursada en marcha y las inscripciones por período ("de diciembre a febrero", "junio y julio"), nunca "Cursos 2027".
- **Contactos canónicos:** WhatsApp `https://wa.me/541161056018?text=…` y dirección enlazada a Google Maps (ficha "Cfp 401").
- **Frases de marca fijas** (usarlas literalmente): *Es tu tiempo de aprender* · *Estudiá con Nosotros* · *Inscribite ahora* · *Últimos cupos disponibles* · *Gratuito y con certificación oficial* · *1 año de duración* · *Aprendizajes que transforman* · *Porque aprender también es construir futuro*.
- **Casing:** titulares de piezas gráficas en **MAYÚSCULAS** ("CURSOS", "ÚLTIMOS CUPOS DISPONIBLES"); en web, capitalización de oración. Los nombres de curso se escriben con mayúscula inicial en cada palabra significativa y a menudo en *itálica* (herencia de la tabla impresa).
- **Signos:** se usan los pares de apertura (`¿` `¡`) siempre. Signos de exclamación abundantes en piezas sociales, moderados en web (uno por bloque como máximo).
- **Datos duros, siempre completos:** "Lunes, miércoles y viernes de 9:30 a 12:40 hs" · "Sede: Juan Pablo Angulo 1272, Dock Sud" · "Lunes a viernes de 10 a 19 hs" · "WhatsApp al 11 6105-6018 (solo mensajes)". El horario se escribe con "hs", sin punto.
- **Emoji:** **sí en redes**, como viñetas funcionales (✨ 📍 🕐 ✔️ 🚀 en el post real), nunca decorativos dentro del texto. **No** en el sitio ni en el campus: ahí el equivalente es la viñeta amarilla de `InfoList`.
- **Hashtags:** solo al cierre de una publicación, en CamelCase: #CFP401 #Avellaneda #CursosGratuitos #FormaciónProfesional.
- **Vibe:** cercano, directo y de servicio público. Vende oportunidad concreta (gratuito, oficial, con horarios reales), no aspiración abstracta. Evitar jerga educativa ("trayectos de acreditación de saberes") en piezas de captación; usarla solo en documentación formal.

---

## VISUAL FOUNDATIONS

### Color
Dos colores de marca y nada más: **azul institucional** (`--blue-700 #003890`, con `--blue-900 #002878` para profundidad y `--blue-400 #0848d0` para enlaces y el azul más brillante del logo institucional) y **amarillo** (`--yellow-500 #ffd100`). El amarillo es el acento: filetes, subrayados, pill activo, CTA de inscripción — nunca fondos grandes de texto largo. Neutros fríos (`--neutral-*`) para texto y bordes. Máximo dos fondos por composición: blanco/neutral-25 y azul. Los semánticos (verde, rojo, ámbar) existen solo para estados de formulario y campus.

### Tipografía
El sistema no recibió archivos de fuente. **Sustituciones declaradas (Google Fonts):** el wordmark "CAMPUS VIRTUAL" es un grotesco geométrico → **Poppins** (display, 700/800, tracking −0.02em); el logo institucional está compuesto en Arial/Helvetica bold → **Source Sans 3** para texto de interfaz y cuerpo. Escala: display 56 / h1 40 / h2 30 / h3 22 / cuerpo 18-16-14 / antetítulo 12 con tracking 0.14em en mayúsculas. Interlineado 1.6 en cuerpo, 1.0-1.25 en titulares. Itálica semibold para nombres de curso y para el remate "¡Últimos cupos!".

### Espaciado y layout
Base 4px (`--space-1`…`--space-24`). Contenedor 1160px, gutter 24px, ritmo vertical de sección 80px. Grilla de 12 columnas. Los encabezados de sección llevan siempre un filete amarillo de 4px y 64px de ancho bajo el título — es el eco directo del subrayado del isotipo. Barra amarilla de 4px pegada al borde superior del NavBar en todas las superficies.

### Fondos
Tres registros: (1) **blanco/neutral** para lectura; (2) **banda azul plena o `--gradient-hero`** (135°, blue-700→blue-900) para héroes, footer y sidebar del campus, con el isotipo como **marca de agua al 7-9% de opacidad**, desbordando el borde derecho; (3) **papel cuadriculado** (grilla de 46px en `--blue-100`) exclusivo de las piezas sociales, tomado de los flyers reales. Sin gradientes violáceos, sin texturas orgánicas, sin ruido. Las fotografías disponibles son de taller: luz fría, azules de mameluco, tomas documentales sin filtros ni grano; se usan a sangre o en tarjeta con radio 16px, nunca en círculos.

### Bordes, radios y tarjetas
Radios: 4 / 6 / 10 / 16 / 24 y pill. Los botones son **siempre pill**; las tarjetas 16px; los inputs 10px; las celdas de tabla 0. Tarjeta estándar = fondo blanco + borde 1px `--border-subtle` + `--shadow-xs` + radio 16px, con filete amarillo superior de 4px opcional (`accentBar`). **Nunca** tarjetas con borde izquierdo de color como único acento. La tabla de cursos es la excepción deliberada: bordes azules completos en cada celda, cabecera `--blue-100`, para no perder el parecido con la pieza impresa.

### Sombras
Todas con tinte azul (`rgba(0,40,120,…)`), nunca grises neutras: xs 1px, sm 2px, md 6px, lg 16px de blur. Las piezas sociales usan además una **sombra dura** (offset sólido, 0 blur, `--yellow-600` o `--blue-900`) bajo las cintas, imitando el original. No hay sombras internas salvo el halo de foco.

### Transparencia y blur
Uso mínimo y con reglas: scrim de modal `rgba(0,40,120,.45)` con `backdrop-filter: blur(2px)`; marca de agua del isotipo al 7-9%; bordes blancos al 50% para botones fantasma sobre azul. Nada de glassmorphism en tarjetas ni navegación.

### Animación
Discreta y funcional. Duraciones 120 / 200 / 320 ms; easing `cubic-bezier(.2,.6,.2,1)`. Solo fades, cambios de color y traslaciones de 2px. Sin rebotes, sin entradas escalonadas, sin parallax. `prefers-reduced-motion` pone todas las duraciones en 0.

### Estados
- **Hover:** botón primario → azul más oscuro (`--blue-900`); acento → `--yellow-600`; secundario/ghost → fondo `--blue-50`; tarjeta interactiva → sombra md + `translateY(-2px)`; enlaces → `--blue-900` con subrayado.
- **Press:** sin escala; se profundiza el color un paso más.
- **Foco:** halo amarillo `0 0 0 3px rgba(255,209,0,.55)` — visible sobre azul y sobre blanco.
- **Activo (navegación):** subrayado amarillo de 3px en NavBar/Tabs; en el sidebar navy del campus, pill amarillo pleno con texto `--blue-900`.
- **Inactivo:** opacidad 0.45 y cursor `not-allowed`; no se cambia el color.

### Elementos fijos
NavBar `sticky` arriba (z-index 20) con la hairline amarilla; sidebar del campus fija a 248px; modales centrados z-index 60. En el sitio institucional, la franja amarilla de "Inscripción abierta" va inmediatamente bajo el hero, no fija.

---

## ICONOGRAPHY

La institución **no provee un set de iconos**: sus piezas usan ilustraciones y fotografías, y el texto usa **emoji** como viñetas (✨ 📍 🕐 ✔️ 🚀 🖥️ 📄 🎓 en la publicación real). No hay fuente de iconos, sprite ni SVG en los materiales entregados.

**Sustitución declarada:** para interfaces se adopta **Lucide** vía CDN (`https://unpkg.com/lucide@0.460.0/dist/umd/lucide.js`), trazo 2px y terminaciones redondeadas, que es lo más cercano al dibujo lineal del isotipo. Se usa a través de `components/core/Icon.jsx`. Iconos habituales: `graduation-cap`, `wrench`, `clock`, `map-pin`, `file-check`, `file-text`, `calendar-clock`, `message-circle`, `mail`, `upload`, `check-circle-2`.

Reglas: 16-28px, color `--brand-primary` o `currentColor`; nunca rellenos; nunca un icono como único portador de significado (siempre con etiqueta). **Emoji: permitido solo en copy de redes sociales**; en web y campus se reemplaza por la viñeta amarilla de `InfoList`. El lockup institucional (horizontal, vertical, sello), el arco solo, la marca del Campus, Fundación UOCRA y el QR son los únicos gráficos de marca — se usan **tal cual desde `assets/`**, nunca redibujados. Variantes en blanco disponibles para fondos azules: `logo-cfp401-horizontal-blanco.png`, `logo-cfp401-vertical-blanco.png`, `isotipo-arco-blanco.png`.


## Plantillas de piezas (templates/)
Tres modelos, cada uno diseñado por formato (no se estiran de uno a otro). Todo el texto se edita por props; el generador del sitio debe elegir el archivo según el formato de salida.

- **Flyer de curso** — `flyer-curso/` (A4) · `flyer-curso-stories/` (1080×1920)
- **Aviso Inscripciones abiertas** — `inscripciones-abiertas/` (post 1080×1350) · `inscripciones-abiertas-stories/` · `inscripciones-abiertas-a4/` (1240×1754)
- **Promo de curso** — `promo-curso/` (post 1080×1350) · `promo-curso-stories/` · `promo-curso-a4/` (1240×1754)

Una carpeta por formato; cada una trae su `img/` y `ds-base.js`.

Reglas:
- Stories: logo al menos 600 px de ancho; datos de contacto cerca del borde inferior.
- A4: exportar a 2× (2480×3508, 300 dpi) para imprenta.
- Foto circular: la imagen llena el aro amarillo, concéntrica, sin doble línea.
- Sello "100% GRATUITO" montado sobre el borde de la foto.
- Los textos largos pasan a otra línea (`text-wrap: balance`); nunca achicar a mano.
- Vista comparativa: `Vista previa formatos.html`.
