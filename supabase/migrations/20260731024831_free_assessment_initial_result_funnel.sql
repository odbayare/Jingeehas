begin;

alter table jingeehas.assessments
  drop constraint assessments_commercial_flow_version_check;

alter table jingeehas.assessments
  add constraint assessments_commercial_flow_version_check check (
    commercial_flow_version in ('legacy_postpaid_v1', 'prepaid_v2', 'free_assessment_postpaid_v1')
  );

alter table jingeehas.analytics_events
  add column if not exists funnel_key_hash text;

alter table jingeehas.analytics_events
  add constraint analytics_events_funnel_key_hash_check check (
    funnel_key_hash is null or funnel_key_hash ~ '^[a-f0-9]{64}$'
  );

create index analytics_events_funnel_key_idx
  on jingeehas.analytics_events (funnel_key_hash, event_name, occurred_at)
  where funnel_key_hash is not null;

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

alter table jingeehas.report_snapshots
  add constraint report_snapshots_safe_initial_result_shape_check check (
    initial_view->>'schemaVersion' is distinct from 'jingeehas-initial-result-v1'
    or (
      jsonb_typeof(initial_view) = 'object'
      and (initial_view - array[
        'schemaVersion', 'mode', 'primaryPattern', 'summary', 'additionalPatternCount', 'lockedSections'
      ]::text[]) = '{}'::jsonb
      and initial_view->>'mode' in ('pattern', 'neutral')
      and jsonb_typeof(initial_view->'lockedSections') = 'array'
      and jsonb_array_length(initial_view->'lockedSections') = 7
      and jsonb_typeof(initial_view->'additionalPatternCount') = 'number'
      and (
        (
          initial_view->>'mode' = 'neutral'
          and initial_view->'primaryPattern' = 'null'::jsonb
          and jsonb_typeof(initial_view->'summary') = 'string'
        )
        or (
          initial_view->>'mode' = 'pattern'
          and jsonb_typeof(initial_view->'primaryPattern') = 'object'
          and ((initial_view->'primaryPattern') - array['title', 'summary']::text[]) = '{}'::jsonb
          and jsonb_typeof(initial_view->'primaryPattern'->'title') = 'string'
          and jsonb_typeof(initial_view->'primaryPattern'->'summary') = 'string'
          and not (initial_view ? 'summary')
        )
      )
    )
  );

alter table jingeehas.report_snapshot_versions
  add constraint report_snapshot_versions_safe_initial_result_shape_check check (
    report_payload->'initialView'->>'schemaVersion' is distinct from 'jingeehas-initial-result-v1'
    or (
      jsonb_typeof(report_payload->'initialView') = 'object'
      and ((report_payload->'initialView') - array[
        'schemaVersion', 'mode', 'primaryPattern', 'summary', 'additionalPatternCount', 'lockedSections'
      ]::text[]) = '{}'::jsonb
      and report_payload->'initialView'->>'mode' in ('pattern', 'neutral')
      and jsonb_typeof(report_payload->'initialView'->'lockedSections') = 'array'
      and jsonb_array_length(report_payload->'initialView'->'lockedSections') = 7
      and jsonb_typeof(report_payload->'initialView'->'additionalPatternCount') = 'number'
      and (
        (
          report_payload->'initialView'->>'mode' = 'neutral'
          and report_payload->'initialView'->'primaryPattern' = 'null'::jsonb
          and jsonb_typeof(report_payload->'initialView'->'summary') = 'string'
        )
        or (
          report_payload->'initialView'->>'mode' = 'pattern'
          and jsonb_typeof(report_payload->'initialView'->'primaryPattern') = 'object'
          and ((report_payload->'initialView'->'primaryPattern') - array['title', 'summary']::text[]) = '{}'::jsonb
          and jsonb_typeof(report_payload->'initialView'->'primaryPattern'->'title') = 'string'
          and jsonb_typeof(report_payload->'initialView'->'primaryPattern'->'summary') = 'string'
          and not (report_payload->'initialView' ? 'summary')
        )
      )
    )
  );

create table jingeehas.analytics_flow_cutovers (
  flow_version text primary key,
  cutover_at timestamptz not null,
  created_at timestamptz not null
);

alter table jingeehas.analytics_flow_cutovers enable row level security;
revoke all on table jingeehas.analytics_flow_cutovers from public, anon, authenticated;
grant select on table jingeehas.analytics_flow_cutovers to service_role;

