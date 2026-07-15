# WP87 Report Reasoning Fix Report

## 1. Executive summary

WP87 fixes reasoning contradictions and relevance leakage found after WP86 QA. The paid one-time report now begins with the user's case formulation, compresses evidence into grouped narrative links, treats flexible recovery as a protective factor, and keeps the 7-14 day experiment to one actual variable when the primary pattern is food/timing.

No new questionnaire questions were added. No UI redesign, production deploy, DNS change, Netlify setting change, Namecheap change, or QPay/payment source change was made.

## 2. QA issue summary

Observed WP86 report issues:

- The report opened with meta explanation about what the report was not doing.
- Evidence repeated the same explanatory sentence across multiple answer-level cards.
- Flexible recovery evidence was ignored when the user selected `Дараагийн хоолноосоо хэвийн үргэлжлүүлье гэж боддог`.
- `Тогтмол бус цагтай` was treated as shift/night work.
- Prior activity such as `Усанд сэлэх` was not used meaningfully.
- The "one-variable" experiment changed both food and movement variables.

## 3. Contradicting evidence fix

The report now detects the flexible recovery answer:

`Дараагийн хоолноосоо хэвийн үргэлжлүүлье гэж боддог`

When this is present without stronger restriction evidence, the primary food pattern is titled:

`Оройн хүнд хоол ба биеийн тавгүй мэдрэмж`

The report also adds a protective-factor evidence card explaining that overcorrection is not the main cause in that case. The overcorrection title is still available only when the user's answers support it through all-or-nothing or elimination/restriction evidence.

## 4. Evidence compression

The evidence section now uses grouped links instead of answer-by-answer repeated commentary:

- `Оройн хоол ба биеийн мэдрэмж`
- `Цатгалан мэдрэмж ба хэмжээг барихад хэцүү хүнс`
- `Өдөр тутмын хөдөлгөөн ба ажлын хэмнэл`
- `Зорилтот жингийн хүрээ`
- optional `Хамгаалах хүчин зүйл`

This removes repeated explanation templates while preserving the reasoning path.

## 5. Relevance gate fixes

Shift/night wording now appears only when the answer explicitly includes:

- `Ээлжийн ажилтай`
- `Шөнийн ээлжтэй`

When the answer is only `Тогтмол бус цагтай`, the report now says:

`Ажлын цаг тогтмол бус үед хоолны хэмнэл өдөр бүр адил байхгүй байж болно.`

Existing gates for red meat, tobacco, `согтууруулах ундаа`, medication/pressure, and safety wording remain in place.

## 6. Prior activity handling

If `Усанд сэлэх` is selected as a prior or feasible activity, the report now treats it as meaningful context:

`Өмнө нь усанд сэлэхийг туршиж байсан нь нам ачаалалтай хөдөлгөөн танд боломжтой байж болохыг харуулж байна.`

It is not forced as the first strategy when food/timing is the primary pattern.

## 7. One-variable experiment fix

When food/timing is primary, the experiment now changes only one food variable:

- portion, or
- timing, or
- preparation, or
- pairing.

Sedentary context can be observed, but it is not added as a walking intervention in the same experiment.

## 8. Tests added/updated

Added:

- `tests/wp87-report-reasoning-fix.test.js`

Updated:

- `tests/run-all.js`
- `tests/wp86-humanized-case-formulation.test.js`
- `tests/wp84-food-response-context.test.js`
- `tests/wp81-report-depth-expansion.test.js`

The WP87 test verifies:

- no duplicated opening meta explanation;
- grouped, non-repetitive evidence;
- flexible recovery protective-factor handling;
- irregular work does not trigger shift/night wording;
- explicit shift/night still triggers shift/night copy;
- swimming is meaningful or omitted;
- one-variable experiment stays one-variable;
- no irrelevant red meat/tobacco/alcohol/medication-pressure leakage;
- guard strings and forbidden copy constraints remain intact.

## 9. Validation results

Validation commands run during WP87:

- `node --check app.js`
- `node tests/wp87-report-reasoning-fix.test.js`
- `node tests/wp86-humanized-case-formulation.test.js`
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
- `git diff --check`

The full suite passed. As usual for this repo, generated audit snapshot churn from the full suite was restored before staging.

## 10. Guard confirmations

The source must keep:

- `WEIGHT_TEST_COMING_SOON_MODE = true`
- `WEIGHT_TEST_QA_PAYMENT_BYPASS = false`
- `WEIGHT_TEST_QA_SKIP_PAYWALL = false`
- `9,900₮`
- `[REMOVED_FEATURE_PRICE]`
- `WEIGHT_TEST_ONE_TIME`
- QPay endpoint strings:
  - `qpay-create-invoice`
  - `qpay-check-payment`

No payment/QPay endpoint logic was changed.

## 11. QA draft recommendation

After commit and push, create a QA-only draft deploy from the new HEAD using a sanitized publish directory. In the QA publish copy only:

- set coming-soon mode to false;
- enable QA payment bypass;
- enable QA skip-paywall;
- keep the visible QA banner: `Туршилтын хувилбар — production биш. Төлбөрийн шалгалт QA-д түр тойрсон.`

Do not modify repo source guard values and do not use `netlify deploy --prod`.
