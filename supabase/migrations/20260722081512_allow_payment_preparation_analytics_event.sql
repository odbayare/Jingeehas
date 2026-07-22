begin;

alter table jingeehas.analytics_events
  drop constraint analytics_events_event_name_check;

alter table jingeehas.analytics_events
  add constraint analytics_events_event_name_check check (event_name = any (array[
    'landing_viewed'::text,
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
values ('20260722081512_allow_payment_preparation_analytics_event')
on conflict (version) do nothing;

commit;
