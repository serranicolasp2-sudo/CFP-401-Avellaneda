# Piezas para redes e imprenta

Leé antes `marca.md`. Esta guía cubre posts, stories, flyers, afiches A4 y el diseño de **templates nuevos**.

## Índice
1. ¿Hace falta diseñar? (el generador del panel)
2. Formatos y zonas seguras
3. Los 3 modelos aprobados
4. Crear un template nuevo
5. Producir en HTML (con Claude)
6. Producir en Adobe
7. Exportación y nombres de archivo
8. Texto del posteo
9. Control final

## 1. ¿Hace falta diseñar?

Para promocionar **un curso** o **la apertura de inscripciones** con alguno de los 3 modelos aprobados, no hay que diseñar: el panel del sitio (`admin.html` → "Promociones y Flyers" → "Nueva promoción") arma la pieza con los datos y fotos del curso, deja editar todos los textos y descarga el PNG en Feed, Historia y A4. Recomendalo primero. Diseñá cuando la pieza es otro tipo de comunicación (evento, efeméride, egresados, jornada de puertas abiertas, aviso de feriado, carrusel informativo) o cuando se pide un modelo nuevo.

## 2. Formatos y zonas seguras

| Formato | Lienzo de diseño | Exportación | Zona segura |
|---|---|---|---|
| Feed Instagram/Facebook (4:5) | 1080×1350 | 1080×1350 (el panel exporta a 1350×1687) | Todo visible; en la grilla del perfil se ve el centro recortado a 3:4, así que el titular no va pegado arriba ni abajo |
| Stories / WhatsApp Estados / portada de Reel (9:16) | 1080×1920 | 1080×1920 (el panel: 1350×2400) | 150 px libres arriba (nombre de la cuenta) y abajo (caja de respuesta); nada importante en los 60 px laterales |
| Afiche A4 (imprenta, cartelera) | 1240×1754 | 2480×3508 (300 dpi) o PDF | Margen de 15 mm (≈ 88 px a 1240 de ancho); si va a imprenta, pedir sangrado (habitualmente 3 mm) |
| Carrusel | 1080×1350 por lámina | PNG por lámina, numeradas | Igual que Feed; la primera lámina funciona sola como portada |

Los tamaños de las plataformas cambian: si la precisión importa, confirmalos en la ayuda oficial de Instagram/Meta antes de fijarlos.

**Cada formato se compone aparte.** Una Story no es un Feed estirado: tiene más alto para la foto y el titular, y los datos se acomodan distinto. Diseñá el formato principal y después adaptá la composición de cada uno.

## 3. Los 3 modelos aprobados

Referencias de diseño: `Sistema de Diseño/Promociones y Redes/templates/` (archivos `.dc.html` que se abren en el navegador; `index.html` muestra todos los formatos con las zonas seguras). La versión que usa el generador del panel está en `CFP 401 Avellaneda WEB v2.0/fuente-jsx/plantillas-promo.jsx`.

**A · Flyer de curso estándar** (`flyer-curso/`): fondo de papel cuadriculado; antetítulo "— CURSO · FORMACIÓN PROFESIONAL"; nombre del curso en Poppins 800 azul, mayúsculas, interlineado 1,04–1,08; foto recortada en **arco** con borde amarillo; frase "ES TU TIEMPO DE APRENDER" sobre la foto; **cápsula amarilla** vertical con "¡INSCRIBITE AHORA!", días y horario, y el círculo blanco "100% GRATUITO"; franja azul con Requisito · Sede · Certificación; pie con logo blanco y píldora de WhatsApp. En Stories: titular arriba a todo el ancho, foto y cápsula lado a lado debajo.

**B · Promo de curso alternativa** (`promo-curso/`): foto **a sangre** en la mitad superior con degradé oscuro hacia abajo; logo arriba; **cinta amarilla** con corte en V "100% GRATUITO" en una esquina; **tarjeta blanca** flotante con el nombre del curso y una bajada; grilla de 4 datos (Días, Horario, Duración, Requisito) sobre azul con filetes amarillos; franja amarilla de WhatsApp.

