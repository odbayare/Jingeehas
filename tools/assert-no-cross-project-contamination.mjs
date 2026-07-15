import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const token = process.env.CROSS_PROJECT_FORBIDDEN_TOKEN;
if (!token) throw new Error("CROSS_PROJECT_FORBIDDEN_TOKEN is required at runtime");

const forbidden = [token, `${token}.live`];
const findings = [];
const generatedPrefixes = ["artifacts/", "mongolian-copy-review-packs/"];
const generatedNames = new Set([
  "MONGOLIAN_COPY_RAW_LITERAL_INVENTORY.md", "MONGOLIAN_COPY_REVIEW_CATALOG.md",
  "MONGOLIAN_COPY_DUPLICATE_INDEX.md", "MONGOLIAN_COPY_SURFACE_COVERAGE.md",
  "MONGOLIAN_COPY_ENGINEERING_VALIDATION.md", "MONGOLIAN_COPY_EXCLUDED_INTERNAL_STRINGS.md"
]);

function decodeHtml(value) {
  const named = { amp: "&", apos: "'", quot: '"', lt: "<", gt: ">", period: "." };
  return value.replace(/&#(?:x([0-9a-f]+)|(\d+));?|&([a-z]+);/gi, (match, hex, dec, name) => {
    if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
    if (dec) return String.fromCodePoint(Number.parseInt(dec, 10));
    return named[name.toLowerCase()] ?? match;
  });
}

function decodeEscapes(value) {
  return value
    .replace(/\\u\{([0-9a-f]+)\}/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/\\u([0-9a-f]{4})/gi, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    .replace(/\\x([0-9a-f]{2})/gi, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    .replace(/\\([\\'"`])/g, "$1");
}

function decodedForms(value) {
  const forms = new Set([String(value)]);
  for (let pass = 0; pass < 3; pass += 1) {
    for (const current of [...forms]) {
      forms.add(decodeEscapes(current));
      forms.add(decodeHtml(current));
      try { forms.add(decodeURIComponent(current)); } catch {}
    }
  }
  return [...forms];
}

function containsForbidden(value) {
  return decodedForms(value).some(form => forbidden.some(item => form.toLowerCase().includes(item.toLowerCase())));
}

function record(kind, file, location = "") {
  findings.push({ kind, file, location, generated: generatedPrefixes.some(prefix => file.startsWith(prefix)) || generatedNames.has(file) });
}

function visitJson(value, file, location = "$") {
  if (typeof value === "string") {
    if (containsForbidden(value)) record("parsed_json", file, location);
    return;
  }
  if (Array.isArray(value)) return value.forEach((item, index) => visitJson(item, file, `${location}[${index}]`));
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (containsForbidden(key)) record("parsed_json", file, `${location} key`);
      visitJson(item, file, `${location}.${key}`);
    }
  }
}

function inspectJavaScript(text, file) {
  const literalRe = /(["'`])((?:\\[\s\S]|(?!\1)[^\\])*)\1/g;
  const literals = [];
  for (const match of text.matchAll(literalRe)) {
    const decoded = decodedForms(match[2]);
    literals.push({ start: match.index, end: match.index + match[0].length, decoded });
    if (decoded.some(containsForbidden)) record("decoded_javascript", file, `offset ${match.index}`);
  }
  for (let index = 0; index < literals.length; index += 1) {
    let combined = literals[index].decoded[0];
    let end = literals[index].end;
    for (let next = index + 1; next < literals.length; next += 1) {
      const between = text.slice(end, literals[next].start);
      if (!/^\s*\+\s*$/.test(between)) break;
      combined += literals[next].decoded[0];
      end = literals[next].end;
      if (containsForbidden(combined)) record("decoded_javascript", file, `concatenation offset ${literals[index].start}`);
    }
  }
}

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], { cwd: root })
  .toString("utf8").split("\0").filter(Boolean);

for (const file of files) {
  if (file.startsWith(".git/") || file.startsWith("node_modules/")) continue;
  const target = path.join(root, file);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) continue;
  const buffer = fs.readFileSync(target);
  if (buffer.includes(0)) continue;
  const text = buffer.toString("utf8");
  if (containsForbidden(text)) record("raw_or_common_encoding", file);
  if (file.endsWith(".json")) {
    try { visitJson(JSON.parse(text), file); }
    catch (error) { throw new Error(`Invalid JSON in ${file}: ${error.message}`); }
  }
  if (/\.(?:js|mjs|cjs)$/.test(file)) inspectJavaScript(text, file);
}

const counts = {
  raw_occurrences: findings.filter(item => item.kind === "raw_or_common_encoding").length,
  parsed_json_occurrences: findings.filter(item => item.kind === "parsed_json").length,
  decoded_javascript_occurrences: findings.filter(item => item.kind === "decoded_javascript").length,
  generated_occurrences: findings.filter(item => item.generated).length,
  final_total: findings.length
};

if (findings.length) {
  console.error(JSON.stringify({ counts, findings }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(counts, null, 2));

export { containsForbidden, decodeEscapes, decodeHtml, visitJson, inspectJavaScript };
