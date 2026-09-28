// UI Kit — Piezas Sociales: Promo de Curso Alternativa (Definitiva)
// Admite formatos 'feed' (4:5 - 1080x1350) y 'historia' (9:16 - 1080x1920)
function PromoCurso({
  formato = 'feed',
  categoria = 'METALMECÁNICA',
  curso = 'Soldador básico',
  bajada = 'Aprendé soldadura por arco eléctrico en taller, con certificación oficial DGCyE.',
  dias = 'Martes y jueves',
  horario = '17:50 a 21:50 hs',
  duracion = '4 meses',
  requisito = 'Primaria completa',
  cta = '¡Inscribite ahora!',
  sede = 'J. P. Angulo 1272, Dock Sud',
  whatsapp = '11 6105-6018',
  foto = '../../assets/promociones/soldadura-1.webp',
  conCinta = true,
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
      background: 'var(--blue-900, #002878)',
      fontFamily: 'var(--font-body, "Source Sans 3", sans-serif)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Mitad superior: Foto a sangre con degradado */}
      <div style={{
        position: 'relative',
        flex: '1 1 auto',
        minHeight: esHistoria ? 760 : 480,
        overflow: 'hidden',
        background: 'var(--brand-primary, #003890)'
      }}>
        <img src={foto} alt={curso} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,30,90,.65) 0%, rgba(0,30,90,0) 32%, rgba(0,30,90,0) 65%, rgba(0,30,90,.6) 100%)'
        }} />
        <img src="../../assets/promociones/logo-blanco.png" alt="CFP N° 401 Avellaneda" style={{ position: 'absolute', left: 64, top: esHistoria ? 100 : 50, width: esHistoria ? 620 : 480, height: 'auto' }} />

        {/* Cinta de acento en la esquina */}
        {conCinta && (
          <div style={{
            position: 'absolute',
            right: 72,
            top: 0,
            width: 180,
            padding: esHistoria ? '150px 0 60px' : '90px 0 45px',
            background: 'var(--brand-accent, #ffd100)',
            color: 'var(--blue-900, #002878)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%)',
            zIndex: 3
          }}>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: 50, lineHeight: 1 }}>100%</div>
            <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 18, letterSpacing: '.12em', marginTop: 6 }}>GRATUITO</div>
          </div>
        )}
      </div>

      {/* Tarjeta blanca flotante con sombra */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        flex: 'none',
        margin: esHistoria ? '-150px 56px 0' : '-90px 52px 0',
        background: '#fff',
        color: 'var(--blue-900, #002878)',
        borderRadius: 30,
        padding: esHistoria ? '44px 52px 48px' : '36px 48px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxShadow: '0 24px 60px rgba(0,20,70,.35)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 24, letterSpacing: '.16em', color: 'var(--brand-primary, #003890)' }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--brand-accent, #ffd100)', boxShadow: '0 0 0 4px var(--blue-900, #002878)' }} />
          <span>{categoria}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: esHistoria ? 84 : 64, lineHeight: .98, letterSpacing: '-.035em', textWrap: 'balance' }}>{curso}</div>
        <div style={{ fontSize: esHistoria ? 29 : 24, fontWeight: 500, lineHeight: 1.35, color: 'var(--text-body, #333c4a)', textWrap: 'pretty' }}>{bajada}</div>
      </div>

      {/* Grilla de 4 datos */}
      <div style={{ position: 'relative', flex: 'none', padding: esHistoria ? '36px 88px 40px' : '28px 70px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: esHistoria ? '22px 40px' : '16px 36px' }}>
          {[
            { label: 'DÍAS', val: dias },
            { label: 'HORARIO', val: horario },
            { label: 'DURACIÓN', val: duracion },
            { label: 'REQUISITO', val: requisito }
          ].map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, borderLeft: '4px solid var(--brand-accent, #ffd100)', paddingLeft: 18 }}>
              <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 19, letterSpacing: '.16em', color: 'var(--brand-accent, #ffd100)' }}>{d.label}</div>
              <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 700, fontSize: 28, lineHeight: 1.15, textWrap: 'balance' }}>{d.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Franja amarilla inferior de contacto */}
      <div style={{
        position: 'relative',
        flex: 'none',
        background: 'var(--brand-accent, #ffd100)',
        color: 'var(--blue-900, #002878)',
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) auto',
        alignItems: 'center',
        gap: 28,
        padding: esHistoria ? '36px 56px 80px' : '28px 52px 32px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: 38, lineHeight: 1 }}>{cta}</div>
          <div style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 600, fontSize: 22, lineHeight: 1.25, color: 'var(--blue-900, #002878)' }}>{sede}</div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          background: 'var(--blue-900, #002878)',
          color: '#fff',
          borderRadius: 999,
          padding: '12px 30px 12px 12px',
          whiteSpace: 'nowrap'
        }}>
          <span style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--brand-accent, #ffd100)', color: 'var(--blue-900, #002878)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: 18 }}>WA</span>
          <span style={{ fontFamily: 'var(--font-display, Poppins, sans-serif)', fontWeight: 800, fontSize: 38, lineHeight: 1 }}>{whatsapp}</span>
        </div>
      </div>
    </div>
  );
}
