import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {tests} from '../assets/lead-magnet-data.mjs';
import {formJob,verifiedRazorpay,paymentJob,enqueue,processJob,escapeHTML,mailerClient} from '../netlify/functions/_shared/funnel.mjs';
class Store {
  data=new Map(); n=0;
  async setJSON(key,value,condition={}) {const old=this.data.get(key); if(condition.onlyIfNew && old || condition.onlyIfMatch && old?.etag!==condition.onlyIfMatch)return {modified:false};const etag=String(++this.n);this.data.set(key,{data:structuredClone(value),etag});return {modified:true,etag};}
  async get(key){return this.data.get(key)?.data || null;}
  async getWithMetadata(key){return this.data.get(key) || null;}
  async delete(key){this.data.delete(key);}
  async list({prefix}){return {blobs:[...this.data.keys()].filter(key=>key.startsWith(prefix)).map(key=>({key}))};}
}
function apiFixture(status='active'){
  let person=null; const calls=[];
  const api=async(path,method='GET',body)=>{
    calls.push({path,method,body});
    if(method==='GET')return person;
    if(path==='subscribers'){person ||= {id:'sub1',status,fields:{},groups:[]};Object.assign(person.fields,body.fields);return structuredClone(person);}
    if(path.includes('/groups/'))person.groups.push({id:path.split('/').at(-1)});
    if(method==='PUT')Object.assign(person.fields,body.fields);
    return person;
  };return {api,calls,person:()=>person};
}
const ids=Object.fromEntries(['letter','judgment','visibility','customer','course','cohort'].map(x=>[x,x]));
const env={SN_FUNNEL_MODE:'live',SN_GROUP_IDS:JSON.stringify(ids),SN_COURSE_ACCESS_URL:'https://example.com/access'};
function form(source='judgment',consent='no') {return {'form-name':'sn-'+source,name:'Asha',email:'asha@example.com','newsletter-consent':consent,consent:'yes','test-id':source,'test-version':tests[source]?.version,answers:JSON.stringify(tests[source]?.questions.map(q=>q.options[0].id))};}
test('server rejects forged test data and ignores client scores',()=>{
  const d=form();d['dimension-scores']='{"recommendation":999}';assert.equal(formJob(d).source,'judgment');
  assert.throws(()=>formJob({...d,answers:'["forged"]'}));assert.throws(()=>formJob({...d,'test-version':'old'}));
  assert.equal(formJob({...d,'form-name':'old-test'}),null);assert.equal(formJob({...d,'bot-field':'spam'}),null);
});
test('report-only gets a private report but never joins the letter',async()=>{
  const s=new Store(), a=apiFixture(), j=formJob(form());await enqueue(s,j);await processJob(s,j,env,a.api);
  assert.deepEqual(a.person().groups,[{id:'judgment'}]);assert.match(a.person().fields.sn_judgment_url,/\?t=[a-f0-9]{48}$/);
  assert.equal(await s.get('pending/'+j.id),null);assert(!a.calls.some(c=>c.body?.status));
});
test('two tests and newsletter consent keep one profile and distinct report links',async()=>{
  const s=new Store(), a=apiFixture();for(const source of ['judgment','visibility','letter'])await processJob(s,formJob(form(source,'yes')),env,a.api);
  assert.equal(a.person().groups.filter(x=>x.id==='letter').length,1);
  assert(a.person().fields.sn_visibility_url!==a.person().fields.sn_judgment_url);
  assert(a.person().fields.sn_consent_at);
});
test('same-email concurrent jobs are serialized and retry safely',async()=>{
  const s=new Store(), a=apiFixture();const jobs=[formJob(form('judgment','yes')),formJob(form('visibility','yes'))];
  const results=await Promise.all(jobs.map(j=>processJob(s,j,env,a.api)));assert(results.includes('busy'));
  for(const j of jobs)await processJob(s,j,env,a.api);
  assert.equal(a.person().groups.filter(x=>x.id==='letter').length,1);
});
test('an API failure retains the queued job; retry and repeated events do not resend',async()=>{
  const s=new Store(), a=apiFixture(),j=formJob(form());await enqueue(s,j);
  await assert.rejects(processJob(s,j,env,async()=>{throw new Error('mailerlite_500');}));assert(await s.get('pending/'+j.id));
  await processJob(s,j,env,a.api);await processJob(s,j,env,a.api);await enqueue(s,j);assert.equal(await s.get('pending/'+j.id),null);
  assert.equal(a.person().groups.length,1);
});
test('suppressed subscribers stay suppressed and create a service attention record',async()=>{
  const s=new Store(),a=apiFixture('unsubscribed');await a.api('subscribers','POST',{fields:{}});
  const j=formJob(form('judgment','yes'));assert.equal(await processJob(s,j,env,a.api),'suppressed');
  assert.equal(a.person().groups.length,0);assert(await s.get('attention/'+j.id));
});
test('purchase suppresses sales before onboarding and waits for missing access',async()=>{
  const s=new Store(),a=apiFixture(),j={kind:'purchase',id:'p1',email:'asha@example.com',product:'course',purchaseId:'pay_1'};
  await enqueue(s,j);await assert.rejects(processJob(s,j,{...env,SN_COURSE_ACCESS_URL:''},a.api),/missing_access/);
  assert.deepEqual(a.person().groups,[{id:'customer'}]);assert(await s.get('pending/p1'));
  await processJob(s,j,env,a.api);assert.deepEqual(a.person().groups,[{id:'customer'},{id:'course'}]);
  assert.equal(a.person().fields.sn_course_access,'https://example.com/access');
});
test('QA and off modes cannot start emails for other people',async()=>{
  const s=new Store(),a=apiFixture();for(const mode of ['off','qa'])assert.equal(await processJob(s,formJob(form()),{...env,SN_FUNNEL_MODE:mode},a.api),'paused');assert.equal(a.calls.length,0);
});
test('capture mode saves the profile without starting emails, then live routing completes',async()=>{
  const s=new Store(),a=apiFixture(),j=formJob(form('judgment','yes'));await enqueue(s,j);
  assert.equal(await processJob(s,j,{...env,SN_FUNNEL_MODE:'capture'},a.api),'paused');
  assert(a.person().fields.sn_judgment_url);assert.equal(a.person().groups.length,0);assert(await s.get('pending/'+j.id));
  await processJob(s,j,env,a.api);assert.equal(a.person().groups.length,2);
});
test('Razorpay authentication rejects missing secrets and changed payloads',()=>{
  const raw='{"event":"payment.captured"}',secret='a-long-test-secret-with-more-than-24-characters';
  const sig=createHmac('sha256',secret).update(raw).digest('hex');assert(verifiedRazorpay(raw,sig,secret));
  assert(!verifiedRazorpay(raw+' ',sig,secret));assert(!verifiedRazorpay(raw,sig,''));assert(!verifiedRazorpay(raw,'bad',secret));
});
test('payments require an exact configured identifier and fully captured payment',()=>{
  const p={event:'payment.captured',payload:{payment:{entity:{id:'pay_1',status:'captured',email:'asha@example.com',amount:199900,order_id:'order_1'}}}};
  assert.throws(()=>paymentJob(p,{}),/unmapped/);assert.equal(paymentJob(p,{order_1:'cohort'}).product,'cohort');
  p.payload.payment.entity.status='authorized';assert.throws(()=>paymentJob(p,{order_1:'cohort'}),/not_captured/);
});
test('report HTML escapes submitted content and API errors never leak provider bodies',async()=>{
  assert.equal(escapeHTML('<img src=x onerror="bad">'),'&lt;img src=x onerror=&quot;bad&quot;&gt;');
  const api=mailerClient('test',async()=>new Response('sensitive response',{status:401}));await assert.rejects(api('subscribers'),/^Error: mailerlite_401$/);
});
