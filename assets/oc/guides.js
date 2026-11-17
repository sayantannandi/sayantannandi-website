// Free guides on /learn. Name and email once, then all six guides download.
// The form posts as the guide the reader picked, so the existing guide email still goes out.
import {saveReviewForm} from '/assets/lib/site-live.js?v=4';
const KEY = 'oc-guides-unlocked';
const box = document.querySelector('[data-gunlock]');
const form = box && box.querySelector('form');
const cards = [...document.querySelectorAll('[data-guide]')];
const pdf = slug => '/assets/downloads/guides/' + encodeURIComponent(slug) + '.pdf';
const remembered = () => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } };

function unlock() {
  for (const card of cards) {
    const old = card.querySelector('.gpick');
    const a = document.createElement('a');
    a.className = 'gpick'; a.href = pdf(card.dataset.guide); a.setAttribute('download', ''); a.textContent = 'Download the PDF';
    old.replaceWith(a);
  }
  box.querySelector('[data-gform]').hidden = true;
  box.querySelector('[data-gdone]').hidden = false;
}

function pick(card) {
  const slug = card.dataset.guide, title = card.querySelector('h3').textContent;
  for (const c of cards) { c.classList.toggle('picked', c === card); c.querySelector('.gpick')?.classList.toggle('picked', c === card); }
  for (const [n, v] of [['form-name', 'sn-guide-' + slug], ['sn-form', 'sn-guide-' + slug], ['guide-id', slug]]) form.elements.namedItem(n).value = v;
  box.querySelector('.picked-note').textContent = 'You picked: ' + title + '. The other five unlock too.';
  box.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
  setTimeout(() => form.elements.namedItem('name').focus({preventScroll: true}), 450);
}

if (box && form) {
  if (remembered()) unlock();
  for (const card of cards) card.querySelector('.gpick').addEventListener('click', e => { if (e.currentTarget.tagName === 'BUTTON') pick(card); });
  let sending = false;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (sending) return;
    const name = form.elements.namedItem('name');
    name.setCustomValidity(name.value.trim() ? '' : 'Please enter your first name.');
    if (!form.reportValidity()) return;
    const button = form.querySelector('[type=submit]'), status = form.querySelector('.status'), label = button.textContent;
    const consent = form.elements.namedItem('newsletter-consent').checked;
    sending = true; button.disabled = true; button.textContent = 'Unlocking…'; status.textContent = '';
    try {
      await saveReviewForm(form);
      try { localStorage.setItem(KEY, '1'); } catch (err) {}
      box.querySelector('.gsub').textContent = consent ? 'You are also signed up for The Optional Career. Look for a confirmation email.' : 'You are not signed up for the weekly letter.';
      unlock();
      box.querySelector('[data-gdone] h3').focus({preventScroll: true});
    } catch (err) {
      status.textContent = 'We could not save your details. Please check your connection and try again. Your details are still here.';
      button.disabled = false; button.textContent = label;
    } finally { sending = false; }
  });
  form.elements.namedItem('name').addEventListener('input', e => e.target.setCustomValidity(''));
}
