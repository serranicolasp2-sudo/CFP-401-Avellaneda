# Actividades institucionales · CFP N° 401 Avellaneda

Template editorial para contar lo que pasa en la escuela: capacitaciones, visitas de empresas o instituciones, charlas, jornadas. Nació de la pieza de la visita de **SIMMA Grupo Empresas** (15/10/2026); el responsable del sitio ajustó la composición en el lienzo de diseño y esa versión es la referencia aprobada del Feed. No lleva WhatsApp ni llamado a la acción: es una novedad, no una promoción.

## Composiciones

- `feed.html`: Feed 4:5, 1080 × 1350 px. Foto arriba (780 px a la izquierda, 688 px a la derecha), corte en diagonal de −4,87° con franja amarilla de 16 px, placa amarilla montada sobre el corte, tema en Poppins 800 de 120 px y bajada en Source Sans 3 600 de 40 px.
- `stories.html`: Stories 9:16, 1080 × 1920 px. Foto más alta (1100 px), logo de 600 px y textos fuera de los 192 px de arriba y de abajo.
- `a4.html`: afiche A4, 1240 × 1754 px, márgenes de 88 px (≈15 mm), titular de 136 px. Exportar al doble, 2480 × 3508 px.
- `actividades.css` / `actividades.js`: estilos, ajuste de textos, selector de foto, alternador del arco de fondo y escala de vista previa.
- `assets/`: foto de ejemplo (visita de SIMMA), logo CFP blanco e isotipo del arco.

## Uso

1. Abrí el formato en Chrome o Edge.
2. Editá los textos con clic: **placa** (tipo de actividad: CAPACITACIÓN, VISITA, CHARLA, JORNADA…), **titular** (el tema) y **bajada** (quién vino y qué hizo).
3. **Cambiar foto** para usar la foto real de la actividad. Las fotos de WhatsApp suelen ser apaisadas: en Stories se recorta más a los costados, revisá que la persona que habla quede adentro.
4. **Quitar arco / Agregar arco** muestra u oculta el isotipo de fondo (7% de opacidad).
5. Para exportar, esperá a que carguen las fuentes y capturá solo `<article id="artboard">` desde DevTools → **Capture node screenshot**.

## Reglas de ajuste (prueba de estrés)

- **Placa:** un solo renglón. Si el texto es largo, achica la letra hasta 28 px (Feed), 30 px (Stories) o 32 px (A4).
- **Titular y bajada:** se achican juntos, en proporción (`--fit`, hasta la mitad), cuando no entran en su zona o cuando una palabra del titular no entra de ancho. Zona: desde debajo del corte hasta 60 px del borde (Feed), 192 px (Stories) u 88 px (A4).
- Probado con “JORNADA DE PUERTAS ABIERTAS Y VISITA GUIADA”, un titular de cuatro renglones (“INSTALACIONES ELÉCTRICAS DOMICILIARIAS E INDUSTRIALES”) y una bajada de tres renglones: nada se pisa ni sale del lienzo.

## Control antes de publicar

- Nombre de la empresa o institución escrito como ellos lo escriben; si tienen cuenta en Instagram o Facebook, etiquetarla en la publicación.
- Foto real de la actividad, con permiso para publicarla. No usar imágenes generadas por IA.
- Logo blanco legible sobre la foto: el degradé azul de arriba a la izquierda lo protege, pero con fotos muy claras revisalo.
- Revisá Feed, Stories y A4 por separado.

## En el generador del panel

Modelo `actividad-institucional-v1` (“Actividades Institucionales”), sin curso. Sus estilos se importan de `actividades.css` con `herramientas/importar-estilos-plantillas.js` (id `actividad`). Si cambiás medidas acá, volvé a correr el importador y compilá `plantillas-promo.jsx`; si cambiás el HTML, actualizá también `ActividadInstitucionalV1`.
