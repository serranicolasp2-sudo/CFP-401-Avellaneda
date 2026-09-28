const fs = require('fs');
const path = require('path');
const http = require('http');
const { createRequire } = require('module');
const { URL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const localRequire = createRequire(path.join(ROOT, 'fuente-jsx', 'package.json'));
// Chromium fijado de Playwright descargado en .local/browsers (si existe); si no, Edge o Chrome de la PC
const NAVEGADORES = path.join(ROOT, '.local', 'browsers');
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && fs.existsSync(NAVEGADORES)) process.env.PLAYWRIGHT_BROWSERS_PATH = NAVEGADORES;
const { chromium } = localRequire('playwright');
const pixelmatch = localRequire('pixelmatch').default;
const { PNG } = localRequire('pngjs');
const OUTPUT = path.join(ROOT, '.local', 'visual-results');
const BASELINES = path.join(__dirname, 'referencias-visuales');
const modelos = [
  'flyer-curso-v1', 'flyer-curso-v2', 'apertura-inscripciones-v1',
  'captacion-oficios-v1', 'ultimos-cupos-v1', 'conmemoraciones-patrias-v1', 'grilla-cursos-v1'
];
const formatos = ['feed', 'historia', 'a4'];
const cursoData = require('vm');
const sandbox = { window: {} };
cursoData.runInNewContext(fs.readFileSync(path.join(ROOT, 'site', 'data.js'), 'utf8'), sandbox);
const catalogo = sandbox.window.CFP_DATA;
const copiaLarga = {
  antetitulo: 'FORMACIÓN PROFESIONAL GRATUITA · CFP N° 401 AVELLANEDA',
  titulo: 'FORMACIÓN PROFESIONAL INTEGRAL CON CERTIFICACIÓN OFICIAL',
  titulo1: 'FORMACIÓN PROFESIONAL', titulo2: 'CON CERTIFICACIÓN OFICIAL',
  bajada: 'Formación gratuita y certificación oficial para aprender haciendo en talleres equipados con docentes especializados.',
  deck: 'Formación gratuita y certificación oficial para aprender haciendo en talleres equipados.',
  ctaEtiqueta: 'CONSULTÁ POR PRÓXIMAS INSCRIPCIONES',
  ctaTitulo: 'TE AYUDAMOS A ELEGIR EL CURSO IDEAL PARA VOS',
  whatsapp: '11 6105-6018', sede: 'Sede Juan Pablo Angulo 1272 · Dock Sud, Avellaneda',
  tagline: 'APRENDÉ HACIENDO · FORMACIÓN CON FUTURO',
  subtitulo: 'CURSOS ANUALES Y CUATRIMESTRALES · FORMACIÓN PROFESIONAL',
  nota: 'Consultá en sede los requisitos, días, horarios y modalidad de cursada.'
};

function mime(file) {
  return ({ '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' })[path.extname(file).toLowerCase()] || 'application/octet-stream';
}
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const target = path.resolve(ROOT, `.${pathname}`);
  if (!target.startsWith(ROOT + path.sep) && target !== ROOT) { res.writeHead(403); return res.end(); }
  fs.readFile(target, (err, bytes) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': mime(target), 'Cache-Control': 'no-store' });
    res.end(bytes);
  });
});

