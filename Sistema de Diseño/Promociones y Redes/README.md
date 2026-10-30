# Centro de Promociones y Diseño Gráfico — CFP N° 401 Avellaneda

> **Guía maestra para Diseñadores Gráficos y Asistentes de Inteligencia Artificial.**  
> Este directorio es **100% autónomo y está desacoplado del sitio web**.  
> Para diseñar, maquetar o generar piezas de redes sociales e impresión, **NO se debe consultar ni modificar ningún archivo de la carpeta de la web (`CFP 401 Avellaneda WEB v2.0`)**.

---

## 1. Visor Interactivo Local

Para ver y probar todas las piezas en vivo con un solo clic:
* Abrir el archivo **[`index.html`](index.html)** con cualquier navegador (Chrome, Edge, Firefox).
* Permite visualizar los modelos integrados al visor y la **zona segura de Instagram Stories (150 px)**. Las plantillas editoriales con vista propia se abren desde los archivos de cada carpeta.
* El nuevo template de captación general se encuentra en `templates/captacion-oficios/` y se abre desde sus archivos `feed.html`, `stories.html` y `a4.html`.
* El template de conmemoraciones patrias está en `templates/conmemoraciones-patrias/`, con un archivo por formato y Día de la Bandera como ejemplo editable.
* El template de últimos cupos está en `templates/ultimos-cupos/`, con CTA a WhatsApp, foto reemplazable y campos editables por curso.
* La grilla de cursos por inicio está en `templates/grilla-cursos-inicio/`; permite filtrar marzo/agosto, elegir cursos desde `data.js` y alternar entre tarjetas y fichas por fila con días/horarios y requisitos.
* El template de actividades institucionales (capacitaciones, visitas, charlas, jornadas) está en `templates/actividades-institucionales/`, con foto reemplazable, placa, tema y bajada editables y el arco de fondo opcional.
* La plantilla de invitaciones para muestras, jornadas abiertas y encuentros con fecha/hora/sede está en `templates/invitaciones-institucionales/`; tiene una versión gráfica y otra fotográfica (foto del taller del CFP con corrección fría/neutra y foco selectivo), cada una con composiciones propias para Stories y Feed.

---

## 2. Formatos y Lienzos Oficiales

| Formato | Proporción | Resolución de Lienzo | Uso Principal | Zona Segura |
|---|:---:|:---:|---|---|
| **Stories / Estados** | `9:16` | **1080 × 1920 px** | Instagram Stories, WhatsApp Estados, Reels | Dejar libres **150 px** arriba (nombre de cuenta) y **150 px** abajo (caja de mensaje) |
| **Feed Cuadrado / Retrato**| `4:5` | **1080 × 1350 px** | Instagram Feed, Facebook Post, LinkedIn | Lienzo completo visible |
| **Afiche A4** | `1:1.414` | **1240 × 1754 px** *(o 2480 × 3508 px a 300 dpi)* | Cartelería en sedes, folletos para imprimir | Margen perimetral mínimo de 15 mm |

---

## 3. Paleta Cromática Institucional

| Color | HEX | Variable CSS | Rol / Aplicación |
|---|:---:|:---:|---|
| **Azul Primario** | `#003890` | `var(--brand-primary)` | Fondos principales, antetítulos, botones de acción |
| **Azul Noche** | `#002878` | `var(--blue-900)` | Sombras duras de placas, fondos de contraste, píldoras |
| **Amarillo Acento** | `#ffd100` | `var(--brand-accent)` | Cintas, aros, placas rotadas, destacados, píldora WA |
| **Blanco Puro** | `#ffffff` | `#fff` | Tarjetas contenedoras, textos sobre azul, fondos limpios |
| **Gris Fondo** | `#f8fafc` | `var(--surface-subtle)` | Fondos secundarios y divisores suaves |

---

## 4. Tipografías Oficiales

Ambas tipografías están disponibles en Google Fonts:
1. **Titulares, cifras y destacados:**  
   🔤 **`Poppins`** (`font-weight: 700` y `800`).  
   *Uso:* Nombres de cursos, palabras clave ("INSCRIPCIONES", "ABIERTAS", "100% GRATUITO").
2. **Textos descriptivos, datos y bajadas:**  
   🔤 **`Source Sans 3`** (`font-weight: 400`, `600` y `700`).  
   *Uso:* Días, horarios, requisitos, sedes y números de contacto.

---

## 5. Modelos de Plantillas Definitivos

