import nodeCrypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const staticRoot = path.join(root, "dist");
const functionRoot = path.join(root, ".generated-copy-hotfix", "netlify", "functions");
const output = path.join(staticRoot, "production-package-manifest.json");
const manifestFile = "production-package-manifest.json";

function walk(directory, base = directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute, base));
    else files.push(path.relative(base, absolute).split(path.sep).join("/"));
  }
  return files;
}

function sha256(absolute) {
  return nodeCrypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex");
}

function buildManifest() {
  if (!fs.existsSync(staticRoot)) throw new Error("dist/ is missing; run npm run build:production first");
  if (!fs.existsSync(functionRoot)) throw new Error("generated Netlify functions are missing; run npm run build:production first");

  const staticFiles = walk(staticRoot).filter(file => file !== manifestFile);
  const functionFiles = walk(functionRoot);
  const serverFunctions = fs.readdirSync(functionRoot, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith(".js"))
    .map(entry => entry.name.replace(/\.js$/, ""))
    .sort();

  return {
    schemaVersion: 2,
    product: { code: "WEIGHT_TEST_ONE_TIME", amount: 39000, displayPrice: "39,000₮", comingSoon: false },
    packageRoot: "dist",
    functionsRoot: ".generated-copy-hotfix/netlify/functions",
    staticFiles: staticFiles.map(file => ({ file, sha256: sha256(path.join(staticRoot, file)) })),
    serverFunctions,
    functionFiles: functionFiles.map(file => ({ file, sha256: sha256(path.join(functionRoot, file)) }))
  };
}

const expected = `${JSON.stringify(buildManifest(), null, 2)}\n`;
if (process.argv.includes("--check")) {
  if (!fs.existsSync(output) || fs.readFileSync(output, "utf8") !== expected) {
    console.error("Deployed production manifest is stale; rebuild the production package");
    process.exit(1);
  }
  console.log("Deployed production manifest verified");
} else {
  fs.writeFileSync(output, expected);
  console.log("Deployed production manifest generated");
}
