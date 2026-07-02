# Runtime Regression Test Plan

## Purpose

This document answers what tests must pass before any runtime implementation or deploy.

## Required validation before runtime implementation

Run and pass:

```bash
git status --short
git diff --check
node --check app.js
node --check tests/driver-stack/driverStackReportObject.mjs
node --check tests/driver-stack/copyDecisionMetadata.mjs
node --check tests/driver-stack/copyDecisionRenderer.mjs
node --check tests/driver-stack/exportCopyDecisionRenderings.mjs
node tests/driver-stack/driverStackContract.test.js
node tests/driver-stack/driverStackFixtures.test.js
node tests/driver-stack/driverStackSafetyInvariants.test.js
node tests/driver-stack/driverStackReportObject.test.js
node tests/driver-stack/copyDecisionMetadata.test.js
node tests/driver-stack/copyDecisionRenderer.test.js
node tests/driver-stack/exportCopyDecisionRenderings.mjs > /tmp/wp13_copy_rendering_check.json
npm test
git diff -- app.js index.html styles.css mockBackend.js package.json _redirects
git diff -- tests/run-all.js
```

## Required future adapter tests

A future runtime adapter work pack must add tests proving:

- exact adapter top-level object shape
- exact user-facing section shape
- no internal key leakage in preview, paid, or safety fields
- free preview does not expose paid ordinary depth
- paid report includes ordinary depth only after entitlement
- safety/professional guidance appears without payment
- professional-first route suppresses ordinary experiments
- non-decision fixtures do not receive sensitive copy-decision rendering
- copy-sensitive fixtures render only approved polished sections
- no product/payment mechanics leak into sensitive copy

## Command/result evidence required in future owner packs

| Command | Required result before runtime implementation |
| --- | --- |
| `git status --short` | Only owner-approved files are changed or untracked; unrelated folders remain untracked and unstaged. |
| `git diff --check` | Passes with no whitespace errors. |
| `node --check app.js` | Passes. |
| `node --check tests/driver-stack/driverStackReportObject.mjs` | Passes. |
| `node --check tests/driver-stack/copyDecisionMetadata.mjs` | Passes. |
| `node --check tests/driver-stack/copyDecisionRenderer.mjs` | Passes. |
| `node --check tests/driver-stack/exportCopyDecisionRenderings.mjs` | Passes. |
| `node tests/driver-stack/driverStackContract.test.js` | Passes. |
| `node tests/driver-stack/driverStackFixtures.test.js` | Passes. |
| `node tests/driver-stack/driverStackSafetyInvariants.test.js` | Passes. |
| `node tests/driver-stack/driverStackReportObject.test.js` | Passes. |
| `node tests/driver-stack/copyDecisionMetadata.test.js` | Passes. |
| `node tests/driver-stack/copyDecisionRenderer.test.js` | Passes. |
| `node tests/driver-stack/exportCopyDecisionRenderings.mjs > /tmp/wp13_copy_rendering_check.json` | Passes and writes reviewable JSON. |
| `npm test` | Passes. |
| `git diff -- app.js index.html styles.css mockBackend.js package.json _redirects` | Empty. |
| `git diff -- tests/run-all.js` | Empty. |

## Required copy regression scans

Future tests must scan user-facing copy for forbidden language:

- internal keys
- raw fixture names
- raw scoring names
- diagnosis claims
- treatment claims
- medical-cause claims
- shame or discipline-failure claims
- diet-plan commands
- payment mechanics in safety copy

## Required manual QA before deploy

Manual QA must cover:

- desktop report rendering
- mobile report rendering
- unpaid preview
- paid report
- professional-first route
- medical-context bridge route
- no internal key visibility
- no stuck loading state
- no localStorage regression
- no payment entitlement regression

## Answer to planning question 6

No runtime implementation or deploy should proceed until current driver-stack/copy tests, full `npm test`, forbidden-file diffs, future adapter tests, safety/payment tests, internal-key scans, and manual QA all pass.

Runtime implementation is NOT approved by WP13.