function promoFor(model, courseIndex, count) {
  const curso = catalogo.courses[Math.min(courseIndex, catalogo.courses.length - 1)];
  const datosCurso = curso ? { dias: curso.horarios || 'Lunes a viernes', horario: curso.horarios || '9:00 a 13:00 hs', requisito: curso.requisitos || 'Estudios secundarios', sede: curso.sede || 'Juan Pablo Angulo 1272, Dock Sud' } : {};
  const base = { id: `qa-${model}`, modelo: model, textos: {}, popupActivo: false, imagen: curso?.imagen || '' };
  if (model === 'flyer-curso-v1' || model === 'flyer-curso-v2' || model === 'ultimos-cupos-v1') {
    return { ...base, tipo: 'curso', cursoSlug: curso?.slug || '', cursoNombre: curso?.curso || 'CURSO DE FORMACIÓN', cursoTitulo: curso?.curso || 'Curso de Formación', familiaNombre: curso?.familia || 'Formación', datosCurso, diasOverride: datosCurso.dias, horarioOverride: datosCurso.horario, requisitoOverride: datosCurso.requisito, sedeOverride: datosCurso.sede, estadoCupo: 'ultimos-cupos', cupoConfirmadoEn: '2026-09-27', imagen: 'assets/promociones/tematicas/ultimos-cupos/ultimos-cupos-1.jpg' };
  }
  if (model === 'apertura-inscripciones-v1') return { ...base, tipo: 'inscripciones', familias: (catalogo.familias || []).map(f => f.nombre), textos: {} };
  if (model === 'captacion-oficios-v1') return { ...base, tipo: 'captacion', imagen: 'assets/promociones/tematicas/captacion/captacion-1.jpg' };
  if (model === 'conmemoraciones-patrias-v1') return { ...base, tipo: 'efemeride', imagen: 'assets/promociones/tematicas/dias-patrios/dias-patrios-1.jpg' };
  const cursos = catalogo.courses.slice(0, count).map(c => c.slug);
  return { ...base, tipo: 'grilla', periodo: 'marzo', composicion: 'grilla', cursosSeleccionados: cursos, pagina: 0 };
}

function queryCases() {
  const cases = [];
  // Reproduce una suite de 147 piezas: cada modelo/formato con siete variantes de texto.
  for (const model of modelos) for (const format of formatos) for (let variant = 0; variant < 7; variant++) {
    const courseIndex = (variant * 3) % catalogo.courses.length;
    const promo = promoFor(model, courseIndex, variant === 0 ? catalogo.courses.length : Math.min(1 + variant * 3, catalogo.courses.length));
    cases.push({ suite: 'base-147', model, format, promo: variant === 0 ? promo : { ...promo, textos: { ...copiaLarga, ...(variant > 3 ? { titulo: 'ÚLTIMOS CUPOS DISPONIBLES PARA INSCRIBIRTE' } : {}) } } });
  }
  // 126 variantes de estrés con mensajes y nombres extensos, distribuidos por todos los modelos.
  for (const model of modelos) for (const format of formatos) for (let variant = 0; variant < 6; variant++) {
    const promo = promoFor(model, catalogo.courses.length - 1 - variant, variant % 2 ? catalogo.courses.length : variant * 4);
    cases.push({ suite: 'stress-126', model, format, promo: { ...promo, textos: { ...copiaLarga, titulo: `${copiaLarga.titulo} ${variant + 1}`, titulo1: `${copiaLarga.titulo1} ${variant + 1}` } } });
  }
  // La grilla se extiende de 0 a 22 cursos por formato para no perder los límites vistos en producción.
  for (let count = 0; count <= catalogo.courses.length; count++) for (const format of formatos) {
    cases.push({ suite: 'grilla-0-a-22', model: 'grilla-cursos-v1', format, promo: promoFor('grilla-cursos-v1', 0, count) });
  }
  return cases;
}

// Usa el Chromium de Playwright si está descargado; si no, Edge o Chrome instalados en la PC
// (CFP_BROWSER_CHANNEL=msedge|chrome fuerza uno). Así el verificador corre sin descargas extra.
async function abrirNavegador() {
  const canales = process.env.CFP_BROWSER_CHANNEL ? [process.env.CFP_BROWSER_CHANNEL] : [undefined, 'msedge', 'chrome'];
  let ultimoError;
  for (const channel of canales) {
    try { return await chromium.launch({ headless: true, ...(channel ? { channel } : {}) }); }
    catch (error) { ultimoError = error; }
  }
  throw ultimoError;
}

