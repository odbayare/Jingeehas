# WP85 Case Formulation Report

## Executive summary

WP85 refactors the paid one-time report from answer-by-answer commentary into an integrated case formulation. The report now starts with one overall picture, shows the evidence basis, selects the most likely 2-3 mechanisms, separates secondary observations from primary causes, and gives one 7-14 day single-variable experiment.

Production guards remain unchanged in source: coming-soon mode stays enabled, QA payment bypass stays disabled, QA skip-paywall stays disabled, and QPay/payment source was not changed.

## Owner issue summary

The owner concern was that the paid report could feel like separate mini-comments attached to individual answers. That made food responses, work context, body context, and behavioral patterns feel parallel rather than integrated. The new structure makes the report read as a coherent formulation: what is probably happening, why that is the best current hypothesis, what is only a secondary observation, and what one practical experiment should test first.

## Why answer-by-answer commentary was insufficient

Answer-by-answer copy can over-weight isolated answers, especially food discomfort or a single context clue. It can also imply diagnosis, food intolerance, or deterministic causation when the evidence is thin. WP85 instead treats answers as evidence clusters. A single dairy, flour, red-meat, work, sleep, alcohol, tobacco, menstrual, medication, or cue answer can appear as context, but it only becomes a main mechanism when enough linked evidence supports a loop.

## New case-formulation structure

The paid one-time report now uses this structure:

1. Гол зураглал
2. Энэ дүгнэлт юунд тулгуурласан бэ?
3. Таны хамгийн магадлалтай 2-3 механизм
4. Гол биш боловч ажиглах хэрэгтэй зүйл
5. Танд тохирох эхний стратеги
6. Одоогоор юуг хийхгүй байх вэ?
7. 7-14 хоногийн нэг хувьсагчийн туршилт
8. Хэрэв дахин хазайвал яах вэ?
9. Хэзээ мэргэжлийн хүнтэй ярилцах вэ? / Аюулгүй байдлын сануулга
10. Товч дүгнэлт

## Mechanism selection rules

The implementation builds case-mechanism candidates from linked evidence. Each selected mechanism includes a confidence level, evidence cluster, loop explanation, weight-goal relevance, what would make the hypothesis more likely, what would make it less likely, a first practical experiment, and avoid rules.

Candidate coverage now includes strict elimination/rebound, digestive discomfort with restriction risk, late-heavy-meal discomfort, satiety instability/easy-overeat, heavy-work recovery/missed-meal, sedentary-low-NEAT with stress eating, work-from-home cue loop, shift-work rhythm, alcohol after-effect, tobacco/coffee/snack context, fatigue/easy-choice, circadian rhythm rebound, and visible-food cue environment.

## Food-response interpretation changes

Food responses are no longer rendered as isolated mini-diagnoses. They are used as evidence only when connected to a mechanism. Isolated dairy, flour, red meat, sustaining-food, or overeat-food answers appear as short observations when they are not strong enough to drive the main formulation.

The report explicitly avoids blood-type logic and avoids declaring a food unsuitable from one answer. Red meat is interpreted through timing, portion, preparation, and late/heavy meal context. Flour and sweets are interpreted through satiety stability and easy-overeat context. Dairy is treated as an observation unless it is linked to digestive discomfort plus restriction/rebound evidence.

## Tests added/updated

Added `tests/wp85-case-formulation-report.test.js` and registered it in `tests/run-all.js`.

Updated existing report, paywall, commercial, public-copy, virtual-user, food-response, anthropometric/work-context, safety, and comprehension tests to the WP85 report structure. The virtual-user audit scorer was also updated so actionability and commercial-value scoring recognize the new strategy and case-formulation sections.

## Validation results

Validated with:

- `node --check app.js`
- `node tests/wp85-case-formulation-report.test.js`
- `node tests/wp84-food-response-context.test.js`
- `node tests/wp83-anthropometric-activity-work-context.test.js`
- `node tests/wp82-qa-skip-paywall.test.js`
- `node tests/wp81-report-depth-expansion.test.js`
- `node tests/wp80-context-safe-open-text.test.js`
- `node tests/wp79-conditional-branching.test.js`
- `node tests/wp78-question-bank-coverage.test.js`
- `node tests/wp78-report-inference-quality.test.js`
- `node tests/run-all.js`

The full runner passed after restoring generated audit churn.

## Remaining issues

No P0/P1/P2 blockers were found in the final validation pass. Some report strings still intentionally use mechanism labels such as "loop" and "evidence" inside internal case-formulation copy where tests require those fields. Public virtual-audit generated reports are clean under the existing English/engine-word detector.

## Guard confirmations

- `WEIGHT_TEST_COMING_SOON_MODE` remains `true`.
- `WEIGHT_TEST_QA_PAYMENT_BYPASS` remains `false`.
- `WEIGHT_TEST_QA_SKIP_PAYWALL` remains `false`.
- QPay endpoint/source logic was not changed.
- Prices remain `9,900₮` and `[REMOVED_FEATURE_PRICE]`.
- `.netlify/state.json` was not edited.
- `audits/sprint-36-paid-depth-prototype/` was not edited or staged.
- Protected untracked migration audit folders were not edited or staged.

## QA draft recommendation

Proceed with a QA-only draft deploy from a temporary publish directory after commit/push. The QA draft should flip only the temporary publish copy to disable coming-soon mode and enable QA payment/skip-paywall flags, add a visible non-production banner, and must not use `--prod`.
