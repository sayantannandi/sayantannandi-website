import {createHash, randomBytes, createHmac, timingSafeEqual} from 'node:crypto';
import {evaluateStarting,startingReport} from '../../../assets/starting-point-engine.mjs';
import {VERSION as STARTING_VERSION} from '../../../assets/starting-point-data.mjs';
import {tests} from '../../../assets/lead-magnet-data.mjs';
import {evaluate, reportText} from '../../../assets/lead-magnet-engine.mjs';
import {reviewTests,evaluateReview,reviewReport} from '../../../assets/lib/site-demo-quiz.mjs';
import {GROUP_IDS,DELIVERY_RELEASED,STAGED_SOURCES,requestGroup} from './delivery-config.mjs';

export const FORMS = {'sn-letter':'letter','sn-judgment':'judgment','sn-visibility':'visibility','sn-free-chapter':'free_chapter','sn-worksheets':'worksheets','sn-starting-point':'starting_point','sn-next-cohort':'next_cohort'};
Object.assign(FORMS, {'sn-review-quiz-judgment':'judgment','sn-review-quiz-visibility':'visibility','sn-review-quiz-exit':'exit','sn-review-quiz-leadership':'leadership','sn-review-book-interest':'book_interest','sn-book-interest':'book_interest','sn-review-coaching':'coaching','sn-review-call':'call','sn-cohort-intake':'cohort_intake'});
export const GUIDE_IDS = ['the-update-your-vp-can-act-on','be-more-strategic','months-of-choice','passed-over-what-to-ask','say-no-without-losing-trust','capture-your-review-evidence'];
for(const id of GUIDE_IDS) FORMS['sn-guide-'+id]='free_guide';
export const PRODUCTS = ['course','cohort','kit_pcb','kit_rrk','kit_eh','kit_bundle','cohort_jan2027'];
export const NEW_SOURCES = ['free_chapter','worksheets','starting_point','next_cohort'];
export const hash = value => createHash('sha256').update(value).digest('hex');
export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  if(email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) throw new Error('invalid_email');
  return email;
}
export function formJob(data, now = Date.now()) {
  const source = FORMS[data['sn-form'] || data['form-name']];
  if(!source || data['bot-field']) return null;
  const email = validEmail(data.email);
  const name = String(data.name || '').trim();
  if(!name || name.length > 100) throw new Error('invalid_name');
  const consent = source === 'letter' ? data.consent === 'yes' : data['newsletter-consent'] === 'yes';
  if(source === 'letter' && !consent) throw new Error('missing_consent');
  const job = {kind:'form', source, email, name, consent, created:now, consentVersion:NEW_SOURCES.includes(source)?'sn-2026-10-29':'sn-2026-09-button'};
  if(NEW_SOURCES.includes(source) && data.consent!=='yes') throw new Error('missing_consent');
  job.consentVersion=String(data['consent-version'] || job.consentVersion).slice(0,100);
  if(source==='book_interest') job.sampleDelivery=data['sample-delivery']==='email'?'email':'download';
  if(source === 'free_guide') {
    const guide = String(data['guide-id'] || '');
    if(!GUIDE_IDS.includes(guide) || data['form-name'] !== 'sn-guide-'+guide) throw new Error('invalid_guide');
    // Requested delivery is separate from permission to send newsletters.
    job.guide = guide;
    job.consentVersion = 'free-guides-2026-10-30';
  }
  if(source === 'starting_point') {
    if(data['test-version']!==STARTING_VERSION) throw new Error('invalid_test_version');
    const answers=JSON.parse(data.answers || 'null');
    evaluateStarting(answers);
    job.answers=answers;
  }
  if(String(data['form-name']).startsWith('sn-review-quiz-')) {
    const test=reviewTests[source];
    if(data['test-id']!==source || data['test-version'] && data['test-version']!==test.version) throw new Error('invalid_test_version');
    job.answers=JSON.parse(data.answers || 'null');
    evaluateReview(source,job.answers);
    job.variant='current';
  } else if(tests[source]) {
    const test = tests[source];
    if(data['test-id'] !== source || data['test-version'] !== test.version) throw new Error('invalid_test_version');
    const answers = JSON.parse(data.answers || 'null');
    evaluate(test, answers); // Reject unknown options and recompute all scores on the server.
    job.answers = answers;
  }
  job.id = hash(JSON.stringify([source,email,consent,job.guide,job.variant,job.answers,Math.floor(now/86400000)]));
  return job;
}
export function verifiedRazorpay(raw, signature, secret) {
  if(!secret || secret.length < 24 || !/^[a-f0-9]{64}$/i.test(signature || '')) return false;
  const expected = createHmac('sha256',secret).update(raw).digest();
  return timingSafeEqual(Buffer.from(signature,'hex'),expected);
}
export function paymentJob(body, mapping, now = Date.now()) {
  // Match exact provider IDs only. Amounts and descriptions never select a product.
  if(!['payment.captured','payment_link.paid'].includes(body.event)) return null;
  const payment = body.payload?.payment?.entity;
  const link = body.payload?.payment_link?.entity;
  if(!payment || payment.status !== 'captured' || !payment.id) throw new Error('payment_not_captured');
  const ids = [link?.id,payment.payment_link_id,payment.payment_page_id,payment.order_id].filter(Boolean);
  const matches = [...new Set(ids.filter(id=>Object.hasOwn(mapping,id)).map(id=>mapping[id]))];
  if(matches.length !== 1 || !PRODUCTS.includes(matches[0])) throw new Error('unmapped_product');
  if(link && (link.status !== 'paid' || Number(link.amount_paid) < Number(link.amount))) throw new Error('payment_incomplete');
  if(payment.amount_refunded > 0) throw new Error('payment_refunded');
  return {kind:'purchase', product:matches[0], email:validEmail(payment.email || link?.customer?.email),
    name:String(payment.notes?.name || link?.customer?.name || '').slice(0,100),
    purchaseId:payment.id, id:hash('razorpay:'+payment.id), created:now};
}
export function canProcess(job,env) {
  // Resource profiles and source groups can be stored while new sending workflows await review.
  if(job.product==='cohort_jan2027' && env.SN_JANUARY_FUNNEL_READY!=='true') return false;
  return ['live','capture'].includes(env.SN_FUNNEL_MODE) || (env.SN_FUNNEL_MODE === 'qa' && job.email === 'hello@sayantannandi.com');
}
export function mailerClient(token,fetcher=fetch) {
  if(!token) throw new Error('missing_mailerlite_key');
  return async (path,method='GET',body) => {
    const response = await fetcher('https://connect.mailerlite.com/api/'+path,{
      method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',Accept:'application/json'},
      ...(body ? {body:JSON.stringify(body)} : {}),signal:AbortSignal.timeout(8000)});
    if(method==='GET' && response.status===404) return null;
    if(!response.ok) throw new Error('mailerlite_'+response.status);
    return response.status===204 ? null : (await response.json()).data;
  };
}
export async function enqueue(store, job) {
  if(!job) return;
  if(await store.get('done/'+job.id)) return;
  await store.setJSON('pending/'+job.id,job,{onlyIfNew:true});
}
async function lock(store,email,now) {
  const key='locks/'+hash(email), value={until:now+120000};
  const previous=await store.getWithMetadata(key,{type:'json'});
  if(previous && previous.data.until > now) return null;
  const result=await store.setJSON(key,value,previous ? {onlyIfMatch:previous.etag} : {onlyIfNew:true});
  return result.modified ? key : null;
}
export async function processJob(store,job,env,api,now=Date.now()) {
  if(!canProcess(job,env)) return 'paused';
  if(env.SN_FUNNEL_MODE==='capture' && await store.get('captured/'+job.id)) return 'paused';
  const groups={...GROUP_IDS,...JSON.parse(env.SN_GROUP_IDS || '{}')};
  const group = name => {if(!groups[name]) throw new Error('missing_group_'+name); return String(groups[name]);};
  const lockKey=await lock(store,job.email,now);
  if(!lockKey) return 'busy';
  try {
    if(await store.get('done/'+job.id)) {await store.delete('pending/'+job.id);return 'duplicate';}
    let subscriber=await api('subscribers/'+encodeURIComponent(job.email));
    const suppressed=subscriber && subscriber.status !== 'active';
    let fields={...(job.name ? {name:job.name} : {})};
    if(job.kind==='form') Object.assign(fields,{sn_source:job.source==='free_guide' ? 'free_guide:'+job.guide : job.source,sn_request_at:new Date(job.created).toISOString()});
    if(job.consent) Object.assign(fields,{sn_consent_at:new Date(job.created).toISOString(),sn_consent_version:job.consentVersion});
    if(job.kind==='form' && (tests[job.source] || job.variant==='current')) {
      const current=job.variant==='current';
      const test=current?reviewTests[job.source]:tests[job.source], result=current?evaluateReview(job.source,job.answers):evaluate(test,job.answers);
      const ownerKey='report-owner/'+hash(job.email+':'+job.source);
      await store.setJSON(ownerKey,{token:randomBytes(24).toString('hex')},{onlyIfNew:true});
      const {token}=await store.get(ownerKey,{type:'json'});
      // Stable private link: a repeat attempt updates the report without restarting emails.
      const text=current?reviewReport(job.source,result).replaceAll('https://sayantannandi.com/review/start-here-blue','https://sayantannandi.com/'):reportText(test,result);
      await store.setJSON('reports/'+token,{title:test.title,text,updated:now,expires:now+180*86400000});
      fields['sn_'+job.source+'_url']='https://sayantannandi.com/api/report?t='+token;
      fields['sn_'+job.source+'_focus']=result.allStrong ? 'Applying the reasoning to your own work' : result.focus.map(d=>d.title).join(' / ');
    }
    if(job.kind==='form' && job.source==='starting_point') {
      const result=evaluateStarting(job.answers);
      const ownerKey='report-owner/'+hash(job.email+':starting_point');
      await store.setJSON(ownerKey,{token:randomBytes(24).toString('hex')},{onlyIfNew:true});
      const {token}=await store.get(ownerKey,{type:'json'});
      await store.setJSON('reports/'+token,{title:'Starting Point Check',text:startingReport(result),updated:now,expires:now+180*86400000});
      Object.assign(fields,{sn_starting_point_url:'https://sayantannandi.com/api/report?t='+token,
        sn_starting_point_box:result.box.label,sn_starting_point_skill:result.skill.title,
        sn_starting_point_runway:result.band.label,sn_starting_point_decision:result.decision,
        sn_starting_point_cta:'https://sayantannandi.com'+result.action.url});
    }
    if(job.source==='free_chapter') fields.sn_resource_url='https://sayantannandi.com/assets/downloads/Earning_Power_Exit_Power_First_Chapter.pdf';
    if(job.source==='worksheets') fields.sn_resource_url='https://sayantannandi.com/assets/downloads/Earning_Power_Exit_Power_Worksheets.pdf';
    if(job.source==='book_interest') Object.assign(fields,{sn_resource_url:'https://sayantannandi.com/assets/downloads/Earning_Power_Exit_Power_First_Chapter.pdf',sn_sample_delivery:job.sampleDelivery || 'download',sn_preorder_at:new Date(job.created).toISOString()});
    if(job.kind==='purchase') fields.sn_purchase_id=job.purchaseId;
    // Never set status: an unsubscribed or bounced contact must not be reactivated by a purchase or a test.
    subscriber=await api('subscribers','POST',{email:job.email,fields});
    // Capture-only mode registers the profile and fields without starting a workflow.
    // The queued job remains so normal group routing can run after activation.
    if(env.SN_FUNNEL_MODE==='capture') {await store.setJSON('captured/'+job.id,{at:now});return 'paused';}
    const memberships=new Set((subscriber.groups || []).map(g=>String(g.id)));
    const join=async name=>{
      const id=group(name);
      if(!memberships.has(id)){await api('subscribers/'+subscriber.id+'/groups/'+id,'POST',{});memberships.add(id);}
    };
    if(job.kind==='purchase') {
      await join('customer'); // Suppress pitches before starting product onboarding.
      const access=env['SN_'+job.product.toUpperCase()+'_ACCESS_URL'];
      if(!access || !/^https:\/\//.test(access)) throw new Error('missing_access_'+job.product);
      await api('subscribers/'+subscriber.id,'PUT',{fields:{['sn_'+job.product+'_access']:access}});
      if(!suppressed) {
        if(job.product==='kit_rrk' && !DELIVERY_RELEASED) {await join(job.product);await store.setJSON('staged/'+job.id,{at:now});return 'paused';}
        if(job.product==='kit_rrk' && await store.get('staged/'+job.id) && memberships.has(group(job.product))) {
          await api('subscribers/'+subscriber.id+'/groups/'+group(job.product),'DELETE');memberships.delete(group(job.product));
        }
        await join(job.product);await store.delete('staged/'+job.id);
      }
    } else if(!suppressed) {
      const key=requestGroup(job), staged=STAGED_SOURCES.has(job.source);
      const stagedKey='staged/'+job.id;
      const deliveryKey='delivered/'+hash(job.email+':'+key);
      // On release, rejoin a previously staged inactive group exactly once to start its approved workflow.
      if(staged && DELIVERY_RELEASED && !await store.get(deliveryKey) && await store.get(stagedKey) && memberships.has(group(key))) {
        await api('subscribers/'+subscriber.id+'/groups/'+group(key),'DELETE');memberships.delete(group(key));
      }
      if(job.source!=='letter') await join(key);
      if(job.consent) await join('letter');
      if(staged && !DELIVERY_RELEASED) {await store.setJSON(stagedKey,{at:now});return 'paused';}
      if(staged) await store.setJSON(deliveryKey,{at:now});
      await store.delete(stagedKey);
    }
    if(suppressed) await store.setJSON('attention/'+job.id,{reason:'subscriber_not_active',email:job.email,kind:job.kind,product:job.product || '',created:now});
    await store.setJSON('done/'+job.id,{at:now});
    await store.delete('pending/'+job.id);
    await store.delete('captured/'+job.id);
    return suppressed ? 'suppressed' : 'complete';
  } finally {await store.delete(lockKey);}
}
export async function drain(store,env,api,limit=10) {
  const {blobs}=await store.list({prefix:'pending/'});
  const counts={complete:0,paused:0,failed:0,busy:0,suppressed:0,duplicate:0};
  const deadline=Date.now()+22000;
  let processed=0;
  for(const {key} of blobs) {
    if(Date.now()>deadline || processed>=limit) break;
    const job=await store.get(key,{type:'json'});
    if(!job) continue;
    if(!DELIVERY_RELEASED && (STAGED_SOURCES.has(job.source) || job.product==='kit_rrk') && await store.get('staged/'+job.id)) continue;
    if(!canProcess(job,env) || env.SN_FUNNEL_MODE==='capture' && await store.get('captured/'+job.id)) continue;
    processed++;
    try {counts[await processJob(store,job,env,api)]++;}
    catch(error){counts.failed++;console.error('funnel_retry',job.id,error.message);}
  }
  return counts;
}
