# Work Pack 6 Owner Review Pack

## Recommendation Enum

READY FOR OWNER REVIEW OF COPY ARCHITECTURE

## Repository State

### git status --short

```text
?? audits/mvp-diagnostic-migration/work-pack-6/
?? audits/sprint-36-paid-depth-prototype/
```

### git diff --stat

```text
```

### git diff -- app.js index.html styles.css mockBackend.js package.json _redirects

```text
```

## Validation Commands and Results

```text
git status --short: PASS (WP6 docs untracked; unrelated audits/sprint-36-paid-depth-prototype/ also untracked)
git diff --check: PASS
node --check app.js: PASS
node --check tests/driver-stack/driverStackReportObject.mjs: PASS
node tests/driver-stack/driverStackReportObject.test.js: PASS (driverStackReportObject tests passed)
node tests/driver-stack/driverStackContract.test.js: PASS (driverStackContract tests passed)
node tests/driver-stack/driverStackFixtures.test.js: PASS (driverStackFixtures tests passed)
node tests/driver-stack/driverStackSafetyInvariants.test.js: PASS (driverStackSafetyInvariants tests passed)
npm test: PASS (All tests passed)
git diff -- app.js index.html styles.css mockBackend.js package.json _redirects: PASS (empty diff)
```

## Changed Files List

```text
audits/mvp-diagnostic-migration/work-pack-6/OWNER_REVIEW_PACK_WP6.md
audits/mvp-diagnostic-migration/work-pack-6/copy-architecture-principles.md
audits/mvp-diagnostic-migration/work-pack-6/key-to-mongolian-copy-map.md
audits/mvp-diagnostic-migration/work-pack-6/report-section-template-architecture.md
audits/mvp-diagnostic-migration/work-pack-6/fixture-copy-architecture-samples.md
audits/mvp-diagnostic-migration/work-pack-6/professional-first-copy-rules.md
audits/mvp-diagnostic-migration/work-pack-6/copy-risk-register.md
audits/mvp-diagnostic-migration/work-pack-6/work-pack-6-recommendation.md
```

## Explicit Confirmation

- No runtime changes
- No app.js changes
- No scoring/fixture changes
- No WP4 report object contract changes
- No production report rendering changes
- No PDF generated
- No deploy
- QPay/backend/payment/pricing/entitlement unchanged

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-6/copy-architecture-principles.md

# Work Pack 6 Copy Architecture Principles

## Purpose

This document defines a test-only Mongolian copy architecture for future report rendering from the WP4 report object. It does not integrate with runtime, does not rewrite production report copy, does not change scoring, and does not change fixture behavior.

The purpose is to make the future report feel human, specific, and safe while preserving the driver-stack structure proven in WP3/WP4 and reviewed in WP5.

## Product thesis

One user is not one type.

One user has a driver stack.

Weight-loss difficulty is not simply discipline failure. The report should help the user see how body rhythm, psychology, food function, habit loops, environment, restriction/rebound, shame/body image, and safety signals can overlap in one person.

The user should finish the report thinking: "Энэ намайг буруутгаагүй. Миний яг гацдаг мөчийг ойлгож байна. Эхлэх нэг жижиг алхам байна."

## Tone rules

- Warm: write like a careful human guide, not a scoring system.
- Precise: name the visible pattern and hidden function clearly.
- Body-neutral: do not judge body shape, size, appetite, or weight change.
- Non-shaming: do not imply weakness, laziness, failure, or lack of character.
- Non-diagnostic: do not claim medical causes as fact.
- No fear pressure: safety copy should be calm and direct.
- No aggressive diet framing: do not push restriction, punishment, or rapid control.
- No AI-generic motivational language: avoid vague encouragement such as "та чадна" unless tied to a specific next step.

## Forbidden copy patterns

Do not use these patterns in user-facing report copy:

- "та сахилгагүй"
- "та буруу хийсэн"
- "заавал жин хас"
- "хатуу дэглэм"
- "илүү чанга барих"
- "онош"
- "эмчилгээ"
- "даавар чинь..."
- "эмнээс болсон"
- "глюкозоос болсон"
- "PCOS-оос болсон"

Also avoid equivalent softened versions that still imply blame or diagnosis, such as "өөрийгөө илүү сайн барих хэрэгтэй", "асуудал таны хоолны сонголтод байна", or "энэ нь заавал эрүүл мэндийн шалтгаантай".

## Required copy pattern

Every ordinary report section should follow this order:

1. Show the visible thing.
2. Show the hidden driver stack.
3. Explain why self-blame is incomplete.
4. Give one gentle next step.
5. Frame the 14-day experiment as a test, not a command.
6. Keep professional-first safety separate and unblocked.

This pattern is required because the report should not collapse the person into one type. It should show a stack: visible condition, secondary drivers, vulnerable moment, hidden food function, wrong self-explanation, first gentle change, 14-day test, and 7-day confirmation.

## WP4 field to user-facing section architecture

| WP4 field | Future user-facing section | Copy job |
| --- | --- | --- |
| `visibleCondition` | Ил харагдаж байгаа зүйл | Say what the user can likely notice in ordinary life, without blame. |
| `secondaryDrivers` | Цаана нь давхар ажиллаж байгаа зүйл | Show the stack: body, emotion, environment, restriction, or social context can overlap. |
| `vulnerableMoment` | Эмзэг мөч | Name the specific moment where the pattern becomes easiest to repeat. |
| `hiddenFoodFunction` | Хоолны далд үүрэг | Explain what food may be doing for the user besides taste or hunger. |
| `wrongSelfExplanation` | Буруу өөр тайлбар | Gently challenge self-blame or over-simple explanations. |
| `firstGentleChange` | Эхний зөөлөн өөрчлөлт | Offer one small change that lowers friction. |
| `fourteenDayExperiment` | 14 хоногийн туршилтын таамаг | Frame the next step as a low-pressure test. |
| `sevenDayDiaryConfirmation` | 7 хоногийн баталгаажуулах тэмдэглэл | Tell the user what to observe, not what to judge. |
| `safetyBlock` | Аюулгүй байдлын чиглэл | Separate safety from ordinary advice; no diagnosis, no fear, no payment gate. |
| `evidenceExplanation` | Optional internal-to-user evidence summary | Use only selected plain-language evidence; never expose raw scoring or debug details. |
| `ownerReviewFlags` | Hidden | Never render to users. |

## Section copy templates

### Ил харагдаж байгаа зүйл

Template:

`Таны хариултаас хамгийн түрүүнд харагдаж байгаа зүйл бол <visible pattern>. Энэ нь таныг сахилгагүй гэсэн үг биш; өдөр тутмын хэмнэл, орчин, биеийн дохио, сэтгэлзүйн ачаалал давхар нөлөөлж байж болно.`

Copy rule: this section should make the user feel seen quickly. Do not start with a correction, warning, or advice.

### Цаана нь давхар ажиллаж байгаа зүйл

Template:

`Энэ нэг шалтгаантай биш харагдаж байна. <driver 1> дээр <driver 2> болон <driver 3> давхардахад сонголт хийх хүч багасаж, хамгийн ойрын амархан хувилбар илүү хүчтэй татдаг.`

Copy rule: use "давхардахад" and "нэг шалтгаантай биш" to protect the product thesis.

### Эмзэг мөч

Template:

`Таны хамгийн эмзэг мөч бол <moment>. Энэ үед асуудал хоолноос эхэлж байгаа юм шиг санагдавч үнэндээ өмнөх ачаалал, завсар, орчин, эсвэл сэтгэл хөдлөл аль хэдийн хуримтлагдсан байдаг.`

Copy rule: name a moment, not a personality.

### Хоолны далд үүрэг

Template:

`Энэ үед хоол зөвхөн өл дарах үүрэгтэй биш байж магадгүй. Энэ нь <hidden function> үүрэг гүйцэтгэж, таны системийг түр хугацаанд тогтворжуулах гэж оролдож байж болно.`

Copy rule: "байж магадгүй" is important. It avoids overclaiming.

### Буруу өөр тайлбар

Template:

`Үүнийг "би өөрийгөө барьж чаддаггүй" гэж тайлбарлах нь дутуу тайлбар болно. Илүү бодит тайлбар нь <stack explanation>.`

Copy rule: this section should reduce shame without excusing every behavior as fixed or hopeless.

### Эхний зөөлөн өөрчлөлт

Template:

`Эхний алхам нь бүх хоолоо өөрчлөх биш. Зөвхөн <one small action>-г туршаад, эмзэг мөчийн хүч бага зэрэг сулрах эсэхийг ажиглана.`

Copy rule: one change only. Do not add a diet plan.

