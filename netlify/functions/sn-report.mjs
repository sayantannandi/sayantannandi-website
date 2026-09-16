import {runtime} from './_shared/runtime.mjs';
import {escapeHTML} from './_shared/funnel.mjs';
export default async req => {
  const headers={'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow',
    'Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"};
  if(req.method!=='GET') return new Response('GET only',{status:405,headers});
  const token=new URL(req.url).searchParams.get('t');
  if(!/^[a-f0-9]{48}$/.test(token || '')) return new Response('Report link not found.',{status:404,headers});
  const {store}=runtime();
  const report=await store.get('reports/'+token,{type:'json'});
  if(!report || report.expires<Date.now()) return new Response('This report link has expired. Take the free test again at sayantannandi.com to create a new report.',{status:404,headers});
  return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+escapeHTML(report.title)+'</title><style>body{margin:40px auto;padding:0 24px;max-width:800px;font:18px/1.7 Arial;color:#12324f;background:#fafbf9}h1{font-family:Georgia}pre{white-space:pre-wrap;font:inherit}a{color:#206849}</style><h1>'+escapeHTML(report.title)+'</h1><p>This private link shows your latest attempt. Use your browser’s Print option to save a PDF.</p><pre>'+escapeHTML(report.text)+'</pre><p><a href="mailto:hello@sayantannandi.com">hello@sayantannandi.com</a></p></html>',{headers});
};
export const config={path:'/api/report'};
