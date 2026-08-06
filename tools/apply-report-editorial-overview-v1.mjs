import fs from "node:fs";
import path from "node:path";

const OVERVIEW = `function renderEditorialResultOverviewV8(full) {
  const allPatterns = [
    ...(full.influencingPatterns || []).map(item => ({ title: item.title })),
    ...(full.contextualFactors || []).filter(item => item.isPattern).map(item => ({ title: item.title }))
  ];
  const primary = allPatterns[0];
  const supporting = allPatterns.slice(1);
  const dailyContexts = (full.contextualFactors || []).filter(item => !item.isPattern);
  const strengths = [
    full.protectiveSectionSummary,
    ...(!full.protectiveSectionSummary ? (full.protectiveFactors || []).map(item => item.text) : []),
    ...(full.contradictions || []).map(item => item.text)
  ].filter(Boolean);
  return \`${renderReportParagraphs(Array.isArray(full.overallPicture) ? full.overallPicture : [full.overallPicture])}
    <dl class="result-overview">
      <dt>Хамгийн тод харагдсан хэв маяг</dt><dd>\${escapeHtml(primary?.title || "Нэг хэв маягийг дангаар нь гол гэж хатуу дүгнээгүй.")}</dd>
      <dt>Дагалдах хэв маяг</dt><dd>\${escapeHtml(supporting.length ? supporting.map(item => item.title).join(" · ") : "Нэмэлт дагалдах хэв маяг хүчтэй ялгараагүй.")}</dd>
      <dt>Өдөр тутам нөлөөлөх нөхцөл</dt><dd>\${escapeHtml(dailyContexts.length ? dailyContexts.map(item => item.title).join(" · ") : "Тусад нь нэрлэх нэмэлт нөхцөл ялгараагүй.")}</dd>
      <dt>Түшиг болох давуу тал</dt><dd>\${escapeHtml(strengths.length ? strengths.join(" ") : "Нэмэлт давуу тал хүчтэй ялгараагүй.")}</dd>
    </dl>\`;
}`;

function replaceRequired(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Editorial overview anchor missing: ${label}`);
  return source.replace(from, to);
}

export function applyReportEditorialOverviewV1(root) {
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    let source = fs.readFileSync(appPath, "utf8");
    if (!source.includes("function renderEditorialResultOverviewV8(")) {
      source = replaceRequired(source, "function buildSemanticReportSectionsV7(full) {", `${OVERVIEW}\n\nfunction buildSemanticReportSectionsV7(full) {`, "V8 overview insertion");
    }
    source = replaceRequired(
      source,
      '{ id: "overview", heading: "ТАНЫ ҮР ДҮНГИЙН ТОЙМ", paragraphs: [renderResultOverview(full)], visible: true },',
      '{ id: "overview", heading: "ТАНЫ ҮР ДҮНГИЙН ТОЙМ", paragraphs: [editorialV8 ? renderEditorialResultOverviewV8(full) : renderResultOverview(full)], visible: true },',
      "V8 overview renderer selection"
    );
    fs.writeFileSync(appPath, source);
  }
}
