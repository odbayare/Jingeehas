# Future Runtime File Scope Before `app.js`

## Purpose

This document answers what exact future runtime file scope is allowed before touching `app.js`.

## WP13 scope

WP13 allows docs only under:

```text
audits/mvp-diagnostic-migration/work-pack-13/
```

WP13 does not approve any source or runtime file edits.

## Future allowed pre-`app.js` scope

A future work pack may propose changes only after owner approval. Before touching `app.js`, the safer next scope is:

```text
tests/driver-stack/runtimeAdapterPrototype.mjs
tests/driver-stack/runtimeAdapterPrototype.test.js
tests/driver-stack/exportRuntimeAdapterPrototype.mjs
audits/mvp-diagnostic-migration/work-pack-14/
```

Those names are recommendations, not WP13-created files.

## File-scope decision table

| File or area | WP13 status | Earliest possible future status | Requirement before change |
| --- | --- | --- | --- |
| `audits/mvp-diagnostic-migration/work-pack-13/` | Allowed | Complete in WP13 | Docs-only artifacts and owner pack. |
| `tests/driver-stack/runtimeAdapterPrototype.mjs` | Not created by WP13 | Proposed for WP14 | Owner approval of a test-only adapter pack. |
| `tests/driver-stack/runtimeAdapterPrototype.test.js` | Not created by WP13 | Proposed for WP14 | Adapter shape, surface routing, no-key-leak, and payment/safety tests. |
| `tests/driver-stack/exportRuntimeAdapterPrototype.mjs` | Not created by WP13 | Optional future exporter | Only if needed for owner-review artifacts. |
| `audits/mvp-diagnostic-migration/work-pack-14/` | Not created by WP13 | Proposed for WP14 | Owner review artifacts for adapter contract. |
| `app.js` | Forbidden | Later shadow-only implementation candidate | Adapter contract approved, tests green, owner explicitly approves `app.js` scope. |
| `index.html`, `styles.css`, `mockBackend.js`, `package.json`, `_redirects`, `tests/run-all.js` | Forbidden | Only in separately approved future implementation | Explicit owner approval and regression plan. |
| Backend/payment/QPay/pricing/entitlement, PDF scripts | Forbidden | HOLD | Separate owner-approved work pack only. |

## Required pre-`app.js` constraints

Before `app.js` is touched, the future adapter must prove:

- it accepts a stable test-only report/copy payload
- it produces a sanitized user-facing payload
- it separates preview, paid, safety, and internal-only content
- it never exposes internal keys in user-facing fields
- it keeps safety guidance outside payment gates
- it preserves professional-first suppression of ordinary experiments
- it does not mutate WP3 scoring
- it does not mutate WP4 report object contract
- it does not mutate WP9 metadata contract
- it does not mutate WP10/WP12 renderer contract

## Files that remain forbidden until explicit owner approval

- `app.js`
- `index.html`
- `styles.css`
- `mockBackend.js`
- `package.json`
- `_redirects`
- `tests/run-all.js`
- backend/payment/QPay/pricing/entitlement files
- PDF scripts

## First possible `app.js` touch point

The first future `app.js` touch point should be a shadow-only adapter call guarded by tests and feature flags. It must not change visible production report behavior in the same work pack.

## Answer to planning question 5

Before touching `app.js`, the allowed future runtime scope should be limited to a test-only runtime adapter prototype, tests, exporter, and owner-review artifacts. `app.js` remains forbidden until that contract is approved.

Runtime implementation is NOT approved by WP13.
