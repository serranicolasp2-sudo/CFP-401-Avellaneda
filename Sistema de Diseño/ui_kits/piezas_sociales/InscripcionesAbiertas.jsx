// UI Kit — Piezas Sociales: Inscripciones Abiertas (Definitiva)
// Admite formatos 'feed' (4:5 - 1080x1350) y 'historia' (9:16 - 1080x1920)
function InscripcionesAbiertas({
  formato = 'historia',
  antetitulo = 'CICLO LECTIVO 2027',
  linea1 = 'INSCRIPCIONES',
  linea2 = 'ABIERTAS',
  bajada = 'Cursos de formación profesional con certificación oficial DGCyE.',
  cursos = ['Soldadura', 'Electricidad', 'Energías renovables', 'Domótica', 'Refrigeración'],
  dato1Label = 'INSCRIPCIÓN',
  dato1 = 'Desde el 1/12',
  dato2Label = 'SEDE',
  dato2 = 'J. P. Angulo 1272',
  whatsapp = '11 6105-6018',
  foto = '../../assets/promociones/soldadura-1.webp',
  conSello = true,
  conCursos = true,
  scale = 1
}) {
  const esHistoria = formato === 'historia';
  const ancho = 1080;
  const alto = esHistoria ? 1920 : 1350;

  return (
    <div style={{
      width: ancho,
      height: alto,
      transform: scale !== 1 ? `scale(${scale})` : undefined,
      transformOrigin: 'top left',
      position: 'relative',
      background: 'var(--brand-primary, #003890)',
      fontFamily: 'var(--font-body, "Source Sans 3", sans-serif)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Fondo degradado hero rich */}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-hero-rich, linear-gradient(135deg, #004098 0%, #003080 46%, #002878 100%))' }} />

      {/* Zona Superior: Foto circular protagonista y sello */}
      <div style={{ position: 'relative', flex: 'none', height: esHistoria ? 1020 : 660 }}>
        {/* Marca de agua del arco detrás del titular */}
        <img
          src="../../assets/promociones/arco-blanco.png"
          alt=""
          style={{ position: 'absolute', left: esHistoria ? -272 : -180, top: esHistoria ? 653 : 420, width: esHistoria ? 904 : 640, opacity: 0.08, pointerEvents: 'none' }}
        />

        {/* Aro amarillo exterior */}
        <div style={{
          position: 'absolute',
          right: esHistoria ? -166 : -110,
          top: esHistoria ? 187 : 110,
          width: esHistoria ? 806 : 560,
          height: esHistoria ? 806 : 560,
          borderRadius: '50%',
          border: `${esHistoria ? 26 : 18}px solid var(--brand-accent, #ffd100)`,
          boxSizing: 'border-box'
        }} />

        {/* Foto circular con recorte azul */}
        <div style={{
          position: 'absolute',
          right: esHistoria ? -140 : -92,
          top: esHistoria ? 213 : 128,
          width: esHistoria ? 754 : 524,
          height: esHistoria ? 754 : 524,
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'var(--blue-900, #002878)'
        }}>
          <img src={foto} alt="Alumnos del CFP 401" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(200deg, rgba(0,40,120,0) 45%, rgba(0,40,120,.45) 100%)' }} />
        </div>

        {/* Logo Institucional Blanco */}
        <img
          src="../../assets/promociones/logo-blanco.png"
          alt="CFP N° 401 Avellaneda"
          style={{ position: 'absolute', left: 70, top: esHistoria ? 130 : 60, width: esHistoria ? 620 : 480, height: 'auto', display: 'block' }}
        />

        {/* Sello rotado 100% Gratuito */}
        {conSello && (
          <div style={{
            position: 'absolute',
            left: esHistoria ? 490 : 340,
            top: esHistoria ? 650 : 400,
            width: esHistoria ? 290 : 220,
            height: esHistoria ? 290 : 220,
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
            boxShadow: '14px 14px 0 var(--blue-900, #002878)'
          }}>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: esHistoria ? 84 : 64, lineHeight: 1 }}>100%</div>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: esHistoria ? 28 : 22, letterSpacing: '.1em', marginTop: 4 }}>GRATUITO</div>
          </div>
        )}
      </div>

      {/* Zona Media: Titulares y etiquetas de oficios */}
      <div style={{
        position: 'relative',
        flex: '1 1 auto',
        minHeight: 0,
        overflow: 'hidden',
        padding: esHistoria ? '0 80px 40px' : '0 60px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 26, letterSpacing: '.16em', color: 'var(--brand-accent, #ffd100)' }}>
          <span style={{ width: 50, height: 7, background: 'var(--brand-accent, #ffd100)' }} />
          <span>{antetitulo}</span>
        </div>
        <div style={{ marginTop: 14, fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: esHistoria ? 96 : 74, lineHeight: .98, letterSpacing: '-.04em', color: '#fff', maxWidth: 920, textWrap: 'balance' }}>{linea1}</div>
        <div style={{
          marginTop: 14,
          background: 'var(--brand-accent, #ffd100)',
          color: 'var(--blue-900, #002878)',
          fontFamily: 'var(--font-display, Poppins, sans-serif)',
          fontWeight: 800,
          fontSize: esHistoria ? 96 : 74,
          lineHeight: 1,
          letterSpacing: '-.04em',
          maxWidth: 900,
          textWrap: 'balance',
          padding: '4px 30px 12px',
          borderRadius: 22,
          transform: 'rotate(-2deg)',
          boxShadow: '12px 12px 0 var(--blue-900, #002878)'
        }}>{linea2}</div>
        <div style={{ marginTop: 28, maxWidth: 900, fontSize: esHistoria ? 32 : 26, fontWeight: 600, lineHeight: 1.3, textWrap: 'pretty' }}>{bajada}</div>

        {conCursos && (
          <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 10, maxWidth: 920 }}>
            {cursos.map((c, i) => (
              <span key={i} style={{ border: '3px solid rgba(255,255,255,.75)', borderRadius: 999, padding: '6px 20px', fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 21, letterSpacing: '.02em', whiteSpace: 'nowrap' }}>{c}</span>
            ))}
          </div>
        )}
      </div>

      {/* Zona Inferior: Pie blanco con datos y WhatsApp */}
      <div style={{
        position: 'relative',
        flex: 'none',
        background: '#fff',
        color: 'var(--blue-900, #002878)',
        borderTop: '14px solid var(--brand-accent, #ffd100)',
        padding: esHistoria ? '40px 80px 70px' : '30px 60px 36px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 20, letterSpacing: '.14em', color: 'var(--brand-primary, #003890)' }}>{dato1Label}</div>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: 36, lineHeight: 1.08, textWrap: 'balance' }}>{dato1}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 20, letterSpacing: '.14em', color: 'var(--brand-primary, #003890)' }}>{dato2Label}</div>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: 36, lineHeight: 1.08, textWrap: 'balance' }}>{dato2}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', alignItems: 'center', gap: 36, paddingTop: 20, borderTop: '2px solid var(--blue-100, #c0d0f0)' }}>
          <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 20, letterSpacing: '.14em', color: 'var(--brand-primary, #003890)' }}>CONSULTAS POR WHATSAPP</div>
          <div style={{ background: 'var(--blue-900, #002878)', color: 'var(--brand-accent, #ffd100)', fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: 40, lineHeight: 1, padding: '14px 30px', borderRadius: 999, whiteSpace: 'nowrap', justifySelf: 'start' }}>{whatsapp}</div>
        </div>
      </div>
    </div>
  );
}
