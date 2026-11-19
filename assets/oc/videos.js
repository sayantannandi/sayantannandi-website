// Click a video thumbnail to play it here. Without JavaScript the link opens YouTube.
document.addEventListener('click', function (e) {
  var a = e.target.closest('a.vplay');
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
  e.preventDefault();
  var f = document.createElement('iframe');
  f.src = 'https://www.youtube-nocookie.com/embed/' + a.dataset.yt + '?autoplay=1&rel=0';
  f.title = a.dataset.title || 'Video';
  f.allow = 'autoplay; encrypted-media; picture-in-picture';
  f.allowFullscreen = true;
  f.className = 'vframe';
  a.replaceWith(f);
});
