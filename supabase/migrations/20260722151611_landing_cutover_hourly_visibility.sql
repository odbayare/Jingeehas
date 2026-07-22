begin;

-- Read-only, aggregate-only visibility for the paid-first landing cutover.
-- This deliberately measures the browser events emitted by the public landing
-- and preparation screens without exposing event rows or changing funnel math.
create or replace function jingeehas.get_landing_cutover_hourly_analytics(p_start_date date, p_end_date date)
returns jsonb language sql stable security definer set search_path = '' as $$
with config as (
  select timestamptz '2026-07-21T16:17:45.493Z' as cutover_at
), bounds as (
  select p_start_date::timestamp at time zone 'Asia/Ulaanbaatar' as range_start,
    (p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar' as range_end
), public_events as (
  select * from jingeehas.analytics_events
  where not is_admin and not is_owner_preview and not is_test
), first_landing as (
  select visitor_id_hash, min(occurred_at) as first_landing_at
  from public_events
  where event_name = 'landing_viewed' and visitor_id_hash is not null
  group by visitor_id_hash
), hours as (
  select generate_series(
    p_start_date::timestamp,
    p_end_date::timestamp + interval '23 hours',
    interval '1 hour'
  ) as local_hour
), hourly as (
  select h.local_hour,
    (select count(*) from first_landing l cross join bounds b cross join config c
      where l.first_landing_at >= greatest(b.range_start, c.cutover_at)
        and l.first_landing_at < b.range_end
        and date_trunc('hour', l.first_landing_at at time zone 'Asia/Ulaanbaatar') = h.local_hour) as new_visitors,
    (select count(distinct e.session_id_hash) from public_events e cross join bounds b cross join config c
      where e.event_name = 'landing_cta_clicked' and e.session_id_hash is not null
        and e.occurred_at >= greatest(b.range_start, c.cutover_at) and e.occurred_at < b.range_end
        and date_trunc('hour', e.occurred_at at time zone 'Asia/Ulaanbaatar') = h.local_hour) as cta_clicks,
    (select count(distinct e.session_id_hash) from public_events e cross join bounds b cross join config c
      where e.event_name = 'payment_preparation_viewed' and e.session_id_hash is not null
        and e.occurred_at >= greatest(b.range_start, c.cutover_at) and e.occurred_at < b.range_end
        and date_trunc('hour', e.occurred_at at time zone 'Asia/Ulaanbaatar') = h.local_hour) as payment_preparation_views
  from hours h
)
select jsonb_build_object(
  'hours', coalesce((select jsonb_agg(jsonb_build_object(
    'hour', to_char(local_hour, 'YYYY-MM-DD HH24:00'),
    'new_visitors', new_visitors,
    'cta_clicks', cta_clicks,
    'payment_preparation_views', payment_preparation_views
  ) order by local_hour) from hourly), '[]'::jsonb),
  'totals', jsonb_build_object(
    'new_visitors', coalesce((select sum(new_visitors) from hourly), 0),
    'cta_clicks', coalesce((select sum(cta_clicks) from hourly), 0),
    'payment_preparation_views', coalesce((select sum(payment_preparation_views) from hourly), 0)
  ),
  'cutover_at', (select cutover_at from config)
)
$$;

revoke all on function jingeehas.get_landing_cutover_hourly_analytics(date, date) from public, anon, authenticated;
grant execute on function jingeehas.get_landing_cutover_hourly_analytics(date, date) to service_role;

-- Add the aggregate to the existing admin-only daily response. Existing daily
-- totals and conversion formulas remain untouched.
create or replace function jingeehas.get_daily_funnel_analytics(p_start_date date, p_end_date date)
returns jsonb language sql stable security definer set search_path = '' as $$
with source as (
  select jingeehas.get_daily_funnel_analytics_v1(p_start_date, p_end_date) as payload
), facts as (
  select payload,
    coalesce((payload #>> '{all_flows,unique_visitors}')::bigint, 0) as all_measured_visitors,
    coalesce((payload #>> '{current_flow,eligible_visitors}')::bigint, 0) as paid_first_eligible_visitors,
    coalesce((payload #>> '{coverage,legacy_activity_present}')::boolean, false) as legacy_activity_present,
    coalesce((payload #>> '{coverage,prepaid_activity_present}')::boolean, false) as prepaid_assessment_activity_present
  from source
), covered as (
  select payload,
    all_measured_visitors, paid_first_eligible_visitors,
    legacy_activity_present, prepaid_assessment_activity_present,
    jingeehas.get_landing_cutover_hourly_analytics(p_start_date, p_end_date) as hourly
  from facts
)
select jsonb_set(
  jsonb_set(payload, '{coverage}', coalesce(payload -> 'coverage', '{}'::jsonb) || jsonb_build_object(
    'all_measured_visitors', all_measured_visitors,
    'paid_first_eligible_visitors', paid_first_eligible_visitors,
    'legacy_activity_present', legacy_activity_present,
    'prepaid_assessment_activity_present', prepaid_assessment_activity_present,
    'prepaid_visitor_activity_present', paid_first_eligible_visitors > 0,
    'flow_state', case
      when legacy_activity_present and prepaid_assessment_activity_present then 'mixed'
      when legacy_activity_present and paid_first_eligible_visitors > 0 then 'legacy_with_prepaid_visitors'
      when legacy_activity_present then 'legacy_only'
      when prepaid_assessment_activity_present then 'prepaid_only'
      when paid_first_eligible_visitors > 0 then 'prepaid_visitors_only'
      else 'empty'
    end
  )), '{landing_cutover_hourly}', hourly)
from covered
$$;

revoke all on function jingeehas.get_daily_funnel_analytics(date, date) from public, anon, authenticated;
grant execute on function jingeehas.get_daily_funnel_analytics(date, date) to service_role;

insert into jingeehas.schema_migrations(version)
values ('20260722151611_landing_cutover_hourly_visibility')
on conflict (version) do nothing;

commit;
