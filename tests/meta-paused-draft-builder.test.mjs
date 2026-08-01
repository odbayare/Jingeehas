import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  PRODUCT_CODE,
  DAILY_BUDGET_MINOR,
  CAMPAIGN_NAME,
  buildPlan,
  assertNoSensitivePayload,
  validatePlan,
  requireExecutionGuards,
  preflight,
  executePaused
} from "../tools/meta-jingeehas-draft.mjs";

const IDS = Object.freeze({
  account: "981721134334269",
  page: "1166984263175073",
  pixel: "1009020441881954",
  instagram: "17841400000000000",
  existing: "52503252094202"
});
const TOKEN = "test-marketing-token-that-is-longer-than-forty-characters";

function baseEnv(overrides = {}) {
  return {
    META_GRAPH_API_VERSION: "v25.0",
    META_MARKETING_ACCESS_TOKEN: TOKEN,
    META_AD_ACCOUNT_ID: IDS.account,
    META_PAGE_ID: IDS.page,
    META_PIXEL_ID: IDS.pixel,
    META_INSTAGRAM_ACTOR_ID: IDS.instagram,
    META_PRODUCT_CODE: PRODUCT_CODE,
    META_SHARED_ACCOUNT_ACK: "JINGEEHAS_ISOLATION_APPROVED",
    META_AUDIO_RIGHTS_CONFIRMED: "true",
    META_MONTHLY_CAP_USD: "30",
    META_EXISTING_JINGEEHAS_CAMPAIGN_ID: IDS.existing,
    ...overrides
  };
}

function jsonResponse(payload, status = 200) {
  return { ok: status >= 200 && status < 300, status, async json() { return payload; } };
}

function mockGraph({ activeExisting = false, failCreative = false } = {}) {
  const calls = [];
  const fetchImpl = async (input, init = {}) => {
    const url = input instanceof URL ? input : new URL(input);
    const pathname = url.pathname.replace(/^\/v25\.0\//, "");
    const method = init.method || "GET";
    calls.push({ pathname, method, url: url.toString(), headers: init.headers || {}, body: init.body });

    if (method === "GET" && pathname === `act_${IDS.account}`) return jsonResponse({ id: `act_${IDS.account}`, name: "Enkh-Od-Ads", business: { id: "100000000000001", name: "Shared Portfolio" }, currency: "USD", timezone_name: "Asia/Ulaanbaatar", account_status: 1, disable_reason: 0, spend_cap: "0", amount_spent: "1000", balance: "0", instagram_accounts: { data: [{ id: IDS.instagram, username: "jingeehas" }] } });
    if (method === "GET" && pathname === IDS.page) return jsonResponse({ id: IDS.page, name: "Жингээ Хас", instagram_business_account: { id: IDS.instagram, username: "jingeehas" } });
    if (method === "GET" && pathname === IDS.pixel) return jsonResponse({ id: IDS.pixel, name: "JINGEEHAS Dataset", is_unavailable: false, last_fired_time: "2026-08-01T07:00:00+0000" });
    if (method === "GET" && pathname === `act_${IDS.account}/campaigns`) return jsonResponse({ data: activeExisting ? [{ id: IDS.existing, name: "JINGEEHAS | Existing", status: "ACTIVE", effective_status: "ACTIVE", objective: "OUTCOME_SALES", daily_budget: "300" }] : [] });

    if (method === "POST" && pathname === `act_${IDS.account}/campaigns`) return jsonResponse({ id: "120000000000001" });
    if (method === "POST" && pathname === `act_${IDS.account}/adsets`) return jsonResponse({ id: "120000000000002" });
    if (method === "POST" && pathname === `act_${IDS.account}/advideos`) return jsonResponse({ id: "120000000000003" });
    if (method === "POST" && pathname === `act_${IDS.account}/adcreatives`) {
      if (failCreative) return jsonResponse({ error: { code: 100, error_subcode: 1815007 } }, 400);
      return jsonResponse({ id: "120000000000004" });
    }
    if (method === "POST" && pathname === `act_${IDS.account}/ads`) return jsonResponse({ id: "120000000000005" });

    if (method === "GET" && pathname === "120000000000001") return jsonResponse({ id: pathname, name: CAMPAIGN_NAME, status: "PAUSED", effective_status: "PAUSED", objective: "OUTCOME_SALES", buying_type: "AUCTION", special_ad_categories: [] });
    if (method === "GET" && pathname === "120000000000002") return jsonResponse({ id: pathname, name: "JINGEEHAS | MN | Broad 25-65 | Purchase | USD3 | V1", status: "PAUSED", effective_status: "PAUSED", daily_budget: String(DAILY_BUDGET_MINOR), bid_strategy: "LOWEST_COST_WITHOUT_CAP", billing_event: "IMPRESSIONS", optimization_goal: "OFFSITE_CONVERSIONS", targeting: { age_min: 25, age_max: 65, geo_locations: { countries: ["MN"] } }, promoted_object: { pixel_id: IDS.pixel, custom_event_type: "PURCHASE" }, campaign_id: "120000000000001" });
    if (method === "GET" && pathname === "120000000000004") return jsonResponse({ id: pathname, name: "JINGEEHAS | Paid Cut V1 | Video | 9x16", status: "ACTIVE", object_story_id: `${IDS.page}_1`, object_type: "VIDEO" });
    if (method === "GET" && pathname === "120000000000005") return jsonResponse({ id: pathname, name: "JINGEEHAS | Paid Cut V1 | Learn More | V1", status: "PAUSED", effective_status: "PAUSED", adset_id: "120000000000002", creative: { id: "120000000000004" } });
    if (method === "DELETE") return jsonResponse({ success: true });
    throw new Error(`unexpected_graph_call:${method}:${pathname}`);
  };
  return { fetchImpl, calls };
}

function formParams(call) {
  assert(call.body instanceof URLSearchParams, `${call.pathname} must use URLSearchParams`);
  return Object.fromEntries(call.body.entries());
}

const plan = validatePlan(buildPlan(baseEnv()));
assert.equal(plan.mode, "DRAFT_ONLY");
assert.equal(plan.product.productCode, PRODUCT_CODE);
assert.equal(plan.campaign.status, "PAUSED");
assert.equal(plan.adset.status, "PAUSED");
assert.equal(plan.ad.status, "PAUSED");
assert.equal(plan.adset.daily_budget, 300);
assert.equal(plan.adset.promoted_object.custom_event_type, "PURCHASE");
assert.equal(plan.guardrails.activeMutationAllowed, false);
assert.match(plan.approvalFingerprint, /^[a-f0-9]{64}$/);
assert.doesNotThrow(() => assertNoSensitivePayload({ product_code: PRODUCT_CODE, content_ids: [PRODUCT_CODE] }));
assert.throws(() => assertNoSensitivePayload({ custom_data: { weight_kg: 90 } }), /sensitive_payload_key/);
assert.throws(() => validatePlan({ ...structuredClone(plan), campaign: { ...plan.campaign, status: "ACTIVE" } }), /active_status_forbidden/);

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "jingeehas-meta-draft-"));
const mediaPath = path.join(temp, "paid-cut.mp4");
fs.writeFileSync(mediaPath, Buffer.from("mock-mp4"));
const env = baseEnv();
env.META_APPROVAL_FINGERPRINT = plan.approvalFingerprint;
assert.doesNotThrow(() => requireExecutionGuards(env, plan, mediaPath));
assert.throws(() => requireExecutionGuards({ ...env, META_MONTHLY_CAP_USD: "" }, plan, mediaPath), /monthly_cap_missing/);
assert.throws(() => requireExecutionGuards({ ...env, META_AUDIO_RIGHTS_CONFIRMED: "false" }, plan, mediaPath), /audio_rights_unconfirmed/);
assert.throws(() => requireExecutionGuards({ ...env, META_APPROVAL_FINGERPRINT: "wrong" }, plan, mediaPath), /approval_fingerprint_mismatch/);

