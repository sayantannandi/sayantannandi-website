// The announcement form is intentionally separate from newsletter automation.
const form = document.querySelector('[data-book-notify]');
form?.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity() || form.dataset.sending === 'true') return;
  const button = form.querySelector('[type="submit"]');
  const status = form.querySelector('.form-status');
  const oldLabel = button.textContent;
  form.dataset.sending = 'true';
  button.disabled = true;
  button.textContent = 'Sending…';
  status.className = 'form-status';
  status.textContent = '';
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error('Request was not accepted');
    status.className = 'form-status success';
    status.textContent = 'Thank you. Your request for the preorder announcement has been received. No order has been placed.';
    button.textContent = 'Request received';
    form.reset();
  } catch {
    status.className = 'form-status error';
    status.textContent = 'We could not confirm your request. Your details are still here. Please try again, or email hello@sayantannandi.com.';
    button.disabled = false;
    button.textContent = oldLabel;
    form.dataset.sending = 'false';
  }
});
