import * as React from 'react';
/** Square checkbox for requirement lists and enrolment consents. */
export interface CheckboxProps{label?:React.ReactNode;checked?:boolean;onChange?:(next:boolean)=>void;disabled?:boolean;style?:React.CSSProperties}
export declare function Checkbox(props:CheckboxProps):JSX.Element;