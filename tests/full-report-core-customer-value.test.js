"use strict";

const assert = require("node:assert/strict");
const app = require("../app.js");
const { buildEvidence, buildFullReport, publicReport } = require("../netlify/functions/_lib/report.js");
const { validateReportForActivation } = require("../netlify/functions/_lib/report-validation.js");
const fixtures = require("./fixtures/report-gold-profiles.js");

const rows = answers => Object.entries(answers).map(([questionId, value]) => ({ questionId, value }));
const reportFor = answers => buildFullReport(buildEvidence(rows(answers)), new Date("2026-07-30T00:00:00.000Z"));

app._test.setState({ ownerPreview: true, commercialFlowVersion: "prepaid_v2" });
const currentPaidFirstPaywall = app.renderForPath("/assessment/contact");
for (const exact of [
  "Тест үнэлгээ болон бүрэн тайлангаа нээх",
  "Тестийн хариултад тулгуурлан жин хасахад тань нөлөөлж буй сэтгэлзүйн болон зан үйлийн хэв маягийг тайлбарлана.",
  "Бүрэн тайланд эдгээр хэв маяг ямар нөхцөлд илэрдэг, хоорондоо хэрхэн уялддаг болон нөлөөг нь хэрхэн удирдаж болох талаар тодорхой зөвлөмж багтана.",
  "Танд нөлөөлж буй хэв маягууд",
  "Хэв маягуудын хоорондын уялдаа",
  "Ямар үед илүү хүчтэй илэрдэг",
  "Нөлөөг нь хэрхэн удирдах арга",
  "Эхэлж хэрэгжүүлэх 3 алхам",
  "Төлөвлөснөөрөө явж чадаагүй үед үргэлжлүүлэх арга",
  "QPay-аар 9,900₮ төлөөд тестээ эхлүүлэх",
  "Төлбөр нэг удаагийн. Төлбөр баталгаажсаны дараа тест нээгдэнэ."
]) assert(currentPaidFirstPaywall.includes(exact), `current paid-first copy missing: ${exact}`);
for (const premature of [
  "Таны эхний үр дүн",
  "Эхний хувийн үр дүн",
  "Таны хариултаас хамгийн тод харагдсан",
  "Бусад хэв маяг мөн ажиглагдсан",
  "Бүрэн тайлангаас бусад хэв маягаа харна"
]) assert(!currentPaidFirstPaywall.includes(premature), `current paid-first paywall implies an initial result was shown: ${premature}`);
assert(app.renderForPath("/assessment/start").includes("Тестээ эхлүүлэх"), "public start uses the free assessment introduction");

app._test.setState({ ownerPreview: true, commercialFlowVersion: "legacy_postpaid_v1", assessmentStatus: "complete", assessmentId: "core-value-paywall" });
const paywall = app.renderForPath("/assessment/completed");
for (const exact of [
  "Бүрэн тайлан",
  "Хамгийн чухал нь эдгээр бэрхшээлийг хэрхэн даван туулах вэ гэдгийг ойлгох",
  "Ямар хэв маяг нөлөөлж байгааг мэдэх нь зөвхөн эхний алхам. Бүрэн тайлангаас эдгээр хэв маяг ямар үед хүчтэй болдог, хоорондоо хэрхэн нөлөөлдөг болон жин хасах оролдлогыг тань яаж хүндрүүлдэг байж болохыг мэдэж авна.",
  "Мөн тухайн үед юу хийж болох, сэтгэл хөдлөл, зуршил, идэх хүсэл болон орчны нөлөөг хэрхэн удирдах талаар таны хариултад тулгуурласан тодорхой заавар авна.",
  "Даван туулах аргаа ойлгосноор жин хасахад саад болж буй сэтгэлзүйн хэв маягаа анзаарч, удирдахад илүү хялбар болно. Ингэснээр жин хасах зорилгодоо илүү ойлгомжтой, тогтвортой ажиллах боломжтой болно.",
  "Хэв маягуудын нэр, уялдаа холбооноос гадна тэдгээрийн нөлөөг багасгах, сэтгэл хөдлөл болон зуршлаа удирдах, хэцүү үеийг даван туулах аргуудаа авна.",
  "Бүрэн тайлангаа нээх — 9,900₮",
  "Нэг удаагийн төлбөр. Төлбөр баталгаажсаны дараа бүрэн тайлан шууд нээгдэнэ."
]) assert(paywall.includes(exact), `paywall exact copy missing: ${exact}`);

