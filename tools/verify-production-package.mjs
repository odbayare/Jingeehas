import nodeCrypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { REQUIRED_PRODUCTION_FUNCTIONS } from "./required-production-functions.mjs";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dist = path.join(root, "dist");
const functionRoot = path.join(root, ".generated-copy-hotfix", "netlify", "functions");
execFileSync(process.execPath, ["tools/build-production.mjs"], { cwd: root, stdio: "inherit" });
execFileSync(process.execPath, ["tools/verify-removed-product.mjs"], { cwd: root, stdio: "inherit" });
execFileSync(process.execPath, ["tools/generate-production-manifest.mjs", "--check"], { cwd: root, stdio: "inherit" });

const manifestPath = path.join(dist, "production-package-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const manifestFunctions = new Set(manifest.serverFunctions || []);
const failures = [];
const sha256 = absolute => nodeCrypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex");

for (const item of manifest.staticFiles || []) {
  const absolute = path.join(dist, item.file);
  if (!fs.existsSync(absolute)) failures.push(`manifest static file missing: ${item.file}`);
  else if (sha256(absolute) !== item.sha256) failures.push(`manifest static hash mismatch: ${item.file}`);
}
for (const item of manifest.functionFiles || []) {
  const absolute = path.join(functionRoot, item.file);
  if (!fs.existsSync(absolute)) failures.push(`manifest function file missing: ${item.file}`);
  else if (sha256(absolute) !== item.sha256) failures.push(`manifest function hash mismatch: ${item.file}`);
}
for (const name of REQUIRED_PRODUCTION_FUNCTIONS) {
  if (!manifestFunctions.has(name)) failures.push(`required function absent from deployed manifest: ${name}`);
  if (!fs.existsSync(path.join(functionRoot, `${name}.js`))) failures.push(`required generated function missing: ${name}`);
}

const distFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else distFiles.push(absolute);
  }
}
walk(dist);
const publicText = distFiles.filter(file => !/\.(?:png|jpg|jpeg|gif|webp)$/i.test(file)).map(file => fs.readFileSync(file, "utf8")).join("\n");
for (const forbidden of ["mockBackend.js", "MockBackend", "internalTest", "localStorage", "oneTimePaid", "feedback-export", "META_CAPI_ACCESS_TOKEN"]) {
  if (publicText.includes(forbidden)) failures.push(`forbidden public signal: ${forbidden}`);
}
const headers = fs.readFileSync(path.join(dist, "_headers"), "utf8");
for (const required of ["Content-Security-Policy", "Referrer-Policy", "X-Content-Type-Options", "frame-ancestors", "Permissions-Policy", "Strict-Transport-Security"]) {
  if (!headers.includes(required)) failures.push(`missing security header: ${required}`);
}
if (headers.includes("unsafe-inline")) failures.push("CSP allows inline execution");
const app = fs.readFileSync(path.join(dist, "app.js"), "utf8");
for (const invariant of ["WEIGHT_TEST_COMING_SOON_MODE = false", "WEIGHT_TEST_ONE_TIME", "amount: 9900", "displayPrice: \"9,900₮\""]) {
  if (!app.includes(invariant)) failures.push(`protected invariant missing: ${invariant}`);
}
const allowedHosts = new Set(["jingeehas.fit", "merchant.qpay.mn", "www.w3.org", "connect.facebook.net", "www.facebook.com"]);
for (const match of publicText.matchAll(/https?:\/\/([^/\s"')]+)/g)) {
  const host = match[1].toLowerCase().replace(/[;,]+$/, "");
  if (!allowedHosts.has(host)) failures.push(`unapproved public domain: ${host}`);
}
const forbiddenName = String(process.env.CROSS_PROJECT_FORBIDDEN_TOKEN || "").trim();
if (forbiddenName && publicText.toLowerCase().includes(forbiddenName.toLowerCase())) failures.push("cross-project name found in production package");
if (distFiles.some(file => /(?:test|fixture|mock)/i.test(path.relative(dist, file)))) failures.push("test-only artifact included in production package");
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Production package verified (${distFiles.length} static files, ${(manifest.functionFiles || []).length} function files, ${REQUIRED_PRODUCTION_FUNCTIONS.length} required endpoints)`);
