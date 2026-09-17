/* Runs before first paint so the page never flashes the wrong theme. */
(function () {
  var d = document.documentElement;
  var theme = null;
  /* Dark is the house look. The light theme is opt-in and remembered. */
  try { theme = localStorage.getItem('mine-theme'); } catch (e) {}
  if (theme !== 'light' && theme !== 'dark') theme = 'dark';
  d.setAttribute('data-theme', theme);
  d.className = d.className.replace('no-js', 'js');
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#050505' : '#F5F5F7');
})();
