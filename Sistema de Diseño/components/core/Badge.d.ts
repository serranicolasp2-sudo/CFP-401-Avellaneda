import * as React from 'react';
/** Small status / category pill used on course cards and course tables. */
export interface BadgeProps{tone?:'brand'|'accent'|'solid'|'success'|'warning'|'danger'|'neutral';uppercase?:boolean;children?:React.ReactNode;style?:React.CSSProperties}
export declare function Badge(props:BadgeProps):JSX.Element;