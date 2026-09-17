# Mizan Beslenme · Google E-Tablolar kurulumu

Randevular, iletişim formu mesajları ve sohbet asistanındaki "beni arayın" talepleri bir Google E-Tablosuna kaydedilir. Kurulum yaklaşık 10 dakika sürer ve bir kez yapılır.

Bağlantı yapılana kadar site **demo modunda** çalışır: randevu akışı sonuna kadar denenebilir ama kayıtlar yalnızca o tarayıcıda tutulur.

---

## 1. Tabloyu ve betiği oluşturun

1. [sheets.new](https://sheets.new) adresinden yeni bir tablo açın ve adını örneğin **Mizan Randevular** yapın.
2. Menüden **Uzantılar → Apps Script**'i açın.
3. Açılan editördeki `Code.gs` dosyasının içeriğini tamamen silin, bu klasördeki `Code.gs` dosyasının içeriğini yapıştırın ve kaydedin (⌘S).
4. Dosyanın başındaki `CONFIG` bölümünde şunları kendi bilgilerinizle değiştirin:
   - `CLINIC_EMAIL`: bildirimlerin gideceği adres (boş bırakırsanız kendi Google hesabınıza gider)
   - `CLINIC_PHONE`, `CLINIC_ADDRESS`, `SITE_URL`

## 2. `setup` fonksiyonunu bir kez çalıştırın

1. Editörün üstündeki fonksiyon listesinden **setup**'ı seçip **Çalıştır**'a basın.
2. Google izin isteyecek. Hesabınızı seçin → **Gelişmiş** → **(proje adı) sayfasına git (güvenli değil)** → **İzin ver**.
   Bu uyarı, betiği kendiniz yazdığınız için çıkar; betik yalnızca sizin tablonuza, e-postanıza ve takviminize erişir.
3. Tabloya dönün: **Randevular**, **Kapalı Günler**, **Mesajlar** ve **Geri Arama** sayfaları oluşmuş olmalı.

`setup` ayrıca her sabah saat 10:00'da ertesi günün randevularına hatırlatma e-postası gönderen tetikleyiciyi kurar.

## 3. Web uygulaması olarak yayınlayın

1. Sağ üstten **Dağıt → Yeni dağıtım**.
2. Tür olarak **Web uygulaması**'nı seçin.
3. **Yürüten:** Ben · **Erişimi olanlar:** Herkes
4. **Dağıt**'a basın ve verilen **Web uygulaması URL'sini** (…/exec ile biter) kopyalayın.

## 4. Adresi siteye ekleyin

`diyetisyen/assets/js/config.js` dosyasını açın ve kopyaladığınız adresi yapıştırın:

```js
endpoint: 'https://script.google.com/macros/s/XXXXXXXX/exec',
```

Değişikliği GitHub'a gönderin. Birkaç dakika içinde site canlı takvimle çalışmaya başlar.

## 5. Test edin

1. Siteden bir randevu alın.
2. **Randevular** sayfasında yeni satırı, e-posta kutunuzda bildirimi ve Google Takvim'inizde etkinliği görmelisiniz.
3. Sayfayı yenileyin: aldığınız saat takvimde artık **dolu** görünür.
4. Onay e-postasındaki referans koduyla sitedeki **Randevu iptali** penceresinden iptal edin; satırın durumu **İptal (danışan)** olur ve saat yeniden boşalır.

---

## Günlük kullanım

**Telefonla alınan randevuyu işlemek:** Randevular sayfasına bir satır ekleyin ve en azından şu sütunları doldurun:

| Durum | Tarih | Saat | Süre (dk) | Uzman Kodu | Ad Soyad |
|---|---|---|---|---|---|
| Onaylandı | 2026-10-05 | 14:00 | 60 | selin | Ayşe Yılmaz |

O saat sitede otomatik olarak dolu görünür.

**Randevuyu klinik olarak iptal etmek:** Durum sütununu **İptal (klinik)** yapın. Saat sitede yeniden açılır. (Google Takvim'deki etkinliği elle silmeniz gerekir.)

**İzin, kongre, yarım gün kapatma:** **Kapalı Günler** sayfasına satır ekleyin.

| Tarih | Uzman (boş = tüm klinik) | Başlangıç (boş = tüm gün) | Bitiş | Açıklama |
|---|---|---|---|---|
| 2026-10-12 | | | | Klinik kapalı |
| 2026-10-14 | emre | 14:00 | 18:00 | Kongre |

**Görüşme sonrası:** İsterseniz durumu **Tamamlandı** veya **Gelmedi** yapabilirsiniz; bu durumlar saati boşaltmaz.

## Değişiklik yaparken

- Uzmanların çalışma saatleri, görüşme türleri, ücretler veya resmî tatiller hem `Code.gs` içinde hem de `assets/js/config.js` içinde aynı olmalıdır. Sunucu her randevuyu kendi listesiyle yeniden kontrol eder.
- `Code.gs`'de değişiklik yaptıktan sonra **Dağıt → Dağıtımları yönet → kalem simgesi → Sürüm: Yeni sürüm → Dağıt** yapın. Adres değişmez.
- Her yıl dinî bayram tarihlerini (Ramazan ve Kurban Bayramı) iki dosyaya da ekleyin.

## Sınırlar ve güvenlik

- Ücretsiz Gmail hesabında günde yaklaşık **100 e-posta** gönderilebilir (Google Workspace hesaplarında 1.500). Her randevu 2 e-posta (klinik + danışan) kullanır.
- Sitenin doluluk isteği yalnızca tarih, saat, süre ve uzman kodunu döndürür; danışan adı veya iletişim bilgisi hiçbir zaman sitede görünmez.
- Sunucu; çakışan randevuyu, geçmiş veya bir saatten yakın saatleri, çalışma saati dışını, tatilleri ve kapalı günleri reddeder. Aynı telefon/e-postadan saatte en fazla 3 randevu alınabilir. Bot tuzağı (gizli alan) ve çok hızlı gönderim kontrolü vardır.
- Tabloya yazılan `=`, `+`, `-`, `@` ile başlayan metinler formül olarak çalışmaması için korunur.
- Tabloyu yalnızca klinik çalışanlarıyla paylaşın; içinde sağlık verisi bulunabilir.

## Arama motorları

Site yayına girdikten sonra [Google Search Console](https://search.google.com/search-console)'a sitenizi ekleyip `sitemap.xml` adresini gönderin:

```
https://sadikbesler.github.io/asteria-web/diyetisyen/sitemap.xml
```

Kendi alan adınıza taşıdığınızda HTML dosyalarındaki `canonical`, `og:url` ve `sitemap.xml` içindeki adresleri yeni alan adıyla değiştirin.
