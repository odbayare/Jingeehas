# Current System Audit

Scope: audit-only migration planning for the Weight Test MVP. No app logic, questionnaire copy, report copy, PDF output, payment/QPay, pricing, entitlement, backend, prompt, deploy, or runtime files were changed.

## Files Inspected

| File path | What it appears to control |
|---|---|
| `index.html` | Static shell. Loads `styles.css`, `mockBackend.js`, and `app.js`; no questionnaire/report logic lives here. |
| `app.js` | Main runtime for the static MVP: product pricing constants, state, questionnaire definitions, answer metadata, scoring, safety flags, diary flow, report rendering, QPay prototype calls, coach/admin/demo surfaces, and exported test internals. |
| `mockBackend.js` | Browser/local mock persistence for sessions, assessments, payments, entitlements, lead intents, feedback, coach accounts, report access logs, and audit logs. It is not a real production backend. |
| `README.md` | Product boundaries, local run/test commands, manual demo paths, included features, and safety positioning. |
| `BACKEND_QPAY_INTEGRATION_PLAN.md` | Planning document for future backend, entitlement, payment, QPay, and report snapshot persistence. It explicitly preserves safety bypasses and existing static report logic during migration. |
| `MOCK_BACKEND_ENTITLEMENTS.md` | Mock backend and entitlement reference for prototype persistence. |
| `tests/*` | Regression coverage for safety readiness, question metadata, evidence scoring, report sections, virtual-user QA, commercial/paywall paths, coach flows, copy, and PDF/prototype artifacts. |
| `scripts/export-*.mjs` | PDF/prototype export scripts. These are separate from the live browser report renderer. |
| `audits/*` | Prior sprint audits, virtual user reports, PDF QA notes, and prototype review artifacts. |

## Current Runtime Flow

1. `index.html` mounts `<main id="app">` and loads `mockBackend.js` then `app.js`.
2. `app.js` initializes `state` from `localStorage` using key `weightLossDeepPatternMvp`.
3. User enters via `renderLanding()` and chooses package through `renderChoice()`: one-time or 7-day.
4. `beginAssessment()` creates a mock assessment in `mockBackend.js`, resets Stage 1 answers, and moves to `stage1`.
5. Stage 1 questions come from `stageOneQuestions`; `stageQuestions()` filters them by package and menstrual-cycle gate.
6. Each answer is stored in `state.stageAnswers`; `calculateSafetyFlags()` updates safety flags from stage answers, menstrual logic, voice summaries, and diary entries.
7. `completeStageOne()` stores `state.preliminary = rankedPatterns(false).slice(0, 4)` and routes:
   - one-time: directly to `report`
   - 7-day: to `preliminary`, then unlock/paywall/diary flow
8. The diary flow uses `dailyCore`, `dailyMenstrual`, and adaptive `probeBank` questions chosen by the top preliminary mechanisms.
9. `saveDiaryEntry()` persists a local diary entry, updates safety flags, and routes to `reportReady` after 5+ entries.
10. `renderReport()` decides safety/report mode, paywall/readiness, and then renders either urgent/professional output, one-time report, limited diary state, or full observed report.

## Current Scoring and Routing Model

The current system is mixed, but closer to mechanism/driver-based than route-only.

It is not simply `answers -> one route -> one report`. It has:

- `scores` on many answer options that point to mechanism keys such as `reward`, `regulation`, `hungerSafety`, `glucose`, `satiety`, `cue`, `collapse`, `executive`, `circadian`, `social`, `medical`, `autonomy`, `physiological`, `decisionDefault`, `rewardDeficit`, `roleOverload`, `shameAvoidance`, `bodySafety`, `identity`, and `perfectionism`.
- answer metadata enrichment through `enrichQuestion()`, `optionSignals()`, `dimensionByModule`, and `mechanismNamesByKey`.
- evidence aggregation through `extractTagsFromAnswer()`, `extractMechanismsFromAnswer()`, `aggregateDimensionEvidence()`, `aggregateMechanismSignals()`, and `calculateMechanismEvidence()`.
- primary, secondary, and supporting mechanism selection through `calculateMechanismEvidence()` and `rankedPatterns()`.
- interaction detection through `identifyMechanismCombinations()`.
- report voice selection through `selectReportVoiceKey()` / `reportVoiceFor()` and `REPORT_VOICE_LIBRARY`.

The migration should therefore preserve the existing mechanism architecture but remap it to the new internal driver keys and make the driver stack explicit.

## Safety Logic

Safety logic exists in several places:

- Stage question-level `safety` functions, for example age under 18 and safety/body questions.
- `calculateSafetyFlags()`, which combines stage, menstrual, voice-summary, and diary safety flags.
- `diaryEntrySafetyFlags()` and `calculateDiarySafetyFlags()`, which look for urgent/professional terms in diary entries.
- `safetyFlagsFromTags()`, which maps extracted evidence tags to `urgent` or `professional`.
- `menstrualCycleEvidence()` and `calculateMenstrualSafetyFlags()`, which can produce professional-first routing when cycle disruption, restriction, PCOS/postpartum, or body concerns combine.
- `reportMode()`, which routes to:
  - `deep` / mode1
  - `check` / mode2 body-check note
  - `professional` / mode3 professional-first
  - `urgent` / mode4 urgent safety
- `renderReport()`, which suppresses ordinary report/experiment content for professional-first and urgent safety routes.

New taxonomy safety keys map naturally to existing concepts but are not yet standardized as `binge_risk`, `compensatory_behavior`, `severe_body_distress`, `medical_red_flag`, and `professional_first`.

## PDF / Report Export Logic

The live app report is generated in `app.js`, primarily through:

- `renderReport()`
- `renderHumanReadableReport()`
- `renderOneTimeReport()`
- `renderSimpleResultSection()`
- `renderSurfaceHiddenSection()`
- `renderStagedExperiment()`
- `professionalCheckHtml()`
- `bodySafetyPauseHtml()`
- menstrual-cycle report helpers

PDF/prototype export logic appears separate in scripts:

- `scripts/export-virtual-reports-pdf.mjs`
- `scripts/export-virtual-human-retest.mjs`
- `scripts/export-locked-grid-prototype.mjs`
- `scripts/export-montserrat-botanical-prototype.mjs`
- `scripts/export-botanical-premium-polish.mjs`

This work pack did not regenerate PDF and did not modify export scripts.

## What Not To Touch Yet

- Do not change `app.js` scoring, question flow, report rendering, QPay calls, payment constants, entitlement checks, coach/admin behavior, or localStorage state.
- Do not change `mockBackend.js` persistence, mock payment, entitlement, coach, or audit behavior.
- Do not edit `index.html`, `styles.css`, `_redirects`, runtime scripts, tests, PDF assets, or export scripts.
- Do not regenerate report PDFs or prototype PDFs.
- Do not deploy.
- Do not enable real QPay or backend persistence.



# Question Driver Map

This is an audit of current user-facing questions against the new driver-stack taxonomy. The current app still uses older mechanism keys; proposed driver keys below are migration targets only.

Decision meanings:

- `KEEP`: wording and role are broadly useful.
- `REMAP`: keep wording but map answers to new driver keys.
- `MODIFY`: keep intent but later revise wording/options.
- `ADD`: a new question is needed.
- `REPLACE` / `REMOVE`: not recommended yet unless listed in gaps.

## Stage 1 Questions

