# Últimos cupos · CFP N° 401 Avellaneda

Template editorial para comunicar que quedan pocos lugares en un curso y llevar consultas al WhatsApp institucional. El curso se deja como campo editable: no inventa cantidad exacta de vacantes, fecha de cierre, horarios ni sede.

## Composiciones

- `feed.html`: Feed 4:5, 1080 × 1350 px; titular y datos a la izquierda, foto vertical protagonista a la derecha, CTA en franja inferior.
- `stories.html`: Stories 9:16, 1080 × 1920 px; titular centrado, foto amplia y pie de contacto dentro de la zona segura de 150 px.
- `a4.html`: afiche A4, 1240 × 1754 px; márgenes amplios para la columna de texto y foto vertical destacada. Exportar al doble, 2480 × 3508 px.
- `ultimos-cupos.css` / `ultimos-cupos.js`: estilos, selector de foto, alternador de cuadrícula, ajuste del titular y escala de vista previa.
- `assets/`: fotografía inicial de taller y logos CFP originales.

## Uso

1. Abrí el formato deseado en Chrome o Edge. La cuadrícula está activa por defecto; **Quitar cuadrícula / Agregar cuadrícula** alterna la trama en ese lienzo.
2. Editá los textos con clic. Reemplazá `[NOMBRE DEL CURSO]` por el curso confirmado. Cambiá “¡Últimos cupos!” por una frase vigente solo cuando la disponibilidad haya sido verificada.
3. Usá **Cambiar foto** para elegir una imagen real del taller. Comprobá que la imagen no tape el titular, el nombre del curso ni el CTA.
4. El rótulo, teléfono y “(solo mensajes)” están en la columna de WhatsApp. El número institucional se mantiene en 11 6105-6018.
5. Para exportar, esperá a que carguen las fuentes y capturá solo `<article id="artboard">` desde DevTools → **Capture node screenshot**. No incluyas la barra del editor.

## Campos editables

Antetítulo, titular, nombre del curso, bajada, días/horarios/requisito, distintivos de gratuidad/certificación, leyenda de foto, CTA, rótulo de WhatsApp, número y nota “solo mensajes”. El texto inicial evita afirmar un número de lugares o una fecha de cierre que no se haya confirmado.

## Control antes de publicar

- Confirmá que efectivamente quedan vacantes y que la inscripción sigue abierta; ajustá el texto si cambió el estado.
- Confirmá el nombre del curso y que correspondan gratuidad y certificación oficial.
- Revisá Feed, Stories y A4 por separado: ningún texto, foto, sombra o franja puede superponerse, ocultarse o salir del lienzo. Comprobá también el estado con y sin cuadrícula.
- Stories: mantené titular y datos importantes fuera de los 150 px superiores e inferiores.
- A4: conservá el margen visual de 88 px (≈15 mm) para el contenido esencial.
- Verificá contraste de textos sobre fotos claras u oscuras y el recorte de la foto seleccionada.
