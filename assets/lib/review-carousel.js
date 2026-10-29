(() => {
  const carousel = document.querySelector('.course-carousel');
  const slides = [...carousel.querySelectorAll('.course-slide')];
  const dots = [...carousel.querySelectorAll('[data-slide]')];
  const pause = document.getElementById('carousel-pause');
  const count = document.getElementById('carousel-count');
  const status = document.getElementById('carousel-status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, paused = motion.matches, visible = true, resumeRequested = false, timer;
  function schedule() {
    clearTimeout(timer);
    if (!paused && visible && !document.hidden && (resumeRequested || !carousel.contains(document.activeElement))) {
      timer = setTimeout(() => show(index + 1), 2000);
    }
  }
  function show(next, manual = false) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
    count.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    if (manual) status.textContent = 'Screen ' + (index + 1) + ' of ' + slides.length;
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
  pause.addEventListener('click', () => { paused = !paused; resumeRequested = !paused; updatePause(); });
  carousel.addEventListener('focusin', () => { resumeRequested = false; schedule(); });
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
})();
