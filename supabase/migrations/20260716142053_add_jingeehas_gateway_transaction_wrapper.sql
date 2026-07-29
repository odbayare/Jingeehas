create or replace function jingeehas.execute_request(request jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  action_name text := coalesce(request->>'action', '');
  operations jsonb;
  item jsonb;
  results jsonb := '[]'::jsonb;
  should_rollback boolean := coalesce((request->>'rollback')::boolean, false);
begin
  if action_name <> 'transaction' then
    return jingeehas.execute_operation(request);
  end if;

  operations := request->'operations';
  if operations is null or jsonb_typeof(operations) <> 'array' then
    raise exception using errcode = '22023', message = 'JH_OPERATIONS_INVALID';
  end if;

  if jsonb_array_length(operations) > 50 then
    raise exception using errcode = '22023', message = 'JH_TOO_MANY_OPERATIONS';
  end if;

  if should_rollback then
    begin
      for item in select value from jsonb_array_elements(operations)
      loop
        if coalesce(item->>'action', '') = 'transaction' then
          raise exception using errcode = '22023', message = 'JH_NESTED_TRANSACTION';
        end if;
        results := results || jsonb_build_array(jingeehas.execute_operation(item));
      end loop;
      raise exception using errcode = 'P0001', message = 'JH_CERTIFICATION_ROLLBACK';
    exception
      when sqlstate 'P0001' then
        if sqlerrm <> 'JH_CERTIFICATION_ROLLBACK' then
          raise;
        end if;
    end;
    return jsonb_build_object('results', results, 'rolled_back', true);
  end if;

  for item in select value from jsonb_array_elements(operations)
  loop
    if coalesce(item->>'action', '') = 'transaction' then
      raise exception using errcode = '22023', message = 'JH_NESTED_TRANSACTION';
    end if;
    results := results || jsonb_build_array(jingeehas.execute_operation(item));
  end loop;

  return jsonb_build_object('results', results, 'rolled_back', false);
end;
$$;

revoke all on function jingeehas.execute_request(jsonb) from public, anon, authenticated;
grant execute on function jingeehas.execute_request(jsonb) to service_role;;
