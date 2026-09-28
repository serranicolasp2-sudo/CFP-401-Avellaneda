const {Card,Tabs,Badge,Button,Icon,ProgressBar,Callout,Alert,Modal,Input,InfoList}=window.CFP401AvellanedaDesignSystem_6c39ff;
function CourseScreen(){
  const [tab,setTab]=React.useState('Contenidos');
  const [open,setOpen]=React.useState(false);
  const [sent,setSent]=React.useState(false);
  const units=[{n:'Módulo 1',t:'Seguridad e higiene en soldadura',done:true,items:['Apunte: EPP en taller (PDF)','Video: preparación del puesto','Cuestionario 1']},{n:'Módulo 2',t:'Soldadura MIG: parámetros',done:true,items:['Apunte: gases y caudales (PDF)','Práctica guiada 2']},{n:'Módulo 3',t:'Cordón horizontal y vertical',done:false,items:['Consigna de entrega','Foro de dudas']}];
  return <div style={{display:'grid',gap:'var(--space-6)'}}>
    <Card padding="0">
      <div style={{background:'var(--gradient-hero)',color:'#fff',padding:'var(--space-8)',position:'relative',overflow:'hidden'}}>
        <img src="../../assets/Logos/logo-isotipo.png" alt="" style={{position:'absolute',right:-30,top:-30,height:'160%',opacity:.09,}}/>
        <Badge tone="accent">Metalmecánica</Badge>
        <h2 style={{color:'#fff',fontSize:34,marginTop:'var(--space-4)'}}>Soldador MIG-TIG</h2>
        <p style={{margin:'var(--space-3) 0 0',color:'var(--blue-100)',fontSize:16}}>Prof. R. Giménez · Lunes, miércoles y viernes de 17:50 a 21:50 hs · Sede Juan Pablo Angulo 1272</p>
        <ProgressBar value={62} label="Tu avance" style={{marginTop:'var(--space-6)',maxWidth:420}}/>
      </div>
      <div style={{padding:'0 var(--space-8)'}}><Tabs items={['Contenidos','Entregas','Calificaciones','Foro']} active={tab} onChange={setTab} style={{marginTop:'var(--space-6)'}}/></div>
      <div style={{padding:'var(--space-8)'}}>
        {tab==='Contenidos'&&<div style={{display:'grid',gap:'var(--space-5)'}}>
          {units.map(u=><div key={u.n} style={{border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-md)',overflow:'hidden'}}>
            <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)',padding:'var(--space-4) var(--space-5)',background:'var(--surface-subtle)'}}>
              <Icon name={u.done?'check-circle-2':'circle-dashed'} size={20} color={u.done?'var(--state-success-fg)':'var(--neutral-400)'}/>
              <strong style={{fontFamily:'var(--font-display)',fontSize:16,color:'var(--text-title)'}}>{u.n} · {u.t}</strong>
              {u.done&&<Badge tone="success" style={{marginLeft:'auto'}}>Completado</Badge>}
            </div>
            <ul style={{listStyle:'none',margin:0,padding:'var(--space-4) var(--space-5)',display:'grid',gap:10}}>
              {u.items.map(i=><li key={i} style={{display:'flex',alignItems:'center',gap:10,fontSize:15}}><Icon name="file-text" size={16} color="var(--brand-primary)"/><a style={{cursor:'pointer'}}>{i}</a></li>)}
            </ul>
          </div>)}
        </div>}
        {tab==='Entregas'&&<div style={{display:'grid',gap:'var(--space-5)',maxWidth:640}}>
          {sent&&<Alert tone="success">Tu entrega fue subida y está pendiente de corrección.</Alert>}
          <Callout tone="accent" title="Práctica de cordón horizontal">Entregá 3 fotos del cordón y el registro de parámetros. Vence el viernes 19/09 a las 23:59.</Callout>
          <Button variant="accent" onClick={()=>setOpen(true)} iconLeft={<Icon name="upload" size={18}/>}>Subir entrega</Button>
          <InfoList dense items={[{label:'Entrega 1:',value:'Cuestionario de seguridad — 9 (corregido)'},{label:'Entrega 2:',value:'Práctica guiada MIG — 8 (corregido)'}]}/>
        </div>}
        {tab==='Calificaciones'&&<table style={{width:'100%',borderCollapse:'collapse',fontSize:15}}><thead><tr>{['Instancia','Fecha','Nota'].map(h=><th key={h} style={{textAlign:'left',padding:'10px 12px',borderBottom:'2px solid var(--border-brand)',fontFamily:'var(--font-display)',fontSize:13,textTransform:'uppercase',letterSpacing:'.06em',color:'var(--blue-900)'}}>{h}</th>)}</tr></thead>
          <tbody>{[['Cuestionario de seguridad','12/04','9'],['Práctica guiada MIG','30/05','8'],['Cordón horizontal','pendiente','—']].map(r=><tr key={r[0]}>{r.map((c,i)=><td key={i} style={{padding:'10px 12px',borderBottom:'1px solid var(--border-subtle)',fontWeight:i===2?700:400,color:i===2?'var(--brand-primary)':'var(--text-body)'}}>{c}</td>)}</tr>)}</tbody></table>}
        {tab==='Foro'&&<div style={{display:'grid',gap:'var(--space-5)',maxWidth:680}}>
          {[['Prof. R. Giménez','Revisen el caudal de gas antes de la práctica del viernes.'],['Micaela R.','¿Se puede entregar el registro de parámetros en papel?']].map(([a,m])=><Card key={a} padding="var(--space-5)"><strong style={{fontFamily:'var(--font-display)',fontSize:15,color:'var(--text-title)'}}>{a}</strong><p style={{margin:'6px 0 0',fontSize:15,color:'var(--text-body)'}}>{m}</p></Card>)}
          <Input label="Escribir en el foro" placeholder="Tu mensaje…"/>
          <Button style={{justifySelf:'start'}}>Publicar</Button>
        </div>}
      </div>
    </Card>
    <Modal open={open} title="Subir entrega" onClose={()=>setOpen(false)} footer={<><Button variant="ghost" onClick={()=>setOpen(false)}>Cancelar</Button><Button variant="accent" onClick={()=>{setSent(true);setOpen(false);setTab('Entregas')}}>Confirmar entrega</Button></>}>
      <div style={{display:'grid',gap:'var(--space-4)'}}>
        <div style={{border:'2px dashed var(--border-strong)',borderRadius:'var(--radius-md)',padding:'var(--space-8)',textAlign:'center',color:'var(--text-muted)',fontSize:14}}>Arrastrá tus archivos o hacé clic para elegirlos</div>
        <Input label="Comentario para el docente" placeholder="Opcional"/>
      </div>
    </Modal>
  </div>;
}