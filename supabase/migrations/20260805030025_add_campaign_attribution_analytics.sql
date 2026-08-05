begin;

set local lock_timeout = '5s';

create function jingeehas.get_campaign_attribution_analytics(p_start_date date, p_end_date date)
returns jsonb language sql stable security definer set search_path = '' as $$
with bounds as (
  select p_start_date::timestamp at time zone 'Asia/Ulaanbaatar' as range_start,
    (p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar' as range_end
), excluded_funnels as (
  select distinct funnel_key_hash
  from jingeehas.analytics_events
  where funnel_key_hash is not null and (is_admin or is_owner_preview or is_test)
), excluded_assessments as (
  select distinct assessment_id
  from jingeehas.analytics_events
  where assessment_id is not null and (is_admin or is_owner_preview or is_test)
), public_events as (
  select e.*
  from jingeehas.analytics_events e
  where not e.is_admin and not e.is_owner_preview and not e.is_test
    and (e.funnel_key_hash is null or not exists (
      select 1 from excluded_funnels x where x.funnel_key_hash = e.funnel_key_hash
    ))
    and (e.assessment_id is null or not exists (
      select 1 from excluded_assessments x where x.assessment_id = e.assessment_id
    ))
), first_funnel_events as (
  select distinct on (event_name, funnel_key_hash)
    event_name, funnel_key_hash, visitor_id_hash, occurred_at, amount_mnt
  from public_events
  where funnel_key_hash is not null and event_name in (
    'free_assessment_started', 'free_assessment_completed', 'post_assessment_paywall_viewed',
    'full_report_cta_clicked', 'invoice_created', 'payment_confirmed', 'full_report_opened'
  )
  order by event_name, funnel_key_hash, occurred_at
), acquisition as (
  select distinct on (funnel_key_hash)
    funnel_key_hash, visitor_id_hash, utm_source, utm_medium, utm_campaign, utm_content, utm_term, occurred_at
  from public_events
  where funnel_key_hash is not null and event_name = 'free_assessment_started'
  order by funnel_key_hash, occurred_at
), range_landings as (
  select distinct on (
    visitor_id_hash, coalesce(utm_source, ''), coalesce(utm_medium, ''), coalesce(utm_campaign, ''),
    coalesce(utm_content, ''), coalesce(utm_term, '')
  ) visitor_id_hash, utm_source, utm_medium, utm_campaign, utm_content, utm_term
  from public_events e cross join bounds b
  where e.event_name = 'landing_viewed' and e.visitor_id_hash is not null
    and e.occurred_at >= b.range_start and e.occurred_at < b.range_end
  order by visitor_id_hash, coalesce(utm_source, ''), coalesce(utm_medium, ''), coalesce(utm_campaign, ''),
    coalesce(utm_content, ''), coalesce(utm_term, ''), occurred_at
), landing_groups as (
  select utm_source, utm_medium, utm_campaign, utm_content, utm_term, count(*)::integer as visitors
  from range_landings
  group by utm_source, utm_medium, utm_campaign, utm_content, utm_term
), range_stages as (
  select f.*, a.utm_source, a.utm_medium, a.utm_campaign, a.utm_content, a.utm_term
  from first_funnel_events f join acquisition a using (funnel_key_hash) cross join bounds b
  where f.occurred_at >= b.range_start and f.occurred_at < b.range_end
), stage_groups as (
  select utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    count(*) filter (where event_name = 'free_assessment_started')::integer as assessments_started,
    count(*) filter (where event_name = 'free_assessment_completed')::integer as assessments_completed,
    count(*) filter (where event_name = 'post_assessment_paywall_viewed')::integer as paywall_views,
    count(*) filter (where event_name = 'full_report_cta_clicked')::integer as full_report_cta_clicks,
    count(*) filter (where event_name = 'invoice_created')::integer as invoices_created,
    count(*) filter (where event_name = 'payment_confirmed')::integer as payments_confirmed,
    count(*) filter (where event_name = 'full_report_opened')::integer as reports_opened,
    coalesce(sum(amount_mnt) filter (where event_name = 'payment_confirmed'), 0)::integer as revenue_mnt
  from range_stages
  group by utm_source, utm_medium, utm_campaign, utm_content, utm_term
), attribution_keys as (
  select utm_source, utm_medium, utm_campaign, utm_content, utm_term from landing_groups
  union
  select utm_source, utm_medium, utm_campaign, utm_content, utm_term from stage_groups
), rows as (
  select k.utm_source, k.utm_medium, k.utm_campaign, k.utm_content, k.utm_term,
    k.utm_source is null and k.utm_medium is null and k.utm_campaign is null and k.utm_content is null and k.utm_term is null as unattributed,
    coalesce(l.visitors, 0) as visitors,
    coalesce(s.assessments_started, 0) as assessments_started,
    coalesce(s.assessments_completed, 0) as assessments_completed,
    coalesce(s.paywall_views, 0) as paywall_views,
    coalesce(s.full_report_cta_clicks, 0) as full_report_cta_clicks,
    coalesce(s.invoices_created, 0) as invoices_created,
    coalesce(s.payments_confirmed, 0) as payments_confirmed,
    coalesce(s.reports_opened, 0) as reports_opened,
    coalesce(s.revenue_mnt, 0) as revenue_mnt
  from attribution_keys k
  left join landing_groups l on
    l.utm_source is not distinct from k.utm_source and l.utm_medium is not distinct from k.utm_medium
    and l.utm_campaign is not distinct from k.utm_campaign and l.utm_content is not distinct from k.utm_content
    and l.utm_term is not distinct from k.utm_term
  left join stage_groups s on
    s.utm_source is not distinct from k.utm_source and s.utm_medium is not distinct from k.utm_medium
    and s.utm_campaign is not distinct from k.utm_campaign and s.utm_content is not distinct from k.utm_content
    and s.utm_term is not distinct from k.utm_term
), excluded_range as (
  select e.*
  from jingeehas.analytics_events e cross join bounds b
  where e.occurred_at >= b.range_start and e.occurred_at < b.range_end
    and (
      e.is_admin or e.is_owner_preview or e.is_test
      or (e.funnel_key_hash is not null and exists (select 1 from excluded_funnels x where x.funnel_key_hash = e.funnel_key_hash))
      or (e.assessment_id is not null and exists (select 1 from excluded_assessments x where x.assessment_id = e.assessment_id))
    )
), excluded_payments as (
  select distinct on (coalesce(funnel_key_hash, payment_id, event_id::text))
    coalesce(funnel_key_hash, payment_id, event_id::text) as payment_key, amount_mnt
  from excluded_range
  where event_name = 'payment_confirmed'
  order by coalesce(funnel_key_hash, payment_id, event_id::text), occurred_at
)
select jsonb_build_object(
  'rows', coalesce((select jsonb_agg(to_jsonb(r.*) order by r.unattributed, r.utm_campaign nulls last, r.utm_content nulls last) from rows r), '[]'::jsonb),
  'excluded', jsonb_build_object(
    'event_count', (select count(*) from excluded_range),
    'payment_count', (select count(*) from excluded_payments),
    'revenue_mnt', (select coalesce(sum(amount_mnt), 0) from excluded_payments)
  )
)
$$;

alter function jingeehas.get_daily_funnel_analytics(date, date)
  rename to get_daily_funnel_analytics_v2;

create function jingeehas.get_daily_funnel_analytics(p_start_date date, p_end_date date)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jingeehas.get_daily_funnel_analytics_v2(p_start_date, p_end_date)
    || jsonb_build_object('campaign_attribution', jingeehas.get_campaign_attribution_analytics(p_start_date, p_end_date))
$$;

revoke all on function jingeehas.get_campaign_attribution_analytics(date, date) from public, anon, authenticated;
revoke all on function jingeehas.get_daily_funnel_analytics_v2(date, date) from public, anon, authenticated;
revoke all on function jingeehas.get_daily_funnel_analytics(date, date) from public, anon, authenticated;
grant execute on function jingeehas.get_campaign_attribution_analytics(date, date) to service_role;
grant execute on function jingeehas.get_daily_funnel_analytics_v2(date, date) to service_role;
grant execute on function jingeehas.get_daily_funnel_analytics(date, date) to service_role;

insert into jingeehas.schema_migrations(version)
values ('20260805030025_add_campaign_attribution_analytics')
on conflict (version) do nothing;

commit;