| Question ID / location | Current Mongolian question text | Current answer options | Current purpose | Drivers it already detects | Drivers it could detect if remapped | Report evidence usefulness | Decision | Notes |
|---|---|---|---|---|---|---|---|---|
| `app.js` `S1-C00` | Энэ тест таныг шүүх гэж биш. Жин хасах гэж хичээх үед яг ямар өдөр, ямар мэдрэмж, ямар ядаргаа, ямар орчин давхцахад хоолны сонголт өөрчлөгддөгийг хамт харах гэж байгаа юм. | n/a | Warm start and framing | none | shame, professional_first tone | Low evidence, high trust | KEEP | Good product positioning for non-diet frame. |
| `S1-C01` | Таны нас хэд вэ? | number | Age and safety gate | professional | professional_first | High for safety | REMAP | Under-18 currently safety/professional. |
| `S1-C02` | Та хүйсээ яаж тэмдэглэх вэ? | Эмэгтэй; Эрэгтэй; Өөрөөр тодорхойлно; Хариулахгүй | Demographic context | none | body_change_uncertainty, shame/stigma tone | Low | KEEP | Useful for context, not a driver by itself. |
| `S1-C03` | Таны өндөр ойролцоогоор хэд вэ? /см/ | number | Body context | none | medical_concern only if used carefully | Low | KEEP | Avoid BMI-overweight framing in migration. |
| `S1-C04` | Таны одоогийн жин ойролцоогоор хэд вэ? /кг/ | number | Body context | none | body_change_uncertainty, medical_concern | Medium | KEEP | Sensitive; report should remain body-neutral. |
| `S1-C05` | Та ойролцоогоор хэдэн кг болохыг хүсэж байна вэ? /кг/ | number | Goal context | none | shame, severe_body_distress if extreme gap later | Medium | MODIFY | Future should detect unrealistic/unsafe goal pressure. |
| `S1-C06` | Жин бууруулах хүсэл тань өдөр тутмын амьдралын юутай хамгийн их холбоотой вэ? | Эрүүл мэнддээ анхаарах; Өдрийн тэнхээ нэмэх; Хувцсандаа тухтай байх; Өөртөө итгэлтэй болох; Гадаад төрхөө өөрчлөх; Даралт, сахар, шинжилгээнд санаа зовсон; Хөдлөхөд амар болох; Төрсний дараа биеэ сэргээх; Өөр зүйл | Motivation context | medical context partly | fatigue, medical_concern, body_change_uncertainty, shame | High tone modifier | REMAP | Strong entry point for visible condition and wrong self-explanation. |
| `S1-W01` | Сүүлийн 12 сарын хугацаанд таны жин хэр өөрчлөгдсөн бэ? | Их өөрчлөгдөөгүй; 1-3 кг нэмсэн; 4-7 кг нэмсэн; 8+ кг нэмсэн; Буурсан; Мэдэхгүй | Weight trajectory | medical | body_change_uncertainty, medical_concern | Medium | REMAP | Keep as context, not blame. |
| `S1-W02` | Жин нэмэгдэх эсвэл буурах үе тань амьдралын ямар өөрчлөлттэй давхацсан бэ? | Ажил ихсэж, стресс нэмэгдсэн; Хөдөлгөөн багассан; Нойр муудсан; Эм хэрэглэж эхэлсэн; Жирэмсэн эсвэл төрсний дараах үе; Өвчин, мэс засалтай давхацсан; Сэтгэл санааны хүнд үе байсан; Тодорхой зүйл байхгүй; Мэдэхгүй | Change trigger context | regulation, executive, circadian, medical | stress, sleep_disruption, fatigue, medical_concern, body_change_uncertainty | High | REMAP | Excellent bridge from body/environment to driver stack. |
| `S1-W03` | Та өмнө нь жингээ хасаж чадсан ч буцаад нэмсэн тохиолдол бий юу? | Үгүй; Нэг удаа; Хэд хэдэн удаа; Бараг бүх оролдлогоос хойш; Санахгүй | Rebound history | collapse, hungerSafety | monday_restart, all_or_nothing, strict_diet, fasting_rebound, carb_cut_rebound | High | REMAP | Core restriction/rebound evidence. |
| `S1-W04` | Өмнө нь турж үзсэн аргуудаас аль нь танд хамгийн танил вэ? | Мацаг; Калори тоолох; Нүүрс ус хасах; Орой хоол идэхгүй; Фитнесийн богино сорил; Хор гадагшлуулах арга; Хоол орлуулах бүтээгдэхүүн; Эм, тариа, нэмэлт бүтээгдэхүүн; Дасгалжуулагч эсвэл бүлгийн хөтөлбөр; Ерөнхийдөө бага идэх; Оролдож байгаагүй | Past methods | hungerSafety, glucose, collapse | fasting_rebound, carb_cut_rebound, strict_diet, punishment_restriction, medical_concern | High | REMAP | Add explicit rebound after carb-cut/fasting later. |
| `S1-W05` | Өмнө туршсан аргуудаас аль нь эхэндээ болж байгаад дараа нь үргэлжлүүлэхэд хэцүү болсон бэ? Тэр үед юу өөрчлөгдсөн гэж санагддаг вэ? | text | Narrative failed-attempt evidence | via summary tags | all_or_nothing, strict_diet, fatigue, stress, shame | High | KEEP | Strong for wrong self-explanation. |
| `S1-W06` | Төлөвлөгөө жаахан зөрөхөд таны толгойд ихэвчлэн юу орж ирдэг вэ? | Дараагийн хоолноос хэвийн үргэлжлүүлье; Өнөөдөр өнгөрлөө, маргаашаас; Маргааш илүү чанга барина; Би угаасаа чаддаггүй юм байна; Одоо бүх юм дууссан; Тодорхой бодолгүй | Collapse cognition | collapse, identity | all_or_nothing, monday_restart, punishment_restriction, shame, escape_from_failure | Very high | REMAP | One of the best existing questions for target concept. |
| `S1-M01` | Энгийн өдөр хоолны хэмнэл тань ихэвчлэн ямар байдаг вэ? | 2-3 удаа тогтмол хооллодог; Өглөөний хоол алгасдаг; Өдрийн хоол алгасдаг; Өдөр бага идээд орой нөхдөг; Хоолны цаг өдөр бүр өөр; Тодорхой хэмнэл байхгүй | Meal rhythm | hungerSafety, circadian, executive | meal_gap, evening_hunger, sleep_disruption, fatigue | Very high | REMAP | Direct body/rhythm driver. |
| `S1-M02` | Хоолны хооронд 5+ цагийн зай гарах нь хэр олон вэ? | Бараг үгүй; 7 хоногт 1-2; 3-4; Бараг өдөр бүр; Мэдэхгүй | Meal gap frequency | hungerSafety, glucose | meal_gap, hunger_safety, medical_red_flag if symptoms | Very high | REMAP | Keep. |
| `S1-M03` | Өдөр хоол алгассан эсвэл оройтсон үед орой идэхээ барихад хэцүү болдог уу? | Бараг нөлөөлдөггүй; Заримдаа нөлөөлдөг; Нэлээд нөлөөлдөг; Бараг дандаа тэгдэг; Анзаарч байгаагүй | Meal gap -> evening rebound | hungerSafety, circadian, collapse | meal_gap, evening_hunger, fasting_rebound, loss_of_control_feeling | Very high | REMAP | Strong vulnerable-moment evidence. |
| `S1-H01` | Хоол идээд цадсан эсэхээ мэдрэхэд танд хэр амар байдаг вэ? | Амархан мэдэрдэг; Заримдаа мэдэрдэг; Сайн ялгадаггүй; Цадсан ч үргэлжлүүлдэг; Хэт өлстлөө хүлээгээд хэтрүүлдэг | Hunger/satiety signal clarity | satiety, reward, hungerSafety, glucose | loss_of_control_feeling, meal_gap, evening_hunger, binge_risk | High | REMAP | Needs safety distinction for binge risk later. |
| `S1-H02` | Төлөвлөөгүй идэх үед та ихэвчлэн бодитоор өлссөн байдаг уу? | Ихэвчлэн тийм; Заримдаа; Ихэвчлэн үгүй; Ялгаж мэддэггүй; Нөхцлөөс шалтгаална | Physical vs nonphysical hunger | hungerSafety, reward, regulation, cue, satiety | hunger_safety, comfort, decompression, visible_snacks, delivery_app | High | REMAP | Good hidden-function split. |
| `S1-H03` | Өлссөн үү, ядарсан уу, сэтгэл тавгүй байна уу гэдгээ ялгахад амар байдаг уу? | Тийм, ихэнхдээ ялгадаг; Заримдаа ялгадаг; Сайн ялгадаггүй; Бүгд л 'юм идмээр' гэж мэдрэгддэг; Анзаарч байгаагүй | Signal discrimination | satiety, regulation | fatigue, anxiety, stress, emptiness, quick_recovery | High | REMAP | Useful for visible condition vs hidden function. |
| `S1-F01` | Төлөвлөөгүй идэхийн яг өмнө танд юу хамгийн ойр санагддаг вэ? | Өлссөндөө идсэн; Амттай юм идмээр байсан; Тайвширмаар байсан; Өөрийгөө жаахан шагнамаар санагдсан; Уйдсан; Ядарсан; Дараа өлсөхөөс санаа зовсон; Харагдаад эсвэл үнэртээд идмээр болсон; Татгалзах эвгүй байсан; Хамгийн амар сонголт тэр байсан; Бие эвгүйрхэх вий гэж санаа зовсон; Мөчлөгийн тодорхой өдрүүдэд илүү хүчтэй болдог; Мэдэхгүй | Hidden food function | hungerSafety, reward, regulation, executive, circadian, cue, social, glucose | quick_recovery, decompression, comfort, self_reward, hunger_safety, visible_snacks, food_photo_cue, social_table, low_friction_default, medical_concern | Very high | REMAP | Core driver-stack question. |
| `S1-F02` | Идсэний дараа хамгийн түрүүнд юу мэдрэгддэг вэ? | Тайвширдаг; Сэтгэл ханамж; Түр гайгүй болоод гэмшдэг; Шууд гэмшдэг; Бие гайгүй; Одоо бүх юм дууссан; Маргааш чанга барина; Өөрчлөлтгүй; Мэдэхгүй | After-effect | regulation, reward, collapse, glucose | decompression, comfort, guilt, shame, loss_of_control_feeling, control_regain | Very high | REMAP | Add `escape_from_shame` mapping. |
| `S1-V01` | Сүүлийн үед төлөвлөөгүй идсэн хамгийн тод нэг мөчөө богино тайлбарлаарай. Юуны дараа болсон бэ? Тэр үед өлсөж байсан уу? Ямар мэдрэмж давамгай байсан бэ? Идсэний дараа юу өөрчлөгдсөн бэ? | text | Vulnerable moment narrative | summary tags | all driver keys depending content | Very high | KEEP | Closest existing question to target vulnerable moment. |
| `S1-R01` | Өлсөөгүй байсан ч ‘нэг гоё юм идмээр байна’ гэж санагддаг үе байдаг уу? | Үгүй; Хааяа; Нэлээд олон удаа; Бараг өдөр бүр; Өдөрт олон удаа | Reward/craving frequency | reward | self_reward, comfort, emptiness, low_friction_default | Medium | REMAP | Keep but avoid single-type overfit. |
| `S1-R02` | Энэ хүсэл ихэвчлэн ямар үед гардаг вэ? | Уйдсан үед; Өдрийн төгсгөлд өөрийгөө жаахан баярлуулмаар санагдах үед; Ажлын дараа амармаар санагдах үед; Амт, үнэр, мэдрэмж татах үед; Хоолны зураг эсвэл захиалгын апп харахад; Стресс ихтэй үед; Ганцаардсан үед; Сарын тэмдэг ирэхийн өмнөх өдрүүдэд; Мэдэхгүй | Reward context | reward, regulation, cue, social | emptiness, self_reward, decompression, loneliness_soothing, food_photo_cue, delivery_app, stress, loneliness | High | REMAP | Good overlap question. |
| `S1-R03` | Заримдаа идэхээс өмнөх хүсэл нь идэж байх үеийн сэтгэл ханамжаас илүү хүчтэй байдаг уу? | Үгүй; Ховор; Заримдаа; Ихэвчлэн; Бараг үргэлж | Anticipatory craving | reward | food_photo_cue, delivery_app, visible_snacks, self_reward | Medium | REMAP | Useful cue/reward separator. |
| `S1-E01` | Стресс ихтэй өдөр орой ‘ямар нэг юм идээд жаахан амсхийе’ гэж бодогдох үе байдаг уу? | Бараг үгүй; Хааяа; Нэлээд давтагддаг; Ихэвчлэн тэгдэг; Заримдаа идэж чаддаггүй | Stress eating | regulation | stress, decompression, quick_recovery, evening_hunger | High | REMAP | Strong psychology + vulnerable time. |
| `S1-E02` | Идэх хүсэлтэй хамгийн их холбогддог мэдрэмж аль нь вэ? | Стресс; Уур; Гуниг; Ганцаардал; Санаа зовнил; Ядаргаа; Хоосон мэт мэдрэмж; Баяртай эсвэл өөрийгөө шагнамаар үе; Мэдэхгүй | Emotion driver | regulation, social, executive, circadian, reward | stress, anger_resentment, loneliness, anxiety, fatigue, emptiness, self_reward | Very high | REMAP | Excellent direct psychology coverage. |
| `S1-E03` | Идсэний дараа таны мэдрэмж ихэвчлэн яаж өөрчлөгддөг вэ? | Тайвширдаг; Түр тайвширдаг; Өөрчлөгдөхгүй; Гэмшдэг; Илүү их санаа зовдог | Function and aftermath | regulation, collapse | decompression, comfort, guilt, anxiety, shame | High | REMAP | Distinguishes function from rebound. |
| `S1-G01` | Дараа өлсөх вий гэж бодоод урьдчилж идсэн үе байдаг уу? | Үгүй; Ховор; Заримдаа; Ихэвчлэн; Маш хүчтэй | Hunger safety | hungerSafety | hunger_safety, meal_gap, anxiety | High | REMAP | Direct match. |
| `S1-G02` | Дараагийн хоол тодорхойгүй үед та илүү идэх хандлагатай юу? | Үгүй; Ховор; Заримдаа; Тийм; Маш тод | Uncertainty hunger | hungerSafety | hunger_safety, low_friction_default, meal_gap | High | REMAP | Strong environment/body overlap. |
| `S1-G03` | Хоол үлдээхэд танд хэр хэцүү байдаг вэ? | Хэцүү биш; Заримдаа; Нэлээд хэцүү; Маш хэцүү; Анзаарч байгаагүй | Scarcity/satiety | hungerSafety | hunger_safety, loss_of_control_feeling, body-state history | Medium | REMAP | Needs careful non-shaming wording later. |
| `S1-X01` | Хоол багасгах, хориглох үед танд хамгийн түрүүнд юу мэдрэгддэг вэ? | Тайван; Өлсөхөөс санаа зовдог; Уур/эсэргүүцэл; Идэх юм бодогдоно; Бие сулрах вий гэж айдаг; Хэсэг сайн яваад дараа нь үргэлжлүүлэхэд хэцүү болдог | Restriction response | hungerSafety, autonomy, reward, physiological, collapse | strict_diet, fasting_rebound, carb_cut_rebound, anger_resentment, hunger_safety, quick_recovery | Very high | REMAP | Core new principle question. |
| `S1-X02` | Хориглосон хоол улам их бодогдох үе байдаг уу? | Үгүй; Ховор; Заримдаа; Ихэвчлэн; Бараг үргэлж | Restriction rebound | reward, collapse | strict_diet, all_or_nothing, carb_cut_rebound, punishment_restriction | High | REMAP | Keep. |
| `S1-X03` | Нэг удаа хазайхаар ‘өнөөдөр өнгөрлөө’ гэж бодоод цааш нь тавьчихдаг уу? | Бараг үгүй; Хааяа; Нэлээд тэгдэг; Ихэвчлэн тэгдэг; Маш хүчтэй | All-or-nothing | collapse, perfectionism | all_or_nothing, monday_restart, loss_of_control_feeling, escape_from_failure | Very high | REMAP | Direct match. |
| `S1-V02` | Хоол хасах, мацаг барих, эсвэл “маргаашаас эхэлнэ” гэж бодох үед таны биед, сэтгэлд юу хамгийн түрүүнд мэдрэгддэг вэ? | text | Restriction narrative | summary tags | strict_diet, fasting_rebound, anxiety, anger_resentment, shame | Very high | KEEP | Good for interaction evidence. |
| `S1-L01` | Юу хийхээ мэдэж байсан ч хийх тэнхээ үлдээгүй үе хэр олон байдаг вэ? | Бараг үгүй; Заримдаа; 7 хоногт хэд хэд; Бараг өдөр бүр; Маш их | Executive load | executive | fatigue, low_friction_default, quick_recovery | High | REMAP | Strong first gentle change driver. |
| `S1-L02` | Ядарсан үед хамгийн амархан олдох сонголт юу болдог вэ? | Урьдчилж бэлдсэн хоол; Хоол захиалах; Ойр байсан зууш; Хоол алгасах; Гэрт байсан амар сонголт; Чихэртэй ундаа/кофе; Мэдэхгүй | Low-friction default | executive, cue, hungerSafety, reward, circadian | delivery_app, nearby_store, visible_snacks, low_friction_default, meal_gap, fatigue | Very high | REMAP | Excellent environment/habit mapping. |
| `S1-L03` | Хоол бэлдэхэд хамгийн их саад болдог зүйл юу вэ? | Цаг; Ядаргаа; Юу хийхээ шийдэх; Дэлгүүр/материал; Бусдын хэрэгцээ; Орчин; Мэдэхгүй | Preparation friction | executive, social | fatigue, low_friction_default, cafeteria/nearby_store, social_table | High | MODIFY | Add delivery/nearby store/cafeteria clarity later. |
| `S1-L04` | Гэр/ажил дээр зууш харагдаж байвал танд юу тохиолддог вэ? | Нөлөөлөхгүй; Заримдаа иддэг; Ихэвчлэн иддэг; Харагдвал бараг автоматаар иддэг; Зууш ил байлгадаггүй | Visible snack cue | cue | visible_snacks, low_friction_default | High | REMAP | Direct match. |
| `S1-L05` | Хоолны зураг, үнэр, эсвэл захиалгын апп харахад идэх хүсэл гэнэт нэмэгддэг үү? | Үгүй; Ховор; Заримдаа; Ихэвчлэн; Маш хүчтэй | Media/app cue | cue, reward | food_photo_cue, delivery_app, visible_snacks | High | REMAP | Direct match. |
| `S1-N01` | Сүүлийн үед дундаж нойр тань ямар байна вэ? | 4 цагаас бага; 4-6 цаг; 6-8 цаг; 8+ цаг; Чанар муу; Тогтворгүй | Sleep rhythm | circadian, medical | sleep_disruption, fatigue, medical_concern | High | REMAP | Add shift-work question later. |
| `S1-N02` | Нойр муу хоносны маргааш амттай юм руу илүү амархан татагддаг уу? | Үгүй; Ховор; Заримдаа; Ихэвчлэн; Маш тод | Sleep -> craving | circadian, reward | sleep_disruption, fatigue, quick_recovery, self_reward | High | REMAP | Strong body/food-function interaction. |
| `S1-N03` | Хурхиралт, өдөр нойрмоглох, өглөө ядрах шинж байна уу? | Хурхирдаг; Өдөр нойрмоглодог; Өглөө ядруу сэрдэг; Унтаж байхдаа амьсгал зогсох мэт болдог гэж хэлж байсан; Аль нь ч үгүй; Мэдэхгүй | Sleep medical concern | medical, circadian | sleep_disruption, fatigue, medical_red_flag, professional_first | High | REMAP | Keep safety/professional-first tone. |
| `S1-B01` | Хоол холдоход дараах шинжээс илэрдэг үү? | Гар салгалах; Зүрх дэлсэх; Хөлрөх; Толгой эргэх; Толгой өвдөх; Сахар унасан мэт; Будилах/ухаан балартах; Аль нь ч үгүй | Body response | physiological, glucose, medical | meal_gap, medical_concern, medical_red_flag, professional_first | Very high | REMAP | Urgent if confusion/fainting. |
| `S1-B02` | Та сахар эсвэл даралтаа хэмжиж үзсэн үү? | Үгүй; Тийм, хэвийн; Тийм, бага сахар гарч байсан; Тийм, өндөр даралт гарч байсан; Тийм, санаа зовоосон | Measured body data | glucose, medical | medical_concern, medical_red_flag, professional_first | High | REMAP | Preserve professional-first boundary. |
| `S1-B03` | Инсулин эсвэл сахар бууруулах эм хэрэглэдэг үү? | Үгүй; Тийм; Мэдэхгүй | Medication safety | glucose, medical | medical_red_flag, professional_first | Very high | REMAP | Ordinary weight-loss experiment should not lead. |
| `S1-B04` | Огцом жин нэмэх, хавагнах, амьсгаадах, маш их ядрах зэрэг шинж байна уу? | Огцом жин нэмсэн; Хавагнадаг; Амьсгааддаг; Маш их ядардаг; Аль нь ч үгүй | Medical red flags | medical | medical_concern, medical_red_flag, fatigue, professional_first | Very high | REMAP | Keep. |
| `S1-B05` | Та жирэмсэн, төрсний дараах үе, эсвэл хөхүүл үе дээр байна уу? | Үгүй; Жирэмсэн; Төрсний дараах 0-6 сар; Төрсний дараах 6-24 сар; Хөхүүл; Хариулахгүй | Pregnancy/postpartum safety/context | medical | body_change_uncertainty, fatigue, sleep_disruption, medical_concern, professional_first | High | REMAP | Should influence gentle changes and safety. |
| `MC-GATE` | Сарын тэмдгийн мөчлөгтэй холбоотой асуулт танд хамаарах уу? | Тийм, хамаарна; Үгүй, хамаарахгүй; Хариулахгүй | Conditional menstrual module | none | body_change_uncertainty, medical_concern | Medium | KEEP | Good gate. |
| `MC-INTRO` | Дараагийн хэдэн асуулт сарын тэмдгийн мөчлөгтэй холбоотой. Зарим хүний хоолны дуршил, амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа мөчлөгийн тодорхой өдрүүдэд өөрчлөгддөг. Хэрвээ танд хамаарахгүй эсвэл хариулахыг хүсэхгүй бол алгасаж болно. | n/a | Context and consent | none | shame/stigma reduction | Low | KEEP | Good tone. |
| `MC-01` | Таны сарын тэмдгийн мөчлөг ихэвчлэн ямар байдаг вэ? | Тогтмол, ойролцоогоор 21–35 хоног; Заримдаа зөрдөг; Ихэнхдээ тогтмол биш; Сүүлийн 3 сард ирээгүй; Мэдэхгүй; Хариулахгүй | Cycle regularity | menstrual safety via helper | medical_concern, medical_red_flag, professional_first | High | REMAP | Important safety/context. |
| `MC-02` | Сүүлийн сарын тэмдгийн эхний өдөр ойролцоогоор хэдийд байсан бэ? | Өнөөдөр–5 хоногийн дотор; 6–13 хоногийн өмнө; 14–17 хоногийн өмнө; 18–28 хоногийн өмнө; 28 хоногоос дээш; Сайн мэдэхгүй; Хариулахгүй | Cycle timing | menstrual context | body_change_uncertainty | Medium | KEEP | Use as confidence modifier, not deterministic diagnosis. |
| `MC-03` | Мөчлөгийн аль үед таны идэх хүсэл хамгийн их өөрчлөгддөг вэ? | Мөчлөгтэй холбоо анзаардаггүй; Сарын тэмдэг ирэхээс хэд хоногийн өмнө; Сарын тэмдэг ирж байх үед; Сарын тэмдэг дууссаны дараах өдрүүдэд; Овуляцийн орчим гэж боддог; Тодорхой биш; Хариулахгүй | Appetite timing | menstrual context | body_change_uncertainty, evening_hunger, self_reward, fatigue | High | REMAP | Good body/rhythm layer. |
| `MC-04` | Сарын тэмдэг ирэхийн өмнөх өдрүүдэд танд аль нь илүү ойр байдаг вэ? | Илүү өлсдөг; Амттай юм, гурилан зүйл илүү хүсдэг; Давслаг, шарсан зүйл илүү хүсдэг; Сэтгэл санаа савлах үед идэх хүсэл нэмэгддэг; Ядаргаа, нойр муудахтай давхцдаг; Хавагнах эсвэл бие хүнд оргих мэдрэмж нэмэгддэг; Онц ялгаа анзаардаггүй; Хариулахгүй | Premenstrual driver stack | menstrual context | evening_hunger, fatigue, sleep_disruption, stress, anxiety, comfort, medical_concern | Very high | REMAP | Strong interaction evidence. |
| `MC-05` | Тэр үед таны хоолны хэмжээ эсвэл хооллох давтамж яаж өөрчлөгддөг вэ? | Өөрчлөгддөггүй; Жаахан нэмэгддэг; Нэлээд нэмэгддэг; Ойр ойрхон идмээр болдог; Өвдөлт, дотор муухайралтаас болоод багасдаг; Тодорхой хэлж мэдэхгүй; Хариулахгүй | Cycle impact | menstrual context | evening_hunger, quick_recovery, medical_concern | High | REMAP | Keep. |
| `MC-06` | Та одоогоор дараахаас аль нэгэнд хамаарах уу? | Дааврын жирэмслэлтээс хамгаалах хэрэгсэл хэрэглэдэг; PCOS оноштой эсвэл сэжигтэй; Төрсний дараах эсвэл хөхүүл үе; Перименопауз байж магадгүй; Аль нь ч биш; Хариулахгүй | Cycle modifier | menstrual/professional context | medical_concern, body_change_uncertainty, professional_first | High | REMAP | Keep safety cautious. |
| `MC-07` | Мөчлөг тогтмол бус болох, ирэхээ болих, эсвэл их өөрчлөгдөх нь хоол хасалт, жин огцом буурах, эсвэл хэт их дасгалтай давхцаж байсан уу? | Тийм; Үгүй; Сайн мэдэхгүй; Хариулахгүй | Restriction + cycle safety | professional-first helper | strict_diet, punishment_restriction, medical_red_flag, professional_first | Very high | REMAP | Direct safety/restriction interaction. |
| `S1-S01` | Идэх үедээ хяналтаа алдсан мэт мэдрэмж хүчтэй гардаг уу? | Үгүй; Ховор; Заримдаа; Ихэвчлэн; Маш хүчтэй | Loss-of-control safety | collapse | loss_of_control_feeling, binge_risk, professional_first | Very high | REMAP | Should be upgraded in safety taxonomy. |
| `S1-S02` | Идсэний дараа нуух, ичих, ганцаараа баймаар санагдах мэдрэмж хэр хүчтэй байдаг вэ? | Үгүй; Ховор; Заримдаа; Ихэвчлэн; Маш хүчтэй | Shame/body image safety | collapse | shame, guilt, escape_from_shame, severe_body_distress, binge_risk | Very high | REMAP | Strong shame/stigma layer. |
| `S1-S03` | Идсэнээ “нөхөх” гэж бөөлжүүлэх, туулгах, хэт их дасгал хийх, эсвэл олон цаг хоолгүй байх тохиолдол гардаг уу? | Үгүй; Өмнө байсан; Одоо хааяа; Одоо давтагддаг; Хариулахгүй | Compensatory behavior | safety via flags/metadata | compensatory_behavior, punishment_restriction, professional_first | Very high | REMAP | Must remain professional-first. |
| `S1-S04` | Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү? | Үгүй; Өнгөрсөнд байсан; Одоо хааяа бодогддог; Одоо идэвхтэй бодогдож байна; Хариулахгүй | Urgent safety | urgent/professional | professional_first | Very high | REMAP | Mode4 urgent should override product. |
| `S1-V03` | Өмнө хэрэглэсэн ч хамгийн удаан үргэлжлээгүй аргаа бодоорой. Тэр арга яагаад эхэндээ ажилласан, дараа нь яагаад үргэлжлээгүй гэж та боддог вэ? | text | Failed-method narrative | summary tags | strict_diet, fasting_rebound, carb_cut_rebound, all_or_nothing, shame | Very high | KEEP | Great migration evidence. |
| `S1-V04` | 'Би яг ___ байвал илүү тогтвортой явж чадна' гэж өгүүлбэрийг дуусгаад тайлбарлаарай. | text | Self-theory/need | summary tags | wrong self-explanation, fatigue, environment trigger, support need | High | KEEP | Useful for first gentle change. |

