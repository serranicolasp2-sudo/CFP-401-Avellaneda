const {Card,SectionHeading,StatBlock,Callout,Icon,Button}=window.CFP401AvellanedaDesignSystem_6c39ff;
const P_NOSOTROS={margin:'0 0 var(--space-5)',fontSize:17,lineHeight:1.7,color:'var(--text-body)',textWrap:'pretty'};
function Foto({src,caption,ratio,style}){
  return <figure style={{margin:0,...style}}>
    <div style={{borderRadius:'var(--radius-lg)',overflow:'hidden',boxShadow:'var(--shadow-md)',background:'var(--neutral-100)'}}>
      <img src={src} alt={caption} style={{width:'100%',aspectRatio:ratio,objectFit:'cover',display:'block'}}/>
    </div>
    {caption&&<figcaption style={{marginTop:'var(--space-3)',fontSize:13,lineHeight:1.5,color:'var(--text-muted)'}}>{caption}</figcaption>}
  </figure>;
}
function NosotrosScreen({onInscripcion}){
  return <div>
    <div style={{position:'relative',background:'var(--brand-primary)'}}>
      <img src="../../assets/fotos/fachada-cfp401.jpg" alt="Fachada del CFP N° 401 en Juan Pablo Angulo 1272, Dock Sud" style={{width:'100%',height:'clamp(220px,32vw,380px)',objectFit:'cover',display:'block',opacity:.92}}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(0,45,98,.92) 0%,rgba(0,45,98,.72) 42%,rgba(0,45,98,0) 78%)'}}/>
      <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center'}}>
        <div style={{maxWidth:'var(--container-max)',width:'100%',margin:'0 auto',padding:'0 var(--gutter)'}}>
          <div style={{maxWidth:560}}>
            <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:12,letterSpacing:'.16em',textTransform:'uppercase',color:'var(--brand-accent)',marginBottom:'var(--space-3)'}}>Nosotros</div>
            <h1 style={{margin:0,fontSize:'clamp(28px,3.4vw,46px)',lineHeight:1.1,fontWeight:800,letterSpacing:'-.02em',color:'#fff'}}>Más de cuatro décadas formando trabajadores</h1>
          </div>
        </div>
      </div>
    </div>
    <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--space-12) var(--gutter) var(--section-y)'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'var(--space-6)',marginBottom:'var(--space-16)'}}>
        <StatBlock value="1979" label="Año de creación"/>
        <StatBlock value="+2.300" label="Cursos dictados"/>
        <StatBlock value="+24.000" label="Egresados con certificado"/>
      </div>
      <SectionHeading overline="Historia institucional" title="De la Unidad de Formación Profesional N° 13 al CFP N° 401" subtitle="El Establecimiento fue creado como Unidad de Formación Profesional Nº 13 el 10 de agosto de 1979. Su radicación en el distrito de Avellaneda se produjo por disposición de la Dirección de Educación Media, Técnica y Formación Profesional el 22 de agosto de 1979."/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'var(--space-10)',marginTop:'var(--space-8)',alignItems:'start'}}>
        <div>
          <p style={P_NOSOTROS}>En abril de 1985 cambió su denominación a Centro de Formación Profesional Nº 13.</p>
          <p style={P_NOSOTROS}>Luego de estar dictando cursos en la Escuela Primaria Nº 11 en la Av. Roca y Manuel Estévez, y de intensas gestiones efectuadas por parte de los directivos, se le otorga en el año 1986 el espacio que ocupa actualmente, ya estando a cargo del servicio educativo el Prof. Tranquillo Roberto como Director.</p>
          <p style={P_NOSOTROS}>Cabe consignar que este nuevo edificio está ubicado en la calle J. P. Angulo 1272 de la localidad de Dock Sud, siendo propiedad de la D.G.C. y E. En él funcionó un servicio de Escuela Primaria hasta el año 1979, a partir del cual fue dado de baja al ser considerado inhabitable por el estado de deterioro total de su infraestructura.</p>
        </div>
        <div>
          <p style={P_NOSOTROS}>Convencidos de nuestra labor y de la importancia que la misma tiene al servicio de la comunidad, inmediatamente se iniciaron las tareas de reacondicionamiento, colaborando en dicha empresa todo el personal del establecimiento. Así, en poco tiempo se pudieron habilitar los servicios sanitarios y las aulas existentes, a los que se les sumó la reconstrucción de aulas. Con enorme trabajo y esfuerzo se consiguió este cometido ya en julio de 1987.</p>
          <p style={P_NOSOTROS}>En 1994 la Provincia de Buenos Aires reenumeró los servicios educativos por distrito y el Centro pasó a denominarse C.F.P. Nº 401 de Avellaneda.</p>
          <p style={{...P_NOSOTROS,marginBottom:0}}>Desde su creación y hasta la fecha se aprecia que, con el esfuerzo realizado, los logros obtenidos en los ámbitos educativos, sociales y edilicios fueron determinantes. Se destaca que desde su creación hasta el año próximo pasado se han dictado más de 2.300 cursos, que han logrado una cantidad de certificados en más de 24.000 egresados, cursando una extensa lista de especialidades.</p>
        </div>
      </div>
      <div style={{display:'grid',gap:'var(--space-6)',marginTop:'var(--space-10)'}}>
        <Foto src="../../assets/fotos/historia-obra-1.jpg" ratio="1280/320" caption="El edificio de J. P. Angulo 1272 al momento de recibirlo, antes de las tareas de reacondicionamiento encaradas por el personal del establecimiento."/>
        <Foto src="../../assets/fotos/historia-obra-2.jpg" ratio="1280/260" caption="Patio y aulas en reconstrucción: los trabajos se completaron en julio de 1987."/>
      </div>
      <div style={{height:1,background:'var(--border-subtle)',margin:'var(--space-16) 0'}}/>
      <SectionHeading overline="Objetivos generales del Centro" title="Formación con título oficial, al servicio del trabajo"/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'var(--space-10)',marginTop:'var(--space-8)',alignItems:'start'}}>
        <div>
          <p style={P_NOSOTROS}>El Centro de Formación Profesional 401 tiene entre sus objetivos impulsar y colaborar en la reinserción laboral, la reconversión de mano de obra y la capacitación continua, para un mejor desarrollo profesional y personal de quienes enfrentan el desafío del competitivo mercado laboral.</p>
          <p style={{...P_NOSOTROS,marginBottom:0}}>Siendo una Escuela de Formación de Adultos de la Provincia de Buenos Aires, nuestros cursos cuentan con el aval que brindan los Diseños Curriculares del Consejo Federal de Educación para cada curso, y el otorgamiento de Títulos Oficiales de la Dirección de Cultura y Educación de la Provincia de Buenos Aires.</p>
        </div>
        <Card accentBar padding="var(--space-8)">
          <Icon name="handshake" size={26} style={{color:'var(--brand-primary)'}}/>
          <h3 style={{margin:'var(--space-4) 0 var(--space-3)',fontFamily:'var(--font-display)',fontSize:20,lineHeight:1.25,fontWeight:700,color:'var(--text-title)'}}>Red de CFP de Trabajadores de la Construcción</h3>
          <p style={{...P_NOSOTROS,fontSize:16,marginBottom:0}}>El CFP 401 de Avellaneda forma parte de la Red de Centros de Formación Profesional de Trabajadores de la Construcción, con convenio con la Fundación de Educación y Capacitación de Trabajadores de la Construcción — Centro de Formación Continua, que asiste con los adelantos tecnológicos en equipamiento y actualización docente en forma activa.</p>
        </Card>
      </div>
      <Callout tone="accent" title="Cursos abiertos a la comunidad" style={{marginTop:'var(--space-16)'}}>
        <p style={{margin:'0 0 var(--space-5)',fontSize:16,lineHeight:1.6}}>Todos nuestros cursos son gratuitos y otorgan título oficial de la Provincia de Buenos Aires.</p>
        <Button variant="accent" onClick={onInscripcion} iconLeft={<Icon name="clipboard-list" size={18}/>}>Cómo inscribirme</Button>
      </Callout>
    </div>
  </div>;
}
