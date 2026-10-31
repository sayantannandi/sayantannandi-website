import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseHTML} from 'linkedom';
import vm from 'node:vm';
const doc=path=>parseHTML(fs.readFileSync(path,'utf8')).document;
test('book worksheets require name and email and expose no download link before capture',()=>{
 const d=doc('worksheets/book.html'),f=d.querySelector('[data-resource-form]');
 assert(f.querySelector('[name=name][required]'));assert(f.querySelector('[name=email][required]'));
 assert(!f.hasAttribute('data-capture'));
 assert.equal(d.querySelector('a[href$=".pdf"]'),null);
 assert(d.querySelector('[data-resource-success][hidden]'));
 assert(!d.querySelector('[data-resource-download]').hasAttribute('href'));
 assert.equal(doc('worksheets/received.html').querySelector('a[href$=".pdf"]'),null);
});
test('all current quiz forms declare their answer and version fields',()=>{
 for(const slug of ['senior-level-judgment','leadership-visibility','business-leadership','exit-power']) {
  const d=doc('tests/'+slug+'.html');
  assert(d.querySelector('[name=name][required]'));assert(d.querySelector('[name=email][required]'));
  assert(d.querySelector('[name=test-version]'));assert(d.querySelector('[name=answers]'));
  assert(d.querySelector('[data-quiz-report][hidden]'));
  assert(!d.querySelector('[name=newsletter-consent]').hasAttribute('checked'));
 }
});
test('Starting Point reveals results only after accepted capture and retains answers after failure',async()=>{
 const {document}=parseHTML(fs.readFileSync('check.html','utf8'));
 const root=document.querySelector('#starting-check'),gate=document.querySelector('#starting-email'),output=document.querySelector('#starting-result');
 const listeners=new Map();let accept=false,posts=0;
 const proto=Object.getPrototypeOf(root);
 proto.focus=function(){};proto.scrollIntoView=function(){};
 const originalAdd=proto.addEventListener;
 proto.addEventListener=function(type,fn){listeners.set(this.getAttribute('id')+':'+type,fn);return originalAdd.call(this,type,fn);};
 const form=gate.querySelector('form');form.setAttribute('id','capture');form.reportValidity=()=>true;
 const {VERSION,questions}=await import('../assets/starting-point-data.mjs');
 const {evaluateStarting,startingReport}=await import('../assets/starting-point-engine.mjs');
 class FD{constructor(){}}class Params{toString(){return 'encoded';}}
 const code=fs.readFileSync('assets/starting-point.js','utf8').replace(/^import .*;\n/gm,'');
 vm.runInNewContext(code,{document,VERSION,questions,evaluateStarting,startingReport,downloadText(){},FormData:FD,URLSearchParams:Params,AbortSignal:{timeout(){}},fetch:async()=>{posts++;return {ok:accept};}});
 document.querySelector('#starting-begin').click();
 for(let i=0;i<12;i++){
  const radio=root.querySelector('input[name=answer]');radio.setAttribute('checked','');
  await listeners.get('starting-question:submit')({preventDefault(){}});
 }
 assert.equal(gate.hidden,false);assert.equal(output.hidden,true);
 await listeners.get('capture:submit')({preventDefault(){}});
 assert.equal(output.hidden,true);assert.equal(gate.hidden,false);
 accept=true;await listeners.get('capture:submit')({preventDefault(){}});
 assert.equal(output.hidden,false);assert.equal(gate.hidden,true);assert.equal(posts,2);
 proto.addEventListener=originalAdd;
});
