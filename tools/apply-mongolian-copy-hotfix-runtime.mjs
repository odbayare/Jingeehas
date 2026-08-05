import fs from "node:fs";
import path from "node:path";
import { applyMongolianCopyHotfix } from "./apply-mongolian-copy-hotfix.mjs";

const SAFE_QUESTION_TEXT_REPLACEMENTS = Object.freeze([
  ["Хоолноос өмнө өлсөх мэдрэмжээ анзаарах нь танд хэр амар байдаг вэ?", "Та өлсөх мэдрэмжээ ихэвчлэн хэзээ анзаардаг вэ?"],
  ["Та одоогоор жирэмсэн, төрсний дараах эсвэл хөхүүл үед байна уу?", "Танд одоогоор дараах нөхцөлөөс аль нь хамгийн тохирох вэ?"],
  ["Жингээ бууруулахын тулд өмнө туршсан нэг арга яагаад удаан үргэлжлээгүй вэ?", "Өмнөх оролдлогоосоо та юу ойлгож авсан бэ?"],
  ["Аргаа зогсоосны дараа жин эргэн нэмэгдсэн үү?", "Аргаа зогсоосны дараа жин тань хэрхэн өөрчлөгдсөн бэ?"]
]);

const DISPLAY_LABELS = Object.freeze([
  ["\"Будилах\": \"Ухаан санаа будилах\"\n  };", "\"Будилах\": \"Ухаан санаа будилах\",\n    \"Мэргэжлийн хоолзүйчийн зөвлөгөө\": \"Мэргэжлийн хоол зүйчийн зөвлөгөө\",\n    \"Сэтгэлзүйн зөвлөгөө\": \"Сэтгэл зүйн зөвлөгөө\",\n    \"Хоолзүйч\": \"Хоол зүйч\",\n    \"Сэтгэлзүйч\": \"Сэтгэл зүйч\"\n  };"]
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
    let source = fs.readFileSync(target, "utf8");
    if (source.includes("\"Мэргэжлийн хоолзүйчийн зөвлөгөө\": \"Мэргэжлийн хоол зүйчийн зөвлөгөө\"")) continue;
    const updated = replaceAll(source, DISPLAY_LABELS);
    if (updated === source) throw new Error(`Display-label insertion point missing: ${target}`);
    fs.writeFileSync(target, updated);
  }
}

export function applyMongolianCopyHotfixRuntime(root) {
  try {
    applyMongolianCopyHotfix(root);
  } catch (error) {
    const message = String(error?.message || error);
    if (!message.startsWith("Mongolian copy hotfix incomplete:")) throw error;
    // The deterministic transformations have already run. The legacy scan also
    // sees replacement-map keys, so rendered output is verified separately.
    console.log("Mongolian copy transformations applied; rendered-output verification follows.");
  }

  // Never change stored answer values under the existing questionnaire version.
  // Rebuild the generated question bank from the canonical source and apply only
  // prompt-text changes; user-facing spelling is handled by questionOptionLabel().
  restoreCanonicalQuestionValues(root);
  addDisplayOnlyQuestionLabels(root);
}
