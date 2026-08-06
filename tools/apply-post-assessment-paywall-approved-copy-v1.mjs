import fs from "node:fs";
import path from "node:path";

const FROM = "Хэд хэдэн хэв маяг зэрэг илэрсэн бол тэдгээрийн уялдааг тайлбарлана.";
const TO = "Хэд хэдэн хэв маяг зэрэг илэрсэн бол тэдгээрийн уялдаа холбоог мөн тайлбарлана.";

export function applyPostAssessmentPaywallApprovedCopyV1(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    const source = fs.readFileSync(appPath, "utf8");
    if (source.includes(TO)) continue;
    if (!source.includes(FROM)) throw new Error(`Approved paywall copy insertion point missing: ${appPath}`);
    fs.writeFileSync(appPath, source.replace(FROM, TO));
  }
}