const pfMock = mockGraph();
const pf = await preflight(env, pfMock.fetchImpl);
assert.equal(pf.status, "PASS");
assert.deepEqual(pf.issues, []);
assert.equal(pf.account.currency, "USD");
assert.equal(pf.instagram.id, IDS.instagram);
const blockedPf = await preflight(env, mockGraph({ activeExisting: true }).fetchImpl);
assert.equal(blockedPf.status, "BLOCKED");
assert(blockedPf.issues.includes("existing_active_jingeehas_campaign"));

const executionMock = mockGraph();
const executed = await executePaused(env, mediaPath, executionMock.fetchImpl);
assert.equal(executed.operation, "create_jingeehas_paused_meta_draft");
assert.equal(executed.budgetImpact.configuredDailyBudgetUsd, 3);
assert.equal(executed.budgetImpact.currentSpendMutationUsd, 0);
assert.equal(executed.objects.campaign.status, "PAUSED");
assert.equal(executed.objects.adset.daily_budget, "300");
assert.equal(executed.objects.ad.status, "PAUSED");
assert(fs.existsSync(executed.auditFile));
for (const call of executionMock.calls) {
  assert(!call.url.includes(TOKEN), "Marketing token must never be put in the URL");
  assert.equal(call.headers.authorization, `Bearer ${TOKEN}`);
}
const campaignCreate = executionMock.calls.find(call => call.method === "POST" && call.pathname.endsWith("/campaigns"));
const adsetCreate = executionMock.calls.find(call => call.method === "POST" && call.pathname.endsWith("/adsets"));
const adCreate = executionMock.calls.find(call => call.method === "POST" && call.pathname.endsWith("/ads"));
assert.equal(formParams(campaignCreate).status, "PAUSED");
assert.equal(formParams(campaignCreate).objective, "OUTCOME_SALES");
assert.equal(formParams(adsetCreate).status, "PAUSED");
assert.equal(formParams(adsetCreate).daily_budget, "300");
assert.equal(formParams(adCreate).status, "PAUSED");
for (const call of [campaignCreate, adsetCreate, adCreate]) assert(!JSON.stringify(formParams(call)).includes("weight_kg"));
fs.rmSync(executed.auditFile, { force: true });

const failureMock = mockGraph({ failCreative: true });
let failure;
try { await executePaused(env, mediaPath, failureMock.fetchImpl); }
catch (error) { failure = error; }
assert(failure, "creative failure must reject");
assert.match(failure.message, /meta_api_error/);
assert(fs.existsSync(failure.auditFile));
const deletes = failureMock.calls.filter(call => call.method === "DELETE").map(call => call.pathname);
assert.deepEqual(deletes, ["120000000000003", "120000000000002", "120000000000001"]);
fs.rmSync(failure.auditFile, { force: true });
fs.rmSync(temp, { recursive: true, force: true });

console.log("guarded Meta PAUSED draft builder tests passed");
