# WP17 Shadow Output Invariance Report

## Invariance claim

Shadow integration produced no user-visible report output.

The disabled shadow path returns an ignored internal no-op signal and does not alter rendered report HTML.

## Automated coverage

`tests/runtime-adapter-shadow-integration.test.js` compares report output before and after disabled shadow helper calls for:

- one-time paid report
- one-time unpaid/paywall branch
- removed-feature full report
- removed-feature readiness hold
- professional-first branch
- urgent safety branch

The test also scans returned HTML for adapter field names and raw fixture names.

## Required hold

Production runtime rendering is NOT approved by WP17.
