"use strict";
process.env.NODE_ENV = "test";
process.env.RECOVERY_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
process.env.RECOVERY_HASH_PEPPER = "p1-remediation-test-pepper-1234567890";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const app = require("../app.js");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { createAssessment } = require("../netlify/functions/_lib/assessment.js");
const { createInvoice, checkPayment } = require("../netlify/functions/_lib/payment.js");
const { safeAppLinks, appLinkDiagnostics, QPayClient } = require("../netlify/functions/_lib/qpay.js");

const root = path.join(__dirname, "..");
const migration = fs.readFileSync(path.join(root, "supabase/migrations/20260727014710_repair_payment_authority_and_analytics_truth.sql"), "utf8");
const paymentSource = fs.readFileSync(path.join(root, "netlify/functions/_lib/payment.js"), "utf8");
const analyticsSource = fs.readFileSync(path.join(root, "netlify/functions/_lib/analytics.js"), "utf8");
const assessmentSource = fs.readFileSync(path.join(root, "netlify/functions/weight-assessment-create.js"), "utf8");
const collectSource = fs.readFileSync(path.join(root, "netlify/functions/analytics-collect.js"), "utf8");
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const recoveryDesign = fs.readFileSync(path.join(root, "docs/QPAY_BROWSER_INDEPENDENT_RECOVERY_DESIGN.md"), "utf8");

async function prepaidContext(id) {
  const database = new MemoryDatabaseAdapter();
  await database.insert("sessions", { id: `session-${id}`, tokenHash: `hash-${id}`, createdAt: "2026-07-21T00:00:00.000Z",
    expiresAt: "2026-07-28T00:00:00.000Z", revokedAt: null });
  const assessment = await createAssessment(database, `session-${id}`, { prepaid: true }, new Date("2026-07-21T00:00:00.000Z"));
  return { database, assessment, sessionId: `session-${id}` };
}

