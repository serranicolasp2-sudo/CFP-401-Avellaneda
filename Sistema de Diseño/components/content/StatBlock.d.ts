import * as React from 'react';
/** Big-number statistic (cursos, egresados, años). */
export interface StatBlockProps{value:React.ReactNode;label:string;invert?:boolean;style?:React.CSSProperties}
export declare function StatBlock(props:StatBlockProps):JSX.Element;