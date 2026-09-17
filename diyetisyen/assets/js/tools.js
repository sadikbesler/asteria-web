/* Mizan Beslenme — health calculators (BMI, daily energy, water) */
(function () {
  'use strict';

  var M = window.Mizan;
  var section = document.getElementById('araclar');
  if (!M || !section) return;

  var STR = {
    tr: {
      bmiLabel: 'Vücut kitle indeksiniz',
      cat: ['Zayıf', 'Normal', 'Fazla kilolu', '1. derece obezite', '2. derece obezite', '3. derece obezite'],
      catText: [
        'Boyunuza göre kilonuz sağlıklı aralığın altında. Yetersiz beslenme ya da altta yatan bir neden olup olmadığını birlikte değerlendirmek iyi olur.',
        'Boyunuza göre sağlıklı aralıktasınız. Bel çevresi ve vücut yağ oranı da resmin önemli bir parçası; vücut analiziyle daha net görebiliriz.',
        'Sağlıklı aralığın biraz üzerindesiniz. Küçük ama sürdürülebilir değişikliklerle bu aralığa dönmek çoğu zaman mümkün.',
        'Obezite kalp-damar hastalıkları ve tip 2 diyabet riskini artırabilir. Hekiminiz ve bir diyetisyenle birlikte plan yapmanızı öneririz.',
        'Sağlığınız için profesyonel destek önemli. Hekiminizin değerlendirmesiyle birlikte bireysel bir beslenme planı öneririz.',
        'Sağlığınız için hekim takibi ve bireysel beslenme planı önemlidir. İlk adım olarak bir hekim değerlendirmesi öneririz.'
      ],
      range: 'Boyunuza göre sağlıklı kilo aralığı',
      distance: 'Sağlıklı aralığa uzaklık',
      inRange: 'Aralıktasınız',
      above: '{n} kg üzerinde',
      below: '{n} kg altında',
      bmiCta: 'Sonucu bir diyetisyenle değerlendirin',
      kcalLabel: 'Günlük hedef enerji',
      perDay: 'kcal / gün',
      bmr: 'Bazal metabolizma hızı',
      tdee: 'Günlük enerji harcaması',
      target: 'Hedefinize göre alım',
      weekly: 'Tahmini haftalık değişim',
      weeklyLose: 'haftada yaklaşık {n} kg azalma',
      weeklyGain: 'haftada yaklaşık {n} kg artış',
      weeklyKeep: 'kilonuzu korursunuz',
      floor: 'Hedef, güvenli alt sınıra ({n} kcal) yükseltildi. Daha düşük enerji alımı yalnızca diyetisyen ve hekim takibinde uygulanmalıdır.',
      macros: 'Önerilen makro dağılımı',
      protein: 'Protein', carbs: 'Karbonhidrat', fat: 'Yağ',
      kcalNote: 'Mifflin-St Jeor denklemiyle hesaplanmıştır. Gebelik, emzirme, kronik hastalık veya ilaç kullanımında ihtiyaçlar farklıdır.',
      kcalCta: 'Kişisel planınızı birlikte hazırlayalım',
      waterLabel: 'Günlük su ihtiyacınız (içecekler)',
      liters: 'litre / gün',
      glasses: '{n} bardak (200 ml)',
      tracker: 'Bugün içtiklerinizi işaretleyin',
      trackerCount: 'Bugün: {n} / {total} bardak',
      glassAria: '{n}. bardak',
      waterBreak: 'Hesabın dökümü',
      wBase: 'Temel ihtiyaç ({kg} kg × 33 ml)',
      wExercise: 'Egzersiz ({min} dk)',
      wHot: 'Sıcak hava',
      wPregnant: 'Gebelik',
      wNursing: 'Emzirme',
      waterNote: 'Çay, kahve ve ayran da günlük sıvı alımına sayılır. Kalp veya böbrek hastalığı nedeniyle sıvı kısıtlamanız varsa hekiminizin önerisine uyun.',
      invalid: 'Geçerli değerler girildiğinde sonuç burada görünecek.'
    },
    en: {
      bmiLabel: 'Your body mass index',
      cat: ['Underweight', 'Healthy weight', 'Overweight', 'Obesity class I', 'Obesity class II', 'Obesity class III'],
      catText: [
        'Your weight is below the healthy range for your height. It is worth checking together whether you are under-eating or there is an underlying cause.',
        'You are within the healthy range for your height. Waist size and body fat also matter; a body composition analysis gives a clearer picture.',
        'You are a little above the healthy range. Small, sustainable changes are often enough to get back into it.',
        'Obesity can raise the risk of heart disease and type 2 diabetes. We recommend planning together with your doctor and a dietitian.',
        'Professional support matters for your health. We recommend a personal nutrition plan alongside your doctor’s assessment.',
        'Medical follow-up and a personal nutrition plan are important for your health. A doctor’s assessment is a good first step.'
      ],
      range: 'Healthy weight range for your height',
      distance: 'Distance to the healthy range',
      inRange: 'You are in range',
      above: '{n} kg above',
      below: '{n} kg below',
      bmiCta: 'Review your result with a dietitian',
      kcalLabel: 'Daily energy target',
      perDay: 'kcal / day',
      bmr: 'Basal metabolic rate',
      tdee: 'Total daily energy expenditure',
      target: 'Intake for your goal',
      weekly: 'Estimated weekly change',
      weeklyLose: 'about {n} kg less per week',
      weeklyGain: 'about {n} kg more per week',
      weeklyKeep: 'weight stays stable',
      floor: 'The target was raised to a safe minimum ({n} kcal). Lower intakes should only be followed under a dietitian’s and doctor’s supervision.',
      macros: 'Suggested macro split',
      protein: 'Protein', carbs: 'Carbohydrate', fat: 'Fat',
      kcalNote: 'Calculated with the Mifflin-St Jeor equation. Needs differ in pregnancy, breastfeeding, chronic illness or when taking medication.',
      kcalCta: 'Let’s build your personal plan',
      waterLabel: 'Your daily water need (drinks)',
      liters: 'litres / day',
      glasses: '{n} glasses (200 ml)',
      tracker: 'Tick off what you have had today',
      trackerCount: 'Today: {n} / {total} glasses',
      glassAria: 'Glass {n}',
      waterBreak: 'How it adds up',
      wBase: 'Baseline ({kg} kg × 33 ml)',
      wExercise: 'Exercise ({min} min)',
      wHot: 'Hot weather',
      wPregnant: 'Pregnancy',
      wNursing: 'Breastfeeding',
      waterNote: 'Tea, coffee and ayran count towards your daily fluids. If you have a fluid restriction because of heart or kidney disease, follow your doctor’s advice.',
      invalid: 'Your result will appear here once valid values are entered.'
    }
  };
  function S() { return STR[M.lang()] || STR.tr; }
  function fill(s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }); }
  function num(n, digits) {
    return new Intl.NumberFormat(M.lang() === 'en' ? 'en-GB' : 'tr-TR', { minimumFractionDigits: digits || 0, maximumFractionDigits: digits || 0 }).format(n);
  }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function val(form, name) {
    var f = form.elements[name];
    if (!f) return NaN;
    if (f instanceof RadioNodeList || (f.length && f[0] && f[0].type === 'radio')) return f.value;
    return parseFloat(String(f.value).replace(',', '.'));
  }
  function statRows(rows) {
    var dl = el('dl', 'stat-rows');
    rows.forEach(function (r) {
      var d = el('div', 'stat-row');
      d.append(el('dt', null, r[0]), el('dd', null, r[1]));
      dl.appendChild(d);
    });
    return dl;
  }
  function cta(text, attrs) {
    var a = el('a', 'link-arrow', text);
    a.href = '#randevu';
    Object.keys(attrs || {}).forEach(function (k) { a.setAttribute(k, attrs[k]); });
    return a;
  }

  /* ---------- Tabs ---------- */
  var tabs = Array.prototype.slice.call(section.querySelectorAll('[role="tab"]'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (e.key === 'Home') { e.preventDefault(); selectTab(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); selectTab(tabs[tabs.length - 1], true); }
      if (d) { e.preventDefault(); selectTab(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });
  document.addEventListener('mizan:tool', function (e) {
    var tab = document.getElementById('tab-' + (e.detail || 'bmi'));
    if (tab) selectTab(tab);
  });

  /* ---------- Range <-> number sync ---------- */
  Array.prototype.forEach.call(section.querySelectorAll('input[type="range"][data-sync]'), function (range) {
    var form = range.form;
    var number = form.elements[range.getAttribute('data-sync')];
    range.addEventListener('input', function () { number.value = range.value; update(form); });
    number.addEventListener('input', function () {
      var v = parseFloat(number.value);
      if (!isNaN(v)) range.value = Math.min(+range.max, Math.max(+range.min, v));
    });
  });

  /* ---------- BMI ---------- */
  var BMI_MIN = 15, BMI_MAX = 40;
  function bmiIndex(b) { return b < 18.5 ? 0 : b < 25 ? 1 : b < 30 ? 2 : b < 35 ? 3 : b < 40 ? 4 : 5; }
  function renderBmi(form, out) {
    var h = val(form, 'height'), w = val(form, 'weight');
    out.textContent = '';
    if (!(h >= 120 && h <= 220 && w >= 30 && w <= 250)) { out.appendChild(el('p', 'muted', S().invalid)); return; }
    var m = h / 100;
    var bmi = w / (m * m);
    var idx = bmiIndex(bmi);
    var s = S();

    out.appendChild(el('p', 'label', s.bmiLabel));
    var big = el('div', 'result-big');
    big.appendChild(el('span', 'result-num', num(bmi, 1)));
    var tag = el('span', 'result-tag');
    tag.style.color = 'var(--bmi-' + Math.min(idx + 1, 5) + ')';
    tag.appendChild(el('i'));
    var tagText = el('span', null, s.cat[idx]);
    tagText.style.color = 'var(--ink)';
    tag.appendChild(tagText);
    big.appendChild(tag);
    out.appendChild(big);

    var scale = el('div', 'scale');
    var wrap = el('div', 'scale-wrap');
    var bar = el('div', 'scale-bar');
    bar.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 5; i++) bar.appendChild(el('span'));
    var marker = el('span', 'scale-marker');
    marker.setAttribute('aria-hidden', 'true');
    var pos = (Math.min(BMI_MAX, Math.max(BMI_MIN, bmi)) - BMI_MIN) / (BMI_MAX - BMI_MIN) * 100;
    marker.style.left = pos + '%';
    wrap.append(marker, bar);
    var ticks = el('div', 'scale-ticks');
    ticks.setAttribute('aria-hidden', 'true');
    [18.5, 25, 30, 35].forEach(function (v) {
      var tck = el('span', null, num(v, v % 1 ? 1 : 0));
      tck.style.left = ((v - BMI_MIN) / (BMI_MAX - BMI_MIN) * 100) + '%';
      ticks.appendChild(tck);
    });
    scale.append(wrap, ticks);
    out.appendChild(scale);

    out.appendChild(el('p', 'result-text', s.catText[idx]));

    var lo = 18.5 * m * m, hi = 24.9 * m * m;
    var dist = w > hi ? fill(s.above, { n: num(w - hi, 1) }) : w < lo ? fill(s.below, { n: num(lo - w, 1) }) : s.inRange;
    out.appendChild(statRows([
      [s.range, num(lo, 1) + ' – ' + num(hi, 1) + ' kg'],
      [s.distance, dist]
    ]));
    out.appendChild(cta(s.bmiCta, { 'data-book-area': idx >= 3 ? 'clinical' : 'weight' }));
  }

  /* ---------- Daily energy ---------- */
  function renderKcal(form, out) {
    var s = S();
    var sex = val(form, 'sex'), age = val(form, 'age'), h = val(form, 'height'), w = val(form, 'weight');
    var act = val(form, 'activity'), goal = val(form, 'goal');
    out.textContent = '';
    if (!(age >= 18 && age <= 90 && h >= 120 && h <= 220 && w >= 30 && w <= 250)) { out.appendChild(el('p', 'muted', s.invalid)); return; }

    var bmr = 10 * w + 6.25 * h - 5 * age + (sex === 'm' ? 5 : -161);
    var tdee = bmr * act;
    var target = goal === 'lose' ? tdee - 500 : goal === 'gain' ? tdee + 300 : tdee;
    var floor = Math.max(sex === 'm' ? 1500 : 1200, Math.round(bmr / 10) * 10);
    var floored = false;
    if (goal === 'lose' && target < floor) { target = floor; floored = true; }
    target = Math.round(target / 10) * 10;

    var refWeight = Math.min(w, 25 * (h / 100) * (h / 100));
    var pgPerKg = goal === 'keep' ? 1.2 : 1.6;
    var protein = Math.round(refWeight * pgPerKg);
    var fat = Math.round(target * 0.3 / 9);
    var carbs = Math.max(0, Math.round((target - protein * 4 - fat * 9) / 4));

    out.appendChild(el('p', 'label', s.kcalLabel));
    var big = el('div', 'result-big');
    big.append(el('span', 'result-num', num(target)), el('span', 'result-unit', s.perDay));
    out.appendChild(big);

    var diff = target - tdee;
    var weekly = Math.abs(diff) * 7 / 7700;
    out.appendChild(statRows([
      [s.bmr, num(Math.round(bmr)) + ' kcal'],
      [s.tdee, num(Math.round(tdee)) + ' kcal'],
      [s.weekly, Math.abs(diff) < 50 ? s.weeklyKeep : fill(diff < 0 ? s.weeklyLose : s.weeklyGain, { n: num(weekly, 2) })]
    ]));
    if (floored) out.appendChild(el('p', 'tool-note', fill(s.floor, { n: num(floor) })));

    out.appendChild(el('p', 'label', s.macros));
    var bars = el('div', 'macro-bars');
    [['p', s.protein, protein, protein * 4], ['c', s.carbs, carbs, carbs * 4], ['f', s.fat, fat, fat * 9]].forEach(function (x) {
      var pct = Math.round(x[3] / target * 100);
      var m = el('div', 'macro macro--' + x[0]);
      var head = el('div', 'macro-head');
      head.append(el('b', null, x[1]), el('span', null, num(x[2]) + ' g · %' + pct));
      if (M.lang() === 'en') head.lastChild.textContent = num(x[2]) + ' g · ' + pct + '%';
      var track = el('div', 'macro-track');
      var fillEl = el('div', 'macro-fill');
      track.appendChild(fillEl);
      m.append(head, track);
      bars.appendChild(m);
      requestAnimationFrame(function () { fillEl.style.width = Math.min(100, pct) + '%'; });
    });
    out.appendChild(bars);
    out.appendChild(el('p', 'tool-note', s.kcalNote));
    out.appendChild(cta(s.kcalCta, { 'data-book-area': 'weight' }));
  }

  /* ---------- Water ---------- */
  function waterKey() { return 'mizan-water-' + M.time.now().key; }
  function renderWater(form, out) {
    var s = S();
    var w = val(form, 'weight'), ex = val(form, 'exercise');
    var climate = val(form, 'climate'), status = val(form, 'status');
    out.textContent = '';
    if (!(w >= 30 && w <= 250) || !(ex >= 0 && ex <= 600)) { out.appendChild(el('p', 'muted', s.invalid)); return; }
    var base = w * 33;
    var exMl = ex * 12;
    var hot = climate === 'hot' ? 500 : 0;
    var extra = status === 'pregnant' ? 300 : status === 'nursing' ? 700 : 0;
    var total = Math.round((base + exMl + hot + extra) / 50) * 50;
    var glasses = Math.ceil(total / 200);

    out.appendChild(el('p', 'label', s.waterLabel));
    var big = el('div', 'result-big');
    big.append(el('span', 'result-num', num(total / 1000, 1)), el('span', 'result-unit', s.liters + ' · ' + fill(s.glasses, { n: glasses })));
    out.appendChild(big);

    var drank = Math.min(glasses, parseInt(M.read(waterKey()) || '0', 10) || 0);
    var trackerLabel = el('p', 'label', s.tracker);
    var count = el('p', 'muted', fill(s.trackerCount, { n: drank, total: glasses }));
    var row = el('div', 'glasses');
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', s.tracker);
    function paint() {
      Array.prototype.forEach.call(row.children, function (g, i) {
        g.classList.toggle('is-full', i < drank);
        g.setAttribute('aria-pressed', String(i < drank));
      });
      count.textContent = fill(s.trackerCount, { n: drank, total: glasses });
    }
    for (var i = 0; i < glasses; i++) {
      var g = el('button', 'glass');
      g.type = 'button';
      g.setAttribute('aria-label', fill(s.glassAria, { n: i + 1 }));
      g.dataset.i = String(i);
      row.appendChild(g);
    }
    row.addEventListener('click', function (e) {
      var g = e.target.closest('.glass');
      if (!g) return;
      var i = +g.dataset.i;
      drank = drank === i + 1 ? i : i + 1;
      M.store(waterKey(), String(drank));
      paint();
    });
    paint();
    out.append(trackerLabel, row, count);

    var rows = [[fill(s.wBase, { kg: num(w, w % 1 ? 1 : 0) }), num(Math.round(base)) + ' ml']];
    if (exMl) rows.push([fill(s.wExercise, { min: ex }), '+' + num(exMl) + ' ml']);
    if (hot) rows.push([s.wHot, '+' + num(hot) + ' ml']);
    if (extra) rows.push([status === 'pregnant' ? s.wPregnant : s.wNursing, '+' + num(extra) + ' ml']);
    out.appendChild(el('p', 'label', s.waterBreak));
    out.appendChild(statRows(rows));
    out.appendChild(el('p', 'tool-note', s.waterNote));
  }

  /* ---------- Wiring ---------- */
  var renderers = { bmi: renderBmi, kcal: renderKcal, water: renderWater };
  var forms = Array.prototype.slice.call(section.querySelectorAll('form[data-tool]'));
  function update(form) {
    var kind = form.getAttribute('data-tool');
    var out = section.querySelector('[data-result="' + kind + '"]');
    renderers[kind](form, out);
  }
  var timers = {};
  forms.forEach(function (form) {
    form.addEventListener('input', function () {
      clearTimeout(timers[form.dataset.tool]);
      timers[form.dataset.tool] = setTimeout(function () { update(form); }, 120);
    });
    form.addEventListener('change', function () { update(form); });
    form.addEventListener('submit', function (e) { e.preventDefault(); update(form); });
    update(form);
  });
  /* Keep weight/height consistent across the three tools */
  forms.forEach(function (form) {
    ['weight', 'height'].forEach(function (name) {
      var f = form.elements[name];
      if (!f || f.type !== 'number') return;
      f.addEventListener('change', function () {
        forms.forEach(function (other) {
          if (other === form || !other.elements[name]) return;
          other.elements[name].value = f.value;
          var r = other.querySelector('input[type="range"][data-sync="' + name + '"]');
          if (r) r.value = f.value;
          update(other);
        });
      });
    });
  });
  M.onLang(function () { forms.forEach(update); });
})();
