# Durum raporu: Neva Güzellik merkezi sitesi

Tarih: 18 Eylül 2026 · Commit: `09b6abe` · Klasör: `guzellik/`

**Tamamlanma: %100.** Site yayında: https://sadikbesler.github.io/asteria-web/guzellik/

## 1. Alınan kararlar

- **Marka:** Uydurma bir merkez: "Neva Güzellik ve Cilt Bakım Merkezi", Teşvikiye/Nişantaşı.
  Üç uzman: Derya Aydın (kurucu, cilt/leke/akne), Pelin Sarıkaya (lazer), Ece Demirtaş (kaş/kirpik).
- **Renkler:** `renk.png.jpeg` dosyasından alındı — siyah `#050505`, kırık beyaz `#F5F5F7`,
  lila `#DED6FD`. Düz renk, gradyan ve neon yok.
- **Tasarımın imzası:** Referans görseldeki gibi kalın grotesk başlık + vurgu kelimesinin
  lila kutu içinde italik serifle yazılması. Kural: **serif yalnızca italik kullanılır**,
  dik metinlerin tamamı grotesk. Başlık başına en fazla bir lila kutu.
- **Yazı tipleri:** Archivo (başlık ve gövde), Instrument Serif (yalnızca italik vurgu),
  JetBrains Mono (etiketler).
- **Tema:** Koyu tema varsayılan (referans siyah zeminli). Açık tema düğmeyle seçilir ve
  tarayıcıda hatırlanır. Lila kutu iki temada da aynı: lila zemin, siyah yazı.
- **Kapsam (diyetisyen sitesine göre daraltıldı):** VKİ/kalori/su hesaplama araçları,
  örnek haftalık program, tarifler, blog ve yapay zekâ sohbet asistanı **kaldırıldı**.
  Kalan bölümler: hero, kısa bilgiler, uygulamalar, fotoğraf kolajı, süreç, ekip, ücretler,
  online randevu, kapak görseli, SSS, iletişim, footer.
- **Fotoğraflar:** 29 Unsplash fotoğrafı (ücretsiz lisans), WebP'ye çevrildi, toplam 1,5 MB.
- **Hukuki dikkat:** Öncesi/sonrası fotoğrafı ve müşteri yorumu yok. Dolgu/botoks gibi
  hekim yetkisindeki işlemlerin yapılmadığı hem SSS'de hem footer'da yazıyor. Kalıcı
  zayıflama veya kesin seans sayısı vaadi yok.
- **Adres, telefon, e-posta** yer tutucu: `0555 555 55 55`, `randevu@nevaguzellik.com`.

## 2. Dosyalar (`guzellik/`)

| Dosya | İçerik |
|---|---|
| `index.html` | Tek sayfa, 12 bölüm; CSP ve JSON-LD (BeautySalon, FAQPage) |
| `kvkk.html` | KVKK aydınlatma metni (TR/EN) |
| `sitemap.xml`, `site.webmanifest`, `assets/icons/` | Site haritası, manifest, ikonlar |
| `assets/css/site.css` | Tüm stiller: koyu/açık tema, mobil |
| `assets/js/config.js` | **Tek ayar dosyası:** iletişim, uzman saatleri, ücretler, tatiller |
| `assets/js/boot.js` | Sayfa açılmadan tema ve dili ayarlar |
| `assets/js/i18n.js` | İngilizce sözlük (eksik anahtar yok, kontrol edildi) |
| `assets/js/site.js` | Dil, tema, menü, açık/kapalı durumu, iletişim formu |
| `assets/js/booking.js` | Randevu motoru: takvim, 4 adım, .ics, Google Takvim, iptal |
| `backend/Code.gs` | Google Apps Script sunucusu (3 sayfa: Randevular, Kapalı Günler, Mesajlar) |
| `backend/KURULUM.md` | Adım adım kurulum rehberi |

## 3. Randevu sistemi

- **Seans türleri:** Cilt analizi (30 dk, ücretsiz) · Tek seans (60 dk, 2.400 TL) ·
  Paket seansı (45 dk, 1.750 TL). Ücretsiz seansta özet "Ücretsiz" yazar.
- **Uygulamalar:** cilt bakımı, lazer epilasyon, leke ve akne, vücut bakımı,
  kaş ve kirpik, gelin bakımı. Her uzman yalnızca kendi alanında randevu alır.
- **Kurallar:** aynı güne en erken 90 dk sonrasına, 45 gün ileriye kadar, 30 dk aralıklarla.
  İptal 24 saat öncesine kadar. Referans kodu öneki **NV-**.
- **Uçtan uca test edildi** (başlıksız tarayıcıyla): takvim → saat → bilgiler → özet →
  demo onayı. Konsolda hata yok. Mobil (390 px) ve masaüstünde yatay taşma yok.

## 4. Test edilenler

- TR ve EN dillerinde çevrilmemiş anahtar kalmadı.
- Koyu ve açık temada renkler, lila kutu ve butonlar doğru.
- Randevu iptal penceresi açılıyor.
- Mobil menü, takvim ve saat listesi düzgün.

## 5. Gerçek müşteriye uyarlarken

1. `assets/js/config.js` içindeki isim, adres, telefon, e-posta, ücret ve çalışma saatlerini
   değiştirin; **aynı değişikliği `backend/Code.gs` içinde de yapın** (sunucu kuralları
   yeniden kontrol eder).
2. `config.js` → `demo: false` yapın; footer'daki "Demo site" yazısını silin.
3. Fotoğrafları ve uzman isimlerini değiştirin (`assets/img/`).
4. `index.html` ve `kvkk.html` içindeki `canonical`, `og:url` ve `sitemap.xml` adreslerini
   kendi alan adınızla değiştirin.
5. KVKK metnini avukata kontrol ettirin.

## 6. Yayın

Site, diyetisyen sitesiyle aynı şekilde `asteria-web` deposunda `guzellik/` klasöründe
duruyor ve şu adresten yayında:

```
https://sadikbesler.github.io/asteria-web/guzellik/
```

`canonical`, `og:url`, `sitemap.xml`, `config.js` ve `Code.gs` içindeki adresler bu adrese
göre ayarlı. Kendi alan adınıza taşırken hepsini birden değiştirmeniz gerekir.
