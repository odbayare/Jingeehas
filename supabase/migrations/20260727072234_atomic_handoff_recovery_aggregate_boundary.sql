begin;

-- Atomic handoff redemption: session, recovery link, and consumption commit together.
create or replace function jingeehas.redeem_access_handoff(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  handoff jingeehas.access_handoffs%rowtype;
  session_row jingeehas.sessions%rowtype;
  now_at timestamptz := coalesce((p_payload->>'now')::timestamptz, now());
  token_hash_value text := nullif(p_payload->>'token_hash','');
  code_hash_value text := nullif(p_payload->>'code_hash','');
begin
  select * into handoff from jingeehas.access_handoffs
  where redeemed_at is null and expires_at > now_at
    and ((token_hash_value is not null and token_hash = token_hash_value)
      or (code_hash_value is not null and code_hash = code_hash_value))
  for update;
  if not found then return '{}'::jsonb; end if;
  insert into jingeehas.sessions(id, token_hash, created_at, expires_at, revoked_at)
  values ((p_payload->'session_row'->>'id'), (p_payload->'session_row'->>'token_hash'),
    (p_payload->'session_row'->>'created_at')::timestamptz, (p_payload->'session_row'->>'expires_at')::timestamptz, null)
  returning * into session_row;
  insert into jingeehas.assessment_sessions(id, assessment_id, session_id, source, created_at)
  values (handoff.assessment_id || ':' || session_row.id, handoff.assessment_id, session_row.id, 'recovery', now_at);
  update jingeehas.access_handoffs set redeemed_at = now_at, updated_at = now_at where id = handoff.id;
  return jsonb_build_object('assessment_id', handoff.assessment_id, 'session_id', session_row.id, 'expires_at', session_row.expires_at);
end;
$$;
revoke all on function jingeehas.redeem_access_handoff(jsonb) from public, anon, authenticated;
grant execute on function jingeehas.redeem_access_handoff(jsonb) to service_role;

create or replace function jingeehas.consume_qpay_callback_rate_limit(
  p_key_hash text, p_key_kind text, p_limit integer, p_now timestamptz default now()
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  bucket timestamptz := to_timestamp(floor(extract(epoch from p_now) / 300) * 300);
  row_id text := p_key_kind || ':' || p_key_hash || ':' || extract(epoch from bucket)::bigint;
  current_count integer;
begin
  if p_key_hash !~ '^[0-9a-f]{64}$' or p_key_kind not in ('payment_id','source_ip','handoff_token','handoff_ip') or p_limit < 1 then
    return jsonb_build_object('allowed', false, 'count', 0);
  end if;
  delete from jingeehas.qpay_callback_rate_limits where expires_at <= p_now;
  insert into jingeehas.qpay_callback_rate_limits(id, key_hash, key_kind, window_start, lookup_count, expires_at, created_at)
  values (row_id, p_key_hash, p_key_kind, bucket, 1, bucket + interval '5 minutes', p_now)
  on conflict (key_hash, key_kind, window_start) do update set lookup_count = jingeehas.qpay_callback_rate_limits.lookup_count + 1;
  select lookup_count into current_count from jingeehas.qpay_callback_rate_limits where id = row_id;
  return jsonb_build_object('allowed', current_count <= p_limit, 'count', current_count);
end;
$$;
revoke all on function jingeehas.consume_qpay_callback_rate_limit(text,text,integer,timestamptz) from public, anon, authenticated;
grant execute on function jingeehas.consume_qpay_callback_rate_limit(text,text,integer,timestamptz) to service_role;

create or replace function public.jingeehas_redeem_access_handoff(p_payload jsonb)
returns jsonb language sql security definer set search_path = '' as $$ select jingeehas.redeem_access_handoff(p_payload); $$;
revoke all on function public.jingeehas_redeem_access_handoff(jsonb) from public, anon, authenticated;
grant execute on function public.jingeehas_redeem_access_handoff(jsonb) to service_role;

-- Rewrite the already-deployed aggregate definitions without duplicating their
-- long report JSON contract. Every CTA predicate is cutover-aware.
do $$
declare
  function_def text;
  replacement text := '((event_name = ''landing_cta_clicked'' and jingeehas.cta_event_allowed(event_name, occurred_at)) or (event_name = ''start_cta_clicked'' and jingeehas.cta_event_allowed(event_name, occurred_at)))';
begin
  select pg_get_functiondef(p.oid) into function_def
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'jingeehas' and p.proname = 'get_admin_paid_first_funnel_analytics'
    and pg_get_function_identity_arguments(p.oid) = 'p_start_date date, p_end_date date';
  if function_def is null then raise exception 'admin funnel aggregate is missing'; end if;
  function_def := replace(function_def, 'event_name in (''landing_cta_clicked'',''start_cta_clicked'')', replacement);
  function_def := replace(function_def, 'event_name in (''landing_cta_clicked'', ''start_cta_clicked'')', replacement);
  execute function_def;

  select pg_get_functiondef(p.oid) into function_def
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'jingeehas' and p.proname = 'get_landing_cutover_hourly_analytics'
    and pg_get_function_identity_arguments(p.oid) = 'p_start_date date, p_end_date date';
  if function_def is null then raise exception 'hourly aggregate is missing'; end if;
  function_def := replace(function_def, 'event_name in (''landing_cta_clicked'',''start_cta_clicked'')', replacement);
  function_def := replace(function_def, 'event_name in (''landing_cta_clicked'', ''start_cta_clicked'')', replacement);
  execute function_def;
end;
$$;

insert into jingeehas.schema_migrations(version)
values ('20260727072234_atomic_handoff_recovery_aggregate_boundary')
on conflict (version) do nothing;
commit;
