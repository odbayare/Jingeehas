# Sprint 35C — Locked Grid PDF Design Prototype

## Why Previous Output Failed

Sprint 35, 35A, and 35B improved color and spacing, but the owner rejected the result because it still behaved like stacked document blocks rather than a real PDF layout system.

Observed issues:

- Cards were not locked to a strict grid.
- Several pages felt like styled text stacks.
- The repeating-cycle page still read too much like a numbered list.
- Page 1 hierarchy and metadata balance needed a stronger report-opener structure.
- The 7-day diary page needed to feel complete rather than sparse.

## Sprint Decision

This sprint does not regenerate the full 50-page cohort PDF.

Instead, it creates a 5-page locked-grid prototype for Report 1 only:

- `audits/sprint-35C-locked-grid-prototype/report-1-locked-grid-prototype.pdf`
- `audits/sprint-35C-locked-grid-prototype/report-1-grid-debug.pdf`
- `audits/sprint-35C-locked-grid-prototype/report-1-contact-sheet.png`
- `audits/sprint-35C-locked-grid-prototype/renders/page-01.png`
- `audits/sprint-35C-locked-grid-prototype/renders/page-02.png`
- `audits/sprint-35C-locked-grid-prototype/renders/page-03.png`
- `audits/sprint-35C-locked-grid-prototype/renders/page-04.png`
- `audits/sprint-35C-locked-grid-prototype/renders/page-05.png`

## Grid System Used

Fixed A4 coordinate system:

- `PAGE_W = 595`
- `PAGE_H = 842`
- `SPINE_W = 32`
- `MARGIN_L = 64`
- `MARGIN_R = 42`
- `MARGIN_T = 42`
- `MARGIN_B = 42`
- `CONTENT_X = 64`
- `CONTENT_W = 489`
- `GUTTER = 14`
- `COLS = 6`
- `COL_W = 69.8333`
- `BASELINE = 8`
- `CARD_RADIUS = 12`
- `CARD_PAD = 14`

All major x positions use `gridX(col)` and all card widths use `gridW(span)`.

Allowed layout spans used:

- 6-column full-width cards
- 4-column hero/summary area
- 3-column paired cards
- 2-column metadata/quote column
- 5-column process cards paired with a 1-column marker lane

## Component List

Implemented in `scripts/export-locked-grid-prototype.mjs`:

- `drawPageFrame(pageNumber, reportTitle, sectionName)`
- `drawSpine()`
- `drawHeroTitleBlock()`
- `drawMetaChip(label, value)`
- `drawCard(x, y, w, h, title, body, options)`
- `drawQuoteCard(x, y, w, h, quote)`
- `drawTwoColumnCards(leftCard, rightCard)`
- `drawNumberedRows()`
- `drawFlowDiagram()`
- `drawPlanTimeline()`
- `drawPromptCards()`
- `drawProfessionalSafetyCard()`

## Prototype Pages

Page 1: Cover summary / `Гол зураглал`

- Strong title block
- Right-side metadata chips
- Dominant `Товч хариу`
- Prominent `Гол санаа`
- Paired surface/hidden cards
- Full-width action card

Page 2: `Далд сэтгэлзүйн механизм`

- Full-width `Гол зураг`
- Balanced two-column explanatory cards
- Full-width highlighted `Гол буруу ойлголт`

Page 3: `Давтагддаг тойрог`

- Vertical process diagram
- Numbered circles
- Connector line
- Equal-width step cards
- Bottom `Дахин эргэх цэг` card

Page 4: `Эхний 14 хоногийн туршилт`

- Two aligned top cards
- Vertical 14-day timeline
- Numbered circles and aligned step cards

Page 5: `7 хоногийн тэмдэглэл`

- Intro note card
- Two balanced prompt cards
- Full-width next-step card

## Render QA Result

Rendered pages inspected:

- `page-01.png`
- `page-02.png`
- `page-03.png`
- `page-04.png`
- `page-05.png`
- `report-1-contact-sheet.png`

Result:

- Page 1: grid alignment and quote overflow fixed.
- Page 2: two-column cards align by top and bottom edges.
- Page 3: true process diagram, not a plain numbered text list.
- Page 4: timeline structure reads as a plan, not a bullet list.
- Page 5: prompt cards share y position and height; next-step card is aligned.
- No clipping or overlap observed in rendered PNGs.

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
- `node --check scripts/export-locked-grid-prototype.mjs` passed
- `node scripts/run-virtual-user-audit.mjs --assert-clean` passed: 10 PASS, P0/P1/P2 = 0, readiness 96
- `npm test` passed

## Scope Confirmation

- Full 50-page cohort PDF was not regenerated in this sprint.
- Report copy was not rewritten.
- Scoring was not changed.
- Safety routing was not changed.
- Mechanism detection was not changed.
- QPay/payment logic was not changed.
- No deploy was performed.

## Recommendation

READY FOR OWNER DESIGN REVIEW.

Do not apply this layout to all 10 reports until the owner approves the 5-page Report 1 prototype.
