/* Mizan Beslenme — site assistant (rule-based, TR/EN) */
(function () {
  'use strict';

  var M = window.Mizan;
  var chat = document.getElementById('chat');
  if (!M || !chat) return;

  var cfg = M.cfg;
  var html = document.documentElement;
  var onHome = html.getAttribute('data-page') === 'home';
  var rootPath = html.getAttribute('data-root') || './';

  var toggle = document.getElementById('chat-toggle');
  var log = document.getElementById('chat-log');
  var form = document.getElementById('chat-form');
  var input = document.getElementById('chat-input');
  var sendBtn = form.querySelector('.chat-send');
  var closeBtn = chat.querySelector('[data-chat-close]');
  var badge = document.querySelector('[data-chat-badge]');

  /* ---------- Texts ---------- */
  var TEXT = {
    tr: {
      welcome: 'Merhaba, ben Mizan’ın dijital asistanıyım. Randevu, ücretler, çalışma saatleri ya da beslenmeyle ilgili sorularınızda yardımcı olabilirim.\nGenel bilgi veriyorum; kişisel öneriler için diyetisyenlerimizle görüşmeniz gerekir.',
      pills: { book: 'Randevu almak istiyorum', price: 'Ücretler', online: 'Online görüşme', hours: 'Çalışma saatleri', bmi: 'VKİ hesapla', callback: 'Beni arayın', location: 'Adres ve ulaşım', team: 'Uzmanlar', prepare: 'Görüşmeye hazırlık', services: 'Hizmetler', recipes: 'Tarifler', program: 'Örnek program', guarantee: 'Ne kadar sürede sonuç alırım?', calorie: 'Kalori ihtiyacım', water: 'Su ihtiyacım' },
      act: { bookThis: 'Bu saati ayır', openCal: 'Takvimi aç', call: 'Bizi arayın', wa: 'WhatsApp', callback: 'Beni arayın', tools: 'Hesaplama araçları', recipes: 'Tariflere bak', program: 'Programı gör', directions: 'Yol tarifi', team: 'Uzmanları gör', pricing: 'Paketleri gör', cancel: 'Randevu iptali', read: 'Yazıyı oku', bookArea: 'Bu konuda randevu al' },
      greeting: 'Merhaba! Size nasıl yardımcı olabilirim?',
      thanks: 'Rica ederim. Başka bir sorunuz olursa buradayım.',
      bookFound: 'En yakın uygun {what}: {label}, saat {time} · {staff}.',
      bookWhatFirst: 'ilk görüşme (60 dk, vücut analizi dahil)',
      bookWhatOnline: 'online görüşme (45 dk)',
      bookNone: 'Önümüzdeki günlerde online takvimde boş saat görünmüyor. Bekleme listesi için bizi arayabilir ya da sizi aramamızı isteyebilirsiniz.',
      bookOther: 'Randevuyu ana sayfadaki takvimden birkaç adımda oluşturabilirsiniz; uygun saatler canlı olarak görünüyor.',
      price: 'Güncel ücretlerimiz:',
      priceRows: [['İlk görüşme · 60 dk', '1.800 TL'], ['Kontrol görüşmesi · 30 dk', '900 TL'], ['Online görüşme · 45 dk', '1.500 TL'], ['Aylık takip paketi', '5.400 TL / ay'], ['3 aylık program', '14.900 TL']],
      priceNote: 'Nakit, kredi kartı ve havale ile ödeme alıyoruz; 3 aylık programda kredi kartına 3 taksit yapılabiliyor.',
      online: 'Online görüşmeler görüntülü yapılıyor ve 45 dakika sürüyor (1.500 TL). Bağlantı randevudan önce e-postanıza gelir.\nVücut analizi yapılamadığı için evde tartı, mezura ve fotoğrafla takip yöntemini birlikte kuruyoruz. Yurt dışından da katılabilirsiniz; saatler Türkiye saatine göredir.',
      hours: 'Çalışma saatlerimiz:',
      hoursRows: [['Pazartesi – Cuma', '09:00 – 20:00'], ['Cumartesi', '10:00 – 15:00'], ['Pazar', 'Kapalı']],
      hoursNote: 'Resmî tatillerde kapalıyız, arife günleri kapanış 13:00.',
      openNow: 'Şu an açığız (kapanış {time}).',
      closedNow: 'Şu an kapalıyız.',
      location: 'Adresimiz: {address}.\nKadıköy iskelesinden yaklaşık 10 dakika, Moda tramvay durağından 3 dakika yürüme mesafesindeyiz. Binada asansör var; en yakın otopark 150 metre ileride.',
      team: 'Klinikte üç diyetisyen çalışıyor:',
      teamRows: [['Uzm. Dyt. Selin Karaca · klinik beslenme', 'Pzt–Cum'], ['Dyt. Emre Aksoy · sporcu beslenmesi', 'Sal, Per, Cmt'], ['Dyt. Zeynep Tunalı · gebelik ve çocuk', 'Pzt, Çar, Cum, Cmt']],
      services: 'Şu alanlarda danışmanlık veriyoruz: kilo yönetimi, klinik beslenme (insülin direnci, diyabet, PCOS, tiroit, kolesterol), sporcu beslenmesi, gebelik ve emzirme, çocuk ve ergen beslenmesi, online diyet.',
      bmiAsk: 'Boyunuzu ve kilonuzu yazarsanız hemen hesaplayayım. Örneğin: 168 cm 64 kg',
      bmiResult: 'Vücut kitle indeksiniz {bmi} ({cat}). Boyunuza göre sağlıklı kilo aralığı {lo} – {hi} kg.',
      bmiNote: 'VKİ kas ve yağ oranını ayırt etmez; gebelikte ve 18 yaş altında kullanılmaz.',
      cats: ['zayıf', 'normal', 'fazla kilolu', '1. derece obezite', '2. derece obezite', '3. derece obezite'],
      calorie: 'Günlük enerji ihtiyacı yaşa, cinsiyete, boy, kilo ve hareket düzenine göre değişir. Sitedeki hesaplayıcı, Mifflin-St Jeor denklemiyle hedefinize uygun bir değer ve makro dağılımı veriyor.',
      water: 'Genel bir başlangıç noktası kilo başına yaklaşık 30–35 ml. Egzersiz, sıcak hava, gebelik ve emzirme ihtiyacı artırır. Su hesaplayıcımız bunları dikkate alıyor; gün içinde içtiğiniz bardakları da işaretleyebilirsiniz.',
      insulin: 'İnsülin direncinde amaç kan şekerindeki ani yükselişleri azaltmak: tabağın yarısı sebze, her öğünde protein, rafine un ve şekerli içecekleri azaltmak ve yemekten sonra kısa yürüyüşler işe yarıyor.\nİlaç kararları hekiminize aittir; biz planı tedavinizle uyumlu hazırlıyoruz.',
      pregnancy: 'Gebelikte kısıtlayıcı bir diyet değil, sizin ve bebeğin ihtiyaçlarını karşılayan dengeli bir plan hedefliyoruz. Trimestere göre enerji, protein, folat, demir ve iyot ihtiyacı değişir.\nBu alanda Dyt. Zeynep Tunalı çalışıyor; takviye kararları için kadın doğum hekiminize danışın.',
      kids: 'Çocuklarla 2 yaşından itibaren, 12 yaş altında ebeveynle birlikte görüşüyoruz. Kilo odaklı bir diyet yerine ailenin sofra düzeni, seçici yeme ve okul beslenmesi üzerinde çalışıyoruz.',
      sports: 'Sporcu beslenmesinde antrenman saatine göre karbonhidrat ve protein zamanlaması öne çıkıyor. Düzenli antrenman yapan çoğu yetişkin için günde kilo başına 1,2–2,0 g protein yeterli; toz protein zorunlu değil, pratik bir seçenek.\nDyt. Emre Aksoy sporcularla çalışıyor.',
      fasting: 'Aralıklı oruç (ör. 16:8) bazı kişilerde işe yarayabilir; çalışmalarda klasik kalori kısıtlamasıyla benzer sonuçlar görülüyor.\nGebelik, emzirme, tip 1 diyabet, insülin veya bazı diyabet ilaçlarının kullanımı ve yeme bozukluğu öyküsünde uygun değildir.',
      keto: 'Ketojenik diyet kısa vadede hızlı kilo kaybı sağlayabilir ama uzun süre sürdürmesi zordur ve lif, bazı vitamin ve mineraller açısından eksik kalabilir. Böbrek veya karaciğer hastalığında, gebelikte ve bazı ilaçları kullananlarda uygun değildir. Denemeden önce bir diyetisyenle görüşmenizi öneririz.',
      supplements: 'Takviye, zayıflama çayı veya ürün satmıyor ve marka önermiyoruz. “Detoks” için ek bir ürüne gerek yok; bu işi karaciğer ve böbrekler yapıyor. Tahlillerinizde bir eksiklik varsa takviye kararı için sizi hekiminize yönlendiriyoruz.',
      weight: 'Sağlıklı kilo kaybı genellikle haftada 0,5–1 kg arasındadır. Aç kalmadan, porsiyon ve öğün düzeniyle çalışıyor, ilk görüşmede vücut analizi yapıyoruz. Önce VKİ ve kalori hesaplayıcılarına göz atabilirsiniz.',
      cancel: 'Randevunuzu 24 saat öncesine kadar, onay e-postasındaki referans koduyla “Randevu iptali” bölümünden iptal edebilirsiniz. Daha yakın saatler için lütfen bizi arayın.',
      payment: 'Nakit, kredi kartı ve havale ile ödeme alıyoruz; 3 aylık programda 3 taksit yapılabiliyor. Her görüşme için fatura düzenleniyor. Bazı özel sağlık sigortaları diyetisyen görüşmelerini karşılıyor; poliçenizi kontrol etmenizi öneririz.',
      prepare: 'Görüşmeye gelirken yanınızda olsun:\n— Son 3 aydaki kan tahlilleriniz\n— Kullandığınız ilaç ve takviyelerin listesi\n— Mümkünse 3 günlük besin kaydınız\nVücut analizi için son 2 saatte ağır yemek yememeniz ve son 12 saatte yoğun egzersiz yapmamanız yeterli.',
      guarantee: 'Kesin kilo vaadinde bulunmuyoruz; değişim hormonlar, uyku, stres, ilaçlar ve başlangıç kilosu gibi birçok etkene bağlı. Sağlıklı bir hız genellikle haftada 0,5–1 kg. İlk ayın sonunda gidişatı birlikte değerlendiriyoruz.',
      recipes: 'Sitede 9 pratik tarif var: gece yulafı, şakşuka, kinoalı kısır, fırın somon, fırında falafel, humus, chia puding, fırın elma ve balkabaklı mercimek çorbası. Hepsinde porsiyon başına besin değerleri yer alıyor.',
      program: 'Kilo verme (~1.500 kcal), dengeli (~1.900 kcal) ve sporcu (~2.500 kcal) hedefleri için birer haftalık örnek menü hazırladık. Genel bir örnektir; size özel plan görüşmede hazırlanır.',
      blog: 'Son yazılarımızdan bazıları:',
      contact: 'Bize şu kanallardan ulaşabilirsiniz:',
      contactRows: function () { return [['Telefon', cfg.phoneDisplay], ['WhatsApp', cfg.phoneDisplay], ['E-posta', cfg.email]]; },
      human: 'Mesai saatlerinde WhatsApp’tan yazarsanız bir diyetisyenimiz yanıtlıyor. İsterseniz sizi aramamızı da talep edebilirsiniz.',
      emergency: 'Yazdıklarınız acil bir durumu işaret ediyor olabilir. Lütfen hemen 112’yi arayın ya da en yakın acil servise başvurun. Bu asistan acil durumlarda yardımcı olamaz.',
      ed: 'Bunu paylaştığınız için teşekkür ederim. Yeme davranışıyla ilgili zorluklarla tek başınıza baş etmek zorunda değilsiniz. Hekim, psikolog ve diyetisyenden oluşan bir ekiple destek almanızı öneririz. Kendinizi tehlikede hissederseniz 112’yi arayın.\nİsterseniz diyetisyenimiz sizi arayıp doğru uzmanlara yönlendirebilir.',
      unknown: 'Bunu tam anlayamadım. Randevu, ücretler, çalışma saatleri, VKİ hesaplama ya da beslenme konularında yardımcı olabilirim. Dilerseniz bir diyetisyenimiz sizi arasın.',
      cbStart: 'Memnuniyetle. Diyetisyenimiz mesai saatleri içinde sizi arasın. Adınız ve soyadınız nedir?\n(Vazgeçmek için “vazgeç” yazabilirsiniz.)',
      cbPhone: 'Teşekkürler {name}. Size hangi numaradan ulaşalım?',
      cbBadName: 'Adınızı ve soyadınızı yazar mısınız?',
      cbBadPhone: 'Bu numarayı tanıyamadım. 0532 123 45 67 biçiminde ya da ülke koduyla (+49…) yazabilir misiniz?',
      cbDone: 'Talebinizi aldık. {phone} numarasından en geç bir iş günü içinde aranacaksınız.',
      cbDemo: 'Demo modu: site henüz Google E-Tablolar’a bağlı olmadığı için talep kaydedilemedi. Aşağıdaki bağlantıyla WhatsApp’tan iletebilirsiniz.',
      cbError: 'Talebinizi şu an kaydedemedim. WhatsApp’tan iletebilirsiniz.',
      cbCancelled: 'Tamam, arama talebini iptal ettim.',
      cbWa: 'Merhaba, beni arayabilir misiniz?\nAd soyad: {name}\nTelefon: {phone}',
      cbPrivacy: 'Bilgileriniz yalnızca sizi aramak için kullanılır.',
      today: 'Bugün', tomorrow: 'Yarın',
      posts: [['İnsülin direnci için beslenme', 'insulin-direnci-beslenme'], ['Aralıklı oruç (16:8) herkese uygun mu?', 'aralikli-oruc-16-8'], ['Günde kaç litre su içmeliyiz?', 'gunluk-su-ihtiyaci']],
      typing: 'Mizan Asistan yazıyor'
    },
    en: {
      welcome: 'Hello, I’m Mizan’s digital assistant. I can help with appointments, prices, opening hours or general nutrition questions.\nI share general information only; for personal advice, please speak to one of our dietitians.',
      pills: { book: 'I’d like to book', price: 'Prices', online: 'Online consultation', hours: 'Opening hours', bmi: 'Calculate BMI', callback: 'Call me back', location: 'Address & directions', team: 'Our dietitians', prepare: 'How to prepare', services: 'Services', recipes: 'Recipes', program: 'Sample meal plan', guarantee: 'How soon will I see results?', calorie: 'My calorie needs', water: 'My water needs' },
      act: { bookThis: 'Book this time', openCal: 'Open the calendar', call: 'Call us', wa: 'WhatsApp', callback: 'Call me back', tools: 'Calculators', recipes: 'See recipes', program: 'See the plan', directions: 'Directions', team: 'Meet the team', pricing: 'See packages', cancel: 'Cancel a booking', read: 'Read the article', bookArea: 'Book for this topic' },
      greeting: 'Hello! How can I help?',
      thanks: 'You’re welcome. I’m here if anything else comes up.',
      bookFound: 'The next available {what} is {label} at {time} · {staff}.',
      bookWhatFirst: 'first consultation (60 min, body analysis included)',
      bookWhatOnline: 'online consultation (45 min)',
      bookNone: 'There are no free times in the online calendar over the coming days. Call us to join the waiting list, or ask us to call you.',
      bookOther: 'You can book in a few steps from the calendar on the home page; availability is shown live.',
      price: 'Our current prices:',
      priceRows: [['First consultation · 60 min', '1,800 TL'], ['Follow-up · 30 min', '900 TL'], ['Online consultation · 45 min', '1,500 TL'], ['Monthly follow-up', '5,400 TL / month'], ['3-month programme', '14,900 TL']],
      priceNote: 'We accept cash, card and bank transfer; the 3-month programme can be split into 3 card instalments.',
      online: 'Online consultations are held by video and last 45 minutes (1,500 TL). The link arrives by email before your appointment.\nSince we can’t do a body analysis remotely, we set up a simple way to track progress at home with a scale, a tape measure and photos. You can join from abroad; times are in Türkiye time.',
      hours: 'Our opening hours:',
      hoursRows: [['Monday – Friday', '09:00 – 20:00'], ['Saturday', '10:00 – 15:00'], ['Sunday', 'Closed']],
      hoursNote: 'We are closed on public holidays and close at 13:00 on holiday eves.',
      openNow: 'We are open now (closing at {time}).',
      closedNow: 'We are closed right now.',
      location: 'Our address: {address}.\nWe are about a 10-minute walk from Kadıköy ferry pier and 3 minutes from the Moda tram stop. The building has a lift; the nearest car park is 150 m away.',
      team: 'Three dietitians work at the clinic:',
      teamRows: [['Selin Karaca, RD, MSc · clinical nutrition', 'Mon–Fri'], ['Emre Aksoy, RD · sports nutrition', 'Tue, Thu, Sat'], ['Zeynep Tunalı, RD · pregnancy and children', 'Mon, Wed, Fri, Sat']],
      services: 'We offer weight management, clinical nutrition (insulin resistance, diabetes, PCOS, thyroid, cholesterol), sports nutrition, pregnancy and breastfeeding, child and teen nutrition, and online consultations.',
      bmiAsk: 'Tell me your height and weight and I’ll work it out. For example: 168 cm 64 kg',
      bmiResult: 'Your BMI is {bmi} ({cat}). A healthy weight range for your height is {lo} – {hi} kg.',
      bmiNote: 'BMI doesn’t distinguish muscle from fat and isn’t used in pregnancy or under 18.',
      cats: ['underweight', 'healthy weight', 'overweight', 'obesity class I', 'obesity class II', 'obesity class III'],
      calorie: 'Daily energy needs depend on age, sex, height, weight and activity. The calculator on the site uses the Mifflin-St Jeor equation to suggest a target and a macro split for your goal.',
      water: 'A general starting point is about 30–35 ml per kilo of body weight. Exercise, hot weather, pregnancy and breastfeeding increase it. Our water calculator accounts for these, and you can tick off glasses through the day.',
      insulin: 'With insulin resistance, the aim is to soften blood sugar spikes: half the plate vegetables, protein at every meal, less refined flour and sugary drinks, and a short walk after meals all help.\nDecisions about medication belong to your doctor; we build the plan around your treatment.',
      pregnancy: 'In pregnancy we don’t aim for a restrictive diet but a balanced plan that meets your and your baby’s needs. Energy, protein, folate, iron and iodine needs change by trimester.\nZeynep Tunalı works in this area; please ask your obstetrician about supplements.',
      kids: 'We see children from age 2, with a parent present under 12. Rather than a weight-focused diet, we work on family meals, picky eating and school food.',
      sports: 'Sports nutrition is mostly about timing carbohydrate and protein around training. For most adults who train regularly, 1.2–2.0 g of protein per kg per day is enough; protein powder is convenient, not essential.\nEmre Aksoy works with athletes.',
      fasting: 'Intermittent fasting (e.g. 16:8) can work for some people; studies show results similar to regular calorie restriction.\nIt is not suitable in pregnancy or breastfeeding, type 1 diabetes, when using insulin or certain diabetes medicines, or with a history of eating disorders.',
      keto: 'A ketogenic diet can bring quick weight loss in the short term but is hard to sustain and can fall short on fibre, vitamins and minerals. It isn’t suitable with kidney or liver disease, in pregnancy, or with some medications. Please talk to a dietitian before trying it.',
      supplements: 'We don’t sell or recommend supplements, slimming teas or brands. There’s no need for a “detox” product; your liver and kidneys already do that job. If your blood tests show a deficiency, we refer you to your doctor for supplement advice.',
      weight: 'Healthy weight loss is usually 0.5–1 kg a week. We work on portions and meal patterns without going hungry, and do a body analysis at the first visit. You might want to try the BMI and calorie calculators first.',
      cancel: 'You can cancel up to 24 hours before your appointment using the reference code from your confirmation email, under “Cancel a booking”. For anything closer, please call us.',
      payment: 'We accept cash, card and bank transfer; the 3-month programme can be split into 3 instalments. We issue an invoice for every visit. Some private health insurance covers dietitian visits, so it is worth checking your policy.',
      prepare: 'Please bring:\n— Blood tests from the last 3 months\n— A list of your medication and supplements\n— A 3-day food diary, if you can\nFor the body analysis, avoid a heavy meal in the last 2 hours and intense exercise in the last 12 hours.',
      guarantee: 'We don’t promise a specific amount of weight loss; it depends on hormones, sleep, stress, medication and your starting weight. A healthy pace is usually 0.5–1 kg a week, and we review progress together after the first month.',
      recipes: 'There are 9 practical recipes on the site: overnight oats, shakshuka, quinoa kısır, baked salmon, baked falafel, hummus, chia pudding, baked apples and pumpkin lentil soup, each with nutrition per serving.',
      program: 'We put together a sample week for three goals: weight loss (~1,500 kcal), balanced (~1,900 kcal) and sport (~2,500 kcal). It is a general example; your personal plan is built at your appointment.',
      blog: 'A few of our latest articles:',
      contact: 'You can reach us here:',
      contactRows: function () { return [['Phone', cfg.phoneDisplay], ['WhatsApp', cfg.phoneDisplay], ['Email', cfg.email]]; },
      human: 'During opening hours, a dietitian replies to WhatsApp messages. You can also ask us to call you.',
      emergency: 'What you describe may be an emergency. Please call 112 (or your local emergency number) right away or go to the nearest emergency department. This assistant can’t help in an emergency.',
      ed: 'Thank you for sharing this. You don’t have to deal with difficulties around eating on your own. We recommend support from a team that includes a doctor, a psychologist and a dietitian. If you feel you are in danger, call 112.\nIf you like, one of our dietitians can call you and point you to the right specialists.',
      unknown: 'I didn’t quite get that. I can help with appointments, prices, opening hours, BMI or general nutrition questions, or one of our dietitians can call you.',
      cbStart: 'Of course. A dietitian will call you during opening hours. What is your full name?\n(Type “cancel” to stop.)',
      cbPhone: 'Thanks, {name}. Which number should we call?',
      cbBadName: 'Could you type your first and last name?',
      cbBadPhone: 'I couldn’t recognise that number. Please write it like 0532 123 45 67 or with a country code (+44…).',
      cbDone: 'Got it. We’ll call {phone} within one working day.',
      cbDemo: 'Demo mode: the site isn’t connected to Google Sheets yet, so the request couldn’t be saved. You can send it via WhatsApp below.',
      cbError: 'I couldn’t save your request right now. You can send it via WhatsApp instead.',
      cbCancelled: 'OK, I’ve cancelled the call-back request.',
      cbWa: 'Hello, could you call me back?\nName: {name}\nPhone: {phone}',
      cbPrivacy: 'Your details are only used to call you back.',
      today: 'today', tomorrow: 'tomorrow',
      posts: [['Eating for insulin resistance', 'insulin-direnci-beslenme'], ['Is 16:8 intermittent fasting for everyone?', 'aralikli-oruc-16-8'], ['How much water do we really need?', 'gunluk-su-ihtiyaci']],
      typing: 'Mizan Assistant is typing'
    }
  };
  function X() { return TEXT[M.lang()] || TEXT.tr; }
  function fill(s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }); }

  /* ---------- Understanding ---------- */
  var KEYWORDS = {
    emergency: ['gogus agri', 'gogsumde agri', 'bayildim', 'bayiliyorum', 'nefes alamiyorum', 'intihar', 'kendime zarar', 'olmek istiyorum', 'chest pain', 'fainted', 'cant breathe', 'can not breathe', 'suicide', 'self harm', 'kill myself'],
    ed: ['kusuyorum', 'kendimi kusturuyorum', 'kusturuyorum', 'anoreksi', 'bulimi', 'tikinircasina', 'yemek yemeyi reddediyorum', 'yedikten sonra kus', 'binge eating', 'anorexia', 'bulimia', 'purging', 'make myself sick', 'making myself sick'],
    callback: ['beni arayin', 'beni ara', 'arar misiniz', 'arayabilir misiniz', 'geri arama', 'geri donus', 'aranmak istiyorum', 'call me', 'call back', 'callback', 'ring me'],
    cancel: ['iptal', 'ertele', 'randevumu degis', 'saatini degis', 'cancel', 'reschedule'],
    prepare: ['ne getir', 'yanimda', 'hazirlik', 'hazirlan', 'tahlil', 'ac mi gel', 'ilk gorusmede', 'bring', 'prepare', 'blood test', 'first visit'],
    book: ['randevu', 'rezervasyon', 'musait', 'bos saat', 'uygun saat', 'en yakin', 'gelmek istiyorum', 'appointment', 'book', 'booking', 'available', 'slot', 'schedule'],
    guarantee: ['garanti', 'kac kilo veririm', 'ne kadar surede', 'kac haftada', 'kac ayda', 'guarantee', 'how fast', 'how quickly', 'how many kilos'],
    bmi: ['vki', 'bmi', 'kitle indeks', 'ideal kilo', 'body mass'],
    calorie: ['kalori', 'kcal', 'metabolizma', 'bazal', 'calorie', 'calories', 'metabolism'],
    water: ['su', 'su icme', 'kac litre', 'litre su', 'sivi alimi', 'water', 'hydration'],
    payment: ['odeme', 'kredi karti', 'havale', 'nakit', 'taksit', 'sigorta', 'fatura', 'payment', 'card', 'instalment', 'installment', 'insurance', 'invoice'],
    price: ['fiyat', 'ucret', 'kac para', 'kac tl', 'ne kadar', 'paket', 'maliyet', 'price', 'prices', 'cost', 'fee', 'fees', 'how much', 'package'],
    online: ['online', 'uzaktan', 'goruntulu', 'video', 'zoom', 'yurt disi', 'sehir disi', 'internetten', 'remote', 'abroad'],
    hours: ['calisma saat', 'saat kacta', 'kacta', 'acik mi', 'acik misiniz', 'kapali mi', 'hafta sonu', 'cumartesi', 'pazar gunu', 'mesai', 'opening', 'open', 'hours', 'closed', 'weekend', 'saturday', 'sunday'],
    location: ['adres', 'nerede', 'neredesiniz', 'konum', 'yol tarifi', 'otopark', 'park yeri', 'metro', 'tramvay', 'iskele', 'kadikoy', 'moda', 'address', 'where', 'location', 'directions', 'parking'],
    team: ['uzmanlar', 'diyetisyenler', 'kadro', 'selin', 'emre', 'zeynep', 'hocalar', 'kimler', 'team', 'dietitians', 'staff'],
    insulin: ['insulin', 'diyabet', 'seker hasta', 'kan sekeri', 'prediyabet', 'pcos', 'polikistik', 'tiroid', 'tiroit', 'hashimoto', 'kolesterol', 'diabetes', 'blood sugar', 'thyroid', 'cholesterol'],
    pregnancy: ['hamile', 'gebe', 'gebelik', 'emzir', 'lohusa', 'pregnan', 'breastfeed', 'nursing'],
    kids: ['cocuk', 'ergen', 'okul', 'secici yeme', 'yemek secen', 'kid', 'kids', 'child', 'children', 'teen', 'picky'],
    sports: ['spor', 'sporcu', 'antrenman', 'kas', 'fitness', 'protein tozu', 'maraton', 'vucut gelistirme', 'athlete', 'sport', 'sports', 'workout', 'training', 'muscle', 'gym', 'protein powder'],
    fasting: ['aralikli', 'oruc', '16 8', 'intermittent', 'fasting'],
    keto: ['keto', 'ketojenik', 'dusuk karbonhidrat', 'low carb', 'atkins'],
    supplements: ['takviye', 'vitamin', 'detoks', 'detox', 'zayiflama cayi', 'hap', 'urun satiyor', 'supplement', 'supplements', 'pill', 'pills', 'slimming tea'],
    program: ['liste', 'menu', 'ornek program', 'diyet program', 'beslenme program', 'meal plan', 'diet plan', 'sample'],
    recipes: ['tarif', 'yemek oneri', 'ne pisir', 'recipe', 'recipes', 'cook'],
    weight: ['kilo ver', 'zayifla', 'kilo al', 'kilo koru', 'gobek', 'yag yak', 'diyet', 'lose weight', 'weight loss', 'gain weight', 'belly fat', 'diet'],
    blog: ['blog', 'yazi', 'makale', 'article', 'articles'],
    services: ['hizmet', 'neler yapiyor', 'hangi konular', 'ne yapiyorsunuz', 'services', 'what do you do', 'what do you offer'],
    contact: ['iletisim', 'telefon', 'numara', 'whatsapp', 'mail', 'e posta', 'eposta', 'ulas', 'contact', 'phone', 'number', 'email', 'reach'],
    human: ['insan', 'gercek kisi', 'yetkili', 'canli destek', 'diyetisyenle konus', 'human', 'real person', 'agent', 'someone'],
    greeting: ['merhaba', 'selam', 'slm', 'mrb', 'iyi gunler', 'gunaydin', 'iyi aksamlar', 'hello', 'hi', 'hey', 'good morning', 'good evening'],
    thanks: ['tesekkur', 'sagol', 'sag ol', 'eyvallah', 'thanks', 'thank you', 'thx']
  };
  var ORDER = ['emergency', 'ed', 'callback', 'cancel', 'prepare', 'guarantee', 'book', 'bmi', 'calorie', 'water', 'payment', 'price', 'online', 'hours', 'location', 'team', 'insulin', 'pregnancy', 'kids', 'sports', 'fasting', 'keto', 'supplements', 'program', 'recipes', 'weight', 'blog', 'services', 'contact', 'human', 'thanks', 'greeting'];

  function normalize(v) {
    return String(v).toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .split(/[^a-z0-9]+/).filter(Boolean);
  }
  var MATCHERS = {};
  Object.keys(KEYWORDS).forEach(function (intent) {
    MATCHERS[intent] = KEYWORDS[intent].map(function (w) { var tk = normalize(w); return { tokens: tk, phrase: tk.join(' ') }; });
  });
  function detect(text) {
    var tokens = normalize(text);
    var joined = ' ' + tokens.join(' ') + ' ';
    var hits = {};
    Object.keys(MATCHERS).forEach(function (intent) {
      hits[intent] = MATCHERS[intent].some(function (kw) {
        if (kw.tokens.length > 1) return joined.indexOf(' ' + kw.phrase) >= 0;
        var w = kw.tokens[0];
        return w.length <= 3 ? tokens.indexOf(w) >= 0 : tokens.some(function (tk) { return tk.indexOf(w) === 0; });
      });
    });
    return hits;
  }

  function parseBody(text) {
    var s = String(text).toLocaleLowerCase('tr').replace(/(\d),(\d)/g, '$1.$2');
    var re = /\d+(?:\.\d+)?/g;
    var m, height = null, weight = null, loose = [], units = false;
    while ((m = re.exec(s))) {
      var v = parseFloat(m[0]);
      var before = s.slice(Math.max(0, m.index - 14), m.index);
      var after = s.slice(re.lastIndex, re.lastIndex + 12);
      var isH = /^\s*(cm|m\b|metre|santim)/.test(after) || /(boy|height|tall)\S*\s*[:=]?\s*$/.test(before);
      var isW = /^\s*(kg\b|kilo\b|kilogram)/.test(after) || /(kilo|weight|weigh)\S*\s*[:=]?\s*$/.test(before);
      if (isH && height == null && v >= 1.2 && v <= 2.3) { height = v * 100; units = true; continue; }
      if (isH && height == null && v >= 120 && v <= 230) { height = v; units = true; continue; }
      if (isW && weight == null && v >= 30 && v <= 250) { weight = v; units = true; continue; }
      loose.push(v);
    }
    loose.forEach(function (v) {
      if (height == null && v >= 1.2 && v <= 2.3) height = v * 100;
      else if (height == null && v >= 120 && v <= 230) height = v;
      else if (weight == null && v >= 30 && v <= 250) weight = v;
    });
    return height && weight ? { h: height, w: weight, units: units } : null;
  }

  /* ---------- Links and actions ---------- */
  function homeHref(hash) {
    if (onHome) return hash;
    return rootPath + 'index.html' + (M.lang() === 'en' ? '?lang=en' : '') + hash;
  }
  function blogHref(slug) {
    var base = onHome ? 'blog/' : (html.getAttribute('data-page') === 'blog' ? '' : rootPath + 'blog/');
    return base + slug + '.html' + (M.lang() === 'en' ? '?lang=en' : '');
  }
  function A(label, kind, data, primary) { return { label: label, kind: kind, data: data || null, primary: !!primary }; }

  function nextSlotReply(opts) {
    var x = X();
    if (!onHome || !M.booking) {
      return { text: x.bookOther, actions: [A(x.act.openCal, 'nav', '#randevu', true), A(x.act.callback, 'callback')] };
    }
    var n = M.booking.nextAvailable(opts);
    if (!n) return { text: x.bookNone, actions: [A(x.act.call, 'tel'), A(x.act.callback, 'callback')] };
    var label = n.label;
    return {
      text: fill(x.bookFound, { what: opts.type === 'online' ? x.bookWhatOnline : x.bookWhatFirst, label: label, time: n.time, staff: M.lang() === 'en' && cfg.staff[n.staff].nameEn ? cfg.staff[n.staff].nameEn : cfg.staff[n.staff].name }),
      actions: [
        A(x.act.bookThis, 'book', { type: opts.type || 'first', area: opts.area || null, staff: n.staff, date: n.date, time: n.time }, true),
        A(x.act.openCal, 'book', { type: opts.type || 'first', area: opts.area || null })
      ],
      pills: ['price', 'prepare']
    };
  }
  function openStatusLine() {
    var now = M.time.now();
    var h = (cfg.clinicHours || {})[now.dow];
    if (!h || M.time.holidayName(now.key)) return X().closedNow;
    var start = M.time.toMin(h[0]);
    var end = M.time.halfDayName(now.key) ? Math.min(M.time.toMin(h[1]), M.time.toMin(cfg.halfDayClose || '13:00')) : M.time.toMin(h[1]);
    return now.minutes >= start && now.minutes < end ? fill(X().openNow, { time: M.time.fromMin(end) }) : X().closedNow;
  }

  var AREA_OF = { insulin: 'clinical', pregnancy: 'pregnancy', kids: 'kids', sports: 'sports', weight: 'weight' };

  function answer(text, forced) {
    var x = X();
    var hits = forced ? {} : detect(text);
    if (forced) hits[forced] = true;
    var intent = ORDER.filter(function (k) { return hits[k]; })[0];
    var body = forced ? null : parseBody(text);
    if (body && intent !== 'emergency' && intent !== 'ed' && (hits.bmi || hits.weight || body.units || !intent)) intent = 'bmiCalc';
    if (intent === 'book' && hits.online) return nextSlotReply({ type: 'online' });

    switch (intent) {
      case 'emergency': return { text: x.emergency, actions: [A('112', 'raw', 'tel:112', true)] };
      case 'ed': return { text: x.ed, actions: [A(x.act.callback, 'callback', null, true), A(x.act.wa, 'wa')] };
      case 'callback': return { flow: 'callback' };
      case 'cancel': return { text: x.cancel, actions: onHome ? [A(x.act.cancel, 'cancel', null, true), A(x.act.call, 'tel')] : [A(x.act.cancel, 'nav', '#randevu', true), A(x.act.call, 'tel')] };
      case 'prepare': return { text: x.prepare, actions: [A(x.act.openCal, 'book', { type: 'first' }, true)], pills: ['price', 'location'] };
      case 'guarantee': return { text: x.guarantee, actions: [A(x.act.openCal, 'book', { area: 'weight' }, true)], pills: ['bmi', 'program'] };
      case 'book': {
        var area = ['insulin', 'pregnancy', 'kids', 'sports'].filter(function (k) { return hits[k]; }).map(function (k) { return AREA_OF[k]; })[0];
        return nextSlotReply({ type: 'first', area: area || null });
      }
      case 'bmiCalc': {
        var m = body.h / 100, bmi = body.w / (m * m);
        var idx = bmi < 18.5 ? 0 : bmi < 25 ? 1 : bmi < 30 ? 2 : bmi < 35 ? 3 : bmi < 40 ? 4 : 5;
        var f1 = function (n) { return new Intl.NumberFormat(M.lang() === 'en' ? 'en-GB' : 'tr-TR', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(n); };
        return { text: fill(x.bmiResult, { bmi: f1(bmi), cat: x.cats[idx], lo: f1(18.5 * m * m), hi: f1(24.9 * m * m) }), note: x.bmiNote, actions: [A(x.act.tools, 'tool', 'bmi', true), A(x.act.bookArea, 'book', { area: idx >= 3 ? 'clinical' : 'weight' })] };
      }
      case 'bmi': return { text: x.bmiAsk, actions: [A(x.act.tools, 'tool', 'bmi')] };
      case 'calorie': return { text: x.calorie, actions: [A(x.act.tools, 'tool', 'kcal', true)], pills: ['program', 'book'] };
      case 'water': return { text: x.water, actions: [A(x.act.tools, 'tool', 'water', true), A(x.act.read, 'blog', 'gunluk-su-ihtiyaci')] };
      case 'payment': return { text: x.payment, pills: ['price', 'book'] };
      case 'price': return { title: null, text: x.price, rows: x.priceRows, note: x.priceNote, actions: [A(x.act.pricing, 'nav', '#ucretler'), A(x.act.openCal, 'book', { type: 'first' }, true)], pills: ['online', 'callback'] };
      case 'online': return { text: x.online, actions: [A(x.act.openCal, 'book', { type: 'online' }, true)], pills: ['price', 'hours'] };
      case 'hours': return { text: x.hours + '\n' + openStatusLine(), rows: x.hoursRows, note: x.hoursNote, pills: ['location', 'book'] };
      case 'location': return { text: fill(x.location, { address: cfg.address[M.lang()] || cfg.address.tr }), actions: [A(x.act.directions, 'maps', null, true), A(x.act.call, 'tel')], pills: ['hours'] };
      case 'team': return { text: x.team, rows: x.teamRows, actions: [A(x.act.team, 'nav', '#uzmanlar'), A(x.act.openCal, 'book', {}, true)] };
      case 'insulin': return { text: x.insulin, actions: [A(x.act.bookArea, 'book', { area: 'clinical' }, true), A(x.act.read, 'blog', 'insulin-direnci-beslenme')] };
      case 'pregnancy': return { text: x.pregnancy, actions: [A(x.act.bookArea, 'book', { area: 'pregnancy', staff: 'zeynep' }, true)], pills: ['water'] };
      case 'kids': return { text: x.kids, actions: [A(x.act.bookArea, 'book', { area: 'kids', staff: 'zeynep' }, true)] };
      case 'sports': return { text: x.sports, actions: [A(x.act.bookArea, 'book', { area: 'sports', staff: 'emre' }, true), A(x.act.read, 'blog', 'protein-ihtiyaci')] };
      case 'fasting': return { text: x.fasting, actions: [A(x.act.read, 'blog', 'aralikli-oruc-16-8', true)], pills: ['book'] };
      case 'keto': return { text: x.keto, pills: ['book', 'program'] };
      case 'supplements': return { text: x.supplements, pills: ['book'] };
      case 'program': return { text: x.program, actions: [A(x.act.program, 'nav', '#program', true)], pills: ['recipes', 'calorie'] };
      case 'recipes': return { text: x.recipes, actions: [A(x.act.recipes, 'nav', '#tarifler', true)], pills: ['program'] };
      case 'weight': return { text: x.weight, actions: [A(x.act.tools, 'tool', 'bmi'), A(x.act.bookArea, 'book', { area: 'weight' }, true)], pills: ['guarantee', 'price'] };
      case 'blog': return { text: x.blog, actions: x.posts.map(function (p, i) { return A(p[0], 'blog', p[1], i === 0); }) };
      case 'services': return { text: x.services, actions: [A(x.act.openCal, 'book', {}, true)], pills: ['price', 'team', 'online'] };
      case 'contact': return { text: x.contact, rows: x.contactRows(), actions: [A(x.act.wa, 'wa', null, true), A(x.act.call, 'tel'), A(x.act.callback, 'callback')] };
      case 'human': return { text: x.human, actions: [A(x.act.wa, 'wa', null, true), A(x.act.callback, 'callback')] };
      case 'thanks': return { text: x.thanks, pills: ['book', 'price', 'hours'] };
      case 'greeting': return { text: x.greeting, pills: ['book', 'price', 'online', 'hours', 'bmi', 'callback'] };
      default: return { text: x.unknown, actions: [A(x.act.callback, 'callback', null, true), A(x.act.wa, 'wa')], pills: ['book', 'price', 'hours', 'services'] };
    }
  }

  /* ---------- Rendering ---------- */
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function scrollDown() {
    requestAnimationFrame(function () { log.scrollTop = log.scrollHeight; });
  }
  function addUser(text, animate) {
    var row = el('div', 'msg msg--user');
    if (!animate) row.style.animation = 'none';
    row.appendChild(el('div', 'bubble', text));
    log.appendChild(row);
    scrollDown();
  }
  function addBot(reply, animate) {
    var row = el('div', 'msg msg--bot');
    if (!animate) row.style.animation = 'none';
    var b = el('div', 'bubble');
    if (reply.title) b.appendChild(el('p', 'bubble-title', reply.title));
    String(reply.text || '').split('\n').forEach(function (line) { if (line) b.appendChild(el('p', null, line)); });
    if (reply.rows && reply.rows.length) {
      var rows = el('div', 'bubble-rows');
      reply.rows.forEach(function (r) {
        var d = el('div', 'bubble-row');
        d.append(el('span', null, r[0]), el('span', null, r[1]));
        rows.appendChild(d);
      });
      b.appendChild(rows);
    }
    if (reply.note) b.appendChild(el('p', 'bubble-note', reply.note));
    if (reply.actions && reply.actions.length) {
      var acts = el('div', 'bubble-actions');
      reply.actions.forEach(function (a) { acts.appendChild(renderAction(a)); });
      b.appendChild(acts);
    }
    row.appendChild(b);
    log.appendChild(row);
    if (reply.pills && reply.pills.length) renderPills(reply.pills, animate);
    scrollDown();
  }
  function renderPills(list, animate) {
    log.querySelectorAll('.quick').forEach(function (n) { n.remove(); });
    var wrap = el('div', 'quick');
    if (!animate) wrap.style.animation = 'none';
    list.forEach(function (key) {
      var label = X().pills[key];
      if (!label) return;
      var p = el('button', null, label);
      p.type = 'button';
      p.dataset.intent = key;
      wrap.appendChild(p);
    });
    log.appendChild(wrap);
  }
  function renderAction(a) {
    var cls = 'bubble-action' + (a.primary ? ' bubble-action--primary' : '');
    var link = function (href, external) {
      var n = el('a', cls, a.label);
      n.href = href;
      if (external) { n.target = '_blank'; n.rel = 'noopener noreferrer'; }
      return n;
    };
    switch (a.kind) {
      case 'wa': return link(M.waLink(M.t('wa.greeting')), true);
      case 'tel': return link('tel:' + cfg.phone);
      case 'raw': return link(a.data);
      case 'maps': return link(cfg.mapsUrl, true);
      case 'blog': return link(blogHref(a.data));
      case 'nav':
        if (!onHome) return link(homeHref(a.data));
        break;
      case 'book':
      case 'tool':
        if (!onHome) return link(homeHref(a.kind === 'tool' ? '#araclar' : '#randevu'));
        break;
      case 'cancel':
        if (!onHome) return link(homeHref('#randevu'));
        break;
    }
    var btn = el('button', cls, a.label);
    btn.type = 'button';
    btn.dataset.kind = a.kind;
    btn.dataset.payload = JSON.stringify(a.data);
    return btn;
  }
  function showTyping() {
    var row = el('div', 'msg msg--bot typing');
    row.setAttribute('aria-label', X().typing);
    var b = el('div', 'bubble');
    for (var i = 0; i < 3; i++) b.appendChild(el('i'));
    row.appendChild(b);
    log.appendChild(row);
    scrollDown();
    return row;
  }

  /* ---------- Conversation state (kept for this browser tab) ---------- */
  var history = [];
  var flow = null;
  var busy = false;
  var isOpen = false;
  function save() {
    try { sessionStorage.setItem('mizan-chat', JSON.stringify({ h: history.slice(-40), f: flow })); } catch (e) {}
  }
  function restore() {
    try {
      var data = JSON.parse(sessionStorage.getItem('mizan-chat') || 'null');
      if (!data || !Array.isArray(data.h) || !data.h.length) return false;
      history = data.h;
      flow = data.f || null;
      history.forEach(function (m) { if (m.u != null) addUser(m.u, false); else if (m.b) addBot(m.b, false); });
      return true;
    } catch (e) { return false; }
  }
  function pushBot(reply, animate) { history.push({ b: reply }); addBot(reply, animate); save(); }
  function pushUser(text) { history.push({ u: text }); addUser(text, true); save(); }

  function welcome(animate) {
    pushBot({ text: X().welcome, pills: ['book', 'price', 'online', 'hours', 'bmi', 'callback'] }, animate);
  }

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function reply(builder, userText) {
    busy = true;
    updateSend();
    var typing = showTyping();
    var started = Date.now();
    return Promise.resolve().then(builder).then(function (r) {
      var wait = M.reduceMotion ? 120 : Math.min(1100, 450 + (userText || '').length * 10) - (Date.now() - started);
      return (wait > 0 ? sleep(wait) : Promise.resolve()).then(function () { return r; });
    }).then(function (r) {
      typing.remove();
      if (r) pushBot(r, true);
    }).catch(function (err) {
      console.error(err);
      typing.remove();
    }).then(function () {
      busy = false;
      updateSend();
    });
  }

  function isCancelWord(text) {
    var t = normalize(text).join(' ');
    return /^(vazgec|vazgectim|iptal|bosver|cancel|stop|nevermind|never mind)$/.test(t);
  }

  function handleFlow(text) {
    var x = X();
    if (isCancelWord(text)) { flow = null; save(); return { text: x.cbCancelled, pills: ['book', 'price', 'hours'] }; }
    if (flow.step === 'name') {
      var name = text.trim().replace(/\s+/g, ' ');
      if (name.length < 3 || !/\S\s+\S/.test(name) || /\d/.test(name)) return { text: x.cbBadName };
      flow = { mode: 'callback', step: 'phone', name: name.slice(0, 80) };
      save();
      return { text: fill(x.cbPhone, { name: name.split(' ')[0] }) };
    }
    if (flow.step === 'phone') {
      var phone = M.phone.normalize(text);
      if (!phone) return { text: x.cbBadPhone };
      var data = { name: flow.name, phone: phone };
      flow = null;
      save();
      var wa = M.waLink(fill(x.cbWa, { name: data.name, phone: M.phone.format(phone) }));
      if (!M.api.enabled()) {
        return { text: x.cbDemo, actions: [{ label: x.act.wa, kind: 'raw', data: wa, primary: true }] };
      }
      return M.api.post({ action: 'callback', name: data.name, phone: phone, lang: M.lang(), page: location.pathname, website: '', elapsed: 9999 })
        .then(function (res) {
          if (res && res.ok) return { text: fill(x.cbDone, { phone: M.phone.format(phone) }), note: x.cbPrivacy, pills: ['prepare', 'price'] };
          throw new Error('fail');
        })
        .catch(function () { return { text: x.cbError, actions: [{ label: x.act.wa, kind: 'raw', data: wa, primary: true }] }; });
    }
    flow = null;
    return answer(text);
  }

  function send(text, forcedIntent) {
    var message = String(text || '').trim();
    if (!message || busy) return;
    log.querySelectorAll('.quick').forEach(function (n) { n.remove(); });
    pushUser(message);
    input.value = '';
    reply(function () {
      if (flow && !forcedIntent) return handleFlow(message);
      var r = answer(message, forcedIntent);
      if (r.flow === 'callback') {
        flow = { mode: 'callback', step: 'name' };
        save();
        return { text: X().cbStart };
      }
      return r;
    }, message);
  }

  /* ---------- Actions ---------- */
  function closeOnSmall() { if (window.innerWidth < 760) setOpen(false); }
  log.addEventListener('click', function (e) {
    var pill = e.target.closest('.quick [data-intent]');
    if (pill) { send(pill.textContent, pill.dataset.intent); return; }
    var btn = e.target.closest('button[data-kind]');
    if (!btn) {
      if (e.target.closest('a[href^="#"]')) closeOnSmall();
      return;
    }
    var data = null;
    try { data = JSON.parse(btn.dataset.payload || 'null'); } catch (err) {}
    switch (btn.dataset.kind) {
      case 'book':
        document.dispatchEvent(new CustomEvent('mizan:book', { detail: data || {} }));
        closeOnSmall();
        break;
      case 'tool':
        document.dispatchEvent(new CustomEvent('mizan:tool', { detail: data }));
        scrollToId('araclar');
        closeOnSmall();
        break;
      case 'nav':
        scrollToId(String(data).slice(1));
        closeOnSmall();
        break;
      case 'cancel': {
        var dlg = document.getElementById('cancel-dialog');
        setOpen(false);
        M.openDialog(dlg);
        break;
      }
      case 'callback':
        send(X().pills.callback, 'callback');
        break;
    }
  });
  function scrollToId(id) {
    var target = document.getElementById(id);
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: top, behavior: M.reduceMotion ? 'auto' : 'smooth' });
  }

  /* ---------- Open / close ---------- */
  function updateSend() { sendBtn.disabled = busy || !input.value.trim(); }
  function setOpen(open) {
    if (open === isOpen) return;
    isOpen = open;
    if (!open && chat.contains(document.activeElement)) toggle.focus({ preventScroll: true });
    document.body.classList.toggle('chat-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', M.t(open ? 'chat.close' : 'chat.open'));
    chat.toggleAttribute('inert', !open);
    if (open) {
      if (!history.length) welcome(true);
      M.store('mizan-chat-seen', '1');
      if (badge) badge.classList.add('is-hidden');
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setTimeout(function () { input.focus({ preventScroll: true }); }, 250);
      scrollDown();
    }
  }
  toggle.addEventListener('click', function () { setOpen(!isOpen); });
  closeBtn.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen && !document.querySelector('dialog[open]')) setOpen(false); });
  document.addEventListener('mizan:open-chat', function () { setOpen(true); });
  input.addEventListener('input', updateSend);
  form.addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });

  M.onLang(function () {
    toggle.setAttribute('aria-label', M.t(isOpen ? 'chat.close' : 'chat.open'));
    if (history.length === 1 && history[0].b && !busy) {
      history = [];
      log.textContent = '';
      welcome(false);
    }
  });

  if (M.read('mizan-chat-seen') && badge) badge.classList.add('is-hidden');
  restore();
  updateSend();
})();
