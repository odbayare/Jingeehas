-- Preserve the existing RPC contract and privileges while removing an
-- ambiguous PL/pgSQL identifier that prevented update and upsert operations.
create or replace function jingeehas.execute_operation(op jsonb)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  action_name text := coalesce(op->>'action', '');
  target_table text := coalesce(op->>'table', '');
  record_id text := op->>'id';
  payload jsonb;
  filters jsonb;
  result jsonb;
  set_clause text;
  deleted_ok boolean := false;
  allowed_tables constant text[] := array[
    'sessions','assessment_sessions','safety_checks','assessments','assessment_answers','assessment_summaries',
    'report_snapshots','payments','entitlements','recovery_contacts','advisor_accounts','advisor_sessions',
    'advisor_clients','advisor_commissions','advisor_report_access_logs','admin_accounts','admin_sessions',
    'admin_audit_logs','recovery_challenges','data_deletion_requests','schema_migrations','certification_records'
  ];
begin
  if not (target_table = any(allowed_tables)) then
    raise exception using errcode = '22023', message = 'JH_UNKNOWN_TABLE';
  end if;

  if action_name = 'get' then
    if record_id is null or record_id = '' then
      raise exception using errcode = '22023', message = 'JH_ID_REQUIRED';
    end if;
    execute format('select to_jsonb(t) from jingeehas.%I t where t.id = $1', target_table)
      into result using record_id;
    return result;

  elsif action_name = 'find' then
    filters := coalesce(op->'filters', '{}'::jsonb);
    if jsonb_typeof(filters) <> 'object' then
      raise exception using errcode = '22023', message = 'JH_FILTERS_INVALID';
    end if;
    execute format(
      'select coalesce(jsonb_agg(to_jsonb(t)), ''[]''::jsonb) from jingeehas.%I t where to_jsonb(t) @> $1',
      target_table
    ) into result using filters;
    return result;

  elsif action_name = 'insert' then
    payload := op->'row';
    if payload is null or jsonb_typeof(payload) <> 'object' or coalesce(payload->>'id','') = '' then
      raise exception using errcode = '22023', message = 'JH_ROW_INVALID';
    end if;
    begin
      execute format(
        'insert into jingeehas.%I as t select * from jsonb_populate_record(null::jingeehas.%I, $1) returning to_jsonb(t)',
        target_table, target_table
      ) into result using payload;
    exception when unique_violation then
      raise exception using errcode = '23505', message = 'JH_CONFLICT';
    end;
    return result;

  elsif action_name = 'update' then
    payload := coalesce(op->'patch', '{}'::jsonb) - 'id';
    if record_id is null or record_id = '' then
      raise exception using errcode = '22023', message = 'JH_ID_REQUIRED';
    end if;
    select string_agg(format('%I = (jsonb_populate_record(null::jingeehas.%I, $1)).%I', key, target_table, key), ', ')
      into set_clause
    from jsonb_object_keys(payload) as key
    where exists (
      select 1 from information_schema.columns c
      where c.table_schema = 'jingeehas' and c.table_name = target_table and c.column_name = key and key <> 'id'
    );
    if set_clause is null then
      execute format('select to_jsonb(t) from jingeehas.%I t where t.id = $1', target_table)
        into result using record_id;
    else
      execute format('update jingeehas.%I as t set %s where t.id = $2 returning to_jsonb(t)', target_table, set_clause)
        into result using payload, record_id;
    end if;
    if result is null then
      raise exception using errcode = 'P0002', message = 'JH_NOT_FOUND';
    end if;
    return result;

  elsif action_name = 'upsert' then
    record_id := coalesce(record_id, op->'row'->>'id');
    if record_id is null or record_id = '' then
      raise exception using errcode = '22023', message = 'JH_ID_REQUIRED';
    end if;
    execute format('select to_jsonb(t) from jingeehas.%I t where t.id = $1', target_table)
      into result using record_id;
    if result is null then
      payload := coalesce(op->'row', '{}'::jsonb) || jsonb_build_object('id', record_id);
      begin
        execute format(
          'insert into jingeehas.%I as t select * from jsonb_populate_record(null::jingeehas.%I, $1) returning to_jsonb(t)',
          target_table, target_table
        ) into result using payload;
      exception when unique_violation then
        raise exception using errcode = '23505', message = 'JH_CONFLICT';
      end;
      return result;
    end if;
    payload := coalesce(op->'row', '{}'::jsonb) - 'id';
    select string_agg(format('%I = (jsonb_populate_record(null::jingeehas.%I, $1)).%I', key, target_table, key), ', ')
      into set_clause
    from jsonb_object_keys(payload) as key
    where exists (
      select 1 from information_schema.columns c
      where c.table_schema = 'jingeehas' and c.table_name = target_table and c.column_name = key and key <> 'id'
    );
    if set_clause is null then
      return result;
    end if;
    execute format('update jingeehas.%I as t set %s where t.id = $2 returning to_jsonb(t)', target_table, set_clause)
      into result using payload, record_id;
    return result;

  elsif action_name = 'delete' then
    if record_id is null or record_id = '' then
      raise exception using errcode = '22023', message = 'JH_ID_REQUIRED';
    end if;
    execute format('delete from jingeehas.%I where id = $1 returning true', target_table)
      into deleted_ok using record_id;
    return jsonb_build_object('deleted', coalesce(deleted_ok, false));
  end if;

  raise exception using errcode = '22023', message = 'JH_UNKNOWN_ACTION';
end;
$function$;
