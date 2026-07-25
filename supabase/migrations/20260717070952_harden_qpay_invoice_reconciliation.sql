alter table jingeehas.payments
  drop constraint if exists payments_status_check;

alter table jingeehas.payments
  add constraint payments_status_check
  check (status in (
    'creating', 'create_unknown', 'reconciling', 'pending', 'checking', 'paid',
    'create_error', 'create_failed_confirmed', 'check_error', 'expired', 'failed',
    'cancelled', 'paid_but_not_unlocked'
  ));

alter table jingeehas.payments
  add column if not exists request_fingerprint text,
  add column if not exists reconciliation_status text,
  add column if not exists replacement_for_payment_id text
    references jingeehas.payments(id) on delete restrict;

alter table jingeehas.payments
  add constraint payments_sender_invoice_no_length_check
  check (char_length(sender_invoice_no) <= 45) not valid;

create unique index if not exists payments_one_active_invoice_attempt_uidx
  on jingeehas.payments (session_id, assessment_id, product_code)
  where status in ('creating', 'create_unknown', 'reconciling', 'pending', 'checking', 'check_error');
