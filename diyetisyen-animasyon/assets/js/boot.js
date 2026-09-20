/* Runs before first paint: sets theme, language and the cinematic layer so the page never flashes. */
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

  /* Açılış jeneriği: yalnızca ana sayfada, oturumda bir kez ve hareket azaltma
     kapalıyken. Sınıfı burada ekliyoruz ki perde ilk boyamada yerinde olsun.
     motion.js herhangi bir sebeple çalışmazsa 5 saniye sonra kendi kendine açılır. */
  var wantsMotion = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var seen = false;
  try { seen = !!sessionStorage.getItem('mizan-intro-seen'); } catch (e) {}
  if (wantsMotion && !seen && d.getAttribute('data-page') === 'home') {
    d.classList.add('film-boot', 'film-locked');
    setTimeout(function () {
      if (!d.classList.contains('film-on')) {
        d.classList.remove('film-boot', 'film-locked');
        d.classList.add('film-intro-done');
      }
    }, 5000);
  } else {
    d.classList.add('film-intro-done');
  }
})();
