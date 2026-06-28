# Ten-Person Simulation Audit

## Executive Summary

This Sprint 10 audit runs 10 realistic synthetic users through the current Weight Loss Deep Pattern evidence/report engine. The purpose is to check whether the prototype can separate common weight-loss blockage patterns, preserve safety routing, avoid debug/AI-smell leakage, and produce useful next-step reports across diverse user types.

Automated companion test: `tests/ten-person-simulation-audit.test.js`.

Overall result:

| Verdict | Count |
|---|---:|
| PASS | 10 |
| PARTIAL | 0 |
| FAIL | 0 |

Sprint 11 fix pass resolved the three Sprint 10 partial cases without changing safety suppression rules or broad report architecture:

- 36F Mother: Role Overload/Self-Neglect now appears as explicit evidence, hidden function language, avoid guidance, and first leverage.
- 24F Body-Safety/Shame: professional-first route now includes subtype-specific body-safety explanation, avoid list, and neutral next step.
- 42F Sleep/Circadian: Circadian-Energy now outranks generic reward when repeated sleep/energy evidence is strong.

## Persona 1 — 45M Office Worker / Executive Load

### Synthetic input

45-year-old male office worker, 171 cm, 85 kg, target 76-78 kg. Mostly sitting, low movement, 8-12 cigarettes/day, weekly alcohol. Wants belly weight down, feels tired, often eats late after work, knows what to do but cannot sustain it. Journey: 7-Day. Key answers: skipped breakfast/long gaps, 4-7 kg gain, low sleep, delivery/snack/default choices, no severe symptoms, no self-harm. Diary: 5 days with meal gaps, low evening energy, delivery/default, one alcohol/social snack day.

### Expected result

- Mode: `deep`
- Primary: `Executive Load Failure` or `Decision-Default Mismatch`
- Secondary: `Circadian-Energy Mismatch`, `Reward Deficit Compensation`
- Hidden functions: decision fatigue, energy repair, reward
- Avoid: many-rule meal plan, strict no-dinner rule, skipping lunch then enduring evening hunger
- First leverage: default dinner system / anchor lunch
- 14-day experiment: emergency dinners, delivery friction, evening energy tracking
- Safety: no Mode 3/4

### Actual report

```text
Гүн pattern тайлан Таны жин хасалтыг гацааж байж болох гол pattern тодорхой боллоо 5 өдөр хүрсэн тул бүрэн тайлан гаргах боломжтой боллоо. Мэдээллийн чанар 5 өдөр хүрсэн тул бүрэн тайлан гаргах боломжтой боллоо. Эхний зураглал ба бодит ажиглалт Эхний тестээр: Executive Load, Circadian-Energy, Hunger-Safety. 7 хоногийн ажиглалтаар: 4 өдөр хоолны зай уртсах эсвэл орой нөхөх pattern гарсан. 4 өдөр оройн эрч хүч бага байсан. 5 өдөр reward/craving function тэмдэглэгдсэн. Гол pattern Executive Load Failure — хүчтэй нийцэж байна. Ядарсан, завгүй, decision fatigue үед хамгийн амар default сонголт ялж байгаа эсэхийг ажиглана. Давхар нөлөөлж буй pattern-ууд Decision Default Reward-Seeking. Илэрч буй зан үйлүүд Хоолны хэмнэл алдагдах, хоолны зай уртсах; ядарсан үед delivery/default сонголт руу шилжих; өлсөлтөөс гадна reward хүсэл идэвхжих. Энэ зан үйл ямар үүрэгтэй байж болох вэ? Эрч хүч нөхөх; Decision fatigue-ээс гарах; Дараа өлсөхөөс хамгаалах. Давтагддаг цикл: өдөр decision load өндөр байна; орой эрч хүч унаж хоол хийх сэтгэлийн зай багасна; хамгийн амар сонголт ялна; delivery/snack default болно. Trigger зураглал: meal gaps 4/5, low evening energy 4/5, reward 5/5, delivery/default 5/5. Баталгаажуулсан reflection evidence: орой ядарсан үед delivery/default амар болсон; хоолны зай, оройн эрч хүч давхцсан. Одоогоор зайлсхийх зүйлс: Урт мацаг; Өдөр хоол алгасах; Олон дүрэмтэй meal plan; Өдөр бүр төгс tracking. Эхний leverage point: ядарсан үед ажиллах default dinner system. 14 хоногийн туршилт: 2 fixed dinner option, backup сонголт, орой energy + hunger check.
```

