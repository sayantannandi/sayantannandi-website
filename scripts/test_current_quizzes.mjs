import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
import {reviewTests,evaluateReview,reviewReport} from '../assets/lib/site-demo-quiz.mjs';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
const code=readFileSync('assets/lib/site-live.js','utf8').replace(/^import .*;\n/gm,'').replace('export async function','async function');
const slugs={judgment:'senior-level-judgment',visibility:'leadership-visibility',leadership:'business-leadership',exit:'exit-power'};
for(const [id,slug] of Object.entries(slugs))for(const consent of [false,true]){
 const {document,window}=parseHTML(readFileSync('tests/'+slug+'.html','utf8'));
 window.HTMLElement.prototype.focus=function(){};window.HTMLElement.prototype.scrollIntoView=function(){};
 const form=document.querySelector('[data-quiz-capture]');form.reportValidity=()=>true;form.reset=()=>{};
 form.querySelector('[name=name]').value='Example';form.querySelector('[name=name]').setCustomValidity=()=>{};form.querySelector('[name=email]').value='example@example.com';
 form.querySelector('[name=newsletter-consent]').checked=consent;
 const posts=[],downloads=[];let accept=false;
 class FD extends Map{constructor(f){super([...f.querySelectorAll('input')].filter(e=>e.name&&(e.type!=='checkbox'||e.checked)).map(e=>[e.name,e.value]));}}
 vm.runInNewContext(code,{document,window,reviewTests,evaluateReview,reviewReport,FormData:FD,URLSearchParams,AbortSignal,Blob,URL:{createObjectURL:b=>{downloads.push(b);return 'blob:report'},revokeObjectURL(){}},setTimeout:()=>0,matchMedia:()=>({matches:true}),fetch:async(...args)=>{posts.push(args);return {ok:accept}}});
 const click=s=>document.querySelector(s).dispatchEvent(new window.Event('click',{bubbles:true,cancelable:true}));
 const submit=s=>document.querySelector(s).dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
 click('[data-begin]');submit('.d-question-form');assert.equal(posts.length,0);
 const answers=[];
 for(let i=0;i<6;i++){
  const radio=document.querySelector('[name=answer]');radio.setAttribute('checked','');radio.checked=true;answers.push(radio.value);radio.dispatchEvent(new window.Event('change',{bubbles:true}));submit('.d-question-form');
 }
 assert.equal(document.querySelector('[data-quiz-gate]').hidden,false);assert.equal(document.querySelector('[data-quiz-report]').hidden,true);
 submit('[data-quiz-capture]');submit('[data-quiz-capture]');await tick();assert.equal(posts.length,1);assert.equal(document.querySelector('[data-quiz-report]').hidden,true);assert.equal(form.querySelector('[name=email]').value,'example@example.com');assert.equal(form.querySelector('button[type=submit]').disabled,false);
 assert.match(form.querySelector('[role=status]').textContent,/could not be saved/);
 accept=true;submit('[data-quiz-capture]');await tick();assert.equal(posts.length,2);assert.equal(document.querySelector('[data-quiz-report]').hidden,false);
 const data=new URLSearchParams(posts.at(-1)[1].body);assert.equal(data.get('sn-form'),'sn-review-quiz-'+id);assert.equal(data.get('newsletter-consent'),consent?'yes':'no');assert.equal(data.get('test-version'),reviewTests[id].version);assert.deepEqual(JSON.parse(data.get('answers')),answers);
 submit('[data-quiz-capture]');await tick();assert.equal(posts.length,2);click('[data-download]');assert.equal(downloads.length,1);assert.match(await downloads[0].text(),new RegExp(id==='exit'?'Exit Power':id==='leadership'?'Business Leadership':id==='visibility'?'Leadership Visibility':'Senior-Level Judgment','i'));
}
console.log('PASS current quizzes: all four email gates, failed capture, preserved input, retry, duplicate prevention, optional consent, server fields and report downloads. No live submissions.');
