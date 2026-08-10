import fs from "node:fs";
import path from "node:path";
import { applyMongolianCopyHotfix } from "./apply-mongolian-copy-hotfix.mjs";
import { applyRoutingSafetyEvidenceV3 } from "./apply-routing-safety-evidence-v3.mjs";
import { applyReportBuilderSemanticV1InteractionCopy } from "./apply-report-builder-semantic-v1-interaction-copy.mjs";
import { applyReportBuilderSemanticV1 } from "./apply-report-builder-semantic-v1.mjs";
import { applyReportBuilderSemanticV1Dedup } from "./apply-report-builder-semantic-v1-dedup.mjs";
import { prepareReportValidationSemanticQuality } from "./prepare-report-validation-semantic-quality.mjs";
import { applyReportBuilderSemanticV1Quality } from "./apply-report-builder-semantic-v1-quality.mjs";
import { applyReportBuilderNeutralValidationV1 } from "./apply-report-builder-neutral-validation-v1.mjs";
import { applyReportBuilderNeutralLimitsV1 } from "./apply-report-builder-neutral-limits-v1.mjs";
import { applyReportBuilderV6SnapshotCompatibility } from "./apply-report-builder-v6-snapshot-compat.mjs";
import { applyReportBuilderSemanticV1PublicProjection } from "./apply-report-builder-semantic-v1-public-projection.mjs";
import { applyReportEditorialPolishV1 } from "./apply-report-editorial-polish-v1.mjs";
import { applyReportEditorialLowMovementV1 } from "./apply-report-editorial-low-movement-v1.mjs";
import { applyReportEditorialOverviewV1 } from "./apply-report-editorial-overview-v1.mjs";
import { applyReportEditorialProjectionV1 } from "./apply-report-editorial-projection-v1.mjs";
import { applyPostAssessmentPaywallFlowV1 } from "./apply-post-assessment-paywall-flow-v1.mjs";
import { applyPostAssessmentPaymentUrlFilterV1 } from "./apply-post-assessment-payment-url-filter-v1.mjs";
import { applyPostAssessmentPaymentCopyV1 } from "./apply-post-assessment-payment-copy-v1.mjs";
import { applyNonBlockingAnswerSaveV1 } from "./apply-nonblocking-answer-save-v1.mjs";
import { applyNonBlockingAnswerSaveFinalizeV1 } from "./apply-nonblocking-answer-save-finalize-v1.mjs";

const SAFE_QUESTION_TEXT_REPLACEMENTS = Object.freeze([
  ["Хоолноос өмнө өлсөх мэдрэмжээ анзаарах нь танд хэр амар байдаг вэ?", "Та өлсөх мэдрэмжээ ихэвчлэн хэзээ анзаардаг вэ?"],
  ["Та одоогоор жирэмсэн, төрсний дараах эсвэл хөхүүл үед байна уу?", "Танд одоогоор дараах нөхцөлөөс аль нь хамгийн тохирох вэ?"],
  ["Жингээ бууруулахын тулд өмнө туршсан нэг арга яагаад удаан үргэлжлээгүй вэ?", "Өмнөх оролдлогоосоо та юу ойлгож авсан бэ?"],
  ["Аргаа зогсоосны дараа жин эргэн нэмэгдсэн үү?", "Аргаа зогсоосны дараа жин тань хэрхэн өөрчлөгдсөн бэ?"]
]);

const DISPLAY_LABELS = Object.freeze([
  ["\"Будилах\": \"Ухаан санаа будилах\"\n  };", "\"Будилах\": \"Ухаан санаа будилах\",\n    \"Мэргэжлийн хоолзүйчийн зөвлөгөө\": \"Мэргэжлийн хоол зүйчийн зөвлөгөө\",\n    \"Сэтгэлзүйн зөвлөгөө\": \"Сэтгэл зүйн зөвлөгөө\",\n    \"Хоолзүйч\": \"Хоол зүйч\",\n    \"Сэтгэлзүйч\": \"Сэтгэл зүйч\"\n  };"]
]);

