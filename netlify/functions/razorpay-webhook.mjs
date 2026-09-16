import {runtime} from './_shared/runtime.mjs';
import {verifiedRazorpay,paymentJob,enqueue,processJob,mailerClient} from './_shared/funnel.mjs';
export default async req => {
  if(req.method!=='POST') return new Response('POST only',{status:405});
  const {store,env}=runtime();
  if(!env.SN_RAZORPAY_WEBHOOK_SECRET) return new Response('Payment connection is not configured.',{status:503});
  const raw=await req.text();
  if(raw.length>100000) return new Response('Too large',{status:413});
  if(!verifiedRazorpay(raw,req.headers.get('x-razorpay-signature'),env.SN_RAZORPAY_WEBHOOK_SECRET)) return new Response('Invalid signature',{status:401});
  let job;
  try {job=paymentJob(JSON.parse(raw),JSON.parse(env.SN_RAZORPAY_PRODUCT_MAP || '{}'));}
  catch(error){console.error('payment_rejected',error.message);return new Response('Payment needs review: '+error.message,{status:422});}
  if(!job) return new Response('Event ignored');
  await enqueue(store,job);
  if(env.MAILERLITE_API_KEY) {
    try {await processJob(store,job,env,mailerClient(env.MAILERLITE_API_KEY));}
    catch(error){console.error('payment_queued',job.id,error.message);}
  }
  return new Response('Payment recorded');
};
