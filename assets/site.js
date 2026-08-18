/* sayantannandi.com — interactive pieces */

(function () {
  'use strict';


  /* ---------- Mobile navigation ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.getElementById('site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      siteNav.classList.toggle('is-open', !open);
    });
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('is-open');
      });
    });
  }

  /* ---------- Runway strip (home page hero) ---------- */
  var spend = document.getElementById('rw-spend');
  var access = document.getElementById('rw-access');
  var out = document.getElementById('rw-out');
  var read = document.getElementById('rw-read');

  function runwayRead(months) {
    if (months === null) return 'Fill in both boxes. Nothing is stored or sent.';
    if (months < 3) return 'Under three months. At this level you accept what you are offered, because declining is not affordable.';
    if (months < 6) return 'Three to six months. You could survive a layoff. You could not cause one.';
    if (months < 12) return 'Six to twelve months. You can say no once. People tend to notice when someone crosses this line.';
    if (months < 24) return 'Twelve to twenty-four months. Enough to be honest in a room, and to take a role that pays less but goes further.';
    return 'Over two years. Enough to change direction entirely. Retrain, build something, or stop for a while.';
  }

  function calcRunway() {
    var s = parseFloat(spend.value);
    var a = parseFloat(access.value);
    if (!s || s <= 0 || !a || a < 0) {
      out.textContent = '—';
      read.textContent = runwayRead(null);
      return;
    }
    var months = a / s;
    out.textContent = months >= 10 ? Math.round(months) : months.toFixed(1);
    read.textContent = runwayRead(months);
  }

  if (spend && access && out) {
    [spend, access].forEach(function (el) { el.addEventListener('input', calcRunway); });
    calcRunway();
  }

  /* ---------- Scored diagnostics ---------- */
  /* Any form with [data-score] tallies its radio values out of a max. */

  document.querySelectorAll('[data-score]').forEach(function (root) {
    var max = parseInt(root.getAttribute('data-score-max'), 10) || 20;
    var tone = root.getAttribute('data-score-tone') || 'exit';
    var numEl = root.querySelector('[data-score-num]');
    var meterEl = root.querySelector('[data-score-meter]');
    var readEl = root.querySelector('[data-score-read]');
    var gateEl = root.querySelector('[data-score-gate]');
    var hidden = root.querySelector('input[name="score"]');
    var bands = [];

    root.querySelectorAll('[data-band]').forEach(function (b) {
      bands.push({ min: parseFloat(b.getAttribute('data-band')), text: b.textContent.trim() });
    });
    bands.sort(function (x, y) { return y.min - x.min; });

    // Build meter segments
    if (meterEl && !meterEl.children.length) {
      for (var i = 0; i < 10; i++) {
        var seg = document.createElement('span');
        seg.className = 'meter__seg';
        meterEl.appendChild(seg);
      }
    }

    function tally() {
      var total = 0;
      var answered = 0;
      var groups = {};
      root.querySelectorAll('input[type="radio"]').forEach(function (r) { groups[r.name] = true; });
      Object.keys(groups).forEach(function (name) {
        var picked = root.querySelector('input[name="' + name + '"]:checked');
        if (picked) { total += parseFloat(picked.value); answered++; }
      });
      var groupCount = Object.keys(groups).length;
      var complete = answered === groupCount && groupCount > 0;

      var scaled = Math.round((total / max) * 100) / 10; // out of 10, one decimal
      if (numEl) numEl.textContent = complete ? scaled.toFixed(1) : '—';
      if (hidden) hidden.value = complete ? scaled.toFixed(1) : '';

      if (meterEl) {
        var lit = complete ? Math.max(1, Math.round(scaled)) : 0;
        Array.prototype.forEach.call(meterEl.children, function (seg, idx) {
          seg.className = 'meter__seg' + (idx < lit ? (tone === 'earning' ? ' is-on-earning' : ' is-on') : '');
        });
      }

      if (readEl) {
        if (!complete) {
          readEl.textContent = 'Answer every question to see your reading. ' +
            (groupCount - answered) + ' left.';
        } else {
          var band = bands.find(function (b) { return scaled >= b.min; });
          readEl.textContent = band ? band.text : '';
        }
      }

      if (gateEl) gateEl.classList.toggle('hide', !complete);
    }

    root.addEventListener('change', tally);
    tally();
  });

  /* ---------- Current page marker ---------- */
  var path = location.pathname.replace(/index\.html$/, '').replace(/\.html$/, '');
  document.querySelectorAll('.nav a').forEach(function (a) {
    var href = a.getAttribute('href').replace(/index\.html$/, '').replace(/\.html$/, '');
    if (href === path || (href === '/' && path === '/')) a.setAttribute('aria-current', 'page');
  });
})();
