# Human-Like Virtual User QA — 45M Office Worker

## 1. Persona Profile

**Name:** Бат-Эрдэнэ
**Age:** 45
**Sex:** Male / Эрэгтэй
**Height:** 171 см
**Weight:** 85 кг
**Target weight:** 76-78 кг
**Occupation:** Office worker, mostly sitting
**Lifestyle notes:** 8-12 cigarettes/day, alcohol once per week, usually Friday/Saturday, low weekday movement, occasional short walking
**Sleep:** 5.5-6.5 hours on weekdays, inconsistent; worse after alcohol

**Main complaint**

- Wants to lose belly weight.
- Feels heavier and more tired.
- Often eats late after work.
- Knows what to do but does not sustain it.
- Snacks and alcohol appear on weekends.
- Does not track weight consistently.
- Does not want a strict diet.

## 2. Testing Purpose

This QA pass checks whether the MVP works for a realistic middle-aged male office worker, not just idealized test scenarios.

The tester should evaluate:

- Whether Бат-Эрдэнэ can answer each module without extra explanation.
- Whether the options fit his real life.
- Whether question copy feels natural in Mongolian.
- Whether the report identifies executive/default/circadian patterns without blaming him.
- Whether smoking/alcohol/BP signals stay proportionate and do not hijack the report.
- Whether the product avoids fasting, calorie targets, diagnosis, shame, and high-intensity exercise advice.

## 3. Recommended Journey

### Run 1 — One-Time Deep Assessment

Choose `Нэг удаагийн гүн зураглал`.

Use this run to test:

- question comprehension
- answer option fit
- compressed one-time report quality
- 7-day refinement CTA
- whether the first report overgeneralizes from one-time answers

### Run 2 — Optional 7-Day Deep Assessment

Choose `7 хоногийн гүн зураглал`.

Use the same setup pattern, then enter 5 diary days. This run checks whether observed daily data strengthens:

- Executive Load Failure
- Decision-Default Mismatch
- Circadian-Energy Mismatch
- Reward Deficit or Social Belonging as secondary

## 4. Comprehension Rubric

After each module, record:

- Did the virtual user understand the question immediately?
- Was any wording awkward?
- Was any English term unnecessary?
- Did answer options fit this persona?
- Was an important option missing?
- Did any question feel judgmental?
- Did any safety question feel scary or unclear?

Scale:

- `5` = very clear
- `4` = clear but could be smoother
- `3` = understandable but awkward
- `2` = confusing
- `1` = not understandable

Template:

| Module | Comprehension score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
|  |  |  |  |  |  |

## 5. One-Time Suggested Answers By Module

### Basic Context

| Item | Suggested answer |
|---|---|
| Age | `45` |
| Sex | `Эрэгтэй` |
| Height | `171` |
| Current weight | `85` |
| Target weight | `76` or `78` |
| Goal reason | `Эрүүл мэнд`, `Энерги`, `Хувцас`, `Гадаад төрх`, plus belly-weight note if free text appears |

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Basic context | 5 | None expected | `Гэдэс багасгах` could be explicit | Add `Гэдэс/бэлхүүс багасгах` if goal options expand later | Male office-worker goal may be more belly/energy than appearance. |

### Weight Trajectory

Suggested answers:

- Last 12 months: `4-7 кг нэмсэн`
- Linked events: `Ажил-стресс`, `Хөдөлгөөн багассан`, `Нойр муудсан`
- Add in reflection if available: weight increased slowly over 2-3 years; weekend alcohol/snacks contribute.

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Weight trajectory | 4 | `trajectory` is not shown, but concept may still feel abstract | `Оффисын суудалтай ажил`, `Баасан/амралтын alcohol/snack` | “Сүүлийн 2-3 жилд жин нэмэгдэхэд юу хамгийн их нөлөөлсөн гэж бодож байна?” | Current options fit, but office-work and weekend pattern could be more visible. |

### Previous Attempts

Suggested answers:

- Tried: `Ерөнхийдөө бага идэх`, `Орой хоол идэхгүй`, `Фитнес challenge`
- Failed after: busy workdays, weekends, Friday/Saturday alcohol/snacks
- Slip thought: `Өнөөдөр алдсан, маргаашаас`
- Emotional tone: mild disappointment, not severe shame

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Past attempts | 4 | `challenge`, `plan`, `collapse` may feel slightly English-heavy | `Ажлын дараа ядраад больдог`, `Амралтын өдөр алдагддаг` | “Аль үед таны өмнөх арга хамгийн их нурдаг байсан бэ?” | Good diagnostic module. Avoid making him feel lazy. |

