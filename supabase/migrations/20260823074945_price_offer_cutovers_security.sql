begin;

alter table jingeehas.price_offer_cutovers enable row level security;
revoke all on table jingeehas.price_offer_cutovers from public, anon, authenticated;

insert into jingeehas.schema_migrations(version)
values ('20260823074945_price_offer_cutovers_security')
on conflict (version) do nothing;

commit;
