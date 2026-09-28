const {Button,Badge,Card,SectionHeading,Logo,Icon,InfoList,Callout,StatBlock,Hero,CourseCard}=window.CFP401AvellanedaDesignSystem_6c39ff;
const WHATSAPP_URL='https://wa.me/541161056018?text=Hola!%20Estoy%20interesad@%20en%20los%20cursos%20de%20Formaci%C3%B3n%20Profesional.';
const MAPS_URL='https://www.google.com/maps/place/Cfp+401/@-34.6516833,-58.347049,15z/data=!4m5!3m4!1s0x0:0x117f33b4198391f2!8m2!3d-34.6516831!4d-58.347049?shorturl=1';
function HomeScreen({onNavigate,onInscripcion}){
  const courses=window.CFP_DATA.courses;
  return <div>
    <Hero overline="Es tu tiempo de aprender" title="Estudiá con nosotros" subtitle="Cursos presenciales sin costo de inscripción ni de cursada, con certificado de la Dirección General de Cultura y Educación de la Provincia de Buenos Aires." primaryCta={{label:'Ver los cursos',onClick:()=>onNavigate('Cursos')}} secondaryCta={{label:'Cómo inscribirme',onClick:onInscripcion}} assetBase="../../assets"/>
    <section style={{background:'var(--surface-accent)'}}>
      <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'18px var(--gutter)',display:'flex',alignItems:'center',gap:'var(--space-4)',flexWrap:'wrap'}}>
        <strong style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:18,color:'var(--text-on-accent)'}}>Nuevas inscripciones A PARTIR DE NOVIEMBRE</strong>
        <span style={{fontSize:16,color:'var(--blue-900)'}}>Lunes a viernes de 10 a 19 hs · <a href={MAPS_URL} target="_blank" rel="noopener" style={{color:'var(--blue-900)',textDecoration:'underline'}}>Juan Pablo Angulo 1272, Dock Sud</a></span>
        <Button size="sm" variant="primary" style={{marginLeft:'auto'}} onClick={onInscripcion}>Quiero inscribirme</Button>
      </div>
    </section>
    <section style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--section-y) var(--gutter)'}}>
      <SectionHeading overline="Nuestra propuesta" title="Aprendizajes que transforman" subtitle="Porque aprender también es construir futuro. Nuestros talleres funcionan con equipamiento real y docentes de oficio." align="center"/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'var(--space-6)',marginTop:'var(--space-10)'}}>
        {[['graduation-cap','Títulos oficiales','Certificación oficial de la Provincia de Buenos Aires.'],['wallet','100% gratuito','Sin costo de inscripción ni de cursada: solo necesitás la documentación pedida.'],['wrench','Talleres equipados','Prácticas en herrería, soldadura, electricidad, sanitarios y gas.']].map(([ic,t,d])=>
          <Card key={t} accentBar><Icon name={ic} size={28} color="var(--brand-primary)"/><h3 style={{fontSize:20,margin:'var(--space-4) 0 var(--space-2)'}}>{t}</h3><p style={{margin:0,fontSize:15,lineHeight:1.6,color:'var(--text-muted)'}}>{d}</p></Card>)}
      </div>
    </section>
    <section style={{background:'var(--surface-subtle)'}}>
      <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--section-y) var(--gutter)'}}>
        <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:'var(--space-6)'}}>
          <SectionHeading overline="Oferta formativa" title="Nuestros cursos"/>
          <Button variant="secondary" onClick={()=>onNavigate('Cursos')} iconRight={<Icon name="arrow-right" size={18}/>}>{`Ver los ${courses.length} cursos`}</Button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'var(--space-6)',marginTop:'var(--space-8)'}}>
          {courses.slice(0,6).map(c=><CourseCard key={c.curso} title={c.curso} schedule={c.horarios} duration={c.duracion} requirements={c.requisitos} location={c.sede} status="Cursada en marcha" onAction={()=>onNavigate('Cursos')}/>)}
        </div>
      </div>
    </section>
    <section id="como-inscribirte" style={{background:'var(--surface-inverse)',color:'#fff',scrollMarginTop:80}}>
      <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--section-y) var(--gutter)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-16)',alignItems:'center'}}>
        <div>
          <SectionHeading invert overline="Cómo inscribirte" title="Acercate a la sede con tu documentación"/>
          <InfoList invert style={{marginTop:'var(--space-6)'}} items={[{label:'4 fotocopias del DNI',value:''},{label:'Constancia de estudios',value:'según el curso elegido'},{label:'Lunes a viernes',value:'de 10 a 19 hs'},{label:'Consultas por WhatsApp',value:'11 6105-6018 (solo mensajes)'}]}/>
          <div style={{marginTop:'var(--space-8)',paddingTop:'var(--space-6)',borderTop:'1px solid rgba(255,255,255,.18)'}}>
            <h3 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:13,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--brand-accent)',margin:0}}>Cuándo abren las inscripciones</h3>
            <p style={{margin:'var(--space-3) 0 0',fontSize:17,lineHeight:1.6,color:'var(--blue-100)',maxWidth:520}}>Hay dos períodos por año: de diciembre a febrero para los cursos que comienzan en marzo, y durante junio y julio para los que comienzan en agosto.</p>
          </div>
          <div style={{marginTop:'var(--space-8)',display:'flex',gap:'var(--space-4)',flexWrap:'wrap'}}>
            <Button variant="accent" size="lg" href={WHATSAPP_URL} target="_blank" rel="noopener" iconLeft={<Icon name="message-circle" size={20}/>}>Pre-Inscripción</Button>
            <Button variant="ghost" size="lg" style={{color:'#fff',borderColor:'rgba(255,255,255,.5)'}} onClick={()=>onNavigate('Campus')}>Ir al Campus</Button>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-8)',alignContent:'center'}}>
          <StatBlock invert value={courses.length} label="Cursos gratuitos con certificación oficial"/>
          <StatBlock invert value="+45" label="Años formando oficios en Dock Sud"/>
          <StatBlock invert value="1979" label="Año de creación del Centro"/>
          <StatBlock invert value="6" label="Familias profesionales"/>
        </div>
      </div>
    </section>
  </div>;
}