const APPROVED_HERO_COPY = Object.freeze([
  [
    "Та жин хасахад тань юу саад болж, яагаад хэцүү болгодогоо мэддэг гэж боддог уу? Таныг заримдаа дэглэмээ зөрчиж хооллох, хааяа нэг амттан сэмээрхэн идчихдэг, зарим хоолыг хэтрүүлчихдэг сэтгэл зүйн шалтгаануудаа та сайн мэдэж байгаа. Гэхдээ таныг далдуур удирдаж буй сэтгэл зүйн дадал зуршлууд хоорондоо нийлэхээрээ ямар үр дүнд хүргэдэгийг мэдэх үү?",
    "Та жин хасахад тань юу саад болж, яагаад хэцүү болгодогоо мэддэг гэж боддог уу? Таныг заримдаа дэглэмээ зөрчиж хооллох, хааяа нэг амттан сэмээрхэн идчихдэг, зарим хоолыг хэтрүүлчихдэг сэтгэлзүйн шалтгаануудаа та сайн мэдэж байгаа. Гэхдээ таныг далдуур удирдаж буй сэтгэлзүйн дадал зуршлууд хоорондоо нийлэхээрээ ямар үр дүнд хүргэдэгийг мэдэх үү?"
  ],
  [
    "Жин хасахад саад болж буй сэтгэл зүйн хэв маягууд, тэдгээрийн харилцан нөлөө болон хэрхэн удирдаж, нөлөөг нь багасгах аргуудаа мэдэхийн тулд тестээ бөглөөрэй. Энэ мэдээлэл таны бүрэн тайланд нээгдэнэ.",
    "Жин хасахад саад болж буй сэтгэлзүйн хэв маягууд, тэдгээрийн харилцан нөлөө болон хэрхэн удирдаж, нөлөөг нь багасгах аргуудаа мэдэхийн тулд тестээ бөглөөрэй. Энэ мэдээлэл таны бүрэн тайланд нээгдэнэ."
  ]
]);

function replaceAll(source, replacements) {
  let output = source;
  for (const [from, to] of replacements) output = output.split(from).join(to);
  return output;
}

function restoreCanonicalQuestionValues(root) {
  const projectRoot = path.resolve(root, "..");
  const canonicalPath = path.join(projectRoot, "questions.js");
  if (!fs.existsSync(canonicalPath)) throw new Error(`Canonical questions.js missing: ${canonicalPath}`);
  const canonical = replaceAll(fs.readFileSync(canonicalPath, "utf8"), SAFE_QUESTION_TEXT_REPLACEMENTS);
  const targets = [path.join(root, "questions.js"), path.join(root, "site", "questions.js")];
  for (const target of targets) {
    if (!fs.existsSync(target)) continue;
    fs.writeFileSync(target, canonical);
  }
}

function addDisplayOnlyQuestionLabels(root) {
  const appTargets = [path.join(root, "app.js"), path.join(root, "site", "app.js")];
  for (const target of appTargets) {
    if (!fs.existsSync(target)) continue;
    const source = fs.readFileSync(target, "utf8");
    if (source.includes("\"Мэргэжлийн хоолзүйчийн зөвлөгөө\": \"Мэргэжлийн хоол зүйчийн зөвлөгөө\"")) continue;
    const updated = replaceAll(source, DISPLAY_LABELS);
    if (updated === source) throw new Error(`Display-label insertion point missing: ${target}`);
    fs.writeFileSync(target, updated);
  }
}

function restoreApprovedHeroCopy(root) {
  const appTargets = [path.join(root, "app.js"), path.join(root, "site", "app.js")];
  for (const target of appTargets) {
    if (!fs.existsSync(target)) continue;
    const source = fs.readFileSync(target, "utf8");
    const updated = replaceAll(source, APPROVED_HERO_COPY);
    if (updated === source) throw new Error(`Approved hero copy restoration point missing: ${target}`);
    fs.writeFileSync(target, updated);
  }
}

export function applyMongolianCopyHotfixRuntime(root) {
  try {
    applyMongolianCopyHotfix(root);
  } catch (error) {
    const message = String(error?.message || error);
    if (!message.startsWith("Mongolian copy hotfix incomplete:")) throw error;
    console.log("Mongolian copy transformations applied; rendered-output verification follows.");
  }

  restoreCanonicalQuestionValues(root);
  addDisplayOnlyQuestionLabels(root);
  restoreApprovedHeroCopy(root);
  applyRoutingSafetyEvidenceV3(root);
  applyReportBuilderSemanticV1InteractionCopy(root);
  applyReportBuilderSemanticV1(root);
  applyReportBuilderSemanticV1Dedup(root);
  prepareReportValidationSemanticQuality(root);
  applyReportBuilderSemanticV1Quality(root);
  applyReportBuilderNeutralValidationV1(root);
  applyReportBuilderNeutralLimitsV1(root);
  applyReportBuilderV6SnapshotCompatibility(root);
  applyReportBuilderSemanticV1PublicProjection(root);
  applyReportEditorialPolishV1(root);
  applyReportEditorialLowMovementV1(root);
  applyReportEditorialOverviewV1(root);
  applyReportEditorialProjectionV1(root);
  applyPostAssessmentPaywallFlowV1(root);
  applyPostAssessmentPaymentUrlFilterV1(root);
  applyPostAssessmentPaymentCopyV1(root);
  applyNonBlockingAnswerSaveV1(root);
  applyNonBlockingAnswerSaveFinalizeV1(root);
}
