// Proposed homepage interactions: ladder, Time Equation circle, optionality sliders.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Ladder: one rung selected at a time.
$$('.hv-rung').forEach((b) => b.addEventListener('click', () => {
  $$('.hv-rung').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  $('#hv-rung-kicker').textContent = `Rung ${+b.dataset.rung + 1} · ${$('b', b).textContent}`;
  $('#hv-rung-does').textContent = b.dataset.does;
  $('#hv-rung-asks').textContent = b.dataset.asks;
  const n = +b.dataset.rung, link = $('#hv-rung-link');
  const checks = ['/tests/senior-level-judgment', '/tests/leadership-visibility', '/tests/business-leadership'];
  if (link) {
    if (n >= 3) { link.href = checks[n - 3]; link.textContent = `Take the Rung ${n + 1} check ↗`; }
    else { link.href = '#checks'; link.textContent = 'The checks start at Rung 4 ↓'; }
  }
}));

// Circle: the half in view lights up; tapping a node explains it.
const fig = $('.hv-circle');
const setMode = (mode) => { if (fig) fig.dataset.mode = mode; };
function showNode(key) {
  const info = $(`[data-node-info="${key}"]`);
  if (!info) return;
  $$('.hv-node').forEach((n) => n.classList.toggle('is-active', n.dataset.node === key));
  $('#hv-node-kicker').textContent = info.dataset.label;
  $('#hv-node-text').textContent = info.textContent;
}
$$('.hv-node').forEach((n) => {
  n.addEventListener('click', () => showNode(n.dataset.node));
  n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showNode(n.dataset.node); } });
});
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setMode(e.target.dataset.mode); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  $$('.hv-panel').forEach((p) => io.observe(p));
}

// Optionality: multiplication, not addition.
const scenarios = [
  ['Start by making the picture clearer.', 'Both sides are still developing. Understand your commitments, then pick one skill or one alternative to work on.'],
  ['Some room to explore, with a skill to build.', 'A little flexibility gives you time to deepen a skill that pays at the next level.'],
  ['You have room to invest in your next skill.', 'Your room to move lets you take time to learn. The question is what you want to get better at.'],
  ['Your skills are growing. Your choices still feel tight.', 'You are getting more valuable at work while commitments keep the next salary important.'],
  ['You’re building room to choose.', 'Your skills and your alternatives are growing together. Pick the next step that makes both a little stronger.'],
  ['You can test where your skills fit best.', 'More room makes it easier to try another role, build a skill or choose a different pace.'],
  ['The Trapped Earner: valuable at work, tied to the next salary.', 'High Earning Power, low Exit Power. Good income, little room to move. A bigger title alone won’t change that.'],
  ['Your options are becoming real.', 'Strong skills and some room to move. You can have a more deliberate conversation about your next role.'],
  ['You have real say over what comes next.', 'Climb, build or slow down. Each one can be a choice, not a reaction.'],
];
const earnLabels = ['Building', 'Developing', 'Established'];
const exitLabels = ['Limited room', 'Developing', 'More room'];
function updateLab() {
  const e = $('#hv-earn'), x = $('#hv-exit');
  if (!e || !x) return;
  const ev = +e.value, xv = +x.value;
  $('#hv-earn-out').textContent = earnLabels[ev];
  $('#hv-exit-out').textContent = exitLabels[xv];
  e.setAttribute('aria-valuetext', earnLabels[ev]);
  x.setAttribute('aria-valuetext', exitLabels[xv]);
  const [title, copy] = scenarios[ev * 3 + xv];
  $('#hv-result-title').textContent = title;
  $('#hv-result-copy').textContent = copy;
  // Multiply (1..3 × 1..3) so a zero-ish side drags the whole result down.
  $('#hv-meter-fill').style.width = `${((ev + 1) * (xv + 1)) / 9 * 100}%`;
}
$$('#hv-earn,#hv-exit').forEach((i) => i.addEventListener('input', updateLab));
updateLab();

// Review-room quotes: click through, or let them rotate (paused on hover/focus, off for reduced motion).
const quotes = $$('.hv-quote');
let qi = 0;
function showQuote(n) {
  qi = (n + quotes.length) % quotes.length;
  quotes.forEach((q, i) => { q.hidden = i !== qi; });
  $$('.hv-dot').forEach((d, i) => d.setAttribute('aria-pressed', String(i === qi)));
  const c = $('#hv-quote-n'); if (c) c.textContent = qi + 1;
}
$$('.hv-dot').forEach((d) => d.addEventListener('click', () => { showQuote(+d.dataset.go); stop(); }));
$('[data-next]')?.addEventListener('click', () => { showQuote(qi + 1); stop(); });
let timer = null;
const box = $('.hv-verdicts');
function start() { if (!timer && quotes.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => showQuote(qi + 1), 7000); }
function stop() { clearInterval(timer); timer = null; }
box?.addEventListener('mouseenter', stop); box?.addEventListener('mouseleave', start);
box?.addEventListener('focusin', stop);
start();
