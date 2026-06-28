# Sprint 24 Report Voice Rewrite Audit

## PDF manual audit findings

- The 10-report PDF review showed that ordinary Mode 1/2 reports were structurally correct but still sounded too much like an assessment engine.
- Repeated public phrases such as "давтамжтай нийцэж байна", "үүрэг гүйцэтгэж байна", and evidence-heavy counts made the reports feel raw.
- User 03, User 05, and User 06 needed separate lived-story voices instead of collapsing into generic executive-load language.
- Mode 3 and Mode 4 safety routing remained appropriate and must stay outside the commercial ordinary report flow.

## Report voice rules applied

- Ordinary reports now start with lived situations, not mechanism labels.
- Public reports use this structure:
  - Таны гүн зураглал бэлэн боллоо
  - Гол зураг
  - Тэр үед хоол танд юу өгч байсан байж болох вэ?
  - Давтагддаг тойрог
  - Үүнийг юунаас харсан бэ?
  - Асуудал яг юу биш вэ?
  - Одоогоор болгоомжлох зүйлс
  - Эхний жижиг өөрчлөлт
  - 14 хоногийн туршилт
  - 7 хоногоор нарийвчлах, only where applicable
- Evidence is now a short supporting note instead of dominating the main report.
- The 14-day experiment now uses staged copy:
  - Эхний 3 өдөр
  - 4–10 дахь өдөр
  - 11–14 дахь өдөр
  - Хэрвээ нэг өдөр алгасвал

## User-specific fixes

- User 03 now centers the restriction-collapse story: one slip, "Өнөөдөр өнгөрлөө", and returning from the next meal.
- User 05 now centers self-neglect/reward deficit: own needs left last, own food/rest, and not relying on leftover time.
- User 06 now centers cue-conditioned eating: food visibility, app/snack cues, one cue farther and one helpful choice closer.

## Tests added or updated

- Added `tests/report-voice-rewrite.test.js`.
- Updated report structure tests to assert the Sprint 24 public report voice instead of old mechanism-label phrases.
- Updated pricing, mock entitlement, internal testing, localization, and virtual QA tests to recognize the new full-report sections.
- Added negative assertions for:
  - `давтамж гэх давтамж`
  - `гэх давтамжтай нийцэж байна`
  - `хүчтэй нийцэж байна`
  - `дунд зэрэг нийцэж байна`
  - `Таны идэлт дараах үүргүүдийг гүйцэтгэж байна`
  - `Хэрвээ тасалдвал`

## PDF export cleanup

- PDF footer changed to `Жин хасалтын гүн зураглал — дотоод тайлангийн шалгалт`.
- PDF/Markdown export display text translates common persona phrases without modifying raw JSON fixtures.
- Regenerated:
  - `audits/virtual-users-10-pdf/WEIGHT_TEST_10_VIRTUAL_REPORTS.pdf`
  - `audits/virtual-users-10-pdf/WEIGHT_TEST_10_VIRTUAL_REPORTS.md`
  - `audits/virtual-users-10-pdf/PDF_EXPORT_NOTES.md`
  - `audits/virtual-users-10-pdf/raw/user-01.json` through `user-10.json`

## Validation results

- `node --check app.js`: passed
- `node --check scripts/run-virtual-user-audit.mjs`: passed
- `node scripts/run-virtual-user-audit.mjs --assert-clean`: passed, 10 PASS / 0 FAIL / readiness 96
- `npm test`: passed
- `node --check scripts/export-virtual-reports-pdf.mjs`: passed
- `node scripts/export-virtual-reports-pdf.mjs`: passed
- PDF text extraction: passed, 22 pages, User 03/05/06 target phrases present
- PDF rendered-page spot check: passed

## Remaining concerns

- The report is now less mechanical, but the next human review should still check whether the tone feels valuable enough for paid users.
- Some internal test fixtures and raw JSON metadata still contain legacy scoring labels; these are not public report text and were left unchanged.

## Recommendation

READY FOR PDF REVIEW
