import {createHash, randomBytes, createHmac, timingSafeEqual} from 'node:crypto';
import {tests} from '../../../assets/lead-magnet-data.mjs';
import {evaluate, reportText} from '../../../assets/lead-magnet-engine.mjs';

export const FORMS = {'sn-letter':'letter','sn-judgment':'judgment','sn-visibility':'visibility'};
export const PRODUCTS = ['course','cohort','kit_pcb','kit_rrk','kit_eh','kit_bundle'];
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
  const job = {kind:'form', source, email, name, consent, created:now, consentVersion:'sn-2026-09-button'};
  if(source !== 'letter') {
    const test = tests[source];
    if(data['test-id'] !== source || data['test-version'] !== test.version) throw new Error('invalid_test_version');
    const answers = JSON.parse(data.answers || 'null');
    evaluate(test, answers); // Reject unknown options and recompute all scores on the server.
    job.answers = answers;
  }
  job.id = hash(JSON.stringify([source,email,consent,job.answers,Math.floor(now/86400000)]));
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
  const groups=JSON.parse(env.SN_GROUP_IDS || '{}');
  const group = name => {if(!groups[name]) throw new Error('missing_group_'+name); return String(groups[name]);};
  const lockKey=await lock(store,job.email,now);
  if(!lockKey) return 'busy';
  try {
    if(await store.get('done/'+job.id)) {await store.delete('pending/'+job.id);return 'duplicate';}
    let subscriber=await api('subscribers/'+encodeURIComponent(job.email));
    const suppressed=subscriber && subscriber.status !== 'active';
    let fields={...(job.name ? {name:job.name} : {})};
    if(job.kind==='form') fields.sn_source=job.source;
    if(job.consent) Object.assign(fields,{sn_consent_at:new Date(job.created).toISOString(),sn_consent_version:job.consentVersion});
    if(job.kind==='form' && job.source!=='letter') {
      const test=tests[job.source], result=evaluate(test,job.answers);
      const ownerKey='report-owner/'+hash(job.email+':'+job.source);
      await store.setJSON(ownerKey,{token:randomBytes(24).toString('hex')},{onlyIfNew:true});
      const {token}=await store.get(ownerKey,{type:'json'});
      // Stable private link: a repeat attempt updates the report without restarting emails.
      await store.setJSON('reports/'+token,{title:test.title,text:reportText(test,result),updated:now,expires:now+180*86400000});
      fields['sn_'+job.source+'_url']='https://sayantannandi.com/api/report?t='+token;
      fields['sn_'+job.source+'_focus']=result.allStrong ? 'Applying the reasoning to your own work' : result.focus.map(d=>d.title).join(' / ');
    }
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
      if(!suppressed) await join(job.product);
    } else if(!suppressed) {
      if(job.source!=='letter') await join(job.source);
      if(job.consent) await join('letter');
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
    if(!canProcess(job,env) || env.SN_FUNNEL_MODE==='capture' && await store.get('captured/'+job.id)) continue;
    processed++;
    try {counts[await processJob(store,job,env,api)]++;}
    catch(error){counts.failed++;console.error('funnel_retry',job.id,error.message);}
  }
  return counts;
}
