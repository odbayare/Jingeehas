begin;

-- Paid-first became the production flow when Netlify deploy
-- 6a5f9ba42d011fe7c622cbfe reached READY. Its authoritative published_at
-- timestamp is the canonical cutover used below.
create or replace function jingeehas.get_daily_funnel_analytics(p_start_date date, p_end_date date)
returns jsonb language sql stable security definer set search_path = '' as $$
with config as (
  select timestamptz '2026-07-21T16:17:45.493Z' as paid_first_cutover_at
), bounds as (
  select p_start_date::timestamp at time zone 'Asia/Ulaanbaatar' as range_start,
    (p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar' as range_end
), excluded_assessments as (
  select distinct assessment_id from jingeehas.analytics_events
  where assessment_id is not null and (is_admin or is_owner_preview or is_test)
  union
  select distinct assessment_id from jingeehas.assessment_sessions where source = 'owner'
), public_events as (
  select * from jingeehas.analytics_events
  where not is_admin and not is_owner_preview and not is_test
), assessments as (
  select * from jingeehas.assessments
  where id not in (select assessment_id from excluded_assessments)
), payments as (
  select p.* from jingeehas.payments p
  join assessments a on a.id = p.assessment_id
), paid_entitlements as (
  select e.*, p.amount, p.invoice_id, p.created_at as invoice_created_at,
    a.commercial_flow_version
  from jingeehas.entitlements e
  join payments p on p.id = e.payment_id
  join assessments a on a.id = p.assessment_id
  where e.status = 'active' and p.status = 'paid'
), first_landing as (
  select visitor_id_hash, min(occurred_at) as first_landing_at
  from public_events where event_name = 'landing_viewed' and visitor_id_hash is not null
  group by visitor_id_hash
), first_payment_section as (
  select e.assessment_id, min(e.occurred_at) as first_payment_section_at,
    (array_agg(e.visitor_id_hash order by e.occurred_at) filter (where e.visitor_id_hash is not null))[1] as visitor_id_hash
  from public_events e join assessments a on a.id = e.assessment_id
  where e.event_name = 'paywall_viewed' and e.assessment_id is not null
  group by e.assessment_id
), first_report_open as (
  select e.assessment_id, min(e.occurred_at) as first_report_opened_at
  from public_events e join assessments a on a.id = e.assessment_id
  where e.event_name = 'report_opened' and e.assessment_id is not null
  group by e.assessment_id
), all_flow_totals as (
  select
    (select count(distinct e.visitor_id_hash) from public_events e cross join bounds b
      where e.event_name = 'landing_viewed' and e.visitor_id_hash is not null
        and e.occurred_at >= b.range_start and e.occurred_at < b.range_end) as unique_visitors,
    (select count(*) from first_payment_section s cross join bounds b where s.first_payment_section_at >= b.range_start and s.first_payment_section_at < b.range_end) as payment_section_views,
    (select count(distinct p.invoice_id) from payments p cross join bounds b where p.invoice_id is not null and p.created_at >= b.range_start and p.created_at < b.range_end) as invoices_created,
    (select count(distinct e.payment_id) from paid_entitlements e cross join bounds b where e.granted_at >= b.range_start and e.granted_at < b.range_end) as payments_confirmed,
    (select count(*) from assessments a cross join bounds b where (case when a.commercial_flow_version = 'prepaid_v2' then a.started_at else a.created_at end) >= b.range_start
      and (case when a.commercial_flow_version = 'prepaid_v2' then a.started_at else a.created_at end) < b.range_end) as assessments_started,
    (select count(*) from assessments a cross join bounds b where a.status = 'complete' and a.completed_at >= b.range_start and a.completed_at < b.range_end) as assessments_completed,
    (select count(*) from first_report_open r cross join bounds b where r.first_report_opened_at >= b.range_start and r.first_report_opened_at < b.range_end) as reports_opened,
    (select coalesce(sum(e.amount), 0) from paid_entitlements e cross join bounds b where e.granted_at >= b.range_start and e.granted_at < b.range_end) as revenue_mnt
), flow_totals as (
  select flow.commercial_flow_version,
    count(distinct s.assessment_id) filter (where s.first_payment_section_at >= b.range_start and s.first_payment_section_at < b.range_end) as payment_section_views,
    count(distinct p.invoice_id) filter (where p.invoice_id is not null and p.created_at >= b.range_start and p.created_at < b.range_end) as invoices_created,
    count(distinct e.payment_id) filter (where e.granted_at >= b.range_start and e.granted_at < b.range_end) as payments_confirmed,
    count(distinct a.id) filter (where (case when a.commercial_flow_version = 'prepaid_v2' then a.started_at else a.created_at end) >= b.range_start
      and (case when a.commercial_flow_version = 'prepaid_v2' then a.started_at else a.created_at end) < b.range_end) as assessments_started,
    count(distinct a.id) filter (where a.status = 'complete' and a.completed_at >= b.range_start and a.completed_at < b.range_end) as assessments_completed,
    count(distinct r.assessment_id) filter (where r.first_report_opened_at >= b.range_start and r.first_report_opened_at < b.range_end) as reports_opened
  from (values ('legacy_postpaid_v1'::text), ('prepaid_v2'::text)) flow(commercial_flow_version)
  cross join bounds b
  left join assessments a on a.commercial_flow_version = flow.commercial_flow_version
  left join first_payment_section s on s.assessment_id = a.id
  left join payments p on p.assessment_id = a.id
  left join paid_entitlements e on e.assessment_id = a.id
  left join first_report_open r on r.assessment_id = a.id
  group by flow.commercial_flow_version
), flow_revenue as (
  select flow.commercial_flow_version,
    coalesce(sum(e.amount) filter (where e.granted_at >= b.range_start and e.granted_at < b.range_end), 0) as revenue_mnt
  from (values ('legacy_postpaid_v1'::text), ('prepaid_v2'::text)) flow(commercial_flow_version)
  cross join bounds b
  left join paid_entitlements e on e.commercial_flow_version = flow.commercial_flow_version
  group by flow.commercial_flow_version
), paid_first_visitor_entries as (
  select l.* from first_landing l cross join bounds b cross join config c
  where l.first_landing_at >= greatest(b.range_start, c.paid_first_cutover_at) and l.first_landing_at < b.range_end
), payment_section_entries as (
  select s.* from first_payment_section s join assessments a on a.id = s.assessment_id cross join bounds b
  where a.commercial_flow_version = 'prepaid_v2' and s.first_payment_section_at >= b.range_start and s.first_payment_section_at < b.range_end
), invoice_entries as (
  select distinct on (p.invoice_id) p.* from payments p join assessments a on a.id = p.assessment_id cross join bounds b
  where a.commercial_flow_version = 'prepaid_v2' and p.invoice_id is not null and p.created_at >= b.range_start and p.created_at < b.range_end
  order by p.invoice_id, p.created_at, p.id
), payment_entries as (
  select distinct on (e.assessment_id) e.assessment_id, e.payment_id, e.granted_at
  from paid_entitlements e cross join bounds b
  where e.commercial_flow_version = 'prepaid_v2' and e.granted_at >= b.range_start and e.granted_at < b.range_end
  order by e.assessment_id, e.granted_at, e.payment_id
), start_entries as (
  select a.* from assessments a cross join bounds b
  where a.commercial_flow_version = 'prepaid_v2' and a.started_at >= b.range_start and a.started_at < b.range_end
), complete_entries as (
  select a.* from assessments a cross join bounds b
  where a.commercial_flow_version = 'prepaid_v2' and a.status = 'complete' and a.completed_at >= b.range_start and a.completed_at < b.range_end
), conversion_counts as (
  select
    (select count(*) from paid_first_visitor_entries) as visitor_entry,
    (select count(*) from paid_first_visitor_entries l cross join bounds b where exists (
      select 1 from first_payment_section s join assessments a on a.id = s.assessment_id
      where a.commercial_flow_version = 'prepaid_v2' and s.visitor_id_hash = l.visitor_id_hash
        and s.first_payment_section_at >= l.first_landing_at and s.first_payment_section_at < b.range_end)) as visitor_converted,
    (select count(*) from payment_section_entries) as section_entry,
    (select count(*) from payment_section_entries s cross join bounds b where exists (
      select 1 from payments p where p.assessment_id = s.assessment_id and p.invoice_id is not null
        and p.created_at >= s.first_payment_section_at and p.created_at < b.range_end)) as section_converted,
    (select count(*) from invoice_entries) as invoice_entry,
    (select count(*) from invoice_entries p cross join bounds b where exists (
      select 1 from paid_entitlements e where e.payment_id = p.id and e.granted_at >= p.created_at and e.granted_at < b.range_end)) as invoice_converted,
    (select count(*) from payment_entries) as payment_entry,
    (select count(*) from payment_entries e join assessments a on a.id = e.assessment_id cross join bounds b
      where a.started_at >= e.granted_at and a.started_at < b.range_end) as payment_converted,
    (select count(*) from start_entries) as start_entry,
    (select count(*) from start_entries a cross join bounds b where a.status = 'complete' and a.completed_at >= a.started_at and a.completed_at < b.range_end) as start_converted,
    (select count(*) from complete_entries) as complete_entry,
    (select count(*) from complete_entries a join first_report_open r on r.assessment_id = a.id cross join bounds b
      where r.first_report_opened_at >= a.completed_at and r.first_report_opened_at < b.range_end) as complete_converted
), tracking as (
  select min(occurred_at) filter (where event_name = 'landing_viewed') as visitor_tracking_started_at,
    min(occurred_at) filter (where event_name = 'paywall_viewed' and assessment_id is not null) as payment_section_tracking_started_at
  from public_events
), linkage_tracking as (
  select min(s.first_payment_section_at) as visitor_assessment_linkage_started_at
  from first_payment_section s join assessments a on a.id = s.assessment_id
  where a.commercial_flow_version = 'prepaid_v2' and s.visitor_id_hash is not null
), flow_activity as (
  select a.commercial_flow_version as flow from assessments a cross join bounds b
    where (case when a.commercial_flow_version = 'prepaid_v2' then a.started_at else a.created_at end) >= b.range_start
      and (case when a.commercial_flow_version = 'prepaid_v2' then a.started_at else a.created_at end) < b.range_end
  union all select a.commercial_flow_version from assessments a cross join bounds b where a.completed_at >= b.range_start and a.completed_at < b.range_end
  union all select a.commercial_flow_version from first_payment_section s join assessments a on a.id = s.assessment_id cross join bounds b where s.first_payment_section_at >= b.range_start and s.first_payment_section_at < b.range_end
  union all select a.commercial_flow_version from payments p join assessments a on a.id = p.assessment_id cross join bounds b where p.created_at >= b.range_start and p.created_at < b.range_end
  union all select e.commercial_flow_version from paid_entitlements e cross join bounds b where e.granted_at >= b.range_start and e.granted_at < b.range_end
  union all select a.commercial_flow_version from first_report_open r join assessments a on a.id = r.assessment_id cross join bounds b where r.first_report_opened_at >= b.range_start and r.first_report_opened_at < b.range_end
), coverage as (
  select exists(select 1 from flow_activity where flow = 'legacy_postpaid_v1') as legacy_present,
    exists(select 1 from flow_activity where flow = 'prepaid_v2') as prepaid_present
), days as (
  select generate_series(p_start_date, p_end_date, interval '1 day')::date as day
), daily as (
  select d.day,
    (select count(*) from paid_first_visitor_entries l where (l.first_landing_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as eligible_visitors,
    (select count(*) from first_payment_section s join assessments a on a.id = s.assessment_id
      where a.commercial_flow_version = 'prepaid_v2' and (s.first_payment_section_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as payment_section_views,
    (select count(distinct p.invoice_id) from payments p join assessments a on a.id = p.assessment_id
      where a.commercial_flow_version = 'prepaid_v2' and p.invoice_id is not null and (p.created_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as invoices_created,
    (select count(distinct e.payment_id) from paid_entitlements e where e.commercial_flow_version = 'prepaid_v2'
      and (e.granted_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as payments_confirmed,
    (select count(*) from assessments a where a.commercial_flow_version = 'prepaid_v2' and a.started_at is not null
      and (a.started_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as assessments_started,
    (select count(*) from assessments a where a.commercial_flow_version = 'prepaid_v2' and a.status = 'complete' and a.completed_at is not null
      and (a.completed_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as assessments_completed,
    (select count(*) from first_report_open r join assessments a on a.id = r.assessment_id
      where a.commercial_flow_version = 'prepaid_v2' and (r.first_report_opened_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as reports_opened,
    (select coalesce(sum(e.amount), 0) from paid_entitlements e where e.commercial_flow_version = 'prepaid_v2'
      and (e.granted_at at time zone 'Asia/Ulaanbaatar')::date = d.day) as revenue_mnt
  from days d
), totals as (
  select
    (select count(*) from paid_first_visitor_entries) as eligible_visitors,
    f.payment_section_views, f.invoices_created, f.payments_confirmed, f.assessments_started,
    f.assessments_completed, f.reports_opened, r.revenue_mnt
  from flow_totals f join flow_revenue r using (commercial_flow_version)
  where f.commercial_flow_version = 'prepaid_v2'
), legacy as (
  select f.payment_section_views, f.invoices_created, f.payments_confirmed, f.assessments_started,
    f.assessments_completed, f.reports_opened, r.revenue_mnt
  from flow_totals f join flow_revenue r using (commercial_flow_version)
  where f.commercial_flow_version = 'legacy_postpaid_v1'
)
select jsonb_build_object(
  'days', coalesce((select jsonb_agg(jsonb_build_object(
    'date', day, 'unique_visitors', eligible_visitors, 'payment_section_views', payment_section_views,
    'invoices_created', invoices_created, 'payments_confirmed', payments_confirmed,
    'assessments_started', assessments_started, 'assessments_completed', assessments_completed,
    'reports_opened', reports_opened, 'revenue_mnt', revenue_mnt
  ) order by day) from daily), '[]'::jsonb),
  'summary', to_jsonb(a.*),
  'all_flows', to_jsonb(a.*),
  'current_flow', to_jsonb(t.*),
  'legacy_flow', to_jsonb(l.*),
  'conversions', jsonb_build_object(
    'visitor_to_payment_section', jsonb_build_object('entry_count', cc.visitor_entry, 'converted_count', cc.visitor_converted,
      'rate', case when tracking.visitor_tracking_started_at is null or linkage_tracking.visitor_assessment_linkage_started_at is null then null when cc.visitor_entry = 0 then null else cc.visitor_converted::numeric / cc.visitor_entry end,
      'status', case when tracking.visitor_tracking_started_at is null or linkage_tracking.visitor_assessment_linkage_started_at is null then 'tracking_unavailable' when cc.visitor_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when tracking.visitor_tracking_started_at is null or linkage_tracking.visitor_assessment_linkage_started_at is null then 'visitor_assessment_linkage_unavailable' when cc.visitor_entry = 0 then 'no_paid_first_visitors' else null end),
    'payment_section_to_invoice', jsonb_build_object('entry_count', cc.section_entry, 'converted_count', cc.section_converted,
      'rate', case when cc.section_entry = 0 then null else cc.section_converted::numeric / cc.section_entry end,
      'status', case when cc.section_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when cc.section_entry = 0 then 'no_paid_first_payment_section_entries' else null end),
    'invoice_to_payment', jsonb_build_object('entry_count', cc.invoice_entry, 'converted_count', cc.invoice_converted,
      'rate', case when cc.invoice_entry = 0 then null else cc.invoice_converted::numeric / cc.invoice_entry end,
      'status', case when cc.invoice_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when cc.invoice_entry = 0 then 'no_paid_first_invoice_entries' else null end),
    'payment_to_start', jsonb_build_object('entry_count', cc.payment_entry, 'converted_count', cc.payment_converted,
      'rate', case when cc.payment_entry = 0 then null else cc.payment_converted::numeric / cc.payment_entry end,
      'status', case when cc.payment_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when cc.payment_entry = 0 then 'no_paid_first_payment_entries' else null end),
    'start_to_complete', jsonb_build_object('entry_count', cc.start_entry, 'converted_count', cc.start_converted,
      'rate', case when cc.start_entry = 0 then null else cc.start_converted::numeric / cc.start_entry end,
      'status', case when cc.start_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when cc.start_entry = 0 then 'no_paid_first_start_entries' else null end),
    'complete_to_report_open', jsonb_build_object('entry_count', cc.complete_entry, 'converted_count', cc.complete_converted,
      'rate', case when cc.complete_entry = 0 then null else cc.complete_converted::numeric / cc.complete_entry end,
      'status', case when cc.complete_entry = 0 then 'no_denominator' else 'available' end,
      'reason', case when cc.complete_entry = 0 then 'no_paid_first_complete_entries' else null end)
  ),
  'coverage', jsonb_build_object(
    'paid_first_cutover_at', config.paid_first_cutover_at,
    'range_starts_before_cutover', bounds.range_start < config.paid_first_cutover_at,
    'range_ends_after_cutover', bounds.range_end > config.paid_first_cutover_at,
    'legacy_activity_present', coverage.legacy_present,
    'prepaid_activity_present', coverage.prepaid_present,
    'flow_state', case when coverage.legacy_present and coverage.prepaid_present then 'mixed'
      when coverage.legacy_present then 'legacy_only' when coverage.prepaid_present then 'prepaid_only' else 'empty' end,
    'visitor_tracking_started_at', tracking.visitor_tracking_started_at,
    'payment_section_tracking_started_at', tracking.payment_section_tracking_started_at
  )
)
from all_flow_totals a cross join totals t cross join legacy l cross join conversion_counts cc
cross join tracking cross join linkage_tracking cross join coverage cross join config cross join bounds
$$;

revoke all on function jingeehas.get_daily_funnel_analytics(date, date) from public, anon, authenticated;
grant execute on function jingeehas.get_daily_funnel_analytics(date, date) to service_role;

insert into jingeehas.schema_migrations(version)
values ('20260722041203_repair_flow_aware_funnel_cohort_analytics')
on conflict (version) do nothing;

commit;
