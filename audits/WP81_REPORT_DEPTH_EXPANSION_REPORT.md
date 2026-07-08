# WP81 Report Depth Expansion Report

## 1. Executive summary

WP81 expanded the paid one-time report from a short summary into a richer, answer-linked report. The paid report now explains evidence, the main mechanism, weight-impact pathways, secondary contributors, a causal loop, contextual anti-plan items, one first step, a 7-14 day experiment, relapse handling, self-observation questions, professional guidance, and a closing summary.

The expansion is report-depth only. Questionnaire flow, Netlify settings, DNS, payment/QPay source logic, and the coming-soon source guard were not changed.

## 2. Owner request

Owner request: make the paid report approximately 3x deeper and more useful without adding generic filler.

WP81 implementation target:
- Rich scenarios render above 10,000 visible characters.
- Stress/fatigue/cue scenarios render above 8,000 visible characters.
- Safety/professional routes continue suppressing ordinary diet plans.
- User-facing report copy avoids `архи`, English day labels, and unsafe/moralizing advice.

## 3. What changed in report structure

Updated `renderClearOneTimePaidReport()` in `app.js`.

The old paid report was a shorter 8-section structure. WP81 replaced it with a 12-section paid report:
1. `Энэ тайлан юунд тулгуурласан бэ?`
2. `Таны гол давтагдаж буй механизм`
3. `Энэ нь яагаад жин дээр нөлөөлж байж болох вэ?`
4. `Давхар нөлөөлж байгаа хүчин зүйлс`
5. `Таны тойрог хэрхэн ажиллаж байна вэ?`
6. `Одоогоор юуг хийхгүй байх вэ?`
7. `Эхний өөрчлөлт хаанаас эхлэх вэ?`
8. `7–14 хоногийн туршилт`
9. `Хэрэв дахин хазайвал яах вэ?`
10. `Танд тохирох ажиглалтын 5 асуулт`
11. `Хэзээ мэргэжлийн хүнтэй ярилцах вэ? · Аюулгүй байдлын сануулга`
12. `Товч дүгнэлт`

## 4. Mechanism-specific expansion

Added WP81 helper logic for:
- answer-based evidence points
- secondary factor selection
- weight-impact explanation paragraphs
- causal loop steps
- contextual avoid-list items
- first-step selection
- 7-14 day experiment rows
- relapse reset guidance
- observation questions
- professional/safety guidance

Mechanisms covered include:
- согтууруулах ундаа after-effect + next-day overcorrection
- restrict-overcorrect loop
- stress regulation eating
- fatigue/easy-choice loop
- cue/environment loop
- tobacco/appetite context
- movement feasibility
- sleep/rhythm and body-signal safety contexts

## 5. Safety handling

Urgent and professional safety routes remain outside ordinary paid report expansion.

Body-signal/check mode keeps professional guidance visible and avoids aggressive diet/exercise recommendations. Postpartum context was specifically checked so the report does not center aggressive restriction wording.

## 6. Tests added/updated

Added:
- `tests/wp81-report-depth-expansion.test.js`

Registered:
- `tests/run-all.js`

Updated existing report-contract tests to reflect the new WP81 section order while preserving their safety, payment, QPay, copy, and public-language guard coverage.

## 7. Validation results

Passed:
- `node --check app.js`
- `node tests/wp81-report-depth-expansion.test.js`
- `node tests/wp80-context-safe-open-text.test.js`
- `node tests/wp79-conditional-branching.test.js`
- `node tests/wp78-question-bank-coverage.test.js`
- `node tests/wp78-report-inference-quality.test.js`
- `npm test`
- `git diff --check`

Guard checks passed for:
- `WEIGHT_TEST_COMING_SOON_MODE = true`
- `9,900₮`
- `WEIGHT_TEST_ONE_TIME`
- QPay create/check endpoint strings

## 8. Remaining issues

This pass expands runtime HTML report depth. It does not change visual layout, PDF export quality, or production deployment state.

The next pass should QA the expanded report in browser on the draft URL, especially mobile scroll/readability and print/PDF behavior.

## 9. Guard confirmations

Confirmed unchanged in repo source:
- production coming-soon guard remains true
- one-time price remains `9,900₮`
- product code remains `WEIGHT_TEST_ONE_TIME`
- QPay endpoint strings remain unchanged

Not touched:
- DNS
- Namecheap
- Netlify settings
- `.netlify/state.json`
- production deploy
- QPay/payment source logic
- TIAS/lifepattern-tias
- WP64/WP67 PDF packs
- `audits/sprint-36-paid-depth-prototype/`

## 10. QA draft recommendation

Create a QA-only Netlify draft deploy from the WP81 commit after push.

Draft-only publish copy should:
- set coming-soon false only in the temp publish copy
- add QA payment/report unlock bypass only in the temp publish copy
- show visible QA banner
- exclude audits, tests, node_modules, `.git`, protected folders, and handoff artifacts

Do not deploy production until the owner approves the expanded report after browser QA.
