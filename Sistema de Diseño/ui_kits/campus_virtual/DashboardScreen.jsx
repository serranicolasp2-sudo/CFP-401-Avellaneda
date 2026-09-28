const {Card,Button,Badge,ProgressBar,Alert,InfoList,SectionHeading,Icon,StatBlock}=window.CFP401AvellanedaDesignSystem_6c39ff;
const CAMPUS_COURSES=[{t:'Soldador MIG-TIG',doc:'Prof. R. Giménez',p:62,next:'Entrega: práctica de cordón horizontal · vie 19/09'},{t:'Instalador de Sistemas Domóticos',doc:'Prof. L. Sosa',p:38,next:'Clase sincrónica · mié 17/09 19:00 hs'},{t:'Creador de contenido audiovisual',doc:'Prof. A. Duarte',p:81,next:'Corrección de guion publicada'}];
function DashboardScreen({onOpenCourse}){
  return <div style={{display:'grid',gap:'var(--space-8)'}}>
    <Alert tone="info" onDismiss={()=>{}}>Recordá que la inscripción a los módulos del segundo cuatrimestre cierra el 30/09.</Alert>
    <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'var(--space-8)'}}>
      <div>
        <SectionHeading overline="Tus cursos" title="Continuá donde quedaste"/>
        <div style={{display:'grid',gap:'var(--space-5)',marginTop:'var(--space-6)'}}>
          {CAMPUS_COURSES.map(c=><Card key={c.t} hoverable accentBar padding="var(--space-5)" onClick={onOpenCourse}>
            <div style={{display:'flex',alignItems:'flex-start',gap:'var(--space-4)'}}>
              <div style={{flex:1}}>
                <h3 style={{fontSize:19}}>{c.t}</h3>
                <p style={{margin:'6px 0 0',fontSize:14,color:'var(--text-muted)'}}>{c.doc}</p>
              </div>
              <Badge tone={c.p>75?'success':'brand'}>{c.p>75?'Al día':'En curso'}</Badge>
            </div>
            <ProgressBar value={c.p} label="Avance" style={{marginTop:'var(--space-4)'}}/>
            <div style={{marginTop:'var(--space-4)',display:'flex',alignItems:'center',gap:'var(--space-3)',fontSize:14,color:'var(--text-body)'}}>
              <Icon name="calendar-clock" size={16} color="var(--brand-primary)"/>{c.next}
              <Button size="sm" variant="secondary" style={{marginLeft:'auto'}} onClick={onOpenCourse}>Entrar</Button>
            </div>
          </Card>)}
        </div>
      </div>
      <div style={{display:'grid',gap:'var(--space-6)',alignContent:'start'}}>
        <Card padding="var(--space-6)"><h3 style={{fontSize:17,marginBottom:'var(--space-4)'}}>Próximas fechas</h3>
          <InfoList dense items={[{label:'17/09',value:'Clase sincrónica de Domótica'},{label:'19/09',value:'Entrega práctica MIG-TIG'},{label:'30/09',value:'Cierre de inscripción a módulos'}]}/>
        </Card>
        <Card padding="var(--space-6)" style={{display:'flex',gap:'var(--space-8)'}}><StatBlock value="3" label="Cursos activos"/><StatBlock value="8,4" label="Promedio"/></Card>
        <Card padding="var(--space-6)"><h3 style={{fontSize:17,marginBottom:'var(--space-3)'}}>Ayuda</h3><p style={{margin:0,fontSize:14,color:'var(--text-muted)'}}>Escribinos por WhatsApp al 11 6105-6018 o acercate a la sede de 10 a 19 hs.</p></Card>
      </div>
    </div>
  </div>;
}