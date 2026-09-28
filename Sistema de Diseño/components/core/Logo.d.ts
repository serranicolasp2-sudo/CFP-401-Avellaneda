import * as React from 'react';
/** Renders an official CFP 401 mark from assets/ — never redraw these by hand. */
export interface LogoProps{variant?:'institucional'|'institucional-blanco'|'vertical'|'vertical-blanco'|'sello'|'arco'|'arco-blanco'|'campus'|'fundacion-uocra';height?:number;assetBase?:string;alt?:string;style?:React.CSSProperties}
export declare function Logo(props:LogoProps):JSX.Element;