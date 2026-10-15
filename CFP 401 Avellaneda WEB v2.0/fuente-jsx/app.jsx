/* ===========================================================================
   CFP N° 401 AVELLANEDA — CÓDIGO FUENTE DE LA APLICACIÓN (JSX)
   ---------------------------------------------------------------------------
   Este archivo NO se sube al servidor. Es la fuente editable.
   El archivo que usa el sitio es site/app.js, que se genera compilando éste.

   Para regenerar app.js después de editar acá, ver LEEME-COMPILAR.txt.

   Para cambiar CURSOS, HORARIOS o AVISOS no hace falta tocar este archivo:
   todo eso vive en site/data.js y se edita directamente.
   =========================================================================== */

const { Button, Badge, Card, SectionHeading, Logo, Icon, InfoList, Callout, StatBlock, Hero, CourseCard, Select, Input, CourseTable, Tabs, NavBar, Footer, Modal } = window.CFP401AvellanedaDesignSystem_6c39ff;

/* ===========================================================================
   CONFIGURACIÓN GENERAL
   Estas constantes se definen una sola vez y las usan todas las pantallas.
   =========================================================================== */
/* Datos de contacto: viven en data.js para poder editarlos sin recompilar. */
const CT = (typeof window !== 'undefined' && window.CFP_DATA && window.CFP_DATA.contacto) || {};
const obtenerWspNum = () => {
  const raw = (typeof window !== 'undefined' && window.CFP_DATA && window.CFP_DATA.contacto && window.CFP_DATA.contacto.whatsapp) || '1161056018';
  const clean = String(raw).replace(/\D/g, '');
  return clean.startsWith('54') ? clean : ('549' + clean);
};
const getWhatsAppUrl = (texto = 'Hola, quiero información sobre los cursos de Formación Profesional.') =>
  `https://wa.me/${obtenerWspNum()}?text=${encodeURIComponent(texto)}`;
const WHATSAPP_URL = getWhatsAppUrl();
const ANIO_ACTUAL  = new Date().getFullYear();
const CAMPUS_URL   = 'https://campuscfp401avellaneda.com.ar/login/index.php';
const MAPS_URL     = 'https://www.google.com/maps/place/Cfp+401/@-34.6516833,-58.347049,15z/data=!4m5!3m4!1s0x0:0x117f33b4198391f2!8m2!3d-34.6516831!4d-58.347049?shorturl=1';

// Campus del Secundario para Adultos (CENS N° 453), en el mismo dominio (instalado el 30/09/2026).
const SEMI_URL     = 'https://campuscfp401avellaneda.com.ar/semi/';
// Todos los accesos "Campus Virtual" abren el selector (secundario o cursos del CFP); lo escucha <App/>.
const abrirCampus = () => window.dispatchEvent(new CustomEvent('cfp:selector-campus'));

/* Un curso pertenece a una familia si es su familia principal o si figura en
   su lista "tambien" (cursos que cruzan dos especialidades). */
const esDeFamilia = (c, fam) => c.familia === fam || (c.tambien || []).includes(fam);

const getFamiliaImagen = (f) => {
  if (f.imagen !== undefined) return f.imagen || null;
  const n = (f.nombre || '').toLowerCase();
  if (n.includes('administra')) return 'assets/area-administracion.jpg';
  if (n.includes('climati')) return 'assets/area-climatizacion.jpg';
  if (n.includes('construc')) return 'assets/area-construccion.jpg';
  if (n.includes('electri')) return 'assets/area-electricidad.jpg';
  if (n.includes('renov') || n.includes('energ')) return 'assets/area-energias-renovables.jpg';
  if (n.includes('inform')) return 'assets/area-informatica.jpg';
  return 'assets/area-metalmecanica.jpg';
};

function parseTextoConNegritas(texto) {
  if (!texto || typeof texto !== 'string') return texto;
  const lineas = texto.split('\n');
  return lineas.map((linea, lineIdx) => {
    const partes = linea.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    const contenido = partes.map((parte, pIdx) => {
      if (parte.startsWith('**') && parte.endsWith('**')) {
        return <strong key={pIdx} style={{ fontWeight: 800, color: 'inherit' }}>{parte.slice(2, -2)}</strong>;
      }
      return parte;
    });
    return (
      <React.Fragment key={lineIdx}>
        {lineIdx > 0 && <br />}
        {contenido}
      </React.Fragment>
    );
  });
}

/* Las tarjetas de áreas del inicio se derivan de data.js: nunca se
   desincronizan con el listado de cursos. */
const AREAS_CAPACITACION = (window.CFP_DATA.familias || [])
  .map(f => ({
    title: f.nombre.toUpperCase(),
    familia: f.nombre,
    icon: f.icono || 'book-open',
    imagen: getFamiliaImagen(f),
    courses: window.CFP_DATA.courses.filter(c => esDeFamilia(c, f.nombre)).map(c => c.curso)
  }))
  .filter(a => a.courses.length > 0);

