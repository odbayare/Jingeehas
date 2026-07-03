# Limited Visible Surface Prototype Summary

## WP20 Scope

WP20 implements a limited, disabled-by-default visible surface prototype for adapter payload surfaces.

Allowed prototype surfaces:

- `previewSections`
- `paidSections`
- `safetyGuidanceSections`

Forbidden rendered surfaces:

- `internalDiagnostics`
- `ownerDebug`

## Runtime Guard

`app.js` includes:

```js
const ENABLE_VISIBLE_SURFACE_PROTOTYPE = false;
```

Default runtime behavior remains unchanged.

Visible surfaces are prototype-only in WP20.

Production release is NOT approved by WP20.

## Prototype Status

The prototype exists as an internal/test helper only.

It is not wired into production report rendering.

Production release remains HOLD.

Deploy remains HOLD.

PDF generation remains HOLD.

Payment/QPay/backend/pricing/entitlement behavior remains HOLD.
