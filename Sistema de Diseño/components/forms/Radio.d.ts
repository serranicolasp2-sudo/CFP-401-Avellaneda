import * as React from 'react';
/** Single-choice control (turno mañana / tarde / noche). */
export interface RadioProps{label?:React.ReactNode;checked?:boolean;onChange?:(next:boolean)=>void;disabled?:boolean;style?:React.CSSProperties}
export declare function Radio(props:RadioProps):JSX.Element;