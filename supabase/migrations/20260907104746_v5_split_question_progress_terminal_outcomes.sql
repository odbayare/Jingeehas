begin;

-- Preserve the existing question-level reach/drop-off semantics while separating
-- terminal safety exits from commercially eligible assessment completions.
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
  select p.*
  from jingeehas.assessment_question_progress p
  join cohort c on c.id = p.assessment_id and c.questionnaire_version = p.questionnaire_version
), live_progress as (
  select * from progress where source = 'live'
), live_activity as (
  select assessment_id,
    greatest(max(last_viewed_at), coalesce(max(answered_at), '-infinity'::timestamptz)) as last_activity
  from live_progress
  group by assessment_id
), last_live_progress as (
  select distinct on (p.assessment_id) p.*
  from live_progress p
  order by p.assessment_id,
    greatest(p.last_viewed_at, coalesce(p.answered_at, '-infinity'::timestamptz)) desc,
    p.question_order desc nulls last, p.question_id
), question_evidence as (
  select p.question_id, p.questionnaire_version,
    max(p.section_key) as section_key, max(p.question_order) as question_order,
    count(distinct p.assessment_id) as total_reached_count,
    count(distinct p.assessment_id) filter (where p.answered_at is not null) as total_answered_count,
    count(distinct p.assessment_id) filter (where p.source = 'live') as live_reached_count,
    count(distinct p.assessment_id) filter (where p.source = 'canonical_answer_backfill'
      and not exists (
        select 1 from live_progress live
        where live.assessment_id = p.assessment_id
          and live.questionnaire_version = p.questionnaire_version
          and live.question_id = p.question_id
      )) as backfill_reached_count
  from progress p
  group by p.question_id, p.questionnaire_version
), question_state as (
  select e.*,
    count(distinct lp.assessment_id) filter (
      where lp.question_id = e.question_id and lp.questionnaire_version = e.questionnaire_version
        and c.status <> 'complete' and activity.last_activity >= p_now - interval '24 hours'
    ) as active_at_question_count,
    count(distinct lp.assessment_id) filter (
      where lp.question_id = e.question_id and lp.questionnaire_version = e.questionnaire_version
        and c.status <> 'complete' and activity.last_activity < p_now - interval '24 hours'
    ) as confirmed_stopped_count
  from question_evidence e
  left join last_live_progress lp
    on lp.question_id = e.question_id and lp.questionnaire_version = e.questionnaire_version
  left join cohort c on c.id = lp.assessment_id
  left join live_activity activity on activity.assessment_id = lp.assessment_id
  group by e.question_id, e.questionnaire_version, e.section_key, e.question_order,
    e.total_reached_count, e.total_answered_count, e.live_reached_count, e.backfill_reached_count
), question_rows as (
  select *, greatest(live_reached_count - active_at_question_count, 0) as dropoff_eligible_count
  from question_state
), totals as (
  select count(*)::numeric as cohort_started,
    count(*) filter (where exists (select 1 from progress p where p.assessment_id = c.id))::numeric as covered_assessments,
    count(*) filter (where exists (select 1 from live_progress p where p.assessment_id = c.id))::numeric as live_progress_assessments,
    count(*) filter (
      where exists (select 1 from progress p where p.assessment_id = c.id)
        and not exists (select 1 from live_progress p where p.assessment_id = c.id)
    )::numeric as backfill_only_assessments,
    count(*) filter (where c.status = 'complete')::numeric as terminal_completed_count,
    count(*) filter (
      where c.status = 'complete'
        and (c.report_mode = 'safety' or c.safety_route is not null)
    )::numeric as safety_exit_count,
    count(*) filter (
      where c.status = 'complete'
        and coalesce(c.report_mode, '') <> 'safety'
        and c.safety_route is null
    )::numeric as commercial_completed_count
  from cohort c
), progress_totals as (
  select count(*)::numeric as reached_pairs,
    min(created_at) filter (where source = 'live') as live_started_at,
    min(created_at) as any_started_at
  from progress
), active_total as (
  select count(*)::numeric as active_count
  from cohort c
  join last_live_progress lp on lp.assessment_id = c.id
  join live_activity activity on activity.assessment_id = c.id
  where c.status <> 'complete' and activity.last_activity >= p_now - interval '24 hours'
), outcome_totals as (
  select totals.*,
    greatest(totals.cohort_started - totals.safety_exit_count, 0)::numeric as commercial_eligible_started_count
  from totals
)
select jsonb_build_object(
  'summary', jsonb_build_object(
    'cohort_started', outcome_totals.cohort_started,
    'covered_assessments', outcome_totals.covered_assessments,
    'live_progress_assessments', outcome_totals.live_progress_assessments,
    'backfill_only_assessments', outcome_totals.backfill_only_assessments,
    'coverage_rate', case when outcome_totals.cohort_started = 0 then 0 else outcome_totals.covered_assessments / outcome_totals.cohort_started end,
    'average_questions_reached', case when outcome_totals.covered_assessments = 0 then 0 else progress_totals.reached_pairs / outcome_totals.covered_assessments end,
    -- Legacy aliases remain terminal-completion metrics for backward compatibility.
    'completed_count', outcome_totals.terminal_completed_count,
    'completion_rate', case when outcome_totals.cohort_started = 0 then 0 else outcome_totals.terminal_completed_count / outcome_totals.cohort_started end,
    'terminal_completed_count', outcome_totals.terminal_completed_count,
    'terminal_completion_rate', case when outcome_totals.cohort_started = 0 then 0 else outcome_totals.terminal_completed_count / outcome_totals.cohort_started end,
    'commercial_completed_count', outcome_totals.commercial_completed_count,
    'safety_exit_count', outcome_totals.safety_exit_count,
    'commercial_eligible_started_count', outcome_totals.commercial_eligible_started_count,
    'commercial_completion_rate', case when outcome_totals.commercial_eligible_started_count = 0 then 0 else outcome_totals.commercial_completed_count / outcome_totals.commercial_eligible_started_count end,
    'safety_exit_rate', case when outcome_totals.cohort_started = 0 then 0 else outcome_totals.safety_exit_count / outcome_totals.cohort_started end,
    'active_in_progress_count', active_total.active_count,
    'instrumentation_started_at', coalesce(progress_totals.live_started_at, progress_totals.any_started_at)
  ),
  'questions', coalesce((select jsonb_agg(jsonb_build_object(
    'question_id', question_id,
    'questionnaire_version', questionnaire_version,
    'section_key', section_key,
    'question_order', question_order,
    'total_reached_count', total_reached_count,
    'total_answered_count', total_answered_count,
    'live_reached_count', live_reached_count,
    'backfill_reached_count', backfill_reached_count,
    'active_at_question_count', active_at_question_count,
    'confirmed_stopped_count', confirmed_stopped_count,
    'dropoff_eligible_count', dropoff_eligible_count,
    'confirmed_dropoff_rate', confirmed_stopped_count::numeric / nullif(dropoff_eligible_count, 0),
    'reached_count', total_reached_count,
    'answered_count', total_answered_count,
    'stopped_count', confirmed_stopped_count,
    'active_count', active_at_question_count
  ) order by confirmed_stopped_count desc,
    (confirmed_stopped_count::numeric / nullif(dropoff_eligible_count, 0)) desc nulls last,
    dropoff_eligible_count desc, question_order nulls last)
  from question_rows), '[]'::jsonb)
)
from outcome_totals cross join progress_totals cross join active_total
$$;

revoke all on function jingeehas.get_question_progress_analytics(date, date, timestamptz) from public, anon, authenticated;
grant execute on function jingeehas.get_question_progress_analytics(date, date, timestamptz) to service_role;

insert into jingeehas.schema_migrations(version)
values ('20260907104746_v5_split_question_progress_terminal_outcomes')
on conflict (version) do nothing;

commit;
