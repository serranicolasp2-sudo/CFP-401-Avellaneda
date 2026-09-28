import * as React from 'react';
/**
 * Course listing card — the atom of the whole offer, mirroring the columns of the official course table.
 * @startingPoint section="Contenido" subtitle="Tarjeta de curso con horarios, sede y requisitos" viewport="700x300"
 */
export interface CourseCardProps{title:string;schedule:string;location?:string;duration?:string;requirements?:string;status?:string;onAction?:()=>void;actionLabel?:string}
export declare function CourseCard(props:CourseCardProps):JSX.Element;