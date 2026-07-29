"use strict";
process.env.NODE_ENV = "test";
process.env.PILOT_V2_INVITE_SECRET = "pilot-contract-signing-secret-with-thirty-two-bytes";
process.env.PILOT_V2_SUBJECT_HASH_PEPPER = "pilot-contract-subject-pepper-with-thirty-two-bytes";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { MemoryDatabaseAdapter } = require("../support/memory-database.js");
const { setDatabaseForTests } = require("../../netlify/functions/_lib/store.js");
const { createInvite } = require("../../netlify/functions/_lib/pilot-v2-access.js");
const { createRoleSession, ADMIN_SESSION } = require("../../netlify/functions/_lib/auth.js");
const engine = require("../../netlify/functions/_lib/pilot-v2-engine.js");
const database = new MemoryDatabaseAdapter();
setDatabaseForTests(database);
const access = require("../../netlify/functions/pilot-v2-access.js").handler;
const instrumentEndpoint = require("../../netlify/functions/pilot-v2-instrument.js").handler;
const assessment = require("../../netlify/functions/pilot-v2-assessment.js").handler;
const eventEndpoint = require("../../netlify/functions/pilot-v2-event.js").handler;
const inviteEndpoint = require("../../netlify/functions/pilot-v2-invite-create.js").handler;
const request = (method, token = "", body = null) => ({ httpMethod: method, headers: token ? { authorization: `Pilot ${token}` } : {}, body: body == null ? null : JSON.stringify(body) });
const parse = result => JSON.parse(result.body);