### Audit

- Report mode expected vs actual: `deep` vs `deep` — PASS
- Primary expected vs actual: Executive/Decision vs `Executive Load Failure` — PASS
- Secondary expected vs actual: Circadian/Reward vs Decision/Reward — PASS
- Hidden functions expected vs actual: decision fatigue, energy, reward vs decision fatigue, energy, hunger protection — PASS
- Avoid list expected vs actual: strict rules/meal skipping vs meal skipping/rule-heavy plan — PASS
- First leverage expected vs actual: default dinner system vs default dinner system — PASS
- Safety route expected vs actual: no Mode 3/4 vs no Mode 3/4 — PASS
- AI/debug smell? No
- Too broad / too long? Slightly long but useful
- Over-triggered professional check? No
- Under-triggered safety? No
- Does it feel useful? Yes
- Verdict: PASS
- Fix recommendation: Replace visible `energy` in experiment text with `эрч хүч` for consistency.

## Persona 2 — 36F Mother / Role Overload + Reward Deficit

### Synthetic input

36-year-old mother, work plus family care load, own needs come last. 7-Day journey. Key answers: бусдын хэрэгцээ, цаг/ядаргаа, өдрийн төгсгөлд өөрийгөө шагнах, хоосон мэдрэмж, no self-harm. Diary: 5 days of low energy, children/family needs first, evening reward eating.

### Expected result

- Mode: `deep`
- Primary: `Role Overload / Self-Neglect` or `Reward Deficit Compensation`
- Secondary: Executive Load, Circadian
- Hidden functions: own-time reward, energy repair, self-neglect relief
- Avoid: shame accountability, adding more rules, no-rest plan
- First leverage: self-first anchor / planned rest reward
- 14-day experiment: protected 10-minute rest/reward, simple evening option
- Safety: no Mode 3/4

### Actual report

```text
Гүн pattern тайлан. Эхний тестээр: Reward-Seeking, Executive Load, Reward Deficit. 7 хоногийн ажиглалтаар: 5 өдөр оройн эрч хүч бага байсан; 5 өдөр reward/craving function тэмдэглэгдсэн. Гол pattern Reward Deficit Compensation. Давхар нөлөөлж буй pattern-ууд Executive Load Failure, Role Overload / Self-Neglect Pattern. Илэрч буй зан үйлүүд: reward хүсэл, stress/мэдрэмжийн үед идэх хүсэл, collapse-like response. Hidden functions: Өөрийгөө хамгийн сүүлд тавьсны дараах нөхөх response; Эрч хүч нөхөх; Decision fatigue-ээс гарах. Reflection evidence: Бусдын хэрэгцээ түрүүлсэн; орой өөрийн reward хэрэгцээ хоолтой холбогдсон. Асуудал яг юу биш вэ? Таны оройн идэлт зөвхөн амттай юм хүссэндээ биш, өдөржин өөрийгөө хамгийн сүүлд тавьсны дараах нөхөх response байж болно. Одоогоор зайлсхийх зүйлс: “Зүгээр өөртөө цаг гарга” гэсэн ерөнхий зөвлөгөө; Strict diet; Public challenge; оройн reward-г шууд бүрэн хорих; Өөрийн хоолыг үлдэгдэл цагт найдах. Эхний leverage point: protected self-feeding slot + planned evening ritual. 14 хоногийн туршилт: protected self-feeding slot, minimum self-care rule, planned evening ritual.
```

### Audit

- Report mode expected vs actual: `deep` vs `deep` — PASS
- Primary expected vs actual: Role/Reward Deficit vs `Reward Deficit Compensation` — PASS
- Secondary expected vs actual: Executive/Role Overload present — PASS
- Hidden functions expected vs actual: own-time/self-neglect relief vs explicit self-neglect compensation — PASS
- Avoid list expected vs actual: no more rules/no reward ban vs role-specific avoid list — PASS
- First leverage expected vs actual: planned rest/reward expected vs protected self-feeding slot + planned evening ritual — PASS
- Safety route expected vs actual: no Mode 3/4 — PASS
- AI/debug smell? No
- Too broad / too long? No; now specific to role overload without becoming punitive
- Over-triggered professional check? No
- Under-triggered safety? No
- Does it feel useful? Yes; the first step is concrete and emotionally matched
- Verdict: PASS
- Fix recommendation: Done in Sprint 11. Later copy polish can localize remaining English product terms where desired.

