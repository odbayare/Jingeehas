import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";
const PRICE_MNT = 9900;
const DAILY_BUDGET_MINOR = 300;
const DAILY_BUDGET_USD = 3;
const DESTINATION = "https://jingeehas.fit/?utm_source=meta&utm_medium=paid_social&utm_campaign=jingeehas_sales_purchase_reel_v1&utm_content=paid_cut_v1&utm_term=broad_25plus";
const CAMPAIGN_NAME = "JINGEEHAS | Sales | Purchase | Reel V1 | 2026-08-01";
const ADSET_NAME = "JINGEEHAS | MN | Broad 25-65 | Purchase | USD3 | V1";
const CREATIVE_NAME = "JINGEEHAS | Paid Cut V1 | Video | 9x16";
const AD_NAME = "JINGEEHAS | Paid Cut V1 | Learn More | V1";
const PRIMARY_TEXT = "Хоол, дасгалын төлөвлөгөө зөв байсан ч жин хасах оролдлого нэг л тогтдоггүй үе бий. Үүнд стресс, хэт хязгаарлалт, автомат зуршил зэрэг давтагддаг хэв маяг нөлөөлж болно.\n\nЖингээ Хас тест үнэлгээг үнэ төлбөргүй бөглөөрэй. Таны хувийн хэв маяг, ямар нөхцөлд илэрдэг, жин хасалтад яагаад саад болдог болон хэрхэн удирдахыг бүрэн тайлангаас мэдэж авна. Бүрэн тайлан 9,900₮.\n\nЭнэ нь эмнэлзүйн онош биш.";
const HEADLINE = "Жингээ Хас тест үнэлгээг үнэгүй эхлүүлэх";
const DESCRIPTION = "Бүрэн тайлан 9,900₮ · Эмнэлзүйн онош биш";
const SAFE_ID = /^\d{5,32}$/;
const SAFE_VERSION = /^v\d+\.\d+$/;
const FORBIDDEN_KEYS = /^(?:birth(?:date|time|place)?|astrology_result|weight_kg|body_weight|bmi|eating_answers?|psychological_answers?|trauma(?:_score|_dimension|_report)?|skill_score|employee_weakness|raw_(?:answers?|questions?)|assessment_id|diagnosis|treatment)$/i;
const FORBIDDEN_VALUE_FRAGMENTS = ["private@example.com", "employee weakness", "raw assessment", "trauma score", "body mass index"];

function exact(value, expected) { return String(value || "") === expected; }
function numeric(value) { const number = Number(value); return Number.isFinite(number) ? number : null; }
function normalizeId(value, label) {
  const text = String(value || "").trim();
  if (!SAFE_ID.test(text)) throw new Error(`${label}_invalid`);
  return text;
}
function normalizeVersion(value, required = false) {
  const text = String(value || "").trim();
  if (!text && !required) return "v25.0";
  if (!SAFE_VERSION.test(text)) throw new Error("meta_graph_api_version_invalid");
  return text;
}
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, canonicalize(item)]));
  return value;
}
function fingerprintPlan(plan) {
  const copy = structuredClone(plan);
  delete copy.approvalFingerprint;
  return crypto.createHash("sha256").update(JSON.stringify(canonicalize(copy))).digest("hex");
}
function assertNoSensitivePayload(value, keyPath = []) {
  if (Array.isArray(value)) return value.forEach((item, index) => assertNoSensitivePayload(item, [...keyPath, String(index)]));
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.test(key)) throw new Error(`sensitive_payload_key:${[...keyPath, key].join(".")}`);
      assertNoSensitivePayload(item, [...keyPath, key]);
    }
    return;
  }
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    for (const fragment of FORBIDDEN_VALUE_FRAGMENTS) if (normalized.includes(fragment)) throw new Error(`sensitive_payload_value:${fragment}`);
  }
}

