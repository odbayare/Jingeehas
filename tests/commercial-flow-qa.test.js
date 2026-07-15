const assert = require("assert");
const fs = require("fs");
const path = require("path");
const app = require("../app.js");

const { _internal } = app;
const root = path.join(__dirname, "..");

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function setOneTime(overrides = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    removedFeaturePaid: false,
    upgradePaid: false,
    stageAnswers: {
      "S1-L01": "Бараг өдөр бүр",
      "S1-L02": ["Delivery", "Snack"],
      "S1-L03": ["Цаг", "Ядаргаа", "Юу хийхээ шийдэх"]
    },
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" },
      { key: "decisionDefault", score: 4, label: "дунд зэрэг нийцэж байна" }
    ],
    contactCapture: {
      name: "Commercial QA",
      phone: "99119911",
      email: "",
      saved: true,
      message: "",
      copyStatus: ""
    },
    stageVoiceSummaries: {},
    removedEntries: [],
    ...overrides
  });
}

function setRemovedFeature(overrides = {}) {
  _internal.setTestState({
    packageType: "removed-feature",
    view: "report",
    oneTimePaid: false,
    removedFeaturePaid: false,
    upgradePaid: false,
    preliminary: [
      { key: "executive", score: 5, label: "хүчтэй нийцэж байна" },
      { key: "decisionDefault", score: 4, label: "дунд зэрэг нийцэж байна" }
    ],
    stageAnswers: {},
    removedEntries: [],
    ...overrides
  });
}

function setMode3Unpaid() {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    removedFeaturePaid: false,
    upgradePaid: false,
    stageAnswers: { "S1-B03": "Тийм" },
    removedEntries: []
  });
}

function setMode4Unpaid() {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    oneTimePaid: false,
    removedFeaturePaid: false,
    upgradePaid: false,
    stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" },
    removedEntries: []
  });
}

function assertNoCommercialSmell(text, label) {
  [
    "100%",
    "заавал",
    "жинхэнэ шалтгаанаа нээ",
    "оношоо харах",
    "6,900₮",
    "12,900₮",
    "pay to see safety"
  ].forEach(phrase => {
    assert(!text.includes(phrase), `${label}: forbidden commercial phrase ${phrase}`);
  });
  assert(!/төлөөд[^.]{0,80}онош/.test(text), `${label}: diagnosis payment promise`);
}

function run() {
  const choice = normalize(_internal.renderChoice());
  assert(choice.includes("Үндсэн үнэ 9,900₮"));
  assert(!choice.includes("Нээлтийн урамшуулалт үнэ 9,900₮"));
  assert(choice.includes("9,900₮ төлөөд тайлангаа нээх"));
  assert(!choice.includes("6,900₮"));
  assert(!choice.includes("12,900₮"));
  assert(!choice.includes("[REMOVED_FEATURE_UPGRADE]"));

  setOneTime();
  const unpaidOneTime = normalize(_internal.renderReport());
  assert(unpaidOneTime.includes("Таны эхний зураглал бэлэн боллоо"));
  assert(unpaidOneTime.includes("9,900₮-ийн QPay төлбөрийн QR код үүсгэх"));
  assert(unpaidOneTime.includes("Хамгийн түрүүнд ажиглагдсан хэв маяг"));
  assert(!unpaidOneTime.includes("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ?"));
  assert(!unpaidOneTime.includes("<h3>14 хоногийн эхний туршилт</h3>"));
  assertNoCommercialSmell(unpaidOneTime, "one-time unpaid");

  _internal.demoCompletePayment("one-time");
  const paidOneTime = normalize(_internal.renderReport());
  assert(paidOneTime.includes("1. Гол зураглал"));
  assert(paidOneTime.includes("3. Таны хамгийн магадлалтай гол хэв маяг"));
  assert(paidOneTime.includes("7. 7–14 хоногийн нэг хувьсагчийн туршилт"));
  assert(!paidOneTime.includes("Нарийвчлах үнэ"));
  assert(!paidOneTime.includes("[REMOVED_FEATURE_UPGRADE] төлөөд [REMOVED_FEATURE_REFINEMENT]"));
  assert(!paidOneTime.includes("Та нэг удаагийн гүн анализ нээсэн тул [REMOVED_FEATURE_PRODUCT] анализ руу хөнгөлөлттэй шилжих боломжтой"));

  setMode3Unpaid();
  const professional = normalize(_internal.renderReport());
  assert(professional.includes("Энд эхлээд хоолны дүрэм биш, биеийн талаа шалгах нь зөв байна"));
  assert(professional.includes("онош гэсэн үг биш"));
  assert(!professional.includes("[REMOVED_FEATURE_PRICE]"));
  assert(!professional.includes("төлөөд"));
  assert(!professional.includes("<h3>14 хоногийн туршилт</h3>"));

  setMode4Unpaid();
  const urgent = normalize(_internal.renderReport());
  assert(urgent.includes("Одоо жин хасах тухай биш"));
  assert(!urgent.includes("9,900₮"));
  assert(!urgent.includes("[REMOVED_FEATURE_PRICE]"));
  assert(!urgent.includes("Нарийвчлах үнэ"));

  const commercialSurfaces = normalize([
    _internal.renderChoice(),
    unpaidOneTime,
    paidOneTime,
    professional,
    urgent
  ].join("\n"));
  assertNoCommercialSmell(commercialSurfaces, "commercial surfaces");

  const qaPath = path.join(root, "COMMERCIAL_FLOW_QA.md");
  assert(fs.existsSync(qaPath), "COMMERCIAL_FLOW_QA.md should exist");
  const qa = fs.readFileSync(qaPath, "utf8");
  assert(qa.includes("# Commercial Flow QA"));
  assert(qa.includes("Total scenarios: 10"));
  assert(qa.includes("Score / 10"));
  assert(qa.includes("Ready for real payment integration"));
  for (let index = 1; index <= 10; index += 1) {
    assert(qa.includes(`## Scenario ${index} `), `QA doc should include scenario ${index}`);
  }

  const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
  assert(readme.includes("COMMERCIAL_FLOW_QA.md"), "README should link to COMMERCIAL_FLOW_QA.md");
}

run();
console.log("commercial-flow-qa tests passed");
