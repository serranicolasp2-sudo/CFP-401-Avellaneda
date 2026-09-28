# Video, motion y audiovisual

Para reels, stories en video, videos institucionales, testimonios, animación de logo, placas y subtítulos, y para la animación de interfaces web. Herramientas del equipo: **Filmora** (principal del responsable del sitio) y **Adobe** (Premiere Pro, After Effects, Photoshop). Leé antes `marca.md`.

## Índice
1. Qué puede entregar Claude
2. Formatos de salida
3. Estructuras que funcionan
4. Marca en movimiento
5. Textos en pantalla y subtítulos
6. Audio
7. Paso a paso en Filmora
8. Paso a paso en Premiere Pro y After Effects
9. Motion en la interfaz web
10. Control final

## 1. Qué puede entregar Claude

Claude no edita el video a mano, pero deja todo listo para editarlo rápido:
- **Guion y pauta temporal** (tabla con tiempo, plano o clip, texto en pantalla, audio).
- **Subtítulos en `.srt`** listos para importar.
- **Placas en PNG con fondo transparente** (títulos, zócalos con nombre, datos, cierre con logo) a 1080×1920 o 1920×1080, hechas en HTML con la marca y exportadas.
- **Pasos concretos** en la herramienta que use la persona, con los ajustes de proyecto y de exportación.
- Si en la computadora está instalado `ffmpeg` (Claude Code), tareas mecánicas como recortar, cambiar el tamaño o quemar subtítulos, avisando antes y sin pisar los originales.

Pedí o deducí: objetivo, plataforma, duración, material disponible (qué clips hay y qué muestran), si hay voz, y datos a mostrar (copiados de `data.js`).

## 2. Formatos de salida

| Uso | Resolución | Proporción | Notas |
|---|---|---|---|
| Reel, Story, TikTok, WhatsApp Estados | 1080×1920 | 9:16 | 30 fps. Zona segura del Reel: lo importante lejos de los 220 px de arriba, los 380 px de abajo (texto del posteo y botones) y los 120 px de la derecha (íconos) |
| Portada del Reel | 1080×1920 | 9:16 | La grilla del perfil muestra el centro en 3:4: titular dentro del recorte central |
| Video en el feed | 1080×1350 | 4:5 | |
| YouTube, sitio web, proyección en sede | 1920×1080 | 16:9 | |

Exportación: MP4 (H.264), audio AAC 48 kHz, calidad alta (entre 8 y 16 Mbps en 1080p; la plataforma recomprime igual). Las interfaces y sus zonas cambian: si la precisión importa, verificá en la ayuda oficial de Instagram antes de fijar márgenes.

## 3. Estructuras que funcionan

**Reel de un curso (20–30 s):**
| Tiempo | Qué pasa |
|---|---|
| 0–2 s | Gancho: el plano más fuerte del oficio (chispas, un tablero que se enciende) + pregunta en pantalla ("¿Querés aprender soldadura?") |
| 2–12 s | 3 a 5 planos de taller de 1,5 a 3 s, cortados al ritmo de la música |
| 12–20 s | Datos en placas: GRATUITO · CERTIFICACIÓN OFICIAL · días y horario |
| 20–27 s | Llamado a la acción: "Escribinos por WhatsApp · 11 6105-6018" + sede |
| 27–30 s | Cierre: logo institucional sobre azul |

**Testimonio de egresado (45–60 s):** empieza con la frase más potente; zócalo con nombre y curso; planos del taller intercalados con la entrevista; subtítulos siempre; cierre con logo y llamado a la acción.

**Aviso en Story (5–15 s):** una idea por pantalla, texto grande, fondo azul o foto con velo azul, datos y logo al final.

**Institucional (1–2 min, 16:9):** recorrido por la sede y los talleres, voces de docentes y alumnos, datos de la oferta, cierre con logo. Pensado para mirarse con sonido.

Cada plano tiene que mostrar el oficio en acción; el texto acompaña, no reemplaza a la imagen.

## 4. Marca en movimiento

- **Colores y tipografías** de `marca.md`: textos en Poppins 700/800 (titulares) y Source Sans 3 600 (datos y subtítulos); fondos de placa azul `#003890` o degradé `#003890 → #002878`; acentos amarillos `#ffd100`.
- **Cierre con logo:** logo horizontal blanco (o vertical blanco) centrado sobre azul, con la dirección o el WhatsApp debajo. Entre 2 y 3 s.
- **Estilo de movimiento sobrio**, igual que la marca: cortes limpios, fundidos o deslizamientos cortos (6 a 10 cuadros a 30 fps), textos que entran con un desplazamiento chico y un fundido, con aceleración suave al salir (ease-out). Nada de transiciones 3D, destellos, glitch ni rebotes: le quitan seriedad a una escuela pública.
- **Recursos de marca animables:** el filete amarillo que se "dibuja" bajo un titular, el sello "100% GRATUITO" que entra rotado a −12° con su sombra dura, el arco del isotipo como marca de agua al 7–9%.
- **Color de imagen:** documental y natural. Corregí exposición y balance de blancos; sin filtros de color ni looks de cine.
- **Personas en cámara:** pedí autorización para publicar a quien aparece en primer plano (y a sus familias si hay menores).

