# WP27 Runtime Visible Surface Payload Contract

## Payload Shape

The runtime payload builder returns:

- `version: runtime-visible-surface-payload-v0`
- `adapterMode: runtime_visible_surface_v0`
- `source: runtime_report_context`
- `generatedFrom: app.renderReport`
- `reportSurface: runtime_visible_surface`
- `previewSections`
- `paidSections`
- `safetyGuidanceSections`
- `runtimeSafetyGate`
- `paymentGate`
- `pass`

## Explicit Non-Goals

The payload does not include:

- `internalDiagnostics`
- `ownerDebug`
- WP14 fixture names
- WP14 test fixture imports
- QPay/payment/backend fields

## Safety Gate

The runtime payload keeps:

```js
runtimeSafetyGate: {
  canRenderInRuntime: false,
  status: "HOLD"
}
```

This preserves WP27 as a connection pack, not a public enable pack.

## Payment Gate

The runtime payload keeps:

```js
paymentGate: {
  safetyGuidanceRequiresPayment: false,
  paidSectionsRequirePaidAccess: true
}
```

Safety guidance remains outside payment. Paid sections remain gated by the integration helper's `hasPaidAccess` option.
