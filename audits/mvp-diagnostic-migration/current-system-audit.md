# Current System Audit

Scope: audit-only migration planning for the Weight Test MVP. No app logic, questionnaire copy, report copy, PDF output, payment/QPay, pricing, entitlement, backend, prompt, deploy, or runtime files were changed.

## Files Inspected

| File path | What it appears to control |
|---|---|
| `index.html` | Static shell. Loads `styles.css`, `mockBackend.js`, and `app.js`; no questionnaire/report logic lives here. |
| `app.js` | Main runtime for the static MVP: product pricing constants, state, questionnaire definitions, answer metadata, scoring, safety flags, diary flow, report rendering, QPay prototype calls, coach/admin/demo surfaces, and exported test internals. |
| `mockBackend.js` | Browser/local mock persistence for sessions, assessments, payments, entitlements, lead intents, feedback, coach accounts, report access logs, and audit logs. It is not a real production backend. |
| `README.md` | Product boundaries, local run/test commands, manual demo paths, included features, and safety positioning. |
| `BACKEND_QPAY_INTEGRATION_PLAN.md` | Planning document for future backend, entitlement, payment, QPay, and report snapshot persistence. It explicitly preserves safety bypasses and existing static report logic during migration. |
| `MOCK_BACKEND_ENTITLEMENTS.md` | Mock backend and entitlement reference for prototype persistence. |
| `tests/*` | Regression coverage for safety readiness, question metadata, evidence scoring, report sections, virtual-user QA, commercial/paywall paths, coach flows, copy, and PDF/prototype artifacts. |
| `scripts/export-*.mjs` | PDF/prototype export scripts. These are separate from the live browser report renderer. |
| `audits/*` | Prior sprint audits, virtual user reports, PDF QA notes, and prototype review artifacts. |

## Current Runtime Flow

1. `index.html` mounts `<main id="app">` and loads `mockBackend.js` then `app.js`.
2. `app.js` initializes `state` from `localStorage` using key `weightLossDeepPatternMvp`.
3. User enters via `renderLanding()` and chooses package through `renderChoice()`: one-time or 7-day.
4. `beginAssessment()` creates a mock assessment in `mockBackend.js`, resets Stage 1 answers, and moves to `stage1`.
5. Stage 1 questions come from `stageOneQuestions`; `stageQuestions()` filters them by package and menstrual-cycle gate.
6. Each answer is stored in `state.stageAnswers`; `calculateSafetyFlags()` updates safety flags from stage answers, menstrual logic, voice summaries, and diary entries.
7. `completeStageOne()` stores `state.preliminary = rankedPatterns(false).slice(0, 4)` and routes:
   - one-time: directly to `report`
   - 7-day: to `preliminary`, then unlock/paywall/diary flow
8. The diary flow uses `dailyCore`, `dailyMenstrual`, and adaptive `probeBank` questions chosen by the top preliminary mechanisms.
9. `saveDiaryEntry()` persists a local diary entry, updates safety flags, and routes to `reportReady` after 5+ entries.
10. `renderReport()` decides safety/report mode, paywall/readiness, and then renders either urgent/professional output, one-time report, limited diary state, or full observed report.

## Current Scoring and Routing Model

The current system is mixed, but closer to mechanism/driver-based than route-only.

It is not simply `answers -> one route -> one report`. It has:

- `scores` on many answer options that point to mechanism keys such as `reward`, `regulation`, `hungerSafety`, `glucose`, `satiety`, `cue`, `collapse`, `executive`, `circadian`, `social`, `medical`, `autonomy`, `physiological`, `decisionDefault`, `rewardDeficit`, `roleOverload`, `shameAvoidance`, `bodySafety`, `identity`, and `perfectionism`.
- answer metadata enrichment through `enrichQuestion()`, `optionSignals()`, `dimensionByModule`, and `mechanismNamesByKey`.
- evidence aggregation through `extractTagsFromAnswer()`, `extractMechanismsFromAnswer()`, `aggregateDimensionEvidence()`, `aggregateMechanismSignals()`, and `calculateMechanismEvidence()`.
- primary, secondary, and supporting mechanism selection through `calculateMechanismEvidence()` and `rankedPatterns()`.
- interaction detection through `identifyMechanismCombinations()`.
- report voice selection through `selectReportVoiceKey()` / `reportVoiceFor()` and `REPORT_VOICE_LIBRARY`.

The migration should therefore preserve the existing mechanism architecture but remap it to the new internal driver keys and make the driver stack explicit.

## Safety Logic

Safety logic exists in several places:

- Stage question-level `safety` functions, for example age under 18 and safety/body questions.
- `calculateSafetyFlags()`, which combines stage, menstrual, voice-summary, and diary safety flags.
- `diaryEntrySafetyFlags()` and `calculateDiarySafetyFlags()`, which look for urgent/professional terms in diary entries.
- `safetyFlagsFromTags()`, which maps extracted evidence tags to `urgent` or `professional`.
- `menstrualCycleEvidence()` and `calculateMenstrualSafetyFlags()`, which can produce professional-first routing when cycle disruption, restriction, PCOS/postpartum, or body concerns combine.
- `reportMode()`, which routes to:
  - `deep` / mode1
  - `check` / mode2 body-check note
  - `professional` / mode3 professional-first
  - `urgent` / mode4 urgent safety
- `renderReport()`, which suppresses ordinary report/experiment content for professional-first and urgent safety routes.

New taxonomy safety keys map naturally to existing concepts but are not yet standardized as `binge_risk`, `compensatory_behavior`, `severe_body_distress`, `medical_red_flag`, and `professional_first`.

## PDF / Report Export Logic

The live app report is generated in `app.js`, primarily through:

- `renderReport()`
- `renderHumanReadableReport()`
- `renderOneTimeReport()`
- `renderSimpleResultSection()`
- `renderSurfaceHiddenSection()`
- `renderStagedExperiment()`
- `professionalCheckHtml()`
- `bodySafetyPauseHtml()`
- menstrual-cycle report helpers

PDF/prototype export logic appears separate in scripts:

- `scripts/export-virtual-reports-pdf.mjs`
- `scripts/export-virtual-human-retest.mjs`
- `scripts/export-locked-grid-prototype.mjs`
- `scripts/export-montserrat-botanical-prototype.mjs`
- `scripts/export-botanical-premium-polish.mjs`

This work pack did not regenerate PDF and did not modify export scripts.

## What Not To Touch Yet

- Do not change `app.js` scoring, question flow, report rendering, QPay calls, payment constants, entitlement checks, coach/admin behavior, or localStorage state.
- Do not change `mockBackend.js` persistence, mock payment, entitlement, coach, or audit behavior.
- Do not edit `index.html`, `styles.css`, `_redirects`, runtime scripts, tests, PDF assets, or export scripts.
- Do not regenerate report PDFs or prototype PDFs.
- Do not deploy.
- Do not enable real QPay or backend persistence.
