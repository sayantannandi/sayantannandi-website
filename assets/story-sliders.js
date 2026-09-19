// Manual story navigation. With JavaScript unavailable, every story remains readable.
for (const slider of document.querySelectorAll('[data-story-slider]')) {
  const slides = [...slider.querySelectorAll('[data-story-slide]')];
  const controls = slider.querySelector('[data-story-controls]');
  const status = slider.querySelector('[data-story-status]');
  if (slides.length < 2 || !controls || !status) continue;
  let current = 0;
  const show = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    status.textContent = `${current + 1} of ${slides.length}`;
  };
  slider.querySelector('[data-story-prev]').addEventListener('click', () => show(current - 1));
  slider.querySelector('[data-story-next]').addEventListener('click', () => show(current + 1));
  controls.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault(); show(event.key === 'Home' ? 0 : slides.length - 1);
    }
  });
  // Swiping the image is an optional shortcut. Text remains selectable.
  let touchStart;
  slider.querySelectorAll('.story-image').forEach(image => {
    image.addEventListener('touchstart', event => {
      const touch = event.touches[0]; touchStart = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });
    image.addEventListener('touchend', event => {
      if (!touchStart) return;
      const touch = event.changedTouches[0], dx = touch.clientX - touchStart.x, dy = touch.clientY - touchStart.y;
      if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
      touchStart = undefined;
    }, { passive: true });
  });
  show(0); controls.hidden = false; slider.classList.add('is-enhanced');
}