### 14 хоногийн туршилтын таамаг

Template:

`Дараагийн 14 хоногт үүнийг тушаал биш, жижиг туршилт гэж үзнэ: хэрэв <small action> хийвэл <vulnerable moment> үед <expected signal> бага зэрэг өөрчлөгдөх эсэхийг шалгана.`

Copy rule: the experiment tests a hypothesis. It must not sound like a command or compliance check.

### 7 хоногийн баталгаажуулах тэмдэглэл

Template:

`Эхний 7 хоногт зөв буруу гэж дүгнэхгүй. Зөвхөн <signals to observe>-г тэмдэглэнэ. Энэ нь таны драйвер стек үнэхээр энэ чиглэлд ажиллаж байна уу гэдгийг баталгаажуулахад тусална.`

Copy rule: diary confirmation observes patterns; it does not grade the user.

### Аюулгүй байдлын чиглэл

Template:

`Энэ хэсэгт жирийн зан үйлийн туршилтаас өмнө мэргэжлийн хүнтэй ярилцах нь илүү зөв дараалал байж магадгүй. Энэ нь онош тавьж байгаа хэрэг биш, мөн таны буруу гэсэн үг биш. Биеийн өөрчлөлт, эм, эрүүл мэндийн дохио зэрэг зүйл байж болзошгүй үед эхлээд аюулгүй байдлыг тодруулах нь зөөлөн бөгөөд хариуцлагатай алхам.`

Copy rule: safety must not be blocked behind payment and must not diagnose medication, glucose, hormones, PCOS, or medical causes as fact.

## "Намайг ойлгож байна" design rules

1. Use concrete moments: "ээлжийн дараа", "орой өлсөх үед", "гэрээсээ ажиллахдаа ширээн дээр хоол харагдах үед".
2. Use stacked explanations: "энэ ганц хүсэл биш", "энэ дээр ядрал, орчин, сэтгэлзүйн сэргэлт давхардаж байна".
3. Use gentle uncertainty: "байж магадгүй", "харагдаж байна", "магадлалтай".
4. Use body-neutral wording: "биеийн дохио", "хэмнэл", "өлсөх аюулгүй мэдрэмж", not body blame.
5. Preserve agency: the first change is small, chosen, and testable.
6. Do not flatter generically. Specific recognition matters more than motivational copy.

## Safety and professional-first rules

- Professional-first copy must appear before any ordinary experiment copy.
- In professional-first mode, ordinary 14-day experiment copy must be suppressed.
- Safety copy must not require payment to reveal.
- Safety copy must not say "энэ эмнээс болсон", "глюкозоос болсон", "даавраас болсон", or "PCOS-оос болсон".
- Safety copy may say a professional check is the safer first order when body change, medication context, severe distress, or medical concern may be involved.
- Safety copy must be calm and short. It should not scare the user into action.

## Fixture copy readiness after translation

| Fixture | Copy readiness after translation | Reason |
| --- | --- | --- |
| `shift_work_recovery_only` | Copy-ready after translation | Structure is clear; keys need warm body-rhythm language. |
| `shift_work_loneliness_combo` | Copy-ready after translation | Strong driver-stack example; loneliness needs gentle private wording. |
| `remote_work_visible_snacks` | Copy-ready after translation | Environment and cue loop are clear. |
| `stress_delivery_app_comfort` | Copy-ready after translation | Stress, delivery friction, and decompression form a coherent report story. |
| `meal_gap_evening_hunger` | Copy-ready after translation | Body-rhythm chain and bridge-meal change are clear. |
| `all_or_nothing_restriction_rebound` | Needs structure decision | Hidden function may need more than `hunger_safety` to explain punishment/restart pressure. |
| `social_weekend_alcohol_monday_restart` | Copy-ready after translation | Belonging, social table, alcohol context, and Monday restart are coherent. |
| `body_shame_restriction` | Copy-ready after translation with safety-sensitive review | Structure is useful, but body shame copy needs extra care. |
| `pcos_body_uncertainty_control` | Needs structure decision | Ordinary-mode copy may need a medical-context bridge without diagnosing. |
| `medication_body_concern_professional_check` | Copy-ready after safety copy review | Safety routing is correct; professional-first language must replace raw keys. |

## Exact future runtime integration copy rules

Future runtime integration must follow these rules:

1. Never render internal keys directly in user-facing sections.
2. Never render `ownerReviewFlags`.
3. Never render raw debug fields, raw scores, or fixture names.
4. Always translate `visibleCondition`, `secondaryDrivers`, `vulnerableMoment`, `hiddenFoodFunction`, `wrongSelfExplanation`, `firstGentleChange`, `fourteenDayExperiment`, and `sevenDayDiaryConfirmation` through an approved copy layer.
5. Always preserve the driver-stack framing; do not convert the report into one type, one persona, or one route.
6. Always frame the first change as gentle and optional to test.
7. Always frame the 14-day experiment as a hypothesis, not a command.
8. Always frame the 7-day diary as observation, not judgment.
9. Always suppress ordinary experiment copy when `safetyBlock.professionalFirst` is true.
10. Always show professional-first safety copy without a payment gate.
11. Never claim medical cause as fact.
12. Never use shame, discipline failure, strict diet, or fear pressure as the explanation.
13. Do not integrate into runtime until the two structure-decision fixtures have owner approval.
14. Do not generate PDF from this architecture until production report copy is separately approved.

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-6/key-to-mongolian-copy-map.md

# Work Pack 6 Key to Mongolian Copy Map

This map translates internal driver keys and report-object IDs into future user-facing Mongolian copy directions. It is test-only documentation. It must not be treated as runtime code, scoring logic, or production report rendering.

