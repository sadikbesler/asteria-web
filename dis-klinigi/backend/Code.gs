/**
 * Mine Ağız ve Diş Sağlığı — Google Apps Script sunucusu
 *
 * Sitedeki iletişim formundan gelen mesajları Google E-Tablolar'daki "Mesajlar"
 * sayfasına yazar, size bildirim e-postası gönderir ve gönderene otomatik yanıt verir.
 *
 * Kurulum adımları için aynı klasördeki KURULUM.md dosyasına bakın.
 * Kodu değiştirdikten sonra: Dağıt → Dağıtımları yönet → kalem simgesi → Sürüm: "Yeni sürüm" → Dağıt.
 */

var CONFIG = {
  CLINIC_NAME: 'Mine Ağız ve Diş Sağlığı Polikliniği',
  CLINIC_EMAIL: '',                    // Boş bırakılırsa bildirimler betiğin sahibine (sizin hesabınıza) gider
  CLINIC_PHONE: '0555 555 55 55',
  SITE_URL: 'https://sadikbesler.github.io/asteria-web/dis-klinigi/',
  TIME_ZONE: 'Europe/Istanbul',

  SEND_CLIENT_EMAILS: true,            // Mesajı gönderene "aldık" e-postası
  MAX_MESSAGES_PER_HOUR: 5,            // Aynı e-posta adresinden saatte en fazla mesaj
  MIN_FILL_SECONDS: 3                  // Formu bundan hızlı dolduran gönderimler bot sayılır
};

/* İletişim formundaki "Konu" seçenekleri — index.html'deki <option value="…"> ile aynı olmalı */
var TOPICS = {
  randevu: 'Randevu talebi',
  agri: 'Diş ağrısı',
  implant: 'İmplant hakkında',
  ortodonti: 'Ortodonti hakkında',
  diger: 'Diğer'
};

var SHEET = {
  name: 'Mesajlar',
  headers: ['Tarih Saat', 'Ad Soyad', 'E-posta', 'Telefon', 'Konu', 'Mesaj', 'Durum'],
  widths: [150, 170, 210, 130, 170, 460, 110]
};
var STATUSES = ['Yeni', 'Arandı', 'Randevu verildi', 'Kapandı'];

var EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
var PHONE_RE = /^\+[1-9]\d{7,14}$/;

var MAIL = {
  subject: 'Mesajınızı aldık · ' + CONFIG.CLINIC_NAME,
  body: 'Merhaba {name},\n\n'
      + 'Mesajınız bize ulaştı. En geç bir iş günü içinde size dönüş yapacağız.\n\n'
      + 'Mesajınız:\n{message}\n\n'
      + 'Diş ağrınız varsa beklemeden bizi arayabilirsiniz: {phone}\n\n'
      + 'Sevgiler,\n{clinic}'
};

/* =====================================================================
   Kurulum — editörden bir kez "setup" fonksiyonunu çalıştırın
   ===================================================================== */

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(CONFIG.TIME_ZONE);
  var sheet = getSheet_();

  var rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build();
  sheet.getRange(2, SHEET.headers.indexOf('Durum') + 1, 2000, 1).setDataValidation(rule);

  /* İzinleri önceden istemek için */
  MailApp.getRemainingDailyQuota();
}

/* =====================================================================
   Web uygulaması
   ===================================================================== */

function doGet() {
  return json_({ ok: true, service: 'mine-dis' });
}

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.action === 'message') return json_(message_(data));
    return json_({ ok: false, error: 'bad_request' });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server' });
  }
}

function message_(data) {
  var m = {
    name: String(data.name || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    email: String(data.email || '').trim().slice(0, 120),
    phone: String(data.phone || '').replace(/[^\d+]/g, ''),
    topic: TOPICS[data.topic] ? data.topic : 'diger',
    message: String(data.message || '').trim().slice(0, 2000)
  };
  if (m.name.length < 2 || !EMAIL_RE.test(m.email) || m.message.length < 10) return { ok: false, error: 'invalid' };
  if (m.phone && !PHONE_RE.test(m.phone)) return { ok: false, error: 'invalid' };

  /* Bot tuzağı: gizli alan doldurulmuşsa ya da form insan için fazla hızlı doldurulmuşsa
     başarılı görünen bir yanıt dönüp kaydı atlıyoruz. */
  if (String(data.website || '') || Number(data.elapsed || 0) < CONFIG.MIN_FILL_SECONDS * 1000) return { ok: true };

  var cache = CacheService.getScriptCache();
  var key = 'msg:' + hash_(m.email.toLowerCase());
  var count = Number(cache.get(key) || 0);
  if (count >= CONFIG.MAX_MESSAGES_PER_HOUR) return { ok: false, error: 'rate_limited' };

  getSheet_().appendRow([new Date(), safe_(m.name), safe_(m.email), safe_(m.phone), TOPICS[m.topic], safe_(m.message), 'Yeni']);
  cache.put(key, String(count + 1), 3600);

  try {
    MailApp.sendEmail({
      to: clinicEmail_(),
      replyTo: m.email,
      subject: 'Yeni web sitesi mesajı: ' + m.name + ' · ' + TOPICS[m.topic],
      body: 'Ad Soyad: ' + m.name + '\nE-posta: ' + m.email + '\nTelefon: ' + (m.phone || '-')
          + '\nKonu: ' + TOPICS[m.topic] + '\n\n' + m.message,
      name: CONFIG.CLINIC_NAME + ' · Web sitesi'
    });
  } catch (err) { console.error('message mail', err); }

  if (CONFIG.SEND_CLIENT_EMAILS) {
    try {
      MailApp.sendEmail({
        to: m.email,
        subject: MAIL.subject,
        body: fill_(MAIL.body, {
          name: firstName_(m.name), message: m.message,
          clinic: CONFIG.CLINIC_NAME, phone: CONFIG.CLINIC_PHONE
        }),
        name: CONFIG.CLINIC_NAME,
        replyTo: clinicEmail_()
      });
    } catch (err) { console.error('message confirm', err); }
  }
  return { ok: true };
}

/* =====================================================================
   Yardımcılar
   ===================================================================== */

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET.name);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET.name);
    sheet.getRange(1, 1, 1, SHEET.headers.length).setValues([SHEET.headers])
      .setFontWeight('bold').setBackground('#EFEFEF');
    sheet.setFrozenRows(1);
    SHEET.widths.forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
    /* Telefonların başındaki sıfır kaybolmasın diye metin biçimi */
    sheet.getRange(2, 4, 2000, 1).setNumberFormat('@');
  }
  return sheet;
}

/* Hücreye "=" veya "+" ile başlayan bir metin gelirse formül sayılmasın */
function safe_(value) {
  var s = String(value == null ? '' : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function hash_(s) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s))).slice(0, 24);
}
function clinicEmail_() { return CONFIG.CLINIC_EMAIL || Session.getEffectiveUser().getEmail(); }
function firstName_(name) { return String(name).split(' ')[0]; }
function fill_(s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }); }
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
