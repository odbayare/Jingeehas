begin;

create index report_snapshot_versions_supersedes_idx
  on jingeehas.report_snapshot_versions (supersedes_snapshot_id)
  where supersedes_snapshot_id is not null;
create index report_snapshot_versions_legacy_source_idx
  on jingeehas.report_snapshot_versions (source_legacy_assessment_id)
  where source_legacy_assessment_id is not null;

insert into jingeehas.schema_migrations(version)
values ('20260719054126_index_report_snapshot_version_references')
on conflict (version) do nothing;

commit;
