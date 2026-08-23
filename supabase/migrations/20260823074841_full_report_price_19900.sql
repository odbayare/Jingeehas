begin;

set local lock_timeout = '5s';

alter table jingeehas.payments
  drop constraint if exists payments_amount_check;

alter table jingeehas.payments
  add constraint payments_amount_check check (amount in (9900, 19900, 39000));

create table if not exists jingeehas.price_offer_cutovers (
  price_version text primary key,
  product_code text not null check (product_code = 'WEIGHT_TEST_ONE_TIME'),
  amount_mnt integer not null check (amount_mnt in (9900, 19900, 39000)),
  effective_at timestamptz not null unique,
  created_at timestamptz not null default now()
);
alter table jingeehas.price_offer_cutovers enable row level security;
revoke all on table jingeehas.price_offer_cutovers from public, anon, authenticated;

create or replace function jingeehas.record_p19900_cutover(p_effective_at timestamptz)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
  if p_effective_at is null or p_effective_at > now() + interval '5 minutes' then
    raise exception using errcode = '22023', message = 'JH_P19900_CUTOVER_INVALID';
  end if;
  insert into jingeehas.price_offer_cutovers(price_version, product_code, amount_mnt, effective_at)
  values ('p19900_v1', 'WEIGHT_TEST_ONE_TIME', 19900, p_effective_at)
  on conflict (price_version) do nothing;
  select to_jsonb(c) into result from jingeehas.price_offer_cutovers c where c.price_version = 'p19900_v1';
  if (result->>'amount_mnt')::integer <> 19900 or (result->>'effective_at')::timestamptz <> p_effective_at then
    raise exception using errcode = '23505', message = 'JH_P19900_CUTOVER_CONFLICT';
  end if;
  return result;
end $$;

revoke all on function jingeehas.record_p19900_cutover(timestamptz) from public, anon, authenticated;
grant execute on function jingeehas.record_p19900_cutover(timestamptz) to service_role;

create or replace function jingeehas.get_offer_price_measurement(
  p_start_date date,
  p_end_date date,
  p_utm_content text
)
returns jsonb language sql stable security definer set search_path = '' as $$
with bounds as (
  select p_start_date::timestamp at time zone 'Asia/Ulaanbaatar' as range_start,
    (p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar' as range_end
), cutover as (
  select effective_at from jingeehas.price_offer_cutovers where price_version = 'p19900_v1'
), excluded_funnels as (
  select distinct funnel_key_hash from jingeehas.analytics_events
  where funnel_key_hash is not null and (is_admin or is_owner_preview or is_test)
), public_events as (
  select e.* from jingeehas.analytics_events e
  where not e.is_admin and not e.is_owner_preview and not e.is_test
    and (e.funnel_key_hash is null or not exists (
      select 1 from excluded_funnels x where x.funnel_key_hash = e.funnel_key_hash
    ))
), acquisition as (
  select distinct on (funnel_key_hash) funnel_key_hash, utm_content, occurred_at
  from public_events
  where event_name = 'free_assessment_started' and funnel_key_hash is not null
  order by funnel_key_hash, occurred_at
), first_paywall as (
  select distinct on (e.funnel_key_hash) e.funnel_key_hash, e.occurred_at, e.amount_mnt, e.metadata
  from public_events e join acquisition a using (funnel_key_hash) cross join bounds b
  where e.event_name = 'post_assessment_paywall_viewed' and a.utm_content = p_utm_content
    and e.occurred_at >= b.range_start and e.occurred_at < b.range_end
  order by e.funnel_key_hash, e.occurred_at
), cohorts as (
  select p.*,
    case when p.amount_mnt = 19900 or (select effective_at from cutover) is not null
      and p.occurred_at >= (select effective_at from cutover) then 'p19900_v1' else 'p39000_historical' end as price_version,
    case when p.amount_mnt = 19900 or (select effective_at from cutover) is not null
      and p.occurred_at >= (select effective_at from cutover) then 19900 else 39000 end as offer_price_mnt
  from first_paywall p
), funnel_outcomes as (
  select c.*,
    exists (select 1 from public_events e where e.funnel_key_hash = c.funnel_key_hash and e.event_name = 'full_report_cta_clicked' and e.occurred_at >= c.occurred_at) as cta,
    exists (select 1 from public_events e where e.funnel_key_hash = c.funnel_key_hash and e.event_name = 'invoice_created' and e.occurred_at >= c.occurred_at) as invoice,
    exists (select 1 from public_events e where e.funnel_key_hash = c.funnel_key_hash and e.event_name = 'payment_confirmed' and e.occurred_at >= c.occurred_at) as paid,
    coalesce((select max(e.amount_mnt) from public_events e where e.funnel_key_hash = c.funnel_key_hash and e.event_name = 'payment_confirmed' and e.occurred_at >= c.occurred_at), 0) as revenue_mnt
  from cohorts c
), epochs as (
  select price_version, offer_price_mnt, count(*)::integer as paywall_exposures,
    count(*) filter (where cta)::integer as cta_clicks,
    count(*) filter (where invoice)::integer as invoices_created,
    count(*) filter (where paid)::integer as payments_confirmed,
    coalesce(sum(revenue_mnt), 0)::integer as revenue_mnt
  from funnel_outcomes group by price_version, offer_price_mnt
)
select jsonb_build_object(
  'utm_content', p_utm_content,
  'current_price_mnt', 19900,
  'current_price_version', 'p19900_v1',
  'p19900_t0', (select effective_at from cutover),
  'epochs', coalesce((select jsonb_agg(to_jsonb(e) order by offer_price_mnt) from epochs e), '[]'::jsonb)
)
$$;

revoke all on function jingeehas.get_offer_price_measurement(date, date, text) from public, anon, authenticated;
grant execute on function jingeehas.get_offer_price_measurement(date, date, text) to service_role;

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
  elsif action_name = 'get_control_measurement_base' then return jingeehas.get_control_measurement_base((request->>'start_date')::date, (request->>'end_date')::date, request->>'utm_content');
  elsif action_name = 'get_offer_price_measurement' then return jingeehas.get_offer_price_measurement((request->>'start_date')::date, (request->>'end_date')::date, request->>'utm_content');
  elsif action_name = 'record_p19900_cutover' then return jingeehas.record_p19900_cutover((request->>'effective_at')::timestamptz);
  elsif action_name = 'record_question_progress' then return jingeehas.record_question_progress(request);
  elsif action_name = 'get_question_progress_analytics' then return jingeehas.get_question_progress_analytics((request->>'start_date')::date, (request->>'end_date')::date, coalesce(nullif(request->>'now', '')::timestamptz, now()));
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

insert into jingeehas.schema_migrations(version)
values ('20260823074841_full_report_price_19900')
on conflict (version) do nothing;

commit;
