const assert = require("assert");
const { existsSync, readFileSync } = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const userMdPath = path.join(root, "audits/sprint-32-copy-rewrite/user-facing/WEIGHT_TEST_USER_FACING_10_REPORTS.md");
const userPdfPath = path.join(root, "audits/sprint-32-copy-rewrite/user-facing/WEIGHT_TEST_USER_FACING_10_REPORTS.pdf");
const internalMdPath = path.join(root, "audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.md");
const internalPdfPath = path.join(root, "audits/sprint-32-copy-rewrite/internal-audit/WEIGHT_TEST_INTERNAL_AUDIT_10_REPORTS.pdf");

assert(existsSync(userMdPath), "Sprint 32 user-facing Markdown export should exist");
assert(existsSync(userPdfPath), "Sprint 32 user-facing PDF export should exist");
assert(existsSync(internalMdPath), "Sprint 32 internal audit Markdown export should exist");
assert(existsSync(internalPdfPath), "Sprint 32 internal audit PDF export should exist");

const userText = readFileSync(userMdPath, "utf8");
const internalText = readFileSync(internalMdPath, "utf8");

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