| Internal key | User-facing Mongolian phrase | Explanation copy direction | Use in report? | Risk |
| --- | --- | --- | --- | --- |
| `shift_work` | ээлжийн ажил, тогтмол бус хэмнэл | Explain that irregular work rhythm can change hunger, energy, recovery, and decision friction. | Yes, translated | Can sound like an excuse or fixed fate if not paired with one small change. |
| `sleep_disruption` | нойр тасалдах, амралт дутуу байх | Connect poor sleep to appetite, energy, and self-regulation without blaming the user. | Yes, translated | Avoid implying the user simply needs to sleep earlier. |
| `meal_gap` | хоол хоорондын зай хэт урт болох | Name long gaps as a body-state driver that can make later choices harder. | Yes, translated | Avoid turning into rigid meal-plan advice. |
| `evening_hunger` | оройн хүчтэй өлсөлт | Explain evening hunger as a predictable signal after earlier gaps or fatigue. | Yes, translated | Avoid shaming night eating. |
| `fatigue` | ядаргаа, хүч сульдах | Show that fatigue reduces decision capacity and increases recovery-seeking. | Yes, translated | Avoid generic "амар" advice. |
| `body_change_uncertainty` | биеийн өөрчлөлтөд эргэлзэх, юу нөлөөлж байгааг мэдэхгүй байх | Use body-neutral wording; acknowledge uncertainty without diagnosis. | Yes, translated | Medical/body-image sensitivity is high. |
| `medical_concern` | эрүүл мэндийн дохиог тодруулах хэрэгцээ | Calmly direct toward professional clarification before ordinary interpretation. | Safety-copy only | Must not diagnose or create fear. |
| `stress` | стресс, дотоод ачаалал | Explain stress as a load that can make quick relief more attractive. | Yes, translated | Avoid overusing stress as a catch-all. |
| `anxiety` | түгшүүр, санаа зовнил | Frame as a state that can seek settling or certainty. | Yes, translated | Avoid diagnosis language. |
| `anger_resentment` | дотроо бухимдах, гомдох | Name carefully as unexpressed load, not a character flaw. | Yes, translated | Can feel accusatory if too blunt. |
| `loneliness` | ганцаардал, холбоо дутагдах мэдрэмж | Explain privately and gently as a need for connection. | Yes, translated | High shame risk if direct wording is harsh. |
| `emptiness` | хоосон мэдрэмж, дутуу санагдах | Use gentle uncertainty; connect to comfort-seeking without pathologizing. | Yes, translated | Can sound clinical if not softened. |
| `shame` | ичих, өөрийгөө буруутгах мэдрэмж | Describe shame as a painful state, not a truth about the user. | Yes, translated | High stigma risk. |
| `guilt` | гэмшил, буруу хийсэн мэт санагдах | Connect guilt to restart pressure or compensatory restriction. | Yes, translated | Can intensify self-blame if mishandled. |
| `loss_of_control_feeling` | хяналт алдагдсан мэт санагдах | Say "мэт санагдах" to keep it experiential. | Yes, translated | Avoid saying the user is out of control. |
| `quick_recovery` | хурдан сэргэх хэрэгцээ | Explain food as a quick way the body/mind tries to recover. | Yes, translated | Could sound like permission if not linked to first gentle change. |
| `decompression` | ачааллаа буулгах хэрэгцээ | Explain food/order/snacking as a decompression tool after pressure. | Yes, translated | Avoid making it sound purely emotional eating. |
| `comfort` | тайтгарах хэрэгцээ | Use warm language around comfort without moral judgment. | Yes, translated | Can sound vague if not tied to moment. |
| `self_reward` | өөртөө жижиг шагнал өгөх хэрэгцээ | Explain reward as a real need after effort or monotony. | Yes, translated | Avoid "treat yourself" diet culture tone. |
| `loneliness_soothing` | ганцаардлаа түр намжаах оролдлого | Connect food to soothing loneliness while preserving dignity. | Yes, translated | Must be private, gentle, and non-diagnostic. |
| `control_regain` | тогтвортой байдал, хяналтаа буцааж авах оролдлого | Explain control-seeking as understandable when the body feels unpredictable. | Yes, translated | Medical/body uncertainty risk if overclaimed. |
| `hunger_safety` | дараа нь хэт өлсөхөөс хамгаалах мэдрэмж | Explain that the system may be trying to prevent scarcity or strong hunger. | Yes, translated | Can sound abstract or clinical. |
| `belonging` | хамт байх, харьяалагдах мэдрэмж | Explain social eating as connection, not weakness. | Yes, translated | Avoid shaming family/social meals. |
| `escape_from_shame` | ичих мэдрэмжээс түр холдох оролдлого | Frame as escaping pain, not hiding failure. | Yes, translated | High shame sensitivity. |
| `escape_from_failure` | бүтэлгүйтсэн мэт мэдрэмжээс түр гарах оролдлого | Use for restart/rebound narratives when approved. | Yes, translated | Can sound blaming if "failure" is too direct. |
| `visible_snacks` | хоол нүдэнд байнга харагдах орчин | Explain environmental visibility and cue friction. | Yes, translated | Avoid making the user seem careless. |
| `delivery_app` | захиалгын апп хамгийн амархан сонголт болох | Explain convenience and timing, especially under stress/fatigue. | Yes, translated | Avoid blaming app use. |
| `nearby_store` | ойрхон дэлгүүр амархан татах | Describe availability and low friction. | Yes, translated | Could sound simplistic if not linked to moment. |
| `cafeteria` | ажил/сургуулийн хоолны орчин | Explain default food environment. | Yes, translated | Needs local context if used later. |
| `food_photo_cue` | хоолны зураг, контент хүслийг өдөөх | Explain visual cues as environmental triggers. | Yes, translated | Avoid implying weak willpower. |
| `social_table` | ширээний хамтын уур амьсгал | Explain social context and belonging pressure. | Yes, translated | Avoid criticizing culture/family. |
| `alcohol_context` | архи, уух орчинтой холбоотой сонголт | Explain lowered friction and social rhythm disruption. | Yes, translated | Avoid moralizing alcohol. |
| `low_friction_default` | хамгийн амархан, ойрхон сонголт автоматаар давамгайлах | Explain that the easiest option often wins under load. | Yes, translated | Phrase is abstract; must be concrete in final copy. |
| `all_or_nothing` | бүгдийг зөв хийх эсвэл бүр орхих маягийн сэтгэлгээ | Explain as a pattern that increases restart pressure. | Yes, translated | Avoid labeling the user as extreme. |
| `monday_restart` | Даваа гарагаас дахин эхлэх дарамт | Explain restart pressure and weekend rebound. | Yes, translated | Avoid mocking the pattern. |
| `strict_diet` | хэт чанга барих оролдлого | Explain restriction pressure without recommending it. | Yes, translated | Must not normalize strict dieting as the solution. |
| `fasting_rebound` | удаан хорьсны дараах буцаад хүчтэй татах хариу | Explain rebound after fasting/restriction. | Yes, translated | Avoid anti-fasting blanket claims. |
| `carb_cut_rebound` | нүүрс ус хэт хассаны дараах буцаад татах хариу | Explain as possible rebound, not a universal rule. | Yes, translated | Avoid nutrition prescription. |
| `punishment_restriction` | өөрийгөө шийтгэх маягаар хорих | Use carefully to explain shame/restriction loops. | Yes, translated with care | Very high shame risk. |
| `binge_risk` | хяналтгүй идэлт давтагдах эрсдэл | Use only in safety context with calm professional guidance. | Safety-copy only | Can scare or label the user. |
| `compensatory_behavior` | идсэнээ нөхөх гэж аюултай аргаар тэнцүүлэх оролдлого | Use only in safety context. | Safety-copy only | Requires careful professional-first handling. |
| `severe_body_distress` | биеийн талаар хүчтэй зовнил | Use only in safety context or soft safety note. | Safety-copy only | High stigma and distress risk. |
| `medical_red_flag` | эрүүл мэндийн дохиог эхэлж тодруулах шаардлага | Hide the key; render only calm safety copy. | Hidden from ordinary report | Must not appear literally. |
| `professional_first` | эхлээд мэргэжлийн хүнтэй ярилцах нь зөв дараалал | Render as safety direction, never as a routing label. | Safety-copy only | Must not be payment-gated. |
| `shift_work_recovery_only` | ээлжийн дараах сэргэлт хамгийн эмзэг мөч болох | Use as vulnerable-moment copy for shift recovery fixture. | Yes, translated | Must not render ID. |
| `shift_work_loneliness_combo` | ээлжийн дараах ядаргаа дээр ганцаардал давхардах мөч | Use as vulnerable-moment copy for shift plus loneliness. | Yes, translated | Loneliness wording must be gentle. |
| `cue_reward_low_friction_default` | нүдэнд харагдах хоол, жижиг шагнал, амархан сонголт давхардах мөч | Use for remote work visible snack cue loop. | Yes, translated | Long phrase; final copy should be concise. |
| `stress_delivery_app_comfort` | стрессийн дараа захиалгын апп хамгийн амархан тайвшрал болох мөч | Use for delivery-app stress loop. | Yes, translated | Avoid sounding like app blame. |
| `meal_gap_evening_hunger` | хоолны зай уртассаны дараах оройн хүчтэй өлсөх мөч | Use for body-rhythm hunger pattern. | Yes, translated | Avoid rigid eating schedule advice. |
| `all_or_nothing_punishment_restriction` | хэт чанга барьсны дараа өөрийгөө буруутган дахин эхлэх мөч | Needs owner structure decision before runtime. | Yes, after decision | Hidden function may need refinement. |
| `social_belonging_alcohol` | хамт олны ширээ, уух орчин, харьяалагдах хэрэгцээ давхардах мөч | Use for social weekend fixture. | Yes, translated | Avoid moralizing social life. |
| `body_shame_restriction` | биеийн өөрчлөлтөд санаа зовох үед ичих мэдрэмж, хорих оролдлого давхардах мөч | Use with body-neutral copy and soft safety review. | Yes, translated with care | High shame/body image sensitivity. |
| `pcos_body_uncertainty_control` | биеийн өөрчлөлт тодорхойгүй үед хяналтаа буцааж авах гэж оролдох мөч | Needs owner structure decision before runtime. | Yes, after decision | Must not imply PCOS caused the pattern. |
| `medical_first_body_signal` | зан үйлийн туршилтаас өмнө эрүүл мэндийн дохиог тодруулах хэрэгтэй мөч | Use only in professional-first safety copy. | Safety-copy only | Must not diagnose or frighten. |
| `shift_recovery_anchor` | ээлжийн дараах жижиг сэргэлтийн зангуу | First gentle change: set one predictable recovery anchor after shift. | Yes, translated | Needs concrete action in final copy. |
| `shift_recovery_connection_slot` | сэргэлт дээр жижиг холбоо нэмэх | First gentle change: add a low-pressure connection point after shift. | Yes, translated | Avoid making loneliness feel like a task. |
| `move_one_cue` | нэг л өдөөгчийг нүднээс холдуулах | First gentle change: move one visible cue, not redesign the whole environment. | Yes, translated | Keep it small. |
| `pre_delivery_decompression_pause` | захиалахаас өмнө ачаалал буулгах богино завсар | First gentle change: pause before delivery app choice to test decompression need. | Yes, translated | Avoid "just wait" tone. |
| `bridge_meal_before_evening` | оройн өмнөх жижиг гүүр хоол | First gentle change: add a small bridge before evening hunger peaks. | Yes, translated | Avoid diet-plan framing. |
| `next_meal_reset_rule` | дараагийн хоолоор зөөлөн дахин тэнцвэржих дүрэм | First gentle change for restriction/rebound; needs owner structure decision. | Yes, after decision | Can sound rule-heavy if not softened. |
| `social_choice_script` | хамт байхдаа өөрт тохирох нэг сонголтоо урьдчилж хэлэх өгүүлбэр | First gentle change for social table. | Yes, translated | Avoid awkward scripted feeling. |
| `body_neutral_private_tracking` | биеийг буруутгахгүй хувийн ажиглалт | First gentle change for body uncertainty/shame. | Yes, translated with care | Must avoid obsessive tracking. |
| `professional_discussion_summary` | мэргэжлийн хүнтэй ярилцахад хэрэгтэй товч тэмдэглэл | First professional-first step. | Safety-copy only | Must not imply ordinary experiment. |
| `not_lack_of_discipline` | энэ сахилгагүйдээ биш | Use to reduce self-blame. | Yes, translated | Must not sound dismissive of agency. |
| `willpower_only_is_incomplete` | зөвхөн тэвчээрийн асуудал гэж үзвэл дутуу тайлбар болно | Use to explain driver stack. | Yes, translated | Avoid sounding abstract. |
| `stricter_tomorrow_makes_it_worse` | маргааш илүү чанга барина гэж бодох нь дарамтыг нэмэгдүүлж болно | Use for Monday restart/social rebound. | Yes, translated | Avoid lecturing. |
| `body_blame_increases_avoidance` | биеэ буруутгах тусам ажиглахаас зайлсхийх нь нэмэгдэж болно | Use for body shame/uncertainty. | Yes, translated with care | Must be very gentle. |

