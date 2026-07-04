const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");
const stylesSource = fs.readFileSync("styles.css", "utf8");

const methodLabels = [
  "BCT",
  "CBT",
  "Emotional Eating",
  "Habit Loop",
  "Environmental Cue Analysis",
  "Self-Monitoring",
  "Sleep / Rhythm / Recovery",
  "Safety-First Screening"
];

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function assertForbiddenCopyAbsent(value, label) {
  const text = String(value || "").toLowerCase();
  [
    "баталгаатай турна",
    "оношилгоо",
    "эмчилгээ",
    "сахилгагүй",
    "амжилтгүй",
    "хатуу дэглэм"
  ].forEach(term => {
    assert(!text.includes(term.toLowerCase()), `${label}: forbidden copy present: ${term}`);
  });
}

assert(appSource.includes('oneTime: "9,900₮"'), "one-time display price must remain 9,900₮");
assert(appSource.includes("const STANDARD_WEIGHT_PRICE_MNT = 9900;"), "standard price constant must remain 9900");
assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
assert(appSource.includes('create: "https://www.lifepattern.live/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint must remain unchanged");
assert(appSource.includes('check: "https://www.lifepattern.live/.netlify/functions/qpay-check-payment"'), "QPay check endpoint must remain unchanged");
assert(appSource.includes("function canStartPaidAssessment"), "paid-first gate helper must remain present");
assert(appSource.includes('state.qpayPayment?.status === "paid"'), "pending QPay payment must not grant access");

const landingHtml = _internal.renderLanding();
const landing = normalize(landingHtml);

assert(landing.includes("Судалгаа, аргачлалын үндэс"), "research/method basis heading must appear on landing");
assert(
  landing.includes("Энэ тест нь илүүдэл жинг зөвхөн “сахилга бат”-тай холбож тайлбарлахгүй."),
  "research intro paragraph must appear"
);
assert(
  landing.includes("Тестийн бүтэц дараах аргачлалын чиглэлүүдэд тулгуурласан."),
  "method support sentence must appear"
);

methodLabels.forEach(label => {
  assert(landing.includes(label), `method label must appear: ${label}`);
});

assert(landing.indexOf("Судалгаа, аргачлалын үндэс") < landing.indexOf("Тайлан ямар харагдах вэ?"), "research section should appear before sample/payment exploration");
assert(!landing.includes("QPay"), "first landing page research section must be before payment/QPay flow");
assertForbiddenCopyAbsent(landingHtml, "landing research section");

assert(stylesSource.includes(".research-method-section"), "research section styles must exist");
assert(stylesSource.includes(".research-method-list"), "research method list styles must exist");
assert(stylesSource.includes("grid-template-columns: repeat(2, minmax(0, 1fr))"), "desktop research list should support compact two-column layout");
assert(stylesSource.includes(".research-method-list {\n    grid-template-columns: 1fr;"), "mobile research list should collapse to one column");

console.log("research-method-basis-section tests passed");
