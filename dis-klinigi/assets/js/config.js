/*
 * Mine Ağız ve Diş Sağlığı — site ayarları
 *
 * Sitedeki iletişim bilgileri, çalışma saatleri ve iletişim formunun bağlandığı
 * Google E-Tablolar adresi bu dosyadan yönetilir.
 *
 * ÖNEMLİ: Çalışma saatlerini değiştirirseniz iletişim bölümündeki saat tablosunu
 * (index.html içinde) da aynı şekilde güncelleyin; "şu an açık mı" bilgisi buradan,
 * tablodaki yazılar HTML'den gelir.
 */
window.MINE_CONFIG = {
  /* Google Apps Script "Web uygulaması" adresi (…/exec). Kurulum: backend/KURULUM.md
     Boş bırakılırsa iletişim formu demo modunda çalışır: mesaj kimseye gitmez. */
  endpoint: '',

  /* Demo notu: sayfanın altında "Bu bir demo görünümüdür" şeridi gösterilir.
     Siteyi gerçek bir kliniğe kurarken false yapın (footer'daki "Demo site" yazısını da silin). */
  demo: true,

  siteUrl: 'https://sadikbesler.github.io/asteria-web/dis-klinigi/',
  whatsapp: '905555555555',
  phone: '+905555555555',
  phoneDisplay: '0555 555 55 55',
  email: 'iletisim@minedis.com',
  instagram: 'https://instagram.com/minedisklinigi',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bar%C4%B1%C5%9F+Mahallesi+Ata%C5%9Fehir+%C4%B0stanbul',
  address: 'Barış Mah. Menekşe Sok. No: 14, Kat 1, Ataşehir / İstanbul',

  timeZoneOffsetMinutes: 180,   // Türkiye saati (UTC+3, yaz saati uygulaması yok)

  /* Kliniğin çalışma saatleri (1 = Pazartesi … 6 = Cumartesi, 0 = Pazar) */
  clinicHours: {
    1: ['09:00', '19:00'], 2: ['09:00', '19:00'], 3: ['09:00', '19:00'],
    4: ['09:00', '19:00'], 5: ['09:00', '19:00'], 6: ['09:00', '14:00']
  },

  /* Resmî tatiller: tam gün kapalı. Her yıl tekrar edenler + yıla özel dinî bayramlar. */
  holidaysFixed: {
    '01-01': 'Yılbaşı',
    '04-23': 'Ulusal Egemenlik ve Çocuk Bayramı',
    '05-01': 'Emek ve Dayanışma Günü',
    '05-19': 'Atatürk’ü Anma, Gençlik ve Spor Bayramı',
    '07-15': 'Demokrasi ve Millî Birlik Günü',
    '08-30': 'Zafer Bayramı',
    '10-29': 'Cumhuriyet Bayramı'
  },
  holidays: {
    '2026-03-20': 'Ramazan Bayramı',
    '2026-03-21': 'Ramazan Bayramı',
    '2026-03-22': 'Ramazan Bayramı',
    '2026-05-27': 'Kurban Bayramı',
    '2026-05-28': 'Kurban Bayramı',
    '2026-05-29': 'Kurban Bayramı',
    '2026-05-30': 'Kurban Bayramı',
    '2027-03-09': 'Ramazan Bayramı',
    '2027-03-10': 'Ramazan Bayramı',
    '2027-03-11': 'Ramazan Bayramı',
    '2027-05-16': 'Kurban Bayramı',
    '2027-05-17': 'Kurban Bayramı',
    '2027-05-18': 'Kurban Bayramı',
    '2027-05-19': 'Kurban Bayramı'
  },
  /* Arife günleri: saat 13:00'te kapanış */
  halfDays: {
    '10-28': 'Cumhuriyet Bayramı arifesi',
    '2026-03-19': 'Ramazan Bayramı arifesi',
    '2026-05-26': 'Kurban Bayramı arifesi',
    '2027-03-08': 'Ramazan Bayramı arifesi',
    '2027-05-15': 'Kurban Bayramı arifesi'
  },
  halfDayClose: '13:00'
};
