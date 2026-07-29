begin;

-- Paid-first assessment shells intentionally exist before a safety-check row is
-- created. Keep the legacy foreign key and existing values, but allow the
-- prepaid shell to carry a null safety_check_id until the safety gate runs.
alter table jingeehas.assessments
  alter column safety_check_id drop not null;

-- Keep the event contract in lockstep with the browser and server analytics
-- allowlists. This is a forward-only replacement of the older check; no event
-- rows are rewritten or removed.
alter table jingeehas.analytics_events
  drop constraint if exists analytics_events_event_name_check;

alter table jingeehas.analytics_events
  add constraint analytics_events_event_name_check check (event_name = any (array[
    'landing_viewed'::text,
    'landing_cta_clicked'::text,
    'start_cta_clicked'::text,
    'payment_preparation_viewed'::text,
    'assessment_started'::text,
    'assessment_completed'::text,
    'paywall_viewed'::text,
    'invoice_created'::text,
    'payment_confirmed'::text,
    'invoice_create_failed'::text,
    'payment_check_started'::text,
    'payment_check_failed'::text,
    'recovery_requested'::text,
    'recovery_succeeded'::text,
    'report_opened'::text
  ]));

insert into jingeehas.schema_migrations(version)
values ('20260724170700_repair_paid_first_schema_contracts')
on conflict (version) do nothing;

commit;
