# Durum raporu: Mizan Beslenme — sinematik sürüm

Tarih: 21 Eylül 2026 (2. tur) · Klasör: `diyetisyen-animasyon/` · Canlı: https://sadikbesler.github.io/asteria-web/diyetisyen-animasyon/

**Eski site olduğu gibi duruyor.** `diyetisyen/` klasörüne hiç dokunulmadı; bu yeni klasör onun birebir kopyası üzerine kuruldu. Randevu sistemi, sohbet asistanı, hesaplama araçları, örnek program, tarifler, blog, KVKK, TR/EN ve açık/koyu tema — hepsi aynen çalışıyor. Üstüne "film" katmanı eklendi.


## 0. 2. tur — premium tasarım ve Codrops entegrasyonları

`codrops-referans/diet-animation-promt.md` dosyasındaki brief uygulandı.

### Tasarım dili yeniden kuruldu
`codrops-referans/resimler/` altındaki referanslar incelendi ve tasarım
sistemi buna göre değiştirildi:

- **Açık tema (lattice.webp):** Zemin kırık beyaza yaklaştı (`#F7F5EF`),
  kartlar **saf beyaz** oldu; ince çerçeve + yumuşak yükselti geldi.
  Köşe yarıçapı 8 px'ten 20 px'e, kontroller 4 px'ten 10 px'e çıktı.
  Bölüm başlıklarının üstüne Lattice'teki gibi ince çerçeveli rozetler
  eklendi (**kelime**, sayı değil — eski "01 Hizmetler" düzeni geri gelmedi).
  Bölüm aralıkları %15 açıldı.
- **Koyu tema (titan.webp, krepling.webp):** Yeşil-siyah zemin bırakıldı,
  yerine **koyu antrasit** geldi: `#121212` sayfa, `#1A1A1A` kart,
  `#0E0E0E` alan. Metinler yumuşak gri (`#EDEBE6` / `#B5B2AB` / `#93908A`).
  Saf siyah hiçbir yerde kullanılmadı. Zeytin yeşili, marka rengi olarak
  açık adaçayı tonuna (`#C6D8A8`) dönüp vurgu olarak kaldı.
- **Süreç adımları** Titan'daki gibi numaralı dairelere dönüştü.
- Gradyan ve neon kuralı bozulmadı: tüm renkler düz.

### Beş Codrops altyapısı entegre edildi
| Altyapı | Nerede |
|---|---|
| FullImageReveal | Hero görseli küçük maskeli bir kareden büyüyüp ekranı kaplıyor |
| KineticTypePageTransition | Başlıklar satır satır yandan savrulup tok bir şekilde yerleşiyor |
| OnScrollViewSwitch (GSAP Flip) | Uzman kartları eğik yığından ızgaraya açılıyor |
| TileScroll | Tarif kartları ve blog satırları farklı hızlarda akıp yerine oturuyor |
| RotatedRevealers | "Randevu al" ve uzak bölüm bağlantılarında dönen perde geçişi |
| LayersAnimation | Yöntem sahnesinin arka planı katman katman açılıyor |

Basit solma/kayma açılışları kaldırıldı; yerine 3B kalkış, maske ve
kinetik yazı geçişleri kondu.

### Kaldırılanlar
- **Fareyi takip eden daire imleç tamamen kaldırıldı** (kullanıcı isteği).
  İlgili CSS ve JS silindi, `cursor: none` kuralı da gitti; artık her yerde
  tarayıcının kendi imleci kullanılıyor.

## 1. İlk turda eklenenler

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
| Uzmanlar | *(2. turda değişti: kartlar yığından ızgaraya açılıyor — bkz. bölüm 0)* |
| Alıntı ve kapanış cümlesi | Kaydırdıkça kelime kelime aydınlanıyor |
| Tüm fotoğraflar | Aşağıdan maskeyle açılıyor, içerideki görsel yakından normale iniyor |
| "afiyet olsun" ve "mizan" | Maskeden yükseliyor, yavaşça yana kayıyor |
| Randevu adımları, tarif ızgarası, hesap sonuçları, öğün listesi | İçerik değiştikçe yumuşak geçiş |

### Küçük dokunuşlar
Yumuşak kaydırma (Lenis), film greni dokusu, manyetik düğmeler, tarif kartlarında hafif eğim. *(Özel imleç 2. turda kaldırıldı.)*

## 2. Kullanılan hazır kaynaklar

Hepsi ücretsiz ve ticari kullanıma açık; CDN yok, dosyalar `assets/vendor/` içinden sunuluyor (böylece sayfadaki CSP kuralı gevşetilmedi). Ayrıntılı liste: `diyetisyen-animasyon/assets/vendor/KAYNAKLAR.md`.

