import React from 'react';
export function StatBlock({value,label,invert=false,style}){
  return <div style={{...style}}>
    <div style={{fontFamily:'var(--font-display)',fontWeight:800,fontSize:44,lineHeight:1,color:invert?'var(--brand-accent)':'var(--brand-primary)'}}>{value}</div>
    <div style={{marginTop:8,fontSize:14,color:invert?'var(--blue-100)':'var(--text-muted)'}}>{label}</div>
  </div>;
}