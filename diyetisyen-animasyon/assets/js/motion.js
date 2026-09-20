/* ==========================================================================
   Mizan Beslenme — sinematik katman (motion.js)

   Sayfadaki hiçbir özelliği değiştirmez; üstüne bir "film" katmanı ekler:
   açılış jeneriği, sabit bölüm arayüzü, yumuşak kaydırma, sahne sahne
   açılan yazı ve görseller, kaydırma hızına tepki veren şeritler.

   Kurallar:
   - GSAP/Lenis yüklenmezse ya da kullanıcı "hareketi azalt" derse bu dosya
     hiçbir şey yapmadan çıkar; sayfa orijinal hâliyle çalışmaya devam eder.
   - Başlangıç durumları CSS'te değil burada kurulur; böylece JavaScript
     çalışmazsa metinler görünmez kalmaz.
   - Dil değiştiğinde bölünmüş yazılar geri alınıp yeniden kurulur.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function unlockIntro() {
    root.classList.remove('film-boot', 'film-locked');
    root.classList.add('film-intro-done');
    try { sessionStorage.setItem('mizan-intro-seen', '1'); } catch (e) {}
  }

  if (reduce || !window.gsap || !window.ScrollTrigger) { unlockIntro(); return; }

  gsap.registerPlugin(ScrollTrigger);
  var hasSplit = !!window.SplitText;
  if (hasSplit) gsap.registerPlugin(SplitText);
  var hasFlip = !!window.Flip;
  if (hasFlip) gsap.registerPlugin(Flip);
  if (window.CustomEase) {
    gsap.registerPlugin(CustomEase);
    CustomEase.create('film', '0.16, 1, 0.3, 1');
  }
  var EASE = window.CustomEase ? 'film' : 'power4.out';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var M = window.Mizan || null;
  var isHome = root.getAttribute('data-page') === 'home';
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var clamp = gsap.utils.clamp;

  root.classList.add('film-on');
  /* site.js'in kendi açılış animasyonunu devralıyoruz: artık GSAP yönetiyor */
  root.classList.remove('reveal-on');

  function t(key, fallback) {
    if (M && M.t) {
      var v = M.t(key);
      if (v !== key) return v;
    }
    return fallback;
  }

  /* ======================================================================
     1. Yumuşak kaydırma (Lenis)
     ====================================================================== */
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({
      duration: 1.05,
      easing: function (x) { return Math.min(1, 1.001 - Math.pow(2, -10 * x)); },
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.7
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* Lenis, CSS'teki scroll-padding-top değerini kendisi hesaba katar;
     ayrıca başlık payı eklemeye gerek yok. */
  function scrollTo(target) {
    if (lenis) { lenis.scrollTo(target, { duration: 1.15 }); return; }
    if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
    else if (target && target.scrollIntoView) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ======================================================================
     2. Film arayüzü: gren dokusu, imleç, bölüm cetveli
     ====================================================================== */
  var grain = document.createElement('div');
  grain.className = 'film-grain';
  grain.setAttribute('aria-hidden', 'true');
  document.body.appendChild(grain);

  var CHAPTERS = [
    { id: 'top', key: 'film.ch1', tr: 'Açılış' },
    { id: 'hizmetler', key: 'nav.services', tr: 'Hizmetler' },
    { id: 'yaklasim', key: 'film.ch3', tr: 'Yaklaşım' },
    { id: 'manifesto', key: 'scene.label', tr: 'Yöntem' },
    { id: 'uzmanlar', key: 'nav.team', tr: 'Uzmanlar' },
    { id: 'araclar', key: 'nav.tools', tr: 'Araçlar' },
    { id: 'program', key: 'nav.program', tr: 'Örnek program' },
    { id: 'tarifler', key: 'nav.recipes', tr: 'Tarifler' },
    { id: 'ucretler', key: 'nav.pricing', tr: 'Ücretler' },
    { id: 'randevu', key: 'nav.book', tr: 'Randevu' },
    { id: 'blog', key: 'nav.blog', tr: 'Blog' },
    { id: 'sss', key: 'nav.faq', tr: 'SSS' },
    { id: 'iletisim', key: 'nav.contact', tr: 'İletişim' }
  ].filter(function (c) { return document.getElementById(c.id); });

  var hud = document.createElement('div');
  hud.className = 'film-hud';
  var chapterLinks = [];
  var ui = {};

  (function buildHud() {
    var bar = document.createElement('div');
    bar.className = 'film-bar';
    bar.setAttribute('aria-hidden', 'true');
    ui.barFill = document.createElement('i');
    bar.appendChild(ui.barFill);
    hud.appendChild(bar);

    if (CHAPTERS.length) {
      ui.nav = document.createElement('nav');
      ui.nav.className = 'film-chapters';
      ui.nav.setAttribute('aria-label', t('film.chapters', 'Bölümler'));
      CHAPTERS.forEach(function (c, i) {
        var a = document.createElement('a');
        a.href = '#' + c.id;
        var num = document.createElement('b');
        num.textContent = (i + 1 < 10 ? '0' : '') + (i + 1);
        var line = document.createElement('i');
        var name = document.createElement('s');
        name.textContent = t(c.key, c.tr);
        a.append(num, line, name);
        a.chapter = c;
        ui.nav.appendChild(a);
        chapterLinks.push(a);
      });
      hud.appendChild(ui.nav);
    }

    var foot = document.createElement('div');
    foot.className = 'film-foot';
    if (CHAPTERS.length) {
      var slate = document.createElement('p');
      slate.className = 'film-slate';
      slate.setAttribute('aria-hidden', 'true');
      ui.slateNum = document.createElement('b');
      ui.slateNum.textContent = '01';
      ui.slateName = document.createElement('span');
      ui.slateName.textContent = t(CHAPTERS[0].key, CHAPTERS[0].tr);
      slate.append(ui.slateNum, ui.slateName);
      foot.appendChild(slate);
    }
    /* Kendiliğinden dönen hareketi durdurma düğmesi (WCAG 2.2.2) */
    ui.pause = document.createElement('button');
    ui.pause.type = 'button';
    ui.pause.className = 'film-pause';
    ui.pause.setAttribute('aria-pressed', 'false');
    ui.pause.innerHTML = '<svg class="i-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>' +
      '<svg class="i-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';
    foot.appendChild(ui.pause);
    hud.appendChild(foot);
    ui.foot = foot;

    var clock = document.createElement('p');
    clock.className = 'film-clock';
    clock.setAttribute('aria-hidden', 'true');
    ui.clockCity = document.createElement('span');
    ui.clockCity.textContent = t('film.city', 'İstanbul');
    ui.clockTime = document.createElement('b');
    ui.clockTime.textContent = '--:--';
    clock.append(ui.clockCity, ui.clockTime);
    hud.appendChild(clock);
    ui.clock = clock;

    if (isHome) {
      ui.cue = document.createElement('p');
      ui.cue.className = 'film-cue';
      ui.cue.setAttribute('aria-hidden', 'true');
      ui.cueText = document.createElement('span');
      ui.cueText.textContent = t('film.scroll', 'Kaydırın');
      ui.cue.append(ui.cueText, document.createElement('i'));
      hud.appendChild(ui.cue);
    }

    document.body.appendChild(hud);
  })();

  /* --- Kendiliğinden dönen hareketi durdurma --- */
  var loops = [];          /* şerit tweenleri buraya kaydolur */
  var paused = false;
  try { paused = (M && M.read ? M.read('mizan-motion') : localStorage.getItem('mizan-motion')) === 'off'; } catch (e) {}

  function applyPause() {
    root.classList.toggle('film-paused', paused);
    loops.forEach(function (tw) { paused ? tw.pause() : tw.resume(); });
    ui.pause.setAttribute('aria-pressed', String(paused));
    ui.pause.setAttribute('aria-label', t(paused ? 'film.play' : 'film.pause', paused ? 'Hareketi sürdür' : 'Hareketi duraklat'));
    ui.pause.title = ui.pause.getAttribute('aria-label');
  }
  ui.pause.addEventListener('click', function () {
    paused = !paused;
    try { (M && M.store ? M.store : localStorage.setItem.bind(localStorage))('mizan-motion', paused ? 'off' : 'on'); } catch (e) {}
    applyPause();
  });
  applyPause();

  /* Canlı saat — klinik saatini site.js'ten alır */
  (function liveClock() {
    function tick() {
      var now = M && M.time ? M.time.now() : null;
      var h, m;
      if (now) { h = Math.floor(now.minutes / 60); m = now.minutes % 60; }
      else { var d = new Date(); h = d.getHours(); m = d.getMinutes(); }
      ui.clockTime.textContent = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    }
    tick();
    setInterval(tick, 15000);
  })();

  /* ======================================================================
     3. Yazı motoru — satır maskeleri ve kelime açılışları
     ====================================================================== */
  var splits = [];
  var textTweens = [];
  var heroTitleTween = null;
  var introDone = !root.classList.contains('film-boot');

  function track(tw) { if (tw) textTweens.push(tw); return tw; }

  /* SplitText parçaları gizleyip üst ögeye `aria-label` koyar. Bu etiket
     başlıklarda geçerli, ama <p>/<span> gibi "generic" ögelerde yasak.
     Bu yüzden başlıkta hazır davranışı kullanıyor, diğerlerinde aria'ya
     hiç dokunmuyoruz: metin ekran okuyucuda sırayla okunmaya devam eder. */
  function splitOf(el, type, mask) {
    if (!hasSplit) return null;
    var opts = { type: type, aria: /^H[1-6]$/.test(el.tagName) ? 'auto' : 'none' };
    if (mask) { opts.mask = mask; opts.linesClass = 'split-line'; }
    var sp = new SplitText(el, opts);
    splits.push(sp);
    return sp;
  }

  /* Başlıklar: satır satır aşağıdan yukarı */
  function headingReveal(el, opts) {
    opts = opts || {};
    var s = splitOf(el, 'lines', 'lines');
    if (!s || !s.lines.length) {
      return track(gsap.from(el, {
        opacity: 0, y: 40, duration: 1, ease: EASE,
        paused: !!opts.paused,
        scrollTrigger: opts.noTrigger ? null : { trigger: el, start: 'top 88%', once: true }
      }));
    }
    /* Codrops KineticTypePageTransition: satırlar yandan savrularak,
       hafif ölçek değişimiyle ve tok bir eğriyle yerine oturur. */
    gsap.set(s.lines, { yPercent: 112, xPercent: 14 });
    gsap.set(el, { transformOrigin: '0% 100%' });
    if (!opts.paused) watchHidden(s.lines);
    var tl = gsap.timeline({
      paused: !!opts.paused,
      scrollTrigger: opts.noTrigger ? null : { trigger: el, start: 'top 88%', once: true }
    });
    tl.to(s.lines, {
      yPercent: 0,
      duration: 1.15,
      ease: EASE,
      stagger: 0.085
    }, 0)
      .to(s.lines, {
        xPercent: 0,
        duration: 1.4,
        ease: 'power4.out',
        stagger: 0.085
      }, 0)
      .fromTo(el, { scaleY: 1.14 }, { scaleY: 1, duration: 1.3, ease: EASE }, 0);
    return track(tl);
  }

  /* Spot yazılar: kelimeler sırayla belirir (Codrops ScrollBlurTypography) */
  function wordReveal(el, blur) {
    var s = splitOf(el, 'words');
    if (!s || !s.words.length) {
      return track(gsap.from(el, {
        opacity: 0, y: 24, duration: 0.9, ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }));
    }
    var from = { opacity: 0, yPercent: 38 };
    var to = { opacity: 1, yPercent: 0, duration: 0.85, ease: 'power2.out', stagger: 0.015 };
    if (blur) { from.filter = 'blur(7px)'; to.filter = 'blur(0px)'; }
    to.scrollTrigger = { trigger: el, start: 'top 90%', once: true };
    watchHidden(s.words);
    return track(gsap.fromTo(s.words, from, to));
  }

  /* Kaydırdıkça kelime kelime aydınlanan cümle (Codrops OnScrollTextHighlight) */
  function highlightReveal(el) {
    var sp = splitOf(el, 'words');
    if (!sp || !sp.words.length) return wordReveal(el, false);
    return track(gsap.fromTo(sp.words, { opacity: 0.2 }, {
      opacity: 1, ease: 'none', stagger: 0.4,
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: 0.4 }
    }));
  }

  function buildText() {
    $$('.h2, .scene-lines > span, .footer-about h2').forEach(function (el) {
      if (el.closest('.film-intro')) return;
      headingReveal(el);
    });
    $$('.lede').forEach(function (el) { wordReveal(el, false); });
    $$('.hero-lede').forEach(function (el) { wordReveal(el, true); });
    $$('.quote p, .sky-mid h2').forEach(function (el) { highlightReveal(el); });

    var ht = $('.hero-title');
    if (ht) {
      heroTitleTween = headingReveal(ht, { noTrigger: true, paused: !introDone });
    }
  }

  function destroyText() {
    textTweens.forEach(function (tw) {
      if (!tw) return;
      if (tw.scrollTrigger) tw.scrollTrigger.kill();
      tw.kill();
    });
    textTweens = [];
    heroTitleTween = null;
    guard = guard.filter(function (g) { return g.el.isConnected && !g.el.closest('.split-line') && !g.el.classList.contains('split-line'); });
    splits.forEach(function (s) { try { s.revert(); } catch (e) {} });
    splits = [];
  }


  /* ======================================================================
     Güvenlik ağı
     Bir bölüme derin bağlantıyla atlayıp yukarı kaydırıldığında ya da
     kaydırma tetikleyicisi atlandığında hiçbir şey görünmez kalmasın diye,
     ekranın üst yarısına gelmiş ama hâlâ gizli duran ögeleri açığa çıkarır.
     ====================================================================== */
  var guard = [];
  function watchHidden(targets) {
    var list = targets && targets.length !== undefined ? targets : [targets];
    Array.prototype.forEach.call(list, function (el) {
      if (el && el.nodeType === 1) guard.push({ el: el, hits: 0 });
    });
  }
  function stillHidden(el) {
    if (+gsap.getProperty(el, 'opacity') < 0.9) return true;
    if (Math.abs(+gsap.getProperty(el, 'yPercent') || 0) > 5) return true;
    if (Math.abs(+gsap.getProperty(el, 'xPercent') || 0) > 5) return true;
    var cp = gsap.getProperty(el, 'clipPath');
    if (cp && String(cp).indexOf('100%') > -1) return true;
    return false;
  }
  function safetySweep(force) {
    for (var i = guard.length - 1; i >= 0; i--) {
      var item = guard[i];
      var el = item.el;
      if (!el.isConnected) { guard.splice(i, 1); continue; }
      if (!stillHidden(el)) { guard.splice(i, 1); continue; }
      if (gsap.isTweening(el)) { item.hits = 0; continue; }
      var r = el.getBoundingClientRect();
      /* Tetikleyiciler ekranın %88'inde çalışır; buraya gelmişse görünmeli */
      if (r.top < window.innerHeight * 0.85) {
        if (!force && ++item.hits < 2) continue;
        gsap.set(el, {
          opacity: 1, x: 0, y: 0, xPercent: 0, yPercent: 0,
          scale: 1, rotate: 0, rotateX: 0, rotateY: 0, z: 0, clipPath: 'none'
        });
        guard.splice(i, 1);
      } else {
        item.hits = 0;
      }
    }
  }

  /* ======================================================================
     4. Sahneler
     ====================================================================== */
  var heroIntro = null;

  function heroScene() {
    var hero = $('.hero');
    if (!hero) return;
    var img = $('.hero-img', hero);
    var kicker = $('.hero-kicker', hero);
    var lede = $('.hero-lede', hero);
    var cta = $('.hero-cta', hero);
    var slot = $('.next-slot', hero);

    var media = $('[data-hero-media]', hero);
    var shade = $('.hero-shade', hero);

    heroIntro = gsap.timeline({ paused: true });

    /* Codrops FullImageReveal: görsel ortada küçük, köşeleri yuvarlatılmış
       bir kareden başlayıp ekranı kaplayacak şekilde büyür. */
    if (media) {
      heroIntro.fromTo(media,
        { clipPath: 'inset(30% 34% 30% 34% round 26px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.9, ease: EASE }, 0);
    }
    if (img) heroIntro.fromTo(img, { scale: 1.55 }, { scale: 1, duration: 2.5, ease: EASE }, 0);
    if (shade) heroIntro.fromTo(shade, { opacity: 0 }, { opacity: 1, duration: 1.4, ease: 'power2.inOut' }, 0.35);
    if (kicker) heroIntro.fromTo(kicker, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: EASE }, 0.55);
    [lede, cta, slot].forEach(function (el, i) {
      if (el) heroIntro.fromTo(el, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9, ease: EASE }, 0.95 + i * 0.09);
    });
    if (ui.cue) heroIntro.fromTo(ui.cue, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.5);

    /* Kaydırınca: fotoğraf yerinde kalır, içerik yukarı süzülür, sonraki
       bölüm hero'nun üstüne kayar (pinSpacing kapalı) */
    gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1
      }
    })
      .to($('.wrap', hero), { yPercent: -16, opacity: 0, ease: 'none' }, 0)
      .fromTo(media || img, { scale: 1 }, { scale: 1.08, ease: 'none' }, 0);

  }

  /* --- Rakam sayacı (motion-primitives "sliding number" fikri) --- */
  function counters() {
    $$('.facts-num').forEach(function (el) {
      var node = el.firstChild;
      if (!node || node.nodeType !== 3) return;
      var target = parseFloat(node.nodeValue);
      if (!isFinite(target)) return;
      var obj = { v: 0 };
      node.nodeValue = '0';
      gsap.to(obj, {
        v: target,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: function () { node.nodeValue = String(Math.round(obj.v)); },
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      });
    });
  }

  /* --- Genel açılış: başka bir koreografiye girmeyen [data-reveal] --- */
  var CLAIMED = '.hero, .scene, .film-intro, .services, .team, .plans, .faq-list, .road, .notes, .sky';
  var FRAMES = '.service-media, .person-media, .process-media, .program-media, .post-feature figure, .post-row figure, .recipe-card figure';
  /* Yazı motoru bunları zaten kendi açıyor; iki kez animasyon uygulanmasın */
  var TEXTS = '.h2, .hero-title, .lede, .quote p, .footer-about h2, .sky-mid h2';
  function reveals() {
    var els = $$('[data-reveal]').filter(function (el) {
      return !el.closest(CLAIMED) && !el.matches(CLAIMED) && !el.matches(FRAMES) && !el.matches(TEXTS);
    });
    if (!els.length) return;
    gsap.set(els, { opacity: 0, y: 56, rotateX: 9, transformPerspective: 1000, transformOrigin: '50% 100%' });
    watchHidden(els);
    var show = function (batch) {
      gsap.to(batch, {
        opacity: 1, y: 0, rotateX: 0,
        duration: 1.15, ease: EASE, stagger: 0.08, overwrite: 'auto'
      });
    };
    ScrollTrigger.batch(els, { start: 'top 93%', once: true, onEnter: show, onEnterBack: show });
  }

  /* --- Görsel maskeleri: fotoğraflar aşağıdan açılıp yerine oturur --- */
  function imageReveals(scope) {
    $$(FRAMES, scope).forEach(function (frame) {
      if (frame.dataset.filmImg) return;
      frame.dataset.filmImg = '1';
      var img = frame.querySelector('img');
      watchHidden(frame);
      var tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 93%', once: true } });
      tl.fromTo(frame, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: EASE }, 0);
      if (img) tl.fromTo(img, { scale: 1.26 }, { scale: 1, duration: 1.45, ease: EASE }, 0);
    });
  }

  /* --- Yavaş kayan arka katmanlar --- */
  function parallax() {
    [
      { sel: '.scene-media img', frame: '.scene-media', amount: 9, scale: 1 },
      { sel: '.sky-img', frame: '.sky', amount: 6, scale: 1.16 }
    ].forEach(function (l) {
      var el = $(l.sel);
      var frame = $(l.frame);
      if (!el || !frame) return;
      if (l.scale !== 1) gsap.set(el, { scale: l.scale });
      gsap.fromTo(el, { yPercent: -l.amount }, {
        yPercent: l.amount,
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.5 }
      });
    });
  }

  /* --- Fotoğraf kartları: dağınık gelip yerine oturur, sütunlar farklı
         hızda kayar (Codrops ElasticGridScroll) --- */
  function notesScene() {
    var notes = $$('.notes [data-note]');
    var panel = $('.notes-panel');
    if (!notes.length || !panel) return;

    gsap.set(notes, { opacity: 0, scale: 0.86, rotate: function (i) { return i % 2 ? -7 : 6; } });
    watchHidden(notes);
    gsap.to(notes, {
      opacity: 1, scale: 1, rotate: 0,
      duration: 1.2, ease: EASE, stagger: 0.07,
      scrollTrigger: { trigger: panel, start: 'top 80%', once: true }
    });

    var depths = [18, -11, 24, -15, 13, -20, 21];
    notes.forEach(function (n, i) {
      var d = depths[i % depths.length];
      gsap.fromTo(n, { y: -d }, {
        y: d, ease: 'none',
        scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      });
    });
  }

  /* --- Yöntem sahnesi: sabitlenir, satırlar sırayla belirir --- */
  function manifestoScene() {
    var scene = $('#manifesto');
    if (!scene) return;
    var lines = $$('[data-scene-line]', scene);
    var label = $('.scene-label', scene);
    var foot = $('.scene-foot', scene);
    if (!lines.length) return;

    gsap.set(lines, { opacity: 0.14 });
    if (label) gsap.set(label, { opacity: 0 });
    if (foot) gsap.set(foot, { opacity: 0, y: 24 });

    var layers = sceneLayers();

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: scene,
        start: 'top top',
        end: '+=170%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1
      }
    });
    if (label) tl.to(label, { opacity: 1, duration: 0.4 }, 0);
    lines.forEach(function (line, i) {
      tl.to(line, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.4 + i * 0.7);
    });
    /* Arka plan katmanları cümlelerle birlikte açılır (LayersAnimation) */
    if (layers) {
      layers.forEach(function (layer, i) {
        tl.to(layer, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 0.9, ease: 'power2.inOut'
        }, 0.9 + i * 1.2);
      });
    }
    if (foot) tl.to(foot, { opacity: 1, y: 0, duration: 0.7 }, 0.4 + lines.length * 0.7);
  }

  /* --- Uzmanlar: kartlar yığından ızgaraya geçer
         (Codrops OnScrollViewSwitch — GSAP Flip) --- */
  function teamScene() {
    var team = $('.team');
    var people = $$('.team .person');
    if (!team || !people.length) return;

    var wide = window.matchMedia('(min-width: 1100px)');
    if (!hasFlip || !wide.matches) {
      /* Dar ekranda ızgara zaten tek sütun: sade bir giriş yeter */
      gsap.set(people, { opacity: 0, y: 48 });
      watchHidden(people);
      gsap.to(people, {
        opacity: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.1,
        scrollTrigger: { trigger: team, start: 'top 84%', once: true }
      });
      return;
    }

    team.classList.add('is-stack');
    gsap.set(people, { opacity: 0 });
    watchHidden(people);

    ScrollTrigger.create({
      trigger: team,
      start: 'top 88%',
      once: true,
      onEnter: function () {
        gsap.to(people, { opacity: 1, duration: 0.5, ease: 'none', overwrite: 'auto' });
        /* Yığın hâli bir an görünsün, sonra ızgaraya açılsın */
        gsap.delayedCall(0.5, function () {
          var state = Flip.getState(people, { props: 'boxShadow' });
          team.classList.remove('is-stack');
          Flip.from(state, {
            duration: 1.15,
            ease: 'power3.inOut',
            scale: true,
            stagger: 0.07
          });
        });
      }
    });
  }

  /* --- Hizmetler: kartlar sırayla girer, geniş ekranda kamera yana kayar
         (Codrops OnScrollColumnsRows) --- */
  function servicesScene() {
    var section = $('#hizmetler');
    var strip = $('.services');
    var cards = $$('.services .service');
    if (!cards.length || !strip || !section) return;

    gsap.set(cards, { opacity: 0, y: 64, rotateX: 7 });
    watchHidden(cards);
    var showCards = function (batch) {
      gsap.to(batch, { opacity: 1, y: 0, rotateX: 0, duration: 1.15, ease: EASE, stagger: 0.09, overwrite: 'auto' });
    };
    ScrollTrigger.batch(cards, { start: 'top 92%', once: true, onEnter: showCards, onEnterBack: showCards });

    if (!gsap.matchMedia) return;

    gsap.matchMedia().add('(min-width: 1200px) and (prefers-reduced-motion: no-preference)', function () {
      section.classList.add('is-tracking');
      strip.classList.add('is-track');

      /* Ne kadarının geçtiğini gösteren cetvel */
      var rail = document.createElement('div');
      rail.className = 'track-rail';
      rail.setAttribute('aria-hidden', 'true');
      var railFill = document.createElement('i');
      rail.appendChild(railFill);
      strip.parentNode.insertBefore(rail, strip);

      function travel() {
        var pad = strip.parentElement.getBoundingClientRect().left;
        return Math.max(0, strip.scrollWidth - window.innerWidth + pad * 2);
      }

      var tw = gsap.to(strip, {
        x: function () { return -travel(); },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () { return '+=' + (travel() + window.innerHeight * 0.25); },
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            gsap.set(railFill, { xPercent: self.progress * (100 / 0.22 - 100) });
          }
        }
      });
      var st = tw.scrollTrigger;

      /* Klavyeyle gezinirken odaklanan kart ekrana getirilsin */
      function onFocus(e) {
        var card = e.target.closest ? e.target.closest('.service') : null;
        if (!card || !st) return;
        var i = cards.indexOf(card);
        if (i < 0) return;
        var p = cards.length > 1 ? i / (cards.length - 1) : 0;
        var y = st.start + (st.end - st.start) * p;
        if (Math.abs(window.scrollY - y) > 60) scrollTo(y);
      }
      section.addEventListener('focusin', onFocus);

      return function cleanup() {
        section.removeEventListener('focusin', onFocus);
        section.classList.remove('is-tracking');
        strip.classList.remove('is-track');
        rail.remove();
        gsap.set(strip, { clearProps: 'x' });
      };
    });
  }

  /* --- Yol haritası --- */
  function roadScene() {
    var road = $('.road');
    if (!road) return;
    var steps = $$('.step', road);
    gsap.set(steps, { opacity: 0, y: 28 });
    watchHidden(steps);
    gsap.to(steps, {
      opacity: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.14,
      scrollTrigger: { trigger: road, start: 'top 86%', once: true }
    });
    gsap.fromTo($$('.node', road), { scale: 0 }, {
      scale: 1, duration: 0.6, ease: 'back.out(2)', stagger: 0.14,
      scrollTrigger: { trigger: road, start: 'top 86%', once: true }
    });
  }

  /* --- Ücret kartları --- */
  function pricingScene() {
    var plans = $$('.plans .plan');
    if (!plans.length) return;
    gsap.set(plans, { opacity: 0, y: 56 });
    watchHidden(plans);
    gsap.to(plans, {
      opacity: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.1,
      scrollTrigger: { trigger: '.plans', start: 'top 88%', once: true }
    });
  }

  /* --- Sık sorulanlar --- */
  function faqScene() {
    var faqs = $$('.faq-list .faq');
    if (!faqs.length) return;
    gsap.set(faqs, { opacity: 0, x: 26 });
    watchHidden(faqs);
    var showFaq = function (batch) {
      gsap.to(batch, { opacity: 1, x: 0, duration: 0.85, ease: EASE, stagger: 0.06, overwrite: 'auto' });
    };
    ScrollTrigger.batch(faqs, { start: 'top 95%', once: true, onEnter: showFaq, onEnterBack: showFaq });
  }

  /* --- Devasa kelimeler: "afiyet olsun" ve "mizan" --- */
  function bigWords() {
    var sky = $('.sky-word p');
    if (sky) {
      gsap.fromTo(sky, { yPercent: 106 }, {
        yPercent: 0, duration: 1.4, ease: EASE,
        scrollTrigger: { trigger: '.sky', start: 'top 74%', once: true }
      });
      gsap.fromTo(sky, { xPercent: 3 }, {
        xPercent: -3, ease: 'none',
        scrollTrigger: { trigger: '.sky', start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    }
    var foot = $('.footer-word p');
    if (foot) {
      gsap.fromTo(foot, { yPercent: 106 }, {
        yPercent: 0, duration: 1.4, ease: EASE,
        scrollTrigger: { trigger: '.site-footer', start: 'top 84%', once: true }
      });
    }
  }


  /* --- Tarifler ve blog: kartlar farklı hızda akıp yerine oturur
         (Codrops TileScroll) --- */
  var tileTweens = [];
  function tileScroll(scope) {
    function line(el, index, amount, trigger) {
      var tw = gsap.fromTo(el,
        { y: index % 2 ? -amount : amount },
        {
          y: index % 2 ? amount : -amount,
          ease: 'none',
          scrollTrigger: { trigger: trigger, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
        });
      tileTweens.push(tw);
    }

    /* Tarif ızgarası: sütunlar birbirinin üzerinden akar */
    var grid = $('[data-recipes]', scope || document) || $('[data-recipes]');
    if (grid) {
      var cards = $$('.recipe-card', grid);
      if (cards.length > 2) {
        var firstTop = Math.round(cards[0].offsetTop);
        var cols = cards.filter(function (c) { return Math.round(c.offsetTop) === firstTop; }).length || 1;
        cards.forEach(function (card, i) {
          if (card.dataset.filmTile) return;
          card.dataset.filmTile = '1';
          line(card, i % cols, 14 + (i % cols) * 12, grid);
        });
      }
    }

    /* Blog satırları: yatayda hafifçe kayar */
    $$('.post-list .post-row').forEach(function (row, i) {
      if (row.dataset.filmTile) return;
      row.dataset.filmTile = '1';
      var tw = gsap.fromTo(row,
        { x: i % 2 ? 26 : -26 },
        {
          x: 0, ease: 'none',
          scrollTrigger: { trigger: row, start: 'top bottom', end: 'top 55%', scrub: 0.6 }
        });
      tileTweens.push(tw);
    });
  }

  /* --- Yöntem sahnesi arka planı: üst üste açılan katmanlar
         (Codrops LayersAnimation) --- */
  function sceneLayers() {
    var media = $('.scene-media');
    if (!media) return null;
    var base = $('img', media);
    if (!base) return null;

    var extra = ['assets/img/surec-mutfak-1200.webp', 'assets/img/program-tahta-1200.webp'];
    var layers = [];
    extra.forEach(function (src) {
      var layer = document.createElement('div');
      layer.className = 'scene-layer';
      var im = document.createElement('img');
      im.src = src;
      im.alt = '';
      im.loading = 'lazy';
      im.decoding = 'async';
      im.width = 1200; im.height = 900;
      layer.appendChild(im);
      media.appendChild(layer);
      layers.push(layer);
    });
    gsap.set(layers, { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' });
    return layers;
  }

  /* --- Bölümler arası dönerek geçen perde (Codrops RotatedRevealers) --- */
  var revealer = null;
  var revealerInner = null;
  var revealerBusy = false;

  function buildRevealer() {
    revealer = document.createElement('div');
    revealer.className = 'revealer';
    revealer.setAttribute('aria-hidden', 'true');
    revealerInner = document.createElement('i');
    revealer.appendChild(revealerInner);
    document.body.appendChild(revealer);
    sizeRevealer();
    window.addEventListener('resize', sizeRevealer, { passive: true });
  }
  /* Dönen perde: dış kutu ekranı kırpar, içteki panel açıya göre büyütülüp
     döndürülür; böylece köşeler de örtülür. */
  var ANGLE = -13;
  function sizeRevealer() {
    if (!revealerInner) return;
    var a = Math.abs(Math.cos(ANGLE * Math.PI / 180));
    var b = Math.abs(Math.sin(ANGLE * Math.PI / 180));
    revealerInner.style.width = 'calc(100vw * ' + a.toFixed(4) + ' + 100vh * ' + b.toFixed(4) + ' + 80px)';
    revealerInner.style.height = 'calc(100vw * ' + b.toFixed(4) + ' + 100vh * ' + a.toFixed(4) + ' + 80px)';
    gsap.set(revealerInner, { rotation: ANGLE, yPercent: 110 });
  }

  /* Perde aşağıdan gelir, ortada hedefe atlanır, yukarıdan çıkar */
  function revealTo(id) {
    if (!revealer || revealerBusy) return false;
    var target = document.getElementById(id);
    if (!target) return false;
    revealerBusy = true;
    revealer.classList.add('is-busy');
    if (lenis) lenis.stop();

    gsap.timeline({
      onComplete: function () {
        revealerBusy = false;
        revealer.classList.remove('is-busy');
        gsap.set(revealerInner, { yPercent: 110 });
      }
    })
      .fromTo(revealerInner, { yPercent: 110 }, { yPercent: 0, duration: 0.62, ease: 'power3.inOut' })
      .add(function () {
        if (lenis) lenis.start();
        ScrollTrigger.refresh();
        var top = target.getBoundingClientRect().top + window.scrollY;
        var pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
        var to = Math.max(0, top - pad);
        if (lenis) lenis.scrollTo(to, { immediate: true });
        else window.scrollTo(0, to);
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      })
      .to(revealerInner, { yPercent: -110, duration: 0.72, ease: 'power3.inOut' }, '+=0.1');
    return true;
  }

  /* ======================================================================
     5. Şeritler — kaydırma hızına tepki veren sonsuz yazı
        (Codrops LoopScrolling fikrinden uyarlandı)
     ====================================================================== */
  var ribbons = [];
  function buildRibbons() {
    $$('[data-ribbon]').forEach(function (rib) {
      var strip = $('.ribbon-track', rib);
      if (!strip) return;
      var unit = strip.firstElementChild;
      if (!unit) return;

      var guard = 0;
      while (strip.scrollWidth < window.innerWidth * 1.6 && guard < 14) {
        strip.appendChild(unit.cloneNode(true));
        guard++;
      }
      var span = strip.scrollWidth;
      var copies = strip.children.length;
      for (var i = 0; i < copies; i++) strip.appendChild(strip.children[i].cloneNode(true));

      var dir = parseFloat(rib.getAttribute('data-ribbon-speed')) || 1;
      var from = dir > 0 ? 0 : -span;
      var to = dir > 0 ? -span : 0;
      gsap.set(strip, { x: from });
      var loop = gsap.fromTo(strip, { x: from }, {
        x: to, ease: 'none', duration: span / 58, repeat: -1
      });
      if (paused) loop.pause();
      ribbons.push(loop);
      loops.push(loop);
    });

    if (!ribbons.length) return;
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: function (self) {
        if (paused) return;
        var v = self.getVelocity();
        var speed = clamp(0.35, 6, 1 + Math.abs(v) / 900);
        var sign = v < -1 ? -1 : 1;
        ribbons.forEach(function (tw) {
          gsap.to(tw, { timeScale: speed * sign, duration: 0.5, overwrite: 'auto' });
        });
      }
    });
  }

  /* ======================================================================
     6. Bölüm cetveli, ilerleme çubuğu, koyu sahne takibi
     ====================================================================== */
  function hudScenes() {
    gsap.to(ui.barFill, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });

    /* Bölüm ve koyu zemin takibi tek bir ölçümle yapılır:
       sabitlenen (pin) bölümlerde gerçek yer, pin-spacer'ın yeridir. */
    var darkSections = $$('.hero, .scene, .sky, .site-footer, .ribbon--dark');
    var darkZones = [];
    var chapterTops = [];
    var lastChapter = -1;
    var cueGone = null;
    var lastSweep = 0;
    var idleSweep = null;

    function boxOf(el) {
      var host = el.closest('.pin-spacer') || el;
      var r = host.getBoundingClientRect();
      var top = r.top + window.scrollY;
      return { top: top, bottom: top + r.height };
    }
    function measure() {
      darkZones = darkSections.map(boxOf);
      chapterTops = CHAPTERS.map(function (c) {
        var el = document.getElementById(c.id);
        return el ? boxOf(el).top : 0;
      });
    }
    function check() {
      var probe = window.scrollY + window.innerHeight - 30;
      var dark = darkZones.some(function (z) { return probe > z.top && probe < z.bottom; });
      hud.classList.toggle('is-over-dark', dark);

      /* Açılış karesi temiz kalsın: künye ve saat ilk kaydırmayla gelir,
         kaydırma daveti ise aynı anda çekilir. */
      var gone = window.scrollY > 60;
      if (gone !== cueGone) {
        cueGone = gone;
        if (ui.cue) gsap.to(ui.cue, { opacity: gone ? 0 : 1, duration: 0.4, overwrite: 'auto' });
        if (isHome) {
          gsap.to([ui.foot, ui.clock], { opacity: gone ? 1 : 0, duration: 0.4, overwrite: 'auto' });
        }
      }

      var now = Date.now();
      if (now - lastSweep > 400) { lastSweep = now; safetySweep(); }
      /* Kaydırma durduğunda son bir kontrol: tetikleyicisi atlanmış bir öge
         kalmışsa açığa çıkar. */
      clearTimeout(idleSweep);
      idleSweep = setTimeout(function () { safetySweep(true); }, 300);

      var mark = window.scrollY + window.innerHeight * 0.45;
      var idx = 0;
      for (var i = 0; i < chapterTops.length; i++) if (mark >= chapterTops[i]) idx = i;
      if (idx !== lastChapter) {
        lastChapter = idx;
        chapterLinks.forEach(function (a, j) { a.classList.toggle('is-on', j === idx); });
        if (ui.slateNum) ui.slateNum.textContent = (idx + 1 < 10 ? '0' : '') + (idx + 1);
        if (ui.slateName) ui.slateName.textContent = t(CHAPTERS[idx].key, CHAPTERS[idx].tr);
      }
    }
    measure(); check();
    ScrollTrigger.addEventListener('refresh', function () { measure(); check(); safetySweep(true); });
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: check });
    /* Dil değişince künyedeki bölüm adı da yenilensin */
    ui.refreshChapter = function () { lastChapter = -1; check(); };
  }

  /* ======================================================================
     7. Etkileşimler
     ====================================================================== */

  /* Sayfa içi bağlantılar yumuşak kayar */
  function smoothAnchor(id) {
    var target = document.getElementById(id);
    if (!target) return false;
    scrollTo(target);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    return true;
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || a.target === '_blank') return;
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) !== '#' || href.length < 2) return;
    var id = href.slice(1);
    if (!document.getElementById(id)) return;
    e.preventDefault();
    try { history.replaceState(history.state, '', href); } catch (err) {}
    /* Uzak bir bölüme gidiliyorsa perdeyle geç, yakınsa yumuşak kaydır */
    var target = document.getElementById(id);
    var far = Math.abs(target.getBoundingClientRect().top) > window.innerHeight * 1.4;
    if (!(far && revealTo(id))) smoothAnchor(id);
  });
  chapterLinks.forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (!document.getElementById(a.chapter.id)) return;
      e.preventDefault();
      smoothAnchor(a.chapter.id);
    });
  });

  /* Manyetik düğmeler (motion-primitives "magnetic" deseni) */
  function magnetic() {
    if (!canHover) return;
    $$('.btn--primary, .btn--cream, .fab, .header-cta').forEach(function (el) {
      if (el.dataset.filmMag) return;
      el.dataset.filmMag = '1';
      el.setAttribute('data-magnetic', '');
      var xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
      var yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
      el.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        var r = el.getBoundingClientRect();
        xTo(clamp(-14, 14, (e.clientX - r.left - r.width / 2) * 0.3));
        yTo(clamp(-10, 10, (e.clientY - r.top - r.height / 2) * 0.3));
      });
      el.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
    });
  }

  /* Tarif kartlarında hafif eğim (motion-primitives "tilt" deseni) */
  function tilt(scope) {
    if (!canHover) return;
    $$('.recipe-card', scope).forEach(function (card) {
      if (card.dataset.filmTilt) return;
      card.dataset.filmTilt = '1';
      var rx = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3' });
      var ry = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3' });
      card.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        var r = card.getBoundingClientRect();
        rx(((e.clientY - r.top) / r.height - 0.5) * -6);
        ry(((e.clientX - r.left) / r.width - 0.5) * 6);
      });
      card.addEventListener('pointerleave', function () { rx(0); ry(0); });
    });
  }

  /* ======================================================================
     8. Sonradan üretilen içerik
     ====================================================================== */
  function watchDynamic() {
    if (!('MutationObserver' in window)) return;

    var grid = $('[data-recipes]');
    if (grid) {
      var pending = null;
      new MutationObserver(function () {
        clearTimeout(pending);
        pending = setTimeout(function () {
          var cards = $$('.recipe-card', grid);
          if (!cards.length) return;
          gsap.fromTo(cards, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.7, ease: EASE, stagger: 0.04, overwrite: 'auto' });
          imageReveals(grid);
          tilt(grid);
                ScrollTrigger.refresh();
        }, 40);
      }).observe(grid, { childList: true });
    }

    var form = $('#booking-form');
    if (form) {
      new MutationObserver(function (records) {
        records.forEach(function (r) {
          var el = r.target;
          if (r.attributeName !== 'hidden' || el.hidden) return;
          gsap.fromTo(el, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.55, ease: EASE, overwrite: 'auto' });
        });
      }).observe(form, { attributes: true, attributeFilter: ['hidden'], subtree: true });
    }

    $$('[data-result], [data-meals], [data-slots]').forEach(function (out) {
      new MutationObserver(function () {
        var kids = Array.prototype.slice.call(out.children);
        if (!kids.length) return;
        gsap.fromTo(kids, { opacity: 0, y: 12 }, {
          opacity: 1, y: 0, duration: 0.45, ease: EASE,
          stagger: Math.min(0.04, 0.6 / kids.length), overwrite: 'auto'
        });
      }).observe(out, { childList: true });
    });
  }

  /* ======================================================================
     9. Açılış jeneriği
     ====================================================================== */
  var intro = $('#film-intro');

  function playHero() {
    if (heroTitleTween) heroTitleTween.play();
    if (heroIntro) heroIntro.play();
  }

  function playIntro() {
    if (!introDone && intro) {
      if (lenis) lenis.stop();
      var letters = $$('.film-word span > i', intro);
      var counter = $('[data-intro-count]', intro);
      var bar = $('[data-intro-bar]', intro);
      var bands = $$('.film-curtain i', intro);
      var top = $('.film-intro-top', intro);
      var foot = $('.film-intro-foot', intro);
      var sub = $('.film-intro-sub > span', intro);
      var inner = $('.film-intro-inner', intro);
      var count = { v: 0 };

      gsap.set(letters, { yPercent: 115 });
      gsap.set(sub, { yPercent: 135 });
      gsap.set([top, foot], { opacity: 0 });

      gsap.timeline({
        onComplete: function () {
          intro.remove();
          unlockIntro();
          if (lenis) lenis.start();
          ScrollTrigger.refresh();
        }
      })
        .to([top, foot], { opacity: 1, duration: 0.5, ease: 'none' }, 0)
        .to(letters, { yPercent: 0, duration: 1.05, ease: EASE, stagger: 0.055 }, 0.15)
        .to(sub, { yPercent: 0, duration: 0.8, ease: EASE }, 0.5)
        .to(bar, { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0.15)
        .to(count, {
          v: 100, duration: 1.5, ease: 'power2.inOut',
          onUpdate: function () { if (counter) counter.textContent = ('00' + Math.round(count.v)).slice(-3); }
        }, 0.15)
        .to(inner, { opacity: 0, duration: 0.4, ease: 'none' }, 1.8)
        .to(bands, {
          yPercent: -101, duration: 1.05,
          ease: window.CustomEase ? 'film' : 'power4.inOut',
          stagger: { each: 0.07 }
        }, 1.9)
        .add(playHero, 2.15);
    } else {
      if (intro) intro.remove();
      unlockIntro();
      playHero();
    }
  }

  /* ======================================================================
     10. Kurulum
     ====================================================================== */
  var built = false;
  function buildScenes() {
    if (built) return;
    built = true;
    buildText();
    if (isHome) {
      heroScene();
      counters();
      servicesScene();
      notesScene();
      roadScene();
      manifestoScene();
      teamScene();
      pricingScene();
      faqScene();
      bigWords();
      parallax();
      buildRibbons();
    }
    buildRevealer();
    reveals();
    imageReveals(document);
    tileScroll(document);
    tilt(document);
    magnetic();
    hudScenes();
    watchDynamic();
    ScrollTrigger.refresh();
  }

  function start() {
    buildScenes();
    playIntro();
  }

  /* Satır bölme doğru olsun diye yazı tipleri yüklenene kadar (en fazla 2 sn) bekle */
  var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(function (res) { setTimeout(res, 2000); })]).then(start, start);

  /* Ekran genişliği değişince satırları yeniden hesapla */
  var resizeTimer = null;
  var lastWidth = window.innerWidth;
  window.addEventListener('resize', function () {
    if (Math.abs(window.innerWidth - lastWidth) < 48) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      introDone = true;
      destroyText();
      buildText();
      ScrollTrigger.refresh();
    }, 280);
  }, { passive: true });

  /* Dil değişince: bölmeyi geri al, yeniden çevir, yeniden böl */
  if (M && M.onLang) {
    M.onLang(function () {
      if (!built) return;
      introDone = true;
      destroyText();
      if (M.translate) M.translate(document);
      chapterLinks.forEach(function (a) {
        var name = a.querySelector('s');
        if (name) name.textContent = t(a.chapter.key, a.chapter.tr);
      });
      ui.clockCity.textContent = t('film.city', 'İstanbul');
      if (ui.cueText) ui.cueText.textContent = t('film.scroll', 'Kaydırın');
      if (ui.nav) ui.nav.setAttribute('aria-label', t('film.chapters', 'Bölümler'));
        if (ui.refreshChapter) ui.refreshChapter();
      applyPause();
      requestAnimationFrame(function () {
        buildText();
        ScrollTrigger.refresh();
      });
    });
  }

  /* Yazdırırken hareket kalmasın */
  window.addEventListener('beforeprint', function () {
    ScrollTrigger.getAll().forEach(function (st) { st.disable(false); });
    gsap.globalTimeline.progress(1);
  });

  window.MizanFilm = {
    lenis: lenis,
    scrollTo: scrollTo,
    refresh: function () { ScrollTrigger.refresh(); }
  };
})();
