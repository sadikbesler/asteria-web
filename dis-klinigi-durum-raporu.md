# Durum raporu: Mine diş kliniği sitesi

Tarih: 18 Eylül 2026 · Klasör: `dis-klinigi/` · Canlı: https://sadikbesler.github.io/asteria-web/dis-klinigi/

**Tamamlanma: %100.** Üç demo sitesinin en kısası.

## 1. Alınan kararlar

- **Marka:** Uydurma bir klinik: "Mine Ağız ve Diş Sağlığı Polikliniği", Ataşehir/İstanbul.
  ("Mine" hem diş minesi hem bir isim.) İki hekim: Dt. Elif Korkmaz (kurucu; implant, estetik),
  Dt. Tolga Şen (ortodonti, çocuk).
- **Tasarım:** Güzellik sitesiyle aynı dil — siyah `#050505`, kırık beyaz `#F5F5F7`, lila `#DED6FD`;
  Archivo başlıklar, lila kutu içinde italik Instrument Serif vurgu, JetBrains Mono etiketler.
  Koyu tema varsayılan, açık tema seçilebilir.
- **İstek üzerine çıkarılanlar:** randevu sistemi (takvim, saat seçimi, iptal, .ics, hatırlatma),
  dil seçeneği (site yalnızca Türkçe), fotoğraf kolajı, ücret paketleri.
- **Kalanlar:** tedaviler, klinik/ilk randevu, hekimler, SSS, iletişim formu.
- **Sayfa uzunluğu:** 8.436 px. Karşılaştırma: güzellik 12.697 px, diyetisyen daha uzun.
- **Fotoğraflar:** 11 Unsplash fotoğrafı (ücretsiz lisans), WebP, toplam 1,3 MB.
- **Hukuki dikkat:** Öncesi/sonrası fotoğrafı, hasta yorumu ve fiyat listesi yok (sağlık
  tanıtım kuralları). Kesin sonuç/süre taahhüdü yok; footer'da bilgilendirme uyarısı var.
- **Adres, telefon, e-posta** yer tutucu: `0555 555 55 55`, `iletisim@minedis.com`.

## 2. Dosyalar (`dis-klinigi/`)

| Dosya | İçerik |
|---|---|
| `index.html` | Tek sayfa, 9 bölüm; CSP ve JSON-LD (Dentist, FAQPage) |
| `kvkk.html` | KVKK aydınlatma metni (yalnızca Türkçe) |
| `sitemap.xml`, `site.webmanifest`, `assets/icons/` | Site haritası, manifest, ikonlar |
| `assets/css/site.css` | Tüm stiller (640 satır; randevu, kolaj ve dil stilleri ayıklandı) |
| `assets/js/config.js` | **Tek ayar dosyası:** iletişim bilgileri, çalışma saatleri, tatiller |
| `assets/js/boot.js` | Sayfa açılmadan temayı ayarlar |
| `assets/js/site.js` | Tema, menü, açık/kapalı durumu, iletişim formu (450 satır) |
| `backend/Code.gs` | Google Apps Script: yalnızca iletişim formu (169 satır) |
| `backend/KURULUM.md` | Adım adım kurulum rehberi |

Dil altyapısı tamamen söküldü: `i18n.js` yok, HTML'de `data-i18n` yok. Betiklerin ürettiği
birkaç Türkçe metin `site.js` içindeki `S` tablosunda duruyor.

## 3. İletişim formu

- Alanlar: ad soyad, e-posta, telefon (isteğe bağlı), konu, mesaj, KVKK onayı.
- Konu seçenekleri `index.html` ile `Code.gs`'deki `TOPICS` listesinde aynı olmalı.
- Sunucu tarafında: gizli alan + "çok hızlı dolduruldu" kontrolü, aynı e-postadan saatte
  en fazla 5 mesaj, mesajlar **Mesajlar** sayfasına yazılır, size bildirim ve gönderene
  otomatik yanıt e-postası gider.
- `endpoint` boşken form demo modunda: ekranda mesajın iletilmediği açıkça yazar.

## 4. Test edilenler

- Konsolda hata yok (ana sayfa ve KVKK).
- İletişim formu uçtan uca denendi, demo yanıtı doğru.
- Koyu/açık tema, mobil (390 px) ve masaüstü; yatay taşma yok.
- Telefon, adres, WhatsApp ve harita bağlantıları `config.js`'ten doğru geliyor.
- "Şu an açık/kapalı" bilgisi hem hero kartında hem iletişim bölümünde çalışıyor.
- SSS yapısal verisi (JSON-LD) 9 soruyla üretiliyor.

## 5. Gerçek müşteriye uyarlarken

1. `assets/js/config.js`: isim, adres, telefon, e-posta, çalışma saatleri.
   Saatleri değiştirirseniz `index.html` içindeki saat tablosunu da güncelleyin.
2. `config.js` → `demo: false`; footer'daki "Demo site" yazısını silin.
3. Fotoğrafları ve hekim bilgilerini değiştirin (`assets/img/`).
4. `canonical`, `og:url` ve `sitemap.xml` adreslerini kendi alan adınızla değiştirin.
5. KVKK metnini avukata kontrol ettirin.
