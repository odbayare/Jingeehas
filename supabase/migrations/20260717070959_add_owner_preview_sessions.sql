begin;

alter table jingeehas.admin_accounts
  add column if not exists is_owner boolean not null default false;

do $$
declare
  active_admin_count integer;
begin
  select count(*) into active_admin_count
  from jingeehas.admin_accounts
  where status = 'active';

  if active_admin_count <> 1 then
    raise exception using errcode = 'P0001', message = 'JH_OWNER_ADMIN_COUNT_INVALID';
  end if;

  update jingeehas.admin_accounts
  set is_owner = (status = 'active');
end;
$$;

alter table jingeehas.admin_sessions
  add column if not exists purpose text not null default 'admin',
  add column if not exists parent_session_id text
    references jingeehas.admin_sessions(id) on delete cascade;

alter table jingeehas.admin_sessions
  add constraint admin_sessions_purpose_check
    check (purpose in ('admin', 'preview')),
  add constraint admin_sessions_preview_parent_check
    check ((purpose = 'admin' and parent_session_id is null) or
           (purpose = 'preview' and parent_session_id is not null));

create unique index if not exists admin_owner_preview_active_uidx
  on jingeehas.admin_sessions (admin_id)
  where purpose = 'preview' and revoked_at is null;

insert into jingeehas.schema_migrations (version)
values ('20260717065319_add_owner_preview_sessions')
on conflict (version) do nothing;

commit;
