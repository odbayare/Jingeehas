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
  return \`\${renderReportParagraphs(Array.isArray(full.overallPicture) ? full.overallPicture : [full.overallPicture])}
    <dl class="result-overview">
      <dt>Хамгийн тод харагдсан хэв маяг</dt><dd>\${escapeHtml(primary?.title || "Нэг хэв маягийг дангаар нь гол гэж хатуу дүгнээгүй.")}</dd>
      <dt>Дагалдах хэв маяг</dt><dd>\${escapeHtml(supporting.length ? supporting.map(item => item.title).join(" · ") : "Нэмэлт дагалдах хэв маяг хүчтэй ялгараагүй.")}</dd>
      <dt>Өдөр тутам нөлөөлөх нөхцөл</dt><dd>\${escapeHtml(dailyContexts.length ? dailyContexts.map(item => item.title).join(" · ") : "Тусад нь нэрлэх нэмэлт нөхцөл ялгараагүй.")}</dd>
      <dt>Түшиг болох давуу тал</dt><dd>\${escapeHtml(strengths.length ? strengths.join(" ") : "Нэмэлт давуу тал хүчтэй ялгараагүй.")}</dd>
    </dl>\`;
}`;

function namedFunctionRange(source, name) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Editorial overview function missing: ${name}`);
  const braceStart = source.indexOf("{", start + marker.length);
  if (braceStart < 0) throw new Error(`Editorial overview body missing: ${name}`);
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (lineComment) { if (char === "\n") lineComment = false; continue; }
    if (blockComment) { if (char === "*" && next === "/") { blockComment = false; index += 1; } continue; }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (char === "\\") { escaped = true; continue; }
      if (char === quote) quote = null;
      continue;
    }
    if (char === "/" && next === "/") { lineComment = true; index += 1; continue; }
    if (char === "/" && next === "*") { blockComment = true; index += 1; continue; }
    if (char === "\"" || char === "'" || char === "`") { quote = char; continue; }
    if (char === "{") depth += 1;
    if (char === "}" && --depth === 0) return { start, end: index + 1, text: source.slice(start, index + 1) };
  }
  throw new Error(`Editorial overview function end missing: ${name}`);
}

function replaceRequired(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Editorial overview anchor missing: ${label}`);
  return source.replace(from, to);
}

export function applyReportEditorialOverviewV1(root) {
  const legacyOverview = '{ id: "overview", heading: "ТАНЫ ҮР ДҮНГИЙН ТОЙМ", paragraphs: [renderResultOverview(full)], visible: true },';
  const editorialOverview = '{ id: "overview", heading: "ТАНЫ ҮР ДҮНГИЙН ТОЙМ", paragraphs: [editorialV8 ? renderEditorialResultOverviewV8(full) : renderResultOverview(full)], visible: true },';
  for (const appPath of [path.join(root, "app.js"), path.join(root, "site", "app.js")]) {
    if (!fs.existsSync(appPath)) continue;
    let source = fs.readFileSync(appPath, "utf8");
    const range = namedFunctionRange(source, "buildSemanticReportSectionsV7");
    let semantic = range.text;
    semantic = replaceRequired(semantic, legacyOverview, editorialOverview, "V8 overview renderer selection");
    source = `${source.slice(0, range.start)}${semantic}${source.slice(range.end)}`;
    if (!source.includes("function renderEditorialResultOverviewV8(")) {
      const semanticStart = source.indexOf("function buildSemanticReportSectionsV7(");
      if (semanticStart < 0) throw new Error("V8 semantic renderer insertion point missing");
      source = `${source.slice(0, semanticStart)}${OVERVIEW}\n\n${source.slice(semanticStart)}`;
    }
    fs.writeFileSync(appPath, source);
  }
}