**C · Inscripciones abiertas** (`inscripciones-abiertas/`, no ligada a un curso): fondo azul con el arco como marca de agua detrás del titular; logo arriba; **foto circular** con aro amarillo que desborda el borde derecho; **sello** amarillo "100% GRATUITO" rotado −12° con sombra dura azul, montado sobre el borde de la foto; antetítulo, "INSCRIPCIONES" blanco y "ABIERTAS" dentro de una caja amarilla; bajada; **familias de oficios** como píldoras con borde blanco; pie blanco con Inscripción · Sede · WhatsApp (en Stories, en dos filas con el número alineado bajo la sede). En Stories la foto mide 754 px de diámetro, arranca a 213 px del borde superior, y lleva un aro de 26 px. En Feed (ajuste del responsable, 27/09) la foto mide 765 px con un aro de 855 px, anclada arriba a la derecha y desbordando (se ve su cuarto inferior izquierdo); el sello, de 236 px, va montado sobre el borde inferior izquierdo del aro, justo encima del antetítulo (que con sello no pasa de 540 px de ancho), y el rótulo WHATSAPP del pie va alineado a la izquierda con el número.

Lo que tienen en común (el ADN que un template nuevo debe conservar): azul pleno o blanco como fondo, un único elemento amarillo protagonista con sombra dura, titular Poppins 800 en mayúsculas muy grande, foto real de taller con un recorte con forma, datos duros en Source Sans 3 bien ordenados, logo institucional y WhatsApp siempre visibles.

## 4. Crear un template nuevo

Objetivo: que se sienta de la familia de los 3 modelos sin copiar ninguno, y que después cualquiera lo pueda reutilizar cambiando solo textos y foto.

1. **Propósito y contenido.** Qué comunica (evento, fecha, logro, aviso), qué datos lleva siempre y cuáles son opcionales, y cuál es la acción (escribir por WhatsApp, acercarse a la sede, ver el sitio). Listá los campos editables: antetítulo, titular, bajada, datos 1..n, llamado a la acción, foto.
2. **Jerarquía.** Una sola entrada visual (titular o foto), después el dato clave (fecha, horario), después la acción. Si todo es grande, nada es grande.
3. **Composición propia sobre el ADN.** Elegí un recorte de foto (arco, círculo, a sangre, tarjeta o una forma nueva geométrica y simple), un portador amarillo (cápsula, cinta, sello, caja, franja) y un fondo (azul, blanco o cuadriculado). Variá la disposición, no el lenguaje.
4. **Tres formatos.** Feed primero; después Stories (aprovechá el alto: foto y titular más grandes, datos abajo pero dentro de la zona segura); después A4 (más aire, datos más grandes, pensado para leerse a 2 m).
5. **Prueba de estrés.** Probá con el peor caso real, no con "Lorem ipsum":
   - titular larguísimo: *Montador de Instalaciones Sanitarias y de Gas Domiciliario + Instalador de Sistemas Térmicos Sanitarios de Energías Renovables*;
   - varios turnos: *Martes y jueves de 9:10 a 12:10 hs · Martes y jueves de 13:50 a 16:50 hs · Martes y viernes de 18:00 a 21:10 hs*;
   - dos sedes: *Sede Juan Pablo Angulo 1272, Dock Sud y Anexo Polideportivo Plaza Renunciamiento*;
   - mayúsculas con tilde en la primera línea (BÁSICO, ELÉCTRICO).
   Definí qué pasa en cada caso (el titular se achica hasta un mínimo y pasa a otra línea; los turnos se resumen al principal; nada se superpone).
