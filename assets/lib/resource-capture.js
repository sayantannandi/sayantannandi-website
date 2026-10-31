import {saveReviewForm} from './site-live.js?v=2';
const files={worksheets:'/assets/downloads/Earning_Power_Exit_Power_Worksheets.pdf',chapter:'/assets/downloads/Earning_Power_Exit_Power_First_Chapter.pdf'};
for(const form of document.querySelectorAll('[data-resource-form]')) {
 let sending=false;
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(sending || !form.reportValidity())return;
  const name=form.elements.namedItem('name');
  if(!name.value.trim()){name.setCustomValidity('Enter your first name.');name.reportValidity();name.setCustomValidity('');return;}
  const button=form.querySelector('[type=submit]'),status=form.querySelector('[role=status]');
  sending=true;button.disabled=true;status.textContent='Saving your details…';
  try {
   await saveReviewForm(form);
   const card=form.closest('[data-resource-card]'),success=card.querySelector('[data-resource-success]');
   success.querySelector('[data-resource-download]').href=files[form.dataset.resourceForm];
   card.querySelector('[data-resource-content]').hidden=true;success.hidden=false;success.focus();
  }catch {status.textContent='Your details could not be saved. Please try again.';button.disabled=false;}
  finally {sending=false;}
 });
}
