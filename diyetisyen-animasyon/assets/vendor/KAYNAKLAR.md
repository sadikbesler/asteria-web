# Hazır kütüphaneler ve alınan teknikler

Bu klasördeki dosyalar dışarıdan indirilmiş, ücretsiz ve ticari kullanıma
açık kütüphanelerdir. Hepsi site içinden (`self`) sunulur; CDN yoktur, bu
sayede sayfadaki Content-Security-Policy kuralı gevşetilmek zorunda kalmadı.

| Dosya | Sürüm | Lisans | Kaynak |
|---|---|---|---|
| `gsap.min.js` | 3.15.0 | GSAP Standard "No Charge" License (ticari kullanım ücretsiz) | https://gsap.com |
| `ScrollTrigger.min.js` | 3.15.0 | aynı | https://gsap.com/docs/v3/Plugins/ScrollTrigger |
| `SplitText.min.js` | 3.15.0 | aynı (Nisan 2025'ten beri ücretsiz) | https://gsap.com/docs/v3/Plugins/SplitText |
| `CustomEase.min.js` | 3.15.0 | aynı | https://gsap.com/docs/v3/Eases/CustomEase |
| `lenis.min.js` | 1.3.26 | MIT | https://github.com/darkroomengineering/lenis |

## Kod yazılırken örnek alınan açık kaynak demolar

Aşağıdaki Codrops demoları MIT lisanslıdır. Dosyaları olduğu gibi kopyalamak
yerine teknikleri `assets/js/motion.js` içinde bu sitenin yapısına uyarlandı.

| Teknik | Nereden | Sitede nerede |
|---|---|---|
| Kaydırmaya bağlı bulanık yazı açılışı (blur + stagger) | codrops/ScrollBlurTypography | Bölüm spotları, manifesto sahnesi |
| Satır satır maskeli başlık açılışı | codrops/ScrollTextMotion | Tüm `h1`/`h2` başlıklar |
| Kaydırma hızına tepki veren sonsuz şerit | codrops/LoopScrolling | Bölümler arası şeritler |
| Sütunların farklı hızda kayması | codrops/ElasticGridScroll | Fotoğraf kartları, tarif ızgarası |
| 3B derinlikten gelen kart yığını | codrops/3DStackMotion | Uzmanlar bölümü |
| Kolon/satır bazlı kaydırma koreografisi | codrops/OnScrollColumnsRows | Hizmetler bölümü |

## motion-primitives.com'dan alınan desenler

Kütüphanenin kendisi React + Framer Motion tabanlı olduğu için (bu sitede
derleme aracı yok) bileşenler kopyalanmadı; desenleri sade JavaScript ile
yeniden yazıldı: Sliding Number (sayaç), Text Scramble, Scroll Progress,
Magnetic, Spotlight, Tilt, In View, Infinite Slider.
