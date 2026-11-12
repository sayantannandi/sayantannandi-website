const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
$('#notes-toggle')?.addEventListener('click',()=>{const on=document.body.classList.toggle('show-notes');$('#notes-toggle').setAttribute('aria-pressed',String(on));$('#notes-toggle').textContent=on?'Hide design notes −':'See design notes ＋';});
$('.mobile-menu')?.addEventListener('click',()=>{const on=$('.mobile-menu').getAttribute('aria-expanded')!=='true';$('.mobile-menu').setAttribute('aria-expanded',String(on));$('#navigation').classList.toggle('is-open',on);});
$$('.pagebar a').forEach(a=>{if(new URL(a.href).pathname===location.pathname){a.classList.add('active');a.setAttribute('aria-current','page')}});
document.addEventListener('click',e=>{$$('.dropdown[open]').forEach(d=>{if(!d.contains(e.target))d.open=false;});if(e.target.closest('a[href^="#"]')){$('#navigation')?.classList.remove('is-open');$('.mobile-menu')?.setAttribute('aria-expanded','false')}});
const skillData=[['Speak in business outcomes','An update a senior leader can act on.','Practice explaining what changed for the business, the evidence behind it and the decision needed next.','One real update rewritten, outcome first, ready to send.'],['Think through priorities','Make the trade-off visible.','Examine competing demands, limited capacity and the consequences of saying yes. Recommend what should move out.','A Not-Doing list and one clear recommendation.'],['Act through others','Delegate an outcome with boundaries.','Agree the result, decision authority and review points. Add suitable checks when AI supports the work.','A delegation brief with ownership and guardrails.'],['Manage up with clarity','Practice the conversation that matters.','Prepare a concise pitch, rehearse a respectful disagreement and plan how to ask for support.','A rehearsed conversation and a sponsor map.'],['Persuade across teams','Build an ask the other team can consider.','Examine their constraints and priorities, explain the exchange and agree a concrete next step.','A cross-team ask with a person and a date.']];
function selectSkill(b){const d=skillData[+b.dataset.skill];$$('[data-skill]').forEach(t=>{t.setAttribute('aria-selected',String(t===b));t.tabIndex=t===b?0:-1});$('#skill-panel').setAttribute('aria-labelledby',b.id);['kicker','title','body','output'].forEach((k,i)=>$('#skill-'+k).textContent=d[i]);}
$$('[data-skill]').forEach((b,i)=>{b.addEventListener('click',()=>selectSkill(b));b.addEventListener('keydown',e=>{const tabs=$$('[data-skill]');let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();selectSkill(tabs[n]);tabs[n].focus()}})});
$$('[data-format]').forEach(b=>b.addEventListener('click',()=>{$$('[data-format]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));$('#two-day').hidden=b.dataset.format!=='two';$('#one-day').hidden=b.dataset.format!=='one'}));
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-filter]').forEach(t=>t.setAttribute('aria-pressed',String(t===b)));$$('[data-category]').forEach(c=>c.hidden=b.dataset.filter!=='All'&&c.dataset.category!==b.dataset.filter)}));
$$('[data-situation]').forEach(b=>b.addEventListener('click',()=>{const s=$('select[name=topic]');s.value=b.dataset.situation==='Leading through others'?'Leading through other people':b.dataset.situation;$('#fit').scrollIntoView({behavior:'smooth'});setTimeout(()=>{$('input[name=name]')?.focus({preventScroll:true})},350)}));


const zoom=document.createElement('dialog');zoom.className='zoom-dialog';zoom.innerHTML='<button aria-label="Close enlarged workbook">Close ×</button><img alt="Enlarged actual workbook page">';document.body.append(zoom);zoom.querySelector('button').addEventListener('click',()=>zoom.close());$$('[data-enlarge]').forEach(b=>b.addEventListener('click',()=>{zoom.querySelector('img').src=b.dataset.enlarge;zoom.showModal()}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$$('.dropdown[open]').forEach(d=>d.open=false);$('#navigation')?.classList.remove('is-open');$('.mobile-menu')?.setAttribute('aria-expanded','false')}});
const enrollmentCloses=Date.parse('2027-01-06T23:59:00+05:30');

if(Date.now()>=enrollmentCloses){$$('[data-classroom-checkout]').forEach(a=>{a.href='/conversation';a.textContent='Ask about the next Classroom ↗'});}
for(const form of $$('[data-refresh-form]')){
 let sending=false;
 const button=form.querySelector('[type=submit]'),status=form.querySelector('[role=status]'),original=button.textContent;
 form.addEventListener('submit',async e=>{
  e.preventDefault(); if(sending)return;
  const name=form.querySelector('[name=name]');name.setCustomValidity(name.value.trim()?'':'Please enter your first name.');
  if(!form.reportValidity())return;
  sending=true;button.disabled=true;button.textContent='Saving…';status.textContent='';
  try{
   const data=new FormData(form),opt=form.querySelector('[name=newsletter-consent]');
   if(opt?.type==='checkbox')data.set('newsletter-consent',opt.checked?'yes':'no');
   const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(data).toString(),signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw new Error('not_accepted');
   const success=form.parentElement.querySelector('[data-request-success]');
   if(form.dataset.refreshForm==='book'){
    const email=data.get('sample-delivery')==='email';
    success.querySelector('[data-book-download]').hidden=email;success.querySelector('[data-book-email]').hidden=!email;
    if(!email)success.querySelector('[data-sample-download]').href='/assets/downloads/Earning_Power_Exit_Power_First_Chapter.pdf';
   }
   form.hidden=true;success.hidden=false;success.focus({preventScroll:true});success.scrollIntoView({block:'nearest'});
  }catch{status.textContent='We could not confirm your request. Your details are still here. Please try again, or email hello@sayantannandi.com.';button.disabled=false;button.textContent=original;sending=false;}
 });
 form.querySelector('[name=name]').addEventListener('input',e=>e.target.setCustomValidity(''));
}
