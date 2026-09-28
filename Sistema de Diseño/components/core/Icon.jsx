import React from 'react';
/* Lucide via CDN sprite-less inline <i data-lucide>. The brand ships no icon set of its own;
   Lucide (2px stroke, rounded caps) is the flagged substitution — see readme ICONOGRAPHY. */
export function Icon({name,size=20,color='currentColor',strokeWidth=2,style}){
  const ref=React.useRef(null);
  React.useEffect(()=>{if(window.lucide&&ref.current){ref.current.innerHTML='';const el=document.createElement('i');el.setAttribute('data-lucide',name);ref.current.appendChild(el);window.lucide.createIcons({attrs:{width:size,height:size,stroke:color,'stroke-width':strokeWidth}});}},[name,size,color,strokeWidth]);
  return <span ref={ref} style={{display:'inline-flex',width:size,height:size,color,...style}}/>;
}