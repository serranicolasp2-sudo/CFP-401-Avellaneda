import * as React from 'react';
/** Centred dialog with the yellow top rule; blue-tinted scrim. */
export interface ModalProps{open?:boolean;title?:string;children?:React.ReactNode;footer?:React.ReactNode;onClose?:()=>void;width?:number}
export declare function Modal(props:ModalProps):JSX.Element;