import React from 'react';
export function CourseTable({rows=[],columns=['Cursos','Días y horarios','Lugar de dictado','Requisitos']}){
  return <div style={{overflowX:'auto',border:'var(--border-width) solid var(--border-brand)',borderRadius:'var(--radius-md)'}}>
    <table style={{width:'100%',borderCollapse:'collapse',fontSize:14}}>
      <thead><tr>{columns.map(c=><th key={c} style={{background:'var(--blue-100)',color:'var(--blue-900)',fontFamily:'var(--font-display)',fontWeight:700,textAlign:'center',padding:'10px 12px',border:'1px solid var(--blue-300)',textTransform:'uppercase',fontSize:12,letterSpacing:'.06em'}}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r,i)=><tr key={i}>
        <td style={{padding:'10px 12px',border:'1px solid var(--blue-200)',fontStyle:'italic',fontWeight:600,color:'var(--blue-900)'}}>{r.curso}</td>
        <td style={{padding:'10px 12px',border:'1px solid var(--blue-200)'}}>{r.horarios}</td>
        <td style={{padding:'10px 12px',border:'1px solid var(--blue-200)'}}>{r.sede}</td>
        <td style={{padding:'10px 12px',border:'1px solid var(--blue-200)',textAlign:'center'}}>{r.requisitos}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}