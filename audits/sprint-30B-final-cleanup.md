# Sprint 30B — Final Virtual Retest Cleanup

## Context

Sprint 30A fixed the `Товч хариу` layer for the menstrual-cycle persona, but owner PDF review found that the detailed report still used the self-neglect / reward-deficit voice. This patch aligns the detailed report with the cycle-centered simple answer and cleans final export wording.

## Issues Fixed

- User 08 detailed report now uses a menstrual-cycle contextual report voice when strong premenstrual appetite/craving evidence is present and self-neglect evidence is weak or absent.
- Feedback survey/export wording now uses `29,000₮-өөр`.
- Sprint 30 Markdown/PDF export no longer includes the interactive label `Дэлгэрэнгүй тайлан харах`.
- Public refinement copy no longer uses `Нурах давтамж`.

## User 08 Before / After

Before:

- Simple answer was menstrual-cycle centered.
- Detailed report still opened with self-neglect / reward-deficit language:
  - `Өдөржин өөрийн хэрэгцээ хамгийн сүүлд...`
  - `надад ч гэсэн нэг юм хэрэгтэй`

After:

- Simple answer:
  - `Сарын тэмдэг ирэхээс өмнөх өдрүүдэд амттай зүйл хүсэх, ядаргаа, сэтгэл савлах нь идэх хүслийг хүчтэй болгож байна.`
- Detailed report opening:
  - `Сарын тэмдэг ирэхээс өмнөх өдрүүдэд амттай зүйл хүсэх, ядаргаа, нойр, сэтгэл санаа зэрэг хамт өөрчлөгдөж байгаа нь таны хариултаас харагдаж байна.`
- Detailed report now includes:
  - cycle-aware food function bullets
  - cycle-aware repeating loop
  - soft non-diagnostic explanation
  - cycle-aware avoid list
  - gentle first small change
  - cycle-aware 14-day experiment
  - cycle-aware 7-day refinement bullets

## Price Wording Fix

Good wording:

`Энэ тайланг 29,000₮-өөр авахад үнэ цэнтэй санагдах уу?`

Rejected variants:

- `29,000 төлж`
- `29,000₮ төлж`
- `29,000-өөр`

## PDF / Markdown Export Cleanup

- Regenerated `audits/sprint-30-virtual-human-retest/WEIGHT_TEST_10_VIRTUAL_HUMAN_RETEST.pdf`.
- Regenerated Sprint 30 Markdown/raw outputs.
- Export no longer includes `Дэлгэрэнгүй тайлан харах`.
- Export no longer includes duplicate cycle heading.
- Export no longer includes stray empty `##` before detailed report content.

## Tests Run

Passed:

- `node --check app.js`
- `node --check scripts/run-virtual-user-audit.mjs`
- `node scripts/run-virtual-user-audit.mjs --assert-clean`
- `npm test`
- `node --check scripts/export-virtual-human-retest.mjs`
- `node scripts/export-virtual-human-retest.mjs`
- `git diff --check`

## Sprint 30 Retest Result

- 10 PASS
- 0 PARTIAL
- 0 FAIL
- P0/P1/P2: 0/0/1
- Simple answer clarity average: 8.4
- Paid value average: 6.6

## Recommendation

READY FOR OWNER PDF REVIEW

Human testing, coach testing, public traffic, and paid testing should remain on hold until owner approval.
