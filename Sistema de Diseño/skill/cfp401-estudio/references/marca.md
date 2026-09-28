# Marca CFP N° 401 Avellaneda

Fuente de verdad: `Sistema de Diseño/README.md` y `Sistema de Diseño/tokens/`, más los diseños aprobados por el responsable del sitio (27/09/2026). Donde el README y las piezas aprobadas no coinciden, esta guía ya indica qué vale (ver "Decisiones que resuelven contradicciones").

## Índice
1. Datos institucionales
2. Voz y copy
3. Color
4. Tipografía
5. Logos
6. Recursos gráficos propios
7. Fotografía
8. Decisiones que resuelven contradicciones

## 1. Datos institucionales

La fuente viva es `CFP 401 Avellaneda WEB v2.0/site/data.js` (se edita desde el panel). Estos son los valores al 27/09/2026; si tenés acceso a `data.js`, confirmalos ahí antes de publicar.

| Dato | Valor |
|---|---|
| Nombre | Centro de Formación Profesional N° 401 Avellaneda (CFP N° 401 Avellaneda) |
| Sede | Juan Pablo Angulo 1272, Dock Sud, Avellaneda |
| Anexo | Polideportivo Plaza Renunciamiento — Irala y Argentino Valle |
| Atención | Lunes a viernes de 9 a 22 hs |
| WhatsApp | 11 6105-6018 (solo mensajes) · enlace `https://wa.me/541161056018?text=…` |
| Teléfonos | 4222-5418 · 4222-4217 |
| Sitio | www.cfp401avellaneda.com.ar |
| Certificación | Oficial, DGCyE (Dirección General de Cultura y Educación de la Provincia de Buenos Aires) |
| Oferta | 22 cursos gratuitos en 7 familias: Administración, Construcción, Electricidad, Climatización, Energías Renovables, Informática, Metalmecánica |
| Inscripción | Presencial en la sede, con 4 fotocopias del DNI y la constancia de estudios que pida el curso. Dos períodos por año: de noviembre a febrero (cursos que empiezan en marzo) y junio-julio (cursos de agosto) |

Cada curso tiene en `data.js` nombre, familia, días y horarios (a veces varios turnos), duración, horas totales, sede y requisitos. Nunca completes un horario "probable": copialo.

## 2. Voz y copy

- **Voseo siempre:** "Estudiá con nosotros", "Inscribite", "¿Querés aprender un oficio?", "Acercate". Nunca "tú" ni "usted".
- **Persona:** al lector en segunda persona singular; la escuela en primera del plural ("nuestros cursos").
- **Tono:** cercano, directo, de servicio público. Vende una oportunidad concreta (gratis, oficial, con horarios reales), no promesas abstractas. Evitá la jerga educativa ("trayectos formativos de acreditación") en piezas para captar alumnos.
- **Frases de marca (literales):** *Es tu tiempo de aprender* · *Estudiá con nosotros* · *Inscribite ahora* · *Últimos cupos disponibles* · *Gratuito y con certificación oficial* · *Aprendizajes que transforman* · *Porque aprender también es construir futuro*. ("1 año de duración" solo si el curso es anual: hay cursos cuatrimestrales.)
- **Mayúsculas:** titulares de piezas gráficas en MAYÚSCULAS; en la web, mayúscula inicial de oración. Siempre `¿` y `¡` de apertura.
- **Datos:** horarios con "hs" sin punto ("de 18:00 a 21:30 hs"); días en minúscula dentro de la frase ("Lunes y jueves", "martes a viernes").
- **Año calendario:** no se nombra en la oferta ("Cursos 2027" no); se habla de períodos de inscripción. Excepción: la Agenda anual de efemérides.
- **Emoji:** en textos de publicaciones sí, como viñetas funcionales (📍 🕐 ✔️ ✨ 🎓); nunca en el sitio ni dentro de las piezas gráficas.
- **Estructura de un posteo (texto que acompaña la imagen):** pregunta gancho → beneficios → datos duros (curso, días, horario, sede) → llamado a la acción (WhatsApp o acercarse a la sede) → hashtags al final: `#CFP401 #Avellaneda #CursosGratuitos #FormaciónProfesional`.