const lockedTitles = [
  "Танд нөлөөлж буй хэв маягууд",
  "Хэв маягуудын уялдаа холбоо",
  "Ямар үед илүү хүчтэй болдог",
  "Сэтгэлзүйн хэв маягаа хэрхэн удирдах вэ?",
  "Хэцүү үеийг хэрхэн даван туулах вэ?",
  "Эхэлж хэрэгжүүлэх 3 алхам",
  "Төлөвлөснөөрөө явж чадаагүй үед хэрхэн үргэлжлүүлэх вэ?"
];
for (const title of lockedTitles) assert.equal(paywall.split(title).length - 1, 1, `locked title must appear exactly once: ${title}`);
assert.equal((paywall.match(/class="lock-mark"/g) || []).length, 7);
for (const hiddenBody of ["Юуг анзаарах вэ?", "Урьдчилан юу бэлдэх вэ?", "Тухайн үед юу хийж болох вэ?"]) assert(!paywall.includes(hiddenBody), `full report body leaked into locked preview: ${hiddenBody}`);

app._test.setState({ ownerPreview: true, commercialFlowVersion: "free_assessment_postpaid_v1", assessmentStatus: "complete", assessmentId: "sealed-result" });
const sealedResult = app.renderForPath("/assessment/result");
for (const exact of [
  "Тест дууслаа",
  "Таны тайлан бэлэн боллоо",
  "Бүрэн тайлангаа нээснээр жин хасахад тань хэдэн сэтгэлзүйн болон зан үйлийн хэв маяг нөлөөлж байгааг, тэдгээр нь хоорондоо хэрхэн холбогдож, бие биеэ хүчтэй болгон жин хасах зорилгод тань хэрхэн саад болж байгааг мэдэж авна.",
  "Мөн эдгээр хэв маягийг хэрхэн удирдах, хэцүү үеийг хэрхэн даван туулах болон эхэлж хэрэгжүүлэх 3 алхмын зааварчилгааг авна.",
  "Бүрэн тайланд юу багтах вэ?",
  "Тэр хэв маяг ямар нөхцөлд илэрч, яагаад жин хасалтад саад болдог тайлбар",
  "Даван туулах аргаа ойлгосноор сэтгэлзүй болон зуршлаа удирдахад илүү хялбар болно.",
  "Бүрэн тайлангаа нээх — 9,900₮",
  "Нэг удаагийн төлбөр. Төлбөр баталгаажсаны дараа бүрэн тайлан шууд нээгдэнэ."
]) assert(sealedResult.includes(exact), `sealed paywall copy missing: ${exact}`);
for (const forbidden of [
  "Нөлөөлөх хэв маяг", "Чухал уялдаа холбоо", "Таны хариултыг нэгтгэж дууслаа",
  "Нэг хэв маяг бусдаасаа илт давамгай гарсангүй", "Бүрэн тайланд нээгдэх хэсгүүд",
  "Танд нөлөөлж буй хэв маягууд", "Хэв маягуудын уялдаа холбоо", "Үр дүнгээ хадгалах",
  "Имэйлээ хадгалах", "Одоо алгасах", "patternCount", "interactionCount", "primaryPattern", "lockedSections"
]) assert(!sealedResult.includes(forbidden), `sealed paywall exposed forbidden content: ${forbidden}`);
assert.equal((sealedResult.match(/<section\b/g) || []).length, 1, "sealed paywall must contain only the generic report-contents preview");
assert.equal((sealedResult.match(/<li>/g) || []).length, 4, "sealed paywall report-contents preview must stay concise");

const requiredModuleFields = ["title", "evidenceLink", "observe", "triggerRecognition", "prepare", "inMoment", "avoidRigidDemand", "resume", "professionalHelp"];
const requiredFallbackFields = ["introduction", "resume", "softenRule", "recheckTrigger", "fitDailyLife"];
const prohibitedClaims = ["зорилгодоо заавал хүрнэ", "жин хасах нь амар болно", "нэг удаа хазайх", "хэмнэлдээ эргэн орох"];

