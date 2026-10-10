-- REVIEW ONLY: not applied or approved for release.
begin;
create table jingeehas.gift_orders (
 id text primary key, session_id text not null references jingeehas.sessions(id),
 request_key text not null, note text not null check(length(note)<=280), amount integer not null check(amount=19900),
 sender_invoice_no text not null unique, invoice_id text unique, provider_payment_id text unique,
 status text not null check(status in ('creating','create_unknown','pending','paid','paid_review','claimed','canceled','closed_unpaid')),
 qr_image text not null default '', urls jsonb not null default '[]', expires_at timestamptz,
 token_hash text unique check(token_hash ~ '^[a-f0-9]{64}$'), token_expires_at timestamptz,
 recovery_hash text unique check(recovery_hash ~ '^[a-f0-9]{64}$'), review_reason text,
 recipient_session_id text references jingeehas.sessions(id), assessment_id text unique references jingeehas.assessments(id),
 created_at timestamptz not null, paid_at timestamptz, claimed_at timestamptz,
 unique(session_id,request_key),
 check ((status in ('paid','paid_review','claimed')) = (paid_at is not null)),
 check ((status='claimed' and recipient_session_id is not null and assessment_id is not null and claimed_at is not null) or
        (status<>'claimed' and recipient_session_id is null and assessment_id is null and claimed_at is null))
);
-- A local cancellation is not evidence that the merchant invoice cannot collect funds.
create unique index gift_one_unresolved_order_per_buyer on jingeehas.gift_orders(session_id) where status in ('creating','create_unknown','pending','canceled');
create table jingeehas.gift_support_audit (
 operation_key text primary key, order_id text not null references jingeehas.gift_orders(id),
 admin_id text not null references jingeehas.admin_accounts(id), action text not null,
 evidence_ref text not null check(evidence_ref ~ '^[A-Za-z0-9_-]{8,80}$'),
 state_before text not null, state_after text not null, created_at timestamptz not null
);
alter table jingeehas.gift_orders enable row level security;
alter table jingeehas.gift_support_audit enable row level security;
revoke all on jingeehas.gift_orders,jingeehas.gift_support_audit from public, anon, authenticated;
grant select,insert,update on jingeehas.gift_orders to service_role;
grant select,insert on jingeehas.gift_support_audit to service_role;
alter table jingeehas.entitlements alter column payment_id drop not null;
alter table jingeehas.entitlements add column gift_order_id text unique references jingeehas.gift_orders(id);
alter table jingeehas.entitlements add constraint entitlement_one_purchase_source
 check ((payment_id is not null)::integer + (gift_order_id is not null)::integer = 1);

