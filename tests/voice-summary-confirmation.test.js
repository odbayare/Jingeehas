const assert = require("assert");
const app = require("../app.js");

const {
  generateDailySummaryBullets,
  extractTagsFromEvidence,
  mapTagsToDimensions,
  mapTagsToMechanismSignals,
  createConfirmedSummaryObject,
  confirmedNarrativeEvidence,
  _internal
} = app;

function draft(overrides = {}) {
  return {
    meal_rhythm: "Нэг хоол алгассан",
    unplanned_eating_count: "Тийм, 1 удаа",
    main_moment_time: "Орой",
    hunger_level: "8",
    food_function: ["Өөрийгөө шагнамаар байсан", "Хамгийн амар сонголт байсан"],
    emotion: "Ядаргаа",
    stress_score: "6",
    energy_score: "2",
    body_signals: ["Аль нь ч үгүй"],
    raw_reflection: "Ажлаас ирээд хоол хийх energy байгаагүй, delivery захиалсан.",
    ...overrides
  };
}

function entry(day, confirmedSummaryObject, overrides = {}) {
  return {
    diary_id: `d-${day}`,
    day_number: day,
    date: "2026-06-23",
    ...draft(),
    confirmedSummaryObject,
    ...overrides
  };
}

function run() {
  const dailyDraft = draft();
  const bullets = generateDailySummaryBullets(dailyDraft);
  assert(bullets.length >= 3);
  assert(bullets.some(bullet => bullet.includes("өлсөлт өндөр")));
  assert(bullets.some(bullet => bullet.includes("Хоол захиалах") || bullet.includes("хамгийн амар сонголт")));

  const confirmed = createConfirmedSummaryObject({
    kind: "diary",
    id: "D-V01",
    dayNumber: 1,
    rawText: dailyDraft.raw_reflection,
    structured: dailyDraft,
    aiSummaryBullets: bullets,
    mode: "confirm"
  });
  assert.strictEqual(confirmed.userConfirmed, true);
  assert.deepStrictEqual(confirmed.confirmedSummary, bullets);
  assert(confirmed.extractedTags.includes("high_hunger"));
  assert(confirmed.extractedTags.includes("reward_pull"));
  assert(confirmed.extractedTags.includes("default_delivery"));

  const edited = createConfirmedSummaryObject({
    kind: "diary",
    id: "D-V01",
    dayNumber: 2,
    rawText: "RAW TEXT SHOULD NOT APPEAR",
    structured: draft({ raw_reflection: "RAW TEXT SHOULD NOT APPEAR" }),
    aiSummaryBullets: bullets,
    mode: "edit",
    editText: "Орой delivery хамгийн амар сонголт болсон\nИдсэний дараа гэмшсэн"
  });
  assert.strictEqual(edited.userConfirmed, true);
  assert.deepStrictEqual(edited.userEditedSummary, ["Орой delivery хамгийн амар сонголт болсон", "Идсэний дараа гэмшсэн"]);
  assert(edited.confirmedSummary.includes("Идсэний дараа гэмшсэн"));
  assert(edited.extractedTags.includes("shame_guilt"));

  const added = createConfirmedSummaryObject({
    kind: "diary",
    id: "D-V01",
    dayNumber: 3,
    rawText: dailyDraft.raw_reflection,
    structured: dailyDraft,
    aiSummaryBullets: bullets,
    mode: "add",
    addText: "Хоол харагдаад cue болсон"
  });
  assert(added.confirmedSummary.some(item => item.includes("cue")));
  assert(added.extractedTags.includes("cue_trigger"));

  const tags = extractTagsFromEvidence(dailyDraft, confirmed.confirmedSummary);
  assert(mapTagsToDimensions(tags).includes("D03"));
  assert(mapTagsToDimensions(tags).includes("D05"));
  assert(mapTagsToDimensions(tags).includes("D13"));
  assert(mapTagsToMechanismSignals(tags).some(signal => signal.includes("Reward-Seeking")));
  assert(mapTagsToMechanismSignals(tags).some(signal => signal.includes("Executive Load")));

  const urgent = createConfirmedSummaryObject({
    kind: "diary",
    id: "D-V01",
    dayNumber: 4,
    rawText: "raw harmless",
    structured: draft({ raw_reflection: "raw harmless" }),
    aiSummaryBullets: ["Өдөр хэвийн байсан"],
    mode: "add",
    addText: "Орой ухаан баларсан, faint/confusion болсон"
  });
  assert(urgent.safetyFlags.some(flag => flag.endsWith(":urgent")));

  _internal.setTestState({
    packageType: "seven-day",
    preliminary: [{ key: "executive", score: 4, label: "дунд зэрэг нийцэж байна" }],
    diaryEntries: [entry(1, urgent)]
  });
  assert.strictEqual(_internal.reportMode().mode, "urgent");

  const unconfirmedRaw = entry(1, undefined, { raw_reflection: "RAW SECRET DELIVERY STORY", confirmedSummaryObject: undefined });
  _internal.setTestState({
    packageType: "seven-day",
    preliminary: [{ key: "executive", score: 4, label: "дунд зэрэг нийцэж байна" }],
    diaryEntries: [unconfirmedRaw, entry(2), entry(3), entry(4), entry(5)]
  });
  const structuredOnlyReport = _internal.renderReport();
  assert(structuredOnlyReport.includes("Үүнийг юунаас харсан бэ?"));
  assert(structuredOnlyReport.includes("Тэмдэглэлд") || structuredOnlyReport.includes("зураглал"));
  assert(!structuredOnlyReport.includes("RAW SECRET DELIVERY STORY"));

  const confirmedEntries = [1, 2, 3, 4, 5].map(day => entry(day, createConfirmedSummaryObject({
    kind: "diary",
    id: "D-V01",
    dayNumber: day,
    rawText: `raw ${day} should not appear`,
    structured: draft(),
    aiSummaryBullets: bullets,
    mode: "confirm"
  })));
  _internal.setTestState({
    packageType: "seven-day",
    preliminary: [{ key: "executive", score: 4, label: "дунд зэрэг нийцэж байна" }],
    diaryEntries: confirmedEntries
  });
  const report = _internal.renderReport();
  assert(report.includes("Үүнийг юунаас харсан бэ?"));
  assert(report.includes("Тэмдэглэлд"));
  assert(report.includes("Гол зураг"));
  assert(!report.includes("raw 1 should not appear"));

  assert.strictEqual(confirmedNarrativeEvidence(confirmedEntries).length, 5);
}

run();
console.log("voice-summary-confirmation tests passed");
