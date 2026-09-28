const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'herramientas', 'descarga.log');
const metaFile = path.join(__dirname, 'fotos-promociones-metadata.json');
const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));

console.log('Total registros:', meta.length);
meta.forEach((m, idx) => {
  const fullPath = path.join(__dirname, '..', 'site', m.archivo);
  const exists = fs.existsSync(fullPath);
  const size = exists ? (fs.statSync(fullPath).size / 1024).toFixed(1) + ' KB' : 'FALTA';
  console.log((idx + 1) + '. [' + m.familia + '] ' + m.id + ' -> ' + size + ' (' + m.nombre + ')');
});
