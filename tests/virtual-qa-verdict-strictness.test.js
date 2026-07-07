const assert = require("assert");

const forbiddenRoboticIntro = ["Тайлан", "Таны тайлан"].join(" ");
const forbiddenPaidIntro = ["Энэ бол таны", "төлбөртэй нэг удаагийн тайлан"].join(" ");

function normalize(text) {
  return String(text || "").replace(/\s+/g, " ").trim().toLowerCase();
}

function strictQaVerdict({ expectedFocus, reportText, mcMappingIssues = [], professionalRoute = false }) {
  const text = normalize(reportText);
  const issues = [];
  const hasAny = terms => terms.some(term => text.includes(term.toLowerCase()));
  if (/sleep|rhythm|circadian|нойр|хэмнэл/i.test(expectedFocus) && !hasAny(["нойр", "хэмнэл", "circadian", "тэнхээ"])) {
    issues.push("expected sleep/rhythm focus missing");
  }
  if (/cue|snack|зууш|орчны/i.test(expectedFocus) && !hasAny(["орчны", "харагдах", "зууш", "гарын дор", "апп"])) {
    issues.push("expected cue/snacking focus missing");
  }
  if (/family|caregiving|leftover|бусдын|гэр бүл/i.test(expectedFocus) && !hasAny(["бусдын хэрэгцээ", "өөрийн хоол", "хойшлогдох", "үлдэгдэл"])) {
    issues.push("expected family/caregiving focus missing");
  }
  if (mcMappingIssues.length) issues.push("MC answer mapping issue");
  if (/7\. 7–14 хоногийн туршилт[\s\S]*7\. Тайлангаа хадгалах/.test(reportText)) issues.push("report numbering jump");
  if (professionalRoute && (!reportText.includes("Тайлан хуулж авах") || !reportText.includes("Хэвлэх / PDF хадгалах"))) {
    issues.push("professional safety report missing copy/print");
  }
  if (reportText.includes(forbiddenRoboticIntro) || reportText.includes(forbiddenPaidIntro)) {
    issues.push("robotic paid intro");
  }
  return issues.length ? "FAIL" : "PASS";
}

assert.notStrictEqual(
  strictQaVerdict({ expectedFocus: "sleep/rhythm", reportText: "Стресс ихтэй үед хоол амралт шиг санагдана." }),
  "PASS",
  "mismatched sleep/rhythm focus cannot receive PASS"
);
assert.notStrictEqual(
  strictQaVerdict({ expectedFocus: "cue/snacking", reportText: "Орой хоол бодох тэнхээ дуусдаг." }),
  "PASS",
  "mismatched cue/snacking focus cannot receive PASS"
);
assert.notStrictEqual(
  strictQaVerdict({ expectedFocus: "family/caregiving", reportText: "Таатай мэдрэмж авах хэрэгцээ давамгай байна." }),
  "PASS",
  "mismatched family/caregiving focus cannot receive PASS"
);
assert.notStrictEqual(
  strictQaVerdict({ expectedFocus: "social", reportText: ["7. 7–14 хоногийн туршилт", ["7.", "Тайлангаа хадгалах"].join(" ")].join(" ... ") }),
  "PASS",
  "numbering jump cannot receive PASS"
);
assert.notStrictEqual(
  strictQaVerdict({ expectedFocus: "cycle", reportText: "Тайлан", mcMappingIssues: [{ questionId: "MC-02" }] }),
  "PASS",
  "MC answer mapping issue cannot receive PASS"
);
assert.notStrictEqual(
  strictQaVerdict({ expectedFocus: "professional", reportText: "Эхлээд мэргэжлийн хүнтэй ярилцах нь зөв байна", professionalRoute: true }),
  "PASS",
  "professional safety report missing copy/print cannot receive PASS"
);

assert.strictEqual(
  strictQaVerdict({
    expectedFocus: "cue/snacking",
    reportText: "Орчны өдөөгч, зууш нүдэнд ойр, гарын дор байгаа сонголт нөлөөлж байна. Тайлан хуулж авах. Хэвлэх / PDF хадгалах."
  }),
  "PASS",
  "matching focus with required actions can receive PASS"
);

console.log("virtual-qa-verdict-strictness tests passed");
