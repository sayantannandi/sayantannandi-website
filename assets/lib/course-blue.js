(() => {
  const carousel = document.querySelector('.course-carousel');
  const slides = [...carousel.querySelectorAll('.course-slide')];
  const dots = [...carousel.querySelectorAll('[data-slide]')];
  const pause = document.getElementById('carousel-pause');
  const count = document.getElementById('carousel-count');
  const status = document.getElementById('carousel-status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, paused = motion.matches, hovered = false, visible = true, timer;
  function schedule() {
    clearTimeout(timer);
    if (!paused && !hovered && visible && !document.hidden && !carousel.contains(document.activeElement)) {
      timer = setTimeout(() => show(index + 1), 8000);
    }
  }
  function show(next, manual = false) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
    count.textContent = String(index + 1).padStart(2, '0') + ' / 04';
    if (manual) status.textContent = 'Screen ' + (index + 1) + ' of 4';
    schedule();
  }
  function updatePause() {
    pause.textContent = paused ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-label', paused ? 'Start automatic slideshow' : 'Pause automatic slideshow');
    pause.setAttribute('aria-pressed', String(paused));
    schedule();
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i, true)));
  document.getElementById('carousel-prev').addEventListener('click', () => show(index - 1, true));
  document.getElementById('carousel-next').addEventListener('click', () => show(index + 1, true));
  pause.addEventListener('click', () => { paused = !paused; updatePause(); });
  carousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  carousel.addEventListener('focusin', schedule);
  carousel.addEventListener('focusout', () => { queueMicrotask(schedule); });
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault(); show(index + (e.key === 'ArrowRight' ? 1 : -1), true);
    }
  });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => { if (motion.matches) { paused = true; updatePause(); } });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, { threshold: .2 }).observe(carousel);
  }
  updatePause();
  const early = Date.now() < Date.parse('2026-11-29T00:00:00+05:30');
  document.querySelectorAll('[data-cohort-price]').forEach(e => { e.textContent = early ? '₹17,499' : '₹19,999'; });
  document.querySelectorAll('[data-cohort-note]').forEach(e => { e.textContent = early ? 'Early-bird until 28 November · Then ₹19,999' : 'One payment · Regular price'; });
  document.querySelectorAll('.kit img').forEach(img => {
    img.tabIndex = 0; img.setAttribute('role', 'button'); img.setAttribute('aria-label', 'Enlarge ' + img.alt);
    const open = () => {
      document.getElementById('largeImage').src = img.src; document.getElementById('largeImage').alt = img.alt;
      document.getElementById('lightbox').showModal();
    };
    img.onclick = open;
    img.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
  });
  document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));
})();
