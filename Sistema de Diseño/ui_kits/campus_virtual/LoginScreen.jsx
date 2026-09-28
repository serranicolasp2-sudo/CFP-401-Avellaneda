const {Button,Input,Checkbox,Card,Callout,Icon}=window.CFP401AvellanedaDesignSystem_6c39ff;
function LoginScreen({onLogin}){
  const [u,setU]=React.useState('39482116');
  return <div style={{minHeight:'100vh',display:'grid',gridTemplateColumns:'1.05fr .95fr'}}>
    <div style={{background:'var(--gradient-hero)',color:'#fff',padding:'var(--space-16) var(--space-12)',display:'flex',flexDirection:'column',justifyContent:'center',position:'relative',overflow:'hidden'}}>
      <img src="../../assets/Logos/logo-isotipo.png" alt="" style={{position:'absolute',right:-80,bottom:-60,height:'80%',opacity:.08,}}/>
      <img src="../../assets/Logos/logo-campus-horizontal.png" alt="Campus Virtual" style={{width:360,background:'#fff',borderRadius:'var(--radius-lg)',padding:'var(--space-4)'}}/>
      <h1 style={{color:'#fff',fontSize:44,lineHeight:1.05,letterSpacing:'-.02em',marginTop:'var(--space-8)',maxWidth:520}}>Tu aula, tus materiales y tus entregas en un solo lugar</h1>
      <p style={{fontSize:18,lineHeight:1.6,color:'var(--blue-100)',maxWidth:480,marginTop:'var(--space-5)'}}>Ingresá con tu DNI y la clave que te dio tu docente. Si es tu primera vez, consultá en la sede.</p>
    </div>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'var(--space-12)'}}>
      <Card padding="var(--space-8)" style={{width:420}}>
        <h2 style={{fontSize:26,marginBottom:'var(--space-2)'}}>Ingresar</h2>
        <p style={{marginTop:0,fontSize:15,color:'var(--text-muted)'}}>Campus Virtual · CFP N° 401 Avellaneda</p>
        <div style={{display:'grid',gap:'var(--space-5)',marginTop:'var(--space-6)'}}>
          <Input label="DNI" value={u} onChange={e=>setU(e.target.value)} hint="Sin puntos ni espacios"/>
          <Input label="Contraseña" type="password" value="••••••••"/>
          <Checkbox label="Mantener mi sesión iniciada" checked onChange={()=>{}}/>
          <Button variant="accent" size="lg" fullWidth onClick={onLogin}>Entrar al campus</Button>
          <a style={{fontSize:14,textAlign:'center'}}>¿Olvidaste tu contraseña?</a>
        </div>
        <Callout tone="info" style={{marginTop:'var(--space-6)'}}>Consultas por WhatsApp al 11 6105-6018 (solo mensajes).</Callout>
      </Card>
    </div>
  </div>;
}