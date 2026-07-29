begin;

create table if not exists jingeehas.access_handoffs (
  id text primary key,
  assessment_id text not null references jingeehas.assessments(id) on delete cascade,
  payment_id text not null unique references jingeehas.payments(id) on delete cascade,
  origin_session_id text not null references jingeehas.sessions(id) on delete restrict,
  product_code text not null check (product_code = 'WEIGHT_TEST_ONE_TIME'),
  token_hash text not null unique,
  encrypted_token text not null,
  code_hash text not null unique,
  encrypted_code text not null,
  expires_at timestamptz not null,
  redeemed_at timestamptz,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  check (expires_at > created_at)
);
create index if not exists access_handoffs_assessment_idx on jingeehas.access_handoffs(assessment_id);
create index if not exists access_handoffs_expiry_idx on jingeehas.access_handoffs(expires_at) where redeemed_at is null;
alter table jingeehas.access_handoffs enable row level security;
revoke all on table jingeehas.access_handoffs from public, anon, authenticated;
grant select, insert, update on table jingeehas.access_handoffs to service_role;

create table if not exists jingeehas.qpay_callback_rate_limits (
  id text primary key,
  key_hash text not null,
  key_kind text not null check (key_kind in ('payment_id', 'source_ip', 'handoff_token', 'handoff_ip')),
  window_start timestamptz not null,
  lookup_count integer not null default 0 check (lookup_count >= 0),
  expires_at timestamptz not null,
  created_at timestamptz not null,
  unique (key_hash, key_kind, window_start)
);
create index if not exists qpay_callback_rate_limits_expiry_idx on jingeehas.qpay_callback_rate_limits(expires_at);
alter table jingeehas.qpay_callback_rate_limits enable row level security;
revoke all on table jingeehas.qpay_callback_rate_limits from public, anon, authenticated;
grant select, insert, update on table jingeehas.qpay_callback_rate_limits to service_role;

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
  insert into jingeehas.qpay_callback_rate_limits(id, key_hash, key_kind, window_start, lookup_count, expires_at, created_at)
  values (row_id, p_key_hash, p_key_kind, bucket, 1, bucket + interval '5 minutes', p_now)
  on conflict (key_hash, key_kind, window_start) do update set lookup_count = jingeehas.qpay_callback_rate_limits.lookup_count + 1;
  select lookup_count into current_count from jingeehas.qpay_callback_rate_limits where id = row_id;
  return jsonb_build_object('allowed', current_count <= p_limit, 'count', current_count);
end;
$$;
revoke all on function jingeehas.consume_qpay_callback_rate_limit(text,text,integer,timestamptz) from public, anon, authenticated;
grant execute on function jingeehas.consume_qpay_callback_rate_limit(text,text,integer,timestamptz) to service_role;

create or replace function jingeehas.consume_access_handoff(p_token_hash text, p_now timestamptz default now())
returns jsonb language plpgsql security definer set search_path = '' as $$
declare consumed jsonb;
begin
  update jingeehas.access_handoffs
  set redeemed_at = p_now, updated_at = p_now
  where token_hash = p_token_hash and redeemed_at is null and expires_at > p_now
  returning to_jsonb(access_handoffs.*) into consumed;
  return coalesce(consumed, '{}'::jsonb);
end;
$$;
revoke all on function jingeehas.consume_access_handoff(text,timestamptz) from public, anon, authenticated;
grant execute on function jingeehas.consume_access_handoff(text,timestamptz) to service_role;

create or replace function jingeehas.create_access_handoff(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare created jsonb;
begin
  insert into jingeehas.access_handoffs as row_value
  select * from jsonb_populate_record(null::jingeehas.access_handoffs, p_payload)
  returning to_jsonb(row_value.*) into created;
  return created;
end;
$$;
revoke all on function jingeehas.create_access_handoff(jsonb) from public, anon, authenticated;
grant execute on function jingeehas.create_access_handoff(jsonb) to service_role;

create or replace function jingeehas.get_access_handoff_by_payment(p_payment_id text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce((select to_jsonb(row_value.*) from jingeehas.access_handoffs row_value where payment_id = p_payment_id), '{}'::jsonb);
$$;
revoke all on function jingeehas.get_access_handoff_by_payment(text) from public, anon, authenticated;
grant execute on function jingeehas.get_access_handoff_by_payment(text) to service_role;

create or replace function public.jingeehas_consume_qpay_callback_rate_limit(p_key_hash text, p_key_kind text, p_limit integer, p_now timestamptz default now()) returns jsonb language sql security definer set search_path = '' as $$ select jingeehas.consume_qpay_callback_rate_limit(p_key_hash,p_key_kind,p_limit,p_now); $$;
create or replace function public.jingeehas_create_access_handoff(p_payload jsonb) returns jsonb language sql security definer set search_path = '' as $$ select jingeehas.create_access_handoff(p_payload); $$;
create or replace function public.jingeehas_get_access_handoff_by_payment(p_payment_id text) returns jsonb language sql security definer set search_path = '' as $$ select jingeehas.get_access_handoff_by_payment(p_payment_id); $$;
create or replace function public.jingeehas_consume_access_handoff(p_token_hash text, p_now timestamptz default now()) returns jsonb language sql security definer set search_path = '' as $$ select jingeehas.consume_access_handoff(p_token_hash,p_now); $$;
revoke all on function public.jingeehas_consume_qpay_callback_rate_limit(text,text,integer,timestamptz), public.jingeehas_create_access_handoff(jsonb), public.jingeehas_get_access_handoff_by_payment(text), public.jingeehas_consume_access_handoff(text,timestamptz) from public, anon, authenticated;
grant execute on function public.jingeehas_consume_qpay_callback_rate_limit(text,text,integer,timestamptz), public.jingeehas_create_access_handoff(jsonb), public.jingeehas_get_access_handoff_by_payment(text), public.jingeehas_consume_access_handoff(text,timestamptz) to service_role;

create or replace function jingeehas.cta_event_allowed(p_event_name text, p_occurred_at timestamptz)
returns boolean language sql immutable as $$
  select (p_event_name = 'landing_cta_clicked' and p_occurred_at >= timestamptz '2026-07-23T08:48:03.740Z')
      or (p_event_name = 'start_cta_clicked' and p_occurred_at < timestamptz '2026-07-23T08:48:03.740Z');
$$;
revoke all on function jingeehas.cta_event_allowed(text,timestamptz) from public, anon, authenticated;
grant execute on function jingeehas.cta_event_allowed(text,timestamptz) to service_role;

insert into jingeehas.schema_migrations(version)
values ('20260727062535_qpay_refresh_callback_handoff_cta_boundary')
on conflict (version) do nothing;

commit;