## Daily Diary Questions

| Question ID / location | Current Mongolian question text | Current answer options | Current purpose | Drivers it already detects | Drivers it could detect if remapped | Report evidence usefulness | Decision | Notes |
|---|---|---|---|---|---|---|---|---|
| `D-C01` | Өнөөдөр хоолны хэмнэл ямархуу өнгөрөв? | Тогтуун, хоол алгасаагүй; Нэг хоол алгассан; Хоол хоорондын зай хэтэрсэн; Өдөр бага идээд орой нөхсөн; Юу идснээ сайн санахгүй байна | Daily meal rhythm | hungerSafety/circadian tags | meal_gap, evening_hunger, fasting_rebound | Very high | REMAP | Core 7-day confirmation. |
| `D-C02` | Өнөөдөр ‘ингэе гэж бодоогүй байсан ч’ идэж, уусан зүйл гарсан уу? | Үгүй; Тийм, нэг удаа; Тийм, хоёр удаа; Тийм, гурваас олон удаа | Unplanned frequency | cue baseline | low_friction_default, loss_of_control_feeling, binge_risk if severe | High | REMAP | Good diary outcome signal. |
| `D-C03` | Тэр үе ихэвчлэн хэзээ байсан бэ? | Өглөө; Өдөр; Орой; Шөнө; Хүмүүстэй хамт байх үед; Өнөөдөр тийм зүйл гараагүй | Vulnerable time | evening/social tags | evening_hunger, social_table, shift_work | Very high | REMAP | Add vulnerable moment output. |
| `D-C04` | Тэр үед та үнэхээр өлссөн байсан уу? 0 = огт өлсөөгүй, 10 = маш их өлссөн | scale 0-10 | Hunger intensity | high/low hunger tags | meal_gap, hunger_safety, comfort/reward distinction | High | REMAP | Strong hidden-function separator. |
| `D-C05` | Тэр хүслийг юутай хамгийн ойр тайлбарлах вэ? | Өлссөндөө; Амттай юм идмээр байсан; Тайвширмаар байсан; Өөрийгөө жаахан шагнамаар байсан; Уйдсан; Ядарсан; Дараа өлсөхөөс санаа зовсон; Харагдаад эсвэл үнэртээд идмээр болсон; Татгалзах эвгүй байсан; Хамгийн амар нь тэр байсан; Бие эвгүйрхэх вий гэж санаа зовсон; Сарын тэмдэгтэй холбоотой мэт санагдсан | Daily food function | reward/regulation/hunger/cue/social/body | quick_recovery, decompression, comfort, self_reward, hunger_safety, visible_snacks, social_table | Very high | REMAP | Core daily confirmation. |
| `D-C06` | Өнөөдөр сэтгэлд хамгийн их үлдсэн мэдрэмж аль нь байсан бэ? | Тайван; Стресс; Ууртай; Гунигтай; Ганцаардсан; Санаа зовсон; Ядарсан; Хоосон юм шиг; Өөрийгөө баярлуулмаар санагдсан; Сайн ялгахгүй байна | Daily emotion | regulation/reward/executive tags | stress, anger_resentment, loneliness, anxiety, fatigue, emptiness, self_reward | Very high | REMAP | Excellent psychology confirmation. |
| `D-C07` | Өнөөдрийн стрессийг 0–10 дээр тавивал хэд орчим байсан бэ? | scale 0-10 | Stress intensity | regulation | stress, decompression | High | REMAP | Keep. |
| `D-C08` | Орой болоход тэнхээ хэр үлдсэн байсан бэ? 0 = огт үлдээгүй, 10 = хангалттай байсан | scale 0-10 | Energy/fatigue | executive/circadian | fatigue, sleep_disruption, quick_recovery | Very high | REMAP | Core vulnerable-moment driver. |
| `D-C09` | Өчигдөр шөнө хэр унтсан бэ? | 4 цагаас бага; 4–6 цаг; 6–8 цаг; 8 цагаас дээш; Олон сэрсэн, чанар муу; Сайн амарсан | Sleep | circadian | sleep_disruption, fatigue | High | REMAP | Keep. |
| `D-C10` | Өнөөдөр та юу юу уув? | Хар кофе; Сүүтэй кофе; Сүүтэй цай; Жүүс / хийжүүлсэн ундаа; Сэргээх ундаа; Алкоголь; Ус голдуу; Онцгой зүйл байгаагүй | Drinks/context | partial circadian/social | alcohol_context, fatigue, sleep_disruption | Medium | REMAP | Alcohol should be explicit environment trigger. |
| `D-C11` | Хоол холдох үед эсвэл орой биеэр ямар нэг шинж мэдрэгдсэн үү? | Гар салгалах; Зүрх дэлсэх; Хөлрөх; Толгой эргэх; Толгой өвдөх; Сахар унасан мэт санагдах; Хавагнах; Аль нь ч үгүй | Body signals | glucose/physiological/medical | medical_concern, medical_red_flag, meal_gap | Very high | REMAP | Preserve safety guardrail. |
| `D-C12` | Өнөөдрийн хөдөлгөөн хэр байсан бэ? | Маш бага; Бага зэрэг алхсан; 20+ минут хөдөлсөн; Дасгал хийсэн; Өвдөлт/ядаргаанаас болоод бараг хөдөлсөнгүй | Movement/body state | weak | fatigue, medical_concern, punishment_restriction if paired | Medium | MODIFY | Not central but useful. |
| `D-C13` | Өнөөдөр төлөвлөөгүй идэлт гараагүй бол ямар нөхцөл тусалсан бэ? | text | Protective condition | narrative tags | low_friction_default, visible_snacks absence, first gentle change | High | KEEP | Important for easiest change. |
| `D-V01` | Өнөөдрийн идэлтэд хамгийн их нөлөөлсөн нэг мөчийг богино тайлбарлаарай. Юуны дараа болсон бэ? Тэр үед өлсөж байсан уу? Ямар мэдрэмж давамгай байсан бэ? Идсэний дараа юу өөрчлөгдсөн бэ? | text | Daily vulnerable moment | summary tags | all driver keys depending content | Very high | KEEP | Best diary confirmation source. |
| `D-SUM01` | Тайлбар хадгалагдлаа | Үргэлжлүүлэх; Засах; Нэмэх зүйл байна | Confirmation UX | summary confirmation | report evidence trust | High | KEEP | Preserve user-confirmed evidence concept. |
| `D-MC-01` | Өнөөдөр мөчлөгийнхөө аль үедээ байгаа гэж бодож байна? | Сарын тэмдэг ирж байна; Дууссанаас хойш эхний өдрүүд; Овуляцийн орчим гэж бодож байна; Ирэхээс өмнөх өдрүүд; Мэдэхгүй; Хамаарахгүй | Daily cycle context | menstrual tags | body_change_uncertainty, fatigue, evening_hunger | Medium | REMAP | Keep optional. |
| `D-MC-02` | Өнөөдрийн идэх хүсэл мөчлөгтэй холбоотой юм шиг санагдсан уу? | Үгүй; Бага зэрэг; Тийм, илүү өлссөн; Тийм, амттай юм илүү хүссэн; Тийм, сэтгэл санаатай хамт хүчтэй болсон; Тийм, ядаргаа/нойртой давхцсан | Cycle-function link | menstrual tags | hunger_safety, self_reward, stress/anxiety, fatigue | High | REMAP | Strong interaction. |
| `D-MC-03` | Өнөөдөр өвдөлт, хавагналт, ядаргаа, нойр муудах зэрэг нь хоолны сонголтод нөлөөлсөн үү? | Үгүй; Бага зэрэг; Дунд зэрэг; Их | Cycle/body impact | menstrual/body tags | fatigue, sleep_disruption, medical_concern | High | REMAP | Keep. |

