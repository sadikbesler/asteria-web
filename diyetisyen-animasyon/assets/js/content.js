/* Mizan Beslenme — sample diet programme and recipes */
(function () {
  'use strict';

  var M = window.Mizan;
  if (!M) return;

  function L() { return M.lang() === 'en' ? 'en' : 'tr'; }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function num(n, d) { return new Intl.NumberFormat(L() === 'en' ? 'en-GB' : 'tr-TR', { maximumFractionDigits: d || 0 }).format(n); }

  /* =====================================================================
     Sample programme
     Each meal: [kcal, Turkish, English]
     ===================================================================== */
  var MEALS = {
    b: { tr: 'Kahvaltı', en: 'Breakfast' },
    s1: { tr: 'Ara öğün', en: 'Snack' },
    l: { tr: 'Öğle', en: 'Lunch' },
    s2: { tr: 'Ara öğün', en: 'Snack' },
    d: { tr: 'Akşam', en: 'Dinner' },
    pre: { tr: 'Antrenman öncesi', en: 'Pre-workout' },
    post: { tr: 'Akşam · antrenman sonrası', en: 'Dinner · post-workout' },
    n: { tr: 'Gece', en: 'Evening snack' }
  };
  var DAYS = {
    tr: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'],
    trShort: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    en: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    enShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };
  var TIPS = [
    ['Tabağın yarısını sebzeye ayırmak, kalori saymadan porsiyon kontrolünü kolaylaştırır.', 'Filling half your plate with vegetables makes portion control easier without counting calories.'],
    ['Masanızda dolu bir su şişesi bulundurun; susadığınızı fark etmeden içmeye başlarsınız.', 'Keep a full water bottle on your desk; you will drink before you notice you are thirsty.'],
    ['Akşam yemeğini yatmadan 2–3 saat önce bitirmek hem uykuyu hem sindirimi rahatlatır.', 'Finishing dinner 2–3 hours before bed helps both sleep and digestion.'],
    ['Bakliyatı haftada en az 2–3 kez sofraya koyun; lif ve bitkisel protein için ekonomik bir kaynak.', 'Put legumes on the table at least 2–3 times a week; they are an affordable source of fibre and plant protein.'],
    ['Meyve suyu yerine meyvenin kendisini seçin; lifi korunur, daha uzun süre doygun tutar.', 'Choose whole fruit over juice; the fibre stays and it keeps you full for longer.'],
    ['Hafta sonu için “serbest gün” yerine “serbest öğün” düşünün; haftanın dengesi bozulmaz.', 'Think of a “free meal” rather than a “free day” at the weekend; the week stays balanced.'],
    ['Yemekten sonra 10–15 dakikalık bir yürüyüş, kan şekerinin daha dengeli seyretmesine yardımcı olur.', 'A 10–15 minute walk after a meal helps keep blood sugar steadier.']
  ];

  var PLANS = {
    lose: {
      ratio: [0.25, 0.45, 0.30],
      times: ['08:00', '10:30', '13:00', '16:00', '19:30'],
      slots: ['b', 's1', 'l', 's2', 'd'],
      area: 'weight',
      days: [
        [
          [380, '2 haşlanmış yumurta, 30 g beyaz peynir, 1 ince dilim tam buğday ekmeği, domates, salatalık, 5 zeytin', '2 boiled eggs, 30 g white cheese, 1 thin slice of wholegrain bread, tomato, cucumber, 5 olives'],
          [150, '1 orta boy elma, 10 çiğ badem', '1 medium apple, 10 raw almonds'],
          [420, '1 kase mercimek çorbası, 100 g ızgara tavuk göğsü, yeşil salata (1 tatlı kaşığı zeytinyağı)', '1 bowl of lentil soup, 100 g grilled chicken breast, green salad (1 tsp olive oil)'],
          [110, '150 g ev yoğurdu, tarçın', '150 g plain yogurt with cinnamon'],
          [440, 'Zeytinyağlı taze fasulye, 4 yemek kaşığı bulgur pilavı, 1 kase cacık', 'Green beans in olive oil, 4 tbsp bulgur pilaf, 1 bowl of cacık']
        ],
        [
          [370, 'Ispanaklı mantarlı omlet (2 yumurta), 1 ince dilim çavdar ekmeği, domates', 'Spinach and mushroom omelette (2 eggs), 1 thin slice of rye bread, tomato'],
          [135, '1 kase çilek, 2 tam ceviz', '1 bowl of strawberries, 2 whole walnuts'],
          [400, 'Ton balıklı nohut salatası (80 g ton, 3 yemek kaşığı nohut, yeşillik, limon), 1 ince dilim tam buğday ekmeği', 'Tuna and chickpea salad (80 g tuna, 3 tbsp chickpeas, greens, lemon), 1 thin slice of wholegrain bread'],
          [130, '1 bardak ayran, 1 küçük armut', '1 glass of ayran, 1 small pear'],
          [450, 'Fırında köfte (100 g), közlenmiş sebzeler, 1 kase yoğurt', 'Oven-baked köfte (100 g), roasted vegetables, 1 bowl of yogurt']
        ],
        [
          [360, 'Yulaf lapası (4 yemek kaşığı yulaf, 1 su bardağı süt), yarım muz, 1 tatlı kaşığı fıstık ezmesi', 'Porridge (4 tbsp oats, 1 cup milk), half a banana, 1 tsp peanut butter'],
          [125, '2 mandalina, 5 fındık', '2 mandarins, 5 hazelnuts'],
          [420, 'Kinoalı kısır (1 porsiyon), 1 haşlanmış yumurta, yeşillik', 'Quinoa kısır (1 portion), 1 boiled egg, greens'],
          [110, '1 bardak kefir (200 ml)', '1 glass of kefir (200 ml)'],
          [470, 'Fırında somon (120 g), buharda brokoli ve havuç, 2 yemek kaşığı esmer pirinç', 'Baked salmon (120 g), steamed broccoli and carrots, 2 tbsp brown rice']
        ],
        [
          [360, 'Menemen (2 yumurta, 1 tatlı kaşığı zeytinyağı), 1 ince dilim tam buğday ekmeği, 5 zeytin', 'Menemen (2 eggs, 1 tsp olive oil), 1 thin slice of wholegrain bread, 5 olives'],
          [150, '1 bardak süt, 3 kuru kayısı', '1 glass of milk, 3 dried apricots'],
          [420, 'Nohutlu ıspanak yemeği, 4 yemek kaşığı bulgur pilavı, 1 kase yoğurt', 'Spinach with chickpeas, 4 tbsp bulgur pilaf, 1 bowl of yogurt'],
          [110, 'Havuç ve salatalık çubukları, 2 yemek kaşığı humus', 'Carrot and cucumber sticks, 2 tbsp hummus'],
          [440, 'Izgara derisiz tavuk but (130 g), mevsim salatası, 1 küçük haşlanmış patates', 'Grilled skinless chicken thigh (130 g), seasonal salad, 1 small boiled potato']
        ],
        [
          [390, 'Frambuazlı gece yulafı (tarifimizden 1 porsiyon)', 'Raspberry overnight oats (1 portion of our recipe)'],
          [150, '1 küçük armut, 10 fındık', '1 small pear, 10 hazelnuts'],
          [380, 'Fırında falafel (3 adet), yoğurtlu sos, bol salata', 'Baked falafel (3 pieces), yogurt sauce, large salad'],
          [115, '1 kase yoğurt, 1 yemek kaşığı yulaf kepeği', '1 bowl of yogurt, 1 tbsp oat bran'],
          [460, 'Balkabaklı mercimek çorbası, zeytinyağlı pırasa, 1 ince dilim tam buğday ekmeği', 'Pumpkin and lentil soup, leeks in olive oil, 1 thin slice of wholegrain bread']
        ],
        [
          [380, '1 haşlanmış yumurta, 30 g beyaz peynir, 1 dilim tam buğday ekmeği, domates, biber, 5 zeytin, 1 tatlı kaşığı tahin-pekmez', '1 boiled egg, 30 g white cheese, 1 slice of wholegrain bread, tomato, pepper, 5 olives, 1 tsp tahini with grape molasses'],
          [90, '1 kase karpuz veya kavun (250 g)', '1 bowl of watermelon or melon (250 g)'],
          [400, 'Tavuklu sebzeli dürüm (tam buğday lavaş, 80 g tavuk, yeşillik, yoğurtlu sos)', 'Chicken and vegetable wrap (wholewheat flatbread, 80 g chicken, greens, yogurt sauce)'],
          [125, '1 bardak ayran, 1 avuç leblebi', '1 glass of ayran, a small handful of roasted chickpeas'],
          [500, 'Sebzeli levrek buğulama (150 g), roka salatası, 3 yemek kaşığı bulgur, 1 kase yoğurt', 'Steamed sea bass with vegetables (150 g), rocket salad, 3 tbsp bulgur, 1 bowl of yogurt']
        ],
        [
          [340, 'Avokadolu tost: 1 dilim ekşi mayalı ekmek, yarım avokado, 1 poşe yumurta, domates', 'Avocado toast: 1 slice of sourdough, half an avocado, 1 poached egg, tomato'],
          [130, 'Yoğurtlu chia puding (yarım porsiyon)', 'Chia yogurt pudding (half a portion)'],
          [450, 'Zeytinyağlı enginar, 100 g ızgara köfte, cacık', 'Artichokes in olive oil, 100 g grilled köfte, cacık'],
          [100, '1 şeftali, 5 badem', '1 peach, 5 almonds'],
          [430, 'Etsiz kabak dolması (2 adet), 1 kase yoğurt, mevsim salatası', 'Meat-free stuffed courgettes (2), 1 bowl of yogurt, seasonal salad']
        ]
      ]
    },
    balance: {
      ratio: [0.20, 0.50, 0.30],
      times: ['08:00', '10:30', '13:00', '16:00', '19:30'],
      slots: ['b', 's1', 'l', 's2', 'd'],
      area: 'weight',
      days: [
        [
          [480, 'Menemen (2 yumurta), 40 g beyaz peynir, 2 ince dilim tam buğday ekmeği, 5 zeytin, domates, salatalık', 'Menemen (2 eggs), 40 g white cheese, 2 thin slices of wholegrain bread, 5 olives, tomato, cucumber'],
          [190, '1 muz, 1 yemek kaşığı fıstık ezmesi', '1 banana, 1 tbsp peanut butter'],
          [540, 'Etli kuru fasulye, 5 yemek kaşığı bulgur pilavı, mevsim salatası', 'Haricot beans with meat, 5 tbsp bulgur pilaf, seasonal salad'],
          [200, '1 kase yoğurt, 1 tatlı kaşığı bal, 2 tam ceviz', '1 bowl of yogurt, 1 tsp honey, 2 whole walnuts'],
          [500, 'Izgara tavuk (150 g), fırın sebzeler, 1 dilim tam buğday ekmeği, cacık', 'Grilled chicken (150 g), roasted vegetables, 1 slice of wholegrain bread, cacık']
        ],
        [
          [470, 'Yulaf lapası (6 yemek kaşığı yulaf, 1 su bardağı süt), 1 muz, 1 yemek kaşığı ceviz', 'Porridge (6 tbsp oats, 1 cup milk), 1 banana, 1 tbsp walnuts'],
          [190, '1 elma, 30 g kaşar peyniri', '1 apple, 30 g kashar cheese'],
          [560, 'Fırında somon (150 g), 5 yemek kaşığı kinoa, roka ve nar salatası', 'Baked salmon (150 g), 5 tbsp quinoa, rocket and pomegranate salad'],
          [150, '3 yemek kaşığı humus, sebze çubukları', '3 tbsp hummus, vegetable sticks'],
          [520, 'Zeytinyağlı taze fasulye, 1 porsiyon bulgur pilavı, 1 kase yoğurt', 'Green beans in olive oil, 1 portion of bulgur pilaf, 1 bowl of yogurt']
        ],
        [
          [460, 'Frambuazlı gece yulafı (1 porsiyon), 1 haşlanmış yumurta', 'Raspberry overnight oats (1 portion), 1 boiled egg'],
          [180, '1 avuç (25 g) karışık çiğ kuruyemiş', 'A handful (25 g) of mixed raw nuts'],
          [560, 'Tavuklu sebzeli dürüm, 1 kase mercimek çorbası', 'Chicken and vegetable wrap, 1 bowl of lentil soup'],
          [170, '1 bardak kefir, 1 küçük muz', '1 glass of kefir, 1 small banana'],
          [520, 'Fırında köfte (120 g), fırın patates (150 g), yeşil salata', 'Oven-baked köfte (120 g), roasted potatoes (150 g), green salad']
        ],
        [
          [480, 'Şakşuka (1 porsiyon), 1 dilim ekşi mayalı ekmek, 30 g beyaz peynir', 'Shakshuka (1 portion), 1 slice of sourdough, 30 g white cheese'],
          [170, '2 kuru incir, 5 ceviz içi', '2 dried figs, 5 walnut halves'],
          [560, 'Kinoalı kısır (1,5 porsiyon), 100 g ızgara hellim', 'Quinoa kısır (1.5 portions), 100 g grilled halloumi'],
          [160, '1 bardak süt, 1 tatlı kaşığı kakao', '1 glass of milk, 1 tsp cocoa'],
          [540, 'Nohutlu tavuk sote, 4 yemek kaşığı esmer pirinç, cacık', 'Chicken sauté with chickpeas, 4 tbsp brown rice, cacık']
        ],
        [
          [450, 'Avokadolu tost (2 dilim ekşi mayalı ekmek), 1 poşe yumurta', 'Avocado toast (2 slices of sourdough), 1 poached egg'],
          [190, 'Yoğurtlu chia puding (yarım porsiyon), çilek', 'Chia yogurt pudding (half a portion), strawberries'],
          [560, 'Fırında falafel (4 adet), yoğurtlu sos, bulgur salatası', 'Baked falafel (4 pieces), yogurt sauce, bulgur salad'],
          [170, '1 armut, 10 fındık', '1 pear, 10 hazelnuts'],
          [520, 'Izgara uskumru (150 g), roka-soğan salatası, 1 dilim tam buğday ekmeği', 'Grilled mackerel (150 g), rocket and onion salad, 1 slice of wholegrain bread']
        ],
        [
          [560, 'Hafta sonu kahvaltısı: 2 yumurta, 40 g beyaz peynir, 2 dilim tam buğday ekmeği, domates, biber, zeytin, 1 yemek kaşığı tahin-pekmez', 'Weekend breakfast: 2 eggs, 40 g white cheese, 2 slices of wholegrain bread, tomato, pepper, olives, 1 tbsp tahini with grape molasses'],
          [120, '1 kase karpuz (300 g)', '1 bowl of watermelon (300 g)'],
          [520, 'Etli nohut yemeği, 4 yemek kaşığı bulgur pilavı, turşu yerine salata', 'Chickpea stew with meat, 4 tbsp bulgur pilaf, salad instead of pickles'],
          [170, '1 bardak ayran, 1 avuç leblebi', '1 glass of ayran, a handful of roasted chickpeas'],
          [520, 'Sebzeli levrek buğulama (180 g), 1 küçük haşlanmış patates, yeşil salata', 'Steamed sea bass with vegetables (180 g), 1 small boiled potato, green salad']
        ],
        [
          [480, 'Yulaflı muzlu pankek (2 adet), 1 kase yoğurt, 1 tatlı kaşığı bal', 'Oat and banana pancakes (2), 1 bowl of yogurt, 1 tsp honey'],
          [170, '1 portakal, 10 badem', '1 orange, 10 almonds'],
          [560, 'Zeytinyağlı enginar, 120 g ızgara köfte, 4 yemek kaşığı bulgur', 'Artichokes in olive oil, 120 g grilled köfte, 4 tbsp bulgur'],
          [160, 'Tarçınlı fırın elma (1 adet)', 'Baked apple with cinnamon (1)'],
          [520, 'Balkabaklı mercimek çorbası, 2 adet etsiz kabak dolması, yoğurt', 'Pumpkin and lentil soup, 2 meat-free stuffed courgettes, yogurt']
        ]
      ]
    },
    sport: {
      ratio: [0.25, 0.50, 0.25],
      times: ['07:30', '10:30', '13:00', '17:00', '20:00', '22:00'],
      slots: ['b', 's1', 'l', 'pre', 'post', 'n'],
      area: 'sports',
      days: [
        [
          [600, '3 yumurtalı omlet, 2 dilim tam buğday ekmeği, 40 g beyaz peynir, 1 muz, domates', '3-egg omelette, 2 slices of wholegrain bread, 40 g white cheese, 1 banana, tomato'],
          [300, '200 g yoğurt, 4 yemek kaşığı granola, çilek', '200 g yogurt, 4 tbsp granola, strawberries'],
          [650, 'Tavuklu bulgur pilavı (150 g tavuk), mevsim salatası, ayran', 'Bulgur pilaf with chicken (150 g), seasonal salad, ayran'],
          [250, '1 muz, 2 kuru hurma, 1 dilim tam buğday ekmeği ve 1 tatlı kaşığı bal', '1 banana, 2 dates, 1 slice of wholegrain bread with 1 tsp honey'],
          [620, 'Izgara köfte (150 g), tam buğday makarna (70 g kuru), fırın sebzeler', 'Grilled köfte (150 g), wholewheat pasta (70 g dry), roasted vegetables'],
          [180, '200 g lor peyniri veya süzme yoğurt, tarçın', '200 g lor cheese or strained yogurt, cinnamon']
        ],
        [
          [620, 'Yulaf lapası (80 g yulaf, 300 ml süt), 1 muz, 1 yemek kaşığı fıstık ezmesi', 'Porridge (80 g oats, 300 ml milk), 1 banana, 1 tbsp peanut butter'],
          [280, '2 haşlanmış yumurta, 1 elma', '2 boiled eggs, 1 apple'],
          [660, 'Fırında somon (180 g), 1 porsiyon kinoa, yeşil salata', 'Baked salmon (180 g), 1 portion of quinoa, green salad'],
          [260, '1 bardak süt, 1 muz, 3 kuru kayısı', '1 glass of milk, 1 banana, 3 dried apricots'],
          [600, 'Tavuk sote (150 g), 6 yemek kaşığı pirinç pilavı, cacık', 'Chicken sauté (150 g), 6 tbsp rice pilaf, cacık'],
          [160, '1 bardak kefir, 5 badem', '1 glass of kefir, 5 almonds']
        ],
        [
          [620, 'Menemen (3 yumurta), 2 dilim ekşi mayalı ekmek, 40 g beyaz peynir, zeytin', 'Menemen (3 eggs), 2 slices of sourdough, 40 g white cheese, olives'],
          [300, 'Frambuazlı gece yulafı (1 porsiyon)', 'Raspberry overnight oats (1 portion)'],
          [650, 'Etli kuru fasulye, 1 porsiyon bulgur pilavı, ayran', 'Haricot beans with meat, 1 portion of bulgur pilaf, ayran'],
          [240, '2 pirinç patlağı, 1 yemek kaşığı fıstık ezmesi, 1 muz', '2 rice cakes, 1 tbsp peanut butter, 1 banana'],
          [640, 'Izgara hindi (180 g), fırın patates (200 g), mevsim salatası', 'Grilled turkey (180 g), roasted potatoes (200 g), seasonal salad'],
          [170, '200 g süzme yoğurt, yaban mersini', '200 g strained yogurt, blueberries']
        ],
        [
          [600, 'Avokadolu tost (2 dilim), 2 poşe yumurta, 1 portakal', 'Avocado toast (2 slices), 2 poached eggs, 1 orange'],
          [290, '1 avuç (30 g) kuruyemiş, 1 muz', 'A handful (30 g) of nuts, 1 banana'],
          [680, 'Fırında falafel (5 adet), yoğurtlu sos, bulgur salatası', 'Baked falafel (5 pieces), yogurt sauce, bulgur salad'],
          [240, '1 bardak ayran, 1 simit yerine 2 dilim tam buğday ekmeği ve beyaz peynir', '1 glass of ayran, 2 slices of wholegrain bread with white cheese instead of a simit'],
          [620, 'Izgara somon (150 g), tam buğday makarna (70 g kuru), ıspanak salatası', 'Grilled salmon (150 g), wholewheat pasta (70 g dry), spinach salad'],
          [170, '1 bardak süt, 1 tatlı kaşığı kakao', '1 glass of milk, 1 tsp cocoa']
        ],
        [
          [620, 'Yulaflı muzlu pankek (3 adet), 200 g yoğurt, 1 tatlı kaşığı bal', 'Oat and banana pancakes (3), 200 g yogurt, 1 tsp honey'],
          [280, 'Ton balıklı sandviç (1 dilim tam buğday ekmeği, 60 g ton)', 'Tuna sandwich (1 slice of wholegrain bread, 60 g tuna)'],
          [650, 'Tavuklu kinoa salatası (150 g tavuk), 1 kase mercimek çorbası', 'Chicken quinoa salad (150 g chicken), 1 bowl of lentil soup'],
          [250, '3 kuru hurma, 1 bardak süt', '3 dates, 1 glass of milk'],
          [640, 'Fırında köfte (150 g), 6 yemek kaşığı bulgur, közlenmiş biber, cacık', 'Oven-baked köfte (150 g), 6 tbsp bulgur, roasted peppers, cacık'],
          [160, '150 g lor peyniri, ceviz', '150 g lor cheese, walnuts']
        ],
        [
          [680, 'Hafta sonu kahvaltısı: 3 yumurta, 50 g beyaz peynir, 2 dilim ekşi mayalı ekmek, domates, zeytin, 1 yemek kaşığı tahin-pekmez', 'Weekend breakfast: 3 eggs, 50 g white cheese, 2 slices of sourdough, tomato, olives, 1 tbsp tahini with grape molasses'],
          [260, '1 kase karpuz, 1 avuç leblebi', '1 bowl of watermelon, a handful of roasted chickpeas'],
          [620, 'Tavuk döner dürüm (tam buğday lavaş), ayran, salata', 'Chicken döner wrap (wholewheat flatbread), ayran, salad'],
          [240, '1 muz, 2 pirinç patlağı ve bal', '1 banana, 2 rice cakes with honey'],
          [660, 'Izgara levrek (200 g), fırın patates (200 g), roka salatası', 'Grilled sea bass (200 g), roasted potatoes (200 g), rocket salad'],
          [150, 'Yoğurtlu chia puding (yarım porsiyon)', 'Chia yogurt pudding (half a portion)']
        ],
        [
          [620, 'Şakşuka (1,5 porsiyon), 2 dilim ekşi mayalı ekmek', 'Shakshuka (1.5 portions), 2 slices of sourdough'],
          [260, '200 g yoğurt, 1 muz, tarçın', '200 g yogurt, 1 banana, cinnamon'],
          [680, 'Etli nohut yemeği, 1 porsiyon bulgur pilavı, cacık', 'Chickpea stew with meat, 1 portion of bulgur pilaf, cacık'],
          [220, 'Tarçınlı fırın elma, 1 bardak süt', 'Baked apple with cinnamon, 1 glass of milk'],
          [600, 'Balkabaklı mercimek çorbası, 150 g ızgara tavuk, 1 dilim tam buğday ekmeği', 'Pumpkin and lentil soup, 150 g grilled chicken, 1 slice of wholegrain bread'],
          [170, '200 g süzme yoğurt, 1 tatlı kaşığı bal', '200 g strained yogurt, 1 tsp honey']
        ]
      ]
    }
  };

  var program = document.getElementById('program');
  if (program) {
    var planBtns = Array.prototype.slice.call(program.querySelectorAll('[data-plan]'));
    var daysEl = program.querySelector('[data-days]');
    var mealsEl = program.querySelector('[data-meals]');
    var totalEl = program.querySelector('[data-total]');
    var macrosEl = program.querySelector('[data-macros]');
    var tipEl = program.querySelector('[data-tip]');
    var bookBtn = program.querySelector('[data-program-book]');
    var today = (M.time.now().dow + 6) % 7;
    var pState = { plan: 'lose', day: today };

    var MACRO = { tr: ['Protein', 'Karbonhidrat', 'Yağ'], en: ['Protein', 'Carbohydrate', 'Fat'] };
    var TODAY = { tr: 'bugün', en: 'today' };

    var renderDays = function () {
      daysEl.textContent = '';
      for (var i = 0; i < 7; i++) {
        var b = el('button', 'day-tab');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-selected', String(i === pState.day));
        b.setAttribute('aria-controls', 'program-print');
        b.tabIndex = i === pState.day ? 0 : -1;
        b.dataset.day = String(i);
        b.setAttribute('aria-label', DAYS[L()][i] + (i === today ? ', ' + TODAY[L()] : ''));
        b.appendChild(document.createTextNode(DAYS[L() + 'Short'][i]));
        b.appendChild(el('small', null, i === today ? TODAY[L()] : String(i + 1).padStart(2, '0')));
        daysEl.appendChild(b);
      }
    };
    var renderPlan = function () {
      var plan = PLANS[pState.plan];
      var day = plan.days[pState.day];
      var lang = L();
      mealsEl.textContent = '';
      var total = 0;
      day.forEach(function (meal, i) {
        total += meal[0];
        var li = el('li', 'meal');
        li.appendChild(el('span', 'meal-time', plan.times[i]));
        var body = el('div');
        body.appendChild(el('p', 'meal-name', MEALS[plan.slots[i]][lang]));
        body.appendChild(el('p', 'meal-items', lang === 'en' ? meal[2] : meal[1]));
        li.appendChild(body);
        li.appendChild(el('span', 'meal-kcal', '~' + num(meal[0]) + ' kcal'));
        mealsEl.appendChild(li);
      });
      totalEl.textContent = num(total);
      macrosEl.textContent = '';
      var grams = [total * plan.ratio[0] / 4, total * plan.ratio[1] / 4, total * plan.ratio[2] / 9];
      ['p', 'c', 'f'].forEach(function (k, i) {
        var pct = Math.round(plan.ratio[i] * 100);
        var m = el('div', 'macro macro--' + k);
        var head = el('div', 'macro-head');
        head.append(el('b', null, MACRO[lang][i]), el('span', null, num(Math.round(grams[i])) + ' g · ' + (lang === 'en' ? pct + '%' : '%' + pct)));
        var track = el('div', 'macro-track');
        var fill = el('div', 'macro-fill');
        fill.style.width = pct + '%';
        track.appendChild(fill);
        m.append(head, track);
        macrosEl.appendChild(m);
      });
      tipEl.textContent = TIPS[pState.day][lang === 'en' ? 1 : 0];
      if (bookBtn) bookBtn.setAttribute('data-book-area', plan.area);
    };
    var render = function () {
      planBtns.forEach(function (b) {
        var on = b.getAttribute('data-plan') === pState.plan;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      renderDays();
      renderPlan();
    };

    planBtns.forEach(function (b, i) {
      b.addEventListener('click', function () { pState.plan = b.getAttribute('data-plan'); render(); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var next = planBtns[(i + d + planBtns.length) % planBtns.length];
        pState.plan = next.getAttribute('data-plan');
        render();
        next.focus();
      });
    });
    daysEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-day]');
      if (!b) return;
      pState.day = +b.dataset.day;
      render();
    });
    daysEl.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      pState.day = (pState.day + d + 7) % 7;
      render();
      daysEl.querySelector('[data-day="' + pState.day + '"]').focus();
    });
    render();
    M.onLang(render);
  }

  /* =====================================================================
     Recipes
     Ingredient: [quantity or null, unit key, Turkish, English]
     ===================================================================== */
  var UNITS = {
    g: { tr: 'g', en: 'g' },
    ml: { tr: 'ml', en: 'ml' },
    pc: { tr: 'adet', en: '' },
    tbsp: { tr: 'yemek kaşığı', en: 'tbsp' },
    tsp: { tr: 'tatlı kaşığı', en: 'tsp' },
    ssp: { tr: 'çay kaşığı', en: 'tsp' },
    clove: { tr: 'diş', en: 'clove' },
    bunch: { tr: 'demet', en: 'bunch' },
    stalk: { tr: 'dal', en: 'stalk' },
    pinch: { tr: 'tutam', en: 'pinch' },
    none: { tr: '', en: '' }
  };
  var CATS = {
    breakfast: { tr: 'Kahvaltı', en: 'Breakfast' },
    main: { tr: 'Ana yemek', en: 'Main' },
    soup: { tr: 'Çorba ve salata', en: 'Soup & salad' },
    snack: { tr: 'Ara öğün', en: 'Snack' },
    dessert: { tr: 'Tatlı', en: 'Dessert' }
  };
  var TAGS = {
    veg: { tr: 'Vejetaryen', en: 'Vegetarian' },
    vegan: { tr: 'Vegan', en: 'Vegan' },
    gf: { tr: 'Glutensiz', en: 'Gluten-free' },
    fiber: { tr: 'Lif kaynağı', en: 'High fibre' },
    omega: { tr: 'Omega-3', en: 'Omega-3' },
    nosugar: { tr: 'Rafine şeker yok', en: 'No refined sugar' }
  };

  var RECIPES = [
    {
      id: 'gece-yulafi', cat: 'breakfast', img: 'tarif-gece-yulafi', serves: 2,
      time: { tr: '10 dk + 1 gece', en: '10 min + overnight' },
      kcal: 390, p: 16, c: 47, f: 16, tags: ['veg', 'fiber'],
      title: { tr: 'Frambuazlı gece yulafı', en: 'Raspberry overnight oats' },
      alt: { tr: 'Frambuaz ve yulaf katmanlarıyla doldurulmuş cam kavanoz', en: 'Glass jar layered with oats and raspberries' },
      ing: [
        [80, 'g', 'yulaf ezmesi', 'rolled oats'],
        [240, 'ml', 'süt veya badem içeceği', 'milk or almond drink'],
        [150, 'g', 'sade yoğurt', 'plain yogurt'],
        [1, 'tbsp', 'chia tohumu', 'chia seeds'],
        [120, 'g', 'frambuaz (taze veya dondurulmuş)', 'raspberries, fresh or frozen'],
        [20, 'g', 'ceviz içi', 'walnuts'],
        [1, 'tsp', 'bal (isteğe bağlı)', 'honey (optional)'],
        [1, 'pinch', 'tarçın', 'cinnamon']
      ],
      steps: {
        tr: ['Yulaf, chia, tarçın, süt ve yoğurdu bir kapta karıştırın.', 'Karışımı iki kavanoza paylaştırın; frambuazların yarısını hafifçe ezerek katların arasına ekleyin.', 'Kapaklarını kapatıp buzdolabında en az 6 saat, tercihen bir gece bekletin.', 'Servis etmeden önce kalan frambuaz ve kırılmış cevizi ekleyin; isterseniz bal gezdirin.'],
        en: ['Mix the oats, chia, cinnamon, milk and yogurt in a bowl.', 'Divide between two jars, lightly crushing half the raspberries between the layers.', 'Close the lids and refrigerate for at least 6 hours, ideally overnight.', 'Top with the remaining raspberries and chopped walnuts before serving; drizzle with honey if you like.']
      },
      tip: { tr: 'Buzdolabında 3 güne kadar saklanır. Pazar akşamı üç kavanoz hazırlarsanız hafta içi sabahlarınız hızlanır.', en: 'Keeps in the fridge for up to 3 days. Make three jars on Sunday evening and your weekday mornings are sorted.' }
    },
    {
      id: 'saksuka', cat: 'breakfast', img: 'tarif-saksuka', serves: 2,
      time: { tr: '25 dk', en: '25 min' },
      kcal: 310, p: 18, c: 14, f: 20, tags: ['veg', 'gf'],
      title: { tr: 'Domatesli yumurta tavası (şakşuka)', en: 'Shakshuka' },
      alt: { tr: 'Döküm tavada domates sosunda pişmiş yumurtalar ve maydanoz', en: 'Eggs baked in tomato sauce with parsley in a cast-iron pan' },
      ing: [
        [1, 'tbsp', 'zeytinyağı', 'olive oil'],
        [1, 'pc', 'kuru soğan', 'onion'],
        [2, 'pc', 'kırmızı veya sivri biber', 'red or green peppers'],
        [2, 'clove', 'sarımsak', 'garlic'],
        [400, 'g', 'rendelenmiş domates', 'grated tomatoes'],
        [1, 'ssp', 'kimyon', 'ground cumin'],
        [1, 'ssp', 'pul biber', 'chilli flakes'],
        [4, 'pc', 'yumurta', 'eggs'],
        [40, 'g', 'beyaz peynir (isteğe bağlı)', 'white cheese (optional)'],
        [0.5, 'bunch', 'maydanoz', 'parsley'],
        [null, 'none', 'tuz, karabiber', 'salt and pepper']
      ],
      steps: {
        tr: ['Geniş bir tavada zeytinyağını ısıtın; doğranmış soğan ve biberleri 5–6 dakika yumuşayana kadar kavurun.', 'Sarımsak, kimyon ve pul biberi ekleyip 1 dakika karıştırın, ardından domatesi ekleyin.', 'Sos koyulaşana kadar kısık ateşte 8–10 dakika pişirin; tuz ve karabiberle tatlandırın.', 'Sosta dört çukur açıp yumurtaları kırın. Kapağı kapatıp beyazlar pişene, sarılar hafif akışkan kalana kadar 5–6 dakika pişirin.', 'Ufalanmış peynir ve kıyılmış maydanoz serpip tavada servis edin.'],
        en: ['Heat the oil in a wide pan and cook the chopped onion and peppers for 5–6 minutes until soft.', 'Add the garlic, cumin and chilli, stir for 1 minute, then add the tomatoes.', 'Simmer for 8–10 minutes until the sauce thickens; season with salt and pepper.', 'Make four wells and crack in the eggs. Cover and cook for 5–6 minutes until the whites are set and the yolks still soft.', 'Scatter over the cheese and parsley and serve straight from the pan.']
      },
      tip: { tr: 'Yanına bol yeşillik ve bir dilim tam buğday ekmeği yeterli. Sosu ekmekle sıyırmak porsiyonu farkında olmadan ikiye katlayabilir.', en: 'Serve with plenty of greens and one slice of wholegrain bread; mopping up the sauce with bread can quietly double the portion.' }
    },
    {
      id: 'kinoa-kisir', cat: 'soup', img: 'tarif-kinoa-kisir', serves: 4,
      time: { tr: '25 dk', en: '25 min' },
      kcal: 345, p: 9, c: 41, f: 17, tags: ['vegan', 'gf', 'fiber'],
      title: { tr: 'Kinoalı kısır', en: 'Quinoa kısır' },
      alt: { tr: 'Beyaz kasede domates, salatalık ve naneli kinoa salatası', en: 'Quinoa salad with tomato, cucumber and mint in a white bowl' },
      ing: [
        [180, 'g', 'kinoa', 'quinoa'],
        [1, 'tbsp', 'biber salçası', 'red pepper paste'],
        [2, 'pc', 'domates', 'tomatoes'],
        [1, 'pc', 'salatalık', 'cucumber'],
        [4, 'stalk', 'yeşil soğan', 'spring onions'],
        [1, 'bunch', 'maydanoz', 'parsley'],
        [0.5, 'bunch', 'taze nane', 'fresh mint'],
        [2, 'tbsp', 'nar ekşisi', 'pomegranate molasses'],
        [2, 'tbsp', 'zeytinyağı', 'olive oil'],
        [1, 'pc', 'limon (suyu)', 'lemon (juice)'],
        [40, 'g', 'ceviz içi', 'walnuts'],
        [1, 'ssp', 'kimyon', 'ground cumin'],
        [null, 'none', 'pul biber, tuz', 'chilli flakes, salt']
      ],
      steps: {
        tr: ['Kinoayı acılığı gidene kadar bol suyla yıkayın. 360 ml suyla, kapağı kapalı olarak 12–15 dakika suyunu çekene kadar pişirin.', 'Kinoa sıcakken salça, kimyon ve pul biberi ekleyip iyice karıştırın; ılımaya bırakın.', 'Domates, salatalık, yeşil soğan, maydanoz ve naneyi ince ince doğrayın.', 'Sebzeleri, zeytinyağını, nar ekşisini ve limon suyunu kinoaya ekleyin; tuzunu ayarlayın.', 'Kırılmış ceviz serperek servis edin. Buzdolabında bir saat bekletirseniz lezzeti oturur.'],
        en: ['Rinse the quinoa well. Cook with 360 ml water, covered, for 12–15 minutes until the water is absorbed.', 'While it is still warm, stir in the pepper paste, cumin and chilli; leave to cool slightly.', 'Finely chop the tomatoes, cucumber, spring onions, parsley and mint.', 'Add the vegetables, olive oil, pomegranate molasses and lemon juice; season with salt.', 'Scatter with chopped walnuts to serve. It tastes even better after an hour in the fridge.']
      },
      tip: { tr: 'Kinoa bulgura göre daha fazla protein içerir ve glutensizdir. Klasik kısırı özleyenler yarı yarıya bulgurla da deneyebilir.', en: 'Quinoa has more protein than bulgur and is gluten-free. If you miss classic kısır, try a half-and-half mix with bulgur.' }
    },
    {
      id: 'somon', cat: 'main', img: 'tarif-somon', serves: 2,
      time: { tr: '30 dk', en: '30 min' },
      kcal: 410, p: 33, c: 12, f: 25, tags: ['gf', 'omega'],
      title: { tr: 'Limonlu fırın somon, kabak spagetti', en: 'Lemon baked salmon with courgette noodles' },
      alt: { tr: 'Siyah tabakta kabak şeritleri üzerinde fırınlanmış somon', en: 'Baked salmon on courgette ribbons on a black plate' },
      ing: [
        [300, 'g', 'somon fileto (2 parça)', 'salmon fillets (2 pieces)'],
        [2, 'pc', 'orta boy kabak', 'medium courgettes'],
        [1, 'pc', 'havuç', 'carrot'],
        [1, 'pc', 'limon (kabuk rendesi ve suyu)', 'lemon (zest and juice)'],
        [1, 'tbsp', 'zeytinyağı', 'olive oil'],
        [1, 'clove', 'sarımsak', 'garlic'],
        [50, 'g', 'ıspanak', 'spinach'],
        [0.5, 'bunch', 'dereotu', 'dill'],
        [null, 'none', 'tuz, karabiber', 'salt and pepper']
      ],
      steps: {
        tr: ['Fırını 200 °C’ye ısıtın; somonları yağlı kâğıt serili tepsiye yerleştirin.', 'Limon kabuğu rendesi, yarım limonun suyu, yarım yemek kaşığı zeytinyağı ve kıyılmış dereotunu karıştırıp somonların üzerine sürün.', 'Somonu 12–14 dakika, ortası hafif pembe kalana kadar pişirin.', 'Bu sırada kabak ve havucu spiralize edin ya da soyacakla şerit hâlinde kesin.', 'Kalan zeytinyağında sarımsağı 30 saniye çevirin; kabak, havuç ve ıspanağı ekleyip 2–3 dakika soteleyin. Fazla pişirirseniz kabak suyunu salar.', 'Sebzeleri tabaklara alın, somonu üzerine yerleştirip kalan limon suyunu gezdirin.'],
        en: ['Heat the oven to 200 °C and place the salmon on a lined tray.', 'Mix the lemon zest, juice of half the lemon, half a tablespoon of oil and chopped dill; spread over the salmon.', 'Bake for 12–14 minutes until just pink in the middle.', 'Meanwhile, spiralise the courgettes and carrot or cut them into ribbons with a peeler.', 'Fry the garlic in the remaining oil for 30 seconds, add the vegetables and spinach and sauté for 2–3 minutes; any longer and the courgette turns watery.', 'Plate the vegetables, top with the salmon and squeeze over the remaining lemon.']
      },
      tip: { tr: 'Haftada iki porsiyon yağlı balık omega-3 ihtiyacına önemli katkı sağlar. Mevsiminde hamsi, istavrit ve sardalya daha ekonomik seçeneklerdir.', en: 'Two portions of oily fish a week make a real contribution to omega-3 intake. In season, anchovies, horse mackerel and sardines are more affordable options.' }
    },
    {
      id: 'falafel', cat: 'main', img: 'tarif-falafel', serves: 4,
      time: { tr: '50 dk + 1 gece ıslatma', en: '50 min + overnight soak' },
      kcal: 390, p: 19, c: 44, f: 15, tags: ['veg', 'fiber'],
      title: { tr: 'Fırında falafel, yoğurtlu sos', en: 'Baked falafel with yogurt sauce' },
      alt: { tr: 'Nohut, salata ve tahinli sosla servis edilmiş falafeller', en: 'Falafel served with chickpeas, salad and tahini sauce' },
      ing: [
        [250, 'g', 'kuru nohut (bir gece ıslatılmış)', 'dried chickpeas, soaked overnight'],
        [1, 'pc', 'kuru soğan', 'onion'],
        [3, 'clove', 'sarımsak', 'garlic'],
        [1, 'bunch', 'maydanoz', 'parsley'],
        [0.5, 'bunch', 'kişniş veya dereotu', 'coriander or dill'],
        [1, 'ssp', 'kimyon', 'ground cumin'],
        [1, 'ssp', 'toz kişniş', 'ground coriander'],
        [2, 'tbsp', 'yulaf ezmesi', 'rolled oats'],
        [2, 'tbsp', 'zeytinyağı', 'olive oil'],
        [1, 'ssp', 'kabartma tozu', 'baking powder'],
        [200, 'g', 'süzme yoğurt (sos)', 'strained yogurt (sauce)'],
        [1, 'tbsp', 'tahin (sos)', 'tahini (sauce)'],
        [0.5, 'pc', 'limon suyu (sos)', 'lemon, juiced (sauce)'],
        [null, 'none', 'tuz', 'salt']
      ],
      steps: {
        tr: ['Islatılmış nohutları süzüp kurulayın. Haşlamayın; falafelin dağılmaması için çiğ nohut kullanılır.', 'Nohut, soğan, sarımsak, yeşillikler ve baharatları robotta iri kum kıvamına gelene kadar çekin; püre olmamalı.', 'Yulaf, kabartma tozu ve tuzu ekleyip karıştırın; karışımı buzdolabında 20 dakika dinlendirin.', 'Fırını 200 °C’ye ısıtın. Karışımdan 16 top yapıp hafifçe bastırın, yağlı kâğıt serili tepsiye dizin ve üzerlerine zeytinyağı sürün.', '25–30 dakika, yarısında çevirerek iki tarafı da kızarana kadar pişirin.', 'Yoğurdu tahin, limon suyu ve bir tutam tuzla karıştırıp sos olarak yanında servis edin.'],
        en: ['Drain and dry the soaked chickpeas. Do not boil them: raw chickpeas keep falafel from falling apart.', 'Pulse the chickpeas, onion, garlic, herbs and spices to a coarse, sandy texture, not a purée.', 'Mix in the oats, baking powder and salt; chill for 20 minutes.', 'Heat the oven to 200 °C. Shape 16 balls, flatten slightly, place on a lined tray and brush with olive oil.', 'Bake for 25–30 minutes, turning halfway, until golden on both sides.', 'Mix the yogurt with tahini, lemon juice and a pinch of salt and serve alongside.']
      },
      tip: { tr: 'Kızartma yerine fırında pişirmek porsiyon başına yaklaşık 150 kcal tasarruf sağlar. Pişmiş falafeller dondurucuda bir ay saklanır.', en: 'Baking instead of frying saves roughly 150 kcal per portion. Cooked falafel keeps in the freezer for a month.' }
    },
    {
      id: 'humus', cat: 'snack', img: 'tarif-humus', serves: 6,
      time: { tr: '15 dk', en: '15 min' },
      kcal: 210, p: 9, c: 25, f: 9, tags: ['vegan', 'gf', 'fiber'],
      title: { tr: 'Klasik humus ve sebze çubukları', en: 'Classic hummus with crudités' },
      alt: { tr: 'Zeytinyağı ve salatalıkla süslenmiş kase dolusu humus', en: 'A bowl of hummus topped with olive oil and cucumber' },
      ing: [
        [400, 'g', 'haşlanmış nohut', 'cooked chickpeas'],
        [60, 'g', 'tahin', 'tahini'],
        [1, 'pc', 'limon (suyu)', 'lemon (juice)'],
        [1, 'clove', 'sarımsak', 'garlic'],
        [60, 'ml', 'buzlu su', 'ice-cold water'],
        [1, 'tbsp', 'zeytinyağı', 'olive oil'],
        [0.5, 'ssp', 'kimyon', 'ground cumin'],
        [2, 'pc', 'havuç', 'carrots'],
        [1, 'pc', 'salatalık', 'cucumber'],
        [3, 'stalk', 'kereviz sapı', 'celery'],
        [null, 'none', 'tuz', 'salt']
      ],
      steps: {
        tr: ['Nohutları süzün; birkaç yemek kaşığı haşlama suyunu ayırın.', 'Tahin ve limon suyunu robotta 1 dakika çırpın; kremamsı ve açık renkli olacak.', 'Sarımsak, kimyon ve tuzu ekleyip 30 saniye daha çalıştırın.', 'Nohutları ekleyin; buzlu suyu azar azar ilave ederek 2–3 dakika pürüzsüz olana kadar çekin.', 'Tabağa alıp zeytinyağı gezdirin; havuç, salatalık ve kereviz çubuklarıyla servis edin.'],
        en: ['Drain the chickpeas, keeping a few spoonfuls of the cooking liquid.', 'Blend the tahini and lemon juice for 1 minute until pale and creamy.', 'Add the garlic, cumin and salt and blend for another 30 seconds.', 'Add the chickpeas and blend for 2–3 minutes, pouring in the iced water little by little, until smooth.', 'Spread on a plate, drizzle with olive oil and serve with carrot, cucumber and celery sticks.']
      },
      tip: { tr: 'Bir porsiyon yaklaşık 4 yemek kaşığıdır. Cam kapta buzdolabında 4 gün saklanır; ara öğünler için küçük kaplara bölebilirsiniz.', en: 'One portion is about 4 tablespoons. It keeps for 4 days in a glass container; portion it into small pots for snacks.' }
    },
    {
      id: 'chia', cat: 'dessert', img: 'tarif-chia', serves: 2,
      time: { tr: '5 dk + 3 saat', en: '5 min + 3 hours' },
      kcal: 260, p: 15, c: 24, f: 12, tags: ['veg', 'gf', 'fiber'],
      title: { tr: 'Yoğurtlu chia puding', en: 'Chia yogurt pudding' },
      alt: { tr: 'Cam kasede yaban mersini ve nane yaprağıyla chia puding', en: 'Chia pudding with blueberries and mint in a glass' },
      ing: [
        [40, 'g', 'chia tohumu', 'chia seeds'],
        [200, 'ml', 'süt', 'milk'],
        [150, 'g', 'süzme yoğurt', 'strained yogurt'],
        [1, 'tsp', 'bal', 'honey'],
        [0.5, 'ssp', 'vanilya özü', 'vanilla extract'],
        [80, 'g', 'yaban mersini ve çilek', 'blueberries and strawberries'],
        [10, 'g', 'badem', 'almonds'],
        [null, 'none', 'birkaç yaprak nane', 'a few mint leaves']
      ],
      steps: {
        tr: ['Chia, süt, bal ve vanilyayı bir kapta karıştırın; topaklanmaması için 10 dakika sonra bir kez daha karıştırın.', 'Kabı kapatıp buzdolabında en az 3 saat bekletin.', 'Süzme yoğurdu iki kaseye paylaştırın, üzerine chia karışımını ekleyin.', 'Meyveleri, iri kıyılmış bademi ve naneyi ekleyerek servis edin.'],
        en: ['Stir the chia, milk, honey and vanilla together; stir again after 10 minutes so it does not clump.', 'Cover and refrigerate for at least 3 hours.', 'Divide the yogurt between two glasses and spoon the chia on top.', 'Finish with the berries, chopped almonds and mint.']
      },
      tip: { tr: 'Chia tohumu sıvıyla jelleşerek uzun süre doygun tutar. Tatlı isteği geldiğinde buzdolabında hazır bir kavanozun olması işinizi kolaylaştırır.', en: 'Chia forms a gel with liquid and keeps you full for a long time. A ready jar in the fridge makes sweet cravings much easier to handle.' }
    },
    {
      id: 'firin-elma', cat: 'dessert', img: 'tarif-firin-elma', serves: 4,
      time: { tr: '35 dk', en: '35 min' },
      kcal: 220, p: 4, c: 36, f: 8, tags: ['veg', 'nosugar'],
      title: { tr: 'Tarçınlı fırın elma, cevizli', en: 'Baked apples with cinnamon and walnuts' },
      alt: { tr: 'Üzerine pekmez dökülen fırınlanmış elma tatlısı', en: 'Molasses being poured over a baked apple dessert' },
      ing: [
        [4, 'pc', 'orta boy elma (Amasya veya yeşil)', 'medium apples'],
        [40, 'g', 'ceviz içi', 'walnuts'],
        [20, 'g', 'yulaf ezmesi', 'rolled oats'],
        [2, 'tbsp', 'üzüm pekmezi', 'grape molasses'],
        [1, 'ssp', 'tarçın', 'ground cinnamon'],
        [1, 'pinch', 'toz karanfil', 'ground cloves'],
        [4, 'tbsp', 'süzme yoğurt (servis için)', 'strained yogurt, to serve']
      ],
      steps: {
        tr: ['Fırını 180 °C’ye ısıtın. Elmaların çekirdek yuvasını alttan delmeden oyun.', 'Ceviz, yulaf, tarçın, karanfil ve pekmezin yarısını karıştırıp elmaların içine doldurun.', 'Elmaları küçük bir fırın kabına dizin, dibine 4 yemek kaşığı su ekleyin.', '25–30 dakika, elmalar yumuşayana kadar pişirin.', 'Ilıyınca kalan pekmezi gezdirin ve bir kaşık süzme yoğurtla servis edin.'],
        en: ['Heat the oven to 180 °C. Core the apples without cutting through the bottom.', 'Mix the walnuts, oats, cinnamon, cloves and half the molasses and stuff the apples.', 'Stand them in a small baking dish with 4 tablespoons of water in the bottom.', 'Bake for 25–30 minutes until soft.', 'Let them cool a little, drizzle with the remaining molasses and serve with a spoonful of yogurt.']
      },
      tip: { tr: 'Elmanın kabuğunu soymayın; lifin önemli bir kısmı kabuğundadır. Pekmez de bir şeker kaynağıdır, miktarı ölçülü tutun.', en: 'Keep the peel on; a good share of the fibre is in it. Molasses is still sugar, so keep the amount modest.' }
    },
    {
      id: 'balkabagi-corba', cat: 'soup', img: 'tarif-balkabagi-corba', serves: 4,
      time: { tr: '35 dk', en: '35 min' },
      kcal: 240, p: 12, c: 31, f: 8, tags: ['veg', 'gf', 'fiber'],
      title: { tr: 'Balkabaklı kırmızı mercimek çorbası', en: 'Pumpkin and red lentil soup' },
      alt: { tr: 'Beyaz peynir ve kabak çekirdeğiyle servis edilmiş turuncu çorba', en: 'Orange soup topped with white cheese and pumpkin seeds' },
      ing: [
        [400, 'g', 'balkabağı (soyulmuş)', 'pumpkin, peeled'],
        [120, 'g', 'kırmızı mercimek', 'red lentils'],
        [1, 'pc', 'kuru soğan', 'onion'],
        [1, 'pc', 'havuç', 'carrot'],
        [1, 'clove', 'sarımsak', 'garlic'],
        [1, 'tbsp', 'zeytinyağı', 'olive oil'],
        [1000, 'ml', 'sebze suyu veya su', 'vegetable stock or water'],
        [1, 'ssp', 'kimyon', 'ground cumin'],
        [0.5, 'ssp', 'pul biber', 'chilli flakes'],
        [40, 'g', 'beyaz peynir (servis için)', 'white cheese, to serve'],
        [20, 'g', 'kabak çekirdeği (servis için)', 'pumpkin seeds, to serve'],
        [null, 'none', 'tuz', 'salt']
      ],
      steps: {
        tr: ['Tencerede zeytinyağını ısıtın; doğranmış soğan ve havucu 5 dakika kavurun.', 'Sarımsak ve kimyonu ekleyip 1 dakika çevirin.', 'Küp doğranmış balkabağını, yıkanmış mercimeği ve sebze suyunu ekleyin.', 'Kapak aralık, kısık ateşte 20–25 dakika, mercimek dağılana kadar pişirin.', 'Blenderdan geçirip tuzunu ayarlayın; çok koyuysa biraz sıcak su ekleyin.', 'Kaselere alıp ufalanmış peynir, kabak çekirdeği ve pul biber serpin.'],
        en: ['Heat the oil in a pot and cook the chopped onion and carrot for 5 minutes.', 'Add the garlic and cumin and stir for 1 minute.', 'Add the diced pumpkin, rinsed lentils and stock.', 'Simmer with the lid ajar for 20–25 minutes until the lentils break down.', 'Blend until smooth and season; loosen with a little hot water if too thick.', 'Serve topped with crumbled cheese, pumpkin seeds and chilli flakes.']
      },
      tip: { tr: 'Mercimek ve balkabağı birlikte hem lif hem bitkisel protein sağlar. Porsiyonluk kaplara bölüp üç aya kadar dondurabilirsiniz.', en: 'Together, lentils and pumpkin give you both fibre and plant protein. Portion and freeze for up to three months.' }
    }
  ];

  var RSTR = {
    tr: { serves: '{n} porsiyon', perServing: 'Porsiyon başına', ingredients: 'Malzemeler', method: 'Hazırlanışı', tip: 'Diyetisyen notu', servings: 'Porsiyon', less: 'Porsiyonu azalt', more: 'Porsiyonu artır', kcal: 'kcal', protein: 'protein', carbs: 'karb.', fat: 'yağ', open: 'Tarifi aç', print: 'Yazdır', empty: 'Bu kategoride tarif yok.' },
    en: { serves: 'Serves {n}', perServing: 'Per serving', ingredients: 'Ingredients', method: 'Method', tip: 'Dietitian’s note', servings: 'Servings', less: 'Fewer servings', more: 'More servings', kcal: 'kcal', protein: 'protein', carbs: 'carbs', fat: 'fat', open: 'Open recipe', print: 'Print', empty: 'No recipes in this category.' }
  };
  function R() { return RSTR[L()]; }

  var ICON_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  var ICON_FIRE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5.5 1-8.5Z"/></svg>';

  var grid = document.querySelector('[data-recipes]');
  var filters = document.querySelector('[data-recipe-filters]');
  var dialog = document.getElementById('recipe-dialog');
  var rState = { cat: 'all', open: null, servings: null };

  function fmtQty(q, unit) {
    if (q == null) return '';
    if (unit === 'g' || unit === 'ml') {
      var r = q >= 100 ? Math.round(q / 5) * 5 : Math.round(q);
      return num(r);
    }
    var whole = Math.floor(q + 1e-9);
    var frac = q - whole;
    var map = [[0.25, '¼'], [0.33, '⅓'], [0.5, '½'], [0.67, '⅔'], [0.75, '¾']];
    var sym = '';
    if (frac > 0.88) {
      whole += 1;
    } else if (frac > 0.12) {
      var best = map.reduce(function (a, b) { return Math.abs(b[0] - frac) < Math.abs(a[0] - frac) ? b : a; });
      if (Math.abs(best[0] - frac) < 0.1) sym = best[1];
      else return num(Math.round(q * 10) / 10, 1);
    }
    return (whole ? String(whole) : '') + sym || '0';
  }
  function unitLabel(unit, q) {
    var u = UNITS[unit][L()];
    if (L() === 'en' && q != null && q > 1 && (unit === 'clove' || unit === 'stalk' || unit === 'pinch' || unit === 'bunch')) u = unit === 'bunch' ? 'bunches' : u + 's';
    return u;
  }

  function renderRecipes() {
    if (!grid) return;
    grid.textContent = '';
    var lang = L();
    var list = RECIPES.filter(function (r) { return rState.cat === 'all' || r.cat === rState.cat; });
    if (!list.length) { grid.appendChild(el('p', 'recipes-empty', R().empty)); return; }
    list.forEach(function (r) {
      var card = el('button', 'recipe-card');
      card.type = 'button';
      card.dataset.recipe = r.id;
      card.setAttribute('aria-haspopup', 'dialog');
      var fig = el('figure');
      var img = el('img');
      img.src = 'assets/img/' + r.img + '-560.webp';
      img.srcset = 'assets/img/' + r.img + '-560.webp 560w, assets/img/' + r.img + '-1000.webp 1000w';
      img.sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw';
      img.width = 1000; img.height = 800;
      img.loading = 'lazy'; img.decoding = 'async';
      img.alt = r.alt[lang];
      fig.appendChild(img);
      var body = el('div', 'recipe-card-body');
      var meta = el('p', 'recipe-meta');
      meta.appendChild(el('span', null, CATS[r.cat][lang]));
      var t = el('span'); t.innerHTML = ICON_CLOCK; t.appendChild(document.createTextNode(r.time[lang]));
      var k = el('span'); k.innerHTML = ICON_FIRE; k.appendChild(document.createTextNode(r.kcal + ' kcal'));
      meta.append(t, k);
      body.appendChild(meta);
      body.appendChild(el('h3', null, r.title[lang]));
      var tags = el('ul', 'tags');
      r.tags.forEach(function (tg) { tags.appendChild(el('li', null, TAGS[tg][lang])); });
      body.appendChild(tags);
      card.append(fig, body);
      grid.appendChild(card);
    });
  }

  function renderDialog() {
    var r = RECIPES.filter(function (x) { return x.id === rState.open; })[0];
    if (!r || !dialog) return;
    var lang = L();
    var s = R();
    var img = dialog.querySelector('[data-recipe-img]');
    img.src = 'assets/img/' + r.img + '-1000.webp';
    img.alt = r.alt[lang];
    var box = dialog.querySelector('[data-recipe-content]');
    box.textContent = '';

    var meta = el('p', 'recipe-meta');
    meta.appendChild(el('span', null, CATS[r.cat][lang]));
    var t = el('span'); t.innerHTML = ICON_CLOCK; t.appendChild(document.createTextNode(r.time[lang]));
    meta.appendChild(t);
    var h = el('h2', null, r.title[lang]);
    h.id = 'recipe-title';
    var tags = el('ul', 'tags');
    r.tags.forEach(function (tg) { tags.appendChild(el('li', null, TAGS[tg][lang])); });

    var nutriLabel = el('p', 'dialog-h3', s.perServing);
    var nutri = el('div', 'nutri');
    [[r.kcal, s.kcal], [r.p + ' g', s.protein], [r.c + ' g', s.carbs], [r.f + ' g', s.fat]].forEach(function (x) {
      var d = el('div');
      d.append(el('b', null, String(x[0])), el('span', null, x[1]));
      nutri.appendChild(d);
    });

    var serv = el('div', 'servings');
    serv.appendChild(el('span', 'dialog-h3', s.servings));
    var ctrl = el('div', 'servings-ctrl');
    var minus = el('button', 'icon-btn');
    minus.type = 'button'; minus.setAttribute('aria-label', s.less);
    minus.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 12h12"/></svg>';
    minus.disabled = rState.servings <= 1;
    var out = el('output', null, String(rState.servings));
    out.setAttribute('aria-live', 'polite');
    var plus = el('button', 'icon-btn');
    plus.type = 'button'; plus.setAttribute('aria-label', s.more);
    plus.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>';
    plus.disabled = rState.servings >= 12;
    minus.addEventListener('click', function () { rState.servings = Math.max(1, rState.servings - 1); renderDialog(); dialog.querySelector('.servings .icon-btn:first-child').focus(); });
    plus.addEventListener('click', function () { rState.servings = Math.min(12, rState.servings + 1); renderDialog(); dialog.querySelector('.servings .icon-btn:last-child').focus(); });
    ctrl.append(minus, out, plus);
    serv.appendChild(ctrl);

    var ingH = el('h3', 'dialog-h3', s.ingredients);
    var ul = el('ul', 'ingredients');
    var factor = rState.servings / r.serves;
    r.ing.forEach(function (it, i) {
      var li = el('li');
      var label = el('label');
      var cb = el('input');
      cb.type = 'checkbox';
      cb.id = 'ing-' + r.id + '-' + i;
      var q = it[0] == null ? null : it[0] * factor;
      var qty = el('span', 'qty', q == null ? '—' : (fmtQty(q, it[1]) + ' ' + unitLabel(it[1], q)).trim());
      var name = el('span', null, lang === 'en' ? it[3] : it[2]);
      label.append(cb, qty, name);
      li.appendChild(label);
      ul.appendChild(li);
    });

    var stH = el('h3', 'dialog-h3', s.method);
    var ol = el('ol', 'steps-list');
    r.steps[lang].forEach(function (st) { ol.appendChild(el('li', null, st)); });

    var tip = el('div', 'tip-box');
    tip.append(el('p', 'label', s.tip), el('p', null, r.tip[lang]));

    box.append(meta, h, tags, nutriLabel, nutri, serv, ingH, ul, stH, ol, tip);
  }

  if (grid) {
    grid.addEventListener('click', function (e) {
      var card = e.target.closest('[data-recipe]');
      if (!card) return;
      var r = RECIPES.filter(function (x) { return x.id === card.dataset.recipe; })[0];
      rState.open = r.id;
      rState.servings = r.serves;
      renderDialog();
      M.openDialog(dialog);
      dialog.querySelector('.dialog-scroll').scrollTop = 0;
      dialog.dataset.returnTo = r.id;
    });
    if (dialog) {
      dialog.addEventListener('close', function () {
        var back = grid.querySelector('[data-recipe="' + dialog.dataset.returnTo + '"]');
        rState.open = null;
        if (back) back.focus({ preventScroll: true });
      });
    }
  }
  if (filters) {
    filters.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]');
      if (!b) return;
      rState.cat = b.getAttribute('data-cat');
      Array.prototype.forEach.call(filters.querySelectorAll('[data-cat]'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      renderRecipes();
    });
  }
  renderRecipes();
  M.onLang(function () { renderRecipes(); if (rState.open) renderDialog(); });

  M.content = { recipes: RECIPES, plans: PLANS, openRecipeFilter: function (cat) { var b = filters && filters.querySelector('[data-cat="' + cat + '"]'); if (b) b.click(); } };
})();
