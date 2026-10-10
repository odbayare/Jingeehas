-- REVIEW ONLY. Generate a migration with a working Supabase CLI after approval.
begin;
create table jingeehas.gift_orders (
 id text primary key, session_id text not null references jingeehas.sessions(id),
 request_key text not null, note text not null check(length(note)<=280), amount integer not null check(amount=19900),
 sender_invoice_no text not null unique, invoice_id text unique, provider_payment_id text unique,
 status text not null check(status in ('creating','create_unknown','pending','paid','claimed','canceled')),
 qr_image text not null default '', urls jsonb not null default '[]', expires_at timestamptz,
 token_hash text unique check(token_hash ~ '^[a-f0-9]{64}$'), token_expires_at timestamptz,
 recovery_hash text unique check(recovery_hash ~ '^[a-f0-9]{64}$'),
 recipient_session_id text references jingeehas.sessions(id), assessment_id text unique references jingeehas.assessments(id),
 created_at timestamptz not null, paid_at timestamptz, claimed_at timestamptz,
 unique(session_id,request_key),
 check ((status in ('paid','claimed')) = (paid_at is not null)),
 check ((status='claimed') = (recipient_session_id is not null and assessment_id is not null and claimed_at is not null))
);
create unique index gift_one_unresolved_order_per_buyer on jingeehas.gift_orders(session_id) where status in ('creating','create_unknown','pending');
alter table jingeehas.gift_orders enable row level security;
revoke all on jingeehas.gift_orders from public, anon, authenticated;
grant select,insert,update on jingeehas.gift_orders to service_role;
alter table jingeehas.entitlements alter column payment_id drop not null;
alter table jingeehas.entitlements add column gift_order_id text unique references jingeehas.gift_orders(id);
alter table jingeehas.entitlements add constraint entitlement_one_purchase_source
 check ((payment_id is not null)::integer + (gift_order_id is not null)::integer = 1);

create function jingeehas.gift_request(request jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare
 op text := request->>'action'; sid text := request->>'sessionId';
 stamp timestamptz := now(); g jingeehas.gift_orders;
 aid text; scid text;
begin
 if coalesce(current_setting('request.jwt.claims',true),'{}')::jsonb->>'role' is distinct from 'service_role' then
   raise exception using errcode='42501',message='gateway_only';
 end if;
 -- Only the trusted gateway can invoke this RPC. Recheck session lifetime under lock.
 if op not in ('callback_lookup','confirm') then
   perform 1 from jingeehas.sessions where id=sid and revoked_at is null and expires_at>stamp for update;
   if not found then return jsonb_build_object('error','gift_unavailable'); end if;
 end if;
 if op='create' then
   select * into g from jingeehas.gift_orders where session_id=sid and request_key=request->>'requestKey';
   if found then return to_jsonb(g)||jsonb_build_object('created',false); end if;
   if exists(select 1 from jingeehas.gift_orders where session_id=sid and status in ('creating','create_unknown','pending')) then
     return jsonb_build_object('error','gift_invoice_reconciliation_required');
   end if;
   insert into jingeehas.gift_orders(id,session_id,request_key,note,amount,sender_invoice_no,status,created_at)
   values(request->>'id',sid,request->>'requestKey',request->>'note',(request->>'amount')::integer,request->>'senderInvoiceNo','creating',stamp)
   on conflict(session_id,request_key) do nothing returning * into g;
   if found then return to_jsonb(g)||jsonb_build_object('created',true); end if;
   select * into g from jingeehas.gift_orders where session_id=sid and request_key=request->>'requestKey';
   return to_jsonb(g)||jsonb_build_object('created',false);
 elsif op='callback_lookup' then
   select * into g from jingeehas.gift_orders where sender_invoice_no=request->>'senderInvoiceNo';
   return coalesce(to_jsonb(g),'{}');
 elsif op='recover' then
   select * into g from jingeehas.gift_orders where recovery_hash=request->>'recoveryHash' for update;
 elsif op in ('preview','claim') then
   select * into g from jingeehas.gift_orders where token_hash=request->>'tokenHash' for update;
 else
   select * into g from jingeehas.gift_orders where id=request->>'id' for update;
 end if;
 if g.id is null then return jsonb_build_object('error','gift_unavailable'); end if;
 if op not in ('confirm','preview','claim','recover') and g.session_id<>sid then return jsonb_build_object('error','gift_unavailable'); end if;
 if op='recover' then
   if g.status not in ('paid','claimed') then return jsonb_build_object('error','gift_unavailable'); end if;
   update jingeehas.gift_orders set session_id=sid where id=g.id returning * into g;
 elsif op='recovery_key' then
   if g.status not in ('paid','claimed') then return jsonb_build_object('error','gift_unavailable'); end if;
   update jingeehas.gift_orders set recovery_hash=request->>'recoveryHash' where id=g.id returning * into g;
 elsif op='buyer' then return to_jsonb(g);
 elsif op='invoice' and g.status='creating' then
   update jingeehas.gift_orders set status='pending', invoice_id=request->'invoice'->>'invoiceId',
     qr_image=coalesce(request->'invoice'->>'qrImage',''), urls=coalesce(request->'invoice'->'urls','[]'), expires_at=stamp+interval '15 minutes'
     where id=g.id returning * into g;
 elsif op='unknown' and g.status='creating' then
   update jingeehas.gift_orders set status='create_unknown' where id=g.id returning * into g;
 elsif op='confirm' then
   if g.status='pending' and g.invoice_id is not null and coalesce(request->>'providerPaymentId','')<>'' then
     update jingeehas.gift_orders set status='paid',paid_at=stamp,provider_payment_id=request->>'providerPaymentId'
       where id=g.id returning * into g;
   end if;
 elsif op='rotate' then
   if g.status<>'paid' then return jsonb_build_object('error','gift_unavailable'); end if;
   update jingeehas.gift_orders set token_hash=request->>'tokenHash',token_expires_at=stamp+interval '30 days'
     where id=g.id returning * into g;
 elsif op in ('preview','claim') then
   -- Successful retry by the same recipient resumes only that recipient's assessment.
   if g.status='claimed' then
     if g.recipient_session_id=sid then return jsonb_build_object('assessmentId',g.assessment_id,'nextRoute','/assessment/questions','claimed',true); end if;
     return jsonb_build_object('error','gift_unavailable');
   end if;
   if g.status<>'paid' or g.token_expires_at is null or g.token_expires_at<=stamp then
     return jsonb_build_object('error','gift_unavailable');
   end if;
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
 return to_jsonb(g);
end $$;
revoke all on function jingeehas.gift_request(jsonb) from public,anon,authenticated;
grant execute on function jingeehas.gift_request(jsonb) to service_role;
create function public.jingeehas_gift_request(request jsonb) returns jsonb
language sql security invoker set search_path='' as $$ select jingeehas.gift_request(request) $$;
revoke all on function public.jingeehas_gift_request(jsonb) from public,anon,authenticated;
grant execute on function public.jingeehas_gift_request(jsonb) to service_role;
commit;
