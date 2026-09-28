const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const CACHE = path.join(ROOT, '.local');
const BLOCKED = /(^|\/)(?:data\.js|data\.backup\.js|\.clave[^/]*|\.intentos\.json|sesiones|backups|guardadas|\.env[^/]*|node_modules|\.git)(?:\/|$)|(?:\.pem|\.key|\.p12|\.pfx|\.bak|\.backup|\.tmp)$/i;
const ALLOWED = /^(?:site\/(?:admin\.html|index\.html|admin\.js|app\.js|plantillas-promo\.js|_ds_bundle\.js|cfp-reglas\.js|styles\.css|curso\.php|robots\.txt|\.htaccess|tokens\/[A-Za-z0-9._-]+\.css|api\/[A-Za-z0-9._-]+\.php|api\/\.htaccess|api\/\.user\.ini|assets\/promociones\/guardadas\/\.htaccess|assets\/[A-Za-z0-9._/-]+\.(?:png|jpe?g|webp|svg|woff2?|ttf|ico)))$/i;

function sha(buffer) { return crypto.createHash('sha256').update(buffer).digest('hex'); }
function fail(message) { console.error(`ERROR: ${message}`); process.exitCode = 1; }

function parseDataJs(source) {
  const sandbox = { window: {} };
  new vm.Script(source, { filename: 'data.js' }).runInNewContext(sandbox, { timeout: 3000 });
  const data = sandbox.window.CFP_DATA;
  if (!data || typeof data !== 'object' || !Array.isArray(data.courses) || data.courses.length === 0) {
    throw new Error('data.js no define window.CFP_DATA con un catálogo courses válido.');
  }
  const slugs = new Set();
  for (const [i, course] of data.courses.entries()) {
    if (!course || typeof course.curso !== 'string' || !course.curso.trim()) throw new Error(`Curso ${i + 1} sin nombre válido.`);
    if (course.slug) {
      if (!/^[a-z0-9-]+$/.test(course.slug) || slugs.has(course.slug)) throw new Error(`Slug inválido o repetido: ${course.slug}`);
      slugs.add(course.slug);
    }
  }
  if (data.promociones !== undefined && !Array.isArray(data.promociones)) throw new Error('promociones debe ser un arreglo.');
  return data;
}

