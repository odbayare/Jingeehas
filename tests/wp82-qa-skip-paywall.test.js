const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");

const app = require("../app.js");
const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function loadQaCopy() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wp82-qa-app-"));
  const appPath = path.join(dir, "app.js");
  const backendPath = path.join(dir, "mockBackend.js");
  fs.copyFileSync(path.join(process.cwd(), "mockBackend.js"), backendPath);
  let qaSource = appSource
    .replace("const WEIGHT_TEST_COMING_SOON_MODE = true;", "const WEIGHT_TEST_COMING_SOON_MODE = false;")
    .replace("const WEIGHT_TEST_QA_PAYMENT_BYPASS = false;", "const WEIGHT_TEST_QA_PAYMENT_BYPASS = true;")
    .replace("const WEIGHT_TEST_QA_SKIP_PAYWALL = false;", "const WEIGHT_TEST_QA_SKIP_PAYWALL = true;");
  fs.writeFileSync(appPath, qaSource);
  return require(appPath);
}

function setMinimalStageState(internal, extras = {}) {
  internal.setTestState({
    packageType: "one-time",
    view: "stage1",
    internalTest: false,
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    qpayPayment: { status: "idle", message: "", invoice: null },
    preliminary: [],
    diaryEntries: [],
    stageVoiceSummaries: {},
    safetyFlags: [],
    stageAnswers: {
      "S1-C01": "35",
      "S1-C02": "Эрэгтэй",
      "S1-S04": "Үгүй",
      "S1-W04": ["Алхалт нэмэх"],
      "S1-F01": ["Ядарсан", "Тайвширмаар санагдсан"],
      "S1-N01": "4-6 цаг",
      "S1-N02": "Ихэвчлэн"
    },
    ...extras
  });
}

function assertGuards(source) {
  assert(source.includes("const WEIGHT_TEST_COMING_SOON_MODE = true;"), "source coming-soon guard must stay enabled");
  assert(source.includes('oneTime: "9,900₮"'), "one-time price must remain 9,900₮");
  assert(source.includes('sevenDay: "29,000₮"'), "seven-day price must remain 29,000₮");
  assert(source.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
  assert(source.includes("qpay-create-invoice") && source.includes("qpay-check-payment"), "QPay endpoint strings must remain unchanged");
}

assert(appSource.includes("const WEIGHT_TEST_QA_PAYMENT_BYPASS = false;"), "QA payment bypass must default to false in source");
assert(appSource.includes("const WEIGHT_TEST_QA_SKIP_PAYWALL = false;"), "QA skip-paywall flag must default to false in source");
assert.strictEqual(_internal.WEIGHT_TEST_QA_PAYMENT_BYPASS, false, "exported QA payment bypass must be false in source");
assert.strictEqual(_internal.WEIGHT_TEST_QA_SKIP_PAYWALL, false, "exported QA skip-paywall must be false in source");
assert.strictEqual(_internal.WEIGHT_TEST_COMING_SOON_MODE, true, "coming-soon source guard must remain true");
assertGuards(appSource);

["Үнэлгээний сонголт", "Нэг удаагийн гүн анализ", "7 хоногийн гүн анализ", "9,900₮", "29,000₮"].forEach(copy => {
  assert(appSource.includes(copy), `production payment/selection copy must remain in source: ${copy}`);
});

assert(appSource.includes("function shouldQaSkipOneTimePaywall"), "QA skip-paywall branch helper must exist");
assert(appSource.includes("if (shouldQaSkipOneTimePaywall(\"one-time\"))"), "choice screen must be skipped only in QA one-time mode");
assert(appSource.includes("!canStartPaidAssessment() && !shouldQaSkipOneTimePaywall()"), "completion gate must allow QA direct report mode");

_internal.setComingSoonModeForTest(false);
_internal.setTestState({
  packageType: "one-time",
  view: "choice",
  internalTest: false,
  oneTimePaid: false,
  sevenDayPaid: false,
  upgradePaid: false,
  qpayPayment: { status: "idle", message: "", invoice: null }
});
const productionChoice = normalize(_internal.renderChoice());
assert(productionChoice.includes("Үнэлгээний сонголт"), "production choice screen must still render");
assert(productionChoice.includes("Нэг удаагийн гүн анализ"), "production one-time card must still render");
assert(productionChoice.includes("7 хоногийн гүн анализ"), "production seven-day card must still render");
assert.strictEqual(_internal.hasOneTimeReportAccess(), false, "source must not grant unpaid one-time access");
assert.strictEqual(_internal.shouldQaSkipOneTimePaywall(), false, "source must not skip paywall by default");

const qaApp = loadQaCopy();
const qa = qaApp._internal;
assert.strictEqual(qa.WEIGHT_TEST_COMING_SOON_MODE, false, "QA copy must disable coming-soon only in temp copy");
assert.strictEqual(qa.WEIGHT_TEST_QA_PAYMENT_BYPASS, true, "QA copy must enable payment bypass");
assert.strictEqual(qa.WEIGHT_TEST_QA_SKIP_PAYWALL, true, "QA copy must enable skip-paywall");
assert.strictEqual(qa.hasOneTimeReportAccess(), true, "QA payment bypass must grant one-time report access");
assert.strictEqual(qa.hasSevenDayAccess(), false, "QA payment bypass must not unlock seven-day flow");
assert.strictEqual(qa.shouldQaSkipOneTimePaywall("one-time"), true, "QA one-time flow must skip paywall");
assert.strictEqual(qa.shouldQaSkipOneTimePaywall("seven-day"), false, "QA skip-paywall must not apply to seven-day flow");

qa.setComingSoonModeForTest(false);
qa.setTestState({
  packageType: "one-time",
  view: "choice",
  internalTest: false,
  oneTimePaid: false,
  sevenDayPaid: false,
  upgradePaid: false,
  qpayPayment: { status: "idle", message: "", invoice: null }
});
const qaChoice = normalize(qa.renderChoice());
assert(!qaChoice.includes("Үнэлгээний сонголт"), "QA skip mode must not show assessment selection screen");
assert(!qaChoice.includes("29,000₮ төлөөд 7 хоногийн үнэлгээ эхлүүлэх"), "QA skip mode must not show seven-day payment card CTA");
assert(qaChoice.includes("Тест эхлүүлэх"), "QA skip mode should show direct one-time start");

setMinimalStageState(qa);
qa.completeStageOne();
assert.strictEqual(qa.getTestState().view, "report", "QA completion must open report directly");
const qaReport = normalize(qa.renderReport());
assert(qaReport.includes("1. Гол зураглал"), "QA direct report must render case-formulation report");
assert(qaReport.includes("7. 7–14 хоногийн нэг хувьсагчийн туршилт"), "QA direct report must keep one-variable experiment section");
assert(!qaReport.includes("Таны эхний зураглал бэлэн боллоо"), "QA direct report must not show paywall");
assert(!qaReport.includes("QPay"), "QA direct report must not ask for QPay");
assert(!/\bархи\b/i.test(qaReport), "QA report must not introduce user-facing архи");
assert(!qaReport.includes("согтууруулах ундаа орж ирэх"), "QA report must not introduce awkward alcohol wording");
assert(!qaReport.includes("Day 1–3"), "QA report must not introduce English day labels");

console.log("wp82 qa skip paywall tests passed");