function buildPlan(env = process.env) {
  const accountId = String(env.META_AD_ACCOUNT_ID || "").trim();
  const pageId = String(env.META_PAGE_ID || "").trim();
  const pixelId = String(env.META_PIXEL_ID || env.META_DATASET_ID || "").trim();
  const instagramActorId = String(env.META_INSTAGRAM_ACTOR_ID || "").trim();
  const plan = {
    schemaVersion: 1,
    mode: "DRAFT_ONLY",
    graphApiVersion: normalizeVersion(env.META_GRAPH_API_VERSION, false),
    product: { productCode: PRODUCT_CODE, priceMnt: PRICE_MNT },
    assets: {
      adAccountId: accountId || "<ad_account_id>",
      pageId: pageId || "<page_id>",
      pixelId: pixelId || "<pixel_id>",
      instagramActorId: instagramActorId || null
    },
    destination: DESTINATION,
    campaign: {
      name: CAMPAIGN_NAME,
      objective: "OUTCOME_SALES",
      buying_type: "AUCTION",
      special_ad_categories: [],
      is_adset_budget_sharing_enabled: false,
      status: "PAUSED"
    },
    adset: {
      name: ADSET_NAME,
      campaign_id: "<campaign_id>",
      billing_event: "IMPRESSIONS",
      optimization_goal: "OFFSITE_CONVERSIONS",
      bid_strategy: "LOWEST_COST_WITHOUT_CAP",
      daily_budget: DAILY_BUDGET_MINOR,
      destination_type: "WEBSITE",
      targeting: { age_min: 25, age_max: 65, geo_locations: { countries: ["MN"], location_types: ["home", "recent"] } },
      promoted_object: { pixel_id: pixelId || "<pixel_id>", custom_event_type: "PURCHASE" },
      status: "PAUSED"
    },
    creative: {
      name: CREATIVE_NAME,
      object_story_spec: {
        page_id: pageId || "<page_id>",
        ...(instagramActorId ? { instagram_actor_id: instagramActorId } : {}),
        video_data: {
          video_id: "<video_id>",
          message: PRIMARY_TEXT,
          title: HEADLINE,
          link_description: DESCRIPTION,
          call_to_action: { type: "LEARN_MORE", value: { link: DESTINATION, link_format: "VIDEO_LPP" } }
        }
      },
      object_type: "VIDEO",
      degrees_of_freedom_spec: { creative_features_spec: { advantage_plus_creative: { enroll_status: "OPT_OUT" }, standard_enhancements: { enroll_status: "OPT_OUT" } } }
    },
    ad: { name: AD_NAME, adset_id: "<adset_id>", creative: { creative_id: "<creative_id>" }, status: "PAUSED" },
    guardrails: {
      dailyBudgetUsd: DAILY_BUDGET_USD,
      targetAuthoritativeCpaUsd: 1,
      monthlyCapUsd: numeric(env.META_MONTHLY_CAP_USD),
      allCreatedStatuses: "PAUSED",
      activeMutationAllowed: false
    }
  };
  return { ...plan, approvalFingerprint: fingerprintPlan(plan) };
}

function validatePlan(plan) {
  if (plan.product.productCode !== PRODUCT_CODE || plan.product.priceMnt !== PRICE_MNT) throw new Error("product_contract_mismatch");
  if ([plan.campaign.status, plan.adset.status, plan.ad.status].some(status => status !== "PAUSED")) throw new Error("active_status_forbidden");
  if (plan.adset.daily_budget !== DAILY_BUDGET_MINOR) throw new Error("daily_budget_changed");
  if (plan.campaign.objective !== "OUTCOME_SALES") throw new Error("objective_changed");
  if (plan.adset.optimization_goal !== "OFFSITE_CONVERSIONS" || plan.adset.promoted_object.custom_event_type !== "PURCHASE") throw new Error("purchase_optimization_changed");
  if (plan.adset.targeting.geo_locations.countries.join(",") !== "MN" || plan.adset.targeting.age_min !== 25 || plan.adset.targeting.age_max !== 65) throw new Error("audience_changed");
  if (!plan.destination.startsWith("https://jingeehas.fit/")) throw new Error("destination_changed");
  if (!plan.campaign.name.startsWith("JINGEEHAS |") || !plan.adset.name.startsWith("JINGEEHAS |") || !plan.ad.name.startsWith("JINGEEHAS |")) throw new Error("product_isolation_name_missing");
  assertNoSensitivePayload(plan);
  return plan;
}

