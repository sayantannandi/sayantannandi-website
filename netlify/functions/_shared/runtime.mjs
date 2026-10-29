import {getStore,getDeployStore} from '@netlify/blobs';
export function runtime() {
  const names=['SN_FUNNEL_MODE','SN_RESOURCE_FUNNELS_READY','SN_JANUARY_FUNNEL_READY','SN_COHORT_JAN2027_ACCESS_URL','MAILERLITE_API_KEY','SN_GROUP_IDS','SN_RAZORPAY_WEBHOOK_SECRET','SN_RAZORPAY_PRODUCT_MAP',
    'SN_COURSE_ACCESS_URL','SN_COHORT_ACCESS_URL','SN_KIT_PCB_ACCESS_URL','SN_KIT_RRK_ACCESS_URL','SN_KIT_EH_ACCESS_URL','SN_KIT_BUNDLE_ACCESS_URL'];
  const env=Object.fromEntries(names.map(name=>[name,Netlify.env.get(name)]));
  const production=Netlify.context?.deploy?.context==='production';
  if(!production) env.SN_FUNNEL_MODE='off';
  const store=production ? getStore({name:'sn-funnel-v1',consistency:'strong'}) : getDeployStore('sn-funnel-preview');
  return {store,env};
}
