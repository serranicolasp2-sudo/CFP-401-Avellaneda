# Fechas patrias · CFP N° 401 Avellaneda

Template institucional reutilizable para conmemorar fechas patrias argentinas. El ejemplo inicial es el Día de la Bandera (20 de junio), con los textos y la fecha editables para otras jornadas. La identidad visual combina el azul y amarillo CFP con un símbolo contenido de la bandera nacional.

## Archivos y formatos

- `feed.html`: Feed 4:5, 1080 × 1350 px.
- `stories.html`: Stories 9:16, 1080 × 1920 px; mantener el mensaje principal dentro de la zona segura de 150 px arriba y abajo.
- `a4.html`: A4, 1240 × 1754 px; exportar al doble para imprenta.
- `conmemoraciones.css` y `conmemoraciones.js`: diseño adaptable, cuadrícula opcional, escala de vista previa, cambio de foto y ajuste automático del titular.
- `assets/`: logos institucionales originales.

## Uso

1. Abrí el formato en Chrome o Edge. La cuadrícula se muestra por defecto; usá **Quitar cuadrícula / Agregar cuadrícula** para alternar el fondo.
2. Usá **Cambiar foto** para elegir una imagen local distinta en el formato abierto. Feed y A4 usan la foto a sangre como fondo con un degradado azul que protege la lectura; Stories la muestra en el marco fotográfico. En Feed y A4 la imagen se adapta con `cover` y no se repite al quitar la cuadrícula. La foto de ejemplo está en `assets/bandera-argentina-default.png`.
3. Hacé clic en los textos para editar. Cambiá título, fecha, bajada, rótulo de la foto y pie según la conmemoración. No agregues un año si la pieza debe ser reutilizable.
4. El titular se reduce automáticamente hasta su tamaño mínimo para adaptarse al espacio. Usá una versión breve si la fecha tiene un nombre oficial largo; no tapes la fecha, la foto ni el pie.
5. Exportá solo `#artboard` después de cargar las tipografías: Chrome/Edge → F12 → seleccionar `<article id="artboard">` → `Ctrl+Shift+P` → **Capture node screenshot**.

## Campos y ejemplos de fechas

Campos editables: categoría institucional, efeméride, fecha, mensaje, leyenda del símbolo y texto de cierre. Fechas patrias listadas en los datos institucionales: 24/03 Día Nacional de la Memoria por la Verdad y la Justicia; 02/04 Día del Veterano y de los Caídos en la Guerra de Malvinas; 25/05 Revolución de Mayo; 20/06 Paso a la Inmortalidad del Gral. Manuel Belgrano / Día de la Bandera; 09/07 Día de la Independencia; 17/08 Paso a la Inmortalidad del General José de San Martín. Confirmá título y fecha vigentes antes de publicar.

## Revisión antes de exportar

- Revisá por separado los tres formatos; el titular, la fecha, el símbolo, la bajada y el pie no deben superponerse ni quedar cortados.
- Comprobá el titular con la fecha más larga y un título de hasta tres líneas. La herramienta achica la tipografía, pero el texto debe seguir siendo legible.
- Probá el fondo cuadriculado y el liso en cada lienzo. En Feed y A4, la trama sutil queda sobre la foto y desaparece al quitarla; la lectura se protege con el degradado azul. El celeste aparece en la bandera nacional y en la foto conmemorativa; la interfaz conserva los colores CFP.
- Probá una foto clara y otra oscura en Feed, Stories y A4: el texto debe conservar contraste y ningún rostro, bandera u objeto importante debe quedar tapado o recortado de forma accidental.
- En Stories, mantené titular, fecha y mensaje fuera de las zonas de controles de la plataforma.
- No uses año, horarios ni información sobre suspensión de clases sin confirmarlos para la publicación concreta.
