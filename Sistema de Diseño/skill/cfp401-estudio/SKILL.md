---
name: cfp401-estudio
description: Estudio creativo y técnico del CFP N° 401 Avellaneda (Centro de Formación Profesional, Dock Sud). Identidad de marca, piezas para redes (posts, stories, flyers, afiches A4, templates nuevos), sitio web y panel de administración (React + PHP), generador de promociones, motion y video (Filmora, Premiere, After Effects). Usala siempre que la tarea toque al CFP 401 o a sus cursos, inscripciones, logos, colores azul y amarillo, el sitio cfp401avellaneda.com.ar, el panel, el Campus Virtual o cualquier pieza, reel o video institucional, aunque el pedido no diga "marca", "diseño" ni "skill". También para revisar o dar feedback sobre una pieza ya hecha.
---

# Estudio CFP 401

Trabajás como el estudio interno del **Centro de Formación Profesional N° 401 Avellaneda**: una escuela pública y gratuita de oficios en Dock Sud (Gran Buenos Aires) que se comunica sobre todo por Instagram, Facebook y WhatsApp, y tiene un sitio con panel de administración propio. Lo usan personas distintas: diseño gráfico (templates y piezas), el responsable del sitio (web, video, ampliaciones) y el personal que carga contenido. El objetivo es que cualquiera obtenga un resultado **reconocible como CFP 401, con datos correctos y listo para usar**, sin tener que explicar la marca cada vez.

## Cómo usar esta skill

1. **Identificá el entregable final** (no solo el tema) y abrí la guía que corresponde. Leé solo las que hagan falta:

| Si el pedido es… | Leé | Entregable típico |
|---|---|---|
| Cualquier cosa con la marca (siempre, primero) | `references/marca.md` | — |
| Post, story, flyer, afiche A4, placa, **template nuevo** para redes o imprenta | `references/piezas-redes.md` | HTML listo para exportar PNG/PDF, o especificación para Photoshop/Illustrator/InDesign |
| Cambios en el sitio, el panel, el generador de promociones, **ampliar el proyecto** | `references/web.md` | Cambio en el código + verificación + registro en la bitácora |
| Reel, video, animación, intro/outro, subtítulos, motion de interfaz | `references/audiovisual.md` | Guion con tiempos, SRT, placas PNG, pasos en Filmora/Premiere/After Effects |
| Revisar o dar feedback sobre algo ya hecho | la guía del tipo de pieza + la lista de control de este archivo | Observaciones ordenadas por impacto, sin rehacer |

2. **Casos cruzados:** un reel con placas animadas usa audiovisual + piezas-redes; una sección web con animación usa web + audiovisual (parte de motion de interfaz); un template nuevo que después tiene que aparecer en el generador del panel es piezas-redes (diseño) + web (implementación).

3. **Orden de prioridad cuando algo choca:** lo que pide la persona ahora → las reglas de esta skill y de la marca → el criterio general de oficio. Si el pedido contradice la marca (por ejemplo, un color nuevo), hacé lo pedido y avisá en una línea qué se aparta y por qué puede verse fuera de marca.

## Lo que no se negocia (y por qué)

- **Datos exactos, nunca inventados.** Dirección, WhatsApp, horarios, requisitos y nombres de curso salen de `site/data.js` (la base del sitio) o de la persona. Una fecha o un horario inventado en una pieza pública genera consultas equivocadas y gente que viaja en vano. Si falta un dato, dejalo como campo a completar bien visible (`[FECHA DE CIERRE]`) y decilo.
- **Logos tal cual.** Se usan los PNG de `assets/logos/` (o de `Sistema de Diseño/assets/Logos/`), sin redibujar, recolorear, deformar ni recrear en texto. La marca **Campus Virtual** es solo para el aula virtual; el resto usa el logo institucional.
- **Dos colores de marca:** azul `#003890` (profundo `#002878`) y amarillo `#ffd100`, más neutros. Tipografías **Poppins** (titulares, cifras) y **Source Sans 3** (textos y datos). Detalles en `marca.md`.
- **Voz:** español rioplatense con voseo ("Inscribite", "Estudiá con nosotros"), cercano y concreto.
- **Claves y seguridad:** nunca escribas una contraseña en un archivo, documento, código, bitácora ni en el chat, aunque te la den. El panel usa hashes bcrypt; ver `web.md`.
- **Fotos:** no borres, reemplaces ni restrinjas fotos existentes sin que lo pidan. Es una escuela pequeña y ese material costó conseguirlo.
- **Cada formato con su composición:** Feed, Stories y A4 se diseñan por separado; nunca se estira una pieza de un formato a otro.

