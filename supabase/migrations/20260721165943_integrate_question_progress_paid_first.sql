begin;

-- Reject version-spoofed progress writes. The assessment row is the source of
-- truth for questionnaire version and prevents one assessment/question pair
-- from being counted in multiple version buckets.
create or replace function jingeehas.record_question_progress(payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  result jsonb;
  viewed_at timestamptz := (payload->>'viewed_at')::timestamptz;
  stored_version text;
begin
  if coalesce(payload->>'assessment_id', '') = '' or coalesce(payload->>'questionnaire_version', '') = ''
    or coalesce(payload->>'question_id', '') = '' or viewed_at is null then
    raise exception using errcode = '22023', message = 'JH_QUESTION_PROGRESS_INVALID';
  end if;

  select questionnaire_version into stored_version
  from jingeehas.assessments
  where id = payload->>'assessment_id';

  if stored_version is null or stored_version <> payload->>'questionnaire_version' then
    raise exception using errcode = '22023', message = 'JH_QUESTION_PROGRESS_VERSION_MISMATCH';
  end if;

  insert into jingeehas.assessment_question_progress as progress (
    assessment_id, questionnaire_version, question_id, section_key, question_order, branch_depth,
    first_viewed_at, last_viewed_at, answered_at, source, created_at, updated_at
  ) values (
    payload->>'assessment_id', stored_version, payload->>'question_id', nullif(payload->>'section_key', ''),
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

-- Prepaid cohorts start only at authoritative started_at. Legacy cohorts keep
-- their compatible created_at evidence. Owner-preview/test/admin assessments
-- remain excluded before any question aggregation is calculated.
create or replace function jingeehas.get_question_progress_analytics(p_start_date date, p_end_date date, p_now timestamptz default now())
returns jsonb language sql stable security definer set search_path = '' as $$
with excluded_assessments as (
  select distinct assessment_id from jingeehas.analytics_events
  where assessment_id is not null and (is_admin or is_owner_preview or is_test)
  union
  select distinct assessment_id from jingeehas.assessment_sessions where source = 'owner'
), cohort_candidates as (
  select a.*,
    case when a.commercial_flow_version = 'prepaid_v2' then a.started_at else coalesce(a.started_at, a.created_at) end as cohort_started_at
  from jingeehas.assessments a
  where a.id not in (select assessment_id from excluded_assessments)
), cohort as (
  select * from cohort_candidates
  where cohort_started_at is not null
    and cohort_started_at >= (p_start_date::timestamp at time zone 'Asia/Ulaanbaatar')
    and cohort_started_at < ((p_end_date + 1)::timestamp at time zone 'Asia/Ulaanbaatar')
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

revoke all on function jingeehas.record_question_progress(jsonb) from public, anon, authenticated;
revoke all on function jingeehas.get_question_progress_analytics(date, date, timestamptz) from public, anon, authenticated;
grant execute on function jingeehas.record_question_progress(jsonb) to service_role;
grant execute on function jingeehas.get_question_progress_analytics(date, date, timestamptz) to service_role;

insert into jingeehas.schema_migrations(version)
values ('20260721165021_integrate_question_progress_paid_first')
on conflict (version) do nothing;

commit;
