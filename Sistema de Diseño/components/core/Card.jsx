import React from 'react';
export function Card({accentBar=false,hoverable=false,padding='var(--space-6)',children,style,onClick}){
  const [h,setH]=React.useState(false);
  return <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:'var(--surface-card)',border:'var(--border-width) solid var(--border-subtle)',borderRadius:'var(--radius-lg)',boxShadow:h&&hoverable?'var(--shadow-md)':'var(--shadow-xs)',transform:h&&hoverable?'translateY(-2px)':'none',transition:'box-shadow var(--duration-base) var(--ease-standard),transform var(--duration-base) var(--ease-standard)',overflow:'hidden',cursor:onClick?'pointer':'default',...style}}>
    {accentBar&&<div style={{height:'var(--rule-height)',background:'var(--brand-accent)'}}/>}
    <div style={{padding}}>{children}</div>
  </div>;
}