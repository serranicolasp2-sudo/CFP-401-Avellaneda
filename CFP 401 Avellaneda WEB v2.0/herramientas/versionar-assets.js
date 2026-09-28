const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'site');
const bundles = new Set(['admin.js', 'app.js', 'plantillas-promo.js', '_ds_bundle.js', 'cfp-reglas.js']);
const htmlFiles = ['admin.html', 'index.html'];

function hash(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0, 12);
}

for (const file of htmlFiles) {
  const full = path.join(publicDir, file);
  let html = fs.readFileSync(full, 'utf8');
  html = html.replace(/((?:src|href)=["'])([^"']+)(["'])/gi, (whole, before, url, after) => {
    const match = url.match(/^([^?#]+)(?:\?[^#]*)?(#.*)?$/);
    if (!match || !bundles.has(path.posix.basename(match[1]))) return whole;
    const target = path.join(publicDir, path.basename(match[1]));
    if (!fs.existsSync(target)) throw new Error(`No existe el recurso referenciado en ${file}: ${url}`);
    return `${before}${match[1]}?v=${hash(target)}${match[2] || ''}${after}`;
  });
  fs.writeFileSync(full, html, 'utf8');
}

console.log('Versiones de caché por SHA-256 actualizadas en admin.html e index.html.');
