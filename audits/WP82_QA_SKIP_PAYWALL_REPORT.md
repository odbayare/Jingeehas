# WP82 QA Skip Paywall Report

## 1. Executive summary

WP82 adds a source-safe QA-only skip-paywall control for the one-time report flow. The repository source keeps production behavior unchanged: coming-soon mode remains enabled, QPay/payment access remains required for public one-time reports, and the one-time/seven-day payment cards remain in source.

The QA draft can now be built from the committed source and modified only in the temporary publish copy so that:

- coming-soon mode is disabled for QA;
- one-time payment access is bypassed for QA;
- the assessment selection/payment cards screen is skipped for QA;
- completing the one-time questionnaire opens the expanded WP81 report directly.

## 2. Owner QA issue

The prior QA draft removed QPay verification friction, but still let the owner land on the assessment/payment selection screen after testing. That screen included the one-time and seven-day paid cards, which was distracting and fake during report-quality QA.

The owner needs to review report content and flow, not click through a simulated paywall.

## 3. Why the previous QA bypass was insufficient

The previous draft bypass granted report access, but the app still had normal public navigation surfaces available:

- `Үнэлгээний сонголт`
- `Нэг удаагийн гүн анализ`
- `7 хоногийн гүн анализ`
- one-time and seven-day payment card CTAs

That was correct for production, but too much friction for a QA-only draft focused on the expanded one-time report.

## 4. QA-only skip-paywall behavior

Added default-off source flags:

- `WEIGHT_TEST_QA_PAYMENT_BYPASS = false`
- `WEIGHT_TEST_QA_SKIP_PAYWALL = false`

Added helper behavior:

- `isQaPaymentBypassEnabled()`
- `isQaSkipPaywallEnabled()`
- `shouldQaSkipOneTimePaywall()`

When the temporary QA publish copy sets both QA flags to `true`, the one-time flow:

- skips the assessment selection/payment card screen;
- grants one-time report access without QPay;
- opens the expanded WP81 report directly after completing Stage 1;
- does not automatically unlock the seven-day flow.

## 5. Production payment flow unchanged confirmation

Production source remains safe by default:

- `WEIGHT_TEST_COMING_SOON_MODE = true`
- `WEIGHT_TEST_QA_PAYMENT_BYPASS = false`
- `WEIGHT_TEST_QA_SKIP_PAYWALL = false`
- one-time payment card copy remains in source
- seven-day payment card copy remains in source
- `9,900₮` remains in source
- `29,000₮` remains in source
- `WEIGHT_TEST_ONE_TIME` remains in source
- QPay create/check endpoint strings remain unchanged

The QA skip is not enabled in repository source.

## 6. Tests added/updated

Added:

- `tests/wp82-qa-skip-paywall.test.js`

Updated:

- `tests/run-all.js`
- payment/source contract tests that intentionally pin the one-time access helper source

The new test verifies:

- source QA flags default to `false`;
- source coming-soon remains `true`;
- production payment card copy remains present;
- QA skip-paywall branch exists;
- a temporary QA-flipped app copy skips the assessment selection screen;
- completing the one-time questionnaire opens the expanded report directly;
- QA bypass does not unlock the seven-day flow;
- QPay is not requested in the QA direct report;
- WP81 expanded report sections remain present.

## 7. Validation results

Initial targeted validation passed before implementation:

- `node --check app.js`
- `node tests/wp81-report-depth-expansion.test.js`
- `node tests/wp80-context-safe-open-text.test.js`
- `node tests/wp79-conditional-branching.test.js`
- `node tests/wp78-question-bank-coverage.test.js`
- `node tests/wp78-report-inference-quality.test.js`
- `npm test`
- `git diff --check`

Post-implementation validation passed:

- `node --check app.js`
- `node tests/wp82-qa-skip-paywall.test.js`
- `node tests/wp81-report-depth-expansion.test.js`
- `node tests/wp80-context-safe-open-text.test.js`
- `node tests/wp79-conditional-branching.test.js`
- `node tests/wp78-question-bank-coverage.test.js`
- `node tests/wp78-report-inference-quality.test.js`
- `npm test`
- `git diff --check`

Guard greps also confirmed:

- `WEIGHT_TEST_COMING_SOON_MODE = true`
- `9,900₮`
- `29,000₮`
- `WEIGHT_TEST_ONE_TIME`
- QPay create/check endpoint strings

## 8. Remaining issues

No source-level production blocker was found in WP82.

The next QA draft must still be smoke tested in-browser/runtime form to confirm the owner-facing journey:

1. open QA draft;
2. start one-time questionnaire;
3. complete Stage 1;
4. confirm the assessment selection/payment card screen does not appear;
5. confirm the expanded report opens directly;
6. confirm production remains unchanged.

## 9. Guard confirmations

WP82 did not intentionally change:

- DNS;
- Namecheap settings;
- Netlify settings;
- `.netlify/state.json`;
- production deploy;
- QPay endpoint strings;
- real payment source behavior;
- coming-soon source guard;
- WP64/WP67 PDF packs;
- `audits/sprint-36-paid-depth-prototype/`;
- TIAS or `[CROSS_PROJECT_NAME_REMOVED]-tias`.
