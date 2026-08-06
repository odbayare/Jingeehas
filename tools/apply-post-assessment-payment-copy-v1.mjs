import fs from "node:fs";
import path from "node:path";

const FROM = "QPay-аар ${PRODUCT.displayPrice} төлсний дараа таны бүрэн тайлан нээгдэнэ.";
const TO = "QPay төлбөрөө хийсний дараа бүрэн тайлан автоматаар нээгдэнэ.";

export function applyPostAssessmentPaymentCopyV1(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    const source = fs.readFileSync(appPath, "utf8");
    if (source.includes(TO)) continue;
    if (!source.includes(FROM)) throw new Error(`Post-assessment payment copy insertion point missing: ${appPath}`);
    fs.writeFileSync(appPath, source.replace(FROM, TO));
  }
}
