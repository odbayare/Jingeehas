begin;

create schema if not exists jingeehas;
comment on schema jingeehas is 'Isolated backend-only schema for the Jingeehas one-time assessment product';

revoke all on schema jingeehas from public;
revoke all on schema jingeehas from anon;
revoke all on schema jingeehas from authenticated;
grant usage on schema jingeehas to service_role;

set local search_path = jingeehas, public;

create table schema_migrations (
  version text primary key,
  applied_at timestamptz not null default now()
);

;
