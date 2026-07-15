# WP69 Question and Report Quality Audit

Date: 2026-07-05
Repo state audited: `main` at `545bb0993cd0d7c08639cfd24d27d5e096d58c14`
Scope: question quality, answer options, branching/scoring, report specificity, Mongolian wording, safety routing, and paid value.

## 1. Executive Summary

The product has a strong foundation: the live questionnaire already covers sleep/circadian crash, stress regulation eating, reward seeking, restriction rebound, social pressure, cue-driven eating, fatigue/default choices, body-signal caution, menstrual-cycle context, and professional/urgent safety routes. The current code also has useful regression coverage for metadata, evidence scoring, scenario focus, paid report quality, menstrual context, gender gating, and safety routing.

The main quality risk is not missing broad categories. The risk is that too much product intelligence is compressed into one large `app.js` file, and many questions are being asked as broad pattern labels instead of separating: behavior, trigger, body signal, emotional state, time/context, and after-effect. That can make one answer dominate a paid report and can make the report sound more certain than the evidence supports.

The paid report is now calmer and safer than older versions, but perceived value is still fragile for 9,900₮. One-time reports often give a good primary explanation, but they need more explicit evidence receipts from the user's answers, clearer uncertainty language, better contradiction handling, and more scenario-specific Mongolian to avoid feeling like polished generic wellness copy.

WP70 should be an implementation pass that improves question granularity and report evidence specificity without touching payment, QPay, deploy, DNS, domain settings, pricing, or coming-soon mode.

## 2. Current Architecture Map

### Runtime source

Primary file: `app.js`

- Guards and commercial constants: `WEIGHT_TEST_COMING_SOON_MODE`, `PRICING`, `WEIGHT_TEST_PRODUCT_CODE`, `WEIGHT_TEST_QPAY_ENDPOINTS` near `app.js:2`, `app.js:11`, `app.js:21`, `app.js:23`.
- Public mechanism taxonomy: `publicMechanismCopy` and `mechanisms` near `app.js:96`.
- Stage-one question bank: `stageOneQuestions` near `app.js:308`.
- Daily diary questions: `dailyCore` near `app.js:374`.
- Daily menstrual questions: `dailyMenstrual` near `app.js:392`.
- Adaptive probe bank: `probeBank` near `app.js:398`.
- Option metadata extraction: `optionSignals()`, `enrichQuestion()`, and answer extraction helpers near `app.js:491`.
- Evidence scoring and contradiction rules: `calculateMechanismEvidence()`, `applyContradictionRules()`, `applyScenarioPriorityRules()` near `app.js:902`.
- Stage visibility and gender/menstrual gating: `shouldShowStageQuestion()` and `stageQuestions()` near `app.js:1722`.
- Legacy/simple score path: `calculateScores()` near `app.js:2120`.
- Report safety mode: `reportMode()` near `app.js:3334`.
- Report tables and evidence sections: `triggerMapRows()`, `hiddenFunctionItems()`, `cycleMapSteps()`, `professionalCheckHtml()`, `bodySafetyPauseHtml()` near `app.js:3340`.
- One-time paywall: `renderOneTimePaywall()` near `app.js:4108`.
- Report delivery actions: `renderReportDeliveryActions()` near `app.js:4171`.
- Report voice library and scenario-specific copy: `REPORT_VOICE_LIBRARY` near `app.js:4338`.
- Voice selection: `selectReportVoiceKey()` near `app.js:4886`.
- Simple result section: `renderSimpleResultSection()` near `app.js:5089`.
- Main report renderer: `renderReport()` near `app.js:6224`.

### Tests inspected

- `tests/question-metadata-mechanisms.test.js`
- `tests/evidence-scoring-calibration.test.js`
- `tests/report-safety-routing.test.js`
- `tests/paid-report-quality.test.js`
- `tests/scenario-focus-matching.test.js`
- `tests/sleep-rhythm-scenario-focus.test.js`
- `tests/menstrual-cycle-context.test.js`
- `tests/gender-gating.test.js`
- `tests/cycle-question-mapping.test.js`
- `tests/surface-hidden-function-reframe.test.js`
- Full suite via `npm test`