## 3. Color

| Rol | Color | Token |
|---|---|---|
| Azul institucional (fondos, titulares sobre blanco, botones) | `#003890` | `--blue-700` / `--brand-primary` |
| Azul profundo (degradés, sombras duras, píldoras, textos de título) | `#002878` | `--blue-900` |
| Azul brillante (enlaces, brillo del degradé) | `#0848d0` | `--blue-400` |
| Azul claro (cuadrícula de fondo, bordes suaves) | `#c0d0f0` | `--blue-100` |
| Amarillo de acento | `#ffd100` | `--yellow-500` / `--brand-accent` |
| Amarillo profundo (sombra dura bajo cintas, hover) | `#f5b800` | `--yellow-600` |
| Texto de cuerpo / apagado | `#333c4a` / `#66707f` | `--neutral-700` / `--neutral-500` |

Reglas y por qué:
- **Solo azul y amarillo como colores de marca.** Es lo que hace reconocible una pieza del CFP en el feed a primera vista. Verde, rojo y ámbar existen solo para estados de formularios.
- **Efemérides patrias:** se puede usar celeste y blanco junto con el sol amarillo dentro de un símbolo contenido de la bandera argentina. Es una referencia nacional de la fecha, no un cambio a la paleta institucional del CFP.
- **El amarillo es acento, no fondo de texto largo:** filetes, cápsulas, cintas, sellos, aros, píldora de WhatsApp. Con amarillo detrás, el texto va en azul `#002878` (nunca blanco: no se lee).
- **Máximo dos fondos por composición** (blanco/gris muy claro + azul, o azul pleno).
- **Degradé institucional:** `linear-gradient(135deg, #003890, #002878)`. Sin degradés violetas, texturas aleatorias, ruido ni glassmorphism; el papel cuadriculado sutil descrito abajo es una excepción aprobada.
- **Sombras con tinte azul** (`rgba(0,40,120,…)`), nunca grises. En piezas, la **sombra dura** (desplazada, sin desenfoque, en `#002878` o `#f5b800`) bajo cintas y sellos es un rasgo de marca.

Todos los valores están en `assets/tokens.css`.

## 4. Tipografía

- **Poppins** 700/800 → titulares, nombres de curso en piezas, cifras, palabras clave ("INSCRIPCIONES", "100%"). Tracking levemente negativo en tamaños grandes (−0,02em).
- **Source Sans 3** 400/600/700 → bajadas, datos (días, horarios, sede, requisitos), textos de interfaz.
- Ambas son de Google Fonts (gratuitas; instalar en la PC para usarlas en Adobe o Filmora). En HTML: el `@import` de `assets/tokens.css`.
- **Antetítulos:** 12 px (web) o proporcional en piezas, mayúsculas, peso 700, tracking 0,14em, a menudo con un guion amarillo delante ("— FORMACIÓN PROFESIONAL").
- **Interlineado:** 1,6 en textos; en titulares en mayúsculas nunca menos de **1,04** (con menos, el tilde de "BÁSICO" o "ELÉCTRICO" toca la línea de arriba; pasó y hubo que corregirlo).
- Nombres de curso en la web: mayúscula inicial en cada palabra significativa, a veces en itálica semibold.
- Los textos largos pasan a otra línea (`text-wrap: balance` en HTML); el tamaño se ajusta al espacio, pero nunca por debajo de lo legible en un celular.

## 5. Logos

Archivos en `assets/logos/` (copias de `Sistema de Diseño/assets/Logos/`):

| Archivo | Uso |
|---|---|
| `logo-cfp401-horizontal.png` (2820×301) | Logo principal sobre fondos claros |
| `logo-cfp401-horizontal-blanco.png` | Sobre azul o foto oscura |
| `logo-cfp401-vertical.png` / `-vertical-blanco.png` | Composiciones cuadradas o centradas ("Desde 1979") |
| `logo-cfp401-sello.png` | Sello circular (perfil de redes, cierres de video, sellos de calidad) |
| `isotipo-arco.png` / `isotipo-arco-blanco.png` (928×695) | Arco solo: marca de agua (7–9% de opacidad) y recurso gráfico |
| `logo-fundacion-uocra.png` | Solo cuando la pieza involucra a la Fundación UOCRA |