function requireExecutionGuards(env, plan, mediaPath) {
  normalizeId(env.META_AD_ACCOUNT_ID, "meta_ad_account_id");
  normalizeId(env.META_PAGE_ID, "meta_page_id");
  normalizeId(env.META_PIXEL_ID || env.META_DATASET_ID, "meta_pixel_id");
  normalizeId(env.META_INSTAGRAM_ACTOR_ID, "meta_instagram_actor_id");
  normalizeVersion(env.META_GRAPH_API_VERSION, true);
  if (String(env.META_MARKETING_ACCESS_TOKEN || "").length < 40) throw new Error("meta_marketing_access_token_missing");
  if (!exact(env.META_PRODUCT_CODE, PRODUCT_CODE)) throw new Error("product_code_ack_missing");
  if (!exact(env.META_SHARED_ACCOUNT_ACK, "JINGEEHAS_ISOLATION_APPROVED")) throw new Error("shared_account_isolation_ack_missing");
  if (!exact(env.META_AUDIO_RIGHTS_CONFIRMED, "true")) throw new Error("audio_rights_unconfirmed");
  const monthlyCap = numeric(env.META_MONTHLY_CAP_USD);
  if (monthlyCap == null || monthlyCap < DAILY_BUDGET_USD) throw new Error("monthly_cap_missing");
  if (!exact(env.META_APPROVAL_FINGERPRINT, plan.approvalFingerprint)) throw new Error("approval_fingerprint_mismatch");
  if (!mediaPath || !fs.existsSync(mediaPath) || !fs.statSync(mediaPath).isFile() || !/\.mp4$/i.test(mediaPath)) throw new Error("paid_cut_media_missing");
}

async function graphRequest({ version, token, pathName, method = "GET", params = {}, form = null, fetchImpl = globalThis.fetch }) {
  if (typeof fetchImpl !== "function") throw new Error("fetch_unavailable");
  const url = new URL(`https://graph.facebook.com/${version}/${pathName.replace(/^\//, "")}`);
  const headers = { authorization: `Bearer ${token}` };
  let body;
  if (form) body = form;
  else if (method === "GET") for (const [key, value] of Object.entries(params)) url.searchParams.set(key, typeof value === "string" ? value : JSON.stringify(value));
  else {
    body = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) body.set(key, typeof value === "string" ? value : JSON.stringify(value));
    headers["content-type"] = "application/x-www-form-urlencoded";
  }
  const response = await fetchImpl(url, { method, headers, body, signal: AbortSignal.timeout(30000) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.error) {
    const error = new Error(`meta_api_error:${payload?.error?.code || response.status}`);
    error.meta = { status: response.status, code: payload?.error?.code || null, subcode: payload?.error?.error_subcode || null };
    throw error;
  }
  return payload;
}

