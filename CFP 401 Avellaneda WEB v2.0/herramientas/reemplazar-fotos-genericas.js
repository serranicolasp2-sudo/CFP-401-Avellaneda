const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '..', 'site', 'assets', 'promociones');

const replacements = [
  {
    file: 'soldador-basico-1.jpg',
    url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80',
    nombre: 'Soldador Básico - Soldadura Eléctrica por Arco'
  },
  {
    file: 'soldador-mig-tig-2.jpg',
    url: 'https://images.unsplash.com/photo-1548945665-56d2712b4986?auto=format&fit=crop&w=1200&q=80',
    nombre: 'Soldador MIG-TIG - Antorcha y Gas Inerte'
  },
  {
    file: 'colocador-de-paneles-y-placas-de-yeso-1.jpg',
    url: 'https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/Articles/types-of-drywall-section-3.jpg',
    nombre: 'Colocador de Yeso - Estructura y Placas Durlock'
  },
  {
    file: 'gasista-domiciliario-2-categoria-apto-matricula-incluye-diseno-proyectual-asistido-por-computadora-cad-1.jpg',
    url: 'https://hyperheatingcooling.ca/wp-content/uploads/2024/02/technician-servicing-or-repair-of-a-gas-boiler-setting-up-and-servicing-gas-boiler-for-heating.jpg',
    nombre: 'Gasista Matriculado - Calderas y Pruebas de Presión'
  },
  {
    file: 'reparacion-de-refrigeradores-domesticos-instalacion-de-aire-acondicionado-individual-2.jpg',
    url: 'https://dowdheatandair.com/wp-content/uploads/2023/11/mastering-hvac-manifold-gauges-a-comprehensive-guide_35.webp',
    nombre: 'Refrigeración y AA - Manifold y Carga de Refrigerante'
  }
];

async function replace() {
  for (const item of replacements) {
    const dest = path.join(TARGET_DIR, item.file);
    try {
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`✓ Reemplazado ${item.file} (${(buf.length/1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`✗ Error reemplazando ${item.file}: ${e.message}`);
    }
  }
}

replace();
