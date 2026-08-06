import fs from "node:fs";
import path from "node:path";

function replaceRequired(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Low-movement editorial anchor missing: ${label}`);
  return source.replace(from, to);
}

export function applyReportEditorialLowMovementV1(root) {
  const reportPath = path.join(root, "netlify", "functions", "_lib", "report.js");
  let source = fs.readFileSync(reportPath, "utf8");
  source = replaceRequired(
    source,
    '    plan_daily_life_mismatch: "Төлөвлөгөө багтдаггүй нэг бодит нөхцөлийг сонгож ажиглаарай.",\n    previous_attempt_sustainability:',
    '    plan_daily_life_mismatch: "Төлөвлөгөө багтдаггүй нэг бодит нөхцөлийг сонгож ажиглаарай.",\n    low_movement: "Хөдөлгөөн хамгийн бага байдаг нэг давтагддаг мөчийг сонгож ажиглаарай.",\n    previous_attempt_sustainability:',
    "low-movement start body"
  );
  source = replaceRequired(
    source,
    '    plan_daily_life_mismatch: "Дараагийн алхамд завгүй өдөр ч багтах хамгийн хялбар хувилбарыг сонгоорой.",\n    previous_attempt_sustainability:',
    '    plan_daily_life_mismatch: "Дараагийн алхамд завгүй өдөр ч багтах хамгийн хялбар хувилбарыг сонгоорой.",\n    low_movement: "Дараагийн алхамд өдөр тутмын нэг үйл явдалтай холбосон богино хөдөлгөөнийг сонгоорой.",\n    previous_attempt_sustainability:',
    "low-movement next body"
  );
  source = replaceRequired(
    source,
    '    plan_daily_life_mismatch: "Өдөр тутамд багтах нэг хувилбарыг шууд туршиж болох тул үүнээс эхэлнэ.",\n    previous_attempt_sustainability:',
    '    plan_daily_life_mismatch: "Өдөр тутамд багтах нэг хувилбарыг шууд туршиж болох тул үүнээс эхэлнэ.",\n    low_movement: "Өдөр тутмын нэг үйл явдалтай богино хөдөлгөөн холбож шууд туршиж болох тул үүнээс эхэлнэ.",\n    previous_attempt_sustainability:',
    "low-movement reason"
  );
  fs.writeFileSync(reportPath, source);
}
