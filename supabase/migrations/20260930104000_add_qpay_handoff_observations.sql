begin;

set local lock_timeout = '5s';

-- Add browser observations without changing payment truth, historical rows,
-- analytics privileges, or existing funnel aggregates.
alter table jingeehas.analytics_events
  drop constraint analytics_events_event_name_check;

alter table jingeehas.analytics_events
  add constraint analytics_events_event_name_check check (event_name = any (array[
    'landing_viewed'::text,
    'landing_cta_clicked'::text,
    'start_cta_clicked'::text,
    'payment_preparation_viewed'::text,
    'payment_cta_clicked'::text,
    'checkout_submitted'::text,
    'assessment_shell_created'::text,
    'assessment_shell_create_failed'::text,
    'invoice_create_started'::text,
    'assessment_started'::text,
    'assessment_completed'::text,
    'free_assessment_started'::text,
    'free_assessment_completed'::text,
    'initial_result_viewed'::text,
    'post_assessment_paywall_viewed'::text,
    'result_email_saved'::text,
    'full_report_cta_clicked'::text,
    'paywall_viewed'::text,
    'payment_page_rendered'::text,
    'invoice_created'::text,
    'payment_confirmed'::text,
    'invoice_create_failed'::text,
    'payment_check_started'::text,
    'payment_check_failed'::text,
    'recovery_requested'::text,
    'recovery_succeeded'::text,
    'report_opened'::text,
    'full_report_opened'::text,
    'qpay_handoff_attempted'::text,
    'qpay_page_returned'::text
  ]));

insert into jingeehas.schema_migrations(version)
values ('20260930104000_add_qpay_handoff_observations')
on conflict (version) do nothing;

commit;