## Adaptive Probe Questions

| Question ID / location | Current Mongolian question text | Current answer options | Current purpose | Drivers it already detects | Drivers it could detect if remapped | Report evidence usefulness | Decision | Notes |
|---|---|---|---|---|---|---|---|---|
| `D-P-R01` | Өнөөдөр өлсөөгүй байсан ч ‘нэг гоё юм идмээр байна’ гэсэн хүсэл төрсөн үү? | Үгүй; Бага зэрэг; Тодорхой; Маш хүчтэй | Reward probe | reward | self_reward, comfort, emptiness | High | REMAP | Keep as adaptive confirmation. |
| `D-P-R02` | Өдөржин өөртөө нэг ч таатай зүйл өгөөгүй юм шиг санагдаад, орой хоолоор нөхмөөр үе байсан уу? | Үгүй; Бага зэрэг; Тийм; Маш тод | Reward deficit | rewardDeficit | self_reward, emptiness, comfort | Very high | REMAP | Excellent hidden-function probe. |
| `D-P-HS01` | Өнөөдөр дараа өлсөх вий гэж бодоод урьдчилж идсэн үе байсан уу? | Үгүй; Бага зэрэг; Тийм; Маш хүчтэй | Hunger safety | hungerSafety | hunger_safety, anxiety | High | REMAP | Direct match. |
| `D-P-HS02` | Хоолны цаг тодорхойгүй болох үед та илүү их идсэн үү? | Үгүй; Заримдаа; Тийм | Meal uncertainty | hungerSafety | meal_gap, hunger_safety, low_friction_default | High | REMAP | Direct match. |
| `D-P-FR01` | Хоол идсэний дараа сэтгэл түр намдах шиг болсон уу? | Үгүй; Бага зэрэг; Тийм; Маш тод | Regulation | regulation | decompression, comfort, stress/anxiety | High | REMAP | Direct match. |
| `D-P-FR02` | Идсэний дараа таны мэдрэмж яаж өөрчлөгдсөн бэ? | Тайвширсан; Түр тайвширсан; Өөрчлөгдөөгүй; Гэмшсэн | After-effect | regulation/collapse | decompression, guilt, shame | High | REMAP | Good cycle confirmation. |
| `D-P-EL01` | Юу хийхээ мэдэж байсан ч хийх тэнхээ үлдээгүй үе байсан уу? | Үгүй; Бага зэрэг; Тийм; Маш их | Executive load | executive | fatigue, low_friction_default | High | REMAP | Direct first-change probe. |
| `D-P-EL02` | Тэр үед хамгийн амархан олдох сонголт л ялсан уу? | Урьдчилж бэлдсэн хоол; Хоол захиалах; Ойр байсан зууш; Хоол алгассан; Гэрт байсан амар сонголт | Default choice | executive/decisionDefault | delivery_app, visible_snacks, nearby_store, low_friction_default, meal_gap | Very high | REMAP | Add cafeteria/store later. |
| `D-P-CC01` | Бага зэрэг хазайсны дараа ‘өнөөдөр өнгөрлөө’ гэж бодогдсон уу? | Үгүй; Бага зэрэг; Тийм; Маш хүчтэй | Collapse | collapse | all_or_nothing, monday_restart, loss_of_control_feeling | High | REMAP | Direct match. |
| `D-P-CC02` | Дараа нь ‘маргааш илүү чанга барина’ гэж бодогдсон уу? | Үгүй; Тийм | Punishment restriction | collapse | monday_restart, punishment_restriction, strict_diet | High | REMAP | Direct match. |
| `D-P-GP01` | Өнөөдөр хоол холдоход биеийн хүчтэй шинж гарсан уу? | Үгүй; Гар салгалах; Зүрх дэлсэх; Хөлрөх; Толгой эргэх; Будилах / ухаан балартах | Glucose/body probe | glucose/medical | medical_concern, medical_red_flag, professional_first | Very high | REMAP | Urgent option must remain guarded. |
| `D-P-GP02` | Өнөөдөр сахар эсвэл даралт хэмжсэн үү? | Үгүй; Тийм, хэвийн; Тийм, бага/өндөр гарсан; Тийм, санаа зовоосон | Measured signal | glucose/medical | medical_concern, medical_red_flag, professional_first | High | REMAP | Keep. |
| `D-P-CE01` | Нойр дутуу эсвэл оройн тэнхээ багассан нь өнөөдрийн идэх хүсэлд нөлөөлсөн үү? | Үгүй; Бага зэрэг; Тийм; Маш тод | Circadian | circadian | sleep_disruption, fatigue, evening_hunger, quick_recovery | High | REMAP | Direct match. |
| `D-P-CU01` | Хоол харагдах, үнэртэх, эсвэл захиалгын апп харах үед идэх хүсэл нэмэгдсэн үү? | Үгүй; Бага зэрэг; Тийм; Маш тод | Cue | cue | visible_snacks, delivery_app, food_photo_cue | High | REMAP | Direct match. |

