import React from 'react';
export function ProgressBar({value=0,label,showValue=true,style}){
  const v=Math.max(0,Math.min(100,value));
  return <div style={{...style}}>
    {(label||showValue)&&<div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'var(--text-muted)',marginBottom:6}}><span>{label}</span>{showValue&&<span style={{fontWeight:600,color:'var(--brand-primary)'}}>{v}%</span>}</div>}
    <div style={{height:8,borderRadius:'var(--radius-pill)',background:'var(--neutral-100)',overflow:'hidden'}}><div style={{width:v+'%',height:'100%',background:'var(--brand-accent)',transition:'width var(--duration-slow) var(--ease-standard)'}}/></div>
  </div>;
}