# Sprint 34C — English Leakage + Cycle Context Cleanup

Date: 2026-06-30

## Scope

Targeted user-facing copy cleanup after the second virtual cohort. This patch did not change scoring, mechanism detection, safety thresholds, payment, QPay, coach workflow, or deployment state.

## Owner Findings

- User-facing report copy must not leak English mechanism terms such as `belonging` or `rebound`.
- PCOS, irregular cycle, perimenopause, postpartum/breastfeeding, and hormonal contraception contexts must not receive a confident premenstrual interpretation.
- Medication/BP reports must not mention menstrual cycle unless the user provided cycle evidence.
- Perimenopause reports should show one low-confidence cycle section, not duplicate cycle notes.
- Shift-work reports should not repeat the exact phrase `хоол амрах, тэнхээ авах хамгийн ойрын арга`.

## Fixes Applied

- Removed the stale generic low-confidence cycle paragraph from the regular cycle note path.
- Added an explicit low-confidence cycle guard before showing the short premenstrual note in the simple-result section.
- Updated the medication/BP report cycle line from `Биеийн мэдрэмж, жин, даралт эсвэл мөчлөг өөрчлөгдөнө` to `Биеийн мэдрэмж, жин, даралт, хоолны дуршил өөрчлөгдөнө`.
- Updated the circadian/shift hidden-function sentence to avoid repeating the same `хоол амрах, тэнхээ авах хамгийн ойрын арга` phrase.
- Kept internal mechanism keys unchanged where they are not user-facing.

## Tests And Regeneration

- `node --check app.js` passed.
- `node --check scripts/run-virtual-user-audit.mjs` passed.
- `node --check scripts/run-sprint-33-second-virtual-cohort.mjs` passed.
- `node scripts/run-virtual-user-audit.mjs --assert-clean` passed: 10 PASS, 0 PARTIAL, 0 FAIL, P0/P1/P2 = 0, readiness 96.
- `npm test` passed.
- `node scripts/run-sprint-33-second-virtual-cohort.mjs` passed: 10 PASS, 0 PARTIAL, 0 FAIL, P0/P1/P2 = 0, recommendation `READY FOR OWNER REVIEW - HUMAN TESTING STILL HOLD`.
- `git diff --check` passed.

## User-Facing Checks

- No `belonging` in regenerated Sprint 33 user-facing reports.
- No `rebound` in regenerated Sprint 33 user-facing reports.
- No old medication/BP cycle phrase in regenerated Sprint 33 user-facing reports.
- No generic `Хэрвээ сарын тэмдэг тогтмол биш...` paragraph in regenerated Sprint 33 user-facing reports.
- PCOS and perimenopause reports use `Мөчлөг тогтмол бус үед`.
- Medication/BP report uses `Эмийн хэрэглээ, даралт, хоолны дуршлын өөрчлөлт`.
- Shift-work report keeps the target phrase only once.

## Severity

- P0: 0
- P1: 0
- P2: 0

## Remaining Concerns

- Human testing remains on hold until owner review of the regenerated second-cohort package.

## Recommendation

READY FOR OWNER REVIEW — HUMAN TESTING STILL HOLD
