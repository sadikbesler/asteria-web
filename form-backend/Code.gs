/**
 * Asteria Soft — iletişim formu sunucusu (Google Apps Script)
 *
 * Form gönderildiğinde:
 *  1. Bilgileri kontrol eder ve "Mesajlar" sayfasına tarih-saatle kaydeder.
 *  2. Size bildirim e-postası gönderir.
 *  3. Formu dolduran kişiye "talebinizi aldık" e-postası gönderir.
 *
 * Kod değiştirildikten sonra
 * Dağıt → Dağıtımları yönet → kalem simgesi → Sürüm: "Yeni sürüm" → Dağıt yapılmalıdır.
 */

var SHEET_NAME = 'Mesajlar';
var TIME_ZONE = 'Europe/Istanbul';
var NOTIFY_EMAIL = ''; // Boş kalırsa betiğin sahibine (sizin hesabınıza) gönderilir.

var SUBMIT_COOLDOWN_SEC = 30;    // Aynı adresten iki gönderim arası bekleme
var MAX_SUBMITS_PER_HOUR = 5;    // Aynı adresten saatte en fazla gönderim

var HEADERS = ['Tarih Saat', 'Ad Soyad', 'E-posta', 'Telefon', 'Hizmet', 'Mesaj', 'Dil'];
var SERVICES = { web: 'Web Tasarım', seo: 'SEO Optimizasyonu', randevu: 'Akıllı Randevu Sistemi', ai: 'Yapay Zeka Chatbot' };
var EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
var PHONE_RE = /^\+[1-9]\d{7,14}$/;

var CONFIRM_TEXT = {
  tr: { subject: 'Talebinizi aldık — Asteria Soft', body: 'Merhaba {name},\n\nTalebinizi aldık, teşekkür ederiz. Ekibimiz mesajınızı inceleyip en kısa sürede sizinle iletişime geçecek.\n\nMesajınız:\n{message}\n\nSevgiler,\nAsteria Soft' },
  en: { subject: 'We received your request — Asteria Soft', body: 'Hello {name},\n\nThank you, we have received your request. Our team will review your message and get back to you shortly.\n\nYour message:\n{message}\n\nBest regards,\nAsteria Soft' },
  de: { subject: 'Wir haben Ihre Anfrage erhalten — Asteria Soft', body: 'Hallo {name},\n\nvielen Dank, wir haben Ihre Anfrage erhalten. Unser Team prüft Ihre Nachricht und meldet sich in Kürze bei Ihnen.\n\nIhre Nachricht:\n{message}\n\nMit freundlichen Grüßen\nAsteria Soft' },
  ar: { subject: 'استلمنا طلبك — Asteria Soft', body: 'مرحبًا {name}،\n\nشكرًا لك، لقد استلمنا طلبك. سيراجع فريقنا رسالتك ويتواصل معك قريبًا.\n\nرسالتك:\n{message}\n\nمع أطيب التحيات،\nAsteria Soft' },
  es: { subject: 'Hemos recibido su solicitud — Asteria Soft', body: 'Hola, {name}:\n\nGracias, hemos recibido su solicitud. Nuestro equipo revisará su mensaje y se pondrá en contacto con usted en breve.\n\nSu mensaje:\n{message}\n\nSaludos cordiales,\nAsteria Soft' }
};

/** Kurulumda bir kez çalıştırın: sayfayı ve başlıkları oluşturur, izinleri ister. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(TIME_ZONE);
  getSheet_();
  MailApp.getRemainingDailyQuota();
}

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.action === 'submit') return json_(submit_(data));
    return json_({ ok: false, error: 'bad_request' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

function doGet() {
  return json_({ ok: true, service: 'asteria-contact' });
}

function submit_(data) {
  var entry = cleanEntry_(data);
  if (!entry) return { ok: false, error: 'invalid' };
  if (String(data.honeypot || '')) return { ok: true };

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var cache = CacheService.getScriptCache();
    var emailKey = Utilities.base64EncodeWebSafe(entry.email.toLowerCase());
    if (cache.get('cooldown:' + emailKey)) return { ok: false, error: 'rate_limited' };
    var count = Number(cache.get('count:' + emailKey) || 0);
    if (count >= MAX_SUBMITS_PER_HOUR) return { ok: false, error: 'rate_limited' };

    var now = new Date();
    getSheet_().appendRow([
      now,
      safe_(entry.name),
      safe_(entry.email),
      safe_(entry.phone),
      safe_(SERVICES[entry.service]),
      safe_(entry.message),
      entry.lang.toUpperCase()
    ]);
    cache.put('cooldown:' + emailKey, '1', SUBMIT_COOLDOWN_SEC);
    cache.put('count:' + emailKey, String(count + 1), 3600);
  } finally {
    lock.releaseLock();
  }

  // Kayıt yapıldıktan sonra e-postalar gider; biri başarısız olsa bile kayıt kaybolmaz.
  try { notifyOwner_(entry, new Date()); } catch (err) { console.error('owner mail', err); }
  try { confirmToSender_(entry); } catch (err) { console.error('confirm mail', err); }
  return { ok: true };
}

/** Sunucu tarafında da tüm alanları kontrol eder; hatalıysa null döner. */
function cleanEntry_(data) {
  var entry = {
    name: String(data.fullname || '').trim().slice(0, 100),
    email: String(data.email || '').trim().slice(0, 254),
    phone: String(data.phone || '').replace(/[^\d+]/g, ''),
    service: String(data.service || ''),
    message: String(data.message || '').trim().slice(0, 3000),
    lang: CONFIRM_TEXT[data.lang] ? data.lang : 'tr'
  };
  if (entry.name.length < 2) return null;
  if (!EMAIL_RE.test(entry.email)) return null;
  if (!PHONE_RE.test(entry.phone)) return null;
  if (!SERVICES[entry.service]) return null;
  if (entry.message.length < 10) return null;
  return entry;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('dd.mm.yyyy hh:mm:ss');
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(6, 420);
  }
  return sheet;
}

function notifyOwner_(entry, date) {
  var to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
  if (!to) return;
  MailApp.sendEmail({
    to: to,
    replyTo: entry.email,
    subject: 'Yeni web sitesi mesajı: ' + entry.name,
    body: 'Tarih Saat: ' + Utilities.formatDate(date, TIME_ZONE, 'dd.MM.yyyy HH:mm:ss') + '\n' +
      'Ad Soyad: ' + entry.name + '\n' +
      'E-posta: ' + entry.email + '\n' +
      'Telefon: ' + entry.phone + '\n' +
      'Hizmet: ' + SERVICES[entry.service] + '\n' +
      'Dil: ' + entry.lang.toUpperCase() + '\n\n' +
      entry.message,
    name: 'Asteria Soft Web Sitesi'
  });
}

function confirmToSender_(entry) {
  var text = CONFIRM_TEXT[entry.lang] || CONFIRM_TEXT.tr;
  MailApp.sendEmail({
    to: entry.email,
    subject: text.subject,
    body: text.body.replace('{name}', function () { return entry.name; }).replace('{message}', function () { return entry.message; }),
    name: 'Asteria Soft'
  });
}

/** Tabloda formül olarak çalışmasın diye =, +, -, @ ile başlayan metinlerin önüne ' ekler. */
function safe_(value) {
  var s = String(value == null ? '' : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
