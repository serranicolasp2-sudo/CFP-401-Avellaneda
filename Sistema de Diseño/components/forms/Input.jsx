import React from 'react';
export function Input({label,hint,error,type='text',value,onChange,placeholder,disabled,required,style,...rest}){
  const [f,setF]=React.useState(false);
  return <label style={{display:'block',...style}}>
    {label&&<span style={{display:'block',fontFamily:'var(--font-display)',fontWeight:600,fontSize:14,color:'var(--text-title)',marginBottom:'var(--space-2)'}}>{label}{required&&<span style={{color:'var(--state-danger-fg)'}}> *</span>}</span>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
      style={{width:'100%',boxSizing:'border-box',fontFamily:'var(--font-body)',fontSize:16,color:'var(--text-body)',background:disabled?'var(--surface-subtle)':'var(--surface-card)',padding:'11px 14px',borderRadius:'var(--radius-md)',border:'var(--border-width) solid '+(error?'var(--state-danger-fg)':f?'var(--brand-primary)':'var(--border-strong)'),boxShadow:f?'var(--ring-focus)':'none',outline:'none',transition:'border-color var(--duration-fast) var(--ease-standard)'}} {...rest}/>
    {(hint||error)&&<span style={{display:'block',marginTop:6,fontSize:13,color:error?'var(--state-danger-fg)':'var(--text-muted)'}}>{error||hint}</span>}
  </label>;
}