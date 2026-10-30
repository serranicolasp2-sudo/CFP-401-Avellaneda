// Prueba de punta a punta (Fase 0) sobre una COPIA del sitio en .local/e2e-copia, con una clave de prueba
// aleatoria generada en el momento (no se imprime ni se guarda fuera de la copia, que se borra al terminar).
// Levanta PHP en 127.0.0.1 y usa Chromium de Playwright, Edge o Chrome. Uso: npm run verify:e2e
// PHP: definí PHP_BINARY si php no está en el PATH.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), vm = require('vm');
const { spawn, spawnSync } = require('child_process');
const { createRequire } = require('module');
const V2 = path.resolve(__dirname, '..');
const req = createRequire(path.join(V2, 'fuente-jsx', 'package.json'));
const NAVEGADORES = path.join(V2, '.local', 'browsers');
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && fs.existsSync(NAVEGADORES)) process.env.PLAYWRIGHT_BROWSERS_PATH = NAVEGADORES;
const { chromium } = req('playwright');
const { PNG } = req('pngjs');
const PHP_WINGET = 'C:\\Users\\Nicolás\\AppData\\Local\\Microsoft\\WinGet\\Packages\\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\\php.exe';
const PHP = process.env.PHP_BINARY || (fs.existsSync(PHP_WINGET) ? PHP_WINGET : 'php');
const T = path.join(V2, '.local', 'e2e-copia');
const PORT = 8781;
const BASE = `http://127.0.0.1:${PORT}`;

let fallas = 0;
function ok(cond, texto, extra) { console.log(`${cond ? '✓' : '✗'} ${texto}${extra ? ' — ' + extra : ''}`); if (!cond) fallas++; }

function hoyBA() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date()); }
function leerData(file) { const sb = { window: {} }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), sb); return sb.window.CFP_DATA; }
function escribirData(file, data) { fs.writeFileSync(file, 'window.CFP_DATA = ' + JSON.stringify(data, null, 2) + ';\n'); }
function pngRuido(w, h) {
  const png = new PNG({ width: w, height: h });
  for (let i = 0; i < png.data.length; i += 4) { png.data[i] = (i * 7) & 255; png.data[i + 1] = (i * 13) & 255; png.data[i + 2] = crypto.randomInt(256); png.data[i + 3] = 255; }
  return PNG.sync.write(png);
}

// Copia recursiva simple (sin sesiones, respaldos ni piezas guardadas del sitio real)
function copiarCarpeta(origen, destino) {
  fs.mkdirSync(destino, { recursive: true });
  for (const item of fs.readdirSync(origen, { withFileTypes: true })) {
    if (['sesiones', 'backups', 'guardadas'].includes(item.name)) continue;
    const a = path.join(origen, item.name), b = path.join(destino, item.name);
    if (item.isDirectory()) copiarCarpeta(a, b); else fs.copyFileSync(a, b);
  }
}

async function abrirNavegador() {
  let ultimo;
  for (const channel of [undefined, 'msedge', 'chrome']) {
    try { return await chromium.launch({ headless: true, ...(channel ? { channel } : {}) }); } catch (e) { ultimo = e; }
  }
  throw ultimo;
}

