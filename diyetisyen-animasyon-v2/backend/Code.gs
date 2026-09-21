/**
 * Mizan Beslenme — Google Apps Script sunucusu
 *
 * Sitedeki formlardan gelen kayıtları Google E-Tablolar'a yazar:
 *   • Randevular   – online randevular (çakışma, geçmiş saat ve çalışma saati kontrolüyle)
 *   • Kapalı Günler – izin, kongre vb. için kapatmak istediğiniz gün veya saatler
 *   • Mesajlar     – iletişim formu
 *   • Geri Arama   – sohbet asistanından gelen "beni arayın" talepleri
 *
 * Kurulum adımları için aynı klasördeki KURULUM.md dosyasına bakın.
 * Kodu değiştirdikten sonra: Dağıt → Dağıtımları yönet → kalem simgesi → Sürüm: "Yeni sürüm" → Dağıt.
 *
 * ÖNEMLİ: Uzman, görüşme türü veya çalışma saatlerini değiştirirseniz sitedeki
 * assets/js/config.js dosyasını da aynı şekilde güncelleyin.
 */

var CONFIG = {
  CLINIC_NAME: 'Mizan Beslenme ve Diyet Kliniği',
  CLINIC_EMAIL: '',                    // Boş bırakılırsa bildirimler betiğin sahibine (sizin hesabınıza) gider
  CLINIC_PHONE: '0555 555 55 55',
  CLINIC_ADDRESS: { tr: 'Moda Cad. No: 48, Kat 3, Kadıköy / İstanbul', en: 'Moda Cad. No: 48, Floor 3, Kadıköy, Istanbul' },
  SITE_URL: 'https://sadikbesler.github.io/asteria-web/diyetisyen-animasyon-v2/',
  TIME_ZONE: 'Europe/Istanbul',
  TZ_OFFSET_MIN: 180,                  // Türkiye UTC+3 (yaz saati yok)

  ADD_TO_CALENDAR: true,               // Randevuları Google Takvim'e de ekler
  CALENDAR_ID: '',                     // Boş: varsayılan takviminiz. Başka takvim için kimliğini yazın.
  SEND_CLIENT_EMAILS: true,            // Danışana onay / iptal / hatırlatma e-postası
  REMINDER_HOUR: 10,                   // Hatırlatma e-postalarının gönderileceği saat (bir gün önce)

  MIN_NOTICE_MIN: 60,                  // En erken: şu an + 60 dk
  NOTICE_TOLERANCE_MIN: 5,             // Bilgisayar saati kayması için tolerans
  WINDOW_DAYS: 60,                     // Kaç gün sonrasına kadar randevu alınabilir
  STEP_MIN: 30,
  CANCEL_NOTICE_HOURS: 24,
  HALF_DAY_CLOSE: '13:00',

  MAX_BOOKINGS_PER_HOUR: 3,            // Aynı telefon/e-postadan saatte en fazla randevu
  MAX_MESSAGES_PER_HOUR: 5
};

var TYPES = {
  first:   { minutes: 60, price: 1800, mode: 'clinic', tr: 'İlk görüşme', en: 'First consultation' },
  control: { minutes: 30, price: 900,  mode: 'clinic', tr: 'Kontrol görüşmesi', en: 'Follow-up visit' },
  online:  { minutes: 45, price: 1500, mode: 'online', tr: 'Online görüşme', en: 'Online consultation' }
};

var AREAS = {
  weight: { tr: 'Kilo yönetimi', en: 'Weight management' },
  clinical: { tr: 'Klinik beslenme', en: 'Clinical nutrition' },
  sports: { tr: 'Sporcu beslenmesi', en: 'Sports nutrition' },
  pregnancy: { tr: 'Gebelik ve emzirme', en: 'Pregnancy & breastfeeding' },
  kids: { tr: 'Çocuk ve ergen', en: 'Children & teens' },
  other: { tr: 'Diğer', en: 'Other' }
};

/* 0 = Pazar, 1 = Pazartesi … 6 = Cumartesi */
var STAFF = {
  selin: {
    name: 'Uzm. Dyt. Selin Karaca', short: 'Selin',
    areas: ['weight', 'clinical', 'pregnancy', 'other'],
    hours: { 1: [['09:00', '12:30'], ['13:30', '17:00']], 2: [['09:00', '12:30'], ['13:30', '17:00']], 3: [['09:00', '12:30'], ['13:30', '17:00']], 4: [['09:00', '12:30'], ['13:30', '17:00']], 5: [['09:00', '12:30'], ['13:30', '17:00']] }
  },
  emre: {
    name: 'Dyt. Emre Aksoy', short: 'Emre',
    areas: ['weight', 'sports', 'other'],
    hours: { 2: [['12:00', '15:30'], ['16:00', '20:00']], 4: [['12:00', '15:30'], ['16:00', '20:00']], 6: [['10:00', '15:00']] }
  },
  zeynep: {
    name: 'Dyt. Zeynep Tunalı', short: 'Zeynep',
    areas: ['weight', 'pregnancy', 'kids', 'other'],
    hours: { 1: [['10:00', '13:00'], ['14:00', '18:00']], 3: [['10:00', '13:00'], ['14:00', '18:00']], 5: [['10:00', '13:00'], ['14:00', '18:00']], 6: [['10:00', '14:00']] }
  }
};

