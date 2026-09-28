import * as React from 'react';
/**
 * Standard content container: white, 1px neutral border, 16px radius, optional yellow top rule.
 * @startingPoint section="Core" subtitle="Tarjeta blanca con filete amarillo opcional" viewport="700x260"
 */
export interface CardProps{accentBar?:boolean;hoverable?:boolean;padding?:string;children?:React.ReactNode;style?:React.CSSProperties;onClick?:()=>void}
export declare function Card(props:CardProps):JSX.Element;