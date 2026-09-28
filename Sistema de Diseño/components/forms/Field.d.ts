import * as React from 'react';
/** Groups related controls (radios, checkboxes) under one label. */
export interface FieldProps{label?:string;hint?:string;children?:React.ReactNode;style?:React.CSSProperties}
export declare function Field(props:FieldProps):JSX.Element;