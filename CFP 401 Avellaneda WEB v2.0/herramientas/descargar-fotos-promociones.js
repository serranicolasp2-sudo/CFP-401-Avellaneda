const fs = require('fs');
const path = require('path');

const TARGET_DIR = path.join(__dirname, '..', 'site', 'assets', 'promociones');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const COURSES = [
  {
    slug: 'auxiliar-contable',
    curso: 'Auxiliar Contable',
    familia: 'Administración',
    queries: ['accounting balance finance', 'accountant office desk', 'accounting spreadsheet'],
    nombres: ['Auxiliar Contable - Planillas y Balances', 'Auxiliar Contable - Gestión y Finanzas', 'Auxiliar Contable - Documentación Comercial']
  },
  {
    slug: 'sueldos-y-jornales',
    curso: 'Sueldos y Jornales',
    familia: 'Administración',
    queries: ['payroll human resources', 'salary calculation paperwork', 'human resources desk paperwork'],
    nombres: ['Sueldos y Jornales - Liquidación de Sueldos', 'Sueldos y Jornales - Recursos Humanos', 'Sueldos y Jornales - Gestión Laboral']
  },
  {
    slug: 'auxiliar-de-seguridad-e-higiene-laboral',
    curso: 'Auxiliar de Seguridad e Higiene Laboral',
    familia: 'Administración',
    queries: ['safety inspector construction helmet', 'occupational health safety vest', 'industrial safety inspection helmet'],
    nombres: ['Seguridad e Higiene - Inspección y Control', 'Seguridad e Higiene - Elementos de Protección Personal', 'Seguridad e Higiene - Seguridad en Planta']
  },
  {
    slug: 'administracion-general-de-medio-ambiente',
    curso: 'Administración General de Medio Ambiente',
    familia: 'Administración',
    queries: ['environmental sustainability renewable', 'ecology environmental inspection', 'green energy environmental science'],
    nombres: ['Gestión Ambiental - Sustentabilidad y Auditoría', 'Gestión Ambiental - Control Ambiental', 'Gestión Ambiental - Recursos Naturales']
  },
  {
    slug: 'operador-de-informatica-de-oficina-operador-de-pc',
    curso: 'Operador de Informática de Oficina (Operador de PC)',
    familia: 'Informática',
    queries: ['office computer keyboard workspace', 'typing computer desktop office', 'computer workspace monitor keyboard'],
    nombres: ['Operador de PC - Ofimática y Escritorio', 'Operador de PC - Carga y Procesamiento de Datos', 'Operador de PC - Herramientas Digitales']
  },
  {
    slug: 'instalador-y-soporte-de-sistemas-informaticos-reparador-de-pc',
    curso: 'Instalador y Soporte de Sistemas Informáticos (Reparador de PC)',
    familia: 'Informática',
    queries: ['computer repair motherboard technician', 'hardware repair screwdriver pc', 'motherboard repair technician desk'],
    nombres: ['Reparador de PC - Placas y Componentes', 'Reparador de PC - Mantenimiento de Hardware', 'Reparador de PC - Diagnóstico y Reparación']
  },
  {
    slug: 'diseno-grafico-i-y-ii-diseno-de-paginas-web',
    curso: 'Diseño Gráfico I y II + Diseño de Páginas Web',
    familia: 'Informática',
    queries: ['graphic design drawing tablet screen', 'web design user interface desktop', 'graphic designer workplace computer'],
    nombres: ['Diseño Gráfico y Web - Creación y Bocetado', 'Diseño Gráfico y Web - Maquetación y Proyectos Web', 'Diseño Gráfico y Web - Identidad Visual y Marca']
  },
  {
    slug: 'realizador-de-piezas-graficas-y-audiovisuales-para-redes-sociales',
    curso: 'Realizador de Piezas Gráficas y Audiovisuales para Redes Sociales',
    familia: 'Informática',
    queries: ['video editing monitor studio', 'content creator camera setup lighting', 'filmmaking video production camera'],
    nombres: ['Audiovisuales y Redes - Edición de Video', 'Audiovisuales y Redes - Grabación y Cámara', 'Audiovisuales y Redes - Creación de Contenido Multimedia']
  },
  {
    slug: 'electricidad-en-inmuebles-gestor-energetico',
    curso: 'Electricidad en Inmuebles + Gestor Energético',
    familia: 'Electricidad',
    queries: ['electrician electrical panel tester', 'electrician wiring multimeter', 'home electrical installation wiring'],
    nombres: ['Electricidad Inmuebles - Tableros Principales', 'Electricidad Inmuebles - Mediciones e Instrumental', 'Electricidad Inmuebles - Instalaciones Domiciliarias']
  },
  {
    slug: 'electricidad-en-inmuebles-paneles-solares',
    curso: 'Electricidad en Inmuebles + Paneles Solares',
    familia: 'Electricidad',
    queries: ['solar panels rooftop technician', 'photovoltaic solar installation', 'solar energy technician roof'],
    nombres: ['Electricidad y Solar - Instalación Fotovoltaica', 'Electricidad y Solar - Montaje de Paneles en Altura', 'Electricidad y Solar - Generación y Energías Limpias']
  },
  {
    slug: 'electricista-industrial-sistemas-embebidos-sistemas-electronicos-programables',
    curso: 'Electricista Industrial + Sistemas Embebidos (Sistemas Electrónicos Programables)',
    familia: 'Electricidad',
    queries: ['industrial electrical cabinet plc', 'industrial automation control panel', 'oscilloscope testing electronic circuit'],
    nombres: ['Electricista Industrial - Gabinetes y Fuerza Motriz', 'Electricista Industrial - Automatización y PLC', 'Electricista Industrial - Controladores Programables']
  },
  {
    slug: 'sistemas-de-muy-baja-tension-reparacion-de-redes-ftth-fibra-optica-domotica',
    curso: 'Sistemas de Muy Baja Tensión + FTTH (Fibra Óptica) + Domótica',
    familia: 'Electricidad',
    queries: ['fiber optic cable network server', 'smart home domotics control', 'network server ethernet cabling'],
    nombres: ['Redes y Domótica - Fibra Óptica y Cableado Estructurado', 'Redes y Domótica - Racks y Conectividad', 'Redes y Domótica - Automatización Domiciliaria']
  },
  {
    slug: 'herreria-y-carpinteria-metalica',
    curso: 'Herrería y Carpintería Metálica',
    familia: 'Metalmecánica',
    queries: ['metal workshop angle grinder sparks', 'blacksmith steel forging metal', 'metal fabrication steel structure workshop'],
    nombres: ['Herrería - Amolado y Corte de Metales', 'Herrería - Forja y Deformación', 'Herrería - Armado de Rejas y Estructuras']
  },
  {
    slug: 'soldador-basico',
    curso: 'Soldador Básico',
    familia: 'Metalmecánica',
    queries: ['welding arc sparks welder', 'stick welding steel fabrication', 'arc welding helmet steel joints'],
    nombres: ['Soldador Básico - Soldadura Eléctrica por Arco', 'Soldador Básico - Máscara y Protecciones', 'Soldador Básico - Uniones y Perfiles de Acero']
  },
  {
    slug: 'soldador-mig-tig',
    curso: 'Soldador MIG-TIG',
    familia: 'Metalmecánica',
    queries: ['tig welding torch metal', 'mig welder precision welding', 'tig welder stainless steel torch'],
    nombres: ['Soldador MIG-TIG - Soldadura TIG de Alta Precisión', 'Soldador MIG-TIG - Antorcha y Gas Inerte', 'Soldador MIG-TIG - Soldadura Semiautomática MIG']
  },
  {
    slug: 'mantenimiento-de-edificio',
    curso: 'Mantenimiento de Edificio',
    familia: 'Construcción',
    queries: ['handyman tools carpentry maintenance', 'building maintenance worker tools', 'construction renovation handyman tools'],
    nombres: ['Mantenimiento de Edificios - Herramientas Generales', 'Mantenimiento de Edificios - Albañilería y Terminaciones', 'Mantenimiento de Edificios - Mantenimiento Integral']
  },
  {
    slug: 'colocador-de-paneles-y-placas-de-yeso',
    curso: 'Colocador de Paneles y Placas de Yeso (Durlock)',
    familia: 'Construcción',
    queries: ['drywall plasterboard installation construction', 'plasterer finishing wall drywall', 'drywall wall renovation plastering'],
    nombres: ['Colocador de Yeso - Estructura y Placas Durlock', 'Colocador de Yeso - Masillado y Juntas', 'Colocador de Yeso - Cielorrasos y Tabiques']
  },
  {
    slug: 'montador-de-instalaciones-sanitarias-y-de-gas-domiciliario-instalador-de-sistemas-termicos-sanitarios-de-energias-renovables',
    curso: 'Montador de Instalaciones Sanitarias y de Gas + Térmicos Solares',
    familia: 'Construcción',
    queries: ['plumber pipes wrench installation', 'plumbing copper ppr pipes installation', 'solar water heater rooftop collector'],
    nombres: ['Instalaciones Sanitarias - Cañerías y Termofusión', 'Instalaciones Sanitarias - Conexiones de Agua y Desagües', 'Instalaciones Sanitarias - Termotanques Solares Térmicos']
  },
  {
    slug: 'gasista-domiciliario-2-categoria-apto-matricula-incluye-diseno-proyectual-asistido-por-computadora-cad',
    curso: 'Gasista Domiciliario 2° Categoría + CAD',
    familia: 'Construcción',
    queries: ['boiler furnace technician manometer', 'architectural blueprints cad drafting', 'gas pipe plumbing installation wrench'],
    nombres: ['Gasista Matriculado - Calderas y Pruebas de Presión', 'Gasista Matriculado - Planos y Proyecto en CAD', 'Gasista Matriculado - Instalación de Cañerías de Gas']
  },
  {
    slug: 'reparacion-de-refrigeradores-domesticos-instalacion-de-aire-acondicionado-individual',
    curso: 'Reparación de Refrigeradores + AA',
    familia: 'Climatización',
    queries: ['refrigeration compressor technician gauges', 'refrigerator repair workshop compressor', 'hvac refrigeration gauges repair'],
    nombres: ['Refrigeración y AA - Diagnóstico de Compresores', 'Refrigeración y AA - Manifold y Carga de Refrigerante', 'Refrigeración y AA - Circuitos Frigoríficos']
  },
  {
    slug: 'instalador-y-reparador-de-aire-acondicionado-individual',
    curso: 'Instalador y Reparador de Aire Acondicionado Individual',
    familia: 'Climatización',
    queries: ['air conditioner technician outdoor unit split', 'hvac air conditioning service maintenance', 'air conditioning technician split installation'],
    nombres: ['Aire Acondicionado - Instalación de Split', 'Aire Acondicionado - Montaje y Conexión de Líneas', 'Aire Acondicionado - Mantenimiento y Carga']
  },
  {
    slug: 'reparador-de-electrodomesticos-de-linea-blanca-y-reparacion-de-plaquetas',
    curso: 'Reparador de Electrodomésticos de Línea Blanca y Plaquetas',
    familia: 'Climatización',
    queries: ['washing machine repair appliance drum', 'soldering circuit board electronics technician', 'appliance repair circuit board multimeter'],
    nombres: ['Línea Blanca y Plaquetas - Reparación de Lavarropas', 'Línea Blanca y Plaquetas - Reparación de Placas Electrónicas', 'Línea Blanca y Plaquetas - Soldadura y Cambio de Componentes']
  }
];

