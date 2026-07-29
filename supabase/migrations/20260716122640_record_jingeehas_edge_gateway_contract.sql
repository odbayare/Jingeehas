insert into jingeehas.schema_migrations(version)
values ('2026071603_edge_gateway_contract')
on conflict (version) do nothing;;
