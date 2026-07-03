# WP27 Runtime Wiring Inspection

## Definition

`renderReportWithRuntimeVisibleSurface(reportHtml, reportContext = {}, adapterPayload = null, options = {})` is defined in `app.js` near the visible surface helper.

## WP26 State

Before WP27, real `renderReport()` call sites passed `adapterPayload = null`, so flipping the runtime guard would fail closed and preserve original report HTML.

## WP27 State

WP27 changes the call sites to pass:

```js
buildRuntimeVisibleSurfacePayload(reportContext)
```

## Call Sites

| Call site | Payload state | Guard state | Default output |
| --- | --- | --- | --- |
| one-time `renderReport()` branch | runtime payload connected | `ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = false` | unchanged |
| seven-day `renderReport()` branch | runtime payload connected | `ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION = false` | unchanged |

## Available Report Context

The call sites provide:

- `mode`
- `ranked` or selected mechanisms
- `primary`
- `secondary`
- `packageType`
- `readiness`
- `quality`
- `tags`

## Decision

The WP26 null-payload blocker is fixed. Public enable remains blocked until a later owner-approved work pack flips the runtime integration guard and validates live output.
