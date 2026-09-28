/* =============================================================================
   CFP N° 401 AVELLANEDA — PLANTILLAS DE PROMOCIÓN (compartidas)
   Las usan el panel (admin.html: vista previa y exportación a PNG) y el sitio público
   (app.js: pop-up del Home). Se editan acá y se compilan a site/plantillas-promo.js
   (ver REPORTE-MAESTRO-CONJUNTO.md §2.A). No editar site/plantillas-promo.js a mano.

   Todo se mide en unidades de contenedor (cqw = 1% del ancho del lienzo): la misma
   plantilla sirve para Feed 4:5, Historia 9:16 y A4 cambiando solo el tamaño del lienzo.
   ============================================================================= */

const FORMATOS_PROMO = {
  feed: { id: 'feed', nombre: 'Feed 4:5', ancho: 1080, alto: 1350, ratio: '1080 / 1350', uso: 'Instagram / Facebook' },
  historia: { id: 'historia', nombre: 'Historia 9:16', ancho: 1080, alto: 1920, ratio: '1080 / 1920', uso: 'Stories / WhatsApp / Reels' },
  a4: { id: 'a4', nombre: 'Afiche A4', ancho: 2480, alto: 3508, ratio: '2480 / 3508', uso: 'Cartelera / Impresión' }
};

/* Margen para los textos arriba y abajo, en cqw. En Historia, Instagram tapa el borde de arriba
   (perfil) y el de abajo (respuesta): se deja libre el 10% del alto (192 px a 1080 de ancho).
   Fondos y fotos siguen a sangre, así el lienzo se ve lleno. */
function margenSeguroPromo(formato) {
  return formato === 'historia' ? 17.8 : 0;
}

/* Alto útil que sobra respecto del Feed, en cqw (Feed = 0; Historia y A4, unos 17).
   Cada plantilla lo reparte agrandando fotos y elementos, en vez de dejar bandas vacías. */
function altoExtraPromo(formato) {
  const f = FORMATOS_PROMO[formato] || FORMATOS_PROMO.feed;
  return Math.max(0, (f.alto / f.ancho) * 100 - 2 * margenSeguroPromo(formato) - 125);
}

/* ---------- Tamaño de textos grandes ----------
   Un texto grande tiene que entrar en su ancho (cqw) sin desbordar y en pocas líneas. El ancho
   de cada letra se estima con un promedio algo mayor que el real de Poppins 800, para dejar margen. */
function lineasTexto(texto, sizeCqw, ancho, emPorLetra) {
  const porLinea = ancho / (sizeCqw * emPorLetra);
  let lineas = 1;
  let actual = 0;
  for (const palabra of (texto || '').split(/\s+/).filter(Boolean)) {
    const largo = actual ? actual + 1 + palabra.length : palabra.length;
    if (actual && largo > porLinea) {
      lineas++;
      actual = palabra.length;
    } else {
      actual = largo;
    }
  }
  return lineas;
}

function tamanoTexto(texto, { ancho, emPorLetra, base, minimo, maxLineas, altoMax, interlineado = 1 }) {
  const t = (texto || '').trim();
  const palabraMasLarga = Math.max(1, ...t.split(/\s+/).map(p => p.length));
  // La palabra más larga manda: nunca puede quedar más ancha que el espacio
  let size = Math.min(base, ancho / (palabraMasLarga * emPorLetra));
  // Opcional: el bloque tampoco puede pasar de un alto (cqw) dado
  const noEntra = s => {
    const lineas = lineasTexto(t, s, ancho, emPorLetra);
    return lineas > maxLineas || (altoMax && lineas * s * interlineado > altoMax);
  };
  while (size - 0.1 >= minimo && noEntra(size)) size -= 0.1;
  return size;
}

/* Titular del flyer estándar: columna izquierda de 54cqw, al lado de la cápsula amarilla,
   3 líneas como máximo. 0,72 em por letra (el promedio real de Poppins 800 es 0,67 em). */
const TITULO_ANCHO_CQW = 54;
const TITULO_EM_POR_LETRA = 0.72;
const TITULO_MIN_CQW = 4.2;

function lineasTitulo(titulo, sizeCqw) {
  return lineasTexto(titulo, sizeCqw, TITULO_ANCHO_CQW, TITULO_EM_POR_LETRA);
}

function tamanoTitulo(titulo) {
  const len = (titulo || '').trim().length;
  const base = len <= 18 ? 8.6 : len <= 28 ? 7.2 : len <= 40 ? 6 : 5.2;
  return tamanoTexto(titulo, { ancho: TITULO_ANCHO_CQW, emPorLetra: TITULO_EM_POR_LETRA, base, minimo: TITULO_MIN_CQW, maxLineas: 3 });
}

function getTituloFontSize(titulo) {
  return tamanoTitulo(titulo).toFixed(2) + 'cqw';
}

/* ---------- Textos editables ----------
   Cada plantilla declara sus campos. Un campo vacío muestra su texto por defecto. Los campos
   con "legado" se guardan en las claves que ya usaban las promociones anteriores. */
function whatsappPromo() {
  const w = (window.CFP_DATA && window.CFP_DATA.contacto && window.CFP_DATA.contacto.whatsapp) || '11 6105-6018';
  return w.replace(/\s*\(.*\)\s*$/, '').trim();
}

function fechaInscripcionPromo() {
  const cinta = (window.CFP_DATA && window.CFP_DATA.inscripciones && window.CFP_DATA.inscripciones.cintaCursos) || {};
  return cinta.fechaCierre ? 'Hasta el ' + cinta.fechaCierre.toLowerCase() : 'Abiertas';
}

function familiasPromo(promo) {
  const todas = ((window.CFP_DATA && window.CFP_DATA.familias) || []).map(f => f.nombre);
  if (!Array.isArray(promo.familias)) return todas;
  return todas.filter(nombre => promo.familias.includes(nombre));
}

function plantillaDePromo(promo) {
  return CATALOGO_PLANTILLAS[(promo && promo.modelo) || 'flyer-curso-v1'] || CATALOGO_PLANTILLAS['flyer-curso-v1'];
}

function valorTextoPromo(promo, campo) {
  const guardado = campo.legado ? promo[campo.legado] : (promo.textos || {})[campo.clave];
  if (typeof guardado === 'string' && guardado.trim() !== '') return guardado;
  return typeof campo.defecto === 'function' ? campo.defecto(promo) : (campo.defecto || '');
}

function textosPromo(promo) {
  const t = {};
  plantillaDePromo(promo).campos.forEach(c => { t[c.clave] = valorTextoPromo(promo, c); });
  return t;
}

/* Nombre para mostrar en listas, avisos y lectores de pantalla */
function tituloPromo(promo) {
  const t = textosPromo(promo);
  if (promo.modelo === 'apertura-inscripciones-v1') return (t.linea1 + ' ' + t.linea2).trim();
  if (promo.modelo === 'grilla-cursos-v1') return 'Cursos para empezar en ' + ((promo.periodo || 'marzo') === 'agosto' ? 'agosto' : 'marzo');
  if (t.titulo1 && t.titulo2 && !t.curso) return (t.titulo1.replace(/\s*\n\s*/g, ' ') + ' ' + t.titulo2).trim();
  return t.curso || t.titulo || promo.cursoNombre || 'Promoción';
}

const FUENTE_DISPLAY = 'var(--font-display, "Poppins", sans-serif)';
const FUENTE_TEXTO = 'var(--font-body, "Source Sans 3", sans-serif)';

/* Lienzo común: medidas en cqw y recorte */
function estiloLienzo(formato, extra) {
  const f = FORMATOS_PROMO[formato] || FORMATOS_PROMO.feed;
  return Object.assign({
    aspectRatio: f.ratio,
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    containerType: 'size',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none'
  }, extra);
}

/* =============================================================================
   PLANTILLA 1 — Flyer oficial de curso (estándar)
   ============================================================================= */
