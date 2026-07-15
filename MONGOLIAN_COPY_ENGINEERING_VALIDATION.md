# Mongolian Copy Engineering Validation

## Generated provenance

- Generator version: `2.1.0`
- Extraction source commit: `42916f11d7750769e76d6e295a0e56629e5b0175`
- Final PR head and final-head workflow IDs: maintained in PR #1 metadata after the implementation push to avoid a self-referential validation-only commit cycle
- Pending approved replacement count: 0
- Applied owner correction count: 1
- Production scope changed: YES — owner-authorized removed-feature assessment removal; one-time payment and safety behavior retained
- External network attempts during extraction: 0

## Generated metrics

- Raw literal count: 5,706
- Review-ready unique entry count: 912
- Excluded internal/unproven count: 4,344
- Duplicate occurrence count: 302
- Duplicate canonical-group count: 120
- YES scenarios: 31
- Partial or missing scenarios: 0
- Question count: 84
- Answer-option count: 518
- Safety entries: 60
- Payment/QPay/paywall entries: 64
- Admin entries: 8
- Advisor entries: 34
- Internal tester entries: 48
- Structural mixed-language signals: 31

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
## Owner review pack generation

- Generator version: `1.0.0`
- Generated from commit: `42916f11d7750769e76d6e295a0e56629e5b0175`
- Catalog entries assigned: 912
- P0 unique items: 187
- P1 unique items: 125
- P2 unique items: 600
- Batch/pack files: 35
- Unassigned items: 0
- No-review-signal items: 0
- Cross-group items: 174
- Unresolved source mappings: 273
- Blank owner-decision blocks: 570
- Pending approved replacement count: 18
- Applied owner correction count: 1
- Review-pack integrity test: PASS
- Authorized production correction limited to the home label, home path, and same-origin function endpoints