## Translation rules

1. The `Internal key` column must never appear verbatim in user-facing report copy.
2. The `User-facing Mongolian phrase` column is a direction, not final production copy.
3. Use "байж магадгүй", "харагдаж байна", and "давхардаж байна" where certainty would overclaim.
4. Use "энэ таны буруу гэсэн үг биш" sparingly; too much reassurance can sound generic.
5. For safety keys, render a professional-first message instead of ordinary driver copy.
6. For body-image keys, use body-neutral wording and avoid appearance judgment.
7. For medical-context keys, never claim cause as fact.

## Fixture-level copy readiness notes

| Fixture | Copy map status | Owner action before runtime |
| --- | --- | --- |
| `shift_work_recovery_only` | Covered | Approve copy polish. |
| `shift_work_loneliness_combo` | Covered | Approve gentle loneliness wording. |
| `remote_work_visible_snacks` | Covered | Approve environment/cue wording. |
| `stress_delivery_app_comfort` | Covered | Approve stress/decompression wording. |
| `meal_gap_evening_hunger` | Covered | Approve hunger-safety wording. |
| `all_or_nothing_restriction_rebound` | Structure decision needed | Decide whether hidden food function should remain hunger safety or gain an additional relief/rebound narrative. |
| `social_weekend_alcohol_monday_restart` | Covered | Approve social belonging wording. |
| `body_shame_restriction` | Covered with care | Require body-neutral safety-sensitive review. |
| `pcos_body_uncertainty_control` | Structure decision needed | Decide how to bridge medical context without diagnosis. |
| `medication_body_concern_professional_check` | Covered as safety-copy only | Approve professional-first wording before runtime integration. |

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-6/report-section-template-architecture.md

# Work Pack 6 Report Section Template Architecture

# Жин хасалт яагаад гацаж байгаа вэ?

## 1. Ил харагдаж байгаа зүйл

- Source WP4 field: `visibleCondition`
- User-facing goal: Name the visible pattern the user can recognize without making it a character judgment.
- Copy formula: `Таны хариултаас <visible pattern> илүү тод харагдаж байна. Энэ нь таныг сахилгагүй гэсэн үг биш; <context> давхар нөлөөлж байж болно.`
- Example sentence pattern: `Таны хариултаас оройн хүчтэй өлсөлт илүү тод харагдаж байна. Энэ нь таныг өөрийгөө барьж чаддаггүй гэсэн үг биш; өдрийн хоолны зай, ядаргаа, сэргэлтийн хэрэгцээ давхар нөлөөлж байж болно.`
- What not to say: Do not say "та сахилгагүй", "та буруу хийсэн", or "өөрийгөө илүү сайн барих хэрэгтэй".
- Safety note if relevant: If the visible condition is medical/body-signal related, use uncertainty and point to the safety section instead of interpreting it as weight-loss behavior.

## 2. Цаана нь ажиллаж байгаа зүйл

- Source WP4 field: `secondaryDrivers`
- User-facing goal: Show the driver stack without reducing the user to one type.
- Copy formula: `<primary pattern> ганцаараа ажиллаж байгаа биш. Үүн дээр <secondary driver>, <secondary driver>, <secondary driver> давхардахад сонголт хийх хүч багасдаг.`
- Example sentence pattern: `Ээлжийн ажил ганцаараа ажиллаж байгаа биш. Үүн дээр ядаргаа тайлах хэрэгцээ, ганцаардал, тайтгарах хүсэл давхардахад хоол хамгийн ойрын сэргэлт шиг санагдаж болно.`
- What not to say: Do not list internal keys or call the user a type.
- Safety note if relevant: If secondary drivers include shame, body distress, or medical concern, write gently and avoid diagnostic labels.

## 3. Таны эмзэг мөч

- Source WP4 field: `vulnerableMoment`
- User-facing goal: Identify the specific moment where the pattern becomes easiest to repeat.
- Copy formula: `Таны эмзэг мөч бол <time/context/state>. Энэ үед <stack explanation> аль хэдийн хуримтлагдсан байдаг.`
- Example sentence pattern: `Таны эмзэг мөч бол орой гэртээ ирээд өлсөлт, ядаргаа хоёр зэрэг нэмэгдэх үе. Энэ үед асуудал хоолноос эхэлж байгаа юм шиг санагдавч өмнөх завсар аль хэдийн нөлөөлсөн байдаг.`
- What not to say: Do not say "та энэ үед сул байдаг" or "энэ бол таны муу зуршил".
- Safety note if relevant: Professional-first fixtures should name the moment as a signal to clarify with a professional, not as a behavior to experiment on.

## 4. Хоол таны хувьд ямар үүрэг гүйцэтгэж байна вэ?

- Source WP4 field: `hiddenFoodFunction`
- User-facing goal: Explain the hidden function of food without shaming the user.
- Copy formula: `Энэ үед хоол зөвхөн өл дарах биш, <hidden function> үүрэг гүйцэтгэж байж магадгүй.`
- Example sentence pattern: `Энэ үед хоол зөвхөн өл дарах биш, хурдан тайвширч сэргэх үүрэг гүйцэтгэж байж магадгүй.`
- What not to say: Do not say "та хоолоор асуудлаа дардаг" or "хоолонд донтсон".
- Safety note if relevant: For hunger safety, explain it as the body trying to prevent strong hunger, not as danger.

## 5. Яагаад “сахилгагүй байна” гэдэг тайлбар дутуу вэ?

- Source WP4 field: `wrongSelfExplanation`
- User-facing goal: Gently replace self-blame with a more accurate driver-stack explanation.
- Copy formula: `"Би сахилгагүй" гэж тайлбарлах нь дутуу. Илүү бодит тайлбар нь <driver stack explanation>.`
- Example sentence pattern: `"Би сахилгагүй" гэж тайлбарлах нь дутуу. Илүү бодит тайлбар нь орой өлсөлт, ядаргаа, амархан сонголт гурав нэг дор нэмэгдэхэд шийдвэр хийх хүч багасдаг гэсэн зураглал юм.`
- What not to say: Do not remove all agency or say "та юу ч хийж чадахгүй".
- Safety note if relevant: In professional-first mode, avoid behavioral interpretation and say medical/body signals should be clarified first.

## 6. Эхний зөөлөн өөрчлөлт

- Source WP4 field: `firstGentleChange`
- User-facing goal: Give one small next step that tests the driver stack.
- Copy formula: `Эхний алхам нь бүх хоолоо өөрчлөх биш. Зөвхөн <one small action>-г туршиж үзнэ.`
- Example sentence pattern: `Эхний алхам нь бүх хоолоо өөрчлөх биш. Зөвхөн оройн өмнө жижиг гүүр хоол нэмээд өлсөлтийн хүч өөрчлөгдөх эсэхийг ажиглана.`
- What not to say: Do not prescribe strict diets, calorie rules, fasting rules, or punishment restrictions.
- Safety note if relevant: Suppress this ordinary change in professional-first mode.

## 7. 14 хоногийн туршилт

