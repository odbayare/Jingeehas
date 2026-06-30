# Sprint 34C — English Leakage + Cycle Context Cleanup

Date: 2026-06-30

## Owner findings

Sprint 34B-ийн report context precision сайжирсан боловч owner review дараах P1 үлдэгдлийг тэмдэглэсэн:

- user-facing report-д `belonging` үлдсэн
- gym/restriction report-д `rebound` үлдсэн
- PCOS/irregular-cycle report-д premenstrual-specific note үлдсэн
- medication/BP report-д cycle evidence байхгүй үед `мөчлөг` орж байсан
- perimenopause report-д cycle confidence note давхардаж байсан
- shift report-д `хоол амрах, тэнхээ авах хамгийн ойрын арга` олон давтагдсан

## Fixes applied

- Replaced `belonging` with `хамт байгаа мэдрэмжээ алдахгүй байх хэрэгцээ`.
- Replaced user-facing `rebound` with `буцаад хүчтэй идэх тойрог` / `орой илүү хүчтэй өлсөж, дараа нь их идэх тойрог`.
- Suppressed brief premenstrual note when cycle confidence is low.
- Changed low-confidence cycle rendering to a single `Мөчлөг тогтмол бус үед` section.
- Removed duplicate `Мөчлөгтэй холбоотой анхаарах зүйл` section from low-confidence reports.
- Made medication/BP body-trust cycle step say `Эмийн хэрэглээ, даралт, хоолны дуршлын өөрчлөлт санаа зовнил нэмэгдүүлнэ`.
- Reduced shift exact phrase repetition so `хоол амрах, тэнхээ авах хамгийн ойрын арга` appears only once.

## Tests

Updated `tests/surface-hidden-function-reframe.test.js` to assert:

- social/weekend report does not contain `belonging`
- gym restriction report does not contain `rebound`
- PCOS/irregular report does not contain `Хэрвээ энэ үе сарын тэмдэг ирэхийн өмнөх өдрүүдтэй давхцдаг бол`
- PCOS/irregular report contains `Мөчлөг тогтмол бус үед`
- medication/BP report does not contain `мөчлөг`
- perimenopause report does not contain duplicated cycle note sections
- shift report does not repeat `хоол амрах, тэнхээ авах хамгийн ойрын арга` more than once

## Export checks

Checked regenerated `audits/sprint-33-second-virtual-cohort/USER_FACING_REPORTS.md`:

- no `belonging`
- no `rebound`
- no `Хэрвээ энэ үе сарын тэмдэг ирэхийн өмнөх өдрүүдтэй давхцдаг бол`
- no `Биеийн мэдрэмж, жин, даралт эсвэл мөчлөг`
- no duplicate low-confidence cycle heading pattern
- medication/BP report section does not mention `мөчлөг`
- shift report exact phrase appears once

## Sprint 33 regeneration

- Output folder: `audits/sprint-33-second-virtual-cohort/`
- PDF: `audits/sprint-33-second-virtual-cohort/WEIGHT_TEST_SECOND_10_USER_FACING_REPORTS.pdf`
- Result: 10 PASS / 0 PARTIAL / 0 FAIL
- P0/P1/P2: 0/0/0

## Validation

- `node --check app.js` — passed
- `node --check scripts/run-virtual-user-audit.mjs` — passed
- `node --check scripts/run-sprint-33-second-virtual-cohort.mjs` — passed
- `node scripts/run-virtual-user-audit.mjs --assert-clean` — passed, 10 PASS, readiness 96
- `npm test` — passed
- `node scripts/run-sprint-33-second-virtual-cohort.mjs` — passed, 10 PASS, P0/P1/P2 = 0/0/0
- `git diff --check` — passed

## Recommendation

READY FOR OWNER REVIEW — HUMAN TESTING STILL HOLD