async function pullData(args) {
  const url = process.env.CFP_DATA_URL || 'https://campuscfp401avellaneda.com.ar/cfp/data.js';
  if (!/^https:\/\//i.test(url)) throw new Error('CFP_DATA_URL debe ser una URL HTTPS (sin credenciales).');
  fs.mkdirSync(CACHE, { recursive: true });
  const response = await fetch(url, { cache: 'no-store', redirect: 'error' });
  if (!response.ok) throw new Error(`El servidor respondió HTTP ${response.status}.`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 5 * 1024 * 1024) throw new Error('data.js supera el límite local de 5 MB.');
  const text = bytes.toString('utf8');
  parseDataJs(text);
  const remoteHash = sha(bytes);
  const localPath = path.join(SITE, 'data.js');
  const localHash = fs.existsSync(localPath) ? sha(fs.readFileSync(localPath)) : '(no existe)';
  const staged = path.join(CACHE, 'data.servidor.js');
  fs.writeFileSync(staged, bytes, { flag: 'w' });
  console.log(`Servidor SHA-256: ${remoteHash}`);
  console.log(`Local    SHA-256: ${localHash}`);
  console.log(`Copia remota validada: ${path.relative(ROOT, staged)}`);
  if (remoteHash === localHash) {
    console.log('El catálogo local coincide con el servidor.');
    return;
  }
  const localData = fs.existsSync(localPath) ? parseDataJs(fs.readFileSync(localPath, 'utf8')) : {};
  const remoteData = parseDataJs(text);
  const summarize = (before, after, key, label) => {
    const a = new Map((before || []).map(item => [item[key], item]));
    const b = new Map((after || []).map(item => [item[key], item]));
    return {
      tipo: label,
      agregados: [...b.keys()].filter(k => !a.has(k)),
      quitados: [...a.keys()].filter(k => !b.has(k)),
      modificados: [...b.keys()].filter(k => a.has(k) && JSON.stringify(a.get(k)) !== JSON.stringify(b.get(k)))
    };
  };
  const diff = {
    generado: new Date().toISOString(), sha256Local: localHash, sha256Servidor: remoteHash,
    cursos: summarize(localData.courses, remoteData.courses, 'slug', 'courses'),
    promociones: summarize(localData.promociones, remoteData.promociones, 'id', 'promociones'),
    secciones: [...new Set([...Object.keys(localData), ...Object.keys(remoteData)])]
      .filter(k => !['courses', 'promociones'].includes(k) && JSON.stringify(localData[k]) !== JSON.stringify(remoteData[k]))
  };
  const diffPath = path.join(CACHE, 'data.servidor.diff.json');
  fs.writeFileSync(diffPath, JSON.stringify(diff, null, 2), 'utf8');
  for (const part of [diff.cursos, diff.promociones]) {
    console.log(`${part.tipo}: ${part.agregados.length} agregada(s), ${part.modificados.length} modificada(s), ${part.quitados.length} quitada(s).`);
  }
  console.log(`Secciones con cambios: ${diff.secciones.join(', ') || 'ninguna'}`);
  console.log(`Detalle estructurado: ${path.relative(ROOT, diffPath)}`);
  const backup = path.join(CACHE, `data.local-${new Date().toISOString().replace(/[:.]/g, '-')}.js`);
  if (!args.includes('--apply')) {
    console.log('Hay diferencias. Inspeccioná la copia validada y el diff antes de continuar.');
    console.log(`Para aceptar exactamente esta descarga: npm run data:pull -- --apply --confirm-sha256 ${remoteHash}`);
    return;
  }
  const confirmIndex = args.indexOf('--confirm-sha256');
  const confirmedHash = confirmIndex >= 0 ? args[confirmIndex + 1] : '';
  if (confirmedHash !== remoteHash) throw new Error('No se sincronizó data.js: falta --confirm-sha256 con la huella recién revisada, o la fuente cambió desde la revisión.');
  if (fs.existsSync(localPath)) fs.copyFileSync(localPath, backup, fs.constants.COPYFILE_EXCL);
  fs.copyFileSync(staged, localPath);
  console.log(`Copia local actualizada; respaldo previo: ${path.relative(ROOT, backup)}`);
}

// Candidatos a publicar: todos los archivos de site/ que Git conoce o no ignora (no solo los que
// cambiaron desde el último commit), filtrados por la política. Qué se sube lo decide después la
// comparación SHA-256 contra el servidor. `git ls-files` devuelve rutas relativas a esta carpeta.
function publishableSiteFiles() {
  const output = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', 'site'], { cwd: ROOT });
  const files = new Set();
  const outside = [];
  let blocked = 0;
  for (let name of output.toString('utf8').split('\0').filter(Boolean)) {
    name = name.replace(/\\/g, '/');
    if (!name.startsWith('site/')) continue;
    if (BLOCKED.test(name)) { blocked++; continue; }
    if (!ALLOWED.test(name)) { outside.push(name); continue; }
    if (!fs.existsSync(path.join(ROOT, name))) continue;
    files.add(name);
  }
  console.log(`Política: ${blocked} archivo(s) excluidos (data.js, claves, sesiones, respaldos, piezas guardadas).`);
  for (const name of outside) console.log(`NO SE PUBLICA (fuera de la lista permitida): ${name}`);
  return [...files].sort();
}

function shellQuote(value) { return `'${value.replace(/'/g, `'\\''`)}'`; }
function run(command, args, options = {}) {
  return execFileSync(command, args, { cwd: ROOT, encoding: 'utf8', stdio: options.capture === false ? 'inherit' : ['ignore', 'pipe', 'pipe'], ...options });
}

async function deploy(args) {
  const host = process.env.CFP_DEPLOY_HOST;
  const user = process.env.CFP_DEPLOY_USER;
  const remoteRoot = process.env.CFP_DEPLOY_ROOT;
  const port = process.env.CFP_DEPLOY_PORT || '22';
  if (!host || !user || !remoteRoot) throw new Error('Falta configurar CFP_DEPLOY_HOST, CFP_DEPLOY_USER y CFP_DEPLOY_ROOT. La publicación no modificó el servidor.');
  if (!/^[A-Za-z0-9.-]+$/.test(host) || !/^[A-Za-z0-9._-]+$/.test(user) || !/^\/[A-Za-z0-9_./-]+$/.test(remoteRoot) || !/^\d{1,5}$/.test(port)) {
    throw new Error('Configuración remota inválida; host/usuario/ruta/puerto solo admiten caracteres seguros.');
  }
  const files = publishableSiteFiles();
  if (!files.length) { console.log('No hay archivos públicos para publicar.'); return; }
  const target = `${user}@${host}`;
  const sshBase = ['-p', port, target];
  // Una sola conexión calcula el SHA-256 remoto de todos los candidatos (la lista viaja por stdin,
  // separada por NUL; los que no existen en el servidor no devuelven línea y quedan como ausentes).
  const relativos = files.map(rel => rel.slice(5));
  let listado = '';
  try {
    listado = run('ssh', [...sshBase, `cd ${shellQuote(remoteRoot)} || exit 3; xargs -0 sha256sum -- 2>/dev/null; true`], { input: relativos.join('\0'), stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (e) { throw new Error(`No se pudo verificar el servidor: ${e.stderr || e.message}`); }
  const remotos = new Map();
  for (const linea of listado.split('\n')) {
    const m = linea.match(/^([a-f0-9]{64}) [ *](.+)$/);
    if (m) remotos.set(m[2].replace(/^\.\//, ''), m[1]);
  }
  const records = files.map(rel => {
    const local = path.join(ROOT, rel);
    return { rel, local, remote: `${remoteRoot}/${rel.slice(5)}`, hash: sha(fs.readFileSync(local)), remoteHash: remotos.get(rel.slice(5)) || 'MISSING' };
  });
  const changes = records.filter(x => x.hash !== x.remoteHash);
  for (const r of changes) console.log(`SUBIR ${r.rel} local=${r.hash.slice(0, 12)} remoto=${r.remoteHash === 'MISSING' ? 'ausente' : r.remoteHash.slice(0, 12)}`);
  console.log(`Verificación previa SHA-256 completa: ${records.length} archivo(s), ${changes.length} cambio(s). data.js excluido por política.`);
  if (!changes.length || args.includes('--dry-run')) return;

  const expectedOwner = process.env.CFP_DEPLOY_EXPECT_OWNER || '';
  const expectedGroup = process.env.CFP_DEPLOY_EXPECT_GROUP || '';
  for (const r of changes) {
    const tmp = `${r.remote}.deploy-${process.pid}.tmp`;
    const remoteDir = path.posix.dirname(r.remote);
    run('ssh', [...sshBase, `test -d ${shellQuote(remoteDir)} && test -w ${shellQuote(remoteDir)}`]);
    run('scp', ['-P', port, r.local, `${target}:${tmp}`], { capture: false });
    const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const rollback = `${r.remote}.rollback-${stamp}`;
    const install = `chmod 0644 ${shellQuote(tmp)} && test "$(sha256sum ${shellQuote(tmp)} | cut -d' ' -f1)" = ${shellQuote(r.hash)} && if [ -f ${shellQuote(r.remote)} ]; then cp -p ${shellQuote(r.remote)} ${shellQuote(rollback)} && chmod 0600 ${shellQuote(rollback)}; fi && mv -f ${shellQuote(tmp)} ${shellQuote(r.remote)} && test "$(sha256sum ${shellQuote(r.remote)} | cut -d' ' -f1)" = ${shellQuote(r.hash)} && test "$(stat -c %a ${shellQuote(r.remote)})" = 644`;
    run('ssh', [...sshBase, install]);
    const ownership = `stat -c '%U:%G:%a' ${shellQuote(r.remote)}`;
    const actual = run('ssh', [...sshBase, ownership]).trim();
    if (!actual.endsWith(':644')) throw new Error(`Permisos remotos inesperados tras subir ${r.rel}: ${actual}`);
    if (expectedOwner && actual.split(':')[0] !== expectedOwner) throw new Error(`Propietario remoto incorrecto en ${r.rel}: ${actual}`);
    if (expectedGroup && actual.split(':')[1] !== expectedGroup) throw new Error(`Grupo remoto incorrecto en ${r.rel}: ${actual}`);
    console.log(`OK ${r.rel}: SHA-256 verificado; propietario/permisos ${actual}; restauración previa ${rollback}`);
  }
  console.log('Publicación terminada. No se subió data.js, secretos, sesiones ni respaldos.');
}

async function main() {
  const [action, ...args] = process.argv.slice(2);
  if (action === 'pull') await pullData(args);
  else if (action === 'deploy') await deploy(args);
  else throw new Error('Uso: node herramientas/operar-servidor.js <pull|deploy> [--apply|--dry-run]');
}

main().catch(err => { fail(err.message); });
