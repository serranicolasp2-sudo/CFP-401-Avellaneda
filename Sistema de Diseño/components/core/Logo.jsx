import React from 'react';
const SRC={institucional:'Logos/logo-cfp401-horizontal.png','institucional-blanco':'Logos/logo-cfp401-horizontal-blanco.png',vertical:'Logos/logo-cfp401-vertical.png','vertical-blanco':'Logos/logo-cfp401-vertical-blanco.png',sello:'Logos/logo-cfp401-sello.png',arco:'Logos/isotipo-arco.png','arco-blanco':'Logos/isotipo-arco-blanco.png',campus:'Logos/logo-campus-horizontal.png','fundacion-uocra':'Logos/logo-fundacion-uocra.png'};
export function Logo({variant='institucional',height=48,assetBase='assets',alt='CFP N° 401 Avellaneda',style}){
  return <img src={`${assetBase}/${SRC[variant]||SRC["institucional"]}`} alt={alt} style={{height,width:'auto',display:'block',...style}}/>;
}