## Missing Questions To Add Later

- Shift-work schedule and post-shift eating: `shift_work`, `sleep_disruption`, `fatigue`, `nearby_store`.
- Cafeteria/office food and nearby-store default: `cafeteria`, `nearby_store`, `low_friction_default`.
- Alcohol/social event context: `alcohol_context`, `social_table`, `monday_restart`.
- Loneliness/emptiness as distinct food functions: `loneliness_soothing`, `emptiness`, `belonging`.
- Shame/body-image/stigma severity beyond eating aftermath: `severe_body_distress`, `escape_from_shame`, `body_change_uncertainty`.
- Explicit binge-risk frequency/episode pattern: `binge_risk`, `loss_of_control_feeling`, `professional_first`.



# Report Module Map

This file maps current report modules to the new target report questions. It is audit-only and does not prescribe copy changes for the current runtime.

## Current Report Modules

| Current module / function | Current output role | New target report question served | Current strength | Migration note |
|---|---|---|---|---|
| `renderReport()` | Main report router: safety mode, paywall/readiness, one-time/full report branching | All | Strong | Keep as orchestrator; later separate calculation from rendering. |
| `reportMode()` | Chooses `deep`, `check`, `professional`, or `urgent` | Safety / professional-first | Strong | Remap to safety keys: `medical_red_flag`, `compensatory_behavior`, `severe_body_distress`, `professional_first`. |
| `rankedPatterns()` | Ranks primary/secondary mechanisms | Primary + secondary drivers | Strong | Rename/remap mechanism keys to driver-stack output. |
| `calculateMechanismEvidence()` | Builds evidence from stage answers, summaries, diary entries | Driver scores, primary/secondary/supporting drivers | Strong | This is the migration anchor. |
| `identifyMechanismCombinations()` | Detects mechanism interactions | Primary + secondary + interaction | Medium | Expand to explicit interaction explanations using new keys. |
| `renderSimpleResultSection()` | Four-card summary: stuck moment, meaning, first step, avoid for now | Vulnerable moment; visible condition; wrong self-explanation; first gentle change | Strong | Already close to target; standardize fields. |
| `renderSurfaceHiddenSection()` | Visible condition vs hidden mechanism | Visible condition; hidden function | Strong | Keep concept; map to new layer names. |
| `renderHumanReadableReport()` | Main modern report body | Most target questions | Strong | Current primary report renderer. |
| `renderOneTimeReport()` | Currently returns `renderHumanReadableReport()` immediately; older body after return is dead code | One-time report | Mixed | Dead code should not be changed now, but migration should remove or archive later. |
| `REPORT_VOICE_LIBRARY` and `reportVoiceFor()` | Pattern-specific narrative, cycle, first step, experiment | Wrong self-explanation; first gentle change; 14-day experiment | Strong | Needs driver-stack composition instead of one voice dominating. |
| `getSimpleResultSummary()` | Simple summary per voice | Vulnerable moment; meaning; first step; avoid | Strong | Remap output to standard `driver_stack_summary`. |
| `foodFunctionIntro()` | Explains function food serves | Hidden function | Strong | Map to food-function keys. |
| `cycleMapSteps()` | Explains repeated loop | Interaction / vulnerable moment | Medium | Good structure; should become interaction-aware and driver-stack-aware. |
| `refinementBullets()` | Explains what 7-day diary can clarify | 7-day diary confirmation | Medium | Needs stronger confirmation contract. |
| `renderStagedExperiment()` | Shows staged experiment paragraphs | 14-day experiment | Strong | Good, but experiment should be generated from first gentle change and driver stack. |
| `professionalCheckHtml()` | Professional-check note | Safety/professional-first | Strong | Keep untouched until safety migration. |
| `bodySafetyPauseHtml()` | Body shame/visibility caution | Shame/body image/stigma; safety | Medium | Important, but should map to explicit `severe_body_distress` threshold. |
| `menstrualCycleContextHtml()` | Cycle context note | Body/rhythm and medical concern | Medium | Good body-rhythm module; should be folded into driver stack as context/interaction. |