## 5. Textos en pantalla y subtítulos

- Máximo 2 líneas y unos 35 caracteres por línea. Tiempo mínimo en pantalla: 1,5 s por línea; como guía, no más de 15 caracteres por segundo.
- **Subtítulos siempre:** la mayoría mira sin sonido. Source Sans 3 semibold, blanco con contorno o caja azul translúcida (`#002878` al 80%), en el tercio inferior pero por encima de la zona que tapa la interfaz.
- Voseo y datos literales también en los subtítulos.
- Formato `.srt` (numeración, tiempos con coma para los milisegundos, línea en blanco entre bloques):

```
1
00:00:00,000 --> 00:00:02,000
¿Querés aprender soldadura?

2
00:00:02,000 --> 00:00:04,500
Curso gratuito con certificación oficial.
```

## 6. Audio

- Música con licencia para redes: biblioteca de Filmora (revisá que la licencia cubra uso en redes), Adobe Stock (si el plan lo incluye), YouTube Audio Library o la música de Instagram al publicar. Nunca temas comerciales descargados: la plataforma silencia o baja el video.
- Voz clara por encima de todo: limpiá el ruido (Filmora: reducción de ruido con IA; Premiere: "Mejorar voz") y bajá la música entre 18 y 24 dB mientras alguien habla.
- Volumen final para redes: alrededor de −14 LUFS, sin picos por encima de −1 dB.

## 7. Paso a paso en Filmora

Los nombres de menú cambian un poco entre versiones; guiá por la función.
1. **Proyecto nuevo** con relación de aspecto 9:16 (1080×1920) y 30 fps (o 16:9 si es horizontal). Importá los clips y ordenalos siguiendo la pauta.
2. **Cortes al ritmo:** marcá los golpes de la música y cortá sobre ellos. Duración de planos según la pauta.
3. **Textos:** usá un título simple, cambiá la fuente a Poppins o Source Sans 3 (instaladas en la PC) y los colores por código HEX, y **guardalo como título personalizado** para reutilizarlo en todos los videos del CFP.
4. **Placas PNG** (hechas por Claude o en Photoshop): arrastralas a una pista superior; al tener fondo transparente, quedan sobre el video.
5. **Subtítulos:** importá el `.srt`, o usá la transcripción automática y corregí el texto. Aplicá el estilo de la sección 5.
6. **Audio:** música en una pista aparte, reducción de ruido en la voz, atenuación automática de la música bajo la voz.
7. **Exportar:** MP4, 1080×1920, 30 fps, calidad alta. Mirá el archivo exportado en un celular antes de publicar.

## 8. Paso a paso en Premiere Pro y After Effects

**Premiere Pro**
1. Secuencia nueva 1080×1920 (o 1920×1080), 30 fps.
2. Textos con la herramienta Texto y el panel Gráficos esenciales; guardá los estilos del CFP (titular, dato, zócalo) como **estilo maestro** o plantilla `.mogrt` para reutilizarlos.
3. Subtítulos: panel Texto → transcribir la secuencia → crear subtítulos, o importar el `.srt`. Estilo de la sección 5.
4. Audio: "Mejorar voz" y ducking automático de la música (panel Sonido esencial).
5. Exportar: H.264, "Coincidir con origen – velocidad de bits alta", o un ajuste personalizado de 1080×1920 a 30 fps.

**After Effects** (solo para piezas animadas propias: intro/cierre con logo, placas animadas)
- Composición del tamaño final. Animaciones con curvas suaves (Easy Ease), sin rebotes. El logo entra con fundido y escala mínima (de 96% a 100%) o con el arco que se revela.
- Para usarlo en Premiere: exportar como `.mogrt` o en un formato con transparencia (ProRes 4444 con canal alfa). Para Filmora: un video con transparencia que admita tu versión, o un MP4 sobre fondo azul.

## 9. Motion en la interfaz web

- Duraciones de la marca: 120 / 200 / 320 ms; curva `cubic-bezier(.2,.6,.2,1)`. Solo fundidos, cambios de color y desplazamientos de 2 px. Sin rebotes, sin entradas escalonadas, sin parallax.
- Animá `transform` y `opacity`, no el tamaño ni la posición del diseño.
- Respetá `prefers-reduced-motion`: los tokens ya ponen las duraciones en 0.
- Una animación tiene que explicar algo (qué se abrió, qué cambió); si solo decora, sacala.

## 10. Control final

- Formato, resolución y duración correctos; zonas seguras respetadas.
- Datos literales (curso, días, horario, WhatsApp 11 6105-6018, sede).
- Subtítulos presentes, legibles y sincronizados; voseo.
- Música con licencia; voz clara; volumen parejo.
- Cierre con logo institucional original.
- Visto el archivo final en un celular.