### Meal Rhythm

Suggested answers:

- Breakfast: often skipped or coffee/cigarette only
- Lunch: inconsistent
- Meal gaps: `3-4`
- Evening eating increases after busy workday
- Late dinner sometimes

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Meal rhythm | 5 | None expected | `Өглөө кофе/тамхи л уудаг` | Add as option if more male office profiles are tested | This module should strongly support hunger plus executive/circadian patterns. |

### Hunger And Satiety

Suggested answers:

- Very hungry by evening
- Sometimes eats fast
- Notices fullness but continues if food/snack is available
- Sometimes confuses fatigue/craving with hunger

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Hunger and satiety | 4 | `craving` may be acceptable but still English | `Ядарснаа өлссөн гэж андуурдаг` | “Ядаргаа, craving, жинхэнэ өлсөлт хоорондоо холилдох үе байдаг уу?” | Good fit; should not overclassify as Hunger-Safety unless meal gaps dominate. |

### Hidden Function

Suggested answers:

- `Ядарсан`
- `Хамгийн амар сонголт хэрэгтэй`
- `Өөрийгөө шагнамаар`
- If allowed: `Хоол хараад идмээр болсон`

Voice/text reflection:

> Ажлын өдөр орой гэрт ирэхэд хоол хийх energy байдаггүй. Өдөр заримдаа кофе, тамхи, нэг хоолтой явчихдаг. Орой өлссөн, ядарсан үед delivery захиалах эсвэл гэрт байгаа амархан юм идэх нь хамгийн амар санагддаг. Баасан гаригт найзуудтай пиво уухаар snack нэмэгддэг.

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Hidden function | 4 | `function` concept is invisible but deep; `energy`, `delivery`, `snack` are English | `Ажлаас ирээд хоол хийх тэнхэлгүй`, `Баасан гаригийн пиво/snack` | “Тэр үед хоол танд яг ямар үүрэг гүйцэтгэдэг вэ?” | Strong module. Keep max choices to avoid noisy report. |

### Reward / Craving

Suggested answers:

- `7 хоногт хэд хэд` or `Бараг өдөр бүр`
- Related to: after work, taste, food cue/delivery, alcohol/weekend
- Satisfaction: short-lived

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Reward / craving | 4 | `craving`, `delivery`, `cue` are acceptable but English-heavy | `Пиво уух үед snack нэмэгддэг`, `TV/утас үзэх үед` | Add weekend/alcohol cue if question set expands | Should produce secondary Reward Deficit or Cue-Conditioned Eating, not primary unless answers are very reward-heavy. |

### Emotion / Regulation

Suggested answers:

- Stress/fatigue increases eating
- Eating gives short relaxation
- Guilt: mild/moderate, not severe
- Not primarily sadness/loneliness

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Emotion / regulation | 4 | `regulation` if visible would be abstract; current questions mostly understandable | `Зүгээр л тархи амрахгүй, хоол амар санагддаг` | “Идсэний дараа түр амарсан мэт болдог уу?” | Should not overpathologize. Avoid shame language. |

### Hunger-Safety

Suggested answers:

- Not strong fear of future hunger
- If skipped meals, overeats later
- Does not panic about portion reduction
- Could say: “өлсөөд байвал ажил хийж чадахгүй”

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Hunger-safety | 3 | “Дараа өлсөхөөс санаа зовох” may feel unusual to this persona | `Өлсөхөөр ажил хийхэд төвлөрөхгүй` | “Өлсөөд байвал ажил дээр төвлөрөхөд хэцүү санагддаг уу?” | Important not to make Hunger-Safety primary unless he selects stronger fear/protection options. |

### Restriction Response

Suggested answers:

- Strict no-dinner rule fails
- Too many rules feel annoying
- One weekend slip can derail the week
- Not extreme rebellion

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Restriction response | 4 | `collapse`/`plan` terms may feel English if visible | `Амралтын өдөр алдагдаад 7 хоног сулрах` | “Нэг удаа алдагдвал дараагийн хэдэн өдөр үргэлжлүүлэхэд хэцүү болдог уу?” | Control-Collapse can be secondary only if selected strongly. |

### Executive / Default

Suggested answers:

- Knows what to do but tired
- No prepared food at home
- `Delivery`, `Snack`, `Гэрт байсан амар сонголт`
- Groceries not planned
- Family meals may shape choices

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Executive / default | 5 | `default` is allowed and useful | `Гэр бүлийн хоол`, `Хүнсний юм аваагүй байдаг` | Add family/grocery-prep option later | This should be the strongest one-time mechanism. |

