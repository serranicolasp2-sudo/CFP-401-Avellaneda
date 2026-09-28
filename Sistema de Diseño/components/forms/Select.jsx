import React from 'react';
export function Select({label,options=[],value,onChange,disabled,hint,style}){
  return <label style={{display:'block',...style}}>
    {label&&<span style={{display:'block',fontFamily:'var(--font-display)',fontWeight:600,fontSize:14,color:'var(--text-title)',marginBottom:'var(--space-2)'}}>{label}</span>}
    <select value={value} onChange={onChange} disabled={disabled} style={{width:'100%',boxSizing:'border-box',appearance:'none',fontFamily:'var(--font-body)',fontSize:16,color:'var(--text-body)',background:'var(--surface-card) url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' fill=\'none\' stroke=\'%23003890\' stroke-width=\'2\'><path d=\'M3 6l5 5 5-5\'/></svg>") no-repeat right 14px center',padding:'11px 40px 11px 14px',borderRadius:'var(--radius-md)',border:'var(--border-width) solid var(--border-strong)'}}>
      {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
    </select>
    {hint&&<span style={{display:'block',marginTop:6,fontSize:13,color:'var(--text-muted)'}}>{hint}</span>}
  </label>;
}