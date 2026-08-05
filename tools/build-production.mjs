import fs from "node:fs";
import path from "node:path";
import { applyMongolianCopyHotfixRuntime } from "./apply-mongolian-copy-hotfix-runtime.mjs";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const generatedRoot = path.join(root, ".generated-copy-hotfix");
const output = path.join(root, "dist");

fs.rmSync(generatedRoot, { recursive: true, force: true });
fs.mkdirSync(path.join(generatedRoot, "netlify"), { recursive: true });
fs.copyFileSync(path.join(root, "app.js"), path.join(generatedRoot, "app.js"));
fs.copyFileSync(path.join(root, "questions.js"), path.join(generatedRoot, "questions.js"));
fs.cpSync(path.join(root, "netlify", "functions"), path.join(generatedRoot, "netlify", "functions"), { recursive: true });
applyMongolianCopyHotfixRuntime(generatedRoot);

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const file of ["index.html", "meta-pixel.js", "styles.css", "_headers", "_redirects"]) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}
for (const file of ["app.js", "questions.js"]) {
  fs.copyFileSync(path.join(generatedRoot, file), path.join(output, file));
}
fs.cpSync(path.join(root, "assets"), path.join(output, "assets"), { recursive: true });
console.log("Production static package and patched Netlify functions created.");