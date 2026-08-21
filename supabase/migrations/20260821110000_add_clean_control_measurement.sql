begin;

set local lock_timeout = '5s';

create function jingeehas.get_control_measurement_base(
  p_start_date date,
  p_end_date date,
  p_utm_content text
)
returns jsonb language sql stable security definer set search_path = '' as $$
with bounds as (
  select p_start_date::timestamp at time zone 'Asia/Ulaanbaatar' as range_start,
    (p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar' as range_end
), excluded_funnels as (
  select distinct funnel_key_hash from jingeehas.analytics_events
  where funnel_key_hash is not null and (is_admin or is_owner_preview or is_test)
), excluded_assessments as (
  select distinct assessment_id from jingeehas.analytics_events
  where assessment_id is not null and (is_admin or is_owner_preview or is_test)
  union
  select distinct assessment_id from jingeehas.assessment_sessions where source = 'owner'
), public_events as (
  select e.* from jingeehas.analytics_events e
  where not e.is_admin and not e.is_owner_preview and not e.is_test
    and (e.funnel_key_hash is null or not exists (
      select 1 from excluded_funnels x where x.funnel_key_hash = e.funnel_key_hash
    ))
    and (e.assessment_id is null or not exists (
      select 1 from excluded_assessments x where x.assessment_id = e.assessment_id
    ))
), acquisition as (
  select distinct on (funnel_key_hash) funnel_key_hash, visitor_id_hash, utm_content, occurred_at
  from public_events
  where event_name = 'free_assessment_started' and funnel_key_hash is not null
  order by funnel_key_hash, occurred_at
), first_funnel_events as (
  select distinct on (event_name, funnel_key_hash)
    event_name, funnel_key_hash, occurred_at, amount_mnt
  from public_events
  where funnel_key_hash is not null and event_name in (
    'free_assessment_started', 'free_assessment_completed', 'post_assessment_paywall_viewed',
    'full_report_cta_clicked', 'invoice_created', 'payment_confirmed'
  )
  order by event_name, funnel_key_hash, occurred_at
), clean_landings as (
  select distinct on (e.visitor_id_hash) e.visitor_id_hash, e.occurred_at
  from public_events e cross join bounds b
  where e.event_name = 'landing_viewed' and e.visitor_id_hash is not null
    and e.utm_content = p_utm_content
    and e.occurred_at >= b.range_start and e.occurred_at < b.range_end
  order by e.visitor_id_hash, e.occurred_at
), clean_stages as (
  select f.* from first_funnel_events f
  join acquisition a using (funnel_key_hash) cross join bounds b
  where a.utm_content = p_utm_content
    and f.occurred_at >= b.range_start and f.occurred_at < b.range_end
), clean_completions as (
  select f.funnel_key_hash, f.occurred_at
  from clean_stages f where f.event_name = 'free_assessment_completed'
), completed_funnels as (
  select c.funnel_key_hash,
    exists (select 1 from first_funnel_events e cross join bounds b
      where e.funnel_key_hash = c.funnel_key_hash and e.event_name = 'post_assessment_paywall_viewed'
        and e.occurred_at >= c.occurred_at and e.occurred_at < b.range_end) as paywall_confirmed,
    exists (select 1 from first_funnel_events e cross join bounds b
      where e.funnel_key_hash = c.funnel_key_hash and e.event_name = 'full_report_cta_clicked'
        and e.occurred_at >= c.occurred_at and e.occurred_at < b.range_end) as paywall_cta,
    exists (select 1 from first_funnel_events e cross join bounds b
      where e.funnel_key_hash = c.funnel_key_hash and e.event_name = 'invoice_created'
        and e.occurred_at >= c.occurred_at and e.occurred_at < b.range_end) as invoice_created,
    exists (select 1 from first_funnel_events e cross join bounds b
      where e.funnel_key_hash = c.funnel_key_hash and e.event_name = 'payment_confirmed'
        and e.occurred_at >= c.occurred_at and e.occurred_at < b.range_end) as provider_confirmed_paid
  from clean_completions c
), linked_visitors as (
  select distinct l.visitor_id_hash
  from clean_landings l cross join bounds b
  where exists (
    select 1 from acquisition a
    where a.utm_content = p_utm_content and a.visitor_id_hash = l.visitor_id_hash
      and a.occurred_at >= l.occurred_at and a.occurred_at < b.range_end
  )
), first_post_cutover_landings as (
  select distinct on (e.visitor_id_hash) e.visitor_id_hash, e.occurred_at
  from public_events e
  where e.event_name = 'landing_viewed' and e.visitor_id_hash is not null
    and e.occurred_at >= (
      select cutover_at from jingeehas.analytics_flow_cutovers
      where flow_version = 'free_assessment_postpaid_v1'
    )
  order by e.visitor_id_hash, e.occurred_at
), range_landings as (
  select e.* from public_events e cross join bounds b
  where e.event_name = 'landing_viewed' and e.visitor_id_hash is not null
    and e.occurred_at >= b.range_start and e.occurred_at < b.range_end
), range_attribution_pairs as (
  select distinct visitor_id_hash, coalesce(utm_source, ''), coalesce(utm_medium, ''),
    coalesce(utm_campaign, ''), coalesce(utm_content, ''), coalesce(utm_term, '')
  from range_landings
), visitor_reconciliation as (
  select
    (select count(*) from first_post_cutover_landings f cross join bounds b
      where f.occurred_at >= b.range_start and f.occurred_at < b.range_end) as first_time_visitors,
    (select count(distinct visitor_id_hash) from range_landings) as any_range_visitors,
    (select count(*) from range_attribution_pairs) as attribution_pairs
)
select jsonb_build_object(
  'utm_content', p_utm_content,
  'visitors', (select count(*) from clean_landings),
  'linked_visitor_starts', (select count(*) from linked_visitors),
  'assessments_started', (select count(*) from clean_stages where event_name = 'free_assessment_started'),
  'assessments_completed', (select count(*) from clean_completions),
  'paywall_confirmed', (select count(*) from clean_stages where event_name = 'post_assessment_paywall_viewed'),
  'paywall_cta', (select count(*) from clean_stages where event_name = 'full_report_cta_clicked'),
  'invoices_created', (select count(*) from clean_stages where event_name = 'invoice_created'),
  'provider_confirmed_paid', (select count(*) from clean_stages where event_name = 'payment_confirmed'),
  'merchant_settled_paid', null,
  'revenue_mnt', (select coalesce(sum(amount_mnt), 0) from clean_stages where event_name = 'payment_confirmed'),
  'completed_funnels', coalesce((select jsonb_agg(to_jsonb(c.*) order by c.funnel_key_hash) from completed_funnels c), '[]'::jsonb),
  'visitor_reconciliation', (select jsonb_build_object(
    'first_time_visitors', first_time_visitors,
    'any_range_visitors', any_range_visitors,
    'attribution_pairs', attribution_pairs,
    'returning_visitors', greatest(any_range_visitors - first_time_visitors, 0),
    'duplicate_attribution_pairs', greatest(attribution_pairs - any_range_visitors, 0)
  ) from visitor_reconciliation)
)
$$;

revoke all on function jingeehas.get_control_measurement_base(date, date, text) from public, anon, authenticated;
grant execute on function jingeehas.get_control_measurement_base(date, date, text) to service_role;

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
values ('20260821110000_add_clean_control_measurement')
on conflict (version) do nothing;

commit;
