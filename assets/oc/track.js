// Counts which home-page links people click, so we can see whether the work or the money half pulls.
// Only sends if Google Analytics has loaded, which happens after the visitor accepts cookies.
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('[data-track]');
  if (a && window.gtag) window.gtag('event', 'oc_click', { target: a.getAttribute('data-track'), page: location.pathname });
});