function FlyerCursoV1({ promo, formato = 'feed', customRef }) {
  if (!promo) return null;
  // Stories tiene su propia composición (diseño del responsable del sitio)
  if (formato === 'historia') return <FlyerCursoV1Historia promo={promo} customRef={customRef} />;
  const T = textosPromo(promo);
  const conSello = promo.mostrarSello !== false;
  const titulo = T.titulo.toUpperCase();
  const tituloSize = getTituloFontSize(titulo);
  const esCuadriculado = promo.fondo !== 'liso';
  const margen = margenSeguroPromo(formato);
  const extra = altoExtraPromo(formato);

  const diasTexto = T.dias;
  // Con muchos días el texto se achica un poco para que entre centrado en la cápsula
  const diasSize = diasTexto.length <= 16 ? 3.5 : diasTexto.length <= 26 ? 3.1 : 2.8;
  // En los formatos altos la cápsula es más larga: los textos crecen un poco para llenarla
  const k = 1 + extra / 120;

  // Horario en dos líneas, cortando en " a " (salvo que ya venga con saltos de línea)
  let horario = T.horario;
  if (!horario.includes('\n') && / a /.test(horario)) {
    const partes = horario.split(/\s+a\s+/);
    horario = partes[0] + ' a\n' + partes.slice(1).join(' a ');
  }

  const rotulo = { fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: (2 * k) + 'cqw', letterSpacing: '.14em', textTransform: 'uppercase' };

  return (
    <div
      ref={customRef}
      className={`flyer-canvas flyer-${formato}`}
      style={estiloLienzo(formato, { background: '#ffffff', fontFamily: FUENTE_TEXTO, color: 'var(--text-body, #333c4a)' })}
    >
      {/* Fondo cuadriculado opcional */}
      {esCuadriculado && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(var(--blue-100, #c0d0f0) 1px, transparent 1px), linear-gradient(90deg, var(--blue-100, #c0d0f0) 1px, transparent 1px)',
          backgroundSize: '4.2cqw 4.2cqw',
          opacity: 0.55,
          pointerEvents: 'none'
        }} />
      )}

      {/* Filete superior amarillo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '0.9cqw', background: 'var(--brand-accent, #ffd100)', zIndex: 4 }} />

      {/* Grid principal */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 31cqw',
        gridTemplateRows: 'auto minmax(0, 1fr) auto auto auto',
        columnGap: '4cqw',
        padding: `${Math.max(6, margen)}cqw 5.5cqw ${Math.max(5, margen)}cqw`
      }}>
        {/* Franja azul con curva y marca de agua del arco */}
        <div style={{
          gridColumn: '1 / 4',
          gridRow: '3 / 6',
          margin: `-10cqw -5.5cqw -${Math.max(5, margen)}cqw`,
          background: 'var(--gradient-hero-rich, linear-gradient(135deg, #004098 0%, #003080 46%, #002878 100%))',
          borderTopLeftRadius: '62% 14cqw',
          borderTopRightRadius: '38% 6cqw',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1
        }}>
          <img
            src="assets/promociones/arco-blanco.png"
            alt=""
            style={{ position: 'absolute', right: '-9cqw', bottom: '-6cqw', width: '62cqw', opacity: 0.08, pointerEvents: 'none' }}
          />
        </div>

        {/* Antetítulo y titular */}
        <div style={{ gridColumn: '1', gridRow: '1', position: 'relative', zIndex: 2, paddingBottom: '3.5cqw' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.6cqw',
            fontFamily: FUENTE_DISPLAY,
            fontWeight: 700,
            fontSize: '1.8cqw',
            letterSpacing: '.14em',
            color: 'var(--brand-primary, #003890)',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase'
          }}>
            <span style={{ flex: 'none', width: '4.4cqw', height: '0.7cqw', background: 'var(--brand-accent, #ffd100)' }} />
            <span>{T.antetitulo}</span>
          </div>
          <h1 style={{
            margin: '2cqw 0 0',
            fontFamily: FUENTE_DISPLAY,
            fontWeight: 800,
            fontSize: tituloSize,
            // 1,08: con menos, el tilde de una mayúscula de Poppins (BÁSICO) toca la línea de arriba
            lineHeight: 1.08,
            letterSpacing: '-.03em',
            color: 'var(--blue-900, #002878)',
            textWrap: 'balance'
          }}>
            {titulo}
          </h1>
        </div>

        {/* Borde en arco amarillo sobre la foto */}
        <div style={{
          gridColumn: '1',
          gridRow: '2 / 4',
          position: 'relative',
          zIndex: 2,
          margin: '-1.8cqw -1.8cqw 24cqw -5.5cqw',
          borderTop: '0.8cqw solid var(--brand-accent, #ffd100)',
          borderRight: '0.8cqw solid var(--brand-accent, #ffd100)',
          borderTopRightRadius: '33cqw',
          pointerEvents: 'none'
        }} />

        {/* Foto con arco y fundido */}
        <div style={{
          gridColumn: '1',
          gridRow: '2 / 4',
          position: 'relative',
          zIndex: 2,
          marginLeft: '-5.5cqw',
          borderTopRightRadius: '30cqw',
          overflow: 'hidden',
          minHeight: 0,
          WebkitMaskImage: 'linear-gradient(180deg, #000 58%, transparent 100%)',
          maskImage: 'linear-gradient(180deg, #000 58%, transparent 100%)'
        }}>
          <img
            src={promo.imagen || 'assets/promociones/soldadura-1.webp'}
            alt={titulo}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: promo.encuadre || '40% 45%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,40,120,0) 40%, rgba(0,40,120,.55) 80%)' }} />
        </div>

        {/* Frase de marca sobre la foto */}
        <div style={{ gridColumn: '1', gridRow: '3', alignSelf: 'end', position: 'relative', zIndex: 3, padding: '1cqw 0 4cqw' }}>
          <div style={{
            fontFamily: FUENTE_DISPLAY,
            fontWeight: 800,
            fontSize: (5.4 * Math.min(k, 1.1)) + 'cqw',
            lineHeight: 1,
            letterSpacing: '-.02em',
            color: '#ffffff',
            whiteSpace: 'pre-line',
            textTransform: 'uppercase'
          }}>
            {T.frase}
          </div>
          <div style={{ width: '9cqw', height: '0.8cqw', background: 'var(--brand-accent, #ffd100)', marginTop: '2cqw' }} />
        </div>

        {/* Cápsula amarilla */}
        <div style={{
          gridColumn: '2',
          gridRow: '1 / 4',
          position: 'relative',
          zIndex: 3,
          background: 'var(--brand-accent, #ffd100)',
          borderRadius: 999,
          boxShadow: '1.4cqw 1.4cqw 0 var(--blue-900, #002878)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // En los formatos altos la cápsula es larga: el espacio se reparte también arriba y abajo
          justifyContent: extra > 0 ? 'space-evenly' : 'space-between',
          padding: '8cqw 3cqw 3cqw',
          textAlign: 'center',
          color: 'var(--blue-900, #002878)',
          marginBottom: '3cqw'
        }}>
          <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: '3.4cqw', lineHeight: 1.05, letterSpacing: '-.01em', whiteSpace: 'pre-line', textTransform: 'uppercase', maxWidth: '100%', overflowWrap: 'anywhere' }}>
            {T.cta}
          </div>
          <div style={{ width: '8cqw', height: '0.6cqw', background: 'var(--blue-900, #002878)' }} />

          {/* Días */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.8cqw', maxWidth: '100%' }}>
            <div style={rotulo}>{T.etiquetaDias}</div>
            <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: (diasSize * Math.min(k, 1.08)) + 'cqw', lineHeight: 1.08, whiteSpace: 'pre-line', textWrap: 'balance', maxWidth: '100%' }}>
              {diasTexto.includes('\n') ? diasTexto : diasTexto.replace(/\s+y\s+/i, '\ny ')}
            </div>
          </div>

          {/* Horario */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.8cqw', maxWidth: '100%' }}>
            <div style={rotulo}>{T.etiquetaHorario}</div>
            <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: (4.1 * Math.min(k, 1.08)) + 'cqw', lineHeight: 1.05, letterSpacing: '-.01em', whiteSpace: 'pre-line', maxWidth: '100%' }}>
              {horario}
            </div>
          </div>

          {/* Círculo 100% GRATUITO (se puede ocultar) */}
          {conSello && (
            <div style={{
              width: '24cqw',
              height: '24cqw',
              flex: 'none',
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary, #003890)',
              boxShadow: '0 0.6cqw 2cqw rgba(0,40,120,.18)'
            }}>
              <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: '6.6cqw', lineHeight: 1, letterSpacing: '-.03em' }}>{T.selloGrande}</div>
              <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: '2.4cqw', letterSpacing: '.1em', marginTop: '.6cqw', textTransform: 'uppercase' }}>{T.selloChico}</div>
            </div>
          )}
        </div>

        {/* Franja azul de datos: requisito, sede y certificación */}
        <div style={{
          gridColumn: '1 / 3',
          gridRow: '4',
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr 1fr',
          gap: '3.5cqw',
          padding: '1cqw 0 4.5cqw',
          color: '#ffffff'
        }}>
          {[[T.etiquetaRequisito, T.requisito], [T.etiquetaSede, T.sede], [T.etiquetaCertificacion, T.certificacion]].map(([etiqueta, valor], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '.8cqw' }}>
              <div style={Object.assign({}, rotulo, { fontSize: '2cqw', color: 'var(--brand-accent, #ffd100)' })}>{etiqueta}</div>
              <div style={{ fontSize: '2.5cqw', fontWeight: 600, lineHeight: 1.25, textWrap: 'pretty' }}>{valor}</div>
            </div>
          ))}
        </div>

        {/* Pie: logo blanco y WhatsApp */}
        <div style={{
          gridColumn: '1 / 3',
          gridRow: '5',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '4cqw',
          paddingTop: '3.5cqw',
          borderTop: '1px solid rgba(255,255,255,.35)'
        }}>
          <img
            src="assets/promociones/logo-blanco.png"
            alt="CFP N° 401 Avellaneda"
            style={{ height: 'auto', width: '46cqw', maxWidth: '100%', display: 'block', flex: '0 1 auto', minWidth: 0 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1cqw', flex: 'none' }}>
            <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: '2cqw', letterSpacing: '.12em', color: '#ffffff', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
              {T.etiquetaWhatsapp}
            </div>
            <div style={{
              background: 'var(--brand-accent, #ffd100)',
              color: 'var(--blue-900, #002878)',
              fontFamily: FUENTE_DISPLAY,
              fontWeight: 800,
              fontSize: '4.2cqw',
              lineHeight: 1,
              padding: '1.4cqw 3.6cqw',
              borderRadius: 999,
              whiteSpace: 'nowrap'
            }}>
              {T.whatsapp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Flyer estándar en Stories (1080×1920): composición propia, según
   entrega-promociones/templates/flyer-curso/FlyerCursoStories.dc.html (medidas en px ÷ 10,8 = cqw).
   El titular va a todo el ancho arriba; la foto y la cápsula, una al lado de la otra debajo; los datos
   y el pie, apoyados abajo. Con textos normales las posiciones son las del diseño; si el titular o los
   datos necesitan más lugar, la cápsula y la foto se acortan en vez de pisarse. */
function FlyerCursoV1Historia({ promo, customRef }) {
  const T = textosPromo(promo);
  const titulo = T.titulo.toUpperCase();
  const conSello = promo.mostrarSello !== false;
  // Titular: 85,2cqw de ancho y 24,5cqw de alto como máximo (entre el antetítulo y la cápsula)
  const tituloSize = tamanoTexto(titulo, { ancho: 85.2, emPorLetra: 0.72, base: 13.9, minimo: 6, maxLineas: 3, altoMax: 24.5, interlineado: 1.04 });
  // Datos de abajo: si un texto es muy largo (por ejemplo, las dos sedes), la letra se achica un poco
  const columnasDatos = [31.1, 27.1, 24.4];
  const valoresDatos = [T.requisito, T.sede, T.certificacion];
  const datoSize = [2.78, 2.5, 2.25].find(s => valoresDatos.every((v, i) => lineasTexto(v, s, columnasDatos[i], 0.52) <= 4)) || 2.25;
  const diasTexto = T.dias;
  // Días: entran en el ancho de la cápsula (24cqw) en 3 líneas como máximo; con muchos días la letra se achica
  const diasSize = tamanoTexto(diasTexto, { ancho: 24.07, emPorLetra: 0.58, base: 4.63, minimo: 2.6, maxLineas: 3 });
  let horario = T.horario;
  if (!horario.includes('\n') && / a /.test(horario)) {
    const partes = horario.split(/\s+a\s+/);
    horario = partes[0] + ' a\n' + partes.slice(1).join(' a ');
  }
  const rotulo = { fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: '2.41cqw', letterSpacing: '.14em', textTransform: 'uppercase' };
  const rotuloDato = { fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: '2.22cqw', letterSpacing: '.14em', color: 'var(--brand-accent, #ffd100)', textTransform: 'uppercase' };

  return (
    <div
      ref={customRef}
      className="flyer-canvas flyer-historia"
      style={estiloLienzo('historia', { background: '#ffffff', fontFamily: FUENTE_TEXTO, color: 'var(--text-body, #333c4a)' })}
    >
      {promo.fondo !== 'liso' && (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--blue-100, #c0d0f0) 1px, transparent 1px), linear-gradient(90deg, var(--blue-100, #c0d0f0) 1px, transparent 1px)', backgroundSize: '4.26cqw 4.26cqw', opacity: 0.55, pointerEvents: 'none' }} />
      )}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1.11cqw', background: 'var(--brand-accent, #ffd100)', zIndex: 5 }} />

      {/* Franja azul con curva (fondo) */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '103.7cqw', bottom: 0, background: 'var(--gradient-hero-rich, linear-gradient(135deg, #004098 0%, #003080 46%, #002878 100%))', borderTopLeftRadius: '62% 16.67cqw', borderTopRightRadius: '38% 7.41cqw', overflow: 'hidden', zIndex: 1 }}>
        <img src="assets/promociones/arco-blanco.png" alt="" style={{ position: 'absolute', right: '-10.19cqw', bottom: '-8.33cqw', width: '66.67cqw', opacity: 0.08 }} />
      </div>

      {/* Columna entre los márgenes de 150 px (13,89cqw) de arriba y de abajo */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '13.89cqw', bottom: '13.89cqw', display: 'flex', flexDirection: 'column', zIndex: 2 }}>
        {/* Antetítulo y titular a todo el ancho: la cápsula arranca a 500 px (46,3cqw) salvo que el titular necesite más */}
        <div style={{ flex: 'none', minHeight: '32.41cqw', padding: '0 7.41cqw 2cqw', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.67cqw', fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: '2.41cqw', letterSpacing: '.14em', color: 'var(--brand-primary, #003890)', textTransform: 'uppercase' }}>
            <span style={{ flex: 'none', width: '5.19cqw', height: '0.74cqw', background: 'var(--brand-accent, #ffd100)' }} />
            <span>{T.antetitulo}</span>
          </div>
          <h1 style={{ margin: '2.04cqw 0 0', maxWidth: '85.19cqw', fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: tituloSize.toFixed(2) + 'cqw', lineHeight: 1.04, letterSpacing: '-.035em', color: 'var(--blue-900, #002878)', textWrap: 'balance' }}>
            {titulo}
          </h1>
        </div>

        {/* Foto y cápsula (880 px de alto en el diseño; se acortan si hace falta) */}
        <div style={{ position: 'relative', flex: '0 1 81.48cqw', minHeight: 0 }}>
          <div style={{ position: 'absolute', left: 0, top: '1.48cqw', width: '62.41cqw', height: '51.85cqw', borderTop: '1.11cqw solid var(--brand-accent, #ffd100)', borderRight: '1.11cqw solid var(--brand-accent, #ffd100)', borderTopRightRadius: '33.7cqw', zIndex: 2, pointerEvents: 'none', boxSizing: 'border-box' }} />
          <div style={{ position: 'absolute', left: 0, top: '3.7cqw', bottom: 0, width: '60.19cqw', borderTopRightRadius: '31.48cqw', overflow: 'hidden', zIndex: 1, WebkitMaskImage: 'linear-gradient(180deg, #000 60%, transparent 100%)', maskImage: 'linear-gradient(180deg, #000 60%, transparent 100%)' }}>
            <img src={promo.imagen || 'assets/promociones/soldadura-1.webp'} alt={titulo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: promo.encuadre || '40% 45%' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,40,120,0) 40%, rgba(0,40,120,.55) 80%)' }} />
          </div>

          {/* Frase de marca, sobre el final de la foto */}
          <div style={{ position: 'absolute', left: '7.41cqw', bottom: '1.67cqw', zIndex: 3 }}>
            <div style={{ maxWidth: '60cqw', fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: '7.22cqw', lineHeight: 1, letterSpacing: '-.02em', color: '#ffffff', whiteSpace: 'pre-line', textWrap: 'balance', textTransform: 'uppercase' }}>
              {T.frase}
            </div>
            <div style={{ width: '10.19cqw', height: '0.93cqw', background: 'var(--brand-accent, #ffd100)', marginTop: '2.41cqw' }} />
          </div>

          {/* Cápsula amarilla */}
          <div style={{ position: 'absolute', right: '5.93cqw', top: 0, bottom: 0, width: '30.56cqw', zIndex: 3, background: 'var(--brand-accent, #ffd100)', borderRadius: 999, boxShadow: '1.48cqw 1.48cqw 0 var(--blue-900, #002878)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '10.19cqw 2.78cqw 2.78cqw', textAlign: 'center', color: 'var(--blue-900, #002878)', boxSizing: 'border-box' }}>
            <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: '4.26cqw', lineHeight: 1.05, letterSpacing: '-.01em', maxWidth: '23.15cqw', whiteSpace: 'pre-line', textWrap: 'balance', textTransform: 'uppercase' }}>{T.cta}</div>
            <div style={{ width: '8.33cqw', height: '0.65cqw', background: 'var(--blue-900, #002878)', flex: 'none' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.93cqw', maxWidth: '100%' }}>
              <div style={rotulo}>{T.etiquetaDias}</div>
              <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: diasSize + 'cqw', lineHeight: 1.08, maxWidth: '24.07cqw', whiteSpace: 'pre-line', textWrap: 'balance' }}>
                {diasTexto.includes('\n') ? diasTexto : diasTexto.replace(/\s+y\s+/i, '\ny ')}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.93cqw', maxWidth: '100%' }}>
              <div style={rotulo}>{T.etiquetaHorario}</div>
              <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: '5cqw', lineHeight: 1.05, letterSpacing: '-.01em', maxWidth: '24.07cqw', whiteSpace: 'pre-line' }}>{horario}</div>
            </div>
            {conSello && (
              <div style={{ width: '25cqw', height: '25cqw', flex: 'none', borderRadius: '50%', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary, #003890)', boxShadow: '0 0.74cqw 2.22cqw rgba(0,40,120,.18)' }}>
                <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: '7.04cqw', lineHeight: 1, letterSpacing: '-.03em' }}>{T.selloGrande}</div>
                <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: '2.59cqw', letterSpacing: '.1em', marginTop: '.74cqw', textTransform: 'uppercase' }}>{T.selloChico}</div>
              </div>
            )}
          </div>
        </div>

        {/* Espacio libre entre la cápsula y los datos (se consume primero si hace falta lugar) */}
        <div style={{ flex: '1 0 auto', minHeight: '2.5cqw' }} />

        {/* Datos y pie */}
        <div style={{ flex: 'none', margin: '0 7.41cqw', display: 'flex', flexDirection: 'column', gap: '4.07cqw', color: '#ffffff' }}>
          {/* (Columnas con minmax: el CSS del panel para celulares busca "1fr 1fr" en el estilo) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr) minmax(0, .9fr)', gap: '3.33cqw' }}>
            {[[T.etiquetaRequisito, T.requisito], [T.etiquetaSede, T.sede], [T.etiquetaCertificacion, T.certificacion]].map(([etiqueta, valor], i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '.93cqw' }}>
                <div style={rotuloDato}>{etiqueta}</div>
                <div style={{ fontSize: datoSize + 'cqw', fontWeight: 600, lineHeight: 1.25, textWrap: 'pretty' }}>{valor}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3.7cqw', paddingTop: '3.7cqw', borderTop: '1px solid rgba(255,255,255,.35)' }}>
            <img src="assets/promociones/logo-blanco.png" alt="CFP N° 401 Avellaneda" style={{ width: '39.81cqw', maxWidth: '100%', height: 'auto', display: 'block', flex: '0 1 auto', minWidth: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1.11cqw', flex: 'none' }}>
              <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: '2.04cqw', letterSpacing: '.12em', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>{T.etiquetaWhatsapp}</div>
              <div style={{ background: 'var(--brand-accent, #ffd100)', color: 'var(--blue-900, #002878)', fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: '4.63cqw', lineHeight: 1, padding: '1.67cqw 3.7cqw', borderRadius: 999, whiteSpace: 'nowrap' }}>{T.whatsapp}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   PLANTILLA 2 — Promo de curso (alternativa): foto a sangre, ficha blanca con el
   nombre del curso, grilla de datos sobre azul y franja amarilla de WhatsApp.
   Medidas propias por formato, según las plantillas de entrega-promociones/templates/promo-curso
   (Feed y Stories diseñados a 1080 de ancho: px ÷ 10,8; A4 a 1240: px ÷ 12,4).
   ============================================================================= */
const MEDIDAS_PROMO_CURSO = {
  feed: {
    fotoMin: 38.9, degradado: 'linear-gradient(180deg, rgba(0,30,90,.55) 0%, rgba(0,30,90,0) 30%, rgba(0,30,90,0) 60%, rgba(0,30,90,.7) 100%)',
    logo: { izq: 5.2, arriba: 5.2, ancho: 27.8 },
    cinta: { der: 6.7, ancho: 16.3, arriba: 5.2, abajo: 5.9, punta: 86, grande: 5, chica: 1.85, separacion: 0.74 },
    ficha: { margen: '-13.9cqw 5.2cqw 0', radio: 2.6, padding: '4.1cqw 4.8cqw 4.4cqw', gap: 1.67, sombra: '0 2.2cqw 5.6cqw', categoria: 2.22, punto: 1.3, aro: 0.37, titulo: { ancho: 80, base: 8.5 }, bajada: 2.59, bajadaMax: 79.6 },
    datos: { padding: '4.1cqw 10cqw', gap: '2.6cqw 4.4cqw', borde: 0.37, sangria: 1.85, separacion: 0.55, rotulo: 1.85, valor: 2.96, arco: { der: -5.6, arriba: -1.9, ancho: 31.5 } },
    franja: { padding: '2.8cqw 5.2cqw', gap: 3, cta: 3.15, sede: 2.04, separacion: 0.37, pastilla: { gap: 1.48, padding: '1.3cqw 3.15cqw 1.3cqw 1.48cqw', wa: 4.8, waTexto: 1.67, numero: 3.7 } }
  },
  historia: {
    fotoMin: 70.37, degradado: 'linear-gradient(180deg, rgba(0,30,90,.65) 0%, rgba(0,30,90,0) 32%, rgba(0,30,90,0) 65%, rgba(0,30,90,.6) 100%)',
    logo: { izq: 5.93, arriba: 9.26, ancho: 57.41 },
    cinta: { der: 6.67, ancho: 16.67, arriba: 13.89, abajo: 5.56, punta: 88, grande: 5, chica: 1.85, separacion: 0.74 },
    ficha: { margen: '-13.89cqw 5.19cqw 0', radio: 2.78, padding: '4.07cqw 4.81cqw 4.44cqw', gap: 1.67, sombra: '0 2.22cqw 5.56cqw', categoria: 2.22, punto: 1.3, aro: 0.37, titulo: { ancho: 80, base: 7.78 }, bajada: 2.69, bajadaMax: 80 },
    datos: { padding: '3.33cqw 8.15cqw 3.7cqw', gap: '2.04cqw 3.7cqw', borde: 0.37, sangria: 1.67, separacion: 0.37, rotulo: 1.76, valor: 2.69, arco: null },
    franja: { padding: '3.33cqw 5.19cqw 7.41cqw', gap: 2.59, cta: 3.7, sede: 2.13, separacion: 0.74, pastilla: { gap: 1.3, padding: '1.11cqw 2.78cqw 1.11cqw 1.11cqw', wa: 4.81, waTexto: 1.67, numero: 3.7 } }
  },
  a4: {
    fotoMin: 41.94, degradado: 'linear-gradient(180deg, rgba(0,30,90,.55) 0%, rgba(0,30,90,0) 30%, rgba(0,30,90,0) 60%, rgba(0,30,90,.7) 100%)',
    logo: { izq: 5.81, arriba: 5.81, ancho: 29.03 },
    cinta: { der: 6.77, ancho: 16.13, arriba: 5.16, abajo: 5.97, punta: 86, grande: 5, chica: 1.85, separacion: 0.65 },
    ficha: { margen: '-13.71cqw 5.16cqw 0', radio: 2.58, padding: '4.35cqw 5cqw 4.68cqw', gap: 1.77, sombra: '0 1.94cqw 4.84cqw', categoria: 2.18, punto: 1.29, aro: 0.32, titulo: { ancho: 79.68, base: 8.71 }, bajada: 2.58, bajadaMax: 79.03 },
    datos: { padding: '4.35cqw 10cqw', gap: '2.74cqw 4.52cqw', borde: 0.4, sangria: 1.94, separacion: 0.65, rotulo: 1.85, valor: 2.98, arco: { der: -4.84, arriba: -1.61, ancho: 31.45 } },
    franja: { padding: '3.23cqw 5.16cqw', gap: 2.9, cta: 3.23, sede: 2.02, separacion: 0.48, pastilla: { gap: 1.45, padding: '1.29cqw 3.23cqw 1.29cqw 1.45cqw', wa: 4.84, waTexto: 1.61, numero: 3.87 } }
  }
};

function PromoCursoV2({ promo, formato = 'feed', customRef }) {
  if (!promo) return null;
  const T = textosPromo(promo);
  const M = MEDIDAS_PROMO_CURSO[formato] || MEDIDAS_PROMO_CURSO.feed;
  const conCinta = promo.mostrarCinta !== false;
  // Nombre del curso en la ficha: 3 líneas como máximo (mayúsculas y minúsculas)
  const cursoSize = tamanoTexto(T.curso, { ancho: M.ficha.titulo.ancho, emPorLetra: 0.6, base: M.ficha.titulo.base, minimo: 4.6, maxLineas: 3 });

  const dato = (etiqueta, valor) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: M.datos.separacion + 'cqw', borderLeft: `${M.datos.borde}cqw solid var(--brand-accent, #ffd100)`, paddingLeft: M.datos.sangria + 'cqw', minWidth: 0 }}>
      <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: M.datos.rotulo + 'cqw', letterSpacing: '.16em', color: 'var(--brand-accent, #ffd100)', textTransform: 'uppercase' }}>{etiqueta}</div>
      <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: M.datos.valor + 'cqw', lineHeight: 1.15, textWrap: 'balance' }}>{valor}</div>
    </div>
  );

  return (
    <div
      ref={customRef}
      className={`flyer-canvas flyer-${formato}`}
      style={estiloLienzo(formato, { background: 'var(--blue-900, #002878)', fontFamily: FUENTE_TEXTO, color: '#ffffff', display: 'flex', flexDirection: 'column' })}
    >
      {/* Foto a sangre: ocupa todo el alto que sobra */}
      <div style={{ position: 'relative', flex: '1 1 auto', minHeight: M.fotoMin + 'cqw', overflow: 'hidden', background: 'var(--brand-primary, #003890)' }}>
        <img
          src={promo.imagen || 'assets/promociones/soldadura-1.webp'}
          alt={T.curso}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: promo.encuadre || 'center 40%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: M.degradado }} />
        <img
          src="assets/promociones/logo-blanco.png"
          alt="CFP N° 401 Avellaneda"
          style={{ position: 'absolute', left: M.logo.izq + 'cqw', top: M.logo.arriba + 'cqw', width: M.logo.ancho + 'cqw', height: 'auto' }}
        />
        {conCinta && (
          <div style={{
            position: 'absolute',
            right: M.cinta.der + 'cqw',
            top: 0,
            width: M.cinta.ancho + 'cqw',
            padding: `${M.cinta.arriba}cqw 0 ${M.cinta.abajo}cqw`,
            background: 'var(--brand-accent, #ffd100)',
            color: 'var(--blue-900, #002878)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            clipPath: `polygon(0 0, 100% 0, 100% 100%, 50% ${M.cinta.punta}%, 0 100%)`
          }}>
            <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: M.cinta.grande + 'cqw', lineHeight: 1, letterSpacing: '-.03em' }}>{T.cintaGrande}</div>
            <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: M.cinta.chica + 'cqw', letterSpacing: '.12em', marginTop: M.cinta.separacion + 'cqw', textTransform: 'uppercase' }}>{T.cintaChica}</div>
          </div>
        )}
      </div>

      {/* Ficha blanca con el nombre del curso */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        flex: 'none',
        margin: M.ficha.margen,
        background: '#ffffff',
        color: 'var(--blue-900, #002878)',
        borderRadius: M.ficha.radio + 'cqw',
        padding: M.ficha.padding,
        display: 'flex',
        flexDirection: 'column',
        gap: M.ficha.gap + 'cqw',
        boxShadow: M.ficha.sombra + ' rgba(0,20,70,.35)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: (M.ficha.punto) + 'cqw', fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: M.ficha.categoria + 'cqw', letterSpacing: '.16em', color: 'var(--brand-primary, #003890)', textTransform: 'uppercase' }}>
          <span style={{ flex: 'none', width: M.ficha.punto + 'cqw', height: M.ficha.punto + 'cqw', borderRadius: '50%', background: 'var(--brand-accent, #ffd100)', boxShadow: `0 0 0 ${M.ficha.aro}cqw var(--blue-900, #002878)` }} />
          <span>{T.categoria}</span>
        </div>
        <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: cursoSize.toFixed(2) + 'cqw', lineHeight: 1, letterSpacing: '-.04em', textWrap: 'balance' }}>
          {T.curso}
        </div>
        {T.bajada && (
          <div style={{ fontSize: M.ficha.bajada + 'cqw', fontWeight: 400, lineHeight: 1.35, color: 'var(--text-body, #333c4a)', textWrap: 'pretty', maxWidth: M.ficha.bajadaMax + 'cqw' }}>
            {T.bajada}
          </div>
        )}
      </div>

      {/* Grilla de datos sobre azul
          (columnas con minmax: el CSS del panel para celulares busca "1fr 1fr" en el estilo y las colapsaría) */}
      <div style={{ position: 'relative', flex: 'none', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: M.datos.gap, padding: M.datos.padding }}>
        {M.datos.arco && (
          <img
            src="assets/promociones/arco-blanco.png"
            alt=""
            style={{ position: 'absolute', right: M.datos.arco.der + 'cqw', top: M.datos.arco.arriba + 'cqw', width: M.datos.arco.ancho + 'cqw', opacity: 0.06, pointerEvents: 'none' }}
          />
        )}
        {dato(T.etiquetaDias, T.dias)}
        {dato(T.etiquetaHorario, T.horario)}
        {dato(T.etiquetaDuracion, T.duracion)}
        {dato(T.etiquetaRequisito, T.requisito)}
      </div>

      {/* Franja amarilla: llamado, sede y WhatsApp (a sangre hasta abajo) */}
      <div style={{
        flex: 'none',
        background: 'var(--brand-accent, #ffd100)',
        color: 'var(--blue-900, #002878)',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        alignItems: 'center',
        gap: M.franja.gap + 'cqw',
        padding: M.franja.padding
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: M.franja.separacion + 'cqw', minWidth: 0 }}>
          <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: M.franja.cta + 'cqw', lineHeight: 1, letterSpacing: '-.01em' }}>{T.cta}</div>
          <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 600, fontSize: M.franja.sede + 'cqw', lineHeight: 1.25, letterSpacing: '.03em', textWrap: 'balance' }}>{T.sede}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: M.franja.pastilla.gap + 'cqw', background: 'var(--blue-900, #002878)', color: '#ffffff', borderRadius: 999, padding: M.franja.pastilla.padding, whiteSpace: 'nowrap' }}>
          <span style={{ flex: 'none', width: M.franja.pastilla.wa + 'cqw', height: M.franja.pastilla.wa + 'cqw', borderRadius: '50%', background: 'var(--brand-accent, #ffd100)', color: 'var(--blue-900, #002878)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: M.franja.pastilla.waTexto + 'cqw', letterSpacing: '.04em' }}>WA</span>
          <span style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: M.franja.pastilla.numero + 'cqw', lineHeight: 1 }}>{T.whatsapp}</span>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   PLANTILLA 3 — Inscripciones abiertas (institucional, no ligada a un curso):
   titular tipográfico, sello amarillo, foto circular y las familias de oficios.
   Medidas propias por formato, según entrega-promociones/templates/inscripciones-abiertas
   (Feed y Stories a 1080 de ancho: px ÷ 10,8; A4 a 1240: px ÷ 12,4).
   La foto circular, el aro y el sello se miden en proporción al diámetro de la foto, que se
   achica si el texto necesita más lugar: nunca se pisan.
   ============================================================================= */
