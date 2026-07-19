"use strict";
const assert = require("node:assert/strict");
const { evaluateSafetyGate, ROUTE_COPY } = require("../netlify/functions/_lib/safety.js");

const active = evaluateSafetyGate({ age: 30, selfHarm: "Одоо идэвхтэй бодогдож байна", acuteMedical: ["Ухаан балартах"] });
assert.deepEqual(active, { mode: "urgent", category: "self_harm", triggerQuestionIds: ["SAFE-SH-01"],
  triggerValues: ["Одоо идэвхтэй бодогдож байна"], severity: "urgent", route: "urgent_self_harm" });
assert(!ROUTE_COPY.urgent_self_harm.body.includes("ухаан балар"));

const occasional = evaluateSafetyGate({ age: 30, selfHarm: "Одоо хааяа бодогддог", acuteMedical: ["Аль нь ч үгүй"] });
assert.equal(occasional.route, "mental_health_support");
const medical = evaluateSafetyGate({ age: 30, selfHarm: "Үгүй", acuteMedical: ["Ухаан балартах", "Аль нь ч үгүй"] });
assert.deepEqual(medical.triggerValues, ["Ухаан балартах"]);
assert.equal(medical.route, "urgent_medical_symptom");
assert.equal(evaluateSafetyGate({ age: 17 }).route, "medical_professional");
assert.equal(evaluateSafetyGate({ age: 30, selfHarm: "Үгүй", acuteMedical: ["Аль нь ч үгүй"], compensatoryBehavior: "Одоо хааяа" }).route, "eating_behavior_professional");
assert.equal(evaluateSafetyGate({ age: 30, selfHarm: "Үгүй", acuteMedical: ["Аль нь ч үгүй"], compensatoryBehavior: "Үгүй", medicalSuitability: "Үргэлжлүүлэхэд тохиромжтой" }).route, "eligible");
console.log("safety gate tests passed");
