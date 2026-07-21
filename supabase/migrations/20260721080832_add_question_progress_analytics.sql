begin;

alter table jingeehas.assessments add column if not exists questionnaire_version text;
update jingeehas.assessments set questionnaire_version = 'jingeehas-production-2026-07' where questionnaire_version is null;
alter table jingeehas.assessments alter column questionnaire_version set default 'jingeehas-production-2026-07';
alter table jingeehas.assessments alter column questionnaire_version set not null;

create table if not exists jingeehas.assessment_question_progress (
  assessment_id text not null references jingeehas.assessments(id) on delete cascade,
  questionnaire_version text not null,
  question_id text not null,
  section_key text,
  question_order integer check (question_order is null or question_order > 0),
  branch_depth integer check (branch_depth is null or branch_depth >= 0),
  first_viewed_at timestamptz not null,
  last_viewed_at timestamptz not null,
  answered_at timestamptz,
  source text not null default 'live' check (source in ('live', 'canonical_answer_backfill')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (assessment_id, questionnaire_version, question_id),
  check (last_viewed_at >= first_viewed_at),
  check (answered_at is null or answered_at >= first_viewed_at),
  check (updated_at >= created_at)
);

alter table jingeehas.assessment_question_progress enable row level security;
revoke all on table jingeehas.assessment_question_progress from public, anon, authenticated;

create index if not exists assessment_question_progress_assessment_idx on jingeehas.assessment_question_progress (assessment_id);
create index if not exists assessment_question_progress_last_viewed_idx on jingeehas.assessment_question_progress (last_viewed_at desc);
create index if not exists assessment_question_progress_answered_idx on jingeehas.assessment_question_progress (answered_at) where answered_at is not null;
create index if not exists assessment_question_progress_question_idx on jingeehas.assessment_question_progress (questionnaire_version, question_id);

create or replace function jingeehas.record_question_progress(payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb; viewed_at timestamptz := (payload->>'viewed_at')::timestamptz;
begin
  if coalesce(payload->>'assessment_id', '') = '' or coalesce(payload->>'questionnaire_version', '') = ''
    or coalesce(payload->>'question_id', '') = '' or viewed_at is null then
    raise exception using errcode = '22023', message = 'JH_QUESTION_PROGRESS_INVALID';
  end if;
  insert into jingeehas.assessment_question_progress as progress (
    assessment_id, questionnaire_version, question_id, section_key, question_order, branch_depth,
    first_viewed_at, last_viewed_at, answered_at, source, created_at, updated_at
  ) values (
    payload->>'assessment_id', payload->>'questionnaire_version', payload->>'question_id', nullif(payload->>'section_key', ''),
    nullif(payload->>'question_order', '')::integer, coalesce(nullif(payload->>'branch_depth', '')::integer, 0),
    viewed_at, viewed_at, case when coalesce((payload->>'answered')::boolean, false) then viewed_at else null end,
    coalesce(nullif(payload->>'source', ''), 'live'), viewed_at, viewed_at
  )
  on conflict (assessment_id, questionnaire_version, question_id) do update set
    last_viewed_at = greatest(progress.last_viewed_at, excluded.last_viewed_at),
    answered_at = coalesce(progress.answered_at, excluded.answered_at),
    section_key = coalesce(excluded.section_key, progress.section_key),
    question_order = coalesce(excluded.question_order, progress.question_order),
    branch_depth = coalesce(excluded.branch_depth, progress.branch_depth),
    updated_at = greatest(progress.updated_at, excluded.updated_at)
  returning to_jsonb(progress.*) into result;
  return result;
end $$;

create or replace function jingeehas.get_question_progress_analytics(p_start_date date, p_end_date date, p_now timestamptz default now())
returns jsonb language sql stable security definer set search_path = '' as $$
with excluded_assessments as (
  select distinct assessment_id from jingeehas.analytics_events
  where assessment_id is not null and (is_admin or is_owner_preview or is_test)
  union
  select distinct assessment_id from jingeehas.assessment_sessions where source = 'owner'
), cohort as (
  select a.* from jingeehas.assessments a
  where a.created_at >= (p_start_date::timestamp at time zone 'Asia/Ulaanbaatar')
    and a.created_at < ((p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar')
    and a.id not in (select assessment_id from excluded_assessments)
), progress as (
  select p.* from jingeehas.assessment_question_progress p join cohort c on c.id = p.assessment_id
), assessment_activity as (
  select c.id, c.status, greatest(c.updated_at, coalesce(max(p.last_viewed_at), c.updated_at)) as last_activity
  from cohort c left join progress p on p.assessment_id = c.id group by c.id, c.status, c.updated_at
), last_progress as (
  select distinct on (p.assessment_id) p.* from progress p where p.source = 'live'
  order by p.assessment_id, p.last_viewed_at desc, p.question_order desc nulls last, p.question_id
), question_rows as (
  select p.question_id, p.questionnaire_version, max(p.section_key) as section_key, max(p.question_order) as question_order,
    count(distinct p.assessment_id) as reached_count,
    count(distinct p.assessment_id) filter (where p.answered_at is not null) as answered_count,
    count(distinct p.assessment_id) filter (where lp.question_id = p.question_id and lp.questionnaire_version = p.questionnaire_version
      and aa.status <> 'complete' and aa.last_activity < p_now - interval '24 hours') as stopped_count,
    count(distinct p.assessment_id) filter (where lp.question_id = p.question_id and lp.questionnaire_version = p.questionnaire_version
      and aa.status <> 'complete' and aa.last_activity >= p_now - interval '24 hours') as active_count
  from progress p join assessment_activity aa on aa.id = p.assessment_id
  left join last_progress lp on lp.assessment_id = p.assessment_id
  group by p.question_id, p.questionnaire_version
), totals as (
  select count(*)::numeric as cohort_started,
    count(*) filter (where exists (select 1 from progress p where p.assessment_id = c.id))::numeric as covered_assessments,
    count(*) filter (where c.status = 'complete')::numeric as completed_count
  from cohort c
), progress_totals as (
  select count(*)::numeric as reached_pairs, min(created_at) filter (where source = 'live') as live_started_at,
    min(created_at) as any_started_at from progress
), active_total as (
  select count(*)::numeric as active_count from assessment_activity aa
  where aa.status <> 'complete' and aa.last_activity >= p_now - interval '24 hours'
    and exists (select 1 from progress p where p.assessment_id = aa.id and p.source = 'live')
)
select jsonb_build_object(
  'summary', jsonb_build_object(
    'cohort_started', totals.cohort_started,
    'covered_assessments', totals.covered_assessments,
    'coverage_rate', case when totals.cohort_started = 0 then 0 else totals.covered_assessments / totals.cohort_started end,
    'average_questions_reached', case when totals.covered_assessments = 0 then 0 else progress_totals.reached_pairs / totals.covered_assessments end,
    'completed_count', totals.completed_count,
    'completion_rate', case when totals.cohort_started = 0 then 0 else totals.completed_count / totals.cohort_started end,
    'active_in_progress_count', active_total.active_count,
    'instrumentation_started_at', coalesce(progress_totals.live_started_at, progress_totals.any_started_at)
  ),
  'questions', coalesce((select jsonb_agg(jsonb_build_object(
    'question_id', question_id, 'questionnaire_version', questionnaire_version, 'section_key', section_key,
    'question_order', question_order, 'reached_count', reached_count, 'answered_count', answered_count,
    'stopped_count', stopped_count, 'active_count', active_count
  ) order by stopped_count desc, (stopped_count::numeric / nullif(reached_count, 0)) desc nulls last, reached_count desc, question_order nulls last)
  from question_rows), '[]'::jsonb)
)
from totals cross join progress_totals cross join active_total
$$;

-- Saved canonical answers prove only that the same question was reached and answered.
-- No unanswered historical view or historical stop path is inferred.
insert into jingeehas.assessment_question_progress (
  assessment_id, questionnaire_version, question_id, first_viewed_at, last_viewed_at, answered_at, source, created_at, updated_at
)
select answer.assessment_id, assessment.questionnaire_version, answer.question_id,
  answer.updated_at, answer.updated_at, answer.updated_at, 'canonical_answer_backfill', now(), now()
from jingeehas.assessment_answers answer join jingeehas.assessments assessment on assessment.id = answer.assessment_id
where answer.updated_at is not null
on conflict (assessment_id, questionnaire_version, question_id) do nothing;

revoke all on function jingeehas.record_question_progress(jsonb) from public, anon, authenticated;
revoke all on function jingeehas.get_question_progress_analytics(date, date, timestamptz) from public, anon, authenticated;
grant execute on function jingeehas.record_question_progress(jsonb) to service_role;
grant execute on function jingeehas.get_question_progress_analytics(date, date, timestamptz) to service_role;

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

insert into jingeehas.schema_migrations(version) values ('20260721080832_add_question_progress_analytics') on conflict (version) do nothing;

commit;