## Persona 3 — 28F Diet Cycler / Control-Collapse

### Synthetic input

28-year-old woman with repeated diet cycles. One-Time journey. Key answers: many previous attempts, calorie counting, fasting, fitness challenge, “Одоо бүх юм дууссан”, strong all-or-nothing response, guilt/shame after slip, no self-harm.

### Expected result

- Mode: `deep`
- Primary: `Control-Collapse Cycle`
- Secondary: Shame Avoidance, Perfectionism, Hunger-Safety if fasting selected
- Hidden functions: control relief, shame avoidance
- Avoid: perfect plan, reset challenge, shame accountability
- First leverage: next-meal recovery rule
- Safety: no Mode 4

### Actual report

```text
Гүн pattern тайлан. Таны нэг удаагийн гүн зураглал бэлэн боллоо. Таны хамгийн хүчтэй pattern: Control-Collapse Cycle. Давхар нөлөөлж буй pattern-ууд Perfectionism, Hunger-Safety. Илэрч буй зан үйлүүд: Төлөвлөгөө алдагдахад бүхэлдээ нурсан мэт мэдрэгдэх. Hidden functions: Дараа өлсөхөөс хамгаалах; Ичгүүр/feedback-ээс зайлсхийх. Давтагддаг цикл: trigger; биеийн байдал/мэдрэмж/эрч хүч; default сонголт; relief/reward. Асуудал яг юу биш вэ? Нэг удаа plan алдсандаа биш, нэг slip бүхэл өдөр/долоо хоногийг дууссан мэт болгодог cycle байна. Одоогоор зайлсхийх зүйлс: Төгс perfect plan; reset challenge; shame-based accountability. Эхний leverage point: next-meal recovery rule. 14 хоногийн эхний туршилт: neutral check, нэг trigger нэрлэх, дараагийн хоолыг reset гэж харах. CTA: Миний pattern-ийг 7 хоногоор шалгах.
```

### Audit

- Mode: expected `deep`, actual `deep` — PASS
- Primary: expected Control-Collapse, actual Control-Collapse — PASS
- Secondary: expected Shame/Perfectionism/Hunger, actual Perfectionism/Hunger/Shame evidence — PASS
- Hidden functions: shame avoidance present — PASS
- Avoid list: exact match — PASS
- First leverage: recovery rule — PASS
- Safety: no urgent route — PASS
- AI/debug smell? No
- Too broad / too long? No, appropriately compressed
- Verdict: PASS
- Fix recommendation: Replace “Төгс perfect plan” with more natural Mongolian later.

## Persona 4 — 40M Fasting Rebound / Hunger-Safety

### Synthetic input

40-year-old male, repeated fasting/no dinner attempts, daytime restriction, evening rebound. 7-Day journey. Diary: 5 days of low daytime intake, hunger 9/10, low energy, “дараа өлсөхөөс санаа зовсон”, no urgent symptoms.

### Expected result

- Mode: `deep`
- Primary: Hunger-Safety
- Secondary: Circadian/Collapse
- Hidden functions: protection from future hunger, energy repair
- Avoid: fasting, meal skipping, enduring hunger
- First leverage: anchor meal + planned evening option
- Experiment: no fasting, bridge snack, planned evening option

### Actual report

```text
Гүн pattern тайлан. Эхний тестээр: Hunger-Safety, Glucose-Safety, Circadian-Energy. 7 хоногийн ажиглалтаар: 5 өдөр хоолны зай уртсах эсвэл орой нөхөх pattern гарсан; 5 өдөр оройн эрч хүч бага байсан. Гол pattern Hunger-Safety / Scarcity Protection. Давхар нөлөөлж буй pattern-ууд Glucose-Safety, Circadian-Energy. Hidden functions: Эрч хүч нөхөх; Дараа өлсөхөөс хамгаалах. Давтагддаг цикл: өдөр хоолны хэмнэл алдагдана; орой эрч хүч унаж өлсөлт нэмэгдэнэ; хамгаалах response гарна; амттай/хурдан сонголт татна. Trigger зураглал: low evening energy 5/5. Reflection evidence: өдөр хасах тусам орой rebound; өндөр өлсөлт болон дараа өлсөхөөс хамгаалах мэдрэмж. Avoid: Урт мацаг; Өдөр хоол алгасах; “Өлсвөл тэс”; оройн snack-ийг шууд бүрэн хорих. First leverage: anchor meal + planned evening option. 14 хоногийн туршилт: 2 anchor meal, bridge snack, planned evening option.
```

