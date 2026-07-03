# Appjs Visible Surface Implementation Notes

## Changed Area

`app.js` adds a disabled visible surface prototype guard and helper functions near the existing runtime adapter shadow helper.

## Added Guard

```js
const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;
```

The flag is exported through `_internal` for tests.

## Added Helper

`renderVisibleSurfacePrototype(adapterPayload, options)` is a pure helper.

It returns empty HTML when `options.enabled !== true`.

Professional or urgent safety mode can be selected by `mode: "professional"`, `mode: "urgent"`, `professionalFirst: true`, or `urgent: true`.

In those safety modes, preview and paid-depth surfaces are suppressed while safety guidance remains renderable when present.

When enabled by tests, it accepts only a passing WP14 adapter payload that remains:

- `adapterMode: "test_only"`
- `reportSurface: "prototype_only"`
- `runtimeSafetyGate.canRenderInRuntime: false`
- `runtimeSafetyGate.status: "HOLD"`
- `paymentGate.safetyGuidanceRequiresPayment: false`

## Non-Wiring

No production route calls the helper with the visible prototype enabled.

No report branch is changed to render adapter surfaces by default.

No localStorage, payment, QPay, backend, pricing, entitlement, deploy, or PDF behavior is changed.
