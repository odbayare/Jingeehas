# Sprint 32 - Mongolian Literary Style Bible + Report Copy Rewrite

Date: 2026-06-30

## Reference Handling

Reference PDF: `Оройгүй сүм - Л.Түдэв.pdf`

The reference was used only to extract high-level Mongolian writing principles:

- start from a concrete moment
- let verbs carry the sentence
- use time, body, and place words
- avoid stacked abstract nouns
- show cause/effect through a lived scene
- keep serious writing clear and human

No sentences or distinctive passages from the novel were copied into product copy.

## Files Created

- `MONGOLIAN_REPORT_STYLE_BIBLE.md`
- `audits/sprint-32-copy-rewrite/user-facing/WEIGHT_TEST_USER_FACING_10_REPORTS.md`
- `audits/sprint-32-copy-rewrite/user-facing/WEIGHT_TEST_USER_FACING_10_REPORTS.pdf`
- `audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.md`
- `audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.pdf`

## Public Report Copy Changes

- Rewrote report openings around lived scenes rather than abstract labels.
- Replaced stiff report-engine wording with shorter Mongolian clauses.
- Reduced repeated abstract words such as report mechanics and internal analysis terms.
- Reworked Mode 3 professional-first and Mode 4 urgent safety copy to sound human and direct.
- Reworked menstrual-cycle note to avoid over-explaining and keep the copy non-diagnostic.
- Reworked cue/environment language around visible objects and hand movement.
- Reworked sleep/energy language around low sleep, weak evenings, and a simple shutdown routine.

## Export Separation

User-facing export now contains only the report text a user would review.

It excludes:

- internal route/verdict/checklist fields
- answer IDs
- virtual human feedback
- PASS/FAIL audit labels
- markdown heading leakage
- internal audit labels

Internal audit export now separately contains persona, route, verdict, selected answers, checklist, and virtual feedback.

## Validation

- `node --check app.js`: pass
- `node --check scripts/run-virtual-user-audit.mjs`: pass
- `node --check scripts/export-virtual-human-retest.mjs`: pass
- `node scripts/run-virtual-user-audit.mjs --assert-clean`: pass, 10 PASS, 0 PARTIAL, 0 FAIL, P0/P1/P2 = 0, readiness 96
- `npm test`: pass, including `tests/sprint32-export-separation.test.js`
- `node scripts/export-virtual-human-retest.mjs`: pass, Sprint 32 user-facing/internal PDFs generated
- User-facing Markdown banned phrase scan: clean
- User-facing PDF extracted text banned phrase scan: clean
- User-facing PDF render smoke: page 1 rendered, no visible glyph/clipping/overlap issue

## Recommendation

READY FOR OWNER COPY REVIEW.

Human testing, coach testing, public traffic, paid traffic, QPay, staging, and production deploy remain on hold until explicit owner approval.
