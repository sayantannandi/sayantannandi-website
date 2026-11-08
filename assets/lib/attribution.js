/* Where visitors came from, saved with every form. Optional Google Analytics after consent. */
(function () {
  'use strict';
  var KEY = 'sn_attr', CONSENT = 'sn_analytics', DAYS = 90;
  var FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'landing_page', 'referrer'];
  function clean(v, max) { return String(v || '').trim().slice(0, max || 100).replace(/[^\w\-.~:/@+ ]/g, ''); }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function write(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // 1. Work out this visit's source. A tagged link wins; otherwise the referring site.
  var q = new URLSearchParams(location.search);
  var now = Date.now(), visit = null;
  if (q.get('utm_source')) {
    visit = { utm_source: clean(q.get('utm_source')), utm_medium: clean(q.get('utm_medium')), utm_campaign: clean(q.get('utm_campaign')) };
  } else {
    var ref = '';
    try { ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''; } catch (e) {}
    if (ref && ref !== location.hostname.replace(/^www\./, '')) {
      var host = ref.replace(/^(m|l|lm)\./, '');
      var known = { 'lnkd.in': 'linkedin', 'linkedin.com': 'linkedin', 'youtube.com': 'youtube', 'youtu.be': 'youtube', 'instagram.com': 'instagram', 'google.com': 'google', 't.co': 'x', 'x.com': 'x', 'facebook.com': 'facebook' };
      visit = { utm_source: known[host] || clean(host), utm_medium: 'referral', utm_campaign: '' };
    }
  }
  var saved = null;
  try { saved = JSON.parse(read(KEY) || 'null'); } catch (e) {}
  if (saved && now - saved.at > DAYS * 864e5) saved = null;
  // Keep the latest tagged visit. An untagged referral or direct visit never overwrites a tagged one.
  if (visit && (!saved || q.get('utm_source') || saved.utm_medium === 'referral')) {
    saved = { utm_source: visit.utm_source, utm_medium: visit.utm_medium, utm_campaign: visit.utm_campaign,
      landing_page: clean(location.pathname, 200), referrer: visit.utm_medium === 'referral' ? visit.utm_source : '', at: now };
    write(KEY, JSON.stringify(saved));
  }
  var attr = saved || { utm_source: 'direct', utm_medium: 'none', utm_campaign: '', landing_page: clean(location.pathname, 200), referrer: '' };

  // 2. Put it into the hidden fields of every form, just before it is sent.
  function fill(form) {
    FIELDS.forEach(function (name) {
      var input = form.querySelector('input[type="hidden"][name="' + name + '"]');
      if (input) input.value = attr[name] || '';
    });
  }
  function fillAll() { document.querySelectorAll('form').forEach(fill); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fillAll); else fillAll();
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    fill(form);
    var name = form.getAttribute('name');
    if (name && window.gtag) window.gtag('event', 'generate_lead', { form_name: name });
  }, true);

  // 3. Google Analytics, only after the visitor agrees.
  var id = window.SN_GA_ID;
  if (!id || !/^G-[A-Z0-9]{4,}$/.test(id)) return;
  function loadGA() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // If they agreed on a later page, carry the saved source so GA credits the right post.
    var cfg = {};
    if (!q.get('utm_source') && attr.utm_medium && attr.utm_medium !== 'referral' && attr.utm_medium !== 'none') {
      var u = new URL(location.href);
      u.searchParams.set('utm_source', attr.utm_source); u.searchParams.set('utm_medium', attr.utm_medium);
      if (attr.utm_campaign) u.searchParams.set('utm_campaign', attr.utm_campaign);
      cfg.page_location = u.toString();
    }
    window.gtag('config', id, cfg);
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
  }
  var choice = read(CONSENT);
  if (choice === 'yes') { loadGA(); return; }
  if (choice === 'no') return;
  function banner() {
    var css = document.createElement('style');
    css.textContent = '.sn-consent{position:fixed;left:max(16px,env(safe-area-inset-left,0px));right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:9999;max-width:560px;margin:0 auto;background:#102c50;color:#fff;border-radius:12px;padding:16px 18px;box-shadow:0 8px 28px rgba(0,0,0,.25);font:15px/1.5 inherit}' +
      '.sn-consent p{margin:0 0 12px;color:#fff}.sn-consent a{color:#a7edf5}.sn-consent div{display:flex;gap:10px;flex-wrap:wrap}' +
      '.sn-consent button{font:inherit;font-weight:600;border-radius:8px;padding:9px 16px;cursor:pointer;border:1px solid #a7edf5}' +
      '.sn-consent .yes{background:#a7edf5;color:#102c50}.sn-consent .no{background:transparent;color:#fff}' +
      '.sn-consent button:focus-visible{outline:3px solid #fff;outline-offset:2px}';
    document.head.appendChild(css);
    var box = document.createElement('div');
    box.className = 'sn-consent'; box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Analytics choice');
    box.innerHTML = '<p>Can I count your visit with Google Analytics? It shows me which pages help people. No ads, and your answers to the checks are never included. <a href="/privacy#analytics">Details</a></p>' +
      '<div><button type="button" class="yes">Allow</button><button type="button" class="no">No thanks</button></div>';
    document.body.appendChild(box);
    box.querySelector('.yes').addEventListener('click', function () { write(CONSENT, 'yes'); box.remove(); loadGA(); });
    box.querySelector('.no').addEventListener('click', function () { write(CONSENT, 'no'); box.remove(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner); else banner();
})();
