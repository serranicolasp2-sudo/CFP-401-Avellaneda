import * as React from 'react';
/** Section title block: overline, heading, yellow rule, optional lead paragraph. */
export interface SectionHeadingProps{overline?:string;title:string;subtitle?:string;align?:'left'|'center';invert?:boolean;style?:React.CSSProperties}
export declare function SectionHeading(props:SectionHeadingProps):JSX.Element;