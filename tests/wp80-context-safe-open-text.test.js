const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const { stageOneQuestions, _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");

const oldQuestion = "Өмнө хэрэглэсэн нэг арга яагаад удаан үргэлжлээгүй вэ?";
const oldFragment = "Өмнө хэрэглэсэн нэг арга";
const newQuestion = "Жингээ бууруулах эсвэл жингээ барихын тулд өмнө туршсан нэг арга тань яагаад удаан үргэлжлээгүй вэ?";
const helper = "Энэ асуулт нь зөвхөн жингээ бууруулах, жингээ барих зорилгоор туршиж байсан хоол, хөдөлгөөн, дасгал, хэвшлийн тухай юм. Санахгүй эсвэл бичмээргүй байвал хоосон орхиж болно.";
const stageTitle = "Үе 1 · Өмнөх оролдлогоо тодруулах";
const placeholder = "Жишээ: фитнес эхлүүлсэн ч цаг тохироогүй, мацаг барихад орой хэт өлсдөг болсон, алхалтаа тогтмол үргэлжлүүлж чадаагүй гэх мэт.";

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function question(id) {
  const found = stageOneQuestions.find(item => item.id === id);
  assert(found, `missing question ${id}`);
  return found;
}

function stageQuestionIds(stageAnswers = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "stage1",
    internalTest: true,
    stageAnswers,
    stageVoiceSummaries: {},
    stageSummaryUi: {},
    safetyFlags: []
  });
  return _internal.stageQuestions().map(item => item.id);
}

function renderQuestion(questionId, stageAnswers = {}) {
  _internal.setTestState({
    packageType: "one-time",
    view: "stage1",
    internalTest: true,
    stageAnswers,
    stageVoiceSummaries: {},
    stageSummaryUi: {},
    safetyFlags: []
  });
  const index = _internal.stageQuestions().findIndex(item => item.id === questionId);
  assert(index >= 0, `question ${questionId} should be visible`);
  _internal.setTestState({
    packageType: "one-time",
    view: "stage1",
    internalTest: true,
    stageIndex: index,
    stageAnswers,
    stageVoiceSummaries: {},
    stageSummaryUi: {},
    safetyFlags: []
  });
  return _internal.renderStageOne();
}

function run() {
  assert(!appSource.includes(oldQuestion), "old ambiguous full question must be absent");
  assert(!appSource.includes(oldFragment), "old ambiguous fragment must be absent");

  const openText = question("S1-V03");
  assert.strictEqual(openText.text, newQuestion);
  assert.strictEqual(openText.helper, helper);
  assert.strictEqual(openText.stageTitle, "Өмнөх оролдлогоо тодруулах");
  assert.strictEqual(openText.placeholder, placeholder);

  const safeHtml = renderQuestion("S1-V03", {
    "S1-W04": ["Алхалт нэмэх"],
    "S1-S04": "Үгүй"
  });
  assert(safeHtml.includes(newQuestion), "runtime should show context-safe question");
  assert(safeHtml.includes(helper), "runtime should show context-safe helper");
  assert(safeHtml.includes(stageTitle), "runtime should show context-safe stage title");
  assert(safeHtml.includes(placeholder), "runtime should include context-safe placeholder");

  const highRiskIds = stageQuestionIds({
    "S1-W04": ["Алхалт нэмэх"],
    "S1-S04": "Одоо идэвхтэй бодогдож байна"
  });
  assert(!highRiskIds.includes("S1-V03"), "high-risk self-harm answer must not lead to S1-V03");

  _internal.setTestState({
    packageType: "one-time",
    view: "stage1",
    internalTest: true,
    oneTimePaid: true,
    stageAnswers: {
      "S1-C01": "35",
      "S1-C02": "Эрэгтэй",
      "S1-W04": ["Алхалт нэмэх"],
      "S1-S04": "Одоо идэвхтэй бодогдож байна"
    },
    stageIndex: stageQuestionIds({ "S1-W04": ["Алхалт нэмэх"] }).indexOf("S1-S04")
  });
  _internal.nextStageQuestion();
  const stateAfterSafety = _internal.getTestState();
  assert.strictEqual(stateAfterSafety.view, "report", "high-risk self-harm answer should move to existing safety-first report route");
  const safetyReport = normalize(_internal.renderReport());
  assert(safetyReport.includes("Одоо жин хасах тухай биш"), "urgent safety report route must remain intact");
  assert(!safetyReport.includes(newQuestion), "safety report must not ask the weight-loss open-text question");

  const noPriorIds = stageQuestionIds({
    "S1-W04": ["Оролдож байгаагүй"],
    "S1-S04": "Үгүй"
  });
  assert(!noPriorIds.includes("S1-V03"), "S1-V03 should be skipped when user has not tried prior weight-loss attempts");

  assert.strictEqual(_internal.WEIGHT_TEST_COMING_SOON_MODE, true, "repo source coming-soon guard must remain true");
  assert(appSource.includes('oneTime: "9,900₮"'), "price copy must remain 9,900₮");
  assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
  assert(appSource.includes("qpay-create-invoice") && appSource.includes("qpay-check-payment"), "QPay endpoints must remain unchanged");
}

run();
console.log("wp80 context-safe open text tests passed");