### Previous audit/planning artifacts inspected

- `audits/mvp-diagnostic-migration/question-driver-map.md`
- `audits/mvp-diagnostic-migration/migration-recommendation.md`
- `audits/mvp-diagnostic-migration/work-pack-18/visible-surface-safety-payment-gate.md`
- `audits/mvp-diagnostic-migration/work-pack-62/question-clarity-audit.md`

## 3. Top 20 Question Quality Issues

1. `S1-F01` asks for the "closest" pre-eating reason with many mechanisms in one multi-select list. It is useful, but it mixes hunger, reward, regulation, fatigue, cue, social pressure, body worry, and cycle context in one place. WP70 should split this into trigger/context and internal-state follow-ups.
2. `S1-F01` answer options include "Ядарсан" and "Хамгийн амар сонголт тэр байсан"; these overlap with executive load and decision-default. A user can select both, but scoring may over-amplify the same moment.
3. `S1-R02` mixes emotional, sensory, app/cue, stress, loneliness, and menstrual contexts under "reward." This is diagnostically rich but can over-label stress or fatigue as reward.
4. `S1-E02` includes "Ядаргаа" inside emotion. Fatigue should be separated from emotional state to avoid collapsing circadian/executive load into regulation.
5. `S1-W02` combines life changes, medical context, stress, sleep, and illness into one history question. It should remain, but the report should treat it as background context, not primary cause.
6. `S1-W04` asks about prior weight-loss methods but does not ask what happened after each method. Restriction-binge and fasting rebound need outcome follow-up.
7. `S1-W06` is strong for all-or-nothing thinking but uses severe options like "Би угаасаа чаддаггүй юм байна"; it should be softened or framed as "толгойд орж ирдэг бодол" to reduce shame.
8. `S1-M01`, `S1-M02`, and `S1-M03` cover meal rhythm well, but do not capture work schedule, commute, caregiving schedule, or food availability as reasons the rhythm changes.
9. `S1-H01` asks about satiety but mixes inability to sense fullness with continuing despite fullness and extreme hunger. These should be separate if satiety becomes a paid-report driver.
10. `S1-H02` has "Нөхцлөөс шалтгаална" but no follow-up for which context. This answer is useful but under-explained in reports.
11. `S1-G03` asks whether leaving food is difficult. This can indicate scarcity, family norms, or guilt about waste; the answer option set does not distinguish those meanings.
12. `S1-X01` has several restriction reactions but no "I get calmer when rules are clear" type option, so it may miss people who benefit from structure but rebound only under harsh rules.
13. `S1-X02` asks whether forbidden food becomes more salient, but it does not separate craving from rebellion, fear of scarcity, or social pressure.
14. `S1-L02` asks what the easy option becomes when tired, but lacks common Mongolian urban contexts like convenience store, workplace cafeteria, bakery, family leftovers, and late-night shop.
15. `S1-L03` appears important for role overload/social context, but current option mapping deserves a dedicated review because tests depend on "Бусдын хэрэгцээ" and "Гэр бүл" as strong signals.
16. `S1-N01` and `S1-N03` cover sleep quality and medical sleep signs, but shift work is currently inferred from free text rather than asked directly.
17. `S1-B01` body-signal question is safety-important but may lead users to self-diagnose "sugar" if report copy is too specific. It needs careful "signal, not cause" wording.
18. `MC-06` includes PCOS, postpartum, breastfeeding, and perimenopause in one multi-select. These are different safety/report contexts and need separate report handling.
19. Safety questions `S1-S01` to `S1-S04` are necessary but emotionally heavy. The surrounding copy should make it explicit that these answers do not create a label or diagnosis.
20. Daily diary questions are strong, but adaptive probes are capped by top mechanisms. If the top mechanism is wrong after stage one, the 7-day flow may ask too few disconfirming probes.

## 4. Top 20 Report Quality Issues

