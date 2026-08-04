begin;

set local lock_timeout = '5s';

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
    'full_report_opened'::text
  ]));

do $migration$
declare
  current_definition text;
  mapped_definition text;
begin
  select pg_get_functiondef('jingeehas.get_daily_funnel_analytics(date,date)'::regprocedure)
  into current_definition;

  mapped_definition := regexp_replace(
    current_definition,
    $pattern$initial_results[[:space:]]+as[[:space:]]*\([[:space:]]*select \* from first_events where event_name = 'initial_result_viewed'[[:space:]]*\)$pattern$,
    $replace$initial_results as (
  select distinct on (funnel_key_hash) *
  from first_events
  where event_name in ('initial_result_viewed', 'post_assessment_paywall_viewed')
  order by funnel_key_hash, occurred_at
)$replace$,
    'i'
  );

  if mapped_definition = current_definition then
    raise exception 'JH_POST_ASSESSMENT_PAYWALL_ANALYTICS_MAPPING_NOT_APPLIED';
  end if;

  execute mapped_definition;
end
$migration$;

revoke all on function jingeehas.get_daily_funnel_analytics(date, date) from public, anon, authenticated;
grant execute on function jingeehas.get_daily_funnel_analytics(date, date) to service_role;

insert into jingeehas.schema_migrations(version)
values ('20260804043918_map_post_assessment_paywall_analytics')
on conflict (version) do nothing;

commit;
