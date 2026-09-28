const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const report = path.join(root, 'REPORTE-MAESTRO-CONJUNTO.md');
const archive = path.join(root, 'BITACORA-DE-INICIO.md');
const zone = 'America/Argentina/Buenos_Aires';
const today = new Intl.DateTimeFormat('en-CA', { timeZone: zone }).format(new Date());
const cutoffDate = new Date(`${today}T12:00:00Z`);
cutoffDate.setUTCDate(cutoffDate.getUTCDate() - 3);
const cutoff = cutoffDate.toISOString().slice(0, 10);

if (!fs.existsSync(report)) throw new Error(`No se encuentra el reporte maestro: ${report}`);
const content = fs.readFileSync(report, 'utf8');
const start = content.indexOf('## 6. BITÁCORA CRONOLÓGICA DE MODIFICACIONES');
if (start < 0) throw new Error('No se encontró la sección 6 de bitácora.');
const nextSection = content.indexOf('\n## ', start + 4);
const end = nextSection < 0 ? content.length : nextSection;
const section = content.slice(start, end);
const eol = content.includes('\r\n') ? '\r\n' : '\n'; // se respeta el fin de línea del reporte (CRLF)
const lines = section.split(/\r?\n/);
const archived = [];
const retained = [];
for (const line of lines) {
  const match = line.match(/^\|\s*\*\*(\d{4}-\d{2}-\d{2})\s+\d{2}:\d{2}\*\*\s*\|/);
  if (match && match[1] < cutoff) archived.push(line);
  else retained.push(line);
}
if (!archived.length) {
  console.log(`Bitácora vigente: no hay filas anteriores al ${cutoff}; no se hicieron cambios.`);
  process.exit(0);
}

const archiveHeader = `# BITÁCORA DE INICIO — CFP N° 401 AVELLANEDA\n\n` +
  `Registro cronológico archivado desde REPORTE-MAESTRO-CONJUNTO.md. Zona horaria de origen: ${zone}.\n\n`;
if (!fs.existsSync(archive)) fs.writeFileSync(archive, archiveHeader, 'utf8');
fs.appendFileSync(archive, `\n## Filas archivadas el ${today} (anteriores a ${cutoff})\n\n| Fecha y Hora | IA / Agente | Archivos Modificados | Descripción de los Cambios Realizados |\n|---|---|---|---|\n${archived.join('\n')}\n`, 'utf8');
const retainedSection = retained.join(eol).replace(
  '*(Todas las IAs deben agregar una nueva fila en esta sección ante cada intervención).*',
  `*(Todas las IAs deben agregar una fila con hora local real de ${zone}. El detalle anterior a cuatro días se archiva en [BITACORA-DE-INICIO.md](BITACORA-DE-INICIO.md).)*`
);
fs.writeFileSync(report, content.slice(0, start) + retainedSection + content.slice(end), 'utf8');
console.log(`${archived.length} fila(s) archivadas en BITACORA-DE-INICIO.md; se conservaron las de ${cutoff} en adelante.`);
console.log('Recordatorio (§9.7): dejar en el reporte activo el resumen de decisiones vigentes, riesgos abiertos y enlaces a los hitos archivados.');