for (const fixture of fixtures) {
  const full = reportFor(fixture.answers);
  const publicFull = publicReport(full);
  const supportedCount = full.internalEvidenceMap.patternEvidence.filter(item => item.supported).length;
  assert.equal(publicFull.managementModules.length, supportedCount || 1, `${fixture.name}: every supported pattern needs one management module, neutral needs one actionable module`);
  for (const module of publicFull.managementModules) {
    for (const field of requiredModuleFields) assert(String(module[field] || "").trim(), `${fixture.name}: management module missing ${field}`);
  }
  assert.equal(publicFull.initialActions.length, 3, `${fixture.name}: exactly three initial actions`);
  for (const [index, action] of publicFull.initialActions.entries()) {
    assert.equal(action.order, index + 1, `${fixture.name}: initial action order`);
    assert(action.patternTitle && action.action, `${fixture.name}: initial action must be attributed and actionable`);
  }
  for (const field of requiredFallbackFields) assert(String(publicFull.fallbackPlan[field] || "").trim(), `${fixture.name}: fallback missing ${field}`);
  if (publicFull.interactionSummary.length) {
    const plans = [publicFull.combinedManagementPlan, ...(publicFull.additionalInteractionManagementPlans || [])].filter(Boolean);
    assert.equal(plans.length, publicFull.interactionSummary.length, `${fixture.name}: every rendered interaction has combined guidance`);
    for (const plan of plans) for (const field of ["startWith", "why", "nextStep", "combinedAction"]) assert(String(plan[field] || "").trim(), `${fixture.name}: combined plan missing ${field}`);
  }
  for (const field of ["notice", "inMoment", "reduceTrigger", "resume"]) assert(String(publicFull.difficultMomentPlan?.[field] || "").trim(), `${fixture.name}: difficult-moment plan missing ${field}`);
  const validation = validateReportForActivation(full);
  assert.equal(validation.valid, true, `${fixture.name}: activation validation failed: ${validation.errors.join(", ")}`);
  const publicText = JSON.stringify(publicFull).toLowerCase();
  for (const phrase of prohibitedClaims) assert(!publicText.includes(phrase), `${fixture.name}: prohibited promise/artificial phrase: ${phrase}`);
  assert(!/Q-[A-Z]|S1-|MC-|emotional_regulation|environmental_cues/.test(JSON.stringify(publicFull)), `${fixture.name}: internal evidence leaked`);
}

const multi = publicReport(reportFor(fixtures[0].answers));
const sectionOrder = app._test.buildReportSections(multi).filter(section => section.visible).map(section => section.id);
assert.deepEqual(sectionOrder.slice(0, 9), [
  "overview",
  "patterns",
  "interactions",
  "context",
  "management",
  "combined-management",
  "difficult-moment",
  "initial-actions",
  "fallback"
]);
const sectionHeadings = app._test.buildReportSections(multi).filter(section => section.visible).map(section => section.heading);
for (const heading of [
  "ТАНЫ ҮР ДҮНГИЙН ТОЙМ",
  "ТАНД НӨЛӨӨЛЖ БУЙ ХЭВ МАЯГУУД",
  "ХЭВ МАЯГУУДЫН УЯЛДАА",
  "ЯМАР ҮЕД ИЛҮҮ ХҮЧТЭЙ БОЛДОГ ВЭ?",
  "ХЭВ МАЯГ БҮРИЙН НӨЛӨӨГ ХЭРХЭН УДИРДАХ ВЭ?",
  "НЭГДСЭН УДИРДАХ ДАРААЛАЛ",
  "Хэцүү үеийг хэрхэн даван туулах вэ?",
  "ЭХЭЛЖ ХЭРЭГЖҮҮЛЭХ 3 АЛХАМ",
  "Төлөвлөснөөрөө явж чадаагүй үед хэрхэн үргэлжлүүлэх вэ?"
]) assert(sectionHeadings.includes(heading), `full report structure missing: ${heading}`);

console.log("full-report core customer value and actionable-management tests passed");