async function preflight(env = process.env, fetchImpl = globalThis.fetch) {
  const version = normalizeVersion(env.META_GRAPH_API_VERSION, true);
  const token = String(env.META_MARKETING_ACCESS_TOKEN || "");
  if (token.length < 40) throw new Error("meta_marketing_access_token_missing");
  const accountId = normalizeId(env.META_AD_ACCOUNT_ID, "meta_ad_account_id");
  const pageId = normalizeId(env.META_PAGE_ID, "meta_page_id");
  const pixelId = normalizeId(env.META_PIXEL_ID || env.META_DATASET_ID, "meta_pixel_id");
  const request = options => graphRequest({ version, token, fetchImpl, ...options });
  const [account, page, pixel, campaigns] = await Promise.all([
    request({ pathName: `act_${accountId}`, params: { fields: "id,name,business,business_name,currency,timezone_name,account_status,disable_reason,spend_cap,amount_spent,balance,instagram_accounts{id,username}" } }),
    request({ pathName: pageId, params: { fields: "id,name,instagram_business_account{id,username}" } }),
    request({ pathName: pixelId, params: { fields: "id,name,is_unavailable,last_fired_time" } }),
    request({ pathName: `act_${accountId}/campaigns`, params: { fields: "id,name,status,effective_status,objective,daily_budget,lifetime_budget,updated_time", limit: "100" } })
  ]);
  const allCampaigns = campaigns.data || [];
  const existingJingeehas = allCampaigns.filter(item => /JINGEEHAS|ЖИНГЭЭ\s*ХАС/i.test(String(item.name || "")) || String(item.id) === String(env.META_EXISTING_JINGEEHAS_CAMPAIGN_ID || ""));
  const instagram = page.instagram_business_account || (account.instagram_accounts?.data || [])[0] || null;
  const issues = [];
  if (String(account.id).replace(/^act_/, "") !== accountId) issues.push("account_id_mismatch");
  if (account.currency !== "USD") issues.push("account_currency_not_usd");
  if (account.timezone_name !== "Asia/Ulaanbaatar") issues.push("account_timezone_mismatch");
  if (Number(account.account_status) !== 1 || account.disable_reason) issues.push("account_not_active");
  if (String(page.id) !== pageId) issues.push("page_id_mismatch");
  if (String(pixel.id) !== pixelId || pixel.is_unavailable === true) issues.push("pixel_unavailable");
  if (!instagram?.id || String(instagram.id) !== String(env.META_INSTAGRAM_ACTOR_ID || "")) issues.push("instagram_identity_missing_or_mismatch");
  if (allCampaigns.some(item => item.name === CAMPAIGN_NAME)) issues.push("exact_campaign_already_exists");
  if (existingJingeehas.some(item => item.effective_status === "ACTIVE")) issues.push("existing_active_jingeehas_campaign");
  return {
    status: issues.length ? "BLOCKED" : "PASS",
    account: { id: account.id, name: account.name, business: account.business || null, currency: account.currency, timezoneName: account.timezone_name, accountStatus: account.account_status, disableReason: account.disable_reason || null, spendCap: account.spend_cap || null, amountSpent: account.amount_spent || null, balance: account.balance || null },
    page: { id: page.id, name: page.name },
    pixel: { id: pixel.id, name: pixel.name, unavailable: Boolean(pixel.is_unavailable), lastFiredTime: pixel.last_fired_time || null },
    instagram,
    existingJingeehasCampaigns: existingJingeehas.map(item => ({ id: item.id, name: item.name, status: item.status, effectiveStatus: item.effective_status, objective: item.objective, dailyBudget: item.daily_budget || null, lifetimeBudget: item.lifetime_budget || null })),
    issues
  };
}

