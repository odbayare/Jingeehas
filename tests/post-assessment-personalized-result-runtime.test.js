"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const distAppPath = path.join(__dirname, "..", "dist", "app.js");
const generatedInitialResultPath = path.join(__dirname, "..", ".generated-copy-hotfix", "netlify", "functions", "_lib", "initial-result.js");
assert(fs.existsSync(distAppPath), "production app must be generated before paywall corrective runtime test");
assert(fs.existsSync(generatedInitialResultPath), "generated count-teaser backend is missing");

const app = require(distAppPath);
const appSource = fs.readFileSync(distAppPath, "utf8");
for (const expected of [
  "async function loadInitialResult()",
  "/.netlify/functions/weight-assessment-initial-result?assessmentId=",
  "function renderPersonalizedConversionProof(",
  "jingeehas-initial-result-v3-counts",
  "QPay-аар ${PRODUCT.displayPrice} төлөх",
  "Бусад банк, wallet харах"
]) assert(appSource.includes(expected), `retained conversion runtime behavior missing: ${expected}`);
assert(!appSource.includes("БҮРЭН ТАЙЛАНГАА НЭЭХ · ${PRODUCT.displayPrice}"), "Sep5 paywall price-in-CTA presentation must not survive corrective restore");

const {
  INITIAL_RESULT_SCHEMA_VERSION,
  LEGACY_INITIAL_RESULT_SCHEMA_VERSION,
  COUNT_ONLY_INITIAL_RESULT_SCHEMA_VERSION,
  COUNT_TEASER_SCHEMA_VERSION,
  buildInitialResult,
  publicInitialResult
} = require(generatedInitialResultPath);

const fullReport = {
  influencingPatterns: [
    { id: "p1", title: "SERVER ONLY PATTERN ONE", evidenceSummary: "SERVER ONLY CONDITION ONE", effectOnWeightLoss: "SERVER ONLY REASON ONE" },
    { id: "p2", title: "SERVER ONLY PATTERN TWO", evidenceSummary: "SERVER ONLY CONDITION TWO", effectOnWeightLoss: "SERVER ONLY REASON TWO" }
  ],
  managementModules: [
    { patternId: "p1", observe: "observe one", prepare: "prepare one", inMoment: "act one" },
    { patternId: "p2", observe: "observe two", prepare: "prepare two", inMoment: "act two" }
  ],
  interactionSummary: [
    { id: "pair_p1_p2", patternIds: ["p1", "p2"], explanation: "SERVER ONLY INTERACTION" }
  ],
  combinedManagementPlan: {
    patternIds: ["p1", "p2"],
    startWith: "start",
    why: "why",
    nextStep: "next",
    combinedAction: "combined"
  },
  recommendations: ["SERVER ONLY ACTION"]
};
const sealed = { schemaVersion: INITIAL_RESULT_SCHEMA_VERSION, mode: "sealed" };
const expectedCounts = { schemaVersion: COUNT_TEASER_SCHEMA_VERSION, mode: "counts", patternCount: 2, interactionCount: 1 };

assert.equal(INITIAL_RESULT_SCHEMA_VERSION, "jingeehas-post-assessment-paywall-v1");
assert.equal(COUNT_TEASER_SCHEMA_VERSION, "jingeehas-initial-result-v3-counts");
assert.deepEqual(buildInitialResult(fullReport), sealed, "stored snapshot must remain sealed");
assert.deepEqual(publicInitialResult(sealed, fullReport), expectedCounts, "backend may retain privacy-safe counts without rendering them on the corrective paywall");
assert.deepEqual(publicInitialResult({ schemaVersion: LEGACY_INITIAL_RESULT_SCHEMA_VERSION, title: "LEAK" }, fullReport), expectedCounts);
assert.deepEqual(publicInitialResult({ schemaVersion: COUNT_ONLY_INITIAL_RESULT_SCHEMA_VERSION, patternCount: 99 }, fullReport), expectedCounts);

