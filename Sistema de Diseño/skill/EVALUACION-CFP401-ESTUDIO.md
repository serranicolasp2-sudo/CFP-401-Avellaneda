# Evaluación de `cfp401-estudio`

**Fecha:** 27/09/2026  
**Base:** seis ejecuciones previas, tres pedidos probados con y sin la skill. Revisé las salidas y las rúbricas guardadas en el scratchpad de evaluación; no volví a generar las piezas.

| Caso | Sin skill | Con skill | Resultado |
|---|---:|---:|---|
| Template de Puertas Abiertas | 3/8 | 8/8 | La salida sin skill falló en formatos separados, colores, tipografías, logo y datos sin confirmar. Con skill respetó los dos HTML, la marca, los logos y dejó fecha/horario como campos pendientes. |
| Plan para Testimonios | 8/8 | 8/8 | Ambos cubrieron la rúbrica. La salida con skill trabajó desde el código fuente, toleró datos ausentes, propuso pruebas responsive y lista de FTP; evitó cambios de PHP no necesarios y protegió las claves reales. |
| Reel de Soldador Básico | 8/8 | 8/8* | El baseline pasó la rúbrica, aunque tomó algunos datos de una referencia vieja. La versión con skill usó los datos de `site/data.js`, entregó dos SRT de 30 s, versiones para inscripciones cerradas/abiertas y placas con la identidad correcta. |

\* El directorio de la ejecución con skill no trae `grading.json`; evalué manualmente sus ocho criterios: duración y SRT, horario, WhatsApp, configuración Filmora/MP4, tipografías y colores, licencia de música y voseo. La vista previa confirma la composición de placas; no se pudo probar con los clips reales ni en un teléfono.

## Ajustes aplicados tras revisar las pruebas

- Aclaré que `generar-clave-maestra.php` escribe en el `site/api/` vecino y que, para pruebas, hay que ejecutar la copia del helper dentro de una copia descartable del proyecto.
- Documenté el selector CSS de celular `section[style*="--surface-accent"]` para evitar que una sección nueva active reglas móviles por usar esa variable inline.
- Añadí la recarga forzada Ctrl+F5 después de subir `app.js` o `admin.js`, que no tienen parámetro de versión.

## Alcance

La skill queda autocontenida para compartir. No se instaló en Claude Code ni se modificaron el sitio, sus datos o credenciales.
