"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const app = require("../app.js");
const { advisorStatusLabel } = require("../netlify/functions/_lib/advisor.js");
const { WEIGHT_TEST_COMING_SOON_MODE: serverComingSoonMode } = require("../netlify/functions/_lib/preview.js");

const root = path.resolve(__dirname, "..");
const publicFiles = ["index.html", "app.js", "questions.js"];
const publicSource = publicFiles.map(file => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
assert(!publicSource.includes("mockBackend.js"));
assert(!publicSource.includes("MockBackend"));
assert(!publicSource.includes("localStorage"));
assert(!publicSource.includes("internalTest"));
assert(!/window\.(?:markMockPaymentPaid|createEntitlementFromPayment|createCoachAccount|resetCoachPassword|setCoachStatus|getCoachDashboard|viewCoachReport|getMockBackendState|resetMockBackend)/.test(publicSource));
assert(!/\?invite=.*localStorage|localStorage.*invite/i.test(publicSource));
assert(!/advisorSessionToken|adminSessionToken/.test(publicSource));
assert.equal(app.money(9900), "9,900₮");
assert.equal(app.money(4000), "4,000₮");
assert.equal(advisorStatusLabel("consent_accepted"), "Зөвшөөрсөн");
assert.equal(advisorStatusLabel("pending"), "Хүлээгдэж байна");

const functions = fs.readdirSync(path.join(root, "netlify", "functions")).filter(file => file.endsWith(".js"));
const previewProtected = ["weight-session-start.js", "weight-safety-gate.js", "weight-recovery-contact-save.js", "weight-assessment-create.js", "weight-assessment-save.js", "weight-question-progress.js", "weight-assessment-complete.js", "weight-assessment-report.js", "weight-session-state.js", "weight-entitlements.js", "weight-recovery-request.js", "weight-recovery-confirm.js", "weight-data-deletion-request.js", "qpay-create-invoice.js", "qpay-check-payment.js", "advisor-invite-resolve.js", "advisor-consent.js"];
for (const required of previewProtected) {
  assert(functions.includes(required));
  assert(fs.readFileSync(path.join(root, "netlify", "functions", required), "utf8").includes("authenticateOwnerPreview"), `${required} must enforce server-side owner preview access`);
}
for (const required of ["admin-preview-start.js", "admin-preview-status.js", "admin-preview-revoke.js", "admin-session-state.js"]) assert(functions.includes(required));
const authSource = fs.readFileSync(path.join(root, "netlify", "functions", "_lib", "auth.js"), "utf8");
assert(authSource.includes("scrypt"));
assert(authSource.includes("HttpOnly"));
assert(authSource.includes("SameSite=Strict"));
assert.equal(app.WEIGHT_TEST_COMING_SOON_MODE, false);
assert.equal(serverComingSoonMode, app.WEIGHT_TEST_COMING_SOON_MODE, "browser and server launch gates must stay aligned");
app._test.setComingSoon(true);
for (const protectedRoute of ["/assessment/start", "/assessment/contact", "/assessment/questions", "/assessment/completed", "/assessment/payment"]) {
  assert(app.renderForPath(protectedRoute).includes("Тун удахгүй"), protectedRoute);
}
app._test.resetComingSoon();
assert(!app.renderForPath("/assessment/start").includes("Тун удахгүй"));
console.log("production security tests passed");
