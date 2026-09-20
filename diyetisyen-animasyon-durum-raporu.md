# Durum raporu: Mizan Beslenme — sinematik sürüm

Tarih: 21 Eylül 2026 · Klasör: `diyetisyen-animasyon/` · Canlı: https://sadikbesler.github.io/asteria-web/diyetisyen-animasyon/

**Eski site olduğu gibi duruyor.** `diyetisyen/` klasörüne hiç dokunulmadı; bu yeni klasör onun birebir kopyası üzerine kuruldu. Randevu sistemi, sohbet asistanı, hesaplama araçları, örnek program, tarifler, blog, KVKK, TR/EN ve açık/koyu tema — hepsi aynen çalışıyor. Üstüne "film" katmanı eklendi.

## 1. Ne eklendi

### Açılış jeneriği
Sayfa açılırken koyu bir perde, ortada harf harf yükselen `mizan`, altında 000→100 sayacı ve ilerleme çizgisi. Sonra perde beş bant hâlinde yukarı çekilip hero'yu açıyor. Oturum başına bir kez (`sessionStorage`), "hareketi azalt" açıksa hiç görünmüyor. JavaScript takılırsa 5 saniye sonra kendini açıyor (`boot.js` içindeki güvenlik zamanlayıcısı).

### Sabit film arayüzü (HUD)
- Üstte kaydırma ilerleme çizgisi.
- Sağ kenarda 13 bölümlük cetvel (1400 px ve üzeri); üzerine gelince bölüm adı açılıyor, tıklayınca yumuşak kayıyor.
- Sol altta sahne künyesi (`05 UZMANLAR`), sağ altta canlı İstanbul saati. İkisi de açılış karesinde gizli, ilk kaydırmada beliriyor.
- Koyu bölümlerin (hero, yöntem sahnesi, "afiyet olsun", footer, koyu şerit) üzerine gelince arayüz rengi ters dönüyor.
- **Hareketi duraklat düğmesi:** kendiliğinden dönen şeritleri ve gren dokusunu durduruyor, tercih tarayıcıda saklanıyor (WCAG 2.2.2).

### Sahne sahne hareket
| Bölüm | Ne oluyor |
|---|---|
| Hero | Fotoğraf yavaşça yerine oturuyor, başlık satır satır maskeden çıkıyor; kaydırınca fotoğraf sabitleniyor ve sonraki bölüm üstüne kayıyor |
| Rakamlar | 12 / 3 / 60 / 7 sıfırdan sayarak geliyor |
| Hizmetler | **1200 px üstünde bölüm sabitleniyor, kamera kartların üzerinde yana kayıyor** (yatay izleme çekimi); altında ne kadarının geçtiğini gösteren cetvel var |
| Şeritler | Hizmet adları ve mevsim ürünleri sonsuz kayıyor; kaydırma hızına ve yönüne tepki veriyor |
| Fotoğraf kartları | Dağınık gelip yerine oturuyor, sütunlar farklı hızda kayıyor; sürükleme özelliği duruyor |
| Yöntem sahnesi (yeni) | Tam ekran sabitleniyor, dört cümle sırayla aydınlanıyor, arkadaki fotoğraf yavaş kayıyor |
| Uzmanlar | Kartlar 3B derinlikten geliyor |
| Alıntı ve kapanış cümlesi | Kaydırdıkça kelime kelime aydınlanıyor |
| Tüm fotoğraflar | Aşağıdan maskeyle açılıyor, içerideki görsel yakından normale iniyor |
| "afiyet olsun" ve "mizan" | Maskeden yükseliyor, yavaşça yana kayıyor |
| Randevu adımları, tarif ızgarası, hesap sonuçları, öğün listesi | İçerik değiştikçe yumuşak geçiş |

### Küçük dokunuşlar
Yumuşak kaydırma (Lenis), film greni dokusu, özel imleç (üzerine geldiği yere göre "Randevu", "Tarifi aç", "Sürükle", "Oku" etiketi), manyetik düğmeler, tarif kartlarında hafif eğim.

## 2. Kullanılan hazır kaynaklar

Hepsi ücretsiz ve ticari kullanıma açık; CDN yok, dosyalar `assets/vendor/` içinden sunuluyor (böylece sayfadaki CSP kuralı gevşetilmedi). Ayrıntılı liste: `diyetisyen-animasyon/assets/vendor/KAYNAKLAR.md`.

