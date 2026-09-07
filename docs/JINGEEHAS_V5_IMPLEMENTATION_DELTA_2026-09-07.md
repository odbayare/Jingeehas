# JINGEEHAS V5 IMPLEMENTATION DELTA

Date: 2026-09-07
Branch: `codex/v5-body-functional-context`
PR: #65 (draft)
Status: BRANCH IMPLEMENTED / NOT DEPLOYED

This note records the implementation choices that became more precise after the original V5 design contract was written.

## Version compatibility

- `QUESTIONNAIRE_VERSION` remains a compatibility alias for V4 (`jingeehas-production-2026-08-v4-household-context`) so historical callers/tests keep their exact semantics.
- `CURRENT_QUESTIONNAIRE_VERSION` is V5 (`jingeehas-production-2026-09-v5-body-functional-context`).
- The public free-postpaid create endpoint assigns V5 only to a genuinely new assessment. A resumable V4 assessment remains V4.
- `retiredIn` was added so historical question IDs remain materializable for V1–V4 but are absent from V5.

## User-facing option compatibility

New multi-select none/exclusion options use the existing UI-supported exact value `Аль нь ч биш` rather than introducing another exclusive-option spelling.

`Q-WAIST` currently renders the skip instruction inline:

`Бүсэлхийн тойргоо мэддэг бол сантиметрээр оруулна уу. Мэдэхгүй бол алгасаж болно.`

It remains optional.

## Safety interruption mechanism

The clinical thresholds and safety classifier are unchanged.

Rather than adding a second safety classifier to every save request, V5 `visibleQuestions()` truncates the remaining route once an existing safety trigger becomes knowable:

- recent self-harm screen → route ends at `S1-S04-NOW`
- acute medical trigger → route ends at `S1-B01`
- recent compensatory behavior → method-history/commercial questions are removed after the higher-priority self-harm/acute screens

The existing browser `nextQuestion()` therefore reaches the existing completion endpoint immediately at the terminal visible safety question, and the existing authoritative `calculateAssessmentSafety()` creates the safety report/route. V1–V4 routing is unchanged.

This preserves one authoritative safety classifier while preventing V5 users with a known safety trigger from continuing into method-history/paywall flow.

## Body/function report integration

Body/function data is derived in a dedicated non-diagnostic, non-counted module. The completed V5 report snapshot is enriched with:

- factual body-measurement context
- factual functional-context factors
- recommendation-feasibility modifiers
- medical/reproductive professional guidance where directly supported
- menopause only as a non-causal life-stage context

The enrichment is idempotent, so completion retries cannot duplicate factors.

No BMI, waist, waist-to-height ratio, target gap, functional flag, household flag, reproductive state or medical-monitoring context changes core pattern score/count.

## Maintenance repair

`OPEN-PAST` is retired in V5. `Q-MAINTENANCE-PLAN` provides structured evidence only for users meeting the long-duration + initial-loss + regain gates.

`Үгүй, өөр хувилбар бэлдээгүй` produces the explicit maintenance-gap anchor required by `previous_attempt_sustainability`.

## Question-progress outcome analytics

Repo migration:

`20260907104746_v5_split_question_progress_terminal_outcomes.sql`

The migration is committed to the branch only and has NOT been applied to production.

Legacy fields remain available:

- `completed_count` = terminal completions
- `completion_rate` = terminal completion rate

New fields separate safety and commercial outcomes:

- `terminal_completed_count`
- `terminal_completion_rate`
- `commercial_completed_count`
- `safety_exit_count`
- `commercial_eligible_started_count`
- `commercial_completion_rate`
- `safety_exit_rate`

Safety exit is classified from the authoritative assessment outcome (`report_mode = safety` or non-null `safety_route`). Commercial completion explicitly excludes those rows.

The admin question-progress API exposes both the legacy aliases and the new split metrics. It falls back safely when connected to a pre-migration backend, so code deployment cannot invent historical safety-exit counts.

## Release boundary

Still prohibited without separate approval:

- merge to main
- production deploy
- applying the new Supabase migration to production
- historical report regeneration
- price/payment changes
- changing the clinical meaning/threshold of `S1-S03` or `S1-B01`
