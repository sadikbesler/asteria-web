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

  /* Gezegen yükleyicisi: ana sayfada, hero videosu sarılmaya hazır olana
     kadar sayfayı örter. Hareket azaltma açıksa, derin bağlantıyla
     (#randevu gibi) gelindiyse ya da bu oturumda video zaten indiyse çıkmaz. Sınıfları
     burada ekliyoruz ki perde ilk boyamada yerinde olsun. motion.js herhangi
     bir sebeple devralmazsa 5 saniye sonra kendi kendine kalkar. */
  var wantsMotion = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  if (wantsMotion && d.getAttribute('data-page') === 'home') {
    var seen = false;
    try { seen = !!sessionStorage.getItem('mizan-planet-seen'); } catch (e) {}
    var deep = location.hash.length > 1 && location.hash !== '#top';
    d.classList.add('planet');
    if (!seen && !deep) d.classList.add('planet-boot', 'film-locked');
    setTimeout(function () {
      if (!d.classList.contains('film-on')) d.classList.remove('planet', 'planet-boot', 'film-locked');
    }, 5000);
  }
})();
