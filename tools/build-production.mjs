import fs from "node:fs";
import path from "node:path";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const output = path.join(root, "dist");
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const file of ["index.html", "app.js", "questions.js", "styles.css", "_headers", "_redirects"]) fs.copyFileSync(path.join(root, file), path.join(output, file));
fs.cpSync(path.join(root, "assets"), path.join(output, "assets"), { recursive: true });
console.log("Production static package created in dist/");