- Source WP4 field: `fourteenDayExperiment`
- User-facing goal: Frame the next step as a hypothesis test, not a command.
- Copy formula: `Дараагийн 14 хоногт үүнийг тушаал биш, туршилт гэж үзнэ: хэрэв <action> хийвэл <signal> өөрчлөгдөх эсэхийг шалгана.`
- Example sentence pattern: `Дараагийн 14 хоногт үүнийг тушаал биш, туршилт гэж үзнэ: хэрэв захиалга хийхээс өмнө богино тайвшрах завсар авбал захиалгын хүч бага зэрэг сулрах эсэхийг шалгана.`
- What not to say: Do not say "заавал", "алдаж болохгүй", "жин хасах ёстой", or "хатуу мөрд".
- Safety note if relevant: In professional-first mode, do not offer an ordinary 14-day behavioral experiment.

## 8. 7 хоног ажиглаж баталгаажуулах зүйл

- Source WP4 field: `sevenDayDiaryConfirmation`
- User-facing goal: Give observation targets that confirm or challenge the driver stack.
- Copy formula: `Эхний 7 хоногт зөв буруу гэж дүгнэхгүй. Зөвхөн <signals> ажиглана.`
- Example sentence pattern: `Эхний 7 хоногт зөв буруу гэж дүгнэхгүй. Зөвхөн хоол хоорондын зай, оройн өлсөлт, ядаргаа, хамгийн амархан сонголт хэр хүчтэй татаж байгааг тэмдэглэнэ.`
- What not to say: Do not grade the user or turn the diary into compliance tracking.
- Safety note if relevant: For professional-first fixtures, diary notes should support a professional conversation, not replace it.

## 9. Анхаарах зүйл / мэргэжлийн зөвлөгөө

- Source WP4 field: `safetyBlock`
- User-facing goal: Keep safety separate, calm, non-diagnostic, and unblocked.
- Copy formula: `Энэ нь онош биш. <body/health signal> байж магадгүй үед жин хасах зөвлөгөө өгөхөөс өмнө биеийн дохиог тодруулах хэрэгтэй байж магадгүй.`
- Example sentence pattern: `Энэ нь онош биш. Энэ хэсэг жин хасах зөвлөгөө өгөхөөс өмнө биеийн дохиог тодруулах хэрэгтэй байж магадгүй гэсэн чиглэл юм. Хэрэв шинж тэмдэг хүчтэй, давтамжтай, эсвэл санаа зовоож байвал мэргэжлийн хүнтэй ярилцах нь зөв.`
- What not to say: Do not say medication, glucose, hormones, PCOS, or any medical condition caused the result.
- Safety note if relevant: Safety copy must be visible without payment and must suppress ordinary experiment copy when professional-first is active.

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-6/fixture-copy-architecture-samples.md

# Work Pack 6 Fixture Copy Architecture Samples

These are test-only Mongolian copy drafts for owner review. They are not production report copy and must not be wired into runtime.

## shift_work_recovery_only

### Ил харагдаж байгаа зүйл
Таны хариултаас ээлжийн ажил, тогтмол бус хэмнэл илүү тод харагдаж байна. Энэ нь таныг сахилгагүй гэсэн үг биш; биеийн сэргэлт, хооллох цаг, амрах боломж өөр өөр өдөр өөрөөр ажиллаж байж болно.

### Цаана нь ажиллаж байгаа зүйл
Энэ зураглалд гол давхар нөлөө нь хурдан сэргэх хэрэгцээ байна. Ээлжийн дараа бие болон сэтгэл шууд тайвшрах дохио хайхад хоол хамгийн ойрын сэргэлт шиг санагдаж болно.

### Эмзэг мөч
Таны эмзэг мөч бол ээлжийн дараах ядаргаа хуримтлагдсан үе. Энэ үед шийдвэр гаргах хүч багасаж, хурдан сэргээх зүйл илүү татдаг.

### Хоолны далд үүрэг
Энэ үед хоол зөвхөн өл дарах биш, хурдан сэргэх үүрэг гүйцэтгэж байж магадгүй. Бие тань "одоо жаахан тэнцвэр хэрэгтэй" гэж дохиолж байгаа мэт.

### Буруу өөр тайлбар
"Би өөрийгөө барьж чаддаггүй" гэж тайлбарлах нь дутуу. Илүү бодит тайлбар нь тогтмол бус хэмнэл дээр сэргэлтийн хэрэгцээ давхардаж байгаа явдал.

### Эхний зөөлөн өөрчлөлт
Эхний алхам нь хоолоо бүхэлд нь өөрчлөх биш. Ээлжийн дараа нэг жижиг сэргэлтийн зангууг урьдчилж бэлдэхийг туршина.

### 14 хоногийн туршилтын санаа
Дараагийн 14 хоногт энэ зангуу ээлжийн дараах хүчтэй таталтыг бага зэрэг сулруулж байна уу гэдгийг шалгана. Энэ бол тушаал биш, таны хэмнэлд тохирох эсэхийг үзэх жижиг туршилт.

### 7 хоног баталгаажуулах зүйл
- Ээлжийн дараах ядаргаа хэдэн цагт хүчтэй болдог вэ?
- Хурдан сэргээх хэрэгцээ хэзээ нэмэгддэг вэ?
- Сэргэлтийн зангуу байхад сонголт бага зэрэг зөөлөрч байна уу?

### Owner QA note
NEEDS COPY POLISH

## shift_work_loneliness_combo

### Ил харагдаж байгаа зүйл
Таны хариултаас ээлжийн ажил хамгийн түрүүнд харагдаж байна. Гэхдээ энэ нь зөвхөн цагийн хуваарийн асуудал биш байж магадгүй.

### Цаана нь ажиллаж байгаа зүйл
Ээлжийн дараах ядаргаа дээр ачааллаа буулгах хэрэгцээ, ганцаардал, тайтгарах хүсэл давхардаж байна. Ийм үед хоол зөвхөн өл дарах биш, түр холбоо, түр амралт шиг мэдрэгдэж болно.

### Эмзэг мөч
Таны эмзэг мөч бол ээлжийн дараа бие ядарсан мөртлөө дотор хоосон, ганцаараа мэт санагдах үе. Энэ үед хурдан тайтгарах зүйл илүү хүчтэй татна.

### Хоолны далд үүрэг
Хоол энэ үед ганцаардлыг түр намжаах үүрэг гүйцэтгэж байж магадгүй. Энэ нь сул дорой гэсэн үг биш; холбоо хэрэгтэй байгаа дохио байж болно.

### Буруу өөр тайлбар
"Зөвхөн тэвчээрийн асуудал" гэж харах нь дутуу. Энд хэмнэл, ядаргаа, холбоо дутагдах мэдрэмж зэрэг давхар ажиллаж байна.

### Эхний зөөлөн өөрчлөлт
Эхний өөрчлөлт нь өөрийгөө шахах биш. Ээлжийн дараах сэргэлтийн зангуу дээр нэг жижиг холбооны мөч нэмэхийг туршина.

### 14 хоногийн туршилтын санаа
14 хоногийн турш ээлжийн дараа богино холбоо эсвэл тайван сэргэлтийн мөч нэмэхэд хоолны тайтгаруулах хүч өөрчлөгдөх эсэхийг шалгана.

### 7 хоног баталгаажуулах зүйл
- Ээлжийн дараа ганцаардал хэдийд нэмэгддэг вэ?
- Тайтгарах хүсэл хоолтой хэр ойр холбогдож байна вэ?
- Жижиг холбооны мөч нэмэхэд хүчтэй таталт өөрчлөгдөж байна уу?

### Owner QA note
NEEDS COPY POLISH

## remote_work_visible_snacks

### Ил харагдаж байгаа зүйл
Таны хариултаас гэрээсээ ажиллах эсвэл нэг орчинд удаан байх үед хоол нүдэнд байнга харагдах зураглал гарч байна. Энэ нь таны хүсэл сул гэсэн үг биш; орчин өөрөө сонголтыг ойртуулж байна.

### Цаана нь ажиллаж байгаа зүйл
Нүдэнд харагдах хоол, хоолны зураг/контент, жижиг шагнал авах хэрэгцээ, хамгийн амархан сонголт дөрөв давхардаж байна. Ийм үед шийдвэр гаргахгүй байсан ч орчин өөрөө дахин дахин сануулга өгдөг.

### Эмзэг мөч
Таны эмзэг мөч бол ажил дундаа түр завсарлах үед хоол нүдэнд орж ирэх үе. Энэ үед "жаахан л" гэдэг сонголт хамгийн бага хүч шаарддаг.