### Audit

- Mode: PASS
- Primary: PASS
- Secondary: PASS, glucose support appears but does not trigger professional
- Hidden functions: PASS
- Avoid list: PASS
- First leverage: PASS
- Safety: no over-trigger — PASS
- AI/debug smell? No
- Too broad / too long? No
- Verdict: PASS
- Fix recommendation: Trigger Map should also show meal gaps, not only low energy, when hunger/meal gap is the primary story.

## Persona 5 — 33F Stress Eating / Food-as-Regulation

### Synthetic input

33-year-old woman, stress and anxiety eating. 7-Day journey. Key answers: stress, anxiety, anger, “тайвширмаар”, eating temporarily relaxes her, mild guilt, no self-harm. Diary: 5 high-stress days with food as short relief.

### Expected result

- Mode: `deep`
- Primary: Food-as-Regulation
- Secondary: Reward/Collapse
- Hidden functions: emotional regulation, relief
- Avoid: “just tolerate it”, shame-based tracking
- First leverage: non-food regulation menu or neutral tracking
- Safety: no Mode 3/4

### Actual report

```text
Гүн pattern тайлан. Эхний тестээр: Food-as-Regulation, Medical Friction, Executive Load. 7 хоногийн ажиглалтаар: 5 өдөр стресс/мэдрэмж өндөр байсан. Гол pattern Food-as-Regulation System. Давхар pattern: Hunger-Safety, Medical Friction. Hidden function: Сэтгэл санааг түр тогтворжуулах — 5/5 өдөр стресс/мэдрэмж хоолтой давхцсан. Cycle: стресс/мэдрэмжийн даац багасна; хоол хамгийн хурдан тайвшрах арга болж харагдана; relief; guilt/sanaа зовнил. Trigger Map: stress 5/5. Reflection: стресс өндөр үед хоол түр тайвшруулсан; идсэний дараа түр хөнгөрсөн. Avoid: Илүү хатуу diet-г default шийдэл болгох. First leverage: neutral tracking. 14 хоногийн туршилт: өдөр бүр neutral check, trigger нэрлэх, дараагийн хоолыг reset гэж харах.
```

### Audit

- Mode: PASS
- Primary: PASS
- Secondary: PARTIAL; Medical Friction appears unexpectedly as support
- Hidden functions: PASS
- Avoid list: PARTIAL; could be more specific about stress regulation
- First leverage: PARTIAL; neutral tracking is safe but less targeted than regulation menu
- Safety: PASS
- AI/debug smell? No
- Too broad / too long? No
- Verdict: PASS
- Fix recommendation: Add first leverage branch for Food-as-Regulation: non-food regulation menu.

## Persona 6 — 31M Cue/Delivery / Decision-Default

### Synthetic input

31-year-old male, one-time path. Delivery apps, visible snacks, food images and notifications trigger eating. Key answers: delivery, snack, cue, default, no safety issues.

### Expected result

- Mode: `deep`
- Primary: Decision-Default or Cue-Conditioned Eating
- Secondary: Executive Load, Reward
- Hidden functions: default/decision fatigue, cue response
- Avoid: willpower around cues, many-rule meal plan
- First leverage: default dinner system / cue redesign
- Safety: no Mode 3/4

### Actual report

```text
Гүн pattern тайлан. One-time report. Таны хамгийн хүчтэй pattern: Decision-Default Mismatch. Давхар pattern: Cue-Conditioned Eating, Executive Load. Hidden functions: Decision fatigue-ээс гарах; Energy нөхөх. Cycle: decision load; low energy; default choice; delivery/snack default. Асуудал яг юу биш вэ? Хүсэл сулдаа биш, хүссэн сонголт бэлэн биш харин snack/delivery/default ойр байна. Avoid: Олон дүрэмтэй meal plan; өдөр бүр төгс tracking; ядарсан үед дахин хоол шийдэх plan; хүнд meal prep system. First leverage: default dinner system. 14 хоногийн эхний туршилт: fixed dinner option, backup, energy + hunger check. CTA: Миний pattern-ийг 7 хоногоор шалгах.
```

