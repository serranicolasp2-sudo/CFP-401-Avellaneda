import React from 'react';
export function SideNav({items=[],active,onNavigate,footer,style}){
  return <aside style={{width:248,flex:'0 0 248px',background:'var(--surface-inverse)',color:'var(--blue-100)',display:'flex',flexDirection:'column',padding:'var(--space-6) var(--space-4)',gap:'var(--space-1)',...style}}>
    {items.map(it=>{const on=active===it.label;return <a key={it.label} onClick={()=>onNavigate&&onNavigate(it.label)} style={{display:'flex',alignItems:'center',gap:'var(--space-3)',padding:'10px 12px',borderRadius:'var(--radius-md)',cursor:'pointer',fontFamily:'var(--font-display)',fontWeight:600,fontSize:15,textDecoration:'none',color:on?'var(--blue-900)':'var(--blue-100)',background:on?'var(--brand-accent)':'transparent'}}>{it.icon}<span>{it.label}</span>{it.count!=null&&<span style={{marginLeft:'auto',fontSize:12,opacity:.8}}>{it.count}</span>}</a>;})}
    {footer&&<div style={{marginTop:'auto',paddingTop:'var(--space-6)',fontSize:13,color:'var(--blue-200)'}}>{footer}</div>}
  </aside>;
}