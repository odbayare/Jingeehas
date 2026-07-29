begin;

create or replace function jingeehas.get_admin_paid_first_funnel_analytics(
  p_start_date date,
  p_end_date date
)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
with bounds as (
  select
    p_start_date::timestamp at time zone 'Asia/Ulaanbaatar' as range_start,
    (p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar' as range_end
), excluded_assessments as (
  select distinct assessment_id
  from jingeehas.analytics_events
  where assessment_id is not null and (is_admin or is_owner_preview or is_test)
  union
  select distinct assessment_id
  from jingeehas.assessment_sessions
  where source = 'owner'
), public_events as (
  select e.*
  from jingeehas.analytics_events e
  cross join bounds b
  where not e.is_admin and not e.is_owner_preview and not e.is_test
    and e.occurred_at >= b.range_start and e.occurred_at < b.range_end
), cta_sessions as (
  select distinct session_id_hash
  from public_events
  where event_name = 'landing_cta_clicked' and session_id_hash is not null
), preparation_sessions as (
  select distinct session_id_hash
  from public_events
  where event_name = 'payment_preparation_viewed' and session_id_hash is not null
), cohort as (
  select
    (select count(distinct visitor_id_hash) from public_events where event_name = 'landing_viewed' and visitor_id_hash is not null) as eligible_visitors,
    (select count(*) from cta_sessions) as cta_sessions,
    (select count(*) from preparation_sessions) as preparation_sessions,
    (select count(*) from cta_sessions c where exists (select 1 from preparation_sessions p where p.session_id_hash = c.session_id_hash)) as cta_to_preparation_sessions,
    (select count(*) from preparation_sessions p where not exists (select 1 from cta_sessions c where c.session_id_hash = p.session_id_hash)) as direct_preparation_sessions
), eligible_assessments as (
  select a.*
  from jingeehas.assessments a
  where not exists (select 1 from excluded_assessments x where x.assessment_id = a.id)
), operational as (
  select
    count(*) filter (where a.commercial_flow_version = 'prepaid_v2' and a.status = 'payment_pending') as payment_pending_assessments,
    count(*) filter (where p.product_code = 'WEIGHT_TEST_ONE_TIME' and p.status = 'pending' and p.expires_at > now()) as active_pending_invoices,
    count(*) filter (where p.product_code = 'WEIGHT_TEST_ONE_TIME' and p.paid_at is null and (p.status in ('expired','cancelled') or (p.status = 'pending' and p.expires_at <= now()))) as expired_unpaid_invoices,
    count(distinct p.id) filter (where p.product_code = 'WEIGHT_TEST_ONE_TIME' and p.status = 'paid') as confirmed_payments,
    count(distinct e.id) filter (where e.product_code = 'WEIGHT_TEST_ONE_TIME' and e.status = 'active') as active_entitlements,
    coalesce(sum(p.amount) filter (where p.product_code = 'WEIGHT_TEST_ONE_TIME' and p.status = 'paid' and e.status = 'active'), 0) as revenue_mnt
  from eligible_assessments a
  left join jingeehas.payments p on p.assessment_id = a.id
  left join jingeehas.entitlements e on e.payment_id = p.id
), daily as (
  select jsonb_agg(jsonb_build_object(
    'date', d.day,
    'new_visitors', (select count(distinct visitor_id_hash) from public_events where event_name = 'landing_viewed' and visitor_id_hash is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'cta_sessions', (select count(distinct session_id_hash) from public_events where event_name = 'landing_cta_clicked' and session_id_hash is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'preparation_sessions', (select count(distinct session_id_hash) from public_events where event_name = 'payment_preparation_viewed' and session_id_hash is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'invoices_created', (select count(distinct p.invoice_id) from jingeehas.payments p join eligible_assessments a on a.id = p.assessment_id where p.invoice_id is not null and (p.created_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'payments_confirmed', (select count(distinct p.id) from jingeehas.payments p join jingeehas.entitlements e on e.payment_id = p.id join eligible_assessments a on a.id = p.assessment_id where p.status = 'paid' and e.status = 'active' and (e.granted_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'assessments_started', (select count(distinct a.id) from eligible_assessments a where (case when a.commercial_flow_version = 'prepaid_v2' then a.started_at else a.created_at end at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'assessments_completed', (select count(distinct a.id) from eligible_assessments a where a.status = 'complete' and (a.completed_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'reports_opened', (select count(distinct assessment_id) from public_events where event_name = 'report_opened' and assessment_id is not null and (occurred_at at time zone 'Asia/Ulaanbaatar')::date = d.day),
    'revenue_mnt', (select coalesce(sum(p.amount), 0) from jingeehas.payments p join jingeehas.entitlements e on e.payment_id = p.id join eligible_assessments a on a.id = p.assessment_id where p.status = 'paid' and e.status = 'active' and (e.granted_at at time zone 'Asia/Ulaanbaatar')::date = d.day)
  ) order by d.day) as rows
  from generate_series(p_start_date, p_end_date, interval '1 day') d(day)
)
select jsonb_build_object(
  'landing', jsonb_build_object(
    'eligible_visitors', cohort.eligible_visitors,
    'cta_sessions', cohort.cta_sessions,
    'preparation_sessions', cohort.preparation_sessions,
    'cta_to_preparation_sessions', cohort.cta_to_preparation_sessions,
    'direct_preparation_sessions', cohort.direct_preparation_sessions
  ),
  'operational', to_jsonb(operational),
  'daily', coalesce(daily.rows, '[]'::jsonb)
)
from cohort cross join operational cross join daily
$$;

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
  elsif action_name = 'get_landing_cutover_hourly_analytics' then return jingeehas.get_landing_cutover_hourly_analytics((request->>'start_date')::date, (request->>'end_date')::date);
  elsif action_name = 'get_admin_paid_first_funnel_analytics' then return jingeehas.get_admin_paid_first_funnel_analytics((request->>'start_date')::date, (request->>'end_date')::date);
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

revoke all on function jingeehas.get_admin_paid_first_funnel_analytics(date, date) from public, anon, authenticated;
grant execute on function jingeehas.get_admin_paid_first_funnel_analytics(date, date) to service_role;

insert into jingeehas.schema_migrations(version)
values ('20260725153009_admin_paid_first_funnel_analytics')
on conflict (version) do nothing;

commit;
