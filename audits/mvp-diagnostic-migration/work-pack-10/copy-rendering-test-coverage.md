# Work Pack 10 Copy Rendering Test Coverage

## Test file

`tests/driver-stack/copyDecisionRenderer.test.js`

## Coverage

- Confirms all required renderer exports exist.
- Confirms `renderCopyDecisionSections(null) === null`.
- Confirms invalid metadata version throws.
- Confirms exactly two fixtures render.
- Confirms each rendering has exactly five sections.
- Confirms every rendering has the exact approved top-level key order.
- Confirms every section has only `title` and `body`.
- Confirms every export result is a full rendering object, not a compact summary row.
- Confirms every rendering includes `fullUserFacingText`.
- Confirms every rendering includes the exact WP10D `qualityChecks` key order.
- Confirms `qualityChecks.internalKeyLeak === false`.
- Confirms `qualityChecks.shameLanguage === false`.
- Confirms `qualityChecks.medicalCauseClaim === false`.
- Confirms `qualityChecks.diagnosisClaim === false`.
- Confirms `qualityChecks.treatmentAdvice === false`.
- Confirms `qualityChecks.runtimeGateRespected === true`.
- Confirms `qualityChecks.experimentIsObservation === true`.
- Confirms `qualityChecks.diaryIsObservation === true`.
- Confirms `pass` explicitly requires runtime gate false, five sections, and populated `fullUserFacingText`.
- Confirms non-decision fixtures return `null`.
- Confirms `medication_body_concern_professional_check` returns `null`.
- Confirms every rendering keeps `decisionStatus === "owner_recommended"`.
- Confirms every rendering keeps `rendererMode === "test_only"`.
- Confirms every rendering keeps `runtimeGate.canRenderInRuntime === false`.
- Confirms user-facing text has no internal key leak.
- Confirms `all_or_nothing_restriction_rebound` renders hunger-safety and restriction/rebound relief.
- Confirms `pcos_body_uncertainty_control` renders `Энэ нь онош биш.` and body-neutral uncertainty language.
- Confirms PCOS, hormone, medication, and glucose are not claimed as causes.
- Confirms both renderings include a 7-day diary confirmation section.
- Confirms the export artifact has two passing results.

## Internal key leak guard

The renderer exposes `hasInternalKeyLeak(text)` for test-only QA. It flags snake_case keys and metadata terms such as `runtimeGate`, `decisionStatus`, `rendererMode`, `owner_recommended`, and `test_only` if they appear in user-facing copy.

## Runtime guard coverage

The test asserts that renderer output is not runtime-approved and cannot render in runtime.
