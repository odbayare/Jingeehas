const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const appSource = fs.readFileSync("app.js", "utf8");
const runAllSource = fs.readFileSync("tests/run-all.js", "utf8");
const { _internal } = app;

const requiredEvents = [
  "landing_viewed",
  "contact_submitted",
  "qpay_invoice_requested",
  "qpay_invoice_created",
  "payment_check_started",
  "payment_confirmed",
  "test_started",
  "test_completed",
  "report_generated",
  "report_copy_clicked",
  "report_print_clicked"
];

assert(runAllSource.includes('["node", ["tests/weight-funnel-event-tracking.test.js"]]'), "WP59 funnel tracking test must be registered");

assert(appSource.includes('const WEIGHT_TEST_FUNNEL_ENDPOINT = "https://www.lifepattern.live/.netlify/functions/track-funnel-event";'), "Weight funnel endpoint must point to LifePattern tracking function");
assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "Weight product code must remain unchanged");
assert(appSource.includes('oneTime: "9,900₮"'), "one-time price label must remain 9,900₮");
assert(appSource.includes("const STANDARD_WEIGHT_PRICE_MNT = 9900;"), "standard price must remain 9900");
assert(appSource.includes('create: "https://www.lifepattern.live/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint must remain unchanged");
assert(appSource.includes('check: "https://www.lifepattern.live/.netlify/functions/qpay-check-payment"'), "QPay check endpoint must remain unchanged");

for (const eventName of requiredEvents) {
  assert(appSource.includes(`"${eventName}"`), `Weight app must emit ${eventName}`);
}

assert.match(appSource, /trackWeightFunnelOnce\("landing_viewed"/, "landing view must be session-deduped");
assert.match(appSource, /trackWeightFunnelOnce\("payment_confirmed"/, "payment confirmed must be deduped per invoice");
assert.match(appSource, /trackWeightFunnelOnce\("report_generated"/, "report generated must be deduped per report");
assert.match(appSource, /trackWeightFunnelEvent\("report_copy_clicked"/, "report copy click must be tracked on real click");
assert.match(appSource, /trackWeightFunnelEvent\("report_print_clicked"/, "report print click must be tracked on real click");

const sanitized = _internal.safeWeightEventMetadata({
  email: "private@example.com",
  phone: "99119911",
  name: "Private User",
  rawAnswer: "sensitive answer",
  payment_session_id: "wt_session_123",
  amount_mnt: 9900,
  invoice_id_present: true
});

assert.equal(sanitized.product_code, "WEIGHT_TEST_ONE_TIME");
assert.equal(sanitized.product_label, "Илүүдэл жингээс салах тест үнэлгээ");
assert.equal(sanitized.amount_mnt, 9900);
assert.equal(sanitized.payment_session_id, "wt_session_123");
assert.equal(sanitized.invoice_id_present, true);
assert.equal(sanitized.email, undefined);
assert.equal(sanitized.phone, undefined);
assert.equal(sanitized.name, undefined);
assert.equal(sanitized.rawAnswer, undefined);

[
  "localStorage.setItem(STORAGE_KEY",
  "state.oneTimePaid = true",
  "canStartPaidAssessment",
  "state.qpayPayment?.status === \"paid\""
].forEach((invariant) => {
  assert(appSource.includes(invariant), `paid-first/payment invariant should remain present: ${invariant}`);
});

console.log("weight-funnel-event-tracking tests passed");