async function rollbackCreated(created, request) {
  const results = [];
  for (const item of [...created].reverse()) {
    try { await request({ pathName: item.id, method: "DELETE" }); results.push({ ...item, rollback: "deleted" }); }
    catch (error) { results.push({ ...item, rollback: "failed", error: String(error.message || error) }); }
  }
  return results;
}
function auditPath(now = new Date()) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  return path.join(root, "artifacts", "runtime", `meta-jingeehas-draft-${now.toISOString().replace(/[:.]/g, "-")}.json`);
}
function writeAudit(record, output = auditPath()) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(record, null, 2)}\n`, { mode: 0o600 });
  return output;
}

async function executePaused(env = process.env, mediaPath, fetchImpl = globalThis.fetch) {
  const plan = validatePlan(buildPlan(env));
  requireExecutionGuards(env, plan, mediaPath);
  const pf = await preflight(env, fetchImpl);
  if (pf.status !== "PASS") throw Object.assign(new Error("meta_preflight_blocked"), { preflight: pf });
  const version = normalizeVersion(env.META_GRAPH_API_VERSION, true);
  const token = String(env.META_MARKETING_ACCESS_TOKEN);
  const accountId = normalizeId(env.META_AD_ACCOUNT_ID, "meta_ad_account_id");
  const request = options => graphRequest({ version, token, fetchImpl, ...options });
  const created = [];
  const startedAt = new Date();
  try {
    const campaign = await request({ pathName: `act_${accountId}/campaigns`, method: "POST", params: plan.campaign });
    created.push({ type: "campaign", id: campaign.id });
    const adset = await request({ pathName: `act_${accountId}/adsets`, method: "POST", params: { ...plan.adset, campaign_id: campaign.id, promoted_object: { pixel_id: plan.assets.pixelId, custom_event_type: "PURCHASE" } } });
    created.push({ type: "adset", id: adset.id });
    const videoForm = new FormData();
    videoForm.append("source", new Blob([fs.readFileSync(mediaPath)], { type: "video/mp4" }), path.basename(mediaPath));
    videoForm.append("title", CREATIVE_NAME);
    const video = await request({ pathName: `act_${accountId}/advideos`, method: "POST", form: videoForm });
    created.push({ type: "video", id: video.id });
    const creativePayload = structuredClone(plan.creative);
    creativePayload.object_story_spec.video_data.video_id = video.id;
    const creative = await request({ pathName: `act_${accountId}/adcreatives`, method: "POST", params: creativePayload });
    created.push({ type: "creative", id: creative.id });
    const ad = await request({ pathName: `act_${accountId}/ads`, method: "POST", params: { ...plan.ad, adset_id: adset.id, creative: { creative_id: creative.id } } });
    created.push({ type: "ad", id: ad.id });
    const [campaignRead, adsetRead, creativeRead, adRead] = await Promise.all([
      request({ pathName: campaign.id, params: { fields: "id,name,status,effective_status,objective,buying_type,special_ad_categories" } }),
      request({ pathName: adset.id, params: { fields: "id,name,status,effective_status,daily_budget,bid_strategy,billing_event,optimization_goal,targeting,promoted_object,campaign_id" } }),
      request({ pathName: creative.id, params: { fields: "id,name,status,object_story_id,object_story_spec,object_type,degrees_of_freedom_spec" } }),
      request({ pathName: ad.id, params: { fields: "id,name,status,effective_status,adset_id,creative" } })
    ]);
    for (const object of [campaignRead, adsetRead, adRead]) if (object.status !== "PAUSED" || object.effective_status === "ACTIVE") throw new Error(`post_verify_active_object:${object.id}`);
    if (String(adsetRead.daily_budget) !== String(DAILY_BUDGET_MINOR)) throw new Error("post_verify_budget_mismatch");
    const record = {
      schemaVersion: 1,
      operation: "create_jingeehas_paused_meta_draft",
      idempotencyKey: plan.approvalFingerprint,
      approvedPayloadFingerprint: plan.approvalFingerprint,
      approver: "owner:E.Odbayar",
      budgetImpact: { configuredDailyBudgetUsd: DAILY_BUDGET_USD, currentSpendMutationUsd: 0, allObjectsPaused: true },
      startedAt: startedAt.toISOString(), completedAt: new Date().toISOString(), preflight: pf,
      objects: { campaign: campaignRead, adset: adsetRead, creative: creativeRead, ad: adRead, video: { id: video.id } }, rollbackStatus: "not_required"
    };
    return { ...record, auditFile: writeAudit(record) };
  } catch (error) {
    const rollback = await rollbackCreated(created, request);
    const record = { schemaVersion: 1, operation: "create_jingeehas_paused_meta_draft", idempotencyKey: plan.approvalFingerprint, startedAt: startedAt.toISOString(), failedAt: new Date().toISOString(), error: String(error.message || error), meta: error.meta || null, preflight: error.preflight || pf, created, rollback };
    error.auditFile = writeAudit(record);
    throw error;
  }
}
function redactPlan(plan) { return JSON.parse(JSON.stringify(plan, (key, value) => /token|secret/i.test(key) ? "[REDACTED]" : value)); }
async function main(argv = process.argv.slice(2), env = process.env) {
  const mode = argv.includes("--execute-paused") ? "execute" : argv.includes("--preflight") ? "preflight" : "plan";
  const plan = validatePlan(buildPlan(env));
  if (mode === "plan") return console.log(JSON.stringify(redactPlan(plan), null, 2));
  if (mode === "preflight") return console.log(JSON.stringify(await preflight(env), null, 2));
  const mediaArg = argv.find(value => !["--execute-paused", "--preflight", "--plan"].includes(value));
  console.log(JSON.stringify(await executePaused(env, mediaArg), null, 2));
}

export { PRODUCT_CODE, PRICE_MNT, DAILY_BUDGET_MINOR, DAILY_BUDGET_USD, DESTINATION, CAMPAIGN_NAME, buildPlan, fingerprintPlan, assertNoSensitivePayload, validatePlan, requireExecutionGuards, graphRequest, preflight, executePaused, redactPlan };
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(JSON.stringify({ error: String(error.message || error), meta: error.meta || null, preflight: error.preflight || null, auditFile: error.auditFile || null })); process.exit(1); });
