begin;

-- Route the independent hourly aggregate through the existing private gateway.
-- The daily funnel function is intentionally not replaced or called here.
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
values ('20260722160108_route_landing_hourly_rpc')
on conflict (version) do nothing;

commit;
