# Question progress analytics rollback

The migration is additive. It adds the canonical questionnaire-version metadata column, `jingeehas.assessment_question_progress`, two private functions, and two private gateway actions. It does not alter assessment answers, payments, invoices, or entitlements.

Rollback order:

1. Deploy the prior application bundle so no new progress calls are emitted.
2. Restore the preceding `jingeehas.execute_request(jsonb)` definition from `20260720073844_repair_daily_funnel_source_of_truth.sql` plus the report-snapshot branches already present in production.
3. Revoke and drop `jingeehas.get_question_progress_analytics(date,date,timestamptz)` and `jingeehas.record_question_progress(jsonb)`.
4. Drop `jingeehas.assessment_question_progress` only after exporting it if the analytics history must be retained.
5. Keep `assessments.questionnaire_version` during normal rollback because it is harmless canonical metadata; remove it only after confirming no newer application build depends on it.

The rollback must not delete or update rows in `assessments`, `assessment_answers`, `payments`, or `entitlements`.
