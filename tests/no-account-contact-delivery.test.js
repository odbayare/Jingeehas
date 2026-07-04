const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");
const mockBackend = require("../mockBackend.js");

const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");
const runAllSource = fs.readFileSync("tests/run-all.js", "utf8");

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function resetOneTime(overrides = {}) {
  mockBackend.resetMockBackend();
  _internal.setTestState({
    packageType: "one-time",
    view: "oneTimeStart",
    currentAssessmentId: null,
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    qpayPayment: { status: "idle", message: "", invoice: null },
    contactCapture: {
      name: "",
      phone: "",
      email: "",
      saved: false,
      message: "",
      copyStatus: ""
    },
    ...overrides
  });
}

assert(runAllSource.includes('["node", ["tests/no-account-contact-delivery.test.js"]]'), "WP57 test must be registered");

assert(appSource.includes('oneTime: "9,900₮"'), "one-time price label must remain 9,900₮");
assert(appSource.includes("const STANDARD_WEIGHT_PRICE_MNT = 9900;"), "standard price must remain 9900");
assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
assert(appSource.includes('create: "https://www.lifepattern.live/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint must remain unchanged");
assert(appSource.includes('check: "https://www.lifepattern.live/.netlify/functions/qpay-check-payment"'), "QPay check endpoint must remain unchanged");
assert(appSource.includes("if (!hasSavedContactInfo())"), "QPay invoice creation must be guarded by saved contact info");
assert(appSource.includes("copyCurrentReport"), "report copy control must exist");
assert(appSource.includes("printCurrentReport"), "report print control must exist");

resetOneTime();
const unpaidHtml = _internal.renderOneTimeStart();
const unpaidText = normalize(unpaidHtml);

assert(unpaidText.includes("Бүртгэл шаардлагагүй."), "no-account copy must appear before payment");
assert(
  unpaidText.includes("Төлбөр баталгаажсаны дараа тест нээгдэнэ. Тест бөглөсний дараа таны тайлан шууд дэлгэц дээр гарна."),
  "report-on-screen delivery copy must appear before payment"
);
assert(unpaidHtml.includes("data-contact-capture"), "contact capture must render before payment");
assert(unpaidText.includes("Утас эсвэл имэйлийн аль нэгийг бөглөхөд хангалттай."), "minimal contact requirement must be clear");
assert(!unpaidHtml.includes("createWeightQpayInvoice()"), "QPay invoice action must not render before contact is saved");
assert.strictEqual(_internal.hasSavedContactInfo(), false, "empty contact must not count as saved");
assert.strictEqual(_internal.canStartPaidAssessment("one-time"), false, "contact capture must not unlock paid test");

resetOneTime({
  contactCapture: {
    name: "Сорил Хэрэглэгч",
    phone: "99119911",
    email: "test@example.com",
    saved: true,
    message: "",
    copyStatus: ""
  }
});
const contactSavedHtml = _internal.renderOneTimeStart();
const contactSavedText = normalize(contactSavedHtml);

assert.strictEqual(_internal.hasSavedContactInfo(), true, "saved phone/email contact must be recognized");
assert(contactSavedHtml.includes("data-contact-summary"), "saved contact summary must render");
assert(contactSavedText.includes("Холбоо барих мэдээлэл хадгалагдсан"), "saved contact must be visible");
assert(contactSavedText.includes("99119911"), "saved phone must be visible for recovery/support");
assert(contactSavedHtml.includes("createWeightQpayInvoice()"), "QPay invoice action may render only after contact is saved");
assert(contactSavedText.includes("9,900₮ төлөөд бүрэн тайлангаа нээх"), "QPay CTA must keep the 9,900₮ price");
assert.strictEqual(_internal.canStartPaidAssessment("one-time"), false, "saved contact alone must not unlock paid test");

resetOneTime({
  oneTimePaid: true,
  view: "report",
  contactCapture: {
    name: "Сорил Хэрэглэгч",
    phone: "99119911",
    email: "test@example.com",
    saved: true,
    message: "",
    copyStatus: ""
  }
});
const reportHtml = _internal.renderReport();
const reportText = normalize(reportHtml);

assert(reportHtml.includes("data-report-output"), "paid report should expose a copy source");
assert(reportHtml.includes("data-report-delivery"), "paid report should include report delivery actions");
assert(reportText.includes("Таны тайлан энэ дэлгэц дээр гарлаа"), "report delivery should say the report is on screen");
assert(reportText.includes("Тайлан хуулж авах"), "copy report button must render");
assert(reportText.includes("Хэвлэх / PDF хадгалах"), "print/save as PDF button must render");
assert(reportText.includes("Дэмжлэг авахад хадгалсан мэдээлэл"), "saved contact should appear in report delivery UI");
assert(reportText.includes("test@example.com"), "saved email should appear for recovery/support");

[
  "баталгаатай турна",
  "сахилгагүй",
  "амжилтгүй",
  "хатуу дэглэм",
  "permanent report link",
  "имэйл илгээгдлээ",
  "бүртгэл үүсгэлээ"
].forEach(token => {
  assert(!reportText.includes(token), `WP57 UI must not include forbidden or fake-delivery copy: ${token}`);
});

console.log("no-account-contact-delivery tests passed");
