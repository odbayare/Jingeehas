const assert = require("assert");
const app = require("../app.js");

const {
  generateStageSummaryBullets,
  extractTagsFromEvidence,
  mapTagsToDimensions,
  mapTagsToMechanismSignals,
  createConfirmedSummaryObject,
  confirmedStageEvidence,
  _internal
} = app;

const structured = {
  raw_reflection: "Ажлаас ирээд ядарсан үед хоол захиалах нь хамгийн амар сонголт болдог.",
  emotion: "Ядаргаа",
  food_function: ["Хамгийн амар сонголт байсан"]
};
const bullets = generateStageSummaryBullets(structured.raw_reflection, structured);
assert(bullets.length > 0, "one-time voice checkpoint must produce summary bullets");

const confirmed = createConfirmedSummaryObject({
  kind: "stage",
  id: "S1-V01",
  rawText: structured.raw_reflection,
  structured,
  aiSummaryBullets: bullets,
  mode: "confirm"
});
assert.strictEqual(confirmed.userConfirmed, true);
assert.deepStrictEqual(confirmed.confirmedSummary, bullets);
const tags = extractTagsFromEvidence(structured, confirmed.confirmedSummary);
assert(mapTagsToDimensions(tags).length > 0);
assert(mapTagsToMechanismSignals(tags).length > 0);

const edited = createConfirmedSummaryObject({
  kind: "stage",
  id: "S1-V01",
  rawText: "RAW TEXT MUST NOT RENDER",
  structured,
  aiSummaryBullets: bullets,
  mode: "edit",
  editText: "Орой ядарсан үед хоол захиалах нь амар санагддаг."
});
assert.strictEqual(edited.userConfirmed, true);
assert(edited.userEditedSummary.length === 1);

_internal.setTestState({
  packageType: "one-time",
  view: "report",
  oneTimePaid: true,
  stageAnswers: { "S1-V01": "RAW TEXT MUST NOT RENDER" },
  stageVoiceSummaries: { "S1-V01": edited }
});
assert.strictEqual(confirmedStageEvidence().length, 1);
const report = _internal.renderReport();
assert(report.includes("Орой ядарсан үед"));
assert(!report.includes("RAW TEXT MUST NOT RENDER"));

const urgent = createConfirmedSummaryObject({
  kind: "stage",
  id: "S1-V01",
  rawText: "хэвийн",
  structured: {},
  aiSummaryBullets: ["Өдөр хэвийн байсан"],
  mode: "add",
  addText: "Орой ухаан баларсан"
});
assert(urgent.safetyFlags.some(flag => flag.endsWith(":urgent")));
console.log("voice-summary-confirmation tests passed");
