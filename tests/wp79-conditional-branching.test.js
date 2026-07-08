const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");

const alcoholFoodFollowUp = "Согтууруулах ундаа хэрэглэсэн үед таны хоолны сонголт ихэвчлэн яаж өөрчлөгддөг вэ?";
const alcoholNextDayFollowUp = "Согтууруулах ундаа хэрэглэсний маргааш танд аль нь илүү ойр тохиолддог вэ?";
const tobaccoFollowUp = "Тамхи таны хоолны дуршил, зууш идэх хүсэл, кофе эсвэл стрессийн хэмнэлтэй холбоотой санагддаг уу?";

function questionIdsFor(stageAnswers) {
  _internal.setTestState({
    packageType: "one-time",
    view: "stage1",
    internalTest: true,
    stageAnswers
  });
  return _internal.stageQuestions().map(question => question.id);
}

function questionsTextFor(stageAnswers) {
  _internal.setTestState({
    packageType: "one-time",
    view: "stage1",
    internalTest: true,
    stageAnswers
  });
  return _internal.stageQuestions().map(question => question.text).join("\n");
}

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function renderPaidReport(stageAnswers) {
  _internal.setTestState({
    packageType: "one-time",
    view: "report",
    internalTest: true,
    oneTimePaid: true,
    sevenDayPaid: false,
    upgradePaid: false,
    preliminary: [],
    diaryEntries: [],
    stageVoiceSummaries: {},
    safetyFlags: [],
    stageAnswers: {
      "S1-C01": "35",
      "S1-C02": "Эрэгтэй",
      "S1-S04": "Үгүй",
      ...stageAnswers
    }
  });
  return normalize(_internal.renderReport());
}

function assertIncludesAll(haystack, expected) {
  expected.forEach(item => assert(haystack.includes(item), `expected to include: ${item}`));
}

function assertExcludesAll(haystack, forbidden) {
  forbidden.forEach(item => assert(!haystack.includes(item), `expected to exclude: ${item}`));
}

function run() {
  assertExcludesAll(questionsTextFor({ "S1-A01": "Огт хэрэглэдэггүй" }), [
    alcoholFoodFollowUp,
    alcoholNextDayFollowUp
  ]);
  assertExcludesAll(questionsTextFor({ "S1-A01": "Хариулахгүй" }), [
    alcoholFoodFollowUp,
    alcoholNextDayFollowUp
  ]);

  assertIncludesAll(questionIdsFor({ "S1-A01": "Ховор хэрэглэдэг" }), ["S1-A02", "S1-A03"]);
  assertIncludesAll(questionIdsFor({ "S1-A01": "7 хоногт 1–2 удаа хэрэглэдэг" }), ["S1-A02", "S1-A03"]);

  assertExcludesAll(questionsTextFor({ "S1-T01": "Үгүй" }), [tobaccoFollowUp]);
  assertExcludesAll(questionsTextFor({ "S1-T01": "Хариулахгүй" }), [tobaccoFollowUp]);
  assertIncludesAll(questionIdsFor({ "S1-T01": "Өмнө татдаг байсан, одоо больсон" }), ["S1-T02"]);
  assertIncludesAll(questionIdsFor({ "S1-T01": "Өдөр бүр татдаг" }), ["S1-T02"]);

  const staleAlcoholAnswers = {
    "S1-W06": "Маргааш илүү чанга барина гэж боддог",
    "S1-A01": "Огт хэрэглэдэггүй",
    "S1-A02": ["Маргааш нь биеийн тавгүйрхлээ намдаах гэж их иддэг"],
    "S1-A03": ["Давслаг, шөлтэй, тослог хоол хүсдэг"],
    "S1-F01": ["Согтууруулах ундаа хэрэглэсний дараа эсвэл маргааш нь идмээр болсон"]
  };
  const sanitizedAlcohol = _internal.effectiveStageAnswers(staleAlcoholAnswers);
  assert.strictEqual(sanitizedAlcohol["S1-A02"], undefined, "stale alcohol food follow-up must be ignored");
  assert.strictEqual(sanitizedAlcohol["S1-A03"], undefined, "stale alcohol next-day follow-up must be ignored");
  assert.strictEqual(sanitizedAlcohol["S1-F01"], undefined, "stale hidden-function alcohol option must be ignored");
  const alcoholReport = renderPaidReport(staleAlcoholAnswers);
  assertExcludesAll(alcoholReport, [
    "Согтууруулах ундаа хэрэглэсэн орой",
    "согтууруулах ундаа хэрэглэсэн орой",
    "Согтууруулах ундаа хэрэглэсний маргааш",
    "согтууруулах ундаа хэрэглэсний маргааш",
    "биеийн тавгүйрхлээ намдаах",
    "Согтууруулах ундаа өөрөө илчлэгтэй."
  ]);

  _internal.setTestState({
    packageType: "one-time",
    view: "stage1",
    internalTest: true,
    stageAnswers: {
      "S1-T01": "Үгүй",
      "S1-T02": ["Стресстэй үед тамхи, кофе, зууш хамт давхцдаг"]
    }
  });
  const tobaccoScores = _internal.calculateScores(false);
  assert.strictEqual(tobaccoScores.regulation, undefined, "stale tobacco context must not score regulation");
  assert.strictEqual(_internal.effectiveStageAnswers(_internal.getTestState().stageAnswers)["S1-T02"], undefined, "stale tobacco follow-up must be ignored");
  const tobaccoReport = renderPaidReport({
    "S1-E01": "Нэлээд давтагддаг",
    "S1-T01": "Үгүй",
    "S1-T02": ["Стресстэй үед тамхи, кофе, зууш хамт давхцдаг"]
  });
  assertExcludesAll(tobaccoReport, [
    "Тамхи, кофе, стресс, зуушны хам давтамж",
    "тамхийг жин барих арга",
    "тамхинаас гарах үеийн хоолны дуршил"
  ]);

  assert.strictEqual(_internal.WEIGHT_TEST_COMING_SOON_MODE, true, "repo source coming-soon guard must remain true");
  assert(appSource.includes('oneTime: "9,900₮"'), "price copy must remain 9,900₮");
  assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
  assert(appSource.includes("qpay-create-invoice") && appSource.includes("qpay-check-payment"), "QPay endpoints must remain unchanged");
}

run();
console.log("wp79 conditional branching tests passed");
