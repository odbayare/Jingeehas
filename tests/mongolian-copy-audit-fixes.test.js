const assert = require("assert");
const fs = require("fs");
const path = require("path");
const app = require("../app.js");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const normalize = html => String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

assert(!fs.existsSync(path.join(root, "mongolian-copy-normalizer.js")));
assert(!fs.existsSync(path.join(root, "mongolian-copy-domain-normalizer.js")));
const index = read("index.html");
assert(!index.includes("mongolian-copy-normalizer"));
assert(!index.includes("mongolian-copy-domain-normalizer"));

const productionSources = [read("app.js"), index, read("mockBackend.js")].join("\n");
assert(!productionSources.includes("MutationObserver"), "no post-render language observer may be installed");
assert(!productionSources.includes("TOKEN_REPLACEMENTS"), "no generic token replacement map may remain");
assert(!productionSources.includes("EXACT_REPLACEMENTS"), "no provisional exact replacement map may remain");

const userText = "User input: Coach analysis pattern diary tracking cycle reward default cue evidence willpower";
app._internal.setTestState({ stageAnswers: {} });
app._internal.setAnswerDraft("USER-TEXT-PROBE", userText);
assert.strictEqual(app._internal.getTestState().stageAnswers["USER-TEXT-PROBE"], userText);

const { _internal } = app;
[
  ["landing", () => _internal.renderLanding()],
  ["about", () => _internal.renderAbout()],
  ["choice", () => _internal.renderChoice()],
  ["one-time start", () => _internal.renderOneTimeStart()]
].forEach(([surface, render]) => assert(normalize(render()).length > 20, `${surface} must render without normalizers`));

_internal.setTestState({
  packageType: "one-time", view: "report", oneTimePaid: false, sevenDayPaid: false,
  upgradePaid: false, stageAnswers: { "S1-S04": "Одоо идэвхтэй бодогдож байна" },
  preliminary: [], diaryEntries: [], stageVoiceSummaries: {}
});
assert.strictEqual(_internal.reportMode().mode, "urgent");
const urgent = normalize(_internal.renderReport());
assert(urgent.length > 20, "urgent content must remain visible without payment");
assert(!urgent.includes("14 хоногийн туршилт"), "urgent mode must suppress ordinary experiments");
assert(!urgent.includes("QPay"), "urgent mode must suppress payment controls");
assert(!urgent.includes("29,000₮"), "urgent mode must suppress upsell controls");

const manifest = JSON.parse(read("MONGOLIAN_COPY_APPROVED_REPLACEMENTS.json"));
assert.strictEqual(manifest.approval_status, "EMPTY_NOT_APPROVED");
assert.deepStrictEqual(manifest.replacements, []);
const requiredFiles = [
  "MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md", "MONGOLIAN_COPY_REVIEW_CATALOG.md",
  "MONGOLIAN_COPY_DUPLICATE_INDEX.md", "MONGOLIAN_COPY_EXCLUDED_INTERNAL_STRINGS.md",
  "MONGOLIAN_COPY_SURFACE_COVERAGE.md", "artifacts/mongolian-rendered-copy.json"
];
requiredFiles.forEach(file => assert(fs.existsSync(path.join(root, file)), `${file} must exist`));

const catalog = read("MONGOLIAN_COPY_REVIEW_CATALOG.md");
assert(!/https?:\/\/[^|\n]*\.netlify\/functions/.test(catalog), "review catalog must exclude API endpoints");
assert(!catalog.includes("./mockBackend.js"), "review catalog must exclude module import paths");
["weight_test_funnel", "weight_test_state", "WEIGHT_TEST_ONE_TIME"].forEach(value =>
  assert(!catalog.includes(value), `review catalog must exclude technical identifier: ${value}`)
);

const artifact = JSON.parse(read("artifacts/mongolian-rendered-copy.json"));
assert.strictEqual(artifact.generator_version, "2.0.0");
assert.strictEqual(artifact.network_attempts, 0, "extraction must make no external request");
const validRoles = new Set(["PUBLIC_USER", "PAID_USER", "SEVEN_DAY_USER", "ADVISOR", "ADMIN", "INTERNAL_TESTER"]);
const validTypes = new Set(["FULL_SURFACE", "ISOLATED_COMPONENT", "ATTRIBUTE_ONLY"]);
artifact.entries.forEach(entry => {
  assert(entry.surface, "every rendered entry must have a surface");
  assert(validRoles.has(entry.role), `invalid role: ${entry.role}`);
  assert(entry.render_source, "every rendered entry must have render proof");
  assert(validTypes.has(entry.extraction_type), `invalid extraction type: ${entry.extraction_type}`);
});
const keys = artifact.entries.map(entry => `${entry.text}\u0000${entry.surface}\u0000${entry.role}\u0000${entry.attribute_name || ""}`);
assert.strictEqual(new Set(keys).size, keys.length, "same text/surface/role rows must be deduplicated");
const scenarioIds = new Set(artifact.scenarios.map(s => s.id));
[
  "coming-soon", "landing", "about", "choice", "one-time-start", "one-time-unpaid", "one-time-paid",
  "seven-day-paywall", "seven-day-start", "diary-home-zero", "diary-home-partial", "diary-home-complete", "diary-single", "diary-multi",
  "diary-scale", "diary-text", "diary-confirmation-empty", "diary-confirmation-awaiting", "diary-confirmation-confirmed",
  "diary-confirmation-edit", "diary-confirmation-add", "insufficient-report", "limited-report",
  "usable-limited-report", "full-seven-day-report", "upgrade-offer-present", "upgrade-offer-absent", "upgrade-paywall", "lead-capture",
  "lead-thank-you", "general-safety", "professional-safety", "urgent-mode-4", "advisor-login",
  "advisor-dashboard-empty", "advisor-dashboard-populated", "admin-portal", "internal-feedback-survey",
  "internal-feedback-thanks", "internal-feedback-export", "payment-contact", "qpay-pre-invoice", "qpay-invoice-created",
  "qpay-pending", "qpay-paid", "qpay-error", "sample-report", "question-bank", "answer-options", "accessibility"
].forEach(id => assert(scenarioIds.has(id), `required scenario missing: ${id}`));

