begin;

create table schema_migrations (
  version text primary key,
  applied_at timestamptz not null default now()
);

create table sessions (
  id text primary key,
  token_hash text not null unique,
  created_at timestamptz not null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  check (expires_at > created_at)
);

create table safety_checks (
  id text primary key,
  session_id text not null references sessions(id) on delete cascade,
  result jsonb not null,
  created_at timestamptz not null
);

create table assessments (
  id text primary key,
  session_id text not null references sessions(id) on delete restrict,
  safety_check_id text not null references safety_checks(id) on delete restrict,
  status text not null check (status in ('draft', 'complete')),
  report_mode text check (report_mode in ('safety', 'sufficient', 'limited', 'insufficient')),
  safety_route text,
  coach_client_id text,
  consent_status text,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  completed_at timestamptz,
  check (updated_at >= created_at),
  check (completed_at is null or completed_at >= created_at)
);

create table assessment_sessions (
  id text primary key,
  assessment_id text not null references assessments(id) on delete cascade,
  session_id text not null references sessions(id) on delete cascade,
  source text not null check (source in ('recovery', 'owner')),
  created_at timestamptz not null,
  unique (assessment_id, session_id)
);

create table assessment_answers (
  id text primary key,
  assessment_id text not null references assessments(id) on delete cascade,
  question_id text not null,
  value jsonb not null,
  updated_at timestamptz not null,
  unique (assessment_id, question_id)
);

create table assessment_summaries (
  id text primary key,
  assessment_id text not null references assessments(id) on delete cascade,
  checkpoint_id text not null,
  text text not null,
  source_question_ids jsonb not null default '[]'::jsonb,
  confirmed_at timestamptz not null,
  unique (assessment_id, checkpoint_id)
);

create table report_snapshots (
  assessment_id text primary key references assessments(id) on delete cascade,
  session_id text not null references sessions(id) on delete restrict,
  report_mode text not null check (report_mode in ('safety', 'sufficient', 'limited', 'insufficient')),
  safety_route text,
  safety_provenance jsonb,
  initial_view jsonb not null,
  full_report jsonb,
  created_at timestamptz not null
);

create table payments (
  id text primary key,
  session_id text not null references sessions(id) on delete restrict,
  assessment_id text not null references assessments(id) on delete restrict,
  product_code text not null check (product_code = 'WEIGHT_TEST_ONE_TIME'),
  amount integer not null check (amount = 9900),
  status text not null check (status in ('creating', 'create_unknown', 'reconciling', 'pending', 'checking', 'paid', 'create_error', 'create_failed_confirmed', 'check_error', 'expired', 'failed', 'cancelled', 'paid_but_not_unlocked')),
  invoice_id text unique,
  sender_invoice_no text not null unique check (char_length(sender_invoice_no) <= 45),
  provider_payment_id text,
  expires_at timestamptz,
  paid_at timestamptz,
  qr_text text not null default '',
  qr_image text not null default '',
  urls jsonb not null default '[]'::jsonb,
  request_fingerprint text,
  reconciliation_status text,
  replacement_for_payment_id text references payments(id) on delete restrict,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  check (updated_at >= created_at),
  check (paid_at is null or paid_at >= created_at)
);

create table entitlements (
  id text primary key,
  session_id text not null references sessions(id) on delete restrict,
  assessment_id text not null references assessments(id) on delete restrict,
  payment_id text not null references payments(id) on delete restrict,
  product_code text not null check (product_code = 'WEIGHT_TEST_ONE_TIME'),
  status text not null check (status in ('active', 'revoked')),
  granted_at timestamptz not null,
  unique (assessment_id, product_code),
  unique (payment_id, product_code)
);

create table recovery_contacts (
  id text primary key,
  contact_group_id text not null,
  session_id text not null references sessions(id) on delete restrict,
  assessment_id text references assessments(id) on delete restrict,
  payment_id text references payments(id) on delete restrict,
  entitlement_id text references entitlements(id) on delete restrict,
  type text not null check (type in ('email', 'phone')),
  contact_hash text not null,
  encrypted_contact text not null,
  verified_at timestamptz,
  created_at timestamptz not null,
  updated_at timestamptz,
  unique (contact_group_id, type)
);

create table recovery_challenges (
  id text primary key,
  rate_key text not null,
  contact_rate_key text not null,
  ip_rate_key text not null,
  session_rate_key text not null,
  contact_cooldown_key text not null,
  ip_cooldown_key text not null,
  session_cooldown_key text not null,
  contact_id text references recovery_contacts(id) on delete cascade,
  code_hash text not null,
  attempts integer not null default 0 check (attempts between 0 and 5),
  delivery_status text not null default 'pending' check (delivery_status in ('pending', 'sent', 'failed', 'suppressed', 'superseded')),
  delivery_provider_id text,
  delivery_attempted_at timestamptz,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null,
  check (expires_at > created_at)
);

create table advisor_accounts (
  id text primary key,
  email text not null unique,
  name text not null,
  password_hash text not null,
  status text not null check (status in ('active', 'suspended', 'disabled')),
  force_password_change boolean not null default true,
  commission_amount integer not null check (commission_amount between 0 and 9900),
  created_at timestamptz not null,
  updated_at timestamptz
);

