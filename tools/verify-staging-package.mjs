import nodeCrypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const staging = path.join(root, "staging");
execFileSync(process.execPath, ["tools/build-staging.mjs"], { cwd: root, stdio: "inherit" });
execFileSync(process.execPath, ["tools/verify-removed-product.mjs"], { cwd: root, stdio: "inherit" });
const manifest = JSON.parse(fs.readFileSync(path.join(root, "artifacts", "staging-package-manifest.json"), "utf8"));
const productionManifest = JSON.parse(fs.readFileSync(path.join(root, "artifacts", "production-package-manifest.json"), "utf8"));
const failures = [];
const actualFiles = [];
function walk(directory) { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) { const absolute = path.join(directory, entry.name); if (entry.isDirectory()) walk(absolute); else actualFiles.push(path.relative(staging, absolute)); } }
walk(staging);
actualFiles.sort();
const manifestFiles = manifest.files.map(item => item.file).sort();
if (JSON.stringify(actualFiles) !== JSON.stringify(manifestFiles)) failures.push("staging manifest file list is stale");
for (const item of manifest.files) {
  const actual = nodeCrypto.createHash("sha256").update(fs.readFileSync(path.join(staging, item.file))).digest("hex");
  if (actual !== item.sha256) failures.push(`hash mismatch: ${item.file}`);
}
const app = fs.readFileSync(path.join(staging, "site", "app.js"), "utf8");
const allowDisabled = process.env.STAGING_CERTIFICATION_ALLOW_COMING_SOON_DISABLED === "CERTIFIED STAGING ONLY";
if (!app.includes("WEIGHT_TEST_COMING_SOON_MODE = true") && !allowDisabled) failures.push("coming-soon mode is disabled without explicit staging certification configuration");
for (const invariant of ["WEIGHT_TEST_ONE_TIME", "amount: 9900", "displayPrice: \"9,900₮\""]) if (!app.includes(invariant)) failures.push(`protected invariant missing: ${invariant}`);
const requiredFunctions = productionManifest.serverFunctions;
for (const name of requiredFunctions) if (!manifest.functionNames.includes(name) || !fs.existsSync(path.join(staging, "netlify", "functions", `${name}.js`))) failures.push(`required function missing: ${name}`);
const headers = fs.readFileSync(path.join(staging, "site", "_headers"), "utf8");
for (const header of ["Content-Security-Policy", "Strict-Transport-Security", "Referrer-Policy", "X-Content-Type-Options", "Permissions-Policy", "frame-ancestors"]) if (!headers.includes(header)) failures.push(`security header missing: ${header}`);
if (headers.includes("unsafe-inline")) failures.push("security policy permits unsafe-inline");
const textFiles = actualFiles.filter(file => !/\.(?:png|jpg|jpeg|gif|webp)$/i.test(file));
const packageText = textFiles.map(file => fs.readFileSync(path.join(staging, file), "utf8")).join("\n");
for (const forbidden of ["mockBackend", "internalTest", "localStorage", "oneTimePaid", "MemoryDatabaseAdapter", "testProvider", "testDelivery", "feedback-export"]) if (packageText.includes(forbidden)) failures.push(`forbidden staging signal: ${forbidden}`);
if (actualFiles.some(file => /(?:^|\/)(?:tests?|fixtures?|docs?|audit)(?:\/|$)/i.test(file))) failures.push("test, fixture, documentation, or audit material included");
const forbiddenName = String(process.env.CROSS_PROJECT_FORBIDDEN_TOKEN || "").trim();
if (forbiddenName && packageText.toLowerCase().includes(forbiddenName.toLowerCase())) failures.push("cross-project name found in staging package");
const secretNames = ["JINGEEHAS_DATABASE_API_KEY", "QPAY_CLIENT_SECRET", "RECOVERY_ENCRYPTION_KEY", "RECOVERY_HASH_PEPPER", "RECOVERY_DELIVERY_API_KEY"];
for (const name of secretNames) { const value = String(process.env[name] || ""); if (value.length >= 12 && packageText.includes(value)) failures.push(`secret value embedded from ${name}`); }
const stagedQPay = require(path.join(staging, "netlify", "functions", "_lib", "qpay.js"));
const safe = stagedQPay.safeAppLinks([{ name: "bad", link: "javascript:alert(1)" }, { name: "data", link: "data:text/plain,x" }, { name: "good", link: "bankapp://pay/1" }], { allowedSchemes: ["bankapp"], allowedHosts: [] });
if (safe.length !== 1 || safe[0].name !== "good") failures.push("unsafe application schemes are accepted");
const store = fs.readFileSync(path.join(staging, "netlify", "functions", "_lib", "store.js"), "utf8");
if (/MemoryDatabaseAdapter|return\s+.*memory/i.test(store)) failures.push("database adapter can fall back to memory");
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`STAGING_PACKAGE_STATUS=PASS (${actualFiles.length} files, ${manifest.functionNames.length} functions, no deployment)`);