const MEDIDAS_INSCRIPCIONES = {
  feed: {
    // Ajustado a la referencia del responsable (27/09, 18:31): foto de 765 px (aro de 855 px) anclada arriba a la
    // derecha, más allá de los bordes, y sello de 236 px montado sobre el borde inferior izquierdo del aro. El aro
    // puede bajar hasta 100 px por debajo de la zona (por la derecha, donde no llega el texto); si el texto crece,
    // la foto se achica desde esa esquina en vez de pisarlo.
    zona: { flex: '1 1 auto', centrar: false },
    foto: { der: -27.64, arriba: -19.31, diametro: 70.83, aro: 5.88, bordeAro: 2.06, reservaArriba: null, holgura: -9.4 },
    sello: { izq: -3.33, arriba: 73.66, tam: 30.85, alcance: 0.985, sombra: 0.93, grande: 29, chica: 10.9, separacion: 2.7 },
    arco: { izq: -16.7, abajoDelPie: -1.9, ancho: 70.4 },
    logo: { izq: 6.67, arriba: 6.67, ancho: 30.6 },
    texto: { flex: 'none', padding: '2cqw 6.67cqw 3.7cqw', centrar: false, ante: 2.59, anteGap: 1.67, anteMax: 50, barra: [5.19, 0.74], l1Arriba: 2.04, l1: 10.74, l1Ancho: 86.7, l2Arriba: 1.67, l2Izq: -0.74, l2Ancho: 74, l2Max: 79.6, l2Padding: '0.37cqw 2.96cqw 1.3cqw', l2Radio: 2.22, l2Sombra: 1.11, bajadaArriba: 2.96, bajada: 2.78, bajadaMax: 72.2, pildorasArriba: 2.59, pildorasGap: 1.11, pildora: 2.04, pildoraPad: '0.74cqw 2.04cqw', pildoraBorde: 0.28, pildorasMax: 86.7 },
    pie: { tipo: 'fila', alto: 17.6, padding: '0 6.67cqw', borde: 1.11, gap: 3.7, rotulo: 2.04, valor: 3.52, numero: 3.89, numeroPad: '1.48cqw 2.96cqw', separacion: 0.74, rotuloWhatsappIzquierda: 2.96 }
  },
  historia: {
    // Ajustado al borrador del responsable (27/09): foto, aro y sello un 30% más grandes y más arriba
    // (foto de 754 px desde los 213 px), marca de agua más grande y detrás del titular, y el número de
    // WhatsApp alineado con la columna de la sede. La zona de la foto toma el alto que sobra y el texto
    // queda apoyado sobre el pie; si el texto crece, la foto se achica en vez de pisarlo.
    zona: { flex: '1 1 auto', centrar: false },
    foto: { der: -15.37, arriba: 19.72, diametro: 69.81, aro: 3.45, bordeAro: 2.41, reservaArriba: null, holgura: 0.3 },
    sello: { izq: -27.59, arriba: 58.62, tam: 39.66, alcance: 0.99, sombra: 1.44, grande: 30.4, chica: 11.3, separacion: 2.6 },
    arco: { izq: -25.18, arribaLienzo: 60.46, ancho: 83.7 },
    logo: { izq: 7.41, arriba: 12.04, ancho: 57.41 },
    texto: { flex: 'none', padding: '0 7.41cqw 5.18cqw', centrar: false, ante: 2.59, anteGap: 1.67, barra: [5.19, 0.74], l1Arriba: 1.67, l1: 9.07, l1Ancho: 85.19, l2Arriba: 1.67, l2Izq: 0, l2Ancho: 77.8, l2Max: 83.33, l2Padding: '0.37cqw 2.78cqw 1.11cqw', l2Radio: 2.04, l2Sombra: 1.11, bajadaArriba: 3.33, bajada: 2.96, bajadaMax: 83.33, pildorasArriba: 2.22, pildorasGap: 1.11, pildora: 2.13, pildoraPad: '0.74cqw 2.04cqw', pildoraBorde: 0.28, pildorasMax: 85.19 },
    pie: { tipo: 'dosFilas', padding: '3.7cqw 7.41cqw 6.48cqw', borde: 1.3, gap: 2.78, columnasGap: 3.7, rotulo: 2.04, valor: 3.52, numero: 4.07, numeroPad: '1.48cqw 3.15cqw', separacion: 0.74, filaArriba: 2.41, whatsappEnColumna: true }
  },
  a4: {
    zona: { flex: '1 1 auto', centrar: true },
    foto: { der: -14.35, arriba: -11.94, diametro: 69.03, aro: 2.57, bordeAro: 1.87, reservaArriba: 11.94 - 2 },
    sello: { izq: -0.23, arriba: 72.2, tam: 29.2, alcance: 1.035, sombra: 0.97, grande: 29.6, chica: 10.8, separacion: 2.4 },
    arco: { izq: -16.13, abajoDelPie: 3.2, ancho: 70.97 },
    logo: { izq: 7.26, arriba: 7.26, ancho: 30.65 },
    texto: { flex: 'none', padding: '2cqw 7.26cqw 5.65cqw', centrar: false, ante: 2.58, anteGap: 1.61, barra: [5.16, 0.73], l1Arriba: 2.1, l1: 11.29, l1Ancho: 85.48, l2Arriba: 1.77, l2Izq: -0.65, l2Ancho: 74.5, l2Max: 80.65, l2Padding: '0.48cqw 3.06cqw 1.45cqw', l2Radio: 2.26, l2Sombra: 1.13, bajadaArriba: 3.39, bajada: 2.9, bajadaMax: 72.58, pildorasArriba: 2.58, pildorasGap: 1.13, pildora: 2.1, pildoraPad: '0.81cqw 2.1cqw', pildoraBorde: 0.24, pildorasMax: 85.48 },
    pie: { tipo: 'fila', alto: 20.97, padding: '0 7.26cqw', borde: 1.13, gap: 3.87, rotulo: 1.94, valor: 3.39, numero: 3.87, numeroPad: '1.45cqw 2.9cqw', separacion: 0.81, rotuloWhatsappIzquierda: 2.9 }
  }
};