### Modelo A: Inscripciones Abiertas (`templates/inscripciones-abiertas/`)
* **Uso:** Campañas generales de inicio de ciclo lectivo o apertura de cupos por familias formativas.
* **Composición en Feed (4:5), ajustada por el responsable el 27/09:**
  - **Foto circular** de **765 px** con aro amarillo de **855 px** (borde de 16 px), anclada arriba a la derecha y desbordando: foto `right: -299 px`, `top: -209 px`. Se ve su cuarto inferior izquierdo; el aro baja hasta y≈600, por la derecha, donde no llega el texto.
  - **Sello 100% Gratuito** de **236 px** (`left: 588 px`, `top: 355 px`), montado sobre el borde inferior izquierdo del aro, justo encima del antetítulo.
  - Con sello, el antetítulo tiene como máximo **540 px** de ancho: si es más largo pasa a otro renglón antes de llegar al sello.
  - Pie: el rótulo `WHATSAPP` alineado a la **izquierda**, donde empieza el número dentro de la píldora.
  - En el generador del panel, si el texto crece, la foto se achica desde la esquina superior derecha en vez de pisarlo.
* **Composición en Stories (9:16):**
  - **Foto circular superior:** Diámetro amplio de **754 px** con aro amarillo de **26 px** (`top: 213 px`, `right: -166 px`).
  - **Sello 100% Gratuito:** Circular, amarillo, rotado **-12°** con sombra dura azul `#002878`.
  - **Marca de agua:** Isotipo del arco en blanco con 8% de opacidad ubicado detrás del titular.
  - **Pie en dos filas:**
    - Fila 1: `INSCRIPCIÓN` y `SEDE`.
    - Fila 2: `CONSULTAS POR WHATSAPP` y el número en píldora azul/amarillo alineado a la columna de la Sede.
* **Composición en A4:**
  - El rótulo `WHATSAPP` se ubica alineado a la **izquierda** de la píldora.

### Modelo B: Promo de Curso Alternativa (`templates/promo-curso/`)
* **Uso:** Promoción de un oficio específico con estética de taller moderno y fotografía protagonista.
* **Composición:**
  - **Foto a sangre:** Ocupa la mitad superior del lienzo con degradado oscuro inferior.
  - **Cinta de Acento:** En la esquina superior derecha con corte en "V" ("100% GRATUITO").
  - **Tarjeta blanca flotante:** Con esquinas redondeadas y sombra envolvente (`box-shadow`), contiene el oficio y la bajada descriptiva.
  - **Grilla de Datos:** 4 campos (`DÍAS`, `HORARIO`, `DURACIÓN`, `REQUISITO`) con línea divisoria lateral amarilla.

### Modelo C: Flyer de Curso Estándar (`templates/flyer-curso/`)
* **Uso:** El clásico afiche del CFP N° 401 Avellaneda con cuadrícula técnica.
* **Composición:**
  - **Fondo:** Cuadriculado técnico azul sutil (`--blue-100`).
  - **Titular:** Letras en Poppins 800 con interlineado **1.04** (para evitar que tildes en mayúsculas toquen la línea superior).
  - **Cápsula Amarilla Lateral:** Contiene Días y Horarios con tipografía centrada y elástica.
  - **Arco del Taller:** Fotografía con recorte curvado enmarcada por el arco amarillo.

### Modelo D: Captación de Consultas (`templates/captacion-oficios/`)
* **Uso:** publicidad general para captar consultas de personas interesadas en aprender un oficio, sin depender de que las inscripciones estén abiertas.
* **Composición:** pregunta editorial grande a la izquierda; foto real del taller en un panel geométrico inclinado a la derecha; datos de gratuidad y amplitud de oferta; franja azul de conversión a WhatsApp con la sede.
* **CTA:** “Consultá por próximas inscripciones”, para que el mismo template sirva en períodos abiertos y cerrados. No incluye fechas ni promesas de empleo.
* **Formatos separados:** Feed 1080×1350, Stories 1080×1920 (150 px libres arriba y abajo) y A4 1240×1754 con exportación al doble.
* **Editor:** los textos se cambian al hacer clic y la foto desde el selector superior. Los previews se abren individualmente; todavía no forman parte del visor interactivo de los tres modelos del generador.

Los modelos D, E, F, G y H son templates editoriales autónomos con previews separados; no están integrados al visor interactivo ni al generador de promociones.

### Modelo E: Conmemoraciones Patrias (`templates/conmemoraciones-patrias/`)
* **Uso:** fechas patrias argentinas y conmemoraciones institucionales. Ejemplo: Día de la Bandera (20 de junio); efeméride, fecha y mensaje son editables.
* **Composición:** foto reemplazable protagonista a sangre como fondo en Feed y A4, con degradado azul para proteger la legibilidad; en Stories la foto va en un marco amplio. El cierre institucional usa azul CFP.
* **Formatos y fondo:** Feed, Stories y A4 tienen composiciones propias. Cuadrícula CFP activa por defecto, con control para pasar a fondo liso en los tres formatos.
* **Editor:** textos editables al hacer clic, selector **Cambiar foto**, ajuste automático de tamaño del titular y exportación independiente por lienzo. Este modelo no se agregó al visor interactivo ni al generador del panel.

