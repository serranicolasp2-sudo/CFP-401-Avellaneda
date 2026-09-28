import * as React from 'react';
/**
 * Primary call-to-action control for CFP 401 surfaces.
 * @startingPoint section="Core" subtitle="Botones institucionales: primario, acento, secundario, ghost" viewport="700x200"
 */
export interface ButtonProps{
  variant?:'primary'|'accent'|'secondary'|'ghost';
  size?:'sm'|'md'|'lg';
  disabled?:boolean;
  fullWidth?:boolean;
  iconLeft?:React.ReactNode;
  iconRight?:React.ReactNode;
  href?:string;
  onClick?:()=>void;
  children?:React.ReactNode;
  style?:React.CSSProperties;
}
export declare function Button(props:ButtonProps):JSX.Element;