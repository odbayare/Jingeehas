# Sprint 32B — Final User-facing PDF Polish

Date: 2026-06-30

## Status

Recommendation: READY FOR OWNER COPY REVIEW

Human testing: HOLD
Coach testing: HOLD
Public/paid traffic: HOLD
Deploy: not run
QPay: disabled

## Owner Review Issues

1. `Тэр үед хоол танд юу өгч байсан байж болох вэ?` sounded translated and heavy.
2. User 08 menstrual-cycle report repeated the same idea in too many places.
3. Clean user-facing PDF/Markdown still leaked navigation or button labels in some routes.
4. 7-day refinement section repeated generic body text and CTA text.
5. Intro sentence needed a more natural Mongolian wording.

## Fixes Applied

### Food-function Heading

Replaced:

`Тэр үед хоол танд юу өгч байсан байж болох вэ?`

with:

`Тэр мөчид хоол ямар мэдрэмж өгч байна вэ?`

The body under this heading remains archetype-specific. The old generic opener is not used.

### Menstrual-cycle Compression

User 08 now keeps cycle context in:

- `Товч хариу`
- core detailed report copy
- avoid list
- 14-day experiment
- 7-day refinement questions

Removed the extra standalone section:

`Сарын тэмдэг ирэхийн өмнөх өдрүүдэд`

after the 14-day experiment. The report keeps `онош биш` once in the simple answer.

### Export Cleanup

User-facing Markdown/PDF export now strips standalone navigation and button lines:

- `Эхний хариу руу буцах`
- `Шинээр эхлэх`
- `Сонголт руу буцах`
- `Саналын экспорт`
- `Санал илгээх`
- `[REMOVED_FEATURE_REFINEMENT]`
- `Дэлгэрэнгүй тайлан харах`

These remain available in app UI where appropriate, but do not appear in the clean report export.

### 7-day Refinement

Heading remains:

`7 хоногийн тэмдэглэл юуг тодруулах вэ?`

The body is now archetype-specific and short.

Examples:

- Executive: `Орой хоол бодох хамгийн хүнд өдөр аль нь вэ?`
- Stress: `Стрессийн дараа идэх хүсэл хэдэн удаа гарч байна вэ?`
- Restriction: `“Өнөөдөр өнгөрлөө” гэсэн бодол ямар үед гарч байна вэ?`
- Hunger: `Хоолны зай хэдэн цаг болоход орой яаралтай өлсөж байна вэ?`
- Menstrual: `Сарын тэмдэг ирэхийн өмнөх өдрүүдэд идэх хүсэл хэр өөр байна вэ?`

### Intro Sentence

Replaced the intro with:

`Доорх тайлан таны хариултад тулгуурласан эхний тайлбар. Өөрийгөө буруутгах гэж биш, өдөрт яг аль мөч дээр гацдагаа харах гэж уншаарай.`

## Tests Updated

Updated user-facing export tests to assert:

- new food-function heading is present
- old generic food-function copy is absent
- old intro sentence is absent
- new intro sentence is present
- standalone navigation/action labels are absent
- standalone `[REMOVED_FEATURE_REFINEMENT]` CTA is absent from clean export
- User 08 does not include a separate `Сарын тэмдэг ирэхийн өмнөх өдрүүдэд` section after the experiment

Updated existing exact wording tests for the new heading and 7-day refinement text.

## Validation Results

Commands run:

- `node --check app.js`
- `node --check scripts/run-virtual-user-audit.mjs`
- `node --check scripts/export-virtual-human-retest.mjs`
- `node scripts/run-virtual-user-audit.mjs --assert-clean`
- `node scripts/export-virtual-human-retest.mjs`
- `npm test`
- user-facing PDF/Markdown banned phrase and navigation scan
- `pdfinfo audits/sprint-32-copy-rewrite/user-facing/WEIGHT_TEST_USER_FACING_10_REPORTS.pdf`
- rendered page 1 and page 8 to PNG for visual smoke check
- `git diff --check`

Virtual user audit:

- 10 PASS
- 0 PARTIAL
- 0 FAIL
- P0 = 0
- P1 = 0
- P2 = 0
- readinessScore = 96

Virtual human retest export:

- 10 PASS
- 0 PARTIAL
- 0 FAIL
- P0 = 0
- P1 = 0
- P2 = 1
- recommendation = READY FOR CONTROLLED HUMAN RETEST

PDF/export checks:

- User-facing PDF: 10 pages, A4
- text extraction succeeded
- no internal route/verdict/checklist labels found
- no navigation/button leakage found
- no standalone `[REMOVED_FEATURE_REFINEMENT]` CTA found
- rendered page 1 and page 8 were legible with no visible clipping or overlap

## Remaining Concerns

P2 remains for detailed-report length polish. It is not a P0/P1 blocker for owner copy review.

## Recommendation

READY FOR OWNER COPY REVIEW