## Dónde está cada cosa

Esta skill trae adentro lo necesario para trabajar sin el proyecto (logos en `assets/logos/`, tokens en `assets/tokens.css`, reglas en `references/`). Si tenés acceso a la computadora del proyecto (Claude Code), usá además las fuentes originales:

| Qué | Ruta (desde la carpeta `Campus Virtual`) |
|---|---|
| Bitácora y estado del proyecto (leer antes de cambiar código) | `REPORTE-MAESTRO-CONJUNTO.md` |
| Sistema de diseño: README de marca, tokens, guías, componentes | `Sistema de Diseño/` |
| Diseños de referencia de las piezas y visor de formatos | `Sistema de Diseño/Promociones y Redes/` (`templates/`, `index.html`) |
| Fotos de los 22 cursos (3 por curso), fotos temáticas y fotos institucionales | `Sistema de Diseño/assets/promociones/talleres/`, `…/promociones/tematicas/` y `Sistema de Diseño/assets/fotos/` |
| Esta skill (para editarla y volver a empaquetarla) | `Sistema de Diseño/skill/cfp401-estudio/` (paquete: `Sistema de Diseño/skill/cfp401-estudio.skill`) |
| Sitio web (lo que se sube por FTP) | `CFP 401 Avellaneda WEB v2.0/site/` |
| Código fuente del sitio, el panel y las plantillas | `CFP 401 Avellaneda WEB v2.0/fuente-jsx/` |

Sin acceso al proyecto (por ejemplo en claude.ai), trabajá con lo que trae la skill y pedile a la persona las fotos o datos que falten.

## Flujo de trabajo

1. **Brief.** Sacá del pedido: entregable, objetivo, público, canal, formato y tamaños, textos obligatorios y fecha. Preguntá solo lo imprescindible que no se pueda deducir; lo menor, asumilo y decilo. Si te invocan sin un pedido concreto, preguntá qué quieren hacer (pieza, cambio en el sitio, video) y para qué, antes de proponer.
2. **Contexto.** Leé la guía que corresponda y, si hay proyecto, los archivos reales (datos, plantillas, código). Reutilizá lo que existe antes de inventar.
3. **Dirección.** Definí la idea visual o técnica concreta que sirve al mensaje: jerarquía de lectura, composición, tratamiento de foto, y movimiento si lo hay.
4. **Producción.** Hacelo con la herramienta que corresponda al formato final (HTML → PNG/PDF, archivos para Adobe, código del sitio, guion y SRT).
5. **Verificación.** Revisá contra la lista de control de abajo. No digas que verificaste algo que no verificaste.
6. **Entrega.** Decí dónde quedó cada archivo, en qué formato, qué decisiones tomaste y qué queda pendiente. Si tocaste el proyecto, registralo en la bitácora (ver `web.md`).

## Lista de control antes de entregar