6. **Control de composición.** Revisá Feed, Stories y A4 como lienzos independientes, en el tamaño final y con el contenido real más largo. Ningún texto, foto, sombra, placa o footer puede superponerse, tapar otro contenido ni quedar cortado por el borde. Comprobá especialmente el espacio entre titular y bajada, bajada y datos, foto y columna de texto, y los dos grupos del footer. Si hay colisión, refluí, redimensioná o reubicá; no la des por aceptada porque el texto "entra" en una caja.
7. **Opciones de fondo.** No quites una trama, textura o fondo presente en la referencia sin que lo pidan. Si el diseño debe permitir elegir, ofrece un control claro de cuadrícula/fondo liso en cada formato, conserva por defecto el aspecto aprobado y prueba ambos estados en los tres lienzos. Para el papel cuadriculado CFP, usá líneas sutiles `#c0d0f0` sobre blanco, debajo del contenido y sin competir con la lectura.
8. **Contacto y footer.** Comprobá contraste entre cada texto y el color real detrás: sobre azul, el rótulo WhatsApp va blanco y la píldora amarilla lleva número azul profundo. El texto “ESCRIBINOS POR WHATSAPP” va inmediatamente encima del teléfono. Si se usa “(solo mensajes)”, alineá los tres elementos según la referencia aprobada para ese diseño; no asumas que todos los formatos usan una alineación distinta.
9. **Inspección final.** Mirá la exportación o render final de los tres tamaños (no solo una captura parcial del editor), tanto con el texto normal como con el caso de estrés. Revisá recortes, solapamientos, contraste, alineación, zonas seguras y el estado de cada opción visual. Una medición de cajas o un chequeo de sintaxis ayuda, pero no reemplaza la inspección del render.
10. **Entrega para el equipo.** Guardá el diseño en `Sistema de Diseño/Promociones y Redes/templates/{nombre-del-template}/` con una variante por formato, y sumá al `README.md` de esa carpeta: para qué sirve, campos editables, medidas clave, opciones visuales y reglas de estrés. Si trabajás en el proyecto, registrá el agregado en la bitácora de `REPORTE-MAESTRO-CONJUNTO.md` (autor, fecha, archivos).
11. **Llevarlo al generador del panel** (opcional). Eso ya es trabajo en el sitio: ver "Agregar una plantilla al generador" en `web.md`.

### Patrón aprobado: captación general de consultas

Al continuar o derivar la plantilla `templates/captacion-oficios/`, respetá estas decisiones aprobadas:

- La cuadrícula CFP es opcional, está activada por defecto y el control para alternarla aparece en Feed, Stories y A4.
- Feed y A4 separan claramente la columna del titular/bajada de la foto. La bajada no se acerca ni se oculta bajo la placa amarilla del titular; datos y footer mantienen distancias compactas sin colisiones.
- En Stories, la foto va antes de las cápsulas institucionales centradas; el bloque de texto del CTA queda a la izquierda y el grupo de WhatsApp a la derecha, próximos entre sí.
- En los tres formatos, centrà “ESCRIBINOS POR WHATSAPP” y el teléfono sobre un mismo eje vertical situado aproximadamente al 74,5% del ancho del lienzo. Alineá el borde derecho de “(solo mensajes)” con el último dígito del número. Conservá margen al borde y separación clara del texto izquierdo. Sobre el footer azul, el rótulo es blanco y el número va en azul profundo sobre amarillo.

Tomá estas decisiones como referencia de esta familia de captación; adaptá medidas al lienzo en lugar de copiar posiciones en píxeles entre formatos.

### Template editorial: conmemoraciones patrias

