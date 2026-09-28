import React from 'react';
export function SectionHeading({overline,title,subtitle,align='left',invert=false,style}){
  return <div style={{textAlign:align,maxWidth:align==='center'?720:undefined,margin:align==='center'?'0 auto':undefined,...style}}>
    {overline&&<div style={{fontFamily:'var(--font-display)',fontWeight:'var(--text-overline-weight)',fontSize:'var(--text-overline-size)',letterSpacing:'var(--text-overline-tracking)',textTransform:'uppercase',color:invert?'var(--brand-accent)':'var(--brand-primary-bright)',marginBottom:'var(--space-3)'}}>{overline}</div>}
    <h2 style={{fontSize:'var(--text-h2-size)',lineHeight:'var(--text-h2-line)',fontWeight:'var(--text-h2-weight)',letterSpacing:'var(--text-h2-tracking)',color:invert?'var(--neutral-0)':'var(--text-title)'}}>{title}</h2>
    <div style={{height:'var(--rule-height)',width:64,background:'var(--brand-accent)',borderRadius:2,margin:align==='center'?'var(--space-4) auto 0':'var(--space-4) 0 0'}}/>
    {subtitle&&<p style={{marginTop:'var(--space-4)',fontSize:'var(--text-body-lg-size)',lineHeight:'var(--text-body-lg-line)',color:invert?'var(--blue-100)':'var(--text-muted)'}}>{subtitle}</p>}
  </div>;
}