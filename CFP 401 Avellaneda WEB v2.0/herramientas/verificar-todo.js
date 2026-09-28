const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== VERIFICANDO PROYECTO COMPLETO TRAS MEJORAS MOBILE ===\n');

// 1. Validar JS
const jsFiles = ['site/data.js', 'site/app.js', 'site/admin.js', 'site/plantillas-promo.js'];
jsFiles.forEach(f => {
  const full = path.join(__dirname, '..', f);
  execSync(`node -c "${full}"`);
  console.log(`✓ Sintaxis JS correcta: ${f}`);
});

// 2. Validar Babel en fuentes JSX (app.jsx, admin.jsx, plantillas-promo.jsx)
const babel = require('../fuente-jsx/node_modules/@babel/core');
const jsxFiles = ['app.jsx', 'admin.jsx', 'plantillas-promo.jsx'];
jsxFiles.forEach(f => {
  const code = fs.readFileSync(path.join(__dirname, '..', 'fuente-jsx', f), 'utf8');
  const result = babel.transformSync(code, {
    presets: [path.join(__dirname, '..', 'fuente-jsx', 'node_modules', '@babel', 'preset-react')]
  });
  console.log(`✓ JSX de fuente-jsx/${f} compila con Babel sin errores (${result.code.length} bytes generados)`);
});

// 3. Validar PHP (incluye site/curso.php y todos los endpoints de site/api/)
const phpPath = 'C:\\Users\\Nicolás\\AppData\\Local\\Microsoft\\WinGet\\Packages\\PHP.PHP.8.2_Microsoft.Winget.Source_8wekyb3d8bbwe\\php.exe';
const phpFiles = [
  path.join(__dirname, '..', 'site', 'curso.php'),
  ...fs.readdirSync(path.join(__dirname, '..', 'site', 'api')).filter(f => f.endsWith('.php')).map(f => path.join(__dirname, '..', 'site', 'api', f))
];
phpFiles.forEach(fullPath => {
  const rel = path.relative(path.join(__dirname, '..', 'site'), fullPath);
  const out = execSync(`"${phpPath}" -l "${fullPath}"`, { encoding: 'utf8' });
  if (out.includes('No syntax errors detected')) {
    console.log(`✓ PHP sintaxis OK: ${rel}`);
  } else {
    console.error(`✗ Error en PHP: ${rel}: ${out}`);
  }
});

console.log('\n=== TODAS LAS VALIDACIONES PASARON EXITOSAMENTE ===');
