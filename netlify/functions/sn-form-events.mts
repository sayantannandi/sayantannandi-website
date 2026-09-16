import type {FormSubmittedEvent} from '@netlify/functions';
import {runtime} from './_shared/runtime.mjs';
import {formJob,enqueue,processJob,mailerClient} from './_shared/funnel.mjs';
// Netlify verifies its event signature before invoking this handler.
export default {
  async formSubmitted(event: FormSubmittedEvent) {
    const {store,env}=runtime();
    let job;
    try {job=formJob(event.data);} catch(error) {console.error('form_invalid',error.message);return;}
    if(!job) return;
    await enqueue(store,job);
    if(!env.MAILERLITE_API_KEY) return; // Captured requests remain queued during setup.
    try {await processJob(store,job,env,mailerClient(env.MAILERLITE_API_KEY));}
    catch(error){console.error('form_queued',job.id,error.message);}
  }
};
