# WP16 Proposed WP17 Exact Patch Scope

## Purpose

This document defines the exact future WP17 patch scope that may be considered if the owner accepts WP16.

WP16 is docs-only and does not approve implementation.

Runtime implementation is NOT approved by WP16.

## Proposed WP17 title

```text
WP17 - Disabled Shadow Runtime Adapter Integration
```

## Files WP17 may touch only after owner acceptance

| File | Proposed WP17 permission | Exact reason |
| --- | --- | --- |
| `app.js` | Allowed only after owner accepts WP16 | Add disabled shadow flag, pure shadow helper, `renderReport()` shadow call, and test-only internal hook. |
| Future WP17 test file under `tests/` | Allowed only after owner accepts WP16 | Prove disabled behavior is unchanged and enabled shadow path is internal-only. |
| Future WP17 owner-review docs | Allowed | Record evidence, risks, and rollback. |

## Files WP17 must not touch

- `index.html`
- `styles.css`
- `mockBackend.js`
- `package.json`
- `_redirects`
- `tests/run-all.js`
- `tests/driver-stack/runtimeAdapterPrototype.mjs`
- `tests/driver-stack/runtimeAdapterPrototype.test.js`
- `tests/driver-stack/exportRuntimeAdapterPrototype.mjs`
- PDF scripts
- deploy config
- QPay/backend/payment/pricing/entitlement files
- WP3 scoring/fixtures
- WP4 report object contract
- WP9 metadata contract
- WP10/WP12 renderer contract

## Exact allowed `app.js` hunk plan

| Hunk | Allowed change | Required guard |
| --- | --- | --- |
| Top-level constants | Add `const ENABLE_RUNTIME_ADAPTER_SHADOW = false;` | Must default false. |
| Pure helper | Add an internal shadow helper that receives read-only report context | Must not mutate state or render output. |
| `renderReport()` | Call the helper after report context variables are computed and before existing return branches | Must not change existing return branches. |
| `_internal` exports | Add test-only access to the helper or shadow test control | Must not create browser globals or public UI controls. |

## Exact forbidden `app.js` changes

WP17 must not:

- change existing HTML strings;
- change report copy;
- change paywall copy;
- change safety copy;
- change professional-first branch order;
- change `hasOneTimeReportAccess()`;
- change `hasSevenDayAccess()`;
- change `hasUpgradeAccess()`;
- change `saveState()`;
- change `loadState()`;
- change `STORAGE_KEY`;
- change QPay constants or functions;
- change coach/admin behavior;
- change `render()` route dispatch;
- import adapter output into DOM rendering.

## Required patch proof

WP17 owner pack must include:

- exact changed file list;
- exact diff summary;
- disabled flag proof;
- no-visible-output test proof;
- localStorage no-change proof;
- payment/entitlement no-change proof;
- rollback command.

## Exact WP17 gate

WP17 may only implement this exact patch scope if the owner accepts WP16.

Runtime implementation is NOT approved by WP16.
