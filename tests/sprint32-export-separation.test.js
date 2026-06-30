const assert = require("assert");
const { existsSync, readFileSync } = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const userMdPath = path.join(root, "audits/sprint-32-copy-rewrite/user-facing/WEIGHT_TEST_USER_FACING_10_REPORTS.md");
const userPdfPath = path.join(root, "audits/sprint-32-copy-rewrite/user-facing/WEIGHT_TEST_USER_FACING_10_REPORTS.pdf");
const internalMdPath = path.join(root, "audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.md");
const internalPdfPath = path.join(root, "audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.pdf");
const styleBiblePath = path.join(root, "MONGOLIAN_REPORT_STYLE_BIBLE.md");

assert(existsSync(userMdPath), "Sprint 32 user-facing Markdown export should exist");
assert(existsSync(userPdfPath), "Sprint 32 user-facing PDF export should exist");
assert(existsSync(internalMdPath), "Sprint 32 internal audit Markdown export should exist");
assert(existsSync(internalPdfPath), "Sprint 32 internal audit PDF export should exist");
assert(existsSync(styleBiblePath), "Mongolian report style bible should exist");

const userText = readFileSync(userMdPath, "utf8");
const internalText = readFileSync(internalMdPath, "utf8");
const styleBible = readFileSync(styleBiblePath, "utf8");

[
  "Route:",
  "Verdict:",
  "Selected answer summary",
  "Checklist:",
  "route=True",
  "Виртуал хүний санал",
  "PASS",
  "FAIL",
  "##",
  "S1-",
  "MC-",
  "Дэлгэрэнгүй тайлан харах",
  "Энэ эхний зураглал",
  "Таны хариултаас",
  "тухайн мөчид хоол дараах хэрэгцээний нэгийг түр нөхөж",
  "шийдвэрийн ачаалал",
  "Орчин өөрөө идэх шийдвэрийг",
  "Нурах давтамж",
  "29,000-өөр",
  "29,000 төлж",
  "Энгийн тайлан дарагдсан",
  "механизм",
  "context",
  "route",
  "verdict",
  "checklist",
  "selected answer",
  "зураглал",
  "давтамж",
  "дохио"
].forEach((phrase) => {
  assert(!userText.includes(phrase), `user-facing export should not include: ${phrase}`);
});

[
  "Source reference:",
  "Strong Mongolian prose",
  "Replacement Principles",
  "What To Avoid",
  "Product-Specific Voice"
].forEach((phrase) => {
  assert(!styleBible.includes(phrase), `style bible should not keep English explanatory heading/paragraph: ${phrase}`);
});

[
  "# Монгол тайлангийн найруулгын зарчим",
  "## 1. Эхлээд амьд мөч",
  "## 2. Үйл үг өгүүлбэрийг авч явна",
  "## 4. Онош шиг биш, хүнтэй ярьж байгаа мэт"
].forEach((phrase) => {
  assert(styleBible.includes(phrase), `style bible should include Mongolian section: ${phrase}`);
});

const cyrillicChars = (styleBible.match(/[А-Яа-яӨөҮүЁё]/g) || []).length;
const asciiLetters = (styleBible.match(/[A-Za-z]/g) || []).length;
assert(cyrillicChars > asciiLetters * 8, "style bible should be overwhelmingly Mongolian");

assert(!userText.includes("Тэр үед хоол зүгээр нэг хоол биш байсан байж болно"), "user-facing export should not repeat generic food-function intro");

[
  "Тэр үед хоол сонгох биш, зүгээр амархан дуусгах зүйл хэрэгтэй болдог.",
  "Тэр үед хоол хэсэг амсхийх газар болж байна.",
  "Тэр үед хоол “нэгэнт алдсан” гэсэн дарамтаас түр холдуулах шиг болдог.",
  "Тэр үед өлссөндөө биш, нүдэнд өртсөн зүйлд гар амархан хүрч байна.",
  "Тэр үед амттай зүйл ядаргаа, сэтгэл савлах мэдрэмжийг хэсэг зөөллөх шиг санагдаж болно."
].forEach((phrase) => {
  assert(userText.includes(phrase), `user-facing export should include archetype-specific food-function intro: ${phrase}`);
});

[
  "хоол захиалах",
  "стресс",
  "өнөөдөр өнгөрлөө",
  "сарын тэмдэг ирэхээс өмнөх"
].forEach((phrase) => {
  assert(userText.includes(phrase), `user-facing export should include personal evidence phrase: ${phrase}`);
});

assert(userText.includes("7 хоногийн тэмдэглэл юуг тодруулах вэ?"), "user-facing export should use the refined 7-day heading");
assert(!userText.includes("### 7 хоногоор нарийвчлах"), "user-facing export should not use CTA copy as the 7-day heading");

const menstrualReport = userText.split("---").find((report) => report.includes("сарын тэмдэг ирэхээс өмнөх")) || "";
assert(menstrualReport, "user-facing export should include a menstrual-cycle report");
assert(
  !(menstrualReport.includes("Нэмэлтээр анхаарах зүйл") && menstrualReport.includes("Мөчлөгтэй холбоотой анхаарах зүйл")),
  "menstrual-cycle report should not duplicate the simple and detailed cycle headings"
);

[
  "Тайлан 1",
  "Товч хариу",
  "Дэлгэрэнгүй тайлан",
  "Одоо жин хасах тухай биш. Эхлээд таны аюулгүй байдал чухал."
].forEach((phrase) => {
  assert(userText.includes(phrase), `user-facing export should include: ${phrase}`);
});

[
  "internal only",
  "Route:",
  "Verdict:",
  "Selected answer summary",
  "Checklist:"
].forEach((phrase) => {
  assert(internalText.includes(phrase), `internal audit export should include: ${phrase}`);
});

console.log("sprint32-export-separation tests passed");
