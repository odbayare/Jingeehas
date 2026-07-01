# Work Pack 10 Copy Rendering Notes

## Purpose

WP10 creates a test-only copy renderer prototype that consumes WP9 copy decision metadata and renders safe Mongolian user-facing draft sections for the two copy-sensitive fixtures.

This is not runtime integration. It does not modify `app.js`, runtime report rendering, scoring, fixtures, PDF, backend, payment, QPay, pricing, entitlement, or localStorage behavior.

## Renderer source

- `tests/driver-stack/copyDecisionRenderer.mjs`
- `tests/driver-stack/copyDecisionRenderer.test.js`
- `tests/driver-stack/exportCopyDecisionRenderings.mjs`

## Renderer contract

The renderer exports:

- `renderCopyDecisionSections(metadata, options = {})`
- `renderFixtureCopyDecisionSections(fixture)`
- `renderFixtureCopyDecisionSectionList(fixtures)`
- `collectUserFacingText(rendering)`
- `hasInternalKeyLeak(text)`

## Rendering behavior

The renderer only renders metadata where:

- `metadata.version === "copy-decision-metadata-v0-test-only"`
- `metadata.decisionStatus === "owner_recommended"`
- `metadata.runtimeGate.canRenderInRuntime === false`
- `metadata.fixtureName` is one of the two WP9 copy decision fixtures

All non-decision fixtures return `null` or are omitted from list exports.

## Output behavior

Each rendering keeps:

- `decisionStatus === "owner_recommended"`
- `runtimeGate.canRenderInRuntime === false`
- `rendererMode === "test_only"`

Each rendering now has five user-facing section drafts. Each section uses only:

- `title`
- `body`

The export artifact contains the full rendering objects, including `fullUserFacingText` and `qualityChecks`. The `qualityChecks` object uses the exact WP10D contract:

- `internalKeyLeak`
- `shameLanguage`
- `medicalCauseClaim`
- `diagnosisClaim`
- `treatmentAdvice`
- `runtimeGateRespected`
- `experimentIsObservation`
- `diaryIsObservation`

The rendered sections are Mongolian draft copy for owner review. They are not approved production report copy.

## Fixture-specific proof

### `all_or_nothing_restriction_rebound`

The rendering includes:

- a hunger-safety explanation without the internal key
- a restriction/rebound relief narrative
- restart-pressure language
- a gentle next-meal reset
- a 14-day experiment framed as a test, not a command
- a 7-day diary confirmation section

### `pcos_body_uncertainty_control`

The rendering includes:

- `Энэ нь онош биш.`
- body-neutral uncertainty language
- a soft professional-context bridge
- ordinary observation language
- no PCOS, hormone, medication, or glucose cause claim
- a 7-day diary confirmation section

## Runtime hold

Runtime integration remains HOLD. Production rendering remains HOLD. PDF generation and deploy remain HOLD.