const byId = id => artifact.scenarios.find(s => s.id === id);
artifact.scenarios.forEach(s => {
  assert(validTypes.has(s.extraction_type), `${s.id} must declare extraction type`);
  assert.strictEqual(s.coverage, "YES", `${s.id} must not remain partial`);
  if (s.expected_visible) assert(s.extracted_entry_count > 0, `${s.id} expected visible copy must be non-empty`);
  assert.strictEqual(s.network_attempts, 0, `${s.id} must not make network requests`);
});

["diary-home-zero", "diary-home-partial", "diary-home-complete"].forEach(id => {
  assert.strictEqual(byId(id).render_source, "renderDiaryHome");
  assert.notStrictEqual(byId(id).render_source, "renderDiary");
});
const scenarioText = id => artifact.entries.filter(e => e.scenarios.includes(id)).map(e => e.text).join("\n");
assert.notStrictEqual(scenarioText("diary-home-zero"), scenarioText("diary-home-partial"), "diary home states must differ");
assert(read("tools/extract-rendered-copy.mjs").includes("diaryQuestionIndex"), "actual diaryQuestionIndex field must be used");
assert(!read("tools/extract-rendered-copy.mjs").includes("diaryIndex:"), "obsolete diaryIndex fixture must not return");

const sampleEntries = artifact.entries.filter(e => e.surface === "SAMPLE_REPORT");
assert(sampleEntries.length > 0);
assert(sampleEntries.every(e => e.render_source === "renderSampleResultPreview"));
assert(!sampleEntries.some(e => e.scenario === "choice"), "choice screen must not contaminate sample report");
const upgradeEntries = artifact.entries.filter(e => e.surface === "UPGRADE_OFFER");
assert(upgradeEntries.length > 0);
assert(upgradeEntries.every(e => e.render_source === "renderUpgradeOffer"));
assert(!upgradeEntries.some(e => /1\. Гол зураглал|14 хоногийн эхний туршилт/.test(e.text)), "report body must not contaminate upgrade offer");

const qpayScenarios = ["qpay-pre-invoice", "qpay-invoice-created", "qpay-pending", "qpay-paid", "qpay-error"];
qpayScenarios.forEach(id => assert.strictEqual(byId(id).extraction_type, "ISOLATED_COMPONENT"));
const qpayTexts = scenarioText;
assert.notStrictEqual(qpayTexts("qpay-pre-invoice"), qpayTexts("qpay-invoice-created"));
assert.notStrictEqual(qpayTexts("qpay-invoice-created"), qpayTexts("qpay-pending"));
assert.notStrictEqual(qpayTexts("qpay-pending"), qpayTexts("qpay-paid"));
assert(qpayTexts("qpay-error").trim(), "payment error fixture must be non-empty");
assert.strictEqual(byId("qpay-error").render_source, "renderWeightQpayPaymentBox with qpayStatusMessage(error)");
assert(!artifact.entries.filter(e => e.surface === "QPAY").some(e => /Гол зураглал|14 хоногийн/.test(e.text)), "report content must not contaminate QPay");

assert(byId("advisor-dashboard-populated").extracted_entry_count > 0, "populated advisor fixture must render");
assert(byId("internal-feedback-survey").extracted_entry_count > 0, "internal tester harness must render survey");
const accessibility = artifact.entries.filter(e => e.surface === "ACCESSIBILITY");
assert(accessibility.length > 0, "accessibility attributes must be extracted");
assert(accessibility.every(e => e.extraction_type === "ATTRIBUTE_ONLY" && e.attribute_name && e.element_type));
assert(!accessibility.some(e => /Илүүдэл жин үүсгэж буй|Үндсэн үнэ|Тест эхлүүлэх/.test(e.text)), "ordinary body copy must not enter accessibility extraction");

const urgentEntries = artifact.entries.filter(e => e.surface === "URGENT_SAFETY");
assert(urgentEntries.length > 0, "urgent visible content must be extracted");
assert(!urgentEntries.some(e => /QPay|29,000₮|төлбөр/.test(e.text)), "urgent extraction must contain no payment surface content");
assert(artifact.entries.some(e => e.surface === "QUESTION_BANK"), "question bank must be covered");
assert(artifact.entries.some(e => e.surface === "ANSWER_OPTIONS"), "answer options must be covered");
assert(artifact.scenarios.some(s => s.role === "ADVISOR"), "advisor coverage must be explicit");
assert(artifact.scenarios.some(s => s.role === "ADMIN"), "admin coverage must be explicit");

console.log("mongolian-copy-audit-fixes engineering tests passed");
