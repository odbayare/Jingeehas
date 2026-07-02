# WP16 Shadow Feature Flag Plan

## Purpose

This document defines the disabled feature flag required before any future shadow runtime adapter integration.

WP16 is docs-only.

Runtime implementation is NOT approved by WP16.

## Required flag

WP17 must use this exact flag name and default value:

```text
ENABLE_RUNTIME_ADAPTER_SHADOW = false
```

The flag must be disabled by default in production and test runtime.

## Required rules

| Rule | Required WP17 behavior | Reason |
| --- | --- | --- |
| Exact name | `ENABLE_RUNTIME_ADAPTER_SHADOW` | Keeps owner review and tests unambiguous. |
| Exact default | `false` | Prevents accidental runtime behavior. |
| Public URL enablement | Forbidden | Query params must not expose shadow behavior. |
| localStorage enablement | Forbidden | Storage must not become a hidden runtime switch. |
| Payment enablement | Forbidden | Payment state must not activate shadow rendering. |
| Entitlement enablement | Forbidden | Entitlements must not activate shadow rendering. |
| Deploy enablement | Forbidden | Deploy config must not turn shadow on. |
| Test enablement | Allowed only through explicit test-only internals | Keeps browser users unaffected. |

## Allowed future placement

If WP17 is accepted, the constant may be added near the top-level app constants in `app.js`.

Allowed shape:

```text
const ENABLE_RUNTIME_ADAPTER_SHADOW = false;
```

WP17 must not add:

- a public UI toggle;
- a query-param toggle;
- a localStorage toggle;
- a backend toggle;
- a QPay/payment toggle;
- a pricing/entitlement toggle;
- a deploy environment toggle.

## Disabled behavior

When `ENABLE_RUNTIME_ADAPTER_SHADOW` is `false`:

- no adapter payload is generated in browser runtime;
- no returned HTML changes;
- no DOM output changes;
- no localStorage read is added;
- no localStorage write is added;
- no payment or entitlement call changes;
- no scoring or report-copy path changes;
- no PDF or deploy path is touched.

## Test-only enabled behavior

If WP17 needs to exercise the shadow path in tests, it may do so only through a test-only internal hook under `module.exports._internal`.

The enabled test-only path may return an internal validation object to the test process, but it must not:

- append data to returned report HTML;
- write to `state`;
- call `saveState()`;
- call `localStorage`;
- call QPay endpoints;
- call backend or mockBackend mutation APIs;
- expose `previewSections`, `paidSections`, `safetyGuidanceSections`, `internalDiagnostics`, or `ownerDebug` in user-facing markup.

## Required invariant checks

When the shadow path is enabled in tests, WP17 must assert:

- `adapterMode === "test_only"`;
- `reportSurface === "prototype_only"`;
- `runtimeSafetyGate.canRenderInRuntime === false`;
- `paymentGate.safetyGuidanceRequiresPayment === false`;
- no adapter user-facing field leaks internal keys;
- no adapter field appears in returned `renderReport()` HTML.

## Owner acceptance requirement

WP17 may add `ENABLE_RUNTIME_ADAPTER_SHADOW = false` to `app.js` only after the owner accepts WP16.

Runtime implementation is NOT approved by WP16.
