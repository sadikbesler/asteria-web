/*
 * Mizan Beslenme — site ayarları
 *
 * Sitedeki iletişim bilgileri, randevu kuralları, uzmanların çalışma saatleri
 * ve Google E-Tablolar bağlantısı bu dosyadan yönetilir.
 *
 * ÖNEMLİ: Uzman, görüşme türü veya çalışma saati değiştirirseniz aynı değişikliği
 * backend/Code.gs içindeki ayarlarda da yapın. Sunucu, her randevuyu bu kurallarla
 * yeniden kontrol eder.
 */
window.MIZAN_CONFIG = {
  /* Google Apps Script "Web uygulaması" adresi (…/exec). Kurulum: backend/KURULUM.md
     Boş bırakılırsa site demo modunda çalışır: randevular yalnızca bu tarayıcıda saklanır. */
  endpoint: '',

  /* Demo notu: sayfanın altında "Bu bir demo görünümüdür" şeridi gösterilir.
     Siteyi gerçek bir kliniğe kurarken false yapın (footer'daki "Demo site" yazısını da silin). */
  demo: true,

  siteUrl: 'https://sadikbesler.github.io/asteria-web/diyetisyen/',
  whatsapp: '905555555555',
  phone: '+905555555555',
  phoneDisplay: '0555 555 55 55',
  email: 'randevu@mizanbeslenme.com',
  instagram: 'https://instagram.com/mizanbeslenme',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Moda+Caddesi+Kad%C4%B1k%C3%B6y+%C4%B0stanbul',
  address: {
    tr: 'Moda Cad. No: 48, Kat 3, Kadıköy / İstanbul',
    en: 'Moda Cad. No: 48, Floor 3, Kadıköy, Istanbul'
  },

  /* Randevu kuralları */
  timeZoneOffsetMinutes: 180,   // Türkiye saati (UTC+3, yaz saati uygulaması yok)
  minNoticeMinutes: 60,         // Bugün için en erken: şu an + 60 dk
  bookingWindowDays: 60,        // Bugünden itibaren kaç gün sonrasına randevu alınabilir
  slotStepMinutes: 30,          // Saat aralıkları
  cancelNoticeHours: 24,        // Online iptal için en az kaç saat kala

  /* Görüşme türleri: süre (dk), ücret (TL), yer */
  types: {
    first:   { minutes: 60, price: 1800, mode: 'clinic' },
    control: { minutes: 30, price: 900,  mode: 'clinic' },
    online:  { minutes: 45, price: 1500, mode: 'online' }
  },

  /* Konular */
  areas: ['weight', 'clinical', 'sports', 'pregnancy', 'kids', 'other'],

  /* Uzmanlar ve haftalık çalışma saatleri (1 = Pazartesi … 6 = Cumartesi, 0 = Pazar) */
  staff: {
    selin: {
      name: 'Uzm. Dyt. Selin Karaca',
      nameEn: 'Selin Karaca, RD, MSc',
      short: 'Selin Karaca',
      photo: 'uzman-selin-560.webp',
      areas: ['weight', 'clinical', 'pregnancy', 'other'],
      hours: {
        1: [['09:00', '12:30'], ['13:30', '17:00']],
        2: [['09:00', '12:30'], ['13:30', '17:00']],
        3: [['09:00', '12:30'], ['13:30', '17:00']],
        4: [['09:00', '12:30'], ['13:30', '17:00']],
        5: [['09:00', '12:30'], ['13:30', '17:00']]
      }
    },
    emre: {
      name: 'Dyt. Emre Aksoy',
      nameEn: 'Emre Aksoy, RD',
      short: 'Emre Aksoy',
      photo: 'uzman-emre-560.webp',
      areas: ['weight', 'sports', 'other'],
      hours: {
        2: [['12:00', '15:30'], ['16:00', '20:00']],
        4: [['12:00', '15:30'], ['16:00', '20:00']],
        6: [['10:00', '15:00']]
      }
    },
    zeynep: {
      name: 'Dyt. Zeynep Tunalı',
      nameEn: 'Zeynep Tunalı, RD',
      short: 'Zeynep Tunalı',
      photo: 'uzman-zeynep-560.webp',
      areas: ['weight', 'pregnancy', 'kids', 'other'],
      hours: {
        1: [['10:00', '13:00'], ['14:00', '18:00']],
        3: [['10:00', '13:00'], ['14:00', '18:00']],
        5: [['10:00', '13:00'], ['14:00', '18:00']],
        6: [['10:00', '14:00']]
      }
    }
  },

  /* Kliniğin genel çalışma saatleri (iletişim bölümündeki "şu an açık mı" bilgisi) */
  clinicHours: {
    1: ['09:00', '20:00'], 2: ['09:00', '20:00'], 3: ['09:00', '20:00'],
    4: ['09:00', '20:00'], 5: ['09:00', '20:00'], 6: ['10:00', '15:00']
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
