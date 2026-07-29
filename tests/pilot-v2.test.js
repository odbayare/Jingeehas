"use strict";
process.env.NODE_ENV = "test";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const engine = require("../netlify/functions/_lib/pilot-v2-engine.js");
const { instrument, registry, contextRegistry, safetyRegistry, scorePilot, evaluateResponseQuality,
  deriveSafetyRoute, validateProfileResponses, validateContextResponses, validateSafetyResponses, buildPilotReport, ORDER } = engine;
const scales = require("../pilot-v2/scale-registry.js");
const fixtures = require("./fixtures/pilot-v2-synthetic.js");
const { createInvite, verifyInvite, subjectHash } = require("../netlify/functions/_lib/pilot-v2-access.js");

assert.equal(instrument.items.length, 49);
assert.equal(instrument.items.filter(item => item.pilotRole === "scored_core_candidate").length, 48);
const heldText = fs.readFileSync(path.join(__dirname, "../docs/psychometrics/candidate-bank-v2-1/HELD_ITEMS_V2_1.csv"), "utf8");
for (const item of instrument.items) assert.equal(heldText.split(/\r?\n/).slice(1).some(line => line.startsWith(`${item.itemKey},`)), false);
assert.deepEqual(new Set(instrument.items.filter(item => item.pilotRole === "scored_core_candidate").map(item => item.construct)), new Set(ORDER));
for (const scaleId of Object.keys(registry)) for (let index = 0; index < 5; index += 1) assert.equal(scales.score(scaleId, String(index)), index);
assert.equal(scales.score("frequency_14d_opportunity_0_4_na", "NA"), null);
for (const item of instrument.items.filter(item => item.pilotRole === "scored_core_candidate")) assert.match(item.scoringDirection, /^higher_(barrier|capability)$/);

const emotionalItems = instrument.items.filter(item => item.construct === "emotional_eating");
assert.equal(scorePilot(Object.fromEntries(emotionalItems.slice(0, 5).map(item => [item.itemKey, "4"]))).constructs.emotional_eating.dataStatus, "partial_scorable");
assert.equal(scorePilot(Object.fromEntries(emotionalItems.slice(0, 4).map(item => [item.itemKey, "4"]))).constructs.emotional_eating.dataStatus, "insufficient_data");
const rebound = instrument.items.filter(item => item.construct === "restrictive_rebound");
assert.equal(scorePilot(Object.fromEntries(rebound.slice(0, 3).map(item => [item.itemKey, "4"]))).constructs.restrictive_rebound.dataStatus, "insufficient_data");
assert.equal(scorePilot(Object.fromEntries(rebound.map(item => [item.itemKey, "4"]))).constructs.restrictive_rebound.dataStatus, "complete");

const favorable = scorePilot(fixtures.favorableSelfEfficacy);
assert.equal(favorable.constructs.eating_self_efficacy.constructOrientation, "capability");
assert.equal(favorable.constructs.eating_self_efficacy.nativeScore, 100);
assert.equal(favorable.constructs.eating_self_efficacy.barrierBurdenScore, 0);
const awarenessAnswers = Object.fromEntries(instrument.items.filter(item => item.construct === "hunger_satiety_awareness")
  .map(item => [item.itemKey, item.scoringDirection === "higher_capability" ? "4" : "0"]));
assert.equal(scorePilot(awarenessAnswers).constructs.hunger_satiety_awareness.nativeScore, 100);
assert.equal(scorePilot(fixtures.allHighEndorsement).constructs.emotional_eating.nativeScore, 100);

const base = scorePilot(fixtures.mixedProfile);
const qualityKey = instrument.items.find(item => item.pilotRole === "non_scored_research_quality").itemKey;
assert.deepEqual(scorePilot({ ...fixtures.mixedProfile, [qualityKey]: "4" }).constructs, base.constructs);
assert.equal(evaluateResponseQuality(fixtures.straightLineQualityFlag).straightLinePattern, true);
assert.equal(evaluateResponseQuality(fixtures.straightLineQualityFlag).affectsProfileScores, false);

const contextResponses = Object.fromEntries(contextRegistry.items.map(item => [item.itemKey, item.options.at(-1).code]));
const safeResponses = Object.fromEntries(safetyRegistry.items.map(item => [item.itemKey, "none"]));
const unsafeResponses = { ...safeResponses, [safetyRegistry.items[1].itemKey]: "present" };
assert.equal(deriveSafetyRoute(safeResponses), false);
assert.equal(deriveSafetyRoute(unsafeResponses), true);
assert.equal(deriveSafetyRoute({ urgent: true }), false);
const report = buildPilotReport({ answers: fixtures.mixedProfile, contextResponses, safetyResponses: safeResponses });
assert.equal(report.interactions.enabled, false);
assert(report.sections.context.facts.length >= 5);
assert.deepEqual(buildPilotReport({ answers: fixtures.mixedProfile, contextResponses, safetyResponses: safeResponses }).sections.profile.constructs,
  buildPilotReport({ answers: fixtures.mixedProfile, contextResponses: {}, safetyResponses: unsafeResponses }).sections.profile.constructs);
