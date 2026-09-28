import React from 'react';
import {Button} from '../core/Button.jsx';
const TRAIL_W=1200,TRAIL_H=420;
const TRAIL_D='M-80,332 C 120,302 180,150 330,192 C 470,230 520,92 680,122 C 830,150 900,58 1000,68 C 1100,78 1180,38 1300,-32';
const CYCLE=26,SLOT=5.2;
const DEFAULT_SHOTS=['hero-soldadura.jpg','hero-energias.jpg','hero-electricidad.jpg','hero-domotica.jpg','hero-egresados.jpg'];
const HERO_MOTION_CSS=`
@keyframes cfpWipeOuter{from{transform:translate3d(38%,0,0) skewX(-9deg)}to{transform:translate3d(0,0,0) skewX(0deg)}}
@keyframes cfpWipeInner{from{transform:translate3d(-38%,0,0) skewX(9deg)}to{transform:translate3d(0,0,0) skewX(0deg)}}
@keyframes cfpArcSettle{0%{opacity:0;transform:translate3d(0,46px,0) scale(1.1)}70%{opacity:1;transform:translate3d(0,-6px,0) scale(.995)}100%{opacity:1;transform:translate3d(0,0,0) scale(1)}}
@keyframes cfpBreathe{0%{transform:translate3d(0,0,0) scale(1) rotate(0deg)}50%{transform:translate3d(-12px,10px,0) scale(1.022) rotate(.9deg)}100%{transform:translate3d(0,0,0) scale(1) rotate(0deg)}}
@keyframes cfpSheen{0%{transform:translateX(-70%) skewX(-14deg);opacity:0}6%{opacity:0}16%{opacity:.16}26%{opacity:.34}34%{opacity:.4}44%{opacity:.34}54%{opacity:.18}64%{opacity:.06}72%{transform:translateX(170%) skewX(-14deg);opacity:0}100%{transform:translateX(170%) skewX(-14deg);opacity:0}}
@keyframes cfpLineIn{from{transform:translate3d(0,112%,0)}to{transform:translate3d(0,0,0)}}
@keyframes cfpFadeUp{from{opacity:0;transform:translate3d(0,16px,0)}to{opacity:1;transform:none}}
@keyframes cfpRuleIn{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes cfpFly{0%{offset-distance:0%;opacity:0}2%{opacity:1}27%{opacity:1}31%{offset-distance:100%;opacity:0}100%{offset-distance:100%;opacity:0}}
@keyframes cfpTrail{0%{stroke-dashoffset:100}31%{stroke-dashoffset:0}50%{stroke-dashoffset:-100}100%{stroke-dashoffset:-100}}
@keyframes cfpShot{0%{opacity:0;transform:scale(1.16);clip-path:inset(0 0 0 100%)}2%{opacity:1}6.5%{clip-path:inset(0 0 0 0%)}13%{opacity:1;transform:scale(1.03);clip-path:inset(0 0 0 0%)}16.5%{opacity:0;transform:scale(1.005);clip-path:inset(0 0 0 0%)}100%{opacity:0;transform:scale(1.16);clip-path:inset(0 0 0 100%)}}
@keyframes cfpLensIn{0%{opacity:0;transform:translateY(-50%) scale(.82)}100%{opacity:1;transform:translateY(-50%) scale(1)}}
@keyframes cfpRingDrift{0%{transform:rotate(0deg) scale(1)}50%{transform:rotate(6deg) scale(1.04)}100%{transform:rotate(0deg) scale(1)}}
@keyframes cfpHalo{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.cfp-arc-stage{will-change:transform;transition:transform .9s cubic-bezier(.22,.7,.28,1)}
.cfp-arc-settle{animation:cfpArcSettle 1.15s cubic-bezier(.16,.9,.28,1) .1s both}
.cfp-arc-breathe{animation:cfpBreathe 24s ease-in-out 1.5s infinite}
.cfp-arc-wipe{animation:cfpWipeOuter 1.25s cubic-bezier(.16,.9,.28,1) .1s both}
.cfp-arc-wipe-in{animation:cfpWipeInner 1.25s cubic-bezier(.16,.9,.28,1) .1s both}
.cfp-hero-sheen{opacity:0;animation:cfpSheen 13s linear 2.2s infinite backwards}
.cfp-line-mask{display:block;overflow:hidden;padding-bottom:.16em;margin-bottom:-.16em}
.cfp-line-in{display:block;animation:cfpLineIn .82s cubic-bezier(.18,.86,.24,1) both}
.cfp-fade-up{animation:cfpFadeUp .66s cubic-bezier(.2,.7,.3,1) both}
.cfp-rule{transform-origin:left center;animation:cfpRuleIn .7s cubic-bezier(.16,.9,.28,1) .1s both}
.cfp-plane{offset-path:path('${TRAIL_D}');offset-rotate:auto;offset-distance:0%;opacity:0;will-change:offset-distance,opacity;animation:cfpFly 26s linear 6s infinite}
.cfp-trail-mask{animation:cfpTrail 26s linear 6s infinite}
.cfp-lens{animation:cfpLensIn 1.3s cubic-bezier(.16,.9,.28,1) .15s both}
.cfp-shot{animation:cfpShot ${CYCLE}s cubic-bezier(.3,.1,.2,1) infinite backwards;will-change:opacity,transform,clip-path}
.cfp-rings{animation:cfpRingDrift 38s ease-in-out infinite}
.cfp-halo{animation:cfpHalo 54s linear infinite}
@media (max-width:980px){.cfp-lens{opacity:.32!important}}
@media (prefers-reduced-motion:reduce){.cfp-arc-stage,.cfp-arc-settle,.cfp-arc-breathe,.cfp-arc-wipe,.cfp-arc-wipe-in,.cfp-hero-sheen,.cfp-line-in,.cfp-fade-up,.cfp-rule,.cfp-lens,.cfp-rings,.cfp-halo{animation:none!important;transition:none!important;transform:none!important;opacity:1!important}.cfp-lens{transform:translateY(-50%)!important}.cfp-hero-sheen{opacity:0!important}.cfp-flight{display:none!important}.cfp-shot{animation:none!important;opacity:0}.cfp-shot:first-of-type{opacity:1}}
`;
function useArcParallax(enabled){
  const stage=React.useRef(null);
  React.useEffect(()=>{
    if(!enabled)return;
    const fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    const still=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(!fine||still)return;
    const el=stage.current;if(!el)return;
    const host=el.closest('section');if(!host)return;
    let tx=0,ty=0,cx=0,cy=0,raf=0,idle=true;
    const tick=()=>{cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
      el.style.transform=`translate3d(${cx.toFixed(2)}px,${cy.toFixed(2)}px,0)`;
      if(Math.abs(tx-cx)>.1||Math.abs(ty-cy)>.1){raf=requestAnimationFrame(tick)}else{idle=true}};
    const wake=()=>{el.style.transition='none';if(idle){idle=false;raf=requestAnimationFrame(tick)}};
    const move=e=>{const r=host.getBoundingClientRect();
      tx=((e.clientX-r.left)/r.width-.5)*-56;ty=((e.clientY-r.top)/r.height-.5)*-28;wake()};
    const leave=()=>{tx=0;ty=0;el.style.transition='';el.style.transform='';cx=0;cy=0;cancelAnimationFrame(raf);idle=true};
    host.addEventListener('pointermove',move);host.addEventListener('pointerleave',leave);
    return()=>{host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);cancelAnimationFrame(raf)};
  },[enabled]);
  return stage;
}
function useFlightScale(enabled){
  const layer=React.useRef(null);
  React.useEffect(()=>{
    if(!enabled)return;
    const el=layer.current;if(!el)return;
    const host=el.parentElement;
    const fit=()=>{const r=host.getBoundingClientRect();if(!r.width)return;
      const s=r.width/TRAIL_W;el.style.transform=`translate3d(0,${((r.height-TRAIL_H*s)/2).toFixed(1)}px,0) scale(${s.toFixed(4)})`};
    fit();const ro=new ResizeObserver(fit);ro.observe(host);
    return()=>ro.disconnect();
  },[enabled]);
  return layer;
}
export function Hero({overline,title,subtitle,primaryCta,secondaryCta,image,shots,assetBase='assets',animate=true,plane=true,style}){
  const stage=useArcParallax(animate);
  const flight=useFlightScale(animate&&plane);
  const uid=React.useId().replace(/[^a-zA-Z0-9]/g,'');
  const cls=n=>animate?n:undefined;
  const arc=`${assetBase}/Logos/isotipo-arco-blanco.png`;
  const pics=(shots&&shots.length?shots:DEFAULT_SHOTS).map(s=>/[\/:]/.test(s)?s:`${assetBase}/fotos/${s}`).slice(0,5);
  return <section style={{background:'var(--gradient-hero-rich,var(--gradient-hero))',color:'#fff',position:'relative',overflow:'hidden',...style}}>
    {animate&&<style>{HERO_MOTION_CSS}</style>}
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
      <svg className={cls('cfp-rings')} viewBox="0 0 1200 600" preserveAspectRatio="xMaxYMid slice" style={{position:'absolute',inset:0,width:'100%',height:'100%',transformOrigin:'78% 50%'}} aria-hidden="true">
        <g fill="none" stroke="#fff" strokeOpacity=".07">
          <ellipse cx="880" cy="300" rx="300" ry="360"/><ellipse cx="880" cy="300" rx="420" ry="480"/>
          <ellipse cx="880" cy="300" rx="560" ry="620" strokeOpacity=".045"/>
        </g>
      </svg>
      {pics.length>0&&<div className={cls('cfp-lens')} style={{position:'absolute',right:'-8%',top:'50%',transform:'translateY(-50%)',width:'min(48vw,660px)',aspectRatio:'1',borderRadius:'50%',background:'linear-gradient(200deg,rgba(0,80,176,.55),rgba(0,40,120,.9))',boxShadow:'0 46px 110px rgba(0,14,52,.5)'}}>
        <div style={{position:'absolute',inset:0,borderRadius:'50%',overflow:'hidden'}}>
          {pics.map((src,i)=><img key={src} src={src} alt="" className={cls('cfp-shot')} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:animate?0:(i===0?1:0),animationDelay:animate?`${(i*SLOT).toFixed(2)}s`:undefined}}/>)}
          <div style={{position:'absolute',inset:0,background:'radial-gradient(120% 120% at 20% 50%,rgba(0,40,120,.72),rgba(0,40,120,.12) 58%,transparent 78%)'}}/>
        </div>
        <div style={{position:'absolute',inset:0,borderRadius:'50%',boxShadow:'inset 0 0 0 1px rgba(255,255,255,.18),inset 0 0 90px rgba(0,26,88,.55)'}}/>
        <svg className={cls('cfp-halo')} viewBox="0 0 200 200" style={{position:'absolute',inset:-6}} aria-hidden="true">
          <circle cx="100" cy="100" r="97" fill="none" stroke="var(--brand-accent)" strokeOpacity=".55" strokeWidth="1.4" strokeLinecap="round" pathLength="100" strokeDasharray="17 83"/>
        </svg>
      </div>}
      <div ref={stage} className={cls('cfp-arc-stage')} style={{position:'absolute',inset:0}}>
        <div className={cls('cfp-arc-settle')} style={{position:'absolute',right:-90,top:-34,height:'124%'}}>
          <div className={cls('cfp-arc-breathe')} style={{height:'100%'}}>
            <div className={cls('cfp-arc-wipe')} style={{height:'100%',overflow:'hidden'}}>
              <div className={cls('cfp-arc-wipe-in')} style={{height:'100%',position:'relative',overflow:'hidden'}}>
                <img src={arc} alt="" style={{height:'100%',display:'block',opacity:.11,mixBlendMode:'soft-light'}}/>
                {animate&&<div style={{position:'absolute',inset:0,overflow:'hidden',maskImage:`url(${arc})`,WebkitMaskImage:`url(${arc})`,maskSize:'100% 100%',WebkitMaskSize:'100% 100%',maskRepeat:'no-repeat',WebkitMaskRepeat:'no-repeat'}}>
                  <div className="cfp-hero-sheen" style={{position:'absolute',inset:'-10% -45%',opacity:0,transform:'translateX(-70%) skewX(-14deg)',background:'linear-gradient(100deg,transparent 40%,rgba(255,255,255,.5) 50%,transparent 60%)'}}/>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(100deg,rgba(0,40,120,.93) 0%,rgba(0,40,120,.74) 24%,rgba(0,40,120,.32) 46%,transparent 64%)'}}/>
      {animate&&plane&&<div ref={flight} className="cfp-flight" style={{position:'absolute',left:0,top:0,width:TRAIL_W,height:TRAIL_H,transformOrigin:'top left'}}>
        <svg width={TRAIL_W} height={TRAIL_H} viewBox={`0 0 ${TRAIL_W} ${TRAIL_H}`} fill="none" style={{position:'absolute',inset:0,overflow:'visible'}} aria-hidden="true">
          <defs><mask id={`t${uid}`} maskUnits="userSpaceOnUse" x="-120" y="-80" width={TRAIL_W+260} height={TRAIL_H+160}>
            <path className="cfp-trail-mask" d={TRAIL_D} stroke="#fff" strokeWidth="14" strokeLinecap="round" pathLength="100" strokeDasharray="100 100" strokeDashoffset="100"/>
          </mask></defs>
          <path d={TRAIL_D} mask={`url(#t${uid})`} stroke="rgba(255,255,255,.42)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="0.1 11"/>
        </svg>
        <div className="cfp-plane" style={{position:'absolute',left:0,top:0,width:54,height:54,marginLeft:-27,marginTop:-27}}>
          <img src={`${assetBase}/avioncito-papel.png`} alt="" style={{width:'100%',display:'block',transform:'rotate(43deg)',filter:'drop-shadow(0 4px 10px rgba(0,0,0,.28))'}}/>
        </div>
      </div>}
    </div>
    <div style={{maxWidth:'var(--container-max)',margin:'0 auto',padding:'var(--space-20) var(--gutter)',position:'relative',display:'grid',gridTemplateColumns:image?'1.1fr .9fr':'1fr',gap:'var(--space-12)',alignItems:'center',minHeight:'clamp(360px,54vh,560px)'}}>
      <div style={{maxWidth:620}}>
        {overline&&<div style={{display:'flex',alignItems:'center',gap:'var(--space-3)',marginBottom:'var(--space-4)'}}>
          <span className={cls('cfp-rule')} style={{width:28,height:3,borderRadius:2,background:'var(--brand-accent)',flex:'none'}}/>
          <span className={cls('cfp-line-mask')}><span className={cls('cfp-line-in')} style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:12,letterSpacing:'.16em',textTransform:'uppercase',color:'var(--brand-accent)',animationDelay:animate?'.18s':undefined}}>{overline}</span></span>
        </div>}
        <h1 style={{fontSize:'var(--text-display-size)',lineHeight:'var(--text-display-line)',fontWeight:800,letterSpacing:'-.02em',color:'#fff',textShadow:'0 2px 24px rgba(0,20,70,.45)'}}>
          <span className={cls('cfp-line-mask')}><span className={cls('cfp-line-in')} style={{animationDelay:animate?'.3s':undefined}}>{title}</span></span>
        </h1>
        {subtitle&&<p className={cls('cfp-fade-up')} style={{marginTop:'var(--space-5)',fontSize:19,lineHeight:1.55,color:'var(--blue-100)',animationDelay:animate?'.52s':undefined}}>{subtitle}</p>}
        <div className={cls('cfp-fade-up')} style={{marginTop:'var(--space-8)',display:'flex',gap:'var(--space-4)',flexWrap:'wrap',animationDelay:animate?'.62s':undefined}}>
          {primaryCta&&<Button variant="accent" size="lg" onClick={primaryCta.onClick}>{primaryCta.label}</Button>}
          {secondaryCta&&<Button variant="ghost" size="lg" onClick={secondaryCta.onClick} style={{color:'#fff',borderColor:'rgba(255,255,255,.5)'}}>{secondaryCta.label}</Button>}
        </div>
      </div>
      {image&&<img src={image} alt="" style={{width:'100%',borderRadius:'var(--radius-lg)',boxShadow:'var(--shadow-lg)'}}/>}
    </div>
  </section>;
}
