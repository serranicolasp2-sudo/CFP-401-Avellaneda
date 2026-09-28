import * as React from 'react';
/** Navy site footer with isotipo, address block and link columns. */
export interface FooterProps{assetBase?:string;columns?:Array<{title:string;links:Array<string|{label:string;href?:string;onClick?:()=>void}>}>;address?:React.ReactNode;children?:React.ReactNode}
export declare function Footer(props:FooterProps):JSX.Element;