/* Grillas que colapsan solas en pantallas chicas. */
const GRID_AUTO = n => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit,minmax(min(100%,${n}px),1fr))`,
  gap: 'var(--space-6)'
});

/* ===========================================================================
   VUELO DEL AVIONCITO — reescrito para que lo componga la GPU
   ---------------------------------------------------------------------------
   El Hero del design system animaba el avión con  offset-distance  sobre un
   offset-path, y revelaba la estela animando  stroke-dashoffset  de una
   máscara SVG. Ninguna de las dos propiedades se puede componer por GPU: el
   navegador vuelve a pintar el cuadro entero 60 veces por segundo durante los
   26 s del recorrido, y en celulares eso se ve a tirones.

   Acá se reemplaza por lo único que el compositor sí acelera:
     - el avión se mueve con  transform: translate3d(...) rotate(...)
       interpolando entre muestras tomadas sobre la misma curva original,
       espaciadas por LONGITUD DE ARCO para que la velocidad no cambie;
     - la estela se dibuja con puntos ya posicionados que aparecen con
       opacity, agrupados de a 4 para no crear decenas de capas.

   El Hero se instancia con  plane={false}  para que el bundle no dibuje su
   propia versión, y este componente se inyecta con un portal en la misma capa
   de fondo donde vivía, de modo que siga quedando DETRÁS del texto.
   =========================================================================== */
const VUELO = {
  caja: [1200, 420],   // sistema de coordenadas de la curva original
  dur: 26,             // segundos del ciclo completo
  espera: 6,           // retraso antes del despegue
  tramo: 31,           // % del ciclo que dura el vuelo
  borrado: 19,         // % adicional durante el que se va borrando la estela
  porGrupo: 4,         // puntos de estela por capa animada
  avion: [[-80,332,-8.5],[-57.5,328.0,-11.6],[-35.2,322.8,-14.8],[-13.3,316.4,-17.9],[8.2,308.7,-21.0],[29.3,300.0,-23.9],[49.9,290.3,-26.6],[70.1,279.6,-28.9],[90.0,268.3,-30.6],[109.5,256.5,-31.8],[128.9,244.3,-32.2],[148.2,232.2,-31.6],[167.8,220.5,-30.0],[187.9,209.5,-27.1],[208.5,199.9,-22.7],[230.1,192.2,-16.7],[252.2,187.0,-9.5],[275.0,184.8,-1.6],[297.8,185.7,6.1],[320.2,189.5,13.0],[342.5,195.0,11.6],[365.0,198.2,4.4],[387.9,198.4,-3.5],[410.5,195.4,-11.4],[432.6,189.5,-18.2],[453.9,181.4,-23.3],[474.6,171.7,-26.4],[494.9,161.4,-27.5],[515.2,150.9,-26.7],[535.8,141.0,-24.3],[556.9,132.3,-20.3],[578.6,125.3,-15.2],[600.9,120.5,-9.3],[623.6,118.0,-3.1],[646.4,118.0,2.8],[669.1,120.2,8.2],[691.8,124.0,8.5],[714.4,126.5,4.3],[737.2,127.3,-0.3],[760.0,126.3,-4.9],[782.6,123.4,-9.5],[805.0,118.8,-13.7],[827.0,112.7,-17.2],[848.6,105.5,-19.7],[870.0,97.5,-21.1],[891.4,89.2,-20.9],[912.8,81.3,-19.1],[934.6,74.5,-15.3],[956.9,69.6,-9.4],[979.6,67.3,-1.8],[1002.4,68.2,5.3],[1025.2,69.5,1.0],[1048.0,69.0,-3.6],[1070.7,66.7,-8.1],[1093.2,62.6,-12.3],[1115.3,57.0,-16.2],[1137.0,50.0,-19.5],[1158.4,41.8,-22.2],[1179.4,32.7,-24.5],[1200.0,23.0,-26.2],[1220.3,12.6,-27.6],[1240.4,1.8,-28.6],[1260.4,-9.3,-29.4],[1280.3,-20.6,-29.9],[1300.0,-32.0,-30.3]],
  puntos: [[-71.7,330.7],[-55.4,327.6],[-39.3,323.8],[-23.2,319.4],[-7.3,314.4],[8.2,308.7],[23.7,302.5],[38.8,295.7],[53.7,288.4],[68.3,280.6],[82.8,272.5],[97.1,264.0],[111.2,255.4],[125.4,246.5],[139.4,237.7],[153.6,229.0],[167.8,220.5],[182.4,212.4],[197.2,204.9],[212.4,198.3],[228.0,192.8],[244.1,188.5],[260.5,185.8],[277.0,184.7],[293.7,185.3],[310.1,187.4],[326.3,191.0],[342.5,195.0],[358.8,197.6],[375.4,198.7],[392.0,198.1],[408.4,195.8],[424.6,191.9],[440.4,186.8],[455.8,180.6],[470.8,173.6],[485.7,166.1],[500.4,158.5],[515.2,150.9],[530.1,143.6],[545.3,136.9],[560.8,130.9],[576.6,125.9],[592.7,122.0],[609.2,119.3],[625.7,117.9],[642.3,117.8],[658.9,118.9],[675.4,121.2],[691.8,124.0],[708.2,126.0],[724.7,127.1],[741.3,127.3],[758.0,126.5],[774.5,124.7],[790.8,121.9],[807.1,118.3],[823.1,113.9],[838.9,108.9],[854.5,103.3],[870.0,97.5],[885.5,91.5],[901.1,85.5],[916.7,80.0],[932.6,75.1],[948.7,71.1],[965.1,68.4],[981.6,67.3],[998.3,67.8],[1014.8,69.1],[1031.4,69.5],[1048.0,69.0],[1064.6,67.5],[1081.0,65.0],[1097.2,61.7],[1113.3,57.5],[1129.2,52.7],[1144.9,47.1],[1160.3,41.0],[1175.5,34.5],[1190.6,27.5],[1205.5,20.2],[1220.3,12.6],[1235.0,4.8],[1249.6,-3.2],[1264.0,-11.3],[1278.5,-19.5],[1292.8,-27.8]]
};

const CSS_VUELO = (() => {
  const { avion, puntos, tramo, borrado, porGrupo } = VUELO;
  const K = {};
  const poner = (pct, decl) => { K[pct] = (K[pct] || '') + decl; };

  avion.forEach((p, i) => poner(
    +(i * tramo / (avion.length - 1)).toFixed(4),
    `transform:translate3d(${p[0]}px,${p[1]}px,0) rotate(${p[2]}deg);`
  ));
  const fin = avion[avion.length - 1];
  poner(0, 'opacity:0;');
  poner(2, 'opacity:1;');
  poner(27, 'opacity:1;');
  poner(tramo, 'opacity:0;');
  poner(100, `transform:translate3d(${fin[0]}px,${fin[1]}px,0) rotate(${fin[2]}deg);opacity:0;`);

  const cuerpo = Object.keys(K).map(Number).sort((a, b) => a - b)
    .map(p => `${p}%{${K[p]}}`).join('');

  let css = `@keyframes cfpVueloGPU{${cuerpo}}`
    + `.cfp-vuelo{position:absolute;left:0;top:0;transform-origin:top left}`
    + `.cfp-avion{animation:cfpVueloGPU ${VUELO.dur}s linear ${VUELO.espera}s infinite;`
    + `will-change:transform,opacity;opacity:0}`;

  const grupos = Math.ceil(puntos.length / porGrupo);
  for (let g = 0; g < grupos; g++) {
    const f = Math.min(1, (g * porGrupo + porGrupo / 2) / puntos.length);
    const a = +(f * tramo).toFixed(3);          // aparece cuando pasa el avión
    const b = +(tramo + f * borrado).toFixed(3); // se borra en el mismo orden
    css += `@keyframes cfpEstela${g}{0%,${a}%{opacity:0}${+(a + 0.5).toFixed(3)}%,`
         + `${b}%{opacity:1}${+(b + 0.6).toFixed(3)}%,100%{opacity:0}}`
         + `.cfp-estela-${g}{animation:cfpEstela${g} ${VUELO.dur}s linear ${VUELO.espera}s infinite;`
         + `will-change:opacity;opacity:0}`;
  }
  return css + '@media (prefers-reduced-motion:reduce){.cfp-vuelo{display:none}}';
})();

function VueloAvion({ assetBase = 'assets' }) {
  const [capa, setCapa] = React.useState(null);
  const caja = React.useRef(null);

  // La capa de fondo del Hero: el mismo contenedor donde el bundle ponía su avión.
  React.useEffect(() => {
    const arco = document.querySelector('.cfp-arc-stage');
    if (arco && arco.parentElement) setCapa(arco.parentElement);
  }, []);

  // La curva está en un lienzo de 1200x420; se escala al ancho real del hero.
  React.useEffect(() => {
    if (!capa) return;
    const el = caja.current;
    if (!el) return;
    const ajustar = () => {
      const r = capa.getBoundingClientRect();
      if (!r.width) return;
      const s = r.width / VUELO.caja[0];
      el.style.transform =
        `translate3d(0,${((r.height - VUELO.caja[1] * s) / 2).toFixed(1)}px,0) scale(${s.toFixed(4)})`;
    };
    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(capa);
    return () => ro.disconnect();
  }, [capa]);

  if (!capa) return null;

  const grupos = [];
  for (let i = 0; i < VUELO.puntos.length; i += VUELO.porGrupo) {
    grupos.push(VUELO.puntos.slice(i, i + VUELO.porGrupo));
  }

  return ReactDOM.createPortal(
    <div ref={caja} className="cfp-vuelo" aria-hidden="true"
         style={{width:VUELO.caja[0],height:VUELO.caja[1]}}>
      <style>{CSS_VUELO}</style>
      {grupos.map((gr,i)=>
        <div key={i} className={`cfp-estela-${i}`} style={{position:'absolute',inset:0}}>
          {gr.map((p,j)=><span key={j} style={{position:'absolute',left:p[0],top:p[1],
            width:3.5,height:3.5,marginLeft:-1.75,marginTop:-1.75,
            borderRadius:'50%',background:'rgba(255,255,255,.42)'}}/>)}
        </div>)}
      <div className="cfp-avion" style={{position:'absolute',left:0,top:0,
        width:54,height:54,marginLeft:-27,marginTop:-27}}>
        <img src={`${assetBase}/avioncito-papel.png`} alt="" style={{width:'100%',display:'block',
          transform:'rotate(43deg)',filter:'drop-shadow(0 4px 10px rgba(0,0,0,.28))'}}/>
      </div>
    </div>, capa);
}


/* ===========================================================================
   NAVBAR CON MENÚ DESPLEGABLE EN "CURSOS" (FAMILIAS Y CURSOS CORRESPONDIENTES)
   =========================================================================== */
function SiteNavBar({ active, onNavigate, assetBase = 'assets', cta }) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [hoveredFamily, setHoveredFamily] = React.useState(
    (window.CFP_DATA.familias && window.CFP_DATA.familias[0]?.nombre) || 'Administración'
  );
  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const leaveTimer = React.useRef(null);
  const navItems = ["Inicio", "Cursos", "Nosotros", "Inscripción", "Contacto"];

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    leaveTimer.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 280);
  };

  const toggleDropdown = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDropdownOpen(prev => !prev);
  };

  const allCourses = window.CFP_DATA.courses || [];
  const familias = window.CFP_DATA.familias || [];
  const currentFamilyCourses = allCourses.filter(c => esDeFamilia(c, hoveredFamily));

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--surface-card, #ffffff)',
      borderBottom: 'var(--border-width) solid var(--border-subtle)',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div style={{ height: 'var(--rule-height, 4px)', background: 'var(--brand-accent)' }} />
      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        padding: '12px var(--gutter)',
        display: 'flex',
        alignItems: 'center',
        rowGap: 'var(--space-3)',
        columnGap: 'var(--space-6)',
        flexWrap: 'wrap',
        position: 'relative'
      }}>
        <div onClick={() => onNavigate('Inicio')} style={{ cursor: 'pointer' }}>
          <Logo variant="institucional" height={38} assetBase={assetBase} style={{ flex: '0 1 auto', minWidth: 0, maxWidth: '100%', height: 'auto', maxHeight: 38 }} />
        </div>

        <nav style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: 'var(--space-2)',
          columnGap: 'clamp(14px, 2.2vw, var(--space-6))',
          marginLeft: 'auto'
        }}>
          {navItems.map(it => {
            const isCourses = it === 'Cursos';
            const isActive = active === it;

            if (isCourses) {
              return (
                <div
                  key={it}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ position: 'relative' }}
                >
                  <a
                    className="cfp-nav-link"
                    onClick={(e) => {
                      if (isMobile) {
                        toggleDropdown(e);
                      } else {
                        setDropdownOpen(false);
                        onNavigate('Cursos');
                      }
                    }}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      fontSize: 15,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      color: isActive ? 'var(--brand-primary)' : 'var(--neutral-600)',
                      paddingTop: 7, // = relleno + subrayado de abajo: el texto queda centrado con el botón del campus
                      paddingBottom: 4,
                      borderBottom: '3px solid ' + (isActive ? 'var(--brand-accent)' : 'transparent'),
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <span>{it}</span>
                    <span
                      onClick={toggleDropdown}
                      style={{ display: 'inline-flex', alignItems: 'center', padding: '2px', cursor: 'pointer' }}
                    >
                      <Icon name="chevron-down" size={14} style={{
                        transition: 'transform 0.2s ease',
                        transform: dropdownOpen ? 'rotate(180deg)' : 'none'
                      }} />
                    </span>
                  </a>

                  {/* Panel Desplegable con Familias y Cursos */}
                  {dropdownOpen && (
                    isMobile ? (
                      <>
                        <div
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0, 20, 50, 0.45)',
                            backdropFilter: 'blur(2px)',
                            zIndex: 9998
                          }}
                        />
                        <div
                          style={{
                            position: 'fixed',
                            top: 56,
                            left: 12,
                            right: 12,
                            maxHeight: 'calc(100vh - 72px)',
                            background: '#ffffff',
                            borderRadius: 'var(--radius-lg, 16px)',
                            boxShadow: '0 20px 50px rgba(0, 40, 120, 0.35)',
                            border: '1px solid var(--border-subtle)',
                            overflowY: 'auto',
                            zIndex: 9999,
                            animation: 'fadeInMenu 0.18s ease-out'
                          }}
                        >
                          <div style={{
                            background: 'linear-gradient(135deg, var(--blue-900, #002878), var(--blue-700, #003890))',
                            color: '#ffffff',
                            padding: '12px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '3px solid var(--brand-accent)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Icon name="graduation-cap" size={18} color="var(--brand-accent)" />
                              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>
                                Cursos y Especialidades
                              </span>
                            </div>
                            <button
                              onClick={() => setDropdownOpen(false)}
                              style={{ background: 'transparent', border: 0, color: '#fff', fontSize: 20, cursor: 'pointer', padding: 4 }}
                            >
                              ✕
                            </button>
                          </div>

                          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--neutral-25, #f8fafc)', display: 'flex', gap: 6, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                            {familias.map(f => {
                              const isSel = hoveredFamily === f.nombre;
                              return (
                                <button
                                  key={f.nombre}
                                  onClick={() => setHoveredFamily(f.nombre)}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: 20,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    whiteSpace: 'nowrap',
                                    border: isSel ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                                    background: isSel ? 'var(--brand-primary)' : '#ffffff',
                                    color: isSel ? '#ffffff' : 'var(--neutral-700)',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {f.nombre}
                                </button>
                              );
                            })}
                          </div>

                          <div style={{ padding: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                              <strong style={{ fontSize: 13, color: 'var(--blue-900)' }}>Cursos de {hoveredFamily}:</strong>
                              <a
                                onClick={() => { setDropdownOpen(false); onNavigate('Cursos', hoveredFamily); }}
                                style={{ fontSize: 12, color: 'var(--brand-primary)', fontWeight: 700, cursor: 'pointer' }}
                              >
                                Ver en catálogo →
                              </a>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {currentFamilyCourses.map(c => (
                                <div
                                  key={c.curso}
                                  onClick={() => { setDropdownOpen(false); onNavigate('CursoDetalle', c); }}
                                  style={{
                                    padding: '10px 12px',
                                    borderRadius: 8,
                                    background: '#fcfdfe',
                                    border: '1px solid #edf2f7',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--blue-900)' }}>{c.curso}</div>
                                  <div style={{ fontSize: 12, color: 'var(--neutral-600)', marginTop: 2 }}>{c.duracion} • {c.horarios}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div style={{ padding: 12, background: 'var(--neutral-25)', borderTop: '1px solid var(--border-subtle)' }}>
                            <button
                              onClick={() => { setDropdownOpen(false); onNavigate('Cursos'); }}
                              style={{
                                width: '100%',
                                padding: '10px',
                                background: 'var(--brand-primary)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                fontWeight: 700,
                                fontSize: 14,
                                cursor: 'pointer'
                              }}
                            >
                              Ver catálogo completo ({allCourses.length} cursos) →
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: -120,
                          marginTop: 10,
                          width: '680px',
                          maxWidth: '94vw',
                          background: '#ffffff',
                          borderRadius: 'var(--radius-lg, 16px)',
                          boxShadow: '0 16px 40px rgba(0, 40, 120, 0.22)',
                          border: '1px solid var(--border-subtle)',
                          overflow: 'hidden',
                          zIndex: 1000,
                          animation: 'fadeInMenu 0.18s ease-out'
                        }}
                      >
                        <div style={{
                          background: 'linear-gradient(135deg, var(--blue-900, #002878), var(--blue-700, #003890))',
                          color: '#ffffff',
                          padding: '12px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '3px solid var(--brand-accent)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Icon name="graduation-cap" size={18} color="var(--brand-accent)" />
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>
                              Catálogo Oficial de Cursos y Especialidades
                            </span>
                          </div>
                          <a
                            onClick={() => { setDropdownOpen(false); onNavigate('Cursos'); }}
                            style={{
                              color: 'var(--brand-accent)',
                              fontSize: 13,
                              fontWeight: 700,
                              cursor: 'pointer',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            Ver todos ({allCourses.length}) <Icon name="arrow-right" size={13} />
                          </a>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', minHeight: 310 }}>
                          {/* Columna Izquierda: Familias Profesionales */}
                          <div style={{
                            background: 'var(--neutral-25, #f8fafc)',
                            borderRight: '1px solid var(--border-subtle)',
                            padding: '8px 0',
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <div style={{
                              padding: '6px 14px 8px',
                              fontSize: 11,
                              fontWeight: 800,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: 'var(--neutral-500)'
                            }}>
                              Familias Profesionales
                            </div>
                            {familias.map(f => {
                              const isHovered = hoveredFamily === f.nombre;
                              const count = allCourses.filter(c => esDeFamilia(c, f.nombre)).length;
                              return (
                                <div
                                  key={f.nombre}
                                  onMouseEnter={() => setHoveredFamily(f.nombre)}
                                  onClick={() => {
                                    setDropdownOpen(false);
                                    onNavigate('Cursos', f.nombre);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '9px 14px',
                                    cursor: 'pointer',
                                    background: isHovered ? 'var(--surface-brand-soft, #e8eefb)' : 'transparent',
                                    borderLeft: isHovered ? '4px solid var(--brand-accent)' : '4px solid transparent',
                                    transition: 'background 0.15s ease'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                                    <div style={{
                                      color: isHovered ? 'var(--brand-primary)' : 'var(--neutral-600)',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}>
                                      <Icon name={f.icono || 'book-open'} size={17} />
                                    </div>
                                    <span style={{
                                      fontSize: 14,
                                      fontWeight: isHovered ? 700 : 500,
                                      color: isHovered ? 'var(--blue-900)' : 'var(--neutral-700)',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}>
                                      {f.nombre}
                                    </span>
                                  </div>
                                  <span style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    background: isHovered ? '#ffffff' : 'rgba(0,0,0,0.06)',
                                    color: isHovered ? 'var(--brand-primary)' : 'var(--neutral-600)',
                                    padding: '2px 7px',
                                    borderRadius: 12
                                  }}>
                                    {count}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Columna Derecha: Cursos de la Familia seleccionada */}
                          <div style={{
                            padding: '14px 18px',
                            display: 'flex',
                            flexDirection: 'column',
                            background: '#ffffff',
                            maxHeight: 350,
                            overflowY: 'auto'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 10,
                              paddingBottom: 8,
                              borderBottom: '1px solid var(--border-subtle)'
                            }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue-900)' }}>
                                Cursos de {hoveredFamily}
                              </span>
                              <a
                                onClick={() => { setDropdownOpen(false); onNavigate('Cursos', hoveredFamily); }}
                                style={{
                                  fontSize: 12,
                                  color: 'var(--brand-primary)',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textDecoration: 'underline'
                                }}
                              >
                                Filtrar en listado →
                              </a>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                              {currentFamilyCourses.length === 0 ? (
                                <p style={{ fontSize: 13, color: 'var(--neutral-500)', fontStyle: 'italic', margin: '16px 0' }}>
                                  No hay cursos cargados en esta familia actualmente.
                                </p>
                              ) : (
                                currentFamilyCourses.map(c => (
                                  <div
                                    key={c.curso}
                                    onClick={() => {
                                      setDropdownOpen(false);
                                      onNavigate('CursoDetalle', c);
                                    }}
                                    style={{
                                      padding: '8px 10px',
                                      borderRadius: 8,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      gap: 8,
                                      background: '#fcfdfe',
                                      border: '1px solid #edf2f7',
                                      transition: 'all 0.15s ease'
                                    }}
                                    onMouseEnter={e => {
                                      e.currentTarget.style.background = 'var(--surface-brand-soft, #e8eefb)';
                                      e.currentTarget.style.borderColor = 'var(--brand-primary)';
                                      e.currentTarget.style.transform = 'translateX(3px)';
                                    }}
                                    onMouseLeave={e => {
                                      e.currentTarget.style.background = '#fcfdfe';
                                      e.currentTarget.style.borderColor = '#edf2f7';
                                      e.currentTarget.style.transform = 'none';
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                                      <span style={{ color: 'var(--brand-primary)', display: 'flex' }}>
                                        <Icon name="check" size={14} color="var(--brand-primary)" strokeWidth={2.5} />
                                      </span>
                                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-title)', lineHeight: 1.3 }}>
                                        {c.curso}
                                      </span>
                                    </div>
                                    <Icon name="chevron-right" size={14} color="var(--neutral-400)" />
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Pie del Desplegable */}
                        <div style={{
                          padding: '9px 18px',
                          background: 'var(--surface-brand-soft, #e8eefb)',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: 12,
                          color: 'var(--blue-900)'
                        }}>
                          <span>Todos los cursos otorgan <strong>certificación oficial y son 100% gratuitos</strong>.</span>
                          <a href={WHATSAPP_URL} target="_blank" rel="noopener" style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Icon name="message-circle" size={14} /> Consultar por WhatsApp
                          </a>
                        </div>
                      </div>
                    )
                  )}
                </div>
              );
            }

            return (
              <a
                key={it}
                className="cfp-nav-link"
                onClick={() => onNavigate && onNavigate(it)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 15,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  color: isActive ? 'var(--brand-primary)' : 'var(--neutral-600)',
                  paddingTop: 7, // = relleno + subrayado de abajo: el texto queda centrado con el botón del campus
                  paddingBottom: 4,
                  borderBottom: '3px solid ' + (isActive ? 'var(--brand-accent)' : 'transparent'),
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                <span>{it}</span>
              </a>
            );
          })}
        </nav>

        {cta && (
          <Button variant="accent" size="sm" onClick={cta.onClick} style={{ flex: 'none', whiteSpace: 'nowrap' }}>
            {cta.label}
          </Button>
        )}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */

/* Cifras institucionales: las mismas en Inicio y en Nosotros y editables desde el panel (data.js →
   estadisticas). En el valor, {cursos} y {familias} se reemplazan por la cantidad que hay hoy en el sitio. */
const ESTADISTICAS_POR_DEFECTO = {
  antetitulo: 'Desde 1979',
  titulo: '+45 años formando en oficios',
  anioCreacion: '1979',
  items: [
    { valor: '+3.600', etiqueta: 'Cursos dictados' },
    { valor: '+36.000', etiqueta: 'Egresados en FI' },
    { valor: '{familias}', etiqueta: 'Familias profesionales' },
    { valor: '{cursos}', etiqueta: 'Cursos gratuitos' }
  ]
};

function estadisticasSitio() {
  const d = window.CFP_DATA || {};
  const e = d.estadisticas || {};
  const items = (Array.isArray(e.items) && e.items.length ? e.items : ESTADISTICAS_POR_DEFECTO.items).map(it => ({
    etiqueta: (it && it.etiqueta) || '',
    valor: String((it && it.valor) || '')
      .replace(/\{cursos\}/g, String((d.courses || []).length))
      .replace(/\{familias\}/g, String((d.familias || []).length))
  }));
  return {
    antetitulo: e.antetitulo || ESTADISTICAS_POR_DEFECTO.antetitulo,
    titulo: e.titulo || ESTADISTICAS_POR_DEFECTO.titulo,
    anioCreacion: e.anioCreacion || ESTADISTICAS_POR_DEFECTO.anioCreacion,
    items
  };
}

/* Cifra con el "+" en amarillo, para que el número blanco mande */
function ValorCifra({ valor }) {
  return valor.startsWith('+')
    ? <><span style={{color:'var(--brand-accent)'}}>+</span>{valor.slice(1)}</>
    : <>{valor}</>;
}

/* Cinta de avisos del inicio: amarilla o blanca (se elige en el panel). Texto a la izquierda, logo de la
   Provincia al centro y botón a la derecha; en tablet el logo baja junto al botón y en celular todo se apila.
   El fondo va por clase (no en línea) para que no le apliquen las reglas viejas de index.html. */
function CintaAvisos({ cinta, titulo, detalle, urlMapa, onInscripcion }) {
  const blanca = cinta.estilo === 'blanca';
  const conLogo = cinta.mostrarLogoProvincia !== false;
  // Cada versión de la cinta puede tener su propio logo, subido desde el panel; si no, va el original
  const logoPropio = blanca ? cinta.logoBlanca : cinta.logoAmarilla;
  const logo = logoPropio || 'assets/logo-provincia-ba.png';
  // "A PARTIR DE…" y "Dock Sud" nunca se cortan en dos renglones
  const corte = titulo.search(/a partir de/i);
  const titulo1 = corte > 0 ? titulo.slice(0, corte).trim() : titulo;
  const titulo2 = corte > 0 ? titulo.slice(corte).trim() : '';
  const partes = detalle.split(' · ');
  const atencion = partes[0].trim();
  const direccion = partes.slice(1).join(' · ').trim();
  return (
    <section className={'cfp-cinta ' + (blanca ? 'cfp-cinta-blanca' : 'cfp-cinta-amarilla')} aria-label="Aviso de inscripciones">
      <style>{`