El modelo `templates/conmemoraciones-patrias/` usa el Día de la Bandera (20 de junio) como ejemplo editable de efeméride. Feed, Stories y A4 tienen composiciones propias, con cuadrícula opcional activada por defecto y control en cada lienzo. Incluí **Cambiar foto** en los tres formatos: Feed y A4 usan una fotografía protagonista a sangre como fondo, con un degradado azul que conserva el contraste; Stories usa un marco fotográfico amplio. Al reemplazar la imagen, comprobá recorte, legibilidad sobre zonas claras/oscuras y que ningún texto o elemento importante quede tapado o fuera del lienzo. Al ocultar la trama, reiniciá también `background-size`, `background-position` y `background-repeat` para que la foto mantenga `cover` y una sola instancia, sin mosaico. El titular se adapta al espacio y la fecha y bajada deben quedar separadas. Confirmá fecha y denominación antes de publicar; no agregues año ni afirmes suspensión de clases si no está verificada.

### Template editorial: últimos cupos disponibles

El modelo `templates/ultimos-cupos/` avisa que hay vacantes en un curso y dirige las consultas al WhatsApp institucional. Tiene Feed, Stories y A4 independientes, foto reemplazable, textos editables y cuadrícula opcional. No precargues una cantidad exacta de vacantes, un cierre ni fechas/horarios: verificá disponibilidad con el equipo antes de publicar. Comprobá legibilidad y recorte de la foto, espacio entre foto y texto y el eje del bloque de WhatsApp; en los tres formatos, su centro se mantiene al 74,5% del ancho, y “(solo mensajes)” alinea a la derecha con el teléfono. En Stories, respetá la zona segura inferior de 150 px.

### Template editorial: listado de cursos por inicio

El modelo `templates/grilla-cursos-inicio/` informa cursos anuales y cuatrimestrales que comienzan en marzo o agosto. Tiene tres formatos (Feed, Stories y A4) y dos composiciones por formato: tarjetas en grilla y una ficha por fila. El selector lee `CFP_DATA.courses` desde `CFP 401 Avellaneda WEB v2.0/site/data.js`; si el navegador local bloquea esa carga, permite elegir `data.js` desde un botón y parsea el JSON de la asignación sin ejecutar código. La persona elige período y cursos; columnas, filas y tamaño de texto se adaptan a la cantidad. **Cada curso debe incluir siempre días y horarios (`horarios`) y requisitos (`requisitos`), junto con el nombre y la modalidad.** Copiá esos campos literalmente desde `data.js`; si falta alguno, mostrar “A confirmar”. El botón “Seleccionar todos (listado general)” permite incluir los 22 cursos para el comienzo de ciclo de marzo. La composición por filas muestra toda la selección en una sola página y adapta alto de fila y tipografía; alinea el nombre de cada curso, “Días y horarios” y “Requisitos” al inicio de fila y los centra verticalmente según la altura de cada fila. Muestra “ANUAL” o “CUATRIMESTRAL” sin salto de línea contra el margen inferior derecho de la fila; si hace falta, reducir solo la tipografía de esta última columna y conservar las otras proporciones/tamaños. Usá `*` en modalidad de doble comisión o que requiera confirmación; no agregues la leyenda explicativa que se retiró del footer. La composición en grilla puede paginar si es necesario; la información de página corresponde a los controles de edición y no se imprime en el arte. No trunques campos ni permitas solapamientos; revisá el registro más extenso en los tres formatos y a tamaño real. En las composiciones Grilla, mantené título, horario y requisitos con un tamaño claramente legible; si un título ocupa varias líneas, ubicá el período por debajo de su bloque visual completo (en particular en Stories y A4). Eliminá bordes y alertas de diagnóstico del render final. Los casos con período no explícito (duración a consultar/doble comisión) quedan disponibles para selección manual con etiqueta de confirmación. `data.js` no incluye vacantes: confirmar cupos e inscripción vigente antes de usar el rótulo “Últimos cupos”. En los seis archivos Feed/Stories/A4 de Grilla y Filas, el último carácter de “(solo mensajes)” debe coincidir horizontalmente con el último carácter de “ESCRIBINOS POR WHATSAPP”. Cuadrícula opcional y zona segura inferior de 150 px en Stories.