1. One-time reports can sound too certain because they often have only stage-one answers. Add "based on today's answers" and "first hypothesis" language where evidence quality is `one_time`.
2. Paid reports need an answer-receipt section: "Таны хариултаас ингэж харагдсан" with 2-4 concrete selected answers.
3. The report has good scenario voices, but voice selection can prioritize surface-context overrides after scoring, making the primary mechanism and headline feel mismatched in complex cases.
4. Contradiction handling exists in code, but user-facing copy rarely says "хоёр зүйл давхцаж байна; эхнийх нь илүү хүчтэй байна."
5. Report text often explains one main loop but does not explicitly say what evidence was weak or missing.
6. For reward vs reward deficit, copy can still feel like "амттай юм хүсэх" even when role overload is the more humane explanation.
7. For regulation, copy risks becoming generic stress-eating copy unless it names the user's exact emotional state and timing.
8. For hunger-safety, report copy is strong but must avoid implying the user should eat more without any personal context or safety caveat.
9. For sleep/circadian, reports need clearer separation between sleep debt, shift work, caffeine, meal timing, and evening decision fatigue.
10. For social eating, copy needs more Mongolian-specific settings: family table, friends, alcohol, office food, celebrations, not just "social pressure."
11. For cue eating, copy is clear but may underplay boredom/understimulation if both are present.
12. Professional route gives safety value, but paid-value perception may feel lower unless it includes a practical "what to bring to a professional" checklist tailored to answers.
13. Urgent route should remain safety-first and should never compete with paid-value language.
14. The 14-day experiments are helpful, but several are too general unless grounded in the user's schedule or selected obstacle.
15. Some report sections repeat "Эхний жижиг өөрчлөлт" style phrasing across mechanisms; this can feel template-like.
16. "Энэ нь онош биш" appears appropriately, but overuse can become repetitive. Keep it in safety-sensitive locations and use lighter uncertainty elsewhere.
17. The report currently has no visible confidence/evidence tier for the user. A plain tier like "эхний зураглал / давтамж батлагдсан / safety-first" would help.
18. Paid reports should avoid teasing 7-day upgrade language in the one-time result unless explicitly scoped; tests already guard some upsell copy.
19. Some old internal English concepts leak into code and occasionally shape text rhythm: reward, default, cue, pattern, mode. The visible Mongolian should stay simple.
20. The report should more clearly tell high-risk users what not to do immediately: fasting, severe restriction, compensatory exercise, shame tracking, public before/after challenges.

## 5. Top 10 Branching and Scoring Risks

1. `optionSignals()` uses regex over labels. This is efficient but fragile: wording changes can silently change scoring.
2. Some answer labels have historical aliases in `scores`; this helps backward compatibility but makes it hard to audit exact current option behavior.
3. `calculateMechanismEvidence()` and `calculateScores()` both exist. Dual scoring paths increase drift risk.
4. Scenario boost rules can override normal evidence if free text contains a keyword.
5. One strong stage answer can dominate a one-time report because one-time evidence has no diary disconfirmation.
6. Adaptive probes depend on top preliminary keys; wrong early ranking can reduce the chance to gather corrective evidence.
7. Contradiction rules cover some pairs but not enough: social vs regulation, boredom vs reward, fatigue vs stress, body-safety vs medical concern.
8. Safety `professional` flags and score-based `check` mode can produce different report paths; this distinction must stay explicit in tests.
9. Menstrual context is gated by gender and self-selection, but cycle answers can become a voice override. This must stay non-diagnostic.
10. Paid/free gating is entangled with report rendering. Future report changes must prove safety guidance is never hidden by payment state.

## 6. Top 10 Mongolian Wording Risks

