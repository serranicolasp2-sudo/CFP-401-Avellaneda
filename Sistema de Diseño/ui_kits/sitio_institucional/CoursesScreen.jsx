const {Button,Badge,Card,SectionHeading,Icon,Select,Input,CourseTable,Tabs,Callout}=window.CFP401AvellanedaDesignSystem_6c39ff;
const MAPS_URL_CURSOS='https://www.google.com/maps/place/Cfp+401/@-34.6516833,-58.347049,15z/data=!4m5!3m4!1s0x0:0x117f33b4198391f2!8m2!3d-34.6516831!4d-58.347049?shorturl=1';
function CoursesScreen({onNavigate,onInscripcion}){
  const all=window.CFP_DATA.courses;
  const familias=['Todas',...Array.from(new Set(all.map(c=>c.familia)))];
  const [fam,setFam]=React.useState('Todas');
  const [q,setQ]=React.useState('');
  const [view,setView]=React.useState('Tarjetas');
  const rows=all.filter(c=>(fam==='Todas'||c.familia===fam)&&c.curso.toLowerCase().includes(q.toLowerCase()));
  return <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--space-12) var(--gutter) var(--section-y)'}}>
    <SectionHeading overline="Oferta formativa" title="Cursos gratuitos con certificación oficial" subtitle="Todos los cursos se dictan en la sede de Juan Pablo Angulo 1272, Dock Sud, salvo donde se indique un anexo."/>
    <Callout tone="info" title="Inscripciones cerradas por el momento" style={{marginTop:'var(--space-8)'}}>Las cursadas están en marcha. Hay dos períodos de inscripción por año: de diciembre a febrero para los cursos que comienzan en marzo, y durante junio y julio para los que comienzan en agosto. <a onClick={onInscripcion} style={{cursor:'pointer',fontWeight:600}}>Ver cómo inscribirte</a>.</Callout>
    <Callout tone="accent" title="Requisito general" style={{marginTop:'var(--space-4)'}}>Presentar 4 fotocopias del DNI y la constancia de estudios requerida por el curso.</Callout>
    <div style={{display:'flex',gap:'var(--space-4)',alignItems:'flex-end',marginTop:'var(--space-8)',flexWrap:'wrap'}}>
      <Input label="Buscar curso" placeholder="Soldador, informática…" value={q} onChange={e=>setQ(e.target.value)} style={{flex:'1 1 280px'}}/>
      <Select label="Familia profesional" options={familias} value={fam} onChange={e=>setFam(e.target.value)} style={{flex:'0 0 260px'}}/>
      <div style={{marginLeft:'auto'}}><Tabs items={['Tarjetas','Tabla']} active={view} onChange={setView}/></div>
    </div>
    <div style={{marginTop:'var(--space-8)'}}>
      {view==='Tabla'
        ? <CourseTable rows={rows.map(c=>({curso:c.curso,horarios:c.horarios,sede:c.sede,requisitos:c.requisitos}))}/>
        : <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'var(--space-6)'}}>
            {rows.map(c=><Card key={c.curso} accentBar hoverable padding="var(--space-6)">
              <div style={{display:'flex',gap:'var(--space-3)',alignItems:'flex-start'}}>
                <h3 style={{fontSize:21,flex:1,lineHeight:1.2}}>{c.curso}</h3>
                <Badge tone="brand">{c.familia}</Badge>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'var(--space-4)',marginTop:'var(--space-4)',fontSize:14,color:'var(--text-body)'}}>
                <span style={{display:'flex',gap:8,alignItems:'center'}}><Icon name="clock" size={16} color="var(--brand-primary)"/>{c.horarios}</span>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'var(--space-4)',marginTop:'var(--space-2)',fontSize:14,color:'var(--text-muted)'}}>
                <span style={{display:'flex',gap:8,alignItems:'center'}}><Icon name="map-pin" size={16} color="var(--brand-primary)"/>{c.sede}</span>
                <span style={{display:'flex',gap:8,alignItems:'center'}}><Icon name="file-check" size={16} color="var(--brand-primary)"/>{c.requisitos}</span>
              </div>
              <div style={{marginTop:'var(--space-5)',display:'flex',gap:'var(--space-3)',alignItems:'center'}}>
                <Badge tone="neutral">Cursada en marcha</Badge><Badge tone="neutral">{c.duracion}</Badge>
                <Button size="sm" variant="secondary" style={{marginLeft:'auto'}} onClick={onInscripcion}>Cómo inscribirme</Button>
              </div>
            </Card>)}
          </div>}
    </div>
    {rows.length===0&&<p style={{marginTop:'var(--space-8)',color:'var(--text-muted)'}}>No encontramos cursos con ese filtro. Probá con otra familia profesional.</p>}
  </div>;
}