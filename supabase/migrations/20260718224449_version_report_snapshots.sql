begin;

create table jingeehas.report_snapshot_versions (
  snapshot_id uuid primary key,
  assessment_id text not null references jingeehas.assessments(id) on delete restrict,
  version_number integer not null check (version_number >= 1),
  report_engine_version text not null,
  report_schema_version text not null,
  report_payload jsonb not null,
  snapshot_status text not null check (snapshot_status in ('generated', 'active', 'superseded', 'failed')),
  is_active boolean not null default false,
  generation_reason text not null,
  supersedes_snapshot_id uuid references jingeehas.report_snapshot_versions(snapshot_id) on delete restrict,
  source_legacy_assessment_id text references jingeehas.assessments(id) on delete restrict,
  created_at timestamptz not null,
  activated_at timestamptz,
  superseded_at timestamptz,
  created_by text not null,
  payload_checksum text not null check (payload_checksum ~ '^[a-f0-9]{64}$'),
  operation_key text not null unique,
  unique (assessment_id, version_number),
  check (supersedes_snapshot_id is null or supersedes_snapshot_id <> snapshot_id),
  check (
    (snapshot_status = 'generated' and not is_active and activated_at is null and superseded_at is null) or
    (snapshot_status = 'active' and is_active and activated_at is not null and superseded_at is null) or
    (snapshot_status = 'superseded' and not is_active and activated_at is not null and superseded_at is not null) or
    (snapshot_status = 'failed' and not is_active and activated_at is null)
  )
);

create unique index report_snapshot_versions_one_active_uidx
  on jingeehas.report_snapshot_versions (assessment_id) where is_active = true;
create index report_snapshot_versions_assessment_version_idx
  on jingeehas.report_snapshot_versions (assessment_id, version_number desc);
create index report_snapshot_versions_assessment_created_idx
  on jingeehas.report_snapshot_versions (assessment_id, created_at desc);
create index report_snapshot_versions_status_idx
  on jingeehas.report_snapshot_versions (snapshot_status);
create index report_snapshot_versions_engine_idx
  on jingeehas.report_snapshot_versions (report_engine_version);

alter table jingeehas.report_snapshot_versions enable row level security;
revoke all on table jingeehas.report_snapshot_versions from public, anon, authenticated;
grant select, insert, update on table jingeehas.report_snapshot_versions to service_role;

create or replace function jingeehas.report_payload_checksum(payload jsonb)
returns text
language sql
immutable
strict
set search_path = ''
as $$
  select encode(extensions.digest(convert_to(payload::text, 'UTF8'), 'sha256'), 'hex');
$$;

revoke all on function jingeehas.report_payload_checksum(jsonb) from public, anon, authenticated;
grant execute on function jingeehas.report_payload_checksum(jsonb) to service_role;

do $$
declare
  source_count integer;
  inserted_count integer;
  distinct_count integer;
  checksum_mismatch_count integer;
  legacy_before text;
  legacy_after text;
  payments_before text;
  payments_after text;
  entitlements_before text;
  entitlements_after text;