### Хоолны далд үүрэг
Хоол энэ үед жижиг шагналын үүрэг гүйцэтгэж байж магадгүй. Удаан төвлөрсний дараа өөртөө түр амралт өгөх дохио болж байна.

### Буруу өөр тайлбар
"Би өөрийгөө барьж чаддаггүй" гэж тайлбарлах нь дутуу. Илүү бодит тайлбар нь орчин, харагдах дохио, жижиг шагналын хэрэгцээ давхар ажиллаж байгаа явдал.

### Эхний зөөлөн өөрчлөлт
Эхний алхам нь гэрийн бүх хоолыг өөрчлөх биш. Зөвхөн нэг харагддаг өдөөгчийг нүднээс холдуулахыг туршина.

### 14 хоногийн туршилтын санаа
14 хоногийн турш нэг өдөөгчийг холдуулахад завсарлагааны үеийн автомат сунгалт багасах эсэхийг ажиглана.

### 7 хоног баталгаажуулах зүйл
- Ямар хоол хамгийн олон удаа нүдэнд орж байна вэ?
- Хоолны зураг/контент хүсэл нэмдэг үү?
- Нэг өдөөгч холдоход автомат сонголт багасаж байна уу?

### Owner QA note
NEEDS COPY POLISH

## stress_delivery_app_comfort

### Ил харагдаж байгаа зүйл
Таны хариултаас стрессийн дараа захиалгын апп хамгийн амархан тайвшрал болох зураглал харагдаж байна. Энэ нь таны буруу сонголт гэсэн үг биш; ачаалал их үед хамгийн бага хүч шаардсан хувилбар түрүүлж гарч ирдэг.

### Цаана нь ажиллаж байгаа зүйл
Стресс, ачааллаа буулгах хэрэгцээ, аппын амархан байдал, тайтгарах хүсэл давхардаж байна. Ийм үед хоол захиалах нь өлсөхөөс гадна өдрийн дарамтаас гарах богино зам шиг мэдрэгдэж болно.

### Эмзэг мөч
Таны эмзэг мөч бол ачаалал өндөр байсан өдрийн төгсгөлд утсаа авах үе. Энэ үед захиалга хийх шийдвэр бараг өөрөө гарч байгаа мэт санагдаж болно.

### Хоолны далд үүрэг
Хоол энэ үед ачаалал буулгах үүрэг гүйцэтгэж байж магадгүй. Энэ нь зүгээр нэг амт биш, дотор талдаа "одоо түр амаръя" гэсэн хэрэгцээ.

### Буруу өөр тайлбар
"Би зүгээр л тэвчээргүй" гэж тайлбарлах нь дутуу. Ачаалал, аппын амархан байдал, тайтгарах хэрэгцээ зэрэг зэрэг нэмэгдэж байна.

### Эхний зөөлөн өөрчлөлт
Эхний алхам нь "захиалга хийхээ боль" биш. Захиалахаас өмнө ачааллаа буулгах богино, тодорхой завсар нэмээд юу өөрчлөгдөхийг ажиглана.

### 14 хоногийн туршилтын санаа
14 хоногийн турш захиалгын өмнөх богино завсар таны тайтгарах хэрэгцээг өөрөөр сонсгох эсэхийг шалгана. Зорилго нь хорих биш, шийдвэрийн өмнө жижиг зай гаргах.

### 7 хоног баталгаажуулах зүйл
- Захиалга хийх хүсэл ямар стрессийн дараа нэмэгддэг вэ?
- Богино завсар авахад хүсэл өөрчлөгдөж байна уу?
- Хоолноос өөр тайвшрах дохио гарч ирж байна уу?

### Owner QA note
NEEDS COPY POLISH

## meal_gap_evening_hunger

### Ил харагдаж байгаа зүйл
Таны хариултаас хоол хоорондын зай уртсах, орой хүчтэй өлсөх зураглал тод байна. Энэ нь сахилгагүйдээ биш; бие өмнөх завсрыг орой нөхөх гэж хүчтэй дохио өгч байж болно.

### Цаана нь ажиллаж байгаа зүйл
Хоолны зай, оройн өлсөлт, ядаргаа, хамгийн амархан сонголт давхардаж байна. Бие хүчтэй өлсөхөөс хамгаалах гэж илүү найдвартай, хурдан хоол руу татаж байж магадгүй.

### Эмзэг мөч
Таны эмзэг мөч бол орой өлсөлт аль хэдийн хүчтэй болсон үе. Энэ үед зөөлөн сонголт хийхэд оройтсон мэт санагдаж болно.

### Хоолны далд үүрэг
Хоол энэ үед өлсөх аюулгүй мэдрэмжийг буцаах үүрэгтэй байж магадгүй. Энэ нь аюултай гэсэн үг биш; бие дараа нь хэт өлсөхөөс хамгаалах гэж байгаа дохио.

### Буруу өөр тайлбар
"Орой би л алддаг" гэж тайлбарлах нь дутуу. Өдрийн завсар, ядаргаа, биеийн хамгаалах дохио орой нэг дор нэмэгдэж байна.

### Эхний зөөлөн өөрчлөлт
Эхний алхам нь хатуу хоолны дэглэм биш. Оройн өмнө жижиг гүүр хоол нэмээд өлсөлтийн хүч өөрчлөгдөх эсэхийг үзнэ.

### 14 хоногийн туршилтын санаа
14 хоногийн турш оройн өмнөх жижиг гүүр хоол оройн сонголтыг зөөлрүүлж байна уу гэдгийг шалгана.

### 7 хоног баталгаажуулах зүйл
- Хоол хоорондын зай хэдэн цаг болоход орой хүчтэй өлсдөг вэ?
- Гүүр хоолтой өдөр оройн сонголт өөр байна уу?
- Ядаргаа өлсөлттэй зэрэг нэмэгдэж байна уу?

### Owner QA note
NEEDS COPY POLISH

## all_or_nothing_restriction_rebound

### Ил харагдаж байгаа зүйл
Таны хариултаас "бүгдийг зөв хийх эсвэл бүр орхих" маягийн хэмнэл харагдаж байна. Хэт чанга барих оролдлого, дараа нь буцаад хүчтэй татагдах мөч давхардаж байж болно.

### Цаана нь ажиллаж байгаа зүйл
Энд зөвхөн өлсөлт биш, өөрийгөө шийтгэх маягийн хорих, оройн өлсөлт, дахин эхлэх дарамт зэрэг зэрэг ажиллаж байна. Энэ бүтэц нь хоолны тухайгаас гадна "алдаагаа засах" гэж хэт чангардаг дарамттай холбоотой байж магадгүй.

### Эмзэг мөч
Таны эмзэг мөч бол "аль хэдийн алдсан" гэж санагдсаны дараах үе. Энэ үед маргааш илүү чанга барина гэсэн бодол өнөөдрийн буцаад татах хүчийг нэмэгдүүлж болно.

### Хоолны далд үүрэг
Одоогийн бүтэц hunger safety буюу хүчтэй өлсөхөөс хамгаалах үүргийг харуулж байна. Гэхдээ энэ fixture runtime-аас өмнө бүтцийн шийдвэр хэрэгтэй: бүтэлгүйтсэн мэт мэдрэмж, өөрийгөө шийтгэх, дахин эхлэх дарамтаас түр гарах narrative илүү хүчтэй хэрэгтэй байж магадгүй.

### Буруу өөр тайлбар
"Би нэг алдвал бүх юм дуусдаг" гэж тайлбарлах нь дутуу. Илүү бодит зураглал нь хэт чанга барих тусам бие, сэтгэл хоёрын буцаад татах хүч нэмэгддэг явдал.

### Эхний зөөлөн өөрчлөлт
Эхний алхам нь маргааш илүү чанга барих биш. Дараагийн хоолоо шийтгэлгүй, зөөлөн дахин тэнцвэржүүлэх нэг дүрэм туршина.

### 14 хоногийн туршилтын санаа
14 хоногийн турш "алдаа" гэж мэдрэгдсэн дараа дараагийн хоолоороо зөөлөн тэнцвэржихэд rebound-ийн хүч буурч байна уу гэдгийг шалгана.

### 7 хоног баталгаажуулах зүйл
- "Бүгд дууссан" гэсэн бодол хэзээ гарч байна вэ?
- Маргааш чангарна гэсэн бодол өнөөдрийн сонголтод нөлөөлж байна уу?
- Дараагийн хоолыг шийтгэлгүй эхлүүлэхэд rebound багасаж байна уу?

### Owner QA note
NEEDS STRUCTURE DECISION

## social_weekend_alcohol_monday_restart

### Ил харагдаж байгаа зүйл
Таны хариултаас хамт олны ширээ, амралтын өдрийн уур амьсгал, Даваа гарагаас дахин эхлэх дарамт харагдаж байна. Энэ нь social eating буруу гэсэн үг биш.

