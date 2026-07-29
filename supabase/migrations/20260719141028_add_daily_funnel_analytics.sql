begin;

create table jingeehas.analytics_events (
  id uuid primary key,
  event_id uuid not null unique,
  event_name text not null check (event_name in ('landing_viewed','start_cta_clicked','assessment_started','assessment_completed','paywall_viewed','invoice_created','payment_confirmed','invoice_create_failed','payment_check_started','payment_check_failed','recovery_requested','recovery_succeeded','report_opened')),
  occurred_at timestamptz not null,
  visitor_id_hash text check (visitor_id_hash is null or visitor_id_hash ~ '^[a-f0-9]{64}$'),
  session_id_hash text check (session_id_hash is null or session_id_hash ~ '^[a-f0-9]{64}$'),
  assessment_id text references jingeehas.assessments(id) on delete set null,
  invoice_id text,
  payment_id text references jingeehas.payments(id) on delete set null,
  amount_mnt integer check (amount_mnt is null or amount_mnt >= 0),
  utm_source text, utm_medium text, utm_campaign text, utm_content text, utm_term text,
  referrer_host text, device_class text not null check (device_class in ('mobile','tablet','desktop','unknown')),
  rate_key_hash text check (rate_key_hash is null or rate_key_hash ~ '^[a-f0-9]{64}$'),
  is_admin boolean not null default false, is_owner_preview boolean not null default false, is_test boolean not null default false,
  idempotency_key text, metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (jsonb_typeof(metadata) = 'object' and octet_length(metadata::text) <= 2048)
);
create unique index analytics_events_idempotency_uidx on jingeehas.analytics_events (idempotency_key) where idempotency_key is not null;
create index analytics_events_name_occurred_idx on jingeehas.analytics_events (event_name, occurred_at desc);
create index analytics_events_assessment_idx on jingeehas.analytics_events (assessment_id) where assessment_id is not null;
create index analytics_events_invoice_idx on jingeehas.analytics_events (invoice_id) where invoice_id is not null;
create index analytics_events_payment_idx on jingeehas.analytics_events (payment_id) where payment_id is not null;
create index analytics_events_campaign_idx on jingeehas.analytics_events (utm_campaign, occurred_at desc) where utm_campaign is not null;
create index analytics_events_rate_idx on jingeehas.analytics_events (rate_key_hash, created_at desc) where rate_key_hash is not null;

alter table jingeehas.analytics_events enable row level security;
revoke all on table jingeehas.analytics_events from public, anon, authenticated;
grant select, insert on table jingeehas.analytics_events to service_role;

