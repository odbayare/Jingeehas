-- Private AI-designed V2.1 software pilot only. Do not apply as evidence of validation.
create schema if not exists jingeehas_pilot;
revoke all on schema jingeehas_pilot from public, anon, authenticated;

create table jingeehas_pilot.assessments (
  id text primary key check (id like 'pv2_%'),
  access_subject_hash text not null,
  status text not null check (status in ('in_progress','complete')),
  instrument_version text not null check (instrument_version = 'jingeehas-ai-pilot-v2.1'),
  item_bank_hash text not null,
  scoring_version text not null check (scoring_version = 'jingeehas-ai-pilot-scoring-v2.1-equal-weight'),
  report_version text not null check (report_version = 'jingeehas-ai-pilot-report-v2.1'),
  pilot_status_label text not null,
  generated_at timestamptz not null,
  updated_at timestamptz,
  completed_at timestamptz,
  last_completed_section text,
  report jsonb
);
create index pilot_v2_assessments_subject_idx on jingeehas_pilot.assessments(access_subject_hash, generated_at desc);

create table jingeehas_pilot.answers (
  assessment_id text not null references jingeehas_pilot.assessments(id) on delete cascade,
  item_key text not null,
  response_code text,
  not_applicable boolean not null default false,
  primary key (assessment_id, item_key),
  check ((not_applicable and response_code is null) or (not not_applicable and response_code in ('0','1','2','3','4')))
);
create table jingeehas_pilot.context_responses (
  assessment_id text not null references jingeehas_pilot.assessments(id) on delete cascade,
  item_key text not null,
  response_code text not null,
  primary key (assessment_id, item_key)
);
create table jingeehas_pilot.safety_responses (
  assessment_id text not null references jingeehas_pilot.assessments(id) on delete cascade,
  item_key text not null,
  response_code text not null,
  primary key (assessment_id, item_key)
);

create table jingeehas_pilot.lifecycle_events (
  id bigint generated always as identity primary key,
  event_name text not null check (event_name in ('pilot_started','section_reached','pilot_completed','report_opened','error_category')),
  assessment_id text,
  access_subject_hash text not null,
  category text,
  section text,
  occurred_at timestamptz not null default now(),
  check (category is null or length(category) <= 40),
  check (section is null or length(section) <= 40)
);
create unique index pilot_v2_event_idempotency_idx on jingeehas_pilot.lifecycle_events
  (access_subject_hash, coalesce(assessment_id,''), event_name, coalesce(section,''));
alter table jingeehas_pilot.assessments enable row level security;
alter table jingeehas_pilot.answers enable row level security;
alter table jingeehas_pilot.context_responses enable row level security;
alter table jingeehas_pilot.safety_responses enable row level security;
alter table jingeehas_pilot.lifecycle_events enable row level security;
revoke all on all tables in schema jingeehas_pilot from public, anon, authenticated;
grant usage on schema jingeehas_pilot to service_role;
grant all on all tables in schema jingeehas_pilot to service_role;
grant usage, select on all sequences in schema jingeehas_pilot to service_role;

