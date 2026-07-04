const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");
const oldPrimaryCta = ["Тест", "үнэлгээг", "эхлүүлэх"].join(" ");
const testsSource = fs.readdirSync("tests")
  .filter(name => name.endsWith(".test.js"))
  .map(name => fs.readFileSync(`tests/${name}`, "utf8"))
  .join("\n");

const landingHtml = _internal.renderLanding();

assert(landingHtml.includes("Тест эхлэх"), "active public landing CTA must say Тест эхлэх");
assert(!landingHtml.includes(oldPrimaryCta), "active public landing must not render old CTA text");
assert(!appSource.includes(oldPrimaryCta), "app source must not contain old active CTA text");
assert(!testsSource.includes(oldPrimaryCta), "tests must not preserve old CTA expectation");

assert(appSource.includes('oneTime: "9,900₮"'), "one-time price label must remain 9,900₮");
assert(appSource.includes("const STANDARD_WEIGHT_PRICE_MNT = 9900;"), "standard price constant must remain 9900");
assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
assert(appSource.includes('create: "https://www.lifepattern.live/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint must remain unchanged");
assert(appSource.includes('check: "https://www.lifepattern.live/.netlify/functions/qpay-check-payment"'), "QPay check endpoint must remain unchanged");

assert(appSource.includes("function canStartPaidAssessment"), "paid-first gate helper must remain present");
assert(appSource.includes('state.qpayPayment?.status === "paid"'), "paid-first gate must still require confirmed paid state");

console.log("primary-cta-text tests passed");
