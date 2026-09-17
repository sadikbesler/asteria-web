/*
 * Neva Güzellik — site ayarları
 *
 * Sitedeki iletişim bilgileri, randevu kuralları, uzmanların çalışma saatleri
 * ve Google E-Tablolar bağlantısı bu dosyadan yönetilir.
 *
 * ÖNEMLİ: Uzman, seans türü veya çalışma saati değiştirirseniz aynı değişikliği
 * backend/Code.gs içindeki ayarlarda da yapın. Sunucu, her randevuyu bu kurallarla
 * yeniden kontrol eder.
 */
window.NEVA_CONFIG = {
  /* Google Apps Script "Web uygulaması" adresi (…/exec). Kurulum: backend/KURULUM.md
     Boş bırakılırsa site demo modunda çalışır: randevular yalnızca bu tarayıcıda saklanır. */
  endpoint: '',

  /* Demo notu: sayfanın altında "Bu bir demo görünümüdür" şeridi gösterilir.
     Siteyi gerçek bir merkeze kurarken false yapın (footer'daki "Demo site" yazısını da silin). */
  demo: true,

  siteUrl: 'https://sadikbesler.github.io/neva-guzellik/',
  whatsapp: '905555555555',
  phone: '+905555555555',
  phoneDisplay: '0555 555 55 55',
  email: 'randevu@nevaguzellik.com',
  instagram: 'https://instagram.com/nevaguzellik',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Te%C5%9Fvikiye+Cad+Ni%C5%9Fanta%C5%9F%C4%B1+%C5%9Ei%C5%9Fli+%C4%B0stanbul',
  address: {
    tr: 'Teşvikiye Cad. No: 21, Kat 2, Nişantaşı — Şişli / İstanbul',
    en: 'Teşvikiye Cad. No: 21, Floor 2, Nişantaşı — Şişli, Istanbul'
  },

  /* Randevu kuralları */
  timeZoneOffsetMinutes: 180,   // Türkiye saati (UTC+3, yaz saati uygulaması yok)
  minNoticeMinutes: 90,         // Bugün için en erken: şu an + 90 dk
  bookingWindowDays: 45,        // Bugünden itibaren kaç gün sonrasına randevu alınabilir
  slotStepMinutes: 30,          // Saat aralıkları
  cancelNoticeHours: 24,        // Online iptal için en az kaç saat kala

  /* Seans türleri: süre (dk), ücret (TL, 0 = ücretsiz), yer */
  types: {
    analysis: { minutes: 30, price: 0,    mode: 'center' },
    single:   { minutes: 60, price: 2400, mode: 'center' },
    package:  { minutes: 45, price: 1750, mode: 'center' }
  },

  /* Uygulama alanları */
  areas: ['skin', 'laser', 'spot', 'body', 'brow', 'bridal'],

  /* Uzmanlar ve haftalık çalışma saatleri (1 = Pazartesi … 6 = Cumartesi, 0 = Pazar) */
  staff: {
    derya: {
      name: 'Derya Aydın',
      nameEn: 'Derya Aydın',
      short: 'Derya',
      title: 'Kurucu · cilt bakım uzmanı',
      titleEn: 'Founder · skin care specialist',
      photo: 'uzman-derya-560.webp',
      areas: ['skin', 'spot', 'bridal', 'body'],
      hours: {
        1: [['10:00', '14:00'], ['15:00', '19:00']],
        2: [['10:00', '14:00'], ['15:00', '19:00']],
        3: [['10:00', '14:00'], ['15:00', '19:00']],
        4: [['10:00', '14:00'], ['15:00', '19:00']],
        5: [['10:00', '14:00'], ['15:00', '18:00']]
      }
    },
    pelin: {
      name: 'Pelin Sarıkaya',
      nameEn: 'Pelin Sarıkaya',
      short: 'Pelin',
      title: 'Lazer ve epilasyon uzmanı',
      titleEn: 'Laser & hair removal specialist',
      photo: 'uzman-pelin-560.webp',
      areas: ['laser', 'body', 'skin'],
      hours: {
        2: [['12:00', '16:00'], ['16:30', '20:00']],
        3: [['12:00', '16:00'], ['16:30', '20:00']],
        4: [['12:00', '16:00'], ['16:30', '20:00']],
        5: [['12:00', '16:00'], ['16:30', '20:00']],
        6: [['10:00', '17:00']]
      }
    },
    ece: {
      name: 'Ece Demirtaş',
      nameEn: 'Ece Demirtaş',
      short: 'Ece',
      title: 'Kaş tasarımı ve bakım uzmanı',
      titleEn: 'Brow design & treatment specialist',
      photo: 'uzman-ece-560.webp',
      areas: ['brow', 'skin', 'bridal'],
      hours: {
        1: [['11:00', '15:00'], ['16:00', '20:00']],
        3: [['11:00', '15:00'], ['16:00', '20:00']],
        5: [['11:00', '15:00'], ['16:00', '20:00']],
        6: [['10:00', '16:00']]
      }
    }
  },

  /* Merkezin genel çalışma saatleri (iletişim bölümündeki "şu an açık mı" bilgisi) */
  clinicHours: {
    1: ['10:00', '20:00'], 2: ['10:00', '20:00'], 3: ['10:00', '20:00'],
    4: ['10:00', '20:00'], 5: ['10:00', '20:00'], 6: ['10:00', '18:00']
  },

  /* Resmî tatiller: tam gün kapalı. Her yıl tekrar edenler + yıla özel dinî bayramlar. */
  holidaysFixed: {
    '01-01': { tr: 'Yılbaşı', en: "New Year's Day" },
    '04-23': { tr: 'Ulusal Egemenlik ve Çocuk Bayramı', en: 'National Sovereignty and Children’s Day' },
    '05-01': { tr: 'Emek ve Dayanışma Günü', en: 'Labour Day' },
    '05-19': { tr: 'Atatürk’ü Anma, Gençlik ve Spor Bayramı', en: 'Youth and Sports Day' },
    '07-15': { tr: 'Demokrasi ve Millî Birlik Günü', en: 'Democracy and National Unity Day' },
    '08-30': { tr: 'Zafer Bayramı', en: 'Victory Day' },
    '10-29': { tr: 'Cumhuriyet Bayramı', en: 'Republic Day' }
  },
  holidays: {
    '2026-03-20': { tr: 'Ramazan Bayramı', en: 'Eid al-Fitr' },
    '2026-03-21': { tr: 'Ramazan Bayramı', en: 'Eid al-Fitr' },
    '2026-03-22': { tr: 'Ramazan Bayramı', en: 'Eid al-Fitr' },
    '2026-05-27': { tr: 'Kurban Bayramı', en: 'Eid al-Adha' },
    '2026-05-28': { tr: 'Kurban Bayramı', en: 'Eid al-Adha' },
    '2026-05-29': { tr: 'Kurban Bayramı', en: 'Eid al-Adha' },
    '2026-05-30': { tr: 'Kurban Bayramı', en: 'Eid al-Adha' },
    '2027-03-09': { tr: 'Ramazan Bayramı', en: 'Eid al-Fitr' },
    '2027-03-10': { tr: 'Ramazan Bayramı', en: 'Eid al-Fitr' },
    '2027-03-11': { tr: 'Ramazan Bayramı', en: 'Eid al-Fitr' },
    '2027-05-16': { tr: 'Kurban Bayramı', en: 'Eid al-Adha' },
    '2027-05-17': { tr: 'Kurban Bayramı', en: 'Eid al-Adha' },
    '2027-05-18': { tr: 'Kurban Bayramı', en: 'Eid al-Adha' },
    '2027-05-19': { tr: 'Kurban Bayramı', en: 'Eid al-Adha' }
  },
  /* Arife günleri: saat 13:00'te kapanış */
  halfDays: {
    '10-28': { tr: 'Cumhuriyet Bayramı arifesi', en: 'Republic Day eve' },
    '2026-03-19': { tr: 'Ramazan Bayramı arifesi', en: 'Eid al-Fitr eve' },
    '2026-05-26': { tr: 'Kurban Bayramı arifesi', en: 'Eid al-Adha eve' },
    '2027-03-08': { tr: 'Ramazan Bayramı arifesi', en: 'Eid al-Fitr eve' },
    '2027-05-15': { tr: 'Kurban Bayramı arifesi', en: 'Eid al-Adha eve' }
  },
  halfDayClose: '13:00'
};
