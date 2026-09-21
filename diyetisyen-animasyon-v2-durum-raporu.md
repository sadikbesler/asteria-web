# Durum raporu: Mizan Beslenme — sinematik sürüm v2 (gezegen hero'su)

Tarih: 21 Eylül 2026 · Klasör: `diyetisyen-animasyon-v2/` · Canlı: https://sadikbesler.github.io/asteria-web/diyetisyen-animasyon-v2/

**Eski klasörler olduğu gibi duruyor.** `diyetisyen/` ve `diyetisyen-animasyon/` klasörlerine dokunulmadı. v2, `diyetisyen-animasyon/`'un kopyası; tüm özellikler (randevu, araçlar, tarifler, blog, sohbet, TR/EN, açık/koyu tema) aynen çalışıyor. Kopyadaki canonical, sitemap, og ve JSON-LD adresleri `…/diyetisyen-animasyon-v2/` olarak güncellendi.


## 1. Ne değişti

### Hero: kaydırmaya bağlı 240 karelik canvas animasyonu (Apple tarzı)
- Mutfak fotoğrafı (`<img class="hero-img">`) kaldırıldı, yerine `<canvas id="hero-canvas">` geldi.
- Kareler `assets/frames/frame_0001.jpg … frame_0240.jpg` (1280×720, toplam ~11 MB). Sahne: küçük bir gezegende dev bir elmayı sulayan diyetisyen.
- Hero ekrana sabitleniyor (`pin`) ve **4 ekran boyu** (`end: +=400%`) kaydırma boyunca 1→240 kare oynuyor. Son %8'lik dilimde son kare bir an duruyor, sonra sayfa akmaya devam ediyor.
- Çizim "cover" hesabıyla yapılıyor: kare, ekranı boşluk bırakmadan kaplıyor. Canvas çözünürlüğü ekrana eşit, retina ekranda en fazla 2 kat (4 megapiksel sınırı; kaynak kareler zaten 1280 px).
- **Telefonda odak izi:** dikey ekranda karenin yalnızca dar bir şeridi görünüyor. Kamera dizi boyunca önce sağa, sonra sola kaydığı için kırpma konumu diyetisyeni ve elmayı izliyor. 390 px ve 375 px ekranda ikisi hep kadrajın ortasında kalıyor.
- Hero ekrandan uzun olduğunda (375×667 ya da yan çevrilmiş telefon) önce yazılar normal kaydırılıyor, sabitleme hero'nun alt kenarı ekrana oturunca başlıyor. Canvas bu arada ekran boyunda yapışık kalıyor.

### Yazılar
- Kaydırdıkça künye, başlık, paragraf, düğmeler ve "En yakın randevu" kartı sırayla, çok yavaşça saydamlaşıp yukarı süzülüyor (opaklık 0, y −50). Başlığın solması tek başına ~1,2 ekran boyu, hepsinin çekilmesi ~1,8 ekran boyu sürüyor.
- Koyu perde (`.hero-shade`) de aynı sürede kalkıyor, dizi tam parlaklıkta oynuyor.
- Başlık ve paragraf yalnızca opaklıkla soluyor ki sayfanın tek `h1`'i ekran okuyucudan kaybolmasın. Düğmeler ve randevu kartı görünmez de oluyor: solmuşken tıklanmıyor, klavyeyle odak almıyor.
- Yukarı kaydırınca her şey geri geliyor (test edildi).
- Açılışta (perde kalkarken) başlık satır satır, paragraf kelime kelime, düğmeler ve kart maskeyle yerine oturuyor.

### Yükleme ekranı: "Gezegene iniliyor…"
- `<body>`'nin hemen altında `#planet-loader`. Zemin `var(--paper)`, metin `var(--serif)` italik, yavaşça nabız atıyor. Altında kaç karenin indiğini gösteren ince çizgi ve 000–100 sayacı var.
- Kareler inerken kaydırma kilitli (`lenis.stop()` + `overflow: hidden`); hepsi inince perde 0,8 sn'de soluyor ve `lenis.start()`.
- Kareler önce kaba sonra ince sırayla yükleniyor (1, 240, sonra her 32., 16., 8. … kare). Yavaş bağlantıda perde en geç 12 sn sonra kalkıyor; yükleme arkada sürüyor, henüz inmemiş kare yerine en yakın inmiş kare çiziliyor.
- Perde şu durumlarda **hiç çıkmıyor**: aynı oturumda ikinci ziyaret (kareler önbellekte), derin bağlantı (`#randevu` gibi, kullanıcı içeriği beklemesin), "hareketi azalt" açık, JavaScript kapalı. Perdesiz açılışta ilk kare hemen, kalan kareler sayfanın kendi görselleri indikten sonra iniyor.
- İngilizcede "Landing on the planet…".

