import * as React from 'react';
/** Tinted notice block for requirements, deadlines and campus announcements. */
export interface CalloutProps{tone?:'info'|'accent'|'success'|'danger';title?:string;children?:React.ReactNode;style?:React.CSSProperties}
export declare function Callout(props:CalloutProps):JSX.Element;