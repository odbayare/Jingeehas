begin;

create or replace function jingeehas.get_admin_paid_first_funnel_analytics(p_start_date date, p_end_date date)
returns jsonb language sql stable security definer set search_path = '' as $$
with config as (
  select timestamptz '2026-07-21T16:17:45.493Z' as cutover_at
), bounds as (
  select greatest(p_start_date::timestamp at time zone 'Asia/Ulaanbaatar', (select cutover_at from config)) as range_start,
    (p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar' as range_end
), excluded_assessments as (
  select distinct assessment_id from jingeehas.analytics_events
  where assessment_id is not null and (is_admin or is_owner_preview or is_test)
  union
  select distinct assessment_id from jingeehas.assessment_sessions where source = 'owner'
), public_events as (
  select e.* from jingeehas.analytics_events e cross join bounds b
  where not e.is_admin and not e.is_owner_preview and not e.is_test
    and e.occurred_at >= b.range_start and e.occurred_at < b.range_end
    and (e.assessment_id is null or not exists (
      select 1 from excluded_assessments x where x.assessment_id = e.assessment_id
    ))
), first_landing as (
  select visitor_id_hash, min(occurred_at) as first_landing_at
  from jingeehas.analytics_events
  where event_name = 'landing_viewed' and visitor_id_hash is not null
    and not is_admin and not is_owner_preview and not is_test
  group by visitor_id_hash
), eligible_visitors as (
  select visitor_id_hash from first_landing cross join bounds
  where first_landing_at >= range_start and first_landing_at < range_end
), cta_sessions as (
  select distinct session_id_hash from public_events
  where (jingeehas.cta_event_allowed(event_name, occurred_at) and session_id_hash is not null) and session_id_hash is not null
), preparation_sessions as (
  select distinct session_id_hash from public_events
  where event_name = 'payment_preparation_viewed' and session_id_hash is not null
), browser_payment_cta_sessions as (
  select distinct session_id_hash from public_events
  where event_name = 'payment_cta_clicked' and session_id_hash is not null
), checkout_submission_sessions as (
  select distinct session_id_hash from public_events
  where event_name = 'checkout_submitted' and session_id_hash is not null
), prepaid_assessments as (
  select a.* from jingeehas.assessments a
  where a.commercial_flow_version = 'prepaid_v2'
    and not exists (select 1 from excluded_assessments x where x.assessment_id = a.id)
), prepaid_payments as (
  select p.* from jingeehas.payments p join prepaid_assessments a on a.id = p.assessment_id
), prepaid_entitlements as (
  select e.* from jingeehas.entitlements e join prepaid_payments p on p.id = e.payment_id
), daily_days as (
  select generate_series(p_start_date, p_end_date, interval '1 day')::date as day
), daily as (
  select jsonb_agg(jsonb_build_object(
    'date', d.day,
    'new_visitors', (select count(*) from first_landing f cross join bounds b where f.first_landing_at >= b.range_start and f.first_landing_at < b.range_end and (f.first_landing_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'cta_sessions', (select count(distinct session_id_hash) from public_events where (jingeehas.cta_event_allowed(event_name, occurred_at) and session_id_hash is not null) and session_id_hash is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'preparation_sessions', (select count(distinct session_id_hash) from public_events where event_name = 'payment_preparation_viewed' and session_id_hash is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'server_checkout_submissions', (select count(distinct session_id_hash) from public_events where event_name = 'checkout_submitted' and session_id_hash is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'payment_page_renders', (select count(distinct assessment_id) from public_events where event_name = 'payment_page_rendered' and assessment_id is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'invoices_created', (select count(distinct invoice_id) from public_events where event_name = 'invoice_created' and invoice_id is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'payments_confirmed', (select count(distinct payment_id) from public_events where event_name = 'payment_confirmed' and payment_id is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'assessments_started', (select count(distinct assessment_id) from public_events where event_name = 'assessment_started' and assessment_id is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'assessments_completed', (select count(distinct assessment_id) from public_events where event_name = 'assessment_completed' and assessment_id is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'reports_opened', (select count(distinct assessment_id) from public_events where event_name = 'report_opened' and assessment_id is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'revenue_mnt', (select coalesce(sum(x.amount), 0) from (
      select distinct p.id, p.amount from prepaid_payments p join prepaid_entitlements e on e.payment_id = p.id
      where p.status = 'paid' and p.amount = 9900 and btrim(coalesce(p.provider_payment_id, '')) <> ''
        and e.status = 'active' and (e.granted_at at time zone 'Asia/Ulaanbaatar')::date = d.day
    ) x)
  ) order by d.day) as rows from daily_days d
), operational as (
  select
    count(distinct a.id) filter (where a.status = 'payment_pending') as payment_pending_assessments,
    count(distinct p.id) filter (where p.status = 'pending' and p.expires_at > now()) as active_pending_invoices,
    count(distinct p.id) filter (where p.paid_at is null and (p.status in ('expired','cancelled') or (p.status = 'pending' and p.expires_at <= now()))) as expired_unpaid_invoices,
    count(distinct p.id) filter (where p.status = 'paid' and p.amount = 9900 and btrim(coalesce(p.provider_payment_id, '')) <> '' and e.status = 'active') as confirmed_payments,
    count(distinct e.id) filter (where e.status = 'active' and p.amount = 9900 and btrim(coalesce(p.provider_payment_id, '')) <> '') as active_entitlements,
    coalesce((select sum(x.amount) from (
      select distinct p2.id, p2.amount from prepaid_payments p2
      join prepaid_entitlements e2 on e2.payment_id = p2.id
      where p2.status = 'paid' and p2.amount = 9900
        and btrim(coalesce(p2.provider_payment_id, '')) <> '' and e2.status = 'active'
    ) x), 0) as revenue_mnt
  from prepaid_assessments a
  left join prepaid_payments p on p.assessment_id = a.id
  left join prepaid_entitlements e on e.payment_id = p.id
)
select jsonb_build_object(
  'landing', jsonb_build_object(
    'eligible_visitors', (select count(*) from eligible_visitors),
    'cta_sessions', (select count(*) from cta_sessions),
    'preparation_sessions', (select count(*) from preparation_sessions),
    'cta_to_preparation_sessions', (select count(*) from cta_sessions c where exists (select 1 from preparation_sessions p where p.session_id_hash = c.session_id_hash)),
    'direct_preparation_sessions', (select count(*) from preparation_sessions p where not exists (select 1 from cta_sessions c where c.session_id_hash = p.session_id_hash))
  ),
  'checkout', jsonb_build_object(
    'preparation_sessions', (select count(*) from preparation_sessions),
    'payment_cta_sessions', (select count(*) from browser_payment_cta_sessions),
    'server_checkout_submissions', (select count(*) from checkout_submission_sessions),
    'assessment_shells_created', (select count(distinct assessment_id) from public_events where event_name = 'assessment_shell_created'),
    'assessment_shell_create_failures', (select count(*) from public_events where event_name = 'assessment_shell_create_failed'),
    'invoice_create_attempts', (select count(distinct assessment_id) from public_events where event_name = 'invoice_create_started'),
    'invoices_created', (select count(distinct invoice_id) from public_events where event_name = 'invoice_created'),
    'invoice_create_failures', (select count(distinct assessment_id) from public_events where event_name = 'invoice_create_failed'),
    'payment_page_renders', (select count(distinct assessment_id) from public_events where event_name = 'payment_page_rendered'),
    'browser_event_delivery_gaps', greatest(0, (select count(*) from checkout_submission_sessions) - (select count(*) from browser_payment_cta_sessions)),
    'preparation_to_payment_cta_sessions', (select count(*) from browser_payment_cta_sessions c where exists (select 1 from preparation_sessions p where p.session_id_hash = c.session_id_hash))
  ),
  'operational', to_jsonb(operational),
  'daily', coalesce(daily.rows, '[]'::jsonb),
  'cutover_at', (select cutover_at from config)
) from operational cross join daily
$$;

create or replace function jingeehas.get_landing_cutover_hourly_analytics(p_start_date date, p_end_date date)
returns jsonb language sql stable security definer set search_path = '' as $$
with config as (
  select timestamptz '2026-07-21T16:17:45.493Z' as cutover_at
), bounds as (
  select greatest(p_start_date::timestamp at time zone 'Asia/Ulaanbaatar', (select cutover_at from config)) as range_start,
    (p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar' as range_end
), public_events as (
  select * from jingeehas.analytics_events cross join bounds
  where not is_admin and not is_owner_preview and not is_test
    and occurred_at >= range_start and occurred_at < range_end
), first_landing as (
  select visitor_id_hash, min(occurred_at) as first_landing_at from jingeehas.analytics_events
  where event_name = 'landing_viewed' and visitor_id_hash is not null
    and not is_admin and not is_owner_preview and not is_test group by visitor_id_hash
), hours as (
  select generate_series(p_start_date::timestamp, p_end_date::timestamp + interval '23 hours', interval '1 hour') as local_hour
), hourly as (
  select h.local_hour,
    (select count(*) from first_landing f cross join bounds b where f.first_landing_at >= b.range_start and f.first_landing_at < b.range_end and date_trunc('hour', f.first_landing_at at time zone 'Asia/Ulaanbaatar') = h.local_hour) as new_visitors,
    (select count(distinct session_id_hash) from public_events where (jingeehas.cta_event_allowed(event_name, occurred_at) and session_id_hash is not null) and session_id_hash is not null and date_trunc('hour', occurred_at at time zone 'Asia/Ulaanbaatar') = h.local_hour) as cta_clicks,
    (select count(distinct session_id_hash) from public_events where event_name = 'payment_preparation_viewed' and session_id_hash is not null and date_trunc('hour', occurred_at at time zone 'Asia/Ulaanbaatar') = h.local_hour) as payment_preparation_views
  from hours h
)
select jsonb_build_object(
  'hours', coalesce((select jsonb_agg(jsonb_build_object('hour', to_char(local_hour, 'YYYY-MM-DD HH24:00'), 'new_visitors', new_visitors, 'cta_clicks', cta_clicks, 'payment_preparation_views', payment_preparation_views) order by local_hour) from hourly), '[]'::jsonb),
  'totals', jsonb_build_object('new_visitors', coalesce((select sum(new_visitors) from hourly), 0), 'cta_clicks', coalesce((select sum(cta_clicks) from hourly), 0), 'payment_preparation_views', coalesce((select sum(payment_preparation_views) from hourly), 0)),
  'cutover_at', (select cutover_at from config)
)
$$;

revoke all on function jingeehas.get_admin_paid_first_funnel_analytics(date, date) from public, anon, authenticated;
grant execute on function jingeehas.get_admin_paid_first_funnel_analytics(date, date) to service_role;

revoke all on function jingeehas.get_admin_paid_first_funnel_analytics(date,date) from public, anon, authenticated;
grant execute on function jingeehas.get_admin_paid_first_funnel_analytics(date,date) to service_role;
revoke all on function jingeehas.get_landing_cutover_hourly_analytics(date,date) from public, anon, authenticated;
grant execute on function jingeehas.get_landing_cutover_hourly_analytics(date,date) to service_role;

do $$
declare def text;
begin
  select pg_get_functiondef(p.oid) into def from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='jingeehas' and p.proname='get_admin_paid_first_funnel_analytics' and pg_get_function_identity_arguments(p.oid)='p_start_date date, p_end_date date';
  if def is null or position('cta_event_allowed' in def)=0 then raise exception 'CTA boundary missing from admin aggregate'; end if;
  select pg_get_functiondef(p.oid) into def from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='jingeehas' and p.proname='get_landing_cutover_hourly_analytics' and pg_get_function_identity_arguments(p.oid)='p_start_date date, p_end_date date';
  if def is null or position('cta_event_allowed' in def)=0 then raise exception 'CTA boundary missing from hourly aggregate'; end if;
end;
$$;

insert into jingeehas.schema_migrations(version) values ('20260727073400_repair_cta_boundary_aggregate_definitions') on conflict (version) do nothing;
commit;

