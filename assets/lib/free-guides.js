import {saveReviewForm} from './site-live.js?v=1';
const cards=[...document.querySelectorAll('[data-guide-category]')];
for(const button of document.querySelectorAll('[data-guide-filter]'))button.addEventListener('click',()=>{
 for(const b of document.querySelectorAll('[data-guide-filter]'))b.setAttribute('aria-pressed',String(b===button));
 for(const card of cards)card.hidden=button.dataset.guideFilter!=='all'&&card.dataset.guideCategory!==button.dataset.guideFilter;
 const count=cards.filter(c=>!c.hidden).length;
 document.querySelector('.g-filter-status').textContent=`${count} ${count===1?'guide':'guides'} to explore`;
});
for(const form of document.querySelectorAll('[data-guide-form]')){
 let sending=false;
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(sending)return;
  const name=form.elements.namedItem('name');
  name.setCustomValidity(name.value.trim()?'':'Please enter your first name.');
  if(!form.reportValidity())return;
  const button=form.querySelector('[type=submit]'),status=form.querySelector('[role=status]'),original=button.textContent;
  const consent=form.elements.namedItem('newsletter-consent').checked;
  sending=true;button.disabled=true;button.textContent='Preparing your download…';status.textContent='';
  try{
   await saveReviewForm(form);
   const card=form.closest('.g-capture'),success=card.querySelector('[data-guide-success]');
   const download=success.querySelector('[data-guide-download]');
   download.href='/assets/downloads/guides/'+encodeURIComponent(form.dataset.guideForm)+'.pdf';
   card.querySelector('[data-guide-content]').hidden=true;
   success.querySelector('.g-subscription-status').textContent=consent?'Your newsletter signup request has also been saved.':'You have not signed up for the newsletter.';
   success.hidden=false;success.focus({preventScroll:true});success.scrollIntoView({block:'nearest'});
   form.reset();
  }catch(error){status.textContent='We could not save your details. Please check your connection and try again. Your details are still here.';button.disabled=false;button.textContent=original;}
  finally{sending=false;}
 });
 form.elements.namedItem('name').addEventListener('input',event=>event.target.setCustomValidity(''));
}
