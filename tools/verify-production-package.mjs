import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
execFileSync(process.execPath, ["tools/build-production.mjs"], { cwd: root, stdio: "inherit" });
execFileSync(process.execPath, ["tools/verify-removed-product.mjs"], { cwd: root, stdio: "inherit" });

const requiredFunctions = ["weight-session-start", "weight-safety-gate", "weight-recovery-contact-save", "weight-assessment-create", "weight-assessment-save", "weight-assessment-complete", "weight-assessment-report", "weight-session-state", "weight-entitlements", "weight-recovery-request", "weight-recovery-confirm", "qpay-create-invoice", "qpay-check-payment", "advisor-login", "advisor-dashboard", "advisor-report", "admin-login"];
const failures = [];
for (const name of requiredFunctions) if (!fs.existsSync(path.join(root, "netlify", "functions", `${name}.js`))) failures.push(`missing function: ${name}`);
const distFiles = [];
function walk(directory) { for (const entry of fs.readdirSync(directory, { withFileTypes: true })) { const absolute = path.join(directory, entry.name); if (entry.isDirectory()) walk(absolute); else distFiles.push(absolute); } }
walk(path.join(root, "dist"));
const publicText = distFiles.filter(file => !file.endsWith(".png")).map(file => fs.readFileSync(file, "utf8")).join("\n");
for (const forbidden of ["mockBackend.js", "MockBackend", "internalTest", "localStorage", "oneTimePaid", "feedback-export"]) if (publicText.includes(forbidden)) failures.push(`forbidden public signal: ${forbidden}`);
const headers = fs.readFileSync(path.join(root, "dist", "_headers"), "utf8");
for (const required of ["Content-Security-Policy", "Referrer-Policy", "X-Content-Type-Options", "frame-ancestors", "Permissions-Policy", "Strict-Transport-Security"]) if (!headers.includes(required)) failures.push(`missing security header: ${required}`);
if (headers.includes("unsafe-inline")) failures.push("CSP allows inline execution");
const app = fs.readFileSync(path.join(root, "dist", "app.js"), "utf8");
for (const invariant of ["WEIGHT_TEST_COMING_SOON_MODE = true", "WEIGHT_TEST_ONE_TIME", "amount: 9900", "displayPrice: \"9,900₮\""]) if (!app.includes(invariant)) failures.push(`protected invariant missing: ${invariant}`);
const allowedHosts = new Set(["jingeehas.mn", "merchant.qpay.mn", "www.w3.org"]);
for (const match of publicText.matchAll(/https?:\/\/([^/\s"')]+)/g)) if (!allowedHosts.has(match[1].toLowerCase())) failures.push(`unapproved public domain: ${match[1]}`);
const forbiddenName = String(process.env.CROSS_PROJECT_FORBIDDEN_TOKEN || "").trim();
if (forbiddenName && publicText.toLowerCase().includes(forbiddenName.toLowerCase())) failures.push("cross-project name found in production package");
if (distFiles.some(file => /(?:test|fixture|mock)/i.test(path.relative(path.join(root, "dist"), file)))) failures.push("test-only artifact included in production package");
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Production package verified (${distFiles.length} files)`);
