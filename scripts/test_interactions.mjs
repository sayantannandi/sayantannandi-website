import {parseHTML} from 'linkedom';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {skills} from '../assets/skills-data.js';
const base=new URL('../',import.meta.url).pathname;
const common=readFileSync(base+'assets/step-up.js','utf8').replace('export function','function');
const quiz=readFileSync(base+'assets/skills-check.js','utf8').replace(/^import .*;\n/gm,'');
function setup(file){
 const {document,window}=parseHTML(readFileSync(base+file,'utf8'));
 window.HTMLElement.prototype.scrollIntoView=function(){};
 window.HTMLElement.prototype.focus=function(){document.activeElement=this;};
 for(const f of document.querySelectorAll('form')){f.reportValidity=()=>true;f.reset=()=>{for(const e of f.querySelectorAll('input,textarea'))if(e.type!=='hidden'){e.value='';e.checked=false;}};}
 const blobs=[];let requests=[];let response={ok:false};
 class TestFormData{constructor(form){this.data=[...form.querySelectorAll('input,textarea')].filter(e=>e.name && !e.disabled && (e.type!=='checkbox'||e.checked)).map(e=>[e.name,e.value]);} [Symbol.iterator](){return this.data[Symbol.iterator]();}}
 const ctx=vm.createContext({document,window,skills,Blob,URL:{createObjectURL(blob){blobs.push(blob);return 'blob:test';},revokeObjectURL(){}},URLSearchParams,FormData:TestFormData,AbortSignal,setTimeout:()=>0,matchMedia:()=>({matches:true}),fetch:async(...args)=>{requests.push(args);if(response instanceof Error)throw response;return response;}});
 vm.runInContext(common,ctx);
 return {document,window,ctx,blobs,requests,setResponse(r){response=r;},click(selector){const el=document.querySelector(selector);assert(el,selector);el.dispatchEvent(new window.Event('click',{bubbles:true,cancelable:true}));},change(selector,value){const el=document.querySelector(selector);assert(el,selector);if(value!==undefined)el.value=value;el.checked=true;el.dispatchEvent(new window.Event('change',{bubbles:true}));},submit(selector){document.querySelector(selector).dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));}};
}
let q=setup('step-up/check.html');vm.runInContext(quiz,q.ctx);q.click('#start-check');q.submit('#question-form');assert.match(q.document.querySelector('#question-error').textContent,/Choose a response/);
const selection=['b','a','a','b','c','c','b','b'];
for(let i=0;i<skills.length;i++){
 if(i===0){q.change('input[value=a]');q.change('input[value=b]');}
 else q.change(`input[value=${selection[i]}]`);
 q.submit('#question-form');assert(q.document.querySelector('.quiz-feedback'));assert.match(q.document.querySelector('.quiz-feedback').textContent,new RegExp(selection[i]===skills[i].best?'A sound choice':'A different response'));
 if(i===1){q.click('#previous');assert.match(q.document.querySelector('.quiz-card h2').textContent,/Explain business outcomes/);assert(q.document.querySelector('input[value=b]').hasAttribute('checked'));q.click('#next');}
 q.click('#next');
}
assert.equal(q.document.querySelectorAll('.result-item').length,8);assert.equal(q.requests.length,0);
q.change('input[name=priority][value=ownership]');assert.match(q.document.querySelector('#priority-note').textContent,/delegation/);q.click('#download-results');
assert.equal(q.blobs.length,1);const notes=await q.blobs[0].text();assert.match(notes,/My chosen priority: Delegate with clear ownership/);assert.match(notes,/Your response: Report 12 hours/);assert.match(notes,/Strongest response for these facts/);
q.click('#restart');assert.equal(q.document.querySelectorAll('.quiz-feedback').length,0);assert.equal(q.document.querySelectorAll('input[checked]').length,0);
console.log('PASS Skills Check: unanswered guard, changed answer, eight mixed choices, per-answer feedback, back/next, priority, download, restart, zero network calls.');
for(const file of ['step-up.html','step-up/cohort.html','newsletter.html']){
 const f=setup(file);const form=f.document.querySelector('form[data-capture]');const email=form.querySelector('[name=email]');email.value='example@example.com';form.querySelector('[name=consent]').checked=true;
 f.submit('form[data-capture]');await new Promise(resolve=>setImmediate(resolve));assert.match(form.querySelector('.form-status').textContent,/could not confirm/);assert.equal(email.value,'example@example.com');assert.equal(form.querySelector('button').disabled,false);
 f.setResponse(new Error('Timeout'));f.submit('form[data-capture]');await new Promise(resolve=>setImmediate(resolve));assert.equal(email.value,'example@example.com');assert.equal(form.querySelector('button').disabled,false);
 f.setResponse({ok:true});f.submit('form[data-capture]');await new Promise(resolve=>setImmediate(resolve));assert.match(form.querySelector('.form-status').className,/success/);assert.equal(form.querySelector('button').disabled,true);
 f.submit('form[data-capture]');await new Promise(resolve=>setImmediate(resolve));assert.equal(f.requests.length,3);assert(f.requests.every(([url])=>url==='/'));assert.match(f.requests[0][1].body,/consent=yes/);
}
console.log('PASS three signup forms: HTTP rejection, timeout, preserved input, retry, confirmed acceptance, duplicate prevention and separate consent payloads. Transport mocked; no live submission.');
const b=setup('step-up/sample.html');b.document.querySelector('textarea').value='Approve a bounded trial <test> & review';b.click('#download-brief');const brief=await b.blobs[0].text();assert.match(brief,/Approve a bounded trial <test> & review/);assert.match(brief,/8. The review/);assert.equal(b.requests.length,0);
console.log('PASS editable brief: entered text, eight prompts, blank placeholders and download; zero network calls.');
