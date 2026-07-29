"use strict";
const { instrument } = require("../../netlify/functions/_lib/pilot-v2-engine.js");
const contextRegistry = require("../../pilot-v2/context-registry.js");
const safetyRegistry = require("../../pilot-v2/safety-registry.js");
const scored = instrument.items.filter(item => item.pilotRole === "scored_core_candidate");
const quality = instrument.items.find(item => item.pilotRole === "non_scored_research_quality");
const fill = value => Object.fromEntries(instrument.items.map(item => [item.itemKey, String(value)]));
const byDirection = (barrier, capability) => Object.fromEntries(instrument.items.map(item => [item.itemKey,
  item.pilotRole === "non_scored_research_quality" ? "2" : item.scoringDirection === "higher_capability" ? String(capability) : String(barrier)]));
const fixtures = Object.freeze({
  allLowEndorsement: byDirection(0, 4),
  allHighEndorsement: byDirection(4, 0),
  mixedProfile: Object.fromEntries(instrument.items.map((item, index) => [item.itemKey, String(index % 5)])),
  missingNotApplicable: Object.fromEntries(instrument.items.map((item, index) => [item.itemKey, index % 4 === 0 ? "NA" : "2"])),
  restrictiveReboundIncomplete: Object.fromEntries(scored.filter(item => item.construct !== "restrictive_rebound").map(item => [item.itemKey, "2"])),
  favorableSelfEfficacy: Object.fromEntries(instrument.items.map(item => [item.itemKey, item.construct === "eating_self_efficacy" ? "4" : "2"])),
  highEmotionalEating: Object.fromEntries(instrument.items.map(item => [item.itemKey, item.construct === "emotional_eating" ? "4" : "2"])),
  contextOnlyMovementInjury: { answers: {}, contextResponses: {
    [contextRegistry.items.find(item => item.domain === "movement").itemKey]: "limited",
    [contextRegistry.items.find(item => item.domain === "injury").itemKey]: "present"
  } },
  safetyRoute: { answers: fill(2), safetyResponses: {
    [safetyRegistry.items.find(item => item.domain === "urgent_physical_symptom").itemKey]: "present"
  } },
  straightLineQualityFlag: { ...fill(2), [quality.itemKey]: "4" }
});
module.exports = fixtures;
