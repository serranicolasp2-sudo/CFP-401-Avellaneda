import * as React from 'react';
/** Lucide icon wrapper (substituted set — the brand supplied no icon library). Requires the Lucide CDN script on the page. */
export interface IconProps{name:string;size?:number;color?:string;strokeWidth?:number;style?:React.CSSProperties}
export declare function Icon(props:IconProps):JSX.Element;