/* DESHABILITADO — las inscripciones están cerradas. Esta pantalla no tiene ruta en index.html.
   Reactivar agregando <script type="text/babel" src="EnrollScreen.jsx"></script> y la ruta
   {page==='Inscripción'&&<EnrollScreen .../>} cuando abra el próximo período. */
const {Button,Card,SectionHeading,Input,Select,Checkbox,Radio,Field,Callout,InfoList,Alert,Modal,Icon}=window.CFP401AvellanedaDesignSystem_6c39ff;
function EnrollScreen({onNavigate}){
  const all=window.CFP_DATA.courses;
  const [step,setStep]=React.useState(1);
  const [form,setForm]=React.useState({nombre:'',dni:'',tel:'',curso:all[0].curso,turno:'Tarde',dniOk:false,constancia:false});
  const [modal,setModal]=React.useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const steps=['Tus datos','Curso y turno','Documentación'];
  return <div style={{maxWidth:900,margin:'0 auto',padding:'var(--space-12) var(--gutter) var(--section-y)'}}>
    <SectionHeading overline="Preinscripción" title="Reservá tu lugar en 3 pasos" subtitle="La preinscripción no reemplaza el trámite presencial: te esperamos en la sede con tu documentación."/>
    <div style={{display:'flex',gap:'var(--space-2)',margin:'var(--space-8) 0'}}>
      {steps.map((s,i)=><div key={s} style={{flex:1}}>
        <div style={{height:6,borderRadius:3,background:i<step?'var(--brand-accent)':'var(--neutral-100)'}}/>
        <div style={{marginTop:8,fontFamily:'var(--font-display)',fontWeight:600,fontSize:13,color:i<step?'var(--brand-primary)':'var(--text-muted)'}}>{i+1}. {s}</div>
      </div>)}
    </div>
    <Card padding="var(--space-8)">
      {step===1&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-5)'}}>
        <Input label="Nombre y apellido" required value={form.nombre} onChange={e=>set('nombre',e.target.value)} placeholder="Como figura en el DNI"/>
        <Input label="DNI" required value={form.dni} onChange={e=>set('dni',e.target.value)} hint="Sin puntos"/>
        <Input label="Teléfono / WhatsApp" value={form.tel} onChange={e=>set('tel',e.target.value)} placeholder="11 6105-6018"/>
        <Input label="Correo electrónico" type="email" placeholder="nombre@correo.com"/>
      </div>}
      {step===2&&<div style={{display:'grid',gap:'var(--space-6)'}}>
        <Select label="Curso" options={all.map(c=>c.curso)} value={form.curso} onChange={e=>set('curso',e.target.value)} hint={all.find(c=>c.curso===form.curso).horarios}/>
        <Field label="Turno de preferencia" hint="Los horarios definitivos se confirman en la sede."><Radio label="Mañana" checked={form.turno==='Mañana'} onChange={()=>set('turno','Mañana')}/><Radio label="Tarde" checked={form.turno==='Tarde'} onChange={()=>set('turno','Tarde')}/><Radio label="Noche" checked={form.turno==='Noche'} onChange={()=>set('turno','Noche')}/></Field>
        <Callout tone="info" title="Requisitos del curso">{all.find(c=>c.curso===form.curso).requisitos}</Callout>
      </div>}
      {step===3&&<div style={{display:'grid',gap:'var(--space-6)'}}>
        <Field label="Confirmá que vas a presentar:"><Checkbox label="4 fotocopias del DNI" checked={form.dniOk} onChange={v=>set('dniOk',v)}/><Checkbox label="Constancia de estudios requerida" checked={form.constancia} onChange={v=>set('constancia',v)}/></Field>
        {!(form.dniOk&&form.constancia)&&<Alert tone="warning">Necesitás confirmar ambos requisitos para enviar la preinscripción.</Alert>}
        <InfoList items={[{label:'Sede:',value:'Juan Pablo Angulo 1272, Dock Sud'},{label:'Horario de inscripción:',value:'lunes a viernes de 10 a 19 hs'},{label:'Consultas:',value:'WhatsApp 11 6105-6018 (solo mensajes)'}]}/>
      </div>}
      <div style={{display:'flex',gap:'var(--space-3)',marginTop:'var(--space-8)'}}>
        {step>1&&<Button variant="ghost" onClick={()=>setStep(step-1)} iconLeft={<Icon name="arrow-left" size={18}/>}>Atrás</Button>}
        {step<3
          ? <Button style={{marginLeft:'auto'}} onClick={()=>setStep(step+1)} iconRight={<Icon name="arrow-right" size={18}/>}>Continuar</Button>
          : <Button variant="accent" style={{marginLeft:'auto'}} disabled={!(form.dniOk&&form.constancia)} onClick={()=>setModal(true)}>Enviar preinscripción</Button>}
      </div>
    </Card>
    <Modal open={modal} title="¡Listo! Tu preinscripción fue registrada" onClose={()=>setModal(false)} footer={<><Button variant="ghost" onClick={()=>setModal(false)}>Cerrar</Button><Button variant="accent" onClick={()=>{setModal(false);onNavigate('Campus');}}>Ir al Campus Virtual</Button></>}>
      Guardamos tu lugar en <strong>{form.curso}</strong> ({form.turno}). Acercate a la sede con tu documentación de lunes a viernes de 10 a 19 hs.
    </Modal>
  </div>;
}