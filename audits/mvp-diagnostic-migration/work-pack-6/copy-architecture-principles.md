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
| `removedFeatureDiaryConfirmation` | 7 хоногийн баталгаажуулах тэмдэглэл | Tell the user what to observe, not what to judge. |
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
4. Always translate `visibleCondition`, `secondaryDrivers`, `vulnerableMoment`, `hiddenFoodFunction`, `wrongSelfExplanation`, `firstGentleChange`, `fourteenDayExperiment`, and `removedFeatureDiaryConfirmation` through an approved copy layer.
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
