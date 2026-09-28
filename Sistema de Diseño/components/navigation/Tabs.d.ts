import * as React from 'react';
/** Underlined tab strip for course detail and campus views. */
export interface TabsProps{items?:string[];active?:string;onChange?:(item:string)=>void;style?:React.CSSProperties}
export declare function Tabs(props:TabsProps):JSX.Element;