# WP79 Conditional Branching Fix Report

Date: 2026-07-08

## 1. Executive summary

WP79 fixes the owner-reported branch bug where a user who selected `Огт хэрэглэдэггүй` for alcohol still saw alcohol usage follow-up questions.

Result: fixed in source, covered by targeted regression tests, and validated with the full test suite.

No production deploy was run.

## 2. Owner QA bug summary

Observed bug:

- Parent answer: `Огт хэрэглэдэггүй`
- Incorrect follow-up shown: `Согтууруулах ундаа хэрэглэсэн үед таны хоолны сонголт ихэвчлэн яаж өөрчлөгддөг вэ?`

Expected behavior:

- If alcohol status is `Огт хэрэглэдэггүй` or `Хариулахгүй`, skip both alcohol follow-ups.
- If tobacco status is `Үгүй` or `Хариулахгүй`, skip the tobacco context follow-up.
- Stale skipped answers must not affect sidebar chips, scoring, evidence, or report copy.

## 3. Root cause

The WP78 question bank used stable IDs for the new substance questions, but `stageQuestions()` only conditionalized female/menstrual questions. The alcohol and tobacco child questions were always included in the visible question list.

Report scoring already had some positive-use guards, but shared evidence/tag helpers still read raw stored answers. That meant old skipped child answers could still influence sidebar/report evidence if they existed in saved state.

## 4. Branching rules implemented

Stable IDs used:

- Alcohol parent: `S1-A01`
- Alcohol food-choice follow-up: `S1-A02`
- Alcohol next-day follow-up: `S1-A03`
- Tobacco parent: `S1-T01`
- Tobacco context follow-up: `S1-T02`

Alcohol follow-ups now show only for:

- `Ховор хэрэглэдэг`
- `Сард хэд хэдэн удаа хэрэглэдэг`
- `7 хоногт 1–2 удаа хэрэглэдэг`
- `7 хоногт 3 ба түүнээс олон удаа хэрэглэдэг`

Alcohol follow-ups now skip for:

- `Огт хэрэглэдэггүй`
- `Хариулахгүй`

Tobacco follow-up now shows only for:

- `Өмнө татдаг байсан, одоо больсон`
- `Хааяа татдаг`
- `Өдөр бүр татдаг`

Tobacco follow-up now skips for:

- `Үгүй`
- `Хариулахгүй`

## 5. Stale answer handling

Two layers were added:

1. `clearSkippedSubstanceAnswers()` clears skipped child answers when the parent alcohol/tobacco answer changes.
2. `effectiveStageAnswers()` sanitizes answer maps before scoring, report evidence, answer text, tags, and WP78 receipt helpers read them.

For alcohol no-use/no-answer, the sanitizer ignores:

- `S1-A02`
- `S1-A03`
- the `S1-F01` alcohol hidden-function option

For tobacco no-use/no-answer, the sanitizer ignores:

- `S1-T02`

This protects both normal UI navigation and stale stored state.

## 6. Report inference guard changes

Guarded paths:

- mechanism evidence calculation
- score calculation
- stage report tags
- answer-text helpers
- WP78 report receipt helpers
- sleep/surface context voice helpers

The `socialWeekend` voice now requires alcohol use before it can use alcohol-specific public copy. This prevents report text such as `согтууруулах ундаа хэрэглэсэн орой` from appearing for no-use users through generic social-pressure answers.

## 7. Tests added/updated

Added:

- `tests/wp79-conditional-branching.test.js`

Updated:

- `tests/run-all.js`

The new test verifies:

- `Огт хэрэглэдэггүй` skips `S1-A02` and `S1-A03`
- `Хариулахгүй` skips `S1-A02` and `S1-A03`
- alcohol-use answers show `S1-A02` and `S1-A03`
- `Үгүй` skips `S1-T02`
- tobacco former/current use answers show `S1-T02`
- stale alcohol follow-up answers do not appear in report inference
- stale tobacco follow-up answers do not score or appear in report inference
- coming-soon, price, product, and QPay endpoint guards remain unchanged

## 8. Validation results

Passed:

- `node --check app.js`
- `node tests/wp79-conditional-branching.test.js`
- `node tests/wp78-question-bank-coverage.test.js`
- `node tests/wp78-report-inference-quality.test.js`
- `npm test`
- `git diff --check`

Guard checks passed:

- `WEIGHT_TEST_COMING_SOON_MODE = true`
- `9,900₮`
- `WEIGHT_TEST_ONE_TIME`
- QPay create/check endpoint strings remain present

## 9. Remaining issues

No known WP79 source issue remains.

Recommended QA follow-up:

- Run the requested QA-only draft deploy with repo source unchanged and the bypass applied only to the sanitized publish copy.
- Browser-smoke the alcohol and tobacco branches on the draft URL.
- Confirm production still has coming-soon mode enabled and no QA bypass marker.

## 10. Guard confirmations

Not changed:

- DNS
- Namecheap settings
- Netlify settings
- Netlify domains
- `.netlify/state.json`
- production deploy state
- payment source logic
- QPay endpoint strings
- production coming-soon guard
- price/product guards
- TIAS/lifepattern-tias
- WP64/WP67 PDF packs
- `audits/sprint-36-paid-depth-prototype/`

No force push, merge, rebase, or reset was run.
