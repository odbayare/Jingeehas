# WP31 Mobile Readability Check

Date: 2026-07-03

| Case | Result | Evidence |
| --- | --- | --- |
| unpaid/locked | PASS | `renderReport()` output keeps `data-surface="preview"` and `data-surface="safety"` visible while suppressing `data-surface="paid"` in `tests/public-visible-surface-ux-polish.test.js`. |
| paid | PASS | `renderReport()` output keeps preview, paid, and safety surfaces visible for paid access in `tests/public-visible-surface-ux-polish.test.js`. |
| payment failed | PASS | Error-state locked output keeps preview plus safety and does not render paid surface in `tests/public-visible-surface-ux-polish.test.js`. |
| professional | PASS | Professional route renders safety only and suppresses preview/paid surfaces in `tests/public-visible-surface-ux-polish.test.js`. |
| urgent | PASS | Urgent route renders safety only and suppresses preview/paid surfaces in `tests/public-visible-surface-ux-polish.test.js`. |
| mobile spacing | PASS | `styles.css` includes `.runtime-visible-surface-integration`, `.visible-surface-card`, and `@media (max-width: 520px)` rules for tighter mobile headings, padding, and spacing. |
| internal leak | PASS | WP31 test blocks `internalDiagnostics`, `ownerDebug`, `fixtureName`, `runtimeGate`, `decisionStatus`, `rendererMode`, and raw fixture names from visible output. |
| payment boundary | PASS | Unpaid and payment-failed cases suppress paid surface; QPay endpoint strings and pricing constants remain unchanged in the WP31 test. |
| safety boundary | PASS | Safety guidance remains visible in unpaid, paid, payment-failed, professional, and urgent cases; professional/urgent routes show safety only. |
