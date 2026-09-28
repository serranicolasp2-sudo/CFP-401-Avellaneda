import React from 'react';
import {Logo} from '../core/Logo.jsx';
import {Button} from '../core/Button.jsx';
export function NavBar({items=[],active,onNavigate,assetBase='assets',logo='institucional',cta,sticky=true}){
  return <header style={{position:sticky?'sticky':'static',top:0,zIndex:20,background:'var(--surface-card)',borderBottom:'var(--border-width) solid var(--border-subtle)',boxShadow:'var(--shadow-xs)'}}>
    <div style={{height:'var(--rule-height)',background:'var(--brand-accent)'}}/>
    <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'14px var(--gutter)',display:'flex',alignItems:'center',rowGap:'var(--space-3)',columnGap:'var(--space-6)',flexWrap:'wrap'}}>
      <Logo variant={logo} height={38} assetBase={assetBase} style={{flex:'0 1 auto',minWidth:0,maxWidth:'100%',height:'auto',maxHeight:38}}/>
      <nav style={{display:'flex',flexWrap:'wrap',rowGap:'var(--space-2)',columnGap:'clamp(14px,2.2vw,var(--space-6))',marginLeft:'auto'}}>
        {items.map(it=><a key={it} onClick={()=>onNavigate&&onNavigate(it)} style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:15,whiteSpace:'nowrap',cursor:'pointer',color:active===it?'var(--brand-primary)':'var(--neutral-600)',paddingBottom:4,borderBottom:'3px solid '+(active===it?'var(--brand-accent)':'transparent'),textDecoration:'none'}}>{it}</a>)}
      </nav>
      {cta&&<Button variant="accent" size="sm" onClick={cta.onClick} style={{flex:'none',whiteSpace:'nowrap'}}>{cta.label}</Button>}
    </div>
  </header>;
}