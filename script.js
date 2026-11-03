const $=s=>document.querySelector(s);const $$=s=>document.querySelectorAll(s);$('#year').textContent=new Date().getFullYear();const toggle=$('#menuToggle'),nav=$('#navigation');toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu')});$$('#navigation a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu')}));const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach(el=>observer.observe(el));$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter').forEach(b=>b.classList.toggle('active',b===btn));const f=btn.dataset.filter;$$('.product').forEach(card=>{card.hidden=f!=='all'&&card.dataset.category!==f})}));let ticking=false;const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;function update(){const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max>0?scrollY/max*100:0)+'%';if(!reduce&&innerWidth>650){$$('.parallax').forEach(el=>{const parent=el.closest('section');const r=parent.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const speed=parseFloat(el.dataset.speed)||.1;const offset=(innerHeight/2-r.top-r.height/2)*speed;el.style.transform=`scale(1.12) translate3d(0,${offset}px,0)`})}ticking=false}addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});addEventListener('resize',update);update();

// Pre-order: client-side request builder (no live payment or order submission).
const preorderCatalog=[['New York Cheesecake','Cheesecake'],['Blueberry Cheesecake','Cheesecake'],['Biscoff Cheesecake','Cheesecake'],['Nutella Cheesecake','Cheesecake'],['Butter Croissant','Bakehouse'],['Chocolate Brownie','Bakehouse'],['Specialty Coffee','Coffee']];
const selected=Array(preorderCatalog.length).fill(0);
const preorderItems=document.getElementById('preorderItems');
preorderCatalog.forEach(([name,category],index)=>{
 const item=document.createElement('div');item.className='preorder-item';
 const info=document.createElement('div');const heading=document.createElement('h4');heading.textContent=name;const small=document.createElement('small');small.textContent=category;info.append(heading,small);
 const controls=document.createElement('div');controls.className='qty-controls';
 const minus=document.createElement('button');minus.type='button';minus.textContent='−';minus.setAttribute('aria-label','Remove one '+name);
 const count=document.createElement('output');count.textContent='0';count.setAttribute('aria-label',name+' quantity');
 const plus=document.createElement('button');plus.type='button';plus.textContent='+';plus.setAttribute('aria-label','Add one '+name);
 const change=delta=>{selected[index]=Math.min(20,Math.max(0,selected[index]+delta));count.textContent=selected[index];minus.disabled=selected[index]===0;plus.disabled=selected[index]===20;const total=selected.reduce((a,b)=>a+b,0);document.getElementById('preorderCount').textContent=total+' item'+(total===1?'':'s')+' selected';};
 minus.addEventListener('click',()=>change(-1));plus.addEventListener('click',()=>change(1));minus.disabled=true;
 controls.append(minus,count,plus);item.append(info,controls);preorderItems.append(item);
});
const pickupDate=document.getElementById('pickupDate');
function localISODate(date){return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-')}
pickupDate.min=localISODate(new Date());
const preorderForm=document.getElementById('preorderForm');const dialog=document.getElementById('orderDialog');let message='';
preorderForm.addEventListener('submit',e=>{
 e.preventDefault();const error=document.getElementById('preorderError');error.textContent='';
 if(!selected.some(Boolean)){error.textContent='Please select at least one treat.';preorderItems.scrollIntoView({behavior:'smooth',block:'center'});return;}
 if(!preorderForm.reportValidity())return;
 const form=new FormData(preorderForm);const date=String(form.get('date'));const time=String(form.get('time'));
 const pickup=new Date(`${date}T${time}:00`);
 if(Number.isNaN(pickup.getTime())||pickup.getTime()<=Date.now()){error.textContent='Please choose a future pickup date and time.';return;}
 const items=preorderCatalog.map(([name],i)=>selected[i]?`• ${name} × ${selected[i]}`:null).filter(Boolean).join('\n');
 message=`Hello Juneberry! I'd like to request a pre-order.\n\n${items}\n\nName: ${String(form.get('customerName')).trim()}\nPhone: ${String(form.get('phone')).trim()}\nPickup location: ${form.get('location')}\nPickup date: ${date}\nPreferred time: ${time}\nNotes: ${String(form.get('notes')).trim()||'None'}\n\nPlease confirm availability, final pricing, and pickup time. I understand this is not a confirmed order.`;
 document.getElementById('orderSummary').textContent=message;
 document.getElementById('shareWhatsapp').href='https://api.whatsapp.com/send?text='+encodeURIComponent(message);
 document.getElementById('copyFeedback').textContent='';dialog.showModal();
});
document.getElementById('closeOrder').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
document.getElementById('copyOrder').addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText(message);document.getElementById('copyFeedback').textContent='Request copied. Paste it into your message to Juneberry.'}
 catch{const field=document.createElement('textarea');field.value=message;document.body.appendChild(field);field.select();const ok=document.execCommand('copy');field.remove();document.getElementById('copyFeedback').textContent=ok?'Request copied.':'Select the summary above to copy it manually.'}
});

// Close responsive navigation on Escape or when tapping outside it.
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.focus();
  }
});
document.addEventListener('click', (event) => {
  if (nav.classList.contains('open') && !event.target.closest('.nav')) {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
});
