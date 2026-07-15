# WP80 Context-Safe Open Text Fix Report

Date: 2026-07-09

## 1. Executive summary

WP80 fixes an unsafe ambiguous open-text question that appeared after the self-harm/safety section.

Result: fixed in runtime copy and flow. The open-text question now explicitly refers to weight-loss / weight-maintenance attempts, and high-risk self-harm answers no longer continue into that ordinary weight-loss follow-up.

No production deploy was run.

## 2. Owner QA issue summary

Owner QA found this question after the self-harm/safety question:

- `Өмнө хэрэглэсэн нэг арга яагаад удаан үргэлжлээгүй вэ?`

Because it appeared immediately after a self-harm-related question, `нэг арга` could be misread as referring to a self-harm method instead of a weight-loss method.

## 3. Why the old wording was unsafe/ambiguous

The old text relied on context from earlier weight-loss attempt questions, but the immediate previous question could be:

- `Сүүлийн үед өөртөө хор хүргэх бодол төрсөн үү?`

In that sequence, `Өмнө хэрэглэсэн нэг арга` was too vague. It did not explicitly say that the question was about weight-loss or weight-maintenance attempts.

## 4. Exact copy replacement

Old question removed:

- `Өмнө хэрэглэсэн нэг арга яагаад удаан үргэлжлээгүй вэ?`

New question:

- `Жингээ бууруулах эсвэл жингээ барихын тулд өмнө туршсан нэг арга тань яагаад удаан үргэлжлээгүй вэ?`

New helper text:

- `Энэ асуулт нь зөвхөн жингээ бууруулах, жингээ барих зорилгоор туршиж байсан хоол, хөдөлгөөн, дасгал, хэвшлийн тухай юм. Санахгүй эсвэл бичмээргүй байвал хоосон орхиж болно.`

New stage title:

- `Үе 1 · Өмнөх оролдлогоо тодруулах`

New placeholder:

- `Жишээ: фитнес эхлүүлсэн ч цаг тохироогүй, мацаг барихад орой хэт өлсдөг болсон, алхалтаа тогтмол үргэлжлүүлж чадаагүй гэх мэт.`

## 5. Safety-flow guard behavior

Implemented:

- If `S1-S04` is answered with `Одоо хааяа бодогддог` or `Одоо идэвхтэй бодогдож байна`, `S1-V03` is not visible.
- When continuing from high-risk `S1-S04`, the app exits ordinary stage questions and moves to the existing safety-first report route.
- If `S1-S04` is non-risk and the flow continues, `S1-V03` uses the context-safe weight-loss / weight-maintenance wording.
- If `S1-W04` includes `Оролдож байгаагүй`, `S1-V03` is skipped rather than asking why a previous method did not continue.

## 6. Tests added/updated

Added:

- `tests/wp80-context-safe-open-text.test.js`

Updated:

- `tests/run-all.js`

The new test verifies:

- old ambiguous question text is absent
- old ambiguous fragment is absent
- new weight-loss / weight-maintenance anchored question exists
- helper text exists
- stage title is context-safe
- high-risk self-harm answer does not lead into the open-text question
- existing urgent safety report route still works
- non-risk safety answer can continue with context-safe wording
- `Оролдож байгаагүй` skips the question
- WP80 does not change coming-soon, price, product, or QPay endpoint guards

## 7. Validation results

Passed:

- `node --check app.js`
- `node tests/wp80-context-safe-open-text.test.js`
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

## 8. Remaining issues

No known WP80 source issue remains.

Recommended QA follow-up:

- Run the requested QA-only draft deploy with repo source unchanged and the bypass applied only to the sanitized publish copy.
- Browser-smoke the safety and non-risk flows on the draft URL.
- Confirm production still has coming-soon mode enabled and no QA bypass marker.

## 9. Guard confirmations

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
- WP79 branching fixes
- TIAS/[CROSS_PROJECT_NAME_REMOVED]-tias
- WP64/WP67 PDF packs
- `audits/sprint-36-paid-depth-prototype/`

No force push, merge, rebase, or reset was run.