async function main() {
  // ── Copia del sitio con clave de prueba
  fs.rmSync(T, { recursive: true, force: true });
  fs.mkdirSync(path.join(T, 'herramientas'), { recursive: true });
  copiarCarpeta(path.join(V2, 'site'), path.join(T, 'site'));
  fs.copyFileSync(path.join(V2, 'herramientas', 'generar-clave-maestra.php'), path.join(T, 'herramientas', 'generar-clave-maestra.php'));
  for (const f of ['.clave-maestra.json', '.clave.json', '.intentos.json']) fs.rmSync(path.join(T, 'site', 'api', f), { force: true });
  fs.rmSync(path.join(T, 'site', 'api', 'sesiones'), { recursive: true, force: true });
  const clave = 'Prueba-' + crypto.randomBytes(9).toString('base64url');
  const gen = spawnSync(PHP, [path.join(T, 'herramientas', 'generar-clave-maestra.php')], { input: `${clave}\n${clave}\n`, cwd: T, encoding: 'utf8' });
  ok(fs.existsSync(path.join(T, 'site', 'api', '.clave-maestra.json')), 'Clave de prueba generada solo en la copia');

  // Datos de la copia: una promo "desactualizada" (huella vieja) con un campo personalizado y otro no
  const dataFile = path.join(T, 'site', 'data.js');
  const data = leerData(dataFile);
  // Las pruebas de promociones usan dos piezas fijas (Soldador Básico y Auxiliar Contable). Si en el sitio real las
  // borraron desde el panel, se agregan a la copia desde herramientas/fixtures/promociones-e2e.json
  data.promociones = data.promociones || [];
  // (al principio de la lista, como estaban: así las encuentran primero las búsquedas por texto de las tarjetas)
  const fijas = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'promociones-e2e.json'), 'utf8'));
  data.promociones.unshift(...fijas.filter(fija => !data.promociones.some(p => p.id === fija.id)));
  const iAux = data.promociones.findIndex(p => p.cursoSlug === 'auxiliar-contable');
  const aux = data.promociones[iAux];
  data.promociones[iAux] = { ...aux, huellaCurso: 'fnv1a-00000000', datosCurso: { ...(aux.datosCurso || {}), dias: 'Día viejo' }, diasOverride: 'Día viejo', sedeOverride: 'Sede personalizada (prueba)' };
  // El caso 4 prueba el logo propio de la cinta AMARILLA: en la copia se fija ese estilo (en el sitio real puede estar en blanca)
  if (data.home && data.home.cintaAmarilla) data.home.cintaAmarilla.estilo = 'amarilla';
  escribirData(dataFile, data);
  const original = JSON.parse(JSON.stringify(data));

  // Servidor principal con los límites de api/.user.ini (el servidor de PHP de consola no lee .user.ini)
  const server = spawn(PHP, ['-d', 'upload_max_filesize=25M', '-d', 'post_max_size=30M', '-d', 'display_errors=0', '-S', `127.0.0.1:${PORT}`, '-t', path.join(T, 'site')], { cwd: T, stdio: 'ignore' });
  // Servidor con los límites por defecto de PHP (2M / 8M), para ver el aviso de pieza demasiado pesada
  const serverChico = spawn(PHP, ['-d', 'display_errors=0', '-S', `127.0.0.1:${PORT + 1}`, '-t', path.join(T, 'site')], { cwd: T, stdio: 'ignore' });
  for (const u of [BASE, `http://127.0.0.1:${PORT + 1}`]) for (let i = 0; i < 40; i++) { try { await fetch(`${u}/api/sesion.php`); break; } catch { await new Promise(r => setTimeout(r, 250)); } }

  try {
    // ── API: sesión
    const login = await fetch(`${BASE}/api/login.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: clave }) });
    const cookie = (login.headers.get('set-cookie') || '').split(';')[0];
    ok(login.status === 200 && cookie, 'Login con la clave de prueba', `HTTP ${login.status}`);
    const guardar = async (d) => { const r = await fetch(`${BASE}/api/guardar.php`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ data: d }) }); return { status: r.status, body: (await r.text()).slice(0, 160) }; };

    // ── API: reglas de cupos y vigencia del pop-up
    const conCupos = (curso, extra = {}) => {
      const d = JSON.parse(JSON.stringify(original));
      const c = d.courses.find(x => x.slug === 'soldador-basico');
      Object.assign(c, curso);
      d.promociones.push({ id: 'promo-prueba-cupos', modelo: 'ultimos-cupos-v1', tipo: 'curso', cursoSlug: 'soldador-basico', textos: {}, popupActivo: true, ...extra });
      return d;
    };
    let r = await guardar(conCupos({}));
    ok(r.status >= 400 && r.status < 500, 'Rechaza pop-up de "Últimos cupos" sin estado confirmado', `${r.status} ${r.body}`);
    r = await guardar(conCupos({ estadoCupo: 'ultimos-cupos', cupoConfirmadoEn: '2026-01-02' }));
    ok(r.status >= 400 && r.status < 500, 'Rechaza "Últimos cupos" con confirmación vencida (>30 días)', `${r.status}`);
    r = await guardar(conCupos({ estadoCupo: 'completo', cupoConfirmadoEn: hoyBA() }));
    ok(r.status >= 400 && r.status < 500, 'Rechaza "Últimos cupos" si el curso está completo', `${r.status}`);
    r = await guardar(conCupos({ estadoCupo: 'ultimos-cupos', cupoConfirmadoEn: hoyBA() }));
    ok(r.status === 200, 'Acepta "Últimos cupos" confirmado hoy', `${r.status} ${r.body}`);
    r = await guardar(conCupos({ estadoCupo: 'inventado' }, { popupActivo: false }));
    ok(r.status >= 400 && r.status < 500, 'Rechaza un estado de cupos inexistente', `${r.status}`);
    r = await guardar(conCupos({ estadoCupo: 'abierto', cupoConfirmadoEn: '2026-13-45' }, { popupActivo: false }));
    ok(r.status >= 400 && r.status < 500, 'Rechaza una fecha de confirmación inválida', `${r.status}`);
    const fechas = JSON.parse(JSON.stringify(original));
    fechas.promociones[0] = { ...fechas.promociones[0], popupDesde: '2026-10-10', popupHasta: '2026-10-01' };
    r = await guardar(fechas);
    ok(r.status >= 400 && r.status < 500, 'Rechaza vigencia con fin anterior al inicio', `${r.status}`);
    r = await guardar(original);
    ok(r.status === 200, 'Guarda de nuevo los datos originales de la copia', `${r.status} ${r.body}`);

    // ── API: guardar PNG
    const subir = async (buf, campos = {}, conCookie = true, nombre = 'pieza.png') => {
      const fd = new FormData();
      fd.append('png', new Blob([buf], { type: 'image/png' }), nombre);
      for (const [k, v] of Object.entries({ promoId: 'promo-soldador-basico', formato: 'feed', ...campos })) fd.append(k, v);
      const res = await fetch(`${BASE}/api/guardar-promo-png.php`, { method: 'POST', headers: conCookie ? { Cookie: cookie } : {}, body: fd });
      let json = null; try { json = await res.json(); } catch {}
      return { status: res.status, json };
    };
    const pieza = pngRuido(1080, 1350);
    r = await subir(pieza, {}, false);
    ok(r.status === 401, 'PNG: sin sesión responde 401', `${r.status}`);
    r = await subir(pieza);
    ok(r.status === 200 && r.json && r.json.success && /^assets\/promociones\/guardadas\/promo-soldador-basico-feed-[\w-]+\.png$/.test(r.json.url), 'PNG: guarda la pieza con nombre seguro', `${r.status} ${r.json && r.json.url}`);
    if (r.json && r.json.url) {
      const get = await fetch(`${BASE}/${r.json.url}`);
      ok(get.status === 200 && (await get.arrayBuffer()).byteLength === pieza.length, 'PNG: el archivo guardado se sirve idéntico');
    }
    r = await subir(Buffer.from('<?php echo "hola"; ?>'.repeat(80)), {}, true, 'x.png');
    ok(r.status >= 400 && r.status < 500, 'PNG: rechaza un archivo que no es PNG', `${r.status}`);
    r = await subir(pieza, { formato: 'poster' });
    ok(r.status >= 400 && r.status < 500, 'PNG: rechaza un formato desconocido', `${r.status}`);
    r = await subir(pngRuido(2600, 300));
    ok(r.status >= 400 && r.status < 500, 'PNG: rechaza medidas mayores que A4 (2480×3508)', `${r.status}`);
    const a4 = pngRuido(2480, 3508);
    r = await subir(a4, { formato: 'a4' });
    ok(r.status === 200 && r.json && r.json.success, `PNG: acepta un A4 pesado (${(a4.length / 1048576).toFixed(1)} MB) con los límites de .user.ini`, `${r.status} ${r.json && (r.json.error || r.json.url)}`);
    {
      const l2 = await fetch(`http://127.0.0.1:${PORT + 1}/api/login.php`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: clave }) });
      const c2 = (l2.headers.get('set-cookie') || '').split(';')[0];
      const fd = new FormData();
      fd.append('png', new Blob([pieza], { type: 'image/png' }), 'p.png'); fd.append('promoId', 'x'); fd.append('formato', 'feed');
      const res = await fetch(`http://127.0.0.1:${PORT + 1}/api/guardar-promo-png.php`, { method: 'POST', headers: { Cookie: c2 }, body: fd });
      const txt = await res.text();
      ok(res.status === 413 && /upload_max_filesize|post_max_size/.test(txt), `PNG: con límites por defecto (${(pieza.length / 1048576).toFixed(1)} MB) responde 413 y dice qué límite ajustar`, `${res.status} ${txt.slice(0, 120)}`);
    }
    r = await subir(pieza, { promoId: '../../api/evil' });
    ok(r.status === 200 && r.json && !/\.\.|\/api\//.test(r.json.url.replace('assets/promociones/guardadas/', '')), 'PNG: el promoId con "../" queda saneado dentro de guardadas/', r.json && r.json.url);

    // ── Panel en el navegador
    const browser = await abrirNavegador();
    navegadorAbierto = browser;
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errores = [];
    page.on('pageerror', e => errores.push(e.message));
    await page.goto(`${BASE}/admin.html`, { waitUntil: 'networkidle' });
    // Desde el 14/10/2026 el ingreso pide además el nombre del operador (auditoría de cambios)
    const operador = page.locator('.form-group:has(> label:text-is("Operador / Nombre de usuario")) input');
    if (await operador.count()) await operador.fill('Prueba e2e');
    await page.fill('input[type="password"]', clave);
    await page.click('button[type="submit"]');
    await page.locator('.admin-nav-item', { hasText: 'Promo' }).first().click();
    await page.waitForSelector('.promo-card');

    const tarjetaAux = page.locator('.promo-card', { hasText: 'Datos desactualizados' });
    ok(await tarjetaAux.count() === 1, 'La promo con huella vieja muestra el aviso "Datos desactualizados"');

    const enviado = () => new Promise(resolve => {
      const h = rq => { if (rq.url().includes('api/guardar.php') && rq.method() === 'POST') { page.off('request', h); resolve(JSON.parse(rq.postData()).data); } };
      page.on('request', h);
    });
    const campo = etiqueta => page.locator(`.form-group:has(> label:text-is("${etiqueta}")) input`).first();

    // Caso 1: editar una promo al día y cambiar solo "Días"
    const antes = original.promociones.find(p => p.id === 'promo-soldador-basico');
    await page.locator('.promo-card', { hasText: /soldador/i }).first().getByRole('button', { name: /Editar/ }).click();
    await campo('Días').fill('Martes y jueves (prueba)');
    await page.getByRole('button', { name: /Guardar Promoción/ }).click();
    let espera = enviado();
    await page.locator('[data-accion="guardar-servidor"]').click(); // barra completa o pastilla discreta (Promociones)
    let guardado = await espera;
    let p1 = guardado.promociones.find(p => p.cursoSlug === 'soldador-basico');
    ok(p1 && p1.id === antes.id, 'Editar y guardar conserva el id de la promo', p1 && p1.id);
    ok(p1 && p1.diasOverride === 'Martes y jueves (prueba)', 'Conserva el cambio manual de "Días"', p1 && p1.diasOverride);
    ok(p1 && p1.horarioOverride === antes.horarioOverride && p1.requisitoOverride === antes.requisitoOverride && p1.sedeOverride === antes.sedeOverride, 'No toca horario, requisito ni sede');
    ok(p1 && p1.fondo === antes.fondo && p1.fechaCreacion === antes.fechaCreacion && p1.cursoNombre === antes.cursoNombre, 'Conserva fondo, fecha de creación y titular', p1 && `${p1.fondo} · ${p1.fechaCreacion} · ${p1.cursoNombre}`);
    ok(p1 && /^fnv1a-[0-9a-f]{8}$/.test(p1.huellaCurso || ''), 'Guarda la huella del curso', p1 && p1.huellaCurso);
    // Cifras institucionales (14/10/2026): el panel las agrega a data.js con los valores vigentes si faltan
    const cifrasGuardadas = guardado.estadisticas;
    ok(cifrasGuardadas && Array.isArray(cifrasGuardadas.items) && cifrasGuardadas.items.length === 4 && cifrasGuardadas.items[1].valor === '+36.000', 'Cifras institucionales: el panel las guarda en data.js (2 × 2, editables)', cifrasGuardadas && JSON.stringify(cifrasGuardadas.items.map(i => i.valor)));

    // Caso 2: editar la promo desactualizada
    await tarjetaAux.getByRole('button', { name: /Editar/ }).click();
    const diasNuevos = await campo('Días').inputValue();
    ok(diasNuevos && diasNuevos !== 'Día viejo', 'Al editar una promo desactualizada trae los días actuales del curso', diasNuevos);
    ok(await campo('Sede').inputValue() === 'Sede personalizada (prueba)', 'Y conserva la sede que se había personalizado');
    await page.getByRole('button', { name: /Guardar Promoción/ }).click();
    ok(await page.locator('.promo-card', { hasText: 'Datos desactualizados' }).count() === 0, 'Después de guardarla, el aviso desaparece');
    espera = enviado();
    await page.locator('[data-accion="guardar-servidor"]').click(); // barra completa o pastilla discreta (Promociones)
    guardado = await espera;
    const p2 = guardado.promociones.find(p => p.cursoSlug === 'auxiliar-contable');
    ok(p2 && p2.id === aux.id && p2.huellaCurso !== 'fnv1a-00000000', 'Mantiene su id y actualiza la huella', p2 && `${p2.id} · ${p2.huellaCurso}`);
    // Caso 3: Aviso Primaria (solo Stories, sin curso, con fotos propias)
    await page.getByRole('button', { name: /Nueva Promoción/ }).click();
    await page.locator('strong', { hasText: 'Aviso Primaria (Stories)' }).click();
    ok(await page.locator('.promo-stepper-bar [aria-disabled]').nth(1).getAttribute('aria-disabled') === 'true', 'Aviso Primaria: el paso 2 (curso) queda bloqueado');
    // Al elegir el modelo pasa solo al paso siguiente habilitado (el 3); al elegir la foto, a la vista previa
    await page.locator('h4', { hasText: 'Elegí la foto de fondo' }).waitFor({ timeout: 5000 }).catch(() => {});
    ok(await page.locator('h4', { hasText: 'Elegí la foto de fondo' }).count() === 1 && await page.locator('.modal-card img[src*="tematicas/primaria/"]').count() >= 2, 'Aviso Primaria: al elegir el modelo pasa solo al paso 3, con las fotos propias de la plantilla');
    await page.locator('.modal-card img[src*="tematicas/primaria/"]').first().click();
    await page.locator('.promo-preview-col').waitFor({ timeout: 5000 }).catch(() => {});
    ok(await page.locator('.promo-preview-col').count() === 1, 'Promociones: al elegir la foto pasa solo a la vista previa');
    // Solo la botonera de formatos (debajo de la vista previa también están los botones de encuadre)
    const botonesFormato = await page.locator('.promo-preview-col > div:first-child button').allInnerTexts();
    ok(botonesFormato.join('|') === 'Historia 9:16', 'Aviso Primaria: la vista previa solo ofrece Historia', botonesFormato.join(' | '));
    const pieModal = page.locator('.promo-footer-descargas');
    ok(await pieModal.getByRole('button', { name: /Feed/ }).count() === 0 && await pieModal.getByRole('button', { name: /A4/ }).count() === 0 && await pieModal.getByRole('button', { name: /Historia/ }).count() === 1, 'Aviso Primaria: solo ofrece descargar Historia');
    await campo('Sello: día').fill('20');
    await page.getByRole('button', { name: /Guardar Promoción/ }).click();
    const tarjetaPrimaria = page.locator('.promo-card', { hasText: 'Aviso Primaria' });
    ok(await tarjetaPrimaria.count() === 1 && await tarjetaPrimaria.getByRole('button', { name: /Feed 4:5/ }).count() === 0 && await tarjetaPrimaria.getByRole('button', { name: /Historia 9:16/ }).count() === 1, 'Aviso Primaria: la tarjeta solo descarga Historia');
    espera = enviado();
    await page.locator('[data-accion="guardar-servidor"]').click(); // barra completa o pastilla discreta (Promociones)
    guardado = await espera;
    const p3 = guardado.promociones.find(p => p.modelo === 'aviso-primaria-v1');
    ok(p3 && p3.textos && p3.textos.selloNumero === '20' && /tematicas\/primaria\//.test(p3.imagen || '') && !p3.cursoSlug, 'Aviso Primaria: se guarda con su texto editado, su foto y sin curso', p3 && JSON.stringify({ sello: p3.textos.selloNumero, imagen: p3.imagen }));
    // Caso 3b: Actividades institucionales (sin curso, tres formatos, fotos propias y arco opcional)
    await page.getByRole('button', { name: /Nueva Promoción/ }).click();
    await page.locator('strong', { hasText: 'Actividades Institucionales' }).click();
    ok(await page.locator('.promo-stepper-bar [aria-disabled]').nth(1).getAttribute('aria-disabled') === 'true', 'Actividades: el paso 2 (curso) queda bloqueado');
    await page.locator('h4', { hasText: 'Elegí la foto de fondo' }).waitFor({ timeout: 5000 }).catch(() => {});
    ok(await page.locator('img[src*="tematicas/actividades/"]').count() >= 1, 'Actividades: el paso 3 ofrece la foto propia de la plantilla');
    await page.getByRole('button', { name: /^Continuar/ }).first().click();
    await page.locator('.promo-preview-col').waitFor({ timeout: 5000 }).catch(() => {});
    const formatosActividad = await page.locator('.promo-preview-col > div:first-child button').allInnerTexts();
    ok(formatosActividad.length === 3, 'Actividades: la vista previa ofrece Feed, Historia y A4', formatosActividad.join(' | '));
    const pieActividad = page.locator('.promo-footer-descargas');
    ok(await pieActividad.getByRole('button', { name: /Feed/ }).count() === 1 && await pieActividad.getByRole('button', { name: /Historia/ }).count() === 1 && await pieActividad.getByRole('button', { name: /A4/ }).count() === 1, 'Actividades: ofrece descargar los tres formatos');
    await page.locator('.form-group:has(> label:text-is("Titular (tema)")) textarea').first().fill('Charla de prueba');
    await page.locator('label', { hasText: 'Arco de fondo (marca de agua)' }).locator('input[type="checkbox"]').uncheck();
    const titularVista = await page.locator('.pz-actividad .headline').first().innerText().catch(() => '');
    ok(/charla de prueba/i.test(titularVista), 'Actividades: la vista previa muestra el titular editado', titularVista);
    ok(await page.locator('.pz-actividad.sin-arco').count() >= 1, 'Actividades: al destildar el arco, la vista previa lo oculta');
    // Descarga real (html-to-image) de cada formato: proporción del lienzo y franja amarilla del corte en diagonal.
    // Las piezas quedan en .local/visual-results/ para mirarlas.
    for (const [formato, boton, ancho, alto, yFranja] of [['feed', /Feed/, 1080, 1350, 787], ['historia', /Historia/, 1080, 1920, 1107], ['a4', /A4/, 1240, 1754, 1048]]) {
      const [descarga] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), pieActividad.getByRole('button', { name: boton }).click()]);
      const destino = path.join(V2, '.local', 'visual-results', `actividad-${formato}.png`);
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      await descarga.saveAs(destino);
      const png = PNG.sync.read(fs.readFileSync(destino));
      const s = png.width / ancho;
      const i = (Math.round(yFranja * s) * png.width + Math.round(10 * s)) * 4;
      const amarilla = png.data[i] > 230 && png.data[i + 1] > 190 && png.data[i + 2] < 90;
      ok(Math.abs(png.height / png.width - alto / ancho) < 0.01 && amarilla, `Actividades: descarga ${formato} con la proporción y el corte del diseño`, `${png.width}×${png.height}`);
    }
    await page.getByRole('button', { name: /Guardar Promoción/ }).click();
    espera = enviado();
    await page.locator('[data-accion="guardar-servidor"]').click(); // barra completa o pastilla discreta (Promociones)
    guardado = await espera;
    const p3b = guardado.promociones.find(p => p.modelo === 'actividad-institucional-v1');
    ok(p3b && p3b.textos && p3b.textos.titulo === 'Charla de prueba' && /tematicas\/actividades\//.test(p3b.imagen || '') && p3b.mostrarArco === false && !p3b.cursoSlug, 'Actividades: se guarda con su titular, su foto, sin arco y sin curso', p3b && JSON.stringify({ titulo: p3b.textos && p3b.textos.titulo, imagen: p3b.imagen, arco: p3b.mostrarArco }));
    // Caso 3c: Invitación institucional (sin curso, Historia y Feed, cuadrícula opcional).
    // La casilla y la pieza tienen que decir lo mismo, en la vista previa y en el PNG descargado.
    await page.getByRole('button', { name: /Nueva Promoción/ }).click();
    await page.locator('strong', { hasText: 'Invitación Institucional' }).click();
    ok(await page.locator('.promo-stepper-bar [aria-disabled]').nth(1).getAttribute('aria-disabled') === 'true', 'Invitación: el paso 2 (curso) queda bloqueado');
    await page.getByRole('button', { name: /^Continuar/ }).first().click();
    ok(await page.locator('img[src*="tematicas/invitaciones/"]').count() >= 1, 'Invitación: el paso 3 ofrece las fotos propias de la plantilla');
    await page.getByRole('button', { name: /^Continuar/ }).first().click();
    const casillaTrama = page.locator('label', { hasText: 'Trama cuadriculada' }).locator('input[type="checkbox"]');
    const vistaConTrama = () => page.locator('.promo-preview-col .pz-invitaciones.con-cuadricula').count();
    ok((await casillaTrama.isChecked()) === ((await vistaConTrama()) >= 1), 'Invitación: al abrir, la casilla de cuadrícula coincide con la vista previa', `casilla ${await casillaTrama.isChecked()} · trama ${await vistaConTrama()}`);
    await casillaTrama.uncheck();
    ok((await vistaConTrama()) === 0, 'Invitación: al destildar la cuadrícula, la vista previa queda lisa');
    await casillaTrama.check();
    ok((await vistaConTrama()) >= 1, 'Invitación: al tildar la cuadrícula, la vista previa la muestra');
    // Líneas verticales de la trama en la franja vacía de abajo: tienen que verse también a escala chica
    const lineasTrama = png => {
      const y = Math.round(png.height * 0.975);
      const brillo = x => { const i = (y * png.width + x) * 4; return png.data[i] + png.data[i + 1] + png.data[i + 2]; };
      let lineas = 0;
      for (let x = 2; x < png.width - 2; x++) if (brillo(x) > brillo(x - 2) + 12 && brillo(x) >= brillo(x + 1)) lineas++;
      return lineas;
    };
    const capturaVista = path.join(V2, '.local', 'visual-results', 'invitacion-vista-previa.png');
    await page.locator('.promo-preview-col .flyer-canvas').first().screenshot({ path: capturaVista });
    const lineasVista = lineasTrama(PNG.sync.read(fs.readFileSync(capturaVista)));
    ok(lineasVista >= 10, 'Invitación: la trama se ve en la vista previa', `${lineasVista} líneas`);
    const campoPie = page.locator('.form-group:has(> label:has-text("Pie de foto")) input').first();
    ok(/Refrigeradores/.test(await campoPie.inputValue()), 'Invitación: el campo Pie de foto muestra el texto de la foto', await campoPie.inputValue());
    await campoPie.fill('Pie de prueba');
    ok(await page.locator('.promo-preview-col .photo-caption').first().innerText() === 'Pie de prueba', 'Invitación: el pie de foto editado aparece en la vista previa');
    const casillaPie = page.locator('label', { hasText: /^Pie de foto$/ }).locator('input[type="checkbox"]');
    await casillaPie.uncheck();
    ok(await page.locator('.promo-preview-col .photo-caption').count() === 0, 'Invitación: el pie de foto se puede ocultar');
    await casillaPie.check();
    const pieInvitacion = page.locator('.promo-footer-descargas');
    for (const [formato, boton] of [['historia', /Historia/], ['feed', /Feed/]]) {
      const [descarga] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), pieInvitacion.getByRole('button', { name: boton }).click()]);
      const destino = path.join(V2, '.local', 'visual-results', `invitacion-${formato}.png`);
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      await descarga.saveAs(destino);
      const lineasPng = lineasTrama(PNG.sync.read(fs.readFileSync(destino)));
      ok(lineasPng >= 15, `Invitación: el PNG ${formato} sale con la trama`, `${lineasPng} líneas`);
    }
    await page.getByRole('button', { name: /Guardar Promoción/ }).click();
    espera = enviado();
    await page.locator('[data-accion="guardar-servidor"]').click();
    guardado = await espera;
    const p3c = guardado.promociones.find(p => p.modelo === 'invitacion-institucional-v1');
    ok(p3c && p3c.tipo === 'evento' && !p3c.cursoSlug && /tematicas\/invitaciones\//.test(p3c.imagen || '') && p3c.mostrarCuadricula === true, 'Invitación: se guarda como evento, sin curso, con su foto y con cuadrícula', p3c && JSON.stringify({ tipo: p3c.tipo, curso: p3c.cursoSlug, imagen: p3c.imagen, trama: p3c.mostrarCuadricula }));
    // Caso 4: logo propio para la cinta amarilla (PNG transparente subido desde el panel)
    {
      const logo = new PNG({ width: 300, height: 48 });
      for (let i = 0; i < logo.data.length; i += 4) { const x = (i / 4) % 300; logo.data[i] = 0; logo.data[i + 1] = 40; logo.data[i + 2] = 120; logo.data[i + 3] = x < 150 ? 255 : 0; }
      await page.locator('.admin-nav-item', { hasText: 'Portada' }).first().click();
      await page.locator('label', { hasText: 'Subir otro logo' }).first().locator('input[type="file"]').setInputFiles({ name: 'logo-prueba.png', mimeType: 'image/png', buffer: PNG.sync.write(logo) });
      await page.waitForFunction(() => /Logo propio: assets\//.test(document.body.innerText), null, { timeout: 15000 }).catch(() => {});
      espera = enviado();
      await page.locator('[data-accion="guardar-servidor"]').click(); // barra completa o pastilla discreta (Promociones)
      guardado = await espera;
      const ruta = guardado.home && guardado.home.cintaAmarilla && guardado.home.cintaAmarilla.logoAmarilla;
      ok(/^assets\/foto-\d+-logo-prueba\.png$/.test(ruta || ''), 'Logo de la cinta: el panel sube un logo propio y lo guarda en data.js', ruta);
      const archivo = ruta && path.join(T, 'site', ruta);
      const subido = archivo && fs.existsSync(archivo) ? PNG.sync.read(fs.readFileSync(archivo)) : null;
      ok(subido && subido.data[(10 * 300 + 250) * 4 + 3] === 0 && subido.data[(10 * 300 + 50) * 4 + 3] === 255, 'Logo de la cinta: el PNG conserva la transparencia');
      const pubLogo = await browser.newPage();
      await pubLogo.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
      const src = await pubLogo.locator('.cfp-cinta-logo img').first().getAttribute('src').catch(() => null);
      ok(src === ruta, 'Logo de la cinta: el sitio público muestra el logo nuevo', src);
      await pubLogo.close();
    }
    // Caso 5: Catálogo oficial 2027 · alta de cursos (20/10/2026)
    {
      await page.locator('.admin-nav-item', { hasText: 'Catálogo 2027' }).first().click();
      await page.waitForFunction(() => /338 trayectos/.test(document.body.innerText), null, { timeout: 15000 }).catch(() => {});
      ok(/338 trayectos/.test(await page.locator('body').innerText()), 'Catálogo 2027: carga los 338 trayectos precargados');
      const buscar = page.locator('input[placeholder^="Buscar por código"]');
      // Vincular un trayecto a un curso que ya existe (coincidencia por nombre)
      await buscar.fill('MT30');
      const tarjetaMT30 = page.locator('.admin-course-card', { hasText: 'MT30' }).first();
      // Desde los cursos 2027, «Soldador Básico» ya viene vinculado: se desvincula y se vuelve a vincular por la sugerencia de nombre
      const desvincular = tarjetaMT30.getByRole('button', { name: 'Desvincular' });
      if (await desvincular.count()) await desvincular.first().click();
      await tarjetaMT30.locator('span', { hasText: /Soldador/ }).getByRole('button', { name: 'Vincular', exact: true }).click();
      ok(await page.locator('.admin-course-card', { hasText: 'MT30' }).first().getByText(/En el sitio: Soldador/).count() === 1, 'Catálogo 2027: vincula MT30 al curso «Soldador Básico» del sitio');
      // Dar de alta un trayecto nuevo con los datos del catálogo
      await buscar.fill('AA01');
      const tarjetaAA01 = page.locator('.admin-course-card', { hasText: 'Operario Apícola' }).first();
      await tarjetaAA01.locator('button', { hasText: 'Ver los' }).click();
      ok(await tarjetaAA01.locator('table tbody tr').count() === 4, 'Catálogo 2027: muestra los módulos del trayecto (AA01: 4)');
      await tarjetaAA01.getByRole('button', { name: /Dar de alta en el sitio/ }).click();
      const nombreModal = await page.locator('.modal-card input.form-input').first().inputValue();
      const certModal = await page.locator('.form-group:has(> label:text-is("Certificación (se muestra en la página individual del curso)")) textarea').inputValue();
      ok(nombreModal === 'Operario Apícola' && /Resolución Nro\. 3096\/15/.test(certModal), 'Catálogo 2027: «Dar de alta» abre el editor con nombre y certificación del catálogo', `${nombreModal} · ${certModal}`);
      await page.getByRole('button', { name: /Guardar y Sincronizar Curso/ }).click();
      espera = enviado();
      await page.locator('[data-accion="guardar-servidor"]').click(); // barra completa o pastilla discreta (Promociones)
      guardado = await espera;
      const nuevo = guardado.courses.find(c => c.curso === 'Operario Apícola');
      const soldador = guardado.courses.find(c => c.slug === 'soldador-basico');
      ok(nuevo && (nuevo.trayectosCatalogo || []).includes('AA01') && /3096\/15/.test(nuevo.certificacion || '') && nuevo.horasTotales === '120 horas reloj', 'Catálogo 2027: el curso nuevo se guarda con código, certificación y horas del catálogo', nuevo && JSON.stringify({ t: nuevo.trayectosCatalogo, h: nuevo.horasTotales }));
      ok(soldador && (soldador.trayectosCatalogo || []).includes('MT30'), 'Catálogo 2027: el vínculo de «Soldador Básico» con MT30 queda guardado');
      const pubCurso = await browser.newPage();
      await pubCurso.goto(`${BASE}/index.html#/curso/${nuevo ? nuevo.slug : 'operario-apicola'}`, { waitUntil: 'networkidle' });
      const textoCurso = await pubCurso.locator('body').innerText();
      ok(/Certificación que se obtiene/.test(textoCurso) && /Operario Apícola según Resolución/.test(textoCurso), 'Catálogo 2027: la página del curso muestra la certificación');
      await pubCurso.close();
    }
    // Caso 6: Cursos 2027 — turnos, capacidades y slugs anteriores (21/10/2026)
    {
      await page.locator('.admin-nav-item', { hasText: /^\s*Cursos \(/ }).first().click();
      const tarjetaHerreria = page.locator('.admin-course-card', { has: page.locator('.admin-course-title', { hasText: /^Herrería$/ }) }).first();
      ok(/Turnos:\s*Tarde, Noche/.test(await tarjetaHerreria.innerText()), 'Cursos 2027: la lista del panel muestra los turnos del curso');
      await tarjetaHerreria.locator('.btn-course-edit').click();
      const capacidades = await page.locator('.form-group:has(> label:text-is("Capacidades profesionales (Página Individual)")) textarea').inputValue();
      const turnosTildados = await page.locator('.modal-card label:has(input[type="checkbox"]:checked)').allInnerTexts();
      ok(/Herrero\(a\) es un profesional/.test(capacidades) && /Sus capacidades clave incluyen/.test(capacidades) && ['Tarde', 'Noche'].every(t => turnosTildados.map(x => x.trim()).includes(t)), 'Cursos 2027: el editor trae las capacidades y los turnos tildados', turnosTildados.join(','));
      await page.locator('.modal-card').getByRole('button', { name: 'Cancelar' }).click();
      const pubT = await browser.newPage();
      await pubT.goto(`${BASE}/index.html#/cursos`, { waitUntil: 'networkidle' });
      await pubT.locator('select').filter({ has: pubT.locator('option[value="Noche"]') }).selectOption('Mañana');
      const titulos = (await pubT.locator('h3').allInnerTexts()).map(t => t.trim());
      ok(titulos.includes('Mantenimiento de Edificios') && !titulos.some(t => t.includes('Soldador')), 'Cursos 2027: el filtro «Turno: Mañana» muestra los de mañana y oculta los de noche');
      await pubT.goto(`${BASE}/index.html#/curso/gasista-domiciliario-2-categoria-apto-matricula-incluye-diseno-proyectual-asistido-por-computadora-cad`, { waitUntil: 'networkidle' });
      await pubT.waitForFunction(() => location.hash === '#/curso/gasista-domiciliario', null, { timeout: 5000 }).catch(() => {});
      const textoGasista = await pubT.locator('body').innerText();
      ok(await pubT.evaluate(() => location.hash) === '#/curso/gasista-domiciliario' && /Capacidades profesionales/.test(textoGasista) && /Gasista Domiciliario\(a\)/.test(textoGasista) && /Gasista de Unidades Unifuncionales/.test(textoGasista), 'Cursos 2027: un enlace con el slug anterior abre la página nueva, con capacidades');
      await pubT.close();
    }
    // Caso 7: pastilla de guardado en todo el panel, "Revertir" y registro de cambios en Sistema y Seguridad (20/10/2026)
    {
      await page.locator('.admin-nav-item', { hasText: /^\s*Cursos \(/ }).first().click();
      const pastilla = page.locator('.save-bar-discreta');
      ok(await pastilla.count() === 1 && await page.locator('.save-bar:not(.save-bar-discreta)').count() === 0 && await pastilla.getByText('Descargar data.js').count() === 0, 'Panel: la pastilla de guardado está en Cursos y sin "Descargar data.js"');
      const tarjeta = page.locator('.admin-course-card', { has: page.locator('.admin-course-title', { hasText: /^Herrería$/ }) }).first();
      const campoCap = () => page.locator('.form-group:has(> label:text-is("Capacidades profesionales (Página Individual)")) textarea');
      await tarjeta.locator('.btn-course-edit').click();
      const capOriginal = await campoCap().inputValue();
      await campoCap().fill('Texto de prueba que se va a revertir');
      await page.getByRole('button', { name: /Guardar y Sincronizar Curso/ }).click();
      ok(/Sin guardar/.test(await pastilla.innerText()) && await pastilla.locator('[data-accion="revertir"]').count() === 1, 'Panel: con un cambio sin guardar aparecen "Sin guardar" y "Revertir"');
      page.once('dialog', d => d.accept());
      await pastilla.locator('[data-accion="revertir"]').click();
      await tarjeta.locator('.btn-course-edit').click();
      const capRevertida = await campoCap().inputValue();
      await page.locator('.modal-card').getByRole('button', { name: 'Cancelar' }).click();
      ok(capRevertida === capOriginal && /Guardado/.test(await pastilla.innerText()) && await pastilla.locator('[data-accion="revertir"]').count() === 0, 'Panel: "Revertir" devuelve los datos al último guardado');
      await page.locator('.admin-nav-item', { hasText: 'Sistema y Seguridad' }).first().click();
      await page.waitForFunction(() => /Registro de cambios/.test(document.body.innerText) && document.querySelectorAll('table td').length > 0, null, { timeout: 10000 }).catch(() => {});
      const filas = await page.locator('table tbody tr', { hasText: 'Prueba e2e' }).count();
      ok(filas >= 1, 'Sistema y Seguridad: el registro de cambios muestra quién guardó y cuándo', `${filas} guardados de "Prueba e2e"`);
      ok(await page.getByRole('button', { name: /Descargar data\.js/ }).count() === 1, 'Sistema y Seguridad: ofrece "Descargar data.js"');
      const sinSesion = await fetch(`${BASE}/api/registro.php`);
      ok(sinSesion.status === 401, 'El registro de cambios no se puede leer sin sesión', `HTTP ${sinSesion.status}`);
    }
    // Auditoría de operador: el nombre llega al encabezado de data.js y al registro de cambios
    ok(/Operador \/ Usuario: Prueba e2e/.test(fs.readFileSync(dataFile, 'utf8')), 'Auditoría: el nombre del operador queda en el encabezado de data.js');
    const registro = path.join(T, 'site', 'api', 'backups', 'registro-cambios.log');
    ok(fs.existsSync(registro) && /Operador: Prueba e2e/.test(fs.readFileSync(registro, 'utf8')), 'Auditoría: el guardado queda en api/backups/registro-cambios.log');
    // Un nombre de operador con "*/" no puede cerrar el comentario de data.js e inyectar código en el sitio público
    {
      const r = await fetch(`${BASE}/api/guardar.php`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ data: leerData(dataFile), usuario: 'x */ window.__inyectado = 1; /*' }) });
      const sb = { window: {} };
      let ejecuta = true;
      try { vm.runInNewContext(fs.readFileSync(dataFile, 'utf8'), sb); ejecuta = sb.window.__inyectado === 1; } catch (_) { ejecuta = true; }
      ok(r.status === 200 && !ejecuta, 'Auditoría: un nombre de operador con "*/" no inyecta código en data.js', `HTTP ${r.status}`);
    }
    ok(errores.length === 0, 'Sin errores de JavaScript en el panel', errores.join(' | '));

    // ── Sitio público: la copia guardada carga sin errores
    const pub = await browser.newPage();
    const erroresPub = [];
    pub.on('pageerror', e => erroresPub.push(e.message));
    await pub.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    if (erroresPub.length) console.log('   errores del sitio público:', erroresPub);
    ok(erroresPub.length === 0 && (await pub.evaluate(() => typeof (window.CFPReglas && window.CFPReglas.popupVigente))) === 'function' && (await pub.evaluate(() => Array.isArray(window.CFP_DATA && window.CFP_DATA.courses))), 'Sitio público carga reglas y datos sin errores', erroresPub.join(' | '));
    await browser.close();
  } finally {
    // Si una prueba falla con un error, el navegador también se cierra (si no, el proceso queda colgado)
    if (navegadorAbierto) await navegadorAbierto.close().catch(() => {});
    server.kill(); serverChico.kill();
  }
  await new Promise(r => setTimeout(r, 400));
  fs.rmSync(T, { recursive: true, force: true });
  console.log(`\n${fallas ? fallas + ' falla(s)' : 'Prueba de punta a punta: OK'} — copia de prueba borrada.`);
  process.exitCode = fallas ? 1 : 0;
}

let navegadorAbierto = null;
main().catch(e => { console.error(e.stack || e.message); process.exitCode = 1; });
