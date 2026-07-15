# Mongolian Copy Engineering Validation

## Generated provenance

- Generator version: `2.0.0`
- Extraction source commit: `7e5d4bc9ad963b9e1532353adb626b337c5442e6`
- Final PR head and final-head workflow IDs: maintained in PR #1 metadata after the implementation push to avoid a self-referential validation-only commit cycle
- Pending approved replacement count: 0
- Applied owner correction count: 1
- Production copy changed: YES — exact owner-authorized navigation and same-origin endpoint corrections only
- External network attempts during extraction: 0

## Generated metrics

- Raw literal count: 6,386
- Review-ready unique entry count: 1,238
- Excluded internal/unproven count: 4,716
- Duplicate occurrence count: 468
- Duplicate canonical-group count: 195
- YES scenarios: 51
- Partial or missing scenarios: 0
- Question count: 102
- Answer-option count: 601
- Safety entries: 60
- Payment/QPay/paywall entries: 101
- Admin entries: 8
- Advisor entries: 36
- Internal tester entries: 48
- Structural mixed-language signals: 44

## Extraction architecture

Every scenario declares `FULL_SURFACE`, `ISOLATED_COMPONENT`, or `ATTRIBUTE_ONLY`. Sample report, upgrade offer, QPay, payment error, and diary confirmation use direct existing component renderers. Accessibility extraction reads attributes only. Diary home uses `renderDiaryHome`. Advisor fixtures use the local mock backend. Internal tester fixtures use the existing `internalTest` state gate.

## Permitted app.js test exports

Only existing functions were added to CommonJS `_internal`; no function body or string changed:

- `renderDiaryHome`
- `renderDiaryInput`
- `renderDailySummaryConfirmation`
- `renderSampleResultPreview`
- `renderUpgradeOffer`
- `renderWeightQpayPaymentBox`
- `qpayStatusMessage`

## Required validation

- `git diff --check`: PASS
- `node --check app.js`: PASS
- `node --check tools/extract-rendered-copy.mjs`: PASS
- `node tools/extract-rendered-copy.mjs`: PASS
- Focused catalog, safety, routing, pricing, and public-language tests: PASS
- `npm test`: PASS
- Final-head GitHub Actions: recorded in PR metadata and final handoff after push
- Pricing and safety behavior: unchanged; focused tests PASS
- Deploy: NOT PERFORMED
- Merge: NOT PERFORMED
## Owner review pack generation

- Generator version: `1.0.0`
- Generated from commit: `7e5d4bc9ad963b9e1532353adb626b337c5442e6`
- Catalog entries assigned: 1238
- P0 unique items: 231
- P1 unique items: 264
- P2 unique items: 743
- Batch/pack files: 45
- Unassigned items: 0
- No-review-signal items: 20
- Cross-group items: 284
- Unresolved source mappings: 433
- Blank owner-decision blocks: 830
- Pending approved replacement count: 0
- Applied owner correction count: 1
- Review-pack integrity test: PASS
- Authorized production correction limited to the home label, home path, and same-origin function endpoints