assert(report.sections.profile.constructs.find(item => item.key === "eating_self_efficacy").nativeScore === base.constructs.eating_self_efficacy.nativeScore);
assert(report.sections.endorsed.items.every(item => typeof item.barrierBurdenScore === "number"));
assert(report.sections.strengths.items.every(item => engine.CONSTRUCTS[item.construct].orientation === "capability"));
const lowCapabilityAnswers = Object.fromEntries(instrument.items.filter(item => item.pilotRole === "scored_core_candidate").map(item => {
  const orientation = engine.CONSTRUCTS[item.construct].orientation;
  const directionMatchesNative = (orientation === "barrier" && item.scoringDirection === "higher_barrier")
    || (orientation === "capability" && item.scoringDirection === "higher_capability");
  return [item.itemKey, directionMatchesNative ? "0" : "4"];
}));
const lowCapabilityReport = buildPilotReport({ answers: lowCapabilityAnswers, safetyResponses: safeResponses });
const capabilityBurden = lowCapabilityReport.sections.endorsed.items.find(item => item.construct === "eating_self_efficacy" || item.construct === "hunger_satiety_awareness");
assert(capabilityBurden);
assert.match(capabilityBurden.label, /сул дэмжигдсэн/);
assert.equal(capabilityBurden.label.includes(" — 100"), false);
const routed = buildPilotReport({ answers: fixtures.mixedProfile, contextResponses, safetyResponses: unsafeResponses });
assert.equal(routed.safetyRoute, true);
assert.equal(routed.sections.endorsed.items.length, 0);
assert.equal(routed.sections.strengths.items.length, 0);
assert.match(routed.sections.startingDirection.body, /Аюулгүй/);

const engineText = fs.readFileSync(path.join(__dirname, "../netlify/functions/_lib/pilot-v2-engine.js"), "utf8");
for (const forbidden of ["+1", "+2", "+3", "mandatory anchor", "regex-derived", ">= 50", "< 50"]) assert.equal(engineText.toLowerCase().includes(forbidden), false);
const customer = JSON.stringify(report).toLowerCase();
for (const term of ["risk level", "percentile", "clinical cut-off", '"high"', '"medium"', '"low"']) assert.equal(customer.includes(term), false);
for (const item of instrument.items) assert.equal(customer.includes(item.itemText.toLowerCase()), false);
for (const item of safetyRegistry.items) assert.equal(customer.includes(item.prompt.toLowerCase()), false);
assert.equal(report.sections.provenance.instrumentVersion, "jingeehas-ai-pilot-v2.1");
assert.equal(report.sections.provenance.scoringVersion, "jingeehas-ai-pilot-scoring-v2.1-equal-weight");
assert.equal(report.sections.provenance.reportVersion, "jingeehas-ai-pilot-report-v2.1");

assert.throws(() => validateProfileResponses({ UNKNOWN: "1" }), error => error.code === "invalid_pilot_response");
assert.throws(() => validateProfileResponses({ [instrument.items[0].itemKey]: "present" }), error => error.code === "invalid_pilot_response");
assert.throws(() => validateContextResponses({ [contextRegistry.items[0].itemKey]: "bogus" }), error => error.code === "invalid_pilot_response");
assert.throws(() => validateSafetyResponses({ urgent: "present" }), error => error.code === "invalid_pilot_response");

const raw = fs.readFileSync(path.join(__dirname, "../docs/psychometrics/candidate-bank-v2-1/PILOT_CANDIDATE_BANK_V2_1.csv"));
assert.equal(instrument.itemBankSha256, crypto.createHash("sha256").update(raw).digest("hex"));
const env = { PILOT_V2_INVITE_SECRET: "software-test-signing-secret-thirty-two-bytes",
  PILOT_V2_SUBJECT_HASH_PEPPER: "software-test-subject-pepper-thirty-two-bytes" };
const token = createInvite({ expiresAt: new Date(Date.now() + 60000), inviteId: "synthetic-fixture" }, env);
assert.equal(verifyInvite(token, env).jti, "synthetic-fixture");
assert.throws(() => verifyInvite(token, env, new Date(Date.now() + 120000)), error => error.code === "pilot_access_denied");
const rotatedSigning = { ...env, PILOT_V2_INVITE_SECRET: "rotated-software-signing-secret-thirty-two" };
assert.equal(subjectHash("admin", "owner", env), subjectHash("admin", "owner", rotatedSigning));
assert.notEqual(subjectHash("admin", "owner", env), subjectHash("admin", "owner", { ...env, PILOT_V2_SUBJECT_HASH_PEPPER: "rotated-subject-pepper-at-least-thirty-two" }));
const clientSource = fs.readFileSync(path.join(__dirname, "../pilot-v2/pilot-v2.js"), "utf8");
assert(clientSource.includes("location.hash"));
assert.equal(clientSource.includes('get("pilot_invite")') && clientSource.includes("location.search"), true);
assert.equal(clientSource.includes("searchParams.get(\"pilot_invite\")"), false);
assert(clientSource.indexOf("history.replaceState") < clientSource.indexOf('api("pilot-v2-access")'));
console.log("pilot-v2.test.js passed");
