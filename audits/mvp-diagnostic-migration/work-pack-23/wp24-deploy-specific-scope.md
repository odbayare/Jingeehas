# WP24 Deploy-Specific Scope

## Next Work Pack

WP24 — Deploy-Specific Release Pack

## WP24 May

- Run final deploy readiness validation.
- Decide whether to deploy with guards false.
- Prepare rollback notes.
- Verify production URLs only if owner approves deploy.

## WP24 Must Not

- Enable public visible surfaces unless owner explicitly approves.
- Change QPay/backend/payment/pricing.
- Render `internalDiagnostics` or `ownerDebug`.
- Generate PDF unless separately approved.

## Carry-Forward Decision

Public visible runtime surfaces are NOT approved by WP23.

WP23 does not deploy.

## Guard Carry-Forward

- `ENABLE_VISIBLE_SURFACE_PROTOTYPE` remains false.
- `ENABLE_RUNTIME_VISIBLE_SURFACE_INTEGRATION` remains false.

## WP24 Default Recommendation

WP24 should remain deploy-specific and guard-preserving unless the owner explicitly changes the release boundary.