## Target Report Questions

| Target question | Current coverage | Gap |
|---|---|---|
| 1. What is the user’s most vulnerable moment? | Partly covered by `getSimpleResultSummary().stuckMoment`, `D-V01`, `triggerMapRows()`, and `beforeEatingItems()`. | Needs explicit canonical field that combines time + state + trigger, e.g. "орой + тэнхээ багассан + хоолны зай уртссан". |
| 2. What visible condition is present? | Covered by `renderSurfaceHiddenSection()` and context helpers. | Needs stable mapping from answers to visible condition, not only voice-key heuristic. |
| 3. What hidden function is food serving? | Covered by `foodFunctionIntro()`, `hiddenFunctionItems()`, and `REPORT_VOICE_LIBRARY.needs`. | Needs standardized food-function keys: `quick_recovery`, `decompression`, `comfort`, etc. |
| 4. What secondary drivers are also active? | Covered by `secondaryMechanisms` and `compressedSecondaryPatterns()`. | Output should explicitly show primary + secondary + why secondary matters. |
| 5. What wrong self-explanation may be making it worse? | Covered by `notProblem`, `notRealProblemCopy()`, `previousAttemptsCopy()`. | Needs explicit field tied to shame/restriction/rebound drivers. |
| 6. What is the first gentle change? | Covered by `firstStep`, `leveragePoint()`, and voice experiments. | Should be chosen by lowest-friction modifiable driver, not just primary mechanism. |
| 7. What should the 14-day experiment test? | Covered by `renderStagedExperiment()` and `experimentFor()`. | Needs consistent hypothesis format: "If we change X, then Y vulnerable moment should soften." |
| 8. What should the 7-day diary confirm? | Covered by `refinementBullets()`, `reportReadiness()`, `triggerMapRows()`. | Needs explicit confirmation metrics for primary, secondary, interaction, and safety. |

