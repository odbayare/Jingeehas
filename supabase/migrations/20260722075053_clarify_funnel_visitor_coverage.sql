begin;

-- Keep the cohort arithmetic from the certified PR #7 function intact. This
-- wrapper adds only explicit coverage metadata used to label the two visitor
-- concepts and distinguish visitor activity from assessment activity.
alter function jingeehas.get_daily_funnel_analytics(date, date)
  rename to get_daily_funnel_analytics_v1;

create function jingeehas.get_daily_funnel_analytics(p_start_date date, p_end_date date)
returns jsonb language sql stable security definer set search_path = '' as $$
with source as (
  select jingeehas.get_daily_funnel_analytics_v1(p_start_date, p_end_date) as payload
), facts as (
  select payload,
    coalesce((payload #>> '{all_flows,unique_visitors}')::bigint, 0) as all_measured_visitors,
    coalesce((payload #>> '{current_flow,eligible_visitors}')::bigint, 0) as paid_first_eligible_visitors,
    coalesce((payload #>> '{coverage,legacy_activity_present}')::boolean, false) as legacy_activity_present,
    coalesce((payload #>> '{coverage,prepaid_activity_present}')::boolean, false) as prepaid_assessment_activity_present
  from source
)
select jsonb_set(payload, '{coverage}', coalesce(payload -> 'coverage', '{}'::jsonb) || jsonb_build_object(
  'all_measured_visitors', all_measured_visitors,
  'paid_first_eligible_visitors', paid_first_eligible_visitors,
  'legacy_activity_present', legacy_activity_present,
  'prepaid_assessment_activity_present', prepaid_assessment_activity_present,
  'prepaid_visitor_activity_present', paid_first_eligible_visitors > 0,
  'flow_state', case
    when legacy_activity_present and prepaid_assessment_activity_present then 'mixed'
    when legacy_activity_present and paid_first_eligible_visitors > 0 then 'legacy_with_prepaid_visitors'
    when legacy_activity_present then 'legacy_only'
    when prepaid_assessment_activity_present then 'prepaid_only'
    when paid_first_eligible_visitors > 0 then 'prepaid_visitors_only'
    else 'empty'
  end
)) from facts
$$;

revoke all on function jingeehas.get_daily_funnel_analytics_v1(date, date) from public, anon, authenticated;
revoke all on function jingeehas.get_daily_funnel_analytics(date, date) from public, anon, authenticated;
grant execute on function jingeehas.get_daily_funnel_analytics_v1(date, date) to service_role;
grant execute on function jingeehas.get_daily_funnel_analytics(date, date) to service_role;

insert into jingeehas.schema_migrations(version)
values ('20260722075053_clarify_funnel_visitor_coverage')
on conflict (version) do nothing;

commit;
