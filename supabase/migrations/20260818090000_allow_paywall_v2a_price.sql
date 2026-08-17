begin;

alter table jingeehas.payments
  drop constraint if exists payments_amount_check;

alter table jingeehas.payments
  add constraint payments_amount_check check (amount in (9900, 39000));

insert into jingeehas.schema_migrations (version)
values ('20260818090000_allow_paywall_v2a_price')
on conflict (version) do nothing;

commit;