## Current Report Mode Assessment

| Mode | Current behavior | Migration handling |
|---|---|---|
| `deep` / mode1 | Ordinary report with primary pattern, hidden function, cycle, first step, 14-day experiment. | Keep and remap to driver-stack. |
| `check` / mode2 | Ordinary report plus professional-check caution when body signals are notable. | Keep; tie to `medical_concern` and avoid unsafe experiments. |
| `professional` / mode3 | Suppresses ordinary report and ordinary 14-day experiment; gives professional-first summary. | Preserve as safety invariant. |
| `urgent` / mode4 | Suppresses ordinary report and directs immediate safety support. | Preserve as safety invariant. |

## Report Migration Shape

Recommended future internal report object:

```text
driver_scores
primary_driver
secondary_drivers
interaction_pattern
vulnerable_moment
visible_condition
hidden_food_function
wrong_self_explanation
first_gentle_change
fourteen_day_experiment
seven_day_confirmation_plan
safety_route
evidence_sources
```



# Experiment and Diary Map

## Current 7-Day Diary Flow

The 7-day flow is already present in `app.js`.

| Area | Current implementation | Notes for migration |
|---|---|---|
| Diary unlock | `renderUnlock()` shows 7-day readiness expectations and starts diary. | Do not change now. Later, make readiness explicitly about confirming driver stack. |
| Daily question selection | `getDiaryQuestions()` uses daily core questions, optional menstrual questions, and adaptive probes based on top preliminary mechanisms. | Strong foundation for driver confirmation. |
| No-unplanned-day branch | If `unplanned_eating_count === "Үгүй"`, diary asks a shorter flow and asks what helped. | Important for first gentle change and protective conditions. |
| Adaptive probes | `probeBank` adds driver-specific daily questions for reward, hunger safety, regulation, executive load, collapse, glucose, circadian, and cue. | Needs new probes for social/alcohol, loneliness/emptiness, shame/body image, nearby store/cafeteria, shift work. |
| Diary save | `saveDiaryEntry()` stores local entry, generated micro-insight, safety flags, and moves to report readiness at 5+ entries. | Good persistence shape for static MVP. |
| Readiness | `reportReadiness()` uses 0-1 insufficient, 2-3 limited, 4 usable but no full report, 5+ full report. | Good threshold; add confirmation criteria later. |
| Daily summary | `generateDailySummaryBullets()` and `createConfirmedSummaryObject()` convert structured answers and text into confirmed evidence tags. | Strong evidence-quality pattern. |
| Safety | `diaryEntrySafetyFlags()` catches urgent/professional terms from diary evidence. | Preserve as invariant. |

## Current 14-Day Experiment Flow

| Area | Current implementation | Notes for migration |
|---|---|---|
| Mechanism-level experiment | `mechanisms[*].experiment` contains short experiment copy for each old mechanism. | Useful but old taxonomy. |
| Voice-level staged experiment | `REPORT_VOICE_LIBRARY[*].experiment` and `renderStagedExperiment()` render staged 14-day experiments. | Current main report path uses this. |
| Older experiment object | `experimentFor()` builds goal/actions/track/success/recovery, but some old report code after early return is not currently reached. | Later cleanup should remove dead code or reuse it intentionally. |
| Safety suppression | Mode3/mode4 suppress ordinary 14-day experiment. | Must preserve. |
| Body-check modification | Mode2 adds caution against fasting/meal skipping/aggressive restriction. | Must preserve. |

## Mapping Current Diary Signals to New Drivers

| Current diary signal | Current source | New driver keys |
|---|---|---|
| Meal skipped / 5+ hour gap | `D-C01`, tags `skipped_meal`, `meal_gap_5h_plus` | `meal_gap`, `evening_hunger`, `hunger_safety` |
| Evening / night vulnerable time | `D-C03` | `evening_hunger`, `fatigue`, `sleep_disruption`, `shift_work` if added |
| High hunger | `D-C04` | `evening_hunger`, `hunger_safety`, `meal_gap` |
| Low hunger but craving | `D-C04` + unplanned count | `self_reward`, `comfort`, `decompression`, `visible_snacks`, `delivery_app` |
| Food function | `D-C05` | `quick_recovery`, `decompression`, `comfort`, `self_reward`, `hunger_safety`, `belonging`, `control_regain` |
| Daily emotion | `D-C06` | `stress`, `anxiety`, `anger_resentment`, `loneliness`, `emptiness`, `fatigue` |
| Stress score | `D-C07` | `stress`, `decompression` |
| Energy score | `D-C08` | `fatigue`, `sleep_disruption`, `quick_recovery`, `low_friction_default` |
| Sleep | `D-C09` | `sleep_disruption`, `fatigue` |
| Drinks/alcohol | `D-C10` | `alcohol_context`, `sleep_disruption`, `fatigue` |
| Body signals | `D-C11` | `medical_concern`, `medical_red_flag`, `professional_first` |
| Movement/pain/fatigue | `D-C12` | `fatigue`, `medical_concern`, possible `punishment_restriction` if paired with overexercise |
| What helped | `D-C13` | first gentle change candidates; `low_friction_default` inverse |
| Raw reflection | `D-V01` | all driver keys; highest narrative evidence |
| Menstrual daily context | `D-MC-*` | `body_change_uncertainty`, `fatigue`, `sleep_disruption`, `medical_concern`, interaction modifiers |

## What 7-Day Diary Should Confirm Later

The new product principle requires the diary to confirm a stack, not a type.

Recommended future confirmation contract:

| Confirmation target | Example evidence |
|---|---|
| Primary driver | Appears on 3+ diary days or has strong confirmed narrative evidence. |
| Secondary driver | Appears on 2+ diary days or repeatedly co-occurs with primary. |
| Interaction | Same combination appears at least twice, e.g. `meal_gap + fatigue + delivery_app`. |
| Vulnerable moment | Time/context repeats, e.g. "орой, хоолны зай уртссан, тэнхээ 3/10". |
| First gentle change | A helpful condition appears in no-unplanned or lower-intensity days. |
| Safety | Any urgent/professional signal overrides experiment and ordinary report. |

## Missing Diary Coverage