create or replace function jingeehas.insert_analytics_event(payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
  if payload is null or jsonb_typeof(payload) <> 'object' then raise exception using errcode = '22023', message = 'JH_ANALYTICS_INVALID'; end if;
  insert into jingeehas.analytics_events as row_value
  select * from jsonb_populate_record(null::jingeehas.analytics_events, payload)
  returning to_jsonb(row_value) into result;
  return result;
exception when unique_violation then raise exception using errcode = '23505', message = 'JH_CONFLICT';
end $$;

create or replace function jingeehas.get_daily_funnel_analytics(p_start_date date, p_end_date date)
returns jsonb language sql stable security definer set search_path = '' as $$
with days as (
  select generate_series(p_start_date, p_end_date, interval '1 day')::date as day
), eligible as (
  select *, (occurred_at at time zone 'Asia/Ulaanbaatar')::date as local_day
  from jingeehas.analytics_events
  where not is_admin and not is_owner_preview and not is_test
    and occurred_at >= (p_start_date::timestamp at time zone 'Asia/Ulaanbaatar')
    and occurred_at < ((p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar')
), daily as (
  select d.day,
    count(distinct e.visitor_id_hash) filter (where e.event_name = 'landing_viewed') as unique_visitors,
    count(*) filter (where e.event_name = 'landing_viewed') as landing_views,
    count(distinct e.assessment_id) filter (where e.event_name = 'assessment_started') as assessments_started,
    count(distinct e.assessment_id) filter (where e.event_name = 'assessment_completed') as assessments_completed,
    count(distinct e.assessment_id) filter (where e.event_name = 'paywall_viewed') as paywall_views,
    count(distinct e.invoice_id) filter (where e.event_name = 'invoice_created') as invoices_created,
    count(distinct e.payment_id) filter (where e.event_name = 'payment_confirmed') as payments_confirmed
  from days d left join eligible e on e.local_day = d.day group by d.day
), revenue as (
  select local_day as day, sum(amount_mnt) as revenue_mnt from (
    select distinct on (payment_id) local_day, payment_id, amount_mnt from eligible
    where event_name = 'payment_confirmed' and payment_id is not null order by payment_id, occurred_at
  ) paid group by local_day
), summary as (
  select count(distinct visitor_id_hash) filter (where event_name = 'landing_viewed') as unique_visitors,
    count(*) filter (where event_name = 'landing_viewed') as landing_views,
    count(distinct assessment_id) filter (where event_name = 'assessment_started') as assessments_started,
    count(distinct assessment_id) filter (where event_name = 'assessment_completed') as assessments_completed,
    count(distinct assessment_id) filter (where event_name = 'paywall_viewed') as paywall_views,
    count(distinct invoice_id) filter (where event_name = 'invoice_created') as invoices_created,
    count(distinct payment_id) filter (where event_name = 'payment_confirmed') as payments_confirmed
  from eligible
), summary_revenue as (
  select coalesce(sum(amount_mnt), 0) as revenue_mnt from (
    select distinct on (payment_id) payment_id, amount_mnt from eligible
    where event_name = 'payment_confirmed' and payment_id is not null order by payment_id, occurred_at
  ) paid
), daily_json as (
  select coalesce(jsonb_agg(jsonb_build_object('date', daily.day, 'unique_visitors', daily.unique_visitors,
    'landing_views', daily.landing_views, 'assessments_started', daily.assessments_started,
    'assessments_completed', daily.assessments_completed, 'paywall_views', daily.paywall_views,
    'invoices_created', daily.invoices_created, 'payments_confirmed', daily.payments_confirmed,
    'revenue_mnt', coalesce(revenue.revenue_mnt, 0)) order by daily.day), '[]'::jsonb) as rows
  from daily left join revenue using (day)
)
select jsonb_build_object('days', daily_json.rows, 'summary', jsonb_build_object(
  'unique_visitors', summary.unique_visitors, 'landing_views', summary.landing_views,
  'assessments_started', summary.assessments_started, 'assessments_completed', summary.assessments_completed,
  'paywall_views', summary.paywall_views, 'invoices_created', summary.invoices_created,
  'payments_confirmed', summary.payments_confirmed, 'revenue_mnt', summary_revenue.revenue_mnt))
from daily_json cross join summary cross join summary_revenue
$$;

create or replace function jingeehas.find_analytics_events(filters jsonb)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if filters ? 'rate_key_hash' and (select count(*) from jsonb_object_keys(filters)) = 1 then
    select coalesce(jsonb_agg(to_jsonb(row_value)), '[]'::jsonb) into result from jingeehas.analytics_events row_value where rate_key_hash = filters->>'rate_key_hash';
  elsif filters ? 'assessment_id' and filters ? 'event_name' and (select count(*) from jsonb_object_keys(filters)) = 2 then
    select coalesce(jsonb_agg(to_jsonb(row_value)), '[]'::jsonb) into result from jingeehas.analytics_events row_value
      where assessment_id = filters->>'assessment_id' and event_name = filters->>'event_name';
  else raise exception using errcode = '22023', message = 'JH_ANALYTICS_FILTER_INVALID'; end if;
  return result;
end $$;

revoke all on function jingeehas.insert_analytics_event(jsonb) from public, anon, authenticated;
revoke all on function jingeehas.find_analytics_events(jsonb) from public, anon, authenticated;
revoke all on function jingeehas.get_daily_funnel_analytics(date, date) from public, anon, authenticated;
grant execute on function jingeehas.insert_analytics_event(jsonb) to service_role;
grant execute on function jingeehas.find_analytics_events(jsonb) to service_role;
grant execute on function jingeehas.get_daily_funnel_analytics(date, date) to service_role;

create or replace function jingeehas.execute_request(request jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare action_name text := coalesce(request->>'action', ''); operations jsonb; item jsonb; results jsonb := '[]'::jsonb;
  should_rollback boolean := coalesce((request->>'rollback')::boolean, false);
begin
  if action_name = 'consume_recovery_challenge' then
    if coalesce(request->>'id', '') = '' or coalesce(request->>'codeHash', '') = '' or coalesce(request->>'now', '') = '' then raise exception using errcode = '22023', message = 'JH_RECOVERY_CONSUME_INVALID'; end if;
    return jingeehas.consume_recovery_challenge(request->>'id', request->>'codeHash', (request->>'now')::timestamptz);
  elsif action_name = 'get_active_report_snapshot' then return jingeehas.get_active_report_snapshot(request->>'assessment_id');
  elsif action_name = 'list_report_snapshot_versions' then return jingeehas.list_report_snapshot_versions(request->>'assessment_id');
  elsif action_name = 'get_report_snapshot_version' then return jingeehas.get_report_snapshot_version((request->>'snapshot_id')::uuid);
  elsif action_name = 'create_report_snapshot_version' then return jingeehas.create_report_snapshot_version(request);
  elsif action_name = 'activate_report_snapshot_version' then return jingeehas.activate_report_snapshot_version((request->>'snapshot_id')::uuid, nullif(request->>'expected_current_snapshot_id', '')::uuid, (request->>'now')::timestamptz);
  elsif action_name = 'insert_analytics_event' then return jingeehas.insert_analytics_event(request->'row');
  elsif action_name = 'find_analytics_events' then return jingeehas.find_analytics_events(request->'filters');
  elsif action_name = 'get_daily_funnel_analytics' then return jingeehas.get_daily_funnel_analytics((request->>'start_date')::date, (request->>'end_date')::date);
  end if;
  if action_name <> 'transaction' then return jingeehas.execute_operation(request); end if;
  operations := request->'operations';
  if operations is null or jsonb_typeof(operations) <> 'array' then raise exception using errcode = '22023', message = 'JH_OPERATIONS_INVALID'; end if;
  if jsonb_array_length(operations) > 50 then raise exception using errcode = '22023', message = 'JH_TOO_MANY_OPERATIONS'; end if;
  if should_rollback then
    begin
      for item in select value from jsonb_array_elements(operations) loop
        if coalesce(item->>'action', '') = 'transaction' then raise exception using errcode = '22023', message = 'JH_NESTED_TRANSACTION'; end if;
        results := results || jsonb_build_array(jingeehas.execute_operation(item));
      end loop;
      raise exception using errcode = 'P0001', message = 'JH_CERTIFICATION_ROLLBACK';
    exception when sqlstate 'P0001' then if sqlerrm <> 'JH_CERTIFICATION_ROLLBACK' then raise; end if; end;
    return jsonb_build_object('results', results, 'rolled_back', true);
  end if;
  for item in select value from jsonb_array_elements(operations) loop
    if coalesce(item->>'action', '') = 'transaction' then raise exception using errcode = '22023', message = 'JH_NESTED_TRANSACTION'; end if;
    results := results || jsonb_build_array(jingeehas.execute_operation(item));
  end loop;
  return jsonb_build_object('results', results, 'rolled_back', false);
end $$;

revoke all on function jingeehas.execute_request(jsonb) from public, anon, authenticated;
grant execute on function jingeehas.execute_request(jsonb) to service_role;
insert into jingeehas.schema_migrations(version) values ('20260719090000_add_daily_funnel_analytics') on conflict (version) do nothing;
commit;