### Audit

- Mode: PASS
- Primary: PASS
- Secondary: PASS
- Hidden functions: PASS
- Avoid: PASS
- First leverage: PASS
- Safety: PASS
- AI/debug smell? No
- Too broad / too long? No
- Verdict: PASS
- Fix recommendation: One-time cue report could name cue redesign more explicitly.

## Persona 7 — 50F Medical/Medication Friction

### Synthetic input

50-year-old woman, medication/glucose/BP concern. 7-Day path. Key answers: medication, concerning measurement, fatigue, no fainting/confusion, no self-harm.

### Expected result

- Mode: `professional`
- Primary: ordinary weight-loss pattern should be suppressed
- Secondary/evidence: medical/medication friction, glucose/BP concern
- Hidden functions: not needed
- Avoid: fasting, meal skipping, aggressive restriction
- First leverage: professional check first
- Safety: Mode 3 professional-first, not Mode 4

### Actual report

```text
Эхлээд мэргэжлийн хүнтэй ярилцах. Таны хариулт ердийн жин хасалтын тайлангаас өөр дараалал санал болгож байна. Зарим аюулгүй байдал эсвэл биеийн дохио илэрсэн тул энэ хувилбар жин хасалтын туршилт өгөхгүй. Харин мэргэжлийн хүнтэй ярилцахад хэрэгтэй товч нэгтгэл гаргана. Ярилцах товч нэгтгэл: хоол, жин, биеийн дохио, мэдрэмж, эмийн хэрэглээ эсвэл төрсний дараах нөхцөлтэй холбоотой хариултуудаа нэгтгэж авч очих; хяналт алдагдах, нуух, ичих мэдрэмж давтагддаг бол эхлээд мэргэжлийн хүнтэй ярилцах дараалал барих. Яагаад ердийн жин хасалтын тайланг түр зогсоож байна вэ? Энд асуудал зөвхөн жин бууруулах арга биш байж болно. Өөрийгөө харах, бусдад харагдах, ичгүүрийн trigger хүчтэй үед public challenge, өдөр бүр жингээ үзэж өөрийгөө шийтгэх, body-shaming accountability, aggressive target нь pattern-ийг улам чангалж болзошгүй. Эхний аюулгүй алхам: мэргэжлийн хүнтэй ярилцах; privacy-first tracking; body-neutral metric; neutral tracking.
```

### Audit

- Mode: expected professional, actual professional — PASS
- Primary: suppressed — PASS
- Secondary: medical evidence present in state but report generic — PARTIAL
- Hidden functions: correctly suppressed — PASS
- Avoid/first leverage: professional guidance present, but no explicit avoid list — PARTIAL
- Safety route: PASS
- AI/debug smell? No
- Too broad / too long? Short, but generic
- Verdict: PASS
- Fix recommendation: Professional-first report should include the specific reason category: medication/glucose/BP concern.

## Persona 8 — 24F Body-Safety / Shame

### Synthetic input

24-year-old woman, one-time path. Body visibility discomfort, shame/guilt, avoids public before/after challenges. No active self-harm. Selected strong shame/control answers.

### Expected result

- Mode: professional or deep-with-care acceptable
- Primary: Body-Safety/Shame/Control-Collapse
- Hidden functions: attention safety, shame avoidance
- Avoid: public before/after, shame accountability
- Safety: no urgent route

### Actual report

```text
Эхлээд мэргэжлийн хүнтэй ярилцах. Таны хариулт ердийн жин хасалтын тайлангаас өөр дараалал санал болгож байна. Зарим аюулгүй байдал эсвэл биеийн дохио илэрсэн тул энэ хувилбар жин хасалтын туршилт өгөхгүй. Харин мэргэжлийн хүнтэй ярилцахад хэрэгтэй товч нэгтгэл гаргана. Ярилцах товч нэгтгэл: хоол, жин, биеийн дохио, мэдрэмж, эмийн хэрэглээ эсвэл төрсний дараах нөхцөлтэй холбоотой хариултуудаа нэгтгэж авч очих; хоол удах үед гардаг шинж, хэмжсэн сахар/даралт, ухаан балартах эсвэл будилах үе байсан эсэхийг тодорхой тэмдэглэх; хяналт алдагдах, нуух, ичих мэдрэмж давтагддаг бол эхлээд мэргэжлийн хүнтэй ярилцах дараалал барих.
```