insert into jingeehas.analytics_flow_cutovers (flow_version, cutover_at, created_at)
values ('free_assessment_postpaid_v1', clock_timestamp(), clock_timestamp())
on conflict (flow_version) do nothing;

create or replace function jingeehas.find_analytics_events(filters jsonb)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if filters ? 'rate_key_hash' and (select count(*) from jsonb_object_keys(filters)) = 1 then
    select coalesce(jsonb_agg(to_jsonb(row_value)), '[]'::jsonb) into result
    from jingeehas.analytics_events row_value
    where rate_key_hash = filters->>'rate_key_hash';
  elsif filters ? 'assessment_id' and filters ? 'event_name' and (select count(*) from jsonb_object_keys(filters)) = 2 then
    select coalesce(jsonb_agg(to_jsonb(row_value)), '[]'::jsonb) into result
    from jingeehas.analytics_events row_value
    where assessment_id = filters->>'assessment_id' and event_name = filters->>'event_name';
  elsif filters ? 'funnel_key_hash' and filters ? 'event_name' and (select count(*) from jsonb_object_keys(filters)) = 2 then
    select coalesce(jsonb_agg(to_jsonb(row_value)), '[]'::jsonb) into result
    from jingeehas.analytics_events row_value
    where funnel_key_hash = filters->>'funnel_key_hash' and event_name = filters->>'event_name';
  else
    raise exception using errcode = '22023', message = 'JH_ANALYTICS_FILTER_INVALID';
  end if;
  return result;
end $$;

revoke all on function jingeehas.find_analytics_events(jsonb) from public, anon, authenticated;
grant execute on function jingeehas.find_analytics_events(jsonb) to service_role;

