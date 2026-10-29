import {parseHTML} from 'linkedom';import{readFileSync}from'node:fs';import vm from'node:vm';import assert from'node:assert/strict';
import {VERSION,questions}from'../assets/starting-point-data.mjs';import {evaluateStarting,startingReport,calculateRunway}from'../assets/starting-point-engine.mjs';
for(const path of ['A','B']){
const {document,window}=parseHTML(readFileSync(new URL('../check.html',import.meta.url),'utf8'));window.HTMLElement.prototype.focus=function(){};window.HTMLElement.prototype.scrollIntoView=function(){};let calls=0;const downloads=[];
const context=vm.createContext({document,window,VERSION,questions,evaluateStarting,startingReport,calculateRunway,downloadText:(...x)=>downloads.push(x),fetch:()=>{calls++;throw Error('unexpected network');}});
vm.runInContext(readFileSync(new URL('../assets/starting-point.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,''),context);
function click(s){document.querySelector(s).dispatchEvent(new window.Event('click',{bubbles:true,cancelable:true}));}
click('#starting-begin');
for(let i=0;i<12;i++){
const selector=i===0?`[value=${path}]`:i===7?'[value=unknown]':'[value="0"]';
const input=document.querySelector('#starting-question '+selector);assert(input,'missing question '+i);input.checked=true;input.setAttribute('checked','');document.querySelector('#starting-question').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
}
assert.equal(document.querySelector('#starting-result').hidden,false);click('#starting-download');assert(downloads.length);assert.equal(calls,0);
assert.match(document.querySelector('#starting-result').textContent,/provisional/);
assert.equal(document.querySelector('#starting-email input[type=checkbox]').checked,undefined);
console.log('PASS UI path '+path+': twelve questions, unknown runway, result, optional email and report download; no network.');
}