- Shift-work day/night rhythm.
- Nearby store/cafeteria default.
- Delivery app friction and food photo exposure as separate daily signals.
- Alcohol/social table context.
- Loneliness vs emptiness vs belonging.
- Shame/body image/stigma after eating or before tracking.
- Explicit compensatory behavior or overexercise daily safety check, with professional-first routing.



# Gap List

## High-Priority Conceptual Gaps

| Gap | Why it matters | Current partial coverage | Migration recommendation |
|---|---|---|---|
| New driver keys do not exist as canonical internal keys. | Target product needs `answers -> driver scores -> stack`, not old mechanism names. | Current mechanism keys are rich but named differently. | Add a mapping layer first; do not replace scoring directly. |
| Driver stack is not a first-class output object. | Product principle says one user is not one type. | `primaryMechanism`, `secondaryMechanisms`, `supportingMechanisms` exist inside evidence calculation. | Create a structured `driver_stack` object later. |
| Vulnerable moment is not canonical. | Report must answer the user's most vulnerable moment. | `stuckMoment`, `D-V01`, `triggerMapRows()`, and `beforeEatingItems()` exist. | Standardize `vulnerable_moment = time + body_state + emotion + environment + function`. |
| Secondary and interaction drivers are under-explained. | Stack logic requires interactions, not only top pattern. | `identifyMechanismCombinations()` exists. | Expand combinations using new driver keys and include them in report output. |
| 7-day diary confirmation is not explicit enough. | Diary should confirm primary, secondary, interaction, and first gentle change. | Readiness threshold and refinement bullets exist. | Add confirmation criteria before changing runtime. |
| Safety taxonomy is not aligned to requested keys. | Safety must remain professional-first and auditable. | Mode3/mode4 and body-check mode exist. | Map current flags to `binge_risk`, `compensatory_behavior`, `severe_body_distress`, `medical_red_flag`, `professional_first`. |

## Driver Coverage Gaps

| New layer | Strong current coverage | Weak/missing coverage |
|---|---|---|
| Body and rhythm | `meal_gap`, `evening_hunger`, `sleep_disruption`, `fatigue`, `medical_concern` | `shift_work` needs direct questions; `body_change_uncertainty` is indirect. |
| Psychology | `stress`, `anxiety`, `anger_resentment`, `loneliness`, `emptiness`, `shame`, `guilt`, `loss_of_control_feeling` | Loneliness/emptiness need clearer separation; shame/body image needs dedicated nonjudgmental mapping. |
| Food function | `decompression`, `comfort`, `self_reward`, `hunger_safety`, `control_regain` | `quick_recovery`, `loneliness_soothing`, `belonging`, `escape_from_shame`, `escape_from_failure` need explicit mapping. |
| Habit / environment | `visible_snacks`, `delivery_app`, `food_photo_cue`, `social_table`, `low_friction_default` | `nearby_store`, `cafeteria`, `alcohol_context` are weak or indirect. |
| Restriction / rebound | `all_or_nothing`, `monday_restart`, `strict_diet`, `fasting_rebound`, `carb_cut_rebound`, `punishment_restriction` | Carb-cut rebound is implied but not explicit enough; punishment restriction should connect to compensatory behavior. |
| Shame / body image / stigma | shame/guilt after eating, body-safety pause | Severe body distress and stigma context are not systematically scored. |
| Safety / professional-first | medical/professional/urgent modes | Need clearer mapping to requested safety keys and binge/compensatory thresholds. |

## Implementation Gaps To Address Later

- The report calculation and report rendering are tightly coupled in `app.js`.
- Old mechanism names and public voice keys are mixed with report generation.
- `renderOneTimeReport()` has unreachable older report code after an early `return renderHumanReadableReport(...)`.
- Tests validate current mechanism behavior but not the new driver taxonomy.
- The mock backend stores primary/secondary mechanisms but not the requested driver-stack shape.
- PDF export scripts may not reflect any future driver-stack report unless updated separately.

## Things That Are Not Gaps

- The current system is not a simple single-route report. It already ranks mechanisms and supports safety routes.
- The 7-day diary already exists and has readiness gates.
- User-confirmed narrative evidence already exists and should be preserved.
- Safety-first suppression of ordinary experiments already exists and should be preserved.



# Migration Recommendation

Recommendation: migrate in layers. Do not rewrite the questionnaire, scoring, report renderer, PDF, backend, QPay, pricing, entitlement, or app UI until the driver taxonomy is mapped and test-locked.

## Best Path

### Phase 1: Documentation and Mapping Only

Status: this work pack.

- Preserve current runtime files.
- Document current question, report, diary, safety, and experiment coverage.
- Define mapping from old mechanism keys to new driver keys.
- Identify missing questions and missing report contracts.

### Phase 2: Add a Non-Runtime Taxonomy Spec

Create a future planning doc or data spec that maps:

| Current mechanism | New driver candidates |
|---|---|
| `reward` | `self_reward`, `comfort`, `quick_recovery` |
| `regulation` | `stress`, `anxiety`, `decompression`, `comfort` |
| `hungerSafety` | `meal_gap`, `evening_hunger`, `hunger_safety`, `fasting_rebound` |
| `glucose` | `medical_concern`, `medical_red_flag`, `professional_first` |
| `satiety` | `loss_of_control_feeling`, `binge_risk` when severe |
| `cue` | `visible_snacks`, `delivery_app`, `food_photo_cue`, `low_friction_default` |
| `collapse` | `all_or_nothing`, `monday_restart`, `escape_from_failure`, `punishment_restriction` |
| `executive` | `fatigue`, `low_friction_default`, `quick_recovery` |
| `circadian` | `sleep_disruption`, `fatigue`, `evening_hunger` |
| `social` | `social_table`, `belonging`, `alcohol_context` if added |
| `medical` | `medical_concern`, `medical_red_flag`, `professional_first`, `body_change_uncertainty` |
| `autonomy` | `anger_resentment`, `strict_diet`, `punishment_restriction` |
| `physiological` | `medical_concern`, `meal_gap`, `quick_recovery` |
| `decisionDefault` | `low_friction_default`, `delivery_app`, `nearby_store`, `cafeteria` |
| `rewardDeficit` | `emptiness`, `self_reward`, `comfort` |
| `roleOverload` | `fatigue`, `self_reward`, `comfort`, `low_friction_default` |
| `shameAvoidance` | `shame`, `guilt`, `escape_from_shame`, `severe_body_distress` |
| `bodySafety` | `severe_body_distress`, `shame`, `escape_from_shame`, `professional_first` |
| `identity` | `shame`, `escape_from_failure`, wrong self-explanation |
| `perfectionism` | `all_or_nothing`, `strict_diet`, `monday_restart` |

### Phase 3: Add Test-Only Driver Stack Calculator

Before changing user-facing behavior, add a test-only or parallel calculator:

```text
current answers + diary
-> old mechanism evidence
-> new driver scores
-> primary driver
-> secondary drivers
-> interaction
-> vulnerable moment
-> first gentle change candidate
-> diary confirmation targets
```

This should not replace current report output until regression tests show parity and safety invariants.

### Phase 4: Add Missing Questions Carefully

Add only after mapping is stable:

- Shift work.
- Nearby store/cafeteria/default context.
- Alcohol/social table.
- Loneliness vs emptiness vs belonging.
- Shame/body-image/stigma severity.
- Compensatory behavior/binge-risk thresholds.

Do not rewrite existing questions wholesale. Most are useful and should be remapped first.

### Phase 5: Report Contract Migration

Introduce a report object before changing copy:

```text
{
  driver_scores,
  primary_driver,
  secondary_drivers,
  interaction_pattern,
  vulnerable_moment,
  visible_condition,
  hidden_food_function,
  wrong_self_explanation,
  first_gentle_change,
  fourteen_day_experiment,
  seven_day_confirmation_plan,
  safety_route,
  evidence_sources
}
```

Then render the current report from that object. This reduces risk compared with editing report copy and scoring at the same time.

### Phase 6: PDF and Backend Later

Only after runtime report contract is stable:

- update PDF export scripts;
- update mock backend report snapshots;
- update future backend persistence plan if needed;
- keep QPay/pricing/entitlement unchanged unless explicitly scoped.

## Guardrails

- Safety routes must always beat payment and ordinary reports.
- Mode3 professional-first must not show ordinary 14-day weight-loss experiments.
- Mode4 urgent safety must not show ordinary report or paywall.
- Payment/QPay/pricing/entitlement must remain out of this migration unless separately approved.
- Do not deploy from taxonomy or report planning work.

## Recommended Next Work Pack

Work Pack 2 should be docs/test-only:

1. Create `audits/mvp-diagnostic-migration/driver-taxonomy-crosswalk.md`.
2. Define exact scoring weights for new driver keys without changing runtime.
3. Add a test fixture plan for 8-10 driver-stack archetypes.
4. Identify which current tests would need updates when runtime migration begins.