### Цаана нь ажиллаж байгаа зүйл
Хамт байх, харьяалагдах мэдрэмж, уух орчны сулруулах нөлөө, "дараа нь чангална" гэсэн бодол давхардаж байна. Хоол заримдаа хүмүүстэй ойр байх нэг хэсэг болдог.

### Эмзэг мөч
Таны эмзэг мөч бол хамт олон эсвэл гэр бүлийн ширээн дээр "одоо хамт байя" гэсэн мэдрэмж хүчтэй болох үе. Энэ үед зөвхөн хоол биш, харьяалагдах хэрэгцээ ажиллаж байна.

### Хоолны далд үүрэг
Хоол энэ үед belonging буюу хамт байх мэдрэмжийн үүрэг гүйцэтгэж байж магадгүй. Энэ нь сул тал биш, хүний хэвийн хэрэгцээ.

### Буруу өөр тайлбар
"Би social үед өөрийгөө алддаг" гэж тайлбарлах нь дутуу. Хамт байх хэрэгцээ, уур амьсгал, Даваа гарагийн restart дарамт зэрэг зэрэг нөлөөлж байна.

### Эхний зөөлөн өөрчлөлт
Эхний алхам нь social хоолноос зугтах биш. Хамт байхдаа өөрт тохирох нэг сонголтоо урьдчилж зөөлөн хэлэх өгүүлбэр бэлдэнэ.

### 14 хоногийн туршилтын санаа
14 хоногийн турш social үед жижиг сонголтын script ашиглахад дараагийн өдрийн restart дарамт багасаж байна уу гэдгийг ажиглана.

### 7 хоног баталгаажуулах зүйл
- Social орчинд belonging хэрэгцээ хэр хүчтэй байна вэ?
- Уух орчин сонголтыг өөрчилж байна уу?
- Даваа гарагаас дахин эхлэх бодол багасаж байна уу?

### Owner QA note
NEEDS COPY POLISH

## body_shame_restriction

### Ил харагдаж байгаа зүйл
Таны хариултаас биеийн өөрчлөлтөд эргэлзэх, өөрийгөө буруутгах мэдрэмж, хэт чанга барих оролдлого давхар харагдаж байна. Энэ хэсэг биеийг шүүхийн тулд биш, таны ачааллыг зөөлөн ойлгохын тулд байна.

### Цаана нь ажиллаж байгаа зүйл
Ичих мэдрэмж, биеийн тухай тодорхойгүй байдал, өөрийгөө хорих оролдлого зэрэг зэрэг нэмэгдэхэд хоолны сонголт илүү хүнд болдог. Ийм үед хүн өөрийгөө засах гэж оролдох тусам ажиглахаас зайлсхийж магадгүй.

### Эмзэг мөч
Таны эмзэг мөч бол биеийн өөрчлөлтийг анзаарсны дараа өөрийгөө буруутгах үе. Энэ үед зөөлөн ажиглалт биш, хатуу хорих бодол түрүүлж гарч ирж болно.

### Хоолны далд үүрэг
Хоол энэ үед ичих мэдрэмжээс түр холдох үүрэг гүйцэтгэж байж магадгүй. Энэ нь таны буруу гэсэн үг биш; хүнд мэдрэмжээс түр амсхийх оролдлого байж болно.

### Буруу өөр тайлбар
"Миний бие буруу, би илүү чанга барих ёстой" гэж тайлбарлах нь дутуу бөгөөд өвтгөж магадгүй. Илүү бодит тайлбар нь shame, тодорхойгүй байдал, restriction гурав давхардаж байгаа явдал.

### Эхний зөөлөн өөрчлөлт
Эхний алхам нь биеэ хэмжиж шүүх биш. Биеийг буруутгахгүй, зөвхөн хувийн жижиг ажиглалт хийхийг туршина.

### 14 хоногийн туршилтын санаа
14 хоногийн турш body-neutral хувийн ажиглалт shame-ийн дараах хатуу хорих хүслийг зөөлрүүлж байна уу гэдгийг шалгана.

### 7 хоног баталгаажуулах зүйл
- Биеийн тухай бодол хэзээ shame болж хувирч байна вэ?
- Shame дараа restriction хийх хүсэл нэмэгдэж байна уу?
- Хувийн зөөлөн ажиглалт хийхэд зайлсхийх мэдрэмж өөрчлөгдөж байна уу?

### Owner QA note
NEEDS COPY POLISH

## pcos_body_uncertainty_control

### Ил харагдаж байгаа зүйл
Таны хариултаас биеийн өөрчлөлт юунаас болж байгааг мэдэхгүй байх тодорхойгүй байдал харагдаж байна. Энэ нь PCOS, даавар, эсвэл өөр эмнэлгийн шалтгаанаас болсон гэж хэлж байгаа хэрэг биш.

### Цаана нь ажиллаж байгаа зүйл
Тодорхойгүй байдал нэмэгдэхэд хяналтаа буцааж авах оролдлого хүчтэй болдог. Хоол, тэмдэглэл, эсвэл өөрийгөө чангаруулах бодол энэ үед "ядаж нэг зүйлээ барья" гэсэн мэдрэмжтэй холбогдож байж магадгүй.

### Эмзэг мөч
Таны эмзэг мөч бол биеийн өөрчлөлт ойлгомжгүй санагдаж, "би юу ч хянаж чадахгүй байна" гэж мэдрэгдэх үе. Энэ үед control regain илүү хүчтэй ажилладаг.

### Хоолны далд үүрэг
Хоол эсвэл хоолтой холбоотой дүрэм энэ үед тогтвортой байдал буцааж авах үүрэгтэй байж магадгүй. Энэ нь онош биш, зөвхөн тодорхойгүй байдал сонголтын ачааллыг нэмэгдүүлж байж болох зураглал.

### Буруу өөр тайлбар
"Миний бие л буруу ажиллаж байна" гэж дүгнэх нь дутуу бөгөөд хатуу. Илүү зөөлөн тайлбар нь тодорхойгүй байдал хяналт хайх хэрэгцээг нэмэгдүүлж байж магадгүй.

### Эхний зөөлөн өөрчлөлт
Эхний алхам нь бүхнийг хэмжих биш. Биеийг буруутгахгүй, хувийн жижиг ажиглалт хийж, ямар нөхцөлд хяналт хайх мэдрэмж нэмэгдэж байгааг тэмдэглэнэ.

### 14 хоногийн туршилтын санаа
14 хоногийн турш body-neutral ажиглалт control regain-ийн дарамтыг багасгаж байна уу гэдгийг шалгана. Энэ нь эмчилгээ биш, өөрийгөө ойлгох туршилт.

### 7 хоног баталгаажуулах зүйл
- Тодорхойгүй байдал хэзээ нэмэгдэж байна вэ?
- Хяналт хайх бодол хоол/дүрэмтэй холбогдож байна уу?
- Биеийг буруутгахгүй ажиглалт хийхэд ачаалал өөрчлөгдөж байна уу?

### Owner QA note
NEEDS STRUCTURE DECISION

## medication_body_concern_professional_check

### Ил харагдаж байгаа зүйл
Таны хариултаас биеийн дохио, эмийн орчин, эсвэл эрүүл мэндийн өөрчлөлтийг эхлээд тодруулах хэрэгтэй байж магадгүй зураглал харагдаж байна. Энэ нь онош биш.

### Цаана нь ажиллаж байгаа зүйл
Энэ хэсэг жирийн зан үйлийн тайлбар өгөхөөс өмнө биеийн дохиог тодруулах нь зөв дараалал байж магадгүй гэсэн чиглэл юм. Жин хасалт гацахыг шууд сахилга, хоолны сонголт, эсвэл нэг шалтгаанаар тайлбарлахгүй.

### Эмзэг мөч
Таны эмзэг мөч бол биеийн өөрчлөлт эсвэл шинж тэмдэг санаа зовоож эхлэх үе. Энэ үед зан үйлийн туршилт эхлэхээс өмнө мэргэжлийн хүнтэй ярилцах нь илүү аюулгүй дараалал байж болно.

### Хоолны далд үүрэг
Энэ fixture-д хоолны далд үүргийг ordinary report маягаар тайлбарлахгүй. Эхлээд биеийн дохио, өөрчлөлт, санаа зовоож буй зүйлээ тодруулах чиглэл өгнө.

### Буруу өөр тайлбар
"Би зүгээр л буруу идэж байна" гэж тайлбарлах нь дутуу байж болно. Энэ нь эмнээс болсон, глюкозоос болсон, даавраас болсон гэж хэлж байгаа хэрэг биш.

