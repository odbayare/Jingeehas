# Sprint 35D — Montserrat Botanical Premium PDF Prototype

## Scope

This sprint creates a new 5-page Report 1 PDF prototype only.

The full 50-page second virtual cohort PDF was not regenerated.

No report copy, scoring, safety routing, mechanism detection, QPay/payment logic, or deployment state was changed.

## Owner Feedback Addressed

Sprint 35C improved grid alignment, but still felt too dry and form-like.

This prototype adds:

- Montserrat typography
- Subtle botanical line art
- More premium wellness-report atmosphere
- Stronger cover-summary identity
- Warm beige quote treatment
- Locked grid alignment preserved from Sprint 35C

## Font Handling

Montserrat is required. The script does not silently fall back to Helvetica or Arial.

Local font source:

- `~/Library/Fonts/Montserrat-VariableFont_wght.ttf`

The script uses `fontTools` from `/private/tmp/fonttools35d` to create temporary static instances:

- Montserrat Regular, weight 400
- Montserrat Medium, weight 500
- Montserrat Semibold, weight 600
- Montserrat Bold, weight 700

Temporary font instances are written to `/private/tmp` and are not committed to the repo.

PDF resource inspection confirmed embedded subset fonts:

- `Montserrat-Regular`
- `Montserrat-Medium`
- `Montserrat-Semibold`
- `Montserrat-Bold`

## Botanical System

The botanical motif is drawn directly with ReportLab vector paths.

No photos, stock art, emoji, or PNG mockups are used.

Pattern placement:

- Faint line-art leaf motif inside the left spine.
- Very soft corner leaf line motif on the page background.
- Final PDF has no visible debug grid.
- Debug grid exists only in `report-1-grid-debug.pdf`.

## Deliverables

- `audits/sprint-35D-montserrat-botanical-prototype/report-1-montserrat-botanical-prototype.pdf`
- `audits/sprint-35D-montserrat-botanical-prototype/report-1-grid-debug.pdf`
- `audits/sprint-35D-montserrat-botanical-prototype/renders/page-01.png`
- `audits/sprint-35D-montserrat-botanical-prototype/renders/page-02.png`
- `audits/sprint-35D-montserrat-botanical-prototype/renders/page-03.png`
- `audits/sprint-35D-montserrat-botanical-prototype/renders/page-04.png`
- `audits/sprint-35D-montserrat-botanical-prototype/renders/page-05.png`
- `audits/sprint-35D-montserrat-botanical-prototype/report-1-contact-sheet.png`

## Render QA

Rendered PNGs inspected:

- Page 1: cover-summary page; Montserrat readable; quote callout is warm beige; no debug grid.
- Page 2: editorial mechanism page; title/section overlap fixed; botanical motif is subtle line art.
- Page 3: vertical process diagram remains a real timeline, not a numbered text list.
- Page 4: 14-day plan remains a timeline with aligned markers and cards.
- Page 5: diary prompt cards align and share height; next-step card aligns to the grid.
- Contact sheet: all 5 pages reviewed together.

Issues found and fixed during QA:

- Initial Montserrat variable rendering was too thin, so static font instances were generated.
- Initial title accent rule crossed the hero title, so it was moved below the title text.
- Initial section heading on Page 2 overlapped the report title, so heading sizing/positioning was adjusted.
- Initial filled botanical silhouette was too strong, so it was changed to subtle line art.

## Text Leakage QA

Prototype PDF has 5 pages.

Banned terms not found:

- `Route`
- `Verdict`
- `Checklist`
- `Selected answer summary`
- `PASS`
- `FAIL`
- `belonging`
- `rebound`
- `social event`
- `Саналын экспорт`
- `Сонголт руу буцах`
- `Шинээр эхлэх`

## Validation Results

- `node --check app.js` passed
- `node --check scripts/run-virtual-user-audit.mjs` passed
- `node --check scripts/run-sprint-33-second-virtual-cohort.mjs` passed
- `node --check scripts/export-montserrat-botanical-prototype.mjs` passed
- `node scripts/run-virtual-user-audit.mjs --assert-clean` passed: 10 PASS, P0/P1/P2 = 0, readiness 96
- `npm test` passed

## Recommendation

READY FOR OWNER DESIGN REVIEW.

Do not apply this design to all 10 reports until the owner approves this 5-page Montserrat botanical prototype.