- Nunca redibujar, recolorear (salvo usar la versión blanca que ya existe), estirar, rotar, ponerle sombras ni rearmarlo con texto.
- Dejar aire alrededor: como mínimo la altura de la línea "N° 401 Avellaneda" del propio logo.
- Tamaño práctico en lienzos de 1080 px de ancho: logo horizontal de al menos 280 px (si no, "Gran Buenos Aires" deja de leerse); en Stories, cuando encabeza la pieza, 600 px o más.
- **Campus Virtual** (`logo-campus-*`, `logo-isotipo.png`, en `Sistema de Diseño/assets/Logos/`): solo para piezas del aula virtual. No se mezcla con el logo institucional en la misma pieza, salvo una pieza que presente el campus.

## 6. Recursos gráficos propios

- **Filete amarillo** de 4 px (64 px de ancho en web) bajo títulos de sección: es el eco del subrayado del isotipo.
- **Arco como marca de agua:** isotipo blanco al 7–9% sobre fondos azules, grande y desbordando un borde.
- **Papel cuadriculado:** grilla sutil de aproximadamente 46 px (a 1080 de ancho) en `#c0d0f0` sobre blanco. Es un recurso aprobado para piezas de redes, usado por el flyer estándar y disponible como opción en el template de captación. Si una referencia ya la trae, conservá ese estado por defecto; no la elimines a partir de un comentario visual ambiguo. Cuando el brief requiera versiones con/sin trama, hacé visible el control en cada formato y verificá ambas variantes.
- **Cápsula, cinta y sello amarillos** con sombra dura azul: portadores de "¡INSCRIBITE AHORA!" y "100% GRATUITO".
- **Píldora de WhatsApp:** número en Poppins 700; sobre fondo azul, píldora amarilla con número azul `#002878`; sobre fondo blanco, píldora `#002878` con número amarillo.
- **Botones** siempre en píldora (radio 999 px); tarjetas con radio 16 px.
- Íconos (solo en interfaces): Lucide, trazo 2 px, sin relleno, siempre con etiqueta.

## 7. Fotografía

- Fotos reales de taller: luz natural o fría, estilo documental, sin filtros, sin grano, sin viñetas. Personas trabajando con herramientas reales.
- Hay 3 fotos por curso en `Sistema de Diseño/assets/promociones/talleres/{slug-del-curso}-{1,2,3}.jpg` (también quedan copias en `assets/promociones/`), fotos temáticas para campañas (captación, días patrios, últimos cupos, listado anual, cuatrimestrales) en `assets/promociones/tematicas/`, y fotos institucionales (fachada, egresados, talleres) en `assets/fotos/`.
- Recortes según el modelo: **arco** (flyer estándar), **círculo con aro amarillo** (inscripciones abiertas), **a sangre** (promo alternativa, héroes web), **tarjeta de radio 16 px** (web).
- No uses imágenes generadas por IA para representar talleres o alumnos: la gente tiene que reconocer su escuela.

## 8. Decisiones que resuelven contradicciones

- El README del Sistema de Diseño dice "fotos nunca en círculos": **quedó superado** por el modelo Inscripciones abiertas, diseñado por el responsable del sitio con foto circular y aro amarillo. El círculo se usa en ese modelo; en el resto, no.
- El README ubica los modales en z-index 60 y el NavBar en 20: en el sitio real el encabezado fijo usa 100, así que los modales van por encima (200). Ver `web.md`.
- Tamaño A4: se diseña a 1240×1754 y se exporta al doble (2480×3508, 300 dpi).
- La zona segura de Stories es de 150 px arriba y abajo; los diseños aprobados de Inscripciones y Promo alternativa apoyan el pie a unos 75 px del borde inferior. En WhatsApp Estados no molesta; para Instagram Stories conviene subir los datos de contacto por encima de los 150 px o comprobarlo en un celular.
