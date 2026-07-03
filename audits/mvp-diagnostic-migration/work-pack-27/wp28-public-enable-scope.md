# WP28 Public Enable Scope

## Next Work Pack

WP28 — Public Runtime Visible Surface Enable Pack

## WP28 May

- Flip `ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION` to true only after owner approval.
- Keep `ENABLE_VISIBLE_SURFACE_PROTOTYPE` false.
- Validate real `renderReport()` output includes runtime visible surfaces.
- Validate unpaid reports show preview + safety only.
- Validate paid reports show preview + paid + safety.
- Validate safety guidance remains visible without payment.
- Deploy only after tests pass and owner approves deploy.

## WP28 Must Not

- Use WP14 test fixtures in production runtime.
- Render `internalDiagnostics`.
- Render `ownerDebug`.
- Touch QPay/backend/payment/pricing/entitlement.
- Generate PDF.
- Deploy if tests fail.

## Carry-Forward Boundary

WP27 connects the runtime payload but does not enable public visible runtime surfaces.
