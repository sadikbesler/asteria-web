/* Runs before first paint: sets theme and language so the page never flashes. */
(function () {
  var d = document.documentElement;
  var theme = null;
  var lang = null;
  try { theme = localStorage.getItem('mizan-theme'); } catch (e) {}
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  try { lang = new URLSearchParams(location.search).get('lang') || localStorage.getItem('mizan-lang'); } catch (e) {}
  d.setAttribute('data-theme', theme);
  if (lang === 'en') { d.lang = 'en'; d.classList.add('lang-pending'); }
  d.className = d.className.replace('no-js', 'js');
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0B0C0A' : '#1E231D');
})();