create function jingeehas.gift_request(request jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare
 op text := request->>'action'; sid text := request->>'sessionId';
 stamp timestamptz := clock_timestamp(); g jingeehas.gift_orders;
 aid text; scid text; owner_id text; previous_state text; audit_row jingeehas.gift_support_audit;
 support_action boolean := coalesce(request->>'action','') like 'support_%';
begin
 if coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb->>'role' is distinct from 'service_role' then
   raise exception using errcode='42501',message='gateway_only';
 end if;
 if support_action then
   select a.id into owner_id from jingeehas.admin_sessions s join jingeehas.admin_accounts a on a.id=s.admin_id
   where s.id=request->>'adminSessionId' and s.purpose='admin' and s.revoked_at is null and s.expires_at>stamp
     and a.status='active' and a.is_owner for share of s,a;
   if not found then return jsonb_build_object('error','owner_required'); end if;
   if op='support_rebind_buyer' then
     perform 1 from jingeehas.sessions where id=request->>'buyerSessionId' and revoked_at is null and expires_at>stamp for update;
     if not found then return jsonb_build_object('error','gift_unavailable'); end if;
   end if;
 elsif op not in ('callback_lookup','callback_wait','provider_invoice','confirm') then
   perform 1 from jingeehas.sessions where id=sid and revoked_at is null and expires_at>stamp for update;
   if not found then return jsonb_build_object('error','gift_unavailable'); end if;
 end if;
 stamp := clock_timestamp();
 if op='create' then
   if not exists(select 1 from jingeehas.sessions where id=sid and revoked_at is null and expires_at>stamp) then return jsonb_build_object('error','gift_unavailable'); end if;
   select * into g from jingeehas.gift_orders where session_id=sid and request_key=request->>'requestKey';
   if found then return to_jsonb(g)||jsonb_build_object('created',false); end if;
   if exists(select 1 from jingeehas.gift_orders where session_id=sid and status in ('creating','create_unknown','pending','canceled')) then
     return jsonb_build_object('error','gift_invoice_reconciliation_required');
   end if;
   insert into jingeehas.gift_orders(id,session_id,request_key,note,amount,sender_invoice_no,status,created_at)
   values(request->>'id',sid,request->>'requestKey',request->>'note',(request->>'amount')::integer,request->>'senderInvoiceNo','creating',stamp)
   returning * into g;
   return to_jsonb(g)||jsonb_build_object('created',true);
 elsif op='callback_lookup' then
   select * into g from jingeehas.gift_orders where sender_invoice_no=request->>'senderInvoiceNo';
   return coalesce(to_jsonb(g),'{}');
 elsif op='recover' then
   select * into g from jingeehas.gift_orders where recovery_hash=request->>'recoveryHash' for update;
 elsif op in ('preview','claim') then
   select * into g from jingeehas.gift_orders where token_hash=request->>'tokenHash' for update;
 elsif op='buyer' and coalesce(request->>'id','')='' then
   select * into g from jingeehas.gift_orders where session_id=sid and request_key=request->>'requestKey' for update;
 else
   select * into g from jingeehas.gift_orders where id=request->>'id' for update;
 end if;
 if g.id is null then return jsonb_build_object('error','gift_unavailable'); end if;
 -- Locks can wait: validate time-sensitive credentials against current wall time again.
 stamp := clock_timestamp();
 if support_action then
   if not exists(select 1 from jingeehas.admin_sessions s join jingeehas.admin_accounts a on a.id=s.admin_id
     where s.id=request->>'adminSessionId' and s.revoked_at is null and s.expires_at>stamp and s.purpose='admin'
     and a.is_owner and a.status='active') then return jsonb_build_object('error','owner_required'); end if;
 elsif op not in ('callback_wait','provider_invoice','confirm') then
   if not exists(select 1 from jingeehas.sessions where id=sid and revoked_at is null and expires_at>stamp) then return jsonb_build_object('error','gift_unavailable'); end if;
 end if;
 if not support_action and op not in ('confirm','callback_wait','provider_invoice','preview','claim','recover') and g.session_id<>sid then
   return jsonb_build_object('error','gift_unavailable');
 end if;
 previous_state := g.status;
 if support_action and op<>'support_lookup' then
   if coalesce(request->>'operationKey','') !~ '^[a-f0-9-]{36}$' or coalesce(request->>'evidenceRef','') !~ '^[A-Za-z0-9_-]{8,80}$' then return jsonb_build_object('error','support_evidence_required'); end if;
   select * into audit_row from jingeehas.gift_support_audit where operation_key=request->>'operationKey';
   if found then
     if audit_row.order_id<>g.id or audit_row.admin_id<>owner_id or audit_row.action<>op or audit_row.evidence_ref<>request->>'evidenceRef' then return jsonb_build_object('error','support_operation_conflict'); end if;
     return to_jsonb(g);
   end if;
 end if;
 if op='support_lookup' then return to_jsonb(g);
 elsif op='support_attach_invoice' then
   if coalesce((request->>'providerReferenceVerified')::boolean,false) is not true or coalesce(request->>'invoiceId','') !~ '^[A-Za-z0-9_-]{1,128}$' or
     exists(select 1 from jingeehas.payments where invoice_id=request->>'invoiceId') or
     (g.status='creating' and g.created_at>stamp-interval '2 minutes') or
     g.status not in ('creating','create_unknown','canceled','closed_unpaid') or (g.invoice_id is not null and g.invoice_id<>request->>'invoiceId') then return jsonb_build_object('error','gift_state_conflict'); end if;
   update jingeehas.gift_orders set invoice_id=request->>'invoiceId',status=case when g.status in ('canceled','closed_unpaid') then g.status else 'pending' end,
     review_reason=null where id=g.id returning * into g;
 elsif op='support_close_unpaid' then
   if coalesce((request->>'providerClosedVerified')::boolean,false) is not true or g.paid_at is not null or g.status not in ('creating','create_unknown','pending','canceled') then return jsonb_build_object('error','gift_state_conflict'); end if;
   update jingeehas.gift_orders set status='closed_unpaid',review_reason='provider_closure_verified' where id=g.id returning * into g;
 elsif op='support_release_paid_value' then
   if g.status<>'paid_review' or g.paid_at is null or g.review_reason='payment_source_conflict' or coalesce((request->>'buyerRequestedGift')::boolean,false) is not true then return jsonb_build_object('error','gift_state_conflict'); end if;
   update jingeehas.gift_orders set status='paid',review_reason=null where id=g.id returning * into g;
 elsif op='support_rebind_buyer' then
   if g.status='claimed' or coalesce((request->>'buyerVerified')::boolean,false) is not true or not exists(
     select 1 from jingeehas.sessions where id=request->>'buyerSessionId' and revoked_at is null and expires_at>stamp) then return jsonb_build_object('error','gift_state_conflict'); end if;
   update jingeehas.gift_orders set session_id=request->>'buyerSessionId',token_hash=null,token_expires_at=null,recovery_hash=null where id=g.id returning * into g;
 elsif op='recover' then
   if g.status not in ('paid','paid_review','claimed') then return jsonb_build_object('error','gift_unavailable'); end if;
   update jingeehas.gift_orders set session_id=sid where id=g.id returning * into g;
 elsif op='recovery_key' then
   if g.status not in ('paid','paid_review','claimed') then return jsonb_build_object('error','gift_unavailable'); end if;
   update jingeehas.gift_orders set recovery_hash=request->>'recoveryHash' where id=g.id returning * into g;
 elsif op='buyer' then return to_jsonb(g);
 elsif op='provider_invoice' then
   if g.status not in ('creating','create_unknown','pending','canceled') or (g.invoice_id is not null and g.invoice_id<>request->'invoice'->>'invoiceId') then return jsonb_build_object('error','gift_state_conflict'); end if;
   update jingeehas.gift_orders set status=case when g.status='canceled' then 'canceled' else 'pending' end, invoice_id=request->'invoice'->>'invoiceId',
     qr_image=coalesce(request->'invoice'->>'qrImage',''), urls=coalesce(request->'invoice'->'urls','[]'), expires_at=stamp+interval '15 minutes',review_reason=null
     where id=g.id returning * into g;
 elsif op in ('unknown','callback_wait') then
   if g.status='creating' then update jingeehas.gift_orders set status='create_unknown',review_reason='invoice_lookup_required' where id=g.id returning * into g; end if;
 elsif op='cancel' then
   if g.paid_at is not null or g.status not in ('creating','create_unknown','pending','canceled') then return jsonb_build_object('error','gift_state_conflict'); end if;
   update jingeehas.gift_orders set status='canceled',review_reason='provider_closure_required' where id=g.id returning * into g;
 elsif op='confirm' then
   if g.status in ('pending','canceled','closed_unpaid','creating','create_unknown') and g.invoice_id is not null and coalesce(request->>'providerPaymentId','')<>'' then
     update jingeehas.gift_orders set status=case when g.status in ('canceled','closed_unpaid') or exists(select 1 from jingeehas.payments where provider_payment_id=request->>'providerPaymentId') then 'paid_review' else 'paid' end,
       paid_at=stamp,provider_payment_id=request->>'providerPaymentId',
       review_reason=case when exists(select 1 from jingeehas.payments where provider_payment_id=request->>'providerPaymentId') then 'payment_source_conflict' when g.status in ('canceled','closed_unpaid') then 'paid_after_cancellation' else null end where id=g.id returning * into g;
   end if;
 elsif op='rotate' then
   if g.status<>'paid' or coalesce((request->>'linkLifetimeSeconds')::integer,0) not between 86400 and 31536000 then return jsonb_build_object('error','gift_unavailable'); end if;
   update jingeehas.gift_orders set token_hash=request->>'tokenHash',token_expires_at=stamp+make_interval(secs=>(request->>'linkLifetimeSeconds')::integer)
     where id=g.id returning * into g;
 elsif op in ('preview','claim') then
   if g.status='claimed' then
     if g.recipient_session_id=sid then return jsonb_build_object('assessmentId',g.assessment_id,'nextRoute','/assessment/questions','claimed',true); end if;
     return jsonb_build_object('error','gift_unavailable');
   end if;
   if g.status<>'paid' or g.token_expires_at is null or g.token_expires_at<=stamp then return jsonb_build_object('error','gift_unavailable'); end if;
   if op='preview' then return jsonb_build_object('note',g.note); end if;
   aid := request->>'assessmentId'; scid := request->>'safetyCheckId';
   insert into jingeehas.safety_checks(id,session_id,result,created_at)
     values(scid,sid,'{"route":"pending_assessment","mode":"pending","category":"assessment_safety_questions"}',stamp);
   insert into jingeehas.assessments(id,session_id,safety_check_id,status,commercial_flow_version,questionnaire_version,created_at,updated_at)
     values(aid,sid,scid,'draft','free_assessment_postpaid_v1',request->>'questionnaireVersion',stamp,stamp);
   insert into jingeehas.entitlements(id,session_id,assessment_id,payment_id,gift_order_id,product_code,status,granted_at)
     values(aid||':WEIGHT_TEST_ONE_TIME',sid,aid,null,g.id,'WEIGHT_TEST_ONE_TIME','active',stamp);
   update jingeehas.gift_orders set status='claimed',recipient_session_id=sid,assessment_id=aid,claimed_at=stamp where id=g.id;
   return jsonb_build_object('assessmentId',aid,'nextRoute','/assessment/questions');
 else return jsonb_build_object('error','gift_state_conflict');
 end if;
 if support_action then
   insert into jingeehas.gift_support_audit values(request->>'operationKey',g.id,owner_id,op,request->>'evidenceRef',previous_state,g.status,stamp);
 end if;
 return to_jsonb(g);
end $$;
revoke all on function jingeehas.gift_request(jsonb) from public,anon,authenticated;
grant execute on function jingeehas.gift_request(jsonb) to service_role;
create function public.jingeehas_gift_request(request jsonb) returns jsonb
language sql security invoker set search_path='' as $$ select jingeehas.gift_request(request) $$;
revoke all on function public.jingeehas_gift_request(jsonb) from public,anon,authenticated;
grant execute on function public.jingeehas_gift_request(jsonb) to service_role;
commit;
