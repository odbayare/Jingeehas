drop index if exists jingeehas.payments_replacement_for_payment_idx;
drop index if exists jingeehas.admin_sessions_parent_session_idx;

create index payments_replacement_for_payment_idx
  on jingeehas.payments (replacement_for_payment_id);

create index admin_sessions_parent_session_idx
  on jingeehas.admin_sessions (parent_session_id);

insert into jingeehas.schema_migrations (version)
values ('20260717071119_make_reference_indexes_advisor_visible')
on conflict (version) do nothing;
