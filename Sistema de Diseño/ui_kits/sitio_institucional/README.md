# UI kit — Sitio institucional CFP N° 401

Recreación del sitio público (`www.cfp401avellaneda.com.ar`) a partir de los materiales entregados: logo institucional, tabla oficial de cursos, copy de redes y QR.

| Pantalla | Archivo | Contenido |
|---|---|---|
| Inicio | `HomeScreen.jsx` | Hero azul, barra amarilla de próximas inscripciones, propuesta, 6 cursos destacados y la sección ancla `#como-inscribirte` |
| Cursos | `CoursesScreen.jsx` | Buscador + filtro por familia, vista tarjetas / tabla oficial (16 cursos reales) |

**Estado de inscripción:** el sitio comunica que las cursadas están en marcha y que hay dos períodos de inscripción por año (diciembre-febrero para los cursos de marzo; junio-julio para los de agosto). No se menciona ningún año calendario. Todos los CTA de inscripción ("Inscripción" del nav, "Cómo inscribirme", "Quiero inscribirme", "Cómo inscribirme" de cada curso) hacen scroll a `#como-inscribirte` en el home; el botón "Pre-Inscripción" abre WhatsApp. La pantalla `EnrollScreen.jsx` (formulario de preinscripción en 3 pasos) queda **deshabilitada** y sin ruta: el archivo se conserva para reactivarla cuando abran las inscripciones.
| Contacto | `ContactScreen.jsx` | Datos de sede y anexo con enlace a Google Maps, WhatsApp |

Los datos de cursos viven en `data.js` y provienen de `assets/tabla-cursos-2026.png`.

**Vacíos declarados:** no se entregaron mapa, fotos de fachada ni fotos de taller en alta resolución, así que esos bloques se omiten o se marcan como vacíos en pantalla.