async function main() {
  fs.mkdirSync(OUTPUT, { recursive: true });
  // Las capturas de fallas son de esta corrida: se borran las de corridas anteriores
  for (const viejo of fs.readdirSync(OUTPUT).filter(x => x.endsWith('-failure.png'))) fs.unlinkSync(path.join(OUTPUT, viejo));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const browser = await abrirNavegador();
  let failed = 0;
  const failureSamples = [];
  const pixelResults = [];
  try {
    const page = await browser.newPage({ viewport: { width: 2480, height: 1600 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${address.port}/herramientas/quality-fixture.html`, { waitUntil: 'networkidle' });
    // Las tipografías de Google Fonts se bajan recién al usarse: se cargan antes de medir para que la
    // geometría sea la del sitio y no la de la letra de reemplazo (Arial).
    const fuentesOk = await page.evaluate(async () => {
      const pedidos = ['400', '500', '600', '700', '800'].map(p => `${p} 20px Poppins`)
        .concat(['400', '600', '700'].map(p => `${p} 20px "Source Sans 3"`));
      await Promise.all(pedidos.map(f => document.fonts.load(f).catch(() => null)));
      await document.fonts.ready;
      return document.fonts.check('800 20px Poppins') && document.fonts.check('700 20px "Source Sans 3"');
    });
    if (!fuentesOk) console.warn('⚠ No cargaron Poppins/Source Sans 3 (¿sin internet?): las medidas usan la letra de reemplazo.');
    const cases = queryCases();
    for (let i = 0; i < cases.length; i++) {
      const test = cases[i];
      try {
        const result = await page.evaluate(async ({ promo, formato, caso }) => {
          const root = document.getElementById('root');
          root.style.width = formato === 'feed' ? '1080px' : formato === 'historia' ? '540px' : '794px';
          window.__cfpQualityRoot.render(React.createElement(RenderPromoFlyer, { promo, formato }));
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          await Promise.race([Promise.all(Array.from(document.images).map(img => img.decode().catch(() => null))), new Promise(resolve => setTimeout(resolve, 1800))]);
          await new Promise(resolve => requestAnimationFrame(resolve));
          const board = root.querySelector('.flyer-canvas, .board, article');
          if (!board) return { ok: false, reason: 'No aparece el artboard.' };
          const box = board.getBoundingClientRect();
          const textSelectors = '.headline,.course-tag,.deck,.proof,.course-details,.period-line,.footer-title,.footer-kicker,.contact-label,.phone,.note,.cta-title,.cta-label,.eyebrow,.subhead';
          const texts = Array.from(board.querySelectorAll(textSelectors)).filter(el => {
            const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
            return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
          });
          const outside = texts.filter(el => {
            const r = el.getBoundingClientRect();
            return r.left < box.left - 2 || r.right > box.right + 2 || r.top < box.top - 2 || r.bottom > box.bottom + 2;
          }).map(el => `${el.className || el.tagName}: fuera del artboard`);
          const collisions = [];
          for (let a = 0; a < texts.length; a++) for (let b = a + 1; b < texts.length; b++) {
            const x = texts[a].getBoundingClientRect(), y = texts[b].getBoundingClientRect();
            if (texts[a].contains(texts[b]) || texts[b].contains(texts[a])) continue;
            const overlapW = Math.min(x.right, y.right) - Math.max(x.left, y.left);
            const overlapH = Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top);
            if (overlapW > 2 && overlapH > 2) collisions.push(`${texts[a].className || texts[a].tagName} × ${texts[b].className || texts[b].tagName}`);
          }
          // Textos que se meten sobre la foto (las etiquetas que van adentro de la foto no cuentan)
          for (const foto of board.querySelectorAll('.photo-frame')) {
            const f = foto.getBoundingClientRect();
            for (const el of texts) {
              if (foto.contains(el) || el.contains(foto)) continue;
              const r = el.getBoundingClientRect();
              const w = Math.min(r.right, f.right) - Math.max(r.left, f.left);
              const h = Math.min(r.bottom, f.bottom) - Math.max(r.top, f.top);
              if (w > 2 && h > 2) collisions.push(`${el.className || el.tagName} × photo-frame`);
            }
          }
          const brokenImages = Array.from(board.querySelectorAll('img')).filter(img => !img.complete || img.naturalWidth === 0).map(img => img.getAttribute('src'));
          const overflowX = board.scrollWidth > board.clientWidth + 2;
          const overflowY = board.scrollHeight > board.clientHeight + 2;
          const overflowingChildren = Array.from(board.children).map(el => ({ className: String(el.className || el.tagName), right: Math.round(el.getBoundingClientRect().right - box.right), bottom: Math.round(el.getBoundingClientRect().bottom - box.bottom) })).filter(x => x.right > 2 || x.bottom > 2).slice(0, 8);
          const scrollOverflow = overflowX || overflowY;
          return { ok: !outside.length && !collisions.length && !brokenImages.length, outside, collisions, brokenImages, scrollOverflow, overflowX, overflowY, scrollWidth: board.scrollWidth, clientWidth: board.clientWidth, scrollHeight: board.scrollHeight, clientHeight: board.clientHeight, overflowingChildren, width: box.width, height: box.height, caseLabel: caso };
        }, { promo: test.promo, formato: test.format, caso: `${test.suite}/${test.model}/${test.format}/${i + 1}` });
        if (!result.ok) {
          failed++;
          if (failureSamples.length < 20) failureSamples.push(`✗ ${test.suite} ${test.model} ${test.format}: ${JSON.stringify(result)}`);
          const snapKey = `${test.model}__${test.format}-failure.png`;
          if (!fs.existsSync(path.join(OUTPUT, snapKey))) fs.writeFileSync(path.join(OUTPUT, snapKey), await page.locator('#root > *').first().screenshot());
        }
        if (i % 7 === 0) {
          const name = `${test.model}__${test.format}`;
          const baselinePath = path.join(BASELINES, `${name}.png`);
          if (fs.existsSync(BASELINES) && fs.existsSync(baselinePath)) {
            const shot = PNG.sync.read(await page.locator('#root > *').first().screenshot());
            const expected = PNG.sync.read(fs.readFileSync(baselinePath));
            if (shot.width !== expected.width || shot.height !== expected.height) {
              failed++;
              console.error(`✗ Pixel baseline ${name}: dimensiones ${shot.width}×${shot.height} vs ${expected.width}×${expected.height}`);
            } else {
              const diff = new PNG({ width: shot.width, height: shot.height });
              const pixels = pixelmatch(shot.data, expected.data, diff.data, shot.width, shot.height, { threshold: 0.08, includeAA: false });
              const ratio = pixels / (shot.width * shot.height);
              pixelResults.push({ name, diffPixels: pixels, ratio });
              fs.writeFileSync(path.join(OUTPUT, `${name}-diff.png`), PNG.sync.write(diff));
              if (ratio > 0.015) { failed++; console.error(`✗ Pixel baseline ${name}: ${(ratio * 100).toFixed(2)}% píxeles distintos`); }
            }
          } else if (process.env.CFP_CAPTURE_VISUALS === '1') {
            fs.writeFileSync(path.join(OUTPUT, `${name}.png`), await page.locator('#root > *').first().screenshot());
          }
        }
      } catch (error) {
        failed++;
        if (failureSamples.length < 20) failureSamples.push(`✗ ${test.suite} ${test.model} ${test.format}: ${error.message}`);
      }
    }
    if (errors.length) { failed += errors.length; for (const error of errors) if (failureSamples.length < 20) failureSamples.push(`✗ Error en página: ${error}`); }
    const names = new Set(pixelResults.map(x => x.name));
    const baselineCount = fs.existsSync(BASELINES) ? fs.readdirSync(BASELINES).filter(x => x.endsWith('.png')).length : 0;
    console.log(`Playwright Chromium ${browser.version()}: ${cases.length} escenarios; 147 base, 126 estrés, ${catalogo.courses.length + 1} tamaños de grilla × 3 formatos.`);
    for (const sample of failureSamples) console.error(sample);
    if (failed > failureSamples.length) console.error(`… ${failed - failureSamples.length} fallas adicionales omitidas.`);
    console.log(`Verificación de desbordes, imágenes y colisiones: ${failed ? 'con fallas' : 'OK'}.`);
    if (!baselineCount) console.log('ℹ Sin PNG de referencia aprobados: se ejecutó la matriz visual/geométrica; la comparación de píxeles queda lista y se activa al agregar referencias a herramientas/referencias-visuales/.');
    else console.log(`Comparación pixel por pixel: ${names.size} referencia(s), tolerancia máxima 1.5%.`);
    if (process.env.CFP_CAPTURE_VISUALS === '1') console.log(`Capturas actuales guardadas en ${path.relative(ROOT, OUTPUT)}`);
    if (failed) process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; server.close(); });
