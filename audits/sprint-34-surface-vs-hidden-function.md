# Sprint 34 — Surface Cause vs Hidden Psychological Function Reframe

Date: 2026-06-30 13:36:31 +08

## Owner Clarification

The product should not stop at visible causes users may already suspect, such as medication, menstrual cycle, PCOS, sleep disruption, shift work, social/alcohol context, gym challenges, or stress.

The rule added in this sprint:

`Surface cause is context, not the final insight.`

## Product Decision

Visible context is acknowledged as real and potentially relevant, but the main interpretation centers the hidden psychological function behind the eating/weight pattern.

The report now separates:

- `Ил харагдаж байгаа зүйл`
- `Цаана нь ажиллаж байгаа зүйл`

This section appears near the top of ordinary Mode 1/2 reports, after `Товч хариу` and before the detailed report body.

## Hidden Function Taxonomy

The current mapping uses existing answers and free-text evidence, without changing scoring:

- medication / hormonal contraception: body trust disruption, loss of control feeling, restriction to regain control, self-blame
- menstrual cycle: comfort seeking, self-kindness deficit, shame/restriction response, body trust disruption
- PCOS / irregular cycle / glucose or BP concern: body unpredictability, control seeking, self-blame, strictness
- postpartum / childcare: self-neglect, invisible labor, own needs pushed last, attention deficit
- shift work / poor sleep: exhaustion relief, fast energy, reward after depletion
- work stress: food as a brief rest / regulation
- social / alcohol / weekend: belonging, refusal discomfort, social pressure
- gym challenge / overrestriction: discipline identity, hunger safety, rebound after restriction
- mirror / photos / visibility: body safety, shame avoidance, visibility fear
- delivery app / environment: cue context plus fast relief / low-effort soothing

## Report Hierarchy Changes

Mode 1/2 ordinary reports now show:

1. `Товч хариу`
2. `Ил харагдаж байгаа зүйл`
3. `Цаана нь ажиллаж байгаа зүйл`
4. `Дэлгэрэнгүй тайлан`
5. existing detailed report sections

Mode 3 professional-first and Mode 4 urgent safety routes remain suppressed from ordinary commercial/report content.

## Sprint 33 Regeneration

Updated the second virtual cohort to include the requested Sprint 34 cases:

- User 01: shift work / poor sleep
- User 03: postpartum / new mother
- User 04: perimenopause / body uncertainty
- User 05: social weekend / alcohol
- User 07: gym overrestriction / carb cutting
- User 08: PCOS suspected / irregular cycle
- User 09: medication / BP / appetite concern
- User 10: body shame / visibility safety route

Regenerated:

- `audits/sprint-33-second-virtual-cohort/USER_FACING_REPORTS.md`
- `audits/sprint-33-second-virtual-cohort/WEIGHT_TEST_SECOND_10_USER_FACING_REPORTS.pdf`
- `audits/sprint-33-second-virtual-cohort/raw/user-01.json` through `raw/user-10.json`
- Sprint 33 profile, answer, comprehension, issues, and summary files

Sprint 33 result after the reframe:

- PASS: 10
- PARTIAL: 0
- FAIL: 0
- P0/P1/P2: 0/0/0
- Recommendation: `READY FOR OWNER REVIEW - HUMAN TESTING STILL HOLD`

## Tests

Added:

- `tests/surface-hidden-function-reframe.test.js`

Updated:

- `tests/run-all.js`

The new tests cover:

- ordinary reports with surface context show both new headings
- medication/hormonal report does not stop at medication
- menstrual report does not stop at cycle
- shift-work report includes hidden rest/reward/energy function
- postpartum report includes own-food/attention need
- social report includes refusal discomfort
- gym overrestriction report includes hunger-safety/rebound language
- deterministic medical/hormonal copy is absent
- Mode 3/4 safety routes remain unchanged

## Validation

- `node --check app.js` passed.
- `node --check scripts/run-virtual-user-audit.mjs` passed.
- `node --check scripts/run-sprint-33-second-virtual-cohort.mjs` passed.
- `node scripts/run-virtual-user-audit.mjs --assert-clean` passed: 10 PASS, readiness 96.
- `npm test` passed.
- `node scripts/run-sprint-33-second-virtual-cohort.mjs` passed: 10 PASS, 0 PARTIAL, 0 FAIL.
- Sprint 33 PDF text extraction found 12 pages and 9 ordinary report surface/hidden sections.
- Sprint 33 PDF pages were rendered for visual sanity checks.
- `git diff --check` passed.

## Remaining Risks

- Human testing remains HOLD until owner review.
- No new explicit user question was added for suspected cause; this sprint uses existing answers and free-text evidence. A future sprint can add explicit suspected-cause questions if owner wants stronger first-party signal.

## Recommendation

READY FOR OWNER REVIEW

Human testing remains HOLD by owner decision.
