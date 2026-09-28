import React from 'react';
const tones={info:{bg:'var(--surface-brand-soft)',bar:'var(--brand-primary)',fg:'var(--blue-900)'},accent:{bg:'var(--surface-accent-soft)',bar:'var(--brand-accent)',fg:'var(--blue-900)'},success:{bg:'var(--state-success-bg)',bar:'var(--state-success-fg)',fg:'var(--state-success-fg)'},danger:{bg:'var(--state-danger-bg)',bar:'var(--state-danger-fg)',fg:'var(--state-danger-fg)'}};
export function Callout({tone='info',title,children,style}){
  const t=tones[tone];
  return <div style={{background:t.bg,borderRadius:'var(--radius-md)',padding:'var(--space-4) var(--space-5)',display:'flex',gap:'var(--space-4)',...style}}>
    <span style={{flex:'0 0 4px',width:4,borderRadius:2,background:t.bar}}/>
    <div>{title&&<div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:15,color:t.fg,marginBottom:4}}>{title}</div>}<div style={{fontSize:15,lineHeight:1.55,color:'var(--text-body)'}}>{children}</div></div>
  </div>;
}