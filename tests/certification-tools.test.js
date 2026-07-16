"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");

(async () => {
  const { DATABASE_GATEWAY, databaseConfiguration, verifyDatabaseConfig } = await import("../tools/verify-database-config.mjs");
  const { certifyDatabaseExternal } = await import("../tools/certify-database-external.mjs");
  let calls = 0;
  const noNetwork = async () => { calls += 1; throw new Error("network must not be called"); };
  const blocked = verifyDatabaseConfig({ env: {} });
  assert.equal(blocked.status, "BLOCKED");
  assert.deepEqual(blocked.missing.sort(), ["JINGEEHAS_DATABASE_API_KEY", "JINGEEHAS_DATABASE_API_URL"]);
  assert.equal(verifyDatabaseConfig({ env: { JINGEEHAS_DATABASE_API_URL: DATABASE_GATEWAY.baseUrl } }).status, "BLOCKED");
  assert.equal(verifyDatabaseConfig({ env: { JINGEEHAS_DATABASE_API_URL: DATABASE_GATEWAY.baseUrl.replace("https:", "http:") } }).status, "FAIL");
  assert.equal(verifyDatabaseConfig({ env: { JINGEEHAS_DATABASE_API_URL: DATABASE_GATEWAY.baseUrl.replace("nemgfbanmwqudjfzddrn", "wrongproject") } }).status, "FAIL");
  assert.equal(verifyDatabaseConfig({ env: { JINGEEHAS_DATABASE_API_URL: DATABASE_GATEWAY.baseUrl.replace("jingeehas-database-gateway", "wrong-function") } }).status, "FAIL");
  assert.equal(verifyDatabaseConfig({ env: { JINGEEHAS_DATABASE_API_URL: `${DATABASE_GATEWAY.baseUrl}/transaction` } }).status, "FAIL");
  assert.equal(databaseConfiguration({ JINGEEHAS_DATABASE_API_URL: DATABASE_GATEWAY.baseUrl, JINGEEHAS_DATABASE_API_KEY: "sb_publishable_not_allowed" }, { externalCertification: true }).status, "FAIL");
  assert.equal(databaseConfiguration({ JINGEEHAS_DATABASE_API_URL: DATABASE_GATEWAY.baseUrl, JINGEEHAS_DATABASE_API_KEY: "sb_secret_not_allowed" }, { externalCertification: true }).status, "FAIL");
  const anonPayload = Buffer.from(JSON.stringify({ role: "anon" })).toString("base64url");
  assert.equal(databaseConfiguration({ JINGEEHAS_DATABASE_API_URL: DATABASE_GATEWAY.baseUrl, JINGEEHAS_DATABASE_API_KEY: `eyJhbGciOiJIUzI1NiJ9.${anonPayload}.signature` }, { externalCertification: true }).status, "FAIL");
  for (const role of ["service_role", "authenticated"]) {
    const payload = Buffer.from(JSON.stringify({ role })).toString("base64url");
    assert.equal(databaseConfiguration({ JINGEEHAS_DATABASE_API_URL: DATABASE_GATEWAY.baseUrl, JINGEEHAS_DATABASE_API_KEY: `eyJhbGciOiJIUzI1NiJ9.${payload}.signature` }, { externalCertification: true }).status, "FAIL");
  }
  assert.equal(databaseConfiguration({ JINGEEHAS_DATABASE_API_URL: DATABASE_GATEWAY.baseUrl, JINGEEHAS_DATABASE_API_KEY: "too-short" }, { externalCertification: true }).status, "FAIL");
  const configured = { NODE_ENV: "test", JINGEEHAS_DATABASE_API_URL: DATABASE_GATEWAY.baseUrl,
    JINGEEHAS_DATABASE_API_KEY: "test_dedicated_gateway_secret_for_certification_only_abcdefghijklmnopqrstuvwxyz" };
  const ready = databaseConfiguration(configured, { externalCertification: true });
  assert.equal(ready.status, "READY");
  assert.equal(ready.finalRequestUrl, `${DATABASE_GATEWAY.baseUrl}/transaction`);
  assert.equal(verifyDatabaseConfig({ env: configured }).status, "FAIL", "ordinary config verification must refuse an injected secret");
  assert.equal(calls, 0);

  const records = new Map();
  const fakeFetch = async (url, init) => {
    calls += 1;
    assert.equal(url, `${DATABASE_GATEWAY.baseUrl}/transaction`);
    const body = JSON.parse(init.body);
    let result;
    if (body.action === "insert") { records.set(body.row.id, body.row); result = body.row; }
    else if (body.action === "get") result = records.get(body.id) || null;
    else if (body.action === "update") { result = { ...records.get(body.id), ...body.patch }; records.set(body.id, result); }
    else if (body.action === "find") result = [...records.values()].filter(row => Object.entries(body.filters || {}).every(([key, value]) => row[key] === value));
    else if (body.action === "delete") { records.delete(body.id); result = { deleted: true }; }
    else if (body.action === "transaction" && body.rollback) result = { rolledBack: true };
    return { ok: true, json: async () => result };
  };
  await assert.rejects(() => certifyDatabaseExternal({ env: configured, fetchImpl: noNetwork }), /not approved/);
  const logs = [];
  const passed = await certifyDatabaseExternal({ env: { ...configured, JINGEEHAS_EXTERNAL_DATABASE_CERTIFICATION: "approved" }, fetchImpl: fakeFetch, log: value => logs.push(value) });
  assert.equal(passed.status, "PASS");
  assert.equal(passed.residualRecords, 0);
  assert(logs.every(line => !line.includes(configured.JINGEEHAS_DATABASE_API_KEY)));
  assert(calls > 0);

  const { verifyDatabaseGatewayAuth } = await import("../tools/verify-database-gateway-auth.mjs");
  const authRequests = [];
  const authFetch = async (url, init) => {
    authRequests.push({ url, init });
    return { status: init.method === "GET" ? 405 : 401, text: async () => JSON.stringify({ error: "unauthorized" }) };
  };
  const authResult = await verifyDatabaseGatewayAuth({ fetchImpl: authFetch });
  assert.equal(authResult.status, "PASS");
  assert.equal(authResult.databaseRecordCreated, false);
  assert.equal(authRequests.length, 3);
  assert(authRequests.filter(item => item.init.body).every(item => JSON.parse(item.init.body).action === "get"));
  assert(authRequests.every(item => !String(item.init.headers?.authorization || "").includes(configured.JINGEEHAS_DATABASE_API_KEY)));

  const dedicatedRequests = [];
  const dedicatedFetch = async (url, init) => {
    dedicatedRequests.push({ url, init });
    const valid = init.headers?.authorization === `Bearer ${configured.JINGEEHAS_DATABASE_API_KEY}`;
    return { status: valid ? 200 : init.method === "GET" ? 405 : 401, text: async () => valid ? "null" : JSON.stringify({ error: "unauthorized" }) };
  };
  const dedicatedAuth = await verifyDatabaseGatewayAuth({ env: configured, fetchImpl: dedicatedFetch });
  assert.equal(dedicatedAuth.status, "PASS");
  assert.equal(dedicatedAuth.realCredentialUsed, true);
  assert.equal(dedicatedRequests.length, 4);

  const gatewaySource = fs.readFileSync("supabase/functions/jingeehas-database-gateway/index.ts", "utf8");
  const gatewayConfig = fs.readFileSync("supabase/config.toml", "utf8");
  assert.match(gatewaySource, /JINGEEHAS_GATEWAY_SECRET/);
  assert.match(gatewaySource, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(gatewaySource, /constantTimeEqual\(bearer, gatewaySecret\)/);
  assert.match(gatewaySource, /normalizeOperation/);
  assert.match(gatewaySource, /normalizeResult/);
  assert.match(gatewaySource, /body\.byteLength > 262_144/);
  assert(!/constantTimeEqual\([^\n]*serviceRoleKey/.test(gatewaySource));
  assert(!/console\.(?:log|error|warn)/.test(gatewaySource));
  assert.match(gatewayConfig, /\[functions\.jingeehas-database-gateway\][\s\S]*verify_jwt\s*=\s*false/);

  const reportKeyMigration = fs.readFileSync("supabase/migrations/20260717201500_fix_report_snapshot_gateway_key.sql", "utf8");
  assert.match(reportKeyMigration, /target_table = 'report_snapshots' then 'assessment_id'/);
  assert.match(reportKeyMigration, /where t\.%I = \$1/);
  assert(!/grant execute/i.test(reportKeyMigration), "the report key repair must not broaden RPC privileges");

  const adminLiveCertification = fs.readFileSync("scripts/certify-admin-live.mjs", "utf8");
  assert.match(adminLiveCertification, /Password command-line arguments are forbidden/);
  assert.match(adminLiveCertification, /--password-stdin is required/);
  assert.match(adminLiveCertification, /expired\.status !== 401/);
  assert.match(adminLiveCertification, /disabled\.status !== 401/);
  assert.match(adminLiveCertification, /afterLogout\.status !== 401/);
  assert(!/console\.(?:log|error)\([^\n]*password/i.test(adminLiveCertification));

  const { verifyRecoveryConfig } = await import("../tools/verify-recovery-config.mjs");
  const { verifyQPayConfig } = await import("../tools/verify-qpay-config.mjs");
  const callsBeforeConfigChecks = calls;
  assert.equal(verifyRecoveryConfig({}).status, "BLOCKED");
  assert.equal(verifyRecoveryConfig({
    RECOVERY_ENCRYPTION_KEY: Buffer.alloc(32, 1).toString("base64"), RECOVERY_HASH_PEPPER: "pepper-value-with-more-than-32-characters",
    RECOVERY_DELIVERY_API_URL: "https://api.resend.com/emails", RECOVERY_DELIVERY_API_KEY: "secret", RECOVERY_SENDER_EMAIL: "no-reply@mail.jingeehas.fit",
    RECOVERY_SENDER_NAME: "Jingeehas", RECOVERY_CHANNEL: "email", RECOVERY_RATE_LIMIT_STORE: "database"
  }).status, "PASS");
  assert.equal(verifyRecoveryConfig({
    RECOVERY_ENCRYPTION_KEY: Buffer.alloc(32, 1).toString("base64"), RECOVERY_HASH_PEPPER: "pepper-value-with-more-than-32-characters",
    RECOVERY_DELIVERY_API_URL: "https://api.resend.com/emails", RECOVERY_DELIVERY_API_KEY: "secret", RECOVERY_SENDER_EMAIL: "no-reply@mail.jingeehas.fit",
    RECOVERY_SENDER_NAME: "Jingeehas", RECOVERY_CHANNEL: "email", RECOVERY_RATE_LIMIT_STORE: "memory"
  }).status, "FAIL");
  assert.equal(verifyQPayConfig({}).status, "BLOCKED");
  assert.equal(verifyQPayConfig({ QPAY_API_BASE_URL: "https://sandbox.qpay.invalid", QPAY_CLIENT_ID: "id", QPAY_CLIENT_SECRET: "secret", QPAY_INVOICE_CODE: "code",
    QPAY_CALLBACK_ORIGIN: "https://staging.jingeehas.invalid", QPAY_ALLOWED_APP_SCHEMES: "bankapp", QPAY_ALLOWED_HTTPS_HOSTS: "bank.example" }).status, "PASS");
  assert.equal(verifyQPayConfig({ QPAY_API_BASE_URL: "https://sandbox.qpay.invalid", QPAY_CLIENT_ID: "id", QPAY_CLIENT_SECRET: "secret", QPAY_INVOICE_CODE: "code",
    QPAY_CALLBACK_ORIGIN: "https://staging.jingeehas.invalid", QPAY_ALLOWED_APP_SCHEMES: "javascript", QPAY_ALLOWED_HTTPS_HOSTS: "bank.example" }).status, "FAIL");
  assert.equal(calls, callsBeforeConfigChecks, "configuration-only verification must not contact external systems");
  const { verifyDomainConfig } = await import("../tools/verify-domain-config.mjs");
  const domain = verifyDomainConfig({ env: {} });
  assert.equal(domain.status, "PASS");
  assert.equal(domain.scope, "repository-consistency-only");
  assert.equal(domain.ownerDomainVerification, "PENDING");
  assert.equal(calls, callsBeforeConfigChecks, "domain consistency verification must not contact external systems");
  console.log("certification tooling tests passed");
})().catch(error => { console.error(error); process.exit(1); });
