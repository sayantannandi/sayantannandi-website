(() => {
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
