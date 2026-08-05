import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
execFileSync(process.execPath, ["tools/build-production.mjs"], { cwd: root, stdio: "inherit" });

const app = fs.readFileSync(path.join(root, "dist", "app.js"), "utf8");
const report = fs.readFileSync(path.join(root, ".generated-copy-hotfix", "netlify", "functions", "_lib", "report.js"), "utf8");
const functionRoot = path.join(root, ".generated-copy-hotfix", "netlify", "functions");

function allJavaScript(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...allJavaScript(absolute));
    else if (entry.isFile() && entry.name.endsWith(".js")) files.push(absolute);
  }
  return files;
}

const deployedText = [app, report, ...allJavaScript(functionRoot).map(file => fs.readFileSync(file, "utf8"))].join("\n");
const blocked = [
  "хэв маяг-ийн",
  "хэв маяг-тай",
  "нөхцөл-ийн нөхцөлийг",
  "Хүчтэй давуу тал зохиож нэмээгүй; зөвлөмжийг дэмжигдсэн хариултаар хязгаарлав.",
  "шинэ асуудал зохиохгүйгээр",
  "Дэмжигдээгүй хооллолтын асуудлыг",
  "тестийн төлбөр хийхээс өмнө сэтгэцийн эрүүл мэндийн",
  "QPay төлбөрөө хийсний дараа тест автоматаар нээгдэнэ.\n        <p class=\"payment-status\""
];
for (const phrase of blocked) {
  if (deployedText.includes(phrase)) throw new Error(`Blocked deployed copy remains: ${phrase}`);
}

const required = [
  [app, "QPay төлбөрөө хийсний дараа бүрэн тайлан автоматаар нээгдэнэ."],
  [app, "questionOptionLabel(question, option)"],
  [app, "full.neutralResult ? \"ОДОО ТОХИРЧ БУЙ ХЭМНЭЛЭЭ ХЭРХЭН ХАДГАЛАХ ВЭ?\""],
  [report, "function polishPublicText(value)"],
  [report, "Эхлээд эхний хэв маяг ямар үед илэрч байгааг ажиглаарай."],
  [deployedText, "103 дугаарт залгах"],
  [deployedText, "Таны хариултаас онцлон нэрлэх нэмэлт давуу тал одоогоор ялгараагүй байна."]
];
for (const [source, phrase] of required) {
  if (!source.includes(phrase)) throw new Error(`Required deployed copy missing: ${phrase}`);
}

const paidStatusExpression = "payment.status === \"paid\"\n    ? (prepaid ? PAYMENT_COPY.paidBeforeTest : PAYMENT_COPY.paidAfterAssessment)";
if (!app.includes(paidStatusExpression)) throw new Error("Paid status is not flow-specific.");
if (app.includes("prepaid ? `<p class=\"notice\">Төлбөр баталгаажлаа. Тест нээгдлээ.</p>`")) {
  throw new Error("Duplicate paid notice remains in payment renderer.");
}

console.log("Mongolian copy hotfix verification PASS");