begin
  select count(*), md5(coalesce(string_agg(to_jsonb(row_value)::text, '' order by row_value.assessment_id), ''))
    into source_count, legacy_before from jingeehas.report_snapshots row_value;
  select md5(coalesce(string_agg(to_jsonb(row_value)::text, '' order by row_value.id), ''))
    into payments_before from jingeehas.payments row_value;
  select md5(coalesce(string_agg(to_jsonb(row_value)::text, '' order by row_value.id), ''))
    into entitlements_before from jingeehas.entitlements row_value;

  insert into jingeehas.report_snapshot_versions (
    snapshot_id, assessment_id, version_number, report_engine_version, report_schema_version,
    report_payload, snapshot_status, is_active, generation_reason, supersedes_snapshot_id,
    source_legacy_assessment_id, created_at, activated_at, superseded_at, created_by,
    payload_checksum, operation_key
  )
  select
    (substr(md5('jingeehas-legacy-report:' || legacy.assessment_id), 1, 8) || '-' ||
     substr(md5('jingeehas-legacy-report:' || legacy.assessment_id), 9, 4) || '-' ||
     substr(md5('jingeehas-legacy-report:' || legacy.assessment_id), 13, 4) || '-' ||
     substr(md5('jingeehas-legacy-report:' || legacy.assessment_id), 17, 4) || '-' ||
     substr(md5('jingeehas-legacy-report:' || legacy.assessment_id), 21, 12))::uuid,
    legacy.assessment_id,
    1,
    coalesce(legacy.full_report->>'version', 'legacy-unversioned'),
    'legacy-report-snapshot-v1',
    jsonb_build_object(
      'reportMode', legacy.report_mode,
      'safetyRoute', legacy.safety_route,
      'safetyProvenance', legacy.safety_provenance,
      'initialView', legacy.initial_view,
      'fullReport', legacy.full_report
    ) as payload,
    case when legacy.full_report is null or legacy.full_report->>'version' = 'jingeehas-case-formulation-v5-attribution' then 'active' else 'failed' end,
    case when legacy.full_report is null or legacy.full_report->>'version' = 'jingeehas-case-formulation-v5-attribution' then true else false end,
    case when legacy.full_report is null or legacy.full_report->>'version' = 'jingeehas-case-formulation-v5-attribution' then 'legacy_backfill' else 'legacy_backfill_failed_quality' end,
    null,
    legacy.assessment_id,
    legacy.created_at,
    case when legacy.full_report is null or legacy.full_report->>'version' = 'jingeehas-case-formulation-v5-attribution' then legacy.created_at else null end,
    null,
    'migration:20260718224449_version_report_snapshots',
    jingeehas.report_payload_checksum(jsonb_build_object(
      'reportMode', legacy.report_mode,
      'safetyRoute', legacy.safety_route,
      'safetyProvenance', legacy.safety_provenance,
      'initialView', legacy.initial_view,
      'fullReport', legacy.full_report
    )),
    'legacy-backfill:' || legacy.assessment_id
  from jingeehas.report_snapshots legacy;
  get diagnostics inserted_count = row_count;

  select count(distinct assessment_id), count(*) filter (
    where payload_checksum <> jingeehas.report_payload_checksum(report_payload)
  ) into distinct_count, checksum_mismatch_count
  from jingeehas.report_snapshot_versions
  where generation_reason in ('legacy_backfill', 'legacy_backfill_failed_quality');

  select md5(coalesce(string_agg(to_jsonb(row_value)::text, '' order by row_value.assessment_id), ''))
    into legacy_after from jingeehas.report_snapshots row_value;
  select md5(coalesce(string_agg(to_jsonb(row_value)::text, '' order by row_value.id), ''))
    into payments_after from jingeehas.payments row_value;
  select md5(coalesce(string_agg(to_jsonb(row_value)::text, '' order by row_value.id), ''))
    into entitlements_after from jingeehas.entitlements row_value;

  if source_count <> inserted_count or source_count <> distinct_count or checksum_mismatch_count <> 0 then
    raise exception using errcode = 'P0001', message = 'JH_REPORT_BACKFILL_CERTIFICATION_FAILED';
  end if;
  if legacy_before <> legacy_after or payments_before <> payments_after or entitlements_before <> entitlements_after then
    raise exception using errcode = 'P0001', message = 'JH_REPORT_BACKFILL_MUTATED_PROTECTED_DATA';
  end if;
end;
$$;

