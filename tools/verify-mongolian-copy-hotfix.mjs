import nodeCrypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
execFileSync(process.execPath, ["tools/build-production.mjs"], { cwd: root, stdio: "inherit" });

const generatedRoot = path.join(root, ".generated-copy-hotfix");
const functionRoot = path.join(generatedRoot, "netlify", "functions");
const reportPath = path.join(functionRoot, "_lib", "report.js");
const dist = path.join(root, "dist");
const app = fs.readFileSync(path.join(dist, "app.js"), "utf8");
const reportSource = fs.readFileSync(reportPath, "utf8");

function allJavaScript(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...allJavaScript(absolute));
    else if (entry.isFile() && entry.name.endsWith(".js")) files.push(absolute);
  }
  return files;
}
function assertIncludes(source, phrase, label) {
  if (!source.includes(phrase)) throw new Error(`${label} missing: ${phrase}`);
}
function assertExcludes(source, phrase, label) {
  if (source.includes(phrase)) throw new Error(`${label} remains: ${phrase}`);
}
function assertEqual(actual, expected, label) {
  if (actual !== expected) throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
}
function assertDeepEqual(actual, expected, label) {
  assertEqual(JSON.stringify(actual), JSON.stringify(expected), label);
}
function sha256(absolute) {
  return nodeCrypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex");
}

const deployedFunctionsText = allJavaScript(functionRoot).map(file => fs.readFileSync(file, "utf8")).join("\n");
assertIncludes(app, "QPay төлбөрөө хийсний дараа бүрэн тайлан автоматаар нээгдэнэ.", "Post-assessment pending copy");
assertIncludes(app, "questionOptionLabel(question, option)", "Displayed option normalization");
assertIncludes(app, "\"Мэргэжлийн хоолзүйчийн зөвлөгөө\": \"Мэргэжлийн хоол зүйчийн зөвлөгөө\"", "Display-only professional label");
assertIncludes(app, "НЭГ ЗҮЙЛИЙГ ӨӨРЧЛӨХГҮЙГЭЭР АЖИГЛАХ АРГА", "Dedicated neutral observation heading");
assertIncludes(app, "ТӨЛӨВЛӨГӨӨ АЛДАГДСАН ҮЕД ХЭРХЭН ҮРГЭЛЖЛҮҮЛЭХ ВЭ?", "Unified recovery heading");
assertIncludes(app, "ХЭВ МАЯГ БҮРТ ЯАЖ ХАНДАХ ВЭ?", "Editorial management heading");
assertIncludes(reportSource, "jingeehas-case-formulation-v8-editorial-polish", "Editorial report version");
assertIncludes(reportSource, "function polishPublicText(value)", "Public copy sanitizer");
assertIncludes(reportSource, "Хоолны зайг нэг өдрийн дотор ажиглаж", "Editorial combined-plan reason");
assertIncludes(deployedFunctionsText, "103 дугаарт залгах", "Emergency action copy");

assertExcludes(app, "const statusCopy = payment.status === \"paid\" ? PAYMENT_COPY.paidBeforeTest", "Flow-agnostic paid status");
assertExcludes(app, "prepaid ? `<p class=\"notice\">Төлбөр баталгаажлаа. Тест нээгдлээ.</p>`", "Duplicate paid notice");
assertExcludes(app, "Хүчтэй давуу тал зохиож нэмээгүй; зөвлөмжийг дэмжигдсэн хариултаар хязгаарлав.", "Internal QA fallback in rendered app");
assertExcludes(deployedFunctionsText, "тестийн төлбөр хийхээс өмнө сэтгэцийн эрүүл мэндийн", "Commercial language in safety route");
assertExcludes(reportSource, "why: `${primary.title}-ийн", "Raw dynamic-title inflection");
assertExcludes(reportSource, "triggerRecognition: `${observe} ${pattern.title}", "Raw title insertion in trigger recognition");
assertExcludes(reportSource, "evidenceLink: `${evidenceAnchor}; шинэ асуудал зохиохгүйгээр", "Neutral QA-language assembly");
assertExcludes(reportSource, "Дараа нь хоёр дахь нөлөө мөн тэр үед давхцаж байгаа эсэхийг шалгана.", "Repeated generic combined-plan sentence");
assertExcludes(reportSource, "хамгаалах хүчин зүйл", "Technical protective terminology");
assertExcludes(reportSource, "хэрэгжүүлэх босго", "Technical implementation terminology");
assertExcludes(reportSource, "суурь зураглал", "Technical report-use terminology");

