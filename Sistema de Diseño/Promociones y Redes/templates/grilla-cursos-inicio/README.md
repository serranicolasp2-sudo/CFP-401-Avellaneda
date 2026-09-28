# Grilla de cursos por inicio · CFP N° 401 Avellaneda

Template editorial, centrado en el listado y la selección de cursos para comunicar cupos disponibles antes de cada comienzo de clases. A diferencia de los templates de captación, no usa una foto como foco: organiza la información de `data.js` en una grilla que se compacta o amplía con la cantidad elegida.

## Formatos

- `feed.html`: Feed 4:5, 1080 × 1350 px.
- `stories.html`: Stories 9:16, 1080 × 1920 px; contacto dentro de zona segura inferior de 150 px.
- `a4.html`: A4, 1240 × 1754 px; exportar al doble, 2480 × 3508 px.
- `feed-filas.html`, `stories-filas.html`, `a4-filas.html`: composiciones alternativas con un curso por fila y sus datos en columnas.
- `grilla-cursos.css` y `grilla-cursos.js`: estilos, selección/importación de cursos, clasificación estacional, autoajuste de columnas, filas y tipografía.
- `assets/`: variantes originales del logo CFP.

## Selección de cursos

1. Abrí un formato en Chrome o Edge. Si el navegador permite leer el `data.js` enlazado desde el proyecto, el catálogo de sus 22 cursos se carga automáticamente.
2. Si el catálogo no aparece, hacé clic en **Cargar/actualizar data.js** y elegí `CFP 401 Avellaneda WEB v2.0/site/data.js`. El archivo se procesa como JSON asignado a `window.CFP_DATA`, sin ejecutar otro código.
3. Elegí inicio en **Marzo** o **Agosto**. El botón **Seleccionar sugeridos** marca los cursos cuya duración identifica ese inicio. Los cursos con “Consultar en sede”, doble comisión o período no especificado se muestran en el selector para agregarlos manualmente luego de confirmarlos.
4. Buscá y marcá/desmarcá cursos en el panel. **Seleccionar todos (listado general)** incluye el catálogo completo de 22 cursos; es la opción para la comunicación general del comienzo de ciclo en marzo. Cada registro conserva nombre, días y horarios y requisitos. Esos dos últimos campos son obligatorios en la pieza y salen literalmente de `horarios` y `requisitos` en `data.js`; si un dato falta en el catálogo, queda indicado como “A confirmar”, nunca se omite.
5. Elegí **Grilla** o **Filas** en la barra superior. La grilla usa tarjetas de dos columnas; en la alternativa, el nombre del curso, “Días y horarios” y “Requisitos” comienzan alineados y quedan centrados verticalmente en cada fila. La modalidad aparece como “ANUAL” o “CUATRIMESTRAL” en una sola línea, al extremo inferior derecho. Si no entra, reducir solo la letra de esa última columna; mantener el tamaño/proporción de las demás. `*` identifica doble comisión o modalidad a confirmar.
6. La composición **Filas** siempre muestra la selección completa en una sola página. La altura de cada fila y su tipografía se ajustan automáticamente al total seleccionado; el listado general puede incluir los 22 cursos en el mismo lienzo. Revisá el caso más denso al tamaño real antes de publicar.
7. La composición **Grilla** conserva la navegación **Anterior/Siguiente** si la selección excede el espacio; exportá cada página por separado. El indicador de página se muestra únicamente en los controles de edición, nunca dentro del arte exportado. Si se cambia el período, se vuelve a la selección sugerida de ese inicio.

## Mensaje y validación

El rótulo inicial “ÚLTIMOS CUPOS” es editable y no se valida desde `data.js`: ese archivo contiene cursos y cursadas, pero no vacantes disponibles. Confirmá con el equipo que queden lugares y que la inscripción esté abierta antes de exportar. No agregues cantidad de vacantes, año ni fecha de cierre sin confirmación.

## Diseño y salida

- Campo superior de **Inicio en marzo/agosto**, contador de selección y etiquetas de modalidad anual/cuatrimestral.
- Trama cuadriculada activa por defecto; cada formato tiene su control para pasar a fondo liso.
- CTA institucional con WhatsApp **11 6105-6018 (solo mensajes)**.
- En todos los formatos, el último carácter de “(solo mensajes)” debe quedar alineado con el último carácter de “ESCRIBINOS POR WHATSAPP”.
- Exportá solo `#artboard`; no incluyas los controles de edición. Componé y revisá cada formato por separado.
- Antes de publicar, verificá los cursos elegidos, el inicio de cursada y la disponibilidad; comprobá la ficha más larga en ambas composiciones y en todas las páginas. Ningún nombre, horario, requisito o pie debe truncarse, cortarse ni superponerse. Stories debe conservar 150 px libres abajo.