- **GSAP 3.15** (ücretsiz standart lisans) + ScrollTrigger, SplitText, **Flip**, CustomEase
- **Lenis 1.3.26** (MIT) — yumuşak kaydırma
- **Codrops demoları** (MIT), iki turda toplam 13 altyapı: FullImageReveal, KineticTypePageTransition, OnScrollViewSwitch, TileScroll, RotatedRevealers, LayersAnimation, ScrollBlurTypography, ScrollTextMotion, LoopScrolling, ElasticGridScroll, 3DStackMotion, OnScrollColumnsRows, OnScrollTextHighlight. Dosyalar kopyalanmadı; teknikler `motion.js` içinde bu siteye uyarlandı.
- **motion-primitives.com** desenleri (React tabanlı olduğu için sade JavaScript'e çevrildi): Sliding Number, Scroll Progress, Magnetic, Tilt, In View, Infinite Slider.

Toplam eklenen JavaScript: 178 KB sıkıştırılmamış (~57 KB gzip). Tam liste ve hangi tekniğin nereye uygulandığı: `assets/vendor/KAYNAKLAR.md`.

## 3. Yeni / değişen dosyalar

| Dosya | Durum |
|---|---|
| `assets/css/premium.css` | **yeni (2. tur)** — Lattice/Titan referanslarına göre tasarım katmanı |
| `assets/css/motion.css` | **yeni** — sinematik katmanın tüm stilleri |
| `assets/js/motion.js` | **yeni** — film motoru (~1200 satır) |
| `assets/vendor/` | **yeni** — GSAP (Flip dahil), Lenis ve kaynak listesi |
| `assets/js/boot.js` | jenerik perdesi ilk boyamadan önce yerine konuyor |
| `assets/js/i18n.js` | yeni bölüm için İngilizce karşılıklar |
| `assets/css/site.css` | renk paleti (açık + koyu), köşe yarıçapları, bölüm aralıkları ve erişilebilirlik düzeltmeleri |
| `index.html` | jenerik, iki şerit, yöntem sahnesi, bölüm rozetleri, numaralı adımlar, hero maske sarmalı, yüzen düğmeler için `<aside>` |
| `blog/*.html`, `kvkk.html` | sinematik katman (jenerik hariç) |

## 4. Erişilebilirlik ve denetim

`vercel-labs/agent-skills` içindeki **web-design-guidelines** kuralları ve **axe-core** ile denetlendi.

**axe sonucu (2. tur dahil): açık/koyu tema, ana sayfa (üç kaydırma noktası), makale ve blog listesinde ihlal yok.** Yeni palet için bütün metin/zemin çiftleri ayrıca hesaplandı; en düşük oran 4.68:1 (AA sınırı 4.5).

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

- **Kare hızı:** 6 saniyelik kesintisiz kaydırmada 60 fps, 50 ms üzeri kare yok (42 ScrollTrigger, 138 tween ile).
- **Randevu akışı:** dört adım, saat seçimi, doğrulama ve demo onayı çalışıyor.
- **Tarifler:** filtre, kart penceresi, porsiyon ölçekleme çalışıyor.
- **Araçlar:** VKİ, kalori, su hesabı çalışıyor.
- **Sohbet asistanı:** yanıt veriyor.
- **TR/EN:** dil değişince bölünmüş yazılar geri alınıp yeniden kuruluyor, hiçbir başlık kaybolmuyor.
- **Mobil (390 px):** yatay taşma yok, konsol hatası yok, imleç ve bölüm cetveli kapalı.
- **Hareketi azalt:** film katmanı hiç açılmıyor, sayfa eski hâliyle çalışıyor.
- **JavaScript kapalı:** perde açılmıyor, içerik eksiksiz görünüyor.
- **İkinci ziyaret:** jenerik tekrar oynamıyor.
- **Derin bağlantı:** `#iletisim`, `#randevu`, `#tarifler` ile girip yukarı kaydırıldığında 24 ölçüm noktasının hepsinde görünmeyen öge yok.
- **Dönen perde geçişi:** "Randevu al" tıklanınca perde geliyor, hedefe 88 px payla iniliyor, perde çıkıyor; yakın bağlantılarda devreye girmiyor.
- **Uzman ızgara geçişi:** yığından ızgaraya geçişte sayfa kayması 0 px.

## 6. Sıradaki adımlar

1. **Google E-Tablolar bağlantısı** hâlâ bağlanmadı: `backend/KURULUM.md` adımlarıyla `Code.gs`'yi yayınlayıp `/exec` adresini `assets/js/config.js` içindeki `endpoint` satırına yapıştır. O zamana kadar randevular yalnızca tarayıcıda kalıyor.
2. **Karar:** iki sürümden hangisi müşteriye gösterilecek? Sade sürüm `diyetisyen/`, sinematik sürüm `diyetisyen-animasyon/` adresinde duruyor; ikisi birbirini etkilemiyor.
3. v2 sitesindeki "Demolar → Randevu Sistemi" bağlantısı hâlâ `href="#"`; istersen bu iki adresten birine bağlanabilir.
4. Gerçek müşteriye uyarlarken isim, adres, telefon, fotoğraf ve ücretleri değiştir; `config.js` ile `Code.gs`'deki saat ve ücretleri aynı tut.