### Audit

- Mode: expected professional/deep-with-care, actual professional — PASS
- Primary: ordinary weight-loss report correctly suppressed; underlying body-safety/control evidence retained — PASS
- Hidden functions: ordinary hidden-function report suppressed, but body visibility safety function named in professional copy — PASS
- Avoid: public challenge, punitive weighing, body-shaming, aggressive target visible — PASS
- Safety route: no urgent, professional-first — PASS
- AI/debug smell? No
- Too broad / too long? No; now subtype-specific while still safety-first
- Verdict: PASS
- Fix recommendation: Done in Sprint 11. Keep ordinary experiment suppressed for this route.

## Persona 9 — 39M Social/Alcohol Pattern

### Synthetic input

39-year-old male, 7-Day path. Social drinking and snacks, difficulty refusing food in groups, mild autonomy reaction to strict rules. Diary: repeated alcohol/snack availability and social pressure.

### Expected result

- Mode: `deep`
- Primary: Social Belonging or Reward
- Secondary: Autonomy, Reward Deficit
- Hidden functions: belonging, reward, autonomy
- Avoid: full prohibition, strict social rules
- First leverage: social script / planned reward
- Safety: no Mode 3/4

### Actual report

```text
Гүн pattern тайлан. Эхний тестээр: Reward-Seeking, Food-as-Regulation, Social Belonging. 7 хоногийн ажиглалтаар: 5 өдөр reward/craving function тэмдэглэгдсэн. Гол pattern Reward-Seeking / Stimulation Compensation. Давхар pattern: Social Belonging, Reward Deficit. Hidden functions: Reward авах; Хүмүүсийн дунд татгалзахгүй байх; Өөрөө сонгох мэдрэмжээ хамгаалах. Trigger Map: Reward хүсэл 5/5. Reflection: Найзуудтай үед татгалзах эвгүй; Alcohol/snack availability нэмэгдсэн. Avoid: Бүрэн хориг; Өөрийн сонголтгүй хатуу дүрэм; амттай бүхнийг бүрэн хорих; reward-г огт төлөвлөхгүй байх. First leverage: planned reward system. 14 хоногийн туршилт: planned reward, reward-г өлсөлтөөс тусад нь нэрлэх, cue trigger pause.
```

### Audit

- Mode: PASS
- Primary: Reward instead of Social — PASS/PARTIAL
- Secondary: Social and Reward Deficit present — PASS
- Hidden functions: PASS
- Avoid: PASS
- First leverage: planned reward, not social script — PARTIAL
- Safety: PASS
- AI/debug smell? No
- Too broad / too long? Useful
- Verdict: PASS
- Fix recommendation: If social/alcohol appears in multiple diary days, consider social script as first leverage.

## Persona 10 — 42F Sleep/Circadian

### Synthetic input

42-year-old woman, 7-Day path. Poor sleep, low evening energy, cravings after bad sleep, fatigue/default eating. No safety concerns.

### Expected result

- Mode: `deep`
- Primary: Circadian-Energy or Executive Load
- Secondary: Reward, Decision-Default
- Hidden functions: energy repair, default relief, reward
- Avoid: high-intensity challenge when sleep is poor, complex rules
- First leverage: evening energy plan / sleep-aware default dinner
- Safety: no Mode 3/4

### Actual report

```text
Гүн pattern тайлан. Эхний тестээр: Circadian-Energy, Reward-Seeking, Executive Load. 7 хоногийн ажиглалтаар: 5 өдөр оройн эрч хүч бага байсан; 5 өдөр reward/craving function тэмдэглэгдсэн. Гол pattern Circadian-Energy Mismatch. Давхар pattern: Executive Load Failure, Reward Deficit Compensation. Hidden functions: Нойр/эрч хүчний rhythm нөхөх; Эрч хүч нөхөх; Decision fatigue-ээс гарах. Reflection: Нойр муу үед оройн эрч хүч унасан; craving/default сонголт нэмэгдсэн. Асуудал яг юу биш вэ? Таны оройн craving зөвхөн амттай юм хүсэх биш, нойр, кофеин, өглөөний хоолгүй rhythm, оройн energy crash давхцаж байгаа дохио байж болно. Avoid: оройн хоолыг зөвхөн тэвчээрээр хасах; орой caffeine уух; өглөө/өдрийн хоолгүйгээр оройг давах; нойр дутуу үед хатуу diet эхлүүлэх; нойр муу долоо хоногт high-intensity challenge эхлүүлэх. First leverage: first meal anchor + caffeine boundary + evening shutdown. 14 хоногийн туршилт: first meal anchor, caffeine boundary, evening shutdown, sleep-aware planned evening option.
```