### Modelo F: Últimos cupos (`templates/ultimos-cupos/`)
* **Uso:** aviso para campañas donde se confirmó que quedan vacantes en un curso; el curso se completa en el campo editable.
* **Composición:** titular de urgencia y datos del curso a la izquierda, fotografía reemplazable protagonista, prueba institucional editable y franja azul con CTA/WhatsApp.
* **Formatos y fondo:** Feed 4:5, Stories 9:16 y A4 tienen composiciones separadas; la cuadrícula CFP es opcional en cada una. Stories mantiene 150 px libres abajo.
* **Editor:** permite cambiar foto y textos; incluye WhatsApp 11 6105-6018. No incluye número de cupos ni fecha de cierre predeterminados: confirmar disponibilidad antes de publicar.

### Modelo G: Grilla de cursos por inicio (`templates/grilla-cursos-inicio/`)
* **Uso:** informar cursos anuales y cuatrimestrales antes de los comienzos de marzo y agosto, con CTA para consultar vacantes.
* **Composición:** pieza editorial de información; el listado de tarjetas es el foco y se diferencia de los anuncios de captación centrados en foto.
* **Editor:** carga cursos de `site/data.js` (automático cuando el navegador lo permite o mediante botón de selección del archivo), permite elegir período y cursos, y ajusta cantidad de columnas, filas y tipografía de acuerdo con la selección. Cada curso debe incluir días y horarios y requisitos; si no cabe con legibilidad, la selección se recorre por páginas sin truncar datos. Los períodos no explícitos quedan marcados para confirmación.
* **Formatos y fondo:** Feed, Stories y A4 tienen versiones en grilla y por fila, cuadrícula opcional y CTA con WhatsApp institucional. `data.js` no contiene cantidad de vacantes: verificar disponibilidad antes de publicar “Últimos cupos”.

### Modelo H: Actividades institucionales (`templates/actividades-institucionales/`)
* **Uso:** novedades de la escuela: capacitaciones, visitas de empresas o instituciones, charlas y jornadas. Nació de la pieza de la visita de SIMMA Grupo Empresas (15/10/2026); la composición del Feed la ajustó el responsable en el lienzo de diseño y es la referencia aprobada.
* **Composición:** foto real de la actividad arriba con corte en diagonal (−4,87°) y franja amarilla; placa amarilla con sombra dura montada sobre el corte (tipo de actividad); tema en Poppins 800 blanco en mayúsculas y bajada en Source Sans 3 (quién vino y qué hizo). Logo blanco arriba a la izquierda, protegido por un degradé azul. Sin WhatsApp ni llamado a la acción.
* **Formatos y fondo:** Feed, Stories (fuera de los 192 px de arriba y de abajo) y A4 (márgenes de 88 px) compuestos por separado. Isotipo del arco al 7% como marca de agua, opcional.
* **Editor:** textos editables al hacer clic, **Cambiar foto** y **Quitar arco**. La placa achica la letra si no entra en un renglón; titular y bajada se achican juntos si no entran en su zona. Está en el generador del panel como «Actividades Institucionales (Novedades)».

### Modelo I: Invitaciones institucionales (`templates/invitaciones-institucionales/`)
* **Uso:** convocatorias con fecha, horario y sede confirmados: muestras de talleres, jornadas abiertas, ferias y encuentros. Para contar una visita o capacitación ya realizada, usar Modelo H.
* **Composición:** fondo azul CFP, lockup institucional blanco, titular dominante, cápsula amarilla para fecha y horario, dirección en bloque independiente, cita opcional en tarjeta blanca y cierre directo. El arco es una marca de agua opcional.
* **Formatos:** Stories 9:16 es el principal y Feed 4:5 tiene una composición propia. Ambos respetan las zonas seguras y se pueden abrir por separado.
* **Editor adaptativo:** clic para editar título, fecha, hora, dirección, cita y cierre. Cada zona permite ajuste de tamaño y reflujo de línea. El ejemplo parte de la invitación a la Muestra de Talleres Abiertos; la cita aparece con comillas de apertura y cierre. No se precarga año ni información que no aparezca en la fuente.
* **Integración:** Integrada al generador de promociones del sitio (modelo `invitacion-institucional-v1`) en `CFP 401 Avellaneda WEB v2.0/site/admin.html` con soporte de edición en vivo, previsualización en Stories y Feed, alternancia de fondo degradé/cuadriculado y exportación PNG en alta resolución.

