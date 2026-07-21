# Paid-first assessment flow migration

Migration: `20260721143352_add_paid_first_assessment_flow.sql`.

The migration is additive. It adds `commercial_flow_version` and `started_at` to the private `jingeehas.assessments` table, classifies all existing rows as `legacy_postpaid_v1`, expands the status constraint for prepaid states, and adds lookup indexes. New prepaid rows are assigned by the server as `prepaid_v2`; the browser cannot select a flow version or paid state.

No answer, report, payment, entitlement, commission, or recovery payload is rewritten. Existing legacy rows keep their original status and continue through the postpaid resolver. The daily funnel resolver uses `started_at` for prepaid rows and the original `created_at` meaning for legacy rows.

The private schema remains RLS-enabled and reachable only through the existing service-role gateway. This migration adds no public grants and no public table.