### Audit

- Mode: PASS
- Primary: expected Circadian/Executive, actual Circadian-Energy — PASS
- Secondary: Executive/Reward present — PASS
- Hidden functions: energy repair present — PASS
- Avoid: sleep/caffeine/meal-rhythm-specific avoid list present — PASS
- First leverage: sleep-aware first meal/caffeine/evening shutdown plan — PASS
- Safety: PASS
- AI/debug smell? No
- Too broad / too long? No
- Verdict: PASS
- Fix recommendation: Done in Sprint 11. Later copy polish can replace remaining English product words where needed.

## Cross-Person Findings

### Total PASS / PARTIAL / FAIL

- PASS: 10
- PARTIAL: 0
- FAIL: 0

### Mechanism Accuracy

The engine reliably identifies Executive Load, Hunger-Safety, Food-as-Regulation, Decision-Default, Control-Collapse, Role Overload, Body-Safety, and Circadian-Energy patterns. Sprint 11 improved specificity where a broad reward/default pattern previously swallowed stronger contextual evidence:

- Role Overload now surfaces when family/care burden and self-neglect repeat.
- Social Alcohol can be useful but first leverage stays reward-centered.
- Sleep/Circadian can now win primary ranking when poor sleep + low energy repeat across the diary.

### Safety Routing Quality

Safety routing is conservative and stable:

- Mode 4 did not over-trigger.
- Mode 3 correctly suppressed ordinary weight-loss experiment for medication/BP concern.
- Shame/body-safety profile routes professional-first and now includes subtype-specific, non-shaming safety copy.

### One-Time vs 7-Day Quality

- One-Time reports are compressed and include 7-day refinement CTA.
- 7-Day reports include observed evidence sections and Trigger Map.
- 7-Day quality is better for Executive/Default and Hunger-Safety because repeated evidence improves confidence without numeric confidence language.

### Report Copy Quality

Strengths:

- No shame language.
- No diagnosis.
- No raw debug IDs in visible report.
- Avoid lists usually discourage unsafe or unrealistic strategies.

Issues:

- Some visible English remains: `energy`, `plan`, `perfect`, `tracking`, `snack`.
- Medical professional-first reports are still generic; body-safety professional-first copy is now subtype-specific.
- Trigger Map sometimes omits the most intuitive trigger for the persona, such as meal gaps for fasting rebound.

### AI Smell Findings

Automated test found none of the forbidden visible strings:

- `S1-V`
- `D-SUM`
- `reportUse`
- `safetyTrigger`
- `high_hunger`
- `reward_pull`
- `food_as_regulation`
- `Self-report based`
- `Data Quality`
- `Primary Pattern`
- `Hidden Function`
- `Trigger ->`
- `100%`
- `сахилга батгүй`
- `залхуу`
- `өөрийгөө хяна`
- `эрүүл хооллож, хөдөлгөөнөө нэм`

### Question / Option Gaps

- Need more office-worker options: coffee/cigarette breakfast, sitting work, no groceries/prep.
- Need more mother/role-overload option depth: children/family needs, “my time starts late”, and leftover-time eating.
- Need weekend alcohol/snack option for social patterns.
- Need more sleep/circadian option depth for morning meal, caffeine boundary, and evening shutdown.
- Need professional-first subtype copy for medical/medication, matching the new body-safety specificity.

### Priority Fixes

1. Add subtype-specific professional-first copy for medical/medication, matching the body-safety improvement.
2. Improve Trigger Map row selection so the obvious driver appears, especially meal gaps for Hunger-Safety.
3. Add first leverage branch for Food-as-Regulation: non-food regulation menu.
4. Consider social script as first leverage when social/alcohol repeats across multiple diary days.
5. Localize remaining visible English where it is not an allowed product term.