- **GSAP 3.15** (ücretsiz standart lisans) + ScrollTrigger, SplitText, CustomEase
- **Lenis 1.3.26** (MIT) — yumuşak kaydırma
- **Codrops demoları** (MIT): ScrollBlurTypography, ScrollTextMotion, LoopScrolling, ElasticGridScroll, 3DStackMotion, OnScrollColumnsRows, OnScrollTextHighlight. Dosyalar kopyalanmadı; teknikler `motion.js` içinde bu siteye uyarlandı.
- **motion-primitives.com** desenleri (React tabanlı olduğu için sade JavaScript'e çevrildi): Sliding Number, Scroll Progress, Magnetic, Tilt, In View, Infinite Slider.

Toplam eklenen JavaScript: 152 KB sıkıştırılmamış (~50 KB gzip).

## 3. Yeni / değişen dosyalar

| Dosya | Durum |
|---|---|
| `assets/css/motion.css` | **yeni** — sinematik katmanın tüm stilleri |
| `assets/js/motion.js` | **yeni** — film motoru (~1000 satır) |
| `assets/vendor/` | **yeni** — GSAP, Lenis ve kaynak listesi |
| `assets/js/boot.js` | jenerik perdesi ilk boyamadan önce yerine konuyor |
| `assets/js/i18n.js` | yeni bölüm için İngilizce karşılıklar |
| `assets/css/site.css` | yalnızca erişilebilirlik düzeltmeleri (aşağıda) |
| `index.html` | jenerik, iki şerit, yöntem sahnesi, yüzen düğmeler için `<aside>` |
| `blog/*.html`, `kvkk.html` | sinematik katman (jenerik hariç) |

## 4. Erişilebilirlik ve denetim

`vercel-labs/agent-skills` içindeki **web-design-guidelines** kuralları ve **axe-core** ile denetlendi.

**axe sonucu: açık/koyu tema, ana sayfa (üç kaydırma noktası), makale ve blog listesinde ihlal yok.**

Yol boyunca düzeltilenler (bir kısmı eski sitede de vardı):
- `--ink-3` kontrastı 4.45 idi (AA sınırı 4.5) → `#5F655B` / koyu temada `#A09D93`.
- `--terra` uyarı kutusunda 4.38 idi → `#964825`.
- Blog listesinde `h1`'den sonra `h3` geliyordu → `h2`.
- Yüzen WhatsApp/sohbet düğmeleri hiçbir landmark içinde değildi → `<aside aria-label="Hızlı iletişim">`.
- Sohbet kutusuna odak halkası eklendi.
- SplitText başlıkları bölerken `<p>` üzerine yasak olan `aria-label` koyuyordu → başlıklarda hazır davranış, paragraflarda `aria: none`.
- Yatay izleme çekiminde klavyeyle gezilen kart kendiliğinden ekrana getiriliyor.
- Çentikli ekranlar için `env(safe-area-inset-*)`, marka adlarında `translate="no"`.

## 5. Test sonuçları (Chrome / Playwright)

- **Kare hızı:** 6 saniyelik kesintisiz kaydırmada 60 fps, 50 ms üzeri kare yok.
- **Randevu akışı:** dört adım, saat seçimi, doğrulama ve demo onayı çalışıyor.
- **Tarifler:** filtre, kart penceresi, porsiyon ölçekleme çalışıyor.
- **Araçlar:** VKİ, kalori, su hesabı çalışıyor.
- **Sohbet asistanı:** yanıt veriyor.
- **TR/EN:** dil değişince bölünmüş yazılar geri alınıp yeniden kuruluyor, hiçbir başlık kaybolmuyor.
- **Mobil (390 px):** yatay taşma yok, konsol hatası yok, imleç ve bölüm cetveli kapalı.
- **Hareketi azalt:** film katmanı hiç açılmıyor, sayfa eski hâliyle çalışıyor.
- **JavaScript kapalı:** perde açılmıyor, içerik eksiksiz görünüyor.
- **İkinci ziyaret:** jenerik tekrar oynamıyor.

## 6. Sıradaki adımlar

1. **Google E-Tablolar bağlantısı** hâlâ bağlanmadı: `backend/KURULUM.md` adımlarıyla `Code.gs`'yi yayınlayıp `/exec` adresini `assets/js/config.js` içindeki `endpoint` satırına yapıştır. O zamana kadar randevular yalnızca tarayıcıda kalıyor.
2. **Karar:** iki sürümden hangisi müşteriye gösterilecek? Sade sürüm `diyetisyen/`, sinematik sürüm `diyetisyen-animasyon/` adresinde duruyor; ikisi birbirini etkilemiyor.
3. v2 sitesindeki "Demolar → Randevu Sistemi" bağlantısı hâlâ `href="#"`; istersen bu iki adresten birine bağlanabilir.
4. Gerçek müşteriye uyarlarken isim, adres, telefon, fotoğraf ve ücretleri değiştir; `config.js` ile `Code.gs`'deki saat ve ücretleri aynı tut.
