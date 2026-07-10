# WP86 Humanized Case Formulation Report

## 1. Executive summary

WP86 humanizes the paid one-time case formulation report and removes user-facing internal labels from the WP85 report surface. The report now presents one primary pattern and, only when useful, one secondary pattern instead of forcing three mechanisms.

The overlapping digestive discomfort and late-heavy-meal loops were merged into one natural Mongolian pattern:

`Оройн хүнд хоол, биеийн тавгүйрхэл ба дараагийн өдрийн хэт засах эрсдэл`

No production deploy, DNS change, Netlify setting change, Namecheap change, or QPay/payment source change was made.

## 2. Owner issue summary

WP85 report output was too mechanical in a few places:

- It exposed internal English labels such as `answer-by-answer`, `case mechanism`, `Evidence cluster`, `Loop explanation`, and `First practical experiment`.
- It showed overlapping mechanisms for digestive discomfort, restriction/rebound, and late-heavy-meal discomfort.
- It could feel over-structured by forcing up to three mechanisms when two were enough.
- Evidence language repeated the same mechanical phrase.
- Strategy, anti-plan, and experiment sections needed to be tied directly to the selected patterns.
- Irrelevant domains such as shift/night work, red meat, tobacco, alcohol, or medication/pressure needed stronger relevance gates.

## 3. What was wrong with WP85 report output

WP85 correctly introduced case formulation, but some labels were written from an implementation perspective rather than a reader perspective. The report also separated food discomfort and late-heavy-meal discomfort into similar loops, which made the output feel duplicated for users whose answers pointed to evening portions, fried/fatty preparation, heaviness, heartburn, and next-day restriction thoughts.

## 4. Humanization changes

The public report copy now uses reader-facing Mongolian labels:

- `Юунд тулгуурлаж байна вэ`
- `Яаж давтагдаж болох вэ`
- `Эхний туршиж үзэх зүйл`
- `Таны хамгийн магадлалтай гол хэв маяг`

Mechanical uses of `context`, English loop names, and repeated evidence phrasing were removed from the WP86 report path.

## 5. Mechanism merge/de-duplication

The former digestive discomfort/restriction loop and late-heavy-meal discomfort loop are now represented by one mechanism:

`Оройн хүнд хоол, биеийн тавгүйрхэл ба дараагийн өдрийн хэт засах эрсдэл`

The ranking is limited to a maximum of two report patterns. This supports:

- one primary mechanism;
- one secondary mechanism when the answers support it;
- short observations for items that do not justify a full mechanism.

## 6. Relevance gates

WP86 keeps sensitive or domain-specific details out unless the user selected them:

- Shift/night work appears only when shift/night work is selected.
- Red meat appears only when red meat is selected.
- Tobacco appears only when tobacco is selected.
- `Согтууруулах ундаа` appears only when selected.
- Medication/pressure guidance appears only when selected or directly supported.

## 7. Strategy / anti-plan / 7-14 day experiment changes

For the heavy evening meal plus sedentary pattern, the strategy now combines the top two mechanisms:

- one food variable: portion, timing, or preparation;
- one movement variable: two 5-10 minute sitting breaks or walks.

The anti-plan is generated from mechanism-specific `avoid` items instead of generic social or refusal-related bullets.

The 7-14 day experiment now asks the user to:

- choose one heavy evening meal pattern;
- modify exactly one variable;
- add short movement breaks;
- track heaviness, hunger, heartburn, swelling feeling, and next-day restriction urge.

## 8. Tests added/updated

Added:

- `tests/wp86-humanized-case-formulation.test.js`

Updated:

- `tests/run-all.js`
- `tests/wp85-case-formulation-report.test.js`
- `tests/wp84-food-response-context.test.js`
- `tests/wp83-anthropometric-activity-work-context.test.js`
- `tests/wp81-report-depth-expansion.test.js`
- `tests/wp78-report-inference-quality.test.js`
- existing report/payment/public smoke tests that asserted the old WP85 section heading or mechanism names.

The new WP86 test covers:

- absence of internal English/debug labels;
- digestive and late-heavy-meal mechanism merge;
- relevance gating for shift/night, red meat, tobacco, alcohol, and medication/pressure language;
- combined food and movement strategy for sedentary pattern;
- removal of repeated `механизмыг дэмжиж байгаа нэг дохио`.

## 9. Validation results

Passed on 2026-07-10:

- `node --check app.js`
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

`node tests/run-all.js` produced the known generated audit snapshot churn. Those tracked generated files were restored before staging.

## 10. Guard confirmations

Confirmed in source:

- `WEIGHT_TEST_COMING_SOON_MODE = true`
- `WEIGHT_TEST_QA_PAYMENT_BYPASS = false`
- `WEIGHT_TEST_QA_SKIP_PAYWALL = false`
- `9,900₮`
- `29,000₮`
- `WEIGHT_TEST_ONE_TIME`
- QPay endpoint strings remain present and unchanged:
  - `qpay-create-invoice`
  - `qpay-check-payment`

No production deploy was performed during implementation validation.

## 11. QA draft recommendation

Create a QA-only Netlify draft deploy from the committed WP86 HEAD using a sanitized publish directory. In that QA copy only:

- set coming-soon mode to false;
- enable QA payment bypass;
- enable QA skip-paywall;
- show the QA banner: `Туршилтын хувилбар — production биш. Төлбөрийн шалгалт QA-д түр тойрсон.`

Do not change repo source guards for the QA draft. Do not use `netlify deploy --prod`.
