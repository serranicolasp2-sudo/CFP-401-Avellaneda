import * as React from 'react';
/** Labelled text field used across enrolment and campus login forms. */
export interface InputProps{label?:string;hint?:string;error?:string;type?:string;value?:string;onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void;placeholder?:string;disabled?:boolean;required?:boolean;style?:React.CSSProperties}
export declare function Input(props:InputProps):JSX.Element;