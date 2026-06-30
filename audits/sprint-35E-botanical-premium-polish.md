# Sprint 35E — PDF Layout Engine QA and Botanical Premium Polish

## Scope

This sprint creates a Report 1 prototype only.

The full 50-page cohort PDF was not regenerated.

No report copy, scoring, safety routing, mechanism detection, QPay/payment logic, or deployment state was changed.

## Owner Feedback Addressed

The previous botanical prototype improved direction, but owner feedback still identified visible UI/layout problems:

- Text could look cramped.
- Some blocks felt unfinished.
- The process needed layout correctness before further aesthetic iteration.
- Any final PDF must not show visible debug grid or construction lines.

## Layout Engine Changes

The new exporter adds fail-fast layout checks before drawing:

- Paragraph height is measured with ReportLab before rendering.
- If a paragraph needs more height than its box allows, PDF generation fails.
- Cards are registered per page.
- Card overlap fails generation.
- Card boxes are checked against the content grid and page safe area.
- Timeline cards and prompt cards use measured text slots.

Issues caught and fixed by the layout checks:

- Hero title box was too short.
- Metadata chips were too short for wrapped profile text.
- Quote card body slot was too short.
- Page 2 two-column body text needed a taller row.
- Page 3 timeline steps needed taller cards.
- Page 4 avoid-list card needed more height.
- Page 5 intro card needed more height after heading-slot changes.

## Visual Polish

Kept:

- Montserrat typography
- Locked grid
- Deep green spine
- Off-white paper background
- Warm gold accent
- Subtle botanical line motif
- Beige quote card

Removed or reduced:

- Any final debug grid
- Ruler-like repeated botanical stems
- Strong filled botanical silhouettes
- Background pattern competing with body text

The debug grid exists only in:

- `audits/sprint-35E-botanical-premium-polish/report-1-grid-debug.pdf`

## Deliverables

- `audits/sprint-35E-botanical-premium-polish/report-1-botanical-premium-prototype.pdf`
- `audits/sprint-35E-botanical-premium-polish/report-1-grid-debug.pdf`
- `audits/sprint-35E-botanical-premium-polish/renders/page-01.png`
- `audits/sprint-35E-botanical-premium-polish/renders/page-02.png`
- `audits/sprint-35E-botanical-premium-polish/renders/page-03.png`
- `audits/sprint-35E-botanical-premium-polish/renders/page-04.png`
- `audits/sprint-35E-botanical-premium-polish/renders/page-05.png`
- `audits/sprint-35E-botanical-premium-polish/report-1-contact-sheet.png`

## Render QA

Rendered assets inspected:

- Contact sheet
- Page 1
- Page 5

QA result:

- No visible debug grid in final PDF renders.
- No visible text overflow or clipping.
- No visible card overlap.
- Page 3 remains a process diagram, not a text list.
- Page 4 remains a plan timeline.
- Page 5 prompt cards align and share height.
- Botanical motif is limited to the spine and soft corner line art.

## PDF QA

- Prototype PDF page count: 5
- Banned text leakage: none found
- Embedded Montserrat subset fonts found:
  - Montserrat Regular
  - Montserrat Medium
  - Montserrat Semibold
  - Montserrat Bold

## Validation Results

- `node --check app.js` passed
- `node --check scripts/run-virtual-user-audit.mjs` passed
- `node --check scripts/run-sprint-33-second-virtual-cohort.mjs` passed
- `node --check scripts/export-botanical-premium-polish.mjs` passed
- `node scripts/run-virtual-user-audit.mjs --assert-clean` passed: 10 PASS, P0/P1/P2 = 0, readiness 96
- `npm test` passed
- `git diff --check` passed

## Recommendation

READY FOR OWNER DESIGN REVIEW.

Do not apply this layout to all 10 reports until the owner approves this Report 1 prototype.
