# Future WP20 Exact Patch Scope

## Exact Future Work Pack Name

WP20 — Limited Visible Surface Prototype

## Exact Proposed Scope

WP20 may prototype a limited, owner-reviewed, non-production mapping from adapter payload surfaces to visible runtime UI slots.

WP20 may only prototype visible surfaces if the owner accepts WP19.

WP20 must preserve all WP19 safety, payment, copy, test, and rollback gates.

## Allowed Files

Recommended WP20 allowed files if owner approves implementation:

- `app.js`
- `tests/visible-surface-prototype.test.js`
- `audits/mvp-diagnostic-migration/work-pack-20/*`

Optional only if needed:

- `tests/run-all.js`

## Forbidden Files Unless Separately Approved

- `index.html`
- `styles.css`
- `mockBackend.js`
- `package.json`
- `_redirects`
- backend/payment/QPay/pricing/entitlement files
- PDF scripts
- WP3/WP4/WP9/WP10/WP12/WP14 contract files

## Allowed Surfaces

WP20 may prototype only these surfaces if owner-approved:

- `previewSections`
- `paidSections`
- `safetyGuidanceSections`

## Forbidden Surfaces

WP20 may not render these surfaces to users:

- `internalDiagnostics`
- `ownerDebug`

WP20 may not render internalDiagnostics or ownerDebug.

## Required Feature Guard

WP20 must use an explicit owner-approved visible prototype guard.

WP20 must not treat `ENABLE_RUNTIME_ADAPTER_SHADOW = false` or the WP17 shadow path as production rendering approval.

## Required Tests

WP20 must include tests for:

- preview surface rendering behind owner-approved guard;
- paid surface rendering behind paid access;
- safety guidance visible without payment;
- `internalDiagnostics` not rendered;
- `ownerDebug` not rendered;
- no adapter field names visible;
- no internal keys visible;
- no diagnosis/treatment claim;
- no payment mechanics in sensitive guidance;
- professional-first route suppression;
- urgent route suppression;
- payment failure keeps safety visible;
- restore/reload entitlement behavior unchanged;
- localStorage behavior unchanged unless explicitly approved;
- current report output unchanged where surfaces are not enabled;
- full `npm test`;
- no deploy/PDF/payment/backend touched.

## Rollback Requirement

WP20 must be revertible with one commit revert.

Rollback plan exists before any visible runtime release.

## Owner Approval Required

Owner approval is required before WP20 begins.

Owner approval is required before any visible runtime release.

Owner approval is required before any deploy-specific work pack.

## Explicit Boundaries

WP20 may not deploy.

WP20 may not change QPay/backend/payment/pricing/entitlement behavior.

WP20 may not render internalDiagnostics or ownerDebug.

WP20 may not change production report copy without owner-approved copy QA.

WP20 must be revertible with one commit revert.

Production release requires a later deploy-specific work pack.

## Conclusion

Visible runtime report rendering is NOT approved by WP19.
