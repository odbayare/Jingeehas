const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const startText = ["Тест", "эхлэх"].join(" ");

assert(appSource.includes("const WEIGHT_TEST_COMING_SOON_MODE = true;"), "coming soon flag must be enabled");
assert(appSource.includes('oneTime: "9,900₮"'), "one-time price label must remain 9,900₮");
assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
assert(appSource.includes('create: "/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint must remain unchanged");
assert(appSource.includes('check: "/.netlify/functions/qpay-check-payment"'), "QPay check endpoint must remain unchanged");

_internal.setTestState({
  internalTest: false,
  packageType: "one-time",
  view: "landing",
  oneTimePaid: false,
  sevenDayPaid: false,
  upgradePaid: false,
  contactCapture: {
    name: "Virtual QA",
    phone: "99000000",
    email: "",
    saved: true,
    message: "",
    copyStatus: ""
  },
  qpayPayment: { status: "idle", message: "", invoice: null }
});

assert.strictEqual(_internal.WEIGHT_TEST_COMING_SOON_MODE, true, "coming soon flag export must be true");
assert.strictEqual(_internal.isComingSoonModeActive(), true, "public mode must be coming soon");

const comingSoonText = normalize(_internal.renderComingSoon());
assert(comingSoonText.includes("Тун удахгүй"), "coming soon page must show status headline");
assert(comingSoonText.includes("төлбөр авахгүй"), "coming soon page must say payment is paused");
assert(comingSoonText.includes("QPay төлбөрийн QR энэ хуудсаас үүсэхгүй"), "coming soon page must say QPay QR is unavailable");
assert(!comingSoonText.includes(startText), "coming soon page must not show public start CTA");
assert(!comingSoonText.includes("createWeightQpayInvoice"), "coming soon page must not include QPay invoice action");
assert(!comingSoonText.includes("beginAssessment"), "coming soon page must not include assessment start action");

assert.strictEqual(_internal.beginAssessment("one-time"), false, "public beginAssessment must be blocked while coming soon is active");
assert.notStrictEqual(_internal.getTestState().view, "stage1", "coming soon must not enter questions");
assert.strictEqual(_internal.getTestState().view, "landing", "coming soon beginAssessment must return to landing");

_internal.setTestState({
  internalTest: false,
  packageType: "one-time",
  view: "oneTimeStart",
  contactCapture: {
    name: "Virtual QA",
    phone: "99000000",
    email: "",
    saved: true,
    message: "",
    copyStatus: ""
  },
  qpayPayment: { status: "idle", message: "", invoice: null }
});

Promise.resolve(_internal.createWeightQpayInvoice()).then(result => {
  assert.strictEqual(result, false, "public QPay invoice creation must be blocked while coming soon is active");
  assert.strictEqual(_internal.getTestState().qpayPayment.invoice, null, "coming soon must not create or store invoice data");
  assert.strictEqual(_internal.getTestState().view, "landing", "blocked QPay action must return to landing");
  console.log("coming-soon-mode tests passed");
}).catch(error => {
  console.error(error);
  process.exit(1);
});