### Sleep / Energy

Suggested answers:

- Sleep: `4-6 цаг` or `Тогтворгүй`
- Cravings worse when sleep poor
- Evening energy: 3-4/10 if asked in diary
- Coffee high
- Sleep poor after alcohol

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Sleep / energy | 4 | `energy` appears often; acceptable but could be `эрч хүч` | `Архи уусан шөнө нойр мууддаг`, `кофе их уудаг` | Add alcohol/sleep follow-up only if not too long | Should support Circadian-Energy Mismatch as secondary. |

### Body / Medical

Suggested answers:

- Smokes 8-12 cigarettes/day if free text appears
- Alcohol once per week
- BP not checked recently or sometimes high-normal
- No chest pain
- No fainting/confusion
- No measured low glucose
- No insulin/sugar meds
- Maybe winded climbing stairs
- No urgent symptoms

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Body / medical | 4 | `сахар бууруулах эм` clear; BP may need more everyday wording | `Даралт хааяа өндөр гардаг`, `тамхи татдаг`, `шат өгсөхөд амьсгааддаг` | “Даралт хэмжихэд санаа зовоосон тохиолдол байсан уу?” is good; add smoking only if safety scope expands | Mode 2 soft check acceptable if BP concern selected; Mode 3 should not trigger. |

### Safety

Suggested answers:

- No self-harm
- No vomiting/laxative/compensatory behavior
- No severe binge secrecy
- No active dangerous medical symptoms

Comprehension check:

| Module | Score | Confusing wording | Missing option | Suggested rewrite | Notes |
|---|---:|---|---|---|---|
| Safety | 4 | Safety questions may feel serious but clear | None | Keep calm wording and “онош тавихгүй” framing nearby | Must not trigger Mode 4. Must not feel scary or accusatory. |

## 6. Expected One-Time Report Output

Acceptable primary mechanisms:

- `Executive Load Failure`
- `Decision-Default Mismatch`
- `Circadian-Energy Mismatch`

Acceptable secondary mechanisms:

- `Reward Deficit Compensation`
- `Cue-Conditioned Automatic Eating`
- `Social Belonging Food Pattern`
- `Control-Collapse Cycle` only if strict-diet/weekend-slip answers are selected strongly

Expected hidden functions, max 3:

- `Decision fatigue-ээс гарах`
- `Эрч хүч нөхөх`
- `Өдрийн төгсгөлд reward авах`
- Optional: social/weekend belonging if alcohol/social answers are strong

Expected avoid list:

- олон дүрэмтэй meal plan
- оройн хоолыг шууд бүрэн хорих
- өдөр хоол алгасаад орой тэсэх
- weekend alcohol/snack-г “зүгээр боль” гэж шийдэх
- willpower-аар delivery/snack cue-тэй тэмцэх
- fasting recommendation must not appear

Expected first leverage:

- default dinner system
- fixed weekday meal rhythm
- planned evening option
- weekend alcohol/snack boundary

Expected 14-day starter experiment:

- 2 fixed emergency dinners
- lunch/anchor meal
- delivery friction
- alcohol day pre-meal or snack boundary
- evening energy tracking

Expected one-time report should not:

- diagnose him
- say he is lazy or undisciplined
- over-trigger professional-first
- make smoking/alcohol the whole report
- show raw tags/debug IDs
- recommend fasting
- recommend high-intensity exercise
- give calorie target
- show too many hidden functions

## 7. Optional 7-Day Diary Scenario

### Day 1

- Skipped breakfast, late lunch
- Evening hunger: 8/10
- Energy: 3/10
- Delivery/default
- Function: easiest option + hunger + reward
- Reflection: “Өдөр кофе, тамхи, орой өлсөөд delivery хамгийн амар санагдсан.”

### Day 2

- Stable lunch
- No unplanned eating
- Energy: 5/10
- What helped: lunch and food at home
- Reflection: “Өдөр хоолоо идсэн болохоор орой арай тайван байсан.”

### Day 3

- Poor sleep
- Coffee, cigarettes, delayed meal
- Evening snack with TV/phone
- Function: fatigue + reward
- Reflection: “Нойр муу, орой юм идээд утсаа үзэхэд амарч байгаа юм шиг санагдсан.”

### Day 4

- Friday alcohol
- Beer + salty snacks
- Social pressure / easy availability
- Sleep poor
- Reflection: “Найзуудтай пиво уухад snack автоматаар нэмэгдсэн.”

### Day 5