const sourceQuestions = require(path.join(root, "questions.js"));
const deployedQuestions = require(path.join(dist, "questions.js"));
assertEqual(deployedQuestions.QUESTIONNAIRE_VERSION, sourceQuestions.QUESTIONNAIRE_VERSION, "Questionnaire version preservation");
assertEqual(deployedQuestions.LEGACY_QUESTIONNAIRE_VERSION, sourceQuestions.LEGACY_QUESTIONNAIRE_VERSION, "Legacy questionnaire version preservation");
for (const sourceQuestion of sourceQuestions.QUESTIONS) {
  const deployedQuestion = deployedQuestions.QUESTIONS.find(item => item.id === sourceQuestion.id);
  if (!deployedQuestion) throw new Error(`Deployed question missing: ${sourceQuestion.id}`);
  assertDeepEqual(deployedQuestion.options || [], sourceQuestion.options || [], `Canonical option values changed for ${sourceQuestion.id}`);
}
assertEqual(deployedQuestions.questionById("Q-HUNGER").text, "Та өлсөх мэдрэмжээ ихэвчлэн хэзээ анзаардаг вэ?", "Safe question-text update");
assertEqual(deployedQuestions.questionById("Q-METHOD-REGAIN").text, "Аргаа зогсоосны дараа жин тань хэрхэн өөрчлөгдсөн бэ?", "Regain question wording");

const manifestPath = path.join(dist, "production-package-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
assertEqual(manifest.schemaVersion, 2, "Production manifest schema");
if (!(manifest.functionFiles || []).length) throw new Error("Production manifest contains no generated function hashes");
for (const item of manifest.staticFiles || []) assertEqual(item.sha256, sha256(path.join(dist, item.file)), `Static deploy hash ${item.file}`);
for (const item of manifest.functionFiles || []) assertEqual(item.sha256, sha256(path.join(functionRoot, item.file)), `Function deploy hash ${item.file}`);

const { publicReport } = require(reportPath);
const rendered = publicReport({
  caseSeams: "хэв маяг-ийн нөхцөлийг хэв маяг-тай харьцуулж, нөхцөл-ийн нөлөөг ажиглана.",
  qaLeakage: "Хүчтэй давуу тал зохиож нэмээгүй; зөвлөмжийг дэмжигдсэн хариултаар хязгаарлав.",
  unsupportedLeakage: "Дэмжигдээгүй хооллолтын асуудлыг засах шинэ дүрэм нэмэхгүй.",
  instructions: ["тэмдэглэ.", "сонго.", "үргэлжлүүл.", "хэт хязгаарлахгүй бай."]
});
assertEqual(rendered.caseSeams, "хэв маягийн нөхцөлийг хэв маягтай харьцуулж, нөхцөлийн нөлөөг ажиглана.", "Rendered Mongolian case seams");
assertEqual(rendered.qaLeakage, "Таны хариултаас онцлон нэрлэх нэмэлт давуу тал одоогоор ялгараагүй байна.", "Rendered QA leakage removal");
assertEqual(rendered.unsupportedLeakage, "Хооллолтод шинэ хориг, шаардлагагүй дүрэм нэмэхгүй.", "Rendered unsupported-language removal");
assertEqual(rendered.instructions[0], "тэмдэглээрэй.", "Polite instruction: тэмдэглэх");
assertEqual(rendered.instructions[1], "сонгоорой.", "Polite instruction: сонгох");
assertEqual(rendered.instructions[2], "үргэлжлүүлээрэй.", "Polite instruction: үргэлжлүүлэх");
assertEqual(rendered.instructions[3], "хэт хязгаарлахгүй байгаарай.", "Polite negative instruction");

console.log("Mongolian copy and V8 editorial verification PASS");
