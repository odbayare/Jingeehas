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

function occurrences(text, phrase) {
  return text.split(phrase).length - 1;
}

function reportSection(index) {
  const start = `Тайлан ${index}`;
  const end = `Тайлан ${index + 1}`;
  const startIndex = userText.indexOf(start);
  assert(startIndex >= 0, `user-facing export should include ${start}`);
  const endIndex = userText.indexOf(end, startIndex + start.length);
  return userText.slice(startIndex, endIndex >= 0 ? endIndex : userText.length);
}

[
  "Route:",
  "Verdict:",
  "Selected answer summary",
  "Weight Test - хэрэглэгчид харагдах",
  "Хэрэглэгчийн унших 10 тайлан",
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
  "9,900-өөр",
  "9,900 төлж",
  "Энгийн тайлан дарагдсан",
  "механизм",
  "context",
  "route",
  "verdict",
  "checklist",
  "selected answer",
  "давтамж",
  "дохио",
  "Эхний хариу руу буцах",
  "Шинээр эхлэх",
  "Сонголт руу буцах",
  "Саналын экспорт",
  "Санал илгээх",
  "Дэлгэрэнгүй тайлан харах",
  "Доорх нь таны өгсөн мэдээллээс гарсан эхний тайлбар",
  "миний юм",
  "ганц жижиг баяр",
  "өөртөө өгөх нэг жижиг зүйл болдог",
  "биеэ зөөлөн сонсох",
  "бие, сэтгэлээ зөөлөн анзаарах",
  "кофеины хил",
  "кофеин уух цагийн хязгаар",
  "орой унтраах",
  "Удаан юм идээгүй байх үед орой өлсөлт яаралтай болдог.",
  "Удаан юм идээгүй өдөр орой өлсөлт гэнэт хүчтэй болдог.",
  "Удаан юм идээгүй байх үед орой бие яараад эхэлдэг.",
  "Хоол холдоход дараа өлсөхөөс хамгаалах гэж илүү идэх хандлага гардаг.",
  "Өдөр хоол холдох үед бие орой илүү яаралтай хариу өгч байна.",
  "орой бие хамгаалах гэж яардаг"
].forEach((phrase) => {
  assert(!userText.includes(phrase), `user-facing export should not include: ${phrase}`);
});

const userFacingTitle = "Жин хасалтын гүн зураглал — хэрэглэгчийн унших 10 тайлан";
assert(userText.includes(userFacingTitle), "user-facing export should use the final Sprint 32E title");
assert.strictEqual(occurrences(userText, userFacingTitle), 1, "user-facing export title should appear once");
assert(!userText.split(/\n/).some((line, index, lines) => line.trim() === "Тайлан" && /^Тайлан \d+$/.test((lines[index - 2] || "").trim())), "user-facing export should not keep redundant standalone report heading after numbered report heading");

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
assert(userText.includes("Тэр мөчид хоол ямар мэдрэмж өгч байна вэ?"), "user-facing export should include the polished food-function heading");
assert(userText.includes("Доорх тайлан таны хариултад тулгуурласан эхний тайлбар"), "user-facing export should include the polished intro sentence");
assert(userText.includes("Өдөржин өөрийгөө хойш тавьсан өдөр орой амттай зүйл өөртөө өгч байгаа жижигхээн шагнал шиг л санагддаг."), "user-facing export should include owner-approved self-neglect wording");
assert(userText.includes("Тухайн өдөр бие, сэтгэлээ анзаарах"), "user-facing export should include owner-approved menstrual wording");
assert(userText.includes("Удаан юм идээгүй өдөр орой гэнэт өлсөж байгаагаа анзаардаг."), "user-facing export should include owner-approved hunger-safety wording");
[
  "Өдрийн хоолны зай уртсах тусам оройн өлсөлт илүү хүчтэй мэдрэгддэг.",
  "Өдөр удаан хоосон явсны дараа оройн өлсөлт огцом нэмэгддэг.",
  "Та хоолны зай уртсах үед орой хүчтэй өлсөж, дараа дахин өлсөхөөс санаа зовдог гэж тэмдэглэсэн."
].forEach((phrase) => {
  assert(userText.includes(phrase), `user-facing export should include Sprint 32E hunger support line: ${phrase}`);
});
[
  "Өдөржин бусдын хэрэгцээ түрүүлсэн өдөр өөрийн хоол, амралт хамгийн сүүлд үлддэг.",
  "Тэр үед амттай зүйл өөртөө жаахан анхаарсан мэт мэдрэмж өгч болно.",
  "Амттай зүйл хэсэг таатай мэдрэмж өгнө"
].forEach((phrase) => {
  assert(userText.includes(phrase), `user-facing export should include Sprint 32E self-neglect support line: ${phrase}`);
});
assert.strictEqual(
  occurrences(reportSection(4), "Удаан юм идээгүй өдөр орой гэнэт өлсөж байгаагаа анзаардаг."),
  1,
  "User 04 hunger-safety canonical sentence should appear once in that report"
);
assert.strictEqual(
  occurrences(reportSection(5), "Өдөржин өөрийгөө хойш тавьсан өдөр орой амттай зүйл өөртөө өгч байгаа жижигхээн шагнал шиг л санагддаг."),
  1,
  "User 05 self-neglect canonical sentence should appear once in that report"
);
assert(
  userText.includes("Өдрийн эхний хоолоо тогтмол болго. Өдрийн сүүлийн кофегоо хэзээ уухаа тогтоо. Орой 10 минут тайвшрах хугацаа гарга."),
  "user-facing export should include owner-approved coffee/sleep wording"
);

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
assert(!userText.includes("### [REMOVED_FEATURE_REFINEMENT]"), "user-facing export should not use CTA copy as the 7-day heading");
assert(!userText.split(/\n/).some((line) => line.trim() === "[REMOVED_FEATURE_REFINEMENT]"), "user-facing export should not include standalone 7-day CTA text");

const menstrualReport = userText.split("---").find((report) => report.includes("сарын тэмдэг ирэхээс өмнөх")) || "";
assert(menstrualReport, "user-facing export should include a menstrual-cycle report");
assert(
  !(menstrualReport.includes("Нэмэлтээр анхаарах зүйл") && menstrualReport.includes("Мөчлөгтэй холбоотой анхаарах зүйл")),
  "menstrual-cycle report should not duplicate the simple and detailed cycle headings"
);
assert(!menstrualReport.split(/\n/).some((line) => line.trim() === "Сарын тэмдэг ирэхийн өмнөх өдрүүдэд"), "menstrual-cycle report should not add a separate premenstrual section after the experiment");

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
