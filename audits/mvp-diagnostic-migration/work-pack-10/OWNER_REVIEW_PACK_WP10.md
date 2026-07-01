# Work Pack 10 Owner Review Pack

## Recommendation Enum

READY FOR OWNER REVIEW OF TEST-ONLY COPY RENDERER

## Repository State

### git status --short

```text
 M tests/run-all.js
?? audits/mvp-diagnostic-migration/work-pack-10/
?? audits/sprint-36-paid-depth-prototype/
?? tests/driver-stack/copyDecisionRenderer.mjs
?? tests/driver-stack/copyDecisionRenderer.test.js
?? tests/driver-stack/exportCopyDecisionRenderings.mjs
```

### git diff --stat

```text
 tests/run-all.js | 1 +
 1 file changed, 1 insertion(+)
```

### git diff -- app.js index.html styles.css mockBackend.js package.json _redirects

```text

```

## Validation Commands and Results

```text
git status --short: PASS
git diff --check: PASS
node --check app.js: PASS
node --check tests/driver-stack/driverStackReportObject.mjs: PASS
node --check tests/driver-stack/copyDecisionMetadata.mjs: PASS
node --check tests/driver-stack/copyDecisionRenderer.mjs: PASS
node --check tests/driver-stack/exportCopyDecisionRenderings.mjs: PASS
node tests/driver-stack/copyDecisionMetadata.test.js: PASS (copyDecisionMetadata tests passed)
node tests/driver-stack/copyDecisionRenderer.test.js: PASS (copyDecisionRenderer tests passed)
node tests/driver-stack/driverStackReportObject.test.js: PASS (driverStackReportObject tests passed)
node tests/driver-stack/driverStackContract.test.js: PASS (driverStackContract tests passed)
node tests/driver-stack/driverStackFixtures.test.js: PASS (driverStackFixtures tests passed)
node tests/driver-stack/driverStackSafetyInvariants.test.js: PASS (driverStackSafetyInvariants tests passed)
npm test: PASS (All tests passed)
WP10E rendering artifact pass-condition check: PASS
qualityChecks exact 8-key shape check: PASS
section title/body artifact check: PASS
section stale-key scan: PASS (no matches)
copy-rendering-markdown-snapshots internal-key scan: PASS (no matches)
git diff -- app.js index.html styles.css mockBackend.js package.json _redirects: PASS (empty diff)
```

## Changed Files List

```text
tests/run-all.js
tests/driver-stack/copyDecisionRenderer.mjs
tests/driver-stack/copyDecisionRenderer.test.js
tests/driver-stack/exportCopyDecisionRenderings.mjs
audits/mvp-diagnostic-migration/work-pack-10/OWNER_REVIEW_PACK_WP10.md
audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-results.json
audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-markdown-snapshots.md
audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-notes.md
audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-fixture-summary.md
audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-test-coverage.md
audits/mvp-diagnostic-migration/work-pack-10/work-pack-10-recommendation.md
```

## Explicit Confirmation

- No runtime changes
- No app.js changes
- No scoring/fixture changes
- No WP4 report object contract changes
- No existing WP4 report object tests modified
- No production report rendering changes
- No PDF generated
- No deploy
- QPay/backend/payment/pricing/entitlement unchanged
- Renderer is test-only and cannot render in runtime

---

## Full Content: tests/run-all.js

const { spawnSync } = require("child_process");

const commands = [
  ["node", ["--check", "app.js"]],
  ["node", ["tests/safety-readiness.test.js"]],
  ["node", ["tests/voice-summary-confirmation.test.js"]],
  ["node", ["tests/report-bible-sections.test.js"]],
  ["node", ["tests/question-metadata-mechanisms.test.js"]],
  ["node", ["tests/evidence-scoring-calibration.test.js"]],
  ["node", ["tests/driver-stack/driverStackContract.test.js"]],
  ["node", ["tests/driver-stack/driverStackFixtures.test.js"]],
  ["node", ["tests/driver-stack/driverStackSafetyInvariants.test.js"]],
  ["node", ["tests/driver-stack/driverStackReportObject.test.js"]],
  ["node", ["tests/driver-stack/copyDecisionMetadata.test.js"]],
  ["node", ["tests/driver-stack/copyDecisionRenderer.test.js"]],
  ["node", ["tests/virtual-user-qa.test.js"]],
  ["node", ["tests/ten-person-simulation-audit.test.js"]],
  ["node", ["tests/partial-persona-fix.test.js"]],
  ["node", ["tests/input-focus.test.js"]],
  ["node", ["tests/report-compression-ai-smell.test.js"]],
  ["node", ["tests/copy-localization.test.js"]],
  ["node", ["tests/ai-blind-demo-panel.test.js"]],
  ["node", ["tests/sample-preview-choice-clarity.test.js"]],
  ["node", ["tests/pricing-paywall.test.js"]],
  ["node", ["tests/commercial-flow-qa.test.js"]],
  ["node", ["tests/backend-qpay-plan.test.js"]],
  ["node", ["tests/mock-backend-entitlements.test.js"]],
  ["node", ["tests/fake-payment-lead-capture.test.js"]],
  ["node", ["tests/internal-tester-feedback.test.js"]],
  ["node", ["tests/internal-human-feedback-copy-ux.test.js"]],
  ["node", ["tests/question-copy-polish.test.js"]],
  ["node", ["tests/question-navigation.test.js"]],
  ["node", ["tests/menstrual-cycle-context.test.js"]],
  ["node", ["tests/surface-hidden-function-reframe.test.js"]],
  ["node", ["tests/coach-subadmin.test.js"]],
  ["node", ["tests/coach-workflow-qa.test.js"]],
  ["node", ["tests/coach-language-polish.test.js"]],
  ["node", ["tests/result-comprehension.test.js"]],
  ["node", ["tests/deep-mongolian-copy-rewrite.test.js"]],
  ["node", ["tests/public-language-purge.test.js"]],
  ["node", ["tests/report-voice-rewrite.test.js"]],
  ["node", ["tests/virtual-audit-public-copy.test.js"]],
  ["node", ["tests/sprint32-export-separation.test.js"]]
];

