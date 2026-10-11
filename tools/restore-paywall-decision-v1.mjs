import fs from "node:fs";
import path from "node:path";

function findFunctionBounds(source, name) {
  const markers = [`function ${name}(`, `async function ${name}(`];
  let start = -1;
  for (const marker of markers) {
    start = source.indexOf(marker);
    if (start >= 0) break;
  }
  if (start < 0) throw new Error(`Paywall repair function missing: ${name}`);
  const braceStart = source.indexOf("{", start);
  if (braceStart < 0) throw new Error(`Paywall repair function body missing: ${name}`);

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
    if (char === "}" && --depth === 0) return { start, end: index + 1 };
  }
  throw new Error(`Paywall repair function end missing: ${name}`);
}

function extractFunction(source, name) {
  const { start, end } = findFunctionBounds(source, name);
  return source.slice(start, end);
}

function replaceFunction(source, name, replacement) {
  const { start, end } = findFunctionBounds(source, name);
  return `${source.slice(0, start)}${replacement}${source.slice(end)}`;
}

function restoreOne(sourcePath, generatedPath) {
  if (!fs.existsSync(sourcePath) || !fs.existsSync(generatedPath)) return false;
  const source = fs.readFileSync(sourcePath, "utf8");
  let generated = fs.readFileSync(generatedPath, "utf8");
  const canonical = extractFunction(source, "reportPaywallContent");

  if (canonical.includes("renderPersonalizedConversionProof(")) {
    throw new Error(`Canonical source paywall unexpectedly contains Sep5 count-teaser presentation: ${sourcePath}`);
  }
  if (!canonical.includes('data-action="continue-to-payment"')) {
    throw new Error(`Canonical source paywall CTA missing: ${sourcePath}`);
  }
  if (!canonical.includes('"БҮРЭН ТАЙЛАНГАА НЭЭХ"')) {
    throw new Error(`Canonical source paywall CTA copy drifted: ${sourcePath}`);
  }
  if (!generated.includes("function renderPersonalizedConversionProof(")) {
    throw new Error(`Expected Sep5 conversion runtime missing before corrective restore: ${generatedPath}`);
  }
  if (!generated.includes("QPay-аар ${PRODUCT.displayPrice} төлөх")) {
    throw new Error(`Optimized QPay checkout missing before corrective restore: ${generatedPath}`);
  }

  generated = replaceFunction(generated, "reportPaywallContent", canonical);
  if (extractFunction(generated, "reportPaywallContent") !== canonical) {
    throw new Error(`Paywall restore verification failed: ${generatedPath}`);
  }
  if (!generated.includes("QPay-аар ${PRODUCT.displayPrice} төлөх")) {
    throw new Error(`Paywall restore accidentally removed optimized QPay checkout: ${generatedPath}`);
  }
  fs.writeFileSync(generatedPath, generated);
  return true;
}

export function restorePaywallDecisionV1(sourceRoot, generatedRoot) {
  let restored = 0;
  for (const relative of ["app.js", path.join("site", "app.js")]) {
    if (restoreOne(path.join(sourceRoot, relative), path.join(generatedRoot, relative))) restored += 1;
  }
  if (!restored) throw new Error("No generated app was available for paywall corrective restore");
}
