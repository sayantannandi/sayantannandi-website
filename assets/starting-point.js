import {VERSION,questions} from './starting-point-data.mjs';
import {evaluateStarting,startingReport} from './starting-point-engine.mjs';
import {downloadText} from './step-up.js?v=5';
const root=document.querySelector('#starting-check');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if(root){
 let index=0, answers=Array(12).fill(null),result;
 const output=document.querySelector('#starting-result'),gate=document.querySelector('#starting-email');
 function focus(el){el.focus();el.scrollIntoView({block:'start'});}
 function render(){
  const q=questions(answers[0]||'A')[index];
  root.innerHTML='<p>Question '+(index+1)+' of 12</p><progress max="12" value="'+index+'" aria-label="Questions completed"></progress><h2 tabindex="-1">'+esc(q.title)+'</h2>'+(q.note?'<p>'+esc(q.note)+'</p>':'')+'<form id="starting-question"><fieldset><legend class="fine">Choose the response closest to your situation.</legend>'+q.options.map(o=>'<label class="quiz-option"><input type="radio" name="answer" value="'+o.id+'" required'+(answers[index]===o.id?' checked':'')+'><span>'+esc(o.text)+'</span></label>').join('')+'</fieldset><p role="alert" id="starting-error" class="error"></p><div class="actions"><button type="button" class="btn secondary" id="starting-back"'+(index===0?' disabled':'')+'>Back</button><button class="btn" type="submit">'+(index===11?'See my result':'Next')+'</button></div></form>';
  root.querySelector('#starting-back').addEventListener('click',()=>{if(index>0){index--;render();}});
  root.querySelector('form').addEventListener('submit',event=>{
   event.preventDefault();const selected=root.querySelector('[name=answer]:checked');
   if(!selected){root.querySelector('#starting-error').textContent='Choose a response to continue.';return;}
   if(index===0&&answers[0]!==selected.value){answers[1]=null;answers[2]=null;}
   answers[index]=selected.value;
   if(index<11){index++;render();}else{result=evaluateStarting(answers);showResult();}
  });focus(root.querySelector('h2'));
 }
 function showResult(){
  root.hidden=true;output.hidden=false;gate.hidden=false;
  const cols=[['Build earning first','Safe, not growing'],['Trapped Earner','Real options']];
  output.innerHTML='<span class="eyebrow">Your reflection</span><h2 tabindex="-1">'+esc(result.box.label)+(result.provisional?' (provisional)':'')+'</h2><p>'+esc(result.box.line)+'</p><p class="fine">This is a teaching tool, and it is not validated. It can’t predict a promotion or tell you if you’re financially safe. It only reflects the answers you gave.</p><div class="reflection-grid" role="group" aria-label="Earning Power and Exit Power grid"><p class="grid-axis">Earning Power: how your work reads at the next level</p><div class="grid-2">'+[...cols[1],...cols[0]].map(label=>'<div class="grid-cell'+(label===result.box.label?' is-selected':'')+'">'+esc(label)+(label===result.box.label?' <strong>← Your reflection</strong>':'')+'</div>').join('')+'</div><p class="fine">Top row: higher Earning Power reflection. Bottom row: lower. Left column: lower Exit Power context; right: higher. Thresholds: 11/18 and 7/12.</p></div><p>Earning Power reflection: '+result.earning+'/18 · Exit Power context: '+result.exit+'/12</p><article class="card"><span class="eyebrow">One skill to practice first / Week '+result.skill.week+'</span><h3>'+esc(result.skill.title)+'</h3><p>'+esc(result.skill.line)+'</p><p><strong>This week:</strong> '+esc(result.skill.exercise)+'</p></article><article class="card"><h3>Your reported runway: '+esc(result.band.label)+'</h3><p>'+esc(result.band.line)+'</p><p class="fine">This is the range you selected, not an exact calculation. '+(result.unknown?'Your Exit Power context is incomplete; do not treat its total or grid position as a financial conclusion.':'No financial amount has been entered or calculated.')+'</p></article><article class="card"><h3>Your current decision</h3><p>'+esc(result.decision)+'</p><p>'+esc(result.decisionLine)+'</p></article><div class="actions"><a class="btn" href="'+result.action.url+'">'+esc(result.action.label)+'</a><a class="text-link" href="/conversation">Book a free 20-minute call</a></div><div class="actions"><button class="btn secondary" id="starting-download" type="button">Download my report</button><button class="text-link" id="starting-print" type="button">Print my report</button><button class="text-link" id="starting-restart" type="button">Start again</button></div>';
  output.querySelector('#starting-download').addEventListener('click',()=>downloadText('Starting_Point_Check_Report.txt',startingReport(result)));
  output.querySelector('#starting-print').addEventListener('click',()=>window.print());
  output.querySelector('#starting-restart').addEventListener('click',()=>{answers=Array(12).fill(null);index=0;result=null;output.hidden=true;gate.hidden=true;root.hidden=false;form.reset();form.querySelector('button').disabled=false;form.dataset.sending='false';form.querySelector('.form-status').textContent='';render();});
  focus(output.querySelector('h2'));
 }
 root.querySelector('#starting-begin').addEventListener('click',render);
 const form=gate.querySelector('form');
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!result||!form.reportValidity()||form.dataset.sending==='true')return;
  const button=form.querySelector('button'),status=form.querySelector('.form-status');
  form.querySelector('[name=answers]').value=JSON.stringify(answers);form.querySelector('[name="test-version"]').value=VERSION;
  form.dataset.sending='true';button.disabled=true;status.textContent='Saving your request…';
  try{const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString(),signal:AbortSignal.timeout(15000)});
   if(!response.ok)throw new Error('not_accepted');status.textContent='Your email report request is saved. Your report remains available above; download a copy now.';button.textContent='Request saved';
  }catch{status.textContent='We could not save your request. Your report is still available above. Please try again.';button.disabled=false;form.dataset.sending='false';}
 });
}
