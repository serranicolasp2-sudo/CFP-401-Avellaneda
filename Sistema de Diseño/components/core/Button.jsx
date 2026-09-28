import React from 'react';
const base={fontFamily:'var(--font-display)',fontWeight:700,display:'inline-flex',alignItems:'center',justifyContent:'center',gap:'var(--space-2)',borderWidth:'var(--border-width-strong)',borderStyle:'solid',borderColor:'transparent',borderRadius:'var(--radius-pill)',cursor:'pointer',textDecoration:'none',transition:'background var(--duration-base) var(--ease-standard),color var(--duration-base) var(--ease-standard),transform var(--duration-fast) var(--ease-standard)',lineHeight:1};
const sizes={sm:{fontSize:14,padding:'8px 16px'},md:{fontSize:16,padding:'11px 22px'},lg:{fontSize:18,padding:'14px 30px'}};
const variants={
  primary:{background:'var(--brand-primary)',color:'var(--text-on-brand)',borderColor:'var(--brand-primary)'},
  accent:{background:'var(--brand-accent)',color:'var(--text-on-accent)',borderColor:'var(--brand-accent)'},
  secondary:{background:'var(--surface-card)',color:'var(--brand-primary)',borderColor:'var(--brand-primary)'},
  ghost:{background:'transparent',color:'var(--brand-primary)',borderColor:'transparent'}};
const hovers={primary:{background:'var(--blue-900)',borderColor:'var(--blue-900)'},accent:{background:'var(--yellow-600)',borderColor:'var(--yellow-600)'},secondary:{background:'var(--surface-brand-soft)'},ghost:{background:'var(--surface-brand-soft)'}};
export function Button({variant='primary',size='md',disabled=false,fullWidth=false,iconLeft,iconRight,href,onClick,children,style,...rest}){
  const [h,setH]=React.useState(false);
  const Tag=href?'a':'button';
  const s={...base,...sizes[size],...variants[variant],...(h&&!disabled?hovers[variant]:null),...(disabled?{opacity:.45,cursor:'not-allowed'}:null),...(fullWidth?{width:'100%'}:null),...style};
  return <Tag href={href} onClick={disabled?undefined:onClick} disabled={Tag==='button'?disabled:undefined} style={s} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} {...rest}>{iconLeft}{children}{iconRight}</Tag>;
}