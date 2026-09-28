import React from 'react';
const tones={info:{bg:'var(--surface-brand-soft)',fg:'var(--blue-900)'},success:{bg:'var(--state-success-bg)',fg:'var(--state-success-fg)'},warning:{bg:'var(--state-warning-bg)',fg:'var(--state-warning-fg)'},danger:{bg:'var(--state-danger-bg)',fg:'var(--state-danger-fg)'}};
export function Alert({tone='info',children,onDismiss,style}){
  const t=tones[tone];
  return <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)',background:t.bg,color:t.fg,borderRadius:'var(--radius-md)',padding:'12px 16px',fontSize:15,...style}}>
    <span style={{flex:1}}>{children}</span>
    {onDismiss&&<button onClick={onDismiss} style={{background:'none',border:'none',cursor:'pointer',color:'inherit',fontSize:18,lineHeight:1}}>×</button>}
  </div>;
}