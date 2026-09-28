import * as React from 'react';
/** Inline message bar for form results and campus notices. */
export interface AlertProps{tone?:'info'|'success'|'warning'|'danger';children?:React.ReactNode;onDismiss?:()=>void;style?:React.CSSProperties}
export declare function Alert(props:AlertProps):JSX.Element;