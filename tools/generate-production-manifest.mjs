import nodeCrypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const output = path.join(root, "artifacts", "production-package-manifest.json");
const staticFiles = ["_headers", "_redirects", "app.js", "assets/favicon.svg", "assets/hero.svg", "assets/social-preview.png", "index.html", "questions.js", "styles.css"];
const functions = fs.readdirSync(path.join(root, "netlify", "functions"), { withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name.endsWith(".js"))
  .map(entry => entry.name.replace(/\.js$/, ""))
  .sort();
const sha256 = relative => nodeCrypto.createHash("sha256").update(fs.readFileSync(path.join(root, relative))).digest("hex");
const manifest = {
  schemaVersion: 1,
  product: { code: "WEIGHT_TEST_ONE_TIME", amount: 9900, displayPrice: "9,900₮", comingSoon: true },
  staticFiles: staticFiles.map(file => ({ file, sha256: sha256(file) })),
  serverFunctions: functions
};
const expected = `${JSON.stringify(manifest, null, 2)}\n`;

if (process.argv.includes("--check")) {
  if (!fs.existsSync(output) || fs.readFileSync(output, "utf8") !== expected) {
    console.error("Production manifest is stale; run npm run generate:artifacts");
    process.exit(1);
  }
  console.log("Production manifest verified");
} else {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, expected);
  console.log("Current production manifest generated");
}
