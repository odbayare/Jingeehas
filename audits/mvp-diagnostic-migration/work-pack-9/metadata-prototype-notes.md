# Work Pack 9 Metadata Prototype Notes

## Purpose

WP9 creates a test-only copy decision metadata prototype from the WP8 schema. It does not integrate with runtime, does not change production report rendering, does not change WP3 scoring or fixtures, and does not change the WP4 report object contract.

## Files added

- `tests/driver-stack/copyDecisionMetadata.mjs`
- `tests/driver-stack/copyDecisionMetadata.test.js`
- `tests/driver-stack/exportCopyDecisionMetadata.mjs`
- `audits/mvp-diagnostic-migration/work-pack-9/copy-decision-metadata-results.json`

## Metadata behavior

The prototype consumes WP4 report objects and returns full copy decision metadata only for the two WP8-approved copy-sensitive fixtures:

- `all_or_nothing_restriction_rebound`
- `pcos_body_uncertainty_control`

All other fixtures return `null`. `buildFixtureCopyDecisionMetadataList(fixtures)` omits nulls and returns exactly two metadata objects.

## Metadata object contract

Every emitted metadata object has exactly these top-level keys:

- `version`
- `fixtureName`
- `decisionStatus`
- `safetyMode`
- `hiddenFoodFunctionKey`
- `supplementaryNarrative`
- `softMedicalContextBridge`
- `copyRiskFlags`
- `structureDecisionNotes`
- `runtimeGate`
- `pass`

## Proven decisions

### `all_or_nothing_restriction_rebound`

- Keeps `hiddenFoodFunctionKey === "hunger_safety"`.
- Receives `supplementaryNarrative.id === "restriction_rebound_relief"`.
- Keeps `safetyMode === "mode1"`.
- Keeps `decisionStatus === "owner_recommended"`.
- Keeps `runtimeGate.canRenderInRuntime === false`.

### `pcos_body_uncertainty_control`

- Keeps `safetyMode === "mode1"`.
- Keeps `hiddenFoodFunctionKey === "control_regain"`.
- Receives `softMedicalContextBridge.id === "body_uncertainty_soft_medical_context"`.
- Keeps `decisionStatus === "owner_recommended"`.
- Keeps `runtimeGate.canRenderInRuntime === false`.

## Runtime approval boundary

The metadata is deliberately test-only. It is not runtime approval. It is not owner-approved runtime copy. It is not a production report renderer.

Runtime integration remains HOLD until a future work pack explicitly approves runtime planning and verifies copy rendering, safety, payment, and regression gates.
