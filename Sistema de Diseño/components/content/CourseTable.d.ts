import * as React from 'react';
/** Recreation of the official printed course grid (blue header, italic course names, boxed cells). */
export interface CourseRow{curso:string;horarios:string;sede:string;requisitos:string}
export interface CourseTableProps{rows?:CourseRow[];columns?:string[]}
export declare function CourseTable(props:CourseTableProps):JSX.Element;