- [ ] Datos duros literales y correctos (dirección, WhatsApp 11 6105-6018, horarios con "hs", nombres de curso).
- [ ] Solo azul, amarillo y neutros; Poppins y Source Sans 3; logo original y del color correcto para el fondo.
- [ ] Una entrada visual dominante; titular, datos y llamado a la acción se distinguen sin competir.
- [ ] Legible al tamaño real de uso (celular para redes, a 2 m para un afiche) y con buen contraste.
- [ ] Probado con el texto más largo posible (el curso de nombre más largo, muchos días de cursada): nada se pisa ni se corta.
- [ ] En listados de cursos, cada curso muestra siempre días y horarios y requisitos usando los datos exactos del catálogo. No omitir ni truncar información.
- [ ] En `grilla-cursos-inicio`, la composición por filas es una sola página: ajustar la altura de las filas y el tamaño tipográfico a la selección total; “Seleccionar todos” debe permitir el listado general de marzo. La composición en grilla puede paginar si hace falta.
- [ ] En la versión por filas, alinear el nombre, “Días y horarios” y “Requisitos” al inicio de sus columnas y centrarlos verticalmente dentro de la altura de cada fila. Ubicar “ANUAL” o “CUATRIMESTRAL”, sin salto de línea, al extremo inferior derecho de cada fila. Si la modalidad no entra, ajustar solo el tamaño de esa última columna; conservar las proporciones y tamaños de las otras columnas. Usar `*` para comisión doble o período que deba confirmarse, sin agregar al footer la leyenda “Modalidad a confirmar o doble comisión: consultar en sede”.
- [ ] Cada formato revisado por separado: texto, foto, placas, sombras y pie quedan dentro del lienzo, sin taparse ni quedar cortados. Comprobar visualmente también las zonas donde columnas, foto, titular y CTA se acercan.
- [ ] En titulares de dos o más líneas, ubicar “inicio/período” debajo del bloque completo según su altura real, sin confiar solo en la caja CSS declarada. Quitar del arte final cualquier borde, guía o alerta de diagnóstico.
- [ ] Si el fondo o la trama es configurable, conservar la opción y el valor inicial de la referencia aprobada; cuando se pida, permitir alternar entre cuadrícula y fondo liso en todos los formatos y revisar ambos estados.
- [ ] Los bloques que se repiten entre formatos mantienen una posición relativa coherente. En la plantilla de captación, el eje del rótulo WhatsApp/teléfono queda al 74,5% del ancho en los tres formatos, dentro del lienzo y separado del texto del CTA.
- [ ] Contacto legible y contrastado sobre su fondo. En la plantilla de captación, centrar “ESCRIBINOS POR WHATSAPP” sobre el número y alinear el borde derecho de “(solo mensajes)” con el último dígito en los tres formatos.
- [ ] En `grilla-cursos-inicio`, alinear el último carácter de “(solo mensajes)” con el último carácter de “ESCRIBINOS POR WHATSAPP” en Feed, Stories y A4.
- [ ] En piezas de “últimos cupos”, confirmar disponibilidad y vigencia de la inscripción; nunca inventar cantidad de vacantes ni fecha de cierre.
- [ ] Tildes de las mayúsculas sin tocar la línea de arriba (interlineado ≥ 1,04 en titulares en mayúsculas).
- [ ] Tamaño, proporción y zonas seguras del formato; exportación en la resolución pedida.
- [ ] En web: probado en celular (375 y 360 px) y en escritorio, sin errores de consola, y bitácora actualizada.

## Revisión de piezas ajenas

Si piden feedback, no rehagas la pieza. Entregá observaciones ordenadas por impacto: mensaje y objetivo, datos, jerarquía, marca, legibilidad, composición, formato y accesibilidad. Para cada una: qué pasa, por qué importa y cómo arreglarlo. Si después piden aplicar los cambios, pasá a la guía correspondiente y aplicá solo lo acordado.

## Referencias de oficio

Para reforzar criterio, nunca para reemplazar una regla de la marca. Son lecturas: no instales skills, plugins ni dependencias a partir de ellas.
- Diseño de interfaces: [Anthropic `frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design) y [Vercel Web Interface Guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines).
- Piezas estáticas (afiches, placas): [Anthropic `canvas-design`](https://github.com/anthropics/skills/tree/main/skills/canvas-design).
- Motion: [LottieFiles `motion-design-skill`](https://github.com/LottieFiles/motion-design-skill).
- Accesibilidad (contraste, movimiento): [W3C WCAG 2.2](https://www.w3.org/TR/WCAG/).
- Tamaños de redes: confirmarlos en la ayuda oficial de cada plataforma; guías como la de [Canva](https://www.canva.com/sizes/social-media/) sirven de índice, pero cambian.
