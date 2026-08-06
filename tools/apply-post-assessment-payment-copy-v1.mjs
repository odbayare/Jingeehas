import fs from "node:fs";
import path from "node:path";

const PENDING_FROM = "QPay-аар ${PRODUCT.displayPrice} төлсний дараа таны бүрэн тайлан нээгдэнэ.";
const PENDING_TO = "QPay төлбөрөө хийсний дараа бүрэн тайлан автоматаар нээгдэнэ.";
const DUPLICATE_PAID_FROM = 'prepaid ? `<p class="notice">Төлбөр баталгаажлаа. Тест нээгдлээ.</p>` :';
const DUPLICATE_PAID_TO = 'prepaid ? "" :';

export function applyPostAssessmentPaymentCopyV1(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    let source = fs.readFileSync(appPath, "utf8");
    if (!source.includes(PENDING_TO)) {
      if (!source.includes(PENDING_FROM)) throw new Error(`Post-assessment payment copy insertion point missing: ${appPath}`);
      source = source.replace(PENDING_FROM, PENDING_TO);
    }
    if (source.includes(DUPLICATE_PAID_FROM)) source = source.replace(DUPLICATE_PAID_FROM, DUPLICATE_PAID_TO);
    fs.writeFileSync(appPath, source);
  }
}