1. "Pattern", "driver", "default", "cue", "reward" concepts still influence wording. User-facing copy should use plain Mongolian equivalents.
2. "Гол гацалт" is understandable but repeated heavily. Vary with "хамгийн хэцүү мөч", "давтагддаг хэсэг", or answer-specific phrasing.
3. "Эхний жижиг өөрчлөлт" appears often and can feel templated.
4. "Таатай зүйл хүсэх үе" can sound abstract. Prefer concrete wording tied to the user's context.
5. "Биеийн аюулгүй зай" is understandable internally but may sound unnatural to users.
6. "Өөрийгөө хойш тавих" is good, but needs concrete examples in reports to avoid abstraction.
7. "Хамгийн амар сонголт" is clear, but repeated without naming the actual option feels generic.
8. Safety text should avoid "ердийн жин хасалтын тайланг түр зогсоож байна" unless the route truly stops ordinary advice.
9. "Мэргэжлийн хүнтэй ярилцах" is safe, but should be paired with "оношлуулах гэж айлгах биш, аюулгүй тодруулах" tone.
10. CTAs and paid copy must stay clear that coming-soon mode blocks paid public launch, and QPay is not available while coming-soon is active.

## 7. Paid Value Gap Assessment

Current paid value strengths:

- The report is structured and calmer than generic diet advice.
- It avoids diagnosis and moralizing in the tested paths.
- It provides a main loop, a first leverage point, and a 14-day experiment.
- It includes copy/print actions and payment-delivery language.

Current paid value gaps:

- One-time report value depends on specificity. Without selected-answer receipts, users may not see why the answer is "theirs."
- The report needs clearer "why this, not another pattern" logic.
- Scoring confidence is internal; the user sees a polished answer but not the evidence strength.
- Several mechanisms produce similar section shapes and repeated phrasing.
- High-risk/professional routes need enough practical value while remaining safety-first.

Paid value verdict: promising but not public-launch ready for `jingeehas.fit`. WP70 should improve evidence receipts, uncertainty language, and answer-specific report copy before domain launch.

## 8. Safety and High-Risk Assessment

Strengths:

- `S1-S04` urgent self-harm answer overrides to urgent mode.
- Under-18, pregnancy/postpartum/breastfeeding, glucose concern, insulin/sugar medication, rapid swelling/shortness of breath, compensatory behavior, strong loss-of-control, and active body-safety concerns have safety/professional routing.
- Tests verify professional and urgent paths avoid diagnosis/treatment/shame/extreme restriction and do not expose QPay endpoint strings.
- Prior WP18 rule correctly says safety guidance must not require payment.

Risks:

- Body-signal wording can be misread as medical interpretation if report copy names sugar/pressure too confidently.
- Loss-of-control and compensatory behavior deserve stronger "not a diet plan" routing language.
- Some safety options are emotionally heavy and need more reassuring setup copy.
- Professional route must remain useful without becoming treatment advice.
- Payment and report rendering live near each other; future changes need tests proving safety guidance is visible when unpaid, payment fails, or coming-soon mode is true.

Safety verdict: current guardrails are meaningful and tests pass, but WP70 must keep safety copy outside paid persuasion and preserve all payment/QPay/coming-soon invariants.

## 9. Recommended WP70 Implementation Plan

1. Keep scope to `app.js` and targeted tests only; no deploy, no payment, no QPay, no Netlify/domain/DNS work.
2. Add structured metadata for question issues so scoring does not rely only on label regex.
3. Split the broadest question meanings in code first, not by adding many new screens at once.
4. Add answer-receipt rendering for paid reports.
5. Add evidence-quality language for one-time reports.
6. Add contradiction copy when secondary evidence conflicts with primary evidence.
7. Add scenario-specific Mongolian improvements for sleep/shift work, social eating, boredom, role overload, and restriction rebound.
8. Add safety copy tests for body-signal, loss-of-control, compensatory behavior, postpartum/breastfeeding, and active self-harm routes.
9. Add fixtures for context-dependent answers and ambiguous cases.
10. Run full `npm test`, then restore generated snapshot noise if tests rewrite audit outputs.

## 10. Exact File-by-File Change Plan

### `app.js`

