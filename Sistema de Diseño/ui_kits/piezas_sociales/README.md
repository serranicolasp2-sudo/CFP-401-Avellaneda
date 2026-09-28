# UI kit — Piezas para Redes Oficiales (Definitivas)

Plantillas de diseño para redes sociales del **CFP N° 401 Avellaneda**, sincronizadas con el módulo de `Promociones y Redes/` y con el generador del sitio web.

---

## 1. Modelos Oficiales Incluidos

| Modelo | Archivo JSX | Formatos Soportados | Uso Principal |
|---|---|---|---|
| **1. Inscripciones Abiertas** | `InscripcionesAbiertas.jsx` | Stories (9:16) y Feed (4:5) | Campañas generales de inicio de ciclo y apertura de inscripciones por familias. |
| **2. Promo de Curso Alternativa** | `PromoCurso.jsx` | Stories (9:16) y Feed (4:5) | Promoción individual de oficio con foto a sangre, tarjeta con sombra y grilla técnica. |
| **3. Flyer de Curso Estándar** | `FlyerCurso.jsx` | Stories (9:16) y Feed (4:5) | Afiche institucional clásico con cuadrícula técnica, cápsula amarilla y arco del taller. |

---

## 2. Visualizador Interactivo

* Abrir **[`index.html`](index.html)** en cualquier navegador para previsualizar los 3 modelos simultáneamente.
* Permite alternar con un botón entre **📱 Stories (1080×1920)** y **📸 Feed (1080×1350)** con escalado proporcional automático.

---

## 3. Directivas de Identidad Visual

1. **Tipografías:**
   - Titulares y números: **Poppins** (`font-weight: 700` / `800`).
   - Textos descriptivos y datos: **Source Sans 3** (`font-weight: 400` / `600` / `700`).
2. **Paleta de Colores:**
   - Azul Primario: `var(--brand-primary, #003890)`
   - Azul Noche: `var(--blue-900, #002878)`
   - Amarillo Acento: `var(--brand-accent, #ffd100)`
   - Blanco: `#ffffff`
3. **Imágenes y Recursos:**
   - El banco de fotografías profesionales por curso está disponible en `../../Imágenes Cursos/Promociones/` y en `../../assets/promociones/`.
   - Logotipos institucionales vectorizados en `../../Logos/`.