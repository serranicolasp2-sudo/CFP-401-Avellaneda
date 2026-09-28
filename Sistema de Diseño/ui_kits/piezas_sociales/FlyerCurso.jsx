// UI Kit — Piezas Sociales: Flyer de Curso Estándar (Definitivo)
// Admite formatos 'feed' (4:5 - 1080x1350) y 'historia' (9:16 - 1080x1920)
function FlyerCurso({
  formato = 'feed',
  curso = 'SOLDADOR BÁSICO',
  antetitulo = 'CURSO · FORMACIÓN PROFESIONAL',
  frase = 'ES TU TIEMPO DE APRENDER',
  dias = 'Martes y jueves',
  horario = '17:50 a 21:50 hs',
  requisito = 'Constancia de estudios primarios o superiores',
  sede = 'Juan Pablo Angulo 1272, Dock Sud',
  certificacion = 'Oficial DGCyE',
  whatsapp = '11 6105-6018',
  foto = '../../assets/promociones/soldadura-1.webp',
  conCuadricula = true,
  conSello = true,
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
      background: '#ffffff',
      fontFamily: 'var(--font-body, "Source Sans 3", sans-serif)',
      color: 'var(--text-body, #333c4a)',
      overflow: 'hidden'
    }}>
      {/* Fondo cuadriculado */}
      {conCuadricula && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(var(--blue-100, #c0d0f0) 1px, transparent 1px), linear-gradient(90deg, var(--blue-100, #c0d0f0) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          opacity: 0.55,
          pointerEvents: 'none'
        }} />
      )}

      {/* Filete superior amarillo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 12, background: 'var(--brand-accent, #ffd100)', zIndex: 5 }} />

      {/* Franja azul curva inferior */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: esHistoria ? 1120 : 790,
        bottom: 0,
        background: 'var(--gradient-hero-rich, linear-gradient(135deg, #004098 0%, #003080 46%, #002878 100%))',
        borderTopLeftRadius: '62% 160px',
        borderTopRightRadius: '38% 70px',
        overflow: 'hidden',
        zIndex: 1
      }}>
        <img src="../../assets/promociones/arco-blanco.png" alt="" style={{ position: 'absolute', right: -110, bottom: -80, width: 700, opacity: 0.08 }} />
      </div>

      {/* Antetítulo y Titular */}
      <div style={{ position: 'absolute', left: 70, right: 70, top: esHistoria ? 150 : 70, zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 24, letterSpacing: '.14em', color: 'var(--brand-primary, #003890)' }}>
          <span style={{ width: 50, height: 7, background: 'var(--brand-accent, #ffd100)' }} />
          <span>{antetitulo}</span>
        </div>
        <h1 style={{
          margin: '18px 0 0',
          fontFamily: 'var(--font-display, Poppins, sans-serif)',
          fontWeight: 800,
          fontSize: esHistoria ? 126 : 88,
          lineHeight: 1.04,
          letterSpacing: '-.035em',
          color: 'var(--blue-900, #002878)',
          maxWidth: esHistoria ? 920 : 660,
          textWrap: 'balance'
        }}>{curso}</h1>
      </div>

      {/* Foto con Arco */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: esHistoria ? 520 : 330,
        width: esHistoria ? 650 : 620,
        height: esHistoria ? 820 : 600,
        borderTopRightRadius: 320,
        overflow: 'hidden',
        zIndex: 2,
        WebkitMaskImage: 'linear-gradient(180deg, #000 65%, transparent 100%)',
        maskImage: 'linear-gradient(180deg, #000 65%, transparent 100%)'
      }}>
        <img src={foto} alt={curso} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,40,120,0) 40%, rgba(0,40,120,.55) 85%)' }} />
      </div>
      {/* Filete de arco decorativo */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: esHistoria ? 500 : 314,
        width: esHistoria ? 670 : 640,
        height: esHistoria ? 540 : 400,
        borderTop: '12px solid var(--brand-accent, #ffd100)',
        borderRight: '12px solid var(--brand-accent, #ffd100)',
        borderTopRightRadius: 340,
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      {/* Cápsula Amarilla con Días y Horarios */}
      <div style={{
        position: 'absolute',
        right: 60,
        top: esHistoria ? 500 : 310,
        width: esHistoria ? 320 : 310,
        height: esHistoria ? 860 : 640,
        zIndex: 3,
        background: 'var(--brand-accent, #ffd100)',
        borderRadius: 999,
        boxShadow: '16px 16px 0 var(--blue-900, #002878)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: esHistoria ? '90px 26px 36px' : '60px 24px 30px',
        textAlign: 'center',
        color: 'var(--blue-900, #002878)'
      }}>
        <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: 38, lineHeight: 1.05, letterSpacing: '-.01em', textWrap: 'balance' }}>¡INSCRIBITE AHORA!</div>
        <div style={{ width: 80, height: 6, background: 'var(--blue-900, #002878)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '.14em' }}>DÍAS</div>
          <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: esHistoria ? 44 : 36, lineHeight: 1.1, textWrap: 'balance' }}>{dias}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 22, letterSpacing: '.14em' }}>HORARIO</div>
          <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: esHistoria ? 46 : 38, lineHeight: 1.08 }}>{horario}</div>
        </div>
        {conSello && (
          <div style={{
            width: esHistoria ? 240 : 200,
            height: esHistoria ? 240 : 200,
            borderRadius: '50%',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-primary, #003890)',
            boxShadow: '0 8px 24px rgba(0,40,120,.18)'
          }}>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: esHistoria ? 64 : 54, lineHeight: 1 }}>100%</div>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: esHistoria ? 24 : 20, letterSpacing: '.1em', marginTop: 4 }}>GRATUITO</div>
          </div>
        )}
      </div>

      {/* Frase institucional sobre fondo azul */}
      <div style={{ position: 'absolute', left: 70, top: esHistoria ? 1160 : 810, zIndex: 3 }}>
        <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: esHistoria ? 68 : 50, lineHeight: 1.05, letterSpacing: '-.02em', color: '#fff', maxWidth: 580, textWrap: 'balance' }}>{frase}</div>
        <div style={{ width: 90, height: 8, background: 'var(--brand-accent, #ffd100)', marginTop: 18 }} />
      </div>

      {/* Datos inferiores y pie */}
      <div style={{
        position: 'absolute',
        left: 70,
        right: 70,
        bottom: esHistoria ? 150 : 50,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: esHistoria ? 36 : 24,
        color: '#fff'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr .9fr', gap: 28 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 20, letterSpacing: '.14em', color: 'var(--brand-accent, #ffd100)' }}>REQUISITO</div>
            <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.25, marginTop: 6 }}>{requisito}</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 20, letterSpacing: '.14em', color: 'var(--brand-accent, #ffd100)' }}>SEDE</div>
            <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.25, marginTop: 6 }}>{sede}</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 20, letterSpacing: '.14em', color: 'var(--brand-accent, #ffd100)' }}>CERTIFICACIÓN</div>
            <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.25, marginTop: 6 }}>{certificacion}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 30, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.3)' }}>
          <img src="../../assets/promociones/logo-blanco.png" alt="CFP N° 401 Avellaneda" style={{ width: esHistoria ? 400 : 340, height: 'auto', display: 'block' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 18, letterSpacing: '.12em' }}>CONSULTAS POR WHATSAPP</div>
            <div style={{ background: 'var(--brand-accent, #ffd100)', color: 'var(--blue-900, #002878)', fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: esHistoria ? 42 : 36, lineHeight: 1, padding: '14px 34px', borderRadius: 999 }}>{whatsapp}</div>
          </div>
        </div>
      </div>
    </div>
  );
}