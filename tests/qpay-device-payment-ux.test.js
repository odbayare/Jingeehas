const assert = require("assert");
const fs = require("fs");
const app = require("../app.js");

const { _internal } = app;
const appSource = fs.readFileSync("app.js", "utf8");
const stylesSource = fs.readFileSync("styles.css", "utf8");

function normalize(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function section(html, className) {
  const start = html.indexOf(className);
  assert(start >= 0, `${className} section should render`);
  const nextSurface = html.indexOf("qpay-reference", start);
  return html.slice(start, nextSurface > start ? nextSurface : undefined);
}

function withLocalStorageMutationSpy(fn) {
  const originalDescriptor = Object.getOwnPropertyDescriptor(global, "localStorage");
  const calls = [];

  Object.defineProperty(global, "localStorage", {
    configurable: true,
    value: {
      getItem(key) {
        calls.push(["getItem", key]);
        return null;
      },
      setItem(key, value) {
        calls.push(["setItem", key, value]);
      },
      removeItem(key) {
        calls.push(["removeItem", key]);
      }
    }
  });

  try {
    fn();
  } finally {
    if (originalDescriptor) {
      Object.defineProperty(global, "localStorage", originalDescriptor);
    } else {
      delete global.localStorage;
    }
  }

  assert.deepStrictEqual(
    calls.filter(([method]) => method === "setItem" || method === "removeItem"),
    [],
    "QPay device payment render must not mutate localStorage"
  );
}

assert(appSource.includes('oneTime: "9,900₮"'), "one-time label must remain 9,900₮");
assert(appSource.includes("const STANDARD_WEIGHT_PRICE_MNT = 9900;"), "standard price must remain 9900");
assert(appSource.includes("const WEIGHT_TEST_AMOUNT_MNT = 9900;"), "QPay amount must remain 9900");
assert(appSource.includes('const WEIGHT_TEST_PRODUCT_CODE = "WEIGHT_TEST_ONE_TIME";'), "product code must remain unchanged");
assert(appSource.includes('create: "https://www.lifepattern.live/.netlify/functions/qpay-create-invoice"'), "QPay create endpoint must remain unchanged");
assert(appSource.includes('check: "https://www.lifepattern.live/.netlify/functions/qpay-check-payment"'), "QPay check endpoint must remain unchanged");
assert(appSource.includes("function normalizeQpayAppLinks"), "QPay app links should be normalized from invoice data");

[
  "qpay-desktop-primary",
  "qpay-mobile-primary",
  "data-qpay-app-grid",
  "qpay-mobile-qr-toggle",
  "data-qpay-device-mode=\"desktop-qr-first\"",
  "data-qpay-device-mode=\"mobile-app-grid-first\""
].forEach(token => {
  assert(appSource.includes(token), `payment UI source should include ${token}`);
});

[
  ".qpay-desktop-primary",
  ".qpay-mobile-primary",
  ".qpay-app-grid",
  ".qpay-app-card",
  "(hover: none) and (pointer: coarse)",
  "(max-width: 640px)"
].forEach(token => {
  assert(stylesSource.includes(token), `responsive/class hook should include ${token}`);
});

withLocalStorageMutationSpy(() => {
  _internal.setTestState({
    packageType: "one-time",
    view: "oneTimeStart",
    oneTimePaid: false,
    sevenDayPaid: false,
    upgradePaid: false,
    qpayPayment: {
      status: "pending",
      message: "Төлбөр хүлээгдэж байна.",
      invoice: {
        qrImage: "abc123",
        senderInvoiceNo: "WT-9900-TEST",
        urls: [
          {
            name: "Khan Bank",
            link: "khanbank://qpay/pay",
            logo: "https://example.com/khan.png"
          },
          {
            description: "QPay wallet",
            deeplink: "qpay://invoice/test"
          }
        ]
      }
    },
    contactCapture: {
      name: "Test User",
      phone: "99119911",
      email: "",
      saved: true,
      message: "",
      copyStatus: ""
    },
    currentAssessmentId: null
  });

  const html = _internal.renderOneTimeStart();
  const text = normalize(html);
  const desktop = section(html, "qpay-desktop-primary");
  const mobile = section(html, "qpay-mobile-primary");

  assert(html.includes("WT-9900-TEST"), "invoice number should remain visible");
  assert(text.includes("Төлөх үнэ 9,900₮"), "price should remain visible near payment screen");
  assert(text.includes("Дахин шалгах"), "retry/check button should remain visible");
  assert(text.includes("Буцах"), "back button should remain visible");

  assert(desktop.indexOf("qpay-qr qpay-qr-large") >= 0, "desktop should render large QR");
  assert(desktop.indexOf("qpay-qr qpay-qr-large") < desktop.indexOf("data-qpay-app-grid"), "desktop should be QR-first");

  assert(mobile.indexOf("data-qpay-app-grid") >= 0, "mobile should render app grid");
  assert(mobile.indexOf("data-qpay-app-grid") < mobile.indexOf("qpay-mobile-qr-toggle"), "mobile should be app-grid-first");
  assert(!mobile.includes("<details class=\"qpay-mobile-qr-toggle\" open"), "mobile QR should be collapsed by default");

  assert(html.includes('href="khanbank://qpay/pay"'), "Khan Bank link should come from invoice data");
  assert(html.includes('href="qpay://invoice/test"'), "QPay wallet link should come from invoice data");
  assert(html.includes("https://example.com/khan.png"), "provided logo should render from invoice data");
  assert(html.includes("qpay-app-logo-fallback"), "missing logo should use neutral fallback badge");
  assert(!html.includes("https://clever-souffle-1e5f74.netlify.app"), "old Netlify URL should not appear in payment UI");

  assert.strictEqual(_internal.canStartPaidAssessment("one-time"), false, "pending payment must not unlock assessment");
  assert.strictEqual(_internal.hasOneTimeReportAccess(), false, "pending payment must not grant one-time access");
  assert(!text.includes("Тест эхлүүлэх"), "pending payment screen must not show start test CTA");

  [
    "internalDiagnostics",
    "ownerDebug",
    "runtimeGate",
    "fixtureName",
    "fake urgency",
    "limited seats"
  ].forEach(token => {
    assert(!html.includes(token), `payment UI should not leak ${token}`);
  });
});

console.log("qpay-device-payment-ux tests passed");
