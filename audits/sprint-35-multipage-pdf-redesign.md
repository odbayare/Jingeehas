# Sprint 35 — Premium Multi-page PDF Redesign

## Scope

PDF layout/design only. Report copy, scoring, safety routing, mechanism detection, QPay, payment, coach flow, and deployment state were not changed.

## Design Direction

- A4 portrait multi-page report.
- Off-white page background.
- Deep muted green headings and charcoal body text.
- Warm beige dividers and subtle section borders.
- Clean section cards with generous whitespace.
- No photos, no emoji, no pasted PNG mockups.
- Layout is implemented in the ReportLab PDF renderer.

## Renderer Changes

- Replaced the plain text PDF export with a structured multi-page renderer in `scripts/run-sprint-33-second-virtual-cohort.mjs`.
- Each ordinary report is rendered as:
  1. Гол зураглал
  2. Далд сэтгэлзүйн механизм
  3. Давтагддаг тойрог
  4. Эхний 14 хоногийн туршилт
  5. 7 хоногийн тэмдэглэл
- Cycle/context reports receive an additional conditional page.
- Professional-first report uses a shorter safety-first/professional-check layout and does not show the ordinary 14-day experiment.

## Output

- PDF: `audits/sprint-33-second-virtual-cohort/WEIGHT_TEST_SECOND_10_USER_FACING_REPORTS.pdf`
- Total pages: 50

## Pages Per Report

| Report | Pages | Notes |
| --- | ---: | --- |
| 1 | 5 | ordinary report |
| 2 | 5 | ordinary report |
| 3 | 5 | ordinary report |
| 4 | 6 | cycle/context conditional page |
| 5 | 5 | ordinary report |
| 6 | 5 | ordinary report |
| 7 | 5 | ordinary report |
| 8 | 6 | cycle/context conditional page |
| 9 | 5 | ordinary report |
| 10 | 3 | professional-first route |

## PDF QA

- PDF renders without generation errors.
- Each report starts on a new page.
- Text extraction includes the user-facing report copy.
- Extracted text banned-term check passed for:
  - `Route`
  - `Verdict`
  - `Checklist`
  - `Selected answer summary`
  - `PASS`
  - `FAIL`
  - `Саналын экспорт`
  - `Сонголт руу буцах`
  - `Шинээр эхлэх`
  - `belonging`
  - `rebound`
- Render smoke pages checked:
  - Report 1 page 1
  - Report 3 page 1
  - Report 7 page 1
  - Report 8 page 1
  - Report 10 page 1
  - Middle timeline page
  - Middle 14-day/checklist page
- Render QA result: no blank pages, clipping, overlap, or broken layout found in inspected pages.

## Validation

- `node --check app.js` passed.
- `node --check scripts/run-virtual-user-audit.mjs` passed.
- `node --check scripts/run-sprint-33-second-virtual-cohort.mjs` passed.
- `node scripts/run-virtual-user-audit.mjs --assert-clean` passed.
- `npm test` passed.
- `node scripts/run-sprint-33-second-virtual-cohort.mjs` passed.
- `git diff --check` passed.

## Recommendation

READY FOR OWNER REVIEW OF PREMIUM MULTI-PAGE PDF