(async () => {
  const late = await prepaidContext("late");
  const lateInvoice = await createInvoice(late.database, {
    async createInvoice() { return { invoiceId: "invoice-late", qrText: "qr", urls: [] }; }
  }, late.sessionId, { assessmentId: late.assessment.id }, new Date("2026-07-21T00:00:00.000Z"));
  const latePaid = await checkPayment(late.database, {
    async checkPayment() { return { rows: [{ payment_status: "PAID", payment_amount: 9900, payment_id: "provider-late" }] }; }
  }, late.sessionId, { paymentId: lateInvoice.paymentId }, new Date("2026-07-21T00:16:00.000Z"));
  assert.equal(latePaid.status, "paid", "provider-confirmed payment wins after local invoice expiry");
  assert.equal((await late.database.find("entitlements", { assessmentId: late.assessment.id })).length, 1);

  const unpaid = await prepaidContext("unpaid");
  const unpaidInvoice = await createInvoice(unpaid.database, {
    async createInvoice() { return { invoiceId: "invoice-unpaid", qrText: "qr", urls: [] }; }
  }, unpaid.sessionId, { assessmentId: unpaid.assessment.id }, new Date("2026-07-21T00:00:00.000Z"));
  const expired = await checkPayment(unpaid.database, {
    async checkPayment() { return { rows: [] }; }
  }, unpaid.sessionId, { paymentId: unpaidInvoice.paymentId }, new Date("2026-07-21T00:16:00.000Z"));
  assert.equal(expired.status, "expired");
  assert.equal((await unpaid.database.find("entitlements", {})).length, 0);

  const missing = await prepaidContext("missing-id");
  const missingInvoice = await createInvoice(missing.database, {
    async createInvoice() { return { invoiceId: "invoice-missing", qrText: "qr", urls: [] }; }
  }, missing.sessionId, { assessmentId: missing.assessment.id }, new Date("2026-07-21T00:00:00.000Z"));
  const notAuthoritative = await checkPayment(missing.database, {
    async checkPayment() { return { rows: [{ payment_status: "PAID", payment_amount: 9900, payment_id: "" }] }; }
  }, missing.sessionId, { paymentId: missingInvoice.paymentId }, new Date("2026-07-21T00:01:00.000Z"));
  assert.equal(notAuthoritative.status, "paid_but_not_unlocked");
  assert.equal((await missing.database.find("entitlements", {})).length, 0, "missing provider ID never grants entitlement");

  const duplicate = await prepaidContext("duplicate");
  await duplicate.database.insert("payments", { id: "other-payment", sessionId: duplicate.sessionId, assessmentId: "other-assessment",
    productCode: "WEIGHT_TEST_ONE_TIME", amount: 9900, status: "paid", senderInvoiceNo: "other-sender",
    invoiceId: "other-invoice", providerPaymentId: "provider-duplicate", createdAt: "2026-07-20T00:00:00.000Z",
    updatedAt: "2026-07-20T00:00:00.000Z", paidAt: "2026-07-20T00:01:00.000Z" });
  const duplicateInvoice = await createInvoice(duplicate.database, {
    async createInvoice() { return { invoiceId: "invoice-duplicate", qrText: "qr", urls: [] }; }
  }, duplicate.sessionId, { assessmentId: duplicate.assessment.id }, new Date("2026-07-21T00:00:00.000Z"));
  const duplicateResult = await checkPayment(duplicate.database, {
    async checkPayment() { return { rows: [{ payment_status: "PAID", payment_amount: 9900, payment_id: "provider-duplicate" }] }; }
  }, duplicate.sessionId, { paymentId: duplicateInvoice.paymentId }, new Date("2026-07-21T00:01:00.000Z"));
  assert.equal(duplicateResult.status, "paid_but_not_unlocked");
  assert.equal((await duplicate.database.find("entitlements", { assessmentId: duplicate.assessment.id })).length, 0);

  const links = safeAppLinks([
    { name: "Bank", link: "bankapp://pay/token" },
    { name: "Unsafe", link: "javascript:alert(1)" }
  ], { allowedSchemes: ["bankapp"], allowedHosts: [] });
  assert.deepEqual(links.map(row => row.name), ["Bank"]);
  const diagnostics = appLinkDiagnostics([{ name: "Bank", link: "bankapp://pay/token?secret=x" }], { allowedSchemes: ["bankapp"], allowedHosts: [] });
  assert.deepEqual(diagnostics.entries[0], { keys: ["link", "name"], scheme: "bankapp", hostname: "pay", accepted: true });
  assert(!JSON.stringify(diagnostics).includes("secret=x"), "diagnostics never include path or query");

  app._test.setState({ commercialFlowVersion: "prepaid_v2", assessmentStatus: "payment_pending", assessmentId: "assessment-ui",
    payment: { paymentId: "payment-ui", invoiceId: "invoice-ui", status: "pending", qrImage: "cXJjb2Rl", urls: links, expiresAt: "2026-07-21T00:15:00.000Z" } });
  const customRendered = app.renderForPath("/assessment/payment");
  assert(customRendered.includes("bankapp://pay/token"), "server-sanitized custom scheme reaches the UI");
  assert(!customRendered.includes("javascript:"));

  app._test.setState({ commercialFlowVersion: "prepaid_v2", assessmentStatus: "payment_pending", assessmentId: "assessment-qr",
    payment: { paymentId: "payment-qr", invoiceId: "invoice-qr", status: "pending", qrImage: "cXJjb2Rl", urls: [], expiresAt: "2026-07-21T00:15:00.000Z" } });
  const qrOnly = app.renderForPath("/assessment/payment");
  for (const copy of ["QR кодыг хадгалах", "дэлгэцийн зураг", "өөр төхөөрөмж", "Төлбөр шалгах",
    "Төлбөрийн төлөвөө эхлээд шалгана уу. Төлөгдөөгүй хэвээр бол үндсэн TDB апп эсвэл өөр дэмжигдсэн банкны апп ашиглана уу."]) assert(qrOnly.includes(copy), copy);
  assert(qrOnly.includes("Улаанбаатар"));

  let authCalls = 0;
  const originalFetch = global.fetch;
  global.fetch = async () => {
    authCalls += 1;
    return { ok: true, async json() { return { access_token: `token-${authCalls}`, expires_in: 300 }; } };
  };
  try {
    const client = new QPayClient({ baseUrl: "https://merchant.example", clientId: "id", clientSecret: "secret",
      invoiceCode: "code", callbackOrigin: "https://example.test", allowedSchemes: [], allowedHosts: [] });
    assert.equal(await client.token(), "token-1");
    assert.equal(await client.token(), "token-1");
    client.cachedToken.expiresAt = Date.now() + 30_000;
    assert.equal(await client.token(), "token-2");
    assert.equal(authCalls, 2, "warm runtime reuses token and refreshes before expiry");
  } finally { global.fetch = originalFetch; }

  assert.match(migration, /update jingeehas\.payments[\s\S]*provider_payment_id = null/);
  assert.match(migration, /unique index[\s\S]*provider_payment_id[\s\S]*where provider_payment_id is not null/);
  assert.match(migration, /event_name in \('landing_cta_clicked', 'start_cta_clicked'\)/);
  assert.match(migration, /checkout_submitted/);
  assert.match(migration, /payment_page_rendered/);
  assert(!paymentSource.includes("if (payment.expiresAt && new Date(payment.expiresAt) <= now) {"));
  assert.match(analyticsSource, /assessment_shell_created", "checkout_submitted", "assessment_started/);
  assert.match(assessmentSource, /checkout_submitted/);
  assert.match(collectSource, /Persisted invoice required/);
  assert.match(appSource, /setTimeout\(\(\) => \{ paymentPollTimer = null; if \(!document\.hidden\) checkPayment\(\); \}, 15000\)/);
  assert.doesNotMatch(appSource, /const delays = \[5000, 10000, 20000, 30000, 60000\]/);
  assert(!appSource.includes("payment.urls.filter(item => /^https"));
  assert.match(recoveryDesign, /GET <callback_url>\?qpay_payment_id/);
  assert.doesNotMatch(recoveryDesign, /not deployed/);
  assert.match(recoveryDesign, /rate-limited/);
  assert(fs.existsSync(path.join(root, "netlify/functions/qpay-payment-callback.js")), "dedicated GET callback is deployed");

  console.log("P1 payment authority and analytics truth remediation tests passed");
})().catch(error => { console.error(error); process.exit(1); });
