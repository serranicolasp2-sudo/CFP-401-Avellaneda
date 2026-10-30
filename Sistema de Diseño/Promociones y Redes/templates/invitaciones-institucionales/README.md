# Invitaciones Institucionales Fotográficas · CFP N° 401 Avellaneda

Plantilla editorial fotográfica adaptativa para convocar a la comunidad a la **Muestra de Talleres Abiertos**, jornadas de puertas abiertas, ferias y encuentros institucionales, utilizando **fotografías reales y auténticas de los talleres del CFP N° 401** (no genéricas) tratadas bajo estándares de fotografía profesional y la identidad de marca institucional.

## Archivos del Modelo

- `stories.html`: Plantilla principal para **Instagram Stories / WhatsApp Estados (9:16, 1080 × 1920 px)** con 150 px de zona segura superior e inferior.
- `feed.html`: Adaptación para **Feed (4:5, 1080 × 1350 px)** con composición reordenada y compacta.
- `stories-vector.html` y `feed-vector.html`: Versiones alternativas de estilo plano sin fotografía.
- `invitaciones.css`: Sistema de diseño, tokens, tipografías Google Fonts (`Poppins` y `Source Sans 3`), tratamiento fotográfico y media queries.
- `invitaciones.js`: Motor adaptativo de auto-fit tipográfico (`--fit`), selector interactivo de talleres reales y visor en vivo.
- `assets/fotos/`: Colección curada de fotografías auténticas del CFP 401:
  - `taller-domotica-integral.jpg`: alumnos de Reparadora/or de Refrigeradores Domésticos (el nombre del archivo quedó de una identificación anterior; no renombrarlo: lo usan las piezas guardadas).
  - `taller-soldadura-chispas.jpg`: Taller de Herrería y Soldadura con chispas reales y equipo de protección.
  - `muestra-proyectos-diseno.jpg`: Exposición de proyectos de alumnos, manuales de marca y computadoras.
  - `comunidad-egresados.jpg`: Acto de colación, familias y egresados.
  - `capacitacion-alumnos.jpg`: Capacitación técnica en aula taller con equipamiento industrial.
  - `fachada-sede-docksud.jpg`: Sede central de la escuela en Juan Pablo Angulo 1272, Dock Sud.

## Pie de foto

El texto blanco sobre la foto se edita con un clic en el template y con el campo **Pie de foto** en el panel, donde también se puede ocultar. Confirmá que nombre al taller que realmente se ve.

## Tratamiento Fotográfico Profesional Aplicado (Color & Profundidad)

1. **Color y Temperatura:**
   - Tonos fríos y neutros en muros de taller y fondos (`#002878`, gris, blanco), contrastando con los tonos cálidos de piel y bancos de madera.
   - Saturación natural y moderada (`saturate(0.97)`).
   - Contraste suave (`contrast(1.06)`) con sombras profundas y viñeteado azul noche en las esquinas.
2. **Profundidad y Foco:**
   - La ventana fotográfica destaca al grupo activo en el centro del taller, suavizando el entorno perimetral con scrims y profundidad contenida.
   - Sello flotante amarillo con sombra dura: `100% GRATUITO · ENTRADA LIBRE`.

## Jerarquía Visual de la Pieza

1. **Cabecera Oficial:** Lockup horizontal blanco institucional + antetítulo `— TE INVITAMOS A LA`.
2. **Titular Dominante:** `MUESTRA DE TALLERES ABIERTOS` en Poppins 800 mayúsculas + badge institucional `JORNADA INSTITUCIONAL · ENTRADA LIBRE Y GRATUITA`.
3. **Ventana Fotográfica:** Foto real del taller en acción con epígrafe descriptivo.
4. **Tarjeta de Fecha y Horario:** Bloque amarillo `#ffd100` con sombra dura azul `#001a54`: `5 DE NOVIEMBRE`, `10:00 a 20:00 hs`.
5. **Ubicación:** Ícono de mapa + `Juan Pablo Angulo 1272 · Dock Sud · Avellaneda`.
6. **Lema Inspirador:** Placa blanca con comillas de apertura y la cita institucional en Source Sans 3 cursiva.
7. **Cierre:** `¡TE ESPERAMOS!` en amarillo acento.
