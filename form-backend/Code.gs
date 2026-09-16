/**
 * Asteria Soft — iletişim formu sunucusu (Google Apps Script)
 *
 * 1. adım "sendCode": form bilgilerini kontrol eder, 6 haneli kodu e-posta ile yollar.
 * 2. adım "verify":   kod doğruysa kaydı "Mesajlar" sayfasına tarih-saatle ekler
 *                     ve size bildirim e-postası gönderir.
 *
 * Kurulum adımları sohbette anlatıldı. Kod değiştirildikten sonra
 * Dağıt → Dağıtımları yönet → Düzenle → "Yeni sürüm" seçilmelidir.
 */

var SHEET_NAME = 'Mesajlar';
var TIME_ZONE = 'Europe/Istanbul';
var NOTIFY_EMAIL = ''; // Boş kalırsa betiğin sahibine (sizin hesabınıza) gönderilir.

var CODE_TTL_SEC = 600;        // Kod 10 dakika geçerli
var MAX_ATTEMPTS = 5;          // Bir kod için en fazla deneme
var RESEND_COOLDOWN_SEC = 60;  // Aynı adrese yeniden kod göndermeden önce bekleme
var MAX_CODES_PER_HOUR = 5;    // Aynı adrese saatte en fazla kod

var HEADERS = ['Tarih Saat', 'Ad Soyad', 'E-posta', 'Telefon', 'Hizmet', 'Mesaj', 'Dil'];
var SERVICES = { web: 'Web Tasarım', seo: 'SEO Optimizasyonu', randevu: 'Akıllı Randevu Sistemi', ai: 'Yapay Zeka Chatbot' };
var EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
var PHONE_RE = /^\+[1-9]\d{7,14}$/;

var MAIL_TEXT = {
  tr: { subject: 'Asteria Soft doğrulama kodunuz: {code}', body: 'Merhaba {name},\n\nMesajınızı göndermek için doğrulama kodunuz:\n\n{code}\n\nKod 10 dakika geçerlidir. Bu isteği siz yapmadıysanız bu e-postayı yok sayabilirsiniz.\n\nAsteria Soft' },
  en: { subject: 'Your Asteria Soft verification code: {code}', body: 'Hello {name},\n\nYour verification code to send your message is:\n\n{code}\n\nThe code is valid for 10 minutes. If you did not request this, you can ignore this email.\n\nAsteria Soft' },
  de: { subject: 'Ihr Asteria Soft Bestätigungscode: {code}', body: 'Hallo {name},\n\nIhr Bestätigungscode zum Senden Ihrer Nachricht lautet:\n\n{code}\n\nDer Code ist 10 Minuten gültig. Falls Sie dies nicht angefordert haben, können Sie diese E-Mail ignorieren.\n\nAsteria Soft' },
  ar: { subject: 'رمز التحقق من Asteria Soft: {code}', body: 'مرحبًا {name}،\n\nرمز التحقق لإرسال رسالتك هو:\n\n{code}\n\nالرمز صالح لمدة 10 دقائق. إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة.\n\nAsteria Soft' },
  es: { subject: 'Su código de verificación de Asteria Soft: {code}', body: 'Hola, {name}:\n\nSu código de verificación para enviar su mensaje es:\n\n{code}\n\nEl código es válido durante 10 minutos. Si no lo ha solicitado, puede ignorar este correo.\n\nAsteria Soft' }
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
    if (data.action === 'sendCode') return json_(sendCode_(data));
    if (data.action === 'verify') return json_(verify_(data));
    return json_({ ok: false, error: 'bad_request' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

function doGet() {
  return json_({ ok: true, service: 'asteria-contact' });
}

function sendCode_(data) {
  var entry = cleanEntry_(data);
  if (!entry) return { ok: false, error: 'invalid' };
  if (String(data.honeypot || '')) return { ok: true, token: Utilities.getUuid() };

  var cache = CacheService.getScriptCache();
  var emailKey = Utilities.base64EncodeWebSafe(entry.email.toLowerCase());
  if (cache.get('cooldown:' + emailKey)) return { ok: false, error: 'rate_limited' };
  var sent = Number(cache.get('count:' + emailKey) || 0);
  if (sent >= MAX_CODES_PER_HOUR) return { ok: false, error: 'rate_limited' };

  var code = String(Math.floor(100000 + Math.random() * 900000));
  var token = Utilities.getUuid();
  entry.code = code;
  entry.attempts = 0;
  cache.put('pending:' + token, JSON.stringify(entry), CODE_TTL_SEC);

  var text = MAIL_TEXT[entry.lang] || MAIL_TEXT.tr;
  MailApp.sendEmail({
    to: entry.email,
    subject: text.subject.replace('{code}', code),
    body: text.body.replace('{name}', entry.name).replace('{code}', code),
    name: 'Asteria Soft'
  });

  cache.put('cooldown:' + emailKey, '1', RESEND_COOLDOWN_SEC);
  cache.put('count:' + emailKey, String(sent + 1), 3600);
  return { ok: true, token: token };
}

function verify_(data) {
  var token = String(data.token || '');
  var code = String(data.code || '').replace(/\D/g, '');
  if (!token || code.length !== 6) return { ok: false, error: 'wrong_code' };

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var cache = CacheService.getScriptCache();
    var raw = cache.get('pending:' + token);
    if (!raw) return { ok: false, error: 'expired' };
    var entry = JSON.parse(raw);

    if (entry.code !== code) {
      entry.attempts += 1;
      if (entry.attempts >= MAX_ATTEMPTS) {
        cache.remove('pending:' + token);
        return { ok: false, error: 'expired' };
      }
      cache.put('pending:' + token, JSON.stringify(entry), CODE_TTL_SEC);
      return { ok: false, error: 'wrong_code' };
    }

    cache.remove('pending:' + token);
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
    notifyOwner_(entry, now);
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

/** Sunucu tarafında da tüm alanları kontrol eder; hatalıysa null döner. */
function cleanEntry_(data) {
  var entry = {
    name: String(data.fullname || '').trim().slice(0, 100),
    email: String(data.email || '').trim().slice(0, 254),
    phone: String(data.phone || '').replace(/[^\d+]/g, ''),
    service: String(data.service || ''),
    message: String(data.message || '').trim().slice(0, 3000),
    lang: MAIL_TEXT[data.lang] ? data.lang : 'tr'
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

/** Tabloda formül olarak çalışmasın diye =, +, -, @ ile başlayan metinlerin önüne ' ekler. */
function safe_(value) {
  var s = String(value == null ? '' : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
