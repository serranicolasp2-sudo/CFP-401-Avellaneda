const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'site', 'data.js');
const metaPath = path.join(__dirname, 'fotos-promociones-metadata.json');

const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Extraer el objeto CFP_DATA actual ejecutando de forma segura
const vm = require('vm');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(dataContent, sandbox);
const cfpData = sandbox.window.CFP_DATA;

// Las fotos existentes iniciales (las 4 de soldadura y las de familias)
const existentes = cfpData.bibliotecaFotosPromo || [];

// Crear el set de archivos para no duplicar
const archivosExistentes = new Set(existentes.map(f => f.archivo));

const nuevasFotos = [];
for (const m of meta) {
  if (!archivosExistentes.has(m.archivo)) {
    nuevasFotos.push({
      id: m.id,
      familia: m.familia,
      archivo: m.archivo,
      nombre: m.nombre,
      encuadre: m.encuadre || '40% 45%'
    });
    archivosExistentes.add(m.archivo);
  }
}

console.log(`Existentes: ${existentes.length}, Nuevas a agregar: ${nuevasFotos.length}`);
const finalBiblioteca = [...existentes, ...nuevasFotos];
console.log(`Total final en bibliotecaFotosPromo: ${finalBiblioteca.length}`);

// Formatear bibliotecaFotosPromo como JSON indentado con formato legible
const formattedList = finalBiblioteca.map(f => 
  `    { "id": "${f.id}", "familia": "${f.familia}", "archivo": "${f.archivo}", "nombre": "${f.nombre.replace(/"/g, '\\"')}", "encuadre": "${f.encuadre}" }`
).join(',\n');

const regex = /"bibliotecaFotosPromo":\s*\[[\s\S]*?\]\s*\n\};/;
const replacement = `"bibliotecaFotosPromo": [\n${formattedList}\n  ]\n};`;

if (!regex.test(dataContent)) {
  console.error('ERROR: No se encontró la clave bibliotecaFotosPromo en data.js con la regex');
  process.exit(1);
}

const updatedContent = dataContent.replace(regex, replacement);
fs.writeFileSync(dataPath, updatedContent, 'utf8');
console.log('✓ data.js actualizado exitosamente.');