function InscripcionesV1({ promo, formato = 'feed', customRef }) {
  if (!promo) return null;
  const T = textosPromo(promo);
  const M = MEDIDAS_INSCRIPCIONES[formato] || MEDIDAS_INSCRIPCIONES.feed;
  const familias = promo.mostrarFamilias !== false ? familiasPromo(promo) : [];
  const conSello = promo.mostrarSello !== false;
  const X = M.texto;
  // Líneas del titular: tienen que entrar en su ancho (la amarilla, descontando su relleno)
  const sizeLinea1 = tamanoTexto(T.linea1, { ancho: X.l1Ancho, emPorLetra: 0.66, base: X.l1, minimo: 5.5, maxLineas: 2 });
  const sizeLinea2 = tamanoTexto(T.linea2, { ancho: X.l2Ancho, emPorLetra: 0.66, base: X.l1, minimo: 5.5, maxLineas: 2 });
  // Diámetro de la foto circular: el del diseño, salvo que no entre en la zona (si el texto crece, se achica)
  const F = M.foto;
  const diametro = F.reservaArriba !== null
    ? `min(${F.diametro}cqw, calc((100cqh + ${F.reservaArriba}cqw) / ${M.sello.alcance}))`
    : `min(${F.diametro}cqw, calc((100cqh - ${F.arriba + (F.holgura ?? 2)}cqw) / ${1 + F.aro / 100}))`;
  // En Feed y A4, si sobra alto, la foto se centra en el espacio libre en vez de quedar pegada arriba
  const fotoArriba = M.zona.centrar
    ? `calc(${F.arriba}cqw + max(0cqw, 100cqh - ${diametro} * ${M.sello.alcance} + ${F.reservaArriba}cqw) / 2)`
    : F.arriba + 'cqw';
  // En Stories, si el rótulo de WhatsApp no se editó, se usa la versión larga del diseño
  const rotuloWhatsapp = M.pie.tipo === 'dosFilas' && !((promo.textos || {}).etiquetaWhatsapp || '').trim() ? 'CONSULTAS POR WHATSAPP' : T.etiquetaWhatsapp;
  const P = M.pie;
  const rotuloPie = { fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: P.rotulo + 'cqw', letterSpacing: '.14em', color: 'var(--brand-primary, #003890)', textTransform: 'uppercase' };
  // En los datos del pie, las iniciales ("J. P.") y la altura de una calle ("Angulo 1272") no se separan: así el
  // corte de línea es el mismo en cualquier navegador. Los números cortos (fechas) quedan libres para no sumar renglones.
  const pegarCortes = v => typeof v === 'string'
    ? v.replace(/([A-ZÁÉÍÓÚÑ]\.) (?=[A-ZÁÉÍÓÚÑ]\.)/g, '$1 ').replace(/ (?=\d{3,})/g, ' ')
    : v;
  const datoPie = (etiqueta, valor, i) => (
    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: P.separacion + 'cqw', minWidth: 0 }}>
      <div style={rotuloPie}>{etiqueta}</div>
      <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: P.valor + 'cqw', lineHeight: 1.06, textWrap: 'balance' }}>{pegarCortes(valor)}</div>
    </div>
  );
  const pastilla = (
    <div style={{ flex: 'none', background: 'var(--blue-900, #002878)', color: 'var(--brand-accent, #ffd100)', fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: P.numero + 'cqw', lineHeight: 1, padding: P.numeroPad, borderRadius: 999, whiteSpace: 'nowrap' }}>{T.whatsapp}</div>
  );

  return (
    <div
      ref={customRef}
      className={`flyer-canvas flyer-${formato}`}
      style={estiloLienzo(formato, { background: 'var(--brand-primary, #003890)', fontFamily: FUENTE_TEXTO, color: '#ffffff', display: 'flex', flexDirection: 'column' })}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-hero-rich, linear-gradient(135deg, #004098 0%, #003080 46%, #002878 100%))' }} />
      <img
        src="assets/promociones/arco-blanco.png"
        alt=""
        style={Object.assign(
          { position: 'absolute', left: M.arco.izq + 'cqw', width: M.arco.ancho + 'cqw', opacity: 0.07, pointerEvents: 'none' },
          M.arco.arribaLienzo !== undefined ? { top: M.arco.arribaLienzo + 'cqw' } : { bottom: ((P.alto || 0) + M.arco.abajoDelPie) + 'cqw' }
        )}
      />

      {/* Zona superior: logo, foto circular con aro y sello */}
      <div style={{ position: 'relative', flex: M.zona.flex, minHeight: 0, containerType: 'size' }}>
        <div style={{ position: 'absolute', right: F.der + 'cqw', top: fotoArriba, width: diametro, aspectRatio: '1' }}>
          <div style={{ position: 'absolute', inset: `-${F.aro}%`, borderRadius: '50%', border: `calc(${diametro} * ${F.bordeAro / 100}) solid var(--brand-accent, #ffd100)` }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', background: 'var(--blue-900, #002878)' }}>
            <img
              src={promo.imagen || 'assets/hero-egresados.jpg'}
              alt="Estudiantes del CFP N° 401"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: promo.encuadre || 'center' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(200deg, rgba(0,40,120,0) 45%, rgba(0,40,120,.5) 100%)' }} />
          </div>
          {conSello && (
            <div style={{
              position: 'absolute',
              left: M.sello.izq + '%',
              top: M.sello.arriba + '%',
              width: M.sello.tam + '%',
              aspectRatio: '1',
              containerType: 'inline-size',
              zIndex: 2,
              borderRadius: '50%',
              background: 'var(--brand-accent, #ffd100)',
              color: 'var(--blue-900, #002878)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transform: 'rotate(-12deg)',
              boxShadow: `${M.sello.sombra}cqw ${M.sello.sombra}cqw 0 var(--blue-900, #002878)`
            }}>
              {/* Adentro del sello, cqw es el ancho del sello */}
              <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: M.sello.grande + 'cqw', lineHeight: 1, letterSpacing: '-.03em' }}>{T.selloGrande}</div>
              <div style={{ fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: M.sello.chica + 'cqw', letterSpacing: '.1em', marginTop: M.sello.separacion + 'cqw', textTransform: 'uppercase' }}>{T.selloChico}</div>
            </div>
          )}
        </div>
        <img
          src="assets/promociones/logo-blanco.png"
          alt="CFP N° 401 Avellaneda"
          style={{ position: 'absolute', left: M.logo.izq + 'cqw', top: M.logo.arriba + 'cqw', width: M.logo.ancho + 'cqw', height: 'auto', display: 'block' }}
        />
      </div>

      {/* Titular, bajada y familias de oficios */}
      <div style={{ position: 'relative', flex: X.flex, padding: X.padding, display: 'flex', flexDirection: 'column', justifyContent: X.centrar ? 'center' : 'flex-start', alignItems: 'flex-start' }}>
        {/* En Feed el sello queda a la altura del antetítulo: con sello, un antetítulo largo pasa a otro renglón antes de llegar a él */}
        <div style={{ display: 'flex', alignItems: 'center', gap: X.anteGap + 'cqw', fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: X.ante + 'cqw', letterSpacing: '.16em', color: 'var(--brand-accent, #ffd100)', textTransform: 'uppercase', maxWidth: conSello && X.anteMax ? X.anteMax + 'cqw' : undefined }}>
          <span style={{ flex: 'none', width: X.barra[0] + 'cqw', height: X.barra[1] + 'cqw', background: 'var(--brand-accent, #ffd100)' }} />
          <span style={{ minWidth: 0, textWrap: 'balance' }}>{T.antetitulo}</span>
        </div>
        <div style={{ marginTop: X.l1Arriba + 'cqw', fontFamily: FUENTE_DISPLAY, fontWeight: 800, fontSize: sizeLinea1.toFixed(2) + 'cqw', lineHeight: 1.05, letterSpacing: '-.045em', color: '#ffffff', maxWidth: X.l1Ancho + 'cqw', textWrap: 'balance', textTransform: 'uppercase' }}>
          {T.linea1}
        </div>
        <div style={{
          marginTop: X.l2Arriba + 'cqw',
          marginLeft: X.l2Izq + 'cqw',
          background: 'var(--brand-accent, #ffd100)',
          color: 'var(--blue-900, #002878)',
          fontFamily: FUENTE_DISPLAY,
          fontWeight: 800,
          fontSize: sizeLinea2.toFixed(2) + 'cqw',
          lineHeight: 1,
          letterSpacing: '-.045em',
          maxWidth: X.l2Max + 'cqw',
          textWrap: 'balance',
          textTransform: 'uppercase',
          padding: X.l2Padding,
          borderRadius: X.l2Radio + 'cqw',
          transform: 'rotate(-2deg)',
          boxShadow: `${X.l2Sombra}cqw ${X.l2Sombra}cqw 0 var(--blue-900, #002878)`
        }}>
          {T.linea2}
        </div>
        {T.bajada && (
          <div style={{ marginTop: X.bajadaArriba + 'cqw', maxWidth: X.bajadaMax + 'cqw', fontSize: X.bajada + 'cqw', fontWeight: 600, lineHeight: 1.3, textWrap: 'pretty' }}>
            {T.bajada}
          </div>
        )}
        {familias.length > 0 && (
          <div style={{ marginTop: X.pildorasArriba + 'cqw', display: 'flex', flexWrap: 'wrap', gap: X.pildorasGap + 'cqw', maxWidth: X.pildorasMax + 'cqw' }}>
            {familias.map(nombre => (
              <span key={nombre} style={{ border: `${X.pildoraBorde}cqw solid rgba(255,255,255,.75)`, borderRadius: 999, padding: X.pildoraPad, fontFamily: FUENTE_DISPLAY, fontWeight: 700, fontSize: X.pildora + 'cqw', letterSpacing: '.02em', whiteSpace: 'nowrap' }}>
                {nombre}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Pie blanco (columnas con minmax: el CSS del panel para celulares busca "1fr 1fr" en el estilo) */}
      {P.tipo === 'fila' ? (
        <div style={{ position: 'relative', flex: 'none', minHeight: P.alto + 'cqw', background: '#ffffff', color: 'var(--blue-900, #002878)', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) auto', alignItems: 'center', gap: P.gap + 'cqw', padding: P.padding, boxSizing: 'border-box', borderTop: `${P.borde}cqw solid var(--brand-accent, #ffd100)` }}>
          {datoPie(T.dato1Label, T.dato1, 1)}
          {datoPie(T.dato2Label, T.dato2, 2)}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: P.rotuloWhatsappIzquierda ? 'flex-start' : 'flex-end', gap: P.separacion + 'cqw' }}>
            <div style={Object.assign({}, rotuloPie, { whiteSpace: 'nowrap', paddingLeft: (P.rotuloWhatsappIzquierda || 0) + 'cqw' })}>{rotuloWhatsapp}</div>
            {pastilla}
          </div>
        </div>
      ) : (
        <div style={{ position: 'relative', flex: 'none', background: '#ffffff', color: 'var(--blue-900, #002878)', borderTop: `${P.borde}cqw solid var(--brand-accent, #ffd100)`, padding: P.padding, display: 'flex', flexDirection: 'column', gap: P.gap + 'cqw' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: P.columnasGap + 'cqw' }}>
            {datoPie(T.dato1Label, T.dato1, 1)}
            {datoPie(T.dato2Label, T.dato2, 2)}
          </div>
          <div style={P.whatsappEnColumna
            ? { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', alignItems: 'center', justifyItems: 'start', gap: P.columnasGap + 'cqw', paddingTop: P.filaArriba + 'cqw', borderTop: '0.19cqw solid var(--blue-100, #c0d0f0)' }
            : { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2.22cqw', paddingTop: P.filaArriba + 'cqw', borderTop: '0.19cqw solid var(--blue-100, #c0d0f0)' }}>
            <div style={Object.assign({}, rotuloPie, { minWidth: 0 })}>{rotuloWhatsapp}</div>
            {pastilla}
          </div>
        </div>
      )}
    </div>
  );
}


/* =============================================================================
   PLANTILLAS 4 a 7 — Captación, Últimos cupos, Conmemoraciones patrias y Grilla de cursos.
   Son los diseños de "Sistema de Diseño/Promociones y Redes/templates/" tal cual: el mismo
   HTML y el mismo CSS, importado con herramientas/importar-estilos-plantillas.js (cada px
   del diseño pasa a calc(N * var(--u)), con --u = 1 px del diseño sobre el ancho del lienzo).
   Si se cambia un diseño allá, se vuelve a correr el script y se compila: no reescribir
   estas piezas a mano con otras medidas.
   ============================================================================= */
/* ESTILOS-DISENO:INICIO — generado por herramientas/importar-estilos-plantillas.js a partir de
   "Sistema de Diseño/Promociones y Redes/templates/". No editar a mano: cambiar el diseño y volver a correr el script. */
const CSS_PLANTILLAS_DISENO = {
  captacion: `
.pz-captacion.feed,.pz-captacion.stories{--u:calc(100cqw / 1080)}
.pz-captacion.a4{--u:calc(100cqw / 1240)}
.pz-captacion figure{margin:calc(16 * var(--u)) calc(40 * var(--u))}
.pz-captacion{--blue: #003890;--deep: #002878;--yellow: #ffd100;--paper: #ffffff;--soft: #f4f7fc;--pale: #c0d0f0;--ink: #18263d;--display: "Poppins", Arial, sans-serif;--body: "Source Sans 3", Arial, sans-serif;color-scheme: light}
.pz-captacion,.pz-captacion *{box-sizing: border-box}
.pz-captacion.board{position:absolute;inset:0;overflow: hidden;isolation: isolate;background-color: var(--paper);background-image: linear-gradient(rgba(192,208,240,.38) calc(1 * var(--u)), transparent calc(1 * var(--u))), linear-gradient(90deg, rgba(192,208,240,.38) calc(1 * var(--u)), transparent calc(1 * var(--u)));background-size: calc(48 * var(--u)) calc(48 * var(--u));color: var(--deep);font-family: var(--body)}
.pz-captacion.board.grid-off{background-image: none}
.pz-captacion .topline{position: absolute;inset: 0 0 auto;height: calc(12 * var(--u));background: var(--yellow)}
.pz-captacion .logo{position: absolute;display: block;object-fit: contain;object-position: left center}
.pz-captacion .eyebrow{color: var(--blue);font: 700 calc(20 * var(--u))/1.25 var(--body);letter-spacing: .13em;text-transform: uppercase}
.pz-captacion .headline{margin: 0;color: var(--deep);font: 800 calc(90 * var(--u))/1.04 var(--display);letter-spacing: -.045em;text-wrap: balance}
.pz-captacion .headline .accent{display: inline-block;padding: 0 .12em .02em;background: var(--yellow);color: var(--deep);box-shadow: calc(9 * var(--u)) calc(9 * var(--u)) 0 var(--deep);transform: rotate(-1deg)}
.pz-captacion .deck{margin: 0;color: #28364c;font: 600 calc(30 * var(--u))/1.35 var(--body)}
.pz-captacion .proof{display: flex;flex-wrap: wrap;gap: calc(12 * var(--u))}
.pz-captacion .proof span{display: inline-flex;align-items: center;min-height: calc(44 * var(--u));padding: calc(8 * var(--u)) calc(16 * var(--u));border: calc(2 * var(--u)) solid var(--blue);border-radius: calc(999 * var(--u));color: var(--blue);font: 700 calc(19 * var(--u))/1.1 var(--body)}
.pz-captacion .proof span:first-child{background: var(--blue);color: #fff}
.pz-captacion .photo-frame{position: absolute;overflow: hidden;background: var(--yellow)}
.pz-captacion .photo-frame img{display: block;width: 100%;height: 100%;object-fit: cover;object-position: 54% 50%}
.pz-captacion .photo-frame::after{position: absolute;inset: 0;content: "";pointer-events: none;background: linear-gradient(180deg, rgba(0,40,120,0) 57%, rgba(0,40,120,.5) 100%)}
.pz-captacion .photo-tag{position: absolute;z-index: 2;padding: calc(11 * var(--u)) calc(18 * var(--u));background: var(--yellow);color: var(--deep);font: 800 calc(17 * var(--u))/1 var(--display);letter-spacing: .06em;text-transform: uppercase}
.pz-captacion .cta-band{position: absolute;display: flex;align-items: center;justify-content: space-between;gap: calc(28 * var(--u));background: var(--blue);color: #fff}
.pz-captacion .cta-label{color: var(--yellow);font: 700 calc(18 * var(--u))/1.25 var(--body);letter-spacing: .12em;text-transform: uppercase}
.pz-captacion .cta-title{margin: calc(8 * var(--u)) 0 0;color: #fff;font: 800 calc(32 * var(--u))/1.12 var(--display);text-transform: uppercase}
.pz-captacion .wa{position: absolute;top: 50%;left: 74.5%;display: flex;flex-direction: column;align-items: center;gap: calc(4 * var(--u));margin-left: 0;transform: translate(-50%, -50%);color: var(--deep);font: 700 calc(18 * var(--u))/1.1 var(--body);text-align: center}
.pz-captacion .wa b{display: inline-block;padding: calc(11 * var(--u)) calc(19 * var(--u));border-radius: calc(999 * var(--u));background: var(--yellow);color: var(--deep);font: 800 calc(29 * var(--u))/1 var(--display);white-space: nowrap}
.pz-captacion .wa small{align-self: flex-end;margin-right: calc(19 * var(--u));color: #e5edfc;font: 600 calc(16 * var(--u))/1.2 var(--body)}
.pz-captacion .address{color: inherit;font: 600 calc(16 * var(--u))/1.25 var(--body)}
.pz-captacion.feed .logo{top: calc(62 * var(--u));left: calc(64 * var(--u));width: calc(360 * var(--u));height: calc(50 * var(--u))}
.pz-captacion.feed .eyebrow{position: absolute;top: calc(178 * var(--u));left: calc(66 * var(--u));width: calc(500 * var(--u))}
.pz-captacion.feed .headline{position: absolute;top: calc(225 * var(--u));left: calc(62 * var(--u));width: calc(490 * var(--u));font-size: calc(74 * var(--u))}
.pz-captacion.feed .deck{position: absolute;top: calc(515 * var(--u));left: calc(68 * var(--u));width: calc(420 * var(--u))}
.pz-captacion.feed .proof{position: absolute;top: calc(700 * var(--u));left: calc(66 * var(--u));width: calc(450 * var(--u))}
.pz-captacion.feed .photo-frame{top: calc(170 * var(--u));right: calc(38 * var(--u));width: calc(420 * var(--u));height: calc(730 * var(--u));padding: calc(10 * var(--u));clip-path: polygon(17% 0,100% 0,100% 100%,0 100%,0 16%)}
.pz-captacion.feed .photo-frame img{clip-path: polygon(17% 0,100% 0,100% 100%,0 100%,0 16%)}
.pz-captacion.feed .photo-tag{left: 0;bottom: calc(60 * var(--u))}
.pz-captacion.feed .cta-band{left: 0;right: 0;top: calc(1065 * var(--u));bottom: 0;min-height: calc(285 * var(--u));padding: calc(44 * var(--u)) calc(64 * var(--u)) calc(56 * var(--u));justify-content: flex-start;gap: calc(56 * var(--u))}
.pz-captacion.feed .cta-copy{max-width: calc(530 * var(--u))}
.pz-captacion.feed .cta-title{max-width: calc(510 * var(--u));font-size: calc(31 * var(--u))}
.pz-captacion.feed .wa > span{color: #fff}
.pz-captacion.feed .address{margin-top: calc(8 * var(--u));color: #e5edfc}
.pz-captacion.stories .logo{top: calc(174 * var(--u));left: calc(58 * var(--u));width: calc(380 * var(--u));height: calc(52 * var(--u))}
.pz-captacion.stories .eyebrow{position: absolute;top: calc(252 * var(--u));left: calc(64 * var(--u))}
.pz-captacion.stories .headline{position: absolute;top: calc(300 * var(--u));left: calc(57 * var(--u));width: calc(965 * var(--u));font-size: calc(80 * var(--u))}
.pz-captacion.stories .deck{position: absolute;top: calc(530 * var(--u));left: calc(64 * var(--u));width: calc(780 * var(--u));font-size: calc(29 * var(--u))}
.pz-captacion.stories .photo-frame{top: calc(650 * var(--u));left: 0;width: calc(1080 * var(--u));height: calc(570 * var(--u));padding: calc(12 * var(--u)) 0;clip-path: polygon(0 8%,100% 0,100% 92%,0 100%)}
.pz-captacion.stories .photo-frame img{clip-path: polygon(0 8%,100% 0,100% 92%,0 100%);object-position: 50% 44%}
.pz-captacion.stories .photo-tag{right: calc(64 * var(--u));bottom: calc(42 * var(--u))}
.pz-captacion.stories .proof{position: absolute;top: calc(1265 * var(--u));left: calc(62 * var(--u));width: calc(956 * var(--u));justify-content: center}
.pz-captacion.stories .cta-band{left: 0;right: 0;top: calc(1479 * var(--u));min-height: calc(237 * var(--u));padding: calc(38 * var(--u)) calc(62 * var(--u));align-items: center;justify-content: flex-start;gap: calc(48 * var(--u))}
.pz-captacion.stories .cta-copy{max-width: calc(560 * var(--u))}
.pz-captacion.stories .cta-title{max-width: calc(520 * var(--u));font-size: calc(30 * var(--u))}
.pz-captacion.stories .wa > span{color: #fff}
.pz-captacion.stories .address{color: #e5edfc}
.pz-captacion.a4 .logo{top: calc(82 * var(--u));left: calc(76 * var(--u));width: calc(430 * var(--u));height: calc(62 * var(--u))}
.pz-captacion.a4 .eyebrow{position: absolute;top: calc(210 * var(--u));left: calc(78 * var(--u))}
.pz-captacion.a4 .headline{position: absolute;top: calc(268 * var(--u));left: calc(72 * var(--u));width: calc(500 * var(--u));font-size: calc(88 * var(--u))}
.pz-captacion.a4 .deck{position: absolute;top: calc(635 * var(--u));left: calc(80 * var(--u));width: calc(470 * var(--u));font-size: calc(34 * var(--u))}
.pz-captacion.a4 .proof{position: absolute;top: calc(880 * var(--u));left: calc(78 * var(--u));width: calc(520 * var(--u))}
.pz-captacion.a4 .photo-frame{top: calc(198 * var(--u));right: calc(54 * var(--u));width: calc(480 * var(--u));height: calc(1000 * var(--u));padding: calc(12 * var(--u));clip-path: polygon(17% 0,100% 0,100% 100%,0 100%,0 15%)}
.pz-captacion.a4 .photo-frame img{clip-path: polygon(17% 0,100% 0,100% 100%,0 100%,0 15%)}
.pz-captacion.a4 .photo-tag{left: 0;bottom: calc(68 * var(--u));font-size: calc(19 * var(--u))}
.pz-captacion.a4 .cta-band{inset: auto 0 0;min-height: calc(330 * var(--u));padding: calc(52 * var(--u)) calc(78 * var(--u)) calc(58 * var(--u));justify-content: flex-start;gap: calc(56 * var(--u))}
.pz-captacion.a4 .cta-copy{max-width: calc(630 * var(--u))}
.pz-captacion.a4 .cta-title{max-width: calc(600 * var(--u));font-size: calc(36 * var(--u))}
.pz-captacion.a4 .wa > span{color: #fff}
.pz-captacion.a4 .wa b{font-size: calc(32 * var(--u))}
.pz-captacion.a4 .address{margin-top: calc(10 * var(--u));color: #e5edfc;font-size: calc(18 * var(--u))}
.pz-captacion.a4 .edit-note{bottom: calc(18 * var(--u))}
`,
  cupos: `
.pz-cupos.feed,.pz-cupos.stories{--u:calc(100cqw / 1080)}
.pz-cupos.a4{--u:calc(100cqw / 1240)}
.pz-cupos figure{margin:calc(16 * var(--u)) calc(40 * var(--u))}
.pz-cupos{--blue:#003890;--deep:#002878;--yellow:#ffd100;--paper:#fff;--soft:#f4f7fc;--grid:#c0d0f0;--ink:#18263d;--display:"Poppins",Arial,sans-serif;--body:"Source Sans 3",Arial,sans-serif}
.pz-cupos,.pz-cupos *{box-sizing:border-box}
.pz-cupos.board{position:absolute;inset:0;overflow:hidden;isolation:isolate;background-color:var(--paper);background-image:linear-gradient(rgba(192,208,240,.38) calc(1 * var(--u)),transparent calc(1 * var(--u))),linear-gradient(90deg,rgba(192,208,240,.38) calc(1 * var(--u)),transparent calc(1 * var(--u)));background-size:calc(48 * var(--u)) calc(48 * var(--u));color:var(--deep);font-family:var(--body)}
.pz-cupos.board.grid-off{background-image:none}
.pz-cupos .topline{position:absolute;inset:0 0 auto;height:calc(12 * var(--u));background:var(--yellow)}
.pz-cupos .logo{position:absolute;display:block;object-fit:contain;object-position:left center}
.pz-cupos .eyebrow{position:absolute;color:var(--blue);font:700 calc(20 * var(--u))/1.25 var(--body);letter-spacing:.13em;text-transform:uppercase}
.pz-cupos .headline{position:absolute;margin:0;color:var(--deep);font:800 calc(88 * var(--u))/1.06 var(--display);letter-spacing:-.045em;text-wrap:balance;overflow:hidden}
.pz-cupos .headline .accent{color:var(--blue);text-decoration:underline;text-decoration-color:var(--yellow);text-decoration-thickness:.16em;text-underline-offset:.08em}
.pz-cupos .course-tag{position:absolute;display:flex;align-items:center;justify-content:center;padding:calc(8 * var(--u)) calc(22 * var(--u));border-radius:calc(999 * var(--u));background:var(--blue);color:#fff;font:800 calc(23 * var(--u))/1.15 var(--display);letter-spacing:.015em;text-align:center}
.pz-cupos .deck{position:absolute;margin:0;color:#28364c;font:600 calc(29 * var(--u))/1.35 var(--body);text-wrap:balance}
.pz-cupos .proof{position:absolute;display:flex;flex-wrap:wrap;align-items:center;gap:calc(14 * var(--u))}
.pz-cupos .proof span{display:inline-flex;align-items:center;justify-content:center;min-height:calc(54 * var(--u));padding:calc(10 * var(--u)) calc(18 * var(--u));border:calc(2 * var(--u)) solid var(--blue);border-radius:calc(999 * var(--u));color:var(--blue);font:800 calc(16 * var(--u))/1.1 var(--display);text-align:center}
.pz-cupos .proof span:first-child{border-color:var(--blue);background:var(--blue);color:#fff}
.pz-cupos .course-details{position:absolute;color:var(--blue);font:700 calc(21 * var(--u))/1.3 var(--body);letter-spacing:.025em}
.pz-cupos .photo-frame{position:absolute;margin:0;overflow:hidden;padding:calc(10 * var(--u));background:var(--yellow);clip-path:polygon(7% 0,100% 0,100% 100%,0 100%,0 8%);filter:drop-shadow(calc(10 * var(--u)) calc(10 * var(--u)) 0 rgba(0,40,120,.68))}
.pz-cupos .photo-frame img{display:block;width:100%;height:100%;object-fit:cover;clip-path:polygon(6% 0,100% 0,100% 100%,0 100%,0 8%)}
.pz-cupos .photo-frame figcaption{position:absolute;right:calc(10 * var(--u));bottom:calc(10 * var(--u));max-width:calc(100% - calc(24 * var(--u)));padding:calc(10 * var(--u)) calc(16 * var(--u));background:var(--yellow);color:var(--deep);font:800 calc(15 * var(--u))/1.1 var(--display);letter-spacing:.08em;text-align:center;text-transform:uppercase}
.pz-cupos .footer-band{position:absolute;inset:auto 0 0;background:var(--blue);color:#fff}
.pz-cupos .footer-copy{position:absolute}
.pz-cupos .footer-kicker{margin:0 0 calc(8 * var(--u));color:var(--yellow);font:700 calc(18 * var(--u))/1.2 var(--body);letter-spacing:.12em;text-transform:uppercase}
.pz-cupos .footer-title{margin:0;color:#fff;font:800 calc(28 * var(--u))/1.18 var(--display);text-transform:uppercase}
.pz-cupos .contact{position:absolute;left:74.5%;display:flex;align-items:center;flex-direction:column;transform:translateX(-50%)}
.pz-cupos .contact-label{color:#fff;font:800 calc(17 * var(--u))/1.2 var(--display);text-align:center}
.pz-cupos .phone{min-width:calc(250 * var(--u));margin-top:calc(8 * var(--u));padding:calc(7 * var(--u)) calc(16 * var(--u));border-radius:calc(999 * var(--u));background:var(--yellow);color:var(--deep);font:800 calc(29 * var(--u))/1.1 var(--display);text-align:center;white-space:nowrap}
.pz-cupos .note{width:calc(250 * var(--u));margin-top:calc(5 * var(--u));color:#fff;font:600 calc(15 * var(--u))/1.15 var(--body);text-align:right}
.pz-cupos.feed .logo{top:calc(62 * var(--u));left:calc(66 * var(--u));width:calc(350 * var(--u));height:calc(50 * var(--u))}
.pz-cupos.feed .eyebrow{top:calc(154 * var(--u));left:calc(68 * var(--u))}
.pz-cupos.feed .headline{top:calc(218 * var(--u));left:calc(62 * var(--u));width:calc(490 * var(--u));height:calc(225 * var(--u));font-size:calc(84 * var(--u))}
.pz-cupos.feed .course-tag{top:calc(472 * var(--u));left:calc(68 * var(--u));width:calc(470 * var(--u));min-height:calc(60 * var(--u))}
.pz-cupos.feed .deck{top:calc(565 * var(--u));left:calc(72 * var(--u));width:calc(440 * var(--u));max-height:calc(120 * var(--u))}
.pz-cupos.feed .proof{top:calc(726 * var(--u));left:calc(68 * var(--u));width:calc(475 * var(--u))}
.pz-cupos.feed .course-details{top:calc(850 * var(--u));left:calc(72 * var(--u));width:calc(470 * var(--u))}
.pz-cupos.feed .photo-frame{top:calc(230 * var(--u));left:calc(590 * var(--u));width:calc(420 * var(--u));height:calc(735 * var(--u))}
.pz-cupos.feed .footer-band{height:calc(260 * var(--u))}
.pz-cupos.feed .footer-copy{top:calc(74 * var(--u));left:calc(68 * var(--u));width:calc(520 * var(--u))}
.pz-cupos.feed .contact{top:calc(61 * var(--u));width:calc(286 * var(--u))}
.pz-cupos.stories .logo{top:calc(166 * var(--u));left:calc(66 * var(--u));width:calc(440 * var(--u));height:calc(62 * var(--u))}
.pz-cupos.stories .eyebrow{top:calc(276 * var(--u));left:calc(68 * var(--u))}
.pz-cupos.stories .headline{top:calc(346 * var(--u));left:calc(68 * var(--u));width:calc(944 * var(--u));height:calc(224 * var(--u));font-size:calc(96 * var(--u));text-align:center}
.pz-cupos.stories .photo-frame{top:calc(620 * var(--u));left:calc(200 * var(--u));width:calc(680 * var(--u));height:calc(460 * var(--u))}
.pz-cupos.stories .photo-frame figcaption{right:calc(18 * var(--u));bottom:calc(18 * var(--u));font-size:calc(18 * var(--u))}
.pz-cupos.stories .course-tag{top:calc(1120 * var(--u));left:calc(160 * var(--u));width:calc(760 * var(--u));min-height:calc(62 * var(--u));font-size:calc(26 * var(--u))}
.pz-cupos.stories .deck{top:calc(1220 * var(--u));left:calc(150 * var(--u));width:calc(780 * var(--u));max-height:calc(100 * var(--u));font-size:calc(32 * var(--u));text-align:center}
.pz-cupos.stories .proof{top:calc(1360 * var(--u));left:50%;width:max-content;max-width:calc(900 * var(--u));justify-content:center;transform:translateX(-50%)}
.pz-cupos.stories .proof span{min-height:calc(58 * var(--u));font-size:calc(18 * var(--u))}
.pz-cupos.stories .course-details{top:calc(1440 * var(--u));left:calc(150 * var(--u));width:calc(780 * var(--u));text-align:center}
.pz-cupos.stories .footer-band{top:calc(1510 * var(--u));height:calc(260 * var(--u))}
.pz-cupos.stories .footer-copy{top:calc(66 * var(--u));left:calc(70 * var(--u));width:calc(510 * var(--u))}
.pz-cupos.stories .footer-kicker{font-size:calc(19 * var(--u))}
.pz-cupos.stories .footer-title{font-size:calc(32 * var(--u))}
.pz-cupos.stories .contact{top:calc(54 * var(--u));width:calc(340 * var(--u))}
.pz-cupos.stories .contact-label{font-size:calc(18 * var(--u))}
.pz-cupos.stories .phone{min-width:calc(270 * var(--u));font-size:calc(32 * var(--u))}
.pz-cupos.stories .note{width:calc(270 * var(--u))}
.pz-cupos.a4 .logo{top:calc(86 * var(--u));left:calc(80 * var(--u));width:calc(430 * var(--u));height:calc(62 * var(--u))}
.pz-cupos.a4 .eyebrow{top:calc(228 * var(--u));left:calc(82 * var(--u))}
.pz-cupos.a4 .headline{top:calc(306 * var(--u));left:calc(74 * var(--u));width:calc(570 * var(--u));height:calc(260 * var(--u));font-size:calc(94 * var(--u))}
.pz-cupos.a4 .course-tag{top:calc(610 * var(--u));left:calc(82 * var(--u));width:calc(540 * var(--u));min-height:calc(68 * var(--u));font-size:calc(26 * var(--u))}
.pz-cupos.a4 .deck{top:calc(720 * var(--u));left:calc(86 * var(--u));width:calc(520 * var(--u));max-height:calc(150 * var(--u));font-size:calc(34 * var(--u))}
.pz-cupos.a4 .proof{top:calc(910 * var(--u));left:calc(82 * var(--u));width:calc(540 * var(--u));gap:calc(12 * var(--u))}
.pz-cupos.a4 .proof span{min-height:calc(60 * var(--u));font-size:calc(17 * var(--u))}
.pz-cupos.a4 .course-details{top:calc(1055 * var(--u));left:calc(86 * var(--u));width:calc(520 * var(--u));font-size:calc(24 * var(--u))}
.pz-cupos.a4 .photo-frame{top:calc(365 * var(--u));right:calc(78 * var(--u));width:calc(480 * var(--u));height:calc(1030 * var(--u))}
.pz-cupos.a4 .photo-frame figcaption{right:calc(16 * var(--u));bottom:calc(16 * var(--u));font-size:calc(17 * var(--u))}
.pz-cupos.a4 .footer-band{height:calc(254 * var(--u))}
.pz-cupos.a4 .footer-copy{top:calc(72 * var(--u));left:calc(82 * var(--u));width:calc(590 * var(--u))}
.pz-cupos.a4 .footer-kicker{font-size:calc(20 * var(--u))}
.pz-cupos.a4 .footer-title{font-size:calc(34 * var(--u))}
.pz-cupos.a4 .contact{top:calc(55 * var(--u));width:calc(320 * var(--u))}
.pz-cupos.a4 .contact-label{font-size:calc(19 * var(--u))}
.pz-cupos.a4 .phone{min-width:calc(280 * var(--u));font-size:calc(32 * var(--u))}
.pz-cupos.a4 .note{width:calc(280 * var(--u))}
`,
  patrias: `
.pz-patrias.feed,.pz-patrias.stories{--u:calc(100cqw / 1080)}
.pz-patrias.a4{--u:calc(100cqw / 1240)}
.pz-patrias figure{margin:calc(16 * var(--u)) calc(40 * var(--u))}
.pz-patrias{--blue: #003890;--deep: #002878;--yellow: #ffd100;--paper: #fff;--soft: #f4f7fc;--grid: #c0d0f0;--ink: #18263d;--celeste: #75aadb;--display: "Poppins", Arial, sans-serif;--body: "Source Sans 3", Arial, sans-serif;color-scheme: light}
.pz-patrias,.pz-patrias *{box-sizing: border-box}
.pz-patrias.board{position:absolute;inset:0;overflow: hidden;isolation: isolate;background-color: var(--paper);background-image: linear-gradient(rgba(192,208,240,.38) calc(1 * var(--u)),transparent calc(1 * var(--u))),linear-gradient(90deg,rgba(192,208,240,.38) calc(1 * var(--u)),transparent calc(1 * var(--u)));background-size: calc(48 * var(--u)) calc(48 * var(--u));color: var(--deep);font-family: var(--body)}
.pz-patrias.board.grid-off{background-image: none}
.pz-patrias .topline{position: absolute;inset: 0 0 auto;height: calc(12 * var(--u));background: var(--yellow)}
.pz-patrias .logo{position: absolute;display: block;object-fit: contain;object-position: left center}
.pz-patrias .eyebrow{position: absolute;color: var(--blue);font: 700 calc(20 * var(--u))/1.25 var(--body);letter-spacing: .13em;text-transform: uppercase}
.pz-patrias .headline{position: absolute;margin: 0;color: var(--deep);font: 800 calc(86 * var(--u))/1.06 var(--display);letter-spacing: -.045em;text-wrap: balance;overflow: hidden}
.pz-patrias .headline .accent{color: var(--blue);text-decoration: underline;text-decoration-color: var(--yellow);text-decoration-thickness: .16em;text-underline-offset: .08em}
.pz-patrias .date-pill{position: absolute;display: inline-flex;align-items: center;justify-content: center;min-height: calc(54 * var(--u));padding: calc(10 * var(--u)) calc(22 * var(--u));border-radius: calc(999 * var(--u));background: var(--yellow);color: var(--deep);font: 800 calc(24 * var(--u))/1.1 var(--display);letter-spacing: .04em}
.pz-patrias .deck{position: absolute;margin: 0;color: #28364c;font: 600 calc(30 * var(--u))/1.35 var(--body);text-wrap: balance}
.pz-patrias .flag-block{position: absolute;margin: 0}
.pz-patrias .flag-frame{width: 100%;aspect-ratio: 3 / 2;padding: calc(10 * var(--u));background: var(--yellow);clip-path: polygon(6% 0,100% 0,100% 100%,0 100%,0 10%);filter: drop-shadow(calc(9 * var(--u)) calc(9 * var(--u)) 0 var(--deep))}
.pz-patrias .flag-frame svg{display: block;width: 100%;height: 100%;clip-path: polygon(6% 0,100% 0,100% 100%,0 100%,0 10%)}
.pz-patrias .flag-frame img{display:block;width:100%;height:100%;object-fit:cover;clip-path:polygon(6% 0,100% 0,100% 100%,0 100%,0 10%)}
.pz-patrias .flag-caption{margin-top: calc(20 * var(--u));color: var(--blue);font: 800 calc(17 * var(--u))/1.2 var(--display);letter-spacing: .12em;text-align: center;text-transform: uppercase}
.pz-patrias .footer-band{position: absolute;inset: auto 0 0;display: flex;align-items: center;justify-content: center;flex-direction: column;gap: calc(10 * var(--u));background: var(--blue);color: #fff;text-align: center}
.pz-patrias .footer-kicker{color: var(--yellow);font: 700 calc(17 * var(--u))/1.2 var(--body);letter-spacing: .15em;text-transform: uppercase}
.pz-patrias .footer-title{margin: 0;color: #fff;font: 800 calc(30 * var(--u))/1.15 var(--display);letter-spacing: .015em;text-transform: uppercase}
.pz-patrias.feed{background-image:linear-gradient(90deg,rgba(0,40,120,.94) 0%,rgba(0,40,120,.88) 38%,rgba(0,40,120,.46) 68%,rgba(0,40,120,.12) 100%),linear-gradient(rgba(255,255,255,.11) calc(1 * var(--u)),transparent calc(1 * var(--u))),linear-gradient(90deg,rgba(255,255,255,.11) calc(1 * var(--u)),transparent calc(1 * var(--u))),var(--photo-url);background-size:cover,calc(48 * var(--u)) calc(48 * var(--u)),calc(48 * var(--u)) calc(48 * var(--u)),cover;background-position:center;background-repeat:no-repeat,repeat,repeat,no-repeat}
.pz-patrias.feed.grid-off{background-image:linear-gradient(90deg,rgba(0,40,120,.94) 0%,rgba(0,40,120,.88) 38%,rgba(0,40,120,.46) 68%,rgba(0,40,120,.12) 100%),var(--photo-url);background-size:cover,cover;background-position:center,center;background-repeat:no-repeat,no-repeat}
.pz-patrias.feed .logo{top:calc(62 * var(--u));left:calc(66 * var(--u));width:calc(360 * var(--u));height:calc(50 * var(--u))}
.pz-patrias.feed .eyebrow{top:calc(168 * var(--u));left:calc(68 * var(--u));color:var(--yellow)}
.pz-patrias.feed .headline{top:calc(235 * var(--u));left:calc(64 * var(--u));width:calc(500 * var(--u));height:calc(240 * var(--u));color:#fff;font-size:calc(82 * var(--u))}
.pz-patrias.feed .headline .accent{color:var(--yellow);text-decoration-color:#fff}
.pz-patrias.feed .date-pill{top:calc(478 * var(--u));left:calc(68 * var(--u))}
.pz-patrias.feed .deck{top:calc(572 * var(--u));left:calc(70 * var(--u));width:calc(440 * var(--u));max-height:calc(138 * var(--u));color:#fff}
.pz-patrias.feed .footer-band{height:calc(190 * var(--u));padding:calc(30 * var(--u)) calc(66 * var(--u))}
.pz-patrias.stories .logo{top:calc(164 * var(--u));left:calc(66 * var(--u));width:calc(410 * var(--u));height:calc(58 * var(--u))}
.pz-patrias.stories .eyebrow{top:calc(275 * var(--u));left:calc(68 * var(--u))}
.pz-patrias.stories .headline{top:calc(350 * var(--u));left:calc(68 * var(--u));width:calc(944 * var(--u));height:calc(238 * var(--u));font-size:calc(92 * var(--u))}
.pz-patrias.stories .date-pill{top:calc(604 * var(--u));left:50%;transform:translateX(-50%);min-height:calc(60 * var(--u));padding-inline:calc(34 * var(--u));font-size:calc(28 * var(--u))}
.pz-patrias.stories .flag-block{top:calc(760 * var(--u));left:50%;width:calc(790 * var(--u));transform:translateX(-50%)}
.pz-patrias.stories .flag-caption{margin-top:calc(26 * var(--u));font-size:calc(19 * var(--u))}
.pz-patrias.stories .deck{top:calc(1390 * var(--u));left:calc(130 * var(--u));width:calc(820 * var(--u));max-height:calc(126 * var(--u));font-size:calc(34 * var(--u));text-align:center}
.pz-patrias.stories .footer-band{top:calc(1600 * var(--u));height:calc(240 * var(--u));padding:calc(26 * var(--u)) calc(76 * var(--u))}
.pz-patrias.stories .footer-kicker{font-size:calc(19 * var(--u))}
.pz-patrias.stories .footer-title{font-size:calc(36 * var(--u))}
.pz-patrias.a4{background-image:linear-gradient(90deg,rgba(0,40,120,.96) 0%,rgba(0,40,120,.91) 43%,rgba(0,40,120,.58) 63%,rgba(0,40,120,.08) 100%),linear-gradient(rgba(255,255,255,.11) calc(1 * var(--u)),transparent calc(1 * var(--u))),linear-gradient(90deg,rgba(255,255,255,.11) calc(1 * var(--u)),transparent calc(1 * var(--u))),var(--photo-url);background-size:cover,calc(48 * var(--u)) calc(48 * var(--u)),calc(48 * var(--u)) calc(48 * var(--u)),cover;background-position:center;background-repeat:no-repeat,repeat,repeat,no-repeat}
.pz-patrias.a4.grid-off{background-image:linear-gradient(90deg,rgba(0,40,120,.96) 0%,rgba(0,40,120,.91) 43%,rgba(0,40,120,.58) 63%,rgba(0,40,120,.08) 100%),var(--photo-url);background-size:cover,cover;background-position:center,center;background-repeat:no-repeat,no-repeat}
.pz-patrias.a4 .logo{top:calc(82 * var(--u));left:calc(78 * var(--u));width:calc(430 * var(--u));height:calc(62 * var(--u))}
.pz-patrias.a4 .eyebrow{top:calc(218 * var(--u));left:calc(80 * var(--u));color:var(--yellow)}
.pz-patrias.a4 .headline{top:calc(306 * var(--u));left:calc(74 * var(--u));width:calc(580 * var(--u));height:calc(248 * var(--u));color:#fff;font-size:calc(94 * var(--u))}
.pz-patrias.a4 .headline .accent{color:var(--yellow);text-decoration-color:#fff}
.pz-patrias.a4 .date-pill{top:calc(610 * var(--u));left:calc(80 * var(--u));min-height:calc(62 * var(--u));padding-inline:calc(28 * var(--u));font-size:calc(29 * var(--u))}
.pz-patrias.a4 .deck{top:calc(720 * var(--u));left:calc(84 * var(--u));width:calc(520 * var(--u));max-height:calc(180 * var(--u));color:#fff;font-size:calc(35 * var(--u))}
.pz-patrias.a4 .footer-band{height:calc(220 * var(--u));padding:calc(36 * var(--u)) calc(80 * var(--u))}
.pz-patrias.a4 .footer-kicker{font-size:calc(19 * var(--u))}
.pz-patrias.a4 .footer-title{font-size:calc(36 * var(--u))}
`,
  grilla: `
.pz-grilla.feed,.pz-grilla.stories{--u:calc(100cqw / 1080)}
.pz-grilla.a4{--u:calc(100cqw / 1240)}
.pz-grilla figure{margin:calc(16 * var(--u)) calc(40 * var(--u))}
.pz-grilla{--blue:#003890;--deep:#002878;--yellow:#ffd100;--paper:#fff;--soft:#f4f7fc;--grid:#c0d0f0;--ink:#18263d;--display:"Poppins",Arial,sans-serif;--body:"Source Sans 3",Arial,sans-serif}
.pz-grilla,.pz-grilla *{box-sizing:border-box}
.pz-grilla.board{position:absolute;inset:0;overflow:hidden;isolation:isolate;background-color:var(--paper);background-image:linear-gradient(rgba(192,208,240,.38) calc(1 * var(--u)),transparent calc(1 * var(--u))),linear-gradient(90deg,rgba(192,208,240,.38) calc(1 * var(--u)),transparent calc(1 * var(--u)));background-size:calc(48 * var(--u)) calc(48 * var(--u));color:var(--deep);font-family:var(--body)}
.pz-grilla.board.grid-off{background-image:none}
.pz-grilla .topline{position:absolute;inset:0 0 auto;height:calc(12 * var(--u));background:var(--yellow)}
.pz-grilla .logo{position:absolute;display:block;object-fit:contain;object-position:left center}
.pz-grilla .campaign-ribbon{position:absolute;display:flex;align-items:center;justify-content:center;min-height:calc(48 * var(--u));padding:calc(10 * var(--u)) calc(20 * var(--u));background:var(--yellow);color:var(--deep);font:800 calc(19 * var(--u))/1 var(--display);letter-spacing:.04em;box-shadow:calc(6 * var(--u)) calc(6 * var(--u)) 0 var(--deep);transform:rotate(-2deg)}
.pz-grilla .eyebrow{position:absolute;color:var(--blue);font:700 calc(18 * var(--u))/1.25 var(--body);letter-spacing:.12em;text-transform:uppercase}
.pz-grilla .headline{position:absolute;margin:0;color:var(--deep);font:800 calc(62 * var(--u))/1.08 var(--display);letter-spacing:-.04em;text-transform:uppercase}
.pz-grilla .period-line{position:absolute;color:#384962;font:700 calc(24 * var(--u))/1.15 var(--body);letter-spacing:.06em}
.pz-grilla .period-line strong{color:var(--blue);font:800 1.05em var(--display)}
.pz-grilla .course-counter{position:absolute;display:flex;align-items:center;justify-content:center;gap:calc(13 * var(--u));border:calc(2 * var(--u)) solid var(--blue);border-radius:calc(18 * var(--u)) calc(18 * var(--u)) calc(18 * var(--u)) calc(4 * var(--u));background:#fff;box-shadow:calc(8 * var(--u)) calc(8 * var(--u)) 0 var(--yellow)}
.pz-grilla .course-counter strong{color:var(--blue);font:800 calc(56 * var(--u))/.95 var(--display)}
.pz-grilla .course-counter span{color:var(--deep);font:800 calc(14 * var(--u))/1.1 var(--display);letter-spacing:.04em}
.pz-grilla .category-note{position:absolute;color:var(--blue);font:800 calc(15 * var(--u))/1.2 var(--display);letter-spacing:.13em}
.pz-grilla .course-grid{position:absolute;display:grid;grid-template-columns:repeat(var(--columns,1),minmax(0,1fr));grid-template-rows:repeat(var(--rows,1),minmax(0,1fr));gap:var(--grid-gap,calc(12 * var(--u)))}
.pz-grilla .course-card{position:relative;display:flex;flex-direction:column;min-width:0;min-height:0;padding:calc(10 * var(--u)) calc(12 * var(--u));overflow:hidden;border:calc(1 * var(--u)) solid #c0d0f0;border-left:calc(6 * var(--u)) solid var(--yellow);border-radius:calc(4 * var(--u)) calc(12 * var(--u)) calc(12 * var(--u)) calc(4 * var(--u));background:rgba(255,255,255,.97);box-shadow:0 calc(3 * var(--u)) calc(8 * var(--u)) rgba(0,40,120,.06)}
.pz-grilla .course-family{flex:0 0 auto;margin-bottom:calc(4 * var(--u));padding-right:calc(30 * var(--u));color:#53647e;font:700 calc(13 * var(--u))/1.15 var(--body);letter-spacing:.05em;text-transform:uppercase}
.pz-grilla .course-index{position:absolute;top:calc(9 * var(--u));right:calc(10 * var(--u));min-width:calc(26 * var(--u));color:#8aa0c2;font:700 calc(13 * var(--u))/1 var(--display);text-align:right}
.pz-grilla .course-heading{min-width:0}
.pz-grilla .course-name{color:var(--deep);font:800 var(--course-font,calc(18 * var(--u)))/1.12 var(--display);overflow-wrap:anywhere;hyphens:auto}
.pz-grilla .course-type{display:inline-block;max-width:100%;margin-top:calc(4 * var(--u));padding:calc(3 * var(--u)) calc(7 * var(--u));border-radius:calc(999 * var(--u));background:var(--blue);color:#fff;font:800 calc(11 * var(--u))/1.15 var(--display);letter-spacing:.03em;text-transform:uppercase}
.pz-grilla .course-details{display:grid;grid-template-columns:1fr;gap:calc(5 * var(--u));min-height:0;margin-top:calc(7 * var(--u))}
.pz-grilla .course-detail{min-width:0;margin:0;color:#24344f;font:600 calc(14 * var(--u))/1.18 var(--body);overflow-wrap:anywhere;hyphens:auto}
.pz-grilla .course-detail strong{display:block;margin-bottom:calc(1 * var(--u));color:#526580;font:800 calc(11 * var(--u))/1.1 var(--display);letter-spacing:.06em}
.pz-grilla .course-detail span{display:block}
.pz-grilla.rows .course-grid{grid-template-columns:1fr}
.pz-grilla.rows .course-card{display:grid;grid-template-columns:minmax(0,24fr) minmax(0,42fr) minmax(0,24fr) minmax(0,10fr);align-items:center;gap:calc(8 * var(--u));padding:var(--row-padding,calc(8 * var(--u)) calc(12 * var(--u)));border-left-width:calc(6 * var(--u))}
.pz-grilla.rows .course-index{top:calc(8 * var(--u));right:calc(8 * var(--u));font-size:calc(11 * var(--u))}
.pz-grilla.rows .course-index{display:none}
.pz-grilla.rows .course-family{display:none}
.pz-grilla.rows .course-name{font-size:var(--course-font,calc(17 * var(--u)));line-height:1.02}
.pz-grilla.rows .course-type{grid-column:4;grid-row:1;align-self:end;justify-self:end;max-width:100%;margin:0;padding:0;border-radius:0;background:none;color:#53647e;font-size:calc(9 * var(--u));line-height:1.05;text-align:right;white-space:nowrap}
.pz-grilla.rows .course-details{display:contents}
.pz-grilla.rows .course-schedule{grid-column:2;grid-row:1;padding-right:calc(5 * var(--u))}
.pz-grilla.rows .course-requirements{grid-column:3;grid-row:1}
.pz-grilla.rows .course-detail{font-size:var(--detail-font,calc(13 * var(--u)));line-height:1.08}
.pz-grilla.rows .course-detail strong{font-size:var(--label-font,calc(10 * var(--u)))}
.pz-grilla .empty-state{align-self:center;justify-self:center;max-width:calc(620 * var(--u));margin:0;color:#66758c;font:700 calc(24 * var(--u))/1.4 var(--body);text-align:center}
.pz-grilla .footer-band{position:absolute;inset:auto 0 0;background:var(--blue);color:#fff}
.pz-grilla .footer-copy{position:absolute}
.pz-grilla .footer-kicker{margin:0 0 calc(7 * var(--u));color:var(--yellow);font:700 calc(17 * var(--u))/1.2 var(--body);letter-spacing:.12em;text-transform:uppercase}
.pz-grilla .footer-title{margin:0;color:#fff;font:800 calc(26 * var(--u))/1.18 var(--display);text-transform:uppercase}
.pz-grilla .contact{position:absolute;left:74.5%;display:flex;align-items:center;flex-direction:column;transform:translateX(-50%)}
.pz-grilla .contact-label{color:#fff;font:800 calc(16 * var(--u))/1.2 var(--display);text-align:center}
.pz-grilla .phone{min-width:calc(244 * var(--u));margin-top:calc(6 * var(--u));padding:calc(6 * var(--u)) calc(14 * var(--u));border-radius:calc(999 * var(--u));background:var(--yellow);color:var(--deep);font:800 calc(27 * var(--u))/1.1 var(--display);text-align:center;white-space:nowrap}
.pz-grilla .note{width:calc(244 * var(--u));margin-top:calc(4 * var(--u));color:#fff;font:600 calc(14 * var(--u))/1.15 var(--body);text-align:right}
.pz-grilla.feed .logo{top:calc(50 * var(--u));left:calc(62 * var(--u));width:calc(330 * var(--u));height:calc(48 * var(--u))}
.pz-grilla.feed .campaign-ribbon{top:calc(54 * var(--u));right:calc(70 * var(--u))}
.pz-grilla.feed .eyebrow{top:calc(130 * var(--u));left:calc(65 * var(--u))}
.pz-grilla.feed .headline{top:calc(168 * var(--u));left:calc(61 * var(--u));width:calc(680 * var(--u));height:calc(76 * var(--u));font-size:calc(58 * var(--u))}
.pz-grilla.feed .period-line{top:calc(252 * var(--u));left:calc(66 * var(--u))}
.pz-grilla.feed .course-counter{top:calc(166 * var(--u));right:calc(78 * var(--u));width:calc(205 * var(--u));height:calc(100 * var(--u))}
.pz-grilla.feed .course-counter strong{font-size:calc(50 * var(--u))}
.pz-grilla.feed .category-note{top:calc(292 * var(--u));left:calc(66 * var(--u))}
.pz-grilla.feed .course-grid{top:calc(332 * var(--u));right:calc(58 * var(--u));bottom:calc(178 * var(--u));left:calc(58 * var(--u))}
.pz-grilla.feed.rows .course-grid{top:calc(286 * var(--u));bottom:calc(124 * var(--u))}
.pz-grilla.feed.rows .period-line{top:calc(238 * var(--u))}
.pz-grilla.feed.rows .course-counter,.pz-grilla.feed.rows .category-note{display:none}
.pz-grilla.feed.rows .footer-band{height:calc(116 * var(--u))}
.pz-grilla.feed.rows .footer-copy{top:calc(29 * var(--u))}
.pz-grilla.feed.rows .footer-kicker{margin-bottom:calc(4 * var(--u));font-size:calc(14 * var(--u))}
.pz-grilla.feed.rows .footer-title{font-size:calc(20 * var(--u))}
.pz-grilla.feed.rows .contact{top:calc(16 * var(--u))}
.pz-grilla.feed.rows .contact-label{font-size:calc(13 * var(--u))}
.pz-grilla.feed.rows .phone{min-width:calc(220 * var(--u));margin-top:calc(3 * var(--u));padding:calc(4 * var(--u)) calc(10 * var(--u));font-size:calc(22 * var(--u))}
.pz-grilla.feed.rows .note{width:calc(220 * var(--u));margin-top:calc(2 * var(--u));font-size:calc(11 * var(--u))}
.pz-grilla.feed .footer-band{height:calc(148 * var(--u))}
.pz-grilla.feed .footer-copy{top:calc(39 * var(--u));left:calc(66 * var(--u));width:calc(510 * var(--u))}
.pz-grilla.feed .contact{top:calc(26 * var(--u));width:calc(292 * var(--u))}
.pz-grilla.stories .logo{top:calc(160 * var(--u));left:calc(66 * var(--u));width:calc(440 * var(--u));height:calc(62 * var(--u))}
.pz-grilla.stories .campaign-ribbon{top:calc(161 * var(--u));right:calc(76 * var(--u));min-height:calc(54 * var(--u));font-size:calc(21 * var(--u))}
.pz-grilla.stories .eyebrow{top:calc(266 * var(--u));left:calc(68 * var(--u))}
.pz-grilla.stories .headline{top:calc(306 * var(--u));left:calc(68 * var(--u));width:calc(670 * var(--u));height:calc(94 * var(--u));font-size:calc(70 * var(--u))}
.pz-grilla.stories .period-line{top:calc(470 * var(--u));left:calc(72 * var(--u));font-size:calc(27 * var(--u))}
.pz-grilla.stories .course-counter{top:calc(306 * var(--u));right:calc(72 * var(--u));width:calc(232 * var(--u));height:calc(126 * var(--u))}
.pz-grilla.stories .course-counter strong{font-size:calc(64 * var(--u))}
.pz-grilla.stories .category-note{top:calc(514 * var(--u));left:calc(72 * var(--u));font-size:calc(17 * var(--u))}
.pz-grilla.stories .course-grid{top:calc(556 * var(--u));right:calc(58 * var(--u));bottom:calc(340 * var(--u));left:calc(58 * var(--u))}
.pz-grilla.stories .course-card{padding:calc(12 * var(--u)) calc(14 * var(--u))}
.pz-grilla.stories .course-family{font-size:calc(14 * var(--u))}
.pz-grilla.stories .course-grid .course-detail{font-size:calc(15 * var(--u))}
.pz-grilla.stories .course-grid .course-detail strong{font-size:calc(12 * var(--u))}
.pz-grilla.stories .course-type{font-size:calc(12 * var(--u))}
.pz-grilla.stories.rows .course-grid{top:calc(528 * var(--u));bottom:calc(340 * var(--u))}
.pz-grilla.stories.rows .logo{top:calc(76 * var(--u));left:calc(66 * var(--u))}
.pz-grilla.stories.rows .campaign-ribbon{top:calc(80 * var(--u))}
.pz-grilla.stories.rows .eyebrow{top:calc(166 * var(--u))}
.pz-grilla.stories.rows .headline{top:calc(204 * var(--u));width:calc(820 * var(--u));height:calc(76 * var(--u));font-size:calc(58 * var(--u))}
.pz-grilla.stories.rows .period-line{top:calc(282 * var(--u));font-size:calc(22 * var(--u))}
.pz-grilla.stories.rows .course-grid{top:calc(322 * var(--u));bottom:calc(320 * var(--u))}
.pz-grilla.stories.rows .course-counter,.pz-grilla.stories.rows .category-note{display:none}
.pz-grilla.stories.rows .course-detail{font-size:var(--detail-font,calc(13 * var(--u)))}
.pz-grilla.stories .footer-band{top:calc(1600 * var(--u));height:calc(170 * var(--u))}
.pz-grilla.stories .footer-copy{top:calc(42 * var(--u));left:calc(70 * var(--u));width:calc(510 * var(--u))}
.pz-grilla.stories .footer-kicker{font-size:calc(18 * var(--u))}
.pz-grilla.stories .footer-title{font-size:calc(30 * var(--u))}
.pz-grilla.stories .contact{top:calc(26 * var(--u));width:calc(340 * var(--u))}
.pz-grilla.stories .contact-label{font-size:calc(17 * var(--u))}
.pz-grilla.stories .phone{min-width:calc(260 * var(--u));font-size:calc(30 * var(--u))}
.pz-grilla.stories .note{width:calc(260 * var(--u))}
.pz-grilla.a4 .logo{top:calc(80 * var(--u));left:calc(82 * var(--u));width:calc(410 * var(--u));height:calc(58 * var(--u))}
.pz-grilla.a4 .campaign-ribbon{top:calc(86 * var(--u));right:calc(92 * var(--u));min-height:calc(56 * var(--u));font-size:calc(22 * var(--u))}
.pz-grilla.a4 .eyebrow{top:calc(190 * var(--u));left:calc(86 * var(--u));font-size:calc(20 * var(--u))}
.pz-grilla.a4 .headline{top:calc(235 * var(--u));left:calc(80 * var(--u));width:calc(760 * var(--u));height:calc(98 * var(--u));font-size:calc(76 * var(--u))}
.pz-grilla.a4 .period-line{top:calc(430 * var(--u));left:calc(86 * var(--u));font-size:calc(27 * var(--u))}
.pz-grilla.a4 .course-counter{top:calc(235 * var(--u));right:calc(94 * var(--u));width:calc(240 * var(--u));height:calc(130 * var(--u))}
.pz-grilla.a4 .course-counter strong{font-size:calc(66 * var(--u))}
.pz-grilla.a4 .category-note{top:calc(470 * var(--u));left:calc(86 * var(--u));font-size:calc(17 * var(--u))}
.pz-grilla.a4 .course-grid{top:calc(516 * var(--u));right:calc(82 * var(--u));bottom:calc(286 * var(--u));left:calc(82 * var(--u))}
.pz-grilla.a4 .course-card{padding:calc(12 * var(--u)) calc(14 * var(--u))}
.pz-grilla.a4 .course-family{font-size:calc(14 * var(--u))}
.pz-grilla.a4 .course-grid .course-detail{font-size:calc(15 * var(--u))}
.pz-grilla.a4 .course-grid .course-detail strong{font-size:calc(12 * var(--u))}
.pz-grilla.a4 .course-type{font-size:calc(12 * var(--u))}
.pz-grilla.a4.rows .course-grid{top:calc(462 * var(--u));bottom:calc(286 * var(--u))}
.pz-grilla.a4.rows .logo{top:calc(65 * var(--u))}
.pz-grilla.a4.rows .campaign-ribbon{top:calc(70 * var(--u))}
.pz-grilla.a4.rows .eyebrow{top:calc(155 * var(--u))}
.pz-grilla.a4.rows .headline{top:calc(194 * var(--u));height:calc(76 * var(--u));font-size:calc(62 * var(--u))}
.pz-grilla.a4.rows .period-line{top:calc(278 * var(--u));font-size:calc(23 * var(--u))}
.pz-grilla.a4.rows .course-grid{top:calc(322 * var(--u));bottom:calc(286 * var(--u))}
.pz-grilla.a4.rows .course-counter,.pz-grilla.a4.rows .category-note{display:none}
.pz-grilla.a4.rows .course-detail{font-size:var(--detail-font,calc(13 * var(--u)))}
.pz-grilla.a4 .footer-band{height:calc(194 * var(--u))}
.pz-grilla.a4 .footer-copy{top:calc(51 * var(--u));left:calc(84 * var(--u));width:calc(590 * var(--u))}
.pz-grilla.a4 .footer-kicker{font-size:calc(19 * var(--u))}
.pz-grilla.a4 .footer-title{font-size:calc(31 * var(--u))}
.pz-grilla.a4 .contact{top:calc(36 * var(--u));width:calc(320 * var(--u))}
.pz-grilla.a4 .contact-label{font-size:calc(18 * var(--u))}
.pz-grilla.a4 .phone{min-width:calc(270 * var(--u));font-size:calc(30 * var(--u))}
.pz-grilla.a4 .note{width:calc(270 * var(--u))}
`
};
/* ESTILOS-DISENO:FIN */

const CLASE_FORMATO_DISENO = { feed: 'feed', historia: 'stories', a4: 'a4' };

/* Lienzo común (contenedor de medidas) y adentro el "board" del diseño con sus mismas clases.
   La tipografía base y el interlineado son los del visor de los diseños (16 px, normal). */
function LienzoDiseno({ plantilla, formato, customRef, clases, estilo, etiqueta, children }) {
  const claseBoard = ['pz-' + plantilla, 'board', CLASE_FORMATO_DISENO[formato] || 'feed', clases].filter(Boolean).join(' ');
  return (
    <div ref={customRef} className={`flyer-canvas flyer-${formato}`} style={estiloLienzo(formato, { background: '#ffffff' })}>
      <style>{CSS_PLANTILLAS_DISENO[plantilla] || ''}</style>
      <div className={claseBoard} style={Object.assign({ fontSize: 'calc(16 * var(--u))', lineHeight: 'normal', letterSpacing: 'normal', textAlign: 'left' }, estilo)} aria-label={etiqueta}>
        {children}
      </div>
    </div>
  );
}

/* Texto con saltos de línea (\n) */
function conSaltos(texto) {
  return String(texto == null ? '' : texto).split('\n').map((linea, i) => (
    <React.Fragment key={i}>{i > 0 && <br />}{linea}</React.Fragment>
  ));
}

/* Achica la letra de un elemento hasta que entre en su caja, como el data-fit de los diseños:
   de a "paso" px del diseño y sin bajar de "minimo" (también en px del diseño). */
function ajustarLetraACaja(el, minimo, paso) {
  if (!el) return;
  el.style.fontSize = '';
  const board = el.closest('.board');
  if (!board || !board.clientWidth) return;
  const escala = board.clientWidth / (board.classList.contains('a4') ? 1240 : 1080);
  const min = minimo * escala;
  // Tolerancia de 1 px del diseño (en el A4 exportado al doble, 2 px reales), como en el visor de los diseños
  const tolerancia = Math.max(1, escala);
  let size = parseFloat(getComputedStyle(el).fontSize);
  let vueltas = 0;
  while (size > min && vueltas++ < 300 && (el.scrollHeight > el.clientHeight + tolerancia || el.scrollWidth > el.clientWidth + tolerancia)) {
    size = Math.max(min, size - paso * escala);
    el.style.fontSize = size + 'px';
  }
}

/* Corre un ajuste al dibujar y otra vez cuando terminan de cargar las tipografías */
function useAjusteDiseno(ajustar, deps) {
  React.useLayoutEffect(() => {
    let vigente = true;
    ajustar();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (vigente) ajustar(); });
    return () => { vigente = false; };
  }, deps);
}

/* Columna de textos con posiciones fijas del diseño (antetítulo, titular, bajada, insignias).
   Con los textos del diseño no cambia nada. Si un texto editado es más largo: el antetítulo achica la
   letra para seguir en un renglón sin llegar a la foto, el titular la achica si una palabra no entra de ancho, y los bloques
   siguientes se corren hacia abajo para no pisarse. Si igual no entran antes del "piso" (la foto o la
   franja del pie), achica titular y bajada hasta su mínimo. Medidas en px del diseño; se usan offsetTop
   y offsetHeight para que no las altere la escala de la vista previa. */
function acomodarColumna(bloques, piso) {
  const vivos = bloques.filter(b => b.el);
  if (!vivos.length) return;
  vivos.forEach(b => { b.el.style.fontSize = ''; b.el.style.top = ''; });
  const board = vivos[0].el.closest('.board');
  if (!board || !board.clientWidth) return;
  const escala = board.clientWidth / (board.classList.contains('a4') ? 1240 : 1080);
  const tolerancia = Math.max(1, escala);
  const items = vivos.map(b => ({ ...b, top: b.el.offsetTop, size: parseFloat(getComputedStyle(b.el).fontSize) }));
  const limite = piso ? piso.offsetTop : board.clientHeight;
  const achicar = b => {
    if (b.size <= b.minimo * escala) return false;
    b.size = Math.max(b.minimo * escala, b.size - (b.paso || 1) * escala);
    b.el.style.fontSize = b.size + 'px';
    return true;
  };
  for (const b of items) {
    if (b.unRenglon) {
      const renglon = () => parseFloat(getComputedStyle(b.el).lineHeight) || b.size * 1.25;
      while (b.el.offsetHeight > renglon() * 1.5 && achicar(b));
    }
    if (b.ajustarAncho) while (b.el.scrollWidth > b.el.clientWidth + tolerancia && achicar(b));
    // Sin ancho fijo en el diseño: no debe meterse debajo de la foto de al lado
    if (b.antesDe) while (b.el.offsetLeft + Math.max(b.el.offsetWidth, b.el.scrollWidth) > b.antesDe.offsetLeft && achicar(b));
  }
  const ubicar = () => {
    let fin = -Infinity;
    items.forEach((b, i) => {
      const top = i === 0 ? b.top : Math.max(b.top, fin + items[i - 1].separacion * escala);
      b.el.style.top = i === 0 ? '' : top + 'px';
      fin = top + b.el.offsetHeight;
    });
    return fin + items[items.length - 1].separacion * escala <= limite;
  };
  const ordenAchique = items.filter(b => b.achicaSiNoEntra);
  let vueltas = 0;
  while (!ubicar() && vueltas++ < 200) {
    if (!ordenAchique.some(b => achicar(b))) break;
  }
  // Si nada hizo falta, se devuelven las posiciones del diseño tal cual
  items.forEach(b => { if (b.el.style.top && Math.abs(parseFloat(b.el.style.top) - b.top) < 0.5) b.el.style.top = ''; });
}

/* Achica la letra de "el" (de a 1 px del diseño, sin bajar de "minimo") hasta que termine
   "separacion" px del diseño antes de que empiece "siguiente". */
function achicarAntesDe(el, siguiente, minimo, separacion) {
  if (!el || !siguiente) return;
  el.style.fontSize = '';
  const board = el.closest('.board');
  if (!board || !board.clientWidth) return;
  const escala = board.clientWidth / (board.classList.contains('a4') ? 1240 : 1080);
  let size = parseFloat(getComputedStyle(el).fontSize);
  let vueltas = 0;
  while (size > minimo * escala && vueltas++ < 80 && el.offsetTop + el.offsetHeight > siguiente.offsetTop - separacion * escala) {
    size = Math.max(minimo * escala, size - escala);
    el.style.fontSize = size + 'px';
  }
}

function textoEditado(promo, clave) {
  const v = ((promo && promo.textos) || {})[clave];
  return typeof v === 'string' && v.trim() !== '';
}

function fotoDePromo(promo, porDefecto) {
  return (promo && promo.imagen) || porDefecto;
}

/* ---------- Captación de consultas (general, sin curso) ---------- */
// Mínimos de letra (px del diseño) cuando los textos editados no entran en la columna
const MINIMOS_CAPTACION = {
  feed: { titular: 44, bajada: 22 },
  historia: { titular: 48, bajada: 22 },
  a4: { titular: 52, bajada: 24 }
};

function CaptacionOficiosV1({ promo, formato = 'feed', customRef }) {
  const T = promo ? textosPromo(promo) : {};
  const esHistoria = formato === 'historia';
  const refAnte = React.useRef(null);
  const refTitular = React.useRef(null);
  const refBajada = React.useRef(null);
  const refInsignias = React.useRef(null);
  const refFoto = React.useRef(null);
  const refPie = React.useRef(null);
  useAjusteDiseno(() => {
    const min = MINIMOS_CAPTACION[formato] || MINIMOS_CAPTACION.feed;
    const bloques = [
      { el: refAnte.current, minimo: 14, unRenglon: true, antesDe: esHistoria ? null : refFoto.current, separacion: 12 },
      { el: refTitular.current, minimo: min.titular, paso: 2, ajustarAncho: true, achicaSiNoEntra: true, separacion: 30 },
      { el: refBajada.current, minimo: min.bajada, achicaSiNoEntra: true, separacion: 24 }
    ];
    // En Stories las insignias van debajo de la foto; en Feed y A4 cierran la columna antes del pie
    if (!esHistoria) bloques.push({ el: refInsignias.current, minimo: 19, separacion: 24 });
    acomodarColumna(bloques, esHistoria ? refFoto.current : refPie.current);
  }, [T.antetitulo, T.titulo1, T.titulo2, T.bajada, T.badge1, T.badge2, formato]);
  if (!promo) return null;
  // En Stories el diseño lleva el gancho en un renglón y "Certificación oficial" como segunda insignia
  const titulo1 = esHistoria && !textoEditado(promo, 'titulo1') ? T.titulo1.replace(/\s*\n\s*/g, ' ') : T.titulo1;
  const insignia2 = esHistoria && !textoEditado(promo, 'badge2') ? 'CERTIFICACIÓN OFICIAL' : T.badge2;
  const insignias = (
    <div className="proof" aria-label="Datos institucionales" ref={refInsignias}>
      <span>{T.badge1}</span>
      <span>{insignia2}</span>
    </div>
  );
  return (
    <LienzoDiseno plantilla="captacion" formato={formato} customRef={customRef} clases={promo.mostrarCuadricula === false ? 'grid-off' : ''} etiqueta="Pieza para captar consultas">
      <div className="topline"></div>
      <img className="logo" src="assets/logo-cfp401-horizontal.png" alt="Centro de Formación Profesional N° 401 Avellaneda" />
      <div className="eyebrow" ref={refAnte}>{T.antetitulo}</div>
      <h1 className="headline" ref={refTitular}>{conSaltos(titulo1)}<br /><span className="accent">{T.titulo2}</span></h1>
      <p className="deck" ref={refBajada}>{T.bajada}</p>
      {!esHistoria && insignias}
      <figure className="photo-frame" aria-label="Foto de un taller" ref={refFoto}>
        <img src={fotoDePromo(promo, 'assets/promociones/tematicas/captacion/captacion-1.jpg')} alt="Estudiantes aprendiendo en un taller de formación profesional" style={promo.encuadre ? { objectPosition: promo.encuadre } : undefined} />
        <figcaption className="photo-tag">{T.tagFoto}</figcaption>
      </figure>
      {esHistoria && insignias}
      <footer className="cta-band" ref={refPie}>
        <div className="cta-copy">
          <div className="cta-label">{T.ctaEtiqueta}</div>
          <p className="cta-title">{T.ctaTitulo}</p>
          <div className="address">{T.sede}</div>
        </div>
        <div className="wa">
          <span>ESCRIBINOS POR WHATSAPP</span>
          <b>{T.whatsapp}</b>
          <small>(solo mensajes)</small>
        </div>
      </footer>
    </LienzoDiseno>
  );
}

/* ---------- Últimos cupos (de un curso) ---------- */
const MINIMO_TITULAR_CUPOS = { feed: 56, historia: 64, a4: 62 };

function UltimosCuposV1({ promo, formato = 'feed', customRef }) {
  const T = promo ? textosPromo(promo) : {};
  const refTitular = React.useRef(null);
  const refCurso = React.useRef(null);
  const refBajada = React.useRef(null);
  const refDetalles = React.useRef(null);
  const refPie = React.useRef(null);
  useAjusteDiseno(() => {
    ajustarLetraACaja(refTitular.current, MINIMO_TITULAR_CUPOS[formato] || 56, 2);
    // Nombres de curso muy largos: la etiqueta achica la letra (hasta 15 px del diseño) para no pisar la bajada
    achicarAntesDe(refCurso.current, refBajada.current, 15, 12);
    // Días y horarios largos: achican la letra para terminar antes de la franja del pie
    achicarAntesDe(refDetalles.current, refPie.current, 13, 8);
  }, [T.titulo1, T.titulo2, T.curso, T.bajada, T.detalles, formato]);
  if (!promo) return null;
  const foto = (
    <figure className="photo-frame">
      <img src={fotoDePromo(promo, 'assets/promociones/tematicas/ultimos-cupos/ultimos-cupos-1.jpg')} alt="Estudiantes en un taller de formación profesional" style={promo.encuadre ? { objectPosition: promo.encuadre } : undefined} />
      <figcaption>{T.tagFoto}</figcaption>
    </figure>
  );
  return (
    <LienzoDiseno plantilla="cupos" formato={formato} customRef={customRef} clases={promo.mostrarCuadricula === false ? 'grid-off' : ''} etiqueta="Aviso de últimos cupos">
      <div className="topline"></div>
      <img className="logo" src="assets/logo-cfp401-horizontal.png" alt="Centro de Formación Profesional N° 401 Avellaneda" />
      <div className="eyebrow">{T.antetitulo}</div>
      <h1 className="headline" ref={refTitular}>{conSaltos(T.titulo1)}<br /><span className="accent">{T.titulo2}</span></h1>
      {formato === 'historia' && foto}
      <div className="course-tag" ref={refCurso}>{T.curso}</div>
      <p className="deck" ref={refBajada}>{T.bajada}</p>
      <div className="proof" aria-label="Características de la formación">
        <span>{T.badge1}</span>
        <span>{T.badge2}</span>
      </div>
      <div className="course-details" ref={refDetalles}>{T.detalles}</div>
      {formato !== 'historia' && foto}
      <footer className="footer-band" ref={refPie}>
        <div className="footer-copy">
          <div className="footer-kicker">{T.ctaEtiqueta}</div>
          <p className="footer-title">{T.ctaTitulo}</p>
        </div>
        <div className="contact">
          <div className="contact-label">ESCRIBINOS POR WHATSAPP</div>
          <div className="phone">{T.whatsapp}</div>
          <div className="note">(solo mensajes)</div>
        </div>
      </footer>
    </LienzoDiseno>
  );
}

/* ---------- Conmemoraciones patrias (sin curso) ---------- */
const MINIMO_TITULAR_PATRIAS = { feed: 54, historia: 58, a4: 58 };

function ConmemoracionesPatriasV1({ promo, formato = 'feed', customRef }) {
  const T = promo ? textosPromo(promo) : {};
  const refTitular = React.useRef(null);
  useAjusteDiseno(() => ajustarLetraACaja(refTitular.current, MINIMO_TITULAR_PATRIAS[formato] || 54, 2), [T.titulo1, T.titulo2, formato]);
  if (!promo) return null;
  const esHistoria = formato === 'historia';
  const imagen = fotoDePromo(promo, 'assets/promociones/tematicas/dias-patrios/dias-patrios-1.jpg');
  const sinCuadricula = promo.mostrarCuadricula === false;
  // En Feed y A4 la foto es el fondo (a sangre, con el degradé azul del diseño encima)
  const estilo = esHistoria ? undefined : Object.assign(
    { '--photo-url': `url("${imagen}")` },
    promo.encuadre ? { backgroundPosition: sinCuadricula ? `center, ${promo.encuadre}` : `center, center, center, ${promo.encuadre}` } : {}
  );
  return (
    <LienzoDiseno plantilla="patrias" formato={formato} customRef={customRef} clases={sinCuadricula ? 'grid-off' : ''} estilo={estilo} etiqueta="Conmemoración de una fecha patria">
      <div className="topline"></div>
      <img className="logo" src={esHistoria ? 'assets/logo-cfp401-horizontal.png' : 'assets/logo-cfp401-horizontal-blanco.png'} alt="Centro de Formación Profesional N° 401 Avellaneda" />
      <div className="eyebrow">{T.antetitulo}</div>
      <h1 className="headline" ref={refTitular}>{conSaltos(T.titulo1)}<br /><span className="accent">{T.titulo2}</span></h1>
      <div className="date-pill">{T.fecha}</div>
      {esHistoria && (
        <figure className="flag-block" aria-label="Imagen de la conmemoración">
          <div className="flag-frame">
            <img src={imagen} alt="Imagen de la fecha patria" style={promo.encuadre ? { objectPosition: promo.encuadre } : undefined} />
          </div>
          <figcaption className="flag-caption">{T.leyendaFoto}</figcaption>
        </figure>
      )}
      <p className="deck">{T.bajada}</p>
      <footer className="footer-band">
        <div className="footer-kicker">{T.pieEtiqueta}</div>
        <p className="footer-title">{T.pieTitulo}</p>
      </footer>
    </LienzoDiseno>
  );
}

/* ---------- Grilla de cursos (listado por período, sin textos editables) ---------- */
/* Período de inicio de un curso según su duración en data.js (misma regla que el diseño) */
function cicloCursoGrilla(duracion) {
  const texto = String(duracion || '').toLocaleLowerCase('es-AR');
  if (texto.includes('dos comisiones')) return { tipo: 'mixto', etiqueta: 'ANUAL + CUATRIMESTRAL · CONFIRMAR', periodos: ['marzo', 'agosto'], sugerido: false };
  if (texto.includes('anual') && !texto.includes('cuatrimestral')) return { tipo: 'anual', etiqueta: 'ANUAL · MARZO', periodos: ['marzo'], sugerido: true };
  if (texto.includes('cuatrimestral')) {
    const marzo = texto.includes('marzo') || texto.includes('1° cuatrimestre') || texto.includes('1º cuatrimestre');
    const agosto = texto.includes('agosto') || texto.includes('2° cuatrimestre') || texto.includes('2º cuatrimestre');
    if (marzo && agosto) return { tipo: 'cuatrimestral', etiqueta: 'CUATRIMESTRAL · MARZO / AGOSTO', periodos: ['marzo', 'agosto'], sugerido: true };
    if (marzo) return { tipo: 'cuatrimestral', etiqueta: 'CUATRIMESTRAL · MARZO', periodos: ['marzo'], sugerido: true };
    if (agosto) return { tipo: 'cuatrimestral', etiqueta: 'CUATRIMESTRAL · AGOSTO', periodos: ['agosto'], sugerido: true };
    return { tipo: 'cuatrimestral', etiqueta: 'CUATRIMESTRAL · CONFIRMAR INICIO', periodos: [], sugerido: false };
  }
  if (texto.includes('anual')) return { tipo: 'mixto', etiqueta: 'ANUAL + CUATRIMESTRAL · CONFIRMAR', periodos: ['marzo', 'agosto'], sugerido: false };
  return { tipo: 'desconocido', etiqueta: 'PERÍODO A CONFIRMAR', periodos: [], sugerido: false };
}

/* Catálogo de cursos para la grilla (de data.js) */
function cursosParaGrilla() {
  const cursos = (window.CFP_DATA && window.CFP_DATA.courses) || [];
  return cursos.map((c, i) => {
    const nombre = String((c && (c.curso || c.nombre)) || '').trim();
    if (!nombre) return null;
    return {
      id: String(c.slug || `${c.familia || 'curso'}-${nombre}`).toLowerCase(),
      nombre,
      familia: String(c.familia || 'Formación profesional').trim(),
      duracion: String(c.duracion || '').trim(),
      horarios: String(c.horarios || 'A confirmar').trim() || 'A confirmar',
      requisitos: String(c.requisitos || 'A confirmar').trim() || 'A confirmar',
      orden: i,
      ciclo: cicloCursoGrilla(c.duracion)
    };
  }).filter(Boolean);
}

/* Cursos que el diseño sugiere para un período (los que tienen ese inicio indicado en data.js) */
function sugeridosGrilla(periodo) {
  return cursosParaGrilla().filter(c => c.ciclo.sugerido && c.ciclo.periodos.includes(periodo || 'marzo')).map(c => c.id);
}

/* Cursos elegidos para la pieza (si todavía no se eligió ninguno, los sugeridos del período) */
function seleccionGrilla(promo) {
  const periodo = (promo && promo.periodo) || 'marzo';
  const elegidos = Array.isArray(promo && promo.cursosSeleccionados) ? promo.cursosSeleccionados : sugeridosGrilla(periodo);
  return cursosParaGrilla().filter(c => elegidos.includes(c.id));
}

/* Cuántos cursos entran por página: en la composición en grilla, 6 en Feed y 8 en Stories y A4;
   en la composición por filas, todos en una sola página. */
function capacidadGrilla(promo, formato) {
  if ((promo && promo.composicion) === 'filas') return Math.max(1, seleccionGrilla(promo).length);
  return formato === 'feed' ? 6 : 8;
}

function paginasGrilla(promo, formato) {
  return Math.max(1, Math.ceil(seleccionGrilla(promo).length / capacidadGrilla(promo, formato)));
}

/* Columnas, filas y tamaños de letra según la cantidad de cursos (px del diseño, como en el diseño) */
function diagramaGrilla(cantidad, filas, formato) {
  const columnas = filas ? 1 : 2;
  const renglones = Math.max(1, filas ? cantidad : Math.ceil(cantidad / columnas));
  const letra = filas ? (cantidad <= 2 ? 22 : cantidad <= 4 ? 18 : cantidad <= 7 ? 15 : cantidad <= 11 ? 12.5 : cantidad <= 16 ? 11 : 9.8) : (cantidad <= 2 ? 28 : cantidad <= 4 ? 23 : 19);
  const letraDetalle = filas ? (cantidad <= 7 ? 15 : cantidad <= 11 ? 13 : cantidad <= 16 ? 11.5 : formato === 'feed' ? 9.8 : 10.8) : (cantidad <= 2 ? 14 : cantidad <= 4 ? 13 : 12);
  const letraRotulo = filas ? (cantidad > 16 ? 8 : cantidad > 10 ? 9 : 10) : 9;
  const separacion = filas ? (cantidad > 16 ? 2 : cantidad > 10 ? 4 : 8) : (cantidad <= 3 ? 16 : 10);
  const relleno = cantidad > 16 ? [1, 3] : cantidad > 10 ? [3, 6] : [8, 12];
  return { columnas, renglones, letra, letraDetalle, letraRotulo, separacion, relleno };
}

const MEDIDA_DISENO = n => `calc(${n} * var(--u))`;

/* Tamaño (px del diseño) que el diseño le deja al título de una ficha: baja de a 0,5 mientras el
   texto sobresale más de 1 px de su caja, sin pasar del mínimo. Se mide a escala 1 fuera de pantalla. */
let medidorTituloFicha = null;
function tamanoTituloFicha(texto, anchoDiseno, base, interlineado, minimo) {
  if (!medidorTituloFicha) {
    medidorTituloFicha = document.createElement('div');
    medidorTituloFicha.setAttribute('aria-hidden', 'true');
    medidorTituloFicha.style.cssText = 'position:absolute;left:-10000px;top:0;visibility:hidden;pointer-events:none;' +
      'font-family:"Poppins",Arial,sans-serif;font-weight:800;overflow-wrap:anywhere;hyphens:auto;letter-spacing:normal;';
    document.body.appendChild(medidorTituloFicha);
  }
  const m = medidorTituloFicha;
  m.style.width = anchoDiseno + 'px';
  m.style.lineHeight = String(interlineado || 1.12);
  m.textContent = texto;
  let size = base;
  m.style.fontSize = size + 'px';
  let vueltas = 0;
  while (size > minimo && vueltas++ < 200 && m.scrollHeight > m.clientHeight + 1) {
    size = Math.max(minimo, size - 0.5);
    m.style.fontSize = size + 'px';
  }
  return size;
}

function GrillaCursosV1({ promo, formato = 'feed', customRef }) {
  const refGrilla = React.useRef(null);
  const refContacto = React.useRef(null);
  const seleccion = promo ? seleccionGrilla(promo) : [];
  const filas = !!promo && promo.composicion === 'filas';
  const capacidad = promo ? capacidadGrilla(promo, formato) : 6;
  const paginas = Math.max(1, Math.ceil(seleccion.length / capacidad));
  const pagina = Math.min(Math.max(0, (promo && promo.pagina) || 0), paginas - 1);
  const visibles = seleccion.slice(pagina * capacidad, (pagina + 1) * capacidad);
  // Ajustes del diseño: títulos de las fichas que no entran y ancho de "(solo mensajes)" igual al rótulo
  useAjusteDiseno(() => {
    // Títulos de las fichas: el diseño los achica de a 0,5 px mientras sobresalen más de 1 px de su
    // renglón. Se mide a la escala del diseño (1080 o 1240 px de ancho) en una copia oculta, así el
    // resultado es el mismo en la miniatura, en el Feed y en el A4 exportado al doble.
    const grilla = refGrilla.current;
    if (grilla) grilla.querySelectorAll('.course-name').forEach(titulo => {
      const board = titulo.closest('.board');
      if (!board || !board.clientWidth) return;
      titulo.style.fontSize = '';
      const escala = board.clientWidth / (board.classList.contains('a4') ? 1240 : 1080);
      const estilo = getComputedStyle(titulo);
      const base = parseFloat(estilo.fontSize) / escala;
      const interlineado = parseFloat(estilo.lineHeight) / parseFloat(estilo.fontSize);
      const size = tamanoTituloFicha(titulo.textContent, titulo.clientWidth / escala, base, interlineado, formato === 'feed' ? 13 : 14);
      if (size < base) titulo.style.fontSize = MEDIDA_DISENO(size);
    });
    const contacto = refContacto.current;
    if (contacto) {
      const rotulo = contacto.querySelector('.contact-label');
      const nota = contacto.querySelector('.note');
      if (rotulo && nota) nota.style.width = rotulo.offsetWidth + 'px';
    }
  }, [visibles.map(c => c.id).join(','), filas, formato]);
  if (!promo) return null;
  const periodo = promo.periodo || 'marzo';
  const d = diagramaGrilla(visibles.length, filas, formato);
  const estiloGrilla = {
    '--columns': d.columnas,
    '--rows': d.renglones,
    '--course-font': MEDIDA_DISENO(d.letra),
    '--detail-font': MEDIDA_DISENO(d.letraDetalle),
    '--label-font': MEDIDA_DISENO(d.letraRotulo),
    '--row-padding': `${MEDIDA_DISENO(d.relleno[0])} ${MEDIDA_DISENO(d.relleno[1])}`,
    '--grid-gap': MEDIDA_DISENO(d.separacion)
  };
  const tipoCorto = c => c.ciclo.tipo === 'anual' ? 'ANUAL' : c.ciclo.tipo === 'cuatrimestral' ? 'CUATRIMESTRAL' : '*';
  const clases = [filas ? 'rows' : '', promo.mostrarCuadricula === false ? 'grid-off' : ''].filter(Boolean).join(' ');
  return (
    <LienzoDiseno plantilla="grilla" formato={formato} customRef={customRef} clases={clases} etiqueta="Listado de cursos para empezar">
      <div className="topline"></div>
      <img className="logo" src="assets/logo-cfp401-horizontal.png" alt="Centro de Formación Profesional N° 401 Avellaneda" />
      <div className="campaign-ribbon">ÚLTIMOS CUPOS</div>
      <div className="eyebrow">CFP N° 401 · FORMACIÓN PROFESIONAL</div>
      <h1 className="headline">CURSOS PARA EMPEZAR</h1>
      <div className="period-line">INICIO EN <strong>{periodo.toLocaleUpperCase('es-AR')}</strong></div>
      <div className="course-counter"><strong>{String(seleccion.length).padStart(2, '0')}</strong><span>CURSOS<br />EN EL LISTADO</span></div>
      <div className="category-note">ANUALES Y CUATRIMESTRALES</div>
      <section className={'course-grid' + (visibles.length ? '' : ' is-empty')} ref={refGrilla} style={estiloGrilla} aria-label="Cursos seleccionados">
        {!visibles.length && <p className="empty-state">Elegí los cursos a incluir en el listado.</p>}
        {visibles.map((c, i) => (
          <article className="course-card" key={c.id}>
            <span className="course-index">{String(pagina * capacidad + i + 1).padStart(2, '0')}</span>
            <div className="course-heading">
              <div className="course-family">{c.familia}</div>
              <div className="course-name">{c.nombre}</div>
              {!filas && <div className="course-type">{c.ciclo.etiqueta}</div>}
            </div>
            <div className="course-details">
              <p className="course-detail course-schedule"><strong>DÍAS Y HORARIOS</strong><span>{c.horarios}</span></p>
              {filas
                ? <div className="course-detail course-requirements"><strong>REQUISITOS</strong><span>{c.requisitos}</span></div>
                : <p className="course-detail course-requirements"><strong>REQUISITOS</strong><span>{c.requisitos}</span></p>}
            </div>
            {filas && <div className="course-type">{tipoCorto(c)}</div>}
          </article>
        ))}
      </section>
      <footer className="footer-band">
        <div className="footer-copy">
          <div className="footer-kicker">CONSULTÁ SI QUEDAN CUPOS</div>
          <p className="footer-title">TE AYUDAMOS A ELEGIR</p>
        </div>
        <div className="contact" ref={refContacto}>
          <div className="contact-label">ESCRIBINOS POR WHATSAPP</div>
          <div className="phone">{whatsappPromo()}</div>
          <div className="note">(solo mensajes)</div>
        </div>
      </footer>
    </LienzoDiseno>
  );
}

/* =============================================================================
   CATÁLOGO DE PLANTILLAS: nombre, tipo y campos de texto editables de cada una
   ============================================================================= */
const FORMATOS_PROMO_LISTA = [FORMATOS_PROMO.feed, FORMATOS_PROMO.historia, FORMATOS_PROMO.a4];

const CATALOGO_PLANTILLAS = {
  'flyer-curso-v1': {
    id: 'flyer-curso-v1',
    nombre: 'Flyer Oficial de Curso (Estándar)',
    tipo: 'curso',
    pasoCurso: 'uno',
    usaFoto: true,
    badge: 'Oficial',
    disponible: true,
    descripcion: 'Titular Poppins 800, foto de taller en arco, cápsula amarilla con días, horario y gratuidad, franja azul con requisito, sede y certificación.',
    formatos: FORMATOS_PROMO_LISTA,
    componente: FlyerCursoV1,
    campos: [
      { clave: 'antetitulo', etiqueta: 'Antetítulo', grupo: 'Encabezado', defecto: 'CURSO · FORMACIÓN PROFESIONAL' },
      { clave: 'titulo', etiqueta: 'Titular (nombre del curso)', grupo: 'Encabezado', legado: 'tituloOverride', defecto: p => p.cursoNombre || '' },
      { clave: 'frase', etiqueta: 'Frase sobre la foto', grupo: 'Foto', multilinea: true, defecto: 'ES TU TIEMPO\nDE APRENDER' },
      { clave: 'cta', etiqueta: 'Llamado', grupo: 'Cápsula amarilla', multilinea: true, defecto: '¡INSCRIBITE\nAHORA!' },
      { clave: 'etiquetaDias', etiqueta: 'Rótulo de días', grupo: 'Cápsula amarilla', defecto: 'DÍAS' },
      { clave: 'dias', etiqueta: 'Días', grupo: 'Cápsula amarilla', legado: 'diasOverride', defecto: p => (p.datosCurso || {}).dias || '' },
      { clave: 'etiquetaHorario', etiqueta: 'Rótulo de horario', grupo: 'Cápsula amarilla', defecto: 'HORARIO' },
      { clave: 'horario', etiqueta: 'Horario', grupo: 'Cápsula amarilla', legado: 'horarioOverride', defecto: p => (p.datosCurso || {}).horario || '' },
      { clave: 'selloGrande', etiqueta: 'Círculo: texto grande', grupo: 'Cápsula amarilla', defecto: '100%' },
      { clave: 'selloChico', etiqueta: 'Círculo: texto chico', grupo: 'Cápsula amarilla', defecto: 'GRATUITO' },
      { clave: 'etiquetaRequisito', etiqueta: 'Rótulo de requisito', grupo: 'Franja azul', defecto: 'REQUISITO' },
      { clave: 'requisito', etiqueta: 'Requisito', grupo: 'Franja azul', legado: 'requisitoOverride', defecto: p => (p.datosCurso || {}).requisito || 'Constancia de estudios primarios o superiores' },
      { clave: 'etiquetaSede', etiqueta: 'Rótulo de sede', grupo: 'Franja azul', defecto: 'SEDE' },
      { clave: 'sede', etiqueta: 'Sede', grupo: 'Franja azul', legado: 'sedeOverride', defecto: p => (p.datosCurso || {}).sede || 'Juan Pablo Angulo 1272, Dock Sud' },
      { clave: 'etiquetaCertificacion', etiqueta: 'Rótulo de certificación', grupo: 'Franja azul', defecto: 'CERTIFICACIÓN' },
      { clave: 'certificacion', etiqueta: 'Certificación', grupo: 'Franja azul', legado: 'certificacionOverride', defecto: 'Oficial DGCyE' },
      { clave: 'etiquetaWhatsapp', etiqueta: 'Rótulo de WhatsApp', grupo: 'Pie', defecto: 'CONSULTAS POR WHATSAPP' },
      { clave: 'whatsapp', etiqueta: 'Número de WhatsApp', grupo: 'Pie', defecto: () => whatsappPromo() }
    ]
  },
  'flyer-curso-v2': {
    id: 'flyer-curso-v2',
    nombre: 'Promo de Curso (Alternativa)',
    tipo: 'curso',
    pasoCurso: 'uno',
    usaFoto: true,
    badge: 'Nuevo',
    disponible: true,
    descripcion: 'Foto de taller a sangre, ficha blanca con el nombre del curso y una bajada, grilla de datos sobre azul y franja amarilla de WhatsApp.',
    formatos: FORMATOS_PROMO_LISTA,
    componente: PromoCursoV2,
    campos: [
      { clave: 'categoria', etiqueta: 'Familia / categoría', grupo: 'Ficha del curso', defecto: p => (p.familiaNombre || 'FORMACIÓN PROFESIONAL').toUpperCase() },
      { clave: 'curso', etiqueta: 'Nombre del curso', grupo: 'Ficha del curso', defecto: p => p.cursoTitulo || ((p.cursoNombre || '').charAt(0) + (p.cursoNombre || '').slice(1).toLowerCase()) },
      { clave: 'bajada', etiqueta: 'Bajada', grupo: 'Ficha del curso', multilinea: true, defecto: p => p.bajadaCurso || '' },
      { clave: 'etiquetaDias', etiqueta: 'Rótulo de días', grupo: 'Datos', defecto: 'DÍAS' },
      { clave: 'dias', etiqueta: 'Días', grupo: 'Datos', legado: 'diasOverride', defecto: p => (p.datosCurso || {}).dias || '' },
      { clave: 'etiquetaHorario', etiqueta: 'Rótulo de horario', grupo: 'Datos', defecto: 'HORARIO' },
      { clave: 'horario', etiqueta: 'Horario', grupo: 'Datos', legado: 'horarioOverride', defecto: p => (p.datosCurso || {}).horario || '' },
      { clave: 'etiquetaDuracion', etiqueta: 'Rótulo de duración', grupo: 'Datos', defecto: 'DURACIÓN' },
      { clave: 'duracion', etiqueta: 'Duración', grupo: 'Datos', defecto: p => p.duracionCurso || '' },
      { clave: 'etiquetaRequisito', etiqueta: 'Rótulo de requisito', grupo: 'Datos', defecto: 'REQUISITO' },
      { clave: 'requisito', etiqueta: 'Requisito', grupo: 'Datos', legado: 'requisitoOverride', defecto: p => (p.datosCurso || {}).requisito || 'Constancia de estudios primarios o superiores' },
      { clave: 'cta', etiqueta: 'Llamado', grupo: 'Franja amarilla', defecto: '¡Inscribite ahora!' },
      { clave: 'sede', etiqueta: 'Sede', grupo: 'Franja amarilla', legado: 'sedeOverride', defecto: p => (p.datosCurso || {}).sede || 'Juan Pablo Angulo 1272, Dock Sud' },
      { clave: 'whatsapp', etiqueta: 'Número de WhatsApp', grupo: 'Franja amarilla', defecto: () => whatsappPromo() },
      { clave: 'cintaGrande', etiqueta: 'Cinta: texto grande', grupo: 'Cinta', defecto: '100%' },
      { clave: 'cintaChica', etiqueta: 'Cinta: texto chico', grupo: 'Cinta', defecto: 'GRATUITO' }
    ]
  },
  'apertura-inscripciones-v1': {
    id: 'apertura-inscripciones-v1',
    nombre: 'Inscripciones Abiertas (Institucional)',
    tipo: 'inscripciones',
    pasoCurso: 'familias',
    usaFoto: true,
    badge: 'Nuevo',
    disponible: true,
    descripcion: 'Aviso general de apertura de inscripciones: titular tipográfico, sello, foto circular y las familias de oficios. No está ligado a un curso.',
    formatos: FORMATOS_PROMO_LISTA,
    componente: InscripcionesV1,
    campos: [
      { clave: 'antetitulo', etiqueta: 'Antetítulo', grupo: 'Titular', defecto: 'FORMACIÓN PROFESIONAL' },
      { clave: 'linea1', etiqueta: 'Titular, línea blanca', grupo: 'Titular', defecto: 'INSCRIPCIONES' },
      { clave: 'linea2', etiqueta: 'Titular, línea amarilla', grupo: 'Titular', defecto: 'ABIERTAS' },
      { clave: 'bajada', etiqueta: 'Bajada', grupo: 'Titular', multilinea: true, defecto: 'Cursos de formación profesional con certificación oficial DGCyE.' },
      { clave: 'selloGrande', etiqueta: 'Sello: texto grande', grupo: 'Sello', defecto: '100%' },
      { clave: 'selloChico', etiqueta: 'Sello: texto chico', grupo: 'Sello', defecto: 'GRATUITO' },
      { clave: 'dato1Label', etiqueta: 'Rótulo del dato 1', grupo: 'Pie', defecto: 'INSCRIPCIÓN' },
      { clave: 'dato1', etiqueta: 'Dato 1', grupo: 'Pie', defecto: () => fechaInscripcionPromo() },
      { clave: 'dato2Label', etiqueta: 'Rótulo del dato 2', grupo: 'Pie', defecto: 'SEDE' },
      { clave: 'dato2', etiqueta: 'Dato 2', grupo: 'Pie', defecto: 'J. P. Angulo 1272' },
      { clave: 'etiquetaWhatsapp', etiqueta: 'Rótulo de WhatsApp', grupo: 'Pie', defecto: 'WHATSAPP' },
      { clave: 'whatsapp', etiqueta: 'Número de WhatsApp', grupo: 'Pie', defecto: () => whatsappPromo() }
    ]
  },

  'captacion-oficios-v1': {
    id: 'captacion-oficios-v1',
    nombre: 'Captación de Consultas (General)',
    tipo: 'captacion',
    pasoCurso: null,
    usaFoto: true,
    badge: 'Nuevo',
    disponible: true,
    descripcion: 'Gancho editorial "¿Querés aprender un oficio?", panel de taller inclinado, datos de gratuidad y franja azul de WhatsApp.',
    formatos: FORMATOS_PROMO_LISTA,
    componente: CaptacionOficiosV1,
    campos: [
      { clave: 'antetitulo', etiqueta: 'Antetítulo', grupo: 'Encabezado', defecto: 'FORMACIÓN PROFESIONAL · CFP N° 401' },
      { clave: 'titulo1', etiqueta: 'Titular', grupo: 'Titular', multilinea: true, defecto: '¿QUERÉS\nAPRENDER' },
      { clave: 'titulo2', etiqueta: 'Titular en amarillo', grupo: 'Titular', defecto: 'UN OFICIO?' },
      { clave: 'bajada', etiqueta: 'Bajada', grupo: 'Titular', multilinea: true, defecto: 'Formación gratuita y certificación oficial para aprender haciendo.' },
      { clave: 'badge1', etiqueta: 'Insignia 1', grupo: 'Datos', defecto: '22 CURSOS · 7 ÁREAS' },
      { clave: 'badge2', etiqueta: 'Insignia 2 (en Stories: Certificación oficial)', grupo: 'Datos', defecto: 'FORMACIÓN GRATUITA' },
      { clave: 'tagFoto', etiqueta: 'Etiqueta de la foto', grupo: 'Foto', defecto: 'APRENDÉ HACIENDO' },
      { clave: 'ctaEtiqueta', etiqueta: 'Rótulo del pie', grupo: 'Pie', defecto: 'TU PRÓXIMO PASO' },
      { clave: 'ctaTitulo', etiqueta: 'Llamado a la acción', grupo: 'Pie', defecto: 'Consultá por próximas inscripciones' },
      { clave: 'sede', etiqueta: 'Sede', grupo: 'Pie', defecto: 'Sede Juan Pablo Angulo 1272 · Dock Sud' },
      { clave: 'whatsapp', etiqueta: 'WhatsApp', grupo: 'Pie', defecto: () => whatsappPromo() }
    ]
  },
  'ultimos-cupos-v1': {
    id: 'ultimos-cupos-v1',
    nombre: 'Últimos Cupos (Urgencia)',
    tipo: 'curso',
    pasoCurso: 'uno',
    usaFoto: true,
    badge: 'Nuevo',
    disponible: true,
    descripcion: 'Titular de alto impacto "¡ÚLTIMOS CUPOS!", foto de taller enérgica, nombre del curso, datos de cursada y WhatsApp.',
    formatos: FORMATOS_PROMO_LISTA,
    componente: UltimosCuposV1,
    campos: [
      { clave: 'antetitulo', etiqueta: 'Antetítulo', grupo: 'Encabezado', defecto: 'INSCRIPCIONES · CFP N° 401' },
      { clave: 'titulo1', etiqueta: 'Titular', grupo: 'Titular', defecto: '¡ÚLTIMOS' },
      { clave: 'titulo2', etiqueta: 'Titular subrayado', grupo: 'Titular', defecto: 'CUPOS!' },
      { clave: 'curso', etiqueta: 'Nombre del curso', grupo: 'Curso', defecto: p => (p.cursoTitulo || p.cursoNombre || '[NOMBRE DEL CURSO]').toUpperCase() },
      { clave: 'bajada', etiqueta: 'Bajada', grupo: 'Curso', multilinea: true, defecto: 'Consultá disponibilidad y conocé cómo inscribirte.' },
      { clave: 'badge1', etiqueta: 'Insignia 1', grupo: 'Curso', defecto: 'FORMACIÓN GRATUITA' },
      { clave: 'badge2', etiqueta: 'Insignia 2', grupo: 'Curso', defecto: 'CERTIFICACIÓN OFICIAL' },
      { clave: 'detalles', etiqueta: 'Días, horario y requisito', grupo: 'Curso', defecto: p => { const d = p.datosCurso || {}; const dh = [d.dias, d.horario].filter(Boolean).join(' de '); return [dh, d.requisito].filter(Boolean).join(' · ') || '[DÍAS · HORARIOS · REQUISITO]'; } },
      { clave: 'tagFoto', etiqueta: 'Etiqueta de la foto', grupo: 'Foto', defecto: 'TU LUGAR PUEDE ESTAR ACÁ' },
      { clave: 'ctaEtiqueta', etiqueta: 'Rótulo del pie', grupo: 'Pie', defecto: 'CONSULTÁ SI QUEDAN CUPOS' },
      { clave: 'ctaTitulo', etiqueta: 'Llamado a la acción', grupo: 'Pie', defecto: 'ESCRIBINOS Y TE ORIENTAMOS' },
      { clave: 'whatsapp', etiqueta: 'WhatsApp', grupo: 'Pie', defecto: () => whatsappPromo() }
    ]
  },
  'conmemoraciones-patrias-v1': {
    id: 'conmemoraciones-patrias-v1',
    nombre: 'Conmemoraciones Patrias (Efemérides)',
    tipo: 'efemeride',
    pasoCurso: null,
    usaFoto: true,
    badge: 'Nuevo',
    disponible: true,
    descripcion: 'Fotografía a sangre, degradado azul oscuro, efeméride destacada (Bandera, 25 de Mayo, 9 de Julio) e identidad nacional.',
    formatos: FORMATOS_PROMO_LISTA,
    componente: ConmemoracionesPatriasV1,
    campos: [
      { clave: 'antetitulo', etiqueta: 'Antetítulo', grupo: 'Encabezado', defecto: 'FECHAS PATRIAS · CFP N° 401' },
      { clave: 'titulo1', etiqueta: 'Titular', grupo: 'Titular', defecto: 'DÍA DE LA' },
      { clave: 'titulo2', etiqueta: 'Titular destacado', grupo: 'Titular', defecto: 'BANDERA' },
      { clave: 'fecha', etiqueta: 'Fecha', grupo: 'Titular', defecto: '20 DE JUNIO' },
      { clave: 'bajada', etiqueta: 'Mensaje', grupo: 'Titular', multilinea: true, defecto: 'Recordamos una fecha que forma parte de nuestra historia y construye identidad.' },
      { clave: 'leyendaFoto', etiqueta: 'Leyenda de la imagen (solo Stories)', grupo: 'Foto', defecto: 'UN SÍMBOLO QUE NOS UNE' },
      { clave: 'pieEtiqueta', etiqueta: 'Rótulo del pie', grupo: 'Pie', defecto: 'CONMEMORACIÓN · CFP N° 401' },
      { clave: 'pieTitulo', etiqueta: 'Lema del pie', grupo: 'Pie', defecto: 'HISTORIA · IDENTIDAD · FUTURO' }
    ]
  },
  'grilla-cursos-v1': {
    id: 'grilla-cursos-v1',
    nombre: 'Grilla de Cursos para Empezar',
    tipo: 'grilla',
    pasoCurso: 'varios',
    usaFoto: false,
    badge: 'Nuevo',
    disponible: true,
    descripcion: 'Listado de los cursos que empiezan en marzo o agosto, en grilla o por filas, con días, horarios y requisitos de data.js. Solo se eligen los cursos.',
    formatos: FORMATOS_PROMO_LISTA,
    componente: GrillaCursosV1,
    // Textos fijos del diseño: en esta plantilla solo se eligen los cursos, el período y la composición
    campos: []
  }
};

/* Despachador: dibuja la plantilla que corresponde al modelo de la promoción */
function RenderPromoFlyer({ promo, formato = 'feed', customRef }) {
  if (!promo) return null;
  const Plantilla = plantillaDePromo(promo).componente;
  return <Plantilla promo={promo} formato={formato} customRef={customRef} />;
}
