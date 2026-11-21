(()=>{'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const menuButton=q('.menu-trigger'),menu=q('.menu-panel');
function toggleMenu(force){if(!menuButton||!menu)return;const open=force??menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');menu.setAttribute('aria-hidden',String(!open));menu.classList.toggle('is-open',open);menu.inert=!open;document.body.classList.toggle('is-menu-open',open)}
menuButton?.addEventListener('click',()=>toggleMenu());addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false)});document.addEventListener('click',e=>{if(menu&&!menu.contains(e.target)&&!menuButton?.contains(e.target))toggleMenu(false)});
qa('[data-filter]').forEach(b=>b.addEventListener('click',()=>{qa('[data-filter]').forEach(x=>x.classList.toggle('is-active',x===b));qa('.works-grid__cell').forEach(c=>{c.hidden=b.dataset.filter!=='all'&&c.dataset.type!==b.dataset.filter})}));
qa('.service-item').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)qa('.service-item').filter(x=>x!==item).forEach(x=>x.open=false)}));
// Light magnetic behavior: easing without stealing hit-targets.
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const glow=document.createElement('div'),core=document.createElement('div');glow.className='cursor-glow';core.className='cursor-core';document.body.append(glow,core);const trails=Array.from({length:7},()=>{const n=document.createElement('div');n.className='cursor-particle';document.body.append(n);return n});let point={x:-200,y:-200},sm={x:-200,y:-200},positions=trails.map(()=>({...point}));addEventListener('pointermove',e=>{point.x=e.clientX;point.y=e.clientY},{passive:true});const animate=()=>{sm.x+=(point.x-sm.x)*.22;sm.y+=(point.y-sm.y)*.22;glow.style.transform=`translate(${sm.x-28}px,${sm.y-28}px)`;core.style.transform=`translate(${point.x-2.5}px,${point.y-2.5}px)`;let old={...sm};positions.forEach((p,i)=>{const rate=.21-i*.018;p.x+=(old.x-p.x)*rate;p.y+=(old.y-p.y)*rate;trails[i].style.transform=`translate(${p.x-12}px,${p.y-12}px) scale(${1-i*.08})`;trails[i].style.opacity=String(.7-i*.085);old=p});requestAnimationFrame(animate)};requestAnimationFrame(animate)
}
// Contact form: no fake success message. Explicit clipboard + Telegram handoff.
const form=q('#brief-form');if(form){const sel=q('#service-select');const idx=Number(new URLSearchParams(location.search).get('service'));if(sel&&new URLSearchParams(location.search).has('service')&&Number.isInteger(idx)&&idx>=0&&idx<sel.options.length-2)sel.selectedIndex=idx+1;form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const fd=new FormData(form);const text=`Заявка с сайта Lumo Sites\nИмя: ${fd.get('name')}\nУслуга: ${fd.get('service')}\nЗадача: ${fd.get('details')}\nСвязь: ${fd.get('method')} — ${fd.get('contact')}\nБюджет: ${fd.get('budget')||'Не указан'}`;const result=q('.contact-result');result.hidden=false;result.querySelector('textarea').value=text;result.scrollIntoView({behavior:'smooth',block:'nearest'})});q('[data-copy-brief]')?.addEventListener('click',async()=>{const text=q('.contact-result textarea')?.value||'';try{await navigator.clipboard.writeText(text);q('[data-copy-brief]').textContent='Скопировано'}catch(err){q('.contact-result textarea')?.select();q('[data-copy-brief]').textContent='Выделено — Ctrl+C'}})}
// Lab — exactly six meaningful settings, synchronized into a real iframe (also works on file://).
const frame=q('#lab-frame');if(frame){const fields=qa('[data-lab]'),deviceBtns=qa('[data-device]'),stage=q('#lab-stage');const defaults={theme:'forest',font:'editorial',layout:'split',cards:'soft',button:'pill',motion:'soft'};let state={...defaults};try{const raw=localStorage.getItem('lumo-lab-v1');if(raw)state={...defaults,...JSON.parse(raw)}}catch(e){}const query=new URLSearchParams(location.search);fields.forEach(f=>{const val=query.get(f.dataset.lab);if(val&&Array.from(f.options).some(o=>o.value===val))state[f.dataset.lab]=val});
 let labSequence=0,labAck=-1,labFallback=null;
 addEventListener('message',event=>{if(event.source===frame.contentWindow&&event.data?.type==='LUMO_LAB_APPLIED')labAck=event.data.sequence;});
 function push(){fields.forEach(f=>f.value=state[f.dataset.lab]||defaults[f.dataset.lab]);try{localStorage.setItem('lumo-lab-v1',JSON.stringify(state))}catch(e){}
   const id=++labSequence;
   frame.contentWindow?.postMessage({type:'LUMO_LAB_SETTINGS',settings:state,sequence:id},'*');
   clearTimeout(labFallback);
   labFallback=setTimeout(()=>{if(labAck===id)return;
     const params=new URLSearchParams(state).toString(),wanted='lab-preview.html?'+params;
     if(!frame.getAttribute('src')?.endsWith('?'+params))frame.setAttribute('src',wanted);
   },350);
 }
 fields.forEach(f=>f.addEventListener('change',()=>{state[f.dataset.lab]=f.value;push()}));frame.addEventListener('load',push);q('#lab-reset')?.addEventListener('click',()=>{state={...defaults};push()});
 deviceBtns.forEach(b=>b.addEventListener('click',()=>{deviceBtns.forEach(x=>x.classList.toggle('is-active',x===b));stage.classList.remove('is-tablet','is-phone');if(b.dataset.device!=='desktop')stage.classList.add('is-'+b.dataset.device)}));
 q('#lab-copy')?.addEventListener('click',async()=>{const url=new URL(location.href);Object.entries(state).forEach(([k,v])=>url.searchParams.set(k,v));try{await navigator.clipboard.writeText(url.href);q('#lab-copy').textContent='Ссылка скопирована'}catch(e){q('#lab-copy').textContent='Не удалось скопировать'}});push();}
// Page entry without intrusive loading overlay; navigation still works with JS disabled.
})();
