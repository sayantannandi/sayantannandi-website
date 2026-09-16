import {runtime} from './_shared/runtime.mjs';
import {drain,mailerClient} from './_shared/funnel.mjs';
export default async () => {
  const {store,env}=runtime();
  if(env.SN_FUNNEL_MODE==='off' || !env.MAILERLITE_API_KEY) return new Response('paused');
  const counts=await drain(store,env,mailerClient(env.MAILERLITE_API_KEY));
  console.log('funnel_queue',counts);
  return Response.json(counts);
};
export const config={schedule:'*/10 * * * *'};
