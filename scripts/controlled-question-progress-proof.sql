begin;

insert into jingeehas.sessions (id, token_hash, created_at, expires_at, revoked_at)
values ('ws_codex_progress_test', repeat('a', 64), '2026-07-19T16:00:00Z', '2026-08-19T16:00:00Z', null);
insert into jingeehas.safety_checks (id, session_id, result, created_at)
values ('sc_codex_progress_test', 'ws_codex_progress_test', '{"route":"pending_assessment"}'::jsonb, '2026-07-19T16:00:00Z');
insert into jingeehas.assessments (id, session_id, safety_check_id, status, report_mode, safety_route, created_at, updated_at, completed_at)
values ('wa_codex_progress_test', 'ws_codex_progress_test', 'sc_codex_progress_test', 'draft', null, null,
  '2026-07-19T16:00:00Z', '2026-07-19T16:30:00Z', null);

select jingeehas.record_question_progress('{"assessment_id":"wa_codex_progress_test","questionnaire_version":"jingeehas-production-2026-07","question_id":"Q-AGE","section_key":"baseline","question_order":1,"branch_depth":0,"viewed_at":"2026-07-19T16:05:00Z","answered":false,"source":"live"}'::jsonb);
select jingeehas.record_question_progress('{"assessment_id":"wa_codex_progress_test","questionnaire_version":"jingeehas-production-2026-07","question_id":"Q-AGE","section_key":"baseline","question_order":1,"branch_depth":0,"viewed_at":"2026-07-19T16:10:00Z","answered":false,"source":"live"}'::jsonb);
insert into jingeehas.assessment_answers (id, assessment_id, question_id, value, updated_at)
values ('wa_codex_progress_test:Q-AGE', 'wa_codex_progress_test', 'Q-AGE', '35'::jsonb, '2026-07-19T16:11:00Z');
select jingeehas.record_question_progress('{"assessment_id":"wa_codex_progress_test","questionnaire_version":"jingeehas-production-2026-07","question_id":"Q-AGE","section_key":"baseline","question_order":1,"branch_depth":0,"viewed_at":"2026-07-19T16:11:00Z","answered":true,"source":"live"}'::jsonb);
select jingeehas.record_question_progress('{"assessment_id":"wa_codex_progress_test","questionnaire_version":"jingeehas-production-2026-07","question_id":"Q-SEX","section_key":"baseline","question_order":2,"branch_depth":0,"viewed_at":"2026-07-19T16:12:00Z","answered":false,"source":"live"}'::jsonb);

do $$
declare age_row jingeehas.assessment_question_progress%rowtype; result jsonb; stopped integer;
begin
  select * into strict age_row from jingeehas.assessment_question_progress
  where assessment_id = 'wa_codex_progress_test' and question_id = 'Q-AGE';
  if age_row.first_viewed_at <> '2026-07-19T16:05:00Z'::timestamptz
    or age_row.last_viewed_at <> '2026-07-19T16:11:00Z'::timestamptz or age_row.answered_at is null then
    raise exception 'controlled progress deduplication proof failed';
  end if;
  if (select count(*) from jingeehas.assessment_question_progress where assessment_id = 'wa_codex_progress_test') <> 2 then
    raise exception 'controlled next-question proof failed';
  end if;
  result := jingeehas.get_question_progress_analytics('2026-07-20', '2026-07-20', '2026-07-21T18:00:00Z');
  select (item->>'stopped_count')::integer into stopped from jsonb_array_elements(result->'questions') item where item->>'question_id' = 'Q-SEX';
  if stopped <> 1 then raise exception 'controlled 24-hour stop proof failed'; end if;
end $$;

rollback;
