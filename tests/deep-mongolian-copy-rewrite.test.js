const assert = require("assert");
const fs = require("fs");
const path = require("path");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal, allQuestionObjects } = app;

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function visibleQuestionCopy() {
  return allQuestionObjects()
    .flatMap(question => [question.text, ...(question.options || [])])
    .join("\n");
}

function assertAbsent(text, phrases, label) {
  phrases.forEach(phrase => {
    assert(!text.includes(phrase), `${label} should not contain visible engine/raw copy: ${phrase}`);
  });
}

function run() {
  const inventoryPath = path.join(__dirname, "..", "COPY_REWRITE_INVENTORY.md");
  assert(fs.existsSync(inventoryPath), "COPY_REWRITE_INVENTORY.md should exist");
  const inventory = fs.readFileSync(inventoryPath, "utf8");
  [
    "Landing page",
    "One-Time assessment questions",
    "Daily diary questions",
    "One-Time report opening",
    "Safety/professional copy",
    "One-Time paywall",
    "Lead capture copy"
  ].forEach(section => {
    assert(inventory.includes(section), `inventory should include ${section}`);
  });

  const questionCopy = visibleQuestionCopy();
  assertAbsent(questionCopy, [
    "Executive Load",
    "Food-as-Regulation",
    "Decision-Default",
    "Reward-Seeking",
    "Hunger-Safety",
    "mechanism",
    "evidence",
    "reportUse",
    "safetyTrigger",
    "checkpoint"
  ], "question/option copy");

  assertAbsent(questionCopy, [
    "high_hunger",
    "reward_pull",
    "food_as_regulation",
    "default_delivery",
    "control_collapse"
  ], "question/option copy");

  assert(questionCopy.includes("ингэе гэж бодоогүй байсан ч"), "daily diary should ask about lived unplanned moments");
  assert(/хамгийн амар сонголт/i.test(questionCopy), "daily/probe copy should include natural default-choice phrasing");
  assert(questionCopy.includes("сэтгэл түр намдах"), "probe copy should include natural regulation phrasing");
  assert(questionCopy.includes("Тайлбар хадгалагдлаа"), "summary confirmation should use natural saved-note copy");

  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers: { "S1-B03": "Тийм" },
    diaryEntries: []
  });
  const professional = normalize(_internal.renderReport());
  assert(professional.includes("онош гэсэн үг биш"), "safety copy should include non-diagnostic reassurance");
  assert(!professional.includes("Professional-first"), "professional route should not expose engine label");

  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: true,
    sevenDayPaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Хоол захиалах", "Ойр байсан зууш"],
      "S1-L03": ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх"]
    },
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" }
    ],
    diaryEntries: []
  });
  const report = normalize(_internal.renderReport());
  const livedIndex = report.indexOf("Та юу идэхээ мэдэхгүйдээ биш");
  const structureIndex = report.indexOf("Давтагддаг тойрог");
  assert(livedIndex >= 0, "report should include lived explanation");
  assert(structureIndex >= 0, "report should include human-readable cycle section");
  assert(livedIndex < structureIndex, "report should explain the lived moment before the cycle");
  assert(!report.includes("давтамжтай нийцэж байна"), "report should not use old engine fit phrase");

  mockBackend.resetMockBackend();
  _internal.startLeadCapture("one-time");
  const leadCapture = normalize(_internal.renderLeadCapture());
  assert(leadCapture.includes("Нээлтийн туршилтын бүртгэл"));
  assert(leadCapture.includes("Сонирхлоо үлдээх") || leadCapture.includes("бүртгүүлэх"));
  assertAbsent(leadCapture, ["purchase intent", "lead capture", "fake payment", "validation", "conversion"], "lead capture UI");

  const visibleUi = normalize([
    _internal.renderChoice(),
    _internal.renderLeadCapture(),
    _internal.renderLeadThankYou(),
    _internal.renderValidationSummary(),
    report,
    professional
  ].join("\n"));
  assertAbsent(visibleUi, [
    "TODO",
    "placeholder",
    "dummy",
    "Full report eligible",
    "Professional-first",
    "Urgent Safety Report",
    "Self-report based"
  ], "visible UI");

  ["pattern", "trigger", "default", "reward", "leverage point", "diary"].forEach(term => {
    assert(typeof term === "string", `allowed term should not fail: ${term}`);
  });
}

run();
console.log("deep-mongolian-copy-rewrite tests passed");