### Cómo llegan estos diseños al generador del panel (modelos D a I)
El generador de promociones del sitio (`admin.html` → Promociones y Flyers) usa **estos mismos archivos**: el CSS de cada template se importa con `CFP 401 Avellaneda WEB v2.0/herramientas/importar-estilos-plantillas.js` y los componentes repiten el mismo HTML, así las piezas del panel salen iguales a las de esta carpeta (verificado por píxeles el 27/09). Si se cambia un diseño acá (medidas, colores, tipografía), hay que volver a correr ese script y compilar `plantillas-promo.jsx` (ver `skill/cfp401-estudio/references/web.md`, sección 7); si se cambia el HTML (se agregan o quitan elementos), también hay que actualizar el componente. En el panel, la grilla de cursos no tiene textos editables: solo se eligen los cursos, el período y la composición.

---

## 6. Recursos Gráficos Incluidos

* **Logotipos:** Variantes en blanco y color en las carpetas `img/` y en la raíz `../Logos/`.
* **Fotografías de talleres:** Soldadura, Electricidad, Domótica, Energías Renovables y Egresados en `img/` y en `../assets/fotos/`.
* **Tokens CSS:** En `tokens/` y `styles.css`.
* **Fototeca curada para templates nuevos (15 imágenes HD sin marcas de agua):**
  - **Captación (`templates/captacion-oficios/assets/` y `assets/promociones/`):**
    - `captacion-1.jpg`: Taller de carpintería y oficios con estudiantes equipados con antiparras y delantales (1024×1024 px).
    - `captacion-2.jpg`: Taller mecánico automotriz con instructor y aprendiz diagnosticando vehículo elevado con escáner OBD2 (768×1344 px, formato vertical ideal Stories).
    - `captacion-3.jpg`: Makerspace y taller técnico amplio con puestos de trabajo, computadoras y proyectos (832×1472 px, vertical).
  - **Conmemoraciones Patrias (`templates/conmemoraciones-patrias/assets/` y `assets/promociones/`):**
    - `dias-patrios-1.jpg`: Bandera argentina flameando en mástil contra cielo azul puro (3096×4128 px, vertical alta definición).
    - `dias-patrios-2.jpg`: Vista histórica de Plaza de Mayo y Banco de la Nación con la bandera nacional como protagonista central (4137×2762 px, horizontal).
    - `dias-patrios-3.jpg`: Primer plano nítido del Sol de Mayo bordado en el paño celeste y blanco flameando al sol (4124×2739 px, macro).
  - **Últimos Cupos Disponibles (`templates/ultimos-cupos/assets/` y `assets/promociones/`):**
    - `ultimos-cupos-1.jpg`: Soldadura industrial en plena acción con lluvia de chispas, guantes de descarne y amoladora (1456×816 px, apaisado).
    - `ultimos-cupos-2.jpg`: Manos artesanas pasando cepillo de carpintero sobre madera maciza con viruta en el aire (816×1456 px, vertical).
    - `ultimos-cupos-3.jpg`: Torno mecánico en funcionamiento con viruta metálica girando y mano operando el dial de avance (1024×1024 px).
  - **Listado Nuevo de Cursos - Grilla Anual (`templates/grilla-cursos-inicio/assets/` y `assets/promociones/`):**
    - `listado-anual-1.jpg`: Mesa de arquitectura y dibujo técnico con planos enrollados, escalímetro y maqueta (1024×1024 px).
    - `listado-anual-2.jpg`: Plano técnico desplegado sobre banco de trabajo con regla de escala de madera y luz matinal (1456×816 px, apaisado).
    - `listado-anual-3.jpg`: Planos arquitectónicos con anteojos de lectura y lápices de dibujo técnico (816×1456 px, vertical).
  - **Listado Cursos Cuatrimestrales - Inicio Agosto (`templates/grilla-cursos-inicio/assets/` y `assets/promociones/`):**
    - `cuatrimestrales-agosto-1.jpg`: Macro de punta de soldador de estaño con gota fundida sobre plaqueta y resistencias (1024×1024 px).
    - `cuatrimestrales-agosto-2.jpg`: Banco de trabajo de técnico electrónico con osciloscopio digital, multímetro y pinzas (768×1344 px, vertical).
    - `cuatrimestrales-agosto-3.jpg`: Mano de técnico probando componentes en circuito impreso con punta lógica y multímetro digital (816×1456 px, vertical).
