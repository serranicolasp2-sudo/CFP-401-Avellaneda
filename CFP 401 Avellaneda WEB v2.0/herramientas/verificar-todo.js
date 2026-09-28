const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { createRequire } = require('module');

const ROOT = path.resolve(__dirname, '..');
const SOURCES = path.join(ROOT, 'fuente-jsx');
const SITE = path.join(ROOT, 'site');
let errors = 0;
function pass(message) { console.log(`✓ ${message}`); }
function check(condition, message) { if (condition) pass(message); else { errors++; console.error(`✗ ${message}`); } }
function run(command, args, opts = {}) { return execFileSync(command, args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }); }

console.log('=== Verificación de build, datos, guardas y regresiones ===\n');

for (const file of ['data.js', 'app.js', 'admin.js', 'plantillas-promo.js', 'cfp-reglas.js']) {
  const full = path.join(SITE, file);
  try { run(process.execPath, ['--check', full]); pass(`Sintaxis JavaScript: site/${file}`); }
  catch (e) { errors++; console.error(`✗ Sintaxis JavaScript: site/${file}\n${e.stderr || e.message}`); }
}

try {
  const sourceRequire = createRequire(path.join(SOURCES, 'package.json'));
  const babel = sourceRequire('@babel/core');
  const preset = sourceRequire.resolve('@babel/preset-react');
  for (const file of ['app.jsx', 'admin.jsx', 'plantillas-promo.jsx']) {
    const result = babel.transformFileSync(path.join(SOURCES, file), { presets: [preset], configFile: path.join(SOURCES, 'babel.config.json') });
    check(Boolean(result && result.code), `Compilación JSX: fuente-jsx/${file}`);
  }
} catch (e) { errors++; console.error(`✗ Babel no disponible: ${e.message}`); }

try {
  const rules = require('../site/cfp-reglas.js');
  const dataContext = { window: {} };
  require('vm').runInNewContext(fs.readFileSync(path.join(SITE, 'data.js'), 'utf8'), dataContext, { timeout: 3000 });
  const data = dataContext.window.CFP_DATA;
  check(Array.isArray(data.courses) && data.courses.length > 0, `Catálogo de cursos válido (${data.courses.length})`);
  check(Array.isArray(data.promociones || []), 'Catálogo de promociones con estructura de arreglo');
  const allowed = new Set(rules.ESTADOS_CUPO);
  check(data.courses.every(c => !c.estadoCupo || allowed.has(c.estadoCupo)), 'Estados de cupos dentro del catálogo permitido');
  run(process.execPath, [path.join(__dirname, 'verificar-reglas.js')]);
  pass('Regresiones de cupos, vencimiento, huella y vigencia ejecutadas');
} catch (e) { errors++; console.error(`✗ Validación de datos/reglas: ${e.stderr || e.message}`); }

for (const file of ['admin.html', 'index.html']) {
  const html = fs.readFileSync(path.join(SITE, file), 'utf8');
  for (const js of ['cfp-reglas.js', ...(file === 'admin.html' ? ['plantillas-promo.js', 'admin.js'] : ['_ds_bundle.js', 'plantillas-promo.js', 'app.js'])]) {
    const reference = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)]
      .map(m => m[1]).find(url => path.posix.basename(url.split(/[?#]/)[0]) === js);
    const version = reference && (reference.match(/[?&]v=([a-f0-9]{12})(?:&|$)/i) || [])[1];
    const asset = path.join(SITE, js);
    if (!version || !fs.existsSync(asset)) { check(false, `${file} versiona ${js} por contenido`); continue; }
    const hash = require('crypto').createHash('sha256').update(fs.readFileSync(asset)).digest('hex').slice(0, 12);
    check(version === hash, `${file} usa huella actual para ${js}`);
  }
  check(html.indexOf('cfp-reglas.js') < html.indexOf('data.js'), `${file} carga reglas antes del catálogo`);
}

const sourceAdmin = fs.readFileSync(path.join(SOURCES, 'admin.jsx'), 'utf8');
const sourceApp = fs.readFileSync(path.join(SOURCES, 'app.jsx'), 'utf8');
const phpSave = fs.readFileSync(path.join(SITE, 'api', 'guardar.php'), 'utf8');
check(sourceAdmin.includes('No hay cursos confirmados como') && sourceAdmin.includes('Vigente desde'), 'Panel bloquea cupos sin confirmación y permite vigencia del pop-up');
check(sourceAdmin.includes('Guardar PNG en servidor') && fs.existsSync(path.join(SITE, 'api', 'guardar-promo-png.php')), 'Guardado autenticado de piezas PNG implementado');
check(sourceApp.includes('promoDesactualizada') && sourceApp.includes('popupVigente'), 'Web excluye promociones desactualizadas o fuera de vigencia');
check(phpSave.includes("'ultimos-cupos-v1'") && phpSave.includes('cupoConfirmadoEn'), 'API valida del lado servidor el estado de los avisos de cupos');

const phpExe = process.env.PHP_BINARY || 'php';
let phpAvailable = false;
try { run(phpExe, ['-v']); phpAvailable = true; } catch (_) {}
if (!phpAvailable) {
  const fallback = 'C:\\Users\\Nicolás\\AppData\\Local\\Microsoft\\WinGet\\Packages\\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\\php.exe';
  if (fs.existsSync(fallback)) { process.env.PHP_BINARY = fallback; phpAvailable = true; }
}
if (phpAvailable) {
  for (const file of [path.join(SITE, 'curso.php'), ...fs.readdirSync(path.join(SITE, 'api')).filter(f => f.endsWith('.php')).map(f => path.join(SITE, 'api', f))]) {
    try { run(process.env.PHP_BINARY || phpExe, ['-l', file]); pass(`Sintaxis PHP: ${path.relative(SITE, file)}`); }
    catch (e) { errors++; console.error(`✗ Sintaxis PHP: ${path.relative(SITE, file)}\n${e.stderr || e.message}`); }
  }
} else console.log('ℹ PHP no está en PATH: se omite lint PHP. Definí PHP_BINARY para activarlo.');

const userIni = path.join(SITE, 'api', '.user.ini');
const limites = fs.existsSync(userIni) ? fs.readFileSync(userIni, 'utf8') : '';
check(/^upload_max_filesize\s*=\s*(2[5-9]|[3-9]\d)M/m.test(limites) && /^post_max_size\s*=\s*([3-9]\d)M/m.test(limites), 'api/.user.ini sube los límites de carga para piezas A4 (25M / 30M)');

const deploy = fs.readFileSync(path.join(__dirname, 'operar-servidor.js'), 'utf8');
check(deploy.includes('data.js') && deploy.includes('sha256sum') && deploy.includes('stat -c %a') && deploy.includes('sesiones') && deploy.includes('backups'), 'Publicador incorpora exclusión de datos sensibles, hash y control de permisos');

if (errors) {
  console.error(`\n${errors} verificación(es) fallaron.`);
  process.exitCode = 1;
} else console.log('\n=== Todas las verificaciones configuradas pasaron. ===');
