begin;

alter table jingeehas.payments
  add column if not exists payment_context text not null default 'unknown',
  add column if not exists analytics_eligible boolean not null default false,
  add column if not exists environment text not null default 'unknown';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'payments_payment_context_check'
      and conrelid = 'jingeehas.payments'::regclass
  ) then
    alter table jingeehas.payments
      add constraint payments_payment_context_check
      check (payment_context in ('customer', 'qa', 'unknown'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'payments_environment_check'
      and conrelid = 'jingeehas.payments'::regclass
  ) then
    alter table jingeehas.payments
      add constraint payments_environment_check
      check (environment in ('production', 'deploy_preview', 'local', 'test', 'unknown'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'payments_analytics_eligibility_check'
      and conrelid = 'jingeehas.payments'::regclass
  ) then
    alter table jingeehas.payments
      add constraint payments_analytics_eligibility_check
      check (
        analytics_eligible = false
        or (payment_context = 'customer' and environment = 'production')
      );
  end if;
end $$;

-- Existing rows deliberately remain unknown/ineligible. There is no reliable
-- historical evidence that can separate real customers from production QA.
update jingeehas.payments
set payment_context = 'unknown', analytics_eligible = false, environment = 'unknown'
where payment_context is distinct from 'unknown'
   or analytics_eligible is distinct from false
   or environment is distinct from 'unknown';

commit;
