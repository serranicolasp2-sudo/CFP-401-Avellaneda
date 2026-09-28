import * as React from 'react';
/** Navy sidebar for the Campus Virtual shell; active item is a solid yellow pill. */
export interface SideNavItem{label:string;icon?:React.ReactNode;count?:number}
export interface SideNavProps{items?:SideNavItem[];active?:string;onNavigate?:(label:string)=>void;footer?:React.ReactNode;style?:React.CSSProperties}
export declare function SideNav(props:SideNavProps):JSX.Element;