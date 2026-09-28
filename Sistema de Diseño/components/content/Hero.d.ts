import * as React from 'react';
/**
 * Full-width hero sobre un fondo azul institucional en degradé (--gradient-hero-rich),
 * con anillos concéntricos tenues y un lente circular a la derecha donde se revelan
 * fotografías reales: cada una entra con un barrido lateral, hace un zoom lento y sale
 * dejando ver el disco azul con el isotipo antes de la siguiente (ciclo de 26 s).
 * El isotipo del arco queda como marca de agua en soft-light, con destello periódico y
 * deriva con el puntero; cada ~26 s cruza el avioncito de papel dejando una estela
 * punteada. La copy se revela línea por línea. animate={false} deja el hero estático,
 * plane={false} saca sólo el avión, shots reemplaza las fotografías por defecto.
 * Todo se desactiva con prefers-reduced-motion.
 * @startingPoint section="Contenido" subtitle="Hero azul en degradé con fotos reveladas" viewport="1160x460"
 */
export interface HeroProps{overline?:string;title:React.ReactNode;subtitle?:string;primaryCta?:{label:string;onClick?:()=>void};secondaryCta?:{label:string;onClick?:()=>void};image?:string;shots?:string[];assetBase?:string;animate?:boolean;plane?:boolean;style?:React.CSSProperties}
export declare function Hero(props:HeroProps):JSX.Element;
