/* Mizan Beslenme — online appointment booking */
(function () {
  'use strict';

  var M = window.Mizan;
  if (!M) return;
  var cfg = M.cfg;
  var T = M.time;

  /* ---------- Strings ---------- */
  var STR = {
    tr: {
      type: { first: 'İlk görüşme', control: 'Kontrol görüşmesi', online: 'Online görüşme' },
      clinic: 'Klinikte',
      onlinePlace: 'Online · bağlantı e-postayla gönderilir',
      dow: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
      prevMonth: 'Önceki ay', nextMonth: 'Sonraki ay',
      free: '{n} boş', full: 'Dolu', closed: 'Kapalı', holiday: 'Tatil', passed: 'Geçti',
      lgFree: 'Uygun', lgFull: 'Dolu', lgClosed: 'Kapalı veya geçmiş', lgToday: 'Bugün',
      aFree: '{n} uygun saat', aFull: 'tüm saatler dolu', aClosed: 'kapalı', aHoliday: 'resmî tatil, {name}', aPassed: 'bugünün uygun saatleri geçti', aPast: 'geçmiş tarih', aWindow: 'randevu aralığı dışında', aToday: 'bugün', aSelected: 'seçili',
      morning: 'Sabah', afternoon: 'Öğleden sonra', evening: 'Akşam',
      noteToday: 'Saat {now} itibarıyla {cutoff} öncesindeki saatler kapandı (en az {n} dk önceden).',
      noteHalf: '{name}: kapanış saati {close}.',
      noteDay: 'Görüşme süresi {dur} dakika. Saatler Türkiye saatidir.',
      empty: 'Bu gün için uygun saat kalmadı.',
      emptyNext: 'Sonraki uygun güne geç',
      noDays: 'Önümüzdeki {n} gün içinde bu seçimle uygun saat bulunamadı. Uzman veya görüşme türünü değiştirmeyi deneyin ya da bizi arayın.',
      loading: 'Takvim güncelleniyor…',
      liveError: 'Canlı doluluk bilgisi şu an alınamadı. Seçtiğiniz saat, onay sırasında yeniden kontrol edilecek.',
      slotTaken: 'Dolu', slotPast: 'Geçti',
      pickDay: 'Takvimden bir gün seçin.',
      tzNote: 'Saatler Türkiye saatine (GMT+3) göredir. Şu an sizin saatinizle {local}, Türkiye’de {tr}.',
      staffAny: 'Fark etmez',
      staffAssigned: '{name} · ilk uygun uzman',
      notForArea: 'Bu konuda görüşmüyor',
      needStaff: 'Seçtiğiniz uzman bu konuda görüşme yapmıyor. Başka bir uzman seçin.',
      needDate: 'Lütfen takvimden bir gün seçin.',
      needTime: 'Lütfen bir saat seçin.',
      timeGone: 'Seçtiğiniz saat artık uygun değil (geçmişte kaldı ya da doldu). Lütfen yeni bir saat seçin.',
      sum: { type: 'Görüşme', area: 'Konu', staff: 'Uzman', date: 'Tarih', time: 'Saat', place: 'Yer', none: 'Seçilmedi' },
      rev: { appointment: 'Görüşme', datetime: 'Tarih ve saat', name: 'Ad soyad', phone: 'Telefon', email: 'E-posta', note: 'Not', reminder: 'Hatırlatma', yes: 'E-postayla bir gün önce', no: 'İstemiyor', edit: 'Düzenle' },
      prepTitle: 'Görüşmeden önce',
      prepClinic: ['Randevu saatinden 10 dakika önce gelmeniz yeterli.', 'Vücut analizi için son 2 saatte ağır yemek yememeye, son 12 saatte yoğun egzersiz yapmamaya çalışın.', 'Varsa son 3 aydaki tahlillerinizi ve kullandığınız ilaçların listesini getirin.', 'Ölçüm sırasında metal aksesuarları çıkarmanız istenecek.'],
      prepOnline: ['Görüşme bağlantısı randevudan önce e-postanıza gelir; bilgisayar veya telefondan katılabilirsiniz.', 'Sessiz bir ortam ve sabit bir internet bağlantısı yeterli.', 'Evde tartı ve mezura varsa yanınızda bulundurun.', 'Varsa son tahlillerinizi görüşmeden önce e-postayla gönderebilirsiniz.'],
      submitErr: {
        slot_taken: 'Bu saat az önce doldu. Takvim güncellendi, lütfen başka bir saat seçin.',
        too_soon: 'Bu saat için süre doldu; randevular en az {n} dakika önceden alınabiliyor.',
        closed: 'Seçtiğiniz gün veya saat artık kapalı. Lütfen başka bir saat seçin.',
        rate_limited: 'Kısa sürede çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.',
        invalid: 'Bilgilerden biri hatalı görünüyor. Lütfen kontrol edip tekrar deneyin.',
        network: 'Bağlantı sorunu nedeniyle randevu kaydedilemedi. Tekrar deneyebilir ya da bilgileri WhatsApp’tan iletebilirsiniz.',
        waLink: 'WhatsApp’tan gönder'
      },
      doneTitle: 'Randevunuz oluşturuldu',
      doneText: 'Onay e-postası {email} adresine gönderildi.',
      doneReminder: 'Randevudan bir gün önce hatırlatma e-postası da alacaksınız.',
      doneOnline: 'Görüşme bağlantısı randevudan önce e-postanıza gelecek.',
      doneRef: 'Referans kodu',
      copy: 'Kodu kopyala', copied: 'Referans kodu kopyalandı',
      ics: 'Takvime ekle (.ics)', google: 'Google Takvim', waShare: 'WhatsApp’tan ilet', again: 'Yeni randevu',
      demo: 'Demo modu: Google E-Tablolar bağlantısı henüz yapılmadığı için bu randevu yalnızca bu tarayıcıda saklandı.',
      waText: 'Merhaba, {date} saat {time} için {type} randevusu oluşturdum.\nReferans: {ref}\nAd soyad: {name}',
      waFallback: 'Merhaba, randevu almak istiyorum.\nGörüşme: {type}\nUzman: {staff}\nTarih: {date} {time}\nAd soyad: {name}\nTelefon: {phone}\nE-posta: {email}',
      icsSummary: 'Mizan Beslenme · {type}',
      icsDesc: 'Uzman: {staff}\nReferans: {ref}\nDeğişiklik için: {phone}',
      icsAlarm: 'Randevunuza 2 saat kaldı',
      today: 'Bugün', tomorrow: 'Yarın',
      nextMeta: '{staff} · {type} · {dur} dk',
      nextNone: 'Önümüzdeki günlerde boş saat görünmüyor',
      nextNoneMeta: 'Bekleme listesi için bizi arayın',
      cancel: {
        refErr: 'Referans kodunu MZ-XXXXX biçiminde yazın.',
        emailErr: 'Randevuda kullandığınız e-posta adresini yazın.',
        ok: 'Randevunuz iptal edildi. Bilgilendirme e-postası gönderildi.',
        not_found: 'Bu kod ve e-posta ile eşleşen aktif bir randevu bulunamadı.',
        too_late: 'Randevunuza {h} saatten az kaldığı için online iptal yapılamıyor. Lütfen bizi arayın: {phone}',
        already: 'Bu randevu daha önce iptal edilmiş.',
        demoOk: 'Demo modu: randevu bu tarayıcıdaki kayıtlardan silindi.',
        error: 'İptal işlemi şu an yapılamadı. Lütfen bizi arayın: {phone}'
      }
    },
    en: {
      type: { first: 'First consultation', control: 'Follow-up visit', online: 'Online consultation' },
      clinic: 'At the clinic',
      onlinePlace: 'Online · link sent by email',
      dow: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      prevMonth: 'Previous month', nextMonth: 'Next month',
      free: '{n} free', full: 'Full', closed: 'Closed', holiday: 'Holiday', passed: 'Passed',
      lgFree: 'Available', lgFull: 'Fully booked', lgClosed: 'Closed or past', lgToday: 'Today',
      aFree: '{n} available times', aFull: 'fully booked', aClosed: 'closed', aHoliday: 'public holiday, {name}', aPassed: 'today’s times have passed', aPast: 'past date', aWindow: 'outside the booking window', aToday: 'today', aSelected: 'selected',
      morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening',
      noteToday: 'As of {now}, times before {cutoff} are closed (at least {n} min notice).',
      noteHalf: '{name}: appointments until {close}.',
      noteDay: 'Appointment length {dur} minutes. Times are Türkiye time.',
      empty: 'No times left on this day.',
      emptyNext: 'Go to the next available day',
      noDays: 'No available times in the next {n} days for this selection. Try another dietitian or appointment type, or give us a call.',
      loading: 'Updating the calendar…',
      liveError: 'Live availability could not be loaded right now. Your chosen time will be checked again when you confirm.',
      slotTaken: 'Booked', slotPast: 'Passed',
      pickDay: 'Pick a day on the calendar.',
      tzNote: 'Times are shown in Türkiye time (GMT+3). It is {local} for you and {tr} in Türkiye.',
      staffAny: 'No preference',
      staffAssigned: '{name} · first available',
      notForArea: 'Doesn’t cover this topic',
      needStaff: 'The dietitian you picked doesn’t cover this topic. Please choose someone else.',
      needDate: 'Please pick a day on the calendar.',
      needTime: 'Please pick a time.',
      timeGone: 'The time you picked is no longer available (it has passed or was booked). Please choose a new time.',
      sum: { type: 'Appointment', area: 'Topic', staff: 'Dietitian', date: 'Date', time: 'Time', place: 'Place', none: 'Not selected' },
      rev: { appointment: 'Appointment', datetime: 'Date and time', name: 'Full name', phone: 'Phone', email: 'Email', note: 'Note', reminder: 'Reminder', yes: 'By email, the day before', no: 'No reminder', edit: 'Edit' },
      prepTitle: 'Before your appointment',
      prepClinic: ['Arriving 10 minutes early is enough.', 'For the body analysis, avoid a heavy meal in the last 2 hours and intense exercise in the last 12 hours.', 'Bring blood tests from the last 3 months and a list of your medication, if you have them.', 'You will be asked to remove metal accessories during the measurement.'],
      prepOnline: ['The video link arrives by email before your appointment; you can join from a computer or phone.', 'A quiet room and a stable connection are all you need.', 'Keep a scale and a tape measure nearby if you have them.', 'You can email recent blood tests before the call.'],
      submitErr: {
        slot_taken: 'That time was just booked. The calendar has been refreshed; please choose another time.',
        too_soon: 'That time is too close now; appointments need at least {n} minutes’ notice.',
        closed: 'The day or time you picked is no longer open. Please choose another time.',
        rate_limited: 'Too many attempts in a short time. Please try again in a few minutes.',
        invalid: 'Some of the details look incorrect. Please check and try again.',
        network: 'The appointment could not be saved because of a connection problem. Try again or send the details via WhatsApp.',
        waLink: 'Send via WhatsApp'
      },
      doneTitle: 'Your appointment is booked',
      doneText: 'A confirmation has been sent to {email}.',
      doneReminder: 'You will also get a reminder email the day before.',
      doneOnline: 'The video link will arrive by email before the appointment.',
      doneRef: 'Reference code',
      copy: 'Copy code', copied: 'Reference code copied',
      ics: 'Add to calendar (.ics)', google: 'Google Calendar', waShare: 'Share on WhatsApp', again: 'New appointment',
      demo: 'Demo mode: Google Sheets is not connected yet, so this appointment was only stored in this browser.',
      waText: 'Hello, I booked a {type} on {date} at {time}.\nReference: {ref}\nName: {name}',
      waFallback: 'Hello, I would like to book an appointment.\nType: {type}\nDietitian: {staff}\nDate: {date} {time}\nName: {name}\nPhone: {phone}\nEmail: {email}',
      icsSummary: 'Mizan Nutrition · {type}',
      icsDesc: 'Dietitian: {staff}\nReference: {ref}\nTo change: {phone}',
      icsAlarm: 'Your appointment is in 2 hours',
      today: 'Today', tomorrow: 'Tomorrow',
      nextMeta: '{staff} · {type} · {dur} min',
      nextNone: 'No free times in the coming days',
      nextNoneMeta: 'Call us to join the waiting list',
      cancel: {
        refErr: 'Enter the reference code as MZ-XXXXX.',
        emailErr: 'Enter the email address used for the booking.',
        ok: 'Your appointment has been cancelled. We have sent you an email.',
        not_found: 'No active appointment matches this code and email.',
        too_late: 'Your appointment is less than {h} hours away, so it can’t be cancelled online. Please call us: {phone}',
        already: 'This appointment was already cancelled.',
        demoOk: 'Demo mode: the appointment was removed from this browser.',
        error: 'The cancellation could not be completed right now. Please call us: {phone}'
      }
    }
  };
  function S() { return STR[M.lang()] || STR.tr; }
  function fill(str, vars) { return String(str).replace(/\{(\w+)\}/g, function (m, k) { return vars && vars[k] != null ? vars[k] : m; }); }
  function locale() { return M.lang() === 'en' ? 'en-GB' : 'tr-TR'; }
  var fmtCache = {};
  function fmtDate(key, opts) {
    var id = locale() + JSON.stringify(opts);
    var f = fmtCache[id] || (fmtCache[id] = new Intl.DateTimeFormat(locale(), Object.assign({ timeZone: 'UTC' }, opts)));
    return f.format(T.parseKey(key));
  }
  function fmtLongDate(key) { return fmtDate(key, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
  function fmtDayTitle(key) { return fmtDate(key, { weekday: 'long', day: 'numeric', month: 'long' }); }
  function fmtPrice(n) { return new Intl.NumberFormat(locale()).format(n) + ' TL'; }
  function areaName(a) { return M.t('area.' + a); }
  function staffName(id) { var s = cfg.staff[id]; return s ? (M.lang() === 'en' && s.nameEn ? s.nameEn : s.name) : ''; }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- Local demo storage ---------- */
  var DEMO_KEY = 'mizan-demo-bookings';
  function demoList() {
    try { var a = JSON.parse(M.read(DEMO_KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; }
  }
  function demoSave(list) { M.store(DEMO_KEY, JSON.stringify(list.slice(-100))); }

  /* ---------- State ---------- */
  var state = {
    step: 1, maxStep: 1,
    type: 'first', area: 'weight', staff: 'any',
    date: null, time: null, assigned: null,
    view: null,
    busy: [], closures: [],
    loaded: !M.api.enabled(), loadError: false, loading: null, lastLoad: 0,
    submitting: false, started: Date.now(), result: null
  };

  /* ---------- Availability engine ---------- */
  function eligible(id, area) { return cfg.staff[id] && cfg.staff[id].areas.indexOf(area || state.area) >= 0; }
  function staffPool(sel) {
    sel = sel || state;
    var ids = Object.keys(cfg.staff);
    if (sel.staff && sel.staff !== 'any') return eligible(sel.staff, sel.area) ? [sel.staff] : [];
    return ids.filter(function (id) { return sel.area ? eligible(id, sel.area) : true; });
  }
  function windowEnd(nowKey) { return T.addDays(nowKey, cfg.bookingWindowDays); }

  function blocksFor(id, key) {
    var dow = T.parseKey(key).getUTCDay();
    var hours = (cfg.staff[id].hours || {})[dow];
    if (!hours || T.holidayName(key)) return [];
    var blocks = hours.map(function (h) { return [T.toMin(h[0]), T.toMin(h[1])]; });
    if (T.halfDayName(key)) {
      var close = T.toMin(cfg.halfDayClose || '13:00');
      blocks = blocks.map(function (b) { return [b[0], Math.min(b[1], close)]; }).filter(function (b) { return b[1] > b[0]; });
    }
    state.closures.forEach(function (c) {
      if (c.d !== key || (c.s && c.s !== id)) return;
      if (c.from == null) { blocks = []; return; }
      var out = [];
      blocks.forEach(function (b) {
        if (c.to <= b[0] || c.from >= b[1]) { out.push(b); return; }
        if (c.from > b[0]) out.push([b[0], c.from]);
        if (c.to < b[1]) out.push([c.to, b[1]]);
      });
      blocks = out;
    });
    return blocks;
  }

  function busyFor(id, key) {
    var list = state.busy;
    if (!M.api.enabled()) list = list.concat(demoList());
    return list.filter(function (b) { return b.d === key && b.s === id; })
      .map(function (b) { var s = T.toMin(b.t); return [s, s + (+b.m || 30)]; });
  }

  function slotsFor(key, sel) {
    sel = sel || state;
    var dur = cfg.types[sel.type].minutes;
    var step = cfg.slotStepMinutes || 30;
    var limit = Date.now() + (cfg.minNoticeMinutes || 0) * 60000;
    var map = {};
    staffPool(sel).forEach(function (id) {
      var busy = busyFor(id, key);
      blocksFor(id, key).forEach(function (b) {
        for (var t = b[0]; t + dur <= b[1]; t += step) {
          var e = map[t] || (map[t] = { t: t, free: [], past: false, taken: false });
          if (T.instantOf(key, t) < limit) { e.past = true; continue; }
          var clash = busy.some(function (x) { return t < x[1] && t + dur > x[0]; });
          if (clash) e.taken = true; else e.free.push(id);
        }
      });
    });
    return Object.keys(map).map(function (k) { return map[k]; }).sort(function (a, b) { return a.t - b.t; }).map(function (e) {
      return { t: e.t, time: T.fromMin(e.t), state: e.free.length ? 'free' : (e.past ? 'past' : 'taken'), staff: pickStaff(e.free, key) };
    });
  }

  function pickStaff(ids, key) {
    if (!ids.length) return null;
    if (ids.length === 1) return ids[0];
    var order = Object.keys(cfg.staff);
    return ids.slice().sort(function (a, b) {
      var la = busyFor(a, key).length, lb = busyFor(b, key).length;
      return la - lb || order.indexOf(a) - order.indexOf(b);
    })[0];
  }

  function dayState(key, sel) {
    var now = T.now();
    if (key < now.key) return { kind: 'past' };
    if (key > windowEnd(now.key)) return { kind: 'window' };
    var hol = T.holidayName(key);
    if (hol) return { kind: 'holiday', name: hol };
    var slots = slotsFor(key, sel);
    if (!slots.length) return { kind: 'closed' };
    var free = slots.filter(function (s) { return s.state === 'free'; }).length;
    if (free) return { kind: 'available', free: free };
    return slots.every(function (s) { return s.state === 'past'; }) ? { kind: 'passed' } : { kind: 'full' };
  }

  function firstAvailableDay(sel, fromKey) {
    var now = T.now();
    var end = windowEnd(now.key);
    for (var k = fromKey && fromKey > now.key ? fromKey : now.key; k <= end; k = T.addDays(k, 1)) {
      if (dayState(k, sel).kind === 'available') return k;
    }
    return null;
  }

  function isSlotFree(sel) {
    if (!sel.date || !sel.time) return false;
    var slot = slotsFor(sel.date, sel).filter(function (s) { return s.time === sel.time; })[0];
    if (!slot || slot.state !== 'free') return false;
    if (sel.staff !== 'any') return true;
    return true;
  }

  /* ---------- Server data ---------- */
  function sanitizeBusy(list) {
    return (Array.isArray(list) ? list : []).filter(function (b) {
      return b && /^\d{4}-\d{2}-\d{2}$/.test(b.d) && /^\d{2}:\d{2}$/.test(b.t) && cfg.staff[b.s];
    }).map(function (b) { return { d: b.d, t: b.t, s: b.s, m: Math.max(5, Math.min(480, +b.m || 30)) }; });
  }
  function sanitizeClosures(list) {
    return (Array.isArray(list) ? list : []).filter(function (c) { return c && /^\d{4}-\d{2}-\d{2}$/.test(c.d); }).map(function (c) {
      var from = /^\d{2}:\d{2}$/.test(c.from || '') ? T.toMin(c.from) : null;
      var to = /^\d{2}:\d{2}$/.test(c.to || '') ? T.toMin(c.to) : null;
      if (from != null && to == null) to = 24 * 60;
      return { d: c.d, s: cfg.staff[c.s] ? c.s : null, from: from, to: to };
    });
  }
  function loadAvailability(force) {
    if (!M.api.enabled()) return Promise.resolve();
    if (state.loading) return state.loading;
    if (!force && state.lastLoad && Date.now() - state.lastLoad < 60000) return Promise.resolve();
    var now = T.now();
    renderAll();
    state.loading = M.api.get({ action: 'availability', from: now.key, to: windowEnd(now.key) }, 15000)
      .then(function (res) {
        if (!res || !res.ok) throw new Error('bad');
        state.busy = sanitizeBusy(res.busy);
        state.closures = sanitizeClosures(res.closures);
        state.loadError = false;
      })
      .catch(function () { state.loadError = true; })
      .then(function () {
        state.loaded = true;
        state.lastLoad = Date.now();
        state.loading = null;
        revalidateSelection();
        renderAll();
      });
    return state.loading;
  }

  /* ---------- DOM ---------- */
  var form = document.getElementById('booking-form');
  var bookingEl = document.querySelector('[data-booking]');
  var nextSlotEl = document.getElementById('next-slot');

  function renderNextSlot() {
    if (!nextSlotEl) return;
    var timeEl = nextSlotEl.querySelector('[data-next-time]');
    var metaEl = nextSlotEl.querySelector('[data-next-meta]');
    var link = nextSlotEl.querySelector('[data-next-book]');
    if (M.api.enabled() && !state.lastLoad) return;
    var sel = { type: 'first', area: null, staff: 'any' };
    var now = T.now();
    var day = firstAvailableDay(sel);
    timeEl.textContent = '';
    if (!day) {
      timeEl.appendChild(el('span', null, S().nextNone));
      metaEl.textContent = S().nextNoneMeta;
      link.hidden = true;
      return;
    }
    var slot = slotsFor(day, sel).filter(function (s) { return s.state === 'free'; })[0];
    var label = day === now.key ? S().today : day === T.addDays(now.key, 1) ? S().tomorrow : fmtDate(day, { weekday: 'short', day: 'numeric', month: 'short' });
    timeEl.appendChild(document.createTextNode(label + ' · '));
    timeEl.appendChild(el('strong', null, slot.time));
    metaEl.textContent = fill(S().nextMeta, { staff: staffName(slot.staff), type: S().type.first, dur: cfg.types.first.minutes });
    link.hidden = false;
    link.dataset.date = day;
    link.dataset.time = slot.time;
    link.dataset.staff = slot.staff;
  }

  if (!form || !bookingEl) {
    /* Pages without the booking widget: nothing else to do. */
    return;
  }

  var steps = Array.prototype.slice.call(form.querySelectorAll('.bstep[data-step]'));
  var stepper = bookingEl.querySelector('[data-stepper]');
  var calEl = form.querySelector('[data-calendar]');
  var slotsEl = form.querySelector('[data-slots]');
  var sumEl = bookingEl.querySelector('[data-sum]');
  var feeEl = bookingEl.querySelector('[data-sum-fee]');
  var summary = bookingEl.querySelector('[data-summary]');
  var reviewEl = form.querySelector('[data-review]');
  var prepEl = form.querySelector('[data-prep]');
  var doneEl = form.querySelector('[data-step="done"]');
  var tzNote = form.querySelector('[data-tz-note]');
  var clockEl = document.querySelector('[data-clock]');
  var clockDateEl = document.querySelector('[data-clock-date]');
  var submitBtn = form.querySelector('[data-submit]');

  function msg(step, text, link) {
    var box = form.querySelector('[data-msg="' + step + '"]');
    if (!box) return;
    box.textContent = text || '';
    if (link) {
      box.appendChild(document.createTextNode(' '));
      var a = el('a', null, link.text);
      a.href = link.href; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.style.textDecoration = 'underline';
      box.appendChild(a);
    }
  }

  /* ----- Step navigation ----- */
  function goTo(step, opts) {
    opts = opts || {};
    state.step = step;
    if (typeof step === 'number') state.maxStep = Math.max(state.maxStep, step);
    steps.forEach(function (fs) { fs.hidden = fs.getAttribute('data-step') !== String(step); });
    renderStepper();
    if (step === 2) { ensureDate(); renderCalendar(); renderSlots(); loadAvailability(); }
    if (step === 4) renderReview();
    renderSummary();
    if (!opts.silent) {
      var rect = bookingEl.getBoundingClientRect();
      if (rect.top < 0 || rect.top > window.innerHeight * 0.6) {
        window.scrollTo({ top: window.scrollY + rect.top - 96, behavior: M.reduceMotion ? 'auto' : 'smooth' });
      }
      var focusTarget = step === 'done' ? doneEl : form.querySelector('[data-step="' + step + '"] .bstep-title');
      if (focusTarget) setTimeout(function () { focusTarget.focus({ preventScroll: true }); }, opts.delay || 60);
    }
  }
  function renderStepper() {
    Array.prototype.forEach.call(stepper.querySelectorAll('li'), function (li, i) {
      var n = i + 1;
      var btn = li.querySelector('button');
      var done = state.step === 'done' || n < state.step || (n <= state.maxStep && n !== state.step && validStep(n));
      li.classList.toggle('is-current', state.step === n);
      li.classList.toggle('is-done', done && state.step !== n);
      btn.disabled = state.step === 'done' || n > state.maxStep;
      if (state.step === n) btn.setAttribute('aria-current', 'step'); else btn.removeAttribute('aria-current');
    });
  }
  function validStep(n) {
    if (n === 1) return staffPool().length > 0 && (state.staff === 'any' || eligible(state.staff));
    if (n === 2) return isSlotFree(state);
    if (n === 3) return ['name', 'phone', 'email', 'kvkk'].every(function (f) { return !fieldError(f); });
    return true;
  }

  stepper.addEventListener('click', function (e) {
    var b = e.target.closest('[data-goto]');
    if (!b || b.disabled) return;
    var n = +b.getAttribute('data-goto');
    if (n > 1 && !validStep(1)) return;
    if (n > 2 && !validStep(2)) { goTo(2); msg(2, S().needTime); return; }
    if (n > 3 && !validStep(3)) { goTo(3); return; }
    goTo(n);
  });

  form.addEventListener('click', function (e) {
    var next = e.target.closest('[data-next]');
    var prev = e.target.closest('[data-prev]');
    if (prev) { goTo(+prev.getAttribute('data-prev')); return; }
    if (!next) return;
    var to = +next.getAttribute('data-next');
    if (to === 2) {
      if (!validStep(1)) { M.toast(S().needStaff); return; }
      goTo(2);
    } else if (to === 3) {
      if (!state.date) { msg(2, S().needDate); return; }
      if (!state.time) { msg(2, S().needTime); return; }
      if (!isSlotFree(state)) { state.time = null; renderSlots(); renderSummary(); msg(2, S().timeGone); return; }
      msg(2, '');
      goTo(3);
    } else if (to === 4) {
      fieldsSubmitted = true;
      var bad = ['name', 'phone', 'email', 'kvkk'].filter(function (f) { return !showFieldError(f); });
      if (bad.length) { form.elements[bad[0]].focus(); return; }
      goTo(4);
    }
  });

  /* ----- Step 1 inputs ----- */
  function syncStaffAvailability() {
    Array.prototype.forEach.call(form.querySelectorAll('input[name="staff"]'), function (input) {
      if (input.value === 'any') return;
      var ok = eligible(input.value);
      input.disabled = !ok;
      var note = form.querySelector('[data-staff-note="' + input.value + '"]');
      if (note) note.textContent = ok ? M.t(note.getAttribute('data-i18n')) : S().notForArea;
    });
    if (state.staff !== 'any' && !eligible(state.staff)) {
      state.staff = 'any';
      form.elements.staff.value = 'any';
    }
  }
  /* Drops the chosen time if it is no longer free (clock moved on, someone booked it, selection changed). */
  function revalidateSelection() {
    if (state.time && !isSlotFree(state)) {
      state.time = null;
      state.assigned = null;
      state.maxStep = Math.min(state.maxStep, 2);
      msg(2, S().timeGone);
      if (typeof state.step === 'number' && state.step > 2) goTo(2);
    } else if (state.time) {
      var slot = slotsFor(state.date).filter(function (s) { return s.time === state.time; })[0];
      state.assigned = state.staff === 'any' ? slot.staff : state.staff;
    }
  }
  form.addEventListener('change', function (e) {
    var name = e.target.name;
    if (name === 'type' || name === 'area' || name === 'staff') {
      state[name] = e.target.value;
      if (name === 'area') syncStaffAvailability();
      revalidateSelection();
      if (state.date && dayState(state.date).kind !== 'available' && !state.time) state.date = null;
      renderSummary();
      renderStepper();
    }
  });

  function preselect(d) {
    if (!d) return;
    if (state.step === 'done') resetFlow();
    if (d.type && cfg.types[d.type]) { state.type = d.type; form.elements.type.value = d.type; }
    if (d.area && cfg.areas.indexOf(d.area) >= 0) { state.area = d.area; form.elements.area.value = d.area; }
    if (d.staff && cfg.staff[d.staff]) {
      if (!eligible(d.staff)) { state.area = cfg.staff[d.staff].areas[0]; form.elements.area.value = state.area; }
      state.staff = d.staff;
    }
    syncStaffAvailability();
    form.elements.staff.value = state.staff;

    if (d.date && d.time) {
      state.date = d.date;
      state.time = d.time;
      state.view = d.date.slice(0, 7);
      if (isSlotFree(state)) {
        revalidateSelection();
        goTo(2, { delay: 500 });
        return;
      }
      state.time = null;
    }
    revalidateSelection();
    if (typeof state.step === 'number' && state.step > 1) goTo(1, { silent: true });
    renderSummary();
    renderStepper();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-book-area],[data-book-type],[data-book-staff],[data-next-book]');
    if (!t) return;
    if (t.hasAttribute('data-next-book')) {
      preselect({ type: 'first', staff: t.dataset.staff, date: t.dataset.date, time: t.dataset.time });
      return;
    }
    preselect({ area: t.getAttribute('data-book-area'), type: t.getAttribute('data-book-type'), staff: t.getAttribute('data-book-staff') });
  });
  document.addEventListener('mizan:book', function (e) {
    preselect(e.detail || {});
    var rect = bookingEl.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + rect.top - 96, behavior: M.reduceMotion ? 'auto' : 'smooth' });
  });

  /* ----- Calendar ----- */
  function ensureDate() {
    var now = T.now();
    if (state.date && (state.date < now.key || dayState(state.date).kind !== 'available') && !state.time) state.date = null;
    if (!state.date) {
      var first = firstAvailableDay(state);
      if (first) state.date = first;
    }
    var base = state.date || now.key;
    if (!state.view) state.view = base.slice(0, 7);
  }
  function monthBounds() {
    var now = T.now();
    return { min: now.key.slice(0, 7), max: windowEnd(now.key).slice(0, 7) };
  }
  function shiftMonth(ym, n) {
    var y = +ym.slice(0, 4), m = +ym.slice(5, 7) + n;
    while (m < 1) { m += 12; y--; }
    while (m > 12) { m -= 12; y++; }
    return y + '-' + T.pad(m);
  }

  function renderCalendar(focusKey) {
    if (!calEl) return;
    var now = T.now();
    var bounds = monthBounds();
    if (!state.view || state.view < bounds.min) state.view = bounds.min;
    if (state.view > bounds.max) state.view = bounds.max;
    var y = +state.view.slice(0, 4), m = +state.view.slice(5, 7);
    var first = T.keyOf(y, m, 1);
    var daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
    var lead = (T.parseKey(first).getUTCDay() + 6) % 7;

    calEl.textContent = '';
    var head = el('div', 'cal-head');
    var prev = el('button', 'icon-btn');
    prev.type = 'button'; prev.setAttribute('aria-label', S().prevMonth); prev.disabled = state.view <= bounds.min;
    prev.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>';
    var next = el('button', 'icon-btn');
    next.type = 'button'; next.setAttribute('aria-label', S().nextMonth); next.disabled = state.view >= bounds.max;
    next.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
    var title = el('h3', 'cal-title', fmtDate(first, { month: 'long', year: 'numeric' }));
    title.id = 'cal-title';
    title.setAttribute('aria-live', 'polite');
    prev.addEventListener('click', function () { state.view = shiftMonth(state.view, -1); renderCalendar(); });
    next.addEventListener('click', function () { state.view = shiftMonth(state.view, 1); renderCalendar(); });
    head.append(prev, title, next);

    var dow = el('div', 'cal-dow');
    dow.setAttribute('aria-hidden', 'true');
    S().dow.forEach(function (d) { dow.appendChild(el('span', null, d)); });

    var grid = el('div', 'cal-grid');
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-labelledby', 'cal-title');
    for (var i = 0; i < lead; i++) grid.appendChild(el('span', 'cal-pad'));

    var tabbable = null;
    for (var d = 1; d <= daysInMonth; d++) {
      var key = T.keyOf(y, m, d);
      var st = dayState(key);
      var btn = el('button', 'cal-day');
      btn.type = 'button';
      btn.dataset.date = key;
      btn.appendChild(el('span', 'cal-num', String(d)));
      var meta = el('span', 'cal-meta');
      var aria = fmtLongDate(key);
      var parts = [];
      if (key === now.key) { btn.classList.add('is-today'); parts.push(S().aToday); }
      switch (st.kind) {
        case 'available':
          btn.classList.add('is-available');
          meta.textContent = fill(S().free, { n: st.free });
          parts.push(fill(S().aFree, { n: st.free }));
          break;
        case 'full':
          btn.classList.add('is-full', 'is-disabled');
          meta.textContent = S().full; parts.push(S().aFull); btn.disabled = true;
          break;
        case 'passed':
          btn.classList.add('is-disabled', 'is-past');
          meta.textContent = S().passed; parts.push(S().aPassed); btn.disabled = true;
          break;
        case 'holiday':
          btn.classList.add('is-disabled', 'is-closed');
          meta.textContent = S().holiday; parts.push(fill(S().aHoliday, { name: st.name })); btn.disabled = true;
          btn.title = st.name;
          break;
        case 'closed':
          btn.classList.add('is-disabled', 'is-closed');
          meta.textContent = key < now.key ? '' : S().closed; parts.push(S().aClosed); btn.disabled = true;
          break;
        case 'past':
          btn.classList.add('is-disabled', 'is-past'); parts.push(S().aPast); btn.disabled = true;
          break;
        default:
          btn.classList.add('is-disabled', 'is-past'); parts.push(S().aWindow); btn.disabled = true;
      }
      btn.appendChild(meta);
      var selected = key === state.date;
      if (selected) parts.push(S().aSelected);
      btn.setAttribute('aria-pressed', String(selected));
      btn.setAttribute('aria-label', aria + ', ' + parts.join(', '));
      btn.tabIndex = -1;
      if (!btn.disabled && (selected || (!tabbable && !state.date))) tabbable = btn;
      if (!btn.disabled && !tabbable) tabbable = btn;
      grid.appendChild(btn);
    }
    var selBtn = state.date ? grid.querySelector('[data-date="' + state.date + '"]:not([disabled])') : null;
    (selBtn || tabbable || { tabIndex: 0 }).tabIndex = 0;

    grid.addEventListener('click', function (e) {
      var b = e.target.closest('.cal-day');
      if (!b || b.disabled) return;
      selectDate(b.dataset.date);
    });
    grid.addEventListener('keydown', onCalKey);

    var legend = el('div', 'cal-legend');
    legend.setAttribute('aria-hidden', 'true');
    [['lg-free', S().lgFree], ['lg-full', S().lgFull], ['lg-closed', S().lgClosed], ['lg-today', S().lgToday]].forEach(function (x) {
      var s = el('span');
      s.append(el('i', x[0]), document.createTextNode(x[1]));
      legend.appendChild(s);
    });

    calEl.append(head, dow, grid, legend);
    if (focusKey) {
      var f = grid.querySelector('[data-date="' + focusKey + '"]');
      if (f && !f.disabled) f.focus();
    }
  }

  function onCalKey(e) {
    var b = e.target.closest('.cal-day');
    if (!b) return;
    var delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }[e.key];
    var key = b.dataset.date;
    var target = null;
    if (delta) {
      var now = T.now(), end = windowEnd(now.key);
      var k = T.addDays(key, delta);
      var step = delta > 0 ? 1 : -1;
      var guard = 0;
      while (k >= now.key && k <= end && guard++ < 120) {
        if (dayState(k).kind === 'available') { target = k; break; }
        k = T.addDays(k, Math.abs(delta) === 7 ? delta : step);
      }
    } else if (e.key === 'Home' || e.key === 'End') {
      var dow = (T.parseKey(key).getUTCDay() + 6) % 7;
      var k2 = T.addDays(key, e.key === 'Home' ? -dow : 6 - dow);
      target = dayState(k2).kind === 'available' ? k2 : null;
    } else if (e.key === 'PageDown' || e.key === 'PageUp') {
      var ym = shiftMonth(key.slice(0, 7), e.key === 'PageDown' ? 1 : -1);
      target = firstAvailableDay(state, ym + '-01');
      if (target && target.slice(0, 7) !== ym) target = null;
    } else if (e.key === 'Enter' || e.key === ' ') {
      return;
    } else {
      return;
    }
    e.preventDefault();
    if (!target) return;
    state.view = target.slice(0, 7);
    renderCalendar(target);
  }

  function selectDate(key) {
    if (state.date !== key) { state.time = null; state.assigned = null; }
    state.date = key;
    state.view = key.slice(0, 7);
    msg(2, '');
    renderCalendar(key);
    renderSlots();
    renderSummary();
    renderStepper();
    if (window.innerWidth < 900) {
      var r = slotsEl.getBoundingClientRect();
      if (r.top > window.innerHeight - 120) window.scrollTo({ top: window.scrollY + r.top - 110, behavior: M.reduceMotion ? 'auto' : 'smooth' });
    }
  }

  /* ----- Slots ----- */
  function renderSlots() {
    if (!slotsEl) return;
    slotsEl.textContent = '';
    var now = T.now();
    var head = el('div', 'slots-head');

    if (M.api.enabled() && !state.lastLoad) {
      head.append(el('p', 'label', S().loading));
      slotsEl.appendChild(head);
      var list = el('div', 'slot-list');
      for (var i = 0; i < 9; i++) { var sk = el('span', 'skeleton'); sk.style.height = '44px'; list.appendChild(sk); }
      slotsEl.appendChild(list);
      return;
    }

    if (!state.date) {
      var anyDay = firstAvailableDay(state);
      head.append(el('h3', 'slots-title', anyDay ? S().pickDay : ''));
      slotsEl.appendChild(head);
      if (!anyDay) {
        var box = el('div', 'slots-empty');
        box.appendChild(el('p', null, fill(S().noDays, { n: cfg.bookingWindowDays })));
        var call = el('a', 'btn btn--ghost btn--sm', M.cfg.phoneDisplay);
        call.href = 'tel:' + M.cfg.phone;
        box.appendChild(call);
        slotsEl.appendChild(box);
      }
      return;
    }

    var dur = cfg.types[state.type].minutes;
    head.appendChild(el('h3', 'slots-title', fmtDayTitle(state.date)));
    var note;
    if (state.date === now.key) {
      var cutoff = new Date(Date.now() + (cfg.minNoticeMinutes || 0) * 60000 + (cfg.timeZoneOffsetMinutes || 180) * 60000);
      note = fill(S().noteToday, { now: T.fromMin(now.minutes), cutoff: T.pad(cutoff.getUTCHours()) + ':' + T.pad(cutoff.getUTCMinutes()), n: cfg.minNoticeMinutes });
    } else if (T.halfDayName(state.date)) {
      note = fill(S().noteHalf, { name: T.halfDayName(state.date), close: cfg.halfDayClose });
    } else {
      note = fill(S().noteDay, { dur: dur });
    }
    head.appendChild(el('p', 'slots-note', note));
    if (state.loadError) head.appendChild(el('p', 'slots-note', S().liveError));
    slotsEl.appendChild(head);

    var slots = slotsFor(state.date);
    var free = slots.filter(function (s) { return s.state === 'free'; });
    if (!free.length) {
      var empty = el('div', 'slots-empty');
      empty.appendChild(el('p', null, S().empty));
      var nextDay = firstAvailableDay(state, T.addDays(state.date, 1));
      if (nextDay) {
        var go = el('button', 'btn btn--ghost btn--sm', S().emptyNext);
        go.type = 'button';
        go.addEventListener('click', function () { selectDate(nextDay); });
        empty.appendChild(go);
      }
      slotsEl.appendChild(empty);
    }
    if (!slots.length) return;

    var groups = [
      { label: S().morning, test: function (t) { return t < 720; } },
      { label: S().afternoon, test: function (t) { return t >= 720 && t < 1020; } },
      { label: S().evening, test: function (t) { return t >= 1020; } }
    ];
    groups.forEach(function (g) {
      var items = slots.filter(function (s) { return g.test(s.t); });
      if (!items.length) return;
      var wrap = el('div', 'slot-group');
      wrap.setAttribute('role', 'group');
      var gl = el('p', 'label', g.label);
      gl.id = 'slot-g-' + g.label.replace(/\W+/g, '');
      wrap.setAttribute('aria-labelledby', gl.id);
      var list = el('div', 'slot-list');
      items.forEach(function (s) {
        var b = el('button', 'slot', s.time);
        b.type = 'button';
        b.dataset.time = s.time;
        if (s.state !== 'free') {
          b.disabled = true;
          b.title = s.state === 'past' ? S().slotPast : S().slotTaken;
          b.setAttribute('aria-label', s.time + ', ' + b.title);
        } else {
          b.dataset.staff = s.staff;
          b.setAttribute('aria-pressed', String(s.time === state.time));
        }
        list.appendChild(b);
      });
      wrap.append(gl, list);
      slotsEl.appendChild(wrap);
    });
  }
  slotsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.slot');
    if (!b || b.disabled) return;
    state.time = b.dataset.time;
    state.assigned = state.staff === 'any' ? b.dataset.staff : state.staff;
    msg(2, '');
    Array.prototype.forEach.call(slotsEl.querySelectorAll('.slot:not([disabled])'), function (x) {
      x.setAttribute('aria-pressed', String(x === b));
    });
    renderSummary();
    renderStepper();
  });

  /* ----- Step 3 fields ----- */
  var fieldsSubmitted = false;
  function fieldError(name) {
    var f = form.elements[name];
    var v = (f.value || '').trim();
    switch (name) {
      case 'name': return v.length >= 3 && /\S\s+\S/.test(v) ? '' : 'err.fullName';
      case 'phone': return !v ? 'err.phoneReq' : (M.phone.normalize(v) ? '' : 'err.phone');
      case 'email': return !v ? 'err.emailReq' : (M.EMAIL_RE.test(v) ? '' : 'err.email');
      case 'kvkk': return f.checked ? '' : 'err.kvkk';
    }
    return '';
  }
  function showFieldError(name) {
    var key = fieldError(name);
    var f = form.elements[name];
    var box = document.getElementById('b-' + name + '-err');
    if (box) box.textContent = key ? M.t(key) : '';
    f.setAttribute('aria-invalid', key ? 'true' : 'false');
    return !key;
  }
  ['name', 'phone', 'email', 'kvkk'].forEach(function (name) {
    var f = form.elements[name];
    f.addEventListener(f.type === 'checkbox' ? 'change' : 'input', function () {
      if (fieldsSubmitted || f.getAttribute('aria-invalid') === 'true') showFieldError(name);
      renderStepper();
    });
    if (f.type !== 'checkbox') f.addEventListener('blur', function () { if (f.value.trim()) showFieldError(name); });
  });
  form.elements.phone.addEventListener('blur', function () {
    var n = M.phone.normalize(form.elements.phone.value);
    if (n && /^\+90/.test(n)) form.elements.phone.value = M.phone.format(n);
  });

  /* ----- Summary & review ----- */
  function row(dl, cls, label, value, empty) {
    var d = el('div', cls);
    var dt = el('dt', null, label);
    var dd = el('dd', empty ? 'is-empty' : null, value);
    d.append(dt, dd);
    dl.appendChild(d);
    return d;
  }
  function staffLabel() {
    if (state.staff === 'any') {
      return state.assigned ? fill(S().staffAssigned, { name: staffName(state.assigned) }) : S().staffAny;
    }
    return staffName(state.staff);
  }
  function timeRange() {
    if (!state.time) return '';
    return state.time + ' – ' + T.fromMin(T.toMin(state.time) + cfg.types[state.type].minutes);
  }
  function placeLabel() {
    return cfg.types[state.type].mode === 'online' ? S().onlinePlace : (cfg.address[M.lang()] || cfg.address.tr);
  }
  function renderSummary() {
    if (!sumEl) return;
    var s = S();
    sumEl.textContent = '';
    row(sumEl, 'sum-row', s.sum.type, s.type[state.type]);
    row(sumEl, 'sum-row', s.sum.area, areaName(state.area));
    row(sumEl, 'sum-row', s.sum.staff, staffLabel());
    row(sumEl, 'sum-row', s.sum.date, state.date ? fmtLongDate(state.date) : s.sum.none, !state.date);
    row(sumEl, 'sum-row', s.sum.time, state.time ? timeRange() : s.sum.none, !state.time);
    row(sumEl, 'sum-row', s.sum.place, placeLabel());
    feeEl.textContent = fmtPrice(cfg.types[state.type].price);
  }
  function renderReview() {
    var s = S();
    reviewEl.textContent = '';
    var f = form.elements;
    var items = [
      [s.rev.appointment, s.type[state.type] + ' · ' + areaName(state.area) + ' · ' + cfg.types[state.type].minutes + ' dk', 1],
      [s.sum.staff, staffLabel(), 1],
      [s.rev.datetime, fmtLongDate(state.date) + ', ' + timeRange(), 2],
      [s.sum.place, placeLabel(), 1],
      [s.rev.name, f.name.value.trim(), 3],
      [s.rev.phone, M.phone.format(M.phone.normalize(f.phone.value)), 3],
      [s.rev.email, f.email.value.trim(), 3]
    ];
    if (f.note.value.trim()) items.push([s.rev.note, f.note.value.trim(), 3]);
    items.push([s.rev.reminder, f.reminder.checked ? s.rev.yes : s.rev.no, 3]);
    items.forEach(function (it) {
      var r = row(reviewEl, 'review-row', it[0], it[1]);
      var b = el('button', null, s.rev.edit);
      b.type = 'button';
      b.setAttribute('aria-label', s.rev.edit + ': ' + it[0]);
      b.addEventListener('click', function () { goTo(it[2]); });
      r.appendChild(b);
    });
    prepEl.textContent = '';
    prepEl.appendChild(el('p', 'label', s.prepTitle));
    var ul = el('ul');
    (cfg.types[state.type].mode === 'online' ? s.prepOnline : s.prepClinic).forEach(function (p) { ul.appendChild(el('li', null, p)); });
    prepEl.appendChild(ul);
  }

  /* ----- Submit ----- */
  function makeRef() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var out = '';
    var arr = new Uint32Array(5);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(arr); else for (var i = 0; i < 5; i++) arr[i] = Math.floor(Math.random() * 1e9);
    for (var j = 0; j < 5; j++) out += chars[arr[j] % chars.length];
    return 'MZ-' + out;
  }
  function setBusy(on) {
    state.submitting = on;
    submitBtn.disabled = on;
    submitBtn.classList.toggle('is-loading', on);
    submitBtn.setAttribute('aria-busy', String(on));
  }
  function fallbackWa() {
    var f = form.elements;
    return M.waLink(fill(S().waFallback, {
      type: S().type[state.type], staff: staffLabel(),
      date: state.date ? fmtLongDate(state.date) : '', time: state.time || '',
      name: f.name.value.trim(), phone: M.phone.normalize(f.phone.value), email: f.email.value.trim()
    }));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (state.submitting || state.step !== 4) return;
    msg(4, '');
    if (!isSlotFree(state)) { state.time = null; goTo(2); msg(2, S().timeGone); return; }
    if (!validStep(3)) { goTo(3); return; }
    var f = form.elements;
    var slot = slotsFor(state.date).filter(function (s) { return s.time === state.time; })[0];
    var payload = {
      action: 'book',
      type: state.type,
      area: state.area,
      staff: state.staff,
      assigned: state.staff === 'any' ? slot.staff : state.staff,
      date: state.date,
      time: state.time,
      name: f.name.value.trim().replace(/\s+/g, ' '),
      phone: M.phone.normalize(f.phone.value),
      email: f.email.value.trim(),
      note: f.note.value.trim(),
      reminder: !!f.reminder.checked,
      kvkk: !!f.kvkk.checked,
      lang: M.lang(),
      website: f.website.value,
      elapsed: Date.now() - state.started,
      clientNow: new Date().toISOString(),
      tzOffset: new Date().getTimezoneOffset()
    };
    if (payload.website) { finish({ ok: true, ref: makeRef(), staff: payload.assigned, date: payload.date, time: payload.time }, payload, true); return; }

    setBusy(true);
    var request = M.api.enabled()
      ? M.api.post(payload, 25000)
      : new Promise(function (resolve) {
        setTimeout(function () { resolve({ ok: true, demo: true, ref: makeRef(), staff: payload.assigned, date: payload.date, time: payload.time }); }, 900);
      });

    request.then(function (res) {
      if (res && res.ok) { finish(res, payload); return; }
      var code = res && res.error;
      if (code === 'slot_taken' || code === 'too_soon' || code === 'closed') {
        state.time = null; state.assigned = null;
        loadAvailability(true);
        goTo(2);
        msg(2, fill(S().submitErr[code], { n: cfg.minNoticeMinutes }));
      } else {
        msg(4, S().submitErr[code] || S().submitErr.invalid);
      }
    }).catch(function () {
      msg(4, S().submitErr.network, { text: S().submitErr.waLink, href: fallbackWa() });
    }).then(function () { setBusy(false); });
  });

  function finish(res, payload, silentBot) {
    var staffId = cfg.staff[res.staff] ? res.staff : payload.assigned;
    var record = { d: payload.date, t: payload.time, s: staffId, m: cfg.types[payload.type].minutes };
    if (res.demo) {
      var list = demoList();
      list.push({ d: record.d, t: record.t, s: record.s, m: record.m, ref: res.ref, email: payload.email.toLowerCase() });
      demoSave(list);
    } else if (!silentBot) {
      state.busy.push(record);
    }
    state.result = {
      ref: res.ref, demo: !!res.demo, staff: staffId, date: payload.date, time: payload.time,
      type: payload.type, area: payload.area, email: payload.email, name: payload.name, reminder: payload.reminder
    };
    state.assigned = staffId;
    renderDone();
    goTo('done');
    renderNextSlot();
  }

  function icsEscape(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); }
  function icsStamp(ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function buildIcs(r) {
    var s = S();
    var start = T.instantOf(r.date, T.toMin(r.time));
    var end = start + cfg.types[r.type].minutes * 60000;
    var place = cfg.types[r.type].mode === 'online' ? s.onlinePlace : (cfg.address[M.lang()] || cfg.address.tr);
    var lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mizan Beslenme//Randevu//TR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + r.ref + '@mizanbeslenme',
      'DTSTAMP:' + icsStamp(Date.now()),
      'DTSTART:' + icsStamp(start),
      'DTEND:' + icsStamp(end),
      'SUMMARY:' + icsEscape(fill(s.icsSummary, { type: s.type[r.type] })),
      'DESCRIPTION:' + icsEscape(fill(s.icsDesc, { staff: staffName(r.staff), ref: r.ref, phone: cfg.phoneDisplay })),
      'LOCATION:' + icsEscape(place),
      'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsEscape(s.icsAlarm), 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ];
    return lines.join('\r\n') + '\r\n';
  }
  function googleCalUrl(r) {
    var s = S();
    var start = T.instantOf(r.date, T.toMin(r.time));
    var end = start + cfg.types[r.type].minutes * 60000;
    var place = cfg.types[r.type].mode === 'online' ? s.onlinePlace : (cfg.address[M.lang()] || cfg.address.tr);
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(fill(s.icsSummary, { type: s.type[r.type] })) +
      '&dates=' + icsStamp(start) + '/' + icsStamp(end) +
      '&details=' + encodeURIComponent(fill(s.icsDesc, { staff: staffName(r.staff), ref: r.ref, phone: cfg.phoneDisplay })) +
      '&location=' + encodeURIComponent(place);
  }

  function renderDone() {
    var r = state.result;
    if (!r) return;
    var s = S();
    doneEl.textContent = '';
    var icon = el('div', 'done-icon');
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>';
    var title = el('h3', 'bstep-title', s.doneTitle);
    var text = fill(s.doneText, { email: r.email });
    if (cfg.types[r.type].mode === 'online') text += ' ' + s.doneOnline;
    if (r.reminder) text += ' ' + s.doneReminder;
    var p = el('p', 'lede', text);

    var refWrap = el('div', 'done-ref');
    refWrap.appendChild(el('p', 'label', s.doneRef));
    var ref = el('div', 'ref');
    ref.appendChild(el('span', null, r.ref));
    var copy = el('button', 'icon-btn');
    copy.type = 'button';
    copy.setAttribute('aria-label', s.copy);
    copy.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>';
    copy.addEventListener('click', function () {
      var done = function () { M.toast(s.copied); };
      if (navigator.clipboard) navigator.clipboard.writeText(r.ref).then(done, done); else done();
    });
    ref.appendChild(copy);
    refWrap.appendChild(ref);

    var dl = el('dl', 'review');
    row(dl, 'review-row', s.rev.datetime, fmtLongDate(r.date) + ', ' + r.time + ' – ' + T.fromMin(T.toMin(r.time) + cfg.types[r.type].minutes));
    row(dl, 'review-row', s.sum.staff, staffName(r.staff));
    row(dl, 'review-row', s.rev.appointment, s.type[r.type] + ' · ' + areaName(r.area));
    row(dl, 'review-row', s.sum.place, cfg.types[r.type].mode === 'online' ? s.onlinePlace : (cfg.address[M.lang()] || cfg.address.tr));

    var actions = el('div', 'done-actions');
    var ics = el('button', 'btn btn--primary btn--sm', s.ics);
    ics.type = 'button';
    ics.addEventListener('click', function () {
      var blob = new Blob([buildIcs(r)], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = 'mizan-randevu-' + r.ref + '.ics';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    });
    var gcal = el('a', 'btn btn--ghost btn--sm', s.google);
    gcal.href = googleCalUrl(r); gcal.target = '_blank'; gcal.rel = 'noopener noreferrer';
    var wa = el('a', 'btn btn--ghost btn--sm', s.waShare);
    wa.href = M.waLink(fill(s.waText, { date: fmtLongDate(r.date), time: r.time, type: s.type[r.type].toLocaleLowerCase(locale()), ref: r.ref, name: r.name }));
    wa.target = '_blank'; wa.rel = 'noopener noreferrer';
    var again = el('button', 'btn btn--ghost btn--sm', s.again);
    again.type = 'button';
    again.addEventListener('click', function () { resetFlow(); goTo(1); });
    actions.append(ics, gcal, wa, again);

    doneEl.append(icon, title, p, refWrap, dl, actions);
    if (r.demo) doneEl.appendChild(el('p', 'demo-note', s.demo));
  }

  function resetFlow() {
    state.result = null;
    state.date = null; state.time = null; state.assigned = null;
    state.maxStep = 1; state.step = 1;
    state.started = Date.now();
    fieldsSubmitted = false;
    form.elements.note.value = '';
    msg(2, ''); msg(4, '');
  }

  /* ----- Clock, time zone note and live refresh ----- */
  var lastMinute = null;
  function tick() {
    var now = T.now();
    var hhmm = T.fromMin(now.minutes);
    if (clockEl && clockEl.textContent !== hhmm) clockEl.textContent = hhmm;
    if (clockDateEl) {
      var dtxt = fmtDate(now.key, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      if (clockDateEl.textContent !== dtxt) clockDateEl.textContent = dtxt;
    }
    if (tzNote) {
      var local = new Date();
      var differs = local.getTimezoneOffset() !== -(cfg.timeZoneOffsetMinutes || 180);
      tzNote.hidden = !differs;
      if (differs) tzNote.textContent = fill(S().tzNote, { local: T.pad(local.getHours()) + ':' + T.pad(local.getMinutes()), tr: hhmm });
    }
    if (lastMinute !== null && lastMinute !== now.minutes) {
      var before = state.time;
      revalidateSelection();
      if (state.step === 2) { renderCalendar(); renderSlots(); }
      if (before && !state.time && typeof state.step === 'number' && state.step >= 2) { renderSummary(); renderStepper(); }
      renderNextSlot();
    }
    lastMinute = now.minutes;
  }
  setInterval(tick, 1000);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') { tick(); loadAvailability(); }
  });

  function renderAll() {
    renderSummary();
    renderStepper();
    if (state.step === 2) { ensureDate(); renderCalendar(); renderSlots(); }
    if (state.step === 4) renderReview();
    if (state.step === 'done') renderDone();
    renderNextSlot();
  }

  M.onLang(function () {
    syncStaffAvailability();
    renderAll();
    tick();
  });

  /* ----- Cancel dialog ----- */
  var cancelDlg = document.getElementById('cancel-dialog');
  var cancelForm = document.getElementById('cancel-form');
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-open-cancel]')) M.openDialog(cancelDlg);
  });
  if (cancelForm) {
    var cStatus = cancelForm.querySelector('[data-cancel-status]');
    cancelForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var s = S().cancel;
      var ref = cancelForm.elements.ref.value.trim().toUpperCase().replace(/\s+/g, '');
      if (/^MZ[A-Z0-9]{5}$/.test(ref)) ref = 'MZ-' + ref.slice(2);
      var email = cancelForm.elements.email.value.trim();
      var refOk = /^MZ-[A-Z0-9]{5}$/.test(ref);
      var emailOk = M.EMAIL_RE.test(email);
      document.getElementById('x-ref-err').textContent = refOk ? '' : s.refErr;
      document.getElementById('x-email-err').textContent = emailOk ? '' : s.emailErr;
      cancelForm.elements.ref.setAttribute('aria-invalid', String(!refOk));
      cancelForm.elements.email.setAttribute('aria-invalid', String(!emailOk));
      if (!refOk || !emailOk) return;
      cancelForm.elements.ref.value = ref;
      var btn = cancelForm.querySelector('button[type="submit"]');
      var setStatus = function (kind, text) { cStatus.className = 'form-status is-' + kind; cStatus.textContent = text; };

      if (!M.api.enabled()) {
        var list = demoList();
        var idx = -1;
        list.forEach(function (b, i) { if (b.ref === ref && b.email === email.toLowerCase()) idx = i; });
        if (idx < 0) { setStatus('err', s.not_found); return; }
        var start = T.instantOf(list[idx].d, T.toMin(list[idx].t));
        if (start - Date.now() < (cfg.cancelNoticeHours || 24) * 3600000) { setStatus('err', fill(s.too_late, { h: cfg.cancelNoticeHours, phone: cfg.phoneDisplay })); return; }
        list.splice(idx, 1);
        demoSave(list);
        setStatus('ok', s.demoOk);
        renderAll();
        return;
      }
      btn.disabled = true; btn.classList.add('is-loading');
      M.api.post({ action: 'cancel', ref: ref, email: email, lang: M.lang() }).then(function (res) {
        if (res && res.ok) {
          setStatus('ok', s.ok);
          loadAvailability(true);
        } else {
          var code = res && res.error;
          setStatus('err', fill(s[code] || s.error, { h: cfg.cancelNoticeHours, phone: cfg.phoneDisplay }));
        }
      }).catch(function () {
        setStatus('err', fill(s.error, { phone: cfg.phoneDisplay }));
      }).then(function () { btn.disabled = false; btn.classList.remove('is-loading'); });
    });
    cancelDlg.addEventListener('close', function () { cStatus.textContent = ''; });
  }

  /* ----- Summary opens by default only on wide screens ----- */
  var wideQuery = window.matchMedia('(min-width: 1100px)');
  function syncSummaryOpen() { if (summary) summary.open = wideQuery.matches; }
  if (wideQuery.addEventListener) wideQuery.addEventListener('change', syncSummaryOpen);
  syncSummaryOpen();
  if (summary) summary.addEventListener('toggle', function () { if (wideQuery.matches && !summary.open) summary.open = true; });

  /* ----- Public hooks for the chat assistant ----- */
  M.booking = {
    nextAvailable: function (opts) {
      opts = opts || {};
      var sel = { type: opts.type || 'first', area: opts.area || null, staff: opts.staff || 'any' };
      var day = firstAvailableDay(sel);
      if (!day) return null;
      var slot = slotsFor(day, sel).filter(function (s) { return s.state === 'free'; })[0];
      return { date: day, time: slot.time, staff: slot.staff, label: day === T.now().key ? S().today : day === T.addDays(T.now().key, 1) ? S().tomorrow : fmtDate(day, { weekday: 'long', day: 'numeric', month: 'long' }) };
    },
    preselect: preselect,
    ready: function () { return state.loaded || !!state.lastLoad; },
    load: loadAvailability
  };

  /* ----- Boot ----- */
  syncStaffAvailability();
  renderAll();
  tick();
  if ('IntersectionObserver' in window && M.api.enabled()) {
    /* Load live availability right away for the hero card; refresh when the widget scrolls into view. */
    loadAvailability(true);
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) loadAvailability();
    }, { rootMargin: '400px' }).observe(bookingEl);
  } else {
    loadAvailability(true);
  }
})();
