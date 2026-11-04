
(() => {
 const root=document.getElementById('sn-b2b-workshops');
 const skills={
  s:{title:'Speak in business outcomes.',copy:'Make the point clear to a senior reader who has less time and less context. Practice storytelling and an update with one clear ask.',activity:'Tap the tune, then rewrite a real update.',before:'“Sprint 23 completed. 42 story points delivered.”',after:'“EU customers can now onboard in two days instead of six.”',takeaway:'One real update rewritten, outcome first, ready to send.'},
  t:{title:'Make a recommendation.',copy:'Choose the work that serves the goal. Say what you will stop, the cost of your choice, and what would change your mind.',activity:'The Not-Doing game: nine initiatives, capacity for three.',before:'“The options are in the deck. Please advise how to proceed.”',after:'“I recommend two applications in Q1 and the third in Q2, so we protect the payments SLA.”',takeaway:'A Not-Doing list for next quarter and one recommendation ready to send.'},
  a:{title:'Hand over the outcome.',copy:'Set clear ownership and review points, then make room for someone else to deliver. Agree where AI can help and where a person must check.',activity:'The jagged frontier: compare AI and non-AI teams on two tasks.',before:'“Prepare the QBR deck. Use last quarter’s template.”',after:'“The VP decides whether to fund the pilot. Five slides, with the cost checked by finance.”',takeaway:'One outcome to delegate, with a named owner, and the team’s AI guardrails.'},
  m:{title:'Take a worry off the list.',copy:'Practice the executive pitch, a clear no, and a disagreement that keeps the conversation useful. Start by finding out what your manager is worried about.',activity:'“Yes, but” versus “Yes, and”, followed by a real conversation rehearsed in trios.',before:'“Sure, we’ll try to fit it in.”',after:'“To add the report, we’d move the payment fix. Which matters more for Q4?”',takeaway:'One worry to check with their manager and one no or disagreement ready to say.'},
  p:{title:'Make the other team’s yes easier.',copy:'Connect the ask to the other team’s goals. Make the exchange fair and propose a first step with a date.',activity:'The ultimatum game, then a cross-team influence plan.',before:'“Please prioritize this API. Adding my manager for visibility.”',after:'“This API could remove 30 requests a month from your team. We’ll write the test cases. Could we agree a first version by the 30th?”',takeaway:'A specific cross-team ask, the person to make it to, and a date.'}
 };
 const targets={title:'bw-skill-title',copy:'bw-skill-copy',activity:'bw-skill-activity',before:'bw-before',after:'bw-after',takeaway:'bw-takeaway'};
 const tabs=[...root.querySelectorAll('[data-skill]')];
 function chooseSkill(button){
  const data=skills[button.dataset.skill];
  tabs.forEach(tab=>tab.setAttribute('aria-selected',String(tab===button)));
  root.querySelector('#bw-skill-panel').setAttribute('aria-labelledby',button.id);
  Object.keys(targets).forEach(key=>root.querySelector('#'+targets[key]).textContent=data[key]);
 }
 tabs.forEach((button,index)=>{
  button.addEventListener('click',()=>chooseSkill(button));
  button.addEventListener('keydown',event=>{
   let next;
   if(event.key==='ArrowRight')next=tabs[(index+1)%tabs.length];
   if(event.key==='ArrowLeft')next=tabs[(index+tabs.length-1)%tabs.length];
   if(event.key==='Home')next=tabs[0];
   if(event.key==='End')next=tabs[tabs.length-1];
   if(next){event.preventDefault();next.focus();chooseSkill(next);}
  });
 });
 root.querySelectorAll('[data-format]').forEach(button=>button.addEventListener('click',()=>{
  const two=button.dataset.format==='two';
  root.querySelectorAll('[data-format]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
  root.querySelector('#bw-two-day').hidden=!two;
  root.querySelector('#bw-one-day').hidden=two;
  root.querySelector('#bw-form-format').value=two?'two':'one';
 }));
 root.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();const target=root.querySelector(link.getAttribute('href'));
  if(target)target.scrollIntoView({block:'start'});
 }));

})();
