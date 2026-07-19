create index if not exists payments_replacement_for_payment_idx
  on jingeehas.payments (replacement_for_payment_id)
  where replacement_for_payment_id is not null;

create index if not exists admin_sessions_parent_session_idx
  on jingeehas.admin_sessions (parent_session_id)
  where parent_session_id is not null;

insert into jingeehas.schema_migrations (version)
values ('20260717071032_index_payment_and_preview_parent_references')
on conflict (version) do nothing;
