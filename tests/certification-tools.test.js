"use strict";
const assert = require("node:assert/strict");

(async () => {
  const { expectedSchema, verifyDatabaseConfig } = await import("../tools/verify-database-config.mjs");
  let calls = 0;
  const noNetwork = async () => { calls += 1; throw new Error("network must not be called"); };
  const blocked = await verifyDatabaseConfig({ env: {}, fetchImpl: noNetwork });
  assert.equal(blocked.status, "BLOCKED");
  assert.deepEqual(blocked.missing.sort(), ["JINGEEHAS_DATABASE_API_KEY", "JINGEEHAS_DATABASE_API_URL"]);
  const configured = { JINGEEHAS_DATABASE_API_URL: "https://database.staging.invalid", JINGEEHAS_DATABASE_API_KEY: "secret-not-logged" };
  const notEnabled = await verifyDatabaseConfig({ env: configured, fetchImpl: noNetwork });
  assert.equal(notEnabled.status, "BLOCKED");
  assert.equal(calls, 0);

  const records = new Map();
  const tables = Object.fromEntries(Object.entries(expectedSchema()).map(([name, columns]) => [name, { columns }]));
  const fakeFetch = async (url, init) => {
    calls += 1;
    if (url.endsWith("/health")) return { ok: true, json: async () => ({ status: "ok" }) };
    const body = JSON.parse(init.body);
    let result;
    if (body.action === "schema") result = { tables };
    else if (body.action === "insert") { records.set(body.row.id, body.row); result = body.row; }
    else if (body.action === "get") result = records.get(body.id) || null;
    else if (body.action === "delete") { records.delete(body.id); result = { deleted: true }; }
    else if (body.action === "transaction" && body.rollback) result = { rolledBack: true };
    return { ok: true, json: async () => result };
  };
  const passed = await verifyDatabaseConfig({ env: configured, externalCertification: true, fetchImpl: fakeFetch });
  assert.equal(passed.status, "PASS");
  assert.equal(passed.rollback, "verified");
  assert(calls > 0);

  const { verifyRecoveryConfig } = await import("../tools/verify-recovery-config.mjs");
  const { verifyQPayConfig } = await import("../tools/verify-qpay-config.mjs");
  const callsBeforeConfigChecks = calls;
  assert.equal(verifyRecoveryConfig({}).status, "BLOCKED");
  assert.equal(verifyRecoveryConfig({
    RECOVERY_ENCRYPTION_KEY: Buffer.alloc(32, 1).toString("base64"), RECOVERY_HASH_PEPPER: "pepper-value-with-more-than-32-characters",
    RECOVERY_DELIVERY_API_URL: "https://delivery.staging.invalid/messages", RECOVERY_DELIVERY_API_KEY: "secret", RECOVERY_RATE_LIMIT_STORE: "database"
  }).status, "PASS");
  assert.equal(verifyRecoveryConfig({
    RECOVERY_ENCRYPTION_KEY: Buffer.alloc(32, 1).toString("base64"), RECOVERY_HASH_PEPPER: "pepper-value-with-more-than-32-characters",
    RECOVERY_DELIVERY_API_URL: "https://delivery.staging.invalid/messages", RECOVERY_DELIVERY_API_KEY: "secret", RECOVERY_RATE_LIMIT_STORE: "memory"
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