create or replace function jingeehas.get_active_report_snapshot(p_assessment_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  version_row jingeehas.report_snapshot_versions%rowtype;
  legacy_row jingeehas.report_snapshots%rowtype;
begin
  select * into version_row from jingeehas.report_snapshot_versions
  where assessment_id = p_assessment_id and is_active = true and snapshot_status = 'active'
  limit 1;
  if found then
    return version_row.report_payload || jsonb_build_object(
      'source', 'versioned', 'snapshot_id', version_row.snapshot_id,
      'version_number', version_row.version_number,
      'report_engine_version', version_row.report_engine_version,
      'report_schema_version', version_row.report_schema_version
    );
  end if;
  select * into legacy_row from jingeehas.report_snapshots where assessment_id = p_assessment_id;
  if not found then return null; end if;
  return jsonb_build_object(
    'source', 'legacy', 'snapshot_id', null, 'version_number', null,
    'report_engine_version', legacy_row.full_report->>'version', 'report_schema_version', null,
    'reportMode', legacy_row.report_mode, 'safetyRoute', legacy_row.safety_route,
    'safetyProvenance', legacy_row.safety_provenance, 'initialView', legacy_row.initial_view,
    'fullReport', legacy_row.full_report
  );
end;
$$;

create or replace function jingeehas.list_report_snapshot_versions(p_assessment_id text)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select coalesce(jsonb_agg(to_jsonb(row_value) order by row_value.version_number desc), '[]'::jsonb)
  from jingeehas.report_snapshot_versions row_value where row_value.assessment_id = p_assessment_id;
$$;

create or replace function jingeehas.get_report_snapshot_version(p_snapshot_id uuid)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select to_jsonb(row_value) from jingeehas.report_snapshot_versions row_value where row_value.snapshot_id = p_snapshot_id;
$$;

create or replace function jingeehas.create_report_snapshot_version(request jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  p_assessment_id text := request->>'assessment_id';
  p_snapshot_id uuid := (request->>'snapshot_id')::uuid;
  p_operation_key text := request->>'operation_key';
  p_payload jsonb := request->'report_payload';
  next_version integer;
  result jingeehas.report_snapshot_versions%rowtype;
begin
  if coalesce(p_assessment_id, '') = '' or coalesce(p_operation_key, '') = '' or p_payload is null then
    raise exception using errcode = '22023', message = 'JH_REPORT_VERSION_INVALID';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(p_assessment_id, 0));
  select * into result from jingeehas.report_snapshot_versions
    where assessment_id = p_assessment_id and operation_key = p_operation_key;
  if found then return to_jsonb(result); end if;
  if not exists (select 1 from jingeehas.assessments where id = p_assessment_id and status = 'complete') then
    raise exception using errcode = 'P0002', message = 'JH_COMPLETED_ASSESSMENT_NOT_FOUND';
  end if;
  select coalesce(max(version_number), 0) + 1 into next_version
  from jingeehas.report_snapshot_versions where assessment_id = p_assessment_id;
  insert into jingeehas.report_snapshot_versions (
    snapshot_id, assessment_id, version_number, report_engine_version, report_schema_version,
    report_payload, snapshot_status, is_active, generation_reason, supersedes_snapshot_id,
    source_legacy_assessment_id, created_at, activated_at, superseded_at, created_by,
    payload_checksum, operation_key
  ) values (
    p_snapshot_id, p_assessment_id, next_version, request->>'report_engine_version', request->>'report_schema_version',
    p_payload, 'generated', false, request->>'generation_reason', nullif(request->>'supersedes_snapshot_id', '')::uuid,
    nullif(request->>'source_legacy_assessment_id', ''), (request->>'created_at')::timestamptz,
    null, null, request->>'created_by', jingeehas.report_payload_checksum(p_payload), p_operation_key
  ) returning * into result;
  return to_jsonb(result);
end;
$$;

create or replace function jingeehas.activate_report_snapshot_version(p_snapshot_id uuid, p_expected_current_snapshot_id uuid, p_now timestamptz)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_assessment_id text;
  target_row jingeehas.report_snapshot_versions%rowtype;
  current_active_id uuid;
  active_count integer;
begin
  select assessment_id into target_assessment_id from jingeehas.report_snapshot_versions where snapshot_id = p_snapshot_id;
  if not found then raise exception using errcode = 'P0002', message = 'JH_REPORT_VERSION_NOT_FOUND'; end if;
  perform pg_advisory_xact_lock(hashtextextended(target_assessment_id, 0));
  perform 1 from jingeehas.report_snapshot_versions where assessment_id = target_assessment_id for update;
  select * into target_row from jingeehas.report_snapshot_versions where snapshot_id = p_snapshot_id;
  if target_row.snapshot_status = 'active' and target_row.is_active then return to_jsonb(target_row); end if;
  if target_row.snapshot_status <> 'generated' or target_row.is_active then
    raise exception using errcode = '23514', message = 'JH_REPORT_VERSION_NOT_GENERATED';
  end if;
  select snapshot_id into current_active_id from jingeehas.report_snapshot_versions
    where assessment_id = target_assessment_id and is_active = true and snapshot_status = 'active';
  if current_active_id is distinct from p_expected_current_snapshot_id then
    raise exception using errcode = '40001', message = 'JH_ACTIVE_REPORT_CHANGED';
  end if;
  update jingeehas.report_snapshot_versions set is_active = false, snapshot_status = 'superseded', superseded_at = p_now
    where assessment_id = target_assessment_id and is_active = true and snapshot_status = 'active';
  update jingeehas.report_snapshot_versions set is_active = true, snapshot_status = 'active', activated_at = p_now
    where snapshot_id = p_snapshot_id returning * into target_row;
  select count(*) into active_count from jingeehas.report_snapshot_versions where assessment_id = target_assessment_id and is_active = true;
  if active_count <> 1 then raise exception using errcode = 'P0001', message = 'JH_ACTIVE_REPORT_INVARIANT'; end if;
  return to_jsonb(target_row);
end;
$$;

revoke all on function jingeehas.get_active_report_snapshot(text) from public, anon, authenticated;
revoke all on function jingeehas.list_report_snapshot_versions(text) from public, anon, authenticated;
revoke all on function jingeehas.get_report_snapshot_version(uuid) from public, anon, authenticated;
revoke all on function jingeehas.create_report_snapshot_version(jsonb) from public, anon, authenticated;
revoke all on function jingeehas.activate_report_snapshot_version(uuid, uuid, timestamptz) from public, anon, authenticated;
grant execute on function jingeehas.get_active_report_snapshot(text) to service_role;
grant execute on function jingeehas.list_report_snapshot_versions(text) to service_role;
grant execute on function jingeehas.get_report_snapshot_version(uuid) to service_role;
grant execute on function jingeehas.create_report_snapshot_version(jsonb) to service_role;
grant execute on function jingeehas.activate_report_snapshot_version(uuid, uuid, timestamptz) to service_role;

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
  elsif action_name = 'get_active_report_snapshot' then
    return jingeehas.get_active_report_snapshot(request->>'assessment_id');
  elsif action_name = 'list_report_snapshot_versions' then
    return jingeehas.list_report_snapshot_versions(request->>'assessment_id');
  elsif action_name = 'get_report_snapshot_version' then
    return jingeehas.get_report_snapshot_version((request->>'snapshot_id')::uuid);
  elsif action_name = 'create_report_snapshot_version' then
    return jingeehas.create_report_snapshot_version(request);
  elsif action_name = 'activate_report_snapshot_version' then
    return jingeehas.activate_report_snapshot_version((request->>'snapshot_id')::uuid, nullif(request->>'expected_current_snapshot_id', '')::uuid, (request->>'now')::timestamptz);
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
end;
$$;

revoke all on function jingeehas.execute_request(jsonb) from public, anon, authenticated;
grant execute on function jingeehas.execute_request(jsonb) to service_role;

insert into jingeehas.schema_migrations(version)
values ('20260718224449_version_report_snapshots') on conflict (version) do nothing;

commit;
