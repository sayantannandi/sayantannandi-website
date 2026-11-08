import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {parseHTML} from 'linkedom';
const code=fs.readFileSync('assets/lib/refresh-pages.js','utf8');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
for(const [path,kind] of [['get-coached.html','coaching'],['b2b-queries.html','workshop'],['philosophy.html','book']])for(const consent of [false,true]){
 const {document,window}=parseHTML(fs.readFileSync(path,'utf8'));
 window.HTMLElement.prototype.focus=function(){};window.HTMLElement.prototype.scrollIntoView=function(){};
 const f=document.querySelector('[data-refresh-form]');assert.equal(f.dataset.refreshForm,kind);f.reportValidity=()=>true;
 f.querySelector('[name=name]').value='Example';f.querySelector('[name=name]').setCustomValidity=()=>{};f.querySelector('[name=email]').value='example@example.com';f.querySelector('[name=newsletter-consent]').checked=consent;
 let accepted=false;const posts=[];
 class FD extends Map{constructor(form){super([...form.querySelectorAll('input,textarea,select')].filter(e=>e.name&&(e.type!=='checkbox'||e.checked)).map(e=>[e.name,e.value]));}}
 const location={pathname:'/'+path.replace('.html','')};
 vm.runInNewContext(code,{document,window,location,FormData:FD,URLSearchParams,AbortSignal,setTimeout:()=>0,Date,fetch:async(...args)=>{posts.push(args);return {ok:accepted}}});
 const submit=()=>f.dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
 const success=f.parentElement.querySelector('[data-request-success]');
 if(kind==='book')assert.equal(success.querySelector('[data-sample-download]').hasAttribute('href'),false);
 submit();submit();await tick();assert.equal(posts.length,1);assert.equal(f.hidden,false);assert.equal(success.hidden,true);assert.equal(f.querySelector('[name=email]').value,'example@example.com');assert.equal(f.querySelector('[type=submit]').disabled,false);assert.match(f.querySelector('[role=status]').textContent,/could not confirm/);
 accepted=true;submit();await tick();assert.equal(posts.length,2);assert.equal(f.hidden,true);assert.equal(success.hidden,false);
 const payload=new URLSearchParams(posts.at(-1)[1].body);assert.equal(payload.get('newsletter-consent'),consent?'yes':'no');assert.equal(payload.get('name'),'Example');assert.equal(payload.get('form-name'),f.getAttribute('name'));assert.equal(payload.get('sn-form'),f.getAttribute('name'));
 if(kind==='book')assert.equal(success.querySelector('[data-sample-download]').getAttribute('href'),'/assets/downloads/Earning_Power_Exit_Power_First_Chapter.pdf');
 submit();await tick();assert.equal(posts.length,2);
}
const {document:resources}=parseHTML(fs.readFileSync('worksheets.html','utf8'));
assert.equal(resources.querySelectorAll('.guide-grid img').length,6);assert.equal(resources.querySelectorAll('.guide-grid h3').length,6);
for(const a of resources.querySelectorAll('.guide-grid article>.text-link'))assert.match(a.getAttribute('href'),/^\/free-guides\//);
const {document:about}=parseHTML(fs.readFileSync('about.html','utf8'));assert.equal(about.querySelector('.about-portrait img').getAttribute('alt'),'Sayantan Nandi');assert.ok(fs.existsSync(about.querySelector('.about-portrait img').getAttribute('src').slice(1)));
for(const path of ['index.html','step-up.html','step-up/cohort.html','get-coached.html','b2b-queries.html','worksheets.html','philosophy.html','about.html','newsletter.html']){
 const {document}=parseHTML(fs.readFileSync(path,'utf8'));assert.equal(document.querySelector('[data-kind], [data-resource], .demo-bar, .pagebar, .design-note, .preview-form'),null,path);assert.equal(document.querySelector('meta[name=robots]'),null,path);assert.equal(document.querySelectorAll('main h1').length,1,path);assert(!document.body.textContent.includes('preview form'),path);
}
console.log('PASS refresh: three request forms, rejected POST and retry, retained input, duplicate protection, optional newsletter consent, book capture gate, six image cards and portrait. No live submissions.');
