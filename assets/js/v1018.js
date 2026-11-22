/* LUMO Sites 10.18 — scoped fixes; contact form and mobile lab intentionally untouched. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const mobile=matchMedia('(max-width:780px)');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const debug={version:'10.18',water:false,services:0,servicesFlipped:0,lab:'unchanged',bookMark:false};
window.LUMO_V1018_DEBUG=()=>({...debug});
const phoneHint=$('.gltf-scene--phone .phone-drag-hint');if(mobile.matches&&phoneHint)phoneHint.textContent='Проведи пальцем, чтобы повернуть';
const water=$('.film-stage__video');if(water){debug.water=!!water.querySelector('source[src*="green-texture.mp4"]');water.muted=true;water.playsInline=true;water.play().catch(()=>{});document.addEventListener('visibilitychange',()=>{if(!document.hidden)water.play().catch(()=>{})});}
// Cards: replace system orb with a line-drawn SVG in the approved action treatment.
const arrow='<span class="v1018-action-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 18 18 6M8 6h10v10"/></svg></span>';
for(const action of $$('.selected__reveal-action,.portfolio-tile__open')){
 const old=$('.portfolio-tile__orb,.v1017-arrow,.v1015-arrow',action);old?.remove();
 if(!$('.v1018-action-arrow',action))action.insertAdjacentHTML('beforeend',arrow);
}
// On mobile, old site builds two different kinds of flip targets. Use a single capture
// handler on buttons, once for each physical card face; no duplicated listeners.
if(mobile.matches){
 for(const card of $$('.service-flip')){
  const front=$('.service-flip__front',card),back=$('.service-flip__back',card),orig=$('.service-flip__toggle',card);
  if(!front||!back||!orig)continue;
  card.classList.add('v1016-service','v1018-service');
  // Old buttons are retained but hidden to preserve older desktop mechanics.
  orig.tabIndex=-1;orig.setAttribute('aria-hidden','true');
  $$('.v1017-service-turn--back,.v1016-service-return',card).forEach(btn=>{btn.hidden=true;btn.tabIndex=-1;btn.setAttribute('aria-hidden','true')});
  const make=(face,backward)=>{
   const b=document.createElement('button');b.type='button';b.className='v1018-service-control';
   b.setAttribute('aria-label',backward?'Вернуть лицевую сторону':'Посмотреть услугу');
   b.innerHTML=backward?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 7 7 17M7 7v10h10"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
   face.append(b);return b;
  };
  if($('.v1018-service-control',front))continue;
  const f=make(front,false),b=make(back,true);
  const set=on=>{
   card.classList.toggle('is-flipped',on);card.classList.toggle('manual-front',!on);
   card.setAttribute('aria-expanded',String(on));f.setAttribute('aria-expanded',String(on));
   f.tabIndex=on?-1:0;b.tabIndex=on?0:-1;debug.servicesFlipped++;
  };
  f.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();set(true)});
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();set(false)});
  // Older versions attach click-to-flip to the entire card. Limit mobile flipping
  // to the controls, so touching text never causes unwanted reversing.
  card.addEventListener('click',e=>{if(e.target.closest('a'))return;if(!e.target.closest('.v1018-service-control')){e.stopImmediatePropagation();e.preventDefault();}},true);
  // Keyboard toggles do not fire old card handlers twice.
  card.addEventListener('keydown',e=>{if(e.target===card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.stopImmediatePropagation();set(!card.classList.contains('is-flipped'));}},true);
  set(false);debug.services++;
 }
}
// The book mark is an original engraved Lumo stroke (not a copied third-party logo).
debug.bookMark=!!$('.v1017-cover-mark svg');
// Desk / tablet: keep all six AURA settings and its original controls intact.
// The miniature site has its OWN scrollport, sized to the visible viewport rather
// than making the host page scroll through a 1600px virtual mobile page.
const stage=$('#lab-stage'),frame=$('#lab-frame'),viewer=$('.lab-viewer');
if(stage&&frame&&viewer&&!mobile.matches){
 const modes={desktop:1280,tablet:820,phone:390};let mode=$('.lab-viewer__devices .is-active')?.dataset.device||'desktop';
 let pending=0;
 const fit=()=>{
  pending=0;const virtualWidth=modes[mode]||1280;
  const bar=$('.lab-viewer__bar',viewer),hint=$('.lab-viewer__hint',viewer);
  const style=getComputedStyle(viewer);
  const availWidth=Math.max(200,viewer.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)-2);
  const scale=Math.min(1,availWidth/virtualWidth);
  const availHeight=Math.max(245,viewer.clientHeight-(bar?.offsetHeight||62)-(hint?.offsetHeight||25)-39);
  const displayedWidth=Math.floor(virtualWidth*scale);
  const displayedHeight=Math.floor(availHeight);
  stage.style.setProperty('--v1015-frame-width',virtualWidth+'px');
  stage.style.setProperty('--v1015-frame-height',Math.ceil(displayedHeight/scale)+'px');
  stage.style.setProperty('--v1015-frame-scale',String(scale));
  stage.style.setProperty('--v1018-stage-width',displayedWidth+'px');stage.style.setProperty('--v1018-stage-height',displayedHeight+'px');stage.style.width=displayedWidth+'px';stage.style.height=displayedHeight+'px';
  frame.style.width=virtualWidth+'px';frame.style.height=Math.ceil(displayedHeight/scale)+'px';
  frame.style.transform='scale('+scale+')';frame.style.transformOrigin='top left';
  stage.dataset.virtualDevice=mode;
  debug.lab=mode;
 };
 const schedule=()=>{if(!pending)pending=requestAnimationFrame(fit)};
 for(const btn of $$('.lab-viewer__devices [data-device]'))btn.addEventListener('click',()=>{mode=btn.dataset.device;schedule()});
 window.addEventListener('resize',schedule,{passive:true});
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(schedule).observe(viewer);
 schedule();
}
})();
