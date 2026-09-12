'use strict';
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
document.addEventListener('keydown', event => { if(event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { menu.setAttribute('aria-expanded','false'); nav.classList.remove('open'); menu.focus(); } });
for(const form of document.querySelectorAll('form[data-capture]')) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if(!form.reportValidity() || form.dataset.sending === 'true') return;
    const button = form.querySelector('[type=submit]');
    const status = form.querySelector('.form-status');
    const oldText = button.textContent;
    form.dataset.sending = 'true'; button.disabled = true; button.textContent = 'Sending…';
    status.className = 'form-status'; status.textContent = '';
    try {
      const response = await fetch('/', {method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString(),signal:AbortSignal.timeout(15000)});
      if(!response.ok) throw new Error('Submission was not accepted');
      status.className = 'form-status success';
      status.textContent = form.dataset.success || 'Thank you. Your request has been received.';
      form.reset(); button.textContent = 'Request received';
      // Keep the accepted form disabled to prevent accidental duplicate submissions.
    } catch(error) {
      status.className = 'form-status error';
      status.textContent = 'We could not confirm your request. Your details are still here. Please try again, or email hello@sayantannandi.com.';
      button.disabled = false; button.textContent = oldText; form.dataset.sending = 'false';
    }
  });
}
export function downloadText(filename, text) {
  const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url),1000);
}
const brief = document.querySelector('#leadership-brief');
if(brief) {
  document.querySelector('#download-brief').addEventListener('click', () => {
    const entries = [...brief.querySelectorAll('textarea')].map(input => `${input.dataset.heading}\n${input.value.trim() || '[Add your notes here]'}\n`);
    downloadText('My_One_Page_Leadership_Brief.txt', 'ONE-PAGE LEADERSHIP BRIEF\nThe Step Up to Senior Leadership | Sayantan Nandi\n\n' + entries.join('\n') + '\nPractice resource: https://sayantannandi.com/step-up/sample\n');
    document.querySelector('#brief-status').textContent = 'Your brief has been downloaded. Keep the first draft and compare it with your next version.';
  });
  document.querySelector('#print-brief').addEventListener('click', () => window.print());
}
