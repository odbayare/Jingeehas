import fs from "node:fs";
import path from "node:path";

const STRENGTH_SECTION = '      { id: "neutral-strengths", heading: "ОДОО ТАНД ТҮШИГ БОЛОХ ЗҮЙЛС", paragraphs: [renderReportParagraphs(strengths)], visible: strengths.length > 0 },';
const LIMITS_SECTION = `${STRENGTH_SECTION}\n      { id: "neutral-limits", heading: "ЭНЭ ТЕСТЭЭР ЮУГ ДҮГНЭЖ БОЛОХГҮЙ ВЭ?", paragraphs: [renderReportParagraphs(neutral.limits || [])], visible: (neutral.limits || []).length > 0 },`;

export function applyReportBuilderNeutralLimitsV1(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    const source = fs.readFileSync(appPath, "utf8");
    if (source.includes('id: "neutral-limits"')) continue;
    if (!source.includes(STRENGTH_SECTION)) throw new Error(`Neutral limits insertion point missing: ${appPath}`);
    fs.writeFileSync(appPath, source.replace(STRENGTH_SECTION, LIMITS_SECTION));
  }
}