const usedPhotoIds = new Set();
const newPromoEntries = [];

async function searchUnsplash(query) {
  try {
    const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=15`;
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`    [WARN] Unsplash HTTP ${res.status} para: ${query}`);
      return [];
    }
    const data = await res.json();
    return (data.results || []).filter(item => {
      const raw = item.urls && item.urls.raw ? item.urls.raw : '';
      const isFree = raw.startsWith('https://images.unsplash.com') && !raw.includes('plus.unsplash.com');
      const isLandscapeOrSquare = item.width >= item.height * 0.8;
      const notUsed = !usedPhotoIds.has(item.id);
      return isFree && isLandscapeOrSquare && notUsed;
    }).map(item => ({
      id: item.id,
      url: item.urls.raw,
      desc: item.alt_description || item.description || ''
    }));
  } catch (err) {
    console.warn(`    [ERR] Error buscando Unsplash "${query}":`, err.message);
    return [];
  }
}

async function searchDDGFallback(query) {
  try {
    const res = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iar=images`);
    const html = await res.text();
    const m = html.match(/vqd=([0-9-]+)/) || html.match(/vqd="([0-9-]+)"/) || html.match(/vqd='([0-9-]+)'/);
    if (!m) return [];
    const vqd = m[1];
    const imgRes = await fetch(`https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,type:photo,,&p=1`);
    const data = await imgRes.json();
    return (data.results || []).filter(r => {
      const isLarge = r.width >= 700 && r.height >= 450;
      const isPhoto = r.image && !r.image.endsWith('.svg') && !r.image.endsWith('.gif');
      const notUsed = !usedPhotoIds.has(r.image);
      return isLarge && isPhoto && notUsed;
    }).map(r => ({
      id: r.image,
      url: r.image,
      desc: r.title || ''
    }));
  } catch (e) {
    console.warn(`    [ERR] Error DDG fallback "${query}":`, e.message);
    return [];
  }
}