(async () => {
  assert.equal((await access(request("GET"))).statusCode, 401);
  assert.equal((await instrumentEndpoint(request("GET"))).statusCode, 401);
  const token = createInvite({ expiresAt: new Date(Date.now() + 60000), inviteId: "contract-invite" });
  assert.equal((await access(request("GET", token))).statusCode, 200);
  const instrumentResponse = parse(await instrumentEndpoint(request("GET", token)));
  assert.equal(instrumentResponse.instrument.items.length, 49);
  assert.equal(instrumentResponse.contextRegistry.items.length, 6);
  assert.equal(instrumentResponse.safetyRegistry.items.length, 3);
  assert.equal(instrumentResponse.displayLabels.dataStatuses.complete, "Бүрэн хариулсан");
  await database.insert("admin_accounts", { id: "pilot-owner", status: "active", isOwner: true });
  const ownerSession = await createRoleSession(database, { ...ADMIN_SESSION, ownerId: "pilot-owner" });
  const disabledInvite = await inviteEndpoint({ httpMethod: "POST", headers: { cookie: ownerSession.cookie.split(";")[0] },
    body: JSON.stringify({ expiresInHours: 24 }) });
  assert.equal(disabledInvite.statusCode, 403);
  assert.equal(parse(disabledInvite).error, "human_invites_disabled");
  assert.equal((await assessment(request("POST", token, { action: "start" }))).statusCode, 400);

  const startBody = { action: "start", acknowledged: true, acknowledgmentVersion: instrumentResponse.acknowledgment.version };
  const started = parse(await assessment(request("POST", token, startBody)));
  const assessmentId = started.assessmentId;
  const stored = database.pilotV2Assessments.get(assessmentId);
  assert(stored);
  assert.equal(stored.acknowledgmentVersion, instrumentResponse.acknowledgment.version);
  assert.match(stored.acknowledgedAt, /^\d{4}-/);
  assert.equal("acknowledged" in stored, false);
  const firstItem = engine.instrument.items[0];
  const validSave = { action: "save", assessmentId, lastCompletedSection: firstItem.construct,
    answers: { [firstItem.itemKey]: "1" }, contextResponses: {}, safetyResponses: {} };

  for (const field of Object.keys(engine.VERSION_FIELDS)) {
    const original = stored[field]; stored[field] = `${original}-mismatch`;
    for (const body of [{ action: "load", assessmentId }, validSave, { action: "complete", assessmentId }]) {
      const blocked = await assessment(request("POST", token, body));
      assert.equal(blocked.statusCode, 409, `${field}:${body.action}`);
      assert.equal(parse(blocked).error, "pilot_version_mismatch");
    }
    stored[field] = original;
  }

  assert.equal((await assessment(request("POST", token, { ...validSave, answers: { UNKNOWN: "1" } }))).statusCode, 400);
  assert.equal((await assessment(request("POST", token, { ...validSave, answers: { [firstItem.itemKey]: "present" } }))).statusCode, 400);
  assert.equal((await assessment(request("POST", token, { action: "complete", assessmentId, safety: { urgent: true } }))).statusCode, 400);
  assert.equal((await assessment(request("POST", token, validSave))).statusCode, 200);
  const contextResponses = Object.fromEntries(engine.contextRegistry.items.map(item => [item.itemKey, item.options.at(-1).code]));
  const safetyResponses = Object.fromEntries(engine.safetyRegistry.items.map(item => [item.itemKey, "none"]));
  assert.equal((await assessment(request("POST", token, { action: "save", assessmentId, lastCompletedSection: "context", answers: {}, contextResponses, safetyResponses: {} }))).statusCode, 200);
  assert.equal((await assessment(request("POST", token, { action: "save", assessmentId, lastCompletedSection: "safety", answers: {}, contextResponses: {}, safetyResponses }))).statusCode, 200);
  const completed = parse(await assessment(request("POST", token, { action: "complete", assessmentId })));
  assert.equal(completed.safetyRoute, false);
  assert(completed.report.sections.context.facts.length > 0);
  assert.equal(JSON.stringify(completed.report).includes("CONTEXT-SLEEP-V21"), false);

  const second = parse(await assessment(request("POST", token, startBody)));
  const routedSafety = { ...safetyResponses, [engine.safetyRegistry.items[1].itemKey]: "present" };
  const earlyRoute = parse(await assessment(request("POST", token, { action: "save", assessmentId: second.assessmentId, lastCompletedSection: "safety", answers: {}, contextResponses: {}, safetyResponses: routedSafety })));
  assert.equal(earlyRoute.safetyRoute, true);
  const routed = parse(await assessment(request("POST", token, { action: "load", assessmentId: second.assessmentId })));
  assert.equal(routed.safetyRoute, true);
  assert.equal(routed.report.sections.profile.constructs.length, 0);
  assert.equal(routed.report.sections.endorsed.items.length, 0);
  assert.equal(routed.report.sections.strengths.items.length, 0);

  const sectionEvent = { eventName: "section_reached", assessmentId, section: firstItem.construct,
    answers: { secret: "never stored" }, safetyResponses: { secret: "never stored" } };
  await eventEndpoint(request("POST", token, sectionEvent));
  await eventEndpoint(request("POST", token, sectionEvent));
  assert.equal(database.pilotV2Events.filter(row => row.eventName === "section_reached" && row.section === firstItem.construct).length, 1);
  assert.equal(JSON.stringify(database.pilotV2Events).includes("never stored"), false);
  for (const category of ["network_failure", "save_failure", "completion_failure", "version_mismatch"]) {
    const errorEvent = { eventName: "error_category", assessmentId, category };
    assert.equal((await eventEndpoint(request("POST", token, errorEvent))).statusCode, 202);
    assert.equal((await eventEndpoint(request("POST", token, errorEvent))).statusCode, 202);
  }
  const storedErrors = database.pilotV2Events.filter(row => row.eventName === "error_category");
  assert.equal(storedErrors.length, 4);
  assert.equal(new Set(storedErrors.map(row => row.category)).size, 4);
  assert.equal((await eventEndpoint(request("POST", token, { eventName: "report_opened", assessmentId: "pv2_missing" }))).statusCode, 404);
  database.pilotV2Assessments.set("pv2_unrelated", { ...stored, id: "pv2_unrelated", accessSubjectHash: "unrelated-subject" });
  const unrelated = await eventEndpoint(request("POST", token, { eventName: "report_opened", assessmentId: "pv2_unrelated" }));
  assert.equal(unrelated.statusCode, 404);
  assert.equal(parse(unrelated).error, "pilot_event_not_allowed");
  assert.equal(database.pilotV2Events.some(row => row.assessmentId === "pv2_unrelated"), false);

  const loaded = parse(await assessment(request("POST", token, { action: "load", assessmentId })));
  assert.equal("accessSubjectHash" in loaded, false);
  assert.equal(loaded.lastCompletedSection, "safety");
  const publicIndex = fs.readFileSync(path.join(__dirname, "../../index.html"), "utf8");
  const publicApp = fs.readFileSync(path.join(__dirname, "../../app.js"), "utf8");
  assert.equal(publicIndex.includes("/pilot-v2"), false);
  assert.equal(publicApp.includes("pilot-v2"), false);
  assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname, "../../questions.js"))).digest("hex"), "ac79aa5e83d6c37234f886f2683fd036ba80862afa5f3b6f3d8b2131f7f22d14");
  const migration = fs.readFileSync(path.join(__dirname, "../../supabase/migrations/20260729090000_add_private_pilot_v2_1_storage.sql"), "utf8");
  for (const table of ["context_responses", "safety_responses", "last_completed_section", "acknowledgment_version",
    "pilot_v2_lifecycle_idempotency_idx", "pilot_v2_error_idempotency_idx"]) assert(migration.includes(table));
  assert.equal(migration.includes("analytics_events"), false);
  const inviteSource = fs.readFileSync(path.join(__dirname, "../../netlify/functions/pilot-v2-invite-create.js"), "utf8");
  assert(inviteSource.includes("/pilot-v2#pilot_invite="));
  assert.equal(inviteSource.includes("/pilot-v2?pilot_invite="), false);
  console.log("pilot V2 access, version, storage, and safety contracts passed");
})().catch(error => { console.error(error); process.exit(1); });
