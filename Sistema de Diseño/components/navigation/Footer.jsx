import React from 'react';
import {Logo} from '../core/Logo.jsx';
export function Footer({assetBase='assets',columns=[],address,children}){
  return <footer style={{background:'var(--surface-inverse)',color:'var(--blue-100)',paddingTop:'var(--space-16)'}}>
    <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'0 var(--gutter) var(--space-12)',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'var(--space-10)'}}>
      <div>
        <Logo variant="institucional-blanco" height={40} assetBase={assetBase} style={{maxWidth:'100%',height:'auto'}}/>
        {address&&<p style={{marginTop:'var(--space-4)',fontSize:14,lineHeight:1.6,color:'var(--blue-200)'}}>{address}</p>}
        {children}
      </div>
      {columns.map(c=><div key={c.title}>
        <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:12,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--brand-accent)',marginBottom:'var(--space-4)'}}>{c.title}</div>
        <ul style={{listStyle:'none',margin:0,padding:0,display:'flex',flexDirection:'column',gap:10}}>{c.links.map(l=>{const o=typeof l==='string'?{label:l}:l;return <li key={o.label}><a href={o.href} onClick={o.onClick} style={{fontSize:14,color:'var(--blue-100)',textDecoration:'none',cursor:(o.onClick||o.href)?'pointer':'default'}}>{o.label}</a></li>})}</ul>
      </div>)}
    </div>
    <div style={{borderTop:'1px solid rgba(255,255,255,.14)',padding:'var(--space-5) var(--gutter)',textAlign:'center',fontSize:13,color:'var(--blue-200)'}}>C.F.P. N° 401 Avellaneda — Gran Buenos Aires · Juan Pablo Angulo 1272, Dock Sud</div>
  </footer>;
}