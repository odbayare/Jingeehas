# Sprint 30A — Virtual Retest Fix Patch

## Context

Sprint 30 generated the 10-person virtual human retest package after the `Товч хариу` simple result layer. Manual review decided not to send the test to real humans yet. This patch fixes focused display, report-copy, and export issues before owner PDF review.

## Manual Review Findings

- User 08 menstrual-cycle persona had an ordinary report, but the `Товч хариу` first answer centered self-neglect/reward deficit instead of premenstrual appetite context.
- The cycle note export duplicated its heading as `Нэмэлтээр анхаарах зүйл: Нэмэлтээр анхаарах зүйл`.
- Internal feedback survey price wording used `[REMOVED_FEATURE_PRICE] төлж`, which read less natural than a clear currency form.
- PDF/Markdown export included the interactive label `Дэлгэрэнгүй тайлан харах`.
- Public detail/refinement copy could surface the harsh label `Нурах давтамж`.

## Fixes Applied

- Added a cycle-aware simple result override when premenstrual appetite/craving evidence is strong and self-neglect evidence is weak or absent.
- Kept menstrual-cycle interpretation as context, not primary mechanism or diagnosis.
- Rendered the detail separator as `Дэлгэрэнгүй тайлан`.
- Cleaned Sprint 30 export parsing so detail body does not include the interactive button label.
- Extracted cycle note body without repeating the `Нэмэлтээр анхаарах зүйл` heading.
- Updated feedback survey price wording to `Энэ тайланг [REMOVED_FEATURE_PRICE]-өөр авахад үнэ цэнтэй санагдах уу?`.
- Replaced the public-facing collapse short label with `Хэвийн үргэлжлүүлэхэд хэцүү мөч`.

## User 08 Before / After

Before:

`Өдөржин өөрийгөө хойш тавьсны дараа орой амттай зүйл өөртөө өгөх жижиг шагнал болж байна.`

After:

`Сарын тэмдэг ирэхээс өмнөх өдрүүдэд амттай зүйл хүсэх, ядаргаа, сэтгэл савлах нь идэх хүслийг хүчтэй болгож байна.`

The new bullets explain that this is not a weakness, can happen for some people on specific cycle days, and should be handled with softer planning rather than harsh rules.

## PDF / Markdown Export Cleanup

- Regenerated `audits/sprint-30-virtual-human-retest/WEIGHT_TEST_10_VIRTUAL_HUMAN_RETEST.pdf`.
- Regenerated `VIRTUAL_HUMAN_REPORTS.md` and raw JSON outputs.
- Confirmed the export no longer includes `Дэлгэрэнгүй тайлан харах`.
- Confirmed the duplicate cycle heading no longer appears.

## Tests Added / Updated

- User 08 simple result must include `Сарын тэмдэг ирэхээс өмнөх өдрүүдэд`.
- Cycle simple result must avoid deterministic diagnosis language.
- Duplicate cycle heading must not appear.
- Feedback survey must contain `[REMOVED_FEATURE_PRICE]-өөр`.
- Feedback survey must not contain `29,000 төлж` or `[REMOVED_FEATURE_PRICE] төлж`.
- Public report copy must not contain `Нурах давтамж`.

## Validation

Passed:

- `node --check app.js`
- `node --check scripts/run-virtual-user-audit.mjs`
- `node scripts/run-virtual-user-audit.mjs --assert-clean`
  - 10 PASS / 0 PARTIAL / 0 FAIL
  - P0/P1/P2: 0/0/0
  - readiness score: 96
- `npm test`
  - all tests passed
- `node --check scripts/export-virtual-human-retest.mjs`
- `node scripts/export-virtual-human-retest.mjs`
  - 10 PASS / 0 PARTIAL / 0 FAIL
  - P0/P1/P2: 0/0/1
  - simple answer clarity average: 8.4
  - paid value average: 6.6
- `git diff --check`

## Recommendation

READY FOR OWNER PDF REVIEW

Human testing, coach testing, public traffic, and paid testing should remain on hold until the owner reviews the regenerated PDF.