var HOLIDAYS_FIXED = ['01-01', '04-23', '05-01', '05-19', '07-15', '08-30', '10-29'];
var HOLIDAYS = ['2026-03-20', '2026-03-21', '2026-03-22', '2026-05-27', '2026-05-28', '2026-05-29', '2026-05-30',
  '2027-03-09', '2027-03-10', '2027-03-11', '2027-05-16', '2027-05-17', '2027-05-18', '2027-05-19'];
var HALF_DAYS = ['10-28', '2026-03-19', '2026-05-26', '2027-03-08', '2027-05-15'];

var SHEETS = {
  bookings: {
    name: 'Randevular',
    headers: ['Oluşturulma', 'Referans', 'Durum', 'Tarih', 'Saat', 'Bitiş', 'Süre (dk)', 'Görüşme', 'Konu', 'Uzman', 'Uzman Kodu', 'Ad Soyad', 'Telefon', 'E-posta', 'Not', 'Hatırlatma', 'Dil', 'Takvim Etkinliği', 'İptal Zamanı', 'Hatırlatma Gönderildi'],
    widths: [150, 90, 120, 95, 60, 60, 70, 150, 140, 170, 90, 170, 130, 210, 280, 90, 50, 120, 150, 150]
  },
  closures: {
    name: 'Kapalı Günler',
    headers: ['Tarih', 'Uzman (boş = tüm klinik)', 'Başlangıç (boş = tüm gün)', 'Bitiş', 'Açıklama'],
    widths: [110, 190, 180, 90, 300]
  },
  messages: {
    name: 'Mesajlar',
    headers: ['Tarih Saat', 'Ad Soyad', 'E-posta', 'Telefon', 'Konu', 'Mesaj', 'Dil', 'Durum'],
    widths: [150, 170, 210, 130, 150, 420, 50, 110]
  },
  callbacks: {
    name: 'Geri Arama',
    headers: ['Tarih Saat', 'Ad Soyad', 'Telefon', 'Durum', 'Dil', 'Sayfa'],
    widths: [150, 170, 130, 110, 50, 260]
  }
};
var COL = {}; SHEETS.bookings.headers.forEach(function (h, i) { COL[h] = i; });

var STATUS = { confirmed: 'Onaylandı', cancelledClient: 'İptal (danışan)', cancelledClinic: 'İptal (klinik)', done: 'Tamamlandı', noShow: 'Gelmedi' };
var TOPICS = { booking: 'Randevu hakkında', pricing: 'Ücretler ve paketler', corporate: 'Kurumsal program', other: 'Diğer' };

var EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
var PHONE_RE = /^\+[1-9]\d{7,14}$/;

/* =====================================================================
   Kurulum
   ===================================================================== */

/** Kurulumda bir kez çalıştırın: sayfaları oluşturur, izinleri ister, hatırlatma tetikleyicisini kurar. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(CONFIG.TIME_ZONE);
  Object.keys(SHEETS).forEach(function (key) { getSheet_(key); });

  var bookings = getSheet_('bookings');
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([STATUS.confirmed, STATUS.cancelledClient, STATUS.cancelledClinic, STATUS.done, STATUS.noShow], true)
    .setAllowInvalid(false).build();
  bookings.getRange(2, COL['Durum'] + 1, 2000, 1).setDataValidation(statusRule);
  var staffRule = SpreadsheetApp.newDataValidation().requireValueInList(Object.keys(STAFF), true).setAllowInvalid(false).build();
  bookings.getRange(2, COL['Uzman Kodu'] + 1, 2000, 1).setDataValidation(staffRule);

  var range = bookings.getRange('A2:T2000');
  bookings.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=LEFT($C2,5)="İptal"').setFontColor('#9A9A9A').setStrikethrough(true).setRanges([range]).build()
  ]);

  var closures = getSheet_('closures');
  if (closures.getLastRow() === 1) {
    closures.getRange('A1').setNote('Tarih: 2026-10-05 veya 05.10.2026\nUzman: boş = tüm klinik, ya da selin / emre / zeynep\nBaşlangıç–Bitiş: boş = tüm gün, ya da 14:00 – 18:00');
  }

  /* Günlük hatırlatma tetikleyicisi */
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'sendReminders') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('sendReminders').timeBased().everyDays(1).atHour(CONFIG.REMINDER_HOUR).inTimezone(CONFIG.TIME_ZONE).create();

  /* İzinleri önceden istemek için */
  MailApp.getRemainingDailyQuota();
  if (CONFIG.ADD_TO_CALENDAR) getCalendar_();
}

/* =====================================================================
   Web uygulaması
   ===================================================================== */