## 5. Producir en HTML (con Claude)

Es el camino más preciso cuando la pieza la produce Claude: el HTML se ve en el navegador y se exporta a PNG sin perder calidad.

- Un archivo por formato, con el lienzo exacto (`width:1080px;height:1350px`) y todo el texto real, no en imágenes.
- Tipografías y colores con `assets/tokens.css` (incluye Google Fonts) o copiando el `@import` y los valores.
- Logos por ruta relativa a los PNG de `assets/logos/` (copialos junto al HTML) o incrustados en base64 si el archivo tiene que viajar solo.
- Para escalar entre formatos, usá medidas relativas al lienzo (`cqw` con `container-type: size`, o `%`) en lugar de px sueltos.
- En grillas, `grid-template-columns: repeat(2, minmax(0, 1fr))` y no `1fr 1fr` (el `minmax(0, …)` evita que un texto largo rompa la columna, y el CSS del panel para celulares pisa los estilos que contienen `1fr 1fr` literal).
- Exportación: abrir en Chrome/Edge y capturar el nodo del lienzo (DevTools → clic derecho sobre el nodo → "Capture node screenshot"), o con `html-to-image` pasando las fuentes incrustadas. Esperar a que carguen las fuentes (`document.fonts.ready`) antes de exportar: si no, sale en Arial.

## 6. Producir en Adobe

- **Photoshop / Illustrator:** una mesa de trabajo por formato con los tamaños de la sección 2, en RGB (sRGB). Guías en las zonas seguras. Logos colocados como archivo enlazado (Colocar), nunca vectorizados a mano. Estilos de párrafo o de carácter con Poppins y Source Sans 3 para que el template sea reutilizable; textos en capas con nombre ("TITULAR", "DIAS", "HORARIO").
- **InDesign:** para A4 y piezas con mucho texto. Documento A4 con 3 mm de sangrado y márgenes de 15 mm; exportar PDF de imprenta (consultar a la imprenta el perfil; si no dicen nada, PDF/X-4).
- **Adobe Express:** para variantes rápidas del equipo, partiendo de un diseño ya aprobado.
- Colores exactos: `#003890`, `#002878`, `#ffd100`, `#f5b800`, `#c0d0f0`. Si la imprenta pide CMYK, convertir al final y revisar que el amarillo no se ensucie.
- Para compartir el template: `.psd`/`.ai`/`.indd` con capas nombradas, fuentes indicadas y los logos enlazados desde `Sistema de Diseño/assets/Logos/`.

## 7. Exportación y nombres de archivo

- PNG en sRGB para redes (JPG al 90% solo si hace falta pesar menos para WhatsApp). A4: PNG a 2480×3508 o PDF.
- Nombres: `{modelo}-{curso-o-tema}-{formato}.png`, por ejemplo `promo-curso-soldador-basico-stories.png`. Si ya existe, agregá sufijo de versión (`-v2`) en lugar de pisar el anterior.
- Revisá el archivo exportado (no solo la vista previa): fuentes correctas, sin textos cortados y con el tamaño en píxeles pedido.

## 8. Texto del posteo

Si piden el texto que acompaña la imagen: pregunta gancho → 2 o 3 beneficios con emoji como viñeta (📍 🕐 ✔️) → datos (curso, días, horario, sede) → acción ("Escribinos por WhatsApp al 11 6105-6018" o "Acercate a la sede") → hashtags. Voseo, sin año calendario, con los datos copiados de `data.js`.

## 9. Control final

- La pieza se entiende en 2 segundos en un celular: qué es, para quién, qué hay que hacer.
- Datos literales; WhatsApp 11 6105-6018; horarios con "hs".
- Logo institucional original, legible y en la versión de color correcta para el fondo.
- Probado con el peor caso de texto; tildes sin chocar; nada fuera de la zona segura.
- Tres formatos compuestos por separado, exportados en la resolución de la tabla.
