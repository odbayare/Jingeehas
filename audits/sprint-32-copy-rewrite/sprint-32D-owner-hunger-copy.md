# Sprint 32D — Owner-approved Hunger-safety Copy

Date: 2026-06-30

## Status

Recommendation: READY FOR OWNER FINAL COPY REVIEW

Human testing: HOLD
Coach testing: HOLD
Public/paid traffic: HOLD
Deploy: not run
QPay: disabled

## Owner-approved Canonical Sentence

`Удаан юм идээгүй өдөр орой гэнэт өлсөж байгаагаа анзаардаг.`

## Replacements Applied

The canonical sentence was applied to the hunger-safety user-facing report in:

- `Товч хариу`
- `Гол зураг`
- hunger-safety report voice
- evidence note
- user-facing Markdown/PDF export

## Removed From User-facing Export

Checked that user-facing Markdown/PDF no longer contains:

- `Удаан юм идээгүй байх үед орой өлсөлт яаралтай болдог.`
- `Удаан юм идээгүй өдөр орой өлсөлт гэнэт хүчтэй болдог.`
- `Удаан юм идээгүй байх үед орой бие яараад эхэлдэг.`
- `Хоол холдоход дараа өлсөхөөс хамгаалах гэж илүү идэх хандлага гардаг.`
- `Өдөр хоол холдох үед бие орой илүү яаралтай хариу өгч байна.`
- `орой бие хамгаалах гэж яардаг`

Sprint 32C rejected phrase checks remain clean:

- no `бие яараад`
- no `кофеины хил`
- no `орой унтраах`
- no `миний юм`
- no `ганц жижиг баяр`
- no `өөртөө өгөх нэг жижиг зүйл болдог`

## Validation Results

Commands run:

- `node --check app.js`
- `node --check scripts/run-virtual-user-audit.mjs`
- `node --check scripts/export-virtual-human-retest.mjs`
- `node scripts/run-virtual-user-audit.mjs --assert-clean`
- `npm test`
- `node scripts/export-virtual-human-retest.mjs`
- user-facing PDF/Markdown rejected phrase scan

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

Test suite:

- `npm test`: all tests passed

## Remaining Concerns

P2 remains for detailed-report length polish. It is unrelated to this hunger-safety microcopy patch.

## Recommendation

READY FOR OWNER FINAL COPY REVIEW