- Busy workday
- No prep at home
- Delivery
- Function: easiest option + no mental energy
- Reflection: “Ажлын дараа хоол хийх тэнхэлгүй, гэрт бэлэн юм байгаагүй.”

## 8. Expected 7-Day Report Output

Expected primary:

- `Executive Load Failure`
- `Decision-Default Mismatch`

Expected secondary:

- `Circadian-Energy Mismatch`
- `Reward Deficit Compensation`
- `Social Belonging Food Pattern`, if Friday alcohol/snack day is entered strongly

Trigger Map should show:

- low evening energy
- meal gaps
- delivery/default
- poor sleep
- alcohol/social snack if entered

Expected first leverage:

- default dinner system
- anchor lunch
- weekend alcohol/snack boundary

Expected experiment:

- no fasting
- no calorie target
- no high-intensity exercise
- focus on emergency dinners, anchor lunch, delivery friction, Friday boundary, evening energy tracking

## 9. Red Flags / Fail Conditions

Fail the QA pass if any of these occur:

- Mode 4 urgent safety appears.
- Mode 3 professional-first appears without severe body/safety symptoms.
- Report diagnoses him or implies medical certainty.
- Report says or implies he is lazy, weak, or undisciplined.
- Smoking/alcohol becomes the whole report.
- Fasting, meal skipping, high-intensity exercise, or calorie target is recommended.
- Raw tags/debug IDs appear.
- One-time report shows too many hidden functions.
- Report ignores executive/default/circadian evidence.
- 7-day report lacks Trigger Map.
- 7-day report lacks a 14-day experiment when 5 diary entries are present and no Mode 3/4 route is triggered.

## 10. Notes For Copy Improvement

Potential copy improvements found during this virtual pass:

- Add `Гэдэс/бэлхүүс багасгах` as a goal option for male office-worker users.
- Add an option for `Өглөө кофе/тамхи л уудаг` in meal rhythm or context if smoking remains in product scope.
- Add `Ажлын дараа хоол хийх тэнхэлгүй` as a plain-language executive/default option.
- Add `Амралтын өдөр alcohol/snack алдагддаг` as a past-attempt or reward/cue option.
- Consider replacing visible `energy` with `эрч хүч` wherever it is not an allowed product term.
- Keep `default`, `trigger`, `reward`, `leverage point`, and `diary` because they are product vocabulary, but avoid piling too many in one sentence.
- Safety questions are clear enough, but keep them calm and non-alarming.

## 11. QA Result Summary Form

| Run | Completed? | Report mode | Primary result | Secondary result | Comprehension average | Main confusion | Fail conditions found | Priority fix |
|---|---|---|---|---|---:|---|---|---|
| One-Time |  |  |  |  |  |  |  |  |
| 7-Day / 5 entries |  |  |  |  |  |  |  |  |

Recommended pass criteria:

- One-Time report primary is Executive Load, Decision-Default, or Circadian-Energy.
- 7-Day report primary is Executive Load or Decision-Default.
- Average comprehension score is at least `4.0`.
- No fail condition appears.
- At least one actionable copy improvement is captured.

## 12. Dry-Run Evidence From Current Engine

This dry-run seeded Бат-Эрдэнэ-style answers directly into the current scoring/report engine. It is not a browser UX test, but it checks whether the current logic routes the persona into the expected report family.

| Run | Report mode | Top ranked mechanisms | Key checks |
|---|---|---|---|
| One-Time | `deep` | `Executive Load Failure`, `Reward-Seeking / Stimulation Compensation`, `Circadian-Energy Mismatch` | 14-day starter experiment present; no raw debug IDs; no urgent/professional-first route. |
| 7-Day / 5 entries | `deep` | `Executive Load Failure`, `Decision-Default Mismatch`, `Hunger-Safety / Scarcity Protection`, `Reward-Seeking / Stimulation Compensation` | Trigger зураглал present; 14 хоногийн туршилт present; no urgent route; no raw diary text/debug IDs. |

Interpretation:

- The current engine correctly prioritizes Executive Load / Decision-Default for the 7-day version.
- One-Time is acceptable: Executive Load is primary, while reward/circadian appear as secondary signals.
- Hunger-Safety can rise in the 7-day result because skipped breakfast, long meal gaps, and evening hunger are part of the persona. This is acceptable as long as the first leverage remains default dinner / anchor lunch rather than fasting.
- If the browser UX pass later shows Mode 3/4, diagnosis language, fasting recommendation, calorie target, or shame language, treat that as a fail condition even if this dry-run passes.