### Kaldırılanlar
- **Açılış jeneriği** (koyu perde + harf harf "mizan" + sayaç). Gezegen yükleyicisiyle üst üste iki ayrı yükleme ekranı olacaktı; yükleyici onun yerini aldı.
- **FullImageReveal** (hero görselinin küçük kareden büyümesi) — brief gereği.

### Hareket azaltılmış / JavaScript kapalı
Canvas yerine dizinin son karesi (diyetisyen ve elma) sabit afiş olarak görünüyor; kareler hiç indirilmiyor, sabitleme yok.


## 2. Yol boyunca bulunan hatalar

**Aşağıdaki ilk üç hata eski `diyetisyen-animasyon/` sitesinde de var ve şu an yayında.** v2'de düzeltildi; eski klasöre dokunmadım.

1. **Sabitleme boşluğu silinmişti (2. turdaki commit'te).** `html.film-on main { display: block; }` kuralı kaybolmuş. Bu yüzden eski sitede masaüstünde (1200 px+) **hizmetler şeridi hiç kaymıyor, 4.–6. kartlara (Gebelik, Çocuk, Online diyet) ulaşılamıyor**. Yöntem sahnesinin cümleleri de aydınlanmıyor; sonraki bölümler sabitlenen bölümün üstüne biniyor. v2'de kural geri kondu. Ölçüm: hizmetler pin boşluğu 900 → 2236 px, yöntem 900 → 2430 px.
2. **Derin bağlantıda sinematik katman yarıda kalıyordu.** `#randevu`, `#tarifler`, `#iletisim` gibi bir adresle girilince ScrollTrigger kurulum sırasında hata veriyordu (`Cannot read properties of undefined (reading 'end')`). Sonuçta 141 tetikleyiciden yalnızca 3–10'u kuruluyordu. Eski rapordaki "derin bağlantıda görünmeyen öge yok" sonucu bu yüzden yanıltıcıydı: animasyonlar hiç kurulmadığı için gizlenen öge de olmuyordu. Aynı hata sayfanın ortasında dil ya da pencere boyu değişince de çıkıyordu. Çözüm: tetikleyiciler her zaman sayfa başındayken kuruluyor, sonra aynı karede hedefe dönülüyor. Ekranda sıçrama görünmüyor.
3. **Alttaki bölümlere derin bağlantı yanlış yere iniyordu.** Lenis sayfa boyunu pin boşlukları eklenmeden önceki hâliyle hatırlıyor ve kaydırmayı eski sınırda kesiyordu. Artık önce yeniden ölçtürülüyor. Ayrıca canlı sitede görseller geç inince ScrollTrigger kendini yeniden ölçüyor ve hedef 16 px kayıyordu; kullanıcı sayfaya dokunana kadar hedefte kalınıyor. Yedi bölümün hepsinde hedef, ekranın üst kenarından 88 px aşağıda (başlık çubuğunun hemen altında) duruyor.
4. **(yeni kodda yakalandı)** Hero ortasındayken pencere boyu değişip başa dönülünce 1 yerine 2. kare kalıyordu. ScrollTrigger kaydırma dururken son adımı olay tetiklemeden atıyor. Çizim artık GSAP'in kare saatinde yapılıyor.
5. **(yeni kodda yakalandı)** Açık temada hero paragrafı, ilk karenin en açık yerlerinde 3,7:1 kontrasta düşüyordu (AA sınırı 4,5). Açık temada perde 0,54 → 0,60 yapıldı ve paragraf tam opak krem oldu. Artık her ekran boyunda, iki temada ve afiş karede en kötü piksel bile ≥ 4,68:1.


## 3. Test sonuçları (Chrome / Playwright, 90 madde, hepsi geçti)

Eski rapordaki testler yeniden koşuldu, yeni hero için ekler yapıldı.

- **Yükleyici:** ilk ziyarette görünüyor, kaydırma kilitli; 240 kare iniyor, perde kalkıyor, kilit açılıyor. İkinci ziyarette çıkmıyor, kareler arkada yine iniyor.
- **Hero (1440×900, 1920×1080, 390×844, 375×667):** pin boşluğu tam olarak hero + %400; hiçbir bölüm sabitlenen bölümün üstüne binmiyor; kareler kaydırmayla 1→240 ilerliyor; ortada yazılar kayboluyor; geri kaydırınca yazılar, perde ve 1. kare geri geliyor; yatay taşma yok; canvas ekranı tam dolduruyor.
- **Pencere boyu değişimi:** canvas çözünürlüğü izliyor; hero ortasında değişse bile dizi doğru kalıyor.
- **Kare hızı:** 6 saniyelik kesintisiz kaydırmada 60 fps, 50 ms üzeri kare yok (en uzun kare 33 ms).
- **Randevu:** hero'daki "Randevu al" dönen perdeyle `#randevu`'ya 88 px payla iniyor. Boş formda 4 hata mesajı çıkıyor; 4 adım ve demo onayı çalışıyor.
- **Tarifler** (filtre 9 → 2, pencere, porsiyon 2 → 3), **araçlar** (VKİ, kalori, su), **sohbet asistanı:** çalışıyor.
- **TR/EN:** hero, yükleyici metni ve canvas açıklaması çevriliyor; sayfa boyunca hiçbir başlık kaybolmuyor; sayfa ortasında dil değişince hata yok.
- **Mobil 390 px:** ana sayfa, blog, makale ve KVKK'da yatay taşma yok; bölüm cetveli kapalı.
- **Hareketi azalt:** film katmanı, yükleyici ve sabitleme yok; afiş kare görünüyor; kare dizisi indirilmiyor.
- **JavaScript kapalı:** yükleyici yok, içerik eksiksiz, afiş kare görünüyor.
- **Derin bağlantı** (`#randevu`, `#iletisim`, `#tarifler`, `#uzmanlar`, `#araclar`, `#sss`, `#blog`): yükleyici çıkmıyor, hedefe iniliyor, katman eksiksiz kuruluyor; yukarı kaydırırken 8 ölçüm noktasında görünmez kalan öge yok.
- **Sayfa ortasında yenileme:** aynı yere dönülüyor.
- **Uzman kartları:** yığından ızgaraya geçişte sayfa kayması 0 px.
- **axe-core:** açık/koyu tema, ana sayfa (3 kaydırma noktası), blog listesi ve makalede ihlal yok.
- **Konsol:** ana sayfa, blog, makale ve KVKK'da hata yok.

**Canlı sitede (GitHub Pages) de koşuldu:** yükleyici (240 karenin hepsi iniyor), hero, derin bağlantı, randevu, tarifler, araçlar, sohbet, hareket azaltma ve blog sayfaları.

**Test edilmedi:** Safari / iPhone (bu ortamda yalnızca Chrome var). Kullanılan her özellik Safari 16+'da destekleniyor, yine de gerçek bir iPhone'da bir kez bakmak iyi olur.


## 4. Değişen dosyalar (`diyetisyen-animasyon-v2/` içinde)

| Dosya | Değişiklik |
|---|---|
| `index.html` | `#planet-loader` eklendi, jenerik kaldırıldı, `<img class="hero-img">` yerine `<canvas id="hero-canvas">`; ön yükleme artık ilk kare |
| `assets/frames/` | 240 kare (yeni) |
| `assets/js/motion.js` | Kare yükleyici + canvas çizimi (bölüm 0), yeni `heroScene()`, `openStage()`, tetikleyicileri sayfa başında kurma, derin bağlantıya iniş |
| `assets/js/boot.js` | Jenerik yerine yükleyici sınıfları (`planet`, `planet-boot`) ve 5 sn güvenlik zamanlayıcısı |
| `assets/css/motion.css` | Yükleyici stilleri, `main { display: block }` geri geldi, hero'da bölüm cetvelinin çekilmesi |
| `assets/css/premium.css` | Canvas kuralları, afiş kareler, perde/paragraf kontrastı |
| `assets/css/site.css` | Artık kullanılmayan `.hero-img` kuralı silindi |
| `assets/js/i18n.js` | `loader.text`, `hero.canvas` eklendi; jenerik ve eski görsel anahtarları silindi |


## 5. Açık konular

1. **Eski sinematik sitedeki üç hata** (bölüm 2'deki 1–3) hâlâ yayında. İstersen aynı düzeltmeleri `diyetisyen-animasyon/`'a da taşıyabilirim; bu sefer klasöre dokunmama kuralı yüzünden yapmadım.
2. **Paylaşım görseli** (`og-image.jpg`) hâlâ mutfak fotoğrafı. İstersen dizinin son karesinden yeni bir görsel üretilebilir.
3. **Yükleme boyutu:** ilk ziyarette 11 MB kare iniyor. Masaüstü ve iyi bağlantıda sorun değil (yerelde ~2 sn). Mobil veride ağır gelirse kareler WebP'ye çevrilip %30–40 küçültülebilir, ya da telefonda her ikinci kare yüklenebilir.
4. `diyetisyen-animasyon/assets/frames/` klasörü (karelerin ilk konduğu yer) git'e eklenmedi; eski site bu kareleri kullanmıyor.
5. Önceki raporlardaki açık işler sürüyor: `config.js` → `endpoint` (Google E-Tablolar bağlantısı), müşteriye gösterilecek sürümün seçimi.