async function downloadPhoto(photoUrl, destPath) {
  let downloadUrl = photoUrl;
  if (photoUrl.includes('images.unsplash.com')) {
    downloadUrl = photoUrl.includes('?') 
      ? `${photoUrl.split('?')[0]}?auto=format&fit=crop&w=1200&q=80`
      : `${photoUrl}?auto=format&fit=crop&w=1200&q=80`;
  }

  const res = await fetch(downloadUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 15000) throw new Error(`Imagen demasiado pequeña (${buf.length} bytes)`);
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

async function main() {
  console.log(`=== DESCARGANDO IMÁGENES PARA ${COURSES.length} CURSOS ===`);
  console.log(`Directorio destino: ${TARGET_DIR}\n`);

  for (let cIdx = 0; cIdx < COURSES.length; cIdx++) {
    const course = COURSES[cIdx];
    console.log(`\n[${cIdx + 1}/${COURSES.length}] ${course.curso} [${course.familia}]`);

    const chosen = [];
    for (const q of course.queries) {
      if (chosen.length >= 3) break;
      const results = await searchUnsplash(q);
      for (const r of results) {
        if (chosen.length < 3) {
          chosen.push(r);
          usedPhotoIds.add(r.id);
        }
      }
      await new Promise(r => setTimeout(r, 200));
    }

    // Si Unsplash no alcanzó a 3, buscar con DDG
    if (chosen.length < 3) {
      console.log(`  -> Unsplash dio ${chosen.length}/3 fotos. Activando fallback DDG...`);
      for (const q of course.queries) {
        if (chosen.length >= 3) break;
        const ddgResults = await searchDDGFallback(q);
        for (const r of ddgResults) {
          if (chosen.length < 3) {
            chosen.push(r);
            usedPhotoIds.add(r.id);
          }
        }
      }
    }

    console.log(`  Fotos seleccionadas: ${chosen.length}`);

    for (let pIdx = 0; pIdx < chosen.length; pIdx++) {
      const photo = chosen[pIdx];
      const filename = `${course.slug}-${pIdx + 1}.jpg`;
      const fullPath = path.join(TARGET_DIR, filename);
      const relativePath = `assets/promociones/${filename}`;
      const photoName = course.nombres[pIdx] || `${course.curso} - Foto ${pIdx + 1}`;

      try {
        const sizeBytes = await downloadPhoto(photo.url, fullPath);
        const sizeKb = (sizeBytes / 1024).toFixed(1);
        console.log(`  ✓ [${pIdx + 1}/3] ${filename} (${sizeKb} KB) - ${photo.desc.slice(0, 45)}`);

        newPromoEntries.push({
          id: `f-${course.slug}-${pIdx + 1}`,
          familia: course.familia,
          cursoSlug: course.slug,
          archivo: relativePath,
          nombre: photoName,
          encuadre: '40% 45%'
        });
      } catch (err) {
        console.error(`  ✗ Error al guardar ${filename}: ${err.message}`);
      }
    }

    // Breve pausa para cuidar los servicios
    await new Promise(r => setTimeout(r, 400));
  }

  const metadataPath = path.join(__dirname, 'fotos-promociones-metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(newPromoEntries, null, 2), 'utf8');
  console.log(`\n========================================`);
  console.log(`DESCARGA COMPLETADA: ${newPromoEntries.length} fotos guardadas exitosamente.`);
  console.log(`Metadatos exportados en: ${metadataPath}`);
  console.log(`========================================`);
}

main().catch(console.error);
