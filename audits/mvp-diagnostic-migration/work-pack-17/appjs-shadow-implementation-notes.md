# WP17 app.js Shadow Implementation Notes

## Changed `app.js` areas

| Area | Change | Runtime impact |
| --- | --- | --- |
| Top-level constants | Added `ENABLE_RUNTIME_ADAPTER_SHADOW = false`. | Disabled by default. |
| Internal helper | Added `prepareRuntimeAdapterShadowSignal()`. | Returns internal validation only. |
| `renderReport()` | Added one ignored helper call after existing context variables are computed. | No branch or returned HTML changes. |
| `_internal` export | Exposes the flag and helper for tests. | No browser global or UI control added. |

## Guardrails

- No adapter sections are rendered.
- No adapter diagnostics are persisted.
- No localStorage key is added.
- No `saveState()` call is added.
- No payment, QPay, backend, pricing, entitlement, deploy, or PDF path is called.
- The WP14 adapter module, test, and exporter are not modified.
