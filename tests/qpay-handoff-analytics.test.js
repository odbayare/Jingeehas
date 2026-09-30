"use strict";

process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { MemoryDatabaseAdapter } = require("./support/memory-database.js");
const { setDatabaseForTests } = require("../netlify/functions/_lib/store.js");
const { createSession } = require("../netlify/functions/_lib/session.js");
const { BROWSER_EVENTS, SERVER_EVENTS, funnelKeyHash, hashAnonymous } = require("../netlify/functions/_lib/analytics.js");
const collect = require("../netlify/functions/analytics-collect.js").handler;

const read = file => fs.readFileSync(path.join(__dirname, "..", file), "utf8");
const ATTEMPT = "qpay_handoff_attempted";
const RETURN = "qpay_page_returned";
const context = { visitorId: crypto.randomUUID(), sessionId: crypto.randomUUID(), deviceClass: "mobile" };

(async () => {
  const database = new MemoryDatabaseAdapter();
  setDatabaseForTests(database);
  const owner = await createSession(database);
  const stranger = await createSession(database);
  const recovered = await createSession(database);
  const cookie = owner.cookie.split(";")[0];
  const assessment = { id: "wa_handoff_checkout", sessionId: owner.session.id, status: "complete",
    commercialFlowVersion: "free_assessment_postpaid_v1", safetyRoute: null, createdAt: new Date().toISOString() };
  await database.insert("assessments", assessment);
  const otherAssessment = { ...assessment, id: "wa_other_checkout" };
  await database.insert("assessments", otherAssessment);
  await database.insert("assessment_sessions", { id: `${assessment.id}:${recovered.session.id}`,
    assessmentId: assessment.id, sessionId: recovered.session.id, source: "recovery" });
  const initialAssessment = await database.get("assessments", assessment.id);
  const attemptId = crypto.randomUUID();
  const attemptEventId = crypto.randomUUID();
  const send = (eventName, attempt = attemptId, options = {}) => collect({
    httpMethod: "POST",
    headers: { origin: "http://localhost:4178", host: "localhost:4178", "user-agent": "Safari",
      cookie, ...options.headers },
    body: JSON.stringify({ eventName, eventId: options.eventId || crypto.randomUUID(), attemptId: attempt,
      assessmentId: assessment.id, context, ...options.body })
  });
  const errorIs = (response, status, error) => {
    assert.equal(response.statusCode, status);
    assert.equal(JSON.parse(response.body).error, error);
  };

  for (const name of [ATTEMPT, RETURN]) {
    assert(BROWSER_EVENTS.has(name));
    assert(!SERVER_EVENTS.has(name), "observation must not be presented as server-authoritative payment evidence");
    errorIs(await send(name, attemptId, { headers: { cookie: "" } }), 401, "unauthorized");
    errorIs(await send(name, attemptId, { headers: { cookie: stranger.cookie.split(";")[0] } }), 404, "assessment_not_found");
    errorIs(await send(name, attemptId, { body: { assessmentId: "" } }), 400, "assessment_required");
    errorIs(await send(name, "bank://pay?invoice=private"), 400, "invalid_attempt");
    errorIs(await send(name, ""), 400, "invalid_attempt");
  }
  errorIs(await send(ATTEMPT, attemptId, { headers: { origin: "https://evil.example" } }), 403, "invalid_origin");
  errorIs(await send("payment_confirmed"), 400, "invalid_event");
  for (const patch of [{ status: "draft" }, { safetyRoute: "support" }, { commercialFlowVersion: "prepaid_v2" }, { commercialFlowVersion: "legacy_postpaid_v1" }]) {
    await database.update("assessments", assessment.id, { ...assessment, ...patch });
    for (const name of [ATTEMPT, RETURN]) errorIs(await send(name), 404, "checkout_unavailable");
  }
  await database.update("assessments", assessment.id, assessment);

  // A missing/reordered return must not fabricate a click. Replaying the attempt
  // and then the same return succeeds without creating duplicates.
  const returnedEventId = crypto.randomUUID();
  errorIs(await send(RETURN, attemptId, { eventId: returnedEventId }), 409, "handoff_attempt_required");
  assert.equal((await database.find("analytics_events", {})).length, 0);
  assert.equal((await send(ATTEMPT, attemptId, { eventId: attemptEventId })).statusCode, 202);
  assert.equal((await send(ATTEMPT, attemptId, { eventId: attemptEventId })).statusCode, 202);
  assert.equal((await send(ATTEMPT, attemptId.toUpperCase())).statusCode, 202, "attempt UUID casing cannot bypass deduplication");
  assert.equal((await send(RETURN, attemptId, { eventId: returnedEventId })).statusCode, 202);
  assert.equal((await send(RETURN, attemptId)).statusCode, 202);
  const firstPair = await database.find("analytics_events", { funnelKeyHash: funnelKeyHash(assessment.id) });
  assert.equal(firstPair.length, 2);
  for (const row of firstPair) {
    assert.deepEqual(row.metadata, { attemptId });
    assert.equal(row.idempotencyKey, `${row.eventName}:${funnelKeyHash(assessment.id)}:${attemptId}`);
    assert.equal(row.assessmentId, null);
    assert.equal(row.invoiceId, null);
    assert.equal(row.paymentId, null);
    assert.equal(row.amountMnt, null);
    assert.equal(row.isTest, true);
  }
  errorIs(await send(RETURN, attemptId, { body: { assessmentId: otherAssessment.id } }), 409, "handoff_attempt_required");

  const secondAttemptId = crypto.randomUUID();
  assert.equal((await send(ATTEMPT, secondAttemptId)).statusCode, 202, "separate real clicks remain separate observations");
  assert.equal((await send(RETURN, secondAttemptId, { headers: { cookie: recovered.cookie.split(";")[0] },
    body: { context: { ...context, sessionId: crypto.randomUUID() } } })).statusCode, 202,
  "authorized recovered access and analytics-session rotation do not break matching");

  const privacyAttemptId = crypto.randomUUID();
  const privateText = "PRIVATE_BANK_HEALTH_CONTACT_CONTENT";
  const privateUrl = `bank://payment?invoice=${privateText}`;
  const body = { metadata: { attemptId: crypto.randomUUID(), url: privateUrl, bankName: privateText, answers: privateText },
    invoiceId: privateText, paymentId: privateText, amountMnt: 999999, funnelKeyHash: "f".repeat(64),
    context: { ...context, utmSource: privateUrl, utmMedium: privateText, utmCampaign: privateText,
      utmContent: privateText, utmTerm: privateText, referrer: `https://${privateText.toLowerCase()}.example/path`, deviceClass: privateText } };
  assert.equal((await send(ATTEMPT, privacyAttemptId, { body })).statusCode, 202);
  assert.equal((await send(RETURN, privacyAttemptId, { body })).statusCode, 202);
  const privacyRows = (await database.find("analytics_events", {})).filter(row => row.metadata.attemptId === privacyAttemptId);
  assert.equal(privacyRows.length, 2);
  for (const row of privacyRows) {
    assert.deepEqual(row.metadata, { attemptId: privacyAttemptId });
    assert.equal(row.funnelKeyHash, funnelKeyHash(assessment.id));
    assert.equal(row.deviceClass, "unknown");
    for (const field of ["assessmentId", "invoiceId", "paymentId", "amountMnt", "utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm", "referrerHost"]) assert.equal(row[field], null, field);
    for (const forbidden of [privateText, privateText.toLowerCase(), privateUrl, assessment.id, context.visitorId, context.sessionId]) {
      assert(!JSON.stringify(row).includes(forbidden), `private value persisted: ${forbidden}`);
    }
  }

  // Return exclusions inherit the attempt even if the owner/preview cookie has disappeared.
  const flaggedAttemptId = crypto.randomUUID();
  assert.equal((await send(ATTEMPT, flaggedAttemptId, { headers: { cookie: `${cookie}; jingeehas_admin=owner-test` } })).statusCode, 202);
  assert.equal((await send(RETURN, flaggedAttemptId)).statusCode, 202);
  assert((await database.find("analytics_events", { eventName: RETURN })).find(row => row.metadata.attemptId === flaggedAttemptId).isAdmin);
  const beforeBot = (await database.find("analytics_events", {})).length;
  const botResponse = await send(ATTEMPT, crypto.randomUUID(), { headers: { "user-agent": "Googlebot" } });
  assert.equal(botResponse.statusCode, 202);
  assert.equal(JSON.parse(botResponse.body).recorded, false);
  assert.equal((await database.find("analytics_events", {})).length, beforeBot);
  errorIs(await send(ATTEMPT, crypto.randomUUID(), { body: { metadata: { junk: "x".repeat(4096) } } }), 413, "payload_too_large");
  errorIs(await send(ATTEMPT, crypto.randomUUID(), { body: { context: { visitorId: "invalid" } } }), 400, "invalid_context");

  const rateKeyHash = hashAnonymous("rate", `:${context.visitorId}`);
  for (let index = 0; index < 30; index += 1) await database.insert("analytics_events", { id: crypto.randomUUID(),
    eventId: crypto.randomUUID(), eventName: ATTEMPT, rateKeyHash, createdAt: new Date().toISOString() });
  errorIs(await send(ATTEMPT, crypto.randomUUID()), 429, "rate_limited");

  // Collection only appends analytics; no provider, payment, or entitlement operation occurs.
  assert.deepEqual(await database.get("assessments", assessment.id), initialAssessment);
  assert.equal((await database.find("payments", {})).length, 0);
  assert.equal((await database.find("entitlements", {})).length, 0);
  const collector = read("netlify/functions/analytics-collect.js");
  assert(!collector.includes("getQPayProvider"));
  assert(!collector.includes("deliverConfirmedPurchase"));

  // The production DB constraint must accept both events and preserve every existing name.
  const migration = read("supabase/migrations/20260930104000_add_qpay_handoff_observations.sql");
  const previous = read("supabase/migrations/20260804043918_map_post_assessment_paywall_analytics.sql");
  const eventNames = sql => [...sql.matchAll(/'([a-z0-9_]+)'::text/g)].map(match => match[1]);
  for (const name of [...eventNames(previous), ATTEMPT, RETURN]) assert(eventNames(migration).includes(name), `migration drops ${name}`);
  assert.equal(eventNames(migration).length, new Set(eventNames(migration)).size);
  assert(migration.includes("set local lock_timeout = '5s'"));
  assert(migration.includes("insert into jingeehas.schema_migrations(version)"));
  assert(!/\b(?:update|delete|grant|revoke)\b|drop\s+table/i.test(migration), "migration may only extend the allowlist and register its version");
  for (const name of [ATTEMPT, RETURN]) assert(read("database/schema.sql").includes(`'${name}'`));
  console.log("QPay handoff analytics authorization, privacy, pairing, dedupe, and migration contract tests passed");
})().catch(error => { console.error(error); process.exitCode = 1; });
