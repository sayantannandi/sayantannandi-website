import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
import {tests} from '../assets/lead-magnet-data.mjs';
import {evaluate,reportText} from '../assets/lead-magnet-engine.mjs';
const root=new URL('../',import.meta.url);
const ui=readFileSync(new URL('assets/lead-magnets.js',root),'utf8').replace(/^import .*;\n/gm,'');
for(const test of Object.values(tests)){
 assert.equal(test.questions.length,6);
 assert.equal(new Set(test.questions.map(q=>q.id)).size,6);
 for(const q of test.questions){assert.equal(q.options.length,4);assert.equal(q.options.filter(o=>o.points===2).length,1);assert(q.options.every(o=>o.feedback&&o.text));}
 assert.throws(()=>evaluate(test,[]));
 assert.throws(()=>evaluate(test,Array(6).fill('z')));
 for(let n=0;n<4096;n++){
  const answers=test.questions.map((q,i)=>q.options[Math.floor(n/(4**i))%4].id);
  const result=evaluate(test,answers);
  assert.equal(result.responses.length,6);
  assert(result.dimensions.every(d=>d.points>=0&&d.points<=4&&d.maximum===4));
  const minimum=Math.min(...result.dimensions.map(d=>d.points));
  assert.deepEqual(result.focus.map(d=>d.id),result.dimensions.filter(d=>d.points===minimum).map(d=>d.id));
 }
 const best=test.questions.map(q=>q.options.find(o=>o.points===2).id);
 const result=evaluate(test,best);
 assert(result.allStrong);assert.equal(result.strongestCount,6);
 const report=reportText(test,result);
 assert(report.includes(test.title)&&report.includes('Related course lesson:'));
 const worst=test.questions.map(q=>q.options.find(o=>o.points===0).id);
 assert.equal(evaluate(test,worst).focus.length,3);
}
console.log('PASS: all 8,192 answer combinations, incomplete/invalid input, ties, strongest choices and report content.');
function setup(test){
 const {document,window}=parseHTML(readFileSync(new URL('tests/'+test.slug+'.html',root),'utf8'));
 window.HTMLElement.prototype.scrollIntoView=function(){};
 window.HTMLElement.prototype.focus=function(){};
 for(const input of document.querySelectorAll('input')){input.setCustomValidity=()=>{};input.reportValidity=()=>true;}
 const lead=document.querySelector('[data-lead-capture]');
 let valid=true;
 lead.reportValidity=()=>valid;
 lead.reset=()=>{for(const el of lead.querySelectorAll('input')){if(el.type!=='hidden')el.value='';if(el.type==='checkbox')el.checked=false;}};
 const requests=[],downloads=[];let response={ok:false};
 class FormDataMock{
  constructor(form){this.entries=[...form.querySelectorAll('input')].filter(e=>e.name&&(e.type!=='checkbox'||e.checked)).map(e=>[e.name,e.value]);}
  [Symbol.iterator](){return this.entries[Symbol.iterator]();}
 }
 const ctx=vm.createContext({document,window,tests,evaluate,reportText,URLSearchParams,FormData:FormDataMock,AbortSignal,
  downloadText:(filename,text)=>downloads.push({filename,text}),
  fetch:async(...args)=>{requests.push(args);if(response instanceof Error)throw response;return response;}});
 vm.runInContext(ui,ctx);
 return {document,lead,requests,downloads,setValid:v=>{valid=v;},setResponse:v=>{response=v;},
 click(selector){const el=document.querySelector(selector);assert(el,selector);el.dispatchEvent(new window.Event('click',{bubbles:true,cancelable:true}));},
 submit(selector,choice){const el=document.querySelector(selector);assert(el,selector);const event=new window.Event('submit',{bubbles:true,cancelable:true});if(choice)Object.defineProperty(event,'submitter',{value:el.querySelector('[data-newsletter-choice="'+choice+'"]')});el.dispatchEvent(event);},
 choose(id){for(const el of document.querySelectorAll('[name=answer]')){el.checked=false;el.removeAttribute('checked');}const el=document.querySelector('[name=answer][value='+id+']');el.checked=true;el.setAttribute('checked','');el.dispatchEvent(new window.Event('change',{bubbles:true}));}};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
for(const test of Object.values(tests)){
 const t=setup(test);t.click('[data-test-start]');t.submit('#test-question');
 assert.match(t.document.querySelector('#test-error').textContent,/Choose a response/);
 assert.equal(t.requests.length,0);
 const answers=test.questions.map(q=>q.options.find(o=>o.points===2).id);
 for(let i=0;i<6;i++){t.choose(answers[i]);t.submit('#test-question');}
 assert.equal(t.document.querySelector('[data-result-capture]').hidden,false);
 assert.equal(t.document.querySelector('[data-report]').hidden,true);
 t.click('[data-review-answers]');assert.equal(t.document.querySelector('[name=answer]:checked').value,answers[0]);
 // Change a previously saved answer, then verify back/next persistence.
 t.choose(test.questions[0].options.find(o=>o.points===0).id);t.submit('#test-question');t.click('#test-back');
 assert.equal(t.document.querySelector('[name=answer]:checked').value,test.questions[0].options.find(o=>o.points===0).id);
 for(let i=0;i<6;i++)t.submit('#test-question');
 t.lead.querySelector('[name=name]').value='Example';
 t.lead.querySelector('[name=email]').value='example@example.com';
 assert.equal(t.lead.querySelectorAll('[type=checkbox]').length,0);
 t.setValid(false);t.submit('[data-lead-capture]');await tick();assert.equal(t.requests.length,0);t.setValid(true);
 t.submit('[data-lead-capture]');t.submit('[data-lead-capture]');await tick();
 assert.equal(t.requests.length,1);assert.match(t.lead.querySelector('.form-status').textContent,/could not save/);
 assert.equal(t.lead.querySelector('[name=email]').value,'example@example.com');
 assert.equal(t.document.querySelector('[data-report]').hidden,true);
 t.setResponse(new Error('Timeout'));t.submit('[data-lead-capture]');await tick();
 assert.equal(t.lead.querySelector('[type=submit]').disabled,false);
 t.setResponse({ok:true});t.submit('[data-lead-capture]');await tick();
 assert.equal(t.document.querySelector('[data-report]').hidden,false);
 assert.equal(t.document.querySelectorAll('[data-report] .result-item').length,6);
 const payload=new URLSearchParams(t.requests.at(-1)[1].body);
 assert.equal(payload.get('form-name'),test.form);assert.equal(payload.get('test-id'),test.id);
 assert.equal(payload.get('newsletter-consent'),'no');assert.equal(payload.get('consent'),'yes');assert.equal(payload.get('consent-version'),'step-up-tests-2026-09-v2-buttons');
 assert.equal(JSON.parse(payload.get('answers')).length,6);
 assert.equal(JSON.parse(payload.get('answers'))[0],test.questions[0].options.find(o=>o.points===0).id);
 assert(payload.get('report-text').includes('Feedback:'));
 t.submit('[data-lead-capture]');await tick();assert.equal(t.requests.length,3);
 t.click('#save-test-report');assert.equal(t.downloads.length,1);assert(t.downloads[0].text.includes(test.title));
 const opted=setup(test);opted.click('[data-test-start]');
 for(let i=0;i<6;i++){opted.choose(answers[i]);opted.submit('#test-question');}
 opted.lead.querySelector('[name=name]').value='Example';opted.lead.querySelector('[name=email]').value='example@example.com';
 assert.equal(opted.lead.querySelectorAll('[type=checkbox]').length,0);
 opted.setResponse({ok:true});opted.submit('[data-lead-capture]','yes');await tick();
 assert.equal(new URLSearchParams(opted.requests[0][1].body).get('newsletter-consent'),'yes');
}
console.log('PASS: both complete funnels, unanswered guard, navigation, edited answers, gate, invalid form, HTTP failure, timeout, retry, duplicate protection, consent payloads and downloads. No live requests.');
