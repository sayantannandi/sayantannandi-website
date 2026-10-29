import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateStarting,calculateRunway,runwayBand,startingReport} from '../assets/starting-point-engine.mjs';
import {VERSION} from '../assets/starting-point-data.mjs';
import {formJob,processJob} from '../netlify/functions/_shared/funnel.mjs';
const all=(path='A',score='3',runway='12to50')=>[path,...Array(6).fill(score),runway,...Array(3).fill(score),'0'];
test('all four reflection boxes and both paths produce a concrete exercise',()=>{
 assert.equal(evaluateStarting(all()).box.label,'Real options');
 assert.equal(evaluateStarting(all('A','0')).box.label,'Build earning first');
 const safe=all('B','0');safe.splice(8,3,'3','3','3');assert.equal(evaluateStarting(safe).box.label,'Safe, not growing');
 const trapped=all();trapped.splice(7,4,'under3','0','0','0');const r=evaluateStarting(trapped);assert.equal(r.box.label,'Trapped Earner');assert.equal(r.action.url,'/worksheets');
 assert.match(evaluateStarting(all('B','0')).skill.exercise,/one example of the missing evidence/);
 assert.match(startingReport(r),/not validated/);
});
test('thresholds use 11 of 18 and 7 of 12 without converting them into salary or exact months',()=>{
 const a=['A','3','3','3','1','0','0','6to12','2','2','1','0'];
 assert.equal(evaluateStarting(a).earning,10);assert.equal(evaluateStarting(a).exit,7);assert.equal(evaluateStarting(a).box.label,'Safe, not growing');
 a[4]='2';assert.equal(evaluateStarting(a).box.label,'Real options');a[10]='0';assert.equal(evaluateStarting(a).box.label,'Trapped Earner');
});
test('unknown and very short runway prioritize counting before a paid offer',()=>{
 for(const id of ['unknown','under3']){
  const r=evaluateStarting(all('A','3',id));assert.equal(r.action.url,'/worksheets');
  assert.equal(r.unknown,id==='unknown');assert.equal(r.provisional,id==='unknown');
 }
});
test('missing, forged and wrong-path values are rejected server side',()=>{
 assert.throws(()=>evaluateStarting([]));const a=all();a[0]='X';assert.throws(()=>evaluateStarting(a));
 const b=all();b[3]='99';assert.throws(()=>evaluateStarting(b));
 const data={'form-name':'sn-starting-point',name:'Asha',email:'asha@example.com',consent:'yes','test-version':VERSION,answers:JSON.stringify(all()),'newsletter-consent':'no'};
 const j=formJob(data);assert.equal(j.source,'starting_point');assert.equal(j.consent,false);
 assert.throws(()=>formJob({...data,'test-version':'old'}));assert.throws(()=>formJob({...data,consent:'no'}));
});
test('calculator handles zero reserves, continuing income, boundaries and invalid inputs',()=>{
 assert.equal(calculateRunway(2400000,200000,80000).months,20);
 assert.equal(calculateRunway(0,100000).months,0);
 assert.equal(calculateRunway(100000,100000,100000).covered,true);
 assert.equal(calculateRunway(0,100000,200000).months,null);
 for(const [n,id] of [[2.999,'under3'],[3,'3to6'],[6,'6to12'],[12,'12to50'],[50,'50to200'],[200,'50to200'],[200.01,'over200']])assert.equal(runwayBand(n).id,id);
 for(const values of [[1,0,0],[-1,1,0],[1,1,-1],[NaN,1,0],[1,Infinity,0]])assert.throws(()=>calculateRunway(...values));
});
test('new email routes remain queued until deliberately enabled and never start existing workflows',async()=>{
 for(const source of ['sn-free-chapter','sn-worksheets','sn-next-cohort']){
  const j=formJob({'form-name':source,name:'Asha',email:'asha@example.com',consent:'yes'});
  assert(j);assert.equal(await processJob({},j,{SN_FUNNEL_MODE:'live'},()=>{throw new Error('must not call MailerLite');}),'paused');
 }
 assert.equal(await processJob({},{kind:'purchase',product:'cohort_jan2027'},{SN_FUNNEL_MODE:'live'},()=>{throw new Error('must not call MailerLite');}),'paused');
});
