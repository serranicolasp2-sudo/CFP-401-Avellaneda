import * as React from 'react';
/**
 * Top navigation for institutional and campus surfaces: yellow hairline, logo, links, one accent CTA.
 * @startingPoint section="Navigation" subtitle="Barra superior institucional con CTA de inscripción" viewport="1160x120"
 */
export interface NavBarProps{items?:string[];active?:string;onNavigate?:(item:string)=>void;assetBase?:string;logo?:'institucional'|'campus'|'isotipo';cta?:{label:string;onClick?:()=>void};sticky?:boolean}
export declare function NavBar(props:NavBarProps):JSX.Element;