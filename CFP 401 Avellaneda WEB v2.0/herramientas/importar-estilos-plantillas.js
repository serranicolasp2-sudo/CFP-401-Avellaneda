/* =============================================================================
   Importa al generador de promociones los estilos de los diseños de referencia de
   "Sistema de Diseño/Promociones y Redes/templates/" (captación, últimos cupos,
   conmemoraciones patrias, grilla de cursos y actividades institucionales), para que las piezas del panel salgan
   iguales a esos diseños.

   Qué hace con cada CSS:
   - descarta lo que es del visor (barra de edición, escenario, @media, @import, etc.);
   - limita cada regla a la plantilla (.pz-<id>) para que no afecte al resto del sitio;
   - pasa cada medida en px a "calc(N * var(--u))": --u vale 1 px del diseño medido sobre
     el ancho del lienzo (1080 en Feed y Stories, 1240 en A4), así la misma pieza sirve para
     la miniatura, la vista previa y el PNG final.

   El resultado se escribe dentro de fuente-jsx/plantillas-promo.jsx, entre las marcas
   ESTILOS-DISENO:INICIO y ESTILOS-DISENO:FIN. Después hay que compilar plantillas-promo.jsx.

   Uso (desde la carpeta "CFP 401 Avellaneda WEB v2.0"):
     node herramientas/importar-estilos-plantillas.js
   ============================================================================= */
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const TEMPLATES = path.join(RAIZ, '..', 'Sistema de Diseño', 'Promociones y Redes', 'templates');
const DESTINO = path.join(RAIZ, 'fuente-jsx', 'plantillas-promo.jsx');

const PLANTILLAS = [
  { id: 'captacion', css: 'captacion-oficios/captacion.css' },
  { id: 'cupos', css: 'ultimos-cupos/ultimos-cupos.css' },
  { id: 'patrias', css: 'conmemoraciones-patrias/conmemoraciones.css' },
  { id: 'grilla', css: 'grilla-cursos-inicio/grilla-cursos.css' },
  { id: 'actividad', css: 'actividades-institucionales/actividades.css' }
];

// Selectores del visor y de la edición en el navegador, que no forman parte de la pieza
const DEL_VISOR = [
  /^(html|body)\b/, /^\.(editor|stage|course-tools|tools-|course-option|data-status|page-controls|period-control|search-control|edit-note)/,
  /\.course-tools\b/, /^\[contenteditable/, /:focus(-within)?\b/
];
// Clases que en el diseño van en el mismo elemento que .board (se combinan con .pz-<id>)
const DEL_LIENZO = /^\.(board|feed|stories|a4|rows|grid-off)\b/;
// Declaraciones que solo usa el visor
const PROPIEDADES_DEL_VISOR = /^(--board-width|--board-height|--scale|--photo-url)$/;

function reglas(css) {
  // Sin comentarios ni @import (la URL de Google Fonts lleva ";" adentro)
  css = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@import\s+url\((?:"[^"]*"|'[^']*'|[^)]*)\)[^;\n]*;?/g, '');
  const salida = [];
  let i = 0;
  while (i < css.length) {
    const llave = css.indexOf('{', i);
    const puntoYComa = css.indexOf(';', i);
    // Sentencias como @import (terminan en ";", sin bloque)
    if (puntoYComa !== -1 && (llave === -1 || puntoYComa < llave) && css.slice(i, puntoYComa).trim().startsWith('@')) { i = puntoYComa + 1; continue; }
    if (llave === -1) break;
    const preludio = css.slice(i, llave).trim();
    // Buscar la llave de cierre (con anidamiento, por los @media)
    let prof = 1, j = llave + 1;
    while (j < css.length && prof > 0) { if (css[j] === '{') prof++; else if (css[j] === '}') prof--; j++; }
    const cuerpo = css.slice(llave + 1, j - 1);
    if (!preludio.startsWith('@')) salida.push({ selectores: preludio, cuerpo });
    i = j;
  }
  return salida;
}

function convertirMedidas(valor) {
  return valor.replace(/(-?\d*\.?\d+)px\b/g, (m, n) => `calc(${n} * var(--u))`);
}

function convertir(id, css) {
  const alcance = `.pz-${id}`;
  const partes = [
    `${alcance}.feed,${alcance}.stories{--u:calc(100cqw / 1080)}`,
    `${alcance}.a4{--u:calc(100cqw / 1240)}`,
    // Margen que el navegador le da a <figure> en el visor de los diseños (1em 40px), escalado con la pieza
    `${alcance} figure{margin:calc(16 * var(--u)) calc(40 * var(--u))}`
  ];
  for (const { selectores, cuerpo } of reglas(css)) {
    const lista = selectores.split(',').map(s => s.trim()).filter(Boolean)
      .filter(s => !DEL_VISOR.some(re => re.test(s)));
    if (!lista.length) continue;
    const esLienzo = lista.length === 1 && lista[0] === '.board';
    const nuevos = lista.map(s => {
      if (s === ':root') return alcance;
      if (s === '*') return `${alcance},${alcance} *`;
      if (DEL_LIENZO.test(s)) return alcance + s;
      return `${alcance} ${s}`;
    });
    let declaraciones = cuerpo.split(';').map(d => d.trim()).filter(Boolean).filter(d => {
      const prop = d.slice(0, d.indexOf(':')).trim();
      if (PROPIEDADES_DEL_VISOR.test(prop)) return false;
      if (esLienzo && /^(width|height|transform|transform-origin|position)$/.test(prop)) return false;
      return true;
    }).map(convertirMedidas);
    if (esLienzo) declaraciones = ['position:absolute', 'inset:0'].concat(declaraciones);
    if (!declaraciones.length) continue;
    partes.push(`${nuevos.join(',')}{${declaraciones.join(';')}}`);
  }
  return partes.join('\n');
}

const bloques = PLANTILLAS.map(({ id, css }) => {
  const origen = path.join(TEMPLATES, css);
  const texto = convertir(id, fs.readFileSync(origen, 'utf8'));
  if (/[`]|\$\{/.test(texto)) throw new Error(`El CSS de ${css} tiene caracteres que no se pueden incrustar`);
  return `  ${id}: \`\n${texto}\n\``;
});

const INICIO = '/* ESTILOS-DISENO:INICIO';
const FIN = '/* ESTILOS-DISENO:FIN */';
const bloque = `${INICIO} — generado por herramientas/importar-estilos-plantillas.js a partir de
   "Sistema de Diseño/Promociones y Redes/templates/". No editar a mano: cambiar el diseño y volver a correr el script. */
const CSS_PLANTILLAS_DISENO = {
${bloques.join(',\n')}
};
${FIN}`;

let fuente = fs.readFileSync(DESTINO, 'utf8');
const a = fuente.indexOf(INICIO), b = fuente.indexOf(FIN);
if (a === -1 || b === -1 || b < a) throw new Error('No encontré las marcas ESTILOS-DISENO en plantillas-promo.jsx');
fuente = fuente.slice(0, a) + bloque + fuente.slice(b + FIN.length);
fs.writeFileSync(DESTINO, fuente, 'utf8');
console.log(`OK: estilos de ${PLANTILLAS.length} plantillas importados a fuente-jsx/plantillas-promo.jsx`);
