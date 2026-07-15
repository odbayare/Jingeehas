# Mongolian Copy Engineering Validation

## Generated provenance

- Generator version: `2.0.0`
- Extraction source commit: `c047136ac56b8db941c0ebd30deacd1dc8b01df1`
- Final PR head and final-head workflow IDs: maintained in PR #1 metadata after the implementation push to avoid a self-referential validation-only commit cycle
- Pending approved replacement count: 0
- Applied owner correction count: 1
- Production scope changed: YES — owner-authorized removed-feature assessment removal; one-time payment and safety behavior retained
- External network attempts during extraction: 0

## Generated metrics

- Raw literal count: 5,671
- Review-ready unique entry count: 916
- Excluded internal/unproven count: 4,319
- Duplicate occurrence count: 311
- Duplicate canonical-group count: 124
- YES scenarios: 30
- Partial or missing scenarios: 0
- Question count: 84
- Answer-option count: 518
- Safety entries: 60
- Payment/QPay/paywall entries: 70
- Admin entries: 8
- Advisor entries: 36
- Internal tester entries: 48
- Structural mixed-language signals: 42

## Extraction architecture

Every scenario declares `FULL_SURFACE`, `ISOLATED_COMPONENT`, or `ATTRIBUTE_ONLY`. Sample report, QPay, and payment error use direct existing component renderers. Accessibility extraction reads attributes only.  Advisor fixtures use the local mock backend. Internal tester fixtures use the existing `internalTest` state gate.

## Permitted app.js test exports

Retained CommonJS `_internal` extraction exports:

- `renderSampleResultPreview`
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
- One-time pricing and safety behavior retained; focused tests PASS
- Deploy: NOT PERFORMED
- Merge: NOT PERFORMED
