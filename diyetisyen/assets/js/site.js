/* Mizan Beslenme — shared site behaviour (all pages) */
(function () {
  'use strict';

  var cfg = window.MIZAN_CONFIG || {};
  var EN = window.MIZAN_I18N_EN || {};
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var listeners = [];

  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- Clinic time (always Türkiye time, taken from this computer's clock) ---------- */
  var OFFSET = (cfg.timeZoneOffsetMinutes == null ? 180 : cfg.timeZoneOffsetMinutes) * 60000;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function keyOf(y, m, d) { return y + '-' + pad(m) + '-' + pad(d); }
  function clinicNow() {
    var ms = Date.now() + OFFSET;
    var dt = new Date(ms);
    return {
      ms: Date.now(),
      date: dt,
      y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate(),
      dow: dt.getUTCDay(),
      minutes: dt.getUTCHours() * 60 + dt.getUTCMinutes(),
      seconds: dt.getUTCSeconds(),
      key: keyOf(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate())
    };
  }
  function toMin(hhmm) { var p = String(hhmm).split(':'); return (+p[0]) * 60 + (+p[1]); }
  function fromMin(min) { return pad(Math.floor(min / 60)) + ':' + pad(min % 60); }
  function parseKey(key) { var p = key.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function addDays(key, n) { var dt = parseKey(key); dt.setUTCDate(dt.getUTCDate() + n); return keyOf(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate()); }
  /* Real instant (ms) of a clinic wall-clock time */
  function instantOf(key, minutes) { return parseKey(key).getTime() + minutes * 60000 - OFFSET; }

  /* ---------- i18n ---------- */
  var TR = {};
  var currentLang = root.lang === 'en' ? 'en' : 'tr';

  function parseAttrMap(el) {
    return el.getAttribute('data-i18n-attr').split(';').filter(Boolean).map(function (pair) {
      var i = pair.indexOf(':');
      return { attr: pair.slice(0, i).trim(), key: pair.slice(i + 1).trim() };
    });
  }
  function collect(scope) {
    $$('[data-i18n]', scope).forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (!(k in TR)) TR[k] = el.textContent.trim();
    });
    $$('[data-i18n-attr]', scope).forEach(function (el) {
      parseAttrMap(el).forEach(function (it) {
        if (!(it.key in TR) && el.hasAttribute(it.attr)) TR[it.key] = el.getAttribute(it.attr);
      });
    });
  }
  var TRD = window.MIZAN_I18N_TR || {};
  function t(key, vars) {
    var s = currentLang === 'en' && EN[key] != null ? EN[key]
      : TR[key] != null ? TR[key]
      : TRD[key] != null ? TRD[key]
      : EN[key] != null ? EN[key] : key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }
  function translate(scope) {
    $$('[data-i18n]', scope).forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (el.textContent !== v) el.textContent = v;
    });
    $$('[data-i18n-attr]', scope).forEach(function (el) {
      parseAttrMap(el).forEach(function (it) { el.setAttribute(it.attr, t(it.key)); });
    });
  }

  var meta = {
    title: document.title,
    desc: ($('meta[name="description"]') || {}).content,
    ogTitle: ($('meta[property="og:title"]') || {}).content,
    ogDesc: ($('meta[property="og:description"]') || {}).content
  };
  function setMeta(sel, value) { var m = $(sel); if (m && value) m.setAttribute('content', value); }

  function localizeLinks() {
    $$('a[href]').forEach(function (a) {
      var base = a.getAttribute('data-href-base');
      if (base == null) {
        var href = a.getAttribute('href');
        if (!href || /^(#|https?:|mailto:|tel:|data:|javascript:)/i.test(href)) return;
        a.setAttribute('data-href-base', href);
        base = href;
      }
      if (currentLang === 'en') {
        var hashAt = base.indexOf('#');
        var path = hashAt >= 0 ? base.slice(0, hashAt) : base;
        var hash = hashAt >= 0 ? base.slice(hashAt) : '';
        a.setAttribute('href', path + (path.indexOf('?') >= 0 ? '&' : '?') + 'lang=en' + hash);
      } else {
        a.setAttribute('href', base);
      }
    });
  }

  function applyLang(lang, persist) {
    currentLang = lang === 'en' ? 'en' : 'tr';
    root.lang = currentLang;
    translate(document);

    var isEn = currentLang === 'en';
    var titleEn = root.getAttribute('data-title-en') || EN['meta.title'];
    var descEn = root.getAttribute('data-desc-en') || EN['meta.desc'];
    document.title = isEn && titleEn ? titleEn : meta.title;
    setMeta('meta[name="description"]', isEn && descEn ? descEn : meta.desc);
    setMeta('meta[property="og:title"]', isEn && titleEn ? titleEn : meta.ogTitle);
    setMeta('meta[property="og:description"]', isEn && descEn ? descEn : meta.ogDesc);
    setMeta('meta[name="twitter:title"]', isEn && titleEn ? titleEn : meta.ogTitle);
    setMeta('meta[name="twitter:description"]', isEn && descEn ? descEn : meta.ogDesc);
    setMeta('meta[property="og:locale"]', isEn ? 'en_US' : 'tr_TR');
    setMeta('meta[property="og:locale:alternate"]', isEn ? 'tr_TR' : 'en_US');

    $$('[data-lang-block]').forEach(function (el) { el.hidden = el.getAttribute('data-lang-block') !== currentLang; });
    $$('img[data-alt-en]').forEach(function (img) {
      if (!img.hasAttribute('data-alt-tr')) img.setAttribute('data-alt-tr', img.getAttribute('alt') || '');
      img.setAttribute('alt', isEn ? img.getAttribute('data-alt-en') : img.getAttribute('data-alt-tr'));
    });
    $$('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === currentLang)); });
    localizeLinks();
    updateThemeLabel();
    updateMenuLabel();
    renderConfigText();

    if (persist) {
      store('mizan-lang', currentLang);
      try {
        var url = new URL(location.href);
        if (isEn) url.searchParams.set('lang', 'en'); else url.searchParams.delete('lang');
        history.replaceState(history.state, '', url);
      } catch (e) {}
    }
    listeners.forEach(function (fn) { try { fn(currentLang); } catch (e) { console.error(e); } });
    queueFit();
  }

  /* ---------- Config-driven contact details ---------- */
  function waLink(text) {
    return 'https://wa.me/' + (cfg.whatsapp || '') + (text ? '?text=' + encodeURIComponent(text) : '');
  }
  function renderConfigText() {
    $$('[data-wa]').forEach(function (a) { a.href = waLink(t('wa.greeting')); });
    $$('[data-tel]').forEach(function (a) { a.href = 'tel:' + (cfg.phone || ''); });
    $$('[data-phone-text]').forEach(function (a) { a.textContent = cfg.phoneDisplay || ''; });
    $$('[data-mail]').forEach(function (a) { a.href = 'mailto:' + cfg.email; a.textContent = cfg.email; });
    $$('[data-maps]').forEach(function (a) { if (cfg.mapsUrl) a.href = cfg.mapsUrl; });
    $$('[data-address]').forEach(function (el) { if (cfg.address) el.textContent = cfg.address[currentLang] || cfg.address.tr; });
  }

  /* ---------- Theme ---------- */
  var themeMeta = $('meta[name="theme-color"]');
  function updateThemeLabel() {
    var dark = root.getAttribute('data-theme') === 'dark';
    $$('[data-theme-toggle]').forEach(function (b) { b.setAttribute('aria-label', t(dark ? 'a11y.toLight' : 'a11y.toDark')); });
  }
  function applyTheme(theme) {
    root.classList.add('theme-switching');
    root.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0B0C0A' : '#1E231D');
    store('mizan-theme', theme);
    updateThemeLabel();
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove('theme-switching'); }); });
  }
  $$('[data-theme-toggle]').forEach(function (b) {
    b.addEventListener('click', function () { applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });
  });
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onScheme = function (e) { if (!read('mizan-theme')) applyTheme(e.matches ? 'dark' : 'light'); };
    if (mq.addEventListener) mq.addEventListener('change', onScheme);
  }

  /* ---------- Header & mobile menu ---------- */
  var header = $('#site-header');
  var menu = $('#mobile-menu');
  var menuBtn = $('#menu-btn');
  var menuOpen = false;
  var alwaysSolid = root.getAttribute('data-page') !== 'home';
  function syncHeader() {
    if (!header) return;
    header.classList.toggle('is-solid', alwaysSolid || menuOpen || window.scrollY > 24);
  }
  function updateMenuLabel() { if (menuBtn) menuBtn.setAttribute('aria-label', t(menuOpen ? 'a11y.menuClose' : 'a11y.menuOpen')); }
  function setMenu(open) {
    if (!menu || open === menuOpen) return;
    menuOpen = open;
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    menu.toggleAttribute('inert', !open);
    updateMenuLabel();
    syncHeader();
  }
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(!menuOpen); });
  if (menu) menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) { setMenu(false); menuBtn.focus(); }
  });
  var wide = window.matchMedia('(min-width: 1180px)');
  var onWide = function (e) { if (e.matches) setMenu(false); };
  if (wide.addEventListener) wide.addEventListener('change', onWide);

  $$('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang'), true); });
  });

  /* Active section in the nav */
  var navLinks = $$('.nav a[href^="#"]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var visible = {};
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var current = Object.keys(byId).filter(function (id) { return visible[id]; })[0];
      navLinks.forEach(function (l) {
        if (current && l === byId[current]) l.setAttribute('aria-current', 'true');
        else l.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) sectionIO.observe(s); });
  }

  /* Floating buttons step aside while the hero call-to-action is on screen */
  var heroBottom = $('.hero-bottom');
  if (heroBottom && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle('fabs-off', entries[0].isIntersecting && window.innerWidth < 1024);
    }).observe(heroBottom);
  }

  /* ---------- Giant words that fill their panel ---------- */
  var fitEls = $$('[data-fit]');
  var fitQueued = false;
  function fitAll() {
    fitEls.forEach(function (el) {
      var inner = el.firstElementChild;
      if (!inner) return;
      el.style.fontSize = '100px';
      var w = inner.getBoundingClientRect().width;
      var avail = el.clientWidth;
      if (w > 0 && avail > 0) el.style.fontSize = (100 * avail / w * 0.99).toFixed(2) + 'px';
    });
  }
  function queueFit() {
    if (fitQueued) return;
    fitQueued = true;
    requestAnimationFrame(function () { fitQueued = false; fitAll(); });
  }
  window.addEventListener('resize', queueFit);
  window.addEventListener('load', queueFit);
  if (document.fonts) {
    if (document.fonts.ready) document.fonts.ready.then(queueFit);
    if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', queueFit);
  }
  if ('ResizeObserver' in window) {
    var fitRO = new ResizeObserver(queueFit);
    fitEls.forEach(function (el) { fitRO.observe(el); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.removeAttribute('data-reveal'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        en.target.classList.add('is-in');
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    revealEls.forEach(function (el) { io.observe(el); });
    root.classList.add('reveal-on');
  }

  /* ---------- Draggable notecards (desktop) ---------- */
  var dragQuery = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
  var zTop = 60;
  $$('[data-note]').forEach(function (note) {
    var pid = null, sx = 0, sy = 0, ox = 0, oy = 0;
    note.addEventListener('pointerdown', function (e) {
      if (!dragQuery.matches || e.button !== 0) return;
      pid = e.pointerId;
      try { note.setPointerCapture(pid); } catch (err) {}
      sx = e.clientX - ox; sy = e.clientY - oy;
      note.style.zIndex = String(++zTop);
      note.classList.add('is-dragging');
      e.preventDefault();
    });
    note.addEventListener('pointermove', function (e) {
      if (e.pointerId !== pid) return;
      ox = e.clientX - sx; oy = e.clientY - sy;
      note.style.translate = ox + 'px ' + oy + 'px';
    });
    var end = function (e) { if (e.pointerId !== pid) return; pid = null; note.classList.remove('is-dragging'); };
    note.addEventListener('pointerup', end);
    note.addEventListener('pointercancel', end);
  });

  /* ---------- Opening hours: "open now" + today's row ---------- */
  function holidayName(key) {
    var md = key.slice(5);
    var h = (cfg.holidays || {})[key] || (cfg.holidaysFixed || {})[md];
    return h ? (h[currentLang] || h.tr) : null;
  }
  function halfDayName(key) {
    var h = (cfg.halfDays || {})[key] || (cfg.halfDays || {})[key.slice(5)];
    return h ? (h[currentLang] || h.tr) : null;
  }
  function renderOpenStatus() {
    var el = $('[data-open-status]');
    if (!el) return;
    var now = clinicNow();
    $$('[data-hours] tr').forEach(function (tr) { tr.classList.toggle('is-today', +tr.getAttribute('data-dow') === now.dow); });
    var hours = (cfg.clinicHours || {})[now.dow];
    var holiday = holidayName(now.key);
    var half = halfDayName(now.key);
    var open = false, text;
    if (holiday) {
      text = t('open.holiday', { name: holiday });
    } else if (hours) {
      var start = toMin(hours[0]);
      var end = half ? Math.min(toMin(hours[1]), toMin(cfg.halfDayClose || '13:00')) : toMin(hours[1]);
      if (now.minutes >= start && now.minutes < end) {
        open = true;
        text = t('open.openUntil', { time: fromMin(end) });
      } else if (now.minutes < start) {
        text = t('open.opensAt', { time: hours[0] });
      }
    }
    if (!open && !text) {
      for (var i = 1; i <= 7; i++) {
        var k = addDays(now.key, i);
        var dow = parseKey(k).getUTCDay();
        var h = (cfg.clinicHours || {})[dow];
        if (h && !holidayName(k)) {
          text = i === 1 ? t('open.tomorrow', { time: h[0] }) : t('open.nextDay', { day: t('day.' + dow), time: h[0] });
          break;
        }
      }
    }
    el.classList.toggle('is-open', open);
    el.classList.toggle('is-closed', !open);
    el.lastElementChild.textContent = (open ? t('open.now') : t('open.closed')) + ' · ' + text;
  }

  /* ---------- API (Google Apps Script) ---------- */
  var api = {
    enabled: function () { return !!(cfg.endpoint && /^https:\/\/script\.google(usercontent)?\.com\//.test(cfg.endpoint)); },
    get: function (params, timeout) {
      if (!api.enabled()) return Promise.reject(new Error('no-endpoint'));
      var qs = Object.keys(params).map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]); }).join('&');
      return fetchJSON(cfg.endpoint + (cfg.endpoint.indexOf('?') >= 0 ? '&' : '?') + qs, { method: 'GET' }, timeout);
    },
    post: function (payload, timeout) {
      if (!api.enabled()) return Promise.reject(new Error('no-endpoint'));
      /* text/plain keeps this a "simple" request: Apps Script cannot answer CORS preflights. */
      return fetchJSON(cfg.endpoint, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'text/plain;charset=utf-8' } }, timeout);
    }
  };
  function fetchJSON(url, opts, timeout) {
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, timeout || 20000) : null;
    if (ctrl) opts.signal = ctrl.signal;
    opts.redirect = 'follow';
    opts.credentials = 'omit';
    return fetch(url, opts).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).finally(function () { if (timer) clearTimeout(timer); });
  }

  /* ---------- Validation helpers ---------- */
  var EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  function normalizePhone(v) {
    var raw = String(v || '').trim();
    var digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    if (/^\+/.test(raw) || /^00/.test(raw)) {
      digits = digits.replace(/^00/, '');
      if (/^90/.test(digits)) return /^90[2-5]\d{9}$/.test(digits) ? '+' + digits : '';
      return /^[1-9]\d{7,14}$/.test(digits) ? '+' + digits : '';
    }
    if (/^90[2-5]\d{9}$/.test(digits)) return '+' + digits;
    digits = digits.replace(/^0/, '');
    return /^[2-5]\d{9}$/.test(digits) ? '+90' + digits : '';
  }
  function formatPhone(e164) {
    var m = /^\+90(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(e164 || '');
    return m ? '0' + m[1] + ' ' + m[2] + ' ' + m[3] + ' ' + m[4] : (e164 || '');
  }

  /* ---------- Toast ---------- */
  var toastEl = $('#toast');
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2600);
  }

  /* ---------- Dialogs ---------- */
  $$('dialog').forEach(function (dlg) {
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
    });
    dlg.addEventListener('close', function () { root.style.overflow = ''; });
  });
  function openDialog(dlg) {
    if (!dlg) return;
    root.style.overflow = 'hidden';
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }

  /* ---------- Contact form ---------- */
  var cform = $('#contact-form');
  if (cform) {
    var cStatus = $('[data-form-status]', cform);
    var cStarted = Date.now();
    var cSubmitted = false;
    var cRules = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'err.name'; },
      email: function (v) { return !v.trim() ? 'err.emailReq' : (EMAIL_RE.test(v.trim()) ? '' : 'err.email'); },
      phone: function (v) { return !v.trim() || normalizePhone(v) ? '' : 'err.phone'; },
      message: function (v) { return v.trim().length >= 10 ? '' : 'err.message'; },
      kvkk: function (v, el) { return el.checked ? '' : 'err.kvkk'; }
    };
    var cValidate = function (name) {
      var el = cform.elements[name];
      var key = cRules[name](el.value, el);
      var err = $('#c-' + name + '-err');
      if (err) err.textContent = key ? t(key) : '';
      el.setAttribute('aria-invalid', key ? 'true' : 'false');
      return !key;
    };
    Object.keys(cRules).forEach(function (name) {
      var el = cform.elements[name];
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', function () { if (cSubmitted) cValidate(name); });
    });
    $$('[data-contact-topic]').forEach(function (a) {
      a.addEventListener('click', function () { cform.elements.topic.value = a.getAttribute('data-contact-topic'); });
    });
    var setCStatus = function (kind, key, link) {
      cStatus.className = 'form-status' + (kind ? ' is-' + kind : '');
      cStatus.textContent = key ? t(key) + ' ' : '';
      if (link) {
        var a = document.createElement('a');
        a.href = link; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.textContent = t('status.viaWa');
        cStatus.appendChild(a);
      }
    };
    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      cSubmitted = true;
      var bad = Object.keys(cRules).filter(function (n) { return !cValidate(n); });
      if (bad.length) { cform.elements[bad[0]].focus(); return; }
      var btn = $('button[type="submit"]', cform);
      var f = cform.elements;
      var wa = waLink(t('wa.greeting') + '\n\n' + f.message.value.trim() + '\n\n— ' + f.name.value.trim());
      if (f.website.value) { setCStatus('ok', 'status.sent'); cform.reset(); return; }
      if (!api.enabled()) { setCStatus('err', 'status.demo', wa); return; }
      btn.disabled = true; btn.classList.add('is-loading');
      api.post({
        action: 'message',
        name: f.name.value.trim(),
        email: f.email.value.trim(),
        phone: normalizePhone(f.phone.value),
        topic: f.topic.value,
        message: f.message.value.trim(),
        lang: currentLang,
        website: f.website.value,
        elapsed: Date.now() - cStarted
      }).then(function (res) {
        if (res && res.ok) {
          cform.reset(); cSubmitted = false;
          setCStatus('ok', 'status.sent');
        } else if (res && res.error === 'rate_limited') {
          setCStatus('err', 'status.tooMany');
        } else {
          setCStatus('err', 'status.error', wa);
        }
      }).catch(function () {
        setCStatus('err', 'status.error', wa);
      }).then(function () { btn.disabled = false; btn.classList.remove('is-loading'); });
    });
  }

  /* ---------- FAQ structured data follows the language ---------- */
  function buildFaqSchema() {
    var node = $('#faq-schema');
    if (!node) return;
    var items = $$('[data-faq-list] .faq').map(function (d) {
      return { '@type': 'Question', name: $('h3', d).textContent.trim(), acceptedAnswer: { '@type': 'Answer', text: $('.faq-a', d).textContent.trim() } };
    });
    node.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: currentLang, mainEntity: items });
  }

  /* ---------- Misc ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = String(clinicNow().y); });
  $$('[data-open-chat]').forEach(function (b) {
    b.addEventListener('click', function () { document.dispatchEvent(new CustomEvent('mizan:open-chat')); });
  });
  $$('[data-print-program]').forEach(function (b) {
    b.addEventListener('click', function () {
      var target = $('#program-print');
      if (!target) return;
      target.classList.add('print-target');
      window.print();
      setTimeout(function () { target.classList.remove('print-target'); }, 500);
    });
  });

  /* ---------- Public API for the other scripts ---------- */
  window.Mizan = {
    cfg: cfg,
    t: t,
    lang: function () { return currentLang; },
    onLang: function (fn) { listeners.push(fn); },
    collect: collect,
    translate: translate,
    time: { now: clinicNow, toMin: toMin, fromMin: fromMin, keyOf: keyOf, parseKey: parseKey, addDays: addDays, instantOf: instantOf, pad: pad, holidayName: holidayName, halfDayName: halfDayName },
    api: api,
    phone: { normalize: normalizePhone, format: formatPhone },
    EMAIL_RE: EMAIL_RE,
    waLink: waLink,
    toast: toast,
    openDialog: openDialog,
    store: store,
    read: read,
    reduceMotion: reduceMotion
  };

  /* ---------- Boot ---------- */
  collect(document);
  var initial = 'tr';
  try { initial = new URLSearchParams(location.search).get('lang') || read('mizan-lang') || 'tr'; } catch (e) {}
  listeners.push(buildFaqSchema, renderOpenStatus);
  applyLang(initial, false);
  root.classList.remove('lang-pending');
  setInterval(renderOpenStatus, 30000);
  fitAll();
})();
