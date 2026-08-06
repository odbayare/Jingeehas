import fs from "node:fs";
import path from "node:path";

const FROM = '/^https:\/\//.test(String(item.link || item.url || ""))';
const TO = 'String(item.link || item.url || "").startsWith("https://")';

export function applyPostAssessmentPaymentUrlFilterV1(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    const source = fs.readFileSync(appPath, "utf8");
    if (source.includes(TO)) continue;
    if (!source.includes(FROM)) throw new Error(`Payment URL filter insertion point missing: ${appPath}`);
    fs.writeFileSync(appPath, source.replace(FROM, TO));
  }
}