### Эхний зөөлөн өөрчлөлт
Эхний алхам нь хоолны дүрэм эхлүүлэх биш. Өөрт ажиглагдсан өөрчлөлт, давтамж, санаа зовоож байгаа зүйлээ товч тэмдэглээд мэргэжлийн хүнтэй ярилцахад бэлдэх.

### 14 хоногийн туршилтын санаа
Жирийн 14 хоногийн зан үйлийн туршилтыг энэ fixture дээр санал болгохгүй. Professional-first чиглэл идэвхтэй тул эхлээд биеийн дохиог тодруулах нь зөв.

### 7 хоног баталгаажуулах зүйл
- Ямар шинж тэмдэг эсвэл өөрчлөлт санаа зовоож байна вэ?
- Давтамж, хугацаа, нөхцөл нь ямар байна вэ?
- Мэргэжлийн хүнтэй ярихад хэрэгтэй товч тэмдэглэл юу вэ?

### Owner QA note
SAFETY COPY REQUIRED

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-6/professional-first-copy-rules.md

# Work Pack 6 Professional-First Copy Rules

## What professional-first means in user-facing language

Professional-first means the report pauses ordinary behavior-change interpretation because a body signal, medical context, severe distress signal, or safety pattern may need clarification before weight-loss advice. It is not a diagnosis and it is not a failure state.

Required language:

> Энэ нь онош биш.

> Энэ хэсэг жин хасах зөвлөгөө өгөхөөс өмнө биеийн дохиог тодруулах хэрэгтэй байж магадгүй гэсэн чиглэл юм.

> Хэрэв шинж тэмдэг хүчтэй, давтамжтай, эсвэл санаа зовоож байвал мэргэжлийн хүнтэй ярилцах нь зөв.

## What must never be said

- Do not say "эмнээс болсон".
- Do not say "глюкозоос болсон".
- Do not say "даавраас болсон".
- Do not say "PCOS-оос болсон".
- Do not say "онош".
- Do not say "эмчилгээ".
- Do not say "заавал эмчид оч".
- Do not say the user is unsafe, broken, or unable to change.
- Do not hide professional-first safety copy behind payment.

## How to avoid diagnosis

Use uncertainty language:

- "байж магадгүй"
- "тодруулах хэрэгтэй байж болно"
- "мэргэжлийн хүнтэй ярилцах нь зөв дараалал байж болно"

Do not assign cause. The copy can say a signal deserves clarification, but it cannot say which medical factor caused weight change or eating behavior.

## How to avoid fear pressure

Keep the safety message short, calm, and practical. Do not dramatize risk. Do not use urgent language unless the existing safety route explicitly requires urgent handling.

Preferred framing:

`Эхлээд биеийн дохиог тодруулах нь зөөлөн бөгөөд хариуцлагатай алхам.`

Avoid:

`Яаралтай аюултай байж магадгүй тул...`

## How to avoid payment-blocking safety

Safety direction must be shown before any paid depth, report expansion, PDF, or premium content. A user should never have to pay to learn that professional-first guidance is recommended.

Runtime gate for future work: any implementation must prove that professional-first safety copy is visible in the free/initial result path.

## Suggested Mongolian safety section template

## Анхаарах зүйл / мэргэжлийн зөвлөгөө

`Энэ нь онош биш. Энэ хэсэг жин хасах зөвлөгөө өгөхөөс өмнө биеийн дохиог тодруулах хэрэгтэй байж магадгүй гэсэн чиглэл юм. Хэрэв шинж тэмдэг хүчтэй, давтамжтай, эсвэл санаа зовоож байвал мэргэжлийн хүнтэй ярилцах нь зөв. Энэ нь таны буруу гэсэн үг биш; зөв дарааллыг аюулгүй болгох гэсэн алхам юм.`

## Specific sample for `medication_body_concern_professional_check`

`Таны хариултад биеийн өөрчлөлт, эмийн орчин, эсвэл эрүүл мэндийн дохиог эхлээд тодруулах хэрэгтэй байж магадгүй зураглал харагдаж байна. Энэ нь онош биш. Энэ хэсэг жин хасах зөвлөгөө өгөхөөс өмнө биеийн дохиог тодруулах хэрэгтэй байж магадгүй гэсэн чиглэл юм.`

`Энэ тохиолдолд жирийн 14 хоногийн зан үйлийн туршилт санал болгохгүй. Харин өөрт ажиглагдсан өөрчлөлт, давтамж, санаа зовоож байгаа зүйлээ товч тэмдэглээд мэргэжлийн хүнтэй ярилцах нь илүү зөв дараалал байж болно. Хэрэв шинж тэмдэг хүчтэй, давтамжтай, эсвэл санаа зовоож байвал мэргэжлийн хүнтэй ярилцах нь зөв.`

## Notes for PCOS/body uncertainty ordinary-mode copy

`pcos_body_uncertainty_control` is ordinary mode in the current test artifact, so it should not automatically suppress the 14-day experiment. However, copy must not claim PCOS, hormones, medication, or another medical cause as fact.

Recommended language:

`Биеийн өөрчлөлт юунаас болж байгааг мэдэхгүй үед хяналтаа буцааж авах гэсэн оролдлого хүчтэй болдог. Энэ нь PCOS, даавар, эсвэл өөр нэг шалтгаанаас болсон гэж хэлж байгаа хэрэг биш; зөвхөн тодорхойгүй байдал таны сонголтын ачааллыг нэмэгдүүлж байж магадгүй гэсэн зураглал юм.`

Owner gate: before runtime integration, owner should decide whether ordinary-mode body uncertainty needs a soft professional-context bridge in every report.

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-6/copy-risk-register.md

# Work Pack 6 Copy Risk Register

| Risk | Where it appears | Severity | Mitigation | Runtime gate |
| --- | --- | --- | --- | --- |
| Internal keys leaking | All WP4 snapshot-derived sections | High | Translate every key through approved Mongolian copy map; never render raw keys. | Block runtime until key rendering tests exist. |
| Shame language | Wrong self-explanation, body shame, restriction/rebound | High | Use body-neutral, non-blaming copy; ban "та сахилгагүй" and equivalent phrasing. | Copy QA must check forbidden phrases. |
| One-type label | Primary driver and section summaries | High | Always describe primary plus secondary drivers as a stack. | Runtime must not show type/persona labels. |
| Medical diagnosis implication | Professional-first, PCOS/body uncertainty, medication concern | High | Use "Энэ нь онош биш" and uncertainty language. | Medical-cause claims must be forbidden by tests/review. |
| Professional-first copy sounding frightening | Safety section | High | Keep tone calm, short, and practical; avoid urgent language unless safety route already requires it. | Safety copy owner approval required. |
| Experiment sounding like diet instruction | 14-day experiment, first gentle change | Medium | Use "туршилт", "шалгана", and "ажиглана"; avoid commands. | Runtime copy must frame experiment as hypothesis. |
| Body shame copy sounding exposing | `body_shame_restriction`, body uncertainty sections | High | Use private/body-neutral language and avoid appearance judgment. | Body-sensitive copy review required. |
| Social eating copy sounding moralizing | `social_weekend_alcohol_monday_restart` | Medium | Frame social eating as belonging/context, not weakness. | Owner approval for social/belonging language. |
| Hunger safety sounding alarming | `meal_gap_evening_hunger`, restriction/rebound | Medium | Explain as the body trying to prevent strong hunger, not danger. | Hunger-safety copy must be user-tested or owner-approved. |
| AI-generic tone | All generated report copy | Medium | Require specific moment, driver stack, and one concrete next step. | Reject generic motivational copy. |
| Overconfident causality | Hidden food function, medical/body uncertainty | High | Use "байж магадгүй", "харагдаж байна", and "давхардаж байна". | Runtime copy must avoid certainty claims. |
| Payment blocking safety | Professional-first route, paywall/premium paths | Critical | Safety direction must appear before payment and outside paid report depth. | Block runtime unless safety copy is visible without payment. |

---

## Full Content: audits/mvp-diagnostic-migration/work-pack-6/work-pack-6-recommendation.md

# Work Pack 6 Recommendation

## Recommendation Enum

READY FOR OWNER REVIEW OF COPY ARCHITECTURE

## Basis

All required WP6 copy architecture documents exist, all 10 fixture copy samples are covered, and professional-first copy rules are included.

## Remaining hold conditions

Runtime integration remains HOLD. Production report rendering remains HOLD. WP3 scoring, WP3 fixtures, WP4 report object contract, PDF generation, deploy, backend, payment, QPay, pricing, entitlement, and localStorage remain out of scope.
