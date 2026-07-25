begin;

alter table jingeehas.assessments add column if not exists commercial_flow_version text;
alter table jingeehas.assessments add column if not exists started_at timestamptz;
update jingeehas.assessments set commercial_flow_version = 'legacy_postpaid_v1' where commercial_flow_version is null;
alter table jingeehas.assessments alter column commercial_flow_version set default 'legacy_postpaid_v1';
alter table jingeehas.assessments alter column commercial_flow_version set not null;
alter table jingeehas.assessments add constraint assessments_commercial_flow_version_check check (commercial_flow_version in ('legacy_postpaid_v1', 'prepaid_v2'));
alter table jingeehas.assessments drop constraint assessments_status_check;
alter table jingeehas.assessments add constraint assessments_status_check check (status in ('draft', 'payment_pending', 'paid_ready', 'in_progress', 'complete'));
alter table jingeehas.assessments add constraint assessments_started_at_check check (started_at is null or started_at >= created_at);
create index assessments_flow_status_idx on jingeehas.assessments (commercial_flow_version, status, updated_at desc);
create index assessments_started_at_idx on jingeehas.assessments (started_at desc) where started_at is not null;

create or replace function jingeehas.get_daily_funnel_analytics(p_start_date date, p_end_date date)
returns jsonb language sql stable security definer set search_path = '' as $$
with days as (
  select generate_series(p_start_date, p_end_date, interval '1 day')::date as day
), excluded_assessments as (
  select distinct assessment_id
  from jingeehas.analytics_events
  where assessment_id is not null and (is_admin or is_owner_preview or is_test)
  union
  select distinct assessment_id from jingeehas.assessment_sessions where source = 'owner'
), eligible_events as (
  select *, (occurred_at at time zone 'Asia/Ulaanbaatar')::date as local_day
  from jingeehas.analytics_events
  where not is_admin and not is_owner_preview and not is_test
    and occurred_at >= (p_start_date::timestamp at time zone 'Asia/Ulaanbaatar')
    and occurred_at < ((p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar')
), visitor_daily as (
  select local_day as day,
    count(distinct visitor_id_hash) filter (where event_name = 'landing_viewed') as unique_visitors,
    count(*) filter (where event_name = 'landing_viewed') as landing_views
  from eligible_events group by local_day
), paywall_daily as (
  select local_day as day, count(distinct assessment_id) as payment_section_views
  from eligible_events
  where event_name = 'paywall_viewed' and assessment_id is not null
    and assessment_id not in (select assessment_id from excluded_assessments)
  group by local_day
), started_daily as (
  select ((case when commercial_flow_version = 'prepaid_v2' then started_at else created_at end) at time zone 'Asia/Ulaanbaatar')::date as day, count(distinct id) as assessments_started
  from jingeehas.assessments
  where (case when commercial_flow_version = 'prepaid_v2' then started_at else created_at end) >= (p_start_date::timestamp at time zone 'Asia/Ulaanbaatar')
    and (case when commercial_flow_version = 'prepaid_v2' then started_at else created_at end) < ((p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar')
    and id not in (select assessment_id from excluded_assessments)
  group by day
), completed_daily as (
  select (completed_at at time zone 'Asia/Ulaanbaatar')::date as day, count(distinct id) as assessments_completed
  from jingeehas.assessments
  where status = 'complete' and completed_at is not null
    and completed_at >= (p_start_date::timestamp at time zone 'Asia/Ulaanbaatar')
    and completed_at < ((p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar')
    and id not in (select assessment_id from excluded_assessments)
  group by day
), report_daily as (
  select local_day as day, count(distinct assessment_id) as reports_opened
  from eligible_events where event_name = 'report_opened' and assessment_id is not null
    and assessment_id not in (select assessment_id from excluded_assessments) group by local_day
), invoice_daily as (
  select (created_at at time zone 'Asia/Ulaanbaatar')::date as day, count(distinct invoice_id) as invoices_created
  from jingeehas.payments
  where invoice_id is not null
    and created_at >= (p_start_date::timestamp at time zone 'Asia/Ulaanbaatar')
    and created_at < ((p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar')
    and assessment_id not in (select assessment_id from excluded_assessments)
  group by day
), paid_daily as (
  select (e.granted_at at time zone 'Asia/Ulaanbaatar')::date as day,
    count(distinct p.id) as payments_confirmed, sum(p.amount) as revenue_mnt
  from jingeehas.entitlements e join jingeehas.payments p on p.id = e.payment_id
  where e.status = 'active' and p.status = 'paid'
    and e.granted_at >= (p_start_date::timestamp at time zone 'Asia/Ulaanbaatar')
    and e.granted_at < ((p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar')
    and p.assessment_id not in (select assessment_id from excluded_assessments)
  group by day
), daily_json as (
  select coalesce(jsonb_agg(jsonb_build_object(
    'date', d.day,
    'unique_visitors', coalesce(v.unique_visitors, 0),
    'landing_views', coalesce(v.landing_views, 0),
    'assessments_started', coalesce(s.assessments_started, 0),
    'assessments_completed', coalesce(c.assessments_completed, 0),
    'paywall_views', coalesce(w.payment_section_views, 0),
    'invoices_created', coalesce(i.invoices_created, 0),
    'payments_confirmed', coalesce(p.payments_confirmed, 0),
    'reports_opened', coalesce(r.reports_opened, 0),
    'revenue_mnt', coalesce(p.revenue_mnt, 0)
  ) order by d.day), '[]'::jsonb) as rows
  from days d
  left join visitor_daily v on v.day = d.day
  left join started_daily s on s.day = d.day
  left join completed_daily c on c.day = d.day
  left join paywall_daily w on w.day = d.day
  left join invoice_daily i on i.day = d.day
  left join paid_daily p on p.day = d.day
  left join report_daily r on r.day = d.day
), visitor_summary as (
  select count(distinct visitor_id_hash) filter (where event_name = 'landing_viewed') as unique_visitors,
    count(*) filter (where event_name = 'landing_viewed') as landing_views,
    count(distinct assessment_id) filter (where event_name = 'paywall_viewed' and assessment_id not in (select assessment_id from excluded_assessments)) as payment_section_views
  from eligible_events
), started_summary as (
  select count(distinct id) as assessments_started from jingeehas.assessments
  where (case when commercial_flow_version = 'prepaid_v2' then started_at else created_at end) >= (p_start_date::timestamp at time zone 'Asia/Ulaanbaatar')
    and (case when commercial_flow_version = 'prepaid_v2' then started_at else created_at end) < ((p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar')
    and id not in (select assessment_id from excluded_assessments)
), completed_summary as (
  select count(distinct id) as assessments_completed from jingeehas.assessments
  where status = 'complete' and completed_at is not null
    and completed_at >= (p_start_date::timestamp at time zone 'Asia/Ulaanbaatar')
    and completed_at < ((p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar')
    and id not in (select assessment_id from excluded_assessments)
), invoice_summary as (
  select count(distinct invoice_id) as invoices_created from jingeehas.payments
  where invoice_id is not null
    and created_at >= (p_start_date::timestamp at time zone 'Asia/Ulaanbaatar')
    and created_at < ((p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar')
    and assessment_id not in (select assessment_id from excluded_assessments)
), paid_summary as (
  select count(distinct p.id) as payments_confirmed, coalesce(sum(p.amount), 0) as revenue_mnt
  from jingeehas.entitlements e join jingeehas.payments p on p.id = e.payment_id
  where e.status = 'active' and p.status = 'paid'
    and e.granted_at >= (p_start_date::timestamp at time zone 'Asia/Ulaanbaatar')
    and e.granted_at < ((p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar')
    and p.assessment_id not in (select assessment_id from excluded_assessments)
), report_summary as (
  select count(distinct assessment_id) as reports_opened from eligible_events
  where event_name = 'report_opened' and assessment_id is not null
    and assessment_id not in (select assessment_id from excluded_assessments)
), flow_mix as (
  select count(*) filter (where commercial_flow_version = 'legacy_postpaid_v1') as legacy_count,
    count(*) filter (where commercial_flow_version = 'prepaid_v2') as prepaid_count
  from jingeehas.assessments where updated_at >= (p_start_date::timestamp at time zone 'Asia/Ulaanbaatar')
    and updated_at < ((p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar')
    and id not in (select assessment_id from excluded_assessments)
), coverage as (
  select min(occurred_at) filter (where event_name = 'landing_viewed' and not is_admin and not is_owner_preview and not is_test) as visitor_tracking_started_at,
    min(occurred_at) filter (where event_name = 'paywall_viewed' and not is_admin and not is_owner_preview and not is_test) as payment_section_tracking_started_at
  from jingeehas.analytics_events
)
select jsonb_build_object(
  'days', daily_json.rows,
  'summary', jsonb_build_object(
    'unique_visitors', visitor_summary.unique_visitors,
    'landing_views', visitor_summary.landing_views,
    'assessments_started', started_summary.assessments_started,
    'assessments_completed', completed_summary.assessments_completed,
    'paywall_views', visitor_summary.payment_section_views,
    'invoices_created', invoice_summary.invoices_created,
    'payments_confirmed', paid_summary.payments_confirmed,
    'reports_opened', report_summary.reports_opened,
    'revenue_mnt', paid_summary.revenue_mnt
  ),
  'coverage', jsonb_build_object(
    'visitor_tracking_started_at', coverage.visitor_tracking_started_at,
    'payment_section_tracking_started_at', coverage.payment_section_tracking_started_at,
    'business_record_source', true,
    'legacy_flow_count', flow_mix.legacy_count,
    'prepaid_flow_count', flow_mix.prepaid_count,
    'mixed_flow', flow_mix.legacy_count > 0 and flow_mix.prepaid_count > 0
  )
)
from daily_json cross join visitor_summary cross join started_summary cross join completed_summary
cross join invoice_summary cross join paid_summary cross join report_summary cross join flow_mix cross join coverage
$$;

revoke all on function jingeehas.get_daily_funnel_analytics(date, date) from public, anon, authenticated;
grant execute on function jingeehas.get_daily_funnel_analytics(date, date) to service_role;

insert into jingeehas.schema_migrations(version)
values ('20260721143352_add_paid_first_assessment_flow')
on conflict (version) do nothing;

commit;
