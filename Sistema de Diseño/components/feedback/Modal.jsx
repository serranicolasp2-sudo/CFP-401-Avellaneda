import React from 'react';
export function Modal({open,title,children,footer,onClose,width=520}){
  if(!open)return null;
  return <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,40,120,.45)',backdropFilter:'blur(2px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:60,padding:24}}>
    <div onClick={e=>e.stopPropagation()} style={{background:'var(--surface-card)',borderRadius:'var(--radius-lg)',boxShadow:'var(--shadow-lg)',width,maxWidth:'100%',overflow:'hidden'}}>
      <div style={{height:'var(--rule-height)',background:'var(--brand-accent)'}}/>
      <div style={{padding:'var(--space-6)'}}>
        {title&&<h3 style={{fontSize:22,fontWeight:700,marginBottom:'var(--space-3)'}}>{title}</h3>}
        <div style={{fontSize:15,lineHeight:1.6,color:'var(--text-body)'}}>{children}</div>
        {footer&&<div style={{marginTop:'var(--space-6)',display:'flex',justifyContent:'flex-end',gap:'var(--space-3)'}}>{footer}</div>}
      </div>
    </div>
  </div>;
}