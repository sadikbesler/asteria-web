/* Runs before first paint: sets theme and language so the page never flashes. */
(function () {
  var d = document.documentElement;
  var theme = null;
  var lang = null;
  /* Dark is the house look. The light theme is opt-in and remembered. */
  try { theme = localStorage.getItem('neva-theme'); } catch (e) {}
  if (theme !== 'light' && theme !== 'dark') theme = 'dark';
  try { lang = new URLSearchParams(location.search).get('lang') || localStorage.getItem('neva-lang'); } catch (e) {}
  d.setAttribute('data-theme', theme);
  if (lang === 'en') { d.lang = 'en'; d.classList.add('lang-pending'); }
  d.className = d.className.replace('no-js', 'js');
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#050505' : '#F5F5F7');
})();
