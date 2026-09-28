const {SideNav,Logo,Icon,Badge,Button}=window.CFP401AvellanedaDesignSystem_6c39ff;
function CampusShell({page,onNavigate,onLogout,children}){
  const items=[{label:'Inicio',icon:<Icon name="home" size={18}/>},{label:'Mis cursos',icon:<Icon name="book-open" size={18}/>,count:3},{label:'Curso',icon:<Icon name="graduation-cap" size={18}/>},{label:'Calificaciones',icon:<Icon name="clipboard-check" size={18}/>},{label:'Mensajes',icon:<Icon name="mail" size={18}/>,count:2}];
  return <div style={{display:'flex',minHeight:'100vh',background:'var(--surface-page)'}}>
    <div style={{display:'flex',flexDirection:'column',background:'var(--surface-inverse)'}}>
      <div style={{padding:'var(--space-6) var(--space-4) var(--space-2)'}}><img src="../../assets/Logos/logo-campus-horizontal.png" alt="Campus Virtual" style={{width:200,background:'#fff',borderRadius:'var(--radius-md)',padding:8}}/></div>
      <SideNav items={items} active={page} onNavigate={onNavigate} style={{flex:1}} footer={<a onClick={onLogout} style={{color:'var(--blue-200)',cursor:'pointer',fontSize:13}}>Cerrar sesión</a>}/>
    </div>
    <div style={{flex:1,minWidth:0}}>
      <header style={{background:'var(--surface-card)',borderBottom:'1px solid var(--border-subtle)',padding:'14px var(--space-8)',display:'flex',alignItems:'center',gap:'var(--space-4)'}}>
        <h2 style={{fontSize:20}}>{page}</h2>
        <Badge tone="brand" style={{marginLeft:'var(--space-2)'}}>Ciclo en curso</Badge>
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:'var(--space-4)'}}>
          <Icon name="bell" size={20} color="var(--neutral-500)"/>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{width:34,height:34,borderRadius:'50%',background:'var(--brand-primary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontWeight:700,fontSize:14}}>MR</span>
            <div style={{lineHeight:1.2}}><div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:14,color:'var(--text-title)'}}>Micaela Ríos</div><div style={{fontSize:12,color:'var(--text-muted)'}}>Estudiante</div></div>
          </div>
        </div>
      </header>
      <main style={{padding:'var(--space-8)'}}>{children}</main>
    </div>
  </div>;
}