.cfp-cinta-amarilla{background:var(--brand-accent)}
.cfp-cinta-blanca{background:#fff;border-top:4px solid var(--brand-accent);border-bottom:4px solid var(--brand-accent)}
.cfp-cinta-grid{max-width:var(--container-max);margin:0 auto;padding:14px var(--gutter);display:grid;grid-template-columns:max-content minmax(0,1fr) max-content;grid-template-areas:"texto logo boton";align-items:center;column-gap:var(--space-6);row-gap:12px}
.cfp-cinta-texto{grid-area:texto;display:flex;flex-direction:column;gap:4px;min-width:0}
.cfp-cinta-titulo{font-family:var(--font-display);font-weight:800;font-size:18px;line-height:1.3;color:var(--blue-900)}
.cfp-cinta-detalle{font-size:15px;line-height:1.4;color:var(--blue-900)}
.cfp-cinta-blanca .cfp-cinta-detalle{color:var(--neutral-700)}
.cfp-cinta-detalle a{color:inherit;text-decoration:none}
.cfp-cinta-dir{font-weight:600;color:var(--blue-900);text-decoration:underline;text-underline-offset:3px}
.cfp-cinta-sep{margin:0 8px;font-weight:800;color:var(--blue-900)}
.cfp-cinta-blanca .cfp-cinta-sep{color:var(--brand-accent)}
.cfp-cinta-logo{grid-area:logo;justify-self:center;display:flex;align-items:center}
.cfp-cinta-logo img{display:block;height:56px;width:auto;max-width:100%}
.cfp-cinta-boton{grid-area:boton;justify-self:end}
.cfp-cinta-grid.sin-logo{grid-template-columns:minmax(0,1fr) auto;grid-template-areas:"texto boton"}
@media (max-width:1100px){
  .cfp-cinta-grid,.cfp-cinta-grid.sin-logo{grid-template-columns:1fr;grid-template-areas:"texto" "logo" "boton";justify-items:center;text-align:center;padding-top:18px;padding-bottom:18px}
  .cfp-cinta-texto{align-items:center}
  .cfp-cinta-logo,.cfp-cinta-boton{justify-self:center}
  .cfp-cinta-logo img{height:50px}
}
@media (max-width:560px){
  .cfp-cinta-sep{display:none}
  .cfp-cinta-atencion,.cfp-cinta-dir{display:block}
  .cfp-cinta-logo img{height:auto;width:100%;max-width:320px}
  .cfp-cinta-boton > *{min-width:240px}
}`}</style>
      <div className={'cfp-cinta-grid' + (conLogo ? '' : ' sin-logo')}>
        <div className="cfp-cinta-texto">
          <strong className="cfp-cinta-titulo">
            {titulo2 ? <>{titulo1} <span style={{whiteSpace:'nowrap'}}>{titulo2}</span></> : titulo}
          </strong>
          <div className="cfp-cinta-detalle">
            <a href={urlMapa} target="_blank" rel="noopener">
              <span className="cfp-cinta-atencion">{atencion}</span>
              {direccion && <><span className="cfp-cinta-sep" aria-hidden="true">{blanca ? '|' : '·'}</span>
              <span className="cfp-cinta-dir">{direccion.replace(/Dock\s+Sud/g, '').trim()} <span style={{whiteSpace:'nowrap'}}>Dock Sud</span></span></>}
            </a>
          </div>
        </div>
        {conLogo && (
          <div className="cfp-cinta-logo">
            <img src={logo} alt="Dirección General de Cultura y Educación · Gobierno de la Provincia de Buenos Aires" {...(logoPropio ? {} : { width: 753, height: 121 })}/>
          </div>
        )}
        <div className="cfp-cinta-boton">
          <Button size="sm" variant={blanca ? 'accent' : 'primary'} onClick={onInscripcion}>Quiero inscribirme</Button>
        </div>
      </div>
    </section>
  );
}

function HomeScreen({onNavigate,onInscripcion,cvConfig}){
  const courses=window.CFP_DATA.courses || [];
  const insc=window.CFP_DATA.inscripciones || {};
  const homeData = window.CFP_DATA.home || {};
  const heroData = homeData.hero || {};
  const cinta = homeData.cintaAmarilla || {};
  const prop = homeData.propuesta || {};
  const tarjetasPropuesta = prop.tarjetas || [
    { icono: 'graduation-cap', titulo: 'Títulos oficiales', descripcion: 'Certificación oficial de la Provincia de Buenos Aires.' },
    { icono: 'wallet', titulo: 'Cursos Gratuitos', descripcion: 'Sin costo de inscripción ni de cursada: solo necesitás la documentación requerida.' },
    { icono: 'wrench', titulo: 'Talleres equipados', descripcion: 'Para prácticas en todos los oficios' }
  ];

  const scrollToOferta = () => {
    const el = document.getElementById('oferta-formativa');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('Cursos');
    }
  };

  const cintaTitulo = cinta.titulo || insc.bannerInicio || 'Inscripciones abiertas a partir del 15 de noviembre';
  const cintaDetalle = cinta.detalle || `${insc.horarioAtencion || 'Lunes a viernes de 9 a 20 hs'} · Juan Pablo Angulo 1272, Dock Sud`;
  const cintaUrlMapa = cinta.urlMapa || MAPS_URL;

  const est = estadisticasSitio();

  const opacidadConfig = (window.CFP_DATA.home?.opacidadTarjetas !== undefined)
    ? (window.CFP_DATA.home.opacidadTarjetas / 100)
    : 0.12;

  return <div>
    <Hero
      overline={heroData.subtitulo || "Es tu tiempo de aprender"}
      title={heroData.titulo || "Estudiá con nosotros"}
      subtitle={heroData.texto || "Cursos presenciales sin costo de inscripción ni de cursada, con certificado de la Dirección General de Cultura y Educación de la Provincia de Buenos Aires."}
      primaryCta={{label:'Ver los cursos', onClick: scrollToOferta}}
      secondaryCta={{label:'Cómo inscribirme', onClick: onInscripcion}}
      assetBase="assets"
      shots={window.CFP_DATA.heroFotos}
      plane={false}
    />
    <VueloAvion assetBase="assets"/>
    {/* Cinta de avisos / inscripciones (amarilla o blanca, con logo de la Provincia; se elige en el panel) */}
    <CintaAvisos cinta={cinta} titulo={cintaTitulo} detalle={cintaDetalle} urlMapa={cintaUrlMapa} onInscripcion={onInscripcion}/>
    <section style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--section-y) var(--gutter)'}}>
      <SectionHeading overline={prop.subtitulo || "Nuestra propuesta"} title={prop.titulo || "Aprendizajes que transforman"} subtitle={parseTextoConNegritas(prop.descripcion || '"FORMARSE ES APOSTAR AL FUTURO"\nPrácticas auténticas en talleres equipados y con docentes profesionales del oficio.\n"ACOMPAÑAMOS CADA PASO DE TU CRECIMIENTO"')} align="center"/>
      <div style={{...GRID_AUTO(260),marginTop:'var(--space-10)'}}>
        {tarjetasPropuesta.map((item, idx) =>
          <Card key={idx} accentBar>
            <Icon name={item.icono || 'award'} size={28} color="var(--brand-primary)"/>
            <h3 style={{fontSize:20,margin:'var(--space-4) 0 var(--space-2)'}}>{item.titulo}</h3>
            <p style={{margin:0,fontSize:15,lineHeight:1.6,color:'var(--text-muted)'}}>{item.descripcion}</p>
          </Card>
        )}
      </div>
    </section>
    <section id="oferta-formativa" style={{background:'var(--surface-subtle)',scrollMarginTop:80}}>
      <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--section-y) var(--gutter)'}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:'var(--space-6)',flexWrap:'wrap'}}>
          <SectionHeading overline="Oferta formativa" title="Áreas de capacitación" subtitle="Conocé todas las familias profesionales y cursos con certificación oficial que podés estudiar de manera gratuita."/>
          <Button variant="secondary" onClick={()=>onNavigate('Cursos')} iconRight={<Icon name="arrow-right" size={18}/>}>{`Ver los ${courses.length} cursos`}</Button>
        </div>
        <div style={{...GRID_AUTO(310),marginTop:'var(--space-8)'}}>
          {AREAS_CAPACITACION.map(area=>
            <div key={area.title} className="area-card-hover" style={{height:'100%'}}>
              <Card accentBar hoverable padding="var(--space-6)" style={{display:'flex',flexDirection:'column',height:'100%',position:'relative',overflow:'hidden',background:'#ffffff'}}>
                {area.imagen && opacidadConfig > 0 && (
                  <div className="area-card-bg" style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${area.imagen})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: opacidadConfig,
                    pointerEvents: 'none'
                  }} />
                )}
                <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',height:'100%'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)',marginBottom:'var(--space-4)'}}>
                    <div style={{width:44,height:44,borderRadius:'var(--radius-md)',background:'var(--surface-brand-soft)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--brand-primary)',flexShrink:0}}>
                      <Icon name={area.icon} size={24} color="var(--brand-primary)"/>
                    </div>
                    <h3 style={{fontFamily:'var(--font-display)',fontSize:17,fontWeight:700,letterSpacing:'-.01em',lineHeight:1.25,color:'var(--text-title)',margin:0}}>{area.title}</h3>
                  </div>
                  <ul style={{listStyle:'none',padding:0,margin:'0 0 var(--space-6)',display:'flex',flexDirection:'column',gap:'var(--space-3)',flex:1}}>
                    {area.courses.map((c,idx)=>{
                      const match = courses.find(item => item.curso.toLowerCase() === c.toLowerCase() || item.curso.toLowerCase().includes(c.toLowerCase()));
                      return (
                        <li key={idx} style={{display:'flex',alignItems:'flex-start',gap:'var(--space-2)',fontSize:14,lineHeight:1.45,color:'var(--text-body)'}}>
                          <span style={{color:'var(--brand-primary)',flexShrink:0,marginTop:2,display:'inline-flex'}}>
                            <Icon name="check" size={16} color="var(--brand-primary)" strokeWidth={2.5}/>
                          </span>
                          <span
                            onClick={() => {
                              if (match) onNavigate('CursoDetalle', match);
                              else onNavigate('Cursos', area.familia);
                            }}
                            style={{fontWeight:700,cursor:'pointer',transition:'color 0.15s ease'}}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-primary)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'inherit'}
                            title="Ver programa completo del curso"
                          >
                            {c}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <div style={{marginTop:'auto',paddingTop:'var(--space-4)',borderTop:'1px solid var(--border-subtle)'}}>
                    <Button size="sm" variant="secondary" fullWidth onClick={()=>onNavigate('Cursos',area.familia)} iconRight={<Icon name="arrow-right" size={16}/>}>CONOCÉ MÁS</Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
    <section id="como-inscribirte" style={{background:'var(--surface-inverse)',color:'#fff',scrollMarginTop:80}}>
      <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--section-y) var(--gutter)',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,320px),1fr))',gap:'var(--space-10)',alignItems:'center'}}>
        <div>
          <SectionHeading invert overline="Cómo inscribirte" title="Acercate a la sede con tu documentación"/>
          <InfoList invert style={{marginTop:'var(--space-6)'}} items={[
            {label:'Fotocopia del DNI', value:''},
            {label:'Constancia de estudios', value:'(según requisitos del curso elegido).'},
            {label:'Horario de atención', value:insc.horarioAtencion || 'Lunes a viernes de 9 a 20 hs.'},
            {label:'Consultas por WhatsApp', value:'11 6105-6018 (solo mensajes)'}
          ]}/>
          <div style={{marginTop:'var(--space-8)',paddingTop:'var(--space-6)',borderTop:'1px solid rgba(255,255,255,.18)'}}>
            <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:13,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--brand-accent)',margin:0}}>Cuándo abren las inscripciones</h3>
            <p style={{margin:'var(--space-3) 0 0',fontSize:17,lineHeight:1.6,color:'var(--blue-100)',maxWidth:520}}>{insc.periodos}</p>
          </div>
          <div style={{marginTop:'var(--space-8)',display:'flex',gap:'var(--space-4)',flexWrap:'wrap'}}>
            <Button variant="accent" size="lg" href={WHATSAPP_URL} target="_blank" rel="noopener" iconLeft={<Icon name="message-circle" size={20}/>}>Pre-Inscripción</Button>
            <Button variant="ghost" size="lg" style={{color:'#fff',borderColor:'rgba(255,255,255,.5)'}} onClick={abrirCampus}>Campus Virtual</Button>
          </div>
        </div>
        <div>
          <SectionHeading invert overline={est.antetitulo} title={est.titulo}/>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'var(--space-4)',marginTop:'var(--space-8)'}}>
            {est.items.map((it, i) => (
              <div key={i} style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.14)',borderTop:'4px solid var(--brand-accent)',borderRadius:'var(--radius-lg)',padding:'clamp(16px,2.2vw,26px)'}}>
                <div style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:'clamp(26px,2.6vw,30px)',lineHeight:1,letterSpacing:'-.02em',color:'#fff',whiteSpace:'nowrap'}}><ValorCifra valor={it.valor}/></div>
                <div style={{marginTop:10,fontSize:15,lineHeight:1.35,color:'var(--blue-100)'}}>{it.etiqueta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>;
}

/* ------------------------------------------------------------------ */

/* ===========================================================================
   PANTALLA DE DETALLE INDIVIDUAL DE CURSO (PÁGINA PROPIA DE CADA CURSO)
   =========================================================================== */
function CourseDetailScreen({ course, onNavigate, onInscripcion }) {
  if (!course) {
    return (
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <h2>Curso no encontrado</h2>
        <p style={{ color: 'var(--neutral-600)', margin: '16px 0 24px' }}>El curso que buscás no está disponible o cambió de denominación.</p>
        <Button variant="primary" onClick={() => onNavigate('Cursos')}>Ver todos los cursos</Button>
      </div>
    );
  }

  const paragraphs = (course.detalles || '').split('\n\n').filter(Boolean);

  return (
    <div style={{ background: '#f8fafc', minHeight: '80vh', padding: '36px 0 80px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 var(--gutter)' }}>
        
        {/* Navegación y badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <button
            onClick={() => onNavigate('Cursos', course.familia)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--brand-primary)',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              minHeight: 36,
              borderRadius: 6,
              margin: '-6px 0 -6px -10px'
            }}
          >
            <Icon name="arrow-left" size={16} /> Volver a Cursos ({course.familia})
          </button>

          <span style={{
            background: 'var(--surface-brand-soft, #e8eefb)',
            color: 'var(--blue-900)',
            fontSize: 12,
            fontWeight: 800,
            padding: '4px 14px',
            borderRadius: 20,
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Familia: {course.familia}
          </span>
        </div>

        {/* Título Principal */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px, 4vw, 38px)',
          fontWeight: 800,
          color: 'var(--text-title)',
          textTransform: 'uppercase',
          lineHeight: 1.18,
          letterSpacing: '-0.02em',
          margin: '0 0 28px'
        }}>
          {course.curso}
        </h1>

        {/* Barra de Datos Clave (Data Bar centrada en PC y celular) */}
        <div className="cfp-course-databar">
          {/* Columna 1: Días y horarios */}
          <div className="cfp-databar-col">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--neutral-600)', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
              <Icon name="clock" size={16} color="var(--brand-primary)" />
              <span>Días y horarios del curso</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-title)', lineHeight: 1.4, textAlign: 'center' }}>
              {course.horarios || 'A confirmar en sede'}
            </div>
          </div>

          {/* Columna 2: Horas totales */}
          <div className="cfp-databar-col cfp-databar-divider">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--neutral-600)', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
              <Icon name="calendar" size={16} color="var(--brand-primary)" />
              <span>Horas totales</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-title)', lineHeight: 1.4, textAlign: 'center' }}>
              {course.horasTotales || course.duracion || 'Consultar en sede'}
            </div>
          </div>

          {/* Columna 3: Requisitos */}
          <div className="cfp-databar-col cfp-databar-divider">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--neutral-600)', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
              <Icon name="file-text" size={16} color="var(--brand-primary)" />
              <span>Requisitos</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-body)', lineHeight: 1.4, textAlign: 'center' }}>
              {course.requisitos || 'Estudios primarios o secundarios'}
            </div>
          </div>

          {/* Columna 4: ¿Cómo Me Anoto? */}
          <div className="cfp-databar-col cfp-databar-divider">
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--blue-900)', textAlign: 'center' }}>
              ¿Cómo Me Anoto?
            </div>
            <Button
              variant="primary"
              size="sm"
              style={{ padding: '9px 22px', maxWidth: 160, width: '100%', justifyContent: 'center', margin: '0 auto' }}
              onClick={onInscripcion}
            >
              Anotarme
            </Button>
          </div>
        </div>

        {/* Sección: Introducción */}
        <div style={{ marginBottom: 32, background: '#ffffff', padding: '28px 32px', borderRadius: 'var(--radius-lg, 12px)', border: '1px solid var(--border-subtle)' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 800,
            color: 'var(--text-title)',
            margin: '0 0 14px'
          }}>
            Introducción
          </h2>
          <p style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: 'var(--neutral-700)',
            margin: 0
          }}>
            {course.introduccion}
          </p>
        </div>

        {/* Sección: Detalles Del Curso */}
        <div style={{ marginBottom: 36, background: '#ffffff', padding: '28px 32px', borderRadius: 'var(--radius-lg, 12px)', border: '1px solid var(--border-subtle)' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 800,
            color: 'var(--text-title)',
            margin: '0 0 16px'
          }}>
            Detalles Del Curso
          </h2>
          <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--neutral-700)' }}>
            {paragraphs.map((p, idx) => (
              <p key={idx} style={{ margin: '0 0 16px', lineHeight: 1.75 }}>
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Callout de Sede y Certificación Oficial */}
        <div style={{
          background: 'linear-gradient(135deg, var(--blue-900, #002878) 0%, var(--blue-700, #003890) 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg, 12px)',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--brand-accent)', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              <Icon name="map-pin" size={16} color="var(--brand-accent)" /> Sede de cursada
            </div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>
              {course.sede || 'Juan Pablo Angulo 1272, Dock Sud'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
              Certificación Oficial DGCyE Provincia de Buenos Aires • 100% Gratuito
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button
              variant="accent"
              size="md"
              onClick={onInscripcion}
              iconRight={<Icon name="arrow-right" size={16} />}
            >
              Cómo Inscribirme
            </Button>
            <Button
              variant="ghost"
              size="md"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
              onClick={() => onNavigate('Cursos', course.familia)}
            >
              Ver más de {course.familia}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function CoursesScreen({onNavigate,onInscripcion,initialFamily='Todas'}){
  const all=window.CFP_DATA.courses || [];
  const insc=window.CFP_DATA.inscripciones || {};
  const cinta = insc.cintaCursos || {
    visible: true,
    tipo: 'cerradas',
    tituloCerradas: insc.estado || 'Inscripciones cerradas por el momento',
    textoCerradas: insc.periodos || 'Hay dos períodos de inscripción por año: de noviembre a febrero para los cursos que comienzan en marzo, y durante junio y julio para los que comienzan en agosto.',
    tituloAbiertas: '¡Inscripciones Abiertas!',
    fechaCierre: '28 de Febrero',
    textoAbiertas: 'Acercate a la sede de Juan Pablo Angulo 1272 para completar tu inscripción.'
  };

  const familias=['Todas',...(window.CFP_DATA.familias||[]).map(f=>f.nombre).filter(f=>all.some(c=>esDeFamilia(c,f)))];
  const [fam,setFam]=React.useState(initialFamily&&familias.includes(initialFamily)?initialFamily:'Todas');
  const [q,setQ]=React.useState('');
  const [view,setView]=React.useState('Tarjetas');

  React.useEffect(()=>{
    if(initialFamily&&familias.includes(initialFamily)){
      setFam(initialFamily);
    }
  },[initialFamily]);

  const rows=all.filter(c=>(fam==='Todas'||esDeFamilia(c,fam))&&c.curso.toLowerCase().includes(q.toLowerCase()));

  return <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--space-12) var(--gutter) var(--section-y)'}}>
    <SectionHeading overline="Oferta formativa" title="Cursos gratuitos con certificación oficial" subtitle="Todos los cursos se dictan en la sede de Juan Pablo Angulo 1272, Dock Sud, salvo donde se indique un anexo."/>

    {/* Cinta de estado de inscripción configurable */}
    {cinta.visible !== false && (
      cinta.tipo === 'abiertas' ? (
        <Callout tone="accent" title={cinta.tituloAbiertas || '¡Inscripciones Abiertas!'} style={{marginTop:'var(--space-8)'}}>
          <span><strong>Inscripciones abiertas hasta el {cinta.fechaCierre || 'cierre de ciclo'}.</strong> {cinta.textoAbiertas || 'Acercate a la sede con tu documentación para asegurar tu vacante.'} </span>
          <a onClick={onInscripcion} style={{cursor:'pointer',fontWeight:700,textDecoration:'underline',marginLeft:6}}>Ver requisitos de inscripción</a>.
        </Callout>
      ) : (
        <Callout tone="info" title={cinta.tituloCerradas || insc.estado || 'Inscripciones cerradas por el momento'} style={{marginTop:'var(--space-8)'}}>
          <span>{cinta.textoCerradas || insc.periodos} </span>
          <a onClick={onInscripcion} style={{cursor:'pointer',fontWeight:600,textDecoration:'underline'}}>Ver cómo inscribirte</a>.
        </Callout>
      )
    )}

    <Callout tone="accent" title="Requisito general" style={{marginTop:'var(--space-4)'}}>{insc.requisitoGeneral}</Callout>

    <div style={{display:'flex',gap:'var(--space-4)',alignItems:'flex-end',marginTop:'var(--space-8)',flexWrap:'wrap'}}>
      <Input label="Buscar curso" placeholder="Soldador, informática…" value={q} onChange={e=>setQ(e.target.value)} style={{flex:'1 1 280px'}}/>
      <Select label="Familia profesional" options={familias} value={fam} onChange={e=>setFam(e.target.value)} style={{flex:'1 1 240px'}}/>
      <div style={{marginLeft:'auto'}}><Tabs items={['Tarjetas','Tabla']} active={view} onChange={setView}/></div>
    </div>
    <div style={{marginTop:'var(--space-8)'}}>
      {view==='Tabla'
        ? <div className="cfp-scroll-x"><CourseTable rows={rows.map(c=>({curso:c.curso,horarios:c.horarios,sede:c.sede,requisitos:c.requisitos,onClick:()=>onNavigate('CursoDetalle',c)}))}/></div>
        : <div style={GRID_AUTO(320)}>
            {rows.map(c=><Card key={c.curso} accentBar hoverable padding="var(--space-6)">
              <div style={{display:'flex',gap:'var(--space-3)',alignItems:'flex-start',flexWrap:'wrap'}}>
                <h3
                  onClick={() => onNavigate('CursoDetalle', c)}
                  style={{fontSize:21,flex:'1 1 220px',lineHeight:1.2,cursor:'pointer',color:'var(--blue-900)'}}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--brand-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--blue-900)'}
                  title="Ver programa del curso"
                >
                  {c.curso}
                </h3>
                <Badge tone="brand">{c.familia}</Badge>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'var(--space-4)',marginTop:'var(--space-4)',fontSize:14,color:'var(--text-body)'}}>
                <span style={{display:'flex',gap:8,alignItems:'flex-start'}}><Icon name="clock" size={16} color="var(--brand-primary)"/>{c.horarios}</span>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'var(--space-4)',marginTop:'var(--space-2)',fontSize:14,color:'var(--text-muted)'}}>
                <span style={{display:'flex',gap:8,alignItems:'flex-start'}}><Icon name="map-pin" size={16} color="var(--brand-primary)"/>{c.sede}</span>
                <span style={{display:'flex',gap:8,alignItems:'flex-start'}}><Icon name="file-check" size={16} color="var(--brand-primary)"/>{c.requisitos}</span>
              </div>
              <div style={{marginTop:'var(--space-5)',display:'flex',gap:'var(--space-3)',alignItems:'center',flexWrap:'wrap'}}>
                <Badge tone="neutral">{c.horasTotales || c.duracion}</Badge>
                <div style={{marginLeft:'auto',display:'flex',gap:8}}>
                  <Button size="sm" variant="primary" onClick={()=>onNavigate('CursoDetalle', c)}>Ver programa</Button>
                </div>
              </div>
            </Card>)}
          </div>}
    </div>
    {rows.length===0&&<p style={{marginTop:'var(--space-8)',color:'var(--text-muted)'}}>No encontramos cursos con ese filtro. Probá con otra familia profesional.</p>}
  </div>;
}

/* ------------------------------------------------------------------ */

const P_NOSOTROS={margin:'0 0 var(--space-5)',fontSize:17,lineHeight:1.7,color:'var(--text-body)',textWrap:'pretty'};
function Foto({src,caption,ratio,style}){
  return <figure style={{margin:0,...style}}>
    <div style={{borderRadius:'var(--radius-lg)',overflow:'hidden',boxShadow:'var(--shadow-md)',background:'var(--neutral-100)'}}>
      <img src={src} alt={caption} loading="lazy" decoding="async" style={{width:'100%',aspectRatio:ratio,objectFit:'cover',display:'block'}}/>
    </div>
    {caption&&<figcaption style={{marginTop:'var(--space-3)',fontSize:13,lineHeight:1.5,color:'var(--text-muted)'}}>{caption}</figcaption>}
  </figure>;
}

function NosotrosScreen({onInscripcion}){
  const nos = window.CFP_DATA.nosotros || {};
  const header = nos.header || {};
  const historia = nos.historia || {};
  const objetivos = nos.objetivos || {};
  const redUocra = nos.redUocra || {};
  // La tarjeta del convenio se puede ocultar desde el panel (por si deja de existir el convenio)
  const mostrarRed = redUocra.visible !== false;
  const est = estadisticasSitio();

  const historiaTexto = historia.cuerpo || '';
  const historiaParas = historiaTexto.split('\n\n').filter(Boolean);
  const midPoint = Math.ceil(historiaParas.length / 2);
  const col1Paras = historiaParas.slice(0, midPoint);
  const col2Paras = historiaParas.slice(midPoint);

  const objetivosTexto = objetivos.cuerpo || '';
  const objetivosParas = objetivosTexto.split('\n\n').filter(Boolean);

  return <div>
    <div style={{position:'relative',background:'var(--brand-primary)'}}>
      <img src="assets/fachada-cfp401.jpg" alt="Fachada del CFP N° 401 en Juan Pablo Angulo 1272, Dock Sud" decoding="async" style={{width:'100%',height:'clamp(220px,32vw,380px)',objectFit:'cover',display:'block',opacity:.92}}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(0,45,98,.92) 0%,rgba(0,45,98,.72) 42%,rgba(0,45,98,0) 78%)'}}/>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center'}}>
        <div style={{maxWidth:'var(--container-max)',width:'100%',margin:'0 auto',padding:'0 var(--gutter)'}}>
          <div style={{maxWidth:560}}>
            <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:12,letterSpacing:'.16em',textTransform:'uppercase',color:'var(--brand-accent)',marginBottom:'var(--space-3)'}}>
              {header.subtitulo || "Nosotros"}
            </div>
            <h1 style={{margin:0,fontSize:'clamp(28px,3.4vw,46px)',lineHeight:1.1,fontWeight:800,letterSpacing:'-.02em',color:'#fff'}}>
              {header.titulo || "Más de cuatro décadas formando en oficios"}
            </h1>
          </div>
        </div>
      </div>
    </div>
    <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--space-12) var(--gutter) var(--section-y)'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,200px),1fr))',gap:'var(--space-6)',marginBottom:'var(--space-16)'}}>
        <StatBlock value={est.anioCreacion} label="Año de creación"/>
        {est.items.slice(0, 2).map((it, i) => <StatBlock key={i} value={it.valor} label={it.etiqueta}/>)}
      </div>
      <SectionHeading
        overline={historia.subtitulo || "Historia institucional"}
        title={historia.titulo || "De la Unidad de Formación Profesional N° 13 al CFP N° 401"}
      />
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))',gap:'var(--space-10)',marginTop:'var(--space-8)',alignItems:'start'}}>
        <div>
          {col1Paras.map((p, i) => <p key={i} style={P_NOSOTROS}>{p}</p>)}
        </div>
        <div>
          {col2Paras.map((p, i) => <p key={i} style={{...P_NOSOTROS, ...(i === col2Paras.length - 1 ? {marginBottom: 0} : {})}}>{p}</p>)}
        </div>
      </div>
      <div style={{display:'grid',gap:'var(--space-6)',marginTop:'var(--space-10)'}}>
        <Foto src="assets/historia-obra-1.jpg" ratio="1280/310" caption="El edificio de J. P. Angulo 1272 al momento de recibirlo, antes de las tareas de reacondicionamiento encaradas por el personal del establecimiento."/>
        <Foto src="assets/historia-obra-2.jpg" ratio="1280/257" caption="Patio y aulas en reconstrucción: los trabajos se completaron en julio de 1987."/>
      </div>
      <div style={{height:1,background:'var(--border-subtle)',margin:'var(--space-16) 0'}}/>
      <SectionHeading
        overline={objetivos.subtitulo || "Objetivos generales del Centro"}
        title={objetivos.titulo || "Formación con título oficial, al servicio del trabajo"}
      />
      <div style={{display:'grid',gridTemplateColumns:mostrarRed ? 'repeat(auto-fit,minmax(min(100%,300px),1fr))' : '1fr',gap:'var(--space-10)',marginTop:'var(--space-8)',alignItems:'start'}}>
        <div style={mostrarRed ? undefined : {maxWidth:820}}>
          {objetivosParas.map((p, i) => <p key={i} style={{...P_NOSOTROS, ...(i === objetivosParas.length - 1 ? {marginBottom: 0} : {})}}>{p}</p>)}
        </div>
        {mostrarRed && <Card accentBar padding="var(--space-8)">
          <Icon name="handshake" size={26} style={{color:'var(--brand-primary)'}}/>
          <h3 style={{margin:'var(--space-4) 0 var(--space-3)',fontFamily:'var(--font-display)',fontSize:20,lineHeight:1.25,fontWeight:700,color:'var(--text-title)'}}>
            {redUocra.titulo || "Red de CFP de Trabajadores de la Construcción"}
          </h3>
          <p style={{...P_NOSOTROS,fontSize:16,marginBottom:0}}>
            {redUocra.cuerpo || "El CFP 401 de Avellaneda forma parte de la Red de Centros de Formación Profesional de Trabajadores de la Construcción, con convenio con la Fundación de Educación y Capacitación de Trabajadores de la Construcción — Centro de Formación Continua, que asiste con los adelantos tecnológicos en equipamiento y actualización docente en forma activa."}
          </p>
        </Card>}
      </div>
      <Callout tone="accent" title="Cursos abiertos a la comunidad" style={{marginTop:'var(--space-16)'}}>
        <p style={{margin:'0 0 var(--space-5)',fontSize:16,lineHeight:1.6}}>Todos nuestros cursos son gratuitos y otorgan título oficial de la Provincia de Buenos Aires.</p>
        <Button variant="accent" onClick={onInscripcion} iconLeft={<Icon name="clipboard-list" size={18}/>}>Cómo inscribirme</Button>
      </Callout>
    </div>
  </div>;
}

/* ------------------------------------------------------------------ */

function ContactScreen(){
  const anexoMapUrl = CT.anexoUrl || 'https://share.google/jpjdJqgyEQzbXONJT';
  return <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--space-12) var(--gutter) var(--section-y)'}}>
    <SectionHeading overline="Contacto" title="Estamos en Dock Sud, Avellaneda" subtitle="Podés escribirnos por WhatsApp o acercarte a la Sede Central en nuestro horario de atención al público."/>

    {/* Tarjeta Superior de Contacto — SIN direcciones de sede ni anexo */}
    <div style={{marginTop:'var(--space-8)'}}>
      <Card padding="var(--space-8)">
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:'var(--space-6)',alignItems:'center'}}>
          <div>
            <h3 style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:700,color:'var(--blue-900)',margin:'0 0 var(--space-4)'}}>Canales de Atención</h3>
            <InfoList items={[
              {label:'Atención al público:',value:<span>{CT.atencion || 'Lunes a viernes de 9 a 20 hs'} <strong style={{color:'var(--brand-primary)',fontSize:13}}>(Exclusivo Sede Central)</strong></span>},
              {label:'Teléfonos:',value:(CT.telefonos||['4222-5418','4222-4217']).map((t,i)=><React.Fragment key={t}>{i>0&&' / '}<a href={'tel:+5411'+t.replace(/\D/g,'')}>{t}</a></React.Fragment>)},
              {label:'WhatsApp:',value:<a href={WHATSAPP_URL} target="_blank" rel="noopener">{CT.whatsapp || '11 6105-6018 (solo mensajes)'}</a>},
              {label:'Campus Virtual:',value:<span><a href={SEMI_URL} target="_blank" rel="noopener">Secundario (CENS N° 453)</a>{' / '}<a href={CAMPUS_URL} target="_blank" rel="noopener">Cursos del CFP</a></span>}
            ]}/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)',justifyContent:'center',alignItems:'flex-start',paddingLeft:'clamp(0px, 2vw, var(--space-6))',borderLeft:'1px solid var(--border-subtle)'}}>
            <p style={{margin:0,fontSize:15,lineHeight:1.6,color:'var(--text-body)'}}>
              Para consultas de cursos, inscripciones y vacantes, escribinos directamente por WhatsApp. Te responderemos a la brevedad.
            </p>
            <div style={{display:'flex',gap:'var(--space-3)',flexWrap:'wrap'}}>
              <Button variant="accent" href={WHATSAPP_URL} target="_blank" rel="noopener" iconLeft={<Icon name="message-circle" size={18}/>}>Escribir por WhatsApp</Button>
              <Button variant="secondary" onClick={abrirCampus} iconLeft={<Icon name="graduation-cap" size={18}/>}>Campus Virtual</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>

    {/* Sección de Sedes e Instalaciones con mapas compartidos uno al lado del otro */}
    <div style={{marginTop:'var(--space-12)'}}>
      <div style={{marginBottom:'var(--space-6)'}}>
        <SectionHeading overline="Sedes e Instalaciones" title="Nuestras Sedes" subtitle="El CFP N° 401 cuenta con dos sedes en Dock Sud. Recordá que la atención al público funciona únicamente en la Sede Central."/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,360px),1fr))',gap:'var(--space-8)',alignItems:'stretch'}}>
        {/* SEDE CENTRAL */}
        <Card accentBar padding="var(--space-6)" style={{display:'flex',flexDirection:'column',height:'100%'}}>
          <div style={{minHeight:150,display:'flex',flexDirection:'column',justifyContent:'flex-start',marginBottom:'var(--space-4)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,marginBottom:'var(--space-3)'}}>
              <div>
                <span style={{display:'inline-block',fontSize:12,fontWeight:700,color:'var(--brand-primary)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Sede Central</span>
                <h3 style={{fontSize:20,fontWeight:700,margin:0,color:'var(--text-title)'}}>Dock Sud (Sede Principal)</h3>
              </div>
              <Badge tone="brand">Atención al Público</Badge>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:8,fontSize:14,color:'var(--text-body)'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
                <Icon name="map-pin" size={17} color="var(--brand-primary)" style={{flexShrink:0,marginTop:2}}/>
                <span style={{fontWeight:600}}>{CT.direccion || 'Juan Pablo Angulo 1272, Dock Sud, Avellaneda'}</span>
              </div>
              <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
                <Icon name="clock" size={17} color="var(--brand-primary)" style={{flexShrink:0,marginTop:2}}/>
                <span>Atención: <strong>{CT.atencion || 'Lunes a viernes de 9 a 20 hs'}</strong></span>
              </div>
            </div>
          </div>

          <div style={{borderRadius:'var(--radius-md)',overflow:'hidden',border:'1px solid var(--border-subtle)',height:260,minHeight:260,background:'var(--neutral-100)'}}>
            <iframe
              title="Mapa Sede Central"
              src="https://maps.google.com/maps?q=Juan+Pablo+Angulo+1272,+Dock+Sud&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{border:0,height:260,display:'block'}}
              loading="lazy"
              allowFullScreen>
            </iframe>
          </div>

          <div style={{marginTop:'var(--space-4)'}}>
            <Button variant="secondary" fullWidth href={MAPS_URL} target="_blank" rel="noopener" iconLeft={<Icon name="external-link" size={16}/>}>
              Abrir Sede Central en Google Maps
            </Button>
          </div>
        </Card>

        {/* ANEXO POLIDEPORTIVO */}
        <Card accentBar padding="var(--space-6)" style={{display:'flex',flexDirection:'column',height:'100%'}}>
          <div style={{minHeight:150,display:'flex',flexDirection:'column',justifyContent:'flex-start',marginBottom:'var(--space-4)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,marginBottom:'var(--space-3)'}}>
              <div>
                <span style={{display:'inline-block',fontSize:12,fontWeight:700,color:'var(--neutral-600)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Anexo</span>
                <h3 style={{fontSize:20,fontWeight:700,margin:0,color:'var(--text-title)'}}>Plaza Renunciamiento</h3>
              </div>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:8,fontSize:14,color:'var(--text-body)'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
                <Icon name="map-pin" size={17} color="var(--brand-primary)" style={{flexShrink:0,marginTop:2}}/>
                <span style={{fontWeight:600}}>{CT.anexo || 'Polideportivo Plaza Renunciamiento — Irala y Argentino Valle'}</span>
              </div>
              <div style={{padding:'6px 10px',background:'#fffbeb',border:'1px solid #fef08a',borderRadius:8,fontSize:12.5,color:'#854d0e',lineHeight:1.35}}>
                ℹ️ <strong>Sin atención al público:</strong> Clases prácticas. Trámites en Sede Central.
              </div>
            </div>
          </div>

          <div style={{borderRadius:'var(--radius-md)',overflow:'hidden',border:'1px solid var(--border-subtle)',height:260,minHeight:260,background:'var(--neutral-100)'}}>
            <iframe
              title="Mapa Anexo Plaza Renunciamiento"
              src="https://maps.google.com/maps?q=Club+Social+y+Deportivo+Plaza+del+Renunciamiento,+Dock+Sud&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{border:0,height:260,display:'block'}}
              loading="lazy"
              allowFullScreen>
            </iframe>
          </div>

          <div style={{marginTop:'var(--space-4)'}}>
            <Button variant="secondary" fullWidth href={anexoMapUrl} target="_blank" rel="noopener" iconLeft={<Icon name="external-link" size={16}/>}>
              Abrir Anexo en Google Maps
            </Button>
          </div>
        </Card>
      </div>

      {/* Listado de colectivos que llegan a la institución */}
      <div style={{marginTop:'var(--space-8)'}}>
        <Card padding="var(--space-6)" style={{background:'var(--surface-brand-soft, #e8eefb)',border:'1px solid var(--border-subtle)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <Icon name="bus" size={22} color="var(--brand-primary)"/>
            <h4 style={{margin:0,fontFamily:'var(--font-display)',fontSize:17,fontWeight:700,color:'var(--blue-900)'}}>
              Líneas de colectivo que llegan a la institución
            </h4>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'10px 24px'}}>
            <div style={{display:'flex',alignItems:'baseline',gap:8,fontSize:14,color:'var(--text-body)'}}>
              <strong style={{color:'var(--brand-primary)',fontSize:15,whiteSpace:'nowrap'}}>• Línea 33</strong>
              <span>(desde Ciudad Universitaria, Retiro, Plaza de Mayo y Lanús)</span>
            </div>
            <div style={{display:'flex',alignItems:'baseline',gap:8,fontSize:14,color:'var(--text-body)'}}>
              <strong style={{color:'var(--brand-primary)',fontSize:15,whiteSpace:'nowrap'}}>• Línea 134</strong>
              <span>(desde Villa Devoto, Flores y Barracas)</span>
            </div>
            <div style={{display:'flex',alignItems:'baseline',gap:8,fontSize:14,color:'var(--text-body)'}}>
              <strong style={{color:'var(--brand-primary)',fontSize:15,whiteSpace:'nowrap'}}>• Línea 159</strong>
              <span>(desde Correo Central, Quilmes y Berazategui)</span>
            </div>
            <div style={{display:'flex',alignItems:'baseline',gap:8,fontSize:14,color:'var(--text-body)'}}>
              <strong style={{color:'var(--brand-primary)',fontSize:15,whiteSpace:'nowrap'}}>• Línea 373</strong>
              <span>(desde Lanús e Isla Maciel)</span>
            </div>
            <div style={{display:'flex',alignItems:'baseline',gap:8,fontSize:14,color:'var(--text-body)'}}>
              <strong style={{color:'var(--brand-primary)',fontSize:15,whiteSpace:'nowrap'}}>• Línea 570</strong>
              <span>(recorrido local de Avellaneda)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <figure style={{margin:'var(--space-12) 0 0'}}>
      <img src="assets/fachada-cfp401.jpg" alt="Fachada de la sede de J. P. Angulo 1272, Dock Sud" loading="lazy" decoding="async" style={{width:'100%',aspectRatio:'2048/480',objectFit:'cover',display:'block',borderRadius:'var(--radius-lg)',boxShadow:'var(--shadow-md)'}}/>
      <figcaption style={{marginTop:'var(--space-3)',fontSize:13,color:'var(--text-muted)'}}>La sede de Juan Pablo Angulo 1272, Dock Sud, Avellaneda.</figcaption>
    </figure>
  </div>;
}

/* ------------------------------------------------------------------ */

/* ===========================================================================
   MARBOT — asistente de consultas del sitio
   ---------------------------------------------------------------------------
   Responde con los datos de data.js. NO usa ningún servicio de IA: no hay
   clave de API, no hay costo por consulta y no puede inventar un horario,
   porque sólo sabe leer lo que está cargado.

   Cuando no encuentra la respuesta lo dice y deriva a WhatsApp. Esa es la
   regla principal: antes que arriesgar un dato, pasa la consulta a una
   persona.

   Para que aprenda algo nuevo no hay que tocar este archivo: alcanza con
   cargarlo en data.js.
   =========================================================================== */

const mbNorm = t => (t || '').toLowerCase().normalize('NFD')
  .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ').trim();

const MB_WSP = n => getWhatsAppUrl(n);

/* Raíz de la palabra: la gente escribe "soldadura" y el curso se llama
   "Soldador". Recortar a cinco letras hace que una cosa encuentre a la otra
   sin necesidad de un diccionario. */
const mbRaiz = t => t.length >= 6 ? t.slice(0, 5) : t;

/* Busca cursos puntuando coincidencias sobre todos los campos de la ficha. */
function mbBuscar(q) {
  const toks = mbNorm(q).split(' ').filter(t => t.length >= 4);
  if (!toks.length) return [];
  return window.CFP_DATA.courses
    .map(c => {
      const texto = mbNorm([c.curso, c.familia, (c.tambien || []).join(' '),
        c.requisitos, c.horarios, c.duracion, c.introduccion || '', c.detalles || ''].join(' '));
      const enTitulo = mbNorm(c.curso);
      let p = 0;
      toks.forEach(k => {
        const r = mbRaiz(k);
        if (texto.includes(k)) p += 2; else if (texto.includes(r)) p += 1;
        if (enTitulo.includes(k)) p += 3; else if (enTitulo.includes(r)) p += 2;
      });
      return { c, p };
    })
    .filter(x => x.p > 0).sort((a, b) => b.p - a.p).map(x => x.c);
}

const mbTiene = (q, claves) => { const n = mbNorm(q); return claves.some(k => n.includes(k)); };

/* Cada intención devuelve { texto, cursos, acciones }. */
function mbResponder(q, ir) {
  const D = window.CFP_DATA;
  const ct = D.contacto || {};
  const insc = D.inscripciones || {};
  const wsp = { label: 'Escribir por WhatsApp', href: MB_WSP('Hola! Tengo una consulta sobre los cursos.') };

  if (mbTiene(q, ['hola', 'buenas', 'buen dia', 'buenas tardes', 'buenas noches', 'que tal']))
    return { texto: '¡Hola! Soy Marbot 🤖 Puedo contarte sobre los cursos, los horarios, cómo inscribirte y dónde estamos. ¿Qué necesitás?' };

  if (mbTiene(q, ['gracias', 'muchas gracias', 'genial', 'buenisimo', 'perfecto']))
    return { texto: '¡De nada! Si te queda alguna duda, acá estoy.' };

  if (mbTiene(q, ['contenido', 'temario', 'que se ve', 'que se aprende', 'plan de estudio', 'materias', 'programa'])) {
    const hall = mbBuscar(q);
    if (hall.length) {
      return {
        texto: `Cada curso cuenta con su propia página oficial con el programa y contenidos detallados. Acá tenés los cursos relacionados con tu consulta:`,
        cursos: hall.slice(0, 4)
      };
    }
    return {
      texto: 'Cada curso tiene ahora su propia página individual con el programa oficial, objetivos y contenidos detallados. Podés ver todos los programas en la sección de Cursos o consultarnos por WhatsApp:',
      acciones: [{ label: 'Ver todos los cursos', onClick: () => ir('Cursos') }, wsp]
    };
  }

  if (mbTiene(q, ['inscrib', 'anotar', 'matricul', 'documenta', 'requisito', 'que necesito', 'papeles']))
    return {
      texto: `Para inscribirte tenés que acercarte a la sede con fotocopia del DNI y la constancia de estudios que pida el curso. Atendemos ${(ct.atencion || '').toLowerCase()}.\n\n${insc.periodos || ''}`,
      acciones: [{ label: 'Ver cómo inscribirme', onClick: () => ir('Inscripción') }, wsp]
    };

  if (mbTiene(q, ['cuando abre', 'cuando empiez', 'fecha', 'periodo', 'inicio', 'comienza', 'arranca']))
    return { texto: insc.periodos || 'Consultá las fechas en la sede.', acciones: [{ label: 'Ver los cursos', onClick: () => ir('Cursos') }] };

  if (mbTiene(q, ['feriado', 'receso', 'vacaciones', 'sin clases', 'hay clases', 'efemeride', 'fecha patria', 'dia del maestro', 'invierno'])) {
    const info = getEventoParaFecha();
    if (info && info.esHoy && info.evento) {
      return {
        texto: `Hoy (${info.evento.fechaStr}) es: ${info.evento.titulo}.\n${info.evento.descripcion}\n${info.evento.sinClases ? '⚠️ Importante: Hoy no se dictan clases en el CFP.' : 'Hoy se cursa habitualmente.'}`,
        acciones: [{ label: `Ver calendario ${ANIO_ACTUAL} completo`, onClick: () => ir({ page: 'Agenda2026' }) }, wsp]
      };
    } else if (info && info.evento) {
      return {
        texto: `El próximo feriado / efeméride es el ${info.evento.fechaStr}: ${info.evento.titulo} (faltan ${info.diasFaltan} días).\n${info.evento.descripcion}\n${info.evento.sinClases ? 'Ese día no habrá dictado de clases en el CFP.' : 'Se cursa habitualmente.'}`,
        acciones: [{ label: `Ver calendario ${ANIO_ACTUAL} completo`, onClick: () => ir({ page: 'Agenda2026' }) }, wsp]
      };
    }
  }

  if (mbTiene(q, ['donde', 'direccion', 'ubica', 'llego', 'queda', 'sede', 'anexo', 'mapa']))
    return {
      texto: `Estamos en ${ct.direccion || 'Dock Sud, Avellaneda'}.${ct.anexo ? `\nTambién funciona el anexo en ${ct.anexo}.` : ''}\nAtención: ${ct.atencion || ''}`,
      acciones: [{ label: 'Ver en el mapa', href: MAPS_URL }, { label: 'Ir a Contacto', onClick: () => ir('Contacto') }]
    };

  if (mbTiene(q, ['telefono', 'llamar', 'contacto', 'whatsapp', 'comunic', 'numero', 'mail', 'correo'])) {
    const tels = ct.telefonos || [];
    const tel = tels.length ? `Teléfonos: ${tels.join(' / ')}\n` : '';
    /* En el celular conviene que el número se pueda tocar para llamar. */
    const llamar = tels.map(t => ({ label: `Llamar ${t}`, href: 'tel:+5411' + t.replace(/\D/g, '') }));
    return {
      texto: `${tel}WhatsApp: ${ct.whatsapp || '11 6105-6018'}\nAtención: ${ct.atencion || ''}`,
      acciones: [...llamar, wsp, { label: 'Ir a Contacto', onClick: () => ir('Contacto') }]
    };
  }

  if (mbTiene(q, ['gratis', 'gratuito', 'cuesta', 'precio', 'arancel', 'pagar', 'cuota', 'costo']))
    return { texto: 'Todos los cursos son gratuitos: no se paga inscripción ni cursada. Sólo tenés que presentar la documentación que pide cada curso.' };

  if (mbTiene(q, ['certificado', 'titulo', 'oficial', 'sirve para trabajar', 'matricula']))
    return { texto: 'Sí: los cursos otorgan certificación oficial de la Dirección General de Cultura y Educación de la Provincia de Buenos Aires. Varios además son aptos para matrícula.' };

  if (mbTiene(q, ['campus', 'campus virtual', 'aula virtual', 'moodle', 'plataforma', 'semipresencial', 'cens', 'secundario para adultos'])) {
    const cv = window.CFP_DATA.campusVirtual || {};
    const semi = { label: 'Campus del Secundario (CENS N° 453)', href: SEMI_URL };
    if (cv.activo === false) {
      return { texto: 'El campus del Secundario para Adultos está disponible. ' + (cv.mensajeModal || 'El campus de los cursos del CFP se encuentra en mantenimiento.'), acciones: [semi] };
    }
    return { texto: '¿Sos alumno del Secundario para Adultos o de un curso del CFP? Te dejo los dos accesos:', acciones: [semi, { label: 'Campus de los cursos del CFP', href: cv.url || CAMPUS_URL }] };
  }

  if (mbTiene(q, ['horario de atencion', 'atienden', 'abren', 'cierran', 'atencion']))
    return { texto: `Atendemos ${(ct.atencion || '').toLowerCase()} en ${ct.direccion || 'la sede'}.` };

  if (mbTiene(q, ['que cursos', 'cuales cursos', 'oferta', 'listado', 'todos los cursos', 'carreras', 'lista']))
    return {
      texto: `Hay ${D.courses.length} cursos repartidos en ${(D.familias || []).length} familias profesionales: ${(D.familias || []).map(f => f.nombre).join(', ')}. Decime cuál te interesa y te paso los horarios.`,
      acciones: [{ label: 'Ver los cursos', onClick: () => ir('Cursos') }]
    };

  /* Búsqueda por familia */
  const fam = (D.familias || []).find(f => mbNorm(q).includes(mbNorm(f.nombre)));
  if (fam) {
    const cs = D.courses.filter(c => c.familia === fam.nombre || (c.tambien || []).includes(fam.nombre));
    return { texto: `En ${fam.nombre} tenemos ${cs.length} ${cs.length === 1 ? 'curso' : 'cursos'}:`, cursos: cs };
  }

  /* Búsqueda por turno */
  const turno = ['mañana', 'manana', 'tarde', 'noche'].find(t => mbNorm(q).includes(mbNorm(t)));
  if (turno && mbTiene(q, ['turno', 'horario', 'curso', 'clases', 'hay algo'])) {
    const clave = mbNorm(turno) === 'manana' ? 'manana' : mbNorm(turno);
    const cs = D.courses.filter(c => mbNorm(c.horarios).includes(clave));
    if (cs.length) return { texto: `Estos se dictan en el turno ${turno}:`, cursos: cs };
  }

  /* Búsqueda libre sobre las fichas */
  const hall = mbBuscar(q);
  if (hall.length) return { texto: hall.length === 1 ? 'Encontré esto:' : `Encontré ${hall.length} cursos que pueden servirte:`, cursos: hall.slice(0, 6) };

  return {
    texto: 'Uf, eso no lo tengo. Para no mandarte cualquier cosa, mejor te paso con alguien de la sede que te lo va a responder bien.',
    acciones: [wsp, { label: 'Ver todos los cursos', onClick: () => ir('Cursos') }]
  };
}

const MB_CHIPS = ['¿Qué cursos hay?', '¿Cómo me inscribo?', '¿Dónde están?', 'Teléfonos', '¿Son gratis?'];

const MB_CSS = `
.mb-lanzador{position:fixed;right:18px;bottom:18px;z-index:60;border:0;background:transparent;
  padding:0;cursor:pointer;width:86px;filter:drop-shadow(0 10px 22px rgba(0,26,88,.35));
  animation:mbFlota 4.2s ease-in-out infinite}
.mb-lanzador img{width:100%;display:block}
.mb-lanzador:hover{transform:scale(1.05)}
@keyframes mbFlota{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.mb-globo{position:fixed;right:104px;bottom:52px;z-index:60;background:#fff;color:var(--blue-900);
  border-radius:var(--radius-lg);padding:10px 14px;font-size:14px;font-weight:600;
  box-shadow:var(--shadow-md);animation:mbEntra .4s ease both}
.mb-panel{position:fixed;right:18px;bottom:18px;z-index:61;width:min(380px,calc(100vw - 36px));
  max-height:min(76vh,620px);display:flex;flex-direction:column;background:var(--surface-card);
  border-radius:var(--radius-lg);overflow:hidden;box-shadow:0 26px 70px rgba(0,14,52,.35);
  animation:mbEntra .28s cubic-bezier(.2,.8,.3,1) both}
@keyframes mbEntra{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}
.mb-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}
.mb-burbuja{max-width:86%;padding:10px 13px;border-radius:14px;font-size:14.5px;line-height:1.5;white-space:pre-line}
.mb-bot{background:var(--surface-subtle);color:var(--text-body);border-bottom-left-radius:4px;align-self:flex-start}
.mb-yo{background:var(--brand-primary);color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
.mb-ficha{border:1px solid var(--border-subtle);border-left:3px solid var(--brand-accent);
  border-radius:var(--radius-md);padding:10px 12px;font-size:13.5px;line-height:1.45;background:var(--surface-card)}
.mb-ficha b{display:block;color:var(--text-title);font-size:14.5px;margin-bottom:4px}
.mb-ficha span{display:block;color:var(--text-muted)}
.mb-chip{border:1px solid var(--border-brand);background:transparent;color:var(--brand-primary);
  border-radius:999px;padding:7px 13px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
.mb-chip:hover{background:var(--surface-brand-soft)}
@media (max-width:760px){
  .mb-lanzador{width:60px!important;right:12px!important;bottom:14px!important}
  .mb-globo{right:76px!important;bottom:24px!important;font-size:12px!important;padding:6px 10px!important}
  .mb-panel{right:10px!important;bottom:10px!important;width:calc(100vw - 20px)!important;max-height:80vh!important}
}
@media (prefers-reduced-motion:reduce){.mb-lanzador,.mb-panel,.mb-globo{animation:none!important}}
`;

function Marbot({ onNavegar }) {
  const [abierto, setAbierto] = React.useState(false);
  const [globo, setGlobo] = React.useState(false);
  const [texto, setTexto] = React.useState('');
  const saludoInicial = window.CFP_DATA.marbot?.saludo || '¡Hola! Soy Marbot 🤖 Estoy para ayudarte con los cursos, los horarios, la inscripción y cómo llegar. Preguntame lo que quieras.';
  const [msgs, setMsgs] = React.useState([{
    de: 'bot',
    texto: saludoInicial
  }]);
  const fin = React.useRef(null);

  React.useEffect(() => {
    const t = setTimeout(() => setGlobo(true), 3500);
    const t2 = setTimeout(() => setGlobo(false), 11000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);
  React.useEffect(() => { if (fin.current) fin.current.scrollIntoView({ block: 'end' }); }, [msgs, abierto]);

  const ir = p => {
    setAbierto(false);
    if (typeof p === 'object' && p.page === 'CursoDetalle') {
      onNavegar('CursoDetalle', p.course);
    } else if (typeof p === 'object' && p.page === 'Agenda2026') {
      onNavegar('Agenda2026');
    } else {
      onNavegar(p);
    }
  };

  const enviar = q => {
    const pregunta = (q || '').trim();
    if (!pregunta) return;
    setTexto('');
    setMsgs(m => [...m, { de: 'yo', texto: pregunta }]);
    setTimeout(() => setMsgs(m => [...m, { de: 'bot', ...mbResponder(pregunta, ir) }]), 260);
  };

  if (!abierto) return <React.Fragment>
    <style>{MB_CSS}</style>
    {globo && <div className="mb-globo" onClick={() => { setGlobo(false); setAbierto(true); }}
      style={{ cursor: 'pointer' }}>¿Te doy una mano? 👋</div>}
    <button className="mb-lanzador" onClick={() => { setGlobo(false); setAbierto(true); }}
      aria-label="Abrir el asistente Marbot">
      <img src="assets/marbot.png" alt="" />
    </button>
  </React.Fragment>;

  return <React.Fragment>
    <style>{MB_CSS}</style>
    <div className="mb-panel" role="dialog" aria-label="Asistente Marbot">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--surface-inverse)', color: '#fff' }}>
        <img src="assets/marbot-piensa.png" alt="" style={{ width: 38, display: 'block' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Marbot</div>
          <div style={{ fontSize: 12, color: 'var(--blue-100)' }}>Asistente del CFP N° 401</div>
        </div>
        <button onClick={() => setAbierto(false)} aria-label="Cerrar"
          style={{ background: 'transparent', border: 0, color: '#fff', fontSize: 24, lineHeight: 1, cursor: 'pointer', padding: 4 }}>×</button>
      </div>

      <div className="mb-msgs">
        {msgs.map((m, i) => <React.Fragment key={i}>
          <div className={'mb-burbuja ' + (m.de === 'bot' ? 'mb-bot' : 'mb-yo')}>{m.texto}</div>
          {(m.cursos || []).map(c => <div
            className="mb-ficha"
            key={c.curso}
            onClick={() => ir({ page: 'CursoDetalle', course: c })}
            style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
            title="Ver programa y contenidos del curso"
          >
            <b>{c.curso}</b>
            <span>🕒 {c.horarios}</span>
            <span>📋 {c.requisitos}</span>
            <span>📅 {c.duracion}</span>
            {c.slug && (
              <span style={{ color: 'var(--brand-primary)', fontWeight: 600, marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Ver programa completo →
              </span>
            )}
          </div>)}
          {(m.acciones || []).length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {m.acciones.map((a, j) => a.href
              ? <a className="mb-chip" key={j} href={a.href} target="_blank" rel="noopener"
                style={{ textDecoration: 'none', display: 'inline-block' }}>{a.label}</a>
              : <button className="mb-chip" key={j} onClick={a.onClick}>{a.label}</button>)}
          </div>}
        </React.Fragment>)}
        <div ref={fin} />
      </div>

      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8 }}>
          {MB_CHIPS.map(c => <button className="mb-chip" key={c} onClick={() => enviar(c)}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{c}</button>)}
        </div>
        <form onSubmit={e => { e.preventDefault(); enviar(texto); }} style={{ display: 'flex', gap: 8 }}>
          <input value={texto} onChange={e => setTexto(e.target.value)}
            placeholder="Escribí tu consulta…" aria-label="Tu consulta"
            style={{
              flex: 1, border: '1px solid var(--border-subtle)', borderRadius: 999,
              padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none',
              color: 'var(--text-body)', background: 'var(--surface-page)'
            }} />
          <button type="submit" aria-label="Enviar" style={{
            border: 0, borderRadius: '50%', width: 40, height: 40, flexShrink: 0,
            background: 'var(--brand-primary)', color: '#fff', cursor: 'pointer', fontSize: 17
          }}>➤</button>
        </form>
      </div>
    </div>
  </React.Fragment>;
}

/* ===========================================================================
   AGENDA — EFEMÉRIDES, FECHAS PATRIAS Y FERIADOS DE FORMACIÓN PROFESIONAL
   (La fuente oficial es data.js, editable desde el panel de administración)
   =========================================================================== */
const EFEMERIDES_LISTA_DEFAULT = [];

function getEventoParaFecha(fecha = new Date()) {
  const efemerides = (window.CFP_DATA && Array.isArray(window.CFP_DATA.efemerides) && window.CFP_DATA.efemerides.length > 0)
    ? window.CFP_DATA.efemerides
    : EFEMERIDES_LISTA_DEFAULT;
  let f = fecha;
  try {
    const params = new URLSearchParams(window.location.search);
    const sim = params.get('fecha');
    if (sim) {
      const parts = sim.split('-');
      if (parts.length === 3) {
        f = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      }
    }
  } catch (e) {}

  const d = f.getDate();
  const m = f.getMonth() + 1;
  const y = f.getFullYear();

  const hoyMatch = efemerides.find(e => {
    if (e.esRango) return m === e.mesInicio && d >= e.diaInicio && d <= e.diaFin;
    return e.dia === d && e.mes === m;
  });

  if (hoyMatch) {
    return { esHoy: true, evento: hoyMatch, fechaObj: f };
  }

  const tHoy = new Date(y, m - 1, d, 0, 0, 0).getTime();
  let prox = null, min = Infinity;
  efemerides.forEach(e => {
    const ed = e.esRango ? e.diaInicio : e.dia;
    const em = e.esRango ? e.mesInicio : e.mes;
    const t = new Date(y, em - 1, ed, 0, 0, 0).getTime();
    const diff = t - tHoy;
    if (diff > 0 && diff < min) {
      min = diff;
      prox = e;
    }
  });

  if (!prox && efemerides.length > 0) {
    prox = efemerides[0];
  }

  return {
    esHoy: false,
    evento: prox,
    diasFaltan: prox ? Math.ceil(min / 86400000) : null,
    fechaObj: f
  };
}

function CintaCelesteEfemerides({ onVerAgenda, onCerrar }) {
  const info = getEventoParaFecha();
  if (!info || !info.evento) return null;

  const { esHoy, evento, diasFaltan } = info;

  return (
    <aside
      aria-label="Aviso de efemérides y feriados"
      className="cfp-cinta-efemerides"
    >
      <div className="cfp-cinta-inner">
        {/* Contenido izquierdo / central */}
        <div className="cfp-cinta-left">
          <div className="cfp-cinta-line1">
            {esHoy ? (
              <span className="cfp-cinta-badge" style={{
                background: evento.sinClases ? '#fee2e2' : '#dbeafe',
                color: evento.sinClases ? '#b91c1c' : '#1d4ed8',
                border: evento.sinClases ? '1px solid #fca5a5' : '1px solid #bfdbfe',
              }}>
                {evento.sinClases ? '⛔ HOY · SIN CLASES' : (evento.tipo === 'fecha_patria' ? '🇦🇷 HOY' : 'HOY')}
              </span>
            ) : (
              <span className="cfp-cinta-badge" style={{
                background: '#dbeafe',
                color: '#0369a1',
                border: '1px solid #bfdbfe',
              }}>
                <span className="cfp-cinta-badge-full">PRÓXIMO FERIADO / EFEMÉRIDE ({evento.fechaStr})</span>
                <span className="cfp-cinta-badge-short">{evento.fechaStr}</span>
              </span>
            )}

            <strong className="cfp-cinta-title">
              {esHoy ? `Hoy ${evento.fechaStr}: ${evento.titulo}` : evento.titulo}
            </strong>
          </div>

          <div className="cfp-cinta-line2">
            {esHoy ? `— ${evento.descripcion}` : `(${diasFaltan === 1 ? 'mañana' : `faltan ${diasFaltan} días`})${evento.sinClases ? ' · No se dictan clases en FP' : ''}`}
          </div>
        </div>

        {/* Acciones derechas */}
        <div className="cfp-cinta-actions">
          <button
            onClick={onVerAgenda}
            className="cfp-cinta-btn-cal"
          >
            <span className="cfp-cinta-cal-full">📅 Calendario {ANIO_ACTUAL}</span>
            <span className="cfp-cinta-cal-short">📅 {ANIO_ACTUAL}</span>
          </button>

          <button
            onClick={onCerrar}
            aria-label="Cerrar aviso de efemérides"
            title="Cerrar aviso"
            className="cfp-cinta-btn-close"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
}

function AgendaEfemeridesModal({ onClose }) {
  const efemerides = (window.CFP_DATA && window.CFP_DATA.efemerides) || EFEMERIDES_LISTA_DEFAULT;
  const [filtro, setFiltro] = React.useState('todos');
  const infoHoy = getEventoParaFecha();

  const filtrados = efemerides.filter(e => {
    if (filtro === 'sin_clases') return e.sinClases;
    if (filtro === 'patrias') return e.tipo === 'fecha_patria';
    if (filtro === 'fp') return e.tipo === 'efemeride';
    return true;
  });

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Agenda ${ANIO_ACTUAL} — Efemérides, Fechas Patrias y Feriados de FP`}
      footer={<Button variant="primary" onClick={onClose}>Entendido</Button>}
    >
      <div style={{ padding: '4px 0 12px' }}>
        <p style={{ margin: '0 0 16px', fontSize: 13.5, color: 'var(--neutral-600)', lineHeight: 1.5 }}>
          Calendario oficial de conmemoraciones patrias, feriados nacionales y días sin actividad áulica en los Centros de Formación Profesional de la Provincia de Buenos Aires (Ciclo Lectivo {ANIO_ACTUAL}).
        </p>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {[
            { id: 'todos', label: `Todas (${efemerides.length})` },
            { id: 'sin_clases', label: '⛔ Feriados y Sin Clases' },
            { id: 'patrias', label: '🇦🇷 Fechas Patrias' },
            { id: 'fp', label: '🎓 Efemérides y Oficios' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: filtro === f.id ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                background: filtro === f.id ? 'var(--brand-primary)' : '#ffffff',
                color: filtro === f.id ? '#ffffff' : 'var(--neutral-700)',
                transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista de fechas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
          {filtrados.map(e => {
            const esEsteHoy = infoHoy.esHoy && infoHoy.evento && (
              e.esRango ? infoHoy.evento.fechaStr === e.fechaStr : (infoHoy.evento.dia === e.dia && infoHoy.evento.mes === e.mes)
            );

            return (
              <div
                key={e.fechaStr + e.titulo}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: esEsteHoy ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  background: esEsteHoy ? '#eff6ff' : '#ffffff',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: 64,
                    padding: '4px 6px',
                    borderRadius: 6,
                    background: esEsteHoy ? 'var(--brand-primary)' : 'var(--surface-brand-soft, #e8eefb)',
                    color: esEsteHoy ? '#fff' : 'var(--blue-900)',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 12,
                    flexShrink: 0
                  }}>
                    {e.fechaStr}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: 13.5, color: 'var(--text-title)' }}>{e.titulo}</strong>
                      {esEsteHoy && (
                        <span style={{ fontSize: 10, background: '#10b981', color: '#fff', padding: '1px 6px', borderRadius: 99, fontWeight: 800 }}>
                          ⭐ HOY
                        </span>
                      )}
                      {e.sinClases && (
                        <span style={{ fontSize: 11, background: '#fee2e2', color: '#b91c1c', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                          Sin clases
                        </span>
                      )}
                      {e.tipo === 'fecha_patria' && (
                        <span style={{ fontSize: 11, background: '#e0f2fe', color: '#0369a1', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                          Fecha Patria
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: 12.5, color: 'var(--neutral-600)', lineHeight: 1.4 }}>
                      {e.descripcion}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

function findCourseBySlug(slug) {
  if (!slug) return null;
  const courses = window.CFP_DATA.courses || [];
  const clean = slug.toLowerCase().trim();
  return courses.find(c => 
    (c.slug && c.slug.toLowerCase() === clean) || 
    (c.curso && c.curso.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === clean)
  ) || null;
}

/* =========================================================================
   SISTEMA DE PROMOCIONES Y GENERADOR DE FLYERS
   ========================================================================= */

/* Las plantillas de los flyers (FlyerCursoV1, PromoCursoV2, InscripcionesV1, RenderPromoFlyer y el
   catálogo con sus textos) viven en fuente-jsx/plantillas-promo.jsx, compartidas con el panel. */

/* Componente Pop-up de Promociones en el Home con rotación aleatoria */
function PromoPopUp({ onNavigate }) {
  const datos = window.CFP_DATA || {};
  const promociones = datos.promociones || [];
  const cursos = datos.courses || [];
  const activePromos = promociones.filter(p => {
    const reglas = window.CFPReglas;
    if (reglas && (!reglas.popupVigente(p) || reglas.promoDesactualizada(p, cursos))) return false;
    if (p.modelo === 'ultimos-cupos-v1') {
      const curso = cursos.find(c => c.slug === p.cursoSlug);
      return Boolean(reglas && reglas.puedePublicarUltimosCupos(curso));
    }
    return Boolean(p.popupActivo);
  });

  const [promoActual, setPromoActual] = React.useState(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (activePromos.length === 0) return;

    let forzar = false;
    let promoSolicitada = null;
    try {
      const params = new URLSearchParams(window.location.search);
      const val = params.get('promo') || params.get('popup');
      if (val !== null) {
        forzar = true;
        if (val !== '' && val !== '1' && val !== 'true') {
          promoSolicitada = val;
        }
      }
    } catch (e) {}

    // Frecuencia: 24 horas por usuario (a menos que se fuerce con ?promo=1)
    if (!forzar) {
      try {
        const lastSeen = localStorage.getItem('cfp401_promo_last_seen');
        if (lastSeen) {
          const diff = Date.now() - parseInt(lastSeen, 10);
          if (diff < 86400000) return;
        }
      } catch (e) {}
    }

    // Selección de la promoción
    let seleccionada = activePromos[0];
    if (promoSolicitada) {
      const match = activePromos.find(p => p.id === promoSolicitada || p.cursoSlug === promoSolicitada);
      if (match) seleccionada = match;
    } else if (activePromos.length > 1) {
      // Rotación aleatoria entre las promociones activas
      let lastId = null;
      try {
        lastId = sessionStorage.getItem('cfp401_last_promo_id');
      } catch (e) {}

      const pool = (lastId && activePromos.length > 1)
        ? activePromos.filter(p => p.id !== lastId)
        : activePromos;
      const candidatas = pool.length > 0 ? pool : activePromos;
      const idx = Math.floor(Math.random() * candidatas.length);
      seleccionada = candidatas[idx];
    }

    setPromoActual(seleccionada);

    // Retardo de 800ms antes de desplegar (§9 del plan)
    const timer = setTimeout(() => {
      setVisible(true);
      try {
        sessionStorage.setItem('cfp401_last_promo_id', seleccionada.id);
      } catch (e) {}
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    try {
      localStorage.setItem('cfp401_promo_last_seen', Date.now().toString());
    } catch (e) {}
  };

  React.useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  if (!visible || !promoActual) return null;

  // Las piezas que no son de un curso (inscripciones, captación, fechas patrias, grilla de cursos)
  // llevan a la lista de cursos
  const esInscripciones = promoActual.tipo === 'inscripciones' || !promoActual.cursoSlug;
  const nombrePromo = tituloPromo(promoActual);

  const handleVerCurso = () => {
    handleClose();
    if (!onNavigate) return;
    if (esInscripciones) {
      onNavigate('Cursos');
    } else {
      onNavigate('CursoDetalle', promoActual.cursoSlug);
    }
  };

  const handleWhatsApp = () => {
    handleClose();
    const text = promoActual.tipo === 'inscripciones'
      ? 'Hola, quiero información sobre las inscripciones a los cursos de Formación Profesional.'
      : !promoActual.cursoSlug
        ? 'Hola, quiero información sobre los cursos de Formación Profesional.'
        : `Hola, quiero consultar por información sobre el curso de ${nombrePromo}`;
    const url = `https://wa.me/541161056018?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="cfp-promo-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Promoción: ${nombrePromo}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="cfp-promo-dialog">
        {/* Botón cerrar X accesible */}
        <button
          className="cfp-promo-close-btn"
          onClick={handleClose}
          aria-label="Cerrar aviso de promoción"
          title="Cerrar"
        >
          ✕
        </button>

        {/* Lienzo del Flyer proporcional */}
        {/* Las piezas solo-Stories (Aviso Primaria) van enteras en 9:16, con alto limitado a la pantalla */}
        {formatoParaPromo(promoActual, 'feed') === 'historia' ? (
          <div className="cfp-promo-canvas-wrapper" style={{ flex: 'none', display: 'flex', justifyContent: 'center', background: '#002878' }}>
            <div style={{ height: 'min(calc(100vh - 150px), 680px)', aspectRatio: '1080 / 1920', maxWidth: '100%' }}>
              <RenderPromoFlyer promo={promoActual} formato="historia" />
            </div>
          </div>
        ) : (
          <div className="cfp-promo-canvas-wrapper">
            <RenderPromoFlyer promo={promoActual} formato="feed" />
          </div>
        )}

        {/* Botones de acción inferiores */}
        <div className="cfp-promo-actions">
          <button className="cfp-promo-btn-curso" onClick={handleVerCurso}>
            <span>{esInscripciones ? 'Ver cursos' : 'Ver curso'}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button className="cfp-promo-btn-wsp" onClick={handleWhatsApp}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function App(){
  const [page,setPage]=React.useState('Inicio');
  const [familyFilter,setFamilyFilter]=React.useState('Todas');
  const [selectedCourse, setSelectedCourse] = React.useState(null);
  const [campusModalAbierto, setCampusModalAbierto] = React.useState(false);
  const [selectorCampusAbierto, setSelectorCampusAbierto] = React.useState(false);
  React.useEffect(() => {
    const abrir = () => setSelectorCampusAbierto(true);
    window.addEventListener('cfp:selector-campus', abrir);
    return () => window.removeEventListener('cfp:selector-campus', abrir);
  }, []);
  const [modalAgendaAbierto, setModalAgendaAbierto] = React.useState(false);
  const [cintaCerrada, setCintaCerrada] = React.useState(
    typeof window !== 'undefined' ? sessionStorage.getItem('cfp401_cinta_efemeride_cerrada') === 'true' : false
  );

  const cvConfig = window.CFP_DATA.campusVirtual || { activo: true, modoInactivo: 'modal', url: CAMPUS_URL, mensajeModal: '' };
  const cintaConfig = window.CFP_DATA.cintaEfemerides || { activo: true };

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/curso/')) {
        const slug = decodeURIComponent(hash.replace('#/curso/', ''));
        const found = findCourseBySlug(slug);
        if (found) {
          setSelectedCourse(found);
          setPage('CursoDetalle');
          window.scrollTo(0, 0);
          return;
        }
      } else if (hash === '#/cursos' || hash === '#cursos') {
        setPage('Cursos');
        window.scrollTo(0, 0);
      } else if (hash === '#/nosotros' || hash === '#nosotros') {
        setPage('Nosotros');
        window.scrollTo(0, 0);
      } else if (hash === '#/contacto' || hash === '#contacto') {
        setPage('Contacto');
        window.scrollTo(0, 0);
      } else if (hash === '#/agenda' || hash === '#agenda') {
        setModalAgendaAbierto(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const go=(p,param='Todas')=>{
    if(p==='Inscripción')return goInscripcion();
    if(p==='Agenda2026') {
      setModalAgendaAbierto(true);
      return;
    }
    if(p==='CursoDetalle') {
      const courseObj = (typeof param === 'object' && param !== null) ? param : findCourseBySlug(param);
      if (courseObj) {
        setSelectedCourse(courseObj);
        setPage('CursoDetalle');
        if (courseObj.slug) {
          window.location.hash = '#/curso/' + courseObj.slug;
        }
        window.scrollTo(0,0);
        return;
      }
    }

    if (window.location.hash.startsWith('#/curso/')) {
      try {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      } catch (e) {
        window.location.hash = '';
      }
    }

    setFamilyFilter(typeof param === 'string' ? param : 'Todas');
    setPage(p);
    window.scrollTo(0,0);
  };

  // Todos los CTA de inscripción apuntan a la sección "Cómo inscribirte" del home.
  const goInscripcion=()=>{
    if (window.location.hash.startsWith('#/curso/')) {
      try {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      } catch (e) {
        window.location.hash = '';
      }
    }
    setPage('Inicio');
    setTimeout(()=>{const el=document.getElementById('como-inscribirte');if(el)window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-64,behavior:'smooth'});},80);
  };

  /* Botón del Campus Virtual: siempre abre el selector. Si el campus de los cursos del CFP está inactivo
     (panel: campusVirtual.activo = false), el selector lo avisa en su opción; el del secundario sigue disponible. */
  const navCta = { label: 'Campus Virtual', onClick: abrirCampus };
  const campusFooterLink = { label: 'Campus Virtual', onClick: abrirCampus };
  const abrirCampusCFP = () => {
    setSelectorCampusAbierto(false);
    if (cvConfig.activo === false) {
      if (cvConfig.modoInactivo !== 'ocultar' && cvConfig.modoInactivo !== 'oculto') setCampusModalAbierto(true);
      return;
    }
    window.open(cvConfig.url || CAMPUS_URL, '_blank', 'noopener,noreferrer');
  };

  const instLinks = [
    { label: 'Nosotros', onClick: () => go('Nosotros') },
    { label: 'Contacto', onClick: () => go('Contacto') },
    { label: `Agenda y Feriados ${ANIO_ACTUAL} 📅`, onClick: () => setModalAgendaAbierto(true) }
  ];
  if (campusFooterLink) instLinks.push(campusFooterLink);
  instLinks.push({ label: 'Acceso Administración ⚙️', href: 'admin.html' });

  return <div>
    {cintaConfig.activo !== false && !cintaCerrada && (
      <CintaCelesteEfemerides
        onVerAgenda={() => setModalAgendaAbierto(true)}
        onCerrar={() => {
          setCintaCerrada(true);
          try { sessionStorage.setItem('cfp401_cinta_efemeride_cerrada', 'true'); } catch (e) {}
        }}
      />
    )}
    <SiteNavBar active={page} onNavigate={go} assetBase="assets" cta={navCta}/>
    {page==='Inicio'&&<HomeScreen onNavigate={go} onInscripcion={goInscripcion} cvConfig={cvConfig}/>}
    {page==='Cursos'&&<CoursesScreen initialFamily={familyFilter} onNavigate={go} onInscripcion={goInscripcion}/>}
    {page==='CursoDetalle'&&<CourseDetailScreen course={selectedCourse} onNavigate={go} onInscripcion={goInscripcion}/>}
    {page==='Nosotros'&&<NosotrosScreen onInscripcion={goInscripcion}/>}
    {page==='Contacto'&&<ContactScreen/>}
    <Footer assetBase="assets" address={<><a href={MAPS_URL} target="_blank" rel="noopener" style={{color:'var(--blue-100)',textDecoration:'underline'}}>Juan Pablo Angulo 1272, Dock Sud, Avellaneda</a><br/>Lunes a viernes de 9 a 20 hs<br/>WhatsApp 11 6105-6018</>} columns={[
      {title:'Cursos',links:[{label:'Oferta formativa',onClick:()=>go('Cursos')},{label:'Cómo inscribirme',onClick:goInscripcion}]},
      {title:'Institucional',links:instLinks}
    ]}/>
    {window.CFP_DATA.marbot?.activo !== false && <Marbot onNavegar={go}/>}

    {modalAgendaAbierto && (
      <AgendaEfemeridesModal onClose={() => setModalAgendaAbierto(false)} />
    )}

    {selectorCampusAbierto && (
      <Modal open={true} onClose={() => setSelectorCampusAbierto(false)} title="¿A qué campus querés entrar?"
             footer={<Button variant="secondary" onClick={() => setSelectorCampusAbierto(false)}>Cancelar</Button>}>
        <div style={{ display: 'grid', gap: 12, padding: '4px 0' }}>
          <a href={SEMI_URL} target="_blank" rel="noopener" onClick={() => setSelectorCampusAbierto(false)}
             style={{ display: 'block', padding: '16px 18px', borderRadius: 12, border: '2px solid var(--brand-primary)', textDecoration: 'none', color: 'var(--text-body)' }}>
            <strong style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--brand-primary)' }}>Secundario para Adultos · CENS N° 453</strong>
            <span style={{ fontSize: 15, lineHeight: 1.5 }}>Semipresencial: tus materias, los módulos y las entregas de actividades.</span>
          </a>
          <button type="button" onClick={abrirCampusCFP}
             style={{ display: 'block', width: '100%', textAlign: 'left', padding: '16px 18px', borderRadius: 12, border: '2px solid var(--border-subtle, #cfd6e4)', background: 'transparent', cursor: 'pointer', font: 'inherit', color: 'var(--text-body)' }}>
            <strong style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--brand-primary)' }}>Cursos de Formación Profesional · CFP N° 401</strong>
            <span style={{ fontSize: 15, lineHeight: 1.5 }}>El aula de los cursos del CFP{cvConfig.activo === false ? ' (en mantenimiento)' : ''}.</span>
          </button>
        </div>
      </Modal>
    )}

    {campusModalAbierto && (
      <Modal open={true} onClose={() => setCampusModalAbierto(false)} title="Campus Virtual CFP N° 401"
             footer={<Button variant="primary" onClick={() => setCampusModalAbierto(false)}>Entendido</Button>}>
        <div style={{ textAlign: 'center', padding: '10px 0 6px' }}>
          <img src="assets/logo-campus-horizontal.png" alt="Campus Virtual CFP N° 401" style={{ maxHeight: 72, maxWidth: '85%', margin: '0 auto 16px', display: 'block', objectFit: 'contain' }}/>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--text-body)', margin: 0 }}>
            {cvConfig.mensajeModal || 'El Campus Virtual se encuentra actualmente en desarrollo y mantenimiento. Muy pronto estará disponible para todos los estudiantes y docentes.'}
          </p>
        </div>
      </Modal>
    )}

    {/* Pop-up de Promociones (destacados rotativos en el Home) */}
    {page === 'Inicio' && (
      <PromoPopUp onNavigate={go} />
    )}
  </div>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
