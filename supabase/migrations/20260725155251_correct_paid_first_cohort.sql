begin;

create or replace function jingeehas.get_admin_paid_first_funnel_analytics(p_start_date date, p_end_date date)
returns jsonb language sql stable security definer set search_path = '' as $$
with config as (
  select timestamptz '2026-07-21T16:17:45.493Z' as cutover_at
), bounds as (
  select p_start_date::timestamp at time zone 'Asia/Ulaanbaatar' as range_start,
    (p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar' as range_end,
    greatest(p_start_date::timestamp at time zone 'Asia/Ulaanbaatar', (select cutover_at from config)) as effective_start
), excluded_assessments as (
  select distinct assessment_id from jingeehas.analytics_events where assessment_id is not null and (is_admin or is_owner_preview or is_test)
  union
  select distinct assessment_id from jingeehas.assessment_sessions where source = 'owner'
), public_events as (
  select e.* from jingeehas.analytics_events e cross join bounds b
  where not e.is_admin and not e.is_owner_preview and not e.is_test
    and e.occurred_at >= b.effective_start and e.occurred_at < b.range_end
), first_landing as (
  select e.visitor_id_hash, min(e.occurred_at) as first_landing_at
  from jingeehas.analytics_events e
  where e.event_name = 'landing_viewed' and e.visitor_id_hash is not null
    and not e.is_admin and not e.is_owner_preview and not e.is_test
  group by e.visitor_id_hash
), eligible_visitors as (
  select f.visitor_id_hash from first_landing f cross join bounds b
  where f.first_landing_at >= b.effective_start and f.first_landing_at < b.range_end
), cta_sessions as (
  select distinct session_id_hash from public_events where event_name = 'landing_cta_clicked' and session_id_hash is not null
), preparation_sessions as (
  select distinct session_id_hash from public_events where event_name = 'payment_preparation_viewed' and session_id_hash is not null
), prepaid_assessments as (
  select a.* from jingeehas.assessments a
  where a.commercial_flow_version = 'prepaid_v2'
    and not exists (select 1 from excluded_assessments x where x.assessment_id = a.id)
), prepaid_payments as (
  select p.* from jingeehas.payments p join prepaid_assessments a on a.id = p.assessment_id
), prepaid_entitlements as (
  select e.* from jingeehas.entitlements e join prepaid_payments p on p.id = e.payment_id
), operational as (
  select
    count(distinct a.id) filter (where a.status = 'payment_pending') as payment_pending_assessments,
    count(distinct p.id) filter (where p.status = 'pending' and p.expires_at > now()) as active_pending_invoices,
    count(distinct p.id) filter (where p.paid_at is null and (p.status in ('expired','cancelled') or (p.status = 'pending' and p.expires_at <= now()))) as expired_unpaid_invoices,
    count(distinct p.id) filter (where p.status = 'paid' and e.status = 'active') as confirmed_payments,
    count(distinct e.id) filter (where e.status = 'active') as active_entitlements,
    coalesce((select sum(pp.amount) from (select distinct p2.id, p2.amount from prepaid_payments p2 join prepaid_entitlements e2 on e2.payment_id = p2.id where p2.status = 'paid' and e2.status = 'active') pp), 0) as revenue_mnt
  from prepaid_assessments a
  left join prepaid_payments p on p.assessment_id = a.id
  left join prepaid_entitlements e on e.payment_id = p.id
), daily as (
  select jsonb_agg(jsonb_build_object(
    'date', d.day,
    'new_visitors', (select count(*) from first_landing f cross join bounds b where f.first_landing_at >= b.effective_start and f.first_landing_at < b.range_end and (f.first_landing_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'cta_sessions', (select count(distinct session_id_hash) from public_events where event_name = 'landing_cta_clicked' and session_id_hash is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'preparation_sessions', (select count(distinct session_id_hash) from public_events where event_name = 'payment_preparation_viewed' and session_id_hash is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'invoices_created', (select count(distinct p.invoice_id) from prepaid_payments p cross join bounds b where p.invoice_id is not null and p.created_at >= b.effective_start and p.created_at < b.range_end and (p.created_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'payments_confirmed', (select count(distinct p.id) from prepaid_payments p join prepaid_entitlements e on e.payment_id = p.id cross join bounds b where p.status = 'paid' and e.status = 'active' and e.granted_at >= b.effective_start and e.granted_at < b.range_end and (e.granted_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'assessments_started', (select count(distinct a.id) from prepaid_assessments a cross join bounds b where a.started_at >= b.effective_start and a.started_at < b.range_end and (a.started_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'assessments_completed', (select count(distinct a.id) from prepaid_assessments a cross join bounds b where a.status = 'complete' and a.completed_at >= b.effective_start and a.completed_at < b.range_end and (a.completed_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'reports_opened', (select count(distinct e.assessment_id) from public_events e join prepaid_assessments a on a.id = e.assessment_id where e.event_name = 'report_opened' and e.assessment_id is not null and (e.occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'revenue_mnt', (select coalesce(sum(pp.amount), 0) from (select distinct p.id, p.amount, e.granted_at from prepaid_payments p join prepaid_entitlements e on e.payment_id = p.id cross join bounds b where p.status = 'paid' and e.status = 'active' and e.granted_at >= b.effective_start and e.granted_at < b.range_end and (e.granted_at at time zone 'Asia/Ulaanbaatar')::date = d.day) pp)
  ) order by d.day) as rows
  from generate_series(p_start_date, p_end_date, interval '1 day') d(day)
), cohort as (
  select
    (select count(*) from eligible_visitors) as eligible_visitors,
    (select count(*) from cta_sessions) as cta_sessions,
    (select count(*) from preparation_sessions) as preparation_sessions,
    (select count(*) from cta_sessions c where exists (select 1 from preparation_sessions p where p.session_id_hash = c.session_id_hash)) as cta_to_preparation_sessions,
    (select count(*) from preparation_sessions p where not exists (select 1 from cta_sessions c where c.session_id_hash = p.session_id_hash)) as direct_preparation_sessions
)
select jsonb_build_object(
  'landing', jsonb_build_object('eligible_visitors', cohort.eligible_visitors, 'cta_sessions', cohort.cta_sessions, 'preparation_sessions', cohort.preparation_sessions, 'cta_to_preparation_sessions', cohort.cta_to_preparation_sessions, 'direct_preparation_sessions', cohort.direct_preparation_sessions),
  'operational', to_jsonb(operational),
  'daily', coalesce(daily.rows, '[]'::jsonb),
  'cutover_at', (select cutover_at from config)
)
from cohort cross join operational cross join daily
$$;

revoke all on function jingeehas.get_admin_paid_first_funnel_analytics(date, date) from public, anon, authenticated;
grant execute on function jingeehas.get_admin_paid_first_funnel_analytics(date, date) to service_role;

insert into jingeehas.schema_migrations(version) values ('20260725155251_correct_paid_first_cohort') on conflict (version) do nothing;

commit;
