import nodeCrypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "staging");
const manifestPath = path.join(root, "artifacts", "staging-package-manifest.json");
execFileSync(process.execPath, ["tools/build-production.mjs"], { cwd: root, stdio: "inherit" });
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.cpSync(path.join(root, "dist"), path.join(output, "site"), { recursive: true });
fs.cpSync(path.join(root, "netlify", "functions"), path.join(output, "netlify", "functions"), { recursive: true });
fs.copyFileSync(path.join(root, "questions.js"), path.join(output, "questions.js"));
fs.writeFileSync(path.join(output, "netlify.toml"), `[build]\n  publish = "site"\n  functions = "netlify/functions"\n\n[functions]\n  node_bundler = "esbuild"\n`);
const requiredEnvironment = [
  "JINGEEHAS_DATABASE_API_URL", "JINGEEHAS_DATABASE_API_KEY", "QPAY_API_BASE_URL", "QPAY_CLIENT_ID", "QPAY_CLIENT_SECRET", "QPAY_INVOICE_CODE",
  "QPAY_CALLBACK_ORIGIN", "QPAY_ALLOWED_APP_SCHEMES", "QPAY_ALLOWED_HTTPS_HOSTS", "RECOVERY_ENCRYPTION_KEY", "RECOVERY_HASH_PEPPER",
  "RECOVERY_DELIVERY_API_URL", "RECOVERY_DELIVERY_API_KEY", "RECOVERY_RATE_LIMIT_STORE"
];
fs.writeFileSync(path.join(output, "configuration.json"), `${JSON.stringify({ schemaVersion: 1, environment: "staging", comingSoon: true, requiredEnvironment }, null, 2)}\n`);

const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else files.push(path.relative(output, absolute));
  }
}
walk(output);
const sha256 = relative => nodeCrypto.createHash("sha256").update(fs.readFileSync(path.join(output, relative))).digest("hex");
const functionNames = fs.readdirSync(path.join(output, "netlify", "functions"), { withFileTypes: true }).filter(entry => entry.isFile() && entry.name.endsWith(".js")).map(entry => entry.name.replace(/\.js$/, "")).sort();
const manifest = { schemaVersion: 1, product: { code: "WEIGHT_TEST_ONE_TIME", amount: 9900, displayPrice: "9,900₮", comingSoon: true }, packageRoot: "staging", files: files.map(file => ({ file, sha256: sha256(file) })), functionNames };
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Staging package created (${files.length} files, ${functionNames.length} functions); no deployment performed`);
