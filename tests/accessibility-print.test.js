"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const app = require("../app.js");

const css = fs.readFileSync(require.resolve("../styles.css"), "utf8");
const html = fs.readFileSync(require.resolve("../index.html"), "utf8");
assert(css.includes("--text:"));
assert(css.includes("--primary:"));
assert(css.includes("@media print"));
assert(css.includes("#report-content"));
assert(css.includes("overflow-x: auto"));
assert(!/https?:\/\//.test(css));
assert(css.includes('url("assets/hero.svg")'));
assert(html.includes("skip-link"));
assert(!html.includes("<main id=\"app\""));

app._test.setComingSoon(false);
app._test.setState({ questionIndex: 5 });
const question = app.renderForPath("/assessment/questions");
assert(question.includes('role="progressbar"'));
assert(question.includes('aria-label="Тест бөглөх явц"'));
assert(question.includes("<fieldset>"));
assert(question.includes("<legend>"));
assert(question.includes('aria-describedby="question-error"'));
assert(!/<button[^>]*>\s*<input/i.test(question));
assert(!/\son(?:click|input|change)=/i.test(question));
assert(!question.includes("style="));
const previewStorageValues = new Map();
const previewStorage = {
  setItem(key, value) { previewStorageValues.set(key, value); },
  getItem(key) { return previewStorageValues.get(key) || null; },
  removeItem(key) { previewStorageValues.delete(key); }
};
app.saveAdminReportPreviewAssessment("wa_preview", previewStorage);
assert.equal(app.loadAdminReportPreviewAssessment(previewStorage), "wa_preview");
app.clearAdminReportPreviewAssessment(previewStorage);
assert.equal(app.loadAdminReportPreviewAssessment(previewStorage), "");
const appSource = fs.readFileSync(require.resolve("../app.js"), "utf8");
assert.match(appSource, /route === "report" && state\.ownerPreview[\s\S]*admin-report-preview/, "owner-preview report refresh must resolve the active report through the admin endpoint");
app._test.resetComingSoon();
console.log("accessibility and print tests passed");
