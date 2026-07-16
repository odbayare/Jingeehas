begin;

alter table jingeehas.recovery_challenges
  add column contact_rate_key text,
  add column ip_rate_key text,
  add column session_rate_key text,
  add column contact_cooldown_key text,
  add column ip_cooldown_key text,
  add column session_cooldown_key text;

update jingeehas.recovery_challenges
set contact_rate_key = rate_key,
    ip_rate_key = md5('legacy-ip:' || id),
    session_rate_key = md5('legacy-session:' || id),
    contact_cooldown_key = md5('legacy-contact:' || id),
    ip_cooldown_key = md5('legacy-ip-cooldown:' || id),
    session_cooldown_key = md5('legacy-session-cooldown:' || id)
where contact_rate_key is null;

alter table jingeehas.recovery_challenges
  alter column contact_rate_key set not null,
  alter column ip_rate_key set not null,
  alter column session_rate_key set not null,
  alter column contact_cooldown_key set not null,
  alter column ip_cooldown_key set not null,
  alter column session_cooldown_key set not null;

create index recovery_challenges_contact_rate_idx on jingeehas.recovery_challenges (contact_rate_key, created_at desc);
create index recovery_challenges_ip_rate_idx on jingeehas.recovery_challenges (ip_rate_key, created_at desc);
create index recovery_challenges_session_rate_idx on jingeehas.recovery_challenges (session_rate_key, created_at desc);
create unique index recovery_challenges_contact_cooldown_uidx on jingeehas.recovery_challenges (contact_cooldown_key);
create unique index recovery_challenges_ip_cooldown_uidx on jingeehas.recovery_challenges (ip_cooldown_key);
create unique index recovery_challenges_session_cooldown_uidx on jingeehas.recovery_challenges (session_cooldown_key);

create or replace function jingeehas.consume_recovery_challenge(p_id text, p_code_hash text, p_now timestamptz)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  challenge jingeehas.recovery_challenges%rowtype;
begin
  select * into challenge
  from jingeehas.recovery_challenges
  where id = p_id
  for update;

  if not found or challenge.used_at is not null or challenge.contact_id is null or
     challenge.attempts >= 5 or challenge.expires_at <= p_now then
    return null;
  end if;

  if challenge.code_hash <> p_code_hash then
    update jingeehas.recovery_challenges
    set attempts = least(5, attempts + 1)
    where id = p_id;
    return null;
  end if;

  update jingeehas.recovery_challenges
  set used_at = p_now
  where id = p_id
  returning * into challenge;

  return to_jsonb(challenge);
end;
$$;

revoke all on function jingeehas.consume_recovery_challenge(text, text, timestamptz) from public, anon, authenticated;

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
  if action_name = 'consume_recovery_challenge' then
    if coalesce(request->>'id', '') = '' or coalesce(request->>'codeHash', '') = '' or coalesce(request->>'now', '') = '' then
      raise exception using errcode = '22023', message = 'JH_RECOVERY_CONSUME_INVALID';
    end if;
    return jingeehas.consume_recovery_challenge(request->>'id', request->>'codeHash', (request->>'now')::timestamptz);
  end if;

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
    exception when sqlstate 'P0001' then
      if sqlerrm <> 'JH_CERTIFICATION_ROLLBACK' then raise; end if;
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
grant execute on function jingeehas.execute_request(jsonb) to service_role;

insert into jingeehas.schema_migrations (version)
values ('20260716172640_harden_email_recovery_rate_limits')
on conflict (version) do nothing;

commit;