function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.action === 'availability') return json_(availability_(p.from, p.to));
    return json_({ ok: true, service: 'mizan-beslenme' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    switch (data.action) {
      case 'book': return json_(book_(data));
      case 'cancel': return json_(cancel_(data));
      case 'message': return json_(message_(data));
      case 'callback': return json_(callback_(data));
      default: return json_({ ok: false, error: 'bad_request' });
    }
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

/* =====================================================================
   Doluluk
   ===================================================================== */

function availability_(from, to) {
  var today = nowParts_().key;
  if (!isKey_(from) || from < today) from = today;
  var maxTo = addDays_(today, CONFIG.WINDOW_DAYS + 1);
  if (!isKey_(to) || to > maxTo) to = maxTo;

  var busy = readBookings_().filter(function (b) {
    return b.active && b.date >= from && b.date <= to;
  }).map(function (b) {
    return { d: b.date, t: b.time, m: b.minutes, s: b.staff };
  });
  var closures = readClosures_().filter(function (c) { return c.d >= from && c.d <= to; });
  return { ok: true, busy: busy, closures: closures, now: nowParts_().key + ' ' + fromMin_(nowParts_().minutes) };
}

/* =====================================================================
   Randevu
   ===================================================================== */

function book_(data) {
  var d = {
    type: String(data.type || ''),
    area: String(data.area || ''),
    staff: String(data.staff || ''),
    assigned: String(data.assigned || ''),
    date: String(data.date || ''),
    time: String(data.time || ''),
    name: String(data.name || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    phone: String(data.phone || '').replace(/[^\d+]/g, ''),
    email: String(data.email || '').trim().slice(0, 120),
    note: String(data.note || '').trim().slice(0, 600),
    reminder: data.reminder === true,
    lang: data.lang === 'en' ? 'en' : 'tr'
  };
  if (!TYPES[d.type] || !AREAS[d.area]) return { ok: false, error: 'invalid' };
  if (d.staff !== 'any' && !STAFF[d.staff]) return { ok: false, error: 'invalid' };
  if (!isKey_(d.date) || !/^\d{2}:\d{2}$/.test(d.time)) return { ok: false, error: 'invalid' };
  if (d.name.length < 3 || !/\S\s+\S/.test(d.name)) return { ok: false, error: 'invalid' };
  if (!PHONE_RE.test(d.phone) || !EMAIL_RE.test(d.email)) return { ok: false, error: 'invalid' };
  if (data.kvkk !== true) return { ok: false, error: 'invalid' };

  /* Botlar: sahte başarı döndür, kaydetme */
  if (String(data.website || '') || Number(data.elapsed || 0) < 4000) {
    return { ok: true, ref: makeRef_({}), staff: STAFF[d.assigned] ? d.assigned : 'selin', date: d.date, time: d.time };
  }

  var cache = CacheService.getScriptCache();
  var rateKey = 'book:' + hash_(d.phone) + ':' + hash_(d.email.toLowerCase());
  var count = Number(cache.get(rateKey) || 0);
  if (count >= CONFIG.MAX_BOOKINGS_PER_HOUR) return { ok: false, error: 'rate_limited' };

  var type = TYPES[d.type];
  var startMin = toMin_(d.time);
  var endMin = startMin + type.minutes;

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  var row, staffId, ref, eventId = '';
  try {
    var now = nowParts_();
    if (d.date > addDays_(now.key, CONFIG.WINDOW_DAYS)) return { ok: false, error: 'closed' };
    var startInstant = instantOf_(d.date, startMin);
    if (startInstant < Date.now() + (CONFIG.MIN_NOTICE_MIN - CONFIG.NOTICE_TOLERANCE_MIN) * 60000) return { ok: false, error: 'too_soon' };
    if (isHoliday_(d.date)) return { ok: false, error: 'closed' };

    var bookings = readBookings_();
    var closures = readClosures_();
    var candidates;
    if (d.staff === 'any') {
      candidates = Object.keys(STAFF).filter(function (id) { return STAFF[id].areas.indexOf(d.area) >= 0; });
      if (STAFF[d.assigned] && candidates.indexOf(d.assigned) >= 0) {
        candidates = [d.assigned].concat(candidates.filter(function (id) { return id !== d.assigned; }));
      }
    } else {
      if (STAFF[d.staff].areas.indexOf(d.area) < 0) return { ok: false, error: 'invalid' };
      candidates = [d.staff];
    }

    var fitsSomewhere = false;
    staffId = null;
    for (var i = 0; i < candidates.length && !staffId; i++) {
      var id = candidates[i];
      var blocks = blocksFor_(id, d.date, closures);
      var fits = blocks.some(function (b) { return startMin >= b[0] && endMin <= b[1] && (startMin - b[0]) % CONFIG.STEP_MIN === 0; });
      if (!fits) continue;
      fitsSomewhere = true;
      var clash = bookings.some(function (b) {
        return b.active && b.staff === id && b.date === d.date && startMin < toMin_(b.time) + b.minutes && endMin > toMin_(b.time);
      });
      if (!clash) staffId = id;
    }
    if (!staffId) return { ok: false, error: fitsSomewhere ? 'slot_taken' : 'closed' };

    ref = makeRef_(bookings.reduce(function (acc, b) { acc[b.ref] = true; return acc; }, {}));
    if (CONFIG.ADD_TO_CALENDAR) {
      try { eventId = createEvent_(d, staffId, ref); } catch (err) { console.error('calendar', err); }
    }
    row = [
      new Date(), ref, STATUS.confirmed, d.date, d.time, fromMin_(endMin), type.minutes,
      TYPES[d.type].tr, AREAS[d.area].tr, STAFF[staffId].name, staffId,
      safe_(d.name), safe_(d.phone), safe_(d.email), safe_(d.note),
      d.reminder ? 'Evet' : 'Hayır', d.lang.toUpperCase(), eventId, '', ''
    ];
    getSheet_('bookings').appendRow(row);
    SpreadsheetApp.flush();
    cache.put(rateKey, String(count + 1), 3600);
  } finally {
    lock.releaseLock();
  }

  try { notifyClinicBooking_(d, staffId, ref); } catch (err) { console.error('clinic mail', err); }
  if (CONFIG.SEND_CLIENT_EMAILS) {
    try { confirmClientBooking_(d, staffId, ref); } catch (err) { console.error('client mail', err); }
  }
  return { ok: true, ref: ref, staff: staffId, date: d.date, time: d.time };
}

function cancel_(data) {
  var ref = String(data.ref || '').trim().toUpperCase();
  var email = String(data.email || '').trim().toLowerCase();
  var lang = data.lang === 'en' ? 'en' : 'tr';
  if (!/^MZ-[A-Z0-9]{5}$/.test(ref) || !EMAIL_RE.test(email)) return { ok: false, error: 'not_found' };

  var cache = CacheService.getScriptCache();
  var rateKey = 'cancel:' + hash_(email);
  var count = Number(cache.get(rateKey) || 0);
  if (count >= 10) return { ok: false, error: 'rate_limited' };
  cache.put(rateKey, String(count + 1), 3600);

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  var booking;
  try {
    var sheet = getSheet_('bookings');
    var found = readBookings_().filter(function (b) { return b.ref === ref && b.email.toLowerCase() === email; })[0];
    if (!found) return { ok: false, error: 'not_found' };
    if (!found.active) return { ok: false, error: 'already' };
    var start = instantOf_(found.date, toMin_(found.time));
    if (start - Date.now() < CONFIG.CANCEL_NOTICE_HOURS * 3600000) return { ok: false, error: 'too_late' };
    sheet.getRange(found.row, COL['Durum'] + 1).setValue(STATUS.cancelledClient);
    sheet.getRange(found.row, COL['İptal Zamanı'] + 1).setValue(new Date());
    SpreadsheetApp.flush();
    booking = found;
  } finally {
    lock.releaseLock();
  }

  if (booking.eventId) {
    try { var ev = getCalendar_().getEventById(booking.eventId); if (ev) ev.deleteEvent(); } catch (err) { console.error('calendar delete', err); }
  }
  try {
    MailApp.sendEmail({
      to: clinicEmail_(),
      subject: 'Randevu iptal edildi: ' + booking.name + ' · ' + trDate_(booking.date) + ' ' + booking.time,
      body: 'Danışan randevusunu site üzerinden iptal etti.\n\nReferans: ' + booking.ref + '\nDanışan: ' + booking.name + '\nTelefon: ' + booking.phone + '\nTarih: ' + trDate_(booking.date) + ' ' + booking.time + '\nUzman: ' + (STAFF[booking.staff] ? STAFF[booking.staff].name : booking.staff),
      name: CONFIG.CLINIC_NAME + ' · Web sitesi'
    });
  } catch (err) { console.error('cancel clinic mail', err); }
  if (CONFIG.SEND_CLIENT_EMAILS) {
    try {
      var t = MAIL[lang];
      MailApp.sendEmail({
        to: booking.email,
        subject: t.cancelSubject,
        body: fill_(t.cancelBody, { name: firstName_(booking.name), date: longDate_(booking.date, lang), time: booking.time, ref: booking.ref, site: CONFIG.SITE_URL, phone: CONFIG.CLINIC_PHONE, clinic: CONFIG.CLINIC_NAME }),
        name: CONFIG.CLINIC_NAME,
        replyTo: clinicEmail_()
      });
    } catch (err) { console.error('cancel client mail', err); }
  }
  return { ok: true };
}

/* =====================================================================
   İletişim formu ve geri arama
   ===================================================================== */

function message_(data) {
  var m = {
    name: String(data.name || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    email: String(data.email || '').trim().slice(0, 120),
    phone: String(data.phone || '').replace(/[^\d+]/g, ''),
    topic: TOPICS[data.topic] ? data.topic : 'other',
    message: String(data.message || '').trim().slice(0, 2000),
    lang: data.lang === 'en' ? 'en' : 'tr'
  };
  if (m.name.length < 2 || !EMAIL_RE.test(m.email) || m.message.length < 10) return { ok: false, error: 'invalid' };
  if (m.phone && !PHONE_RE.test(m.phone)) return { ok: false, error: 'invalid' };
  if (String(data.website || '') || Number(data.elapsed || 0) < 3000) return { ok: true };

  var cache = CacheService.getScriptCache();
  var key = 'msg:' + hash_(m.email.toLowerCase());
  var count = Number(cache.get(key) || 0);
  if (count >= CONFIG.MAX_MESSAGES_PER_HOUR) return { ok: false, error: 'rate_limited' };

  getSheet_('messages').appendRow([new Date(), safe_(m.name), safe_(m.email), safe_(m.phone), TOPICS[m.topic], safe_(m.message), m.lang.toUpperCase(), 'Yeni']);
  cache.put(key, String(count + 1), 3600);

  try {
    MailApp.sendEmail({
      to: clinicEmail_(),
      replyTo: m.email,
      subject: 'Yeni web sitesi mesajı: ' + m.name + ' · ' + TOPICS[m.topic],
      body: 'Ad Soyad: ' + m.name + '\nE-posta: ' + m.email + '\nTelefon: ' + (m.phone || '-') + '\nKonu: ' + TOPICS[m.topic] + '\nDil: ' + m.lang.toUpperCase() + '\n\n' + m.message,
      name: CONFIG.CLINIC_NAME + ' · Web sitesi'
    });
  } catch (err) { console.error('message mail', err); }
  if (CONFIG.SEND_CLIENT_EMAILS) {
    try {
      var t = MAIL[m.lang];
      MailApp.sendEmail({ to: m.email, subject: t.messageSubject, body: fill_(t.messageBody, { name: firstName_(m.name), message: m.message, clinic: CONFIG.CLINIC_NAME, phone: CONFIG.CLINIC_PHONE }), name: CONFIG.CLINIC_NAME, replyTo: clinicEmail_() });
    } catch (err) { console.error('message confirm', err); }
  }
  return { ok: true };
}

function callback_(data) {
  var c = {
    name: String(data.name || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    phone: String(data.phone || '').replace(/[^\d+]/g, ''),
    lang: data.lang === 'en' ? 'en' : 'tr',
    page: String(data.page || '').slice(0, 200)
  };
  if (c.name.length < 3 || !PHONE_RE.test(c.phone)) return { ok: false, error: 'invalid' };
  if (String(data.website || '')) return { ok: true };

  var cache = CacheService.getScriptCache();
  var key = 'cb:' + hash_(c.phone);
  if (cache.get(key)) return { ok: true };
  getSheet_('callbacks').appendRow([new Date(), safe_(c.name), safe_(c.phone), 'Aranacak', c.lang.toUpperCase(), safe_(c.page)]);
  cache.put(key, '1', 1800);

  try {
    MailApp.sendEmail({
      to: clinicEmail_(),
      subject: 'Geri arama talebi: ' + c.name,
      body: 'Sohbet asistanı üzerinden geri arama talebi geldi.\n\nAd Soyad: ' + c.name + '\nTelefon: ' + c.phone + '\nDil: ' + c.lang.toUpperCase() + '\nSayfa: ' + c.page,
      name: CONFIG.CLINIC_NAME + ' · Web sitesi'
    });
  } catch (err) { console.error('callback mail', err); }
  return { ok: true };
}

/* =====================================================================
   Hatırlatmalar (her gün CONFIG.REMINDER_HOUR'da çalışır)
   ===================================================================== */

function sendReminders() {
  if (!CONFIG.SEND_CLIENT_EMAILS) return;
  var tomorrow = addDays_(nowParts_().key, 1);
  var sheet = getSheet_('bookings');
  readBookings_().forEach(function (b) {
    if (!b.active || b.date !== tomorrow || b.reminder !== 'Evet' || b.reminderSent) return;
    if (!EMAIL_RE.test(b.email)) return;
    var lang = b.lang === 'EN' ? 'en' : 'tr';
    var t = MAIL[lang];
    var type = TYPES[typeKeyFromLabel_(b.typeLabel)] || TYPES.first;
    try {
      MailApp.sendEmail({
        to: b.email,
        subject: fill_(t.reminderSubject, { time: b.time }),
        body: fill_(t.reminderBody, {
          name: firstName_(b.name), date: longDate_(b.date, lang), time: b.time,
          staff: STAFF[b.staff] ? STAFF[b.staff].name : '', place: type.mode === 'online' ? t.onlinePlace : CONFIG.CLINIC_ADDRESS[lang],
          ref: b.ref, phone: CONFIG.CLINIC_PHONE, clinic: CONFIG.CLINIC_NAME, prep: type.mode === 'online' ? t.prepOnline : t.prepClinic
        }),
        name: CONFIG.CLINIC_NAME,
        replyTo: clinicEmail_()
      });
      sheet.getRange(b.row, COL['Hatırlatma Gönderildi'] + 1).setValue(new Date());
    } catch (err) { console.error('reminder', b.ref, err); }
  });
}

/* =====================================================================
   E-posta metinleri
   ===================================================================== */

var MAIL = {
  tr: {
    bookSubject: 'Randevunuz onaylandı · {date} {time}',
    bookBody: 'Merhaba {name},\n\nRandevunuz oluşturuldu.\n\nReferans kodu: {ref}\nGörüşme: {type} ({minutes} dk)\nKonu: {area}\nUzman: {staff}\nTarih: {date}\nSaat: {time} – {end}\nYer: {place}\nÜcret: {price}\n\n{prep}\n\nRandevunuzu {cancelHours} saat öncesine kadar sitemizdeki “Randevu iptali” bölümünden, referans kodunuz ve e-posta adresinizle iptal edebilirsiniz:\n{site}#randevu\nDaha yakın saatlerdeki değişiklikler için lütfen bizi arayın: {phone}\n\nTakviminize eklemek için ekteki .ics dosyasını açabilirsiniz.\n\nSevgiler,\n{clinic}',
    prepClinic: 'Görüşmeden önce:\n— Randevu saatinden 10 dakika önce gelmeniz yeterli.\n— Vücut analizi için son 2 saatte ağır yemek yememeye, son 12 saatte yoğun egzersiz yapmamaya çalışın.\n— Varsa son 3 aydaki tahlillerinizi ve kullandığınız ilaçların listesini getirin.',
    prepOnline: 'Görüşmeden önce:\n— Görüntülü görüşme bağlantısı randevudan önce ayrıca e-postanıza gönderilecek.\n— Sessiz bir ortam ve sabit bir internet bağlantısı yeterli.\n— Varsa tartı ve mezuranızı yanınızda bulundurun.',
    onlinePlace: 'Online (görüntülü görüşme)',
    cancelSubject: 'Randevunuz iptal edildi',
    cancelBody: 'Merhaba {name},\n\n{date} saat {time} tarihli randevunuz ({ref}) iptal edildi.\n\nYeni bir randevu almak için: {site}#randevu\nSorularınız için: {phone}\n\nSevgiler,\n{clinic}',
    reminderSubject: 'Yarın saat {time} randevunuz var',
    reminderBody: 'Merhaba {name},\n\nYarınki randevunuzu hatırlatmak istedik.\n\nTarih: {date}\nSaat: {time}\nUzman: {staff}\nYer: {place}\nReferans: {ref}\n\n{prep}\n\nGelemeyecekseniz lütfen bizi arayın: {phone}\n\nSevgiler,\n{clinic}',
    messageSubject: 'Mesajınızı aldık · Mizan Beslenme',
    messageBody: 'Merhaba {name},\n\nMesajınız bize ulaştı. En geç bir iş günü içinde dönüş yapacağız.\n\nMesajınız:\n{message}\n\nAcil durumlar için: {phone}\n\nSevgiler,\n{clinic}'
  },
  en: {
    bookSubject: 'Your appointment is confirmed · {date} {time}',
    bookBody: 'Hello {name},\n\nYour appointment has been booked.\n\nReference: {ref}\nAppointment: {type} ({minutes} min)\nTopic: {area}\nDietitian: {staff}\nDate: {date}\nTime: {time} – {end}\nPlace: {place}\nFee: {price}\n\n{prep}\n\nYou can cancel up to {cancelHours} hours beforehand under “Cancel a booking” on our website, using your reference code and email address:\n{site}?lang=en#randevu\nFor changes closer to the time, please call us: {phone}\n\nOpen the attached .ics file to add the appointment to your calendar.\n\nBest wishes,\n{clinic}',
    prepClinic: 'Before your appointment:\n— Arriving 10 minutes early is enough.\n— For the body analysis, avoid a heavy meal in the last 2 hours and intense exercise in the last 12 hours.\n— Bring blood tests from the last 3 months and a list of your medication, if you have them.',
    prepOnline: 'Before your appointment:\n— The video link will be emailed to you separately before the appointment.\n— A quiet room and a stable connection are all you need.\n— Keep a scale and a tape measure nearby if you have them.',
    onlinePlace: 'Online (video call)',
    cancelSubject: 'Your appointment has been cancelled',
    cancelBody: 'Hello {name},\n\nYour appointment on {date} at {time} ({ref}) has been cancelled.\n\nTo book again: {site}?lang=en#randevu\nQuestions: {phone}\n\nBest wishes,\n{clinic}',
    reminderSubject: 'Reminder: your appointment tomorrow at {time}',
    reminderBody: 'Hello {name},\n\nA quick reminder about your appointment tomorrow.\n\nDate: {date}\nTime: {time}\nDietitian: {staff}\nPlace: {place}\nReference: {ref}\n\n{prep}\n\nIf you can’t make it, please call us: {phone}\n\nBest wishes,\n{clinic}',
    messageSubject: 'We received your message · Mizan Nutrition',
    messageBody: 'Hello {name},\n\nYour message has reached us and we will reply within one working day.\n\nYour message:\n{message}\n\nFor anything urgent: {phone}\n\nBest wishes,\n{clinic}'
  }
};

function confirmClientBooking_(d, staffId, ref) {
  var t = MAIL[d.lang];
  var type = TYPES[d.type];
  var vars = {
    name: firstName_(d.name), ref: ref, type: type[d.lang], minutes: type.minutes, area: AREAS[d.area][d.lang],
    staff: STAFF[staffId].name, date: longDate_(d.date, d.lang), time: d.time, end: fromMin_(toMin_(d.time) + type.minutes),
    place: type.mode === 'online' ? t.onlinePlace : CONFIG.CLINIC_ADDRESS[d.lang],
    price: formatPrice_(type.price, d.lang), prep: type.mode === 'online' ? t.prepOnline : t.prepClinic,
    cancelHours: CONFIG.CANCEL_NOTICE_HOURS, site: CONFIG.SITE_URL, phone: CONFIG.CLINIC_PHONE, clinic: CONFIG.CLINIC_NAME
  };
  var ics = Utilities.newBlob(buildIcs_(d, staffId, ref), 'text/calendar', 'mizan-randevu-' + ref + '.ics');
  MailApp.sendEmail({
    to: d.email,
    subject: fill_(t.bookSubject, { date: shortDate_(d.date), time: d.time }),
    body: fill_(t.bookBody, vars),
    name: CONFIG.CLINIC_NAME,
    replyTo: clinicEmail_(),
    attachments: [ics]
  });
}

function notifyClinicBooking_(d, staffId, ref) {
  var type = TYPES[d.type];
  MailApp.sendEmail({
    to: clinicEmail_(),
    replyTo: d.email,
    subject: 'Yeni randevu: ' + d.name + ' · ' + trDate_(d.date) + ' ' + d.time + ' · ' + STAFF[staffId].short,
    body: 'Web sitesinden yeni randevu alındı.\n\n' +
      'Referans: ' + ref + '\n' +
      'Tarih: ' + longDate_(d.date, 'tr') + '\n' +
      'Saat: ' + d.time + ' – ' + fromMin_(toMin_(d.time) + type.minutes) + '\n' +
      'Görüşme: ' + type.tr + ' (' + type.minutes + ' dk)\n' +
      'Konu: ' + AREAS[d.area].tr + '\n' +
      'Uzman: ' + STAFF[staffId].name + (d.staff === 'any' ? ' (danışan fark etmez dedi)' : '') + '\n\n' +
      'Danışan: ' + d.name + '\n' +
      'Telefon: ' + d.phone + '\n' +
      'E-posta: ' + d.email + '\n' +
      'Hatırlatma: ' + (d.reminder ? 'İstiyor' : 'İstemiyor') + '\n' +
      'Dil: ' + d.lang.toUpperCase() + '\n\n' +
      'Not:\n' + (d.note || '-') + '\n\n' +
      'Randevular tablosu: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    name: CONFIG.CLINIC_NAME + ' · Web sitesi'
  });
}

/* =====================================================================
   Takvim
   ===================================================================== */

function getCalendar_() {
  return CONFIG.CALENDAR_ID ? CalendarApp.getCalendarById(CONFIG.CALENDAR_ID) : CalendarApp.getDefaultCalendar();
}

function createEvent_(d, staffId, ref) {
  var type = TYPES[d.type];
  var start = new Date(instantOf_(d.date, toMin_(d.time)));
  var end = new Date(start.getTime() + type.minutes * 60000);
  var ev = getCalendar_().createEvent(
    type.tr + ' · ' + d.name + ' (' + STAFF[staffId].short + ')',
    start, end,
    {
      description: 'Referans: ' + ref + '\nKonu: ' + AREAS[d.area].tr + '\nTelefon: ' + d.phone + '\nE-posta: ' + d.email + '\nNot: ' + (d.note || '-'),
      location: type.mode === 'online' ? 'Online' : CONFIG.CLINIC_ADDRESS.tr
    }
  );
  return ev.getId();
}

function buildIcs_(d, staffId, ref) {
  var type = TYPES[d.type];
  var t = MAIL[d.lang];
  var start = instantOf_(d.date, toMin_(d.time));
  var end = start + type.minutes * 60000;
  var stamp = function (ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
  var escIcs = function (s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); };
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mizan Beslenme//Randevu//TR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:' + ref + '@mizanbeslenme',
    'DTSTAMP:' + stamp(Date.now()),
    'DTSTART:' + stamp(start),
    'DTEND:' + stamp(end),
    'SUMMARY:' + escIcs('Mizan Beslenme · ' + type[d.lang]),
    'DESCRIPTION:' + escIcs(STAFF[staffId].name + '\n' + ref + '\n' + CONFIG.CLINIC_PHONE),
    'LOCATION:' + escIcs(type.mode === 'online' ? t.onlinePlace : CONFIG.CLINIC_ADDRESS[d.lang]),
    'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:' + escIcs(type[d.lang]), 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n') + '\r\n';
}

/* =====================================================================
   Tablo okuma
   ===================================================================== */

function getSheet_(key) {
  var def = SHEETS[key];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(def.name) || ss.insertSheet(def.name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(def.headers);
    sheet.getRange(1, 1, 1, def.headers.length).setFontWeight('bold').setBackground('#F1EDE3');
    sheet.setFrozenRows(1);
    def.widths.forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
    sheet.getRange(2, 1, 2000, 1).setNumberFormat('dd.mm.yyyy hh:mm');
    if (key === 'bookings') {
      ['Referans', 'Tarih', 'Saat', 'Bitiş', 'Telefon', 'Uzman Kodu'].forEach(function (h) {
        sheet.getRange(2, COL[h] + 1, 2000, 1).setNumberFormat('@');
      });
      sheet.getRange(2, COL['İptal Zamanı'] + 1, 2000, 2).setNumberFormat('dd.mm.yyyy hh:mm');
    }
    if (key === 'closures') {
      sheet.getRange(2, 1, 2000, 4).setNumberFormat('@');
    }
    if (key === 'messages' || key === 'callbacks') {
      sheet.getRange(2, 4, 2000, 1).setNumberFormat('@');
      if (key === 'callbacks') sheet.getRange(2, 3, 2000, 1).setNumberFormat('@');
    }
  }
  return sheet;
}

function readBookings_() {
  var sheet = getSheet_('bookings');
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  var values = sheet.getRange(2, 1, last - 1, SHEETS.bookings.headers.length).getValues();
  var out = [];
  values.forEach(function (r, i) {
    var date = parseDate_(r[COL['Tarih']], tz);
    var time = parseTime_(r[COL['Saat']], tz);
    if (!date || !time) return;
    var staff = staffFrom_(r[COL['Uzman Kodu']]) || staffFrom_(r[COL['Uzman']]);
    if (!staff) return;
    var status = String(r[COL['Durum']] || '');
    out.push({
      row: i + 2,
      ref: String(r[COL['Referans']] || '').trim().toUpperCase(),
      active: status.indexOf('İptal') !== 0,
      date: date,
      time: time,
      minutes: Number(r[COL['Süre (dk)']]) || 30,
      typeLabel: String(r[COL['Görüşme']] || ''),
      staff: staff,
      name: String(r[COL['Ad Soyad']] || '').replace(/^'/, ''),
      phone: String(r[COL['Telefon']] || '').replace(/^'/, ''),
      email: String(r[COL['E-posta']] || '').replace(/^'/, ''),
      reminder: String(r[COL['Hatırlatma']] || ''),
      lang: String(r[COL['Dil']] || 'TR'),
      eventId: String(r[COL['Takvim Etkinliği']] || ''),
      reminderSent: !!r[COL['Hatırlatma Gönderildi']]
    });
  });
  return out;
}

function readClosures_() {
  var sheet = getSheet_('closures');
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  return sheet.getRange(2, 1, last - 1, 4).getValues().map(function (r) {
    var date = parseDate_(r[0], tz);
    if (!date) return null;
    var who = String(r[1] || '').trim();
    var staff = who ? staffFrom_(who) : null;
    if (who && !staff) return null;
    var from = r[2] === '' ? null : parseTime_(r[2], tz);
    var to = r[3] === '' ? null : parseTime_(r[3], tz);
    return { d: date, s: staff, from: from, to: from ? (to || '23:59') : null };
  }).filter(Boolean);
}

function blocksFor_(id, key, closures) {
  var dow = new Date(Date.UTC(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10))).getUTCDay();
  var hours = STAFF[id].hours[dow];
  if (!hours || isHoliday_(key)) return [];
  var blocks = hours.map(function (h) { return [toMin_(h[0]), toMin_(h[1])]; });
  if (isHalfDay_(key)) {
    var close = toMin_(CONFIG.HALF_DAY_CLOSE);
    blocks = blocks.map(function (b) { return [b[0], Math.min(b[1], close)]; }).filter(function (b) { return b[1] > b[0]; });
  }
  closures.forEach(function (c) {
    if (c.d !== key || (c.s && c.s !== id)) return;
    if (!c.from) { blocks = []; return; }
    var f = toMin_(c.from), t = toMin_(c.to);
    var next = [];
    blocks.forEach(function (b) {
      if (t <= b[0] || f >= b[1]) { next.push(b); return; }
      if (f > b[0]) next.push([b[0], f]);
      if (t < b[1]) next.push([t, b[1]]);
    });
    blocks = next;
  });
  return blocks;
}

/* =====================================================================
   Yardımcılar
   ===================================================================== */

function nowParts_() {
  var now = new Date();
  var key = Utilities.formatDate(now, CONFIG.TIME_ZONE, 'yyyy-MM-dd');
  var hm = Utilities.formatDate(now, CONFIG.TIME_ZONE, 'HH:mm');
  return { key: key, minutes: toMin_(hm) };
}
function isKey_(v) { return /^\d{4}-\d{2}-\d{2}$/.test(String(v || '')); }
function toMin_(hhmm) { var p = String(hhmm).split(':'); return Number(p[0]) * 60 + Number(p[1]); }
function fromMin_(min) { var h = Math.floor(min / 60), m = min % 60; return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; }
function addDays_(key, n) {
  var d = new Date(Date.UTC(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10)));
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function instantOf_(key, minutes) {
  return Date.UTC(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10)) + minutes * 60000 - CONFIG.TZ_OFFSET_MIN * 60000;
}
function isHoliday_(key) { return HOLIDAYS.indexOf(key) >= 0 || HOLIDAYS_FIXED.indexOf(key.slice(5)) >= 0; }
function isHalfDay_(key) { return HALF_DAYS.indexOf(key) >= 0 || HALF_DAYS.indexOf(key.slice(5)) >= 0; }

function parseDate_(v, tz) {
  if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, tz, 'yyyy-MM-dd');
  var s = String(v || '').trim().replace(/^'/, '');
  if (isKey_(s)) return s;
  var m = /^(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})$/.exec(s);
  if (m) return m[3] + '-' + (m[2].length < 2 ? '0' : '') + m[2] + '-' + (m[1].length < 2 ? '0' : '') + m[1];
  return null;
}
function parseTime_(v, tz) {
  if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, tz, 'HH:mm');
  var s = String(v || '').trim().replace(/^'/, '').replace('.', ':');
  var m = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (!m || +m[1] > 23 || +m[2] > 59) return null;
  return (m[1].length < 2 ? '0' : '') + m[1] + ':' + m[2];
}
function staffFrom_(v) {
  var s = String(v || '').toLocaleLowerCase('tr').trim();
  if (!s) return null;
  if (STAFF[s]) return s;
  var ids = Object.keys(STAFF);
  for (var i = 0; i < ids.length; i++) {
    if (s.indexOf(STAFF[ids[i]].short.toLocaleLowerCase('tr')) >= 0) return ids[i];
  }
  return null;
}
function typeKeyFromLabel_(label) {
  var keys = Object.keys(TYPES);
  for (var i = 0; i < keys.length; i++) if (TYPES[keys[i]].tr === label) return keys[i];
  return 'first';
}

function makeRef_(existing) {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (var attempt = 0; attempt < 50; attempt++) {
    var ref = 'MZ-';
    for (var i = 0; i < 5; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
    if (!existing[ref]) return ref;
  }
  return 'MZ-' + String(Date.now()).slice(-5);
}
function hash_(s) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s))).slice(0, 24);
}
function clinicEmail_() { return CONFIG.CLINIC_EMAIL || Session.getEffectiveUser().getEmail(); }
function firstName_(name) { return String(name).split(' ')[0]; }
function fill_(s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }); }
function formatPrice_(n, lang) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : '.') + ' TL'; }

var DAY_NAMES = { tr: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'], en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] };
var MONTH_NAMES = { tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'], en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
function longDate_(key, lang) {
  var y = +key.slice(0, 4), m = +key.slice(5, 7), d = +key.slice(8, 10);
  var dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return lang === 'en'
    ? DAY_NAMES.en[dow] + ', ' + d + ' ' + MONTH_NAMES.en[m - 1] + ' ' + y
    : d + ' ' + MONTH_NAMES.tr[m - 1] + ' ' + y + ', ' + DAY_NAMES.tr[dow];
}
function trDate_(key) { return key.slice(8, 10) + '.' + key.slice(5, 7) + '.' + key.slice(0, 4); }
function shortDate_(key) { return trDate_(key); }

/** Tabloda formül olarak çalışmasın diye =, +, -, @ ile başlayan metinlerin önüne ' ekler. */
function safe_(value) {
  var s = String(value == null ? '' : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
