"use strict";
process.env.JINGEEHAS_DATABASE_API_KEY = "synthetic-local-only-gift-note-existing-credential-".repeat(2);
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { stripTypeScriptTypes } = require("node:module");
const { NativeGiftDatabase, disposableNative } = require("./support/native-gift-database.js");
const { deepCamelKeys } = require("../netlify/functions/_lib/store.js");
const { giftAction, confirmGift, supportGift } = require("../netlify/functions/_lib/gifting.js");
const { hashToken } = require("../netlify/functions/_lib/crypto.js");
const { PRODUCT } = require("../product-config.js");
async function run(pg) {
  console.log((await pg.query("select version() as version")).rows[0].version);
  await pg.exec("create schema jingeehas; create role anon; create role authenticated; create role service_role; grant usage on schema jingeehas to service_role;");
  const schema = fs.readFileSync("database/schema.sql","utf8");
  for (const table of ["sessions","safety_checks","assessments","assessment_sessions","payments","entitlements","admin_accounts","admin_sessions","admin_audit_logs"])
    await pg.exec(schema.match(new RegExp(`create table ${table} \\([\\s\\S]*?\\n\\);`))[0]);
  await pg.exec("alter table jingeehas.assessments add column questionnaire_version text; alter table jingeehas.assessments drop constraint assessments_commercial_flow_version_check; alter table jingeehas.assessments add check(commercial_flow_version in ('legacy_postpaid_v1','prepaid_v2','free_assessment_postpaid_v1'));");
  await pg.exec(fs.readFileSync("docs/gifting/schema-proposal.sql","utf8"));
  await pg.exec("insert into jingeehas.admin_accounts values('owner','owner@example.invalid','no-login-fixture','active',true,now(),null),('staff','staff@example.invalid','no-login-fixture','active',false,now(),null);");
  for (const [id,admin] of [["owner-session","owner"],["staff-session","staff"]])
    await pg.query("insert into jingeehas.admin_sessions(id,admin_id,token_hash,expires_at,created_at) values($1,$2,$3,clock_timestamp()+interval '1 hour',clock_timestamp())",[id,admin,hashToken(`${admin}-test`)]);
  await pg.exec(`insert into jingeehas.sessions values('ordinary','ordinary-hash',clock_timestamp(),clock_timestamp()+interval '1 hour',null);
    insert into jingeehas.safety_checks values('sc-ordinary','ordinary','{"route":"eligible"}',clock_timestamp());
    insert into jingeehas.assessments(id,session_id,safety_check_id,status,questionnaire_version,created_at,updated_at) values('wa-ordinary','ordinary','sc-ordinary','complete','v1',now(),now());
    insert into jingeehas.payments(id,session_id,assessment_id,product_code,amount,status,invoice_id,sender_invoice_no,provider_payment_id,created_at,updated_at) values('wp-ordinary','ordinary','wa-ordinary','WEIGHT_TEST_ONE_TIME',9900,'paid','ordinary-invoice','ordinary-ref','ordinary-provider-paid',now(),now());
    insert into jingeehas.entitlements(id,session_id,assessment_id,payment_id,product_code,status,granted_at) values('ordinary-entitlement','ordinary','wa-ordinary','wp-ordinary','WEIGHT_TEST_ONE_TIME','active',now());`);
  const ordinaryBaseline=(await pg.query("select to_jsonb(p) as row from jingeehas.payments p where id='wp-ordinary'")).rows[0].row;
  const db = {
    async giftRequest(input) { return deepCamelKeys((await pg.query("select public.jingeehas_gift_request($1::jsonb) as result",[JSON.stringify(input)],{role:"service_role"})).rows[0].result); },
    async get(table,id) { return deepCamelKeys((await pg.query(`select * from jingeehas.${table} where id=$1`,[id])).rows[0] || null); }
  };
  let sequence=0, creates=0;
  const key=()=>`${String(++sequence).padStart(8,"0")}-1234-1234-1234-123456789012`;
  const rows=new Map();
  const provider={async createInvoice(){creates++;return {invoiceId:`fixture-invoice-${creates}`,urls:[]};},async checkPayment(id){return {rows:rows.get(id)||[]};}};
  async function session(id, expires = "1 hour") { await pg.query(`insert into jingeehas.sessions values($1,$2,clock_timestamp(),clock_timestamp()+interval '${expires}',null)`,[id,hashToken(id)]); }
  async function order(label) { const sid=`buyer-${label}`;await session(sid);const view=await giftAction(db,provider,sid,{action:"create",requestKey:key()});return {sid,id:view.orderId,...await db.get("gift_orders",view.orderId)}; }
  async function paid(g) { rows.set(g.invoiceId,[{payment_status:"PAID",payment_amount:PRODUCT.amount,payment_id:`paid-${g.id}`}]);await confirmGift(db,provider,g.senderInvoiceNo); }
  const pids=await Promise.all(Array.from({length:4},()=>pg.query("select pg_backend_pid() as pid")));
  assert.equal(new Set(pids.map(x=>x.rows[0].pid)).size,4);console.log("PASS four separate native backend connections");
  // Racing duplicate invoice requests share the same session lock and create exactly one provider invoice.
  await session("buyer-create-race");const requestKey=key(),before=creates;
  const duplicate=await Promise.all(Array.from({length:8},()=>giftAction(db,provider,"buyer-create-race",{action:"create",requestKey})));
  assert.equal(new Set(duplicate.map(x=>x.orderId)).size,1);assert.equal(creates,before+1);
  console.log("PASS 8 concurrent creates: one stored order and one mocked provider invoice");
  for(let round=0;round<5;round++) {
    const g=await order(`claim-${round}`);await paid(g);const token=(await giftAction(db,provider,g.sid,{action:"link",orderId:g.id})).claimPath.split("#")[1];
    const recipients=Array.from({length:6},(_,i)=>`recipient-${round}-${i}`);for(const sid of recipients)await session(sid);
    const held=await pg.holdGift(g.id);const promises=recipients.map(sid=>giftAction(db,provider,sid,{action:"claim",token,accept:true}));
    const settled=Promise.allSettled(promises);await pg.waitForBlocked(6);await held.release();
    const claims=await settled;assert.equal(claims.filter(x=>x.status==="fulfilled").length,1);
    const winner=recipients[claims.findIndex(x=>x.status==="fulfilled")];const result=claims.find(x=>x.status==="fulfilled").value;
    assert.equal((await giftAction(db,provider,winner,{action:"claim",token,accept:true})).assessmentId,result.assessmentId);
    assert.equal((await pg.query("select count(*)::int as n from jingeehas.entitlements where gift_order_id=$1",[g.id])).rows[0].n,1);
    await assert.rejects(supportGift(db,provider,"owner-session",{action:"rebind_buyer",orderId:g.id,operationKey:key(),evidenceRef:"CASE_NATIVE_REBIND",buyerVerified:true,buyerSessionId:g.sid}),{code:"gift_state_conflict"});
  }
  console.log("PASS five held-lock claim races, six recipients each: one winner, atomic recipient ownership, replay and claimed-rebind denial");
  for(let round=0;round<6;round++) {
    const g=await order(`payment-cancel-${round}`);rows.set(g.invoiceId,[{payment_status:"PAID",payment_amount:PRODUCT.amount,payment_id:`paid-${g.id}`}]);
    const held=await pg.holdGift(g.id);
    const cancel=giftAction(db,provider,g.sid,{action:"cancel",orderId:g.id});const confirms=Array.from({length:4},()=>confirmGift(db,provider,g.senderInvoiceNo));
    const settled=Promise.allSettled([cancel,...confirms]);await pg.waitForBlocked(5);await held.release();await settled;
    const final=await db.get("gift_orders",g.id);assert(["paid","paid_review"].includes(final.status));assert(final.paidAt);assert.equal(final.providerPaymentId,`paid-${g.id}`);
    assert.equal((await pg.query("select count(*)::int as n from jingeehas.entitlements where gift_order_id=$1",[g.id])).rows[0].n,0);
    if(final.status==="paid_review") {await assert.rejects(giftAction(db,provider,g.sid,{action:"link",orderId:g.id}),{code:"gift_unavailable"});
      const release={action:"release_paid_value",orderId:g.id,operationKey:key(),evidenceRef:"CASE_NATIVE_CHOICE",buyerRequestedGift:true};
      const values=await Promise.all(Array.from({length:3},()=>supportGift(db,provider,"owner-session",release)));assert(values.every(x=>x.status==="paid"));
      assert.equal((await pg.query("select count(*)::int as n from jingeehas.gift_support_audit where operation_key=$1",[release.operationKey])).rows[0].n,1);
    }
  }
  console.log("PASS six held-lock cancellation/payment races and callback replays: every verified receipt preserved; no unpaid or duplicate entitlement");
  // Merchant-verified closure wins before a late callback: receipt must reopen into paid_review.
  const closed=await order("closed-late");await giftAction(db,provider,closed.sid,{action:"cancel",orderId:closed.id});
  await supportGift(db,provider,"owner-session",{action:"close_unpaid",orderId:closed.id,operationKey:key(),evidenceRef:"CASE_NATIVE_CLOSURE",providerClosedVerified:true});
  await paid(closed);assert.equal((await db.get("gift_orders",closed.id)).status,"paid_review");
  // Lost provider response: callback is retriable, owner attaches verified existing invoice, checks payment; no new create.
  await session("buyer-unknown");const unknown=await giftAction(db,{async createInvoice(){throw new Error("mock network loss");}},"buyer-unknown",{action:"create",requestKey:key()});
  const original=await db.get("gift_orders",unknown.orderId);assert.equal((await confirmGift(db,provider,original.senderInvoiceNo)).state,"retry");
  rows.set("merchant-recovered-invoice",[{payment_status:"PAID",payment_amount:PRODUCT.amount,payment_id:"paid-reconciled"}]);const createCount=creates;
  const attach={action:"attach_invoice",orderId:unknown.orderId,operationKey:key(),evidenceRef:"CASE_MERCHANT_LEDGER",invoiceId:"merchant-recovered-invoice",providerReferenceVerified:true};
  assert.equal((await supportGift(db,provider,"owner-session",attach)).status,"paid");assert.equal((await supportGift(db,provider,"owner-session",attach)).status,"paid");assert.equal(creates,createCount);
  await assert.rejects(supportGift(db,provider,"owner-session",{...attach,operationKey:key(),invoiceId:"unrelated-invoice"}),{code:"gift_state_conflict"});
  await session("buyer-overlap");const overlap=await giftAction(db,{async createInvoice(){throw new Error("fixture unknown");}},"buyer-overlap",{action:"create",requestKey:key()});
  await assert.rejects(supportGift(db,provider,"owner-session",{...attach,orderId:overlap.orderId,operationKey:key(),invoiceId:"ordinary-invoice"}),{code:"gift_state_conflict"});
  const conflict=await order("payment-source-conflict");rows.set(conflict.invoiceId,[{payment_status:"PAID",payment_amount:PRODUCT.amount,payment_id:"ordinary-provider-paid"}]);
  assert.equal((await confirmGift(db,provider,conflict.senderInvoiceNo)).state,"review");
  await assert.rejects(supportGift(db,provider,"owner-session",{action:"release_paid_value",orderId:conflict.id,operationKey:key(),evidenceRef:"CASE_PAYMENT_CONFLICT",buyerRequestedGift:true}),{code:"gift_state_conflict"});
  assert.deepEqual((await pg.query("select to_jsonb(p) as row from jingeehas.payments p where id='wp-ordinary'")).rows[0].row,ordinaryBaseline);
  console.log("PASS ordinary source isolation: merchant attachment cannot reuse ordinary invoice; payment-ID overlap holds without gift rights or ordinary-row mutation");
  await session("buyer-provider-expiry","0.5 seconds");
  const expiryCreate=await giftAction(db,{async createInvoice(){await new Promise(r=>setTimeout(r,550));return {invoiceId:"expiry-persisted-invoice",urls:[]};}},"buyer-provider-expiry",{action:"create",requestKey:key()});
  assert.equal(expiryCreate.status,"pending");assert.equal((await db.get("gift_orders",expiryCreate.orderId)).invoiceId,"expiry-persisted-invoice");
  await assert.rejects(giftAction(db,provider,"buyer-provider-expiry",{action:"status",orderId:expiryCreate.orderId}),{code:"gift_unavailable"});
  await session("buyer-recovered-unpaid");const unpaidUnknown=await giftAction(db,{async createInvoice(){throw new Error("fixture timeout");}},"buyer-recovered-unpaid",{action:"create",requestKey:key()});
  const unpaidAttachment={...attach,orderId:unpaidUnknown.orderId,operationKey:key(),invoiceId:"merchant-recovered-unpaid"};
  assert.equal((await supportGift(db,provider,"owner-session",unpaidAttachment)).status,"pending");
  await assert.rejects(giftAction(db,provider,"buyer-recovered-unpaid",{action:"link",orderId:unpaidUnknown.orderId}),{code:"gift_unavailable"});
  assert.equal((await pg.query("select count(*)::int as n from jingeehas.entitlements where gift_order_id=$1",[unpaidUnknown.orderId])).rows[0].n,0);
  console.log("PASS in-flight invoice persistence after buyer session expires and unpaid merchant attachment: no paid rights");
  console.log("PASS missing-invoice recovery and late payment after verified closure; immutable invoice binding; no replacement invoice");
  // Waiting claims must recheck current time rather than the transaction-start timestamp.
  const expired=await order("expiry-lock");await paid(expired);const expiryToken=(await giftAction(db,provider,expired.sid,{action:"link",orderId:expired.id})).claimPath.split("#")[1];
  await session("recipient-expiring");await pg.query("update jingeehas.gift_orders set token_expires_at=clock_timestamp()+interval '0.6 seconds' where id=$1",[expired.id]);
  const lock=await pg.holdGift(expired.id);const claim=giftAction(db,provider,"recipient-expiring",{action:"claim",token:expiryToken,accept:true});const expiration=Promise.allSettled([claim]);
  await pg.waitForBlocked();await new Promise(r=>setTimeout(r,650));await lock.release();assert.equal((await expiration)[0].status,"rejected");
  const sessionExpiry=await order("session-expiry");await paid(sessionExpiry);
  const sessionToken=(await giftAction(db,provider,sessionExpiry.sid,{action:"link",orderId:sessionExpiry.id})).claimPath.split("#")[1];
  await session("short-recipient","0.6 seconds");const sessionLock=await pg.holdGift(sessionExpiry.id);
  const delayedClaim=Promise.allSettled([giftAction(db,provider,"short-recipient",{action:"claim",token:sessionToken,accept:true})]);
  await pg.waitForBlocked();await new Promise(r=>setTimeout(r,650));await sessionLock.release();assert.equal((await delayedClaim)[0].status,"rejected");
  const rollback=await order("rollback");await paid(rollback);await session("rollback-recipient");
  const rollbackToken=(await giftAction(db,provider,rollback.sid,{action:"link",orderId:rollback.id})).claimPath.split("#")[1];
  await pg.exec(`create function jingeehas.native_fixture_reject() returns trigger language plpgsql as $$ begin raise exception 'native fixture rollback'; end $$;
    create trigger reject_gift_fixture before insert on jingeehas.entitlements for each row when(new.gift_order_id='${rollback.id}') execute function jingeehas.native_fixture_reject();`);
  await assert.rejects(giftAction(db,provider,"rollback-recipient",{action:"claim",token:rollbackToken,accept:true}));
  assert.equal((await db.get("gift_orders",rollback.id)).status,"paid");
  assert.equal((await pg.query("select count(*)::int as n from jingeehas.assessments where session_id='rollback-recipient'")).rows[0].n,0);
  assert.equal((await pg.query("select count(*)::int as n from jingeehas.safety_checks where session_id='rollback-recipient'")).rows[0].n,0);
  await pg.exec("drop trigger reject_gift_fixture on jingeehas.entitlements;");
  console.log("PASS native session expiry during lock wait and forced mid-claim rollback: no consumed gift or orphan assessment/safety row");
  const rebound=await order("rebind-race");await paid(rebound);
  const rebindToken=(await giftAction(db,provider,rebound.sid,{action:"link",orderId:rebound.id})).claimPath.split("#")[1];
  await session("rebind-target");await session("rebind-recipient");
  const rebindLock=await pg.holdGift(rebound.id);
  const rebindOperations=Promise.allSettled([
    supportGift(db,provider,"owner-session",{action:"rebind_buyer",orderId:rebound.id,operationKey:key(),evidenceRef:"CASE_NATIVE_RECOVERY",buyerVerified:true,buyerSessionId:"rebind-target"}),
    giftAction(db,provider,"rebind-recipient",{action:"claim",token:rebindToken,accept:true})]);
  await pg.waitForBlocked(2);await rebindLock.release();
  assert.equal((await rebindOperations).filter(x=>x.status==="fulfilled").length,1);
  const reboundState=await db.get("gift_orders",rebound.id);
  if(reboundState.status==="claimed")assert.equal(reboundState.recipientSessionId,"rebind-recipient");
  else {assert.equal(reboundState.status,"paid");assert.equal(reboundState.sessionId,"rebind-target");assert.equal(reboundState.tokenHash,null);}
  assert.equal((await pg.query("select count(*)::int as n from jingeehas.assessment_sessions")).rows[0].n,0);
  assert.equal((await pg.query("select count(*)::int as n from jingeehas.payments where id<>'wp-ordinary'")).rows[0].n,0);
  console.log("PASS claim/support-recovery race: either recipient claim wins or old capabilities revoke; no purchaser assessment access or ordinary payment rows");
  process.env.NODE_ENV="test";require("../netlify/functions/_lib/store.js").setDatabaseForTests(db);
  const endpoint=require("../netlify/functions/gift-support.js").handler;
  const event={httpMethod:"POST",headers:{host:"jingeehas.fit",origin:"https://jingeehas.fit"},body:JSON.stringify({action:"lookup",orderId:expired.id})};
  assert.equal((await endpoint(event)).statusCode,401);
  assert.equal((await endpoint({...event,headers:{...event.headers,cookie:"jingeehas_admin=staff-session.staff-test"}})).statusCode,403);
  const ownerResponse=await endpoint({...event,headers:{...event.headers,cookie:"jingeehas_admin=owner-session.owner-test"}});
  assert.equal(ownerResponse.statusCode,200);const publicSupport=JSON.parse(ownerResponse.body);
  for(const field of ["note","tokenHash","recoveryHash","recipientSessionId","assessmentId"])assert(!(field in publicSupport));
  assert.equal((await endpoint({...event,headers:{...event.headers,origin:"https://evil.test",cookie:"jingeehas_admin=owner-session.owner-test"}})).statusCode,403);
  console.log("PASS support HTTP: session credential and owner role required; same-origin enforced; no recipient/capability fields in projection");
  // Actual service-role execution, anon/authenticated denial, non-owner and expired/revoked owner sessions.
  for(const role of ["anon","authenticated"]) {await assert.rejects(pg.query("select public.jingeehas_gift_request('{}'::jsonb)",[],{role}));await assert.rejects(pg.query("select * from jingeehas.gift_orders",[],{role}));}
  await assert.rejects(pg.query("select public.jingeehas_gift_request('{}'::jsonb)",[],{role:"service_role",claims:"anon"}));
  await assert.rejects(supportGift(db,provider,"staff-session",{action:"lookup",orderId:expired.id}),{code:"owner_required"});
  await pg.exec("update jingeehas.admin_sessions set revoked_at=clock_timestamp() where id='owner-session'");
  await assert.rejects(supportGift(db,provider,"owner-session",{action:"lookup",orderId:expired.id}),{code:"owner_required"});await pg.exec("update jingeehas.admin_sessions set revoked_at=null where id='owner-session'");
  console.log("PASS native role/owner permissions and expiration while a claim waits for lock");
  // Execute actual gateway handler with mock HTTP only; its RPC goes to this disposable native database.
  let gatewayHandler, rpcCalls=0;
  const secret="gateway-fixture-only-".repeat(3), source=fs.readFileSync("supabase/functions/jingeehas-database-gateway/index.ts","utf8").replace(/^import .*\n/,"");
  const env={JINGEEHAS_GATEWAY_SECRET:secret,SUPABASE_URL:"https://fixture.invalid",SUPABASE_SERVICE_ROLE_KEY:"fixture-service-role"};
  const context={Request,Response,TextEncoder,TextDecoder,Uint8Array,AbortSignal,Deno:{env:{get:k=>env[k]},serve:h=>{gatewayHandler=h;}},fetch:async(url,options)=>{
    rpcCalls++;const body=JSON.parse(options.body);if(url.endsWith("jingeehas_gift_request"))return new Response(JSON.stringify((await pg.query("select public.jingeehas_gift_request($1::jsonb) as result",[JSON.stringify(body.request)],{role:"service_role"})).rows[0].result),{status:200});
    assert(url.endsWith("jingeehas_execute_request"));return new Response(JSON.stringify({ordinaryAction:body.request.action}),{status:200});}};
  vm.runInNewContext(stripTypeScriptTypes(source),context);
  const call=(bearer,input)=>gatewayHandler(new Request("https://gateway.fixture.invalid/transaction",{method:"POST",headers:{authorization:`Bearer ${bearer}`,"content-type":"application/json"},body:JSON.stringify(input)}));
  assert.equal((await call("wrong",{action:"gift_request",input:{action:"support_lookup"}})).status,401);assert.equal(rpcCalls,0);
  assert.equal((await call("sb_secret_fake",{})).status,401);
  const routed=await call(secret,{action:"gift_request",input:{action:"buyer",id:expired.id,sessionId:expired.sid}});assert.equal(routed.status,200);assert.equal((await routed.json()).id,expired.id);
  const denied=await call(secret,{action:"gift_request",input:{action:"buyer",id:expired.id,sessionId:"unknown"}});assert.equal((await denied.json()).error,"gift_unavailable");
  const ordinary=await call(secret,{action:"get",table:"payments",id:"ordinary"});assert.equal((await ordinary.json()).ordinaryAction,"get");
  console.log("PASS actual gateway handler: dedicated auth, credential-type rejection, service-only gift RPC, customer ownership and unchanged ordinary dispatch");
}
(async()=>{if(process.env.JINGEEHAS_NATIVE_SOCKET)await run(new NativeGiftDatabase(process.env.JINGEEHAS_NATIVE_SOCKET));else await disposableNative(run);console.log("NATIVE_GIFTING_STATUS=PASS");})().catch(error=>{console.error(error);process.exit(1);});
