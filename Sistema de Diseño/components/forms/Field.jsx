import React from 'react';
export function Field({label,children,hint,style}){
  return <div style={{display:'flex',flexDirection:'column',gap:'var(--space-2)',...style}}>
    {label&&<span style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:14,color:'var(--text-title)'}}>{label}</span>}
    <div style={{display:'flex',flexWrap:'wrap',gap:'var(--space-4)'}}>{children}</div>
    {hint&&<span style={{fontSize:13,color:'var(--text-muted)'}}>{hint}</span>}
  </div>;
}