const serialized = JSON.stringify([
  publicInitialResult(sealed, fullReport),
  publicInitialResult({ schemaVersion: COUNT_ONLY_INITIAL_RESULT_SCHEMA_VERSION, patternCount: 99 }, fullReport)
]);
for (const forbidden of ["SERVER ONLY", "primaryPattern", "recommendations", "evidenceSummary", "effectOnWeightLoss"])
  assert(!serialized.includes(forbidden), `count teaser leaked paid-report content: ${forbidden}`);

app._test.setComingSoon(false);
app._test.setState({
  assessmentStatus: "complete",
  commercialFlowVersion: "free_assessment_postpaid_v1",
  initialResult: expectedCounts,
  payment: { status: "idle" },
  busy: false
});
const paywall = app.renderForPath("/assessment/result");
for (const expected of [
  "ТЕСТ ДУУСЛАА",
  "Таны хариултад тулгуурласан хувийн тайлан бэлэн боллоо",
  "Бүрэн тайлангаас та:",
  "ТАНЫ ХУВИЙН БҮРЭН ТАЙЛАН",
  "19,900₮",
  ">БҮРЭН ТАЙЛАНГАА НЭЭХ<"
]) assert(paywall.includes(expected), `restored paywall presentation missing: ${expected}`);
for (const forbidden of [
  "ТАНЫ ХАРИУЛТААС",
  "2 хэв маяг",
  "1 уялдаа холбоо",
  "Энд зөвхөн тоог харуулж байна.",
  "Бүрэн тайланд юу багтах вэ?",
  "БҮРЭН ТАЙЛАНГАА НЭЭХ · 19,900₮",
  "SERVER ONLY PATTERN",
  "SERVER ONLY CONDITION",
  "SERVER ONLY REASON",
  "SERVER ONLY ACTION"
]) assert(!paywall.includes(forbidden), `corrective paywall retained Sep5 or paid-report detail: ${forbidden}`);

const banks = Array.from({ length: 8 }, (_, index) => ({
  kind: "bank_app",
  name: `Bank ${index + 1}`,
  description: `Банк ${index + 1}`,
  link: `bank${index + 1}://pay`
}));
app._test.setState({
  assessmentStatus: "complete",
  commercialFlowVersion: "free_assessment_postpaid_v1",
  assessmentId: "test-assessment",
  payment: {
    status: "pending",
    qrImage: "dynamic-qr-image",
    expiresAt: "2026-09-05T13:00:00.000+08:00",
    urls: [...banks, { kind: "qpay_short_url", name: "QPay", description: "QPay", link: "https://qpay.mn/s/test" }]
  }
});
const payment = app.renderForPath("/assessment/payment");
for (const expected of [
  "QPay-аар 19,900₮ төлөх",
  "QPay холбоосоор төлбөрийн сонголтоо шууд нээнэ.",
  "Банкны апп-аар шууд төлөх",
  "Бусад банк, wallet харах (2)",
  "QPay төлбөрөө хийсний дараа бүрэн тайлан автоматаар нээгдэнэ.",
  "Жингээ Хас",
  "Төлбөрийн тусламж"
]) assert(payment.includes(expected), `optimized payment copy missing: ${expected}`);
assert(payment.indexOf("QPay-аар 19,900₮ төлөх") < payment.indexOf("Банкны апп-аар шууд төлөх"), "QPay primary action must appear before bank grid");
assert(!payment.includes(">Нүүр<"), "postpaid checkout must not expose the general navigation home link");
assert(!payment.includes(">Тестийн тухай<"), "postpaid checkout must not expose the general navigation about link");
assert(!payment.includes(">Тайлан сэргээх<"), "postpaid checkout must not expose the general navigation recovery link");

app._test.setState({
  assessmentStatus: "complete",
  commercialFlowVersion: "free_assessment_postpaid_v1",
  payment: { status: "paid" },
  busy: false
});
const paidPage = app.renderForPath("/assessment/payment");
assert(paidPage.includes("Төлбөр баталгаажлаа. Бүрэн тайлан нээгдлээ."));
assert(!paidPage.includes("Төлбөр баталгаажлаа. Тест нээгдлээ."));

app._test.resetComingSoon();
console.log("restored pre-Sep5 paywall decision layer and optimized QPay runtime contract passed");