- Add explicit option metadata overrides for high-risk and high-value questions so scoring does not depend on text regex alone.
- Add a report evidence receipt helper that lists selected answers in simple Mongolian.
- Add evidence-quality helper copy for one-time vs 7-day reports.
- Add contradiction summary copy from `contradictionSignals`.
- Add direct report copy for "sometimes/context-dependent" answers.
- Add shift-work and schedule-context handling as structured options or follow-up mapping.
- Keep all guards unchanged: `WEIGHT_TEST_COMING_SOON_MODE`, price labels, product code, and QPay endpoint strings.

### `tests/question-metadata-mechanisms.test.js`

- Add assertions for explicit metadata overrides on the highest-risk options.
- Add coverage for context-dependent answers.

### `tests/evidence-scoring-calibration.test.js`

- Add ambiguous one-time cases where reward, stress, fatigue, and hunger-safety overlap.
- Add contradiction tests for social vs regulation, boredom vs reward, and fatigue vs stress.

### `tests/report-safety-routing.test.js`

- Add loss-of-control and compensatory behavior route expectations.
- Add unpaid/payment-failure safety visibility checks if report/paywall rendering is touched.

### `tests/paid-report-quality.test.js`

- Require answer-receipt copy.
- Require one-time uncertainty language.
- Require no generic wellness filler in paid report sections.

### `tests/scenario-focus-matching.test.js`

- Add fixtures for boredom/understimulation, family leftovers, convenience-store default, workplace cafeteria, and shift work without free-text dependence.

### `tests/sleep-rhythm-scenario-focus.test.js`

- Add caffeine timing, late sleep, shift-work, and meal-rhythm interaction cases.

### `tests/menstrual-cycle-context.test.js`

- Keep non-diagnostic cycle language; add postpartum/breastfeeding and irregular-cycle safety assertions.

### New optional test file

- `tests/wp70-report-evidence-receipts.test.js`: verify the paid report names exact answer evidence without leaking internal keys.

## 11. Tests That Must Be Added

1. One-time ambiguous reward/stress/fatigue fixture must not overstate certainty.
2. One-time answer receipt includes exact user selections in plain Mongolian.
3. Context-dependent answer produces "needs more evidence" copy, not false specificity.
4. Reward vs reward-deficit fixture chooses role/self-neglect when family/caregiving evidence is stronger.
5. Social eating fixture names the social setting and does not call it stress by default.
6. Boredom/understimulation fixture does not become generic reward copy.
7. Shift-work fixture works without relying only on free text.
8. Body-signal fixture gives professional-first caution without diagnosing sugar/pressure.
9. Loss-of-control fixture avoids weight-loss experiment language when safety route should lead.
10. Compensatory behavior fixture blocks ordinary 14-day experiment.
11. Menstrual irregularity plus restriction fixture gives professional-first language.
12. Paid report does not include QPay endpoint strings.
13. Safety guidance remains visible in unpaid, paid, and payment-error render states if touched.
14. Price/product/coming-soon/QPay guard strings stay unchanged.
15. Full `npm test` remains green.

## 12. Do Not Change Guard List

Do not change:

- `WEIGHT_TEST_COMING_SOON_MODE = true`
- `9,900₮`
- `WEIGHT_TEST_ONE_TIME`
- `https://[CROSS_PROJECT_NAME_REMOVED]/.netlify/functions/qpay-create-invoice`
- `https://[CROSS_PROJECT_NAME_REMOVED]/.netlify/functions/qpay-check-payment`
- Netlify site `weight-loss-deep-pattern-9900`
- Netlify site id `fb4def02-8e5d-4f00-8996-8cae09ed836f`
- DNS or Namecheap settings
- Netlify domain settings
- Git remote
- Payment flow
- QPay behavior
- Coming-soon mode
- WP64/WP67 PDF packs
- `audits/sprint-36-paid-depth-prototype/`

Do not run:

- `netlify deploy`
- Netlify domain/site create/delete/link commands
- DNS commands
- `git push`
- `git merge`
- `git rebase`
- `git reset`

## Validation Results

- `node --check app.js`: PASS
- `npm test`: PASS, all tests passed

Note: `npm test` rewrote tracked virtual-audit snapshot outputs during validation. Those generated changes were restored before this audit file was finalized.