create or replace function public.jingeehas_save_pilot_v2_assessment(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = pg_catalog, public, jingeehas_pilot as $$
declare a jingeehas_pilot.assessments; pair record;
begin
  insert into jingeehas_pilot.assessments(id,access_subject_hash,status,instrument_version,item_bank_hash,scoring_version,report_version,pilot_status_label,generated_at,updated_at,completed_at,last_completed_section,report)
  values (p_payload->>'id',p_payload->>'access_subject_hash',p_payload->>'status',p_payload->>'instrument_version',p_payload->>'item_bank_hash',p_payload->>'scoring_version',p_payload->>'report_version',p_payload->>'pilot_status_label',(p_payload->>'generated_at')::timestamptz,nullif(p_payload->>'updated_at','')::timestamptz,nullif(p_payload->>'completed_at','')::timestamptz,nullif(p_payload->>'last_completed_section',''),p_payload->'report')
  on conflict(id) do update set status=excluded.status,updated_at=excluded.updated_at,completed_at=excluded.completed_at,last_completed_section=excluded.last_completed_section,report=excluded.report
  where jingeehas_pilot.assessments.access_subject_hash=excluded.access_subject_hash
  returning * into a;
  if a.id is null then raise exception 'pilot assessment subject mismatch' using errcode='42501'; end if;
  if p_payload ? 'answers' then
    delete from jingeehas_pilot.answers where assessment_id=a.id;
    for pair in select * from jsonb_each_text(coalesce(p_payload->'answers','{}')) loop
      if pair.value not in ('0','1','2','3','4','NA') then raise exception 'invalid pilot response'; end if;
      insert into jingeehas_pilot.answers(assessment_id,item_key,response_code,not_applicable)
      values(a.id,pair.key,case when pair.value='NA' then null else pair.value end,pair.value='NA');
    end loop;
  end if;
  if p_payload ? 'context_responses' then
    delete from jingeehas_pilot.context_responses where assessment_id=a.id;
    for pair in select * from jsonb_each_text(coalesce(p_payload->'context_responses','{}')) loop
      insert into jingeehas_pilot.context_responses(assessment_id,item_key,response_code) values(a.id,pair.key,pair.value);
    end loop;
  end if;
  if p_payload ? 'safety_responses' then
    delete from jingeehas_pilot.safety_responses where assessment_id=a.id;
    for pair in select * from jsonb_each_text(coalesce(p_payload->'safety_responses','{}')) loop
      insert into jingeehas_pilot.safety_responses(assessment_id,item_key,response_code) values(a.id,pair.key,pair.value);
    end loop;
  end if;
  return to_jsonb(a) - 'access_subject_hash';
end $$;

create or replace function public.jingeehas_get_pilot_v2_assessment(p_assessment_id text,p_access_subject_hash text)
returns jsonb language sql security definer set search_path = pg_catalog, public, jingeehas_pilot as $$
select (to_jsonb(a)-'access_subject_hash') || jsonb_build_object(
  'answers',coalesce((select jsonb_object_agg(x.item_key,case when x.not_applicable then 'NA' else x.response_code end) from jingeehas_pilot.answers x where x.assessment_id=a.id),'{}'::jsonb),
  'context_responses',coalesce((select jsonb_object_agg(x.item_key,x.response_code) from jingeehas_pilot.context_responses x where x.assessment_id=a.id),'{}'::jsonb),
  'safety_responses',coalesce((select jsonb_object_agg(x.item_key,x.response_code) from jingeehas_pilot.safety_responses x where x.assessment_id=a.id),'{}'::jsonb))
from jingeehas_pilot.assessments a where a.id=p_assessment_id and a.access_subject_hash=p_access_subject_hash
$$;

create or replace function public.jingeehas_record_pilot_v2_event(p_payload jsonb)
returns jsonb language sql security definer set search_path = pg_catalog, public, jingeehas_pilot as $$
with inserted as (
  insert into jingeehas_pilot.lifecycle_events(event_name,assessment_id,access_subject_hash,category,section,occurred_at)
  values(p_payload->>'event_name',nullif(p_payload->>'assessment_id',''),p_payload->>'access_subject_hash',nullif(p_payload->>'category',''),nullif(p_payload->>'section',''),coalesce((p_payload->>'occurred_at')::timestamptz,now()))
  on conflict do nothing returning 1
)
select jsonb_build_object('accepted',true,'recorded',exists(select 1 from inserted))
$$;
revoke all on function public.jingeehas_save_pilot_v2_assessment(jsonb), public.jingeehas_get_pilot_v2_assessment(text,text), public.jingeehas_record_pilot_v2_event(jsonb) from public, anon, authenticated;
grant execute on function public.jingeehas_save_pilot_v2_assessment(jsonb), public.jingeehas_get_pilot_v2_assessment(text,text), public.jingeehas_record_pilot_v2_event(jsonb) to service_role;
