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
// Exercise the current four-quiz UI rather than retired selectors.
await import('./test_current_quizzes.mjs');