create table advisor_sessions (
  id text primary key,
  coach_id text not null references advisor_accounts(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null,
  check (expires_at > created_at)
);

create table advisor_clients (
  id text primary key,
  coach_id text not null references advisor_accounts(id) on delete restrict,
  name text,
  expected_contact_hash text not null,
  assessment_id text references assessments(id) on delete set null,
  invite_hash text not null unique,
  invite_expires_at timestamptz not null,
  invite_used_at timestamptz,
  resolved_session_id text references sessions(id) on delete set null,
  consent_status text not null check (consent_status in ('pending', 'consent_accepted', 'consent_declined')),
  consent_version text,
  consent_at timestamptz,
  commission_amount integer not null check (commission_amount between 0 and 9900),
  status text not null,
  created_at timestamptz not null,
  updated_at timestamptz,
  check (invite_expires_at > created_at)
);

alter table assessments
  add constraint assessments_coach_client_fk
  foreign key (coach_client_id) references advisor_clients(id) on delete set null;

create table advisor_commissions (
  id text primary key,
  coach_id text not null references advisor_accounts(id) on delete restrict,
  payment_id text not null references payments(id) on delete restrict,
  amount integer not null check (amount between 0 and 9900),
  status text not null check (status in ('pending', 'paid', 'cancelled')),
  created_at timestamptz not null,
  unique (payment_id)
);

create table advisor_report_access_logs (
  id text primary key,
  coach_id text not null references advisor_accounts(id) on delete restrict,
  assessment_id text not null references assessments(id) on delete restrict,
  allowed boolean not null,
  reason text not null,
  created_at timestamptz not null
);

create table admin_accounts (
  id text primary key,
  email text not null unique,
  password_hash text not null,
  status text not null check (status in ('active', 'disabled')),
  is_owner boolean not null default false,
  created_at timestamptz not null,
  updated_at timestamptz
);

create table admin_sessions (
  id text primary key,
  admin_id text not null references admin_accounts(id) on delete cascade,
  token_hash text not null unique,
  purpose text not null default 'admin' check (purpose in ('admin', 'preview')),
  parent_session_id text references admin_sessions(id) on delete cascade,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null,
  check (expires_at > created_at),
  check ((purpose = 'admin' and parent_session_id is null) or (purpose = 'preview' and parent_session_id is not null))
);

create table admin_audit_logs (
  id text primary key,
  admin_id text not null references admin_accounts(id) on delete restrict,
  action text not null,
  target_type text not null,
  target_id text not null,
  details jsonb not null,
  created_at timestamptz not null
);

create table data_deletion_requests (
  id text primary key,
  session_id text not null references sessions(id) on delete restrict,
  assessment_id text not null references assessments(id) on delete restrict,
  status text not null check (status in ('pending', 'completed', 'rejected')),
  created_at timestamptz not null,
  completed_at timestamptz
);

create table certification_records (
  id text primary key,
  kind text not null,
  status text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null
);

create index sessions_expires_at_idx on sessions (expires_at) where revoked_at is null;
create index safety_checks_session_idx on safety_checks (session_id, created_at desc);
create index assessments_session_idx on assessments (session_id, updated_at desc);
create index assessment_sessions_session_idx on assessment_sessions (session_id, created_at desc);
create index payments_session_assessment_idx on payments (session_id, assessment_id, product_code, created_at desc);
create index payments_status_expiry_idx on payments (status, expires_at);
create unique index payments_one_active_invoice_attempt_uidx on payments (session_id, assessment_id, product_code)
  where status in ('creating', 'create_unknown', 'reconciling', 'pending', 'checking', 'check_error');
create index recovery_contacts_hash_idx on recovery_contacts (type, contact_hash);
create index recovery_contacts_assessment_idx on recovery_contacts (assessment_id);
create index recovery_challenges_rate_idx on recovery_challenges (rate_key, created_at desc);
create index recovery_challenges_contact_rate_idx on recovery_challenges (contact_rate_key, created_at desc);
create index recovery_challenges_ip_rate_idx on recovery_challenges (ip_rate_key, created_at desc);
create index recovery_challenges_session_rate_idx on recovery_challenges (session_rate_key, created_at desc);
create unique index recovery_challenges_contact_cooldown_uidx on recovery_challenges (contact_cooldown_key);
create unique index recovery_challenges_ip_cooldown_uidx on recovery_challenges (ip_cooldown_key);
create unique index recovery_challenges_session_cooldown_uidx on recovery_challenges (session_cooldown_key);
create index recovery_challenges_contact_idx on recovery_challenges (contact_id, created_at desc);
create index advisor_sessions_token_idx on advisor_sessions (token_hash) where revoked_at is null;
create index advisor_clients_dashboard_idx on advisor_clients (coach_id, status, created_at desc);
create index advisor_clients_contact_idx on advisor_clients (expected_contact_hash);
create index advisor_commissions_dashboard_idx on advisor_commissions (coach_id, status, created_at desc);
create index advisor_access_log_idx on advisor_report_access_logs (coach_id, created_at desc);
create index admin_sessions_token_idx on admin_sessions (token_hash) where revoked_at is null;
create unique index admin_owner_preview_active_uidx on admin_sessions (admin_id) where purpose = 'preview' and revoked_at is null;
create index admin_audit_log_idx on admin_audit_logs (admin_id, created_at desc);
create unique index deletion_request_pending_idx on data_deletion_requests (assessment_id) where status = 'pending';

insert into schema_migrations (version) values ('2026071601_initial_certifiable_schema');

commit;
