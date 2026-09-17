# Mine Ağız ve Diş Sağlığı · Google E-Tablolar kurulumu

İletişim formundan gelen mesajlar bir Google E-Tablosuna kaydedilir, size bildirim
e-postası gelir ve gönderene otomatik yanıt gider. Kurulum yaklaşık 10 dakika sürer
ve bir kez yapılır.

Bağlantı yapılana kadar form **demo modunda** çalışır: form denenebilir ama mesaj
kimseye ulaşmaz, bunu ekranda da yazar.

---

## 1. Tabloyu ve betiği oluşturun

1. [sheets.new](https://sheets.new) adresinden yeni bir tablo açın ve adını örneğin **Mine Diş — Mesajlar** yapın.
2. Menüden **Uzantılar → Apps Script**'i açın.
3. Açılan editördeki `Code.gs` dosyasının içeriğini tamamen silin, bu klasördeki `Code.gs` dosyasının içeriğini yapıştırın ve kaydedin (⌘S).
4. Dosyanın başındaki `CONFIG` bölümünde şunları kendi bilgilerinizle değiştirin:
   - `CLINIC_EMAIL`: bildirimlerin gideceği adres (boş bırakırsanız kendi Google hesabınıza gider)
   - `CLINIC_NAME`, `CLINIC_PHONE`, `SITE_URL`

## 2. `setup` fonksiyonunu bir kez çalıştırın

1. Editörün üstündeki fonksiyon listesinden **setup**'ı seçip **Çalıştır**'a basın.
2. Google izin isteyecek. Hesabınızı seçin → **Gelişmiş** → **(proje adı) sayfasına git (güvenli değil)** → **İzin ver**.
   Bu uyarı, betiği kendiniz yazdığınız için çıkar; betik yalnızca sizin tablonuza ve e-postanıza erişir.
3. Tabloya dönün: **Mesajlar** sayfası başlıklarıyla birlikte oluşmuş olmalı.

## 3. Web uygulaması olarak yayınlayın

1. Sağ üstten **Dağıt → Yeni dağıtım**.
2. Tür olarak **Web uygulaması**'nı seçin.
3. **Yürüten:** Ben · **Erişimi olanlar:** Herkes
4. **Dağıt**'a basın ve verilen **Web uygulaması URL'sini** (…/exec ile biter) kopyalayın.

## 4. Adresi siteye ekleyin

`dis-klinigi/assets/js/config.js` dosyasını açın ve kopyaladığınız adresi yapıştırın:

```js
endpoint: 'https://script.google.com/macros/s/XXXXXXXX/exec',
```

Aynı dosyada `demo: false` yapın ve sayfanın altındaki "Demo site" yazısını
`index.html` ile `kvkk.html` içinden silin.

---

## Günlük kullanım

**Mesajlar sayfası.** Her satır bir form gönderimi. Son sütundaki **Durum**'u
açılır listeden *Yeni → Arandı → Randevu verildi → Kapandı* diye ilerletebilirsiniz;
bu sütun yalnızca sizin takibiniz içindir, siteyi etkilemez.

**Bildirim e-postası.** Her mesaj için `CLINIC_EMAIL` adresine bir e-posta gelir.
Bu e-postayı doğrudan **yanıtlarsanız** yanıt, mesajı gönderen kişiye gider.

**İstenmeyen gönderim.** Aynı e-posta adresinden saatte en fazla 5 mesaj kabul edilir.
Formdaki gizli alan ve "çok hızlı doldurulma" kontrolü bot gönderimlerini eler;
bu gönderimler tabloya yazılmaz. Sınırı `CONFIG.MAX_MESSAGES_PER_HOUR` ile değiştirebilirsiniz.

**Kodu değiştirdikten sonra** mutlaka yeni sürüm yayınlayın:
**Dağıt → Dağıtımları yönet → kalem simgesi → Sürüm: "Yeni sürüm" → Dağıt.**
Aksi hâlde site eski kodu çağırmaya devam eder.

---

## Çalışma saatleri ve tatiller

Sitedeki "şu an açık / kapalı" bilgisi sunucudan değil, `assets/js/config.js`
dosyasındaki `clinicHours`, `holidays` ve `halfDays` alanlarından hesaplanır.
Saatleri değiştirdiğinizde `index.html` içindeki saat tablosunu da güncelleyin.

## Arama motoru

Site yayına girdikten sonra [Google Search Console](https://search.google.com/search-console)'a
sitenizi ekleyip `sitemap.xml` adresini gönderin:

```
https://sadikbesler.github.io/asteria-web/dis-klinigi/sitemap.xml
```

Kendi alan adınıza taşıdığınızda `index.html` ve `kvkk.html` içindeki `canonical`,
`og:url` ve `sitemap.xml` içindeki adresleri yeni alan adıyla değiştirin.
