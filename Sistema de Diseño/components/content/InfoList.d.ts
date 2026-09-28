import * as React from 'react';
/** Yellow-dot fact list — the web equivalent of the emoji bullet lists used in social posts. */
export interface InfoListProps{items?:Array<string|{label:string;value:React.ReactNode}>;dense?:boolean;invert?:boolean;style?:React.CSSProperties}
export declare function InfoList(props:InfoListProps):JSX.Element;