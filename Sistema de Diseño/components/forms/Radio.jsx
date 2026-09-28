import React from 'react';
export function Radio({label,checked=false,onChange,disabled,style}){
  return <label style={{display:'inline-flex',alignItems:'center',gap:'var(--space-3)',cursor:disabled?'not-allowed':'pointer',opacity:disabled?.5:1,...style}}>
    <span onClick={()=>!disabled&&onChange&&onChange(true)} style={{width:20,height:20,flex:'0 0 20px',borderRadius:'50%',border:'var(--border-width-strong) solid '+(checked?'var(--brand-primary)':'var(--border-strong)'),background:'var(--surface-card)',display:'flex',alignItems:'center',justifyContent:'center'}}>
      {checked&&<span style={{width:10,height:10,borderRadius:'50%',background:'var(--brand-primary)'}}/>}
    </span>
    <span style={{fontSize:15,color:'var(--text-body)'}}>{label}</span>
  </label>;
}