# Surface Rendering Behavior Report

## Surface Behavior Table

| Surface | Enabled prototype behavior | Disabled/default behavior | Payment behavior | Safety behavior |
| --- | --- | --- | --- | --- |
| `previewSections` | Renders sanitized preview HTML only under explicit enabled test/internal options. | Does not render by default. | Does not require paid access. | Must not expose paid-depth or safety-sensitive internal fields. |
| `paidSections` | Renders sanitized paid-depth HTML only under explicit enabled test/internal options. | Does not render by default. | paidSections render only with paid access in prototype mode. | Must not contain or hide safety guidance. |
| `safetyGuidanceSections` | Renders sanitized safety guidance HTML only under explicit enabled test/internal options. | Does not render by default. | safetyGuidanceSections render without payment in prototype mode. | Remains visible without payment in prototype mode. |
| `internalDiagnostics` | internalDiagnostics are never rendered. | internalDiagnostics are never rendered. | Not applicable. | Internal diagnostics remain non-user-facing. |
| `ownerDebug` | ownerDebug is never rendered. | ownerDebug is never rendered. | Not applicable. | Owner debug remains non-user-facing. |

## Disabled Behavior

When disabled, the helper returns:

- `prototypeAttempted: false`
- `visiblePrototypeEnabled: false`
- empty `html`
- `pass: true`

The disabled path leaves report HTML and in-memory state unchanged.

## Preview Surface

`previewSections` can render only through explicit enabled test/internal options.

The prototype maps these sections to the preview surface label:

`Эхний товч зураглал`

## Paid Surface

`paidSections` render only when:

```js
hasPaidAccess === true
```

Without paid access, paid-depth HTML is omitted.

paidSections render only with paid access in prototype mode.

## Safety Guidance Surface

`safetyGuidanceSections` render without payment when the prototype is explicitly enabled.

Payment failure does not hide safety guidance.

safetyGuidanceSections render without payment in prototype mode.

## Professional And Urgent Suppression

For `professional` and `urgent` modes, ordinary preview and paid-depth surfaces are suppressed, while safety guidance remains renderable when present.

For `professionalFirst: true` and `urgent: true`, ordinary preview and paid-depth surfaces are suppressed, while safety guidance remains renderable when present.

## Forbidden Surfaces

The prototype does not read or render:

- `internalDiagnostics`
- `ownerDebug`

internalDiagnostics are never rendered.

ownerDebug is never rendered.

## Release Boundary

Production release is NOT approved by WP20.
