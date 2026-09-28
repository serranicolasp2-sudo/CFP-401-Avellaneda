import React from 'react';
export function Checkbox({label,checked=false,onChange,disabled,style}){
  return <label style={{display:'inline-flex',alignItems:'center',gap:'var(--space-3)',cursor:disabled?'not-allowed':'pointer',opacity:disabled?.5:1,...style}}>
    <span onClick={()=>!disabled&&onChange&&onChange(!checked)} style={{width:20,height:20,flex:'0 0 20px',borderRadius:'var(--radius-xs)',border:'var(--border-width-strong) solid '+(checked?'var(--brand-primary)':'var(--border-strong)'),background:checked?'var(--brand-primary)':'var(--surface-card)',display:'flex',alignItems:'center',justifyContent:'center',transition:'background var(--duration-fast) var(--ease-standard)'}}>
      {checked&&<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6.5l2.5 2.5L10 3.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </span>
    <span style={{fontSize:15,color:'var(--text-body)'}}>{label}</span>
  </label>;
}