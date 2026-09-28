import React from 'react';
import {Card} from '../core/Card.jsx';
import {Badge} from '../core/Badge.jsx';
import {Button} from '../core/Button.jsx';
export function CourseCard({title,schedule,location='Sede Juan Pablo Angulo 1272, Dock Sud',duration,requirements,status='Inscripción abierta',onAction,actionLabel='Ver curso'}){
  return <Card hoverable accentBar padding="var(--space-5)">
    <div style={{display:'flex',flexWrap:'wrap',alignItems:'flex-start',gap:'var(--space-3)',marginBottom:'var(--space-3)'}}>
      <h3 style={{fontSize:20,lineHeight:1.2,fontWeight:700,flex:'1 1 100%'}}>{title}</h3>
      <Badge tone="accent">{status}</Badge>
    </div>
    <dl style={{margin:0,display:'grid',gridTemplateColumns:'110px 1fr',rowGap:6,columnGap:12,fontSize:14}}>
      <dt style={{color:'var(--text-muted)'}}>Horarios</dt><dd style={{margin:0,color:'var(--text-body)'}}>{schedule}</dd>
      {duration&&<><dt style={{color:'var(--text-muted)'}}>Duración</dt><dd style={{margin:0}}>{duration}</dd></>}
      <dt style={{color:'var(--text-muted)'}}>Sede</dt><dd style={{margin:0}}>{location}</dd>
      {requirements&&<><dt style={{color:'var(--text-muted)'}}>Requisitos</dt><dd style={{margin:0}}>{requirements}</dd></>}
    </dl>
    <div style={{marginTop:'var(--space-5)'}}><Button size="sm" variant="secondary" onClick={onAction}>{actionLabel}</Button></div>
  </Card>;
}