const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const planPath = path.join(root, "BACKEND_QPAY_INTEGRATION_PLAN.md");
const readmePath = path.join(root, "README.md");

assert(fs.existsSync(planPath), "BACKEND_QPAY_INTEGRATION_PLAN.md should exist");

const plan = fs.readFileSync(planPath, "utf8");
const readme = fs.readFileSync(readmePath, "utf8");

[
  "# Backend + QPay Integration Plan",
  "## 1. Current static state",
  "## 2. Target backend state",
  "## 3. Product/entitlement rules",
  "## 4. Data model",
  "## 5. API endpoints",
  "## 6. QPay invoice flow",
  "## 7. Frontend state migration",
  "## 8. Safety/paywall bypass rules",
  "## 9. Error/expiry handling",
  "## 10. Privacy/security notes",
  "## 11. Implementation phases",
  "## 12. Open questions"
].forEach(section => {
  assert(plan.includes(section), `plan should include section: ${section}`);
});

[
  "users / sessions",
  "assessments",
  "diary_entries",
  "reports",
  "payments",
  "entitlements"
].forEach(model => {
  assert(plan.includes(model), `plan should include data model: ${model}`);
});

[
  "one_time_report",
  "removed_feature_access",
  "upgrade_access",
  "professional_summary",
  "Mode 3",
  "Mode 4"
].forEach(rule => {
  assert(plan.includes(rule), `plan should include entitlement/safety rule: ${rule}`);
});

[
  "POST `/api/session/start`",
  "POST `/api/assessments`",
  "PATCH `/api/assessments/:id/answers`",
  "POST `/api/assessments/:id/complete`",
  "GET `/api/assessments/:id/report`",
  "POST `/api/diary/:assessment_id/entries`",
  "GET `/api/entitlements`",
  "POST `/api/payments/create`",
  "GET `/api/payments/:id/status`",
  "POST `/api/payments/qpay/webhook`"
].forEach(endpoint => {
  assert(plan.includes(endpoint), `plan should include endpoint: ${endpoint}`);
});

[
  "create invoice",
  "QR",
  "polls",
  "mark payment `paid`",
  "create entitlement",
  "expired"
].forEach(flowTerm => {
  assert(plan.includes(flowTerm), `plan should include QPay flow term: ${flowTerm}`);
});

[
  "Do not include sensitive answers in payment metadata",
  "Keep safety report accessible even if payment fails",
  "Avoid raw voice audio storage by default",
  "DEMO_MODE = true"
].forEach(copy => {
  assert(plan.includes(copy), `plan should include privacy/demo note: ${copy}`);
});

assert(readme.includes("BACKEND_QPAY_INTEGRATION_PLAN.md"), "README should link to backend QPay plan");

console.log("backend-qpay-plan tests passed");
