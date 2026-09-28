import React from 'react';
export function InfoList({items=[],dense=false,invert=false,style}){
  return <ul style={{listStyle:'none',margin:0,padding:0,display:'flex',flexDirection:'column',gap:dense?8:14,...style}}>
    {items.map((it,i)=><li key={i} style={{display:'flex',gap:'var(--space-3)',alignItems:'flex-start'}}>
      <span style={{flex:'0 0 8px',width:8,height:8,borderRadius:'50%',background:'var(--brand-accent)',marginTop:8}}/>
      <span style={{fontSize:16,lineHeight:1.55,color:invert?'var(--blue-100)':'var(--text-body)'}}>{it.label?<><strong style={{color:invert?'#fff':'var(--text-title)'}}>{it.label}</strong> {it.value}</>:it}</span>
    </li>)}
  </ul>;
}