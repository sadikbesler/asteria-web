# Hazır kütüphaneler ve alınan teknikler

Bu klasördeki dosyalar dışarıdan indirilmiş, ücretsiz ve ticari kullanıma
açık kütüphanelerdir. Hepsi site içinden (`self`) sunulur; CDN yoktur, bu
sayede sayfadaki Content-Security-Policy kuralı gevşetilmek zorunda kalmadı.

| Dosya | Sürüm | Lisans | Kaynak |
|---|---|---|---|
| `gsap.min.js` | 3.15.0 | GSAP Standard "No Charge" License (ticari kullanım ücretsiz) | https://gsap.com |
| `ScrollTrigger.min.js` | 3.15.0 | aynı | https://gsap.com/docs/v3/Plugins/ScrollTrigger |
| `SplitText.min.js` | 3.15.0 | aynı (Nisan 2025'ten beri ücretsiz) | https://gsap.com/docs/v3/Plugins/SplitText |
| `Flip.min.js` | 3.15.0 | aynı | https://gsap.com/docs/v3/Plugins/Flip |
| `CustomEase.min.js` | 3.15.0 | aynı | https://gsap.com/docs/v3/Eases/CustomEase |
| `lenis.min.js` | 1.3.26 | MIT | https://github.com/darkroomengineering/lenis |

## Codrops altyapıları — nereye uygulandı

`codrops-referans/` klasöründeki demolar MIT lisanslıdır. Dosyalar olduğu
gibi kopyalanmadı; teknikleri `assets/js/motion.js` ve `assets/css/motion.css`
içinde bu sitenin yapısına uyarlandı.

| Codrops altyapısı | Sitede nerede | Nasıl uyarlandı |
|---|---|---|
| **FullImageReveal** | Hero | Ana görsel ortada küçük, köşeleri yuvarlatılmış bir maskeden (`clip-path: inset(30% 34% …)`) başlayıp ekranı kaplayacak şekilde açılır; içerideki fotoğraf 1.55'ten 1'e iner, karartma katmanı eş zamanlı belirir |
| **KineticTypePageTransition** | Tüm `h1`/`h2` başlıklar | Satırlar maskeden çıkarken aynı anda yandan savrulur (`yPercent 112 → 0`, `xPercent 14 → 0`) ve başlık `scaleY 1.14 → 1` ile toklaşır |
| **OnScrollViewSwitch** | Uzmanlar bölümü | Üç kart önce orta sütunda eğik bir yığın hâlinde durur; bölüm görününce GSAP **Flip** ile ızgaraya açılır. Yığın ve ızgara aynı satır yüksekliğini kullandığı için sayfa zıplamaz |
| **TileScroll** | Tarifler ve blog | Tarif kartları sütun sırasına göre farklı hızlarda dikey, blog satırları dönüşümlü olarak yatay kayar; hepsi kaydırmaya bağlı (scrub) |
| **RotatedRevealers** | "Randevu al" ve uzak bölüm bağlantıları | −13° döndürülmüş, açıya göre trigonometriyle büyütülmüş panel aşağıdan gelir, ortada hedefe atlanır, yukarıdan çıkar. Yakın bağlantılarda devreye girmez |
| **LayersAnimation** | Yöntem sahnesi | Sabitlenen sahnede arka plan fotoğrafları `clip-path: polygon(...)` ile cümlelerle birlikte üst üste açılır |

## Önceki turdan kalan uyarlamalar

ScrollBlurTypography (spot yazılar), LoopScrolling (şeritler),
ElasticGridScroll (fotoğraf kartları), OnScrollColumnsRows (hizmetler),
OnScrollTextHighlight (alıntı ve kapanış cümlesi) — hepsi MIT, hepsi
yeniden yazılarak uyarlandı.

## motion-primitives.com'dan alınan desenler

Kütüphane React + Framer Motion tabanlı olduğu için (bu sitede derleme
aracı yok) bileşenler kopyalanmadı; desenleri sade JavaScript ile yeniden
yazıldı: Sliding Number (sayaç), Scroll Progress, Magnetic, Tilt, In View,
Infinite Slider.