create or replace function jingeehas.get_daily_funnel_analytics(p_start_date date, p_end_date date)
returns jsonb language sql stable security definer set search_path = '' as $$
with config as (
  select cutover_at as free_flow_cutover_at
  from jingeehas.analytics_flow_cutovers
  where flow_version = 'free_assessment_postpaid_v1'
), bounds as (
  select p_start_date::timestamp at time zone 'Asia/Ulaanbaatar' as range_start,
    (p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar' as range_end
), public_events as (
  select e.*
  from jingeehas.analytics_events e
  where not e.is_admin and not e.is_owner_preview and not e.is_test
), first_events as (
  select distinct on (event_name, funnel_key_hash)
    event_name, funnel_key_hash, visitor_id_hash, occurred_at, amount_mnt
  from public_events
  where funnel_key_hash is not null
  order by event_name, funnel_key_hash, occurred_at
), free_starts as (
  select * from first_events where event_name = 'free_assessment_started'
), free_completes as (
  select * from first_events where event_name = 'free_assessment_completed'
), initial_results as (
  select * from first_events where event_name = 'initial_result_viewed'
), saved_emails as (
  select * from first_events where event_name = 'result_email_saved'
), report_ctas as (
  select * from first_events where event_name = 'full_report_cta_clicked'
), invoices as (
  select * from first_events where event_name = 'invoice_created'
), confirmed_payments as (
  select * from first_events where event_name = 'payment_confirmed'
), full_reports as (
  select * from first_events where event_name = 'full_report_opened'
), eligible_landings as (
  select distinct on (e.visitor_id_hash) e.visitor_id_hash, e.occurred_at
  from public_events e cross join config c
  where e.event_name = 'landing_viewed' and e.visitor_id_hash is not null
    and e.occurred_at >= c.free_flow_cutover_at
  order by e.visitor_id_hash, e.occurred_at
), range_free_starts as (
  select s.* from free_starts s cross join bounds b
  where s.occurred_at >= b.range_start and s.occurred_at < b.range_end
), range_free_completes as (
  select s.* from free_completes s cross join bounds b
  where s.occurred_at >= b.range_start and s.occurred_at < b.range_end
), range_initial_results as (
  select s.* from initial_results s cross join bounds b
  where s.occurred_at >= b.range_start and s.occurred_at < b.range_end
), range_saved_emails as (
  select s.* from saved_emails s cross join bounds b
  where s.occurred_at >= b.range_start and s.occurred_at < b.range_end
), range_report_ctas as (
  select s.* from report_ctas s cross join bounds b
  where s.occurred_at >= b.range_start and s.occurred_at < b.range_end
), range_invoices as (
  select s.* from invoices s cross join bounds b
  where s.occurred_at >= b.range_start and s.occurred_at < b.range_end
), range_confirmed_payments as (
  select s.* from confirmed_payments s cross join bounds b
  where s.occurred_at >= b.range_start and s.occurred_at < b.range_end
), range_full_reports as (
  select s.* from full_reports s cross join bounds b
  where s.occurred_at >= b.range_start and s.occurred_at < b.range_end
), range_landings as (
  select l.* from eligible_landings l cross join bounds b
  where l.occurred_at >= b.range_start and l.occurred_at < b.range_end
), free_totals as (
  select
    (select count(*) from range_landings) as eligible_visitors,
    (select count(*) from range_free_starts) as assessments_started,
    (select count(*) from range_free_completes) as assessments_completed,
    (select count(*) from range_initial_results) as initial_results_viewed,
    (select count(*) from range_saved_emails) as emails_saved,
    (select count(*) from range_report_ctas) as full_report_cta_clicks,
    (select count(*) from range_invoices) as invoices_created,
    (select count(*) from range_confirmed_payments) as payments_confirmed,
    (select count(*) from range_full_reports) as reports_opened,
    (select coalesce(sum(amount_mnt), 0) from range_confirmed_payments) as revenue_mnt
), conversion_counts as (
  select
    (select count(*) from range_landings) as visitor_entry,
    (select count(*) from range_landings l where exists (
      select 1 from free_starts s cross join bounds b
      where s.visitor_id_hash = l.visitor_id_hash and s.occurred_at >= l.occurred_at and s.occurred_at < b.range_end
    )) as visitor_converted,
    (select count(*) from range_free_starts) as start_entry,
    (select count(*) from range_free_starts s where exists (
      select 1 from free_completes c cross join bounds b
      where c.funnel_key_hash = s.funnel_key_hash and c.occurred_at >= s.occurred_at and c.occurred_at < b.range_end
    )) as start_converted,
    (select count(*) from range_free_completes) as complete_entry,
    (select count(*) from range_free_completes c where exists (
      select 1 from initial_results r cross join bounds b
      where r.funnel_key_hash = c.funnel_key_hash and r.occurred_at >= c.occurred_at and r.occurred_at < b.range_end
    )) as complete_converted,
    (select count(*) from range_initial_results) as initial_entry,
    (select count(*) from range_initial_results r where exists (
      select 1 from saved_emails e cross join bounds b
      where e.funnel_key_hash = r.funnel_key_hash and e.occurred_at >= r.occurred_at and e.occurred_at < b.range_end
    )) as initial_email_converted,
    (select count(*) from range_initial_results r where exists (
      select 1 from report_ctas c cross join bounds b
      where c.funnel_key_hash = r.funnel_key_hash and c.occurred_at >= r.occurred_at and c.occurred_at < b.range_end
    )) as initial_cta_converted,
    (select count(*) from range_report_ctas) as cta_entry,
    (select count(*) from range_report_ctas c where exists (
      select 1 from invoices i cross join bounds b
      where i.funnel_key_hash = c.funnel_key_hash and i.occurred_at >= c.occurred_at and i.occurred_at < b.range_end
    )) as cta_converted,
    (select count(*) from range_invoices) as invoice_entry,
    (select count(*) from range_invoices i where exists (
      select 1 from confirmed_payments p cross join bounds b
      where p.funnel_key_hash = i.funnel_key_hash and p.occurred_at >= i.occurred_at and p.occurred_at < b.range_end
    )) as invoice_converted,
    (select count(*) from range_confirmed_payments) as payment_entry,
    (select count(*) from range_confirmed_payments p where exists (
      select 1 from full_reports r cross join bounds b
      where r.funnel_key_hash = p.funnel_key_hash and r.occurred_at >= p.occurred_at and r.occurred_at < b.range_end
    )) as payment_converted
), excluded_assessments as (
  select distinct assessment_id from jingeehas.analytics_events
  where assessment_id is not null and (is_admin or is_owner_preview or is_test)
  union
  select distinct assessment_id from jingeehas.assessment_sessions where source = 'owner'
), historical_assessments as (
  select a.* from jingeehas.assessments a
  where a.id not in (select assessment_id from excluded_assessments)
    and a.commercial_flow_version in ('prepaid_v2', 'legacy_postpaid_v1')
), historical_payments as (
  select p.* from jingeehas.payments p
  join historical_assessments a on a.id = p.assessment_id
), historical_paid as (
  select e.*, p.amount, a.commercial_flow_version
  from jingeehas.entitlements e
  join historical_payments p on p.id = e.payment_id and p.status = 'paid'
  join historical_assessments a on a.id = e.assessment_id
  where e.status = 'active'
), historical_totals as (
  select f.flow_version,
    (select count(*) from historical_assessments a cross join bounds b
      where a.commercial_flow_version = f.flow_version
        and coalesce(a.started_at, a.created_at) >= b.range_start and coalesce(a.started_at, a.created_at) < b.range_end) as assessments_started,
    (select count(*) from historical_assessments a cross join bounds b
      where a.commercial_flow_version = f.flow_version and a.status = 'complete'
        and a.completed_at >= b.range_start and a.completed_at < b.range_end) as assessments_completed,
    (select count(distinct p.invoice_id) from historical_payments p join historical_assessments a on a.id = p.assessment_id cross join bounds b
      where a.commercial_flow_version = f.flow_version and p.invoice_id is not null
        and p.created_at >= b.range_start and p.created_at < b.range_end) as invoices_created,
    (select count(distinct e.payment_id) from historical_paid e cross join bounds b
      where e.commercial_flow_version = f.flow_version and e.granted_at >= b.range_start and e.granted_at < b.range_end) as payments_confirmed,
    (select coalesce(sum(e.amount), 0) from historical_paid e cross join bounds b
      where e.commercial_flow_version = f.flow_version and e.granted_at >= b.range_start and e.granted_at < b.range_end) as revenue_mnt
  from (values ('prepaid_v2'::text), ('legacy_postpaid_v1'::text)) f(flow_version)
), days as (
  select generate_series(p_start_date, p_end_date, interval '1 day')::date as day
), daily as (
  select d.day,
    (select count(*) from range_landings e where (e.occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as unique_visitors,
    (select count(*) from range_free_starts e where (e.occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as assessments_started,
    (select count(*) from range_free_completes e where (e.occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as assessments_completed,
    (select count(*) from range_initial_results e where (e.occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as initial_results_viewed,
    (select count(*) from range_saved_emails e where (e.occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as emails_saved,
    (select count(*) from range_report_ctas e where (e.occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as full_report_cta_clicks,
    (select count(*) from range_invoices e where (e.occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as invoices_created,
    (select count(*) from range_confirmed_payments e where (e.occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as payments_confirmed,
    (select count(*) from range_full_reports e where (e.occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as reports_opened,
    (select coalesce(sum(e.amount_mnt), 0) from range_confirmed_payments e where (e.occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as revenue_mnt
  from days d
), all_totals as (
  select
    (select count(distinct visitor_id_hash) from public_events e cross join bounds b
      where e.event_name = 'landing_viewed' and e.occurred_at >= b.range_start and e.occurred_at < b.range_end) as unique_visitors,
    (select assessments_started + assessments_completed from free_totals) as free_activity,
    (select coalesce(sum(assessments_started + assessments_completed), 0) from historical_totals) as historical_activity,
    (select invoices_created from free_totals) + (select coalesce(sum(invoices_created), 0) from historical_totals) as invoices_created,
    (select payments_confirmed from free_totals) + (select coalesce(sum(payments_confirmed), 0) from historical_totals) as payments_confirmed,
    (select revenue_mnt from free_totals) + (select coalesce(sum(revenue_mnt), 0) from historical_totals) as revenue_mnt
)
select jsonb_build_object(
  'days', coalesce((select jsonb_agg(jsonb_build_object(
    'date', day,
    'unique_visitors', unique_visitors,
    'assessments_started', assessments_started,
    'assessments_completed', assessments_completed,
    'initial_results_viewed', initial_results_viewed,
    'emails_saved', emails_saved,
    'full_report_cta_clicks', full_report_cta_clicks,
    'invoices_created', invoices_created,
    'payments_confirmed', payments_confirmed,
    'reports_opened', reports_opened,
    'revenue_mnt', revenue_mnt
  ) order by day) from daily), '[]'::jsonb),
  'summary', to_jsonb(a.*),
  'all_flows', to_jsonb(a.*),
  'current_flow', to_jsonb(f.*),
  'prepaid_flow', coalesce((select to_jsonb(h.*) from historical_totals h where h.flow_version = 'prepaid_v2'), '{}'::jsonb),
  'legacy_flow', coalesce((select to_jsonb(h.*) from historical_totals h where h.flow_version = 'legacy_postpaid_v1'), '{}'::jsonb),
  'conversions', jsonb_build_object(
    'visitor_to_assessment_start', jsonb_build_object('entry_count', c.visitor_entry, 'converted_count', c.visitor_converted,
      'rate', case when c.visitor_entry = 0 then null else c.visitor_converted::numeric / c.visitor_entry end,
      'status', case when c.visitor_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when c.visitor_entry = 0 then 'no_denominator' else null end),
    'assessment_start_to_complete', jsonb_build_object('entry_count', c.start_entry, 'converted_count', c.start_converted,
      'rate', case when c.start_entry = 0 then null else c.start_converted::numeric / c.start_entry end,
      'status', case when c.start_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when c.start_entry = 0 then 'no_denominator' else null end),
    'complete_to_initial_result', jsonb_build_object('entry_count', c.complete_entry, 'converted_count', c.complete_converted,
      'rate', case when c.complete_entry = 0 then null else c.complete_converted::numeric / c.complete_entry end,
      'status', case when c.complete_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when c.complete_entry = 0 then 'no_denominator' else null end),
    'initial_result_to_email', jsonb_build_object('entry_count', c.initial_entry, 'converted_count', c.initial_email_converted,
      'rate', case when c.initial_entry = 0 then null else c.initial_email_converted::numeric / c.initial_entry end,
      'status', case when c.initial_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when c.initial_entry = 0 then 'no_denominator' else null end),
    'initial_result_to_full_report_cta', jsonb_build_object('entry_count', c.initial_entry, 'converted_count', c.initial_cta_converted,
      'rate', case when c.initial_entry = 0 then null else c.initial_cta_converted::numeric / c.initial_entry end,
      'status', case when c.initial_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when c.initial_entry = 0 then 'no_denominator' else null end),
    'full_report_cta_to_invoice', jsonb_build_object('entry_count', c.cta_entry, 'converted_count', c.cta_converted,
      'rate', case when c.cta_entry = 0 then null else c.cta_converted::numeric / c.cta_entry end,
      'status', case when c.cta_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when c.cta_entry = 0 then 'no_denominator' else null end),
    'invoice_to_payment', jsonb_build_object('entry_count', c.invoice_entry, 'converted_count', c.invoice_converted,
      'rate', case when c.invoice_entry = 0 then null else c.invoice_converted::numeric / c.invoice_entry end,
      'status', case when c.invoice_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when c.invoice_entry = 0 then 'no_denominator' else null end),
    'payment_to_full_report_open', jsonb_build_object('entry_count', c.payment_entry, 'converted_count', c.payment_converted,
      'rate', case when c.payment_entry = 0 then null else c.payment_converted::numeric / c.payment_entry end,
      'status', case when c.payment_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when c.payment_entry = 0 then 'no_denominator' else null end)
  ),
  'coverage', jsonb_build_object(
    'free_flow_cutover_at', config.free_flow_cutover_at,
    'all_measured_visitors', a.unique_visitors,
    'legacy_activity_present', coalesce((select assessments_started + assessments_completed + invoices_created + payments_confirmed > 0 from historical_totals where flow_version = 'legacy_postpaid_v1'), false),
    'prepaid_activity_present', coalesce((select assessments_started + assessments_completed + invoices_created + payments_confirmed > 0 from historical_totals where flow_version = 'prepaid_v2'), false),
    'free_activity_present', f.assessments_started + f.assessments_completed + f.initial_results_viewed + f.invoices_created > 0,
    'flow_state', case
      when f.assessments_started + f.assessments_completed + f.initial_results_viewed + f.invoices_created > 0
        and a.historical_activity > 0 then 'mixed'
      when f.assessments_started + f.assessments_completed + f.initial_results_viewed + f.invoices_created > 0 then 'free_only'
      when a.historical_activity > 0 then 'historical_only'
      else 'empty'
    end
  )
)
from free_totals f cross join conversion_counts c cross join all_totals a cross join config
$$;

revoke all on function jingeehas.get_daily_funnel_analytics(date, date) from public, anon, authenticated;
grant execute on function jingeehas.get_daily_funnel_analytics(date, date) to service_role;

insert into jingeehas.schema_migrations(version)
values ('20260731024831_free_assessment_initial_result_funnel')
on conflict (version) do nothing;

commit;
