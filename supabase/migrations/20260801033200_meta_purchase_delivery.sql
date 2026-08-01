begin;

alter table jingeehas.payments
  add column if not exists meta_purchase_event_id text,
  add column if not exists meta_purchase_sent_at timestamptz,
  add column if not exists meta_purchase_api_version text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'payments_meta_purchase_event_id_check'
      and conrelid = 'jingeehas.payments'::regclass
  ) then
    alter table jingeehas.payments
      add constraint payments_meta_purchase_event_id_check check (
        meta_purchase_event_id is null
        or meta_purchase_event_id ~ '^jh_purchase_[a-f0-9]{32}$'
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'payments_meta_purchase_api_version_check'
      and conrelid = 'jingeehas.payments'::regclass
  ) then
    alter table jingeehas.payments
      add constraint payments_meta_purchase_api_version_check check (
        meta_purchase_api_version is null
        or meta_purchase_api_version ~ '^v[0-9]+\.[0-9]+$'
      );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'payments_meta_purchase_delivery_shape_check'
      and conrelid = 'jingeehas.payments'::regclass
  ) then
    alter table jingeehas.payments
      add constraint payments_meta_purchase_delivery_shape_check check (
        (
          meta_purchase_event_id is null
          and meta_purchase_sent_at is null
          and meta_purchase_api_version is null
        )
        or (
          meta_purchase_event_id is not null
          and meta_purchase_sent_at is not null
          and meta_purchase_api_version is not null
        )
      );
  end if;
end $$;

create unique index if not exists payments_meta_purchase_event_uidx
  on jingeehas.payments (meta_purchase_event_id)
  where meta_purchase_event_id is not null;

commit;
