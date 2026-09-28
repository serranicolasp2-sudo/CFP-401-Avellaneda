import React from 'react';
const tones={
  brand:{background:'var(--surface-brand-soft)',color:'var(--blue-900)'},
  accent:{background:'var(--surface-accent)',color:'var(--text-on-accent)'},
  solid:{background:'var(--brand-primary)',color:'var(--text-on-brand)'},
  success:{background:'var(--state-success-bg)',color:'var(--state-success-fg)'},
  warning:{background:'var(--state-warning-bg)',color:'var(--state-warning-fg)'},
  danger:{background:'var(--state-danger-bg)',color:'var(--state-danger-fg)'},
  neutral:{background:'var(--surface-subtle)',color:'var(--neutral-700)'}};
export function Badge({tone='brand',uppercase=true,children,style}){
  return <span style={{display:'inline-flex',alignItems:'center',gap:6,fontFamily:'var(--font-display)',fontWeight:700,fontSize:12,letterSpacing:uppercase?'.08em':0,textTransform:uppercase?'uppercase':'none',padding:'5px 12px',borderRadius:'var(--radius-pill)',...tones[tone],...style}}>{children}</span>;
}