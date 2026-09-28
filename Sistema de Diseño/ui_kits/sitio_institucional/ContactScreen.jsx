const {Card,SectionHeading,InfoList,Button,Icon,Callout,Input}=window.CFP401AvellanedaDesignSystem_6c39ff;
const WHATSAPP_URL_CONTACTO='https://wa.me/541161056018?text=Hola!%20Estoy%20interesad@%20en%20los%20cursos%20de%20Formaci%C3%B3n%20Profesional.';
const MAPS_URL_CONTACTO='https://www.google.com/maps/place/Cfp+401/@-34.6516833,-58.347049,15z/data=!4m5!3m4!1s0x0:0x117f33b4198391f2!8m2!3d-34.6516831!4d-58.347049?shorturl=1';
function ContactScreen(){
  return <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--space-12) var(--gutter) var(--section-y)'}}>
    <SectionHeading overline="Contacto" title="Estamos en Dock Sud, Avellaneda" subtitle="Podés escribirnos por WhatsApp o acercarte directamente a la sede en el horario de atención."/>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:'var(--space-8)',marginTop:'var(--space-8)',alignItems:'start'}}>
      <Card padding="var(--space-8)">
        <InfoList items={[{label:'Sede:',value:<a href={MAPS_URL_CONTACTO} target="_blank" rel="noopener">Juan Pablo Angulo 1272, Dock Sud, Avellaneda</a>},{label:'Anexo:',value:'Polideportivo Plaza Renunciamiento — Irala y Argentino Valle'},{label:'Atención:',value:'lunes a viernes de 10 a 19 hs'},{label:'WhatsApp:',value:'11 6105-6018 (solo mensajes)'},{label:'Web:',value:'www.cfp401avellaneda.com.ar'}]}/>
        <div style={{display:'flex',gap:'var(--space-3)',marginTop:'var(--space-8)',flexWrap:'wrap'}}>
          <Button variant="accent" href={WHATSAPP_URL_CONTACTO} target="_blank" rel="noopener" iconLeft={<Icon name="message-circle" size={18}/>}>Escribir por WhatsApp</Button>
          <Button variant="secondary" href={MAPS_URL_CONTACTO} target="_blank" rel="noopener" iconLeft={<Icon name="map-pin" size={18}/>}>Ver en el mapa</Button>
        </div>
      </Card>
      <a href={MAPS_URL_CONTACTO} target="_blank" rel="noopener" style={{display:'block',borderRadius:'var(--radius-lg)',overflow:'hidden',border:'1px solid var(--border-subtle)',boxShadow:'var(--shadow-md)',textDecoration:'none'}}>
        <img src="../../assets/fotos/mapa-cfp401.png" alt="Mapa de ubicación del CFP N° 401 en Dock Sud, Avellaneda" style={{width:'100%',display:'block'}}/>
        <span style={{display:'flex',alignItems:'center',gap:'var(--space-2)',padding:'var(--space-4) var(--space-5)',background:'var(--surface-card)',fontSize:14,fontWeight:600,color:'var(--brand-primary)'}}><Icon name="external-link" size={16}/>Abrir en Google Maps</span>
      </a>
    </div>
    <figure style={{margin:'var(--space-10) 0 0'}}>
      <img src="../../assets/fotos/fachada-cfp401.jpg" alt="Fachada de la sede de J. P. Angulo 1272, Dock Sud" style={{width:'100%',aspectRatio:'2048/480',objectFit:'cover',display:'block',borderRadius:'var(--radius-lg)',boxShadow:'var(--shadow-md)'}}/>
      <figcaption style={{marginTop:'var(--space-3)',fontSize:13,color:'var(--text-muted)'}}>La sede de Juan Pablo Angulo 1272, Dock Sud, Avellaneda.</figcaption>
    </figure>
  </div>;
}