import React from 'react';
export function Tabs({items=[],active,onChange,style}){
  return <div style={{display:'flex',gap:'var(--space-6)',borderBottom:'var(--border-width) solid var(--border-subtle)',...style}}>
    {items.map(it=><button key={it} onClick={()=>onChange&&onChange(it)} style={{background:'none',border:'none',cursor:'pointer',padding:'0 0 10px',fontFamily:'var(--font-display)',fontWeight:600,fontSize:15,color:active===it?'var(--brand-primary)':'var(--neutral-500)',borderBottom:'3px solid '+(active===it?'var(--brand-primary)':'transparent'),marginBottom:-1}}>{it}</button>)}
  </div>;
}