# WP16 Shadow Adapter Invocation Contract

## Purpose

This document defines how a future WP17 may invoke the WP14 runtime adapter in shadow mode without visible user-facing output.

WP16 is docs-only.

Runtime implementation is NOT approved by WP16.

## Source adapter

The current adapter source is:

```text
tests/driver-stack/runtimeAdapterPrototype.mjs
```

The adapter remains test-only. WP17 must not modify the WP14 adapter module, test, or exporter unless a future owner-approved scope explicitly allows it.

## Invocation principle

Shadow invocation means:

- adapter validation may happen internally;
- returned report HTML must remain unchanged;
- no adapter payload may be rendered;
- no adapter payload may be persisted;
- no adapter payload may be sent to payment, backend, deploy, PDF, or analytics paths.

## Exact invocation contract table

| Contract area | Required behavior | Forbidden behavior | Test required |
| --- | --- | --- | --- |
| input source | Use read-only report context already computed inside `renderReport()` or the existing WP14 test-only adapter export path. | Reading raw localStorage, QPay invoice payloads, payment sessions, coach tokens, DOM nodes, PDF output, or deploy metadata. | Assert the shadow helper receives only approved context fields or the existing WP14 test-only adapter payload. |
| output destination | Return only an internal test/QA validation object when explicitly enabled in tests. | Rendering adapter payload fields to DOM, report HTML, paywalls, coach/admin surfaces, PDF, backend, analytics, or deploy paths. | Assert returned report HTML does not contain adapter field names or adapter content. |
| no-visible-output rule | Keep user-facing report HTML byte-for-byte unchanged when `ENABLE_RUNTIME_ADAPTER_SHADOW = false`. | Any visible UI, copy, button, route, paywall, safety, or report-section change. | Snapshot/compare existing report outputs with the flag false. |
| no payment mutation | Preserve payment, QPay, pricing, entitlement, mockBackend access, and coach payment behavior. | Calling QPay endpoints, changing product codes, changing prices, changing access helpers, or treating adapter payment fields as entitlements. | Assert access helpers and QPay/payment diffs remain unchanged. |
| no report mutation | Preserve existing report branch order, returned HTML, report copy, scoring, evidence, and readiness behavior. | Replacing report renderers, changing report copy, changing scoring, or wiring adapter sections into visible reports. | Assert one-time, removed-feature, safety, professional, and readiness flows remain unchanged. |
| no localStorage mutation unless explicitly approved | Do not read localStorage, write localStorage, call `saveState()`, or persist shadow diagnostics. | Adding storage keys, persisted flags, adapter payloads, owner debug, diagnostics, or shadow state. | Assert storage key and state shape remain unchanged; spy or inspect that shadow path does not call storage APIs. |
| console logging policy | No production console logging from the shadow path; test logs may come only from explicit test commands. | Logging adapter payloads, internal diagnostics, fixture names, owner debug, or user-sensitive report context in browser runtime. | Assert no shadow helper console output is required for pass/fail behavior. |
| internal QA capture policy | Keep internal QA capture limited to test process output or owner-review artifacts. | Persisting QA payloads in browser state, localStorage, backend, PDF, deploy artifacts, or visible UI. | Assert generated QA artifacts are explicit test outputs only and not runtime state. |
| adapter failure behavior | Contain adapter failures so existing user flow and report rendering continue unchanged when shadow mode is disabled. | Throwing adapter errors into user flow, blocking report rendering, changing route, or showing fallback UI. | Assert disabled shadow path cannot fail user rendering; enabled test-only failures fail tests only. |

## Required input boundary

The future shadow helper may receive read-only report context already computed by `renderReport()`.

Allowed read-only context:

- report mode;
- ranked mechanism list;
- primary mechanism;
- secondary mechanisms;
- package type;
- report readiness;
- stage evidence;
- narrative evidence;
- report tags;
- helper output already computed inside `renderReport()`.

Forbidden input:

- raw localStorage object;
- QPay invoice payload;
- payment session ID;
- coach session token;
- backend mutation output;
- DOM nodes;
- generated HTML string as an adapter input;
- PDF output;
- deploy metadata.

## Required output boundary

The future shadow helper may return only an internal validation object to tests.

Allowed internal fields:

- `shadowAttempted`;
- `shadowEnabled`;
- `adapterMode`;
- `reportSurface`;
- `runtimeCanRender`;
- `safetyGuidanceRequiresPayment`;
- `pass`;
- `errors`.

Forbidden user-facing output:

- `previewSections`;
- `paidSections`;
- `safetyGuidanceSections`;
- `internalDiagnostics`;
- `ownerDebug`;
- raw fixture names;
- raw mechanism keys;
- raw test-only status strings;
- runtime gate metadata.

## Required guard

The invocation must be guarded by:

```text
ENABLE_RUNTIME_ADAPTER_SHADOW = false
```

When the flag is false, the shadow helper must return without building or rendering an adapter payload.

## Required non-rendering contract

WP17 tests must prove:

- shadow invocation does not change `renderReport()` return values when disabled;
- shadow invocation does not append adapter text to HTML when enabled in tests;
- shadow invocation does not mutate state;
- shadow invocation does not call `saveState()`;
- shadow invocation does not read or write localStorage;
- shadow invocation does not alter access helpers;
- shadow invocation preserves WP14 safety/payment invariants.

## Module-format constraint

`app.js` is currently CommonJS-testable and browser-script-oriented. The WP14 adapter is an ESM module.

WP17 must not restructure `app.js` or the production build to solve module-format friction.

If direct browser invocation is not feasible without widening scope, WP17 must keep adapter invocation in Node tests and limit `app.js` to a pure shadow hook proving no visible behavior changes.

## Final contract

The adapter may be invoked only as an internal shadow validation path.

It may not become production rendering.

Runtime implementation is NOT approved by WP16.