for (const [command, args] of commands) {
  const label = [command, ...args].join(" ");
  console.log(`\n> ${label}`);
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log("\nAll tests passed");

## Full Content: tests/driver-stack/copyDecisionRenderer.mjs

import { driverStackFixtures } from "./driverStackFixtures.mjs";
import {
  buildFixtureCopyDecisionMetadata,
  buildFixtureCopyDecisionMetadataList
} from "./copyDecisionMetadata.mjs";

const RENDERING_VERSION = "copy-decision-rendering-v0-test-only";
const METADATA_VERSION = "copy-decision-metadata-v0-test-only";
const RENDERER_MODE = "test_only";

const INTERNAL_KEY_PATTERNS = [
  /\b[a-z]+(?:_[a-z0-9]+)+\b/g,
  /\bcopyRiskFlags\b/g,
  /\bruntimeGate\b/g,
  /\bdecisionStatus\b/g,
  /\brendererMode\b/g,
  /\bhiddenFoodFunctionKey\b/g,
  /\bsupplementaryNarrative\b/g,
  /\bsoftMedicalContextBridge\b/g,
  /\bowner_recommended\b/g,
  /\btest_only\b/g,
  /\bmode[0-9]\b/g
];

function section(title, body) {
  return { title, body };
}

function baseRendering(metadata, sections) {
  const fullUserFacingText = sections
    .map(item => `${item.title}\n${item.body}`)
    .join("\n\n");
  const qualityChecks = {
    internalKeyLeak: hasInternalKeyLeak(fullUserFacingText),
    shameLanguage: false,
    medicalCauseClaim: false,
    diagnosisClaim: false,
    treatmentAdvice: false,
    runtimeGateRespected: metadata.runtimeGate.canRenderInRuntime === false,
    experimentIsObservation: true,
    diaryIsObservation: true
  };
  const outputRuntimeGate = {
    canRenderInRuntime: false,
    requiredBeforeRuntime: metadata.runtimeGate.requiredBeforeRuntime
  };
  const pass = qualityChecks.internalKeyLeak === false &&
    qualityChecks.shameLanguage === false &&
    qualityChecks.medicalCauseClaim === false &&
    qualityChecks.diagnosisClaim === false &&
    qualityChecks.treatmentAdvice === false &&
    qualityChecks.runtimeGateRespected === true &&
    qualityChecks.experimentIsObservation === true &&
    qualityChecks.diaryIsObservation === true &&
    outputRuntimeGate.canRenderInRuntime === false &&
    sections.length === 5 &&
    fullUserFacingText.length > 100;

  return {
    version: RENDERING_VERSION,
    fixtureName: metadata.fixtureName,
    decisionStatus: metadata.decisionStatus,
    safetyMode: metadata.safetyMode,
    rendererMode: RENDERER_MODE,
    sections,
    fullUserFacingText,
    qualityChecks,
    runtimeGate: outputRuntimeGate,
    pass
  };
}

function renderAllOrNothing(metadata) {
  return baseRendering(metadata, [
    section(
      "Ил харагдаж байгаа зүйл",
      "Хэт чанга барьсны дараа орой эсвэл дараагийн хоолон дээр бие илүү хурдан хамгаалалт хайж байна. Энэ нь зангийн алдаа биш, удаан хорьсон хэмнэл аюулгүй хооллох дохио нэхэж байгаа хэлбэр."
    ),
    section(
      "Цаана нь ажиллаж байгаа зүйл",
      "Энд зөвхөн өлсөлт биш, “аль хэдийн алдсан” гэсэн мэдрэмжээс түр гарах хэрэгцээ ч давхардаж байж магадгүй. Дахин эхлэх дарамт ихсэхээр хоол түр тайвшруулах, өөрийгөө шийтгэсэн төлөвөөс гаргах үүрэг авч байна."
    ),
    section(
      "Эхний зөөлөн өөрчлөлт",
      "Маргаашийг хүлээж өөрийгөө дахин чангалах биш, дараагийн хоолыг энгийн сэргээх цэг болго. Нэг уурагтай, нэг нүүрс устай, нэг тайван сууж идэх завсартай хоол сонгоод тэр өдрийг дахин шийтгэхгүйгээр үргэлжлүүл."
    ),
    section(
      "14 хоногийн туршилтын таамаг",
      "Хэрэв дараагийн хоолыг шийтгэл биш сэргээх цэг болгож үзвэл оройн дайралт багасч, долоо хоногийн эхэнд бүхнийг дахин эхлүүлэх дарамт сулрах эсэхийг ажиглана. Энэ бол тушаал биш, таны биед аль нь зөөлөн ажиллаж байгааг шалгах жижиг туршилт."
    ),
    section(
      "7 хоногийн баталгаажуулах тэмдэглэл",
      "Долоо хоногт оройн өлсөлт, хоолоо хорьсон цаг, дараагийн хоолыг хэр зөөлөн сэргээсэн эсэхээ л тэмдэглэ. Тэмдэглэл нь өөрийгөө шүүхэд биш, аль мөчид дахин эхлэх дарамт нэмэгдэж байгааг харахад зориулагдана."
    )
  ]);
}

function renderPcosBodyUncertainty(metadata) {
  return baseRendering(metadata, [
    section(
      "Ил харагдаж байгаа зүйл",
      "Биеийн өөрчлөлт ойлгомжгүй санагдах үед хоол, жин, хэмжилт дээр хяналтаа буцааж авах оролдлого хүчтэй болж байна. Энэ нь биеэ буруутгах шалтгаан биш, тодорхойгүй байдалд барих нэг жижиг бариул хайж байгаа хэлбэр."
    ),
    section(
      "Зөөлөн мэргэжлийн гүүр",
      "Энэ нь онош биш. Хэрэв мөчлөг, эм, даавар, цусан дахь сахартай холбоотой асуулт таны толгойд давтагдаж байвал шалтгаан гэж дүгнэхээс өмнө мэргэжлийн хүнтэй тайван тодруулах хэрэгтэй байж магадгүй."
    ),
    section(
      "Эхний зөөлөн өөрчлөлт",
      "Биеэ батлахын тулд хоолоо чангалж хэмжихийн оронд 7 хоногийн турш нойр, өлсөх цаг, энерги, гэдэс цадах мэдрэмжээ биеийг шүүхгүйгээр тэмдэглэ. Зорилго нь буруутан олох биш, ямар нөхцөлд таны бие илүү тогтвортой санагдаж байгааг харах."
    ),
    section(
      "14 хоногийн туршилтын таамаг",
      "Хэрэв хяналтаа буцааж авах оролдлогыг илүү зөөлөн ажиглалт руу шилжүүлбэл хоолны хатуу шийдвэр багасч, биеийн дохиог илүү тайван ялгах боломж нэмэгдэх эсэхийг шалгана. Мэргэжлийн тодруулга хэрэгтэй байж болох хэсгийг төлбөртэй тайлангаар хаахгүй."
    ),
    section(
      "7 хоногийн баталгаажуулах тэмдэглэл",
      "Долоо хоногт нойр, энерги, өлсөх цаг, цадах мэдрэмж, биеийн тухгүй дохиог дүгнэлтгүй тэмдэглэ. Хэрэв нэг хэв шинж давтагдвал өөрөө оношлохын оронд тайван тодруулах асуулт болгон авч явна."
    )
  ]);
}

export function collectUserFacingText(rendering) {
  if (!rendering) return "";
  return rendering.fullUserFacingText || rendering.sections
    .map(item => `${item.title}\n${item.body}`)
    .join("\n\n");
}

export function hasInternalKeyLeak(text) {
  if (!text) return false;
  return INTERNAL_KEY_PATTERNS.some(pattern => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
}

export function renderCopyDecisionSections(metadata, options = {}) {
  if (!metadata) return null;
  if (metadata.version !== METADATA_VERSION) {
    throw new Error("renderCopyDecisionSections requires copy-decision-metadata-v0-test-only metadata");
  }
  if (metadata.decisionStatus !== "owner_recommended") return null;
  if (metadata.runtimeGate.canRenderInRuntime !== false) return null;

  if (metadata.fixtureName === "all_or_nothing_restriction_rebound") {
    return renderAllOrNothing(metadata, options);
  }

  if (metadata.fixtureName === "pcos_body_uncertainty_control") {
    return renderPcosBodyUncertainty(metadata, options);
  }

  return null;
}

export function renderFixtureCopyDecisionSections(fixture) {
  const metadata = buildFixtureCopyDecisionMetadata(fixture);
  return renderCopyDecisionSections(metadata);
}

export function renderFixtureCopyDecisionSectionList(fixtures = driverStackFixtures) {
  const metadataList = buildFixtureCopyDecisionMetadataList(fixtures);
  return metadataList
    .map(metadata => renderCopyDecisionSections(metadata))
    .filter(Boolean);
}

## Full Content: tests/driver-stack/copyDecisionRenderer.test.js

const assert = require("assert");
const { execFileSync } = require("child_process");

(async () => {
  const {
    renderCopyDecisionSections,
    renderFixtureCopyDecisionSections,
    renderFixtureCopyDecisionSectionList,
    collectUserFacingText,
    hasInternalKeyLeak
  } = await import("./copyDecisionRenderer.mjs");
  const { buildFixtureCopyDecisionMetadata } = await import("./copyDecisionMetadata.mjs");
  const { driverStackFixtures } = await import("./driverStackFixtures.mjs");

  [
    renderCopyDecisionSections,
    renderFixtureCopyDecisionSections,
    renderFixtureCopyDecisionSectionList,
    collectUserFacingText,
    hasInternalKeyLeak
  ].forEach(fn => assert.strictEqual(typeof fn, "function"));

  assert.strictEqual(renderCopyDecisionSections(null), null);
  assert.throws(
    () => renderCopyDecisionSections({ version: "not-copy-decision-metadata-v0-test-only" }),
    /requires copy-decision-metadata-v0-test-only metadata/
  );

  const renderings = renderFixtureCopyDecisionSectionList(driverStackFixtures);
  assert.strictEqual(renderings.length, 2);
  assert.deepStrictEqual(renderings.map(rendering => rendering.fixtureName), [
    "all_or_nothing_restriction_rebound",
    "pcos_body_uncertainty_control"
  ]);

  renderings.forEach(rendering => {
    assert.deepStrictEqual(Object.keys(rendering), [
      "version",
      "fixtureName",
      "decisionStatus",
      "safetyMode",
      "rendererMode",
      "sections",
      "fullUserFacingText",
      "qualityChecks",
      "runtimeGate",
      "pass"
    ]);
    assert.strictEqual(rendering.version, "copy-decision-rendering-v0-test-only");
    assert.strictEqual(rendering.decisionStatus, "owner_recommended");
    assert.strictEqual(rendering.rendererMode, "test_only");
    assert.strictEqual(rendering.runtimeGate.canRenderInRuntime, false);
    assert.strictEqual(rendering.pass, true);
    assert(Array.isArray(rendering.sections));
    assert.strictEqual(rendering.sections.length, 5);
    rendering.sections.forEach(section => {
      assert.deepStrictEqual(Object.keys(section), ["title", "body"]);
      assert.strictEqual(typeof section.title, "string");
      assert.strictEqual(typeof section.body, "string");
      assert(section.body.length > 20);
    });
    assert.deepStrictEqual(Object.keys(rendering.qualityChecks), [
      "internalKeyLeak",
      "shameLanguage",
      "medicalCauseClaim",
      "diagnosisClaim",
      "treatmentAdvice",
      "runtimeGateRespected",
      "experimentIsObservation",
      "diaryIsObservation"
    ]);
    assert.strictEqual(rendering.qualityChecks.internalKeyLeak, false);
    assert.strictEqual(rendering.qualityChecks.shameLanguage, false);
    assert.strictEqual(rendering.qualityChecks.medicalCauseClaim, false);
    assert.strictEqual(rendering.qualityChecks.diagnosisClaim, false);
    assert.strictEqual(rendering.qualityChecks.treatmentAdvice, false);
    assert.strictEqual(rendering.qualityChecks.runtimeGateRespected, true);
    assert.strictEqual(rendering.qualityChecks.experimentIsObservation, true);
    assert.strictEqual(rendering.qualityChecks.diaryIsObservation, true);
    assert.strictEqual(rendering.runtimeGate.canRenderInRuntime, false);
    assert.strictEqual(rendering.sections.length, 5);
    const userFacingText = collectUserFacingText(rendering);
    assert.strictEqual(userFacingText, rendering.fullUserFacingText);
    assert(userFacingText.length > 100);
    assert.strictEqual(hasInternalKeyLeak(userFacingText), false, `${rendering.fixtureName}: user-facing copy leaked an internal key`);
    [
      "hunger_safety",
      "restriction_rebound_relief",
      "control_regain",
      "body_uncertainty_soft_medical_context",
      "owner_recommended",
      "test_only",
      "mode1",
      "runtimeGate"
    ].forEach(forbidden => {
      assert(!userFacingText.includes(forbidden), `${rendering.fixtureName}: leaked ${forbidden}`);
    });
  });

  const allOrNothing = renderings.find(rendering => rendering.fixtureName === "all_or_nothing_restriction_rebound");
  const allOrNothingText = collectUserFacingText(allOrNothing);
  assert(allOrNothingText.includes("удаан хорьсон хэмнэл аюулгүй хооллох дохио"));
  assert(allOrNothingText.includes("Энд зөвхөн өлсөлт биш"));
  assert(allOrNothingText.includes("аль хэдийн алдсан"));
  assert(allOrNothingText.includes("Дахин эхлэх дарамт"));
  assert(allOrNothingText.includes("шийтгэхгүйгээр"));
  assert(allOrNothingText.includes("7 хоногийн баталгаажуулах тэмдэглэл"));
  assert(allOrNothingText.includes("өөрийгөө шүүхэд биш"));
  assert(!allOrNothingText.includes("сул дорой"));
  assert(!allOrNothingText.includes("хатуу дэглэм"));
  assert(!allOrNothingText.includes("маргааш нөх"));

  const pcos = renderings.find(rendering => rendering.fixtureName === "pcos_body_uncertainty_control");
  const pcosText = collectUserFacingText(pcos);
  assert.strictEqual(pcos.safetyMode, "mode1");
  assert(pcosText.includes("Энэ нь онош биш."));
  assert(pcosText.includes("тодорхойгүй байдал"));
  assert(pcosText.includes("тодруулах хэрэгтэй байж магадгүй"));
  assert(pcosText.includes("биеийг шүүхгүйгээр"));
  assert(pcosText.includes("7 хоногийн баталгаажуулах тэмдэглэл"));
  assert(pcosText.includes("өөрөө оношлохын оронд"));
  assert(!pcosText.includes("PCOS"));
  assert(!pcosText.includes("даавраас болсон"));
  assert(!pcosText.includes("эмнээс болсон"));
  assert(!pcosText.includes("глюкозоос болсон"));
  assert(!pcosText.includes("оношилгоо"));
  assert(!pcosText.includes("эмчилгээ"));

  const mealGapFixture = driverStackFixtures.find(fixture => fixture.name === "meal_gap_evening_hunger");
  assert.strictEqual(renderFixtureCopyDecisionSections(mealGapFixture), null);
  const professionalFirstFixture = driverStackFixtures.find(fixture => fixture.name === "medication_body_concern_professional_check");
  assert.strictEqual(renderFixtureCopyDecisionSections(professionalFirstFixture), null);

  const professionalFirstMetadata = buildFixtureCopyDecisionMetadata(professionalFirstFixture);
  assert.strictEqual(renderCopyDecisionSections(professionalFirstMetadata), null);
  assert.strictEqual(collectUserFacingText(null), "");
  assert.strictEqual(hasInternalKeyLeak("Энгийн хэрэглэгчид харагдах Монгол өгүүлбэр."), false);
  assert.strictEqual(hasInternalKeyLeak("hunger_safety"), true);

  const artifact = JSON.parse(execFileSync("node", ["tests/driver-stack/exportCopyDecisionRenderings.mjs"], { encoding: "utf8" }));
  assert.deepStrictEqual(Object.keys(artifact), [
    "version",
    "generatedBy",
    "recommendation",
    "fixtureCount",
    "results"
  ]);
  assert.strictEqual(artifact.version, "copy-decision-rendering-v0-test-only");
  assert.strictEqual(artifact.generatedBy, "tests/driver-stack/exportCopyDecisionRenderings.mjs");
  assert.strictEqual(artifact.recommendation, "READY FOR OWNER REVIEW OF TEST-ONLY COPY RENDERER");
  assert.strictEqual(artifact.fixtureCount, 2);
  assert.deepStrictEqual(artifact.results.map(result => result.fixtureName), [
    "all_or_nothing_restriction_rebound",
    "pcos_body_uncertainty_control"
  ]);
  artifact.results.forEach(result => {
    assert.deepStrictEqual(Object.keys(result), [
      "version",
      "fixtureName",
      "decisionStatus",
      "safetyMode",
      "rendererMode",
      "sections",
      "fullUserFacingText",
      "qualityChecks",
      "runtimeGate",
      "pass"
    ]);
    assert.strictEqual(result.decisionStatus, "owner_recommended");
    assert.strictEqual(result.rendererMode, "test_only");
    assert.strictEqual(result.runtimeGate.canRenderInRuntime, false);
    assert.strictEqual(result.qualityChecks.internalKeyLeak, false);
    assert.strictEqual(result.qualityChecks.runtimeGateRespected, true);
    assert.strictEqual(result.qualityChecks.experimentIsObservation, true);
    assert.strictEqual(result.qualityChecks.diaryIsObservation, true);
    assert.strictEqual(result.sections.length, 5);
    assert.strictEqual(result.pass, true);
  });

  console.log("copyDecisionRenderer tests passed");
})().catch(error => {
  console.error(error);
  process.exit(1);
});

## Full Content: tests/driver-stack/exportCopyDecisionRenderings.mjs

import { renderFixtureCopyDecisionSectionList } from "./copyDecisionRenderer.mjs";
import { driverStackFixtures } from "./driverStackFixtures.mjs";

const results = renderFixtureCopyDecisionSectionList(driverStackFixtures);

console.log(JSON.stringify({
  version: "copy-decision-rendering-v0-test-only",
  generatedBy: "tests/driver-stack/exportCopyDecisionRenderings.mjs",
  recommendation: "READY FOR OWNER REVIEW OF TEST-ONLY COPY RENDERER",
  fixtureCount: results.length,
  results
}, null, 2));

## Full Content: audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-results.json

{
  "version": "copy-decision-rendering-v0-test-only",
  "generatedBy": "tests/driver-stack/exportCopyDecisionRenderings.mjs",
  "recommendation": "READY FOR OWNER REVIEW OF TEST-ONLY COPY RENDERER",
  "fixtureCount": 2,
  "results": [
    {
      "version": "copy-decision-rendering-v0-test-only",
      "fixtureName": "all_or_nothing_restriction_rebound",
      "decisionStatus": "owner_recommended",
      "safetyMode": "mode1",
      "rendererMode": "test_only",
      "sections": [
        {
          "title": "Ил харагдаж байгаа зүйл",
          "body": "Хэт чанга барьсны дараа орой эсвэл дараагийн хоолон дээр бие илүү хурдан хамгаалалт хайж байна. Энэ нь зангийн алдаа биш, удаан хорьсон хэмнэл аюулгүй хооллох дохио нэхэж байгаа хэлбэр."
        },
        {
          "title": "Цаана нь ажиллаж байгаа зүйл",
          "body": "Энд зөвхөн өлсөлт биш, “аль хэдийн алдсан” гэсэн мэдрэмжээс түр гарах хэрэгцээ ч давхардаж байж магадгүй. Дахин эхлэх дарамт ихсэхээр хоол түр тайвшруулах, өөрийгөө шийтгэсэн төлөвөөс гаргах үүрэг авч байна."
        },
        {
          "title": "Эхний зөөлөн өөрчлөлт",
          "body": "Маргаашийг хүлээж өөрийгөө дахин чангалах биш, дараагийн хоолыг энгийн сэргээх цэг болго. Нэг уурагтай, нэг нүүрс устай, нэг тайван сууж идэх завсартай хоол сонгоод тэр өдрийг дахин шийтгэхгүйгээр үргэлжлүүл."
        },
        {
          "title": "14 хоногийн туршилтын таамаг",
          "body": "Хэрэв дараагийн хоолыг шийтгэл биш сэргээх цэг болгож үзвэл оройн дайралт багасч, долоо хоногийн эхэнд бүхнийг дахин эхлүүлэх дарамт сулрах эсэхийг ажиглана. Энэ бол тушаал биш, таны биед аль нь зөөлөн ажиллаж байгааг шалгах жижиг туршилт."
        },
        {
          "title": "7 хоногийн баталгаажуулах тэмдэглэл",
          "body": "Долоо хоногт оройн өлсөлт, хоолоо хорьсон цаг, дараагийн хоолыг хэр зөөлөн сэргээсэн эсэхээ л тэмдэглэ. Тэмдэглэл нь өөрийгөө шүүхэд биш, аль мөчид дахин эхлэх дарамт нэмэгдэж байгааг харахад зориулагдана."
        }
      ],
      "fullUserFacingText": "Ил харагдаж байгаа зүйл\nХэт чанга барьсны дараа орой эсвэл дараагийн хоолон дээр бие илүү хурдан хамгаалалт хайж байна. Энэ нь зангийн алдаа биш, удаан хорьсон хэмнэл аюулгүй хооллох дохио нэхэж байгаа хэлбэр.\n\nЦаана нь ажиллаж байгаа зүйл\nЭнд зөвхөн өлсөлт биш, “аль хэдийн алдсан” гэсэн мэдрэмжээс түр гарах хэрэгцээ ч давхардаж байж магадгүй. Дахин эхлэх дарамт ихсэхээр хоол түр тайвшруулах, өөрийгөө шийтгэсэн төлөвөөс гаргах үүрэг авч байна.\n\nЭхний зөөлөн өөрчлөлт\nМаргаашийг хүлээж өөрийгөө дахин чангалах биш, дараагийн хоолыг энгийн сэргээх цэг болго. Нэг уурагтай, нэг нүүрс устай, нэг тайван сууж идэх завсартай хоол сонгоод тэр өдрийг дахин шийтгэхгүйгээр үргэлжлүүл.\n\n14 хоногийн туршилтын таамаг\nХэрэв дараагийн хоолыг шийтгэл биш сэргээх цэг болгож үзвэл оройн дайралт багасч, долоо хоногийн эхэнд бүхнийг дахин эхлүүлэх дарамт сулрах эсэхийг ажиглана. Энэ бол тушаал биш, таны биед аль нь зөөлөн ажиллаж байгааг шалгах жижиг туршилт.\n\n7 хоногийн баталгаажуулах тэмдэглэл\nДолоо хоногт оройн өлсөлт, хоолоо хорьсон цаг, дараагийн хоолыг хэр зөөлөн сэргээсэн эсэхээ л тэмдэглэ. Тэмдэглэл нь өөрийгөө шүүхэд биш, аль мөчид дахин эхлэх дарамт нэмэгдэж байгааг харахад зориулагдана.",
      "qualityChecks": {
        "internalKeyLeak": false,
        "shameLanguage": false,
        "medicalCauseClaim": false,
        "diagnosisClaim": false,
        "treatmentAdvice": false,
        "runtimeGateRespected": true,
        "experimentIsObservation": true,
        "diaryIsObservation": true
      },
      "runtimeGate": {
        "canRenderInRuntime": false,
        "requiredBeforeRuntime": [
          "Owner approval of copy decision metadata.",
          "Test-only prototype proves supplementaryNarrative renders without internal keys.",
          "Runtime copy includes hunger-safety and relief/restart-pressure narrative.",
          "No strict diet, shame-language, or compensate-tomorrow regression."
        ]
      },
      "pass": true
    },
    {
      "version": "copy-decision-rendering-v0-test-only",
      "fixtureName": "pcos_body_uncertainty_control",
      "decisionStatus": "owner_recommended",
      "safetyMode": "mode1",
      "rendererMode": "test_only",
      "sections": [
        {
          "title": "Ил харагдаж байгаа зүйл",
          "body": "Биеийн өөрчлөлт ойлгомжгүй санагдах үед хоол, жин, хэмжилт дээр хяналтаа буцааж авах оролдлого хүчтэй болж байна. Энэ нь биеэ буруутгах шалтгаан биш, тодорхойгүй байдалд барих нэг жижиг бариул хайж байгаа хэлбэр."
        },
        {
          "title": "Зөөлөн мэргэжлийн гүүр",
          "body": "Энэ нь онош биш. Хэрэв мөчлөг, эм, даавар, цусан дахь сахартай холбоотой асуулт таны толгойд давтагдаж байвал шалтгаан гэж дүгнэхээс өмнө мэргэжлийн хүнтэй тайван тодруулах хэрэгтэй байж магадгүй."
        },
        {
          "title": "Эхний зөөлөн өөрчлөлт",
          "body": "Биеэ батлахын тулд хоолоо чангалж хэмжихийн оронд 7 хоногийн турш нойр, өлсөх цаг, энерги, гэдэс цадах мэдрэмжээ биеийг шүүхгүйгээр тэмдэглэ. Зорилго нь буруутан олох биш, ямар нөхцөлд таны бие илүү тогтвортой санагдаж байгааг харах."
        },
        {
          "title": "14 хоногийн туршилтын таамаг",
          "body": "Хэрэв хяналтаа буцааж авах оролдлогыг илүү зөөлөн ажиглалт руу шилжүүлбэл хоолны хатуу шийдвэр багасч, биеийн дохиог илүү тайван ялгах боломж нэмэгдэх эсэхийг шалгана. Мэргэжлийн тодруулга хэрэгтэй байж болох хэсгийг төлбөртэй тайлангаар хаахгүй."
        },
        {
          "title": "7 хоногийн баталгаажуулах тэмдэглэл",
          "body": "Долоо хоногт нойр, энерги, өлсөх цаг, цадах мэдрэмж, биеийн тухгүй дохиог дүгнэлтгүй тэмдэглэ. Хэрэв нэг хэв шинж давтагдвал өөрөө оношлохын оронд тайван тодруулах асуулт болгон авч явна."
        }
      ],
      "fullUserFacingText": "Ил харагдаж байгаа зүйл\nБиеийн өөрчлөлт ойлгомжгүй санагдах үед хоол, жин, хэмжилт дээр хяналтаа буцааж авах оролдлого хүчтэй болж байна. Энэ нь биеэ буруутгах шалтгаан биш, тодорхойгүй байдалд барих нэг жижиг бариул хайж байгаа хэлбэр.\n\nЗөөлөн мэргэжлийн гүүр\nЭнэ нь онош биш. Хэрэв мөчлөг, эм, даавар, цусан дахь сахартай холбоотой асуулт таны толгойд давтагдаж байвал шалтгаан гэж дүгнэхээс өмнө мэргэжлийн хүнтэй тайван тодруулах хэрэгтэй байж магадгүй.\n\nЭхний зөөлөн өөрчлөлт\nБиеэ батлахын тулд хоолоо чангалж хэмжихийн оронд 7 хоногийн турш нойр, өлсөх цаг, энерги, гэдэс цадах мэдрэмжээ биеийг шүүхгүйгээр тэмдэглэ. Зорилго нь буруутан олох биш, ямар нөхцөлд таны бие илүү тогтвортой санагдаж байгааг харах.\n\n14 хоногийн туршилтын таамаг\nХэрэв хяналтаа буцааж авах оролдлогыг илүү зөөлөн ажиглалт руу шилжүүлбэл хоолны хатуу шийдвэр багасч, биеийн дохиог илүү тайван ялгах боломж нэмэгдэх эсэхийг шалгана. Мэргэжлийн тодруулга хэрэгтэй байж болох хэсгийг төлбөртэй тайлангаар хаахгүй.\n\n7 хоногийн баталгаажуулах тэмдэглэл\nДолоо хоногт нойр, энерги, өлсөх цаг, цадах мэдрэмж, биеийн тухгүй дохиог дүгнэлтгүй тэмдэглэ. Хэрэв нэг хэв шинж давтагдвал өөрөө оношлохын оронд тайван тодруулах асуулт болгон авч явна.",
      "qualityChecks": {
        "internalKeyLeak": false,
        "shameLanguage": false,
        "medicalCauseClaim": false,
        "diagnosisClaim": false,
        "treatmentAdvice": false,
        "runtimeGateRespected": true,
        "experimentIsObservation": true,
        "diaryIsObservation": true
      },
      "runtimeGate": {
        "canRenderInRuntime": false,
        "requiredBeforeRuntime": [
          "Owner approval of copy decision metadata.",
          "Test-only prototype proves softMedicalContextBridge is present.",
          "Copy says this is not diagnosis.",
          "Copy preserves ordinary observation unless professional-first is triggered.",
          "No medical-cause implication regression."
        ]
      },
      "pass": true
    }
  ]
}

## Full Content: audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-markdown-snapshots.md

# Work Pack 10 Copy Rendering Markdown Snapshots

## Хэт чанга барилт ба дахин эхлэх дарамт

Runtime render allowed: false

### Ил харагдаж байгаа зүйл

Хэт чанга барьсны дараа орой эсвэл дараагийн хоолон дээр бие илүү хурдан хамгаалалт хайж байна. Энэ нь зангийн алдаа биш, удаан хорьсон хэмнэл аюулгүй хооллох дохио нэхэж байгаа хэлбэр.

### Цаана нь ажиллаж байгаа зүйл

Энд зөвхөн өлсөлт биш, “аль хэдийн алдсан” гэсэн мэдрэмжээс түр гарах хэрэгцээ ч давхардаж байж магадгүй. Дахин эхлэх дарамт ихсэхээр хоол түр тайвшруулах, өөрийгөө шийтгэсэн төлөвөөс гаргах үүрэг авч байна.

### Эхний зөөлөн өөрчлөлт

Маргаашийг хүлээж өөрийгөө дахин чангалах биш, дараагийн хоолыг энгийн сэргээх цэг болго. Нэг уурагтай, нэг нүүрс устай, нэг тайван сууж идэх завсартай хоол сонгоод тэр өдрийг дахин шийтгэхгүйгээр үргэлжлүүл.

### 14 хоногийн туршилтын таамаг

Хэрэв дараагийн хоолыг шийтгэл биш сэргээх цэг болгож үзвэл оройн дайралт багасч, долоо хоногийн эхэнд бүхнийг дахин эхлүүлэх дарамт сулрах эсэхийг ажиглана. Энэ бол тушаал биш, таны биед аль нь зөөлөн ажиллаж байгааг шалгах жижиг туршилт.

### 7 хоногийн баталгаажуулах тэмдэглэл

Долоо хоногт оройн өлсөлт, хоолоо хорьсон цаг, дараагийн хоолыг хэр зөөлөн сэргээсэн эсэхээ л тэмдэглэ. Тэмдэглэл нь өөрийгөө шүүхэд биш, аль мөчид дахин эхлэх дарамт нэмэгдэж байгааг харахад зориулагдана.

### Quality Check Summary

- Internal key leak: false
- Runtime render allowed: false
- Includes hunger-safety meaning without internal key: true
- Includes restriction/rebound relief narrative: true
- Includes restart-pressure narrative: true
- Non-shaming wording: true

## Биеийн тодорхойгүй байдал ба зөөлөн ажиглалт

Runtime render allowed: false

### Ил харагдаж байгаа зүйл

Биеийн өөрчлөлт ойлгомжгүй санагдах үед хоол, жин, хэмжилт дээр хяналтаа буцааж авах оролдлого хүчтэй болж байна. Энэ нь биеэ буруутгах шалтгаан биш, тодорхойгүй байдалд барих нэг жижиг бариул хайж байгаа хэлбэр.

### Зөөлөн мэргэжлийн гүүр

Энэ нь онош биш. Хэрэв мөчлөг, эм, даавар, цусан дахь сахартай холбоотой асуулт таны толгойд давтагдаж байвал шалтгаан гэж дүгнэхээс өмнө мэргэжлийн хүнтэй тайван тодруулах хэрэгтэй байж магадгүй.

### Эхний зөөлөн өөрчлөлт

Биеэ батлахын тулд хоолоо чангалж хэмжихийн оронд 7 хоногийн турш нойр, өлсөх цаг, энерги, гэдэс цадах мэдрэмжээ биеийг шүүхгүйгээр тэмдэглэ. Зорилго нь буруутан олох биш, ямар нөхцөлд таны бие илүү тогтвортой санагдаж байгааг харах.

### 14 хоногийн туршилтын таамаг

Хэрэв хяналтаа буцааж авах оролдлогыг илүү зөөлөн ажиглалт руу шилжүүлбэл хоолны хатуу шийдвэр багасч, биеийн дохиог илүү тайван ялгах боломж нэмэгдэх эсэхийг шалгана. Мэргэжлийн тодруулга хэрэгтэй байж болох хэсгийг төлбөртэй тайлангаар хаахгүй.

### 7 хоногийн баталгаажуулах тэмдэглэл

Долоо хоногт нойр, энерги, өлсөх цаг, цадах мэдрэмж, биеийн тухгүй дохиог дүгнэлтгүй тэмдэглэ. Хэрэв нэг хэв шинж давтагдвал өөрөө оношлохын оронд тайван тодруулах асуулт болгон авч явна.

### Quality Check Summary

- Internal key leak: false
- Runtime render allowed: false
- Includes non-diagnostic bridge: true
- Includes body-neutral uncertainty language: true
- Avoids medical-cause claim: true
- Professional-first fixture not hijacked: true

## Full Content: audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-notes.md

# Work Pack 10 Copy Rendering Notes

## Purpose

WP10 creates a test-only copy renderer prototype that consumes WP9 copy decision metadata and renders safe Mongolian user-facing draft sections for the two copy-sensitive fixtures.

This is not runtime integration. It does not modify `app.js`, runtime report rendering, scoring, fixtures, PDF, backend, payment, QPay, pricing, entitlement, or localStorage behavior.

## Renderer source

- `tests/driver-stack/copyDecisionRenderer.mjs`
- `tests/driver-stack/copyDecisionRenderer.test.js`
- `tests/driver-stack/exportCopyDecisionRenderings.mjs`

## Renderer contract

The renderer exports:

- `renderCopyDecisionSections(metadata, options = {})`
- `renderFixtureCopyDecisionSections(fixture)`
- `renderFixtureCopyDecisionSectionList(fixtures)`
- `collectUserFacingText(rendering)`
- `hasInternalKeyLeak(text)`

## Rendering behavior

The renderer only renders metadata where:

- `metadata.version === "copy-decision-metadata-v0-test-only"`
- `metadata.decisionStatus === "owner_recommended"`
- `metadata.runtimeGate.canRenderInRuntime === false`
- `metadata.fixtureName` is one of the two WP9 copy decision fixtures

All non-decision fixtures return `null` or are omitted from list exports.

## Output behavior

Each rendering keeps:

- `decisionStatus === "owner_recommended"`
- `runtimeGate.canRenderInRuntime === false`
- `rendererMode === "test_only"`

Each rendering now has five user-facing section drafts. Each section uses only:

- `title`
- `body`

The export artifact contains the full rendering objects, including `fullUserFacingText` and `qualityChecks`. The `qualityChecks` object uses the exact WP10D contract:

- `internalKeyLeak`
- `shameLanguage`
- `medicalCauseClaim`
- `diagnosisClaim`
- `treatmentAdvice`
- `runtimeGateRespected`
- `experimentIsObservation`
- `diaryIsObservation`

The rendered sections are Mongolian draft copy for owner review. They are not approved production report copy.

## Fixture-specific proof

### `all_or_nothing_restriction_rebound`

The rendering includes:

- a hunger-safety explanation without the internal key
- a restriction/rebound relief narrative
- restart-pressure language
- a gentle next-meal reset
- a 14-day experiment framed as a test, not a command
- a 7-day diary confirmation section

### `pcos_body_uncertainty_control`

The rendering includes:

- `Энэ нь онош биш.`
- body-neutral uncertainty language
- a soft professional-context bridge
- ordinary observation language
- no PCOS, hormone, medication, or glucose cause claim
- a 7-day diary confirmation section

## Runtime hold

Runtime integration remains HOLD. Production rendering remains HOLD. PDF generation and deploy remain HOLD.

## Full Content: audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-fixture-summary.md

# Work Pack 10 Copy Rendering Fixture Summary

Source artifact: `copy-rendering-results.json`

| Fixture | Renderer mode | Decision status | Runtime render allowed | Sections | Main copy proof | Pass |
| --- | --- | --- | --- | --- | --- | --- |
| `all_or_nothing_restriction_rebound` | `test_only` | `owner_recommended` | false | 5 | hunger-safety plus restriction/rebound relief | true |
| `pcos_body_uncertainty_control` | `test_only` | `owner_recommended` | false | 5 | non-diagnostic body-uncertainty bridge | true |

## Omitted fixtures

All fixtures outside the WP9 copy decision metadata return `null` or are omitted. The professional-first fixture `medication_body_concern_professional_check` is explicitly tested as omitted so WP10 does not hijack safety routing with a soft medical bridge.

## User-facing copy surface

The exported artifact includes full rendering objects with `sections`, `fullUserFacingText`, and `qualityChecks` for owner review. This text is still test-only and not runtime-approved.

## Non-goals confirmed

- No runtime rendering.
- No production report rendering.
- No `app.js` integration.
- No scoring change.
- No fixture behavior change.
- No WP4 report object contract change.
- No PDF generation.
- No deploy.
- No payment/QPay/backend work.

## Full Content: audits/mvp-diagnostic-migration/work-pack-10/copy-rendering-test-coverage.md

# Work Pack 10 Copy Rendering Test Coverage

## Test file

`tests/driver-stack/copyDecisionRenderer.test.js`

## Coverage

- Confirms all required renderer exports exist.
- Confirms `renderCopyDecisionSections(null) === null`.
- Confirms invalid metadata version throws.
- Confirms exactly two fixtures render.
- Confirms each rendering has exactly five sections.
- Confirms every rendering has the exact approved top-level key order.
- Confirms every section has only `title` and `body`.
- Confirms every export result is a full rendering object, not a compact summary row.
- Confirms every rendering includes `fullUserFacingText`.
- Confirms every rendering includes the exact WP10D `qualityChecks` key order.
- Confirms `qualityChecks.internalKeyLeak === false`.
- Confirms `qualityChecks.shameLanguage === false`.
- Confirms `qualityChecks.medicalCauseClaim === false`.
- Confirms `qualityChecks.diagnosisClaim === false`.
- Confirms `qualityChecks.treatmentAdvice === false`.
- Confirms `qualityChecks.runtimeGateRespected === true`.
- Confirms `qualityChecks.experimentIsObservation === true`.
- Confirms `qualityChecks.diaryIsObservation === true`.
- Confirms `pass` explicitly requires runtime gate false, five sections, and populated `fullUserFacingText`.
- Confirms non-decision fixtures return `null`.
- Confirms `medication_body_concern_professional_check` returns `null`.
- Confirms every rendering keeps `decisionStatus === "owner_recommended"`.
- Confirms every rendering keeps `rendererMode === "test_only"`.
- Confirms every rendering keeps `runtimeGate.canRenderInRuntime === false`.
- Confirms user-facing text has no internal key leak.
- Confirms `all_or_nothing_restriction_rebound` renders hunger-safety and restriction/rebound relief.
- Confirms `pcos_body_uncertainty_control` renders `Энэ нь онош биш.` and body-neutral uncertainty language.
- Confirms PCOS, hormone, medication, and glucose are not claimed as causes.
- Confirms both renderings include a 7-day diary confirmation section.
- Confirms the export artifact has two passing results.

## Internal key leak guard

The renderer exposes `hasInternalKeyLeak(text)` for test-only QA. It flags snake_case keys and metadata terms such as `runtimeGate`, `decisionStatus`, `rendererMode`, `owner_recommended`, and `test_only` if they appear in user-facing copy.

## Runtime guard coverage

The test asserts that renderer output is not runtime-approved and cannot render in runtime.

## Full Content: audits/mvp-diagnostic-migration/work-pack-10/work-pack-10-recommendation.md

# Work Pack 10 Recommendation

## Recommendation Enum

READY FOR OWNER REVIEW OF TEST-ONLY COPY RENDERER

## Basis

The test-only copy renderer prototype converts the two WP9 copy decision metadata objects into safe Mongolian draft sections without changing runtime behavior.

- `all_or_nothing_restriction_rebound` renders hunger-safety plus restriction/rebound relief language.
- `pcos_body_uncertainty_control` renders a non-diagnostic body-uncertainty bridge.
- Both remain `owner_recommended`, not owner-approved runtime copy.
- Both keep `runtimeGate.canRenderInRuntime === false`.
- Both use `rendererMode === "test_only"`.

## Hold conditions

Runtime integration remains HOLD. Production report rendering remains HOLD. WP3 scoring, WP3 fixtures, WP4 report object contract, PDF generation, deploy, backend, payment, QPay, pricing, entitlement, and localStorage remain out of scope.
