# Work Pack 9 Metadata Test Coverage

## Test file

`tests/driver-stack/copyDecisionMetadata.test.js`

## Coverage

- Confirms the four required exports exist.
- Confirms only the two WP8 copy-sensitive fixtures are decision fixtures.
- Confirms `buildFixtureCopyDecisionMetadataList(fixtures)` returns exactly two items.
- Confirms non-decision fixtures return `null`.
- Confirms the professional-first fixture `medication_body_concern_professional_check` returns `null` and is omitted.
- Confirms every emitted metadata object has the exact approved top-level key list.
- Confirms `pass === true` on every emitted metadata object.
- Confirms `runtimeGate.canRenderInRuntime === false` on every emitted metadata object.
- Confirms `all_or_nothing_restriction_rebound` keeps `hiddenFoodFunctionKey === "hunger_safety"`.
- Confirms `all_or_nothing_restriction_rebound` receives `supplementaryNarrative.id === "restriction_rebound_relief"`.
- Confirms `pcos_body_uncertainty_control` keeps `safetyMode === "mode1"`.
- Confirms `pcos_body_uncertainty_control` keeps `hiddenFoodFunctionKey === "control_regain"`.
- Confirms `pcos_body_uncertainty_control` receives `softMedicalContextBridge.id === "body_uncertainty_soft_medical_context"`.
- Confirms both fixtures use `decisionStatus === "owner_recommended"`, not `owner_approved`.
- Confirms the export artifact contains full metadata objects, not compact rows.
- Confirms stale WP8 risk flag names are absent without retaining those stale names as exact literals in the test file.

## Runtime guard coverage

The test rejects runtime-looking fields including:

- `runtimeIntegrationEnabled`
- `html`
- `pdf`
- `localStorage`
- `appJs`

The metadata remains test-only and cannot be mistaken for runtime approval.
