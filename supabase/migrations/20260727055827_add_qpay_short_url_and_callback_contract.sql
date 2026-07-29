begin;

alter table jingeehas.payments add column if not exists short_url text;

insert into jingeehas.schema_migrations(version)
values ('20260727055827_add_qpay_short_url_and_callback_contract')
on conflict (version) do nothing;

commit;
